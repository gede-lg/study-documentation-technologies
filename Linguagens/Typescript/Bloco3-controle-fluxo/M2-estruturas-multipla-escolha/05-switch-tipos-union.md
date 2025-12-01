# Switch com Tipos Union: Pattern Matching Type-Safe

## 🎯 Introdução e Definição

Switch com tipos union é **combinação de switch statement com union types do TypeScript** que permite pattern matching **type-safe** com **automatic type narrowing** em cada case. Conceitualmente, representa **forma idiomática de discriminar entre variantes** de union type: TypeScript refina automaticamente tipo da variável dentro de cada case, garantindo acesso seguro a propriedades específicas. Com **discriminated unions** (tagged unions), switch torna-se equivalente TypeScript a **pattern matching** de linguagens funcionais, permitindo código expressivo, seguro e exhaustivo.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Type Narrowing:** TypeScript refina tipo automaticamente em cada case
2. **Discriminated Unions:** Union types com propriedade discriminante comum
3. **Pattern Matching:** Switch como equivalente a match/case funcional
4. **Exhaustiveness:** Garantia de cobertura completa com `never`
5. **Type Safety:** Compilador previne acesso a propriedades inexistentes
6. **Discriminante:** Propriedade comum usada para distinguir variantes

**Conceito Central:** Switch + Union = **pattern matching type-safe** - discriminar variantes com garantias de tipo.

## 🧠 Fundamentos Teóricos

### Type Narrowing em Switch

**Refinamento Automático:**
```typescript
type Valor = string | number;

function processar(valor: Valor) {
  switch (typeof valor) {
    case "string":
      // valor: string
      console.log(valor.toUpperCase());
      break;
    case "number":
      // valor: number
      console.log(valor.toFixed(2));
      break;
  }
}
```

**Conceito:** TypeScript **narrow tipo automaticamente** baseado em guard do case.

### Union de Literais

**Seleção Simples:**
```typescript
type Status = "pendente" | "aprovado" | "rejeitado";

function obterCor(status: Status): string {
  switch (status) {
    case "pendente":
      // status: "pendente"
      return "amarelo";
    case "aprovado":
      // status: "aprovado"
      return "verde";
    case "rejeitado":
      // status: "rejeitado"
      return "vermelho";
  }
}
```

**Conceito:** Cada case **refina union** para literal específico correspondente.

### Discriminated Unions (Tagged Unions)

**Padrão Fundamental:**
```typescript
type Forma =
  | { tipo: "circulo"; raio: number }
  | { tipo: "quadrado"; lado: number }
  | { tipo: "retangulo"; largura: number; altura: number };

function calcularArea(forma: Forma): number {
  switch (forma.tipo) {
    case "circulo":
      // forma: { tipo: "circulo"; raio: number }
      return Math.PI * forma.raio ** 2;
    case "quadrado":
      // forma: { tipo: "quadrado"; lado: number }
      return forma.lado ** 2;
    case "retangulo":
      // forma: { tipo: "retangulo"; largura: number; altura: number }
      return forma.largura * forma.altura;
  }
}
```

**Conceito:** Propriedade **discriminante** (`tipo`) permite TypeScript **identificar variante** e narrow tipo.

### Estrutura de Discriminated Union

**Componentes:**
1. **Union Type:** Conjunto de variantes (`Forma = VarianteA | VarianteB | ...`)
2. **Discriminante:** Propriedade comum com valores únicos (`tipo: "circulo" | "quadrado" | ...`)
3. **Propriedades Específicas:** Dados exclusivos de cada variante
4. **Switch:** Discrimina baseado no discriminante

**Requisitos:**
- Cada variante tem **mesma propriedade discriminante**
- Discriminante tem **valor literal único** por variante
- Discriminante é **string literal** ou **number literal** ou **boolean**

## 🔍 Análise Conceitual Profunda

### Type Guards no Switch

