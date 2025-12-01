# Enum Numérico

## 🎯 Introdução e Definição

### Definição Conceitual

**Enum numérico** é uma estrutura de dados em TypeScript que permite definir um conjunto de **constantes nomeadas** associadas a **valores numéricos**. A keyword `enum` cria um tipo especial onde cada membro recebe automaticamente um número (começando de 0 por padrão), ou pode ter valores explícitos customizados. Conceitualmente, enums numéricos implementam **bidirectional mapping** - permitem acesso tanto por nome quanto por valor.

Um enum numérico funciona como **dicionário bidirecional**: dado o nome, obtém-se o valor; dado o valor, obtém-se o nome. Esta propriedade, chamada **reverse mapping**, é única de enums numéricos (enums string não têm). O resultado compilado é um objeto JavaScript com propriedades para ambas direções.

### Contexto Histórico e Motivação

A evolução de enums em TypeScript:

**TypeScript 0.9 (2013):** Introduziu **enums** como feature inspirada em C#, Java, e outras linguagens estaticamente tipadas. Motivação: dar **nomes semânticos** a valores mágicos (magic numbers).

**Problema que resolve:** Em JavaScript puro, constantes eram definidas como:
```javascript
const STATUS_ATIVO = 1;
const STATUS_INATIVO = 2;
```

**Enums melhoram isso:**
- **Agrupamento:** Constantes relacionadas ficam juntas
- **Type Safety:** TypeScript valida que apenas valores válidos são usados
- **Reverse Mapping:** Permite converter número de volta para nome
- **IntelliSense:** IDEs mostram todos valores possíveis

**TypeScript 1.x-4.x:** Enums evoluíram com computed values, const enums (removidos do código), e melhor integração com type system.

**Debate Filosófico:** Comunidade discute se enums são anti-pattern (muitos preferem union types literais). Enums persistem por familiaridade com outras linguagens.

### Problema Fundamental que Resolve

Enums numéricos resolvem vários problemas:

**1. Magic Numbers:** Substituem números sem significado por nomes descritivos.

```typescript
// Sem enum - magic numbers
if (usuario.status === 1) { /* ... */ }

// Com enum - semântico
if (usuario.status === Status.Ativo) { /* ... */ }
```

**2. Type Safety:** Compilador valida que apenas valores válidos são usados.

**3. Agrupamento Semântico:** Relaciona constantes logicamente conectadas.

**4. Reverse Mapping:** Permite debugging - converter número para nome.

**5. Refactoring:** Mudar valor numérico em um lugar atualiza todo código.

### Importância no Ecossistema

Enums numéricos são importantes porque:

- **Interop com APIs:** Muitas APIs usam códigos numéricos (HTTP status, error codes)
- **Database Mapping:** Databases frequentemente usam integers para estados
- **Legacy Code:** Integração com código JavaScript existente que usa números
- **Performance:** Números são mais eficientes em memória que strings
- **Debugging:** Reverse mapping facilita logging legível

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Auto-Increment:** Valores começam em 0 e incrementam automaticamente
2. **Custom Values:** Valores podem ser definidos explicitamente
3. **Reverse Mapping:** Acesso bidirecional (nome ↔ valor)
4. **Compile-Time:** Enum é checado em compile-time, existe como objeto em runtime
5. **Numeric Type:** Valores de enum são compatíveis com `number` type

### Pilares Fundamentais

- **Declaration:** `enum Nome { Membro1, Membro2 }`
- **Access:** `Nome.Membro1` retorna número
- **Reverse:** `Nome[0]` retorna string
- **Type:** Variável pode ter tipo `Nome` (aceita apenas valores do enum)
- **Compilation:** Gera objeto JavaScript IIFE

### Visão Geral das Nuances

- **Zero-Based:** Padrão começa em 0 (como array indices)
- **Computed Values:** Valores podem ser expressões calculadas
- **Heterogeneous:** Pode misturar auto-increment e valores customizados
- **Const Enum:** Versão otimizada (inline) - `const enum`
- **Ambient Enum:** `declare enum` para enums de bibliotecas externas

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Compilation Process

