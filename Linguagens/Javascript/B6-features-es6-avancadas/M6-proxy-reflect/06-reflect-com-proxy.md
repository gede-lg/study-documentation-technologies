# Reflect com Proxy: Análise Conceitual

## 🎯 Definição

A combinação **Reflect + Proxy** é o padrão idiomático para interceptação em JavaScript: Proxy intercepta operações através de traps, e Reflect fornece o comportamento padrão para delegar quando não há lógica customizada, mantendo a semântica correta.

```javascript
const handler = {
  get(target, prop, receiver) {
    // Lógica customizada
    console.log(`Lendo: ${String(prop)}`);

    // Delegar para comportamento padrão
    return Reflect.get(target, prop, receiver);
  }
};

const proxy = new Proxy({ x: 10 }, handler);
console.log(proxy.x); // 'Lendo: x' | 10
```

**Conceito:** Reflect como implementação padrão de traps em Proxy.

## 📋 Por Que Usar Reflect em Traps?

### 1. Preserva Semântica Correta

```javascript
const obj = {
  _valor: 10,
  get valor() {
    return this._valor; // 'this' é importante
  }
};

// ❌ ERRADO: this aponta para target, não proxy
const proxy1 = new Proxy(obj, {
  get(target, prop) {
    return target[prop]; // Getter vê target como 'this'
  }
});

// ✅ CORRETO: Reflect propaga receiver correto
const proxy2 = new Proxy(obj, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver); // Getter vê proxy como 'this'
  }
});
```

### 2. Retorno Boolean Consistente

```javascript
const handler = {
  set(target, prop, value, receiver) {
    console.log(`SET ${String(prop)}`);

    // Reflect retorna boolean indicando sucesso
    return Reflect.set(target, prop, value, receiver);
  }
};

// Se esquecer return ou retornar errado, pode causar erros em strict mode
```

### 3. Gerencia Invariantes Automaticamente

```javascript
const obj = {};
Object.defineProperty(obj, 'constante', {
  value: 42,
  writable: false,
  configurable: false
});

const proxy = new Proxy(obj, {
  get(target, prop, receiver) {
    // Reflect respeita invariantes automaticamente
    return Reflect.get(target, prop, receiver);
  }
});

console.log(proxy.constante); // 42 (correto)
```

## 🔍 Padrões Práticos

### Interceptação com Delegação

```javascript
const observavel = (obj, onChange) => {
  return new Proxy(obj, {
    set(target, prop, value, receiver) {
      const antigoValor = target[prop];

      // Delegar para comportamento padrão
      const sucesso = Reflect.set(target, prop, value, receiver);

      if (sucesso && antigoValor !== value) {
        onChange(prop, antigoValor, value);
      }

      return sucesso;
    }
  });
};

const dados = observavel({ x: 10 }, (prop, antigo, novo) => {
  console.log(`${prop}: ${antigo} → ${novo}`);
});

dados.x = 20; // 'x: 10 → 20'
```

### Validação + Delegação

```javascript
const validador = (obj, regras) => {
  return new Proxy(obj, {
    set(target, prop, value, receiver) {
      // Validação customizada
      if (prop in regras) {
        const validar = regras[prop];
        if (!validar(value)) {
          throw new Error(`Validação falhou para ${String(prop)}`);
        }
      }

      // Delegar se válido
      return Reflect.set(target, prop, value, receiver);
    }
  });
};

const usuario = validador({}, {
  idade: v => typeof v === 'number' && v >= 0,
  email: v => typeof v === 'string' && v.includes('@')
});

usuario.idade = 25;               // OK
usuario.email = 'joao@email.com'; // OK
// usuario.idade = -5;            // Error: validação falhou
```

### Logging Transparente

