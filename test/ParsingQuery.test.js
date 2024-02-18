import { deepStrictEqual, rejects, strictEqual } from 'node:assert'
import DataModelFactory from '@rdfjs/data-model/Factory.js'
import DatasetFactory from '@rdfjs/dataset/Factory.js'
import Environment from '@rdfjs/environment'
import express from 'express'
import withServer from 'express-as-promise/withServer.js'
import { describe, it } from 'mocha'
import rdf from 'rdf-ext'
import { datasetEqual } from 'rdf-test/assert.js'
import isDataset from 'rdf-test/isDataset.js'
import ParsingQuery from '../ParsingQuery.js'
import SimpleClient from '../SimpleClient.js'
import { message, quads, constructQuery, selectQuery } from './support/examples.js'
import isServerError from './support/isServerError.js'
import isSocketError from './support/isSocketError.js'
import * as ns from './support/namespaces.js'
import testFactory from './support/testFactory.js'

const factory = new Environment([DataModelFactory, DatasetFactory])

describe('ParsingQuery', () => {
  describe('.construct', () => {
    it('should be a method', () => {
      const query = new ParsingQuery({})

      strictEqual(typeof query.construct, 'function')
    })

    it('should return a DatasetCore object', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.status(204).end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl, factory })
        const query = new ParsingQuery({ client })

        const result = await query.construct(constructQuery)

        strictEqual(isDataset(result), true)
      })
    })

    it('should parse the N-Triples', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.end(quads.toString())
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl, factory })
        const query = new ParsingQuery({ client })

        const result = await query.construct(constructQuery)

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
        const client = new SimpleClient({ endpointUrl, factory })
        const query = new ParsingQuery({ client })

        await query.construct(constructQuery)

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
        const client = new SimpleClient({ endpointUrl, factory })
        const query = new ParsingQuery({ client })

        await query.construct(constructQuery)

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
        const query = new ParsingQuery({ client })

        await query.construct(constructQuery)

        deepStrictEqual(factory.used, {
          blankNode: true,
          dataset: true,
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
        const client = new SimpleClient({ endpointUrl, factory })
        const query = new ParsingQuery({ client })

        await query.construct(constructQuery, { operation: 'postUrlencoded' })

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
        const client = new SimpleClient({ endpointUrl, factory })
        const query = new ParsingQuery({ client })

        await query.construct(constructQuery)

        strictEqual(accept, 'application/n-triples, text/turtle')
      })
    })

    it('should handle server socket errors', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          req.client.destroy()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl, factory })
        const query = new ParsingQuery({ client })

        await rejects(async () => {
          await query.construct(constructQuery)
        }, err => isSocketError(err))
      })
    })

    it('should handle server errors', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.status(500).end(message)
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl, factory })
        const query = new ParsingQuery({ client })

        await rejects(async () => {
          await query.construct(constructQuery)
        }, err => isServerError(err, message))
      })
    })
  })

  describe('.select', () => {
    it('should be a method', () => {
      const query = new ParsingQuery({})

      strictEqual(typeof query.select, 'function')
    })

    it('should return an array', async () => {
      await withServer(async server => {
        server.app.get('/', async (req, res) => {
          res.status(204).end()
        })

        const endpointUrl = await server.listen()
        const client = new SimpleClient({ endpointUrl })
        const query = new ParsingQuery({ client })

        const result = await query.select(selectQuery)

        strictEqual(Array.isArray(result), true)
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
        const query = new ParsingQuery({ client })

        const result = await query.select(selectQuery)

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
        const query = new ParsingQuery({ client })

        await query.select(selectQuery)

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
        const query = new ParsingQuery({ client })

        await query.select(selectQuery)

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
        const query = new ParsingQuery({ client })

        await query.select(selectQuery)

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
        const query = new ParsingQuery({ client })

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
        const query = new ParsingQuery({ client })

        await rejects(async () => {
          await query.select(selectQuery)
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
        const query = new ParsingQuery({ client })

        await rejects(async () => {
          await query.select(selectQuery)
        }, err => isServerError(err, message))
      })
    })
  })
})
