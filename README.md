# Advent of Code 2022

Here are my solutions to the [Advent of Code](https://adventofcode.com/2022) puzzles for 2022.

I'm using plain JavaScript for my solutions, using Node to run my scripts.

Each day has its own directory. The solutions can be found under `index.js`, with a few tests in `index.test.js` to verify some of the functions and algorithms created to solve that day's problems.

Hope you enjoy!

## How to use this repo if you fork it

Here's my process for solving the problems

- Copy/paste the input text you get from the puzzle into that day's `input.txt` file. So for Day 1, you put it in `src/day-01/input.txt`
- The problem generally gives you an example of the input and the expected output, use these to write tests in that day's `index.test.js` file.
- Write the code in that day's `index.js` file.
- To run the tests, use `npm` or `yarn` to run the `test` script found in the `package.json`. Do this in a terminal that can run Node.
- Once you think you have the code correct, then in order to get your solution answer, set the result of your code to a value and log it out to a terminal using Node. I do it like this:

```javascript
const firstAnswer = someFunction(data)
console.log(firstAnswer)
```

and then in the terminal, let's say it's for Day 1, I would do:

```bash
cd src/day-01
node index.js
```

and observe the output. Be aware that you might run into infinite loops, and there are definitely problems that will not complete because they're designed to be too memory intensive. You'll probably have to kill a node process or two as you solve these challenges.

It's very rudimentary, but it does the trick.
