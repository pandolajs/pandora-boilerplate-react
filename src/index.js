/**
 * @fileOverview 项目入口文件
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-11 | sizhao  // 初始版本
*/

import React from 'react'
import ReactDOM from 'react-dom'
import queryString from 'query-string'
import history from 'Common/history'
import iRouter from 'Common/router'
import App from 'Component/App'
import { updateMeta } from 'Common/utils'
import createStore from 'Common/store'
import { Provider } from 'react-redux'
import config from 'config'

const { name: appName = 'Pandora React App', baseUrl } = config

// app root container
const appContainer = document.querySelector('#app')
let currentLoaction = history.location
const store = createStore()

// 返回恢复页面位置
const scrollPositionHistory = {}
if (window.history && window.history.scrollRestoration) {
  window.history.scrollRestoration = 'manual'
}

// 页面渲染完成后，恢复页面历史位置
let renderCompleteHandler = function initialRenderCompleteHandler () {
  renderCompleteHandler = (route, location) => {
    const { title = appName, description = '', keywords = '' } = route
    document.title = title
    description && updateMeta('description', description)
    keywords && updateMeta('keywords', keywords)

    let scrollX = 0
    let scrollY = 0
    const position = scrollPositionHistory[location.key]
    if (position) {
      const { x = 0, y = 0 } = position
      scrollX = x
      scrollY = y
    } else {
      const targetHash = location.hash.substr(1)
      if (targetHash) {
        const targetElement = document.getElementById(targetHash)
        if (targetElement) {
          scrollY = window.scrollY + targetElement.getBoundingClientRect().top
        }
      }
    }

    window.scrollTo(scrollX, scrollY)
  }
}

const LOCATION_CHANGE_TYPE = {
  INIT: 'init',
  PUSH: 'push'
}
// 路由监听处理器
async function locationChangeHandler (location, action) {
  const { key, pathname, state: locationState = {}, search } = location
  scrollPositionHistory[key] = {
    x: window.scrollX,
    y: window.scrollY
  }

  if (action === LOCATION_CHANGE_TYPE.PUSH) {
    delete scrollPositionHistory[key]
  }

  currentLoaction = location
  try {
    const route = await iRouter.resolve({
      pathname: `${baseUrl}${pathname}`,
      locationState,
      query: queryString.parse(search)
    })
    document.title = route.title || appName
    // 避免重复渲染
    if (currentLoaction.key !== key) {
      return
    }

    if (route.redirect) {
      history.replace(route.redirect)
      return
    }

    if (_DEV_) {
      const { AppContainer } = await import('react-hot-loader')
      ReactDOM.render((
        <Provider store={store} key={Math.random()}>
          <AppContainer>
            <App>{ route.component }</App>
          </AppContainer>
        </Provider>
      ), appContainer, () => renderCompleteHandler(route, location))
    } else {
      ReactDOM.render((
        <Provider store={store}>
          <App>{ route.component }</App>
        </Provider>
      ), appContainer, () => renderCompleteHandler(route, location))
    }
  } catch (error) {
    if (_DEV_) {
      const ErrorReporter = await import('redbox-react').then(md => md.default)
      const { message } = error
      document.title = `Error: ${message}`
      ReactDOM.render(<ErrorReporter error={error} />, appContainer)
    }
    console.error(error)
    if (currentLoaction.key === key) {
      window.location.reload()
    }
  }
}

// 开发环境错误监听
if (_DEV_) {
  window.addEventListener('error', async (event) => {
    const ErrorReporter = await import('redbox-react').then(md => md.default)
    const { error } = event
    document.title = `Runtime Error: ${error.message}`
    ReactDOM.render(<ErrorReporter error={error} />, appContainer)
  })
}

history.listen(locationChangeHandler)
locationChangeHandler(currentLoaction, LOCATION_CHANGE_TYPE.INIT)

if (module.hot) {
  module.hot.accept(['Common/router', 'Component/App', 'Common/store'], () => {
    require('Common/router')
    require('Component/App')
    require('Common/store')
    locationChangeHandler(currentLoaction, LOCATION_CHANGE_TYPE.INIT)
  })
}
