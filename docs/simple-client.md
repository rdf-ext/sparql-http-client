# SimpleClient

For full control of the SPARQL response, the `SimpleClient` can be used.

All query methods return a fetch `Response` object.

`SimpleClient` does not support Graph Store protocol.

<run-kit>

```javascript
const SimpleClient = require('sparql-http-client/SimpleClient')

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

const client = new SimpleClient({ endpointUrl })
const response = await client.query.select(query, {
  headers: {
    accept: 'application/sparql-results+xml'
  }
})

await response.text()
```

</run-kit>
