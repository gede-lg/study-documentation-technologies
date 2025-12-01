# Mensagens de Erro Descritivas

## 🎯 Introdução e Definição

### Definição Conceitual

**Mensagens de erro descritivas** são **textos explicativos** que comunicam **claramente** o problema ocorrido, **contexto** em que ocorreu, **causa** (quando possível) e **ação sugerida** para resolver. Mensagens descritivas transformam erros de **notificações crípticas** ("Error 500", "Invalid input") em **comunicações úteis** ("Email 'abc' é inválido: deve conter @ e domínio válido. Use formato usuario@dominio.com").

Conceitualmente, mensagens descritivas implementam **user-centric error communication** - escrevem erros pensando em quem vai **ler** (desenvolvedor debugando, usuário final, sistema de monitoring). Boa mensagem responde: **O que aconteceu?** (problema), **Por que aconteceu?** (causa), **Onde aconteceu?** (contexto), **Como resolver?** (ação sugerida). Mensagens genéricas como "Error" ou "Invalid" **falham** nestes critérios - não fornecem informação acionável.

TypeScript não **força** mensagens descritivas - `message` é apenas `string`. Porém, **type system** pode ser usado para garantir mensagens seguem **padrões** através de template literals, enums ou factory methods que constroem mensagens consistentemente. Custom error classes podem **encapsular lógica** de formatação de mensagem baseada em properties do erro.

### Contexto Histórico e Evolução

**Early Computing (1950s-1970s):** Mensagens crípticas - "SYNTAX ERROR", "I/O ERROR 07".

**Unix/C (1970s-1980s):** Mensagens mais descritivas - `perror()` imprime mensagem de erro do sistema.

**Windows (1990s):** Error codes numéricos - usuário precisava buscar código em documentação.

**Web Era (2000s):** HTTP status codes + mensagens - "404 Not Found", "500 Internal Server Error".

**Modern APIs (2010s+):** Mensagens ricas com contexto - JSON error responses com campos detalhados.

**Developer Experience Focus (2020s):** Mensagens pensadas para **DX** - frameworks como Rust, Elm, TypeScript fornecem mensagens extremamente descritivas.

**Evolução de qualidade:**

**Ruim (críptico):**
```typescript
throw new Error("Error");
throw new Error("Invalid");
throw new Error("Failed");
```

**Melhor (específico):**
```typescript
throw new Error("Email is invalid");
throw new Error("Database connection failed");
throw new Error("User not found");
```

**Ótimo (descritivo com contexto):**
```typescript
throw new Error("Email 'abc' is invalid: missing @ symbol. Expected format: user@domain.com");
throw new Error("Database connection failed: timeout after 30s connecting to postgres://localhost:5432");
throw new Error("User with ID 123 not found in database 'users'");
```

**Excelente (com ação sugerida):**
```typescript
throw new Error("Email 'abc' is invalid: missing @ symbol. Use format: user@domain.com. Example: john@example.com");
throw new Error("Database connection failed: timeout after 30s. Check if PostgreSQL is running on localhost:5432 and accepting connections.");
throw new Error("User with ID 123 not found. Verify user exists or create new user first.");
```

### Problema Fundamental que Resolve

Mensagens descritivas resolvem o problema de **lack of actionable information** em erros genéricos.

**Problema: Mensagens genéricas - sem contexto**
```typescript
// ❌ Mensagens inúteis
function validarEmail(email: string) {
  if (!email.includes("@")) {
    throw new Error("Invalid");  // O que é inválido?
  }
}

function buscarUsuario(id: number) {
  const usuario = database.find(id);
  if (!usuario) {
    throw new Error("Not found");  // O que não foi encontrado?
  }
  return usuario;
}

try {
  validarEmail("abc");
} catch (e) {
  console.log(e.message);  // "Invalid"
  // ❌ Qual campo é inválido?
  // ❌ Por que é inválido?
  // ❌ Como corrigir?
  // ❌ Sem informação acionável!
}

try {
  buscarUsuario(999);
} catch (e) {
  console.log(e.message);  // "Not found"
  // ❌ Usuário não encontrado? Produto? Pedido?
  // ❌ Qual ID foi buscado?
  // ❌ Em qual database/tabela?
}
```

