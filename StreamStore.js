const { URL } = require('universal-url')
const { promisify } = require('util')
const delay = require('promise-the-world/delay')
const mutex = require('promise-the-world/mutex')
const TripleToQuadTransform = require('rdf-transform-triple-to-quad')
const rdf = require('@rdfjs/data-model')
const N3Parser = require('@rdfjs/parser-n3')
const { quadToNTriples } = require('@rdfjs/to-ntriples')
const { finished, Readable } = require('readable-stream')
const checkResponse = require('./lib/checkResponse')

function streamToPromise (stream) {
  const p = promisify(finished)(stream)

  p.end = false

  p.then(() => {
    p.end = true
  }).catch(() => {
    p.end = true
  })

  return p
}

class StreamStore {
  constructor ({ endpoint, factory = rdf }) {
    this.endpoint = endpoint
    this.factory = factory
  }

  async get (graph) {
    return this.read({ method: 'GET', graph })
  }

  async post (stream) {
    return this.write({ method: 'POST', stream })
  }

  async put (stream) {
    return this.write({ method: 'PUT', stream })
  }

  async read ({ method, graph }) {
    const url = new URL(this.endpoint.storeUrl)

    if (graph.termType !== 'DefaultGraph') {
      url.searchParams.append('graph', graph.value)
    }

    return this.endpoint.fetch(url, {
      method,
      headers: this.client.mergeHeaders({ accept: 'application/n-triples' })
    }).then(res => {
      checkResponse(res)

      const parser = new N3Parser({ factory: this.factory })
      const tripleToQuad = new TripleToQuadTransform(graph, { factory: this.factory })

      return parser.import(res.body).pipe(tripleToQuad)
    })
  }

  async write ({ method, stream }) {
    let request = null
    let last = null
    const all = streamToPromise(stream)
    const order = mutex()

    const read = async () => {
      await order.lock()

      while (true) {
        const quad = stream.read()

        if (!quad && all.end) {
          if (request) {
            request.stream.push(null)

            break
          }

          break
        }

        if (quad) {
          if (!request) {
            request = this.writeRequest(method, quad.graph, read)
          }

          if (last && !last.graph.equals(quad.graph)) {
            request.stream.push(null)

            await request.promise

            request = this.writeRequest(method, quad.graph, read)
          }

          last = quad

          const triple = this.factory.quad(quad.subject, quad.predicate, quad.object)

          if (!request.stream.push(quadToNTriples(triple) + '\n')) {
            break
          }
        }

        await delay(0)
      }

      order.unlock()
    }

    read()

    await all

    if (request) {
      await request.promise
    }
  }

  writeRequest (method, graph, read) {
    const stream = new Readable({ read })
    const streamEnd = streamToPromise(stream)
    const url = new URL(this.endpoint.storeUrl)

    if (graph.termType !== 'DefaultGraph') {
      url.searchParams.append('graph', graph.value)
    }

    const requestEnd = this.endpoint.fetch(url, {
      method,
      headers: this.client.mergeHeaders({ 'content-type': 'application/n-triples' }),
      body: stream
    }).then(res => {
      checkResponse(res)
    })

    return {
      promise: Promise.all([streamEnd, requestEnd]),
      stream
    }
  }
}

module.exports = StreamStore
