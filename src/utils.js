const fs = require('fs')
const path = require('path')

function getData(dir) {
  return fs.readFileSync(path.resolve(dir, './input.txt'), {
    encoding: 'utf-8',
  })
}

const add = (x, y) => x + y

const sum = nums => nums.reduce(add, 0)

const trace = msg => x => (console.log(msg, x), x)

module.exports = {
  add,
  getData,
  sum,
  trace,
}
