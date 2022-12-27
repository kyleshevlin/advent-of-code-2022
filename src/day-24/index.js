const { getData, findLastIndex, createQueue, safeGridGet } = require('../utils')

const data = getData(__dirname)

const BLIZZARDS = ['^', '>', 'v', '<']

function parseInput(input) {
  return input
    .trim()
    .split('\n')
    .map(line => line.split('').map(char => [char]))
}

function getNextTile(char, row, col) {
  switch (char) {
    case '^':
      return [row - 1, col]
    case '>':
      return [row, col + 1]
    case 'v':
      return [row + 1, col]
    case '<':
      return [row, col - 1]
  }
}

const isNotWall = x => !x.includes('#')

function wrapAround(grid, char, row, col) {
  switch (char) {
    case '^': {
      const nextRow = findLastIndex(
        grid.map(row => row[col]),
        isNotWall
      )
      return [nextRow, col]
    }
    case '>': {
      const nextCol = grid[row].findIndex(isNotWall)
      return [row, nextCol]
    }
    case 'v': {
      const nextRow = grid.map(row => row[col]).findIndex(isNotWall)
      return [nextRow, col]
    }
    case '<': {
      const nextCol = findLastIndex(grid[row], isNotWall)
      return [row, nextCol]
    }
  }
}

function getBlizzards(grid) {
  const result = []

  for (const [rowIdx, row] of grid.entries()) {
    for (const [colIdx, col] of row.entries()) {
      const blizzards = col.filter(item => BLIZZARDS.includes(item))

      blizzards.forEach(blizzard => {
        result.push([blizzard, rowIdx, colIdx])
      })
    }
  }

  return result
}

function removeOneDirection(arr, direction) {
  const result = []

  let filtered = false
  while (arr.length) {
    const item = arr.pop()

    if (!filtered && item === direction) {
      filtered = true
      continue
    }

    result.push(item)
  }

  return result
}

function createSim(startingGrid) {
  let grid = [...startingGrid.map(row => [...row])]

  return {
    getState() {
      return grid
    },
    tick() {
      const blizzards = getBlizzards(grid)

      blizzards.forEach(blizzard => {
        const [direction, row, col] = blizzard
        let nextTile = getNextTile(direction, row, col)
        let [nextTileRow, nextTileCol] = nextTile
        const nextValArr = grid[nextTileRow][nextTileCol]

        if (nextValArr.includes('#')) {
          nextTile = wrapAround(grid, direction, row, col)

          nextTileRow = nextTile[0]
          nextTileCol = nextTile[1]
        }

        grid[row][col] = removeOneDirection(grid[row][col], direction)
        grid[nextTileRow][nextTileCol].push(direction)
      })

      grid = grid.map(row =>
        row.map(col => {
          switch (true) {
            case col.length === 0:
              return ['.']
            case col.length === 1:
              return col
            default:
              return col.filter(x => x !== '.')
          }
        })
      )
    },
  }
}

function drawBlizzards(grid) {
  return `\n${grid
    .map(row => row.map(col => (col.length > 1 ? col.length : col[0])).join(''))
    .join('\n')}\n`
}

function getNextNodes(grid, node, minutes, visited) {
  const [row, col] = node
  const tiles = [
    [row - 1, col],
    [row, col - 1],
    [row, col],
    [row, col + 1],
    [row + 1, col],
  ]

  return tiles.filter(([r, c]) => {
    const key = `${r}-${c}-${minutes % (grid.length * grid[0].length)}`
    const arr = safeGridGet(grid, r, c) ?? []
    const isAvailable = arr.includes('.')

    return isAvailable && !visited[key]
  })
}

function solution1(input) {
  const startingGrid = parseInput(input)
  const sim = createSim(startingGrid)
  const grid = sim.getState()

  const start = [0, grid[0].findIndex(x => x.includes('.'))]
  const end = [
    grid.length - 1,
    grid[grid.length - 1].findIndex(x => x.includes('.')),
  ]

  let currentNodes = [start]
  let found = false
  let minutes = 0

  const visited = {}

  while (!found) {
    currentNodes.forEach(node => {
      const [r, c] = node
      visited[`${r}-${c}-${minutes % (grid.length * grid[0].length)}`] = true
    })

    sim.tick()
    minutes++

    const nextNodes = currentNodes
      .map(node => getNextNodes(sim.getState(), node, minutes, visited))
      .flat()

    if (nextNodes.some(([r, c]) => r === end[0] && c === end[1])) {
      found = true
      break
    }

    currentNodes = nextNodes
  }

  return minutes
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer)

function solution2(input) {}

// const secondAnswer = solution2(data)
// console.log(secondAnswer)

module.exports = {
  solution1,
  solution2,
}
