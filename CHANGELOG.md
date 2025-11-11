# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] - 2025-11-11

### Added

- support for URL parameters in constructor and method calls
- support for standard query parameters (`defaultGraph` and `namedGraph`)
- support for standard update parameters (`usingGraph` and `usingNamedGraph`)

## [3.0.0] - 2024-02-18

### Added

- ESM support
- exports for all classes in the `index.js` package entrypoint

### Changed

- options like `endpointUrl`, `user`, and `password` are attached to the client object, allowing creating new client
  instances from existing instances
- methods that return a `Readable` stream objects are sync
- updated dependencies

### Removed

- CommonJS support
- `BaseClient` and `Endpoint` class
- automatic request splitting for Graph Store uploads
