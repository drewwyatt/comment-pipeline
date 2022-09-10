import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import { test } from '@jest/globals'

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
