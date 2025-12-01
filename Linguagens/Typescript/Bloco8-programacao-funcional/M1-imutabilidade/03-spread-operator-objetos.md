# Spread Operator para Cópia de Objetos

## 🎯 Introdução e Definição

### Definição Conceitual

**Spread operator** (`...`) para objetos é uma syntax que **expande** properties de um object em outro object, criando uma **shallow copy** (cópia superficial). O spread operator "espalha" enumerable own properties do source object para o target object, permitindo **clonar** objects, **merge** múltiplos objects, ou **override** properties específicas mantendo o resto inalterado.

Conceitualmente, spread operator implementa **copy-by-value** para properties - cada property é copiada individualmente do source para target. Para **primitivos** (number, string, boolean), cria cópia completa. Para **objetos/arrays aninhados**, cria **shallow copy** - copia a **referência**, não o conteúdo - objeto aninhado é compartilhado entre original e cópia.

**Fundamento teórico:** Spread operator cria **novo objeto** com properties copiadas - **não modifica** source object. É **immutable operation** - preserva original e retorna novo object. Pattern essencial em **functional programming** e **immutability patterns** - ao invés de modificar object existente, cria novo com alterações desejadas.

**Shallow copy vs deep copy**:
- **Shallow copy:** Copia properties de primeiro nível - objetos aninhados compartilham referência
- **Deep copy:** Copia recursivamente objetos aninhados - sem compartilhamento de referência

### Contexto Histórico e Evolução

**JavaScript ES5 (2009):** Sem spread operator - cópia via `Object.assign()` ou loop manual.

```javascript
// ES5 - Object.assign para cópia
var original = { x: 10, y: 20 };
var copy = Object.assign({}, original);

// ES5 - Loop manual
var copy2 = {};
for (var key in original) {
  copy2[key] = original[key];
}
```

**JavaScript ES6/ES2015 (Junho 2015):** Spread operator introduzido para **arrays**.

```javascript
// ES6 - spread para arrays
const arr = [1, 2, 3];
const copy = [...arr];  // ✅ Suportado
```

**JavaScript ES9/ES2018 (Junho 2018):** **Spread operator para objects**.

```javascript
// ES2018 - spread para objects
const obj = { x: 10, y: 20 };
const copy = { ...obj };  // ✅ Suportado
```

**Motivação para spread objects:**
- Syntax concisa para cópia de objects
- Immutability patterns mais fáceis
- Merge de objects simplificado
- React state updates imutáveis

**TypeScript 2.1 (Dezembro 2016):** **Suporte a object spread** - antes mesmo do ES2018.

**TypeScript 3.2 (Novembro 2018):** Melhorias em type inference com spread.

**TypeScript 4.1 (Novembro 2020):** **Mapped types** com spread - union types preservados.

**Evolução de práticas:**

**Era Pre-Spread (antes ES2018):**
```javascript
// Object.assign
const copy = Object.assign({}, original);

// Manual merge
const merged = Object.assign({}, obj1, obj2);
```

**Era Spread (ES2018+):**
```javascript
// Spread operator
const copy = { ...original };

// Spread merge
const merged = { ...obj1, ...obj2 };
```

**Era TypeScript Modern:**
```typescript
// Spread com types
const user: User = { id: 1, name: "Alice" };
const updated: User = { ...user, name: "Bob" };  // Type-safe
```

### Problema Fundamental que Resolve

Spread operator resolve o problema de **object mutation** e **verbose object copying**.

**Problema: Modificação direta de object (mutação)**
```typescript
// Mutação - modifica original
const user = { id: 1, name: "Alice", age: 30 };

function updateAge(user: User, newAge: number) {
  user.age = newAge;  // ⚠️ Mutação - modifica original
  return user;
}

const updated = updateAge(user, 31);
console.log(user);     // { id: 1, name: "Alice", age: 31 } - original modificado!
console.log(updated);  // { id: 1, name: "Alice", age: 31 } - mesma referência
```

**Solução: Spread operator - cópia imutável**
```typescript
// Immutable - preserva original
const user = { id: 1, name: "Alice", age: 30 };

function updateAge(user: User, newAge: number): User {
  return { ...user, age: newAge };  // ✅ Cópia - não modifica original
}

const updated = updateAge(user, 31);
console.log(user);     // { id: 1, name: "Alice", age: 30 } - original preservado
console.log(updated);  // { id: 1, name: "Alice", age: 31 } - novo object
```

**Problema: Verbose object copying**
```typescript
// Object.assign - verbose
const original = { x: 10, y: 20, z: 30 };
const copy = Object.assign({}, original);

// Merge múltiplos objects - verbose
const merged = Object.assign({}, obj1, obj2, obj3);
```

