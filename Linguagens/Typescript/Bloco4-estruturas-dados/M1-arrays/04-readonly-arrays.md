# Readonly Arrays em TypeScript: Imutabilidade, ReadonlyArray<T> e Constância em Coleções

## 🎯 Introdução e Definição

### Definição Conceitual

Um **readonly array** (array somente leitura) em TypeScript é um tipo especial de array onde **nenhuma operação mutante é permitida** após sua criação. Conceitualmente, é uma **estrutura de dados imutável** - uma vez construída, seu conteúdo não pode ser alterado, adicionado ou removido.

TypeScript oferece duas formas equivalentes de declarar arrays readonly:

```typescript
// Sintaxe 1: readonly modificador
let numeros: readonly number[] = [1, 2, 3, 4, 5];

// Sintaxe 2: ReadonlyArray<T> tipo genérico
let numeros: ReadonlyArray<number> = [1, 2, 3, 4, 5];
```

**Garantias de readonly arrays**:
- ❌ **Não pode** adicionar elementos (`push`, `unshift`)
- ❌ **Não pode** remover elementos (`pop`, `shift`, `splice`)
- ❌ **Não pode** modificar elementos por índice (`arr[0] = valor`)
- ❌ **Não pode** ordenar in-place (`sort`, `reverse`)
- ✅ **Pode** ler elementos (`arr[0]`, `arr.length`)
- ✅ **Pode** iterar (`forEach`, `map`, `filter`)
- ✅ **Pode** criar novos arrays (`slice`, `concat`)

**Conceito profundo**: Readonly arrays implementam **imutabilidade estrutural** - a referência e o conteúdo são imutáveis. É diferente de `const` (que só torna a **referência** imutável).

```typescript
// const: referência imutável, conteúdo mutável
const mutavel: number[] = [1, 2, 3];
mutavel.push(4);        // ✅ OK: modifica conteúdo
mutavel[0] = 10;        // ✅ OK: modifica elemento
// mutavel = [5, 6];    // ❌ ERRO: não pode reatribuir

// readonly: referência e conteúdo imutáveis
const imutavel: readonly number[] = [1, 2, 3];
// imutavel.push(4);    // ❌ ERRO: push não existe
// imutavel[0] = 10;    // ❌ ERRO: índice é readonly
// imutavel = [5, 6];   // ❌ ERRO: não pode reatribuir (const)
```

### Contexto Histórico e Motivação

A **imutabilidade** é um conceito fundamental em programação funcional, reconhecido desde os anos 1950 com **Lisp**. Linguagens modernas como **Haskell**, **Clojure**, **Elm** são completamente imutáveis por padrão.

**JavaScript/TypeScript** são mutáveis por padrão, mas reconhecem benefícios da imutabilidade:

**Antes de `readonly` (TypeScript < 3.4)**:
```typescript
// Sem readonly: confiar em convenção/disciplina
const CONSTANTES = [1, 2, 3]; // Convenção: MAIÚSCULAS = não modificar
// Mas nada impede:
CONSTANTES.push(4); // Permitido! Convenção violada
```

**TypeScript 3.4 (2019)** introduziu **`readonly` modifier** para arrays e tuplas:
```typescript
// Com readonly: compilador impede mutação
const CONSTANTES: readonly number[] = [1, 2, 3];
// CONSTANTES.push(4); // ERRO: push não existe em readonly
```

**Motivação**:
1. **Previsibilidade**: Dados imutáveis não mudam inesperadamente
2. **Thread-safety**: Dados compartilhados entre threads sem race conditions
3. **Debugging**: Histórico de estado não é perdido por mutações
4. **Performance**: Em alguns casos, imutabilidade permite otimizações
5. **Programação funcional**: Paradigma funcional requer imutabilidade

### Problema Fundamental que Resolve

#### 1. **Mutação Acidental de Constantes**

Problema: `const` não previne mutação de conteúdo de arrays:

```typescript
// ❌ Problema: const não impede mutação de conteúdo
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
DIAS_SEMANA.push("Oitavo dia"); // Permitido! Mas incorreto
DIAS_SEMANA[0] = "Primeiro";    // Permitido! Mas incorreto

// ✅ Solução: readonly impede mutação
const DIAS_SEMANA: readonly string[] = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
// DIAS_SEMANA.push("Oitavo dia"); // ERRO!
// DIAS_SEMANA[0] = "Primeiro";    // ERRO!
```

