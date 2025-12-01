# Case e Default: Labels de Seleção no Switch

## 🎯 Introdução e Definição

`case` e `default` são **labels de seleção** dentro de switch statement que marcam **blocos de código a executar** baseado em valores específicos (`case`) ou quando nenhum match ocorre (`default`). Conceitualmente, `case` representa **condição específica** ("se expressão === este valor") enquanto `default` é **fallback** ("senão, execute isto"). Em TypeScript, cases trabalham com type narrowing para refinar tipos automaticamente, e default garante **cobertura completa** de possibilidades, sendo essencial para exhaustiveness checking.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **`case valor:`:** Label para valor específico
2. **`default:`:** Label para caso sem match
3. **Ordem:** Cases testados sequencialmente
4. **Múltiplos Cases:** Mesmo código para vários valores
5. **Blocos:** Cases podem ter blocos `{}` para escopo
6. **Optional Default:** Default não é obrigatório mas recomendado

**Conceito Central:** Case = condição específica; Default = catch-all para valores não tratados.

## 🧠 Fundamentos Teóricos

### Sintaxe de Case

**Estrutura Básica:**
```typescript
case valor:
  // Código executado se expressão === valor
  break;
```

**Exemplo:**
```typescript
const dia = 2;

switch (dia) {
  case 1:
    console.log("Segunda");
    break;
  case 2:
    console.log("Terça");  // Executa
    break;
  case 3:
    console.log("Quarta");
    break;
}
```

**Conceito:** Case **marca ponto de entrada** onde execução começa se valor corresponder.

### Sintaxe de Default

**Estrutura:**
```typescript
default:
  // Código executado se nenhum case corresponder
```

**Exemplo:**
```typescript
const opcao = "Z";

switch (opcao) {
  case "A":
    console.log("Opção A");
    break;
  case "B":
    console.log("Opção B");
    break;
  default:
    console.log("Opção desconhecida");  // Executa
}
```

**Conceito:** Default é **fallback** quando nenhum case faz match.

### Default Opcional mas Recomendado

**Sem Default:**
```typescript
const x = 5;

switch (x) {
  case 1:
    console.log("Um");
    break;
  case 2:
    console.log("Dois");
    break;
  // Sem default - nada acontece se x === 5
}
```

**Com Default (Defensivo):**
```typescript
const x = 5;

switch (x) {
  case 1:
    console.log("Um");
    break;
  case 2:
    console.log("Dois");
    break;
  default:
    console.log("Valor inesperado");  // Executa
}
```

**Recomendação:** Sempre incluir `default` para **capturar valores inesperados**.

## 🔍 Múltiplos Cases para Mesmo Código

### Fall-Through Intencional

**Pattern Comum:**
```typescript
const dia = 6;

switch (dia) {
  case 1:
  case 2:
  case 3:
  case 4:
  case 5:
    console.log("Dia útil");
    break;
  case 6:
  case 7:
    console.log("Fim de semana");  // Executa
    break;
}
```

**Conceito:** Múltiplos cases **sem `break`** compartilham mesmo bloco de código.

### Com Type Narrowing

**Discriminated Unions:**
```typescript
type Forma =
  | { tipo: "circulo"; raio: number }
  | { tipo: "quadrado"; lado: number }
  | { tipo: "retangulo"; largura: number; altura: number };

function obterDescricao(forma: Forma): string {
  switch (forma.tipo) {
    case "circulo":
      return `Círculo de raio ${forma.raio}`;
    case "quadrado":
    case "retangulo":
      // forma: { tipo: "quadrado" } | { tipo: "retangulo" }
      // Pode acessar propriedades comuns, mas não específicas
      return "Forma com lados retos";
  }
}
```

**Limitação:** Type narrowing com múltiplos cases resulta em **union dos tipos**, não tipo específico.

## 🔍 Posição do Default

### Default no Final (Convenção)

**Idiomático:**
```typescript
switch (valor) {
  case 1:
    break;
  case 2:
    break;
  default:  // Final (convenção)
    break;
}
```

### Default no Meio (Possível mas Não Idiomático)

**Tecnicamente Válido:**
```typescript
switch (valor) {
  case 1:
    break;
  default:  // Meio (funciona mas confuso)
    break;
  case 2:
    break;
}
```

**Conceito:** Default pode estar **em qualquer posição**, mas convenção é **no final**.

**Comportamento:** Default executa **apenas se nenhum case match**, independente da posição.

### Default no Início (Raro)

```typescript
switch (valor) {
  default:  // Início
    console.log("Padrão");
    break;
  case 1:
    console.log("Um");
    break;
}
```

**Funciona mas:** Viola convenção; dificulta leitura.

## 🔍 Blocos de Escopo em Cases

### Sem Blocos (Escopo Compartilhado)

**Problema:**
```typescript
switch (x) {
  case 1:
    const y = 10;
    console.log(y);
    break;
  case 2:
    const y = 20;  // ERRO: Cannot redeclare block-scoped variable 'y'
    console.log(y);
    break;
}
```

**Conceito:** Todo switch é **um bloco único** - variáveis são visíveis em todos os cases.

### Com Blocos (Escopo Isolado)

**Solução:**
```typescript
switch (x) {
  case 1: {
    const y = 10;
    console.log(y);
    break;
  }
  case 2: {
    const y = 20;  // OK - escopo diferente
    console.log(y);
    break;
  }
}
```

