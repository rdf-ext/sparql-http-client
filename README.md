# sparql-http-client

[![Build Status](https://travis-ci.org/zazukoians/sparql-http-client.svg?branch=master)](https://travis-ci.org/zazukoians/sparql-http-client)
[![NPM Version](https://img.shields.io/npm/v/sparql-http-client.svg?style=flat)](https://npm.im/sparql-http-client)

Simplified SPARQL HTTP request client

## Usage

```
var fetch = require('isomorphic-fetch')
var SparqlHttp = require('sparql-http-client')

SparqlHttp.fetch = fetch

// which endpoint to query
var endpoint = new SparqlHttp({endpointUrl: 'http://dbpedia.org/sparql'})

// the SPARQL query itself
var query = 'SELECT ?height WHERE { <http://dbpedia.org/resource/Eiffel_Tower> <http://dbpedia.org/property/height> ?height }'

// run query with promises
endpoint.selectQuery(query).then(function (res) {

  return res.text()
  
// result body of the query
}).then(function (body) {
  // parse the body for pretty print
  var result = JSON.parse(body)

  // output the complete result object
  console.log(JSON.stringify(result, null, ' '))
  
// necessary catch the error
}).catch(function (err) {

  console.error(err)
  
})
```

See the examples folder for more complex examples.

## Licence

MIT
