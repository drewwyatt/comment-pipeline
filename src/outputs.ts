import { setOutput } from '@actions/core'

export const setCommand = (command: string) => setOutput('command', command)

export const setArguments = (args: string) => setOutput('arguments', args)

export const setInvocation = (invocation: string) => setOutput('invocation', invocation)
