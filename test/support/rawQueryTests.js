import { deepStrictEqual, strictEqual } from 'node:assert'
import { it } from 'mocha'
import SimpleClient from '../../SimpleClient.js'

function createClient ({ ...options } = {}) {
  const client = new SimpleClient({
    endpointUrl: 'http://localhost/',
    updateUrl: 'http://localhost/'
  })

  for (const [key, value] of Object.entries(options)) {
    client[key] = value
  }

  return client
}

function shouldForwardHeaders (func, { operation } = {}) {
  it('should forward the headers argument to the client', async () => {
    const key = 'authorization'
    const value = 'Bearer foo'
    const client = createClient({
      [operation]: async (query, { headers }) => {
        strictEqual(headers.get(key), value)
      }
    })

    await func(client, { [key]: value })
  })
}

function shouldForwardParameters (func, { operation } = {}) {
  it('should forward the parameters argument to the client', async () => {
    const key = 'auth_token'
    const value = '12345'
    const client = createClient({
      [operation]: async (query, { parameters }) => {
        strictEqual(parameters.get(key), value)
      }
    })

    await func(client, { [key]: value })
  })
}

function shouldForwardQuery (func, { operation } = {}) {
  it('should forward the query argument to the client', async () => {
    const expected = '12345'

    const client = createClient({
      [operation]: async query => {
        strictEqual(query, expected)
      }
    })

    await func(client, expected)
  })
}

function shouldForwardReturnObject (func, { operation } = {}) {
  it('should forward the return object from the client', async () => {
    const expected = '12345'

    const client = createClient({
      [operation]: async () => expected
    })

    const res = await func(client)

    strictEqual(res, expected)
  })
}

function shouldNotOverwriteAcceptHeader (func, { operation } = {}) {
  it('should not overwrite the accept header', async () => {
    const mediaType = 'text/csv'
    const client = createClient({
      [operation]: async (query, { headers }) => {
        strictEqual(headers.get('accept'), mediaType)
      }
    })

    await func(client, mediaType)
  })
}

function shouldSetAcceptHeader (func, { mediaType, operation } = {}) {
  it(`should set the accept header to ${mediaType}`, async () => {
    const client = createClient({
      [operation]: async (query, { headers }) => {
        strictEqual(headers.get('accept'), mediaType)
      }
    })

    await func(client)
  })
}

function shouldSetDefaultGraphParameter (func, { operation } = {}) {
  it('should set the default graph uri parameter', async () => {
    const expected = [
      'http://example.org/',
      'http://example.com/'
    ]

    const client = createClient({
      [operation]: async (query, { parameters }) => {
        deepStrictEqual(parameters.getAll('default-graph-uri'), expected)
      }
    })

    await func(client, expected)
  })
}

function shouldSetUsingGraphParameter (func, { operation } = {}) {
  it('should set the default graph uri parameter', async () => {
    const expected = [
      'http://example.org/',
      'http://example.com/'
    ]

    const client = createClient({
      [operation]: async (query, { parameters }) => {
        deepStrictEqual(parameters.getAll('using-graph-uri'), expected)
      }
    })

    await func(client, expected)
  })
}

function shouldSetUsingNamedGraphParameter (func, { operation } = {}) {
  it('should set the default graph uri parameter', async () => {
    const expected = [
      'http://example.org/',
      'http://example.com/'
    ]

    const client = createClient({
      [operation]: async (query, { parameters }) => {
        deepStrictEqual(parameters.getAll('using-named-graph-uri'), expected)
      }
    })

    await func(client, expected)
  })
}

function shouldSetNamedGraphParameter (func, { operation } = {}) {
  it('should set the named graph parameter', async () => {
    const expected = [
      'http://example.org/',
      'http://example.com/'
    ]

    const client = createClient({
      [operation]: async (query, { parameters }) => {
        deepStrictEqual(parameters.getAll('named-graph-uri'), expected)
      }
    })

    await func(client, expected)
  })
}

function shouldUseGetOperation (func) {
  it('should use the get operation', async () => {
    let called = false

    const client = createClient({
      get: async () => {
        called = true
      }
    })

    await func(client)

    strictEqual(called, true)
  })
}

function shouldUseGivenOperation (func, { operation } = {}) {
  it('should use the given operation', async () => {
    let called = false

    const client = createClient({
      [operation]: async () => {
        called = true
      }
    })

    await func(client, operation)

    strictEqual(called, true)
  })
}

function shouldUsePostUrlencodedOperation (func) {
  it('should use the postUrlencoded operation', async () => {
    let called = false

    const client = createClient({
      postUrlencoded: async () => {
        called = true
      }
    })

    await func(client)

    strictEqual(called, true)
  })
}

export {
  shouldForwardHeaders,
  shouldForwardParameters,
  shouldForwardQuery,
  shouldForwardReturnObject,
  shouldNotOverwriteAcceptHeader,
  shouldSetAcceptHeader,
  shouldSetDefaultGraphParameter,
  shouldSetNamedGraphParameter,
  shouldSetUsingGraphParameter,
  shouldSetUsingNamedGraphParameter,
  shouldUseGetOperation,
  shouldUseGivenOperation,
  shouldUsePostUrlencodedOperation
}
