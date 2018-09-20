/**
 * @fileOverview Home page
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-11 | sizhao  // 初始版本
*/

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import { connect } from 'react-redux'

class Home extends Component {
  static propTypes = {
    name: PropTypes.string,
    changeUserName: PropTypes.func,
    server: PropTypes.string
  }

  static defaultProps = {
    name: 'Tim'
  }

  render () {
    const { name, changeUserName, server } = this.props
    return (
      <div className={styles['home-page']}>
        <div className={styles.name}>Hello, { name }, { server }</div>
        <div className={styles.rect} />
        <button onClick={changeUserName}>change name</button>
      </div>
    )
  }
}

export default connect(state => {
  const { user } = state
  return {
    name: user.name
  }
}, dispatch => {
  return {
    changeUserName: () => {
      dispatch({ type: 'GET_USER', name: 'Google' })
    }
  }
})(Home)
