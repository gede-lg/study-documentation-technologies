# Protected Modifier: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Protected modifier** (`protected`) restringe acesso a membros de classe à **própria classe e suas subclasses** (classes derivadas), mas impede acesso externo via instâncias. Conceitualmente, representa **encapsulamento hierárquico**, onde implementação é compartilhada dentro da cadeia de herança mas escondida de consumidores externos.

Na essência, `protected` materializa o princípio de **visibilidade controlada por herança**, permitindo que subclasses reutilizem e estendam comportamento da classe base mantendo encapsulamento para mundo exterior.

## 📋 Fundamentos

### Sintaxe e Hierarquia de Acesso

```typescript
class Animal {
  protected energia: number = 100;
  protected nome: string;

  constructor(nome: string) {
    this.nome = nome;
  }

  protected descansar(): void {
    this.energia = Math.min(100, this.energia + 20);
    console.log(`${this.nome} descansou. Energia: ${this.energia}`);
  }

  public dormir(): void {
    this.descansar(); // ✅ Acesso dentro da classe
  }
}

class Cachorro extends Animal {
  public brincar(): void {
    this.energia -= 30; // ✅ Acesso em subclasse
    console.log(`${this.nome} brincou. Energia: ${this.energia}`);

    if (this.energia < 30) {
      this.descansar(); // ✅ Método protected acessível
    }
  }
}

const dog = new Cachorro("Rex");
dog.brincar();
dog.dormir();

// ❌ Erros - protected não acessível externamente
// console.log(dog.energia);  // Erro: 'energia' is protected
// dog.descansar();           // Erro: método protected
```

**Conceito-chave:** `protected` cria **API interna** para herança, diferente de `public` (API externa) e `private` (totalmente escondido).

### Comparação dos Modificadores

```typescript
class Base {
  public publico: string = "A";        // Acessível: classe, subclasse, externo
  protected protegido: string = "B";   // Acessível: classe, subclasse
  private privado: string = "C";       // Acessível: apenas classe

  public metodo(): void {
    console.log(this.publico);    // ✅
    console.log(this.protegido);  // ✅
    console.log(this.privado);    // ✅
  }
}

class Derivada extends Base {
  public metodoFilho(): void {
    console.log(this.publico);    // ✅ Public acessível
    console.log(this.protegido);  // ✅ Protected acessível
    // console.log(this.privado); // ❌ Private NÃO acessível
  }
}

const obj = new Derivada();
console.log(obj.publico);    // ✅ Public acessível externamente
// console.log(obj.protegido); // ❌ Protected não acessível
// console.log(obj.privado);   // ❌ Private não acessível
```

## 🔍 Análise Conceitual

### 1. Template Method Pattern

```typescript
abstract class ProcessadorDados {
  protected dados: any[];

  constructor(dados: any[]) {
    this.dados = dados;
  }

  // Template method (public) - define esqueleto
  public processar(): any[] {
    this.validar();
    this.transformar();
    this.ordenar();
    return this.dados;
  }

  // Métodos protected - subclasses podem sobrescrever
  protected validar(): void {
    console.log("Validação padrão");
  }

  protected abstract transformar(): void; // Obriga implementação

  protected ordenar(): void {
    this.dados.sort();
  }
}

class ProcessadorNumeros extends ProcessadorDados {
  protected validar(): void {
    // Sobrescreve protected da classe pai
    this.dados = this.dados.filter(n => typeof n === "number");
  }

  protected transformar(): void {
    // Implementa abstract
    this.dados = this.dados.map(n => n * 2);
  }
}

const proc = new ProcessadorNumeros([1, "a", 3, "b", 5]);
proc.processar(); // ✅ [2, 6, 10]
// proc.validar();   // ❌ Erro - protected
```

**Conceito:** Classe base define estrutura (`processar()`), subclasses customizam partes (`validar()`, `transformar()`).

### 2. Constructor Protected

```typescript
class Veiculo {
  protected marca: string;

  protected constructor(marca: string) {
    // Constructor protected - não pode instanciar diretamente
    this.marca = marca;
  }
}

class Carro extends Veiculo {
  private modelo: string;

  constructor(marca: string, modelo: string) {
    super(marca); // ✅ Pode chamar constructor protected
    this.modelo = modelo;
  }

  public info(): string {
    return `${this.marca} ${this.modelo}`; // ✅ Acessa protected
  }
}

const carro = new Carro("Toyota", "Corolla"); // ✅ OK
// const veiculo = new Veiculo("Ford");       // ❌ Erro - constructor protected
```

**Uso:** Force criação apenas via subclasses específicas.

### 3. Compartilhamento de Estado

