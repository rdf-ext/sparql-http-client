const assert = require('assert')
const fetch = require('isomorphic-fetch')
const { describe, it } = require('mocha')
const URL = require('whatwg-url').URL
const nock = require('nock')
const SparqlHttp = require('../')

describe('sparql-http-client', () => {
  const simpleConstructQuery = 'CONSTRUCT {?s ?p ?o} WHERE {?s ?p ?o}'
  const simpleSelectQuery = 'SELECT * WHERE {?s ?p ?o}'
  const simpleUpdateQuery = 'INSERT {<http://example.org/subject> <http://example.org/predicate> "object"} WHERE {}'

  SparqlHttp.fetch = fetch
  SparqlHttp.URL = URL

  it('interface', () => {
    assert.strictEqual(typeof SparqlHttp, 'function')
    assert.strictEqual(typeof SparqlHttp.types, 'object')

    assert.strictEqual(typeof SparqlHttp.prototype.getQuery, 'function')
    assert.strictEqual(typeof SparqlHttp.prototype.postQueryDirect, 'function')
    assert.strictEqual(typeof SparqlHttp.prototype.postQueryUrlencoded, 'function')
    assert.strictEqual(typeof SparqlHttp.prototype.postQuery, 'function')
    assert.strictEqual(typeof SparqlHttp.prototype.constructQuery, 'function')
    assert.strictEqual(typeof SparqlHttp.prototype.selectQuery, 'function')
    assert.strictEqual(typeof SparqlHttp.prototype.updateQuery, 'function')
  })

  describe('.getQuery', () => {
    it('should return a response object via Promise', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200)

      const res = await endpoint.getQuery(simpleSelectQuery)

      assert.strictEqual(typeof res, 'object')
      assert.strictEqual(typeof res.text, 'function')
    })

    it('should send a GET request with query parameter to instance option .endpointUrl', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200)

      await endpoint.getQuery(simpleSelectQuery)
    })

    it('should keep existing query params in .endpointUrl when sending GET request', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql?auth_token=12345' })

      nock('http://example.org')
        .get('/sparql?auth_token=12345&query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200)

      await endpoint.getQuery(simpleSelectQuery)
    })

    it('should send a GET request with query parameter to option .endpointUrl', async () => {
      const endpoint = new SparqlHttp()

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200)

      await endpoint.getQuery(simpleSelectQuery, { endpointUrl: 'http://example.org/sparql' })
    })

    it('should send a GET request with query parameter to instance option .updateUrl if update is true', async () => {
      const endpoint = new SparqlHttp({ updateUrl: 'http://example.org/update' })

      nock('http://example.org')
        .get('/update?update=' + encodeURIComponent(simpleUpdateQuery))
        .reply(200)

      await endpoint.getQuery(simpleUpdateQuery, { update: true })
    })

    it('should send a GET request with query parameter to option .updateUrl if update is true', async () => {
      const endpoint = new SparqlHttp()

      nock('http://example.org')
        .get('/update?update=' + encodeURIComponent(simpleUpdateQuery))
        .reply(200)

      await endpoint.getQuery(simpleUpdateQuery, { update: true, updateUrl: 'http://example.org/update' })
    })

    it('should preserve existing query params when sending update request', async () => {
      const endpoint = new SparqlHttp()

      nock('http://example.org')
        .get('/update?auth_token=1234&update=' + encodeURIComponent(simpleUpdateQuery))
        .reply(200)

      await endpoint.getQuery(simpleUpdateQuery, { update: true, updateUrl: 'http://example.org/update?auth_token=1234' })
    })

    it('should send .accept option as Accept header field', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })
      const accept = 'text/plain'

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200, function () {
          assert.deepStrictEqual(this.req.headers.accept, [accept])
        })

      await endpoint.getQuery(simpleSelectQuery, { accept: accept })
    })
  })

  describe('.postQueryDirect', () => {
    it('should return a response object', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })

      nock('http://example.org')
        .post('/sparql')
        .reply(200)

      const res = await endpoint.postQueryDirect(simpleSelectQuery)

      assert.strictEqual(typeof res, 'object')
      assert.strictEqual(typeof res.text, 'function')
    })

    it('should send a POST request to instance option .endpointUrl', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })

      nock('http://example.org')
        .post('/sparql')
        .reply(200)

      await endpoint.postQueryDirect(simpleSelectQuery)
    })

    it('should send a POST request to option .endpointUrl', async () => {
      const endpoint = new SparqlHttp()

      nock('http://example.org')
        .post('/sparql')
        .reply(200)

      await endpoint.postQueryDirect(simpleSelectQuery, { endpointUrl: 'http://example.org/sparql' })
    })

    it('should send a POST request to instance option .updateUrl if update is true', async () => {
      const endpoint = new SparqlHttp({ updateUrl: 'http://example.org/update' })

      nock('http://example.org')
        .post('/update')
        .reply(200)

      await endpoint.postQueryDirect(simpleUpdateQuery, { update: true })
    })

    it('should send a POST request to option .updateUrl if update is true', async () => {
      const endpoint = new SparqlHttp()

      nock('http://example.org')
        .post('/update')
        .reply(200)

      await endpoint.postQueryDirect(simpleUpdateQuery, { update: true, updateUrl: 'http://example.org/update' })
    })

    it('should send Content-Type application/sparql-query and charset=utf-8', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })

      nock('http://example.org')
        .post('/sparql')
        .reply(200, function () {
          assert.deepStrictEqual(this.req.headers['content-type'], ['application/sparql-query; charset=utf-8'])
        })

      await endpoint.postQueryDirect(simpleSelectQuery)
    })

    it('should send the query in request body', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })

      nock('http://example.org')
        .post('/sparql')
        .reply(200, function (url, body) {
          assert.strictEqual(body, simpleSelectQuery)
        })

      await endpoint.postQueryDirect(simpleSelectQuery)
    })

    it('should send .accept option as Accept header field', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })
      const accept = 'text/plain'

      nock('http://example.org')
        .post('/sparql')
        .reply(200, function () {
          assert.deepStrictEqual(this.req.headers.accept, [accept])
        })

      await endpoint.postQueryDirect(simpleSelectQuery, { accept: accept })
    })

    it('should send .contentType option as Accept header field', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })
      const contentType = 'text/plain'

      nock('http://example.org')
        .post('/sparql')
        .reply(200, function () {
          assert.deepStrictEqual(this.req.headers['content-type'], [contentType])
        })

      await endpoint.postQueryDirect(simpleSelectQuery, { contentType: contentType })
    })
  })

  describe('.postQueryUrlencoded', () => {
    it('should return a request object', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })

      nock('http://example.org')
        .post('/sparql')
        .reply(200)

      const res = await endpoint.postQueryUrlencoded(simpleSelectQuery)

      assert.strictEqual(typeof res, 'object')
      assert.strictEqual(typeof res.text, 'function')
    })

    it('should send a POST request to instance option .endpointUrl', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })

      nock('http://example.org')
        .post('/sparql')
        .reply(200)

      await endpoint.postQueryUrlencoded(simpleSelectQuery)
    })

    it('should send a POST request to option .endpointUrl', async () => {
      const endpoint = new SparqlHttp()

      nock('http://example.org')
        .post('/sparql')
        .reply(200)

      await endpoint.postQueryUrlencoded(simpleSelectQuery, { endpointUrl: 'http://example.org/sparql' })
    })

    it('should send a POST request to instance option .updateUrl if update is true', async () => {
      const endpoint = new SparqlHttp({ updateUrl: 'http://example.org/update' })

      nock('http://example.org')
        .post('/update')
        .reply(200)

      await endpoint.postQueryUrlencoded(simpleUpdateQuery, { update: true })
    })

    it('should send a POST request to option .updateUrl if update is true', async () => {
      const endpoint = new SparqlHttp()

      nock('http://example.org')
        .post('/update')
        .reply(200)

      await endpoint.postQueryUrlencoded(simpleUpdateQuery, { update: true, updateUrl: 'http://example.org/update' })
    })

    it('should send Content-Type application/sparql-query', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })

      nock('http://example.org')
        .post('/sparql')
        .reply(200, function () {
          assert.deepStrictEqual(this.req.headers['content-type'], ['application/x-www-form-urlencoded'])
        })

      await endpoint.postQueryUrlencoded(simpleSelectQuery)
    })

    it('should send the query urlencoded in request body', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })

      nock('http://example.org')
        .post('/sparql')
        .reply(200, function (url, body) {
          assert.strictEqual(body, 'query=' + encodeURIComponent(simpleSelectQuery))
        })

      await endpoint.postQueryUrlencoded(simpleSelectQuery)
    })

    it('should send .accept option as Accept header field', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })
      const accept = 'text/plain'

      nock('http://example.org')
        .post('/sparql')
        .reply(200, function () {
          assert.deepStrictEqual(this.req.headers.accept, [accept])
        })

      await endpoint.postQueryUrlencoded(simpleSelectQuery, { accept: accept })
    })

    it('should send .contentType option as Accept header field', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })
      const contentType = 'text/plain'

      nock('http://example.org')
        .post('/sparql')
        .reply(200, function () {
          assert.deepStrictEqual(this.req.headers['content-type'], [contentType])
        })

      await endpoint.postQueryUrlencoded(simpleSelectQuery, { contentType: contentType })
    })
  })

  describe('.postQuery', () => {
    it('should use .postQueryUrlencoded by default', () => {
      const endpoint = new SparqlHttp()

      assert.strictEqual(endpoint.postQuery, endpoint.postQueryUrlencoded)
    })
  })

  describe('.constructQuery', () => {
    it('should return a request object', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleConstructQuery))
        .reply(200)

      const res = await endpoint.constructQuery(simpleConstructQuery)

      assert.strictEqual(typeof res, 'object')
      assert.strictEqual(typeof res.text, 'function')
    })

    it('should send a GET request with Accept header application/n-triples', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleConstructQuery))
        .reply(200, function () {
          assert.deepStrictEqual(this.req.headers.accept, ['application/n-triples'])
        })

      await endpoint.constructQuery(simpleConstructQuery)
    })

    it('should send .accept option as Accept header field', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })
      const accept = 'text/plain'

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleConstructQuery))
        .reply(200, function () {
          assert.deepStrictEqual(this.req.headers.accept, [accept])
        })

      await endpoint.constructQuery(simpleConstructQuery, { accept: accept })
    })
  })

  describe('.selectQuery', () => {
    it('should return a request object', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200)

      const res = await endpoint.selectQuery(simpleSelectQuery)

      assert.strictEqual(typeof res, 'object')
      assert.strictEqual(typeof res.text, 'function')
    })

    it('should send a GET request with Accept header application/sparql-results+json', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200, function () {
          assert.deepStrictEqual(this.req.headers.accept, ['application/sparql-results+json'])
        })

      await endpoint.selectQuery(simpleSelectQuery)
    })

    it('should send .accept option as Accept header field', async () => {
      const endpoint = new SparqlHttp({ endpointUrl: 'http://example.org/sparql' })
      const accept = 'text/plain'

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200, function () {
          assert.deepStrictEqual(this.req.headers.accept, [accept])
        })

      await endpoint.selectQuery(simpleSelectQuery, { accept: accept })
    })
  })

  describe('.updateQuery', () => {
    it('should return a request object', async () => {
      const endpoint = new SparqlHttp({ updateUrl: 'http://example.org/update' })

      nock('http://example.org')
        .post('/update')
        .reply(200)

      const res = await endpoint.updateQuery(simpleUpdateQuery)

      assert.strictEqual(typeof res, 'object')
      assert.strictEqual(typeof res.text, 'function')
    })

    it('should send a POST request with Accept header */*', async () => {
      const endpoint = new SparqlHttp({ updateUrl: 'http://example.org/update' })

      nock('http://example.org')
        .post('/update')
        .reply(200, function (url, body) {
          assert.deepStrictEqual(this.req.headers.accept, ['*/*'])
          assert.strictEqual(body, 'update=' + encodeURIComponent(simpleUpdateQuery))
        })

      await endpoint.updateQuery(simpleUpdateQuery)
    })

    it('should send .accept option as Accept header field', async () => {
      const endpoint = new SparqlHttp({ updateUrl: 'http://example.org/update' })
      const accept = 'text/plain'

      nock('http://example.org')
        .post('/update')
        .reply(200, function () {
          assert.deepStrictEqual(this.req.headers.accept, [accept])
        })

      await endpoint.updateQuery(simpleUpdateQuery, { accept: accept })
    })
  })
})
