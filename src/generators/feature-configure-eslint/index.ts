import Generator from 'yeoman-generator';

import {
  NpmPackage,
  getDependencyInfoForInstalling,
} from '@/utilities/dependenciesUtilities';
import { logInfoMessage } from '@/utilities/loggingUtilities';

const LINT_SCRIPT_COMMAND = 'eslint src/';

export default class extends Generator {

  private eslintConfigFilePath = 'eslint.config.js';

  description = 'Configure typescript-eslint';

  installingEslint() {
    const eslintDependency = getDependencyInfoForInstalling(NpmPackage.ESLINT);
    this.addDevDependencies(eslintDependency);
    const eslintJsDependency = getDependencyInfoForInstalling(NpmPackage.ESLINT_JS);
    this.addDevDependencies(eslintJsDependency);
    const eslintJsTypesDependency = getDependencyInfoForInstalling(NpmPackage.ESLINT_JS_TYPES);
    this.addDevDependencies(eslintJsTypesDependency);
    const tsEslintDependency = getDependencyInfoForInstalling(NpmPackage.TYPESCRIPT_ESLINT);
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
        `,
      );
      logInfoMessage(this, `Created ${this.eslintConfigFilePath}`);
    }
  }

  addScriptToPackageJson() {
    let packageJsonScripts = this.packageJson.get('scripts');
    if (!packageJsonScripts) {
      packageJsonScripts = {};
    }
    if (!packageJsonScripts['lint'] || packageJsonScripts['lint'] !== LINT_SCRIPT_COMMAND) {
      logInfoMessage(this, `
        Updating package.json to include lint script: ${LINT_SCRIPT_COMMAND}.
        Previous test script: ${packageJsonScripts['lint']}.
      `);
      packageJsonScripts['lint'] = LINT_SCRIPT_COMMAND;
      this.packageJson.set('scripts', packageJsonScripts);
    }
  }

}
