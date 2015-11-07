/* global describe, it */
var assert = require('assert')
var nock = require('nock')
var request = require('request')
var SparqlHttp = require('../')

describe('sparql-http-client', function () {
  var simpleConstructQuery = 'CONSTRUCT {?s ?p ?o} WHERE {?s ?p ?o}'
  var simpleSelectQuery = 'SELECT * WHERE {?s ?p ?o}'
  var simpleUpdateQuery = 'INSERT {<http://example.org/subject> <http://example.org/predicate> "object"} WHERE {}'

  SparqlHttp.request = SparqlHttp.requestModuleRequest(request)

  it('interface', function () {
    assert.equal(typeof SparqlHttp, 'function')
    assert.equal(typeof SparqlHttp.requestModuleRequest, 'function')
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
    it('should send a GET request with query parameter to instance option .endpointUrl', function (done) {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200)

      endpoint.getQuery(simpleSelectQuery, function (error) {
        done(error)
      })
    })

    it('should send a GET request with query parameter to option .endpointUrl', function (done) {
      var endpoint = new SparqlHttp()

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200)

      endpoint.getQuery(simpleSelectQuery, function (error) {
        done(error)
      }, {endpointUrl: 'http://example.org/sparql'})
    })

    it('should send .accept option as Accept header field', function (done) {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})
      var accept = 'text/plain'

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200, function () {
          assert.equal(this.req.headers.accept, accept)
        })

      endpoint.getQuery(simpleSelectQuery, function (error) {
        done(error)
      }, {accept: accept})
    })
  })

  describe('.postQueryDirect', function () {
    it('should send a POST request to instance option .updateUrl', function (done) {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})

      nock('http://example.org')
        .post('/update')
        .reply(200)

      endpoint.postQueryDirect(simpleSelectQuery, function (error) {
        done(error)
      })
    })

    it('should send a POST request to option .updateUrl', function (done) {
      var endpoint = new SparqlHttp()

      nock('http://example.org')
        .post('/update')
        .reply(200)

      endpoint.postQueryDirect(simpleSelectQuery, function (error) {
        done(error)
      }, {updateUrl: 'http://example.org/update'})
    })

    it('should send Content-Type application/sparql-query', function (done) {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})

      nock('http://example.org')
        .post('/update')
        .reply(200, function (url, body) {
          assert.equal(this.req.headers['content-type'], 'application/sparql-query')
        })

      endpoint.postQueryDirect(simpleSelectQuery, function (error) {
        done(error)
      })
    })

    it('should send the query in request body', function (done) {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})

      nock('http://example.org')
        .post('/update')
        .reply(200, function (url, body) {
          assert.equal(body, simpleSelectQuery)
        })

      endpoint.postQueryDirect(simpleSelectQuery, function (error) {
        done(error)
      })
    })

    it('should send .accept option as Accept header field', function (done) {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})
      var accept = 'text/plain'

      nock('http://example.org')
        .post('/update')
        .reply(200, function () {
          assert.equal(this.req.headers.accept, accept)
        })

      endpoint.postQueryDirect(simpleSelectQuery, function (error) {
        done(error)
      }, {accept: accept})
    })

    it('should send .contentType option as Accept header field', function (done) {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})
      var contentType = 'text/plain'

      nock('http://example.org')
        .post('/update')
        .reply(200, function () {
          assert.equal(this.req.headers['content-type'], contentType)
        })

      endpoint.postQueryDirect(simpleSelectQuery, function (error) {
        done(error)
      }, {contentType: contentType})
    })
  })

  describe('.postQueryUrlencoded', function () {
    it('should send a POST request to instance option .updateUrl', function (done) {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})

      nock('http://example.org')
        .post('/update')
        .reply(200)

      endpoint.postQueryUrlencoded(simpleSelectQuery, function (error) {
        done(error)
      })
    })

    it('should send a POST request to option .updateUrl', function (done) {
      var endpoint = new SparqlHttp()

      nock('http://example.org')
        .post('/update')
        .reply(200)

      endpoint.postQueryUrlencoded(simpleSelectQuery, function (error) {
        done(error)
      }, {updateUrl: 'http://example.org/update'})
    })

    it('should send Content-Type application/sparql-query', function (done) {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})

      nock('http://example.org')
        .post('/update')
        .reply(200, function (url, body) {
          assert.equal(this.req.headers['content-type'], 'application/x-www-form-urlencoded')
        })

      endpoint.postQueryUrlencoded(simpleSelectQuery, function (error) {
        done(error)
      })
    })

    it('should send the query urlencoded in request body', function (done) {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})

      nock('http://example.org')
        .post('/update')
        .reply(200, function (url, body) {
          assert.equal(body, 'query=' + encodeURIComponent(simpleSelectQuery))
        })

      endpoint.postQueryUrlencoded(simpleSelectQuery, function (error) {
        done(error)
      })
    })

    it('should send .accept option as Accept header field', function (done) {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})
      var accept = 'text/plain'

      nock('http://example.org')
        .post('/update')
        .reply(200, function () {
          assert.equal(this.req.headers.accept, accept)
        })

      endpoint.postQueryUrlencoded(simpleSelectQuery, function (error) {
        done(error)
      }, {accept: accept})
    })

    it('should send .contentType option as Accept header field', function (done) {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})
      var contentType = 'text/plain'

      nock('http://example.org')
        .post('/update')
        .reply(200, function () {
          assert.equal(this.req.headers['content-type'], contentType)
        })

      endpoint.postQueryUrlencoded(simpleSelectQuery, function (error) {
        done(error)
      }, {contentType: contentType})
    })
  })

  describe('.postQuery', function () {
    it('should use .postQueryUrlencoded by default', function () {
      var endpoint = new SparqlHttp()

      assert.equal(endpoint.postQuery, endpoint.postQueryUrlencoded)
    })
  })

  describe('.constructQuery', function () {
    it('should send a GET request with Accept header application/n-triples', function (done) {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleConstructQuery))
        .reply(200, function () {
          assert.equal(this.req.headers.accept, 'application/n-triples')
        })

      endpoint.constructQuery(simpleConstructQuery, function (error) {
        done(error)
      })
    })

    it('should send .accept option as Accept header field', function (done) {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})
      var accept = 'text/plain'

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleConstructQuery))
        .reply(200, function () {
          assert.equal(this.req.headers.accept, accept)
        })

      endpoint.constructQuery(simpleConstructQuery, function (error) {
        done(error)
      }, {accept: accept})
    })
  })

  describe('.selectQuery', function () {
    it('should send a GET request with Accept header application/sparql-results+json', function (done) {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200, function () {
          assert.equal(this.req.headers.accept, 'application/sparql-results+json')
        })

      endpoint.selectQuery(simpleSelectQuery, function (error) {
        done(error)
      })
    })

    it('should send .accept option as Accept header field', function (done) {
      var endpoint = new SparqlHttp({endpointUrl: 'http://example.org/sparql'})
      var accept = 'text/plain'

      nock('http://example.org')
        .get('/sparql?query=' + encodeURIComponent(simpleSelectQuery))
        .reply(200, function () {
          assert.equal(this.req.headers.accept, accept)
        })

      endpoint.selectQuery(simpleSelectQuery, function (error) {
        done(error)
      }, {accept: accept})
    })
  })

  describe('.updateQuery', function () {
    it('should send a POST request with Accept header */*', function (done) {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})

      nock('http://example.org')
        .post('/update')
        .reply(200, function (url, body) {
          assert.equal(this.req.headers.accept, '*/*')
          assert.equal(body, 'query=' + encodeURIComponent(simpleUpdateQuery))
        })

      endpoint.updateQuery(simpleUpdateQuery, function (error) {
        done(error)
      })
    })

    it('should send .accept option as Accept header field', function (done) {
      var endpoint = new SparqlHttp({updateUrl: 'http://example.org/update'})
      var accept = 'text/plain'

      nock('http://example.org')
        .post('/update')
        .reply(200, function () {
          assert.equal(this.req.headers.accept, accept)
        })

      endpoint.updateQuery(simpleUpdateQuery, function (error) {
        done(error)
      }, {accept: accept})
    })
  })
})
