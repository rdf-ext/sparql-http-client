/*

This example
 - uses a DESCRIBE query to fetch triples from wikidata
 - writes the result into a local triplestore using graph store
 - runs a SELECT query on the local triplestore

To get this example running, you need to start a triplestore with:
 - endpoint URL: http://localhost:3030/test/sparql
 - graph store URL: http://localhost:3030/test/data

Using Fuseki is the easiest way to get the required setup running.
The following steps are required:
 - download and install Fuseki from https://jena.apache.org/documentation/fuseki2/
 - start the server with the command `fuseki-server`
 - go to the web interface at http://localhost:3030/ and create a in memory dataset with the name test

*/

const namespace = require('@rdfjs/namespace')
const SparqlClient = require('..')

const ns = {
  rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  rdfs: namespace('http://www.w3.org/2000/01/rdf-schema#'),
  wd: namespace('http://www.wikidata.org/entity/')
}

const dbpedia = new SparqlClient({ endpointUrl: 'https://query.wikidata.org/sparql' })
const local = new SparqlClient({
  endpointUrl: 'http://localhost:3030/test/sparql',
  storeUrl: 'http://localhost:3030/test/data'
})

const describeQuery = `DESCRIBE <${ns.wd.Q243.value}>`
const selectQuery = `SELECT ?label WHERE { ?s <${ns.rdfs.label.value}> ?label . }`

async function main () {
  // read all triples related to Eiffel Tower via describe construct query as a quad stream
  const input = await dbpedia.query.construct(describeQuery)

  // import the quad stream into a local store (remove literals with empty language strings)
  await local.store.put(input)

  // run a select query on the local store that will return all labels
  const result = await local.query.select(selectQuery)

  // write all labels + language to the console
  result.on('data', row => {
    console.log(`${row.label.value} (${row.label.language})`)
  })
}

main()
