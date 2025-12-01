# Escopo de Função no TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Escopo de função** (function scope) é o contexto de execução criado quando uma função é declarada, onde variáveis definidas dentro da função são acessíveis apenas dentro dela (e em funções aninhadas). Conceitualmente, representa **isolamento de namespace por função**, onde cada função cria uma "bolha" de privacidade para suas variáveis locais.

Na essência, escopo de função materializa o princípio de **encapsulamento**, onde dados podem ser ocultados e protegidos de acesso externo. É a unidade fundamental de isolamento em JavaScript/TypeScript antes da introdução de escopo de bloco com `let`/`const`.

### Contexto Histórico

**JavaScript clássico:**

Antes do ES6, apenas funções criavam novos escopos (não blocos `{}`):

```javascript
// JavaScript pré-ES6
function exemplo() {
  var x = 10; // Escopo de função

  if (true) {
    var y = 20; // Também escopo de função (não de bloco!)
  }

  console.log(x); // 10
  console.log(y); // 20 - acessível fora do if!
}

// console.log(x); // Erro - não acessível fora da função
```

**Evolução:**

- **JavaScript original:** Apenas function scope (com `var`)
- **ES6 (2015):** Introduziu block scope (`let`/`const`)
- **TypeScript:** Mantém function scope mas recomenda block scope

### Problema Fundamental que Resolve

Escopo de função resolve o problema de **isolamento de variáveis**:

```typescript
// ❌ Sem escopo de função - variável vazaria
let resultado = calcular();

function calcular(): number {
  let temporario = 100; // Isolado dentro da função
  return temporario * 2;
}

// console.log(temporario); // Erro - não acessível fora da função
```

## 📋 Fundamentos

### Variáveis Locais

```typescript
function processar(): void {
  const mensagem = "Hello"; // Variável local
  let contador = 0;         // Variável local

  console.log(mensagem);
  console.log(contador);
}

processar();
// console.log(mensagem); // Erro - fora do escopo
```

**Conceito:** Variáveis declaradas dentro de função são locais a ela.

### `var` e Function Scope

```typescript
function exemplo(): void {
  if (true) {
    var x = 10; // var tem function scope
  }

  console.log(x); // 10 - acessível em toda função
}

function exemploLet(): void {
  if (true) {
    let y = 20; // let tem block scope
  }

  // console.log(y); // Erro - não acessível fora do bloco
}
```

**Conceito:** `var` ignora blocos, `let`/`const` respeitam.

### Parâmetros São Locais

```typescript
function somar(a: number, b: number): number {
  // a e b são variáveis locais ao escopo da função
  return a + b;
}

somar(5, 3);
// console.log(a); // Erro - parâmetros não existem fora da função
```

## 🔍 Análise Conceitual Profunda

### 1. Isolamento de Variáveis

```typescript
let nome = "Global";

function exibir(): void {
  let nome = "Local"; // Variável diferente da global
  console.log(nome);  // "Local"
}

exibir();
console.log(nome); // "Global"
```

**Conceito:** Variável local "esconde" global com mesmo nome (shadowing).

### 2. Funções Aninhadas Têm Acesso ao Escopo Externo

```typescript
function externa(): void {
  const mensagem = "Olá";

  function interna(): void {
    console.log(mensagem); // Acessa variável do escopo externo
  }

  interna(); // "Olá"
}

externa();
```

**Conceito:** Funções internas formam **closure**, capturando variáveis do escopo externo.

### 3. `var` Hoisting no Function Scope

```typescript
function exemplo(): void {
  console.log(x); // undefined (não erro!)

  var x = 10; // Declaração é "hoisted" para o topo da função

  console.log(x); // 10
}

// Equivalente (após hoisting):
function exemploHoisted(): void {
  var x; // Hoisted para o topo
  console.log(x); // undefined
  x = 10;
  console.log(x); // 10
}
```

**Conceito:** `var` é "içado" ao topo do escopo de função.

### 4. Múltiplas Funções, Múltiplos Escopos

```typescript
function funcao1(): void {
  let variavel = "A";
  console.log(variavel); // "A"
}

function funcao2(): void {
  let variavel = "B"; // Variável completamente separada
  console.log(variavel); // "B"
}

funcao1();
funcao2();
```

**Conceito:** Cada função tem seu próprio escopo independente.

### 5. Retornando Função com Closure

```typescript
function criarContador(): () => number {
  let contador = 0; // Privado ao escopo de criarContador

  return function(): number {
    contador++; // Acessa variável do escopo externo
    return contador;
  };
}

const incrementar = criarContador();
console.log(incrementar()); // 1
console.log(incrementar()); // 2
console.log(incrementar()); // 3
```

**Conceito:** Função retornada mantém acesso ao escopo da função que a criou.

