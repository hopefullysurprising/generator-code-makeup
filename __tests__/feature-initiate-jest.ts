import helpers, { result } from 'yeoman-test';

import InitiateJestGenerator from '@/generators/feature-initiate-jest';

describe('initiating jest package', () => {

  beforeAll(async () => {
    await helpers.run(InitiateJestGenerator as any);
  });

  it('should have jest as a dev dependency', () => {
    const devDependencies = result._readFile('package.json', true).devDependencies;
    expect(devDependencies).toHaveProperty('jest');
  });

  it('should have @swc/jest ts transform as a dev dependency', () => {
    const devDependencies = result._readFile('package.json', true).devDependencies;
    expect(devDependencies).toHaveProperty('@swc/jest');
  });

  it('should create jest config', () => {
    result.assertFile('jest.config.json');
  });

  it('should create a folder for storing tests', () => {
    expect(result.fs.exists('__tests__/.gitkeep')).toBeTruthy();
  });

  /**
   * Should be like this:
   * ```
   * "transform": {
   * "^.+\\.(t|j)sx?$": [
   *   "@swc/jest",
   *   {
   *     "jsc": {
   *       "baseUrl": ".",
   *       "paths": { "@/*": ["src/*"] }
   *     }
   *   }
   * ]
   * }
  */
  it('should setup jest transform with ts compiler', () => {
    const jestConfig = result._readFile('jest.config.json', true);
    expect(jestConfig).toHaveProperty('transform');
    const transformSettings = Object.values(jestConfig.transform);
    const swcSettings = transformSettings[0];
    expect(swcSettings[0]).toEqual('@swc/jest');
    expect(swcSettings[1]['jsc']['paths']).not.toBeUndefined();
  });

});
