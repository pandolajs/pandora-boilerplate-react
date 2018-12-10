/**
 * @fileOverview yaml config builder
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-17 | sizhao  // 初始版本
*/

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const mkdir = require('make-dir')

const rootPath = path.resolve(__dirname, '..')
const configPath = path.join(rootPath, 'config/app.yaml')
const destConfigPath = path.join(rootPath, 'src/common/config')

const headerCommentTemplate = `/* eslint-disable */
/**
 * MUST NOT MODIFY THE FILE!!!!!!
 * @fileOverview 构建生成的配置文件，切勿自动修改，若有需求，请修改 /config/app.yaml 中的配置
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | {year}-{month}-{day}
*/
`

const codeTemplate = `
const config = {code}

export default config
`

function inject (template, injectObj) {
  return template.replace(/\{([^}]+)\}/g, (m, key) => {
    return injectObj[key]
  })
}

function parser (env = 'development') {
  const originConfig = yaml.safeLoad(fs.readFileSync(configPath, 'utf8'))
  const { development, test, preproduction, production, ...commonConfig } = originConfig
  const envConfig = { development, test, preproduction, production }
  return {
    ...commonConfig,
    ...envConfig[env]
  }
}

const config = () => {
  return new Promise((resolve, reject) => {
    const env = process.env.NODE_ENV || 'development'
    try {
      const config = parser(env)

      !fs.existsSync(destConfigPath) && mkdir.sync(destConfigPath)
      const oDate = new Date()
      const date = {
        year: oDate.getFullYear(),
        month: `${oDate.getMonth() + 1}`.padStart(2, '0'),
        day: `${oDate.getDate()}`.padStart(2, '0')
      }
      const stream = fs.createWriteStream(path.join(destConfigPath, 'index.js'))

      stream.write(inject(headerCommentTemplate, date))
      stream.end(inject(codeTemplate, {
          code: JSON.stringify(config, null, '  ')
        }), () => {
          resolve()
        })
    } catch (error) {
      reject(error)
    }
  })
}

config.parser = parser

module.exports = config
