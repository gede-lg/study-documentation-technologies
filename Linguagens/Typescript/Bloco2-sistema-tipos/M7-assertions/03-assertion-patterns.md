# Assertion Patterns e Best Practices

## 🎯 Introdução

**Assertion patterns** constituem um conjunto de **práticas arquiteturais consolidadas** para o uso efetivo de asserções em TypeScript, combinando type safety em compile-time com validação runtime para criar sistemas robustos e defensivos. Estes patterns evoluíram da necessidade prática de validar invariants (invariantes), enforçar contratos, e integrar código TypeScript com boundaries externos (APIs, user input, legacy JavaScript) de forma segura e manutenível, transformando assertions de simples verificações pontuais em componentes estruturais do design do software.

Os patterns abordados transcendem o uso básico de assertions individuais, focando em **composição**, **reusabilidade** e **integração sistemática** com o ecossistema TypeScript moderno. Incluem estratégias para eliminar assertions em production builds (zero runtime cost), criar hierarchies de error classes customizadas para assertion failures, integrar com schema validation libraries (zod, io-ts), implementar fluent assertion APIs, e estabelecer conventions para separar validação de lógica de negócio sem sacrificar type safety ou developer experience.

Dominar estes patterns permite construir **defensive boundaries** resilientes que detectam erros early, fornecem mensagens diagnósticas ricas, integram-se naturalmente com type system do TypeScript, e mantêm clareza arquitetural separando concerns de validação, tipo e lógica. O objetivo é transformar assertions de code smell potencial em ferramenta arquitetural legítima quando aplicadas nos contextos e patterns apropriados.

---

## 📋 Sumário

1. **Factory Pattern para Assertions**
   - Assertion builder functions
   - Reusable assertion libraries
   - Generic assertion factories

2. **Guard + Assert Pattern**
   - Type guard como predicate
   - Assert wrapper around guard
   - Dual-purpose validation

3. **Assertion Chaining**
   - Fluent assertion APIs
   - Composable validations
   - Builder pattern integration

4. **Error Context Enrichment**
   - Contextual error messages
   - Stack trace preservation
   - Debug information injection

5. **Development vs Production Assertions**
   - Conditional compilation
   - Dead code elimination
   - Performance optimization

6. **Schema Integration Pattern**
   - Zod/io-ts integration
   - Type inference from schemas
   - Runtime validation + type narrowing

7. **Branded Types com Assertions**
   - Type branding via assertions
   - Validated nominal types
   - Smart constructors

8. **Assertion Testing Patterns**
   - Testing assertion functions
   - Mocking assertion failures
   - Test coverage strategies

---

## 🧠 Fundamentos

### Factory Pattern para Assertions

Criar **funções factory** que geram assertions customizadas:

```typescript
// Factory genérico para criar assertions de tipo
function createTypeAssertion<T>(
  typeName: string,
  predicate: (value: unknown) => value is T
) {
  return function assert(value: unknown, context?: string): asserts value is T {
    if (!predicate(value)) {
      const message = context 
        ? `${context}: expected ${typeName}, got ${typeof value}`
        : `Expected ${typeName}, got ${typeof value}`;
      throw new TypeError(message);
    }
  };
}

// Criando assertions específicas
const assertString = createTypeAssertion<string>('string', (v): v is string => typeof v === 'string');
const assertNumber = createTypeAssertion<number>('number', (v): v is number => typeof v === 'number');

// Uso
const input: unknown = getUserInput();
assertString(input, 'User input'); // lança TypeError se não for string
console.log(input.toUpperCase()); // input é string aqui
```

**Biblioteca de assertions reusáveis**:

```typescript
// assertions.ts
export const Assert = {
  string: createTypeAssertion<string>('string', (v): v is string => typeof v === 'string'),
  number: createTypeAssertion<number>('number', (v): v is number => typeof v === 'number'),
  boolean: createTypeAssertion<boolean>('boolean', (v): v is boolean => typeof v === 'boolean'),
  
  defined: <T>(value: T | null | undefined, context?: string): asserts value is T => {
    if (value === null || value === undefined) {
      throw new Error(`${context ?? 'Value'} is null or undefined`);
    }
  },
  
  positive: (value: number, context?: string): asserts value is number => {
    if (value <= 0) {
      throw new RangeError(`${context ?? 'Value'} must be positive, got ${value}`);
    }
  },
  
  inRange: (value: number, min: number, max: number, context?: string): asserts value is number => {
    if (value < min || value > max) {
      throw new RangeError(`${context ?? 'Value'} must be in range [${min}, ${max}], got ${value}`);
    }
  }
};

// Uso em aplicação
const age: unknown = getAge();
Assert.number(age, 'Age');
Assert.positive(age, 'Age');
Assert.inRange(age, 0, 150, 'Age');
// age é number e garantidamente em [1, 150]
```

