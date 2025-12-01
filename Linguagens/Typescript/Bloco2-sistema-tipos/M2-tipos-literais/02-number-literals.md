# Number Literals: Valores Numéricos Específicos como Tipos

## 🎯 Introdução e Definição

Number literal type é **tipo TypeScript que representa valor numérico específico e exato**, não categoria geral de números. Enquanto tipo `number` aceita qualquer valor numérico (inteiros, decimais, Infinity, NaN), literal type como `42` aceita **apenas esse número específico**. Conceitualmente, representa **refinamento máximo de tipo numérico primitivo**: de infinitas possibilidades numéricas para **singleton contendo único valor**. Number literals são usados para constantes matemáticas, códigos de status, flags binárias e enumerações numéricas type-safe.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Tipo = Valor:** Número específico é o tipo (`42` é tipo E valor)
2. **Refinamento Extremo:** Mais restritivo possível para números
3. **Union de Literais:** Combinar literais cria conjunto finito
4. **Inteiros e Decimais:** Ambos funcionam como literais
5. **Negativos:** Números negativos também são literais válidos
6. **Type Safety:** Compilador valida apenas valores exatos

**Conceito Central:** Number literal transforma **valor numérico em tipo** - contrato que aceita apenas número exato.

## 🧠 Fundamentos Teóricos

### Sintaxe Básica

**Declaração:**
```typescript
let resposta: 42;
resposta = 42;      // OK - valor exato
// resposta = 43;   // ERRO: Type '43' is not assignable to type '42'
// resposta = 42.0; // OK - 42.0 === 42 em JavaScript
```

**Conceito:** Tipo literal aceita **apenas valor idêntico** numericamente.

### Number vs. Number Literal

**Tipo Amplo (`number`):**
```typescript
let valor: number;
valor = 0;
valor = 42;
valor = 3.14;
valor = -999;
valor = Infinity;
valor = NaN;
// Infinitas possibilidades
```

**Tipo Literal (`42`):**
```typescript
let resposta: 42;
resposta = 42;     // Única possibilidade
// resposta = 43;  // ERRO
```

**Hierarquia:** `42` é subtipo de `number`.

```typescript
let literal: 42 = 42;
let geral: number = literal;  // OK - upcast

let geral2: number = 42;
// let literal2: 42 = geral2;  // ERRO - downcast inseguro
```

### Inferência de Number Literals

**Com `const`:**
```typescript
const resposta = 42;  // Tipo inferido: 42 (literal)
```

**Com `let`:**
```typescript
let resposta = 42;    // Tipo inferido: number (widening)
```

**Conceito:** `const` não pode ser reatribuído, então TypeScript infere literal; `let` pode mudar, então infere `number` amplo.

**Prevenir Widening:**
```typescript
let resposta = 42 as const;  // Tipo: 42 (literal)
// resposta = 43;  // ERRO
```

### Inteiros e Decimais

**Inteiros:**
```typescript
let codigo: 200;
codigo = 200;     // OK

let contador: 0 | 1 | 2 | 3;
contador = 2;     // OK
```

**Decimais:**
```typescript
let pi: 3.14;
pi = 3.14;        // OK
// pi = 3.141;    // ERRO

let taxa: 0.05 | 0.10 | 0.15;
taxa = 0.10;      // OK
```

**Negativos:**
```typescript
let temperatura: -273.15;  // Zero absoluto
temperatura = -273.15;     // OK

let direcao: -1 | 0 | 1;   // Esquerda, parado, direita
direcao = -1;              // OK
```

### Union de Number Literals

**Enumeração Numérica Type-Safe:**
```typescript
type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500;

let status: HttpStatus;
status = 200;    // OK
status = 404;    // OK
// status = 999; // ERRO: Type '999' is not assignable
```

**Códigos de Erro:**
```typescript
type CodigoErro = 1 | 2 | 3 | 4 | 5;

function lancarErro(codigo: CodigoErro, mensagem: string) {
  throw new Error(`[${codigo}] ${mensagem}`);
}

lancarErro(1, "Erro de validação");  // OK
```

**Níveis:**
```typescript
type NivelLog = 0 | 1 | 2 | 3 | 4;
// 0 = trace, 1 = debug, 2 = info, 3 = warn, 4 = error

let nivel: NivelLog = 2;
```

