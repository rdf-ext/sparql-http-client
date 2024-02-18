import { strictEqual } from 'node:assert'
import { describe, it } from 'mocha'
import * as index from '../index.js'
import ParsingClient from '../ParsingClient.js'
import ParsingQuery from '../ParsingQuery.js'
import RawQuery from '../RawQuery.js'
import ResultParser from '../ResultParser.js'
import SimpleClient from '../SimpleClient.js'
import StreamClient from '../StreamClient.js'
import StreamQuery from '../StreamQuery.js'
import StreamStore from '../StreamStore.js'

// TODO: remove all awaits that are not required

describe('sparql-http-client', () => {
  it('should export the StreamClient as default export', () => {
    strictEqual(index.default, StreamClient)
  })

  it('should export the ParsingClient', () => {
    strictEqual(index.ParsingClient, ParsingClient)
  })

  it('should export the ParsingQuery', () => {
    strictEqual(index.ParsingQuery, ParsingQuery)
  })

  it('should export the RawQuery', () => {
    strictEqual(index.RawQuery, RawQuery)
  })

  it('should export the ResultParser', () => {
    strictEqual(index.ResultParser, ResultParser)
  })

  it('should export the SimpleClient', () => {
    strictEqual(index.SimpleClient, SimpleClient)
  })

  it('should export the StreamClient', () => {
    strictEqual(index.StreamClient, StreamClient)
  })

  it('should export the StreamQuery', () => {
    strictEqual(index.StreamQuery, StreamQuery)
  })

  it('should export the StreamStore', () => {
    strictEqual(index.StreamStore, StreamStore)
  })
})
