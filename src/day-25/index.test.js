const { solution1, solution2, toDecimal, toSnafu } = require('./')

const input = `
1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122
`

test('solution1', () => {
  expect(solution1(input)).toEqual('2=-1=0')
})

test('solution2', () => {
  expect(solution2(input)).toEqual(undefined)
})

test('toDecimal', () => {
  expect(toDecimal('1=-0-2')).toEqual(1747)
  expect(toDecimal('12111')).toEqual(906)
  expect(toDecimal('2=0=')).toEqual(198)
  expect(toDecimal('21')).toEqual(11)
  expect(toDecimal('2=01')).toEqual(201)
  expect(toDecimal('111')).toEqual(31)
  expect(toDecimal('20012')).toEqual(1257)
  expect(toDecimal('112')).toEqual(32)
  expect(toDecimal('1=-1=')).toEqual(353)
  expect(toDecimal('1-12')).toEqual(107)
  expect(toDecimal('12')).toEqual(7)
  expect(toDecimal('1=')).toEqual(3)
  expect(toDecimal('122')).toEqual(37)
})

test('toSnafu', () => {
  // expect(toSnafu(1)).toEqual('1')
  // expect(toSnafu(2)).toEqual('2')
  // expect(toSnafu(3)).toEqual('1=')
  expect(toSnafu(4)).toEqual('1-')
  // expect(toSnafu(5)).toEqual('10')
  // expect(toSnafu(6)).toEqual('11')
  // expect(toSnafu(7)).toEqual('12')
  // expect(toSnafu(8)).toEqual('2=')
  // expect(toSnafu(9)).toEqual('2-')
  // expect(toSnafu(10)).toEqual('20')
  // expect(toSnafu(15)).toEqual('1=0')
  // expect(toSnafu(20)).toEqual('1-0')
  // expect(toSnafu(2022)).toEqual('1=11-2')
  // expect(toSnafu(1747)).toEqual('1=-0-2')
  // expect(toSnafu(906)).toEqual('12111')
  // expect(toSnafu(198)).toEqual('2=0=')
  // expect(toSnafu(11)).toEqual('21')
  // expect(toSnafu(201)).toEqual('2=01')
  // expect(toSnafu(31)).toEqual('111')
  // expect(toSnafu(1257)).toEqual('20012')
  // expect(toSnafu(32)).toEqual('112')
  // expect(toSnafu(353)).toEqual('1=-1=')
  // expect(toSnafu(107)).toEqual('1-12')
  // expect(toSnafu(37)).toEqual('122')
})