**Solução: Mensagens descritivas com contexto**
```typescript
// ✅ Mensagens úteis
function validarEmail(email: string) {
  if (!email.includes("@")) {
    throw new Error(
      `Email '${email}' é inválido: falta símbolo @. ` +
      `Use formato usuario@dominio.com (ex: joao@example.com)`
    );
  }
  
  const [local, domain] = email.split("@");
  if (!domain.includes(".")) {
    throw new Error(
      `Email '${email}' é inválido: domínio '${domain}' não contém ponto. ` +
      `Use formato usuario@dominio.com (ex: joao@example.com)`
    );
  }
}

function buscarUsuario(id: number) {
  const usuario = database.find(id);
  if (!usuario) {
    throw new Error(
      `Usuário com ID ${id} não encontrado no database 'users'. ` +
      `Verifique se ID existe ou crie novo usuário primeiro.`
    );
  }
  return usuario;
}

try {
  validarEmail("abc");
} catch (e) {
  console.log(e.message);
  // "Email 'abc' é inválido: falta símbolo @. Use formato usuario@dominio.com..."
  // ✅ Sabe qual valor é inválido: 'abc'
  // ✅ Sabe por que: falta @
  // ✅ Sabe como corrigir: formato correto + exemplo
}

try {
  buscarUsuario(999);
} catch (e) {
  console.log(e.message);
  // "Usuário com ID 999 não encontrado no database 'users'..."
  // ✅ Sabe o que não foi encontrado: Usuário
  // ✅ Sabe qual ID: 999
  // ✅ Sabe onde buscou: database 'users'
  // ✅ Sabe próximos passos: verificar ID ou criar usuário
}
```

**Fundamento teórico:** Mensagens descritivas fornecem **actionable information** - contexto suficiente para **entender** e **resolver** problema.

### Importância no Ecossistema

Mensagens descritivas são cruciais porque:

- **Developer Experience:** Debugging rápido - erro explica problema
- **User Experience:** Usuários entendem o que aconteceu
- **Monitoring:** Logs úteis para tracking de problemas
- **Debugging:** Stack trace + mensagem descritiva = contexto completo
- **Documentation:** Mensagens documentam validações e regras
- **Error Recovery:** Mensagens sugerem como resolver
- **Communication:** Ponte entre sistema e humano

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Clarity:** Mensagem clara sobre o problema
2. **Context:** Inclui valores que causaram erro
3. **Cause:** Explica por que erro ocorreu
4. **Action:** Sugere como resolver
5. **Specificity:** Específica, não genérica

### Pilares Fundamentais

- **User-Centric:** Escrita pensando no leitor
- **Actionable:** Informação permite ação
- **Complete:** Responde: o que, por que, onde, como
- **Consistent:** Formato consistente entre erros
- **Helpful:** Ajuda resolver, não apenas notifica

### Visão Geral das Nuances

- **Template Literals:** Interpolação de valores
- **Error Context:** Valores que causaram problema
- **Suggested Actions:** O que fazer para resolver
- **Examples:** Exemplos de valores válidos
- **Formatting:** Formatação legível

## 🧠 Fundamentos Teóricos

### Basic Descriptive Message

```typescript
// ❌ Ruim - genérico
throw new Error("Invalid input");

// ✅ Bom - específico
throw new Error("Email is invalid");

// ✅ Melhor - com contexto
throw new Error(`Email '${email}' is invalid: missing @ symbol`);

// ✅ Ótimo - com contexto + sugestão
throw new Error(
  `Email '${email}' is invalid: missing @ symbol. ` +
  `Expected format: user@domain.com`
);
```

**Análise profunda:**

**Progressão de qualidade:**
1. **Generic:** "Invalid input" - sem contexto
2. **Specific:** "Email is invalid" - sabe qual campo
3. **Contextual:** Inclui valor que falhou
4. **Actionable:** Sugere formato correto

**Fundamento teórico:** Cada nível adiciona **informação útil** para resolver problema.

### Message with Template Literals

```typescript
function validarIdade(idade: number, min: number, max: number) {
  if (idade < min || idade > max) {
    throw new Error(
      `Idade ${idade} está fora do intervalo permitido [${min}, ${max}]. ` +
      `Por favor forneça idade entre ${min} e ${max} anos.`
    );
  }
}

try {
  validarIdade(150, 0, 120);
} catch (e) {
  console.log(e.message);
  // "Idade 150 está fora do intervalo permitido [0, 120].
  //  Por favor forneça idade entre 0 e 120 anos."
}
```

