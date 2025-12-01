# Promise.all(): Execução Paralela de Promises

## 🎯 Introdução e Definição

### Definição Conceitual

**Promise.all()** é um método estático que recebe um **array (ou iterável) de Promises** e retorna uma **única Promise** que resolve quando **todas** as Promises do array resolverem, ou rejeita quando **qualquer uma** rejeitar.

O resultado é uma Promise que resolve com um **array dos valores resolvidos**, na mesma ordem do array original, ou rejeita com a **razão da primeira Promise que falhou**.

Conceitualmente, `Promise.all()` implementa **coordenação paralela** - executa múltiplas operações assíncronas **simultaneamente** e espera que todas concluam antes de prosseguir, diferente do chaining que é **sequencial**.

### Contexto Histórico e Motivação

Antes de `Promise.all()`, executar operações paralelas exigia **contadores manuais** e código complexo:

```javascript
// Sem Promise.all() - padrão manual (callback hell paralelo)
let resultados = [];
let concluidas = 0;
const total = 3;

buscar1((erro, resultado1) => {
    if (erro) return tratarErro(erro);
    resultados[0] = resultado1;
    concluidas++;
    if (concluidas === total) processar(resultados);
});

buscar2((erro, resultado2) => {
    if (erro) return tratarErro(erro);
    resultados[1] = resultado2;
    concluidas++;
    if (concluidas === total) processar(resultados);
});

buscar3((erro, resultado3) => {
    if (erro) return tratarErro(erro);
    resultados[2] = resultado3;
    concluidas++;
    if (concluidas === total) processar(resultados);
});
```

Problemas deste padrão:
- **Contador manual** de operações concluídas
- **Array compartilhado** com race conditions potenciais
- **Código duplicado** para cada operação
- **Tratamento de erro complicado** (uma falha deve cancelar tudo?)
- **Difícil compor** ou reutilizar

`Promise.all()` elimina toda essa complexidade:

```javascript
Promise.all([buscar1(), buscar2(), buscar3()])
    .then(([resultado1, resultado2, resultado3]) => {
        processar([resultado1, resultado2, resultado3]);
    })
    .catch(tratarErro);
```

### Problema Fundamental que Resolve

`Promise.all()` resolve problemas críticos de **coordenação paralela**:

**1. Execução Simultânea:** Múltiplas operações assíncronas ao mesmo tempo (não sequencial)
**2. Sincronização:** Aguardar TODAS concluírem antes de prosseguir
**3. Agregação de Resultados:** Coletar resultados em array ordenado
**4. Fail-Fast:** Se uma falhar, todo conjunto falha imediatamente
**5. Composição:** Tratar múltiplas operações como uma única operação

**Ganho de Performance:**

```javascript
// SEQUENCIAL (Promise chaining) - ~3 segundos
fetch('/dados1')  // 1 segundo
    .then(r => r.json())
    .then(() => fetch('/dados2'))  // 1 segundo
    .then(r => r.json())
    .then(() => fetch('/dados3'))  // 1 segundo
    .then(r => r.json())
// Total: 1 + 1 + 1 = 3 segundos

// PARALELO (Promise.all) - ~1 segundo
Promise.all([
    fetch('/dados1').then(r => r.json()),  // 1 segundo
    fetch('/dados2').then(r => r.json()),  // 1 segundo (simultâneo)
    fetch('/dados3').then(r => r.json())   // 1 segundo (simultâneo)
])
// Total: max(1, 1, 1) = 1 segundo
```

**Redução de 3x no tempo total** quando operações podem ser paralelas.

### Importância no Ecossistema

`Promise.all()` é **fundamental** porque:

- **Performance:** Paralelismo é essencial para aplicações responsivas
- **Padrão universal:** Todas as aplicações modernas têm cenários paralelos
- **Composição:** Base para padrões como "prefetch", "batch loading", etc.
- **Data fetching:** Crucial em frameworks (React, Vue, etc.) para carregar dados
- **Coordenação:** Foundation para orquestração de microservices

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Execução paralela:** Promises iniciam simultaneamente, não sequencialmente
2. **All-or-nothing:** TODAS devem resolver ou TODO conjunto falha
3. **Fail-fast:** Primeira rejeição termina tudo imediatamente
4. **Ordem preservada:** Array de resultados mantém ordem do input
5. **Normalização de valores:** Valores não-Promise são convertidos via `Promise.resolve()`

