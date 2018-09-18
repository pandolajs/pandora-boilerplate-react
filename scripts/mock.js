/**
 * @fileOverview development server
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-11 | sizhao  // 初始版本
*/

const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const cookie = require('koa-cookie').default
const glob = require('glob')

const rootDir = path.resolve(__dirname, '../')
const mockPath = path.join(rootDir, 'mock')

function mock () {
  const app = new Koa()
  app.name = 'development-mock-server'
  app.key = ['react']

  app.use(async (context, next) => {
    context.set('Access-Control-Allow-Origin', '*')
    context.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    context.set('Access-Control-Allow-Headers', 'accesstoken,appplatform,appversion,channeltype,deviceid,mccode,refreshtoken,systeminfo')
    await next()
  })
  app.use(bodyParser())
  app.use(cookie())

  // 加载 mock 数据
  const router = new Router()
  const methodSupportList = ['get', 'post', 'put', 'patch', 'delete', 'all']
  glob.sync('**/*.js', {
    cwd: mockPath
  }).forEach(file => {
    const mockRouter = require(path.join(mockPath, file))
    const { path: pattern, action } = mockRouter
    const chunks = pattern.split('::')
    let [ method = 'all', api ] = chunks.length > 1 ? chunks : [, ...chunks]
    method = methodSupportList.includes(method) ? method : 'all'
    api = /^\//.test(api) ? api : `/${api}`
    router[method](api, async (context) => {
      const result = await action(context)
      context.body = JSON.stringify(result)
    })
  })
  app.use(router.routes())
  app.use(router.allowedMethods())

  app.listen(9090, () => {
    console.log('The mock server is running at http://localhost:9090')
  })

  process.on('exit', () => {
    app.kill('SIGTERM')
  })

  return Promise.resolve(app)
}

module.exports = mock
