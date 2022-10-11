const EventEmitter = require('events')
const { execSync } = require('child_process')
const path = require('path')
const { cliRoot } = require('../config/gzh-cli.config')
const writeFileTree = require('../utils/writeFileTree')

const {
  logWithSpinner,
  stopSpinner,
  log
} = require('../utils')

module.exports = class Generator extends EventEmitter {
  constructor (options = {}) {
    super()

    this.ctx = options.ctx || ''
    this.name = options.name || ''
    this.cliOptions = options.cliOptions || {}
    this.appName = options.answers && options.answers.appName || ''
    this.templateName = options.answers && options.answers.templateName || ''
  }

  async generate () {
    const {
      ctx,
      name,
      cliOptions,
      appName,
      templateName
    } = this

    // 模版的模块名称
    const tplModuleName = templateName
    // const cliTemplate = require(tplModuleName)

    log()
    logWithSpinner(`初始化项目`)
    log()
    // 将模版 src 目录复制到项目中
    try {
      this.run(`cp -r ${path.resolve(cliRoot, 'node_modules', tplModuleName, 'template/*')} ${ctx}/`)
    } catch (error) {
      log(error)
      process.exit(1)
    }
    log()

    logWithSpinner(`安装项目依赖`)
    // 安装项目依赖
    this.run(`npm install`, {
      stdio: 'inherit'
    })
    log()

    // 获取项目配置文件
    const projectConfig = require(`${ctx}/project.config.json`)
    projectConfig.projectname = appName
    // 写入的文件对象
    const files = {
      'project.config.json': JSON.stringify(projectConfig)
    }
    // 将文件写入项目
    writeFileTree(ctx, files)

    stopSpinner()
  }

  run (cmd, ops) {
    return execSync(cmd, Object.assign({
      cwd: this.ctx,
      stdio: 'ignore'
    }, ops || {}))
  }
}
