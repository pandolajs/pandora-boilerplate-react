/**
 * @fileOverview fetch wrapper
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-11 | sizhao  // 初始版本
 *
 * @description
 * 1. 此项目中与 m-shop 等其他历史项目不同，这里统一了 httpClient 的 api, 不论是 mobile 接口，还是 newapi 接口
 * 都是用 fetch(url, options) 进行接口请求，内部会自动根据请求的 URL path 进行区分，修改对应的 headers
 *
 * 2. 可用 API 如下：
 *  2.1 fetch(url, { method, data, autoHandleError, ... })
 *  2.2 fetch[method](url, data, { autoHandleError, ... })
 *
 * 3. autoHandleError: boolean | defaut: false 如果设置为 true, 默认的异常处理代码，详情请阅读以下代码
 *
 * @example
 * // 使用 fetch 方法
 * fetch('/get/api/path', {
 *  method: 'get',
 *  data: {
 *    name: 'hhhh'
 *  },
 *  headers: {
 *    token: 'xxxx'
 *  }
 * })
 *
 * // 使用对应的方法
 * fetch.post('/post/api/path', {
 *  name: 'xxxx',
 *  age: 100
 * }, {
 *  headers: {
 *    token: 'yyyy'
 *  }
 * })
*/

import axios from 'axios'
import find from 'lodash/find'

import config from 'config'

const { host } = config

const fetchIns = axios.create({
  timeout: 10 * 1000
})

function getBaseUrl (path = '') {
  if (typeof host === 'string') {
    return host || '/'
  }
  let matchKey = ''
  const target = find(host, (item) => {
    matchKey = Object.keys(item)[0]
    const reg = new RegExp(matchKey)
    return reg.test(path)
  })
  return target ? target[matchKey] : '/'
}

fetchIns.interceptors.request.use((config) => {
  const { url = '', params = {}, method } = config
  const isGet = method.toUpperCase() === 'GET'
  const optConf = {}
  const path = url.replace(/https?:\/\/(?:\w+\.)+com/, '')

  const baseURL = getBaseUrl(path)

  // if is GET method add a timestamp to avoid GET request cache.
  if (isGet) {
    optConf.params = {
      ...params,
      _ts: Date.now()
    }
  }

  return {
    ...config,
    baseURL,
    ...optConf
  }
}, (error) => {
  return Promise.reject(error)
})

const fetch = async (api, options = {}) => {
  options = {
    url: api,
    ...options
  }

  return fetchIns.request(options).then(res => {
    return res.data
  }).catch((error) => {
    return Promise.reject(error)
  })
}

const methods = ['get', 'delete', 'head', 'options', 'post', 'put', 'patch']

methods.forEach((method) => {
  fetch[method] = (api, data = {}, options = {}) => {
    const optConf = {}
    if (method.toUpperCase() === 'GET') {
      optConf.params = data
    } else {
      optConf.data = data
    }
    return fetch(api, Object.assign({}, options, { method }, optConf))
  }
})

export default fetch
