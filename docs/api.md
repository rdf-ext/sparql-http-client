## Classes

<dl>
<dt><a href="#ParsingClient">ParsingClient</a> ⇐ <code><a href="#SimpleClient">SimpleClient</a></code></dt>
<dd><p>A client implementation based on <a href="#ParsingQuery">ParsingQuery</a> that parses SPARQL results into RDF/JS DatasetCore objects
(CONSTRUCT/DESCRIBE) or an array of objects (SELECT). It does not provide a store interface.</p>
</dd>
<dt><a href="#ParsingQuery">ParsingQuery</a> ⇐ <code><a href="#StreamQuery">StreamQuery</a></code></dt>
<dd><p>A query implementation that wraps the results of the <a href="#StreamQuery">StreamQuery</a> into RDF/JS DatasetCore objects
(CONSTRUCT/DESCRIBE) or an array of objects (SELECT).</p>
</dd>
<dt><a href="#RawQuery">RawQuery</a></dt>
<dd><p>A query implementation that prepares URLs and headers for SPARQL queries and returns the raw fetch response.</p>
</dd>
<dt><a href="#ResultParser">ResultParser</a></dt>
<dd><p>A Transform stream that parses JSON SPARQL results and emits one object per row with the variable names as keys and
RDF/JS terms as values.</p>
</dd>
<dt><a href="#SimpleClient">SimpleClient</a></dt>
<dd><p>A client implementation based on <a href="#RawQuery">RawQuery</a> that prepares URLs and headers for SPARQL queries and returns the
raw fetch response. It does not provide a store interface.</p>
</dd>
<dt><a href="#StreamClient">StreamClient</a> ⇐ <code><a href="#SimpleClient">SimpleClient</a></code></dt>
<dd><p>The default client implementation based on <a href="#StreamQuery">StreamQuery</a> and <a href="#StreamStore">StreamStore</a> parses SPARQL results into
Readable streams of RDF/JS Quad objects (CONSTRUCT/DESCRIBE) or Readable streams of objects (SELECT). Graph Store
read and write operations are handled using Readable streams.</p>
</dd>
<dt><a href="#StreamQuery">StreamQuery</a> ⇐ <code><a href="#RawQuery">RawQuery</a></code></dt>
<dd><p>A query implementation based on <a href="#RawQuery">RawQuery</a> that parses SPARQL results into Readable streams of RDF/JS Quad
objects (CONSTRUCT/DESCRIBE) or Readable streams of objects (SELECT).</p>
</dd>
<dt><a href="#StreamStore">StreamStore</a></dt>
<dd><p>A store implementation that parses and serializes SPARQL Graph Store responses and requests into/from Readable
streams.</p>
</dd>
</dl>

<a name="ParsingClient"></a>

