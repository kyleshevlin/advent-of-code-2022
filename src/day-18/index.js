const {
  getData,
  intersection,
  createQueue,
  setDifference,
  union,
} = require('../utils')

const data = getData(__dirname)

function parseInput(input) {
  return input.trim().split('\n')
}

const stringToTuple = str => str.split(',').map(Number)
const tupleToString = tup => tup.join(',')

const getNeighborKeys = cubeStr => {
  const [x, y, z] = stringToTuple(cubeStr)

  return [
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y + 1, z],
    [x, y - 1, z],
    [x, y, z + 1],
    [x, y, z - 1],
  ].map(tupleToString)
}

function getSurfaceArea(cubeSet) {
  let sides = 0
  for (const cube of cubeSet) {
    const neighbors = new Set(getNeighborKeys(cube))
    const intersected = intersection(cubeSet, neighbors)

    sides += 6 - intersected.size
  }

  return sides
}

function solution1(input) {
  const cubes = parseInput(input)

  return getSurfaceArea(new Set(cubes))
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 3662

function solution2(input) {
  const cubes = parseInput(input)
  const cubesSet = new Set(cubes)
  const cubeSurfaceArea = getSurfaceArea(cubesSet)

  /**
   * 1. Create a bounding box, create a set of all points in the box
   * 2. Pick a corner and floodfill the box, collect every filled point
   * 3. The internal air cubes are the difference between the set of all points
   *    and the union of the set of points from the fill and the lava droplet scan
   * 4. Given the set of internal air cubes, we can now use the algo from pt 1
   *    to get the surface area of the air cubes and subtract it from the surface
   *    area of the lava droplet.
   */
  const tuples = cubes.map(stringToTuple)
  const xs = []
  const ys = []
  const zs = []
  for (const [x, y, z] of tuples) {
    xs.push(x)
    ys.push(y)
    zs.push(z)
  }

  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const minZ = Math.min(...zs)
  const maxZ = Math.max(...zs)

  const box = new Set()
  for (let x = minX - 1; x < maxX + 1; x++) {
    for (let y = minY - 1; y < maxY + 1; y++) {
      for (let z = minZ - 1; z < maxZ + 1; z++) {
        box.add(`${x},${y},${z}`)
      }
    }
  }

  const flood = new Set()

  function floodFill(key) {
    // If the key is in the flood, in the rock, or outside the box return
    if (flood.has(key) || cubesSet.has(key) || !box.has(key)) return

    flood.add(key)
    const neighbors = new Set(getNeighborKeys(key))
    for (const n of neighbors) floodFill(n)
  }

  const start = `${minX - 1},${minY - 1},${minZ - 1}`
  floodFill(start)

  const internalAir = setDifference(box, union(cubesSet, flood))
  const internalSurfaceArea = getSurfaceArea(internalAir)

  return cubeSurfaceArea - internalSurfaceArea
}

// const secondAnswer = solution2(data)
// console.log(secondAnswer) // 2060

module.exports = {
  solution1,
  solution2,
}
