# Static Properties e Methods

## 🎯 Introdução e Definição

### Definição Conceitual

**Static properties** e **static methods** são members de uma classe que pertencem à **própria classe**, não às **instâncias** da classe. Enquanto properties e methods normais (instance members) são acessados através de objetos individuais (`obj.method()`), static members são acessados diretamente através da classe (`Classe.method()`).

Conceitualmente, static members implementam **shared state** e **utility functionality**: dados ou comportamentos que não dependem de estado específico de uma instância, mas sim do conceito da classe como um todo. São análogos a **funções globais** ou **constantes globais**, mas namespaced dentro da classe.

### Contexto Histórico e Motivação

A evolução de static members na programação:

**Simula 67 (1967):** Introduziu conceito de "class variables" compartilhadas entre todas as instâncias.

**C++ (1985):** Estabeleceu keyword `static` para members que pertencem à classe, não ao objeto.

**Java (1995):** Popularizou static members como forma de organizar utility methods (`Math.max()`, `Arrays.sort()`) e constantes (`Integer.MAX_VALUE`).

**C# (2000):** Adicionou **static classes** (classes que só podem ter static members), formalizando padrão de utility classes.

**JavaScript ES6 (2015):** Introduziu keyword `static` em classes, permitindo definir methods de classe.

**TypeScript:** Estendeu suporte a static members adicionando **type checking** para static properties e methods, verificando acesso correto e tipos.

A motivação era **organização e namespace**: agrupar funcionalidades relacionadas sob uma classe sem necessidade de instanciar objetos, evitando poluição de namespace global.

### Problema Fundamental que Resolve

Static members resolvem problemas críticos de organização e design:

**1. Utility Functions:** Agrupar funções relacionadas sem criar instâncias (`Math.sqrt()`, `JSON.parse()`).

**2. Factory Methods:** Criar instâncias de formas alternativas ao constructor (`Date.now()`, `Array.from()`).

**3. Singleton Pattern:** Compartilhar única instância via static property.

**4. Shared State:** Dados compartilhados entre todas as instâncias (contadores, configurações).

**5. Constants:** Valores constantes associados à classe (`Number.MAX_VALUE`).

**6. Namespace:** Evitar variáveis globais, organizando código sob classes.

### Importância no Ecossistema

Static members são fundamentais porque:

- **Standard Library:** APIs nativas JavaScript/TypeScript (Math, JSON, Object, Array) são baseadas em static methods
- **Factory Pattern:** Criar instâncias de formas expressivas (`User.fromEmail()`, `User.fromId()`)
- **Configuration:** Armazenar configurações compartilhadas
- **Utility Classes:** Organizar helper functions (formatters, validators)
- **Design Patterns:** Base para Singleton, Factory, Builder patterns

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Acesso via Classe:** Static members são acessados via `ClassName.member`, não `instance.member`
2. **Compartilhamento:** Único valor compartilhado, não um por instância
3. **Sem this:** Static methods não têm acesso a `this` referindo-se a instância (apenas à classe)
4. **Namespace:** Agrupam funcionalidades relacionadas

### Pilares Fundamentais

- **Keyword static:** Declara member como pertencente à classe
- **Acesso Direto:** `ClassName.staticMember`
- **Shared State:** Mesmo valor para todos os consumidores
- **Type Safety:** TypeScript verifica tipos de static members

### Visão Geral das Nuances

- **this em Static Context:** Refere-se à classe, não a instância
- **Inheritance:** Static members são herdados
- **Private Static:** Podem ser privados, acessíveis apenas dentro da classe
- **Static Blocks (ES2022):** Blocos de inicialização para static members

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Quando TypeScript compila static members:

**1. Parsing:** Identifica keyword `static` em declarações de class members.

**2. Type Checking:** Verifica que static members são acessados via classe, não via instância. Valida tipos.

**3. Scope Analysis:** Static members têm acesso apenas a outros static members diretamente (`this.otherStatic` refere-se à classe).

**4. Code Generation:** 
   - Em ES6+, usa syntax nativa de `static`
   - Em ES5, anexa properties/methods ao constructor function (que é um objeto)

**5. Runtime:** JavaScript armazena static members no constructor function object, não no prototype.

### Princípios e Conceitos Subjacentes

#### Static vs Instance Members

**Instance Members:** Cada objeto tem sua própria cópia (ou compartilha via prototype, mas acessa via instância).

**Static Members:** Existe uma única cópia na classe. Todas as referências apontam para o mesmo valor.

