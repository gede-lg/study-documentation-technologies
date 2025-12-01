# Abstract Classes

## 🎯 Introdução e Definição

### Definição Conceitual

**Abstract classes** (classes abstratas) são classes que não podem ser instanciadas diretamente e servem como **templates** ou **blueprints** para outras classes. Elas definem uma **interface comum** e **comportamento compartilhado** que subclasses devem implementar ou herdar. Uma abstract class pode conter **abstract methods** (métodos sem implementação que subclasses devem implementar) e **concrete methods** (métodos com implementação que subclasses herdam).

Conceitualmente, abstract classes implementam **incomplete types** e **behavioral contracts**: definem **o que** deve ser feito (via abstract methods) sem especificar **como** (deixando implementação para subclasses). Combinam **herança** (reutilização de código) com **polimorfismo** (múltiplas implementações de mesma interface).

### Contexto Histórico e Motivação

A evolução de abstract classes na programação:

**Simula 67 (1967):** Introduziu classes, mas sem conceito formal de abstração.

**Smalltalk (1980):** Popularizou "abstract superclasses" como forma de compartilhar código entre subclasses.

**C++ (1985):** Introduziu **pure virtual functions** (`virtual void metodo() = 0;`) que tornavam classes abstratas.

**Java (1995):** Formalizou keyword `abstract` para classes e métodos, estabelecendo distinção clara entre abstract classes e interfaces.

**C# (2000):** Seguiu modelo Java, adicionando abstract classes ao sistema de tipos.

**TypeScript (2012):** Introduziu `abstract` keyword para trazer conceito de OOP clássico ao JavaScript, que não tem suporte nativo.

A motivação era **design por contrato** e **reutilização**: permitir que superclasses definam estrutura e comportamento comum, enquanto delegam detalhes específicos às subclasses, eliminando duplicação e garantindo consistência.

### Problema Fundamental que Resolve

Abstract classes resolvem problemas críticos de design:

**1. Template Method Pattern:** Definir algoritmo geral na superclass, deixando passos específicos para subclasses.

**2. Incomplete Types:** Representar conceitos que não fazem sentido instanciar diretamente (ex: "Animal" genérico vs "Cachorro" específico).

**3. Shared Behavior:** Centralizar código comum entre subclasses relacionadas.

**4. Enforcing Contracts:** Garantir que subclasses implementem métodos específicos.

**5. Polymorphism:** Permitir tratar subclasses diferentes através de tipo abstrato comum.

**6. Preventing Instantiation:** Impedir criação de objetos de tipos incompletos ou genéricos demais.

### Importância no Ecossistema

Abstract classes são fundamentais porque:

- **Framework Design:** Base classes abstratas definem pontos de extensão para usuários (ex: `Component` no Angular)
- **Domain Modeling:** Representar hierarquias de conceitos (ex: `Veiculo` → `Carro`, `Moto`)
- **Code Reuse:** Eliminar duplicação de código entre classes relacionadas
- **Type Safety:** TypeScript verifica que subclasses implementam todos os abstract methods
- **API Design:** Definir contratos que implementações devem seguir

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Não Instanciável:** Abstract classes não podem ser instanciadas com `new`
2. **Template:** Servem como base para subclasses concretas
3. **Abstract Methods:** Declarados sem implementação (apenas assinatura)
4. **Concrete Methods:** Implementados normalmente, herdados por subclasses
5. **Inheritance:** Subclasses estendem abstract class e implementam abstract methods

### Pilares Fundamentais

- **Keyword abstract:** Declara classe ou method como abstrato
- **Extends:** Subclasses estendem abstract class
- **Implementation Requirement:** Subclasses devem implementar todos os abstract methods
- **Type Polymorphism:** Variáveis de tipo abstrato podem referenciar subclasses concretas

### Visão Geral das Nuances

- **Partial Implementation:** Abstract class pode ter alguns methods implementados, outros não
- **Access Modifiers:** Abstract methods podem ser public, protected (não private)
- **No Direct Instantiation:** `new AbstractClass()` resulta em erro de compilação
- **Diferença de Interface:** Interfaces são pure contracts; abstract classes podem ter implementação

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Quando TypeScript compila abstract classes:

