const { MalSymbol, MalValue, MalList, MalVector, MalNil, MalHashMap, MalStr, createMalString } = require("./types");

class Reader {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  peek() {
    return this.tokens[this.position];
  }

  next() {
    const token = this.peek();
    this.position++;
    return token;
  }
}

const tokenize = (str) => {
  const regEx =
    /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
  return [...str.matchAll(regEx)].map(x => x[1]);
};

const read_atom = (reader) => {
  const token = reader.next();
  if (token.match(/^-?[0-9]+$/)) {
    return parseInt(token);
  }

  if (token === "true") return true;
  if (token === "false") return false;
  if (token === "nil") return new MalNil();
  if (token[0] === ":") return token;
  if (token[0] === '"') {
    if (token.slice(-1) !== '"') throw "unbalanced \"";
    return createMalString(token.substr(1, token.length - 2));
  }
  return new MalSymbol(token);
};

const read_seq = (reader, closingSymbol) => {
  reader.next();
  const ast = [];
  while (reader.peek() !== closingSymbol) {
    if (reader.peek() === undefined) {
      throw "unbalanced" + closingSymbol;
    }
    ast.push(read_form(reader));
  }
  reader.next();
  return ast;
};

const read_list = (reader) => {
  const ast = read_seq(reader, ')');
  return new MalList(ast);
};

const read_vector = (reader) => {
  const ast = read_seq(reader, ']');
  return new MalVector(ast);
};
const read_hashmap = (reader) => {
  const ast = read_seq(reader, '}');
  if (ast.length % 2 !== 0) {
    throw "unbalanced }";
  }
  return new MalHashMap(ast);
};

const prependSymbol = (reader, action) => {
  reader.next();
  const symbol = new MalSymbol(action);
  const newAst = read_form(reader);
  return new MalList([symbol, newAst]);
};

const read_form = (reader) => {
  const token = reader.peek();
  switch (token) {
    case '(': return read_list(reader);
    case '[': return read_vector(reader);
    case '{': return read_hashmap(reader);
    case ';': reader.next(); return new MalNil();
    case '@': return prependSymbol(reader, 'deref')
    case "'": return prependSymbol(reader, 'quote')
    case "`": return prependSymbol(reader, 'quasiquote')
    case "~": return prependSymbol(reader, 'unquote')
    case "~@": return prependSymbol(reader, 'splice-unquote')
    default: return read_atom(reader);
  }
};

const read_str = (str) => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  return read_form(reader);
};


module.exports = { read_str }