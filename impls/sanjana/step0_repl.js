const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
const READ = (str) => str;

const EVAL = (ast) => ast;

const PRINT = (exp) => exp;

const rep = (str) => PRINT(EVAL(READ(str)))

const repl = () => {
  rl.question('user> ', (line) => {
    console.log(rep(line))
    repl()
  })
}

repl()