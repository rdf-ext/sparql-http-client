import { deepStrictEqual, strictEqual, throws } from 'node:assert'
import omit from 'lodash/omit.js'
import pick from 'lodash/pick.js'
import { describe, it } from 'mocha'
import SimpleClient from '../SimpleClient.js'
import StreamClient from '../StreamClient.js'
import StreamQuery from '../StreamQuery.js'
import StreamStore from '../StreamStore.js'

describe('StreamClient', () => {
  it('should be a constructor', () => {
    strictEqual(typeof StreamClient, 'function')
  })

  it('should throw an error if the given factory does not implement the DataFactory interface', () => {
    throws(() => {
      new StreamClient({ // eslint-disable-line no-new
        endpointUrl: 'test',
        factory: {}
      })
    }, {
      message: /DataFactory/
    })
  })

  it('should use StreamQuery to create the query instance', () => {
    const client = new StreamClient({ endpointUrl: 'test' })

    strictEqual(client.query instanceof StreamQuery, true)
  })

  it('should forward the client to the query instance', () => {
    const client = new StreamClient({ endpointUrl: 'test' })

    strictEqual(client.query.client, client)
  })

  it('should use StreamStore to create the store instance', () => {
    const client = new StreamClient({ endpointUrl: 'test' })

    strictEqual(client.store instanceof StreamStore, true)
  })

  it('should forward the client to the store instance', () => {
    const client = new StreamClient({ endpointUrl: 'test' })

    strictEqual(client.store.client, client)
  })

  it('should be possible to create an instance from a SimpleClient', () => {
    const options = {
      endpointUrl: 'sparql',
      headers: new Headers({ 'user-agent': 'sparql-http-client' }),
      password: 'pwd',
      storeUrl: 'graph',
      updateUrl: 'update',
      user: 'usr'
    }

    const simpleClient = new SimpleClient(options)
    const client = new StreamClient(simpleClient)
    const result = pick(client, Object.keys(options))

    deepStrictEqual(omit(result, 'headers'), omit(options, 'headers'))
    deepStrictEqual([...result.headers.entries()], [...simpleClient.headers.entries()])
  })
})
