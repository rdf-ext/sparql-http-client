const { URL } = require('universal-url')

class RawQuery {
  constructor ({ client }) {
    this.client = client
  }

  async get (query, { headers, update = false } = {}) {
    let url = null

    if (!update) {
      url = new URL(this.client.endpointUrl)
      url.searchParams.append('query', query)
    } else {
      url = new URL(this.client.updateUrl)
      url.searchParams.append('update', query)
    }

    return this.client.fetch(url.toString().replace(/\+/g, '%20'), {
      method: 'GET',
      headers: this.client.mergeHeaders(headers)
    })
  }

  async postDirect (query, { headers, update = false } = {}) {
    let url = null

    if (!update) {
      url = new URL(this.client.endpointUrl)
    } else {
      url = new URL(this.client.updateUrl)
    }

    headers = this.client.mergeHeaders(headers)

    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/sparql-query; charset=utf-8')
    }

    return this.client.fetch(url, {
      method: 'POST',
      headers,
      body: query
    })
  }

  async postUrlencoded (query, { headers, update = false } = {}) {
    let url = null
    let body = null

    if (!update) {
      url = new URL(this.client.endpointUrl)
      body = 'query=' + encodeURIComponent(query)
    } else {
      url = new URL(this.client.updateUrl)
      body = 'update=' + encodeURIComponent(query)
    }

    headers = this.client.mergeHeaders(headers)

    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/x-www-form-urlencoded')
    }

    return this.client.fetch(url, {
      method: 'POST',
      headers,
      body
    })
  }

  async ask (query, { headers } = {}) {
    headers = this.client.mergeHeaders(headers)

    if (!headers.has('accept')) {
      headers.set('accept', 'application/sparql-results+json')
    }

    return this.get(query, { headers })
  }

  async construct (query, { headers } = {}) {
    headers = new this.client.fetch.Headers(headers)

    if (!headers.has('accept')) {
      headers.set('accept', 'application/n-triples')
    }

    return this.get(query, { headers })
  }

  async select (query, { headers } = {}) {
    headers = this.client.mergeHeaders(headers)

    if (!headers.has('accept')) {
      headers.set('accept', 'application/sparql-results+json')
    }

    return this.get(query, { headers })
  }

  async update (query, { headers } = {}) {
    headers = new this.client.fetch.Headers(headers)

    if (!headers.has('accept')) {
      headers.set('accept', '*/*')
    }

    return this.postUrlencoded(query, { headers, update: true })
  }
}

module.exports = RawQuery
