const { URL } = require('universal-url')
const defaultFetch = require('nodeify-fetch')

class Endpoint {
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
