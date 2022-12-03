const { add, getData, intersection } = require('../utils')

const data = getData(__dirname)

function getRucksacks(input) {
  return input.trim().split('\n')
}

function splitRucksack(item) {
  const midIndex = item.length / 2

  return [item.slice(0, midIndex), item.slice(midIndex)]
}

function findSharedItem(...strs) {
  const sets = strs.map(str => new Set([...str]))
  const [first, second, ...rest] = sets

  let result = intersection(first, second)

  for (const set of rest) {
    result = intersection(result, set)
  }

  return Array.from(result)[0]
}

const characterOrder =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function getPriority(item) {
  const index = characterOrder.findIndex(char => char === item)

  return index + 1
}

function solution1(input) {
  return getRucksacks(input)
    .map(splitRucksack)
    .map(([comp1, comp2]) => findSharedItem(comp1, comp2))
    .map(getPriority)
    .reduce(add, 0)
}

const firstAnswer = solution1(data)
// console.log(firstAnswer) // 8349

function getGroups(items) {
  const groups = []

  let currentGroup = []
  for (const item of items) {
    currentGroup.push(item)

    if (currentGroup.length === 3) {
      groups.push(currentGroup)
      currentGroup = []
    }
  }

  return groups
}

function solution2(input) {
  const rucksacks = getRucksacks(input)
  const groups = getGroups(rucksacks)
  const badges = groups.map(group => findSharedItem(...group))
  const result = badges.map(getPriority).reduce(add, 0)

  return result
}

const secondAnswer = solution2(data)
// console.log(secondAnswer) // 2681

module.exports = {
  solution1,
  solution2,
}
