# Intersection vs. Union: "E" versus "OU" em Tipos

## 🎯 Introdução e Definição

Intersection (`&`) e Union (`|`) são **operadores complementares** do sistema de tipos TypeScript: **intersection representa "E lógico"** (valor deve satisfazer TODOS os tipos simultaneamente), enquanto **union representa "OU lógico"** (valor pode satisfazer QUALQUER UM dos tipos). Conceitualmente, representam **direções opostas de combinação**: intersection **restringe** possibilidades exigindo múltiplos contratos; union **expande** possibilidades aceitando alternativas. Compreender essa dualidade é fundamental para modelagem precisa de domínios complexos.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Intersection (`&`):** "E" lógico - deve satisfazer TODOS
2. **Union (`|`):** "OU" lógico - deve satisfazer QUALQUER UM
3. **Com Objetos:** Intersection agrega propriedades; Union aceita alternativas
4. **Com Primitivos:** Intersection = `never`; Union = alternativas válidas
5. **Narrowing:** Union narrowa; Intersection já é específico
6. **Use Cases:** Intersection para composição; Union para alternativas

**Conceito Central:** Intersection e Union são **operações duais** - direções opostas de combinação de tipos.

## 🧠 Fundamentos Teóricos

### Definições Formais

**Intersection (Conjunção):**
```typescript
type A & B  // Tipo que é A E B simultaneamente
```

**Union (Disjunção):**
```typescript
type A | B  // Tipo que é A OU B
```

### Semântica com Primitivos

**Intersection de Primitivos Diferentes:**
```typescript
type StringAndNumber = string & number;
// StringAndNumber = never (impossível ser string E number)

type TrueAndFalse = true & false;
// TrueAndFalse = never (impossível ser true E false)
```

**Union de Primitivos:**
```typescript
type StringOrNumber = string | number;
// StringOrNumber aceita string OU number

type TrueOrFalse = true | false;
// TrueOrFalse = boolean
```

**Conceito:** Primitivos diferentes não interseccionam (resultado `never`); mas formam union válida.

### Semântica com Objetos

**Intersection de Objetos:**
```typescript
type A = { x: number };
type B = { y: string };

type AB = A & B;
// AB = { x: number; y: number } - AGREGA propriedades
// Valor deve ter x E y
```

**Union de Objetos:**
```typescript
type A = { x: number };
type B = { y: string };

type AouB = A | B;
// AouB = { x: number } | { y: string } - ALTERNATIVAS
// Valor pode ter apenas x OU apenas y
```

**Exemplo de Valores:**
```typescript
const intersection: A & B = {
  x: 10,
  y: "texto"  // Precisa de AMBOS
};

const union1: A | B = { x: 10 };         // OK - apenas A
const union2: A | B = { y: "texto" };    // OK - apenas B
const union3: A | B = { x: 10, y: "texto" }; // OK - ambos (é A e também é B)
```

**Conceito:** Intersection **exige tudo**; Union **aceita qualquer**.

## 🔍 Comparação Detalhada

### Agregação vs. Alternativas

**Tabela Comparativa:**

| Aspecto | Intersection (`&`) | Union (`|`) |
|---------|-------------------|-------------|
| Lógica | E (AND) | OU (OR) |
| Primitivos diferentes | `never` | Válido |
| Objetos | Agrega propriedades | Alternativas de estruturas |
| Restritividade | Mais restritivo | Mais permissivo |
| Valores aceitos | Menos opções | Mais opções |
| Narrowing | Não precisa | Essencial |
| Use case | Composição | Alternativas |

### Exemplos Paralelos

**Cenário 1: Usuário com Capacidades**

```typescript
// Intersection: Usuário DEVE ter tudo
type Admin = Usuario & Autenticavel & Permissoes;
// Deve ser Usuario E ter autenticação E ter permissões

const admin: Admin = {
  nome: "Admin",
  login: () => true,
  permissoes: ["ler", "escrever", "deletar"]
};
```

```typescript
// Union: Usuário pode ser um tipo OU outro
type UsuarioSistema = UsuarioRegular | UsuarioAdmin | UsuarioGuest;
// Pode ser Regular OU Admin OU Guest

const usuario1: UsuarioSistema = { tipo: "regular", nome: "João" };
const usuario2: UsuarioSistema = { tipo: "admin", nome: "Maria", permissoes: [] };
```

**Cenário 2: Resposta de API**

```typescript
// Intersection: Dados MAIS metadados
type RespostaCompleta<T> = T & { timestamp: Date; versao: number };
// Deve ter dados T E timestamp E versão

const resposta: RespostaCompleta<Usuario> = {
  nome: "João",
  email: "joao@exemplo.com",
  timestamp: new Date(),
  versao: 1
};
```

```typescript
// Union: Sucesso OU erro
type Resultado<T> = Sucesso<T> | Erro;
// Pode ser Sucesso OU Erro

const resultado1: Resultado<Usuario> = { sucesso: true, dados: usuario };
const resultado2: Resultado<Usuario> = { sucesso: false, erro: "Não encontrado" };
```

### Narrowing

**Union Requer Narrowing:**
```typescript
type Valor = string | number;

function processar(valor: Valor) {
  // valor: string | number

  if (typeof valor === "string") {
    // valor: string (narrowed)
    console.log(valor.toUpperCase());
  } else {
    // valor: number (narrowed)
    console.log(valor.toFixed(2));
  }
}
```

**Intersection Já É Específico:**
```typescript
type Completo = { nome: string } & { idade: number };

function processar(dados: Completo) {
  // dados já tem nome e idade - sem narrowing necessário
  console.log(dados.nome, dados.idade);
}
```

