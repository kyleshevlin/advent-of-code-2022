const { getData } = require('../utils')

const data = getData(__dirname)

function parseInput(input) {
  return input.trim().split('\n')
}

function createSimulation() {
  let value = 1
  const cycles = []
  const pixels = []

  const cycle = () => {
    const cycleIdx = cycles.length % 40
    cycles.push(value)

    const diff = value - cycleIdx

    const char = Math.abs(diff) <= 1 ? '#' : '.'
    pixels.push(char)
  }

  return {
    getState: () => ({
      value,
      cycles,
      pixels,
    }),
    tick: command => {
      if (command === 'noop') {
        cycle()
        return
      }

      const amount = Number(command.split(' ')[1])

      cycle()
      cycle()
      value += amount
    },
  }
}

const CYCLE_INDEXES = [20, 60, 100, 140, 180, 220]

function solution1(input) {
  const lines = parseInput(input)
  const sim = createSimulation()

  for (const line of lines) {
    sim.tick(line)
  }

  const { cycles } = sim.getState()

  let result = 0
  for (const idx of CYCLE_INDEXES) {
    result += idx * cycles[idx - 1]
  }

  return result
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 14860

function renderPixels(pixels) {
  return `
${pixels.slice(0, 40).join('')}
${pixels.slice(40, 80).join('')}
${pixels.slice(80, 120).join('')}
${pixels.slice(120, 160).join('')}
${pixels.slice(160, 200).join('')}
${pixels.slice(200).join('')}
`.trim()
}

function solution2(input) {
  const lines = parseInput(input)
  const sim = createSimulation()

  for (const line of lines) {
    sim.tick(line)
  }

  const { pixels } = sim.getState()

  return renderPixels(pixels)
}

// const secondAnswer = solution2(data)
// console.log(secondAnswer) // RGZEHURK

module.exports = {
  solution1,
  solution2,
}
