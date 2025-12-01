# Properties Opcionais em Interface

## 🎯 Introdução e Definição

### Definição Conceitual

**Properties opcionais** em interfaces TypeScript são members que podem ou não estar presentes em objetos que implementam a interface. São declaradas usando o **optional modifier** (`?`) após o nome da property. Isso permite definir contratos flexíveis onde algumas properties são **required** (obrigatórias) e outras são **optional** (opcionais), sem forçar implementadores a fornecer valores para properties que podem não fazer sentido em todos os contextos.

Conceitualmente, properties opcionais implementam **partial contracts** (contratos parciais): definem estrutura desejável mas não estritamente necessária. O tipo resultante de uma optional property é automaticamente uma **union** entre o tipo declarado e `undefined` (ex: `number?` se torna `number | undefined`), refletindo que valor pode estar ausente.

### Contexto Histórico e Motivação

A evolução de optional properties:

**Smalltalk (1980):** Não tinha tipagem estática, então todas properties eram efetivamente "opcionais" em runtime.

**Java (1995):** Não tinha optional fields nativamente - usava `null` para indicar ausência, mas isso não era expressado no sistema de tipos.

**C# 2.0 (2005):** Introduziu **nullable types** (`int?`) que eram union de `T | null`, aproximando conceito de optional.

**TypeScript 0.9 (2013):** Introduziu **optional parameters** em funções com `?`.

**TypeScript 1.0 (2014):** Estendeu `?` para **optional properties** em interfaces e object types.

**Swift (2014):** Popularizou **optionals** como tipo de primeira classe (`Optional<T>`), influenciando design de linguagens modernas.

A motivação era **flexibility without unsafety**: permitir que interfaces descrevam objetos com estruturas variáveis (onde nem todas properties sempre fazem sentido) mantendo **type safety** - compilador sabe que property pode não existir e força verificação antes de uso.

### Problema Fundamental que Resolve

Properties opcionais resolvem problemas críticos:

**1. Configuration Objects:** Objetos de configuração onde muitas properties têm defaults e são opcionais.

**2. Partial Data:** Dados que podem vir incompletos (ex: formulários parcialmente preenchidos).

**3. API Responses:** Responses de APIs podem ter fields opcionais baseado em condições.

**4. Backward Compatibility:** Adicionar novas properties a interface sem quebrar código existente.

**5. Conditional Fields:** Properties que só existem sob certas condições.

**6. Progressive Enhancement:** Começar com minimum viable object e adicionar properties conforme necessário.

### Importância no Ecossistema

Properties opcionais são fundamentais porque:

- **Configuration APIs:** Frameworks usam heavily (ex: Angular `@Component` options, React props)
- **REST APIs:** Modelar responses onde fields podem estar ausentes
- **Form Handling:** Representar formulários parcialmente preenchidos
- **Default Values:** Permitir omitir properties que têm defaults
- **Type Safety:** Compilador força checagem antes de acessar optional properties

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Optional Modifier:** `?` após nome da property torna-a opcional
2. **Union Type:** Property opcional tem tipo `T | undefined`
3. **Presence Check:** Deve-se verificar presença antes de usar
4. **Default Values:** Opcionais permitem usar defaults quando ausente
5. **Partial Compatibility:** Objeto pode ter subset das properties

### Pilares Fundamentais

- **Syntax:** `propertyName?: Type`
- **Type:** `Type | undefined` implicitamente
- **Assignment:** Pode omitir property em object literal
- **Access:** Pode retornar `undefined` se ausente
- **Optional Chaining:** `obj.prop?.subprop` para acesso seguro

### Visão Geral das Nuances

- **Undefined vs Missing:** Property ausente é diferente de property com valor `undefined`
- **Excess Property Checking:** Ainda aplicado em object literals
- **Readonly + Optional:** Podem ser combinados (`readonly prop?: Type`)
- **Strict Null Checks:** Comportamento muda com `strictNullChecks`

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Quando TypeScript compila optional properties:

