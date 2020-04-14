const { strictEqual } = require('assert')
const { describe, it } = require('mocha')
const StreamClient = require('../StreamClient')
const StreamQuery = require('../StreamQuery')
const StreamStore = require('../StreamStore')

describe('StreamClient', () => {
  it('should be a constructor', () => {
    strictEqual(typeof StreamClient, 'function')
  })

  it('should use the given factory', () => {
    const factory = 'test'

    const client = new StreamClient({ factory })

    strictEqual(client.query.factory, 'test')
    strictEqual(client.store.factory, 'test')
  })

  it('should use StreamQuery to create the query instance', () => {
    const client = new StreamClient({})

    strictEqual(client.query instanceof StreamQuery, true)
  })

  it('should use StreamStore to create the store instance', () => {
    const client = new StreamClient({})

    strictEqual(client.store instanceof StreamStore, true)
  })

  it('should forward additional options', () => {
    const client = new StreamClient({ maxQuadsPerRequest: 1 })

    strictEqual(client.store.maxQuadsPerRequest, 1)
  })
})