### Pilares Fundamentais

- **Simultaneidade:** Operações executam concorrentemente (no Event Loop)
- **Sincronização:** Resultado só disponível quando TODAS completarem
- **Atomicidade:** Conjunto de operações é tratado como unidade indivisível
- **Short-circuit:** Primeira falha cancela espera (mas não cancela Promises em execução)
- **Composição:** Resultado é Promise, pode encadear com `.then()`

### Visão Geral das Nuances

- **Não cancela Promises:** Rejeição não para Promises ainda executando
- **Order matters:** Ordem do array de input determina ordem do output
- **Empty array:** `Promise.all([])` resolve imediatamente com `[]`
- **Iterable support:** Aceita qualquer iterável (array, Set, Map.values(), etc.)
- **Timing:** Resultado disponível quando última Promise resolver

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Mecânica de Execução

Quando você chama `Promise.all(iterable)`:

1. **Conversão de iterable em array** de Promises
2. **Normalização:** Valores não-Promise são convertidos via `Promise.resolve()`
3. **Promise container criada:** Promise que será retornada
4. **Contador interno:** Rastreia quantas Promises ainda estão pendentes
5. **Array de resultados:** Pré-alocado com tamanho do input

**Para cada Promise:**
- Handler `.then()` é anexado
- Quando resolve: valor é armazenado no índice correto do array de resultados
- Contador de pendentes é decrementado
- Se contador chega a 0: Promise container resolve com array de resultados

**Se qualquer Promise rejeita:**
- Promise container **imediatamente** rejeita com a razão
- Outras Promises continuam executando (mas resultados são ignorados)

#### Pseudocódigo Conceitual

```javascript
function PromiseAll(promises) {
    return new Promise((resolve, reject) => {
        const resultados = [];
        let pendentes = promises.length;
        
        if (pendentes === 0) {
            resolve([]);
            return;
        }
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(
                valor => {
                    resultados[index] = valor;
                    pendentes--;
                    if (pendentes === 0) {
                        resolve(resultados);
                    }
                },
                erro => {
                    reject(erro);  // Primeira rejeição termina tudo
                }
            );
        });
    });
}
```

### Princípios Conceituais

#### Simultaneidade vs Paralelismo

**Importante:** JavaScript é **single-threaded**. `Promise.all()` não cria threads paralelas, mas **simultaneidade**:

- **Paralelismo:** Múltiplas operações em CPUs diferentes (true parallelism)
- **Simultaneidade:** Múltiplas operações intercaladas no Event Loop

```javascript
Promise.all([
    fetch('/api1'),  // Request inicia
    fetch('/api2'),  // Request inicia (simultâneo, não paralelo)
    fetch('/api3')   // Request inicia
]);
// Todas as requisições HTTP são enviadas "ao mesmo tempo"
// Event Loop gerencia respostas à medida que chegam
```

Para operações **I/O** (rede, arquivo), simultaneidade é suficiente e eficiente.

#### Fail-Fast Semantics

`Promise.all()` implementa **fail-fast** (falha rápida):

```
Promises: [P1, P2, P3, P4, P5]

Timeline:
t=0:   Todas iniciam
t=100: P1 resolve
t=200: P3 REJEITA ← Promise.all rejeita AQUI
t=300: P2 resolve (ignorado)
t=400: P4 resolve (ignorado)
t=500: P5 resolve (ignorado)
```

Primeira rejeição **termina** a espera, mas **não cancela** Promises ainda executando.

#### Order Preservation

Array de resultados mantém **mesma ordem** do input:

```javascript
Promise.all([
    delay(300).then(() => 'C'),  // Resolve por último
    delay(100).then(() => 'A'),  // Resolve primeiro
    delay(200).then(() => 'B')   // Resolve segundo
])
.then(resultados => {
    console.log(resultados);  // ['C', 'A', 'B'] - ordem do INPUT
});
```

Isso permite **destructuring** confiável.

---

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica

