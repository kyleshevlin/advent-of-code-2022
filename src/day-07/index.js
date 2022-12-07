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
      const sizeKey = `${node.key}-${node.parentNode?.key ?? 'root'}`
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

  const totalSize = sizes['/-root']
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