**1. Parsing:** Identifica keyword `abstract` em class declarations e method declarations.

**2. Type Checking:**
   - Verifica que abstract class não é instanciada diretamente
   - Valida que subclasses concretas implementam todos os abstract methods
   - Checa tipos de implementações contra assinaturas abstratas

**3. Inheritance Validation:** Garante que chain de herança eventualmente implementa todos os abstract methods.

**4. Code Generation:**
   - Em runtime JavaScript, abstract classes são classes normais (JavaScript não tem conceito de abstract)
   - TypeScript gera classe normal, mas **type checking** em compile-time impede instanciação

**5. Type System:** Abstract class é tratado como tipo que pode referenciar qualquer subclasse concreta.

### Princípios e Conceitos Subjacentes

#### Template Method Pattern

Padrão de design onde abstract class define **skeleton** de algoritmo, deixando passos específicos para subclasses:

```typescript
abstract class ProcessadorDados {
  // Template method - define algoritmo geral
  processar(): void {
    this.carregar();
    this.validar();
    this.transformar();
    this.salvar();
  }
  
  // Abstract methods - passos específicos
  protected abstract carregar(): void;
  protected abstract validar(): void;
  protected abstract transformar(): void;
  
  // Concrete method - comportamento comum
  protected salvar(): void {
    console.log("Salvando dados...");
  }
}

class ProcessadorCSV extends ProcessadorDados {
  protected carregar(): void {
    console.log("Carregando CSV...");
  }
  
  protected validar(): void {
    console.log("Validando formato CSV...");
  }
  
  protected transformar(): void {
    console.log("Transformando CSV...");
  }
}

const proc = new ProcessadorCSV();
proc.processar();
// Carregando CSV...
// Validando formato CSV...
// Transformando CSV...
// Salvando dados...
```

**Fundamento conceitual:** Superclass define **estrutura** (template method `processar()`), subclasses definem **detalhes** (implementações específicas).

#### Incomplete Types

Abstract classes representam tipos **incompletos** - conceitos que não fazem sentido instanciar diretamente:

```typescript
abstract class Forma {
  abstract calcularArea(): number;
  abstract calcularPerimetro(): number;
  
  descrever(): void {
    console.log(`Área: ${this.calcularArea()}`);
    console.log(`Perímetro: ${this.calcularPerimetro()}`);
  }
}

class Circulo extends Forma {
  constructor(private raio: number) {
    super();
  }
  
  calcularArea(): number {
    return Math.PI * this.raio ** 2;
  }
  
  calcularPerimetro(): number {
    return 2 * Math.PI * this.raio;
  }
}

// const forma = new Forma(); // ❌ Erro: Cannot create instance of abstract class
const circulo = new Circulo(5); // ✅ Subclasse concreta
circulo.descrever();
```

**Análise profunda:** "Forma" é conceito abstrato - não existe "forma genérica" no mundo real. Apenas formas específicas (círculo, quadrado). Abstract class modela isso.

#### Polymorphism com Abstract Types

```typescript
abstract class Animal {
  constructor(protected nome: string) {}
  
  abstract emitirSom(): void;
  
  apresentar(): void {
    console.log(`Eu sou ${this.nome}`);
    this.emitirSom();
  }
}

class Cachorro extends Animal {
  emitirSom(): void {
    console.log("Au au!");
  }
}

class Gato extends Animal {
  emitirSom(): void {
    console.log("Miau!");
  }
}

// Polymorphism - tipo abstrato referencia subclasses concretas
const animais: Animal[] = [
  new Cachorro("Rex"),
  new Gato("Mimi"),
  new Cachorro("Toby")
];

animais.forEach(animal => animal.apresentar());
// Eu sou Rex
// Au au!
// Eu sou Mimi
// Miau!
// Eu sou Toby
// Au au!
```

**Conceito fundamental:** Variáveis de tipo `Animal` (abstrato) podem referenciar qualquer subclasse concreta. Chamada a `emitirSom()` é **polimórfica** - executa implementação correta baseada em tipo real do objeto.

### Modelo Mental para Compreensão