**1. Parsing:** Identifica `?` após property name na interface declaration.

**2. Type Construction:** Cria tipo `T | undefined` para property (onde `T` é tipo declarado).

**3. Type Checking (Assignment):**
   - Objeto pode omitir property completamente
   - Ou fornecer valor de tipo `T`
   - Ou explicitamente fornecer `undefined`

**4. Type Checking (Access):**
   - Acesso a property retorna tipo `T | undefined`
   - Com `strictNullChecks`, força verificação antes de usar como `T`

**5. Code Generation:** JavaScript resultante é idêntico - optional é conceito de compile-time.

### Princípios e Conceitos Subjacentes

#### Optional como Union Type

Optional property é **syntactic sugar** para union com `undefined`:

```typescript
interface Usuario {
  nome: string;
  idade?: number; // Equivalente a: idade: number | undefined
}

// Todos válidos
const u1: Usuario = { nome: "Ana" }; // idade ausente
const u2: Usuario = { nome: "João", idade: 25 }; // idade presente
const u3: Usuario = { nome: "Maria", idade: undefined }; // explicitamente undefined

// Tipo de acesso
function processar(usuario: Usuario): void {
  // usuario.idade tem tipo: number | undefined
  const idade: number | undefined = usuario.idade;
  
  // Erro sem verificação
  // const dobro = usuario.idade * 2; // ❌ Object is possibly 'undefined'
  
  // Com verificação
  if (usuario.idade !== undefined) {
    const dobro = usuario.idade * 2; // ✅ OK - narrowed para number
  }
}
```

**Fundamento conceitual:** `?` é abreviação para `| undefined`. Compilador trata optional properties como union types.

#### Presence vs Value

Há diferença sutil entre **property ausente** e **property com valor `undefined`**:

```typescript
interface Config {
  debug?: boolean;
}

const config1: Config = {}; // debug ausente
const config2: Config = { debug: undefined }; // debug presente mas undefined

// Em runtime
console.log("debug" in config1); // false - ausente
console.log("debug" in config2); // true - presente

console.log(config1.debug); // undefined
console.log(config2.debug); // undefined

// Ambos têm mesmo tipo para TypeScript
```

**Análise profunda:** Para TypeScript, **ausente** e **undefined** são tratados igualmente (ambos `T | undefined`). Mas em runtime, `in` operator distingue.

#### Optional Chaining

TypeScript fornece `?.` para acessar optional properties de forma segura:

```typescript
interface Pessoa {
  nome: string;
  endereco?: {
    rua: string;
    cidade: string;
  };
}

function obterCidade(pessoa: Pessoa): string | undefined {
  // Sem optional chaining
  // return pessoa.endereco.cidade; // ❌ Erro: Object is possibly 'undefined'
  
  // Com verificação manual
  if (pessoa.endereco !== undefined) {
    return pessoa.endereco.cidade;
  }
  return undefined;
  
  // Com optional chaining - equivalente
  return pessoa.endereco?.cidade;
}

const p1: Pessoa = { nome: "Ana" };
const p2: Pessoa = { nome: "João", endereco: { rua: "A", cidade: "SP" } };

console.log(obterCidade(p1)); // undefined
console.log(obterCidade(p2)); // "SP"
```

**Conceito crucial:** `?.` retorna `undefined` se property à esquerda for `null` ou `undefined`, caso contrário acessa property.

### Modelo Mental para Compreensão

Pense em optional properties como **campos opcionais em formulário**:

- **Required Field:** Nome (deve preencher)
- **Optional Field:** Telefone (pode deixar vazio)
- **Interface:** Template do formulário especificando quais campos são obrigatórios/opcionais
- **Object:** Formulário preenchido - pode omitir opcionais
- **Type Checking:** Validação que verifica campos obrigatórios estão presentes

