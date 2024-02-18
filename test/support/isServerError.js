import { strictEqual } from 'node:assert'

function isServerError (err, message) {
  strictEqual(err.message.includes('Internal Server Error'), true)
  strictEqual(err.message.includes('500'), true)
  strictEqual(err.message.includes(message), true)
  strictEqual(err.status, 500)

  return true
}

export default isServerError
