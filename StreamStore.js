const { URL } = require('universal-url')
const { promisify } = require('util')
const TripleToQuadTransform = require('rdf-transform-triple-to-quad')
const rdf = require('@rdfjs/data-model')
const N3Parser = require('@rdfjs/parser-n3')
const { finished } = require('readable-stream')
const checkResponse = require('./lib/checkResponse')
const QuadStreamSeparator = require('./lib/QuadStreamSeparator')

class StreamStore {
  constructor ({ endpoint, factory = rdf, maxQuadsPerRequest }) {
    this.endpoint = endpoint
    this.factory = factory
    this.maxQuadsPerRequest = maxQuadsPerRequest
  }

  async get (graph) {
    return this.read({ method: 'GET', graph })
  }

  async post (stream) {
    return this.write({ method: 'POST', stream })
  }

  async put (stream) {
    return this.write({ firstMethod: 'PUT', method: 'POST', stream })
  }

  async read ({ method, graph }) {
    const url = new URL(this.endpoint.storeUrl)

    if (graph.termType !== 'DefaultGraph') {
      url.searchParams.append('graph', graph.value)
    }

    return this.endpoint.fetch(url, {
      method,
      headers: this.endpoint.mergeHeaders({ accept: 'application/n-triples' })
    }).then(res => {
      checkResponse(res)

      const parser = new N3Parser({ factory: this.factory })
      const tripleToQuad = new TripleToQuadTransform(graph, { factory: this.factory })

      return parser.import(res.body).pipe(tripleToQuad)
    })
  }

  async write ({ firstMethod, method, stream }) {
    const seen = new Set()
    let requestEnd = null

    const splitter = new QuadStreamSeparator({
      maxQuadsPerStream: this.maxQuadsPerRequest,
      change: async stream => {
        if (requestEnd) {
          await requestEnd
        }

        const currentMethod = seen.has(splitter.graph.value) ? method : (firstMethod || method)

        requestEnd = this.writeRequest(currentMethod, splitter.graph, stream)

        seen.add(splitter.graph.value)
      }
    })

    stream.pipe(splitter)

    await promisify(finished)(splitter)
    await requestEnd
  }

  writeRequest (method, graph, stream) {
    const url = new URL(this.endpoint.storeUrl)

    if (graph.termType !== 'DefaultGraph') {
      url.searchParams.append('graph', graph.value)
    }

    return this.endpoint.fetch(url, {
      method,
      headers: this.endpoint.mergeHeaders({ 'content-type': 'application/n-triples' }),
      body: stream
    }).then(res => {
      checkResponse(res)
    })
  }
}

module.exports = StreamStore
