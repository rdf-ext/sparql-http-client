# sparql-http-client

[![build status](https://img.shields.io/github/actions/workflow/status/rdf-ext/sparql-http-client/test.yaml?branch=master)](https://github.com/rdf-ext/sparql-http-client/actions/workflows/test.yaml)
[![npm version](https://img.shields.io/npm/v/sparql-http-client.svg)](https://www.npmjs.com/package/sparql-http-client)

This package provides a handful of clients that can talk to SPARQL endpoints using Query, Update, and Graph Store Protocols.

- [`StreamClient`](stream-client.md): The default client implementation parses SPARQL results into Readable streams of RDF/JS Quad objects (`CONSTRUCT`/`DESCRIBE`) or Readable streams of objects (`SELECT`).
  Graph Store read and write operations are handled using Readable streams.
- [`ParsingClient`](parsing-client.md): A client implementation that parses SPARQL results into RDF/JS DatasetCore objects (`CONSTRUCT`/`DESCRIBE`) or an array of objects (`SELECT`).
  It does not provide a store interface.
- [`SimpleClient`](simple-client.md): A client implementation that prepares URLs and headers for SPARQL queries and returns the raw fetch response.
  It does not provide a store interface.

[`StreamClient`](stream-client.md) is the default export of the package.

## Usage

### Creating a client

The constructor of all clients accepts a single object argument with the following properties:

| Param       | Type                  | Default                                | Description                                 |
|-------------|-----------------------|----------------------------------------|---------------------------------------------|
| endpointUrl | <code>string</code>   |                                        | SPARQL query endpoint URL                   |
| updateUrl   | <code>string</code>   |                                        | SPARQL update endpoint URL                  |
| storeUrl    | <code>string</code>   |                                        | SPARQL Graph Store URL                      |
| user        | <code>string</code>   |                                        | user used for basic authentication          |
| password    | <code>string</code>   |                                        | password used for basic authentication      |
| headers     | <code>Headers</code>  |                                        | headers sent with every request             |
| factory     | <code>factory</code>  | `@rdfjs/data-model` & `@rdfjs/dataset` | RDF/JS factory                              |
| fetch       | <code>fetch</code>    | `nodeify-fetch`                        | fetch implementation                        |

At least one URL argument must be given.
Besides that, all properties are optional, but omitting some of them will disable certain capabilities.
Also, not all properties are supported by all implementations. Check their respective pages.

A client object has all properties attached required to create a new instance.
It is, therefore, possible to create a new client object of a different type based on an existing client object:

```javascript
const simpleClient = new SimpleClient({ endpointUrl })
const parsingClient = new ParsingClient(simpleClient)
```

### Examples

The [API](api.md) section contains examples for all clients.

### Queries

All methods for SPARQL Queries and Updates are attached to the instance property `query`.
Their return types are implementation-specific.
See the [API](api.md) section for more details on the individual methods.

### Graph Store

All methods for SPARQL Graph Store are attached to the instance property `store`.
See the [API](api.md) section for more details on the individual methods.

### Advanced Topics

#### Headers

HTTP requests to the SPARQL endpoint can have additional headers added to them.
For example, to pass authorization information.

One method for doing so is to set headers on the method call:

```javascript
const client = new SparqlClient({ endpointUrl: 'https://query.wikidata.org/sparql' })

client.query.select(query, {
  headers: {
    Authorization: 'Bearer token'
  }
})
```

It is also possible to set headers in the constructor of the client.

The headers will be sent on all requests originating from the instance of the client:

```javascript
const client = new SparqlClient({
  endpointUrl: 'https://query.wikidata.org/sparql',
  headers: {
    Authorization: 'Bearer token'
  }
})
```

#### Operation

SPARQL queries and updates over the SPARQL Protocol can be done with different [operations](https://www.w3.org/TR/sparql11-protocol/#protocol).
By default, all read queries use `get`, and updates use `postUrlencoded`.
Very long queries may exceed the maximum request header length.
For those cases, it's useful to switch to operations that use a `POST` request.
This can be done by the optional `operation` argument.
