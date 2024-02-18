import rdf from 'rdf-ext'
import * as ns from './namespaces.js'

const graph = ns.ex.graph1

const message = 'test message'

const quads = rdf.dataset([
  rdf.quad(ns.ex.subject1, ns.ex.predicate1, ns.ex.object1),
  rdf.quad(ns.ex.subject2, ns.ex.predicate2, ns.ex.object2),
  rdf.quad(ns.ex.subject3, ns.ex.predicate3, ns.ex.object3),
  rdf.quad(ns.ex.subject4, ns.ex.predicate4, ns.ex.object4)
])

const askQuery = 'ASK {}'
const constructQuery = 'CONSTRUCT {?s ?p ?o} WHERE {?s ?p ?o}'
const selectQuery = 'SELECT * WHERE {?s ?p ?o}'
const updateQuery = 'INSERT {<http://example.org/subject> <http://example.org/predicate> "object"} WHERE {}'

export {
  graph,
  message,
  quads,
  askQuery,
  constructQuery,
  selectQuery,
  updateQuery
}
