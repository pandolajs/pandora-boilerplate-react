/**
 * @fileOverview fetch wrapper
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-11 | sizhao  // 初始版本
*/

import axios from 'axios'

let baseURL = '/'
if (_DEV_) {
  baseURL = 'http://localhost:9090'
}
const fetchIns = axios.create({
  baseURL,
  timeout: 10 * 1000
})

const defaultOptions = {

}

const fetch = async (api, options = {}) => {
  const { method = 'get' } = options
  options = {
    ...defaultOptions,
    ...options
  }

  return fetchIns[method](api, options).then(res => {
    return res.data
  }).catch((error) => {
    return Promise.reject(error)
  })
}

const simpleMethods = ['get', 'delete', 'head', 'options']
const complexMethods = ['post', 'put', 'patch']

simpleMethods.forEach((method) => {
  fetch[method] = (api, options = {}) => {
    return fetch(api, Object.assign(options, { method }))
  }
})

complexMethods.forEach((method) => {
  fetch[method] = (api, data = {}, options = {}) => {
    return fetch(api, Object.assign(options, { method, data }))
  }
})

export default fetch
