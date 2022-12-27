const { solution1, solution2 } = require('./')

const input = `
#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#
`

test('solution1', () => {
  expect(solution1(input)).toEqual(18)
})

test('solution2', () => {
  expect(solution2(input)).toEqual(54)
})
