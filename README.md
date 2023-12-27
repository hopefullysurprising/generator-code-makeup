# Code makeup tool

## DISCLAIMER

This project is currently at early stages of development and is expected to become more robust over time. But for now, it aims to demonstrate the new approach to "continuous scaffolding". It might miss features and might be less flexible than you want it to be. Consider opening an issue in this repository if you find it suitable.

## Installation

More info can be found in [Yeoman documentation](https://yeoman.io/learning/).

```
npm install -g yo
npm install -g generator-code-makeup
```

## Usage

Run `yo code-makeup:<GENERATOR_NAME>` in the folder you generate to.

Example: `yo code-makeup:makeup-node-app`.

## Approach

This tool is a [Yeoman](https://yeoman.io) generator that helps initiate Node.js projects and maintain the standards in them continuously.

This continuity is achieved through applying these requirements to every code change operation:

1. Every change happens only if strictly necessary (if the project value aligns with the intended one, no change happen).
2. Every change considers side-effects of the change itself and takes care of it - either through a cleanup or communicating the change to the user.

Also, this generator stores every answer to previously asked questions in one of a few storages:

1. Project itself (`package.json`, `tsconfig.json` and so on).
2. [Yeoman project configuration storage](https://yeoman.io/authoring/storage).
3. Profile-wide configuration storage (implemented by this generator itself - shared between all generator runs in all projects, such as `author.name`).

What storage to use depends on the configuration value entirely. **User input is always asked only once.**

## Available independent and grouped generators

There are two types of generators available in this project:

1. "Feature" generator. Executes a set of operations aiming to makeup a particular aspect of the project.
2. "Makeup" generator. Executes multiple feature generators in a particular order.

All of them can be ran separately in any project.

### "Makeup" generators

#### `makeup-node-app`

1. `feature-initiate-npm-package`
2. `feature-initiate-typescript`
3. `feature-initiate-jest`
4. `feature-prettify-configuration-files`

### "Feature" generators

**NOTE:** For every action read it *as needed* if not said otherwise.

#### `feature-initiate-npm-package`

1. Create `package.json`.
2. Set project name.
3. Update license information and add a license file (`UNLICENSED` for proprietary and `LGPL-3.0` for open source).
4. Set author info (name, email, URL).

#### `feature-initiate-typescript`

1. Add `typescript` as a dev dependency.
2. Create `tsconfig.json`.
3. Set `module` and `moduleResolution` suitable for bundling the TS app.
4. Enable `esModuleInterop`.

#### `feature-initiate-jest`

1. Add `jest` as a dev dependency.
2. Create `jest.config.json`.
3. Remove `ts-jest` from dependencies.
4. Add `@swc/jest` as a dev dependency.
5. Initiate Jest configuration.
6. Create `__tests__` folder for storing spec files.
7. Set test script in `package.json`.

#### `feature-prettify-configuration-files`

1. Sort `package.json` with [sort-package-json](https://www.npmjs.com/package/sort-package-json).
2. Sort `tsconfig.json` with [sort-json](https://www.npmjs.com/package/sort-json).
3. Sort `jest.config.json` with [sort-json](https://www.npmjs.com/package/sort-json).

## Making it work from source code

It requires the package to be available globally. That can be done with `npm link` in the root of this package. That will make it globally available to other npm scripts (including `yo`).