Formulário é válido se todos campos obrigatórios estão preenchidos, mesmo que opcionais estejam vazios.

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica

```typescript
interface Produto {
  id: number;           // Required
  nome: string;         // Required
  descricao?: string;   // Optional
  preco?: number;       // Optional
}

// Válidos
const p1: Produto = { id: 1, nome: "Laptop" };
const p2: Produto = { id: 2, nome: "Mouse", preco: 50 };
const p3: Produto = { id: 3, nome: "Teclado", descricao: "Mecânico", preco: 300 };
const p4: Produto = { id: 4, nome: "Monitor", descricao: undefined, preco: undefined };

// Inválidos
// const p5: Produto = { id: 5 }; // ❌ Falta 'nome'
// const p6: Produto = { nome: "Webcam" }; // ❌ Falta 'id'
```

**Análise conceitual:** Properties sem `?` são obrigatórias. Properties com `?` podem ser omitidas.

### Accessing Optional Properties

```typescript
interface Config {
  host: string;
  porta?: number;
}

function conectar(config: Config): void {
  console.log(`Conectando a ${config.host}`);
  
  // Acesso direto - tipo é number | undefined
  const porta: number | undefined = config.porta;
  
  // Erro sem verificação
  // const portaString = config.porta.toString(); // ❌ Object is possibly 'undefined'
  
  // Com verificação
  if (config.porta !== undefined) {
    console.log(`Porta: ${config.porta.toString()}`); // ✅ OK
  }
  
  // Com default via nullish coalescing
  const portaFinal = config.porta ?? 3000;
  console.log(`Usando porta: ${portaFinal}`);
}

conectar({ host: "localhost" });
// Conectando a localhost
// Usando porta: 3000

conectar({ host: "api.com", porta: 443 });
// Conectando a api.com
// Porta: 443
// Usando porta: 443
```

**Fundamento teórico:** Acesso a optional property retorna `T | undefined`. Deve-se verificar ou usar default.

### Default Values com Destructuring

```typescript
interface Opcoes {
  timeout?: number;
  retry?: boolean;
  maxAttempts?: number;
}

function requisicao(url: string, opcoes: Opcoes = {}): void {
  // Destructuring com defaults
  const {
    timeout = 5000,
    retry = true,
    maxAttempts = 3
  } = opcoes;
  
  console.log(`URL: ${url}`);
  console.log(`Timeout: ${timeout}ms`);
  console.log(`Retry: ${retry}`);
  console.log(`Max Attempts: ${maxAttempts}`);
}

requisicao("https://api.com");
// Timeout: 5000ms, Retry: true, Max Attempts: 3

requisicao("https://api.com", { timeout: 10000 });
// Timeout: 10000ms, Retry: true, Max Attempts: 3

requisicao("https://api.com", { retry: false, maxAttempts: 1 });
// Timeout: 5000ms, Retry: false, Max Attempts: 1
```

**Conceito avançado:** Destructuring com defaults fornece valores fallback para optional properties ausentes.

### Optional com Readonly

```typescript
interface Entidade {
  readonly id: number;
  readonly criadoEm?: Date; // Readonly + Optional
  nome: string;
  descricao?: string;       // Apenas Optional
}

const entidade: Entidade = {
  id: 1,
  nome: "Teste"
  // criadoEm omitido
};

// entidade.id = 2; // ❌ Erro: readonly
entidade.nome = "Novo"; // ✅ OK

// Pode inicializar readonly optional
const entidade2: Entidade = {
  id: 2,
  nome: "Outro",
  criadoEm: new Date()
};

// entidade2.criadoEm = new Date(); // ❌ Erro: readonly
```

**Análise profunda:** `readonly` e `?` podem ser combinados. Property pode ser omitida, mas se fornecida, não pode ser modificada.

### Optional em Nested Objects

