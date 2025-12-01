# Tuplas com Comprimento Conhecido em TypeScript

## 🎯 Introdução

Tuplas em TypeScript têm **comprimento fixo conhecido em tempo de compilação**. Esta característica fundamental diferencia tuplas de arrays e permite **validação de comprimento** como parte do sistema de tipos.

## 📋 Conceitos Fundamentais

### Comprimento como Parte do Tipo

```typescript
// Tupla de comprimento 2
type Par = [string, number];
let par: Par = ["Ana", 25]; // ✅ OK

// Erro se comprimento diferente
let parIncompleto: Par = ["Ana"]; // ❌ Erro
let parExtra: Par = ["Ana", 25, true]; // ❌ Erro
```

### Propriedade Length Tipada

```typescript
type Tripla = [number, number, number];
let tripla: Tripla = [1, 2, 3];

// length é tipo literal, não number genérico!
let tamanho: 3 = tripla.length; // ✅ Tipo: 3 (literal)
```

## 🧠 Fundamentos Teóricos

### Validação em Tempo de Compilação

TypeScript valida comprimento durante:

**1. Inicialização Direta:**
```typescript
let coords: [number, number] = [10]; // ❌ Erro: falta elemento
let coords2: [number, number] = [10, 20, 30]; // ❌ Erro: muitos elementos
```

**2. Atribuição de Tuplas:**
```typescript
let par1: [string, number] = ["Ana", 25];
let par2: [string, number, boolean] = ["Bruno", 30, true];

par1 = par2; // ❌ Erro: comprimentos incompatíveis
```

### Length como Type Literal

A propriedade `length` de tuplas tem **tipo literal exato**, não `number`:

```typescript
type Dupla = [string, string];
type Tripla = [string, string, string];

function processar(tupla: Dupla | Tripla) {
  if (tupla.length === 2) {
    // TypeScript sabe: é Dupla
    const dupla: Dupla = tupla; // ✅ OK
  } else {
    // TypeScript sabe: é Tripla
    const tripla: Tripla = tupla; // ✅ OK
  }
}
```

**Conceito:** Type narrowing baseado em `length` funciona porque cada tupla tem length literal diferente.

### Diferença com Arrays

```typescript
// Array: length é number (variável)
let array: number[] = [1, 2, 3];
let len: number = array.length; // Tipo: number (desconhecido em compilação)

// Tupla: length é literal (conhecida)
let tupla: [number, number] = [1, 2];
let lenTupla: 2 = tupla.length; // Tipo: 2 (conhecida!)
```

## 🔍 Análise Conceitual Profunda

### Comprimentos Diferentes São Tipos Diferentes

```typescript
type Dupla = [number, number];
type Tripla = [number, number, number];

// Tipos incompatíveis!
let dupla: Dupla = [1, 2];
let tripla: Tripla = [1, 2, 3];

dupla = tripla; // ❌ Erro
tripla = dupla; // ❌ Erro
```

**Fundamento:** Comprimento é parte intrínseca do tipo. Mudar comprimento = mudar tipo.

### Validação vs Runtime

```typescript
let tupla: [string, number] = ["Ana", 25];

// ✅ TypeScript valida inicialização
tupla = ["Ana", 25, true]; // ❌ Erro em compilação

// ⚠️ Métodos de array podem quebrar em runtime
tupla.push(true as any); // TypeScript permite mas quebra contrato!
console.log(tupla.length); // 3 em runtime (não é mais válida!)
```

**Limitação:** TypeScript valida comprimento em atribuições diretas, mas não pode prevenir modificações via métodos de array.

**Solução:** Use `readonly`:
```typescript
let segura: readonly [string, number] = ["Ana", 25];
segura.push(true); // ❌ Erro: Property 'push' does not exist
```

### Pattern Matching por Comprimento

