<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/andreynav/js-playwright-project-90?style=for-the-badge)
![Hexlet Check Status](https://img.shields.io/github/actions/workflow/status/andreynav/js-playwright-project-90/hexlet-check.yml?style=for-the-badge)

</div>

# General Notes

The project is a web application for developing E2E tests on Playwright. You can select an available dashboard section to manipulations.
The project based on [Hexlet Task Manager](https://www.npmjs.com/package/@hexlet/testing-task-manager).


## Project test structure

The project has multilayer structure:

- `co` - used to keep component objects and fixtures
- `data` - used to keep test data

## Dependencies

The project has the next dependencies in the [package.json](package.json) file.

<div align="center">

![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/andreynav/js-playwright-project-90/@hexlet/testing-task-manager?style=for-the-badge)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/andreynav/js-playwright-project-90/react?style=for-the-badge)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/andreynav/js-playwright-project-90/react-dom?style=for-the-badge)
![GitHub package.json dev dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/andreynav/js-playwright-project-90/dev/@playwright/test?style=for-the-badge)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/andreynav/js-playwright-project-90/dev/vite?style=for-the-badge)

</div>

## Installation

1. Clone project to your PC by the following command:

```console
  git clone https://github.com/andreynav/js-playwright-project-90.git
```

2. Open the root directory and enter the following command:

```console
  yarn
```

## Running project

To run project, open the root directory and enter the following command:

```console
  yarn dev
```

The command runs the app in the development mode.
Open [http://localhost:5173/](http://localhost:5173/) to view it in your browser.

## Running Playwright tests

To run tests first you need to run the project and after that open the root directory and enter the following command:

```console
    npx playwright test
```

You also can run test via command line interface using yarn:

```console
    yarn pw
```

See available running scripts in package.json script section.

## License

The project is open source software provided under the [Apache License 2.0](LICENSE.md).
