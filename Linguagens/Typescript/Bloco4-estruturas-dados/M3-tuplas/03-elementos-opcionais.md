# Elementos Opcionais em Tuplas TypeScript

## 🎯 Introdução

**Elementos opcionais** em tuplas permitem **comprimentos variáveis controlados**, onde posições finais podem estar presentes ou ausentes. Isso adiciona flexibilidade mantendo type safety.

## 📋 Conceitos Fundamentais

### Sintaxe de Elementos Opcionais

```typescript
// Sintaxe: Tipo? (interrogação após tipo)
type CoordenadaOptional = [x: number, y: number, z?: number];

// Válido com 2 elementos
let coord2D: CoordenadaOptional = [10, 20]; // ✅ OK

// Válido com 3 elementos
let coord3D: CoordenadaOptional = [10, 20, 30]; // ✅ OK
```

### Tipo do Elemento Opcional

Elementos opcionais têm tipo `T | undefined`:

```typescript
type Tripla = [string, number, boolean?];

let tripla: Tripla = ["Ana", 25];
let terceiro: boolean | undefined = tripla[2]; // Tipo: boolean | undefined
```

## 🧠 Fundamentos Teóricos

### Elementos Opcionais São Tipo Union

Internamente, elemento opcional `T?` é equivalente a `T | undefined`:

```typescript
// Estas são equivalentes:
type Opcao1 = [string, number?];
type Opcao2 = [string, number | undefined];

let t1: Opcao1 = ["texto"]; // ✅ OK
let t2: Opcao2 = ["texto", undefined]; // ✅ OK (undefined explícito)
```

**Diferença sutil:** `T?` permite **omitir** o elemento; `T | undefined` requer elemento (pode ser `undefined`).

### Ordem de Elementos Opcionais

Elementos opcionais **devem vir após elementos obrigatórios**:

```typescript
// ✅ OK: opcional no final
type Valido = [string, number, boolean?];

// ❌ Erro: opcional antes de obrigatório
type Invalido = [string, number?, boolean]; // Erro!
```

**Razão:** Permitir opcionais no meio criaria ambiguidade sobre quais posições existem.

### Múltiplos Elementos Opcionais

```typescript
type Config = [app: string, porta?: number, debug?: boolean, timeout?: number];

// Todas as variações válidas:
let c1: Config = ["app"]; // ✅ OK
let c2: Config = ["app", 3000]; // ✅ OK
let c3: Config = ["app", 3000, true]; // ✅ OK
let c4: Config = ["app", 3000, true, 5000]; // ✅ OK

// ❌ Não pode pular elemento opcional
let c5: Config = ["app", undefined, true]; // Precisa undefined explícito
```

### Length de Tuplas com Opcionais

```typescript
type Optional = [string, number?];

let t1: Optional = ["texto"];
let t2: Optional = ["texto", 42];

// Length varia em runtime mas tipo reflete variação
let len1: 1 | 2 = t1.length; // Tipo: 1 | 2
let len2: 1 | 2 = t2.length; // Tipo: 1 | 2
```

**Conceito:** TypeScript captura variação possível de comprimento no tipo de `length`.

## 🔍 Análise Conceitual Profunda

### Checagem de Existência

```typescript
type Dados = [nome: string, idade: number, email?: string];

function processar(dados: Dados) {
  const [nome, idade, email] = dados;
  
  // email tem tipo: string | undefined
  
  // ❌ Erro: pode ser undefined
  console.log(email.toUpperCase());
  
  // ✅ OK: verifica existência
  if (email !== undefined) {
    console.log(email.toUpperCase()); // Type narrowing funciona!
  }
  
  // ✅ OK: optional chaining
  console.log(email?.toUpperCase());
}
```

### Padrão de Argumentos Opcionais

Tuplas com opcionais mapeiam bem para funções com parâmetros opcionais:

```typescript
// Função com parâmetros opcionais
function criar(nome: string, idade?: number, ativo?: boolean) {
  // ...
}

// Tipo dos parâmetros como tupla
type ParamsCreate = [nome: string, idade?: number, ativo?: boolean];

// Spread de tupla para chamar função
function chamarCriar(params: ParamsCreate) {
  criar(...params); // ✅ Type-safe!
}

chamarCriar(["Ana"]); // ✅ OK
chamarCriar(["Ana", 25]); // ✅ OK
chamarCriar(["Ana", 25, true]); // ✅ OK
```

### Diferença: Opcional vs Undefined Explícito

