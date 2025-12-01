# Métodos em Interface

## 🎯 Introdução e Definição

### Definição Conceitual

**Métodos em interface** são **function signatures** (assinaturas de função) que definem contratos de comportamento que objetos ou classes devem implementar. Diferente de methods em classes (que têm implementação concreta), métodos em interfaces especificam apenas **nome**, **parâmetros** e **tipo de retorno**, sem fornecer código de execução. Eles estabelecem **o que** um tipo deve fazer, deixando **como** fazer para implementação.

Conceitualmente, method signatures em interfaces implementam **behavioral contracts** (contratos comportamentais): definem operações que tipo deve suportar, criando abstração que permite polimorfismo. Consumidores do tipo dependem apenas da assinatura (interface), não da implementação específica, facilitando **dependency injection** e **testability**.

### Contexto Histórico e Motivação

A evolução de method signatures em interfaces:

**Simula 67 (1967):** Introduziu "procedures" (métodos) em classes, mas sem separação formal de interface.

**Smalltalk (1980):** Conceito de "protocol" - conjunto de mensagens (métodos) que objeto deve responder.

**Objective-C (1984):** Formalizou **@protocol** com method declarations que classes adotam.

**Java (1995):** Interfaces podiam ter apenas **abstract methods** - signatures sem corpo. Estabeleceu padrão de "contract programming".

**C# (2000):** Seguiu modelo Java, interfaces contêm method signatures puras.

**TypeScript (2012):** Interfaces podem ter method signatures em múltiplas syntaxes (method syntax, property function syntax).

**Java 8 (2014):** Permitiu **default methods** em interfaces, misturando abstração e implementação.

**TypeScript 4.x:** Mantém pureza - interfaces são sempre abstratas, sem implementação.

A motivação era **separation of specification and implementation**: interfaces definem API (o que está disponível) sem revelar detalhes de implementação (como funciona), permitindo múltiplas implementações intercambiáveis.

### Problema Fundamental que Resolve

Method signatures em interfaces resolvem problemas críticos:

**1. Contract Definition:** Definir operações que tipo deve suportar sem especificar implementação.

**2. Polymorphism:** Permitir que múltiplas classes diferentes implementem mesmos métodos, sendo intercambiáveis.

**3. Dependency Injection:** Código depende de interface (contrato), recebe implementações concretas.

**4. Testing:** Criar mocks que implementam interfaces para testes unitários.

**5. API Design:** Documentar API formalmente via method signatures.

**6. Type Safety:** Compilador verifica que implementações correspondem exatamente às assinaturas.

### Importância no Ecossistema

Method signatures são fundamentais porque:

- **Framework APIs:** Frameworks definem interfaces com methods que usuários implementam
- **Service Layer:** Services dependem de interfaces repository/data access
- **Plugin Architecture:** Plugins implementam interface com métodos esperados
- **SOLID Principles:** Interface Segregation, Dependency Inversion dependem de method signatures
- **Type Checking:** TypeScript verifica argumentos e retornos de métodos

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Function Signatures:** Métodos são declarados apenas com assinatura
2. **No Implementation:** Interfaces não fornecem corpo de método
3. **Multiple Syntaxes:** Method syntax ou property function syntax
4. **Type Checking:** Implementações devem corresponder exatamente
5. **Overloading:** Múltiplas assinaturas para mesmo método

### Pilares Fundamentais

- **Syntax:** `methodName(params): ReturnType`
- **Parameters:** Tipados, podem ser opcionais ou rest
- **Return Type:** Especificado após `:`
- **No Body:** Apenas declaração, sem `{ }`
- **Implementation:** Classe/objeto fornece código real

### Visão Geral das Nuances

- **Method vs Property Function:** Duas formas de declarar
- **Optional Methods:** Methods podem ser opcionais com `?`
- **Generics:** Methods podem ser genéricos
- **This Type:** `this` pode ser tipado em métodos

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Quando TypeScript compila method signatures em interfaces:

**1. Parsing:** Identifica method declarations na interface.

**2. Signature Extraction:** Extrai nome, parâmetros, tipos de parâmetros, tipo de retorno.

**3. Type Checking (Implementation):**
   - Verifica que classe/objeto tem method com mesmo nome
   - Valida que parâmetros correspondem (tipos, opcionalidade, ordem)
   - Checa que tipo de retorno é compatível

**4. Type Checking (Call Site):**
   - Quando method é chamado, verifica tipos de argumentos
   - Valida que retorno é usado corretamente

**5. Code Generation:** Interface desaparece - apenas implementação permanece no JavaScript.

### Princípios e Conceitos Subjacentes

#### Method Signature Contract

Interface define **contract** - implementação cumpre:

```typescript
interface Calculadora {
  somar(a: number, b: number): number;
  subtrair(a: number, b: number): number;
}

// Implementação via objeto literal
const calc: Calculadora = {
  somar(a, b) {
    return a + b;
  },
  subtrair(a, b) {
    return a - b;
  }
};

// Implementação via classe
class CalculadoraImpl implements Calculadora {
  somar(a: number, b: number): number {
    return a + b;
  }
  
  subtrair(a: number, b: number): number {
    return a - b;
  }
}

// Uso type-safe
function calcular(calc: Calculadora): void {
  console.log(calc.somar(10, 5)); // 15
  console.log(calc.subtrair(10, 5)); // 5
}

calcular(calc);
calcular(new CalculadoraImpl());
```

**Fundamento conceitual:** Interface especifica signatures. Implementações fornecem corpo. TypeScript verifica compatibilidade.

#### Polymorphism via Method Signatures

```typescript
interface Logger {
  log(mensagem: string): void;
  erro(mensagem: string): void;
}

class ConsoleLogger implements Logger {
  log(mensagem: string): void {
    console.log(`[LOG] ${mensagem}`);
  }
  
  erro(mensagem: string): void {
    console.error(`[ERRO] ${mensagem}`);
  }
}

class FileLogger implements Logger {
  log(mensagem: string): void {
    // Escrever em arquivo
    console.log(`[FILE] ${mensagem}`);
  }
  
  erro(mensagem: string): void {
    // Escrever erro em arquivo
    console.log(`[FILE ERROR] ${mensagem}`);
  }
}

// Polimorfismo - função aceita qualquer Logger
function executarComLog(logger: Logger): void {
  logger.log("Iniciando");
  logger.erro("Problema detectado");
}

executarComLog(new ConsoleLogger());
// [LOG] Iniciando
// [ERRO] Problema detectado

executarComLog(new FileLogger());
// [FILE] Iniciando
// [FILE ERROR] Problema detectado
```

**Análise profunda:** Função depende de interface `Logger`, não de implementação concreta. Aceita **qualquer** implementação que satisfaça contrato.

#### Behavioral Abstraction

Interface abstrai comportamento, ocultando detalhes:

```typescript
interface Repositorio<T> {
  buscarTodos(): Promise<T[]>;
  buscarPorId(id: number): Promise<T | null>;
  salvar(entidade: T): Promise<void>;
  deletar(id: number): Promise<boolean>;
}

// Implementação em memória
class RepositorioMemoria<T extends { id: number }> implements Repositorio<T> {
  private dados = new Map<number, T>();
  
  async buscarTodos(): Promise<T[]> {
    return Array.from(this.dados.values());
  }
  
  async buscarPorId(id: number): Promise<T | null> {
    return this.dados.get(id) || null;
  }
  
  async salvar(entidade: T): Promise<void> {
    this.dados.set(entidade.id, entidade);
  }
  
  async deletar(id: number): Promise<boolean> {
    return this.dados.delete(id);
  }
}

// Implementação de banco de dados
class RepositorioDB<T extends { id: number }> implements Repositorio<T> {
  async buscarTodos(): Promise<T[]> {
    // Query SQL
    return [];
  }
  
  async buscarPorId(id: number): Promise<T | null> {
    // SELECT * FROM table WHERE id = ?
    return null;
  }
  
  async salvar(entidade: T): Promise<void> {
    // INSERT INTO table ...
  }
  
  async deletar(id: number): Promise<boolean> {
    // DELETE FROM table WHERE id = ?
    return true;
  }
}

// Serviço depende de abstração
class Servico {
  constructor(private repo: Repositorio<any>) {}
  
  async processar() {
    const todos = await this.repo.buscarTodos();
    console.log(todos);
  }
}

// Pode usar qualquer implementação!
new Servico(new RepositorioMemoria());
new Servico(new RepositorioDB());
```

