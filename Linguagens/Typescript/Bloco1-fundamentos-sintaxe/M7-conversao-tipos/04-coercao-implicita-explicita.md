# Coerção Implícita vs. Explícita: Transformações Automáticas e Controladas

## 🎯 Introdução e Definição

Coerção de tipo é **transformação de valor de um tipo para outro** durante execução do programa. **Coerção implícita** (também chamada type coercion) ocorre **automaticamente** quando JavaScript/TypeScript converte tipos em operações que esperam tipos diferentes; **coerção explícita** (type conversion ou type casting) é transformação **intencional e visível** através de funções ou operadores específicos. Conceitualmente, representa **contraste entre conveniência automática e controle explícito**: coerção implícita simplifica código mas pode causar bugs sutis; coerção explícita é verbosa mas previdente.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Coerção Implícita:** Automática, invisível, regras de JavaScript
2. **Coerção Explícita:** Manual, visível, intenção clara
3. **Contextos de Coerção:** Operadores, comparações, condicionais
4. **Abstract Operations:** Algoritmos internos (ToPrimitive, ToString, ToNumber)
5. **Type Safety:** TypeScript detecta algumas coerções perigosas

**Conceito Central:** Coerção é **ponte entre mundos de tipos** - JavaScript permite; TypeScript controla.

## 🧠 Fundamentos Teóricos

### Coerção Implícita (Type Coercion)

**Definição:** Conversão automática realizada por JavaScript quando operação espera tipo diferente do fornecido.

**Contextos Principais:**

**1. Operador `+` (Adição/Concatenação):**
```typescript
// String prevalece - converte number para string
"5" + 3        // "53" (number coagido para string)
3 + "5"        // "35"
"texto" + 42   // "texto42"

// Apenas numbers - soma aritmética
3 + 5          // 8
```

**Regra:** Se **qualquer operando** é string, `+` concatena (converte outro para string). Senão, soma.

**2. Operadores Aritméticos (-, *, /, %):**
```typescript
// Sempre convertem para number
"10" - 5       // 5 (string coagida para number)
"10" * "2"     // 20
"10" / 2       // 5
"42" % 10      // 2

// Falha na conversão
"texto" - 5    // NaN (string não-numérica vira NaN)
```

**Regra:** Operadores aritméticos (exceto `+`) **sempre tentam converter para number**.

**3. Contextos Booleanos:**
```typescript
if ("texto") {  // "texto" coagido para true
  // Executa
}

!!"valor"       // true (dupla negação força booleano)
!!0             // false
```

**Regra:** Valores falsy (`0`, `""`, `null`, `undefined`, `NaN`, `false`) viram `false`; resto vira `true`.

**4. Comparações com `==` (Loose Equality):**
```typescript
5 == "5"        // true (coerção de string para number)
0 == false      // true (false vira 0)
null == undefined  // true (regra especial)
"" == 0         // true
```

**Algoritmo Complexo:** `==` aplica múltiplas regras de coerção. **Evitar em favor de `===`**.

### Coerção Explícita (Type Conversion)

**Definição:** Conversão intencional usando funções/operadores específicos.

**Métodos Principais:**

**1. Conversão para Number:**
```typescript
Number("42")        // 42 (função)
+"42"               // 42 (operador unário +)
parseInt("42px")    // 42 (parse até primeiro não-dígito)
parseFloat("3.14")  // 3.14
```

**2. Conversão para String:**
```typescript
String(42)          // "42" (função)
(42).toString()     // "42" (método)
42 + ""             // "42" (concatenação com string vazia)
```

**3. Conversão para Boolean:**
```typescript
Boolean(0)          // false (função)
!!0                 // false (dupla negação)
```

**Intenção Clara:** Código mostra explicitamente que conversão está ocorrendo.

## 🔍 Análise Conceitual Profunda

### Abstract Operations (Operações Abstratas)

TypeScript/JavaScript usa **algoritmos internos** para coerção. Principais:

**ToPrimitive:**
Converte objeto para valor primitivo.

```typescript
const obj = {
  valueOf() { return 42; },
  toString() { return "objeto"; }
};

obj + 10;   // 52 (usa valueOf)
String(obj) // "objeto" (usa toString)
```

**ToString:**
Converte para string.

```typescript
ToString(42)         // "42"
ToString(null)       // "null"
ToString(undefined)  // "undefined"
ToString([1,2,3])    // "1,2,3"
ToString({})         // "[object Object]"
```

**ToNumber:**
Converte para número.

```typescript
ToNumber("42")       // 42
ToNumber("")         // 0
ToNumber("texto")    // NaN
ToNumber(null)       // 0
ToNumber(undefined)  // NaN
ToNumber(true)       // 1
ToNumber(false)      // 0
```

### Tabela de Coerções Comuns

**String + Qualquer Coisa:**
```typescript
"5" + 3       // "53"
"5" + true    // "5true"
"5" + null    // "5null"
"5" + {}      // "5[object Object]"
```

**Number - Qualquer Coisa:**
```typescript
10 - "3"      // 7
10 - true     // 9 (true vira 1)
10 - null     // 10 (null vira 0)
10 - undefined // NaN
```

**Comparações `==`:**
```typescript
0 == false         // true
1 == true          // true
2 == true          // false (true vira 1, não 2)
"" == false        // true
null == undefined  // true
null == 0          // false (regra especial!)
```

### TypeScript e Coerção Implícita

**TypeScript Detecta Algumas Coerções:**

