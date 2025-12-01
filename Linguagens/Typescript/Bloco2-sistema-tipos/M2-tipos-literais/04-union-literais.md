# Union de Literais: Enumerações Type-Safe e Conjuntos Finitos

## 🎯 Introdução e Definição

Union de literais é **tipo TypeScript que combina múltiplos literal types** através do operador `|`, criando tipo que aceita **exatamente os valores especificados, nada mais**. Conceitualmente, representa **conjunto finito e explícito de valores possíveis**: não categoria geral (como `string`), mas **lista exaustiva de opções válidas**. Unions de literais são fundação para **enumerações type-safe sem enums**, estados de máquina, configurações com valores restritos e APIs com parâmetros limitados.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Conjunto Finito:** Lista explícita de todos os valores possíveis
2. **Type Safety Total:** Compilador valida apenas valores exatos
3. **Heterogeneidade:** Misturar strings, numbers, booleans
4. **Alternativa a Enums:** Sem overhead de runtime
5. **Autocomplete:** IDEs sugerem valores válidos
6. **Exhaustiveness Checking:** Garantir cobertura de todos os casos

**Conceito Central:** Union de literais = **enumeração explícita** - todos os valores possíveis declarados no tipo.

## 🧠 Fundamentos Teóricos

### Sintaxe Básica

**Union de Strings:**
```typescript
type Direcao = "norte" | "sul" | "leste" | "oeste";

let movimento: Direcao;
movimento = "norte";  // OK
movimento = "sul";    // OK
// movimento = "nordeste";  // ERRO: Type '"nordeste"' is not assignable
```

**Union de Numbers:**
```typescript
type Prioridade = 1 | 2 | 3 | 4 | 5;

let prioridade: Prioridade = 3;  // OK
// prioridade = 0;  // ERRO: Type '0' is not assignable
```

**Union de Booleans:**
```typescript
type Verdadeiro = true;  // Apenas true
type Falso = false;      // Apenas false
type Boolean = true | false;  // Ambos (equivalente a 'boolean')
```

### Unions Heterogêneas

**Misturando Tipos Primitivos:**
```typescript
type Resposta = "sim" | "nao" | 42;

let resposta: Resposta;
resposta = "sim";   // OK
resposta = 42;      // OK
// resposta = "talvez";  // ERRO
// resposta = 43;        // ERRO
```

**Combinando com null/undefined:**
```typescript
type Opcional = "valor1" | "valor2" | null;
type Indefinido = "ativo" | "inativo" | undefined;

let opcao: Opcional = null;  // OK
let estado: Indefinido = undefined;  // OK
```

**Conceito:** Union pode combinar **qualquer literal types**, mesmo de tipos primitivos diferentes.

### Inferência e Widening

**Sem Anotação:**
```typescript
let cor = "vermelho";  // Inferido: string (widening)
```

**Com Anotação:**
```typescript
let cor: "vermelho" | "azul" | "verde" = "vermelho";  // OK
```

**Array de Literais:**
```typescript
const cores = ["vermelho", "azul", "verde"];  // string[]

const cores2 = ["vermelho", "azul", "verde"] as const;
// readonly ["vermelho", "azul", "verde"]

type Cor = typeof cores2[number];
// Cor = "vermelho" | "azul" | "verde"
```

**Conceito:** `as const` + `typeof` + index access = union de literais extraída de array.

### Unions em Parâmetros

**Restringir Argumentos:**
```typescript
function mover(direcao: "cima" | "baixo" | "esquerda" | "direita") {
  console.log(`Movendo para ${direcao}`);
}

mover("cima");  // OK
// mover("diagonal");  // ERRO
```

**Com Type Alias:**
```typescript
type Direcao = "cima" | "baixo" | "esquerda" | "direita";

function mover(direcao: Direcao) {
  // Mais limpo e reutilizável
}
```

### Unions em Retornos

**Conjunto de Valores Possíveis:**
```typescript
function obterStatus(): "pendente" | "processando" | "completo" | "erro" {
  // Deve retornar um dos quatro valores
  return "pendente";
}

const status = obterStatus();  // status: "pendente" | "processando" | "completo" | "erro"
```

