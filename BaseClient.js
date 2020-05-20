/**
 * An abstract base client which connects the query, store and endpoint together
 *
 * Store and Query parameters are both optional and only necessary when the client will connect to SPARQL Graph Store
 * or SPARQL Query endpoints respectively
 *
 * @class
 */
class BaseClient {
  /**
   * @param {Object} init
   * @param {Endpoint} init.endpoint object to connect to SPARQL endpoint
   * @param {Query} [init.Query] SPARQL Query/Update executor constructor
   * @param {Store} [init.Store] SPARQL Graph Store connector constructor
   * @param {factory} [init.factory] RDF/JS DataFactory
   * @param {{...(key:value)}} [init.options] any additional arguments passed to Query and Store constructors
   */
  constructor ({ endpoint, Query, Store, factory, ...options }) {
    /** @member {RawQuery} */
    this.query = Query ? new Query({ endpoint, factory, ...options }) : null
    /** @member {StreamStore} */
    this.store = Store ? new Store({ endpoint, factory, ...options }) : null
  }
}

module.exports = BaseClient
