const { MalSymbol, MalList, MalNil, MalStr, MalAtom, MalValue } = require('./types.js');
const { ENV } = require("./env");
const { pr_str } = require("./printer.js");
const { read_str } = require('./reader.js');
const fs = require('fs');

const isFalsy = (value) => {
  return value instanceof MalNil || value === false
};

const coreEnv = {
  '+': (...args) => args.reduce((a, b) => a + b),
  '-': (...args) => args.reduce((a, b) => a - b),
  '*': (...args) => args.reduce((a, b) => a * b),
  '/': (...args) => args.reduce((a, b) => a / b),
  '>': (...args) => args.reduce((a, b) => a > b),
  '<': (...args) => args.reduce((a, b) => a < b),
  '<=': (...args) => args.reduce((a, b) => a <= b),
  '>=': (...args) => args.reduce((a, b) => a >= b),
  'not': (args) => isFalsy(args),
  'list': (...args) => new MalList(args),
  'list?': (args) => args instanceof MalList,
  'empty?': (args) => args?.isEmpty(),
  'count': (args) => args.value.length,
  '=': (...args) => args.reduce((a, b) => a === b),
  'prn': (...args) => {
    const res = args.map(pr_str);
    console.log(res.join(' '));
    return new MalNil();
  },
  'pr-str': (...args) => '"' + args.map(pr_str).join('') + '"',
  'println': (...args) => {
    const res = args.map(arg => arg.value);
    console.log(res.join(' '));
    return new MalNil();
  },
  'str': (args) => args,
  'pr-str': (...args) => {
    const argStr = args.map((arg) => arg.pr_str()).join(' ');
    const updatedStr = argStr.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
    return new MalStr(updatedStr);
  },
  'read-string': (args) => read_str(args.value),
  'slurp': (fileName) => new MalStr(fs.readFileSync(fileName.value, 'utf-8')),
  'atom': (value) => new MalAtom(value),
  'atom?': (value) => value instanceof MalAtom,
  'deref': (atom) => atom.deref(),
  'reset!': (atom, value) => atom.reset(value),
  'swap!': (atom, f, ...args) => atom.swap(f, args),
};

const initialize = () => {
  const env = new ENV();
  Object.entries(coreEnv).forEach(([key, value]) => env.set(new MalSymbol(key), value))
  return env;
};
module.exports = { initialize, isFalsy };