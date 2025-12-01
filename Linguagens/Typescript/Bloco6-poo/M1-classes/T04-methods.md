# Methods

## 🎯 Introdução e Definição

### Definição Conceitual

**Methods** (métodos) são funções definidas dentro de uma classe que representam o **comportamento** ou **ações** que objetos dessa classe podem realizar. Enquanto properties armazenam o estado (dados), methods definem operações que manipulam esse estado, realizam cálculos, interagem com o mundo externo ou executam qualquer lógica de negócio relacionada ao objeto.

Conceitualmente, methods são os "verbos" do objeto - descrevem "o que ele pode fazer". Um method encapsula comportamento reutilizável que pode ser invocado múltiplas vezes em diferentes instâncias, mantendo a lógica centralizada e facilitando manutenção. Methods têm acesso privilegiado ao estado interno do objeto via `this`, permitindo que operem sobre dados específicos da instância.

### Contexto Histórico e Motivação

A evolução de methods em programação orientada a objetos:

**Simula (1967):** Introduziu "procedures" associadas a classes, permitindo objetos com comportamento.

**Smalltalk (1970s):** Popularizou conceito de "messages" enviadas a objetos, onde methods são handlers dessas mensagens.

**C++ (1980s):** Formalizou "member functions" como funções pertencentes a classes, diferenciando-as de funções globais.

**Java (1995):** Estabeleceu convenção de methods públicos e privados, encapsulando comportamento.

**JavaScript:** Functions sempre foram first-class. Methods em objetos eram simplesmente properties que continham functions. **ES6 (2015)** introduziu syntax concisa para methods em classes.

**TypeScript:** Adicionou **type checking** para parâmetros e retornos de methods, **modificadores de acesso**, **abstract methods** e **method overloading**.

A motivação era **encapsulamento de comportamento**: associar ações com os dados que manipulam, criando unidades coesas onde estado e comportamento vivem juntos, respeitando o princípio de "tell, don't ask".

### Problema Fundamental que Resolve

Methods resolvem problemas críticos de organização de código:

**1. Encapsulamento de Lógica:** Agrupam comportamento relacionado com dados, evitando funções soltas que operam sobre estruturas de dados.

**2. Reutilização:** Lógica definida uma vez no method pode ser usada por todas as instâncias.

**3. Manutenibilidade:** Mudanças em comportamento precisam ser feitas em um lugar só.

**4. Abstração:** Ocultam detalhes de implementação, expondo apenas operações de alto nível.

**5. Polimorfismo:** Subclasses podem sobrescrever methods, permitindo comportamento especializado.

**6. Acesso Controlado a Estado:** Via `this`, methods acessam properties respeitando encapsulamento (private, protected).

### Importância no Ecossistema

Methods são fundamentais porque:

- **Interface Pública:** Definem API que objetos expõem ao mundo
- **Business Logic:** Implementam regras de negócio associadas a entidades
- **Validação:** Methods podem validar estado antes de modificá-lo
- **Side Effects:** Executam operações (I/O, logging, eventos)
- **Frameworks:** Angular, React, NestJS dependem de methods em classes

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Comportamento de Instância:** Methods operam sobre instâncias específicas
2. **Acesso a Estado:** Via `this`, acessam properties da instância
3. **Type Safety:** Parâmetros e retorno são tipados estaticamente
4. **Polimorfismo:** Methods podem ser sobrescritos em subclasses

### Pilares Fundamentais

- **Declaração:** Nome, parâmetros e tipo de retorno dentro da classe
- **This Binding:** `this` refere-se à instância que chamou o method
- **Encapsulamento:** Methods podem ser public/private/protected
- **Reutilização:** Mesma lógica aplicada a múltiplas instâncias
- **Composição:** Methods podem chamar outros methods

### Visão Geral das Nuances

- **Arrow Functions vs Methods:** Different `this` binding
- **Method Overloading:** Múltiplas assinaturas para mesmo method
- **Async Methods:** Methods podem retornar Promises
- **Static Methods:** Pertencem à classe, não a instâncias

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Quando TypeScript compila methods:

**1. Parsing:** Compilador analisa declarações de methods, identificando assinatura e corpo.

**2. Type Checking:** Verifica tipos de parâmetros, tipo de retorno, e que retornos correspondem ao tipo declarado.

