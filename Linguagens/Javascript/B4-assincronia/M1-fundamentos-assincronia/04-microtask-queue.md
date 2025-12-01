# Microtask Queue: Fila de Alta Prioridade

## 🎯 Introdução

A **Microtask Queue** é uma fila especial que tem **prioridade maior** que a Task Queue. O Event Loop processa **todas as microtasks** antes de pegar qualquer macrotask, garantindo execução rápida de operações críticas.

### O que vai para Microtask Queue

- `Promise.then()`, `Promise.catch()`, `Promise.finally()`
- `queueMicrotask()`
- `async/await` (baseado em Promises)
- `MutationObserver` (browser)
- `process.nextTick()` (Node.js - prioridade ainda maior)

---

## 📋 Características

- **Alta prioridade:** Executa antes de macrotasks
- **Esvazia completamente:** Todas as microtasks processadas antes de macrotask
- **Pode criar mais microtasks:** Executam no mesmo ciclo
- **Sincronização:** Ideal para operações que devem executar logo

---

## 🧠 Fundamentos

### Prioridade sobre Macrotasks

```javascript
console.log("=== MICROTASK TEM PRIORIDADE ===\n");

setTimeout(() => {
    console.log("3. Macrotask (setTimeout)");
}, 0);

Promise.resolve().then(() => {
    console.log("2. Microtask (Promise)");
});

console.log("1. Código síncrono");

// Output:
// 1. Código síncrono
// 2. Microtask (Promise)
// 3. Macrotask (setTimeout)
```

### queueMicrotask API

```javascript
console.log("\n=== queueMicrotask ===\n");

console.log("Início");

queueMicrotask(() => {
    console.log("Microtask 1");
});

queueMicrotask(() => {
    console.log("Microtask 2");
});

Promise.resolve().then(() => {
    console.log("Promise");
});

console.log("Fim");

// Output:
// Início
// Fim
// Microtask 1
// Microtask 2
// Promise

// Todas as microtasks executam na ordem de criação
```

### Microtasks Criando Microtasks

```javascript
console.log("\n=== MICROTASKS ENCADEADAS ===\n");

Promise.resolve()
    .then(() => {
        console.log("Microtask 1");
        
        return Promise.resolve();
    })
    .then(() => {
        console.log("Microtask 2");
    });

queueMicrotask(() => {
    console.log("Microtask A");
    
    queueMicrotask(() => {
        console.log("Microtask B (criada dentro de A)");
    });
});

setTimeout(() => {
    console.log("Macrotask - só executa após TODAS microtasks");
}, 0);

// Output:
// Microtask 1
// Microtask A
// Microtask 2
// Microtask B (criada dentro de A)
// Macrotask - só executa após TODAS microtasks
```

---

## 🔍 Análise Conceitual

### Ordem Completa de Execução

```javascript
console.log("\n=== ORDEM COMPLETA ===\n");

console.log("1"); // Síncrono

setTimeout(() => console.log("6"), 0); // Macrotask

Promise.resolve()
    .then(() => console.log("3")) // Microtask
    .then(() => console.log("4")); // Microtask encadeada

queueMicrotask(() => console.log("5")); // Microtask

console.log("2"); // Síncrono

// Output: 1, 2, 3, 4, 5, 6
```

### Microtask Starvation

```javascript
console.log("\n=== MICROTASK STARVATION ===\n");

let contador = 0;

function criarMicrotask() {
    contador++;
    
    if (contador < 5) {
        queueMicrotask(criarMicrotask);
        console.log(`Microtask ${contador}`);
    }
}

criarMicrotask();

setTimeout(() => {
    console.log("Macrotask só executa quando microtasks terminarem");
}, 0);

// ⚠️ Se microtasks forem infinitas, macrotasks nunca executam!
```

### Async/Await usa Microtasks

```javascript
console.log("\n=== ASYNC/AWAIT ===\n");

async function exemplo() {
    console.log("2. Dentro de async (síncrono)");
    
    await Promise.resolve();
    
    console.log("4. Após await (microtask)");
}

console.log("1. Antes de chamar async");
exemplo();
console.log("3. Depois de chamar async");

// Output:
// 1. Antes de chamar async
// 2. Dentro de async (síncrono)
// 3. Depois de chamar async
// 4. Após await (microtask)
```

