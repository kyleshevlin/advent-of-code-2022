const { getData, sum } = require('../utils')

const data = getData(__dirname)

function parseInput(input) {
  return input
    .trim()
    .split('\n\n')
    .map(pairs => pairs.split('\n').map(JSON.parse))
}

function compareLists(left, right) {
  const tmpLeft = [...left]
  const tmpRight = [...right]
  let result

  while (tmpLeft.length && tmpRight.length) {
    let leftItem = tmpLeft.shift()
    let rightItem = tmpRight.shift()

    if (typeof leftItem === 'number' && typeof rightItem === 'number') {
      if (leftItem < rightItem) {
        result = 'correct'
        break
      }

      if (leftItem > rightItem) {
        result = 'wrong'
        break
      }

      if (leftItem === rightItem) {
        continue
      }
    }

    if (!Array.isArray(leftItem)) {
      leftItem = [leftItem]
    }

    if (!Array.isArray(rightItem)) {
      rightItem = [rightItem]
    }

    result = compareLists(leftItem, rightItem)

    if (result === 'correct') break
    if (result === 'wrong') break
  }

  if (result) return result

  if (tmpLeft.length && !tmpRight.length) result = 'wrong'
  if (tmpRight.length && !tmpLeft.length) result = 'correct'

  return result
}

function solution1(input) {
  const pairs = parseInput(input)
  const indices = []

  for (const [idx, [left, right]] of pairs.entries()) {
    const result = compareLists(left, right)

    if (result === 'correct') {
      indices.push(idx + 1)
    }
  }

  return sum(indices)
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 6478

function secondParseInput(input) {
  return input.trim().split('\n').filter(Boolean).map(JSON.parse)
}

function solution2(input) {
  const lines = secondParseInput(input)
  const div1 = [[2]]
  const div2 = [[6]]
  const allLines = [...lines, div1, div2]
  const sorted = allLines.sort((a, b) => {
    const result = compareLists(a, b)

    if (result === 'correct') return -1
    if (result === 'wrong') return 1
    return 0
  })

  const div1Index = sorted.findIndex(x => x === div1) + 1
  const div2Index = sorted.findIndex(x => x === div2) + 1

  return div1Index * div2Index
}

// const secondAnswer = solution2(data)
// console.log(secondAnswer) // 21922

module.exports = {
  solution1,
  solution2,
}
