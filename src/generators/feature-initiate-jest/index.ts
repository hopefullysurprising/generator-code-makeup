import Generator from 'yeoman-generator';
import _ from 'lodash';

import {
  NotImportedNpmPackage,
  NpmPackage,
  getDependencyInfoForInstalling,
} from '@/utilities/dependenciesUtilities';
import { logInfoMessage } from '@/utilities/loggingUtilities';
import { GIT_KEEP_FILE_NAME } from '@/constants/serviceFileNamesAndPaths';
import { TYPESCRIPT_BASE_URL, TYPESCRIPT_PATHS } from '@/constants/systemDefaults';

const TEST_SCRIPT_COMMAND = 'NODE_OPTIONS=--experimental-vm-modules jest --passWithNoTests';
const JEST_EXTENSIONS_TO_TREAT_AS_ESM = [".ts"];
const JEST_TRANSFORM = {
  '^.+\\.(t|j)sx?$': [
    "@swc/jest",
    {
      "jsc": {
        "baseUrl": TYPESCRIPT_BASE_URL,
        "paths": TYPESCRIPT_PATHS,
      }
    }
  ]
};

const JEST_TESTS_FOLDER = '__tests__';

export default class extends Generator {

  private jestConfigFilePath: string;
  description = 'Configure Jest for unit testing';

  constructor(args: string | string[], options: {}) {
    super(args, options);
    this.description
    this.jestConfigFilePath = this.destinationPath('jest.config.json');
  }

  initiateJestDependency() {
    const jestDependency = getDependencyInfoForInstalling(NpmPackage.JEST);
    this.addDevDependencies(jestDependency);
  }

  initiateJestConfig() {
    if (!this.fs.exists(this.jestConfigFilePath)) {
      this.fs.writeJSON(
        this.jestConfigFilePath,
        {},
      );
    }
  }

  cleanupTsJestDependency() {
    const devDependencies = this.packageJson.get('devDependencies') || {};
    const dependencies = this.packageJson.get('dependencies') || {};
    if (devDependencies[NotImportedNpmPackage.TS_JEST] || dependencies[NotImportedNpmPackage.TS_JEST]) {
      logInfoMessage(this, `
        Removing TS Jest dependency: ${NotImportedNpmPackage.TS_JEST}.
        It will be using ${NpmPackage.SWC_JEST} instead.
      `);
      delete devDependencies[NotImportedNpmPackage.TS_JEST];
      delete dependencies[NotImportedNpmPackage.TS_JEST];
      this.packageJson.set('devDependencies', devDependencies);
      this.packageJson.set('dependencies', dependencies);
    }
  }

  initiateTypeScriptJest() {
    const swcCoreDependency = getDependencyInfoForInstalling(NpmPackage.SWC_CORE);
    this.addDevDependencies(swcCoreDependency);
    const swcJestDependency = getDependencyInfoForInstalling(NpmPackage.SWC_JEST);
    this.addDevDependencies(swcJestDependency);
  }

  setJestConfiguration() {
    const jestConfig = this.fs.readJSON(this.jestConfigFilePath);

    // Clearing up TS preset to Jest config.
    if (jestConfig.preset) {
      logInfoMessage(this, `Removing Jest config preset - will use transform: current value ${jestConfig.preset}`);
      delete jestConfig.preset;
    }

    // Clearing up test environment to Jest config.
    if (jestConfig.testEnvironment) {
      logInfoMessage(this, `Removing Jest config for using test environment: current value ${jestConfig.testEnvironment}`);
      delete jestConfig.testEnvironment;
    }

    // Updating extensions to treat as ESM.
    const extensionsToTreatAsEsm = jestConfig.extensionsToTreatAsEsm || [];
    if (_.difference(JEST_EXTENSIONS_TO_TREAT_AS_ESM, extensionsToTreatAsEsm).length) {
      logInfoMessage(this, `Updating Jest config for extensions to treat as ESM: current value ${extensionsToTreatAsEsm}`);
      jestConfig.extensionsToTreatAsEsm = JEST_EXTENSIONS_TO_TREAT_AS_ESM;
    }

    const jestTransform = jestConfig.transform || {};
    let jestTransformUpdated = false;
    for (const transformMatch of Object.keys(JEST_TRANSFORM)) {
      if (
        !jestTransform[transformMatch]
        || JSON.stringify(jestTransform[transformMatch]) !== JSON.stringify(JEST_TRANSFORM[transformMatch])
      ) {
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
      jestConfig,
    );
  }

  createTestsFolder() {
    const gitKeepRelativePath = JEST_TESTS_FOLDER + '/' + GIT_KEEP_FILE_NAME;
    const testsFolderGitKeepPath = this.destinationPath(gitKeepRelativePath);
    if (!this.fs.exists(testsFolderGitKeepPath)) {
      logInfoMessage(this, `
        Creating tests folder: ${JEST_TESTS_FOLDER}.
        Using Jest default tests folder to be able to use TS project references in future: https://www.typescriptlang.org/docs/handbook/project-references.html.
        That\'s why we are using separate folder and not mixing in .spec files.
        Also, this folder will contain .gitkeep file to make sure it is not ignored by Git.
      `);
      this.fs.write(testsFolderGitKeepPath, '');
    }
  }

  addScriptToPackageJson() {
    let packageJsonScripts = this.packageJson.get('scripts');
    if (!packageJsonScripts) {
      packageJsonScripts = {};
    }
    if (!packageJsonScripts['test'] || packageJsonScripts['test'] !== TEST_SCRIPT_COMMAND) {
      logInfoMessage(this, `
        Updating package.json to include test script: ${TEST_SCRIPT_COMMAND}.
        (\`NODE_OPTIONS=--experimental-vm-modules\` is to support ESM in Jest.)
        Previous test script: ${packageJsonScripts['test']}.
      `);
      packageJsonScripts['test'] = TEST_SCRIPT_COMMAND;
      this.packageJson.set('scripts', packageJsonScripts);
    }
  }

}
