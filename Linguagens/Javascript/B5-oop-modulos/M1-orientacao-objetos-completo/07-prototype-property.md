# Prototype Property: Análise Conceitual Profunda

## 🎯 Introdução e Definição

A **prototype property** é uma propriedade especial que **toda função** em JavaScript possui automaticamente. Quando uma função é usada como constructor (com `new`), sua `prototype property` se torna o **prototype das instâncias criadas** - é onde você adiciona métodos e propriedades compartilhados.

```javascript
function Pessoa(nome) {
  this.nome = nome;
}

// prototype property da função Pessoa
console.log(Pessoa.prototype); // { constructor: Pessoa }

// Adicionar método ao prototype
Pessoa.prototype.cumprimentar = function() {
  return `Olá, sou ${this.nome}`;
};

const pessoa = new Pessoa('João');

// Instância herda de Pessoa.prototype
console.log(pessoa.__proto__ === Pessoa.prototype); // true
console.log(pessoa.cumprimentar()); // 'Olá, sou João'
```

## 📋 Conceitos Fundamentais

### Prototype Property vs __proto__

**Distinção crucial:**

- **`Constructor.prototype`:** Propriedade da **função constructor**
- **`instancia.__proto__`:** Link interno da **instância** para o prototype

```javascript
function Animal(nome) {
  this.nome = nome;
}

const gato = new Animal('Miau');

// prototype property: propriedade da função
console.log(Animal.prototype); // Objeto com métodos compartilhados

// __proto__: link da instância para o prototype
console.log(gato.__proto__); // Aponta para Animal.prototype

// São o mesmo objeto!
console.log(gato.__proto__ === Animal.prototype); // true
```

### Estrutura do Prototype Property

```javascript
function Carro(marca) {
  this.marca = marca;
}

// Prototype tem propriedade 'constructor' por padrão
console.log(Carro.prototype.constructor === Carro); // true

// Adicionar métodos
Carro.prototype.dirigir = function() {
  return `${this.marca} está dirigindo`;
};

Carro.prototype.parar = function() {
  return `${this.marca} parou`;
};

// Prototype agora tem 3 propriedades
console.log(Object.keys(Carro.prototype)); // ['dirigir', 'parar']
console.log(Carro.prototype.constructor); // [Function: Carro]
```

## 🧠 Análise Profunda

### Adicionar Métodos ao Prototype

```javascript
function Contador(valorInicial) {
  this.valor = valorInicial || 0;
}

// Método 1: Um por vez
Contador.prototype.incrementar = function() {
  this.valor++;
  return this.valor;
};

Contador.prototype.decrementar = function() {
  this.valor--;
  return this.valor;
};

Contador.prototype.resetar = function() {
  this.valor = 0;
};

// Método 2: Substituir prototype inteiro (CUIDADO!)
Contador.prototype = {
  // Precisa restaurar constructor manualmente
  constructor: Contador,

  incrementar: function() {
    this.valor++;
    return this.valor;
  },

  decrementar: function() {
    this.valor--;
    return this.valor;
  },

  resetar: function() {
    this.valor = 0;
  }
};

// Uso
const cont = new Contador(10);
cont.incrementar(); // 11
cont.decrementar(); // 10
cont.resetar(); // 0
```

### Compartilhamento de Métodos

```javascript
function Usuario(nome) {
  this.nome = nome;
}

Usuario.prototype.saudar = function() {
  return `Olá, ${this.nome}`;
};

const user1 = new Usuario('Ana');
const user2 = new Usuario('Carlos');

// Ambos compartilham o MESMO método
console.log(user1.saudar === user2.saudar); // true

// Economia de memória: um método para todas instâncias
console.log(user1.saudar); // [Function]
console.log(user2.saudar); // [Function] (mesmo objeto!)
```

### Propriedade constructor

```javascript
function Produto(nome) {
  this.nome = nome;
}

// constructor aponta de volta para a função
console.log(Produto.prototype.constructor === Produto); // true

const prod = new Produto('Notebook');

// Instância pode acessar constructor via prototype
console.log(prod.constructor === Produto); // true

// Útil para criar novas instâncias dinamicamente
const novoProduto = new prod.constructor('Mouse');
console.log(novoProduto.nome); // 'Mouse'
```

### Sobrescrever Prototype (Armadilha)

