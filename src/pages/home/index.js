/**
 * @fileOverview Home page
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-11 | sizhao  // 初始版本
*/

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'

export default class Home extends Component {
  static propTypes = {
    name: PropTypes.string
  }

  static defaultProps = {
    name: 'Tim'
  }

  render () {
    const { name } = this.props
    return (
      <div className={styles['home-page']}>
        <div className={styles.name}>Hello, { name }</div>
      </div>
    )
  }
}
