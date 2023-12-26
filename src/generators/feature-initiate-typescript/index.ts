import Generator from 'yeoman-generator';

import {
  NpmPackage,
  getDependencyInfoForInstalling,
} from '../../utilities/dependenciesUtilities';
import { logInfoMessage } from '../../utilities/loggingUtilities';

const TYPESCRIPT_MODULE = 'es2022';
const TYPESCRIPT_MODULE_RESOLUTION = 'bundler';

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
