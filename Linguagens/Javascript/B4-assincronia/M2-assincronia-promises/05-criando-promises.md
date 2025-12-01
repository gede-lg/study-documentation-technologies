# Criando Promises: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Criar uma Promise** é o ato de instanciar um objeto Promise que encapsula uma operação assíncrona, definindo explicitamente como e quando essa operação transicionará para os estados fulfilled (sucesso) ou rejected (falha). É o processo de **transformar lógica assíncrona** (callbacks, timers, I/O) **em uma abstração Promise** que oferece API padronizada e componível.

Existem duas formas principais de criar Promises:

1. **Constructor Pattern:** Usar `new Promise(executor)` para criar Promise a partir de operação assíncrona
2. **Static Methods:** Usar `Promise.resolve()` e `Promise.reject()` para criar Promises já settled (resolvidas/rejeitadas)

```javascript
// Constructor: para operações assíncronas
const promessa1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Resultado'), 1000);
});

// Static method: para valores imediatos
const promessa2 = Promise.resolve('Valor imediato');
```

**Conceito fundamental:** Criar uma Promise é estabelecer um **contrato**: "Esta Promise eventualmente resolverá com um valor OU rejeitará com um erro". O código que cria a Promise controla **quando e como** essas transições acontecem.

### Contexto Histórico e Motivação

**Antes das Promises nativas (pré-ES6/2015):**

Bibliotecas como **Q**, **Bluebird**, e **When.js** ofereciam implementações de Promises com diferentes APIs para criação. Cada biblioteca tinha sua própria forma de construir Promises:

```javascript
// Q (2011)
Q.Promise(function(resolve, reject) { ... });
Q.defer(); // Padrão deferred

// Bluebird (2013)
new Bluebird(function(resolve, reject) { ... });
Bluebird.resolve(valor);

// When.js
when.promise(function(resolve, reject) { ... });
```

**ES6/2015: Padronização**

Com a introdução de Promises nativas, JavaScript padronizou:
- Constructor: `new Promise(executor)`
- Static methods: `Promise.resolve()`, `Promise.reject()`
- Comportamento consistente entre navegadores e Node.js

**Motivação para padronização:**
1. **Interoperabilidade:** Promises de diferentes bibliotecas nem sempre funcionavam juntas
2. **Simplicidade:** API única e consistente reduz curva de aprendizado
3. **Performance:** Implementação nativa é mais rápida que bibliotecas JavaScript puras
4. **Ecossistema:** Base sólida para async/await e APIs modernas

### Problema Fundamental que Resolve

**Problema 1: Promisificar Código Baseado em Callbacks**

Muitas APIs usam callbacks (Node.js fs, setTimeout, etc.), mas você quer usar Promises:

```javascript
// API com callback
fs.readFile('arquivo.txt', 'utf8', (erro, conteudo) => {
  if (erro) console.error(erro);
  else console.log(conteudo);
});

// ✅ Criar Promise wrapper
function readFilePromise(caminho) {
  return new Promise((resolve, reject) => {
    fs.readFile(caminho, 'utf8', (erro, conteudo) => {
      if (erro) reject(erro);
      else resolve(conteudo);
    });
  });
}

// Uso
readFilePromise('arquivo.txt')
  .then(conteudo => console.log(conteudo))
  .catch(erro => console.error(erro));
```

**Problema 2: Criar Promise de Operação Customizada**

Você tem lógica assíncrona própria que precisa ser exposta como Promise:

```javascript
// Operação assíncrona customizada
function aguardarTempo(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Esperou ${ms}ms`), ms);
  });
}

