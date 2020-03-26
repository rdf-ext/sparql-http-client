const { strictEqual } = require('assert')
const { text, urlencoded } = require('body-parser')
const fetch = require('nodeify-fetch')
const { describe, it } = require('mocha')
const Endpoint = require('../Endpoint')
const RawQuery = require('../RawQuery')
const withServer = require('./support/withServer')

const simpleAskQuery = 'ASK {}'
const simpleConstructQuery = 'CONSTRUCT {?s ?p ?o} WHERE {?s ?p ?o}'
const simpleSelectQuery = 'SELECT * WHERE {?s ?p ?o}'
const simpleUpdateQuery = 'INSERT {<http://example.org/subject> <http://example.org/predicate> "object"} WHERE {}'

describe('RawQuery', () => {
  it('should be a constructor', () => {
    strictEqual(typeof RawQuery, 'function')
  })

  describe('.ask', () => {
    it('should be a method', () => {
      const endpoint = new Endpoint({ fetch })
      const query = new RawQuery({ endpoint })

      strictEqual(typeof query.ask, 'function')
    })

    it('should async return a response object', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        const res = await query.ask(simpleAskQuery)

        strictEqual(typeof res, 'object')
        strictEqual(typeof res.text, 'function')
      })
    })

    it('should send a GET request to the endpointUrl', async () => {
      await withServer(async server => {
        let called = false

        server.app.get('/', async (req, res) => {
          called = true

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.ask(simpleAskQuery)

        strictEqual(called, true)
      })
    })

    it('should send the query string as query parameter', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.get('/', async (req, res) => {
          parameter = req.query.query

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.ask(simpleSelectQuery)

        strictEqual(parameter, simpleSelectQuery)
      })
    })

    it('should keep existing query params', async () => {
      await withServer(async server => {
        let parameters = null
        const key = 'auth_token'
        const value = '12345'

        server.app.get('/', async (req, res) => {
          parameters = req.query

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl: `${endpointUrl}?${key}=${value}`, fetch })
        const query = new RawQuery({ endpoint })

        await query.ask(simpleAskQuery)

        strictEqual(parameters[key], value)
      })
    })

    it('should send an accept header with the value application/sparql-results+json', async () => {
      await withServer(async server => {
        let accept = null

        server.app.get('/', async (req, res) => {
          accept = req.headers.accept

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.ask(simpleAskQuery)

        strictEqual(accept, 'application/sparql-results+json')
      })
    })

    it('should merge the headers given in the method call', async () => {
      await withServer(async server => {
        let header = null
        const value = 'Bearer foo'

        server.app.get('/', async (req, res) => {
          header = req.headers.authorization

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.ask(simpleAskQuery, {
          headers: {
            authorization: value
          }
        })

        strictEqual(header, value)
      })
    })

    it('should prioritize the headers from the method call', async () => {
      await withServer(async server => {
        let header = null
        const value = 'Bearer foo'

        server.app.get('/', async (req, res) => {
          header = req.headers.authorization

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({
          endpointUrl,
          fetch,
          headers: {
            authorization: 'Bearer bar'
          }
        })
        const query = new RawQuery({ endpoint })

        await query.ask(simpleAskQuery, {
          headers: {
            authorization: value
          }
        })

        strictEqual(header, value)
      })
    })

    it('should use the given operation for the request', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.post('/', urlencoded({ extended: true }), async (req, res) => {
          parameter = req.body.query

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.ask(simpleAskQuery, { operation: 'postUrlencoded' })

        strictEqual(parameter, simpleAskQuery)
      })
    })
  })

  describe('.construct', () => {
    it('should be a method', () => {
      const endpoint = new Endpoint({ fetch })
      const query = new RawQuery({ endpoint })

      strictEqual(typeof query.construct, 'function')
    })

    it('should async return a response object', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        const res = await query.construct(simpleConstructQuery)

        strictEqual(typeof res, 'object')
        strictEqual(typeof res.text, 'function')
      })
    })

    it('should send a GET request to the endpointUrl', async () => {
      await withServer(async server => {
        let called = false

        server.app.get('/', async (req, res) => {
          called = true

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.construct(simpleConstructQuery)

        strictEqual(called, true)
      })
    })

    it('should send the query string as query parameter', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.get('/', async (req, res) => {
          parameter = req.query.query

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.construct(simpleConstructQuery)

        strictEqual(parameter, simpleConstructQuery)
      })
    })

    it('should keep existing query params', async () => {
      await withServer(async server => {
        let parameters = null
        const key = 'auth_token'
        const value = '12345'

        server.app.get('/', async (req, res) => {
          parameters = req.query

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl: `${endpointUrl}?${key}=${value}`, fetch })
        const query = new RawQuery({ endpoint })

        await query.construct(simpleConstructQuery)

        strictEqual(parameters[key], value)
      })
    })

    it('should send an accept header with the value application/n-triples', async () => {
      await withServer(async server => {
        let accept = null

        server.app.get('/', async (req, res) => {
          accept = req.headers.accept

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.construct(simpleConstructQuery)

        strictEqual(accept, 'application/n-triples')
      })
    })

    it('should merge the headers given in the method call', async () => {
      await withServer(async server => {
        let header = null
        const value = 'Bearer foo'

        server.app.get('/', async (req, res) => {
          header = req.headers.authorization

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.construct(simpleConstructQuery, {
          headers: {
            authorization: value
          }
        })

        strictEqual(header, value)
      })
    })

    it('should prioritize the headers from the method call', async () => {
      await withServer(async server => {
        let header = null
        const value = 'Bearer foo'

        server.app.get('/', async (req, res) => {
          header = req.headers.authorization

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({
          endpointUrl,
          fetch,
          headers: {
            authorization: 'Bearer bar'
          }
        })
        const query = new RawQuery({ endpoint })

        await query.construct(simpleConstructQuery, {
          headers: {
            authorization: value
          }
        })

        strictEqual(header, value)
      })
    })

    it('should use the given operation for the request', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.post('/', urlencoded({ extended: true }), async (req, res) => {
          parameter = req.body.query

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.construct(simpleConstructQuery, { operation: 'postUrlencoded' })

        strictEqual(parameter, simpleConstructQuery)
      })
    })
  })

  describe('.select', () => {
    it('should be a method', () => {
      const endpoint = new Endpoint({ fetch })
      const query = new RawQuery({ endpoint })

      strictEqual(typeof query.select, 'function')
    })

    it('should async return a response object', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        const res = await query.select(simpleSelectQuery)

        strictEqual(typeof res, 'object')
        strictEqual(typeof res.text, 'function')
      })
    })

    it('should send a GET request to the endpointUrl', async () => {
      await withServer(async server => {
        let called = false

        server.app.get('/', async (req, res) => {
          called = true

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.select(simpleSelectQuery)

        strictEqual(called, true)
      })
    })

    it('should send the query string as query parameter', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.get('/', async (req, res) => {
          parameter = req.query.query

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.select(simpleSelectQuery)

        strictEqual(parameter, simpleSelectQuery)
      })
    })

    it('should keep existing query params', async () => {
      await withServer(async server => {
        let parameters = null
        const key = 'auth_token'
        const value = '12345'

        server.app.get('/', async (req, res) => {
          parameters = req.query

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl: `${endpointUrl}?${key}=${value}`, fetch })
        const query = new RawQuery({ endpoint })

        await query.select(simpleSelectQuery)

        strictEqual(parameters[key], value)
      })
    })

    it('should send an accept header with the value application/sparql-results+json', async () => {
      await withServer(async server => {
        let accept = null

        server.app.get('/', async (req, res) => {
          accept = req.headers.accept

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.select(simpleSelectQuery)

        strictEqual(accept, 'application/sparql-results+json')
      })
    })

    it('should merge the headers given in the method call', async () => {
      await withServer(async server => {
        let header = null
        const value = 'Bearer foo'

        server.app.get('/', async (req, res) => {
          header = req.headers.authorization

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.select(simpleSelectQuery, {
          headers: {
            authorization: value
          }
        })

        strictEqual(header, value)
      })
    })

    it('should prioritize the headers from the method call', async () => {
      await withServer(async server => {
        let header = null
        const value = 'Bearer foo'

        server.app.get('/', async (req, res) => {
          header = req.headers.authorization

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({
          endpointUrl,
          fetch,
          headers: {
            authorization: 'Bearer bar'
          }
        })
        const query = new RawQuery({ endpoint })

        await query.select(simpleSelectQuery, {
          headers: {
            authorization: value
          }
        })

        strictEqual(header, value)
      })
    })

    it('should use the given operation for the request', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.post('/', urlencoded({ extended: true }), async (req, res) => {
          parameter = req.body.query

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.select(simpleSelectQuery, { operation: 'postUrlencoded' })

        strictEqual(parameter, simpleSelectQuery)
      })
    })
  })

  describe('.update', () => {
    it('should be a method', () => {
      const endpoint = new Endpoint({ fetch })
      const query = new RawQuery({ endpoint })

      strictEqual(typeof query.update, 'function')
    })

    it('should async return a response object', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.end()
        })

        const updateUrl = await server.listen()

        const endpoint = new Endpoint({ updateUrl, fetch })
        const query = new RawQuery({ endpoint })

        const res = await query.update(simpleUpdateQuery)

        strictEqual(typeof res, 'object')
        strictEqual(typeof res.text, 'function')
      })
    })

    it('should send a POST request to the updateUrl', async () => {
      await withServer(async server => {
        let called = false

        server.app.post('/', async (req, res) => {
          called = true

          res.end()
        })

        const updateUrl = await server.listen()

        const endpoint = new Endpoint({ updateUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.update(simpleUpdateQuery)

        strictEqual(called, true)
      })
    })

    it('should keep existing query params', async () => {
      await withServer(async server => {
        let parameters = null
        const key = 'auth_token'
        const value = '12345'

        server.app.post('/', async (req, res) => {
          parameters = req.query

          res.end()
        })

        const updateUrl = await server.listen()

        const endpoint = new Endpoint({ updateUrl: `${updateUrl}?${key}=${value}`, fetch })
        const query = new RawQuery({ endpoint })

        await query.update(simpleUpdateQuery)

        strictEqual(parameters[key], value)
      })
    })

    it('should send an accept header with the value */*', async () => {
      await withServer(async server => {
        let accept = null

        server.app.post('/', async (req, res) => {
          accept = req.headers.accept

          res.end()
        })

        const updateUrl = await server.listen()

        const endpoint = new Endpoint({ updateUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.update(simpleUpdateQuery)

        strictEqual(accept, '*/*')
      })
    })

    it('should send a content-type header with the value application/x-www-form-urlencoded', async () => {
      await withServer(async server => {
        let contentType = null

        server.app.post('/', async (req, res) => {
          contentType = req.headers['content-type']

          res.end()
        })

        const updateUrl = await server.listen()

        const endpoint = new Endpoint({ updateUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.update(simpleUpdateQuery)

        strictEqual(contentType, 'application/x-www-form-urlencoded')
      })
    })

    it('should send the query string urlencoded in the request body', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.post('/', urlencoded({ extended: true }), async (req, res) => {
          parameter = req.body.update

          res.end()
        })

        const updateUrl = await server.listen()

        const endpoint = new Endpoint({ updateUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.update(simpleUpdateQuery)

        strictEqual(parameter, simpleUpdateQuery)
      })
    })

    it('should merge the headers given in the method call', async () => {
      await withServer(async server => {
        let header = null
        const value = 'Bearer foo'

        server.app.post('/', async (req, res) => {
          header = req.headers.authorization

          res.end()
        })

        const updateUrl = await server.listen()

        const endpoint = new Endpoint({ updateUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.update(simpleUpdateQuery, {
          headers: {
            authorization: value
          }
        })

        strictEqual(header, value)
      })
    })

    it('should prioritize the headers from the method call', async () => {
      await withServer(async server => {
        let header = null
        const value = 'Bearer foo'

        server.app.post('/', async (req, res) => {
          header = req.headers.authorization

          res.end()
        })

        const updateUrl = await server.listen()

        const endpoint = new Endpoint({
          updateUrl,
          fetch,
          headers: {
            authorization: 'Bearer bar'
          }
        })
        const query = new RawQuery({ endpoint })

        await query.update(simpleUpdateQuery, {
          headers: {
            authorization: value
          }
        })

        strictEqual(header, value)
      })
    })

    it('should use the given operation for the request', async () => {
      await withServer(async server => {
        let content = null

        server.app.post('/', text({ type: '*/*' }), async (req, res) => {
          content = req.body

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new RawQuery({ endpoint })

        await query.select(simpleUpdateQuery, { operation: 'postDirect' })

        strictEqual(content, simpleUpdateQuery)
      })
    })
  })
})
