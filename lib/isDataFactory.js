function isDataFactory (factory) {
  if (!factory) {
    return false
  }

  if (typeof factory.blankNode !== 'function') {
    return false
  }

  if (typeof factory.defaultGraph !== 'function') {
    return false
  }

  if (typeof factory.literal !== 'function') {
    return false
  }

  if (typeof factory.namedNode !== 'function') {
    return false
  }

  if (typeof factory.quad !== 'function') {
    return false
  }

  return true
}

export default isDataFactory