**Solução: Spread - syntax concisa**
```typescript
// Spread - conciso
const original = { x: 10, y: 20, z: 30 };
const copy = { ...original };

// Spread merge - conciso
const merged = { ...obj1, ...obj2, ...obj3 };
```

**Problema: Update parcial de object**
```typescript
// Sem spread - verbose
const user = { id: 1, name: "Alice", age: 30, city: "NYC" };

function updateName(user: User, newName: string): User {
  return {
    id: user.id,
    name: newName,      // Só isso muda
    age: user.age,
    city: user.city
  };  // ⚠️ Verbose - precisa copiar todas properties
}
```

**Solução: Spread - override específico**
```typescript
// Com spread - conciso
function updateName(user: User, newName: string): User {
  return { ...user, name: newName };  // ✅ Conciso - copia resto automaticamente
}
```

**Fundamento teórico:** Spread operator implementa **structural sharing** parcial - copia estrutura mas compartilha valores (shallow).

### Importância no Ecossistema

Spread operator é crucial porque:

- **Immutability:** Preserva original, cria novo object
- **Concise Syntax:** Mais legível que Object.assign
- **React Patterns:** State updates imutáveis
- **Redux:** Reducers imutáveis
- **Functional Programming:** Non-mutation patterns
- **Type Safety:** TypeScript preserva types
- **Merge Objects:** Combinar múltiplos objects facilmente
- **Override Properties:** Update parcial de objects

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Shallow Copy:** Copia properties de primeiro nível
2. **Immutable Operation:** Não modifica original
3. **Property Expansion:** "Espalha" properties do source
4. **Merge Capability:** Combina múltiplos objects
5. **Override Semantics:** Properties posteriores sobrescrevem

### Pilares Fundamentais

- **Non-Mutating:** Original preservado
- **New Object:** Sempre cria novo object
- **Enumerable Properties:** Copia apenas enumerable own properties
- **Shallow Behavior:** Objetos aninhados compartilham referência
- **Order Matters:** Properties posteriores sobrescrevem anteriores

### Visão Geral das Nuances

- **Object Spread:** `{ ...obj }`
- **Merge Objects:** `{ ...obj1, ...obj2 }`
- **Override Properties:** `{ ...obj, prop: newValue }`
- **Conditional Spread:** `{ ...obj, ...(condition && { prop: value }) }`
- **Nested Objects:** Shallow copy - referência compartilhada

## 🧠 Fundamentos Teóricos

### Basic Object Spread

```typescript
// Cópia simples com spread
const original = {
  id: 1,
  name: "Alice",
  age: 30
};

const copy = { ...original };

console.log(copy);  // { id: 1, name: "Alice", age: 30 }
console.log(copy === original);  // false - objetos diferentes
console.log(copy.id === original.id);  // true - values iguais
```

**Análise profunda:**

**O que spread faz:**
1. Cria **novo object** `{}`
2. Copia **cada property** de `original`
3. Retorna novo object com properties copiadas

**Resultado:**
- `copy` é **objeto diferente** de `original` (referências diferentes)
- Properties têm **valores iguais**
- Modificar `copy` **não afeta** `original`

**Fundamento teórico:** Spread cria **structural clone** - nova estrutura com mesmos valores.

### Override Properties with Spread

```typescript
// Override properties específicas
const user = {
  id: 1,
  name: "Alice",
  age: 30,
  city: "NYC"
};

// Override 'age' - resto permanece igual
const updated = { ...user, age: 31 };
console.log(updated);  // { id: 1, name: "Alice", age: 31, city: "NYC" }

// Override múltiplas properties
const updated2 = { ...user, age: 31, city: "LA" };
console.log(updated2);  // { id: 1, name: "Alice", age: 31, city: "LA" }

// Adicionar novas properties
const extended = { ...user, email: "alice@example.com" };
console.log(extended);  // { ..., email: "alice@example.com" }
```

**Conceito fundamental:** Properties **após** spread **sobrescrevem** properties do spread.

**Order matters:**
```typescript
const obj = { x: 1, y: 2 };

// Override depois de spread
const a = { ...obj, x: 10 };  // { x: 10, y: 2 } - x sobrescrito

// Spread depois de override - spread vence
const b = { x: 10, ...obj };  // { x: 1, y: 2 } - spread sobrescreve x
```

### Princípios e Conceitos Subjacentes

#### Merge Multiple Objects