```javascript
const promises = [
    fetch('/usuario'),
    fetch('/pedidos'),
    fetch('/produtos')
];

Promise.all(promises)
    .then(([usuario, pedidos, produtos]) => {
        // Todas as 3 requisições concluídas
        console.log(usuario, pedidos, produtos);
    })
    .catch(erro => {
        // Qualquer uma falhou
        console.error('Erro em alguma requisição:', erro);
    });
```

### Execução Paralela - Performance

Comparação direta **sequencial vs paralelo**:

```javascript
// ❌ SEQUENCIAL - 3 segundos
async function carregarSequencial() {
    const usuario = await fetch('/usuario').then(r => r.json());    // 1s
    const pedidos = await fetch('/pedidos').then(r => r.json());    // 1s
    const produtos = await fetch('/produtos').then(r => r.json());  // 1s
    
    return { usuario, pedidos, produtos };
}

// ✅ PARALELO - 1 segundo
async function carregarParalelo() {
    const [usuario, pedidos, produtos] = await Promise.all([
        fetch('/usuario').then(r => r.json()),   // 1s (simultâneo)
        fetch('/pedidos').then(r => r.json()),   // 1s (simultâneo)
        fetch('/produtos').then(r => r.json())   // 1s (simultâneo)
    ]);
    
    return { usuario, pedidos, produtos };
}
```

**Ganho:** 3x mais rápido quando operações são independentes.

### Fail-Fast Behavior

Primeira rejeição **termina imediatamente**:

```javascript
Promise.all([
    delay(100).then(() => 'OK'),
    delay(50).then(() => { throw new Error('Falha rápida'); }),
    delay(200).then(() => 'OK'),
])
.then(resultados => {
    console.log('Sucesso:', resultados);  // NÃO executa
})
.catch(erro => {
    console.error('Erro:', erro.message);  // "Falha rápida" (em ~50ms)
});
```

Promise que rejeita em 50ms **termina** o `Promise.all()`, mesmo as outras ainda estando pendentes.

**Importante:** Promises **não são canceladas**:

```javascript
Promise.all([
    fetch('/dados1'),  // Continua executando
    fetch('/dados2').then(() => { throw new Error('Falha'); }),
    fetch('/dados3')   // Continua executando
])
.catch(erro => {
    // Promise.all rejeitou, mas /dados1 e /dados3 ainda estão carregando
    // Requests HTTP não são cancelados
});
```

### Valores Não-Promise

`Promise.all()` aceita **valores mistos** (Promise e não-Promise):

```javascript
Promise.all([
    42,                              // Valor direto
    Promise.resolve('texto'),        // Promise
    fetch('/dados').then(r => r.json()),  // Promise de fetch
    [1, 2, 3]                        // Array
])
.then(([num, texto, dados, arr]) => {
    console.log(num);    // 42
    console.log(texto);  // "texto"
    console.log(dados);  // { objeto do fetch }
    console.log(arr);    // [1, 2, 3]
});
```

Valores não-Promise são **automaticamente convertidos** via `Promise.resolve()`.

### Empty Array

```javascript
Promise.all([])
    .then(resultados => {
        console.log(resultados);  // [] - resolve imediatamente
    });
```

Array vazio resolve **sincronamente** (em microtask) com array vazio.

### Destructuring de Resultados

Padrão comum para extrair resultados:

```javascript
Promise.all([buscarUsuario(), buscarConfig(), buscarDados()])
    .then(([usuario, config, dados]) => {
        // Destructuring direto - ordem preservada
        console.log('Usuário:', usuario.nome);
        console.log('Config:', config.tema);
        console.log('Dados:', dados.length);
    });
```

### Nested Promise.all()

Você pode **aninhar** `Promise.all()` para hierarquias:

```javascript
Promise.all([
    fetch('/usuario').then(r => r.json()),
    Promise.all([  // Nested
        fetch('/pedido1').then(r => r.json()),
        fetch('/pedido2').then(r => r.json())
    ]),
    fetch('/config').then(r => r.json())
])
.then(([usuario, [pedido1, pedido2], config]) => {
    // usuario: objeto
    // pedido1, pedido2: objetos
    // config: objeto
});
```

Útil para agrupar operações relacionadas.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Promise.all()

