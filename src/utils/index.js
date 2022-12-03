const fs = require('fs')
const path = require('path')

function getData(dir) {
  return fs.readFileSync(path.resolve(dir, './input.txt'), {
    encoding: 'utf-8',
  })
}

/**
 * Data Structures
 */

function createQueue() {
  const queue = []

  return {
    enqueue(item) {
      queue.push(item)
    },
    dequeue() {
      return queue.shift()
    },
    isEmpty() {
      return queue.length === 0
    },
    peek() {
      return queue[0]
    },
    print() {
      console.log(queue)
    },
  }
}

function createStack() {
  const stack = []

  return {
    push(item) {
      stack.push(item)
    },
    pop() {
      return stack.pop()
    },
    isEmpty() {
      return stack.length === 0
    },
    peek() {
      return stack[stack.length - 1]
    },
    print() {
      console.log(stack)
    },
  }
}

/**
 * Math helpers
 */

const add = (x, y) => x + y

const sum = nums => nums.reduce(add)

const subtract = (x, y) => x - y

const difference = nums => nums.reduce(subtract)

const multiply = (x, y) => x * y

const product = nums => nums.reduce(multiply)

const divide = (x, y) => x / y

const quotient = nums => nums.reduce(divide)

/**
 * Set helpers
 */

function intersection(...sets) {
  return sets.reduce((set1, set2) => {
    const result = new Set()

    for (const item of set2) {
      if (set1.has(item)) {
        result.add(item)
      }
    }

    return result
  })
}

function union(...sets) {
  const result = new Set()

  for (const set of sets) {
    for (const item of set) {
      result.add(item)
    }
  }

  return result
}

/**
 * Functional Programming helpers
 */

// prettier-ignore
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x)

const map = fn => array => array.map(fn)

const reduce = (reducer, initialArg) => array =>
  array.reduce(reducer, initialArg)

/**
 * Use this with map to log out the current value next to the message while
 * still returning the value to keep your composition working. Example:
 *
 * ```javascript
 * const result = [1, 2, 3]
 *   .map(double)
 *   .map(trace('after double'))
 *   .reduce(add, 0)
 * ```
 */
const trace = msg => x => (console.log(msg, x), x)

module.exports = {
  add,
  createQueue,
  createStack,
  difference,
  divide,
  getData,
  intersection,
  map,
  multiply,
  pipe,
  product,
  quotient,
  reduce,
  subtract,
  sum,
  trace,
  union,
}
