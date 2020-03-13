class Endpoint {
  constructor ({ endpointUrl, factory, fetch, headers, password, storeUrl, updateUrl, user }) {
    this.endpointUrl = endpointUrl
    this.factory = factory
    this.fetch = fetch
    this.headers = new this.fetch.Headers(headers)
    this.storeUrl = storeUrl
    this.updateUrl = updateUrl

    if (typeof user === 'string' && typeof password === 'string') {
      this.headers.set('authorization', 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64'))
    }
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
