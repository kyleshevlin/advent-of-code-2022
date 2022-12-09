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
      return [x, y - amount]
    case 'D':
      return [x, y + amount]
    case 'L':
      return [x - amount, y]
    case 'R':
      return [x + amount, y]
  }
}

function getNextTrailingKnotsPosition(tailPos, headPos) {
  const [tx, ty] = tailPos
  const [hx, hy] = headPos

  const xDiff = hx - tx
  const yDiff = hy - ty

  // touching, don't need to move
  if (Math.abs(xDiff) <= 1 && Math.abs(yDiff) <= 1) return [tx, ty]

  // 2 left
  if (hy === ty && tx === hx - 2) {
    return [tx + 1, ty]
  }

  // 2 right
  if (hy === ty && tx === hx + 2) {
    return [tx - 1, ty]
  }

  // 2 up
  if (hx === tx && ty === hy - 2) {
    return [tx, ty + 1]
  }

  // 2 down
  if (hx === tx && ty === hy + 2) {
    return [tx, ty - 1]
  }

  if (hx !== tx && hy !== ty) {
    const getMethod = num => (num < 0 ? 'floor' : 'ceil')

    const nextTx = tx + Math[getMethod(xDiff)](xDiff / 2)
    const nextTy = ty + Math[getMethod(yDiff)](yDiff / 2)

    return [nextTx, nextTy]
  }

  console.log('missed', tailPos, headPos)
}

const SEPARATOR = `~~~`

function simulateRope() {
  let headPos = [0, 0]
  let tailPos = [0, 0]
  let tailLocations = new Set([tailPos.join(SEPARATOR)])
  let tickCount = 0

  return {
    getState: () => {
      return { headPos, tailPos, tailLocations, tickCount }
    },
    tick(movement) {
      tickCount++
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
  let tailLocations = new Set([
    knotPositions[knotPositions.length - 1].join(SEPARATOR),
  ])

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
          } else {
            knotPositions[index] = getNextTrailingKnotsPosition(
              knot,
              knotPositions[index - 1]
            )
          }

          if (index === knotPositions.length - 1) {
            tailLocations.add(knotPositions[index].join(SEPARATOR))
          }
        }
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
