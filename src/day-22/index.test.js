const { solution1, solution2 } = require('./')

const input = `
        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5
`

test('solution1', () => {
  expect(solution1(input)).toEqual(6032)
})

test('solution2', () => {
  expect(solution2(input)).toEqual(5031)
})
