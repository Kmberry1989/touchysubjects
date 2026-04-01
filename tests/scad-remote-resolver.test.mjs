import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeGitHubUrl,
  normalizeRemoteSpecifier,
  resolveRemoteModel
} from '../src/scad/remoteResolverCore.js';

test('normalizeGitHubUrl converts github blob URLs into raw fetch metadata', () => {
  const normalized = normalizeGitHubUrl(
    'https://github.com/openscad/openscad/blob/master/examples/Parametric/sign.scad'
  );

  assert.deepEqual(normalized, {
    provider: 'github',
    owner: 'openscad',
    repo: 'openscad',
    ref: 'master',
    path: 'examples/Parametric/sign.scad',
    rawUrl:
      'https://raw.githubusercontent.com/openscad/openscad/master/examples/Parametric/sign.scad',
    htmlUrl: 'https://github.com/openscad/openscad/blob/master/examples/Parametric/sign.scad'
  });
});

test('normalizeRemoteSpecifier resolves package ids via package registry', () => {
  const specifier = normalizeRemoteSpecifier('openscad-sign', {
    packageRegistry: {
      'openscad-sign': {
        label: 'OpenSCAD Parametric Sign',
        url: 'https://github.com/openscad/openscad/blob/master/examples/Parametric/sign.scad'
      }
    }
  });

  assert.equal(specifier.kind, 'package');
  assert.equal(specifier.packageId, 'openscad-sign');
  assert.equal(specifier.label, 'OpenSCAD Parametric Sign');
});

test('resolveRemoteModel crawls nested includes and skips local vendored libraries', async () => {
  const packageRegistry = {
    'demo-model': {
      label: 'Demo Model',
      url: 'https://github.com/example/demo/blob/main/models/main.scad'
    }
  };

  const files = new Map([
    [
      'https://api.github.com/repos/example/demo/commits/main',
      JSON.stringify({ sha: '0123456789abcdef0123456789abcdef01234567' })
    ],
    [
      'https://raw.githubusercontent.com/example/demo/0123456789abcdef0123456789abcdef01234567/models/main.scad',
      'include <parts/helper.scad>\ninclude <MCAD/triangles.scad>\nuse <BOSL2/std.scad>\ncube(1);'
    ],
    [
      'https://raw.githubusercontent.com/example/demo/0123456789abcdef0123456789abcdef01234567/models/parts/helper.scad',
      'sphere(2);'
    ],
    ['https://raw.githubusercontent.com/BelfrySCAD/BOSL2/master/std.scad', 'cube(2);']
  ]);

  async function fetchImpl(url) {
    if (!files.has(url)) {
      return {
        ok: false,
        status: 404,
        async text() {
          return '';
        },
        async json() {
          return {};
        }
      };
    }

    const body = files.get(url);
    return {
      ok: true,
      status: 200,
      async text() {
        return body;
      },
      async json() {
        return JSON.parse(body);
      }
    };
  }

  const resolved = await resolveRemoteModel('demo-model', {
    fetchImpl,
    packageRegistry,
    frameworkRegistry: {
      BOSL2: {
        repo: 'BelfrySCAD/BOSL2',
        defaultRef: 'master'
      }
    },
    localLibraryPaths: ['MCAD/triangles.scad']
  });

  assert.equal(resolved.fileName, 'main.scad');
  assert.equal(resolved.lockedRef.commit, '0123456789abcdef0123456789abcdef01234567');
  assert.equal(resolved.sourceFiles.length, 3);
  assert.deepEqual(
    resolved.sourceFiles.map((file) => file.path).sort(),
    ['BOSL2/std.scad', 'models/main.scad', 'models/parts/helper.scad']
  );
  assert.deepEqual(resolved.dependencySummary.frameworks, ['BOSL2']);
});
