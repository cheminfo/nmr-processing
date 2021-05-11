# Changelog

## [1.3.0](https://www.github.com/cheminfo/nmr-processing/compare/v1.2.0...v1.3.0) (2021-05-11)


### Features

* splitPatterns allows spaces ([6a41404](https://www.github.com/cheminfo/nmr-processing/commit/6a4140455ce571c9f609f622a82a91b5970f59c1))


### Bug Fixes

* join overlaped ranges ([04e164b](https://www.github.com/cheminfo/nmr-processing/commit/04e164b3e8dd4998ced8e1a5e125bd2663d9c803))
* update dependencies ([18bb254](https://www.github.com/cheminfo/nmr-processing/commit/18bb254515efaac5bcb462824dd52e9880ecc798))
* use cross-fetch instead of node-fetch for browser compatibility ([ba92bac](https://www.github.com/cheminfo/nmr-processing/commit/ba92bac64de76a5f897a38f3f140d0f5d5830ce0))

## [1.3.0](https://www.github.com/cheminfo/nmr-processing/compare/v1.2.0...v1.3.0) (2021-05-11)


### Features

* splitPatterns allows spaces ([6a41404](https://www.github.com/cheminfo/nmr-processing/commit/6a4140455ce571c9f609f622a82a91b5970f59c1))


### Bug Fixes

* join overlaped ranges ([04e164b](https://www.github.com/cheminfo/nmr-processing/commit/04e164b3e8dd4998ced8e1a5e125bd2663d9c803))
* update dependencies ([18bb254](https://www.github.com/cheminfo/nmr-processing/commit/18bb254515efaac5bcb462824dd52e9880ecc798))
* use cross-fetch instead of node-fetch for browser compatibility ([ba92bac](https://www.github.com/cheminfo/nmr-processing/commit/ba92bac64de76a5f897a38f3f140d0f5d5830ce0))

## [1.2.0](https://www.github.com/cheminfo/nmr-processing/compare/v1.1.0...v1.2.0) (2021-04-05)


### Features

* adapt splitSpinSystem to ml-hclust 3.0.0 ([#55](https://www.github.com/cheminfo/nmr-processing/issues/55)) ([52bb416](https://www.github.com/cheminfo/nmr-processing/commit/52bb41632bf0535c537b966a792da728f7c26036))
* add cache in prediction ([7efd153](https://www.github.com/cheminfo/nmr-processing/commit/7efd153caa77ea13050ce3553c058e312cb72551))
* add couplind length in prediciton ([afbfb84](https://www.github.com/cheminfo/nmr-processing/commit/afbfb84ccf70608c1a609c408c591bc2b4561077))
* add couplingValues ([3c3dfb2](https://www.github.com/cheminfo/nmr-processing/commit/3c3dfb2e12c54efb8a6c4baf52d8e29159562933))
* add diaID in prediction result ([92cb27e](https://www.github.com/cheminfo/nmr-processing/commit/92cb27e392628355c895acc211ec15b6469d4c9d))
* add signalsJoin ([022ec07](https://www.github.com/cheminfo/nmr-processing/commit/022ec07d26234a6818cc43324f2fe0a2d4f89045))
* add splitPatterns and joinPatterns ([cdacae3](https://www.github.com/cheminfo/nmr-processing/commit/cdacae36ffa7cc12098c6d315028ebefb33c4f13))
* improve joinSignals in predictionProton ([fa361a7](https://www.github.com/cheminfo/nmr-processing/commit/fa361a7214105ba1bd7e09c2c13bed571792c76a))
* prediction assignment is always an array and add testcase ([110960e](https://www.github.com/cheminfo/nmr-processing/commit/110960ec783022e2f0e1f98997683eb44f506c72))
* sort couplings from larger to smaller ([b6940a4](https://www.github.com/cheminfo/nmr-processing/commit/b6940a4b6d812068405caf24559439155f36eea5))


### Bug Fixes

* correctly join signal couplings ([dfedd56](https://www.github.com/cheminfo/nmr-processing/commit/dfedd5636d520a55369d93e1b925462e4264a8b2))

## [1.1.0](https://www.github.com/cheminfo/nmr-processing/compare/v1.0.1...v1.1.0) (2021-04-02)


### Features

* splitSystem as independent function ([#53](https://www.github.com/cheminfo/nmr-processing/issues/53)) ([1054423](https://www.github.com/cheminfo/nmr-processing/commit/10544234125147b57e4171458ae5882c0d60c021))


### Bug Fixes

* signalJoinCouplings assignment join ([2fce7cb](https://www.github.com/cheminfo/nmr-processing/commit/2fce7cb749d86dceccbddd355a66fcc2ac9b4a05))

### [1.0.1](https://www.github.com/cheminfo/nmr-processing/compare/v1.0.0...v1.0.1) (2021-03-24)


### Bug Fixes

* update ml-matrix-peaks-finder to v1.0.0 ([da734cc](https://www.github.com/cheminfo/nmr-processing/commit/da734cc91928750ca2038ff285f8d2db65130284))

## [1.0.0](https://www.github.com/cheminfo/nmr-processing/compare/v0.14.0...v1.0.0) (2021-03-24)


### Bug Fixes

* update dependencies ([5e2809a](https://www.github.com/cheminfo/nmr-processing/commit/5e2809a057947ad4b52e66c74ed5e7bbf5e2b7bd))

## [0.14.0](https://www.github.com/cheminfo/nmr-processing/compare/v0.13.0...v0.14.0) (2021-03-24)


### ⚠ BREAKING CHANGES

* The proton prediction function was renamed to predictionProton and requires an `OCL.Molecule` instance. `fromMolfile` and `fromSmiles` were removed.

### Code Refactoring

* remove OCL dependency ([bdcbbe0](https://www.github.com/cheminfo/nmr-processing/commit/bdcbbe0440ffbfc2f67f90d078002066017fa3d5))

## [0.13.0](https://www.github.com/cheminfo/nmr-processing/compare/v0.12.1...v0.13.0) (2021-03-19)


### Features

* fix ensureClusterSize ([#47](https://www.github.com/cheminfo/nmr-processing/issues/47)) ([570f9f8](https://www.github.com/cheminfo/nmr-processing/commit/570f9f82fcb17a42cae767f638b19cadbb894fff))
* remove xyGetArea close[#10](https://www.github.com/cheminfo/nmr-processing/issues/10) ([13bf194](https://www.github.com/cheminfo/nmr-processing/commit/13bf19475fa0d1bcefeb84a750d97f4ee8cd1d00))
* rescale to 1e8 signalsToXY and add maxValue option ([da2364c](https://www.github.com/cheminfo/nmr-processing/commit/da2364ca434f8f860533d8c20309605dc5487cae))


### Bug Fixes

* remove writeFile in test ([61b54e3](https://www.github.com/cheminfo/nmr-processing/commit/61b54e3a0f2ed670cb048bf32453a9084ccdd02f))

### [0.12.1](https://www.github.com/cheminfo/nmr-processing/compare/v0.12.0...v0.12.1) (2021-03-12)


### Bug Fixes

* expose signalsToXY ([927646b](https://www.github.com/cheminfo/nmr-processing/commit/927646b555304d5c48a2263b5f59caa2c231d8dd))

## [0.12.0](https://www.github.com/cheminfo/nmr-processing/compare/v0.11.1...v0.12.0) (2021-03-05)


### Features

* add simulation of 1D nmr spectrum from signals ([247d523](https://www.github.com/cheminfo/nmr-processing/commit/247d523f80d2877713fa6d978027643b4fa78a3f))
* use spectrum-generator in simulate1D ([9489d78](https://www.github.com/cheminfo/nmr-processing/commit/9489d78e1962c6cf834e14e24f46c876be6802e8))
* use static function for spinSystem creation ([1db79c5](https://www.github.com/cheminfo/nmr-processing/commit/1db79c5c2e5901b366d48c88263116cbbb1d0972))


### Bug Fixes

* eslint ([69ac997](https://www.github.com/cheminfo/nmr-processing/commit/69ac9972cae991f27fe15648952593f92bcd91b9))
* rename xyzJResAnalizer to xyzJResAnalyzer ([fbc80ee](https://www.github.com/cheminfo/nmr-processing/commit/fbc80ee9485f028f1c12f4a75571fa4eb6e6d031))

### [0.11.1](https://www.github.com/cheminfo/nmr-processing/compare/v0.11.0...v0.11.1) (2021-03-01)


### Bug Fixes

* allow other openchemlib-utils initialization ([f69a825](https://www.github.com/cheminfo/nmr-processing/commit/f69a8250d629d948a4b24f70d7d221dc6e68465f))

## [0.11.0](https://www.github.com/cheminfo/nmr-processing/compare/v0.10.0...v0.11.0) (2021-02-28)


### Features

* add predictionProton ([17f596d](https://www.github.com/cheminfo/nmr-processing/commit/17f596dd94346cf1f1e31b0fa06c0281b0fd8e27))
* add signalsToRanges ([906dad9](https://www.github.com/cheminfo/nmr-processing/commit/906dad926fb3364f4f0d6836539998a8633e2722))
* add spinus prediction ([1bce49f](https://www.github.com/cheminfo/nmr-processing/commit/1bce49f1c0783ab45ce90657d2a749b93b1ae07b))

## [0.10.0](https://www.github.com/cheminfo/nmr-processing/compare/v0.9.0...v0.10.0) (2021-02-18)


### Features

* add from-to of signals from from-to of peaks ([15950c5](https://www.github.com/cheminfo/nmr-processing/commit/15950c54479f9944b118637bf27f606e2d8db1fd))

## [0.9.0](https://www.github.com/cheminfo/nmr-processing/compare/v0.8.0...v0.9.0) (2021-02-09)


### Features

* change nH to integrationSum ([#33](https://www.github.com/cheminfo/nmr-processing/issues/33)) ([801960a](https://www.github.com/cheminfo/nmr-processing/commit/801960a8fa765d3b3bbc9ec555496a9b505827e7))

## [0.8.0](https://www.github.com/cheminfo/nmr-processing/compare/v0.7.0...v0.8.0) (2021-02-09)


### Features

* real top detection and fix options name in peak detection ([#32](https://www.github.com/cheminfo/nmr-processing/issues/32)) ([e0dd125](https://www.github.com/cheminfo/nmr-processing/commit/e0dd125d4146d9143b4394204ebeeed16b0ffb80))
* update parameters names for xyAutoRangesPicking ([ed388e6](https://www.github.com/cheminfo/nmr-processing/commit/ed388e686a1dffebe852d3f12726a15560fb3fc2))

## [0.7.0](https://www.github.com/cheminfo/nmr-processing/compare/v0.6.0...v0.7.0) (2021-01-26)


### Features

* add kind to signal in auto range detection ([#28](https://www.github.com/cheminfo/nmr-processing/issues/28)) ([90a1ecd](https://www.github.com/cheminfo/nmr-processing/commit/90a1ecd65363f21603d07aa8b6cfd0c15045f829))

## [0.6.0](https://www.github.com/cheminfo/nmr-processing/compare/v0.5.0...v0.6.0) (2021-01-22)


### Features

* generate version with 2D peak picking improvement ([ae62c20](https://www.github.com/cheminfo/nmr-processing/commit/ae62c2067ab491c1c6e4a9e0e271bb39935fa203))

## [0.5.0](https://www.github.com/cheminfo/nmr-processing/compare/v0.4.0...v0.5.0) (2020-12-16)


### Features

* by default filter solvent and impurity in rangesToACS ([319e595](https://www.github.com/cheminfo/nmr-processing/commit/319e595462a17c834699249dea8757bd87008dca))

## [0.4.0](https://www.github.com/cheminfo/nmr-processing/compare/v0.3.1...v0.4.0) (2020-11-16)


### Features

* update ml-gsd and improve documentation ([#23](https://www.github.com/cheminfo/nmr-processing/issues/23)) ([f0400ef](https://www.github.com/cheminfo/nmr-processing/commit/f0400ef10895920a4ae6f76a7c8b9418db12a425))

### [0.3.1](https://www.github.com/cheminfo/nmr-processing/compare/v0.3.0...v0.3.1) (2020-10-28)


### Bug Fixes

* update matrix-peaks-finder ([#21](https://www.github.com/cheminfo/nmr-processing/issues/21)) ([d1abb05](https://www.github.com/cheminfo/nmr-processing/commit/d1abb058f52cda9dbb2aca23ab2fa9262a85c069))

## [0.3.0](https://www.github.com/cheminfo/nmr-processing/compare/v0.2.5...v0.3.0) (2020-10-27)

### Bug Fixes

* auto peaks picking dependency ([420c92a](https://www.github.com/cheminfo/nmr-processing/commit/420c92a45ad2ba7375694cee9f2bc6ae03f2d6cd))
* use number for gyromagneticRatio and add 1 digit for 13C ([1f77c67](https://github.com/cheminfo/nmr-processing/commit/1f77c67927749e41f3c4cbb5779ef5d7e075d9ad))

## [0.2.1](https://github.com/cheminfo/nmr-processing/compare/v0.2.0...v0.2.1) (2020-06-24)


## [0.2.0](https://github.com/cheminfo/nmr-processing/compare/v0.1.5...v0.2.0) (2020-06-23)


### Features

* add gyromagneticRatio ([84a5fe9](https://github.com/cheminfo/nmr-processing/commit/84a5fe95c4fc8024344f37225005e6b2c287356d))


## 0.1.0 (2020-05-23)


### Features

* add a folder with constants ([fd48113](https://github.com/cheminfo/nmr-processing/commit/fd481139955abf5118b00f7f8a402ca4ceb831fa))
* add getPattern and joinCouplings ([f7f591d](https://github.com/cheminfo/nmr-processing/commit/f7f591d53ed3a2bff8e48e62f3bbb473b9d26e2a))
* add peak picking ([2c2ccd5](https://github.com/cheminfo/nmr-processing/commit/2c2ccd567a9e29378177fe44dcf4aecd1e4444dd))
* add signal ([e11a02c](https://github.com/cheminfo/nmr-processing/commit/e11a02c6f3f3300840121aa53d2c6af45add0bb4))
* add test data ([ab8cd2e](https://github.com/cheminfo/nmr-processing/commit/ab8cd2e449939de261a8178306af1aeff8f7baaf))
* add toACS ([5225cb1](https://github.com/cheminfo/nmr-processing/commit/5225cb1285dd66a2fa568699b706d4b518e29461))
* addn web folder allowing to debug ([965eabf](https://github.com/cheminfo/nmr-processing/commit/965eabf7335638cf7d150acb34118ef15c28a9d5))
