const { createStack, createQueue, getData } = require('../utils')

const data = getData(__dirname)

const CRATE_INDEXES = [1, 5, 9, 13, 17, 21, 25, 29, 33]

function formatInput(input, crateIndexes) {
  let [stacks, moves] = input.split('\n\n')

  const stacksInRows = stacks.split('\n').reverse().slice(1)

  const stacksActual = Array(crateIndexes.length)
    .fill()
    .map(() => createStack())

  for (const row of stacksInRows) {
    for (const [stackIdx, crateIdx] of crateIndexes.entries()) {
      const value = row[crateIdx] ?? ''

      if (value.trim()) {
        stacksActual[stackIdx].push(value)
      }
    }
  }

  moves = moves.trim().split('\n').map(parseMove)

  return { stacks: stacksActual, moves }
}

function parseMove(str) {
  const [quantity, from, to] = str
    .replace('move ', '')
    .replace(' from ', '-')
    .replace(' to ', '-')
    .split('-')
    .map(Number)

  return { quantity, from, to }
}

function solution1(input, crateIndexes = CRATE_INDEXES) {
  const { stacks, moves } = formatInput(input, crateIndexes)

  for (const move of moves) {
    const { quantity, from, to } = move
    const fromIdx = from - 1
    const toIdx = to - 1

    for (let i = 0; i < quantity; i++) {
      const item = stacks[fromIdx].pop()
      stacks[toIdx].push(item)
    }
  }

  const result = stacks.map(stack => stack.peek())

  return result.join('')
}

const firstAnswer = solution1(data)
// console.log(firstAnswer) // TPGVQPFDH

function solution2(input, crateIndexes = CRATE_INDEXES) {
  const { stacks, moves } = formatInput(input, crateIndexes)

  for (const move of moves) {
    const { quantity, from, to } = move
    const fromIdx = from - 1
    const toIdx = to - 1
    const tmp = createStack()

    for (let i = 0; i < quantity; i++) {
      const item = stacks[fromIdx].pop()
      tmp.push(item)
    }

    while (!tmp.isEmpty()) {
      const item = tmp.pop()
      stacks[toIdx].push(item)
    }
  }

  const result = stacks.map(stack => stack.peek())

  return result.join('')
}

const secondAnswer = solution2(data)
// console.log(secondAnswer) // DMRDFRHHH

module.exports = {
  solution1,
  solution2,
}
