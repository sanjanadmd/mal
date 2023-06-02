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
    return '"' + this.value.toString() + '"';
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
}

class MalFunction extends MalValue {
  constructor(ast, binds, env) {
    super(ast);
    this.binds = binds;
    this.env = env;
  }
  pr_str() {
    return "#<function>"
    // return '"' + this.value.toString() + '"';
  }
}

module.exports = { MalSymbol, MalValue, MalList, MalVector, MalNil, MalStr, MalHashMap, MalFunction };