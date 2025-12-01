# 🎯 Introdução

`axios.all()` e `axios.spread()` representam legacy helpers do Axios para parallel requests que foram **deprecated** em favor de JavaScript native `Promise.all()` e destructuring. Estas funções foram úteis em era pré-ES6 quando Promises não eram padronizadas e destructuring não existia, mas com JavaScript moderno tornaram-se redundantes. Entretanto, compreender estas APIs é valioso para manutenção de codebases legacy e apreciar evolução de JavaScript async patterns.

O problema que `axios.all()` e `axios.spread()` resolviam era **falta de native Promise utilities** em JavaScript pré-ES6: desenvolvedores precisavam de forma de executar múltiplos requests paralelos e processar results de forma conveniente. `axios.all()` era wrapper around `Promise.all()` que aceitava array de Axios requests, enquanto `axios.spread()` convertia array de results em argumentos separados para callback, simulando destructuring antes de existir syntax nativa.

Com ES6 e posterior, JavaScript ganhou `Promise.all()` nativo (idêntico a `axios.all()`) e destructuring syntax (`const [a, b] = array`) que tornam `axios.spread()` obsoleto. Pattern moderno é usar `Promise.all()` diretamente e destructure results, eliminando dependência de Axios-specific helpers. Axios oficialmente deprecou estas funções em versões recentes, recomendando migration para equivalentes nativos.

Entretanto, migrations de codebases grandes podem encontrar `axios.all()` e `axios.spread()` extensivamente usados, requerindo compreensão de como funcionam e como migrar para patterns modernos. Além disso, compreender razões de deprecation ilustra princípios importantes: preferir JavaScript native features sobre library-specific abstractions, e como evolução de linguagem torna libraries helpers obsoletos.

Este módulo explora `axios.all()` e `axios.spread()` em profundidade: desde uso original e motivações históricas, através de comparações com equivalentes modernos, até migration strategies para atualizar codebases legacy. Objetivo é fornecer conhecimento completo destas APIs deprecated para manutenção de código existente e guidance clara para modernização.

---

# 📋 Sumário

### **Histórico e Deprecation**
- Contexto pré-ES6
- Por que existiam axios.all() e axios.spread()
- Deprecation oficial
- Recomendações de migration

### **axios.all() Legacy API**
- Syntax e uso
- Equivalente: Promise.all()
- Exemplos práticos
- Limitations

### **axios.spread() Legacy API**
- Syntax e uso
- Equivalente: Destructuring
- Callback-based pattern
- Modernização

### **Migration para Promise.all()**
- Refactoring axios.all()
- Replacing axios.spread() com destructuring
- Side-by-side comparisons
- Automated migration

### **Quando Ainda Encontrar**
- Codebases legacy
- Documentação antiga
- Stack Overflow posts antigos
- Identificando uso

### **Alternatives Modernas**
- Promise.all()
- Promise.allSettled()
- Destructuring
- Async/await patterns

### **Best Practices**
- Evitar axios.all() e axios.spread()
- Usar native Promise APIs
- Code modernization
- ESLint rules

---

# 🧠 Fundamentos

## Histórico e Deprecation

### **Contexto Pré-ES6**

Antes de ES6 (2015), JavaScript não tinha:
- `Promise.all()` nativo (apenas libraries como Bluebird)
- Destructuring syntax
- Arrow functions
- Async/await

**Problema**: Desenvolvedores precisavam executar múltiplos Axios requests paralelos.

**Solução (pré-ES6)**: Axios fornecia `axios.all()` e `axios.spread()` como utilities.

### **Por Que Existiam**

**axios.all()**: Wrapper around Promise implementation (quando browsers não tinham Promise.all nativo).

**axios.spread()**: Converter array de results em argumentos separados (antes de destructuring).

**Exemplo Legacy**:
```javascript
// Código antigo (pré-ES6)
axios.all([
  axios.get('/api/user'),
  axios.get('/api/posts')
])
.then(axios.spread(function(userResponse, postsResponse) {
  console.log(userResponse.data);
  console.log(postsResponse.data);
}));
```

### **Deprecation Oficial**

**Axios v0.19.0** (2019): Deprecou `axios.all()` e `axios.spread()`.

**Razão**: JavaScript moderno tem equivalentes nativos melhores.

