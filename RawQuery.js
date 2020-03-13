const { URL } = require('universal-url')

class RawQuery {
  constructor ({ endpoint }) {
    this.endpoint = endpoint
  }

  async get (query, { headers, update = false } = {}) {
    let url = null

    if (!update) {
      url = new URL(this.endpoint.endpointUrl)
      url.searchParams.append('query', query)
    } else {
      url = new URL(this.endpoint.updateUrl)
      url.searchParams.append('update', query)
    }

    return this.endpoint.fetch(url.toString().replace(/\+/g, '%20'), {
      method: 'GET',
      headers: this.endpoint.mergeHeaders(headers)
    })
  }

  async postDirect (query, { headers, update = false } = {}) {
    let url = null

    if (!update) {
      url = new URL(this.endpoint.endpointUrl)
    } else {
      url = new URL(this.endpoint.updateUrl)
    }

    headers = this.endpoint.mergeHeaders(headers)

    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/sparql-query; charset=utf-8')
    }

    return this.endpoint.fetch(url, {
      method: 'POST',
      headers,
      body: query
    })
  }

  async postUrlencoded (query, { headers, update = false } = {}) {
    let url = null
    let body = null

    if (!update) {
      url = new URL(this.endpoint.endpointUrl)
      body = 'query=' + encodeURIComponent(query)
    } else {
      url = new URL(this.endpoint.updateUrl)
      body = 'update=' + encodeURIComponent(query)
    }

    headers = this.endpoint.mergeHeaders(headers)

    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/x-www-form-urlencoded')
    }

    return this.client.fetch(url, {
      method: 'POST',
      headers,
      body
    })
  }

  async ask (query, { headers, operation = 'get' } = {}) {
    headers = this.endpoint.mergeHeaders(headers)

    if (!headers.has('accept')) {
      headers.set('accept', 'application/sparql-results+json')
    }

    return this[operation](query, { headers })
  }

  async construct (query, { headers, operation = 'get' } = {}) {
    headers = new this.endpoint.fetch.Headers(headers)

    if (!headers.has('accept')) {
      headers.set('accept', 'application/n-triples')
    }

    return this[operation](query, { headers })
  }

  async select (query, { headers, operation = 'get' } = {}) {
    headers = this.endpoint.mergeHeaders(headers)

    if (!headers.has('accept')) {
      headers.set('accept', 'application/sparql-results+json')
    }

    return this[operation](query, { headers })
  }

  async update (query, { headers, operation = 'postUrlencoded' } = {}) {
    headers = new this.endpoint.fetch.Headers(headers)

    if (!headers.has('accept')) {
      headers.set('accept', '*/*')
    }

    return this[operation](query, { headers, update: true })
  }
}

module.exports = RawQuery
