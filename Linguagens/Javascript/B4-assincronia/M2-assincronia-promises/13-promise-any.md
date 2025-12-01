# Promise.any(): Primeira a Resolver (Ignora Rejeições)

## 🎯 Introdução e Definição

### Definição Conceitual

**Promise.any()** é um método estático que recebe um **array (ou iterável) de Promises** e retorna uma **única Promise** que resolve quando **a primeira Promise do array resolver** (ter sucesso). Diferente de `Promise.race()`, `Promise.any()` **ignora rejeições** - só rejeita se **todas** as Promises falharem.

Quando resolve: Retorna o **valor da primeira Promise que teve sucesso**.  
Quando rejeita: Retorna um **AggregateError** contendo todas as razões de rejeição (só acontece se TODAS falharem).

Conceitualmente, `Promise.any()` implementa **fallback otimista** - tenta múltiplas fontes e usa a **primeira que suceder**, tolerando falhas parciais.

### Contexto Histórico e Motivação

`Promise.any()` foi adicionado ao JavaScript em **ES2021** como complemento a `Promise.race()`, resolvendo limitação crítica:

**Problema com Promise.race():**

```javascript
Promise.race([
    fetch('https://servidor-instavel.com/dados'),  // Pode falhar
    fetch('https://servidor-backup.com/dados')     // Backup confiável
])
.then(resposta => processar(resposta))
.catch(erro => {
    // Se servidor-instavel falhar primeiro, race REJEITA
    // Mesmo que backup fosse suceder!
});
```

`Promise.race()` resolve/rejeita com **primeira a FINALIZAR** - se primeira for rejeição, você perde, mesmo que outra fosse suceder logo depois.

**Cenários onde isso é problema:**

1. **Múltiplas fontes com fallback:** Servidor primário + backup
2. **Tentativas paralelas:** Múltiplas APIs que podem retornar os mesmos dados
3. **Redundância:** Tolerância a falhas parciais
4. **Best-effort retrieval:** Quer dados de qualquer fonte que funcione

**Solução: Promise.any()**

```javascript
Promise.any([
    fetch('https://servidor-instavel.com/dados'),  // Pode falhar
    fetch('https://servidor-backup.com/dados')     // Backup
])
.then(resposta => {
    // Resolve com PRIMEIRA QUE SUCEDER
    // Rejeições são ignoradas até todas falharem
    processar(resposta);
})
.catch(agregateError => {
    // Só executa se AMBAS falharem
    console.error('Todas as fontes falharam:', agregateError.errors);
});
```

### Problema Fundamental que Resolve

`Promise.any()` resolve problemas de **redundância e fallback**:

**1. Fallback automático:** Primeira fonte que funciona vence, falhas são ignoradas
**2. Redundância:** Múltiplas fontes independentes, qualquer uma serve
**3. Best-effort retrieval:** Dados de qualquer fonte confiável
**4. Resiliência a falhas parciais:** Sistema continua se pelo menos uma fonte funcionar
**5. Fastest successful response:** Diferente de race, ignora respostas de erro rápidas

**Exemplo prático - Carregar recurso de múltiplos CDNs:**

```javascript
// Tentar 3 CDNs, usar primeiro que funcionar
Promise.any([
    fetch('https://cdn1.exemplo.com/biblioteca.js'),  // Pode estar offline
    fetch('https://cdn2.exemplo.com/biblioteca.js'),  // Pode estar lento
    fetch('https://cdn3.exemplo.com/biblioteca.js')   // Backup
])
.then(resposta => {
    console.log('CDN funcionou:', resposta.url);
    carregarBiblioteca(resposta);
})
.catch(agregateError => {
    console.error('Todos os CDNs falharam:', agregateError.errors);
    usarVersaoLocal();
});
```

Se CDN1 falhar (404), `any()` **ignora** e continua esperando CDN2 e CDN3. Só falha se TODOS falharem.

### Importância no Ecossistema

`Promise.any()` é **crucial** porque:

- **Resiliência:** Sistemas toleram falhas parciais automaticamente
- **Redundância:** Implementa padrões de alta disponibilidade facilmente
- **UX:** Usuário recebe dados da primeira fonte que funcionar
- **Latência:** Combina rapidez + confiabilidade (fastest successful)
- **Complemento perfeito:** Preenche gap entre `race()` (primeira qualquer) e `all()` (todas devem suceder)

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Primeira RESOLUÇÃO vence:** Ignora rejeições até encontrar sucesso
2. **Rejeita só se TODAS falharem:** Retorna AggregateError com todas as razões
3. **Fallback automático:** Implementa padrão de redundância naturalmente
4. **Fastest successful:** Diferente de race, rejeições rápidas não afetam
5. **Order-agnostic:** Qualquer Promise que resolver primeiro vence

### Pilares Fundamentais

- **Otimismo:** Assume que pelo menos uma sucederá
- **Tolerância a falhas:** Rejeições individuais não afetam resultado
- **Fallback chain:** Implementa fallbacks sem código explícito
- **Short-circuit em sucesso:** Para de esperar após primeira resolução
- **AggregateError:** Tipo especial de erro contendo múltiplas causas

### Visão Geral das Nuances

- **AggregateError.errors:** Array de todas as razões de rejeição
- **Empty array:** `Promise.any([])` rejeita com AggregateError vazio
- **Só Promises rejeitadas:** Se todas rejeitam, erro agrega todas as razões
- **Não cancela outras:** Primeira resolução define resultado, outras continuam
- **ES2021:** Feature relativamente nova, verificar compatibilidade

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Mecânica de Execução

Quando você chama `Promise.any(iterable)`:

1. **Conversão** de iterable em array de Promises
2. **Normalização** via `Promise.resolve()` para valores não-Promise
3. **Promise container criada** (pending)
4. **Contador de rejeições** inicializado em 0
5. **Array de erros** para coletar rejeições

**Para cada Promise:**
- Handler `.then(onFulfilled, onRejected)` é anexado
- **Se RESOLVE:** Promise container **imediatamente resolve** com esse valor
- **Se REJEITA:** Erro armazenado em array, contador incrementado
  - Se contador === total de Promises: **todas rejeitaram** → container rejeita com AggregateError

**Diferença de Promise.race():** Rejeições **não terminam** a espera.

#### Pseudocódigo Conceitual

```javascript
function PromiseAny(promises) {
    return new Promise((resolve, reject) => {
        const erros = [];
        let rejeitadas = 0;
        const total = promises.length;
        
        if (total === 0) {
            reject(new AggregateError([], 'All promises were rejected'));
            return;
        }
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(
                valor => resolve(valor),  // PRIMEIRA resolução vence
                erro => {
                    erros[index] = erro;
                    rejeitadas++;
                    if (rejeitadas === total) {
                        reject(new AggregateError(erros, 'All promises were rejected'));
                    }
                }
            );
        });
    });
}
```

**Conceito-chave:** Resolução termina imediatamente. Rejeições são acumuladas até todas falharem.

### Princípios Conceituais

#### Optimistic Fallback

`Promise.any()` implementa **fallback otimista** - tenta múltiplas opções simultaneamente:

```
Tentativas: [Primária, Backup1, Backup2]

Cenário 1: Primária sucede      → Usa Primária (ignora backups)
Cenário 2: Primária falha, Backup1 sucede → Usa Backup1
Cenário 3: Todas falham         → AggregateError
```

Sempre tenta **todas simultaneamente**, mas usa primeira que funciona.

#### Fastest Successful Response

Diferença crítica de `Promise.race()`:

```javascript
// race: primeira a FINALIZAR (sucesso ou erro)
Promise.race([
    Promise.reject('Erro rápido'),  // 10ms - VENCE
    delayedSuccess()                // 100ms
])
// → Rejeita com "Erro rápido"

// any: primeira a RESOLVER (ignora erros)
Promise.any([
    Promise.reject('Erro rápido'),  // 10ms - IGNORADO
    delayedSuccess()                // 100ms - VENCE
])
// → Resolve com resultado de delayedSuccess()
```

`any()` espera por **primeira resolução**, pulando rejeições.

#### AggregateError

Tipo especial de erro (ES2021) que **agrega múltiplos erros**:

```javascript
try {
    await Promise.any([
        Promise.reject('Erro A'),
        Promise.reject('Erro B'),
        Promise.reject('Erro C')
    ]);
} catch (agregateError) {
    console.log(agregateError.message);  // "All promises were rejected"
    console.log(agregateError.errors);   // ['Erro A', 'Erro B', 'Erro C']
}
```

