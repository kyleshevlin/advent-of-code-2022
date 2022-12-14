/**
 * Day 13 involves recursive sorting. The challenge here is controlling when we
 * continue our comparison and when we return a result. I was able to chop this
 * down quite a ways once you get your head around the rules. If you have to,
 * change your test input to focus on a single pair at a time til you get the
 * comparison function working like you want.
 *
 * Two little tricks I enjoyed using here:
 * - `toArray`: I love making little functions like this to normalize data structures
 * - I used an enum of states: `correct` and `wrong` instead of `-1` and `1`. I
 *   think it makes the code easier to read, and then it's a very simple map
 *   at the end to the necessary values for sorting.
 */
const { getData, sum } = require('../utils')

const data = getData(__dirname)

function parseInput(input) {
  return input
    .trim()
    .split('\n\n')
    .map(pairs => pairs.split('\n').map(JSON.parse))
}

const isNumber = x => typeof x === 'number'

const toArray = x => (Array.isArray(x) ? x : [x])

function compareLists(left, right) {
  const cloneLeft = [...left]
  const cloneRight = [...right]

  while (cloneLeft.length && cloneRight.length) {
    const leftItem = cloneLeft.shift()
    const rightItem = cloneRight.shift()

    if (isNumber(leftItem) && isNumber(rightItem)) {
      if (leftItem < rightItem) return 'correct'
      if (leftItem > rightItem) return 'wrong'
      if (leftItem === rightItem) continue
    }

    const result = compareLists(toArray(leftItem), toArray(rightItem))

    if (result) return result
  }

  if (cloneRight.length && !cloneLeft.length) return 'correct'
  if (cloneLeft.length && !cloneRight.length) return 'wrong'
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

const RESULT_TO_SORT_INT = {
  correct: -1,
  wrong: 1,
}

function solution2(input) {
  const lines = secondParseInput(input)
  const div1 = [[2]]
  const div2 = [[6]]
  const allLines = [...lines, div1, div2]
  const sorted = allLines.sort((a, b) => {
    const result = compareLists(a, b)

    return RESULT_TO_SORT_INT[result]
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
