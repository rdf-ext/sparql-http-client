function SparqlHttp (options) {
  options = options || {}

  this.endpointUrl = options.endpointUrl
  this.updateUrl = options.updateUrl

  this.fetch = options.fetch || SparqlHttp.fetch

  this.types = SparqlHttp.types
}

SparqlHttp.prototype.getQuery = function (query, options) {
  options = options || {}
  options.headers = options.headers || {}

  var url = (options.endpointUrl || this.endpointUrl) + '?query=' + encodeURIComponent(query)

  options.method = 'get'
  options.headers['Accept'] = options.headers['Accept'] || options.accept

  return this.fetch(url, options)
}

SparqlHttp.prototype.postQueryDirect = function (query, options) {
  options = options || {}
  options.headers = options.headers || {}

  var url = options.updateUrl || this.updateUrl

  options.method = 'post'
  options.headers['Accept'] = options.headers['Accept'] || options.accept
  options.headers['Content-Type'] = options.headers['Content-Type'] || options.contentType || 'application/sparql-query'
  options.body = query

  return this.fetch(url, options)
}

SparqlHttp.prototype.postQueryUrlencoded = function (query, options) {
  options = options || {}
  options.headers = options.headers || {}

  var url = options.updateUrl || this.updateUrl

  options.method = 'post'
  options.headers['Accept'] = options.headers['Accept'] || options.accept
  options.headers['Content-Type'] = options.headers['Content-Type'] || options.contentType || 'application/x-www-form-urlencoded'
  options.body = 'query=' + encodeURIComponent(query)

  return this.fetch(url, options)
}

SparqlHttp.prototype.postQuery = SparqlHttp.prototype.postQueryUrlencoded

SparqlHttp.prototype.constructQuery = function (query, options) {
  options = options || {}

  options.accept = options.accept || this.types.construct.accept

  return this.types.construct.operation.call(this, query, options)
}

SparqlHttp.prototype.selectQuery = function (query, options) {
  options = options || {}

  options.accept = options.accept || this.types.select.accept

  return this.types.select.operation.call(this, query, options)
}

SparqlHttp.prototype.updateQuery = function (query, options) {
  options = options || {}

  options.accept = options.accept || this.types.update.accept

  return this.types.update.operation.call(this, query, options)
}

SparqlHttp.types = {
  construct: {
    accept: 'application/n-triples',
    operation: SparqlHttp.prototype.getQuery
  },
  select: {
    accept: 'application/sparql-results+json',
    operation: SparqlHttp.prototype.getQuery
  },
  update: {
    accept: '*/*',
    operation: SparqlHttp.prototype.postQuery
  }
}

module.exports = SparqlHttp