**Conceito fundamental:** Interface define API do repositório. Serviço não sabe (nem precisa saber) se dados vêm de memória ou banco.

### Modelo Mental para Compreensão

Pense em method signatures como **especificação de peça de máquina**:

- **Interface:** Especificação técnica (ex: "parafuso M8, comprimento 20mm, rosca direita")
- **Method Signature:** Detalhes da especificação (dimensões, tolerâncias)
- **Implementação:** Parafuso físico fabricado segundo especificação
- **Polimorfismo:** Parafusos de fabricantes diferentes (implementações) que atendem mesma spec (interface)
- **Type Checking:** Inspeção de qualidade verificando conformidade com spec

Especificação não constrói peça, apenas define requirements que peça deve atender.

## 🔍 Análise Conceitual Profunda

### Method Syntax

```typescript
interface Forma {
  // Method syntax
  calcularArea(): number;
  calcularPerimetro(): number;
  desenhar(contexto: CanvasRenderingContext2D): void;
}

class Circulo implements Forma {
  constructor(private raio: number) {}
  
  calcularArea(): number {
    return Math.PI * this.raio ** 2;
  }
  
  calcularPerimetro(): number {
    return 2 * Math.PI * this.raio;
  }
  
  desenhar(contexto: CanvasRenderingContext2D): void {
    // Desenhar círculo
    contexto.arc(0, 0, this.raio, 0, 2 * Math.PI);
  }
}
```

**Análise conceitual:** Method syntax é forma padrão - nome seguido de parênteses com parâmetros e tipo de retorno.

### Property Function Syntax

```typescript
interface Calculadora {
  // Property function syntax
  somar: (a: number, b: number) => number;
  subtrair: (a: number, b: number) => number;
}

const calc: Calculadora = {
  somar: (a, b) => a + b,
  subtrair: (a, b) => a - b
};
```

**Fundamento teórico:** Property function syntax trata método como property com tipo função. Funcionalmente equivalente a method syntax, mas com nuances sutis (ex: this binding).

### Optional Methods

```typescript
interface Logger {
  log(mensagem: string): void;
  debug?(mensagem: string): void; // Opcional
  trace?(mensagem: string): void; // Opcional
}

// Implementação mínima - apenas required
const simpleLogger: Logger = {
  log(mensagem) {
    console.log(mensagem);
  }
};

// Implementação completa
const fullLogger: Logger = {
  log(mensagem) {
    console.log(`[LOG] ${mensagem}`);
  },
  debug(mensagem) {
    console.log(`[DEBUG] ${mensagem}`);
  },
  trace(mensagem) {
    console.log(`[TRACE] ${mensagem}`);
  }
};

function usar(logger: Logger): void {
  logger.log("Info");
  
  // Verificar presença antes de chamar
  if (logger.debug) {
    logger.debug("Debug info");
  }
  
  // Optional chaining
  logger.trace?.("Trace info");
}
```

**Conceito crucial:** `?` após nome do método torna-o opcional. Implementações podem omitir. Chamadas devem verificar presença.

### Parameters - Optional e Default

