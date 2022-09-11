import type { Comment } from './inputs'

interface Outputs {
  arguments: string
  command: string
  invocation: string
}

const parseOutputs = (command: string, comment: Comment): Outputs => {
  const invocation = comment.body

  return {
    arguments: invocation.replace(command, '').trim(),
    command,
    invocation,
  }
}

export default parseOutputs