```typescript
// Merge múltiplos objects
const defaults = { theme: "light", fontSize: 14 };
const userPrefs = { fontSize: 16, lineHeight: 1.5 };

const config = { ...defaults, ...userPrefs };
console.log(config);
// { theme: "light", fontSize: 16, lineHeight: 1.5 }

// userPrefs.fontSize sobrescreve defaults.fontSize
```

**Análise profunda:**

**Merge order:**
1. `defaults` properties copiadas: `{ theme: "light", fontSize: 14 }`
2. `userPrefs` properties copiadas: `fontSize: 16` sobrescreve, `lineHeight: 1.5` adiciona
3. Resultado: `{ theme: "light", fontSize: 16, lineHeight: 1.5 }`

**Fundamento teórico:** Spread permite **composição** de objects - pattern comum em configurações.

#### Shallow Copy Behavior

```typescript
// Shallow copy - objetos aninhados compartilham referência
const original = {
  id: 1,
  profile: {
    name: "Alice",
    age: 30
  }
};

const copy = { ...original };

// Modificar property de primeiro nível - não afeta original
copy.id = 2;
console.log(original.id);  // 1 - não afetado

// Modificar objeto aninhado - AFETA original!
copy.profile.name = "Bob";
console.log(original.profile.name);  // "Bob" - afetado!

// Por quê? profile é REFERÊNCIA compartilhada
console.log(copy.profile === original.profile);  // true - mesma referência
```

**Limitação crítica:** Spread é **shallow** - objetos aninhados são compartilhados.

**Solução - Deep copy manual:**
```typescript
const deepCopy = {
  ...original,
  profile: { ...original.profile }  // Spread aninhado
};

deepCopy.profile.name = "Charlie";
console.log(original.profile.name);  // "Alice" - não afetado
console.log(deepCopy.profile === original.profile);  // false - cópias diferentes
```

### Conditional Spread

```typescript
// Conditional spread - adiciona properties condicionalmente
const includeEmail = true;

const user = {
  id: 1,
  name: "Alice",
  ...(includeEmail && { email: "alice@example.com" })
};
console.log(user);
// { id: 1, name: "Alice", email: "alice@example.com" }

// Se false, property não é adicionada
const user2 = {
  id: 1,
  name: "Alice",
  ...(false && { email: "alice@example.com" })
};
console.log(user2);  // { id: 1, name: "Alice" } - email não incluído
```

**Conceito avançado:** `condition && { prop: value }` retorna object se true, `false` caso contrário - spread de `false` não adiciona nada.

### Modelo Mental para Compreensão

Pense em spread como **fotocopiar documento**:

**Original:** Documento original
**Spread:** Fazer fotocópia - novo documento, mesmo conteúdo

**Analogia - Receita:**

**Objeto original:** Receita base (bolo de chocolate)
**Spread:** Copiar receita e modificar ingrediente (adicionar nozes)
**Resultado:** Nova receita derivada, original preservado

**Metáfora - Construção:**

**Spread:** Pegar blueprint (original) → fazer cópia → modificar cópia
**Resultado:** Novo blueprint modificado, original intacto

**Fluxo:**
```
original = { x: 1, y: 2 }
  ↓
{ ...original }
  ↓
Cria novo: {}
Copia x: 1 → { x: 1 }
Copia y: 2 → { x: 1, y: 2 }
  ↓
Retorna novo object (referência diferente)
```

**Shallow copy visual:**
```
original = { a: 1, nested: { b: 2 } }
  ↓
copy = { ...original }
  ↓
copy.a → 1 (cópia do valor)
copy.nested → [referência ao mesmo { b: 2 }]
  ↓
original.nested === copy.nested → true (mesma referência)
```

## 🔍 Análise Conceitual Profunda

### Spread with Type Safety

```typescript
// TypeScript preserva types com spread
interface User {
  id: number;
  name: string;
  age: number;
}

const user: User = { id: 1, name: "Alice", age: 30 };

// Type-safe override
const updated: User = { ...user, age: 31 };  // ✅ Type: User

// Type error - property incorreta
const invalid: User = { ...user, email: "..." };  // ❌ Error: 'email' not in User

// Adicionar property - widening type
const extended = { ...user, email: "alice@example.com" };
// Type: User & { email: string }
```

**Análise profunda:** TypeScript **infere** tipo do spread - preserva type safety.

#### Spread with Intersection Types

```typescript
// Spread com intersection types
interface Identifiable {
  id: number;
}

interface Nameable {
  name: string;
}

const entity: Identifiable & Nameable = {
  id: 1,
  name: "Alice"
};

const copy = { ...entity };  // Type: Identifiable & Nameable
```