```typescript
interface Formatter {
  format(valor: number, decimais?: number): string;
  formatarData(data: Date, formato?: string): string;
}

class NumberFormatter implements Formatter {
  format(valor: number, decimais: number = 2): string {
    return valor.toFixed(decimais);
  }
  
  formatarData(data: Date, formato: string = "DD/MM/YYYY"): string {
    // Formatar data
    return data.toLocaleDateString();
  }
}

const formatter: Formatter = new NumberFormatter();
console.log(formatter.format(3.14159)); // "3.14"
console.log(formatter.format(3.14159, 4)); // "3.1416"
```

**Análise profunda:** Parameters podem ser opcionais na interface. Implementações podem fornecer defaults.

### Rest Parameters

```typescript
interface Logger {
  log(nivel: string, ...mensagens: string[]): void;
}

class ConsoleLogger implements Logger {
  log(nivel: string, ...mensagens: string[]): void {
    console.log(`[${nivel}]`, mensagens.join(" "));
  }
}

const logger: Logger = new ConsoleLogger();
logger.log("INFO", "Sistema", "iniciado", "com", "sucesso");
// [INFO] Sistema iniciado com sucesso
```

**Fundamento conceitual:** Rest parameters (`...args: Type[]`) permitem número variável de argumentos.

### Generic Methods

```typescript
interface Repositorio {
  buscar<T>(filtro: (item: T) => boolean): T[];
  mapear<T, U>(items: T[], transformar: (item: T) => U): U[];
}

class RepositorioImpl implements Repositorio {
  private dados: any[] = [];
  
  buscar<T>(filtro: (item: T) => boolean): T[] {
    return this.dados.filter(filtro) as T[];
  }
  
  mapear<T, U>(items: T[], transformar: (item: T) => U): U[] {
    return items.map(transformar);
  }
}

const repo: Repositorio = new RepositorioImpl();
const numeros = repo.buscar<number>(x => x > 5);
const strings = repo.mapear<number, string>([1, 2, 3], n => `Número ${n}`);
```

**Conceito avançado:** Methods podem ser genéricos com type parameters.

### Method Overloading

```typescript
interface Processador {
  processar(valor: string): string;
  processar(valor: number): number;
  processar(valor: boolean): boolean;
}

class ProcessadorImpl implements Processador {
  // Signature overloads
  processar(valor: string): string;
  processar(valor: number): number;
  processar(valor: boolean): boolean;
  
  // Implementation signature
  processar(valor: string | number | boolean): string | number | boolean {
    if (typeof valor === "string") {
      return valor.toUpperCase();
    } else if (typeof valor === "number") {
      return valor * 2;
    } else {
      return !valor;
    }
  }
}

const proc: Processador = new ProcessadorImpl();
console.log(proc.processar("hello")); // "HELLO"
console.log(proc.processar(10)); // 20
console.log(proc.processar(true)); // false
```

**Análise teórica:** Múltiplas signatures para mesmo método permitem diferentes combinações de parâmetros/retornos.

### This Type

```typescript
interface Fluent {
  definirNome(nome: string): this;
  definirIdade(idade: number): this;
}

class Pessoa implements Fluent {
  private nome: string = "";
  private idade: number = 0;
  
  definirNome(nome: string): this {
    this.nome = nome;
    return this;
  }
  
  definirIdade(idade: number): this {
    this.idade = idade;
    return this;
  }
  
  obterInfo(): string {
    return `${this.nome}, ${this.idade} anos`;
  }
}

// Fluent API
const pessoa = new Pessoa()
  .definirNome("Ana")
  .definirIdade(25)
  .obterInfo(); // "Ana, 25 anos"
```

**Conceito crucial:** `this` como tipo de retorno permite fluent APIs (method chaining).

### Async Methods

```typescript
interface DataService {
  buscarDados(id: number): Promise<any>;
  salvarDados(dados: any): Promise<void>;
}

class APIService implements DataService {
  async buscarDados(id: number): Promise<any> {
    const response = await fetch(`/api/data/${id}`);
    return response.json();
  }
  
  async salvarDados(dados: any): Promise<void> {
    await fetch("/api/data", {
      method: "POST",
      body: JSON.stringify(dados)
    });
  }
}

async function usar(service: DataService) {
  const dados = await service.buscarDados(1);
  console.log(dados);
  await service.salvarDados({ nome: "Teste" });
}
```

