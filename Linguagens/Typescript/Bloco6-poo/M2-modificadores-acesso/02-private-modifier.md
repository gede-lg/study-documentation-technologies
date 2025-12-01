# Private Modifier: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Private modifier** (`private`) restringe acesso a membros de classe exclusivamente **dentro da própria classe**, impedindo acesso externo e até de subclasses. Conceitualmente, representa **encapsulamento completo**, onde detalhes de implementação ficam escondidos do mundo exterior.

Na essência, `private` materializa o princípio de **information hiding** (ocultação de informação), protegendo invariantes da classe e permitindo mudanças internas sem quebrar código consumidor.

## 📋 Fundamentos

### Sintaxe e Restrição de Acesso

```typescript
class ContaBancaria {
  private saldo: number;
  private historico: string[] = [];

  constructor(saldoInicial: number) {
    this.saldo = saldoInicial;
    this.registrarTransacao(`Conta criada com saldo ${saldoInicial}`);
  }

  private registrarTransacao(mensagem: string): void {
    this.historico.push(`${new Date().toISOString()}: ${mensagem}`);
  }

  public depositar(valor: number): void {
    this.saldo += valor; // ✅ Acesso dentro da classe
    this.registrarTransacao(`Depósito de ${valor}`); // ✅ Método private acessível
  }

  public getSaldo(): number {
    return this.saldo; // ✅ Retorna private via método public
  }
}

const conta = new ContaBancaria(1000);
conta.depositar(500);
console.log(conta.getSaldo()); // ✅ 1500

// ❌ Erros de compilação
// conta.saldo = 99999;              // Erro: 'saldo' is private
// conta.registrarTransacao("hack"); // Erro: método private
// console.log(conta.historico);     // Erro: 'historico' is private
```

**Conceito-chave:** `private` garante que **apenas código dentro da própria classe** pode acessar o membro.

### Private vs. Public

```typescript
class Usuario {
  public nome: string;       // Acessível de qualquer lugar
  private senha: string;     // Apenas dentro da classe

  constructor(nome: string, senha: string) {
    this.nome = nome;
    this.senha = this.hashSenha(senha);
  }

  private hashSenha(senha: string): string {
    // Implementação privada
    return `hash_${senha}`;
  }

  public autenticar(senhaFornecida: string): boolean {
    // Acessa private dentro da classe
    return this.hashSenha(senhaFornecida) === this.senha;
  }
}

const usuario = new Usuario("Ana", "segredo123");
console.log(usuario.nome);             // ✅ "Ana" - public
usuario.autenticar("segredo123");      // ✅ true - método public
// console.log(usuario.senha);         // ❌ Erro - private
// usuario.hashSenha("teste");         // ❌ Erro - método private
```

## 🔍 Análise Conceitual

### 1. Encapsulamento de Estado

```typescript
class Contador {
  private valor: number = 0;
  private readonly maximo: number;

  constructor(maximo: number) {
    this.maximo = maximo;
  }

  public incrementar(): void {
    if (this.valor < this.maximo) {
      this.valor++;
    }
  }

  public getValor(): number {
    return this.valor;
  }
}

const contador = new Contador(10);
contador.incrementar();
console.log(contador.getValor()); // 1

// ❌ Não pode manipular diretamente
// contador.valor = 100; // Erro - private protege invariante
```

**Conceito:** `private` garante que estado só muda através de métodos controlados, mantendo invariantes da classe.

### 2. Herança e Private

```typescript
class Animal {
  private idade: number;  // Private na classe pai

  constructor(idade: number) {
    this.idade = idade;
  }

  protected getIdade(): number {
    return this.idade; // ✅ Acesso dentro da classe
  }
}

class Cachorro extends Animal {
  private raca: string;

  constructor(idade: number, raca: string) {
    super(idade);
    this.raca = raca;
  }

  public info(): string {
    // ❌ this.idade - Erro: private não acessível em subclasse
    return `Cachorro com ${this.getIdade()} anos`; // ✅ Via método protected
  }
}

const dog = new Cachorro(3, "Labrador");
// dog.idade;  // ❌ Erro - private
// dog.raca;   // ❌ Erro - private
console.log(dog.info()); // ✅ "Cachorro com 3 anos"
```

**Importante:** Membros `private` **não são acessíveis nem em subclasses**. Para permitir acesso em herança, use `protected`.

### 3. Métodos Auxiliares Privados

```typescript
class ValidadorEmail {
  private regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  public validar(email: string): boolean {
    return this.temFormato(email) && this.temDominio(email);
  }

  private temFormato(email: string): boolean {
    return this.regex.test(email);
  }

  private temDominio(email: string): boolean {
    const dominio = email.split("@")[1];
    return dominio !== undefined && dominio.includes(".");
  }
}

const validador = new ValidadorEmail();
validador.validar("ana@example.com"); // ✅ true - API pública
// validador.temFormato("test");      // ❌ Erro - método private
```

**Conceito:** Métodos auxiliares ficam `private` - apenas `validar()` é exposto como API pública.

### 4. Private em Static

