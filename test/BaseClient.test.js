const { strictEqual } = require('assert')
const fetch = require('nodeify-fetch')
const { describe, it } = require('mocha')
const BaseClient = require('../BaseClient')
const RawQuery = require('../RawQuery')

describe('BaseClient', () => {
  it('should be a constructor', () => {
    strictEqual(typeof BaseClient, 'function')
  })

  it('should set authorization header if user and password are given', () => {
    const client = new BaseClient({ fetch, user: 'abc', password: 'def' })

    strictEqual(client.headers.get('authorization'), 'Basic YWJjOmRlZg==')
  })

  describe('.query', () => {
    it('should be an object of type RawQuery', () => {
      const client = new BaseClient({ fetch })

      strictEqual(typeof client.query, 'object')
      strictEqual(client.query instanceof RawQuery, true)
    })
  })
})
