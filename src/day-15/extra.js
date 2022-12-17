const { safeGridGet, createRange, getManhattanDistance } = require('../utils')

/**
 * While a grid was not a useful way to solve the problem, it was helpful to visualize
 * the test cases. I didn't want to delete the code, so I'm throwing it here.
 */
function drawGrid(items) {
  const dimensions = getDimensions(items)
  const grid = createGrid(dimensions)
  const { xMax, xMin } = dimensions
  const xOffset = xMax - (xMax - xMin)
  const withItems = placeItems(grid, items, xOffset)

  return `\n${withItems.map(row => row.join('')).join('\n')}\n`
}

function getDimensions(items) {
  const sensorXs = []
  const sensorYs = []
  const beaconXs = []
  const beaconYs = []

  for (const item of items) {
    const { sensor, beacon } = item
    sensorXs.push(sensor.x)
    sensorYs.push(sensor.y)
    beaconXs.push(beacon.x)
    beaconYs.push(beacon.y)
  }

  const xMin = Math.min(...sensorXs, ...beaconXs)
  const xMax = Math.max(...sensorXs, ...beaconXs)
  const yMax = Math.max(...sensorYs, ...beaconYs)

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

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')
function letterGetter() {
  let index = 0

  return () => {
    const result = letters[index]
    index++
    if (index >= letters.length) index = 0
    return result
  }
}

const getNextLetter = letterGetter()

function placeItems(grid, items, xOffset) {
  const cloneGrid = [...grid.map(row => [...row])]

  for (const item of items) {
    const { sensor, beacon } = item

    cloneGrid[sensor.y][sensor.x - xOffset] = 'S'
    cloneGrid[beacon.y][beacon.x - xOffset] = 'B'

    const distance = getManhattanDistance(
      sensor.x,
      sensor.y,
      beacon.x,
      beacon.y
    )

    const xRange = createRange(sensor.x - distance, sensor.x + distance)
    const yRange = createRange(sensor.y - distance, sensor.y + distance)
    const letter = getNextLetter()

    for (const x of xRange) {
      for (const y of yRange) {
        const _distance = getManhattanDistance(sensor.x, sensor.y, x, y)

        if (_distance > distance) continue

        const item = safeGridGet(cloneGrid, y, x - xOffset)

        if (item === '.' || item === '-') {
          cloneGrid[y][x - xOffset] = _distance === distance ? letter : '-'
        }
      }
    }
  }

  return cloneGrid
}
