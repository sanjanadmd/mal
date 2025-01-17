const readline = require('readline');
const { read_str } = require('./reader.js');
const { pr_str } = require("./printer.js");
const { MalSymbol, MalList, MalVector, MalHashMap, MalNil, MalValue, MalFunction } = require('./types.js');
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
  const [bindings, ...forms] = ast.value.slice(1)
  const newEnv = new ENV(env);
  for (let i = 0; i < bindings.length; i += 2) {
    newEnv.set(bindings[i], EVAL(bindings[i + 1], newEnv));
  }
  const doForms = new MalList(new MalSymbol('do'), ...forms);
  return [doForms, newEnv];
};

const evalDo = (ast, env) => {
  const forms = ast.value.slice(1)
  const evaluated = forms.slice(0, -1).map((task) => EVAL(task, env))
  return forms.slice(-1);
};

const evalIf = (ast, env) => {
  let [cond, ifExp, elseExp] = ast.value.slice(1);
  if (isFalsy(EVAL(cond, env)) && elseExp === undefined) {
    elseExp = new MalNil();
  }
  return isFalsy(EVAL(cond, env)) ? elseExp : ifExp;
};

const defineFun = (ast, env) => {
  const [cmd, params, exps] = ast.value;
  return new MalFunction(exps, params, env);
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
  while (true) {
    if (!(ast instanceof MalList)) return eval_ast(ast, env)
    if (ast.isEmpty()) return ast

    switch (ast.value[0].value) {
      case "def!": return bindDef(ast, env)
      case "let*": [ast, env] = bindLet(ast, env)
      case "do": [ast] = evalDo(ast, env); break;
      case "if": ast = evalIf(ast, env); break;
      case "fn*": ast = defineFun(ast, env); break;
      default: {
        const [fn, ...args] = eval_ast(ast, env).value;
        if (fn instanceof MalFunction) {
          ast = fn.value;
          env = new ENV(fn.env, fn.binds.value, args);
        } else {
          return fn.apply(null, args);
        }
      }
    }
  }
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