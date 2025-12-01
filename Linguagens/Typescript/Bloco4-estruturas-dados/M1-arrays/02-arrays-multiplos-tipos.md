# Arrays com Múltiplos Tipos em TypeScript: Union Types, Type Narrowing e Heterogeneidade Controlada

## 🎯 Introdução e Definição

### Definição Conceitual

Um **array com múltiplos tipos** (ou **array heterogêneo tipado**) em TypeScript é um array que pode armazenar elementos de **diferentes tipos**, onde cada tipo permitido é explicitamente declarado através de uma **union type**. Conceitualmente, é uma estrutura que combina a **flexibilidade de arrays JavaScript heterogêneos** com a **segurança de tipos do TypeScript**.

A sintaxe fundamental usa **union types** entre parênteses seguidos de colchetes:

```typescript
// Array que aceita strings OU números
let valores: (string | number)[] = [1, "texto", 2, "outro"];

// Equivalente com sintaxe genérica
let valores: Array<string | number> = [1, "texto", 2, "outro"];
```

**Conceito profundo**: Arrays heterogêneos tipados representam **conjuntos onde cada elemento pertence a um dos tipos da union**. Matematicamente:

```
Array<T1 | T2 | ... | Tn> = { [e1, e2, ..., em] | ∀ei: ei ∈ (T1 ∪ T2 ∪ ... ∪ Tn) }
```

TypeScript garante que:
- **Todo elemento** é de um dos tipos permitidos na union
- **Operações** devem ser válidas para todos tipos possíveis (ou usar **type narrowing**)
- **Type guards** permitem refinar tipo de elemento específico

### Contexto Histórico e Motivação

Em **JavaScript puro**, arrays são naturalmente heterogêneos - podem conter qualquer mistura de tipos:

```javascript
// JavaScript: heterogeneidade sem controle
let dados = [1, "texto", true, null, {nome: "Ana"}, [1, 2]];
// Permitido, mas perigoso - sem documentação de quais tipos esperar
```

**Problemas sem tipagem**:
- **Imprevisibilidade**: Não sabemos quais tipos o array contém
- **Erros silenciosos**: Operações incompatíveis falham em runtime
- **Falta de IntelliSense**: Editor não sabe quais métodos usar

**TypeScript** introduziu **union types em arrays** para balancear **flexibilidade** e **segurança**:

```typescript
// TypeScript: heterogeneidade CONTROLADA
let valores: (number | string)[] = [1, "texto", 2, "outro"];
// ✅ Tipos permitidos são explícitos
// ✅ Compilador valida cada elemento
// ✅ IntelliSense funciona com type narrowing
```

**Motivação**:
1. **Casos reais onde heterogeneidade é necessária**: APIs retornam dados mistos, processamento de dados variados
2. **Documentação explícita**: Código declara quais tipos são esperados
3. **Type safety parcial**: Melhor que `any[]`, pior que array homogêneo
4. **Type narrowing**: Permite refinar tipo de elemento quando necessário

### Problema Fundamental que Resolve

#### 1. **Dados Heterogêneos de APIs**

Problema: APIs frequentemente retornam dados com tipos variados:

```typescript
// Resposta de API: valores podem ser strings ou números
interface ApiResponse {
  data: (string | number)[];
}

// ✅ TypeScript documenta e valida tipos possíveis
function processarDados(response: ApiResponse): void {
  response.data.forEach(valor => {
    // TypeScript sabe que 'valor' é string | number
    if (typeof valor === "string") {
      console.log(valor.toUpperCase()); // string methods
    } else {
      console.log(valor.toFixed(2)); // number methods
    }
  });
}
```

**Conceito**: Union types em arrays documentam **variabilidade controlada**.

#### 2. **Formulários com Valores Mistos**

Problema: Formulários podem ter diferentes tipos de valores:

```typescript
interface CampoFormulario {
  nome: string;
  valor: string | number | boolean | null;
}

let valores: (string | number | boolean | null)[] = [
  "Nome do usuário",
  25,
  true,
  null
];

// Type narrowing para processar cada tipo
valores.forEach(valor => {
  if (valor === null) {
    console.log("Campo vazio");
  } else if (typeof valor === "string") {
    console.log("Texto:", valor);
  } else if (typeof valor === "number") {
    console.log("Número:", valor);
  } else {
    console.log("Booleano:", valor);
  }
});
```