**Typeof Guard:**
```typescript
type Primitivo = string | number | boolean;

function descrever(valor: Primitivo): string {
  switch (typeof valor) {
    case "string":
      return `String de tamanho ${valor.length}`;
    case "number":
      return `Número ${valor.toFixed(2)}`;
    case "boolean":
      return `Boolean: ${valor ? "verdadeiro" : "falso"}`;
  }
}
```

**Conceito:** `typeof` **discrimina primitivos** - cada case narrow para tipo específico.

### Instanceof Guard

**Classes em Union:**
```typescript
class Cachorro {
  latir() { console.log("Au au!"); }
}

class Gato {
  miar() { console.log("Miau!"); }
}

type Animal = Cachorro | Gato;

function fazerBarulho(animal: Animal) {
  if (animal instanceof Cachorro) {
    animal.latir();
  } else if (animal instanceof Gato) {
    animal.miar();
  }
}
```

**Limitação:** Switch **não funciona diretamente** com `instanceof` - usar `if-else` ou converter para discriminated union.

### Discriminated Union: Pattern Poderoso

**Eventos de UI:**
```typescript
type Evento =
  | { tipo: "click"; x: number; y: number; botao: number }
  | { tipo: "keypress"; tecla: string; shift: boolean }
  | { tipo: "scroll"; deltaY: number }
  | { tipo: "resize"; largura: number; altura: number };

function processarEvento(evento: Evento) {
  switch (evento.tipo) {
    case "click":
      // evento: { tipo: "click"; x: number; y: number; botao: number }
      console.log(`Click em (${evento.x}, ${evento.y}) com botão ${evento.botao}`);
      break;
    case "keypress":
      // evento: { tipo: "keypress"; tecla: string; shift: boolean }
      console.log(`Tecla '${evento.tecla}' ${evento.shift ? "com" : "sem"} Shift`);
      break;
    case "scroll":
      // evento: { tipo: "scroll"; deltaY: number }
      console.log(`Scroll de ${evento.deltaY}px`);
      break;
    case "resize":
      // evento: { tipo: "resize"; largura: number; altura: number }
      console.log(`Resize para ${evento.largura}x${evento.altura}`);
      break;
  }
}
```

**Conceito:** Cada case **acessa propriedades específicas** da variante com type safety total.

### Reducer Pattern (Redux-like)

**Actions com Discriminated Union:**
```typescript
type Acao =
  | { tipo: "INCREMENTAR" }
  | { tipo: "DECREMENTAR" }
  | { tipo: "RESETAR" }
  | { tipo: "DEFINIR"; valor: number }
  | { tipo: "SOMAR"; quantidade: number };

type Estado = { contador: number };

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.tipo) {
    case "INCREMENTAR":
      return { contador: estado.contador + 1 };
    case "DECREMENTAR":
      return { contador: estado.contador - 1 };
    case "RESETAR":
      return { contador: 0 };
    case "DEFINIR":
      // acao: { tipo: "DEFINIR"; valor: number }
      return { contador: acao.valor };
    case "SOMAR":
      // acao: { tipo: "SOMAR"; quantidade: number }
      return { contador: estado.contador + acao.quantidade };
  }
}
```

**Conceito:** Pattern clássico de **state management** - switch discrimina ações e acessa payloads com type safety.

### Estado de Máquina (State Machine)

**Estados com Dados Específicos:**
```typescript
type EstadoConexao =
  | { status: "desconectado" }
  | { status: "conectando"; tentativa: number }
  | { status: "conectado"; sessionId: string; timestamp: Date }
  | { status: "erro"; mensagem: string; codigo: number };

function renderizarStatus(estado: EstadoConexao): string {
  switch (estado.status) {
    case "desconectado":
      return "Desconectado";
    case "conectando":
      return `Conectando... (tentativa ${estado.tentativa})`;
    case "conectado":
      return `Conectado (sessão: ${estado.sessionId} desde ${estado.timestamp.toISOString()})`;
    case "erro":
      return `Erro ${estado.codigo}: ${estado.mensagem}`;
  }
}
```

**Conceito:** Cada estado tem **dados contextuais específicos** - switch acessa com type safety.