```typescript
class ContaBancaria {
  protected saldo: number;
  protected titular: string;

  constructor(titular: string, saldoInicial: number) {
    this.titular = titular;
    this.saldo = saldoInicial;
  }

  protected validarSaque(valor: number): boolean {
    return valor > 0 && valor <= this.saldo;
  }

  public getSaldo(): number {
    return this.saldo;
  }
}

class ContaCorrente extends ContaBancaria {
  private limite: number = 500;

  public sacar(valor: number): void {
    // Acessa protected da classe pai
    if (this.validarSaque(valor)) {
      this.saldo -= valor;
    } else if (valor <= this.saldo + this.limite) {
      // Pode usar limite adicional
      this.saldo -= valor;
    } else {
      throw new Error("Saldo insuficiente");
    }
  }
}

class ContaPoupanca extends ContaBancaria {
  public sacar(valor: number): void {
    // Reutiliza validação protected
    if (!this.validarSaque(valor)) {
      throw new Error("Saldo insuficiente");
    }
    this.saldo -= valor;
  }
}
```

### 4. Hook Methods

```typescript
class Component {
  protected estado: any = {};

  public inicializar(): void {
    this.antesDeInicializar();
    this.carregarEstado();
    this.depoisDeInicializar();
  }

  protected antesDeInicializar(): void {
    // Hook - subclasse pode sobrescrever
  }

  protected carregarEstado(): void {
    console.log("Estado carregado");
  }

  protected depoisDeInicializar(): void {
    // Hook - subclasse pode sobrescrever
  }
}

class BotaoComponent extends Component {
  protected antesDeInicializar(): void {
    console.log("Preparando botão...");
    this.estado.label = "Clique aqui";
  }

  protected depoisDeInicializar(): void {
    console.log("Botão pronto!");
  }
}
```

### 5. Protected Static

```typescript
class Logger {
  protected static instancias: Logger[] = [];

  protected nivel: string;

  constructor(nivel: string) {
    this.nivel = nivel;
    Logger.instancias.push(this);
  }

  protected static limparInstancias(): void {
    Logger.instancias = [];
  }
}

class FileLogger extends Logger {
  constructor() {
    super("FILE");
  }

  public static resetar(): void {
    this.limparInstancias(); // ✅ Acessa protected static
  }
}
```

## 🎯 Aplicabilidade

### Framework Design

```typescript
abstract class HttpController {
  protected req: Request;
  protected res: Response;

  public async executar(req: Request, res: Response): Promise<void> {
    this.req = req;
    this.res = res;

    try {
      await this.antesDeProcessar();
      await this.processar();
      await this.depoisDeProcessar();
    } catch (erro) {
      this.tratarErro(erro);
    }
  }

  protected async antesDeProcessar(): Promise<void> {
    // Hook - subclasse pode implementar
  }

  protected abstract processar(): Promise<void>;

  protected async depoisDeProcessar(): Promise<void> {
    // Hook - subclasse pode implementar
  }

  protected tratarErro(erro: any): void {
    this.res.status(500).send({ erro: erro.message });
  }
}

class UsuarioController extends HttpController {
  protected async processar(): Promise<void> {
    const usuarios = await this.buscarUsuarios();
    this.res.json(usuarios);
  }

  private async buscarUsuarios(): Promise<any[]> {
    // Lógica específica
    return [];
  }
}
```

### Validação Compartilhada

```typescript
class Formulario {
  protected erros: string[] = [];

  protected adicionarErro(mensagem: string): void {
    this.erros.push(mensagem);
  }

  protected validarRequerido(campo: string, valor: any): boolean {
    if (!valor) {
      this.adicionarErro(`${campo} é obrigatório`);
      return false;
    }
    return true;
  }

  protected validarEmail(email: string): boolean {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.adicionarErro("Email inválido");
      return false;
    }
    return true;
  }

  public getErros(): string[] {
    return this.erros;
  }
}

class FormularioCadastro extends Formulario {
  public validar(dados: { nome: string; email: string }): boolean {
    this.erros = []; // Limpa erros

    // Usa métodos protected da classe pai
    this.validarRequerido("nome", dados.nome);
    this.validarRequerido("email", dados.email);
    this.validarEmail(dados.email);

    return this.erros.length === 0;
  }
}
```

## ⚠️ Considerações

### 1. Quebra Encapsulamento Parcialmente

```typescript
class Base {
  protected valor: number = 10;
}

class Derivada extends Base {
  public expor(): number {
    return this.valor; // Expõe protected externamente
  }
}

const obj = new Derivada();
console.log(obj.expor()); // Protected "vazou" via método public
```

**Cuidado:** Subclasse pode inadvertidamente expor membros protected.

### 2. Quando Usar Protected

- ✅ **Template methods e hooks** para customização
- ✅ **Utilitários compartilhados** entre classe pai e filhas
- ✅ **Estado que subclasses precisam** mas externos não
- ❌ **Evitar se não há hierarquia de herança planejada**

### 3. Protected vs. Private

```typescript
// Use private quando:
class ConPrivate {
  private segredo: string = "123"; // Ninguém mais deve acessar
}

// Use protected quando:
class ComProtected {
  protected configuracao: any = {}; // Subclasses podem precisar
}
```

## 📚 Conclusão

`protected` permite acesso em classe e subclasses, criando API interna para herança. É ideal para template methods, hooks e compartilhamento controlado de implementação, equilibrando reuso via herança com encapsulamento externo.
