# Readonly Modifier: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Readonly modifier** (`readonly`) torna propriedades de classe **imutáveis após inicialização**, permitindo atribuição apenas no constructor ou na declaração, mas impedindo modificações posteriores. Conceitualmente, representa **imutabilidade pós-construção**, garantindo que valores não mudam após objeto estar totalmente construído.

Na essência, `readonly` materializa o princípio de **valores constantes por instância**, onde cada objeto tem valores que não mudam durante seu ciclo de vida, criando objetos mais previsíveis e seguros.

## 📋 Fundamentos

### Sintaxe e Restrições

```typescript
class Usuario {
  readonly id: number;
  readonly email: string;
  nome: string; // Não readonly - pode mudar

  constructor(id: number, email: string, nome: string) {
    // ✅ Pode atribuir no constructor
    this.id = id;
    this.email = email;
    this.nome = nome;
  }

  public atualizarNome(novoNome: string): void {
    this.nome = novoNome; // ✅ OK - não é readonly
    // this.email = "novo@email.com"; // ❌ Erro - readonly
  }
}

const usuario = new Usuario(1, "ana@example.com", "Ana");
usuario.nome = "Maria"; // ✅ OK
// usuario.id = 2;      // ❌ Erro: Cannot assign to 'id' because it is readonly
// usuario.email = "novo@example.com"; // ❌ Erro: readonly
```

**Conceito-chave:** `readonly` permite **inicialização** (declaração ou constructor) mas **bloqueia reatribuição**.

### Inicialização em Declaração

```typescript
class Configuracao {
  readonly versao: string = "1.0.0"; // Inicializado na declaração
  readonly ambiente: string;

  constructor(ambiente: string) {
    this.ambiente = ambiente; // Inicializado no constructor
  }
}

const config = new Configuracao("producao");
console.log(config.versao);    // "1.0.0"
console.log(config.ambiente);  // "producao"
// config.versao = "2.0.0";    // ❌ Erro
```

## 🔍 Análise Conceitual

### 1. Readonly vs. Const

```typescript
// const - variável não pode ser reatribuída
const PI = 3.14159;
// PI = 3.14; // Erro

// readonly - propriedade não pode ser reatribuída após inicialização
class Circulo {
  readonly raio: number;

  constructor(raio: number) {
    this.raio = raio;
  }

  public area(): number {
    return Math.PI * this.raio ** 2;
  }
}

const circulo = new Circulo(5);
// circulo.raio = 10; // Erro - readonly
```

**Diferença:** `const` é para variáveis/constantes. `readonly` é para propriedades de classe/objeto.

### 2. Readonly com Arrays e Objetos

```typescript
class Turma {
  readonly alunos: string[] = []; // Array é readonly, mas conteúdo não!

  constructor() {
    this.alunos.push("Ana"); // ✅ OK - modifica conteúdo
  }

  public adicionarAluno(nome: string): void {
    this.alunos.push(nome); // ✅ OK - métodos mutáveis funcionam
  }

  public substituirAlunos(): void {
    // this.alunos = ["Novo"]; // ❌ Erro - não pode reatribuir array
    this.alunos.length = 0;    // ✅ OK - limpa array existente
    this.alunos.push("Novo");  // ✅ OK
  }
}

const turma = new Turma();
turma.adicionarAluno("Bob");
// turma.alunos = [];  // ❌ Erro - readonly
turma.alunos.push("Carol"); // ✅ OK - conteúdo mutável
```

**Importante:** `readonly` impede **reatribuição da referência**, mas não impede **mutação do conteúdo**.

### 3. Readonly Array (Imutabilidade Profunda)

```typescript
class TurmaImutavel {
  readonly alunos: readonly string[]; // Readonly array - conteúdo imutável

  constructor(alunos: string[]) {
    this.alunos = alunos;
  }

  public adicionarAluno(nome: string): readonly string[] {
    // ✅ Retorna novo array ao invés de mutar
    return [...this.alunos, nome];
  }
}

const turma = new TurmaImutavel(["Ana", "Bob"]);
// turma.alunos.push("Carol"); // ❌ Erro - readonly array
const novaTurma = turma.adicionarAluno("Carol"); // ✅ Novo array
```

**Conceito:** `readonly T[]` torna **conteúdo do array imutável** - verdadeira imutabilidade.

### 4. Readonly com Modificadores de Acesso

```typescript
class Produto {
  public readonly id: number;           // Public readonly
  private readonly codigo: string;      // Private readonly
  protected readonly categoria: string; // Protected readonly

  constructor(id: number, codigo: string, categoria: string) {
    this.id = id;
    this.codigo = codigo;
    this.categoria = categoria;
  }
}

const produto = new Produto(1, "ABC123", "Eletrônicos");
console.log(produto.id); // ✅ Acessível (public) mas não modificável (readonly)
// produto.id = 2;       // ❌ Erro - readonly
// produto.codigo;       // ❌ Erro - private
```

