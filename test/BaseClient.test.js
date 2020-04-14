const { strictEqual } = require('assert')
const { describe, it } = require('mocha')
const BaseClient = require('../BaseClient')

describe('BaseClient', () => {
  it('should be a constructor', () => {
    strictEqual(typeof BaseClient, 'function')
  })

  it('should forward endpoint to Query constructor', () => {
    class Query {
      constructor ({ endpoint }) {
        this.endpoint = endpoint
      }
    }

    const client = new BaseClient({ endpoint: 'test', Query })

    strictEqual(client.query.endpoint, 'test')
  })

  it('should forward factory to Query constructor', () => {
    class Query {
      constructor ({ factory }) {
        this.factory = factory
      }
    }

    const client = new BaseClient({ factory: 'test', Query })

    strictEqual(client.query.factory, 'test')
  })

  it('should forward any other options to Query constructor', () => {
    class Query {
      constructor ({ abc, def }) {
        this.abc = abc
        this.def = def
      }
    }

    const client = new BaseClient({ abc: 'test', def: '1234', Query })

    strictEqual(client.query.abc, 'test')
    strictEqual(client.query.def, '1234')
  })

  it('should forward endpoint to Store constructor', () => {
    class Store {
      constructor ({ endpoint }) {
        this.endpoint = endpoint
      }
    }

    const client = new BaseClient({ endpoint: 'test', Store })

    strictEqual(client.store.endpoint, 'test')
  })

  it('should forward factory to Store constructor', () => {
    class Store {
      constructor ({ factory }) {
        this.factory = factory
      }
    }

    const client = new BaseClient({ factory: 'test', Store })

    strictEqual(client.store.factory, 'test')
  })

  it('should forward any other options to Store constructor', () => {
    class Store {
      constructor ({ abc, def }) {
        this.abc = abc
        this.def = def
      }
    }

    const client = new BaseClient({ abc: 'test', def: '1234', Store })

    strictEqual(client.store.abc, 'test')
    strictEqual(client.store.def, '1234')
  })
})