// Uso
aguardarTempo(2000).then(msg => console.log(msg));
```

**Problema 3: Retornar Valores/Erros Imediatos como Promises**

Às vezes você tem valor ou erro já disponível, mas API exige Promise:

```javascript
// Função deve retornar Promise, mas valor é imediato
function buscarDadosCache(chave) {
  const valorCache = cache[chave];

  if (valorCache) {
    // Valor imediato, mas precisa retornar Promise
    return Promise.resolve(valorCache);
  }

  return buscarDoBancoDeDados(chave); // Promise
}
```

### Importância no Ecossistema

Criar Promises corretamente é **fundamental** porque:

1. **Promisification:** Transformar APIs callback-based em Promises é prática comum
2. **APIs Customizadas:** Bibliotecas e frameworks expõem operações assíncronas como Promises
3. **Integração:** Conectar código legado (callbacks) com código moderno (async/await)
4. **Controle Fino:** Constructor permite controle total sobre resolução/rejeição
5. **Composição:** Promises criadas compõem com outras via chaining, Promise.all, etc.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Executor Function:** Função `(resolve, reject) => { }` define comportamento da Promise
2. **Controle de Transição:** Chamar `resolve()` ou `reject()` muda estado
3. **Eager Execution:** Executor executa **imediatamente** ao criar Promise
4. **Static Shortcuts:** `Promise.resolve()` e `Promise.reject()` para Promises já settled
5. **Promisification:** Padrão de criar Promise a partir de callbacks

### Pilares Fundamentais

- **new Promise(executor):** Constructor para criar Promises de operações assíncronas
- **resolve(valor):** Função que transiciona Promise para fulfilled
- **reject(razao):** Função que transiciona Promise para rejected
- **Promise.resolve(valor):** Cria Promise já fulfilled
- **Promise.reject(razao):** Cria Promise já rejected

### Visão Geral das Nuances

- **Executor síncrono:** Executor executa imediatamente, mesmo que Promise resolva depois
- **Resolve com Promise:** Resolver com outra Promise adota estado dela
- **Thenable:** Resolve com objeto que tem `.then()` trata como Promise
- **Throw em executor:** Exceções dentro de executor rejeitam Promise automaticamente
- **Imutabilidade:** Primeira chamada a resolve/reject vence; demais são ignoradas

---

## 🧠 Fundamentos Teóricos

### Constructor: new Promise(executor)

#### Anatomia do Constructor

```javascript
// Sintaxe completa
const promessa = new Promise(function executor(resolve, reject) {
  // executor: função executada IMEDIATAMENTE
  // resolve: função que muda Promise para fulfilled
  // reject: função que muda Promise para rejected

  // Lógica assíncrona
  setTimeout(() => {
    const sucesso = Math.random() > 0.5;

    if (sucesso) {
      resolve('Operação bem-sucedida'); // fulfilled
    } else {
      reject(new Error('Operação falhou')); // rejected
    }
  }, 1000);
});
```

**Componentes:**

1. **`new Promise(...)`:** Invoca constructor
2. **`executor`:** Função `(resolve, reject) => { }` passada ao constructor
3. **`resolve`:** Callback que transiciona para fulfilled quando chamado
4. **`reject`:** Callback que transiciona para rejected quando chamado

#### Execução Imediata do Executor

**Conceito crucial:** O executor executa **sincronamente e imediatamente** quando `new Promise()` é chamado:

```javascript
console.log('1. Antes de criar Promise');

const promessa = new Promise((resolve) => {
  console.log('2. Executor executando (síncrono!)');

  setTimeout(() => {
    console.log('4. Resolvendo Promise (assíncrono)');
    resolve('ok');
  }, 1000);

  console.log('3. Executor terminou (mas Promise ainda pending)');
});

console.log('5. Promise criada');

/* Output:
1. Antes de criar Promise
2. Executor executando (síncrono!)
3. Executor terminou (mas Promise ainda pending)
5. Promise criada
[após 1 segundo]
4. Resolvendo Promise (assíncrono)
*/
```

**Implicação:** Se executor tiver código pesado síncrono, ele bloqueará thread:

```javascript
// ❌ Código pesado bloqueia
new Promise((resolve) => {
  // Loop pesado executa sincronamente!
  for (let i = 0; i < 1000000000; i++) {
    // ... processamento intensivo
  }
  resolve('pronto');
});

console.log('Só imprime após loop terminar');
```

#### Função resolve(valor)

**Definição:** `resolve(valor)` transiciona Promise para fulfilled com `valor`.

```javascript
// Sintaxe básica
const promessa = new Promise((resolve) => {
  resolve(42); // fulfilled com valor 42
});

promessa.then(valor => console.log(valor)); // 42
```

**Valores diferentes:**

```javascript
// Número
Promise((resolve) => resolve(42));

// String
new Promise((resolve) => resolve('texto'));

// Objeto
new Promise((resolve) => resolve({ id: 1, nome: 'João' }));

// Array
new Promise((resolve) => resolve([1, 2, 3]));

// Undefined (padrão se não passar argumento)
new Promise((resolve) => resolve());
// Equivalente a: resolve(undefined)

