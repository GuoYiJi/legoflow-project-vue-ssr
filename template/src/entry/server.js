import Vue from 'vue'
import App from '../layouts/app/index.js'

export default function render (options) {
  if (options.store && options.router) {
    return context => {
      options.router.push(context.state.url)
      const matchedComponents = options.router.getMatchedComponents()
      if (!matchedComponents) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({ code: '404' })
      }
      return Promise.all(
        matchedComponents.map(component => {
          if (component.preFetch) {
            return component.preFetch(options.store)
          }
          return null
        })
      ).then(() => {
        context.state = Object.assign(options.store.state, context.state)
        return new Vue(options)
      })
    }
  }
  return context => {
    const VueApp = Vue.extend(options)
    // const app = new VueApp({ data: context.state })

    const app = new Vue({
      render: h => h(App, {}, [h(options)])
    })
    return new Promise(resolve => {
      resolve(app)
    })
  }
}
