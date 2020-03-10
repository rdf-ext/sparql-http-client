function checkResponse (res) {
  if (res.ok) {
    return
  }

  const err = new Error(res.statusText)
  err.status = res.status

  throw err
}

module.exports = checkResponse
