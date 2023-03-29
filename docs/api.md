## Functions

<dl>
<dt><a href="#get">get(query, options)</a> ⇒ <code>Promise.&lt;Response&gt;</code></dt>
<dd><p>Sends the query as GET request with query string</p>
</dd>
<dt><a href="#postDirect">postDirect(query, options)</a> ⇒ <code>Promise.&lt;Response&gt;</code></dt>
<dd><p>Sends the query as POST request with application/sparql-query body</p>
</dd>
<dt><a href="#postUrlencoded">postUrlencoded(query, options)</a> ⇒ <code>Promise.&lt;Response&gt;</code></dt>
<dd><p>Sends the query as POST request with application/x-www-form-urlencoded body</p>
</dd>
<dt><a href="#construct">construct(query, [options])</a> ⇒ <code>Promise.&lt;Array.&lt;Quad&gt;&gt;</code></dt>
<dd><p>Performs a query which returns triples</p>
</dd>
<dt><a href="#select">select(query, [options])</a> ⇒ <code>Promise.&lt;Array.&lt;Object.&lt;string, Term&gt;&gt;&gt;</code></dt>
<dd><p>Performs a SELECT query which returns binding tuples</p>
</dd>
<dt><a href="#ask">ask(query, [init])</a> ⇒ <code>Promise.&lt;Response&gt;</code></dt>
<dd><p>Performs an ASK query
By default uses HTTP GET with query string</p>
</dd>
<dt><a href="#construct">construct(query, [init])</a> ⇒ <code>Promise.&lt;Response&gt;</code></dt>
<dd><p>Performs a CONSTRUCT/DESCRIBE query
By default uses HTTP GET with query string</p>
</dd>
<dt><a href="#select">select(query, [init])</a> ⇒ <code>Promise.&lt;Response&gt;</code></dt>
<dd><p>Performs a SELECT query
By default uses HTTP GET with query string</p>
</dd>
<dt><a href="#update">update(query, [init])</a> ⇒ <code>Promise.&lt;Response&gt;</code></dt>
<dd><p>Performs a SELECT query
By default uses HTTP POST with form-encoded body</p>
</dd>
<dt><a href="#ask">ask(query, [init])</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd></dd>
<dt><a href="#construct">construct(query, [init])</a> ⇒ <code>Promise.&lt;Stream&gt;</code></dt>
<dd></dd>
<dt><a href="#select">select(query, [init])</a> ⇒ <code>Promise.&lt;Stream&gt;</code></dt>
<dd></dd>
<dt><a href="#update">update(query, [init])</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd></dd>
<dt><a href="#get">get(graph)</a> ⇒ <code>Promise.&lt;Stream&gt;</code></dt>
<dd><p>Gets a graph triples from the store</p>
</dd>
<dt><a href="#post">post(stream)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Adds triples to a graph</p>
</dd>
<dt><a href="#put">put(stream)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Replaces graph with triples</p>
</dd>
</dl>

<a name="get"></a>

## get(query, options) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends the query as GET request with query string

**Kind**: global function  
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

<a name="postDirect"></a>

## postDirect(query, options) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends the query as POST request with application/sparql-query body

**Kind**: global function  
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

<a name="postUrlencoded"></a>

## postUrlencoded(query, options) ⇒ <code>Promise.&lt;Response&gt;</code>
Sends the query as POST request with application/x-www-form-urlencoded body

**Kind**: global function  
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

<a name="construct"></a>

## construct(query, [options]) ⇒ <code>Promise.&lt;Array.&lt;Quad&gt;&gt;</code>
Performs a query which returns triples

**Kind**: global function  
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

<a name="select"></a>

## select(query, [options]) ⇒ <code>Promise.&lt;Array.&lt;Object.&lt;string, Term&gt;&gt;&gt;</code>
Performs a SELECT query which returns binding tuples

**Kind**: global function  
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

<a name="ask"></a>

## ask(query, [init]) ⇒ <code>Promise.&lt;Response&gt;</code>
Performs an ASK query
By default uses HTTP GET with query string

**Kind**: global function  
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

<a name="construct"></a>

## construct(query, [init]) ⇒ <code>Promise.&lt;Response&gt;</code>
Performs a CONSTRUCT/DESCRIBE query
By default uses HTTP GET with query string

**Kind**: global function  
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

<a name="select"></a>

## select(query, [init]) ⇒ <code>Promise.&lt;Response&gt;</code>
Performs a SELECT query
By default uses HTTP GET with query string

**Kind**: global function  
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

<a name="update"></a>

## update(query, [init]) ⇒ <code>Promise.&lt;Response&gt;</code>
Performs a SELECT query
By default uses HTTP POST with form-encoded body

**Kind**: global function  
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

<a name="ask"></a>

## ask(query, [init]) ⇒ <code>Promise.&lt;boolean&gt;</code>
**Kind**: global function  
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

<a name="construct"></a>

## construct(query, [init]) ⇒ <code>Promise.&lt;Stream&gt;</code>
**Kind**: global function  
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

<a name="select"></a>

## select(query, [init]) ⇒ <code>Promise.&lt;Stream&gt;</code>
**Kind**: global function  
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

<a name="update"></a>

## update(query, [init]) ⇒ <code>Promise.&lt;void&gt;</code>
**Kind**: global function  
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

<a name="get"></a>

## get(graph) ⇒ <code>Promise.&lt;Stream&gt;</code>
Gets a graph triples from the store

**Kind**: global function  
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

<a name="post"></a>

## post(stream) ⇒ <code>Promise.&lt;void&gt;</code>
Adds triples to a graph

**Kind**: global function  
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

<a name="put"></a>

## put(stream) ⇒ <code>Promise.&lt;void&gt;</code>
Replaces graph with triples

**Kind**: global function  
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

