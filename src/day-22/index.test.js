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

const ROWS_AND_COLS = [
  [
    [0, 4],
    [8, 12],
  ],
  [
    [4, 8],
    [0, 4],
  ],
  [
    [4, 8],
    [4, 8],
  ],
  [
    [4, 8],
    [8, 12],
  ],
  [
    [8, 12],
    [8, 12],
  ],
  [
    [8, 12],
    [12, 16],
  ],
]

// Map each grids direction to the grid and new direction they'd go to
const MAPPING = {
  A: {
    N: ['B', 'S'],
    E: ['F', 'W'],
    S: ['D', 'S'],
    W: ['C', 'S'],
  },
  B: {
    N: ['A', 'S'],
    E: ['C', 'E'],
    S: ['E', 'N'],
    W: ['F', 'N'],
  },
  C: {
    N: ['A', 'E'],
    E: ['D', 'E'],
    S: ['E', 'E'],
    W: ['B', 'W'],
  },
  D: {
    N: ['A', 'N'],
    E: ['F', 'S'],
    S: ['E', 'S'],
    W: ['C', 'W'],
  },
  E: {
    N: ['D', 'N'],
    E: ['F', 'E'],
    S: ['B', 'N'],
    W: ['C', 'N'],
  },
  F: {
    N: ['D', 'W'],
    E: ['A', 'W'],
    S: ['B', 'E'],
    W: ['E', 'W'],
  },
}

test('solution2', () => {
  expect(solution2(input, ROWS_AND_COLS, MAPPING)).toEqual(5031)
})