```javascript
function criarComLog(obj, nome = 'Objeto') {
  const handler = {
    get(target, prop, receiver) {
      console.log(`[${nome}] GET ${String(prop)}`);
      return Reflect.get(target, prop, receiver);
    },

    set(target, prop, value, receiver) {
      console.log(`[${nome}] SET ${String(prop)} = ${value}`);
      return Reflect.set(target, prop, value, receiver);
    },

    deleteProperty(target, prop) {
      console.log(`[${nome}] DELETE ${String(prop)}`);
      return Reflect.deleteProperty(target, prop);
    },

    has(target, prop) {
      console.log(`[${nome}] HAS ${String(prop)}`);
      return Reflect.has(target, prop);
    }
  };

  return new Proxy(obj, handler);
}

const dados = criarComLog({ x: 1, y: 2 }, 'Dados');

dados.x;           // '[Dados] GET x'
dados.z = 3;       // '[Dados] SET z = 3'
delete dados.y;    // '[Dados] DELETE y'
console.log('x' in dados); // '[Dados] HAS x'
```

### Deep Proxy (Recursivo)

```javascript
function criarDeepProxy(obj, handler) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      const valor = Reflect.get(target, prop, receiver);

      // Se valor é objeto, retornar proxy também
      if (typeof valor === 'object' && valor !== null) {
        return criarDeepProxy(valor, handler);
      }

      return valor;
    },

    set(target, prop, value, receiver) {
      console.log(`SET ${String(prop)} = ${value}`);
      return Reflect.set(target, prop, value, receiver);
    }
  });
}

const dados = criarDeepProxy({
  usuario: {
    nome: 'João',
    endereco: {
      cidade: 'SP'
    }
  }
}, {});

dados.usuario.endereco.cidade = 'RJ';
// 'SET cidade = RJ'
```

### Reatividade (Estilo Vue 3)

```javascript
const dependencias = new WeakMap();
let ativo = null;

function track(target, prop) {
  if (ativo) {
    if (!dependencias.has(target)) {
      dependencias.set(target, new Map());
    }
    const depsMap = dependencias.get(target);
    if (!depsMap.has(prop)) {
      depsMap.set(prop, new Set());
    }
    depsMap.get(prop).add(ativo);
  }
}

function trigger(target, prop) {
  const depsMap = dependencias.get(target);
  if (!depsMap) return;

  const efeitos = depsMap.get(prop);
  if (efeitos) {
    efeitos.forEach(efeito => efeito());
  }
}

function reativo(obj) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      track(target, prop);
      return Reflect.get(target, prop, receiver);
    },

    set(target, prop, value, receiver) {
      const resultado = Reflect.set(target, prop, value, receiver);
      trigger(target, prop);
      return resultado;
    }
  });
}

function watchEffect(fn) {
  ativo = fn;
  fn();
  ativo = null;
}

// Uso
const estado = reativo({ contador: 0 });

watchEffect(() => {
  console.log(`Contador: ${estado.contador}`);
});
// 'Contador: 0'

estado.contador++; // 'Contador: 1' (automático!)
estado.contador++; // 'Contador: 2' (automático!)
```

## ⚠️ Armadilhas Comuns

### Esquecer receiver

```javascript
// ❌ ERRADO: perde receiver
const proxy = new Proxy(obj, {
  get(target, prop) {
    return Reflect.get(target, prop); // Falta receiver!
  }
});

// ✅ CORRETO
const proxy = new Proxy(obj, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver);
  }
});
```

### Não Retornar Boolean em set

```javascript
// ❌ ERRADO: não retorna boolean
const proxy = new Proxy(obj, {
  set(target, prop, value, receiver) {
    Reflect.set(target, prop, value, receiver);
    // Falta return!
  }
});

// ✅ CORRETO
const proxy = new Proxy(obj, {
  set(target, prop, value, receiver) {
    return Reflect.set(target, prop, value, receiver);
  }
});
```

### Acessar target Diretamente

```javascript
// ❌ Pode quebrar semântica
const proxy = new Proxy(obj, {
  get(target, prop) {
    return target[prop]; // Não usa receiver
  }
});

// ✅ Use Reflect
const proxy = new Proxy(obj, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver);
  }
});
```

## 🚀 Boas Práticas

1. **Sempre use Reflect** em traps para delegar comportamento padrão
2. **Preserve receiver** em get/set para manter semântica correta
3. **Retorne boolean** em set/deleteProperty
4. **Valide antes**, delegue depois com Reflect
5. **Use WeakMap** para armazenar dados privados associados a proxies

Reflect + Proxy formam a dupla perfeita para meta-programação em JavaScript, onde Proxy intercepta e Reflect executa, mantendo correção e simplicidade.
