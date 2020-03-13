const { array } = require('get-stream')
const StreamClient = require('./StreamClient')

class SimpleClient extends StreamClient {
  constructor ({ endpoint }) {
    super({ endpoint })
  }

  async construct (query, options = {}) {
    const stream = await super.construct(query, options)

    return array(stream)
  }

  async select (query, options = {}) {
    const stream = await super.select(query, options)

    return array(stream)
  }
}

module.exports = SimpleClient
