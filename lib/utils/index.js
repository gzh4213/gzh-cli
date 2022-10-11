[
  'logger',
  'spinner'
].forEach(m => {
  Object.assign(exports, require(`./${m}`))
})