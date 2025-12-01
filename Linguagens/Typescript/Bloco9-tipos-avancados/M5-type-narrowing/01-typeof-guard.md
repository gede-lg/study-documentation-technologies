# Typeof Guard: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Typeof guard** é técnica de **type narrowing** usando operador JavaScript `typeof` em condicionais para refinar tipo de variável, permitindo TypeScript **deduzir tipo mais específico** dentro do bloco condicional. Conceitualmente, representa **runtime type inspection**, onde verificação em tempo de execução informa sistema de tipos sobre tipo real do valor.

Na essência, materializa o princípio de **control flow analysis**, onde TypeScript rastreia fluxo de controle e ajusta tipos baseado em verificações que provam ou eliminam possibilidades, tornando código mais seguro sem type assertions.

## 📋 Fundamentos

### Sintaxe Básica

```typescript
function processar(valor: string | number) {
  // Antes do guard: string | number
  console.log(typeof valor); // "string" ou "number"

  if (typeof valor === "string") {
    // Dentro: TypeScript sabe que é string
    console.log(valor.toUpperCase()); // ✅ OK
    // console.log(valor.toFixed()); // ❌ Erro: toFixed não existe em string
  } else {
    // Aqui: TypeScript sabe que é number
    console.log(valor.toFixed(2)); // ✅ OK
    // console.log(valor.toUpperCase()); // ❌ Erro: toUpperCase não existe em number
  }
}

processar("texto"); // OK
processar(42); // OK
```

**Conceito-chave:** `typeof` guard **refina tipo** dentro do bloco condicional baseado em verificação runtime.

### Valores Reconhecidos

```typescript
// TypeScript reconhece estes valores de typeof
typeof x === "string"
typeof x === "number"
typeof x === "boolean"
typeof x === "symbol"
typeof x === "undefined"
typeof x === "object"
typeof x === "function"
typeof x === "bigint"

// Exemplo
function identificar(valor: unknown): string {
  if (typeof valor === "string") return "É string";
  if (typeof valor === "number") return "É number";
  if (typeof valor === "boolean") return "É boolean";
  if (typeof valor === "undefined") return "É undefined";
  if (typeof valor === "object") return "É object (ou null!)";
  if (typeof valor === "function") return "É function";
  if (typeof valor === "symbol") return "É symbol";
  if (typeof valor === "bigint") return "É bigint";

  return "Tipo desconhecido";
}
```

## 🔍 Análise Conceitual

### 1. Narrowing em Union Types

```typescript
type Primitivo = string | number | boolean;

function formatar(valor: Primitivo): string {
  if (typeof valor === "string") {
    // valor: string
    return valor.toUpperCase();
  }

  if (typeof valor === "number") {
    // valor: number
    return valor.toFixed(2);
  }

  // valor: boolean (único tipo restante)
  return valor ? "Verdadeiro" : "Falso";
}

console.log(formatar("texto")); // "TEXTO"
console.log(formatar(3.14159)); // "3.14"
console.log(formatar(true)); // "Verdadeiro"
```

### 2. Verificação de Nullish Values

```typescript
function processar(valor: string | null | undefined) {
  // typeof null === "object" (quirk do JavaScript!)
  // typeof undefined === "undefined"

  if (typeof valor === "string") {
    // valor: string (exclui null e undefined)
    console.log(valor.length);
  } else {
    // valor: null | undefined
    console.log("Valor ausente");
  }
}

// Melhor: verificar null explicitamente
function processarMelhor(valor: string | null | undefined) {
  if (valor != null && typeof valor === "string") {
    // valor: string
    console.log(valor.length);
  }

  // Ou: != null primeiro
  if (valor != null) {
    // valor: string (null e undefined já eliminados)
    console.log(valor.length);
  }
}
```

### 3. Funções vs Outros Tipos

```typescript
type Callback = (() => void) | string;

function executar(acao: Callback): void {
  if (typeof acao === "function") {
    // acao: () => void
    acao();
  } else {
    // acao: string
    console.log(`Mensagem: ${acao}`);
  }
}

executar(() => console.log("Executando"));
executar("Ação registrada");

// Com múltiplas assinaturas
type Handler =
  | ((x: number) => void)
  | ((x: string, y: number) => void)
  | string;

function chamar(handler: Handler): void {
  if (typeof handler === "function") {
    // handler: ((x: number) => void) | ((x: string, y: number) => void)
    // Ainda é union de funções - precisa mais narrowing
    handler(10); // TypeScript aceita, mas pode estar errado
  }
}
```

### 4. Unknown Type com Typeof

```typescript
function processar(valor: unknown): string {
  // unknown requer narrowing antes de usar
  // console.log(valor.toString()); // ❌ Erro

  if (typeof valor === "string") {
    // valor: string
    return valor.toUpperCase();
  }

  if (typeof valor === "number") {
    // valor: number
    return valor.toString();
  }

  if (typeof valor === "boolean") {
    // valor: boolean
    return valor ? "sim" : "não";
  }

  // Resto: ainda unknown
  return "Tipo não suportado";
}

processar("texto"); // "TEXTO"
processar(42); // "42"
processar(true); // "sim"
processar({}); // "Tipo não suportado"
```

### 5. Narrowing com Negação

```typescript
function processar(valor: string | number) {
  if (typeof valor !== "string") {
    // valor: number (eliminamos string)
    console.log(valor.toFixed(2));
  } else {
    // valor: string
    console.log(valor.toUpperCase());
  }
}

// Early return pattern
function processar2(valor: string | number): void {
  if (typeof valor !== "string") {
    console.log(valor.toFixed(2));
    return;
  }

  // Daqui em diante: valor é string
  console.log(valor.toUpperCase());
  console.log(valor.length);
}
```

