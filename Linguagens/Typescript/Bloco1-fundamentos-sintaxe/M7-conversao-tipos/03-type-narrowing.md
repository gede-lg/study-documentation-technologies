# Type Narrowing (Redução de Tipo): Refinamento Progressivo de Tipos em Runtime

## 🎯 Introdução e Definição

Type Narrowing (redução ou estreitamento de tipo) é o **processo pelo qual TypeScript refina automaticamente tipos de união para tipos mais específicos** através de análise de fluxo de controle, guards de tipo e checagens condicionais. Conceitualmente, representa **colaboração entre desenvolvedor e compilador**: desenvolvedor escreve código que verifica tipos em runtime; compilador rastreia essas verificações e **estreita tipo em cada branch de código**, eliminando possibilidades e permitindo acesso seguro a propriedades específicas.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Control Flow Analysis:** Compilador rastreia fluxo de execução
2. **Type Guards:** Funções/expressões que refinam tipos
3. **Discriminated Unions:** Unions com propriedade discriminante
4. **Narrowing Automático:** TypeScript infere automaticamente em condicionais
5. **Exhaustiveness Checking:** Garantir cobertura de todos os casos

**Conceito Central:** Type narrowing é **refinamento progressivo** - tipo começa amplo (união) e se torna específico conforme código prova características.

## 🧠 Fundamentos Teóricos

### Control Flow Based Type Analysis

**Conceito:** TypeScript analisa estrutura de controle (if/else, switch) e **rastreia tipo em cada branch**.

**Exemplo Fundamental:**
```typescript
function processar(valor: string | number) {
  // Aqui: string | number

  if (typeof valor === "string") {
    // Aqui: string (narrowed)
    console.log(valor.toUpperCase());
  } else {
    // Aqui: number (narrowed)
    console.log(valor.toFixed(2));
  }
}
```

**Modelo Mental:** Cada verificação condicional **divide universo de tipos possíveis** - branch "true" assume tipo que passou na verificação; branch "false" assume tipos restantes.

### Typeof Type Guards

**Sintaxe:**
```typescript
typeof variavel === "string"
typeof variavel === "number"
typeof variavel === "boolean"
typeof variavel === "symbol"
typeof variavel === "undefined"
typeof variavel === "object"
typeof variavel === "function"
```

**Aplicação:**
```typescript
function exemplo(x: string | number | boolean) {
  if (typeof x === "string") {
    // x: string
    x.split(" ");
  } else if (typeof x === "number") {
    // x: number
    x.toFixed();
  } else {
    // x: boolean (única opção restante)
    x.valueOf();
  }
}
```

**Limitação:** `typeof null === "object"` - peculiaridade JavaScript que não ajuda narrowing para `null`.

### Truthiness Narrowing

**Conceito:** Verificações de truthiness (if, &&, ||, !) narrowam tipos removendo valores falsy.

**Exemplo:**
```typescript
function imprimir(texto: string | null | undefined) {
  // texto: string | null | undefined

  if (texto) {
    // texto: string (null e undefined são falsy, removidos)
    console.log(texto.toUpperCase());
  }
}
```

**Valores Falsy Removidos:** `null`, `undefined`, `0`, `""`, `false`, `NaN`

**Armadilha:**
```typescript
function processar(valor: string | number) {
  if (valor) {
    // valor: string | number (0 e "" são falsy, mas continuam possíveis!)
    // NÃO narrowed completamente
  }
}
```

### Equality Narrowing

**Conceito:** Comparações de igualdade (`===`, `!==`, `==`, `!=`) narrowam tipos.

**Exemplo com `===`:**
```typescript
function comparar(x: string | number, y: string | boolean) {
  if (x === y) {
    // Única intersecção possível: string
    // x: string, y: string
    x.toUpperCase();
    y.toUpperCase();
  }
}
```

**Verificação de `null`/`undefined`:**
```typescript
function processar(valor: string | null) {
  if (valor !== null) {
    // valor: string
    console.log(valor.trim());
  }

  if (valor != null) {
    // valor: string (== também remove undefined implicitamente)
    console.log(valor.length);
  }
}
```

