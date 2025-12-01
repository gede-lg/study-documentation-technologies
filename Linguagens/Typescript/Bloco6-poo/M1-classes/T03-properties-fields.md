# Properties (Fields)

## 🎯 Introdução e Definição

### Definição Conceitual

**Properties** (também chamadas de **fields** ou atributos) são variáveis declaradas dentro de uma classe que armazenam o **estado** de cada instância. Representam as características, dados ou informações que um objeto mantém durante sua existência. Conceitualmente, properties são os "substantivos" ou "adjetivos" do objeto - descrevem "o que" ele é e "quais características" possui.

Uma property é uma unidade de dados associada a cada instância da classe, criando um espaço de armazenamento isolado e específico para aquele objeto. Quando você cria múltiplas instâncias de uma classe, cada uma possui seu próprio conjunto de values para as properties, permitindo que objetos do mesmo tipo tenham estados diferentes simultaneamente.

### Contexto Histórico e Motivação

O conceito de properties em orientação a objetos evoluiu ao longo das décadas:

**Simula (1967):** Introduziu "atributos" de objetos que representavam estado interno.

**Smalltalk (1970s):** Popularizou "instance variables" - variáveis pertencentes a cada instância.

**C++ (1980s):** Formalizou "member variables" ou "data members" como parte da estrutura de classes.

**Java (1995):** Estabeleceu convenção de properties privadas com getters/setters públicos (encapsulamento).

**JavaScript:** Originalmente, properties eram dinâmicas - podiam ser adicionadas a qualquer objeto a qualquer momento. **ES6 (2015)** introduziu declaração formal de fields em classes.

**TypeScript:** Adicionou **type annotations** para properties, **modificadores de acesso** (public/private/protected), **readonly**, e **definite assignment checking** para garantir inicialização.

A motivação central era **encapsulamento de estado**: agrupar dados relacionados com o comportamento que os manipula, criando unidades coesas e facilitando manutenção.

### Problema Fundamental que Resolve

Properties resolvem desafios fundamentais de gerenciamento de estado:

**1. Organização de Dados:** Agrupam dados relacionados em estrutura coesa ao invés de variáveis soltas.

**2. Encapsulamento:** Associam dados a objetos específicos, controlando acesso e visibilidade.

**3. Isolamento de Estado:** Cada instância possui seu próprio estado, evitando conflitos.

**4. Type Safety:** TypeScript garante que properties sempre contêm valores do tipo correto.

**5. Inicialização Verificada:** Compilador verifica que properties obrigatórias são inicializadas.

**6. Documentação Viva:** Declarações de properties documentam estrutura de dados do objeto.

### Importância no Ecossistema

Properties são fundamentais porque:

- **Modelagem de Domínio:** Representam atributos de entidades de negócio
- **State Management:** Armazenam estado de componentes em frameworks (Angular, React)
- **Persistência:** Mapeiam para colunas de banco de dados em ORMs
- **Serialização:** Estrutura para JSON.stringify/parse
- **Validação:** Base para validação de dados com decorators

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Estado de Instância:** Properties armazenam dados específicos de cada objeto
2. **Isolamento:** Cada instância tem seu próprio conjunto de valores
3. **Tipagem:** TypeScript garante type safety para cada property
4. **Inicialização:** Properties devem ser inicializadas antes de uso

### Pilares Fundamentais

- **Declaração:** Nome e tipo da property dentro da classe
- **Inicialização:** Atribuição de valor inicial (inline ou no constructor)
- **Acesso:** Via `this.propertyName` dentro da classe, `objeto.propertyName` externamente
- **Modificadores:** public/private/protected/readonly controlam acesso e mutabilidade
- **Valores Padrão:** Properties podem ter valores iniciais

### Visão Geral das Nuances

- **Opcional vs Obrigatória:** `?` marca properties opcionais
- **Readonly:** Previne reatribuição após inicialização
- **Definite Assignment:** `!` indica que será inicializada em runtime
- **Computed Properties:** Podem ter getters que calculam valores dinamicamente

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Quando TypeScript compila properties:

**1. Parsing:** Compilador identifica declarações de properties na classe.

