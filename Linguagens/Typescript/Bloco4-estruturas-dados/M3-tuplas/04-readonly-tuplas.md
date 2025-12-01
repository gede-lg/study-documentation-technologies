# Tuplas Readonly em TypeScript: Imutabilidade Garantida

## 🎯 Introdução

**Tuplas readonly** são tuplas **completamente imutáveis** onde nem elementos individuais nem comprimento podem ser modificados. Garantem **imutabilidade estrutural** em tempo de compilação.

## 📋 Conceitos Fundamentais

### Sintaxe Readonly

```typescript
// Sintaxe: readonly antes da tupla
type TuplaReadonly = readonly [string, number];

let tupla: TuplaReadonly = ["Ana", 25];

// ❌ Não pode modificar elementos
tupla[0] = "Bruno"; // Erro: Cannot assign to '0' because it is a read-only property

// ❌ Não pode modificar comprimento
tupla.push(30); // Erro: Property 'push' does not exist
tupla.pop(); // Erro: Property 'pop' does not exist
tupla.splice(0, 1); // Erro: Property 'splice' does not exist
```

### ReadonlyArray vs Readonly Tuple

```typescript
// ReadonlyArray: array imutável genérico
let arr: ReadonlyArray<number> = [1, 2, 3];

// Readonly tuple: tupla imutável específica
let tupla: readonly [number, number] = [1, 2];

// Diferença: tupla mantém type safety posicional
let primeiro: number = tupla[0]; // Tipo preciso
let primeiroArr: number = arr[0]; // Tipo genérico
```

## 🧠 Fundamentos Teóricos

### Imutabilidade Total

Readonly em tuplas previne:

1. **Modificação de elementos**: `tupla[i] = valor`
2. **Métodos mutativos**: `push`, `pop`, `shift`, `unshift`, `splice`, `reverse`, `sort`
3. **Mudança de comprimento**: Qualquer operação que altera tamanho

```typescript
let tupla: readonly [string, number] = ["Ana", 25];

// ❌ Todas falham
tupla[0] = "Bruno"; // Erro
tupla.push(30); // Erro
tupla.pop(); // Erro
tupla.shift(); // Erro
tupla.reverse(); // Erro
tupla.sort(); // Erro
```

**Permitido:** Métodos não-mutativos:

```typescript
let tupla: readonly [number, number, number] = [1, 2, 3];

// ✅ Métodos que retornam novos valores
let concatenado = tupla.concat([4, 5]); // ✅ OK
let mapeado = tupla.map(x => x * 2); // ✅ OK
let filtrado = tupla.filter(x => x > 1); // ✅ OK
let slice = tupla.slice(0, 2); // ✅ OK

// ✅ Acesso de leitura
let primeiro = tupla[0]; // ✅ OK
let comprimento = tupla.length; // ✅ OK
```

### Variância e Covariância

Readonly adiciona **covariância** a tuplas:

```typescript
type Mutavel = [string, number];
type Readonly = readonly [string, number];

let mut: Mutavel = ["Ana", 25];
let read: Readonly = ["Bruno", 30];

// ✅ Mutável → Readonly (widening seguro)
read = mut; // OK: pode tratar mutável como readonly

// ❌ Readonly → Mutável (narrowing unsafe)
mut = read; // Erro: readonly não é atribuível a mutável
```

**Razão:** Se pudéssemos atribuir readonly a mutável, poderia mutar o que deve ser imutável.

### As Const para Tuplas Literais

`as const` cria tuplas readonly literais:

```typescript
// Sem as const: infere array mutável
let semConst = ["Ana", 25];
// Tipo: (string | number)[]

// Com as const: tupla readonly literal!
let comConst = ["Ana", 25] as const;
// Tipo: readonly ["Ana", 25]
// Note: tipos literais "Ana" e 25, não string e number!
```

**Conceito:** `as const` aplica:
1. **Readonly** em toda estrutura
2. **Literal narrowing** em todos valores primitivos
3. **Tuple inference** ao invés de array

## 🔍 Análise Conceitual Profunda

### Shallow vs Deep Readonly

`readonly` em tuplas é **shallow** - apenas o primeiro nível é imutável:

```typescript
type TuplaObjetos = readonly [{ nome: string }, { idade: number }];

let tupla: TuplaObjetos = [{ nome: "Ana" }, { idade: 25 }];

// ❌ Não pode reatribuir elementos
tupla[0] = { nome: "Bruno" }; // Erro

// ✅ Pode mutar propriedades de objetos
tupla[0].nome = "Bruno"; // OK! Objeto interno é mutável
```

**Deep Readonly (solução):**

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

type TuplaDeep = DeepReadonly<[{ nome: string }, { idade: number }]>;

let deep: TuplaDeep = [{ nome: "Ana" }, { idade: 25 }];
deep[0].nome = "Bruno"; // ❌ Erro: readonly em toda profundidade
```

### Readonly com Elementos Opcionais

```typescript
type OptionalReadonly = readonly [string, number, boolean?];

let t: OptionalReadonly = ["texto", 42];

// ❌ Não pode modificar
t[0] = "novo"; // Erro: readonly
t.push(true); // Erro: push não existe

