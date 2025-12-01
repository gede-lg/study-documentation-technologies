# filter() - Filtragem de Arrays em TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

O método `filter()` é uma **função de alta ordem para seleção predicativa** que cria um novo array contendo **apenas os elementos que satisfazem uma condição especificada**. Conceitualmente, `filter()` implementa o conceito matemático de **filtragem por predicado**: dado um conjunto de elementos e uma função de teste (predicado), retorna o subconjunto de elementos para os quais o predicado retorna verdadeiro.

Na essência, `filter()` é uma **operação de peneiramento lógico**: você fornece um array de entrada e uma função que decide quais elementos "passam" no teste, e recebe um novo array contendo apenas os elementos aprovados. Diferente de `map()` que transforma todos os elementos mantendo o comprimento, `filter()` **mantém os elementos inalterados mas pode reduzir o comprimento** do array resultante.

Em TypeScript, `filter()` é **fortemente tipado** com suporte a **type guards** (guardas de tipo), permitindo não apenas filtrar elementos, mas também **refinar tipos** (type narrowing). Isso significa que após filtrar, TypeScript pode inferir um tipo mais específico para os elementos do array resultante, tornando o código mais seguro e expressivo.

### Contexto Histórico e Motivação

O método `filter()` foi introduzido no JavaScript com **ECMAScript 5 (ES5)** em 2009, juntamente com `map()`, `reduce()`, `forEach()` e outros métodos funcionais. Sua origem remonta a linguagens de programação funcional como **LISP** (onde é chamado de `remove-if-not` ou `select`), **Haskell** (onde existe como `filter`), e **ML**, onde filtragem por predicado é uma operação fundamental.

**Antes do ES5**, filtrar arrays em JavaScript requeria loops imperativos com lógica condicional manual:

```javascript
// Abordagem pré-ES5: filtragem manual
var numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var pares = [];

for (var i = 0; i < numeros.length; i++) {
  if (numeros[i] % 2 === 0) {
    pares.push(numeros[i]);
  }
}
```

Este padrão apresenta várias desvantagens:
- **Verbosidade**: Muito código para expressar conceito simples ("selecione elementos que atendem condição")
- **Gerenciamento de estado**: Necessidade de criar e gerenciar array de resultado manualmente
- **Mistura de responsabilidades**: Iteração, teste condicional e acumulação no mesmo bloco
- **Baixa expressividade**: Não comunica intenção claramente à primeira vista
- **Propensão a erros**: Esquecer inicializar array, condicional invertida, erros de índice

**A motivação fundamental** para `filter()` foi trazer:

1. **Clareza semântica**: `array.filter(predicado)` comunica instantaneamente "estou selecionando elementos baseado em condição"
2. **Abstração de iteração**: Mecânica de loop é invisível, foco está no critério de seleção
3. **Imutabilidade**: Array original permanece intacto, novo array filtrado é criado
4. **Composição funcional**: Pode ser encadeado com `map()`, `reduce()` e outros métodos
5. **Declaratividade**: Você declara "quais elementos quer" (predicado), não "como obter" (loop)

Com **TypeScript**, `filter()` ganhou capacidades revolucionárias através de **type predicates** (predicados de tipo):

```typescript
// JavaScript: filter retorna mesmo tipo
const valores: (string | number)[] = [1, "dois", 3, "quatro"];
const numeros = valores.filter(v => typeof v === "number");
// Em JS puro, tipo ainda seria (string | number)[]

// TypeScript com type predicate:
const numeros = valores.filter((v): v is number => typeof v === "number");
// TypeScript infere que 'numeros' é number[]! Tipo refinado!
```

Esta capacidade de **refinar tipos através de filtragem** é única do TypeScript e torna `filter()` não apenas uma ferramenta de seleção de dados, mas também de **seleção de tipos**.

### Problema Fundamental que Resolve

O método `filter()` resolve múltiplos problemas fundamentais na manipulação de coleções:

#### 1. **Seleção Declarativa vs. Imperativa**

O problema central é a necessidade de **selecionar subconjuntos de dados baseado em critérios** de forma declarativa:

```typescript
// Imperativo: COMO selecionar
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const pares = [];
for (let i = 0; i < numeros.length; i++) {
  if (numeros[i] % 2 === 0) {
    pares.push(numeros[i]);
  }
}

// Declarativo: O QUE selecionar
const pares = numeros.filter(n => n % 2 === 0);
```

**Conceito**: `filter()` eleva o nível de abstração. Você não diz "itere, teste, adicione se passar". Você diz "dê-me elementos que são pares". A intenção é cristalina.

#### 2. **Imutabilidade e Non-Destructive Filtering**

Em programação funcional, operações não devem modificar dados originais. `filter()` garante isso:

