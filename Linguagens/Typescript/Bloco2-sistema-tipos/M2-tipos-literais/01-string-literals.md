# String Literals: Valores Específicos como Tipos

## 🎯 Introdução e Definição

String literal type é **tipo TypeScript que representa valor string específico e exato**, não categoria geral de strings. Enquanto tipo `string` aceita qualquer texto, literal type como `"hello"` aceita **apenas essa string específica**. Conceitualmente, representa **refinamento máximo de tipo primitivo**: de infinitas possibilidades de `string` para **conjunto unitário contendo único valor**. String literals são fundação para **tipos enumerados type-safe**, pattern matching e APIs com valores restritos.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Tipo = Valor:** String específica é o tipo (`"hello"` é tipo E valor)
2. **Refinamento Extremo:** Mais restritivo possível para strings
3. **Union de Literais:** Combinar literais cria enumeração
4. **Type Safety:** Compilador valida apenas valores exatos
5. **`as const`:** Forçar inferência de literal em vez de `string`
6. **Template Literal Types:** Literais com padrões (TS 4.1+)

**Conceito Central:** String literal transforma **valor em tipo** - contrato que aceita apenas string exata.

## 🧠 Fundamentos Teóricos

### Sintaxe Básica

**Declaração:**
```typescript
let status: "ativo";
status = "ativo";     // OK - valor exato
// status = "inativo"; // ERRO: Type '"inativo"' is not assignable to type '"ativo"'
// status = "ATIVO";   // ERRO: case-sensitive
```

**Conceito:** Tipo literal aceita **apenas valor idêntico**, incluindo capitalização.

### String vs. String Literal

**Tipo Amplo (`string`):**
```typescript
let texto: string;
texto = "qualquer";
texto = "string";
texto = "funciona";
// Infinitas possibilidades
```

**Tipo Literal (`"específico"`):**
```typescript
let comando: "start";
comando = "start";    // Única possibilidade
// comando = "stop";  // ERRO
```

**Hierarquia:** `"hello"` é subtipo de `string`.

```typescript
let literal: "hello" = "hello";
let geral: string = literal;  // OK - upcast (subtipo -> supertipo)

let geral2: string = "hello";
// let literal2: "hello" = geral2;  // ERRO - downcast inseguro
```

### Inferência de String Literals

**Com `const`:**
```typescript
const mensagem = "olá";  // Tipo inferido: "olá" (literal)
```

**Com `let`:**
```typescript
let mensagem = "olá";    // Tipo inferido: string (widening)
```

**Conceito:** `const` não pode ser reatribuído, então TypeScript infere literal; `let` pode mudar, então infere `string` amplo.

**Prevenir Widening:**
```typescript
let mensagem = "olá" as const;  // Tipo: "olá" (literal)
// mensagem = "tchau";  // ERRO
```

### Union de String Literals

**Enumeração Type-Safe:**
```typescript
type Status = "ativo" | "inativo" | "pendente";

let statusUsuario: Status;
statusUsuario = "ativo";      // OK
statusUsuario = "inativo";    // OK
// statusUsuario = "cancelado"; // ERRO: Type '"cancelado"' is not assignable
```

**Conceito:** Union de literais cria **conjunto finito de valores permitidos** - enumeração sem `enum`.

**Múltiplas Opções:**
```typescript
type DirecaoHorizontal = "esquerda" | "direita";
type DirecaoVertical = "cima" | "baixo";
type Direcao = DirecaoHorizontal | DirecaoVertical;

let movimento: Direcao = "esquerda";  // OK
```

### String Literals em Objetos

**Propriedades Literais:**
```typescript
type Configuracao = {
  modo: "desenvolvimento" | "producao";
  logLevel: "debug" | "info" | "warn" | "error";
  cache: "habilitado" | "desabilitado";
};

const config: Configuracao = {
  modo: "desenvolvimento",
  logLevel: "debug",
  cache: "habilitado"
};
```