## ParsingClient ⇐ [<code>SimpleClient</code>](#SimpleClient)
A client implementation based on [ParsingQuery](#ParsingQuery) that parses SPARQL results into RDF/JS DatasetCore objects
(CONSTRUCT/DESCRIBE) or an array of objects (SELECT). It does not provide a store interface.

**Kind**: global class  
**Extends**: [<code>SimpleClient</code>](#SimpleClient)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code><a href="#ParsingQuery">ParsingQuery</a></code></td>
    </tr>  </tbody>
</table>


* [ParsingClient](#ParsingClient) ⇐ [<code>SimpleClient</code>](#SimpleClient)
    * [new ParsingClient(options)](#new_ParsingClient_new)
    * [.get(query, options)](#SimpleClient+get) ⇒ <code>Promise.&lt;Response&gt;</code>
    * [.postDirect(query, options)](#SimpleClient+postDirect) ⇒ <code>Promise.&lt;Response&gt;</code>
    * [.postUrlencoded(query, options)](#SimpleClient+postUrlencoded) ⇒ <code>Promise.&lt;Response&gt;</code>

<a name="new_ParsingClient_new"></a>

### new ParsingClient(options)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.endpointUrl]</td><td><code>string</code></td><td></td><td><p>SPARQL query endpoint URL</p>
</td>
    </tr><tr>
    <td>[options.factory]</td><td><code>factory</code></td><td></td><td><p>RDF/JS factory</p>
</td>
    </tr><tr>
    <td>[options.fetch]</td><td><code>fetch</code></td><td><code>nodeify-fetch</code></td><td><p>fetch implementation</p>
</td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>headers sent with every request</p>
</td>
    </tr><tr>
    <td>[options.password]</td><td><code>string</code></td><td></td><td><p>password used for basic authentication</p>
</td>
    </tr><tr>
    <td>[options.storeUrl]</td><td><code>string</code></td><td></td><td><p>SPARQL Graph Store URL</p>
</td>
    </tr><tr>
    <td>[options.updateUrl]</td><td><code>string</code></td><td></td><td><p>SPARQL update endpoint URL</p>
</td>
    </tr><tr>
    <td>[options.user]</td><td><code>string</code></td><td></td><td><p>user used for basic authentication</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// read the height of the Eiffel Tower from Wikidata with a SELECT query

import ParsingClient from 'sparql-http-client/ParsingClient.js'

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
const result = await client.query.select(query)

for (const row of result) {
  for (const [key, value] of Object.entries(row)) {
    console.log(`${key}: ${value.value} (${value.termType})`)
  }
}
```
<a name="SimpleClient+get"></a>

### parsingClient.get(query, options) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends a GET request as defined in the
[SPARQL Protocol specification](https://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-via-get).

**Kind**: instance method of [<code>ParsingClient</code>](#ParsingClient)  
**Overrides**: [<code>get</code>](#SimpleClient+get)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>SPARQL query</p>
</td>
    </tr><tr>
    <td>options</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr><tr>
    <td>[options.update]</td><td><code>boolean</code></td><td><code>false</code></td><td><p>send the request to the updateUrl</p>
</td>
    </tr>  </tbody>
</table>

<a name="SimpleClient+postDirect"></a>

### parsingClient.postDirect(query, options) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends a POST directly request as defined in the
[SPARQL Protocol specification](https://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-via-post-direct).

**Kind**: instance method of [<code>ParsingClient</code>](#ParsingClient)  
**Overrides**: [<code>postDirect</code>](#SimpleClient+postDirect)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>SPARQL query</p>
</td>
    </tr><tr>
    <td>options</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr><tr>
    <td>[options.update]</td><td><code>boolean</code></td><td><code>false</code></td><td><p>send the request to the updateUrl</p>
</td>
    </tr>  </tbody>
</table>

<a name="SimpleClient+postUrlencoded"></a>

### parsingClient.postUrlencoded(query, options) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends a POST URL-encoded request as defined in the
[SPARQL Protocol specification](https://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-via-post-urlencoded).

**Kind**: instance method of [<code>ParsingClient</code>](#ParsingClient)  
**Overrides**: [<code>postUrlencoded</code>](#SimpleClient+postUrlencoded)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>SPARQL query</p>
</td>
    </tr><tr>
    <td>options</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr><tr>
    <td>[options.update]</td><td><code>boolean</code></td><td><code>false</code></td><td><p>send the request to the updateUrl</p>
</td>
    </tr>  </tbody>
</table>

<a name="ParsingQuery"></a>

## ParsingQuery ⇐ [<code>StreamQuery</code>](#StreamQuery)
A query implementation that wraps the results of the [StreamQuery](#StreamQuery) into RDF/JS DatasetCore objects
(CONSTRUCT/DESCRIBE) or an array of objects (SELECT).

**Kind**: global class  
**Extends**: [<code>StreamQuery</code>](#StreamQuery)  

* [ParsingQuery](#ParsingQuery) ⇐ [<code>StreamQuery</code>](#StreamQuery)
    * [.construct(query, options)](#ParsingQuery+construct) ⇒ <code>Promise.&lt;DatasetCore&gt;</code>
    * [.select(query, [options])](#ParsingQuery+select) ⇒ <code>Promise.&lt;Array.&lt;Object.&lt;string, Term&gt;&gt;&gt;</code>
    * [.ask(query, [options])](#StreamQuery+ask) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.update(query, [options])](#StreamQuery+update) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="ParsingQuery+construct"></a>

### parsingQuery.construct(query, options) ⇒ <code>Promise.&lt;DatasetCore&gt;</code>
Sends a request for a CONSTRUCT or DESCRIBE query

**Kind**: instance method of [<code>ParsingQuery</code>](#ParsingQuery)  
**Overrides**: [<code>construct</code>](#StreamQuery+construct)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>CONSTRUCT or DESCRIBE query</p>
</td>
    </tr><tr>
    <td>options</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;get&#x27;</code></td><td><p>SPARQL Protocol operation</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr>  </tbody>
</table>

<a name="ParsingQuery+select"></a>

### parsingQuery.select(query, [options]) ⇒ <code>Promise.&lt;Array.&lt;Object.&lt;string, Term&gt;&gt;&gt;</code>
Sends a request for a SELECT query

**Kind**: instance method of [<code>ParsingQuery</code>](#ParsingQuery)  
**Overrides**: [<code>select</code>](#StreamQuery+select)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>SELECT query</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;get&#x27;</code></td><td><p>SPARQL Protocol operation</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr>  </tbody>
</table>

<a name="StreamQuery+ask"></a>

### parsingQuery.ask(query, [options]) ⇒ <code>Promise.&lt;boolean&gt;</code>
Sends a request for a ASK query

**Kind**: instance method of [<code>ParsingQuery</code>](#ParsingQuery)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>ASK query</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;get&#x27;</code></td><td><p>SPARQL Protocol operation</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr>  </tbody>
</table>

<a name="StreamQuery+update"></a>

### parsingQuery.update(query, [options]) ⇒ <code>Promise.&lt;void&gt;</code>
Sends a request for an update query

**Kind**: instance method of [<code>ParsingQuery</code>](#ParsingQuery)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>update query</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;postUrlencoded&#x27;</code></td><td><p>SPARQL Protocol operation</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr>  </tbody>
</table>

<a name="RawQuery"></a>

## RawQuery
A query implementation that prepares URLs and headers for SPARQL queries and returns the raw fetch response.

**Kind**: global class  

* [RawQuery](#RawQuery)
    * [new RawQuery(options)](#new_RawQuery_new)
    * [.ask(query, [options])](#RawQuery+ask) ⇒ <code>Promise.&lt;Response&gt;</code>
    * [.construct(query, [options])](#RawQuery+construct) ⇒ <code>Promise.&lt;Response&gt;</code>
    * [.select(query, [options])](#RawQuery+select) ⇒ <code>Promise.&lt;Response&gt;</code>
    * [.update(query, [options])](#RawQuery+update) ⇒ <code>Promise.&lt;Response&gt;</code>

<a name="new_RawQuery_new"></a>

### new RawQuery(options)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>Object</code></td><td></td>
    </tr><tr>
    <td>options.client</td><td><code><a href="#SimpleClient">SimpleClient</a></code></td><td><p>client that provides the HTTP I/O</p>
</td>
    </tr>  </tbody>
</table>

<a name="RawQuery+ask"></a>

### rawQuery.ask(query, [options]) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends a request for a ASK query

**Kind**: instance method of [<code>RawQuery</code>](#RawQuery)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>ASK query</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.defaultGraph]</td><td><code>Array.&lt;string&gt;</code></td><td></td><td><p>default graph URI parameter</p>
</td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.namedGraph]</td><td><code>Array.&lt;string&gt;</code></td><td></td><td><p>named graph URI parameter</p>
</td>
    </tr><tr>
    <td>[options.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;get&#x27;</code></td><td><p>SPARQL Protocol operation</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr>  </tbody>
</table>

<a name="RawQuery+construct"></a>

### rawQuery.construct(query, [options]) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends a request for a CONSTRUCT or DESCRIBE query

**Kind**: instance method of [<code>RawQuery</code>](#RawQuery)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>CONSTRUCT or DESCRIBE query</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.defaultGraph]</td><td><code>Array.&lt;string&gt;</code></td><td></td><td><p>default graph URI parameter</p>
</td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.namedGraph]</td><td><code>Array.&lt;string&gt;</code></td><td></td><td><p>named graph URI parameter</p>
</td>
    </tr><tr>
    <td>[options.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;get&#x27;</code></td><td><p>SPARQL Protocol operation</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr>  </tbody>
</table>

<a name="RawQuery+select"></a>

### rawQuery.select(query, [options]) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends a request for a SELECT query

**Kind**: instance method of [<code>RawQuery</code>](#RawQuery)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>SELECT query</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.defaultGraph]</td><td><code>Array.&lt;string&gt;</code></td><td></td><td><p>default graph URI parameter</p>
</td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.namedGraph]</td><td><code>Array.&lt;string&gt;</code></td><td></td><td><p>named graph URI parameter</p>
</td>
    </tr><tr>
    <td>[options.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;get&#x27;</code></td><td><p>SPARQL Protocol operation</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr>  </tbody>
</table>

<a name="RawQuery+update"></a>

### rawQuery.update(query, [options]) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends a request for an update query

**Kind**: instance method of [<code>RawQuery</code>](#RawQuery)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>update query</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;postUrlencoded&#x27;</code></td><td><p>SPARQL Protocol operation</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr><tr>
    <td>[options.usingGraph]</td><td><code>Array.&lt;string&gt;</code></td><td></td><td><p>using graph URI parameter</p>
</td>
    </tr><tr>
    <td>[options.usingNamedGraph]</td><td><code>Array.&lt;string&gt;</code></td><td></td><td><p>using named graph URI parameter</p>
</td>
    </tr>  </tbody>
</table>

<a name="ResultParser"></a>

## ResultParser
A Transform stream that parses JSON SPARQL results and emits one object per row with the variable names as keys and
RDF/JS terms as values.

**Kind**: global class  
<a name="new_ResultParser_new"></a>

### new ResultParser(options)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>Object</code></td><td></td>
    </tr><tr>
    <td>options.factory</td><td><code>DataFactory</code></td><td><p>RDF/JS DataFactory used to create the quads and terms</p>
</td>
    </tr>  </tbody>
</table>

<a name="SimpleClient"></a>

## SimpleClient
A client implementation based on [RawQuery](#RawQuery) that prepares URLs and headers for SPARQL queries and returns the
raw fetch response. It does not provide a store interface.

**Kind**: global class  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code><a href="#RawQuery">RawQuery</a></code></td>
    </tr><tr>
    <td>endpointUrl</td><td><code>string</code></td>
    </tr><tr>
    <td>factory</td><td><code><a href="#RawQuery">RawQuery</a></code></td>
    </tr><tr>
    <td>fetch</td><td><code>factory</code></td>
    </tr><tr>
    <td>headers</td><td><code>Headers</code></td>
    </tr><tr>
    <td>password</td><td><code>string</code></td>
    </tr><tr>
    <td>parameters</td><td><code>Object</code></td>
    </tr><tr>
    <td>storeUrl</td><td><code>string</code></td>
    </tr><tr>
    <td>updateUrl</td><td><code>string</code></td>
    </tr><tr>
    <td>user</td><td><code>string</code></td>
    </tr><tr>
    <td>updateUrl</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* [SimpleClient](#SimpleClient)
    * [new SimpleClient(options)](#new_SimpleClient_new)
    * [.get(query, options)](#SimpleClient+get) ⇒ <code>Promise.&lt;Response&gt;</code>
    * [.postDirect(query, options)](#SimpleClient+postDirect) ⇒ <code>Promise.&lt;Response&gt;</code>
    * [.postUrlencoded(query, options)](#SimpleClient+postUrlencoded) ⇒ <code>Promise.&lt;Response&gt;</code>

<a name="new_SimpleClient_new"></a>

### new SimpleClient(options)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.endpointUrl]</td><td><code>string</code></td><td></td><td><p>SPARQL query endpoint URL</p>
</td>
    </tr><tr>
    <td>[options.factory]</td><td><code>factory</code></td><td></td><td><p>RDF/JS factory</p>
</td>
    </tr><tr>
    <td>[options.fetch]</td><td><code>fetch</code></td><td><code>nodeify-fetch</code></td><td><p>fetch implementation</p>
</td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>headers sent with every request</p>
</td>
    </tr><tr>
    <td>[options.password]</td><td><code>string</code></td><td></td><td><p>password used for basic authentication</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>parameters sent with every request</p>
</td>
    </tr><tr>
    <td>[options.storeUrl]</td><td><code>string</code></td><td></td><td><p>SPARQL Graph Store URL</p>
</td>
    </tr><tr>
    <td>[options.updateUrl]</td><td><code>string</code></td><td></td><td><p>SPARQL update endpoint URL</p>
</td>
    </tr><tr>
    <td>[options.user]</td><td><code>string</code></td><td></td><td><p>user used for basic authentication</p>
</td>
    </tr><tr>
    <td>[options.Query]</td><td><code>Query</code></td><td></td><td><p>Constructor of a query implementation</p>
</td>
    </tr><tr>
    <td>[options.Store]</td><td><code>Store</code></td><td></td><td><p>Constructor of a store implementation</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// read the height of the Eiffel Tower from Wikidata with a SELECT query

import SparqlClient from 'sparql-http-client/SimpleClient.js'

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
const res = await client.query.select(query)

if (!res.ok) {
return console.error(res.statusText)
}

const content = await res.json()

console.log(JSON.stringify(content, null, 2))
```
<a name="SimpleClient+get"></a>

### simpleClient.get(query, options) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends a GET request as defined in the
[SPARQL Protocol specification](https://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-via-get).

**Kind**: instance method of [<code>SimpleClient</code>](#SimpleClient)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>SPARQL query</p>
</td>
    </tr><tr>
    <td>options</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr><tr>
    <td>[options.update]</td><td><code>boolean</code></td><td><code>false</code></td><td><p>send the request to the updateUrl</p>
</td>
    </tr>  </tbody>
</table>

<a name="SimpleClient+postDirect"></a>

### simpleClient.postDirect(query, options) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends a POST directly request as defined in the
[SPARQL Protocol specification](https://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-via-post-direct).

**Kind**: instance method of [<code>SimpleClient</code>](#SimpleClient)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>SPARQL query</p>
</td>
    </tr><tr>
    <td>options</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr><tr>
    <td>[options.update]</td><td><code>boolean</code></td><td><code>false</code></td><td><p>send the request to the updateUrl</p>
</td>
    </tr>  </tbody>
</table>

<a name="SimpleClient+postUrlencoded"></a>

### simpleClient.postUrlencoded(query, options) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends a POST URL-encoded request as defined in the
[SPARQL Protocol specification](https://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-via-post-urlencoded).

**Kind**: instance method of [<code>SimpleClient</code>](#SimpleClient)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>SPARQL query</p>
</td>
    </tr><tr>
    <td>options</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr><tr>
    <td>[options.update]</td><td><code>boolean</code></td><td><code>false</code></td><td><p>send the request to the updateUrl</p>
</td>
    </tr>  </tbody>
</table>

<a name="StreamClient"></a>

## StreamClient ⇐ [<code>SimpleClient</code>](#SimpleClient)
The default client implementation based on [StreamQuery](#StreamQuery) and [StreamStore](#StreamStore) parses SPARQL results into
Readable streams of RDF/JS Quad objects (CONSTRUCT/DESCRIBE) or Readable streams of objects (SELECT). Graph Store
read and write operations are handled using Readable streams.

**Kind**: global class  
**Extends**: [<code>SimpleClient</code>](#SimpleClient)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code><a href="#StreamQuery">StreamQuery</a></code></td>
    </tr><tr>
    <td>store</td><td><code><a href="#StreamStore">StreamStore</a></code></td>
    </tr>  </tbody>
</table>


* [StreamClient](#StreamClient) ⇐ [<code>SimpleClient</code>](#SimpleClient)
    * [new StreamClient(options)](#new_StreamClient_new)
    * [.get(query, options)](#SimpleClient+get) ⇒ <code>Promise.&lt;Response&gt;</code>
    * [.postDirect(query, options)](#SimpleClient+postDirect) ⇒ <code>Promise.&lt;Response&gt;</code>
    * [.postUrlencoded(query, options)](#SimpleClient+postUrlencoded) ⇒ <code>Promise.&lt;Response&gt;</code>

<a name="new_StreamClient_new"></a>

### new StreamClient(options)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.endpointUrl]</td><td><code>string</code></td><td></td><td><p>SPARQL query endpoint URL</p>
</td>
    </tr><tr>
    <td>[options.factory]</td><td><code>factory</code></td><td></td><td><p>RDF/JS factory</p>
</td>
    </tr><tr>
    <td>[options.fetch]</td><td><code>fetch</code></td><td><code>nodeify-fetch</code></td><td><p>fetch implementation</p>
</td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>headers sent with every request</p>
</td>
    </tr><tr>
    <td>[options.password]</td><td><code>string</code></td><td></td><td><p>password used for basic authentication</p>
</td>
    </tr><tr>
    <td>[options.storeUrl]</td><td><code>string</code></td><td></td><td><p>SPARQL Graph Store URL</p>
</td>
    </tr><tr>
    <td>[options.updateUrl]</td><td><code>string</code></td><td></td><td><p>SPARQL update endpoint URL</p>
</td>
    </tr><tr>
    <td>[options.user]</td><td><code>string</code></td><td></td><td><p>user used for basic authentication</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// read the height of the Eiffel Tower from Wikidata with a SELECT query

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
**Example**  
```js
// read all quads from a local triplestore using the Graph Store protocol

import rdf from 'rdf-ext'
import SparqlClient from 'sparql-http-client'

const client = new SparqlClient({
  storeUrl: 'http://localhost:3030/test/data',
  factory: rdf
})

const stream = local.store.get(rdf.defaultGraph())

stream.on('data', quad => {
  console.log(`${quad.subject} ${quad.predicate} ${quad.object}`)
})
```
<a name="SimpleClient+get"></a>

### streamClient.get(query, options) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends a GET request as defined in the
[SPARQL Protocol specification](https://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-via-get).

**Kind**: instance method of [<code>StreamClient</code>](#StreamClient)  
**Overrides**: [<code>get</code>](#SimpleClient+get)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>SPARQL query</p>
</td>
    </tr><tr>
    <td>options</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr><tr>
    <td>[options.update]</td><td><code>boolean</code></td><td><code>false</code></td><td><p>send the request to the updateUrl</p>
</td>
    </tr>  </tbody>
</table>

<a name="SimpleClient+postDirect"></a>

### streamClient.postDirect(query, options) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends a POST directly request as defined in the
[SPARQL Protocol specification](https://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-via-post-direct).

**Kind**: instance method of [<code>StreamClient</code>](#StreamClient)  
**Overrides**: [<code>postDirect</code>](#SimpleClient+postDirect)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>SPARQL query</p>
</td>
    </tr><tr>
    <td>options</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr><tr>
    <td>[options.update]</td><td><code>boolean</code></td><td><code>false</code></td><td><p>send the request to the updateUrl</p>
</td>
    </tr>  </tbody>
</table>

<a name="SimpleClient+postUrlencoded"></a>

### streamClient.postUrlencoded(query, options) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends a POST URL-encoded request as defined in the
[SPARQL Protocol specification](https://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-via-post-urlencoded).

**Kind**: instance method of [<code>StreamClient</code>](#StreamClient)  
**Overrides**: [<code>postUrlencoded</code>](#SimpleClient+postUrlencoded)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>SPARQL query</p>
</td>
    </tr><tr>
    <td>options</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr><tr>
    <td>[options.update]</td><td><code>boolean</code></td><td><code>false</code></td><td><p>send the request to the updateUrl</p>
</td>
    </tr>  </tbody>
</table>

<a name="StreamQuery"></a>

## StreamQuery ⇐ [<code>RawQuery</code>](#RawQuery)
A query implementation based on [RawQuery](#RawQuery) that parses SPARQL results into Readable streams of RDF/JS Quad
objects (CONSTRUCT/DESCRIBE) or Readable streams of objects (SELECT).

**Kind**: global class  
**Extends**: [<code>RawQuery</code>](#RawQuery)  

* [StreamQuery](#StreamQuery) ⇐ [<code>RawQuery</code>](#RawQuery)
    * [.ask(query, [options])](#StreamQuery+ask) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.construct(query, [options])](#StreamQuery+construct) ⇒ <code>Readable</code>
    * [.select(query, [options])](#StreamQuery+select) ⇒ <code>Readable</code>
    * [.update(query, [options])](#StreamQuery+update) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="StreamQuery+ask"></a>

### streamQuery.ask(query, [options]) ⇒ <code>Promise.&lt;boolean&gt;</code>
Sends a request for a ASK query

**Kind**: instance method of [<code>StreamQuery</code>](#StreamQuery)  
**Overrides**: [<code>ask</code>](#RawQuery+ask)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>ASK query</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;get&#x27;</code></td><td><p>SPARQL Protocol operation</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr>  </tbody>
</table>

<a name="StreamQuery+construct"></a>

### streamQuery.construct(query, [options]) ⇒ <code>Readable</code>
Sends a request for a CONSTRUCT or DESCRIBE query

**Kind**: instance method of [<code>StreamQuery</code>](#StreamQuery)  
**Overrides**: [<code>construct</code>](#RawQuery+construct)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>CONSTRUCT or DESCRIBE query</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;get&#x27;</code></td><td><p>SPARQL Protocol operation</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr>  </tbody>
</table>

<a name="StreamQuery+select"></a>

### streamQuery.select(query, [options]) ⇒ <code>Readable</code>
Sends a request for a SELECT query

**Kind**: instance method of [<code>StreamQuery</code>](#StreamQuery)  
**Overrides**: [<code>select</code>](#RawQuery+select)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>SELECT query</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;get&#x27;</code></td><td><p>SPARQL Protocol operation</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr>  </tbody>
</table>

<a name="StreamQuery+update"></a>

### streamQuery.update(query, [options]) ⇒ <code>Promise.&lt;void&gt;</code>
Sends a request for an update query

**Kind**: instance method of [<code>StreamQuery</code>](#StreamQuery)  
**Overrides**: [<code>update</code>](#RawQuery+update)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>update query</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Headers</code></td><td></td><td><p>additional request headers</p>
</td>
    </tr><tr>
    <td>[options.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;postUrlencoded&#x27;</code></td><td><p>SPARQL Protocol operation</p>
</td>
    </tr><tr>
    <td>[options.parameters]</td><td><code>Object</code></td><td></td><td><p>additional request parameters</p>
</td>
    </tr>  </tbody>
</table>

<a name="StreamStore"></a>

## StreamStore
A store implementation that parses and serializes SPARQL Graph Store responses and requests into/from Readable
streams.

**Kind**: global class  

* [StreamStore](#StreamStore)
    * [new StreamStore(options)](#new_StreamStore_new)
    * [.get([graph])](#StreamStore+get) ⇒ <code>Promise.&lt;Readable&gt;</code>
    * [.post(stream, [options])](#StreamStore+post) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.put(stream, [options])](#StreamStore+put) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.read([options])](#StreamStore+read) ⇒ <code>Readable</code>
    * [.write([options], [graph], method, stream)](#StreamStore+write) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="new_StreamStore_new"></a>

### new StreamStore(options)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>Object</code></td><td></td>
    </tr><tr>
    <td>options.client</td><td><code><a href="#SimpleClient">SimpleClient</a></code></td><td><p>client that provides the HTTP I/O</p>
</td>
    </tr>  </tbody>
</table>

<a name="StreamStore+get"></a>

### streamStore.get([graph]) ⇒ <code>Promise.&lt;Readable&gt;</code>
Sends a GET request to the Graph Store

**Kind**: instance method of [<code>StreamStore</code>](#StreamStore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[graph]</td><td><code>NamedNode</code></td><td><p>source graph</p>
</td>
    </tr>  </tbody>
</table>

<a name="StreamStore+post"></a>

### streamStore.post(stream, [options]) ⇒ <code>Promise.&lt;void&gt;</code>
Sends a POST request to the Graph Store

**Kind**: instance method of [<code>StreamStore</code>](#StreamStore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>stream</td><td><code>Readable</code></td><td><p>triples/quads to write</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td></td>
    </tr><tr>
    <td>[options.graph]</td><td><code>Term</code></td><td><p>target graph</p>
</td>
    </tr>  </tbody>
</table>

<a name="StreamStore+put"></a>

### streamStore.put(stream, [options]) ⇒ <code>Promise.&lt;void&gt;</code>
Sends a PUT request to the Graph Store

**Kind**: instance method of [<code>StreamStore</code>](#StreamStore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>stream</td><td><code>Readable</code></td><td><p>triples/quads to write</p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td></td>
    </tr><tr>
    <td>[options.graph]</td><td><code>Term</code></td><td><p>target graph</p>
</td>
    </tr>  </tbody>
</table>

<a name="StreamStore+read"></a>

### streamStore.read([options]) ⇒ <code>Readable</code>
Generic read request to the Graph Store

**Kind**: instance method of [<code>StreamStore</code>](#StreamStore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[options]</td><td><code>Object</code></td><td></td>
    </tr><tr>
    <td>[options.graph]</td><td><code>Term</code></td><td><p>source graph</p>
</td>
    </tr><tr>
    <td>options.method</td><td><code>string</code></td><td><p>HTTP method</p>
</td>
    </tr>  </tbody>
</table>

<a name="StreamStore+write"></a>

### streamStore.write([options], [graph], method, stream) ⇒ <code>Promise.&lt;void&gt;</code>
Generic write request to the Graph Store

**Kind**: instance method of [<code>StreamStore</code>](#StreamStore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[options]</td><td><code>Object</code></td><td></td>
    </tr><tr>
    <td>[graph]</td><td><code>Term</code></td><td><p>target graph</p>
</td>
    </tr><tr>
    <td>method</td><td><code>string</code></td><td><p>HTTP method</p>
</td>
    </tr><tr>
    <td>stream</td><td><code>Readable</code></td><td><p>triples/quads to write</p>
</td>
    </tr>  </tbody>
</table>

