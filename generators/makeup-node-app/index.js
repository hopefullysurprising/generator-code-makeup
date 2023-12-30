// src/generators/makeup-node-app/index.ts
import Generator5 from "yeoman-generator";

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
  return paths.find((path) => path.includes(templatePath)) || rawPath;
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

// src/utilities/configurationKeys.ts
var CONFIGURATION_KEYS_INFO = {
  // Profile configuration keys.
  ["author_name" /* AUTHOR_NAME */]: {
    promptType: "input" /* INPUT */,
    promptMessage: "Input your name for 'author.name' field",
    storageType: "profile" /* PROFILE */
  },
  ["author_email" /* AUTHOR_EMAIL */]: {
    promptType: "input" /* INPUT */,
    promptMessage: "Input your email for 'author.email' field",
    storageType: "profile" /* PROFILE */
  },
  ["author_url" /* AUTHOR_URL */]: {
    promptType: "input" /* INPUT */,
    promptMessage: "Input your URL for 'author.url' field",
    storageType: "profile" /* PROFILE */
  },
  // Project configuration keys.
  ["code_distribution_type" /* CODE_DISTRIBUTION_TYPE */]: {
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
  ["package_name" /* PACKAGE_NAME */]: {
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
async function getPromptValue(generator, name, promptSettings, storage) {
  const promptResult = await generator.prompt(
    {
      type: promptSettings.promptType,
      name,
      message: promptSettings.promptMessage,
      choices: promptSettings.promptType === "list" /* LIST */ ? promptSettings.choices : void 0
    },
    storage
  );
  return promptResult[name];
}
async function getProfileConfigurationValue(generator, configurationKey, promptSettings) {
  const promptResult = await getPromptValue(
    generator,
    configurationKey,
    promptSettings,
    generator._globalConfig
  );
  return promptResult;
}
async function getPackageJsonConfigurationValue(generator, configurationKey, settings) {
  const currentPackageJsonValue = generator.packageJson.get(settings.packageJsonKeyPath);
  if (currentPackageJsonValue) {
    return currentPackageJsonValue;
  }
  const promptResult = await getPromptValue(generator, configurationKey, settings);
  return promptResult;
}
async function getProjectConfigurationValue(generator, configurationKey, promptSettings) {
  const promptResult = await getPromptValue(
    generator,
    configurationKey,
    promptSettings,
    generator.config
  );
  return promptResult;
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
    this.generatorInfo.packageName = await getConfigurationValue(this, "package_name" /* PACKAGE_NAME */);
    this.generatorInfo.codeDistributionType = await getConfigurationValue(this, "code_distribution_type" /* CODE_DISTRIBUTION_TYPE */);
    this.generatorInfo.authorName = await getConfigurationValue(this, "author_name" /* AUTHOR_NAME */);
    this.generatorInfo.authorEmail = await getConfigurationValue(this, "author_email" /* AUTHOR_EMAIL */);
    this.generatorInfo.authorUrl = await getConfigurationValue(this, "author_url" /* AUTHOR_URL */);
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

// src/generators/feature-initiate-typescript/index.ts
import Generator2 from "yeoman-generator";

// src/utilities/dependenciesUtilities.ts
var PACKAGE_VERSIONS = {
  // Project base
  ["typescript" /* TYPESCRIPT */]: "5.3.3",
  // From 2023-12-19
  // Unit testing
  ["jest" /* JEST */]: "29.7.0",
  // From 2023-12-19
  ["@swc/core" /* SWC_CORE */]: "1.3.101",
  // From 2023-12-24
  ["@swc/jest" /* SWC_JEST */]: "0.2.29"
  // From 2023-12-24
};
function getDependencyInfoForInstalling(packageName) {
  return {
    [packageName]: PACKAGE_VERSIONS[packageName]
  };
}

// src/constants/serviceFileNamesAndPaths.ts
var GIT_KEEP_FILE_NAME = ".gitkeep";

// src/generators/feature-initiate-typescript/index.ts
var TYPESCRIPT_MODULE = "es2022";
var TYPESCRIPT_MODULE_RESOLUTION = "bundler";
var TYPESCRIPT_SOURCE_DIRECTORY = "src";
var feature_initiate_typescript_default = class extends Generator2 {
  typescriptConfigFilePath = "tsconfig.json";
  description = "Configure TypeScript";
  installingTypeScript() {
    const tsDependency = getDependencyInfoForInstalling("typescript" /* TYPESCRIPT */);
    this.addDevDependencies(tsDependency);
  }
  initiateTypeScriptConfig() {
    if (!this.fs.exists(this.typescriptConfigFilePath)) {
      this.fs.writeJSON(
        this.typescriptConfigFilePath,
        {}
      );
      logInfoMessage(this, `Created ${this.typescriptConfigFilePath}`);
    }
  }
  initiateSourceDirectory() {
    const gitKeepRelativePath = TYPESCRIPT_SOURCE_DIRECTORY + "/" + GIT_KEEP_FILE_NAME;
    const srcFolderGitKeepPath = this.destinationPath(gitKeepRelativePath);
    if (!this.fs.exists(srcFolderGitKeepPath)) {
      logInfoMessage(this, `
        Creating folder for source code: ${TYPESCRIPT_SOURCE_DIRECTORY}.
        Also, this folder will contain .gitkeep file to make sure it is not ignored by Git.
      `);
      this.fs.write(srcFolderGitKeepPath, "");
    }
  }
  setModuleParameters() {
    const tsConfig = this.fs.readJSON(this.typescriptConfigFilePath);
    if (!tsConfig.compilerOptions) {
      tsConfig.compilerOptions = {};
    }
    if (!tsConfig.compilerOptions.module || tsConfig.compilerOptions.module !== TYPESCRIPT_MODULE) {
      logInfoMessage(this, `Setting module to ${TYPESCRIPT_MODULE} in tsconfig.json`);
      tsConfig.compilerOptions.module = TYPESCRIPT_MODULE;
    }
    if (!tsConfig.compilerOptions.moduleResolution || tsConfig.compilerOptions.moduleResolution !== TYPESCRIPT_MODULE_RESOLUTION) {
      logInfoMessage(this, `Setting moduleResolution to ${TYPESCRIPT_MODULE_RESOLUTION} in tsconfig.json`);
      tsConfig.compilerOptions.moduleResolution = TYPESCRIPT_MODULE_RESOLUTION;
    }
    this.fs.writeJSON(
      this.typescriptConfigFilePath,
      tsConfig
    );
  }
  enableEsModuleInterop() {
    const tsConfig = this.fs.readJSON(this.typescriptConfigFilePath);
    if (!tsConfig.compilerOptions) {
      tsConfig.compilerOptions = {};
    }
    if (!tsConfig.compilerOptions.esModuleInterop) {
      logInfoMessage(this, "Enabling esModuleInterop in tsconfig.json");
      tsConfig.compilerOptions.esModuleInterop = true;
    }
    this.fs.writeJSON(
      this.typescriptConfigFilePath,
      tsConfig
    );
  }
};

// src/generators/feature-initiate-jest/index.ts
import Generator3 from "yeoman-generator";
import _ from "lodash";
var TEST_SCRIPT_COMMAND = "NODE_OPTIONS=--experimental-vm-modules jest --passWithNoTests";
var JEST_EXTENSIONS_TO_TREAT_AS_ESM = [".ts"];
var JEST_TRANSFORM = {
  "^.+\\.(t|j)sx?$": "@swc/jest"
};
var JEST_TESTS_FOLDER = "__tests__";
var feature_initiate_jest_default = class extends Generator3 {
  jestConfigFilePath;
  description = "Configure Jest for unit testing";
  constructor(args, options) {
    super(args, options);
    this.description;
    this.jestConfigFilePath = this.destinationPath("jest.config.json");
  }
  initiateJestDependency() {
    const jestDependency = getDependencyInfoForInstalling("jest" /* JEST */);
    this.addDevDependencies(jestDependency);
  }
  initiateJestConfig() {
    if (!this.fs.exists(this.jestConfigFilePath)) {
      this.fs.writeJSON(
        this.jestConfigFilePath,
        {}
      );
    }
  }
  cleanupTsJestDependency() {
    const devDependencies = this.packageJson.get("devDependencies") || {};
    const dependencies = this.packageJson.get("dependencies") || {};
    if (devDependencies["ts-jest" /* TS_JEST */] || dependencies["ts-jest" /* TS_JEST */]) {
      logInfoMessage(this, `
        Removing TS Jest dependency: ${"ts-jest" /* TS_JEST */}.
        It will be using ${"@swc/jest" /* SWC_JEST */} instead.
      `);
      delete devDependencies["ts-jest" /* TS_JEST */];
      delete dependencies["ts-jest" /* TS_JEST */];
      this.packageJson.set("devDependencies", devDependencies);
      this.packageJson.set("dependencies", dependencies);
    }
  }
  initiateTypeScriptJest() {
    const swcCoreDependency = getDependencyInfoForInstalling("@swc/core" /* SWC_CORE */);
    this.addDevDependencies(swcCoreDependency);
    const swcJestDependency = getDependencyInfoForInstalling("@swc/jest" /* SWC_JEST */);
    this.addDevDependencies(swcJestDependency);
  }
  setJestConfiguration() {
    const jestConfig = this.fs.readJSON(this.jestConfigFilePath);
    if (jestConfig.preset) {
      logInfoMessage(this, `Removing Jest config preset - will use transform: current value ${jestConfig.preset}`);
      delete jestConfig.preset;
    }
    if (jestConfig.testEnvironment) {
      logInfoMessage(this, `Removing Jest config for using test environment: current value ${jestConfig.testEnvironment}`);
      delete jestConfig.testEnvironment;
    }
    const extensionsToTreatAsEsm = jestConfig.extensionsToTreatAsEsm || [];
    if (_.difference(JEST_EXTENSIONS_TO_TREAT_AS_ESM, extensionsToTreatAsEsm).length) {
      logInfoMessage(this, `Updating Jest config for extensions to treat as ESM: current value ${extensionsToTreatAsEsm}`);
      jestConfig.extensionsToTreatAsEsm = JEST_EXTENSIONS_TO_TREAT_AS_ESM;
    }
    const jestTransform = jestConfig.transform || {};
    let jestTransformUpdated = false;
    for (const transformMatch of Object.keys(JEST_TRANSFORM)) {
      if (!jestTransform[transformMatch]) {
        logInfoMessage(this, `Adding Jest config transform for ${transformMatch}: current value ${jestTransform[transformMatch]}`);
        jestTransform[transformMatch] = JEST_TRANSFORM[transformMatch];
        jestTransformUpdated = true;
      }
    }
    if (jestTransformUpdated) {
      jestConfig.transform = jestTransform;
    }
    this.fs.writeJSON(
      this.jestConfigFilePath,
      jestConfig
    );
  }
  createTestsFolder() {
    const gitKeepRelativePath = JEST_TESTS_FOLDER + "/" + GIT_KEEP_FILE_NAME;
    const testsFolderGitKeepPath = this.destinationPath(gitKeepRelativePath);
    if (!this.fs.exists(testsFolderGitKeepPath)) {
      logInfoMessage(this, `
        Creating tests folder: ${JEST_TESTS_FOLDER}.
        Using Jest default tests folder to be able to use TS project references in future: https://www.typescriptlang.org/docs/handbook/project-references.html.
        That's why we are using separate folder and not mixing in .spec files.
        Also, this folder will contain .gitkeep file to make sure it is not ignored by Git.
      `);
      this.fs.write(testsFolderGitKeepPath, "");
    }
  }
  addScriptToPackageJson() {
    let packageJsonScripts = this.packageJson.get("scripts");
    if (!packageJsonScripts) {
      packageJsonScripts = {};
    }
    if (!packageJsonScripts["test"] || packageJsonScripts["test"] !== TEST_SCRIPT_COMMAND) {
      logInfoMessage(this, `
        Updating package.json to include test script: ${TEST_SCRIPT_COMMAND}.
        (\`NODE_OPTIONS=--experimental-vm-modules\` is to support ESM in Jest.)
        Previous test script: ${packageJsonScripts["test"]}.
      `);
      packageJsonScripts["test"] = TEST_SCRIPT_COMMAND;
      this.packageJson.set("scripts", packageJsonScripts);
    }
  }
};

// src/generators/feature-prettify-configuration-files/index.ts
import Generator4 from "yeoman-generator";
import sortPackageJson from "sort-package-json";
import sortJson from "sort-json";
var feature_prettify_configuration_files_default = class extends Generator4 {
  description = "Prettify configuration files";
  sortPackageJson() {
    const packageJsonExists = this.packageJson.existed;
    if (packageJsonExists) {
      const packageJsonContent = this.packageJson.readContent();
      const sortedPackageJsonContent = sortPackageJson(packageJsonContent);
      this.packageJson.writeContent(sortedPackageJsonContent);
      logInfoMessage(this, `
        There might be a message about a conflict in package.json.
        That's fine and expected. The file was sorted. Approve it with "y" to overwrite.
      `);
    }
  }
  sortTsConfig() {
    const tsConfigFilePath = this.destinationPath("tsconfig.json");
    if (this.fs.exists(tsConfigFilePath)) {
      const tsConfigContent = this.fs.readJSON(tsConfigFilePath);
      const sortedTsConfigContent = sortJson(tsConfigContent);
      this.fs.writeJSON(tsConfigFilePath, sortedTsConfigContent);
    }
  }
  sortJestConfig() {
    const jestConfigFilePath = this.destinationPath("jest.config.json");
    if (this.fs.exists(jestConfigFilePath)) {
      const jestConfigContent = this.fs.readJSON(jestConfigFilePath);
      const sortedJestConfigContent = sortJson(jestConfigContent);
      this.fs.writeJSON(jestConfigFilePath, sortedJestConfigContent);
    }
  }
};

// src/generators/makeup-node-app/index.ts
var makeup_node_app_default = class extends Generator5 {
  initializing() {
    this.composeWith({
      Generator: feature_initiate_npm_package_default,
      path: "../feature-initiate-npm-package"
    });
    this.composeWith({
      Generator: feature_initiate_typescript_default,
      path: "../feature-initiate-typescript"
    });
    this.composeWith({
      Generator: feature_initiate_jest_default,
      path: "../feature-initiate-jest"
    });
    this.composeWith({
      Generator: feature_prettify_configuration_files_default,
      path: "../feature-prettify-configuration-files"
    });
  }
};
export {
  makeup_node_app_default as default
};