**2. Type Checking:** Verifica tipos das properties, inicializações e acessos.

**3. Initialization Checking:** Garante que properties não-opcionais são inicializadas (no constructor ou inline).

**4. Access Checking:** Valida que acessos respeitam modificadores (private, protected, public).

**5. Code Generation:** Transpila para JavaScript. Properties tornam-se propriedades do objeto `this` ou prototype (se static).

**6. Runtime:** Em execução, properties são propriedades normais de objetos JavaScript. Type checking desaparece.

### Princípios e Conceitos Subjacentes

#### Encapsulamento de Estado

Properties implementam o princípio de **encapsulamento**: dados (estado) e comportamento (métodos) vivem juntos na classe. Isso reduz acoplamento e aumenta coesão.

**Coesão:** Properties relacionadas agrupadas na mesma classe.  
**Acoplamento:** Detalhes internos (private properties) ocultos de outras classes.

#### Invariantes de Classe

Properties devem manter **invariantes** - condições que são sempre verdadeiras:

```typescript
class Retangulo {
  largura: number;
  altura: number;
  
  constructor(largura: number, altura: number) {
    if (largura <= 0 || altura <= 0) {
      throw new Error("Dimensões devem ser positivas");
    }
    this.largura = largura;
    this.altura = altura;
    // Invariante: largura > 0 && altura > 0
  }
}
```

Após criação, todo `Retangulo` tem dimensões positivas.

#### Imutabilidade com Readonly

`readonly` cria properties imutáveis após inicialização:

```typescript
class Configuracao {
  readonly apiUrl: string = "https://api.example.com";
  readonly timeout: number;
  
  constructor(timeout: number) {
    this.timeout = timeout; // OK no constructor
  }
  
  mudar() {
    // this.timeout = 5000; // ❌ Erro: readonly
  }
}
```

Garante que certos valores não mudam acidentalmente.

### Modelo Mental para Compreensão

Pense em properties como **fichas de características** de um personagem de RPG:

- **Ficha (Classe):** Define quais características existem (nome, força, vida)
- **Valores (Instance Properties):** Cada jogador tem valores específicos diferentes
- **Modificadores (public/private):** Algumas características são visíveis a todos (public), outras apenas ao próprio jogador (private)
- **Constantes (readonly):** Algumas características não podem mudar (raça, classe inicial)

Cada personagem (instância) tem sua própria ficha com valores únicos.

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica de Declaração

```typescript
class Pessoa {
  // Property com tipo explícito
  nome: string;
  idade: number;
  
  // Property com valor inicial
  ativo: boolean = true;
  
  // Property opcional
  email?: string;
  
  // Property readonly
  readonly id: number = Math.random();
}

const pessoa = new Pessoa();
pessoa.nome = "Ana"; // OK
pessoa.idade = 30; // OK
console.log(pessoa.ativo); // true
console.log(pessoa.email); // undefined
// pessoa.id = 123; // ❌ Erro: readonly
```

**Análise conceitual:** Declaração dentro do corpo da classe, antes de métodos. Tipo após nome. Valor inicial opcional.

### Inicialização de Properties

```typescript
// 1. Inicialização inline
class Contador {
  valor: number = 0; // Valor padrão
}

// 2. Inicialização no constructor
class Usuario {
  nome: string;
  email: string;
  
  constructor(nome: string, email: string) {
    this.nome = nome;
    this.email = email;
  }
}

// 3. Parameter properties (atalho)
class Produto {
  constructor(
    public nome: string,
    public preco: number
  ) {
    // nome e preco são properties automaticamente
  }
}

// 4. Sem inicialização (requer !)
class Servico {
  nome!: string; // Definite assignment assertion
  
  inicializar(nome: string) {
    this.nome = nome;
  }
}
```

**Fundamento teórico:** TypeScript exige que properties sejam inicializadas (inline, constructor, ou com `!`). Garante que não sejam `undefined` acidentalmente.

### Properties com Tipos Complexos

