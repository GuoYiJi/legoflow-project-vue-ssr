const path = require('path')
const fs = require('fs')
const utils = require('./utils')

const ROOT = path.join(__dirname, '..')

module.exports = webpackConfig => {
  const entries = utils.walkFile(path.join(ROOT, 'src/pages'), [], '.vue', ROOT)

  // entry
  webpackConfig
    .entryPoints
    .delete('main')
    .clear()
    .end()

  webpackConfig
    .target('node')
    .end()

  webpackConfig
    .output
    .libraryTarget('commonjs2')
    .path(path.join(ROOT, '.ssr'))
    .filename('js/[name].js')
    .end()

  const template = fs.readFileSync(path.join(ROOT, './public/index.html'), 'utf-8')

  Object.keys(entries).forEach(entrie => {
    const { dir, name } = path.parse(entrie)

    let chunkName = ''
    if (dir) {
      chunkName = dir
    } else {
      chunkName = name
    }
    // console.log([
    //   ['babel-loader', path.join(ROOT, 'src/entry/client-loader.js'), entries[entrie]].join('!'),

    //   ['babel-loader', path.join(ROOT, 'src/entry/server-loader.js'), entries[entrie]].join('!')
    // ])
    webpackConfig
      .entry(chunkName.replace(/\//ig, '-'))
      .add(['babel-loader', path.join(ROOT, `src/entry/server-loader.js`), entries[entrie]].join('!'))
      .end()
  })
  // webpackConfig
  //   .entry('home1')
  //   .add('babel-loader!/Users/guoyiji/Public/yy/.ssr-example/src/entry/client-loader.js!/Users/guoyiji/Public/yy/.ssr-example/src/pages/home1/index.vue')
  //   .end()
  // webpackConfig
  //   .entry('home2')
  //   .add('./src/pages/home2/entry.js')
  //   .end()

  webpackConfig
    .resolve
    .alias
    .set('server', path.resolve(ROOT, 'src/entry/server.js'))

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

  // vue plugin
  webpackConfig
    .plugin('vue-loader')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    .use(require('vue-loader/lib/plugin'))

  webpackConfig
    .plugin('manifest-plugin')
    .use(require('webpack-manifest-plugin'))
}
