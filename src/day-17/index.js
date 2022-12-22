const { getData, safeGridGet } = require('../utils')

const data = getData(__dirname)

const ROCKS = [
  [[2, 2, 2, 2]],
  [
    [0, 2, 0],
    [2, 2, 2],
    [0, 2, 0],
  ],
  [
    [0, 0, 2],
    [0, 0, 2],
    [2, 2, 2],
  ],
  [
    // prettier-ignore
    [2],
    [2],
    [2],
    [2],
  ],
  [
    [2, 2],
    [2, 2],
  ],
]

const WIDTH = 7
const getEmptyRow = () => Array(WIDTH).fill(0)
const ROCKS_COUNT = 2022

function parseInput(input) {
  return input.trim().split('')
}

const CHARS = ['.', '#', '@']

function drawGrid(grid) {
  return `${grid.map(row => row.map(v => CHARS[v]).join('')).join('\n')}`
}

function applyMove([rowIdx, colIdx], move) {
  switch (move) {
    case '>':
      return [rowIdx, colIdx + 1]
    case '<':
      return [rowIdx, colIdx - 1]
    case 'v':
      return [rowIdx + 1, colIdx]
  }
}

function detectCollision(grid, position, rock) {
  const [rowIdx, colIdx] = position

  if (colIdx < 0 || colIdx + rock[0].length > grid[0].length) return true

  for (const [rockRowIdx, row] of rock.entries()) {
    for (const [rockColIdx, item] of row.entries()) {
      if (item === 0) continue
      if (safeGridGet(grid, rowIdx + rockRowIdx, colIdx + rockColIdx) !== 0) {
        return true
      }
    }
  }

  return false
}

function createSim(moves) {
  let rockCount = 0
  let rockIdx = 0
  let moveIdx = 0
  let grid = []

  const advanceRockIdx = () => {
    rockIdx = (rockIdx + 1) % ROCKS.length
  }

  const advanceMoveIdx = () => {
    moveIdx = (moveIdx + 1) % moves.length
  }

  return {
    getState() {
      return {
        grid: [...grid.map(row => [...row])],
        rockCount,
        rockIdx,
        moveIdx,
      }
    },
    tick() {
      const rock = ROCKS[rockIdx]
      rockCount++
      advanceRockIdx()

      // Add 3 empty rows to the front
      grid.unshift(getEmptyRow(), getEmptyRow(), getEmptyRow())

      // Add empty rows equivalent to the size of the rock
      grid.unshift(
        ...Array(rock.length)
          .fill()
          .map(() => getEmptyRow())
      )

      // We don't have to actually draw the rock, just track where it should be
      // then draw it after
      let rockTopLeft = [0, 2]
      let moving = true
      while (moving) {
        const move = moves[moveIdx]
        const afterMove = applyMove(rockTopLeft, move)
        advanceMoveIdx()

        if (!detectCollision(grid, afterMove, rock)) {
          rockTopLeft = afterMove
        }

        const afterFall = applyMove(rockTopLeft, 'v')

        if (detectCollision(grid, afterFall, rock)) {
          moving = false
          break
        }

        rockTopLeft = afterFall
      }

      // Update the grid with the rock position
      const [r, c] = rockTopLeft
      for (const [rowIdx, row] of rock.entries()) {
        for (const [colIdx, col] of row.entries()) {
          const current = grid[rowIdx + r][colIdx + c]
          const next = current === 0 ? col : current
          grid[rowIdx + r][colIdx + c] = next
        }
      }

      // convert all 2s to 1s (falling rock becomes stationary rock)
      grid = grid.map(row => row.map(x => (x === 2 ? 1 : x)))

      // Keep all rows with anything in them
      grid = grid.filter(row => row.some(x => x !== 0))
    },
  }
}

function solution1(input) {
  const moves = parseInput(input)
  const sim = createSim(moves)

  while (sim.getState().rockCount < ROCKS_COUNT) {
    sim.tick()
  }

  // console.log(drawGrid(sim.getState().grid.slice(0, 40)))
  return sim.getState().grid.length
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 3147

const SECOND_ROCKS_COUNT = 1000000000000

function solution2(input) {
  const moves = parseInput(input)
  const sim = createSim(moves)

  // Gotta find a cycle so I can compute this, gah.
  const cache = {}
  let first
  let second
  let hit = false
  while (!hit) {
    sim.tick()

    const state = sim.getState()
    const { rockIdx, moveIdx, grid } = state
    const key = `${rockIdx}-${moveIdx}-${grid
      .slice(0, 5)
      .map(r => r.join(''))
      .join('')}`

    if (cache[key]) {
      hit = true
      first = cache[key]
      second = state
      break
    }

    cache[key] = state
  }

  const firstHeight = first.grid.length
  const firstCount = first.rockCount

  const secondHeight = second.grid.length
  const secondCount = second.rockCount

  const periodHeight = secondHeight - firstHeight
  const periodCount = secondCount - firstCount

  const remainingCount = SECOND_ROCKS_COUNT - firstCount
  const periods = Math.floor(remainingCount / periodCount)
  const totalPeriodsHeight = periods * periodHeight
  const remainder = remainingCount % periodCount

  const sim2 = createSim(moves)

  while (sim2.getState().rockCount < firstCount + remainder) {
    sim2.tick()
  }

  return totalPeriodsHeight + sim2.getState().grid.length
}

// const secondAnswer = solution2(data)
// console.log(secondAnswer) // 1532163742758

module.exports = {
  solution1,
  solution2,
}
