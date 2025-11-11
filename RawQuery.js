import mergeHeaders from './lib/mergeHeaders.js'

/**
 * A query implementation that prepares URLs and headers for SPARQL queries and returns the raw fetch response.
 */
class RawQuery {
  /**
   * @param {Object} options
   * @param {SimpleClient} options.client client that provides the HTTP I/O
   */
  constructor ({ client }) {
    this.client = client
  }

  /**
   * Sends a request for a ASK query
   *
   * @param {string} query ASK query
   * @param {Object} [options]
   * @param {Headers} [options.headers] additional request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [options.operation='get'] SPARQL Protocol operation
   * @param {Object} [options.parameters] additional request parameters
   * @return {Promise<Response>}
   */
  async ask (query, { headers, operation = 'get', parameters } = {}) {
    headers = mergeHeaders(headers)

    if (!headers.has('accept')) {
      headers.set('accept', 'application/sparql-results+json')
    }

    return this.client[operation](query, { headers, parameters })
  }

  /**
   * Sends a request for a CONSTRUCT or DESCRIBE query
   *
   * @param {string} query CONSTRUCT or DESCRIBE query
   * @param {Object} [options]
   * @param {Headers} [options.headers] additional request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [options.operation='get'] SPARQL Protocol operation
   * @param {Object} [options.parameters] additional request parameters
   * @return {Promise<Response>}
   */
  async construct (query, { headers, operation = 'get', parameters } = {}) {
    headers = mergeHeaders(headers)

    if (!headers.has('accept')) {
      headers.set('accept', 'application/n-triples, text/turtle')
    }

    return this.client[operation](query, { headers, operation, parameters })
  }

  /**
   * Sends a request for a SELECT query
   *
   * @param {string} query SELECT query
   * @param {Object} [options]
   * @param {Headers} [options.headers] additional request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [options.operation='get'] SPARQL Protocol operation
   * @param {Object} [options.parameters] additional request parameters
   * @return {Promise<Response>}
   */
  async select (query, { headers, operation = 'get', parameters } = {}) {
    headers = mergeHeaders(headers)

    if (!headers.has('accept')) {
      headers.set('accept', 'application/sparql-results+json')
    }

    return this.client[operation](query, { headers, parameters })
  }

  /**
   * Sends a request for an update query
   *
   * @param {string} query update query
   * @param {Object} [options]
   * @param {Headers} [options.headers] additional request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [options.operation='postUrlencoded'] SPARQL Protocol operation
   * @param {Object} [options.parameters] additional request parameters
   * @return {Promise<Response>}
   */
  async update (query, { headers, operation = 'postUrlencoded', parameters } = {}) {
    headers = mergeHeaders(headers)

    if (!headers.has('accept')) {
      headers.set('accept', '*/*')
    }

    return this.client[operation](query, { headers, parameters, update: true })
  }
}

export default RawQuery