**Conceito**: `readonly` garante que **valores constantes permanecem constantes**.

#### 2. **Proteção contra Mutação por Funções**

Problema: Funções podem modificar arrays passados como parâmetro:

```typescript
function processarDados(dados: number[]): void {
  dados.sort(); // MODIFICA array original!
  dados.push(999); // MODIFICA array original!
}

let numeros = [3, 1, 2];
processarDados(numeros);
console.log(numeros); // [1, 2, 3, 999] - MODIFICADO!

// ✅ Solução: readonly parameter
function processarDadosSeguro(dados: readonly number[]): void {
  // dados.sort();    // ERRO: sort não existe
  // dados.push(999); // ERRO: push não existe
  
  // Para modificar, criar novo array:
  const ordenados = [...dados].sort();
}

processarDadosSeguro(numeros); // numeros permanece inalterado
```

**Conceito**: `readonly` documenta e garante que função **não modifica** parâmetros.

#### 3. **Estado Imutável em Aplicações**

Problema: Em arquiteturas como Redux/Vuex, estado deve ser imutável:

```typescript
// Estado da aplicação
interface AppState {
  usuarios: readonly Usuario[];
  configuracoes: readonly Configuracao[];
}

let estado: AppState = {
  usuarios: [{ id: 1, nome: "Ana" }],
  configuracoes: [{ chave: "tema", valor: "escuro" }]
};

// ❌ ERRO: não pode modificar
// estado.usuarios.push({ id: 2, nome: "Bruno" });

// ✅ Criar novo estado
estado = {
  ...estado,
  usuarios: [...estado.usuarios, { id: 2, nome: "Bruno" }]
};
```

**Conceito**: `readonly` **força** arquiteturas imutáveis.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Imutabilidade Estrutural**: Conteúdo não pode ser modificado
2. **Dois Sintaxes**: `readonly T[]` e `ReadonlyArray<T>`
3. **Métodos Não-Mutantes**: Apenas operações que não modificam
4. **Covariância**: `T[]` é atribuível a `readonly T[]`
5. **Type Safety**: Compilador previne operações mutantes

### Pilares Fundamentais

- **Readonly Modifier**: `readonly` antes do tipo
- **ReadonlyArray Type**: Tipo genérico built-in
- **Imutabilidade Profunda**: Apenas primeiro nível (shallow)
- **Operações Funcionais**: `map`, `filter`, `slice` funcionam
- **Criação de Novos Arrays**: Spread operator, métodos funcionais

---

## 🧠 Fundamentos Teóricos

### Sintaxes de Readonly Arrays

#### Sintaxe 1: `readonly` Modifier

```typescript
// Primitivos
let numeros: readonly number[] = [1, 2, 3];
let textos: readonly string[] = ["a", "b", "c"];

// Objetos
interface Usuario {
  id: number;
  nome: string;
}

let usuarios: readonly Usuario[] = [
  { id: 1, nome: "Ana" },
  { id: 2, nome: "Bruno" }
];

// Arrays multidimensionais
let matriz: readonly (readonly number[])[] = [
  [1, 2, 3],
  [4, 5, 6]
];
```

#### Sintaxe 2: `ReadonlyArray<T>`

```typescript
// Primitivos
let numeros: ReadonlyArray<number> = [1, 2, 3];
let textos: ReadonlyArray<string> = ["a", "b", "c"];

// Objetos
let usuarios: ReadonlyArray<Usuario> = [
  { id: 1, nome: "Ana" },
  { id: 2, nome: "Bruno" }
];

// Arrays multidimensionais
let matriz: ReadonlyArray<ReadonlyArray<number>> = [
  [1, 2, 3],
  [4, 5, 6]
];
```

**Equivalência**: Ambas sintaxes são funcionalmente idênticas.

**Preferência da comunidade**: `readonly T[]` por ser mais concisa.

### Operações Permitidas

