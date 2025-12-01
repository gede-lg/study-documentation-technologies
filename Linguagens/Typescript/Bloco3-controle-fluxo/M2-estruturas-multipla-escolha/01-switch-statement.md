# Switch Statement: Seleção Múltipla Baseada em Valor

## 🎯 Introdução e Definição

Switch statement é **estrutura de controle de fluxo** que executa diferentes blocos de código baseado no **valor de uma expressão**, permitindo múltiplas condições de forma mais organizada que cascatas de `if-else`. Conceitualmente, representa **pattern matching estrutural**: avalia expressão uma vez e compara resultado com múltiplos casos (`case`), executando bloco correspondente ao primeiro match. Em TypeScript, switch é especialmente poderoso com **discriminated unions** e **exhaustiveness checking**, tornando-se ferramenta essencial para type-safe pattern matching.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Estrutura:** `switch (expressão) { case valor: ... }`
2. **Comparação Estrita:** Usa `===` para comparações
3. **Execução Sequencial:** Casos executam até `break` ou fim
4. **Fall-through:** Comportamento onde execução continua para próximo case
5. **Default Case:** Caso padrão quando nenhum match
6. **Type Narrowing:** TypeScript refina tipos em cada case

**Conceito Central:** Switch = **seleção múltipla organizada** - alternativa limpa a if-else cascata.

## 🧠 Fundamentos Teóricos

### Sintaxe Básica

**Estrutura:**
```typescript
switch (expressão) {
  case valor1:
    // Código executado se expressão === valor1
    break;
  case valor2:
    // Código executado se expressão === valor2
    break;
  default:
    // Código executado se nenhum case corresponder
}
```

**Exemplo Simples:**
```typescript
const dia = 3;

switch (dia) {
  case 1:
    console.log("Segunda-feira");
    break;
  case 2:
    console.log("Terça-feira");
    break;
  case 3:
    console.log("Quarta-feira");  // Executa este
    break;
  case 4:
    console.log("Quinta-feira");
    break;
  case 5:
    console.log("Sexta-feira");
    break;
  default:
    console.log("Fim de semana");
}
// Output: "Quarta-feira"
```

### Comparação Estrita (===)

**Conceito:** Switch usa **strict equality** (`===`) para comparar valores.

```typescript
const valor = "5";

switch (valor) {
  case 5:
    console.log("Número 5");  // NÃO executa
    break;
  case "5":
    console.log("String '5'");  // Executa
    break;
}
```

**Diferença de `==`:**
- Switch usa `===` (tipo E valor)
- `if (valor == 5)` usaria coerção

### Avaliação de Expressão

**Expressão Avaliada Uma Vez:**
```typescript
function obterValor() {
  console.log("Avaliando...");
  return 2;
}

switch (obterValor()) {  // "Avaliando..." impresso UMA vez
  case 1:
    console.log("Um");
    break;
  case 2:
    console.log("Dois");  // Executa
    break;
}
```

**Conceito:** Expressão no `switch` é **avaliada apenas uma vez** no início.

### Expressões em Cases

**Cases Podem Ser Expressões:**
```typescript
const x = 10;

switch (x) {
  case 5 + 5:  // Expressão avaliada
    console.log("Dez");
    break;
  case Math.pow(2, 3):
    console.log("Oito");
    break;
}
```

**Limitação:** Cases devem ser **valores estáticos** ou expressões constantes (não podem referenciar variáveis declaradas depois).

## 🔍 Análise Conceitual Profunda

### Switch vs. If-Else

**Com If-Else Cascata:**
```typescript
const opcao = "B";

if (opcao === "A") {
  console.log("Opção A");
} else if (opcao === "B") {
  console.log("Opção B");
} else if (opcao === "C") {
  console.log("Opção C");
} else {
  console.log("Opção inválida");
}
```

