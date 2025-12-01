# Loops com Async/Await: For, For...of, Tratamento de Erros

## 🎯 Introdução e Definição

### Definição Conceitual

**Loops com async/await** permitem **iterar sobre coleções** executando operações assíncronas para cada elemento, com controle fino sobre **sequencialidade, paralelismo e tratamento de erros**. Diferente de loops síncronos, loops assíncronos precisam atenção a **quando** e **como** aguardar operações.

A escolha do tipo de loop determina **comportamento fundamental**:

- **`for...of` com await:** Execução **sequencial** (um por vez)
- **`map()` + `Promise.all()`:** Execução **paralela** (todos juntos)
- **`forEach()` com async:** **Não funciona** como esperado (armadilha comum!)

**Sintaxe comparativa:**

```javascript
// SEQUENCIAL - for...of
async function sequencial(items) {
    for (const item of items) {
        await processar(item);  // Um por vez
    }
}

// PARALELO - map + Promise.all
async function paralelo(items) {
    await Promise.all(
        items.map(item => processar(item))  // Todos juntos
    );
}

// ❌ ARMADILHA - forEach (NÃO aguarda!)
async function armadilha(items) {
    items.forEach(async item => {
        await processar(item);  // Executa mas não aguarda!
    });
    console.log('Concluído');  // ANTES de processar items!
}
```

**Impacto:** Escolha errada leva a **bugs sutis** ou **performance ruim**.

### Contexto Histórico e Motivação

**Era Callbacks:** Loops com callbacks eram complexos

```javascript
// Processar array sequencialmente com callbacks
function processarSequencial(items, callback) {
    let i = 0;
    
    function proximo() {
        if (i >= items.length) {
            callback();
            return;
        }
        
        processar(items[i], (erro) => {
            if (erro) {
                callback(erro);
            } else {
                i++;
                proximo();  // Recursão manual
            }
        });
    }
    
    proximo();
}
```

Complexo, propenso a erros.

**Era Promises:** `.reduce()` para sequencial, `Promise.all()` para paralelo

```javascript
// Sequencial com reduce
items.reduce((promise, item) => {
    return promise.then(() => processar(item));
}, Promise.resolve());

// Paralelo
Promise.all(items.map(item => processar(item)));
```

Melhor, mas ainda não intuitivo.

**Era Async/Await:** Loops naturais! (ES2017)

```javascript
// Sequencial - como loop normal!
for (const item of items) {
    await processar(item);
}

// Paralelo - claro e explícito
await Promise.all(items.map(item => processar(item)));
```

**Finalmente lê-se como código síncrono!**

**Motivações principais:**

1. **Naturalidade:** Loops assíncronos como loops normais
2. **Controle:** Escolha explícita entre sequencial/paralelo
3. **Legibilidade:** Código linear e compreensível
4. **Error handling:** `try/catch` funciona naturalmente
5. **Flexibilidade:** Pode combinar padrões (batching, throttling, etc.)

### Problema Fundamental que Resolve

**Problema:** Como iterar sobre coleção executando operação assíncrona para cada item?

**Antes de async/await:**

```javascript
// Callbacks aninhados - "callback hell"
processarItem(items[0], (erro) => {
    if (erro) return handleError(erro);
    processarItem(items[1], (erro) => {
        if (erro) return handleError(erro);
        processarItem(items[2], (erro) => {
            // ...infinito
        });
    });
});

// Ou reduce complexo com Promises
items.reduce((chain, item) => 
    chain.then(() => processarItem(item)),
    Promise.resolve()
);
```

**Com async/await:**

```javascript
// Loop normal!
for (const item of items) {
    await processarItem(item);
}
```

**Simples, direto, legível.**

### Importância no Ecossistema

Loops assíncronos são **fundamentais** porque:

- **Padrão comum:** Processar arrays de dados é ubíquo
- **Batch processing:** Processar múltiplos items (uploads, requests, etc.)
- **Data pipelines:** Transformar coleções assincronamente
- **Migração:** Scripts que processam múltiplos arquivos/registros
- **APIs:** Buscar dados de múltiplos endpoints
- **Testing:** Rodar múltiplos testes assíncronos

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **for...of com await:** Execução **sequencial** controlada
2. **map() + Promise.all():** Execução **paralela** eficiente
3. **forEach() com async:** **Não funciona** - armadilha comum
4. **for await...of:** Iterar sobre **async iterables**
5. **Error handling:** `try/catch` por item ou global