Pense em abstract class como **blueprint arquitetônico**:

- **Abstract Class:** Planta genérica de casa (define estrutura: deve ter cozinha, banheiro, quartos)
- **Abstract Methods:** Especificações incompletas ("deve ter cozinha" mas não diz como será a cozinha)
- **Concrete Methods:** Especificações completas ("sistema elétrico 220V" - aplicável a todas as casas)
- **Subclasses Concretas:** Plantas específicas (casa moderna, casa colonial) que implementam detalhes

Não se constrói "casa genérica" (instanciação de abstract class), mas sim casas específicas baseadas no blueprint.

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica de Abstract Class

```typescript
abstract class Veiculo {
  constructor(protected marca: string) {}
  
  // Abstract method - sem implementação
  abstract ligar(): void;
  abstract desligar(): void;
  
  // Concrete method - com implementação
  buzinar(): void {
    console.log("Beep beep!");
  }
}

class Carro extends Veiculo {
  // Deve implementar todos os abstract methods
  ligar(): void {
    console.log(`${this.marca}: Motor ligado`);
  }
  
  desligar(): void {
    console.log(`${this.marca}: Motor desligado`);
  }
}

const carro = new Carro("Toyota");
carro.ligar(); // "Toyota: Motor ligado"
carro.buzinar(); // "Beep beep!" - herdado
carro.desligar(); // "Toyota: Motor desligado"

// const veiculo = new Veiculo("Generic"); // ❌ Erro em compile-time
```

**Análise conceitual:** 
- `abstract class` declara classe não instanciável
- `abstract method` declara método sem corpo
- Subclasses devem implementar todos os abstract methods

### Abstract Methods com Parâmetros e Retorno

```typescript
abstract class RepositorioDados<T> {
  // Abstract method com parâmetros e tipo de retorno
  abstract buscarPorId(id: number): Promise<T | null>;
  abstract buscarTodos(): Promise<T[]>;
  abstract salvar(entidade: T): Promise<void>;
  abstract deletar(id: number): Promise<boolean>;
  
  // Concrete method usando abstract methods
  async existeComId(id: number): Promise<boolean> {
    const entidade = await this.buscarPorId(id);
    return entidade !== null;
  }
}

interface Usuario {
  id: number;
  nome: string;
}

class RepositorioUsuarios extends RepositorioDados<Usuario> {
  private usuarios: Usuario[] = [];
  
  async buscarPorId(id: number): Promise<Usuario | null> {
    return this.usuarios.find(u => u.id === id) || null;
  }
  
  async buscarTodos(): Promise<Usuario[]> {
    return [...this.usuarios];
  }
  
  async salvar(usuario: Usuario): Promise<void> {
    this.usuarios.push(usuario);
  }
  
  async deletar(id: number): Promise<boolean> {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index > -1) {
      this.usuarios.splice(index, 1);
      return true;
    }
    return false;
  }
}
```

**Fundamento teórico:** Abstract methods definem **contract** completo - parâmetros, tipos, e retorno. Implementações devem respeitar exatamente essa assinatura.

### Protected Abstract Members

```typescript
abstract class ComponenteUI {
  // Protected abstract - acessível apenas em subclasses
  protected abstract renderizar(): HTMLElement;
  protected abstract configurarEventos(): void;
  
  // Public concrete - usa abstract methods internamente
  public montar(container: HTMLElement): void {
    const elemento = this.renderizar();
    this.configurarEventos();
    container.appendChild(elemento);
  }
}

class Botao extends ComponenteUI {
  constructor(private texto: string) {
    super();
  }
  
  protected renderizar(): HTMLElement {
    const button = document.createElement("button");
    button.textContent = this.texto;
    return button;
  }
  
  protected configurarEventos(): void {
    // Configurar click listeners, etc.
    console.log("Eventos configurados");
  }
}

const botao = new Botao("Clique aqui");
// botao.renderizar(); // ❌ Erro: protected, não acessível externamente
botao.montar(document.body); // ✅ Public method que usa protected methods
```

**Conceito crucial:** Abstract methods podem ser `protected`, forçando implementação em subclasses mas ocultando detalhes de implementação externamente.

### Abstract Properties

