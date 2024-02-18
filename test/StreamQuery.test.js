import { deepStrictEqual, rejects, strictEqual } from 'node:assert'
import factory from '@rdfjs/data-model'
import express from 'express'
import withServer from 'express-as-promise/withServer.js'
import { isReadableStream, isWritableStream } from 'is-stream'
import { describe, it } from 'mocha'
import rdf from 'rdf-ext'
import { datasetEqual } from 'rdf-test/assert.js'
import chunks from 'stream-chunks/chunks.js'
import SimpleClient from '../SimpleClient.js'
import StreamQuery from '../StreamQuery.js'
import { message, quads, askQuery, constructQuery, selectQuery, updateQuery } from './support/examples.js'
import isServerError from './support/isServerError.js'
import isSocketError from './support/isSocketError.js'
import * as ns from './support/namespaces.js'
import testFactory from './support/testFactory.js'

describe('StreamQuery', () => {
  describe('.ask', () => {
    it('should be a method', () => {
      const query = new StreamQuery({})

      strictEqual(typeof query.ask, 'function')
    })

    it('should return a boolean value', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.json({
            boolean: true
          })
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        const result = await query.ask(askQuery)

        strictEqual(typeof result, 'boolean')
      })
    })

    it('should parse the SPARQL JSON result', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.json({
            boolean: true
          })
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        const result = await query.ask(askQuery)

        strictEqual(result, true)
      })
    })

    it('should send a GET request', async () => {
      await withServer(async server => {
        let called = false

        server.app.get('/', async (req, res) => {
          called = true

          res.end('{}')
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        await query.ask(askQuery)

        strictEqual(called, true)
      })
    })

    it('should send the query string as query parameter', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.get('/', async (req, res) => {
          parameter = req.query.query

          res.end('{}')
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        await query.ask(askQuery)

        strictEqual(parameter, askQuery)
      })
    })

    it('should use the given operation for the request', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.post('/', express.urlencoded({ extended: false }), async (req, res) => {
          parameter = req.body.query

          res.json({
            boolean: true
          })
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        await query.ask(askQuery, { operation: 'postUrlencoded' })

        strictEqual(parameter, askQuery)
      })
    })

    it('should handle server socket errors', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          req.destroy()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        await rejects(async () => {
          await query.ask(askQuery)
        }, err => isSocketError(err))
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.status(500).end(message)
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        await rejects(async () => {
          await query.ask(askQuery)
        }, err => isServerError(err, message))
      })
    })
  })

  describe('.construct', () => {
    it('should be a method', () => {
      const query = new StreamQuery({})

      strictEqual(typeof query.construct, 'function')
    })

    it('should return a Readable stream object', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.status(204).end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        const result = query.construct(constructQuery)

        strictEqual(isReadableStream(result), true)
        strictEqual(isWritableStream(result), false)

        await chunks(result)
      })
    })

    it('should parse the N-Triples', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.end(quads.toString())
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        const stream = query.construct(constructQuery)
        const result = await chunks(stream)

        datasetEqual(result, quads)
      })
    })

    it('should send a GET request', async () => {
      await withServer(async server => {
        let called = false

        server.app.get('/', async (req, res) => {
          called = true

          res.status(204).end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        const stream = query.construct(constructQuery)
        await chunks(stream)

        strictEqual(called, true)
      })
    })

    it('should send the query string as query parameter', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.get('/', async (req, res) => {
          parameter = req.query.query

          res.status(204).end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        const stream = query.construct(constructQuery)
        await chunks(stream)

        strictEqual(parameter, constructQuery)
      })
    })

    it('should use the given factory', async () => {
      await withServer(async server => {
        const quads = rdf.dataset([
          rdf.quad(rdf.blankNode(), ns.ex.predicate, rdf.literal('test'))
        ])
        const factory = testFactory()

        server.app.get('/', async (req, res) => {
          res.end(quads.toString())
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl, factory })
        const query = new StreamQuery({ client })

        const stream = query.construct(constructQuery)
        await chunks(stream)

        deepStrictEqual(factory.used, {
          blankNode: true,
          defaultGraph: true,
          literal: true,
          namedNode: true,
          quad: true
        })
      })
    })

    it('should use the given operation for the request', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.post('/', express.urlencoded({ extended: false }), async (req, res) => {
          parameter = req.body.query

          res.status(204).end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        const stream = query.construct(constructQuery, { operation: 'postUrlencoded' })
        await chunks(stream)

        strictEqual(parameter, constructQuery)
      })
    })

    it('should send an accept header with the value application/n-triples, text/turtle', async () => {
      await withServer(async server => {
        let accept = null

        server.app.get('/', async (req, res) => {
          accept = req.headers.accept

          res.end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        const stream = query.construct(constructQuery)
        await chunks(stream)

        strictEqual(accept, 'application/n-triples, text/turtle')
      })
    })

    it('should handle server socket errors', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          req.destroy()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        await rejects(async () => {
          const stream = query.construct(constructQuery)
          await chunks(stream)
        }, err => isSocketError(err))
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.status(500).end(message)
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        await rejects(async () => {
          const stream = query.construct(constructQuery)
          await chunks(stream)
        }, err => isServerError(err, message))
      })
    })
  })

  describe('.select', () => {
    it('should be a method', () => {
      const query = new StreamQuery({})

      strictEqual(typeof query.select, 'function')
    })

    it('should return a Readable stream object', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.status(204).end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        const result = query.select(selectQuery)

        strictEqual(isReadableStream(result), true)
        strictEqual(isWritableStream(result), false)

        await chunks(result)
      })
    })

    it('should parse the SPARQL JSON result', async () => {
      await withServer(async server => {
        const content = {
          results: {
            bindings: [{
              a: { type: 'uri', value: 'http://example.org/0' }
            }, {
              a: { type: 'uri', value: 'http://example.org/1' }
            }]
          }
        }

        server.app.get('/', async (req, res) => {
          res.end(JSON.stringify(content))
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl, factory })
        const query = new StreamQuery({ client })

        const stream = query.select(selectQuery)
        const result = await chunks(stream)

        strictEqual(result[0].a.termType, 'NamedNode')
        strictEqual(result[0].a.value, content.results.bindings[0].a.value)
        strictEqual(result[1].a.termType, 'NamedNode')
        strictEqual(result[1].a.value, content.results.bindings[1].a.value)
      })
    })

    it('should send a GET request', async () => {
      await withServer(async server => {
        let called = false

        server.app.get('/', async (req, res) => {
          called = true

          res.status(204).end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        const stream = query.select(selectQuery)
        await chunks(stream)

        strictEqual(called, true)
      })
    })

    it('should send the query string as query parameter', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.get('/', async (req, res) => {
          parameter = req.query.query

          res.status(204).end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        const stream = query.construct(selectQuery)
        await chunks(stream)

        strictEqual(parameter, selectQuery)
      })
    })

    it('should use the given factory', async () => {
      await withServer(async server => {
        const content = {
          results: {
            bindings: [{
              a: { type: 'bnode', value: 'b0' }
            }, {
              a: { type: 'literal', value: '0' }
            }, {
              a: { type: 'uri', value: 'http://example.org/0' }
            }]
          }
        }
        const factory = testFactory()

        server.app.get('/', async (req, res) => {
          res.end(JSON.stringify(content))
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl, factory })
        const query = new StreamQuery({ client })

        const stream = query.select(selectQuery)
        await chunks(stream)

        deepStrictEqual(factory.used, {
          blankNode: true,
          literal: true,
          namedNode: true
        })
      })
    })

    it('should use the given operation for the request', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.post('/', express.urlencoded({ extended: false }), async (req, res) => {
          parameter = req.body.query

          res.status(204).end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        const stream = query.select(selectQuery, { operation: 'postUrlencoded' })
        await chunks(stream)

        strictEqual(parameter, selectQuery)
      })
    })

    it('should handle server socket errors', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          req.destroy()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        await rejects(async () => {
          const stream = query.select(selectQuery)
          await chunks(stream)
        }, err => isSocketError(err))
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.status(500).end(message)
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new StreamQuery({ client })

        await rejects(async () => {
          const stream = query.select(selectQuery)
          await chunks(stream)
        }, err => isServerError(err, message))
      })
    })
  })

  describe('.update', () => {
    it('should be a method', () => {
      const query = new StreamQuery({})

      strictEqual(typeof query.update, 'function')
    })

    it('should send a POST request', async () => {
      await withServer(async server => {
        let called = false

        server.app.post('/', async (req, res) => {
          called = true

          res.status(204).end()
        })

        const updateUrl = await server.listen()
        const client = new SimpleClient({ updateUrl })
        const query = new StreamQuery({ client })

        await query.update(updateQuery)

        strictEqual(called, true)
      })
    })

    it('should send the query string urlencoded in the request body', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.post('/', express.urlencoded({ extended: false }), async (req, res) => {
          parameter = req.body.update

          res.status(204).end()
        })

        const updateUrl = await server.listen()
        const client = new SimpleClient({ updateUrl })
        const query = new StreamQuery({ client })

        await query.update(updateQuery)

        strictEqual(parameter, updateQuery)
      })
    })

    it('should use the given operation for the request', async () => {
      await withServer(async server => {
        let content = null

        server.app.post('/', express.text({ type: '*/*' }), async (req, res) => {
          content = req.body

          res.status(204).end()
        })

        const updateUrl = await server.listen()
        const client = new SimpleClient({ updateUrl })
        const query = new StreamQuery({ client })

        await query.update(updateQuery, { operation: 'postDirect' })

        strictEqual(content, updateQuery)
      })
    })

    it('should handle server socket errors', async () => {
      await withServer(async server => {
        server.app.post('/', async (req, res) => {
          req.destroy()
        })

        const updateUrl = await server.listen()
        const client = new SimpleClient({ updateUrl })
        const query = new StreamQuery({ client })

        await rejects(async () => {
          await query.update(updateQuery)
        }, err => isSocketError(err))
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        server.app.post('/', async (req, res) => {
          res.status(500).end(message)
        })

        const updateUrl = await server.listen()
        const client = new SimpleClient({ updateUrl })
        const query = new StreamQuery({ client })

        await rejects(async () => {
          await query.update(updateQuery)
        }, err => isServerError(err, message))
      })
    })
  })
})
