const {error, stopSpinner, exit, clearConsole} = require('../lib/utils/common')

async function create (projectName, options) {
  console.log(projectName,options)
}
module.exports = (...args) => {
  return create(...args).catch(err => {
    // stopSpinner(false)
    // error(err)
    console.error('create error')
  })
}