// ✅ Pode ler
let primeiro: string = t[0]; // OK
let terceiro: boolean | undefined = t[2]; // OK
```

### Readonly com Rest Elements

```typescript
type RestReadonly = readonly [string, ...number[]];

let t: RestReadonly = ["inicio", 1, 2, 3];

// ❌ Imutável
t[0] = "novo"; // Erro
t.push(4); // Erro

// ✅ Pode criar novos
let novo: RestReadonly = ["novo", ...t.slice(1)]; // OK
```

## 🎯 Aplicabilidade

### Parâmetros de Funções

```typescript
// Garantir que função não muda tupla recebida
function processar(dados: readonly [string, number]) {
  dados[0] = "modificado"; // ❌ Erro: previne mutação acidental
  
  // ✅ Pode ler
  console.log(dados[0], dados[1]);
  
  // ✅ Pode criar novos baseados em dados
  return [dados[0].toUpperCase(), dados[1] * 2] as const;
}
```

### Constantes Compartilhadas

```typescript
// Configuração imutável global
const CONFIG = ["localhost", 3000, "production"] as const;
// Tipo: readonly ["localhost", 3000, "production"]

// Ninguém pode modificar acidentalmente
CONFIG[0] = "newhost"; // ❌ Erro
CONFIG.push("extra"); // ❌ Erro
```

### Retornos Garantidamente Imutáveis

```typescript
function obterCoordenadas(): readonly [number, number] {
  return [40.7128, -74.0060];
}

const coords = obterCoordenadas();
coords[0] = 0; // ❌ Erro: retorno é readonly
```

### Programação Funcional

```typescript
// Estado imutável em reducer
type Estado = readonly [contador: number, historico: readonly number[]];

function reducer(estado: Estado, acao: "incrementar" | "decrementar"): Estado {
  const [contador, historico] = estado;
  
  // ❌ Não pode mutar estado original
  estado[0]++; // Erro: readonly
  
  // ✅ Retorna novo estado
  const novoContador = acao === "incrementar" ? contador + 1 : contador - 1;
  return [novoContador, [...historico, novoContador]] as const;
}
```

## ⚠️ Limitações

### Readonly é Shallow

```typescript
type TuplaAninhada = readonly [{ valores: number[] }];

let tupla: TuplaAninhada = [{ valores: [1, 2, 3] }];

// ❌ Não pode reatribuir elemento
tupla[0] = { valores: [4, 5] }; // Erro

// ✅ Pode mutar propriedades aninhadas
tupla[0].valores.push(4); // OK! (shallow readonly)
```

### Conversão de Readonly Requer Assertion

```typescript
let readonly: readonly [string, number] = ["Ana", 25];

// Converter para mutável requer assertion
let mutavel: [string, number] = readonly as [string, number];
// ⚠️ Perde proteção de imutabilidade!
```

### Widening de Literais

```typescript
// Sem as const
function retornar(): readonly [string, number] {
  return ["Ana", 25]; // Tipos ampliados: string, number
}

// Com as const
function retornarLiteral() {
  return ["Ana", 25] as const; // Tipos literais: "Ana", 25
}

type Tipo1 = ReturnType<typeof retornar>;
// readonly [string, number]

type Tipo2 = ReturnType<typeof retornarLiteral>;
// readonly ["Ana", 25]
```

## 🔗 Interconexões

### Com Const Assertions

`as const` é a forma mais comum de criar tuplas readonly:

```typescript
// Manual
let manual: readonly [number, number] = [10, 20];

// Com as const (preferido)
let auto = [10, 20] as const;
// Tipo: readonly [10, 20] (literal + readonly)
```

### Com Type Utilities

```typescript
// Tornar tupla readonly
type AsReadonly<T extends readonly any[]> = readonly [...T];

type Mutavel = [string, number];
type Readonly = AsReadonly<Mutavel>; // readonly [string, number]

// Remover readonly
type Mutable<T> = T extends readonly [...infer U] ? U : T;

type Volta = Mutable<readonly [string, number]>; // [string, number]
```

### Com Discriminated Unions

```typescript
type Acao =
  | readonly ["incrementar", quantidade: number]
  | readonly ["decrementar", quantidade: number]
  | readonly ["resetar"];

function processar(acao: Acao) {
  // Pattern matching type-safe e imutável
  if (acao[0] === "incrementar") {
    const [tipo, quantidade] = acao;
    // tipo: "incrementar", quantidade: number
  }
}
```

## 📚 Conclusão

Tuplas readonly garantem **imutabilidade completa** da estrutura, prevenindo:
- Modificação de elementos
- Métodos mutativos
- Mudanças de comprimento

Use `readonly` quando:
✅ Tupla representa dados que não devem mudar  
✅ Parâmetros de função não devem ser mutados  
✅ Constantes compartilhadas  
✅ Programação funcional/imutável  

Lembre-se:
- `readonly` é **shallow** (use `DeepReadonly` para profundidade)
- `as const` cria readonly + literal narrowing
- Widening para `readonly` é seguro; narrowing para mutável é unsafe
- Métodos não-mutativos (`map`, `filter`, `slice`) funcionam normalmente

Readonly tuplas são fundamentais para **programação funcional** e **state management imutável** em TypeScript.
