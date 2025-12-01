# Boolean Literal Types

## 🎯 Introdução e Definição

### Definição Conceitual

**Boolean literal types** são tipos TypeScript que representam **valores booleanos exatos** - `true` ou `false` - ao invés de tipo genérico `boolean`. Diferentemente do tipo `boolean` que aceita ambos `true` e `false`, boolean literal type restringe variável a **exatamente um valor booleano específico**. Exemplo: `type IsEnabled = true` aceita apenas `true`, rejeitando `false`.

Conceitualmente, boolean literal types implementam **singleton boolean types** - tipos que contêm exatamente **um valor booleano**. Combinados com **union types**, criam tipo equivalente a `boolean` (`true | false`), mas permitem **discriminação explícita** e **type narrowing preciso** em discriminated unions.

**Fundamento teórico:** Boolean literal types derivam de **unit types** - tipos com **único habitante**. `type True = true` tem apenas um valor possível (`true`). Implementam **boolean algebra em type level** - operações lógicas podem ser expressas através de conditional types com boolean literals.

**Pattern básico:**
```typescript
// Boolean literal type - apenas true
type IsEnabled = true;

let enabled: IsEnabled;
enabled = true;   // ✓ OK
enabled = false;  // ✗ Error - apenas true é permitido
```

**Diferença fundamental:**
- **`boolean`:** Aceita `true` ou `false` (`true | false`)
- **Boolean literal:** Aceita apenas `true` OU apenas `false`

### Contexto Histórico e Evolução

**TypeScript 1.8 (2016):** Introdução de boolean literal types junto com string e number literals.

```typescript
// TypeScript 1.8 - boolean literal types
type IsTrue = true;
type IsFalse = false;

function requireTrue(value: true) {
  console.log("Value is true");
}

requireTrue(true);   // ✓ OK
// requireTrue(false);  // ✗ Error
```

**Motivação inicial:** Type narrowing preciso, discriminated unions, flags de configuração.

**TypeScript 2.0 (2016):** Discriminated unions com boolean literals.

```typescript
// TypeScript 2.0 - discriminated unions
type LoadingState = { isLoading: true };
type LoadedState = { isLoading: false; data: string };
type State = LoadingState | LoadedState;

function render(state: State) {
  if (state.isLoading) {
    console.log("Loading...");  // TypeScript sabe que é LoadingState
  } else {
    console.log(state.data);    // TypeScript sabe que é LoadedState
  }
}
```

**TypeScript 2.0 (2016):** `never` type permite exhaustiveness checking.

```typescript
// TypeScript 2.0 - exhaustiveness checking
type Flag = true | false;

function handleFlag(flag: Flag) {
  if (flag === true) {
    // Handle true
  } else if (flag === false) {
    // Handle false
  } else {
    const _exhaustive: never = flag;  // Garante todos os casos cobertos
  }
}
```

**TypeScript 3.7 (2019):** Optional chaining e nullish coalescing melhoram boolean logic.

```typescript
// TypeScript 3.7 - optional chaining
type Config = {
  feature?: {
    enabled: true | false;
  };
};

function isEnabled(config: Config): boolean {
  return config.feature?.enabled ?? false;
}
```

**TypeScript 4.0 (2020):** Control flow analysis melhorado.

```typescript
// TypeScript 4.0 - melhor control flow
function processFlag(flag: boolean) {
  if (flag === true) {
    // flag narrowed to true
  } else {
    // flag narrowed to false
  }
}
```

**TypeScript 4.4 (2021):** Control flow analysis para aliased conditions.

```typescript
// TypeScript 4.4 - aliased conditions
function process(flag: boolean) {
  const isTrue = flag === true;
  
  if (isTrue) {
    // flag narrowed to true (mesmo usando isTrue)
  }
}
```

**Antes vs Depois:**

**Pré-TypeScript 1.8 (sem boolean literal types):**
```typescript
// Apenas boolean genérico
function setEnabled(enabled: boolean) {
  // enabled pode ser true ou false
}

setEnabled(true);
setEnabled(false);
```

**Pós-TypeScript 1.8 (com boolean literal types):**
```typescript
// Type safety com boolean literal types
type IsEnabled = true;

function setEnabled(enabled: IsEnabled) {
  // enabled só pode ser true
}

setEnabled(true);   // ✓ OK
// setEnabled(false);  // ✗ Error
```

**Evolução de uso:**

**Era inicial (boolean genérico):**
```typescript
interface Config {
  debug: boolean;
}
```

