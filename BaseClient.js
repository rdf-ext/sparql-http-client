class BaseClient {
  constructor ({ endpoint, Query, Store, factory, ...options }) {
    this.query = Query ? new Query({ endpoint, factory, ...options }) : null
    this.store = Store ? new Store({ endpoint, factory, ...options }) : null
  }
}

module.exports = BaseClient
