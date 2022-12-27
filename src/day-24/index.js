const { getData, findLastIndex, safeGridGet, createQueue } = require('../utils')

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

function strToGrid(str) {
  return str
    .trim()
    .split('\n')
    .map(line => line.split(''))
}

function getNextNodes(row, col, iterations, minutes, modulator, visited) {
  const minutesKey = minutes % modulator
  const gridAsString = iterations[minutesKey]
  const grid = strToGrid(gridAsString)
  const tiles = [
    [row - 1, col],
    [row, col - 1],
    [row, col],
    [row, col + 1],
    [row + 1, col],
  ]

  return tiles.filter(([r, c]) => {
    const key = `${r}-${c}-${minutesKey}`
    const value = safeGridGet(grid, r, c)
    const isAvailable = value === '.'

    return isAvailable && !visited[key]
  })
}

function getIterations(sim, modulator) {
  const iterations = {}

  let i = 0
  while (i <= modulator) {
    const grid = drawBlizzards(sim.getState())
    iterations[i] = grid
    i++
    sim.tick()
  }

  return iterations
}

function walkGrid(from, to, initialMinute, iterations, modulator) {
  const queue = createQueue()
  queue.enqueue([from, initialMinute])
  const visited = {}

  while (!queue.isEmpty()) {
    const item = queue.dequeue()
    const [[row, col], minutes] = item

    if (row === to[0] && col === to[1]) return minutes

    const nextNodes = getNextNodes(
      row,
      col,
      iterations,
      minutes + 1,
      modulator,
      visited
    )

    for (const node of nextNodes) {
      queue.enqueue([node, minutes + 1])
      const key = `${node[0]}-${node[1]}-${(minutes + 1) % modulator}`
      visited[key] = true
    }
  }

  return -1
}

function solution1(input) {
  const startingGrid = parseInput(input)
  const modulator = (startingGrid.length - 2) * (startingGrid[0].length - 2)
  const sim = createSim(startingGrid)
  const iterations = getIterations(sim, modulator)

  const start = [0, startingGrid[0].findIndex(x => x.includes('.'))]
  const end = [
    startingGrid.length - 1,
    startingGrid[startingGrid.length - 1].findIndex(x => x.includes('.')),
  ]

  return walkGrid(start, end, 0, iterations, modulator)
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 343

function solution2(input) {
  const startingGrid = parseInput(input)
  const modulator = (startingGrid.length - 2) * (startingGrid[0].length - 2)
  const sim = createSim(startingGrid)
  const iterations = getIterations(sim, modulator)

  const start = [0, startingGrid[0].findIndex(x => x.includes('.'))]
  const end = [
    startingGrid.length - 1,
    startingGrid[startingGrid.length - 1].findIndex(x => x.includes('.')),
  ]

  const first = walkGrid(start, end, 0, iterations, modulator)
  const second = walkGrid(end, start, first, iterations, modulator)
  const third = walkGrid(start, end, second, iterations, modulator)

  return third
}

// const secondAnswer = solution2(data)
// console.log(secondAnswer) // 960

module.exports = {
  solution1,
  solution2,
}
