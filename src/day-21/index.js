const { getData, add, subtract, multiply, divide } = require('../utils')

const data = getData(__dirname)

const OPS = ['+', '-', '*', '/']

const OP_TO_FN = {
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide,
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

function solution1(input) {
  const monkeys = parseInput(input)
  const solved = Object.fromEntries(
    Object.entries(monkeys).filter(([_, value]) => {
      return typeof value === 'number'
    })
  )

  let dirty = true
  while (dirty) {
    dirty = false

    for (const [key, value] of Object.entries(monkeys)) {
      if (solved[key] !== undefined) continue

      const [x, op, y] = value

      const xVal = solved[x]
      const yVal = solved[y]

      if (xVal !== undefined && yVal !== undefined) {
        const result = OP_TO_FN[op](xVal, yVal)
        solved[key] = result
      }

      dirty = true
    }
  }

  return solved.root
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 160274622817992

function solution2(input) {}

// const secondAnswer = solution2(data)
// console.log(secondAnswer)

module.exports = {
  solution1,
  solution2,
}
