# Promise.race(): Primeira a Resolver/Rejeitar

## 🎯 Introdução e Definição

### Definição Conceitual

**Promise.race()** é um método estático que recebe um **array (ou iterável) de Promises** e retorna uma **única Promise** que resolve ou rejeita **assim que a primeira Promise do array finalizar** (resolver ou rejeitar), adotando o valor ou razão dessa Promise vencedora.

Conceitualmente, `Promise.race()` implementa **competição** - múltiplas Promises "competem", e a **primeira a cruzar a linha de chegada** (finalizar) determina o resultado, ignorando todas as outras.

O nome "race" (corrida) é literal - as Promises estão em uma corrida onde apenas a primeira que completar importa.

### Contexto Histórico e Motivação

`Promise.race()` foi incluído na especificação original de Promises (ES6/ES2015) para resolver cenários de **competição e timeout**:

**Problema 1: Timeouts**

Antes de `Promise.race()`, implementar timeout para operações assíncronas era complexo:

```javascript
// Sem Promise.race() - implementação manual de timeout
function fetchComTimeout(url, timeout) {
    return new Promise((resolve, reject) => {
        let resolvido = false;
        
        fetch(url).then(
            resultado => {
                if (!resolvido) {
                    resolvido = true;
                    resolve(resultado);
                }
            },
            erro => {
                if (!resolvido) {
                    resolvido = true;
                    reject(erro);
                }
            }
        );
        
        setTimeout(() => {
            if (!resolvido) {
                resolvido = true;
                reject(new Error('Timeout'));
            }
        }, timeout);
    });
}
```

Com `Promise.race()`, timeout é trivial:

```javascript
function fetchComTimeout(url, timeout) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )
    ]);
}
```

**Problema 2: Fastest Source**

Buscar dados de múltiplas fontes e usar a mais rápida:

```javascript
// Tentar múltiplos CDNs, usar o mais rápido
Promise.race([
    fetch('https://cdn1.com/biblioteca.js'),
    fetch('https://cdn2.com/biblioteca.js'),
    fetch('https://cdn3.com/biblioteca.js')
])
.then(resposta => console.log('CDN mais rápido respondeu'));
```

### Problema Fundamental que Resolve

`Promise.race()` resolve problemas de **timing e competição**:

**1. Timeouts:** Limitar tempo de espera de operações assíncronas
**2. Fastest wins:** Usar resultado da fonte mais rápida (múltiplos servidores, CDNs)
**3. Cancelamento simulado:** Criar mecanismo de cancelamento via timeout
**4. Fallback com latência:** Tentar fonte primária mas não esperar muito
**5. Debouncing assíncrono:** Primeira de múltiplas operações similares vence

**Ganho principal:** **Responsividade** - aplicação não espera indefinidamente.

```javascript
// Sem timeout: usuário espera indefinidamente se servidor travar
fetch('/dados-lentos');  // Pode nunca responder

// Com timeout via race(): usuário vê erro após tempo razoável
Promise.race([
    fetch('/dados-lentos'),
    timeout(5000)
])
.catch(() => mostrarErro('Servidor não respondeu'));
```

### Importância no Ecossistema

`Promise.race()` é **fundamental** porque:

- **UX:** Garante responsividade - usuário não espera eternamente
- **Resiliência:** Timeouts evitam travamento por dependências lentas
- **Performance:** Fastest-source pattern melhora latência percebida
- **Controle:** Permite limitar tempo de operações críticas
- **Debugging:** Timeouts facilitam identificar problemas de latência

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Primeira vence:** Resolve/rejeita com primeira Promise que finalizar
2. **Short-circuit extremo:** Resultado disponível assim que UMA completar
3. **Outras ignoradas:** Promises que completam depois são descartadas
4. **Estado adotado:** Promise retornada adota estado (fulfilled/rejected) da vencedora
5. **Competição pura:** Não espera outras, não agrega resultados

### Pilares Fundamentais

- **Competição:** Promises executam simultaneamente, primeira vence
- **Fastest-response:** Ideal para cenários onde rapidez é prioridade
- **Timeout pattern:** Base para implementar timeouts
- **Non-blocking:** Não espera todas, retorna assim que uma completa
- **Estado único:** Resultado é valor/razão da primeira, não array

### Visão Geral das Nuances

- **Outras Promises continuam:** Vencedora define resultado, mas outras não são canceladas
- **Empty array:** `Promise.race([])` fica pending para sempre
- **Reject conta:** Primeira a REJEITAR também vence (não precisa ser fulfilled)
- **No aggregation:** Diferente de `.all()`, não coleta resultados
- **Timing sensitivity:** Resultado pode variar entre execuções (não-determinístico)

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Mecânica de Execução

