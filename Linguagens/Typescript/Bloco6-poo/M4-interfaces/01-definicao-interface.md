# Definição de Interface

## 🎯 Introdução e Definição

### Definição Conceitual

**Interface** em TypeScript é uma estrutura que define um **contrato** ou **shape** (formato) que objetos, classes ou funções devem seguir. Uma interface especifica **quais properties e methods** um tipo deve ter, sem fornecer implementação. É um mecanismo de **type checking** puro que existe apenas em **compile-time**, sendo completamente removido do código JavaScript resultante.

Conceitualmente, interfaces implementam **structural typing** (tipagem estrutural): se um objeto tem a estrutura correta (properties e methods com tipos corretos), ele satisfaz a interface, independentemente de declarar explicitamente que a implementa. Isso contrasta com **nominal typing** (tipagem nominal) onde tipos são compatíveis apenas se explicitamente relacionados.

### Contexto Histórico e Motivação

A evolução de interfaces na programação:

**Simula 67 (1967):** Introduziu conceito de classes, mas sem interfaces formais.

**Ada (1980):** Introduziu **packages** que separavam interface (especificação) de implementação.

**Java (1995):** Popularizou **interfaces** como contratos puros - tipos que definem métodos sem implementação, permitindo múltipla "herança" de comportamento.

**C# (2000):** Seguiu modelo Java, estabelecendo interfaces como cornerstone de design orientado a contrato.

**Go (2009):** Introduziu **implicit interfaces** - tipos satisfazem interface automaticamente se tiverem estrutura correta, sem declaração explícita.

**TypeScript (2012):** Combinou abordagem de Java (declaração explícita via `implements`) com **structural typing** de Go (compatibilidade baseada em estrutura). Interfaces existem apenas em compile-time para type checking.

A motivação era **separation of concerns**: separar **o que** um tipo deve fazer (interface/contrato) de **como** ele faz (implementação), permitindo múltiplas implementações do mesmo contrato e facilitando testes via **dependency injection**.

### Problema Fundamental que Resolve

Interfaces resolvem problemas críticos de design e type safety:

**1. Contratos de API:** Definir exatamente quais properties/methods consumidores podem esperar de um objeto.

**2. Polimorfismo:** Permitir que múltiplas classes diferentes implementem mesmo contrato, sendo intercambiáveis.

**3. Dependency Injection:** Depender de abstrações (interfaces) ao invés de implementações concretas.

**4. Documentation:** Interface serve como documentação formal da estrutura esperada.

**5. Type Safety:** Compilador verifica que objetos realmente têm estrutura requerida antes de runtime.

**6. Code Completion:** IDEs podem oferecer autocomplete baseado em interface.

### Importância no Ecossistema

Interfaces são fundamentais porque:

- **Type Checking:** Base do sistema de tipos TypeScript - verificar shapes de objetos
- **Framework Design:** APIs de frameworks (React, Angular) são definidas via interfaces (`Component`, `Props`, etc.)
- **Contract-Based Design:** Separação entre interface pública e implementação privada
- **Testing:** Mock objects implementam interfaces para testes
- **Code Reusability:** Múltiplas implementações de mesma interface

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Contrato Puro:** Interface define estrutura sem implementação
2. **Structural Typing:** Compatibilidade baseada em estrutura, não nome
3. **Compile-Time Only:** Interfaces não existem em runtime JavaScript
4. **Multiple Implementation:** Classe pode implementar múltiplas interfaces
5. **Extension:** Interfaces podem estender outras interfaces

### Pilares Fundamentais

- **Keyword interface:** Define nova interface
- **Property Signatures:** Declaram properties com tipos
- **Method Signatures:** Declaram methods com parâmetros e retorno
- **Optional Members:** Properties/methods opcionais com `?`
- **Readonly Members:** Properties que não podem ser modificadas

### Visão Geral das Nuances

- **Duck Typing:** "Se anda como pato e faz quack como pato, é um pato"
- **Excess Property Checking:** TypeScript é mais restrito em object literals
- **Index Signatures:** Permitir properties dinâmicas
- **Hybrid Types:** Interfaces que descrevem objetos callable/constructable

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Quando TypeScript compila interfaces:

**1. Parsing:** Identifica keyword `interface` e extrai estrutura (properties, methods, signatures).

**2. Type Checking:**
   - Verifica que objetos atribuídos a tipo interface têm todas as properties/methods requeridas
   - Valida que tipos de properties/methods são compatíveis
   - Aplica **structural typing** - checa estrutura, não nome de tipo

**3. Type Inference:** Inferir tipo de objeto literal e verificar compatibilidade com interface.

**4. Code Generation:** **Remove completamente interfaces** do JavaScript resultante. Interfaces são puramente compile-time.

