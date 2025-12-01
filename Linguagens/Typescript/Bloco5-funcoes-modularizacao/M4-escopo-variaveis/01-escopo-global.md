# Escopo Global no TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Escopo global** (global scope) é o contexto de execução mais externo onde variáveis são acessíveis de qualquer lugar no programa - tanto no nível superior quanto dentro de funções, blocos e módulos. Conceitualmente, representa o **namespace compartilhado universal** onde identificadores declarados fora de qualquer função ou bloco residem.

Na essência, o escopo global materializa o princípio de **acessibilidade onipresente**, onde variáveis globais são visíveis em todo o código. É o nível mais alto da **cadeia de escopos** (scope chain), servindo como último recurso quando identificadores não são encontrados em escopos mais internos.

### Contexto Histórico e Motivação

**Problema histórico:**

Em JavaScript tradicional (especialmente em navegadores), o escopo global era poluído facilmente:

```javascript
// arquivo1.js
var usuario = "Ana";

// arquivo2.js
var usuario = "João"; // Sobrescreve usuario de arquivo1.js
```

**Evolução:**

- **JavaScript clássico:** Tudo sem module system era global
- **ES6 Modules (2015):** Introduziu escopo de módulo, isolando código
- **TypeScript:** Adiciona namespaces e modules para organizar globais
- **Strict Mode:** `"use strict"` reduz poluição acidental

### Problema Fundamental

Escopo global resolve a necessidade de **compartilhar dados entre diferentes partes do código**, mas pode causar:

- **Colisões de nomes:** Variáveis sobrescritas acidentalmente
- **Poluição de namespace:** Muitas variáveis globais tornam código difícil de entender
- **Acoplamento:** Dependências implícitas entre módulos
- **Testing difícil:** Estado global complica testes isolados

## 📋 Fundamentos

### Variáveis Globais

```typescript
// Nível superior do arquivo (escopo global)
let contador = 0;
const PI = 3.14159;

function incrementar(): void {
  contador++; // Acessa variável global
}

function calcularArea(raio: number): number {
  return PI * raio * raio; // Acessa constante global
}

incrementar();
console.log(contador); // 1
```

**Conceito:** Declarações no nível superior criam variáveis globais.

### Diferença: Browser vs. Node.js

```typescript
// Browser: escopo global é `window`
var nomeBrowser = "Ana";
console.log(window.nomeBrowser); // "Ana" (var cria propriedade em window)

// Node.js: escopo global é `global`
var nomeNode = "João";
console.log(global.nomeNode); // undefined (var não cria em global em modules)
```

**Conceito:** Ambiente de execução determina objeto global.

### TypeScript Modules vs. Scripts

```typescript
// Arquivo como MODULE (tem import/export)
export const valor = 10;
// valor NÃO é global - limitado ao módulo

// Arquivo como SCRIPT (sem import/export)
const valor = 10;
// valor É global (em scripts TypeScript)
```

**Importante:** Presença de `import` ou `export` torna arquivo um módulo.

## 🔍 Análise Conceitual Profunda

### 1. Declaração com `var`, `let`, `const`

```typescript
// var - cria propriedade no objeto global (browser)
var nome = "Ana";
console.log(window.nome); // "Ana" (browser)

// let/const - NÃO criam propriedade no objeto global
let idade = 25;
const cidade = "SP";
console.log(window.idade);  // undefined
console.log(window.cidade); // undefined
```

**Conceito:** `var` global polui objeto global, `let`/`const` não.

### 2. Acesso de Escopos Internos

```typescript
const mensagem = "Hello"; // Global

function exibir(): void {
  console.log(mensagem); // Acessa global

  function interna(): void {
    console.log(mensagem); // Também acessa global
  }

  interna();
}

exibir();
// "Hello"
// "Hello"
```

**Conceito:** Escopos internos têm acesso a variáveis de escopos externos (incluindo global).

### 3. Modificação de Variáveis Globais

```typescript
let contador = 0;

function incrementar(): void {
  contador++; // Modifica global
}

function resetar(): void {
  contador = 0; // Modifica global
}

incrementar();
incrementar();
console.log(contador); // 2

resetar();
console.log(contador); // 0
```

**Conceito:** Variáveis globais podem ser modificadas de qualquer lugar (perigoso!).

### 4. Namespace Global em TypeScript

```typescript
// Declarar namespace global
declare global {
  interface Window {
    minhaAPI: {
      versao: string;
      metodo: () => void;
    };
  }
}

// Uso
window.minhaAPI = {
  versao: "1.0",
  metodo: () => console.log("Executando")
};
```

**Conceito:** TypeScript permite estender tipos globais de forma type-safe.

### 5. Poluição de Escopo Global

