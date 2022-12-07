const { solution1, solution2 } = require('./')

const input = `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`

// I have purposely made this so there are directories with the same names at
// different levels. And files with the same name, too.
const input2 = `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir a
29116 a
2557 g
62596 h.lst
$ cd a
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`

test('solution1', () => {
  expect(solution1(input)).toEqual(95437)
  expect(solution1(input2)).toEqual(95437)
})

test('solution2', () => {
  expect(solution2(input)).toEqual(undefined)
})
