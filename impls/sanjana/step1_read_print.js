const { log } = require('console');
const readline = require('readline');
const { read_str } = require('./reader.js');
const { pr_str } = require("./printer.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const READ = (str) => read_str(str);

const EVAL = (ast) => ast;

const PRINT = (exp) => pr_str(exp);

const rep = (str) => PRINT(EVAL(READ(str)));

const repl = () => {
  rl.question('user> ', (line) => {
    try {
      console.log(rep(line));
    } catch (e) {
      console.log(e);
    }
    repl();
  });
}

repl();