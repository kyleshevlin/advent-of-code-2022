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

const getDistance = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2)

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

    const distance = getDistance(sensor.x, sensor.y, beacon.x, beacon.y)

    const xRange = createRange(sensor.x - distance, sensor.x + distance)
    const yRange = createRange(sensor.y - distance, sensor.y + distance)
    const letter = getNextLetter()

    for (const x of xRange) {
      for (const y of yRange) {
        const _distance = getDistance(sensor.x, sensor.y, x, y)

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

function drawGrid(items) {
  const dimensions = getDimensions(items)
  const grid = createGrid(dimensions)
  const { xMax, xMin } = dimensions
  const xOffset = xMax - (xMax - xMin)
  const withItems = placeItems(grid, items, xOffset)

  return `\n${withItems.map(row => row.join('')).join('\n')}\n`
}

function makeKey(x, y) {
  return `${x},${y}`
}

function getSets(items, at) {
  const sensors = new Set()
  const beacons = new Set()
  const beaconless = new Set()

  for (const item of items) {
    const { sensor, beacon } = item

    if (sensor.y === at) sensors.add(makeKey(sensor.x, sensor.y))
    if (beacon.y === at) beacons.add(makeKey(beacon.x, beacon.y))

    const distance = getDistance(sensor.x, sensor.y, beacon.x, beacon.y)

    const xRange = createRange(sensor.x - distance, sensor.x + distance)
    const yRange = createRange(sensor.y - distance, sensor.y + distance)

    if (!yRange.includes(at)) continue

    for (const x of xRange) {
      const _distance = getDistance(sensor.x, sensor.y, x, at)

      if (_distance > distance) continue

      const key = makeKey(x, at)

      if (!sensors.has(key) && !beacons.has(key) && !beaconless.has(key)) {
        beaconless.add(key)
      }
    }
  }

  return { sensors, beacons, beaconless }
}

function solution1(input, at) {
  const items = parseInput(input)
  const { beaconless } = getSets(items, at)

  return beaconless.size
}

// const firstAnswer = solution1(data, 2000000)
// console.log(firstAnswer) // 5564017

// found online:
// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
function getLineIntersection(line1, line2) {
  const [x1, y1, x2, y2] = line1
  const [x3, y3, x4, y4] = line2

  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) return

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)

  // Lines are parallel
  if (denominator === 0) return

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return

  const x = x1 + ua * (x2 - x1)
  const y = y1 + ua * (y2 - y1)

  return { x, y }
}

function findUndetectedBeacon(items, min, max) {
  const sensorWithDistances = []

  const sensorBoundaries = []

  for (const item of items) {
    const { sensor, beacon } = item
    const distance = getDistance(sensor.x, sensor.y, beacon.x, beacon.y)

    sensorWithDistances.push({ sensor, distance })

    const boundary = distance + 1

    const { x, y } = sensor
    const top = [x, y - boundary]
    const right = [x + boundary, y]
    const bottom = [x, y + boundary]
    const left = [x - boundary, y]

    sensorBoundaries.push([
      [...top, ...right],
      [...right, ...bottom],
      [...bottom, ...left],
      [...left, ...top],
    ])
  }

  const intersections = []

  for (const boundary1 of sensorBoundaries) {
    for (const boundary2 of sensorBoundaries) {
      for (const line1 of boundary1) {
        for (const line2 of boundary2) {
          const intersection = getLineIntersection(line1, line2)

          if (!intersection) continue

          intersections.push(intersection)
        }
      }
    }
  }

  let result
  for (const intersection of intersections) {
    const { x, y } = intersection

    if (x < min || x > max || y < min || y > max) {
      continue
    }

    let detected = false
    for (const { sensor, distance } of sensorWithDistances) {
      const intersectionDistance = getDistance(sensor.x, sensor.y, x, y)

      if (intersectionDistance <= distance) {
        detected = true
        break
      }
    }

    // The first intersection that isn't detected by any sensor is sitting
    // between all the sensors and thus is our undetected beacon
    if (!detected) {
      result = { x, y }
      break
    }
  }

  return result
}

function solution2(input, min, max) {
  const items = parseInput(input)
  // console.log(drawGrid(items))
  const { x, y } = findUndetectedBeacon(items, min, max)

  return x * 4000000 + y
}

// const secondAnswer = solution2(data, 0, 4000000)
// console.log(secondAnswer) // 11558423398893

module.exports = {
  solution1,
  solution2,
}
