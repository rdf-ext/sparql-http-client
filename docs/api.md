## Classes

<dl>
<dt><a href="#BaseClient">BaseClient</a></dt>
<dd><p>An abstract base client which connects the query, store and endpoint together</p>
<p>Store and Query parameters are both optional and only necessary when the client will connect to SPARQL Graph Store
or SPARQL Query endpoints respectively</p>
</dd>
<dt><a href="#Endpoint">Endpoint</a></dt>
<dd><p>Represents a SPARQL endpoint and exposes a low-level methods, close to the underlying HTTP interface</p>
<p>It directly returns HTTP response objects</p>
</dd>
<dt><a href="#ParsingClient">ParsingClient</a></dt>
<dd><p>A client implementation which parses SPARQL responses into RDF/JS dataset (CONSTRUCT/DESCRIBE) or JSON objects (SELECT)</p>
<p>It does not provide a store</p>
</dd>
<dt><a href="#ParsingQuery">ParsingQuery</a></dt>
<dd><p>Extends StreamQuery by materialising the SPARQL response streams</p>
</dd>
<dt><a href="#RawQuery">RawQuery</a></dt>
<dd><p>A base query class which performs HTTP requests for the different SPARQL query forms</p>
</dd>
<dt><a href="#ResultParser">ResultParser</a></dt>
<dd><p>A stream which parses SPARQL SELECT bindings</p>
</dd>
<dt><a href="#SimpleClient">SimpleClient</a></dt>
<dd><p>A basic client implementation which uses RawQuery and no Store</p>
</dd>
<dt><a href="#StreamClient">StreamClient</a></dt>
<dd><p>The default client implementation which returns SPARQL response as RDF/JS streams</p>
</dd>
<dt><a href="#StreamQuery">StreamQuery</a></dt>
<dd><p>Extends RawQuery by wrapping response body streams as RDF/JS Streams</p>
</dd>
<dt><a href="#StreamStore">StreamStore</a></dt>
<dd><p>Accesses stores with SPARQL Graph Protocol</p>
</dd>
</dl>

<a name="BaseClient"></a>

## BaseClient
An abstract base client which connects the query, store and endpoint together

Store and Query parameters are both optional and only necessary when the client will connect to SPARQL Graph Store
or SPARQL Query endpoints respectively

**Kind**: global class  

