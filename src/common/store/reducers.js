/**
 * @fileOverview redux reducer combination
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-11 | sizhao  // 初始版本
*/

import { combineReducers } from 'redux'

const reducerRegx = /^\.\/([\w-]+)\.js$/
const reducerContext = require.context('../../redux/reducers', true, /^\.\/[\w-]+\.js$/)

const reducers = {}
reducerContext.keys().forEach(mod => {
  const name = mod.match(reducerRegx)[1]
  const reducer = reducerContext(mod).default
  reducers[name] = reducer
})

export default combineReducers(reducers)
