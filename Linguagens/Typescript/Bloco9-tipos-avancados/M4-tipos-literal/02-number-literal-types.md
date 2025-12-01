# Number Literal Types

## 🎯 Introdução e Definição

### Definição Conceitual

**Number literal types** são tipos TypeScript que representam **valores exatos de números** ao invés de tipo genérico `number`. Similar a string literal types, number literal types restringem variável a **conjunto finito de números específicos**. Exemplo: `type StatusCode = 200 | 404 | 500` aceita apenas esses três números exatos, rejeitando qualquer outro valor numérico.

Conceitualmente, number literal types implementam **exact value types** - tipo definido por **valor numérico preciso** ao invés de range contínuo. Combinados com **union types**, criam **enumerações numéricas tipadas** para representar códigos de status, versões de protocolo, índices fixos, flags binárias, e valores discretos predefinidos.

**Fundamento teórico:** Number literal types derivam de **singleton types** - tipos que contêm exatamente **um valor**. Implementam **finite sets** com elementos numéricos. Diferente de enums numéricos (que geram JavaScript runtime), number literal types são **zero-cost abstraction** - não existem em runtime, apenas compile-time.

**Pattern básico:**
```typescript
// Number literal type - apenas 200, 404 ou 500
type HttpStatus = 200 | 404 | 500;

let status: HttpStatus;
status = 200;   // ✓ OK
status = 404;   // ✓ OK
status = 201;   // ✗ Error - não está na union
```

**Diferença fundamental:**
- **`number`:** Aceita qualquer número
- **Number literal:** Aceita apenas números específicos

### Contexto Histórico e Evolução

**TypeScript 1.8 (2016):** Introdução de number literal types junto com string literal types.

```typescript
// TypeScript 1.8 - number literal types
type Dice = 1 | 2 | 3 | 4 | 5 | 6;

function rollDice(): Dice {
  return (Math.floor(Math.random() * 6) + 1) as Dice;
}

const result: Dice = rollDice();
```

**Motivação inicial:** Type safety para valores numéricos discretos, substituir enums em casos simples.

**TypeScript 2.0 (2016):** Discriminated unions com number literals.

```typescript
// TypeScript 2.0 - discriminated unions
type SuccessResponse = { status: 200; data: string };
type NotFoundResponse = { status: 404; error: string };
type ServerErrorResponse = { status: 500; error: string };

type Response = SuccessResponse | NotFoundResponse | ServerErrorResponse;

function handleResponse(response: Response) {
  switch (response.status) {
    case 200:
      console.log(response.data);  // TypeScript sabe que é SuccessResponse
      break;
    case 404:
      console.log(response.error);  // TypeScript sabe que é NotFoundResponse
      break;
    case 500:
      console.log(response.error);  // TypeScript sabe que é ServerErrorResponse
      break;
  }
}
```

**TypeScript 2.4 (2017):** Numeric enums baseados em number literals.

```typescript
// TypeScript 2.4 - numeric enums
enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500
}

// Equivalente a number literal types (tipo, não runtime)
type HttpStatusLiteral = 200 | 404 | 500;
```

**TypeScript 3.4 (2019):** `const` assertions para number literals.

```typescript
// TypeScript 3.4 - const assertions
const config = {
  port: 3000 as const,  // type: 3000 (não number)
  timeout: 5000 as const  // type: 5000 (não number)
} as const;

// config.port tem type 3000, não number
```

**TypeScript 4.0 (2020):** Melhor type inference com literals.

```typescript
// TypeScript 4.0 - melhor inference
function createConfig<T extends number>(port: T) {
  return { port };  // port preserva literal type T
}

const config = createConfig(8080);
// config.port tem type 8080, não number
```

**Antes vs Depois:**

**Pré-TypeScript 1.8 (sem number literal types):**
```typescript
// Apenas number genérico ou enums
function setPort(port: number) {
  // Sem type safety - aceita qualquer number
}

setPort(3000);   // OK
setPort(99999);  // OK (mas pode ser inválido)
```

**Pós-TypeScript 1.8 (com number literal types):**
```typescript
// Type safety com number literal types
type ValidPort = 3000 | 8080 | 8000;

function setPort(port: ValidPort) {
  // Type safety garantido
}

setPort(3000);   // ✓ OK
// setPort(99999);  // ✗ Error
```

**Evolução de uso:**

**Era inicial (enums numéricos):**
```typescript
enum Priority {
  Low = 0,
  Medium = 1,
  High = 2
}
```

**Era moderna (number literal types):**
```typescript
type Priority = 0 | 1 | 2;
```

