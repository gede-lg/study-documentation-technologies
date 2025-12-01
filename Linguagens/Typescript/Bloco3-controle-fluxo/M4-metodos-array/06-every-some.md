# every() e some() - Quantificação e Validação em TypeScript: Testes Universais e Existenciais

## 🎯 Introdução e Definição

### Definição Conceitual

Os métodos `every()` e `some()` são **funções de quantificação de alta ordem** que testam se elementos de um array satisfazem um predicado (condição) especificado, retornando um **valor booleano**. Conceitualmente, eles implementam os **quantificadores lógicos** da matemática e lógica formal:

- **`every()`**: Quantificador **universal** (∀, "para todo") - testa se **TODOS** os elementos satisfazem o predicado
- **`some()`**: Quantificador **existencial** (∃, "existe") - testa se **PELO MENOS UM** elemento satisfaz o predicado

Na essência profunda, esses métodos traduzem questões lógicas sobre coleções:
- **every()**: "Todos os elementos têm a propriedade P?" → `∀x ∈ Array: P(x)`
- **some()**: "Existe algum elemento com a propriedade P?" → `∃x ∈ Array: P(x)`

Ambos implementam **short-circuit evaluation** (avaliação de curto-circuito):
- **every()**: Para **no primeiro `false`** (se um falha, todos não satisfazem)
- **some()**: Para **no primeiro `true`** (se um satisfaz, existe um que satisfaz)

Em TypeScript, ambos possuem **suporte a type predicates**, permitindo não apenas testar, mas também **refinar tipos** quando usados em contextos de type guard.

```typescript
const numeros = [2, 4, 6, 8];

// every: todos são pares?
const todosPares = numeros.every(n => n % 2 === 0);
// true (todos satisfazem)

// some: algum é maior que 5?
const algumMaiorQue5 = numeros.some(n => n > 5);
// true (6 e 8 satisfazem)
```

### Contexto Histórico e Motivação

Ambos os métodos foram introduzidos no JavaScript com **ECMAScript 5 (ES5)** em 2009, como parte da expansão funcional dos métodos de array. Sua inspiração vem de conceitos fundamentais da **lógica de predicados** e **programação funcional**.

**Precedentes históricos**:
- **Lógica Formal**: Quantificadores ∀ (universal) e ∃ (existencial) foram formalizados por **Gottlob Frege** e **Giuseppe Peano** no final do século XIX
- **Linguagens Funcionais**: 
  - **Lisp** (1960s): `every` e `some` como operações sobre listas
  - **Haskell**: `all` e `any`
  - **Python**: `all()` e `any()` (built-in functions)
  - **Ruby**: `all?` e `any?`

**Antes do ES5**, validações universais/existenciais exigiam loops imperativos:

```javascript
// Abordagem pré-ES5: testar se todos são pares
var numeros = [2, 4, 6, 8];
var todosPares = true;

for (var i = 0; i < numeros.length; i++) {
  if (numeros[i] % 2 !== 0) {
    todosPares = false;
    break; // Terminação manual
  }
}

// Testar se algum é maior que 5
var algumMaior = false;
for (var i = 0; i < numeros.length; i++) {
  if (numeros[i] > 5) {
    algumMaior = true;
    break;
  }
}
```

Problemas com abordagens anteriores:
- **Verbosidade**: Muito código para expressar conceito simples
- **Gerenciamento de terminação manual**: Necessidade de `break` explícito
- **Mistura de responsabilidades**: Iteração e lógica de teste no mesmo bloco
- **Falta de semântica**: Não expressa claramente "todos" ou "existe algum"

**A motivação fundamental** para `every()` e `some()` foi:

1. **Expressividade lógica**: Corresponder diretamente a quantificadores da lógica formal
2. **Validação declarativa**: Expressar validações de forma clara e concisa
3. **Short-circuit automático**: Terminação precoce sem `break` manual
4. **Composição funcional**: Integrar testes lógicos em pipelines
5. **Type safety**: Em TypeScript, permitir refinamento de tipo com type guards

Com **TypeScript**, `every()` e `some()` ganharam capacidades de **type narrowing**:

```typescript
type Valor = number | string;
const valores: Valor[] = [1, 2, 3, 4];

// Type guard: verifica se todos são números
function eNumero(v: Valor): v is number {
  return typeof v === "number";
}

if (valores.every(eNumero)) {
  // Dentro deste bloco, TypeScript sabe que 'valores' é number[]
  const soma = valores.reduce((acc, n) => acc + n, 0);
}
```

