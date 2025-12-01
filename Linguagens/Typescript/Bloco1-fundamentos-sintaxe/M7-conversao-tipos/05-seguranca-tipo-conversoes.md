# Segurança de Tipo e Conversões: Validação, Garantias e Type Safety

## 🎯 Introdução e Definição

Segurança de tipo em conversões é **conjunto de práticas, técnicas e ferramentas** que garantem transformações de tipos sejam **válidas, previsíveis e verificáveis** tanto em compile-time (TypeScript) quanto em runtime (JavaScript). Conceitualmente, representa **equilíbrio entre flexibilidade e garantias**: conversões são necessárias (dados externos, APIs, DOM), mas devem ser **controladas e validadas** para evitar bugs, crashes e vulnerabilidades de segurança.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Compile-Time Safety:** Verificações TypeScript em desenvolvimento
2. **Runtime Validation:** Verificações JavaScript em execução
3. **Type Guards:** Refinamento progressivo de tipos
4. **Unknown vs. Any:** Forçar validação explícita
5. **Branded Types:** Tipos validados em nível de tipo
6. **Validation Libraries:** Zod, io-ts para parsing seguro

**Conceito Central:** **Nunca confie cegamente em dados externos** - sempre valide antes de converter e usar.

## 🧠 Fundamentos Teóricos

### Camadas de Segurança de Tipo

**1. TypeScript Compile-Time:**
Verificações estáticas - previnem erros óbvios antes de execução.

```typescript
let x: number = "texto";  // ERRO: Type 'string' is not assignable
```

**Limitação:** Só verifica código TypeScript; não valida dados externos (APIs, inputs).

**2. Runtime Validation:**
Verificações durante execução - validam dados desconhecidos em tempo real.

```typescript
function validarNumero(valor: unknown): number {
  const num = Number(valor);
  if (isNaN(num)) {
    throw new Error("Não é número válido");
  }
  return num;
}
```

**3. Type Guards + Validation:**
Combinação de narrowing TypeScript com validação runtime.

```typescript
function isString(valor: unknown): valor is string {
  return typeof valor === "string";
}

if (isString(input)) {
  // TypeScript sabe que input é string
  console.log(input.toUpperCase());
}
```

### Unknown vs. Any: Forçando Validação

**`any` - Perigoso:**
```typescript
let dados: any = fetchDadosExternos();
console.log(dados.propriedadeInexistente.metodo());  // Runtime error!
// TypeScript não reclama
```

**`unknown` - Seguro:**
```typescript
let dados: unknown = fetchDadosExternos();

// console.log(dados.toUpperCase());  // ERRO: Object is of type 'unknown'

// Força validação
if (typeof dados === "string") {
  console.log(dados.toUpperCase());  // OK após narrowing
}
```

**Conceito:** `unknown` é **type-safe `any`** - força desenvolvedor a verificar tipo antes de usar.

**Regra de Ouro:** **Sempre `unknown` para dados externos**, nunca `any`.

## 🔍 Técnicas de Conversão Segura

### 1. Validação com Type Guards

**Pattern:**
```typescript
function parseUsuario(data: unknown): Usuario | null {
  // Verificar estrutura
  if (
    typeof data === "object" &&
    data !== null &&
    "nome" in data &&
    "idade" in data
  ) {
    const obj = data as { nome: unknown; idade: unknown };

    // Verificar tipos de propriedades
    if (typeof obj.nome === "string" && typeof obj.idade === "number") {
      return {
        nome: obj.nome,
        idade: obj.idade
      };
    }
  }

  return null;
}
```

**Conceito:** Validação progressiva - verificar estrutura, depois propriedades, depois tipos.

### 2. Funções de Parsing Seguro

**Number Parsing:**
```typescript
function parseNumeroSeguro(valor: unknown): number | null {
  if (typeof valor === "number") {
    return isNaN(valor) ? null : valor;
  }

  if (typeof valor === "string") {
    const num = Number(valor);
    return isNaN(num) ? null : num;
  }

  return null;
}
```

**String Parsing:**
```typescript
function parseStringSegura(valor: unknown): string | null {
  if (typeof valor === "string") {
    return valor;
  }

  if (typeof valor === "number" || typeof valor === "boolean") {
    return String(valor);
  }

  return null;
}
```

