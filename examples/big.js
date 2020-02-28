const namespace = require('@rdfjs/namespace')
const { Transform } = require('readable-stream')
const SparqlClient = require('../Client')

const ns = {
  dbr: namespace('http://dbpedia.org/resource/'),
  rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  rdfs: namespace('http://www.w3.org/2000/01/rdf-schema#')
}

const dbpedia = new SparqlClient({ endpointUrl: 'http://dbpedia.org/sparql' })
const local = new SparqlClient({
  endpointUrl: 'http://localhost:3030/test/sparql',
  storeUrl: 'http://localhost:3030/test/data'
})

const describeQuery = `DESCRIBE <${ns.dbr.Eiffel_Tower.value}>`
const selectQuery = `SELECT ?label WHERE { ?s <${ns.rdfs.label.value}> ?label . }`

function removeEmptyLangString () {
  return new Transform({
    objectMode: true,
    transform: (quad, encoding, callback) => {
      const object = quad.object

      if (object.termType === 'Literal' && object.datatype.equals(ns.rdf.langString) && object.language === '') {
        return callback()
      }

      callback(null, quad)
    }
  })
}

async function main () {
  // read all triples related to Eiffel Tower via describe construct query as a quad stream
  const input = await dbpedia.query.construct(describeQuery)

  // import the quad stream into a local store (remove literals with empty language strings)
  await local.store.put(input.pipe(removeEmptyLangString()))

  // run a select query on the local store that will return all labels
  const result = await local.query.select(selectQuery)

  // write all labels + language to the console
  result.on('data', row => {
    console.log(`${row.label.value} (${row.label.language})`)
  })
}

main()
