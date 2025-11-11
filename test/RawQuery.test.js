import { strictEqual } from 'node:assert'
import { describe, it } from 'mocha'
import RawQuery from '../RawQuery.js'
import { askQuery, constructQuery, selectQuery, updateQuery } from './support/examples.js'
import * as queryTests from './support/rawQueryTests.js'

describe('RawQuery', () => {
  it('should be a constructor', () => {
    strictEqual(typeof RawQuery, 'function')
  })

  describe('.ask', () => {
    it('should be a method', () => {
      const query = new RawQuery({})

      strictEqual(typeof query.ask, 'function')
    })

    queryTests.shouldUseGetOperation(async client => {
      const query = new RawQuery({ client })

      await query.ask(askQuery)
    })

    queryTests.shouldForwardReturnObject(async client => {
      const query = new RawQuery({ client })

      return query.ask(askQuery)
    }, { operation: 'get' })

    queryTests.shouldForwardQuery(async (client, expected) => {
      const query = new RawQuery({ client })

      await query.ask(expected)
    }, { operation: 'get' })

    queryTests.shouldForwardHeaders(async (client, headers) => {
      const query = new RawQuery({ client })

      await query.ask(askQuery, { headers })
    }, { operation: 'get' })

    queryTests.shouldSetAcceptHeader(async client => {
      const query = new RawQuery({ client })

      await query.ask(askQuery)
    }, { mediaType: 'application/sparql-results+json', operation: 'get' })

    queryTests.shouldNotOverwriteAcceptHeader(async (client, mediaType) => {
      const query = new RawQuery({ client })

      await query.ask(askQuery, { headers: { accept: mediaType } })
    }, { operation: 'get' })

    queryTests.shouldForwardParameters(async (client, parameters) => {
      const query = new RawQuery({ client })

      await query.ask(askQuery, { parameters })
    }, { operation: 'get' })

    queryTests.shouldUseGivenOperation(async (client, operation) => {
      const query = new RawQuery({ client })

      await query.ask(askQuery, { operation })
    }, { operation: 'postUrlencoded' })
  })

  describe('.construct', () => {
    it('should be a method', () => {
      const query = new RawQuery({})

      strictEqual(typeof query.construct, 'function')
    })

    queryTests.shouldUseGetOperation(async client => {
      const query = new RawQuery({ client })

      await query.construct(constructQuery)
    })

    queryTests.shouldForwardReturnObject(async client => {
      const query = new RawQuery({ client })

      return query.construct(constructQuery)
    }, { operation: 'get' })

    queryTests.shouldForwardQuery(async (client, expected) => {
      const query = new RawQuery({ client })

      await query.construct(expected)
    }, { operation: 'get' })

    queryTests.shouldForwardHeaders(async (client, headers) => {
      const query = new RawQuery({ client })

      await query.construct(constructQuery, { headers })
    }, { operation: 'get' })

    queryTests.shouldSetAcceptHeader(async client => {
      const query = new RawQuery({ client })

      await query.construct(constructQuery)
    }, { mediaType: 'application/n-triples, text/turtle', operation: 'get' })

    queryTests.shouldNotOverwriteAcceptHeader(async (client, mediaType) => {
      const query = new RawQuery({ client })

      await query.construct(constructQuery, { headers: { accept: mediaType } })
    }, { operation: 'get' })

    queryTests.shouldForwardParameters(async (client, parameters) => {
      const query = new RawQuery({ client })

      await query.construct(constructQuery, { parameters })
    }, { operation: 'get' })

    queryTests.shouldUseGivenOperation(async (client, operation) => {
      const query = new RawQuery({ client })

      await query.construct(constructQuery, { operation })
    }, { operation: 'postUrlencoded' })
  })

  describe('.select', () => {
    it('should be a method', () => {
      const query = new RawQuery({})

      strictEqual(typeof query.select, 'function')
    })

    queryTests.shouldUseGetOperation(async client => {
      const query = new RawQuery({ client })

      await query.select(selectQuery)
    })

    queryTests.shouldForwardReturnObject(async client => {
      const query = new RawQuery({ client })

      return query.select(selectQuery)
    }, { operation: 'get' })

    queryTests.shouldForwardQuery(async (client, expected) => {
      const query = new RawQuery({ client })

      await query.select(expected)
    }, { operation: 'get' })

    queryTests.shouldForwardHeaders(async (client, headers) => {
      const query = new RawQuery({ client })

      await query.select(selectQuery, { headers })
    }, { operation: 'get' })

    queryTests.shouldSetAcceptHeader(async client => {
      const query = new RawQuery({ client })

      await query.select(selectQuery)
    }, { mediaType: 'application/sparql-results+json', operation: 'get' })

    queryTests.shouldNotOverwriteAcceptHeader(async (client, mediaType) => {
      const query = new RawQuery({ client })

      await query.select(selectQuery, { headers: { accept: mediaType } })
    }, { operation: 'get' })

    queryTests.shouldForwardParameters(async (client, parameters) => {
      const query = new RawQuery({ client })

      await query.select(selectQuery, { parameters })
    }, { operation: 'get' })

    queryTests.shouldUseGivenOperation(async (client, operation) => {
      const query = new RawQuery({ client })

      await query.select(selectQuery, { operation })
    }, { operation: 'postUrlencoded' })
  })

  describe('.update', () => {
    it('should be a method', () => {
      const query = new RawQuery({})

      strictEqual(typeof query.update, 'function')
    })

    queryTests.shouldUsePostUrlencodedOperation(async client => {
      const query = new RawQuery({ client })

      await query.update(updateQuery)
    })

    queryTests.shouldForwardReturnObject(async client => {
      const query = new RawQuery({ client })

      return query.update(updateQuery)
    }, { operation: 'postUrlencoded' })

    queryTests.shouldForwardQuery(async (client, expected) => {
      const query = new RawQuery({ client })

      await query.update(expected)
    }, { operation: 'postUrlencoded' })

    queryTests.shouldForwardHeaders(async (client, headers) => {
      const query = new RawQuery({ client })

      await query.update(updateQuery, { headers })
    }, { operation: 'postUrlencoded' })

    queryTests.shouldSetAcceptHeader(async client => {
      const query = new RawQuery({ client })

      await query.update(updateQuery)
    }, { mediaType: '*/*', operation: 'postUrlencoded' })

    queryTests.shouldNotOverwriteAcceptHeader(async (client, mediaType) => {
      const query = new RawQuery({ client })

      await query.update(updateQuery, { headers: { accept: mediaType } })
    }, { operation: 'postUrlencoded' })

    queryTests.shouldForwardParameters(async (client, parameters) => {
      const query = new RawQuery({ client })

      await query.update(updateQuery, { parameters })
    }, { operation: 'postUrlencoded' })

    queryTests.shouldUseGivenOperation(async (client, operation) => {
      const query = new RawQuery({ client })

      await query.update(updateQuery, { operation })
    }, { operation: 'get' })
  })
})
