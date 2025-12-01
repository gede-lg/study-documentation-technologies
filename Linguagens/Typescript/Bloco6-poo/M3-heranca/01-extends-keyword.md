# Extends Keyword: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Extends keyword** (`extends`) estabelece **relação de herança** entre classes, onde classe derivada (subclasse) herda propriedades e métodos de classe base (superclasse). Conceitualmente, representa **especialização hierárquica**, onde subclasse é uma versão mais específica da classe base, herdando comportamento e podendo adicionar ou modificar funcionalidades.

Na essência, `extends` materializa o princípio de **reuso por herança** e **taxonomia de tipos**, permitindo criar hierarquias de classes que compartilham comportamento comum mas podem ter especializações únicas.

## 📋 Fundamentos

### Sintaxe Básica

```typescript
// Classe base (superclasse, classe pai)
class Animal {
  nome: string;

  constructor(nome: string) {
    this.nome = nome;
  }

  emitirSom(): string {
    return "Som genérico";
  }
}

// Classe derivada (subclasse, classe filha)
class Cachorro extends Animal {
  raca: string;

  constructor(nome: string, raca: string) {
    super(nome); // Chama constructor da classe pai
    this.raca = raca;
  }

  emitirSom(): string {
    return "Au au!";
  }
}

const dog = new Cachorro("Rex", "Labrador");
console.log(dog.nome);        // "Rex" - herdado de Animal
console.log(dog.raca);        // "Labrador" - próprio de Cachorro
console.log(dog.emitirSom()); // "Au au!" - sobrescrito
```

**Conceito-chave:** `extends` cria relação **"é um"** (is-a): Cachorro **é um** Animal.

### Herança de Membros

```typescript
class Veiculo {
  protected velocidade: number = 0;
  public marca: string;

  constructor(marca: string) {
    this.marca = marca;
  }

  public acelerar(): void {
    this.velocidade += 10;
  }

  public getVelocidade(): number {
    return this.velocidade;
  }
}

class Carro extends Veiculo {
  private numeroPortas: number;

  constructor(marca: string, portas: number) {
    super(marca);
    this.numeroPortas = portas;
  }

  // Herda: velocidade (protected), marca (public), acelerar(), getVelocidade()
  public info(): string {
    return `${this.marca} - ${this.numeroPortas} portas - ${this.velocidade} km/h`;
  }
}

const carro = new Carro("Toyota", 4);
carro.acelerar(); // ✅ Método herdado
console.log(carro.marca);          // ✅ Propriedade pública herdada
console.log(carro.getVelocidade()); // ✅ 10
```

## 🔍 Análise Conceitual

### 1. Cadeia de Herança

```typescript
class SerVivo {
  protected energia: number = 100;

  respirar(): void {
    console.log("Respirando...");
  }
}

class Animal extends SerVivo {
  protected idade: number;

  constructor(idade: number) {
    super(); // Chama constructor de SerVivo
    this.idade = idade;
  }

  mover(): void {
    this.energia -= 5; // Acessa protected de SerVivo
    console.log("Movendo...");
  }
}

class Mamifero extends Animal {
  private pelo: boolean = true;

  amamentar(): void {
    this.energia -= 10; // Acessa protected de SerVivo
    console.log("Amamentando...");
  }
}

class Cachorro extends Mamifero {
  latir(): void {
    console.log("Au au!");
    this.respirar(); // Herdado de SerVivo
    this.mover();    // Herdado de Animal
    this.amamentar(); // Herdado de Mamifero
  }
}

const dog = new Cachorro(3);
dog.latir();
// Cachorro → Mamifero → Animal → SerVivo
```

**Conceito:** Herança é transitiva - subclasse herda de toda a cadeia de ancestrais.

### 2. Tipos e Polimorfismo

```typescript
class Forma {
  calcularArea(): number {
    return 0;
  }
}

class Circulo extends Forma {
  constructor(private raio: number) {
    super();
  }

  calcularArea(): number {
    return Math.PI * this.raio ** 2;
  }
}

class Retangulo extends Forma {
  constructor(private largura: number, private altura: number) {
    super();
  }

  calcularArea(): number {
    return this.largura * this.altura;
  }
}

// Polimorfismo - variável do tipo base aceita subclasses
const formas: Forma[] = [
  new Circulo(5),
  new Retangulo(4, 6),
  new Circulo(3)
];

formas.forEach(forma => {
  console.log(forma.calcularArea()); // Chama método correto de cada subclasse
});
```

**Conceito:** Subclasse pode ser usada onde tipo base é esperado - **substituição de Liskov**.

### 3. Instanceof e Type Checking

```typescript
class Animal {
  nome: string;
  constructor(nome: string) {
    this.nome = nome;
  }
}

class Cachorro extends Animal {
  latir(): void {
    console.log("Au au!");
  }
}

class Gato extends Animal {
  miar(): void {
    console.log("Miau!");
  }
}

function fazerBarulho(animal: Animal): void {
  if (animal instanceof Cachorro) {
    animal.latir(); // TypeScript sabe que é Cachorro
  } else if (animal instanceof Gato) {
    animal.miar(); // TypeScript sabe que é Gato
  }
}

const dog = new Cachorro("Rex");
const cat = new Gato("Mimi");

console.log(dog instanceof Cachorro); // true
console.log(dog instanceof Animal);   // true - é também Animal
console.log(dog instanceof Gato);     // false
```

