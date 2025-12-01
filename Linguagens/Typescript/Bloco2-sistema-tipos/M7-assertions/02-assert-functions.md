# Assert Functions (Funções de Asserção)

## 🎯 Introdução

**Assert functions** (funções de asserção) são funções especiais em TypeScript que **validam condições em runtime** e, quando bem-sucedidas, **refinam tipos** (type narrowing) para o restante do escopo. Diferentemente de type guards que retornam `boolean` indicando se uma condição é verdadeira, assert functions **lançam exceções** quando a condição falha, garantindo que o código subsequente só execute se a validação passar. Essa combinação de validação runtime + refinamento de tipo as torna ferramentas poderosas para **defensive programming** e **contract verification**.

A sintaxe `asserts condition` ou `asserts parameter is Type` informa ao TypeScript que, se a função retornar normalmente (sem lançar erro), determinada condição ou tipo está garantido. Isso permite criar **contratos explícitos** no código onde invariants (invariantes) são verificados e o type system ajustado de acordo, proporcionando tanto runtime safety quanto compile-time type correctness sem necessidade de type assertions manuais perigosas.

Assert functions são especialmente valiosas em **boundaries** (fronteiras) do sistema: validação de input de APIs externas, verificação de precondições de funções, validação de dados de configuração, e enforcement de business rules críticas onde falha deve resultar em erro imediato ao invés de comportamento indefinido silencioso. Compreender como criar e usar assert functions corretamente transforma código defensivo reativo em código proativo com garantias verificáveis.

---

## 📋 Sumário

1. **Assert Function Signatures**
   - `asserts condition` syntax
   - `asserts parameter is Type` syntax
   - Return type (void ou never)

2. **Assert Functions vs Type Guards**
   - Throwing vs returning boolean
   - Narrowing scope differences
   - Use case distinctions

3. **Built-in Assert Patterns**
   - Node.js `assert` module
   - Custom assertions
   - Assertion libraries

4. **Assertion-based Narrowing**
   - Control flow analysis
   - Unreachable code detection
   - Type refinement após assertion

5. **Precondition Assertions**
   - Parameter validation
   - Invariant checking
   - Contract enforcement

6. **Non-null/undefined Assertions**
   - Removing null/undefined via assertions
   - Comparison with `!` operator
   - Safe unwrapping patterns

7. **Error Handling Integration**
   - Custom error classes para assertions
   - Assertion failures em try-catch
   - Debugging assertion failures

---

## 🧠 Fundamentos

### Assert Function Signatures

TypeScript reconhece duas formas de assert function signatures:

**1. Asserts Condition** (valida expressão booleana):

```typescript
function assert(condition: unknown): asserts condition {
  if (!condition) {
    throw new Error('Assertion failed');
  }
}

// Uso
const value: string | null = getValue();
assert(value !== null); // se passar, value é string (não string | null)
console.log(value.toUpperCase()); // OK, TypeScript sabe que value não é null
```

A signature `asserts condition` indica que:
- Se a função retornar normalmente, `condition` é truthy
- TypeScript refina tipos baseado na condition verificada
- Se condition for falsy, função lança erro (não retorna)

**2. Asserts Parameter is Type** (valida tipo específico):

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new TypeError(`Expected string, got ${typeof value}`);
  }
}

// Uso
const input: unknown = getUserInput();
assertIsString(input); // se passar, input é string
console.log(input.toUpperCase()); // OK, TypeScript sabe que input é string
```

A signature `asserts value is Type` indica que:
- Se a função retornar, `value` é do tipo `Type`
- TypeScript aplica type narrowing após a chamada
- Similar a type guard (`value is Type`) mas lança erro ao invés de retornar false

**Return Type**:
- Assert functions normalmente retornam `void` (retornam undefined implicitamente)
- Podem retornar `never` se **sempre** lançam erro (útil para assertions que nunca devem passar)

### Assert Functions vs Type Guards

Comparação fundamental:

**Type Guard** (retorna boolean):
```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

const input: unknown = getData();
if (isString(input)) {
  console.log(input.toUpperCase()); // narrowed para string aqui
} else {
  // input ainda é unknown aqui
  console.log('Not a string');
}
```

**Assert Function** (lança exceção):
```typescript
function assertString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new TypeError('Expected string');
  }
}

