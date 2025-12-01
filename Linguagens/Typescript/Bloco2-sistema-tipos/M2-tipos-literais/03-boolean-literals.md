# Boolean Literals: true e false como Tipos Distintos

## 🎯 Introdução e Definição

Boolean literal type é **tipo TypeScript que representa valor booleano específico** - `true` OU `false`, não ambos. Enquanto tipo `boolean` representa **união de ambos os valores** (`true | false`), literal types `true` e `false` são **tipos distintos e mutuamente exclusivos**. Conceitualmente, representam **refinamento máximo de tipo booleano**: de dois valores possíveis para **singleton contendo único valor**. Boolean literals são cruciais para flags type-safe, estados binários explícitos e discriminated unions baseadas em condições.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **`true` e `false` como Tipos:** Não apenas valores, mas tipos distintos
2. **`boolean` = `true | false`:** Tipo booleano é união de literais
3. **Refinamento Binário:** Cada literal exclui o outro
4. **Type Guards Naturais:** Condicionais narrowam automaticamente
5. **Flags Explícitas:** Tipo documenta estado esperado
6. **Discriminated Unions:** Booleanos como discriminantes

**Conceito Central:** Boolean literals transformam **verdade/falsidade em tipos** - contratos que aceitam apenas um valor booleano específico.

## 🧠 Fundamentos Teóricos

### Sintaxe Básica

**Literal `true`:**
```typescript
let ativo: true;
ativo = true;      // OK
// ativo = false;  // ERRO: Type 'false' is not assignable to type 'true'
```

**Literal `false`:**
```typescript
let inativo: false;
inativo = false;   // OK
// inativo = true; // ERRO: Type 'true' is not assignable to type 'false'
```

**Conceito:** `true` e `false` são tipos incompatíveis entre si.

### boolean vs. Boolean Literals

**Tipo Amplo (`boolean`):**
```typescript
let flag: boolean;
flag = true;       // OK
flag = false;      // OK
// Ambos os valores possíveis
```

**Equivalência:**
```typescript
type Boolean = true | false;
// 'boolean' é açúcar sintático para 'true | false'
```

**Literal Específico:**
```typescript
let sempre: true;
sempre = true;     // Única possibilidade

let nunca: false;
nunca = false;     // Única possibilidade
```

**Hierarquia:**
```typescript
let literalTrue: true = true;
let geral: boolean = literalTrue;  // OK - upcast

let geral2: boolean = true;
// let literal2: true = geral2;    // ERRO - downcast inseguro
```

### Inferência de Boolean Literals

**Com `const`:**
```typescript
const ativo = true;   // Tipo inferido: true (literal)
const inativo = false; // Tipo inferido: false (literal)
```

**Com `let`:**
```typescript
let ativo = true;     // Tipo inferido: boolean (widening)
let inativo = false;  // Tipo inferido: boolean (widening)
```

**Conceito:** `const` não pode ser reatribuído, então TypeScript infere literal exato; `let` pode mudar, então infere `boolean` (união).

**Prevenir Widening:**
```typescript
let ativo = true as const;   // Tipo: true (literal)
// ativo = false;  // ERRO
```

### Union com Boolean Literals

**Explicitamente Redundante:**
```typescript
type Flag = true | false;  // Equivalente a 'boolean'
```

**Com Outros Tipos:**
```typescript
type Resultado = true | string;
// true (sucesso) ou string (mensagem de erro)

let resultado: Resultado;
resultado = true;              // OK
resultado = "erro de validação"; // OK
// resultado = false;           // ERRO: false não está na union
```

**Conceito:** Boolean literals são úteis quando **apenas um dos valores** faz parte de union.

## 🔍 Análise Conceitual Profunda

### Boolean Literals em Objetos

**Flags Explícitas:**
```typescript
type ConfigSegura = {
  readonly habilitado: true;  // Sempre habilitado
  timeout: number;
};

const config: ConfigSegura = {
  habilitado: true,  // Deve ser true
  timeout: 5000
};
```

