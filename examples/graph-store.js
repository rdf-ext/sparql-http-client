import rdf from 'rdf-ext'
import SparqlClient from '../StreamClient.js'

const client = new SparqlClient({
  storeUrl: 'http://localhost:3030/test/data',
  factory: rdf
})

async function main () {
  const stream = client.store.get(rdf.defaultGraph())

  stream.on('data', quad => {
    console.log(`${quad.subject} ${quad.predicate} ${quad.object}`)
  })
}

main()