**Combinação:** `readonly` pode ser combinado com `public`, `private`, `protected`.

### 5. Readonly Static

```typescript
class Matematica {
  static readonly PI: number = 3.14159;
  static readonly E: number = 2.71828;

  public static areaCirculo(raio: number): number {
    return Matematica.PI * raio ** 2;
  }
}

console.log(Matematica.PI); // 3.14159
// Matematica.PI = 3.14;    // ❌ Erro - readonly static
```

### 6. Computed Readonly

```typescript
class Retangulo {
  readonly largura: number;
  readonly altura: number;

  constructor(largura: number, altura: number) {
    this.largura = largura;
    this.altura = altura;
  }

  // Getter readonly (calculado)
  get area(): number {
    return this.largura * this.altura;
  }

  get perimetro(): number {
    return 2 * (this.largura + this.altura);
  }
}

const ret = new Retangulo(5, 10);
console.log(ret.area);      // 50
// ret.area = 100;          // ❌ Erro - getter não tem setter
// ret.largura = 20;        // ❌ Erro - readonly
```

## 🎯 Aplicabilidade

### Identificadores Únicos

```typescript
class Pedido {
  readonly id: string;
  readonly dataCriacao: Date;
  status: string = "pendente";

  constructor() {
    this.id = crypto.randomUUID();
    this.dataCriacao = new Date();
  }

  public processar(): void {
    this.status = "processado";
    // this.id = "novo-id"; // ❌ Garantia: ID nunca muda
  }
}
```

### Configurações Imutáveis

```typescript
class AppConfig {
  readonly apiUrl: string;
  readonly apiKey: string;
  readonly timeout: number;

  constructor(env: "dev" | "prod") {
    if (env === "prod") {
      this.apiUrl = "https://api.exemplo.com";
      this.apiKey = "prod-key";
      this.timeout = 5000;
    } else {
      this.apiUrl = "http://localhost:3000";
      this.apiKey = "dev-key";
      this.timeout = 10000;
    }
  }
}

const config = new AppConfig("prod");
// config.apiUrl = "hack"; // ❌ Protegido por readonly
```

### Value Objects (DDD)

```typescript
class Email {
  readonly valor: string;

  constructor(email: string) {
    if (!this.validar(email)) {
      throw new Error("Email inválido");
    }
    this.valor = email;
  }

  private validar(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  public equals(outro: Email): boolean {
    return this.valor === outro.valor;
  }
}

const email = new Email("ana@example.com");
// email.valor = "novo@example.com"; // ❌ Value object imutável
```

### Data Transfer Objects (DTOs)

```typescript
class UsuarioDTO {
  readonly id: number;
  readonly nome: string;
  readonly email: string;
  readonly criadoEm: Date;

  constructor(dados: { id: number; nome: string; email: string; criadoEm: Date }) {
    this.id = dados.id;
    this.nome = dados.nome;
    this.email = dados.email;
    this.criadoEm = dados.criadoEm;
  }

  // DTO é snapshot imutável de dados
}
```

## ⚠️ Considerações

### 1. Readonly é Shallow (Superficial)

```typescript
class Pessoa {
  readonly endereco: { rua: string; numero: number };

  constructor() {
    this.endereco = { rua: "Rua A", numero: 100 };
  }

  public mudarEndereco(): void {
    // this.endereco = { rua: "Rua B", numero: 200 }; // ❌ Erro

    // ✅ Mas pode modificar propriedades internas
    this.endereco.rua = "Rua B";
    this.endereco.numero = 200;
  }
}
```

**Solução:** Use tipos `Readonly<T>` ou `readonly` em propriedades aninhadas.

### 2. Readonly em Interfaces

```typescript
interface IProduto {
  readonly id: number;
  readonly nome: string;
  preco: number; // Mutável
}

const produto: IProduto = {
  id: 1,
  nome: "Notebook",
  preco: 2000
};

produto.preco = 1800; // ✅ OK
// produto.id = 2;    // ❌ Erro - readonly
```

### 3. Readonly vs. Getter-only

```typescript
// Com readonly
class ComReadonly {
  readonly valor: number = 10;
}

// Com getter-only (sem setter)
class ComGetter {
  private _valor: number = 10;

  get valor(): number {
    return this._valor;
  }
}

// Ambos impedem modificação externa, mas:
// - readonly: inicialização limitada a constructor/declaração
// - getter: pode ter lógica, calcular valor dinamicamente
```

## 📚 Conclusão

`readonly` torna propriedades imutáveis após inicialização, permitindo atribuição apenas no constructor ou declaração. É essencial para identificadores, configurações, value objects e DTOs - casos onde valores não devem mudar após criação. Combina com modificadores de acesso para controle completo de visibilidade e mutabilidade.