**Discriminated Unions:**
```typescript
type Sucesso = {
  sucesso: true;
  dados: string[];
};

type Falha = {
  sucesso: false;
  erro: string;
};

type Resultado = Sucesso | Falha;

function processar(resultado: Resultado) {
  if (resultado.sucesso) {
    // resultado: Sucesso
    console.log(resultado.dados);
  } else {
    // resultado: Falha
    console.log(resultado.erro);
  }
}
```

**Conceito:** Propriedade booleana literal serve como **discriminante perfeito** - two-way split.

### Estados Binários Explícitos

**Autenticação:**
```typescript
type Autenticado = {
  autenticado: true;
  usuario: Usuario;
  token: string;
};

type NaoAutenticado = {
  autenticado: false;
};

type EstadoAuth = Autenticado | NaoAutenticado;
```

**Conceito:** Tipo força que `autenticado: true` vem com dados adicionais; `false` não tem dados.

**Conexão:**
```typescript
type Conectado = {
  conectado: true;
  socket: WebSocket;
  timestamp: number;
};

type Desconectado = {
  conectado: false;
  ultimaConexao?: Date;
};

type EstadoConexao = Conectado | Desconectado;
```

### Narrowing Automático com Booleanos

**Type Guard Natural:**
```typescript
type Opcional = {
  presente: boolean;
  valor?: string;
};

function processar(dado: Opcional) {
  if (dado.presente) {
    // TypeScript NÃO narrowa 'presente' para 'true' automaticamente
    // dado.presente ainda é 'boolean'
  }
}
```

**Com Literal:**
```typescript
type Presente = { presente: true; valor: string };
type Ausente = { presente: false };
type Opcional = Presente | Ausente;

function processar(dado: Opcional) {
  if (dado.presente) {
    // dado: Presente (narrowed!)
    console.log(dado.valor);  // Type-safe
  } else {
    // dado: Ausente
  }
}
```

**Diferença Crucial:** Boolean literal em discriminated union permite narrowing; `boolean` genérico não permite.

### Assertion Functions com Boolean

**Validação Type-Safe:**
```typescript
function assertTrue(valor: boolean): asserts valor is true {
  if (valor !== true) {
    throw new Error("Valor não é true");
  }
}

function processar(flag: boolean) {
  assertTrue(flag);
  // flag: true (narrowed após assertion)
}
```

**Conceito:** Assertion function pode narrow `boolean` para `true` ou `false`.

## 🎯 Aplicabilidade

### Quando Usar Boolean Literals

**1. Discriminated Unions (Padrão Mais Comum):**
```typescript
type Loading = { loading: true };
type Ready = { loading: false; data: string[] };
type Estado = Loading | Ready;
```

**2. Flags Sempre Ativas:**
```typescript
type ProducaoConfig = {
  readonly producao: true;
  readonly debug: false;
  apiUrl: string;
};
```

**3. Estados Binários com Dados Associados:**
```typescript
type Validado = {
  valido: true;
  dados: DadosValidados;
};

type Invalido = {
  valido: false;
  erros: string[];
};

type ResultadoValidacao = Validado | Invalido;
```

**4. Respostas de API:**
```typescript
type RespostaSucesso = {
  ok: true;
  status: 200;
  body: any;
};

type RespostaErro = {
  ok: false;
  status: number;
  mensagem: string;
};

type Resposta = RespostaSucesso | RespostaErro;
```

**5. Feature Flags Type-Safe:**
```typescript
type Features = {
  novoLayout: true | false;
  pagamentoPix: true;  // Sempre habilitado
  modoEscuro: true | false;
};
```

### Padrão: Discriminated Union

**Template Comum:**
```typescript
type Carregando = {
  estado: "carregando";
  progresso?: number;
};

type Sucesso = {
  estado: "sucesso";
  dados: T;
};

type Erro = {
  estado: "erro";
  mensagem: string;
};

type Estado<T> = Carregando | Sucesso | Erro;
```