Quando você chama `Promise.race(iterable)`:

1. **Conversão** de iterable em array de Promises
2. **Normalização** via `Promise.resolve()` para valores não-Promise
3. **Promise container criada** (pending)
4. **Handlers anexados** a TODAS as Promises

**Para cada Promise:**
- Handler `.then(onFulfilled, onRejected)` é anexado
- **Quando PRIMEIRA resolve:** Promise container resolve com esse valor
- **Quando PRIMEIRA rejeita:** Promise container rejeita com essa razão
- **Demais são ignoradas:** Resultados de outras não afetam Promise container

**Importante:** Apenas primeira a completar afeta o resultado.

#### Pseudocódigo Conceitual

```javascript
function PromiseRace(promises) {
    return new Promise((resolve, reject) => {
        if (promises.length === 0) {
            // Promise fica pending para sempre
            return;
        }
        
        promises.forEach(promise => {
            Promise.resolve(promise).then(
                valor => resolve(valor),    // Primeira a resolver vence
                erro => reject(erro)        // Primeira a rejeitar vence
            );
        });
    });
}
```

**Detalhe crítico:** `resolve`/`reject` são chamados **apenas na primeira vez**. Chamadas subsequentes são ignoradas (Promises só mudam de estado uma vez).

### Princípios Conceituais

#### Fastest-Wins Semantics

`Promise.race()` implementa **"fastest wins"** (mais rápido vence):

```
Timeline:
t=0:   P1, P2, P3 iniciam
t=50:  P2 resolve ← VENCE
t=100: P1 resolve (ignorado)
t=200: P3 resolve (ignorado)

Resultado: valor de P2
```

Assim que uma completa, corrida acaba - outras são irrelevantes.

#### Non-Determinism

Resultado de `Promise.race()` pode **variar entre execuções**:

```javascript
// Cada execução pode ter vencedora diferente
for (let i = 0; i < 5; i++) {
    Promise.race([
        fetch('https://server1.com/dados'),  // Latência varia
        fetch('https://server2.com/dados'),
        fetch('https://server3.com/dados')
    ])
    .then(resposta => console.log('Vencedor:', resposta.url));
}
// Outputs podem variar: server1, server2, server2, server1, server3
```

Útil para **automaticamente escolher servidor mais rápido** sem hardcoding.

#### Timeout Pattern

`Promise.race()` é base para timeouts:

```javascript
function timeout(ms) {
    return new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Timeout de ${ms}ms`)), ms)
    );
}

// Operação vs timeout
Promise.race([
    operacaoLenta(),
    timeout(3000)
])
.catch(erro => {
    if (erro.message.includes('Timeout')) {
        console.error('Operação muito lenta');
    }
});
```

Se operação levar > 3s, timeout vence e rejeita.

---

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica

```javascript
const primeiraPromise = Promise.race([
    new Promise(resolve => setTimeout(() => resolve('Lenta'), 1000)),
    new Promise(resolve => setTimeout(() => resolve('Rápida'), 100)),
    new Promise(resolve => setTimeout(() => resolve('Média'), 500))
]);

primeiraPromise.then(resultado => {
    console.log(resultado);  // "Rápida" (100ms)
});
```

### Timeout Pattern - Uso Principal

**Padrão mais comum:** Limitar tempo de operação:

```javascript
function fetchComTimeout(url, ms) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), ms)
        )
    ]);
}

// Uso
fetchComTimeout('/api/dados', 5000)
    .then(resposta => resposta.json())
    .then(dados => console.log(dados))
    .catch(erro => {
        if (erro.message === 'Request timeout') {
            console.error('Servidor demorou demais');
        } else {
            console.error('Erro na requisição:', erro);
        }
    });
```

Se `/api/dados` levar > 5s, timeout vence e rejeita.

### Fastest Source Pattern

**Múltiplas fontes de dados, usar a mais rápida:**

```javascript
async function buscarDadosRapido() {
    return Promise.race([
        fetch('https://api-us.exemplo.com/dados'),
        fetch('https://api-eu.exemplo.com/dados'),
        fetch('https://api-asia.exemplo.com/dados')
    ])
    .then(resposta => {
        console.log('Servidor mais rápido:', resposta.url);
        return resposta.json();
    });
}
```

Automaticamente usa servidor geograficamente mais próximo ou menos carregado.

### First Rejection Wins Too

`Promise.race()` resolve/rejeita com **primeira a FINALIZAR**, não necessariamente sucesso:

```javascript
Promise.race([
    new Promise((_, reject) => setTimeout(() => reject('Erro rápido'), 100)),
    new Promise(resolve => setTimeout(() => resolve('Sucesso lento'), 500))
])
.then(resultado => {
    console.log('Sucesso:', resultado);  // NÃO EXECUTA
})
.catch(erro => {
    console.error('Erro:', erro);  // "Erro rápido" (100ms)
});
```

Se primeira a completar é rejeição, `Promise.race()` **rejeita**, mesmo que outras possam suceder depois.

### Empty Array - Pending Forever

```javascript
const raceVazia = Promise.race([]);

