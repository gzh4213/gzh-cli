const EventEmitter = require('events')
const execa = require('execa')
const chalk = require('chalk')
const inquirer = require('inquirer')
const loadRemotePreset = require('../lib/utils/loadRemotePreset')
const { defaults } = require('../lib/options')

const {
	log,
	error,
	hasYarn,
	hasGit,
	hasProjectGit,
	logWithSpinner,
	clearConsole,
	stopSpinner,
	exit,
} = require('../lib/utils/common')

module.exports = class Creator extends EventEmitter {
	constructor(name, context) {
		super()
		this.name = name
		this.context = context
		this.run = this.run.bind(this)
	}

	async create(cliOptions = {}, preset = null) {
		const { run, name, context } = this
		console.log(cliOptions)
		if (cliOptions.preset) {
			// gzh-cli create test -p temp
			preset = await this.resolvePreset(
				cliOptions.preset,
				cliOptions.clone
			)
		} else {
			preset = await this.resolvePreset(
				defaults.presets.default,
				cliOptions.clone
			)
		}
	}

	async resolvePreset(name, clone) {
		let preset
		logWithSpinner(`Fetching remote preset ${chalk.cyan(name)}...`)
		this.emit('creation', { event: 'fetch-remote-preset' })
		try {
			preset = await loadRemotePreset(name, this.context, clone)
			stopSpinner()
		} catch (e) {
			stopSpinner()
			error(`Failed fetching remote preset ${chalk.cyan(name)}:`)
			throw e
		}

		// 默认使用default参数
		if (name === 'default' && !preset) {
			preset = defaults.presets.default
		}

		if (!preset) {
			error(`preset "${name}" not found.`)
			exit(1)
		}

		return preset
	}

	run(command, args) {
		if (!args) {
			;[command, ...args] = command.split(/\s+/)
			return execa(command, args, { cwd: this.context })
		}
	}
}
