/**
 * Day 6 involves parsing a substring for unique characters. This is really simple
 * with the use of Sets.
 *
 * Sets are a collection of unique items. You'll never have a duplicate item in
 * a set. So substrings with duplicated characters will have a smaller size than a
 * substring that has all unique characters.
 *
 * Thus, we check that a set is the size of the substring length want and we
 * break our loop at that index.
 */

const { getData } = require('../utils')

const data = getData(__dirname)

function indexOfFirstSetAllUniqueCharacters(input, size) {
  let i
  for (i = size; i < input.length - 1; i++) {
    const chars = input.substring(i - size, i).split('')
    const set = new Set(chars)

    if (set.size === size) break
  }

  return i
}

function solution1(input) {
  return indexOfFirstSetAllUniqueCharacters(input, 4)
}

const firstAnswer = solution1(data)
// console.log(firstAnswer) // 1702

function solution2(input) {
  return indexOfFirstSetAllUniqueCharacters(input, 14)
}

const secondAnswer = solution2(data)
// console.log(secondAnswer) // 3559

module.exports = {
  solution1,
  solution2,
}
