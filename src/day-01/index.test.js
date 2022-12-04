const { solution1, solution2, getElves } = require('./')

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

test('solution1', () => {
  expect(solution1(input)).toEqual(24000)
})

test('solution2', () => {
  expect(solution2(input)).toEqual(45000)
})
