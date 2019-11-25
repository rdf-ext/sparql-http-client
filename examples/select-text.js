const fetch = require('isomorphic-fetch')
const SparqlHttp = require('../')

SparqlHttp.fetch = fetch

const endpoint = new SparqlHttp({ endpointUrl: 'http://dbpedia.org/sparql' })
const query = 'SELECT ?height WHERE { <http://dbpedia.org/resource/Eiffel_Tower> <http://dbpedia.org/property/height> ?height }'

async function main () {
  const res = await endpoint.selectQuery(query)
  const body = await res.text()

  // parse the body for pretty print
  const result = JSON.parse(body)

  // output the complete result object
  console.log(JSON.stringify(result, null, ' '))
}

main()
