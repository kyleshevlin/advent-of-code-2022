const { createRange, getData, safeGridGet, drawGrid } = require('../utils')

const data = getData(__dirname)

const AIR = '.'
const ROCK = '#'
const SAND = 'o'

function parseInput(input) {
  return input
    .trim()
    .split('\n')
    .map(line =>
      line.split(' -> ').map(pair => {
        const [x, y] = pair.split(',').map(Number)
        return { x, y }
      })
    )
}

function getDimensions(rocks) {
  const xs = rocks.flatMap(rock => rock.map(({ x }) => x))
  const ys = rocks.flatMap(rock => rock.map(({ y }) => y))

  const xMin = Math.min(...xs)
  const xMax = Math.max(...xs)
  const yMax = Math.max(...ys)

  return { xMin, xMax, yMax }
}

function createGrid(dimensions) {
  const { xMin, xMax, yMax } = dimensions
  const result = []

  for (let i = 0; i <= yMax; i++) {
    const row = []

    for (let j = 0; j <= xMax - xMin; j++) {
      row.push('.')
    }

    result.push(row)
  }

  return result
}

function placeRocks(rocks, grid, xOffset) {
  const gridClone = [...grid.map(row => [...row])]
  const offsetRocks = rocks.map(rock =>
    rock.map(point => ({ ...point, x: point.x - xOffset }))
  )

  for (const rock of offsetRocks) {
    // eslint-disable-next-line prefer-const
    let [a, ...rest] = rock
    let b

    while (rest.length) {
      b = rest.shift()
      const { x: aX, y: aY } = a
      const { x: bX, y: bY } = b

      gridClone[aY][aX] = ROCK
      gridClone[bY][bX] = ROCK

      if (aX === bX) {
        const range = createRange(aY, bY)

        for (const y of range) {
          gridClone[y][aX] = ROCK
        }
      }

      if (aY === bY) {
        const range = createRange(aX, bX)

        for (const x of range) {
          gridClone[aY][x] = ROCK
        }
      }

      a = b
    }
  }

  return gridClone
}

const STARTING_POINT = [500, 0]

function createSimulation(rocks, dimensions) {
  const grid = createGrid(dimensions)

  const { xMin, xMax } = dimensions
  const xOffset = xMax - (xMax - xMin)
  const withRocks = placeRocks(rocks, grid, xOffset)

  let isComplete = false

  return {
    getState() {
      return {
        drawnGrid: drawGrid(withRocks),
        isComplete,
      }
    },
    tick() {
      const [startX, startY] = STARTING_POINT
      let sand = [startX - xOffset, startY]
      let falling = true

      if (withRocks[startY][startX - xOffset] === SAND) {
        isComplete = true
        return
      }

      while (falling) {
        const [x, y] = sand
        const nextY = y + 1
        const down = safeGridGet(withRocks, nextY, x)
        const downLeft = safeGridGet(withRocks, nextY, x - 1)
        const downRight = safeGridGet(withRocks, nextY, x + 1)

        if ([down, downLeft, downRight].includes(undefined)) {
          isComplete = true
          falling = false
          break
        }

        if (down === AIR) {
          sand = [x, nextY]
          continue
        }

        if (downLeft === AIR) {
          sand = [x - 1, nextY]
          continue
        }

        if (downRight === AIR) {
          sand = [x + 1, nextY]
          continue
        }

        falling = false
      }

      if (!isComplete) {
        const [x, y] = sand
        withRocks[y][x] = SAND
      }
    },
  }
}

function solution1(input) {
  const rocks = parseInput(input)
  const dimensions = getDimensions(rocks)
  const sim = createSimulation(rocks, dimensions)

  let isComplete = false
  let i = 0
  while (!isComplete) {
    sim.tick()
    isComplete = sim.getState().isComplete

    if (!isComplete) i++
  }

  return i
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 1078

/**
 * I can maybe figure out how to dynamically size this up later but until then,
 * I just kept increasing this padding until the answer kept coming out the same
 */
const X_PAD = 175

function solution2(input) {
  const rocks = parseInput(input)
  const { xMin, xMax, yMax } = getDimensions(rocks)
  const xMinAdj = xMin - X_PAD
  const xMaxAdj = xMax + X_PAD
  const yMaxAdj = yMax + 2
  const floorRock = [
    { x: xMinAdj, y: yMaxAdj },
    { x: xMaxAdj, y: yMaxAdj },
  ]
  const withFloor = [...rocks, floorRock]
  const sim = createSimulation(withFloor, {
    xMin: xMinAdj,
    xMax: xMaxAdj,
    yMax: yMaxAdj,
  })

  let isComplete = false
  let i = 0
  while (!isComplete) {
    sim.tick()
    isComplete = sim.getState().isComplete

    if (!isComplete) i++
  }

  return i
}

// const secondAnswer = solution2(data)
// console.log(secondAnswer) // 30157

module.exports = {
  solution1,
  solution2,
}
