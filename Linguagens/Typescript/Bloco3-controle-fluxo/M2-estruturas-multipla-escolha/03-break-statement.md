# Break Statement: Interrompendo Execução no Switch

## 🎯 Introdução e Definição

Break statement é **comando de controle de fluxo** que **interrompe imediatamente** a execução do switch, saltando para primeira instrução após o bloco switch. Conceitualmente, representa **ponto de saída explícito** que previne fall-through (execução contínua para próximos cases): sem `break`, execução **continua sequencialmente** através de todos os cases seguintes até encontrar `break`, `return` ou fim do switch. Break é essencial para comportamento esperado de switch, onde normalmente apenas um case deve executar.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Interrupção Imediata:** Para execução e sai do switch
2. **Previne Fall-through:** Sem break, execução continua
3. **Sintaxe:** Palavra-chave `break;` dentro de case
4. **Alternativas:** `return`, `throw` também saem
5. **Intencional vs. Acidental:** Fall-through pode ser bug ou feature
6. **Escopo:** Break sai do switch mais próximo

**Conceito Central:** Break = **ponto de saída** - sem ele, casos "caem" para próximos.

## 🧠 Fundamentos Teóricos

### Comportamento Padrão Sem Break

**Fall-Through Acidental:**
```typescript
const x = 1;

switch (x) {
  case 1:
    console.log("Um");
    // SEM break - continua para case 2
  case 2:
    console.log("Dois");  // Também executa!
    // SEM break - continua para case 3
  case 3:
    console.log("Três");  // Também executa!
    break;
}

// Output:
// "Um"
// "Dois"
// "Três"
```

**Conceito:** Sem `break`, execução **não para** - continua sequencialmente.

### Com Break Correto

**Comportamento Esperado:**
```typescript
const x = 1;

switch (x) {
  case 1:
    console.log("Um");
    break;  // Para aqui
  case 2:
    console.log("Dois");
    break;
  case 3:
    console.log("Três");
    break;
}

// Output:
// "Um"
```

**Conceito:** Break **interrompe switch** imediatamente após executar case.

### Sintaxe de Break

**Estrutura:**
```typescript
case valor:
  // Código do case
  break;  // Sai do switch
```

**Posicionamento:**
- Geralmente **última instrução** do case
- Pode aparecer em qualquer ponto (sai imediatamente)

### Break em Blocos Aninhados

**Sai Apenas do Switch Mais Próximo:**
```typescript
for (let i = 0; i < 3; i++) {
  switch (i) {
    case 0:
      console.log("Zero");
      break;  // Sai do SWITCH, não do FOR
    case 1:
      console.log("Um");
      break;
  }
  console.log("Continua loop");
}

// Output:
// "Zero"
// "Continua loop"
// "Um"
// "Continua loop"
// "Continua loop"
```

**Conceito:** Break sai **apenas do switch**, não de estruturas externas.

## 🔍 Fall-Through Intencional

### Múltiplos Cases Compartilhando Código

**Pattern Válido:**
```typescript
const dia = 6;

switch (dia) {
  case 1:
  case 2:
  case 3:
  case 4:
  case 5:
    console.log("Dia útil");
    break;  // Break APÓS todos os cases agrupados
  case 6:
  case 7:
    console.log("Fim de semana");
    break;
}
```

**Conceito:** Fall-through **intencional** permite agrupar cases com mesmo comportamento.

### Comentar Fall-Through Intencional

**Best Practice:**
```typescript
switch (x) {
  case 1:
    fazAlgo();
    // FALL-THROUGH intencional
  case 2:
    fazOutraCoisa();
    break;
}
```

**Razão:** Documenta que ausência de break é **proposital**, não bug.

## 🔍 Alternativas ao Break

### Return em Funções

**Elimina Necessidade de Break:**
```typescript
function obterNomeMes(mes: number): string {
  switch (mes) {
    case 1:
      return "Janeiro";  // Return sai da função
    case 2:
      return "Fevereiro";
    case 3:
      return "Março";
    default:
      return "Mês inválido";
  }
  // Sem break necessário - return já sai
}
```

**Conceito:** `return` **sai da função inteira**, tornando break redundante.

### Throw para Exceções

**Lançar Erro:**
```typescript
switch (tipo) {
  case "valido1":
    processar();
    break;
  case "valido2":
    processar();
    break;
  default:
    throw new Error("Tipo inválido");  // Throw sai (lança exceção)
}
```

**Conceito:** `throw` **lança exceção e sai**, sem precisar de break.

### Continue em Loops

**Não Funciona em Switch:**
```typescript
// ❌ Continue não afeta switch (apenas loops)
switch (x) {
  case 1:
    continue;  // ERRO (ou sem efeito se dentro de loop)
}
```

**Conceito:** `continue` é para loops, não switches.

## 🎯 Break vs. Return

### Em Funções: Preferir Return

**Com Break:**
```typescript
function processar(x: number): void {
  switch (x) {
    case 1:
      console.log("Um");
      break;
    case 2:
      console.log("Dois");
      break;
  }
  // Execução continua aqui após switch
  console.log("Fim");
}
```

**Com Return:**
```typescript
function processar(x: number): void {
  switch (x) {
    case 1:
      console.log("Um");
      return;  // Sai da função
    case 2:
      console.log("Dois");
      return;
  }
  console.log("Fim");  // Pode ser executado se nenhum case match
}
```

