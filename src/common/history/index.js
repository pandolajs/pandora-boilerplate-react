/**
 * @fileOverview history generator
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-11 | sizhao  // 初始版本
*/

import createHistory from 'history/createBrowserHistory'
import config from 'config'

const { baseUrl } = config

export default createHistory({
  basename: baseUrl
})
