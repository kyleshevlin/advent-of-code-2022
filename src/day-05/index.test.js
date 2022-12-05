const { solution1, solution2 } = require('./')

const input = `
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`

test('solution1', () => {
  expect(solution1(input)).toEqual('CMZ')
})

test('solution2', () => {
  expect(solution2(input)).toEqual('MCD')
})
