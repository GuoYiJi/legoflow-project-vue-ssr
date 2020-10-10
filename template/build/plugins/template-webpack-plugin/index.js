const eggViewVueSsr = require('egg-view-vue-ssr/lib/engine.js')
const path = require('path')
const fs = require('fs')

const ssr = new eggViewVueSsr({
  config: {
    vuessr: {
      renderOptions: {

      }
    }
  }
})

function Template (options) {
  this.options = options
}

Template.prototype.apply = function (compiler) {
  const { options } = this

  const filterSsrDisabled = (pathName) => {
    const { pages } = options
    const key = Object.keys(pages).find(key => {
      const { dir, base } = path.parse(key)
      let page
      if (dir) {
        page = dir
      } else {
        page = base
      }

      if (pathName.indexOf(page) !== -1) {
        return true
      }
    })
    if (key) {
      let config = {}
      try {
        config = require(pages[key].replace('index.vue', 'config.json'))
      } catch {
      }
      return !config.ssrDisabled
    }
    return true
  }

  compiler.hooks.emit.tapAsync('TemplatePlugin', function (compilation, callback) {
    const { assets } = compilation

    const callbacks = []
    Object.keys(assets)
      .filter(path => /\.html$/.test(path))
      .filter(path => filterSsrDisabled(path))
      .forEach(k => {
        const asset = assets[k]
        const { source } = asset
        const { entry } = options

        callbacks.push(new Promise((resolve, reject) => {
          const { base } = path.parse(k)
          const js = path.join(__dirname, '..', '..', '..', '.ssr', 'js', `${entry}.js`)
          ssr.render(js, {})
            .then(res => {
              asset.source = () => source().replace('<!--vue-ssr-outlet-->', res)
              resolve()
            })
            .catch(err => {
              console.log('err', err)
              console.log('err', js)
              reject()
            })
        }))
      })
    Promise.all(callbacks)
      .then(res => {
        console.log('done')
        callback()
      })
  })
  compiler.hooks.emit.tap('TemplatePlugin', function (compilation) {
    const { assets } = compilation

    Object.keys(assets)
      .filter(path => /\.html$/.test(path))
      .filter(path => !filterSsrDisabled(path))
      .forEach(k => {
        const asset = assets[k]
        const { content, source } = asset

        const tpl = k.replace(/\.html$/, '.tpl')

        const newSource = source().replace('<!--__INITIAL_STATE__-->', '<script>window.__INITIAL_STATE__ = \'<%- data %>\'</script>')
        compilation.assets[`template/${tpl}`] = {
          source: () => newSource,
          size: () => Buffer.from(newSource).length
        }
        delete compilation.assets[k]
      })
  })

  // compiler.hooks.assetEmitted.tap('TemplatePlugin', )
}

module.exports = Template
