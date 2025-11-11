import { deepStrictEqual, strictEqual } from 'node:assert'
import { it } from 'mocha'
import rdf from 'rdf-ext'
import { datasetEqual } from 'rdf-test/assert.js'
import isDataset from 'rdf-test/isDataset.js'
import { Readable } from 'readable-stream'
import ParsingQuery from '../../ParsingQuery.js'
import SimpleClient from '../../SimpleClient.js'
import StreamQuery from '../../StreamQuery.js'
import { quads } from './examples.js'
import * as ns from './namespaces.js'
import testFactory from './testFactory.js'

function createQuery ({ factory = rdf, ...options } = {}) {
  const client = new SimpleClient({
    endpointUrl: 'http://localhost/',
    factory,
    updateUrl: 'http://localhost/'
  })

  const query = new ParsingQuery({ client })
  const mockQuery = Object.create(StreamQuery.prototype)

  for (const [key, value] of Object.entries(options)) {
    mockQuery[key] = value
  }

  Object.setPrototypeOf(Object.getPrototypeOf(query), mockQuery)

  return query
}

function shouldForwardHeaders (func, { method } = {}) {
  it('should forward the headers', async () => {
    const expected = { authorization: 'Bearer foo' }

    let actual

    const query = createQuery({
      [method]: async (queryString, { headers }) => {
        actual = headers

        return Readable.from([])
      }
    })

    await func(query, expected)

    deepStrictEqual(actual, expected)
  })
}

function shouldForwardOperation (func, { method } = {}) {
  it('should forward the operation', async () => {
    const expected = 'postDirect'

    let actual

    const query = createQuery({
      [method]: async (queryString, { operation }) => {
        actual = operation

        return Readable.from([])
      }
    })

    await func(query, expected)

    strictEqual(actual, expected)
  })
}

function shouldForwardParameters (func, { method } = {}) {
  it('should forward the parameters', async () => {
    const expected = { auth_token: '12345' }

    let actual

    const query = createQuery({
      [method]: async (queryString, { parameters }) => {
        actual = parameters

        return Readable.from([])
      }
    })

    await func(query, expected)

    deepStrictEqual(actual, expected)
  })
}

function shouldForwardQueryString (func, { method } = {}) {
  it('should forward the query string', async () => {
    const expected = '12345'

    let actual

    const query = createQuery({
      [method]: async queryString => {
        actual = queryString

        return Readable.from([])
      }
    })

    await func(query, expected)

    strictEqual(actual, expected)
  })
}

function shouldParseNTriples (func) {
  it('should parse the N-Triples result', async () => {
    const query = createQuery({
      construct: async () => Readable.from(quads)
    })

    const result = await func(query)

    datasetEqual(result, quads)
  })
}

function shouldParseTableSparqlJson (func) {
  it('should parse the table SPARQL JSON result', async () => {
    const bindings = [{
      a: rdf.namedNode('http://example.org/0')
    }, {
      a: rdf.namedNode('http://example.org/1')
    }]
    const query = createQuery({
      select: async () => Readable.from(bindings)
    })

    const result = await func(query)

    strictEqual(result[0], bindings[0])
    strictEqual(result[1], bindings[1])
  })
}

function shouldReturnArray (func) {
  it('should return an Array', async () => {
    const query = createQuery({
      select: async () => Readable.from([])
    })

    const result = await func(query)

    strictEqual(Array.isArray(result), true)
  })
}

function shouldReturnDatasetCore (func) {
  it('should return a DatasetCore object', async () => {
    const query = createQuery({
      construct: async () => Readable.from([])
    })

    const result = await func(query)

    strictEqual(isDataset(result), true)
  })
}

function shouldUseCustomConstructFactory (func) {
  it('should use the custom factory', async () => {
    const quads = rdf.dataset([
      rdf.quad(rdf.blankNode(), ns.ex.predicate, rdf.literal('test'))
    ])
    const factory = testFactory()
    const query = createQuery({
      construct: async () => Readable.from(quads),
      factory
    })

    await func(query)

    deepStrictEqual(factory.used, {
      dataset: true
    })
  })
}

export {
  shouldForwardHeaders,
  shouldForwardOperation,
  shouldForwardParameters,
  shouldForwardQueryString,
  shouldParseNTriples,
  shouldParseTableSparqlJson,
  shouldReturnArray,
  shouldReturnDatasetCore,
  shouldUseCustomConstructFactory
}
