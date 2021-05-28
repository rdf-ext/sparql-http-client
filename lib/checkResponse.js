async function checkResponse (res) {
  if (res.ok) {
    return
  }

  const message = await res.text()
  const err = new Error(`${res.statusText} (${res.status}): ${message}`)
  err.status = res.status

  throw err
}

module.exports = checkResponse
