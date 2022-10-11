#! /usr/bin/env node
const {program} = require('commander')

program
  .name('gzh-cli')
  .usage(`<command> [option]`)
  .version(`gzh-cli ${require('../package.json').version}`)
  .command('create <project-name>')
  .description('create a new miniprogram template project')
  .option("-f, --force", "overwrite target directory if it exists")
  .action((projectName, cmd) => {
    // 调用create模块
    require('../lib/cmd/create')(projectName, cmd)
  });
program.parse()
