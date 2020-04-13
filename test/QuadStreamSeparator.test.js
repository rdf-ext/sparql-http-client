const { deepStrictEqual, strictEqual } = require('assert')
const { promisify } = require('util')
const getStream = require('get-stream')
const { isReadable, isWritable } = require('isstream')
const { describe, it } = require('mocha')
const rdf = require('@rdfjs/data-model')
const namespace = require('@rdfjs/namespace')
const { quadToNTriples } = require('@rdfjs/to-ntriples')
const { finished } = require('readable-stream')
const QuadStreamSeparator = require('../lib/QuadStreamSeparator')

const untilFinished = promisify(finished)

const ns = {
  ex: namespace('http://example.org/')
}

describe('QuadStreamSeparator', () => {
  it('should be a constructor', () => {
    strictEqual(typeof QuadStreamSeparator, 'function')
  })

  it('should have a Writable interface', () => {
    const stream = new QuadStreamSeparator({ change: () => {} })

    strictEqual(isWritable(stream), true)
  })

  it('should call change after the first stream was created', async () => {
    let called = false

    const quad = rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1)
    const stream = new QuadStreamSeparator({
      change: () => {
        called = true
      }
    })

    stream.write(quad)
    stream.end()

    await untilFinished(stream)

    strictEqual(called, true)
  })

  it('should call change with the output stream as argument', async () => {
    let output = null

    const quad = rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1)
    const stream = new QuadStreamSeparator({
      change: stream => {
        output = stream
      }
    })

    stream.write(quad)
    stream.end()

    await untilFinished(stream)

    strictEqual(isReadable(output), true)
  })

  it('should forward all chunks to the first stream if they are all in the same graph', async () => {
    const actual = []
    const quads = [
      rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1),
      rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2, ns.ex.graph1),
      rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3, ns.ex.graph1),
      rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4, ns.ex.graph1),
      rdf.quad(ns.ex.subject5, ns.ex.predicate5, ns.ex.object5, ns.ex.graph1),
      rdf.quad(ns.ex.subject6, ns.ex.predicate6, ns.ex.object6, ns.ex.graph1)
    ]
    const expected = [
      quads
        .map(quad => quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n')
        .join('')
    ]

    const stream = new QuadStreamSeparator({
      change: stream => {
        getStream(stream).then(result => {
          actual.push(result)
        })
      }
    })

    quads.forEach(quad => {
      stream.write(quad)
    })
    stream.end()

    await untilFinished(stream)

    deepStrictEqual(actual, expected)
  })

  it('should create a new stream on graph change', async () => {
    const actual = []
    const quads = [
      rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1),
      rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2, ns.ex.graph1),
      rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3),
      rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4),
      rdf.quad(ns.ex.subject5, ns.ex.predicate5, ns.ex.object5, ns.ex.graph2),
      rdf.quad(ns.ex.subject6, ns.ex.predicate6, ns.ex.object6, ns.ex.graph2)
    ]

    const expected = [
      quads
        .slice(0, 2)
        .map(quad => quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n')
        .join(''),
      quads
        .slice(2, 4)
        .map(quad => quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n')
        .join(''),
      quads
        .slice(4, 6)
        .map(quad => quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n')
        .join('')
    ]

    const stream = new QuadStreamSeparator({
      change: stream => {
        getStream(stream).then(result => {
          actual.push(result)
        })
      }
    })

    quads.forEach(quad => {
      stream.write(quad)
    })
    stream.end()

    await untilFinished(stream)

    deepStrictEqual(actual, expected)
  })

  it('should create a new stream when maxQuadsPerStream is reached', async () => {
    const actual = []
    const quads = [
      rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1, ns.ex.graph1),
      rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2, ns.ex.graph1),
      rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3, ns.ex.graph1),
      rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4, ns.ex.graph1),
      rdf.quad(ns.ex.subject5, ns.ex.predicate5, ns.ex.object5, ns.ex.graph1),
      rdf.quad(ns.ex.subject6, ns.ex.predicate6, ns.ex.object6, ns.ex.graph1)
    ]

    const expected = [
      quads
        .slice(0, 2)
        .map(quad => quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n')
        .join(''),
      quads
        .slice(2, 4)
        .map(quad => quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n')
        .join(''),
      quads
        .slice(4, 6)
        .map(quad => quadToNTriples(rdf.quad(quad.subject, quad.predicate, quad.object)) + '\n')
        .join('')
    ]

    const stream = new QuadStreamSeparator({
      change: stream => {
        getStream(stream).then(result => {
          actual.push(result)
        })
      },
      maxQuadsPerStream: 2
    })

    quads.forEach(quad => {
      stream.write(quad)
    })
    stream.end()

    await untilFinished(stream)

    deepStrictEqual(actual, expected)
  })
})