## 🎯 Exhaustiveness Checking com Union

### Pattern com `never`

**Garantia de Cobertura:**
```typescript
type Resultado =
  | { tipo: "sucesso"; dados: string[] }
  | { tipo: "erro"; mensagem: string }
  | { tipo: "carregando"; progresso: number };

function processar(resultado: Resultado): string {
  switch (resultado.tipo) {
    case "sucesso":
      return `Sucesso: ${resultado.dados.length} itens`;
    case "erro":
      return `Erro: ${resultado.mensagem}`;
    case "carregando":
      return `Carregando: ${resultado.progresso}%`;
    default:
      const _exhaustive: never = resultado;
      throw new Error(`Tipo não tratado: ${_exhaustive}`);
  }
}
```

**Conceito:** Se todos os cases cobertos, `resultado` é `never` no default - **compilador força cobertura**.

### Adicionando Nova Variante

**Detecção Automática:**
```typescript
type Resultado =
  | { tipo: "sucesso"; dados: string[] }
  | { tipo: "erro"; mensagem: string }
  | { tipo: "carregando"; progresso: number }
  | { tipo: "timeout"; duracaoMs: number };  // NOVA variante

function processar(resultado: Resultado): string {
  switch (resultado.tipo) {
    case "sucesso":
      return `Sucesso: ${resultado.dados.length} itens`;
    case "erro":
      return `Erro: ${resultado.mensagem}`;
    case "carregando":
      return `Carregando: ${resultado.progresso}%`;
    // Faltou case "timeout"
    default:
      const _exhaustive: never = resultado;
      // ERRO: Type '{ tipo: "timeout"; duracaoMs: number }' is not assignable to type 'never'.
      throw new Error(`Tipo não tratado: ${_exhaustive}`);
  }
}
```

**Benefício:** Adicionar variante **força atualização** de todos os switches - **refatoração segura**.

## 🔍 Padrões Avançados

### Union Aninhada

**Discriminantes Múltiplos:**
```typescript
type Requisicao =
  | {
      metodo: "GET";
      url: string;
    }
  | {
      metodo: "POST";
      url: string;
      corpo: { tipo: "json"; dados: object } | { tipo: "form"; campos: FormData };
    };

function enviar(req: Requisicao) {
  switch (req.metodo) {
    case "GET":
      console.log(`GET ${req.url}`);
      break;
    case "POST":
      // req: { metodo: "POST"; url: string; corpo: ... }
      switch (req.corpo.tipo) {
        case "json":
          console.log(`POST ${req.url} com JSON`);
          break;
        case "form":
          console.log(`POST ${req.url} com FormData`);
          break;
      }
      break;
  }
}
```

**Conceito:** Switch **aninhado** discrimina union dentro de variante.

### Helper Type para Extrair Variante

**Utility Type:**
```typescript
type Forma =
  | { tipo: "circulo"; raio: number }
  | { tipo: "quadrado"; lado: number }
  | { tipo: "retangulo"; largura: number; altura: number };

// Extrai variante específica
type ExtrairVariante<T, K extends string, V> = T extends { tipo: K } ? T : never;

type Circulo = ExtrairVariante<Forma, "circulo", any>;
// Circulo = { tipo: "circulo"; raio: number }

type Quadrado = ExtrairVariante<Forma, "quadrado", any>;
// Quadrado = { tipo: "quadrado"; lado: number }
```

**Conceito:** Conditional types permitem **extrair variantes** de union para reutilização.

### Discriminante Booleana

**True/False como Discriminante:**
```typescript
type Resposta =
  | { sucesso: true; dados: string[] }
  | { sucesso: false; erro: string };

function processar(resposta: Resposta) {
  switch (resposta.sucesso) {
    case true:
      // resposta: { sucesso: true; dados: string[] }
      console.log(`Dados: ${resposta.dados.join(", ")}`);
      break;
    case false:
      // resposta: { sucesso: false; erro: string }
      console.log(`Erro: ${resposta.erro}`);
      break;
  }
}
```

