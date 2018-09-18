/**
 * @fileOverview webpack build script for production envrivement
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-11 | sizhao  // 初始版本
*/

const webpack = require('webpack')
const config = require('./webpack.config')
const del = require('del')
const run = require('./run')
const appConfig = require('./config')

const distPath = config.output.path

async function compile () {
  await run(appConfig)
  return new Promise((resolve, reject) => {
    // 先清除 dist 目录下的内容
    del([`${distPath}/**`]).then(paths => {
      paths.length && console.log('Deleted files and folders: \n', paths.join('\n'))
      console.log('Start building the project ... \n')
      webpack(config).run((error, stats) => {
        if (error) {
          console.log('Build failer with fatal webpack errors: \n')
          console.error(error.stack || error)
          if (error.details) {
            console.error(error.details)
          }
          return reject(error)
        }

        const info = stats.toJson()
        if (stats.hasErrors()) {
          console.log('Build failer with compilation errors: \n')
          console.error(info.errors)
        }

        if (stats.hasWarnings()) {
          console.log('Build with compilation warnings: \n')
          console.warn(info.warnings)
        }

        console.log(stats.toString(config.stats))
        return resolve()
      })
    })
  })
}

module.exports = compile
