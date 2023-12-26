// src/generators/feature-initiate-npm-package/index.ts
import Generator from "yeoman-generator";

// src/constants/companyWideInformation.ts
var PossibleLicenseFileNames = /* @__PURE__ */ ((PossibleLicenseFileNames2) => {
  PossibleLicenseFileNames2["LICENSE_NO_EXTENSION"] = "LICENSE";
  PossibleLicenseFileNames2["LICENSE_MD"] = "LICENSE.md";
  PossibleLicenseFileNames2["LICENSE_TXT"] = "LICENSE.txt";
  return PossibleLicenseFileNames2;
})(PossibleLicenseFileNames || {});
var LGPL_3_0 = {
  name: "LGPL-3.0",
  licenseFileName: "LICENSE.md" /* LICENSE_MD */,
  licenseFileTemplatePath: "licenses/LGPL-3.0.md"
};
var UNLICENSED = {
  name: "UNLICENSED"
};
var COMPANY_WIDE_INFORMATION = {
  licenseTypes: {
    openSource: LGPL_3_0,
    proprietary: UNLICENSED
  }
};

// src/utilities/templatePathUtilities.ts
function getUnambiguousTemplatePath(generator, templatePath) {
  const rawPath = generator.templatePath(templatePath);
  const paths = rawPath.split(":");
  return paths.find((path2) => path2.includes(templatePath)) || rawPath;
}

// src/utilities/loggingUtilities.ts
import chalk from "chalk";
function logInfoMessage(generator, message) {
  generator.log(
    getGeneratorHeader(generator.description)
  );
  generator.log(
    getInfoMessage(message)
  );
}
function getGeneratorHeader(description) {
  return chalk.italic.whiteBright(description ? ` ${description}` : "Unknown generator");
}
function getInfoMessage(message) {
  const formattedMessageLines = message.trim().split("\n").map((line) => line.trim()).filter((line) => line);
  formattedMessageLines.unshift("");
  formattedMessageLines.push("");
  const formattedMessage = formattedMessageLines.join("\n");
  return chalk.green(formattedMessage);
}

// src/utilities/configurationUtilities.ts
import os from "os";
import path from "path";
import fs from "fs";

// src/utilities/configurationKeys.ts
var CONFIGURATION_KEYS_INFO = {
  // Profile configuration keys.
  ["author.name" /* AUTHOR_NAME */]: {
    promptType: "input" /* INPUT */,
    promptMessage: "Input your name for 'author.name' field",
    storageType: "profile" /* PROFILE */
  },
  ["author.email" /* AUTHOR_EMAIL */]: {
    promptType: "input" /* INPUT */,
    promptMessage: "Input your email for 'author.email' field",
    storageType: "profile" /* PROFILE */
  },
  ["author.url" /* AUTHOR_URL */]: {
    promptType: "input" /* INPUT */,
    promptMessage: "Input your URL for 'author.url' field",
    storageType: "profile" /* PROFILE */
  },
  // Project configuration keys.
  ["codeDistributionType" /* CODE_DISTRIBUTION_TYPE */]: {
    promptType: "list" /* LIST */,
    promptMessage: "What is the code distribution type for this project?",
    storageType: "project" /* PROJECT */,
    choices: [
      {
        name: "Open source",
        value: "openSource" /* OPEN_SOURCE */
      },
      {
        name: "Proprietary",
        value: "proprietary" /* PROPRIETARY */
      }
    ]
  },
  // Package.json configuration keys.
  ["package.name" /* PACKAGE_NAME */]: {
    promptType: "input" /* INPUT */,
    promptMessage: "Input your project name",
    storageType: "packageJson" /* PACKAGE_JSON */,
    packageJsonKeyPath: "name"
  }
};

