import rdf from 'rdf-ext'
import SparqlClient from '../index.js'

const local = new SparqlClient({
  storeUrl: 'http://localhost:3030/test/data',
  factory: rdf
})

async function main () {
  const stream = await local.store.get(rdf.defaultGraph())

  stream.on('data', quad => {
    console.log(`${quad.subject} ${quad.predicate} ${quad.object}`)
  })
}

main()