#### 3. **Resultado de Sucesso/Erro**

Problema: Funções podem retornar sucesso ou erro:

```typescript
type Resultado = { sucesso: true; dados: string } | { sucesso: false; erro: string };

let resultados: Resultado[] = [
  { sucesso: true, dados: "OK" },
  { sucesso: false, erro: "Falhou" },
  { sucesso: true, dados: "Concluído" }
];

// Discriminated union: refinar tipo baseado em propriedade
resultados.forEach(resultado => {
  if (resultado.sucesso) {
    console.log("Dados:", resultado.dados); // TypeScript sabe que 'dados' existe
  } else {
    console.log("Erro:", resultado.erro); // TypeScript sabe que 'erro' existe
  }
});
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Union Type em Arrays**: Sintaxe `(T1 | T2 | ... | Tn)[]`
2. **Heterogeneidade Controlada**: Apenas tipos declarados são permitidos
3. **Type Narrowing**: Refinar tipo de elemento específico com type guards
4. **Intersection de Métodos**: Apenas métodos comuns a todos tipos são diretamente acessíveis
5. **Discriminated Unions**: Propriedades discriminantes para type narrowing automático

### Pilares Fundamentais

- **Union Type**: Combinação de múltiplos tipos com `|`
- **Type Guards**: `typeof`, `instanceof`, custom type predicates
- **Type Narrowing**: Refinar tipo baseado em verificações
- **Parentheses Requirement**: `(T1 | T2)[]` != `T1 | T2[]`
- **Common Operations**: Operações devem funcionar em todos tipos ou usar narrowing

---

## 🧠 Fundamentos Teóricos

### Sintaxe de Union Types em Arrays

```typescript
// ✅ Correto: parênteses ao redor da union
let valores: (string | number)[] = [1, "texto", 2];

// ❌ ERRO: sem parênteses = significado diferente!
let valores: string | number[] = [1, "texto"];
// Isso significa: "string OU array de numbers"
// NÃO: "array de (string ou number)"

// Múltiplos tipos na union
let misturado: (string | number | boolean | null)[] = [
  "texto",
  42,
  true,
  null
];

// Com sintaxe genérica
let valores: Array<string | number> = [1, "texto", 2];
```

### Diferença Crítica: `(T1 | T2)[]` vs. `T1 | T2[]`

```typescript
// TIPO 1: Array de (string ou number)
let tipo1: (string | number)[] = [1, "a", 2, "b"];
// Cada elemento pode ser string OU number

// TIPO 2: String OU array de numbers
let tipo2: string | number[];
tipo2 = "texto";      // OK: é string
tipo2 = [1, 2, 3];    // OK: é number[]
// tipo2 = ["a", 1];  // ERRO: não é nem string nem number[]

// TIPO 3: Array de string OU array de number
let tipo3: string[] | number[];
tipo3 = ["a", "b"];   // OK: string[]
tipo3 = [1, 2];       // OK: number[]
// tipo3 = ["a", 1];  // ERRO: não é homogêneo
```

**Regra**: **SEMPRE use parênteses** ao redor da union em arrays heterogêneos.

### Type Narrowing com typeof

```typescript
let valores: (string | number)[] = [1, "texto", 2, "outro"];

valores.forEach(valor => {
  // Antes do narrowing: tipo é 'string | number'
  // valor.toUpperCase(); // ERRO: number não tem toUpperCase
  
  // Type narrowing com typeof
  if (typeof valor === "string") {
    // Dentro: tipo refinado para 'string'
    console.log(valor.toUpperCase()); // OK!
  } else {
    // Dentro: tipo refinado para 'number'
    console.log(valor.toFixed(2)); // OK!
  }
});
```

### Type Guards Complexos

```typescript
type Valor = string | number | boolean | null | undefined;

let valores: Valor[] = ["texto", 42, true, null, undefined];

