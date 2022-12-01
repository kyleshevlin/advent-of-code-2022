const { getData, sum } = require('../utils')

module.exports = {
  getElves,
  getGreatestCalorieSum,
  getGreatestCalorieSumOfTopThree,
}

const data = getData(__dirname)

function getElves(input) {
  return input
    .trim()
    .split('\n\n')
    .map(str => str.split('\n').map(Number))
}

function getGreatestCalorieSum(input) {
  return Math.max(...getElves(input).map(sum))
}

function getGreatestCalorieSumOfTopThree(input) {
  const sums = getElves(input)
    .map(sum)
    .sort((a, b) => b - a)

  return sum(sums.slice(0, 3))
}

const firstAnswer = getGreatestCalorieSum(data)
// console.log(firstAnswer) // 68467
const secondAnswer = getGreatestCalorieSumOfTopThree(data)
// console.log(secondAnswer) // 203420