**Era moderna (boolean literals em discriminated unions):**
```typescript
type DebugOn = { debug: true; level: number };
type DebugOff = { debug: false };
type Config = DebugOn | DebugOff;
```

**Era conditional types:**
```typescript
type If<Condition extends boolean, Then, Else> = 
  Condition extends true ? Then : Else;

type Result = If<true, "yes", "no">;  // "yes"
```

### Problema Fundamental que Resolve

Boolean literal types resolvem problemas de **discriminated unions**, **type narrowing preciso**, e **configuration flags**.

**Problema 1: Discriminated unions com boolean genérico**
```typescript
// Sem boolean literal types - type narrowing impreciso
type State = {
  isLoading: boolean;
  data?: string;
};

function render(state: State) {
  if (state.isLoading) {
    console.log("Loading...");
    // state.data pode estar presente (tipo não refina) ❌
  }
}
```

**Solução: Boolean literals permitem discriminação precisa**
```typescript
// Com boolean literal types - type narrowing preciso
type LoadingState = { isLoading: true };
type LoadedState = { isLoading: false; data: string };
type State = LoadingState | LoadedState;

function render(state: State) {
  if (state.isLoading) {
    console.log("Loading...");  // TypeScript sabe que é LoadingState
    // state.data NÃO existe ✅
  } else {
    console.log(state.data);    // TypeScript sabe que data existe ✅
  }
}
```

**Problema 2: Feature flags sem type safety**
```typescript
// Sem boolean literal types - flags arbitrários
interface FeatureFlags {
  newUI: boolean;
  betaFeatures: boolean;
}

function enableFeature(flags: FeatureFlags) {
  // Sem garantia de que newUI está habilitado
  if (flags.newUI) {
    // Lógica específica
  }
}
```

**Solução: Literal types garantem flags específicos**
```typescript
// Com boolean literal types - flags garantidos
type NewUIEnabled = { newUI: true; betaFeatures: boolean };
type NewUIDisabled = { newUI: false };
type FeatureFlags = NewUIEnabled | NewUIDisabled;

function enableFeature(flags: NewUIEnabled) {
  // Garantia de que newUI é true ✅
}
```

**Problema 3: Conditional logic sem type narrowing**
```typescript
// Sem boolean literal types - sem narrowing
interface Response {
  success: boolean;
  data?: any;
  error?: string;
}

function handleResponse(response: Response) {
  if (response.success) {
    console.log(response.data);  // data pode ser undefined ❌
  }
}
```

**Solução: Literal types permitem narrowing**
```typescript
// Com boolean literal types - narrowing preciso
type SuccessResponse = { success: true; data: any };
type ErrorResponse = { success: false; error: string };
type Response = SuccessResponse | ErrorResponse;

function handleResponse(response: Response) {
  if (response.success) {
    console.log(response.data);  // data garantido presente ✅
  } else {
    console.log(response.error);  // error garantido presente ✅
  }
}
```

**Problema 4: Type-level boolean logic**
```typescript
// Sem boolean literal types - sem type-level logic
type Feature = {
  enabled: boolean;
};

// Não há como fazer conditional types precisos
```

**Solução: Literal types permitem type-level logic**
```typescript
// Com boolean literal types - type-level logic
type If<B extends boolean, T, F> = B extends true ? T : F;

type Result1 = If<true, "yes", "no">;   // "yes"
type Result2 = If<false, "yes", "no">;  // "no"

type IsEnabled<T extends { enabled: boolean }> = 
  T["enabled"] extends true ? "ON" : "OFF";
```

**Fundamento teórico:** Boolean literal types permitem **boolean reasoning** em type system - type narrowing baseado em valores booleanos exatos.

### Importância no Ecossistema

Boolean literal types são importantes porque:

- **Type Narrowing:** Narrowing preciso em discriminated unions
- **Configuration Flags:** Type-safe feature flags
- **State Machines:** Modelar estados com boolean discriminators
- **Type-level Logic:** Conditional types com boolean literals
- **API Design:** APIs que requerem flags específicos
- **Exhaustiveness:** Garantir todos os casos booleanos cobertos
- **Documentation:** Tipo documenta valor booleano esperado
- **Compile-time Safety:** Detectar erros lógicos em compile-time

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Exact Boolean Values:** Tipo representa `true` ou `false` exato
2. **Union for Boolean:** `true | false` equivalente a `boolean`
3. **Discriminated Unions:** Base para discriminação booleana
4. **Type Narrowing:** Refine tipo baseado em valor booleano
5. **Type-level Logic:** Boolean algebra em type system

