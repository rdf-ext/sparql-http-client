import { deepStrictEqual, rejects, strictEqual } from 'node:assert'
import withServer from 'express-as-promise/withServer.js'
import { isReadableStream, isWritableStream } from 'is-stream'
import { describe, it } from 'mocha'
import rdf from 'rdf-ext'
import { datasetEqual } from 'rdf-test/assert.js'
import { Readable } from 'readable-stream'
import chunks from 'stream-chunks/chunks.js'
import decode from 'stream-chunks/decode.js'
import SimpleClient from '../SimpleClient.js'
import StreamStore from '../StreamStore.js'
import { graph, message, quads } from './support/examples.js'
import isServerError from './support/isServerError.js'
import isSocketError from './support/isSocketError.js'
import * as ns from './support/namespaces.js'
import testFactory from './support/testFactory.js'

describe('StreamStore', () => {
  describe('.read', () => {
    it('should be a method', () => {
      const store = new StreamStore({})

      strictEqual(typeof store.read, 'function')
    })

    it('should return a Readable stream object', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        const result = store.read({ method: 'GET', graph })

        strictEqual(isReadableStream(result), true)
        strictEqual(isWritableStream(result), false)

        await chunks(result)
      })
    })

    it('should use the given method', async () => {
      await withServer(async server => {
        let called = false

        server.app.get('/', async (req, res) => {
          called = true

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        const stream = store.read({ method: 'GET', graph })
        await chunks(stream)

        strictEqual(called, true)
      })
    })

    it('should send the requested graph as a query parameter', async () => {
      await withServer(async server => {
        let graphParameter = null

        server.app.get('/', async (req, res) => {
          graphParameter = req.query.graph

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        const stream = store.read({ method: 'GET', graph })
        await chunks(stream)

        strictEqual(graphParameter, graph.value)
      })
    })

    it('should not send the graph query parameter if the default graph is requested', async () => {
      await withServer(async server => {
        let graphParameter = null

        server.app.get('/', async (req, res) => {
          graphParameter = req.query.graph

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        const stream = store.read({ method: 'GET', graph: rdf.defaultGraph() })
        await chunks(stream)

        strictEqual(graphParameter, undefined)
      })
    })

    it('should request content with media type application/n-triples', async () => {
      await withServer(async server => {
        let mediaType = null

        server.app.get('/', async (req, res) => {
          mediaType = req.get('accept')

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        const stream = store.read({ method: 'GET', graph })
        await chunks(stream)

        strictEqual(mediaType, 'application/n-triples')
      })
    })

    it('should parse the N-Triples and return them as a quad stream', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.end(quads.toString())
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        const stream = store.read({ method: 'GET', graph })
        const result = await chunks(stream)

        datasetEqual(result, rdf.dataset(quads, graph))
      })
    })

    it('should not send the graph query parameter if the default graph is requested', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.status(500).end(message)
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await rejects(async () => {
          const stream = store.read({ method: 'GET', graph })
          await chunks(stream)
        }, err => {
          return isServerError(err, message)
        })
      })
    })

    it('should use the given factory', async () => {
      await withServer(async server => {
        const quads = rdf.dataset([
          rdf.quad(rdf.blankNode(), ns.ex.predicate1, rdf.literal('test'), graph)
        ])
        const factory = testFactory()

        server.app.get('/', async (req, res) => {
          res.end(quads.toString())
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ factory, storeUrl })
        const store = new StreamStore({ client })

        const stream = store.read({ method: 'GET', graph })
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

    it('should use the given user and password', async () => {
      await withServer(async server => {
        let authorization = null

        server.app.get('/', async (req, res) => {
          authorization = req.headers.authorization

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl, user: 'abc', password: 'def' })
        const store = new StreamStore({ client })

        const stream = store.read({ method: 'GET', graph })
        await chunks(stream)

        strictEqual(authorization, 'Basic YWJjOmRlZg==')
      })
    })

    it('should handle server socket errors', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          req.client.destroy()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await rejects(async () => {
          const stream = store.read({ method: 'GET', graph })
          await chunks(stream)
        }, err => isSocketError(err))
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.status(500).end(message)
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await rejects(async () => {
          const stream = store.read({ method: 'GET', graph })
          await chunks(stream)
        }, err => isServerError(err, message))
      })
    })
  })

  describe('.write', () => {
    it('should be a method', () => {
      const store = new StreamStore({})

      strictEqual(typeof store.write, 'function')
    })

    it('should use the given method', async () => {
      await withServer(async server => {
        let called = false

        server.app.post('/', async (req, res) => {
          called = true

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await store.write({ method: 'POST', stream: quads.toStream() })

        strictEqual(called, true)
      })
    })

    it('should send content with media type application/n-triples', async () => {
      await withServer(async server => {
        let mediaType = null

        server.app.post('/', async (req, res) => {
          mediaType = req.get('content-type')

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await store.write({ method: 'POST', stream: quads.toStream() })

        strictEqual(mediaType, 'application/n-triples')
      })
    })

    it('should send the quad stream as N-Triples', async () => {
      await withServer(async server => {
        let content

        server.app.post('/', async (req, res) => {
          content = await decode(req)

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await store.write({ method: 'POST', stream: quads.toStream() })

        strictEqual(content, quads.toString())
      })
    })

    it('should handle streams with no data', async () => {
      await withServer(async server => {
        server.app.post('/', async (req, res) => {
          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await store.write({ method: 'POST', stream: Readable.from([]) })
      })
    })

    it('should use the given user and password', async () => {
      await withServer(async server => {
        let authorization = null

        server.app.post('/', async (req, res) => {
          authorization = req.headers.authorization

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl, user: 'abc', password: 'def' })
        const store = new StreamStore({ client })

        await store.write({ method: 'POST', stream: quads.toStream() })

        strictEqual(authorization, 'Basic YWJjOmRlZg==')
      })
    })

    it('should handle server socket errors', async () => {
      await withServer(async server => {
        server.app.post('/', async req => {
          req.client.destroy()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await rejects(async () => {
          await store.write({ method: 'POST', stream: quads.toStream() })
        }, err => isSocketError(err))
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        server.app.post('/', async (req, res) => {
          res.status(500).end(message)
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await rejects(async () => {
          await store.write({ method: 'POST', stream: quads.toStream() })
        }, err => isServerError(err, message))
      })
    })
  })

  describe('.get', () => {
    it('should be a method', () => {
      const store = new StreamStore({})

      strictEqual(typeof store.get, 'function')
    })

    it('should return a Readable stream object', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        const result = store.get(graph)

        strictEqual(isReadableStream(result), true)
        strictEqual(isWritableStream(result), false)

        await chunks(result)
      })
    })

    it('should send a GET request', async () => {
      await withServer(async server => {
        let called = false

        server.app.get('/', async (req, res) => {
          called = true

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        const stream = store.get(graph)
        await chunks(stream)

        strictEqual(called, true)
      })
    })

    it('should send the requested graph as a query parameter', async () => {
      await withServer(async server => {
        let graphParameter = null

        server.app.get('/', async (req, res) => {
          graphParameter = req.query.graph

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        const stream = store.get(graph)
        await chunks(stream)

        strictEqual(graphParameter, graph.value)
      })
    })

    it('should not send the graph query parameter if the default graph is requested', async () => {
      await withServer(async server => {
        let graphParameter = null

        server.app.get('/', async (req, res) => {
          graphParameter = req.query.graph

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        const stream = store.get(rdf.defaultGraph())
        await chunks(stream)

        strictEqual(graphParameter, undefined)
      })
    })

    it('should request content with media type application/n-triples', async () => {
      await withServer(async server => {
        let mediaType = null

        server.app.get('/', async (req, res) => {
          mediaType = req.get('accept')

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        const stream = store.get(graph)
        await chunks(stream)

        strictEqual(mediaType, 'application/n-triples')
      })
    })

    it('should parse the N-Triples and return them as a quad stream', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.end(quads.toString())
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        const stream = store.get(graph)
        const result = await chunks(stream)

        datasetEqual(result, rdf.dataset(quads, graph))
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.status(500).end(message)
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await rejects(async () => {
          const stream = store.get(graph)
          await chunks(stream)
        }, err => isServerError(err, message))
      })
    })
  })

  describe('.post', () => {
    it('should be a method', () => {
      const store = new StreamStore({})

      strictEqual(typeof store.post, 'function')
    })

    it('should send a POST request', async () => {
      await withServer(async server => {
        let called = false

        server.app.post('/', async (req, res) => {
          called = true

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await store.post(quads.toStream())

        strictEqual(called, true)
      })
    })

    it('should send content with media type application/n-triples', async () => {
      await withServer(async server => {
        let mediaType = null
        const quads = rdf.dataset([
          rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1)
        ])

        server.app.post('/', async (req, res) => {
          mediaType = req.get('content-type')

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await store.post(quads.toStream())

        strictEqual(mediaType, 'application/n-triples')
      })
    })

    it('should send the quad stream as N-Triples', async () => {
      await withServer(async server => {
        let content

        server.app.post('/', async (req, res) => {
          content = await decode(req)

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await store.post(quads.toStream())

        strictEqual(content, quads.toString())
      })
    })

    it('should support default graph', async () => {
      await withServer(async server => {
        let graph = true
        let content

        server.app.post('/', async (req, res) => {
          graph = req.query.graph
          content = await decode(req)

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await store.post(quads.toStream())

        strictEqual(graph, undefined)
        strictEqual(content, quads.toString())
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        server.app.post('/', async (req, res) => {
          res.status(500).end(message)
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await rejects(async () => {
          await store.post(quads.toStream())
        }, err => isServerError(err, message))
      })
    })
  })

  describe('.put', () => {
    it('should be a method', () => {
      const store = new StreamStore({})

      strictEqual(typeof store.put, 'function')
    })

    it('should send a PUT request', async () => {
      await withServer(async server => {
        let called = false

        server.app.put('/', async (req, res) => {
          called = true

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await store.put(quads.toStream())

        strictEqual(called, true)
      })
    })

    it('should send content with media type application/n-triples', async () => {
      await withServer(async server => {
        let mediaType = null

        server.app.put('/', async (req, res) => {
          mediaType = req.get('content-type')

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await store.put(quads.toStream())

        strictEqual(mediaType, 'application/n-triples')
      })
    })

    it('should send the quad stream as N-Triples', async () => {
      await withServer(async server => {
        let content

        server.app.put('/', async (req, res) => {
          content = await decode(req)

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await store.put(quads.toStream())

        strictEqual(content, quads.toString())
      })
    })

    it('should support default graph', async () => {
      await withServer(async server => {
        let graph = true
        let content

        server.app.put('/', async (req, res) => {
          graph = req.query.graph
          content = await decode(req)

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await store.put(quads.toStream())

        strictEqual(graph, undefined)
        strictEqual(content, quads.toString())
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        server.app.put('/', async (req, res) => {
          res.status(500).end(message)
        })

        const storeUrl = await server.listen()
        const client = new SimpleClient({ storeUrl })
        const store = new StreamStore({ client })

        await rejects(async () => {
          await store.put(quads.toStream())
        }, err => isServerError(err, message))
      })
    })
  })
})
