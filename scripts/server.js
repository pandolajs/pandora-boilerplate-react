/**
 * @fileOverview development server
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-11 | sizhao  // 初始版本
*/

const path = require('path')
const Koa = require('koa')
const serve = require('koa-static')
const bodyParser = require('koa-bodyparser')
const cookie = require('koa-cookie').default
const config = require('./webpack.config')
const koaWebpack = require('koa-webpack')
const webpack = require('webpack')

const rootDir = path.resolve(__dirname, '../')
const distPath = path.join(rootDir, 'public')

const app = new Koa()
app.name = 'development-server'
app.key = ['react']

app.use(serve(distPath))
app.use(bodyParser())
app.use(cookie())

const compiler = webpack(config)
koaWebpack({
  compiler,
  hotClient: {
    allEntries: true
  }
}).then(middleware => {
  app.use(middleware)
  app.use((context) => {
    const filename = path.resolve(config.output.path, '../index.html')
    context.status = 200
    context.type = 'html'
    context.body = middleware.devMiddleware.fileSystem.createReadStream(filename)
  })

  app.listen(8080, () => {
    console.log('The server is running at http://localhost:8080')
  })
})

compiler.hooks.done.intercept({
  call: () => {
    console.log('Compile finish ...')
  }
})
