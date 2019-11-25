const fetch = require('isomorphic-fetch')
const SparqlHttp = require('../')

SparqlHttp.fetch = fetch

const endpoint = new SparqlHttp({ endpointUrl: 'http://dbpedia.org/sparql' })
const query = 'SELECT ?height WHERE { <http://dbpedia.org/resource/Eiffel_Tower> <http://dbpedia.org/property/height> ?height }'

async function main () {
  const res = await endpoint.selectQuery(query)
  const stream = res.body
  let content = ''

  stream.on('data', result => {
    content += result.toString()
  })

  stream.on('end', () => {
    // parse and stringify the content for pretty print
    console.log(JSON.stringify(JSON.parse(content), null, ' '))
  })

  stream.on('error', err => {
    console.error(err)
  })
}

main()