## 🔍 Análise Conceitual Profunda

### Number Literals em Objetos

**Propriedades Literais:**
```typescript
type Resposta = {
  statusCode: 200 | 201 | 400 | 404 | 500;
  corpo: string;
};

const resposta: Resposta = {
  statusCode: 200,
  corpo: "Sucesso"
};
```

**Discriminated Unions:**
```typescript
type Evento =
  | { tipo: 1; mensagem: string }
  | { tipo: 2; dados: number[] }
  | { tipo: 3; erro: Error };

function processar(evento: Evento) {
  switch (evento.tipo) {
    case 1:
      // evento: { tipo: 1; mensagem: string }
      console.log(evento.mensagem);
      break;
    case 2:
      // evento: { tipo: 2; dados: number[] }
      console.log(evento.dados);
      break;
    case 3:
      // evento: { tipo: 3; erro: Error }
      console.log(evento.erro);
      break;
  }
}
```

### Constantes Numéricas

**Valores Matemáticos:**
```typescript
const PI: 3.141592653589793 = 3.141592653589793;
const E: 2.718281828459045 = 2.718281828459045;

// Ou usar as const
const CONSTANTES = {
  PI: 3.141592653589793,
  E: 2.718281828459045
} as const;
// CONSTANTES.PI: 3.141592653589793 (literal)
```

**Códigos de Status HTTP:**
```typescript
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
} as const;

type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
// HttpStatusCode = 200 | 201 | 400 | 401 | 404 | 500

function responder(status: HttpStatusCode) {
  // Type-safe
}
```

### Narrowing com Number Literals

**Type Guards:**
```typescript
type Codigo = 0 | 1 | 2;

function processar(codigo: Codigo) {
  if (codigo === 0) {
    // codigo: 0
    console.log("Inativo");
  } else if (codigo === 1) {
    // codigo: 1
    console.log("Ativo");
  } else {
    // codigo: 2
    console.log("Erro");
  }
}
```

**Switch Exhaustivo:**
```typescript
type Prioridade = 1 | 2 | 3 | 4 | 5;

function obterDescricao(prioridade: Prioridade): string {
  switch (prioridade) {
    case 1:
      return "Crítica";
    case 2:
      return "Alta";
    case 3:
      return "Média";
    case 4:
      return "Baixa";
    case 5:
      return "Trivial";
    default:
      const _exhaustive: never = prioridade;
      throw new Error(`Prioridade não tratada: ${_exhaustive}`);
  }
}
```

### Ranges com Unions

**Conceito:** Unions de literais podem representar ranges discretos.

```typescript
type Dia = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type DiaUtil = 1 | 2 | 3 | 4 | 5;
type FimDeSemana = 6 | 7;

function ehDiaUtil(dia: Dia): dia is DiaUtil {
  return dia >= 1 && dia <= 5;
}
```

**Limites:**
```typescript
type Percentual = 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;

let desconto: Percentual = 50;
```

**Nota:** Para ranges contínuos, branded types ou validação runtime são necessários.

## 🎯 Aplicabilidade

### Quando Usar Number Literals

**1. HTTP Status Codes:**
```typescript
type StatusSucesso = 200 | 201 | 204;
type StatusErroCliente = 400 | 401 | 403 | 404;
type StatusErroServidor = 500 | 502 | 503;

type HttpStatus = StatusSucesso | StatusErroCliente | StatusErroServidor;
```

**2. Estados Numéricos:**
```typescript
type EstadoConexao = 0 | 1 | 2 | 3;
// 0 = desconectado, 1 = conectando, 2 = conectado, 3 = erro

class Conexao {
  estado: EstadoConexao = 0;
}
```

**3. Flags e Códigos:**
```typescript
type CodigoRetorno = -1 | 0 | 1;
// -1 = erro, 0 = sem mudança, 1 = sucesso

function processar(): CodigoRetorno {
  // ...
  return 1;
}
```

**4. Versões de API:**
```typescript
type VersaoAPI = 1 | 2 | 3;

function chamarAPI(versao: VersaoAPI, endpoint: string) {
  const baseURL = `https://api.exemplo.com/v${versao}`;
  // ...
}
```

**5. Níveis e Prioridades:**
```typescript
type NivelAcesso = 0 | 1 | 2 | 3 | 4;
// 0 = guest, 1 = user, 2 = mod, 3 = admin, 4 = owner

