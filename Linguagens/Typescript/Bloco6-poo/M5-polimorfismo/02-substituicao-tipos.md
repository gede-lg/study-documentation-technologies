# Substituição de Tipos (Tipo Pai Pode Receber Tipo Filho)

## 🎯 Introdução e Definição

### Definição Conceitual

**Substituição de tipos** (type substitution) é o princípio em TypeScript onde uma variável de **tipo mais genérico** (supertype, tipo pai) pode receber valores de **tipo mais específico** (subtype, tipo filho), mantendo **type safety**. Conceitualmente, implementa o **Liskov Substitution Principle (LSP)** - se S é subtipo de T, então objetos do tipo T podem ser substituídos por objetos do tipo S sem quebrar o programa.

Em TypeScript, substituição ocorre através de **structural typing** (duck typing) - um tipo é subtipo de outro se possui **todas as propriedades e métodos** do tipo pai, podendo ter propriedades adicionais. Diferente de linguagens nominais (Java, C#), TypeScript não requer declaração explícita de herança para subtyping - apenas **compatibilidade estrutural** importa.

### Contexto Histórico e Motivação

A evolução de type substitution:

**Linguagens Nominais (Java, C#):** Subtyping é **explícito** - classe deve declarar `extends` ou `implements` para ser subtipo. Substituição é baseada em **hierarquia de classes**.

**JavaScript:** Não tem tipos estáticos, mas filosofia de "duck typing" - se objeto tem métodos necessários, pode ser usado, independente de hierarquia.

**TypeScript:** Adotou **structural subtyping** (duck typing com type safety) - subtyping baseado em **shape**, não em declaração. Tipo A é subtipo de B se tiver todas propriedades de B (e possivelmente mais).

**Liskov Substitution Principle (Barbara Liskov, 1987):** Se S é subtipo de T, objetos de tipo T podem ser substituídos por S sem alterar propriedades desejáveis do programa (corretude, execução).

**Motivação em TypeScript:**
- **Flexibility:** Structural typing permite polimorfismo sem herança explícita
- **JavaScript Compatibility:** Alinha com natureza dinâmica de JavaScript
- **Code Reuse:** Funções genéricas aceitam qualquer tipo compatível
- **Type Safety:** Compilador valida que substituição é segura

### Problema Fundamental que Resolve

Substituição de tipos resolve problemas específicos:

**1. Polimorfismo sem Herança**
```typescript
// Tipo pai
interface Animal {
  nome: string;
}

// Tipo filho (estruturalmente compatível)
interface Cachorro {
  nome: string;
  raca: string;  // Propriedade adicional
}

function cumprimentar(animal: Animal) {
  console.log(`Olá, ${animal.nome}`);
}

const cachorro: Cachorro = { nome: "Rex", raca: "Labrador" };
cumprimentar(cachorro);  // ✅ OK - Cachorro é subtipo de Animal
```

**2. Code Reusability**
```typescript
interface Logger {
  log(msg: string): void;
}

function executar(logger: Logger) {
  logger.log("Executando...");
}

const consoleLogger = { log: console.log };  // Compatível
executar(consoleLogger);  // ✅ OK
```

**3. Tipo Seguro em Hierarquias**
```typescript
class Forma {
  cor: string = "preto";
}

class Circulo extends Forma {
  raio: number = 10;
}

const forma: Forma = new Circulo();  // ✅ Circulo é subtipo de Forma
```

**4. Variance em Generics**
```typescript
function processar(itens: Array<Animal>) {
  // Processar animals
}

const cachorros: Array<Cachorro> = [];
// processar(cachorros);  // ❌ Array não é covariant (immutability)
```

### Importância no Ecossistema

Substituição de tipos é importante porque:

- **Polimorfismo:** Base do polimorfismo em TypeScript
- **Design Patterns:** Strategy, Factory, Dependency Injection dependem de substituição
- **Frameworks:** Frameworks injetam dependências via interfaces
- **Testing:** Mocks/stubs são subtipos de interfaces reais
- **Library APIs:** Bibliotecas aceitam tipos genéricos que podem ser especializados

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Structural Subtyping:** Baseado em shape, não em declaração
2. **Liskov Substitution:** Subtipos podem substituir supertypes
3. **Property Excess:** Subtipos podem ter propriedades adicionais
4. **Method Compatibility:** Métodos devem ser compatíveis (contravariant params, covariant returns)
5. **Variance:** Covariance, contravariance, invariance em types complexos

### Pilares Fundamentais

- **Subtype:** Tipo com **pelo menos** propriedades do supertype
- **Supertype:** Tipo mais genérico, menos propriedades
- **Assignability:** `subtype` pode ser atribuído a `supertype`
- **Type Safety:** Compilador valida compatibilidade estrutural
- **Duck Typing:** "Se parece pato, é pato"

### Visão Geral das Nuances

- **Excess Properties:** Allowed em assignment, mas não em object literals
- **Method Bivariance:** Métodos são bivariantes (unsafe, mas JavaScript-compatible)
- **Readonly Variance:** `readonly` permite covariance em arrays
- **Generic Variance:** Generics podem ser covariant, contravariant, invariant
- **Class Hierarchy:** Classes herdam estruturalmente, mesmo sem `extends`

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Structural Type Checking

```typescript
interface Pessoa {
  nome: string;
  idade: number;
}

interface Funcionario {
  nome: string;
  idade: number;
  cargo: string;  // Propriedade adicional
}

const funcionario: Funcionario = {
  nome: "Ana",
  idade: 30,
  cargo: "Dev"
};

// Substituição - Funcionario é subtipo de Pessoa
const pessoa: Pessoa = funcionario;  // ✅ OK

// TypeScript verifica:
// 1. Funcionario tem 'nome: string'? ✅
// 2. Funcionario tem 'idade: number'? ✅
// 3. Propriedades adicionais? OK (permitidas em subtipos)
```

**Análise profunda do checking:**
1. **Property Check:** TypeScript verifica que subtipo tem **todas** propriedades do supertype
2. **Type Compatibility:** Tipos de propriedades devem ser **compatíveis** (subtipos também)
3. **Excess Properties:** Permitidas - subtipos podem ter mais
4. **No Runtime Check:** Validação apenas em compile-time

**Fundamento conceitual:** TypeScript usa **structural typing** - se estrutura é compatível, tipos são compatíveis.

### Princípios e Conceitos Subjacentes

#### Liskov Substitution Principle

**Definição formal:** Se S é subtipo de T, objetos de tipo T podem ser substituídos por S sem alterar corretude do programa.

```typescript
interface Forma {
  area(): number;
}

interface Quadrado extends Forma {
  lado: number;
  area(): number;  // Mesma assinatura
}

function calcularAreaTotal(formas: Forma[]): number {
  return formas.reduce((total, forma) => total + forma.area(), 0);
}

const quadrado: Quadrado = {
  lado: 5,
  area() { return this.lado ** 2; }
};

const formas: Forma[] = [quadrado];  // ✅ Substituição
calcularAreaTotal(formas);  // ✅ Funciona corretamente
```

**Conceito crucial:** Substituição preserva **contratos** - métodos de subtipo respeitam assinaturas de supertype.

#### Structural Subtyping

```typescript
// Não há extends/implements - apenas estrutura
interface Logger {
  log(msg: string): void;
}

const obj = {
  log(msg: string) {
    console.log(msg);
  },
  extra: "propriedade adicional"  // OK
};

const logger: Logger = obj;  // ✅ Estruturalmente compatível
```

**Análise profunda:** TypeScript não requer declaração explícita de subtyping - apenas compatibilidade estrutural.

#### Property Excess

```typescript
interface Config {
  host: string;
  porta: number;
}

const configuracao = {
  host: "localhost",
  porta: 3000,
  debug: true  // Propriedade extra
};

const config: Config = configuracao;  // ✅ OK - via variável

// ❌ Erro - object literal direto
// const config2: Config = {
//   host: "localhost",
//   porta: 3000,
//   debug: true  // Erro: 'debug' não existe em Config
// };
```

**Fundamento teórico:** Excess properties são permitidas em **assignment de variáveis**, mas não em **object literals diretos** (excess property checking).

### Modelo Mental para Compreensão

Pense em types como **contratos** ou **requisitos**:

**Supertype (Tipo Pai):** Requisitos mínimos
```
Requisitos para ser "Desenvolvedor":
- Saber programar
- Conhecer algoritmos
```

**Subtype (Tipo Filho):** Atende requisitos + habilidades extras
```
"Desenvolvedor Sênior":
- Saber programar ✅
- Conhecer algoritmos ✅
- Arquitetura de sistemas (extra)
- Mentoria (extra)
```

**Substituição:** 
- Vaga pede "Desenvolvedor" → Pode contratar "Desenvolvedor Sênior" ✅
- "Sênior" atende todos requisitos de "Desenvolvedor" + mais habilidades
- **Liskov:** Trocar "Desenvolvedor" por "Sênior" não quebra sistema

## 🔍 Análise Conceitual Profunda

### Basic Substitution

```typescript
interface Veiculo {
  mover(): void;
}

interface Carro extends Veiculo {
  abrirPorta(): void;  // Método adicional
}

const carro: Carro = {
  mover() { console.log("Dirigindo"); },
  abrirPorta() { console.log("Porta aberta"); }
};

const veiculo: Veiculo = carro;  // ✅ Substituição
veiculo.mover();  // ✅ OK
// veiculo.abrirPorta();  // ❌ Erro - não existe em Veiculo
```

**Análise teórica:** Substituição permite usar subtipo como supertype, mas acesso apenas a propriedades do supertype.

### Class Inheritance Substitution

```typescript
class Animal {
  nome: string;
  constructor(nome: string) {
    this.nome = nome;
  }
  fazerSom(): void {
    console.log("Som genérico");
  }
}

class Cachorro extends Animal {
  raca: string;
  constructor(nome: string, raca: string) {
    super(nome);
    this.raca = raca;
  }
  fazerSom(): void {  // Override
    console.log("Au au");
  }
}

const animal: Animal = new Cachorro("Rex", "Labrador");  // ✅ Substituição
animal.fazerSom();  // "Au au" - polymorphism
// animal.raca;  // ❌ Erro - não existe em Animal type
```

**Fundamento conceitual:** Herança de classe cria subtyping automático.

### Structural Substitution (sem extends)

```typescript
interface Printable {
  print(): void;
}

// Não declara implements, mas é estruturalmente compatível
class Documento {
  conteudo: string = "";
  
  print() {
    console.log(this.conteudo);
  }
  
  salvar() {  // Método extra
    console.log("Salvando...");
  }
}

const printable: Printable = new Documento();  // ✅ OK
printable.print();  // ✅ OK
```

**Análise profunda:** TypeScript não requer `implements` - compatibilidade estrutural é suficiente.

### Function Parameter Substitution

```typescript
interface Usuario {
  nome: string;
}

interface Admin extends Usuario {
  permissoes: string[];
}

function exibirNome(usuario: Usuario) {
  console.log(usuario.nome);
}

const admin: Admin = { nome: "Ana", permissoes: ["admin"] };
exibirNome(admin);  // ✅ OK - Admin é subtipo de Usuario
```

**Conceito crucial:** Funções aceitam subtipos de parâmetros declarados.

### Return Type Substitution

```typescript
interface Forma {
  area(): number;
}

interface Circulo extends Forma {
  raio: number;
  area(): number;
}

function criarForma(): Forma {
  // Retorna subtipo
  return { raio: 5, area: () => Math.PI * 25 };  // ✅ OK
}

const forma: Forma = criarForma();  // ✅ Forma
```

**Fundamento teórico:** Funções podem retornar subtipos do tipo declarado.

### Method Override com Covariance

```typescript
class Animal {
  criar(): Animal {
    return new Animal();
  }
}

class Cachorro extends Animal {
  // ✅ Return type covariance - pode retornar subtipo
  criar(): Cachorro {
    return new Cachorro();
  }
}

const animal: Animal = new Cachorro();
const criado: Animal = animal.criar();  // ✅ OK
```

**Análise profunda:** TypeScript permite **covariant return types** - métodos override podem retornar subtipos.

### Contravariance em Function Parameters (Bivariance)

```typescript
interface Handler {
  handle(animal: Animal): void;
}

class CachorroHandler implements Handler {
  // ⚠️ TypeScript permite (bivariance), mas é unsafe
  handle(cachorro: Cachorro): void {
    console.log(cachorro.raca);
  }
}

const handler: Handler = new CachorroHandler();
// handler.handle(new Animal());  // ❌ Runtime error - Animal não tem 'raca'
```

**Limitação:** TypeScript usa **bivariance** para métodos (permite covariance e contravariance), que é unsafe mas JavaScript-compatible. Usar `strictFunctionTypes: true` para contravariance correta.

### Array Covariance (Readonly)

```typescript
interface Animal {
  nome: string;
}

interface Cachorro extends Animal {
  raca: string;
}

// ❌ Array normal - invariant (não covariant)
const cachorros: Cachorro[] = [];
// const animais: Animal[] = cachorros;  // Erro em strict mode

// ✅ Readonly array - covariant
const cachrorrosRO: readonly Cachorro[] = [];
const animaisRO: readonly Animal[] = cachrorrosRO;  // ✅ OK
```

**Conceito avançado:** Arrays mutáveis são **invariantes** (unsafe ser covariant). `readonly` permite covariance segura.

### Generic Covariance

```typescript
interface Box<T> {
  readonly valor: T;  // readonly = covariant
}

const caixaCachorro: Box<Cachorro> = { valor: { nome: "Rex", raca: "Lab" } };
const caixaAnimal: Box<Animal> = caixaCachorro;  // ✅ OK - covariant
```

**Análise profunda:** Generics com propriedades `readonly` são **covariant** - `Box<Cachorro>` é subtipo de `Box<Animal>`.

### Generic Contravariance

```typescript
interface Comparador<T> {
  comparar(a: T, b: T): number;
}

// Contravariance - inverte hierarquia
const comparadorAnimal: Comparador<Animal> = {
  comparar(a, b) { return a.nome.localeCompare(b.nome); }
};

// ✅ OK (com strictFunctionTypes) - Comparador<Animal> é subtipo de Comparador<Cachorro>
// const comparadorCachorro: Comparador<Cachorro> = comparadorAnimal;
```

**Fundamento teórico:** Generics em **posição contravariant** (parâmetros de função) invertem hierarquia de subtyping.

### Union Type Substitution

```typescript
type StringOuNumero = string | number;

const valor: number = 42;
const resultado: StringOuNumero = valor;  // ✅ OK - number é subtipo de string | number
```

**Conceito crucial:** Tipo específico é subtipo de union type que o contém.

### Intersection Type Substitution

```typescript
interface Identificavel {
  id: number;
}

interface Nomeavel {
  nome: string;
}

type Entidade = Identificavel & Nomeavel;

const entidade: Entidade = { id: 1, nome: "Ana" };

const identificavel: Identificavel = entidade;  // ✅ OK - Entidade é subtipo
const nomeavel: Nomeavel = entidade;           // ✅ OK - Entidade é subtipo
```

**Análise profunda:** Intersection type é subtipo de cada componente.

### Excess Property Checking

```typescript
interface Config {
  host: string;
}

// ✅ OK - via variável
const obj = { host: "localhost", porta: 3000 };
const config1: Config = obj;

// ❌ Erro - object literal direto
// const config2: Config = { host: "localhost", porta: 3000 };

// ✅ Workaround - type assertion
const config3: Config = { host: "localhost", porta: 3000 } as Config;
```

**Fundamento teórico:** **Excess property checking** é mais strict para object literals para detectar typos.

### Method Signature Compatibility

```typescript
interface Logger {
  log(msg: string, nivel: number): void;
}

const consoleLogger = {
  // ✅ Menos parâmetros é OK (pode ignorar)
  log(msg: string) {
    console.log(msg);
  }
};

const logger: Logger = consoleLogger;  // ✅ OK
logger.log("Hello", 1);  // ✅ 'nivel' é ignorado
```

**Conceito avançado:** Função com **menos parâmetros** é compatível com assinatura que requer mais (pode ignorar extras).

## 🎯 Aplicabilidade e Contextos

### Dependency Injection

```typescript
interface Database {
  query(sql: string): Promise<any>;
}

class PostgresDB implements Database {
  query(sql: string): Promise<any> {
    // Implementação PostgreSQL
    return Promise.resolve([]);
  }
  
  // Método específico
  vacuum() { }
}

class Service {
  constructor(private db: Database) {}  // Aceita qualquer Database
  
  async buscar() {
    return this.db.query("SELECT *");
  }
}

const service = new Service(new PostgresDB());  // ✅ PostgresDB é subtipo
```

**Raciocínio:** DI aceita qualquer implementação que atenda interface.

### Strategy Pattern

```typescript
interface SortStrategy {
  sort(array: number[]): number[];
}

class QuickSort implements SortStrategy {
  sort(array: number[]): number[] {
    // Implementação quicksort
    return array;
  }
}

class Context {
  constructor(private strategy: SortStrategy) {}
  
  executar(data: number[]) {
    return this.strategy.sort(data);
  }
}

const context = new Context(new QuickSort());  // ✅ QuickSort é subtipo
```

**Raciocínio:** Pattern permite trocar estratégias - todas subtipos de interface.

### Testing com Mocks

```typescript
interface ApiClient {
  fetch(url: string): Promise<Response>;
}

class MockApiClient implements ApiClient {
  async fetch(url: string): Promise<Response> {
    return new Response(JSON.stringify({ data: "mock" }));
  }
}

function testar(client: ApiClient) {
  // Usa client (pode ser real ou mock)
}

testar(new MockApiClient());  // ✅ Mock é subtipo
```

**Raciocínio:** Mocks são subtipos de interfaces reais para testing.

### Plugin System

```typescript
interface Plugin {
  nome: string;
  executar(): void;
}

class LoggerPlugin implements Plugin {
  nome = "logger";
  
  executar() {
    console.log("Logging...");
  }
  
  // Método específico
  configurar() { }
}

function registrarPlugin(plugin: Plugin) {
  console.log(`Registrando ${plugin.nome}`);
  plugin.executar();
}

registrarPlugin(new LoggerPlugin());  // ✅ LoggerPlugin é subtipo
```

**Raciocínio:** Sistema de plugins aceita qualquer implementação de Plugin.

## ⚠️ Limitações e Considerações Teóricas

### Bivariance Unsafe

```typescript
interface Handler<T> {
  handle(item: T): void;
}

const animalHandler: Handler<Animal> = {
  handle(animal) { console.log(animal.nome); }
};

// ⚠️ TypeScript permite (bivariance), mas unsafe
const cachorroHandler: Handler<Cachorro> = animalHandler;
// cachorroHandler.handle({ nome: "Rex", raca: "Lab" });  // OK
// cachorroHandler.handle({ nome: "Gato" } as Cachorro);  // Runtime error
```

**Limitação:** Bivariance permite substituições unsafe. Usar `strictFunctionTypes: true`.

### Array Mutability

```typescript
const cachorros: Cachorro[] = [];
// const animais: Animal[] = cachorros;  // ❌ Erro

// Problema se permitido:
// animais.push(new Gato());  // Cachorro[] agora tem Gato!
```

**Limitação:** Arrays mutáveis não podem ser covariant (unsafe).

### Excess Properties em Literals

```typescript
interface Config {
  host: string;
}

// ❌ Literal direto - erro
// const config: Config = { host: "localhost", debug: true };

// ✅ Via variável - OK
const obj = { host: "localhost", debug: true };
const config: Config = obj;
```

**Limitação:** Excess property checking inconsistente entre literals e variáveis.

## 🔗 Interconexões Conceituais

**Relação com LSP:** Substituição implementa Liskov Substitution Principle.

**Relação com Polimorfismo:** Base do polimorfismo em TypeScript.

**Relação com Duck Typing:** Structural typing permite duck typing type-safe.

**Relação com Variance:** Covariance, contravariance governam substituição em generics.

## 🚀 Evolução e Próximos Conceitos

Dominar substituição de tipos prepara para:
- **Duck Typing:** Structural typing avançado
- **Interfaces Polimórficas:** Contratos flexíveis
- **Advanced Generics:** Variance, conditional types
- **Design Patterns:** Strategy, Factory, Dependency Injection