**Warning** (console):
```
axios.all is deprecated and will be removed in v1.0. Use Promise.all instead.
axios.spread is deprecated and will be removed in v1.0. Use destructuring instead.
```

### **Recomendações de Migration**

**Oficial Axios Docs**:
- Substituir `axios.all()` por `Promise.all()`
- Substituir `axios.spread()` por destructuring
- Usar async/await para readability

---

# 🔍 Análise

## axios.all() Legacy API

### **Syntax**

```javascript
axios.all(iterable)
```

**Parameters**: Array de Promises (Axios requests)

**Return**: Promise que resolve com array de responses

### **Uso Legacy**

```javascript
axios.all([
  axios.get('/api/user'),
  axios.get('/api/posts'),
  axios.get('/api/comments')
])
.then(responses => {
  const userResponse = responses[0];
  const postsResponse = responses[1];
  const commentsResponse = responses[2];
  
  console.log(userResponse.data);
  console.log(postsResponse.data);
  console.log(commentsResponse.data);
});
```

### **Equivalente Moderno: Promise.all()**

```javascript
Promise.all([
  axios.get('/api/user'),
  axios.get('/api/posts'),
  axios.get('/api/comments')
])
.then(responses => {
  const userResponse = responses[0];
  const postsResponse = responses[1];
  const commentsResponse = responses[2];
  
  console.log(userResponse.data);
  console.log(postsResponse.data);
  console.log(commentsResponse.data);
});
```

**Identical**: `axios.all()` é literalmente wrapper around `Promise.all()`.

### **Implementation (Axios Source)**

```javascript
// Axios source code (simplified)
axios.all = function all(promises) {
  return Promise.all(promises);
};
```

**Conclusão**: Não há diferença funcional. `axios.all()` é apenas proxy para `Promise.all()`.

## axios.spread() Legacy API

### **Syntax**

```javascript
axios.spread(callback)
```

**Parameters**: Callback function que recebe argumentos separados

**Return**: Function que aceita array e invoca callback com spread args

### **Uso Legacy**

```javascript
axios.all([
  axios.get('/api/user'),
  axios.get('/api/posts')
])
.then(axios.spread((userResponse, postsResponse) => {
  console.log(userResponse.data);
  console.log(postsResponse.data);
}));
```

### **Equivalente Moderno: Destructuring**

```javascript
Promise.all([
  axios.get('/api/user'),
  axios.get('/api/posts')
])
.then(([userResponse, postsResponse]) => {
  console.log(userResponse.data);
  console.log(postsResponse.data);
});
```

**Ou com async/await**:

```javascript
const [userResponse, postsResponse] = await Promise.all([
  axios.get('/api/user'),
  axios.get('/api/posts')
]);

console.log(userResponse.data);
console.log(postsResponse.data);
```

### **Implementation (Axios Source)**

```javascript
// Axios source code (simplified)
axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};
```

**Explicação**: `axios.spread()` converte `callback([a, b, c])` em `callback(a, b, c)`.

**Com Destructuring**: Não precisamos desta conversão - destructuring faz isso diretamente.

## Migration para Promise.all()

### **Pattern 1: axios.all() → Promise.all()**

**Antes**:
```javascript
axios.all([
  axios.get('/api/user'),
  axios.get('/api/posts')
])
.then(responses => {
  console.log(responses[0].data);
  console.log(responses[1].data);
});
```

**Depois**:
```javascript
Promise.all([
  axios.get('/api/user'),
  axios.get('/api/posts')
])
.then(responses => {
  console.log(responses[0].data);
  console.log(responses[1].data);
});
```

**Change**: Replace `axios.all` com `Promise.all`. That's it.

### **Pattern 2: axios.spread() → Destructuring**

**Antes**:
```javascript
axios.all([
  axios.get('/api/user'),
  axios.get('/api/posts')
])
.then(axios.spread((userRes, postsRes) => {
  console.log(userRes.data);
  console.log(postsRes.data);
}));
```

**Depois** (com .then):
```javascript
Promise.all([
  axios.get('/api/user'),
  axios.get('/api/posts')
])
.then(([userRes, postsRes]) => {
  console.log(userRes.data);
  console.log(postsRes.data);
});
```

**Depois** (com async/await - recomendado):
```javascript
const [userRes, postsRes] = await Promise.all([
  axios.get('/api/user'),
  axios.get('/api/posts')
]);

console.log(userRes.data);
console.log(postsRes.data);
```

