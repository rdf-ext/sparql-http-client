import { deepStrictEqual, rejects, strictEqual } from 'node:assert'
import factory from '@rdfjs/data-model'
import { describe, it } from 'mocha'
import chunks from 'stream-chunks/chunks.js'
import ResultParser from '../ResultParser.js'
import testFactory from './support/testFactory.js'

describe('ResultParser', () => {
  it('should be a constructor', () => {
    strictEqual(typeof ResultParser, 'function')
  })

  it('should throw an error if the content is not JSON', async () => {
    const parser = new ResultParser({ factory })

    parser.end('this is not json')

    await rejects(async () => {
      await chunks(parser)
    }, {
      message: /Unexpected/
    })
  })

  it('should not emit any chunk if the json doesn\'t contain results.bindings', async () => {
    const parser = new ResultParser({ factory })

    parser.end('{}')

    const result = await chunks(parser)

    deepStrictEqual(result, [])
  })

  it('should not emit any chunk when Stardog GROUP BY bug shows up', async () => {
    const parser = new ResultParser({ factory })
    const content = {
      results: {
        bindings: [{}]
      }
    }

    parser.end(JSON.stringify(content))

    const result = await chunks(parser)

    deepStrictEqual(result, [])
  })

  it('should parse named node values', async () => {
    const parser = new ResultParser({ factory })
    const content = {
      results: {
        bindings: [{
          a: { type: 'uri', value: 'http://example.org/0' }
        }, {
          a: { type: 'uri', value: 'http://example.org/1' }
        }]
      }
    }

    parser.end(JSON.stringify(content))

    const result = await chunks(parser)

    strictEqual(result[0].a.termType, 'NamedNode')
    strictEqual(result[0].a.value, content.results.bindings[0].a.value)
    strictEqual(result[1].a.termType, 'NamedNode')
    strictEqual(result[1].a.value, content.results.bindings[1].a.value)
  })

  it('should parse blank node values', async () => {
    const parser = new ResultParser({ factory })
    const content = {
      results: {
        bindings: [{
          a: { type: 'bnode', value: 'b0' }
        }, {
          a: { type: 'bnode', value: 'b1' }
        }]
      }
    }

    parser.end(JSON.stringify(content))

    const result = await chunks(parser)

    strictEqual(result[0].a.termType, 'BlankNode')
    strictEqual(result[0].a.value, content.results.bindings[0].a.value)
    strictEqual(result[1].a.termType, 'BlankNode')
    strictEqual(result[1].a.value, content.results.bindings[1].a.value)
  })

  it('should parse literal values', async () => {
    const parser = new ResultParser({ factory })
    const content = {
      results: {
        bindings: [{
          a: { type: 'literal', value: '0' }
        }, {
          a: { type: 'literal', value: '1' }
        }]
      }
    }

    parser.end(JSON.stringify(content))

    const result = await chunks(parser)

    strictEqual(result[0].a.termType, 'Literal')
    strictEqual(result[0].a.value, content.results.bindings[0].a.value)
    strictEqual(result[1].a.termType, 'Literal')
    strictEqual(result[1].a.value, content.results.bindings[1].a.value)
  })

  it('should parse typed literal values', async () => {
    const parser = new ResultParser({ factory })
    const content = {
      results: {
        bindings: [{
          a: { type: 'literal', value: '0', datatype: 'http://example.org/datatype/0' }
        }, {
          a: { type: 'literal', value: '1', datatype: 'http://example.org/datatype/0' }
        }]
      }
    }

    parser.end(JSON.stringify(content))

    const result = await chunks(parser)

    strictEqual(result[0].a.termType, 'Literal')
    strictEqual(result[0].a.value, content.results.bindings[0].a.value)
    strictEqual(result[0].a.datatype.value, content.results.bindings[0].a.datatype)
    strictEqual(result[1].a.termType, 'Literal')
    strictEqual(result[1].a.value, content.results.bindings[1].a.value)
    strictEqual(result[1].a.datatype.value, content.results.bindings[1].a.datatype)
  })

  it('should parse Virtuoso style typed literal values', async () => {
    const parser = new ResultParser({ factory })
    const content = {
      results: {
        bindings: [{
          a: { type: 'typed-literal', value: '0', datatype: 'http://example.org/datatype/0' }
        }, {
          a: { type: 'typed-literal', value: '1', datatype: 'http://example.org/datatype/0' }
        }]
      }
    }

    parser.end(JSON.stringify(content))

    const result = await chunks(parser)

    strictEqual(result[0].a.termType, 'Literal')
    strictEqual(result[0].a.value, content.results.bindings[0].a.value)
    strictEqual(result[0].a.datatype.value, content.results.bindings[0].a.datatype)
    strictEqual(result[1].a.termType, 'Literal')
    strictEqual(result[1].a.value, content.results.bindings[1].a.value)
    strictEqual(result[1].a.datatype.value, content.results.bindings[1].a.datatype)
  })

  it('should parse language literal values', async () => {
    const parser = new ResultParser({ factory })
    const content = {
      results: {
        bindings: [{
          a: { type: 'literal', value: '0', 'xml:lang': 'de' }
        }, {
          a: { type: 'literal', value: '1', 'xml:lang': 'en' }
        }]
      }
    }

    parser.end(JSON.stringify(content))

    const result = await chunks(parser)

    strictEqual(result[0].a.termType, 'Literal')
    strictEqual(result[0].a.value, content.results.bindings[0].a.value)
    strictEqual(result[0].a.language, content.results.bindings[0].a['xml:lang'])
    strictEqual(result[1].a.termType, 'Literal')
    strictEqual(result[1].a.value, content.results.bindings[1].a.value)
    strictEqual(result[1].a.language, content.results.bindings[1].a['xml:lang'])
  })

  it('should parse multiple variables', async () => {
    const parser = new ResultParser({ factory })
    const content = {
      results: {
        bindings: [{
          a: { type: 'uri', value: 'http://example.org/0' },
          b: { type: 'uri', value: 'http://example.org/1' }
        }, {
          a: { type: 'uri', value: 'http://example.org/2' },
          b: { type: 'uri', value: 'http://example.org/3' }
        }]
      }
    }

    parser.end(JSON.stringify(content))

    const result = await chunks(parser)

    strictEqual(result[0].a.termType, 'NamedNode')
    strictEqual(result[0].a.value, content.results.bindings[0].a.value)
    strictEqual(result[0].b.termType, 'NamedNode')
    strictEqual(result[0].b.value, content.results.bindings[0].b.value)
    strictEqual(result[1].a.termType, 'NamedNode')
    strictEqual(result[1].a.value, content.results.bindings[1].a.value)
    strictEqual(result[1].b.termType, 'NamedNode')
    strictEqual(result[1].b.value, content.results.bindings[1].b.value)
  })

  it('should use the given factory', async () => {
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
    const parser = new ResultParser({ factory })

    parser.end(JSON.stringify(content))

    await chunks(parser)

    deepStrictEqual(factory.used, {
      blankNode: true,
      literal: true,
      namedNode: true
    })
  })
})
