const { array } = require('get-stream')
const StreamQuery = require('./StreamQuery')

class ParsingQuery extends StreamQuery {
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

module.exports = ParsingQuery
