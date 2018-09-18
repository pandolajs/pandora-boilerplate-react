/**
 * @fileOverview run command
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-14 | sizhao  // 初始版本
*/

function run (task = () => {}) {
  const start = new Date()
  const name = task.name
  console.log(`[${start.getMinutes()}:${start.getSeconds()}]: Starting task ${name} ...`)
  return task().then(response => {
    const end = new Date()
    const time = end - start
    console.log(`[${end.getMinutes()}:${end.getSeconds()}]: Finish task ${name} after ${time} ms.`)
    return response
  })
}

if (require.main === module && process.argv.length > 2) {
  delete require.cache[__filename]
  const modulePath = `./${process.argv[2]}.js`
  const task = require(modulePath)
  run(task)
}

module.exports = run
