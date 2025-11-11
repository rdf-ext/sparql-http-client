function mergeParameters (...all) {
  const merged = new URLSearchParams()

  for (const parameters of all) {
    if (!parameters) {
      continue
    }

    const entries = parameters.entries ? parameters.entries() : Object.entries(parameters)

    for (const [key, value] of entries) {
      if (value === undefined) {
        continue
      }

      if (Array.isArray(value)) {
        for (const v of value) {
          merged.append(key, v.value || v)
        }
      } else {
        merged.append(key, value.value || value)
      }
    }
  }

  return merged
}

export default mergeParameters
