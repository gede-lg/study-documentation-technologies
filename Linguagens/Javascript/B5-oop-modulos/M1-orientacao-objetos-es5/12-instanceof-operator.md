# instanceof Operator: Análise Conceitual

## 🎯 Definição

O operador **instanceof** testa se um objeto tem o prototype de um constructor em sua prototype chain. Retorna `true` se o objeto foi criado por aquele constructor (ou herda dele), `false` caso contrário.

```javascript
function Pessoa(nome) {
  this.nome = nome;
}

const pessoa = new Pessoa('João');

console.log(pessoa instanceof Pessoa); // true
console.log(pessoa instanceof Object); // true (todo objeto herda de Object)
console.log(pessoa instanceof Array); // false
```

**Sintaxe:** `objeto instanceof Constructor`

## 📋 Como Funciona

### Verificação da Prototype Chain

```javascript
// instanceof verifica se Constructor.prototype está na chain do objeto

objeto instanceof Constructor
// Equivalente a:
Constructor.prototype.isPrototypeOf(objeto)
```

### Exemplo Passo a Passo

```javascript
function Animal() {}
function Cachorro() {}

Cachorro.prototype = Object.create(Animal.prototype);

const rex = new Cachorro();

// Verificar chain:
console.log(rex instanceof Cachorro); // true
// rex.__proto__ === Cachorro.prototype

console.log(rex instanceof Animal); // true
// Cachorro.prototype.__proto__ === Animal.prototype

console.log(rex instanceof Object); // true
// Animal.prototype.__proto__ === Object.prototype

console.log(rex instanceof Array); // false
// Array.prototype não está na chain
```

## 🧠 Casos de Uso

### 1. Type Checking

```javascript
function processar(valor) {
  if (valor instanceof Array) {
    console.log('É um array com', valor.length, 'elementos');
  } else if (valor instanceof Date) {
    console.log('É uma data:', valor.toLocaleDateString());
  } else if (valor instanceof Function) {
    console.log('É uma função');
  } else {
    console.log('Tipo desconhecido');
  }
}

processar([1, 2, 3]); // 'É um array com 3 elementos'
processar(new Date()); // 'É uma data: ...'
processar(function() {}); // 'É uma função'
```

### 2. Validação de Parâmetros

```javascript
function Usuario(nome) {
  this.nome = nome;
}

function processarUsuario(obj) {
  if (!(obj instanceof Usuario)) {
    throw new TypeError('Parâmetro deve ser instância de Usuario');
  }

  console.log(`Processando usuário: ${obj.nome}`);
}

const user = new Usuario('Ana');
processarUsuario(user); // OK

processarUsuario({ nome: 'João' }); // TypeError!
```

### 3. Herança

```javascript
function Forma() {}
function Retangulo() {}
function Circulo() {}

Retangulo.prototype = Object.create(Forma.prototype);
Circulo.prototype = Object.create(Forma.prototype);

const ret = new Retangulo();
const circ = new Circulo();

// Ambos são Formas
console.log(ret instanceof Forma); // true
console.log(circ instanceof Forma); // true

// Mas tipos específicos diferentes
console.log(ret instanceof Retangulo); // true
console.log(ret instanceof Circulo); // false
```

## 🔍 Análise Profunda

### Tipos Primitivos

```javascript
// ⚠️ instanceof não funciona com primitivos
console.log(42 instanceof Number); // false
console.log('texto' instanceof String); // false
console.log(true instanceof Boolean); // false

// Mas funciona com wrapper objects
console.log(new Number(42) instanceof Number); // true
console.log(new String('texto') instanceof String); // true
console.log(new Boolean(true) instanceof Boolean); // true
```

### Múltiplos Frames/Windows

```javascript
// ⚠️ Problema em ambientes com múltiplos contextos globais
// Array de um iframe !== Array do window principal

// Melhor usar Array.isArray() para arrays
const arr = [1, 2, 3];
console.log(Array.isArray(arr)); // true (sempre funciona)
console.log(arr instanceof Array); // true (pode falhar entre frames)
```

### Modificação Dinâmica de Prototype

```javascript
function Teste() {}

const obj = new Teste();

console.log(obj instanceof Teste); // true

// Modificar prototype
const novoPrototype = {};
Teste.prototype = novoPrototype;

console.log(obj instanceof Teste); // false! (prototype mudou)

// obj ainda aponta para prototype antigo
console.log(Teste.prototype.isPrototypeOf(obj)); // false
```

## ⚠️ Limitações

### 1. Objetos sem Prototype

```javascript
const obj = Object.create(null);

console.log(obj instanceof Object); // false (não tem prototype)
```

### 2. Symbol.hasInstance (ES6)

```javascript
// Em ES6, instanceof pode ser customizado
class MinhaClasse {
  static [Symbol.hasInstance](obj) {
    // Lógica customizada
    return obj.tipo === 'MinhaClasse';
  }
}

const obj = { tipo: 'MinhaClasse' };
console.log(obj instanceof MinhaClasse); // true (customizado!)
```

### 3. Alternativas Mais Seguras

```javascript
// typeof para primitivos
typeof 42 === 'number' // true
typeof 'texto' === 'string' // true

// Array.isArray para arrays
Array.isArray([1, 2, 3]) // true

// Object.prototype.toString para tipo exato
Object.prototype.toString.call([]) // '[object Array]'
Object.prototype.toString.call({}) // '[object Object]'
Object.prototype.toString.call(new Date()) // '[object Date]'
```

## 🔍 Exemplo Completo: Sistema de Permissões

```javascript
function Usuario(nome) {
  this.nome = nome;
}

function Admin(nome, nivel) {
  Usuario.call(this, nome);
  this.nivel = nivel;
}

Admin.prototype = Object.create(Usuario.prototype);
Admin.prototype.constructor = Admin;

function Moderador(nome) {
  Usuario.call(this, nome);
}

Moderador.prototype = Object.create(Usuario.prototype);
Moderador.prototype.constructor = Moderador;

// Função que verifica permissões
function podeDeletar(usuario) {
  if (usuario instanceof Admin) {
    return usuario.nivel >= 3;
  } else if (usuario instanceof Moderador) {
    return true;
  } else if (usuario instanceof Usuario) {
    return false;
  } else {
    throw new TypeError('Tipo de usuário inválido');
  }
}

// Uso
const admin = new Admin('Ana', 5);
const mod = new Moderador('Carlos');
const user = new Usuario('João');

console.log(podeDeletar(admin)); // true (admin nível 5)
console.log(podeDeletar(mod)); // true (moderador)
console.log(podeDeletar(user)); // false (usuário comum)

// Verificar hierarquia
console.log(admin instanceof Admin); // true
console.log(admin instanceof Usuario); // true (herda)
console.log(admin instanceof Object); // true (todos herdam)
```

## 🔗 Comparação com Alternativas

```javascript
const arr = [1, 2, 3];
const date = new Date();
const obj = {};

// instanceof
console.log(arr instanceof Array); // true
console.log(date instanceof Date); // true

// constructor
console.log(arr.constructor === Array); // true
console.log(date.constructor === Date); // true

// Array.isArray (preferido para arrays)
console.log(Array.isArray(arr)); // true

// Object.prototype.toString (mais robusto)
console.log(Object.prototype.toString.call(arr)); // '[object Array]'
console.log(Object.prototype.toString.call(date)); // '[object Date]'
```

**instanceof** é útil para verificar herança em hierarquias de classes, mas tem limitações com primitivos e múltiplos contextos globais. Para type checking robusto, considere alternativas como `typeof`, `Array.isArray()`, ou `Object.prototype.toString.call()`.