// Null
new Promise((resolve) => resolve(null));
```

**Resolve com Promise:** Especial! Resolve com outra Promise **adota estado dela**:

```javascript
const promessaInterna = new Promise((resolve) => {
  setTimeout(() => resolve('Valor interno'), 1000);
});

const promessaExterna = new Promise((resolve) => {
  resolve(promessaInterna); // Resolve com Promise!
});

promessaExterna.then(valor => {
  console.log(valor); // 'Valor interno' (após 1 segundo)
  // promessaExterna aguardou promessaInterna resolver
});
```

**Conceito profundo:** Quando você resolve com Promise, a Promise externa "espera" a interna resolver e adota seu estado (fulfilled ou rejected).

#### Função reject(razao)

**Definição:** `reject(razao)` transiciona Promise para rejected com `razao`.

```javascript
// Sintaxe básica
const promessa = new Promise((resolve, reject) => {
  reject(new Error('Algo deu errado')); // rejected
});

promessa.catch(erro => console.error(erro.message)); // 'Algo deu errado'
```

**Convenção:** Rejeitar com instância de `Error`:

```javascript
// ✅ Recomendado: Error object
new Promise((resolve, reject) => {
  reject(new Error('Mensagem de erro'));
});

// ❌ Não recomendado: string
new Promise((resolve, reject) => {
  reject('Mensagem de erro'); // Perde stack trace
});

// Possível: objeto customizado
new Promise((resolve, reject) => {
  reject({ codigo: 404, mensagem: 'Não encontrado' });
});
```

**Por que Error?** Objetos `Error` capturam **stack trace**, facilitando debugging:

```javascript
const erro = new Error('Falhou');
console.log(erro.stack);
// Mostra onde erro foi criado, facilitando rastrear origem
```

#### Throw dentro de Executor

**Exceções lançadas dentro do executor automaticamente rejeitam a Promise:**

```javascript
// Throw é capturado e vira reject
const promessa = new Promise((resolve) => {
  throw new Error('Exceção!'); // Automaticamente: reject(new Error('Exceção!'))
});

promessa.catch(erro => {
  console.error('Capturado:', erro.message); // 'Capturado: Exceção!'
});

// Equivalente a:
const promessa2 = new Promise((resolve, reject) => {
  reject(new Error('Exceção!'));
});
```

**Útil para:** Validação e erros síncronos:

```javascript
function criarUsuario(dados) {
  return new Promise((resolve, reject) => {
    // Validação: throw automaticamente rejeita
    if (!dados.email) {
      throw new Error('Email é obrigatório');
    }

    // Operação assíncrona
    salvarNoBancoDeDados(dados)
      .then(usuario => resolve(usuario))
      .catch(erro => reject(erro));
  });
}
```

### Exemplo Completo: Simulação de API

```javascript
// Simular chamada de API que retorna Promise
function buscarUsuarioDaAPI(id) {
  return new Promise((resolve, reject) => {
    console.log(`Buscando usuário ${id}...`);

    // Simular delay de rede
    setTimeout(() => {
      // Banco de dados simulado
      const usuarios = {
        1: { id: 1, nome: 'Ana', email: 'ana@example.com' },
        2: { id: 2, nome: 'Bruno', email: 'bruno@example.com' },
        3: { id: 3, nome: 'Carlos', email: 'carlos@example.com' }
      };

      const usuario = usuarios[id];

      if (usuario) {
        console.log('Usuário encontrado!');
        resolve(usuario); // Sucesso
      } else {
        console.log('Usuário não existe');
        reject(new Error(`Usuário ${id} não encontrado`)); // Falha
      }
    }, 1500);
  });
}

// Uso: Sucesso
buscarUsuarioDaAPI(1)
  .then(usuario => {
    console.log('Nome:', usuario.nome);
    console.log('Email:', usuario.email);
  })
  .catch(erro => {
    console.error('Erro:', erro.message);
  });

// Uso: Falha
buscarUsuarioDaAPI(999)
  .then(usuario => {
    console.log('Nunca executa');
  })
  .catch(erro => {
    console.error('Erro capturado:', erro.message);
  });

/* Output:
Buscando usuário 1...
Buscando usuário 999...
[após 1.5 segundos]
Usuário encontrado!
Nome: Ana
Email: ana@example.com
Usuário não existe
Erro capturado: Usuário 999 não encontrado
*/
```

### Métodos Estáticos: Promise.resolve() e Promise.reject()

#### Promise.resolve(valor)

**Definição:** Cria Promise **já fulfilled** com `valor`.

```javascript
// Atalho para Promise fulfilled
const promessa = Promise.resolve(42);

