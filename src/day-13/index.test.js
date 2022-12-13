const { solution1, solution2 } = require('./')

const input = `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`

test('solution1', () => {
  expect(solution1(input)).toEqual(13)
})

test('solution2', () => {
  expect(solution2(input)).toEqual(140)
})
