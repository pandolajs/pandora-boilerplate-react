/**
 * @fileOverview webpack configuration
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-12 | sizhao  // 初始版本
*/

const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlInlineSourcePlugin = require('../webpack.plugins/html-webpack-inline-source-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const BunderAnalyzerPlugin = require('webpack-bundle-analyzer')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const env = process.env.NODE_ENV || 'development'
const isDev = env === 'development'
const isVerbose = process.argv.includes('--verbose')
const isAnalyze = process.argv.includes('--analyze')

const rootPath = path.join(__dirname, '../..')
const srcPath = path.join(rootPath, 'src')
const entryPath = path.join(srcPath, 'index.js')
const viewport = path.join(srcPath, 'common/viewport/index.js')
const templatePath = path.join(srcPath, 'index.html')
const distPath = path.join(rootPath, 'dist')

/**
 * 1. 避免相对路径的繁琐，设置项目目录别名
 * 2. 区分自定义别名与 npm mobule，别名使用驼峰命名
*/
const alias = {
  Component: path.join(srcPath, 'components'),
  Page: path.join(srcPath, 'pages'),
  Common: path.join(srcPath, 'common'),
  Service: path.join(srcPath, 'services'),
  Redux: path.join(srcPath, 'redux'),
  config: path.join(srcPath, 'common/config')
}

module.exports = {
  name: 'client',
  target: 'web',
  mode: env === 'development' ? env : 'production',
  entry: {
    main: [entryPath],
    viewport: [viewport]
  },
  output: {
    path: path.join(distPath, 'static'),
    publicPath: '/static/',
    filename: isDev ? '[name].js' : '[name].[chunkhash:22].js',
    chunkFilename: isDev ? '[id].[name].chunk.js' : '[id].[chunkhash:22].chunk.js'
  },

  resolve: {
    alias,
    mainFields: ['module', 'browser', 'main']
  },

  module: {
    rules: [
      ...isDev ? [{
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            fix: false, // DONOT set to true
            formatter: require('eslint-formatter-pretty')
          }
        }
      }] : [],
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader'
        },
        include: [
          srcPath,
          [/node_modules\/@pandolajs\/(?:isomorphic-router)/]
        ]
      },
      {
        test: /\.(css|less)$/,
        use: [
          (isDev ? 'style-loader' : {
            loader: MiniCSSExtractPlugin.loader
          }),
          {
            loader: 'css-loader',
            options: {
              importLoaders: 3,
              sourceMap: isDev,
              camelCase: true,
              modules: true,
              localIdentName: isDev ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
              minimize: !isDev,
              discardComments: {
                removeAll: true
              }
            }
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDev
            }
          },
          {
            loader: 'less-loader',
            options: {
              relativeUrls: false,
              sourceMap: isDev
            }
          }
        ]
      },
      {
        test: /\.(ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ico|jpg|jpeg|png|gif|eot|otf|webp|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: isDev ? '[name]-[hash:8].[ext]' : '[hash:8].[ext]'
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: templatePath,
      filename: '../index.html',
      inlineSource: {
        pattern: /viewport(\..+)?\.js$/,
        position: 'head'
      }
    }),
    new HtmlInlineSourcePlugin(),
    new webpack.DefinePlugin({
      _DEV_: isDev
    }),
    ...isDev ? [] : [
      new MiniCSSExtractPlugin({
        filename: isDev ? '[name].css' : '[name].[hash].css',
        chunkFilename: isDev ? '[id].css' : '[id].[hash].css'
      }),
      new CopyWebpackPlugin([
        { from: '**/*', to: path.join(rootPath, 'dist') }
      ], { context: 'public' })
    ],
    ...isAnalyze ? [ new BunderAnalyzerPlugin() ] : []
  ],

  devtool: isDev ? 'cheap-module-source-map' : false,
  bail: !isDev,
  cache: false,
  stats: {
    colors: true,
    reasons: isDev,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose
  }
}
