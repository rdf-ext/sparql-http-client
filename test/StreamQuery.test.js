const { deepStrictEqual, rejects, strictEqual } = require('assert')
const { text, urlencoded } = require('body-parser')
const getStream = require('get-stream')
const { describe, it } = require('mocha')
const fetch = require('nodeify-fetch')
const { toCanonical } = require('rdf-dataset-ext')
const rdf = { ...require('@rdfjs/data-model'), ...require('@rdfjs/dataset') }
const namespace = require('@rdfjs/namespace')
const { quadToNTriples } = require('@rdfjs/to-ntriples')
const testFactory = require('./support/testFactory')
const withServer = require('./support/withServer')
const Endpoint = require('../Endpoint')
const StreamQuery = require('../StreamQuery')

const ns = {
  ex: namespace('http://example.org/')
}

const simpleAskQuery = 'ASK {}'
const simpleConstructQuery = 'CONSTRUCT {?s ?p ?o} WHERE {?s ?p ?o}'
const simpleSelectQuery = 'SELECT * WHERE {?s ?p ?o}'
const simpleUpdateQuery = 'INSERT {<http://example.org/subject> <http://example.org/predicate> "object"} WHERE {}'

describe('StreamQuery', () => {
  describe('.ask', () => {
    it('should be a method', () => {
      const endpoint = new Endpoint({ fetch })
      const query = new StreamQuery({ endpoint })

      strictEqual(typeof query.ask, 'function')
    })

    it('should send a GET request to the endpointUrl', async () => {
      await withServer(async server => {
        let called = false

        server.app.get('/', async (req, res) => {
          called = true

          res.end('{}')
        })

        const endpointUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, endpointUrl })
        const query = new StreamQuery({ endpoint })

        await query.ask(simpleAskQuery)

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
        const endpoint = new Endpoint({ fetch, endpointUrl })
        const query = new StreamQuery({ endpoint })

        await query.ask(simpleAskQuery)

        strictEqual(parameter, simpleAskQuery)
      })
    })

    it('should parse parse the result and return the boolean value', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.json({
            boolean: true
          })
        })

        const endpointUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, endpointUrl })
        const query = new StreamQuery({ endpoint })

        const result = await query.ask(simpleConstructQuery)

        strictEqual(result, true)
      })
    })

    it('should use the given operation for the request', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.post('/', urlencoded({ extended: false }), async (req, res) => {
          parameter = req.body.query

          res.json({
            boolean: true
          })
        })

        const endpointUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, endpointUrl })
        const query = new StreamQuery({ endpoint })

        await query.ask(simpleAskQuery, { operation: 'postUrlencoded' })

        strictEqual(parameter, simpleAskQuery)
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        const message = 'test message'

        server.app.get('/', async (req, res) => {
          res.status(500).end(message)
        })

        const endpointUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, endpointUrl })
        const query = new StreamQuery({ endpoint })

        await rejects(async () => {
          await query.ask(simpleAskQuery)
        }, err => {
          strictEqual(err.message.includes('Internal Server Error'), true)
          strictEqual(err.message.includes('500'), true)
          strictEqual(err.message.includes(message), true)

          return true
        })
      })
    })
  })

  describe('.construct', () => {
    it('should be a method', () => {
      const endpoint = new Endpoint({ fetch })
      const query = new StreamQuery({ endpoint })

      strictEqual(typeof query.construct, 'function')
    })

    it('should send a GET request to the endpointUrl', async () => {
      await withServer(async server => {
        let called = false

        server.app.get('/', async (req, res) => {
          called = true

          res.status(204).end()
        })

        const endpointUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, endpointUrl })
        const query = new StreamQuery({ endpoint })

        const stream = await query.construct(simpleConstructQuery)
        await getStream.array(stream)

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
        const endpoint = new Endpoint({ fetch, endpointUrl })
        const query = new StreamQuery({ endpoint })

        const stream = await query.construct(simpleConstructQuery)
        await getStream.array(stream)

        strictEqual(parameter, simpleConstructQuery)
      })
    })

    it('should parse the N-Triples from the server and provide them as a quad stream', async () => {
      await withServer(async server => {
        const quads = rdf.dataset([
          rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1),
          rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2),
          rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3),
          rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4)
        ])
        const content = [...quads].map(quad => {
          return quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n'
        }).join('')

        server.app.get('/', async (req, res) => {
          res.end(content)
        })

        const endpointUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, endpointUrl })
        const query = new StreamQuery({ endpoint })

        const stream = await query.construct(simpleConstructQuery)
        const result = rdf.dataset(await getStream.array(stream))

        strictEqual(toCanonical(result), toCanonical(quads))
      })
    })

    it('should use the given factory', async () => {
      await withServer(async server => {
        const quads = rdf.dataset([rdf.quad(rdf.blankNode(), ns.ex.predicate, rdf.literal('test'))])
        const content = [...quads].map(quad => {
          return quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n'
        }).join('')
        const factory = testFactory()

        server.app.get('/', async (req, res) => {
          res.end(content)
        })

        const endpointUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, endpointUrl })
        const query = new StreamQuery({ endpoint, factory })

        const stream = await query.construct(simpleConstructQuery)
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

    it('should use the given operation for the request', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.post('/', urlencoded({ extended: false }), async (req, res) => {
          parameter = req.body.query

          res.status(204).end()
        })

        const endpointUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, endpointUrl })
        const query = new StreamQuery({ endpoint })

        const stream = await query.construct(simpleConstructQuery, { operation: 'postUrlencoded' })
        await getStream.array(stream)

        strictEqual(parameter, simpleConstructQuery)
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

        const endpoint = new Endpoint({ endpointUrl, fetch })
        const query = new StreamQuery({ endpoint })

        await query.construct(simpleConstructQuery)

        strictEqual(accept, 'application/n-triples, text/turtle')
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        const message = 'test message'

        server.app.get('/', async (req, res) => {
          res.status(500).end(message)
        })

        const endpointUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, endpointUrl })
        const query = new StreamQuery({ endpoint })

        await rejects(async () => {
          await query.construct(simpleConstructQuery)
        }, err => {
          strictEqual(err.message.includes('Internal Server Error'), true)
          strictEqual(err.message.includes('500'), true)
          strictEqual(err.message.includes(message), true)

          return true
        })
      })
    })
  })

  describe('.select', () => {
    it('should be a method', () => {
      const endpoint = new Endpoint({ fetch })
      const query = new StreamQuery({ endpoint })

      strictEqual(typeof query.select, 'function')
    })

    it('should send a GET request to the endpointUrl', async () => {
      await withServer(async server => {
        let called = false

        server.app.get('/', async (req, res) => {
          called = true

          res.status(204).end()
        })

        const endpointUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, endpointUrl })
        const query = new StreamQuery({ endpoint })

        const stream = await query.select(simpleSelectQuery)
        await getStream.array(stream)

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
        const endpoint = new Endpoint({ fetch, endpointUrl })
        const query = new StreamQuery({ endpoint })

        const stream = await query.construct(simpleSelectQuery)
        await getStream.array(stream)

        strictEqual(parameter, simpleSelectQuery)
      })
    })

    it('should parse the SPARQL JSON result from the server and provide it as stream of RDF/JS key value pair objects', async () => {
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
        const endpoint = new Endpoint({ fetch, endpointUrl })
        const query = new StreamQuery({ endpoint })

        const stream = await query.select(simpleSelectQuery)
        const result = await getStream.array(stream)

        strictEqual(result[0].a.termType, 'NamedNode')
        strictEqual(result[0].a.value, content.results.bindings[0].a.value)
        strictEqual(result[1].a.termType, 'NamedNode')
        strictEqual(result[1].a.value, content.results.bindings[1].a.value)
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
        const endpoint = new Endpoint({ fetch, endpointUrl })
        const query = new StreamQuery({ factory, endpoint })

        const stream = await query.select(simpleSelectQuery)
        await getStream.array(stream)

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

        server.app.post('/', urlencoded({ extended: false }), async (req, res) => {
          parameter = req.body.query

          res.status(204).end()
        })

        const endpointUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, endpointUrl })
        const query = new StreamQuery({ endpoint })

        const stream = await query.select(simpleSelectQuery, { operation: 'postUrlencoded' })
        await getStream.array(stream)

        strictEqual(parameter, simpleSelectQuery)
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        const message = 'test message'

        server.app.get('/', async (req, res) => {
          res.status(500).end(message)
        })

        const endpointUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, endpointUrl })
        const query = new StreamQuery({ endpoint })

        await rejects(async () => {
          await query.select(simpleSelectQuery)
        }, err => {
          strictEqual(err.message.includes('Internal Server Error'), true)
          strictEqual(err.message.includes('500'), true)
          strictEqual(err.message.includes(message), true)

          return true
        })
      })
    })
  })

  describe('.update', () => {
    it('should be a method', () => {
      const endpoint = new Endpoint({ fetch })
      const query = new StreamQuery({ endpoint })

      strictEqual(typeof query.update, 'function')
    })

    it('should send a POST request to the updateUrl', async () => {
      await withServer(async server => {
        let called = false

        server.app.post('/', async (req, res) => {
          called = true

          res.status(204).end()
        })

        const updateUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, updateUrl })
        const query = new StreamQuery({ endpoint })

        await query.update(simpleUpdateQuery)

        strictEqual(called, true)
      })
    })

    it('should send the query string urlencoded in the request body', async () => {
      await withServer(async server => {
        let parameter = null

        server.app.post('/', urlencoded({ extended: false }), async (req, res) => {
          parameter = req.body.update

          res.status(204).end()
        })

        const updateUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, updateUrl })
        const query = new StreamQuery({ endpoint })

        await query.update(simpleUpdateQuery)

        strictEqual(parameter, simpleUpdateQuery)
      })
    })

    it('should use the given operation for the request', async () => {
      await withServer(async server => {
        let content = null

        server.app.post('/', text({ type: '*/*' }), async (req, res) => {
          content = req.body

          res.status(204).end()
        })

        const updateUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, updateUrl })
        const query = new StreamQuery({ endpoint })

        await query.update(simpleUpdateQuery, { operation: 'postDirect' })

        strictEqual(content, simpleUpdateQuery)
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        const message = 'test message'

        server.app.post('/', async (req, res) => {
          res.status(500).end(message)
        })

        const updateUrl = await server.listen()
        const endpoint = new Endpoint({ fetch, updateUrl })
        const query = new StreamQuery({ endpoint })

        await rejects(async () => {
          await query.update(simpleUpdateQuery)
        }, err => {
          strictEqual(err.message.includes('Internal Server Error'), true)
          strictEqual(err.message.includes('500'), true)
          strictEqual(err.message.includes(message), true)

          return true
        })
      })
    })
  })
})