TypeScript permite abstract properties (getters/setters):

```typescript
abstract class Entidade {
  // Abstract property
  abstract get id(): number;
  abstract set id(valor: number);
  
  abstract get nome(): string;
  
  // Concrete method usando abstract property
  validar(): boolean {
    return this.id > 0 && this.nome.length > 0;
  }
}

class Usuario extends Entidade {
  private _id: number = 0;
  private _nome: string = "";
  
  get id(): number {
    return this._id;
  }
  
  set id(valor: number) {
    if (valor <= 0) throw new Error("ID inválido");
    this._id = valor;
  }
  
  get nome(): string {
    return this._nome;
  }
  
  set nome(valor: string) {
    this._nome = valor;
  }
}
```

**Análise profunda:** Abstract properties definem que subclasses devem ter certos getters/setters, sem especificar implementação.

### Constructor em Abstract Class

Abstract classes podem ter constructors:

```typescript
abstract class Pessoa {
  constructor(
    protected nome: string,
    protected idade: number
  ) {
    console.log(`Pessoa criada: ${nome}`);
  }
  
  abstract descreverOcupacao(): string;
  
  apresentar(): void {
    console.log(`${this.nome}, ${this.idade} anos`);
    console.log(this.descreverOcupacao());
  }
}

class Estudante extends Pessoa {
  constructor(
    nome: string,
    idade: number,
    private curso: string
  ) {
    super(nome, idade); // Chama constructor da abstract class
  }
  
  descreverOcupacao(): string {
    return `Estudante de ${this.curso}`;
  }
}

const estudante = new Estudante("Ana", 20, "Engenharia");
estudante.apresentar();
// Pessoa criada: Ana
// Ana, 20 anos
// Estudante de Engenharia
```

**Fundamento conceitual:** Abstract class constructor é chamado via `super()` em subclasses. Útil para inicializar estado compartilhado.

### Hierarquia de Abstract Classes

Abstract classes podem estender outras abstract classes:

```typescript
abstract class Forma {
  abstract calcularArea(): number;
  
  descrever(): void {
    console.log(`Área: ${this.calcularArea()}`);
  }
}

abstract class Poligono extends Forma {
  constructor(protected lados: number) {
    super();
  }
  
  abstract calcularPerimetro(): number;
  
  obterLados(): number {
    return this.lados;
  }
}

class Quadrado extends Poligono {
  constructor(private lado: number) {
    super(4); // 4 lados
  }
  
  calcularArea(): number {
    return this.lado ** 2;
  }
  
  calcularPerimetro(): number {
    return 4 * this.lado;
  }
}

const quadrado = new Quadrado(5);
quadrado.descrever(); // Área: 25
console.log(quadrado.calcularPerimetro()); // 20
```

**Análise teórica:** Hierarquias de abstract classes permitem especialização progressiva. `Quadrado` deve implementar abstract methods de **toda** a cadeia de herança.

### Abstract Class com Static Members

```typescript
abstract class Database {
  // Static factory method
  static conectar(tipo: string): Database {
    if (tipo === "mysql") {
      return new MySQL();
    } else if (tipo === "postgres") {
      return new PostgreSQL();
    }
    throw new Error("Tipo desconhecido");
  }
  
  // Abstract instance methods
  abstract executarQuery(sql: string): Promise<any>;
  abstract fecharConexao(): void;
  
  // Concrete instance method
  async testarConexao(): Promise<boolean> {
    try {
      await this.executarQuery("SELECT 1");
      return true;
    } catch {
      return false;
    }
  }
}

class MySQL extends Database {
  executarQuery(sql: string): Promise<any> {
    console.log(`MySQL: ${sql}`);
    return Promise.resolve([]);
  }
  
  fecharConexao(): void {
    console.log("MySQL: conexão fechada");
  }
}

class PostgreSQL extends Database {
  executarQuery(sql: string): Promise<any> {
    console.log(`PostgreSQL: ${sql}`);
    return Promise.resolve([]);
  }
  
  fecharConexao(): void {
    console.log("PostgreSQL: conexão fechada");
  }
}

// Factory pattern com abstract class
const db = Database.conectar("mysql");
await db.testarConexao();
```

