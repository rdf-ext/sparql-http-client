import JsonParser from '@bergos/jsonparse'
import { Transform } from 'readable-stream'

/**
 * A Transform stream that parses JSON SPARQL results and emits one object per row with the variable names as keys and
 * RDF/JS terms as values.
 */
class ResultParser extends Transform {
  /**
   * @param {Object} options
   * @param {DataFactory} options.factory RDF/JS DataFactory used to create the quads and terms
   */
  constructor ({ factory }) {
    super({
      readableObjectMode: true
    })

    this.factory = factory
    this.jsonParser = new JsonParser()
    this.jsonParser.onError = err => this.destroy(err)
    this.jsonParser.onValue = value => this.onValue(value)
  }

  _write (chunk, encoding, callback) {
    this.jsonParser.write(chunk)

    callback()
  }

  onValue (raw) {
    if (this.jsonParser.stack.length !== 3) {
      return
    }

    if (this.jsonParser.stack[1].key !== 'results' || this.jsonParser.stack[2].key !== 'bindings') {
      return
    }

    if (Object.keys(raw).length === 0) {
      return
    }

    const row = {}

    for (const [key, value] of Object.entries(raw)) {
      row[key] = this.valueToTerm(value)
    }

    this.push(row)
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

export default ResultParser
