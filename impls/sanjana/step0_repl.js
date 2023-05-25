const { stdin, stdout } = require('process');

const READ = (str) => str;

const EVAL = (ast) => ast;

const PRINT = (exp) => stdout.write(exp);

var repl = () => {
  stdout.write("user> ");
  READ(EVAL)
  stdin.setEncoding('utf-8')
  stdin.on('data', (chunk) => {
    PRINT(EVAL(READ(chunk)));
    stdout.write("user> ");
  })
}

repl();