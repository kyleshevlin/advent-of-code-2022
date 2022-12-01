const { getData } = require('../utils')

const data = getData(__dirname)

module.exports = {
  getElves,
  getGreatestCalorieSum,
  getGreatestCalorieSumOfTopThree,
}

function getElves(input) {
  return input
    .trim()
    .split('\n\n')
    .map(str => str.split('\n').map(Number))
}

const sum = nums => nums.reduce((x, y) => x + y, 0)

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
