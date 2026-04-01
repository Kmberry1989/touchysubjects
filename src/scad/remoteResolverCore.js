import { parseIncludeDependencies } from './parser.js';

export function normalizePath(value) {
  const normalized = String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '');

  const parts = [];
  for (const part of normalized.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') {
      parts.pop();
      continue;
    }
    parts.push(part);
  }

  return parts.join('/');
}

export function fileNameFromPath(value) {
  const normalized = normalizePath(value);
  const parts = normalized.split('/');
  return parts[parts.length - 1] || 'main.scad';
}

export function displayNameFromPath(value) {
  return fileNameFromPath(value)
    .replace(/\.scad$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeGitHubUrl(value) {
  let url;
  try {
    url = new URL(String(value || '').trim());
  } catch {
    return null;
  }

  if (url.hostname === 'github.com') {
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length >= 5 && parts[2] === 'blob') {
      const [owner, repo, , ref, ...rest] = parts;
      const path = rest.join('/');
      return {
        provider: 'github',
        owner,
        repo,
        ref,
        path,
        rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`,
        htmlUrl: url.toString()
      };
    }
  }

  if (url.hostname === 'raw.githubusercontent.com') {
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length >= 4) {
      const [owner, repo, ref, ...rest] = parts;
      const path = rest.join('/');
      return {
        provider: 'github',
        owner,
        repo,
        ref,
        path,
        rawUrl: url.toString(),
        htmlUrl: `https://github.com/${owner}/${repo}/blob/${ref}/${path}`
      };
    }
  }

  return null;
}

export function toRawGitHubUrl({ owner, repo, ref, path }) {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`;
}

function isUrlLike(value) {
  return /^https?:\/\//i.test(String(value || '').trim());
}

export function normalizeRemoteSpecifier(input, { packageRegistry = {} } = {}) {
  const value = String(input || '').trim();
  if (!value) {
    throw new Error('Enter a package id or remote .scad URL.');
  }

  if (!isUrlLike(value)) {
    const pkg = packageRegistry[value];
    if (!pkg) {
      throw new Error(`Unknown remote package id: ${value}`);
    }
    return {
      kind: 'package',
      packageId: value,
      label: pkg.label ?? value,
      sourceUrl: pkg.url
    };
  }

  return {
    kind: 'url',
    packageId: null,
    label: null,
    sourceUrl: value
  };
}

async function lockGitHubRef(details, fetchImpl) {
  if (!details) return null;
  if (/^[0-9a-f]{40}$/i.test(details.ref)) {
    return {
      provider: 'github',
      repo: `${details.owner}/${details.repo}`,
      ref: details.ref,
      commit: details.ref
    };
  }

  const apiUrl = `https://api.github.com/repos/${details.owner}/${details.repo}/commits/${details.ref}`;

  try {
    const response = await fetchImpl(apiUrl, {
      headers: {
        Accept: 'application/vnd.github+json'
      }
    });
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);
    const payload = await response.json();
    const commit = typeof payload?.sha === 'string' ? payload.sha : details.ref;
    return {
      provider: 'github',
      repo: `${details.owner}/${details.repo}`,
      ref: details.ref,
      commit
    };
  } catch {
    return {
      provider: 'github',
      repo: `${details.owner}/${details.repo}`,
      ref: details.ref,
      commit: details.ref
    };
  }
}

function virtualPathFromUrl(url) {
  const github = normalizeGitHubUrl(url);
  if (github?.path) return normalizePath(github.path);

  const parsed = new URL(url);
  return normalizePath(parsed.pathname);
}

function frameworkDependencyDescriptor(dep, frameworkRegistry) {
  const normalized = normalizePath(dep);
  const [frameworkId, ...rest] = normalized.split('/');
  if (!frameworkId || rest.length === 0) return null;
  const framework = frameworkRegistry[frameworkId];
  if (!framework) return null;
  return {
    frameworkId,
    framework,
    relativePath: rest.join('/'),
    virtualPath: normalized
  };
}

function resolveDependencyTarget(dep, current, frameworkRegistry) {
  const frameworkDep = frameworkDependencyDescriptor(dep, frameworkRegistry);
  if (frameworkDep) {
    const ref = frameworkDep.framework.defaultRef || 'master';
    const [owner, repo] = frameworkDep.framework.repo.split('/');
    return {
      url: toRawGitHubUrl({
        owner,
        repo,
        ref,
        path: frameworkDep.relativePath
      }),
      virtualPath: frameworkDep.virtualPath,
      frameworkId: frameworkDep.frameworkId
    };
  }

  const nextUrl = new URL(dep, current.url).toString();
  return {
    url: nextUrl,
    virtualPath: virtualPathFromUrl(nextUrl),
    frameworkId: null
  };
}

async function fetchText(url, fetchImpl) {
  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: HTTP ${response.status}`);
  }
  return response.text();
}

export async function resolveRemoteModel(
  input,
  {
    fetchImpl = fetch,
    packageRegistry = {},
    frameworkRegistry = {},
    localLibraryPaths = []
  } = {}
) {
  const specifier = normalizeRemoteSpecifier(input, { packageRegistry });
  const githubDetails = normalizeGitHubUrl(specifier.sourceUrl);
  const lockedRef = await lockGitHubRef(githubDetails, fetchImpl);

  const entryUrl =
    githubDetails && lockedRef?.commit
      ? toRawGitHubUrl({ ...githubDetails, ref: lockedRef.commit })
      : githubDetails?.rawUrl ?? specifier.sourceUrl;

  const entryFileName =
    githubDetails?.path ?? normalizePath(new URL(entryUrl).pathname) ?? 'main.scad';
  const seen = new Set();
  const queue = [
    {
      url: entryUrl,
      virtualPath: normalizePath(entryFileName),
      lockedRef
    }
  ];
  const sourceFiles = new Map();
  const diagnostics = [];
  const localLibraries = new Set(localLibraryPaths.map((value) => normalizePath(value)));
  const frameworksUsed = new Set();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || seen.has(current.virtualPath)) continue;
    seen.add(current.virtualPath);

    const source = await fetchText(current.url, fetchImpl);
    sourceFiles.set(current.virtualPath, source);

    for (const dep of parseIncludeDependencies(source)) {
      const normalizedDep = normalizePath(dep);
      if (!normalizedDep || localLibraries.has(normalizedDep)) continue;

      const target = resolveDependencyTarget(dep, current, frameworkRegistry);
      if (seen.has(target.virtualPath)) continue;

      if (target.frameworkId) {
        frameworksUsed.add(target.frameworkId);
      }

      queue.push({
        url: target.url,
        virtualPath: target.virtualPath,
        lockedRef
      });
    }
  }

  diagnostics.push(`Resolved ${sourceFiles.size} file(s) from remote source.`);

  return {
    id: `remote:${specifier.packageId ?? specifier.sourceUrl}`,
    entryFileName: normalizePath(entryFileName),
    entrySource: sourceFiles.get(normalizePath(entryFileName)) ?? '',
    fileName: fileNameFromPath(entryFileName),
    displayName: specifier.label ?? displayNameFromPath(entryFileName),
    sourceUrl: specifier.sourceUrl,
    packageId: specifier.packageId,
    lockedRef,
    sourceFiles: Array.from(sourceFiles.entries()).map(([path, content]) => ({
      path,
      content
    })),
    dependencySummary: {
      totalFiles: sourceFiles.size,
      frameworks: Array.from(frameworksUsed)
    },
    diagnostics,
    lastResolvedAt: new Date().toISOString()
  };
}
