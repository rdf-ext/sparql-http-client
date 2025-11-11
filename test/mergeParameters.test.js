import { deepStrictEqual, strictEqual } from 'node:assert'
import rdf from '@rdfjs/data-model'
import { describe, it } from 'mocha'
import mergeParameters from '../lib/mergeParameters.js'

describe('mergeParameters', () => {
  it('should be a function', () => {
    strictEqual(typeof mergeParameters, 'function')
  })

  it('should merge parameters in different formats', () => {
    const expected = [
      ['param1', 'value1a'],
      ['param2', 'value2a'],
      ['param2', 'value2b'],
      ['param1', 'value1b'],
      ['param2', 'value2c']
    ]

    const result = mergeParameters(
      { param1: 'value1a', param2: ['value2a', 'value2b'] },
      { param1: 'value1b' },
      new URLSearchParams([['param2', 'value2c']])
    )

    deepStrictEqual([...result.entries()], expected)
  })

  it('should merge URL parameters in different formats', () => {
    const expected = [
      ['param1', 'http://example1.org/a'],
      ['param2', 'http://example2.org/a'],
      ['param2', 'http://example2.org/b'],
      ['param1', 'http://example1.org/b'],
      ['param2', 'http://example2.org/c']
    ]

    const result = mergeParameters(
      {
        param1: 'http://example1.org/a',
        param2: [
          rdf.namedNode('http://example2.org/a'),
          'http://example2.org/b'
        ]
      },
      { param1: rdf.namedNode('http://example1.org/b') },
      new URLSearchParams([['param2', 'http://example2.org/c']])
    )

    deepStrictEqual([...result.entries()], expected)
  })
})
