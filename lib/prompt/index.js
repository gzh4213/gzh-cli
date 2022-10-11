const templates = require('./template')

module.exports = [
  {
    type: 'input',
    name: 'appName',
    message: '请输入小程序名称：',
    default: '小程序Demo'
  },
  {
    type: 'list',
    name: 'templateName',
    message: '请选择一个小程序应用模板：',
    choices: templates
  }
]