**Array Parsing:**
```typescript
function parseArrayNumeros(valor: unknown): number[] | null {
  if (!Array.isArray(valor)) {
    return null;
  }

  const numeros: number[] = [];

  for (const item of valor) {
    const num = parseNumeroSeguro(item);
    if (num === null) {
      return null;  // Falha se qualquer item inválido
    }
    numeros.push(num);
  }

  return numeros;
}
```

### 3. Assertion Functions para Validação

**Pattern:**
```typescript
function assertString(valor: unknown, mensagem?: string): asserts valor is string {
  if (typeof valor !== "string") {
    throw new Error(mensagem || "Esperado string");
  }
}

function processar(entrada: unknown) {
  assertString(entrada, "Entrada deve ser string");
  // TypeScript sabe que entrada é string aqui
  console.log(entrada.toUpperCase());
}
```

**Vantagem:** Lança erro imediatamente se validação falha; simplifica fluxo.

### 4. Branded Types (Tipos Marcados)

**Conceito:** Tipos que garantem validação ocorreu através de marca nominal.

```typescript
// Marca nominal (não existe em runtime)
type ValidatedEmail = string & { __brand: "ValidatedEmail" };

function validarEmail(texto: string): ValidatedEmail | null {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (regex.test(texto)) {
    return texto as ValidatedEmail;  // "Marcar" como validado
  }
  return null;
}

function enviarEmail(destinatario: ValidatedEmail) {
  // Só aceita emails validados
  console.log("Enviando para:", destinatario);
}

const input = "usuario@exemplo.com";
// enviarEmail(input);  // ERRO: Tipo string não é ValidatedEmail

const email = validarEmail(input);
if (email !== null) {
  enviarEmail(email);  // OK - email validado
}
```

**Benefício:** TypeScript força validação em compile-time; impossível passar string não-validada.

## 🎯 Validation Libraries

### Zod - Schema Validation

**Conceito:** Definir schemas de validação que geram tipos TypeScript automaticamente.

```typescript
import { z } from "zod";

// Definir schema
const UsuarioSchema = z.object({
  nome: z.string(),
  idade: z.number().int().positive(),
  email: z.string().email()
});

// Tipo inferido automaticamente
type Usuario = z.infer<typeof UsuarioSchema>;

// Parsing seguro
function parseUsuario(data: unknown): Usuario {
  return UsuarioSchema.parse(data);  // Lança erro se inválido
}

// Parsing com resultado
function parseUsuarioSafe(data: unknown): Usuario | null {
  const resultado = UsuarioSchema.safeParse(data);
  return resultado.success ? resultado.data : null;
}
```

**Vantagens:**
- **Single source of truth:** Schema define tipo e validação
- **Runtime validation:** Valida dados em execução
- **Type inference:** Tipos TypeScript gerados do schema

### io-ts - Functional Validation

```typescript
import * as t from "io-ts";

const Usuario = t.type({
  nome: t.string,
  idade: t.number,
  ativo: t.boolean
});

type Usuario = t.TypeOf<typeof Usuario>;

function decodificar(data: unknown): Usuario | null {
  const resultado = Usuario.decode(data);

  if (resultado._tag === "Right") {
    return resultado.right;  // Dados válidos
  }

  return null;  // Dados inválidos
}
```

## 🎯 Padrões de Segurança

### 1. Princípio do Menor Privilégio

**Sempre tipo mais restritivo possível:**
```typescript
// ❌ Muito permissivo
function processar(dados: any) { }

// ✅ Restritivo
function processar(dados: Usuario) { }

// ✅ Dados externos
function processar(dados: unknown) {
  // Validação obrigatória
}
```

### 2. Fail Fast

**Validar cedo, falhar cedo:**
```typescript
function calcularDesconto(valor: unknown, percentual: unknown): number {
  // Validar ANTES de computar
  const val = parseNumeroSeguro(valor);
  const perc = parseNumeroSeguro(percentual);

  if (val === null || perc === null) {
    throw new Error("Valores inválidos");
  }

  return val * (perc / 100);
}
```

### 3. Defesa em Profundidade

**Múltiplas camadas de validação:**
```typescript
// Layer 1: TypeScript
function processar(entrada: string | number) {
  // Layer 2: Runtime check
  if (typeof entrada !== "string") {
    throw new Error("Esperado string");
  }

  // Layer 3: Validação de conteúdo
  if (entrada.trim().length === 0) {
    throw new Error("String vazia");
  }

  // Uso seguro
  return entrada.toUpperCase();
}
```

