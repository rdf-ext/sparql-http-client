const { promisify } = require('util')
const TripleToQuadTransform = require('rdf-transform-triple-to-quad')
const rdf = require('@rdfjs/data-model')
const N3Parser = require('@rdfjs/parser-n3')
const { finished } = require('readable-stream')
const checkResponse = require('./lib/checkResponse')
const QuadStreamSeparator = require('./lib/QuadStreamSeparator')

/**
 * Accesses stores with SPARQL Graph Protocol
 */
class StreamStore {
  /**
   *
   * @param {Object} init
   * @param {Endpoint} init.endpoint
   * @param {DataFactory} [init.factory=@rdfjs/data-model]
   * @param {number} [maxQuadsPerRequest]
   */
  constructor ({ endpoint, factory = rdf, maxQuadsPerRequest }) {
    this.endpoint = endpoint
    this.factory = factory
    this.maxQuadsPerRequest = maxQuadsPerRequest
  }

  /**
   * Gets a graph triples from the store
   * @param {NamedNode} graph
   * @return {Promise<Stream>}
   */
  async get (graph) {
    return this.read({ method: 'GET', graph })
  }

  /**
   * Adds triples to a graph
   * @param {Stream} stream
   * @return {Promise<void>}
   */
  async post (stream) {
    return this.write({ method: 'POST', stream })
  }

  /**
   * Replaces graph with triples
   * @param {Stream} stream
   * @return {Promise<void>}
   */
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
    }).then(async res => {
      await checkResponse(res)

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

  async writeRequest (method, graph, stream) {
    const url = new URL(this.endpoint.storeUrl)

    if (graph.termType !== 'DefaultGraph') {
      url.searchParams.append('graph', graph.value)
    }

    const res = await this.endpoint.fetch(url, {
      method,
      headers: this.endpoint.mergeHeaders({ 'content-type': 'application/n-triples' }),
      body: stream
    })

    await checkResponse(res)
  }
}

module.exports = StreamStore