```typescript
class Biblioteca {
  // Array de strings
  livros: string[] = [];
  
  // Objeto
  endereco: {
    rua: string;
    cidade: string;
  } = {
    rua: "",
    cidade: ""
  };
  
  // Tipo customizado
  tipo configuracao: {
    aberta: boolean;
    horario: string;
  };
  
  // Union type
  status: "aberta" | "fechada" | "manutencao" = "fechada";
  
  // Tuple
  coordenadas: [number, number] = [0, 0];
}
```

**Conceito crucial:** Properties podem ter qualquer tipo TypeScript - primitivos, arrays, objetos, unions, tuples, tipos customizados.

### Properties Opcionais

```typescript
class Contato {
  nome: string;
  telefone: string;
  
  // Email é opcional
  email?: string;
  
  // Site é opcional
  website?: string;
  
  constructor(nome: string, telefone: string) {
    this.nome = nome;
    this.telefone = telefone;
    // email e website podem ficar undefined
  }
}

const contato = new Contato("João", "123456");
console.log(contato.email); // undefined

// Ao usar, verificar se existe
if (contato.email) {
  console.log(contato.email.toLowerCase());
}

// Ou usar optional chaining
console.log(contato.email?.toLowerCase());
```

**Análise profunda:** `?` após nome indica property opcional. Tipo torna-se `T | undefined`. Útil para dados que podem ou não estar presentes.

### Readonly Properties

```typescript
class Documento {
  // Readonly com valor inicial
  readonly tipo: string = "PDF";
  
  // Readonly inicializado no constructor
  readonly id: string;
  readonly dataCriacao: Date;
  
  // Property mutável
  conteudo: string;
  
  constructor(id: string, conteudo: string) {
    this.id = id;
    this.dataCriacao = new Date(); // OK no constructor
    this.conteudo = conteudo;
  }
  
  atualizar(novoConteudo: string) {
    this.conteudo = novoConteudo; // OK - não é readonly
    // this.id = "novo"; // ❌ Erro: readonly
    // this.dataCriacao = new Date(); // ❌ Erro: readonly
  }
}

// Com parameter property
class DocumentoSimples {
  constructor(
    public readonly id: string,
    public conteudo: string
  ) {}
}
```

**Fundamento conceitual:** `readonly` previne reatribuição após inicialização. Garante imutabilidade de dados críticos (IDs, timestamps).

### Definite Assignment Assertion

```typescript
class Aplicacao {
  // Property será inicializada em setup(), não no constructor
  configuracao!: Config;
  
  constructor() {
    this.setup(); // Chama setup que inicializa configuracao
  }
  
  private setup() {
    this.configuracao = { porta: 3000, host: "localhost" };
  }
  
  executar() {
    console.log(this.configuracao.porta); // OK - sabemos que foi inicializada
  }
}

type Config = { porta: number; host: string };
```

**Conceito avançado:** `!` após nome ("definite assignment assertion") diz ao TypeScript "confie em mim, será inicializada". Use com cautela - você é responsável por garantir inicialização.

### Private Properties

```typescript
class ContaBancaria {
  // Property pública
  public numero: string;
  
  // Property privada (apenas dentro da classe)
  private saldo: number = 0;
  
  constructor(numero: string) {
    this.numero = numero;
  }
  
  depositar(valor: number) {
    this.saldo += valor; // OK - dentro da classe
  }
  
  obterSaldo(): number {
    return this.saldo; // OK - dentro da classe
  }
}

const conta = new ContaBancaria("12345");
conta.depositar(100);
console.log(conta.numero); // OK - pública
// console.log(conta.saldo); // ❌ Erro: private
console.log(conta.obterSaldo()); // OK - método público acessa private
```

**Análise teórica:** `private` oculta property de código externo. Encapsula detalhes de implementação. Modificadores são verificados em compile-time, não runtime.

### Protected Properties

```typescript
class Animal {
  // Protected: acessível em classe e subclasses
  protected energia: number = 100;
  
  dormir() {
    this.energia = 100; // OK - dentro da classe
  }
}

class Cachorro extends Animal {
  latir() {
    if (this.energia > 50) { // OK - subclasse acessa protected
      console.log("Au au!");
      this.energia -= 10;
    }
  }
}

const cachorro = new Cachorro();
cachorro.latir();
// console.log(cachorro.energia); // ❌ Erro: protected
```

