# Event Loop: O Coração da Assincronia em JavaScript

## 🎯 Introdução e Definição

### Definição Conceitual

O **Event Loop** (loop de eventos) é o mecanismo fundamental que permite ao JavaScript executar operações **não-bloqueantes** apesar de ser **single-threaded** (execução em uma única thread). Ele coordena a execução de código, coleta e processa eventos, e executa sub-tarefas enfileiradas.

Conceitualmente, o Event Loop funciona como um **maestro de orquestra** que gerencia quando cada "músico" (tarefa) deve tocar, garantindo que tudo aconteça na ordem correta e que operações longas não bloqueiem o programa inteiro.

### O Problema que Resolve

JavaScript roda em uma **única thread de execução**, o que significa que apenas **uma coisa pode acontecer por vez**. Sem o Event Loop, operações demoradas (como requisições HTTP, leitura de arquivos, ou timers) **bloqueariam** toda a aplicação.

**Exemplo do problema:**
```javascript
// Se JavaScript fosse síncrono e bloqueante:
const dados = esperarResposta(); // Bloquearia TUDO por 3 segundos
console.log(dados);
// Nenhum clique, animação ou código seria executado durante a espera!
```

O Event Loop resolve isso permitindo que operações demoradas sejam **delegadas** ao ambiente (browser ou Node.js) e seus **resultados processados posteriormente**, sem bloquear a execução.

### Contexto Histórico

- **1995:** JavaScript criado como linguagem single-threaded
- **Anos 2000:** AJAX popularizou necessidade de assincronia
- **2009:** Node.js trouxe Event Loop para servidor
- **2015+:** Promises e async/await simplificaram sintaxe assíncrona
- **Atualidade:** Event Loop é fundamental em qualquer aplicação JS moderna

---

## 📋 Sumário Conceitual

### Componentes do Event Loop

1. **Call Stack:** Pilha de execução de funções
2. **Web APIs / Node APIs:** Ambiente que executa operações assíncronas
3. **Task Queue (Macrotask):** Fila de tarefas (setTimeout, eventos DOM)
4. **Microtask Queue:** Fila de alta prioridade (Promises)
5. **Event Loop:** Mecanismo que coordena tudo

### Princípios Fundamentais

- **Single-threaded:** JavaScript executa em uma thread
- **Non-blocking:** Operações longas não travam execução
- **Event-driven:** Baseado em eventos e callbacks
- **FIFO Queues:** Filas seguem First In, First Out
- **Microtasks têm prioridade:** Executam antes de macrotasks

---

## 🧠 Fundamentos Teóricos

### Arquitetura Visual

```
┌───────────────────────────────────────────────────┐
│                    CALL STACK                      │
│  ┌──────────────────────────────────────────────┐ │
│  │ Função sendo executada no momento            │ │
│  └──────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────┘
                      ↑ ↓
┌───────────────────────────────────────────────────┐
│              WEB APIs / NODE APIs                  │
│  setTimeout | setInterval | fetch | I/O | etc.    │
└───────────────────────────────────────────────────┘
                      ↓
┌───────────────────────────────────────────────────┐
│                 MICROTASK QUEUE                    │
│  [ Promise.then ] [ queueMicrotask ] ...          │
└───────────────────────────────────────────────────┘
                      ↓
┌───────────────────────────────────────────────────┐
│                 TASK QUEUE (MACROTASK)             │
│  [ setTimeout ] [ setInterval ] [ DOM events ] ..  │
└───────────────────────────────────────────────────┘
                      ↑
                 EVENT LOOP
           (Monitora e coordena)
```

### Como Funciona

```javascript
console.log("=== COMO O EVENT LOOP FUNCIONA ===\n");

console.log("1. Início");

setTimeout(() => {
    console.log("3. Timeout (Task Queue)");
}, 0);

Promise.resolve().then(() => {
    console.log("2. Promise (Microtask Queue)");
});

console.log("1. Fim");

// Output:
// 1. Início
// 1. Fim
// 2. Promise (Microtask Queue)
// 3. Timeout (Task Queue)
```

**Passo a passo:**

