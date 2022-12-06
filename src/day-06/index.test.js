const { solution1, solution2 } = require('./')

const input1 = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`
const input2 = `bvwbjplbgvbhsrlpgdmjqwftvncz`
const input3 = `nppdvjthqldpwncqszvftbrmjlhg`
const input4 = `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`
const input5 = `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`

test('solution1', () => {
  expect(solution1(input1)).toEqual(7)
  expect(solution1(input2)).toEqual(5)
  expect(solution1(input3)).toEqual(6)
  expect(solution1(input4)).toEqual(10)
  expect(solution1(input5)).toEqual(11)
})

test('solution2', () => {
  expect(solution2(input1)).toEqual(19)
  expect(solution2(input2)).toEqual(23)
  expect(solution2(input3)).toEqual(23)
  expect(solution2(input4)).toEqual(29)
  expect(solution2(input5)).toEqual(26)
})