```typescript
const todosUsuarios = [
  { nome: "Ana", ativo: true },
  { nome: "Bruno", ativo: false },
  { nome: "Carlos", ativo: true }
];

// filter cria NOVO array, original intacto
const usuariosAtivos = todosUsuarios.filter(u => u.ativo);

console.log(todosUsuarios.length); // 3 - inalterado
console.log(usuariosAtivos.length); // 2 - novo array
```

**Princípio**: Filtragens devem ser **não-destrutivas**. `filter()` nunca remove elementos do array original, apenas cria novo array com subset.

#### 3. **Type Narrowing (Refinamento de Tipo)**

Um dos problemas mais poderosos que `filter()` resolve em TypeScript é **refinar union types**:

```typescript
// Problema: array com tipos misturados
const valores: (string | number | null)[] = [1, "dois", null, 3, "quatro", null];

// Sem type predicate: tipo não é refinado
const numerosInseguro = valores.filter(v => typeof v === "number");
// Tipo inferido: (string | number | null)[] - AINDA union!

// Com type predicate: tipo É refinado
const numerosSeguro = valores.filter((v): v is number => typeof v === "number");
// Tipo inferido: number[] - REFINADO!

// Agora você pode usar métodos de number sem verificação adicional
numerosSeguro.forEach(n => {
  console.log(n.toFixed(2)); // ✅ OK - TypeScript sabe que 'n' é number
});
```

**Conceito de Type Guard**: `filter()` com type predicate não apenas filtra dados, mas também **prova ao compilador** que elementos restantes têm tipo específico.

#### 4. **Separação de Critério de Seleção e Iteração**

Loops tradicionais misturam **controle de fluxo** (iteração) com **lógica de negócio** (critério). `filter()` separa essas preocupações:

```typescript
// Loop: iteração E critério misturados
for (let i = 0; i < produtos.length; i++) {
  if (produtos[i].preco > 100) {
    produtosCaros.push(produtos[i]);
  }
}

// filter: apenas critério, iteração é abstrata
const produtosCaros = produtos.filter(p => p.preco > 100);

// Melhor ainda: critério nomeado (função separada)
const ehCaro = (p: Produto) => p.preco > 100;
const produtosCaros = produtos.filter(ehCaro);
```

**Princípio de Separação**: `filter()` cuida da **mecânica**, você cuida da **semântica** (definição do que é "válido").

#### 5. **Composição com Outras Operações**

`filter()` compõe elegantemente com outras operações funcionais:

```typescript
const resultado = usuarios
  .filter(u => u.ativo)           // Seleção: apenas ativos
  .map(u => u.email)              // Transformação: extrair emails
  .filter(email => email.includes("@empresa.com")) // Seleção: domínio específico
  .map(email => email.toLowerCase()); // Transformação: normalizar
```

**Conceito de Pipeline**: `filter()` permite construir **pipelines de processamento** onde dados fluem através de estágios de seleção e transformação.

### Importância no Ecossistema TypeScript

O método `filter()` ocupa posição **crucial e ubíqua** no desenvolvimento TypeScript moderno:

#### **Fundamento de Data Manipulation**

Praticamente toda aplicação precisa filtrar dados:
- **Backend**: Filtrar registros de banco de dados, logs, resultados de queries
- **Frontend**: Filtrar listas para exibição, busca, categorização
- **APIs**: Filtrar dados antes de retornar ao cliente
- **Validação**: Filtrar entradas válidas/inválidas

`filter()` é a ferramenta primária para essas operações.

#### **Type Safety com Type Guards**

A capacidade de `filter()` de **refinar tipos** é única e extremamente poderosa:

```typescript
// Removendo nulls/undefined com type safety
interface Usuario {
  id: number;
  nome: string;
  email?: string; // Opcional
}

const usuarios: Usuario[] = [
  { id: 1, nome: "Ana", email: "ana@email.com" },
  { id: 2, nome: "Bruno" }, // Sem email
  { id: 3, nome: "Carlos", email: "carlos@email.com" }
];

// Filtrar apenas usuários com email
const comEmail = usuarios.filter((u): u is Usuario & { email: string } => {
  return u.email !== undefined;
});

// TypeScript sabe que 'comEmail' tem email definido!
comEmail.forEach(u => {
  console.log(u.email.toLowerCase()); // ✅ OK - não precisa de '?.'
});
```

#### **Padrão em Frameworks Modernos**

Frameworks TypeScript usam `filter()` extensivamente:

```typescript
// React: filtrar lista antes de renderizar
function ListaProdutos({ produtos, filtro }: Props) {
  const produtosFiltrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(filtro.toLowerCase())
  );
  
  return (
    <ul>
      {produtosFiltrados.map(p => (
        <li key={p.id}>{p.nome}</li>
      ))}
    </ul>
  );
}

// Angular: filtrar observables
this.usuarios$ = this.todosUsuarios$.pipe(
  map(usuarios => usuarios.filter(u => u.ativo))
);
```

