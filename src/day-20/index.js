const { getData, sum } = require('../utils')

const data = getData(__dirname)

function parseInput(input) {
  return input
    .trim()
    .split('\n')
    .map(Number)
    .map((value, idx) => ({ idx, value }))
}

const INDICES = [1000, 2000, 3000]

const OPPOSITE = {
  previous: 'next',
  next: 'previous',
}

function createNode(value) {
  return { value, next: null, previous: null }
}

function createLinkedList(items) {
  const [first, ...rest] = items

  const head = createNode(first)
  let zeroNode

  let previousNode = head
  for (const item of rest) {
    const node = createNode(item)

    if (item.value === 0) zeroNode = node

    node.previous = previousNode
    previousNode.next = node
    previousNode = node
  }

  // Make it an ouroboros (a cycle)
  previousNode.next = head
  head.previous = previousNode

  return {
    zeroNode,
    find(predicate) {
      let node = zeroNode

      do {
        if (predicate(node)) return node
        node = node.next
      } while (node !== zeroNode)

      return null
    },
    delete(node) {
      const { previous, next } = node
      next.previous = previous
      previous.next = next
    },
    insert(node, insertionNode, method) {
      const adjacentNode = insertionNode[method]

      // Insert the node
      insertionNode[method] = node

      // Connect the node
      node[method] = adjacentNode
      node[OPPOSITE[method]] = insertionNode

      // Connect the adjacent node
      adjacentNode[OPPOSITE[method]] = node
    },
    print() {
      const values = []
      let node = zeroNode

      do {
        values.push(node.value.value)
        node = node.next
      } while (node !== zeroNode)

      return values
    },
  }
}

function getValues(list) {
  return INDICES.map(idx => {
    let node = list.zeroNode

    for (let i = 0; i < idx; i++) {
      node = node.next
    }

    return node.value.value
  })
}

function mix(original, list) {
  for (const item of original) {
    const { idx, value } = item

    if (value === 0) continue

    const currentNode = list.find(n => n.value.idx === idx)
    const method = value > 0 ? 'next' : 'previous'

    let insertionNode = currentNode
    let i = 0
    // I still don't really understand why we modulate with the length of the list -1
    while (i < Math.abs(value) % (original.length - 1)) {
      insertionNode = insertionNode[method]
      i++
    }

    list.delete(currentNode)
    list.insert(currentNode, insertionNode, method)
  }
}

function solution1(input) {
  const original = parseInput(input)
  const list = createLinkedList(original)

  mix(original, list)

  const values = getValues(list)
  return sum(values)
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 6712

const ENCRYPTION_KEY = 811589153

function solution2(input) {
  const original = parseInput(input).map(x => ({
    ...x,
    value: x.value * ENCRYPTION_KEY,
  }))
  const list = createLinkedList(original)

  for (let i = 0; i < 10; i++) {
    mix(original, list)
  }

  const values = getValues(list)
  return sum(values)
}

// const secondAnswer = solution2(data)
// console.log(secondAnswer) // 1595584274798

module.exports = {
  solution1,
  solution2,
}