type Prioridade = 1 | 2 | 3;
// 1 = alta, 2 = média, 3 = baixa
```

### Vantagens sobre Numeric Enums

**Number Literals:**
```typescript
type Status = 0 | 1 | 2;
```

**vs. Enum:**
```typescript
enum Status {
  Inativo = 0,
  Ativo = 1,
  Erro = 2
}
```

**Vantagens de Literals:**
- ✅ Sem overhead de runtime
- ✅ Compatibilidade direta com JSON/APIs
- ✅ Mais simples e direto
- ✅ Unions mais flexíveis

**Quando preferir Enums:**
- Reverse mapping (número → nome)
- Namespacing
- Auto-incremento de valores

## 🎯 Padrões Recomendados

### Constantes Nomeadas

```typescript
// ✅ Constantes com nomes descritivos
const STATUS_OK = 200 as const;
const STATUS_NOT_FOUND = 404 as const;

type HttpStatus = typeof STATUS_OK | typeof STATUS_NOT_FOUND;
```

### Objetos de Constantes

```typescript
const PRIORIDADE = {
  CRITICA: 1,
  ALTA: 2,
  MEDIA: 3,
  BAIXA: 4
} as const;

type Prioridade = typeof PRIORIDADE[keyof typeof PRIORIDADE];
// Prioridade = 1 | 2 | 3 | 4
```

### Documentar Significado

```typescript
/**
 * Código de retorno da operação
 * @values
 * - -1: Erro fatal
 * - 0: Sem alteração
 * - 1: Sucesso
 */
type CodigoRetorno = -1 | 0 | 1;
```

## ⚠️ Armadilhas Comuns

### 1. Widening com `let`

```typescript
let status = 200;  // Tipo: number (não 200)

type HttpStatus = 200 | 404;
// let s: HttpStatus = status;  // ERRO: Type 'number' is not assignable

// ✅ Solução: usar const
const status2 = 200;  // Tipo: 200
let s: HttpStatus = status2;  // OK
```

### 2. Comparações com Valores Fora do Tipo

```typescript
type Codigo = 1 | 2 | 3;

let codigo: Codigo = 1;

if (codigo === 0) {  // Sempre false (0 não está no tipo)
  // TypeScript pode avisar (com strict checks)
}
```

### 3. Precisão de Ponto Flutuante

```typescript
let taxa: 0.1;
taxa = 0.1;

let calculo = 0.2 - 0.1;  // 0.09999999999999998 (precisão JS)
// taxa = calculo;  // ERRO: Type 'number' is not assignable to type '0.1'

// Cuidado com decimais em literais
```

### 4. NaN e Infinity

```typescript
// NaN e Infinity são tipo 'number', NÃO literais
let infinito: Infinity;  // ERRO: 'Infinity' only refers to a value

// Usar 'number' para esses casos especiais
let especial: number = NaN;
```

## 🔗 Interconexões Conceituais

**Relacionado a:**
- **Union Types:** Number literals combinam-se em unions
- **Enums:** Alternativa a numeric enums
- **Type Narrowing:** Literais permitem narrowing preciso
- **Branded Types:** Validação além de literais
- **Discriminated Unions:** Números como discriminantes

**Progressão:**
Number literal → Union de literais → Discriminated unions com números → Type-safe enumerações

## 📚 Conclusão

**Number literal types** permitem **type safety extremo** com valores numéricos específicos. Combinados em unions, criam **enumerações numéricas type-safe** sem overhead de `enum`. São ideais para códigos de status HTTP, flags, níveis, prioridades e constantes matemáticas.

**Conceitos Fundamentais:**
1. **Literal = Tipo:** `42` é tipo que aceita apenas `42`
2. **Inteiros, Decimais, Negativos:** Todos podem ser literais
3. **Union de Literais:** Conjunto finito de valores numéricos
4. **`as const`:** Forçar inferência de literal
5. **Narrowing:** Comparações refinam tipo automaticamente
6. **Sem Runtime Overhead:** Literais são apagados na compilação

**Number literals = precisão numérica + type safety + código limpo sem enums.**