### Pilares Fundamentais

- **Literal Syntax:** `true` ou `false` como tipo
- **Union Literal:** `true | false` (equivalente a `boolean`)
- **Type Alias:** `type Name = true` para reutilização
- **Const Assertion:** `as const` para inferir literal type
- **Narrowing:** Type narrowing com boolean equality checks

### Visão Geral das Nuances

- **`boolean` vs `true | false`:** Tecnicamente equivalentes, mas discriminated unions usam literals
- **Truthiness:** Boolean literals são `true`/`false` exatos, não valores truthy/falsy
- **Control Flow:** TypeScript refina tipo baseado em boolean checks
- **Conditional Types:** Boolean literals em conditional types
- **Never Type:** Exhaustiveness checking com `never`

## 🧠 Fundamentos Teóricos

### Basic Boolean Literal Type

```typescript
// Boolean literal type básico

type IsTrue = true;
type IsFalse = false;

let flag1: IsTrue;
flag1 = true;   // ✓ OK
// flag1 = false;  // ✗ Error

let flag2: IsFalse;
flag2 = false;  // ✓ OK
// flag2 = true;   // ✗ Error
```

**Análise:** Tipos aceitam apenas valores booleanos exatos.

### Union of Boolean Literals

```typescript
// Union de boolean literals (equivalente a boolean)

type Boolean = true | false;  // Equivalente ao tipo boolean

function toggle(flag: Boolean): Boolean {
  return flag === true ? false : true;
}

toggle(true);   // false
toggle(false);  // true
```

**Union:** `true | false` é equivalente a `boolean`.

### Type Alias for Reusability

```typescript
// Type alias para reutilização

type IsEnabled = true;

interface Feature {
  name: string;
  enabled: IsEnabled;
}

const feature: Feature = {
  name: "Dark Mode",
  enabled: true  // Apenas true permitido
};
```

**Type Alias:** Reutilizar boolean literal types.

### Princípios e Conceitos Subjacentes

#### Discriminated Unions

```typescript
// Discriminated unions com boolean literal types

type LoadingState = {
  isLoading: true;
};

type LoadedState = {
  isLoading: false;
  data: string;
};

type ErrorState = {
  isLoading: false;
  error: string;
};

type State = LoadingState | LoadedState | ErrorState;

function render(state: State) {
  if (state.isLoading) {
    console.log("Loading...");  // TypeScript sabe que é LoadingState
  } else {
    // TypeScript sabe que é LoadedState | ErrorState
    if ("data" in state) {
      console.log(state.data);  // LoadedState
    } else {
      console.log(state.error);  // ErrorState
    }
  }
}
```

**Discriminated Union:** Boolean literal `isLoading` discrimina states.

#### Type Narrowing

```typescript
// Type narrowing com boolean literal types

type Response = 
  | { success: true; data: string }
  | { success: false; error: string };

function handleResponse(response: Response) {
  if (response.success === true) {
    console.log(response.data);   // TypeScript sabe que data existe
  } else {
    console.log(response.error);  // TypeScript sabe que error existe
  }
}
```

**Narrowing:** Equality checks com boolean literals refinam tipo.

### Const Assertion

```typescript
// Const assertion para boolean literal types

// Sem const assertion
const config1 = {
  debug: true  // type: boolean
};

// Com const assertion
const config2 = {
  debug: true  // type: true
} as const;

// config2.debug tem type true, não boolean
```

**As Const:** Inferir boolean literal type ao invés de `boolean`.

#### Function Return Types

```typescript
// Boolean literal types como return types

function isProduction(): false {
  return false;  // Sempre retorna false
}

function isDevelopment(): true {
  return true;  // Sempre retorna true
}

const prod = isProduction();  // type: false
const dev = isDevelopment();  // type: true
```

**Return Types:** Restringir valor booleano retornado.

### Control Flow Analysis

```typescript
// Control flow analysis com boolean literals

function process(flag: boolean) {
  if (flag === true) {
    // flag narrowed to true
    const x: true = flag;  // ✓ OK
  } else {
    // flag narrowed to false
    const y: false = flag;  // ✓ OK
  }
}
```

**Control Flow:** TypeScript refina tipo em cada branch.

#### Conditional Types