const input: unknown = getData();
assertString(input); // se getData() não retornar string, erro é lançado
console.log(input.toUpperCase()); // input é string aqui (ou código não executa)
// Não há "else", execução para se assertion falha
```

**Diferenças críticas**:

| Aspecto | Type Guard | Assert Function |
|---------|-----------|----------------|
| **Return** | `boolean` | `void` (ou `never`) |
| **Failure handling** | Retorna `false` | Lança exceção |
| **Control flow** | Requer `if/else` | Linear (ou para execução) |
| **Use case** | Validação opcional | Precondition enforcement |
| **Escopo narrowing** | Dentro do `if` block | Todo escopo após chamada |

**Escolha entre eles**:
- **Type guard** quando falha é **esperada e tratável** (ex: input pode ou não ser string)
- **Assert function** quando falha é **excepcional e deve parar execução** (ex: precondition violada)

### Built-in Assert Patterns

**Node.js `assert` module**:

```typescript
import assert from 'assert';

function processUser(user: unknown) {
  // assert() do Node.js não tem type narrowing em TypeScript
  assert(user !== null); // runtime check, mas user ainda é unknown para TypeScript
  
  // Precisa de type guard adicional
  if (typeof user === 'object' && user !== null && 'name' in user) {
    console.log((user as any).name); // assertion manual necessária
  }
}
```

O `assert` do Node.js **não possui** signatures de narrowing do TypeScript, então não refina tipos automaticamente.

**Custom typed assert**:

```typescript
function assertDefined<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error('Value is null or undefined');
  }
}

const user: User | null = findUser(123);
assertDefined(user); // se passar, user é User (não User | null)
user.name; // OK
```

**Assertion libraries** (chai, vitest, jest):

```typescript
import { expect } from 'vitest';

// expect() não possui type narrowing
const value: unknown = getData();
expect(value).toBeDefined(); // runtime check, mas value ainda é unknown

// Necessário type guard ou assertion separada
if (typeof value === 'object' && value !== null) {
  // ...
}
```

Libraries de teste não integram com type narrowing porque foram projetadas antes dessa feature do TypeScript e focam em runtime assertions.

### Assertion-based Narrowing

TypeScript analisa **control flow** após assert functions:

```typescript
function assertIsNumber(value: unknown): asserts value is number {
  if (typeof value !== 'number') throw new TypeError('Not a number');
}

function processValue(input: string | number | boolean) {
  assertIsNumber(input); // se input for string ou boolean, exceção é lançada
  
  // Daqui em diante, TypeScript SABE que input é number
  const doubled = input * 2; // OK
  console.log(doubled.toFixed(2)); // OK, number methods disponíveis
  
  // Se chegou aqui, input passou na assertion
}
```

**Control flow analysis**:
1. TypeScript verifica signature `asserts input is number`
2. Reconhece que se função retorna, `input` é `number`
3. Se `input` não for `number`, exceção é lançada (código após não executa)
4. Logo, **todo código após assertion** pode assumir `input is number`

**Unreachable code detection**:

```typescript
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

type Shape = Circle | Square;

function getArea(shape: Shape): number {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius ** 2;
  } else if (shape.kind === 'square') {
    return shape.size ** 2;
  } else {
    assertNever(shape); // TypeScript verifica que shape é never aqui
  }
}
```

Se todos os casos foram tratados, `shape` torna-se `never` (tipo vazio) no `else`, e `assertNever(shape)` compila. Se adicionar novo tipo a `Shape` sem tratar, TypeScript erro em `assertNever(shape)` porque `shape` não seria `never`.

### Precondition Assertions

Assert functions são ideais para **enforcing preconditions**:

```typescript
function divide(a: number, b: number): number {
  assertNotZero(b); // precondition: divisor não pode ser zero
  return a / b;
}

function assertNotZero(value: number): asserts value is number {
  if (value === 0) {
    throw new Error('Value cannot be zero');
  }
}

// Uso
divide(10, 2); // OK
divide(10, 0); // 💥 Error: Value cannot be zero
```

**Invariant checking**:

```typescript
class BankAccount {
  private balance: number = 0;
  
  withdraw(amount: number): void {
    this.balance -= amount;
    this.assertValidBalance(); // invariant: balance não pode ser negativo
  }
  
  private assertValidBalance(): asserts this is this {
    if (this.balance < 0) {
      throw new Error('Invalid state: negative balance');
    }
  }
}
```

**Contract enforcement**:

```typescript
interface Config {
  apiUrl: string;
  timeout: number;
}

function assertValidConfig(config: unknown): asserts config is Config {
  if (typeof config !== 'object' || config === null) {
    throw new Error('Config must be an object');
  }
  
  if (!('apiUrl' in config) || typeof (config as any).apiUrl !== 'string') {
    throw new Error('Config must have apiUrl string');
  }
  
  if (!('timeout' in config) || typeof (config as any).timeout !== 'number') {
    throw new Error('Config must have timeout number');
  }
}