```typescript
class Contador {
  // Instance member - cada objeto tem seu próprio
  instanciaCount: number = 0;
  
  // Static member - compartilhado
  static totalInstancias: number = 0;
  
  constructor() {
    this.instanciaCount++;
    Contador.totalInstancias++; // Acessa via classe
  }
}

const c1 = new Contador();
const c2 = new Contador();

console.log(c1.instanciaCount); // 1
console.log(c2.instanciaCount); // 1
console.log(Contador.totalInstancias); // 2 - compartilhado!
```

**Fundamento conceitual:** Instance members são **per-object state**. Static members são **per-class state**.

#### Namespace e Organização

Static members oferecem **namespace** para agrupar funcionalidades:

```typescript
class Matematica {
  static PI = 3.14159;
  
  static quadrado(n: number): number {
    return n * n;
  }
  
  static cubo(n: number): number {
    return n * n * n;
  }
  
  static potencia(base: number, expoente: number): number {
    return Math.pow(base, expoente);
  }
}

// Uso organizado
console.log(Matematica.PI); // 3.14159
console.log(Matematica.quadrado(5)); // 25
console.log(Matematica.cubo(3)); // 27
```

**Conceito fundamental:** Classe age como **namespace**, agrupando constantes e funções relacionadas sem necessidade de instanciar.

#### Factory Pattern

Static methods são ideais para **factory methods** - formas alternativas de criar instâncias:

```typescript
class Usuario {
  constructor(
    public nome: string,
    public email: string,
    public id: number
  ) {}
  
  // Factory methods estáticos
  static fromEmail(email: string): Usuario {
    // Buscar dados do banco, etc.
    return new Usuario("Unknown", email, Math.random());
  }
  
  static fromId(id: number): Usuario {
    // Buscar do banco...
    return new Usuario("User", `user${id}@example.com`, id);
  }
  
  static criar(nome: string, email: string): Usuario {
    // Validar, gerar ID, etc.
    const id = Math.floor(Math.random() * 10000);
    return new Usuario(nome, email, id);
  }
}

// Uso expressivo
const u1 = Usuario.fromEmail("ana@example.com");
const u2 = Usuario.fromId(123);
const u3 = Usuario.criar("João", "joao@example.com");
```

**Análise profunda:** Factory methods tornam criação de objetos mais expressiva e permitem lógica complexa antes de construir.

### Modelo Mental para Compreensão

Pense em static members como **ferramentas penduradas na parede** de uma oficina:

- **Classe:** A oficina
- **Static Members:** Ferramentas na parede (martelo, chave de fenda) - **compartilhadas** por todos
- **Instâncias:** Mecânicos individuais trabalhando
- **Instance Members:** Ferramentas pessoais de cada mecânico

Todos os mecânicos usam as mesmas ferramentas da parede (static), mas cada um tem suas próprias ferramentas pessoais (instance).

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica de Static Properties

```typescript
class Configuracao {
  // Static property
  static versao: string = "1.0.0";
  static ambiente: string = "desenvolvimento";
  static maxConexoes: number = 100;
}

// Acesso via classe
console.log(Configuracao.versao); // "1.0.0"
console.log(Configuracao.ambiente); // "desenvolvimento"

// Modificação
Configuracao.ambiente = "produção";
console.log(Configuracao.ambiente); // "produção"

// ❌ Não via instância
const config = new Configuracao();
// config.versao; // undefined - não existe em instâncias
```

**Análise conceitual:** `static` keyword declara property que pertence à classe. Acessado via `ClassName.property`.

### Sintaxe Básica de Static Methods

```typescript
class Utilidades {
  // Static method
  static capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
  
  static reverter(texto: string): string {
    return texto.split("").reverse().join("");
  }
  
  static truncar(texto: string, tamanho: number): string {
    return texto.length > tamanho 
      ? texto.slice(0, tamanho) + "..." 
      : texto;
  }
}

// Uso direto
console.log(Utilidades.capitalizar("hello")); // "Hello"
console.log(Utilidades.reverter("abc")); // "cba"
console.log(Utilidades.truncar("Texto longo", 5)); // "Texto..."
```

**Fundamento teórico:** Static methods são funções anexadas à classe, não ao prototype. Chamados sem criar instância.

### Static Properties como Contadores

```typescript
class Usuario {
  static totalUsuarios: number = 0;
  static usuarios: Usuario[] = [];
  
  constructor(public nome: string) {
    Usuario.totalUsuarios++;
    Usuario.usuarios.push(this);
  }
  
  static obterTotal(): number {
    return Usuario.totalUsuarios;
  }
  
  static listarTodos(): Usuario[] {
    return Usuario.usuarios;
  }
}

const u1 = new Usuario("Ana");
const u2 = new Usuario("João");
const u3 = new Usuario("Maria");

console.log(Usuario.obterTotal()); // 3
console.log(Usuario.listarTodos()); // [Usuario, Usuario, Usuario]
```

