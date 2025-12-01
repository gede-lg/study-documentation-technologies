# Funções que Nunca Retornam: never

## 🎯 Introdução e Definição

### Definição Conceitual

O tipo **`never`** em TypeScript representa o tipo de valores que **nunca ocorrem**. É o tipo de retorno de funções que **jamais retornam o controle ao código chamador** - seja porque lançam exceções, entram em loops infinitos, ou chamam `process.exit()`.

Conceitualmente, `never` é o **tipo vazio** (bottom type) - o tipo que não tem valores possíveis. Enquanto `void` significa "retorna sem valor útil", `never` significa "nunca chega ao ponto de retornar". A função não completa sua execução normalmente.

### Contexto Histórico e Motivação

O conceito de bottom type tem raízes profundas na teoria de tipos:

**Teoria de Tipos (1930s-1940s):** Conceito matemático de tipo vazio que é subtipo de todos os outros tipos.

**Linguagens Funcionais (Haskell, Scala):** Implementam bottom types para representar computações que não terminam ou falham.

**TypeScript 2.0 (2016):** Introduziu `never` como tipo explícito para modelar funções que nunca retornam, melhorando análise de fluxo de controle (control flow analysis).

A motivação era **precisão semântica**: diferenciar funções que retornam `void` (executam e terminam) de funções que nunca terminam normalmente. Isso permite ao compilador detectar código inalcançável e melhorar inferência de tipos.

### Problema Fundamental que Resolve

`never` resolve problemas críticos de modelagem e análise:

**1. Detecção de Código Inalcançável:** TypeScript pode identificar código após chamadas que nunca retornam.

**2. Exhaustiveness Checking:** Em `switch` ou condicionais, `never` ajuda verificar que todos os casos foram tratados.

**3. Type Safety em Exceções:** Funções que sempre lançam erros têm tipo de retorno correto.

**4. Modelagem de Tipos Impossíveis:** Expressa estados que teoricamente não podem existir.

**5. Refinamento de Union Types:** Em análise de fluxo, `never` elimina ramos impossíveis.

### Importância no Ecossistema

`never` é fundamental porque:

- **Control Flow Analysis:** Melhora precisão de type narrowing
- **Type Safety Avançado:** Permite modelar estados impossíveis
- **Error Handling:** Expressa funções que sempre falham
- **Generic Constraints:** Útil em tipos condicionais e mapeados
- **API Design:** Documenta que função interrompe fluxo normal

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Bottom Type:** `never` é o tipo vazio, subtipo de todos os outros tipos
2. **Não-Retorno:** Função nunca completa execução normal
3. **Código Inalcançável:** Código após `never` é detectado como unreachable
4. **Exhaustiveness:** Usado para garantir tratamento completo de casos

### Pilares Fundamentais

- **Tipo Vazio:** Não possui valores possíveis
- **Subtipo Universal:** Assignable a qualquer tipo
- **Interrupção de Fluxo:** Função lança erro, loop infinito, ou termina processo
- **Análise Estática:** Compilador usa `never` para refinamento de tipos

### Visão Geral das Nuances

- **never vs void:** `void` retorna (sem valor); `never` não retorna
- **never em Unions:** `never | T` simplifica para `T`
- **Impossibilidade:** Expressa estados logicamente impossíveis

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Quando TypeScript encontra `never`:

**1. Type Checking:** Compilador verifica que todos os caminhos de código na função nunca retornam normalmente (sempre lançam erro, loop infinito, etc).

**2. Control Flow Analysis:** Marca código após chamadas `never` como inalcançável e emite warnings.

**3. Type Narrowing:** Em condicionais, ramos que resultam em `never` são eliminados da análise subsequente.

**4. Subtyping:** `never` sendo bottom type é assignable a qualquer outro tipo.

**5. Runtime:** `never` é puramente compile-time. Em runtime, função simplesmente lança erro ou não termina.

### Princípios e Conceitos Subjacentes

#### Bottom Type Theory

Na hierarquia de tipos, `never` é o **bottom type** - o tipo mais específico possível:

```
any (top type - supertype de todos)
  ↓
string | number | object | ...
  ↓
never (bottom type - subtype de todos)
```

