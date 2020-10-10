<template>
  <a :href="_route" :target="target" @click="onClick"><slot></slot></a>
</template>
<script>
export default {
  props: {
    target: {
      type: String,
      default: ''
    },
    href: {
      type: String|Object,
      default: ''
    },
    _route: ''
  },
  watch: {
    herf: {
      immediate: true,
      handler (val) {

        let newHerf = val
        // 这种二级目录部署的情况补上目录
        if (window.routerBase && window.routerBase !== '/' && this.href.indexOf('/') === 0) {
          e.preventDefault()
          newHerf = `/${window.routerBase.replace(/\//g, '')}${newHerf}`
        }

        this._route = newHerf
      }
    }
  },
  methods: {
    onClick (e) {
      // 这种二级目录部署的情况补上目录
      // if (window.routerBase && window.routerBase !== '/' && this.href.indexOf('/') === 0) {
      //   e.preventDefault()
      //   window.location.href = `/${window.routerBase.replace(/\//g, '')}${this.href}`
      // }

      this.$emit('click', e)
    }
  }
}
</script>
