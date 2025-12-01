# Timers: setTimeout e setInterval

## 🎯 Introdução

Os **timers** (`setTimeout` e `setInterval`) permitem agendar execução de código após um **delay** específico. São fundamentais para assincronia, animações, polling e operações temporizadas.

### APIs de Timer

- **setTimeout():** Executa função **uma vez** após delay
- **setInterval():** Executa função **repetidamente** a cada intervalo
- **clearTimeout():** Cancela setTimeout
- **clearInterval():** Cancela setInterval

---

## 📋 Características

- **Assíncronos:** Não bloqueiam execução
- **Imprecisos:** Delay é **mínimo**, não exato
- **Macrotasks:** Vão para Task Queue
- **Retornam ID:** Para cancelamento

---

## 🧠 Fundamentos

### setTimeout Básico

```javascript
console.log("=== setTimeout BÁSICO ===\n");

console.log("Início");

setTimeout(() => {
    console.log("Executou após 1 segundo");
}, 1000);

console.log("Fim (não bloqueou!)");

// Output imediato:
// Início
// Fim (não bloqueou!)
// (após 1s) Executou após 1 segundo
```

### setTimeout com Parâmetros

```javascript
console.log("\n=== setTimeout COM PARÂMETROS ===\n");

function saudar(nome, idade) {
    console.log(`Olá ${nome}, você tem ${idade} anos`);
}

setTimeout(saudar, 1000, "João", 30);
// Parâmetros extras são passados para função

// Alternativa com arrow function:
setTimeout(() => saudar("Maria", 25), 1000);
```

### clearTimeout

```javascript
console.log("\n=== clearTimeout ===\n");

const timerId = setTimeout(() => {
    console.log("Isso NÃO vai executar");
}, 2000);

// Cancela antes de executar
clearTimeout(timerId);

console.log("Timer cancelado!");
```

### setInterval Básico

```javascript
console.log("\n=== setInterval BÁSICO ===\n");

let contador = 0;

const intervalId = setInterval(() => {
    contador++;
    console.log(`Execução ${contador}`);
    
    if (contador === 3) {
        clearInterval(intervalId);
        console.log("Intervalo cancelado!");
    }
}, 1000);

// Executa a cada 1 segundo, 3 vezes
```

### Delay Mínimo

```javascript
console.log("\n=== DELAY MÍNIMO ===\n");

console.log("Início");

setTimeout(() => {
    console.log("setTimeout(0) NÃO é instantâneo!");
}, 0);

console.log("Fim");

// Output:
// Início
// Fim
// setTimeout(0) NÃO é instantâneo!

// Delay mínimo: ~4ms (browser), ~1ms (Node.js)
```

---

## 🔍 Padrões Práticos

### Debouncing

```javascript
console.log("\n=== DEBOUNCING ===\n");

function debounce(func, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

const buscar = debounce((termo) => {
    console.log(`Buscando: ${termo}`);
}, 500);

// Simula digitação
buscar("J");
buscar("Ja");
buscar("Jav");
buscar("Java"); // Só esta executa

// Útil para: input search, resize events, scroll
```

### Throttling

```javascript
console.log("\n=== THROTTLING ===\n");

function throttle(func, limite) {
    let executando = false;
    
    return function(...args) {
        if (!executando) {
            func.apply(this, args);
            executando = true;
            
            setTimeout(() => {
                executando = false;
            }, limite);
        }
    };
}

const scroll = throttle(() => {
    console.log("Scroll event processado");
}, 200);

// Executa no máximo uma vez a cada 200ms
// Útil para: scroll, mousemove, resize
```

### Polling

```javascript
console.log("\n=== POLLING ===\n");

function iniciarPolling(verificar, intervalo = 1000) {
    const intervalId = setInterval(() => {
        const resultado = verificar();
        
        if (resultado) {
            clearInterval(intervalId);
            console.log("Condição satisfeita, polling parado");
        }
    }, intervalo);
    
    return intervalId;
}

let tentativas = 0;

iniciarPolling(() => {
    tentativas++;
    console.log(`Verificação ${tentativas}`);
    
    return tentativas >= 3; // Para na 3ª tentativa
}, 1000);
```

### Timeout de Operações

