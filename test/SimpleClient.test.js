import { strictEqual } from 'assert'
import { describe, it } from 'mocha'
import SimpleClient from '../SimpleClient.js'
import RawQuery from '../RawQuery.js'

describe('SimpleClient', () => {
  it('should be a constructor', () => {
    strictEqual(typeof SimpleClient, 'function')
  })

  it('should use RawQuery to create the query instance', () => {
    const client = new SimpleClient({})

    strictEqual(client.query instanceof RawQuery, true)
  })
})