**Implicação:** `never` pode ser usado onde qualquer tipo é esperado, mas nenhum tipo (exceto `never`) pode ser usado onde `never` é esperado.

#### Princípio da Absurdidade

Em lógica, de uma falsidade (absurdo) pode-se derivar qualquer coisa. `never` representa o absurdo em tipos:

```typescript
function absurdo(x: never): number {
  return x; // OK! never é assignable a number
}
```

Se você provar que `x` é `never`, pode "retornar" qualquer tipo. Isso nunca acontece em runtime porque `never` não tem valores.

#### Eliminação de Union Types

```typescript
type T = string | number | never; // Simplifica para: string | number
```

`never` em union é automaticamente eliminado porque "união com impossibilidade" não adiciona possibilidades.

### Modelo Mental para Compreensão

Pense em `never` como **ações que não retornam**:

- **Lançar granada:** Você lança, mas não "retorna" segurando ela - ela explode
- **Buraco negro:** Algo que entra nunca sai
- **Exceção fatal:** Programa termina abruptamente, não retorna ao caller

Funções `never` são pontos sem retorno no fluxo do programa.

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica

```typescript
// Função que sempre lança erro
function lancarErro(mensagem: string): never {
  throw new Error(mensagem);
}

// Loop infinito
function loopInfinito(): never {
  while (true) {
    console.log("Executando...");
  }
}

// Process exit (Node.js)
function terminarProcesso(): never {
  process.exit(1);
}

// Função que chama outra never
function falhar(): never {
  lancarErro("Falha crítica");
}
```

**Análise conceitual:** `: never` declara que função nunca retorna normalmente. Todos os caminhos devem resultar em não-retorno.

### Funções que Lançam Exceções

```typescript
// Função utilitária de erro
function erro(msg: string): never {
  throw new Error(msg);
}

// Uso em validação
function dividir(a: number, b: number): number {
  if (b === 0) {
    erro("Divisão por zero!");
  }
  return a / b;
}

// Assert function
function assertNever(x: never): never {
  throw new Error(`Valor inesperado: ${x}`);
}
```

**Fundamento teórico:** Funções que sempre lançam erro nunca retornam. `never` documenta isso formalmente.

### Detecção de Código Inalcançável

```typescript
function exemplo(): number {
  lancarErro("Erro!");
  return 42; // ⚠️ Warning: Unreachable code detected
}

function processo(valor: string): void {
  if (valor === "erro") {
    lancarErro("Falha");
    console.log("Isso nunca executa"); // Inalcançável
  }
  console.log("Processando...");
}
```

**Conceito crucial:** TypeScript detecta que código após `never` não pode ser executado. Isso previne bugs de lógica.

### Exhaustiveness Checking

```typescript
type Forma = "circulo" | "quadrado" | "triangulo";

function calcularArea(forma: Forma): number {
  switch (forma) {
    case "circulo":
      return Math.PI * 10 * 10;
    case "quadrado":
      return 10 * 10;
    case "triangulo":
      return (10 * 10) / 2;
    default:
      // Se todos os casos forem tratados, forma aqui é never
      const _exhaustive: never = forma;
      return _exhaustive;
  }
}

// Se adicionar novo tipo sem tratar:
type FormaExtended = "circulo" | "quadrado" | "triangulo" | "pentagono";

function calcularAreaExtended(forma: FormaExtended): number {
  switch (forma) {
    case "circulo":
      return Math.PI * 10 * 10;
    case "quadrado":
      return 10 * 10;
    case "triangulo":
      return (10 * 10) / 2;
    default:
      // ❌ Erro! "pentagono" não é assignable a never
      const _exhaustive: never = forma;
      return _exhaustive;
  }
}
```

**Análise profunda:** No default de switch, se todos os casos foram tratados, o tipo restante é `never`. Atribuir a variável `never` força erro se caso for esquecido.

### never em Type Narrowing

```typescript
function processar(valor: string | number) {
  if (typeof valor === "string") {
    console.log(valor.toUpperCase()); // valor: string
  } else if (typeof valor === "number") {
    console.log(valor.toFixed(2)); // valor: number
  } else {
    // Aqui, valor é never (todos os casos eliminados)
    const _check: never = valor;
  }
}
```

**Conceito avançado:** Após eliminar todos os tipos possíveis em union via type guards, o tipo restante é `never`.

