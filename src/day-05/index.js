/**
 * Day 5 involved stacks of crates. So naturally, we use stack data structures.
 *
 * Problem 1 involves parsing a set of stacks and moves, and applying those
 * moves to the items in those stacks. Then we `peek` the top item of each stack.
 *
 * Problem 2 allows you to move a quantity of items _in order_. Rather than
 * rewrite the API of a stack to do this, we just use a temporary stack. Move
 * the items to the temp stack, then to their final destination. 💥 Order of
 * items preserved!
 */

const { createStack, getData } = require('../utils')

const data = getData(__dirname)

/**
 * Did this hard coded because I couldn't come up with a way to parse the actual
 * text fast enough. Pass it in as an arg to the solution so I can use a different
 * set of indices in the tests.
 */
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

/**
 * Takes a string like "move 2 from 4 to 7" and parses it
 */
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

  const result = stacks.map(stack => stack.peek()).join('')

  return result
}

const firstAnswer = solution1(data)
// console.log(firstAnswer) // TPGVQPFDH

function solution2(input, crateIndexes = CRATE_INDEXES) {
  const { stacks, moves } = formatInput(input, crateIndexes)

  for (const move of moves) {
    const { quantity, from, to } = move
    const fromIdx = from - 1
    const toIdx = to - 1
    // Stacks on stacks is the key to keeping them in order
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

  const result = stacks.map(stack => stack.peek()).join('')

  return result
}

const secondAnswer = solution2(data)
// console.log(secondAnswer) // DMRDFRHHH

module.exports = {
  solution1,
  solution2,
}
