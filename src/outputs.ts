import { setOutput } from '@actions/core'

export const setCommand = (command: string) => setOutput('command', command)