**Discriminated Unions:**
```typescript
type Sucesso = {
  status: "sucesso";
  dados: string[];
};

type Erro = {
  status: "erro";
  mensagem: string;
};

type Resultado = Sucesso | Erro;

function processar(resultado: Resultado) {
  if (resultado.status === "sucesso") {
    // resultado: Sucesso
    console.log(resultado.dados);
  } else {
    // resultado: Erro
    console.log(resultado.mensagem);
  }
}
```

**Conceito:** Propriedade literal (`status`) serve como **discriminante** para narrowing automático.

## 🔍 Análise Conceitual Profunda

### Template Literal Types (TS 4.1+)

**Conceito:** Tipos que representam **padrões de strings**.

**Sintaxe Básica:**
```typescript
type Saudacao = `Olá, ${string}`;

let msg: Saudacao = "Olá, João";   // OK
let msg2: Saudacao = "Olá, Maria"; // OK
// let msg3: Saudacao = "Oi, João"; // ERRO: não começa com "Olá, "
```

**Com Literais:**
```typescript
type Cor = "vermelho" | "azul" | "verde";
type CorClara = `${Cor}-claro`;
// CorClara = "vermelho-claro" | "azul-claro" | "verde-claro"

let cor: CorClara = "vermelho-claro";  // OK
```

**Combinações:**
```typescript
type Numero = "1" | "2" | "3";
type Letra = "A" | "B";
type Codigo = `${Numero}${Letra}`;
// Codigo = "1A" | "1B" | "2A" | "2B" | "3A" | "3B"
```

**Utility com Templates:**
```typescript
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// EventHandler = "onClick" | "onFocus" | "onBlur"
```

### `as const` Assertion

**Conceito:** Forçar inferência de literais em vez de tipos amplos.

**Sem `as const`:**
```typescript
const config = {
  modo: "dev",
  porta: 3000
};
// Tipo inferido: { modo: string; porta: number }
```

**Com `as const`:**
```typescript
const config = {
  modo: "dev",
  porta: 3000
} as const;
// Tipo inferido: { readonly modo: "dev"; readonly porta: 3000 }
```

**Arrays:**
```typescript
const cores = ["vermelho", "azul", "verde"];
// Tipo: string[]

const cores2 = ["vermelho", "azul", "verde"] as const;
// Tipo: readonly ["vermelho", "azul", "verde"]
```

**Benefícios:**
- Tipos literais em vez de amplos
- `readonly` automático (imutabilidade)
- Preserva estrutura exata

### Narrowing com String Literals

**Type Guards:**
```typescript
type Resposta = "sim" | "nao" | "talvez";

function processar(resposta: Resposta) {
  if (resposta === "sim") {
    // resposta: "sim"
    console.log("Confirmado");
  } else if (resposta === "nao") {
    // resposta: "nao"
    console.log("Negado");
  } else {
    // resposta: "talvez"
    console.log("Indeciso");
  }
}
```

**Switch com Exhaustiveness:**
```typescript
type Comando = "iniciar" | "pausar" | "parar";

function executar(comando: Comando): void {
  switch (comando) {
    case "iniciar":
      console.log("Iniciando...");
      break;
    case "pausar":
      console.log("Pausando...");
      break;
    case "parar":
      console.log("Parando...");
      break;
    default:
      const _exhaustive: never = comando;
      throw new Error(`Comando não tratado: ${_exhaustive}`);
  }
}
```

**Conceito:** `never` no `default` garante que todos os casos foram cobertos - adicionar novo valor a union causará erro de compilação.

## 🎯 Aplicabilidade

### Quando Usar String Literals

**1. Estados de Máquina:**
```typescript
type EstadoConexao = "conectado" | "conectando" | "desconectado" | "erro";

class Conexao {
  estado: EstadoConexao = "desconectado";

  conectar() {
    this.estado = "conectando";
    // ...
    this.estado = "conectado";
  }
}
```

**2. Configurações com Valores Fixos:**
```typescript
type Ambiente = "desenvolvimento" | "teste" | "producao";
type LogLevel = "debug" | "info" | "warn" | "error";

interface Config {
  ambiente: Ambiente;
  logLevel: LogLevel;
}
```

**3. Eventos e Ações:**
```typescript
type EventoUsuario =
  | "login"
  | "logout"
  | "atualizar_perfil"
  | "mudar_senha";

function rastrear(evento: EventoUsuario, dados?: any) {
  // Apenas eventos válidos aceitos
}
```