### Pilares Fundamentais

- **Sequencial vs Paralelo:** Escolha consciente por loop
- **Await em loop:** Pausa a cada iteração
- **Promise creation timing:** Determina paralelismo
- **Break/continue:** Funcionam em `for`/`for...of`, não em `map`
- **Early exit:** `for...of` permite sair cedo

### Visão Geral das Nuances

- **While/do-while:** Também funcionam com await
- **Reduce com async:** Sequencial complexo
- **Filter assíncrono:** Precisa Promise.all + filter
- **Find assíncrono:** Pode usar for...of com break
- **Batching:** Processar grupos em paralelo

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### For...of com Await (Sequencial)

```javascript
async function processar(items) {
    for (const item of items) {
        await operacao(item);
    }
}
```

**Execução:**
1. **Primeira iteração:** `item = items[0]`
2. **Await pausa:** Aguarda `operacao(items[0])` completar
3. **Segunda iteração:** `item = items[1]` (só após primeira)
4. **Await pausa:** Aguarda `operacao(items[1])` completar
5. Continua até fim do array

**Operações não se sobrepõem.**

#### Map + Promise.all (Paralelo)

```javascript
async function processar(items) {
    await Promise.all(items.map(item => operacao(item)));
}
```

**Execução:**
1. **Map cria array de Promises:** `[Promise, Promise, Promise]` (todas iniciam!)
2. **Promise.all aguarda:** Todas as Promises juntas
3. **Retorna:** Quando TODAS completarem

**Operações se sobrepõem completamente.**

### Princípios Conceituais

#### forEach com Async NÃO Funciona

```javascript
// ❌ ARMADILHA - forEach não aguarda
async function processar(items) {
    items.forEach(async item => {
        await operacao(item);  // Cria async function, mas forEach ignora retorno
    });
    console.log('Concluído');  // Executa IMEDIATAMENTE (antes dos items)
}
```

**Por quê?** `forEach` **não aguarda** Promises - apenas chama callback e ignora retorno.

#### For...of Aguarda Corretamente

```javascript
// ✅ for...of aguarda cada iteração
async function processar(items) {
    for (const item of items) {
        await operacao(item);  // Loop aguarda antes de próxima iteração
    }
    console.log('Concluído');  // Executa DEPOIS de todos os items
}
```

**For...of respeita await.**

#### Timing de Promise Creation

```javascript
// SEQUENCIAL - cria Promise em cada iteração
for (const item of items) {
    await operacao(item);  // Cria e aguarda
}

// PARALELO - cria todas as Promises primeiro
const promises = items.map(item => operacao(item));  // Cria todas
await Promise.all(promises);  // Depois aguarda todas
```

**Quando** Promise é criada determina paralelismo.

---

## 🔍 Análise Conceitual Profunda

### For...of - Sequencial

```javascript
async function processarSequencial(items) {
    console.time('sequencial');
    
    for (const item of items) {
        console.log(`Processando ${item}...`);
        await processar(item);
        console.log(`${item} concluído`);
    }
    
    console.timeEnd('sequencial');
}

// Executa um por vez, na ordem
await processarSequencial([1, 2, 3, 4, 5]);
```

**Características:**
- **Ordem preservada:** Items processados na ordem do array
- **Sequencial:** Um aguarda anterior completar
- **Break/continue:** Funcionam normalmente
- **Controle fino:** Pode tomar decisões a cada iteração

### Map + Promise.all - Paralelo

```javascript
async function processarParalelo(items) {
    console.time('paralelo');
    
    const resultados = await Promise.all(
        items.map(async item => {
            console.log(`Processando ${item}...`);
            const resultado = await processar(item);
            console.log(`${item} concluído`);
            return resultado;
        })
    );
    
    console.timeEnd('paralelo');
    return resultados;
}

// Executa todos simultaneamente
const resultados = await processarParalelo([1, 2, 3, 4, 5]);
```