#### **Performance e Eficiência**

`filter()` é otimizado em engines JavaScript modernas. Para a maioria dos casos de uso, performance é **excelente** e legibilidade supera qualquer micro-otimização de loops manuais.

#### **Base para Padrões Avançados**

`filter()` é fundamento para conceitos avançados:
- **Partition**: Dividir array em dois baseado em predicado
- **Query Builders**: Construir queries dinâmicas com filtros compostos
- **Reactive Filtering**: Filtros que reagem a mudanças de estado
- **Memoized Filtering**: Cachear resultados de filtragem cara

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Seleção Predicativa**: Seleciona elementos baseado em função de teste (predicado)
2. **Imutabilidade**: Array original nunca é modificado, novo array subset é criado
3. **Comprimento Variável**: Array resultante pode ter 0 a N elementos (N = length original)
4. **Type Narrowing**: Com type guards, refina tipos em TypeScript
5. **Composição**: Pode ser encadeado com map, reduce e outros métodos

### Pilares Fundamentais

- **Predicado como Critério**: Função booleana define quais elementos passam
- **Novo Array como Retorno**: Sempre retorna novo array (nunca void)
- **Ordem Preservada**: Elementos que passam mantêm ordem relativa do array original
- **Avaliação Eager**: Execução imediata, não lazy
- **Elementos Inalterados**: Elementos no array resultante são exatamente os mesmos (mesma referência) que no original

### Visão Geral das Nuances

- **Array Vazio é Válido**: Se nenhum elemento passa, retorna `[]`
- **Todos Podem Passar**: Se todos passam, retorna cópia com todos elementos
- **Type Predicate Opcional**: Pode usar sem refinar tipo (boolean simples)
- **Callback Não Transforma**: Deve retornar boolean/truthy, não novo valor
- **Performance**: Ligeiramente mais lento que for loop, mas irrelevante na prática

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Implementação conceitual de `filter()`:

```typescript
// Implementação conceitual simplificada
Array.prototype.filter = function<T>(
  predicate: (value: T, index: number, array: T[]) => boolean,
  thisArg?: any
): T[] {
  const arrayOriginal: T[] = this;
  const comprimento = arrayOriginal.length;
  const resultado: T[] = []; // Array para acumular elementos que passam
  
  // Itera sobre cada elemento
  for (let i = 0; i < comprimento; i++) {
    // Verifica se índice existe (arrays esparsos)
    if (i in arrayOriginal) {
      const elemento = arrayOriginal[i];
      
      // Chama predicado para testar elemento
      const passou = predicate.call(thisArg, elemento, i, arrayOriginal);
      
      // Se passou no teste, adiciona ao resultado
      if (passou) {
        resultado.push(elemento);
      }
    }
  }
  
  // Retorna array com elementos que passaram
  return resultado;
};
```

#### Etapas da Execução

1. **Captura do Array**: Acessa array original através de `this`
2. **Inicialização do Resultado**: Cria array vazio para acumular elementos aprovados
3. **Iteração**: Loop de `0` até `length - 1`
4. **Verificação de Existência**: Checa se índice existe (arrays esparsos)
5. **Teste do Predicado**: Invoca função predicado com três argumentos:
   - `value`: Elemento atual
   - `index`: Índice atual
   - `array`: Array original completo
6. **Decisão**: Se predicado retorna truthy, elemento é adicionado ao resultado
7. **Retorno**: Array resultado (pode estar vazio, parcialmente preenchido, ou completo)

#### Diferenças Cruciais com map()

```typescript
// map: transforma TODOS elementos, mantém comprimento
const dobrados = [1, 2, 3, 4].map(n => n * 2);
// [2, 4, 6, 8] - 4 elementos (mesmo comprimento)

// filter: seleciona ALGUNS elementos, comprimento pode mudar
const pares = [1, 2, 3, 4].filter(n => n % 2 === 0);
// [2, 4] - 2 elementos (comprimento reduzido)

// map: callback retorna NOVO VALOR
map(elemento => novoValor)

// filter: callback retorna BOOLEAN (decisão)
filter(elemento => true/false)
```

### Princípios e Conceitos Subjacentes

#### 1. **Predicado Lógico**

Um **predicado** na lógica matemática e programação é uma função que retorna valor booleano (verdadeiro ou falso). Em `filter()`, o predicado **decide a inclusão**:

```typescript
// Predicado: "é par?"
const ehPar = (n: number): boolean => n % 2 === 0;

// Aplicado a array
const numeros = [1, 2, 3, 4, 5, 6];
const pares = numeros.filter(ehPar);
// [2, 4, 6] - apenas elementos para os quais ehPar(n) === true
```

**Conceito**: Predicado é uma **função de decisão** – classifica cada elemento como "aceito" ou "rejeitado".

#### 2. **Subset Selection (Seleção de Subconjunto)**

