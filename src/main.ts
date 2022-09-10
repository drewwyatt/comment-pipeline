import * as core from '@actions/core'
import * as github from '@actions/github'

import * as inputs from './inputs'
import * as outputs from './outputs'

async function run(): Promise<void> {
  try {
    core.debug(`checking comment for commands: ${inputs.commands}...`)

    core.debug(`comment body: "${inputs.comment.body}"`)
    const command = inputs.commands.find(c => inputs.comment.body.startsWith(c))

    if (!command) {
      core.debug('no command found in comment body. exiting...')
      return
    }

    core.debug(`found command: ${command}...`)
    outputs.setCommand(command)

    core.debug('creating octokit...')
    const octokit = github.getOctokit(inputs.token)
    core.debug(`acknowledging comment with id ${inputs.comment.id}...`)
    await octokit.rest.reactions.createForIssueComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      comment_id: inputs.comment.id,
      content: inputs.reaction,
    })

    core.debug('done!')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
