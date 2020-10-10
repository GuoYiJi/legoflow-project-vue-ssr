/**
 * 扩展 legoflow-engine webpack 配置 vue 项目
 */

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const path = require('path')
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const fs = require('fs')
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const utils = require('./utils')
const ROOT = path.join(__dirname, '..')

const isProd = process.env.NODE_ENV === 'production'
module.exports = webpackConfig => {
  const entries = utils.walkFile(path.join(ROOT, 'src/pages'), [], '.vue', ROOT)

  // entry
  webpackConfig
    .entryPoints
    .delete('main')
    .clear()
    .end()


  Object.keys(entries).forEach(entrie => {
    // console.log('entrie', entrie)

    const { dir, name } = path.parse(entrie)

    let chunkName = ''
    if (dir) {
      chunkName = dir
    } else {
      chunkName = name
    }
    // console.log(entrie)

    // console.log('chunkName', chunkName)


    // console.log([
    //   ['babel-loader', path.join(ROOT, 'src/entry/client-loader.js'), entries[entrie]].join('!'),

    //   ['babel-loader', path.join(ROOT, 'src/entry/server-loader.js'), entries[entrie]].join('!')
    // ])



    webpackConfig
      .entry(chunkName.replace(/\//ig, '-'))
      .add(['babel-loader', path.join(ROOT, `src/entry/client-loader.js`), entries[entrie]].join('!'))
    // 抽离 css
    // webpackConfig
    //   .plugin(`mini-css-extract-plugin-${chunkName}`)
    //   .use(require('mini-css-extract-plugin'), [{
    //     filename: `css/${cssChunkName}.[chunkhash].css`, // name 即是入口 entryKey
    //     chunkFilename: `${cssChunkName}.[chunkhash].css`
    //   }])
    //   .end()

    // 抽离 css
    // webpackConfig
    // .plugin('mini-css-extract-plugin')
    // .use(require('mini-css-extract-plugin'), [{
    //   filename: 'css/[chunkhash].css', // name 即是入口 entryKey
    //   chunkFilename: '[chunkhash].css'
    // }])
    // .end()

    webpackConfig
      .plugin(`html-webpack-plugin-${chunkName}`)
      .use(
        /* eslint-disable-next-line @typescript-eslint/no-var-requires */
        require('html-webpack-plugin'), [{
          template: path.join(ROOT, './public/index.html'),
          filename: `${chunkName}.html`,
          publicPath: process.env.NODE_PUBLIC || '/',
          chunks: ['chunk-common', chunkName.replace(/\//ig, '-')]
        }]
      )
      .end()

    if (isProd) {
      webpackConfig
        .plugin(`template-webpack-plugin-${chunkName}`)
        .use(
          /* eslint-disable-next-line @typescript-eslint/no-var-requires */
          require('./plugins/template-webpack-plugin'), [{
            pages: entries,
            entry: chunkName.replace(/\//ig, '-')
          }]
        )
    }

    // if (isProd) {
    //   webpackConfig
    //     .plugin(`html-webpack-plugin-${chunkName}.art`)
    //     .use(
    //       /* eslint-disable-next-line @typescript-eslint/no-var-requires */
    //       require('html-webpack-plugin'), [{
    //         template: path.join(ROOT, './public/index.art.html'),
    //         filename: `${chunkName}.art`,
    //         chunks: ['chunk-common', chunkName],
    //         lang,
    //         ...pageOptions
    //       }]
    //     )
    //     .end()
    // }
  })

  // webpackConfig
  //   .entry('home1')
  //   .add('babel-loader!/Users/guoyiji/Public/yy/ssr-example/src/entry/client-loader.js!/Users/guoyiji/Public/yy/ssr-example/src/pages/home1/index.vue')
  //   .end()
  // webpackConfig
  //   .entry('home2')
  //   .add('./src/pages/home2/entry.js')
  //   .end()

  webpackConfig
    .resolve
    .alias
    .set('client', path.resolve(ROOT, 'src/entry/client.js'))

  // webpackConfig
  //   .plugin('html-webpack-plugin-home1')
  //   .use(require('html-webpack-plugin'), [{
  //     template: './public/index.html',
  //     filename: 'home1.html',
  //     chunks: ['home1']
  //   }])
  //   .end()

  // rule - vue
  webpackConfig
    .module
    .rule('vue')
    .test(/\.vue$/)
    .use('vue-loader').loader('vue-loader').options({
      compilerOptions: {
        preserveWhitespace: false
      }
    }).end()

  // vue css
  webpackConfig
    .module
    .rule('css')
    .test(/\.css$/)
    .oneOf('vue-css')
    .resourceQuery(/^\?vue/)
    .use('vue-style-loader').loader('vue-style-loader').end()
    .use('css-loader').loader('css-loader').end()
    .use('postcss-loader').loader('postcss-loader').end()
    .end()

  // vue scss
  webpackConfig
    .module
    .rule('sass')
    .test(/\.s(a|c)ss$/)
    .oneOf('vue-sass')
    .resourceQuery(/^\?vue/)
    .use('vue-style-loader').loader('vue-style-loader').end()
    .use('css-loader').loader('css-loader').end()
    .use('postcss-loader').loader('postcss-loader').end()
    .use('sass-loader').loader('sass-loader').options({
      implementation: require('sass')
    }).end()
    .end()

  webpackConfig.optimization
    .splitChunks({
      cacheGroups: {
        // vendors: {
        //   name: 'chunk-vendors',
        //   test: /[\\/]node_modules[\\/]/,
        //   priority: -10,
        //   chunks: 'initial'
        // },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    })

  // vue plugin
  webpackConfig
    .plugin('vue-loader')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    .use(require('vue-loader/lib/plugin'))

  // set VUE_ENV=client
  webpackConfig
    .plugin('define-webpack-plugin-env')
    .use(
      /* eslint-disable-next-line @typescript-eslint/no-var-requires */
      require('webpack').DefinePlugin, [{
        'process.env.VUE_ENV': '"client"'
      }]
    )


  webpackConfig.module.rules.delete('html')
}
