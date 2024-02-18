function mergeHeaders (...all) {
  const merged = new Headers()

  for (const headers of all) {
    if (!headers) {
      continue
    }

    const entries = headers.entries ? headers.entries() : Object.entries(headers)

    for (const [key, value] of entries) {
      merged.set(key, value)
    }
  }

  return merged
}

export default mergeHeaders