// Equivalente a:
const promessa2 = new Promise((resolve) => {
  resolve(42);
});

// Uso
Promise.resolve('Dados')
  .then(valor => console.log(valor)); // 'Dados'
```

**Quando usar:**
- Converter valor síncrono em Promise
- Garantir retorno de Promise (mesmo que valor já esteja disponível)
- Iniciar cadeia de Promises

**Casos especiais:**

```javascript
// 1. Valor primitivo
Promise.resolve(42); // Promise fulfilled com 42

// 2. Objeto
Promise.resolve({ nome: 'João' });

// 3. Array
Promise.resolve([1, 2, 3]);

// 4. Undefined (sem argumento)
Promise.resolve(); // fulfilled com undefined

// 5. Promise (retorna a mesma Promise)
const p1 = Promise.resolve('original');
const p2 = Promise.resolve(p1);
console.log(p1 === p2); // true (mesma instância!)

// 6. Thenable (objeto com método .then)
const thenable = {
  then(resolve, reject) {
    resolve('De thenable');
  }
};

Promise.resolve(thenable)
  .then(valor => console.log(valor)); // 'De thenable'
```

#### Promise.reject(razao)

**Definição:** Cria Promise **já rejected** com `razao`.

```javascript
// Atalho para Promise rejected
const promessa = Promise.reject(new Error('Falhou'));

// Equivalente a:
const promessa2 = new Promise((resolve, reject) => {
  reject(new Error('Falhou'));
});

// Uso (SEMPRE com .catch() para evitar unhandled rejection!)
Promise.reject(new Error('Erro'))
  .catch(erro => console.error(erro.message)); // 'Erro'
```

**Quando usar:**
- Retornar erro imediato como Promise
- Validação falhou mas API exige Promise
- Shortcircuit em cadeia de Promises

**Diferença importante:** Ao contrário de `resolve()`, `reject()` **não desembrulha** Promises:

```javascript
// Resolve: desembrulha Promise
const p1 = Promise.resolve(42);
const p2 = Promise.resolve(p1);
p2.then(v => console.log(v)); // 42 (desembrulhou)

// Reject: NÃO desembrulha Promise
const p3 = Promise.reject(p1);
p3.catch(razao => {
  console.log(razao); // Promise { 42 } (Promise em si é a razão!)
});
```

### Promisification: Padrão de Criação

**Definição:** Converter função baseada em callback para retornar Promise.

#### Promisificação Manual

```javascript
// Função original com callback (Node.js style)
function lerArquivoCallback(caminho, callback) {
  // Simula fs.readFile
  setTimeout(() => {
    if (!caminho) {
      callback(new Error('Caminho inválido'));
    } else {
      callback(null, `Conteúdo de ${caminho}`);
    }
  }, 100);
}

// Versão promisificada
function lerArquivoPromise(caminho) {
  return new Promise((resolve, reject) => {
    lerArquivoCallback(caminho, (erro, conteudo) => {
      if (erro) {
        reject(erro);
      } else {
        resolve(conteudo);
      }
    });
  });
}

// Uso com Promise
lerArquivoPromise('arquivo.txt')
  .then(conteudo => console.log(conteudo))
  .catch(erro => console.error(erro));
```

#### Promisificação Genérica

```javascript
// Função que promisifica qualquer função error-first callback
function promisify(funcaoCallback) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      funcaoCallback(...args, (erro, ...resultados) => {
        if (erro) {
          reject(erro);
        } else {
          resolve(resultados.length === 1 ? resultados[0] : resultados);
        }
      });
    });
  };
}

// Uso
const lerArquivo = promisify(lerArquivoCallback);
lerArquivo('arquivo.txt').then(console.log);

// Node.js nativo tem util.promisify
const util = require('util');
const fs = require('fs');

