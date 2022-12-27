const {
  getData,
  zip,
  safeGridGet,
  drawGrid,
  findLastIndex,
} = require('../utils')

const data = getData(__dirname)

function parseInput(input) {
  if (input.startsWith('\n')) {
    input = input.slice(1)
  }

  const [rawMap, rawMoves] = input.trimEnd().split('\n\n')

  const lines = rawMap.split('\n')
  const longestLine = Math.max(...lines.map(l => l.length))
  const map = lines
    .map(line => line.replace(/ /gm, 'X').padEnd(longestLine, 'X'))
    .join('\n')

  const advances = rawMoves
    .match(/\d+/g)
    .map(Number)
    .map(num => ({ type: 'advance', value: num }))
  const turns = rawMoves
    .match(/L|R/g)
    .map(turn => ({ type: 'turn', value: turn }))
  const moves = zip(advances, turns)

  return [map, moves]
}

function mapToGrid(map) {
  return map.split('\n').map(line => line.split(''))
}

const NEXT_FACING = {
  N: {
    L: 'W',
    R: 'E',
  },
  E: {
    L: 'N',
    R: 'S',
  },
  S: {
    L: 'E',
    R: 'W',
  },
  W: {
    L: 'S',
    R: 'N',
  },
}

function getNextPos(location, facing) {
  const [row, col] = location

  switch (facing) {
    case 'N':
      return [row - 1, col]
    case 'E':
      return [row, col + 1]
    case 'S':
      return [row + 1, col]
    case 'W':
      return [row, col - 1]
  }
}

const isNotVoid = x => x !== 'X'

function getWrapAroundPos(grid, location, facing) {
  const [row, col] = location

  switch (facing) {
    case 'N': {
      const newRow = findLastIndex(
        grid.map(row => row[col]),
        isNotVoid
      )
      return [newRow, col]
    }

    case 'E': {
      const newCol = grid[row].findIndex(isNotVoid)
      return [row, newCol]
    }

    case 'S': {
      const newRow = grid.map(row => row[col]).findIndex(isNotVoid)
      return [newRow, col]
    }

    case 'W': {
      const newCol = findLastIndex(grid[row], isNotVoid)
      return [row, newCol]
    }
  }
}

function createSim(map) {
  const grid = mapToGrid(map)
  const startCol = grid[0].findIndex(c => c === '.')
  let location = [0, startCol]
  let facing = 'E'
  const trail = [[location, facing]]

  return {
    getState() {
      return {
        grid,
        location,
        facing,
        trail,
      }
    },
    tick(move) {
      const { type, value } = move

      if (type === 'turn') {
        facing = NEXT_FACING[facing][value]
        trail[trail.length - 1] = [location, facing]
        return
      }

      let steps = value

      while (steps) {
        const nextPos = getNextPos(location, facing)
        const [nextRow, nextCol] = nextPos
        const nextGridVal = safeGridGet(grid, nextRow, nextCol)

        if (nextGridVal === '.') {
          location = nextPos
          trail.push([nextPos, facing])
        }

        if (nextGridVal === '#') return

        if (!nextGridVal || nextGridVal === 'X') {
          const wrapAroundPos = getWrapAroundPos(grid, location, facing)
          const [wrapAroundRow, wrapAroundCol] = wrapAroundPos
          const wrapAroundVal = safeGridGet(grid, wrapAroundRow, wrapAroundCol)

          if (wrapAroundVal === '#') return

          location = wrapAroundPos
          trail.push([wrapAroundPos, facing])
        }

        steps--
      }
    },
  }
}

const FACING_CHARS = {
  N: '^',
  E: '>',
  S: 'v',
  W: '<',
}

function addTrail(grid, trail) {
  const clone = [...grid.map(row => [...row])]

  for (const step of trail) {
    const [location, facing] = step
    const [row, col] = location
    const char = FACING_CHARS[facing]

    clone[row][col] = char
  }

  return clone
}

const FACING_VALUES = {
  E: 0,
  S: 1,
  W: 2,
  N: 3,
}

function getResult(location, facing) {
  const [row, col] = location
  return 1000 * (row + 1) + 4 * (col + 1) + FACING_VALUES[facing]
}

function solution1(input) {
  const [map, moves] = parseInput(input)
  const sim = createSim(map)

  for (const move of moves) {
    sim.tick(move)
  }

  const { grid, location, facing, trail } = sim.getState()
  // console.log(drawGrid(addTrail(grid, trail)))
  const result = getResult(location, facing)

  return result
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 58248

function mapToGrids(map, rowsAndColsOfGrids) {
  const grid = mapToGrid(map)

  const grids = rowsAndColsOfGrids.map(([rows, cols]) => {
    const result = []

    for (let i = rows[0]; i < rows[1]; i++) {
      const r = []
      for (let j = cols[0]; j < cols[1]; j++) {
        r.push(grid[i][j])
      }

      result.push(r)
    }

    return result
  })

  return grids
}

function solution2(input, rowsAndColsOfGrids) {
  const [map, moves] = parseInput(input)
  const grids = mapToGrids(map, rowsAndColsOfGrids)

  return grids.map(drawGrid)
}

// const secondAnswer = solution2(data)
// console.log(secondAnswer)

module.exports = {
  solution1,
  solution2,
}
