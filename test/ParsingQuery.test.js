import { strictEqual } from 'node:assert'
import { describe, it } from 'mocha'
import ParsingQuery from '../ParsingQuery.js'
import { constructQuery, selectQuery } from './support/examples.js'
import * as queryTests from './support/parsingQueryTests.js'

describe('ParsingQuery', () => {
  describe('.construct', () => {
    it('should be a method', () => {
      const query = new ParsingQuery({})

      strictEqual(typeof query.construct, 'function')
    })

    queryTests.shouldForwardQueryString(async (query, expected) => {
      await query.construct(expected)
    }, { method: 'construct' })

    queryTests.shouldForwardHeaders(async (query, expected) => {
      await query.construct(constructQuery, { headers: expected })
    }, { method: 'construct' })

    queryTests.shouldForwardOperation(async (query, expected) => {
      await query.construct(constructQuery, { operation: expected })
    }, { method: 'construct' })

    queryTests.shouldForwardParameters(async (query, expected) => {
      await query.construct(constructQuery, { parameters: expected })
    }, { method: 'construct' })

    queryTests.shouldReturnDatasetCore(async query => {
      return await query.construct(constructQuery)
    })

    queryTests.shouldParseNTriples(async query => {
      return await query.construct(constructQuery)
    })

    queryTests.shouldUseCustomConstructFactory(async query => {
      await query.construct(constructQuery)
    })
  })

  describe('.select', () => {
    it('should be a method', () => {
      const query = new ParsingQuery({})

      strictEqual(typeof query.select, 'function')
    })

    queryTests.shouldForwardQueryString(async (query, expected) => {
      await query.select(expected)
    }, { method: 'select' })

    queryTests.shouldForwardHeaders(async (query, expected) => {
      await query.select(selectQuery, { headers: expected })
    }, { method: 'select' })

    queryTests.shouldForwardOperation(async (query, expected) => {
      await query.select(selectQuery, { operation: expected })
    }, { method: 'select' })

    queryTests.shouldForwardParameters(async (query, expected) => {
      await query.select(selectQuery, { parameters: expected })
    }, { method: 'select' })

    queryTests.shouldReturnArray(async query => {
      return await query.select(constructQuery)
    })

    queryTests.shouldParseTableSparqlJson(async query => {
      return await query.select(constructQuery)
    })
  })
})
