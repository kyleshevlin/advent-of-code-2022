const fs = require('fs')
const path = require('path')

function getData(dir) {
  return fs.readFileSync(path.resolve(dir, './input.txt'), {
    encoding: 'utf-8',
  })
}

const add = (x, y) => x + y

const sum = nums => nums.reduce(add, 0)

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

function intersection(set1, set2) {
  const result = new Set()

  for (const item of set1) {
    if (set2.has(item)) {
      result.add(item)
    }
  }

  return result
}

module.exports = {
  add,
  getData,
  intersection,
  sum,
  trace,
}
