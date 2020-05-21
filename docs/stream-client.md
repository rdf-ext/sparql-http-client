# StreamClient

The query methods of `StreamClient` return streams.

* `select` stream emits each row as a single object with the variable as key and the value as RDF/JS Term object
* `describe` and `construct` streams emit RDF/JS Quads.
* `ask` returns a `boolean`
* `update` does not return a value

The store methods of `StreamClient` return and consume RDF/JS streams.

## Query Example
The following example makes a `SELECT` query to the endpoint of wikidata to figure out the height of the Eiffel Tower.

<run-kit>

```javascript
const SparqlClient = require('sparql-http-client')

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
```

</run-kit>

## Store example

The following example reads all quads from the default graph from a triplestore running on `http://localhost:3030/test/data`.
`rdf-ext` is used as a factory.
The `Term` objects of `rdf-ext` have a `toString()` method which is used in the `console.log()`:

```javascript
const rdf = require('rdf-ext')
const SparqlClient = require('sparql-http-client')

const local = new SparqlClient({
  storeUrl: 'http://localhost:3030/test/data',
  factory: rdf
})

const stream = await local.store.get(rdf.defaultGraph())

stream.on('data', quad => {
  console.log(`${quad.subject} ${quad.predicate} ${quad.object}`)
})
```