### `in` Operator Narrowing

**Conceito:** Operador `in` verifica existência de propriedade e narrowa tipo.

**Sintaxe:**
```typescript
"propriedade" in objeto
```

**Exemplo:**
```typescript
interface Circulo {
  tipo: "circulo";
  raio: number;
}

interface Quadrado {
  tipo: "quadrado";
  lado: number;
}

type Forma = Circulo | Quadrado;

function calcularArea(forma: Forma) {
  if ("raio" in forma) {
    // forma: Circulo
    return Math.PI * forma.raio ** 2;
  } else {
    // forma: Quadrado
    return forma.lado ** 2;
  }
}
```

**Vantagem:** Funciona com propriedades únicas de cada tipo.

### `instanceof` Narrowing

**Conceito:** `instanceof` verifica se objeto é instância de classe/construtor.

**Sintaxe:**
```typescript
objeto instanceof Classe
```

**Exemplo:**
```typescript
class Cachorro {
  latir() { console.log("Au au!"); }
}

class Gato {
  miar() { console.log("Miau!"); }
}

function fazerBarulho(animal: Cachorro | Gato) {
  if (animal instanceof Cachorro) {
    // animal: Cachorro
    animal.latir();
  } else {
    // animal: Gato
    animal.miar();
  }
}
```

**Limitação:** Só funciona com classes JavaScript, não com interfaces TypeScript (interfaces são apagadas em runtime).

## 🔍 Type Guards Customizados

### User-Defined Type Guards

**Conceito:** Funções que retornam **type predicate** (`parametro is Tipo`) para narrowing customizado.

**Sintaxe:**
```typescript
function isTipo(valor: unknown): valor is Tipo {
  // Lógica de verificação runtime
  return /* condição */;
}
```

**Exemplo:**
```typescript
interface Peixe {
  nadar(): void;
}

interface Passaro {
  voar(): void;
}

function isPeixe(animal: Peixe | Passaro): animal is Peixe {
  return (animal as Peixe).nadar !== undefined;
}

function mover(animal: Peixe | Passaro) {
  if (isPeixe(animal)) {
    // animal: Peixe
    animal.nadar();
  } else {
    // animal: Passaro
    animal.voar();
  }
}
```

**Type Predicate:** `animal is Peixe` informa TypeScript que se função retorna `true`, `animal` é definitivamente `Peixe`.

### Assertion Functions

**Conceito:** Funções que **lançam erro se tipo não for esperado**, permitindo TypeScript assumir tipo após chamada.

**Sintaxe:**
```typescript
function assertTipo(valor: unknown): asserts valor is Tipo {
  if (/* condição falha */) {
    throw new Error("Tipo inválido");
  }
}
```

**Exemplo:**
```typescript
function assertString(valor: unknown): asserts valor is string {
  if (typeof valor !== "string") {
    throw new Error("Não é string");
  }
}

function processar(entrada: unknown) {
  // entrada: unknown
  assertString(entrada);
  // entrada: string (TypeScript sabe que se chegou aqui, é string)
  console.log(entrada.toUpperCase());
}
```

**Diferença vs. Type Guard:** Type guard retorna booleano e requer `if`; assertion function lança erro e narrowa automaticamente após chamada.

## 🎯 Discriminated Unions (Unions Discriminadas)

### Conceito e Estrutura

**Definição:** Union types com **propriedade literal comum** (discriminante) que identifica unicamente cada tipo.

**Estrutura:**
```typescript
interface TipoA {
  tipo: "A";  // Discriminante
  propriedadeA: string;
}

interface TipoB {
  tipo: "B";  // Discriminante
  propriedadeB: number;
}

type Union = TipoA | TipoB;
```

**Vantagem:** TypeScript narrowa automaticamente baseado em discriminante.

### Exemplo Completo