**Conceito fundamental:** **Template literals** permitem interpolação de valores - mensagem **dinâmica** baseada em contexto.

### Princípios e Conceitos Subjacentes

#### Message Format Pattern

```typescript
// Padrão: [WHAT] [WHY] [HOW]

// WHAT: O que aconteceu
// WHY: Por que aconteceu
// HOW: Como resolver

function formatErrorMessage(
  what: string,    // O que deu errado
  why: string,     // Por que deu errado
  how: string      // Como corrigir
): string {
  return `${what}. Motivo: ${why}. Solução: ${how}.`;
}

throw new Error(
  formatErrorMessage(
    "Conexão com database falhou",
    "timeout após 30 segundos",
    "verifique se PostgreSQL está rodando e aceitando conexões"
  )
);

// Output: "Conexão com database falhou. Motivo: timeout após 30 segundos.
//          Solução: verifique se PostgreSQL está rodando e aceitando conexões."
```

**Fundamento teórico:** Padrão **WHAT-WHY-HOW** estrutura mensagens consistentemente - sempre fornece informação completa.

#### Validation Error Messages

```typescript
class ValidationError extends Error {
  constructor(
    public field: string,
    public value: any,
    public constraint: string,
    expectedFormat?: string,
    example?: string
  ) {
    // Construir mensagem descritiva
    let message = `Campo '${field}' com valor '${value}' é inválido: ${constraint}.`;
    
    if (expectedFormat) {
      message += ` Formato esperado: ${expectedFormat}.`;
    }
    
    if (example) {
      message += ` Exemplo: ${example}.`;
    }
    
    super(message);
    this.name = "ValidationError";
  }
}

// Uso
throw new ValidationError(
  "email",
  "abc",
  "deve conter @ e domínio válido",
  "usuario@dominio.com",
  "joao@example.com"
);

// Message: "Campo 'email' com valor 'abc' é inválido: deve conter @ e domínio válido.
//           Formato esperado: usuario@dominio.com. Exemplo: joao@example.com."
```

**Análise profunda:** **Constructor** constrói mensagem descritiva automaticamente - consistência garantida.

### Message with Multiple Values

```typescript
function validarPedido(
  pedido: { id: number; valor: number; items: any[] }
) {
  if (pedido.items.length === 0) {
    throw new Error(
      `Pedido ${pedido.id} está vazio (0 items). ` +
      `Adicione pelo menos 1 item ao pedido antes de finalizar.`
    );
  }
  
  if (pedido.valor <= 0) {
    throw new Error(
      `Pedido ${pedido.id} tem valor inválido: R$ ${pedido.valor.toFixed(2)}. ` +
      `Valor deve ser positivo. ` +
      `Verifique preços dos ${pedido.items.length} items.`
    );
  }
}

try {
  validarPedido({ id: 123, valor: -50, items: [{ produto: "A" }] });
} catch (e) {
  console.log(e.message);
  // "Pedido 123 tem valor inválido: R$ -50.00. Valor deve ser positivo.
  //  Verifique preços dos 1 items."
}
```

**Conceito:** Mensagem inclui **múltiplos valores de contexto** - ID, valor, quantidade de items.

### Modelo Mental para Compreensão

Pense em mensagens de erro como **relatório de diagnóstico**:

**Mensagem ruim:** "Problema detectado"
**Mensagem boa:** "Problema no motor - superaquecimento. Verifique nível de óleo e radiador."

**Analogia - Mensagem Médica:**

**Ruim:** "Você está doente"
**Bom:** "Você tem febre de 39°C causada por infecção bacteriana. Prescrevo antibiótico por 7 dias."

**Estrutura de boa mensagem:**
- **Sintoma:** O que está errado
- **Diagnóstico:** Por que está errado
- **Tratamento:** Como resolver

**Metáfora - GPS:**

**Mensagem ruim:** "Erro de rota"
**Mensagem boa:** "Você está na Rua A, mas precisa estar na Rua B. Vire à esquerda na próxima esquina e siga 200m."

## 🔍 Análise Conceitual Profunda

