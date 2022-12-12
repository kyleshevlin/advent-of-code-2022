const { getData, createQueue } = require('../utils')

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

function createGraph() {
  const nodes = []
  const edges = []

  const byKey = key => node => key === node.key

  return {
    nodes,
    edges,

    addNode(key, meta) {
      let node = this.findNode(byKey(key))

      if (node) return node

      node = createNode(key, meta)
      nodes.push(node)
      return node
    },

    findNode(predicate) {
      return nodes.find(predicate)
    },

    addEdge(node1Key, node2Key) {
      const node1 = this.findNode(byKey(node1Key))
      const node2 = this.findNode(byKey(node2Key))

      if (!(node1 && node2)) return

      node1.addChild(node2)

      edges.push(`${node1Key}=>${node2Key}`)
    },
  }
}

const CHARACTER_ORDER = 'SabcdefghijklmnopqrstuvwxyzE'.split('')

function gridToGraph(grid) {
  const graph = createGraph()

  function getCharValue(char) {
    return CHARACTER_ORDER.findIndex(x => x === char)
  }

  function getNodeMeta(char) {
    return {
      char,
      value: getCharValue(char),
      start: char === 'S',
      end: char === 'E',
    }
  }

  function safeGridGet(rowIdx, colIdx) {
    try {
      return grid[rowIdx][colIdx]
    } catch (err) {
      return undefined
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

      for (const [_rowIdx, _colIdx] of neighborIndexes) {
        const neighbor = safeGridGet(_rowIdx, _colIdx)

        if (neighbor && getCharValue(neighbor) <= charValue + 1) {
          const neighborKey = getNodeKey(_rowIdx, _colIdx)

          const neighborNode = graph.addNode(neighborKey, getNodeMeta(neighbor))

          node.addChild(neighborNode)
          graph.addEdge(node.key, neighborNode.key)
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

  const startNode = graph.findNode(node => node.meta.start)
  const endNode = graph.findNode(node => node.meta.end)
  const result = djikstras(graph, startNode, endNode)

  return result
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 408

function solution2(input) {
  const grid = parseInput(input).map(row =>
    row.map(char => (char === 'S' ? 'a' : char))
  )
  const graph = gridToGraph(grid)

  const startNodes = graph.nodes.filter(node => node.meta.char === 'a')
  const endNode = graph.findNode(node => node.meta.end)

  const results = []

  for (const node of startNodes) {
    results.push(djikstras(graph, node, endNode))
  }

  return Math.min(...results)
}

// const secondAnswer = solution2(data)
// console.log(secondAnswer) // 399

module.exports = {
  solution1,
  solution2,
}
