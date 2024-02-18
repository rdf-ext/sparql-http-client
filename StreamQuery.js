import N3Parser from '@rdfjs/parser-n3'
import asyncToReadabe from './lib/asyncToReadabe.js'
import checkResponse from './lib/checkResponse.js'
import mergeHeaders from './lib/mergeHeaders.js'
import RawQuery from './RawQuery.js'
import ResultParser from './ResultParser.js'

/**
 * A query implementation based on {@link RawQuery} that parses SPARQL results into Readable streams of RDF/JS Quad
 * objects (CONSTRUCT/DESCRIBE) or Readable streams of objects (SELECT).
 *
 * @extends RawQuery
 */
class StreamQuery extends RawQuery {
  /**
   * Sends a request for a ASK query
   *
   * @param {string} query ASK query
   * @param {Object} [options]
   * @param {Headers} [options.headers] additional request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [options.operation='get'] SPARQL Protocol operation
   * @return {Promise<boolean>}
   */
  async ask (query, { headers, operation } = {}) {
    const res = await super.ask(query, { headers, operation })

    await checkResponse(res)

    const json = await res.json()

    return json.boolean
  }

  /**
   * Sends a request for a CONSTRUCT or DESCRIBE query
   *
   * @param {string} query CONSTRUCT or DESCRIBE query
   * @param {Object} [options]
   * @param {Headers} [options.headers] additional request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [options.operation='get'] SPARQL Protocol operation
   * @return {Readable}
   */
  construct (query, { headers, operation } = {}) {
    return asyncToReadabe(async () => {
      headers = mergeHeaders(headers)

      if (!headers.has('accept')) {
        headers.set('accept', 'application/n-triples, text/turtle')
      }

      const res = await super.construct(query, { headers, operation })

      await checkResponse(res)

      const parser = new N3Parser({ factory: this.client.factory })

      return parser.import(res.body)
    })
  }

  /**
   * Sends a request for a SELECT query
   *
   * @param {string} query SELECT query
   * @param {Object} [options]
   * @param {Headers} [options.headers] additional request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [options.operation='get'] SPARQL Protocol operation
   * @return {Readable}
   */
  select (query, { headers, operation } = {}) {
    return asyncToReadabe(async () => {
      const res = await super.select(query, { headers, operation })

      await checkResponse(res)

      const parser = new ResultParser({ factory: this.client.factory })

      return res.body.pipe(parser)
    })
  }

  /**
   * Sends a request for an update query
   *
   * @param {string} query update query
   * @param {Object} [options]
   * @param {Headers} [options.headers] additional request headers
   * @param {'get'|'postUrlencoded'|'postDirect'} [options.operation='postUrlencoded'] SPARQL Protocol operation
   * @return {Promise<void>}
   */
  async update (query, { headers, operation } = {}) {
    const res = await super.update(query, { headers, operation })

    await checkResponse(res)
  }
}

export default StreamQuery