## 🎯 Aplicabilidade

### Validação de Input

```typescript
function calcularDesconto(
  preco: unknown,
  percentual: unknown
): number | string {
  // Validar tipos
  if (typeof preco !== "number") {
    return "Preço deve ser número";
  }

  if (typeof percentual !== "number") {
    return "Percentual deve ser número";
  }

  // Aqui: ambos são number (narrowed)
  if (preco < 0 || percentual < 0 || percentual > 100) {
    return "Valores inválidos";
  }

  return preco * (1 - percentual / 100);
}

console.log(calcularDesconto(100, 10)); // 90
console.log(calcularDesconto("100", 10)); // "Preço deve ser número"
```

### API Response Handling

```typescript
interface ApiResponse {
  data: unknown;
  error?: string;
}

function processarResposta(response: ApiResponse): void {
  if (response.error) {
    console.error("Erro:", response.error);
    return;
  }

  const { data } = response;

  if (typeof data === "string") {
    console.log("Mensagem:", data);
  } else if (typeof data === "number") {
    console.log("Valor:", data);
  } else if (typeof data === "object" && data !== null) {
    console.log("Dados:", JSON.stringify(data));
  }
}
```

### Event Handlers

```typescript
function handleEvent(event: Event | string | number): void {
  if (typeof event === "string") {
    // event: string - nome do evento
    console.log(`Evento: ${event}`);
  } else if (typeof event === "number") {
    // event: number - código do evento
    console.log(`Código: ${event}`);
  } else {
    // event: Event - objeto de evento
    console.log(`Tipo: ${event.type}`);
  }
}
```

### Configuration Objects

```typescript
type Config = {
  timeout: number | string; // "5s" ou 5000
  retries: number | boolean; // 3 ou true (infinito)
  debug: boolean | "verbose";
};

function aplicarConfig(config: Config): void {
  // Processar timeout
  let timeoutMs: number;
  if (typeof config.timeout === "number") {
    timeoutMs = config.timeout;
  } else {
    // Parse "5s" → 5000
    timeoutMs = parseInt(config.timeout) * 1000;
  }

  // Processar retries
  let maxRetries: number;
  if (typeof config.retries === "number") {
    maxRetries = config.retries;
  } else {
    maxRetries = config.retries ? Infinity : 0;
  }

  // Debug
  if (typeof config.debug === "string") {
    console.log("Modo verbose ativado");
  } else if (config.debug) {
    console.log("Debug ativado");
  }
}
```

### Parser Functions

```typescript
function parse(input: string | object): object {
  if (typeof input === "string") {
    // input: string - precisa parsear
    try {
      return JSON.parse(input);
    } catch {
      return { error: "JSON inválido" };
    }
  }

  // input: object - já parseado
  return input;
}

const obj1 = parse('{"nome": "Ana"}'); // { nome: "Ana" }
const obj2 = parse({ nome: "Bob" }); // { nome: "Bob" }
```

## ⚠️ Considerações

### 1. Typeof Null (Quirk Histórico)

```typescript
// ❌ typeof null === "object" (bug histórico do JavaScript)
function processar(valor: string | null) {
  if (typeof valor === "object") {
    // ⚠️ Entra aqui se for null!
    // console.log(valor.length); // Crash!
  }

  // ✅ Verificar null explicitamente
  if (valor === null) {
    console.log("É null");
    return;
  }

  // Agora valor é string
  console.log(valor.length);
}

// Melhor: != null primeiro
function processarMelhor(valor: string | null) {
  if (valor != null) {
    // valor: string (null já eliminado)
    console.log(valor.length);
  }
}
```

### 2. Typeof Arrays

```typescript
// ❌ typeof [] === "object" (não distingue array)
function processar(valor: string | number[]) {
  if (typeof valor === "object") {
    // Entra aqui, mas tipo ainda é number[] (não narrowed)
    // valor: number[] (TypeScript sabe, mas typeof não ajuda muito)
    console.log(valor.length);
  }

  // ✅ Melhor: usar Array.isArray
  if (Array.isArray(valor)) {
    // valor: number[]
    console.log(valor.length);
  } else {
    // valor: string
    console.log(valor.toUpperCase());
  }
}
```

### 3. Typeof com Generics

```typescript
function processar<T>(valor: T): void {
  if (typeof valor === "string") {
    // valor: T & string
    console.log(valor.toUpperCase());
  }

  // valor: T (não narrowed fora do if)
}

// Uso
processar("texto"); // OK
processar(42); // Não entra no if
```

### 4. Combinação com Outros Guards

```typescript
function processar(
  valor: string | number | null | undefined | object
): void {
  // Combinar verificações
  if (valor == null) {
    // valor: null | undefined
    console.log("Nullish");
    return;
  }

  if (typeof valor === "string") {
    // valor: string
    console.log(valor.toUpperCase());
    return;
  }

  if (typeof valor === "number") {
    // valor: number
    console.log(valor.toFixed(2));
    return;
  }

  // valor: object
  console.log(JSON.stringify(valor));
}
```

## 📚 Conclusão

Typeof guard usa operador `typeof` em condicionais para refinar tipos baseado em verificação runtime. TypeScript reconhece valores: "string", "number", "boolean", "symbol", "undefined", "object", "function", "bigint". Essencial para narrowing de unions primitivas, validação de unknown, handling de callbacks e parsing. Cuidado: `typeof null === "object"`, `typeof [] === "object"`. Para arrays use `Array.isArray`, para null use `=== null` ou `!= null`. Combine com outros guards para verificações complexas. Permite type-safe operations sem type assertions.