**Generic assertion factory**:

```typescript
function createAssert<T>(
  validator: (value: unknown) => { success: true } | { success: false; error: string }
) {
  return function assert(value: unknown): asserts value is T {
    const result = validator(value);
    if (!result.success) {
      throw new Error(result.error);
    }
  };
}

// Criando assertion para tipo customizado
interface User {
  id: number;
  name: string;
  email: string;
}

const assertUser = createAssert<User>((value) => {
  if (typeof value !== 'object' || value === null) {
    return { success: false, error: 'Value must be an object' };
  }
  
  const obj = value as Record<string, unknown>;
  
  if (typeof obj.id !== 'number') {
    return { success: false, error: 'id must be a number' };
  }
  
  if (typeof obj.name !== 'string') {
    return { success: false, error: 'name must be a string' };
  }
  
  if (typeof obj.email !== 'string' || !obj.email.includes('@')) {
    return { success: false, error: 'email must be a valid string' };
  }
  
  return { success: true };
});

// Uso
const data: unknown = await fetchUser();
assertUser(data); // valida estrutura completa
saveUser(data); // data é User aqui
```

### Guard + Assert Pattern

**Dual-purpose validation**: criar type guard e assertion a partir da mesma lógica:

```typescript
// Type guard base
function isUser(value: unknown): value is User {
  return typeof value === 'object' 
    && value !== null 
    && 'id' in value 
    && typeof (value as any).id === 'number'
    && 'name' in value
    && typeof (value as any).name === 'string';
}

// Assert wrapper em torno do guard
function assertUser(value: unknown): asserts value is User {
  if (!isUser(value)) {
    throw new TypeError('Invalid User object');
  }
}

// Uso flexível
const data: unknown = getData();

// Cenário 1: validação opcional (usa guard)
if (isUser(data)) {
  processUser(data);
} else {
  useDefaultUser();
}

// Cenário 2: precondition enforcement (usa assert)
assertUser(data); // se data não for User, erro
saveUser(data);
```

**Generic guard-to-assert converter**:

```typescript
function toAssertion<T>(
  guard: (value: unknown) => value is T,
  errorMessage: string = 'Assertion failed'
) {
  return function assert(value: unknown): asserts value is T {
    if (!guard(value)) {
      throw new Error(errorMessage);
    }
  };
}

// Criando assertions a partir de guards existentes
const assertString = toAssertion(
  (v): v is string => typeof v === 'string',
  'Expected string'
);

const assertArray = <T>(elementGuard: (v: unknown) => v is T) =>
  toAssertion(
    (v): v is T[] => Array.isArray(v) && v.every(elementGuard),
    'Expected array'
  );
```

### Assertion Chaining (Fluent API)

Criar **APIs fluentes** para validações compostas:

```typescript
class Validator<T> {
  constructor(private value: unknown, private context: string = 'Value') {}
  
  isDefined(): Validator<NonNullable<T>> {
    if (this.value === null || this.value === undefined) {
      throw new Error(`${this.context} is null or undefined`);
    }
    return this as any;
  }
  
  isString(): Validator<string> {
    if (typeof this.value !== 'string') {
      throw new TypeError(`${this.context} must be string, got ${typeof this.value}`);
    }
    return this as any;
  }
  
  isNumber(): Validator<number> {
    if (typeof this.value !== 'number') {
      throw new TypeError(`${this.context} must be number, got ${typeof this.value}`);
    }
    return this as any;
  }
  
  matches(regex: RegExp, message?: string): Validator<string> {
    this.isString();
    if (!regex.test(this.value as string)) {
      throw new Error(message ?? `${this.context} does not match pattern ${regex}`);
    }
    return this;
  }
  
  inRange(min: number, max: number): Validator<number> {
    this.isNumber();
    const num = this.value as number;
    if (num < min || num > max) {
      throw new RangeError(`${this.context} must be in range [${min}, ${max}], got ${num}`);
    }
    return this;
  }
  
  // Extrai valor validado
  get(): T {
    return this.value as T;
  }
}

// Factory function
function validate(value: unknown, context?: string): Validator<unknown> {
  return new Validator(value, context);
}

// Uso fluente
const email = validate(userInput, 'Email')
  .isDefined()
  .isString()
  .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format')
  .get(); // email: string (validado)

const age = validate(userData.age, 'Age')
  .isDefined()
  .isNumber()
  .inRange(0, 150)
  .get(); // age: number (validado e em range)
```

