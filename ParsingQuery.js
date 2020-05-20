const { array } = require('get-stream')
const StreamQuery = require('./StreamQuery')

/**
 * Extends StreamQuery by materialising the SPARQL response streams
 */
class ParsingQuery extends StreamQuery {
  /**
   * @param {Object} init
   * @param {Endpoint} init.endpoint
   */
  constructor ({ endpoint }) {
    super({ endpoint })
  }

  /**
   * Performs a query which returns triples
   *
   * @param {string} query
   * @param {Object} [options]
   * @param {HeadersInit} [options.headers] HTTP request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [options.operation='get']
   * @return {Promise<Quad[]>}
   */
  async construct (query, options = {}) {
    const stream = await super.construct(query, options)

    return array(stream)
  }

  /**
   * Performs a SELECT query which returns binding tuples
   *
   * @param {string} query
   * @param {Object} [options]
   * @param {HeadersInit} [options.headers] HTTP request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [options.operation='get']
   * @return {Promise<Array<Object.<string, Term>>>}
   */
  async select (query, options = {}) {
    const stream = await super.select(query, options)

    return array(stream)
  }
}

module.exports = ParsingQuery
