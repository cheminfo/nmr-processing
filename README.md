# nmr-processing

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

## Introduction

The goal is to have [pure functions](https://medium.com/@jamesjefferyuk/javascript-what-are-pure-functions-4d4d5392d49c) allowing to process NMR spectra.

All the functions use only native javascript object and will not use any classes.

The functions are sorted by category on which they apply. Currently the categories are:

- xy
- peaks
- ranges

## Debug

A viewer for xy data is available in `/web`

## Installation

`$ npm i nmr-processing`

## Usage

```js
import library from 'nmr-processing';

const result = library(args);
// result is ...
```

## [API Documentation](https://cheminfo.github.io/nmr-processing/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/nmr-processing.svg
[npm-url]: https://www.npmjs.com/package/nmr-processing
[ci-image]: https://github.com/cheminfo/nmr-processing/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/cheminfo/nmr-processing/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/nmr-processing.svg
[codecov-url]: https://codecov.io/gh/cheminfo/nmr-processing
[download-image]: https://img.shields.io/npm/dm/nmr-processing.svg
[download-url]: https://www.npmjs.com/package/nmr-processing