**Assertion pipeline**:

```typescript
type AssertPipeline<T> = (value: T) => void;

function pipe<T>(...assertions: AssertPipeline<T>[]) {
  return function assert(value: T): void {
    for (const assertion of assertions) {
      assertion(value);
    }
  };
}

// Combinando assertions
const assertValidAge = pipe<number>(
  (age) => Assert.number(age),
  (age) => Assert.positive(age),
  (age) => Assert.inRange(age, 0, 150)
);

// Uso
const userAge: unknown = getAge();
assertValidAge(userAge as number); // executa todas validações em sequência
```

### Error Context Enrichment

**Mensagens de erro ricas com contexto**:

```typescript
class AssertionError extends Error {
  constructor(
    message: string,
    public readonly context: {
      expected: string;
      received: unknown;
      path?: string;
      additionalInfo?: Record<string, unknown>;
    }
  ) {
    super(message);
    this.name = 'AssertionError';
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      context: this.context,
      stack: this.stack
    };
  }
}

function assertWithContext<T>(
  value: unknown,
  predicate: (v: unknown) => v is T,
  context: {
    expected: string;
    path?: string;
    additionalInfo?: Record<string, unknown>;
  }
): asserts value is T {
  if (!predicate(value)) {
    throw new AssertionError(
      `Assertion failed at ${context.path ?? 'unknown path'}`,
      {
        expected: context.expected,
        received: value,
        ...context
      }
    );
  }
}

// Uso
try {
  assertWithContext(
    userData.email,
    (v): v is string => typeof v === 'string' && v.includes('@'),
    {
      expected: 'valid email string',
      path: 'userData.email',
      additionalInfo: { userId: userData.id }
    }
  );
} catch (error) {
  if (error instanceof AssertionError) {
    console.error('Assertion failed:', error.toJSON());
    // {
    //   name: 'AssertionError',
    //   message: 'Assertion failed at userData.email',
    //   context: {
    //     expected: 'valid email string',
    //     received: 'invalid',
    //     path: 'userData.email',
    //     additionalInfo: { userId: 123 }
    //   },
    //   stack: '...'
    // }
  }
}
```

**Stack trace preservation**:

```typescript
class AssertionFailedError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'AssertionFailedError';
    
    // Preserva stack trace original
    if (cause && cause.stack) {
      this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
    }
  }
}

function assertOrWrap<T>(
  value: unknown,
  validator: (v: unknown) => v is T,
  message: string
): asserts value is T {
  try {
    if (!validator(value)) {
      throw new Error('Validation predicate returned false');
    }
  } catch (error) {
    throw new AssertionFailedError(message, error as Error);
  }
}
```

### Development vs Production Assertions

**Conditional compilation** para remover assertions em production:

```typescript
// config.ts
export const IS_DEV = process.env.NODE_ENV === 'development';

// assertions.ts
export function devAssert(condition: unknown, message?: string): asserts condition {
  if (IS_DEV && !condition) {
    throw new Error(message ?? 'Development assertion failed');
  }
}

export function prodAssert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message ?? 'Production assertion failed');
  }
}

// Uso
function processData(data: unknown) {
  prodAssert(data !== null, 'Data cannot be null'); // sempre executa
  devAssert(isValidStructure(data), 'Invalid data structure'); // apenas em dev
  
  // ...
}
```

**Dead code elimination com bundlers**:

