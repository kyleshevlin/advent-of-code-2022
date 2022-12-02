/**
 * Day 2 involved a game of Rock, Paper, Scissors with different point totals
 * based on what YOU chose and the RESULT of the round.
 *
 * I recognized right away that each pair of letters maps to a particular number.
 * For ex. every `A Y` pair will be worth 8 for the first solution, `B X` worth 1, etc.
 * However, I felt like modeling the problem as a set of Maps was more accurate.
 * The result will be just the same, and I wrote more code, but it follows my
 * mental model more.
 *
 * So, for my solutions, you'll see a lot of Maps. I tried to stay consistent with
 * their naming convention. So YOU always refers to your choice, THEM their choice, etc.
 *
 * With these maps, the algorithm goes like this:
 * - Get the pairs
 * - Loop through the pairs and set up the correct tuple for that solution
 * - Map those values to a sum of their points
 * - Sum it all together
 */

const { getData, add } = require('../utils')

const data = getData(__dirname)

function getPairs(input) {
  return input
    .trim()
    .split('\n')
    .map(str => str.split(' '))
}

const YOU_TO_POINTS = {
  X: 1,
  Y: 2,
  Z: 3,
}

const RESULT_TO_POINTS = {
  lose: 0,
  draw: 3,
  win: 6,
}

const THEM_TO_YOU_TO_RESULT = {
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

function solution1(input) {
  return getPairs(input)
    .map(([them, you]) => [you, THEM_TO_YOU_TO_RESULT[them][you]])
    .map(([type, result]) => YOU_TO_POINTS[type] + RESULT_TO_POINTS[result])
    .reduce(add, 0)
}

const firstAnswer = solution1(data)
// console.log(firstAnswer) // 11603

const DESIRED_RESULT_TO_RESULT = {
  X: 'lose',
  Y: 'draw',
  Z: 'win',
}

const THEM_TO_DESIRED_RESULT_TO_YOU = {
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

function solution2(input) {
  return getPairs(input)
    .map(([them, desiredResult]) => [
      THEM_TO_DESIRED_RESULT_TO_YOU[them][desiredResult],
      DESIRED_RESULT_TO_RESULT[desiredResult],
    ])
    .map(([type, result]) => YOU_TO_POINTS[type] + RESULT_TO_POINTS[result])
    .reduce(add, 0)
}

const secondAnswer = solution2(data)
// console.log(secondAnswer) // 12725

module.exports = {
  solution1,
  solution2,
}
