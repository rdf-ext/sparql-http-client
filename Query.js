const N3Parser = require('@rdfjs/parser-n3')
const checkResponse = require('./lib/checkResponse')
const RawQuery = require('./RawQuery')
const ResultParser = require('./ResultParser')

class Query extends RawQuery {
  constructor ({ client }) {
    super({ client })
  }

  async ask (query, { headers } = {}) {
    const res = await super.ask(query, { headers })

    checkResponse(res)

    const json = await res.json()

    return json.boolean
  }

  async construct (query, { headers } = {}) {
    const res = await super.construct(query, { headers })

    checkResponse(res)

    const parser = new N3Parser({ factory: this.client.factory })

    return parser.import(res.body)
  }

  async select (query, { headers } = {}) {
    const res = await super.select(query, { headers })

    checkResponse(res)

    const parser = new ResultParser({ factory: this.client.factory })

    return res.body.pipe(parser)
  }

  async update (query, { headers } = {}) {
    const res = await super.update(query, { headers })

    checkResponse(res)
  }
}

module.exports = Query