```typescript
// assertions.ts
export const assert = process.env.NODE_ENV === 'development'
  ? (condition: unknown, message?: string): asserts condition => {
      if (!condition) throw new Error(message ?? 'Assertion failed');
    }
  : ((_condition: unknown, _message?: string): asserts _condition => {
      // noop em production, será removido por tree-shaking
    }) as (condition: unknown, message?: string) => asserts condition;

// Em production build (com webpack/rollup), código se torna:
// export const assert = (_condition, _message) => {};
// Chamadas para assert() são eliminadas pelo minifier
```

**Performance-conscious assertions**:

```typescript
function assertWithPerf<T>(
  value: unknown,
  predicate: (v: unknown) => v is T,
  message: string,
  options: { skipInProduction?: boolean } = {}
): asserts value is T {
  if (options.skipInProduction && process.env.NODE_ENV === 'production') {
    return; // skip assertion em production
  }
  
  if (!predicate(value)) {
    throw new Error(message);
  }
}

// Assertions caras apenas em dev
assertWithPerf(
  largeDataset,
  (v): v is Dataset => validateComplexDataset(v), // validação cara
  'Invalid dataset',
  { skipInProduction: true }
);
```

### Schema Integration Pattern

**Integração com Zod**:

```typescript
import { z } from 'zod';

// Schema define estrutura
const UserSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().min(0).max(150).optional()
});

type User = z.infer<typeof UserSchema>;

// Converter schema.parse em assertion
function createSchemaAssertion<T>(schema: z.ZodSchema<T>) {
  return function assert(value: unknown): asserts value is T {
    try {
      schema.parse(value); // lança ZodError se inválido
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Schema validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  };
}

const assertUser = createSchemaAssertion(UserSchema);

// Uso
const data: unknown = await fetchUser();
assertUser(data); // valida contra schema + type narrowing
// data é User aqui, com todas validações do schema aplicadas
saveUser(data);
```

**Integração com io-ts**:

```typescript
import * as t from 'io-ts';
import { isRight } from 'fp-ts/lib/Either';

const UserCodec = t.type({
  id: t.number,
  name: t.string,
  email: t.string
});

type User = t.TypeOf<typeof UserCodec>;

function assertCodec<T>(codec: t.Type<T>) {
  return function assert(value: unknown): asserts value is T {
    const result = codec.decode(value);
    if (!isRight(result)) {
      throw new Error('Codec validation failed');
    }
  };
}

const assertUser = assertCodec(UserCodec);

// Uso
const data: unknown = getData();
assertUser(data); // runtime validation + type narrowing
// data é User aqui
```

### Branded Types com Assertions

**Type branding via assertions** para criar nominal types:

```typescript
// Branded type definitions
type Brand<K, T> = K & { __brand: T };

type PositiveNumber = Brand<number, 'Positive'>;
type Email = Brand<string, 'Email'>;
type UserId = Brand<number, 'UserId'>;

// Smart constructors (assertion-based)
function assertPositive(value: number): asserts value is PositiveNumber {
  if (value <= 0) {
    throw new Error(`Value must be positive, got ${value}`);
  }
}

function assertEmail(value: string): asserts value is Email {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error(`Invalid email: ${value}`);
  }
}

function assertUserId(value: number): asserts value is UserId {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Invalid UserId: ${value}`);
  }
}

// Uso
function createUser(id: number, email: string): User {
  assertUserId(id); // id é UserId agora
  assertEmail(email); // email é Email agora
  
  return { id, email }; // type-safe com branded types
}

function chargeUser(userId: UserId, amount: PositiveNumber) {
  // userId e amount garantidamente válidos
}

const userId = 123;
const amount = 50;

assertUserId(userId);
assertPositive(amount);
chargeUser(userId, amount); // OK, types branded
```

**Opaque types pattern**:

```typescript
// Usando symbols para branding
const PositiveBrand = Symbol('Positive');
type Positive<T extends number> = T & { [PositiveBrand]: true };

function toPositive(value: number): Positive<number> {
  if (value <= 0) throw new Error('Must be positive');
  return value as Positive<number>;
}

function processPositive(n: Positive<number>) {
  // n garantidamente > 0
}

