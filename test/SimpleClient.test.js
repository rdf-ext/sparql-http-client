import { rejects, strictEqual, throws } from 'node:assert'
import express from 'express'
import withServer from 'express-as-promise/withServer.js'
import { describe, it } from 'mocha'
import RawQuery from '../RawQuery.js'
import SimpleClient from '../SimpleClient.js'
import { message, selectQuery, updateQuery } from './support/examples.js'
import isSocketError from './support/isSocketError.js'

describe('SimpleClient', () => {
  it('should be a constructor', () => {
    strictEqual(typeof SimpleClient, 'function')
  })

  it('should throw an error if endpointUrl, storeUrl, or updateUrl is given', () => {
    throws(() => {
      new SimpleClient({}) // eslint-disable-line no-new
    }, {
      message: /endpointUrl/
    })
  })

  it('should use RawQuery to create the query instance', () => {
    const client = new SimpleClient({ endpointUrl: 'test' })

    strictEqual(client.query instanceof RawQuery, true)
  })

  it('should set authorization header if user and password are given', () => {
    const client = new SimpleClient({
      endpointUrl: 'test',
      user: 'abc',
      password: 'def'
    })

    strictEqual(client.headers.get('authorization'), 'Basic YWJjOmRlZg==')
  })

  it('should forward client to Query constructor', () => {
    class Query {
      constructor ({ client }) {
        this.client = client
      }
    }

    const client = new SimpleClient({ endpointUrl: 'test', Query })

    strictEqual(client.query.client, client)
  })

  it('should forward client to Store constructor', () => {
    class Store {
      constructor ({ client }) {
        this.client = client
      }
    }

    const client = new SimpleClient({ endpointUrl: 'test', Store })

    strictEqual(client.store.client, client)
  })

  describe('.get', () => {
    it('should be a method', () => {
      const client = new SimpleClient({ endpointUrl: 'test' })

      strictEqual(typeof client.get, 'function')
    })

    it('should return a response object', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })

        const res = await client.get(selectQuery)

        strictEqual(typeof res, 'object')
        strictEqual(typeof res.text, 'function')
      })
    })

    it('should send a GET request', async () => {
      await withServer(async server => {
        let called = false

        server.app.get('/', async (req, res) => {
          called = true

          res.end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })

        await client.get(selectQuery)

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
        const client = new SimpleClient({ endpointUrl })

        await client.get(selectQuery)

        strictEqual(parameter, selectQuery)
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
        const client = new SimpleClient({ endpointUrl: `${endpointUrl}?${key}=${value}` })

        await client.get(selectQuery)

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
        const client = new SimpleClient({ endpointUrl })

        await client.get(selectQuery, {
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
        const client = new SimpleClient({
          endpointUrl,
          headers: {
            authorization: 'Bearer bar'
          }
        })

        await client.get(selectQuery, {
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
        const client = new SimpleClient({ updateUrl })

        await client.get(updateQuery, { update: true })

        strictEqual(parameters.update, updateQuery)
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
        const client = new SimpleClient({ updateUrl: `${updateUrl}?${key}=${value}` })

        await client.get(updateQuery, { update: true })

        strictEqual(parameters[key], value)
      })
    })

    it('should handle server socket errors', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          req.client.destroy()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })

        await rejects(async () => {
          await client.get(selectQuery)
        }, err => isSocketError(err))
      })
    })

    it('should not handle server errors', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.status(500).end(message)
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })

        await client.get(selectQuery)
      })
    })
  })

  describe('.postDirect', () => {
    it('should be a method', () => {
      const client = new SimpleClient({ endpointUrl: 'test' })

      strictEqual(typeof client.postDirect, 'function')
    })

    it('should return a response object', async () => {
      await withServer(async server => {
        server.app.post('/', async (req, res) => {
          res.end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })

        const res = await client.postDirect(selectQuery)

        strictEqual(typeof res, 'object')
        strictEqual(typeof res.text, 'function')
      })
    })

    it('should send a POST request', async () => {
      await withServer(async server => {
        let called = false

        server.app.post('/', async (req, res) => {
          called = true

          res.end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })

        await client.postDirect(selectQuery)

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
        const client = new SimpleClient({ endpointUrl })

        await client.postDirect(selectQuery)

        strictEqual(contentType, 'application/sparql-query; charset=utf-8')
      })
    })

    it('should send the query string in the request body', async () => {
      await withServer(async server => {
        let content = null

        server.app.post('/', express.text({ type: '*/*' }), async (req, res) => {
          content = req.body

          res.end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })

        await client.postDirect(selectQuery)

        strictEqual(content, selectQuery)
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
        const client = new SimpleClient({ endpointUrl })

        await client.postDirect(selectQuery, {
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
        const client = new SimpleClient({
          endpointUrl,
          headers: {
            authorization: 'Bearer bar'
          }
        })

        await client.postDirect(selectQuery, {
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
        const client = new SimpleClient({ updateUrl })

        await client.postDirect(updateQuery, { update: true })

        strictEqual(called, true)
      })
    })

    it('should handle server socket errors', async () => {
      await withServer(async server => {
        server.app.post('/', async (req, res) => {
          req.client.destroy()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })

        await rejects(async () => {
          await client.postDirect(selectQuery)
        }, err => isSocketError(err))
      })
    })

    it('should not handle server errors', async () => {
      await withServer(async server => {
        server.app.post('/', async (req, res) => {
          res.status(500).end(message)
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })

        await client.postDirect(selectQuery)
      })
    })
  })

  describe('.postUrlencoded', () => {
    it('should be a method', () => {
      const client = new SimpleClient({ endpointUrl: 'test' })

      strictEqual(typeof client.postUrlencoded, 'function')
    })

    it('should return a response object', async () => {
      await withServer(async server => {
        server.app.post('/', async (req, res) => {
          res.end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })

        const res = await client.postUrlencoded(selectQuery)

        strictEqual(typeof res, 'object')
        strictEqual(typeof res.text, 'function')
      })
    })

    it('should send a POST request', async () => {
      await withServer(async server => {
        let called = false

        server.app.post('/', async (req, res) => {
          called = true

          res.end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })

        await client.postUrlencoded(selectQuery)

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
        const client = new SimpleClient({ endpointUrl })

        await client.postUrlencoded(selectQuery)

        strictEqual(contentType, 'application/x-www-form-urlencoded')
      })
    })

    it('should send the query string urlencoded in the request body', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.post('/', express.urlencoded({ extended: true }), async (req, res) => {
          parameter = req.body.query

          res.end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })

        await client.postUrlencoded(selectQuery)

        strictEqual(parameter, selectQuery)
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
        const client = new SimpleClient({ endpointUrl })

        await client.postUrlencoded(selectQuery, {
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
        const client = new SimpleClient({
          endpointUrl,
          headers: {
            authorization: 'Bearer bar'
          }
        })

        await client.postUrlencoded(selectQuery, {
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
        const client = new SimpleClient({ updateUrl })

        await client.postUrlencoded(updateQuery, { update: true })

        strictEqual(called, true)
      })
    })

    it('should handle server socket errors', async () => {
      await withServer(async server => {
        server.app.post('/', async (req, res) => {
          req.client.destroy()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })

        await rejects(async () => {
          await client.postUrlencoded(selectQuery)
        }, err => isSocketError(err))
      })
    })

    it('should not handle server errors', async () => {
      await withServer(async server => {
        server.app.post('/', async (req, res) => {
          res.status(500).end(message)
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })

        await client.postUrlencoded(selectQuery)
      })
    })
  })
})
