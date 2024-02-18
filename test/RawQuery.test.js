import { rejects, strictEqual } from 'node:assert'
import express from 'express'
import withServer from 'express-as-promise/withServer.js'
import { describe, it } from 'mocha'
import RawQuery from '../RawQuery.js'
import SimpleClient from '../SimpleClient.js'
import { message, askQuery, constructQuery, selectQuery, updateQuery } from './support/examples.js'
import isSocketError from './support/isSocketError.js'

describe('RawQuery', () => {
  it('should be a constructor', () => {
    strictEqual(typeof RawQuery, 'function')
  })

  describe('.ask', () => {
    it('should be a method', () => {
      const query = new RawQuery({})

      strictEqual(typeof query.ask, 'function')
    })

    it('should return a response object', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new RawQuery({ client })

        const res = await query.ask(askQuery)

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
        const query = new RawQuery({ client })

        await query.ask(askQuery)

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
        const query = new RawQuery({ client })

        await query.ask(askQuery)

        strictEqual(parameter, askQuery)
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
        const query = new RawQuery({ client })

        await query.ask(askQuery)

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
        const client = new SimpleClient({ endpointUrl })
        const query = new RawQuery({ client })

        await query.ask(askQuery)

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
        const client = new SimpleClient({ endpointUrl })
        const query = new RawQuery({ client })

        await query.ask(askQuery, {
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
        const query = new RawQuery({ client })

        await query.ask(askQuery, {
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

        server.app.post('/', express.urlencoded({ extended: true }), async (req, res) => {
          parameter = req.body.query

          res.end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new RawQuery({ client })

        await query.ask(askQuery, { operation: 'postUrlencoded' })

        strictEqual(parameter, askQuery)
      })
    })

    it('should handle server socket errors', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          req.client.destroy()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new RawQuery({ client })

        await rejects(async () => {
          await query.ask(askQuery)
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
        const query = new RawQuery({ client })

        await query.ask(askQuery)
      })
    })
  })

  describe('.construct', () => {
    it('should be a method', () => {
      const query = new RawQuery({})

      strictEqual(typeof query.construct, 'function')
    })

    it('should return a response object', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new RawQuery({ client })

        const res = await query.construct(constructQuery)

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
        const query = new RawQuery({ client })

        await query.construct(constructQuery)

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
        const query = new RawQuery({ client })

        await query.construct(constructQuery)

        strictEqual(parameter, constructQuery)
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
        const query = new RawQuery({ client })

        await query.construct(constructQuery)

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
        const client = new SimpleClient({ endpointUrl })
        const query = new RawQuery({ client })

        await query.construct(constructQuery)

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
        const client = new SimpleClient({ endpointUrl })
        const query = new RawQuery({ client })

        await query.construct(constructQuery, {
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
        const query = new RawQuery({ client })

        await query.construct(constructQuery, {
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

        server.app.post('/', express.urlencoded({ extended: true }), async (req, res) => {
          parameter = req.body.query

          res.end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new RawQuery({ client })

        await query.construct(constructQuery, { operation: 'postUrlencoded' })

        strictEqual(parameter, constructQuery)
      })
    })

    it('should handle server socket errors', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          req.client.destroy()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new RawQuery({ client })

        await rejects(async () => {
          await query.construct(constructQuery)
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
        const query = new RawQuery({ client })

        await query.construct(constructQuery)
      })
    })
  })

  describe('.select', () => {
    it('should be a method', () => {
      const query = new RawQuery({})

      strictEqual(typeof query.select, 'function')
    })

    it('should return a response object', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new RawQuery({ client })

        const res = await query.select(selectQuery)

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
        const query = new RawQuery({ client })

        await query.select(selectQuery)

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
        const query = new RawQuery({ client })

        await query.select(selectQuery)

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
        const query = new RawQuery({ client })

        await query.select(selectQuery)

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
        const client = new SimpleClient({ endpointUrl })
        const query = new RawQuery({ client })

        await query.select(selectQuery)

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
        const client = new SimpleClient({ endpointUrl })
        const query = new RawQuery({ client })

        await query.select(selectQuery, {
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
        const query = new RawQuery({ client })

        await query.select(selectQuery, {
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

        server.app.post('/', express.urlencoded({ extended: true }), async (req, res) => {
          parameter = req.body.query

          res.end()
        })
        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new RawQuery({ client })

        await query.select(selectQuery, { operation: 'postUrlencoded' })

        strictEqual(parameter, selectQuery)
      })
    })

    it('should handle server socket errors', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          req.client.destroy()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new RawQuery({ client })

        await rejects(async () => {
          await query.select(selectQuery)
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
        const query = new RawQuery({ client })

        await query.select(selectQuery)
      })
    })
  })

  describe('.update', () => {
    it('should be a method', () => {
      const query = new RawQuery({})

      strictEqual(typeof query.update, 'function')
    })

    it('should return a response object', async () => {
      await withServer(async server => {
        server.app.post('/', async (req, res) => {
          res.end()
        })

        const updateUrl = await server.listen()
        const client = new SimpleClient({ updateUrl })
        const query = new RawQuery({ client })

        const res = await query.update(updateQuery)

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

        const updateUrl = await server.listen()
        const client = new SimpleClient({ updateUrl })
        const query = new RawQuery({ client })

        await query.update(updateQuery)

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
        const client = new SimpleClient({ updateUrl: `${updateUrl}?${key}=${value}` })
        const query = new RawQuery({ client })

        await query.update(updateQuery)

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
        const client = new SimpleClient({ updateUrl })
        const query = new RawQuery({ client })

        await query.update(updateQuery)

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
        const client = new SimpleClient({ updateUrl })
        const query = new RawQuery({ client })

        await query.update(updateQuery)

        strictEqual(contentType, 'application/x-www-form-urlencoded')
      })
    })

    it('should send the query string urlencoded in the request body', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.post('/', express.urlencoded({ extended: true }), async (req, res) => {
          parameter = req.body.update

          res.end()
        })

        const updateUrl = await server.listen()
        const client = new SimpleClient({ updateUrl })
        const query = new RawQuery({ client })

        await query.update(updateQuery)

        strictEqual(parameter, updateQuery)
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
        const client = new SimpleClient({ updateUrl })
        const query = new RawQuery({ client })

        await query.update(updateQuery, {
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
        const client = new SimpleClient({
          updateUrl,
          headers: {
            authorization: 'Bearer bar'
          }
        })
        const query = new RawQuery({ client })

        await query.update(updateQuery, {
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

        server.app.post('/', express.text({ type: '*/*' }), async (req, res) => {
          content = req.body

          res.end()
        })

        const updateUrl = await server.listen()
        const client = new SimpleClient({ updateUrl })
        const query = new RawQuery({ client })

        await query.update(updateQuery, { operation: 'postDirect' })

        strictEqual(content, updateQuery)
      })
    })

    it('should handle server socket errors', async () => {
      await withServer(async server => {
        server.app.post('/', async (req, res) => {
          req.client.destroy()
        })

        const updateUrl = await server.listen()
        const client = new SimpleClient({ updateUrl })
        const query = new RawQuery({ client })

        await rejects(async () => {
          await query.update(updateQuery)
        }, err => isSocketError(err))
      })
    })

    it('should not handle server errors', async () => {
      await withServer(async server => {
        server.app.post('/', async (req, res) => {
          res.status(500).end(message)
        })

        const updateUrl = await server.listen()
        const client = new SimpleClient({ updateUrl })
        const query = new RawQuery({ client })

        await query.update(updateQuery)
      })
    })
  })
})