### 4. Resultado Explícito (Result Type)

**Pattern para retornar sucesso ou erro:**
```typescript
type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

function parseJSON<T>(texto: string): Result<T, string> {
  try {
    const data = JSON.parse(texto);
    return { success: true, data };
  } catch (erro) {
    return { success: false, error: String(erro) };
  }
}

const resultado = parseJSON<Usuario>(jsonString);

if (resultado.success) {
  console.log(resultado.data.nome);  // Type-safe
} else {
  console.error(resultado.error);
}
```

## ⚠️ Vulnerabilidades Comuns

### 1. Confiança Cega em `as`

```typescript
// ❌ PERIGOSO - sem validação
const dados = JSON.parse(response) as Usuario;
dados.email.toLowerCase();  // Runtime error se estrutura errada!

// ✅ SEGURO - com validação
const dadosBrutos = JSON.parse(response);
const dados = parseUsuario(dadosBrutos);
if (dados !== null) {
  dados.email.toLowerCase();
}
```

### 2. Ignorar `null`/`undefined`

```typescript
// ❌ PERIGOSO
function processar(texto: string) {
  return texto.trim();  // Runtime error se null!
}

processar(null as any);  // Crash

// ✅ SEGURO
function processar(texto: string | null | undefined): string {
  if (texto == null) {
    return "";
  }
  return texto.trim();
}
```

### 3. Type Assertion em Dados Externos

```typescript
// ❌ NUNCA FAZER
fetch("/api/user")
  .then(res => res.json())
  .then(data => {
    const usuario = data as Usuario;  // SEM VALIDAÇÃO!
    // Se API mudar, código quebra silenciosamente
  });

// ✅ SEMPRE VALIDAR
fetch("/api/user")
  .then(res => res.json())
  .then(data => {
    const usuario = parseUsuario(data);
    if (usuario === null) {
      throw new Error("Dados inválidos da API");
    }
    // Uso seguro
  });
```

### 4. Coerção Implícita Perigosa

```typescript
// ❌ PERIGOSO - coerção silenciosa
function calcular(valor: string) {
  return valor * 2;  // Coerção implícita; NaN se texto
}

// ✅ SEGURO - conversão validada
function calcular(valor: string): number {
  const num = Number(valor);
  if (isNaN(num)) {
    throw new Error("Valor não é numérico");
  }
  return num * 2;
}
```

## 🔗 Checklist de Segurança

**Ao trabalhar com conversões:**

- [ ] **Dados externos sempre `unknown`**, nunca `any`
- [ ] **Validar antes de converter** (type guards, parsing functions)
- [ ] **Verificar resultado de `Number()`** com `isNaN()`
- [ ] **Evitar type assertions (`as`)** em dados externos
- [ ] **Usar validation libraries** (Zod, io-ts) para schemas complexos
- [ ] **Implementar error handling** (try/catch, Result types)
- [ ] **Documentar contratos** de função (JSDoc, comentários)
- [ ] **Testar edge cases** (null, undefined, strings vazias, NaN)

## 🚀 Evolução: Runtime Type Systems

**Próximos conceitos:**
- **Reflection:** Introspectar tipos em runtime (limitado em TS)
- **Serialization/Deserialization:** class-transformer, class-validator
- **GraphQL Code Generation:** Tipos gerados de schemas
- **Effect Systems:** Effect-TS para validação funcional

## 📚 Conclusão

**Segurança de tipo em conversões** exige vigilância constante: TypeScript protege em compile-time, mas **runtime validation é responsabilidade do desenvolvedor**. Dados externos (APIs, inputs, localStorage) devem sempre ser tratados como `unknown` e validados explicitamente antes de uso.

**Princípios Fundamentais:**
1. **`unknown` > `any`** - Force validação
2. **Validar antes de converter** - Type guards, parsing functions
3. **Fail fast** - Detectar erros cedo
4. **Usar libraries** - Zod, io-ts para schemas complexos
5. **Branded types** - Garantias em compile-time de validação runtime
6. **Nunca confie cegamente** em type assertions ou dados externos

**TypeScript é ferramenta poderosa, mas type safety verdadeira exige validação runtime disciplinada. Combine compile-time checks com runtime validation para código robusto e confiável.**

**Conversões seguras = validação explícita + error handling + testes rigorosos.**