**Conceito crucial:** Static properties mantêm estado compartilhado. Útil para tracking, registros, configurações globais.

### Factory Methods Complexos

```typescript
class Produto {
  constructor(
    public nome: string,
    public preco: number,
    public categoria: string
  ) {}
  
  // Factory: criar de objeto
  static fromObject(obj: any): Produto {
    return new Produto(obj.nome, obj.preco, obj.categoria);
  }
  
  // Factory: criar de JSON
  static fromJSON(json: string): Produto {
    const obj = JSON.parse(json);
    return Produto.fromObject(obj);
  }
  
  // Factory: criar de array
  static fromArray(arr: [string, number, string]): Produto {
    return new Produto(arr[0], arr[1], arr[2]);
  }
  
  // Factory: criar com defaults
  static criarDefault(): Produto {
    return new Produto("Produto Padrão", 0, "Geral");
  }
}

// Uso variado
const p1 = Produto.fromJSON('{"nome":"Laptop","preco":3000,"categoria":"Eletrônicos"}');
const p2 = Produto.fromArray(["Mouse", 50, "Periféricos"]);
const p3 = Produto.criarDefault();
```

**Análise profunda:** Factory methods oferecem múltiplas formas de criar objetos, cada uma com semântica clara e validação específica.

### this em Static Context

```typescript
class Exemplo {
  static propriedadeEstatica = "valor estático";
  
  static metodoEstatico(): void {
    // 'this' refere-se à classe, não a instância
    console.log(this.propriedadeEstatica); // "valor estático"
    console.log(this.outroMetodoEstatico()); // Chama outro static method
  }
  
  static outroMetodoEstatico(): string {
    return "outro método";
  }
  
  // Método de instância
  metodoInstancia(): void {
    // Não pode acessar static members via 'this'
    // this.propriedadeEstatica; // ❌ undefined
    
    // Deve usar nome da classe
    console.log(Exemplo.propriedadeEstatica); // ✅ "valor estático"
  }
}

Exemplo.metodoEstatico();
```

**Fundamento conceitual:** Em static methods, `this` refere-se à **constructor function** (a classe), não a uma instância. Instance methods devem acessar static members via nome da classe.

### Private Static Members

```typescript
class Banco {
  // Private static - acessível apenas dentro da classe
  private static conexao: any = null;
  private static configuracao = {
    host: "localhost",
    porta: 5432
  };
  
  static conectar(): void {
    if (!Banco.conexao) {
      console.log("Conectando ao banco...");
      Banco.conexao = { /* objeto de conexão */ };
    }
  }
  
  static desconectar(): void {
    if (Banco.conexao) {
      console.log("Desconectando...");
      Banco.conexao = null;
    }
  }
  
  static obterStatus(): string {
    return Banco.conexao ? "Conectado" : "Desconectado";
  }
}

Banco.conectar();
console.log(Banco.obterStatus()); // "Conectado"
// Banco.conexao; // ❌ Erro: propriedade privada
```

**Conceito avançado:** Static members podem ser privados, encapsulando implementação interna compartilhada.

### Singleton Pattern

```typescript
class Configuracao {
  private static instancia: Configuracao;
  
  // Constructor privado - impede 'new Configuracao()'
  private constructor(
    public ambiente: string,
    public debug: boolean
  ) {}
  
  // Factory method para obter única instância
  static obterInstancia(): Configuracao {
    if (!Configuracao.instancia) {
      Configuracao.instancia = new Configuracao("desenvolvimento", true);
    }
    return Configuracao.instancia;
  }
  
  // Static method para configurar
  static configurar(ambiente: string, debug: boolean): void {
    const config = Configuracao.obterInstancia();
    config.ambiente = ambiente;
    config.debug = debug;
  }
}

// Sempre retorna mesma instância
const config1 = Configuracao.obterInstancia();
const config2 = Configuracao.obterInstancia();
console.log(config1 === config2); // true - mesma instância!

// const config3 = new Configuracao("prod", false); // ❌ Erro: constructor privado
```

**Análise teórica:** Singleton garante que classe tem exatamente uma instância, usando private constructor + static factory method.

### Static Constants

