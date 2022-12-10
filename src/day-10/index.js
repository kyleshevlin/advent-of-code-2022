/**
 * Day 10 was a similar simulation pattern puzzle. This time, we're trying to
 * fix a screen. The twist here is that each `tick` of our simulation (each
 * command that we're given), might take up more than one `cycle`. This was kind
 * of fun to figure out. We can add `cycle` in the closure of simulation, and
 * then call it wherever we need it to update. It's like a `tick` inside a `tick`
 * in a way.
 *
 * Part 2 is a bit clever in a way. The instructions tell you that you have
 * 6 rows of 40 characters for your display. But rather than try and keep the
 * pixels we're generating in that structure, I kept them in a flat array.
 * I used modulo to get the "correct" cycle index, and then transformed the flat
 * array into the display with some imperative slicing. Don't make things harder
 * than you have to!
 */

const { getData } = require('../utils')

const data = getData(__dirname)

function parseInput(input) {
  return input.trim().split('\n')
}

const CHARS_PER_ROW = 40

function createSimulation() {
  let value = 1
  const cycles = []
  const pixels = []

  const cycle = () => {
    /**
     * Using modulo this way, we get the correct cycles index for checking
     * the pixel/value for each row of characters.
     *
     * WE WANT TO GET THE LENGTH BEFORE PUSHING TO THE ARRAY AGAIN
     */
    const cycleIdx = cycles.length % CHARS_PER_ROW

    /**
     * Since the cycleIdx tells you where the center character of a 3 character
     * sprite is, we can use Math.abs() and the diff to make a simple check
     * for overlap
     */
    const diff = value - cycleIdx
    const char = Math.abs(diff) <= 1 ? '#' : '.'

    cycles.push(value)
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

      /**
       * We only have 2 types of commands, so this handles the `addx` commands
       */
      const amount = Number(command.split(' ')[1])

      /**
       * It might take some time to understand the instructions, but we want to
       * cycle twice before we update the value
       */
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
