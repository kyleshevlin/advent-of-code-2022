const { solution1, solution2 } = require('./')

const input = `
A Y
B X
C Z
`

test('solution1', () => {
  expect(solution1(input)).toEqual(15)
})

test('solution2', () => {
  expect(solution2(input)).toEqual(12)
})