**Fundamento teórico:** Methods retornando `Promise<T>` podem ser implementados como `async` functions.

### Callbacks em Methods

```typescript
interface EventEmitter {
  on(evento: string, callback: (dados: any) => void): void;
  emit(evento: string, dados: any): void;
}

class Emitter implements EventEmitter {
  private listeners = new Map<string, ((dados: any) => void)[]>();
  
  on(evento: string, callback: (dados: any) => void): void {
    if (!this.listeners.has(evento)) {
      this.listeners.set(evento, []);
    }
    this.listeners.get(evento)!.push(callback);
  }
  
  emit(evento: string, dados: any): void {
    const callbacks = this.listeners.get(evento) || [];
    callbacks.forEach(cb => cb(dados));
  }
}

const emitter: EventEmitter = new Emitter();
emitter.on("data", (d) => console.log("Recebido:", d));
emitter.emit("data", { valor: 123 });
// Recebido: { valor: 123 }
```

**Análise profunda:** Methods podem receber callbacks (funções) como parâmetros, útil para event handling.

### Union Return Types

```typescript
interface Parser {
  parse(input: string): number | null;
  validate(input: string): boolean | Error;
}

class JSONParser implements Parser {
  parse(input: string): number | null {
    try {
      const num = JSON.parse(input);
      return typeof num === "number" ? num : null;
    } catch {
      return null;
    }
  }
  
  validate(input: string): boolean | Error {
    try {
      JSON.parse(input);
      return true;
    } catch (e) {
      return e as Error;
    }
  }
}
```

**Conceito avançado:** Methods podem retornar union types, útil para representar sucesso/falha.

## 🎯 Aplicabilidade e Contextos

### Quando Usar Method Signatures

**1. Service Interfaces**
```typescript
interface UserService {
  createUser(data: UserData): Promise<User>;
  deleteUser(id: number): Promise<void>;
}
```

**Raciocínio:** Definir API de serviço que múltiplas implementações podem prover.

**2. Repository Pattern**
```typescript
interface Repository<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
}
```

**Raciocínio:** Abstrair acesso a dados, permitir mock para testes.

**3. Strategy Pattern**
```typescript
interface SortStrategy {
  sort(items: number[]): number[];
}
```

**Raciocínio:** Definir família de algoritmos intercambiáveis.

## ⚠️ Limitações e Considerações Teóricas

### No Implementation Sharing

Interface não fornece implementação:

```typescript
interface Base {
  metodo(): void;
}

// Cada implementação deve fornecer código
class A implements Base {
  metodo() { /* implementar */ }
}
class B implements Base {
  metodo() { /* reimplementar */ }
}
```

**Solução:** Use abstract class para compartilhar código.

### Method vs Property Function

Diferenças sutis:

```typescript
interface I1 {
  metodo(): void; // Method
}

interface I2 {
  metodo: () => void; // Property function
}

// Implementações são diferentes
class C1 implements I1 {
  metodo() {} // Method - this dinâmico
}

class C2 implements I2 {
  metodo = () => {} // Arrow function - this léxico
}
```

## 🔗 Interconexões Conceituais

**Relação com Polimorfismo:** Methods permitem múltiplas implementações.

**Relação com Dependency Injection:** Código depende de interface, recebe implementação.

**Relação com Testing:** Mocks implementam methods para testes.

**Relação com Design Patterns:** Strategy, Factory dependem de method signatures.

## 🚀 Evolução e Próximos Conceitos

Dominar method signatures prepara para:
- **Generic Interfaces:** Interfaces com type parameters
- **Callback Types:** Types complexos para callbacks
- **Conditional Types:** Types baseados em method signatures
- **Utility Types:** Tipos que extraem/transformam methods
