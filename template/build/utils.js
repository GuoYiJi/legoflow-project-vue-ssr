
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const path = require('path')
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const fs = require('fs')

const utils = {}

utils.isMatch = (regexArray, strMatch) => {
  if (!regexArray) {
    return false
  }
  // fix window path seperate \\
  const normalizeStrMatch = strMatch.replace(/\\/g, '/').replace(/\/\//g, '/')
  regexArray = Array.isArray(regexArray) ? regexArray : [regexArray]
  return regexArray.some(item => new RegExp(item, '').test(normalizeStrMatch))
}

utils.walkFile = (dirs, excludeRegex, extMatch = '.js', baseDir) => {
  const entries = {}
  let entryDir = ''
  const walk = (dir, include, exclude) => {
    const dirList = fs.readdirSync(dir)
    dirList.forEach(item => {
      const filePath = path.posix.join(dir, item)
      if (fs.statSync(filePath).isDirectory()) {
        walk(filePath, include, exclude)
      } else if (include.length > 0 && utils.isMatch(include, filePath) && !utils.isMatch(exclude, filePath) || include.length === 0 && !utils.isMatch(exclude, filePath)) {
        if (filePath.endsWith(extMatch)) {
          const entryName = filePath.replace(entryDir, '').replace(/^\//, '').replace(extMatch, '')
          entries[entryName] = filePath
        }
      }
    })
  }

  const includeRegex = [/index\.vue/]
  if (dirs instanceof RegExp) {
    includeRegex.push(dirs)
    dirs = utils.getDirByRegex(dirs, baseDir)
  }
  dirs = Array.isArray(dirs) ? dirs : [dirs]
  dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      entryDir = dir
      walk(dir, includeRegex, excludeRegex)
    }
  })
  return entries
}

module.exports = utils
