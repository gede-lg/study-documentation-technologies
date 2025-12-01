# Polyfills Básicos: Análise Conceitual

## 🎯 Definição

**Polyfill** é código JavaScript que implementa funcionalidades modernas em navegadores/ambientes antigos que não as suportam nativamente. É uma forma de "preencher lacunas" (poly-fill) na compatibilidade entre versões de JavaScript.

```javascript
// Polyfill para Array.prototype.includes (ES2016)
if (!Array.prototype.includes) {
  Array.prototype.includes = function(elemento) {
    return this.indexOf(elemento) !== -1;
  };
}

// Agora funciona mesmo em navegadores antigos
[1, 2, 3].includes(2); // true
```

**Conceito:** Adicionar recursos modernos a ambientes antigos mantendo compatibilidade.

## 📋 Estrutura de um Polyfill

### Pattern Básico

```javascript
// 1. Verificar se funcionalidade existe
if (!Object.metodoModerno) {
  // 2. Se não existe, implementar
  Object.metodoModerno = function() {
    // 3. Implementação compatível
  };
}
```

## 🧠 Polyfills Comuns

### Array.prototype.forEach

```javascript
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(callback, thisArg) {
    if (this == null) {
      throw new TypeError('this é null ou undefined');
    }

    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' não é uma função');
    }

    const array = Object(this);
    const len = array.length >>> 0;

    for (let i = 0; i < len; i++) {
      if (i in array) {
        callback.call(thisArg, array[i], i, array);
      }
    }
  };
}

// Uso
[1, 2, 3].forEach(function(n) {
  console.log(n);
});
```

### Array.prototype.map

```javascript
if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {
    if (this == null) {
      throw new TypeError('this é null ou undefined');
    }

    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' não é uma função');
    }

    const array = Object(this);
    const len = array.length >>> 0;
    const resultado = new Array(len);

    for (let i = 0; i < len; i++) {
      if (i in array) {
        resultado[i] = callback.call(thisArg, array[i], i, array);
      }
    }

    return resultado;
  };
}

// Uso
const dobrados = [1, 2, 3].map(function(n) {
  return n * 2;
});
```

### Array.prototype.filter

```javascript
if (!Array.prototype.filter) {
  Array.prototype.filter = function(callback, thisArg) {
    if (this == null) {
      throw new TypeError('this é null ou undefined');
    }

    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' não é uma função');
    }

    const array = Object(this);
    const len = array.length >>> 0;
    const resultado = [];

    for (let i = 0; i < len; i++) {
      if (i in array) {
        const elemento = array[i];
        if (callback.call(thisArg, elemento, i, array)) {
          resultado.push(elemento);
        }
      }
    }

    return resultado;
  };
}

// Uso
const pares = [1, 2, 3, 4].filter(function(n) {
  return n % 2 === 0;
});
```

### Array.isArray

```javascript
if (!Array.isArray) {
  Array.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };
}

// Uso
console.log(Array.isArray([1, 2, 3])); // true
console.log(Array.isArray('texto')); // false
```

### Object.create

```javascript
if (typeof Object.create !== 'function') {
  Object.create = function(proto, propertiesObject) {
    if (typeof proto !== 'object' && typeof proto !== 'function') {
      throw new TypeError('Prototype deve ser objeto ou null');
    }

    // Construtor temporário
    function F() {}
    F.prototype = proto;
    const obj = new F();

    // Adicionar propriedades se fornecidas
    if (propertiesObject !== undefined) {
      Object.defineProperties(obj, propertiesObject);
    }

    return obj;
  };
}

// Uso
const obj = Object.create({ propriedade: 'herdada' });
```

### Object.keys

```javascript
if (!Object.keys) {
  Object.keys = function(obj) {
    if (obj !== Object(obj)) {
      throw new TypeError('Argumento deve ser objeto');
    }

    const chaves = [];

    for (let prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        chaves.push(prop);
      }
    }

    return chaves;
  };
}

// Uso
const obj = { a: 1, b: 2, c: 3 };
console.log(Object.keys(obj)); // ['a', 'b', 'c']
```

### Function.prototype.bind

