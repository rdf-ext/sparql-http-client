# sparql-http-client

[![Build Status](https://travis-ci.org/zazuko/sparql-http-client.svg?branch=master)](https://travis-ci.org/zazuko/sparql-http-client)
[![NPM Version](https://img.shields.io/npm/v/sparql-http-client.svg?style=flat)](https://npm.im/sparql-http-client)

SPARQL client for easier handling of SPARQL Queries and Graph Store requests.
The [SPARQL Protocol](https://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/) is used for [SPARQL Queries](https://www.w3.org/TR/2013/REC-sparql11-query-20130321/) and [SPARQL Updates](https://www.w3.org/TR/2013/REC-sparql11-update-20130321/). 
The [SPARQL Graph Store Protocol](https://www.w3.org/TR/2013/REC-sparql11-http-rdf-update-20130321/) is used to manage Named Graphs.

## Usage

This package provides a stream based `Client` and a `SimpleClient` for plain `fetch` requests.  
Both are based on a `BaseClient` which could be used to customize the client even further.

### Stream Client

The stream client is the default client exported by the package.
The constructor accepts a single object argument with the following properties:

- `endpointUrl`: URL of the endpoint for SPARQL Queries (optional).
- `updateUrl`: URL of the endpoint for SPARQL Updates (optional).
- `storeUrl`: URL of the endpoint for Graph Store Protocol requests (optional). 
- `user`: User for basic authentication (optional).
- `password`: Password for basic authentication (optional).
- `headers`: Headers that will be merged into all requests as fetch `Headers` object or a plain object (optional).
- `factory` = A RDF/JS factory used to create all Terms and Quads (default: `@rdfjs/data-model`).

It comes with a [fetch](https://www.npmjs.com/package/nodeify-fetch) library and parsers for triple results or `SELECT` and `ASK` queries.

All methods for SPARQL Queries or SPARQL Updates are attached to the instance property `query`.
The following query methods are available:

#### query.ask (query, { headers })

Runs an `ASK` query against the given `endpointUrl`.
It returns async a `boolean` value. 

#### query.construct (query, { headers })

Runs a `CONSTRUCT` or `DESCRIBE` query against the given `endpointUrl`.
It returns async a stream that emits the result as RDF/JS `Quads`.

#### query.select (query, { headers })

Runs a `SELECT` query against the given `endpointUrl`.
It returns async a stream that emits each row as a single object with the variable as key and the value as RDF/JS `Term` object.

#### query.update (query, { headers })

Runs an `INSERT`, `UPDATE` or `DELETE` query against the given `updateUrl`.
The method is async and doesn't have a return value.

#### Example

The following example makes a `SELECT` query to the endpoint of wikidata to figure out the height of the Eiffel Tower:

```javascript
const SparqlClient = require('sparql-http-client')

const endpointUrl = 'https://query.wikidata.org/sparql'
const query = `
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX ps: <http://www.wikidata.org/prop/statement/>
PREFIX pq: <http://www.wikidata.org/prop/qualifier/>

SELECT ?value WHERE {
  wd:Q243 p:P2048 ?height.

  ?height pq:P518 wd:Q24192182;
    ps:P2048 ?value .
}`

async function main () {
  const client = new SparqlClient({ endpointUrl })
  const stream = await client.query.select(query)

  stream.on('data', row => {
    Object.entries(row).forEach(([key, value]) => {
      console.log(`${key}: ${value.value} (${value.termType})`)
    })
  })

  stream.on('error', err => {
    console.error(err)
  })
}

main()
```

All methods for SPARQL Graph Store requests are attached to the instance property `store`.
The following store methods are available:

#### store.get (graph)

Makes a `GET` request to the given `storeUrl` and the given `graph` argument.
It returns async a stream that emits the result as RDF/JS `Quads`.

#### store.post (stream)

Makes a `POST` request to the given `storeUrl` and sends the RDF/JS `Quads` of the given stream as request content.
It returns async a stream that emits the result as RDF/JS `Quads`.
Named Graph changes are detected and requests are split accordingly.

#### store.put (stream)

Makes a `PUT` request to the given `storeUrl` and sends the RDF/JS `Quads` of the given stream as request content.
It returns async a stream that emits the result as RDF/JS `Quads`.
Named Graph changes are detected and requests are split accordingly.

#### Example

The following example reads all quads from the default graph from a triplestore running on `http://localhost:3030/test/data`.
`rdf-ext` is used as a factory.
The `Term` objects of `rdf-ext` have a `toString()` method which is used in the `console.log()`:

```javascript
const rdf = require('rdf-ext')
const SparqlClient = require('sparql-http-client')

const local = new SparqlClient({
  storeUrl: 'http://localhost:3030/test/data',
  factory: rdf
})

async function main () {
  const stream = await local.store.get(rdf.defaultGraph())

  stream.on('data', quad => {
    console.log(`${quad.subject} ${quad.predicate} ${quad.object}`)
  })
}

main()
```

### SimpleClient

The simple client just takes care of doing the `fetch` call and returns the plain `Response` object. 
It must be required like this:

```javascript
const SimpleClient = require('sparql-http-client/SimpleClient')
````

The constructor accepts a single object argument with the following properties:

- `fetch`: The `fetch` implementation which should be used for making the requests.
- `endpointUrl`: URL of the endpoint for SPARQL Queries (optional).
- `updateUrl`: URL of the endpoint for SPARQL Updates (optional).
- `storeUrl`: URL of the endpoint for Graph Store Protocol requests (optional). 
- `user`: User for basic authentication (optional).
- `password`: Password for basic authentication (optional).
- `headers`: Headers that will be merged into all requests as fetch `Headers` object or a plain object (optional).
- `factory` = A RDF/JS factory used to create all Terms and Quads (default: `@rdfjs/data-model`).

All methods for SPARQL Queries or SPARQL Updates are attached to the instance property `query`.
All methods are async.
The following query methods are available:

#### query.get (query, { headers, update = false })

Runs a query using a HTTP GET request against the given `endpointUrl` or `updateUrl` if `update` is true.

#### query.postDirect (query, { headers, update = false })

Runs a query using a direct HTTP POST request against the given `endpointUrl` or `updateUrl` if `update` is true.

#### query.postUrlencoded (query, { headers, update = false })

Runs a query using a URL encoded HTTP POST request against the given `endpointUrl` or `updateUrl` if `update` is true.

#### query.ask (query, { headers })

Runs an `ASK` query against the given `endpointUrl`. 

#### query.construct (query, { headers })

Runs a `CONSTRUCT` or `DESCRIBE` query against the given `endpointUrl`.

#### query.select (query, { headers })

Runs a `SELECT` query against the given `endpointUrl`.

#### query.update (query, { headers })

Runs an `INSERT`, `UPDATE` or `DELETE` query against the given `updateUrl`.


### Advanced Topics

#### Headers

HTTP requests to the SPARQL endpoint can have additional headers added to it.
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

#### URL class

This library uses the URL class of [universal-url](https://www.npmjs.com/package/universal-url).
Please see [universal-url-lite](https://www.npmjs.com/package/universal-url-lite) for optimized browser builds.
