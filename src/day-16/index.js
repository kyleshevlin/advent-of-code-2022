const { getData, isDisjoint } = require('../utils')

const data = getData(__dirname)

function createValve(key, flow, connections) {
  return {
    key,
    flow,
    connections,
  }
}

function parseInput(input) {
  return input
    .trim()
    .split('\n')
    .map(line => {
      const key = line.substring(6, 8)
      const [flow] = line.match(/(?<=rate=)\d*/).map(Number)
      const connections = line
        .split(/to valves? /)[1]
        .split(',')
        .map(x => x.trim())

      return createValve(key, flow, connections)
    })
}

function getValvesMap(valves) {
  const result = {}

  for (const valve of valves) {
    result[valve.key] = valve
  }

  return result
}

function createDistanceMap(valves) {
  const valvesMap = getValvesMap(valves)

  const result = {}

  for (const valve of valves) {
    const _result = {}
    const visited = {}

    // eslint-disable-next-line
    function traverse(valve, visitFn, depth = 0) {
      if (visited[valve.key] && _result[valve.key] < depth) return

      visitFn(valve, depth)
      visited[valve.key] = true

      for (const key of valve.connections) {
        const connection = valvesMap[key]
        traverse(connection, visitFn, depth + 1)
      }
    }

    traverse(valve, ({ key }, depth) => {
      _result[key] = depth
    })

    result[valve.key] = _result
  }

  return result
}

function maximizePressureRelease(valves, minutes) {
  const distanceMap = createDistanceMap(valves)
  const start = valves.find(v => v.key == 'AA')
  const withFlow = valves.filter(v => v.flow > 0)

  let result = -Infinity
  function traverse(
    node,
    path,
    nodesRemaining,
    minutesRemaining,
    accumulatedPressure
  ) {
    const viableNodes = nodesRemaining.filter(remaining => {
      const travel = distanceMap[node.key][remaining.key]
      const cost = travel + 1

      return cost < minutesRemaining
    })

    if (!viableNodes.length && accumulatedPressure > result) {
      result = accumulatedPressure
      return
    }

    for (const remaining of viableNodes) {
      const minutesToTravel = distanceMap[node.key][remaining.key]
      // Takes an additional minute to open the valve
      const minutesCost = minutesToTravel + 1
      const nextMinutesRemaining = minutesRemaining - minutesCost

      const pressure = nextMinutesRemaining * remaining.flow
      const nextNodesRemaining = viableNodes.filter(
        n => n.key !== remaining.key
      )
      const nextAccumulatedPressure = accumulatedPressure + pressure

      traverse(
        remaining,
        path + `->${remaining.key}(${pressure})`,
        nextNodesRemaining,
        nextMinutesRemaining,
        nextAccumulatedPressure
      )
    }
  }

  traverse(start, 'AA(0)', withFlow, minutes, 0)

  return result
}

function solution1(input) {
  const valves = parseInput(input)
  const result = maximizePressureRelease(valves, 30)

  return result
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer) // 1460

/**
 * I knew what I wanted to do but couldn't figure out how to do it. I asked
 * Chat GPT for a function that would give me every permutation of half the list.
 * I then modified it to use sets so I could check disjoint sets later. I still
 * don't love this and think there might be a better way.
 */
function* findSplits(items, sizeDesired, splits = [new Set(), new Set()]) {
  const [left, right] = splits

  if (items.length === 0) {
    let leftSize
    let rightSize

    // Handle cases where desired size is a float
    if (sizeDesired % 1 !== 0) {
      leftSize = Math.ceil(sizeDesired)
      rightSize = Math.floor(sizeDesired)
    }

    if (left.size === leftSize && right.size === rightSize) {
      yield splits
    }
  } else {
    const [next, ...rest] = items

    for (const split of findSplits(rest, sizeDesired, [
      new Set([...left, next]),
      right,
    ])) {
      yield split
    }

    for (const split of findSplits(rest, sizeDesired, [
      left,
      new Set([...right, next]),
    ])) {
      yield split
    }
  }
}

function maximizePressureReleaseWithHelp(valves, minutes) {
  const distanceMap = createDistanceMap(valves)
  const start = valves.find(v => v.key == 'AA')
  const withFlow = valves.filter(v => v.flow > 0)

  // Divide the valves with flow in half in all the ways possible
  let splitSets = []
  for (const split of findSplits(withFlow, withFlow.length / 2)) {
    splitSets.push(split)
  }
  splitSets = splitSets.flat()

  // Iterate through all the halved valve sets and get their result
  // store it in as a combo of their "score" and the set used to achieve that
  const results = []
  for (const set of splitSets) {
    let result = -Infinity

    // eslint-disable-next-line
    function traverse(
      node,
      path,
      nodesRemaining,
      minutesRemaining,
      accumulatedPressure
    ) {
      const viableNodes = nodesRemaining.filter(remaining => {
        const travel = distanceMap[node.key][remaining.key]
        const cost = travel + 1

        return cost < minutesRemaining
      })

      if (!viableNodes.length && accumulatedPressure > result) {
        result = accumulatedPressure
        return
      }

      for (const remaining of viableNodes) {
        const minutesToTravel = distanceMap[node.key][remaining.key]
        // Takes an additional minute to open the valve
        const minutesCost = minutesToTravel + 1
        const nextMinutesRemaining = minutesRemaining - minutesCost

        const pressure = nextMinutesRemaining * remaining.flow
        const nextNodesRemaining = viableNodes.filter(
          n => n.key !== remaining.key
        )
        const nextAccumulatedPressure = accumulatedPressure + pressure

        traverse(
          remaining,
          path + `->${remaining.key}(${pressure})`,
          nextNodesRemaining,
          nextMinutesRemaining,
          nextAccumulatedPressure
        )
      }
    }

    traverse(start, 'AA(0)', [...set], minutes, 0)

    results.push([result, set])
  }

  // Now we can compare every half set to each other and find the best combination
  // where there is no overlap (two sets disjoint from one another). That's because
  // there is no viable scenario where both "characters" would visit the same valve
  let bestCombo = -Infinity
  for (const [aResult, aSet] of results) {
    for (const [bResult, bSet] of results) {
      if (isDisjoint(aSet, bSet)) {
        const combo = aResult + bResult

        if (combo > bestCombo) {
          bestCombo = combo
        }
      }
    }
  }

  return bestCombo
}

function solution2(input) {
  const valves = parseInput(input)
  const result = maximizePressureReleaseWithHelp(valves, 26)

  return result
}

// const secondAnswer = solution2(data)
// console.log(secondAnswer) // 2117

module.exports = {
  solution1,
  solution2,
}
