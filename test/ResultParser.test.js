const { deepStrictEqual, strictEqual, notStrictEqual } = require('assert')
const getStream = require('get-stream')
const { describe, it } = require('mocha')
const testFactory = require('./support/testFactory')
const ResultParser = require('../ResultParser')

describe('ResultParser', () => {
  it('should be a constructor', () => {
    strictEqual(typeof ResultParser, 'function')
  })

  it('should throw an error if the content is not JSON', async () => {
    let error = null
    const parser = new ResultParser()

    parser.end('this is not json')

    try {
      await getStream.array(parser)
    } catch (err) {
      error = err
    }

    notStrictEqual(error, null)
  })

  it('should not emit any chunk if the json doesn\'t contain results.bindings', async () => {
    const parser = new ResultParser()

    parser.end('{}')

    const result = await getStream.array(parser)

    deepStrictEqual(result, [])
  })

  it('should not emit any chunk when Stardog GROUP BY bug shows up', async () => {
    const parser = new ResultParser()
    const content = {
      results: {
        bindings: [{}]
      }
    }

    parser.end(JSON.stringify(content))

    const result = await getStream.array(parser)

    deepStrictEqual(result, [])
  })

  it('should parse named node values', async () => {
    const parser = new ResultParser()
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

    const result = await getStream.array(parser)

    strictEqual(result[0].a.termType, 'NamedNode')
    strictEqual(result[0].a.value, content.results.bindings[0].a.value)
    strictEqual(result[1].a.termType, 'NamedNode')
    strictEqual(result[1].a.value, content.results.bindings[1].a.value)
  })

  it('should parse blank node values', async () => {
    const parser = new ResultParser()
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

    const result = await getStream.array(parser)

    strictEqual(result[0].a.termType, 'BlankNode')
    strictEqual(result[0].a.value, content.results.bindings[0].a.value)
    strictEqual(result[1].a.termType, 'BlankNode')
    strictEqual(result[1].a.value, content.results.bindings[1].a.value)
  })

  it('should parse literal values', async () => {
    const parser = new ResultParser()
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

    const result = await getStream.array(parser)

    strictEqual(result[0].a.termType, 'Literal')
    strictEqual(result[0].a.value, content.results.bindings[0].a.value)
    strictEqual(result[1].a.termType, 'Literal')
    strictEqual(result[1].a.value, content.results.bindings[1].a.value)
  })

  it('should parse typed literal values', async () => {
    const parser = new ResultParser()
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

    const result = await getStream.array(parser)

    strictEqual(result[0].a.termType, 'Literal')
    strictEqual(result[0].a.value, content.results.bindings[0].a.value)
    strictEqual(result[0].a.datatype.value, content.results.bindings[0].a.datatype)
    strictEqual(result[1].a.termType, 'Literal')
    strictEqual(result[1].a.value, content.results.bindings[1].a.value)
    strictEqual(result[1].a.datatype.value, content.results.bindings[1].a.datatype)
  })

  it('should parse Virtuoso style typed literal values', async () => {
    const parser = new ResultParser()
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

    const result = await getStream.array(parser)

    strictEqual(result[0].a.termType, 'Literal')
    strictEqual(result[0].a.value, content.results.bindings[0].a.value)
    strictEqual(result[0].a.datatype.value, content.results.bindings[0].a.datatype)
    strictEqual(result[1].a.termType, 'Literal')
    strictEqual(result[1].a.value, content.results.bindings[1].a.value)
    strictEqual(result[1].a.datatype.value, content.results.bindings[1].a.datatype)
  })

  it('should parse language literal values', async () => {
    const parser = new ResultParser()
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

    const result = await getStream.array(parser)

    strictEqual(result[0].a.termType, 'Literal')
    strictEqual(result[0].a.value, content.results.bindings[0].a.value)
    strictEqual(result[0].a.language, content.results.bindings[0].a['xml:lang'])
    strictEqual(result[1].a.termType, 'Literal')
    strictEqual(result[1].a.value, content.results.bindings[1].a.value)
    strictEqual(result[1].a.language, content.results.bindings[1].a['xml:lang'])
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

    await getStream.array(parser)

    deepStrictEqual(factory.used, {
      blankNode: true,
      literal: true,
      namedNode: true
    })
  })
})
