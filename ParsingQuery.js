import chunks from 'stream-chunks/chunks.js'
import StreamQuery from './StreamQuery.js'

/**
 * A query implementation that wraps the results of the {@link StreamQuery} into RDF/JS DatasetCore objects
 * (CONSTRUCT/DESCRIBE) or an array of objects (SELECT).
 *
 * @extends StreamQuery
 */
class ParsingQuery extends StreamQuery {
  /**
   * Sends a request for a CONSTRUCT or DESCRIBE query
   *
   * @param {string} query CONSTRUCT or DESCRIBE query
   * @param {Object} options
   * @param {Headers} [options.headers] additional request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [options.operation='get'] SPARQL Protocol operation
   * @param {Object} [options.parameters] additional request parameters
   * @return {Promise<DatasetCore>}
   */
  async construct (query, { headers, operation, parameters } = {}) {
    const quads = await chunks(await super.construct(query, { headers, operation, parameters }))

    return this.client.factory.dataset(quads)
  }

  /**
   * Sends a request for a SELECT query
   *
   * @param {string} query SELECT query
   * @param {Object} [options]
   * @param {Headers} [options.headers] additional request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [options.operation='get'] SPARQL Protocol operation
   * @param {Object} [options.parameters] additional request parameters
   * @return {Promise<Array<Object.<string, Term>>>}
   */
  async select (query, { headers, operation, parameters } = {}) {
    return chunks(await super.select(query, { headers, operation, parameters }))
  }
}

export default ParsingQuery
