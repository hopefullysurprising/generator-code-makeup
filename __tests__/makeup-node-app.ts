import helpers, { result } from 'yeoman-test';

import { CodeDistributionType } from '../src/constants/projectWideInformation';

import MakeupNodeAppGenerator from '../src/generators/makeup-node-app';
import { ConfigurationKey } from '../src/utilities/configurationKeys';

describe('initiating full node app', () => {

  beforeAll(async () => {
    await helpers
      .run(MakeupNodeAppGenerator as any)
      .withAnswers({
        [ConfigurationKey.PACKAGE_NAME]: 'test-package',
        [ConfigurationKey.CODE_DISTRIBUTION_TYPE]: CodeDistributionType.PROPRIETARY,
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
