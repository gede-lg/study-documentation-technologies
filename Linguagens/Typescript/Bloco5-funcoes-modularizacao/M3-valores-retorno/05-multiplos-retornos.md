# Múltiplos Retornos (usando union/tuple)

## 🎯 Introdução e Definição

### Definição Conceitual

**Múltiplos retornos** em TypeScript referem-se à capacidade de uma função retornar diferentes tipos ou estruturas de valores dependendo de sua lógica interna ou parâmetros de entrada. Isso é modelado através de **union types** (quando a função pode retornar um tipo OU outro) ou **tuple types** (quando a função retorna múltiplos valores simultaneamente em uma estrutura ordenada).

Conceitualmente, múltiplos retornos representam **polimorfismo de valor de retorno**: a mesma função pode produzir saídas de naturezas diferentes, e o sistema de tipos captura todas essas possibilidades de forma segura. Union types expressam alternativas (A ou B), enquanto tuples expressam combinações (A e B juntos).

### Contexto Histórico e Motivação

JavaScript sempre permitiu retornos flexíveis - uma função pode retornar string, number, objeto ou null em diferentes execuções. Essa flexibilidade é poderosa mas perigosa: o caller não sabe o que esperar sem ler toda a implementação.

**Union Types:** Conceito vindo de linguagens funcionais (ML, Haskell) onde tipos soma (sum types) expressam "um de vários possíveis tipos". TypeScript adotou unions para modelar esse padrão JavaScript comum.

**Tuple Types:** Inspirados em Python, Haskell e outras linguagens que permitem retornar múltiplos valores agrupados. TypeScript formalizou tuplas para modelar arrays JavaScript com tipos fixos em cada posição.

A motivação é **type safety em padrões reais**: capturar idiomas JavaScript comuns (retornar valor ou null, retornar múltiplos valores em array) com verificação estática.

### Problema Fundamental que Resolve

Múltiplos retornos resolvem desafios críticos:

**1. Modelagem de Alternativas:** Funções que podem falhar (retornar valor ou null) são expressas seguramente com unions.

**2. Retornos Complexos:** Funções que precisam retornar múltiplos dados relacionados podem usar tuples ao invés de objetos verbosos.

**3. Padrões de Erro:** `Result<T, E>` pattern (sucesso ou erro) é implementável com unions.

**4. Decomposição de Valores:** Tuples permitem destructuring type-safe de múltiplos retornos.

**5. Type Narrowing:** Compilador infere qual tipo está presente em runtime através de guards.

### Importância no Ecossistema

Múltiplos retornos são fundamentais porque:

- **Padrão Idiomático:** Comum em JavaScript (ex: `getElementById` retorna `HTMLElement | null`)
- **Error Handling Alternativo:** Union types oferecem alternativa a exceções
- **Hooks do React:** useState retorna tuple `[state, setState]`
- **APIs Funcionais:** Funções que retornam múltiplos valores sem criar objetos

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Union Types:** Expressam "tipo A OU tipo B OU tipo C"
2. **Tuple Types:** Expressam "tipo A E tipo B juntos, em ordem específica"
3. **Type Narrowing:** Determinar qual tipo da union está presente
4. **Destructuring:** Extrair valores de tuples de forma type-safe

### Pilares Fundamentais

- **Tipos Soma (Union):** Alternativas mutuamente exclusivas
- **Tipos Produto (Tuple):** Combinação de múltiplos valores
- **Type Guards:** Verificações que refinam unions
- **Structural Typing:** TypeScript verifica compatibilidade estrutural

### Visão Geral das Nuances

- **Unions com null/undefined:** Padrão comum para valores opcionais
- **Discriminated Unions:** Unions com campo discriminador para pattern matching
- **Tuples vs Arrays:** Tuples têm comprimento e tipos fixos; arrays são homogêneos

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Union Types

Quando TypeScript encontra union type no retorno:

**1. Type Collection:** Identifica todos os tipos possíveis na union (ex: `string | number | null`)

**2. Usage Checking:** No ponto de uso, apenas operações válidas para **todos** os tipos da union são permitidas sem narrowing.

**3. Type Narrowing:** Com type guards (`typeof`, `instanceof`, checks customizados), TypeScript refina o tipo para um ramo específico da union.

**4. Assignability:** Unions seguem regra: se `T` é assignable a `U`, então `T` é assignable a `U | V`.

#### Tuple Types

Para tuples:

**1. Position Tracking:** TypeScript rastreia tipo de cada posição na tuple.

**2. Length Checking:** Comprimento é parte do tipo. Tuple `[string, number]` tem exatamente 2 elementos.

**3. Destructuring Safety:** Ao desestruturar, cada variável recebe tipo da posição correspondente.

**4. Array Compatibility:** Tuples são subtipos de arrays, mas com garantias adicionais.

### Princípios e Conceitos Subjacentes

#### Sum Types (Union)

Na teoria de tipos, sum types (também chamados variant types ou tagged unions) representam "um de vários possíveis tipos":

