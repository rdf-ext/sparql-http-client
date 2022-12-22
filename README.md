# sparql-http-client

[![build status](https://img.shields.io/github/actions/workflow/status/bergos/sparql-http-client/ci.yaml?branch=master)](https://github.com/bergos/sparql-http-client/actions/workflows/ci.yaml)
[![npm version](https://img.shields.io/npm/v/sparql-http-client.svg)](https://www.npmjs.com/package/sparql-http-client)

SPARQL client for easier handling of SPARQL Queries and Graph Store requests.
The [SPARQL Protocol](https://www.w3.org/TR/sparql11-protocol/) is used for [SPARQL Queries](https://www.w3.org/TR/sparql11-query/) and [SPARQL Updates](https://www.w3.org/TR/sparql11-update/). 
The [SPARQL Graph Store Protocol](https://www.w3.org/TR/sparql11-http-rdf-update/) is used to manage Named Graphs.

## Getting started example

TL;DR; the package exports a `StreamClient` class which run SPARQL queries on an endpoint.

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

Find more details on [https://bergos.github.io/sparql-http-client/](https://bergos.github.io/sparql-http-client/)
