/**
 * Day 7 involved a file system. This means trees and recursion!
 *
 * A tree is a graph data structure where a `node` can have many `children`, but
 * only a single `parentNode`. Check out the `utils` folder for how I implemented
 * a tree data structure.
 *
 * When "walking" a tree, we use recursion, because a tree is itself a recursive
 * structure. The `traverse` function (also in `utils`) shows this. We pass it
 * a visiting function and call it as we visit each node, and then do the same
 * for its children, on and on and on.
 *
 * One of the keys to this puzzle is _literally_ the keys, that is the name of
 * the directories. When calculating sizes, be careful if you try to store them
 * in a flat data structure, such as an object map, like I did. If two different
 * directories have the same key, you'll get incorrect results.
 *
 * We parse the program line by line. If it's a `cd` command, we manage the
 * `currentNode` (aka current directory). If it's `ls`, we enter an `isListing`
 * state until we change directory. While we are listing, we parse each line and
 * add the child to the `currentNode` with the appropriate `meta` information to
 * use later when getting the total size.
 */

const { add, createTree, getData, traverse } = require('../utils')

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

        switch (arg) {
          case '/':
            currentNode = tree.rootNode
            break

          case '..':
            currentNode = currentNode.parentNode
            break

          default:
            currentNode = currentNode.findChild(arg)
        }

        continue
      }

      if (line.startsWith('$ ls')) {
        isListing = true
        continue
      }

      if (isListing) {
        const [meta, key] = line.split(' ')

        switch (meta) {
          case 'dir':
            currentNode.addChild(key, { type: 'dir' })
            break

          default:
            currentNode.addChild(key, {
              type: 'file',
              size: Number(meta),
            })
        }

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

function useSizes() {
  const sizes = {}

  const visitor = node => {
    if (node.meta.type === 'dir') {
      // performance.now() suffices as a hash to make each key unique
      const sizeKey = `${node.key}-${performance.now()}}`
      sizes[sizeKey] = getTotalSize(node)
    }
  }

  return { sizes, visitor }
}

function solution1(input) {
  const tree = parseInputIntoTree(input)
  const { sizes, visitor } = useSizes()

  traverse(tree.rootNode, visitor)

  const result = Object.values(sizes)
    .filter(value => value <= 100000)
    .reduce(add, 0)

  return result
}

const firstAnswer = solution1(data)
// console.log(firstAnswer) // 1642503

const TOTAL_DISK_SPACE = 70000000
const SPACE_FOR_UPDATE = 30000000

function solution2(input) {
  const tree = parseInputIntoTree(input)
  const { sizes, visitor } = useSizes()

  traverse(tree.rootNode, visitor)

  const totalSize = Object.values(sizes)[0]
  const minimalDeletionSize = SPACE_FOR_UPDATE - (TOTAL_DISK_SPACE - totalSize)

  const result = Math.min(
    ...Object.values(sizes).filter(value => value >= minimalDeletionSize)
  )

  return result
}

const secondAnswer = solution2(data)
// console.log(secondAnswer) // 6999588

module.exports = {
  solution1,
  solution2,
}
