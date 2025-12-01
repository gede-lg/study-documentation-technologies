# Proxy Object: Análise Conceitual

## 🎯 Definição

**Proxy** é um objeto JavaScript que envolve outro objeto (target) e **intercepta operações** realizadas nele, permitindo customizar comportamentos fundamentais como leitura de propriedades, atribuição, enumeração, invocação de funções e muito mais. É meta-programação que permite redefinir a semântica de operações básicas.

```javascript
const alvo = { nome: 'João', idade: 30 };

const proxy = new Proxy(alvo, {
  get(target, propriedade) {
    console.log(`Lendo: ${propriedade}`);
    return target[propriedade];
  },

  set(target, propriedade, valor) {
    console.log(`Escrevendo: ${propriedade} = ${valor}`);
    target[propriedade] = valor;
    return true;
  }
});

console.log(proxy.nome);  // 'Lendo: nome' | 'João'
proxy.idade = 31;          // 'Escrevendo: idade = 31'
```

**Conceito:** Wrapper transparente que intercepta operações em objetos através de "traps" (armadilhas).

## 📋 Sintaxe

```javascript
const proxy = new Proxy(target, handler);
```

- **target:** Objeto original a ser envolvido
- **handler:** Objeto com traps (métodos interceptadores)

### Exemplo Básico

```javascript
const usuario = {
  nome: 'Maria',
  email: 'maria@email.com'
};

const handler = {
  get(target, prop) {
    return `[PROXY] ${target[prop]}`;
  }
};

const proxy = new Proxy(usuario, handler);

console.log(proxy.nome);  // '[PROXY] Maria'
console.log(proxy.email); // '[PROXY] maria@email.com'

// Alvo original não muda
console.log(usuario.nome); // 'Maria'
```

## 🧠 Fundamentos Teóricos

### Transparência (Transparent Wrapping)

Proxy envolve objeto sem alterar sua identidade ou estrutura.

```javascript
const obj = { a: 1 };
const proxy = new Proxy(obj, {});

// Proxy é transparente (sem traps, comportamento idêntico)
console.log(proxy.a); // 1
proxy.b = 2;
console.log(obj.b);   // 2 (mudança refletida no target)
```

### Target e Proxy São Independentes

```javascript
const target = { valor: 10 };
const proxy = new Proxy(target, {});

console.log(proxy === target); // false (objetos diferentes)

// Mas compartilham dados
proxy.valor = 20;
console.log(target.valor); // 20
```

### Handler Vazio = Proxy Transparente

```javascript
const obj = { x: 1 };
const proxy = new Proxy(obj, {}); // Handler vazio

// Comportamento idêntico ao objeto original
proxy.x = 2;
console.log(proxy.x); // 2
```

### Revogabilidade

```javascript
const { proxy, revoke } = Proxy.revocable(target, handler);

console.log(proxy.prop); // OK

revoke(); // Revoga proxy

console.log(proxy.prop); // TypeError: Cannot perform 'get' on a proxy that has been revoked
```

## 🔍 Casos de Uso Práticos

### Validação de Propriedades

```javascript
function criarUsuarioValidado() {
  return new Proxy({}, {
    set(target, prop, valor) {
      if (prop === 'idade' && typeof valor !== 'number') {
        throw new TypeError('Idade deve ser número');
      }

      if (prop === 'idade' && valor < 0) {
        throw new RangeError('Idade deve ser positiva');
      }

      if (prop === 'email' && !valor.includes('@')) {
        throw new Error('Email inválido');
      }

      target[prop] = valor;
      return true;
    }
  });
}

const usuario = criarUsuarioValidado();

usuario.nome = 'João';        // OK
usuario.idade = 30;           // OK
usuario.email = 'joao@x.com'; // OK

// usuario.idade = 'trinta';  // TypeError
// usuario.idade = -5;        // RangeError
// usuario.email = 'invalido'; // Error
```

### Valores Padrão

```javascript
function comPadroes(obj, padroes) {
  return new Proxy(obj, {
    get(target, prop) {
      return prop in target ? target[prop] : padroes[prop];
    }
  });
}

const config = comPadroes(
  { porta: 8080 },
  { porta: 3000, host: 'localhost', debug: false }
);

console.log(config.porta);  // 8080 (do objeto)
console.log(config.host);   // 'localhost' (padrão)
console.log(config.debug);  // false (padrão)
```