**Use quando:**

1. **Operações independentes:** Nenhuma depende do resultado de outra
2. **Performance crítica:** Paralelismo reduz tempo total
3. **All-or-nothing:** TODAS devem suceder ou conjunto falha
4. **Agregação de dados:** Precisa de múltiplos dados simultaneamente

**Exemplos ideais:**

**1. Carregar múltiplos recursos:**
```javascript
async function inicializarApp() {
    const [usuario, config, dados] = await Promise.all([
        fetch('/api/usuario').then(r => r.json()),
        fetch('/api/config').then(r => r.json()),
        fetch('/api/dados').then(r => r.json())
    ]);
    
    inicializar({ usuario, config, dados });
}
```

**2. Batch operations:**
```javascript
async function atualizarTodos(ids) {
    const promises = ids.map(id => atualizarItem(id));
    await Promise.all(promises);
    console.log('Todos atualizados!');
}
```

**3. Prefetch de recursos:**
```javascript
Promise.all([
    fetch('/imagem1.jpg'),
    fetch('/imagem2.jpg'),
    fetch('/imagem3.jpg')
])
.then(() => {
    console.log('Todas as imagens em cache');
    mostrarGaleria();
});
```

### Quando Evitar

**Evite quando:**

1. **Operações dependentes:** Uma precisa do resultado de outra (use chaining)
2. **Quer resultados parciais:** Se uma falhar, quer resultados das que sucederam (use `Promise.allSettled()`)
3. **Primeira que resolver:** Quer apenas a primeira (use `Promise.race()`)
4. **Primeira que suceder:** Quer primeira que NÃO falhar (use `Promise.any()`)

```javascript
// ❌ ERRADO - operações dependentes
Promise.all([
    buscarUsuario(id),
    buscarPedidos(usuario.id)  // Erro! usuario não existe ainda
]);

// ✅ CORRETO - chaining
buscarUsuario(id)
    .then(usuario => buscarPedidos(usuario.id));
```

### Padrões de Uso

**1. Map + Promise.all:**
```javascript
const ids = [1, 2, 3, 4, 5];

const dados = await Promise.all(
    ids.map(id => fetch(`/item/${id}`).then(r => r.json()))
);
```

**2. Limitar concorrência (padrão avançado):**
```javascript
// Processar em lotes de 5
async function processarEmLotes(items, batchSize = 5) {
    const resultados = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
        const lote = items.slice(i, i + batchSize);
        const resultadosLote = await Promise.all(
            lote.map(item => processar(item))
        );
        resultados.push(...resultadosLote);
    }
    
    return resultados;
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Restrições Conceituais

**1. Fail-fast não cancela operações:**

```javascript
let contador = 0;

Promise.all([
    delay(100).then(() => { contador++; return 'OK'; }),
    Promise.reject('Erro'),  // Rejeita imediatamente
    delay(200).then(() => { contador++; return 'OK'; })
])
.catch(() => {
    setTimeout(() => {
        console.log(contador);  // 2 - ambas completaram!
    }, 300);
});
```

Promises **continuam executando** mesmo após rejeição.

**2. Não há controle de concorrência:**

```javascript
// Todas as 1000 requisições iniciam SIMULTANEAMENTE
const ids = Array.from({ length: 1000 }, (_, i) => i);
Promise.all(ids.map(id => fetch(`/item/${id}`)));
// Pode sobrecarregar servidor ou limite de conexões do navegador
```

Solução: Implementar batching/throttling manualmente.

**3. Ordem de resolução ≠ ordem de conclusão:**

```javascript
Promise.all([
    delay(300).then(() => console.log('Concluí primeiro!')),
    delay(100).then(() => console.log('Concluí terceiro!')),
    delay(200).then(() => console.log('Concluí segundo!'))
])
.then(() => console.log('Todas concluídas'));

// Output:
// "Concluí terceiro!"  (100ms)
// "Concluí segundo!"   (200ms)
// "Concluí primeiro!"  (300ms)
// "Todas concluídas"   (300ms)
```

Array de resultados mantém ordem do **input**, não de **conclusão**.

### Armadilhas Comuns

**Armadilha 1: Esquecer await/then**
```javascript
// ❌ Não espera completar
function carregar() {
    Promise.all([fetch1(), fetch2()]);
    console.log('Carregado!');  // Executa ANTES das Promises
}