Matematicamente, `filter()` implementa **compreensão de conjuntos**:

```
Dado conjunto A = {1, 2, 3, 4, 5}
E predicado P(x) = "x é par"

B = { x ∈ A | P(x) }
B = {2, 4} (subconjunto de A onde P é verdadeiro)

Em TypeScript:
const A = [1, 2, 3, 4, 5];
const P = (x: number) => x % 2 === 0;
const B = A.filter(P);
```

**Conceito**: `filter()` é **seleção de subconjunto baseada em propriedade**.

#### 3. **Imutabilidade e Structural Sharing**

`filter()` cria novo array, mas **elementos são compartilhados** (mesma referência):

```typescript
const objetos = [
  { id: 1, nome: "Ana" },
  { id: 2, nome: "Bruno" },
  { id: 3, nome: "Carlos" }
];

const filtrados = objetos.filter(o => o.id > 1);

// Arrays são diferentes
console.log(objetos === filtrados); // false

// Mas elementos são os MESMOS objetos (mesma referência)
console.log(objetos[1] === filtrados[0]); // true (mesmo objeto)
```

**Implicação**: Se você modificar objeto dentro do array filtrado, **afeta o objeto original** também (são a mesma instância).

**Solução para imutabilidade total**: Clonar objetos durante filtragem:

```typescript
const filtradosClonados = objetos
  .filter(o => o.id > 1)
  .map(o => ({ ...o })); // Clone cada objeto
```

#### 4. **Truthy vs. Boolean Explícito**

`filter()` aceita qualquer valor **truthy/falsy**, não apenas `true`/`false`:

```typescript
// Valores falsy em JavaScript:
// false, 0, "", null, undefined, NaN

const valores = [0, 1, "", "texto", null, {}, undefined, 42];

// Filtra apenas valores truthy
const truthy = valores.filter(v => v);
// [1, "texto", {}, 42]

// Valores falsy foram removidos: 0, "", null, undefined
```

**Conceito**: Predicado não precisa retornar boolean explícito – qualquer expressão com resultado truthy/falsy funciona.

**Casos práticos**:

```typescript
// Remover nulls/undefined
const semNulls = array.filter(x => x != null); // != null remove null E undefined

// Remover strings vazias
const comTexto = strings.filter(s => s); // String vazia é falsy

// Remover zeros
const semZeros = numeros.filter(n => n); // 0 é falsy
```

### Relação com Outros Conceitos

#### **Type Guards e Type Predicates**

`filter()` em TypeScript tem integração especial com **type predicates**:

```typescript
// Type predicate: função que "prova" tipo ao compilador
function ehString(valor: unknown): valor is string {
  return typeof valor === "string";
}

const misturado: unknown[] = [1, "dois", 3, "quatro", true];

// Sem type predicate
const stringsInseguro = misturado.filter(v => typeof v === "string");
// Tipo: unknown[] - TypeScript não refinado

// Com type predicate
const stringsSeguro = misturado.filter(ehString);
// Tipo: string[] - TypeScript refinado!
```

**Sintaxe de type predicate inline**:

```typescript
const strings = misturado.filter((v): v is string => typeof v === "string");
// A anotação (v): v is string diz "este v é string se retorno for true"
```

#### **Higher-Order Functions**

`filter()` é higher-order function – aceita função como argumento:

```typescript
// Função que retorna filtro customizado
function criarFiltroMaiorQue(limite: number) {
  return (n: number) => n > limite;
}

const numeros = [1, 5, 10, 15, 20];

const maioresQue10 = numeros.filter(criarFiltroMaiorQue(10));
// [15, 20]
```

#### **Closures**

Predicados frequentemente formam closures, capturando contexto:

```typescript
const limiteMinimo = 100;
const limiteMaximo = 500;

const dentroDoIntervalo = produtos.filter(p => {
  return p.preco >= limiteMinimo && p.preco <= limiteMaximo;
  // Closure: captura limiteMinimo e limiteMaximo
});
```

### Modelo Mental

#### O Modelo "Peneira Lógica"

Imagine `filter()` como uma **peneira industrial**:

```
Input: [🔵, 🔴, 🔵, 🟢, 🔵, 🔴]
         ↓   ↓   ↓   ↓   ↓   ↓
Predicado: [🔧 "é azul?" 🔧]
         ✓   ✗   ✓   ✗   ✓   ✗
         ↓       ↓       ↓
Output: [🔵, 🔵, 🔵]
```

- Cada elemento passa pelo teste
- Apenas os que "passam" vão para saída
- Ordem é preservada

#### O Modelo "Seleção Natural"

Pense em `filter()` como **seleção natural evolutiva**:

- **População**: Array original
- **Critério de sobrevivência**: Predicado
- **Sobreviventes**: Array filtrado
- **Extintos**: Elementos que não passaram (descartados)

#### Diagrama Mental: Fluxo de Dados