**Era tuple types:**
```typescript
type RGB = [number, number, number];
const red: RGB = [255, 0, 0];

// Com literals
type RedChannel = 0 | 127 | 255;
type GreenChannel = 0 | 127 | 255;
type BlueChannel = 0 | 127 | 255;
```

### Problema Fundamental que Resolve

Number literal types resolvem problemas de **type safety com números discretos**, **magic numbers**, e **valores numéricos predefinidos**.

**Problema 1: Magic numbers sem type safety**
```typescript
// Sem number literal types - magic numbers
function setHttpStatus(status: number) {
  if (status === 200) {
    // Success
  } else if (status === 404) {
    // Not Found
  }
}

setHttpStatus(200);   // OK
setHttpStatus(999);   // Aceito, mas inválido ❌
setHttpStatus(20);    // Typo - aceito ❌
```

**Solução: Number literal types restringem valores**
```typescript
// Com number literal types - type safety
type HttpStatus = 200 | 404 | 500;

function setHttpStatus(status: HttpStatus) {
  if (status === 200) {
    // Success
  } else if (status === 404) {
    // Not Found
  }
}

setHttpStatus(200);   // ✓ OK
// setHttpStatus(999);  // ✗ Error - valor inválido
// setHttpStatus(20);   // ✗ Error - typo detectado
```

**Problema 2: Versões de protocolo sem validação**
```typescript
// Sem number literal types - qualquer versão aceita
interface ApiConfig {
  version: number;
}

const config: ApiConfig = {
  version: 99  // Versão inexistente - aceito ❌
};
```

**Solução: Literal types validam versões**
```typescript
// Com number literal types - versões validadas
type ApiVersion = 1 | 2 | 3;

interface ApiConfig {
  version: ApiVersion;
}

const config: ApiConfig = {
  version: 2  // ✓ OK
  // version: 99  // ✗ Error - versão inválida
};
```

**Problema 3: Índices de array sem bounds checking**
```typescript
// Sem number literal types - índices arbitrários
type RGB = [number, number, number];

function getChannel(color: RGB, index: number): number {
  return color[index];  // Pode acessar índice inválido ❌
}

const red: RGB = [255, 0, 0];
console.log(getChannel(red, 10));  // undefined (sem erro)
```

**Solução: Literal types restringem índices**
```typescript
// Com number literal types - índices validados
type RGB = [number, number, number];
type RGBIndex = 0 | 1 | 2;

function getChannel(color: RGB, index: RGBIndex): number {
  return color[index];  // Type-safe
}

const red: RGB = [255, 0, 0];
console.log(getChannel(red, 0));  // ✓ OK
// console.log(getChannel(red, 10));  // ✗ Error
```

**Problema 4: Códigos de erro sem documentação**
```typescript
// Sem number literal types - códigos arbitrários
function handleError(code: number) {
  // Quais códigos são válidos? ❌
}

handleError(1);
handleError(2);
handleError(999);  // Código inválido - aceito
```

**Solução: Literal types documentam códigos**
```typescript
// Com number literal types - códigos documentados
type ErrorCode = 1001 | 1002 | 1003 | 2001 | 2002;

function handleError(code: ErrorCode) {
  // Autocomplete mostra códigos válidos ✅
}

handleError(1001);  // ✓ OK
// handleError(999);  // ✗ Error - código inválido
```

**Fundamento teórico:** Number literal types implementam **discrete value sets** - conjuntos finitos de valores numéricos válidos.

### Importância no Ecossistema

Number literal types são importantes porque:

- **Type Safety:** Detectar valores numéricos inválidos em compile-time
- **Magic Numbers:** Eliminar magic numbers com tipos documentados
- **API Design:** Criar APIs com valores numéricos type-safe
- **Status Codes:** Type safety para HTTP status codes, error codes
- **Versioning:** Validar versões de protocolo/API
- **Indices:** Type-safe array/tuple indexing
- **Discriminated Unions:** Base para pattern matching com números
- **Zero Cost:** Abstração compile-time sem overhead runtime

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Exact Numeric Values:** Tipo representa números exatos, não tipo genérico
2. **Union of Numbers:** Combinar com union para múltiplos valores
3. **Compile-time Checking:** Validação em compile-time
4. **Zero Runtime Cost:** Não existem em runtime (diferente de enums)
5. **Autocomplete:** IDEs sugerem valores válidos

### Pilares Fundamentais