**Conceito:** Spread preserva **intersection types** - todas properties copiadas.

### Spread with Optional Properties

```typescript
// Optional properties com spread
interface User {
  id: number;
  name: string;
  email?: string;  // Optional
}

const user1: User = { id: 1, name: "Alice" };
const copy1 = { ...user1 };  // email não presente

const user2: User = { id: 2, name: "Bob", email: "bob@example.com" };
const copy2 = { ...user2 };  // email copiado

// Override opcional
const updated = { ...user1, email: "alice@example.com" };  // Adiciona email
```

**Fundamento teórico:** Spread copia **apenas properties presentes** - opcional ausente não é copiado.

#### Spread with Readonly Properties

```typescript
// Spread remove readonly
interface ReadonlyUser {
  readonly id: number;
  readonly name: string;
}

const user: ReadonlyUser = { id: 1, name: "Alice" };
user.id = 2;  // ❌ Error: readonly

const copy = { ...user };  // Type: { id: number; name: string } - sem readonly
copy.id = 2;  // ✅ OK - readonly não preservado
```

**Comportamento:** Spread **não preserva** `readonly` - cópia é mutável.

**Para preservar readonly:**
```typescript
const copy: ReadonlyUser = { ...user };  // Type annotation mantém readonly
copy.id = 2;  // ❌ Error: readonly
```

### Spread with Computed Properties

```typescript
// Spread com computed property names
const key = "name";

const user = { id: 1, [key]: "Alice" };  // { id: 1, name: "Alice" }

const updated = {
  ...user,
  [key]: "Bob"  // Override usando computed key
};
console.log(updated);  // { id: 1, name: "Bob" }
```

**Conceito:** Spread funciona com **computed property names** - keys dinâmicas.

#### Spread Order and Property Precedence

```typescript
// Order determina precedência
const obj1 = { x: 1, y: 2 };
const obj2 = { y: 3, z: 4 };

// obj2 vem depois - obj2.y sobrescreve obj1.y
const merged1 = { ...obj1, ...obj2 };
console.log(merged1);  // { x: 1, y: 3, z: 4 }

// obj1 vem depois - obj1.y sobrescreve obj2.y
const merged2 = { ...obj2, ...obj1 };
console.log(merged2);  // { x: 1, y: 2, z: 4 }

// Override explícito vence tudo
const merged3 = { ...obj1, ...obj2, y: 10 };
console.log(merged3);  // { x: 1, y: 10, z: 4 }
```

**Análise profunda:** **Último property vence** - properties posteriores sobrescrevem anteriores.

### Spread with Getters/Setters

```typescript
// Spread com getters - apenas VALUE é copiado
const original = {
  _value: 10,
  get value() {
    return this._value * 2;
  }
};

console.log(original.value);  // 20 (getter executado)

const copy = { ...original };
console.log(copy);  // { _value: 10, value: 20 } - value é property normal
console.log(copy.value);  // 20 - não é getter, apenas valor

// Getter NÃO é copiado, apenas resultado é copiado
```

**Limitação:** Spread copia **valor retornado** por getter, não o getter itself.

#### Spread with Symbols

```typescript
// Spread copia Symbol properties
const sym = Symbol("id");

const obj = {
  [sym]: 123,
  name: "Alice"
};

const copy = { ...obj };
console.log(copy[sym]);  // 123 - Symbol property copiado
console.log(copy.name);  // "Alice"
```

**Fundamento teórico:** Spread copia **Symbol properties** (own enumerable).

### Spread with Prototype

```typescript
// Spread NÃO copia prototype chain
class User {
  constructor(public name: string) {}
  
  greet() {
    return `Hello, ${this.name}`;
  }
}

const user = new User("Alice");
console.log(user.greet());  // "Hello, Alice"

const copy = { ...user };  // Apenas properties copiadas
console.log(copy.greet);  // undefined - method não copiado

// copy NÃO é instância de User
console.log(copy instanceof User);  // false
```

**Limitação:** Spread copia **own properties**, não prototype methods.

**Solução - preservar prototype:**
```typescript
const copy = Object.assign(Object.create(Object.getPrototypeOf(user)), user);
console.log(copy.greet());  // "Hello, Alice" - method preservado
```

#### Spread Performance Implications

```typescript
// Spread cria NOVO object - overhead de alocação
const original = { x: 1, y: 2, z: 3 };

// 1000 spreads = 1000 objects alocados
for (let i = 0; i < 1000; i++) {
  const copy = { ...original };  // Nova alocação a cada iteração
}

// Mutação - sem alocação (mas não immutable)
for (let i = 0; i < 1000; i++) {
  original.x = i;  // Mesma referência - sem alocação
}
```

