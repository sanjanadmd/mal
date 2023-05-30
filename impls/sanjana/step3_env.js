const readline = require('readline');
const { read_str } = require('./reader.js');
const { pr_str } = require("./printer.js");
const { MalSymbol, MalList, MalVector, MalHashMap, MalNil } = require('./types.js');
const { ENV } = require('./env.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const _env = {
  '+': (...args) => args.reduce((a, b) => a + b),
  '-': (...args) => args.reduce((a, b) => a - b),
  '*': (...args) => args.reduce((a, b) => a * b),
  '/': (...args) => args.reduce((a, b) => a / b),
}

const env = new ENV();
Object.entries(_env).map(([symbol, task]) => env.set(new MalSymbol(symbol), task));

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env.get(ast);
  }
  if (ast instanceof MalList) {
    const newAst = ast.value.map(x => EVAL(x, env))
    return new MalList(newAst);
  }
  if (ast instanceof MalVector) {
    const newAst = ast.value.map(x => EVAL(x, env))
    return new MalVector(newAst);
  }
  if (ast instanceof MalHashMap) {
    const newAst = ast.value.map(x => EVAL(x, env))
    return new MalHashMap(newAst);
  }

  return ast;
};

const READ = (str) => read_str(str);

const EVAL = (ast, env) => {
  if (!(ast instanceof MalList)) return eval_ast(ast, env)
  if (ast.isEmpty()) return ast

  switch (ast.value[0].value) {
    case "def!":
      env.set(ast.value[1], EVAL(ast.value[2], env));
      return env.get(ast.value[1]);

    case "let*": {
      const newEnv = new ENV(env);
      const declaration = ast.value[1].value;
      for (let i = 0; i < declaration.length; i += 2) {
        newEnv.set(declaration[i], EVAL(declaration[i + 1], newEnv));
      }
      if (ast.value[ast.value.length - 1] instanceof MalSymbol) {
        return newEnv.get(ast.value[ast.value.length - 1])
      }
      return EVAL(ast.value[ast.value.length - 1], newEnv);
    }
  }
  const [fn, ...args] = eval_ast(ast, env).value;
  return fn.apply(null, args);
};

const PRINT = (exp) => pr_str(exp);

const rep = (str) => PRINT(EVAL(READ(str), env));

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