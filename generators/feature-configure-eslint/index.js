// src/generators/feature-configure-eslint/index.ts
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
  ["@swc/jest" /* SWC_JEST */]: "0.2.29",
  // From 2023-12-24
  // Linting
  ["eslint" /* ESLINT */]: "9.14.0",
  ["@eslint/js" /* ESLINT_JS */]: "9.14.0",
  ["@types/eslint__js" /* ESLINT_JS_TYPES */]: "8.42.3",
  ["typescript-eslint" /* TYPESCRIPT_ESLINT */]: "8.13.0"
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

// src/generators/feature-configure-eslint/index.ts
var LINT_SCRIPT_COMMAND = "eslint src/";
var feature_configure_eslint_default = class extends Generator {
  eslintConfigFilePath = "eslint.config.js";
  description = "Configure typescript-eslint";
  installingEslint() {
    const eslintDependency = getDependencyInfoForInstalling("eslint" /* ESLINT */);
    this.addDevDependencies(eslintDependency);
    const eslintJsDependency = getDependencyInfoForInstalling("@eslint/js" /* ESLINT_JS */);
    this.addDevDependencies(eslintJsDependency);
    const eslintJsTypesDependency = getDependencyInfoForInstalling("@types/eslint__js" /* ESLINT_JS_TYPES */);
    this.addDevDependencies(eslintJsTypesDependency);
    const tsEslintDependency = getDependencyInfoForInstalling("typescript-eslint" /* TYPESCRIPT_ESLINT */);
    this.addDevDependencies(tsEslintDependency);
  }
  initiateEslintConfig() {
    if (!this.fs.exists(this.eslintConfigFilePath)) {
      this.fs.write(
        this.eslintConfigFilePath,
        `
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
);
        `
      );
      logInfoMessage(this, `Created ${this.eslintConfigFilePath}`);
    }
  }
  addScriptToPackageJson() {
    let packageJsonScripts = this.packageJson.get("scripts");
    if (!packageJsonScripts) {
      packageJsonScripts = {};
    }
    if (!packageJsonScripts["lint"] || packageJsonScripts["lint"] !== LINT_SCRIPT_COMMAND) {
      logInfoMessage(this, `
        Updating package.json to include lint script: ${LINT_SCRIPT_COMMAND}.
        Previous test script: ${packageJsonScripts["lint"]}.
      `);
      packageJsonScripts["lint"] = LINT_SCRIPT_COMMAND;
      this.packageJson.set("scripts", packageJsonScripts);
    }
  }
};
export {
  feature_configure_eslint_default as default
};
