const BaseClient = require('./BaseClient')
const Endpoint = require('./Endpoint')
const StreamQuery = require('./StreamQuery')
const StreamStore = require('./StreamStore')

class StreamClient extends BaseClient {
  constructor (options) {
    super({
      endpoint: new Endpoint(options),
      factory: options.factory,
      Query: StreamQuery,
      Store: StreamStore,
      ...options
    })
  }
}

module.exports = StreamClient
