# Anotação de Tipo de Variáveis: Contratos Explícitos de Tipo

## 🎯 Introdução e Definição

Anotação de tipo de variável é **declaração explícita do tipo** que uma variável deve conter, especificada através de sintaxe `: Tipo` após identificador da variável. Conceitualmente, representa **contrato formal entre desenvolvedor e compilador**: desenvolvedor promete que variável conterá apenas valores do tipo especificado; compilador verifica e **garante type safety em compile-time**, prevenindo atribuições incompatíveis e erros de tipo em runtime.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Sintaxe Fundamental:** `variavel: Tipo = valor`
2. **Contrato de Tipo:** Declaração vinculante verificada pelo compilador
3. **Type Safety:** Proteção contra erros de tipo
4. **vs. Inferência:** Explícito quando inferência é insuficiente ou ambígua
5. **Documentação Viva:** Anotações comunicam intenção e restrições

**Conceito Central:** Anotação de tipo é **especificação de contrato** - transforma variável JavaScript dinâmica em variável TypeScript type-safe.

## 🧠 Fundamentos Teóricos

### Sintaxe Básica

**Estrutura:**
```typescript
let identificador: Tipo = valor;
const identificador: Tipo = valor;
```

**Componentes:**
- **Identificador:** Nome da variável
- **`:` (dois pontos):** Separador sintático
- **Tipo:** Nome do tipo (primitivo, union, interface, etc.)
- **`= valor`:** Inicialização (opcional com `let`, obrigatória com `const`)

### Tipos Primitivos

**Anotação de Primitivos:**
```typescript
let idade: number = 30;
let nome: string = "João";
let ativo: boolean = true;
let vazio: null = null;
let indefinido: undefined = undefined;
let identificador: symbol = Symbol("id");
let grande: bigint = 100n;
```

**Verificação em Compile-Time:**
```typescript
let contador: number = 10;
contador = 20;        // OK - number
// contador = "20";   // ERRO: Type 'string' is not assignable to type 'number'
```

**Conceito:** TypeScript previne atribuições incompatíveis **antes** do código executar.

### Arrays Tipados

**Duas Sintaxes:**
```typescript
// Sintaxe 1: Tipo[] (preferida)
let numeros: number[] = [1, 2, 3];
let nomes: string[] = ["Ana", "Bruno"];

// Sintaxe 2: Array<Tipo> (generic)
let valores: Array<number> = [10, 20, 30];
```

**Arrays Heterogêneos (Union):**
```typescript
let misto: (string | number)[] = ["texto", 42, "outro", 99];
```

**Arrays Multidimensionais:**
```typescript
let matriz: number[][] = [
  [1, 2, 3],
  [4, 5, 6]
];
```

### Objetos Tipados

**Anotação Inline:**
```typescript
let pessoa: { nome: string; idade: number } = {
  nome: "Maria",
  idade: 25
};
```

**Propriedades Opcionais:**
```typescript
let config: { url: string; timeout?: number } = {
  url: "https://api.com"
  // timeout é opcional
};
```

**Propriedades Readonly:**
```typescript
let constante: { readonly id: number; valor: string } = {
  id: 1,
  valor: "teste"
};

// constante.id = 2;  // ERRO: Cannot assign to 'id' because it is a read-only property
constante.valor = "novo";  // OK
```

### Union Types

**Conceito:** Variável pode conter **um de múltiplos tipos**.

**Sintaxe:**
```typescript
let resultado: string | number;

resultado = "sucesso";  // OK
resultado = 200;        // OK
// resultado = true;    // ERRO: Type 'boolean' is not assignable
```

**Union com null/undefined:**
```typescript
let opcional: string | null = null;
opcional = "valor";  // OK
opcional = null;     // OK
```

**Múltiplos Tipos:**
```typescript
let valor: string | number | boolean = "texto";
valor = 42;     // OK
valor = false;  // OK
```

### Type Aliases

**Conceito:** Nomear tipo complexo para reutilização.

**Sintaxe:**
```typescript
type Usuario = {
  nome: string;
  email: string;
  idade?: number;
};

let admin: Usuario = {
  nome: "Admin",
  email: "admin@exemplo.com"
};

let usuario: Usuario = {
  nome: "João",
  email: "joao@exemplo.com",
  idade: 30
};
```

**Benefício:** DRY - definir tipo uma vez, usar em múltiplos lugares.

### Interfaces

**Conceito:** Definir estrutura de objeto reutilizável.

**Sintaxe:**
```typescript
interface Produto {
  id: number;
  nome: string;
  preco: number;
  desconto?: number;
}

let produto: Produto = {
  id: 1,
  nome: "Notebook",
  preco: 2500
};
```

**Diferença vs. Type Alias:** Interfaces são extensíveis; types são sealed (veremos em módulo dedicado).

## 🔍 Análise Conceitual Profunda

### Declaração sem Inicialização

**Com `let` (sem inicialização):**
```typescript
let nome: string;  // Declarado mas não inicializado
// console.log(nome);  // ERRO: Variable 'nome' is used before being assigned

nome = "João";  // Inicialização posterior
console.log(nome);  // OK
```

**Com `const`:**
```typescript
// const valor: number;  // ERRO: 'const' declarations must be initialized
const valor: number = 42;  // Obrigatório inicializar
```

**Conceito:** `const` exige inicialização imediata; `let` permite declaração e inicialização separadas.

### Inicialização Posterior com Union

**Pattern Comum:**
```typescript
let resultado: string | null = null;  // Inicialização com null

function buscar() {
  resultado = "dados encontrados";  // Atribuição posterior
}
```

