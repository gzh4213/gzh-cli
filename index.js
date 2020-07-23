#! /usr/bin/env node

const program = require('commander')
const download = require('download-git-repo')

program.version('1.0.0', '-v --version')
  .command('init <templateName> <projectName>')
  .action((templateName, projectName) => {
    if (templateName === 'vue') {
      console.log('clone template ...')
      // download('')
    }
  })

program.parse(process.argv)