```typescript
let x: number = "42";  // ERRO: Type 'string' is not assignable to type 'number'
```

**Mas Permite Outras:**

```typescript
let texto = "Resultado: " + 42;  // OK (concatenação óbvia)
```

**Strict Null Checks:**

```typescript
// Com strictNullChecks: true
let valor: string;
valor = null;  // ERRO

// Força explicitação
let valorOpcional: string | null = null;  // OK
```

**TypeScript não previne todas coerções implícitas** - foco é em type assignments, não em runtime coercion de operadores.

## 🎯 Aplicabilidade

### Quando Usar Coerção Explícita

**1. Parsing de Input:**
```typescript
const idade = Number(inputElement.value);
if (isNaN(idade)) {
  // Tratar erro
}
```

**2. Formatar Output:**
```typescript
const mensagem = "Contador: " + String(contador);
```

**3. Condicionais com Intenção Clara:**
```typescript
if (Boolean(configuracao.feature)) {
  // Explícito que está testando truthiness
}
```

### Quando Evitar Coerção Implícita

**1. Comparações - Usar `===` em vez de `==`:**
```typescript
// ❌ Evitar
if (valor == null) { }

// ✅ Preferir
if (valor === null || valor === undefined) { }
// Ou
if (valor == null) { }  // Exceção: null check duplo é aceitável
```

**2. Aritmética com Strings - Converter Explicitamente:**
```typescript
// ❌ Confuso
const total = valorString - desconto;

// ✅ Claro
const total = Number(valorString) - desconto;
```

**3. Concatenação Acidental:**
```typescript
// ❌ Bug sutil
function somar(a, b) {
  return a + b;  // Se receber strings, concatena!
}

// ✅ Type-safe
function somar(a: number, b: number): number {
  return a + b;  // TypeScript garante numbers
}
```

## 🎯 Padrões Recomendados

### Preferir Explícito sobre Implícito

**Conversões Visíveis:**
```typescript
// Explícito
const numero = Number(input);
const texto = String(valor);
const flag = Boolean(configuracao);

// Implícito (menos claro)
const numero = +input;
const texto = valor + "";
const flag = !!configuracao;
```

**Exceção:** `!!` é idioma JavaScript aceito para boolean conversion.

### Type Guards em TypeScript

**Verificar Tipos Antes de Operar:**
```typescript
function processar(valor: string | number) {
  if (typeof valor === "string") {
    return Number(valor) * 2;  // Conversão explícita após type guard
  }
  return valor * 2;
}
```

### Validação com `isNaN`

**Sempre Verificar Resultado de `Number()`:**
```typescript
function parseSeguro(texto: string): number | null {
  const num = Number(texto);
  return isNaN(num) ? null : num;
}
```

## ⚠️ Armadilhas Comuns

### 1. `+` com Arrays/Objetos

```typescript
[1, 2] + [3, 4]     // "1,23,4" (converte arrays para strings!)
{} + []             // 0 (parsing confuso)
[] + {}             // "[object Object]"
```

**Lição:** Evitar `+` com tipos não-primitivos.

### 2. `==` com `null`/`undefined`

```typescript
null == 0           // false
null == undefined   // true
undefined == 0      // false
```

**Regra Especial:** `null == undefined` mas nenhum é `== 0`.

### 3. Truthy/Falsy Surpreendentes

```typescript
Boolean([])         // true (array vazio!)
Boolean({})         // true (objeto vazio!)
Boolean("0")        // true (string "0"!)
Boolean("false")    // true (string "false"!)

// Mas:
Boolean(0)          // false
Boolean("")         // false
```

### 4. `parseInt` sem Radix

```typescript
parseInt("08")      // 8 (pode ser octal em browsers antigos)
parseInt("0x10")    // 16 (hexadecimal)

// ✅ Sempre especificar radix
parseInt("08", 10)  // 8
```

### 5. `NaN` é Único

```typescript
NaN == NaN          // false
NaN === NaN         // false

// Usar isNaN()
isNaN(NaN)          // true
```

## 🔗 Interconexões Conceituais

**Relacionado a:**
- **Funções de Conversão:** `Number()`, `String()`, `Boolean()` são coerção explícita
- **Type Assertions:** `as` é coerção compile-time; coerção é runtime
- **Type Guards:** Verificam tipos antes de coerção
- **Operadores JavaScript:** Cada operador tem regras de coerção

**Diferença Fundamental:**
- **Type Assertion (`as`):** Compile-time, não muda valor
- **Coerção:** Runtime, transforma valor efetivamente

## 🚀 Evolução e Próximos Conceitos

**Após dominar coerção:**
- **Type Guards Avançados:** Narrow antes de converter
- **Branded Types:** Garantir conversões validadas
- **Runtime Validation:** Libraries como Zod para parsing seguro

## 📚 Conclusão

**Coerção implícita** é característica JavaScript que TypeScript herda - conversões automáticas que simplificam código mas podem causar bugs. **Coerção explícita** torna intenções claras e código mais previsível.

**Regras de Ouro:**
1. **Sempre `===` em vez de `==`** (exceto `valor == null` para null/undefined check)
2. **Converter explicitamente** com `Number()`, `String()`, `Boolean()`
3. **Validar resultado** de `Number()` com `isNaN()`
4. **Evitar `+` com tipos não-primitivos**
5. **TypeScript ajuda mas não previne** toda coerção implícita

**Código defensivo usa coerção explícita - intenção clara, bugs evitados, manutenção facilitada.**
