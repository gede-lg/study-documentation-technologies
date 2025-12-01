# Constraints Genéricos (T extends Type): Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Generic constraints** (restrições genéricas) são limitações declaradas em type parameters usando **`extends`**, que restringem quais tipos podem ser substituídos pelo parâmetro genérico. Conceitualmente, representam **polimorfismo limitado** (bounded polymorphism), onde função genérica opera sobre família de tipos que compartilham características comuns.

Na essência, constraints materializam o princípio de **contratos mínimos**, onde especificamos requisitos que tipo deve satisfazer para ser usado com segurança dentro da função genérica.

## 📋 Fundamentos

### Sintaxe Básica

```typescript
// Sem constraint - aceita qualquer tipo
function semRestrição<T>(valor: T): T {
  return valor;
}

// Com constraint - aceita apenas tipos que estendem { length: number }
function comRestrição<T extends { length: number }>(valor: T): T {
  console.log(valor.length); // ✅ Seguro - sabemos que tem length
  return valor;
}

comRestrição("hello");      // ✅ string tem length
comRestrição([1, 2, 3]);    // ✅ array tem length
comRestrição({ length: 5 }); // ✅ objeto com length
// comRestrição(42);         // ❌ Erro - number não tem length
```

### Problema que Resolve

```typescript
// ❌ Sem constraint - erro de compilação
function tamanho<T>(valor: T): number {
  return valor.length; // Erro: Property 'length' does not exist on type 'T'
}

// ✅ Com constraint - type-safe
function tamanhoSeguro<T extends { length: number }>(valor: T): number {
  return valor.length; // OK - constraint garante que T tem length
}
```

## 🔍 Análise Conceitual

### 1. Constraint com Interface

```typescript
interface Nomeavel {
  nome: string;
}

function saudar<T extends Nomeavel>(obj: T): string {
  return `Olá, ${obj.nome}!`; // Seguro - T tem nome
}

saudar({ nome: "Ana", idade: 25 }); // OK
saudar({ nome: "Produto X", preco: 100 }); // OK
// saudar({ idade: 25 }); // Erro - falta nome
```

**Conceito:** Constraint `T extends Nomeavel` garante que qualquer tipo passado terá propriedade `nome`.

### 2. Constraint com Union Types

```typescript
function processar<T extends string | number>(valor: T): string {
  if (typeof valor === "string") {
    return valor.toUpperCase();
  }
  return valor.toFixed(2);
}

processar("hello"); // "HELLO"
processar(42.5);    // "42.50"
// processar(true); // Erro - boolean não é string | number
```

### 3. Constraint com Keyof

```typescript
// Garantir que chave existe no objeto
function obterPropriedade<T, K extends keyof T>(obj: T, chave: K): T[K] {
  return obj[chave];
}

const pessoa = { nome: "Ana", idade: 25 };
obterPropriedade(pessoa, "nome");  // "Ana" - tipo string
obterPropriedade(pessoa, "idade"); // 25 - tipo number
// obterPropriedade(pessoa, "email"); // Erro - "email" não é keyof pessoa
```

**Conceito:** `K extends keyof T` garante que `K` é uma chave válida de `T`, providenciando type safety absoluto.

### 4. Múltiplos Constraints

```typescript
// T deve ter length E ser iterável
interface Comprimento {
  length: number;
}

function duplicar<T extends Comprimento & Iterable<any>>(valor: T): T[] {
  const resultado: T[] = [];

  for (let i = 0; i < valor.length; i++) {
    resultado.push(valor);
  }

  return resultado;
}

duplicar("abc");      // OK - string tem length e é iterável
duplicar([1, 2, 3]);  // OK - array tem length e é iterável
```

### 5. Constraint com Tipo Genérico

```typescript
// Array de qualquer tipo
function primeiro<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Apenas arrays de números ou strings
function primeiroRestrito<T extends number | string>(arr: T[]): T | undefined {
  return arr[0];
}

primeiroRestrito([1, 2, 3]);        // OK
primeiroRestrito(["a", "b"]);       // OK
// primeiroRestrito([true, false]); // Erro
```

### 6. Constraint com Constructor

```typescript
// T deve ser classe instanciável
function criar<T>(Classe: new () => T): T {
  return new Classe();
}

class Usuario {
  nome = "Anônimo";
}

const usuario = criar(Usuario); // Usuario
```

## 🎯 Aplicabilidade

### Clonar Objetos

```typescript
function clonar<T extends object>(obj: T): T {
  return { ...obj };
}

const original = { nome: "Ana", idade: 25 };
const copia = clonar(original); // { nome: string; idade: number }

// clonar(42); // Erro - number não é object
```

### Ordenação Genérica

```typescript
interface Comparavel {
  comparar(outro: this): number;
}

function ordenar<T extends Comparavel>(arr: T[]): T[] {
  return arr.slice().sort((a, b) => a.comparar(b));
}

class Numero implements Comparavel {
  constructor(public valor: number) {}

  comparar(outro: Numero): number {
    return this.valor - outro.valor;
  }
}

const nums = [new Numero(3), new Numero(1), new Numero(2)];
ordenar(nums); // [Numero(1), Numero(2), Numero(3)]
```

### Validação de Schema

```typescript
interface Validavel {
  validar(): boolean;
}

function validarTodos<T extends Validavel>(items: T[]): boolean {
  return items.every(item => item.validar());
}
```

### Promise Genérico

```typescript
function aguardar<T>(promise: Promise<T>): Promise<T> {
  return promise.then(resultado => {
    console.log("Resolvido:", resultado);
    return resultado;
  });
}
```

## ⚠️ Limitações

### 1. Não Pode Restringir a Valor Específico

```typescript
// ❌ Não é possível restringir a valor literal
// function apenas42<T extends 42>(valor: T) {} // Erro de sintaxe

// ✅ Mas pode usar tipos literais
function apenasTrue<T extends true>(valor: T): T {
  return valor;
}
```

### 2. Constraint Muito Genérico Perde Utilidade

```typescript
// Constraint muito amplo - não adiciona segurança
function inutil<T extends any>(valor: T): T {
  return valor;
}

// Equivalente a não ter constraint
function semConstraint<T>(valor: T): T {
  return valor;
}
```

### 3. Constraint e Inferência

```typescript
function processar<T extends string>(valor: T): T {
  return valor.toUpperCase() as T; // Necessário cast
}

// Inferência pode ser mais específica que constraint
const resultado = processar("hello"); // tipo: "hello" (literal), não string
```

## 🔗 Interconexões Conceituais

- **Keyof Operator**: Usado frequentemente em constraints (`K extends keyof T`)
- **Conditional Types**: Constraints são verificados em conditional types
- **Mapped Types**: Constraints definem transformações válidas
- **Type Guards**: Complementam constraints em runtime

## 📚 Conclusão

Constraints genéricos usam `extends` para limitar tipos aceitáveis por parâmetros genéricos, garantindo que tipos tenham propriedades/métodos necessários. São essenciais para criar funções genéricas que operam com segurança sobre famílias de tipos relacionados, equilibrando flexibilidade com type safety.
