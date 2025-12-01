# Tipos Condicionais - Sintaxe Básica: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Tipos condicionais** (conditional types) são uma feature avançada do TypeScript que permite criar tipos baseados em **lógica condicional**, usando a sintaxe `T extends U ? X : Y`. Conceitualmente, são o equivalente ao operador ternário (`condição ? true : false`) aplicado ao sistema de tipos, permitindo **computar tipos em tempo de compilação** baseado em relações entre outros tipos.

Na essência, tipos condicionais transformam o sistema de tipos em uma linguagem de programação funcional, onde tipos são valores que podem ser testados, comparados e transformados. É a materialização do conceito de **tipos como computação**, onde a verificação de tipos não é apenas validação estática, mas uma forma de meta-programação que gera novos tipos dinamicamente.

### Contexto Histórico e Motivação

Tipos condicionais foram introduzidos no **TypeScript 2.8 (março de 2018)** como resposta à necessidade de expressar relações complexas entre tipos de forma declarativa.

**Problema histórico:**

Antes de tipos condicionais, muitas transformações de tipos exigiam overloads extensos ou eram simplesmente impossíveis:

```typescript
// Sem tipos condicionais - múltiplos overloads
function processar(valor: string): string;
function processar(valor: number): number;
function processar(valor: boolean): boolean;
function processar(valor: any): any {
  return valor;
}

// Impossível expressar: "se T é string, retorna string, senão retorna number"
```

**Motivação:**

