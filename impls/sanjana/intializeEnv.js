const { MalSymbol, MalList, MalNil, MalStr } = require('./types.js');
const { ENV } = require("./env");
const { pr_str } = require("./printer.js");

const isFalsy = (value) => {
  return value instanceof MalNil || value === false
};
const initialize = () => {
  const env = new ENV();

  env.set(new MalSymbol('+'), (...args) => args.reduce((a, b) => a + b));
  env.set(new MalSymbol('-'), (...args) => args.reduce((a, b) => a - b));
  env.set(new MalSymbol('*'), (...args) => args.reduce((a, b) => a * b));
  env.set(new MalSymbol('/'), (...args) => args.reduce((a, b) => a / b));
  env.set(new MalSymbol('>'), (...args) => args.reduce((a, b) => a > b));
  env.set(new MalSymbol('<'), (...args) => args.reduce((a, b) => a < b));
  env.set(new MalSymbol('<='), (...args) => args.reduce((a, b) => a <= b));
  env.set(new MalSymbol('>='), (...args) => args.reduce((a, b) => a >= b));
  env.set(new MalSymbol('not'), (args) => isFalsy(args));
  env.set(new MalSymbol('list'), (...args) => new MalList(args));
  env.set(new MalSymbol('list?'), (args) => args instanceof MalList);
  env.set(new MalSymbol('empty?'), (args) => args?.isEmpty());
  env.set(new MalSymbol('count'), (args) => args.value.length);
  env.set(new MalSymbol('='), (...args) => args.reduce((a, b) => a === b));
  env.set(new MalSymbol('prn'), (...args) => {
    const res = args.map(pr_str);
    console.log(res.join(' '));
    return new MalNil();
  });
  env.set(new MalSymbol('pr-str'), (...args) => '"' + args.map(pr_str).join('') + '"');
  env.set(new MalSymbol('println'), (...args) => {
    const res = args.map(arg => arg.value);
    console.log(res.join(' '));
    return new MalNil();
  });
  env.set(new MalSymbol('str'), (args) => args);
  env.set(new MalSymbol('pr-str'), (...args) => {
    const argStr = args.map((arg) => arg.pr_str()).join(' ');
    const updatedStr = argStr.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
    return new MalStr(updatedStr);
  });
  return env;
};

module.exports = { initialize, isFalsy };