const num = toPositive(10); // Positive<number>
processPositive(num); // OK
processPositive(10); // ❌ Type error: number não é Positive<number>
```

---

## 🔍 Análise

### Trade-offs dos Patterns

**Factory Pattern**:
- ✅ Reusabilidade alta, código DRY
- ✅ Customização via parameters
- ❌ Verbosity na definição inicial
- ❌ Abstração pode obscurecer lógica

**Guard + Assert Pattern**:
- ✅ Dual-purpose (guard e assertion)
- ✅ Single source of truth para validação
- ❌ Precisa manter guard e assert sincronizados
- ❌ Overhead de abstração

**Fluent API**:
- ✅ Developer experience excelente
- ✅ Composição de validações clara
- ❌ Bundle size maior (classe com métodos)
- ❌ Complexidade de implementação

**Schema Integration**:
- ✅ Runtime validation + type safety
- ✅ Único schema para validação e tipos
- ❌ Dependência externa (zod, io-ts)
- ❌ Performance overhead de parsing

**Branded Types**:
- ✅ Nominal typing em structural type system
- ✅ Compile-time + runtime guarantees
- ❌ Complexidade conceitual
- ❌ Type casting necessário internamente

### Comparação de Approaches

| Pattern | Reusabilidade | Type Safety | Runtime Cost | Complexity |
|---------|--------------|-------------|--------------|------------|
| Factory | 🟢 Alta | 🟢 Alta | 🟡 Médio | 🟡 Médio |
| Guard+Assert | 🟢 Alta | 🟢 Alta | 🟡 Médio | 🟢 Baixo |
| Fluent API | 🟡 Média | 🟢 Alta | 🔴 Alto | 🔴 Alto |
| Schema | 🟢 Alta | 🟢 Muito Alta | 🔴 Alto | 🟡 Médio |
| Branded Types | 🟡 Média | 🟢 Muito Alta | 🟢 Baixo | 🔴 Alto |

---

## 🎯 Aplicabilidade

### Quando Usar Cada Pattern

**Factory Pattern**:
- ✅ Biblioteca de utilities compartilhada
- ✅ Muitas assertions similares
- ✅ Necessidade de customização

**Guard + Assert**:
- ✅ Mesma validação usada em contexts diferentes
- ✅ Migration gradual (guards primeiro, asserts depois)
- ✅ Testing (guards são fáceis de testar)

**Fluent API**:
- ✅ Validações complexas encadeadas
- ✅ Developer experience é prioridade
- ✅ Aplicações internas (bundle size não é crítico)

**Schema Integration**:
- ✅ Validação de APIs externas
- ✅ User input validation
- ✅ Configuration parsing
- ✅ Quando runtime validation é essencial

**Branded Types**:
- ✅ Domain primitives (UserId, Email, PositiveNumber)
- ✅ Quando quer evitar passing wrong types
- ✅ Finance/medical/critical domains
- ✅ Large codebases com many similar primitives

---

## ⚠️ Limitações

### Limitações Gerais

1. **Performance overhead**: todas validações adicionam custo runtime
2. **Bundle size**: libraries e patterns complexos aumentam tamanho
3. **Complexity**: patterns avançados têm learning curve
4. **Debugging**: stack traces podem ficar complexos com wrappers

### Workarounds

**Performance**:
```typescript
// Conditional compilation para remover em production
const assert = IS_PRODUCTION 
  ? (() => {}) as any  // noop
  : actualAssertImplementation;
```

**Bundle size**:
```typescript
// Tree-shaking friendly exports
export { assert } from './assertions/assert';
export { assertUser } from './assertions/user';
// Importar apenas o necessário
```

**Debugging**:
```typescript
// Error.captureStackTrace para limpar stack
class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, AssertionError);
  }
}
```

---

## 🔗 Interconexões

**M43-01 - Type Assertions**: patterns evitam necessidade de `as` casts
**M43-02 - Assert Functions**: patterns implementam assert functions
**M40 - Custom Error Classes**: errors customizados para assertions
**M42 - Result Type Pattern**: alternativa funcional a assertions
**Bloco 4 - Generics**: patterns usam generics extensivamente

---

## 🚀 Evolução

**Tendências**:
- **Effect systems**: integração com Effect/fp-ts para tracked assertions
- **Compile-time removal**: melhor dead code elimination
- **Schema evolution**: schemas como source of truth para types
- **AI-assisted**: tools gerando assertions automaticamente

**Recomendação 2025**:
- Usar **schema libraries** (zod) como foundation
- Aplicar **branded types** para domain primitives
- Implementar **conditional assertions** (dev vs prod)
- Adotar **fluent APIs** quando DX é prioridade
