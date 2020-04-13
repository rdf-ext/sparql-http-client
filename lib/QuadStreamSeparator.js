const factory = require('@rdfjs/data-model')
const { quadToNTriples } = require('@rdfjs/to-ntriples')
const SeparateStream = require('separate-stream')

class QuadStreamSeparator extends SeparateStream {
  constructor ({ change, maxQuadsPerStream = Infinity }) {
    super({
      change: async (stream, quad) => {
        this.graph = quad.graph

        return change(stream)
      },
      map: quad => {
        return quadToNTriples(factory.quad(quad.subject, quad.predicate, quad.object)) + '\n'
      },
      split: quad => {
        this.count++

        if (this.count >= maxQuadsPerStream) {
          this.count = 0

          return true
        }

        return !quad.graph.equals(this.graph)
      }
    })

    this.count = 0
    this.graph = null
  }
}

module.exports = QuadStreamSeparator