```typescript
type Forma =
  | [tipo: "circulo", raio: number]
  | [tipo: "retangulo", largura: number, altura: number];

function calcularArea(forma: Forma): number {
  if (forma.length === 2) {
    // TypeScript sabe: é círculo
    const [tipo, raio] = forma;
    return Math.PI * raio * raio;
  } else {
    // TypeScript sabe: é retângulo
    const [tipo, largura, altura] = forma;
    return largura * altura;
  }
}
```

## 🎯 Aplicabilidade

### Quando Comprimento Fixo é Essencial

**1. Coordenadas Geométricas:**
```typescript
type Ponto2D = [x: number, y: number]; // Sempre 2
type Ponto3D = [x: number, y: number, z: number]; // Sempre 3
type RGB = [red: number, green: number, blue: number]; // Sempre 3
```

**2. Múltiplos Retornos de Funções:**
```typescript
function dividir(a: number, b: number): [quociente: number, resto: number] {
  return [Math.floor(a / b), a % b]; // Sempre retorna exatamente 2
}
```

**3. Estado + Setter (React useState pattern):**
```typescript
function useState<T>(inicial: T): [state: T, setState: (value: T) => void] {
  // Sempre retorna par [valor, função]
}
```

### Validação de Comprimento em Genéricos

```typescript
// Garantir comprimento mínimo
type AtLeastTwo<T> = [T, T, ...T[]];

let valido: AtLeastTwo<number> = [1, 2]; // ✅ OK
let valido2: AtLeastTwo<number> = [1, 2, 3, 4]; // ✅ OK
let invalido: AtLeastTwo<number> = [1]; // ❌ Erro
```

## ⚠️ Limitações

### Métodos Mutativos Quebram Comprimento

```typescript
let coords: [number, number] = [10, 20];

// ⚠️ TypeScript não previne estas mutações
coords.push(30); // Compila mas quebra tipo!
coords.pop(); // Compila mas quebra tipo!
coords.splice(0, 1, 999, 888); // Compila mas quebra tipo!

// Runtime: comprimento não é mais 2
console.log(coords.length); // Pode ser 1, 3, etc.
```

**Mitigação:** Sempre use `readonly` para tuplas que não devem mudar:
```typescript
let segura: readonly [number, number] = [10, 20];
segura.push(30); // ❌ Erro de compilação
```

### Arrays Não Podem Ser Narrowed para Tuplas

```typescript
function recebeArray(arr: number[]) {
  // Mesmo sabendo que arr tem 2 elementos em runtime...
  if (arr.length === 2) {
    // TypeScript não refina para [number, number]
    let tupla: [number, number] = arr; // ❌ Erro!
    
    // Necessário type assertion
    let tuplaForçada = arr as [number, number]; // ⚠️ Unsafe!
  }
}
```

**Razão:** Arrays são mutáveis. Mesmo verificando length agora, pode mudar antes de uso.

## 🔗 Interconexões

### Relação com Type Guards

```typescript
function isTripla(tupla: [number, number] | [number, number, number]): tupla is [number, number, number] {
  return tupla.length === 3;
}

let valor: [number, number] | [number, number, number] = [1, 2, 3];

if (isTripla(valor)) {
  // TypeScript sabe: é [number, number, number]
  const [x, y, z] = valor; // ✅ z disponível
}
```

### Relação com Generics Condicionais

```typescript
type TamanhoTupla<T extends readonly any[]> = T extends { length: infer L }
  ? L
  : never;

type Tam1 = TamanhoTupla<[string, number]>; // 2
type Tam2 = TamanhoTupla<[boolean, string, number, symbol]>; // 4
```

## 📚 Conclusão

Comprimento fixo é a característica **definidora** de tuplas. TypeScript valida comprimento em **atribuições diretas**, usa **length como tipo literal** para narrowing, e trata **comprimentos diferentes como tipos incompatíveis**.

Para manter garantias de comprimento:
✅ Use `readonly` para prevenir mutações  
✅ Valide comprimento com type guards quando necessário  
✅ Evite métodos mutativos de array em tuplas  
✅ Aproveite length literal para pattern matching  

Comprimento conhecido permite **type safety estrutural** impossível com arrays dinâmicos.
