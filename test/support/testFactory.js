import dataModelFactory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'

function testFactory () {
  const factory = {
    blankNode: () => {
      factory.used.blankNode = true
      return dataModelFactory.blankNode()
    },
    dataset: (quads, graph) => {
      factory.used.dataset = true
      return datasetFactory.dataset(quads, graph)
    },
    defaultGraph: () => {
      factory.used.defaultGraph = true
      return dataModelFactory.defaultGraph()
    },
    literal: value => {
      factory.used.literal = true
      return dataModelFactory.literal(value)
    },
    namedNode: value => {
      factory.used.namedNode = true
      return dataModelFactory.namedNode(value)
    },
    quad: (s, p, o, g) => {
      factory.used.quad = true
      return dataModelFactory.quad(s, p, o, g)
    },
    used: {}
  }

  return factory
}

export default testFactory