### never vs void

```typescript
// void: executa e retorna sem valor
function log(msg: string): void {
  console.log(msg);
  // Retorna implicitamente
}

// never: nunca retorna
function falhar(msg: string): never {
  throw new Error(msg);
  // Nunca chega aqui
}

// Diferença em uso
const resultado1 = log("teste"); // resultado1: void
const resultado2 = falhar("erro"); // Isso lança erro, nunca chega aqui
console.log("Após falhar"); // Inalcançável
```

**Análise teórica:**
- **void:** Função executa completamente, apenas sem valor útil
- **never:** Função interrompe fluxo, nunca completa

### never em Tipos Condicionais

```typescript
// Remover tipos de uma union
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>; // string
type B = NonNullable<number | undefined>; // number

// Filtrar tipos
type ExtractStrings<T> = T extends string ? T : never;

type C = ExtractStrings<"a" | "b" | 1 | 2>; // "a" | "b"
```

**Fundamento conceitual:** Em conditional types, retornar `never` remove aquele ramo da union resultante.

### never como Tipo Impossível

```typescript
// Propriedade que nunca deve existir
type SemId = {
  nome: string;
  id?: never; // Se id for definido, deve ser never (impossível)
};

const obj1: SemId = { nome: "Ana" }; // OK
const obj2: SemId = { nome: "Ana", id: undefined }; // ❌ Erro
const obj3: SemId = { nome: "Ana", id: 123 }; // ❌ Erro
```

**Conceito avançado:** `never` em propriedades opcional proíbe que ela seja definida.

## 🎯 Aplicabilidade e Contextos

### Quando Usar never

**1. Funções de Erro/Assert**
```typescript
function assert(condicao: boolean, msg: string): asserts condicao {
  if (!condicao) {
    throw new Error(msg); // Lança se condição falsa
  }
}
```

**Raciocínio:** Função lança erro quando falha; nunca retorna nesses casos.

**2. Exhaustiveness Checking**
```typescript
function handleAction(action: Action) {
  switch (action.type) {
    case "ADD": /* ... */ break;
    case "REMOVE": /* ... */ break;
    default:
      const _: never = action; // Garante todos os casos
  }
}
```

**Raciocínio:** Força tratar todos os casos de union type.

**3. Helpers de Tipo**
```typescript
type Impossible = never;

function naoDeveAcontecer(): Impossible {
  throw new Error("Estado impossível!");
}
```

**Raciocínio:** Documentar estados que não devem ser alcançáveis.

### Quando Não Usar never

Não use `never` se a função retorna normalmente, mesmo sem valor:

```typescript
// ❌ Errado - função retorna (void apropriado)
function log(): never {
  console.log("Log");
}

// ✅ Correto
function log(): void {
  console.log("Log");
}
```

## ⚠️ Limitações e Considerações Teóricas

### never Não Previne Erro em Runtime

```typescript
function falhar(): never {
  throw new Error("Falha");
}

try {
  falhar();
} catch (e) {
  console.log("Erro capturado"); // Executa normalmente
}
```

`never` é type-level. Em runtime, exceção é lançada normalmente e pode ser capturada.

### Confusão com void

Desenvolvedores confundem `never` com `void`. Lembre-se:
- **void:** Retorna sem valor
- **never:** Nunca retorna

### Uso Excessivo em Tipos Avançados

`never` em tipos condicionais é poderoso mas pode tornar código críptico. Use com parcimônia e documente.

## 🔗 Interconexões Conceituais

**Relação com void:** `void` é retorno sem valor; `never` é não-retorno.

**Relação com Exceções:** Funções que sempre lançam erros têm tipo `never`.

**Relação com Control Flow:** `never` melhora análise de fluxo, detectando código inalcançável.

**Relação com Union Types:** `never` em unions é eliminado; útil em tipos condicionais.

## 🚀 Evolução e Próximos Conceitos

Dominar `never` prepara para:
- **Advanced Type Guards:** Usar `never` em type predicates
- **Conditional Types:** Manipular tipos com `never` para filtrar unions
- **Mapped Types:** Criar tipos que eliminam propriedades com `never`
- **Discriminated Unions:** Exhaustiveness checking em patterns complexos