* [BaseClient](#BaseClient)
    * [new BaseClient(init)](#new_BaseClient_new)
    * [.query](#BaseClient+query) : [<code>RawQuery</code>](#RawQuery)
    * [.store](#BaseClient+store) : [<code>StreamStore</code>](#StreamStore)

<a name="new_BaseClient_new"></a>

### new BaseClient(init)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>init</td><td><code>Object</code></td><td></td>
    </tr><tr>
    <td>init.endpoint</td><td><code><a href="#Endpoint">Endpoint</a></code></td><td><p>object to connect to SPARQL endpoint</p>
</td>
    </tr><tr>
    <td>[init.Query]</td><td><code>Query</code></td><td><p>SPARQL Query/Update executor constructor</p>
</td>
    </tr><tr>
    <td>[init.Store]</td><td><code>Store</code></td><td><p>SPARQL Graph Store connector constructor</p>
</td>
    </tr><tr>
    <td>[init.factory]</td><td><code>factory</code></td><td><p>RDF/JS DataFactory</p>
</td>
    </tr><tr>
    <td>[init.options]</td><td><code>Object</code></td><td><p>any additional arguments passed to Query and Store constructors</p>
</td>
    </tr>  </tbody>
</table>

<a name="BaseClient+query"></a>

### baseClient.query : [<code>RawQuery</code>](#RawQuery)
**Kind**: instance property of [<code>BaseClient</code>](#BaseClient)  
<a name="BaseClient+store"></a>

### baseClient.store : [<code>StreamStore</code>](#StreamStore)
**Kind**: instance property of [<code>BaseClient</code>](#BaseClient)  
<a name="Endpoint"></a>

## Endpoint
Represents a SPARQL endpoint and exposes a low-level methods, close to the underlying HTTP interface

It directly returns HTTP response objects

**Kind**: global class  

* [Endpoint](#Endpoint)
    * [new Endpoint(init)](#new_Endpoint_new)
    * [.get(query, options)](#Endpoint+get) ⇒ <code>Promise.&lt;Response&gt;</code>
    * [.postDirect(query, options)](#Endpoint+postDirect) ⇒ <code>Promise.&lt;Response&gt;</code>
    * [.postUrlencoded(query, options)](#Endpoint+postUrlencoded) ⇒ <code>Promise.&lt;Response&gt;</code>

<a name="new_Endpoint_new"></a>

### new Endpoint(init)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>init</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>init.endpointUrl</td><td><code>string</code></td><td></td><td><p>SPARQL Query endpoint URL</p>
</td>
    </tr><tr>
    <td>[init.fetch]</td><td><code>fetch</code></td><td><code>nodeify-fetch</code></td><td><p>fetch implementation</p>
</td>
    </tr><tr>
    <td>[init.headers]</td><td><code>HeadersInit</code></td><td></td><td><p>HTTP headers to send with every endpoint request</p>
</td>
    </tr><tr>
    <td>[init.password]</td><td><code>string</code></td><td></td><td><p>password used for basic authentication</p>
</td>
    </tr><tr>
    <td>[init.storeUrl]</td><td><code>string</code></td><td></td><td><p>Graph Store URL</p>
</td>
    </tr><tr>
    <td>[init.updateUrl]</td><td><code>string</code></td><td></td><td><p>SPARQL Update endpoint URL</p>
</td>
    </tr><tr>
    <td>[init.user]</td><td><code>string</code></td><td></td><td><p>user used for basic authentication</p>
</td>
    </tr>  </tbody>
</table>

<a name="Endpoint+get"></a>

### endpoint.get(query, options) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends the query as GET request with query string

**Kind**: instance method of [<code>Endpoint</code>](#Endpoint)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>SPARQL Query/Update</p>
</td>
    </tr><tr>
    <td>options</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>HeadersInit</code></td><td></td><td><p>per-request HTTP headers</p>
</td>
    </tr><tr>
    <td>[options.update]</td><td><code>boolean</code></td><td><code>false</code></td><td><p>if true, performs a SPARQL Update</p>
</td>
    </tr>  </tbody>
</table>

<a name="Endpoint+postDirect"></a>

### endpoint.postDirect(query, options) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends the query as POST request with application/sparql-query body

**Kind**: instance method of [<code>Endpoint</code>](#Endpoint)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>SPARQL Query/Update</p>
</td>
    </tr><tr>
    <td>options</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>HeadersInit</code></td><td></td><td><p>per-request HTTP headers</p>
</td>
    </tr><tr>
    <td>[options.update]</td><td><code>boolean</code></td><td><code>false</code></td><td><p>if true, performs a SPARQL Update</p>
</td>
    </tr>  </tbody>
</table>

<a name="Endpoint+postUrlencoded"></a>

### endpoint.postUrlencoded(query, options) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends the query as POST request with application/x-www-form-urlencoded body

**Kind**: instance method of [<code>Endpoint</code>](#Endpoint)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>SPARQL Query/Update</p>
</td>
    </tr><tr>
    <td>options</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>HeadersInit</code></td><td></td><td><p>per-request HTTP headers</p>
</td>
    </tr><tr>
    <td>[options.update]</td><td><code>boolean</code></td><td><code>false</code></td><td><p>if true, performs a SPARQL Update</p>
</td>
    </tr>  </tbody>
</table>

<a name="ParsingClient"></a>

## ParsingClient
A client implementation which parses SPARQL responses into RDF/JS dataset (CONSTRUCT/DESCRIBE) or JSON objects (SELECT)

It does not provide a store

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
    <td>query</td><td><code><a href="#ParsingQuery">ParsingQuery</a></code></td>
    </tr>  </tbody>
</table>

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
    <td>options.endpointUrl</td><td><code>string</code></td><td></td><td><p>SPARQL Query endpoint URL</p>
</td>
    </tr><tr>
    <td>[options.fetch]</td><td><code>fetch</code></td><td><code>nodeify-fetch</code></td><td><p>fetch implementation</p>
</td>
    </tr><tr>
    <td>[options.headers]</td><td><code>HeadersInit</code></td><td></td><td><p>HTTP headers to send with every endpoint request</p>
</td>
    </tr><tr>
    <td>[options.password]</td><td><code>string</code></td><td></td><td><p>password used for basic authentication</p>
</td>
    </tr><tr>
    <td>[options.storeUrl]</td><td><code>string</code></td><td></td><td><p>Graph Store URL</p>
</td>
    </tr><tr>
    <td>[options.updateUrl]</td><td><code>string</code></td><td></td><td><p>SPARQL Update endpoint URL</p>
</td>
    </tr><tr>
    <td>[options.user]</td><td><code>string</code></td><td></td><td><p>user used for basic authentication</p>
</td>
    </tr><tr>
    <td>[options.factory]</td><td><code>factory</code></td><td></td><td><p>RDF/JS DataFactory</p>
</td>
    </tr>  </tbody>
</table>

<a name="ParsingQuery"></a>

## ParsingQuery
Extends StreamQuery by materialising the SPARQL response streams

**Kind**: global class  

* [ParsingQuery](#ParsingQuery)
    * [new ParsingQuery(init)](#new_ParsingQuery_new)
    * [.construct(query, [options])](#ParsingQuery+construct) ⇒ <code>Promise.&lt;Array.&lt;Quad&gt;&gt;</code>
    * [.select(query, [options])](#ParsingQuery+select) ⇒ <code>Promise.&lt;Array.&lt;Object.&lt;string, Term&gt;&gt;&gt;</code>

<a name="new_ParsingQuery_new"></a>

### new ParsingQuery(init)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>init</td><td><code>Object</code></td>
    </tr><tr>
    <td>init.endpoint</td><td><code><a href="#Endpoint">Endpoint</a></code></td>
    </tr>  </tbody>
</table>

<a name="ParsingQuery+construct"></a>

### parsingQuery.construct(query, [options]) ⇒ <code>Promise.&lt;Array.&lt;Quad&gt;&gt;</code>
Performs a query which returns triples

**Kind**: instance method of [<code>ParsingQuery</code>](#ParsingQuery)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td></td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>HeadersInit</code></td><td></td><td><p>HTTP request headers</p>
</td>
    </tr><tr>
    <td>[options.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;get&#x27;</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="ParsingQuery+select"></a>

### parsingQuery.select(query, [options]) ⇒ <code>Promise.&lt;Array.&lt;Object.&lt;string, Term&gt;&gt;&gt;</code>
Performs a SELECT query which returns binding tuples

**Kind**: instance method of [<code>ParsingQuery</code>](#ParsingQuery)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td></td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[options.headers]</td><td><code>HeadersInit</code></td><td></td><td><p>HTTP request headers</p>
</td>
    </tr><tr>
    <td>[options.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;get&#x27;</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="RawQuery"></a>

## RawQuery
A base query class which performs HTTP requests for the different SPARQL query forms

**Kind**: global class  

* [RawQuery](#RawQuery)
    * [new RawQuery(init)](#new_RawQuery_new)
    * [.endpoint](#RawQuery+endpoint) : [<code>Endpoint</code>](#Endpoint)
    * [.ask(query, [init])](#RawQuery+ask) ⇒ <code>Promise.&lt;Response&gt;</code>
    * [.construct(query, [init])](#RawQuery+construct) ⇒ <code>Promise.&lt;Response&gt;</code>
    * [.select(query, [init])](#RawQuery+select) ⇒ <code>Promise.&lt;Response&gt;</code>
    * [.update(query, [init])](#RawQuery+update) ⇒ <code>Promise.&lt;Response&gt;</code>

<a name="new_RawQuery_new"></a>

### new RawQuery(init)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>init</td><td><code>Object</code></td>
    </tr><tr>
    <td>init.endpoint</td><td><code><a href="#Endpoint">Endpoint</a></code></td>
    </tr>  </tbody>
</table>

<a name="RawQuery+endpoint"></a>

### rawQuery.endpoint : [<code>Endpoint</code>](#Endpoint)
**Kind**: instance property of [<code>RawQuery</code>](#RawQuery)  
<a name="RawQuery+ask"></a>

### rawQuery.ask(query, [init]) ⇒ <code>Promise.&lt;Response&gt;</code>
Performs an ASK query
By default uses HTTP GET with query string

**Kind**: instance method of [<code>RawQuery</code>](#RawQuery)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>SPARQL ASK query</p>
</td>
    </tr><tr>
    <td>[init]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[init.headers]</td><td><code>HeadersInit</code></td><td></td><td><p>HTTP request headers</p>
</td>
    </tr><tr>
    <td>[init.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;get&#x27;</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="RawQuery+construct"></a>

### rawQuery.construct(query, [init]) ⇒ <code>Promise.&lt;Response&gt;</code>
Performs a CONSTRUCT/DESCRIBE query
By default uses HTTP GET with query string

**Kind**: instance method of [<code>RawQuery</code>](#RawQuery)  
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
    <td>[init]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[init.headers]</td><td><code>HeadersInit</code></td><td></td><td><p>HTTP request headers</p>
</td>
    </tr><tr>
    <td>[init.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;get&#x27;</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="RawQuery+select"></a>

### rawQuery.select(query, [init]) ⇒ <code>Promise.&lt;Response&gt;</code>
Performs a SELECT query
By default uses HTTP GET with query string

**Kind**: instance method of [<code>RawQuery</code>](#RawQuery)  
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
    <td>[init]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[init.headers]</td><td><code>HeadersInit</code></td><td></td><td><p>HTTP request headers</p>
</td>
    </tr><tr>
    <td>[init.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;get&#x27;</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="RawQuery+update"></a>

### rawQuery.update(query, [init]) ⇒ <code>Promise.&lt;Response&gt;</code>
Performs a SELECT query
By default uses HTTP POST with form-encoded body

**Kind**: instance method of [<code>RawQuery</code>](#RawQuery)  
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
    <td>[init]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[init.headers]</td><td><code>HeadersInit</code></td><td></td><td><p>HTTP request headers</p>
</td>
    </tr><tr>
    <td>[init.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;postUrlencoded&#x27;</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="ResultParser"></a>

## ResultParser
A stream which parses SPARQL SELECT bindings

**Kind**: global class  
<a name="SimpleClient"></a>

## SimpleClient
A basic client implementation which uses RawQuery and no Store

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
    </tr>  </tbody>
</table>

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
    <td>options.endpointUrl</td><td><code>string</code></td><td></td><td><p>SPARQL Query endpoint URL</p>
</td>
    </tr><tr>
    <td>[options.fetch]</td><td><code>fetch</code></td><td><code>nodeify-fetch</code></td><td><p>fetch implementation</p>
</td>
    </tr><tr>
    <td>[options.headers]</td><td><code>HeadersInit</code></td><td></td><td><p>HTTP headers to send with every endpoint request</p>
</td>
    </tr><tr>
    <td>[options.password]</td><td><code>string</code></td><td></td><td><p>password used for basic authentication</p>
</td>
    </tr><tr>
    <td>[options.storeUrl]</td><td><code>string</code></td><td></td><td><p>Graph Store URL</p>
</td>
    </tr><tr>
    <td>[options.updateUrl]</td><td><code>string</code></td><td></td><td><p>SPARQL Update endpoint URL</p>
</td>
    </tr><tr>
    <td>[options.user]</td><td><code>string</code></td><td></td><td><p>user used for basic authentication</p>
</td>
    </tr><tr>
    <td>[options.factory]</td><td><code>factory</code></td><td></td><td><p>RDF/JS DataFactory</p>
</td>
    </tr>  </tbody>
</table>

<a name="StreamClient"></a>

## StreamClient
The default client implementation which returns SPARQL response as RDF/JS streams

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
    <td>query</td><td><code><a href="#StreamQuery">StreamQuery</a></code></td>
    </tr><tr>
    <td>store</td><td><code><a href="#StreamStore">StreamStore</a></code></td>
    </tr>  </tbody>
</table>

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
    <td>options.endpointUrl</td><td><code>string</code></td><td></td><td><p>SPARQL Query endpoint URL</p>
</td>
    </tr><tr>
    <td>[options.fetch]</td><td><code>fetch</code></td><td><code>nodeify-fetch</code></td><td><p>fetch implementation</p>
</td>
    </tr><tr>
    <td>[options.headers]</td><td><code>HeadersInit</code></td><td></td><td><p>HTTP headers to send with every endpoint request</p>
</td>
    </tr><tr>
    <td>[options.password]</td><td><code>string</code></td><td></td><td><p>password used for basic authentication</p>
</td>
    </tr><tr>
    <td>[options.storeUrl]</td><td><code>string</code></td><td></td><td><p>Graph Store URL</p>
</td>
    </tr><tr>
    <td>[options.updateUrl]</td><td><code>string</code></td><td></td><td><p>SPARQL Update endpoint URL</p>
</td>
    </tr><tr>
    <td>[options.user]</td><td><code>string</code></td><td></td><td><p>user used for basic authentication</p>
</td>
    </tr><tr>
    <td>[options.factory]</td><td><code>factory</code></td><td></td><td><p>RDF/JS DataFactory</p>
</td>
    </tr>  </tbody>
</table>

<a name="StreamQuery"></a>

## StreamQuery
Extends RawQuery by wrapping response body streams as RDF/JS Streams

**Kind**: global class  

* [StreamQuery](#StreamQuery)
    * [new StreamQuery(init)](#new_StreamQuery_new)
    * [.factory](#StreamQuery+factory) : <code>DataFactory</code>
    * [.ask(query, [init])](#StreamQuery+ask) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.construct(query, [init])](#StreamQuery+construct) ⇒ <code>Promise.&lt;Stream&gt;</code>
    * [.select(query, [init])](#StreamQuery+select) ⇒ <code>Promise.&lt;Stream&gt;</code>
    * [.update(query, [init])](#StreamQuery+update) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="new_StreamQuery_new"></a>

### new StreamQuery(init)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>init</td><td><code>Object</code></td><td></td>
    </tr><tr>
    <td>init.endpoint</td><td><code><a href="#Endpoint">Endpoint</a></code></td><td></td>
    </tr><tr>
    <td>[init.factory]</td><td><code>DataFactory</code></td><td><code>@rdfjs/data-model</code></td>
    </tr>  </tbody>
</table>

<a name="StreamQuery+factory"></a>

### streamQuery.factory : <code>DataFactory</code>
**Kind**: instance property of [<code>StreamQuery</code>](#StreamQuery)  
<a name="StreamQuery+ask"></a>

### streamQuery.ask(query, [init]) ⇒ <code>Promise.&lt;boolean&gt;</code>
**Kind**: instance method of [<code>StreamQuery</code>](#StreamQuery)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>string</code></td><td></td><td><p>SPARQL ASK query</p>
</td>
    </tr><tr>
    <td>[init]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[init.headers]</td><td><code>HeadersInit</code></td><td></td><td><p>HTTP request headers</p>
</td>
    </tr><tr>
    <td>[init.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;get&#x27;</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="StreamQuery+construct"></a>

### streamQuery.construct(query, [init]) ⇒ <code>Promise.&lt;Stream&gt;</code>
**Kind**: instance method of [<code>StreamQuery</code>](#StreamQuery)  
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
    <td>[init]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[init.headers]</td><td><code>HeadersInit</code></td><td></td><td><p>HTTP request headers</p>
</td>
    </tr><tr>
    <td>[init.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;get&#x27;</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="StreamQuery+select"></a>

### streamQuery.select(query, [init]) ⇒ <code>Promise.&lt;Stream&gt;</code>
**Kind**: instance method of [<code>StreamQuery</code>](#StreamQuery)  
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
    <td>[init]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[init.headers]</td><td><code>HeadersInit</code></td><td></td><td><p>HTTP request headers</p>
</td>
    </tr><tr>
    <td>[init.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;get&#x27;</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="StreamQuery+update"></a>

### streamQuery.update(query, [init]) ⇒ <code>Promise.&lt;void&gt;</code>
**Kind**: instance method of [<code>StreamQuery</code>](#StreamQuery)  
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
    <td>[init]</td><td><code>Object</code></td><td></td><td></td>
    </tr><tr>
    <td>[init.headers]</td><td><code>HeadersInit</code></td><td></td><td><p>HTTP request headers</p>
</td>
    </tr><tr>
    <td>[init.operation]</td><td><code>&#x27;get&#x27;</code> | <code>&#x27;postUrlencoded&#x27;</code> | <code>&#x27;postDirect&#x27;</code></td><td><code>&#x27;postUrlencoded&#x27;</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="StreamStore"></a>

## StreamStore
Accesses stores with SPARQL Graph Protocol

**Kind**: global class  

* [StreamStore](#StreamStore)
    * [new StreamStore(init, [maxQuadsPerRequest])](#new_StreamStore_new)
    * [.get(graph)](#StreamStore+get) ⇒ <code>Promise.&lt;Stream&gt;</code>
    * [.post(stream)](#StreamStore+post) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.put(stream)](#StreamStore+put) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="new_StreamStore_new"></a>

### new StreamStore(init, [maxQuadsPerRequest])
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>init</td><td><code>Object</code></td><td></td>
    </tr><tr>
    <td>init.endpoint</td><td><code><a href="#Endpoint">Endpoint</a></code></td><td></td>
    </tr><tr>
    <td>[init.factory]</td><td><code>DataFactory</code></td><td><code>@rdfjs/data-model</code></td>
    </tr><tr>
    <td>[maxQuadsPerRequest]</td><td><code>number</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="StreamStore+get"></a>

### streamStore.get(graph) ⇒ <code>Promise.&lt;Stream&gt;</code>
Gets a graph triples from the store

**Kind**: instance method of [<code>StreamStore</code>](#StreamStore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>graph</td><td><code>NamedNode</code></td>
    </tr>  </tbody>
</table>

<a name="StreamStore+post"></a>

### streamStore.post(stream) ⇒ <code>Promise.&lt;void&gt;</code>
Adds triples to a graph

**Kind**: instance method of [<code>StreamStore</code>](#StreamStore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>stream</td><td><code>Stream</code></td>
    </tr>  </tbody>
</table>

<a name="StreamStore+put"></a>

### streamStore.put(stream) ⇒ <code>Promise.&lt;void&gt;</code>
Replaces graph with triples

**Kind**: instance method of [<code>StreamStore</code>](#StreamStore)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>stream</td><td><code>Stream</code></td>
    </tr>  </tbody>
</table>