### HTTP Error Messages

```typescript
class HTTPError extends Error {
  constructor(
    public statusCode: number,
    public url: string,
    public method: string,
    details?: string
  ) {
    const statusText = HTTPError.getStatusText(statusCode);
    
    let message = `HTTP ${statusCode} ${statusText}: ${method} ${url} falhou.`;
    
    if (details) {
      message += ` Detalhes: ${details}.`;
    }
    
    message += ` ${HTTPError.getSuggestion(statusCode)}`;
    
    super(message);
    this.name = "HTTPError";
  }
  
  private static getStatusText(code: number): string {
    const texts: Record<number, string> = {
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      500: "Internal Server Error",
      503: "Service Unavailable"
    };
    return texts[code] || "Unknown Error";
  }
  
  private static getSuggestion(code: number): string {
    const suggestions: Record<number, string> = {
      400: "Verifique os parâmetros da requisição.",
      401: "Faça login ou forneça token de autenticação válido.",
      403: "Você não tem permissão para acessar este recurso.",
      404: "Verifique se a URL está correta.",
      500: "Erro no servidor. Tente novamente mais tarde ou contate suporte.",
      503: "Serviço temporariamente indisponível. Tente novamente em alguns minutos."
    };
    return suggestions[code] || "Contate o suporte.";
  }
}

throw new HTTPError(404, "/api/users/999", "GET");
// Message: "HTTP 404 Not Found: GET /api/users/999 falhou.
//           Verifique se a URL está correta."

throw new HTTPError(401, "/api/admin", "POST", "Token expirado");
// Message: "HTTP 401 Unauthorized: POST /api/admin falhou.
//           Detalhes: Token expirado.
//           Faça login ou forneça token de autenticação válido."
```

**Análise profunda:** HTTPError **mapeia status codes** para mensagens user-friendly + sugestões específicas.

#### Database Error Messages

```typescript
class DatabaseError extends Error {
  constructor(
    public operation: string,
    public table: string,
    public query: string,
    public errorCode?: string,
    public constraint?: string
  ) {
    let message = `Operação '${operation}' falhou na tabela '${table}'.`;
    
    if (errorCode) {
      const explanation = DatabaseError.explainErrorCode(errorCode);
      message += ` Erro: ${errorCode} - ${explanation}.`;
    }
    
    if (constraint) {
      message += ` Constraint violada: '${constraint}'.`;
    }
    
    message += ` Query: ${query}.`;
    message += ` ${DatabaseError.getSuggestion(errorCode)}`;
    
    super(message);
    this.name = "DatabaseError";
  }
  
  private static explainErrorCode(code: string): string {
    const explanations: Record<string, string> = {
      "ER_DUP_ENTRY": "Registro duplicado",
      "ER_NO_REFERENCED_ROW": "Chave estrangeira inválida",
      "ER_ROW_IS_REFERENCED": "Registro está sendo referenciado",
      "ER_BAD_NULL_ERROR": "Campo obrigatório está NULL"
    };
    return explanations[code] || "Erro desconhecido";
  }
  
  private static getSuggestion(code?: string): string {
    if (!code) return "Verifique os dados e tente novamente.";
    
    const suggestions: Record<string, string> = {
      "ER_DUP_ENTRY": "Use um valor único para este campo.",
      "ER_NO_REFERENCED_ROW": "Verifique se o registro referenciado existe.",
      "ER_ROW_IS_REFERENCED": "Delete primeiro os registros que referenciam este.",
      "ER_BAD_NULL_ERROR": "Forneça um valor para todos os campos obrigatórios."
    };
    return suggestions[code] || "Verifique os dados e tente novamente.";
  }
}

throw new DatabaseError(
  "INSERT",
  "users",
  "INSERT INTO users (email) VALUES ('user@example.com')",
  "ER_DUP_ENTRY",
  "users_email_unique"
);

// Message: "Operação 'INSERT' falhou na tabela 'users'.
//           Erro: ER_DUP_ENTRY - Registro duplicado.
//           Constraint violada: 'users_email_unique'.
//           Query: INSERT INTO users (email) VALUES ('user@example.com').
//           Use um valor único para este campo."
```

**Conceito avançado:** DatabaseError **traduz error codes** técnicos em explicações user-friendly.

