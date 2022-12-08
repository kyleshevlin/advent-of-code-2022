const { getData } = require('../utils')

const data = getData(__dirname)

function makeGrid(input) {
  return input
    .trim()
    .split('\n')
    .map(row => row.split('').map(Number))
}

function isTreeVisible(rowIdx, colIdx, grid) {
  const currentTree = grid[rowIdx][colIdx]

  const isEveryTreeShorter = trees => trees.every(tree => tree < currentTree)

  // left
  const treesToTheLeft = grid[rowIdx].slice(0, colIdx)
  const visibleFromLeft = isEveryTreeShorter(treesToTheLeft)

  // right
  const treesToTheRight = grid[rowIdx].slice(colIdx + 1)
  const visibleFromRight = isEveryTreeShorter(treesToTheRight)

  // up
  const treesToTheTop = grid.slice(0, rowIdx).map(row => row[colIdx])
  const visibleFromTop = isEveryTreeShorter(treesToTheTop)

  // down
  const treesToTheBottom = grid.slice(rowIdx + 1).map(row => row[colIdx])
  const visibleFromBottom = isEveryTreeShorter(treesToTheBottom)

  return (
    visibleFromLeft || visibleFromRight || visibleFromTop || visibleFromBottom
  )
}

function solution1(input) {
  const grid = makeGrid(input)
  let visibleCount = 0

  for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
    for (let colIdx = 0; colIdx < grid[0].length; colIdx++) {
      if (isTreeVisible(rowIdx, colIdx, grid)) {
        visibleCount++
      }
    }
  }

  return visibleCount
}

const firstAnswer = solution1(data)
// console.log(firstAnswer) // 1849

function getScenicScoreForTree(rowIdx, colIdx, grid) {
  const currentTree = grid[rowIdx][colIdx]

  const getVisibleTreeCount = trees => {
    let result = 0

    for (const tree of trees) {
      result++
      if (tree < currentTree) continue
      if (tree >= currentTree) break
    }

    return result
  }

  // left
  const treesToTheLeft = grid[rowIdx].slice(0, colIdx).reverse()
  const leftCount = getVisibleTreeCount(treesToTheLeft)

  // right
  const treesToTheRight = grid[rowIdx].slice(colIdx + 1)
  const rightCount = getVisibleTreeCount(treesToTheRight)

  // up
  const treesToTheTop = grid
    .slice(0, rowIdx)
    .map(row => row[colIdx])
    .reverse()
  const topCount = getVisibleTreeCount(treesToTheTop)

  // down
  const treesToTheBottom = grid.slice(rowIdx + 1).map(row => row[colIdx])
  const bottomCount = getVisibleTreeCount(treesToTheBottom)

  const result = leftCount * rightCount * topCount * bottomCount

  return result
}

function solution2(input) {
  const grid = makeGrid(input)
  const scores = grid.map((row, rowIdx) =>
    row.map((_, colIdx) => getScenicScoreForTree(rowIdx, colIdx, grid))
  )

  return Math.max(...scores.flat())
}

const secondAnswer = solution2(data)
// console.log(secondAnswer) // 201600

module.exports = {
  solution1,
  solution2,
}
