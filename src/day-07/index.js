const { createTree, getData, add, traverse } = require('../utils')

const data = getData(__dirname)

function parseInputIntoTree(input) {
  const tree = createTree('/', { type: 'dir' })
  const lines = input.trim().split('\n')

  let currentNode = tree.rootNode
  let isListing = false

  for (const line of lines) {
    try {
      if (line.startsWith('$ cd')) {
        isListing = false
        const arg = line.substring(5)

        if (arg === '/') {
          currentNode = tree.rootNode
          continue
        }

        if (arg === '..') {
          currentNode = currentNode.parentNode
          continue
        }

        const node = currentNode.findChild(arg)
        currentNode = node
        continue
      }

      if (line.startsWith('$ ls')) {
        isListing = true
        continue
      }

      if (isListing) {
        const [meta, key] = line.split(' ')

        if (meta === 'dir') {
          currentNode.addChild(key, { type: 'dir' })
          continue
        }

        currentNode.addChild(key, {
          type: 'file',
          size: Number(meta),
        })
        continue
      }

      // Should never be hit
      console.log('unused', line)
    } catch (err) {
      console.log(currentNode, line)
      throw err
    }
  }

  return tree
}

function getTotalSize(node) {
  let result = 0

  for (const child of node.children) {
    if (child.meta.type === 'file') {
      result += child.meta.size
    }

    if (child.meta.type === 'dir') {
      result += getTotalSize(child)
    }
  }

  return result
}

function solution1(input) {
  const tree = parseInputIntoTree(input)
  const sizes = {}

  const visitor = node => {
    if (node.meta.type === 'dir') {
      sizes[`${node.key}-${node.parentNode?.key ?? 'root'}`] =
        getTotalSize(node)
    }
  }

  traverse(tree.rootNode, visitor)

  console.log(sizes)

  const result = Object.values(sizes)
    .filter(value => value <= 100000)
    .reduce(add, 0)

  return result
}

const firstAnswer = solution1(data)
console.log(firstAnswer)

function solution2(input) {}

// const secondAnswer = solution2(data)
// console.log(secondAnswer)

module.exports = {
  parseInputIntoTree,
  solution1,
  solution2,
}
