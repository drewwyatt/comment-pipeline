import { getInput } from '@actions/core'
import * as z from 'zod'

const zComment = z.object({
  id: z.number(),
  body: z.string(),
})
const commentString = z.preprocess(str => JSON.parse(str as string), zComment)

const zReaction = z.enum([
  '+1',
  '-1',
  'laugh',
  'confused',
  'heart',
  'hooray',
  'rocket',
  'eyes',
])

export type Comment = z.TypeOf<typeof zComment>
export type Reaction = z.TypeOf<typeof zReaction>

export const commands = getInput('commands', { required: true })
  .split('\n')
  .filter(Boolean)
export const comment = commentString.parse(getInput('comment', { required: true }))
export const reaction = zReaction.parse(getInput('reaction', { required: true }))
export const token = getInput('github-token', { required: true })
