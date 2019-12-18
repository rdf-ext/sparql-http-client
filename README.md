# sparql-http-client

[![Build Status](https://travis-ci.org/zazuko/sparql-http-client.svg?branch=master)](https://travis-ci.org/zazuko/sparql-http-client)
[![NPM Version](https://img.shields.io/npm/v/sparql-http-client.svg?style=flat)](https://npm.im/sparql-http-client)

Simplified SPARQL HTTP request client

## Usage

```
var fetch = require('isomorphic-fetch')
var {URL} = require('whatwg-url')
var SparqlHttp = require('sparql-http-client')

SparqlHttp.fetch = fetch
SparqlHttp.URL = URL

// which endpoint to query
var endpoint = new SparqlHttp({endpointUrl: 'https://query.wikidata.org/sparql'})

// the SPARQL query itself
var query = 'SELECT ?height WHERE { wd:Q243 wdt:P2048 ?height . }'

// run query with promises
endpoint.selectQuery(query).then(function (res) {

  return res.text()

// result body of the query
}).then(function (body) {
  // parse the body for pretty print
  console.log(body)
  var result = JSON.parse(body)

  // output the complete result object
  console.log(JSON.stringify(result, null, ' '))

// necessary catch the error
}).catch(function (err) {

  console.error(err)

})
```

See the examples folder for more complex examples.

### Request headers

HTTP requests to the SPARQL endpoint can have additional headers added to it, for example to pass authorization information.

One method for doing so is to set headers on a single query or update:

```js
var endpoint = new SparqlHttp({endpointUrl: 'https://query.wikidata.org/sparql'})

// authorize a single query
endpoint.selectQuery(query, {
  headers: {
    Authorization: 'Bearer token'
  }
})
```

It is also possible to set defautl headers, which will be set on all query requests originating from an instance of
the client:

```js
// authorize all requests
var endpoint = new SparqlHttp({
  endpointUrl: 'https://query.wikidata.org/sparql'
  defaultHeaders: {
    Authorization: 'Bearer token'
  }
})
```

## Note on polyfills

`sparql-http-client` does not install `URL` and `fetch` implementation. It will work
out of the box in modern environments. In older browsers or version of node it may be
necessary to provide it manually using static fields of `SparqlHttp` (as seen above)
or by passing them to the constructor.

```js
new SparqlHttp({
  fetch,
  URL,
})
```

## Licence

MIT
