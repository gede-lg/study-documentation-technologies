# Mixin Pattern: Análise Conceitual

## 🎯 Definição

**Mixin Pattern** é uma técnica de composição onde funcionalidades de múltiplos objetos são "misturadas" (mixed in) em um objeto alvo, permitindo que um objeto adquira métodos e propriedades de várias fontes sem usar herança tradicional.

```javascript
// Mixin de funcionalidades
const podeFalar = {
  falar: function() {
    return `${this.nome} está falando`;
  }
};

const podeAndar = {
  andar: function() {
    return `${this.nome} está andando`;
  }
};

// Objeto alvo
function Pessoa(nome) {
  this.nome = nome;
}

// Aplicar mixins
Object.assign(Pessoa.prototype, podeFalar, podeAndar);

const pessoa = new Pessoa('João');
console.log(pessoa.falar()); // 'João está falando'
console.log(pessoa.andar()); // 'João está andando'
```

**Conceito:** "Composição sobre herança" - combinar comportamentos ao invés de herdar.

## 📋 Implementação Básica

### Função Mixin Helper

```javascript
function mixin(target, ...sources) {
  sources.forEach(function(source) {
    Object.keys(source).forEach(function(key) {
      target[key] = source[key];
    });
  });
  return target;
}

// Uso
const obj = {};
mixin(obj, { a: 1 }, { b: 2 }, { c: 3 });

console.log(obj); // { a: 1, b: 2, c: 3 }
```

### Object.assign (ES6, mas polyfillável)

```javascript
// Object.assign é basicamente um mixin nativo
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
console.log(target); // { a: 1, b: 2, c: 3 }
```

## 🧠 Exemplos Práticos

### Mixin de Eventos

```javascript
const EventEmitterMixin = {
  on: function(event, callback) {
    this._eventos = this._eventos || {};
    this._eventos[event] = this._eventos[event] || [];
    this._eventos[event].push(callback);
  },

  emit: function(event, data) {
    if (!this._eventos || !this._eventos[event]) return;

    this._eventos[event].forEach(function(callback) {
      callback(data);
    });
  },

  off: function(event, callback) {
    if (!this._eventos || !this._eventos[event]) return;

    this._eventos[event] = this._eventos[event].filter(function(cb) {
      return cb !== callback;
    });
  }
};

// Aplicar a um constructor
function Usuario(nome) {
  this.nome = nome;
}

Object.assign(Usuario.prototype, EventEmitterMixin);

// Uso
const user = new Usuario('Ana');

user.on('login', function(data) {
  console.log('Usuário logado:', data.usuario);
});

user.emit('login', { usuario: 'Ana', timestamp: Date.now() });
// 'Usuário logado: Ana'
```

### Múltiplos Mixins

```javascript
// Mixin 1: Timestamp
const TimestampMixin = {
  adicionarTimestamp: function() {
    this.criadoEm = new Date();
  }
};

// Mixin 2: Serialização
const SerializavelMixin = {
  toJSON: function() {
    const obj = {};
    for (let prop in this) {
      if (this.hasOwnProperty(prop) && typeof this[prop] !== 'function') {
        obj[prop] = this[prop];
      }
    }
    return obj;
  },

  fromJSON: function(json) {
    for (let prop in json) {
      this[prop] = json[prop];
    }
    return this;
  }
};

// Mixin 3: Validação
const ValidavelMixin = {
  validar: function() {
    const erros = [];

    if (!this.nome) {
      erros.push('Nome é obrigatório');
    }

    if (this.idade && this.idade < 0) {
      erros.push('Idade deve ser positiva');
    }

    return {
      valido: erros.length === 0,
      erros: erros
    };
  }
};

// Combinar todos
function Entidade(nome, idade) {
  this.nome = nome;
  this.idade = idade;
  this.adicionarTimestamp();
}

Object.assign(
  Entidade.prototype,
  TimestampMixin,
  SerializavelMixin,
  ValidavelMixin
);

// Uso
const ent = new Entidade('Produto X', 5);

console.log(ent.validar());
// { valido: true, erros: [] }

console.log(ent.toJSON());
// { nome: 'Produto X', idade: 5, criadoEm: ... }
```

## 🔍 Exemplo Completo: Sistema de Veículos

