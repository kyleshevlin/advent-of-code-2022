const { getData, safeGridGet } = require('../utils')

const data = getData(__dirname)

function parseInput(input) {
  return input
    .trim()
    .split('\n')
    .map(line => line.split(''))
}

function getElves(grid) {
  const result = []

  for (const [rowIdx, row] of grid.entries()) {
    for (const [colIdx, col] of row.entries()) {
      if (col === '#') result.push([rowIdx, colIdx])
    }
  }

  return result
}

function drawGrid(grid) {
  return `\n${grid.map(row => row.join('')).join('\n')}\n`
}

function expandGrid(grid) {
  const newLength = grid[0].length + 2

  return [
    Array(newLength).fill('.'),
    ...grid.map(row => ['.', ...row, '.']),
    Array(newLength).fill('.'),
  ]
}

function findLastIndex(arr, fn) {
  const clone = [...arr].reverse()
  const index = clone.findIndex(fn)

  if (index === -1) return index

  return clone.length - 1 - index
}

function trimGrid(grid) {
  const result = []

  const cols = []

  for (let c = 0; c < grid[0].length; c++) {
    const col = []
    for (let r = 0; r < grid.length; r++) {
      col.push(grid[r][c])
    }
    cols.push(col)
  }

  const firstRow = grid.findIndex(row => row.includes('#'))
  const firstCol = cols.findIndex(col => col.includes('#'))
  const lastRow = findLastIndex(grid, row => row.includes('#'))
  const lastCol = findLastIndex(cols, col => col.includes('#'))

  for (let r = firstRow; r <= lastRow; r++) {
    const row = []

    for (let c = firstCol; c <= lastCol; c++) {
      row.push(grid[r][c])
    }

    result.push(row)
  }

  return result
}

function hasNoNeighbors(grid, row, col) {
  const neighbors = [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col - 1],
    [row, col + 1],
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1],
  ]

  return neighbors.every(([r, c]) => {
    const result = safeGridGet(grid, r, c)

    return result === undefined || result === '.'
  })
}

function hasNoNorthNeighbors(grid, row, col) {
  const northNeighbors = [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
  ]

  return northNeighbors.every(([r, c]) => {
    const result = safeGridGet(grid, r, c)

    return result === undefined || result === '.'
  })
}

function hasNoSouthNeighbors(grid, row, col) {
  const southNeighbors = [
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1],
  ]

  return southNeighbors.every(([r, c]) => {
    const result = safeGridGet(grid, r, c)

    return result === undefined || result === '.'
  })
}

function hasNoWestNeighbors(grid, row, col) {
  const westNeighbors = [
    [row - 1, col - 1],
    [row, col - 1],
    [row + 1, col - 1],
  ]

  return westNeighbors.every(([r, c]) => {
    const result = safeGridGet(grid, r, c)

    return result === undefined || result === '.'
  })
}

function hasNoEastNeighbor(grid, row, col) {
  const eastNeighbors = [
    [row - 1, col + 1],
    [row, col + 1],
    [row + 1, col + 1],
  ]

  return eastNeighbors.every(([r, c]) => {
    const result = safeGridGet(grid, r, c)

    return result === undefined || result === '.'
  })
}

function nextTile(direction, row, col) {
  switch (direction) {
    case 'N':
      return [row - 1, col]
    case 'S':
      return [row + 1, col]
    case 'W':
      return [row, col - 1]
    case 'E':
      return [row, col + 1]
  }
}

const DIRECTIONS = ['N', 'S', 'W', 'E']

const DIRECTION_CHECKS = [
  hasNoNorthNeighbors,
  hasNoSouthNeighbors,
  hasNoWestNeighbors,
  hasNoEastNeighbor,
]

function createSim(startingGrid) {
  let grid = [...startingGrid.map(row => [...row])]
  let directionIdx = 0

  return {
    getState() {
      return grid
    },
    tick() {
      grid = expandGrid(grid)
      const elves = getElves(grid)

      const filtered = elves.filter(elf => !hasNoNeighbors(grid, ...elf))

      const moves = {}

      for (const elf of filtered) {
        let innerDirectionIdx = directionIdx
        let nextDirection
        let i = 0

        while (!nextDirection && i < 4) {
          if (DIRECTION_CHECKS[innerDirectionIdx](grid, ...elf)) {
            nextDirection = DIRECTIONS[innerDirectionIdx]
            break
          }

          innerDirectionIdx = (innerDirectionIdx + 1) % DIRECTIONS.length
          i++
        }

        if (i === 4) continue

        const nextPos = nextTile(nextDirection, ...elf)
        const key = nextPos.join('-')

        if (!moves[key]) {
          moves[key] = []
        }

        moves[key].push(elf)
      }

      const remaining = Object.entries(moves).filter(
        ([_, elves]) => elves.length === 1
      )

      for (const [key, [value]] of remaining) {
        const [curRow, curCol] = value
        const [nextRow, nextCol] = key.split('-')
        grid[curRow][curCol] = '.'
        grid[nextRow][nextCol] = '#'
      }

      grid = trimGrid(grid)
      directionIdx = (directionIdx + 1) % DIRECTIONS.length
    },
  }
}

function solution1(input) {
  const startingGrid = parseInput(input)
  const sim = createSim(startingGrid)

  for (let i = 0; i < 10; i++) {
    sim.tick()
  }

  const grid = sim.getState()

  // console.log(drawGrid(grid))

  return grid.reduce((acc, row) => {
    return acc + row.filter(x => x === '.').length
  }, 0)
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 4056

function solution2(input) {
  const startingGrid = parseInput(input)
  const sim = createSim(startingGrid)

  let previousGrid = drawGrid(sim.getState())
  let same = false
  let i = 0
  while (!same) {
    i++
    sim.tick()

    const currentGrid = drawGrid(sim.getState())

    if (currentGrid === previousGrid) {
      same = true
      break
    }

    previousGrid = currentGrid
  }

  return i
}

const secondAnswer = solution2(data)
console.log(secondAnswer)

module.exports = {
  solution1,
  solution2,
}