1. **"1. Início"** → Call Stack → Executa → Imprime
2. **setTimeout** → Delega para Web API → Callback vai para Task Queue
3. **Promise.resolve().then()** → Callback vai para Microtask Queue
4. **"1. Fim"** → Call Stack → Executa → Imprime
5. **Call Stack vazio** → Event Loop verifica Microtask Queue
6. **"2. Promise"** → Microtask executada primeiro
7. **Microtask Queue vazio** → Event Loop pega da Task Queue
8. **"3. Timeout"** → Task executada

### Regra de Ouro

```
┌─────────────────────────────────────────────────┐
│  Event Loop só pega da fila quando:             │
│  1. Call Stack está vazio                       │
│  2. Microtasks sempre têm prioridade            │
│  3. Apenas uma macrotask por ciclo              │
└─────────────────────────────────────────────────┘
```

---

## 🔍 Análise Conceitual Profunda

### Exemplo Completo

```javascript
console.log("\n=== EXEMPLO COMPLETO ===\n");

console.log("A"); // 1º - Síncrono

setTimeout(() => {
    console.log("B"); // 7º - Macrotask
}, 0);

Promise.resolve()
    .then(() => {
        console.log("C"); // 4º - Microtask
    })
    .then(() => {
        console.log("D"); // 5º - Microtask encadeada
    });

setTimeout(() => {
    console.log("E"); // 8º - Macrotask
    
    Promise.resolve().then(() => {
        console.log("F"); // 9º - Microtask criada dentro de macrotask
    });
}, 0);

Promise.resolve().then(() => {
    console.log("G"); // 6º - Microtask
});

console.log("H"); // 2º - Síncrono

// Ordem de execução:
// A, H, C, D, G, B, E, F
```

**Explicação detalhada:**

1. **A** - Código síncrono, executa imediatamente
2. **setTimeout(B)** - Vai para Task Queue
3. **Promise(C).then(D)** - C vai para Microtask Queue
4. **setTimeout(E+F)** - Vai para Task Queue
5. **Promise(G)** - Vai para Microtask Queue
6. **H** - Código síncrono, executa imediatamente
7. **Call Stack vazio** → Event Loop processa Microtasks
8. **C** executa → cria nova microtask **D**
9. **D** executa (ainda processando microtasks)
10. **G** executa
11. **Microtasks vazias** → Event Loop pega macrotask **B**
12. **B** executa
13. **Event Loop pega macrotask E**
14. **E** executa → cria microtask **F**
15. **F** executa (microtasks têm prioridade)

### Visualizando o Fluxo

```javascript
console.log("\n=== VISUALIZANDO O FLUXO ===\n");

function visualizar(msg, tipo) {
    const timestamp = performance.now().toFixed(2);
    console.log(`[${timestamp}ms] ${tipo.padEnd(12)} | ${msg}`);
}

visualizar("Início", "Síncrono");

setTimeout(() => {
    visualizar("setTimeout 1", "Macrotask");
}, 0);

Promise.resolve().then(() => {
    visualizar("Promise 1", "Microtask");
});

setTimeout(() => {
    visualizar("setTimeout 2", "Macrotask");
    
    Promise.resolve().then(() => {
        visualizar("Promise dentro setTimeout", "Microtask");
    });
}, 0);

Promise.resolve()
    .then(() => {
        visualizar("Promise 2", "Microtask");
    })
    .then(() => {
        visualizar("Promise 2 encadeada", "Microtask");
    });

visualizar("Fim", "Síncrono");

// Output (aproximado):
// [0.10ms] Síncrono     | Início
// [0.20ms] Síncrono     | Fim
// [0.30ms] Microtask    | Promise 1
// [0.35ms] Microtask    | Promise 2
// [0.40ms] Microtask    | Promise 2 encadeada
// [1.50ms] Macrotask    | setTimeout 1
// [1.60ms] Macrotask    | setTimeout 2
// [1.65ms] Microtask    | Promise dentro setTimeout
```

### Prioridade de Execução

