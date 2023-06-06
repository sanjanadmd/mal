class MalValue {
  constructor(value) {
    this.value = value
  }
  pr_str() {
    return this.value.toString();
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalList extends MalValue {
  constructor(value) {
    super(value);
  }
  pr_str() {
    return "(" + this.value.map(x => x instanceof MalValue ? x.pr_str() : x).join(' ') + ")";
  }
  isEmpty() {
    return this.value.length === 0
  }
  count() {
    return this.value.length
  }
}

class MalHashMap extends MalValue {
  constructor(value) {
    super(value);
  }
  pr_str() {
    return "{" + this.value.map(x => x instanceof MalValue ? x.pr_str() : x).join(' ') + "}";
  }
  isEmpty() {
    return this.value.length === 0
  }
}
class MalVector extends MalValue {
  constructor(value) {
    super(value);
  }
  pr_str() {
    return "[" + this.value.map(x => x instanceof MalValue ? x.pr_str() : x).join(' ') + "]";
  }
  isEmpty() {
    return this.value.length === 0
  }
  count() {
    return this.value.length
  }
}
class MalStr extends MalValue {
  constructor(value) {
    super(value);
  }
  pr_str() {
    return '"' + this.value
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n") + '"';
  }
  isEmpty() {
    return this.value.length === 0
  }
  count() {
    return this.value.length
  }
}
class MalNil extends MalValue {
  constructor() {
    super(null);
  }
  pr_str() {
    return "nil";
  }
  count() {
    return 0
  }
  equals(value) {
    return value === 'nil'
  }
}

class MalFunction extends MalValue {
  constructor(ast, binds, env, fn) {
    super(ast);
    this.binds = binds;
    this.env = env;
    this.fn = fn;
  }
  pr_str() {
    return "#<function>"
    // return '"' + this.value.toString() + '"';
  }
}
class MalAtom extends MalValue {
  constructor(ast) {
    super(ast);
  }
  pr_str() {
    return "(atom " + this.value + ")";
  }
  deref() {
    return this.value;
  }
  reset(value) {
    this.value = value;
    return this.value;
  }
  swap(fn, args) {
    let actualFn = fn;
    if (fn instanceof MalFunction) {
      actualFn = fn.fn;
    }
    this.value = actualFn.apply(null, [this.value, ...args]);
    return this.value;
  }
}

const createMalString = (str) => {
  return new MalStr(str.replace(/\\(.)/g, (y, captured) => {
    return captured === 'n' ? '\n' : captured
  }))
};

module.exports = { MalSymbol, MalValue, MalList, MalVector, MalNil, MalStr, MalHashMap, MalFunction, MalAtom, createMalString };