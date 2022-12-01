const {
  getGreatestCalorieSum,
  getGreatestCalorieSumOfTopThree,
  getElves,
} = require('./')

const input = `
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
`

test('getElves', () => {
  expect(getElves(input)).toEqual([
    [1000, 2000, 3000],
    [4000],
    [5000, 6000],
    [7000, 8000, 9000],
    [10000],
  ])
})

test('getGreatestCalorieSum', () => {
  expect(getGreatestCalorieSum(input)).toEqual(24000)
})

test('getGreatestCalorieSumOfTopThree', () => {
  expect(getGreatestCalorieSumOfTopThree(input)).toEqual(45000)
})
