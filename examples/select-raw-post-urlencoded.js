/*

This example uses the SimpleClient to make a SELECT query using a URL encoded POST request.

*/

const SparqlClient = require('../SimpleClient')

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
  const res = await client.query.select(query, { operation: 'postUrlencoded' })

  if (!res.ok) {
    return console.error(res.statusText)
  }

  const content = await res.json()

  for (const row of content.results.bindings) {
    Object.entries(row).forEach(([key, value]) => {
      console.log(`${key}: ${value.value} (${value.type})`)
    })
  }
}

main()