---

## 🎯 Padrões Práticos

### Batching de Atualizações

```javascript
console.log("\n=== BATCHING DE ATUALIZAÇÕES ===\n");

class Estado {
    constructor() {
        this.dados = {};
        this.observadores = [];
        this.atualizacaoPendente = false;
    }
    
    definir(chave, valor) {
        this.dados[chave] = valor;
        
        if (!this.atualizacaoPendente) {
            this.atualizacaoPendente = true;
            
            // Agrupa múltiplas atualizações em uma microtask
            queueMicrotask(() => {
                this.notificar();
                this.atualizacaoPendente = false;
            });
        }
    }
    
    notificar() {
        console.log("Notificando observadores:", this.dados);
    }
}

const estado = new Estado();

estado.definir('nome', 'João');
estado.definir('idade', 30);
estado.definir('cidade', 'SP');

console.log("Múltiplas mudanças agrupadas!");

// Notifica apenas uma vez com todas as mudanças
```

### Sincronização de Operações

```javascript
console.log("\n=== SINCRONIZAÇÃO ===\n");

function executarDepoisDeTudo(callback) {
    queueMicrotask(callback);
}

let resultado = null;

Promise.resolve().then(() => {
    resultado = "Dados carregados";
});

executarDepoisDeTudo(() => {
    console.log("Resultado:", resultado);
    // Garante que Promise já foi resolvida
});
```

---

## ⚠️ Armadilhas

```javascript
console.log("\n=== ARMADILHAS ===\n");

// ❌ Microtasks infinitas bloqueiam tudo
// let infinito = true;
// function loop() {
//     if (infinito) {
//         queueMicrotask(loop); // Nunca termina!
//     }
// }
// loop();

// ✅ Sempre tenha condição de parada
let contador2 = 0;
function loopSeguro() {
    contador2++;
    if (contador2 < 5) {
        queueMicrotask(loopSeguro);
    }
}

loopSeguro();
console.log("Loop seguro com limite");

// ❌ Confundir ordem
setTimeout(() => console.log("Depois"), 0);
Promise.resolve().then(() => console.log("Antes"));

// Microtask sempre antes de macrotask!
```

---

## 🚀 Exemplo Completo

```javascript
console.log("\n=== SISTEMA DE VALIDAÇÃO ===\n");

class ValidadorFormulario {
    constructor() {
        this.erros = [];
        this.validacaoPendente = false;
    }
    
    validarCampo(campo, valor, regras) {
        // Adiciona validação à fila
        if (!this.validacaoPendente) {
            this.validacaoPendente = true;
            
            queueMicrotask(() => {
                this.processarValidacoes();
            });
        }
        
        // Valida
        regras.forEach(regra => {
            if (!regra.teste(valor)) {
                this.erros.push({
                    campo,
                    mensagem: regra.mensagem
                });
            }
        });
    }
    
    processarValidacoes() {
        if (this.erros.length > 0) {
            console.log("❌ Erros encontrados:");
            this.erros.forEach(erro => {
                console.log(`  ${erro.campo}: ${erro.mensagem}`);
            });
        } else {
            console.log("✅ Formulário válido!");
        }
        
        this.erros = [];
        this.validacaoPendente = false;
    }
}

const validador = new ValidadorFormulario();

// Múltiplas validações síncronas
validador.validarCampo('email', 'teste', [
    { teste: v => v.includes('@'), mensagem: 'Email inválido' }
]);

validador.validarCampo('senha', '123', [
    { teste: v => v.length >= 8, mensagem: 'Senha curta' }
]);

validador.validarCampo('nome', '', [
    { teste: v => v.length > 0, mensagem: 'Nome obrigatório' }
]);

console.log("Validações agendadas!");

// Todas validam juntas em uma microtask
```

---

## 📚 Conclusão

A **Microtask Queue** é crucial para operações que precisam executar rapidamente:

**Pontos-chave:**

- **Alta prioridade:** Antes de macrotasks
- **Esvazia completamente:** Todas executam juntas
- **Promises usam microtasks:** `then()`, `catch()`, `finally()`
- **queueMicrotask():** API explícita
- **Cuidado:** Microtasks infinitas bloqueiam tudo
- **Use para:** Batching, sincronização, operações críticas