### Problema Fundamental que Resolve

#### 1. **Validação de Todos os Elementos (every)**

Problema: Verificar se **todos** elementos de uma coleção satisfazem critério:

```typescript
interface Usuario {
  nome: string;
  idade: number;
  ativo: boolean;
}

const usuarios: Usuario[] = [
  { nome: "Ana", idade: 25, ativo: true },
  { nome: "Bruno", idade: 30, ativo: true },
  { nome: "Carlos", idade: 35, ativo: true }
];

// Problema: Todos usuários estão ativos?
// ❌ Imperativo: loop com flag
let todosAtivos = true;
for (const u of usuarios) {
  if (!u.ativo) {
    todosAtivos = false;
    break;
  }
}

// ✅ Declarativo: every()
const todosAtivos = usuarios.every(u => u.ativo);
// true
```

**Conceito**: `every()` expressa **validação universal** de forma declarativa.

#### 2. **Verificação de Existência (some)**

Problema: Verificar se **existe pelo menos um** elemento que satisfaz critério:

```typescript
// Problema: Existe algum usuário maior de idade?
// ❌ Imperativo: loop com flag
let algumMaiorIdade = false;
for (const u of usuarios) {
  if (u.idade >= 18) {
    algumMaiorIdade = true;
    break;
  }
}

// ✅ Declarativo: some()
const algumMaiorIdade = usuarios.some(u => u.idade >= 18);
// true
```

**Conceito**: `some()` expressa **verificação existencial** de forma declarativa.

#### 3. **Type Narrowing em Arrays de Union Types**

`every()` com type guard pode **refinar tipo** de todo o array:

```typescript
type Entrada = number | string | null;
const entradas: Entrada[] = [1, 2, 3, 4];

// Type guard
function eNumeroValido(v: Entrada): v is number {
  return typeof v === "number";
}

// every() refina tipo do array
if (entradas.every(eNumeroValido)) {
  // Dentro deste bloco: entradas é inferido como number[]
  const soma = entradas.reduce((acc, n) => acc + n, 0);
  // Sem erro: TypeScript sabe que todos são numbers
}
```

**Conceito profundo**: `every()` com type guard **transforma tipo** de `Array<T | U>` para `Array<T>` quando todos elementos passam no guard.

#### 4. **Validação de Esquemas e Contratos**

```typescript
interface Produto {
  nome: string;
  preco: number;
  estoque: number;
}

const produtos: Produto[] = [...];

// Validar se todos produtos estão em estoque
const todosDisponiveis = produtos.every(p => p.estoque > 0);

// Validar se há algum produto com preço suspeito
const algumPrecoInvalido = produtos.some(p => p.preco <= 0);

// Validar estrutura: todos têm propriedades obrigatórias
const todosValidos = produtos.every(p => 
  p.nome && 
  typeof p.preco === "number" && 
  typeof p.estoque === "number"
);
```

#### 5. **Negações Lógicas (De Morgan)**

Leis de **De Morgan** relacionam `every()` e `some()`:

```
¬(∀x: P(x)) = ∃x: ¬P(x)    // "Não todos satisfazem" = "Existe um que não satisfaz"
¬(∃x: P(x)) = ∀x: ¬P(x)    // "Nenhum satisfaz" = "Todos não satisfazem"
```

Em código:

```typescript
const numeros = [1, 2, 3, 4, 5];

// "Nem todos são pares" = "Existe um ímpar"
const nemTodosPares = !numeros.every(n => n % 2 === 0);
const existeImpar = numeros.some(n => n % 2 !== 0);
// nemTodosPares === existeImpar (sempre)

// "Nenhum é maior que 10" = "Todos são menores ou iguais a 10"
const nenhumMaiorQue10 = !numeros.some(n => n > 10);
const todosMenoresOuIguais10 = numeros.every(n => n <= 10);
// nenhumMaiorQue10 === todosMenoresOuIguais10 (sempre)
```

### Importância no Ecossistema TypeScript

#### **Validação Type-Safe**

`every()` e `some()` são as formas **idiomáticas** de validação em arrays:

```typescript
// ✅ Idiomático e type-safe
const todosAdultos = usuarios.every(u => u.idade >= 18);

// ❌ Imperativo e verboso
let result = true;
for (const u of usuarios) {
  if (u.idade < 18) {
    result = false;
    break;
  }
}
```

#### **Integração com Control Flow Analysis**

