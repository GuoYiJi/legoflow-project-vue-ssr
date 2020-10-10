/**
 * 扩展 legoflow-engine webpack 配置 vue 项目
 */

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const path = require('path')
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const fs = require('fs')

const MODE = process.env.MODE

const commonWebpackConfig = require('./build/common.js')
const clientWebpackConfig = require('./build/client.js')
const serverWebpackConfig = require('./build/server.js')

module.exports = ({ webpackConfig }) => {
  commonWebpackConfig(webpackConfig)

  MODE === 'server' ? serverWebpackConfig(webpackConfig) : clientWebpackConfig(webpackConfig)
}
