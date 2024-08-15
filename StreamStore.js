import N3Parser from '@rdfjs/parser-n3'
import toNT from '@rdfjs/to-ntriples'
import TripleToQuadTransform from 'rdf-transform-triple-to-quad'
import { Transform } from 'readable-stream'
import asyncToReadabe from './lib/asyncToReadabe.js'
import checkResponse from './lib/checkResponse.js'
import mergeHeaders from './lib/mergeHeaders.js'

/**
 * A store implementation that parses and serializes SPARQL Graph Store responses and requests into/from Readable
 * streams.
 */
class StreamStore {
  /**
   * @param {Object} options
   * @param {SimpleClient} options.client client that provides the HTTP I/O
   */
  constructor ({ client }) {
    this.client = client
  }

  /**
   * Sends a GET request to the Graph Store
   *
   * @param {NamedNode} [graph] source graph
   * @return {Promise<Readable>}
   */
  get (graph) {
    return this.read({ method: 'GET', graph })
  }

  /**
   * Sends a POST request to the Graph Store
   *
   * @param {Readable} stream triples/quads to write
   * @param {Object} [options]
   * @param {Term} [options.graph] target graph
   * @return {Promise<void>}
   */
  async post (stream, { graph } = {}) {
    return this.write({ graph, method: 'POST', stream })
  }

  /**
   * Sends a PUT request to the Graph Store
   *
   * @param {Readable} stream triples/quads to write
   * @param {Object} [options]
   * @param {Term} [options.graph] target graph
   * @return {Promise<void>}
   */
  async put (stream, { graph } = {}) {
    return this.write({ graph, method: 'PUT', stream })
  }

  /**
   * Generic read request to the Graph Store
   *
   * @param {Object} [options]
   * @param {Term} [options.graph] source graph
   * @param {string} options.method HTTP method
   * @returns {Readable}
   */
  read ({ graph, method }) {
    return asyncToReadabe(async () => {
      const url = new URL(this.client.storeUrl)

      if (graph && graph.termType !== 'DefaultGraph') {
        url.searchParams.append('graph', graph.value)
      } else {
        url.searchParams.append('default', '')
      }

      const res = await this.client.fetch(url, {
        method,
        headers: mergeHeaders(this.client.headers, { accept: 'application/n-triples' })
      })

      await checkResponse(res)

      const parser = new N3Parser({ factory: this.client.factory })
      const tripleToQuad = new TripleToQuadTransform(graph, { factory: this.client.factory })

      return parser.import(res.body).pipe(tripleToQuad)
    })
  }

  /**
   * Generic write request to the Graph Store
   *
   * @param {Object} [options]
   * @param {Term} [graph] target graph
   * @param {string} method HTTP method
   * @param {Readable} stream triples/quads to write
   * @returns {Promise<void>}
   */
  async write ({ graph, method, stream }) {
    const url = new URL(this.client.storeUrl)

    if (graph && graph.termType !== 'DefaultGraph') {
      url.searchParams.append('graph', graph.value)
    } else {
      url.searchParams.append('default', '')
    }

    const serialize = new Transform({
      writableObjectMode: true,
      transform (quad, encoding, callback) {
        const triple = {
          subject: quad.subject,
          predicate: quad.predicate,
          object: quad.object,
          graph: { termType: 'DefaultGraph' }
        }

        callback(null, `${toNT(triple)}\n`)
      }
    })

    const res = await this.client.fetch(url, {
      method,
      headers: mergeHeaders(this.client.headers, { 'content-type': 'application/n-triples' }),
      body: stream.pipe(serialize),
      duplex: 'half'
    })

    await checkResponse(res)
  }
}

export default StreamStore
