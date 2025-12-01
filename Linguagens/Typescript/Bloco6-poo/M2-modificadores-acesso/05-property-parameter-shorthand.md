# Property Parameter Shorthand: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Property parameter shorthand** (atalho de parâmetros de propriedade) é uma sintaxe concisa do TypeScript que permite **declarar e inicializar propriedades de classe diretamente nos parâmetros do constructor** usando modificadores de acesso. Conceitualmente, representa **economia sintática com semântica preservada**, onde declaração, tipagem e atribuição são unificadas em uma única linha.

Na essência, property parameter shorthand materializa o princípio de **DRY (Don't Repeat Yourself)** aplicado à inicialização de classes, eliminando boilerplate repetitivo de declaração e atribuição de propriedades.

## 📋 Fundamentos

### Sintaxe Tradicional vs. Shorthand

```typescript
// ❌ Sintaxe tradicional - verbosa
class UsuarioVerboso {
  public nome: string;
  private idade: number;
  readonly id: number;

  constructor(nome: string, idade: number, id: number) {
    this.nome = nome;
    this.idade = idade;
    this.id = id;
  }
}

// ✅ Property parameter shorthand - concisa
class Usuario {
  constructor(
    public nome: string,
    private idade: number,
    readonly id: number
  ) {
    // Propriedades já declaradas e inicializadas automaticamente!
  }
}

const usuario = new Usuario("Ana", 25, 1);
console.log(usuario.nome); // "Ana"
console.log(usuario.id);   // 1
// console.log(usuario.idade); // Erro - private
```

**Conceito-chave:** Adicionar modificador (`public`, `private`, `protected`, `readonly`) ao parâmetro do constructor **automaticamente cria a propriedade e a inicializa**.

### Código Gerado Equivalente

```typescript
// Código TypeScript com shorthand
class Produto {
  constructor(
    public nome: string,
    private preco: number
  ) {}
}

// É equivalente a:
class ProdutoExpandido {
  public nome: string;
  private preco: number;

  constructor(nome: string, preco: number) {
    this.nome = nome;
    this.preco = preco;
  }
}
```

## 🔍 Análise Conceitual

### 1. Todos os Modificadores Funcionam

```typescript
class Exemplo {
  constructor(
    public publico: string,           // Public property
    private privado: number,          // Private property
    protected protegido: boolean,     // Protected property
    readonly somenteLeitu: Date       // Readonly property
  ) {}
}

const obj = new Exemplo("A", 42, true, new Date());
console.log(obj.publico);      // ✅ "A"
console.log(obj.somenteLeitu); // ✅ Date
// obj.somenteLeitu = new Date(); // ❌ Erro - readonly
// obj.privado;                   // ❌ Erro - private
```

### 2. Combinando com Inicialização Adicional

```typescript
class Conta {
  private transacoes: string[] = []; // Declarado normalmente

  constructor(
    public titular: string,      // Via shorthand
    private saldo: number,       // Via shorthand
    readonly id: string          // Via shorthand
  ) {
    // Lógica adicional no constructor
    this.transacoes.push(`Conta criada com saldo ${saldo}`);
    this.validarSaldo();
  }

  private validarSaldo(): void {
    if (this.saldo < 0) {
      throw new Error("Saldo inicial não pode ser negativo");
    }
  }

  public getSaldo(): number {
    return this.saldo;
  }
}

const conta = new Conta("João", 1000, "12345");
```

**Conceito:** Shorthand não impede declaração tradicional de outras propriedades nem lógica no constructor.

### 3. Parâmetros Opcionais e Padrão

```typescript
class Configuracao {
  constructor(
    public ambiente: string,
    public debug: boolean = false,     // Valor padrão
    public timeout?: number            // Opcional
  ) {}
}

const config1 = new Configuracao("prod");
// config1 = { ambiente: "prod", debug: false, timeout: undefined }

const config2 = new Configuracao("dev", true, 5000);
// config2 = { ambiente: "dev", debug: true, timeout: 5000 }
```

### 4. Readonly Combinado

```typescript
class Livro {
  constructor(
    public readonly isbn: string,      // Public E readonly
    private readonly codigo: number    // Private E readonly
  ) {}

  public getInfo(): string {
    return `ISBN: ${this.isbn}, Código: ${this.codigo}`;
  }
}

const livro = new Livro("978-3-16-148410-0", 12345);
console.log(livro.isbn);  // ✅ Acessível (public)
// livro.isbn = "novo";   // ❌ Erro (readonly)
// livro.codigo;          // ❌ Erro (private)
```

### 5. Sem Modificador = Não Cria Propriedade

```typescript
class Exemplo {
  constructor(
    public propriedade: string,  // ✅ Cria propriedade
    parametro: number            // ❌ NÃO cria propriedade - apenas parâmetro local
  ) {
    console.log(parametro); // ✅ Acessível dentro do constructor
  }
}

const obj = new Exemplo("valor", 42);
console.log(obj.propriedade); // ✅ "valor"
// console.log(obj.parametro);  // ❌ Erro - não existe
```

**Importante:** Apenas parâmetros **com modificadores** (`public`, `private`, `protected`, `readonly`) criam propriedades.

### 6. Herança com Shorthand

```typescript
class Animal {
  constructor(
    protected nome: string,
    protected idade: number
  ) {}
}

class Cachorro extends Animal {
  constructor(
    nome: string,
    idade: number,
    public raca: string  // Shorthand na subclasse
  ) {
    super(nome, idade); // Passa para classe pai
  }

  public info(): string {
    return `${this.nome} (${this.idade} anos) - ${this.raca}`;
  }
}

const dog = new Cachorro("Rex", 3, "Labrador");
console.log(dog.info()); // "Rex (3 anos) - Labrador"
console.log(dog.raca);   // "Labrador"
// dog.nome;             // Erro - protected
```

## 🎯 Aplicabilidade

### Value Objects (DDD)

```typescript
class Email {
  constructor(
    private readonly valor: string
  ) {
    this.validar();
  }

  private validar(): void {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.valor)) {
      throw new Error("Email inválido");
    }
  }

  public toString(): string {
    return this.valor;
  }

  public equals(outro: Email): boolean {
    return this.valor === outro.valor;
  }
}

const email = new Email("ana@example.com");
```

### Data Transfer Objects (DTOs)

```typescript
class UsuarioDTO {
  constructor(
    public readonly id: number,
    public readonly nome: string,
    public readonly email: string,
    public readonly criadoEm: Date
  ) {}

  // DTO compacto e imutável
}

const dto = new UsuarioDTO(1, "Ana", "ana@example.com", new Date());
```

### Services com Dependências

```typescript
class UsuarioService {
  constructor(
    private readonly repository: UsuarioRepository,
    private readonly logger: Logger,
    private readonly validator: Validator
  ) {}

  public async criar(dados: any): Promise<Usuario> {
    this.logger.info("Criando usuário");
    this.validator.validar(dados);
    return this.repository.salvar(dados);
  }
}

// Dependency Injection concisa
const service = new UsuarioService(
  new UsuarioRepository(),
  new Logger(),
  new Validator()
);
```

### Configuração de Componentes

```typescript
class HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly timeout: number = 5000,
    private readonly headers: Record<string, string> = {}
  ) {}

  public async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout)
    });
    return response.json();
  }
}

const client = new HttpClient("https://api.example.com");
```

## ⚠️ Considerações

### 1. Legibilidade vs. Concisão

```typescript
// ✅ Conciso mas pode ser menos legível com muitos parâmetros
class Pedido {
  constructor(
    public readonly id: string,
    public readonly cliente: string,
    public readonly total: number,
    public readonly data: Date,
    private readonly items: Item[],
    private status: string = "pendente",
    protected desconto?: number
  ) {}
}

// ⚠️ Considere separar se constructor ficar muito longo
```

### 2. Validação e Lógica

```typescript
class Produto {
  constructor(
    public nome: string,
    private preco: number
  ) {
    // Validação após inicialização automática
    if (preco < 0) {
      throw new Error("Preço não pode ser negativo");
    }
  }

  public getPreco(): number {
    return this.preco;
  }
}
```

**Ordem:** Propriedades são inicializadas **antes** do corpo do constructor executar.

### 3. Quando Evitar

```typescript
// ❌ Evitar se propriedade precisa transformação
class Usuario {
  public email: string;

  constructor(email: string) {
    // Precisa transformar antes de armazenar
    this.email = email.toLowerCase().trim();
  }
}

// Para casos assim, não use shorthand
```

### 4. Intellisense e Documentação

```typescript
class Config {
  /**
   * URL base da API
   */
  public baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
}

// Com shorthand, documentação fica no parâmetro:
class ConfigShorthand {
  constructor(
    /**
     * URL base da API
     */
    public baseUrl: string
  ) {}
}
```

## 📚 Conclusão

Property parameter shorthand unifica declaração, tipagem e inicialização de propriedades em parâmetros do constructor, reduzindo boilerplate significativamente. É ideal para DTOs, value objects, dependency injection e classes com muitas propriedades simples. Combina todos os modificadores (`public`, `private`, `protected`, `readonly`) e funciona com valores padrão e parâmetros opcionais.