### Logging/Debugging

```javascript
function criarComLog(obj, nome) {
  return new Proxy(obj, {
    get(target, prop) {
      console.log(`[${nome}] GET ${String(prop)}`);
      return target[prop];
    },

    set(target, prop, valor) {
      console.log(`[${nome}] SET ${String(prop)} = ${valor}`);
      target[prop] = valor;
      return true;
    }
  });
}

const dados = criarComLog({ x: 10 }, 'Dados');

dados.x;     // '[Dados] GET x'
dados.x = 20; // '[Dados] SET x = 20'
```

### Read-Only Object

```javascript
function readOnly(obj) {
  return new Proxy(obj, {
    set() {
      throw new Error('Objeto é somente leitura');
    },

    deleteProperty() {
      throw new Error('Não pode deletar propriedades');
    }
  });
}

const constante = readOnly({ valor: 42 });

console.log(constante.valor); // 42
// constante.valor = 100;     // Error: somente leitura
// delete constante.valor;    // Error: não pode deletar
```

### Propriedades Privadas

```javascript
function criarComPrivados() {
  const privados = new WeakMap();

  return new Proxy({}, {
    get(target, prop) {
      if (prop.startsWith('_')) {
        return privados.get(target)?.[prop];
      }
      return target[prop];
    },

    set(target, prop, valor) {
      if (prop.startsWith('_')) {
        if (!privados.has(target)) {
          privados.set(target, {});
        }
        privados.get(target)[prop] = valor;
      } else {
        target[prop] = valor;
      }
      return true;
    }
  });
}

const obj = criarComPrivados();

obj.publico = 'visível';
obj._privado = 'oculto';

console.log(obj.publico);  // 'visível'
console.log(obj._privado); // 'oculto'
console.log(obj);          // {} (privado não aparece)
```

### Negative Array Indices

```javascript
function arrayComIndicesNegativos(arr) {
  return new Proxy(arr, {
    get(target, prop) {
      const indice = Number(prop);

      if (indice < 0) {
        return target[target.length + indice];
      }

      return target[prop];
    }
  });
}

const array = arrayComIndicesNegativos([1, 2, 3, 4, 5]);

console.log(array[-1]); // 5 (último)
console.log(array[-2]); // 4 (penúltimo)
console.log(array[0]);  // 1 (normal)
```

## ⚠️ Considerações

### Performance

```javascript
// Proxy adiciona overhead
const obj = { x: 1 };
const proxy = new Proxy(obj, {
  get(target, prop) {
    return target[prop];
  }
});

// proxy.x é mais lento que obj.x
// Use apenas quando necessário
```

### this Binding

```javascript
const target = {
  nome: 'João',
  cumprimentar() {
    return `Olá, ${this.nome}`;
  }
};

const proxy = new Proxy(target, {});

console.log(proxy.cumprimentar()); // 'Olá, João'
// 'this' dentro do método aponta para proxy, não target
```

### Não Intercepta Operações Internas

```javascript
const alvo = {
  _interno: 10,
  get valor() {
    return this._interno; // Acesso direto, não passa por trap
  }
};

const proxy = new Proxy(alvo, {
  get(target, prop) {
    console.log('GET:', prop);
    return target[prop];
  }
});

proxy.valor;
// 'GET: valor' (getter é interceptado)
// Mas '_interno' não é interceptado internamente
```

### Invariants (Invariantes)

Proxy respeita invariantes de objetos:

```javascript
const obj = {};
Object.defineProperty(obj, 'constante', {
  value: 42,
  writable: false,
  configurable: false
});

const proxy = new Proxy(obj, {
  get() {
    return 100; // Tenta retornar valor diferente
  }
});

// proxy.constante; // TypeError
// Não pode retornar valor diferente de propriedade non-writable/non-configurable
```

## 🚀 Relação com Outros Conceitos

Proxy é a base para:
- **Observabilidade:** Vue 3, MobX usam Proxy para reatividade
- **Validação:** Schemas de validação automática
- **ORM/ODM:** Mapeamento objeto-relacional transparente
- **API Mocking:** Interceptar chamadas para testes
- **Lazy Loading:** Carregar dados sob demanda

Proxy representa meta-programação de alto nível em JavaScript, permitindo redefinir comportamentos fundamentais de objetos de forma transparente e poderosa.