**4. HTTP Methods:**
```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

function request(url: string, method: HttpMethod) {
  // Type-safe
}
```

**5. Discriminated Unions:**
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

### Vantagens sobre Enums

**String Literals:**
```typescript
type Status = "ativo" | "inativo";
```

**vs. Enum:**
```typescript
enum Status {
  Ativo = "ativo",
  Inativo = "inativo"
}
```

**Vantagens de Literals:**
- ✅ Sem overhead de runtime (enums geram código JS)
- ✅ Mais simples e direto
- ✅ Trabalha naturalmente com strings
- ✅ Melhor para serialização/desserialização JSON
- ✅ Union types mais flexíveis

**Quando preferir Enums:**
- Reverse mapping (numéricos)
- Namespacing forte
- Iteração sobre valores

## 🎯 Padrões Recomendados

### Nomear Types de Literais

```typescript
// ✅ Type alias com nome descritivo
type DirecaoCardeal = "norte" | "sul" | "leste" | "oeste";

let direcao: DirecaoCardeal = "norte";
```

### Usar `as const` para Configurações

```typescript
const CONFIG = {
  API_URL: "https://api.exemplo.com",
  TIMEOUT: 5000,
  RETRY_COUNT: 3
} as const;

// CONFIG.API_URL: "https://api.exemplo.com" (literal, não string)
```

### Centralizar Definições

```typescript
// types/status.ts
export type StatusPedido = "pendente" | "processando" | "enviado" | "entregue";

// Usar em múltiplos lugares
import { StatusPedido } from "./types/status";
```

## ⚠️ Armadilhas Comuns

### 1. Widening com `let`

```typescript
let status = "ativo";  // Tipo: string (não "ativo")

type Status = "ativo" | "inativo";
// let s: Status = status;  // ERRO: Type 'string' is not assignable

// ✅ Solução: usar const ou as const
const status2 = "ativo";  // Tipo: "ativo"
let s: Status = status2;  // OK
```

### 2. Case Sensitivity

```typescript
type Comando = "START" | "STOP";

let cmd: Comando = "start";  // ERRO: "start" !== "START"
```

### 3. Comparações Incorretas

```typescript
type Status = "ativo" | "inativo";

let status: Status = "ativo";

// ❌ Typo não detectado em comparação com string livre
if (status === "Ativo") {  // Sempre false, mas compila
  // Nunca executa
}

// ✅ Usar literal ou constante
const ATIVO: Status = "ativo";
if (status === ATIVO) {
  // Type-safe
}
```

### 4. Esquecer `as const` em Arrays

```typescript
const opcoes = ["opcao1", "opcao2"];  // string[]
type Opcao = typeof opcoes[number];   // string (muito amplo)

// ✅ Com as const
const opcoes2 = ["opcao1", "opcao2"] as const;
type Opcao2 = typeof opcoes2[number]; // "opcao1" | "opcao2"
```

## 🔗 Interconexões Conceituais

**Relacionado a:**
- **Union Types:** String literals combinam-se em unions
- **Discriminated Unions:** Literais como discriminantes
- **Type Narrowing:** Literais permitem narrowing preciso
- **Enums:** Alternativa a enums de string
- **Template Literal Types:** Literais com padrões

**Progressão:**
String literal → Union de literais → Discriminated unions → Pattern matching type-safe

## 📚 Conclusão

**String literal types** transformam valores específicos em tipos, permitindo **type safety extremo** onde apenas strings exatas são aceitas. Combinados em unions, criam **enumerações type-safe** sem overhead de `enum`. São fundação para discriminated unions, pattern matching e APIs com valores restritos.

**Conceitos Fundamentais:**
1. **Literal = Tipo:** `"hello"` é tipo que aceita apenas `"hello"`
2. **Union de Literais:** Enumeração type-safe
3. **`as const`:** Forçar inferência de literal
4. **Template Literals:** Padrões de strings como tipos
5. **Narrowing:** Comparações refinam tipo automaticamente

**String literals = precisão máxima + type safety + pattern matching elegante.**