const readFilePromise = util.promisify(fs.readFile);
```

---

## 🔍 Análise Conceitual Profunda

### Padrões Avançados de Criação

#### 1. Promise com Timeout

```javascript
function criarPromiseComTimeout(promessa, ms) {
  const timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout após ${ms}ms`));
    }, ms);
  });

  return Promise.race([promessa, timeout]);
}

// Uso
const operacaoDemorada = new Promise((resolve) => {
  setTimeout(() => resolve('Completo'), 5000);
});

criarPromiseComTimeout(operacaoDemorada, 2000)
  .then(resultado => console.log(resultado))
  .catch(erro => console.error(erro.message)); // 'Timeout após 2000ms'
```

#### 2. Promise com Retry

```javascript
function criarPromiseComRetry(operacao, tentativas) {
  return new Promise((resolve, reject) => {
    function tentar(tentativasRestantes) {
      operacao()
        .then(resolve)
        .catch(erro => {
          if (tentativasRestantes === 0) {
            reject(erro);
          } else {
            console.log(`Falhou, tentando novamente... (${tentativasRestantes} restantes)`);
            tentar(tentativasRestantes - 1);
          }
        });
    }

    tentar(tentativas);
  });
}

// Uso
const operacaoInstavel = () => {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.7) {
      resolve('Sucesso!');
    } else {
      reject(new Error('Falhou'));
    }
  });
};

criarPromiseComRetry(operacaoInstavel, 3)
  .then(resultado => console.log(resultado))
  .catch(erro => console.error('Falhou após todas tentativas:', erro));
```

#### 3. Promise com Cache

```javascript
function criarPromiseComCache() {
  const cache = new Map();

  return function buscarComCache(chave, operacao) {
    if (cache.has(chave)) {
      console.log('Cache HIT');
      return Promise.resolve(cache.get(chave));
    }

    console.log('Cache MISS');
    return operacao(chave).then(resultado => {
      cache.set(chave, resultado);
      return resultado;
    });
  };
}

// Uso
const buscar = criarPromiseComCache();

buscar('usuario:1', (chave) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: 1, nome: 'João' }), 1000);
  });
}).then(console.log);

// Segunda chamada usa cache (instantânea)
buscar('usuario:1', () => {}).then(console.log);
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Cada Forma de Criação

**Use `new Promise(executor)` quando:**
- Envolver operação callback-based (promisification)
- Criar operação assíncrona customizada
- Controle fino sobre timing de resolve/reject

**Use `Promise.resolve()` quando:**
- Converter valor síncrono em Promise
- Garantir retorno de Promise (mesmo com valor imediato)
- Iniciar cadeia de Promises

**Use `Promise.reject()` quando:**
- Retornar erro conhecido imediatamente
- Validação falhou mas API exige Promise
- Shortcircuit em processamento

---

## ⚠️ Limitações e Considerações

### Armadilhas Comuns

#### 1. Executor Não Executa Código Assíncrono

```javascript
// ❌ Executor síncrono não cria assincronia
const promessa = new Promise((resolve) => {
  console.log('Síncrono!');
  resolve('valor');
  console.log('Ainda síncrono!');
});

console.log('Depois do constructor');

/* Output:
Síncrono!
Ainda síncrono!
Depois do constructor
*/

// Executor em si é síncrono!
// Apenas handlers (.then) são assíncronos
```

#### 2. Esquecer de Chamar resolve/reject

```javascript
// ❌ Promise fica pending para sempre
const promessa = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('Operação completa');
    // Esqueceu de chamar resolve()!
  }, 1000);
});

promessa.then(valor => {
  console.log('Nunca executa'); // Nunca!
});
```

#### 3. Resolver/Rejeitar Múltiplas Vezes

```javascript
// Primeira chamada vence, demais são ignoradas
const promessa = new Promise((resolve, reject) => {
  resolve('Primeiro'); // Vence
  resolve('Segundo');  // Ignorado
  reject(new Error()); // Ignorado
});

promessa.then(v => console.log(v)); // 'Primeiro'
```

---

## 🔗 Interconexões Conceituais

**Conceitos Relacionados:**
- **Callbacks:** Promisification transforma callbacks em Promises
- **Estados:** Criar Promise define quando transicionar estados
- **Then/Catch:** Consumir Promises criadas
- **Async/Await:** Simplifica consumo de Promises criadas

**Progressão:**
1. Callbacks (fundação)
2. Problemas de callbacks (callback hell)
3. Promises (solução)
4. Criando Promises (este tópico)
5. Consumindo Promises (then/catch)
6. Async/await

---

## 🚀 Evolução e Próximos Conceitos

**Próximos Tópicos:**
- **then(), catch(), finally():** Consumir e reagir a Promises
- **Promise Avançadas:** Promise.all, race, allSettled, any

Dominar criação de Promises é essencial para integrar código assíncrono legado com padrões modernos e construir APIs robustas e componíveis.