### **Pattern 3: Nested Chains**

**Antes**:
```javascript
axios.all([
  axios.get('/api/user'),
  axios.get('/api/posts')
])
.then(axios.spread((userRes, postsRes) => {
  return axios.all([
    axios.get(`/api/user/${userRes.data.id}/details`),
    axios.get(`/api/posts/${postsRes.data[0].id}/comments`)
  ]);
}))
.then(axios.spread((detailsRes, commentsRes) => {
  console.log(detailsRes.data);
  console.log(commentsRes.data);
}));
```

**Depois** (async/await - muito mais legível):
```javascript
const [userRes, postsRes] = await Promise.all([
  axios.get('/api/user'),
  axios.get('/api/posts')
]);

const [detailsRes, commentsRes] = await Promise.all([
  axios.get(`/api/user/${userRes.data.id}/details`),
  axios.get(`/api/posts/${postsRes.data[0].id}/comments`)
]);

console.log(detailsRes.data);
console.log(commentsRes.data);
```

### **Automated Migration**

**ESLint Rule** (custom):
```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-deprecated-axios': {
      create(context) {
        return {
          'CallExpression[callee.object.name="axios"][callee.property.name="all"]'(node) {
            context.report({
              node,
              message: 'axios.all() is deprecated. Use Promise.all() instead.'
            });
          },
          'CallExpression[callee.object.name="axios"][callee.property.name="spread"]'(node) {
            context.report({
              node,
              message: 'axios.spread() is deprecated. Use destructuring instead.'
            });
          }
        };
      }
    }
  }
};
```

**Codemod** (jscodeshift):
```javascript
// Transform axios.all → Promise.all
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  
  root.find(j.CallExpression, {
    callee: {
      object: { name: 'axios' },
      property: { name: 'all' }
    }
  }).replaceWith(path => {
    return j.callExpression(
      j.memberExpression(
        j.identifier('Promise'),
        j.identifier('all')
      ),
      path.node.arguments
    );
  });
  
  return root.toSource();
};
```

## Quando Ainda Encontrar

### **Codebases Legacy**

Projetos antigos (pré-2019) frequentemente usam `axios.all()` e `axios.spread()`:

```javascript
// Código de 2016-2018
function loadDashboard() {
  return axios.all([
    axios.get('/api/user'),
    axios.get('/api/posts'),
    axios.get('/api/notifications')
  ])
  .then(axios.spread(function(user, posts, notifications) {
    // ...
  }));
}
```

### **Documentação Antiga**

Tutoriais e blog posts antigos ainda referenciam estas APIs:

```javascript
// Tutorial de 2017
axios.all([req1, req2])
  .then(axios.spread((res1, res2) => { ... }));
```

### **Stack Overflow**

Muitas respostas antigas usam patterns deprecated:

```javascript
// Stack Overflow answer de 2016
axios.all([...]).then(axios.spread(...));
```

### **Identificando Uso**

**Grep/Search**:
```bash
# Encontrar axios.all
grep -r "axios\.all" src/

# Encontrar axios.spread
grep -r "axios\.spread" src/
```

**ESLint**:
```javascript
// Configurar warning
rules: {
  'no-restricted-syntax': [
    'warn',
    {
      selector: 'CallExpression[callee.object.name="axios"][callee.property.name="all"]',
      message: 'Use Promise.all instead of axios.all'
    }
  ]
}
```

## Alternatives Modernas

### **Promise.all()**

```javascript
const results = await Promise.all([
  axios.get('/api/user'),
  axios.get('/api/posts')
]);

const [userRes, postsRes] = results;
```

### **Promise.allSettled()**

Para partial success (não existia quando axios.all foi criado):

```javascript
const results = await Promise.allSettled([
  axios.get('/api/user'),
  axios.get('/api/posts'),
  axios.get('/api/comments')
]);

results.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(`Request ${index} succeeded:`, result.value.data);
  } else {
    console.error(`Request ${index} failed:`, result.reason);
  }
});
```

### **Destructuring**

```javascript
// Direct destructuring
const [userRes, postsRes] = await Promise.all([
  axios.get('/api/user'),
  axios.get('/api/posts')
]);

// Nested destructuring
const [{ data: user }, { data: posts }] = await Promise.all([
  axios.get('/api/user'),
  axios.get('/api/posts')
]);

console.log(user);   // Directly user data
console.log(posts);  // Directly posts data
```

