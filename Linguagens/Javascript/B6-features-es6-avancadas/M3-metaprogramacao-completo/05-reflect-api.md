# Reflect API: Análise Conceitual

## 🎯 Definição

**Reflect** é um objeto built-in que fornece métodos para operações interceptáveis de JavaScript. Cada método Reflect corresponde a um trap de Proxy, oferecendo uma API funcional consistente para meta-programação que substitui operadores e métodos dispersos.

```javascript
// Operações tradicionais
obj.prop;
obj.prop = valor;
delete obj.prop;
'prop' in obj;

// Equivalente com Reflect
Reflect.get(obj, 'prop');
Reflect.set(obj, 'prop', valor);
Reflect.deleteProperty(obj, 'prop');
Reflect.has(obj, 'prop');
```

**Conceito:** API unificada e funcional para operações fundamentais de objetos.

## 📋 Métodos Reflect

Reflect tem **13 métodos** que correspondem aos 13 traps de Proxy:

1. **Reflect.get(target, prop, receiver)**
2. **Reflect.set(target, prop, value, receiver)**
3. **Reflect.has(target, prop)**
4. **Reflect.deleteProperty(target, prop)**
5. **Reflect.ownKeys(target)**
6. **Reflect.getOwnPropertyDescriptor(target, prop)**
7. **Reflect.defineProperty(target, prop, descriptor)**
8. **Reflect.getPrototypeOf(target)**
9. **Reflect.setPrototypeOf(target, prototype)**
10. **Reflect.preventExtensions(target)**
11. **Reflect.isExtensible(target)**
12. **Reflect.apply(target, thisArg, args)**
13. **Reflect.construct(target, args, newTarget)**

## 🧠 Por Que Reflect?

### 1. Retornos Consistentes (Boolean)

```javascript
// Object.defineProperty lança erro em falha
try {
  Object.defineProperty(obj, 'prop', descriptor);
} catch (e) {
  console.log('Falhou');
}

// Reflect.defineProperty retorna boolean
if (!Reflect.defineProperty(obj, 'prop', descriptor)) {
  console.log('Falhou');
}
```

### 2. Primeira Classe (First-Class Functions)

```javascript
// Operador 'delete' não é função
const apagar = delete obj.prop; // SyntaxError em alguns contextos

// Reflect.deleteProperty é função
const apagar = Reflect.deleteProperty;
[obj1, obj2].forEach(o => apagar(o, 'prop'));
```

### 3. Parâmetros Receiver

```javascript
const obj = {
  _valor: 10,
  get valor() {
    return this._valor;
  }
};

const proxy = new Proxy(obj, {
  get(target, prop, receiver) {
    // receiver permite que getters vejam o proxy, não target
    return Reflect.get(target, prop, receiver);
  }
});
```

### 4. API Simétrica com Proxy

```javascript
const handler = {
  get(target, prop, receiver) {
    console.log('GET');
    // Delegar para comportamento padrão
    return Reflect.get(target, prop, receiver);
  }
};
```

## 🔍 Métodos Principais

### Reflect.get / Reflect.set

```javascript
const obj = { x: 10, y: 20 };

// Leitura
console.log(Reflect.get(obj, 'x')); // 10

// Escrita
Reflect.set(obj, 'z', 30);
console.log(obj.z); // 30

// Com receiver (importante para getters/setters)
const alvo = {
  _valor: 100,
  get valor() {
    return this._valor;
  }
};

const herdeiro = Object.create(alvo);
console.log(Reflect.get(alvo, 'valor', herdeiro)); // this = herdeiro
```

### Reflect.has

```javascript
const obj = { a: 1, b: 2 };

console.log(Reflect.has(obj, 'a')); // true
console.log(Reflect.has(obj, 'c')); // false

// Equivalente a operador 'in'
console.log('a' in obj); // true
```

### Reflect.deleteProperty

```javascript
const obj = { x: 1, y: 2 };

console.log(Reflect.deleteProperty(obj, 'x')); // true
console.log(obj); // { y: 2 }

// Retorna false se falhar (non-configurable)
Object.defineProperty(obj, 'z', {
  value: 3,
  configurable: false
});

console.log(Reflect.deleteProperty(obj, 'z')); // false (não deletou)
```

### Reflect.ownKeys

```javascript
const obj = { a: 1, b: 2 };
const sym = Symbol('teste');
obj[sym] = 3;

console.log(Reflect.ownKeys(obj));
// ['a', 'b', Symbol(teste)]

// Mais completo que Object.keys (inclui symbols)
console.log(Object.keys(obj)); // ['a', 'b']
```

### Reflect.apply

```javascript
function somar(a, b) {
  return a + b;
}

// Equivalente a Function.prototype.apply
console.log(Reflect.apply(somar, null, [5, 3])); // 8

// Mais seguro que .apply (sempre funciona)
console.log(Reflect.apply(Math.max, null, [1, 2, 3])); // 3
```

### Reflect.construct

```javascript
class Pessoa {
  constructor(nome) {
    this.nome = nome;
  }
}

// Equivalente a 'new'
const pessoa = Reflect.construct(Pessoa, ['João']);
console.log(pessoa.nome); // 'João'

// Permite especificar prototype diferente
class PessoaEspecial extends Pessoa {}

const pessoa2 = Reflect.construct(
  Pessoa,
  ['Maria'],
  PessoaEspecial // newTarget
);

console.log(pessoa2 instanceof PessoaEspecial); // true
```

## ⚠️ Reflect vs Object

| Operação | Object | Reflect |
|----------|--------|---------|
| Retorno em erro | Lança exceção | Retorna false |
| Tipo | Objeto com métodos utilitários | API de reflexão |
| Foco | Manipulação de objetos | Meta-programação |

```javascript
const obj = {};
Object.preventExtensions(obj);

// Object.defineProperty lança erro
try {
  Object.defineProperty(obj, 'x', { value: 1 });
} catch (e) {
  console.log('Erro com Object');
}

// Reflect.defineProperty retorna false
if (!Reflect.defineProperty(obj, 'x', { value: 1 })) {
  console.log('Falhou com Reflect');
}
```

## 🚀 Uso com Proxy

Reflect é perfeito para **delegar** comportamento padrão em traps:

```javascript
const handler = {
  get(target, prop, receiver) {
    console.log(`GET ${String(prop)}`);
    return Reflect.get(target, prop, receiver);
  },

  set(target, prop, value, receiver) {
    console.log(`SET ${String(prop)} = ${value}`);
    return Reflect.set(target, prop, value, receiver);
  }
};

const proxy = new Proxy({ x: 1 }, handler);

proxy.x;     // 'GET x'
proxy.x = 2; // 'SET x = 2'
```

Reflect fornece uma API moderna, consistente e funcional para meta-programação, sendo o complemento perfeito para Proxy e substituindo operações imperativas por chamadas funcionais explícitas.
