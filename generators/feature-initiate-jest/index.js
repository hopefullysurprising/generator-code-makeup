// src/generators/feature-initiate-jest/index.ts
import Generator from "yeoman-generator";
import _ from "lodash";

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

// src/constants/serviceFileNamesAndPaths.ts
var GIT_KEEP_FILE_NAME = ".gitkeep";

// src/constants/systemDefaults.ts
var TYPESCRIPT_BASE_URL = ".";
var TYPESCRIPT_SOURCE_DIRECTORY = "src";
var TYPESCRIPT_PATHS = {
  "@/*": [`${TYPESCRIPT_SOURCE_DIRECTORY}/*`]
};

// src/generators/feature-initiate-jest/index.ts
var TEST_SCRIPT_COMMAND = "NODE_OPTIONS=--experimental-vm-modules jest --passWithNoTests";
var JEST_EXTENSIONS_TO_TREAT_AS_ESM = [".ts"];
var JEST_TRANSFORM = {
  "^.+\\.(t|j)sx?$": [
    "@swc/jest",
    {
      "jsc": {
        "baseUrl": TYPESCRIPT_BASE_URL,
        "paths": TYPESCRIPT_PATHS
      }
    }
  ]
};
var JEST_TESTS_FOLDER = "__tests__";
var feature_initiate_jest_default = class extends Generator {
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
      if (!jestTransform[transformMatch] || JSON.stringify(jestTransform[transformMatch]) !== JSON.stringify(JEST_TRANSFORM[transformMatch])) {
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
export {
  feature_initiate_jest_default as default
};
