import DataModelFactory from '@rdfjs/data-model/Factory.js'
import DatasetFactory from '@rdfjs/dataset/Factory.js'
import Environment from '@rdfjs/environment'
import isDatasetCoreFactory from './lib/isDatasetCoreFactory.js'
import ParsingQuery from './ParsingQuery.js'
import SimpleClient from './SimpleClient.js'

const defaultFactory = new Environment([DataModelFactory, DatasetFactory])

/**
 * A client implementation based on {@link ParsingQuery} that parses SPARQL results into RDF/JS DatasetCore objects
 * (CONSTRUCT/DESCRIBE) or an array of objects (SELECT). It does not provide a store interface.
 *
 * @extends SimpleClient
 * @property {ParsingQuery} query
 *
 * @example
 * // read the height of the Eiffel Tower from Wikidata with a SELECT query
 *
 * import ParsingClient from 'sparql-http-client/ParsingClient.js'
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
 * const client = new ParsingClient({ endpointUrl })
 * const result = await client.query.select(query)
 *
 * for (const row of result) {
 *   for (const [key, value] of Object.entries(row)) {
 *     console.log(`${key}: ${value.value} (${value.termType})`)
 *   }
 * }
 */
class ParsingClient extends SimpleClient {
  /**
   * @param {Object} options
   * @param {string} [options.endpointUrl] SPARQL query endpoint URL
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
      factory,
      fetch,
      headers,
      password,
      storeUrl,
      updateUrl,
      user,
      Query: ParsingQuery
    })

    if (!isDatasetCoreFactory(this.factory)) {
      throw new Error('the given factory doesn\'t implement the DatasetCoreFactory interface')
    }
  }
}

export default ParsingClient
