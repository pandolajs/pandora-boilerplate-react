/**
 * @fileOverview root saga
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-11 | sizhao  // 初始版本
*/

import { delay } from 'redux-saga'
import { call, put, all } from 'redux-saga/effects'

export function * sayHelloAfterEys () {
  yield call(delay, 1000)
  yield put({ type: 'SAY_HELLO', name: 'JohnWorker' })
}

export default function * rootSaga () {
  yield all([
    sayHelloAfterEys()
  ])
}
