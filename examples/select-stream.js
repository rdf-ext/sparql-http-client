var request = require('../node_modules/request')
var SparqlHttp = require('../')

// use the request module for all requests
SparqlHttp.request = SparqlHttp.requestModuleRequest(request)

var endpoint = new SparqlHttp({endpointUrl: 'http://dbpedia.org/sparql'})
var query = 'SELECT ?height WHERE { <http://dbpedia.org/resource/Eiffel_Tower> <http://dbpedia.org/property/height> ?height }'

var stream = endpoint.selectQuery(query)
var content = ''

stream.on('data', function (result) {
  content += result.toString()
})

stream.on('end', function () {
  // parse and stringify the content for pretty print
  console.log(JSON.stringify(JSON.parse(content), null, ' '))
})

stream.on('error', function (error) {
  console.error(error)
})