```typescript
interface Carregando {
  estado: "carregando";
}

interface Sucesso {
  estado: "sucesso";
  dados: string[];
}

interface Erro {
  estado: "erro";
  mensagem: string;
}

type EstadoRequisicao = Carregando | Sucesso | Erro;

function renderizar(estado: EstadoRequisicao) {
  switch (estado.estado) {
    case "carregando":
      // estado: Carregando
      return "Carregando...";

    case "sucesso":
      // estado: Sucesso
      return estado.dados.join(", ");

    case "erro":
      // estado: Erro
      return `Erro: ${estado.mensagem}`;
  }
}
```

**Exhaustiveness Checking:**
```typescript
function renderizar(estado: EstadoRequisicao): string {
  switch (estado.estado) {
    case "carregando":
      return "Carregando...";
    case "sucesso":
      return estado.dados.join(", ");
    case "erro":
      return `Erro: ${estado.mensagem}`;
    default:
      // Garante que todos os casos foram cobertos
      const _exhaustiveCheck: never = estado;
      return _exhaustiveCheck;
  }
}
```

**Conceito:** Se novo estado for adicionado à union mas não ao switch, tipo `never` causará erro de compilação.

## 🎯 Aplicabilidade

### Quando Usar Type Narrowing

**1. Funções Polimórficas:**
Processar diferentes tipos de entrada de forma segura.

**2. Event Handlers:**
```typescript
function handleEvent(event: MouseEvent | KeyboardEvent) {
  if (event instanceof MouseEvent) {
    console.log(event.clientX, event.clientY);
  } else {
    console.log(event.key);
  }
}
```

**3. API Responses:**
Modelar estados de requisição (carregando/sucesso/erro).

**4. Parsing e Validação:**
Verificar tipos de dados externos antes de usar.

### Padrões Recomendados

**Preferir Discriminated Unions:**
Mais legível e manutenível que múltiplos `instanceof` ou `in`.

**Centralizar Type Guards:**
```typescript
// guards.ts
export function isString(value: unknown): value is string {
  return typeof value === "string";
}
```

**Evitar Type Assertions Desnecessárias:**
Narrowing é mais seguro que `as`.

## ⚠️ Armadilhas Comuns

**1. Narrowing Perdido em Callbacks:**
```typescript
function processar(valor: string | null) {
  if (valor !== null) {
    // valor: string

    setTimeout(() => {
      // valor: string | null (narrowing NÃO persiste em callback)
      // valor.trim();  // Erro potencial
    }, 100);
  }
}
```

**Solução:** Capturar em variável local ou usar type guard novamente.

**2. Mutação Após Narrowing:**
```typescript
let valor: string | number = "texto";

if (typeof valor === "string") {
  // valor: string

  valor = 42;  // Reatribuição muda tipo

  // valor: number (narrowing anterior perdido)
}
```

**3. `typeof null === "object"`:**
```typescript
function processar(x: string | null) {
  if (typeof x === "object") {
    // x: null (não útil)
  }
}
```

**Solução:** Usar `x === null` explicitamente.

## 🔗 Interconexões Conceituais

**Relacionado a:**
- **Type Guards:** Ferramentas que permitem narrowing
- **Union Types:** Tipos que narrowing refina
- **Type Assertions:** Alternativa menos segura
- **Control Flow:** Base da análise de narrowing

**Progressão de Aprendizado:**
Narrowing é extensão natural de unions - permite trabalhar com types flexíveis (unions) mas com type safety de types específicos.

## 📚 Conclusão

Type Narrowing é **mecanismo central** do sistema de tipos TypeScript: permite escrever código que aceita tipos flexíveis (unions) mas opera com **segurança de tipos específicos** através de verificações runtime. Compilador rastreia inteligentemente fluxo de controle e refina tipos automaticamente.

**Discriminated unions + switch com exhaustiveness checking = padrão ouro para trabalhar com estados complexos de forma type-safe.**

**Narrowing transforma TypeScript de sistema de tipos estático em sistema que **compreende lógica runtime** - melhor dos dois mundos: flexibilidade de JavaScript com segurança de tipos.**
