# @clair-obscur-datastar/utils
## Usage

The following tasks are available:

- `dev`: Run Vite in watch mode to detect changes - all modules are compiled to the `dist/` folder, as well as rollup of all types to a d.ts declaration file
- `start`: Run Vite in host mode to work in a local development environment within this package
- `build`: Run Vite to build a production release distributable
- `build:types`: Run DTS Generator to build d.ts type declarations only

Rollup all your exports to the top-level index.ts for inclusion into the build distributable.

For example, if you have a `utils/` folder that contains an `arrayUtils.ts` file.

/src/utils/arrayUtils.ts:
```ts
export const distinct = <T>(array: T[] = []) => [...new Set(array)];
```

Include that export in the top-level `index.ts` .

/src/index.ts:
```ts
// Main library exports - these are packaged in your distributable
export { distinct } from "./utils/arrayUtils"
```

## Development

There are multiple strategies for development, either working directly from the library or from a linked project.

### Local Development

Vite features a host mode for development with real time HMR updates directly from the library via the `start` script.  This enables rapid development within the library instead of linking from other projects.

Using the `start` task, Vite hosts the `index.html` for a local development environment.  This file is not included in the production build.  Note that only exports specified from the `index.ts` are ultimately bundled into the library.


For UI projects, you may want to consider adding tools such as [Storybook](https://storybook.js.org/) to isolate UI component development by running a `storybook` script from this package.


### Project Development

To use this library with other app projects before submitting to a registry such as NPM, run the `dev` script and link packages.

Using the `dev` task, Vite detects changes and compiles all modules to the `dist/` folder, as well as rollup of all types to a d.ts declaration file.

