const { solution1, solution2 } = require('./')

const input = `
root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
`

test('solution1', () => {
  expect(solution1(input)).toEqual(152)
})

test('solution2', () => {
  expect(solution2(input)).toEqual(undefined)
})
