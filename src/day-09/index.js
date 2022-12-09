const { getData } = require('../utils')

const data = getData(__dirname)

function getHeadMovements(input) {
  return input
    .trim()
    .split('\n')
    .map(line => {
      const [direction, amount] = line.split(' ')
      return [direction, Number(amount)]
    })
}

function getNextHeadPosition(headPos, movement) {
  const [x, y] = headPos
  const [direction, amount] = movement

  switch (direction) {
    case 'U':
      return [x, y + amount]
    case 'D':
      return [x, y - amount]
    case 'L':
      return [x - amount, y]
    case 'R':
      return [x + amount, y]
  }
}

function getNextTrailingKnotsPosition(trailPos, leadPos) {
  const [tx, ty] = trailPos
  const [lx, ly] = leadPos

  const xDiff = lx - tx
  const yDiff = ly - ty

  // touching, don't need to move
  if (Math.abs(xDiff) <= 1 && Math.abs(yDiff) <= 1) return trailPos

  /**
   * Let me explain how this works. The trailing knot can always be thought of as
   * following the leading knot _in both dimensions_. It just so happens that
   * sometimes the change in a dimension is 0. Such as when it follows up, down,
   * left, and right.
   *
   * In a diagonal change, we'll get change in both dimensions, and it so happens
   * that it'll always be a movement of either 1 or -1. There's a clever way to
   * get this value: `Math.sign()`. `Math.sign()` returns 1 for n > 0, -1 for
   * n < 0, and 0 or -0 when n is 0 or -0. This is perfect.
   *
   * If there's no change in a dimension, it returns 0, otherwise it returns the
   * amount of change in that dimension
   */
  const nextTx = tx + Math.sign(xDiff)
  const nextTy = ty + Math.sign(yDiff)

  return [nextTx, nextTy]
}

const SEPARATOR = `~~~`

function simulateRope(knots) {
  const knotPositions = Array(knots).fill([0, 0])
  const tailLocations = new Set([knotPositions.at(-1).join(SEPARATOR)])

  return {
    getState: () => {
      return { knotPositions, tailLocations }
    },
    tick(movement) {
      const [direction, amount] = movement

      for (let i = 0; i < amount; i++) {
        for (const [index, knot] of knotPositions.entries()) {
          if (index === 0) {
            knotPositions[index] = getNextHeadPosition(knot, [direction, 1])
            continue
          }

          knotPositions[index] = getNextTrailingKnotsPosition(
            knot,
            knotPositions[index - 1]
          )
        }

        tailLocations.add(knotPositions.at(-1).join(SEPARATOR))
      }
    },
  }
}

function solution1(input) {
  const movements = getHeadMovements(input)
  const sim = simulateRope(2)

  for (const move of movements) {
    sim.tick(move)
  }

  return sim.getState().tailLocations.size
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 5710

function solution2(input) {
  const movements = getHeadMovements(input)
  const sim = simulateRope(10)

  for (const move of movements) {
    sim.tick(move)
  }

  return sim.getState().tailLocations.size
}

// const secondAnswer = solution2(data)
// console.log(secondAnswer) // 2259

module.exports = {
  solution1,
  solution2,
}
