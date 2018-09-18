/**
 * @fileOverview home route
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-12 | sizhao  // 初始版本
*/

import React from 'react'
import Home from 'Page/home'
import { test } from 'Service/user'

export default {
  path: '/home/:name',
  async action (context, params) {
    const { name } = params
    const { name: apiName } = await test()
    return {
      title: '首页',
      component: (
        <Home name={apiName || name} />
      )
    }
  }
}