```typescript
const numeros: readonly number[] = [1, 2, 3, 4, 5];

// ✅ Leitura de elementos
console.log(numeros[0]);        // 1
console.log(numeros.length);    // 5

// ✅ Iteração
numeros.forEach(n => console.log(n));
for (const n of numeros) {
  console.log(n);
}

// ✅ Métodos funcionais (retornam novo array)
const dobrados = numeros.map(n => n * 2);      // [2, 4, 6, 8, 10]
const pares = numeros.filter(n => n % 2 === 0); // [2, 4]
const soma = numeros.reduce((a, b) => a + b, 0); // 15

// ✅ Métodos que criam novo array
const copia = numeros.slice();               // [1, 2, 3, 4, 5]
const concatenado = numeros.concat([6, 7]);  // [1, 2, 3, 4, 5, 6, 7]

// ✅ Busca
const primeiro = numeros.find(n => n > 2);   // 3
const indice = numeros.findIndex(n => n > 2); // 2
const contem = numeros.includes(3);          // true

// ✅ Testes
const todosPares = numeros.every(n => n % 2 === 0); // false
const algumPar = numeros.some(n => n % 2 === 0);    // true
```

### Operações Proibidas

```typescript
const numeros: readonly number[] = [1, 2, 3];

// ❌ Adicionar elementos
// numeros.push(4);         // ERRO
// numeros.unshift(0);      // ERRO
// numeros.splice(1, 0, 5); // ERRO

// ❌ Remover elementos
// numeros.pop();           // ERRO
// numeros.shift();         // ERRO
// numeros.splice(1, 1);    // ERRO

// ❌ Modificar elementos
// numeros[0] = 10;         // ERRO

// ❌ Ordenar in-place
// numeros.sort();          // ERRO
// numeros.reverse();       // ERRO

// ❌ Preencher
// numeros.fill(0);         // ERRO
```

### Imutabilidade Profunda vs. Rasa

**Readonly arrays são shallow (rasos)** - apenas o primeiro nível é imutável:

```typescript
interface Pessoa {
  nome: string;
  idade: number;
}

const pessoas: readonly Pessoa[] = [
  { nome: "Ana", idade: 25 }
];

// ❌ Não pode modificar array
// pessoas.push({ nome: "Bruno", idade: 30 }); // ERRO
// pessoas[0] = { nome: "Carlos", idade: 35 }; // ERRO

// ⚠️ MAS pode modificar propriedades dos objetos!
pessoas[0].nome = "Ana Silva";  // ✅ PERMITIDO!
pessoas[0].idade = 26;          // ✅ PERMITIDO!
```

**Solução: Readonly profundo**

```typescript
// Tornar objetos também readonly
interface PessoaReadonly {
  readonly nome: string;
  readonly idade: number;
}

const pessoas: readonly PessoaReadonly[] = [
  { nome: "Ana", idade: 25 }
];

// ❌ Agora propriedades também são readonly
// pessoas[0].nome = "Ana Silva"; // ERRO!
// pessoas[0].idade = 26;         // ERRO!

// Ou usar Readonly utility type
const pessoas: readonly Readonly<Pessoa>[] = [
  { nome: "Ana", idade: 25 }
];
```

---

## 🔍 Análise Conceitual Profunda

### Conversão entre Mutable e Readonly

```typescript
// Mutable → Readonly (sempre permitido - covariância)
let mutavel: number[] = [1, 2, 3];
let readonly: readonly number[] = mutavel; // ✅ OK

// Readonly → Mutable (requer conversão explícita)
let readonly: readonly number[] = [1, 2, 3];
// let mutavel: number[] = readonly; // ❌ ERRO

// Conversões explícitas:

// 1. Spread operator (cria nova cópia)
let mutavel: number[] = [...readonly];

// 2. Array.from (cria nova cópia)
let mutavel: number[] = Array.from(readonly);

// 3. slice (cria nova cópia)
let mutavel: number[] = readonly.slice();

// 4. Type assertion (PERIGOSO - não cria cópia)
let mutavel: number[] = readonly as number[]; // ⚠️ Evite!
```

### Readonly em Parâmetros de Função

```typescript
// Documentar que função NÃO modifica array
function somar(numeros: readonly number[]): number {
  return numeros.reduce((a, b) => a + b, 0);
}

// Aceita tanto mutable quanto readonly
let mutavel = [1, 2, 3];
let readonly: readonly number[] = [1, 2, 3];

somar(mutavel);   // ✅ OK
somar(readonly);  // ✅ OK
```

**Benefícios**:
- **Documentação**: Função declara que não modifica parâmetro
- **Segurança**: Compilador previne mutações acidentais
- **Flexibilidade**: Aceita arrays mutáveis e readonly

### Readonly em Retornos de Função

