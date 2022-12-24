const { solution1, solution2 } = require('./')

const input = `
1
2
-3
3
-2
0
4
`

test('solution1', () => {
  expect(solution1(input)).toEqual(3)
})

test('solution2', () => {
  expect(solution2(input)).toEqual(1623178306)
})
