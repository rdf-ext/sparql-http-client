const { strictEqual } = require('assert')
const fetch = require('nodeify-fetch')
const { describe, it } = require('mocha')
const Endpoint = require('../Endpoint')

describe('Endpoint', () => {
  it('should be a constructor', () => {
    strictEqual(typeof Endpoint, 'function')
  })

  it('should set authorization header if user and password are given', () => {
    const client = new Endpoint({ fetch, user: 'abc', password: 'def' })

    strictEqual(client.headers.get('authorization'), 'Basic YWJjOmRlZg==')
  })
})
