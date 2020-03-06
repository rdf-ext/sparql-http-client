const { strictEqual } = require('assert')
const fetch = require('nodeify-fetch')
const { describe, it } = require('mocha')
const BaseClient = require('../BaseClient')

describe('BaseClient', () => {
  it('should be a constructor', () => {
    strictEqual(typeof BaseClient, 'function')
  })

  it('should set authorization header if user and password are given', () => {
    const client = new BaseClient({ fetch, user: 'abc', password: 'def' })

    strictEqual(client.headers.get('authorization'), 'Basic YWJjOmRlZg==')
  })
})
