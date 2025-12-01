# Exhaustiveness Checking: Garantindo Cobertura Completa

## 🎯 Introdução e Definição

Exhaustiveness checking é **técnica de verificação em compile-time** que garante todos os membros de uma union type sejam tratados em switch statement, usando tipo `never` no `default` para **detectar casos não cobertos**. Conceitualmente, representa **prova de completude**: se switch cobre todos os valores possíveis de union, variável no `default` seria tipo impossível (`never`); se novo valor é adicionado à union sem adicionar case correspondente, compilador detecta **erro de tipo** no default. É fundação para **pattern matching type-safe** e refatoração segura.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Tipo `never`:** Tipo impossível que representa "nunca ocorre"
2. **Default com `never`:** Se todos os cases cobertos, default é inalcançável
3. **Erro de Compilação:** Adicionar valor à union sem case gera erro
4. **Refatoração Segura:** Mudanças em unions detectadas automaticamente
5. **Type Safety:** Compilador força cobertura completa
6. **Pattern Matching:** Equivalente TypeScript a match em linguagens funcionais

**Conceito Central:** Exhaustiveness = **prova de cobertura completa** - compilador garante nenhum caso esquecido.

## 🧠 Fundamentos Teóricos

### Conceito de `never`

**Tipo Impossível:**
```typescript
// never = tipo que nunca tem valores
const x: never = ???  // Impossível atribuir valor
```

**Em Control Flow:**
```typescript
function lancarErro(): never {
  throw new Error("Erro");
  // Nunca retorna normalmente - tipo never
}

function loopInfinito(): never {
  while (true) { }
  // Nunca retorna - tipo never
}
```

**Conceito:** `never` representa **execução que nunca completa** ou **tipo sem valores possíveis**.

### Pattern Básico de Exhaustiveness

**Switch Completo:**
```typescript
type Status = "ativo" | "inativo" | "pendente";

function processar(status: Status): void {
  switch (status) {
    case "ativo":
      console.log("Ativo");
      break;
    case "inativo":
      console.log("Inativo");
      break;
    case "pendente":
      console.log("Pendente");
      break;
    default:
      const _exhaustiveCheck: never = status;
      // Se todos os cases cobertos, status é never aqui
      throw new Error(`Status não tratado: ${_exhaustiveCheck}`);
  }
}
```

**Conceito:** Se todos os valores de `Status` foram tratados, `status` no default tem tipo `never` (impossível alcançar).

### Detectando Casos Faltantes

**Adicionando Novo Valor:**
```typescript
type Status = "ativo" | "inativo" | "pendente" | "arquivado";  // Novo!

function processar(status: Status): void {
  switch (status) {
    case "ativo":
      break;
    case "inativo":
      break;
    case "pendente":
      break;
    default:
      const _exhaustiveCheck: never = status;
      // ERRO: Type '"arquivado"' is not assignable to type 'never'.
      // Compilador detecta que "arquivado" não foi tratado!
  }
}
```

**Conceito:** Compilador **força adicionar case** para novo valor ou corrigir tipo.

## 🔍 Padrões de Implementação

### Helper Function

**Função Reutilizável:**
```typescript
function assertNever(value: never): never {
  throw new Error(`Valor não esperado: ${JSON.stringify(value)}`);
}

type Comando = "start" | "stop" | "pause";

function executar(comando: Comando): void {
  switch (comando) {
    case "start":
      console.log("Iniciando");
      break;
    case "stop":
      console.log("Parando");
      break;
    case "pause":
      console.log("Pausando");
      break;
    default:
      assertNever(comando);  // Reutilizável
  }
}
```

**Vantagem:** Centraliza lógica de erro e tipo de retorno `never`.

### Com Return

**Funções que Retornam:**
```typescript
type Forma = "circulo" | "quadrado" | "triangulo";

function calcularLados(forma: Forma): number {
  switch (forma) {
    case "circulo":
      return 0;
    case "quadrado":
      return 4;
    case "triangulo":
      return 3;
    default:
      const _exhaustive: never = forma;
      throw new Error(`Forma não tratada: ${_exhaustive}`);
  }
}
```

**Conceito:** Default com `never` **após todos os returns** garante cobertura.

### Com Discriminated Unions

**Pattern Poderoso:**
```typescript
type Resultado =
  | { tipo: "sucesso"; dados: string[] }
  | { tipo: "erro"; mensagem: string }
  | { tipo: "carregando"; progresso: number };

function renderizar(resultado: Resultado): string {
  switch (resultado.tipo) {
    case "sucesso":
      return `Dados: ${resultado.dados.join(", ")}`;
    case "erro":
      return `Erro: ${resultado.mensagem}`;
    case "carregando":
      return `Carregando: ${resultado.progresso}%`;
    default:
      const _exhaustive: never = resultado;
      return assertNever(_exhaustive);
  }
}
```

**Conceito:** Discriminante + exhaustiveness = pattern matching type-safe.

## 🔍 Casos Especiais

### Union com `null`/`undefined`

