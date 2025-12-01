# Task Queue (Macrotask Queue): Fila de Tarefas Assíncronas

## 🎯 Introdução

A **Task Queue** (também chamada **Macrotask Queue**) é uma fila FIFO que armazena tarefas assíncronas aguardando execução. Após o Call Stack esvaziar e todas as microtasks serem processadas, o Event Loop pega **uma tarefa** da Task Queue por ciclo.

### O que vai para Task Queue

- `setTimeout()`
- `setInterval()`
- `setImmediate()` (Node.js)
- I/O operations
- UI rendering
- Eventos DOM (clicks, inputs, etc.)

---

## 📋 Características

- **FIFO:** First In, First Out
- **Baixa prioridade:** Executa após microtasks
- **Uma por ciclo:** Event Loop processa uma macrotask por vez
- **Renderização:** Pode haver render entre macrotasks

---

## 🧠 Fundamentos

### Funcionamento Básico

```javascript
console.log("=== TASK QUEUE BÁSICA ===\n");

console.log("1. Início");

setTimeout(() => {
    console.log("3. Task Queue - setTimeout 1");
}, 0);

setTimeout(() => {
    console.log("4. Task Queue - setTimeout 2");
}, 0);

console.log("2. Fim");

// Output:
// 1. Início
// 2. Fim
// 3. Task Queue - setTimeout 1
// 4. Task Queue - setTimeout 2
```

### Task Queue vs Microtask Queue

```javascript
console.log("\n=== TASK VS MICROTASK ===\n");

setTimeout(() => {
    console.log("2. Macrotask");
}, 0);

Promise.resolve().then(() => {
    console.log("1. Microtask");
});

// Microtasks SEMPRE executam antes de macrotasks
```

### Múltiplas Macrotasks

```javascript
console.log("\n=== MÚLTIPLAS MACROTASKS ===\n");

setTimeout(() => {
    console.log("Macrotask 1");
    
    Promise.resolve().then(() => {
        console.log("  Microtask dentro de Macrotask 1");
    });
}, 0);

setTimeout(() => {
    console.log("Macrotask 2");
}, 0);

// Output:
// Macrotask 1
//   Microtask dentro de Macrotask 1
// Macrotask 2

// Event Loop processa:
// 1. Macrotask 1
// 2. Todas as microtasks criadas
// 3. Macrotask 2
```

---

## 🔍 Análise Conceitual

### Ordem de Execução Completa

```javascript
console.log("\n=== ORDEM COMPLETA ===\n");

console.log("A"); // 1º Síncrono

setTimeout(() => console.log("D"), 0); // 5º Macrotask

Promise.resolve().then(() => console.log("C")); // 3º Microtask

queueMicrotask(() => console.log("B")); // 2º Microtask

setTimeout(() => console.log("E"), 0); // 6º Macrotask

// Output: A, B, C, D, E
```

### Eventos DOM

```javascript
console.log("\n=== EVENTOS DOM ===\n");

// No browser:
// document.getElementById('botao').addEventListener('click', () => {
//     console.log("Click event - Task Queue");
// });

console.log("Eventos DOM também vão para Task Queue");
console.log("Executam após microtasks");
```

### setImmediate vs setTimeout (Node.js)

```javascript
console.log("\n=== NODE.JS: setImmediate ===\n");

// setImmediate(() => {
//     console.log("setImmediate - Task Queue");
// });

// setTimeout(() => {
//     console.log("setTimeout - Task Queue");
// }, 0);

// Em Node.js, ordem pode variar dependendo do contexto
```

---

## 🎯 Padrões Práticos

### Quebrando Trabalho Pesado

```javascript
console.log("\n=== QUEBRANDO TRABALHO PESADO ===\n");

function processarDados(dados, callback) {
    const lote = dados.splice(0, 100);
    
    // Processar lote
    lote.forEach(item => {
        // processar...
    });
    
    if (dados.length > 0) {
        // Próximo lote como macrotask
        setTimeout(() => processarDados(dados, callback), 0);
    } else {
        callback();
    }
}

const dados = Array.from({ length: 1000 }, (_, i) => i);

processarDados(dados, () => {
    console.log("Processamento concluído!");
});

console.log("UI não bloqueada!");
```

### Debouncing com setTimeout

```javascript
console.log("\n=== DEBOUNCING ===\n");

function debounce(func, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

const pesquisar = debounce((termo) => {
    console.log(`Pesquisando: ${termo}`);
}, 300);

// Simula digitação rápida
pesquisar("J");
pesquisar("Ja");
pesquisar("Jav");
pesquisar("Java");

// Apenas última executa após 300ms
```

---

## ⚠️ Armadilhas

```javascript
console.log("\n=== ARMADILHAS ===\n");

// ❌ Assumir execução imediata
setTimeout(() => {
    console.log("Não é imediato!");
}, 0);

console.log("Código síncrono primeiro!");

// ❌ Ordem não garantida entre macrotasks
setTimeout(() => console.log("A"), 0);
setTimeout(() => console.log("B"), 0);
// Ordem A, B é provável mas não 100% garantida

// ✅ Use Promises para ordem garantida
Promise.resolve()
    .then(() => console.log("C"))
    .then(() => console.log("D"));
```

---

## 🚀 Exemplo Completo

```javascript
console.log("\n=== SISTEMA DE NOTIFICAÇÕES ===\n");

class SistemaNotificacoes {
    constructor() {
        this.fila = [];
    }
    
    adicionar(mensagem, prioridade = 'normal') {
        if (prioridade === 'alta') {
            // Microtask - executa rápido
            queueMicrotask(() => this.exibir(mensagem));
        } else {
            // Macrotask - executa depois
            setTimeout(() => this.exibir(mensagem), 0);
        }
    }
    
    exibir(mensagem) {
        console.log(`📢 ${mensagem}`);
    }
}

const notificacoes = new SistemaNotificacoes();

notificacoes.adicionar("Mensagem normal 1");
notificacoes.adicionar("⚠️ Mensagem urgente!", 'alta');
notificacoes.adicionar("Mensagem normal 2");

console.log("Sistema de notificações configurado!");

// Output:
// Sistema de notificações configurado!
// 📢 ⚠️ Mensagem urgente! (microtask - alta prioridade)
// 📢 Mensagem normal 1
// 📢 Mensagem normal 2
```

---

## 📚 Conclusão

A **Task Queue** é essencial para assincronia em JavaScript:

**Pontos-chave:**

- Armazena tarefas assíncronas (setTimeout, eventos, I/O)
- FIFO (First In, First Out)
- Baixa prioridade (após microtasks)
- Uma macrotask por ciclo do Event Loop
- Permite UI responsiva quebrando trabalho pesado
