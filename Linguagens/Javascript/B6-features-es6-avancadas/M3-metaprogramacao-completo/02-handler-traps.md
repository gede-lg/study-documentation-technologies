# Handler Methods (Traps): Análise Conceitual

## 🎯 Definição

**Traps** (armadilhas) são métodos definidos no handler de um Proxy que interceptam operações específicas no objeto target. Cada trap corresponde a uma operação fundamental de objetos JavaScript, como acessar propriedades, atribuir valores, deletar, enumerar, etc.

```javascript
const handler = {
  // Trap para leitura de propriedade
  get(target, prop, receiver) { },

  // Trap para atribuição
  set(target, prop, valor, receiver) { },

  // Trap para 'in' operator
  has(target, prop) { },

  // ... outros traps
};

const proxy = new Proxy(target, handler);
```

**Conceito:** Métodos interceptadores que customizam comportamentos fundamentais de objetos.

## 📋 Lista Completa de Traps

### Traps de Propriedade

**get(target, property, receiver)**
- Intercepta: `proxy.prop`, `proxy['prop']`
- Retorno: Qualquer valor
- Uso: Leitura de propriedades

**set(target, property, value, receiver)**
- Intercepta: `proxy.prop = value`
- Retorno: Boolean (true = sucesso)
- Uso: Atribuição de propriedades

**has(target, property)**
- Intercepta: `prop in proxy`
- Retorno: Boolean
- Uso: Verificar existência de propriedade

**deleteProperty(target, property)**
- Intercepta: `delete proxy.prop`
- Retorno: Boolean (true = sucesso)
- Uso: Deletar propriedades

**ownKeys(target)**
- Intercepta: `Object.keys()`, `Object.getOwnPropertyNames()`, `for...in`
- Retorno: Array de strings/symbols
- Uso: Enumeração de chaves

**getOwnPropertyDescriptor(target, property)**
- Intercepta: `Object.getOwnPropertyDescriptor()`
- Retorno: Property descriptor ou undefined
- Uso: Obter descritor de propriedade

**defineProperty(target, property, descriptor)**
- Intercepta: `Object.defineProperty()`
- Retorno: Boolean
- Uso: Definir/modificar propriedade

### Traps de Prototype

**getPrototypeOf(target)**
- Intercepta: `Object.getPrototypeOf()`, `__proto__`, `instanceof`
- Retorno: Objeto ou null
- Uso: Obter prototype

**setPrototypeOf(target, prototype)**
- Intercepta: `Object.setPrototypeOf()`, `__proto__` assignment
- Retorno: Boolean
- Uso: Definir prototype

### Traps de Função

**apply(target, thisArg, argumentsList)**
- Intercepta: Chamada de função `proxy()`
- Retorno: Qualquer valor
- Uso: Interceptar invocação

**construct(target, argumentsList, newTarget)**
- Intercepta: `new proxy()`
- Retorno: Objeto
- Uso: Interceptar construção

### Traps de Objeto

**preventExtensions(target)**
- Intercepta: `Object.preventExtensions()`
- Retorno: Boolean
- Uso: Prevenir extensões

**isExtensible(target)**
- Intercepta: `Object.isExtensible()`
- Retorno: Boolean
- Uso: Verificar extensibilidade

## 🔍 Exemplos Práticos de Traps

### Trap: ownKeys

```javascript
const usuario = {
  nome: 'João',
  _senha: '12345',
  email: 'joao@email.com',
  _token: 'abc123'
};

const proxy = new Proxy(usuario, {
  ownKeys(target) {
    // Ocultar propriedades privadas
    return Object.keys(target).filter(key => !key.startsWith('_'));
  }
});

console.log(Object.keys(proxy)); // ['nome', 'email']
// _senha e _token ocultos
```

### Trap: getOwnPropertyDescriptor

```javascript
const obj = { x: 1, y: 2 };

const proxy = new Proxy(obj, {
  getOwnPropertyDescriptor(target, prop) {
    console.log(`Obtendo descritor de: ${prop}`);

    const descriptor = Object.getOwnPropertyDescriptor(target, prop);

    // Tornar todas propriedades não-enumeráveis para Object.keys
    if (descriptor) {
      descriptor.enumerable = false;
    }

    return descriptor;
  }
});

console.log(Object.keys(proxy)); // []
```