```typescript
// TypeScript source
enum Direcao {
  Cima,
  Baixo,
  Esquerda,
  Direita
}

// JavaScript compilado (ES5)
var Direcao;
(function (Direcao) {
  Direcao[Direcao["Cima"] = 0] = "Cima";
  Direcao[Direcao["Baixo"] = 1] = "Baixo";
  Direcao[Direcao["Esquerda"] = 2] = "Esquerda";
  Direcao[Direcao["Direita"] = 3] = "Direita";
})(Direcao || (Direcao = {}));
```

**Análise profunda da compilação:**

1. **IIFE (Immediately Invoked Function Expression):** Cria escopo isolado
2. **Assignment Chain:** `Direcao["Cima"] = 0` retorna `0`, que é usado como chave: `Direcao[0] = "Cima"`
3. **Bidirectional Mapping:** 
   - `Direcao.Cima === 0` (nome → valor)
   - `Direcao[0] === "Cima"` (valor → nome)
4. **Object Merging:** `Direcao || (Direcao = {})` permite declaration merging

**Fundamento conceitual:** Enum é **runtime construct** (existe como objeto), não apenas compile-time type.

### Princípios e Conceitos Subjacentes

#### Auto-Increment Behavior

```typescript
enum Status {
  Pendente,   // 0
  Ativo,      // 1
  Inativo,    // 2
  Arquivado   // 3
}

console.log(Status.Pendente);  // 0
console.log(Status.Ativo);     // 1
```

**Conceito crucial:** Primeiro membro sem valor explícito recebe `0`. Cada membro subsequente incrementa `1`.

#### Custom Starting Value

```typescript
enum HttpStatus {
  OK = 200,
  Created,      // 201 (auto-increment)
  Accepted,     // 202
  BadRequest = 400,
  Unauthorized, // 401
  Forbidden     // 402
}
```

**Análise profunda:** Auto-increment continua a partir do último valor explícito.

#### Explicit Values

```typescript
enum Prioridade {
  Baixa = 1,
  Media = 5,
  Alta = 10,
  Urgente = 100
}
```

**Fundamento teórico:** Valores podem ser não-sequenciais e customizados.

#### Reverse Mapping

```typescript
enum Cor {
  Vermelho,
  Verde,
  Azul
}

console.log(Cor.Vermelho);     // 0 (nome → valor)
console.log(Cor[0]);           // "Vermelho" (valor → nome)
console.log(Cor[Cor.Verde]);   // "Verde" (nome → valor → nome)
```

**Conceito avançado:** Reverse mapping permite conversão bidirecional, útil para debugging e serialização.

### Modelo Mental para Compreensão

Pense em enum numérico como **tabela de duas colunas**:

| Nome (String) | Valor (Number) |
|---------------|----------------|
| Cima          | 0              |
| Baixo         | 1              |
| Esquerda      | 2              |
| Direita       | 3              |

**Acesso:**
- **Por nome:** Procura na coluna "Nome", retorna "Valor"
- **Por valor:** Procura na coluna "Valor", retorna "Nome"

**Implementação JavaScript:** Objeto com propriedades para ambas direções:
```javascript
{
  Cima: 0,
  Baixo: 1,
  Esquerda: 2,
  Direita: 3,
  0: "Cima",
  1: "Baixo",
  2: "Esquerda",
  3: "Direita"
}
```

## 🔍 Análise Conceitual Profunda

### Basic Numeric Enum

```typescript
enum Tamanho {
  Pequeno,   // 0
  Medio,     // 1
  Grande     // 2
}

const camisa: Tamanho = Tamanho.Medio;
console.log(camisa);           // 1
console.log(Tamanho[camisa]);  // "Medio"
```

**Análise teórica:** 
- Tipo `Tamanho` aceita apenas valores `0 | 1 | 2`
- Reverse mapping permite obter nome de volta

### Custom Numeric Values

```typescript
enum DiaDaSemana {
  Domingo = 1,    // Começa em 1 (não 0)
  Segunda,        // 2
  Terca,          // 3
  Quarta,         // 4
  Quinta,         // 5
  Sexta,          // 6
  Sabado          // 7
}
```

**Fundamento conceitual:** Valores customizados alinham com convenções humanas (semana começa em 1).

### Computed Values

