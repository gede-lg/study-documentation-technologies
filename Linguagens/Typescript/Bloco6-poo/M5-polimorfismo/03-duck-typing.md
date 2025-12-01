# Duck Typing TypeScript

## 🎯 Introdução e Definição

### Definição Conceitual

**Duck typing** em TypeScript é o princípio de **structural typing** onde a compatibilidade de tipos é determinada pela **estrutura** (shape) de objetos, não por **nome** ou **hierarquia de classes**. A expressão vem do **duck test**: "Se anda como pato e grasna como pato, então é um pato" - se um objeto tem as propriedades e métodos esperados, é considerado compatível, independente de sua classe ou interface declarada.

Conceitualmente, duck typing implementa **type checking baseado em capabilities** - importa o que o objeto **pode fazer** (métodos que possui), não o que ele **é** (sua classe/tipo nominal). TypeScript usa **structural subtyping** - dois tipos são compatíveis se suas estruturas são compatíveis, sem necessidade de declaração explícita de relacionamento.

### Contexto Histórico e Motivação

A evolução de duck typing:

**Linguagens Dinâmicas (Python, Ruby):** Cunharam o termo "duck typing" - verificação de tipo em runtime baseada em presença de atributos/métodos.

**Linguagens Nominais (Java, C#):** Usam **nominal typing** - tipos são compatíveis apenas se relacionados por herança/implementação explícita (`extends`, `implements`).

**JavaScript:** Naturalmente duck-typed - sem tipos estáticos, código verifica presença de propriedades em runtime.

**TypeScript (2012):** Escolheu **structural typing** ao invés de nominal para manter compatibilidade com idiomas JavaScript. Anders Hejlsberg (criador) justificou: "JavaScript é estruturalmente tipado; TypeScript deve ser também".

**Motivação para structural typing:**
- **JavaScript Compatibility:** Código JavaScript existente é estruturalmente tipado
- **Flexibility:** Permite polimorfismo sem hierarquias de classe rígidas
- **Gradual Typing:** Facilita migração de JavaScript para TypeScript
- **Interface Segregation:** Múltiplas interfaces pequenas sem herança múltipla

### Problema Fundamental que Resolve

Duck typing resolve problemas específicos:

**1. Polimorfismo sem Herança**
```typescript
// Não precisa declarar interface explícita
function log(obj: { toString(): string }) {
  console.log(obj.toString());
}

log({ toString: () => "Hello" });        // ✅ OK
log(new Date());                         // ✅ OK
log(42);                                 // ✅ OK (number tem toString)
```

**2. Third-Party Library Integration**
```typescript
// Biblioteca define:
interface Logger {
  log(msg: string): void;
}

// Seu código usa console sem implements
const logger: Logger = console;  // ✅ OK - console tem log(msg)
```

**3. Testing sem Mocking Framework**
```typescript
interface Database {
  query(sql: string): Promise<any>;
}

// Mock simples - não precisa herdar ou implements
const mockDb = {
  query: async (sql: string) => []
};

function testar(db: Database) { }
testar(mockDb);  // ✅ OK - tem método query
```

**4. Composition Over Inheritance**
```typescript
interface Voador {
  voar(): void;
}

interface Nadador {
  nadar(): void;
}

// Não precisa herdar - apenas implementar estrutura
const pato = {
  voar() { console.log("Voando"); },
  nadar() { console.log("Nadando"); }
};

function usarVoador(v: Voador) { v.voar(); }
function usarNadador(n: Nadador) { n.nadar(); }

usarVoador(pato);   // ✅ OK
usarNadador(pato);  // ✅ OK
```

### Importância no Ecossistema

Duck typing é importante porque:

- **JavaScript Idioms:** Preserva padrões idiomáticos de JavaScript
- **Framework Integration:** Frameworks aceitam "duck-typed" objects
- **Testing:** Simplifica criação de test doubles
- **API Flexibility:** APIs aceitam qualquer objeto com shape correto
- **Gradual Migration:** Facilita adoção incremental de TypeScript

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Structural Typing:** Compatibilidade baseada em estrutura, não nome
2. **Shape Matching:** Objeto deve ter propriedades/métodos esperados
3. **No Explicit Declaration:** Não requer `implements` ou `extends`
4. **Compile-Time Check:** Verificação em compile-time, não runtime
5. **Excess Properties OK:** Objetos podem ter mais que o necessário

### Pilares Fundamentais

- **Structure:** O que importa é **o que** o objeto tem, não **quem** é
- **Compatibility:** Dois tipos são compatíveis se shapes são compatíveis
- **Flexibility:** Permite polimorfismo sem hierarquias rígidas
- **Type Safety:** Compilador valida presença de propriedades
- **Duck Test:** "Se tem os métodos necessários, é compatível"

### Visão Geral das Nuances

- **Nominal vs Structural:** TypeScript usa structural; C#/Java usam nominal
- **Excess Properties:** Permitidas em assignment, restritas em literals
- **Method Compatibility:** Signatures devem ser compatíveis
- **Private Members:** Afetam compatibilidade estrutural
- **Index Signatures:** Permitem propriedades dinâmicas

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Structural Type Checking Process

```typescript
interface Ponto {
  x: number;
  y: number;
}

const obj = {
  x: 10,
  y: 20,
  z: 30  // Propriedade extra
};

const ponto: Ponto = obj;  // ✅ OK

// TypeScript checking:
// 1. obj tem 'x' com tipo number? ✅
// 2. obj tem 'y' com tipo number? ✅
// 3. Propriedades extras (z)? OK (duck typing permite)
// 4. Compatível? ✅
```

**Análise profunda do processo:**
1. **Property Enumeration:** TypeScript enumera propriedades requeridas do tipo target
2. **Presence Check:** Verifica se source tem todas propriedades requeridas
3. **Type Compatibility:** Verifica se tipos de propriedades são compatíveis (recursivamente)
4. **Excess Check:** Permite propriedades extras (exceto em object literals diretos)

**Fundamento conceitual:** Duck typing é **compile-time** - não há runtime type checking.

### Princípios e Conceitos Subjacentes

#### Shape Compatibility

```typescript
interface Animal {
  nome: string;
  fazerSom(): void;
}

// Não declara implements, mas é estruturalmente compatível
class Cachorro {
  constructor(public nome: string) {}
  
  fazerSom() {
    console.log("Au au");
  }
  
  // Método extra - OK
  abanarRabo() {
    console.log("Abanando...");
  }
}

const animal: Animal = new Cachorro("Rex");  // ✅ Duck typing
animal.fazerSom();  // ✅ OK
// animal.abanarRabo();  // ❌ Erro - não está no tipo Animal
```

**Conceito crucial:** TypeScript valida que `Cachorro` tem **pelo menos** propriedades de `Animal`.

#### Nominal vs Structural Typing

```typescript
// TypeScript (Structural)
interface A {
  valor: number;
}

interface B {
  valor: number;
}

const a: A = { valor: 10 };
const b: B = a;  // ✅ OK - mesma estrutura

// Em Java/C# (Nominal) - seria erro:
// A e B são tipos diferentes, mesmo com mesma estrutura
```

**Análise profunda:** 
- **Nominal:** Tipos são compatíveis apenas se declarados relacionados
- **Structural:** Tipos são compatíveis se estruturas são compatíveis

**TypeScript escolheu structural** para alinhar com JavaScript.

#### Duck Test Principle

```typescript
interface Quackable {
  quack(): void;
}

function fazerQuack(pato: Quackable) {
  pato.quack();
}

// Qualquer objeto com quack() é aceito
fazerQuack({ quack: () => console.log("Quack!") });  // ✅
fazerQuack({ quack: () => console.log("Meow!") });   // ✅ (mesmo que não seja pato!)
```

**Fundamento teórico:** "Se tem método `quack()`, é `Quackable`" - independente de ser pato real.

### Modelo Mental para Compreensão

Pense em duck typing como **checklist de requisitos**:

**Interface:** Lista de requisitos
```
Requisitos para "Empregável":
☐ Tem nome (string)
☐ Tem função trabalhar()
```

**Objeto:** Candidato com qualificações
```
Pessoa:
✅ nome: "Ana"
✅ trabalhar() { ... }
✅ hobbies: ["ler"]  (extra - OK)
```

**Duck Typing:** Checa se candidato atende requisitos
- Tem nome? ✅
- Tem trabalhar()? ✅
- Qualificações extras? Irrelevante (permitidas)
- **Resultado:** Empregável ✅

**Contraste com Nominal Typing:**
- Nominal: "Tem diploma de 'Empregável'?" (declaração explícita)
- Structural: "Atende requisitos de 'Empregável'?" (checklist)

## 🔍 Análise Conceitual Profunda

### Basic Duck Typing

```typescript
interface Printable {
  print(): void;
}

function imprimir(obj: Printable) {
  obj.print();
}

// Diferentes objetos - mesma shape
imprimir({ print: () => console.log("A") });  // ✅

const documento = {
  conteudo: "texto",
  print() { console.log(this.conteudo); }
};
imprimir(documento);  // ✅ Tem print(), é Printable
```

**Análise teórica:** Qualquer objeto com `print(): void` é `Printable`.

### Multiple Interface Compatibility

```typescript
interface Nomeavel {
  nome: string;
}

interface Identificavel {
  id: number;
}

const obj = {
  id: 1,
  nome: "Produto",
  preco: 100  // Extra
};

const nomeavel: Nomeavel = obj;         // ✅ Tem nome
const identificavel: Identificavel = obj; // ✅ Tem id
```

**Fundamento conceitual:** Objeto pode satisfazer múltiplas interfaces simultaneamente sem declaração.

### Function Type Duck Typing

```typescript
interface Somador {
  (a: number, b: number): number;
}

const somar: Somador = (x, y) => x + y;  // ✅ Function signature match

function usarSomador(fn: Somador) {
  return fn(5, 3);
}

usarSomador(somar);                       // ✅
usarSomador((a, b) => a + b);            // ✅ Inline function
usarSomador(Math.max);                   // ✅ Built-in function
```

**Análise profunda:** Function types também usam duck typing - signature compatibility.

### Method Compatibility

```typescript
interface Logger {
  log(msg: string, nivel: number): void;
}

const consoleLogger = {
  // ✅ Menos parâmetros - compatível (pode ignorar nivel)
  log(msg: string) {
    console.log(msg);
  }
};

const logger: Logger = consoleLogger;  // ✅ OK
logger.log("Hello", 1);  // 'nivel' ignorado
```

**Conceito avançado:** Método com **menos parâmetros** é compatível - pode ignorar extras.

### Excess Property Checking

```typescript
interface Config {
  host: string;
  porta: number;
}

// ✅ Via variável - excess properties OK
const obj = { host: "localhost", porta: 3000, debug: true };
const config1: Config = obj;

// ❌ Object literal direto - erro
const config2: Config = {
  host: "localhost",
  porta: 3000,
  // debug: true  // Erro: 'debug' não existe em Config
};

// ✅ Workarounds:
const config3 = { host: "localhost", porta: 3000, debug: true } as Config;
const config4: Config = { host: "localhost", porta: 3000, debug: true } as any;
```

**Limitação:** **Excess property checking** é mais strict para object literals para detectar typos.

### Class Instance Duck Typing

```typescript
interface Forma {
  area(): number;
}

class Circulo {
  constructor(public raio: number) {}
  
  area() {
    return Math.PI * this.raio ** 2;
  }
  
  // Método extra
  circunferencia() {
    return 2 * Math.PI * this.raio;
  }
}

const forma: Forma = new Circulo(5);  // ✅ Circulo "is-a" Forma
forma.area();  // ✅ OK
```

**Análise profunda:** Classes são duck-typed - não precisa `implements Forma`.

### Generic Duck Typing

```typescript
function processar<T extends { id: number }>(item: T): T {
  console.log(`Processando item ${item.id}`);
  return item;
}

processar({ id: 1, nome: "Ana" });      // ✅ Tem id
processar({ id: 2, idade: 30 });        // ✅ Tem id
// processar({ nome: "Ana" });          // ❌ Falta id
```

**Fundamento teórico:** Generic constraint usa duck typing - `T` deve ter `id: number`.

### Union Type Duck Typing

```typescript
interface Cachorro {
  tipo: "cachorro";
  latir(): void;
}

interface Gato {
  tipo: "gato";
  miar(): void;
}

type Animal = Cachorro | Gato;

function interagir(animal: Animal) {
  if (animal.tipo === "cachorro") {
    animal.latir();  // ✅ Type narrowed
  } else {
    animal.miar();   // ✅ Type narrowed
  }
}

// Duck typing - objetos com shape correto
interagir({ tipo: "cachorro", latir: () => console.log("Au") });  // ✅
interagir({ tipo: "gato", miar: () => console.log("Miau") });    // ✅
```

**Conceito avançado:** Discriminated unions com duck typing.

### Index Signature Duck Typing

```typescript
interface Dictionary {
  [key: string]: string;
}

const obj1 = { a: "1", b: "2" };
const dict1: Dictionary = obj1;  // ✅ OK

const obj2 = { a: "1", b: 2 };
// const dict2: Dictionary = obj2;  // ❌ Erro - 'b' não é string
```

**Análise profunda:** Index signatures permitem propriedades dinâmicas com type constraint.

### Private Members Break Duck Typing

```typescript
class A {
  private x: number = 1;
}

class B {
  private x: number = 2;
}

const a: A = new A();
// const b: A = new B();  // ❌ Erro - private 'x' incompatível

// Classes com mesmo private não são compatíveis
// (mesmo que estrutura pública seja idêntica)
```

**Limitação:** **Private/protected members** afetam compatibilidade - classes com private members incompatíveis não são compatíveis estruturalmente.

### Readonly Duck Typing

```typescript
interface ReadonlyPonto {
  readonly x: number;
  readonly y: number;
}

const ponto = { x: 10, y: 20 };  // Mutável
const readonlyPonto: ReadonlyPonto = ponto;  // ✅ OK

// readonlyPonto.x = 30;  // ❌ Erro - readonly
ponto.x = 30;             // ✅ OK - original é mutável
console.log(readonlyPonto.x);  // 30 - referência ao mesmo objeto
```

**Fundamento teórico:** `readonly` não cria cópia - apenas restringe mutação via referência.

### Optional Properties Duck Typing

```typescript
interface Usuario {
  nome: string;
  email?: string;  // Opcional
}

const u1: Usuario = { nome: "Ana" };              // ✅ email omitido
const u2: Usuario = { nome: "João", email: undefined };  // ✅ email undefined
const u3: Usuario = { nome: "Pedro", email: "p@a.com" }; // ✅ email presente
```

**Conceito crucial:** Optional properties podem estar ausentes, undefined, ou presentes.

### Method Overload Duck Typing

```typescript
interface Calculadora {
  somar(a: number, b: number): number;
  somar(a: string, b: string): string;
}

const calc = {
  somar(a: any, b: any) {
    return a + b;
  }
};

const calculadora: Calculadora = calc;  // ✅ Implementation compatible
```

**Análise profunda:** Implementation deve ser compatível com todos overloads.

## 🎯 Aplicabilidade e Contextos

### Console as Logger

```typescript
interface Logger {
  log(msg: string): void;
  error(msg: string): void;
}

// console atende interface Logger sem implements
const logger: Logger = console;  // ✅ Duck typing
logger.log("Info");
logger.error("Erro");
```

**Raciocínio:** `console` é duck-typed como `Logger` - tem métodos necessários.

### Third-Party Library Integration

```typescript
// Biblioteca define:
interface EventEmitter {
  on(event: string, handler: Function): void;
  emit(event: string, ...args: any[]): void;
}

// Node.js EventEmitter atende estruturalmente
import { EventEmitter as NodeEmitter } from "events";

function useEmitter(emitter: EventEmitter) {
  emitter.on("data", (d) => console.log(d));
}

useEmitter(new NodeEmitter());  // ✅ Duck typing
```

**Raciocínio:** Integra bibliotecas sem wrappers - se shape é compatível, funciona.

### React Component Props

```typescript
interface ButtonProps {
  label: string;
  onClick(): void;
}

function Button(props: ButtonProps) {
  return <button onClick={props.onClick}>{props.label}</button>;
}

// Uso - objeto inline com shape correto
<Button label="Clique" onClick={() => alert("Clicou")} />
```

**Raciocínio:** React usa duck typing para props - objetos com shape correto.

### Testing Mock Objects

```typescript
interface UserService {
  getUser(id: number): Promise<User>;
  saveUser(user: User): Promise<void>;
}

// Mock simples - sem classe ou implements
const mockService: UserService = {
  async getUser(id) {
    return { id, nome: "Mock User" };
  },
  async saveUser(user) {
    console.log("Salvando mock:", user);
  }
};

function testar(service: UserService) {
  // Usa service
}

testar(mockService);  // ✅ Duck typing
```

**Raciocínio:** Mocks são duck-typed - basta ter métodos corretos.

### Plugin Architecture

```typescript
interface Plugin {
  nome: string;
  versao: string;
  iniciar(): void;
}

function carregarPlugin(plugin: Plugin) {
  console.log(`Carregando ${plugin.nome} v${plugin.versao}`);
  plugin.iniciar();
}

// Plugin não precisa herdar ou implements
const meuPlugin = {
  nome: "MeuPlugin",
  versao: "1.0.0",
  iniciar() {
    console.log("Iniciado!");
  },
  configuracoes: {}  // Propriedade extra - OK
};

carregarPlugin(meuPlugin);  // ✅ Duck typing
```

**Raciocínio:** Plugins são duck-typed - flexibilidade sem hierarquias rígidas.

## ⚠️ Limitações e Considerações Teóricas

### Excess Property Checking Inconsistency

```typescript
interface Config {
  host: string;
}

// ✅ Via variável
const obj = { host: "localhost", porta: 3000 };
const c1: Config = obj;

// ❌ Literal direto
// const c2: Config = { host: "localhost", porta: 3000 };
```

**Limitação:** Comportamento diferente para literals vs variáveis.

### Private Members Incompatibility

```typescript
class A { private x = 1; }
class B { private x = 1; }

// const b: A = new B();  // ❌ Erro - private incompatível
```

**Limitação:** Private/protected quebram duck typing estrutural.

### No Runtime Type Checking

```typescript
interface Usuario {
  nome: string;
}

function processar(u: Usuario) {
  console.log(u.nome.toUpperCase());
}

const obj: any = { nome: 123 };  // Tipo errado
processar(obj);  // ❌ Runtime error - 123 não tem toUpperCase
```

**Limitação:** TypeScript não adiciona runtime checks - só compile-time.

### Function Parameter Bivariance

```typescript
interface Handler {
  handle(animal: Animal): void;
}

const handler: Handler = {
  // ⚠️ TypeScript permite (unsafe)
  handle(cachorro: Cachorro) {
    console.log(cachorro.raca);  // Pode falhar se receber Animal
  }
};
```

**Limitação:** Bivariance permite substituições unsafe. Usar `strictFunctionTypes`.

## 🔗 Interconexões Conceituais

**Relação com Structural Typing:** Duck typing é implementação de structural typing.

**Relação com Polimorfismo:** Permite polimorfismo sem herança.

**Relação com Interfaces:** Interfaces definem shapes para duck typing.

**Relação com Generics:** Generic constraints usam duck typing.

## 🚀 Evolução e Próximos Conceitos

Dominar duck typing prepara para:
- **Interfaces Polimórficas:** Contratos flexíveis
- **Advanced Generics:** Constraints estruturais
- **Type Guards:** Refinamento de tipos em runtime
- **Utility Types:** Mapped types, conditional types
