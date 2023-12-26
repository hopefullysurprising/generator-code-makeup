export interface CompanyWideInformation {
  licenseTypes: LicenseTypes;
}

export enum PossibleLicenseFileNames {
  LICENSE_NO_EXTENSION = 'LICENSE',
  LICENSE_MD = 'LICENSE.md',
  LICENSE_TXT = 'LICENSE.txt',
};

const LGPL_3_0: DistributionLicense = {
  name: 'LGPL-3.0',
  licenseFileName: PossibleLicenseFileNames.LICENSE_MD,
  licenseFileTemplatePath: 'licenses/LGPL-3.0.md',
}

const UNLICENSED: DistributionLicense = {
  name: 'UNLICENSED',
}

export const COMPANY_WIDE_INFORMATION: CompanyWideInformation = {
  licenseTypes: {
    openSource: LGPL_3_0,
    proprietary: UNLICENSED,
  },
};

interface LicenseTypes {
  openSource: DistributionLicense;
  proprietary: DistributionLicense;
}

interface DistributionLicense {
  name: string;
  licenseFileName?: PossibleLicenseFileNames;
  licenseFileTemplatePath?: string;
}
