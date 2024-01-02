import helpers, { result } from 'yeoman-test';

import { CodeDistributionType } from '@/constants/projectWideInformation';

import MakeupNodeAppGenerator from '@/generators/makeup-node-app';
import { ConfigurationKey } from '@/utilities/configurationKeys';

describe('initiating a full node app', () => {

  describe('initiating an app only once', () => {
    
    beforeAll(async () => {
      await helpers
        .run(MakeupNodeAppGenerator as any)
        .withAnswers({
          [ConfigurationKey.PACKAGE_NAME]: 'test-package',
          [ConfigurationKey.CODE_DISTRIBUTION_TYPE]: CodeDistributionType.PROPRIETARY,
          [ConfigurationKey.AUTHOR_NAME]: 'test-name',
          [ConfigurationKey.AUTHOR_EMAIL]: 'test-email',
          [ConfigurationKey.AUTHOR_URL]: 'test-url',
        });
    });
  
    it('should have package.json created', () => {
      result.assertFile('package.json');
    });
  
    it('should have tsconfig.json created', () => {
      result.assertFile('tsconfig.json');
    });
  
    it('should have jest config created', () => {
      result.assertFile('jest.config.json');
    });

  });

  describe('initiating an app with preserved configs and existing files', () => {

    beforeAll(async () => {
      await helpers
        .run(MakeupNodeAppGenerator as any)
        .withFiles({
          'package.json': '{ "name": "test-package" }',
          '.yo-rc-global.json': `{
            "*:0.0.0": {
              "author_email": "test-email",
              "author_name": "test-name",
              "author_url": "test-url"
            }
          }`,
        })
        .withLocalConfig({
          [ConfigurationKey.CODE_DISTRIBUTION_TYPE]: CodeDistributionType.PROPRIETARY,
        });
    });

    it('should not override ask for package name again and the name should stay the same', () => {
      result.assertFileContent('package.json', /"name": "test-package"/);
    });

    it('should take author name from global config', () => {
      result.assertFileContent('package.json', /"name": "test-name"/);
    });

    it('should take license information from local config', () => {
      result.assertFileContent('package.json', /"license": "UNLICENSED"/);
    });

  });
  
});
