import packageData from '../data/scadRemotePackages.json';
import frameworkData from '../data/scadFrameworkRegistry.json';

export function getRemotePackageRegistry() {
  return packageData.packages ?? {};
}

export function getFrameworkRegistry() {
  return frameworkData.frameworks ?? {};
}
