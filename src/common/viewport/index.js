/**
 * @fileOverview viewport buggyfill
 * @author houquan | houquan@babytree-inc.com
 * @version 1.0.0 | 2018-09-19 | houquan  // 初始版本
*/

import viewportBuggy from 'viewport-units-buggyfill'
import viewportHack from 'viewport-units-buggyfill/viewport-units-buggyfill.hacks'

viewportBuggy.init({
  hacks: viewportHack
})
