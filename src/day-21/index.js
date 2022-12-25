const { getData, add, subtract, multiply, divide } = require('../utils')

const data = getData(__dirname)

const OPS = ['+', '-', '*', '/']

const OP_TO_FN = {
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide,
  '=': (x, y) => x === y,
}

function parseInput(input) {
  return input
    .trim()
    .split('\n')
    .map(line => {
      const [key, value] = line.split(':').map(x => x.trim())

      let formattedValue
      if (OPS.some(op => value.includes(op))) {
        formattedValue = value.split(' ')
      } else {
        formattedValue = Number(value)
      }

      return { [key]: formattedValue }
    })
    .reduce((acc, cur) => {
      return { ...acc, ...cur }
    }, {})
}

function getSolvedMap(nodes) {
  return Object.fromEntries(
    Object.entries(nodes).filter(([_, value]) => {
      return typeof value === 'number'
    })
  )
}

function solveTree(nodes) {
  const solved = getSolvedMap(nodes)

  let dirty = true
  while (dirty) {
    dirty = false

    for (const [key, value] of Object.entries(nodes)) {
      if (solved[key] !== undefined) continue

      try {
        const [x, op, y] = value

        const xVal = solved[x]
        const yVal = solved[y]

        if (xVal !== undefined && yVal !== undefined) {
          const result = OP_TO_FN[op](xVal, yVal)
          solved[key] = result
          dirty = true
        }
      } catch (err) {
        // it's fine, don't blow up, just try again
      }
    }
  }

  return solved
}

function solution1(input) {
  const monkeys = parseInput(input)
  const solution = solveTree(monkeys)

  return solution.root
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 160274622817992

function secondParseInput(input) {
  return input
    .trim()
    .split('\n')
    .map(line => {
      const [key, value] = line.split(':').map(x => x.trim())

      let formattedValue
      if (OPS.some(op => value.includes(op))) {
        formattedValue = value.split(' ')

        if (key === 'root') formattedValue[1] = '='
      } else {
        formattedValue = Number(value)

        if (key === 'humn') formattedValue = undefined
      }

      return { [key]: formattedValue }
    })
    .reduce((acc, cur) => {
      return { ...acc, ...cur }
    }, {})
}

function hasHuman(nodes, nodeKey) {
  if (nodeKey === 'humn') return true

  const value = nodes[nodeKey]

  if (Array.isArray(value)) {
    const [x, _, y] = value
    return hasHuman(nodes, x) || hasHuman(nodes, y)
  }

  return false
}

function getCorrelation(monkeys, unsolvedKey) {
  const withZero = { ...monkeys, humn: 0 }
  const withOne = { ...monkeys, humn: 1 }

  const resultZero = solveTree(withZero)
  const resultOne = solveTree(withOne)

  return resultZero[unsolvedKey] < resultOne[unsolvedKey] ? 1 : -1
}

function binarySearchForCorrectValue(monkeys, target, unsolvedKey) {
  const correlation = getCorrelation(monkeys, unsolvedKey)

  let inc = 100_000_000_000_000
  let result = { root: false }
  let humn = 0
  let underTarget = true

  while (!result.root) {
    result = solveTree({ ...monkeys, humn })

    if (result.root) break

    if (result[unsolvedKey] > target) {
      if (underTarget) inc /= 10
      underTarget = false
      humn -= inc * correlation
    }

    if (result[unsolvedKey] < target) {
      if (!underTarget) inc /= 10
      underTarget = true
      humn += inc * correlation
    }
  }

  return result
}

function solution2(input) {
  const monkeys = secondParseInput(input)
  const [left, _, right] = monkeys.root

  let canSolveKey = null
  let unsolvedKey = null
  if (hasHuman(monkeys, left)) {
    unsolvedKey = left
    canSolveKey = right
  } else {
    unsolvedKey = right
    canSolveKey = left
  }

  const solveWhatCanBeSolved = solveTree(monkeys)
  const target = solveWhatCanBeSolved[canSolveKey]

  const result = binarySearchForCorrectValue(monkeys, target, unsolvedKey)

  return result.humn
}

// const secondAnswer = solution2(data)
// console.log(secondAnswer) // 3087390115721

module.exports = {
  solution1,
  solution2,
}
