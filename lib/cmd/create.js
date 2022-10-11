const path = require("path");
const fs = require("fs-extra");
const Inquirer = require("inquirer");
const pkg = require('../../package.json')
const chalk = require('chalk')
const validateProjectName = require('validate-npm-package-name')
const Creator = require('../services/creator.class')

const {
  logWithSpinner,
  stopSpinner,
  log,
  error,
  clearConsole
} = require('../utils')

module.exports = async function (projectName, options) {
  // 获取当前工作目录
  const cwd = process.cwd();
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const appRoot = path.resolve(cwd, projectName)

  // 检测项目名称是否合法
  const result = validateProjectName(name)
  if (!result.validForNewPackages) {
    console.error(chalk.red(`非法的项目名: "${name}"`))
    result.errors && result.errors.forEach(err => {
      console.error(chalk.red.dim('Error: ' + err))
    })
    result.warnings && result.warnings.forEach(warn => {
      console.error(chalk.red.dim('Warning: ' + warn))
    })
    process.exit(1)
  }

  clearConsole()
  log('\n')
  log(`gzh-cli@${pkg.version}`)
  log()

  // 拼接得到项目目录
  const targetDirectory = path.join(cwd, projectName);
  // 判断目录是否存在
  if (fs.existsSync(targetDirectory)) {
    // 判断是否使用 --force 参数
    if (options.force) {
      // 删除重名目录(remove是个异步方法)
      await fs.remove(targetDirectory);
    } else {
      let { isOverwrite } = await new Inquirer.prompt([
        {
          name: "isOverwrite",
          type: "list",
          message: `项目目录 ${chalk.cyan(targetDirectory)} 已经存在，请选择以下操作：`,
          choices: [
            { name: "覆盖", value: true },
            { name: "取消", value: false },
          ],
        },
      ]);
      if (!isOverwrite) {
        process.exit(1)
      } else {
        log()
        logWithSpinner(`删除目录 ${chalk.cyan(targetDirectory)}`)
        await fs.remove(targetDirectory);
        stopSpinner()
        log()
      }
    }
  }

  // 开始创建项目
  const creator = new Creator(name, targetDirectory)
  await creator.create(options)
};