### Business Rule Error Messages

```typescript
class BusinessRuleError extends Error {
  constructor(
    public rule: string,
    public entity: string,
    public entityId: string | number,
    public condition: string,
    public actualValue: any,
    public expectedValue: any
  ) {
    const message =
      `Regra de negócio '${rule}' violada para ${entity} ID ${entityId}. ` +
      `Condição: ${condition}. ` +
      `Valor atual: ${BusinessRuleError.formatValue(actualValue)}, ` +
      `Esperado: ${BusinessRuleError.formatValue(expectedValue)}. ` +
      `${BusinessRuleError.getActionForRule(rule)}`;
    
    super(message);
    this.name = "BusinessRuleError";
  }
  
  private static formatValue(value: any): string {
    if (typeof value === "number") {
      return value.toLocaleString("pt-BR");
    }
    if (value instanceof Date) {
      return value.toLocaleDateString("pt-BR");
    }
    return String(value);
  }
  
  private static getActionForRule(rule: string): string {
    const actions: Record<string, string> = {
      "MIN_BALANCE": "Adicione saldo suficiente antes de tentar novamente.",
      "MAX_TRANSFER": "Divida a transferência em múltiplas transações menores.",
      "AGE_RESTRICTION": "Este produto requer idade mínima. Verifique os requisitos.",
      "STOCK_AVAILABLE": "Reduza a quantidade ou aguarde reabastecimento."
    };
    return actions[rule] || "Verifique os requisitos e tente novamente.";
  }
}

throw new BusinessRuleError(
  "MIN_BALANCE",
  "Conta",
  "ACC-123",
  "saldo >= valorTransferencia",
  500,    // Saldo atual
  1000    // Valor da transferência
);

// Message: "Regra de negócio 'MIN_BALANCE' violada para Conta ID ACC-123.
//           Condição: saldo >= valorTransferencia.
//           Valor atual: 500, Esperado: 1.000.
//           Adicione saldo suficiente antes de tentar novamente."
```

**Fundamento teórico:** Business rule errors explicam **qual regra**, **condição violada**, **valores** e **ação corretiva**.

#### Multilevel Context Messages

```typescript
function formatFullContext(
  operation: string,
  entity: string,
  field: string,
  value: any,
  error: string,
  fix: string
): string {
  return (
    `Operação: ${operation}\n` +
    `Entidade: ${entity}\n` +
    `Campo: ${field}\n` +
    `Valor fornecido: ${JSON.stringify(value)}\n` +
    `Problema: ${error}\n` +
    `Solução: ${fix}`
  );
}

class DetailedValidationError extends Error {
  constructor(
    operation: string,
    entity: string,
    field: string,
    value: any,
    error: string,
    fix: string
  ) {
    super(formatFullContext(operation, entity, field, value, error, fix));
    this.name = "DetailedValidationError";
  }
}

throw new DetailedValidationError(
  "Criar Usuário",
  "User",
  "email",
  "invalid-email",
  "Email deve conter @ e domínio válido",
  "Use formato usuario@dominio.com (exemplo: joao@example.com)"
);

// Message:
// "Operação: Criar Usuário
//  Entidade: User
//  Campo: email
//  Valor fornecido: "invalid-email"
//  Problema: Email deve conter @ e domínio válido
//  Solução: Use formato usuario@dominio.com (exemplo: joao@example.com)"
```

**Análise profunda:** **Multi-level context** - mensagem estruturada em múltiplas linhas com labels.

### Message Localization

