# Promise.resolve() e Promise.reject(): Criação Rápida de Promises

## 🎯 Introdução e Definição

### Definição Conceitual

**Promise.resolve()** e **Promise.reject()** são métodos estáticos que criam Promises **já resolvidas** ou **já rejeitadas** instantaneamente. São atalhos para criar Promises sem usar o construtor `new Promise()`, úteis para converter valores síncronos em Promises ou inicializar cadeias assíncronas.

`Promise.resolve(valor)` cria uma Promise que **imediatamente** entra no estado "fulfilled" com o valor fornecido.  
`Promise.reject(erro)` cria uma Promise que **imediatamente** entra no estado "rejected" com a razão (erro) fornecida.

Conceitualmente, esses métodos implementam **lifting** - elevam valores do domínio síncrono para o domínio assíncrono (Promise), permitindo tratamento uniforme de valores e operações assíncronas.

### Contexto Histórico e Motivação

Antes desses métodos, criar Promise simples exigia construtor verboso:

```javascript
// Sem Promise.resolve() - verboso
const promiseDeValor = new Promise((resolve) => {
    resolve(42);
});

// Com Promise.resolve() - conciso
const promiseDeValor = Promise.resolve(42);
```

**Motivações:**

1. **Brevidade:** Criar Promises triviais sem boilerplate
2. **Interoperabilidade:** Converter valores não-Promise em Promises
3. **Uniformidade:** APIs que retornam Promise ou valor direto
4. **Composição:** Iniciar cadeias de Promises facilmente
5. **Testing:** Criar mocks e fixtures assíncronos

Esses métodos se tornaram essenciais especialmente para:
- **Adaptar APIs mistas** (que às vezes retornam Promise, às vezes valor)
- **Normalizar retornos** em funções que podem ser síncronas ou assíncronas
- **Testing assíncrono** (criar Promises de teste rapidamente)

### Problema Fundamental que Resolve

**Promise.resolve() e Promise.reject()** resolvem problemas práticos:

**1. Conversão de valores em Promises:**
```javascript
// Sem: precisa verificar se é Promise
function processar(valorOuPromise) {
    if (valorOuPromise instanceof Promise) {
        return valorOuPromise.then(val => val * 2);
    } else {
        return valorOuPromise * 2;
    }
}

// Com: normaliza tudo em Promise
function processar(valorOuPromise) {
    return Promise.resolve(valorOuPromise).then(val => val * 2);
}
```

**2. Iniciar cadeias condicionalmente:**
```javascript
const promise = condicao 
    ? fetch('/dados')
    : Promise.resolve({ dados: [] });  // Valor padrão como Promise

promise.then(dados => processar(dados));  // Mesma interface
```

**3. Retornos uniformes:**
```javascript
function buscarDados(id) {
    if (cache.has(id)) {
        return Promise.resolve(cache.get(id));  // Cache: síncrono → Promise
    }
    return fetch(`/dados/${id}`);  // API: já é Promise
}
// Caller sempre recebe Promise, simplificando consumo
```

**4. Testing:**
```javascript
// Mock assíncrono trivial
const mockAPI = {
    buscar: () => Promise.resolve({ nome: 'Teste' })
};
```

### Importância no Ecossistema

Esses métodos são **fundamentais** porque:

- **Bridge síncrono-assíncrono:** Permitem mixar código síncrono e assíncrono fluidamente
- **Padrão universal:** Todas as libs modernas usam para normalização
- **Simplificação:** Reduzem verbosidade drasticamente
- **Thenable normalization:** `Promise.resolve()` converte qualquer "thenable" em Promise nativa
- **Base para combinators:** `Promise.all()`, etc., usam internamente para normalizar inputs

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

**Promise.resolve():**
1. Cria Promise fulfilled instantaneamente
2. Se recebe Promise, retorna ela mesma (ou equivalente)
3. Se recebe "thenable", converte em Promise nativa
4. Se recebe valor primitivo, encapsula em Promise

**Promise.reject():**
1. Cria Promise rejected instantaneamente
2. Sempre encapsula o argumento como razão de rejeição
3. Mesmo se argumento é Promise, ela vira a **razão** (não é unwrapped)

### Pilares Fundamentais

- **Lifting:** Elevar valores síncronos para contexto assíncrono
- **Normalização:** Converter thenables e valores em Promises nativas
- **Imediatismo:** Promises criadas já estão settled (resolvidas/rejeitadas)
- **Composição:** Facilitam início de cadeias e composição de fluxos
- **Microtask scheduling:** Handlers executam assincronamente mesmo com valores síncronos