**3. This Binding:** Valida que `this` é usado corretamente dentro do method.

**4. Access Control:** Checa que methods respeitam modificadores (private methods só chamados internamente).

**5. Code Generation:** Transpila para JavaScript. Methods viram funções no prototype (ES6 class) ou function object (ES5).

**6. Runtime:** Em execução, methods são funções normais. Quando chamados, `this` é bound ao objeto receptor.

### Princípios e Conceitos Subjacentes

#### Tell, Don't Ask

Principle: ao invés de "perguntar" estado de objeto e decidir ação externamente, "diga" ao objeto o que fazer via method. O objeto encapsula lógica.

```typescript
// ❌ Ask - expõe estado
class Conta {
  saldo: number;
}
if (conta.saldo >= valor) {
  conta.saldo -= valor; // Lógica externa
}

// ✅ Tell - encapsula lógica
class Conta {
  private saldo: number;
  
  sacar(valor: number): boolean {
    if (this.saldo >= valor) {
      this.saldo -= valor;
      return true;
    }
    return false;
  }
}
conta.sacar(valor); // Objeto decide
```

#### Command-Query Separation

Principe: methods devem ser **commands** (modificam estado, sem retorno) OU **queries** (retornam valor, sem modificar estado), não ambos.

```typescript
class Pilha<T> {
  private items: T[] = [];
  
  // Command: modifica estado
  push(item: T): void {
    this.items.push(item);
  }
  
  // Query: retorna valor sem modificar
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  
  // ❌ Viola CQS - modifica E retorna
  // pop(): T | undefined {
  //   return this.items.pop();
  // }
}
```

Nota: `pop()` é exceção comum onde violação é pragmática.

#### This Binding

`this` em methods refere-se à instância que recebeu a chamada:

```typescript
class Contador {
  valor: number = 0;
  
  incrementar() {
    this.valor++; // this = instância que chamou
  }
}

const c1 = new Contador();
const c2 = new Contador();
c1.incrementar(); // this = c1
c2.incrementar(); // this = c2
```

`this` é dinâmico, determinado em call-time.

### Modelo Mental para Compreensão

Pense em methods como **verbos** ou **comandos** que você dá a um objeto:

- **Objeto (Entidade):** Um robô
- **Properties (Estado):** Nível de bateria, posição
- **Methods (Ações):** mover(), carregar(), parar()

Quando você chama `robo.mover()`, está "dizendo" ao robô para executar ação. O robô sabe internamente como fazer (implementação do method).

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica

```typescript
class Calculadora {
  // Method simples
  somar(a: number, b: number): number {
    return a + b;
  }
  
  // Method sem retorno (void)
  imprimir(resultado: number): void {
    console.log(`Resultado: ${resultado}`);
  }
  
  // Method com múltiplos parâmetros
  calcular(a: number, b: number, operacao: string): number {
    switch (operacao) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return a / b;
      default: throw new Error("Operação inválida");
    }
  }
}

const calc = new Calculadora();
const soma = calc.somar(5, 3); // 8
calc.imprimir(soma); // "Resultado: 8"
```

**Análise conceitual:** Declaração similar a funções, mas dentro da classe. Sem `function` keyword em class syntax.

### Acessando Properties via This

```typescript
class Pessoa {
  nome: string;
  idade: number;
  
  constructor(nome: string, idade: number) {
    this.nome = nome;
    this.idade = idade;
  }
  
  // Method acessa properties
  apresentar(): string {
    return `Olá, sou ${this.nome} e tenho ${this.idade} anos.`;
  }
  
  // Method modifica property
  fazerAniversario(): void {
    this.idade++;
  }
  
  // Method usa outras properties
  ehMaiorDeIdade(): boolean {
    return this.idade >= 18;
  }
}

const pessoa = new Pessoa("Ana", 25);
console.log(pessoa.apresentar()); // "Olá, sou Ana e tenho 25 anos."
pessoa.fazerAniversario();
console.log(pessoa.idade); // 26
```

**Fundamento teórico:** `this.propertyName` acessa properties da instância atual. Permite que method opere sobre estado específico do objeto.

### Methods Chamando Outros Methods