```typescript
type Locale = "pt-BR" | "en-US" | "es-ES";

class LocalizedError extends Error {
  constructor(
    public code: string,
    public params: Record<string, any>,
    locale: Locale = "pt-BR"
  ) {
    super(LocalizedError.getMessage(code, params, locale));
    this.name = "LocalizedError";
  }
  
  private static messages: Record<Locale, Record<string, string>> = {
    "pt-BR": {
      "INVALID_EMAIL": "Email '{email}' é inválido. Use formato: usuario@dominio.com",
      "USER_NOT_FOUND": "Usuário com ID {userId} não encontrado",
      "INSUFFICIENT_BALANCE": "Saldo insuficiente. Atual: R$ {current}, Necessário: R$ {required}"
    },
    "en-US": {
      "INVALID_EMAIL": "Email '{email}' is invalid. Use format: user@domain.com",
      "USER_NOT_FOUND": "User with ID {userId} not found",
      "INSUFFICIENT_BALANCE": "Insufficient balance. Current: $ {current}, Required: $ {required}"
    },
    "es-ES": {
      "INVALID_EMAIL": "Email '{email}' es inválido. Use formato: usuario@dominio.com",
      "USER_NOT_FOUND": "Usuario con ID {userId} no encontrado",
      "INSUFFICIENT_BALANCE": "Saldo insuficiente. Actual: $ {current}, Requerido: $ {required}"
    }
  };
  
  private static getMessage(
    code: string,
    params: Record<string, any>,
    locale: Locale
  ): string {
    const template = this.messages[locale]?.[code] || code;
    
    return Object.entries(params).reduce(
      (msg, [key, value]) => msg.replace(`{${key}}`, String(value)),
      template
    );
  }
}

// Português
throw new LocalizedError("INVALID_EMAIL", { email: "abc" }, "pt-BR");
// "Email 'abc' é inválido. Use formato: usuario@dominio.com"

// Inglês
throw new LocalizedError("INVALID_EMAIL", { email: "abc" }, "en-US");
// "Email 'abc' is invalid. Use format: user@domain.com"

// Espanhol
throw new LocalizedError("INVALID_EMAIL", { email: "abc" }, "es-ES");
// "Email 'abc' es inválido. Use formato: usuario@dominio.com"
```

**Conceito avançado:** **Localization** - mensagens em múltiplos idiomas com template interpolation.

### Message with Stack Trace Context

```typescript
class ContextualError extends Error {
  constructor(
    message: string,
    public context: Record<string, any>
  ) {
    super(ContextualError.formatMessage(message, context));
    this.name = "ContextualError";
  }
  
  private static formatMessage(
    message: string,
    context: Record<string, any>
  ): string {
    const contextLines = Object.entries(context)
      .map(([key, value]) => `  ${key}: ${JSON.stringify(value)}`)
      .join("\n");
    
    return `${message}\n\nContexto:\n${contextLines}`;
  }
}

throw new ContextualError(
  "Falha ao processar pagamento",
  {
    orderId: "ORD-123",
    amount: 299.90,
    paymentMethod: "credit-card",
    customerId: 456,
    timestamp: new Date().toISOString()
  }
);

// Message:
// "Falha ao processar pagamento
//
//  Contexto:
//    orderId: "ORD-123"
//    amount: 299.9
//    paymentMethod: "credit-card"
//    customerId: 456
//    timestamp: "2024-01-15T10:30:00.000Z""
```

**Fundamento teórico:** **Context section** na mensagem - estrutura clara de contexto adicional.

#### Message Builders

```typescript
class MessageBuilder {
  private parts: string[] = [];
  
  problem(text: string): this {
    this.parts.push(`Problema: ${text}`);
    return this;
  }
  
  reason(text: string): this {
    this.parts.push(`Motivo: ${text}`);
    return this;
  }
  
  context(key: string, value: any): this {
    this.parts.push(`${key}: ${value}`);
    return this;
  }
  
  suggestion(text: string): this {
    this.parts.push(`Sugestão: ${text}`);
    return this;
  }
  
  example(text: string): this {
    this.parts.push(`Exemplo: ${text}`);
    return this;
  }
  
  build(): string {
    return this.parts.join(". ");
  }
}

const message = new MessageBuilder()
  .problem("Email inválido")
  .reason("falta símbolo @")
  .context("Email fornecido", "abc")
  .context("Campo", "userEmail")
  .suggestion("Use formato usuario@dominio.com")
  .example("joao@example.com")
  .build();

throw new Error(message);

// Message: "Problema: Email inválido. Motivo: falta símbolo @.
//           Email fornecido: abc. Campo: userEmail.
//           Sugestão: Use formato usuario@dominio.com. Exemplo: joao@example.com"
```

**Conceito:** **Builder pattern** para construir mensagens complexas fluently.

### Dynamic Message Templates

