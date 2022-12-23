const { solution1, solution2 } = require('./')

const input = `
Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.
`

test('solution1', () => {
  expect(solution1(input)).toEqual(33)
})

test('solution2', () => {
  expect(solution2(input)).toEqual(undefined)
})
