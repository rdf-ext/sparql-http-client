import { strictEqual } from 'node:assert'

function isSocketError (err) {
  strictEqual(err.message.includes('socket hang up'), true)
  strictEqual(err.status, undefined)

  return true
}

export default isSocketError