### Trap: deleteProperty

```javascript
const protegido = {
  nome: 'João',
  id: 123,
  tipo: 'admin'
};

const proxy = new Proxy(protegido, {
  deleteProperty(target, prop) {
    if (prop === 'id' || prop === 'tipo') {
      throw new Error(`Não pode deletar propriedade protegida: ${prop}`);
    }

    delete target[prop];
    return true;
  }
});

delete proxy.nome; // OK
// delete proxy.id; // Error: protegida
```

### Trap: getPrototypeOf

```javascript
const obj = {};

const proxy = new Proxy(obj, {
  getPrototypeOf(target) {
    console.log('Obtendo prototype...');
    return Array.prototype; // Mentir sobre prototype
  }
});

console.log(Object.getPrototypeOf(proxy) === Array.prototype); // true
console.log(proxy instanceof Array); // true (!)
```

### Trap: preventExtensions

```javascript
const obj = { x: 1 };

const proxy = new Proxy(obj, {
  preventExtensions(target) {
    console.log('Tentando prevenir extensões...');
    // Permitir apenas se já tiver sido feito no target
    Object.preventExtensions(target);
    return true;
  }
});

Object.preventExtensions(proxy); // 'Tentando prevenir extensões...'
// proxy.y = 2; // Falha (não extensível)
```

## ⚠️ Restrições e Invariantes

### Trap get: Invariantes

```javascript
const obj = {};
Object.defineProperty(obj, 'constante', {
  value: 42,
  writable: false,
  configurable: false
});

const proxy = new Proxy(obj, {
  get(target, prop) {
    if (prop === 'constante') {
      return 100; // Tentar retornar valor diferente
    }
    return target[prop];
  }
});

// proxy.constante; // TypeError
// Não pode retornar valor diferente de non-writable/non-configurable
```

### Trap set: Deve Retornar Boolean

```javascript
const proxy = new Proxy({}, {
  set(target, prop, valor) {
    target[prop] = valor;
    // ⚠️ Esquecer de retornar true
  }
});

// 'use strict';
// proxy.x = 1; // TypeError em strict mode
```

### Trap has: Propriedades Non-Configurable

```javascript
const obj = {};
Object.defineProperty(obj, 'prop', {
  value: 1,
  configurable: false
});

const proxy = new Proxy(obj, {
  has(target, prop) {
    if (prop === 'prop') {
      return false; // Tentar ocultar
    }
    return prop in target;
  }
});

// 'prop' in proxy; // TypeError
// Não pode ocultar propriedade non-configurable
```

## 🚀 Padrões Avançados

### Trap Cascading

```javascript
const handler = {
  get(target, prop, receiver) {
    console.log(`GET: ${String(prop)}`);

    const valor = Reflect.get(target, prop, receiver);

    // Se valor é objeto, retornar proxy também
    if (typeof valor === 'object' && valor !== null) {
      return new Proxy(valor, handler); // Recursivo
    }

    return valor;
  }
};

const dados = { usuario: { nome: 'João', endereco: { cidade: 'SP' } } };
const proxy = new Proxy(dados, handler);

proxy.usuario.endereco.cidade;
// GET: usuario
// GET: endereco
// GET: cidade
```

### Trap Composition

```javascript
function combinarHandlers(...handlers) {
  return handlers.reduce((acc, handler) => {
    Object.keys(handler).forEach(trap => {
      const anterior = acc[trap];
      acc[trap] = function(...args) {
        // Executar trap anterior se existir
        if (anterior) {
          anterior.apply(this, args);
        }
        // Executar trap atual
        return handler[trap].apply(this, args);
      };
    });
    return acc;
  }, {});
}

const loggingHandler = {
  get(target, prop) {
    console.log(`GET: ${String(prop)}`);
    return target[prop];
  }
};

const validationHandler = {
  set(target, prop, valor) {
    if (prop === 'idade' && typeof valor !== 'number') {
      throw new TypeError('Idade deve ser número');
    }
    target[prop] = valor;
    return true;
  }
};

const combinado = combinarHandlers(loggingHandler, validationHandler);
const proxy = new Proxy({}, combinado);
```

Traps são o coração do sistema Proxy, fornecendo 13 pontos de interceptação que cobrem todas operações fundamentais de objetos JavaScript, permitindo meta-programação extremamente poderosa e flexível.