**Conceito:** Union exige **discriminação runtime**; Intersection já tem **todas as propriedades garantidas**.

## 🎯 Quando Usar Cada Um

### Use Intersection Quando:

**1. Composição de Capacidades:**
```typescript
type Usuario = DadosBase & Autenticavel & Auditavel;
// Usuário DEVE ter dados base E autenticação E auditoria
```

**2. Extending Types:**
```typescript
type ConfigAvancada = ConfigBase & { retry: number; cache: boolean };
// Config avançada É config base MAIS opções extras
```

**3. Mixins:**
```typescript
type ComponenteCompleto = Componente & Loggable & EventEmitter;
// Componente com TODOS os comportamentos
```

**4. Merge de Objetos:**
```typescript
type Merged = Opcoes1 & Opcoes2 & Opcoes3;
// Objeto final tem TODAS as opções
```

### Use Union Quando:

**1. Alternativas de Tipo:**
```typescript
type Id = string | number;
// ID pode ser string OU number
```

**2. Estados Mutuamente Exclusivos:**
```typescript
type Estado = Carregando | Sucesso | Erro;
// Sistema está em UM dos estados
```

**3. Discriminated Unions:**
```typescript
type Forma = Circulo | Quadrado | Triangulo;
// Forma é UMA das opções
```

**4. Nullable Types:**
```typescript
type Opcional = Usuario | null;
// Pode ser Usuario OU null
```

## 🔍 Casos Especiais

### Distributividade

**Intersection Distribui sobre Union:**
```typescript
type A = { a: string };
type B = { b: number };
type C = { c: boolean };

type Union = A | B;
type Resultado = Union & C;
// Resultado = (A & C) | (B & C)
// = { a: string; c: boolean } | { b: number; c: boolean }
```

**Conceito:** `(A | B) & C` = `(A & C) | (B & C)` - intersection distribui.

### Never em Intersections

**Intersection com Never:**
```typescript
type A = { x: number };
type B = never;

type AB = A & B;
// AB = never (intersection com never é never)
```

**Union com Never:**
```typescript
type A = { x: number };
type B = never;

type AouB = A | B;
// AouB = A (union com never ignora never)
```

**Conceito:** `never` é **elemento absorvente** de intersection; **elemento neutro** de union.

### Combinando Ambos

**Patterns Complexos:**
```typescript
type Base = { id: number };
type ComNome = { nome: string };
type ComEmail = { email: string };

// Intersection de Union
type Usuario = Base & (ComNome | ComEmail);
// Usuario = { id: number; nome: string } | { id: number; email: string }
// Deve ter id E (nome OU email)

const u1: Usuario = { id: 1, nome: "João" };      // OK
const u2: Usuario = { id: 2, email: "maria@..." }; // OK
const u3: Usuario = { id: 3, nome: "Ana", email: "ana@..." }; // OK
```

```typescript
// Union de Intersection
type A = { a: string } & { b: number };
type B = { c: boolean } & { d: string };

type AouB = A | B;
// AouB = { a: string; b: number } | { c: boolean; d: string }
// Pode ser (a E b) OU (c E d)
```

## 🎯 Padrões de Decision

### Decision Tree

```
Preciso modelar...
├─ Valor que DEVE ter múltiplas capacidades
│  └─ Use INTERSECTION (&)
│     Exemplo: Usuario & Autenticavel & Permissoes
│
└─ Valor que PODE ser uma de várias opções
   └─ Use UNION (|)
      Exemplo: string | number | boolean
```

### Checklist

**Use Intersection se:**
- ☑ Valor deve satisfazer múltiplos contratos simultaneamente
- ☑ Está compondo capacidades/comportamentos
- ☑ Está estendendo tipo base com propriedades adicionais
- ☑ Quer agregar propriedades de múltiplos tipos

**Use Union se:**
- ☑ Valor pode ser uma de várias alternativas
- ☑ Está modelando estados mutuamente exclusivos
- ☑ Precisa aceitar múltiplos tipos primitivos
- ☑ Está criando discriminated unions

## ⚠️ Armadilhas Comuns

### 1. Confundir Semântica

```typescript
// ❌ ERRO CONCEITUAL - queria alternativas mas usou intersection
type Id = string & number;  // never (impossível)

// ✅ CORRETO - alternativas com union
type Id = string | number;  // OK
```

### 2. Intersection de Primitivos

```typescript
// ❌ Sempre resulta em never
type Impossivel = string & number;

// ✅ Use union
type Possivel = string | number;
```

### 3. Propriedades Conflitantes

```typescript
// ❌ Conflito de tipos
type A = { id: string };
type B = { id: number };
type AB = A & B;  // { id: never }

// ✅ Use union ou renomeie
type AouB = A | B;  // OK - alternativas
```

## 📚 Conclusão

**Intersection e Union são operações duais** do sistema de tipos: Intersection (`&`) combina tipos exigindo **todas as características simultaneamente** (E lógico); Union (`|`) aceita **qualquer uma das alternativas** (OU lógico). Escolha depende se está **compondo capacidades** (intersection) ou **modelando alternativas** (union).

**Regras de Ouro:**
1. **Intersection = "E"**: Valor deve satisfazer TODOS os tipos
2. **Union = "OU"**: Valor pode satisfazer QUALQUER UM
3. **Objetos**: Intersection agrega; Union oferece alternativas
4. **Primitivos**: Intersection diferentes = `never`; Union = válido
5. **Composição**: Use intersection
6. **Alternativas**: Use union

**Intersection & Union = ferramentas complementares para modelagem precisa de domínios complexos.**
