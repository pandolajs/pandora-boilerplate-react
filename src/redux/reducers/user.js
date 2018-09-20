/**
 * @fileOverview user reducer
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-11 | sizhao  // 初始版本
*/

export default (state = {}, action) => {
  const { type, ...data } = action

  switch (type) {
    case 'GET_USER':
    case 'SAY_HELLO':
      return {
        ...state,
        ...data
      }
    default:
      return state
  }
}