```
type Result = Success | Failure
```

Valores de `Result` são **ou** `Success` **ou** `Failure`, nunca ambos.

#### Product Types (Tuple)

Product types representam "múltiplos valores simultaneamente":

```
type Pair = [string, number]
```

Valores de `Pair` contêm **tanto** `string` **quanto** `number`.

#### Type Algebra

Unions são "soma" (|), tuples/intersections são "produto" (&). Isso forma uma álgebra de tipos:

```typescript
type A = string | number; // Soma
type B = [string, number]; // Produto
```

### Modelo Mental para Compreensão

**Union Types:** Pense em uma **caixa misteriosa** que contém um de vários objetos possíveis. Você sabe que é "livro OU caneta OU caderno", mas precisa abrir (type guard) para saber qual especificamente.

**Tuple Types:** Pense em um **conjunto ordenado** onde cada posição tem significado específico. Como uma ficha cadastral: [nome, idade, email] - ordem importa.

## 🔍 Análise Conceitual Profunda

### Union Types: Sintaxe Básica

```typescript
// Função que retorna string OU number
function processar(entrada: string): string | number {
  const numero = parseFloat(entrada);
  if (isNaN(numero)) {
    return entrada; // Retorna string
  }
  return numero; // Retorna number
}

// Uso - tipo é union
const resultado = processar("42");
// resultado: string | number

// Operações limitadas sem narrowing
console.log(resultado.toString()); // OK - existe em ambos
// console.log(resultado.toUpperCase()); // ❌ Erro - só existe em string
```

**Análise conceitual:** Union limita operações ao comum entre tipos. Narrowing é necessário para acessar métodos específicos.

### Type Narrowing com Type Guards

```typescript
function processar(entrada: string): string | number {
  const numero = parseFloat(entrada);
  return isNaN(numero) ? entrada : numero;
}

const resultado = processar("100");

// Type guard com typeof
if (typeof resultado === "string") {
  console.log(resultado.toUpperCase()); // resultado: string aqui
} else {
  console.log(resultado.toFixed(2)); // resultado: number aqui
}
```

**Fundamento teórico:** Type guards refinam o tipo. Dentro do `if`, TypeScript sabe que `resultado` é `string`; no `else`, é `number`.

### Union com null/undefined

```typescript
// Padrão comum: valor ou null
function buscarUsuario(id: number): { nome: string; email: string } | null {
  if (id > 0) {
    return { nome: "Ana", email: "ana@example.com" };
  }
  return null;
}

// Uso seguro
const usuario = buscarUsuario(1);

if (usuario !== null) {
  console.log(usuario.nome); // usuario: objeto aqui
} else {
  console.log("Usuário não encontrado");
}

// Ou com optional chaining
console.log(usuario?.nome); // string | undefined
```

**Conceito crucial:** `T | null` expressa "pode estar ausente". É mais seguro que `any` e documenta possibilidade de null.

### Discriminated Unions (Tagged Unions)

```typescript
// Union com campo discriminador
type Sucesso = {
  tipo: "sucesso";
  dados: string;
};

type Erro = {
  tipo: "erro";
  mensagem: string;
};

type Resultado = Sucesso | Erro;

function executar(): Resultado {
  const aleatorio = Math.random();
  if (aleatorio > 0.5) {
    return { tipo: "sucesso", dados: "OK" };
  }
  return { tipo: "erro", mensagem: "Falhou" };
}

// Pattern matching type-safe
const resultado = executar();

if (resultado.tipo === "sucesso") {
  console.log(resultado.dados); // resultado: Sucesso
} else {
  console.log(resultado.mensagem); // resultado: Erro
}
```

**Análise profunda:** Discriminated unions usam campo literal (aqui `tipo`) para distinguir qual tipo da union está presente. TypeScript infere automaticamente.

### Tuple Types: Sintaxe Básica

```typescript
// Tuple com tipos fixos em posições específicas
function obterCoordenadas(): [number, number] {
  return [10, 20]; // [x, y]
}

const coordenadas = obterCoordenadas();
const x = coordenadas[0]; // x: number
const y = coordenadas[1]; // y: number

// Tuple com tipos diferentes
function obterUsuario(): [string, number, boolean] {
  return ["Ana", 25, true]; // [nome, idade, ativo]
}

const usuario = obterUsuario();
const nome = usuario[0]; // nome: string
const idade = usuario[1]; // idade: number
const ativo = usuario[2]; // ativo: boolean
```

**Fundamento teórico:** Tuples são arrays com tipos fixos por posição. TypeScript sabe exatamente o tipo de cada índice.

### Destructuring de Tuples

```typescript
// Tuple retornando múltiplos valores
function dividir(a: number, b: number): [number, number] {
  const quociente = Math.floor(a / b);
  const resto = a % b;
  return [quociente, resto];
}

// Destructuring type-safe
const [quociente, resto] = dividir(17, 5);
// quociente: number, resto: number

console.log(`${quociente} com resto ${resto}`); // "3 com resto 2"
```