## 🔍 Análise Conceitual Profunda

### Enumerações sem Enums

**Padrão Type Alias:**
```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

function request(url: string, method: HttpMethod) {
  // Type-safe
}

request("/api/users", "GET");   // OK
request("/api/users", "TRACE"); // ERRO
```

**Vantagens sobre Enums:**
- Sem código JavaScript gerado (zero overhead)
- Compatibilidade natural com JSON/APIs
- Mais simples e direto
- Unions mais flexíveis
- Tree-shaking amigável

**Desvantagens:**
- Sem reverse mapping
- Sem namespace automático
- Sem iteração sobre valores

### Objetos Constantes + typeof

**Pattern para "Enum-like":**
```typescript
const STATUS = {
  PENDENTE: "pendente",
  PROCESSANDO: "processando",
  COMPLETO: "completo",
  ERRO: "erro"
} as const;

type Status = typeof STATUS[keyof typeof STATUS];
// Status = "pendente" | "processando" | "completo" | "erro"

// Uso:
function processar(status: Status) {
  // Type-safe
}

processar(STATUS.PENDENTE);  // OK, com autocomplete
```

**Vantagens:**
- Constantes nomeadas (como enum)
- Type safety
- Autocomplete
- Sem overhead

### Discriminated Unions com Literais

**Pattern Poderoso:**
```typescript
type Evento =
  | { tipo: "click"; x: number; y: number }
  | { tipo: "keypress"; tecla: string }
  | { tipo: "scroll"; posicao: number };

function processar(evento: Evento) {
  switch (evento.tipo) {
    case "click":
      // evento: { tipo: "click"; x: number; y: number }
      console.log(`Click em (${evento.x}, ${evento.y})`);
      break;
    case "keypress":
      // evento: { tipo: "keypress"; tecla: string }
      console.log(`Tecla: ${evento.tecla}`);
      break;
    case "scroll":
      // evento: { tipo: "scroll"; posicao: number }
      console.log(`Scroll: ${evento.posicao}`);
      break;
  }
}
```

**Conceito:** Union de literais na propriedade discriminante permite **narrowing automático e type-safe**.

### Exhaustiveness Checking

**Garantir Cobertura Completa:**
```typescript
type Estado = "ativo" | "inativo" | "pendente";

function descrever(estado: Estado): string {
  switch (estado) {
    case "ativo":
      return "Sistema ativo";
    case "inativo":
      return "Sistema inativo";
    case "pendente":
      return "Sistema pendente";
    default:
      // Se novo estado for adicionado, erro aqui
      const _exhaustive: never = estado;
      return _exhaustive;
  }
}
```

**Adicionando Novo Valor:**
```typescript
type Estado = "ativo" | "inativo" | "pendente" | "manutencao";
// Erro em descrever() - "manutencao" não tratado
```

**Conceito:** `never` em `default` força compilador a detectar casos não cobertos.

### Unions Extensas

**Grandes Conjuntos:**
```typescript
type CodigoEstado =
  | "AC" | "AL" | "AP" | "AM" | "BA" | "CE" | "DF" | "ES"
  | "GO" | "MA" | "MT" | "MS" | "MG" | "PA" | "PB" | "PR"
  | "PE" | "PI" | "RJ" | "RN" | "RS" | "RO" | "RR" | "SC"
  | "SP" | "SE" | "TO";

let estado: CodigoEstado = "SP";
```

**Geração Programática:**
```typescript
const ESTADOS = ["AC", "AL", "AP", /* ... */] as const;
type CodigoEstado = typeof ESTADOS[number];
```

## 🎯 Aplicabilidade

### Quando Usar Unions de Literais

**1. Estados de Máquina:**
```typescript
type EstadoPedido =
  | "carrinho"
  | "aguardando_pagamento"
  | "pago"
  | "preparando"
  | "enviado"
  | "entregue"
  | "cancelado";
```

**2. Configurações:**
```typescript
type Ambiente = "desenvolvimento" | "teste" | "homologacao" | "producao";
type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";
```

**3. HTTP/API:**
```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";
type HttpStatus = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 500;
```

