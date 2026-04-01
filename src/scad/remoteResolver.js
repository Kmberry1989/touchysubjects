import { getFrameworkRegistry, getRemotePackageRegistry } from './remoteRegistry.js';
import { resolveRemoteModel as resolveRemoteModelCore } from './remoteResolverCore.js';
import { getVendorLibraryPaths } from './sourceRegistry.js';

export async function resolveRemoteModel(input, options = {}) {
  return resolveRemoteModelCore(input, {
    packageRegistry: getRemotePackageRegistry(),
    frameworkRegistry: getFrameworkRegistry(),
    localLibraryPaths: getVendorLibraryPaths(),
    ...options
  });
}
