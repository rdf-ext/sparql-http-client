var fetch = require('isomorphic-fetch')
var SparqlHttp = require('../')

SparqlHttp.fetch = fetch

var endpoint = new SparqlHttp({endpointUrl: 'http://dbpedia.org/sparql'})
var query = 'SELECT ?height WHERE { <http://dbpedia.org/resource/Eiffel_Tower> <http://dbpedia.org/property/height> ?height }'

endpoint.selectQuery(query).then(function (res) {
  return res.text()
}).then(function (body) {
  // parse the body for pretty print
  var result = JSON.parse(body)

  // output the complete result object
  console.log(JSON.stringify(result, null, ' '))
}).catch(function (err) {
  console.error(err)
})
