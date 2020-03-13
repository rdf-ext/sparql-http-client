class BaseClient {
  constructor ({ endpoint }) {
    this.endpoint = endpoint
  }

  async ask (query, { headers, operation = 'get' } = {}) {
    headers = this.endpoint.mergeHeaders(headers)

    if (!headers.has('accept')) {
      headers.set('accept', 'application/sparql-results+json')
    }

    return this.endpoint[operation](query, { headers })
  }

  async construct (query, { headers, operation = 'get' } = {}) {
    headers = new this.endpoint.fetch.Headers(headers)

    if (!headers.has('accept')) {
      headers.set('accept', 'application/n-triples')
    }

    return this.endpoint[operation](query, { headers })
  }

  async select (query, { headers, operation = 'get' } = {}) {
    headers = this.endpoint.mergeHeaders(headers)

    if (!headers.has('accept')) {
      headers.set('accept', 'application/sparql-results+json')
    }

    return this.endpoint[operation](query, { headers })
  }

  async update (query, { headers, operation = 'postUrlencoded' } = {}) {
    headers = new this.endpoint.fetch.Headers(headers)

    if (!headers.has('accept')) {
      headers.set('accept', '*/*')
    }

    return this.endpoint[operation](query, { headers, update: true })
  }
}

module.exports = BaseClient
