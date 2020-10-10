import Vue from 'vue'

import App from '../layouts/app/index.js'
import basic from '@/basic'

import '@/styles/main.scss'

export default function (options) {
  basic()

  if (window.__INITIAL_STATE__) {
    options.computed && Object.assign(options.computed, {
      __INITIAL_STATE__: () => window.__INITIAL_STATE__
    })
  }


  const app = new Vue({
    render: h => h(App, {}, [h(options)])
  })
  app.$mount('#app')
}
