const Endpoint = require('./Endpoint')
const RawQuery = require('./RawQuery')
const BaseClient = require('./BaseClient')

class SimpleClient extends BaseClient {
  constructor (options) {
    super({
      endpoint: new Endpoint(options),
      factory: options.factory,
      Query: RawQuery
    })
  }
}

module.exports = SimpleClient