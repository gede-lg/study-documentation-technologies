# Enum String

## 🎯 Introdução e Definição

### Definição Conceitual

**Enum string** é uma estrutura em TypeScript onde cada membro de um enum recebe um **valor string literal** explícito, ao invés de numérico. Diferentemente de enums numéricos, enums string **não têm auto-increment** - cada membro deve ter valor explícito. Conceitualmente, enums string implementam **unidirectional mapping** (apenas nome → valor), sem reverse mapping (valor → nome).

Enums string oferecem **type safety superior** a enums numéricos porque TypeScript valida exatamente os valores string definidos, não aceita strings arbitrárias. São mais **legíveis** em runtime - ao serializar para JSON, debuggar logs, ou inspecionar valores, vê-se strings semânticas ao invés de números obscuros.

### Contexto Histórico e Motivação

A evolução de enums string:

**TypeScript 2.4 (2017):** Introduziu **string enums** como feature oficial, permitindo valores string explícitos.

**Motivação:** Enums numéricos tinham limitações:
- **Debugging difícil:** Logs mostravam `status: 1` ao invés de `status: "ativo"`
- **JSON serialization:** Números não são auto-descritivos
- **Type safety fraca:** Aceitavam qualquer `number`

**String enums resolvem:**
- **Self-documenting:** Valores são legíveis em JSON/logs
- **Type safety:** TypeScript aceita apenas strings do enum
- **API contracts:** Strings são estáveis (números podem mudar)

**Trade-off:** Perdem reverse mapping e auto-increment, mas ganham clareza e segurança.

### Problema Fundamental que Resolve

Enums string resolvem problemas específicos:

**1. Self-Documentation em Runtime**
```typescript
// Numeric enum
enum StatusNum { Ativo = 0, Inativo = 1 }
console.log({ status: StatusNum.Ativo });  // { status: 0 } - obscuro

// String enum
enum Status { Ativo = "ATIVO", Inativo = "INATIVO" }
console.log({ status: Status.Ativo });  // { status: "ATIVO" } - claro
```

**2. JSON Serialization**
```typescript
enum Prioridade {
  Baixa = "baixa",
  Media = "media",
  Alta = "alta"
}

const tarefa = { prioridade: Prioridade.Alta };
JSON.stringify(tarefa);  // '{"prioridade":"alta"}' - semântico
```

**3. API Compatibility**
```typescript
enum Metodo {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

fetch(url, { method: Metodo.POST });  // String é padrão de APIs
```

**4. Type Safety Aprimorada**
```typescript
enum Cor {
  Vermelho = "vermelho",
  Verde = "verde",
  Azul = "azul"
}

function pintar(cor: Cor) { }

pintar(Cor.Vermelho);  // ✅ OK
pintar("vermelho");    // ❌ Erro - string literal não é aceita
pintar("amarelo");     // ❌ Erro
```

### Importância no Ecossistema

Enums string são importantes porque:

- **REST APIs:** HTTP methods, status messages, resource types são strings
- **GraphQL:** Enums GraphQL mapeiam naturalmente para string enums
- **State Machines:** Estados como strings são mais debugáveis
- **Configuration:** Arquivos de configuração usam strings
- **i18n Keys:** Chaves de internacionalização são strings

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Explicit Values:** Cada membro deve ter valor string explícito
2. **No Auto-Increment:** Não há incremento automático
3. **No Reverse Mapping:** Apenas acesso nome → valor
4. **Type Safety:** TypeScript valida exatamente valores do enum
5. **Runtime Clarity:** Valores são legíveis em JSON, logs, debugging

### Pilares Fundamentais

- **Declaration:** `enum Nome { Membro1 = "valor1", Membro2 = "valor2" }`
- **Access:** `Nome.Membro1` retorna `"valor1"`
- **No Reverse:** `Nome["valor1"]` não retorna `"Membro1"`
- **Type:** Variável tipo `Nome` aceita apenas valores do enum
- **Compilation:** Gera objeto JavaScript mais simples (sem reverse mapping)

### Visão Geral das Nuances

- **Deve ser Explícito:** Não pode omitir valores
- **Const Enum:** `const enum` também funciona com strings
- **Heterogeneous:** Pode misturar com números (anti-pattern)
- **Computed Values:** Não suporta valores string computados (apenas literais)
- **Union Types:** Alternativa é union de literais

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Compilation Process

