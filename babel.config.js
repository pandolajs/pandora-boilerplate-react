/**
 * @fileOverview babel configuration
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-12 | sizhao  // 初始版本
 *
 * @description
 * 0. 从 babel 7.x 开始 babel 配置可以提供一个 babel.config.js 来配置 babel 配置，这也是官方推荐的姿势
 * 1. 从 babel 7.x 开始不再推荐使用 stage preset，推荐使用 proposal plugin, 可以使用 npx babel-upgrade 来升级
 * 2. 从 babel 7.x 开始可以智能判断 polyfill 的导入，只要设置 preset-env useBuiltIns: 'usage' 即会根据设置的 browserslist 来加载对应的 polyfill，不再需要把 @babel/polyfill 全部导入
 * 3. preset-react 可以通过 development 来设置是否需要导入一些开发环境的包
*/

module.exports = function (api) {
  const isDev = api.env('development')
  const presets = [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      modules: false
    }],
    ['@babel/preset-react', {
      development: isDev
    }]
  ]

  const plugins = [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-json-strings'
  ]
  return {
    presets,
    plugins
  }
}
