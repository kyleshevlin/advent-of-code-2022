const { solution1, solution2 } = require('./')

const input = `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`

test('solution1', () => {
  expect(solution1(input)).toEqual(157)
})

test('solution2', () => {
  expect(solution2(input)).toEqual(70)
})
