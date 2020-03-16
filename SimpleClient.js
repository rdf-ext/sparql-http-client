const Endpoint = require('./Endpoint')
const SimpleQuery = require('./SimpleQuery')
const BaseClient = require('./BaseClient')

class SimpleClient extends BaseClient {
  constructor (options) {
    super({
      endpoint: new Endpoint(options),
      factory: options.factory,
      Query: SimpleQuery
    })
  }
}

module.exports = SimpleClient