TypeScript usa **control flow analysis** com `every()`:

```typescript
type Item = { tipo: "A"; valorA: number } | { tipo: "B"; valorB: string };
const itens: Item[] = [...];

function eTipoA(item: Item): item is Extract<Item, { tipo: "A" }> {
  return item.tipo === "A";
}

if (itens.every(eTipoA)) {
  // Dentro: TypeScript sabe que itens é Array<{tipo: "A"; valorA: number}>
  itens.forEach(item => {
    console.log(item.valorA); // OK: valorA existe
    // console.log(item.valorB); // ERRO: valorB não existe
  });
}
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

#### every()
1. **Quantificador Universal**: Testa se **todos** elementos satisfazem predicado (∀)
2. **Retorno Boolean**: `true` se todos satisfazem, `false` caso contrário
3. **Short-Circuit em false**: Para no primeiro elemento que falha
4. **Array Vazio**: Retorna `true` (vacuously true - "vacuamente verdadeiro")
5. **Type Narrowing**: Com type guard, refina tipo de todo array

#### some()
1. **Quantificador Existencial**: Testa se **pelo menos um** elemento satisfaz predicado (∃)
2. **Retorno Boolean**: `true` se algum satisfaz, `false` se nenhum satisfaz
3. **Short-Circuit em true**: Para no primeiro elemento que satisfaz
4. **Array Vazio**: Retorna `false`
5. **Type Guard Partial**: Não refina tipo do array (apenas indica existência)

### Pilares Fundamentais

- **Predicado**: Função que testa cada elemento (`(element: T) => boolean`)
- **Terminação Precoce**: Ambos implementam short-circuit
- **Imutabilidade**: Array original nunca é modificado
- **Retorno Sempre Boolean**: Nunca `undefined` ou outro valor
- **Dualidade Lógica**: Relacionados por leis de De Morgan

---

## 🧠 Fundamentos Teóricos

### Como Funcionam Internamente

#### Implementação Conceitual de every()

```typescript
Array.prototype.every = function<T>(
  predicate: (value: T, index: number, array: T[]) => boolean,
  thisArg?: any
): boolean {
  const array: T[] = this;
  const length = array.length;
  
  // Array vazio: vacuamente verdadeiro
  if (length === 0) return true;
  
  // Percorre array
  for (let i = 0; i < length; i++) {
    if (i in array) {
      const element = array[i];
      
      // Aplica predicado
      if (!predicate.call(thisArg, element, i, array)) {
        // ENCONTROU UM QUE NÃO SATISFAZ: retorna false imediatamente
        return false;
      }
    }
  }
  
  // TODOS SATISFAZEM: retorna true
  return true;
};
```

**Visualização**:
```
Array: [2, 4, 6, 7, 8]
Predicado: n => n % 2 === 0 (é par?)

Iteração 0: elemento = 2, predicado(2) = true → continua
Iteração 1: elemento = 4, predicado(4) = true → continua
Iteração 2: elemento = 6, predicado(6) = true → continua
Iteração 3: elemento = 7, predicado(7) = FALSE → RETORNA false
// Iteração 4 NÃO É EXECUTADA (short-circuit)

Retorno: false
```

#### Implementação Conceitual de some()

```typescript
Array.prototype.some = function<T>(
  predicate: (value: T, index: number, array: T[]) => boolean,
  thisArg?: any
): boolean {
  const array: T[] = this;
  const length = array.length;
  
  // Array vazio: sempre false
  if (length === 0) return false;
  
  // Percorre array
  for (let i = 0; i < length; i++) {
    if (i in array) {
      const element = array[i];
      
      // Aplica predicado
      if (predicate.call(thisArg, element, i, array)) {
        // ENCONTROU UM QUE SATISFAZ: retorna true imediatamente
        return true;
      }
    }
  }
  
  // NENHUM SATISFAZ: retorna false
  return false;
};
```

**Visualização**:
```
Array: [1, 3, 5, 6, 9]
Predicado: n => n % 2 === 0 (é par?)

Iteração 0: elemento = 1, predicado(1) = false → continua
Iteração 1: elemento = 3, predicado(3) = false → continua
Iteração 2: elemento = 5, predicado(5) = false → continua
Iteração 3: elemento = 6, predicado(6) = TRUE → RETORNA true
// Iteração 4 NÃO É EXECUTADA (short-circuit)