### Visão Geral das Nuances

- **Promise.resolve(promise):** Retorna a mesma Promise (se é nativa)
- **Promise.resolve(thenable):** Converte objeto com `.then()` em Promise
- **Promise.reject(promise):** Promise vira a **razão** de rejeição (não unwrapped)
- **Execução assíncrona:** Mesmo com valor síncrono, `.then()` executa em microtask
- **Uso em retornos:** Garante que função sempre retorna Promise

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Promise.resolve(value)

O comportamento de `Promise.resolve()` depende do **tipo do argumento**:

**Caso 1: Argumento é Promise nativa**
```javascript
const p1 = new Promise(resolve => resolve(42));
const p2 = Promise.resolve(p1);

console.log(p1 === p2);  // true - MESMA Promise
```

Se argumento já é Promise (nativa), `Promise.resolve()` retorna ela diretamente.

**Caso 2: Argumento é "thenable" (objeto com método .then)**
```javascript
const thenable = {
    then(resolve, reject) {
        resolve(42);
    }
};

const promise = Promise.resolve(thenable);
promise.then(val => console.log(val));  // 42
```

Se argumento tem método `.then()`, é tratado como "Promise-like" e convertido em Promise nativa.

**Caso 3: Argumento é valor primitivo**
```javascript
const promise = Promise.resolve(42);
promise.then(val => console.log(val));  // 42
```

Valor é encapsulado em Promise fulfilled.

**Caso 4: Sem argumento**
```javascript
const promise = Promise.resolve();
promise.then(val => console.log(val));  // undefined
```

Promise fulfilled com `undefined`.

#### Promise.reject(reason)

`Promise.reject()` sempre cria Promise rejected com o argumento como **razão**:

```javascript
const promiseRejeitada = Promise.reject('Erro!');
promiseRejeitada.catch(erro => console.error(erro));  // 'Erro!'
```

**Importante:** Mesmo se argumento é Promise, ela **não** é unwrapped:

```javascript
const p1 = Promise.resolve(42);
const p2 = Promise.reject(p1);  // Rejeita COM a Promise p1 como razão

p2.catch(razao => {
    console.log(razao === p1);  // true - p1 é a razão, não foi unwrapped
});
```

Isso é **assimétrico** em relação a `Promise.resolve()`.

### Princípios Conceituais

#### Lifting de Valores

Em programação funcional, **lifting** significa elevar uma função/valor para operar em contexto mais alto:

```
Domínio síncrono:    42
                     ↓ Promise.resolve()
Domínio assíncrono:  Promise<42>
```

Isso permite aplicar **operações assíncronas** (`.then()`) em valores síncronos.

#### Thenable Protocol

JavaScript define "thenable" como **qualquer objeto com método `.then()`**. `Promise.resolve()` implementa **duck typing** - se "parece" uma Promise, é tratado como tal:

```javascript
// Thenable customizado
const meuThenable = {
    then(onFulfilled, onRejected) {
        setTimeout(() => onFulfilled('Valor assíncrono'), 1000);
    }
};

Promise.resolve(meuThenable)
    .then(val => console.log(val));  // "Valor assíncrono" (após 1s)
```

Isso permite **interoperabilidade** entre diferentes implementações de Promises (antes das Promises nativas, libs como Bluebird, Q, etc.).

#### Microtask Scheduling

Mesmo quando valor é **síncrono**, handlers `.then()` executam **assincronamente**:

```javascript
console.log('1');

Promise.resolve(42).then(val => {
    console.log('3:', val);
});

console.log('2');

// Output: 1, 2, 3: 42
```

`.then()` sempre agenda callback em **microtask queue**, garantindo execução após código síncrono.

---

## 🔍 Análise Conceitual Profunda

### Promise.resolve() - Casos de Uso

#### 1. Converter Valor em Promise

```javascript
function dobrar(valor) {
    return Promise.resolve(valor).then(v => v * 2);
}

dobrar(21).then(resultado => console.log(resultado));  // 42
```

Útil quando função precisa retornar Promise uniformemente.

#### 2. Normalizar Retornos Mistos

```javascript
function buscarDados(id) {
    // Cache retorna valor direto, API retorna Promise
    const cached = cache.get(id);
    if (cached) {
        return Promise.resolve(cached);  // Síncrono → Promise
    }
    return fetch(`/dados/${id}`).then(r => r.json());  // Já Promise
}

// Consumidor sempre recebe Promise
buscarDados(123).then(dados => console.log(dados));
```

Padrão crucial para **cache + API**, **fallbacks**, etc.

#### 3. Iniciar Cadeia com Valor