**Características:**
- **Paralelo:** Todos iniciam imediatamente
- **Ordem preservada:** Resultados na ordem original (mesmo que completem fora de ordem)
- **Mais rápido:** Operações se sobrepõem
- **Sem controle granular:** Não pode break/continue

### Traditional For Loop

```javascript
async function processarComFor(items) {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log(`[${i}] Processando ${item}`);
        await processar(item);
    }
}
```

**Vantagens:**
- Acesso ao **índice** (`i`)
- Pode modificar loop dinamicamente
- Pode iterar de trás para frente (`i--`)

### While Loop

```javascript
async function processarComWhile(items) {
    let i = 0;
    
    while (i < items.length) {
        await processar(items[i]);
        i++;
    }
}
```

Funciona, mas `for...of` é mais idiomático.

### Error Handling - Try/Catch Global

```javascript
async function processarComErro(items) {
    try {
        for (const item of items) {
            await processar(item);  // Se falhar, aborta loop
        }
    } catch (erro) {
        console.error('Erro durante processamento:', erro);
        // Loop interrompido
    }
}
```

**Primeiro erro** interrompe loop.

### Error Handling - Try/Catch por Item

```javascript
async function processarComErroIndividual(items) {
    const resultados = [];
    
    for (const item of items) {
        try {
            const resultado = await processar(item);
            resultados.push({ sucesso: true, resultado });
        } catch (erro) {
            console.error(`Erro em ${item}:`, erro);
            resultados.push({ sucesso: false, erro });
        }
    }
    
    return resultados;
}
```

**Continua processando** mesmo com erros.

### Error Handling - Promise.allSettled

```javascript
async function processarComErroParalelo(items) {
    const resultados = await Promise.allSettled(
        items.map(item => processar(item))
    );
    
    return resultados.map((resultado, i) => ({
        item: items[i],
        sucesso: resultado.status === 'fulfilled',
        valor: resultado.value || resultado.reason
    }));
}
```

Aguarda **todos**, mesmo com erros.

### Break - Sair do Loop Cedo

```javascript
async function buscarPrimeiro(items) {
    for (const item of items) {
        const resultado = await verificar(item);
        
        if (resultado.encontrado) {
            console.log('Encontrado:', item);
            return item;  // Ou break
        }
    }
    
    return null;  // Nenhum encontrado
}
```

**Não possível** com `map()` + `Promise.all()`.

### Continue - Pular Item

```javascript
async function processarSomenteValidos(items) {
    for (const item of items) {
        const valido = await validar(item);
        
        if (!valido) {
            console.log('Item inválido, pulando:', item);
            continue;  // Pula para próximo item
        }
        
        await processar(item);
    }
}
```

### Reduce - Sequencial Complexo

```javascript
async function processarComReduce(items) {
    return await items.reduce(async (acumuladorPromise, item) => {
        const acumulador = await acumuladorPromise;
        const resultado = await processar(item);
        return [...acumulador, resultado];
    }, Promise.resolve([]));
}
```

**Funciona**, mas `for...of` é mais legível.

### Filter Assíncrono

```javascript
// ❌ filter() não funciona com async
const filtrados = items.filter(async item => {
    return await verificar(item);  // Retorna Promise, não boolean!
});

// ✅ Solução 1: for...of
async function filtrarAsync(items, predicado) {
    const resultados = [];
    
    for (const item of items) {
        if (await predicado(item)) {
            resultados.push(item);
        }
    }
    
    return resultados;
}

// ✅ Solução 2: Promise.all + filter
async function filtrarAsync2(items, predicado) {
    const resultados = await Promise.all(
        items.map(async item => ({
            item,
            valido: await predicado(item)
        }))
    );
    
    return resultados
        .filter(r => r.valido)
        .map(r => r.item);
}
```

### Find Assíncrono

```javascript
async function buscarAsync(items, predicado) {
    for (const item of items) {
        if (await predicado(item)) {
            return item;  // Retorna primeiro encontrado
        }
    }
    return undefined;  // Nenhum encontrado
}

// Uso
const usuarioAtivo = await buscarAsync(usuarios, async u => {
    return await verificarAtivo(u.id);
});
```

### For await...of - Async Iterables