```javascript
console.log("\n=== PRIORIDADE DE EXECUÇÃO ===\n");

console.log("1. Código síncrono executa PRIMEIRO");

queueMicrotask(() => {
    console.log("2. Microtasks têm ALTA prioridade");
});

setTimeout(() => {
    console.log("3. Macrotasks têm BAIXA prioridade");
}, 0);

Promise.resolve().then(() => {
    console.log("2. Promises são microtasks");
});

console.log("1. Código síncrono executa PRIMEIRO");

// Output:
// 1. Código síncrono executa PRIMEIRO
// 1. Código síncrono executa PRIMEIRO
// 2. Microtasks têm ALTA prioridade
// 2. Promises são microtasks
// 3. Macrotasks têm BAIXA prioridade
```

---

## 🎯 Casos Práticos

### Non-blocking I/O

```javascript
console.log("\n=== NON-BLOCKING I/O ===\n");

console.log("Iniciando requisição...");

// Simula requisição HTTP
setTimeout(() => {
    console.log("✓ Dados recebidos do servidor");
}, 2000);

// Enquanto aguarda, outros códigos executam
console.log("Fazendo outras coisas...");

for (let i = 1; i <= 3; i++) {
    console.log(`  Tarefa ${i} executada`);
}

console.log("Código não bloqueou!");

// Output:
// Iniciando requisição...
// Fazendo outras coisas...
//   Tarefa 1 executada
//   Tarefa 2 executada
//   Tarefa 3 executada
// Código não bloqueou!
// (após 2s) ✓ Dados recebidos do servidor
```

### Event Loop Starvation

```javascript
console.log("\n=== EVENT LOOP STARVATION ===\n");

console.log("Criando microtasks infinitas...");

let contador = 0;

function criarMicrotask() {
    if (contador < 1000000) {
        contador++;
        Promise.resolve().then(criarMicrotask);
    }
}

criarMicrotask();

setTimeout(() => {
    console.log("Isso NUNCA executa!");
    console.log("Microtasks infinitas bloqueiam macrotasks");
}, 0);

console.log("⚠️ Event Loop ficará preso processando microtasks!");

// A macrotask do setTimeout NUNCA executará porque
// microtasks têm prioridade e estão sendo criadas infinitamente
```

### Processamento em Lotes

```javascript
console.log("\n=== PROCESSAMENTO EM LOTES ===\n");

const tarefas = Array.from({ length: 100 }, (_, i) => i);

function processarLote(inicio, tamanhoLote) {
    const fim = Math.min(inicio + tamanhoLote, tarefas.length);
    
    for (let i = inicio; i < fim; i++) {
        // Processar tarefa
        // console.log(`Processando ${i}`);
    }
    
    if (fim < tarefas.length) {
        // Agenda próximo lote como macrotask
        setTimeout(() => processarLote(fim, tamanhoLote), 0);
    } else {
        console.log("✓ Todas as tarefas processadas!");
    }
}

console.log("Processando 100 tarefas em lotes de 10...");
processarLote(0, 10);
console.log("Event Loop não bloqueado!");

// Divide trabalho pesado em lotes pequenos
// Permite que UI permaneça responsiva
```

---

## ⚠️ Armadilhas Comuns

### 1. Confundir setTimeout(0) com Execução Imediata

```javascript
console.log("\n=== ARMADILHA: setTimeout(0) ===\n");

console.log("Antes");

setTimeout(() => {
    console.log("Dentro do setTimeout(0)");
}, 0);

console.log("Depois");

// Output:
// Antes
// Depois
// Dentro do setTimeout(0)

// setTimeout(0) NÃO executa imediatamente!
// Vai para Task Queue e executa após código síncrono
```

### 2. Ordem de Promises vs setTimeout

```javascript
console.log("\n=== ARMADILHA: Promise vs setTimeout ===\n");

setTimeout(() => console.log("setTimeout"), 0);
Promise.resolve().then(() => console.log("Promise"));

// Output:
// Promise  (microtask - prioridade)
// setTimeout  (macrotask)

// Promises SEMPRE executam antes de setTimeout!
```

### 3. Microtasks Bloqueando UI

