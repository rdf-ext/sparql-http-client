const BaseClient = require('./BaseClient')
const Endpoint = require('./Endpoint')
const StreamQuery = require('./StreamQuery')
const StreamStore = require('./StreamStore')

/**
 * The default client implementation which returns SPARQL response as RDF/JS streams
 *
 * @property {StreamQuery} query
 * @property {StreamStore} store
 */
class StreamClient extends BaseClient {
  /**
   * @param {Object} options
   * @param {string} options.endpointUrl SPARQL Query endpoint URL
   * @param {fetch} [options.fetch=nodeify-fetch] fetch implementation
   * @param {HeadersInit} [options.headers] HTTP headers to send with every endpoint request
   * @param {string} [options.password] password used for basic authentication
   * @param {string} [options.storeUrl] Graph Store URL
   * @param {string} [options.updateUrl] SPARQL Update endpoint URL
   * @param {string} [options.user] user used for basic authentication
   * @param {factory} [options.factory] RDF/JS DataFactory
   */
  constructor (options) {
    super({
      endpoint: new Endpoint(options),
      factory: options.factory,
      Query: StreamQuery,
      Store: StreamStore,
      ...options
    })
  }
}

module.exports = StreamClient
