# sparql-http-client

[![Build Status](https://travis-ci.org/zazuko/sparql-http-client.svg?branch=master)](https://travis-ci.org/zazuko/sparql-http-client)
[![NPM Version](https://img.shields.io/npm/v/sparql-http-client.svg?style=flat)](https://npm.im/sparql-http-client)

## Contents of this package

This package provides a handful of clients which can talk to SPARQL endpoints using Query, Update and/or Graph Store Protocols.

1. [`StreamClient`](stream-client.md) - returns [streams of RDF/JS triples](http://rdf.js.org/stream-spec/#stream-interface) or SELECT bindings
2. [`ParsingClient`](parsing-client.md) - extends the `StreamClient` to return fully parsed [RDF/JS Dataset](https://rdf.js.org/dataset-spec/#datasetcore-interface) or JS array of SELECT bindings
3. [`SimpleClient`](simple-client.md) - returns raw underlying [fetch `Response`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Response_objects)

[`StreamClient`](stream-client.md) is the default export of this package's main module.

Every client implementation inherits from a `BaseClient`. They all share the most of the base API and parameters.

## Usage

### Creating a client

The constructor of all clients accepts a single object argument with the following properties:

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| endpointUrl | <code>string</code> |  | URL of the endpoint for SPARQL Queries |
| updateUrl | <code>string</code> |  | URL of the endpoint for SPARQL Updates |
| storeUrl | <code>string</code> |  | URL of the endpoint for Graph Store Protocol requests |
| headers | <code>HeadersInit</code> |  | Headers that will be merged into all requests as fetch |
| user | <code>string</code> |  | User for basic authentication |
| password | <code>string</code> |  | Password used for basic authentication |
| factory | <code>factory</code> | `@rdfjs/data-model` | A RDF/JS factory used to create all Terms and Quads |
| fetch | <code>fetch</code> | <code>nodeify-fetch</code> | fetch implementation |

All properties are optional but omitting some of them will disable certain capabilities. Also not all properties are supported by all implementations. Check their respective pages.

Clients come with a [fetch](https://www.npmjs.com/package/nodeify-fetch) library and parsers for triple results or `SELECT` and `ASK` queries.

### Queries

All methods for SPARQL Queries or SPARQL Updates are attached to the instance property `query`. They are all async.

Their return types depend on the client specific client implementation.

The following query methods are available:

#### query.ask (query, { headers, operation })

Runs an `ASK` query against the given `endpointUrl`.

#### query.construct (query, { headers, operation })

Runs a `CONSTRUCT` or `DESCRIBE` query against the given `endpointUrl`.

#### query.select (query, { headers, operation })

Runs a `SELECT` query against the given `endpointUrl`.

#### query.update (query, { headers, operation })

Runs an `INSERT`, `UPDATE` or `DELETE` query against the given `updateUrl`.

### Graph Store

All methods for SPARQL Graph Store requests are attached to the instance property `store`.

Their return types depend on the client specific client implementation.

The following store methods are available:

#### store.get (graph)

Makes a `GET` request to the given `storeUrl` and the given `graph` argument.

#### store.post (stream)

Makes a `POST` request to the given `storeUrl` and sends the RDF/JS `Quads` of the given stream as request content. Named Graph changes are detected and requests are split accordingly.

#### store.put (stream)

Makes a `PUT` request to the given `storeUrl` and sends the RDF/JS `Quads` of the given stream as request content. Named Graph changes are detected and requests are split accordingly.

### Advanced Topics

#### Headers

HTTP requests to the SPARQL endpoint can have additional headers added to them.
For example, to pass authorization information.

One method for doing so is to set headers on a single query or update:

```javascript
const client = new SparqlClient({ endpointUrl: 'https://query.wikidata.org/sparql' })

// authorize a single query
client.query.select(query, {
  headers: {
    Authorization: 'Bearer token'
  }
})
```

It is also possible to set headers in the constructor of the client.
The headers will be sent on all requests originating from the instance of the client:

```javascript
// authorize all requests
const client = new SparqlClient({
  endpointUrl: 'https://query.wikidata.org/sparql',
  headers: {
    Authorization: 'Bearer token'
  }
})
```

#### Operation

SPARQL queries and updates over the SPARQL Protocol can be done with different [operations](https://www.w3.org/TR/sparql11-protocol/#protocol).
By default all read queries use `get` and updates use `postUrlencoded`.
Very long queries may exceed the maximum request header length.
For those cases, it's useful to switch to operations that use a `POST` request.
This can be done by the optional `operation` argument.
The value must be a string with one of the following values:

- `get`
- `postUrlencoded`
- `postDirect`
