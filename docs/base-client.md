# BaseClient

It is also possible to build a custom client by manually constructing an `Endpoint` and providing classes which implement the `Query` and `Store` objects.

Please refer to [JSDoc page](api.md) for details about parameters.

## A parsing query and stream store

The example below combines the `query` object of `ParsingClient` with the `StreamStore`'s store implementation.

<run-kit>

```javascript
const BaseClient = require('sparql-http-client/BaseClient')
const Endpoint = require('sparql-http-client/Endpoint')
const ParsingQuery = require('sparql-http-client/ParsingQuery')
const StreamStore = require('sparql-http-client/StreamStore')

const endpointUrl = 'https://query.wikidata.org/sparql'

new BaseClient({
  endpoint: new Endpoint({ endpointUrl }),
  Query: ParsingQuery,
  Store: StreamStore
})
```

</run-kit>
