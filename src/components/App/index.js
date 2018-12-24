/**
 * @fileOverview App Component
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-11 | sizhao  // 初始版本
*/

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './index.less'

export default class App extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired
  }
  render () {
    return React.Children.only(this.props.children)
  }
}
