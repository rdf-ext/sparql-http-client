const Endpoint = require('./Endpoint')
const ParsingQuery = require('./ParsingQuery')
const BaseClient = require('./BaseClient')

/**
 * A client implementation which parses SPARQL responses into RDF/JS dataset (CONSTRUCT/DESCRIBE) or JSON objects (SELECT)
 *
 * It does not provide a store
 *
 * @property {ParsingQuery} query
 */
class ParsingClient extends BaseClient {
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
      Query: ParsingQuery
    })
  }
}

module.exports = ParsingClient
