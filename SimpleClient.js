import defaultFetch from 'nodeify-fetch'
import mergeHeaders from './lib/mergeHeaders.js'
import RawQuery from './RawQuery.js'

/**
 * A client implementation based on {@link RawQuery} that prepares URLs and headers for SPARQL queries and returns the
 * raw fetch response. It does not provide a store interface.
 *
 * @property {RawQuery} query
 * @property {string} endpointUrl
 * @property {RawQuery} factory
 * @property {factory} fetch
 * @property {Headers} headers
 * @property {string} password
 * @property {string} storeUrl
 * @property {string} updateUrl
 * @property {string} user
 * @property {string} updateUrl
 *
 * @example
 * // read the height of the Eiffel Tower from Wikidata with a SELECT query
 *
 * import SparqlClient from 'sparql-http-client/SimpleClient.js'
 *
 * const endpointUrl = 'https://query.wikidata.org/sparql'
 * const query = `
 * PREFIX wd: <http://www.wikidata.org/entity/>
 * PREFIX p: <http://www.wikidata.org/prop/>
 * PREFIX ps: <http://www.wikidata.org/prop/statement/>
 * PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
 *
 * SELECT ?value WHERE {
 *   wd:Q243 p:P2048 ?height.
 *
 *   ?height pq:P518 wd:Q24192182;
 *     ps:P2048 ?value .
 * }`
 *
 * const client = new SparqlClient({ endpointUrl })
 * const res = await client.query.select(query)
 *
 * if (!res.ok) {
 * return console.error(res.statusText)
 * }
 *
 * const content = await res.json()
 *
 * console.log(JSON.stringify(content, null, 2))
 */
class SimpleClient {
  /**
   * @param {Object} options
   * @param {string} [options.endpointUrl] SPARQL query endpoint URL
   * @param {factory} [options.factory] RDF/JS factory
   * @param {fetch} [options.fetch=nodeify-fetch] fetch implementation
   * @param {Headers} [options.headers] headers sent with every request
   * @param {string} [options.password] password used for basic authentication
   * @param {Object} [options.parameters] parameters sent with every request
   * @param {string} [options.storeUrl] SPARQL Graph Store URL
   * @param {string} [options.updateUrl] SPARQL update endpoint URL
   * @param {string} [options.user] user used for basic authentication
   * @param {Query} [options.Query] Constructor of a query implementation
   * @param {Store} [options.Store] Constructor of a store implementation
   */
  constructor ({
    endpointUrl,
    factory,
    fetch = defaultFetch,
    headers,
    parameters,
    password,
    storeUrl,
    updateUrl,
    user,
    Query = RawQuery,
    Store
  }) {
    if (!endpointUrl && !storeUrl && !updateUrl) {
      throw new Error('no endpointUrl, storeUrl, or updateUrl given')
    }

    this.endpointUrl = endpointUrl
    this.factory = factory
    this.fetch = fetch
    this.headers = new Headers(headers)
    this.parameters = parameters
    this.password = password
    this.storeUrl = storeUrl
    this.updateUrl = updateUrl
    this.user = user
    this.query = Query ? new Query({ client: this }) : null
    this.store = Store ? new Store({ client: this }) : null

    if (typeof user === 'string' && typeof password === 'string') {
      this.headers.set('authorization', `Basic ${btoa(`${user}:${password}`)}`)
    }
  }

  /**
   * Sends a GET request as defined in the
   * {@link https://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-via-get SPARQL Protocol specification}.
   *
   * @param {string} query SPARQL query
   * @param {Object} options
   * @param {Headers} [options.headers] additional request headers
   * @param {Object} [options.parameters] additional request parameters
   * @param {boolean} [options.update=false] send the request to the updateUrl
   * @return {Promise<Response>}
   */
  async get (query, { headers, parameters, update = false } = {}) {
    let url = null

    if (!update) {
      url = new URL(this.endpointUrl)
      url.searchParams.append('query', query)
    } else {
      url = new URL(this.updateUrl)
      url.searchParams.append('update', query)
    }

    parameters = { ...this.parameters, ...parameters }

    for (const [key, value] of Object.entries(parameters)) {
      url.searchParams.append(key, value)
    }

    return this.fetch(url.toString().replace(/\+/g, '%20'), {
      method: 'GET',
      headers: mergeHeaders(this.headers, headers)
    })
  }

  /**
   * Sends a POST directly request as defined in the
   * {@link https://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-via-post-direct SPARQL Protocol specification}.
   *
   *
   * @param {string} query SPARQL query
   * @param {Object} options
   * @param {Headers} [options.headers] additional request headers
   * @param {Object} [options.parameters] additional request parameters
   * @param {boolean} [options.update=false] send the request to the updateUrl
   * @return {Promise<Response>}
   */
  async postDirect (query, { headers, parameters, update = false } = {}) {
    let url = null

    if (!update) {
      url = new URL(this.endpointUrl)
    } else {
      url = new URL(this.updateUrl)
    }

    headers = mergeHeaders(this.headers, headers)

    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/sparql-query; charset=utf-8')
    }

    parameters = { ...this.parameters, ...parameters }

    for (const [key, value] of Object.entries(parameters)) {
      url.searchParams.append(key, value)
    }

    return this.fetch(url, {
      method: 'POST',
      headers,
      body: query
    })
  }

  /**
   * Sends a POST URL-encoded request as defined in the
   * {@link https://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/#query-via-post-urlencoded SPARQL Protocol specification}.
   *
   * @param {string} query SPARQL query
   * @param {Object} options
   * @param {Headers} [options.headers] additional request headers
   * @param {Object} [options.parameters] additional request parameters
   * @param {boolean} [options.update=false] send the request to the updateUrl
   * @return {Promise<Response>}
   */
  async postUrlencoded (query, { headers, parameters, update = false } = {}) {
    let url = null
    const body = new URLSearchParams()

    if (!update) {
      url = new URL(this.endpointUrl)
      body.append('query', query)
    } else {
      url = new URL(this.updateUrl)
      body.append('update', query)
    }

    headers = mergeHeaders(this.headers, headers)

    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/x-www-form-urlencoded')
    }

    parameters = { ...this.parameters, ...parameters }

    for (const [key, value] of Object.entries(parameters)) {
      body.append(key, value)
    }

    return this.fetch(url, {
      method: 'POST',
      headers,
      body: body.toString()
    })
  }
}

export default SimpleClient