**Fundamento conceitual:** `protected` permite que subclasses acessem property, mas não código externo. Útil em hierarquias de herança.

### Static Properties

```typescript
class Configuracao {
  // Property estática - compartilhada por todas as instâncias
  static versao: string = "1.0.0";
  static instancias: number = 0;
  
  // Property de instância
  id: number;
  
  constructor() {
    this.id = ++Configuracao.instancias;
  }
}

console.log(Configuracao.versao); // "1.0.0"
const c1 = new Configuracao();
const c2 = new Configuracao();
console.log(Configuracao.instancias); // 2
console.log(c1.id); // 1
console.log(c2.id); // 2
```

**Conceito crucial:** `static` properties pertencem à classe, não a instâncias. Acessadas via `NomeClasse.property`, não `this.property`. Útil para contadores, configurações globais, caches.

### Propriedades Computadas (Getters)

```typescript
class Retangulo {
  largura: number;
  altura: number;
  
  constructor(largura: number, altura: number) {
    this.largura = largura;
    this.altura = altura;
  }
  
  // Getter - parece property, mas é computada
  get area(): number {
    return this.largura * this.altura;
  }
  
  get perimetro(): number {
    return 2 * (this.largura + this.altura);
  }
}

const ret = new Retangulo(5, 10);
console.log(ret.area); // 50 (computada, não armazenada)
console.log(ret.perimetro); // 30
```

**Análise profunda:** Getters permitem "properties" calculadas dinamicamente. Sintaxe de acesso é igual a property normal, mas valor é computado a cada acesso.

## 🎯 Aplicabilidade e Contextos

### Quando Usar Public Properties

```typescript
class Ponto {
  constructor(
    public x: number,
    public y: number
  ) {}
}
```

**Raciocínio:** Para dados simples que não precisam validação/encapsulamento. DTOs, value objects.

### Quando Usar Private Properties

```typescript
class Senha {
  private hash: string;
  
  constructor(senha: string) {
    this.hash = this.hashear(senha);
  }
  
  private hashear(senha: string): string {
    return /* lógica de hash */;
  }
  
  verificar(senha: string): boolean {
    return this.hash === this.hashear(senha);
  }
}
```

**Raciocínio:** Para detalhes de implementação que não devem ser expostos. Dados sensíveis.

### Quando Usar Readonly

```typescript
class Pedido {
  constructor(
    public readonly id: string,
    public readonly data: Date,
    public status: string
  ) {}
}
```

**Raciocínio:** Para dados que não devem mudar após criação (IDs, timestamps, configurações fixas).

## ⚠️ Limitações e Considerações Teóricas

### Private é Compile-Time Only

```typescript
class Secreta {
  private senha: string = "123";
}

const s = new Secreta();
// s.senha // ❌ Erro TypeScript
// Mas em runtime (JavaScript):
console.log(s["senha"]); // "123" - acessível!
```

**Implicação:** `private` é verificado apenas em compile-time. Em runtime (JavaScript), tudo é acessível.

### Readonly não Impede Mutação Profunda

```typescript
class Container {
  readonly items: string[] = [];
}

const c = new Container();
// c.items = []; // ❌ Erro: reatribuição
c.items.push("item"); // ✅ OK: mutação do conteúdo
```

**Conceito:** `readonly` previne reatribuição, não mutação de objetos/arrays.

## 🔗 Interconexões Conceituais

**Relação com Constructor:** Properties são inicializadas no constructor.

**Relação com Methods:** Métodos acessam e modificam properties via `this`.

**Relação com Getters/Setters:** Permitem lógica customizada ao acessar/modificar properties.

**Relação com Herança:** Subclasses herdam properties de classes pai.

## 🚀 Evolução e Próximos Conceitos

Dominar properties prepara para:
- **Getters e Setters:** Controle fino sobre acesso a properties
- **Modificadores de Acesso Avançados:** Uso estratégico de private/protected
- **Decorators:** Adicionar metadata e comportamento a properties
- **Mapped Types:** Manipular properties em types avançados
