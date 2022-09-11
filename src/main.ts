import * as core from '@actions/core'
import * as github from '@actions/github'

import * as inputs from './inputs'
import * as outputs from './outputs'
import parseOutputs from './parse-outpits'

async function run(): Promise<void> {
  try {
    core.debug('Cogging inputs...')
    core.debug(`inputs.commands: ${inputs.commands}`)
    core.debug(`inputs.comment.body: ${inputs.comment.body}`)
    core.debug(`inputs.comment.id: ${inputs.comment.id}`)

    core.info(`Checking comment for commands...`)
    const command = inputs.commands.find(c => inputs.comment.body.startsWith(c))

    if (!command) {
      core.info('No command found in comment body. Exiting. 👋')
      return
    }

    core.info(`Found command: "${command}"...`)
    outputs.setCommand(command)

    const { arguments: args, invocation } = parseOutputs(command, inputs.comment)

    if (args) {
      core.info(`Setting args to: "${args}"`)
    }
    outputs.setArguments(args)

    core.debug(`Setting invocation to: "${invocation}"`)
    outputs.setInvocation(invocation)

    core.debug('Creating octokit...')
    const octokit = github.getOctokit(inputs.token)
    core.debug(`Acknowledging comment with id ${inputs.comment.id}...`)
    await octokit.rest.reactions.createForIssueComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      comment_id: inputs.comment.id,
      content: inputs.reaction,
    })

    core.info('Done! 👋')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