```
Array<T>  →  filter(predicate: T → boolean)  →  Array<T>
  ↓                      ↓                          ↓
[T, T, T, T]    [true, false, true, false]    [T, T]
```

**Conceito**: Tipo não muda (sem type guard), mas quantidade sim.

---

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica e Anatomia

#### Forma Fundamental

```typescript
const numeros: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Sintaxe básica com function expression
const pares = numeros.filter(function(numero) {
  return numero % 2 === 0;
});

// Sintaxe com arrow function (moderna e preferida)
const pares = numeros.filter(numero => numero % 2 === 0);

// Sintaxe com bloco explícito
const pares = numeros.filter(numero => {
  const ehPar = numero % 2 === 0;
  return ehPar;
});
```

**Anatomia**:
- **`numeros`**: Array original (tipo `number[]`)
- **`.filter`**: Método do protótipo de Array
- **`numero => numero % 2 === 0`**: Predicado (função de teste)
- **`numero`**: Parâmetro com tipo inferido (`number`)
- **`numero % 2 === 0`**: Expressão booleana (teste)
- **Retorno**: Novo array com subset (tipo `number[]`)

#### Parâmetros do Predicado

O predicado de `filter()` recebe até **três parâmetros**:

```typescript
const produtos = [
  { id: 1, nome: "Mouse", preco: 50 },
  { id: 2, nome: "Teclado", preco: 150 },
  { id: 3, nome: "Monitor", preco: 800 }
];

const resultado = produtos.filter((produto, indice, arrayOriginal) => {
  console.log(`Testando índice ${indice}`);
  console.log(`Array tem ${arrayOriginal.length} produtos`);
  
  // Pode usar índice no critério
  return indice > 0 && produto.preco > 100;
});

// Resultado: [{ id: 2, nome: "Teclado", preco: 150 }, { id: 3, nome: "Monitor", preco: 800 }]
```

**Parâmetros**:
1. **`elemento`** (obrigatório): Elemento atual sendo testado (tipo `T`)
2. **`indice`** (opcional): Índice do elemento (tipo `number`)
3. **`arrayOriginal`** (opcional): Array completo (tipo `T[]`)

### Type Guards e Refinamento de Tipo

#### Filtrando Nulls e Undefined

```typescript
interface Usuario {
  id: number;
  nome: string;
  email?: string; // Opcional (string | undefined)
}

const usuarios: Usuario[] = [
  { id: 1, nome: "Ana", email: "ana@email.com" },
  { id: 2, nome: "Bruno" }, // email é undefined
  { id: 3, nome: "Carlos", email: "carlos@email.com" }
];

// SEM type guard: tipo não é refinado
const comEmailInseguro = usuarios.filter(u => u.email !== undefined);
// Tipo: Usuario[] (email ainda é string | undefined)

// COM type guard: tipo refinado
const comEmailSeguro = usuarios.filter((u): u is Usuario & { email: string } => {
  return u.email !== undefined;
});
// Tipo: (Usuario & { email: string })[]
// TypeScript SABE que email é string, não mais opcional!

comEmailSeguro.forEach(u => {
  console.log(u.email.toLowerCase()); // ✅ Sem '?.' necessário
});
```

**Sintaxe do Type Guard**:
```typescript
(parametro): parametro is TipoRefinado => boolean
```

#### Filtrando por Tipo em Union Types

```typescript
type Valor = string | number | boolean | null;

const valores: Valor[] = [1, "texto", true, null, 42, "outro", false];

// Filtrar apenas números
const numeros = valores.filter((v): v is number => typeof v === "number");
// Tipo: number[]

// Filtrar apenas strings
const strings = valores.filter((v): v is string => typeof v === "string");
// Tipo: string[]

// Filtrar apenas valores não-null
const semNulls = valores.filter((v): v is Exclude<Valor, null> => v !== null);
// Tipo: (string | number | boolean)[]
```

#### Type Guards com instanceof

```typescript
class Cachorro {
  latir() { console.log("Au au!"); }
}

class Gato {
  miar() { console.log("Miau!"); }
}

const animais: (Cachorro | Gato)[] = [
  new Cachorro(),
  new Gato(),
  new Cachorro(),
  new Gato()
];

// Filtrar apenas cachorros
const cachorros = animais.filter((a): a is Cachorro => a instanceof Cachorro);
// Tipo: Cachorro[]

cachorros.forEach(c => c.latir()); // ✅ OK - TypeScript sabe que são Cachorros
```

### Padrões Comuns de Filtragem

#### Filtragem por Propriedade Booleana

```typescript
interface Tarefa {
  id: number;
  titulo: string;
  concluida: boolean;
}

const tarefas: Tarefa[] = [
  { id: 1, titulo: "Estudar", concluida: false },
  { id: 2, titulo: "Trabalhar", concluida: true },
  { id: 3, titulo: "Exercitar", concluida: false }
];

// Tarefas pendentes
const pendentes = tarefas.filter(t => !t.concluida);

// Tarefas concluídas
const concluidas = tarefas.filter(t => t.concluida);
```

