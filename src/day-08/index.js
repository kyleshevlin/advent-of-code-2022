const { getData } = require('../utils')

const data = getData(__dirname)

function makeGrid(input) {
  return input
    .trim()
    .split('\n')
    .map(row => row.split('').map(Number))
}

function isTreeVisible(height, rowIdx, colIdx, grid) {
  // left
  const treesToTheLeft = grid[rowIdx].slice(0, colIdx)
  const visibleFromLeft = treesToTheLeft.every(tree => tree < height)

  // right
  const treesToTheRight = grid[rowIdx].slice(colIdx + 1)
  const visibleFromRight = treesToTheRight.every(tree => tree < height)

  // up
  const treesToTheTop = grid.slice(0, rowIdx).map(row => row[colIdx])
  const visibleFromTop = treesToTheTop.every(tree => tree < height)

  // down
  const treesToTheBottom = grid.slice(rowIdx + 1).map(row => row[colIdx])
  const visibleFromBottom = treesToTheBottom.every(tree => tree < height)

  return (
    visibleFromLeft || visibleFromRight || visibleFromTop || visibleFromBottom
  )
}

function solution1(input) {
  const grid = makeGrid(input)
  let visibleCount = 0

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const tree = grid[i][j]

      if (isTreeVisible(tree, i, j, grid)) {
        visibleCount++
      }
    }
  }

  return visibleCount
}

const firstAnswer = solution1(data)
// console.log(firstAnswer) // 1849

function getScenicScoreForTree(height, rowIdx, colIdx, grid) {
  // left
  const treesToTheLeft = grid[rowIdx].slice(0, colIdx).reverse()
  let leftCount = 0
  for (const tree of treesToTheLeft) {
    leftCount++
    if (tree < height) continue
    if (tree >= height) break
  }

  // right
  const treesToTheRight = grid[rowIdx].slice(colIdx + 1)
  let rightCount = 0
  for (const tree of treesToTheRight) {
    rightCount++
    if (tree < height) continue
    if (tree >= height) break
  }

  // up
  const treesToTheTop = grid
    .slice(0, rowIdx)
    .map(row => row[colIdx])
    .reverse()
  let topCount = 0
  for (const tree of treesToTheTop) {
    topCount++
    if (tree < height) continue
    if (tree >= height) break
  }

  // down
  const treesToTheBottom = grid.slice(rowIdx + 1).map(row => row[colIdx])
  let bottomCount = 0
  for (const tree of treesToTheBottom) {
    bottomCount++
    if (tree < height) continue
    if (tree >= height) break
  }

  const result = leftCount * rightCount * topCount * bottomCount

  return result
}

function solution2(input) {
  const grid = makeGrid(input)
  const scores = grid.map((row, rowIdx) =>
    row.map((tree, colIdx) => getScenicScoreForTree(tree, rowIdx, colIdx, grid))
  )

  return Math.max(...scores.flat())
}

const secondAnswer = solution2(data)
// console.log(secondAnswer) // 201600

module.exports = {
  solution1,
  solution2,
}