```typescript
class HttpStatus {
  // Constantes estáticas
  static readonly OK = 200;
  static readonly CREATED = 201;
  static readonly BAD_REQUEST = 400;
  static readonly UNAUTHORIZED = 401;
  static readonly NOT_FOUND = 404;
  static readonly SERVER_ERROR = 500;
  
  // Helpers estáticos
  static ehSucesso(status: number): boolean {
    return status >= 200 && status < 300;
  }
  
  static ehErroCliente(status: number): boolean {
    return status >= 400 && status < 500;
  }
  
  static ehErroServidor(status: number): boolean {
    return status >= 500 && status < 600;
  }
}

// Uso expressivo
if (response.status === HttpStatus.OK) {
  console.log("Sucesso!");
}

if (HttpStatus.ehErroCliente(response.status)) {
  console.log("Erro do cliente");
}
```

**Fundamento conceitual:** Static readonly properties são perfeitas para constantes. Agrupam valores relacionados e helpers.

### Static com Generics

```typescript
class Repositorio<T> {
  // Static property compartilhado entre todas as especializações
  private static cache: Map<string, any> = new Map();
  
  // Static method genérico
  static criar<U>(tipo: string, dados: U): Repositorio<U> {
    return new Repositorio<U>(tipo, dados);
  }
  
  constructor(
    private tipo: string,
    private dados: T
  ) {}
  
  salvar(): void {
    Repositorio.cache.set(this.tipo, this.dados);
  }
  
  static obterTodos(): Map<string, any> {
    return new Map(Repositorio.cache);
  }
}

const repoUsuarios = Repositorio.criar<{ nome: string }>("usuarios", { nome: "Ana" });
const repoProdutos = Repositorio.criar<{ preco: number }>("produtos", { preco: 100 });

repoUsuarios.salvar();
repoProdutos.salvar();

console.log(Repositorio.obterTodos());
```

**Análise profunda:** Static members são compartilhados entre **todas** as especializações genéricas de uma classe.

### Inheritance de Static Members

```typescript
class Animal {
  static totalAnimais = 0;
  
  static contarAnimal(): void {
    Animal.totalAnimais++;
  }
  
  static obterTotal(): number {
    return Animal.totalAnimais;
  }
}

class Cachorro extends Animal {
  static totalCachorros = 0;
  
  static contarCachorro(): void {
    Cachorro.totalCachorros++;
    Animal.contarAnimal(); // Chama static method da superclass
  }
}

Cachorro.contarCachorro();
Cachorro.contarCachorro();

console.log(Animal.obterTotal()); // 2
console.log(Cachorro.totalCachorros); // 2
```

**Conceito crucial:** Static members são herdados. Subclasses têm acesso a static members da superclass.

## 🎯 Aplicabilidade e Contextos

### Quando Usar Static Properties

**1. Configurações Globais**
```typescript
class App {
  static config = {
    apiUrl: "https://api.example.com",
    timeout: 5000
  };
}
```

**2. Shared State**
```typescript
class Logger {
  static logs: string[] = [];
  static log(msg: string) {
    Logger.logs.push(msg);
  }
}
```

**3. Constantes**
```typescript
class Cores {
  static readonly VERMELHO = "#FF0000";
  static readonly VERDE = "#00FF00";
}
```

### Quando Usar Static Methods

**1. Utility Functions**
```typescript
class StringUtils {
  static capitalizar(s: string): string {
    return s[0].toUpperCase() + s.slice(1);
  }
}
```

**2. Factory Methods**
```typescript
class User {
  static fromEmail(email: string): User {
    return new User(email);
  }
}
```

**3. Validators**
```typescript
class Validador {
  static ehEmail(s: string): boolean {
    return s.includes("@");
  }
}
```

## ⚠️ Limitações e Considerações Teóricas

### Testabilidade

Static members são globais, dificultando testes isolados:

```typescript
// ❌ Difícil de testar
class Database {
  static conexao: any;
}

// ✅ Melhor - dependency injection
class Database {
  constructor(private conexao: any) {}
}
```

### Shared Mutable State

Static mutable state pode causar bugs:

```typescript
class Config {
  static valor = 10; // Mutável
}

Config.valor = 20; // Muda globalmente!
```

**Preferir:** Static readonly ou getters.

### Herança Complexa

Static members compartilham estado entre subclasses, podendo causar confusão.

## 🔗 Interconexões Conceituais

**Relação com Singleton:** Static members implementam Singleton pattern.

**Relação com Factory:** Static methods são factories naturais.

**Relação com Namespace:** Organizam código sem poluir global scope.

**Relação com Utility Classes:** Base para utility/helper classes.

## 🚀 Evolução e Próximos Conceitos

Dominar static members prepara para:
- **Abstract Classes:** Classes que combinam static factories com methods abstratos
- **Design Patterns:** Singleton, Factory, Builder usam heavily static members
- **Decorators:** Modificar static members via decorators
- **Modules:** Organizar static utilities em módulos ES6