**Conceito:** Boolean literals podem ser **discriminantes** - cada valor é tipo distinto.

### Discriminante Numérica

**HTTP Status Codes:**
```typescript
type Resposta =
  | { status: 200; corpo: object }
  | { status: 201; corpo: object; localizacao: string }
  | { status: 400; erro: string }
  | { status: 404; recurso: string }
  | { status: 500; mensagem: string };

function processar(resposta: Resposta) {
  switch (resposta.status) {
    case 200:
      // resposta: { status: 200; corpo: object }
      return resposta.corpo;
    case 201:
      // resposta: { status: 201; corpo: object; localizacao: string }
      console.log(`Criado em: ${resposta.localizacao}`);
      return resposta.corpo;
    case 400:
      throw new Error(`Bad Request: ${resposta.erro}`);
    case 404:
      throw new Error(`Not Found: ${resposta.recurso}`);
    case 500:
      throw new Error(`Server Error: ${resposta.mensagem}`);
  }
}
```

**Conceito:** Number literals como discriminantes - útil para códigos/IDs.

## 🎯 Múltiplos Discriminantes

### Discriminação em Etapas

**Primeiro por Categoria, Depois por Tipo:**
```typescript
type Animal =
  | { categoria: "mamifero"; tipo: "cachorro"; raca: string }
  | { categoria: "mamifero"; tipo: "gato"; pelo: string }
  | { categoria: "ave"; tipo: "papagaio"; envergadura: number }
  | { categoria: "ave"; tipo: "aguia"; velocidade: number };

function descrever(animal: Animal): string {
  switch (animal.categoria) {
    case "mamifero":
      // animal: { categoria: "mamifero"; tipo: "cachorro" | "gato"; ... }
      switch (animal.tipo) {
        case "cachorro":
          return `Cachorro da raça ${animal.raca}`;
        case "gato":
          return `Gato com pelo ${animal.pelo}`;
      }
      break;
    case "ave":
      // animal: { categoria: "ave"; tipo: "papagaio" | "aguia"; ... }
      switch (animal.tipo) {
        case "papagaio":
          return `Papagaio com ${animal.envergadura}cm de envergadura`;
        case "aguia":
          return `Águia com velocidade de ${animal.velocidade}km/h`;
      }
      break;
  }
}
```

**Conceito:** **Hierarquia de discriminação** - narrow progressivamente com switches aninhados.

## 🎯 Aplicabilidade

### Quando Usar Switch com Union

**1. Discriminated Unions:**
```typescript
// ✅ Pattern ideal
type Evento = EventoA | EventoB | EventoC;
switch (evento.tipo) { ... }
```

**2. Union de Literais:**
```typescript
// ✅ Múltiplas opções específicas
type Direcao = "norte" | "sul" | "leste" | "oeste";
switch (direcao) { ... }
```

**3. State Machines:**
```typescript
// ✅ Estados com dados específicos
type Estado = EstadoA | EstadoB | EstadoC;
switch (estado.status) { ... }
```

**4. Reducers/Actions:**
```typescript
// ✅ Pattern Redux/state management
type Acao = AcaoA | AcaoB | AcaoC;
switch (acao.tipo) { ... }
```

### Quando Evitar

**1. Union de Tipos Complexos sem Discriminante:**
```typescript
// ❌ Difícil discriminar
type Complexo = { a: string; b: number } | { c: boolean; d: string };
// Sem propriedade comum, switch não funciona bem
```

**2. Union com Overlapping Properties:**
```typescript
// ❌ Propriedades compartilhadas dificultam narrowing
type Problematico =
  | { tipo: "A"; valor: string; extra: number }
  | { tipo: "B"; valor: number; extra: number };
// 'extra' existe em ambos - não discrimina
```

**3. Poucas Variantes:**
```typescript
// ⚠️ Overkill para 2 variantes
type Simples = "sim" | "nao";
// Ternário ou if-else pode ser mais simples
```

## 🎯 Padrões Recomendados

### Sempre Incluir Exhaustiveness Check

