/**
 * A base query class which performs HTTP requests for the different SPARQL query forms
 */
class RawQuery {
  /**
   * @param {Object} init
   * @param {Endpoint} init.endpoint
   */
  constructor ({ endpoint }) {
    /** @member {Endpoint} */
    this.endpoint = endpoint
  }

  /**
   * Performs an ASK query
   * By default uses HTTP GET with query string
   *
   * @param {string} query SPARQL ASK query
   * @param {Object} [init]
   * @param {HeadersInit} [init.headers] HTTP request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [init.operation='get']
   * @return {Promise<Response>}
   */
  async ask (query, { headers, operation = 'get' } = {}) {
    headers = this.endpoint.mergeHeaders(headers)

    if (!headers.has('accept')) {
      headers.set('accept', 'application/sparql-results+json')
    }

    return this.endpoint[operation](query, { headers })
  }

  /**
   * Performs a CONSTRUCT/DESCRIBE query
   * By default uses HTTP GET with query string
   *
   * @param {string} query SPARQL query
   * @param {Object} [init]
   * @param {HeadersInit} [init.headers] HTTP request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [init.operation='get']
   * @return {Promise<Response>}
   */
  async construct (query, { headers, operation = 'get' } = {}) {
    headers = new this.endpoint.fetch.Headers(headers)

    if (!headers.has('accept')) {
      headers.set('accept', 'application/n-triples')
    }

    return this.endpoint[operation](query, { headers })
  }

  /**
   * Performs a SELECT query
   * By default uses HTTP GET with query string
   *
   * @param {string} query SPARQL query
   * @param {Object} [init]
   * @param {HeadersInit} [init.headers] HTTP request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [init.operation='get']
   * @return {Promise<Response>}
   */
  async select (query, { headers, operation = 'get' } = {}) {
    headers = this.endpoint.mergeHeaders(headers)

    if (!headers.has('accept')) {
      headers.set('accept', 'application/sparql-results+json')
    }

    return this.endpoint[operation](query, { headers })
  }

  /**
   * Performs a SELECT query
   * By default uses HTTP POST with form-encoded body
   *
   * @param {string} query SPARQL query
   * @param {Object} [init]
   * @param {HeadersInit} [init.headers] HTTP request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [init.operation='postUrlencoded']
   * @return {Promise<Response>}
   */
  async update (query, { headers, operation = 'postUrlencoded' } = {}) {
    headers = new this.endpoint.fetch.Headers(headers)

    if (!headers.has('accept')) {
      headers.set('accept', '*/*')
    }

    return this.endpoint[operation](query, { headers, update: true })
  }
}

module.exports = RawQuery
