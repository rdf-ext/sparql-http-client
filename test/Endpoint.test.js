const { strictEqual } = require('assert')
const fetch = require('nodeify-fetch')
const { describe, it } = require('mocha')
const { text, urlencoded } = require('body-parser')
const Endpoint = require('../Endpoint')
const withServer = require('./support/withServer')

const simpleSelectQuery = 'SELECT * WHERE {?s ?p ?o}'
const simpleConstructQuery = 'CONSTRUCT {?s ?p ?o} WHERE {?s ?p ?o}'

describe('Endpoint', () => {
  it('should be a constructor', () => {
    strictEqual(typeof Endpoint, 'function')
  })

  it('should set authorization header if user and password are given', () => {
    const client = new Endpoint({ fetch, user: 'abc', password: 'def' })

    strictEqual(client.headers.get('authorization'), 'Basic YWJjOmRlZg==')
  })

  describe('.get', () => {
    it('should be a method', () => {
      const endpoint = new Endpoint({ fetch })

      strictEqual(typeof endpoint.get, 'function')
    })

    it('should async return a response object', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })

        const res = await endpoint.get(simpleSelectQuery)

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

        await endpoint.get(simpleSelectQuery)

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

        await endpoint.get(simpleSelectQuery)

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

        await endpoint.get(simpleSelectQuery)

        strictEqual(parameters[key], value)
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

        await endpoint.get(simpleConstructQuery, {
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

        await endpoint.get(simpleConstructQuery, {
          headers: {
            authorization: value
          }
        })

        strictEqual(header, value)
      })
    })

    it('should use the updateUrl and update param if update is true', async () => {
      await withServer(async server => {
        let parameters = null

        server.app.get('/', async (req, res) => {
          parameters = req.query

          res.end()
        })

        const updateUrl = await server.listen()

        const endpoint = new Endpoint({ updateUrl, fetch })

        await endpoint.get(simpleSelectQuery, { update: true })

        strictEqual(parameters.update, simpleSelectQuery)
      })
    })

    it('should keep existing update query params', async () => {
      await withServer(async server => {
        let parameters = null
        const key = 'auth_token'
        const value = '12345'

        server.app.get('/', async (req, res) => {
          parameters = req.query

          res.end()
        })

        const updateUrl = await server.listen()

        const endpoint = new Endpoint({ updateUrl: `${updateUrl}?${key}=${value}`, fetch })

        await endpoint.get(simpleSelectQuery, { update: true })

        strictEqual(parameters[key], value)
      })
    })
  })

  describe('.postDirect', () => {
    it('should be a method', () => {
      const endpoint = new Endpoint({ fetch })

      strictEqual(typeof endpoint.postDirect, 'function')
    })

    it('should async return a response object', async () => {
      await withServer(async server => {
        server.app.post('/', async (req, res) => {
          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })

        const res = await endpoint.postDirect(simpleSelectQuery)

        strictEqual(typeof res, 'object')
        strictEqual(typeof res.text, 'function')
      })
    })

    it('should send a POST request to the endpointUrl', async () => {
      await withServer(async server => {
        let called = false

        server.app.post('/', async (req, res) => {
          called = true

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })

        await endpoint.postDirect(simpleSelectQuery)

        strictEqual(called, true)
      })
    })

    it('should send a content type header with the value application/sparql-query & charset utf-8', async () => {
      await withServer(async server => {
        let contentType = null

        server.app.post('/', async (req, res) => {
          contentType = req.headers['content-type']

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })

        await endpoint.postDirect(simpleSelectQuery)

        strictEqual(contentType, 'application/sparql-query; charset=utf-8')
      })
    })

    it('should send the query string in the request body', async () => {
      await withServer(async server => {
        let content = null

        server.app.post('/', text({ type: '*/*' }), async (req, res) => {
          content = req.body

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })

        await endpoint.postDirect(simpleSelectQuery)

        strictEqual(content, simpleSelectQuery)
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

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })

        await endpoint.postDirect(simpleConstructQuery, {
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

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({
          endpointUrl,
          fetch,
          headers: {
            authorization: 'Bearer bar'
          }
        })

        await endpoint.postDirect(simpleConstructQuery, {
          headers: {
            authorization: value
          }
        })

        strictEqual(header, value)
      })
    })

    it('should use the updateUrl if update is true', async () => {
      await withServer(async server => {
        let called = false

        server.app.post('/', async (req, res) => {
          called = true

          res.end()
        })

        const updateUrl = await server.listen()

        const endpoint = new Endpoint({ updateUrl, fetch })

        await endpoint.postDirect(simpleSelectQuery, { update: true })

        strictEqual(called, true)
      })
    })
  })

  describe('.postUrlencoded', () => {
    it('should be a method', () => {
      const endpoint = new Endpoint({ fetch })

      strictEqual(typeof endpoint.postUrlencoded, 'function')
    })

    it('should async return a response object', async () => {
      await withServer(async server => {
        server.app.post('/', async (req, res) => {
          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })

        const res = await endpoint.postUrlencoded(simpleSelectQuery)

        strictEqual(typeof res, 'object')
        strictEqual(typeof res.text, 'function')
      })
    })

    it('should send a POST request to the endpointUrl', async () => {
      await withServer(async server => {
        let called = false

        server.app.post('/', async (req, res) => {
          called = true

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })

        await endpoint.postUrlencoded(simpleSelectQuery)

        strictEqual(called, true)
      })
    })

    it('should send a content type header with the value application/x-www-form-urlencoded', async () => {
      await withServer(async server => {
        let contentType = null

        server.app.post('/', async (req, res) => {
          contentType = req.headers['content-type']

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })

        await endpoint.postUrlencoded(simpleSelectQuery)

        strictEqual(contentType, 'application/x-www-form-urlencoded')
      })
    })

    it('should send the query string urlencoded in the request body', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.post('/', urlencoded({ extended: true }), async (req, res) => {
          parameter = req.body.query

          res.end()
        })

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })

        await endpoint.postUrlencoded(simpleSelectQuery)

        strictEqual(parameter, simpleSelectQuery)
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

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({ endpointUrl, fetch })

        await endpoint.postUrlencoded(simpleConstructQuery, {
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

        const endpointUrl = await server.listen()

        const endpoint = new Endpoint({
          endpointUrl,
          fetch,
          headers: {
            authorization: 'Bearer bar'
          }
        })

        await endpoint.postUrlencoded(simpleConstructQuery, {
          headers: {
            authorization: value
          }
        })

        strictEqual(header, value)
      })
    })

    it('should use the updateUrl if update is true', async () => {
      await withServer(async server => {
        let called = false

        server.app.post('/', async (req, res) => {
          called = true

          res.end()
        })

        const updateUrl = await server.listen()

        const endpoint = new Endpoint({ updateUrl, fetch })

        await endpoint.postUrlencoded(simpleSelectQuery, { update: true })

        strictEqual(called, true)
      })
    })
  })
})
