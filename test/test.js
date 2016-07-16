/* global describe, it */
var assert = require('assert')
var fetch = require('isomorphic-fetch')
var nock = require('nock')
var SparqlHttp = require('../')

describe('sparql-http-client', function () {
  var simpleConstructQuery = 'CONSTRUCT {?s ?p ?o} WHERE {?s ?p ?o}'
  var simpleSelectQuery = 'SELECT * WHERE {?s ?p ?o}'
  var simpleUpdateQuery = 'INSERT {<http://example.org/subject> <http://example.org/predicate> "object"} WHERE {}'

  SparqlHttp.fetch = fetch

  it('interface', function () {
    assert.equal(typeof SparqlHttp, 'function')
    assert.equal(typeof SparqlHttp.types, 'object')

    assert.equal(typeof SparqlHttp.prototype.getQuery, 'function')
    assert.equal(typeof SparqlHttp.prototype.postQueryDirect, 'function')
    assert.equal(typeof SparqlHttp.prototype.postQueryUrlencoded, 'function')
    assert.equal(typeof SparqlHttp.prototype.postQuery, 'function')
    assert.equal(typeof SparqlHttp.prototype.constructQuery, 'function')
    assert.equal(typeof SparqlHttp.prototype.selectQuery, 'function')
    assert.equal(typeof SparqlHttp.prototype.updateQuery, 'function')
  })

  describe('.getQuery', function () {
    it('should return a response object via Promise', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200)

      return endpoint.getQuery(simpleSelectQuery).then(function (res) {
        assert.equal(typeof res, 'object')
        assert.equal(typeof res.text, 'function')
      })
    })

    it('should send a GET request with query parameter to instance option .endpointUrl', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200)

      return endpoint.getQuery(simpleSelectQuery)
    })

    it('should send a GET request with query parameter to option .endpointUrl', function () {
      var endpoint = new SparqlHttp()

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200)

      return endpoint.getQuery(simpleSelectQuery, {endpointUrl: 'http://example.org/sparql'})
    })

    it('should send a GET request with query parameter to instance option .updateUrl if update is true', function () {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})

      nock('http://example.org')
        .get('/update?update=' + encodeURIComponent(simpleUpdateQuery))
        .reply(200)

      return endpoint.getQuery(simpleUpdateQuery, {update: true})
    })

    it('should send a GET request with query parameter to option .updateUrl if update is true', function () {
      var endpoint = new SparqlHttp()

      nock('http://example.org')
        .get('/update?update=' + encodeURIComponent(simpleUpdateQuery))
        .reply(200)

      return endpoint.getQuery(simpleUpdateQuery, {update: true, updateUrl: 'http://example.org/update'})
    })

    it('should send .accept option as Accept header field', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})
      var accept = 'text/plain'

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200, function () {
          assert.equal(this.req.headers.accept, accept)
        })

      endpoint.getQuery(simpleSelectQuery, {accept: accept})
    })
  })

  describe('.postQueryDirect', function () {
    it('should return a response object', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})

      nock('http://example.org')
        .post('/sparql')
        .reply(200)

      return endpoint.postQueryDirect(simpleSelectQuery).then(function (res) {
        assert.equal(typeof res, 'object')
        assert.equal(typeof res.text, 'function')
      })
    })

    it('should send a POST request to instance option .endpointUrl', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})

      nock('http://example.org')
        .post('/sparql')
        .reply(200)

      return endpoint.postQueryDirect(simpleSelectQuery)
    })

    it('should send a POST request to option .endpointUrl', function () {
      var endpoint = new SparqlHttp()

      nock('http://example.org')
        .post('/sparql')
        .reply(200)

      return endpoint.postQueryDirect(simpleSelectQuery, {endpointUrl: 'http://example.org/sparql'})
    })

    it('should send a POST request to instance option .updateUrl if update is true', function () {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})

      nock('http://example.org')
        .post('/update')
        .reply(200)

      return endpoint.postQueryDirect(simpleUpdateQuery, {update: true})
    })

    it('should send a POST request to option .updateUrl if update is true', function () {
      var endpoint = new SparqlHttp()

      nock('http://example.org')
        .post('/update')
        .reply(200)

      return endpoint.postQueryDirect(simpleUpdateQuery, {update: true, updateUrl: 'http://example.org/update'})
    })

    it('should send Content-Type application/sparql-query', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})

      nock('http://example.org')
        .post('/sparql')
        .reply(200, function (url, body) {
          assert.equal(this.req.headers['content-type'], 'application/sparql-query')
        })

      return endpoint.postQueryDirect(simpleSelectQuery)
    })

    it('should send the query in request body', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})

      nock('http://example.org')
        .post('/sparql')
        .reply(200, function (url, body) {
          assert.equal(body, simpleSelectQuery)
        })

      return endpoint.postQueryDirect(simpleSelectQuery)
    })

    it('should send .accept option as Accept header field', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})
      var accept = 'text/plain'

      nock('http://example.org')
        .post('/sparql')
        .reply(200, function () {
          assert.equal(this.req.headers.accept, accept)
        })

      endpoint.postQueryDirect(simpleSelectQuery, {accept: accept})
    })

    it('should send .contentType option as Accept header field', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})
      var contentType = 'text/plain'

      nock('http://example.org')
        .post('/sparql')
        .reply(200, function () {
          assert.equal(this.req.headers['content-type'], contentType)
        })

      endpoint.postQueryDirect(simpleSelectQuery, {contentType: contentType})
    })
  })

  describe('.postQueryUrlencoded', function () {
    it('should return a request object', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})

      nock('http://example.org')
        .post('/sparql')
        .reply(200)

      return endpoint.postQueryUrlencoded(simpleSelectQuery).then(function (res) {
        assert.equal(typeof res, 'object')
        assert.equal(typeof res.text, 'function')
      })
    })

    it('should send a POST request to instance option .endpointUrl', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})

      nock('http://example.org')
        .post('/sparql')
        .reply(200)

      return endpoint.postQueryUrlencoded(simpleSelectQuery)
    })

    it('should send a POST request to option .endpointUrl', function () {
      var endpoint = new SparqlHttp()

      nock('http://example.org')
        .post('/sparql')
        .reply(200)

      return endpoint.postQueryUrlencoded(simpleSelectQuery, {endpointUrl: 'http://example.org/sparql'})
    })

    it('should send a POST request to instance option .updateUrl if update is true', function () {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})

      nock('http://example.org')
        .post('/update')
        .reply(200)

      return endpoint.postQueryUrlencoded(simpleUpdateQuery, {update: true})
    })

    it('should send a POST request to option .updateUrl if update is true', function () {
      var endpoint = new SparqlHttp()

      nock('http://example.org')
        .post('/update')
        .reply(200)

      return endpoint.postQueryUrlencoded(simpleUpdateQuery, {update: true, updateUrl: 'http://example.org/update'})
    })

    it('should send Content-Type application/sparql-query', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})

      nock('http://example.org')
        .post('/sparql')
        .reply(200, function (url, body) {
          assert.equal(this.req.headers['content-type'], 'application/x-www-form-urlencoded')
        })

      return endpoint.postQueryUrlencoded(simpleSelectQuery)
    })

    it('should send the query urlencoded in request body', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})

      nock('http://example.org')
        .post('/sparql')
        .reply(200, function (url, body) {
          assert.equal(body, 'query=' + encodeURIComponent(simpleSelectQuery))
        })

      return endpoint.postQueryUrlencoded(simpleSelectQuery)
    })

    it('should send .accept option as Accept header field', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})
      var accept = 'text/plain'

      nock('http://example.org')
        .post('/sparql')
        .reply(200, function () {
          assert.equal(this.req.headers.accept, accept)
        })

      return endpoint.postQueryUrlencoded(simpleSelectQuery, {accept: accept})
    })

    it('should send .contentType option as Accept header field', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})
      var contentType = 'text/plain'

      nock('http://example.org')
        .post('/sparql')
        .reply(200, function () {
          assert.equal(this.req.headers['content-type'], contentType)
        })

      return endpoint.postQueryUrlencoded(simpleSelectQuery, {contentType: contentType})
    })
  })

  describe('.postQuery', function () {
    it('should use .postQueryUrlencoded by default', function () {
      var endpoint = new SparqlHttp()

      assert.equal(endpoint.postQuery, endpoint.postQueryUrlencoded)
    })
  })

  describe('.constructQuery', function () {
    it('should return a request object', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleConstructQuery))
        .reply(200)

      return endpoint.constructQuery(simpleConstructQuery).then(function (res) {
        assert.equal(typeof res, 'object')
        assert.equal(typeof res.text, 'function')
      })
    })

    it('should send a GET request with Accept header application/n-triples', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleConstructQuery))
        .reply(200, function () {
          assert.equal(this.req.headers.accept, 'application/n-triples')
        })

      return endpoint.constructQuery(simpleConstructQuery)
    })

    it('should send .accept option as Accept header field', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})
      var accept = 'text/plain'

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleConstructQuery))
        .reply(200, function () {
          assert.equal(this.req.headers.accept, accept)
        })

      return endpoint.constructQuery(simpleConstructQuery, {accept: accept})
    })
  })

  describe('.selectQuery', function () {
    it('should return a request object', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200)

      return endpoint.selectQuery(simpleSelectQuery).then(function (res) {
        assert.equal(typeof res, 'object')
        assert.equal(typeof res.text, 'function')
      })
    })

    it('should send a GET request with Accept header application/sparql-results+json', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200, function () {
          assert.equal(this.req.headers.accept, 'application/sparql-results+json')
        })

      return endpoint.selectQuery(simpleSelectQuery)
    })

    it('should send .accept option as Accept header field', function () {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})
      var accept = 'text/plain'

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200, function () {
          assert.equal(this.req.headers.accept, accept)
        })

      return endpoint.selectQuery(simpleSelectQuery, {accept: accept})
    })
  })

  describe('.updateQuery', function () {
    it('should return a request object', function () {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})

      nock('http://example.org')
        .post('/update')
        .reply(200)

      return endpoint.updateQuery(simpleUpdateQuery).then(function (res) {
        assert.equal(typeof res, 'object')
        assert.equal(typeof res.text, 'function')
      })
    })

    it('should send a POST request with Accept header */*', function () {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})

      nock('http://example.org')
        .post('/update')
        .reply(200, function (url, body) {
          assert.equal(this.req.headers.accept, '*/*')
          assert.equal(body, 'update=' + encodeURIComponent(simpleUpdateQuery))
        })

      return endpoint.updateQuery(simpleUpdateQuery)
    })

    it('should send .accept option as Accept header field', function () {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})
      var accept = 'text/plain'

      nock('http://example.org')
        .post('/update')
        .reply(200, function () {
          assert.equal(this.req.headers.accept, accept)
        })

      return endpoint.updateQuery(simpleUpdateQuery, {accept: accept})
    })
  })
})
