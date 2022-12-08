const { solution1, solution2 } = require('./')

const input = `
30373
25512
65332
33549
35390
`

test('solution1', () => {
  expect(solution1(input)).toEqual(21)
})

test('solution2', () => {
  expect(solution2(input)).toEqual(8)
})
