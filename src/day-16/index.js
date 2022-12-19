const { getData } = require('../utils')

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
  // console.log([...withFlow].sort((a, b) => b.flow - a.flow))

  let result = -Infinity
  let winningPath
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
      winningPath = path
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

function solution2(input) {}

// const secondAnswer = solution2(data)
// console.log(secondAnswer)

module.exports = {
  solution1,
  solution2,
}