// ✅ Aguarda
async function carregar() {
    await Promise.all([fetch1(), fetch2()]);
    console.log('Carregado!');  // Executa DEPOIS
}
```

**Armadilha 2: Promise.all dentro de loop**
```javascript
// ❌ ERRADO - cria Promise.all para cada item
for (const item of items) {
    await Promise.all([operacao1(item), operacao2(item)]);
    // Processa items SEQUENCIALMENTE, mas operações de cada item em paralelo
}

// ✅ CORRETO - paraleliza TODOS os items
await Promise.all(
    items.map(item => Promise.all([operacao1(item), operacao2(item)]))
);
```

**Armadilha 3: Ignorar erros de Promises individuais**
```javascript
// ❌ Uma falha rejeita tudo
Promise.all([
    fetch('/critico'),     // Deve suceder
    fetch('/opcional')     // Pode falhar
])
.catch(erro => {
    // Não distingue qual falhou
});

// ✅ Tratar erros individuais
Promise.all([
    fetch('/critico'),
    fetch('/opcional').catch(() => null)  // Fallback para opcional
])
.then(([critico, opcional]) => {
    // critico: dados ou erro (rejeita tudo)
    // opcional: dados ou null (não falha)
});
```

---

## 🔗 Interconexões Conceituais

### Relação com Outros Promise Combinators

**Promise.all() vs Promise.race():**
- `all()`: Espera TODAS, primeira rejeição falha tudo
- `race()`: Primeira a resolver/rejeitar vence

**Promise.all() vs Promise.allSettled():**
- `all()`: Fail-fast, rejeita se uma falhar
- `allSettled()`: Sempre espera todas, retorna sucesso E erros

**Promise.all() vs Promise.any():**
- `all()`: TODAS devem resolver
- `any()`: QUALQUER UMA resolver é suficiente

### Event Loop e Microtasks

Promises de `Promise.all()` executam em **microtask queue**:

```javascript
console.log('1');

Promise.all([
    Promise.resolve('A'),
    Promise.resolve('B')
])
.then(resultados => console.log('3:', resultados));

console.log('2');

// Output: 1, 2, 3: ['A', 'B']
```

`.then()` executa após código síncrono.

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. **Promise Basics**
2. **Promise Chaining**
3. **Error Propagation**
4. **Promise.resolve/reject**
5. **Promise.all()** (você está aqui)
6. **Promise.allSettled()** (tolerante a falhas)
7. **Promise.race()** (primeira a completar)
8. **Promise.any()** (primeira a suceder)

### Preparação para Promise.allSettled()

`Promise.all()` falha se UMA rejeitar. Às vezes você quer **resultados parciais**:

```javascript
// Promise.all - falha se uma rejeitar
Promise.all([fetch1(), fetch2(), fetch3()])
    .catch(erro => {
        // Perdeu TODOS os resultados
    });

// Promise.allSettled - sempre retorna todos
Promise.allSettled([fetch1(), fetch2(), fetch3()])
    .then(resultados => {
        // Resultados: [{ status: 'fulfilled', value: ... }, { status: 'rejected', reason: ... }, ...]
        // Processa sucessos, trata erros individualmente
    });
```

Próximo tópico: `Promise.allSettled()` para cenários tolerantes a falhas.

---

## 📚 Conclusão

**Promise.all()** é a ferramenta fundamental para **coordenação paralela** em JavaScript. Transforma múltiplas operações assíncronas em uma única operação agregada, com ganhos massivos de performance quando operações são independentes.

**Conceitos essenciais:**
- Executa Promises **simultaneamente** (não sequencial)
- Resolve quando **TODAS** resolverem
- Rejeita quando **QUALQUER UMA** rejeitar (fail-fast)
- Array de resultados preserva **ordem do input**
- **Não cancela** Promises ainda executando após rejeição
- Ideal para **operações independentes** (fetch múltiplos, batch operations)

Dominar `Promise.all()` é essencial para escrever código assíncrono **performático** e para entender outros combinators (`allSettled`, `race`, `any`).