```javascript
console.log("\n=== TIMEOUT DE OPERAÇÕES ===\n");

function comTimeout(promise, ms) {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Timeout após ${ms}ms`));
            }, ms);
        })
    ]);
}

// Uso:
const operacaoLenta = new Promise(resolve => {
    setTimeout(() => resolve("Dados"), 5000);
});

comTimeout(operacaoLenta, 2000)
    .then(dados => console.log(dados))
    .catch(erro => console.log("❌", erro.message));

// Timeout após 2000ms (antes dos 5000ms)
```

---

## ⚠️ Armadilhas

### setInterval Não Garante Execução Exata

```javascript
console.log("\n=== ARMADILHA: setInterval ===\n");

// ❌ Se função demora mais que intervalo
setInterval(() => {
    console.log("Início");
    
    // Operação que demora 2 segundos
    const fim = Date.now() + 2000;
    while (Date.now() < fim) {}
    
    console.log("Fim");
}, 1000);

// Intervalo é 1s mas função demora 2s
// Execuções vão se empilhar!

// ✅ Use setTimeout recursivo
function intervaloSeguro() {
    console.log("Executando...");
    
    setTimeout(intervaloSeguro, 1000);
}
```

### this em setTimeout

```javascript
console.log("\n=== ARMADILHA: this ===\n");

const objeto = {
    nome: "Teste",
    
    metodo() {
        setTimeout(function() {
            console.log(this.nome); // undefined (this é window/global)
        }, 1000);
    },
    
    metodoCorreto() {
        setTimeout(() => {
            console.log(this.nome); // "Teste" (arrow function)
        }, 1000);
    }
};

objeto.metodo(); // undefined
objeto.metodoCorreto(); // "Teste"
```

### Memory Leaks

```javascript
console.log("\n=== ARMADILHA: MEMORY LEAKS ===\n");

// ❌ Esquecer de limpar intervalo
function iniciar() {
    setInterval(() => {
        console.log("Executando...");
    }, 1000);
    // Se função for chamada múltiplas vezes, cria múltiplos intervalos!
}

// ✅ Sempre salvar e limpar
let intervalId;

function iniciarSeguro() {
    if (intervalId) {
        clearInterval(intervalId);
    }
    
    intervalId = setInterval(() => {
        console.log("Executando...");
    }, 1000);
}

function parar() {
    clearInterval(intervalId);
}
```

---

## 🚀 Exemplo Completo

```javascript
console.log("\n=== CRONÔMETRO ===\n");

class Cronometro {
    constructor() {
        this.segundos = 0;
        this.intervalId = null;
        this.rodando = false;
    }
    
    iniciar() {
        if (this.rodando) return;
        
        this.rodando = true;
        this.intervalId = setInterval(() => {
            this.segundos++;
            this.exibir();
        }, 1000);
        
        console.log("⏱️ Cronômetro iniciado");
    }
    
    pausar() {
        if (!this.rodando) return;
        
        clearInterval(this.intervalId);
        this.rodando = false;
        console.log("⏸️ Cronômetro pausado");
    }
    
    resetar() {
        this.pausar();
        this.segundos = 0;
        this.exibir();
        console.log("🔄 Cronômetro resetado");
    }
    
    exibir() {
        const horas = Math.floor(this.segundos / 3600);
        const minutos = Math.floor((this.segundos % 3600) / 60);
        const segs = this.segundos % 60;
        
        const tempo = [horas, minutos, segs]
            .map(n => String(n).padStart(2, '0'))
            .join(':');
        
        console.log(tempo);
    }
}

const cronometro = new Cronometro();

cronometro.iniciar();

setTimeout(() => {
    cronometro.pausar();
}, 5000);

setTimeout(() => {
    cronometro.resetar();
}, 6000);
```

---

## 📚 Conclusão

**Timers** são essenciais para operações temporizadas em JavaScript:

**Pontos-chave:**

- **setTimeout:** Execução única após delay
- **setInterval:** Execução repetida
- **Sempre limpar:** clearTimeout/clearInterval
- **Delay mínimo:** ~4ms, não 0ms
- **Assíncronos:** Vão para Task Queue
- **Use para:** Debouncing, throttling, polling, timeouts