```typescript
// Conditional types com boolean literal types

type If<Condition extends boolean, Then, Else> = 
  Condition extends true ? Then : Else;

type Result1 = If<true, "yes", "no">;   // "yes"
type Result2 = If<false, "yes", "no">;  // "no"

// Boolean logic em type level
type And<A extends boolean, B extends boolean> = 
  A extends true 
    ? B extends true 
      ? true 
      : false 
    : false;

type Test1 = And<true, true>;    // true
type Test2 = And<true, false>;   // false
type Test3 = And<false, true>;   // false
type Test4 = And<false, false>;  // false
```

**Conditional Types:** Boolean logic em type level.

### Exhaustiveness Checking

```typescript
// Exhaustiveness checking com boolean literals

type Flag = true | false;

function handleFlag(flag: Flag): string {
  if (flag === true) {
    return "On";
  } else if (flag === false) {
    return "Off";
  } else {
    // Exhaustiveness check - flag é never aqui
    const _exhaustive: never = flag;
    return _exhaustive;  // Garante todos os casos cobertos
  }
}
```

**Exhaustiveness:** Garantir todos os valores booleanos cobertos.

#### Generic Constraints

```typescript
// Generic constraints com boolean literals

type EnabledFeature<T extends true> = {
  enabled: T;
  config: object;
};

// Apenas aceita true
const feature: EnabledFeature<true> = {
  enabled: true,
  config: {}
};

// const invalid: EnabledFeature<false> = { ... };  // ✗ Error
```

**Generics:** Boolean literal types em type parameters.

### Modelo Mental para Compreensão

Pense em boolean literal types como **interruptores específicos**:

**`boolean`:** Interruptor que pode estar ON ou OFF
**`true`:** Interruptor fixado em ON
**`false`:** Interruptor fixado em OFF

**Analogia - Porta:**

**`boolean`:** Porta pode estar aberta ou fechada
**`true`:** Porta sempre aberta
**`false`:** Porta sempre fechada

**Metáfora - Semáforo:**

**`boolean`:** Semáforo pode ser verde ou vermelho
**`true`:** Semáforo fixado em verde
**`false`:** Semáforo fixado em vermelho

**Fluxo de type checking:**
```
1. Desenvolvedor escreve valor booleano
2. TypeScript verifica se valor corresponde ao literal type
3. Se sim, aceita (compile-time ✓)
4. Se não, erro de compilação (compile-time ✗)
5. Runtime: valor é boolean normal
```

**Exemplo visual:**
```
type IsEnabled = true;

let enabled: IsEnabled;

enabled = true;   ✓ Valor correto
enabled = false;  ✗ Valor incorreto
```

## 🔍 Análise Conceitual Profunda

### Boolean Literals vs Boolean Type

```typescript
// boolean type (genérico)
function toggle(flag: boolean): boolean {
  return !flag;
}

toggle(true);   // boolean
toggle(false);  // boolean

// Boolean literal types (específico)
function alwaysTrue(): true {
  return true;
}

function alwaysFalse(): false {
  return false;
}

const t = alwaysTrue();   // type: true
const f = alwaysFalse();  // type: false

// Vantagens de boolean:
// - Genérico, aceita ambos os valores
// - Simplicidade

// Vantagens de boolean literals:
// - Type narrowing preciso
// - Discriminated unions
// - Type-level logic
```

**Comparison:** Boolean literals permitem discriminação precisa.

#### Truthiness vs Boolean Literals

```typescript
// Truthiness (runtime concept)
function isTruthy(value: any): boolean {
  return !!value;  // Converte para boolean
}

console.log(isTruthy(1));        // true (truthy)
console.log(isTruthy("hello"));  // true (truthy)
console.log(isTruthy(0));        // false (falsy)
console.log(isTruthy(""));       // false (falsy)

// Boolean literals (compile-time concept)
type IsTrue = true;
type IsFalse = false;

let flag: IsTrue = true;   // ✓ Apenas true exato
// let flag2: IsTrue = 1;  // ✗ Error - truthy não é true literal
```

**Distinction:** Boolean literals são `true`/`false` exatos, não truthy/falsy.

### State Machines

```typescript
// State machines com boolean literals

type LockedState = { isLocked: true };
type UnlockedState = { isLocked: false; key: string };
type DoorState = LockedState | UnlockedState;

function unlock(state: LockedState, key: string): UnlockedState {
  return { isLocked: false, key };
}

function lock(state: UnlockedState): LockedState {
  return { isLocked: true };
}

let door: DoorState = { isLocked: true };

if (!door.isLocked) {
  // TypeScript sabe que door é UnlockedState
  console.log(door.key);
}
```

**State Machines:** Boolean literals modelam estados mutuamente exclusivos.

#### Type-level Boolean Operations

