export enum NotImportedNpmPackage {
  // Unit testing
  TS_JEST = 'ts-jest',
}

export enum NpmPackage {
  // Project base
  TYPESCRIPT = 'typescript',

  // Unit testing
  JEST = 'jest',
  SWC_CORE = '@swc/core',
  SWC_JEST = '@swc/jest',
}

const PACKAGE_VERSIONS: Record<NpmPackage, string> = {
  // Project base
  [NpmPackage.TYPESCRIPT]: '5.3.3', // From 2023-12-19

  // Unit testing
  [NpmPackage.JEST]: '29.7.0', // From 2023-12-19
  [NpmPackage.SWC_CORE]: '1.3.101', // From 2023-12-24
  [NpmPackage.SWC_JEST]: '0.2.29', // From 2023-12-24
}

export function getDependencyInfoForInstalling(
  packageName: NpmPackage,
): { [key in NpmPackage]?: string } {
  return {
    [packageName]: PACKAGE_VERSIONS[packageName],
  };
}