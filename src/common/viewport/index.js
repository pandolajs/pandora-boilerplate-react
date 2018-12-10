/**
 * @fileOverview viewport buggyfill
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-19 | sizhao  // initial version
*/

import viewportBuggy from 'viewport-units-buggyfill'
import viewportHack from 'viewport-units-buggyfill/viewport-units-buggyfill.hacks'

viewportBuggy.init({
  hacks: viewportHack
})
