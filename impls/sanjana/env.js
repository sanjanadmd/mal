class ENV {
  #outer;
  constructor(outer, binds = [], exps = {}) {
    this.#outer = outer;
    this.data = {};
    this.binds = binds;
    this.exps = exps;
    this.#binds()
  }

  #binds() {
    this.binds.forEach((variable, index) => this.data[variable.value] = this.exps[index]);
  };

  set(symbol, malValue) {
    this.data[symbol.value] = malValue;
  }
  get(symbol) {
    const env = this.find(symbol);
    if (!env) throw `${symbol.value} not found`;
    return env.data[symbol.value];
  }
  find(symbol) {
    if (this.data[symbol.value] !== undefined) return this;
    if (this.#outer) return this.#outer.find(symbol);
  }
}

module.exports = { ENV }