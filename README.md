# 🗨️ ⚙️ comment-pipeline

Run workflows with comment commands

## Getting Started

Check out the [Example Workflow](.github/workflows/example.yml).

```yml
on: issue_comment

name: Example

jobs:
  parse-comment:
    runs-on: ubuntu-latest
    if: ${{ github.event.issue.pull_request }}
    outputs:
      command: ${{ steps.parse-comment.outputs.command }}
    steps:
      - uses: drewwyatt/comment-pipeline@v1
        id: parse-comment
        with:
          comment: ${{ toJSON(github.event.comment) }}
          commands: |
            /format
            /rebase
          github-token: ${{ secrets.GITHUB_TOKEN }}

  format:
    runs-on: ubuntu-latest
    needs: [parse-comment]
    if: ${{ needs.parse-comment.outputs.command == '/format' }}
    steps:
      - run: echo 'formatting...'

  rebase:
    runs-on: ubuntu-latest
    needs: [parse-comment]
    if: ${{ needs.read-comment.outputs.command == '/rebase' }}
    steps:
      - run: echo 'rebasing...'

```

![image](https://user-images.githubusercontent.com/1727821/189549606-2c833b00-29e0-47c4-a2f2-c97eb93b6789.png)

## Inputs

### `commands`

Newline delimited list of commands that should trigger workflows.

e.g.

```yml
# just one
commands: build

# more than one
# (the slashes are not required that is totally up to your preference)
commands: |
  /format
  /rebase
```

⚠️ **NOTE:** comments must _start_ with commands in order to trigger a workflow. SO:

If you passed `/format` and `/rebase` like above, the following comments would all trigger this action:

- "/format"
- "/format this please"
- "/rebase 🔥"

these would ✖️ **not** ✖️

- "rebase"
- "please /format this PR"

### `comment`

The comment object (usually `github.event.comment`)

you probably always want to do exactly [what you see in the example workflow](.github/workflows/example.yml#L16).

```yml
comment: ${{ toJSON(github.event.comment) }}
```

### `github-token`

Almost always should be `${{ secrets.GITHUB_TOKEN }}`

### `reaction` (optional - defaults to ":+1:")

Emoji reaction used to acknowledge comment.

**Possible options:**

- `+1`
- `-1`
- `laugh`
- `confused`
- `heart`
- `hooray`
- `rocket`
- `eyes`

## Outputs

### `comand` (can be empty)

The matched command (from `inputs.commands`) - **this will be an empty if there is no match**.

This is most commonly used to determine if a job or step should run. e.g.

In the example workflow, if one left a comment "/format this please", `outputs.command` would be "/format" (because that is the exact command input match).

```yml
jobs:
  parse-comment:
    runs-on: ubuntu-latest
    if: ${{ github.event.issue.pull_request }}
    outputs:
      command: ${{ steps.parse-comment.outputs.command }}
    steps:
      - uses: actions/checkout@v2
      - uses: ./
        id: parse-comment
        with:
          comment: ${{ toJSON(github.event.comment) }}
          commands: |
            /format
            /rebase
          github-token: ${{ secrets.GITHUB_TOKEN }}

  format:
    runs-on: ubuntu-latest
    needs: [parse-comment]
    if: ${{ needs.parse-comment.outputs.command == '/format' }} # <------ SEE HERE
    steps:
      - run: echo 'formatting...'
```

### `arguments` (can be empty)

This may be useful if you would like to specify additional information other than the command. You can see some examples of args in [the tests](__tests__/main.test.ts#L11-L38), like:

Given the comment "/format this please" (using previous config examples above), `outputs.arguments` would be "this please".

Given a config where `inputs.commands` includes `deploy`, and a comment "deploy:stage", `outputs.arguments` would be ":stage".

### `invocation` (can be empty)

The entire comment body (if a command match was found).