**5. Declaration Files:** Interfaces aparecem em `.d.ts` files para fornecer type information para consumidores.

### Princípios e Conceitos Subjacentes

#### Structural Typing (Duck Typing)

TypeScript usa **structural typing**: compatibilidade é determinada por **estrutura**, não por declaração explícita:

```typescript
interface Ponto {
  x: number;
  y: number;
}

function desenharPonto(p: Ponto): void {
  console.log(`(${p.x}, ${p.y})`);
}

// Objeto literal que satisfaz estrutura
const ponto1 = { x: 10, y: 20 };
desenharPonto(ponto1); // ✅ Funciona! Tem estrutura correta

// Objeto com properties extras
const ponto2 = { x: 5, y: 15, z: 25, cor: "azul" };
desenharPonto(ponto2); // ✅ Também funciona! Tem pelo menos x e y

// Objeto incompatível
const invalido = { x: 10, altura: 20 };
// desenharPonto(invalido); // ❌ Erro: falta property 'y'
```

**Fundamento conceitual:** TypeScript não verifica se objeto "é um `Ponto`", mas sim se objeto **tem a estrutura** de `Ponto` (properties `x` e `y` do tipo `number`).

#### Separation of Contract and Implementation

Interface define **o que**, implementação define **como**:

```typescript
// Interface - o contrato
interface Armazenamento {
  salvar(chave: string, valor: string): void;
  buscar(chave: string): string | null;
  deletar(chave: string): boolean;
}

// Implementação 1 - LocalStorage
class ArmazenamentoLocal implements Armazenamento {
  salvar(chave: string, valor: string): void {
    localStorage.setItem(chave, valor);
  }
  
  buscar(chave: string): string | null {
    return localStorage.getItem(chave);
  }
  
  deletar(chave: string): boolean {
    if (localStorage.getItem(chave) !== null) {
      localStorage.removeItem(chave);
      return true;
    }
    return false;
  }
}

// Implementação 2 - In-Memory
class ArmazenamentoMemoria implements Armazenamento {
  private dados = new Map<string, string>();
  
  salvar(chave: string, valor: string): void {
    this.dados.set(chave, valor);
  }
  
  buscar(chave: string): string | null {
    return this.dados.get(chave) || null;
  }
  
  deletar(chave: string): boolean {
    return this.dados.delete(chave);
  }
}

// Função que depende de interface, não implementação
function processarDados(storage: Armazenamento): void {
  storage.salvar("user", "Ana");
  const user = storage.buscar("user");
  console.log(user);
}

// Pode usar qualquer implementação!
processarDados(new ArmazenamentoLocal());
processarDados(new ArmazenamentoMemoria());
```

**Análise profunda:** Código consumidor (`processarDados`) depende de **abstração** (`Armazenamento`), não de implementação concreta. Isso permite trocar implementações sem mudar consumidores.

#### Compile-Time vs Runtime

Interfaces existem **apenas em compile-time**:

```typescript
interface Usuario {
  nome: string;
  idade: number;
}

const usuario: Usuario = { nome: "Ana", idade: 25 };

// Em compile-time: TypeScript verifica estrutura
console.log(usuario.nome); // ✅ Type-safe

// Em runtime: interface desaparece
console.log(typeof usuario); // "object" (não "Usuario")
// if (usuario instanceof Usuario) {} // ❌ Erro: interface não existe em runtime
```

**JavaScript compilado:**
```javascript
// Interface desaparece completamente
const usuario = { nome: "Ana", idade: 25 };
console.log(usuario.nome);
```

**Conceito fundamental:** Interfaces são **type-level constructs** - ferramentas para TypeScript compiler verificar correção, mas zero overhead em runtime.

### Modelo Mental para Compreensão

Pense em interface como **blueprint arquitetônico** ou **contrato legal**:

- **Interface:** Contrato que especifica "casa deve ter 2 quartos, 1 banheiro, cozinha"
- **Implementação:** Casa real construída que satisfaz contrato
- **Type Checking:** Inspetor verifica se casa atende especificações do contrato
- **Runtime:** Contrato é descartado - apenas casa física (objeto) existe

Interface não constrói nada, apenas **descreve** como algo deve ser.

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica de Interface

```typescript
// Definição de interface
interface Pessoa {
  nome: string;
  idade: number;
}

// Uso com object literal
const pessoa1: Pessoa = {
  nome: "João",
  idade: 30
};

// Uso com variável
const pessoa2: Pessoa = {
  nome: "Maria",
  idade: 25
};

// Função que aceita interface
function saudar(pessoa: Pessoa): void {
  console.log(`Olá, ${pessoa.nome}!`);
}

saudar(pessoa1); // "Olá, João!"
saudar(pessoa2); // "Olá, Maria!"
```