1. **Expressividade:** Capturar relações complexas entre tipos de entrada e saída
2. **DRY (Don't Repeat Yourself):** Eliminar overloads repetitivos
3. **Transformações de Tipos:** Permitir tipos que dependem de outros tipos
4. **Type-level Programming:** Habilitar computação no sistema de tipos
5. **Bibliotecas Mais Poderosas:** Ferramentas como mapped types precisavam de lógica condicional

**Evolução:**

- **TypeScript 2.8:** Tipos condicionais básicos + `infer` keyword
- **TypeScript 3.0:** Melhorias em distributividade
- **TypeScript 4.0+:** Melhor inferência e recursão

### Problema Fundamental que Resolve

Tipos condicionais resolvem o problema de **tipos que dependem de outros tipos**:

```typescript
// ❌ Sem tipos condicionais - impreciso
type RetornoGenerico<T> = any; // Perde type safety

// ✅ Com tipos condicionais - preciso
type Retorno<T> = T extends string ? number : boolean;

type R1 = Retorno<string>;  // number
type R2 = Retorno<number>;  // boolean
```

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Sintaxe Ternária:** `T extends U ? X : Y` - testa se `T` é atribuível a `U`
2. **Avaliação em Compile-Time:** Computação acontece durante verificação de tipos
3. **Type-Level Branching:** Ramificação condicional no nível de tipos
4. **Lazy Evaluation:** Tipos não são computados até serem necessários
5. **Composabilidade:** Condicionais podem ser aninhadas e combinadas

### Pilares Fundamentais

- **`extends` Keyword:** Operador de compatibilidade/atribuibilidade de tipos
- **Ramos True/False:** `X` (quando verdadeiro) e `Y` (quando falso)
- **Genéricos como Entrada:** Geralmente usados com type parameters
- **Resultado como Tipo:** Expressão completa resolve para um tipo
- **Immutabilidade:** Uma vez resolvido, o tipo não muda

## 🧠 Fundamentos Teóricos

### Sintaxe Básica

```typescript
T extends U ? X : Y
```

**Componentes:**

- **`T`:** Tipo sendo testado (geralmente um type parameter)
- **`extends U`:** Teste de compatibilidade - "T é atribuível a U?"
- **`? X`:** Tipo resultante se condição for verdadeira
- **`: Y`:** Tipo resultante se condição for falsa

### Como Funciona Internamente

O TypeScript avalia tipos condicionais usando **structural typing** (duck typing):

```typescript
type EhString<T> = T extends string ? "sim" : "nao";

type Teste1 = EhString<"hello">;  // "sim" - string literal é atribuível a string
type Teste2 = EhString<number>;   // "nao" - number não é atribuível a string
type Teste3 = EhString<"abc" | 42>; // "nao" - union parcialmente compatível
```

**Processo de Avaliação:**

1. TypeScript recebe `EhString<number>`
2. Substitui `T` por `number`: `number extends string ? "sim" : "nao"`
3. Avalia `number extends string`: **false**
4. Seleciona ramo falso: `"nao"`
5. Tipo resolvido: `"nao"`

### Modelo Mental

Pense em tipos condicionais como **funções de tipos**:

```
Função JavaScript:  (valor) => condição ? a : b
Tipo Condicional:   <T> = T extends U ? X : Y
```

Ambos avaliam condição e retornam resultado, mas tipos condicionais operam no nível de tipos, não valores.

## 🔍 Análise Conceitual Profunda

### 1. Testes Simples de Tipo

```typescript
type EhNumero<T> = T extends number ? true : false;

type R1 = EhNumero<42>;       // true
type R2 = EhNumero<string>;   // false
type R3 = EhNumero<boolean>;  // false
```

**Conceito:** Tipo condicional como "predicado de tipo" - testa propriedade e retorna boolean literal.

### 2. Transformações Baseadas em Tipo

```typescript
type TipoArray<T> = T extends any[] ? T[number] : T;

type A1 = TipoArray<string[]>;  // string - extrai elemento do array
type A2 = TipoArray<number>;    // number - passa direto se não for array
```

**Análise:**

- `string[] extends any[]` → verdadeiro → retorna `string[][number]` = `string`
- `number extends any[]` → falso → retorna `number`

### 3. Condicionais Aninhadas

```typescript
type Classificar<T> =
  T extends string ? "texto" :
  T extends number ? "numero" :
  T extends boolean ? "booleano" :
  "outro";

type C1 = Classificar<"abc">;   // "texto"
type C2 = Classificar<42>;      // "numero"
type C3 = Classificar<true>;    // "booleano"
type C4 = Classificar<null>;    // "outro"
```

**Conceito:** Cascata de condicionais como `if-else if-else`, avaliando em ordem até encontrar match.

### 4. Retornando Tipos Complexos

```typescript
type Wrapper<T> = T extends string
  ? { tipo: "string"; valor: T }
  : { tipo: "outro"; valor: T };

type W1 = Wrapper<"hello">;
// { tipo: "string"; valor: "hello" }

type W2 = Wrapper<number>;
// { tipo: "outro"; valor: number }
```

**Conceito:** Ramos podem ser qualquer tipo complexo - objetos, arrays, unions, intersections.

### 5. Comparando Estruturas

```typescript
type TemId<T> = T extends { id: any } ? true : false;

type T1 = TemId<{ id: number; nome: string }>;  // true
type T2 = TemId<{ nome: string }>;              // false
```

**Conceito:** `extends` testa compatibilidade estrutural - objeto com `id` é compatível com `{ id: any }`.

### 6. Extraindo Tipos de Funções

```typescript
type TipoRetorno<T> = T extends (...args: any[]) => infer R ? R : never;

type R1 = TipoRetorno<() => string>;           // string
type R2 = TipoRetorno<(x: number) => boolean>; // boolean
type R3 = TipoRetorno<string>;                 // never
```

**Conceito:** Combina conditional type com `infer` para extrair tipo de retorno de funções.

### 7. Filtrando Tipos de Union

```typescript
type RemoverString<T> = T extends string ? never : T;

type Filtrado = RemoverString<string | number | boolean>;
// number | boolean
```

**Conceito:** Usando `never` como tipo "vazio" que desaparece de unions, efetivamente filtrando tipos.

## 🎯 Aplicabilidade e Contextos

### Quando Usar Tipos Condicionais

#### 1. **Tipos de Retorno Dependentes**

```typescript
type Resposta<T> = T extends true
  ? { sucesso: true; dados: string }
  : { sucesso: false; erro: string };

function processar<T extends boolean>(sucesso: T): Resposta<T> {
  if (sucesso) {
    return { sucesso: true, dados: "OK" } as Resposta<T>;
  }
  return { sucesso: false, erro: "Falha" } as Resposta<T>;
}

const ok = processar(true);   // { sucesso: true; dados: string }
const err = processar(false); // { sucesso: false; erro: string }
```

#### 2. **Validação de Constraints**

```typescript
type SomenteObjetos<T> = T extends object
  ? T
  : never;

type Valido = SomenteObjetos<{ a: 1 }>;  // { a: 1 }
type Invalido = SomenteObjetos<string>;  // never
```

#### 3. **Transformações Polimórficas**

```typescript
type Promisify<T> = T extends Promise<any>
  ? T
  : Promise<T>;

type P1 = Promisify<string>;           // Promise<string>
type P2 = Promisify<Promise<number>>;  // Promise<number> - não envolve novamente
```

## ⚠️ Limitações e Considerações

### 1. Complexidade Cognitiva

Tipos condicionais podem se tornar difíceis de ler e manter:

```typescript
// Difícil de entender
type Complexo<T> = T extends (infer U)[]
  ? U extends object
    ? U extends { id: infer ID }
      ? ID
      : never
    : never
  : never;
```

**Solução:** Quebrar em tipos auxiliares menores.

### 2. Recursão Limitada

TypeScript tem limite de profundidade de recursão:

```typescript
type Profundo<T, N extends number = 50> =
  N extends 0 ? T : Profundo<T[], Decrement<N>>;
// Pode atingir limite de recursão
```

### 3. Performance de Compilação

Tipos condicionais complexos podem aumentar tempo de compilação significativamente.

## 🔗 Interconexões Conceituais

Tipos condicionais conectam-se com:

- **Mapped Types:** Frequentemente usados juntos para transformações complexas
- **Genéricos:** Fornecem type parameters para testar
- **Type Guards:** Versão runtime de type narrowing
- **Utility Types:** Muitos built-in types usam condicionais internamente (`Exclude`, `Extract`, `ReturnType`)

## 🚀 Evolução e Próximos Conceitos

Dominar sintaxe básica de tipos condicionais prepara para:

1. **Distributividade:** Como condicionais se comportam com unions
2. **`infer` Keyword:** Extrair tipos de estruturas complexas
3. **Recursão:** Tipos que referenciam a si mesmos
4. **Template Literal Types:** Condicionais com strings

## 📚 Conclusão

Tipos condicionais com sintaxe `T extends U ? X : Y` são fundamental para programação avançada de tipos no TypeScript, permitindo criar tipos dinâmicos que se adaptam baseado em condições. São essenciais para bibliotecas type-safe, transformações de tipos complexas e expressividade máxima do sistema de tipos.

Compreender tipos condicionais é entender o TypeScript como linguagem de meta-programação, onde tipos não são apenas anotações estáticas, mas computações que geram novos tipos dinamicamente.