// src/utilities/configurationUtilities.ts
async function getConfigurationValue(generator, configurationKey) {
  const configurationValueSettings = CONFIGURATION_KEYS_INFO[configurationKey];
  switch (configurationValueSettings.storageType) {
    case "none" /* NONE */:
      return await getPromptValue(
        generator,
        configurationKey,
        configurationValueSettings
      );
    case "profile" /* PROFILE */:
      return await getProfileConfigurationValue(
        generator,
        configurationKey,
        configurationValueSettings
      );
    case "packageJson" /* PACKAGE_JSON */:
      return await getPackageJsonConfigurationValue(
        generator,
        configurationKey,
        configurationValueSettings
      );
    case "project" /* PROJECT */:
      return await getProjectConfigurationValue(
        generator,
        configurationKey,
        configurationValueSettings
      );
  }
}
async function getPromptValue(generator, name, promptSettings) {
  const promptResult = await generator.prompt({
    type: promptSettings.promptType,
    name,
    message: promptSettings.promptMessage,
    choices: promptSettings.promptType === "list" /* LIST */ ? promptSettings.choices : void 0
  });
  return promptResult[name];
}
async function getProfileConfigurationValue(generator, configurationKey, promptSettings) {
  const currentProfileConfiguration = getGeneratorSystemConfiguration(generator);
  if (currentProfileConfiguration[configurationKey]) {
    return currentProfileConfiguration[configurationKey];
  }
  const promptResult = await getPromptValue(generator, configurationKey, promptSettings);
  currentProfileConfiguration[configurationKey] = promptResult;
  writeGeneratorSystemConfiguration(currentProfileConfiguration);
  return promptResult;
}
async function getPackageJsonConfigurationValue(generator, configurationKey, settings) {
  const currentPackageJsonValue = generator.packageJson.get(settings.packageJsonKeyPath);
  if (currentPackageJsonValue) {
    return currentPackageJsonValue;
  }
  const promptResult = await getPromptValue(generator, configurationKey, settings);
  generator.packageJson.set(settings.packageJsonKeyPath, promptResult);
  generator.packageJson.save();
  return promptResult;
}
async function getProjectConfigurationValue(generator, configurationKey, promptSettings) {
  const currentConfig = generator.config.get(configurationKey);
  if (currentConfig) {
    return currentConfig;
  }
  const promptResult = await getPromptValue(generator, configurationKey, promptSettings);
  generator.config.set(configurationKey, promptResult);
  return promptResult;
}
var PROFILES_FOLDER = ".code_generator_profiles";
var DEFAULT_PROFILE_NAME = "default.json";
function getGeneratorSystemConfiguration(generator) {
  const homeDirectory = os.homedir();
  const profilesFolderPath = path.join(homeDirectory, PROFILES_FOLDER);
  if (!fs.existsSync(profilesFolderPath) || !fs.lstatSync(profilesFolderPath).isDirectory()) {
    fs.mkdirSync(profilesFolderPath);
  }
  const defaultProfilePath = path.join(profilesFolderPath, DEFAULT_PROFILE_NAME);
  if (!fs.existsSync(defaultProfilePath) || !fs.lstatSync(defaultProfilePath).isFile()) {
    fs.writeFileSync(defaultProfilePath, "{}");
    logInfoMessage(generator, `
      Created ${defaultProfilePath} for storing system-wide configuration.
      Please, enable backup of this file in your backup software for smooth update experience.
    `);
  }
  const fileContent = fs.readFileSync(defaultProfilePath, "utf8");
  return JSON.parse(fileContent);
}
function writeGeneratorSystemConfiguration(newValue) {
  const homeDirectory = os.homedir();
  const profilesFolderPath = path.join(homeDirectory, PROFILES_FOLDER);
  const defaultProfilePath = path.join(profilesFolderPath, DEFAULT_PROFILE_NAME);
  fs.writeFileSync(defaultProfilePath, JSON.stringify(newValue));
}

// src/generators/feature-initiate-npm-package/index.ts
var feature_initiate_npm_package_default = class extends Generator {
  description = "Initiate NPM package";
  generatorInfo = {
    packageJsonExists: false
  };
  initializing() {
    this.generatorInfo.packageJsonExists = this.packageJson.existed;
  }
  async prompting() {
    this.generatorInfo.packageName = await getConfigurationValue(this, "package.name" /* PACKAGE_NAME */);
    this.generatorInfo.codeDistributionType = await getConfigurationValue(this, "codeDistributionType" /* CODE_DISTRIBUTION_TYPE */);
    this.generatorInfo.authorName = await getConfigurationValue(this, "author.name" /* AUTHOR_NAME */);
    this.generatorInfo.authorEmail = await getConfigurationValue(this, "author.email" /* AUTHOR_EMAIL */);
    this.generatorInfo.authorUrl = await getConfigurationValue(this, "author.url" /* AUTHOR_URL */);
  }
  async initiatePackageJsonIfNeeded() {
    if (!this.generatorInfo?.packageJsonExists) {
      this.packageJson.writeContent({});
      logInfoMessage(this, "Created package.json");
    }
  }
  updateProjectNameIfNeeded() {
    const currentName = this.packageJson.get("name");
    if (currentName !== this.generatorInfo?.packageName) {
      this.packageJson.set("name", this.generatorInfo?.packageName);
      logInfoMessage(this, 'Updated "name" field in package.json');
    }
  }
  updateLicenseIfNeeded() {
    const currentLicense = this.packageJson.get("license");
    const codeDistributionType = this.generatorInfo.codeDistributionType;
    if (!codeDistributionType) {
      throw new Error("Code distribution type is not set");
    }
    const neededLicense = COMPANY_WIDE_INFORMATION.licenseTypes[codeDistributionType];
    if (currentLicense !== neededLicense.name) {
      this.packageJson.set("license", neededLicense.name);
      logInfoMessage(this, `
        Updated "license" field in package.json: from "${currentLicense}" to "${neededLicense.name}" as required by the project template
      `);
    }
    if (neededLicense.licenseFileName) {
      if (!neededLicense.licenseFileTemplatePath) {
        throw new Error(`License file template path is not set for license type "${neededLicense.name}"`);
      }
      const licenseFilePath = this.destinationPath(neededLicense.licenseFileName);
      const currentLicenseText = this.fs.exists(licenseFilePath) ? this.fs.read(licenseFilePath) : void 0;
      const licensePath = getUnambiguousTemplatePath(this, neededLicense.licenseFileTemplatePath);
      const neededLicenseText = this.fs.read(licensePath);
      if (currentLicenseText !== neededLicenseText) {
        this.fs.copyTpl(
          this.templatePath(neededLicense.licenseFileTemplatePath),
          this.destinationPath(neededLicense.licenseFileName)
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
    let currentAuthor = this.packageJson.get("author");
    if (!currentAuthor || typeof currentAuthor !== "object" || currentAuthor instanceof Array) {
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
    this.packageJson.set("author", currentAuthor);
  }
};
export {
  feature_initiate_npm_package_default as default
};