```typescript
// Retornar readonly para prevenir mutação externa
function obterConstantes(): readonly number[] {
  return [Math.PI, Math.E, Math.SQRT2];
}

const constantes = obterConstantes();
// constantes.push(42); // ❌ ERRO: não pode modificar
```

### Padrões Funcionais com Readonly

#### Imutabilidade em Updates

```typescript
const original: readonly number[] = [1, 2, 3];

// Adicionar elemento (criar novo array)
const comNovo = [...original, 4]; // [1, 2, 3, 4]

// Remover elemento (criar novo array)
const semPrimeiro = original.slice(1); // [2, 3]
const semUltimo = original.slice(0, -1); // [1, 2]

// Modificar elemento (criar novo array)
const modificado = original.map((n, i) => i === 1 ? 999 : n); // [1, 999, 3]

// Substituir elemento
const indice = 1;
const novoValor = 999;
const substituido = [
  ...original.slice(0, indice),
  novoValor,
  ...original.slice(indice + 1)
]; // [1, 999, 3]
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Readonly Arrays

#### Cenário 1: Constantes e Configurações

```typescript
// Dias da semana (nunca mudam)
const DIAS_SEMANA: readonly string[] = [
  "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"
];

// Configurações (read-only)
const CONFIG: readonly { chave: string; valor: string }[] = [
  { chave: "API_URL", valor: "https://api.com" },
  { chave: "TIMEOUT", valor: "5000" }
];
```

#### Cenário 2: Parâmetros de Função (Não-Mutante)

```typescript
function calcularMedia(numeros: readonly number[]): number {
  if (numeros.length === 0) return 0;
  return numeros.reduce((a, b) => a + b, 0) / numeros.length;
}
```

#### Cenário 3: Estado Imutável

```typescript
interface AppState {
  readonly usuarios: readonly Usuario[];
  readonly configuracoes: readonly Configuracao[];
}
```

### Quando NÃO Usar

#### ❌ Quando Mutação é Necessária e Esperada

```typescript
// Cache mutável
let cache: Produto[] = [];
function adicionarAoCache(produto: Produto): void {
  cache.push(produto); // Mutação é o objetivo
}
```

---

## ⚠️ Limitações e Armadilhas

### Armadilha 1: Readonly é Shallow

```typescript
const arr: readonly { valor: number }[] = [{ valor: 1 }];
arr[0].valor = 999; // ✅ PERMITIDO! Propriedade não é readonly
```

### Armadilha 2: Type Assertion Perigosa

```typescript
const readonly: readonly number[] = [1, 2, 3];
const mutavel = readonly as number[]; // ⚠️ Não cria cópia!
mutavel.push(4); // Modifica 'readonly' também!
```

### Armadilha 3: Readonly em Objetos Aninhados

```typescript
interface Config {
  readonly valores: readonly number[];
}

let config: Config = { valores: [1, 2, 3] };
// config.valores.push(4); // ❌ ERRO
// config.valores = [4, 5]; // ❌ ERRO (propriedade readonly)
```

---

## 🔗 Interconexões Conceituais

### Relação com `const`

```typescript
// const: referência imutável
const arr1 = [1, 2, 3];
arr1.push(4); // ✅ OK

// readonly: conteúdo imutável
const arr2: readonly number[] = [1, 2, 3];
// arr2.push(4); // ❌ ERRO
```

### Relação com Readonly Utility Type

```typescript
// Readonly<T>: torna propriedades readonly
type Usuario = {
  nome: string;
  idade: number;
};

type UsuarioReadonly = Readonly<Usuario>;
// { readonly nome: string; readonly idade: number }

// Combinar com arrays
const usuarios: readonly Readonly<Usuario>[] = [
  { nome: "Ana", idade: 25 }
];
```

---

## 🚀 Próximos Conceitos

1. **DeepReadonly**: Readonly recursivo
2. **Immutable.js**: Biblioteca para imutabilidade
3. **Utility types avançados**: Readonly variations
4. **Programação funcional**: Imutabilidade como paradigma

---

## 📚 Conclusão

**Readonly arrays** em TypeScript garantem **imutabilidade estrutural**, prevenindo modificações acidentais. Use `readonly` para:
- Constantes e configurações
- Parâmetros que não devem ser modificados
- Estado imutável em arquiteturas funcionais

Lembre-se que readonly é **shallow** - objetos aninhados requerem `Readonly<T>` adicional. Combine com programação funcional (map, filter, spread) para trabalhar eficientemente com dados imutáveis.