**Análise conceitual:**
- `interface` keyword declara nova interface
- Properties são declaradas com `nome: tipo`
- Objetos devem ter exatamente as properties requeridas com tipos corretos

### Interface com Métodos

```typescript
interface Calculadora {
  somar(a: number, b: number): number;
  subtrair(a: number, b: number): number;
  multiplicar(a: number, b: number): number;
  dividir(a: number, b: number): number;
}

// Objeto literal implementando interface
const calc: Calculadora = {
  somar(a, b) { return a + b; },
  subtrair(a, b) { return a - b; },
  multiplicar(a, b) { return a * b; },
  dividir(a, b) { return a / b; }
};

console.log(calc.somar(10, 5)); // 15
console.log(calc.dividir(20, 4)); // 5
```

**Fundamento teórico:** Methods em interface são **signatures** - especificam parâmetros e tipo de retorno, mas não implementação.

### Optional Properties

```typescript
interface Configuracao {
  host: string;
  porta: number;
  timeout?: number; // Optional
  ssl?: boolean;    // Optional
}

// Todas as combinações válidas
const config1: Configuracao = {
  host: "localhost",
  porta: 3000
};

const config2: Configuracao = {
  host: "api.example.com",
  porta: 443,
  timeout: 5000,
  ssl: true
};

const config3: Configuracao = {
  host: "127.0.0.1",
  porta: 8080,
  ssl: false
  // timeout omitido - ok
};
```

**Conceito crucial:** `?` torna property opcional. Objeto pode ter ou não essa property.

### Readonly Properties

```typescript
interface PontoImutavel {
  readonly x: number;
  readonly y: number;
}

const ponto: PontoImutavel = { x: 10, y: 20 };

console.log(ponto.x); // 10

// ponto.x = 15; // ❌ Erro: Cannot assign to 'x' because it is read-only
```

**Análise profunda:** `readonly` impede modificação após inicialização. Garante imutabilidade.

### Function Type Interface

Interfaces podem descrever funções:

```typescript
// Interface para tipo de função
interface Comparador {
  (a: number, b: number): number;
}

// Função que satisfaz interface
const compararNumeros: Comparador = (a, b) => a - b;

const nums = [5, 2, 8, 1, 9];
nums.sort(compararNumeros); // [1, 2, 5, 8, 9]

// Outra implementação
const compararInverso: Comparador = (a, b) => b - a;
nums.sort(compararInverso); // [9, 8, 5, 2, 1]
```

**Fundamento conceitual:** Interface pode descrever **call signature** de função, definindo tipos de parâmetros e retorno.

### Index Signatures

Interfaces podem permitir properties dinâmicas:

```typescript
interface Dicionario {
  [chave: string]: string;
}

const traducao: Dicionario = {
  "hello": "olá",
  "world": "mundo",
  "goodbye": "tchau"
};

console.log(traducao["hello"]); // "olá"
traducao["thank you"] = "obrigado"; // ✅ Permitido
traducao["yes"] = "sim";
```

**Análise teórica:** `[chave: string]: tipo` permite qualquer property com chave de tipo `string` e valor do tipo especificado.

### Index Signatures com Properties Específicas

```typescript
interface UsuarioComMetadados {
  id: number;
  nome: string;
  [metadado: string]: string | number; // Index signature
}

const usuario: UsuarioComMetadados = {
  id: 1,
  nome: "Ana",
  email: "ana@example.com", // Property dinâmica
  telefone: "123456789",
  idade: 25
};

console.log(usuario.email); // "ana@example.com"
console.log(usuario["telefone"]); // "123456789"
```

**Conceito crucial:** Properties específicas (`id`, `nome`) devem ser compatíveis com index signature. Tipos devem ser subset do tipo da index signature.

### Extending Interfaces

Interfaces podem estender outras:

```typescript
interface Animal {
  nome: string;
  idade: number;
}

interface Cachorro extends Animal {
  raca: string;
  latir(): void;
}

const rex: Cachorro = {
  nome: "Rex",
  idade: 3,
  raca: "Labrador",
  latir() {
    console.log("Au au!");
  }
};

rex.latir(); // "Au au!"
console.log(rex.nome); // "Rex" - herdado de Animal
```

**Fundamento teórico:** `extends` copia todas as properties/methods da interface base. Interface derivada pode adicionar novas properties.

### Multiple Interface Extension

```typescript
interface Identificavel {
  id: number;
}

interface Nomeavel {
  nome: string;
}

interface Timestampavel {
  criadoEm: Date;
  atualizadoEm: Date;
}

// Estender múltiplas interfaces
interface Entidade extends Identificavel, Nomeavel, Timestampavel {
  ativo: boolean;
}

const entidade: Entidade = {
  id: 1,
  nome: "Produto XYZ",
  criadoEm: new Date(),
  atualizadoEm: new Date(),
  ativo: true
};
```

