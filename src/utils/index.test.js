const { intersection, union } = require('./')

test('intersection', () => {
  const a = new Set([1, 2, 3])
  const b = new Set([2, 3, 4])
  const c = new Set([3, 4, 5])

  expect(intersection(a, b, c)).toEqual(new Set([3]))
})

test('union', () => {
  const a = new Set([1, 2, 3])
  const b = new Set([2, 3, 4])
  const c = new Set([3, 4, 5])

  expect(union(a, b, c)).toEqual(new Set([1, 2, 3, 4, 5]))
})
