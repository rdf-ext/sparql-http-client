import Endpoint from './Endpoint.js'
import RawQuery from './RawQuery.js'
import BaseClient from './BaseClient.js'

/**
 * A basic client implementation which uses RawQuery and no Store
 *
 * @property {RawQuery} query
 */
class SimpleClient extends BaseClient {
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
      Query: RawQuery
    })
  }
}

export default SimpleClient
