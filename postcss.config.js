/**
 * @fileOverview postcss configuration
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-12 | sizhao  // 初始版本
 */

module.exports = () => ({
  plugins: {
    "postcss-import": {},
    "postcss-url": {},
    "postcss-aspect-ratio-mini": {},
    "postcss-write-svg": {
      utf8: false
    },
    "postcss-px-to-viewport": {
      viewportWidth: 750,
      viewportHeight: 1334,
      unitPrecision: 3,
      viewportUnit: 'vw',
      selectorBlackList: ['.ignore', '.hairlines'],
      minPixelValue: 1,
      mediaQuery: false
    },
    "postcss-viewport-units": {
      silence: true,
      filterRule: rule => rule.nodes.findIndex(i => i.prop === 'content') === -1
    },
    "cssnano": {
      preset: "advanced",
      autoprefixer: false,
      "postcss-zindex": false
    },
    'postcss-media-minmax': {},
    'postcss-flexbugs-fixes': {},
    'postcss-selector-not': {},
    'autoprefixer': {}
  }
})