**Uso:** Variáveis que recebem valor condicionalmente ou assincronamente.

### Type Widening e Narrowing

**Widening com `let`:**
```typescript
let x = 10;  // Tipo inferido: number (amplo)

let y: 10 = 10;  // Tipo explícito: 10 (literal)
// y = 20;  // ERRO: Type '20' is not assignable to type '10'
```

**Narrowing com Anotação:**
```typescript
let cor: "vermelho" | "azul" | "verde";

cor = "vermelho";  // OK
// cor = "amarelo";  // ERRO: Type '"amarelo"' is not assignable
```

**Conceito:** Anotação pode ser mais restritiva que inferência natural.

### Anotações Redundantes

**Inferência Óbvia:**
```typescript
// ❌ Redundante
let numero: number = 42;

// ✅ Inferência suficiente
let numero = 42;
```

**Quando Anotar:**
```typescript
// ✅ Necessário - sem inicialização
let resultado: string;

// ✅ Necessário - restringir tipo
let status: "ativo" | "inativo" = "ativo";

// ✅ Útil - documentação
let configuracao: ConfigAPI = loadConfig();
```

## 🎯 Aplicabilidade

### Quando Anotar Explicitamente

**1. Declaração sem Inicialização:**
```typescript
let token: string;
if (authenticated) {
  token = generateToken();
}
```

**2. Restringir Tipo Mais que Inferência:**
```typescript
let status: "pendente" | "completo" = "pendente";
// Sem anotação, seria inferido como string (muito amplo)
```

**3. Documentação de Intent:**
```typescript
let usuarios: Usuario[] = [];
// Explícito que é array de Usuario, não any[]
```

**4. APIs Públicas:**
```typescript
export let configuracaoGlobal: AppConfig = defaultConfig;
// API pública deve ter tipo explícito para consumidores
```

### Quando Confiar em Inferência

**Valores Primitivos Óbvios:**
```typescript
let contador = 0;         // number óbvio
let mensagem = "Olá";     // string óbvio
let ativo = true;         // boolean óbvio
```

**Retorno de Funções Tipadas:**
```typescript
function obterIdade(): number {
  return 30;
}

let idade = obterIdade();  // Inferido como number
```

## 🎯 Padrões Recomendados

### Preferir Inferência quando Possível

**Código Limpo:**
```typescript
// ✅ Conciso e claro
const nome = "João";
const idade = 30;
const ativo = true;

// ❌ Verboso sem benefício
const nome: string = "João";
const idade: number = 30;
const ativo: boolean = true;
```

### Anotar em Fronteiras de Módulo

**Exports:**
```typescript
// ✅ APIs públicas anotadas
export let estado: EstadoApp = estadoInicial;
export const TIMEOUT: number = 5000;
```

**Imports de JavaScript:**
```typescript
// ✅ Tipar dados externos
import dados from "./data.json";
const usuarios: Usuario[] = dados.usuarios;
```

### Anotar Variáveis de Longa Vida

**Estado Mutável:**
```typescript
class Aplicacao {
  // ✅ Properties de classe sempre anotadas
  private usuario: Usuario | null = null;
  private configuracao: Config;

  constructor(config: Config) {
    this.configuracao = config;
  }
}
```

## ⚠️ Armadilhas Comuns

### 1. Anotação Incorreta

```typescript
let numeros: number[] = [1, 2, "3"];  // ERRO: Type 'string' is not assignable
```

**Lição:** Anotação deve refletir valores reais.

### 2. Anotação Muito Permissiva

```typescript
// ❌ Muito amplo - perde type safety
let resultado: any = calcular();

// ✅ Específico
let resultado: number = calcular();
```

### 3. Esquecer Anotação em Declaração sem Inicialização

```typescript
let token;  // Tipo inferido: any (perigoso!)
token = "abc123";  // Ainda any

// ✅ Anotar explicitamente
let token: string;
```

### 4. Confundir Anotação com Conversão

```typescript
let texto: string = 42;  // ERRO: não converte, apenas verifica tipo
```

**Conceito:** Anotação **não converte valor**, apenas declara contrato.

## 🔗 Interconexões Conceituais

**Relacionado a:**
- **Type Inference:** Anotação complementa inferência
- **Type Aliases/Interfaces:** Definem tipos reutilizáveis para anotações
- **Union/Intersection Types:** Tipos complexos usados em anotações
- **Generics:** Anotações parametrizadas

**Progressão de Aprendizado:**
Anotação de variáveis é fundação para anotar parâmetros, retornos, propriedades de classes - mesmo padrão sintático aplicado a diferentes contextos.

## 🚀 Evolução e Próximos Conceitos

**Após dominar anotações básicas:**
- **Anotação de Parâmetros:** Aplicar `: Tipo` a funções
- **Anotação de Retorno:** Especificar tipo que função retorna
- **Generics:** Anotações parametrizadas `<T>`
- **Tipos Avançados:** Conditional types, mapped types

## 📚 Conclusão

**Anotação de tipo de variáveis** é mecanismo fundamental do TypeScript: transforma código JavaScript dinâmico em código type-safe através de **contratos explícitos de tipo**. Compilador verifica que valores atribuídos respeitam contrato, prevenindo erros em compile-time.

**Princípios de Uso:**
1. **Anotar quando necessário:** Sem inicialização, tipos restritos, APIs públicas
2. **Confiar em inferência quando óbvio:** Primitivos com inicialização
3. **Documentação viva:** Anotações comunicam intenção
4. **Type safety sobre conveniência:** Preferir tipos específicos a `any`

**Anotação explícita + inferência inteligente = código TypeScript conciso e seguro.**
