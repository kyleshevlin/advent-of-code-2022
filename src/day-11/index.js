const {
  getData,
  add,
  subtract,
  multiply,
  divide,
  product,
} = require('../utils')

const data = getData(__dirname)

const OP_TO_FN = {
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide,
}

function parseInput(input) {
  return input
    .trim()
    .split('\n\n')
    .map(block => {
      const lines = block.split('\n').map(line => line.trim())
      const result = {}

      for (const line of lines) {
        if (line.startsWith('Starting items: ')) {
          const items = line
            .split('Starting items: ')[1]
            .split(', ')
            .map(Number)
          result.items = items
        }

        if (line.startsWith('Operation: ')) {
          const [op, y] = line.split('Operation: new = old ')[1].split(' ')
          result.operation = { op, y }
        }

        if (line.startsWith('Test: ')) {
          const divisor = line.split(' ').at(-1)
          result.test = Number(divisor)
        }

        if (line.startsWith('If true: ')) {
          const idx = line.split(' ').at(-1)
          result.ifTrue = Number(idx)
        }

        if (line.startsWith('If false: ')) {
          const idx = line.split(' ').at(-1)
          result.ifFalse = Number(idx)
        }
      }

      return result
    })
}

function createSimulation(input) {
  const monkeys = parseInput(input)
  const inspectionCounts = Array(monkeys.length).fill(0)

  return {
    getState: () => ({
      monkeys,
      inspectionCounts,
    }),
    tick() {
      for (const [idx, monkey] of monkeys.entries()) {
        const { items, operation, test, ifTrue, ifFalse } = monkey

        while (items.length) {
          let worry = items.shift()
          inspectionCounts[idx]++

          const { op, y } = operation
          const amount = y === 'old' ? worry : Number(y)
          worry = OP_TO_FN[op](worry, amount)

          worry = Math.floor(worry / 3)

          const testResult = Boolean(worry % test === 0)
          const monkeyIndex = testResult ? ifTrue : ifFalse

          monkeys[monkeyIndex].items.push(worry)
        }
      }
    },
  }
}

function solution1(input) {
  const sim = createSimulation(input)

  for (let i = 0; i < 20; i++) {
    sim.tick()
  }

  const { inspectionCounts } = sim.getState()
  const [x, y] = inspectionCounts.sort((a, b) => b - a).slice(0, 2)

  return x * y
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 99852

function createSimulationTwo(input) {
  const monkeys = parseInput(input)
  const inspectionCounts = Array(monkeys.length).fill(0)

  /**
   * I don't fully grok why this works just yet. Will research and write more.
   * I don't think it's too far off from my idea of we don't need to store the full
   * worry, just a worry that results in the same value somehow.
   */
  const lowestCommonMultiple = product(monkeys.map(monkey => monkey.test))

  return {
    getState: () => ({
      monkeys,
      inspectionCounts,
    }),
    tick() {
      for (const [idx, monkey] of monkeys.entries()) {
        const { items, operation, test, ifTrue, ifFalse } = monkey

        while (items.length) {
          inspectionCounts[idx]++
          let worry = items.shift()

          const { op, y } = operation
          const amount = y === 'old' ? worry : Number(y)
          worry = OP_TO_FN[op](worry, amount)

          worry %= lowestCommonMultiple

          const testResult = Boolean(worry % test === 0)
          const monkeyIndex = testResult ? ifTrue : ifFalse

          monkeys[monkeyIndex].items.push(worry)
        }
      }
    },
  }
}

function solution2(input) {
  const sim = createSimulationTwo(input)

  for (let i = 0; i < 10000; i++) {
    sim.tick()
  }

  const { inspectionCounts } = sim.getState()
  const [x, y] = inspectionCounts.sort((a, b) => b - a).slice(0, 2)

  return x * y
}

// const secondAnswer = solution2(data)
// console.log(secondAnswer) // 25935263541

module.exports = {
  solution1,
  solution2,
}
