# strict mode e Opções: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**`strict`** é **flag mestra** do TypeScript que habilita conjunto completo de verificações de tipo estritas, ativando simultaneamente múltiplas opções individuais que aumentam segurança de tipos. **Opções complementares** como `skipLibCheck` e `esModuleInterop` controlam aspectos específicos de performance e interoperabilidade. Conceitualmente, strict mode materializa o princípio de **type safety by default**, onde você opta por verificação máxima de tipos em vez de permissividade.

Na essência, strict mode representa **fail-fast philosophy**, preferindo erros em tempo de compilação (que você pode corrigir) a erros silenciosos em runtime (que causam bugs). É fundamental para aproveitar todo o poder do sistema de tipos TypeScript.

## 📋 Fundamentos

### strict - Flag Mestra

```json
{
  "compilerOptions": {
    "strict": true  // Habilita TODAS as flags strict
  }
}
```

**Equivalente a:**
```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "useUnknownInCatchVariables": true
  }
}
```

**Conceito-chave:** `strict: true` é **composição de flags**, novas versões do TypeScript podem adicionar novas verificações ao conjunto.

### Por Que Strict Mode?

```typescript
// Sem strict mode
function getUser(id) {  // id: any (implícito)
  return users.find(u => u.id === id);  // retorna User | undefined
}

const user = getUser(123);
console.log(user.name);  // ❌ Runtime error se user for undefined

// Com strict mode
function getUser(id: number): User | undefined {  // Tipos explícitos
  return users.find(u => u.id === id);
}

const user = getUser(123);
console.log(user.name);  // ❌ Erro de compilação: Object is possibly 'undefined'

// ✅ Solução: verificação explícita
if (user) {
  console.log(user.name);  // OK
}
```

## 🔍 Análise Conceitual

### 1. noImplicitAny

```typescript
// noImplicitAny: false (permissivo)
function process(data) {  // data: any (implícito) - perigoso
  return data.toUpperCase();  // Sem verificação de tipo
}

// noImplicitAny: true (estrito)
function process(data) {  // ❌ Erro: Parameter 'data' implicitly has 'any' type
  return data.toUpperCase();
}

// ✅ Solução: tipo explícito
function process(data: string): string {
  return data.toUpperCase();
}
```

**Conceito:** Proíbe **any implícito**, forçando você a declarar tipos explicitamente ou deixar TypeScript inferir.

**Exceções permitidas:**
```typescript
// ✅ OK: any explícito (você decidiu)
function process(data: any) {
  return data.toUpperCase();
}

// ✅ OK: inferência funciona
function sum(a: number, b: number) {
  const result = a + b;  // result: number (inferido)
  return result;
}
```

### 2. strictNullChecks

```typescript
// strictNullChecks: false (perigoso)
let name: string = "João";
name = null;  // ✅ Permitido (não deveria)

function getUser(id: number): User {
  return users.find(u => u.id === id);  // ✅ Compila mas retorna undefined
}

// strictNullChecks: true (seguro)
let name: string = "João";
name = null;  // ❌ Erro: Type 'null' is not assignable to type 'string'

// ✅ Union type explícito
let name: string | null = "João";
name = null;  // OK

function getUser(id: number): User | undefined {  // ✅ Tipo correto
  return users.find(u => u.id === id);
}

const user = getUser(123);
console.log(user.name);  // ❌ Erro: Object is possibly 'undefined'

// ✅ Type narrowing
if (user) {
  console.log(user.name);  // OK: user é User aqui
}
```

**Conceito:** Torna `null` e `undefined` **tipos separados**, não atribuíveis a outros tipos automaticamente. Previne **bilhões** de null reference errors.

**Impacto:**
```typescript
// Antes (strictNullChecks: false)
interface User {
  name: string;
  email: string;
}

// Depois (strictNullChecks: true)
interface User {
  name: string;
  email: string | null;  // email pode ser null
}

// Força handling explícito
function sendEmail(user: User) {
  if (user.email) {
    mailer.send(user.email);  // user.email: string aqui
  }
}
```

### 3. strictFunctionTypes

```typescript
// strictFunctionTypes: false
type EventHandler = (e: MouseEvent) => void;

const handler: EventHandler = (e: Event) => {  // ✅ Permitido (covariância)
  console.log(e);
};

// strictFunctionTypes: true
type EventHandler = (e: MouseEvent) => void;

const handler: EventHandler = (e: Event) => {  // ❌ Erro
  console.log(e);
};

// ✅ Tipo correto
const handler: EventHandler = (e: MouseEvent) => {
  console.log(e.clientX);
};
```

**Conceito:** Habilita **verificação contravariante** para tipos de função, garantindo type safety em callbacks.

**Exceção - métodos:**
```typescript
// Métodos são sempre bivariantes (não afetados)
interface Animal {
  move(distance: number): void;
}

interface Dog extends Animal {
  move(distance: number | string): void;  // ✅ OK (métodos são bivariantes)
}
```

### 4. strictBindCallApply

