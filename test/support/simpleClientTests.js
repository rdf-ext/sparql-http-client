import { deepStrictEqual, rejects, strictEqual } from 'node:assert'
import express from 'express'
import withServer from 'express-as-promise/withServer.js'
import { it } from 'mocha'
import { message } from './examples.js'
import isSocketError from './isSocketError.js'

function createRoute (server, func, { actual = {}, operation = 'get' } = {}) {
  if (!func) {
    func = (req, res) => {
      actual.operation = operation
      actual.called = true
      actual.query = req.query
      actual.headers = req.headers

      if (operation === 'postUrlencoded') {
        actual.parameters = req.body
      } else {
        actual.parameters = req.query
      }

      actual.content = req.body

      res.end()
    }
  }

  if (operation === 'get') {
    server.app.get('/', func)
  } else if (operation === 'postDirect') {
    server.app.post('/', express.text({ type: '*/*' }), func)
  } else if (operation === 'postUrlencoded') {
    server.app.post('/', express.urlencoded({ extended: true }), func)
  }

  return { actual }
}

function shouldHandlerServerSocketErrors (func, { operation } = {}) {
  it('should handle server socket errors', async () => {
    await withServer(async server => {
      createRoute(server, async (req, res) => {
        req.client.destroy()
      }, { operation })

      await rejects(async () => {
        await func(await server.listen())
      }, err => isSocketError(err))
    })
  })
}

function shouldKeepExistingQueryParameters (func, { operation } = {}) {
  it('should keep existing query parameters', async () => {
    await withServer(async server => {
      const key = 'auth_token'
      const value = '12345'
      const expected = { [key]: value }
      const { actual } = createRoute(server, null, { operation })

      await func(await server.listen(), expected)
      const { query, ...others } = actual.parameters

      deepStrictEqual(others, expected)
    })
  })
}

function shouldKeepExistingUpdateParameters (func, { operation } = {}) {
  it('should keep existing update parameters', async () => {
    await withServer(async server => {
      const key = 'auth_token'
      const value = '12345'
      const expected = { [key]: value }

      let parameters = null

      createRoute(server, async (req, res) => {
        const { update, ...others } = req.query

        parameters = others

        res.end()
      }, { operation })

      await func(await server.listen(), expected)

      deepStrictEqual(parameters, expected)
    })
  })
}

function shouldMergeMethodParameters (func, { operation } = {}) {
  it('should merge method call and constructor parameters', async () => {
    await withServer(async server => {
      const key = 'format'
      const value = 'csv'
      const expected = { [key]: value }

      let parameters = null

      createRoute(server, async (req, res) => {
        if (operation === 'postUrlencoded') {
          parameters = req.body
        } else {
          parameters = req.query
        }

        res.end()
      }, { operation })

      await func(await server.listen(), expected)

      deepStrictEqual(parameters[key], [`${value} bar`, value])
    })
  })
}

function shouldNotHandleServerHttpErrors (func, { operation } = {}) {
  it('should not handle server HTTP errors', async () => {
    await withServer(async server => {
      createRoute(server, async (req, res) => {
        res.status(500).end(message)
      }, { operation })

      await func(await server.listen())
    })
  })
}

function shouldPrioritizeMethodHeaders (func, { operation } = {}) {
  it('should prioritize method call headers', async () => {
    await withServer(async server => {
      const key = 'authorization'
      const value = 'Bearer foo'
      const expected = { [key]: value }

      let headers = null

      createRoute(server, async (req, res) => {
        headers = req.headers

        res.end()
      }, { operation })

      await func(await server.listen(), expected)

      for (const [key, value] of Object.entries(expected)) {
        strictEqual(headers[key], value)
      }
    })
  })
}

function shouldReturnResponseObject (func, { operation } = {}) {
  it('should return a response object', async () => {
    await withServer(async server => {
      createRoute(server, null, { operation })

      const res = await func(await server.listen())

      strictEqual(typeof res, 'object')
      strictEqual(typeof res.text, 'function')
    })
  })
}

function shouldSendConstructorHeaders (func, { operation } = {}) {
  it('should send the headers given to the constructor', async () => {
    await withServer(async server => {
      const key = 'authorization'
      const value = 'Bearer foo'
      const expected = { [key]: value }

      let headers = null

      createRoute(server, async (req, res) => {
        headers = req.headers

        res.end()
      }, { operation })

      await func(await server.listen(), expected)

      for (const [key, value] of Object.entries(expected)) {
        strictEqual(headers[key], value)
      }
    })
  })
}

function shouldSendConstructorParameters (func, { operation } = {}) {
  it('should send the parameters given to the constructor', async () => {
    await withServer(async server => {
      const key = 'format'
      const value = 'csv'
      const expected = { [key]: value }

      let parameters = null

      createRoute(server, async (req, res) => {
        if (operation === 'postUrlencoded') {
          parameters = req.body
        } else {
          parameters = req.query
        }

        res.end()
      }, { operation })

      await func(await server.listen(), expected)

      for (const [key, value] of Object.entries(expected)) {
        strictEqual(parameters[key], value)
      }
    })
  })
}