```javascript
function Animal(nome) {
  this.nome = nome;
}

// Adicionar método
Animal.prototype.falar = function() {
  return `${this.nome} faz som`;
};

const gato = new Animal('Miau');
console.log(gato.falar()); // 'Miau faz som'

// ❌ PROBLEMA: Sobrescrever prototype APÓS criar instâncias
Animal.prototype = {
  correr: function() {
    return `${this.nome} está correndo`;
  }
};

// Instância antiga ainda aponta para prototype antigo!
console.log(gato.falar()); // Ainda funciona!
console.log(gato.correr); // undefined (não vê novo prototype)

// Nova instância vê novo prototype
const cachorro = new Animal('Rex');
console.log(cachorro.correr()); // 'Rex está correndo'
console.log(cachorro.falar); // undefined (método antigo perdido)
```

## 🔍 Exemplo Completo: Sistema de Tarefas

```javascript
function Tarefa(titulo, prioridade) {
  // Propriedades de instância
  this.titulo = titulo;
  this.prioridade = prioridade || 'normal';
  this.concluida = false;
  this.dataCriacao = new Date();
}

// Métodos compartilhados no prototype
Tarefa.prototype.concluir = function() {
  this.concluida = true;
  this.dataConclusao = new Date();
  return this;
};

Tarefa.prototype.reabrir = function() {
  this.concluida = false;
  delete this.dataConclusao;
  return this;
};

Tarefa.prototype.alterarPrioridade = function(novaPrioridade) {
  const prioridadesValidas = ['baixa', 'normal', 'alta', 'urgente'];

  if (!prioridadesValidas.includes(novaPrioridade)) {
    throw new Error('Prioridade inválida');
  }

  this.prioridade = novaPrioridade;
  return this;
};

Tarefa.prototype.obterResumo = function() {
  const status = this.concluida ? '✓' : '○';
  const tempoAberta = this.concluida
    ? Math.floor((this.dataConclusao - this.dataCriacao) / 1000)
    : Math.floor((Date.now() - this.dataCriacao) / 1000);

  return `[${status}] ${this.titulo} (${this.prioridade}) - ${tempoAberta}s`;
};

// Uso
const tarefa1 = new Tarefa('Estudar JavaScript', 'alta');
const tarefa2 = new Tarefa('Fazer exercícios');
const tarefa3 = new Tarefa('Revisar código', 'urgente');

// Métodos são compartilhados
console.log(tarefa1.concluir === tarefa2.concluir); // true

// Chamar métodos
tarefa1.concluir();
tarefa2.alterarPrioridade('alta');

console.log(tarefa1.obterResumo()); // [✓] Estudar JavaScript (alta) - 0s
console.log(tarefa2.obterResumo()); // [○] Fazer exercícios (alta) - 0s
console.log(tarefa3.obterResumo()); // [○] Revisar código (urgente) - 0s
```

## ⚠️ Armadilhas Comuns

### 1. Adicionar Propriedades (Não Métodos) ao Prototype

```javascript
function Pessoa(nome) {
  this.nome = nome;
}

// ❌ Propriedade no prototype (compartilhada!)
Pessoa.prototype.amigos = [];

const p1 = new Pessoa('Ana');
const p2 = new Pessoa('Bruno');

p1.amigos.push('Carlos');

// Ambos compartilham o mesmo array!
console.log(p2.amigos); // ['Carlos'] (PROBLEMA!)

// ✅ Propriedades devem ser de instância
function PessoaCorreta(nome) {
  this.nome = nome;
  this.amigos = []; // Cada instância tem seu próprio array
}
```

### 2. Perder Referência ao Constructor

```javascript
function Animal() {}

// ❌ Sobrescrever sem restaurar constructor
Animal.prototype = {
  falar: function() {}
};

const animal = new Animal();
console.log(animal.constructor === Animal); // false! (perdeu)

// ✅ Restaurar constructor
Animal.prototype = {
  constructor: Animal, // Restaurar!
  falar: function() {}
};
```

## 🔗 Interconexões

- **Function Constructors:** prototype property é usado por constructors
- **new operator:** Liga `__proto__` da instância ao prototype
- **Prototype Chain:** prototype property é onde a chain aponta
- **Herança:** Base para herança via prototypes
- **Métodos Compartilhados:** Adicionados ao prototype

## 🚀 Conclusão

A **prototype property** é o mecanismo central de compartilhamento de comportamento em JavaScript ES5:

- Permite adicionar métodos compartilhados por todas instâncias
- Economiza memória (um método para todas instâncias)
- É a base da herança prototípica
- Diferente de `__proto__` (prototype da função vs link da instância)

Dominar prototype property é essencial para entender OOP em JavaScript e como classes ES6 funcionam internamente (classes são syntax sugar sobre prototypes!).