console.log(raceVazia);  // Promise { <pending> }

raceVazia.then(() => console.log('Nunca executa'));
```

Sem Promises para competir, fica pending eternamente. **Evite** passar array vazio.

### Outras Promises Não São Canceladas

**Importante:** Vencedora define resultado, mas **outras continuam executando**:

```javascript
let contador = 0;

Promise.race([
    delay(100).then(() => { contador++; return 'A'; }),  // Vence
    delay(200).then(() => { contador++; return 'B'; }),  // Continua
    delay(300).then(() => { contador++; return 'C'; })   // Continua
])
.then(resultado => {
    console.log('Resultado:', resultado);  // "A"
    console.log('Contador:', contador);    // 1
    
    setTimeout(() => {
        console.log('Contador final:', contador);  // 3 (todas executaram)
    }, 400);
});
```

Promises **não são canceláveis** - race apenas ignora resultados tardios.

### Retry com Timeout

Combinar retry com timeout:

```javascript
async function fetchComRetry(url, tentativas = 3, timeout = 5000) {
    for (let i = 0; i < tentativas; i++) {
        try {
            return await Promise.race([
                fetch(url),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), timeout)
                )
            ]);
        } catch (erro) {
            console.log(`Tentativa ${i + 1} falhou:`, erro.message);
            if (i === tentativas - 1) throw erro;
            await delay(1000);  // Espera antes de retry
        }
    }
}
```

### Debouncing Assíncrono

Simular debounce em operações assíncronas:

```javascript
let ultimaBusca;