**Com Switch:**
```typescript
const opcao = "B";

switch (opcao) {
  case "A":
    console.log("Opção A");
    break;
  case "B":
    console.log("Opção B");
    break;
  case "C":
    console.log("Opção C");
    break;
  default:
    console.log("Opção inválida");
}
```

**Vantagens do Switch:**
- ✅ Mais legível para múltiplas comparações de igualdade
- ✅ Intenção clara (seleção baseada em valor)
- ✅ Menos repetição (`opcao ===` aparece uma vez)
- ✅ Estrutura visual mais organizada

**Quando Preferir If-Else:**
- Condições complexas (não apenas igualdade)
- Comparações de ranges (`x > 10 && x < 20`)
- Condições baseadas em múltiplas variáveis

### Switch com Strings

**Pattern Comum:**
```typescript
type Comando = "start" | "stop" | "pause" | "resume";

function executarComando(comando: Comando) {
  switch (comando) {
    case "start":
      console.log("Iniciando...");
      break;
    case "stop":
      console.log("Parando...");
      break;
    case "pause":
      console.log("Pausando...");
      break;
    case "resume":
      console.log("Retomando...");
      break;
  }
}
```

**Case-Sensitive:**
```typescript
const cmd = "START";

switch (cmd) {
  case "start":  // NÃO match
    break;
  case "START":  // Match
    break;
}
```

### Switch com Numbers

**Seleção Numérica:**
```typescript
const statusCode = 404;

switch (statusCode) {
  case 200:
    console.log("OK");
    break;
  case 201:
    console.log("Created");
    break;
  case 400:
    console.log("Bad Request");
    break;
  case 404:
    console.log("Not Found");  // Executa
    break;
  case 500:
    console.log("Server Error");
    break;
}
```

### Return em Switch

**Eliminar `break` com `return`:**
```typescript
function obterNomeDia(dia: number): string {
  switch (dia) {
    case 1:
      return "Domingo";
    case 2:
      return "Segunda";
    case 3:
      return "Terça";
    case 4:
      return "Quarta";
    case 5:
      return "Quinta";
    case 6:
      return "Sexta";
    case 7:
      return "Sábado";
    default:
      return "Dia inválido";
  }
  // Sem 'break' necessário - return sai da função
}
```

**Conceito:** `return` **sai da função**, tornando `break` desnecessário.

## 🎯 Switch com Tipos TypeScript

### Type Narrowing Automático

**Com Discriminated Unions:**
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
      console.log(`Posição: ${evento.posicao}`);
      break;
  }
}
```

**Conceito:** TypeScript **narrow tipo automaticamente** em cada case baseado no discriminante.

### Com String Literals

**Union de Literais:**
```typescript
type Status = "ativo" | "inativo" | "pendente";

function obterCor(status: Status): string {
  switch (status) {
    case "ativo":
      return "verde";
    case "inativo":
      return "vermelho";
    case "pendente":
      return "amarelo";
  }
}
```

## 🎯 Aplicabilidade

### Quando Usar Switch

**1. Múltiplas Comparações de Igualdade:**
```typescript
switch (codigoErro) {
  case 400: return "Bad Request";
  case 401: return "Unauthorized";
  case 403: return "Forbidden";
  case 404: return "Not Found";
  case 500: return "Server Error";
}
```

**2. Pattern Matching com Discriminated Unions:**
```typescript
type Forma =
  | { tipo: "circulo"; raio: number }
  | { tipo: "quadrado"; lado: number }
  | { tipo: "retangulo"; largura: number; altura: number };

function calcularArea(forma: Forma): number {
  switch (forma.tipo) {
    case "circulo":
      return Math.PI * forma.raio ** 2;
    case "quadrado":
      return forma.lado ** 2;
    case "retangulo":
      return forma.largura * forma.altura;
  }
}
```

**3. Estado de Máquina:**
```typescript
type EstadoJogo = "menu" | "jogando" | "pausado" | "fim";

