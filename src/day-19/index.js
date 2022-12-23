const { getData } = require('../utils')

const data = getData(__dirname)

function parseInput(input) {
  return input
    .trim()
    .split('\n')
    .map(str => {
      const [id] = str.match(/(?<=Blueprint )\d+/).map(Number)
      const [oreRobotCost] = str
        .match(/(?<=Each ore robot costs )[0-9]+/)
        .map(Number)
      const [clayRobotCost] = str
        .match(/(?<=Each clay robot costs )[0-9]+/)
        .map(Number)
      const obsidianRobotCosts = str.match(
        /(?<=Each obsidian robot costs )(?<ore>[0-9]+) ore and (?<clay>[0-9]+)/
      )
      const geodeRobotCosts = str.match(
        /(?<=Each geode robot costs )(?<ore>[0-9]+) ore and (?<obsidian>[0-9]+)/
      )

      return {
        id,
        oreRobot: {
          cost: { ore: oreRobotCost },
        },
        clayRobot: {
          cost: { ore: clayRobotCost },
        },
        obsidianRobot: {
          cost: {
            ore: Number(obsidianRobotCosts.groups.ore),
            clay: Number(obsidianRobotCosts.groups.clay),
          },
        },
        geodeRobot: {
          cost: {
            ore: Number(geodeRobotCosts.groups.ore),
            obsidian: Number(geodeRobotCosts.groups.obsidian),
          },
        },
      }
    })
}

function getBestResultForBlueprint(blueprint) {
  const results = []

  /**
   * TODO: implement an algorithm that walks every possible branch for
   * the blueprint, returning the best result.
   */

  return Math.max(...results)
}

function solution1(input) {
  const blueprints = parseInput(input)
  const bestResults = blueprints.map(getBestResultForBlueprint)
  const result = bestResults.reduce((acc, cur, idx) => acc + cur * idx, 0)

  return result
}

// const firstAnswer = solution1(data)
// console.log(firstAnswer)

function solution2(input) {}

// const secondAnswer = solution2(data)
// console.log(secondAnswer)

module.exports = {
  solution1,
  solution2,
}