**Conceito:** Chaves `{}` criam **novo bloco de escopo**, isolando variáveis.

### Quando Usar Blocos

**Necessário se:**
- Declarar variáveis com `let`/`const` em múltiplos cases
- Precisar de escopo isolado
- Evitar conflitos de nomes

**Não necessário se:**
- Usar apenas `return` (sai da função)
- Não declarar variáveis
- Cases muito simples

## 🎯 Case com Expressões

### Expressões Constantes

**Avaliadas em Compile-Time:**
```typescript
const VALOR_A = 10;
const VALOR_B = 20;

switch (x) {
  case VALOR_A:
    break;
  case VALOR_B:
    break;
  case VALOR_A + VALOR_B:  // 30
    break;
}
```

**Conceito:** Cases podem usar **expressões constantes** avaliadas em compile-time.

### Limitações

**Não Pode Usar Variáveis Mutáveis:**
```typescript
let dinamico = 10;

switch (x) {
  case dinamico:  // OK mas valor é avaliado no switch, não no case
    break;
}
```

**Conceito:** Cases aceitam expressões mas são **comparadas em runtime** com `===`.

## 🎯 Default para Erro/Exceção

### Pattern Defensivo

**Lançar Erro:**
```typescript
type Status = "ativo" | "inativo" | "pendente";

function processar(status: Status): void {
  switch (status) {
    case "ativo":
      console.log("Processando ativo");
      break;
    case "inativo":
      console.log("Processando inativo");
      break;
    case "pendente":
      console.log("Processando pendente");
      break;
    default:
      // Nunca deve acontecer se Status está correto
      throw new Error(`Status desconhecido: ${status}`);
  }
}
```

**Conceito:** Default pode **detectar valores inválidos** que passaram pelas verificações de tipo.

### Com Exhaustiveness Checking

**Pattern com `never`:**
```typescript
type Comando = "iniciar" | "pausar" | "parar";

function executar(comando: Comando): void {
  switch (comando) {
    case "iniciar":
      break;
    case "pausar":
      break;
    case "parar":
      break;
    default:
      const _exhaustive: never = comando;
      throw new Error(`Comando não tratado: ${_exhaustive}`);
  }
}
```

**Conceito:** Se todos os cases cobertos, `comando` é `never` no default - **erro de compilação** se novo valor adicionado a union.

## 🎯 Aplicabilidade

### Quando Usar Múltiplos Cases

**1. Agrupamento Lógico:**
```typescript
function ehDiaUtil(dia: number): boolean {
  switch (dia) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return true;
    case 6:
    case 7:
      return false;
    default:
      throw new Error("Dia inválido");
  }
}
```

**2. Aliases de Valores:**
```typescript
const SUCCESS_200 = 200;
const SUCCESS_201 = 201;
const SUCCESS_204 = 204;

switch (statusCode) {
  case SUCCESS_200:
  case SUCCESS_201:
  case SUCCESS_204:
    console.log("Sucesso");
    break;
}
```

### Quando Usar Default

**1. Catch-All:**
```typescript
switch (opcao) {
  case "A":
  case "B":
  case "C":
    // Casos esperados
    break;
  default:
    // Qualquer outra opção
    console.log("Opção não reconhecida");
}
```

**2. Defesa contra Valores Inesperados:**
```typescript
switch (tipoRecebido) {
  case "esperado1":
    break;
  case "esperado2":
    break;
  default:
    // Valor inesperado - registrar ou lançar erro
    logger.error(`Tipo inesperado: ${tipoRecebido}`);
    throw new Error("Tipo inválido");
}
```

## ⚠️ Armadilhas Comuns

### 1. Esquecer Break Entre Cases

```typescript
// ❌ Bug - fall-through não intencional
switch (x) {
  case 1:
    console.log("Um");
    // Faltou break - continua para case 2
  case 2:
    console.log("Dois");  // Executa também se x === 1
    break;
}
```

### 2. Default sem Break

```typescript
// ❌ Se default no meio, faltaria break
switch (x) {
  case 1:
    break;
  default:
    console.log("Default");
    // Faltou break - continua para case 2 se default executar
  case 2:
    console.log("Dois");
    break;
}
```

**Solução:** Colocar default no final OU incluir `break`.

### 3. Variáveis Sem Blocos

```typescript
// ❌ Erro de escopo
switch (x) {
  case 1:
    const y = 10;
    break;
  case 2:
    const y = 20;  // ERRO: redeclaração
    break;
}
```

**Solução:** Usar blocos `{}` em cada case.

## 📚 Conclusão

**Case e default** são labels fundamentais do switch statement: `case` marca **pontos de entrada** para valores específicos; `default` fornece **fallback** para valores não tratados. Em TypeScript, cases trabalham com type narrowing e default é essencial para exhaustiveness checking, garantindo código defensivo e type-safe.

**Conceitos Fundamentais:**
1. **`case valor:`:** Label para valor específico (comparação `===`)
2. **`default:`:** Fallback quando nenhum case match
3. **Múltiplos Cases:** Compartilhar código com fall-through intencional
4. **Blocos:** Usar `{}` para escopo isolado
5. **Default Defensivo:** Sempre incluir para detectar valores inesperados
6. **Posição:** Default convencionalmente no final

**Case + Default = cobertura completa + código defensivo.**
