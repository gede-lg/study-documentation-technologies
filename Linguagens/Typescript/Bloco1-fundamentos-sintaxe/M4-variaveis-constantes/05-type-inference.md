# Type Inference (Inferência Automática): Tipos Deduzidos Inteligentemente

## 🎯 Introdução e Definição

Type Inference (inferência de tipos) é o **processo automático** pelo qual o compilador TypeScript **deduz tipos** de variáveis, funções e expressões baseado em valores, contexto e fluxo de código, **sem anotações explícitas**. Conceitualmente, representa **inteligência do compilador** que analisa código e constrói modelo de tipos, reduzindo verbosidade enquanto mantém type safety total.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Análise Contextual:** Tipo deduzido do valor e uso
2. **Bidirectional Inference:** Flui de valores para variáveis e vice-versa
3. **Widening:** `let` infere tipo amplo; `const` infere literal
4. **Best Common Type:** Array com múltiplos tipos infere união
5. **Contextual Typing:** Tipo esperado influencia inferência

## 🧠 Fundamentos Teóricos

### Inferência Básica

**Primitivos:**
```typescript
let num = 42;        // Inferido: number
let text = "olá";    // Inferido: string
let flag = true;     // Inferido: boolean
```

**`const` vs. `let` (Widening):**
```typescript
const x = 10;  // Inferido: 10 (literal)
let y = 10;    // Inferido: number (amplo)
```

**Arrays:**
```typescript
const nums = [1, 2, 3];  // Inferido: number[]
const mixed = [1, "a"];  // Inferido: (number | string)[]
```

**Objetos:**
```typescript
const pessoa = {
  nome: "João",
  idade: 30
};
// Inferido: { nome: string; idade: number; }
```

### Inferência de Retorno de Funções

**Automática:**
```typescript
function somar(a: number, b: number) {
  return a + b;  // Retorno inferido: number
}

const multiplicar = (a: number, b: number) => a * b;
// Retorno inferido: number
```

**Condicional:**
```typescript
function obter(flag: boolean) {
  if (flag) {
    return "texto";
  }
  return 42;
}
// Retorno inferido: string | number
```

### Contextual Typing

**Conceito:** Tipo esperado influencia inferência.

**Exemplo:**
```typescript
window.addEventListener("click", (event) => {
  // 'event' inferido como MouseEvent baseado em contexto
  console.log(event.clientX);
});
```

**Array Methods:**
```typescript
const numeros = [1, 2, 3];
const dobrados = numeros.map(n => n * 2);
// 'n' inferido como number
// 'dobrados' inferido como number[]
```

### Best Common Type

**Conceito:** TypeScript encontra tipo comum em arrays heterogêneos.

```typescript
const valores = [1, "texto", true];
// Inferido: (number | string | boolean)[]

const objetos = [{ x: 1 }, { y: 2 }];
// Inferido: ({ x: number; } | { y: number; })[]
```

## 🎯 Vantagens da Inferência

**1. Código Conciso:**
Sem anotações redundantes, código mais limpo.

**2. Refatoração Facilitada:**
Mudar tipo de retorno propaga automaticamente.

**3. Type Safety Mantida:**
Inferência é tão segura quanto anotação explícita.

**4. DRY (Don't Repeat Yourself):**
Não repetir informação óbvia.

## ⚠️ Limitações

**1. Ambiguidade:**
```typescript
let x;  // Inferido: any (sem valor inicial)
x = 10;  // Ainda any
```

**Solução:** Anotar explicitamente ou inicializar.

**2. Tipos Complexos:**
Inferência pode gerar tipos muito complexos e difíceis de ler.

**Solução:** Extrair para type alias ou interface.

## 📚 Conclusão

Type Inference é **poder central** do TypeScript: type safety sem verbosidade. Compilador deduz tipos inteligentemente, permitindo código conciso mas seguro.

**Confie em inferência para casos óbvios; anote quando inferência for ambígua ou quando documentação for valiosa.**