**4. Comandos/Ações:**
```typescript
type ComandoJogo = "iniciar" | "pausar" | "retomar" | "salvar" | "sair";
type AcaoUsuario = "login" | "logout" | "atualizar" | "deletar";
```

**5. Temas/Estilos:**
```typescript
type Tema = "claro" | "escuro" | "auto";
type Tamanho = "pequeno" | "medio" | "grande";
type Alinhamento = "esquerda" | "centro" | "direita";
```

### Padrões de Composição

**Reutilização:**
```typescript
type DirecaoHorizontal = "esquerda" | "direita";
type DirecaoVertical = "cima" | "baixo";
type Direcao = DirecaoHorizontal | DirecaoVertical;
```

**Extensão:**
```typescript
type CoresPrimarias = "vermelho" | "azul" | "amarelo";
type CoresSecundarias = "verde" | "laranja" | "roxo";
type Cor = CoresPrimarias | CoresSecundarias;
```

**Intersecção de Contextos:**
```typescript
type StatusBase = "ativo" | "inativo";
type StatusExtra = StatusBase | "manutencao" | "teste";
```

## 🎯 Padrões Recomendados

### Nomear Types

```typescript
// ✅ Type alias com nome descritivo
type TipoPagamento = "credito" | "debito" | "pix" | "boleto";

function processar(tipo: TipoPagamento) { }
```

### Centralizar Definições

```typescript
// types/enums.ts
export type Status = "ativo" | "inativo" | "pendente";
export type Prioridade = "baixa" | "media" | "alta" | "critica";

// Importar onde necessário
import { Status, Prioridade } from "./types/enums";
```

### Usar Objetos para Constantes

```typescript
const DIRECAO = {
  NORTE: "norte",
  SUL: "sul",
  LESTE: "leste",
  OESTE: "oeste"
} as const;

type Direcao = typeof DIRECAO[keyof typeof DIRECAO];
```

## ⚠️ Armadilhas Comuns

### 1. Widening Acidental

```typescript
let cor = "vermelho";  // string, não literal

type Cor = "vermelho" | "azul";
// let c: Cor = cor;  // ERRO

// ✅ Usar const ou as const
const cor2 = "vermelho";  // "vermelho"
let c: Cor = cor2;  // OK
```

### 2. Union vs. Intersection

```typescript
// Union: OU (aceita qualquer um)
type A = "x" | "y";  // "x" OU "y"

// Intersection: E (deve satisfazer ambos)
type B = "x" & "y";  // never (impossível ser "x" E "y" simultaneamente)
```

### 3. Tipos muito Amplos

```typescript
// ❌ Menos type-safe
type Resposta = string | number | boolean;

// ✅ Mais específico
type Resposta = "sim" | "nao" | "talvez" | 0 | 1 | true | false;
```

### 4. Comparações Case-Sensitive

```typescript
type Comando = "START" | "STOP";

let cmd: Comando = "start";  // ERRO: "start" !== "START"
```

## 🔗 Interconexões Conceituais

**Relacionado a:**
- **Literal Types:** Unions combinam literais individuais
- **Discriminated Unions:** Literais como discriminantes
- **Type Narrowing:** Unions refinam-se com guards
- **Enums:** Alternativa moderna sem overhead
- **Template Literal Types:** Gerar unions programaticamente

**Progressão:**
Literal → Union de literais → Discriminated union → State machine type-safe

## 📚 Conclusão

**Unions de literais** são mecanismo central para **type safety com conjuntos finitos de valores**. Substituem enums na maioria dos casos, oferecendo **zero overhead, compatibilidade JSON natural e flexibilidade de unions**. São fundação para discriminated unions, pattern matching e modelagem de estados.

**Conceitos Fundamentais:**
1. **Conjunto Finito:** Lista exaustiva de valores possíveis
2. **`|` Operator:** Combina literais em union
3. **Heterogeneidade:** Misturar strings, numbers, booleans
4. **Type Safety:** Compilador valida apenas valores declarados
5. **Exhaustiveness:** `never` em default garante cobertura
6. **Sem Overhead:** Literais apagados na compilação

**Union de literais = enumerações modernas + type safety total + código limpo.**