- **Literal Syntax:** `42` como tipo
- **Union Literal:** `1 | 2 | 3` para múltiplos valores
- **Type Alias:** `type Name = 42` para reutilização
- **Const Assertion:** `as const` para inferir literal type
- **Narrowing:** Type narrowing com number literals

### Visão Geral das Nuances

- **Integer vs Float:** `1` e `1.0` são o mesmo literal type
- **Widening:** Literal types podem widen para `number`
- **Negative Numbers:** `-1` é literal type válido
- **Binary/Hex/Octal:** `0b1010`, `0xFF`, `0o77` são literals
- **BigInt Literals:** `100n` é bigint literal type (não number)

## 🧠 Fundamentos Teóricos

### Basic Number Literal Type

```typescript
// Number literal type básico

type Port = 3000;

let port: Port;
port = 3000;  // ✓ OK
// port = 8080;  // ✗ Error
// port = 3000.0;  // ✓ OK - 3000 e 3000.0 são idênticos
```

**Análise:** Tipo aceita apenas valor exato `3000`.

### Union of Number Literals

```typescript
// Union de number literal types

type HttpStatus = 200 | 201 | 204 | 400 | 404 | 500;

function handleStatus(status: HttpStatus) {
  if (status === 200) {
    console.log("OK");
  } else if (status >= 400) {
    console.log("Error");
  }
}

handleStatus(200);  // ✓ OK
handleStatus(404);  // ✓ OK
// handleStatus(301);  // ✗ Error
```

**Union:** Combinar múltiplos number literals com `|`.

### Type Alias for Reusability

```typescript
// Type alias para reutilização

type StatusCode = 200 | 404 | 500;

interface ApiResponse {
  status: StatusCode;
  data?: any;
  error?: string;
}

function createResponse(status: StatusCode): ApiResponse {
  return { status };
}

const response = createResponse(200);
```

**Type Alias:** Reutilizar number literal types em múltiplos lugares.

### Princípios e Conceitos Subjacentes

#### Const Assertion

```typescript
// Const assertion para number literal types

// Sem const assertion
const config1 = {
  port: 3000,  // type: number
  version: 1   // type: number
};

// Com const assertion
const config2 = {
  port: 3000,  // type: 3000
  version: 1   // type: 1
} as const;

// config2.port tem type 3000, não number
```

**As Const:** Inferir number literal types ao invés de `number`.

#### Type Narrowing

```typescript
// Type narrowing com number literal types

type Priority = 0 | 1 | 2;

function getPriorityLabel(priority: Priority): string {
  if (priority === 0) {
    return "Low";  // TypeScript sabe que priority é 0
  } else if (priority === 1) {
    return "Medium";  // TypeScript sabe que priority é 1
  } else {
    return "High";  // TypeScript sabe que priority é 2
  }
}
```

**Narrowing:** TypeScript **refina** tipo em cada branch.

### Discriminated Unions

```typescript
// Discriminated unions com number literal types

type SuccessResponse = {
  status: 200;
  data: string;
};

type NotFoundResponse = {
  status: 404;
  error: string;
};

type ServerErrorResponse = {
  status: 500;
  error: string;
};

type ApiResponse = SuccessResponse | NotFoundResponse | ServerErrorResponse;

function handleResponse(response: ApiResponse) {
  switch (response.status) {
    case 200:
      console.log(response.data);  // TypeScript sabe que é SuccessResponse
      break;
    case 404:
      console.log(response.error);  // TypeScript sabe que é NotFoundResponse
      break;
    case 500:
      console.log(response.error);  // TypeScript sabe que é ServerErrorResponse
      break;
  }
}
```

**Discriminated Union:** Number literal `status` discrimina union members.

#### Negative Numbers

```typescript
// Number literal types com números negativos

type Temperature = -10 | -5 | 0 | 5 | 10 | 15 | 20;

let temp: Temperature;
temp = -10;  // ✓ OK
temp = 15;   // ✓ OK
// temp = -20;  // ✗ Error
```

**Negative:** Números negativos são literal types válidos.

### Float Literals

```typescript
// Number literal types com floats

type Opacity = 0 | 0.25 | 0.5 | 0.75 | 1;

let opacity: Opacity;
opacity = 0.5;  // ✓ OK
// opacity = 0.3;  // ✗ Error
```

**Float:** Floats são literal types válidos.

#### Array Indexing

```typescript
// Number literal types para indexação

type RGBIndex = 0 | 1 | 2;
type RGB = [number, number, number];

function getChannel(color: RGB, index: RGBIndex): number {
  return color[index];  // Type-safe indexing
}

const red: RGB = [255, 0, 0];
console.log(getChannel(red, 0));  // 255
// console.log(getChannel(red, 3));  // ✗ Error
```

