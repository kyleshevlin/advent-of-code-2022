const { getData, add, trace } = require('../utils')

const data = getData(__dirname)

function getPairs(input) {
  return input
    .trim()
    .split('\n')
    .map(str => str.split(' '))
}

const POINTS_PER_TYPE = {
  X: 1,
  Y: 2,
  Z: 3,
}

const POINTS_PER_RESULT_TYPE = {
  lose: 0,
  draw: 3,
  win: 6,
}

const COMBOS = {
  A: {
    X: 'draw',
    Y: 'win',
    Z: 'lose',
  },
  B: {
    X: 'lose',
    Y: 'draw',
    Z: 'win',
  },
  C: {
    X: 'win',
    Y: 'lose',
    Z: 'draw',
  },
}

function getTotalFromPairs(input) {
  return (
    getPairs(input)
      .map(([them, you]) => [you, COMBOS[them][you]])
      // .map(trace('after combos'))
      .map(
        ([type, result]) =>
          POINTS_PER_TYPE[type] + POINTS_PER_RESULT_TYPE[result]
      )
      // .map(trace('sum'))
      .reduce(add, 0)
  )
}

const firstAnswer = getTotalFromPairs(data)
// console.log(firstAnswer) // 11603

const DESIRED_RESULT = {
  X: 'lose',
  Y: 'draw',
  Z: 'win',
}

const THEM_TO_DESIRED_RESULT_TO_WHAT_YOU_SHOULD_THROW = {
  A: {
    X: 'Z',
    Y: 'X',
    Z: 'Y',
  },
  B: {
    X: 'X',
    Y: 'Y',
    Z: 'Z',
  },
  C: {
    X: 'Y',
    Y: 'Z',
    Z: 'X',
  },
}

function alternateGetTotalFromPairs(input) {
  return (
    getPairs(input)
      .map(([them, desiredResult]) => [
        THEM_TO_DESIRED_RESULT_TO_WHAT_YOU_SHOULD_THROW[them][desiredResult],
        DESIRED_RESULT[desiredResult],
      ])
      // .map(trace('after first loop'))
      .map(
        ([type, result]) =>
          POINTS_PER_RESULT_TYPE[result] + POINTS_PER_TYPE[type]
      )
      // .map(trace('after adding'))
      .reduce(add, 0)
  )
}

const secondAnswer = alternateGetTotalFromPairs(data)
// console.log(secondAnswer) // 12725

module.exports = {
  alternateGetTotalFromPairs,
  getTotalFromPairs,
}
