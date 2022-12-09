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
  if (Math.abs(xDiff) <= 1 && Math.abs(yDiff) <= 1) return [tx, ty]

  const getRoundingFn = num => (num <= 0 ? Math.floor : Math.ceil)

  const nextTx = tx + getRoundingFn(xDiff)(xDiff / 2)
  const nextTy = ty + getRoundingFn(yDiff)(yDiff / 2)

  return [nextTx, nextTy]
}

const SEPARATOR = `~~~`

function simulateRope() {
  let headPos = [0, 0]
  let tailPos = [0, 0]
  let tailLocations = new Set([tailPos.join(SEPARATOR)])

  return {
    getState: () => {
      return { headPos, tailPos, tailLocations }
    },
    tick(movement) {
      const [direction, amount] = movement

      for (let i = 0; i < amount; i++) {
        headPos = getNextHeadPosition(headPos, [direction, 1])
        tailPos = getNextTrailingKnotsPosition(tailPos, headPos)
        tailLocations.add(tailPos.join(SEPARATOR))
      }
    },
  }
}

function solution1(input) {
  const movements = getHeadMovements(input)
  const sim = simulateRope()

  for (const move of movements) {
    sim.tick(move)
  }

  return sim.getState().tailLocations.size
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 5710

function simulateLongRope() {
  const knotPositions = Array(10).fill([0, 0])
  let tailLocations = new Set([knotPositions.at(-1).join(SEPARATOR)])

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

function solution2(input) {
  const movements = getHeadMovements(input)
  const sim = simulateLongRope()

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