**Incluir na Verificação:**
```typescript
type Opcional = "valor1" | "valor2" | null;

function processar(opcao: Opcional): void {
  switch (opcao) {
    case "valor1":
      break;
    case "valor2":
      break;
    case null:  // Precisa tratar null explicitamente
      break;
    default:
      const _exhaustive: never = opcao;
  }
}
```

### Union com Números

**Funciona Igualmente:**
```typescript
type StatusCode = 200 | 404 | 500;

function tratarStatus(code: StatusCode): string {
  switch (code) {
    case 200:
      return "OK";
    case 404:
      return "Not Found";
    case 500:
      return "Server Error";
    default:
      const _exhaustive: never = code;
      return assertNever(_exhaustive);
  }
}
```

### Union com Boolean

**True e False:**
```typescript
type Flag = true | false;  // Equivalente a boolean

function processar(flag: Flag): void {
  switch (flag) {
    case true:
      break;
    case false:
      break;
    default:
      const _exhaustive: never = flag;
      // Nunca alcançável - boolean só tem true/false
  }
}
```

## 🎯 Refatoração Segura

### Cenário: Adicionando Estado

**Código Original:**
```typescript
type Estado = "aberto" | "fechado";

function atualizar(estado: Estado) {
  switch (estado) {
    case "aberto":
      // ...
      break;
    case "fechado":
      // ...
      break;
    default:
      const _exhaustive: never = estado;
  }
}
```

**Adicionando Novo Estado:**
```typescript
type Estado = "aberto" | "fechado" | "bloqueado";  // Novo!

function atualizar(estado: Estado) {
  switch (estado) {
    case "aberto":
      // ...
      break;
    case "fechado":
      // ...
      break;
    // ERRO de compilação: "bloqueado" não tratado!
    default:
      const _exhaustive: never = estado;
      // Compilador força adicionar case para "bloqueado"
  }
}
```

**Solução (Após Adicionar Case):**
```typescript
function atualizar(estado: Estado) {
  switch (estado) {
    case "aberto":
      break;
    case "fechado":
      break;
    case "bloqueado":  // Novo case
      break;
    default:
      const _exhaustive: never = estado;  // Agora OK
  }
}
```

**Benefício:** Compilador **força atualização** de todos os switches ao mudar union.

### Múltiplos Switches

**Consistência Garantida:**
```typescript
type Comando = "play" | "pause" | "stop";

// Se adicionar novo comando, AMBAS funções exigem atualização
function executarComando(cmd: Comando) {
  switch (cmd) {
    case "play": break;
    case "pause": break;
    case "stop": break;
    default: assertNever(cmd);
  }
}

function obterIcone(cmd: Comando): string {
  switch (cmd) {
    case "play": return "▶️";
    case "pause": return "⏸️";
    case "stop": return "⏹️";
    default: return assertNever(cmd);
  }
}
```

## 🎯 Limitações e Alternativas

### Não Funciona com Tipos Amplos

**String Geral:**
```typescript
function processar(texto: string) {
  switch (texto) {
    case "opcao1":
      break;
    case "opcao2":
      break;
    default:
      // texto: string (não never) - infinitas possibilidades
      // Exhaustiveness não aplicável
  }
}
```

**Conceito:** Exhaustiveness só funciona com **unions finitas de literais**.

### Alternativa: Map/Object

**Lookup Table:**
```typescript
type Status = "ativo" | "inativo" | "pendente";

const mensagens: Record<Status, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente"
  // Se faltar key, compilador detecta
};

function obterMensagem(status: Status): string {
  return mensagens[status];
}
```

**Vantagem:** Compilador exige **todas as keys** de `Status` presentes.

## 🎯 Best Practices

### Sempre Usar em Discriminated Unions

```typescript
// ✅ Pattern padrão
type Evento = EvtA | EvtB | EvtC;

function processar(evento: Evento) {
  switch (evento.tipo) {
    case "A": break;
    case "B": break;
    case "C": break;
    default: assertNever(evento);  // Sempre!
  }
}
```

### Nomear Variável `_exhaustiveCheck`

```typescript
// ✅ Convenção clara
default:
  const _exhaustiveCheck: never = valor;
  throw new Error(`Não tratado: ${_exhaustiveCheck}`);
```

### Combinar com Linter Rules

**ESLint:**
```json
{
  "rules": {
    "@typescript-eslint/switch-exhaustiveness-check": "error"
  }
}
```

**Benefício:** Linter também **verifica exhaustiveness** além do compilador.

## 📚 Conclusão

**Exhaustiveness checking** é técnica poderosa para garantir **cobertura completa** de union types em switch statements, usando tipo `never` no default para detectar casos não tratados. Permite **refatoração segura**: adicionar valores a unions força atualização de todos os switches, prevenindo bugs de casos esquecidos.

**Conceitos Fundamentais:**
1. **`never` no Default:** Se todos os cases cobertos, default é never
2. **Erro de Compilação:** Caso faltante gera erro de tipo
3. **Helper Function:** `assertNever(value: never): never`
4. **Discriminated Unions:** Pattern matching type-safe
5. **Refatoração Segura:** Mudanças detectadas automaticamente
6. **Union Finita:** Só funciona com literais finitos

**Exhaustiveness = segurança de cobertura + refatoração confiável + pattern matching.**