```typescript
// ❌ Má prática - poluir global
var usuario = "Ana";
var configuracao = { debug: true };
var cache = new Map();
var helpers = { formato: () => {} };

// ✅ Melhor - agrupar em namespace/objeto
const App = {
  usuario: "Ana",
  configuracao: { debug: true },
  cache: new Map(),
  helpers: { formato: () => {} }
};
```

### 6. Globais Implícitas (Erro Comum)

```typescript
function calcular(): void {
  // ❌ Sem declaração - cria global implícita (strict mode previne)
  // resultado = 10; // Erro em strict mode

  // ✅ Declarar explicitamente
  let resultado = 10;
}
```

**Conceito:** Atribuição sem declaração cria global (prevenida por strict mode).

### 7. Constantes Globais

```typescript
const CONFIG = {
  API_URL: "https://api.example.com",
  TIMEOUT: 5000,
  MAX_RETRIES: 3
} as const;

function fazerRequisicao(): void {
  fetch(CONFIG.API_URL, { signal: AbortSignal.timeout(CONFIG.TIMEOUT) });
}
```

**Conceito:** Constantes globais para configuração são uso legítimo de escopo global.

## 🎯 Aplicabilidade e Contextos

### 1. Configurações de Aplicação

```typescript
const APP_CONFIG = {
  ambiente: "producao" as "producao" | "desenvolvimento",
  versao: "1.0.0",
  apiUrl: "https://api.example.com"
};

function inicializar(): void {
  if (APP_CONFIG.ambiente === "desenvolvimento") {
    console.log("Modo desenvolvimento");
  }
}
```

### 2. Utilitários Globais

```typescript
const Utils = {
  formatarMoeda(valor: number): string {
    return `R$ ${valor.toFixed(2)}`;
  },

  formatarData(data: Date): string {
    return data.toLocaleDateString("pt-BR");
  }
};

// Disponível em todo código
console.log(Utils.formatarMoeda(49.99));
```

### 3. Estado Global (Anti-pattern, mas comum)

```typescript
// ⚠️ Estado global - geralmente melhor evitar
let estadoUsuario: {
  autenticado: boolean;
  nome?: string;
} = {
  autenticado: false
};

function login(nome: string): void {
  estadoUsuario.autenticado = true;
  estadoUsuario.nome = nome;
}

function logout(): void {
  estadoUsuario = { autenticado: false };
}
```

### 4. Polyfills e Extensões Globais

```typescript
// Adicionar método faltante em ambiente antigo
if (!Array.prototype.flat) {
  Array.prototype.flat = function<T>(this: T[], depth: number = 1): T[] {
    // Implementação de polyfill
    return [];
  };
}
```

## ⚠️ Limitações e Considerações

### 1. Problemas de Colisão de Nomes

```typescript
// biblioteca1.ts
let usuario = "Ana";

// biblioteca2.ts
let usuario = "João"; // Colisão! Sobrescreve

// ✅ Solução: módulos ou namespaces
```

### 2. Dificuldade em Testes

```typescript
// ❌ Estado global dificulta teste
let cache: Map<string, any> = new Map();

function buscar(chave: string): any {
  return cache.get(chave);
}

// Teste precisa limpar cache entre execuções
```

### 3. Acoplamento Implícito

```typescript
// module1.ts - depende implicitamente de global
function processar(): void {
  console.log(configuracaoGlobal.timeout); // Dependência oculta
}

// module2.ts - modifica global
configuracaoGlobal.timeout = 10000; // Afeta module1 implicitamente
```

### 4. Memory Leaks

```typescript
// ❌ Variável global nunca é liberada
let cachePermanente: any[] = [];

function adicionar(item: any): void {
  cachePermanente.push(item); // Cresce indefinidamente
}
```

## 🔗 Interconexões Conceituais

Escopo global conecta-se com:

- **Escopo de Função:** Primeiro nível interno ao global
- **Escopo de Bloco:** `let`/`const` dentro de blocos
- **Closure:** Funções podem capturar variáveis globais
- **Modules:** Isolam código, evitando poluição global
- **Namespaces:** Organizam código no escopo global

## 🚀 Evolução e Próximos Conceitos

Dominar escopo global prepara para:

1. **Escopo de Função:** Variáveis limitadas a funções
2. **Escopo de Bloco:** `let`/`const` em blocos `{}`
3. **Closures:** Captura de variáveis de escopos externos
4. **Modules:** Sistema moderno de isolamento
5. **Variable Shadowing:** Sobrescrita local de variáveis externas

## 📚 Conclusão

Escopo global é o contexto mais externo onde variáveis são acessíveis universalmente, essencial para compartilhar configurações e utilitários mas perigoso quando mal usado. É fundamental para:

- Configurações de aplicação
- Constantes compartilhadas
- Polyfills e extensões de protótipos
- Compreensão da scope chain

Compreender escopo global é dominar o equilíbrio entre acessibilidade universal e isolamento apropriado, sabendo quando usar globais (raramente) e quando preferir módulos e escopos mais restritos para código maintentável e testável.
