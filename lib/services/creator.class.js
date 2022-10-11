const inquirer = require('inquirer')
const fs = require('fs-extra')
const { cliRoot } = require('../config/gzh-cli.config')
const { execSync } = require('child_process')
const presetPrompts = require('../prompt')
const Generator = require('./generator.class')
const EventEmitter = require('events')
const chalk = require('chalk')

const {
  logWithSpinner,
  stopSpinner,
  log
} = require('../utils')

module.exports = class Creator extends EventEmitter {
  constructor (name, ctx) {
    super()
    this.name = name
    this.ctx = ctx
    this.prompts = []

    presetPrompts.forEach(prompt => {
      this.prompts.push(prompt)
    })
  }

  async create (cliOptions = {}) {
    const { name, ctx } = this
    const { appName, templateName } = await inquirer.prompt(this.prompts)
    const tplModuleName = templateName
    log()
    
    logWithSpinner(`创建项目目录 ${ctx}`)
    fs.mkdirsSync(ctx)
    
    logWithSpinner(`获取小程序模版 ${templateName}`)
    log()
    // install template module
    this.run(`npm install ${tplModuleName} --no-save --unsafe-perm`, {
      cwd: cliRoot,
      stdio: 'inherit'
    })
    log()
    const generator = new Generator({
      ctx,
      name,
      cliOptions,
      answers: { appName, templateName }
    })
    await generator.generate()
    stopSpinner()

    log()
    log()
    log(chalk.cyan(`===================================`))
    log()
    log(`小程序项目初始化完成，现在你可以：`)
    log()
    log(`打开微信开发者工具，将项目目录指向 ${chalk.cyan(ctx)} 运行项目`)
    log()
  }

  run (cmd, ops) {
    return execSync(cmd, Object.assign({
      cwd: this.ctx,
      stdio: 'ignore'
    }, ops || {}))
  }
}