```typescript
class ContaBancaria {
  private saldo: number = 0;
  
  depositar(valor: number): void {
    if (this.validarValor(valor)) {
      this.saldo += valor;
      this.registrarTransacao("Depósito", valor);
    }
  }
  
  sacar(valor: number): boolean {
    if (this.validarValor(valor) && this.saldo >= valor) {
      this.saldo -= valor;
      this.registrarTransacao("Saque", valor);
      return true;
    }
    return false;
  }
  
  private validarValor(valor: number): boolean {
    return valor > 0;
  }
  
  private registrarTransacao(tipo: string, valor: number): void {
    console.log(`[${tipo}] R$ ${valor}`);
  }
  
  obterSaldo(): number {
    return this.saldo;
  }
}
```

**Conceito crucial:** Methods podem chamar outros methods via `this.methodName()`. Isso permite decomposição de lógica complexa e reutilização interna.

### Modificadores de Acesso

```typescript
class Servico {
  // Method público - acessível de qualquer lugar
  public executar(): void {
    this.preparar();
    this.processar();
    this.finalizar();
  }
  
  // Method privado - apenas dentro da classe
  private preparar(): void {
    console.log("Preparando...");
  }
  
  private processar(): void {
    console.log("Processando...");
  }
  
  private finalizar(): void {
    console.log("Finalizando...");
  }
}

const servico = new Servico();
servico.executar(); // OK - público
// servico.preparar(); // ❌ Erro: private

class ServicoAvancado extends Servico {
  // Não pode acessar methods privados da classe pai
  teste() {
    // this.preparar(); // ❌ Erro: private
  }
}
```

**Análise profunda:** `public` (padrão) expõe method externamente. `private` oculta detalhes de implementação. Encapsulamento permite mudar implementação sem afetar consumidores.

### Protected Methods

```typescript
class Animal {
  protected emitirSom(som: string): void {
    console.log(som);
  }
  
  public falar(): void {
    this.emitirSom("Som genérico");
  }
}

class Cachorro extends Animal {
  public falar(): void {
    this.emitirSom("Au au!"); // OK - protected acessível em subclasse
  }
}

class Gato extends Animal {
  public falar(): void {
    this.emitirSom("Miau!"); // OK
  }
}

const cachorro = new Cachorro();
cachorro.falar(); // "Au au!"
// cachorro.emitirSom("Test"); // ❌ Erro: protected
```

**Fundamento conceitual:** `protected` permite que subclasses acessem method, mas não código externo. Útil para lógica compartilhada em hierarquias.

### Method Overloading

```typescript
class Calculadora {
  // Overload signatures
  calcular(a: number): number;
  calcular(a: number, b: number): number;
  calcular(a: number, b: number, c: number): number;
  
  // Implementation signature
  calcular(a: number, b?: number, c?: number): number {
    if (c !== undefined) {
      return a + b! + c;
    }
    if (b !== undefined) {
      return a + b;
    }
    return a;
  }
}

const calc = new Calculadora();
console.log(calc.calcular(5)); // 5
console.log(calc.calcular(5, 3)); // 8
console.log(calc.calcular(5, 3, 2)); // 10
```

**Conceito avançado:** Method overloading permite múltiplas assinaturas. Implementação única deve lidar com todos os casos. TypeScript verifica que chamadas correspondem a alguma assinatura.

### Async Methods

```typescript
class ApiService {
  private baseUrl: string = "https://api.example.com";
  
  // Method assíncrono retorna Promise
  async buscarUsuario(id: number): Promise<Usuario> {
    const response = await fetch(`${this.baseUrl}/usuarios/${id}`);
    const data = await response.json();
    return data as Usuario;
  }
  
  // Method assíncrono com tratamento de erro
  async salvarDados(dados: any): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/dados`, {
        method: "POST",
        body: JSON.stringify(dados)
      });
    } catch (erro) {
      console.error("Erro ao salvar:", erro);
      throw erro;
    }
  }
}

type Usuario = { id: number; nome: string };

// Uso
const api = new ApiService();
api.buscarUsuario(1).then(usuario => {
  console.log(usuario.nome);
});
```

**Análise teórica:** `async` methods retornam implicitamente `Promise<T>`. Permitem usar `await` internamente. Essenciais para operações assíncronas.

### Arrow Functions vs Methods

```typescript
class Componente {
  valor: number = 10;
  
