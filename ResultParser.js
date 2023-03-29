import jsonStream from 'jsonstream2'
import delay from 'promise-the-world/delay.js'
import rdf from '@rdfjs/data-model'
import stream from 'readable-stream'

const { Duplex, finished } = stream

/**
 * A stream which parses SPARQL SELECT bindings
 */
export default class ResultParser extends Duplex {
  constructor ({ factory = rdf } = {}) {
    super({
      readableObjectMode: true
    })

    this.factory = factory
    this.jsonParser = jsonStream.parse('results.bindings.*')

    finished(this.jsonParser, err => {
      this.destroy(err)
    })
  }

  _write (chunk, encoding, callback) {
    this.jsonParser.write(chunk, encoding, callback)
  }

  async _read () {
    while (true) {
      const raw = this.jsonParser.read()

      if (!raw || Object.keys(raw).length === 0) {
        if (!this.writable) {
          return this.push(null)
        }

        await delay(0)
      } else {
        const row = Object.entries(raw).reduce((row, [key, value]) => {
          row[key] = this.valueToTerm(value)

          return row
        }, {})

        if (!this.push(row)) {
          return
        }
      }
    }
  }

  valueToTerm (value) {
    if (value.type === 'uri') {
      return this.factory.namedNode(value.value)
    }

    if (value.type === 'bnode') {
      return this.factory.blankNode(value.value)
    }

    if (value.type === 'literal' || value.type === 'typed-literal') {
      const datatype = (value.datatype && this.factory.namedNode(value.datatype))

      return this.factory.literal(value.value, datatype || value['xml:lang'])
    }

    return null
  }
}
