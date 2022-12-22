const { solution1, solution2 } = require('./')

const input = `
2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5
`

test('solution1', () => {
  expect(solution1(input)).toEqual(64)
})

test('solution2', () => {
  expect(solution2(input)).toEqual(58)
})
