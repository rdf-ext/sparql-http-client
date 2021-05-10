const defaultFetch = require('nodeify-fetch')

/**
 * Represents a SPARQL endpoint and exposes a low-level methods, close to the underlying HTTP interface
 *
 * It directly returns HTTP response objects
 */
class Endpoint {
  /**
   * @param {Object} init
   * @param {string} init.endpointUrl SPARQL Query endpoint URL
   * @param {fetch} [init.fetch=nodeify-fetch] fetch implementation
   * @param {HeadersInit} [init.headers] HTTP headers to send with every endpoint request
   * @param {string} [init.password] password used for basic authentication
   * @param {string} [init.storeUrl] Graph Store URL
   * @param {string} [init.updateUrl] SPARQL Update endpoint URL
   * @param {string} [init.user] user used for basic authentication
   */
  constructor ({ endpointUrl, fetch, headers, password, storeUrl, updateUrl, user }) {
    this.endpointUrl = endpointUrl
    this.fetch = fetch || defaultFetch
    this.headers = new this.fetch.Headers(headers)
    this.storeUrl = storeUrl
    this.updateUrl = updateUrl

    if (typeof user === 'string' && typeof password === 'string') {
      this.headers.set('authorization', 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64'))
    }
  }

  /**
   * Sends the query as GET request with query string
   * @param {string} query SPARQL Query/Update
   * @param {Object} options
   * @param {HeadersInit} [options.headers] per-request HTTP headers
   * @param {boolean} [options.update=false] if true, performs a SPARQL Update
   * @return {Promise<Response>}
   */
  async get (query, { headers, update = false } = {}) {
    let url = null

    if (!update) {
      url = new URL(this.endpointUrl)
      url.searchParams.append('query', query)
    } else {
      url = new URL(this.updateUrl)
      url.searchParams.append('update', query)
    }

    return this.fetch(url.toString().replace(/\+/g, '%20'), {
      method: 'GET',
      headers: this.mergeHeaders(headers)
    })
  }

  /**
   * Sends the query as POST request with application/sparql-query body
   * @param {string} query SPARQL Query/Update
   * @param {Object} options
   * @param {HeadersInit} [options.headers] per-request HTTP headers
   * @param {boolean} [options.update=false] if true, performs a SPARQL Update
   * @return {Promise<Response>}
   */
  async postDirect (query, { headers, update = false } = {}) {
    let url = null

    if (!update) {
      url = new URL(this.endpointUrl)
    } else {
      url = new URL(this.updateUrl)
    }

    headers = this.mergeHeaders(headers)

    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/sparql-query; charset=utf-8')
    }

    return this.fetch(url, {
      method: 'POST',
      headers,
      body: query
    })
  }

  /**
   * Sends the query as POST request with application/x-www-form-urlencoded body
   * @param {string} query SPARQL Query/Update
   * @param {Object} options
   * @param {HeadersInit} [options.headers] per-request HTTP headers
   * @param {boolean} [options.update=false] if true, performs a SPARQL Update
   * @return {Promise<Response>}
   */
  async postUrlencoded (query, { headers, update = false } = {}) {
    let url = null
    let body = null

    if (!update) {
      url = new URL(this.endpointUrl)
      body = 'query=' + encodeURIComponent(query)
    } else {
      url = new URL(this.updateUrl)
      body = 'update=' + encodeURIComponent(query)
    }

    headers = this.mergeHeaders(headers)

    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/x-www-form-urlencoded')
    }

    return this.fetch(url, {
      method: 'POST',
      headers,
      body
    })
  }

  mergeHeaders (args = {}) {
    const merged = new this.fetch.Headers()

    // client headers
    for (const [key, value] of this.headers) {
      merged.set(key, value)
    }

    // argument headers
    for (const [key, value] of new this.fetch.Headers(args)) {
      merged.set(key, value)
    }

    return merged
  }
}

module.exports = Endpoint