#### Filtragem por Comparação Numérica

```typescript
const numeros = [10, 25, 3, 47, 82, 15, 99, 5];

// Maiores que 20
const maiores = numeros.filter(n => n > 20);
// [25, 47, 82, 99]

// Entre 10 e 50
const intervalo = numeros.filter(n => n >= 10 && n <= 50);
// [10, 25, 47, 15]
```

#### Filtragem por String (Busca)

```typescript
const nomes = ["Ana Silva", "Bruno Costa", "Carlos Souza", "Ana Paula"];

// Nomes que começam com "Ana"
const anasComeco = nomes.filter(n => n.startsWith("Ana"));
// ["Ana Silva", "Ana Paula"]

// Nomes que contêm "Silva"
const comSilva = nomes.filter(n => n.includes("Silva"));
// ["Ana Silva"]

// Case-insensitive search
const buscaTermo = "ana";
const encontrados = nomes.filter(n => 
  n.toLowerCase().includes(buscaTermo.toLowerCase())
);
// ["Ana Silva", "Ana Paula"]
```

#### Filtragem por Propriedade de Objeto

```typescript
interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  emEstoque: boolean;
}

const produtos: Produto[] = [
  { id: 1, nome: "Mouse", categoria: "Eletrônicos", preco: 50, emEstoque: true },
  { id: 2, nome: "Cadeira", categoria: "Móveis", preco: 400, emEstoque: false },
  { id: 3, nome: "Teclado", categoria: "Eletrônicos", preco: 150, emEstoque: true }
];

// Categoria específica
const eletronicos = produtos.filter(p => p.categoria === "Eletrônicos");

// Múltiplos critérios (AND lógico)
const eletronicosDisponiveis = produtos.filter(p => 
  p.categoria === "Eletrônicos" && p.emEstoque
);

// Critério complexo
const promocao = produtos.filter(p =>
  p.emEstoque && p.preco > 100 && p.categoria === "Eletrônicos"
);
```

#### Filtragem por Existência de Propriedade Opcional

```typescript
interface Pessoa {
  nome: string;
  idade: number;
  telefone?: string;
}

const pessoas: Pessoa[] = [
  { nome: "Ana", idade: 25, telefone: "1234-5678" },
  { nome: "Bruno", idade: 30 }, // Sem telefone
  { nome: "Carlos", idade: 35, telefone: "9876-5432" }
];

// Pessoas com telefone
const comTelefone = pessoas.filter((p): p is Pessoa & { telefone: string } => {
  return p.telefone !== undefined;
});

comTelefone.forEach(p => {
  console.log(p.telefone.replace("-", "")); // ✅ Sem '?.' necessário
});
```

### Filtragem com Predicados Reutilizáveis

#### Funções Predicado Nomeadas

```typescript
// Predicados como funções separadas
const ehPar = (n: number): boolean => n % 2 === 0;
const ehPositivo = (n: number): boolean => n > 0;
const ehMaiorQue10 = (n: number): boolean => n > 10;

const numeros = [-5, 2, 10, -3, 15, 8, -1, 20];

const paresPositivos = numeros
  .filter(ehPar)
  .filter(ehPositivo);
// [2, 10, 8, 20]

// Combinar múltiplos predicados
const combinado = numeros.filter(n => ehPar(n) && ehPositivo(n) && ehMaiorQue10(n));
// [20]
```

#### Factory Functions para Predicados

```typescript
// Função que cria predicados customizados
function criarFiltroIntervalo(min: number, max: number) {
  return (n: number) => n >= min && n <= max;
}

function criarFiltroPorCategoria(categoria: string) {
  return (p: Produto) => p.categoria === categoria;
}

const numeros = [1, 5, 10, 15, 20, 25, 30];
const entre10e20 = numeros.filter(criarFiltroIntervalo(10, 20));
// [10, 15, 20]

const eletronicos = produtos.filter(criarFiltroPorCategoria("Eletrônicos"));
```

### Composição com Outros Métodos

#### filter + map (Pipeline Clássico)

```typescript
const usuarios = [
  { nome: "Ana", idade: 17 },
  { nome: "Bruno", idade: 25 },
  { nome: "Carlos", idade: 16 },
  { nome: "Diana", idade: 30 }
];

// Filtrar adultos, depois extrair nomes
const nomesAdultos = usuarios
  .filter(u => u.idade >= 18)
  .map(u => u.nome);
// ["Bruno", "Diana"]
```

#### filter + filter (Múltiplos Critérios)

