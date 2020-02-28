const fetch = require('nodeify-fetch')
const rdf = require('@rdfjs/data-model')
const BaseClient = require('./BaseClient')
const Query = require('./Query')
const Store = require('./Store')

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
      Query,
      Store
    })
  }
}

module.exports = Client
