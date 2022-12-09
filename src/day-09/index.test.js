const { solution1, solution2 } = require('./')

const input = `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`

test('solution1', () => {
  expect(solution1(input)).toEqual(13)
})

const input2 = `
R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
`

test('solution2', () => {
  expect(solution2(input)).toEqual(1)
  expect(solution2(input2)).toEqual(36)
})
