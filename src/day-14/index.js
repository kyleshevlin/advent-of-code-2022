const { createRange, getData } = require('../utils')

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

  return {
    xDomain: [Math.min(...xs), Math.max(...xs)],
    yDomain: [0, Math.max(...ys)],
  }
}

function createGrid(xDomain, yDomain) {
  const [xMin, xMax] = xDomain
  const [, yMax] = yDomain
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

function drawGrid(grid) {
  return `\n${grid.map(row => row.join('')).join('\n')}\n`
}

function placeRocks(rocks, grid, xOffset, yOffset) {
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

function createSimulation(rocks, xDomain, yDomain) {
  const grid = createGrid(xDomain, yDomain)
  const [xMin, xMax] = xDomain
  const xOffset = xMax - (xMax - xMin)
  const [, yOffset] = yDomain
  const withRocks = placeRocks(rocks, grid, xOffset, yOffset)
  let isComplete = false

  const safeGridGet = (y, x) => {
    try {
      return withRocks[y][x]
    } catch (err) {
      return undefined
    }
  }

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
        const down = safeGridGet(y + 1, x)
        const downLeft = safeGridGet(y + 1, x - 1)
        const downRight = safeGridGet(y + 1, x + 1)

        if ([down, downLeft, downRight].includes(undefined)) {
          isComplete = true
          falling = false
          break
        }

        if (down === AIR) {
          sand = [x, y + 1]
          continue
        }

        if (downLeft === AIR) {
          sand = [x - 1, y + 1]
          continue
        }

        if (downRight === AIR) {
          sand = [x + 1, y + 1]
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
  const { xDomain, yDomain } = getDimensions(rocks)
  const sim = createSimulation(rocks, xDomain, yDomain)
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
  const { xDomain, yDomain } = getDimensions(rocks)
  const [xMin, xMax] = xDomain
  const [, yMax] = yDomain
  const increasedXDomain = [xMin - X_PAD, xMax + X_PAD]
  const increasedYDomain = [0, yMax + 2]
  const floorRock = [
    { x: xMin - X_PAD, y: yMax + 2 },
    { x: xMax + X_PAD, y: yMax + 2 },
  ]
  const withFloor = [...rocks, floorRock]
  const sim = createSimulation(withFloor, increasedXDomain, increasedYDomain)
  let isComplete = false
  let i = 0

  while (!isComplete) {
    sim.tick()
    isComplete = sim.getState().isComplete

    if (!isComplete) i++
  }

  return i
}

const secondAnswer = solution2(data)
console.log(secondAnswer) // 30157

module.exports = {
  solution1,
  solution2,
}