valores.forEach(valor => {
  // Múltiplas verificações
  if (valor === null) {
    console.log("Valor nulo");
  } else if (valor === undefined) {
    console.log("Valor indefinido");
  } else if (typeof valor === "string") {
    console.log("String:", valor.length);
  } else if (typeof valor === "number") {
    console.log("Number:", valor.toFixed(2));
  } else {
    // Aqui, TypeScript sabe que só pode ser boolean
    console.log("Boolean:", valor ? "verdadeiro" : "falso");
  }
});
```

### Discriminated Unions em Arrays

```typescript
// Union discriminada: propriedade 'tipo' discrimina
type Forma = 
  | { tipo: "circulo"; raio: number }
  | { tipo: "retangulo"; largura: number; altura: number }
  | { tipo: "triangulo"; base: number; altura: number };

let formas: Forma[] = [
  { tipo: "circulo", raio: 10 },
  { tipo: "retangulo", largura: 20, altura: 30 },
  { tipo: "triangulo", base: 15, altura: 25 }
];

// Type narrowing baseado em propriedade discriminante
formas.forEach(forma => {
  switch (forma.tipo) {
    case "circulo":
      // TypeScript sabe: forma é { tipo: "circulo"; raio: number }
      console.log("Área círculo:", Math.PI * forma.raio ** 2);
      break;
    case "retangulo":
      // TypeScript sabe: forma é { tipo: "retangulo"; largura: number; altura: number }
      console.log("Área retângulo:", forma.largura * forma.altura);
      break;
    case "triangulo":
      // TypeScript sabe: forma é { tipo: "triangulo"; base: number; altura: number }
      console.log("Área triângulo:", (forma.base * forma.altura) / 2);
      break;
  }
});
```

---

## 🔍 Análise Conceitual Profunda

### Operações em Arrays Heterogêneos

#### Operações Seguras (Comuns a Todos Tipos)

```typescript
let valores: (string | number)[] = [1, "texto", 2];

// ✅ Métodos de array: sempre disponíveis
valores.length;        // number
valores.push(3);       // OK
valores.push("novo");  // OK
valores.forEach(...);  // OK

// ✅ Operações que funcionam em ambos tipos
valores.forEach(valor => {
  console.log(valor.toString()); // OK: string e number têm toString()
  console.log(typeof valor);     // OK: typeof funciona em qualquer tipo
});
```

#### Operações Requerem Type Narrowing

```typescript
let valores: (string | number)[] = [1, "texto", 2];

// ❌ ERRO: método específico de string
// valores.forEach(v => v.toUpperCase());

// ✅ OK: com type narrowing
valores.forEach(v => {
  if (typeof v === "string") {
    console.log(v.toUpperCase());
  }
});

// ❌ ERRO: método específico de number
// valores.forEach(v => v.toFixed(2));

// ✅ OK: com type narrowing
valores.forEach(v => {
  if (typeof v === "number") {
    console.log(v.toFixed(2));
  }
});
```

### Métodos de Array com Union Types

```typescript
let valores: (string | number)[] = [1, "a", 2, "b", 3];

// map: preserva union type
let transformados = valores.map(v => v);
// Tipo: (string | number)[]

// map com type narrowing
let strings = valores.map(v => {
  if (typeof v === "string") {
    return v.toUpperCase();
  }
  return v.toString();
});
// Tipo: string[]

// filter: refina tipo com type predicate
function eNumero(valor: string | number): valor is number {
  return typeof valor === "number";
}

let numeros = valores.filter(eNumero);
// Tipo: number[] (refinado!)

// filter sem type predicate: preserva union
let filtrados = valores.filter(v => typeof v === "number");
// Tipo: (string | number)[] (não refina automaticamente)
```

### Padrões Comuns

#### Pattern 1: Processar Cada Tipo Diferentemente

```typescript
type DadoAPI = string | number | null;

let dados: DadoAPI[] = ["texto", 42, null, "outro", 99];

dados.forEach(dado => {
  if (dado === null) {
    console.log("Valor ausente");
  } else if (typeof dado === "string") {
    console.log(`Texto: ${dado} (${dado.length} caracteres)`);
  } else {
    console.log(`Número: ${dado.toFixed(2)}`);
  }
});
```

#### Pattern 2: Separar por Tipo

```typescript
let misturado: (string | number)[] = [1, "a", 2, "b", 3, "c"];

// Separar em arrays homogêneos
let numeros: number[] = misturado.filter((v): v is number => typeof v === "number");
let strings: string[] = misturado.filter((v): v is string => typeof v === "string");

