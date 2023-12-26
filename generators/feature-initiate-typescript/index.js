// src/generators/feature-initiate-typescript/index.ts
import Generator from "yeoman-generator";

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

// src/generators/feature-initiate-typescript/index.ts
var TYPESCRIPT_MODULE = "es2022";
var TYPESCRIPT_MODULE_RESOLUTION = "bundler";
var feature_initiate_typescript_default = class extends Generator {
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
export {
  feature_initiate_typescript_default as default
};