### 6. Loop com `var` (Problema Clássico)

```typescript
function problema(): void {
  for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
  }
  // Imprime: 3, 3, 3 (não 0, 1, 2)
}

function solucao(): void {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
  }
  // Imprime: 0, 1, 2
}
```

**Conceito:** `var` tem function scope (única variável compartilhada), `let` tem block scope (variável por iteração).

### 7. IIFE (Immediately Invoked Function Expression)

```typescript
// Padrão clássico para criar escopo isolado
(function(): void {
  const privado = "Não acessível fora";
  console.log(privado);
})();

// console.log(privado); // Erro - escopo isolado

// Equivalente moderno com bloco
{
  const privado = "Não acessível fora";
  console.log(privado);
}
```

**Conceito:** IIFE cria escopo de função temporário para isolamento.

## 🎯 Aplicabilidade e Contextos

### 1. Encapsulamento de Lógica

```typescript
function processarPedido(pedidoId: number): void {
  // Variáveis auxiliares privadas
  const taxaServico = 0.1;
  const descontoMaximo = 50;

  function calcularTotal(valor: number): number {
    return valor * (1 + taxaServico);
  }

  function aplicarDesconto(total: number, desconto: number): number {
    return total - Math.min(desconto, descontoMaximo);
  }

  // Lógica usando funções auxiliares privadas
  const total = calcularTotal(100);
  const final = aplicarDesconto(total, 60);
}
```

### 2. Estado Privado (antes de classes)

```typescript
function criarUsuario(nome: string) {
  // Estado privado
  let autenticado = false;

  return {
    login(senha: string): boolean {
      if (senha === "secreta") {
        autenticado = true;
        return true;
      }
      return false;
    },

    logout(): void {
      autenticado = false;
    },

    estaAutenticado(): boolean {
      return autenticado;
    }
  };
}

const usuario = criarUsuario("Ana");
usuario.login("secreta");
console.log(usuario.estaAutenticado()); // true
// console.log(autenticado); // Erro - privado
```

### 3. Módulo Pattern

```typescript
const Calculadora = (function() {
  // Variáveis privadas
  let historico: number[] = [];

  // Métodos privados
  function registrar(resultado: number): void {
    historico.push(resultado);
  }

  // API pública
  return {
    somar(a: number, b: number): number {
      const resultado = a + b;
      registrar(resultado);
      return resultado;
    },

    obterHistorico(): number[] {
      return [...historico]; // Retorna cópia
    }
  };
})();

Calculadora.somar(5, 3);
console.log(Calculadora.obterHistorico()); // [8]
```

## ⚠️ Limitações e Considerações

### 1. `var` Ignora Blocos

```typescript
function exemplo(): void {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 - acessível fora do if
}
```

**Solução:** Use `let`/`const` para block scope.

### 2. Hoisting Pode Causar Bugs

```typescript
function confuso(): void {
  console.log(valor); // undefined (não erro!)
  var valor = 10;
}
```

**Solução:** Declare variáveis no topo ou use `let`/`const` (temporal dead zone).

### 3. Closures Podem Causar Memory Leaks

```typescript
function criarGrande(): () => void {
  const dadosGrandes = new Array(1000000).fill("data");

  return function(): void {
    console.log(dadosGrandes.length); // Mantém dadosGrandes na memória
  };
}

const funcao = criarGrande(); // dadosGrandes nunca liberado
```

## 🔗 Interconexões Conceituais

Escopo de função conecta-se com:

- **Escopo Global:** Função acessa variáveis globais
- **Escopo de Bloco:** `let`/`const` criam sub-escopos dentro da função
- **Closures:** Funções aninhadas capturam escopo externo
- **Hoisting:** `var` e function declarations são hoisted
- **Variable Shadowing:** Variáveis locais escondem externas

## 🚀 Evolução e Próximos Conceitos

Dominar escopo de função prepara para:

1. **Escopo de Bloco:** `let`/`const` em blocos `{}`
2. **Closures:** Captura persistente de escopos externos
3. **Variable Shadowing:** Sobrescrita local de variáveis
4. **Modules:** Escopo de módulo como evolução
5. **This Binding:** Comportamento de `this` em diferentes escopos

## 📚 Conclusão

Escopo de função é a unidade fundamental de isolamento em JavaScript/TypeScript, criando contextos privados para variáveis e lógica. É essencial para:

- Encapsulamento e privacidade de dados
- Evitar poluição de namespace global
- Criação de closures
- Compreensão de hoisting e scope chain

Compreender escopo de função é dominar o modelo de execução de JavaScript/TypeScript, onde funções não são apenas blocos de código reutilizáveis, mas também mecanismos de criação de escopos isolados que formam a base de patterns como módulos, closures e encapsulamento.