```javascript
console.log("\n=== ARMADILHA: Microtasks Pesadas ===\n");

// ❌ MAU: Muitas microtasks bloqueiam
Promise.resolve().then(() => {
    for (let i = 0; i < 1000000000; i++) {} // Pesado!
    console.log("Microtask pesada concluída");
});

console.log("⚠️ UI ficará congelada durante microtask pesada!");

// ✅ BOM: Quebrar em macrotasks
setTimeout(() => {
    for (let i = 0; i < 1000000000; i++) {}
    console.log("Macrotask pesada concluída");
}, 0);
```

---

## 🔗 Relações e Conexões

**Conceitos Relacionados:**
- Call Stack (pilha de execução)
- Task Queue (fila de macrotasks)
- Microtask Queue (fila de microtasks)
- Web APIs (setTimeout, fetch, etc.)
- Callbacks (base da assincronia)
- Promises (microtasks)
- Async/Await (sintaxe sobre Promises)

**Próximos Passos:**
- Call Stack detalhado
- Task Queue e Macrotasks
- Microtask Queue
- Timers (setTimeout/setInterval)
- requestAnimationFrame

---

## 🚀 Exemplo Prático Completo

### Sistema de Processamento Assíncrono

```javascript
console.log("\n=== SISTEMA DE PROCESSAMENTO COMPLETO ===\n");

class ProcessadorAssincrono {
    constructor() {
        this.filaProcessamento = [];
        this.processando = false;
    }
    
    adicionar(tarefa) {
        this.filaProcessamento.push(tarefa);
        console.log(`✓ Tarefa adicionada: ${tarefa.nome}`);
        
        if (!this.processando) {
            this.processar();
        }
    }
    
    processar() {
        if (this.filaProcessamento.length === 0) {
            this.processando = false;
            console.log("✓ Todas as tarefas concluídas!");
            return;
        }
        
        this.processando = true;
        const tarefa = this.filaProcessamento.shift();
        
        console.log(`⚙️ Processando: ${tarefa.nome}`);
        
        // Simula processamento assíncrono
        setTimeout(() => {
            console.log(`✓ Concluído: ${tarefa.nome}`);
            
            // Microtask para logging
            Promise.resolve().then(() => {
                console.log(`  Log: ${tarefa.nome} finalizada`);
            });
            
            // Próxima tarefa como macrotask
            this.processar();
        }, tarefa.duracao);
    }
}

const processador = new ProcessadorAssincrono();

processador.adicionar({ nome: "Tarefa 1", duracao: 100 });
processador.adicionar({ nome: "Tarefa 2", duracao: 50 });
processador.adicionar({ nome: "Tarefa 3", duracao: 150 });

console.log("Sistema iniciado!");
console.log("Event Loop gerenciando tudo!");

// Output (aproximado):
// ✓ Tarefa adicionada: Tarefa 1
// ⚙️ Processando: Tarefa 1
// ✓ Tarefa adicionada: Tarefa 2
// ✓ Tarefa adicionada: Tarefa 3
// Sistema iniciado!
// Event Loop gerenciando tudo!
// (após 100ms) ✓ Concluído: Tarefa 1
//   Log: Tarefa 1 finalizada
// ⚙️ Processando: Tarefa 2
// (após 50ms) ✓ Concluído: Tarefa 2
//   Log: Tarefa 2 finalizada
// ⚙️ Processando: Tarefa 3
// (após 150ms) ✓ Concluído: Tarefa 3
//   Log: Tarefa 3 finalizada
// ✓ Todas as tarefas concluídas!
```

---

## 📚 Conclusão

O **Event Loop** é o mecanismo fundamental que torna JavaScript assíncrono e não-bloqueante. Compreendê-lo é essencial para:

- Entender ordem de execução assíncrona
- Evitar bloqueios de UI
- Otimizar performance
- Debugar problemas de assincronia
- Usar Promises e async/await efetivamente

**Conceitos-chave:**
- Single-threaded mas non-blocking
- Microtasks têm prioridade sobre macrotasks
- Call Stack deve esvaziar antes de processar filas
- Trabalho pesado deve ser dividido em lotes

Dominar o Event Loop prepara para compreender **toda a programação assíncrona** em JavaScript.
