/**
 * @fileOverview webpack build script
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-11 | sizhao  // 初始版本
*/

const path = require('path')
const cp = require('child_process')
const run = require('./run')
const config = require('./config')

const RUNNING_REGEXP = /The server is running at http:\/\/(.*?)\//

let server
let pending = true
const serverPath = path.resolve(__dirname, 'server.js')

// Launch or restart the Node.js server
async function start() {
  await run(config)
  return new Promise((resolve) => {
    function onStdOut(data) {
      const time = new Date().toTimeString()
      const match = data.toString('utf8').match(RUNNING_REGEXP)

      process.stdout.write(time.replace(/.*(\d{2}:\d{2}:\d{2}).*/, '[$1] '))
      process.stdout.write(data)

      if (match) {
        server.host = match[1]
        server.stdout.removeListener('data', onStdOut)
        server.stdout.on('data', x => process.stdout.write(x))
        pending = false
        resolve(server)
      }
    }

    if (server) {
      server.kill('SIGTERM')
    }

    server = cp.spawn('node', [serverPath], {
      env: Object.assign({
        NODE_ENV: 'development'
      }, process.env),
      silent: false
    })

    if (pending) {
      server.once('exit', (code, signal) => {
        if (pending) {
          throw new Error(`Server terminated unexpectedly with code: ${code} signal: ${signal}`)
        }
      })
    }

    server.stdout.on('data', onStdOut)
    server.stderr.on('data', x => process.stderr.write(x))

    return server
  })
}

process.on('exit', () => {
  if (server) {
    server.kill('SIGTERM')
  }
})

module.exports = start