```typescript
// strictBindCallApply: false
function greet(name: string, age: number) {
  console.log(`${name} has ${age} years`);
}

greet.call(null, "João", "30");  // ✅ Compila mas "30" é string

// strictBindCallApply: true
greet.call(null, "João", "30");  // ❌ Erro: Argument of type 'string' is not assignable to parameter of type 'number'

// ✅ Tipos corretos
greet.call(null, "João", 30);  // OK
greet.apply(null, ["João", 30]);  // OK
greet.bind(null, "João")(30);  // OK
```

**Conceito:** Verifica tipos de argumentos em **call, apply, bind**.

### 5. strictPropertyInitialization

```typescript
// strictPropertyInitialization: false
class User {
  name: string;  // ✅ Não inicializada (perigoso)

  constructor() {
    // Esqueceu de inicializar name
  }
}

const user = new User();
console.log(user.name.toUpperCase());  // ❌ Runtime error: undefined

// strictPropertyInitialization: true
class User {
  name: string;  // ❌ Erro: Property 'name' has no initializer

  constructor() {}
}

// ✅ Soluções:

// 1. Inicializar no constructor
class User {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

// 2. Valor padrão
class User {
  name: string = "Anonymous";
}

// 3. Definite assignment assertion (!) - use com cuidado
class User {
  name!: string;  // "Eu garanto que será inicializada"

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.name = "João";
  }
}

// 4. Tornar opcional
class User {
  name?: string;
}
```

**Conceito:** Garante que propriedades de classe sejam **inicializadas** no constructor ou com valor padrão.

### 6. noImplicitThis

```typescript
// noImplicitThis: false
const obj = {
  name: "João",
  greet() {
    setTimeout(function() {
      console.log(this.name);  // ✅ Compila mas 'this' é 'any'
    }, 1000);
  }
};

// noImplicitThis: true
const obj = {
  name: "João",
  greet() {
    setTimeout(function() {
      console.log(this.name);  // ❌ Erro: 'this' implicitly has type 'any'
    }, 1000);
  }
};

// ✅ Soluções:

// 1. Arrow function (preserva this)
const obj = {
  name: "João",
  greet() {
    setTimeout(() => {
      console.log(this.name);  // OK: this é obj
    }, 1000);
  }
};

// 2. Parâmetro this explícito
interface Context {
  name: string;
}

const obj = {
  name: "João",
  greet() {
    setTimeout(function(this: Context) {
      console.log(this.name);
    }.bind(this), 1000);
  }
};
```

**Conceito:** Proíbe `this` implícito com tipo `any`, forçando contexto explícito.

### 7. alwaysStrict

```typescript
// alwaysStrict: true
// Output JavaScript sempre inclui "use strict";
```

**Output:**
```javascript
"use strict";

function greet(name) {
  console.log("Hello " + name);
}
```

**Conceito:** Emite **"use strict"** em todos arquivos JavaScript gerados, habilitando strict mode do ECMAScript.

**Benefícios do "use strict":**
- Previne variáveis globais acidentais
- Lança erros em assignments silenciosos
- Proíbe sintaxe problemática

### 8. useUnknownInCatchVariables

```typescript
// useUnknownInCatchVariables: false (padrão até TS 4.3)
try {
  throw new Error("Ops");
} catch (error) {
  console.log(error.message);  // error: any
}

// useUnknownInCatchVariables: true (TS 4.4+)
try {
  throw new Error("Ops");
} catch (error) {  // error: unknown
  console.log(error.message);  // ❌ Erro: Object is of type 'unknown'
}

// ✅ Type narrowing
try {
  throw new Error("Ops");
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);  // OK: error é Error
  } else {
    console.log(String(error));
  }
}
```

**Conceito:** Variáveis de catch são `unknown` em vez de `any`, forçando **type narrowing** antes de usar.

## 🎯 Opções Complementares

### skipLibCheck

```json
{
  "compilerOptions": {
    "skipLibCheck": true  // Não verifica tipos em .d.ts de node_modules
  }
}
```

