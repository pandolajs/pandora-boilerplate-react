/**
 * @fileOverview redux store generator
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-11 | sizhao  // 初始版本
*/

import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducers from './reducers'
import rootSagas from 'Redux/sagas'
import { createLogger } from 'redux-logger'

export default (initialState = {}) => {
  let enhancer
  const middlewares = []
  const sagaMiddleware = createSagaMiddleware()
  middlewares.push(sagaMiddleware)

  if (_DEV_) {
    middlewares.push(createLogger({
      collapsed: true
    }))

    /* eslint-disable-next-line no-underscore-dangle */
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    enhancer = composeEnhancer(applyMiddleware(...middlewares))
  } else {
    enhancer = applyMiddleware(...middlewares)
  }

  const store = createStore(rootReducers, initialState, enhancer)
  sagaMiddleware.run(rootSagas)

  return store
}
