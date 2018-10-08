/**
 * @fileOverview router generator
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-11 | sizhao  // 初始版本
*/

import React from 'react'
import IsomorphicRouter from '@pandolajs/isomorphic-router'
import config from 'config'

const { baseUrl } = config
const routeContext = require.context('../../routes', true, /^\.\/[^_][\w\d-]+\/index\.js$/)

const iRouter = new IsomorphicRouter(routeContext, {
  baseUrl
})

iRouter.catch(({ code, context }) => {
  // TODO 根据具体的业务场景来做统一的路由错误处理
  switch (code) {
    case 500:
      return {
        title: 'Server Error',
        component: (<div>Server Error</div>)
      }
    case 404:
      return {
        title: 'Not Found',
        component: (<div>404, Not Found!</div>)
      }
    default:
      return {
        title: 'Unknown Error',
        component: (<div>Unknown Error</div>)
      }
  }
})

iRouter.use(async (context, next) => {
  const route = await next(context)
  return route
})

export default iRouter.router()