**Consideração:** Spread tem **overhead** de criar novo object - usar com consciência em hot paths.

### Spread with Nested Objects - Deep Copy Pattern

```typescript
// Deep copy manual com spread aninhado
interface User {
  id: number;
  profile: {
    name: string;
    address: {
      city: string;
      country: string;
    };
  };
}

const user: User = {
  id: 1,
  profile: {
    name: "Alice",
    address: { city: "NYC", country: "USA" }
  }
};

// Deep copy manual
const deepCopy: User = {
  ...user,
  profile: {
    ...user.profile,
    address: {
      ...user.profile.address
    }
  }
};

deepCopy.profile.address.city = "LA";
console.log(user.profile.address.city);  // "NYC" - não afetado
```

**Pattern:** Spread **recursivamente** para deep copy - verbose mas explícito.

**Alternativa - JSON (com limitações):**
```typescript
const deepCopy2 = JSON.parse(JSON.stringify(user));
// ⚠️ Perde methods, Dates viram strings, undefined removido
```

#### Spread with Default Values

```typescript
// Pattern - defaults + overrides
function createUser(options: Partial<User> = {}): User {
  const defaults: User = {
    id: 0,
    name: "Guest",
    age: 0
  };
  
  return { ...defaults, ...options };
}

const user1 = createUser();  // { id: 0, name: "Guest", age: 0 }
const user2 = createUser({ name: "Alice" });  // { id: 0, name: "Alice", age: 0 }
const user3 = createUser({ name: "Bob", age: 30 });  // { id: 0, name: "Bob", age: 30 }
```

**Pattern comum:** Defaults via spread - valores padrões + overrides customizados.

### Spread with Generic Types

```typescript
// Generic function com spread
function update<T>(original: T, updates: Partial<T>): T {
  return { ...original, ...updates };
}

interface User {
  id: number;
  name: string;
  age: number;
}

const user: User = { id: 1, name: "Alice", age: 30 };
const updated = update(user, { age: 31 });  // Type: User
console.log(updated);  // { id: 1, name: "Alice", age: 31 }
```

**Conceito avançado:** Generics + spread = **type-safe update** function.

## 🎯 Aplicabilidade e Contextos

### React State Updates

```typescript
// React - immutable state updates
const [user, setUser] = useState({ id: 1, name: "Alice", age: 30 });

// Update state imutavelmente
setUser({ ...user, age: 31 });  // Novo object, não modifica anterior
```

**Raciocínio:** React depende de imutabilidade para detectar mudanças.

### Configuration Merging

```typescript
// Merge config defaults + user preferences
const defaults = { theme: "light", fontSize: 14, lineHeight: 1.5 };
const userPrefs = { fontSize: 16 };

const config = { ...defaults, ...userPrefs };
```

**Raciocínio:** Defaults + overrides - pattern comum em configs.

### Partial Object Updates

```typescript
// Update parcial - só properties necessárias
function updateUser(user: User, updates: Partial<User>): User {
  return { ...user, ...updates };
}

const updated = updateUser(user, { name: "Bob" });
```

**Raciocínio:** Spread permite update seletivo sem modificar original.

## ⚠️ Limitações e Considerações Teóricas

### Shallow Copy Only

```typescript
const obj = { a: 1, nested: { b: 2 } };
const copy = { ...obj };
copy.nested.b = 3;  // Modifica original também
```

**Limitação:** Spread não protege objetos aninhados.

### Performance Overhead

```typescript
// Criar novo object tem custo
for (let i = 0; i < 10000; i++) {
  const copy = { ...largeObject };  // Alocação a cada iteração
}
```

**Consideração:** Spread tem overhead - usar conscientemente.

### Loses Prototype

```typescript
const instance = new MyClass();
const copy = { ...instance };  // Perde prototype/methods
```

**Limitação:** Spread copia properties, não prototype chain.

## 🔗 Interconexões Conceituais

**Relação com Imutabilidade:** Spread é base para immutable updates.

**Relação com Object.assign:** Spread é syntax moderna para Object.assign.

**Relação com Const:** Combine const + spread para imutabilidade.

**Relação com Arrays:** Spread também funciona para arrays.

**Relação com Readonly:** Spread não preserva readonly.

## 🚀 Evolução e Próximos Conceitos

Dominar spread de objects prepara para:
- **Spread Operator para Arrays:** Cópia immutable de arrays
- **Não Modificar Originais:** Princípio de imutabilidade
- **Functional Programming:** Paradigma immutable
- **React Patterns:** State management immutable