  // Method tradicional - this dinâmico
  metodoTradicional() {
    console.log(this.valor);
  }
  
  // Arrow function - this léxico
  arrowMethod = () => {
    console.log(this.valor);
  };
}

const comp = new Componente();

// Chamada normal - ambos funcionam
comp.metodoTradicional(); // 10
comp.arrowMethod(); // 10

// Extraindo referência
const metodo1 = comp.metodoTradicional;
const metodo2 = comp.arrowMethod;

// metodo1(); // ❌ Erro: this undefined
metodo2(); // ✅ 10 - this preservado
```

**Fundamento crucial:** Arrow functions como properties capturam `this` lexicamente. Methods tradicionais têm `this` dinâmico. Arrow functions úteis para callbacks, events.

### Static Methods

```typescript
class Matematica {
  // Static method - pertence à classe, não a instâncias
  static somar(a: number, b: number): number {
    return a + b;
  }
  
  static fatorial(n: number): number {
    if (n <= 1) return 1;
    return n * Matematica.fatorial(n - 1); // Chamada recursiva
  }
  
  // Não pode acessar this (não há instância)
  static teste() {
    // console.log(this.valor); // ❌ Erro
    return Matematica.somar(1, 2); // OK - chama outro static
  }
}

// Chamada sem instanciar
console.log(Matematica.somar(5, 3)); // 8
console.log(Matematica.fatorial(5)); // 120

// const m = new Matematica();
// m.somar(1, 2); // ❌ Erro: static method não existe em instância
```

**Conceito crítico:** Static methods não têm acesso a `this`. Úteis para utilidades, factories, operações que não dependem de estado de instância.

## 🎯 Aplicabilidade e Contextos

### Quando Usar Methods Públicos

```typescript
class Usuario {
  private senha: string;
  
  constructor(senha: string) {
    this.senha = senha;
  }
  
  // API pública
  public autenticar(senhaFornecida: string): boolean {
    return this.senha === senhaFornecida;
  }
}
```

**Raciocínio:** Operações que devem ser acessíveis externamente. Interface pública da classe.

### Quando Usar Methods Privados

```typescript
class Validador {
  public validarEmail(email: string): boolean {
    return this.contemArroba(email) && this.contemDominio(email);
  }
  
  private contemArroba(email: string): boolean {
    return email.includes("@");
  }
  
  private contemDominio(email: string): boolean {
    return email.split("@")[1]?.includes(".");
  }
}
```

**Raciocínio:** Decomposição de lógica complexa. Detalhes de implementação que não devem ser expostos.

### Quando Usar Static Methods

```typescript
class DateUtils {
  static formatarData(data: Date): string {
    return data.toISOString().split("T")[0];
  }
  
  static hoje(): Date {
    return new Date();
  }
}
```

**Raciocínio:** Funções utilitárias que não dependem de estado de instância.

## ⚠️ Limitações e Considerações Teóricas

### This Binding Issues

```typescript
class Botao {
  texto: string = "Clique";
  
  onClick() {
    console.log(this.texto);
  }
}

const btn = new Botao();
const handler = btn.onClick;
handler(); // ❌ this undefined!
```

**Solução:** Arrow functions ou bind:
```typescript
class Botao {
  texto: string = "Clique";
  
  onClick = () => {
    console.log(this.texto); // ✅ OK
  };
}
```

### Private é Compile-Time

Methods privados são verificados em compile-time, mas acessíveis em runtime via JavaScript.

## 🔗 Interconexões Conceituais

**Relação com Properties:** Methods acessam e modificam properties.

**Relação com Constructor:** Constructor pode chamar methods para inicialização.

**Relação com Herança:** Methods podem ser sobrescritos em subclasses.

**Relação com Interfaces:** Interfaces definem assinaturas que methods devem implementar.

## 🚀 Evolução e Próximos Conceitos

Dominar methods prepara para:
- **Getters/Setters:** Methods especiais para acesso controlado a properties
- **Abstract Methods:** Methods sem implementação que forçam implementação em subclasses
- **Decorators:** Metaprogramação aplicada a methods
- **Method Chaining:** Retornar `this` para encadear chamadas