```typescript
type MessageTemplate = (params: Record<string, any>) => string;

const templates: Record<string, MessageTemplate> = {
  validation: (p) =>
    `Campo '${p.field}' com valor '${p.value}' é inválido: ${p.reason}. ` +
    `${p.fix ? `Solução: ${p.fix}` : ""}`,
  
  notFound: (p) =>
    `${p.entity} com ${p.idField} '${p.idValue}' não encontrado. ` +
    `Verifique se ${p.entity} existe ou crie novo primeiro.`,
  
  permission: (p) =>
    `Usuário '${p.username}' não tem permissão para '${p.action}' em '${p.resource}'. ` +
    `Permissões necessárias: ${p.requiredPermissions.join(", ")}.`
};

// Uso
throw new Error(
  templates.validation({
    field: "email",
    value: "abc",
    reason: "falta @",
    fix: "use formato usuario@dominio.com"
  })
);

throw new Error(
  templates.notFound({
    entity: "Produto",
    idField: "SKU",
    idValue: "PROD-999"
  })
);

throw new Error(
  templates.permission({
    username: "joao",
    action: "delete",
    resource: "users",
    requiredPermissions: ["users:delete", "admin"]
  })
);
```

**Análise profunda:** **Template functions** centralizam formatação - consistência garantida.

## 🎯 Aplicabilidade e Contextos

### API Error Responses

```typescript
class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = "APIError";
  }
  
  toJSON() {
    return {
      error: {
        message: this.message,
        code: this.code,
        statusCode: this.statusCode
      }
    };
  }
}

app.use((err: Error, req: Request, res: Response) => {
  if (err instanceof APIError) {
    res.status(err.statusCode).json(err.toJSON());
  }
});
```

**Raciocínio:** Mensagens descritivas melhoram API developer experience.

### Form Validation Feedback

```typescript
class FormError extends Error {
  constructor(
    public field: string,
    public value: any,
    public issue: string,
    suggestion: string
  ) {
    super(
      `Campo '${field}': ${issue}. ${suggestion}`
    );
    this.name = "FormError";
  }
}

// UI mostra mensagem diretamente
throw new FormError(
  "email",
  "abc",
  "Email deve conter @",
  "Use formato usuario@dominio.com"
);
```

**Raciocínio:** Mensagem pode ser exibida diretamente ao usuário.

### Logging and Monitoring

```typescript
try {
  operacao();
} catch (e) {
  if (e instanceof Error) {
    logger.error({
      message: e.message,  // Mensagem descritiva vai para logs
      stack: e.stack,
      timestamp: new Date()
    });
  }
}
```

**Raciocínio:** Mensagens descritivas facilitam análise de logs.

## ⚠️ Limitações e Considerações Teóricas

### Message Verbosity

```typescript
// Mensagem muito longa pode ser overwhelming
throw new Error(
  "Email 'abc' é inválido porque não contém @ e também não tem domínio " +
  "e o formato esperado é usuario@dominio.com como por exemplo " +
  "joao@example.com e você deve usar este formato sempre que..."
  // Muito verboso!
);
```

**Limitação:** Mensagens muito longas são difíceis de ler - balance informação vs concisão.

### Sensitive Information

```typescript
// ❌ Evitar expor informações sensíveis
throw new Error(
  `Login falhou: senha '${senha}' incorreta para usuário ${email}`
  // Senha na mensagem - NUNCA!
);

// ✅ Mensagem sem dados sensíveis
throw new Error(
  `Login falhou: credenciais inválidas para usuário ${email}`
);
```

**Consideração:** Não incluir passwords, tokens, dados pessoais em mensagens.

### Localization Complexity

```typescript
// Manter mensagens em múltiplos idiomas é custoso
// Precisa atualizar todas traduções quando mudar lógica
```

**Limitação:** Localization adiciona complexidade de manutenção.

## 🔗 Interconexões Conceituais

**Relação com Error Classes:** Mensagens são parte fundamental de custom errors.

**Relação com Properties:** Properties fornecem dados para mensagens.

**Relação com Logging:** Mensagens vão para logs.

**Relação com UX:** Mensagens podem ser mostradas a usuários.

**Relação com Debugging:** Mensagens facilitam debugging.

## 🚀 Evolução e Próximos Conceitos

Dominar mensagens descritivas prepara para:
- **Error Typing:** Type safety completo
- **Error Localization:** Internacionalização
- **Error Monitoring:** Tracking e alerting
- **Error Recovery:** Estratégias de recuperação
