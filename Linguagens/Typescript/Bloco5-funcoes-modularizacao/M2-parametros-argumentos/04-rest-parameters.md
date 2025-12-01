# Rest Parameters no TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Rest parameters** (parâmetros rest) são um recurso que permite capturar um **número indefinido de argumentos** em um único parâmetro array usando a sintaxe `...nomeParametro`. Conceitualmente, representam **coleção variável de argumentos**, transformando múltiplos argumentos individuais em um array dentro da função.

Na essência, rest parameters materializam o princípio de **variadic functions** (funções variádicas), permitindo que funções aceitem qualquer quantidade de argumentos sem conhecimento prévio do número exato. É a evolução type-safe do objeto `arguments` do JavaScript puro.

### Problema Fundamental que Resolve

Rest parameters resolvem o problema de **funções que precisam aceitar número variável de argumentos**:

```typescript
// ❌ JavaScript antigo - objeto arguments (não type-safe)
function somarVelho() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i]; // arguments não é array real, sem type safety
  }
  return total;
}

// ✅ TypeScript com rest parameters - type-safe
function somar(...numeros: number[]): number {
  // numeros é array real de number[]
  return numeros.reduce((acc, n) => acc + n, 0);
}

somar(1, 2, 3);        // 6
somar(1, 2, 3, 4, 5);  // 15
somar();               // 0 (array vazio)
```

## 📋 Fundamentos

### Sintaxe Básica

```typescript
function nomeFuncao(...resto: Tipo[]): TipoRetorno {
  // resto é array de Tipo[]
}
```

**Componentes:**

- **`...`:** Spread operator indica rest parameter
- **`resto`:** Nome do parâmetro (convenção comum)
- **`Tipo[]`:** Tipo array dos elementos

### Rest Parameter é Sempre Array

```typescript
function listar(...itens: string[]): void {
  // itens: string[] - sempre array, nunca undefined
  console.log(`Total: ${itens.length}`);
  itens.forEach(item => console.log(item));
}

listar("a", "b", "c");  // Total: 3
listar();               // Total: 0 (array vazio)
```

**Conceito:** Rest parameter sempre é array, mesmo se nenhum argumento for passado.

### Deve Ser o Último Parâmetro

```typescript
// ✅ Correto - rest parameter no final
function processar(prefixo: string, ...valores: number[]): void {}

// ❌ Erro - rest parameter não pode estar antes de outros
// function errado(...valores: number[], sufixo: string): void {}
```

**Regra:** Rest parameter deve ser o **último** na lista de parâmetros.

## 🔍 Análise Conceitual Profunda

### 1. Rest Parameters com Tipos Primitivos

```typescript
function multiplicar(fator: number, ...numeros: number[]): number[] {
  return numeros.map(n => n * fator);
}

multiplicar(2, 1, 2, 3);     // [2, 4, 6]
multiplicar(10, 5);          // [50]
multiplicar(3);              // [] (array vazio)
```

**Conceito:** Combina parâmetros normais com rest para flexibilidade máxima.

### 2. Rest Parameters com Union Types

```typescript
function processar(...valores: (string | number)[]): void {
  valores.forEach(v => {
    if (typeof v === "string") {
      console.log(v.toUpperCase());
    } else {
      console.log(v.toFixed(2));
    }
  });
}

processar("hello", 42, "world", 3.14159);
// HELLO
// 42.00
// WORLD
// 3.14
```

### 3. Rest Parameters com Tipos Complexos

```typescript
interface Tarefa {
  id: number;
  titulo: string;
}

function criarLista(...tarefas: Tarefa[]): void {
  console.log(`Lista com ${tarefas.length} tarefas:`);
  tarefas.forEach(t => console.log(`- ${t.titulo}`));
}

criarLista(
  { id: 1, titulo: "Estudar TypeScript" },
  { id: 2, titulo: "Fazer exercícios" },
  { id: 3, titulo: "Revisar código" }
);
```

### 4. Combinando com Parâmetros Obrigatórios

```typescript
function registrarLog(nivel: string, timestamp: number, ...mensagens: string[]): void {
  console.log(`[${timestamp}] [${nivel}]`, mensagens.join(" "));
}

registrarLog("INFO", Date.now(), "Aplicação", "iniciada", "com", "sucesso");
// [timestamp] [INFO] Aplicação iniciada com sucesso
```

### 5. Combinando com Parâmetros Padrão

```typescript
function formatar(separador: string = ", ", ...palavras: string[]): string {
  return palavras.join(separador);
}

formatar(undefined, "a", "b", "c");  // "a, b, c" (usa default)
formatar(" | ", "a", "b", "c");      // "a | b | c"
formatar(undefined);                 // "" (array vazio)
```

### 6. Rest Parameters com Tuplas

Você pode tipar rest parameter como tupla para tipos específicos:

```typescript
function processar(...args: [string, number, boolean]): void {
  const [nome, idade, ativo] = args;
  console.log(`${nome}, ${idade} anos, ${ativo ? "ativo" : "inativo"}`);
}

processar("Ana", 25, true);  // OK - exatamente 3 argumentos
// processar("Ana", 25);     // Erro - falta boolean
// processar("Ana", 25, true, "extra"); // Erro - argumento extra
```