```typescript
// TypeScript source
enum Direcao {
  Cima = "UP",
  Baixo = "DOWN",
  Esquerda = "LEFT",
  Direita = "RIGHT"
}

// JavaScript compilado (ES5)
var Direcao;
(function (Direcao) {
  Direcao["Cima"] = "UP";
  Direcao["Baixo"] = "DOWN";
  Direcao["Esquerda"] = "LEFT";
  Direcao["Direita"] = "RIGHT";
})(Direcao || (Direcao = {}));
```

**Análise profunda da compilação:**

1. **IIFE:** Mesmo padrão de numeric enum
2. **Assignment:** `Direcao["Cima"] = "UP"` - apenas nome → valor
3. **No Reverse:** Não há `Direcao["UP"] = "Cima"`
4. **Resultado:** Objeto com 4 propriedades (vs 8 em numeric enum)

**Objeto resultante:**
```javascript
{
  Cima: "UP",
  Baixo: "DOWN",
  Esquerda: "LEFT",
  Direita: "RIGHT"
}
```

**Fundamento conceitual:** String enums são mais simples em runtime - sem duplicação de chaves.

### Princípios e Conceitos Subjacentes

#### Explicit Value Requirement

```typescript
enum Status {
  Ativo = "ativo",
  Inativo = "inativo",
  // Pendente  // ❌ Erro - valor string deve ser explícito
}
```

**Conceito crucial:** Diferente de numeric enums, string enums não têm auto-increment. Cada membro **deve** ter valor explícito.

#### Unidirectional Mapping

```typescript
enum Cor {
  Vermelho = "red",
  Verde = "green",
  Azul = "blue"
}

console.log(Cor.Vermelho);   // "red" ✅ OK
console.log(Cor["Vermelho"]);  // "red" ✅ OK
console.log(Cor["red"]);     // undefined ❌ Não existe reverse mapping
```

**Análise profunda:** String enums são **one-way** - apenas nome para valor.

#### Type Safety

```typescript
enum Metodo {
  GET = "GET",
  POST = "POST"
}

function requisicao(metodo: Metodo) { }

requisicao(Metodo.GET);   // ✅ OK
requisicao("GET");        // ❌ Erro - string literal não é Metodo
requisicao("PUT");        // ❌ Erro

// Para aceitar string literal, precisa union:
function req2(metodo: Metodo | string) { }
req2("PUT");  // ✅ OK agora
```

**Fundamento teórico:** String enums são **nominal types** - apenas valores do enum são aceitos, não strings arbitrárias.

### Modelo Mental para Compreensão

Pense em string enum como **dicionário unidirecional**:

| Nome (Chave) | Valor (String) |
|--------------|----------------|
| Cima         | "UP"           |
| Baixo        | "DOWN"         |
| Esquerda     | "LEFT"         |
| Direita      | "RIGHT"        |

**Acesso:**
- **Por nome:** ✅ `Direcao.Cima` → `"UP"`
- **Por valor:** ❌ `Direcao["UP"]` → `undefined`

**Implementação JavaScript:**
```javascript
{
  Cima: "UP",
  Baixo: "DOWN",
  Esquerda: "LEFT",
  Direita: "RIGHT"
}
```

**Contraste com Numeric Enum:** Numeric enum tem **8 propriedades** (4 nomes + 4 valores), string enum tem **4 propriedades** (apenas nomes).

## 🔍 Análise Conceitual Profunda

### Basic String Enum

```typescript
enum TipoPagamento {
  CartaoCredito = "cartao_credito",
  CartaoDebito = "cartao_debito",
  Boleto = "boleto",
  Pix = "pix"
}

const tipo: TipoPagamento = TipoPagamento.Pix;
console.log(tipo);  // "pix"

// Serialização JSON
const pedido = { tipo: TipoPagamento.CartaoCredito };
JSON.stringify(pedido);  // '{"tipo":"cartao_credito"}'
```

**Análise teórica:** Valores string são auto-descritivos em JSON, logs, databases.

### String Values Matching Names

```typescript
enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

// Valores iguais aos nomes - comum para APIs
```

**Fundamento conceitual:** Quando valores devem corresponder exatamente aos nomes, string enums garantem consistência.

### Snake_Case Values

```typescript
enum EventoUsuario {
  CadastroCompleto = "cadastro_completo",
  EmailVerificado = "email_verificado",
  PerfilAtualizado = "perfil_atualizado"
}

// Enum usa PascalCase, valores usam snake_case (convenção backend)
```

**Análise profunda:** Enum permite diferentes convenções de nomenclatura entre TypeScript (camelCase/PascalCase) e backend (snake_case).

