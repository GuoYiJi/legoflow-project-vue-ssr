const path = require('path')

const ROOT = path.join(__dirname, '..')

module.exports = function (webpackConfig) {
  const mode = process.env.mode

  webpackConfig.output
    .publicPath(process.env.NODE_PUBLIC || '/')
    .end()
  // webpackConfig
  //   .plugin('copyplugin')
  //   .use(
  //     require('copy-webpack-plugin'),
  //     [[{
  //       from: path.join(ROOT, 'src', 'assets'),
  //       to: path.join(ROOT, 'dist', 'assets')
  //     }]]
  //   )
  //   .end()

  // rule - image
  webpackConfig
    .module
    .rule('image')
    .test(/\.(png|jpg|gif|jpeg|svg)$/)
    .use('url-loader').loader('url-loader').options({
      limit: 1024 * parseInt(process.env.base64ImageMaxSize || 1),
      name: 'img/[name].[hash:7].[ext]',
      esModule: false
    }).end()
    .when(mode === 'production',
      config => config.use('image-webpack-loader').loader('image-webpack-loader').options({
        mozjpeg: {
          progressive: true,
          quality: 80
        },
        optipng: {
          enabled: false
        },
        pngquant: {
          quality: [0.80, 0.90],
          speed: 4
        },
        gifsicle: {
          interlaced: false
        }
      }).end()
    )

  webpackConfig
    .plugins
    .delete('html-webpack-plugin')
}
