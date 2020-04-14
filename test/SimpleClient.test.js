const { strictEqual } = require('assert')
const { describe, it } = require('mocha')
const SimpleClient = require('../SimpleClient')
const RawQuery = require('../RawQuery')

describe('SimpleClient', () => {
  it('should be a constructor', () => {
    strictEqual(typeof SimpleClient, 'function')
  })

  it('should use RawQuery to create the query instance', () => {
    const client = new SimpleClient({})

    strictEqual(client.query instanceof RawQuery, true)
  })
})