function buscarComDebounce(termo) {
    const promessaAtual = fetch(`/search?q=${termo}`);
    ultimaBusca = promessaAtual;
    
    return promessaAtual.then(resultado => {
        // Só processa se ainda é a busca mais recente
        if (promessaAtual === ultimaBusca) {
            return resultado;
        }
        return null;  // Busca obsoleta, ignora
    });
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Promise.race()

**Use quando:**

1. **Timeouts:** Limitar tempo de espera de operações
2. **Fastest source:** Múltiplas fontes, quer a mais rápida
3. **User responsiveness:** Garantir resposta em tempo razoável
4. **Fallback com timing:** Tentar fonte primária mas não esperar muito
5. **Cancelamento simulado:** Simular cancelamento via timeout

**Exemplos ideais:**

**1. API com timeout:**
```javascript
async function chamarAPI(endpoint) {
    try {
        const resposta = await Promise.race([
            fetch(endpoint),
            timeout(10000)
        ]);
        return await resposta.json();
    } catch (erro) {
        if (erro.message.includes('Timeout')) {
            throw new Error('API não respondeu a tempo');
        }
        throw erro;
    }
}
```

**2. Geolocation com fallback:**
```javascript
function obterLocalizacao() {
    return Promise.race([
        navigator.geolocation.getCurrentPosition(),  // Preciso mas lento
        timeout(5000).then(() => estimarPorIP())     // Rápido mas impreciso
    ]);
}
```

**3. Cache vs Network:**
```javascript
async function buscarDados(chave) {
    return Promise.race([
        buscarDoCache(chave),      // Rápido
        fetch(`/api/${chave}`).then(r => r.json())  // Mais lento mas atualizado
    ]);
}
// Retorna cache se disponível, senão API
```

### Quando Evitar

**Evite quando:**

1. **Precisa de todos os resultados:** Use `Promise.all()`
2. **Quer resultados parciais:** Use `Promise.allSettled()`
3. **Precisa de primeira que SUCEDER (não primeira a completar):** Use `Promise.any()`
4. **Ordem de execução importa:** Use chaining sequencial

```javascript
// ❌ ERRADO - quer TODOS os dados
Promise.race([fetch1(), fetch2(), fetch3()])
    .then(dados => processar(dados));  // Só 1 dado!

// ✅ CORRETO
Promise.all([fetch1(), fetch2(), fetch3()])
    .then(([dados1, dados2, dados3]) => processar(dados1, dados2, dados3));
```

---

## ⚠️ Limitações e Considerações Teóricas

### Restrições Conceituais

**1. Não cancela Promises:**

```javascript
let requestFeito = false;

Promise.race([
    fetch('/dados').then(r => { requestFeito = true; return r; }),
    timeout(100)
])
.catch(() => console.log('Timeout'));

setTimeout(() => {
    console.log('Request completou:', requestFeito);  // Pode ser true!
}, 200);
```

Timeout vence, mas fetch **continua** e completa.

**2. Empty array fica pending:**

```javascript
const items = [];  // Array vazio por erro lógico
Promise.race(items).then(() => {
    console.log('Nunca executa');  // Pending para sempre
});
```

**Sempre valide** array não-vazio antes de race.

**3. Non-determinism:**

```javascript
// Resultado pode variar entre execuções
const resultado = await Promise.race([
    buscarDados1(),  // Latência variável
    buscarDados2()
]);
// Não há garantia de qual vence
```

Não use race se precisa de resultado **determinístico**.

### Armadilhas Comuns

**Armadilha 1: Assumir que só sucessos vencem**
```javascript
// ❌ Assume que race resolve
Promise.race([
    Promise.reject('Erro imediato'),
    delayedSuccess()
])
.then(resultado => processar(resultado))  // NÃO EXECUTA
.catch(erro => console.error(erro));       // "Erro imediato"
```

Primeira a REJEITAR também vence.

**Armadilha 2: Memory leak com Promises nunca resolvidas**
```javascript
// ❌ Se timeout vence, fetch não é limpo
for (let i = 0; i < 1000; i++) {
    Promise.race([
        fetch('/dados'),
        timeout(100)
    ]);
    // 1000 fetches potencialmente pendentes em background
}
```

Promises continuam consumindo recursos.

**Armadilha 3: Race condition com side effects**
```javascript
// ❌ Side effect em todas
let contador = 0;

Promise.race([
    fetch('/a').then(() => contador++),
    fetch('/b').then(() => contador++)
])
.then(() => {
    console.log(contador);  // Pode ser 1 ou 2 (race condition)
});
```

**Evite** side effects em Promises que podem perder a corrida.

---

## 🔗 Interconexões Conceituais

### Comparação com Outros Combinators

| Combinator | Resolve quando | Rejeita quando | Retorna |
|------------|----------------|----------------|---------|
| **Promise.all()** | TODAS resolverem | QUALQUER rejeitar | Array de valores |
| **Promise.allSettled()** | TODAS finalizarem | NUNCA | Array de status |
| **Promise.race()** | PRIMEIRA finalizar | PRIMEIRA rejeitar | Valor/razão da primeira |
| **Promise.any()** | PRIMEIRA resolver | TODAS rejeitarem | Valor da primeira resolvida |

### Pattern: Race + All

Combinar race para timeout + all para agregação:

```javascript
async function buscarComTimeout(urls, timeout) {
    const promises = urls.map(url => 
        Promise.race([
            fetch(url),
            timeoutReject(timeout)
        ])
    );
    
    return Promise.all(promises);  // Todas devem completar dentro do timeout
}
```

### Async/Await com Race

```javascript
// Promise.race() com async/await
async function operacaoComTimeout() {
    try {
        const resultado = await Promise.race([
            operacaoLenta(),
            timeout(5000)
        ]);
        return resultado;
    } catch (erro) {
        if (erro.message === 'Timeout') {
            console.error('Operação muito lenta');
        }
        throw erro;
    }
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. **Promise.all()** (todas)
2. **Promise.allSettled()** (todas com status)
3. **Promise.race()** (você está aqui - primeira a finalizar)
4. **Promise.any()** (primeira a RESOLVER, ignora rejeições)

### Preparação para Promise.any()

Diferença crítica entre `race()` e `any()`:

```javascript
// race: primeira a FINALIZAR (resolve ou reject)
Promise.race([
    Promise.reject('Erro rápido'),
    delayedSuccess()
])
// → Rejeita com "Erro rápido"

// any: primeira a RESOLVER (ignora rejects)
Promise.any([
    Promise.reject('Erro rápido'),
    delayedSuccess()
])
// → Resolve com resultado de delayedSuccess()
```

`any()` implementa **fallback** - tenta múltiplas fontes, primeira que suceder vence.

---

## 📚 Conclusão

**Promise.race()** é a ferramenta para **competição e timeouts**. Permite limitar tempo de operações assíncronas, usar fontes mais rápidas e garantir responsividade de aplicações.

**Conceitos essenciais:**
- Resolve/rejeita com **primeira Promise a finalizar**
- **Não cancela** outras Promises (continuam executando)
- Principal uso: **timeouts** e **fastest-source**
- Empty array fica **pending forever**
- Primeira a **REJEITAR** também vence (não só sucessos)
- **Non-deterministic** - resultado pode variar entre execuções

Dominar `Promise.race()` é essencial para criar aplicações **responsivas e resilientes** a latência.