**O que faz:**
- Pula verificação de tipos em **arquivos .d.ts**
- node_modules/@types/* não são verificados
- Seu código continua sendo verificado normalmente

**Benefícios:**
- **Compilação ~2-3x mais rápida**
- Evita erros em definições de tipos de terceiros
- Reduz uso de memória

**Quando usar:**
- ✅ **Sempre** em projetos reais
- ❌ Apenas se estiver criando .d.ts você mesmo

**Exemplo:**
```bash
# Sem skipLibCheck
$ tsc
# Compila em 15s, verifica 500+ arquivos .d.ts

# Com skipLibCheck
$ tsc
# Compila em 5s, verifica apenas seu código
```

### esModuleInterop

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true  // Habilitado automaticamente
  }
}
```

**Problema sem esModuleInterop:**
```typescript
// CommonJS module: module.exports = Express
import Express from "express";  // ❌ Erro: Module has no default export

// ✅ Workaround: import namespace
import * as Express from "express";
const app = Express();
```

**Com esModuleInterop:**
```typescript
import Express from "express";  // ✅ OK
const app = Express();
```

**Como funciona:**
```javascript
// TypeScript gera código helper para compatibilidade
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

var express_1 = __importDefault(require("express"));
```

**Conceito:** Habilita **compatibilidade** entre ES Modules (import/export) e CommonJS (require/module.exports).

**Quando usar:**
- ✅ **Sempre** em projetos Node.js
- ✅ Quando importar bibliotecas CommonJS
- ❌ Se biblioteca já tem ES Modules

### forceConsistentCasingInFileNames

```json
{
  "compilerOptions": {
    "forceConsistentCasingInFileNames": true
  }
}
```

**Problema:**
```typescript
// Windows/Mac (case-insensitive)
import { Button } from "./components/button";  // ✅ Funciona
import { Input } from "./components/INPUT";    // ✅ Funciona

// Linux (case-sensitive)
import { Button } from "./components/button";  // ❌ Arquivo é Button.tsx
import { Input } from "./components/INPUT";    // ❌ Arquivo é Input.tsx
```

**Com forceConsistentCasingInFileNames:**
```typescript
import { Button } from "./components/button";  // ❌ Erro de compilação
import { Button } from "./components/Button";  // ✅ OK
```

**Conceito:** Detecta inconsistências de **case** em imports, prevenindo bugs em sistemas Linux.

### resolveJsonModule

```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

**Permite importar JSON:**
```typescript
// data.json
{
  "name": "João",
  "age": 30
}

// index.ts
import data from "./data.json";  // ✅ Com resolveJsonModule
console.log(data.name);  // Type-safe!

// Tipo inferido:
// const data: { name: string; age: number }
```

## 🎯 Aplicabilidade

### Configuração Recomendada (Novos Projetos)

```json
{
  "compilerOptions": {
    /* Type Checking */
    "strict": true,                          // ✅ Máxima segurança
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,        // Arrays podem ser undefined

    /* Modules */
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,                 // ✅ Compatibilidade
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,  // ✅ Evita bugs Linux

    /* Completeness */
    "skipLibCheck": true                     // ✅ Performance
  }
}
```

### Migração Gradual para Strict

```json
// Fase 1: Projeto existente (permissivo)
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": false,
    "strictNullChecks": false
  }
}

// Fase 2: Habilitar noImplicitAny
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": true,         // ✅ Primeiro passo
    "strictNullChecks": false
  }
}

// Fase 3: Habilitar strictNullChecks
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": true,
    "strictNullChecks": true,      // ✅ Segundo passo
  }
}

// Fase 4: strict completo
{
  "compilerOptions": {
    "strict": true  // ✅ Todas as flags
  }
}
```

### Biblioteca Publicável

```json
{
  "compilerOptions": {
    "strict": true,                    // ✅ Máxima qualidade
    "declaration": true,
    "declarationMap": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## ⚠️ Considerações

### 1. strict é Evolutivo

```json
{
  "compilerOptions": {
    "strict": true  // Pode incluir NOVAS flags em versões futuras
  }
}
```

**TypeScript 5.0 adicionou novas flags ao strict:**
- `useUnknownInCatchVariables`
- Futuras versões podem adicionar mais

**Implicação:** Atualizar TypeScript pode **introduzir novos erros** mesmo sem mudar código.

### 2. Desabilitar Flags Individuais

```json
{
  "compilerOptions": {
    "strict": true,
    "strictPropertyInitialization": false  // Desabilita apenas esta
  }
}
```

### 3. skipLibCheck Trade-offs

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

**Vantagens:**
- ✅ Compilação muito mais rápida
- ✅ Evita erros em bibliotecas de terceiros

**Desvantagens:**
- ❌ Não detecta erros em seus próprios .d.ts
- ❌ Conflitos de tipos entre bibliotecas não detectados

**Recomendação:** Use `skipLibCheck: true` em 99% dos casos.

### 4. esModuleInterop + CommonJS

```typescript
// Com esModuleInterop: true
import React from "react";  // ✅ Funciona

// Sem esModuleInterop
import * as React from "react";  // ✅ Necessário
```

**Custo:** Adiciona helpers no output (~100 bytes por arquivo).

## 📚 Conclusão

strict mode habilita **verificação máxima de tipos** através de 8 flags: noImplicitAny (proíbe any implícito), strictNullChecks (separa null/undefined), strictFunctionTypes (contravariância), strictBindCallApply (verifica call/apply), strictPropertyInitialization (força inicialização), noImplicitThis (this explícito), alwaysStrict (use strict), useUnknownInCatchVariables (catch: unknown). **skipLibCheck** melhora performance drasticamente (sempre use). **esModuleInterop** habilita compatibilidade ES Modules/CommonJS. forceConsistentCasingInFileNames previne bugs em Linux. Novos projetos devem usar strict: true. Migração gradual: noImplicitAny → strictNullChecks → strict completo. strict é evolutivo, novas flags podem ser adicionadas em versões futuras.