`AggregateError` tem propriedade `.errors` (array) com todas as causas.

---

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica

```javascript
const primeiroSucesso = await Promise.any([
    Promise.reject('Falha 1'),
    Promise.resolve('Sucesso!'),
    Promise.reject('Falha 2')
]);

console.log(primeiroSucesso);  // "Sucesso!"
```

### Fallback de Múltiplas Fontes

**Padrão principal:** Tentar múltiplas APIs, usar primeira que funcionar:

```javascript
async function buscarDados(id) {
    try {
        return await Promise.any([
            fetch(`https://api-primary.com/item/${id}`).then(r => r.json()),
            fetch(`https://api-backup1.com/item/${id}`).then(r => r.json()),
            fetch(`https://api-backup2.com/item/${id}`).then(r => r.json())
        ]);
    } catch (agregateError) {
        console.error('Todas as APIs falharam:', agregateError.errors);
        throw new Error('Serviço indisponível');
    }
}
```

Se API primária falhar (erro 500, timeout, etc.), backups são tentados automaticamente.

### CDN Fallback

```javascript
async function carregarBiblioteca() {
    return Promise.any([
        fetch('https://cdn.jsdelivr.net/biblioteca.js'),
        fetch('https://unpkg.com/biblioteca.js'),
        fetch('https://cdnjs.cloudflare.com/biblioteca.js'),
        fetch('/local/biblioteca.js')  // Fallback local
    ])
    .then(resposta => resposta.text())
    .catch(() => {
        throw new Error('Não foi possível carregar biblioteca de nenhuma fonte');
    });
}
```

### Comparação: race() vs any()

```javascript
const promises = [
    new Promise((_, reject) => setTimeout(() => reject('Erro 1'), 100)),
    new Promise(resolve => setTimeout(() => resolve('Sucesso'), 200)),
    new Promise((_, reject) => setTimeout(() => reject('Erro 2'), 300))
];

// race: primeira a finalizar (erro ou sucesso)
Promise.race(promises)
    .then(resultado => console.log('Race:', resultado))
    .catch(erro => console.error('Race erro:', erro));
// Output: "Race erro: Erro 1" (100ms)

// any: primeira a RESOLVER (ignora erros)
Promise.any(promises)
    .then(resultado => console.log('Any:', resultado))
    .catch(erro => console.error('Any erro:', erro));
// Output: "Any: Sucesso" (200ms)
```

`any()` **ignora** primeiro erro e espera pelo sucesso.

### AggregateError - Todas Falham

```javascript
Promise.any([
    fetch('/endpoint1'),  // 404
    fetch('/endpoint2'),  // 500
    fetch('/endpoint3')   // Timeout
])
.catch(agregateError => {
    console.log('Tipo:', agregateError.constructor.name);  // "AggregateError"
    console.log('Mensagem:', agregateError.message);        // "All promises were rejected"
    console.log('Total de erros:', agregateError.errors.length);  // 3
    
    agregateError.errors.forEach((erro, i) => {
        console.log(`Erro ${i + 1}:`, erro);
    });
});
```

### Empty Array

```javascript
Promise.any([])
    .catch(agregateError => {
        console.log(agregateError.message);  // "All promises were rejected"
        console.log(agregateError.errors);   // []
    });
