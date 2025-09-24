import defaultFactory from '@rdfjs/data-model'
import isDataFactory from './lib/isDataFactory.js'
import SimpleClient from './SimpleClient.js'
import StreamQuery from './StreamQuery.js'
import StreamStore from './StreamStore.js'

/**
 * The default client implementation based on {@link StreamQuery} and {@link StreamStore} parses SPARQL results into
 * Readable streams of RDF/JS Quad objects (CONSTRUCT/DESCRIBE) or Readable streams of objects (SELECT). Graph Store
 * read and write operations are handled using Readable streams.
 *
 * @extends SimpleClient
 * @property {StreamQuery} query
 * @property {StreamStore} store
 *
 * @example
 * // read the height of the Eiffel Tower from Wikidata with a SELECT query
 *
 * import SparqlClient from 'sparql-http-client'
 *
 * const endpointUrl = 'https://query.wikidata.org/sparql'
 * const query = `
 * PREFIX wd: <http://www.wikidata.org/entity/>
 * PREFIX p: <http://www.wikidata.org/prop/>
 * PREFIX ps: <http://www.wikidata.org/prop/statement/>
 * PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
 *
 * SELECT ?value WHERE {
 *   wd:Q243 p:P2048 ?height.
 *
 *   ?height pq:P518 wd:Q24192182;
 *     ps:P2048 ?value .
 * }`
 *
 * const client = new SparqlClient({ endpointUrl })
 * const stream = client.query.select(query)
 *
 * stream.on('data', row => {
 *   for (const [key, value] of Object.entries(row)) {
 *     console.log(`${key}: ${value.value} (${value.termType})`)
 *   }
 * })
 *
 * stream.on('error', err => {
 *   console.error(err)
 * })
 *
 * @example
 * // read all quads from a local triplestore using the Graph Store protocol
 *
 * import rdf from 'rdf-ext'
 * import SparqlClient from 'sparql-http-client'
 *
 * const client = new SparqlClient({
 *   storeUrl: 'http://localhost:3030/test/data',
 *   factory: rdf
 * })
 *
 * const stream = local.store.get(rdf.defaultGraph())
 *
 * stream.on('data', quad => {
 *   console.log(`${quad.subject} ${quad.predicate} ${quad.object}`)
 * })
 */
class StreamClient extends SimpleClient {
  /**
   * @param {Object} options
   * @param {string} [options.endpointUrl] SPARQL query endpoint URL
   * @param {string[]} [options.defaultGraphUri] 
   * @param {string[]} [options.namedGraphUri]
   * @param {factory} [options.factory] RDF/JS factory
   * @param {fetch} [options.fetch=nodeify-fetch] fetch implementation
   * @param {Headers} [options.headers] headers sent with every request
   * @param {string} [options.password] password used for basic authentication
   * @param {string} [options.storeUrl] SPARQL Graph Store URL
   * @param {string} [options.updateUrl] SPARQL update endpoint URL
   * @param {string} [options.user] user used for basic authentication
   */
  constructor ({
    endpointUrl,
    defaultGraphUri,
    namedGraphUri,
    factory = defaultFactory,
    fetch,
    headers,
    password,
    storeUrl,
    updateUrl,
    user
  }) {
    super({
      endpointUrl,
      defaultGraphUri,
      namedGraphUri,
      factory,
      fetch,
      headers,
      password,
      storeUrl,
      updateUrl,
      user,
      Query: StreamQuery,
      Store: StreamStore
    })

    if (!isDataFactory(this.factory)) {
      throw new Error('the given factory doesn\'t implement the DataFactory interface')
    }
  }
}

export default StreamClient