```javascript
// Iterar sobre async iterable (streams, etc.)
async function processar(asyncIterable) {
    for await (const item of asyncIterable) {
        console.log('Item:', item);
        await processar(item);
    }
}

// Exemplo: ler arquivo linha por linha
const fs = require('fs');
const readline = require('readline');

async function lerArquivo(caminho) {
    const stream = fs.createReadStream(caminho);
    const rl = readline.createInterface({ input: stream });
    
    for await (const linha of rl) {
        console.log('Linha:', linha);
        await processarLinha(linha);
    }
}
```

**For await...of** aguarda cada Promise gerada pelo iterador.

### Batching - Processar em Lotes

```javascript
async function processarEmLotes(items, tamanhoBatch) {
    const resultados = [];
    
    for (let i = 0; i < items.length; i += tamanhoBatch) {
        const batch = items.slice(i, i + tamanhoBatch);
        
        console.log(`Processando batch ${Math.floor(i / tamanhoBatch) + 1}...`);
        
        // Processar batch em paralelo
        const resultadosBatch = await Promise.all(
            batch.map(item => processar(item))
        );
        
        resultados.push(...resultadosBatch);
    }
    
    return resultados;
}

// Processar 100 items, 10 por vez
const resultados = await processarEmLotes(items, 10);
```

**Balanceia performance e controle.**

### Throttling - Limitar Concorrência

```javascript
async function processarComThrottle(items, maxConcorrencia) {
    const resultados = [];
    const executando = [];
    
    for (const item of items) {
        // Criar Promise para o item
        const promise = processar(item).then(resultado => {
            // Remover de executando quando concluir
            executando.splice(executando.indexOf(promise), 1);
            return resultado;
        });
        
        executando.push(promise);
        resultados.push(promise);
        
        // Se atingiu max, aguardar pelo menos uma completar
        if (executando.length >= maxConcorrencia) {
            await Promise.race(executando);
        }
    }
    
    // Aguardar todas restantes
    return await Promise.all(resultados);
}

// Processar no máximo 5 simultaneamente
const resultados = await processarComThrottle(items, 5);
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar for...of

**Use for...of quando:**

1. **Processamento sequencial:** Ordem importa ou itens dependem uns dos outros
2. **Rate limiting:** Precisa pausar entre requisições
3. **Break/continue:** Precisa controle de fluxo
4. **Error handling granular:** Tratamento por item
5. **Debugging:** Facilita rastreamento

**Exemplos:**

```javascript
// 1. Ordem importa
async function executarMigracoes(migracoes) {
    for (const migracao of migracoes) {
        console.log(`Executando ${migracao.nome}...`);
        await migracao.executar();
    }
}

// 2. Rate limiting
async function enviarEmails(destinatarios) {
    for (const dest of destinatarios) {
        await enviarEmail(dest);
        await delay(100);  // 100ms entre emails
    }
}

// 3. Break
async function buscarPrimeiroDisponivel(items) {
    for (const item of items) {
        if (await verificarDisponibilidade(item)) {
            return item;  // Encontrou, para
        }
    }
}
```

### Quando Usar map + Promise.all

**Use quando:**

1. **Operações independentes:** Nenhuma depende de outra
2. **Performance crítica:** Velocidade é prioridade
3. **Transformação de array:** Mapear input → output
4. **Sem side effects críticos:** Ordem de execução irrelevante

**Exemplos:**

```javascript
// 1. Buscar múltiplos usuários
async function buscarUsuarios(ids) {
    return await Promise.all(
        ids.map(id => fetch(`/usuario/${id}`).then(r => r.json()))
    );
}

// 2. Validar todos
async function validarTodos(items) {
    const validacoes = await Promise.all(
        items.map(item => validar(item))
    );
    return validacoes.every(v => v === true);
}