**Pattern Defensivo:**
```typescript
function processar(evento: Evento): void {
  switch (evento.tipo) {
    case "A": break;
    case "B": break;
    case "C": break;
    default:
      const _exhaustive: never = evento;
      throw new Error(`Tipo não tratado: ${_exhaustive}`);
  }
}
```

### Nomear Discriminante como `tipo` ou `kind`

**Convenção:**
```typescript
// ✅ Nomes semânticos claros
type Forma = { tipo: "circulo" } | { tipo: "quadrado" };
type Animal = { kind: "cachorro" } | { kind: "gato" };
type Acao = { type: "INCREMENT" } | { type: "DECREMENT" };  // Inglês comum em Redux
```

### Usar String Literals para Discriminantes

**Preferir Strings:**
```typescript
// ✅ Strings são legíveis em debug
type Evento = { tipo: "click" } | { tipo: "keypress" };

// ⚠️ Numbers menos descritivos
type Estado = { status: 0 } | { status: 1 } | { status: 2 };
```

### Agrupar Variantes Relacionadas

**Organização:**
```typescript
// Eventos de Mouse
type EventoMouse =
  | { tipo: "click"; x: number; y: number }
  | { tipo: "mousemove"; x: number; y: number }
  | { tipo: "mousedown"; botao: number };

// Eventos de Teclado
type EventoTeclado =
  | { tipo: "keypress"; tecla: string }
  | { tipo: "keydown"; tecla: string }
  | { tipo: "keyup"; tecla: string };

// Union de Grupos
type Evento = EventoMouse | EventoTeclado;
```

## ⚠️ Armadilhas Comuns

### 1. Esquecer Narrowing

```typescript
type Forma = { tipo: "circulo"; raio: number } | { tipo: "quadrado"; lado: number };

function calcular(forma: Forma): number {
  // ❌ ERRO: Property 'raio' does not exist on type 'Forma'
  return Math.PI * forma.raio ** 2;

  // ✅ Narrow primeiro
  if (forma.tipo === "circulo") {
    return Math.PI * forma.raio ** 2;
  }
}
```

### 2. Discriminante Não Literal

```typescript
// ❌ Discriminante não é literal - não funciona
type Ruim = { tipo: string; valor: number };

// ✅ Usar literais
type Bom = { tipo: "A"; valor: number } | { tipo: "B"; valor: string };
```

### 3. Propriedades Opcionais como Discriminante

```typescript
// ❌ Discriminante opcional - não confiável
type Problema =
  | { tipo?: "A"; a: string }
  | { tipo?: "B"; b: number };

// ✅ Discriminante obrigatório
type Correto =
  | { tipo: "A"; a: string }
  | { tipo: "B"; b: number };
```

### 4. Múltiplas Variantes com Mesmo Discriminante

```typescript
// ❌ ERRO: Discriminante "A" duplicado
type Invalido =
  | { tipo: "A"; x: number }
  | { tipo: "A"; y: string };  // Mesmo "A"!

// ✅ Discriminantes únicos
type Valido =
  | { tipo: "A"; x: number }
  | { tipo: "B"; y: string };
```

## 📚 Conclusão

**Switch com tipos union** é pattern poderoso do TypeScript que combina switch statement com **discriminated unions** para criar **pattern matching type-safe**. TypeScript **narrow automaticamente** tipo em cada case baseado em propriedade discriminante, garantindo acesso seguro a propriedades específicas de cada variante. Com **exhaustiveness checking** via tipo `never`, compilador força cobertura completa de todos os casos, tornando refatoração segura e previsível.

**Conceitos Fundamentais:**
1. **Type Narrowing:** TypeScript refina union em cada case
2. **Discriminated Union:** Union com propriedade discriminante comum
3. **Discriminante:** Propriedade com literal único por variante
4. **Exhaustiveness:** `never` no default garante cobertura
5. **Pattern Matching:** Switch como match/case funcional
6. **Type Safety:** Compilador previne erros de tipo

**Switch + Union = pattern matching idiomático + type safety + refatoração confiável.**
