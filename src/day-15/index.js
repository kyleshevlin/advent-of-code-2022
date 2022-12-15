const { createRange, getData, safeGridGet } = require('../utils')

const data = getData(__dirname)

function parseInput(input) {
  const result = input
    .trim()
    .split('\n')
    .map(line => {
      const [sensorPart, beaconPart] = line.trim().split(':')
      const [sensorXPart, sensorYPart] = sensorPart.trim().split(',')
      const [beaconXPart, beaconYPart] = beaconPart.trim().split(',')

      const sensorX = Number(sensorXPart.replace('Sensor at x=', ''))
      const sensorY = Number(sensorYPart.replace(' y=', ''))
      const beaconX = Number(beaconXPart.replace('closest beacon is at x=', ''))
      const beaconY = Number(beaconYPart.replace(' y=', ''))

      return {
        sensor: {
          x: sensorX,
          y: sensorY,
        },
        beacon: {
          x: beaconX,
          y: beaconY,
        },
      }
    })

  return result
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

function drawGrid(grid) {
  return `\n${grid.map(row => row.join('')).join('\n')}\n`
}

const getDistance = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2)

function placeItems(grid, items, xOffset) {
  const cloneGrid = [...grid.map(row => [...row])]

  for (const item of items) {
    const { sensor, beacon } = item

    cloneGrid[sensor.y][sensor.x - xOffset] = 'S'
    cloneGrid[beacon.y][beacon.x - xOffset] = 'B'

    const distance = getDistance(sensor.x, sensor.y, beacon.x, beacon.y)

    const xRange = createRange(sensor.x - distance, sensor.x + distance)
    const yRange = createRange(sensor.y - distance, sensor.y + distance)

    for (const x of xRange) {
      for (const y of yRange) {
        const _distance = getDistance(sensor.x, sensor.y, x, y)

        if (_distance > distance) continue

        const item = safeGridGet(cloneGrid, y, x - xOffset)

        if (item === '.') {
          cloneGrid[y][x - xOffset] = '#'
        }
      }
    }
  }

  return cloneGrid
}

function getBeaconlessCount(items, at) {
  const filled = new Map()
  let result = 0

  function makeKey(x, y) {
    return `${x},${y}`
  }

  for (const item of items) {
    const { sensor, beacon } = item

    if (sensor.y === at) filled.set(makeKey(sensor.x, sensor.y), 'S')
    if (beacon.y === at) filled.set(makeKey(beacon.x, beacon.y), 'B')

    const distance = getDistance(sensor.x, sensor.y, beacon.x, beacon.y)

    const xRange = createRange(sensor.x - distance, sensor.x + distance)
    const yRange = createRange(sensor.y - distance, sensor.y + distance)

    if (!yRange.includes(at)) continue

    for (const x of xRange) {
      const _distance = getDistance(sensor.x, sensor.y, x, at)

      if (_distance > distance) continue

      const key = makeKey(x, at)

      if (!filled.has(key)) {
        filled.set(key, '#')
        result++
      }
    }
  }

  return result
}

function solution1(input, at) {
  const items = parseInput(input)
  const result = getBeaconlessCount(items, at)

  return result
}

// const firstAnswer = solution1(data, 2000000)
// console.log(firstAnswer) // 5564017

function solution2(input, max) {
  const items = parseInput(input)
  const dimensions = getDimensions(items)
  const grid = createGrid(dimensions)
  const { xMax, xMin } = dimensions
  const xOffset = xMax - (xMax - xMin)
  const withItems = placeItems(grid, items, xOffset)

  let x = 0
  let y = 0

  const rowsWithPotential = withItems
    .map((row, rowIdx) => ({ row, rowIdx }))
    .filter(item => {
      return item.row.join('').includes('#.#')
    })

  for (const { row, rowIdx } of rowsWithPotential) {
    for (const [colIdx, item] of row.entries()) {
      if (item !== '.') continue

      const neighbors = [
        safeGridGet(withItems, rowIdx, colIdx - 1),
        safeGridGet(withItems, rowIdx, colIdx + 1),
        safeGridGet(withItems, rowIdx - 1, colIdx - 1),
        safeGridGet(withItems, rowIdx - 1, colIdx),
        safeGridGet(withItems, rowIdx - 1, colIdx + 1),
        safeGridGet(withItems, rowIdx + 1, colIdx - 1),
        safeGridGet(withItems, rowIdx + 1, colIdx),
        safeGridGet(withItems, rowIdx + 1, colIdx + 1),
      ]

      if (neighbors.every(n => n === '#')) {
        x = colIdx + xOffset
        y = rowIdx
        break
      }
    }
  }

  return x * 4000000 + y
}

// const secondAnswer = solution2(data, 4000000)
// console.log(secondAnswer)

module.exports = {
  solution1,
  solution2,
}