### Type Safety Validation

```typescript
enum Status {
  Aprovado = "aprovado",
  Rejeitado = "rejeitado",
  Pendente = "pendente"
}

function processar(status: Status) {
  if (status === Status.Aprovado) {
    console.log("OK");
  }
}

processar(Status.Aprovado);  // ✅ OK
processar("aprovado");       // ❌ Erro - Argument of type '"aprovado"' is not assignable to parameter of type 'Status'
```

**Conceito crucial:** TypeScript distingue entre tipo `Status` e tipo `string`, mesmo que valores sejam strings.

### Const Enum com Strings

```typescript
const enum Tema {
  Claro = "light",
  Escuro = "dark",
  Auto = "auto"
}

const tema = Tema.Escuro;

// Compilado:
const tema = "dark" /* Tema.Escuro */;
// Enum não existe em runtime - valor é inline
```

**Análise profunda:** `const enum` com strings substitui referências por literais, eliminando objeto em runtime.

### String Enum as Union

```typescript
enum Cor {
  Vermelho = "red",
  Verde = "green",
  Azul = "blue"
}

// Equivalente a:
type CorUnion = "red" | "green" | "blue";

// Mas enum tem vantagens:
// 1. Namespacing (Cor.Vermelho)
// 2. Não precisa importar cada valor
// 3. Pode adicionar utility methods via namespace merging
```

**Fundamento teórico:** String enum é semanticamente similar a union de string literals, mas com ergonomia diferente.

### Heterogeneous Enum - String e Number (Anti-Pattern)

```typescript
enum Misto {
  Numero = 1,
  Texto = "texto",
  OutroNumero = 2
}

// ❌ TypeScript permite, mas é anti-pattern
// Evitar misturar string e number no mesmo enum
```

**Conceito avançado:** Enums heterogêneos perdem benefícios de ambos tipos. Preferir enums homogêneos.

### String Enum com Template Literals (Não Suportado)

```typescript
const BASE = "api";

enum Endpoints {
  // Usuarios = `${BASE}/usuarios`,  // ❌ Erro - computed values não permitidos
  Usuarios = "api/usuarios"  // ✅ OK - literal explícito
}
```

**Limitação:** String enums aceitam apenas **literais**, não expressões computadas.

### Enum Member as Type

```typescript
enum Status {
  Ativo = "ativo",
  Inativo = "inativo"
}

type Ativo = Status.Ativo;  // Tipo literal "ativo"

const s1: Ativo = Status.Ativo;   // ✅ OK
const s2: Ativo = Status.Inativo; // ❌ Erro
```

**Conceito avançado:** Membros individuais de enum podem ser usados como tipos.

### Iteration Over String Enum

```typescript
enum Prioridade {
  Baixa = "baixa",
  Media = "media",
  Alta = "alta"
}

// Obter todas as chaves (nomes)
const nomes = Object.keys(Prioridade);
console.log(nomes);  // ["Baixa", "Media", "Alta"]

// Obter todos os valores
const valores = Object.values(Prioridade);
console.log(valores);  // ["baixa", "media", "alta"]

// Não precisa filtrar como em numeric enum
```

**Análise profunda:** String enums são mais simples para iterar - sem reverse mapping para filtrar.

### Type Assertion com String Enum

```typescript
enum Role {
  Admin = "admin",
  User = "user",
  Guest = "guest"
}

// Vindo de API (string)
const roleFromApi = "admin";

// Type assertion para enum
const role = roleFromApi as Role;  // ⚠️ Perigoso - sem validação runtime

// Melhor: validação runtime
function isRole(value: string): value is Role {
  return Object.values(Role).includes(value as Role);
}

if (isRole(roleFromApi)) {
  const role: Role = roleFromApi;  // ✅ Type-safe
}
```

**Fundamento teórico:** Type assertions não validam em runtime. String enums requerem validação explícita de strings externas.

### Namespace Merging para Utilities

```typescript
enum Status {
  Ativo = "ativo",
  Inativo = "inativo"
}

namespace Status {
  export function fromString(value: string): Status | undefined {
    return Object.values(Status).find(s => s === value);
  }
  
  export function isValid(value: string): value is Status {
    return Object.values(Status).includes(value as Status);
  }
}

// Uso:
const s = Status.fromString("ativo");  // Status.Ativo
if (Status.isValid("ativo")) { /* ... */ }
```

**Conceito avançado:** Namespace merging permite adicionar utility functions ao enum.

### Discriminated Union com String Enum

