function isDatasetCoreFactory (factory) {
  if (!factory) {
    return false
  }

  if (typeof factory.dataset !== 'function') {
    return false
  }

  return true
}

export default isDatasetCoreFactory
