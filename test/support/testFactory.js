const rdf = require('@rdfjs/data-model')

function testFactory () {
  const factory = {
    blankNode: () => {
      factory.used.blankNode = true
      return rdf.blankNode()
    },
    defaultGraph: () => {
      factory.used.defaultGraph = true
      return rdf.defaultGraph()
    },
    literal: (value) => {
      factory.used.literal = true
      return rdf.literal(value)
    },
    namedNode: (value) => {
      factory.used.namedNode = true
      return rdf.namedNode(value)
    },
    quad: (s, p, o, g) => {
      factory.used.quad = true
      return rdf.quad(s, p, o, g)
    },
    used: {}
  }

  return factory
}

module.exports = testFactory
