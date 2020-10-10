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
      type: [String, Object],
      default: ''
    },
  },
  data () {
    return {
      _route: ''
    }
  },
  watch: {
    href: {
      immediate: true,
      handler (val) {

        let newHerf = val

        let routerBase;

        if (process.env.VUE_ENV === 'client') {
          routerBase = window.routerBase
        } else {
          routerBase = process.env.NODE_PUBLIC
        }

        // 这种二级目录部署的情况补上目录
        if (routerBase && routerBase !== '/' && this.href.indexOf('/') === 0) {
          newHerf = `/${routerBase.replace(/\//g, '')}${newHerf}`
        }

        this._route = newHerf
      }
    }
  },
  methods: {
    onClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>
