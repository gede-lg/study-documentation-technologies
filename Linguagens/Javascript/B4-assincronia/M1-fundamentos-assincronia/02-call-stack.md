# Call Stack: A Pilha de Execução do JavaScript

## 🎯 Introdução e Definição

### Definição Conceitual

O **Call Stack** (pilha de chamadas) é uma estrutura de dados **LIFO** (Last In, First Out) que controla a **ordem de execução** das funções em JavaScript. Cada vez que uma função é chamada, um novo **frame** (contexto de execução) é empilhado; quando termina, é removido.

É o "caderno de anotações" do JavaScript que registra "onde estou agora" e "para onde voltar quando terminar".

### Características

- **LIFO:** Última função chamada é a primeira a retornar
- **Síncrono:** Executa uma coisa por vez
- **Tamanho limitado:** Stack overflow quando excede limite
- **Rastreável:** Stack trace mostra caminho de execução

---

## 📋 Sumário Conceitual

### Componentes

1. **Execution Context:** Ambiente de cada função
2. **Frame:** Registro de uma chamada de função
3. **Stack Pointer:** Indicador do topo da pilha
4. **Stack Trace:** Histórico de chamadas

### Operações

- **Push:** Adicionar função no topo
- **Pop:** Remover função do topo
- **Peek:** Ver função atual sem remover

---

## 🧠 Fundamentos Teóricos

### Como Funciona

```javascript
console.log("=== CALL STACK BÁSICO ===\n");

function primeira() {
    console.log("Dentro de primeira()");
    segunda();
    console.log("primeira() voltou");
}

function segunda() {
    console.log("Dentro de segunda()");
    terceira();
    console.log("segunda() voltou");
}

function terceira() {
    console.log("Dentro de terceira()");
}

console.log("Início");
primeira();
console.log("Fim");

// Visualização do Call Stack:
// 
// Momento 1: [main]
// Momento 2: [main, primeira]
// Momento 3: [main, primeira, segunda]
// Momento 4: [main, primeira, segunda, terceira]
// Momento 5: [main, primeira, segunda]
// Momento 6: [main, primeira]
// Momento 7: [main]
```

### Stack Overflow

```javascript
console.log("\n=== STACK OVERFLOW ===\n");

let contador = 0;

function recursiva() {
    contador++;
    recursiva(); // Chama a si mesma infinitamente
}

try {
    recursiva();
} catch (e) {
    console.log(`Stack overflow após ${contador} chamadas`);
    console.log(`Erro: ${e.message}`);
}

// Típico: ~10.000-15.000 chamadas até estourar
```

### Stack Trace

```javascript
console.log("\n=== STACK TRACE ===\n");

function nivel1() {
    nivel2();
}

function nivel2() {
    nivel3();
}

function nivel3() {
    console.trace("Stack trace completo:");
}

nivel1();

// Mostra toda a cadeia de chamadas
// nivel3() <- nivel2() <- nivel1() <- (global)
```

---

## 🔍 Análise Conceitual

### Call Stack vs Task Queue

```javascript
console.log("\n=== CALL STACK VS TASK QUEUE ===\n");

console.log("1");

setTimeout(() => {
    console.log("3"); // Vai para Task Queue
}, 0);

console.log("2");

// Call Stack processa: 1, 2
// Depois Event Loop pega da Task Queue: 3
```

### Execution Context

```javascript
console.log("\n=== EXECUTION CONTEXT ===\n");

function exemplo(param) {
    let local = "variável local";
    
    console.log("Contexto de execução contém:");
    console.log("- Parâmetros:", param);
    console.log("- Variáveis locais:", local);
    console.log("- this:", this);
}

exemplo("teste");

// Cada função cria seu próprio contexto de execução
```

---

## ⚠️ Armadilhas

```javascript
console.log("\n=== ARMADILHAS ===\n");

// ❌ Recursão sem caso base
function infinita(n) {
    return infinita(n + 1); // Stack overflow!
}

// ✅ Recursão com caso base
function segura(n) {
    if (n === 0) return 0;
    return n + segura(n - 1);
}

console.log("Soma 1 a 5:", segura(5)); // 15
```

---

## 🚀 Exemplo Prático

```javascript
console.log("\n=== EXEMPLO: CALCULADORA ===\n");

function calcular(a, b, operacao) {
    console.log(`[Stack] calcular(${a}, ${b}, ${operacao})`);
    
    switch(operacao) {
        case '+':
            return somar(a, b);
        case '-':
            return subtrair(a, b);
        case '*':
            return multiplicar(a, b);
        default:
            throw new Error("Operação inválida");
    }
}

function somar(x, y) {
    console.log(`[Stack] somar(${x}, ${y})`);
    return x + y;
}

function subtrair(x, y) {
    console.log(`[Stack] subtrair(${x}, ${y})`);
    return x - y;
}

function multiplicar(x, y) {
    console.log(`[Stack] multiplicar(${x}, ${y})`);
    return x * y;
}

const resultado = calcular(10, 5, '+');
console.log("Resultado:", resultado);

// Call Stack:
// [main] -> [calcular] -> [somar] -> volta para [calcular] -> volta para [main]
```

---

## 📚 Conclusão

O **Call Stack** é a estrutura fundamental que controla execução síncrona em JavaScript.

**Pontos-chave:**
- LIFO (Last In, First Out)
- Uma função por vez
- Stack overflow com recursão infinita
- Stack trace para debugging