### **Async/Await Patterns**

```javascript
// Sequential (quando há dependência)
const userRes = await axios.get('/api/user');
const postsRes = await axios.get(`/api/users/${userRes.data.id}/posts`);

// Parallel (quando independentes)
const [userRes, postsRes] = await Promise.all([
  axios.get('/api/user'),
  axios.get('/api/posts')
]);

// Mixed
const userRes = await axios.get('/api/user');

const [detailsRes, postsRes] = await Promise.all([
  axios.get(`/api/users/${userRes.data.id}/details`),
  axios.get(`/api/users/${userRes.data.id}/posts`)
]);
```

## Best Practices

### **1. Evitar axios.all() e axios.spread()**

```javascript
// ❌ Deprecated
axios.all([req1, req2])
  .then(axios.spread((res1, res2) => { ... }));

// ✅ Modern
const [res1, res2] = await Promise.all([req1, req2]);
```

### **2. Usar Native Promise APIs**

```javascript
// ✅ Promise.all para fail-fast
const results = await Promise.all(promises);

// ✅ Promise.allSettled para partial success
const results = await Promise.allSettled(promises);

// ✅ Promise.race para first response
const firstResult = await Promise.race(promises);
```

### **3. Code Modernization Checklist**

- [ ] Replace `axios.all()` com `Promise.all()`
- [ ] Replace `axios.spread()` com destructuring
- [ ] Migrate `.then()` chains para async/await
- [ ] Add ESLint rules para prevent regression
- [ ] Update documentation

### **4. ESLint Configuration**

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-restricted-properties': [
      'error',
      {
        object: 'axios',
        property: 'all',
        message: 'Use Promise.all instead of axios.all (deprecated)'
      },
      {
        object: 'axios',
        property: 'spread',
        message: 'Use destructuring instead of axios.spread (deprecated)'
      }
    ]
  }
};
```

---

# 🎯 Aplicabilidade

## Quando Você Deve Conhecer Estas APIs

**Manutenção de Código Legacy**: Entender codebases antigas.

**Migrations**: Modernizar projetos existentes.

**Code Reviews**: Identificar uso deprecated.

**Historical Context**: Compreender evolução de JavaScript.

## Quando NUNCA Usar

**Novos Projetos**: Sempre usar Promise.all e destructuring.

**Refactorings**: Migrar para patterns modernos.

**Modern Codebases**: Não há razão para usar APIs deprecated.

---

# ⚠️ Limitações

## Deprecation Oficial

Axios planeja remover estas APIs em v1.0 (futuro).

## Nenhuma Vantagem

`axios.all()` e `axios.spread()` não oferecem benefícios sobre equivalentes nativos.

## Confusão de Novatos

Desenvolvedores novos podem se confundir ao ver APIs Axios-specific quando JavaScript tem equivalentes.

---

# 🔗 Interconexões

## Substituído por Promise.all()

JavaScript native Promise API eliminou necessidade de axios.all.

## Substituído por Destructuring

ES6 destructuring eliminou necessidade de axios.spread.

## Parallel Requests

Conceito permanece, apenas implementation mudou.

---

# 🚀 Evolução

## JavaScript Evolution

Evolução de JavaScript tornou library helpers obsoletos:
- ES6 Promises
- Destructuring
- Async/await
- Promise.allSettled, Promise.any

## Library Philosophy Shift

Libraries modernas preferem usar JavaScript native features em vez de reinventar.

## Future Removal

Axios v1.0 removerá completamente estas APIs.

---

**Conclusão Integrada**: `axios.all()` e `axios.spread()` são legacy helpers deprecated que foram úteis em era pré-ES6 mas tornaram-se obsoletos com JavaScript moderno. `axios.all()` é idêntico a `Promise.all()`, e `axios.spread()` é desnecessário com destructuring syntax. Migration é trivial: substituir `axios.all` por `Promise.all` e `axios.spread(callback)` por destructuring `([a, b]) => ...`. Codebases modernas devem evitar completamente estas APIs, usando JavaScript native features. Compreender deprecation ilustra princípio importante: preferir language features sobre library abstractions, permitindo código mais portable e future-proof.