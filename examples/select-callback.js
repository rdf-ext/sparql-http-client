var request = require('../node_modules/request')
var SparqlHttp = require('../')

// use the request module for all requests
SparqlHttp.request = SparqlHttp.requestModuleRequest(request)

var endpoint = new SparqlHttp({endpointUrl: 'http://dbpedia.org/sparql'})
var query = 'SELECT ?height WHERE { <http://dbpedia.org/resource/Eiffel_Tower> <http://dbpedia.org/property/height> ?height }'

endpoint.selectQuery(query, function (error, response) {
  if (error) {
    console.error(error)
  } else {
    // returns the request object, so let's parse the body for pretty print
    var result = JSON.parse(response.body)

    // output the complete result object
    console.log(JSON.stringify(result, null, ' '))
  }
})
