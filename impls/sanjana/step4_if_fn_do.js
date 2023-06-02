const readline = require('readline');
const { read_str } = require('./reader.js');
const { pr_str } = require("./printer.js");
const { MalSymbol, MalList, MalVector, MalHashMap, MalNil, MalValue } = require('./types.js');
const { ENV } = require('./env.js');
const { initialize, isFalsy } = require('./intializeEnv.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const bindDef = (ast, env) => {
  env.set(ast.value[1], EVAL(ast.value[2], env));
  return env.get(ast.value[1]);
};

const bindLet = (ast, env) => {
  const newEnv = new ENV(env);
  const declaration = ast.value[1].value;
  for (let i = 0; i < declaration.length; i += 2) {
    newEnv.set(declaration[i], EVAL(declaration[i + 1], newEnv));
  }
  if (ast.value[ast.value.length - 1] instanceof MalSymbol) {
    return newEnv.get(ast.value[ast.value.length - 1])
  }
  return EVAL(ast.value[ast.value.length - 1], newEnv);
};

const evalDo = (ast, env) => {
  const evaluated = ast.value.slice(1).map((task) => EVAL(task, env))
  return evaluated[evaluated.length - 1];
};

const evalIf = (ast, env) => {
  const [cond, ifExp, elseExp] = ast.value.slice(1);
  return isFalsy(EVAL(cond, env)) ? EVAL(elseExp, env) : EVAL(ifExp, env);
};

const defineFun = (ast, env) => {
  const [cmd, params, exps] = ast.value;
  const par = params.value.filter((param) => param.value !== '&')
  const fnEnv = new ENV(env, par, exps)
  return (...args) => {
    fnEnv.bindVal(args);
    return EVAL(exps, fnEnv);
  }
};

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env.get(ast);
  }
  if (ast instanceof MalList) {
    const newAst = ast.value.map(x => EVAL(x, env));
    return new MalList(newAst);
  }
  if (ast instanceof MalVector) {
    const newAst = ast.value.map(x => EVAL(x, env));
    return new MalVector(newAst);
  }
  if (ast instanceof MalHashMap) {
    const newAst = ast.value.map(x => EVAL(x, env));
    return new MalHashMap(newAst);
  }

  return ast;
};

const READ = (str) => read_str(str);

const EVAL = (ast, env) => {
  if (!(ast instanceof MalList)) return eval_ast(ast, env)
  if (ast.isEmpty()) return ast

  switch (ast.value[0].value) {
    case "def!": return bindDef(ast, env)
    case "let*": return bindLet(ast, env)
    case "do": return evalDo(ast, env)
    case "if": return evalIf(ast, env)
    case "fn*": return defineFun(ast, env)
  }
  const [fn, ...args] = eval_ast(ast, env).value;
  return fn.apply(null, args);
};

const PRINT = (exp) => pr_str(exp);
const env = initialize();

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