```typescript
enum Flags {
  None = 0,
  Read = 1 << 0,     // 1 (bit 0)
  Write = 1 << 1,    // 2 (bit 1)
  Execute = 1 << 2,  // 4 (bit 2)
  All = Read | Write | Execute  // 7
}

const permissao = Flags.Read | Flags.Write;  // 3
```

**Análise profunda:** 
- Valores podem ser **expressões constantes**
- Bit flags são padrão comum para permissões
- Bitwise operators (`<<`, `|`) criam máscaras

### Heterogeneous Enums (Misturado - Anti-Pattern)

```typescript
enum Misturado {
  Numero = 1,
  Texto = "texto"  // ❌ Evitar - mistura number e string
}
```

**Conceito crucial:** TypeScript permite, mas é **anti-pattern**. Quebra reverse mapping para strings.

### Type Safety

```typescript
enum Status {
  Ativo,
  Inativo
}

function setStatus(status: Status) {
  // Aceita apenas Status.Ativo ou Status.Inativo
}

setStatus(Status.Ativo);  // ✅ OK
setStatus(0);             // ✅ OK (números são compatíveis)
setStatus(999);           // ✅ OK (TypeScript permite qualquer number!)
setStatus("Ativo");       // ❌ Erro
```

**Limitação importante:** Enums numéricos aceitam **qualquer `number`**, não apenas valores do enum. Esta é limitação conhecida.

### Const Enum - Inline Optimization

```typescript
const enum Direcao {
  Cima,
  Baixo
}

const d = Direcao.Cima;

// Compilado:
const d = 0 /* Direcao.Cima */;
// Enum não existe em runtime - valores são inline
```

**Análise profunda:**
- `const enum` é otimização - valores são substituídos por literais
- Não gera objeto JavaScript
- Não tem reverse mapping em runtime
- Mais eficiente, mas menos flexível

### Ambient Enum

```typescript
declare enum TipoExterno {
  Tipo1,
  Tipo2
}

// Diz ao TypeScript que enum existe em runtime, mas não gera código
```

**Conceito avançado:** `declare enum` é para enums definidos em bibliotecas JavaScript externas.

### Enum como Type

```typescript
enum Nivel {
  Iniciante,
  Intermediario,
  Avancado
}

interface Usuario {
  nivel: Nivel;  // Tipo é Nivel, não number
}

const usuario: Usuario = {
  nivel: Nivel.Intermediario  // ✅ OK
};

const usuario2: Usuario = {
  nivel: 1  // ✅ OK (number é compatível)
};
```

**Fundamento teórico:** Enum cria tanto **valor** quanto **tipo**.

### Enum Member Types

```typescript
enum E {
  A,
  B
}

type A = E.A;  // Tipo literal E.A
const a: A = E.A;  // ✅ OK
const b: A = E.B;  // ❌ Erro
```

**Conceito avançado:** Cada membro de enum é tipo literal único.

### Enum Iteration (Keys)

```typescript
enum Cor {
  Vermelho,
  Verde,
  Azul
}

// Obter nomes (keys)
const nomes = Object.keys(Cor).filter(k => isNaN(Number(k)));
console.log(nomes);  // ["Vermelho", "Verde", "Azul"]

// Obter valores
const valores = Object.keys(Cor).filter(k => !isNaN(Number(k)));
console.log(valores);  // ["0", "1", "2"]
```

**Análise profunda:** 
- `Object.keys()` retorna tanto nomes quanto valores (devido a reverse mapping)
- `isNaN(Number(k))` filtra para obter apenas nomes

### Enum as Union

```typescript
enum Status {
  Ativo,
  Inativo
}

// Equivalente a:
type StatusType = 0 | 1;

// Mas enum tem vantagens:
// 1. Nomes semânticos
// 2. Reverse mapping
// 3. Agrupamento
```

**Fundamento conceitual:** Enum numérico é essencialmente union de valores numéricos, com metadata adicional.

### Namespace Merging

```typescript
enum Direcao {
  Cima,
  Baixo
}

namespace Direcao {
  export function toString(d: Direcao): string {
    return Direcao[d];
  }
}

console.log(Direcao.toString(Direcao.Cima));  // "Cima"
```

