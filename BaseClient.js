class BaseClient {
  constructor ({ endpoint, Query, Store, factory }) {
    this.query = Query ? new Query({ endpoint, factory }) : null
    this.store = Store ? new Store({ endpoint, factory }) : null
  }
}

module.exports = BaseClient