```javascript
// Mixin: Movimento
const MovimentoMixin = {
  acelerar: function(incremento) {
    this.velocidade = (this.velocidade || 0) + incremento;
    return `${this.nome} acelerando para ${this.velocidade} km/h`;
  },

  frear: function(decremento) {
    this.velocidade = Math.max(0, (this.velocidade || 0) - decremento);
    return `${this.nome} freando para ${this.velocidade} km/h`;
  },

  parar: function() {
    this.velocidade = 0;
    return `${this.nome} parou`;
  }
};

// Mixin: Combustível
const CombustivelMixin = {
  abastecer: function(litros) {
    this.combustivel = (this.combustivel || 0) + litros;
    return `Abasteceu ${litros}L. Total: ${this.combustivel}L`;
  },

  consumir: function(litros) {
    if (this.combustivel < litros) {
      throw new Error('Combustível insuficiente');
    }

    this.combustivel -= litros;
    return `Consumiu ${litros}L. Restante: ${this.combustivel}L`;
  },

  obterNivelCombustivel: function() {
    return this.combustivel || 0;
  }
};

// Mixin: Manutenção
const ManutencaoMixin = {
  registrarManutencao: function(tipo) {
    this._historicoManutencao = this._historicoManutencao || [];
    this._historicoManutencao.push({
      tipo: tipo,
      data: new Date(),
      km: this.quilometragem || 0
    });
  },

  obterProximaManutencao: function() {
    const kmAtual = this.quilometragem || 0;
    const proximaRevisao = Math.ceil(kmAtual / 10000) * 10000;
    return `Próxima manutenção em ${proximaRevisao - kmAtual} km`;
  }
};

// Constructor: Carro
function Carro(nome, marca) {
  this.nome = nome;
  this.marca = marca;
  this.velocidade = 0;
  this.combustivel = 0;
  this.quilometragem = 0;
}

// Aplicar todos os mixins
Object.assign(
  Carro.prototype,
  MovimentoMixin,
  CombustivelMixin,
  ManutencaoMixin
);

// Constructor: Bicicleta (não usa combustível)
function Bicicleta(nome, tipo) {
  this.nome = nome;
  this.tipo = tipo;
  this.velocidade = 0;
  this.quilometragem = 0;
}

// Aplicar apenas mixins relevantes
Object.assign(
  Bicicleta.prototype,
  MovimentoMixin,
  ManutencaoMixin
  // Não usa CombustivelMixin
);

// Uso
const carro = new Carro('Fusca', 'Volkswagen');

console.log(carro.abastecer(40)); // 'Abasteceu 40L...'
console.log(carro.acelerar(60)); // 'Fusca acelerando para 60 km/h'
carro.registrarManutencao('Troca de óleo');

const bici = new Bicicleta('Caloi', 'Mountain Bike');

console.log(bici.acelerar(25)); // 'Caloi acelerando para 25 km/h'
// bici.abastecer() não existe (não tem CombustivelMixin)
```

## ⚠️ Considerações

### Vantagens

- ✅ **Flexibilidade:** Combine funcionalidades conforme necessário
- ✅ **Reutilização:** Mixins são reutilizáveis entre classes diferentes
- ✅ **Composição:** "Composição sobre herança"
- ✅ **Múltiplas Fontes:** Um objeto pode usar múltiplos mixins

### Desvantagens

- ❌ **Conflitos:** Propriedades com mesmo nome sobrescrevem
- ❌ **Implícito:** Não é claro de onde vêm os métodos
- ❌ **Difícil Debug:** Stack traces podem ser confusos
- ❌ **Sem Type Checking:** Não há verificação de tipo

### Conflitos de Nome

```javascript
const mixin1 = {
  metodo: function() {
    return 'Mixin 1';
  }
};

const mixin2 = {
  metodo: function() {
    return 'Mixin 2';
  }
};

const obj = {};
Object.assign(obj, mixin1, mixin2);

console.log(obj.metodo()); // 'Mixin 2' (último sobrescreve)
```

## 🔗 Alternativas Modernas

### ES6 Classes com Mixins

```javascript
// Função mixin para classes ES6
const ComTimestamp = (Base) => class extends Base {
  adicionarTimestamp() {
    this.criadoEm = new Date();
  }
};

const ComValidacao = (Base) => class extends Base {
  validar() {
    return this.nome ? true : false;
  }
};

// Compor classe
class Entidade {}
class EntidadeCompleta extends ComValidacao(ComTimestamp(Entidade)) {}

const ent = new EntidadeCompleta();
ent.adicionarTimestamp();
console.log(ent.criadoEm);
```

Mixin Pattern é fundamental para **composição** em JavaScript ES5, permitindo combinar funcionalidades de forma flexível sem herança rígida. É a base do princípio "composição sobre herança" em JavaScript.