**Conceito avançado:** Enums podem ser merged com namespaces para adicionar utility functions.

## 🎯 Aplicabilidade e Contextos

### HTTP Status Codes

```typescript
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500
}

function handleResponse(status: HttpStatus) {
  if (status === HttpStatus.OK) {
    console.log("Sucesso!");
  }
}
```

**Raciocínio:** Enums mapeiam códigos numéricos de APIs para nomes semânticos.

### Database Status Codes

```typescript
enum StatusPedido {
  Pendente = 0,
  Processando = 1,
  Enviado = 2,
  Entregue = 3,
  Cancelado = 99
}
```

**Raciocínio:** Databases armazenam integers; enum dá significado.

### Bit Flags

```typescript
enum Permissoes {
  None = 0,
  Ler = 1,
  Escrever = 2,
  Executar = 4,
  Todas = Ler | Escrever | Executar
}

const permissao = Permissoes.Ler | Permissoes.Escrever;

if (permissao & Permissoes.Ler) {
  console.log("Pode ler");
}
```

**Raciocínio:** Bit flags compactos para múltiplas permissões booleanas.

### Game Development

```typescript
enum DirecaoMovimento {
  Cima = 0,
  Direita = 1,
  Baixo = 2,
  Esquerda = 3
}

const opostos = [
  DirecaoMovimento.Baixo,    // Oposto de Cima
  DirecaoMovimento.Esquerda, // Oposto de Direita
  DirecaoMovimento.Cima,     // Oposto de Baixo
  DirecaoMovimento.Direita   // Oposto de Esquerda
];

const oposto = opostos[DirecaoMovimento.Cima];  // Baixo
```

**Raciocínio:** Valores numéricos permitem arrays indexados por enum.

### Logging Levels

```typescript
enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3
}

function log(level: LogLevel, msg: string) {
  if (level >= LogLevel.Warn) {
    console.error(`[${LogLevel[level]}] ${msg}`);
  }
}

log(LogLevel.Error, "Falha crítica");  // [Error] Falha crítica
```

**Raciocínio:** Comparação numérica (`>=`) funciona naturalmente; reverse mapping para logging.

## ⚠️ Limitações e Considerações Teóricas

### Type Safety Limitada

```typescript
enum Cor {
  Vermelho,
  Verde,
  Azul
}

const cor: Cor = 999;  // ✅ TypeScript permite (qualquer number)
```

**Problema:** Enums numéricos aceitam qualquer `number`, não apenas valores definidos.

**Solução:** Usar enums string (mais type-safe) ou validação em runtime.

### Reverse Mapping Overhead

```typescript
// Enum gera objeto grande:
enum Grande {
  A, B, C, D, E, F, G, H, I, J
}

// Objeto resultante tem 20 propriedades (10 nomes + 10 valores)
```

**Análise:** Reverse mapping dobra tamanho do objeto. Para bundles pequenos, considere `const enum`.

### Não é Iterável Diretamente

```typescript
enum Status {
  Ativo,
  Inativo
}

// ❌ for...of não funciona
// for (const s of Status) {}  // Erro

// ✅ Workaround
for (const key in Status) {
  if (isNaN(Number(key))) {
    console.log(key);
  }
}
```

**Limitação:** Enums não são iterables nativos.

### Não Funciona com Destructuring

```typescript
enum Cor {
  Vermelho,
  Verde
}

// ❌ Destructuring não funciona semanticamente
// const { Vermelho, Verde } = Cor;  // Não útil
```

## 🔗 Interconexões Conceituais

**Relação com Union Types:** Enums são alternativa a unions literais (`type Status = 0 | 1 | 2`).

**Relação com Const Assertions:** `as const` pode substituir enums em alguns casos.

**Relação com Namespaces:** Enums podem ser merged com namespaces.

**Relação com Classes:** Enums podem ser usados como tipos de propriedades/métodos.

## 🚀 Evolução e Próximos Conceitos

Dominar enums numéricos prepara para:
- **String Enums:** Enums com valores string (mais type-safe)
- **Const Enums:** Otimização inline
- **Enum vs Union Types:** Escolha entre abordagens
- **Advanced Patterns:** Discriminated unions, state machines