Retorno: true
```

### Princípios e Conceitos Subjacentes

#### 1. **Quantificação Lógica**

Na lógica de predicados:
- **∀x: P(x)** - "Para todo x, P(x) é verdadeiro"
- **∃x: P(x)** - "Existe um x tal que P(x) é verdadeiro"

```typescript
// ∀n ∈ numeros: n > 0
const todosPo sitivos = numeros.every(n => n > 0);

// ∃n ∈ numeros: n > 100
const existeMaiorQue100 = numeros.some(n => n > 100);
```

#### 2. **Vacuous Truth (Verdade Vacuosa)**

Na lógica, uma afirmação sobre um conjunto vazio é **vacuamente verdadeira**:

```typescript
// Array vazio
const vazio: number[] = [];

// "Todos elementos do array vazio são pares" → TRUE (vacuamente)
vazio.every(n => n % 2 === 0); // true

// "Existe elemento par no array vazio" → FALSE
vazio.some(n => n % 2 === 0); // false
```

**Conceito**: `every()` em array vazio é `true` porque **não há contra-exemplo** que refute a afirmação.

#### 3. **Leis de De Morgan**

Relacionam negações de quantificadores:

```typescript
const nums = [1, 2, 3, 4, 5];

// Lei 1: ¬(∀x: P(x)) ≡ ∃x: ¬P(x)
const nemTodosPares = !nums.every(n => n % 2 === 0);
const existeImpar = nums.some(n => n % 2 !== 0);
console.log(nemTodosPares === existeImpar); // true

// Lei 2: ¬(∃x: P(x)) ≡ ∀x: ¬P(x)
const nenhumNegativo = !nums.some(n => n < 0);
const todosPositivos = nums.every(n => n >= 0);
console.log(nenhumNegativo === todosPositivos); // true
```

#### 4. **Short-Circuit Evaluation**

Ambos terminam precocemente:

```typescript
// every: para no primeiro false
[true, true, false, true].every(x => x); // Processou 3 elementos

// some: para no primeiro true
[false, false, true, false].some(x => x); // Processou 3 elementos
```

**Benefício**: Economia de processamento em arrays grandes.

---

## 🔍 Análise Conceitual Profunda

### Sintaxe e Anatomia

#### every()

```typescript
const numeros: number[] = [2, 4, 6, 8, 10];

// Sintaxe completa
const resultado = numeros.every(function(elemento, indice, array) {
  console.log(`Testando índice ${indice}: ${elemento}`);
  return elemento % 2 === 0;
});

// Sintaxe com arrow function
const todosPares = numeros.every(n => n % 2 === 0);

// Com type guard
function ePositivo(n: number): boolean {
  return n > 0;
}
const todosPositivos = numeros.every(ePositivo);
```

#### some()

```typescript
const numeros: number[] = [1, 3, 5, 7, 9];

// Sintaxe completa
const resultado = numeros.some(function(elemento, indice, array) {
  console.log(`Testando índice ${indice}: ${elemento}`);
  return elemento > 5;
});

// Sintaxe com arrow function
const algumMaiorQue5 = numeros.some(n => n > 5);

// Com índice
const algumNoPrimeiroTerco = numeros.some((n, i, arr) => {
  return i < arr.length / 3 && n > 10;
});
```

### Tipagem e Type Guards

#### Type Guard com every()

```typescript
type Entrada = number | string | null;
const entradas: Entrada[] = [1, 2, 3, 4, 5];

// Type guard: verifica se é número
function eNumero(v: Entrada): v is number {
  return typeof v === "number";
}

// every() com type guard: refina tipo do array
if (entradas.every(eNumero)) {
  // Dentro: entradas é tratado como number[]
  const soma = entradas.reduce((acc, n) => acc + n, 0);
  entradas.forEach(n => console.log(n.toFixed(2)));
}
```

**Mecanismo**: TypeScript reconhece que se `every(eNumero)` é `true`, **todos** elementos são `number`, logo o array pode ser tratado como `number[]`.

#### Type Guard com some()

```typescript
// some() NÃO refina tipo do array (apenas indica existência)
if (entradas.some(eNumero)) {
  // Dentro: entradas ainda é (number | string | null)[]
  // TypeScript não assume que todos são numbers
  // entradas.forEach(n => console.log(n.toFixed(2))); // ERRO!
}

// Para usar elemento encontrado, combine com find()
const numero = entradas.find(eNumero);
if (numero !== undefined) {
  // numero é number (refinado)
  console.log(numero.toFixed(2));
}
```

### Padrões Comuns

#### 1. Validação de Todos os Elementos (every)

```typescript
interface Produto {
  nome: string;
  preco: number;
  estoque: number;
}

