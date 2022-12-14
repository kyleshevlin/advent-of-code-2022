const { solution1, solution2 } = require('./')

const input = `
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`

test('solution1', () => {
  expect(solution1(input)).toEqual(24)
})

test('solution2', () => {
  expect(solution2(input)).toEqual(undefined)
})