**Conceito avançado:** Abstract classes podem ter static methods (como factories) que retornam subclasses concretas.

### Implementing Interfaces em Abstract Classes

```typescript
interface Serializavel {
  serializar(): string;
  deserializar(dados: string): void;
}

abstract class Modelo implements Serializavel {
  abstract obterDados(): Record<string, any>;
  
  // Implementa interface
  serializar(): string {
    return JSON.stringify(this.obterDados());
  }
  
  deserializar(dados: string): void {
    const obj = JSON.parse(dados);
    this.definirDados(obj);
  }
  
  protected abstract definirDados(obj: Record<string, any>): void;
}

class Produto extends Modelo {
  constructor(
    public nome: string = "",
    public preco: number = 0
  ) {
    super();
  }
  
  obterDados(): Record<string, any> {
    return { nome: this.nome, preco: this.preco };
  }
  
  protected definirDados(obj: Record<string, any>): void {
    this.nome = obj.nome;
    this.preco = obj.preco;
  }
}

const produto = new Produto("Laptop", 3000);
const json = produto.serializar(); // {"nome":"Laptop","preco":3000}

const novo = new Produto();
novo.deserializar(json);
console.log(novo.nome); // "Laptop"
```

**Análise profunda:** Abstract classes podem implementar interfaces, fornecendo implementação parcial ou completa de métodos da interface.

## 🎯 Aplicabilidade e Contextos

### Quando Usar Abstract Classes

**1. Template Method Pattern**
```typescript
abstract class Workflow {
  executar(): void {
    this.iniciar();
    this.processar();
    this.finalizar();
  }
  
  protected abstract processar(): void;
  protected iniciar(): void { /* setup */ }
  protected finalizar(): void { /* cleanup */ }
}
```

**Raciocínio:** Quando há algoritmo geral com passos customizáveis.

**2. Shared Implementation**
```typescript
abstract class BaseRepository {
  // Código compartilhado
  protected log(msg: string): void {
    console.log(`[${this.constructor.name}] ${msg}`);
  }
  
  abstract salvar(data: any): void;
}
```

**Raciocínio:** Quando múltiplas classes compartilham código comum.

**3. Preventing Instantiation**
```typescript
abstract class Util {
  abstract metodo(): void;
}
// Impossível instanciar - força subclassing
```

**Raciocínio:** Quando classe não faz sentido ser instanciada diretamente.

### Quando NÃO Usar

**Preferir Interfaces quando:**
- Não há implementação compartilhada
- Múltipla herança é necessária (TypeScript permite implementar múltiplas interfaces)
- Apenas contrato é necessário, sem comportamento

## ⚠️ Limitações e Considerações Teóricas

### Single Inheritance

TypeScript suporta apenas herança simples. Classe pode estender apenas uma abstract class:

```typescript
abstract class A {}
abstract class B {}

// class C extends A, B {} // ❌ Erro
class C extends A {} // ✅ Apenas uma
```

**Solução:** Usar interfaces para múltiplos contratos.

### Runtime vs Compile-time

Abstract é conceito de **compile-time**. Em runtime, abstract classes são classes normais JavaScript:

```typescript
abstract class A {}
class B extends A {}

const b = new B();
console.log(b instanceof A); // true - A existe em runtime
```

### Performance

Pequeno overhead de herança (chain de prototypes), mas negligível na prática.

## 🔗 Interconexões Conceituais

**Relação com Interfaces:** Abstract classes podem implementar interfaces e fornecer implementação parcial.

**Relação com Inheritance:** Abstract classes são base de hierarquias de herança.

**Relação com Polymorphism:** Permitem polimorfismo via tipos abstratos.

**Relação com Design Patterns:** Base para Template Method, Factory, Strategy patterns.

## 🚀 Evolução e Próximos Conceitos

Dominar abstract classes prepara para:
- **Interfaces Avançadas:** Diferença sutil entre abstract classes e interfaces
- **Design Patterns:** Template Method, Factory, Strategy
- **Generics Avançados:** Abstract classes genéricas complexas
- **Composition over Inheritance:** Quando preferir composição a herança
