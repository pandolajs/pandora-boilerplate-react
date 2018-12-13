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
const getPort = require('get-port')
const OpenBrowserWebpackPlugin = require('open-browser-webpack4-plugin')
const proxyMiddleware = require('koa2-proxy-middleware')

const appConfig = require('./config').parser
const rootDir = path.resolve(__dirname, '../')
const distPath = path.join(rootDir, 'public')

const { baseUrl, proxy, localServerDomain } = appConfig()

const app = new Koa()
app.name = 'development-server'
app.key = ['react']

const targets = {}
Object.keys(proxy).forEach(key => {
  targets[key] = {
    target: proxy[key],
    changeOrigin: true,
    cookieDomainRewrite: true
  }
})

app.use(proxyMiddleware({ targets }))

app.use(serve(distPath))
app.use(bodyParser())
app.use(cookie())

getPort({
  port: 8080
}).then(port => {
  const url = localServerDomain ? `${localServerDomain}` : `http://localhost:${port}`
  config.plugins.push(
    new OpenBrowserWebpackPlugin({ url: `${url}${baseUrl}` })
  )
  const compiler = webpack(config)
  /**
   * @todo
   * set allEntries: true, will lead react-hot-loader to not work correctly.
   * the behaiver is:
   * 1. change the file
   * 2. browser console log recompiling, but 'No Module replacement' is printed, and no hot-update.js is loaded in the Network palette.
   *
   * it works fine well in another project `fe-ui-react-mobile`
   * so weird!!! maybe need to read some source code to figure out it!
   *
   * solution:
   * 1. remove koa-webpack optional param OR set allEntries to false (default).
   * 2. if you are working with redux, you must add key props with a random value for Provider Component.
   */
  koaWebpack({
    compiler
  }).then(middleware => {
    app.use(middleware)
    app.use((context) => {
      const filename = path.resolve(config.output.path, '../index.html')
      context.status = 200
      context.type = 'html'
      context.body = middleware.devMiddleware.fileSystem.createReadStream(filename)
    })

    app.listen(port, () => {
      console.log(`The server is running at ${url}`)
    })
  })

  compiler.hooks.done.intercept({
    call: () => {
      console.log('Compile finish ...')
    }
  })
})