**Conceito avançado:** Destructuring de tuples é type-safe. Cada variável recebe o tipo correto automaticamente.

### Tuples com Elementos Opcionais

```typescript
// Tuple com elemento opcional
function buscarProduto(id: number): [string, number?] {
  if (id > 0) {
    return ["Produto", 99.90]; // [nome, preço]
  }
  return ["Produto não encontrado"]; // Sem preço
}

const [nome1, preco1] = buscarProduto(1);
// nome1: string, preco1: number | undefined

const [nome2, preco2] = buscarProduto(-1);
// nome2: string, preco2: number | undefined
```

**Análise teórica:** `?` em tuple indica elemento opcional. Tipo torna-se `T | undefined`.

### Tuples com Rest Elements

```typescript
// Tuple com rest element
function criarLista(primeiro: string, ...resto: number[]): [string, ...number[]] {
  return [primeiro, ...resto];
}

const lista1 = criarLista("Item", 1, 2, 3);
// lista1: [string, ...number[]]

const lista2 = criarLista("Outro");
// lista2: [string, ...number[]]
```

**Fundamento conceitual:** Rest elements permitem tuples de comprimento variável mantendo tipos das primeiras posições.

### Tuples Readonly

```typescript
// Tuple imutável
function obterConfig(): readonly [string, number] {
  return ["localhost", 3000];
}

const config = obterConfig();
// config[0] = "outra"; // ❌ Erro - readonly

const [host, porta] = config; // OK - destructuring permitido
```

**Conceito crucial:** `readonly` previne mutação da tuple. Útil para garantir imutabilidade.

### Padrão React Hooks

```typescript
// Simulando useState do React
function useState<T>(inicial: T): [T, (novo: T) => void] {
  let estado = inicial;
  
  const setEstado = (novo: T) => {
    estado = novo;
  };
  
  return [estado, setEstado];
}

// Uso
const [contador, setContador] = useState(0);
// contador: number, setContador: (novo: number) => void

setContador(10);
```

**Análise profunda:** React usa tuples para retornar estado e setter. Destructuring permite nomear livremente.

## 🎯 Aplicabilidade e Contextos

### Quando Usar Union Types

**1. Valores Opcionais**
```typescript
function buscar(id: number): Dados | null {
  return id > 0 ? { valor: "dados" } : null;
}
```

**Raciocínio:** Modelar possibilidade de ausência.

**2. Múltiplos Tipos de Sucesso**
```typescript
function processar(entrada: string): string | number | boolean {
  // Lógica que pode retornar diferentes tipos
}
```

**Raciocínio:** Função logicamente pode produzir tipos diferentes.

**3. Result Pattern**
```typescript
type Result<T, E> = { ok: true; valor: T } | { ok: false; erro: E };
```

**Raciocínio:** Modelar sucesso ou falha sem exceções.

### Quando Usar Tuples

**1. Múltiplos Valores Relacionados**
```typescript
function obterDimensoes(): [number, number, number] {
  return [largura, altura, profundidade];
}
```

**Raciocínio:** Retornar valores múltiplos sem criar objeto.

**2. Pares ou Triplas**
```typescript
function parsear(texto: string): [string, number] {
  return [nome, idade];
}
```

**Raciocínio:** Valores têm ordem e significado por posição.

**3. Hooks Pattern**
```typescript
function useEstado(): [Valor, Setter] {
  return [estado, setEstado];
}
```

**Raciocínio:** Permitir naming flexível via destructuring.

## ⚠️ Limitações e Considerações Teóricas

### Union Types: Operações Limitadas

Sem narrowing, apenas operações comuns são permitidas:

```typescript
function f(): string | number {
  return "teste";
}

const r = f();
r.toUpperCase(); // ❌ Erro - pode ser number
```

### Tuples: Legibilidade

Tuples com muitos elementos tornam-se confusas:

```typescript
// ❌ Difícil de entender
function obter(): [string, number, boolean, string, number] { }

// ✅ Melhor - usar objeto
function obter(): { nome: string; idade: number; /* ... */ } { }
```

### Performance: Tuples vs Objetos

Tuples são arrays em runtime. Para muitos elementos, objetos podem ser mais claros.

## 🔗 Interconexões Conceituais

**Relação com Type Guards:** Unions requerem narrowing; guards são mecanismo principal.

**Relação com Generics:** Tuples e unions podem ser parametrizadas com genéricos.

**Relação com Destructuring:** Tuples aproveitam destructuring JavaScript com type safety.

## 🚀 Evolução e Próximos Conceitos

Dominar múltiplos retornos prepara para:
- **Discriminated Unions Avançadas:** Pattern matching complexo
- **Conditional Types:** Tipos que dependem de condições
- **Mapped Types:** Transformar unions/tuples em outros tipos
- **Variadic Tuple Types:** Tuples com comprimento variável genérico
