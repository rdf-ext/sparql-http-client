/*

This example uses the SimpleClient and upgrades it to a ParsingClient to make a SELECT query and processes the result.

*/

import ParsingClient from '../ParsingClient.js'
import SimpleClient from '../SimpleClient.js'

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
  const simpleClient = new SimpleClient({ endpointUrl })
  const parsingClient = new ParsingClient(simpleClient)
  const result = await parsingClient.query.select(query)

  for (const row of result) {
    for (const [key, value] of Object.entries(row)) {
      console.log(`${key}: ${value.value} (${value.termType})`)
    }
  }
}

main()
