# Iteração sobre Enums no TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Iteração sobre enums** refere-se às técnicas para percorrer todos os membros de uma enumeração, seja acessando nomes, valores ou ambos. Conceitualmente, é o processo de **introspecção de enums** que permite processar dinamicamente todos os membros sem referenciá-los individualmente.

Na essência, iteração sobre enums aproveita o fato de que enums (não-const) são compilados para objetos JavaScript, permitindo usar técnicas de iteração de objetos para acessar membros programaticamente.

## 📋 Fundamentos

### Enums Como Objetos Runtime

```typescript
enum Cor {
  Vermelho,
  Verde,
  Azul
}

// Em runtime, Cor é um objeto:
// {
//   0: "Vermelho",
//   1: "Verde",
//   2: "Azul",
//   Vermelho: 0,
//   Verde: 1,
//   Azul: 2
// }
```

**Conceito:** Podemos usar `Object.keys()`, `Object.values()`, `for...in` para iterar.

## 🔍 Técnicas de Iteração

### 1. Iterar Sobre Nomes (Chaves)

```typescript
enum DiaSemana {
  Domingo,
  Segunda,
  Terca,
  Quarta,
  Quinta,
  Sexta,
  Sabado
}

// Object.keys retorna todas as chaves (incluindo números)
const chaves = Object.keys(DiaSemana);
console.log(chaves);
// ["0", "1", "2", "3", "4", "5", "6", "Domingo", "Segunda", ...]

// Filtrar apenas nomes (strings que não são números)
const nomes = Object.keys(DiaSemana).filter(k => isNaN(Number(k)));
console.log(nomes);
// ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"]

// Iterar sobre nomes
nomes.forEach(nome => {
  console.log(`Nome: ${nome}, Valor: ${DiaSemana[nome as keyof typeof DiaSemana]}`);
});
```

### 2. Iterar Sobre Valores

```typescript
enum Status {
  Pendente,
  EmAndamento,
  Concluido
}

// Obter apenas valores numéricos
const valores = Object.keys(Status)
  .filter(k => !isNaN(Number(k)))
  .map(k => Number(k));

console.log(valores); // [0, 1, 2]

// Ou obter valores usando Object.values
const todosValores = Object.values(Status);
console.log(todosValores);
// [0, 1, 2, "Pendente", "EmAndamento", "Concluido"]

// Filtrar apenas números
const apenasNumeros = todosValores.filter(v => typeof v === "number");
console.log(apenasNumeros); // [0, 1, 2]
```

### 3. Iterar Sobre Pares Nome-Valor

```typescript
enum Prioridade {
  Baixa,
  Media,
  Alta
}

// Obter pares [nome, valor]
const pares = Object.keys(Prioridade)
  .filter(k => isNaN(Number(k)))
  .map(nome => [nome, Prioridade[nome as keyof typeof Prioridade]]);

console.log(pares);
// [["Baixa", 0], ["Media", 1], ["Alta", 2]]

// Iterar sobre pares
pares.forEach(([nome, valor]) => {
  console.log(`${nome} = ${valor}`);
});
```

### 4. For...in Loop

```typescript
enum Animal {
  Cachorro,
  Gato,
  Passaro
}

for (const membro in Animal) {
  // membro inclui números e nomes
  if (isNaN(Number(membro))) {
    console.log(`Nome: ${membro}, Valor: ${Animal[membro as keyof typeof Animal]}`);
  }
}
```

## 🎯 Casos de Uso

### 1. Gerar Dropdown/Select Options

```typescript
enum TipoProduto {
  Eletronico,
  Vestuario,
  Alimento,
  Livro
}

function gerarOpcoes(enumObj: any): Array<{ label: string; value: number }> {
  return Object.keys(enumObj)
    .filter(k => isNaN(Number(k)))
    .map(key => ({
      label: key,
      value: enumObj[key]
    }));
}

const opcoes = gerarOpcoes(TipoProduto);
console.log(opcoes);
// [
//   { label: "Eletronico", value: 0 },
//   { label: "Vestuario", value: 1 },
//   { label: "Alimento", value: 2 },
//   { label: "Livro", value: 3 }
// ]
```

### 2. Validação

```typescript
enum StatusValido {
  Ativo,
  Inativo,
  Pendente
}

function ehStatusValido(valor: number): boolean {
  const valoresValidos = Object.keys(StatusValido)
    .filter(k => !isNaN(Number(k)))
    .map(k => Number(k));

  return valoresValidos.includes(valor);
}

console.log(ehStatusValido(1));  // true
console.log(ehStatusValido(99)); // false
```

### 3. Conversão Nome ↔ Valor

```typescript
enum Nivel {
  Iniciante,
  Intermediario,
  Avancado
}

function obterNomePorValor(enumObj: any, valor: number): string | undefined {
  const entrada = Object.entries(enumObj)
    .find(([key, val]) => val === valor && isNaN(Number(key)));

  return entrada ? entrada[0] : undefined;
}

console.log(obterNomePorValor(Nivel, 1)); // "Intermediario"
```

## ⚠️ String Enums

String enums têm estrutura diferente:

```typescript
enum Cor {
  Vermelho = "RED",
  Verde = "GREEN",
  Azul = "BLUE"
}

// Objeto runtime (sem reverse mapping):
// {
//   Vermelho: "RED",
//   Verde: "GREEN",
//   Azul: "BLUE"
// }

// Iterar string enums é mais simples
const nomes = Object.keys(Cor);
console.log(nomes); // ["Vermelho", "Verde", "Azul"]

const valores = Object.values(Cor);
console.log(valores); // ["RED", "GREEN", "BLUE"]

// Pares
Object.entries(Cor).forEach(([nome, valor]) => {
  console.log(`${nome} = ${valor}`);
});
// Vermelho = RED
// Verde = GREEN
// Azul = BLUE
```

## 🔧 Utility Functions

### Enum to Array

```typescript
function enumParaArray<T extends Record<string, string | number>>(
  enumObj: T
): Array<{ nome: string; valor: T[keyof T] }> {
  return Object.keys(enumObj)
    .filter(k => isNaN(Number(k)))
    .map(nome => ({
      nome,
      valor: enumObj[nome as keyof T]
    }));
}

enum Status { Ativo, Inativo }
const statusArray = enumParaArray(Status);
```

### Enum Keys Helper

```typescript
function obterChavesEnum(enumObj: any): string[] {
  return Object.keys(enumObj).filter(k => isNaN(Number(k)));
}

function obterValoresEnum(enumObj: any): number[] {
  return Object.keys(enumObj)
    .filter(k => !isNaN(Number(k)))
    .map(k => Number(k));
}
```

## ⚠️ Limitações

### 1. Const Enums Não São Iteráveis

```typescript
const enum Direcao {
  Norte, Sul, Leste, Oeste
}

// ❌ Erro - Direcao não existe em runtime
// Object.keys(Direcao);
```

### 2. Complexidade com Enums Numéricos

Devido ao reverse mapping, iterar enums numéricos requer filtragem:

```typescript
enum Numero {
  Um = 1,
  Dois = 2
}

// Sem filtragem, obtém duplicatas
console.log(Object.keys(Numero)); // ["1", "2", "Um", "Dois"]
```

## 📚 Conclusão

Iteração sobre enums permite processar membros dinamicamente, essencial para:

- Gerar UI elements (dropdowns, listas)
- Validação de valores
- Conversões nome ↔ valor
- Ferramentas e utilitários

Dominar iteração de enums é entender sua natureza como objetos JavaScript em runtime, usando essa característica para introspecção e processamento dinâmico.