```javascript
Promise.resolve({ nome: 'João' })
    .then(usuario => buscarPedidos(usuario.nome))
    .then(pedidos => calcularTotal(pedidos))
    .then(total => console.log('Total:', total));
```

Útil quando primeiro valor é conhecido mas quer encadear operações assíncronas.

#### 4. Converter Thenable de Biblioteca Externa

```javascript
// jQuery Deferred (não é Promise nativa)
const jqPromise = $.ajax('/dados');

// Converter para Promise nativa
Promise.resolve(jqPromise)
    .then(dados => console.log(dados));
```

Permite usar Promises nativas com código legacy.

### Promise.reject() - Casos de Uso

#### 1. Validação Síncrona em Função Assíncrona

```javascript
function buscarUsuario(id) {
    if (!id) {
        return Promise.reject(new Error('ID é obrigatório'));
    }
    return fetch(`/usuario/${id}`).then(r => r.json());
}

buscarUsuario(null)
    .catch(erro => console.error(erro.message));  // "ID é obrigatório"
```

Valida antes de iniciar operação assíncrona, mantendo interface uniforme.

#### 2. Simular Falha em Testes

```javascript
// Mock que sempre falha
const mockAPI = {
    buscar: () => Promise.reject(new Error('Falha simulada'))
};

// Teste
mockAPI.buscar()
    .catch(erro => {
        expect(erro.message).toBe('Falha simulada');
    });
```

#### 3. Converter Exceção em Promise Rejeitada

```javascript
function operacao(dados) {
    try {
        const resultado = processarSincrono(dados);
        return Promise.resolve(resultado);
    } catch (erro) {
        return Promise.reject(erro);  // Exceção → Promise rejeitada
    }
}
```

Útil para **unificar** tratamento de erros síncronos e assíncronos.

### Assimetria: resolve vs reject

**Comportamento diferente com Promises:**

```javascript
const p = Promise.resolve(42);

const r1 = Promise.resolve(p);
console.log(r1 === p);  // true - unwrapped

const r2 = Promise.reject(p);
r2.catch(razao => {
    console.log(razao === p);  // true - NÃO unwrapped
});
```

**Por quê?**
- `Promise.resolve()`: unwrap evita "Promise de Promise"
- `Promise.reject()`: não unwrap porque razão pode ser qualquer valor (incluindo Promise)

### Microtask vs Macrotask

Comparação com execução síncrona:

```javascript
console.log('Start');

// Síncrono
const valorSync = 42;
console.log('Sync:', valorSync);

// Promise.resolve (microtask)
Promise.resolve(42).then(val => {
    console.log('Promise:', val);
});

// setTimeout (macrotask)
setTimeout(() => {
    console.log('Timeout:', 42);
}, 0);

console.log('End');

// Output:
// Start
// Sync: 42
// End
// Promise: 42  ← microtask (antes de macrotask)
// Timeout: 42  ← macrotask
```

`.then()` de `Promise.resolve()` executa **antes** de `setTimeout(0)`, mesmo ambos sendo "assíncronos".

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Promise.resolve()

**Use quando:**

1. **Normalizar retornos:** Função pode retornar valor ou Promise
2. **Iniciar cadeia:** Começar com valor conhecido
3. **Converter thenable:** Interoperar com Promises não-nativas
4. **Cache pattern:** Retornar cache (síncrono) ou fetch (assíncrono) uniformemente
5. **Testing:** Criar mocks que resolvem imediatamente

**Exemplo ideal:**

```javascript
class Cache {
    async buscar(chave) {
        if (this.has(chave)) {
            return Promise.resolve(this.get(chave));  // Cache hit
        }
        const valor = await this.buscarRemoto(chave);
        this.set(chave, valor);
        return valor;
    }
}
```

### Quando Usar Promise.reject()

**Use quando:**

1. **Validação pré-operação:** Falhar antes de operação assíncrona
2. **Simular erros:** Testing e mocks
3. **Converter exceções:** try/catch → Promise rejeitada
4. **Retorno de erro uniforme:** Manter interface Promise mesmo em erro síncrono

**Exemplo ideal:**

```javascript
function validarEBuscar(dados) {
    if (!dados.id) {
        return Promise.reject(new Error('ID obrigatório'));
    }
    if (dados.id < 0) {
        return Promise.reject(new Error('ID inválido'));
    }
    return fetch(`/item/${dados.id}`).then(r => r.json());
}
```

### Quando Evitar

**Evite quando:**

1. **Código já assíncrono:** Se já está em `.then()` ou `async`, use `return` direto
2. **Performance crítica:** Criar Promises tem overhead (mínimo, mas existe)
3. **Overengineering:** Não force tudo em Promise se síncrono é suficiente