```typescript
class Configuracao {
  private static instancia: Configuracao;
  private configData: Record<string, any> = {};

  private constructor() {
    // Constructor private - Singleton pattern
  }

  public static getInstance(): Configuracao {
    if (!Configuracao.instancia) {
      Configuracao.instancia = new Configuracao();
    }
    return Configuracao.instancia;
  }

  public definir(chave: string, valor: any): void {
    this.configData[chave] = valor;
  }
}

const config1 = Configuracao.getInstance();
const config2 = Configuracao.getInstance();
console.log(config1 === config2); // ✅ true - mesma instância

// new Configuracao(); // ❌ Erro - constructor é private
```

### 5. Private Fields (JavaScript Nativo)

```typescript
// TypeScript private (compile-time)
class ContaTS {
  private saldo: number = 0;
}

// JavaScript private fields (runtime) - desde ES2022
class ContaJS {
  #saldo: number = 0; // # indica private field nativo

  getSaldo() {
    return this.#saldo;
  }
}

const contaJS = new ContaJS();
// contaJS.#saldo; // SyntaxError em runtime - truly private
```

**Diferença:** TypeScript `private` é verificação compile-time. JavaScript `#field` é privacidade real em runtime.

## 🎯 Aplicabilidade

### Validação e Invariantes

```typescript
class Retangulo {
  private largura: number;
  private altura: number;

  constructor(largura: number, altura: number) {
    if (largura <= 0 || altura <= 0) {
      throw new Error("Dimensões devem ser positivas");
    }
    this.largura = largura;
    this.altura = altura;
  }

  public area(): number {
    return this.largura * this.altura;
  }

  public redimensionar(novaLargura: number, novaAltura: number): void {
    // Validação centralizada
    if (novaLargura <= 0 || novaAltura <= 0) {
      throw new Error("Dimensões devem ser positivas");
    }
    this.largura = novaLargura;
    this.altura = novaAltura;
  }
}
```

### Cache Interno

```typescript
class API {
  private cache: Map<string, any> = new Map();
  private cacheExpiracao: Map<string, number> = new Map();

  public async buscar(endpoint: string): Promise<any> {
    if (this.temCacheValido(endpoint)) {
      return this.cache.get(endpoint);
    }

    const dados = await this.fazerRequisicao(endpoint);
    this.armazenarCache(endpoint, dados);
    return dados;
  }

  private temCacheValido(endpoint: string): boolean {
    if (!this.cache.has(endpoint)) return false;

    const expiracao = this.cacheExpiracao.get(endpoint)!;
    return Date.now() < expiracao;
  }

  private async fazerRequisicao(endpoint: string): Promise<any> {
    const response = await fetch(endpoint);
    return response.json();
  }

  private armazenarCache(endpoint: string, dados: any): void {
    this.cache.set(endpoint, dados);
    this.cacheExpiracao.set(endpoint, Date.now() + 60000); // 1 minuto
  }
}
```

### State Machine

```typescript
enum EstadoPedido {
  PENDENTE = "PENDENTE",
  PROCESSANDO = "PROCESSANDO",
  ENVIADO = "ENVIADO",
  ENTREGUE = "ENTREGUE"
}

class Pedido {
  private estado: EstadoPedido = EstadoPedido.PENDENTE;

  public processar(): void {
    this.transicionar(EstadoPedido.PROCESSANDO);
  }

  public enviar(): void {
    this.transicionar(EstadoPedido.ENVIADO);
  }

  private transicionar(novoEstado: EstadoPedido): void {
    const transicoesValidas: Record<EstadoPedido, EstadoPedido[]> = {
      [EstadoPedido.PENDENTE]: [EstadoPedido.PROCESSANDO],
      [EstadoPedido.PROCESSANDO]: [EstadoPedido.ENVIADO],
      [EstadoPedido.ENVIADO]: [EstadoPedido.ENTREGUE],
      [EstadoPedido.ENTREGUE]: []
    };

    if (!transicoesValidas[this.estado].includes(novoEstado)) {
      throw new Error(`Transição inválida: ${this.estado} → ${novoEstado}`);
    }

    this.estado = novoEstado;
  }

  public getEstado(): EstadoPedido {
    return this.estado;
  }
}
```

## ⚠️ Limitações

### 1. Não é Privacidade Real em Runtime

```typescript
class Segredo {
  private senha: string = "123456";
}

const obj = new Segredo();
// obj.senha; // ❌ Erro de compilação

// Mas em runtime JavaScript:
console.log((obj as any).senha); // ✅ "123456" - acessível via cast
console.log(obj["senha"]);       // ✅ "123456" - acessível via indexação
```

**Solução:** Use `#privateField` (JavaScript nativo) para privacidade real em runtime.

### 2. Dificulta Testes

```typescript
class Processador {
  private validar(dados: any): boolean {
    // Lógica complexa que você quer testar
    return dados !== null;
  }

  public processar(dados: any): void {
    if (this.validar(dados)) {
      // ...
    }
  }
}

// Teste não pode acessar validar() diretamente
// Soluções: testar via processar() ou extrair validador separado
```

## 📚 Conclusão

`private` restringe acesso a membros exclusivamente dentro da classe, implementando encapsulamento forte. Protege invariantes, esconde implementação e permite refatorações internas sem afetar consumidores. É compile-time only - use `#field` para privacidade real em runtime.
