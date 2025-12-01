# Operador typeof em TypeScript: Extração de Tipos de Valores

## 🎯 Introdução

O operador **typeof** em TypeScript tem **dupla função**: em **runtime** (JavaScript) retorna string do tipo; em **compile-time** (TypeScript) **extrai o tipo** de um valor, permitindo capturar tipos de variáveis, constantes e objetos.

## 📋 Conceitos Fundamentais

### typeof em Type Context vs Value Context

```typescript
const usuario = {
  nome: "Ana",
  idade: 25,
  ativo: true
};

// Value context (runtime JavaScript)
console.log(typeof usuario); // "object"

// Type context (compile-time TypeScript)
type TipoUsuario = typeof usuario;
// { nome: string; idade: number; ativo: boolean }

let outroUsuario: typeof usuario = {
  nome: "Bruno",
  idade: 30,
  ativo: false
}; // ✅ OK
```

### Sintaxe em Type Positions

```typescript
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3
};

// typeof extrai estrutura completa
type Config = typeof config;
// { apiUrl: string; timeout: number; retries: number }

// Uso em anotações de tipo
function processarConfig(cfg: typeof config) {
  console.log(cfg.apiUrl);
}

// Uso em type aliases
type MesmoConfig = typeof config;
```

## 🧠 Fundamentos Teóricos

### Type Widening e Narrowing

```typescript
// Sem const: widening para tipo amplo
let variavel = "texto";
type TipoVariavel = typeof variavel;
// string (amplo)

// Com const: narrowing para literal
const constante = "texto";
type TipoConstante = typeof constante;
// "texto" (literal)

// as const: literal profundo
const objeto = {
  nome: "Ana",
  idade: 25
} as const;

type TipoObjeto = typeof objeto;
// { readonly nome: "Ana"; readonly idade: 25 }
```

**Conceito:** `typeof` captura o tipo **inferido** no momento da declaração, respeitando widening/narrowing.

### typeof com Funções

```typescript
function somar(a: number, b: number): number {
  return a + b;
}

// Extrai tipo da função
type TipoSomar = typeof somar;
// (a: number, b: number) => number

// Uso: criar função com mesma assinatura
const subtrair: typeof somar = (a, b) => a - b; // ✅ OK

// Extrair tipo de retorno
type Retorno = ReturnType<typeof somar>;
// number

// Extrair tipo de parâmetros
type Parametros = Parameters<typeof somar>;
// [a: number, b: number]
```

### typeof com Classes

```typescript
class Usuario {
  nome: string;
  idade: number;
  
  constructor(nome: string, idade: number) {
    this.nome = nome;
    this.idade = idade;
  }
  
  cumprimentar(): string {
    return `Olá, ${this.nome}`;
  }
}

// typeof classe = tipo do construtor
type TipoUsuarioClasse = typeof Usuario;
// typeof Usuario (constructor)

// Tipo de instância
type TipoUsuarioInstancia = InstanceType<typeof Usuario>;
// Usuario

// Criar instância com tipo
const usuario: TipoUsuarioInstancia = new Usuario("Ana", 25);
```

### typeof com Enums

```typescript
enum Status {
  Ativo = "ATIVO",
  Inativo = "INATIVO",
  Pendente = "PENDENTE"
}

// typeof enum = tipo do objeto enum
type TipoStatus = typeof Status;
// { Ativo: Status.Ativo; Inativo: Status.Inativo; Pendente: Status.Pendente }

// Tipo dos valores
type ValorStatus = Status;
// Status.Ativo | Status.Inativo | Status.Pendente

// Chaves do enum
type ChavesStatus = keyof typeof Status;
// "Ativo" | "Inativo" | "Pendente"
```

## 🔍 Análise Conceitual Profunda

### Captura de Configurações

```typescript
// Objeto de configuração complexo
const appConfig = {
  database: {
    host: "localhost",
    port: 5432,
    credentials: {
      user: "admin",
      password: "secret"
    }
  },
  api: {
    baseUrl: "https://api.example.com",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer token"
    }
  },
  features: {
    authentication: true,
    logging: false
  }
} as const;

// Tipo extraído automaticamente
type AppConfig = typeof appConfig;

// Não precisa duplicar estrutura em type!
function inicializar(config: typeof appConfig) {
  // Type-safe access
  console.log(config.database.host);
  console.log(config.api.baseUrl);
}
```

### Padrão "Single Source of Truth"

```typescript
// ❌ Duplicação: valor E tipo separados
type UsuarioTipo = {
  nome: string;
  idade: number;
};

const usuarioPadrao: UsuarioTipo = {
  nome: "Visitante",
  idade: 0
};

// ✅ DRY: valor é fonte da verdade
const usuarioPadraoMelhor = {
  nome: "Visitante",
  idade: 0
};

type UsuarioTipoMelhor = typeof usuarioPadraoMelhor;
// Tipo derivado do valor!
```

### typeof com Inferência Genérica

```typescript
// Criar função com tipo baseado em objeto
function criarValidador<T extends object>(schema: T) {
  return (data: Partial<typeof schema>): boolean => {
    // Validação baseada no schema
    return Object.keys(schema).every(key => key in data);
  };
}

const schemaUsuario = {
  nome: "",
  email: "",
  idade: 0
};

const validarUsuario = criarValidador(schemaUsuario);

validarUsuario({ nome: "Ana" }); // ✅ OK
validarUsuario({ senha: "123" }); // ❌ Erro: propriedade não existe
```

