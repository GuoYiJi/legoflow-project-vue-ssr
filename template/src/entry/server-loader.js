'use strict'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getOptions } = require('loader-utils')
module.exports = function (source) {
  const {
    pathname
  } = getOptions(this)
  this.cacheable()
  return `
    import render from 'server';
    import Page from '${this.resourcePath.replace(/\\/g, '\\\\')}';
    export default render({ ...Page }, { pathname: '${pathname}' });
  `
}
