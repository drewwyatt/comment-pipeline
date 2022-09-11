import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import { describe, expect, test } from '@jest/globals'

import parseOutputs from '../src/parse-outpits'

const toComment = (body: string) => ({ id: -1, body })

describe('parseOutputs', () => {
  test('no args', () => {
    const command = '/rebase'
    expect(parseOutputs(command, toComment(command))).toEqual({
      command,
      arguments: '',
      invocation: command,
    })
  })

  test('no space between command and args', () => {
    expect(parseOutputs('deploy', toComment('deploy:stage'))).toEqual({
      command: 'deploy',
      arguments: ':stage',
      invocation: 'deploy:stage',
    })
  })

  test('trims whitespace', () => {
    const command = 'format'
    const args = `path/to/some/file.ts`
    const invocation = `${command}            ${args}     `

    expect(parseOutputs(command, toComment(invocation))).toEqual({
      command: 'format',
      arguments: args,
      invocation,
    })
  })
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_COMMANDS'] = `
    /format
    /rebase
  `
  process.env['INPUT_COMMENT'] = JSON.stringify({ id: 12345, body: 'lol wow' })
  process.env['INPUT_REACTION'] = '+1'
  process.env['INPUT_GITHUB-TOKEN'] = '🤫🤫🤫🤫🤫🤫'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env,
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