const produtos: Produto[] = [...];

// Todos estão em estoque?
const todosDisponiveis = produtos.every(p => p.estoque > 0);

// Todos têm preço válido?
const todosPreçosValidos = produtos.every(p => p.preco > 0);

// Todos os nomes têm pelo menos 3 caracteres?
const todosNomesValidos = produtos.every(p => p.nome.length >= 3);
```

#### 2. Verificação de Existência (some)

```typescript
// Existe algum produto fora de estoque?
const algumForaEstoque = produtos.some(p => p.estoque === 0);

// Existe produto com desconto (preço < 10)?
const algumBarato = produtos.some(p => p.preco < 10);

// Existe produto com nome específico?
const existeMouse = produtos.some(p => p.nome === "Mouse");
```

#### 3. Validação de Propriedades Obrigatórias

```typescript
interface Config {
  apiUrl?: string;
  timeout?: number;
  retry?: boolean;
}

const configs: Config[] = [...];

// Todas configurações têm apiUrl definida?
const todasComApi = configs.every(c => c.apiUrl !== undefined);

// Alguma configuração tem retry habilitado?
const algumaComRetry = configs.some(c => c.retry === true);
```

#### 4. Uso com Arrays de Booleans

```typescript
const flags: boolean[] = [true, true, true, true];

// Todos são true?
const todosMarcados = flags.every(f => f === true);
// Equivalente mais conciso:
const todosMarcados = flags.every(Boolean);

// Algum é true?
const algumMarcado = flags.some(f => f === true);
// Equivalente:
const algumMarcado = flags.some(Boolean);
```

#### 5. Combinação com Negação (De Morgan)

```typescript
const numeros = [1, 2, 3, 4, 5];

// "Nenhum é negativo" = "Todos são não-negativos"
const nenhumNegativo = !numeros.some(n => n < 0);
const todosNaoNegativos = numeros.every(n => n >= 0);
// nenhumNegativo === todosNaoNegativos (sempre true)

// "Nem todos são pares" = "Existe um ímpar"
const nemTodosPares = !numeros.every(n => n % 2 === 0);
const existeImpar = numeros.some(n => n % 2 !== 0);
// nemTodosPares === existeImpar (sempre true)
```

### Tratamento de Arrays Vazios

```typescript
const vazio: number[] = [];

// every: vacuamente verdadeiro
vazio.every(n => n > 1000); // true (não há contra-exemplo)

// some: sempre false
vazio.some(n => n > 0); // false (não existe elemento)