```typescript
enum TipoEvento {
  Click = "click",
  Hover = "hover",
  Scroll = "scroll"
}

interface EventoClick {
  tipo: TipoEvento.Click;
  x: number;
  y: number;
}

interface EventoHover {
  tipo: TipoEvento.Hover;
  elemento: string;
}

type Evento = EventoClick | EventoHover;

function handle(evento: Evento) {
  if (evento.tipo === TipoEvento.Click) {
    console.log(evento.x, evento.y);  // ✅ Type narrowing
  }
}
```

**Análise profunda:** String enums são excelentes como discriminants em unions.

## 🎯 Aplicabilidade e Contextos

### HTTP Methods

```typescript
enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH"
}

fetch(url, { method: HttpMethod.POST });
```

**Raciocínio:** APIs HTTP usam strings uppercase.

### Environment Variables

```typescript
enum Environment {
  Development = "development",
  Staging = "staging",
  Production = "production"
}

const env = process.env.NODE_ENV as Environment;
```

**Raciocínio:** Variáveis de ambiente são strings.

### Database Enums

```typescript
enum StatusPedido {
  Pendente = "pendente",
  Processando = "processando",
  Enviado = "enviado",
  Entregue = "entregue",
  Cancelado = "cancelado"
}

// Mapeia para ENUM SQL:
// CREATE TYPE status_pedido AS ENUM ('pendente', 'processando', ...);
```

**Raciocínio:** PostgreSQL enums são strings; mapeamento direto.

### Event Names

```typescript
enum EventoApp {
  UsuarioCadastrado = "usuario:cadastrado",
  UsuarioLogado = "usuario:logado",
  PedidoCriado = "pedido:criado",
  PagamentoProcessado = "pagamento:processado"
}

eventEmitter.on(EventoApp.UsuarioCadastrado, handler);
```

**Raciocínio:** Event emitters usam strings; enum previne typos.

### i18n Keys

```typescript
enum TranslationKey {
  WelcomeMessage = "welcome.message",
  ErrorNotFound = "error.notFound",
  ButtonSubmit = "button.submit"
}

const text = t(TranslationKey.WelcomeMessage);
```

**Raciocínio:** Chaves de tradução são strings hierárquicas.

### CSS Class Names

```typescript
enum CssClass {
  Container = "container",
  Button = "btn",
  ButtonPrimary = "btn--primary",
  Alert = "alert"
}

element.classList.add(CssClass.ButtonPrimary);
```

**Raciocínio:** Class names são strings; enum garante consistência.

## ⚠️ Limitações e Considerações Teóricas

### Deve Ser Explícito

```typescript
enum Status {
  Ativo = "ativo",
  Inativo  // ❌ Erro - valor não pode ser omitido
}
```

**Limitação:** Mais verboso que numeric enums.

### Sem Reverse Mapping

```typescript
enum Cor {
  Vermelho = "red"
}

console.log(Cor["red"]);  // undefined ❌
```

**Limitação:** Não pode obter nome a partir do valor em runtime.

**Solução:** Implementar função manual:
```typescript
function getNome(valor: string): string | undefined {
  return Object.keys(Cor).find(k => Cor[k as keyof typeof Cor] === valor);
}
```

### Sem Computed Values

```typescript
const PREFIX = "api";

enum Endpoints {
  // Users = `${PREFIX}/users`  // ❌ Erro
  Users = "api/users"  // ✅ OK - literal
}
```

**Limitação:** Apenas literais string, não expressões.

### Type vs Value Confusion

```typescript
enum Status {
  Ativo = "ativo"
}

function f(s: string) {}
f(Status.Ativo);  // ✅ OK - enum value é string

function g(s: Status) {}
g("ativo");  // ❌ Erro - string não é Status type
```

**Análise:** Enum value é compatível com `string`, mas `string` não é compatível com enum type.

## 🔗 Interconexões Conceituais

**Relação com Union Types:** String enums vs `type Status = "ativo" | "inativo"` - enums oferecem namespacing.

**Relação com Const Assertions:** `as const` pode substituir em alguns casos.

**Relação com Discriminated Unions:** String enums são ótimos discriminants.

**Relação com Validation:** Requerem validação runtime para strings externas.

## 🚀 Evolução e Próximos Conceitos

Dominar string enums prepara para:
- **Usar Enums em Classes:** Enum como tipo de propriedade/método
- **Enum Iteration:** Iterar sobre valores
- **Union Types vs Enums:** Escolher abordagem apropriada
- **Type Guards:** Validar strings como enum values
