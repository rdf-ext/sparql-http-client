const SparqlClient = require('../Client')

const endpointUrl = 'http://dbpedia.org/sparql'
const query = 'SELECT ?height WHERE { <http://dbpedia.org/resource/Eiffel_Tower> <http://dbpedia.org/property/height> ?height }'

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