function shouldSendGetRequest (func) {
  it('should send a GET request', async () => {
    await withServer(async server => {
      const { actual } = createRoute(server)

      await func(await server.listen())

      strictEqual(actual.called, true)
    })
  })
}

function shouldSendMethodHeaders (func, { operation } = {}) {
  it('should send the headers given to the method call', async () => {
    await withServer(async server => {
      const key = 'authorization'
      const value = 'Bearer foo'
      const expected = { [key]: value }

      let headers = null

      createRoute(server, async (req, res) => {
        headers = req.headers

        res.end()
      }, { operation })

      await func(await server.listen(), expected)

      for (const [key, value] of Object.entries(expected)) {
        strictEqual(headers[key], value)
      }
    })
  })
}

function shouldSendMethodParameters (func, { operation } = {}) {
  it('should send the parameters given to the method call', async () => {
    await withServer(async server => {
      const key = 'format'
      const value = 'csv'
      const expected = { [key]: value }

      let parameters = null

      createRoute(server, async (req, res) => {
        if (operation === 'postUrlencoded') {
          parameters = req.body
        } else {
          parameters = req.query
        }

        res.end()
      }, { operation })

      await func(await server.listen(), expected)

      for (const [key, value] of Object.entries(expected)) {
        strictEqual(parameters[key], value)
      }
    })
  })
}

function shouldSendPostRequest (func) {
  it('should send a POST request', async () => {
    await withServer(async server => {
      const { actual } = createRoute(server, null, { operation: 'postDirect' })

      await func(await server.listen())

      strictEqual(actual.called, true)
    })
  })
}

function shouldSendQueryContent (func) {
  it('should send the query with content type application/sparql-query & charset utf-8', async () => {
    await withServer(async server => {
      const expected = '12345'
      const { actual } = createRoute(server, null, { operation: 'postDirect' })

      await func(await server.listen(), expected)

      strictEqual(actual.headers['content-type'], 'application/sparql-query; charset=utf-8')
      strictEqual(actual.content, expected)
    })
  })
}

function shouldSendQueryStringAsParameter (func) {
  it('should send the query string as query parameter', async () => {
    await withServer(async server => {
      const expected = '12345'
      const { actual } = createRoute(server)

      await func(await server.listen(), expected)

      strictEqual(actual.query.query, expected)
    })
  })
}

function shouldSendUpdateContent (func) {
  it('should send the update with content type application/sparql-query & charset utf-8', async () => {
    await withServer(async server => {
      const expected = '12345'
      const { actual } = createRoute(server, null, { operation: 'postDirect' })

      await func(await server.listen(), expected)

      strictEqual(actual.headers['content-type'], 'application/sparql-query; charset=utf-8')
      strictEqual(actual.content, expected)
    })
  })
}

function shouldSendUpdateStringAsParameter (func) {
  it('should send the update string as update parameter', async () => {
    await withServer(async server => {
      const expected = '12345'
      const { actual } = createRoute(server)

      await func(await server.listen(), expected)

      strictEqual(actual.query.update, expected)
    })
  })
}

function shouldSendUrlEncodedQueryContent (func) {
  it('should send the query url encoded with content type application/x-www-form-urlencoded', async () => {
    await withServer(async server => {
      const expected = '12345'
      const { actual } = createRoute(server, null, { operation: 'postUrlencoded' })

      await func(await server.listen(), expected)

      strictEqual(actual.headers['content-type'], 'application/x-www-form-urlencoded')
      strictEqual(actual.content.query, expected)
    })
  })
}

function shouldSendUrlEncodedUpdateContent (func) {
  it('should send the update url encoded with content type application/x-www-form-urlencoded', async () => {
    await withServer(async server => {
      const expected = '12345'
      const { actual } = createRoute(server, null, { operation: 'postUrlencoded' })

      await func(await server.listen(), expected)

      strictEqual(actual.headers['content-type'], 'application/x-www-form-urlencoded')
      strictEqual(actual.content.update, expected)
    })
  })
}

export {
  shouldHandlerServerSocketErrors,
  shouldKeepExistingQueryParameters,
  shouldKeepExistingUpdateParameters,
  shouldMergeMethodParameters,
  shouldNotHandleServerHttpErrors,
  shouldPrioritizeMethodHeaders,
  shouldReturnResponseObject,
  shouldSendConstructorHeaders,
  shouldSendConstructorParameters,
  shouldSendGetRequest,
  shouldSendMethodHeaders,
  shouldSendMethodParameters,
  shouldSendPostRequest,
  shouldSendQueryContent,
  shouldSendQueryStringAsParameter,
  shouldSendUpdateContent,
  shouldSendUpdateStringAsParameter,
  shouldSendUrlEncodedQueryContent,
  shouldSendUrlEncodedUpdateContent
}
