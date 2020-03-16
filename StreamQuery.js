const N3Parser = require('@rdfjs/parser-n3')
const checkResponse = require('./lib/checkResponse')
const RawQuery = require('./RawQuery')
const ResultParser = require('./ResultParser')

class StreamQuery extends RawQuery {
  constructor ({ endpoint }) {
    super({ endpoint })
  }

  async ask (query, { headers, operation } = {}) {
    const res = await super.ask(query, { headers, operation })

    checkResponse(res)

    const json = await res.json()

    return json.boolean
  }

  async construct (query, { headers, operation } = {}) {
    const res = await super.construct(query, { headers, operation })

    checkResponse(res)

    const parser = new N3Parser({ factory: this.endpoint.factory })

    return parser.import(res.body)
  }

  async select (query, { headers, operation } = {}) {
    const res = await super.select(query, { headers, operation })

    checkResponse(res)

    const parser = new ResultParser({ factory: this.endpoint.factory })

    return res.body.pipe(parser)
  }

  async update (query, { headers, operation } = {}) {
    const res = await super.update(query, { headers, operation })

    checkResponse(res)
  }
}

module.exports = StreamQuery
