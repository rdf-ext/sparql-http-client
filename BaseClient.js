const RawQuery = require('./RawQuery')

class BaseClient {
  constructor ({ endpointUrl, factory, fetch, headers, password, storeUrl, updateUrl, user, Query = RawQuery, Store }) {
    this.endpointUrl = endpointUrl
    this.factory = factory
    this.fetch = fetch
    this.headers = new this.fetch.Headers(headers)
    this.storeUrl = storeUrl
    this.updateUrl = updateUrl

    if (typeof user === 'string' && typeof password === 'string') {
      this.headers.set('authorization', 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64'))
    }

    this.query = Query ? new Query({ client: this }) : null
    this.store = Store ? new Store({ client: this }) : null
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

module.exports = BaseClient
