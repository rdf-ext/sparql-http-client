const { deepStrictEqual, notStrictEqual, rejects, strictEqual } = require('assert')
const getStream = require('get-stream')
const intoStream = require('into-stream')
const { describe, it } = require('mocha')
const fetch = require('nodeify-fetch')
const { toCanonical } = require('rdf-dataset-ext')
const rdf = require('@rdfjs/data-model')
const namespace = require('@rdfjs/namespace')
const { quadToNTriples } = require('@rdfjs/to-ntriples')
const testFactory = require('./support/testFactory')
const withServer = require('./support/withServer')
const Endpoint = require('../Endpoint')
const StreamStore = require('../StreamStore')

const ns = {
  ex: namespace('http://example.org/')
}

describe('StreamStore', () => {
  describe('.read', () => {
    it('should be a method', () => {
      const endpoint = new Endpoint({ fetch })
      const store = new StreamStore({ endpoint })

      strictEqual(typeof store.read, 'function')
    })

    it('should use the given method', async () => {
      await withServer(async server => {
        let called = false
        const graph = ns.ex.graph1

        server.app.get('/', async (req, res) => {
          called = true

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        const stream = await store.read({ method: 'GET', graph })
        await getStream.array(stream)

        strictEqual(called, true)
      })
    })

    it('should send the requested graph as a query parameter', async () => {
      await withServer(async server => {
        let graphParameter = null
        const graph = ns.ex.graph1

        server.app.get('/', async (req, res) => {
          graphParameter = req.query.graph

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        const stream = await store.read({ method: 'GET', graph })
        await getStream.array(stream)

        strictEqual(graphParameter, graph.value)
      })
    })

    it('should not send the graph query parameter if the default graph is requested', async () => {
      await withServer(async server => {
        let graphParameter = null
        const graph = rdf.defaultGraph()

        server.app.get('/', async (req, res) => {
          graphParameter = req.query.graph

          res.status(204).end()
        })

        const storeUrl = await server.listen()

        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        const stream = await store.read({ method: 'GET', graph })
        await getStream.array(stream)

        strictEqual(typeof graphParameter, 'undefined')
      })
    })

    it('should request content with media type application/n-triples from the server', async () => {
      await withServer(async server => {
        let mediaType = null
        const graph = ns.ex.graph1

        server.app.get('/', async (req, res) => {
          mediaType = req.get('accept')

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        const stream = await store.read({ method: 'GET', graph })
        await getStream.array(stream)

        strictEqual(mediaType, 'application/n-triples')
      })
    })

    it('should parse the N-Triples from the server and provide them as a quad stream', async () => {
      await withServer(async server => {
        const graph = ns.ex.graph1
        const expected = [
          rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, graph),
          rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2, graph),
          rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3, graph),
          rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4, graph)
        ]
        const content = expected.map(quad => {
          return quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n'
        }).join('')

        server.app.get('/', async (req, res) => {
          res.end(content)
        })

        const storeUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        const stream = await store.read({ method: 'GET', graph })
        const quads = await getStream.array(stream)

        strictEqual(toCanonical(quads), toCanonical(expected))
      })
    })

    it('should not send the graph query parameter if the default graph is requested', async () => {
      await withServer(async server => {
        let error = null
        const graph = ns.ex.graph1

        server.app.get('/', async (req, res) => {
          res.status(500).end()
        })

        const storeUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        try {
          await store.read({ method: 'GET', graph })
        } catch (err) {
          error = err
        }

        notStrictEqual(error, null)
      })
    })

    it('should use the given factory', async () => {
      await withServer(async server => {
        const graph = ns.ex.graph1
        const expected = [rdf.quad(rdf.blankNode(), ns.ex.predicate1, rdf.literal('test'), graph)]
        const content = expected.map(quad => {
          return quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n'
        }).join('')
        const factory = testFactory()

        server.app.get('/', async (req, res) => {
          res.end(content)
        })

        const storeUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ factory, endpoint })

        const stream = await store.read({ method: 'GET', graph })
        await getStream.array(stream)

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
        const graph = ns.ex.graph1

        server.app.get('/', async (req, res) => {
          authorization = req.headers.authorization

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, storeUrl, user: 'abc', password: 'def' })
        const store = new StreamStore({ endpoint })

        const stream = await store.read({ method: 'GET', graph })
        await getStream.array(stream)

        strictEqual(authorization, 'Basic YWJjOmRlZg==')
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        const message = 'test message'
        const graph = ns.ex.graph1

        server.app.get('/', async (req, res) => {
          res.status(500).end(message)
        })

        const storeUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await rejects(async () => {
          const stream = await store.read({ method: 'GET', graph })
          await getStream.array(stream)
        }, err => {
          strictEqual(err.message.includes('Internal Server Error'), true)
          strictEqual(err.message.includes('500'), true)
          strictEqual(err.message.includes(message), true)

          return true
        })
      })
    })
  })

  describe('.write', () => {
    it('should be a method', () => {
      const endpoint = new Endpoint({ fetch })
      const store = new StreamStore({ endpoint })

      strictEqual(typeof store.write, 'function')
    })

    it('should use the given method', async () => {
      await withServer(async server => {
        let called = false
        const quad = rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1)

        server.app.post('/', async (req, res) => {
          called = true

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object([quad])
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await store.write({ method: 'POST', stream })

        strictEqual(called, true)
      })
    })

    it('should send content with media type application/n-triples to the server', async () => {
      await withServer(async server => {
        let mediaType = null
        const quad = rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1)

        server.app.post('/', async (req, res) => {
          mediaType = req.get('content-type')

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object([quad])
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await store.write({ method: 'POST', stream })

        strictEqual(mediaType, 'application/n-triples')
      })
    })

    it('should send the quad stream as N-Triples to the server', async () => {
      await withServer(async server => {
        const content = {}
        const quads = [
          rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1),
          rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2, ns.ex.graph1),
          rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3, ns.ex.graph1),
          rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4, ns.ex.graph1)
        ]
        const expected = quads.map(quad => {
          return quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n'
        }).join('')

        server.app.post('/', async (req, res) => {
          content[req.query.graph] = await getStream(req)

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object(quads)
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await store.write({ method: 'POST', stream })

        strictEqual(content[quads[0].graph.value], expected)
      })
    })

    it('should support default graph', async () => {
      await withServer(async server => {
        let graph = true
        let content = {}
        const quads = [
          rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1),
          rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2),
          rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3),
          rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4)
        ]
        const expected = quads.map(quad => {
          return quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n'
        }).join('')

        server.app.post('/', async (req, res) => {
          graph = req.query.graph
          content = await getStream(req)

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object(quads)
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await store.write({ method: 'POST', stream })

        strictEqual(typeof graph, 'undefined')
        strictEqual(content, expected)
      })
    })

    it('should use multiple requests to send multiple graphs', async () => {
      await withServer(async server => {
        const content = {}
        const quads = [
          rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1),
          rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2, ns.ex.graph1),
          rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3),
          rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4),
          rdf.quad(ns.ex.subject5, ns.ex.predicate5, ns.ex.object5, ns.ex.graph2),
          rdf.quad(ns.ex.subject6, ns.ex.predicate6, ns.ex.object6, ns.ex.graph2)
        ]
        const expected = quads.reduce((expected, quad) => {
          const graphIri = quad.graph.value || ''

          expected[graphIri] = (expected[graphIri] || '') +
            quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n'

          return expected
        }, {})

        server.app.post('/', async (req, res) => {
          content[typeof req.query.graph === 'string' ? req.query.graph : ''] = await getStream(req)

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object(quads)
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await store.write({ method: 'POST', stream })

        Object.entries(expected).forEach(([graphIri, graphContent]) => {
          strictEqual(graphContent, content[graphIri])
        })
      })
    })

    it('should use multiple requests if maxQuadsPerRequest is reached', async () => {
      await withServer(async server => {
        const content = []
        const quads = [
          rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1),
          rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2),
          rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3),
          rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4)
        ]
        const expected = [
          quadToNTriples(quads[0]) + '\n' + quadToNTriples(quads[1]) + '\n',
          quadToNTriples(quads[2]) + '\n' + quadToNTriples(quads[3]) + '\n'
        ]

        server.app.post('/', async (req, res) => {
          content.push(await getStream(req))

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object(quads)
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint, maxQuadsPerRequest: 2 })

        await store.write({ method: 'POST', stream })

        deepStrictEqual(content, expected)
      })
    })

    it('should handle streams with no data', async () => {
      await withServer(async server => {
        const quads = []

        const storeUrl = await server.listen()
        const stream = intoStream.object(quads)
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await store.write({ method: 'POST', stream })
      })
    })

    it('should handle server socket errors', async () => {
      await withServer(async server => {
        const quad = rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1)

        server.app.post('/', async req => {
          req.client.destroy()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object([quad])
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await rejects(async () => {
          await store.write({ method: 'POST', stream })
        }, err => {
          strictEqual(err.message.includes('socket hang up'), true)

          return true
        })
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        const message = 'test message'

        const quad = rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1)

        server.app.post('/', async (req, res) => {
          res.status(500).end(message)
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object([quad])
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await rejects(async () => {
          await store.write({ method: 'POST', stream })
        }, err => {
          strictEqual(err.message.includes('Internal Server Error'), true)
          strictEqual(err.message.includes('500'), true)
          strictEqual(err.message.includes(message), true)

          return true
        })
      })
    })

    it('should handle server socket errors in separated requests', async () => {
      await withServer(async server => {
        const quad1 = rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1)
        const quad2 = rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph2)

        server.app.post('/', async (req, res) => {
          if (req.query.graph === quad2.graph.value) {
            return req.client.destroy()
          }

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object([quad1, quad2])
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await rejects(async () => {
          await store.write({ method: 'POST', stream })
        }, err => {
          strictEqual(err.message.includes('socket hang up'), true)

          return true
        })
      })
    })

    it('should handle server errors in separated requests', async () => {
      await withServer(async server => {
        const message = 'test message'

        const quad1 = rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1)
        const quad2 = rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph2)

        server.app.post('/', async (req, res) => {
          if (req.query.graph === quad2.graph.value) {
            return res.status(500).end(message)
          }

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object([quad1, quad2])
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await rejects(async () => {
          await store.write({ method: 'POST', stream })
        }, err => {
          strictEqual(err.message.includes('Internal Server Error'), true)
          strictEqual(err.message.includes('500'), true)
          strictEqual(err.message.includes(message), true)

          return true
        })
      })
    })

    it('should use the given user and password', async () => {
      await withServer(async server => {
        let authorization = null
        const quad = rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1)

        server.app.post('/', async (req, res) => {
          authorization = req.headers.authorization

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object([quad])
        const endpoint = new Endpoint({ fetch, storeUrl, user: 'abc', password: 'def' })
        const store = new StreamStore({ endpoint })

        await store.write({ method: 'POST', stream })

        strictEqual(authorization, 'Basic YWJjOmRlZg==')
      })
    })
  })

  describe('.get', () => {
    it('should be a method', () => {
      const endpoint = new Endpoint({ fetch })
      const store = new StreamStore({ endpoint })

      strictEqual(typeof store.get, 'function')
    })

    it('should send a GET request', async () => {
      await withServer(async server => {
        let called = false
        const graph = ns.ex.graph1

        server.app.get('/', async (req, res) => {
          called = true

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        const stream = await store.get(graph)
        await getStream.array(stream)

        strictEqual(called, true)
      })
    })

    it('should send the requested graph as a query parameter', async () => {
      await withServer(async server => {
        let graphParameter = null
        const graph = ns.ex.graph1

        server.app.get('/', async (req, res) => {
          graphParameter = req.query.graph

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        const stream = await store.get(graph)
        await getStream.array(stream)

        strictEqual(graphParameter, graph.value)
      })
    })

    it('should not send the graph query parameter if the default graph is requested', async () => {
      await withServer(async server => {
        let graphParameter = null
        const graph = rdf.defaultGraph()

        server.app.get('/', async (req, res) => {
          graphParameter = req.query.graph

          res.status(204).end()
        })

        const storeUrl = await server.listen()

        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        const stream = await store.get(graph)
        await getStream.array(stream)

        strictEqual(typeof graphParameter, 'undefined')
      })
    })

    it('should request content with media type application/n-triples from the server', async () => {
      await withServer(async server => {
        let mediaType = null
        const graph = ns.ex.graph1

        server.app.get('/', async (req, res) => {
          mediaType = req.get('accept')

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        const stream = await store.get(graph)
        await getStream.array(stream)

        strictEqual(mediaType, 'application/n-triples')
      })
    })

    it('should parse the N-Triples from the server and provide them as a quad stream', async () => {
      await withServer(async server => {
        const graph = ns.ex.graph1
        const expected = [
          rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, graph),
          rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2, graph),
          rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3, graph),
          rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4, graph)
        ]
        const content = expected.map(quad => {
          return quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n'
        }).join('')

        server.app.get('/', async (req, res) => {
          res.end(content)
        })

        const storeUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        const stream = await store.get(graph)
        const quads = await getStream.array(stream)

        strictEqual(toCanonical(quads), toCanonical(expected))
      })
    })

    it('should not send the graph query parameter if the default graph is requested', async () => {
      await withServer(async server => {
        let error = null
        const graph = ns.ex.graph1

        server.app.get('/', async (req, res) => {
          res.status(500).end()
        })

        const storeUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        try {
          await store.get(graph)
        } catch (err) {
          error = err
        }

        notStrictEqual(error, null)
      })
    })
  })

  describe('.post', () => {
    it('should be a method', () => {
      const endpoint = new Endpoint({ fetch })
      const store = new StreamStore({ endpoint })

      strictEqual(typeof store.post, 'function')
    })

    it('should send a POST request', async () => {
      await withServer(async server => {
        let called = false
        const quad = rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1)

        server.app.post('/', async (req, res) => {
          called = true

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object([quad])
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await store.post(stream)

        strictEqual(called, true)
      })
    })

    it('should send content with media type application/n-triples to the server', async () => {
      await withServer(async server => {
        let mediaType = null
        const quad = rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1)

        server.app.post('/', async (req, res) => {
          mediaType = req.get('content-type')

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object([quad])
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await store.post(stream)

        strictEqual(mediaType, 'application/n-triples')
      })
    })

    it('should send the quad stream as N-Triples to the server', async () => {
      await withServer(async server => {
        const content = {}
        const quads = [
          rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1),
          rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2, ns.ex.graph1),
          rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3, ns.ex.graph1),
          rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4, ns.ex.graph1)
        ]
        const expected = quads.map(quad => {
          return quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n'
        }).join('')

        server.app.post('/', async (req, res) => {
          content[req.query.graph] = await getStream(req)

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object(quads)
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await store.post(stream)

        strictEqual(content[quads[0].graph.value], expected)
      })
    })

    it('should support default graph', async () => {
      await withServer(async server => {
        let graph = true
        let content = {}
        const quads = [
          rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1),
          rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2),
          rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3),
          rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4)
        ]
        const expected = quads.map(quad => {
          return quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n'
        }).join('')

        server.app.post('/', async (req, res) => {
          graph = req.query.graph
          content = await getStream(req)

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object(quads)
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await store.post(stream)

        strictEqual(typeof graph, 'undefined')
        strictEqual(content, expected)
      })
    })

    it('should use multiple requests to send multiple graphs', async () => {
      await withServer(async server => {
        const content = {}
        const quads = [
          rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1),
          rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2, ns.ex.graph1),
          rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3),
          rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4),
          rdf.quad(ns.ex.subject5, ns.ex.predicate5, ns.ex.object5, ns.ex.graph2),
          rdf.quad(ns.ex.subject6, ns.ex.predicate6, ns.ex.object6, ns.ex.graph2)
        ]
        const expected = quads.reduce((expected, quad) => {
          const graphIri = quad.graph.value || ''

          expected[graphIri] = (expected[graphIri] || '') +
            quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n'

          return expected
        }, {})

        server.app.post('/', async (req, res) => {
          content[typeof req.query.graph === 'string' ? req.query.graph : ''] = await getStream(req)

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object(quads)
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await store.post(stream)

        Object.entries(expected).forEach(([graphIri, graphContent]) => {
          strictEqual(graphContent, content[graphIri])
        })
      })
    })

    it('should use multiple requests if maxQuadsPerRequest is reached', async () => {
      await withServer(async server => {
        const content = []
        const quads = [
          rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1),
          rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2),
          rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3),
          rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4)
        ]
        const expected = [
          quadToNTriples(quads[0]) + '\n' + quadToNTriples(quads[1]) + '\n',
          quadToNTriples(quads[2]) + '\n' + quadToNTriples(quads[3]) + '\n'
        ]

        server.app.post('/', async (req, res) => {
          content.push(await getStream(req))

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object(quads)
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint, maxQuadsPerRequest: 2 })

        await store.post(stream)

        deepStrictEqual(content, expected)
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        const quad = rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1)

        server.app.post('/', async (req, res) => {
          res.status(500).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object([quad])
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        let error = null

        try {
          await store.post(stream)
        } catch (err) {
          error = err
        }

        notStrictEqual(error, null)
      })
    })
  })

  describe('.put', () => {
    it('should be a method', () => {
      const endpoint = new Endpoint({ fetch })
      const store = new StreamStore({ endpoint })

      strictEqual(typeof store.put, 'function')
    })

    it('should send a PUT request', async () => {
      await withServer(async server => {
        let called = false
        const quad = rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1)

        server.app.put('/', async (req, res) => {
          called = true

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object([quad])
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await store.put(stream)

        strictEqual(called, true)
      })
    })

    it('should send content with media type application/n-triples to the server', async () => {
      await withServer(async server => {
        let mediaType = null
        const quad = rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1)

        server.app.put('/', async (req, res) => {
          mediaType = req.get('content-type')

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object([quad])
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await store.put(stream)

        strictEqual(mediaType, 'application/n-triples')
      })
    })

    it('should send the quad stream as N-Triples to the server', async () => {
      await withServer(async server => {
        const content = {}
        const quads = [
          rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1),
          rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2, ns.ex.graph1),
          rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3, ns.ex.graph1),
          rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4, ns.ex.graph1)
        ]
        const expected = quads.map(quad => {
          return quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n'
        }).join('')

        server.app.put('/', async (req, res) => {
          content[req.query.graph] = await getStream(req)

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object(quads)
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await store.put(stream)

        strictEqual(content[quads[0].graph.value], expected)
      })
    })

    it('should support default graph', async () => {
      await withServer(async server => {
        let graph = true
        let content = {}
        const quads = [
          rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1),
          rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2),
          rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3),
          rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4)
        ]
        const expected = quads.map(quad => {
          return quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n'
        }).join('')

        server.app.put('/', async (req, res) => {
          graph = req.query.graph
          content = await getStream(req)

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object(quads)
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await store.put(stream)

        strictEqual(typeof graph, 'undefined')
        strictEqual(content, expected)
      })
    })

    it('should use multiple requests to send multiple graphs', async () => {
      await withServer(async server => {
        const content = {}
        const quads = [
          rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1),
          rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2, ns.ex.graph1),
          rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3),
          rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4),
          rdf.quad(ns.ex.subject5, ns.ex.predicate5, ns.ex.object5, ns.ex.graph2),
          rdf.quad(ns.ex.subject6, ns.ex.predicate6, ns.ex.object6, ns.ex.graph2)
        ]
        const expected = quads.reduce((expected, quad) => {
          const graphIri = quad.graph.value || ''

          expected[graphIri] = (expected[graphIri] || '') +
            quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n'

          return expected
        }, {})

        server.app.put('/', async (req, res) => {
          content[typeof req.query.graph === 'string' ? req.query.graph : ''] = await getStream(req)

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object(quads)
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        await store.put(stream)

        Object.entries(expected).forEach(([graphIri, graphContent]) => {
          strictEqual(graphContent, content[graphIri])
        })
      })
    })

    it('should use PUT and POST methods to combine multiple requests split by maxQuadsPerRequest', async () => {
      await withServer(async server => {
        const contentPut = []
        const contentPost = []
        const quads = [
          rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1),
          rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2),
          rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3),
          rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4)
        ]
        const expectedPut = [quadToNTriples(quads[0]) + '\n' + quadToNTriples(quads[1]) + '\n']
        const expectedPost = [quadToNTriples(quads[2]) + '\n' + quadToNTriples(quads[3]) + '\n']

        server.app.post('/', async (req, res) => {
          contentPost.push(await getStream(req))

          res.status(204).end()
        })

        server.app.put('/', async (req, res) => {
          contentPut.push(await getStream(req))

          res.status(204).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object(quads)
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint, maxQuadsPerRequest: 2 })

        await store.put(stream)

        deepStrictEqual(contentPut, expectedPut)
        deepStrictEqual(contentPost, expectedPost)
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        const quad = rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1)

        server.app.put('/', async (req, res) => {
          res.status(500).end()
        })

        const storeUrl = await server.listen()
        const stream = intoStream.object([quad])
        const endpoint = new Endpoint({ fetch, storeUrl })
        const store = new StreamStore({ endpoint })

        let error = null

        try {
          await store.put(stream)
        } catch (err) {
          error = err
        }

        notStrictEqual(error, null)
      })
    })
  })
})
