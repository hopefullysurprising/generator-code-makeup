// src/generators/feature-prettify-configuration-files/index.ts
import Generator from "yeoman-generator";
import sortPackageJson from "sort-package-json";
import sortJson from "sort-json";

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

// src/generators/feature-prettify-configuration-files/index.ts
var feature_prettify_configuration_files_default = class extends Generator {
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
  sortJestConfig() {
    const jestConfigFilePath = this.destinationPath("jest.config.json");
    if (this.fs.exists(jestConfigFilePath)) {
      const jestConfigContent = this.fs.readJSON(jestConfigFilePath);
      const sortedJestConfigContent = sortJson(jestConfigContent);
      this.fs.writeJSON(jestConfigFilePath, sortedJestConfigContent);
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
};
export {
  feature_prettify_configuration_files_default as default
};
