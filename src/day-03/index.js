/**
 * Day 3 involved elves carrying items in rucksacks. Each sack had two equal
 * compartments, but there's ONE item that's incorrectly placed. We gotta find
 * that item.
 *
 * The incorrect item is the single value found in both compartments. This is a
 * perfect use of Set intersection! Turning the items (characters) of each compartment
 * into a set makes finding their intersection a breeze.
 *
 * After that, it's mapping the character to a numeric value, and summing those
 * values.
 */

const { add, getData, intersection, map, pipe, reduce } = require('../utils')

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
  const sharedItem = intersection(...sets)

  return Array.from(sharedItem)[0]
}

const CHARACTER_ORDER =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function getPriority(item) {
  const index = CHARACTER_ORDER.findIndex(char => char === item)

  return index + 1
}

function solution1(input) {
  return getRucksacks(input)
    .map(splitRucksack)
    .map(compartments => findSharedItem(...compartments))
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
  return pipe(
    getRucksacks,
    getGroups,
    map(group => findSharedItem(...group)),
    map(getPriority),
    reduce(add, 0)
  )(input)
}

const secondAnswer = solution2(data)
// console.log(secondAnswer) // 2681

module.exports = {
  solution1,
  solution2,
}
