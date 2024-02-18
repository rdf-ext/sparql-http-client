import { deepStrictEqual, strictEqual, throws } from 'node:assert'
import DataModelFactory from '@rdfjs/data-model/Factory.js'
import Environment from '@rdfjs/environment'
import omit from 'lodash/omit.js'
import pick from 'lodash/pick.js'
import { describe, it } from 'mocha'
import ParsingClient from '../ParsingClient.js'
import ParsingQuery from '../ParsingQuery.js'
import SimpleClient from '../SimpleClient.js'

describe('ParsingClient', () => {
  it('should be a constructor', () => {
    strictEqual(typeof ParsingClient, 'function')
  })

  it('should throw an error if the given factory does not implement the DatasetCoreFactory interface', () => {
    throws(() => {
      new ParsingClient({ // eslint-disable-line no-new
        endpointUrl: 'test',
        factory: new Environment([DataModelFactory])
      })
    }, {
      message: /DatasetCoreFactory/
    })
  })

  it('should use StreamQuery to create the query instance', () => {
    const client = new ParsingClient({ endpointUrl: 'test' })

    strictEqual(client.query instanceof ParsingQuery, true)
  })

  it('should forward the client to the query instance', () => {
    const client = new ParsingClient({ endpointUrl: 'test' })

    strictEqual(client.query.client, client)
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
    const client = new ParsingClient(simpleClient)
    const result = pick(client, Object.keys(options))

    deepStrictEqual(omit(result, 'headers'), omit(options, 'headers'))
    deepStrictEqual([...result.headers.entries()], [...simpleClient.headers.entries()])
  })
})
