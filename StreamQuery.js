const rdf = require('@rdfjs/data-model')
const N3Parser = require('@rdfjs/parser-n3')
const checkResponse = require('./lib/checkResponse')
const RawQuery = require('./RawQuery')
const ResultParser = require('./ResultParser')

/**
 * Extends RawQuery by wrapping response body streams as RDF/JS Streams
 */
class StreamQuery extends RawQuery {
  /**
   * @param {Object} init
   * @param {Endpoint} init.endpoint
   * @param {DataFactory} [init.factory=@rdfjs/data-model]
   */
  constructor ({ endpoint, factory = rdf }) {
    super({ endpoint })

    /** @member {DataFactory} */
    this.factory = factory
  }

  /**
   * @param {string} query SPARQL ASK query
   * @param {Object} [init]
   * @param {HeadersInit} [init.headers] HTTP request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [init.operation='get']
   * @return {Promise<boolean>}
   */
  async ask (query, { headers, operation } = {}) {
    const res = await super.ask(query, { headers, operation })

    await checkResponse(res)

    const json = await res.json()

    return json.boolean
  }

  /**
   * @param {string} query SPARQL query
   * @param {Object} [init]
   * @param {HeadersInit} [init.headers] HTTP request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [init.operation='get']
   * @return {Promise<Stream>}
   */
  async construct (query, { headers, operation } = {}) {
    headers = new this.endpoint.fetch.Headers(headers)

    if (!headers.has('accept')) {
      headers.set('accept', 'application/n-triples, text/turtle')
    }

    const res = await super.construct(query, { headers, operation })

    await checkResponse(res)

    const parser = new N3Parser({ factory: this.factory })

    return parser.import(res.body)
  }

  /**
   * @param {string} query SPARQL query
   * @param {Object} [init]
   * @param {HeadersInit} [init.headers] HTTP request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [init.operation='get']
   * @return {Promise<Stream>}
   */
  async select (query, { headers, operation } = {}) {
    const res = await super.select(query, { headers, operation })

    await checkResponse(res)

    const parser = new ResultParser({ factory: this.factory })

    return res.body.pipe(parser)
  }

  /**
   * @param {string} query SPARQL query
   * @param {Object} [init]
   * @param {HeadersInit} [init.headers] HTTP request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [init.operation='postUrlencoded']
   * @return {Promise<void>}
   */
  async update (query, { headers, operation } = {}) {
    const res = await super.update(query, { headers, operation })

    await checkResponse(res)
  }
}

module.exports = StreamQuery
