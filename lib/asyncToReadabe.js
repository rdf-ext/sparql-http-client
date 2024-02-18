import toReadable from 'duplex-to/readable.js'
import { PassThrough } from 'readable-stream'

function asyncToReadabe (func) {
  const stream = new PassThrough({ objectMode: true })

  setTimeout(async () => {
    try {
      (await func()).pipe(stream)
    } catch (err) {
      stream.destroy(err)
    }
  }, 0)

  return toReadable(stream)
}

export default asyncToReadabe