// Uso
const userConfig: unknown = JSON.parse(configFile);
assertValidConfig(userConfig); // valida e refina tipo
// userConfig agora é Config, não unknown
initializeApp(userConfig.apiUrl, userConfig.timeout); // type-safe
```

### Non-null/undefined Assertions

Assert functions para unwrap nullable types:

```typescript
function assertDefined<T>(value: T | null | undefined, name: string = 'Value'): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${name} is null or undefined`);
  }
}

function assertNotNull<T>(value: T | null, name: string = 'Value'): asserts value is T {
  if (value === null) {
    throw new Error(`${name} is null`);
  }
}

// Uso
const user: User | null = findUser(123);
assertNotNull(user, 'User'); // se user for null, lança erro
console.log(user.name); // OK, user é User (não User | null)
```

**Comparação com `!` operator**:

```typescript
const user = findUser(123);

// Opção 1: Non-null assertion operator (perigoso, sem runtime check)
console.log(user!.name); // compila, mas se user for null, TypeError em runtime

// Opção 2: Assert function (seguro, runtime check + type narrowing)
assertNotNull(user);
console.log(user.name); // compila e garante que user não é null
```

Assert function **combina** validação runtime com narrowing, enquanto `!` apenas remove tipos do compilador sem verificação.

**Safe unwrapping pattern**:

```typescript
function unwrap<T>(value: T | null | undefined, errorMessage?: string): T {
  assertDefined(value, errorMessage);
  return value; // TypeScript sabe que value é T aqui
}

// Uso
const config = unwrap(getConfig(), 'Configuration is required');
// config é Config (não Config | null | undefined)
```

---

## 🔍 Análise

### Trade-offs de Assert Functions

**Vantagens**:
- **Runtime safety**: validação real, não apenas compile-time assumption
- **Type narrowing automático**: elimina necessidade de type assertions manuais
- **Fail-fast**: erros detectados imediatamente onde ocorrem
- **Contract documentation**: assertions documentam preconditions/invariants explicitamente
- **Refactoring safety**: se tipos mudarem, assertions pegam incompatibilidades

**Desvantagens**:
- **Exception handling overhead**: assertions lançam exceções que precisam ser tratadas
- **Performance impact**: validações runtime adicionam custo (mitigável com build-time removal)
- **Verbosity**: requer definição de funções de assertion customizadas
- **Learning curve**: desenvolvedores precisam entender quando usar vs type guards
- **Error recovery**: interrompe fluxo, dificulta recuperação graciosa

### Comparação: Assert vs Guard vs Assertion Operator

| Aspecto | Assert Function | Type Guard | `!` Operator |
|---------|----------------|-----------|--------------|
| **Runtime check** | ✅ Sim | ✅ Sim | ❌ Não |
| **Type narrowing** | ✅ Sim | ✅ Sim | ✅ Sim |
| **Failure mode** | 💥 Exception | ↩️ Return false | 🔥 Runtime TypeError |
| **Escopo** | Após chamada | Dentro do `if` | Expressão |
| **Segurança** | 🟢 Alta | 🟢 Alta | 🔴 Baixa |
| **Use case** | Preconditions | Conditional logic | ⚠️ Último recurso |

**Quando usar cada um**:

```typescript
// ✅ Type guard: validação esperada, fluxo continua
function processInput(input: unknown) {
  if (isString(input)) {
    console.log(input.toUpperCase());
  } else {
    console.log('Invalid input, using default');
  }
}

// ✅ Assert function: precondition crítica, falha deve parar
function processUser(user: unknown) {
  assertIsUser(user); // se não for User, sistema está em estado inválido
  saveToDatabase(user);
}

// ❌ ! operator: evitar, usar apenas quando absolutamente certo
function getUsername(user: User | null) {
  return user!.name; // perigoso! se user for null, TypeError
}
```

### Patterns de Assert Functions

**1. Parameterized assertions**:

```typescript
function assertInRange(value: number, min: number, max: number): asserts value is number {
  if (value < min || value > max) {
    throw new RangeError(`Value ${value} is not in range [${min}, ${max}]`);
  }
}

// Uso
const age = getUserAge();
assertInRange(age, 0, 150); // garante age está em range válido
```

**2. Composite assertions**:

```typescript
function assertValidEmail(email: unknown): asserts email is string {
  assertIsString(email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email format');
  }
}
```

**3. Type brand assertions**:

```typescript
type PositiveNumber = number & { __brand: 'Positive' };

function assertPositive(value: number): asserts value is PositiveNumber {
  if (value <= 0) {
    throw new Error('Number must be positive');
  }
}

function processPositive(n: PositiveNumber) {
  // n garantido ser > 0
}

const num = 5;
assertPositive(num);
processPositive(num); // OK, num é PositiveNumber
```

---

## 🎯 Aplicabilidade

### Quando Usar Assert Functions

✅ **Casos legítimos**:

1. **API boundary validation**:
```typescript
function handleAPIResponse(response: unknown) {
  assertValidResponse(response); // valida estrutura da resposta
  processResponse(response); // response é ResponseType aqui
}
```

2. **Precondition enforcement**:
```typescript
function calculateDiscount(price: number, percentage: number): number {
  assertPositive(price);
  assertInRange(percentage, 0, 100);
  return price * (percentage / 100);
}
```

3. **Invariant checking**:
```typescript
class Stack<T> {
  private items: T[] = [];
  
  pop(): T {
    this.assertNotEmpty(); // invariant: não pode pop de stack vazio
    return this.items.pop()!;
  }
  
  private assertNotEmpty(): asserts this is this {
    if (this.items.length === 0) {
      throw new Error('Cannot pop from empty stack');
    }
  }
}
```

4. **Configuration validation**:
```typescript
const config: unknown = loadConfig();
assertValidConfig(config); // valida todas propriedades necessárias
const app = new App(config); // config é Config, não unknown
```

### Quando NÃO Usar Assert Functions

❌ **Anti-patterns**:

1. **Validação esperada** (use type guards):
```typescript
// ❌ Assertion para fluxo esperado
function greetUser(input: unknown) {
  try {
    assertIsString(input);
    console.log(`Hello, ${input}`);
  } catch {
    console.log('Hello, stranger');
  }
}

// ✅ Type guard mais apropriado
function greetUser(input: unknown) {
  if (typeof input === 'string') {
    console.log(`Hello, ${input}`);
  } else {
    console.log('Hello, stranger');
  }
}
```

2. **Performance-critical paths**:
```typescript
// ❌ Assertion em hot loop
function processArray(items: unknown[]) {
  for (const item of items) {
    assertIsNumber(item); // overhead em cada iteração
    // ...
  }
}

// ✅ Validar upfront ou usar type guard
function processArray(items: unknown[]) {
  if (!items.every(isNumber)) {
    throw new Error('All items must be numbers');
  }
  // items inferido como number[] via type guard result
  for (const item of items) {
    // ...
  }
}
```

3. **Substituir error handling adequado**:
```typescript
// ❌ Assertion escondendo fluxo de erro
function saveUser(user: User) {
  try {
    assertValidUser(user);
    db.save(user);
  } catch {
    // silenciando erro
  }
}

// ✅ Error handling explícito
function saveUser(user: User): Result<void, ValidationError> {
  const validation = validateUser(user);
  if (!validation.success) {
    return Err(validation.error);
  }
  db.save(user);
  return Ok(undefined);
}
```

---

## ⚠️ Limitações

### Limitações Técnicas

1. **Sem narrowing em callbacks**:
```typescript
function processItems(items: (string | number)[]) {
  assertAllStrings(items); // items é string[] aqui
  
  items.forEach(item => {
    console.log(item.toUpperCase()); // ❌ ERRO: item ainda é string | number
  });
}
```

TypeScript não propaga narrowing para dentro de callbacks. **Workaround**:

```typescript
function processItems(items: (string | number)[]) {
  const strings = items.filter(isString); // type guard retorna string[]
  strings.forEach(item => {
    console.log(item.toUpperCase()); // OK
  });
}
```

2. **Assertion não adiciona propriedades**:
```typescript
interface Extended { extra: string; }
function assertExtended(value: object): asserts value is Extended {
  if (!('extra' in value)) {
    throw new Error('Missing extra property');
  }
}

const obj = { name: 'test' };
assertExtended(obj); // compila, mas obj não tem 'extra' em runtime
console.log(obj.extra); // undefined (não houve adição real de propriedade)
```

3. **Generics complexos**:
```typescript
function assertIsArray<T>(value: unknown): asserts value is T[] {
  if (!Array.isArray(value)) {
    throw new Error('Not an array');
  }
  // Não valida que elementos são realmente tipo T!
}

const data: unknown = [1, 2, "three"];
assertIsArray<number>(data); // passa, mas data contém string
// TypeScript assume data é number[], mas runtime tem string
```

### Problemas Conhecidos

