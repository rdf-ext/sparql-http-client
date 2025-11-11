import { deepStrictEqual, rejects, strictEqual } from 'node:assert'
import { isReadableStream, isWritableStream } from 'is-stream'
import { it } from 'mocha'
import rdf from 'rdf-ext'
import { datasetEqual } from 'rdf-test/assert.js'
import { Readable } from 'readable-stream'
import chunks from 'stream-chunks/chunks.js'
import RawQuery from '../../RawQuery.js'
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

  const query = new StreamQuery({ client })
  const mockQuery = Object.create(RawQuery.prototype)

  for (const [key, value] of Object.entries(options)) {
    mockQuery[key] = value
  }

  Object.setPrototypeOf(Object.getPrototypeOf(query), mockQuery)

  return query
}

function createResponse ({ method, ...options } = {}) {
  const res = new Response()

  for (const [key, value] of Object.entries(options)) {
    Object.defineProperty(res, key, {
      value,
      writable: true,
      configurable: true
    })
  }

  return res
}

function shouldCheckResponseStatus (func) {
  it('should check the response status', async () => {
    const query = createQuery({
      ask: async () => createResponse({
        ok: false,
        text: async () => 'test'
      })
    })

    await rejects(async () => {
      await func(query)
    }, /test/)
  })
}

function shouldCheckStreamResponseStatus (func, { method } = {}) {
  it('should check the response status', async () => {
    const query = createQuery({
      [method]: async () => createResponse({
        ok: false,
        text: async () => 'test'
      })
    })

    await rejects(async () => {
      await chunks(await func(query))
    }, /test/)
  })
}

function shouldForwardHeaders (func, { method } = {}) {
  it('should forward the headers', async () => {
    const expected = { authorization: 'Bearer foo' }

    let actual

    const query = createQuery({
      [method]: async (queryString, { headers }) => {
        actual = headers

        return createResponse({
          body: Readable.from(['']),
          json: () => ({ boolean: true })
        })
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

        return createResponse({
          body: Readable.from(['']),
          json: () => ({ boolean: true })
        })
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

        return createResponse({
          body: Readable.from(['']),
          json: () => ({ boolean: true })
        })
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

        return createResponse({
          body: Readable.from(['']),
          json: () => ({ boolean: true })
        })
      }
    })

    await func(query, expected)

    strictEqual(actual, expected)
  })
}

function shouldParseBooleanSparqlJson (func) {
  it('should parse the boolean SPARQL JSON result', async () => {
    const query = createQuery({
      ask: async () => createResponse({
        json: () => ({ boolean: true })
      })
    })

    const result = await func(query)

    strictEqual(result, true)
  })
}

function shouldParseNTriples (func) {
  it('should parse the N-Triples result', async () => {
    const query = createQuery({
      construct: async () => createResponse({
        body: Readable.from([quads.toString()])
      })
    })

    const stream = await func(query)
    const result = await chunks(stream)

    datasetEqual(result, quads)
  })
}

function shouldParseTableSparqlJson (func) {
  it('should parse the table SPARQL JSON result', async () => {
    const content = {
      results: {
        bindings: [{
          a: { type: 'uri', value: 'http://example.org/0' }
        }, {
          a: { type: 'uri', value: 'http://example.org/1' }
        }]
      }
    }
    const query = createQuery({
      select: async () => createResponse({
        body: Readable.from([JSON.stringify(content)])
      })
    })

    const stream = await func(query)
    const result = await chunks(stream)

    strictEqual(result[0].a.termType, 'NamedNode')
    strictEqual(result[0].a.value, content.results.bindings[0].a.value)
    strictEqual(result[1].a.termType, 'NamedNode')
    strictEqual(result[1].a.value, content.results.bindings[1].a.value)
  })
}

function shouldReturnBoolean (func) {
  it('should return a boolean value', async () => {
    const query = createQuery({
      ask: async () => createResponse({
        json: () => ({ boolean: true })
      })
    })

    const result = await func(query)

    strictEqual(typeof result, 'boolean')
  })
}

function shouldReturnReadableStream (func, { method } = {}) {
  it('should return a Readable stream object', async () => {
    const query = createQuery({
      [method]: async () => createResponse({
        body: Readable.from([''])
      })
    })

    const result = await func(query)

    strictEqual(isReadableStream(result), true)
    strictEqual(isWritableStream(result), false)

    await chunks(result)
  })
}

function shouldUseCustomConstructFactory (func) {
  it('should use the custom factory', async () => {
    const factory = testFactory()
    const quads = rdf.dataset([
      rdf.quad(rdf.blankNode(), ns.ex.predicate, rdf.literal('test'))
    ])
    const query = createQuery({
      construct: async () => createResponse({
        body: Readable.from([quads.toString()])
      }),
      factory
    })

    const stream = await func(query)
    await chunks(stream)

    deepStrictEqual(factory.used, {
      blankNode: true,
      defaultGraph: true,
      literal: true,
      namedNode: true,
      quad: true
    })
  })
}

function shouldUseCustomSelectFactory (func) {
  it('should use the custom factory', async () => {
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
    const query = createQuery({
      select: async () => createResponse({
        body: Readable.from([JSON.stringify(content)])
      }),
      factory
    })

    const stream = await func(query)
    await chunks(stream)

    deepStrictEqual(factory.used, {
      blankNode: true,
      literal: true,
      namedNode: true
    })
  })
}

export {
  shouldCheckResponseStatus,
  shouldCheckStreamResponseStatus,
  shouldForwardHeaders,
  shouldForwardOperation,
  shouldForwardParameters,
  shouldForwardQueryString,
  shouldParseBooleanSparqlJson,
  shouldParseNTriples,
  shouldParseTableSparqlJson,
  shouldReturnBoolean,
  shouldReturnReadableStream,
  shouldUseCustomConstructFactory,
  shouldUseCustomSelectFactory
}