```javascript
// ❌ Desnecessário
async function processar(valor) {
    return Promise.resolve(valor * 2);  // Redundante
}

// ✅ Direto
async function processar(valor) {
    return valor * 2;  // Async function já retorna Promise
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Restrições Conceituais

**1. Sempre criam Promises settled:**
- Não há forma de criar Promise "pending" com esses métodos
- Use `new Promise()` para controle fino

**2. Overhead de Promise:**
```javascript
// Síncrono: ~1ns por operação
const valor = 42 * 2;

// Promise: ~100-1000ns por operação
Promise.resolve(42).then(v => v * 2);
```

Para operações **puramente síncronas** em loop crítico, Promise tem custo.

**3. Microtask não é imediato:**
```javascript
let valor = 0;

Promise.resolve().then(() => {
    valor = 42;
});

console.log(valor);  // 0 - .then() ainda não executou
```

Mesmo com `Promise.resolve()` imediato, handler é agendado, não executa sincronamente.

### Armadilhas Comuns

**Armadilha 1: Esquecer que .then() é sempre assíncrono**
```javascript
// ❌ Espera valor imediato
function getValor() {
    let resultado;
    Promise.resolve(42).then(val => {
        resultado = val;
    });
    return resultado;  // undefined! .then() não executou ainda
}

// ✅ Retornar Promise
function getValor() {
    return Promise.resolve(42);  // Caller usa .then()
}
```

**Armadilha 2: Promise.reject() não unwrap**
```javascript
const p = Promise.resolve(42);
const rejeitada = Promise.reject(p);

// ❌ Espera 42
rejeitada.catch(razao => {
    console.log(razao);  // Promise, não 42!
});

// ✅ Se quer valor, extraia primeiro
p.then(val => Promise.reject(val))
    .catch(razao => console.log(razao));  // 42
```

**Armadilha 3: Uso redundante em async function**
```javascript
// ❌ Redundante
async function buscar() {
    return Promise.resolve(await fetch('/dados'));
}

// ✅ Simples
async function buscar() {
    return fetch('/dados');  // Async function já retorna Promise
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Outros Conceitos

**Promise Constructor vs Métodos Estáticos:**
```javascript
// Construtor: para operações complexas
new Promise((resolve, reject) => {
    setTimeout(() => resolve(42), 1000);
});

// Estáticos: para valores imediatos
Promise.resolve(42);
```

**Async/Await:**
```javascript
// Promise.resolve() em async function
async function exemplo() {
    const valor = await Promise.resolve(42);  // Funciona, mas redundante
    return valor;
}

// Equivalente mais simples
async function exemplo() {
    return 42;  // Automaticamente wrapped em Promise
}
```

**Thenable Interoperability:**
- `Promise.resolve()` é bridge entre Promises nativas e libraries antigas
- Permite migração gradual de código legacy

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. **Promise Basics** (construtor, estados)
2. **Promise Chaining** (encadeamento)
3. **Error Propagation** (tratamento de erros)
4. **Promise.resolve/reject** (você está aqui)
5. **Promise Combinators** (all, race, allSettled, any)
6. **Async/Await** (syntax moderna)

### Preparação para Promise Combinators

`Promise.resolve()` é usado internamente por combinators:

```javascript
// Promise.all usa Promise.resolve() para normalizar inputs
Promise.all([42, Promise.resolve(10), fetch('/dados')])
    .then(([a, b, c]) => {
        // 42 foi convertido em Promise.resolve(42) internamente
    });
```

Entender `Promise.resolve()` é essencial para entender como `Promise.all()`, `Promise.race()`, etc., aceitam **valores ou Promises** indistintamente.

---

## 📚 Conclusão

**Promise.resolve()** e **Promise.reject()** são ferramentas simples mas fundamentais para trabalhar com Promises. Elas fazem a **ponte** entre código síncrono e assíncrono, normalizam retornos mistos e simplificam criação de Promises triviais.

**Conceitos essenciais:**
- `Promise.resolve(valor)` cria Promise fulfilled instantaneamente
- `Promise.resolve(promise)` retorna a mesma Promise (se nativa)
- `Promise.resolve(thenable)` converte em Promise nativa
- `Promise.reject(razao)` cria Promise rejected (não unwrap)
- Handlers sempre executam assincronamente (microtask)
- Útil para normalização, cache, validação, testing

Dominar esses métodos é base para usar Promise combinators (`Promise.all()`, etc.) e escrever código assíncrono robusto.
