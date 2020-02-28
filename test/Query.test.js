const { deepStrictEqual, strictEqual } = require('assert')
const { urlencoded } = require('body-parser')
const getStream = require('get-stream')
const { describe, it } = require('mocha')
const fetch = require('nodeify-fetch')
const { toCanonical } = require('rdf-dataset-ext')
const rdf = { ...require('@rdfjs/data-model'), ...require('@rdfjs/dataset') }
const namespace = require('@rdfjs/namespace')
const { quadToNTriples } = require('@rdfjs/to-ntriples')
const testFactory = require('./support/testFactory')
const withServer = require('./support/withServer')
const BaseClient = require('../BaseClient')
const Query = require('../Query')

const ns = {
  ex: namespace('http://example.org/')
}

const simpleAskQuery = 'ASK {}'
const simpleConstructQuery = 'CONSTRUCT {?s ?p ?o} WHERE {?s ?p ?o}'
const simpleSelectQuery = 'SELECT * WHERE {?s ?p ?o}'
const simpleUpdateQuery = 'INSERT {<http://example.org/subject> <http://example.org/predicate> "object"} WHERE {}'

describe('Query', () => {
  describe('.ask', () => {
    it('should be a method', () => {
      const client = new BaseClient({ fetch })
      const query = new Query({ client })

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
        const client = new BaseClient({ fetch, endpointUrl })
        const query = new Query({ client })

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
        const client = new BaseClient({ fetch, endpointUrl })
        const query = new Query({ client })

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
        const client = new BaseClient({ fetch, endpointUrl })
        const query = new Query({ client })

        const result = await query.ask(simpleConstructQuery)

        strictEqual(result, true)
      })
    })
  })

  describe('.construct', () => {
    it('should be a method', () => {
      const client = new BaseClient({ fetch })
      const query = new Query({ client })

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
        const client = new BaseClient({ fetch, endpointUrl })
        const query = new Query({ client })

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
        const client = new BaseClient({ fetch, endpointUrl })
        const query = new Query({ client })

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
        const client = new BaseClient({ fetch, endpointUrl })
        const query = new Query({ client })

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
        const client = new BaseClient({ factory, fetch, endpointUrl })
        const query = new Query({ client })

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
  })

  describe('.select', () => {
    it('should be a method', () => {
      const client = new BaseClient({ fetch })
      const query = new Query({ client })

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
        const client = new BaseClient({ fetch, endpointUrl })
        const query = new Query({ client })

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
        const client = new BaseClient({ fetch, endpointUrl })
        const query = new Query({ client })

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
        const client = new BaseClient({ fetch, endpointUrl })
        const query = new Query({ client })

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
        const client = new BaseClient({ factory, fetch, endpointUrl })
        const query = new Query({ client })

        const stream = await query.select(simpleSelectQuery)
        await getStream.array(stream)

        deepStrictEqual(factory.used, {
          blankNode: true,
          literal: true,
          namedNode: true
        })
      })
    })
  })

  describe('.update', () => {
    it('should be a method', () => {
      const client = new BaseClient({ fetch })
      const query = new Query({ client })

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
        const client = new BaseClient({ fetch, updateUrl })
        const query = new Query({ client })

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
        const client = new BaseClient({ fetch, updateUrl })
        const query = new Query({ client })

        await query.update(simpleUpdateQuery)

        strictEqual(parameter, simpleUpdateQuery)
      })
    })
  })
})
