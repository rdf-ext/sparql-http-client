# sparql-http-client

[![build status](https://img.shields.io/github/actions/workflow/status/rdf-ext/sparql-http-client/test.yaml?branch=master)](https://github.com/rdf-ext/sparql-http-client/actions/workflows/test.yaml)
[![npm version](https://img.shields.io/npm/v/sparql-http-client.svg)](https://www.npmjs.com/package/sparql-http-client)

SPARQL client for easier handling of SPARQL Queries and Graph Store requests.
The [SPARQL Protocol](https://www.w3.org/TR/sparql11-protocol/) is used for [SPARQL Queries](https://www.w3.org/TR/sparql11-query/) and [SPARQL Updates](https://www.w3.org/TR/sparql11-update/). 
The [SPARQL Graph Store Protocol](https://www.w3.org/TR/sparql11-http-rdf-update/) is used to manage Named Graphs.

It provides client implementations in different flavors.
The default client comes with an interface for [streams](https://github.com/nodejs/readable-stream), the simple client is closer to [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), and the parsing client wraps the results directly into [RDF/JS DatasetCore](https://rdf.js.org/dataset-spec/#datasetcore-interface) objects or arrays.

## Usage

The example below shows how to use the client to run a `SELECT` query against the Wikidata endpoint.
Check the [documentation](https://rdf-ext.github.io/sparql-http-client/) for more details.

```javascript
import SparqlClient from 'sparql-http-client'

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
const stream = client.query.select(query)

stream.on('data', row => {
  for (const [key, value] of Object.entries(row)) {
    console.log(`${key}: ${value.value} (${value.termType})`)
  }
})

stream.on('error', err => {
  console.error(err)
})
```
