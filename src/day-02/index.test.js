const { alternateGetTotalFromPairs, getTotalFromPairs } = require('./')

const input = `
A Y
B X
C Z
`

test('getTotalFromPairs', () => {
  expect(getTotalFromPairs(input)).toEqual(15)
})

test('alternateGetTotalFromPairs', () => {
  expect(alternateGetTotalFromPairs(input)).toEqual(12)
})
