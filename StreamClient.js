const BaseClient = require('./BaseClient')
const Endpoint = require('./Endpoint')
const StreamQuery = require('./StreamQuery')
const StreamStore = require('./StreamStore')

class StreamClient extends BaseClient {
  constructor (options) {
    super({
      endpoint: new Endpoint(options),
      Query: StreamQuery,
      Store: StreamStore
    })
  }
}

module.exports = StreamClient
