import helpers, { result } from 'yeoman-test';

import InitiateJestGenerator from '../src/generators/feature-initiate-jest';

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
    result.fs.exists('__tests__');
  });

  it('should setup jest transform with ts compiler', () => {
    const jestConfig = result._readFile('jest.config.json', true);
    expect(jestConfig).toHaveProperty('transform');
    expect(Object.values(jestConfig.transform)).toContain('@swc/jest');
  });

});