**Análise profunda:** Interface pode estender múltiplas interfaces, herdando todas as properties de todas elas. Isso permite **composição** de contratos.

### Interface para Classes

```typescript
interface Logger {
  log(mensagem: string): void;
  erro(mensagem: string): void;
  aviso(mensagem: string): void;
}

class ConsoleLogger implements Logger {
  log(mensagem: string): void {
    console.log(`[LOG] ${mensagem}`);
  }
  
  erro(mensagem: string): void {
    console.error(`[ERRO] ${mensagem}`);
  }
  
  aviso(mensagem: string): void {
    console.warn(`[AVISO] ${mensagem}`);
  }
}

const logger: Logger = new ConsoleLogger();
logger.log("Aplicação iniciada");
logger.erro("Falha na conexão");
```

**Conceito avançado:** Classe usa `implements` para declarar que implementa interface. TypeScript verifica que classe tem todos os members requeridos.

### Hybrid Types

Interfaces podem descrever objetos que são callable e têm properties:

```typescript
interface Contador {
  (inicio: number): string; // Callable
  intervalo: number;        // Property
  resetar(): void;          // Method
}

function criarContador(): Contador {
  const contador = (function(inicio: number) {
    return `Contando de ${inicio}`;
  }) as Contador;
  
  contador.intervalo = 1000;
  contador.resetar = function() {
    console.log("Resetado");
  };
  
  return contador;
}

const c = criarContador();
console.log(c(10)); // "Contando de 10"
console.log(c.intervalo); // 1000
c.resetar(); // "Resetado"
```

**Análise teórica:** Hybrid types descrevem objetos complexos que são simultaneamente funções e objetos com properties.

### Excess Property Checking

TypeScript é mais restrito com object literals:

```typescript
interface Opcoes {
  largura?: number;
  altura?: number;
}

function criarElemento(opcoes: Opcoes): void {
  console.log(opcoes);
}

// ✅ Com variável - ok
const config = { largura: 100, altura: 200, cor: "azul" };
criarElemento(config);

// ❌ Object literal direto - erro!
// criarElemento({ largura: 100, altura: 200, cor: "azul" });
// Erro: Object literal may only specify known properties

// Soluções:
// 1. Type assertion
criarElemento({ largura: 100, altura: 200, cor: "azul" } as Opcoes);

// 2. Index signature na interface
```

**Fundamento conceitual:** TypeScript faz **excess property checking** em object literals para pegar typos. Objetos atribuídos a variáveis primeiro não sofrem essa verificação.

## 🎯 Aplicabilidade e Contextos

### Quando Usar Interfaces

**1. Definir Shapes de Objetos**
```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
}
```

**Raciocínio:** Quando precisa descrever estrutura de objetos.

**2. Contratos para Classes**
```typescript
interface Repositorio<T> {
  buscarTodos(): Promise<T[]>;
  buscarPorId(id: number): Promise<T | null>;
}
```

**Raciocínio:** Definir API que classes devem implementar.

**3. Dependency Injection**
```typescript
class Servico {
  constructor(private logger: Logger) {}
}
```

**Raciocínio:** Depender de abstrações, não implementações.

### Quando Usar Type Alias

- Unions: `type ID = string | number`
- Tuples: `type Ponto = [number, number]`
- Primitives: `type Nome = string`

## ⚠️ Limitações e Considerações Teóricas

### Não Existem em Runtime

Interfaces são removidas em compilação. Não use `instanceof`:

```typescript
interface Pessoa {}
const p = {};
// if (p instanceof Pessoa) {} // ❌ Erro
```

### Não Podem Ter Implementação

Interfaces são pure contracts:

```typescript
interface Teste {
  // metodo() { return 1; } // ❌ Erro: não pode ter corpo
  metodo(): number; // ✅ Apenas signature
}
```

### Merge de Declarações

Múltiplas declarações de mesma interface são merged:

```typescript
interface Janela {
  titulo: string;
}

interface Janela {
  tamanho: number;
}

// Merged:
const janela: Janela = {
  titulo: "App",
  tamanho: 100
};
```

## 🔗 Interconexões Conceituais

**Relação com Classes:** Classes implementam interfaces via `implements`.

**Relação com Type Aliases:** Alternativa para definir tipos, com diferenças sutis.

**Relação com Generics:** Interfaces podem ser genéricas.

**Relação com Polymorphism:** Base para polimorfismo via contratos.

## 🚀 Evolução e Próximos Conceitos

Dominar interfaces prepara para:
- **Implements:** Classes implementando interfaces
- **Generic Interfaces:** Interfaces com type parameters
- **Declaration Merging:** Augmentação de interfaces
- **Advanced Types:** Conditional types, mapped types com interfaces
