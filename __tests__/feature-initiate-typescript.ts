import helpers, { result } from 'yeoman-test';

import InitiateTypescriptGenerator from '@/generators/feature-initiate-typescript';

describe('initiating typescript package', () => {
  
  beforeAll(async () => {
    await helpers.run(InitiateTypescriptGenerator as any);
  });
  
  it('should initiate tsconfig.json file', async () => {
    result.assertFile('tsconfig.json');
  });

  it('should contain es2022 module', () => {
    result.assertJsonFileContent('tsconfig.json', { compilerOptions: { module: 'es2022' } });
  });

  it('should contain bundler module resolution', () => {
    result.assertJsonFileContent('tsconfig.json', { compilerOptions: { moduleResolution: 'bundler' } });
  });

  it('should have TypeScript installed as dev dependency', () => {
    const devDependencies = result._readFile('package.json', true).devDependencies;
    expect(devDependencies).toHaveProperty('typescript');
  });

  it('should create a source code folder', () => {
    expect(result.fs.exists('src/.gitkeep')).toBeTruthy();
  });

  it('should setup absolute paths', () => {
    result.assertJsonFileContent('tsconfig.json', { compilerOptions: { baseUrl: '.' } });
    result.assertJsonFileContent('tsconfig.json', { compilerOptions: { paths: { '@/*': [ 'src/*' ] } } });
  });

});