**Diferença:**
- Break: Sai do switch, **continua função**
- Return: Sai do switch **E da função**

### Retornando Valores

**Return Obrigatório:**
```typescript
function mapear(tipo: string): number {
  switch (tipo) {
    case "A":
      return 1;  // Retorna valor e sai
    case "B":
      return 2;
    default:
      return 0;
  }
  // Sem break necessário
}
```

## 🎯 Break em Switches Aninhados

### Switch Dentro de Switch

**Cada Switch Precisa de Breaks:**
```typescript
switch (x) {
  case 1:
    switch (y) {
      case "A":
        console.log("1-A");
        break;  // Sai do switch interno
      case "B":
        console.log("1-B");
        break;
    }
    break;  // Sai do switch externo
  case 2:
    console.log("2");
    break;
}
```

**Conceito:** Cada switch é **independente** - break sai apenas do switch imediato.

### Labels (Avançado - Raro)

**Break com Label:**
```typescript
outerSwitch: switch (x) {
  case 1:
    switch (y) {
      case "A":
        break outerSwitch;  // Sai do switch EXTERNO
      case "B":
        break;  // Sai apenas do interno
    }
    console.log("Ainda no case 1");
    break;
}
```

**Conceito:** Labels permitem break **específico** de switch externo, mas padrão é raro.

## 🎯 Padrões e Anti-Padrões

### ✅ Break em Todos os Cases

**Padrão Padrão:**
```typescript
switch (x) {
  case 1:
    fazAlgo();
    break;
  case 2:
    fazOutro();
    break;
  default:
    fazPadrao();
    break;
}
```

### ✅ Return em Funções

**Mais Limpo:**
```typescript
function processar(x: number): string {
  switch (x) {
    case 1: return "Um";
    case 2: return "Dois";
    default: return "Outro";
  }
}
```

### ⚠️ Fall-Through Intencional Comentado

**Aceitável se Documentado:**
```typescript
switch (x) {
  case 1:
    fazAlgo();
    // FALL-THROUGH: cases 1 e 2 processam juntos
  case 2:
    fazAmbos();
    break;
}
```

### ❌ Fall-Through Acidental

**Bug Comum:**
```typescript
// ❌ Esqueceu break - bug!
switch (status) {
  case "ativo":
    ativar();
    // BUG: faltou break - executa "inativo" também
  case "inativo":
    desativar();
    break;
}
```

## 🎯 TypeScript e Break

### Type Safety Não Afetado

**Break Não Muda Tipos:**
```typescript
type Status = "ativo" | "inativo";

function processar(status: Status) {
  switch (status) {
    case "ativo":
      // status: "ativo"
      console.log("Ativo");
      break;  // Apenas sai, tipo não muda
    case "inativo":
      // status: "inativo"
      console.log("Inativo");
      break;
  }
}
```

**Conceito:** Break é **controle de fluxo runtime**, não afeta type narrowing.

### Exhaustiveness Checking

**Break Necessário para Cobrir Todos os Cases:**
```typescript
type Comando = "start" | "stop" | "pause";

function executar(cmd: Comando): void {
  switch (cmd) {
    case "start":
      iniciar();
      break;  // Sem break, cai em "stop"
    case "stop":
      parar();
      break;
    case "pause":
      pausar();
      break;
    // Se esquecer break, pode executar múltiplos comandos
  }
}
```

## ⚠️ Armadilhas Comuns

### 1. Esquecer Break

```typescript
// ❌ Bug clássico
switch (x) {
  case 1:
    console.log("Um");
    // Faltou break!
  case 2:
    console.log("Dois");  // Executa se x === 1 OU x === 2
}
```

### 2. Break em Condição

```typescript
// ❌ Break pode não executar
switch (x) {
  case 1:
    if (condicao) {
      break;  // Sai apenas se condição true
    }
    fazAlgo();  // Pode executar e cair no próximo case
  case 2:
    fazOutro();
}
```

### 3. Default Sem Break

```typescript
// ❌ Se default não for último
switch (x) {
  case 1:
    break;
  default:
    console.log("Default");
    // Faltou break - cai em case 2!
  case 2:
    console.log("Dois");
}
```

### 4. Break em Loop Interno

```typescript
// ❌ Não sai do loop, apenas do switch
for (let i = 0; i < 10; i++) {
  switch (i) {
    case 5:
      break;  // Sai do SWITCH, NÃO do FOR
  }
}
```

## 📚 Conclusão

**Break statement** é comando essencial em switch para **interromper execução** e prevenir fall-through não intencional. Sem break, execução **continua sequencialmente** através de cases seguintes. Alternativas incluem `return` (em funções) e `throw` (para exceções), que também saem do switch.

**Conceitos Fundamentais:**
1. **`break;`:** Sai imediatamente do switch
2. **Sem Break:** Fall-through - continua para próximo case
3. **Intencional:** Múltiplos cases compartilham código
4. **Alternativas:** `return`, `throw` também saem
5. **Escopo:** Sai apenas do switch mais próximo
6. **Best Practice:** Sempre incluir break OU comentar fall-through

**Break = controle explícito de saída + prevenção de bugs de fall-through.**
