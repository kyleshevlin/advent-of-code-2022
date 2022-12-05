/**
 * Day 4 involved elves having to clean up sections of their camp.
 * To do this, each pair of elves is assigned a set of consecutive sections.
 *
 * First problem was to determine if one elf is cleaning section entirely
 * contained by the other elf. This can be solved, but comparing the `from`s of
 * both elves and the `to`s of each elf's range.
 *
 * The second problem was to determine if there was any overlap at all. This
 * could be solved with set intersection (again). We create a range of _all_ the
 * sections an elf had to clean, and if there are any sections in the
 * intersection of those two sets, then we know we have overlap.
 */

const { getData, intersection, createRange } = require('../utils')

const data = getData(__dirname)

function getPairs(input) {
  return input
    .trim()
    .split('\n')
    .map(str =>
      str.split(',').map(str => {
        const [from, to] = str.split('-').map(Number)
        return { from, to }
      })
    )
}

function checkContains(a, b) {
  return a.from <= b.from && a.to >= b.to
}

function solution1(input) {
  return getPairs(input)
    .map(([a, b]) => checkContains(a, b) || checkContains(b, a))
    .filter(Boolean).length
}

const firstAnswer = solution1(data)
// console.log(firstAnswer) // 444

function checkOverlap(a, b) {
  const setA = new Set(createRange(a.from, a.to))
  const setB = new Set(createRange(b.from, b.to))

  return intersection(setA, setB).size > 0
}

function solution2(input) {
  return getPairs(input)
    .map(([a, b]) => checkOverlap(a, b))
    .filter(Boolean).length
}

const secondAnswer = solution2(data)
// console.log(secondAnswer) // 801

module.exports = {
  solution1,
  solution2,
}