```typescript
interface Endereco {
  rua: string;
  numero?: number;
  complemento?: string;
  cidade: string;
}

interface Pessoa {
  nome: string;
  endereco?: Endereco; // Objeto opcional
}

const p1: Pessoa = {
  nome: "Ana"
  // endereco ausente
};

const p2: Pessoa = {
  nome: "João",
  endereco: {
    rua: "Av Principal",
    // numero omitido - optional
    cidade: "SP"
  }
};

const p3: Pessoa = {
  nome: "Maria",
  endereco: {
    rua: "Rua B",
    numero: 123,
    complemento: "Apto 45",
    cidade: "RJ"
  }
};

// Acesso seguro
function obterCidade(pessoa: Pessoa): string | undefined {
  return pessoa.endereco?.cidade;
}

console.log(obterCidade(p1)); // undefined
console.log(obterCidade(p2)); // "SP"
console.log(obterCidade(p3)); // "RJ"
```

**Fundamento conceitual:** Nested objects podem ser opcionais. Optional chaining facilita acesso seguro a properties aninhadas.

### Optional Parameters vs Properties

```typescript
interface Logger {
  log(mensagem: string, nivel?: string): void; // Parameter opcional
  nivel?: string;                              // Property opcional
}

class ConsoleLogger implements Logger {
  nivel?: string = "INFO";
  
  log(mensagem: string, nivel?: string): void {
    const nivelFinal = nivel ?? this.nivel ?? "DEBUG";
    console.log(`[${nivelFinal}] ${mensagem}`);
  }
}

const logger = new ConsoleLogger();
logger.log("Teste");              // [INFO] Teste
logger.log("Erro", "ERROR");      // [ERROR] Erro
```

**Análise teórica:** Optional parameters em methods e optional properties são conceitos similares - ambos podem ser omitidos.

### Type Guards para Optionals

```typescript
interface Dados {
  valor?: number;
}

function processar(dados: Dados): void {
  // Type guard com typeof
  if (typeof dados.valor === "number") {
    // Dentro, dados.valor é number (not undefined)
    const dobro = dados.valor * 2;
    console.log(dobro);
  }
  
  // Type guard com !== undefined
  if (dados.valor !== undefined) {
    const triplo = dados.valor * 3;
    console.log(triplo);
  }
  
  // Type guard com truthy check (cuidado com 0)
  if (dados.valor) {
    const quadruplo = dados.valor * 4;
    console.log(quadruplo);
  }
}

processar({ valor: 10 }); // 20, 30, 40
processar({ valor: 0 });  // 0, 0 (não entra no terceiro if)
processar({});            // (nada)
```

**Conceito crucial:** Type guards **narrow** tipo de `T | undefined` para `T`, permitindo uso seguro.

### Optional com Union Types

```typescript
interface Resposta {
  dados?: string | number | boolean; // Optional + Union
}

function processar(resposta: Resposta): void {
  // Tipo é: string | number | boolean | undefined
  if (resposta.dados !== undefined) {
    // Narrowed para: string | number | boolean
    if (typeof resposta.dados === "string") {
      console.log(resposta.dados.toUpperCase());
    } else if (typeof resposta.dados === "number") {
      console.log(resposta.dados.toFixed(2));
    } else {
      console.log(resposta.dados ? "true" : "false");
    }
  }
}

processar({ dados: "hello" });  // HELLO
processar({ dados: 3.14159 });  // 3.14
processar({ dados: true });     // true
processar({});                  // (nada)
```

**Análise profunda:** Optional pode ser combinado com union types. Tipo resultante é union de todos os tipos + `undefined`.

### Partial Utility Type

TypeScript fornece `Partial<T>` que torna todas properties opcionais:

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
  idade: number;
}

// Partial torna tudo opcional
type UsuarioParcial = Partial<Usuario>;
// Equivalente a:
// interface UsuarioParcial {
//   id?: number;
//   nome?: string;
//   email?: string;
//   idade?: number;
// }

function atualizar(id: number, dados: UsuarioParcial): void {
  console.log(`Atualizando usuário ${id} com:`, dados);
}