**Indexing:** Type-safe array/tuple access.

### Version Numbers

```typescript
// Number literal types para versões

type ApiVersion = 1 | 2 | 3;

interface ApiConfig {
  version: ApiVersion;
  endpoint: string;
}

function createApi(config: ApiConfig) {
  if (config.version === 1) {
    // API v1 logic
  } else if (config.version === 2) {
    // API v2 logic
  } else {
    // API v3 logic
  }
}

const api: ApiConfig = {
  version: 2,
  endpoint: "/api/v2"
};
```

**Versions:** Type-safe versioning.

#### Numeric Ranges (Workaround)

```typescript
// Simular ranges com literal types (limitado)

type SmallNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Ou usar branded types para ranges
type Range<Min extends number, Max extends number> = number & {
  __min: Min;
  __max: Max;
};

function inRange<Min extends number, Max extends number>(
  value: number,
  min: Min,
  max: Max
): value is Range<Min, Max> {
  return value >= min && value <= max;
}
```

**Ranges:** Literal types não suportam ranges nativamente - workarounds necessários.

### Modelo Mental para Compreensão

Pense em number literal types como **conjunto finito de números**:

**`number`:** Todos os números possíveis (infinito)
**Number literal type:** Conjunto específico de números (finito)

**Analogia - Botões de Elevador:**

**`number`:** Digitar qualquer andar
**Number literal type:** Apenas botões disponíveis (0, 1, 2, 3)

**Metáfora - Código PIN:**

**`number`:** Qualquer sequência de dígitos
**Number literal type:** Apenas PINs específicos válidos

**Fluxo de type checking:**
```
1. Desenvolvedor escreve valor numérico
2. TypeScript verifica se valor está na union de number literals
3. Se sim, aceita (compile-time ✓)
4. Se não, erro de compilação (compile-time ✗)
5. Runtime: valor é number normal
```

**Exemplo visual:**
```
type Dice = 1 | 2 | 3 | 4 | 5 | 6;

let roll: Dice;

roll = 3;     ✓ Valor na union
roll = 7;     ✗ Valor não na union
roll = 1.5;   ✗ Valor não na union
```

## 🔍 Análise Conceitual Profunda

### Number Literals vs Numeric Enums

```typescript
// Numeric enums
enum HttpStatusEnum {
  OK = 200,
  NotFound = 404,
  ServerError = 500
}

function handleEnum(status: HttpStatusEnum) {
  console.log(status);
}

handleEnum(HttpStatusEnum.OK);  // Precisa usar HttpStatusEnum.OK
// handleEnum(200);  // ✗ Error - sem reverse mapping type-safe

// Number literal types
type HttpStatusLiteral = 200 | 404 | 500;

function handleLiteral(status: HttpStatusLiteral) {
  console.log(status);
}

handleLiteral(200);  // Usa number diretamente

// Vantagens de number literal types:
// - Sem código JavaScript gerado
// - Compatível com numbers normais
// - Melhor para JSON serialization
// - Mais leve

// Vantagens de numeric enums:
// - Reverse mapping (number → string)
// - Namespace explícito
// - Auto-increment
```

**Comparison:** Literal types são zero-cost, enums geram runtime code.

#### Integer vs Float Literals

```typescript
// TypeScript não distingue integer vs float

type IntegerLike = 1 | 2 | 3;
type FloatLike = 1.0 | 2.0 | 3.0;

// IntegerLike e FloatLike são IDÊNTICOS
// 1 === 1.0 em JavaScript

let value: IntegerLike;
value = 1;    // ✓ OK
value = 1.0;  // ✓ OK (mesmo valor)

// Não há distinção entre integer e float literal types
```

**Equivalence:** `1` e `1.0` são o mesmo literal type.

### Binary/Hex/Octal Literals

```typescript
// Different numeric representations

type BinaryValue = 0b0001 | 0b0010 | 0b0100 | 0b1000;
type HexValue = 0x00 | 0xFF;
type OctalValue = 0o7 | 0o77;

let binary: BinaryValue = 0b0001;  // 1
let hex: HexValue = 0xFF;          // 255
let octal: OctalValue = 0o77;      // 63

// TypeScript converte todos para decimal no tipo
// Mas pode usar diferentes bases no código
```

**Representations:** Diferentes bases numéricas são válidas.

#### BigInt Literals (Distinção)

