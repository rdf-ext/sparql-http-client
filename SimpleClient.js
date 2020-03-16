const Endpoint = require('./Endpoint')
const SimpleQuery = require('./SimpleQuery')
const BaseClient = require('./BaseClient')

class SimpleClient extends BaseClient {
  constructor (options) {
    super({
      endpoint: new Endpoint(options),
      Query: SimpleQuery
    })
  }
}

module.exports = SimpleClient