atualizar(1, { nome: "Novo Nome" });
atualizar(2, { idade: 26, email: "novo@example.com" });
atualizar(3, {}); // Nenhuma property - válido
```

**Conceito avançado:** `Partial<T>` é utility type que mapeia todas properties de `T` para opcionais.

### Excess Property Checking

```typescript
interface Config {
  host: string;
  porta?: number;
}

// ❌ Excess property checking em object literal
// const config: Config = {
//   host: "localhost",
//   porta: 3000,
//   ssl: true // Erro: Object literal may only specify known properties
// };

// ✅ Via variável - sem excess checking
const configObj = {
  host: "localhost",
  porta: 3000,
  ssl: true
};
const config: Config = configObj; // OK

// ✅ Type assertion
const config2: Config = {
  host: "localhost",
  porta: 3000,
  ssl: true
} as Config;
```

**Fundamento teórico:** TypeScript faz excess property checking em object literals diretos para pegar typos. Optional properties não desabilitam isso.

### Index Signatures com Optionals

```typescript
interface Flexivel {
  id: number;           // Required
  nome?: string;        // Optional
  [key: string]: string | number | undefined; // Index signature
}

const obj: Flexivel = {
  id: 1,
  // nome omitido
  extra1: "valor",
  extra2: 123
};

console.log(obj.id);     // 1
console.log(obj.nome);   // undefined
console.log(obj.extra1); // "valor"
```

**Análise teórica:** Index signature deve incluir `undefined` se há optional properties, pois elas podem ser `undefined`.

## 🎯 Aplicabilidade e Contextos

### Quando Usar Optional Properties

**1. Configuration Objects**
```typescript
interface AppConfig {
  apiUrl: string;
  timeout?: number;
  debug?: boolean;
}
```

**Raciocínio:** Muitas configs têm defaults, tornando-as opcionais.

**2. Partial Updates**
```typescript
interface UpdateUsuario {
  nome?: string;
  email?: string;
  senha?: string;
}
```

**Raciocínio:** Atualizar apenas fields específicos.

**3. API Responses**
```typescript
interface UsuarioAPI {
  id: number;
  nome: string;
  avatar?: string; // Pode não existir
}
```

**Raciocínio:** APIs podem retornar fields condicionalmente.

## ⚠️ Limitações e Considerações Teóricas

### Undefined vs Null

Optional é `T | undefined`, não `T | null`:

```typescript
interface Dados {
  valor?: number;
}

const d1: Dados = { valor: undefined }; // ✅ OK
// const d2: Dados = { valor: null }; // ❌ Erro (sem strictNullChecks: false)
```

**Solução:** Use union explícito: `valor?: number | null`.

### Falsy Values

Cuidado com truthy/falsy checks em optionals:

```typescript
interface Config {
  retry?: boolean;
}

function processar(config: Config): void {
  // ❌ Ruim - trata false como ausente
  if (config.retry) {
    console.log("Retry habilitado");
  }
  
  // ✅ Correto
  if (config.retry !== undefined) {
    console.log(config.retry ? "Habilitado" : "Desabilitado");
  }
}
```

### Performance

Optional properties têm zero overhead - conceito compile-time apenas.

## 🔗 Interconexões Conceituais

**Relação com Union Types:** Optional é sugar para `T | undefined`.

**Relação com Type Guards:** Narrowing necessário para usar optionals.

**Relação com Partial:** Utility type que torna tudo opcional.

**Relação com Nullish Coalescing:** `??` fornece defaults para optionals.

## 🚀 Evolução e Próximos Conceitos

Dominar optional properties prepara para:
- **Utility Types:** `Partial`, `Required`, `Pick`, `Omit`
- **Conditional Types:** Tipos que dependem de presence
- **Mapped Types:** Transformar required em optional
- **Strict Mode:** `strictNullChecks` e comportamento de optionals