```typescript
type ComOpcional = [string, number?];
type ComUndefined = [string, number | undefined];

// Opcional: pode omitir
let op1: ComOpcional = ["texto"]; // ✅ OK

// Undefined: deve incluir (pode ser undefined)
let un1: ComUndefined = ["texto"]; // ❌ Erro: falta elemento
let un2: ComUndefined = ["texto", undefined]; // ✅ OK
```

**Implicação:** Opcionais permitem comprimentos variáveis; unions exigem comprimento fixo.

## 🎯 Aplicabilidade

### Coordenadas 2D/3D

```typescript
type Coordenada = [x: number, y: number, z?: number];

function distancia(ponto: Coordenada): number {
  const [x, y, z] = ponto;
  
  if (z !== undefined) {
    // 3D
    return Math.sqrt(x * x + y * y + z * z);
  } else {
    // 2D
    return Math.sqrt(x * x + y * y);
  }
}

distancia([3, 4]); // 2D: 5
distancia([1, 2, 2]); // 3D: 3
```

### Configuração com Defaults

```typescript
type ServerConfig = [
  host: string,
  port?: number,
  timeout?: number,
  retries?: number
];

function criarServidor(config: ServerConfig) {
  const [
    host,
    port = 3000, // Default se undefined
    timeout = 5000,
    retries = 3
  ] = config;
  
  console.log({ host, port, timeout, retries });
}

criarServidor(["localhost"]); // Usa todos defaults
criarServidor(["localhost", 8080]); // Sobrescreve port
```

### Retorno Condicional

```typescript
// Retorna [valor] em sucesso, [null, erro] em falha
function buscar(id: number): [data: User] | [data: null, error: Error] {
  try {
    const user = /* fetch */;
    return [user];
  } catch (error) {
    return [null, error as Error];
  }
}

const resultado = buscar(1);

if (resultado.length === 1) {
  // Sucesso
  const [usuario] = resultado;
  console.log(usuario.nome);
} else {
  // Erro
  const [, erro] = resultado;
  console.error(erro);
}
```

## ⚠️ Limitações

### Não Pode Pular Elementos Opcionais

```typescript
type Tuple = [string, number?, boolean?];

// ❌ Não pode fornecer 3º sem 2º
let t: Tuple = ["texto", true]; // ❌ Erro: number esperado na posição 1

// ✅ Deve usar undefined para pular
let t2: Tuple = ["texto", undefined, true]; // ✅ OK
```

**Razão:** Tuplas são posicionais. Não há forma de "pular" uma posição.

### Destructuring Pode Ser Confuso

```typescript
type Optional = [string, number, boolean?];

function processar(tupla: Optional) {
  // ⚠️ terceiro pode não existir!
  const [primeiro, segundo, terceiro] = tupla;
  
  // terceiro: boolean | undefined (não é garantido existir)
  if (terceiro) { // Precisa check
    console.log(terceiro);
  }
}
```

### Readonly com Opcionais

```typescript
type Readonly = readonly [string, number?, boolean?];

let t: Readonly = ["texto"];

// ✅ Imutável e type-safe
t[0] = "novo"; // ❌ Erro: readonly
t.push(42); // ❌ Erro: push não existe em readonly
```

## 🔗 Interconexões

### Com Rest Elements

Elementos opcionais podem combinar com rest:

```typescript
type Mixed = [string, number?, ...boolean[]];

let m1: Mixed = ["texto"]; // ✅ OK
let m2: Mixed = ["texto", 42]; // ✅ OK
let m3: Mixed = ["texto", 42, true, false, true]; // ✅ OK
```

### Com Generics

```typescript
type Optional<T, U = never> = U extends never
  ? [value: T]
  : [value: T, extra?: U];

type SemExtra = Optional<string>; // [string]
type ComExtra = Optional<string, number>; // [string, number?]
```

### Com Conditional Types

```typescript
type IfOptional<T extends readonly any[]> =
  T extends readonly [...any[], infer Last?]
    ? Last
    : never;

type Ultimo = IfOptional<[string, number, boolean?]>; // boolean | undefined
```

## 📚 Conclusão

Elementos opcionais adicionam **flexibilidade controlada** a tuplas, permitindo **comprimentos variáveis** mantendo **type safety**. Use quando:

✅ Última(s) posição(ões) podem estar ausentes  
✅ Parâmetros opcionais mapeiam para tupla  
✅ Configurações têm defaults  
✅ Coordenadas 2D/3D compartilham tipo  

Lembre-se:
- Opcionais **devem vir no final**
- Tipo é `T | undefined`
- **Não pode pular** elementos opcionais (use `undefined`)
- Sempre **valide existência** antes de usar
- Combine com `readonly` para imutabilidade

Elementos opcionais bridge a lacuna entre tuplas rígidas e arrays flexíveis.
