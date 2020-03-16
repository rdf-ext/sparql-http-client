class BaseClient {
  constructor ({ endpoint, Query, Store }) {
    this.query = Query ? new Query({ endpoint }) : null
    this.store = Store ? new Store({ endpoint }) : null
  }
}

module.exports = BaseClient
