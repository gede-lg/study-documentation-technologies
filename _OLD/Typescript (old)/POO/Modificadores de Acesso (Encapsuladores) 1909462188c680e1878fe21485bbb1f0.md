# Modificadores de Acesso (Encapsuladores)

## 1. Introdução

Os **modificadores de acesso** são fundamentais para a **programação orientada a objetos** (POO), permitindo controlar a visibilidade e o acesso a propriedades e métodos de classes. Em TypeScript, os modificadores `public`, `private` e `protected` ajudam a implementar o encapsulamento, uma prática essencial para manter o código organizado, seguro e de fácil manutenção. O encapsulamento promove a ocultação de detalhes internos e define interfaces públicas bem delimitadas para a interação com objetos, facilitando a evolução e a reutilização do software.

## 2. Sumário

- [Definição e Conceitos Fundamentais](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#defini%C3%A7%C3%A3o-e-conceitos-fundamentais)
    - [O que são Modificadores de Acesso](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#o-que-s%C3%A3o-modificadores-de-acesso)
    - [Conceitos Básicos e Avançados](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#conceitos-b%C3%A1sicos-e-avan%C3%A7ados)
- [Sintaxe e Estrutura](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#sintaxe-e-estrutura)
    - [Declaração e Utilização](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#declara%C3%A7%C3%A3o-e-utiliza%C3%A7%C3%A3o)
- [Componentes Principais](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#componentes-principais)
    - [Funções, Métodos e Propriedades](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#fun%C3%A7%C3%B5es-m%C3%A9todos-e-propriedades)
    - [Interação Entre Eles](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#intera%C3%A7%C3%A3o-entre-eles)
- [Uso Avançado](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#uso-avan%C3%A7ado)
    - [Casos de Uso e Tópicos Complexos](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#casos-de-uso-e-t%C3%B3picos-complexos)
- [Exemplos de Código Otimizados](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#exemplos-de-c%C3%B3digo-otimizados)
- [Informações Adicionais](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#informa%C3%A7%C3%B5es-adicionais)
- [Referências para Estudo Independente](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#refer%C3%AAncias-para-estudo-independente)

## 3. Conteúdo Detalhado

### Definição e Conceitos Fundamentais

### O que são Modificadores de Acesso

Modificadores de acesso em TypeScript são palavras-chave utilizadas para definir a visibilidade de propriedades e métodos dentro de uma classe. Eles determinam como e de onde os elementos de uma classe podem ser acessados. Os três modificadores principais são:

- **public**: O acesso é irrestrito; propriedades e métodos marcados como `public` podem ser acessados de qualquer lugar.
- **private**: O acesso é restrito apenas à classe onde foram definidos; elementos `private` não podem ser acessados fora da classe.
- **protected**: O acesso é permitido dentro da classe e em classes derivadas (herança), mas não fora dessas.

### Conceitos Básicos e Avançados

- **Básicos**:
    - **Encapsulamento**: Ocultar detalhes internos e expor apenas o que é necessário.
    - **Modificador `public`**: Padrão para membros de classe; se nenhum modificador for especificado, o membro é considerado `public`.
- **Avançados**:
    - **Herança e `protected`**: Permite que classes derivadas acessem membros protegidos sem expor esses membros para o código externo.
    - **Implementação de APIs seguras**: Utilizando `private` e `protected` para criar interfaces bem definidas, prevenindo acesso não autorizado a partes críticas do código.

### Sintaxe e Estrutura

### Declaração e Utilização

A sintaxe para declarar modificadores de acesso em TypeScript é simples e direta. Veja os exemplos básicos:

- **Public** (explícito ou implícito):
    
    ```tsx
    class Pessoa {
      public nome: string; // explícito
      idade: number;      // implícito, considerado public por padrão
    
      constructor(nome: string, idade: number) {
        this.nome = nome;
        this.idade = idade;
      }
    
      public apresentar(): void {
        console.log(`Olá, meu nome é ${this.nome}.`);
      }
    }
    
    ```
    
- **Private**:
    
    ```tsx
    class ContaBancaria {
      private saldo: number;
    
      constructor(saldoInicial: number) {
        this.saldo = saldoInicial;
      }
    
      // Método público para acessar de forma controlada o saldo
      public consultarSaldo(): number {
        return this.saldo;
      }
    
      // Método privado para atualizar o saldo
      private atualizarSaldo(valor: number): void {
        this.saldo += valor;
      }
    }
    
    ```
    
- **Protected**:
    
    ```tsx
    class Animal {
      protected especie: string;
    
      constructor(especie: string) {
        this.especie = especie;
      }
    
      protected fazerSom(): void {
        console.log("Som genérico");
      }
    }
    
    class Cachorro extends Animal {
      constructor() {
        super("Canino");
      }
    
      public latir(): void {
        // Acessa método protected da classe base
        this.fazerSom();
        console.log("Au Au!");
      }
    }
    
    ```
    

### Componentes Principais

### Funções, Métodos e Propriedades

- **Propriedades**: Variáveis definidas dentro de uma classe que podem ter modificadores de acesso para controlar sua visibilidade.
- **Métodos**: Funções associadas a uma classe. Seus modificadores de acesso determinam se podem ser chamados de fora da classe ou apenas internamente.
- **Construtor**: Método especial utilizado para instanciar a classe. Pode receber parâmetros que definem as propriedades com os respectivos modificadores.

### Interação Entre Eles

- **Encapsulamento**: Ao definir uma propriedade como `private`, você garante que essa propriedade só possa ser manipulada através de métodos públicos ou protegidos, garantindo regras de negócio e integridade dos dados.
- **Herança**: Ao utilizar o modificador `protected`, você permite que classes derivadas tenham acesso a métodos e propriedades, permitindo a extensão da funcionalidade sem comprometer o encapsulamento completo.

### Uso Avançado

### Casos de Uso e Tópicos Complexos

- **Implementação de APIs e Bibliotecas**: Ao desenvolver bibliotecas, utilizar `private` e `protected` para ocultar a lógica interna e expor apenas métodos públicos que representem a interface de uso.
- **Padrões de Projeto**: Muitos padrões, como *Factory* ou *Singleton*, se beneficiam do encapsulamento para controlar a criação de instâncias ou a modificação do estado interno.
- **Testabilidade**: Com a definição clara de quais métodos e propriedades são públicos, a criação de testes unitários torna-se mais objetiva, garantindo que apenas a interface pública seja testada, preservando o encapsulamento.

## 4. Exemplos de Código Otimizados

### Exemplo 1: Uso Básico dos Modificadores

```tsx
class Veiculo {
  public marca: string;
  private velocidadeAtual: number = 0;
  protected modelo: string;

  constructor(marca: string, modelo: string) {
    this.marca = marca;
    this.modelo = modelo;
  }

  public acelerar(incremento: number): void {
    // Método público para modificar o estado interno
    this.velocidadeAtual += incremento;
    console.log(`Velocidade atual: ${this.velocidadeAtual} km/h`);
  }

  public obterVelocidade(): number {
    return this.velocidadeAtual;
  }
}

const carro = new Veiculo("Toyota", "Corolla");
carro.acelerar(20);
console.log(carro.marca);        // Acesso permitido
// console.log(carro.velocidadeAtual); // Erro: propriedade privada

```

### Exemplo 2: Herança com Protected

```tsx
class Funcionario {
  protected nome: string;
  protected salario: number;

  constructor(nome: string, salario: number) {
    this.nome = nome;
    this.salario = salario;
  }

  public mostrarDados(): void {
    console.log(`Nome: ${this.nome}, Salário: ${this.salario}`);
  }
}

class Gerente extends Funcionario {
  private departamento: string;

  constructor(nome: string, salario: number, departamento: string) {
    super(nome, salario);
    this.departamento = departamento;
  }

  public mostrarDados(): void {
    // Acessa membros protected da classe base
    console.log(`Nome: ${this.nome}, Salário: ${this.salario}, Departamento: ${this.departamento}`);
  }
}

const gerente = new Gerente("Ana", 5000, "TI");
gerente.mostrarDados();

```

### Exemplo 3: Controle Avançado com Métodos Privados

```tsx
class Banco {
  private saldo: number;

  constructor(saldoInicial: number) {
    this.saldo = saldoInicial;
  }

  public depositar(valor: number): void {
    if (valor > 0) {
      this.atualizarSaldo(valor);
      console.log(`Depositado: ${valor}. Novo saldo: ${this.saldo}`);
    }
  }

  public sacar(valor: number): void {
    if (valor > 0 && valor <= this.saldo) {
      this.atualizarSaldo(-valor);
      console.log(`Sacado: ${valor}. Novo saldo: ${this.saldo}`);
    }
  }

  // Método privado para controle interno do saldo
  private atualizarSaldo(valor: number): void {
    this.saldo += valor;
  }
}

const minhaConta = new Banco(1000);
minhaConta.depositar(500);
minhaConta.sacar(300);

```

## 5. Informações Adicionais

- **Padrão de Projeto Encapsulamento**: A correta aplicação dos modificadores de acesso garante a integridade dos dados e reduz o risco de alterações não autorizadas.
- **Interoperabilidade com JavaScript**: TypeScript compila para JavaScript, mas os modificadores de acesso não são aplicados em tempo de execução; eles servem principalmente para a verificação durante a compilação.
- **Boas Práticas**:
    - Utilize `private` quando não deseja expor a lógica interna.
    - Use `protected` para permitir acesso em classes derivadas sem expor ao mundo externo.
    - Prefira a imutabilidade e métodos de acesso (getters e setters) para controlar a leitura e escrita de propriedades críticas.

## 6. Referências para Estudo Independente

- [Documentação Oficial do TypeScript - Classes](https://www.typescriptlang.org/docs/handbook/classes.html)
- [Documentação Oficial do TypeScript - Modificadores de Acesso](https://www.typescriptlang.org/docs/handbook/classes.html#public-private-and-protected-modifiers)
- [Artigo: Understanding Access Modifiers in TypeScript](https://medium.com/@rohitjain/access-modifiers-in-typescript-72e1f5d345c3)
- [Livro: "Programming TypeScript" por Boris Cherny](https://www.oreilly.com/library/view/programming-typescript/9781492037644/)
- [Tutorial: TypeScript Classes and Access Modifiers](https://www.tutorialspoint.com/typescript/typescript_classes.htm)

---

Este guia detalhado cobre os conceitos fundamentais e avançados dos modificadores de acesso em TypeScript, oferecendo uma visão completa que ajudará tanto iniciantes quanto desenvolvedores mais experientes a implementar um código robusto e seguro.