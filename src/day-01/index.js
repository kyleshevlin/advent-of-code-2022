/**
 * Day 1 is a sorting problem. The elves are carrying food items of various
 * calorie counts. We need to sum the calories each elf, sort them from
 * greatest to least.
 *
 * The first solution asked for only the greatest calorie sum, and so Math.max
 * essentially sorts for us.
 *
 * The second asked for the top three, so sorting the sums and then summing a
 * slice of that was the trick.
 */

const { getData, sum } = require('../utils')

const data = getData(__dirname)

function getElves(input) {
  return input
    .trim()
    .split('\n\n')
    .map(str => str.split('\n').map(Number))
}

function solution1(input) {
  return Math.max(...getElves(input).map(sum))
}

function solution2(input) {
  const sums = getElves(input)
    .map(sum)
    .sort((a, b) => b - a)

  return sum(sums.slice(0, 3))
}

const firstAnswer = solution1(data)
// console.log(firstAnswer) // 68467

const secondAnswer = solution2(data)
// console.log(secondAnswer) // 203420

module.exports = {
  getElves,
  solution1,
  solution2,
}
