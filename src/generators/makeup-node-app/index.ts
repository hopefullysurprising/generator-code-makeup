import Generator from 'yeoman-generator';

import FeatureInitiateNpmPackage from '@/generators/feature-initiate-npm-package';
import FeatureInitiateTypescript from '@/generators/feature-initiate-typescript';
import FeatureInitiateJest from '@/generators/feature-initiate-jest';
import FeaturePrettifyConfigurationFiles from '@/generators/feature-prettify-configuration-files';

export default class extends Generator {

  initializing() {

    // Setup the base of npm package.
    this.composeWith({
      Generator: FeatureInitiateNpmPackage,
      path: '../feature-initiate-npm-package',
    });

    // Setup TypeScript.
    this.composeWith({
      Generator: FeatureInitiateTypescript,
      path: '../feature-initiate-typescript',
    });

    // Setup Jest.
    this.composeWith({
      Generator: FeatureInitiateJest,
      path: '../feature-initiate-jest',
    });

    // Automatically do config fine-printing.
    this.composeWith({
      Generator: FeaturePrettifyConfigurationFiles,
      path: '../feature-prettify-configuration-files',
    });
  }

}
