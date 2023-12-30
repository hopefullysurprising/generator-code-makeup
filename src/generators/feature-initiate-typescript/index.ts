import Generator from 'yeoman-generator';

import {
  NpmPackage,
  getDependencyInfoForInstalling,
} from '../../utilities/dependenciesUtilities';
import { logInfoMessage } from '../../utilities/loggingUtilities';
import { GIT_KEEP_FILE_NAME } from '../../constants/serviceFileNamesAndPaths';

const TYPESCRIPT_MODULE = 'es2022';
const TYPESCRIPT_MODULE_RESOLUTION = 'bundler';
const TYPESCRIPT_SOURCE_DIRECTORY = 'src';

export default class extends Generator {

  private typescriptConfigFilePath = 'tsconfig.json';

  description = 'Configure TypeScript';

  installingTypeScript() {
    const tsDependency = getDependencyInfoForInstalling(NpmPackage.TYPESCRIPT);
    this.addDevDependencies(tsDependency);
  }

  initiateTypeScriptConfig() {
    if (!this.fs.exists(this.typescriptConfigFilePath)) {
      this.fs.writeJSON(
        this.typescriptConfigFilePath,
        {},
      );
      logInfoMessage(this, `Created ${this.typescriptConfigFilePath}`);
    }
  }

  initiateSourceDirectory() {
    const gitKeepRelativePath = TYPESCRIPT_SOURCE_DIRECTORY + '/' + GIT_KEEP_FILE_NAME;
    const srcFolderGitKeepPath = this.destinationPath(gitKeepRelativePath);
    if (!this.fs.exists(srcFolderGitKeepPath)) {
      logInfoMessage(this, `
        Creating folder for source code: ${TYPESCRIPT_SOURCE_DIRECTORY}.
        Also, this folder will contain .gitkeep file to make sure it is not ignored by Git.
      `);
      this.fs.write(srcFolderGitKeepPath, '');
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
      tsConfig,
    );
  }

  enableEsModuleInterop() {
    const tsConfig = this.fs.readJSON(this.typescriptConfigFilePath);

    if (!tsConfig.compilerOptions) {
      tsConfig.compilerOptions = {};
    }

    if (!tsConfig.compilerOptions.esModuleInterop) {
      logInfoMessage(this, 'Enabling esModuleInterop in tsconfig.json');
      tsConfig.compilerOptions.esModuleInterop = true;
    }

    this.fs.writeJSON(
      this.typescriptConfigFilePath,
      tsConfig,
    );
  }

}
