const { getData, add, sum } = require('../utils')

const data = getData(__dirname)

const SNAFU_TO_DECIMAL = {
  2: 2,
  1: 1,
  0: 0,
  '-': -1,
  '=': -2,
}

function toSnafu(value) {
  if (value === 0) return '0'

  function recurse(value) {
    if (value === 0) return ''

    const remainder = value % 5
    const floored = Math.floor(value / 5)

    switch (remainder) {
      case 0:
      case 1:
      case 2:
        return recurse(floored) + String(remainder)

      case 3:
        return recurse(1 + floored) + '='

      case 4:
        return recurse(1 + floored) + '-'
    }
  }

  return recurse(value)
}

function toDecimal(snafu) {
  return snafu.split('').reduceRight((acc, cur, idx) => {
    const value = SNAFU_TO_DECIMAL[cur]
    const power = snafu.length - idx - 1
    const result = value * Math.pow(5, power)

    return acc + result
  }, 0)
}

function parseInput(input) {
  return input.trim().split('\n')
}

function solution1(input) {
  const snafus = parseInput(input)
  return toSnafu(sum(snafus.map(toDecimal)))
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 2-==10--=-0101==1201

function solution2(input) {}

// const secondAnswer = solution2(data)
// console.log(secondAnswer)

module.exports = {
  solution1,
  solution2,
  toDecimal,
  toSnafu,
}
