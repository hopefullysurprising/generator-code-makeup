import Generator from 'yeoman-generator';

import { CodeDistributionType } from '../../constants/projectWideInformation';
import { COMPANY_WIDE_INFORMATION, PossibleLicenseFileNames } from '../../constants/companyWideInformation';
import { getUnambiguousTemplatePath } from '../../utilities/templatePathUtilities';
import { logInfoMessage } from '../../utilities/loggingUtilities';
import { getConfigurationValue } from '../../utilities/configurationUtilities';
import { ConfigurationKey } from '../../utilities/configurationKeys';

interface NpmPackageGeneratorInfo {
  packageJsonExists: boolean;
  packageName?: string;
  codeDistributionType?: CodeDistributionType;
  authorName?: string;
  authorEmail?: string;
  authorUrl?: string;
}

export default class extends Generator {

  description = 'Initiate NPM package';

  private generatorInfo: NpmPackageGeneratorInfo = {
    packageJsonExists: false,
  };

  initializing() {
    this.generatorInfo.packageJsonExists = this.packageJson.existed;
  }

  async prompting() {
    this.generatorInfo.packageName = await getConfigurationValue(this, ConfigurationKey.PACKAGE_NAME) as string;
    this.generatorInfo.codeDistributionType = await getConfigurationValue(this, ConfigurationKey.CODE_DISTRIBUTION_TYPE) as CodeDistributionType;
    this.generatorInfo.authorName = await getConfigurationValue(this, ConfigurationKey.AUTHOR_NAME) as string;
    this.generatorInfo.authorEmail = await getConfigurationValue(this, ConfigurationKey.AUTHOR_EMAIL) as string;
    this.generatorInfo.authorUrl = await getConfigurationValue(this, ConfigurationKey.AUTHOR_URL) as string;
  }

  async initiatePackageJsonIfNeeded() {
    if (!this.generatorInfo?.packageJsonExists) {
      this.packageJson.writeContent({});
      logInfoMessage(this, 'Created package.json');
    }
  }

  updateProjectNameIfNeeded() {
    const currentName = this.packageJson.get('name');
    if (currentName !== this.generatorInfo?.packageName) {
      this.packageJson.set('name', this.generatorInfo?.packageName);
      logInfoMessage(this, 'Updated "name" field in package.json');
    }
  }

  updateLicenseIfNeeded() {
    const currentLicense = this.packageJson.get('license');
    const codeDistributionType = this.generatorInfo.codeDistributionType;
    if (!codeDistributionType) {
      throw new Error('Code distribution type is not set');
    }
    const neededLicense = COMPANY_WIDE_INFORMATION.licenseTypes[codeDistributionType];
    if (currentLicense !== neededLicense.name) {
      this.packageJson.set('license', neededLicense.name);
      logInfoMessage(this, `
        Updated "license" field in package.json: from "${currentLicense}" to "${neededLicense.name}" as required by the project template
      `);
    }

    if (neededLicense.licenseFileName) {
      if (!neededLicense.licenseFileTemplatePath) {
        throw new Error(`License file template path is not set for license type "${neededLicense.name}"`);
      }
      const licenseFilePath = this.destinationPath(neededLicense.licenseFileName);
      const currentLicenseText = this.fs.exists(licenseFilePath)
        ? this.fs.read(licenseFilePath)
        : undefined;
      const licensePath = getUnambiguousTemplatePath(this, neededLicense.licenseFileTemplatePath);
      const neededLicenseText = this.fs.read(licensePath);
      if (currentLicenseText !== neededLicenseText) {
        this.fs.copyTpl(
          this.templatePath(neededLicense.licenseFileTemplatePath),
          this.destinationPath(neededLicense.licenseFileName),
        );
        logInfoMessage(this, `
          Updated "${neededLicense.licenseFileName}" file as required by the project template. See changes in Git
        `);
      }
    } else {
      for (const possibleLicenseFileName of Object.values(PossibleLicenseFileNames)) {
        const licenseFilePath = this.destinationPath(possibleLicenseFileName);
        if (this.fs.exists(licenseFilePath)) {
          this.fs.delete(licenseFilePath);
          logInfoMessage(this, `
            Deleted "${possibleLicenseFileName}" file as required by the project template. See changes in Git
          `);
        }
      }
    }
  }

  updateAuthorIfNeeded() {
    let currentAuthor = this.packageJson.get('author');
    if (!currentAuthor || typeof currentAuthor !== 'object' || currentAuthor instanceof Array) {
      currentAuthor = {};
    }

    const currentAuthorName = currentAuthor.name;
    if (currentAuthorName !== this.generatorInfo.authorName) {
      currentAuthor.name = this.generatorInfo.authorName;
      logInfoMessage(this, 'Updated "author.name" field in package.json');
    }
    
    const currentAuthorEmail = currentAuthor.email;
    if (currentAuthorEmail !== this.generatorInfo.authorEmail) {
      currentAuthor.email = this.generatorInfo.authorEmail;
      logInfoMessage(this, 'Updated "author.email" field in package.json');
    }

    const currentAuthorUrl = currentAuthor.url;
    if (currentAuthorUrl !== this.generatorInfo.authorUrl) {
      currentAuthor.url = this.generatorInfo.authorUrl;
      logInfoMessage(this, 'Updated "author.url" field in package.json');
    }

    this.packageJson.set('author', currentAuthor);
  }

};