**Alternativa com Boolean:**
```typescript
type Carregando = {
  completo: false;
  progresso?: number;
};

type Completo<T> = {
  completo: true;
  dados: T;
  erro?: never;
};

type Estado<T> = Carregando | Completo<T>;
```

**Vantagens String Literals:** Mais de dois estados possíveis.
**Vantagens Boolean Literals:** Binário claro, narrowing natural em `if`.

## 🎯 Padrões Recomendados

### Usar em Discriminated Unions

```typescript
// ✅ Boolean literal como discriminante
type Resultado =
  | { sucesso: true; valor: number }
  | { sucesso: false; erro: string };
```

### Documentar Flags Constantes

```typescript
const CONFIG = {
  DEBUG: false,
  PRODUCAO: true,
  SSL_OBRIGATORIO: true
} as const;

// CONFIG.PRODUCAO: true (literal, não boolean)
```

### Preferir String Literals para Multi-Estado

```typescript
// ❌ Múltiplos booleanos confusos
type Estado = {
  carregando: boolean;
  erro: boolean;
  sucesso: boolean;
};

// ✅ String literal claro
type Estado = "carregando" | "erro" | "sucesso";
```

## ⚠️ Armadilhas Comuns

### 1. Widening com `let`

```typescript
let ativo = true;  // Tipo: boolean (não true)

type Configuracao = { ativo: true };
// let config: Configuracao = { ativo };  // ERRO

// ✅ Solução: usar const ou as const
const ativo2 = true;  // Tipo: true
let config: Configuracao = { ativo: ativo2 };  // OK
```

### 2. Boolean Genérico Não Narrowa

```typescript
type Dado = {
  valido: boolean;
  valor: string;
};

function processar(dado: Dado) {
  if (dado.valido) {
    // dado.valido ainda é 'boolean' (não narrowed para 'true')
    // Não há garantia de tipo aqui
  }
}
```

**Solução:** Usar discriminated union com literais.

### 3. Negação de Literal

```typescript
let flag: true = true;

if (!flag) {
  // Bloco nunca executa, mas TypeScript pode não detectar
  // !flag seria 'false', mas flag é sempre 'true'
}
```

### 4. Comparações Desnecessárias

```typescript
let sempre: true = true;

if (sempre === true) {  // Redundante - sempre true
  // ...
}

// Melhor:
if (sempre) {  // Mais simples
  // ...
}
```

## 🔗 Interconexões Conceituais

**Relacionado a:**
- **Union Types:** Boolean literals em unions
- **Discriminated Unions:** Boolean como discriminante
- **Type Narrowing:** Condicionais narrowam naturalmente
- **Control Flow Analysis:** Booleanos guiam fluxo
- **Assertion Functions:** Narrow para true/false

**Progressão:**
Boolean literal → Discriminated union → Pattern matching type-safe → Estado complexo

## 🚀 Evolução e Próximos Conceitos

**Após dominar boolean literals:**
- **Discriminated Unions Complexas:** Combinar com strings/numbers
- **State Machines:** Modelar máquinas de estado com types
- **Branded Booleans:** Tipos nomeados para semântica clara

## 📚 Conclusão

**Boolean literal types** (`true` e `false`) são tipos distintos que permitem **type safety extremo** com valores booleanos. São especialmente poderosos em **discriminated unions**, onde servem como discriminantes naturais para divisão binária de tipos.

**Conceitos Fundamentais:**
1. **`true` ≠ `false`:** Tipos incompatíveis e mutuamente exclusivos
2. **`boolean` = `true | false`:** União dos literais
3. **Discriminated Unions:** Boolean literal como discriminante eficaz
4. **Narrowing Natural:** `if (flag)` narrowa em unions
5. **Estados Binários:** Tipo força dados associados com cada estado
6. **`as const`:** Forçar inferência de literal

**Boolean literals = discriminação binária perfeita + type safety + padrão elegante para sucesso/erro.**