console.log(numeros); // [1, 2, 3]
console.log(strings); // ["a", "b", "c"]
```

#### Pattern 3: Converter Todos para Tipo Comum

```typescript
let valores: (string | number)[] = [1, "42", 2, "99"];

// Converter todos para string
let todosStrings: string[] = valores.map(v => v.toString());

// Converter todos para number (com parsing)
let todosNumeros: number[] = valores.map(v => 
  typeof v === "number" ? v : parseFloat(v)
);
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Arrays Heterogêneos

#### Cenário 1: Dados de API com Tipos Variados

```typescript
interface CelulaTabela {
  valor: string | number | boolean | null;
}

let linha: CelulaTabela[] = [
  { valor: "Nome" },
  { valor: 25 },
  { valor: true },
  { valor: null }
];
```

#### Cenário 2: Resultados com Sucesso/Erro

```typescript
type Resultado<T> = 
  | { ok: true; value: T }
  | { ok: false; error: string };

let resultados: Resultado<string>[] = [
  { ok: true, value: "dados" },
  { ok: false, error: "falha" }
];
```

### Quando NÃO Usar

#### ❌ Evite quando tipos não têm relação lógica

```typescript
// ❌ Ruim: tipos completamente diferentes sem relação
let confuso: (string | number | Function | RegExp)[] = [
  "texto",
  42,
  () => {},
  /pattern/
];
// Difícil de trabalhar, sem semântica clara
```

#### ✅ Prefira estruturas mais específicas

```typescript
// ✅ Melhor: objeto com propriedades tipadas
interface Configuracao {
  nome: string;
  idade: number;
  ativo: boolean;
}

let config: Configuracao = {
  nome: "Ana",
  idade: 25,
  ativo: true
};
```

---

## ⚠️ Limitações e Armadilhas

### Armadilha 1: Esquecer Parênteses

```typescript
// ❌ ERRO: significado diferente!
let errado: string | number[] = [1, "texto"];
// Isso é: string OU number[]

// ✅ Correto
let correto: (string | number)[] = [1, "texto"];
// Isso é: array de (string ou number)
```

### Armadilha 2: Não Usar Type Narrowing

```typescript
let valores: (string | number)[] = [1, "a", 2];

// ❌ ERRO: toUpperCase não existe em number
// valores.forEach(v => console.log(v.toUpperCase()));

// ✅ Correto: com narrowing
valores.forEach(v => {
  if (typeof v === "string") {
    console.log(v.toUpperCase());
  }
});
```

### Armadilha 3: filter sem Type Predicate

```typescript
let misturado: (string | number)[] = [1, "a", 2, "b"];

// ❌ Tipo não é refinado
let numeros = misturado.filter(v => typeof v === "number");
// Tipo: (string | number)[] (não refinado)

// ✅ Com type predicate: refina tipo
let numeros = misturado.filter((v): v is number => typeof v === "number");
// Tipo: number[] (refinado!)
```

---

## 🔗 Interconexões Conceituais

### Relação com Union Types

Arrays heterogêneos aplicam **union types** a coleções:

```typescript
// Union type simples
let valor: string | number = "texto";

// Union type em array
let valores: (string | number)[] = [1, "texto", 2];
```

### Relação com Type Guards

Type guards são **essenciais** para trabalhar com arrays heterogêneos:

```typescript
function processar(valores: (string | number)[]) {
  valores.forEach(v => {
    // Type guard necessário
    if (typeof v === "string") {
      // ...
    }
  });
}
```

---

## 🚀 Próximos Conceitos

1. **Arrays de objetos** - Estruturas complexas em arrays
2. **Readonly arrays** - Imutabilidade
3. **Tuplas** - Arrays com tipos fixos por posição
4. **Discriminated unions avançadas** - Pattern matching

---

## 📚 Conclusão

Arrays com múltiplos tipos em TypeScript equilibram **flexibilidade** e **segurança**. Através de **union types**, declaramos explicitamente quais tipos são permitidos. **Type narrowing** com guards permite trabalhar com tipos específicos quando necessário.

Use arrays heterogêneos quando dados realmente têm tipos variados (APIs, formulários, resultados). Para dados estruturados, prefira **objetos com propriedades tipadas** ou **tuplas**.

Domine **type guards** e **discriminated unions** para trabalhar eficientemente com arrays heterogêneos mantendo type safety completa.
