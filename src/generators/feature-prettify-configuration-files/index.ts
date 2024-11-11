import Generator from 'yeoman-generator';
import sortPackageJson from 'sort-package-json'
import sortJson from 'sort-json';

import { logInfoMessage } from '@/utilities/loggingUtilities';

export default class extends Generator {

  description = 'Prettify configuration files';

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
    const tsConfigFilePath = this.destinationPath('tsconfig.json');
    if (this.fs.exists(tsConfigFilePath)) {
      const tsConfigContent = this.fs.readJSON(tsConfigFilePath);
      const sortedTsConfigContent = sortJson(tsConfigContent);
      this.fs.writeJSON(tsConfigFilePath, sortedTsConfigContent);
    }
  }

  sortJestConfig() {
    const jestConfigFilePath = this.destinationPath('jest.config.json');
    if (this.fs.exists(jestConfigFilePath)) {
      const jestConfigContent = this.fs.readJSON(jestConfigFilePath);
      const sortedJestConfigContent = sortJson(jestConfigContent);
      this.fs.writeJSON(jestConfigFilePath, sortedJestConfigContent);
    }
  }

}