### 4. Abstract Classes com Extends

```typescript
abstract class Veiculo {
  protected velocidade: number = 0;

  // Método abstrato - subclasses DEVEM implementar
  abstract acelerar(): void;

  // Método concreto - herdado normalmente
  parar(): void {
    this.velocidade = 0;
  }
}

class Carro extends Veiculo {
  acelerar(): void {
    this.velocidade += 10;
  }
}

class Moto extends Veiculo {
  acelerar(): void {
    this.velocidade += 20; // Moto acelera mais rápido
  }
}

// const v = new Veiculo(); // ❌ Erro - classe abstrata
const carro = new Carro();
carro.acelerar();
```

**Conceito:** Classes abstratas definem contratos que subclasses devem cumprir.

### 5. Protected para Herança

```typescript
class ContaBancaria {
  protected saldo: number;

  constructor(saldoInicial: number) {
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
      this.saldo -= valor;
    } else {
      throw new Error("Saldo insuficiente");
    }
  }
}
```

## 🎯 Aplicabilidade

### Hierarquia de Componentes UI

```typescript
abstract class Component {
  protected elemento: HTMLElement;

  constructor(tag: string) {
    this.elemento = document.createElement(tag);
  }

  abstract render(): void;

  public mount(parent: HTMLElement): void {
    this.render();
    parent.appendChild(this.elemento);
  }
}

class Button extends Component {
  constructor(private texto: string) {
    super("button");
  }

  render(): void {
    this.elemento.textContent = this.texto;
  }
}

class Input extends Component {
  constructor(private tipo: string) {
    super("input");
  }

  render(): void {
    this.elemento.setAttribute("type", this.tipo);
  }
}
```

### Camadas de Aplicação

```typescript
abstract class Repository<T> {
  protected items: T[] = [];

  findById(id: number): T | undefined {
    return this.items.find((item: any) => item.id === id);
  }

  findAll(): T[] {
    return this.items;
  }

  abstract save(item: T): void;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

class UsuarioRepository extends Repository<Usuario> {
  save(usuario: Usuario): void {
    const existe = this.findById(usuario.id);
    if (existe) {
      // Atualiza
      const index = this.items.indexOf(existe);
      this.items[index] = usuario;
    } else {
      // Insere
      this.items.push(usuario);
    }
  }

  findByEmail(email: string): Usuario | undefined {
    return this.items.find(u => u.email === email);
  }
}
```

### Padrão Strategy com Herança

```typescript
abstract class SortStrategy {
  abstract sort(arr: number[]): number[];
}

class QuickSort extends SortStrategy {
  sort(arr: number[]): number[] {
    // Implementação quicksort
    return arr.sort((a, b) => a - b);
  }
}

class BubbleSort extends SortStrategy {
  sort(arr: number[]): number[] {
    // Implementação bubblesort
    const result = [...arr];
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result.length - 1; j++) {
        if (result[j] > result[j + 1]) {
          [result[j], result[j + 1]] = [result[j + 1], result[j]];
        }
      }
    }
    return result;
  }
}

class Sorter {
  constructor(private strategy: SortStrategy) {}

  execute(arr: number[]): number[] {
    return this.strategy.sort(arr);
  }
}
```

## ⚠️ Limitações e Considerações

### 1. Herança Única (Single Inheritance)

```typescript
class A {}
class B {}

// ❌ TypeScript não suporta herança múltipla de classes
// class C extends A, B {} // Erro

// ✅ Solução: usar interfaces para múltiplos contratos
interface IA {}
interface IB {}

class C extends A implements IA, IB {}
```

### 2. Acoplamento Forte

```typescript
// ❌ Herança cria dependência forte
class Animal {
  energia: number = 100;
}

class Cachorro extends Animal {
  // Cachorro depende completamente de Animal
  // Mudanças em Animal afetam Cachorro
}

// ✅ Composição pode ser melhor
class Cachorro {
  private energia: Energia; // Composição - menos acoplado
}
```

### 3. Favor Composition Over Inheritance

```typescript
// Herança pode levar a hierarquias complexas
class Veiculo {}
class VeiculoMotorizado extends Veiculo {}
class VeiculoEletrico extends VeiculoMotorizado {}
class CarroEletrico extends VeiculoEletrico {}

// Composição é mais flexível
class Carro {
  private motor: Motor;
  private bateria: Bateria;
}
```

## 📚 Conclusão

`extends` estabelece herança entre classes, criando relação "é um" onde subclasse herda comportamento da classe base. Permite reuso de código, polimorfismo e especialização hierárquica. É fundamental para OOP mas deve ser usado com cuidado - preferir composição quando herança criar acoplamento excessivo ou hierarquias complexas.
