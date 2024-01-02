import helpers, { result } from 'yeoman-test';

import PrettifyConfigurationFilesGenerator from '@/generators/feature-prettify-configuration-files';

describe('prettifying configuration files in project', () => {

  describe('sorting package.json', () => {

    beforeAll(async () => {
      await helpers
        .run(PrettifyConfigurationFilesGenerator as any)
        .withFiles({
          'package.json': '{"scripts": {"t": "test", "b": "build"}, "version": "0.0.1", "name": "test-package"}',
        });
    });

    it('should sort main fields', () => {
      const packageJson = result._readFile('package.json', true);
      const packageKeys = Object.keys(packageJson);
      expect(packageKeys).toEqual(['name', 'version', 'scripts']);
    });

    it('should sort scripts', () => {
      const packageJsonScripts = result._readFile('package.json', true).scripts;
      const scriptKeys = Object.keys(packageJsonScripts);
      expect(scriptKeys).toEqual(['b', 't']);
    });

  });

  describe('sorting typescript config', () => {
    
    beforeAll(async () => {
      await helpers
        .run(PrettifyConfigurationFilesGenerator as any)
        .withFiles({
          'tsconfig.json': `
            {
              "include": [],
              "compilerOptions": {
                "module": "es2022",
                "esModuleInterop": true,
                "moduleResolution": "bundler"
              }
            }
          `,
        });
    });

    it('should have root object sorted', () => {
      const tsConfig = result._readFile('tsconfig.json', true);
      const tsConfigKeys = Object.keys(tsConfig);
      expect(tsConfigKeys).toEqual(['compilerOptions', 'include']);
    });

    it('should have compilerOptions sorted', () => {
      const tsConfig = result._readFile('tsconfig.json', true);
      const compilerOptionsKeys = Object.keys(tsConfig.compilerOptions);
      expect(compilerOptionsKeys).toEqual(['esModuleInterop', 'module', 'moduleResolution']);
    });

  });

});
