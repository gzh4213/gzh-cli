#! /usr/bin/env node
const chalk = require('chalk')
// 开始处理命令
const program = require('commander')

program
  .version( require('../package.json').version, '-V --version')
  .usage('<command> [options]')

// 创建命令
program
  .command('create <project-name>')
  .description('create a new project')
  .option('-d, --default', 'use default')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)
    console.log(options)
    require('../lib/create')(name, options)
  })

program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
    // suggestCommands(cmd)
  })

// 调用
program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

function camelize (str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}
// 获取参数
function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // 如果没有传递option或者有与之相同的命令，则不被拷贝
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}