```

Array vazio **rejeita imediatamente** com AggregateError vazio.

### Retry Pattern com Múltiplas Estratégias

```javascript
async function buscarComFallbacks(id) {
    return Promise.any([
        // Estratégia 1: API rápida (pode ser instável)
        fetch(`https://fast-api.com/item/${id}`).then(r => r.json()),
        
        // Estratégia 2: API lenta mas confiável (com delay)
        delay(200).then(() => fetch(`https://reliable-api.com/item/${id}`).then(r => r.json())),
        
        // Estratégia 3: Cache local (instantâneo mas pode estar desatualizado)
        Promise.resolve(buscarDoCache(id))
            .then(cached => {
                if (!cached) throw new Error('Cache miss');
                return cached;
            })
    ])
    .catch(agregateError => {
        console.error('Todas as estratégias falharam:', agregateError.errors);
        throw new Error('Dados indisponíveis');
    });
}
```

### Pattern: any() + all()

Combinar `any()` para fallback + `all()` para agregação:

```javascript
// Buscar dados de múltiplos recursos, cada um com fallbacks
async function carregarDashboard() {
    return Promise.all([
        // Cada recurso tem fallbacks via any()
        Promise.any([fetch('/usuario-primario'), fetch('/usuario-backup')]),
        Promise.any([fetch('/pedidos-primario'), fetch('/pedidos-backup')]),
        Promise.any([fetch('/produtos-primario'), fetch('/produtos-backup')])
    ]);
}
// all() garante que TODOS os recursos carreguem
// any() garante que cada recurso tenta fallbacks
```

### Diagnosticando Falhas

```javascript
async function buscarComDiagnostico(urls) {
    try {
        return await Promise.any(urls.map(url => fetch(url)));
    } catch (agregateError) {
        const diagnostico = agregateError.errors.map((erro, i) => ({
            url: urls[i],
            erro: erro.message,
            tipo: erro.constructor.name
        }));
        
        console.table(diagnostico);
        /*
        ┌─────────┬──────────────────────────┬──────────────────┬───────────┐
        │ (index) │           url            │       erro       │   tipo    │
        ├─────────┼──────────────────────────┼──────────────────┼───────────┤
        │    0    │ 'https://api1.com/dados' │ 'Failed to fetch'│  'Error'  │
        │    1    │ 'https://api2.com/dados' │ 'Timeout'        │  'Error'  │
        │    2    │ 'https://api3.com/dados' │ 'Not Found'      │  'Error'  │
        └─────────┴──────────────────────────┴──────────────────┴───────────┘
        */
        
        throw new Error('Todas as fontes falharam - ver diagnóstico');
    }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Promise.any()

**Use quando:**

1. **Múltiplas fontes equivalentes:** Qualquer uma serve, quer a mais rápida
2. **Fallback automático:** Fonte primária + backups
3. **Redundância:** Tolerância a falhas parciais
4. **Fastest successful:** Quer rapidez mas rejeições não contam
5. **Best-effort retrieval:** Qualquer fonte confiável serve

**Exemplos ideais:**

**1. Múltiplos servidores geográficos:**
```javascript
function buscarDoServidorMaisProximo() {
    return Promise.any([
        fetch('https://us-east.api.com/dados'),
        fetch('https://eu-west.api.com/dados'),
        fetch('https://asia-south.api.com/dados')
    ])
    .then(r => r.json());
}
```

**2. WebSocket com fallbacks:**
```javascript
async function conectarWebSocket() {
    return Promise.any([
        conectar('wss://ws-primary.com'),
        delay(1000).then(() => conectar('wss://ws-backup1.com')),
        delay(2000).then(() => conectar('wss://ws-backup2.com'))
    ]);
}
```

**3. Autenticação com múltiplos providers:**
```javascript
async function login() {
    return Promise.any([
        loginComGoogle(),
        loginComGitHub(),
        loginComEmail()
    ]);
}
// Primeiro método que usuário completar vence
```

### Quando Usar Promise.race() em vez de any()

**Use Promise.race() quando:**

1. **Timeout:** Quer abortar na primeira finalização (erro ou sucesso)
2. **Fastest response:** Rejeição rápida é informação válida
3. **Cancelamento:** Primeira a completar define comportamento

```javascript
// race: timeout deve interromper
Promise.race([
    operacaoLenta(),
    timeout(5000)
])
// Timeout vence → rejeita (correto)

// any: timeout seria ignorado se operação suceder depois
Promise.any([
    operacaoLenta(),
    timeout(5000)
])
// Timeout é rejeição, any ignora e espera operação → errado para timeout
```

---

## ⚠️ Limitações e Considerações Teóricas

### Restrições Conceituais

**1. AggregateError pode ter muitos erros:**

```javascript
// 1000 Promises rejeitadas
const promises = Array.from({ length: 1000 }, () => Promise.reject('Erro'));

Promise.any(promises)
    .catch(agregateError => {
        console.log(agregateError.errors.length);  // 1000
        // Muito overhead de memória
    });
```

AggregateError armazena **todos** os erros - potencial problema de memória.

**2. Não cancela Promises:**

```javascript
let contador = 0;

Promise.any([
    delay(100).then(() => { contador++; return 'A'; }),  // Vence
    delay(200).then(() => { contador++; return 'B'; }),  // Continua
    delay(300).then(() => { contador++; return 'C'; })   // Continua
])
.then(resultado => {
    console.log('Resultado:', resultado);  // "A"
    
    setTimeout(() => {
        console.log('Contador:', contador);  // 3 - todas executaram
    }, 400);
});
```

Primeira resolução define resultado, mas **outras continuam**.

**3. ES2021 - Compatibilidade:**

`Promise.any()` é relativamente novo (2021). Verificar compatibilidade:

```javascript
if (typeof Promise.any === 'undefined') {
    // Polyfill ou alternativa
}
```

### Armadilhas Comuns

**Armadilha 1: Esquecer de tratar AggregateError**
```javascript
// ❌ Sem .catch()
Promise.any([...])
    .then(resultado => processar(resultado));
// Se todas falharem, UnhandledPromiseRejection

// ✅ Com .catch()
Promise.any([...])
    .then(resultado => processar(resultado))
    .catch(agregateError => {
        console.error('Todas falharam:', agregateError.errors);
    });
```

**Armadilha 2: Assumir ordem de tentativa**
```javascript
// ❌ Assume que tenta em ordem
Promise.any([
    tentarPrimeiro(),
    tentarSegundo(),
    tentarTerceiro()
]);
// Todas INICIAM simultaneamente, não sequencialmente

// ✅ Se quer ordem, use loop com await
for (const tentativa of [tentarPrimeiro, tentarSegundo, tentarTerceiro]) {
    try {
        return await tentativa();
    } catch {}
}
```

**Armadilha 3: Usar quando Promise.race() é mais apropriado**
```javascript
// ❌ any() para timeout (errado)
Promise.any([
    operacao(),
    timeout(5000)
])
// Timeout é rejeição, any ignora - operação continua indefinidamente

// ✅ race() para timeout (correto)
Promise.race([
    operacao(),
    timeout(5000)
])
// Timeout vence e rejeita imediatamente
```

---

## 🔗 Interconexões Conceituais

### Comparação Completa de Combinators

| Combinator | Resolve quando | Rejeita quando | Ignora erros? | Retorna |
|------------|----------------|----------------|---------------|---------|
| **all()** | TODAS resolverem | QUALQUER rejeitar | Não | Array de valores |
| **allSettled()** | TODAS finalizarem | NUNCA | N/A | Array de status |
| **race()** | PRIMEIRA finalizar | PRIMEIRA rejeitar | Não | Valor/razão da primeira |
| **any()** | PRIMEIRA resolver | TODAS rejeitarem | Sim | Valor da primeira resolvida |

### Pattern: Cascading Fallbacks

```javascript
// Nível 1: any() para cada recurso
const recurso1 = Promise.any([primario1(), backup1()]);
const recurso2 = Promise.any([primario2(), backup2()]);

// Nível 2: all() para agregar recursos
const dados = await Promise.all([recurso1, recurso2]);
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. **Promise.all()** (todas devem suceder)
2. **Promise.allSettled()** (todas, com status)
3. **Promise.race()** (primeira a finalizar)
4. **Promise.any()** (você está aqui - primeira a resolver)
5. **Promisification** (converter callbacks em Promises)
6. **Advanced Patterns** (retry, circuit breaker, etc.)

### Preparação para Patterns Avançados

`Promise.any()` é base para padrões de resiliência:

**Retry with multiple strategies:**
```javascript
function retryWithStrategies(operacao, estrategias) {
    return Promise.any(
        estrategias.map(estrategia => estrategia(operacao))
    );
}
```

**Circuit breaker:**
```javascript
function circuitBreaker(primario, fallback) {
    return Promise.any([primario(), fallback()])
        .catch(() => modoOffline());
}
```

---

## 📚 Conclusão

**Promise.any()** é a ferramenta para **fallback otimista e redundância**. Permite tentar múltiplas fontes simultaneamente e usar a primeira que funcionar, tolerando falhas parciais graciosamente.

**Conceitos essenciais:**
- Resolve com **primeira Promise que resolver**
- **Ignora rejeições** até todas falharem
- Rejeita com **AggregateError** (contém todas as razões) se TODAS falharem
- Ideal para **fallbacks automáticos** e **múltiplas fontes equivalentes**
- Diferente de `race()`: rejeições rápidas **não** terminam a espera
- **Fastest successful response** - combina rapidez + confiabilidade

Dominar `Promise.any()` é essencial para construir sistemas **resilientes com fallbacks automáticos**.
