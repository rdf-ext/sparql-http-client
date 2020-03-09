/*

This example uses the default Client to make a SELECT query and processes the stream events for each row.

*/

const SparqlClient = require('..')

const endpointUrl = 'https://query.wikidata.org/sparql'
const query = `
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX ps: <http://www.wikidata.org/prop/statement/>
PREFIX pq: <http://www.wikidata.org/prop/qualifier/>

SELECT ?value WHERE {
  wd:Q243 p:P2048 ?height.

  ?height pq:P518 wd:Q24192182;
    ps:P2048 ?value .
}`

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
