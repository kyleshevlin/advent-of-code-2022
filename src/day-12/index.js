const { getData, createQueue, safeGridGet } = require('../utils')

const data = getData(__dirname)

function parseInput(input) {
  return input
    .trim()
    .split('\n')
    .map(line => line.split(''))
}

function createNode(key, meta) {
  const children = []

  return {
    key,
    meta,
    children,
    addChild: node => {
      children.push(node)
    },
  }
}

/**
 * This is a modified graph structure, we don't actually use the edges.
 *
 * TODO: move into utils
 */
function createGraph() {
  const nodes = []

  const byKey = key => node => key === node.key

  return {
    nodes,

    addNode(key, meta) {
      let node = nodes.find(byKey(key))

      if (node) return node

      node = createNode(key, meta)
      nodes.push(node)
      return node
    },

    addEdge(node1Key, node2Key) {
      const node1 = nodes.find(byKey(node1Key))
      const node2 = nodes.find(byKey(node2Key))

      if (!(node1 && node2)) return

      node1.addChild(node2)
    },
  }
}

const CHARACTER_ORDER = 'SabcdefghijklmnopqrstuvwxyzE'.split('')

function gridToGraph(grid) {
  const graph = createGraph()

  // Helper for mapping characters to numeric values
  function getCharValue(char) {
    return CHARACTER_ORDER.findIndex(x => x === char)
  }

  // Helper for creating node meta data
  function getNodeMeta(char) {
    return {
      char,
      value: getCharValue(char),
      start: char === 'S',
      end: char === 'E',
    }
  }

  function getNodeKey(rowIdx, colIdx) {
    return `${rowIdx}-${colIdx}`
  }

  function getNeighborIndices(rowIdx, colIdx) {
    return [
      [rowIdx - 1, colIdx],
      [rowIdx, colIdx + 1],
      [rowIdx + 1, colIdx],
      [rowIdx, colIdx - 1],
    ]
  }

  for (const [rowIdx, row] of grid.entries()) {
    for (const [colIdx, char] of row.entries()) {
      const charValue = getCharValue(char)
      const nodeKey = getNodeKey(rowIdx, colIdx)
      const node = graph.addNode(nodeKey, getNodeMeta(char))

      const neighborIndexes = getNeighborIndices(rowIdx, colIdx)

      for (const [neighborRowIdx, neighborColIdx] of neighborIndexes) {
        const neighborChar = safeGridGet(grid, neighborRowIdx, neighborColIdx)

        if (!neighborChar) continue

        const neighborValue = getCharValue(neighborChar)

        if (neighborValue <= charValue + 1) {
          const neighborKey = getNodeKey(neighborRowIdx, neighborColIdx)

          const neighborNode = graph.addNode(
            neighborKey,
            getNodeMeta(neighborChar)
          )

          node.addChild(neighborNode)
        }
      }
    }
  }

  return graph
}

function djikstras(graph, startNode, endNode) {
  const distances = {}

  for (const node of graph.nodes) {
    distances[node.key] = Infinity
  }

  distances[startNode.key] = 0

  const queue = createQueue()
  queue.enqueue(startNode)

  while (!queue.isEmpty()) {
    const node = queue.dequeue()
    const nodeDistance = distances[node.key]

    if (node === endNode) break

    for (const child of node.children) {
      // every edge in our graph has a weight of 1
      const nextDistance = nodeDistance + 1

      if (nextDistance < distances[child.key]) {
        distances[child.key] = nextDistance
        queue.enqueue(child)
      }
    }
  }

  return distances[endNode.key]
}

function solution1(input) {
  const grid = parseInput(input)
  const graph = gridToGraph(grid)

  const startNode = graph.nodes.find(node => node.meta.start)
  const endNode = graph.nodes.find(node => node.meta.end)
  const result = djikstras(graph, startNode, endNode)

  return result
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 408

function solution2(input) {
  /**
   * Modify the grid so that the Start node is just a normal lowest level node
   */
  const grid = parseInput(input).map(row =>
    row.map(char => (char === 'S' ? 'a' : char))
  )
  const graph = gridToGraph(grid)

  const startNodes = graph.nodes.filter(node => node.meta.char === 'a')
  const endNode = graph.nodes.find(node => node.meta.end)

  const results = startNodes.map(startNode =>
    djikstras(graph, startNode, endNode)
  )

  return Math.min(...results)
}

// const secondAnswer = solution2(data)
// console.log(secondAnswer) // 399

module.exports = {
  solution1,
  solution2,
}
