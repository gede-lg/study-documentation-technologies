# Interfaces para Polimorfismo

## 🎯 Introdução e Definição

### Definição Conceitual

**Interfaces para polimorfismo** é o uso de interfaces TypeScript como **contratos abstratos** que permitem **múltiplas implementações concretas** serem tratadas **uniformemente** através de uma mesma abstração. Conceitualmente, interfaces implementam **polimorfismo de subtipo** (subtype polymorphism) - código pode operar sobre abstração (interface) sem conhecer implementação concreta, permitindo **extensibilidade** e **flexibilidade**.

Uma interface define **o quê** (métodos, propriedades) sem especificar **como** (implementação). Classes ou objetos que implementam interface prometem fornecer funcionalidades especificadas. Código que depende de interface pode aceitar **qualquer implementação**, permitindo **trocar implementações** sem modificar código cliente - princípio **Dependency Inversion** (DIP) e **Open/Closed Principle** (OCP).

### Contexto Histórico e Motivação

A evolução de interfaces para polimorfismo:

**Linguagens OOP Clássicas (Java, C#):** Interfaces como **contratos formais** - classes declaram `implements Interface` para cumprir contrato. Permite polimorfismo sem herança múltipla.

**Design Patterns (Gang of Four, 1994):** Padrões como Strategy, Factory, Observer usam interfaces para **desacoplar** abstrações de implementações.

**SOLID Principles (Robert C. Martin):** 
- **Dependency Inversion:** Dependa de abstrações (interfaces), não de concreções
- **Interface Segregation:** Interfaces pequenas e específicas
- **Open/Closed:** Aberto para extensão (novas implementações), fechado para modificação

**TypeScript:** Adotou interfaces para polimorfismo, mas com **structural typing** - não requer `implements` explícito, basta compatibilidade estrutural.

**Motivação:**
- **Decoupling:** Desacoplar código de implementações específicas
- **Extensibility:** Adicionar novas implementações sem modificar código existente
- **Testability:** Substituir implementações reais por mocks em testes
- **Code Reuse:** Escrever código genérico que funciona com múltiplas implementações

### Problema Fundamental que Resolve

Interfaces para polimorfismo resolvem problemas específicos:

**1. Acoplamento Rígido**
```typescript
// ❌ Acoplado a implementação concreta
class EmailService {
  send(msg: string) { /* email */ }
}

class App {
  constructor(private emailService: EmailService) {}
}

// ✅ Desacoplado - usa interface
interface Notifier {
  send(msg: string): void;
}

class App2 {
  constructor(private notifier: Notifier) {}  // Aceita qualquer Notifier
}
```

**2. Dificuldade de Extensão**
```typescript
// Interface permite múltiplas implementações
interface PaymentProcessor {
  process(amount: number): Promise<void>;
}

class CreditCardProcessor implements PaymentProcessor {
  async process(amount: number) { /* cartão */ }
}

class PixProcessor implements PaymentProcessor {
  async process(amount: number) { /* PIX */ }
}

// Código cliente aceita ambos
function checkout(processor: PaymentProcessor, amount: number) {
  return processor.process(amount);
}

checkout(new CreditCardProcessor(), 100);  // ✅
checkout(new PixProcessor(), 100);         // ✅
```

**3. Testing Difícil**
```typescript
// Interface permite mock
interface Database {
  query(sql: string): Promise<any>;
}

class ProductionDB implements Database {
  async query(sql: string) { /* real DB */ }
}

class MockDB implements Database {
  async query(sql: string) { return []; }  // Mock
}

class Service {
  constructor(private db: Database) {}  // Aceita real ou mock
}

// Produção
new Service(new ProductionDB());

// Teste
new Service(new MockDB());
```

**4. Violação de Princípios SOLID**
```typescript
// ❌ Violação DIP - depende de concreção
class Service {
  constructor(private logger: ConsoleLogger) {}
}

// ✅ Segue DIP - depende de abstração
interface Logger {
  log(msg: string): void;
}

class Service2 {
  constructor(private logger: Logger) {}  // Abstração
}
```

### Importância no Ecossistema

Interfaces para polimorfismo são importantes porque:

- **Dependency Injection:** Frameworks injetam dependências via interfaces
- **Plugin Systems:** Plugins implementam interfaces para serem descobertos
- **Strategy Pattern:** Estratégias intercambiáveis através de interface comum
- **Adapter Pattern:** Adapters implementam interface esperada
- **Testing:** Mocks/stubs implementam interfaces de dependências

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Contract:** Interface define contrato que implementações cumprem
2. **Abstraction:** Código cliente depende de abstração, não implementação
3. **Multiple Implementations:** Uma interface, múltiplas implementações
4. **Substitutability:** Implementações são intercambiáveis
5. **Decoupling:** Interface desacopla cliente de implementação

### Pilares Fundamentais

- **Interface Definition:** `interface Logger { log(msg): void; }`
- **Implementation:** `class ConsoleLogger implements Logger { }`
- **Dependency:** `constructor(private logger: Logger)`
- **Injection:** `new Service(new ConsoleLogger())`
- **Polymorphism:** Tratar diferentes implementações uniformemente

### Visão Geral das Nuances

- **Structural Typing:** TypeScript não requer `implements` explícito
- **Multiple Interfaces:** Classe pode implementar múltiplas interfaces
- **Interface Extension:** Interfaces podem estender outras interfaces
- **Optional Members:** Interfaces podem ter membros opcionais
- **Generic Interfaces:** Interfaces podem ser genéricas

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Interface as Contract

```typescript
// Contrato: qualquer Logger deve ter método log
interface Logger {
  log(message: string): void;
}

// Implementação 1: Console
class ConsoleLogger implements Logger {
  log(message: string) {
    console.log(message);
  }
}

// Implementação 2: File
class FileLogger implements Logger {
  log(message: string) {
    // Salvar em arquivo
  }
}

// Código cliente - depende de abstração
class Application {
  constructor(private logger: Logger) {}
  
  run() {
    this.logger.log("App iniciado");  // Polimorfismo!
  }
}

// Injetar implementação concreta
const app1 = new Application(new ConsoleLogger());
const app2 = new Application(new FileLogger());
```

**Análise profunda:**
1. **Interface:** Define contrato `Logger` com método `log`
2. **Implementations:** `ConsoleLogger` e `FileLogger` cumprem contrato
3. **Client Code:** `Application` depende de `Logger` abstrato
4. **Polymorphism:** `app1` e `app2` funcionam com diferentes loggers
5. **Compile-Time:** TypeScript valida que implementações cumprem contrato

**Fundamento conceitual:** Interface desacopla abstração de implementação, permitindo polimorfismo.

### Princípios e Conceitos Subjacentes

#### Dependency Inversion Principle (DIP)

**Definição:** Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações.

```typescript
// ❌ Violação DIP
class OrderService {
  private emailSender: EmailSender;  // Depende de concreção
  
  constructor() {
    this.emailSender = new EmailSender();  // Criação direta
  }
}

// ✅ Segue DIP
interface Notifier {
  notify(msg: string): void;
}

class OrderService2 {
  constructor(private notifier: Notifier) {}  // Depende de abstração
}

// Injeção de dependência
const emailNotifier = new EmailNotifier();
const service = new OrderService2(emailNotifier);
```

**Conceito crucial:** DIP inverte direção de dependência - baixo nível implementa interface definida por alto nível.

#### Open/Closed Principle (OCP)

**Definição:** Entidades devem ser abertas para extensão, fechadas para modificação.

```typescript
interface Shape {
  area(): number;
}

class AreaCalculator {
  calculateTotal(shapes: Shape[]): number {
    return shapes.reduce((total, shape) => total + shape.area(), 0);
  }
}

// Extensão - nova shape
class Triangle implements Shape {
  constructor(private base: number, private altura: number) {}
  
  area(): number {
    return (this.base * this.altura) / 2;
  }
}

// AreaCalculator não precisa mudar - aberto para extensão, fechado para modificação
const calc = new AreaCalculator();
calc.calculateTotal([new Triangle(10, 5)]);  // ✅ Funciona
```

**Análise profunda:** Interface permite adicionar novas implementações sem modificar código existente.

#### Liskov Substitution Principle (LSP)

**Definição:** Subtipos devem ser substituíveis por seus tipos base.

```typescript
interface Database {
  query(sql: string): Promise<any[]>;
}

class PostgresDB implements Database {
  async query(sql: string): Promise<any[]> {
    // Implementação PostgreSQL
    return [];
  }
}

class MySQLDB implements Database {
  async query(sql: string): Promise<any[]> {
    // Implementação MySQL
    return [];
  }
}

function processData(db: Database) {
  return db.query("SELECT * FROM users");  // Funciona com qualquer Database
}

processData(new PostgresDB());  // ✅ Substituível
processData(new MySQLDB());     // ✅ Substituível
```

**Fundamento teórico:** Implementações de interface são intercambiáveis - LSP garantido.

### Modelo Mental para Compreensão

Pense em interface como **especificação de produto**:

**Interface:** Especificação técnica
```
Especificação "Carregador USB-C":
- Entrada: 100-240V AC
- Saída: 5V DC, 3A
- Conector: USB-C
```

**Implementações:** Fabricantes diferentes
```
Fabricante A: Cumpre spec + LED indicador (extra)
Fabricante B: Cumpre spec + design compacto (extra)
```

**Polimorfismo:** Consumidor (você)
- Compra qualquer carregador que cumpra spec
- Funciona independente do fabricante
- Pode trocar fabricantes sem problema

**Código:**
```typescript
interface USBCharger {
  voltage: number;
  current: number;
  charge(): void;
}

class BrandA implements USBCharger {
  voltage = 5; current = 3;
  charge() { /* com LED */ }
}

class BrandB implements USBCharger {
  voltage = 5; current = 3;
  charge() { /* design compacto */ }
}

function useCharger(charger: USBCharger) {
  charger.charge();  // Funciona com qualquer marca
}
```

## 🔍 Análise Conceitual Profunda

### Basic Interface Polymorphism

```typescript
interface Animal {
  nome: string;
  fazerSom(): void;
}

class Cachorro implements Animal {
  constructor(public nome: string) {}
  
  fazerSom() {
    console.log("Au au");
  }
}

class Gato implements Animal {
  constructor(public nome: string) {}
  
  fazerSom() {
    console.log("Miau");
  }
}

function interagir(animal: Animal) {
  console.log(`${animal.nome} diz:`);
  animal.fazerSom();  // Polimorfismo
}

interagir(new Cachorro("Rex"));  // Rex diz: Au au
interagir(new Gato("Mimi"));     // Mimi diz: Miau
```

**Análise teórica:** Função `interagir` opera sobre abstração `Animal`, funciona com qualquer implementação.

### Strategy Pattern

```typescript
interface SortStrategy {
  sort(array: number[]): number[];
}

class QuickSort implements SortStrategy {
  sort(array: number[]): number[] {
    // Implementação quicksort
    return array.sort((a, b) => a - b);
  }
}

class BubbleSort implements SortStrategy {
  sort(array: number[]): number[] {
    // Implementação bubblesort
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

class Sorter {
  constructor(private strategy: SortStrategy) {}
  
  setStrategy(strategy: SortStrategy) {
    this.strategy = strategy;
  }
  
  sort(array: number[]): number[] {
    return this.strategy.sort(array);
  }
}

const sorter = new Sorter(new QuickSort());
sorter.sort([3, 1, 2]);  // QuickSort

sorter.setStrategy(new BubbleSort());
sorter.sort([3, 1, 2]);  // BubbleSort
```

**Fundamento conceitual:** Strategy pattern usa interface para trocar algoritmos dinamicamente.

### Dependency Injection

```typescript
interface Logger {
  log(msg: string): void;
  error(msg: string): void;
}

interface Database {
  query(sql: string): Promise<any>;
}

class UserService {
  constructor(
    private logger: Logger,
    private database: Database
  ) {}
  
  async getUser(id: number) {
    this.logger.log(`Buscando usuário ${id}`);
    try {
      const user = await this.database.query(`SELECT * FROM users WHERE id = ${id}`);
      return user;
    } catch (error) {
      this.logger.error(`Erro ao buscar usuário: ${error}`);
      throw error;
    }
  }
}

// Produção
const service = new UserService(
  new ConsoleLogger(),
  new PostgresDB()
);

// Teste
const testService = new UserService(
  new MockLogger(),
  new MockDB()
);
```

**Análise profunda:** DI via interfaces permite trocar implementações facilmente.

### Multiple Interface Implementation

```typescript
interface Printable {
  print(): void;
}

interface Savable {
  save(): void;
}

class Document implements Printable, Savable {
  constructor(private content: string) {}
  
  print() {
    console.log(this.content);
  }
  
  save() {
    console.log("Salvando documento...");
  }
}

function processPrintable(p: Printable) {
  p.print();
}

function processSavable(s: Savable) {
  s.save();
}

const doc = new Document("Hello");
processPrintable(doc);  // ✅ Document é Printable
processSavable(doc);    // ✅ Document é Savable
```

**Conceito avançado:** Classe pode implementar múltiplas interfaces, permitindo polimorfismo em múltiplas dimensões.

### Interface Extension

```typescript
interface Entity {
  id: number;
}

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface User extends Entity, Timestamped {
  nome: string;
  email: string;
}

class UserImpl implements User {
  constructor(
    public id: number,
    public nome: string,
    public email: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}

function processEntity(entity: Entity) {
  console.log(`Entity ID: ${entity.id}`);
}

processEntity(new UserImpl(1, "Ana", "ana@example.com"));  // ✅
```

**Fundamento teórico:** Interface extension permite composição hierárquica de contratos.

### Generic Interface Polymorphism

```typescript
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<void>;
  delete(id: number): Promise<void>;
}

class UserRepository implements Repository<User> {
  async findById(id: number): Promise<User | null> {
    // Implementação específica para User
    return null;
  }
  
  async save(user: User): Promise<void> {
    // Salvar user
  }
  
  async delete(id: number): Promise<void> {
    // Deletar user
  }
}

class ProductRepository implements Repository<Product> {
  async findById(id: number): Promise<Product | null> {
    return null;
  }
  
  async save(product: Product): Promise<void> { }
  
  async delete(id: number): Promise<void> { }
}

function processRepository<T>(repo: Repository<T>, id: number) {
  return repo.findById(id);
}

processRepository(new UserRepository(), 1);     // Promise<User | null>
processRepository(new ProductRepository(), 2);  // Promise<Product | null>
```

**Análise profunda:** Generic interfaces permitem polimorfismo type-safe com diferentes tipos.

### Factory Pattern

```typescript
interface Notification {
  send(recipient: string, message: string): void;
}

class EmailNotification implements Notification {
  send(recipient: string, message: string) {
    console.log(`Email para ${recipient}: ${message}`);
  }
}

class SMSNotification implements Notification {
  send(recipient: string, message: string) {
    console.log(`SMS para ${recipient}: ${message}`);
  }
}

class NotificationFactory {
  static create(type: "email" | "sms"): Notification {
    switch (type) {
      case "email":
        return new EmailNotification();
      case "sms":
        return new SMSNotification();
    }
  }
}

const notif: Notification = NotificationFactory.create("email");
notif.send("ana@example.com", "Hello");  // Polimorfismo
```

**Conceito avançado:** Factory retorna interface, ocultando implementação concreta.

### Observer Pattern

```typescript
interface Observer {
  update(data: any): void;
}

interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

class ConcreteSubject implements Subject {
  private observers: Observer[] = [];
  private state: any;
  
  attach(observer: Observer) {
    this.observers.push(observer);
  }
  
  detach(observer: Observer) {
    const index = this.observers.indexOf(observer);
    this.observers.splice(index, 1);
  }
  
  notify() {
    for (const observer of this.observers) {
      observer.update(this.state);
    }
  }
  
  setState(state: any) {
    this.state = state;
    this.notify();
  }
}

class ConcreteObserver implements Observer {
  constructor(private name: string) {}
  
  update(data: any) {
    console.log(`${this.name} recebeu: ${data}`);
  }
}

const subject = new ConcreteSubject();
subject.attach(new ConcreteObserver("Observer1"));
subject.attach(new ConcreteObserver("Observer2"));
subject.setState("Novo estado");  // Ambos observers notificados
```

**Fundamento teórico:** Observer pattern usa interfaces para desacoplar subject de observers.

### Adapter Pattern

```typescript
// Interface esperada pelo cliente
interface Target {
  request(): string;
}

// Classe existente com interface incompatível
class Adaptee {
  specificRequest(): string {
    return "Comportamento específico";
  }
}

// Adapter implementa Target e adapta Adaptee
class Adapter implements Target {
  constructor(private adaptee: Adaptee) {}
  
  request(): string {
    return `Adaptado: ${this.adaptee.specificRequest()}`;
  }
}

function clientCode(target: Target) {
  console.log(target.request());
}

clientCode(new Adapter(new Adaptee()));  // ✅ Polimorfismo via adapter
```

**Análise profunda:** Adapter implementa interface para fazer classe incompatível funcionar.

### Structural Typing Polymorphism

```typescript
interface Logger {
  log(msg: string): void;
}

// Não usa implements, mas é estruturalmente compatível
const consoleLogger = {
  log(msg: string) {
    console.log(msg);
  },
  extra: "propriedade adicional"
};

function useLogger(logger: Logger) {
  logger.log("Hello");
}

useLogger(consoleLogger);  // ✅ Duck typing + polimorfismo
```

**Conceito crucial:** TypeScript permite polimorfismo via structural typing, sem `implements` explícito.

### Optional Methods in Interface

```typescript
interface Plugin {
  nome: string;
  iniciar(): void;
  parar?(): void;  // Opcional
}

class SimplePlugin implements Plugin {
  nome = "Simple";
  
  iniciar() {
    console.log("Iniciado");
  }
  // parar não implementado - OK
}

class ComplexPlugin implements Plugin {
  nome = "Complex";
  
  iniciar() {
    console.log("Iniciado");
  }
  
  parar() {
    console.log("Parado");
  }
}

function gerenciarPlugin(plugin: Plugin) {
  plugin.iniciar();
  if (plugin.parar) {
    plugin.parar();  // Safe call
  }
}

gerenciarPlugin(new SimplePlugin());   // ✅ Apenas iniciar
gerenciarPlugin(new ComplexPlugin());  // ✅ Iniciar e parar
```

**Fundamento teórico:** Métodos opcionais permitem interfaces flexíveis com implementações variadas.

## 🎯 Aplicabilidade e Contextos

### Logging System

```typescript
interface Logger {
  log(level: string, msg: string): void;
}

class ConsoleLogger implements Logger {
  log(level: string, msg: string) {
    console.log(`[${level}] ${msg}`);
  }
}

class FileLogger implements Logger {
  log(level: string, msg: string) {
    // Escrever em arquivo
  }
}

class Application {
  constructor(private logger: Logger) {}
  
  run() {
    this.logger.log("INFO", "App running");
  }
}

// Produção: FileLogger
new Application(new FileLogger());

// Desenvolvimento: ConsoleLogger
new Application(new ConsoleLogger());
```

**Raciocínio:** Interface permite trocar logger sem modificar Application.

### Payment Processing

```typescript
interface PaymentGateway {
  processPayment(amount: number, details: any): Promise<PaymentResult>;
}

class StripeGateway implements PaymentGateway {
  async processPayment(amount: number, details: any) {
    // Integração Stripe
    return { success: true, transactionId: "stripe_123" };
  }
}

class PayPalGateway implements PaymentGateway {
  async processPayment(amount: number, details: any) {
    // Integração PayPal
    return { success: true, transactionId: "paypal_456" };
  }
}

class CheckoutService {
  constructor(private gateway: PaymentGateway) {}
  
  async checkout(cart: Cart) {
    const total = cart.getTotal();
    return this.gateway.processPayment(total, cart);
  }
}

// Configuração dinâmica
const gateway = config.paymentProvider === "stripe" 
  ? new StripeGateway() 
  : new PayPalGateway();

const service = new CheckoutService(gateway);
```

**Raciocínio:** Interface permite múltiplos gateways de pagamento intercambiáveis.

### Testing com Mocks

```typescript
interface EmailService {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}

class SMTPEmailService implements EmailService {
  async sendEmail(to: string, subject: string, body: string) {
    // Enviar email real via SMTP
  }
}

class MockEmailService implements EmailService {
  sentEmails: Array<{ to: string; subject: string; body: string }> = [];
  
  async sendEmail(to: string, subject: string, body: string) {
    this.sentEmails.push({ to, subject, body });  // Apenas armazena
  }
}

class UserService {
  constructor(private emailService: EmailService) {}
  
  async registerUser(email: string) {
    // ... lógica de registro
    await this.emailService.sendEmail(email, "Welcome", "Hello!");
  }
}

// Teste
const mockEmail = new MockEmailService();
const service = new UserService(mockEmail);
await service.registerUser("test@example.com");
console.log(mockEmail.sentEmails);  // Verificar emails enviados
```

**Raciocínio:** Interface permite substituir serviço real por mock em testes.

## ⚠️ Limitações e Considerações Teóricas

### Structural Typing Ambiguity

```typescript
interface A {
  value: number;
}

interface B {
  value: number;
}

const obj: A = { value: 10 };
const b: B = obj;  // ✅ OK - mesma estrutura, mas semanticamente diferentes
```

**Limitação:** Structural typing não distingue interfaces semanticamente diferentes com mesma estrutura.

### No Runtime Type Information

```typescript
interface Logger {
  log(msg: string): void;
}

function processLogger(logger: Logger) {
  // ❌ Não pode verificar tipo concreto em runtime
  // if (logger instanceof ConsoleLogger) { }  // Erro
}
```

**Limitação:** Interfaces desaparecem em runtime - sem type checking.

### Interface Explosion

```typescript
// ❌ Muitas interfaces pequenas - complexidade
interface Readable { read(): void; }
interface Writable { write(): void; }
interface Closable { close(): void; }
interface Flushable { flush(): void; }

class File implements Readable, Writable, Closable, Flushable {
  read() { }
  write() { }
  close() { }
  flush() { }
}
```

**Limitação:** Interface Segregation Principle pode levar a explosão de interfaces.

## 🔗 Interconexões Conceituais

**Relação com SOLID:** Interfaces implementam DIP, OCP, ISP.

**Relação com Design Patterns:** Strategy, Factory, Adapter, Observer usam interfaces.

**Relação com DI:** Dependency Injection baseada em interfaces.

**Relação com Testing:** Mocks implementam interfaces.

## 🚀 Evolução e Próximos Conceitos

Dominar interfaces para polimorfismo prepara para:
- **Advanced Design Patterns:** Composite, Decorator, Proxy
- **Dependency Injection Frameworks:** Angular, NestJS
- **Generic Programming:** Constraints com interfaces
- **Architecture Patterns:** Clean Architecture, Hexagonal Architecture
