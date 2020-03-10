const fetch = require('nodeify-fetch')
const rdf = require('@rdfjs/data-model')
const BaseClient = require('./BaseClient')
const StreamQuery = require('./StreamQuery')
const StreamStore = require('./StreamStore')

class Client extends BaseClient {
  constructor ({ endpointUrl, factory = rdf, headers, password, storeUrl, updateUrl, user }) {
    super({
      endpointUrl,
      factory,
      fetch,
      headers,
      password,
      storeUrl,
      updateUrl,
      user,
      Query: StreamQuery,
      Store: StreamStore
    })
  }
}

module.exports = Client