// Implicação prática:
function todosValidos(numeros: number[]): boolean {
  // Se quiser rejeitar arrays vazios, adicione verificação:
  if (numeros.length === 0) return false;
  
  return numeros.every(n => n > 0);
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar every()

#### Cenário 1: Validação de Condições Universais

```typescript
// Todos usuários são maiores de idade?
const todosMaioresIdade = usuarios.every(u => u.idade >= 18);

// Todas senhas atendem critérios de segurança?
const senhas = ["Abc123!", "Xyz789@", "Def456#"];
const todasSeguras = senhas.every(s => 
  s.length >= 8 && /[A-Z]/.test(s) && /[0-9]/.test(s)
);
```

#### Cenário 2: Type Narrowing de Arrays

```typescript
type Resultado = { sucesso: true; dados: string } | { sucesso: false; erro: string };
const resultados: Resultado[] = [...];

function eSucesso(r: Resultado): r is Extract<Resultado, { sucesso: true }> {
  return r.sucesso === true;
}

if (resultados.every(eSucesso)) {
  // Todos são sucesso: extrair dados
  const dados = resultados.map(r => r.dados);
}
```

### Quando Usar some()

#### Cenário 1: Verificação de Presença

```typescript
// Existe algum produto em estoque?
const haEstoque = produtos.some(p => p.estoque > 0);

// Há algum erro na validação?
const haErros = validacoes.some(v => !v.valido);
```

#### Cenário 2: Teste de Pertinência

```typescript
// Array contém valor específico?
const contem5 = numeros.some(n => n === 5);
// Nota: para valores primitivos, use includes() (mais eficiente)
const contem5 = numeros.includes(5); // ✅ Melhor

// Mas some() é útil para objetos:
const contemUsuarioAtivo = usuarios.some(u => u.ativo && u.nome === "Ana");
```

### Quando NÃO Usar

#### ❌ Para Obter Elementos (Use filter/find)

```typescript
// ❌ some() apenas indica existência
if (numeros.some(n => n > 5)) {
  // Mas QUAL é o número? Não sabemos!
}

// ✅ Use find() para obter elemento
const numero = numeros.find(n => n > 5);
if (numero) {
  console.log(numero);
}

// ✅ Use filter() para obter todos
const maiores = numeros.filter(n => n > 5);
```

#### ❌ Para Verificar Valores Primitivos (Use includes)

```typescript
// ❌ Ineficiente
const temMaça = frutas.some(f => f === "maçã");

// ✅ Eficiente e semântico
const temMaça = frutas.includes("maçã");
```

---

## ⚠️ Limitações e Armadilhas

### Armadilhas Comuns

#### Armadilha 1: Confundir every() e some() com Arrays Vazios

```typescript
const vazio: number[] = [];

// ⚠️ every() em vazio é TRUE
vazio.every(n => n > 1000); // true (vacuamente)

// ⚠️ some() em vazio é FALSE
vazio.some(n => n > 0); // false

// Se quiser rejeitar vazios:
function validarTodos(nums: number[]): boolean {
  return nums.length > 0 && nums.every(n => n > 0);
}
```

#### Armadilha 2: Usar every() quando Quer some() (e vice-versa)

```typescript
// ❌ Erro conceitual: quer "algum", mas usa "todos"
if (usuarios.every(u => u.ativo)) {
  console.log("Há usuários ativos"); // ERRADO! Só é true se TODOS ativos
}

// ✅ Correto: some()
if (usuarios.some(u => u.ativo)) {
  console.log("Há usuários ativos");
}
```

#### Armadilha 3: Esquecer que every() Não Modifica Array

```typescript
// ❌ Tentativa de mutação (não funciona!)
numeros.every(n => {
  n = n * 2; // Não afeta array original!
  return true;
});

// ✅ Use map() para transformar
const dobrados = numeros.map(n => n * 2);
```

---

## 🔗 Interconexões Conceituais

### Relação com Outros Métodos

```typescript
const numeros = [1, 2, 3, 4, 5];

// every: todos satisfazem?
numeros.every(n => n > 0); // true

// some: algum satisfaz?
numeros.some(n => n > 3); // true

// find: qual é o primeiro que satisfaz?
numeros.find(n => n > 3); // 4

// filter: quais satisfazem?
numeros.filter(n => n > 3); // [4, 5]

// includes: contém valor exato?
numeros.includes(3); // true
```

### Composição

```typescript
// Encadeamento
const resultado = produtos
  .filter(p => p.categoria === "Eletrônicos")
  .every(p => p.estoque > 0);

// every + some (validações complexas)
const valido = 
  usuarios.every(u => u.nome.length > 0) && // Todos têm nome
  usuarios.some(u => u.admin === true);      // Algum é admin
```

### Equivalências Lógicas

```typescript
// every pode ser expresso com filter
const todosPares = numeros.every(n => n % 2 === 0);
const todosPares = numeros.filter(n => n % 2 !== 0).length === 0;

// some pode ser expresso com find
const algumMaior = numeros.some(n => n > 5);
const algumMaior = numeros.find(n => n > 5) !== undefined;
```

---

## 🚀 Próximos Conceitos

Após dominar `every()` e `some()`:
1. **includes()**: Verificação de presença de valor específico
2. **findIndex()**: Localizar índice de elemento
3. **Lógica proposicional avançada**: Operadores lógicos compostos
4. **Validação de esquemas**: Bibliotecas como Zod, Yup

---

## 📚 Conclusão

`every()` e `some()` são **quantificadores lógicos fundamentais** em TypeScript, traduzindo conceitos matemáticos profundos (∀ e ∃) em código declarativo e eficiente.

**Use every()** quando precisar validar que **todos** elementos satisfazem um critério; **use some()** para verificar se **pelo menos um** satisfaz. Ambos implementam short-circuit, tornando-os eficientes para arrays grandes.

Em TypeScript, `every()` com type guards oferece **type narrowing poderoso**, refinando tipos de arrays inteiros. Essa capacidade, combinada com expressividade lógica, faz desses métodos ferramentas essenciais para validação type-safe e testes condicionais em código moderno.

Compreender as **leis de De Morgan** que relacionam esses métodos permite expressar negações de forma eficiente e elegante, evitando lógica duplicada e aumentando a clareza do código.