```typescript
// BigInt literals são DIFERENTES de number literals

type NumberLiteral = 100;
type BigIntLiteral = 100n;

let num: NumberLiteral = 100;  // ✓ OK
// let num2: NumberLiteral = 100n;  // ✗ Error - bigint ≠ number

let bigint: BigIntLiteral = 100n;  // ✓ OK
// let bigint2: BigIntLiteral = 100;  // ✗ Error - number ≠ bigint

// Number e BigInt literals são tipos incompatíveis
```

**BigInt:** `100n` é bigint literal, não number literal.

### Literal Types in Generics

```typescript
// Number literal types em generics

function repeat<N extends number>(value: string, times: N): string[] {
  return Array(times).fill(value);
}

const result = repeat("hello", 3);  // string[]

// Generic com constraint de number literals
type ValidSize = 1 | 2 | 3 | 4 | 5;

function createArray<N extends ValidSize>(size: N): number[] {
  return Array(size).fill(0);
}

const arr = createArray(3);  // number[]
// const invalid = createArray(10);  // ✗ Error
```

**Generics:** Number literal types em type parameters.

#### Mapped Types

```typescript
// Mapped types com number literal types

type Index = 0 | 1 | 2;

type IndexedValues = {
  [K in Index]: string;
};

const values: IndexedValues = {
  0: "first",
  1: "second",
  2: "third"
};

// TypeScript garante que todos os índices existem
```

**Mapped Types:** Criar objetos com keys numéricas baseadas em literals.

### Conditional Types

```typescript
// Conditional types com number literal types

type IsEven<N extends number> = N extends 0 | 2 | 4 | 6 | 8 ? true : false;

type Test1 = IsEven<2>;  // true
type Test2 = IsEven<3>;  // false

// Extract specific number literals
type StatusCode = 200 | 201 | 400 | 404 | 500;
type SuccessCodes = Extract<StatusCode, 200 | 201>;  // 200 | 201
type ErrorCodes = Exclude<StatusCode, 200 | 201>;    // 400 | 404 | 500
```

**Conditional Types:** Operar em number literals condicionalmente.

#### Tuple Length

```typescript
// Number literal types para tuple length

type Triple<T> = [T, T, T];

function createTriple<T>(value: T): Triple<T> {
  return [value, value, value];
}

const triple = createTriple(5);
// triple.length tem type 3 (number literal)

type Length = typeof triple.length;  // 3
```

**Tuple Length:** Tuple length é number literal type.

## 🎯 Aplicabilidade e Contextos

### HTTP Status Codes

```typescript
type HttpStatus = 200 | 201 | 204 | 400 | 404 | 500 | 503;
```

**Raciocínio:** Type-safe HTTP status handling.

### Protocol Versions

```typescript
type ProtocolVersion = 1 | 2 | 3;
```

**Raciocínio:** Validar versões de protocolo.

### Priority Levels

```typescript
type Priority = 0 | 1 | 2 | 3;  // Low, Medium, High, Critical
```

**Raciocínio:** Níveis de prioridade type-safe.

### Array/Tuple Indices

```typescript
type RGBIndex = 0 | 1 | 2;
```

**Raciocínio:** Type-safe indexing.

## ⚠️ Limitações e Considerações Teóricas

### No Range Support

```typescript
// TypeScript não suporta ranges nativamente

// Não existe: type Range = 1..10;

// Workaround: listar todos os valores
type SmallRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
```

**Limitação:** Ranges precisam ser listados explicitamente.

### Widening

```typescript
function getPort() {
  return 3000;  // Return type widened to number
}

const port: 3000 | 8080 = getPort();  // ✗ Error
```

**Consideração:** Widening pode causar incompatibilidade.

### No Runtime Validation

```typescript
type StatusCode = 200 | 404 | 500;

const status: StatusCode = getStatusFromApi() as StatusCode;
// Runtime: pode retornar qualquer número
```

**Limitação:** Type assertion não valida em runtime.

## 🔗 Interconexões Conceituais

**Relação com Union Types:** Number literals usam union para múltiplos valores.

**Relação com Enums:** Alternativa zero-cost a numeric enums.

**Relação com Discriminated Unions:** Base para pattern matching numérico.

**Relação com Tuple Types:** Tuple length é number literal type.

**Relação com String Literals:** Mesmo conceito, tipo primitivo diferente.

## 🚀 Evolução e Próximos Conceitos

Dominar number literal types prepara para:
- **Boolean Literal Types:** `true` e `false` como tipos
- **Union de Literais:** Combinar diferentes literal types
- **Template Literal Types:** String manipulation com números
- **Branded Types:** Tipos nominais com number literals
- **Discriminated Unions:** Pattern matching type-safe