### Combinação typeof + keyof

```typescript
const endpoints = {
  usuarios: "/api/users",
  produtos: "/api/products",
  pedidos: "/api/orders"
};

// Tipo das chaves
type Endpoint = keyof typeof endpoints;
// "usuarios" | "produtos" | "pedidos"

// Tipo dos valores
type EndpointUrl = typeof endpoints[Endpoint];
// string (ou literal se usar as const)

function fetch(endpoint: Endpoint): Promise<any> {
  const url = endpoints[endpoint]; // ✅ Type-safe
  return fetch(url);
}

fetch("usuarios"); // ✅ OK
fetch("clientes"); // ❌ Erro: não existe
```

## 🎯 Aplicabilidade

### Constants e Enums Runtime

```typescript
// Objeto que funciona como enum
const Roles = {
  ADMIN: "admin",
  USER: "user",
  GUEST: "guest"
} as const;

// Tipo do objeto
type RolesType = typeof Roles;
// { readonly ADMIN: "admin"; readonly USER: "user"; readonly GUEST: "guest" }

// Tipo dos valores (union)
type Role = typeof Roles[keyof typeof Roles];
// "admin" | "user" | "guest"

function verificarPermissao(role: Role) {
  if (role === Roles.ADMIN) {
    // ...
  }
}
```

### Schemas de Validação

```typescript
// Schema como valor
const validationSchema = {
  nome: { type: "string", required: true },
  email: { type: "string", required: true },
  idade: { type: "number", required: false }
} as const;

// Tipo extraído
type Schema = typeof validationSchema;

// Função tipada automaticamente
function validate(data: any, schema: typeof validationSchema) {
  // Validação baseada no schema
}
```

### Factories Type-Safe

```typescript
// Factory com tipo inferido
function createEntity<T extends Record<string, any>>(defaults: T) {
  return {
    create: (overrides: Partial<typeof defaults>): typeof defaults => {
      return { ...defaults, ...overrides };
    },
    defaults
  };
}

const usuarioFactory = createEntity({
  id: 0,
  nome: "",
  email: "",
  ativo: true
});

const novoUsuario = usuarioFactory.create({
  id: 1,
  nome: "Ana"
}); // Tipo: { id: number; nome: string; email: string; ativo: boolean }
```

### API Responses

```typescript
// Mock de resposta
const mockUsuarioResponse = {
  id: 1,
  nome: "Ana Silva",
  email: "ana@email.com",
  criadoEm: new Date(),
  perfil: {
    avatar: "https://...",
    bio: "Desenvolvedor"
  }
};

// Tipo extraído automaticamente
type UsuarioResponse = typeof mockUsuarioResponse;

async function fetchUsuario(id: number): Promise<UsuarioResponse> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

## ⚠️ Limitações

### typeof Não Refina Tipos Dinâmicos

```typescript
let variavel: string | number = "texto";

// typeof em type context captura tipo declarado, não valor runtime
type Tipo = typeof variavel;
// string | number (não refina para string mesmo sendo "texto" no momento)
```

### Não Funciona com Type Aliases Diretamente

```typescript
type Usuario = {
  nome: string;
  idade: number;
};

// ❌ Erro: typeof não funciona com types
type Teste = typeof Usuario; // Erro!

// ✅ Funciona com valores
const usuarioValor: Usuario = { nome: "Ana", idade: 25 };
type TesteCorreto = typeof usuarioValor; // OK
```

### Classes: typeof vs InstanceType

```typescript
class Produto {
  nome: string;
  preco: number;
}

// typeof = tipo do construtor
type TipoConstrutor = typeof Produto;

// InstanceType = tipo da instância
type TipoInstancia = InstanceType<typeof Produto>;

// Uso correto
const ProdutoClasse: typeof Produto = Produto; // Construtor
const produto: InstanceType<typeof Produto> = new Produto(); // Instância
```

## 🔗 Interconexões

### Com as const

```typescript
const config = {
  env: "production",
  port: 3000
} as const;

type Config = typeof config;
// { readonly env: "production"; readonly port: 3000 }
// Tipos literais!
```

### Com Utility Types

```typescript
const usuario = {
  id: 1,
  nome: "Ana",
  email: "ana@email.com",
  senha: "hash"
};

// Omitir propriedades
type UsuarioPublico = Omit<typeof usuario, "senha">;
// { id: number; nome: string; email: string }

// Selecionar propriedades
type UsuarioBasico = Pick<typeof usuario, "id" | "nome">;
// { id: number; nome: string }
```

### Com Template Literals

```typescript
const eventos = {
  userCreated: "user:created",
  userUpdated: "user:updated"
} as const;

type EventKey = keyof typeof eventos;
// "userCreated" | "userUpdated"

type EventName = typeof eventos[EventKey];
// "user:created" | "user:updated"
```

## 📚 Conclusão

**typeof** no contexto de tipos permite:

✅ Extrair tipos de valores existentes  
✅ DRY - Single source of truth  
✅ Capturar tipos complexos automaticamente  
✅ Type-safe em configs e constantes  
✅ Inferência de tipos de factories  

Use typeof quando:
- Tem valor e precisa do tipo
- Quer evitar duplicação type/value
- Trabalha com configurações complexas
- Precisa tipo de função, classe ou enum

**typeof** é essencial para padrões modernos TypeScript, permitindo derivar tipos de implementações ao invés de duplicar definições.