// 3. Processar imagens
async function processarImagens(arquivos) {
    return await Promise.all(
        arquivos.map(arquivo => redimensionar(arquivo))
    );
}
```

### Quando Usar Batching

**Use quando:**

1. **Muitos items:** Centenas/milhares
2. **Limites de recursos:** API rate limits, memória, conexões
3. **Performance + controle:** Balancear velocidade e recursos

```javascript
async function importarArquivos(arquivos) {
    // Processar 20 arquivos por vez
    for (let i = 0; i < arquivos.length; i += 20) {
        const batch = arquivos.slice(i, i + 20);
        await Promise.all(batch.map(arquivo => importar(arquivo)));
        console.log(`${i + batch.length}/${arquivos.length} concluídos`);
    }
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Armadilhas Comuns

**Armadilha 1: forEach com async**
```javascript
// ❌ NÃO FUNCIONA
async function processar(items) {
    items.forEach(async item => {
        await operacao(item);
    });
    console.log('Concluído');  // Executa ANTES!
}

// ✅ Use for...of
async function processar(items) {
    for (const item of items) {
        await operacao(item);
    }
    console.log('Concluído');  // Executa DEPOIS
}
```

**Armadilha 2: Map sem await**
```javascript
// ❌ Não aguarda - retorna Promises
async function processar(items) {
    const resultados = items.map(async item => await operacao(item));
    // resultados = [Promise, Promise, Promise]
    return resultados;
}

// ✅ Aguarda com Promise.all
async function processar(items) {
    const resultados = await Promise.all(
        items.map(async item => await operacao(item))
    );
    return resultados;
}
```

**Armadilha 3: For...of quando quer paralelo**
```javascript
// ❌ LENTO - sequencial (10 segundos para 10 items)
async function carregar(ids) {
    const resultados = [];
    for (const id of ids) {
        resultados.push(await fetch(`/item/${id}`));
    }
    return resultados;
}

// ✅ RÁPIDO - paralelo (~1 segundo)
async function carregar(ids) {
    return await Promise.all(
        ids.map(id => fetch(`/item/${id}`))
    );
}
```

### Performance Considerations

**Sequencial é lento:**
```javascript
// 10 items × 1s cada = 10 segundos total
for (const item of items) {
    await processar(item);  // 1s cada
}
```

**Paralelo é rápido:**
```javascript
// 10 items × 1s cada = 1 segundo total
await Promise.all(items.map(item => processar(item)));
```

**Mas paralelo pode sobrecarregar:**
```javascript
// 1000 items - 1000 requisições simultâneas!
await Promise.all(items.map(item => fetch(`/item/${item.id}`)));
// Pode causar timeout, limite de conexões, etc.
```

**Solução: Batching**
```javascript
// 1000 items em batches de 50
for (let i = 0; i < items.length; i += 50) {
    const batch = items.slice(i, i + 50);
    await Promise.all(batch.map(item => fetch(`/item/${item.id}`)));
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Promises

Loops assíncronos são **composições de Promises**:

```javascript
// for...of = Promise chaining
for (const item of items) {
    await operacao(item);
}

// Equivalente a:
items.reduce((chain, item) => 
    chain.then(() => operacao(item)),
    Promise.resolve()
);
```

### Relação com Event Loop

Loop com await **cede controle** ao Event Loop:

```javascript
for (const item of items) {
    await operacao(item);  // Pausa, Event Loop processa outras tasks
}
```

Outras operações podem executar entre iterações.

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. Async Functions
2. Await Operator
3. Error Handling
4. Sequential vs Parallel
5. **Loops com Async** (você está aqui)
6. **Top-level Await** (await fora de async)

### Preparação para Top-level Await

Com loops dominados, próximo: **await no top-level**:

```javascript
// Em módulo ES
const dados = await fetch('/config').then(r => r.json());

// Sem precisar de async function wrapper!
```

Próximo: **Top-level Await** detalhado.

---

## 📚 Conclusão

**Loops com async/await** são ferramentas poderosas para processar coleções assincronamente, com controle fino sobre **sequencialidade, paralelismo e erros**.

**Conceitos essenciais:**
- **for...of com await:** Sequencial (um por vez)
- **map + Promise.all:** Paralelo (todos juntos)
- **forEach com async:** **NÃO FUNCIONA** - armadilha!
- **Break/continue:** Só em for/for...of
- **Error handling:** try/catch global ou por item
- **Batching:** Balancear performance e recursos
- **For await...of:** Para async iterables
- **Escolha consciente:** Sequencial vs paralelo baseado em necessidade

Dominar loops assíncronos é fundamental para **processar dados eficientemente**.
