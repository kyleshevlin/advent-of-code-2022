const { solution1, solution2 } = require('./')

const input = `
....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..
`

test('solution1', () => {
  expect(solution1(input)).toEqual(110)
})

test('solution2', () => {
  expect(solution2(input)).toEqual(20)
})
