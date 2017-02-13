# sparql-http-client

[![Build Status](https://travis-ci.org/zazukoians/sparql-http-client.svg?branch=master)](https://travis-ci.org/zazukoians/sparql-http-client)
[![NPM Version](https://img.shields.io/npm/v/sparql-http-client.svg?style=flat)](https://npm.im/sparql-http-client)

Simplified SPARQL HTTP request client

## Usage

```
var fetch = require('isomorphic-fetch')

var SparqlHttp = require('sparql-http-client')

// use the request module for all requests
SparqlHttp.fetch = fetch

// create an object instance for the endpoint 
var endpoint = new SparqlHttp({endpointUrl: 'http://dbpedia.org/sparql'})

// do the SELECT query 
endpoint.selectQuery('SELECT * WHERE {?s ?p ?o}', function (error, response) {
  console.log(response.body)
})
```

See the examples folder for more complex examples.

## Licence

MIT
