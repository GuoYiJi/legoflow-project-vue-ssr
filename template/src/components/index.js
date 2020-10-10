import Vue from 'vue'

import ALink from './a-link'

const components = {
  ALink
}

Object.keys(components).forEach(name => {
  Vue.component(name, components[name])
})