**Conceito:** Tupla em rest parameter exige número exato e tipos específicos.

### 7. Type Safety Completo

```typescript
function calcular(operacao: "somar" | "multiplicar", ...valores: number[]): number {
  if (operacao === "somar") {
    return valores.reduce((acc, v) => acc + v, 0);
  } else {
    return valores.reduce((acc, v) => acc * v, 1);
  }
}

calcular("somar", 1, 2, 3, 4);       // 10
calcular("multiplicar", 2, 3, 4);    // 24
// calcular("dividir", 1, 2);        // Erro: tipo literal não aceito
```

## 🎯 Aplicabilidade e Contextos

### 1. Funções Matemáticas

```typescript
function media(...numeros: number[]): number {
  if (numeros.length === 0) return 0;
  const soma = numeros.reduce((acc, n) => acc + n, 0);
  return soma / numeros.length;
}

media(10, 20, 30);     // 20
media(5, 10, 15, 20);  // 12.5
```

### 2. Logging e Debugging

```typescript
class Logger {
  log(nivel: "DEBUG" | "INFO" | "WARN" | "ERROR", ...partes: any[]): void {
    console.log(`[${nivel}]`, ...partes);
  }
}

const logger = new Logger();
logger.log("INFO", "Usuário", "logado:", { id: 123 });
logger.log("ERROR", "Falha ao conectar", "tentativa", 3);
```

### 3. Builders e Fluent Interfaces

```typescript
class QueryBuilder {
  private condicoes: string[] = [];

  where(...condicoes: string[]): this {
    this.condicoes.push(...condicoes);
    return this;
  }

  build(): string {
    return `SELECT * WHERE ${this.condicoes.join(" AND ")}`;
  }
}

new QueryBuilder()
  .where("idade > 18", "ativo = true", "cidade = 'SP'")
  .build();
```

### 4. Funções de Utilidade

```typescript
function concatenar(separador: string, ...partes: string[]): string {
  return partes.filter(p => p.length > 0).join(separador);
}

concatenar(" ", "Hello", "World");           // "Hello World"
concatenar("-", "2024", "01", "15");         // "2024-01-15"
concatenar(", ", "Ana", "", "João", "Maria"); // "Ana, João, Maria"
```

### 5. Event Handlers

```typescript
function addEventListener(
  elemento: HTMLElement,
  tipo: string,
  ...callbacks: ((event: Event) => void)[]
): void {
  callbacks.forEach(cb => {
    elemento.addEventListener(tipo, cb);
  });
}

const botao = document.querySelector("button")!;
addEventListener(
  botao,
  "click",
  e => console.log("Handler 1"),
  e => console.log("Handler 2"),
  e => console.log("Handler 3")
);
```

## ⚠️ Limitações e Considerações

### 1. Apenas Um Rest Parameter

```typescript
// ✅ OK
function processar(...numeros: number[]): void {}

// ❌ Erro - não pode ter múltiplos rest
// function errado(...a: number[], ...b: string[]): void {}
```

### 2. Deve Ser Último Parâmetro

```typescript
// ❌ Erro - rest não é último
// function errado(...valores: number[], nome: string): void {}

// ✅ Correto
function correto(nome: string, ...valores: number[]): void {}
```

### 3. Performance com Muitos Argumentos

Rest parameters criam novo array a cada chamada:

```typescript
function processar(...valores: number[]): void {
  // Novo array criado - pode impactar performance em loops intensivos
}

// Chamado milhares de vezes por segundo - considere alternativa
for (let i = 0; i < 1000000; i++) {
  processar(1, 2, 3, 4, 5);
}
```

### 4. Type Widening

```typescript
function processar(...valores: number[]): void {}

const arr = [1, 2, 3];
// processar(...arr); // Pode causar erro dependendo strictness
processar(...(arr as const)); // Mais seguro
```

## 🔗 Interconexões Conceituais

Rest parameters conectam-se com:

- **Spread Operator:** Sintaxe `...` usada em ambos (mas semântica oposta)
- **Array Methods:** Rest parameters são arrays reais
- **Variadic Functions:** Conceito de funções com aridade variável
- **Tuples:** Rest pode ser tipado como tupla
- **Function Overloading:** Rest simplifica necessidade de múltiplos overloads

## 🚀 Evolução e Próximos Conceitos

Dominar rest parameters prepara para:

1. **Spread Operator:** Operação inversa (expandir array em argumentos)
2. **Destructuring em Parâmetros:** Extrair elementos com rest
3. **Generics com Rest:** Rest parameters genéricos
4. **Variadic Tuple Types:** Tuplas de comprimento variável

## 📚 Conclusão

Rest parameters oferecem forma type-safe de criar funções variádicas, aceitando número indefinido de argumentos como array tipado. São essenciais para:

- Funções flexíveis com aridade variável
- APIs ergonômicas (logging, builders, utilidades)
- Eliminação do objeto `arguments` não type-safe
- Funções que agregam/processam múltiplos valores

Compreender rest parameters é dominar a arte de criar funções que aceitam qualquer quantidade de argumentos mantendo type safety completo, transformando a variabilidade caótica em coleções estruturadas e tipadas.
