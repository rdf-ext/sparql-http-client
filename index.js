function SparqlHttp (options) {
  options = options || {}

  this.endpointUrl = options.endpointUrl
  this.updateUrl = options.updateUrl

  this.request = options.request || SparqlHttp.request

  this.types = SparqlHttp.types
}

SparqlHttp.prototype.getQuery = function (query, callback, options) {
  options = options || {}

  var url = (options.endpointUrl || this.endpointUrl) + '?query=' + encodeURIComponent(query)
  var headers = {
    'Accept': options.accept
  }

  return this.request('GET', url, headers, null, callback)
}

SparqlHttp.prototype.postQueryDirect = function (query, callback, options) {
  options = options || {}

  var url = options.updateUrl || this.updateUrl
  var headers = {
    'Accept': options.accept,
    'Content-Type': options.contentType || 'application/sparql-query'
  }

  return this.request('POST', url, headers, query, callback)
}

SparqlHttp.prototype.postQueryUrlencoded = function (query, callback, options) {
  options = options || {}

  var url = options.updateUrl || this.updateUrl
  var headers = {
    'Accept': options.accept,
    'Content-Type': options.contentType || 'application/x-www-form-urlencoded'
  }
  var body = 'query=' + encodeURIComponent(query)

  return this.request('POST', url, headers, body, callback)
}

SparqlHttp.prototype.postQuery = SparqlHttp.prototype.postQueryUrlencoded

SparqlHttp.prototype.constructQuery = function (query, callback, options) {
  options = options || {}

  options.accept = options.accept || this.types.construct.accept

  return this.types.construct.operation.call(this, query, callback, options)
}

SparqlHttp.prototype.selectQuery = function (query, callback, options) {
  options = options || {}

  options.accept = options.accept || this.types.select.accept

  return this.types.select.operation.call(this, query, callback, options)
}

SparqlHttp.prototype.updateQuery = function (query, callback, options) {
  options = options || {}

  options.accept = options.accept || this.types.update.accept

  return this.types.update.operation.call(this, query, callback, options)
}

SparqlHttp.requestModuleRequest = function (request) {
  return function (method, url, headers, content, callback) {
    return request({
      method: method,
      url: url,
      headers: headers,
      body: content
    }, callback)
  }
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
