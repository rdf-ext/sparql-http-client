# sparql-http

Simplified SPARQL HTTP request client

## Usage

```
var request = require('request')
var SparqlHttp = require('sparql-http-client')

// use the request module for all requests
SparqlHttp.request = SparqlHttp.requestModuleRequest(request)

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
