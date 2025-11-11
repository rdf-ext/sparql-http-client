import { strictEqual } from 'node:assert'
import { describe, it } from 'mocha'
import chunks from 'stream-chunks/chunks.js'
import StreamQuery from '../StreamQuery.js'
import { askQuery, constructQuery, selectQuery, updateQuery } from './support/examples.js'
import * as queryTests from './support/streamQueryTests.js'

describe('StreamQuery', () => {
  describe('.ask', () => {
    it('should be a method', () => {
      const query = new StreamQuery({})

      strictEqual(typeof query.ask, 'function')
    })

    queryTests.shouldForwardQueryString(async (query, expected) => {
      await query.ask(expected)
    }, { method: 'ask' })

    queryTests.shouldForwardHeaders(async (query, expected) => {
      await query.ask(askQuery, { headers: expected })
    }, { method: 'ask' })

    queryTests.shouldForwardOperation(async (query, expected) => {
      await query.ask(askQuery, { operation: expected })
    }, { method: 'ask' })

    queryTests.shouldForwardParameters(async (query, expected) => {
      await query.ask(askQuery, { parameters: expected })
    }, { method: 'ask' })

    queryTests.shouldReturnBoolean(async query => {
      return await query.ask(askQuery)
    })

    queryTests.shouldParseBooleanSparqlJson(async query => {
      return await query.ask(askQuery)
    })

    queryTests.shouldCheckResponseStatus(async query => {
      return await query.ask(askQuery)
    })
  })

  describe('.construct', () => {
    it('should be a method', () => {
      const query = new StreamQuery({})

      strictEqual(typeof query.construct, 'function')
    })

    queryTests.shouldForwardQueryString(async (query, expected) => {
      await chunks(await query.construct(expected))
    }, { method: 'construct' })

    queryTests.shouldForwardHeaders(async (query, expected) => {
      await chunks(await query.construct(constructQuery, { headers: expected }))
    }, { method: 'construct' })

    queryTests.shouldForwardOperation(async (query, expected) => {
      await chunks(await query.construct(constructQuery, { operation: expected }))
    }, { method: 'construct' })

    queryTests.shouldForwardParameters(async (query, expected) => {
      await chunks(await query.construct(constructQuery, { parameters: expected }))
    }, { method: 'construct' })

    queryTests.shouldReturnReadableStream(async query => {
      return await query.construct(constructQuery)
    }, { method: 'construct' })

    queryTests.shouldParseNTriples(async query => {
      return await query.construct(constructQuery)
    })

    queryTests.shouldCheckStreamResponseStatus(async query => {
      return await query.construct(constructQuery)
    }, { method: 'construct' })

    queryTests.shouldUseCustomConstructFactory(async query => {
      return await query.construct(constructQuery)
    })
  })

  describe('.select', () => {
    it('should be a method', () => {
      const query = new StreamQuery({})

      strictEqual(typeof query.select, 'function')
    })

    queryTests.shouldForwardQueryString(async (query, expected) => {
      await chunks(await query.select(expected))
    }, { method: 'select' })

    queryTests.shouldForwardHeaders(async (query, expected) => {
      await chunks(await query.select(selectQuery, { headers: expected }))
    }, { method: 'select' })

    queryTests.shouldForwardOperation(async (query, expected) => {
      await chunks(await query.select(selectQuery, { operation: expected }))
    }, { method: 'select' })

    queryTests.shouldForwardParameters(async (query, expected) => {
      await chunks(await query.select(selectQuery, { parameters: expected }))
    }, { method: 'select' })

    queryTests.shouldReturnReadableStream(async query => {
      return await query.select(selectQuery)
    }, { method: 'select' })

    queryTests.shouldParseTableSparqlJson(async query => {
      return await query.select(selectQuery)
    })

    queryTests.shouldCheckStreamResponseStatus(async query => {
      return await query.select(selectQuery)
    }, { method: 'select' })

    queryTests.shouldUseCustomSelectFactory(async query => {
      return await query.select(selectQuery)
    })
  })

  describe('.update', () => {
    it('should be a method', () => {
      const query = new StreamQuery({})

      strictEqual(typeof query.update, 'function')
    })

    queryTests.shouldForwardQueryString(async (query, expected) => {
      await query.update(expected)
    }, { method: 'update' })

    queryTests.shouldForwardHeaders(async (query, expected) => {
      await query.update(updateQuery, { headers: expected })
    }, { method: 'update' })

    queryTests.shouldForwardOperation(async (query, expected) => {
      await query.update(updateQuery, { operation: expected })
    }, { method: 'update' })

    queryTests.shouldForwardParameters(async (query, expected) => {
      await query.update(updateQuery, { parameters: expected })
    }, { method: 'update' })

    queryTests.shouldCheckStreamResponseStatus(async query => {
      return await query.update(updateQuery)
    }, { method: 'update' })
  })
})