1. **Assertion failures interrompem execução**:
```typescript
function processBatch(items: unknown[]) {
  items.forEach(item => {
    assertIsUser(item); // se 1 item falhar, batch inteiro para
    saveUser(item);
  });
}
```

**Workaround**:
```typescript
function processBatch(items: unknown[]) {
  const results = items.map(item => {
    if (!isUser(item)) return { success: false, error: 'Invalid user' };
    try {
      saveUser(item);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  });
  return results;
}
```

2. **Custom error messages limitados**:
```typescript
function assertPositive(n: number): asserts n is number {
  if (n <= 0) throw new Error('Must be positive'); // mensagem fixa
}

// Difícil contextualizar: "Age must be positive" vs "Price must be positive"
```

**Workaround**:
```typescript
function assertPositive(n: number, context: string = 'Value'): asserts n is number {
  if (n <= 0) throw new Error(`${context} must be positive`);
}

assertPositive(age, 'Age');
assertPositive(price, 'Price');
```

---

## 🔗 Interconexões

### Relação com Outros Módulos

**Bloco 7 - Tratamento de Erros**:
- **M38 - Try-Catch-Finally**: assertions lançam exceções capturáveis
- **M40 - Custom Error Classes**: assertions podem lançar erros customizados tipados
- **M42 - Result Type Pattern**: alternativa a assertions para error handling funcional

**Bloco 3 - Tipos Avançados**:
- **M19 - Type Guards**: função irmã de assertions, retorna boolean ao invés de throw
- **M20 - Discriminated Unions**: assertions úteis para validar discriminants

**Bloco 2 - Sistema de Tipos**:
- **M13 - Union Types**: assertions para narrowing de unions
- **M14 - Literal Types**: assertions podem refinar para literal types específicos

**Bloco 4 - Generics**:
- **M21 - Generic Functions**: assertions genéricas `assertIsArray<T>`

### Dependências

**Pré-requisitos**:
- Control flow analysis
- Type narrowing concepts
- Exception handling (try-catch)
- Type guards (`is` predicates)

**Constrói Base Para**:
- Defensive programming patterns
- API validation
- Contract-based design
- Runtime type safety

---

## 🚀 Evolução

### Histórico no TypeScript

**TypeScript 3.7 (2019)**:
- **Assertion signatures introduzidas** (`asserts condition`, `asserts param is Type`)
- Primeira integração de assertion-based narrowing no compilador
- Motivação: eliminar necessidade de type assertions após validações runtime

**TypeScript 4.0 (2020)**:
- Melhorias em control flow analysis para assertions
- Suporte a labeled tuples aumenta precisão de assertions em tuples

**TypeScript 4.4 (2021)**:
- Control flow analysis de aliased conditions melhorada
- Assertions funcionam melhor com destructuring

**TypeScript 4.7 (2022)**:
- Instantiation expressions permitem assertions genéricas mais expressivas

### Tendências Futuras

**Runtime validation integration**:
- Propostas para integrar schemas runtime (zod, io-ts) com type system
- Assertions automáticas geradas a partir de types
- Performance optimizations para assertion removal em production builds

**Tooling improvements**:
- ESLint rules detectando assertions redundantes ou perigosas
- IDEs sugerindo conversão de type guards em assertions (e vice-versa)
- Debugging tools mostrando assertion failures com contexto de tipo

**Pattern evolution**:
- Assertions combinadas com discriminated unions para exhaustiveness checking
- Integration com Effect Systems para tracking de assertions em type signatures
- Branded types automation via assertion functions

### Alternativas Modernas (2025)

**1. Schema validation libraries**:
```typescript
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string(),
  age: z.number().positive()
});

// .parse() age como assertion function (lança ZodError se inválido)
const user = UserSchema.parse(unknownData); // Type: { name: string; age: number }
```

**2. Effect-based validation**:
```typescript
import { Effect } from 'effect';

const validateUser = (data: unknown) =>
  Effect.try(() => UserSchema.parse(data));

// Effect<User, ZodError, never>
```

**3. Contract libraries** (ts-pattern, io-ts):
```typescript
import { match } from 'ts-pattern';

const result = match(value)
  .with({ type: 'user' }, (v) => processUser(v))
  .with({ type: 'admin' }, (v) => processAdmin(v))
  .exhaustive(); // compile error se não cobrir todos os casos
```

**Recomendação Atual (2025)**:
- **Usar** assert functions para preconditions críticas
- **Combinar** com schema validation (zod) para dados externos
- **Preferir** type guards quando falha é esperada e tratável
- **Adotar** libraries modernas (zod, effect) para validação complexa
- **Evitar** `!` operator, usar assertions explícitas
