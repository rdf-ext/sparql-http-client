const { strictEqual } = require('assert')
const fetch = require('nodeify-fetch')
const { describe, it } = require('mocha')
const SimpleClient = require('../SimpleClient')
const RawQuery = require('../RawQuery')

describe('SimpleClient', () => {
  it('should be a constructor', () => {
    strictEqual(typeof SimpleClient, 'function')
  })

  describe('.query', () => {
    it('should be an object of type RawQuery', () => {
      const client = new SimpleClient({ fetch })

      strictEqual(typeof client.query, 'object')
      strictEqual(client.query instanceof RawQuery, true)
    })
  })
})