```typescript
const produtos = [
  { nome: "Mouse", preco: 50, categoria: "Eletrônicos", emEstoque: true },
  { nome: "Teclado", preco: 150, categoria: "Eletrônicos", emEstoque: false },
  { nome: "Monitor", preco: 800, categoria: "Eletrônicos", emEstoque: true },
  { nome: "Cadeira", preco: 400, categoria: "Móveis", emEstoque: true }
];

// Aplicar filtros progressivamente
const resultado = produtos
  .filter(p => p.categoria === "Eletrônicos")
  .filter(p => p.emEstoque)
  .filter(p => p.preco < 200);
// [{ nome: "Mouse", ... }]

// Equivalente a um único filter com &&
const resultadoEquivalente = produtos.filter(p =>
  p.categoria === "Eletrônicos" &&
  p.emEstoque &&
  p.preco < 200
);
```

**Trade-off**: Múltiplos `filter()` são mais legíveis; único `filter()` é ligeiramente mais rápido.

#### filter + reduce (Filtrar e Agregar)

```typescript
const vendas = [
  { produto: "Mouse", valor: 50, quantidade: 2 },
  { produto: "Teclado", valor: 150, quantidade: 1 },
  { produto: "Monitor", valor: 800, quantidade: 1 },
  { produto: "Cabo", valor: 20, quantidade: 5 }
];

// Filtrar vendas > 100, calcular total
const totalVendasAltas = vendas
  .filter(v => v.valor * v.quantidade > 100)
  .reduce((acc, v) => acc + (v.valor * v.quantidade), 0);
// 150 + 800 = 950
```

#### filter + sort (Filtrar e Ordenar)

```typescript
const jogadores = [
  { nome: "Ana", pontos: 150 },
  { nome: "Bruno", pontos: 80 },
  { nome: "Carlos", pontos: 200 },
  { nome: "Diana", pontos: 95 }
];

// Top jogadores (> 100 pontos), ordenados
const topJogadores = jogadores
  .filter(j => j.pontos > 100)
  .sort((a, b) => b.pontos - a.pontos);
// [{ nome: "Carlos", pontos: 200 }, { nome: "Ana", pontos: 150 }]
```

### Casos Especiais

#### Array Vazio como Resultado

```typescript
const numeros = [1, 3, 5, 7, 9];

// Nenhum elemento passa no teste
const pares = numeros.filter(n => n % 2 === 0);
// [] - array vazio, mas válido
```

#### Todos Elementos Passam

```typescript
const numeros = [2, 4, 6, 8, 10];

// Todos passam
const pares = numeros.filter(n => n % 2 === 0);
// [2, 4, 6, 8, 10] - cópia do array original
```

**Nota**: Mesmo sendo "cópia", é novo array (referência diferente):

```typescript
console.log(numeros === pares); // false
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar filter()

#### Cenário 1: Remover Valores Indesejados

```typescript
// Remover nulls/undefined
const valores: (number | null)[] = [1, null, 2, undefined, 3];
const limpos = valores.filter((v): v is number => v != null);

// Remover strings vazias
const textos = ["Ana", "", "Bruno", " ", "Carlos"];
const comTexto = textos.filter(t => t.trim() !== "");

// Remover duplicatas (com indexOf)
const numeros = [1, 2, 2, 3, 4, 3, 5];
const unicos = numeros.filter((n, i, arr) => arr.indexOf(n) === i);
```

#### Cenário 2: Busca e Pesquisa

```typescript
function buscarProdutos(produtos: Produto[], termoBusca: string) {
  const termo = termoBusca.toLowerCase();
  return produtos.filter(p =>
    p.nome.toLowerCase().includes(termo) ||
    p.descricao.toLowerCase().includes(termo)
  );
}
```

#### Cenário 3: Validação e Filtragem de Dados de Entrada

```typescript
interface FormularioUsuario {
  nome: string;
  email: string;
  idade: number;
}

function filtrarUsuariosValidos(usuarios: FormularioUsuario[]) {
  return usuarios.filter(u =>
    u.nome.trim() !== "" &&
    u.email.includes("@") &&
    u.idade >= 18
  );
}
```

#### Cenário 4: Filtragem Dinâmica de UI

```typescript
// React component
function ListaProdutos({ produtos, filtros }: Props) {
  const produtosFiltrados = produtos.filter(p => {
    // Filtro por categoria
    if (filtros.categoria && p.categoria !== filtros.categoria) {
      return false;
    }
    
    // Filtro por preço máximo
    if (filtros.precoMax && p.preco > filtros.precoMax) {
      return false;
    }
    
    // Filtro por disponibilidade
    if (filtros.apenasEmEstoque && !p.emEstoque) {
      return false;
    }
    
    return true;
  });
  
  return <div>{/* renderizar produtosFiltrados */}</div>;
}
```

### Quando NÃO Usar filter()

#### ❌ Para Transformar Elementos

```typescript
// ❌ ERRADO: filter não transforma
const dobrados = numeros.filter(n => n * 2); // Retorna valores truthy, não transformados!