function renderizar(estado: EstadoJogo) {
  switch (estado) {
    case "menu":
      renderizarMenu();
      break;
    case "jogando":
      renderizarJogo();
      break;
    case "pausado":
      renderizarPausa();
      break;
    case "fim":
      renderizarFim();
      break;
  }
}
```

**4. Comandos/Actions:**
```typescript
type Acao =
  | { tipo: "INCREMENTAR" }
  | { tipo: "DECREMENTAR" }
  | { tipo: "RESETAR" }
  | { tipo: "DEFINIR"; valor: number };

function reducer(estado: number, acao: Acao): number {
  switch (acao.tipo) {
    case "INCREMENTAR":
      return estado + 1;
    case "DECREMENTAR":
      return estado - 1;
    case "RESETAR":
      return 0;
    case "DEFINIR":
      return acao.valor;
  }
}
```

### Quando Evitar Switch

**1. Poucas Condições:**
```typescript
// ❌ Overkill para 2 casos
switch (tipo) {
  case "A": return 1;
  case "B": return 2;
}

// ✅ Melhor com ternário ou if
return tipo === "A" ? 1 : 2;
```

**2. Condições Complexas:**
```typescript
// ❌ Switch não suporta ranges/complexidade
switch (idade) {
  case idade > 18: ...  // ERRO - case espera valor, não booleano
}

// ✅ Usar if-else
if (idade < 18) {
  // ...
} else if (idade < 65) {
  // ...
} else {
  // ...
}
```

**3. Condições Não-Exclusivas:**
```typescript
// Se múltiplas condições podem ser verdadeiras simultaneamente,
// if-else é mais apropriado
```

## 🎯 Padrões Recomendados

### Sempre Incluir `default`

```typescript
// ✅ Com default (defesa)
switch (valor) {
  case 1:
    break;
  case 2:
    break;
  default:
    throw new Error("Valor inesperado");
}
```

### Usar `return` em Funções

```typescript
// ✅ Return elimina necessidade de break
function mapear(tipo: string): number {
  switch (tipo) {
    case "A": return 1;
    case "B": return 2;
    default: return 0;
  }
}
```

### Consistência de Estilo

```typescript
// ✅ Consistente - todos com break ou todos com return
switch (x) {
  case 1:
    console.log("Um");
    break;
  case 2:
    console.log("Dois");
    break;
}
```

## ⚠️ Armadilhas Comuns

### 1. Esquecer `break` (Fall-through Não Intencional)

```typescript
// ❌ Bug - executa múltiplos cases
switch (opcao) {
  case "A":
    console.log("A");
    // Faltou break - continua para "B"
  case "B":
    console.log("B");  // Executa também se opcao === "A"
    break;
}
```

### 2. Comparação de Tipo

```typescript
const valor = "5";

switch (valor) {
  case 5:  // NUNCA match - string !== number
    break;
}
```

### 3. Variáveis em Block Scope

```typescript
// ❌ ERRO - redeclaração
switch (x) {
  case 1:
    const y = 10;
    break;
  case 2:
    const y = 20;  // ERRO: Cannot redeclare block-scoped variable 'y'
    break;
}

// ✅ Usar blocos
switch (x) {
  case 1: {
    const y = 10;
    break;
  }
  case 2: {
    const y = 20;
    break;
  }
}
```

## 📚 Conclusão

**Switch statement** é estrutura de controle para **seleção múltipla** baseada em valor de expressão, oferecendo alternativa organizada a if-else cascata. Em TypeScript, ganha poder adicional com **type narrowing automático** em discriminated unions, tornando-se ferramenta essencial para pattern matching type-safe.

**Conceitos Fundamentais:**
1. **`switch (expr)`:** Avalia expressão uma vez
2. **`case valor:`:** Compara com `===`
3. **`break`:** Sai do switch
4. **`default`:** Caso padrão
5. **Type Narrowing:** TypeScript refina tipos em cada case
6. **Exhaustiveness:** Verificar cobertura de todos os casos

**Switch = pattern matching estrutural + type safety + código organizado.**
