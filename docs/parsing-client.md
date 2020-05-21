# ParsingClient

Query results returned by the `ParsingClient` are not streams but actual triples or arrays.

* `select` returns an array of objects which represent rows of query results.
* `describe` and `construct` return an RDF/JS Dataset
* `ask` returns a `boolean`
* `update` does not return a value

The `ParsingClient` does not support the Graph Store protocol

## Query Example

<run-kit>

```javascript
const ParsingClient = require('sparql-http-client/ParsingClient')

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

const client = new ParsingClient({ endpointUrl })
const bindings = await client.query.select(query)

bindings.forEach(row => 
  Object.entries(row).forEach(([key, value]) => {
    console.log(`${key}: ${value.value} (${value.termType})`)
  })
)
```

</run-kit>