// ✅ CORRETO: use map()
const dobrados = numeros.map(n => n * 2);
```

#### ❌ Para Buscar Único Elemento

```typescript
// ❌ INEFICIENTE: filter itera todos elementos
const usuario = usuarios.filter(u => u.id === 5)[0];

// ✅ CORRETO: use find() (para em primeiro match)
const usuario = usuarios.find(u => u.id === 5);
```

#### ❌ Para Testar Existência

```typescript
// ❌ INEFICIENTE: filter cria array só para checar length
if (usuarios.filter(u => u.ativo).length > 0) { ... }

// ✅ CORRETO: use some() (para em primeiro match)
if (usuarios.some(u => u.ativo)) { ... }
```

---

## ⚠️ Limitações e Armadilhas

### Limitações

#### 1. Sempre Cria Novo Array

Mesmo que nenhum elemento seja removido, `filter()` **aloca novo array**:

```typescript
// Todos elementos passam, mas novo array é criado
const todos = numeros.filter(() => true);
console.log(numeros === todos); // false
```

#### 2. Não Modifica Elementos

`filter()` **não transforma** elementos, apenas seleciona:

```typescript
// Elementos no array filtrado são IDÊNTICOS aos originais
const objetos = [{ valor: 1 }, { valor: 2 }];
const filtrados = objetos.filter(o => o.valor > 0);

console.log(objetos[0] === filtrados[0]); // true (mesma referência!)
```

### Armadilhas Comuns

#### Armadilha 1: Esquecer Return

```typescript
// ❌ Sem return explícito em bloco
const pares = numeros.filter(n => {
  n % 2 === 0; // Sem 'return'!
});
// [] - array vazio! (expressão sem return é undefined, que é falsy)

// ✅ Com return
const pares = numeros.filter(n => {
  return n % 2 === 0;
});

// ✅ Ou arrow function implícito
const pares = numeros.filter(n => n % 2 === 0);
```

#### Armadilha 2: Mutação Acidental Durante Filtragem

```typescript
// ⚠️ Modificar elementos durante filter
const usuarios = [{ nome: "Ana", ativo: false }];

const ativos = usuarios.filter(u => {
  u.ativo = true; // MUTAÇÃO!
  return true;
});

// Problema: objeto original foi modificado!
console.log(usuarios[0].ativo); // true (efeito colateral!)
```

**Solução**: Não mutate durante filtragem. Se precisa transformar, use `map()`.

#### Armadilha 3: Confundir filter com map

```typescript
// ❌ Tentando transformar com filter
const dobrados = numeros.filter(n => n * 2);
// NÃO retorna valores dobrados!
// Retorna elementos originais onde n * 2 é truthy
// [1, 2, 3] → [1, 2, 3] (todos truthy exceto 0)

// ✅ Use map para transformar
const dobrados = numeros.map(n => n * 2);
```

---

## 🔗 Interconexões Conceituais

### Relação com map()

`map()` transforma, `filter()` seleciona:

```typescript
// map: Array<T> → Array<U> (muda tipo, mantém comprimento)
const dobrados = [1, 2, 3].map(n => n * 2); // [2, 4, 6]

// filter: Array<T> → Array<T> (mantém tipo, muda comprimento)
const pares = [1, 2, 3].filter(n => n % 2 === 0); // [2]
```

### Relação com find()

`find()` retorna primeiro elemento, `filter()` retorna todos:

```typescript
// find: retorna T | undefined
const primeiro = usuarios.find(u => u.ativo); // Um usuário ou undefined

// filter: retorna T[]
const todos = usuarios.filter(u => u.ativo); // Array de usuários
```

### Relação com some()/every()

`some()`/`every()` testam condição, `filter()` seleciona:

```typescript
// some: retorna boolean (existe algum?)
const temAtivo = usuarios.some(u => u.ativo); // true/false

// every: retorna boolean (todos são?)
const todosAtivos = usuarios.every(u => u.ativo); // true/false

// filter: retorna array (quais são?)
const ativos = usuarios.filter(u => u.ativo); // Usuario[]
```

---

## 🚀 Próximos Conceitos

Após dominar `filter()`:
1. **reduce()**: Agregação complexa
2. **Combinação filter + map + reduce**: Pipelines completos
3. **Partition**: Dividir array em dois com filter
4. **find()/findIndex()**: Busca otimizada

---

## 📚 Conclusão

`filter()` é ferramenta **essencial e ubíqua** em TypeScript moderno. Ao selecionar dados declarativamente, manter imutabilidade e refinar tipos, ele transforma manipulação de coleções em código expressivo e seguro.

Domine `filter()` não apenas sintaticamente, mas conceitualmente: seleção predicativa, imutabilidade, type narrowing, e composição. É a base para data processing elegante em TypeScript.
