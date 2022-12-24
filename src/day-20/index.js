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

  let tail = head
  for (const item of rest) {
    const node = createNode(item)
    node.previous = tail
    tail.next = node
    tail = node
  }

  // Make it an ouroboros
  tail.next = head
  head.previous = tail

  return {
    head,
    tail,
    find(predicate) {
      let node = this.head

      do {
        if (predicate(node)) return node
        node = node.next
      } while (node !== this.head)

      return null
    },
    delete(node) {
      const { previous, next } = node

      next.previous = previous
      previous.next = next

      if (node === this.head) {
        this.head = next
      }

      if (node === this.tail) {
        this.tail = previous
      }
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
      let node = this.head

      do {
        values.push(node.value.value)
        node = node.next
      } while (node !== this.head)

      return values
    },
  }
}

function solution1(input) {
  const original = parseInput(input)
  const list = createLinkedList(original)

  for (const item of original) {
    const { idx, value } = item

    if (value === 0) continue

    const currentNode = list.find(n => n.value.idx === idx)
    const method = value > 0 ? 'next' : 'previous'

    let insertionNode = currentNode
    let i = 0
    while (i < Math.abs(value)) {
      insertionNode = insertionNode[method]
      i++
    }

    list.delete(currentNode)
    list.insert(currentNode, insertionNode, method)
  }

  console.log(list.print())

  const zeroNode = list.find(n => n.value.value === 0)

  const results = INDICES.map(idx => {
    let node = zeroNode

    for (let i = 0; i < idx; i++) {
      node = node.next
    }

    return node.value.value
  })

  return sum(results)
}

const firstAnswer = solution1(data)
console.log(firstAnswer)

function solution2(input) {}

const secondAnswer = solution2(data)
// console.log(secondAnswer)

module.exports = {
  solution1,
  solution2,
}
