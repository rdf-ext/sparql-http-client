const Endpoint = require('./Endpoint')
const ParsingQuery = require('./ParsingQuery')
const BaseClient = require('./BaseClient')

class ParsingClient extends BaseClient {
  constructor (options) {
    super({
      endpoint: new Endpoint(options),
      factory: options.factory,
      Query: ParsingQuery
    })
  }
}

module.exports = ParsingClient
