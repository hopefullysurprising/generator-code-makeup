import helpers, { result } from 'yeoman-test';

import { CodeDistributionType } from '../src/constants/projectWideInformation';

import InitiateNpmPackageGenerator from '../src/generators/feature-initiate-npm-package';
import { ConfigurationKey } from '../src/utilities/configurationKeys';

describe('initiating npm package', () => {

  describe('initiating an open source package', () => {

    beforeAll(async () => {
      await helpers
        .run(InitiateNpmPackageGenerator as any)
        .withAnswers({
          [ConfigurationKey.PACKAGE_NAME]: 'test-package',
          [ConfigurationKey.CODE_DISTRIBUTION_TYPE]: CodeDistributionType.OPEN_SOURCE,
          [ConfigurationKey.AUTHOR_NAME]: 'test-name',
          [ConfigurationKey.AUTHOR_EMAIL]: 'test-email',
          [ConfigurationKey.AUTHOR_URL]: 'test-url',
        })
        .withFiles({
          'unknown/templates/licenses/LGPL-3.0.md': 'Test license',
        });
    });
    
    it('should initiate package.json file', async () => {
      result.assertFile('package.json');
    });

    it('should contain open source license file', () => {
      result.assertFile('LICENSE.md');
      result.assertFileContent('LICENSE.md', 'Test license');
    });

    it('should have name set in package.json', () => {
      result.assertFileContent('package.json', /"name": "test-package"/);
    });

  });

  describe('initiating a proprietary package', () => {

    beforeAll(async () => {
      await helpers
        .run(InitiateNpmPackageGenerator as any)
        .withAnswers({
          [ConfigurationKey.PACKAGE_NAME]: 'test-package',
          [ConfigurationKey.CODE_DISTRIBUTION_TYPE]: CodeDistributionType.PROPRIETARY,
          [ConfigurationKey.AUTHOR_NAME]: 'test-name',
          [ConfigurationKey.AUTHOR_EMAIL]: 'test-email',
          [ConfigurationKey.AUTHOR_URL]: 'test-url',
        });
    });

    it('should have no license file which means it\s proprietary', () => {
      result.assertNoFile('LICENSE.md');
    });

    it('should have license as UNLICENSED', () => {
      result.assertJsonFileContent('package.json', { license: 'UNLICENSED' });
    });

  });

});