```javascript
if (!Function.prototype.bind) {
  Function.prototype.bind = function(contexto) {
    if (typeof this !== 'function') {
      throw new TypeError('Bind deve ser chamado em função');
    }

    const funcao = this;
    const argsIniciais = Array.prototype.slice.call(arguments, 1);

    return function() {
      const argsFinal = argsIniciais.concat(
        Array.prototype.slice.call(arguments)
      );

      return funcao.apply(contexto, argsFinal);
    };
  };
}

// Uso
const obj = { valor: 42 };

function mostrar(prefixo) {
  return prefixo + this.valor;
}

const funcaoBound = mostrar.bind(obj, 'Valor: ');
console.log(funcaoBound()); // 'Valor: 42'
```

### String.prototype.trim

```javascript
if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

// Uso
console.log('  texto  '.trim()); // 'texto'
```

## 🔍 Exemplo Completo: Biblioteca de Polyfills

```javascript
// Biblioteca de polyfills ES5
(function() {
  'use strict';

  // Array.prototype.forEach
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback, thisArg) {
      for (let i = 0; i < this.length; i++) {
        if (i in this) {
          callback.call(thisArg, this[i], i, this);
        }
      }
    };
  }

  // Array.prototype.map
  if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {
      const resultado = [];
      for (let i = 0; i < this.length; i++) {
        if (i in this) {
          resultado[i] = callback.call(thisArg, this[i], i, this);
        }
      }
      return resultado;
    };
  }

  // Array.prototype.filter
  if (!Array.prototype.filter) {
    Array.prototype.filter = function(callback, thisArg) {
      const resultado = [];
      for (let i = 0; i < this.length; i++) {
        if (i in this && callback.call(thisArg, this[i], i, this)) {
          resultado.push(this[i]);
        }
      }
      return resultado;
    };
  }

  // Array.isArray
  if (!Array.isArray) {
    Array.isArray = function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  // Object.keys
  if (!Object.keys) {
    Object.keys = function(obj) {
      const chaves = [];
      for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          chaves.push(prop);
        }
      }
      return chaves;
    };
  }

})();

// Agora todos esses métodos funcionam em navegadores antigos
```

## ⚠️ Considerações

### Quando Usar Polyfills

- ✅ Suportar navegadores/ambientes antigos
- ✅ Usar recursos modernos em código legado
- ✅ Garantir compatibilidade cross-browser

### Cuidados

- ❌ **Não sobrescrever** se já existe (sempre verificar)
- ❌ **Testar bem** - implementação deve ser equivalente ao nativo
- ❌ **Performance** - polyfills podem ser mais lentos
- ❌ **Não modificar** prototypes nativos sem necessidade

### Bibliotecas de Polyfills

Ao invés de escrever manualmente, considere:

- **core-js:** Polyfills completos de ES5/ES6+
- **es5-shim:** Polyfills ES5 para navegadores antigos
- **babel-polyfill:** Polyfills automáticos via Babel

```html
<!-- Incluir core-js -->
<script src="https://cdn.jsdelivr.net/npm/core-js-bundle/minified.js"></script>
```

### Detecção de Features

```javascript
// Verificar suporte antes de aplicar polyfill
function suporta(feature) {
  const testes = {
    'forEach': Array.prototype.forEach,
    'map': Array.prototype.map,
    'bind': Function.prototype.bind,
    'keys': Object.keys,
    'create': Object.create
  };

  return !!testes[feature];
}

if (!suporta('forEach')) {
  console.log('Aplicando polyfill para forEach');
  // Aplicar polyfill
}
```

## 🔗 Transpilers vs Polyfills

**Transpilers (Babel):** Convertem sintaxe moderna para antiga
```javascript
// ES6 arrow function
const dobrar = (n) => n * 2;

// Transpilado para ES5
var dobrar = function(n) { return n * 2; };
```

**Polyfills:** Implementam APIs modernas
```javascript
// Array.prototype.includes precisa de polyfill
[1, 2, 3].includes(2);
```

**Use ambos** para suporte completo em navegadores antigos.

Polyfills são essenciais para manter compatibilidade com navegadores antigos enquanto usa recursos modernos de JavaScript. Compreendê-los ajuda a entender como métodos nativos funcionam internamente.