```typescript
// Boolean operations em type level

type Not<B extends boolean> = B extends true ? false : true;
type And<A extends boolean, B extends boolean> = 
  A extends true ? (B extends true ? true : false) : false;
type Or<A extends boolean, B extends boolean> = 
  A extends true ? true : (B extends true ? true : false);
type Xor<A extends boolean, B extends boolean> = 
  A extends true 
    ? (B extends true ? false : true) 
    : (B extends true ? true : false);

type Test1 = Not<true>;           // false
type Test2 = And<true, true>;     // true
type Test3 = Or<false, true>;     // true
type Test4 = Xor<true, false>;    // true
type Test5 = Xor<true, true>;     // false
```

**Boolean Logic:** Implementar operações booleanas em type level.

### Optional Fields

```typescript
// Boolean literals com optional fields

type ConfigWithDebug = {
  debug: true;
  debugLevel: number;
};

type ConfigWithoutDebug = {
  debug: false;
  debugLevel?: never;  // debugLevel não deve existir
};

type Config = ConfigWithDebug | ConfigWithoutDebug;

function createConfig(debug: boolean): Config {
  if (debug) {
    return { debug: true, debugLevel: 2 };
  } else {
    return { debug: false };
  }
}
```

**Optional Fields:** Boolean literals controlam presença de fields.

#### Branded Types

```typescript
// Branded types com boolean literals

type Validated = { __validated: true };
type Unvalidated = { __validated: false };

type Data<V extends boolean> = {
  value: string;
  __validated: V;
};

function validate(data: Data<false>): Data<true> {
  // Validation logic
  return { ...data, __validated: true };
}

let unvalidated: Data<false> = { value: "test", __validated: false };
let validated = validate(unvalidated);
// validated tem type Data<true>
```

**Branded Types:** Boolean literals como brand.

### Mapped Types

```typescript
// Mapped types com boolean literals

type Flags = {
  feature1: boolean;
  feature2: boolean;
  feature3: boolean;
};

type EnableAllFlags<T> = {
  [K in keyof T]: true;
};

type AllEnabled = EnableAllFlags<Flags>;
// { feature1: true; feature2: true; feature3: true }
```

**Mapped Types:** Transformar boolean types em literals.

## 🎯 Aplicabilidade e Contextos

### Discriminated Unions

```typescript
type Result = 
  | { success: true; data: string }
  | { success: false; error: string };
```

**Raciocínio:** Discriminação type-safe de sucesso/erro.

### Feature Flags

```typescript
type FeatureEnabled = { enabled: true; config: object };
type FeatureDisabled = { enabled: false };
```

**Raciocínio:** Type-safe feature flags.

### State Management

```typescript
type LoadingState = { isLoading: true };
type LoadedState = { isLoading: false; data: any };
```

**Raciocínio:** Estados mutuamente exclusivos.

### Type-level Logic

```typescript
type If<B extends boolean, T, F> = B extends true ? T : F;
```

**Raciocínio:** Conditional types com boolean logic.

## ⚠️ Limitações e Considerações Teóricas

### Truthiness vs Boolean

```typescript
type IsTrue = true;

let flag: IsTrue = true;   // ✓ OK
// let flag2: IsTrue = 1;  // ✗ Error - truthy não é true literal
```

**Limitação:** Apenas `true`/`false` exatos, não valores truthy/falsy.

### Widening

```typescript
function getFlag() {
  return true;  // Return type widened to boolean
}

const flag: true = getFlag();  // ✗ Error
```

**Consideração:** Widening pode causar incompatibilidade.

### No Runtime Enforcement

```typescript
type IsEnabled = true;

const enabled: IsEnabled = getEnabledFromApi() as IsEnabled;
// Runtime: pode retornar false
```

**Limitação:** Type assertion não valida em runtime.

## 🔗 Interconexões Conceituais

**Relação com Union Types:** Boolean literals usam union (`true | false`).

**Relação com Discriminated Unions:** Base para discriminação booleana.

**Relação com Conditional Types:** Boolean literals em type-level logic.

**Relação com Control Flow:** Permitem type narrowing preciso.

**Relação com String/Number Literals:** Mesmo conceito, tipo diferente.

## 🚀 Evolução e Próximos Conceitos

Dominar boolean literal types prepara para:
- **Union de Literais:** Combinar diferentes literal types
- **Discriminated Unions:** Pattern matching type-safe
- **Conditional Types:** Type-level programming
- **Control Flow Analysis:** Type narrowing avançado
- **Type Guards:** User-defined type guards com boolean return
