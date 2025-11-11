import { strictEqual, throws } from 'node:assert'
import { describe, it } from 'mocha'
import RawQuery from '../RawQuery.js'
import SimpleClient from '../SimpleClient.js'
import { selectQuery, updateQuery } from './support/examples.js'
import * as simpleClientTests from './support/simpleClientTests.js'

describe('SimpleClient', () => {
  it('should be a constructor', () => {
    strictEqual(typeof SimpleClient, 'function')
  })

  it('should throw an error if endpointUrl, storeUrl, or updateUrl is given', () => {
    throws(() => {
      new SimpleClient({}) // eslint-disable-line no-new
    }, {
      message: /endpointUrl/
    })
  })

  it('should use RawQuery to create the query instance', () => {
    const client = new SimpleClient({ endpointUrl: 'test' })

    strictEqual(client.query instanceof RawQuery, true)
  })

  it('should set authorization header if user and password are given', () => {
    const client = new SimpleClient({
      endpointUrl: 'test',
      user: 'abc',
      password: 'def'
    })

    strictEqual(client.headers.get('authorization'), 'Basic YWJjOmRlZg==')
  })

  it('should forward client to Query constructor', () => {
    class Query {
      constructor ({ client }) {
        this.client = client
      }
    }

    const client = new SimpleClient({ endpointUrl: 'test', Query })

    strictEqual(client.query.client, client)
  })

  it('should forward client to Store constructor', () => {
    class Store {
      constructor ({ client }) {
        this.client = client
      }
    }

    const client = new SimpleClient({ endpointUrl: 'test', Store })

    strictEqual(client.store.client, client)
  })

  describe('.get', () => {
    it('should be a method', () => {
      const client = new SimpleClient({ endpointUrl: 'test' })

      strictEqual(typeof client.get, 'function')
    })

    simpleClientTests.shouldReturnResponseObject(async endpointUrl => {
      const client = new SimpleClient({ endpointUrl })

      return await client.postUrlencoded(selectQuery)
    })

    simpleClientTests.shouldSendGetRequest(async endpointUrl => {
      const client = new SimpleClient({ endpointUrl })

      await client.get(selectQuery)
    })

    simpleClientTests.shouldSendQueryStringAsParameter(async (endpointUrl, expected) => {
      const client = new SimpleClient({ endpointUrl })

      await client.get(expected)
    })

    simpleClientTests.shouldKeepExistingQueryParameters(async (endpointUrl, expected) => {
      const [key, value] = Object.entries(expected)[0]
      const client = new SimpleClient({ endpointUrl: `${endpointUrl}?${key}=${value}` })

      await client.get(selectQuery)
    })

    simpleClientTests.shouldSendConstructorHeaders(async (endpointUrl, expected) => {
      const client = new SimpleClient({ endpointUrl, headers: expected })

      await client.get(selectQuery)
    })

    simpleClientTests.shouldSendMethodHeaders(async (endpointUrl, expected) => {
      const client = new SimpleClient({ endpointUrl })

      await client.get(selectQuery, { headers: expected })
    })

    simpleClientTests.shouldPrioritizeMethodHeaders(async (endpointUrl, expected) => {
      const [key, value] = Object.entries(expected)[0]
      const client = new SimpleClient({ endpointUrl, headers: { [key]: `${value} bar` } })

      await client.get(selectQuery, { headers: expected })
    })

    simpleClientTests.shouldSendConstructorParameters(async (endpointUrl, expected) => {
      const client = new SimpleClient({ endpointUrl, parameters: expected })

      await client.get(selectQuery)
    })

    simpleClientTests.shouldSendMethodParameters(async (endpointUrl, expected) => {
      const client = new SimpleClient({ endpointUrl })

      await client.get(selectQuery, { parameters: expected })
    })

    simpleClientTests.shouldMergeMethodParameters(async (endpointUrl, expected) => {
      const [key, value] = Object.entries(expected)[0]
      const client = new SimpleClient({ endpointUrl, parameters: { [key]: `${value} bar` } })

      await client.get(selectQuery, { parameters: expected })
    })

    simpleClientTests.shouldSendUpdateStringAsParameter(async (updateUrl, expected) => {
      const client = new SimpleClient({ updateUrl })

      await client.get(expected, { update: true })
    })

    simpleClientTests.shouldKeepExistingUpdateParameters(async (updateUrl, expected) => {
      const [key, value] = Object.entries(expected)[0]
      const client = new SimpleClient({ updateUrl: `${updateUrl}?${key}=${value}` })

      await client.get(updateQuery, { update: true })
    })

    simpleClientTests.shouldHandlerServerSocketErrors(async endpointUrl => {
      const client = new SimpleClient({ endpointUrl })

      await client.get(selectQuery)
    })

    simpleClientTests.shouldNotHandleServerHttpErrors(async endpointUrl => {
      const client = new SimpleClient({ endpointUrl })

      await client.get(selectQuery)
    })
  })

  describe('.postDirect', () => {
    it('should be a method', () => {
      const client = new SimpleClient({ endpointUrl: 'test' })

      strictEqual(typeof client.postDirect, 'function')
    })

    simpleClientTests.shouldReturnResponseObject(async endpointUrl => {
      const client = new SimpleClient({ endpointUrl })

      return await client.postUrlencoded(selectQuery)
    }, { operation: 'postDirect' })

    simpleClientTests.shouldSendPostRequest(async endpointUrl => {
      const client = new SimpleClient({ endpointUrl })

      await client.postDirect(selectQuery)
    })

    simpleClientTests.shouldSendQueryContent(async (endpointUrl, expected) => {
      const client = new SimpleClient({ endpointUrl })

      await client.postDirect(expected)
    })

    simpleClientTests.shouldKeepExistingQueryParameters(async (endpointUrl, expected) => {
      const [key, value] = Object.entries(expected)[0]
      const client = new SimpleClient({ endpointUrl: `${endpointUrl}?${key}=${value}` })

      await client.postDirect(selectQuery)
    }, { operation: 'postDirect' })

    simpleClientTests.shouldSendConstructorHeaders(async (endpointUrl, expected) => {
      const client = new SimpleClient({ endpointUrl, headers: expected })

      await client.postDirect(selectQuery)
    }, { operation: 'postDirect' })

    simpleClientTests.shouldSendMethodHeaders(async (endpointUrl, expected) => {
      const client = new SimpleClient({ endpointUrl })

      await client.postDirect(selectQuery, { headers: expected })
    }, { operation: 'postDirect' })

    simpleClientTests.shouldPrioritizeMethodHeaders(async (endpointUrl, expected) => {
      const [key, value] = Object.entries(expected)[0]
      const client = new SimpleClient({ endpointUrl, headers: { [key]: `${value} bar` } })

      await client.postDirect(selectQuery, { headers: expected })
    }, { operation: 'postDirect' })

    simpleClientTests.shouldSendConstructorParameters(async (endpointUrl, expected) => {
      const client = new SimpleClient({ endpointUrl, parameters: expected })

      await client.postDirect(selectQuery)
    }, { operation: 'postDirect' })

    simpleClientTests.shouldSendMethodParameters(async (endpointUrl, expected) => {
      const client = new SimpleClient({ endpointUrl })

      await client.postDirect(selectQuery, { parameters: expected })
    }, { operation: 'postDirect' })

    simpleClientTests.shouldMergeMethodParameters(async (endpointUrl, expected) => {
      const [key, value] = Object.entries(expected)[0]
      const client = new SimpleClient({ endpointUrl, parameters: { [key]: `${value} bar` } })

      await client.postDirect(selectQuery, { parameters: expected })
    }, { operation: 'postDirect' })

    simpleClientTests.shouldSendUpdateContent(async (updateUrl, expected) => {
      const client = new SimpleClient({ updateUrl })

      await client.postDirect(expected, { update: true })
    }, { operation: 'postDirect' })

    simpleClientTests.shouldKeepExistingUpdateParameters(async (updateUrl, expected) => {
      const [key, value] = Object.entries(expected)[0]
      const client = new SimpleClient({ updateUrl: `${updateUrl}?${key}=${value}` })

      await client.postDirect(updateQuery, { update: true })
    }, { operation: 'postDirect' })

    simpleClientTests.shouldHandlerServerSocketErrors(async endpointUrl => {
      const client = new SimpleClient({ endpointUrl })

      await client.postDirect(selectQuery)
    }, { operation: 'postDirect' })

    simpleClientTests.shouldNotHandleServerHttpErrors(async endpointUrl => {
      const client = new SimpleClient({ endpointUrl })

      await client.postDirect(selectQuery)
    }, { operation: 'postDirect' })
  })

  describe('.postUrlencoded', () => {
    it('should be a method', () => {
      const client = new SimpleClient({ endpointUrl: 'test' })

      strictEqual(typeof client.postUrlencoded, 'function')
    })

    simpleClientTests.shouldReturnResponseObject(async endpointUrl => {
      const client = new SimpleClient({ endpointUrl })

      return await client.postUrlencoded(selectQuery)
    }, { operation: 'postUrlencoded' })

    simpleClientTests.shouldSendPostRequest(async endpointUrl => {
      const client = new SimpleClient({ endpointUrl })

      await client.postUrlencoded(selectQuery)
    })

    simpleClientTests.shouldSendUrlEncodedQueryContent(async (endpointUrl, expected) => {
      const client = new SimpleClient({ endpointUrl })

      await client.postUrlencoded(expected)
    })

    simpleClientTests.shouldSendConstructorHeaders(async (endpointUrl, expected) => {
      const client = new SimpleClient({ endpointUrl, headers: expected })

      await client.postUrlencoded(selectQuery)
    }, { operation: 'postUrlencoded' })

    simpleClientTests.shouldSendMethodHeaders(async (endpointUrl, expected) => {
      const client = new SimpleClient({ endpointUrl })

      await client.postUrlencoded(selectQuery, { headers: expected })
    }, { operation: 'postUrlencoded' })

    simpleClientTests.shouldPrioritizeMethodHeaders(async (endpointUrl, expected) => {
      const [key, value] = Object.entries(expected)[0]
      const client = new SimpleClient({ endpointUrl, headers: { [key]: `${value} bar` } })

      await client.postUrlencoded(selectQuery, { headers: expected })
    }, { operation: 'postUrlencoded' })

    simpleClientTests.shouldSendConstructorParameters(async (endpointUrl, expected) => {
      const client = new SimpleClient({ endpointUrl, parameters: expected })

      await client.postUrlencoded(selectQuery)
    }, { operation: 'postUrlencoded' })

    simpleClientTests.shouldSendMethodParameters(async (endpointUrl, expected) => {
      const client = new SimpleClient({ endpointUrl })

      await client.postUrlencoded(selectQuery, { parameters: expected })
    }, { operation: 'postUrlencoded' })

    simpleClientTests.shouldMergeMethodParameters(async (endpointUrl, expected) => {
      const [key, value] = Object.entries(expected)[0]
      const client = new SimpleClient({ endpointUrl, parameters: { [key]: `${value} bar` } })

      await client.postUrlencoded(selectQuery, { parameters: expected })
    }, { operation: 'postUrlencoded' })

    simpleClientTests.shouldSendUrlEncodedUpdateContent(async (updateUrl, expected) => {
      const client = new SimpleClient({ updateUrl })

      await client.postUrlencoded(expected, { update: true })
    }, { operation: 'postUrlencoded' })

    simpleClientTests.shouldKeepExistingUpdateParameters(async (updateUrl, expected) => {
      const [key, value] = Object.entries(expected)[0]
      const client = new SimpleClient({ updateUrl: `${updateUrl}?${key}=${value}` })

      await client.postUrlencoded(updateQuery, { update: true })
    }, { operation: 'postUrlencoded' })

    simpleClientTests.shouldHandlerServerSocketErrors(async endpointUrl => {
      const client = new SimpleClient({ endpointUrl })

      await client.postUrlencoded(selectQuery)
    }, { operation: 'postUrlencoded' })

    simpleClientTests.shouldNotHandleServerHttpErrors(async endpointUrl => {
      const client = new SimpleClient({ endpointUrl })

      await client.postUrlencoded(selectQuery)
    }, { operation: 'postUrlencoded' })
  })
})
