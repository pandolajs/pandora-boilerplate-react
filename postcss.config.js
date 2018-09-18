/**
 * @fileOverview postcss configuration
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-12 | sizhao  // 初始版本
 */

module.exports = () => ({
  plugins: [
    require('postcss-media-minmax')(),
    require('postcss-flexbugs-fixes')(),
    require('postcss-selector-not')(),
    require('autoprefixer')()
  ]
})
