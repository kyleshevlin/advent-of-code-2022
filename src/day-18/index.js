const { getData, intersection } = require('../utils')

const data = getData(__dirname)

function parseInput(input) {
  return input.trim().split('\n')
}

const stringToTuple = str => str.split(',').map(Number)
const tupleToString = tup => tup.join(',')

const getNeighborKeys = cubeStr => {
  const [x, y, z] = stringToTuple(cubeStr)

  return [
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y + 1, z],
    [x, y - 1, z],
    [x, y, z + 1],
    [x, y, z - 1],
  ].map(tupleToString)
}

function solution1(input) {
  const cubes = parseInput(input)
  const cubeSet = new Set(cubes)

  // Let's solve this naively for now
  let sides = 0
  for (const cube of cubes) {
    const neighbors = new Set(getNeighborKeys(cube))
    const intersected = intersection(cubeSet, neighbors)

    sides += 6 - intersected.size
  }

  return sides
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 3662

function solution2(input) {}

const secondAnswer = solution2(data)
// console.log(secondAnswer)

module.exports = {
  solution1,
  solution2,
}
