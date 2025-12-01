# Herança com Prototypes: Análise Conceitual

## 🎯 Definição

**Herança com prototypes** é o mecanismo pelo qual um objeto "filho" herda propriedades e métodos de um objeto "pai" através da prototype chain. É a forma de implementar herança em JavaScript ES5, antes das classes.

```javascript
// Construtor pai
function Animal(nome) {
  this.nome = nome;
}

Animal.prototype.comer = function() {
  return `${this.nome} está comendo`;
};

// Construtor filho
function Cachorro(nome, raca) {
  Animal.call(this, nome); // Chama construtor pai
  this.raca = raca;
}

// Estabelecer herança
Cachorro.prototype = Object.create(Animal.prototype);
Cachorro.prototype.constructor = Cachorro;

// Método específico de Cachorro
Cachorro.prototype.latir = function() {
  return `${this.nome} está latindo`;
};

const rex = new Cachorro('Rex', 'Labrador');
console.log(rex.comer()); // 'Rex está comendo' (herdado)
console.log(rex.latir()); // 'Rex está latindo' (próprio)
```

## 📋 Padrão de Herança

### Passo a Passo

```javascript
// 1. Definir construtor pai
function Veiculo(tipo) {
  this.tipo = tipo;
  this.velocidade = 0;
}

Veiculo.prototype.acelerar = function(incremento) {
  this.velocidade += incremento;
  return `${this.tipo} acelerando para ${this.velocidade} km/h`;
};

// 2. Definir construtor filho
function Carro(marca, modelo) {
  Veiculo.call(this, 'Carro'); // Herdar propriedades
  this.marca = marca;
  this.modelo = modelo;
}

// 3. Estabelecer herança de prototype
Carro.prototype = Object.create(Veiculo.prototype);

// 4. Restaurar constructor
Carro.prototype.constructor = Carro;

// 5. Adicionar métodos específicos
Carro.prototype.info = function() {
  return `${this.marca} ${this.modelo}`;
};

// Uso
const carro = new Carro('Toyota', 'Corolla');
console.log(carro.acelerar(50)); // 'Carro acelerando para 50 km/h'
console.log(carro.info()); // 'Toyota Corolla'
```

## 🧠 Análise Profunda

### Por Que Object.create()?

```javascript
// ❌ ERRADO: Compartilha mesmo objeto
Cachorro.prototype = Animal.prototype;
// Modificações em Cachorro afetam Animal!

// ❌ ERRADO: Instância não deve ser prototype
Cachorro.prototype = new Animal();
// Chama construtor desnecessariamente
// Propriedades de instância viram propriedades de prototype

// ✅ CORRETO: Cria novo objeto que herda de Animal.prototype
Cachorro.prototype = Object.create(Animal.prototype);
// Herança limpa, sem efeitos colaterais
```

### Chamando Construtor Pai

```javascript
function Pessoa(nome, idade) {
  this.nome = nome;
  this.idade = idade;
}

function Estudante(nome, idade, curso) {
  // Chamar construtor pai com 'call' para inicializar propriedades
  Pessoa.call(this, nome, idade);

  // Propriedades específicas de Estudante
  this.curso = curso;
}

Estudante.prototype = Object.create(Pessoa.prototype);
Estudante.prototype.constructor = Estudante;

const aluno = new Estudante('Ana', 20, 'Engenharia');
console.log(aluno.nome); // 'Ana' (de Pessoa)
console.log(aluno.curso); // 'Engenharia' (de Estudante)
```

### Sobrescrita de Métodos

```javascript
function Animal(nome) {
  this.nome = nome;
}

Animal.prototype.falar = function() {
  return 'Animal faz som';
};

function Gato(nome) {
  Animal.call(this, nome);
}

Gato.prototype = Object.create(Animal.prototype);
Gato.prototype.constructor = Gato;

// Sobrescrever método do pai
Gato.prototype.falar = function() {
  return `${this.nome} mia: Miau!`;
};

const gato = new Gato('Whiskers');
console.log(gato.falar()); // 'Whiskers mia: Miau!' (sobrescrito)

// Ainda pode acessar método original
console.log(Animal.prototype.falar.call(gato)); // 'Animal faz som'
```

## 🔍 Exemplo Completo: Hierarquia de Formas

```javascript
// Classe base
function Forma(cor) {
  this.cor = cor;
}

Forma.prototype.descreverCor = function() {
  return `Esta forma é ${this.cor}`;
};

// Classe derivada: Retângulo
function Retangulo(cor, largura, altura) {
  Forma.call(this, cor);
  this.largura = largura;
  this.altura = altura;
}

Retangulo.prototype = Object.create(Forma.prototype);
Retangulo.prototype.constructor = Retangulo;

Retangulo.prototype.calcularArea = function() {
  return this.largura * this.altura;
};

Retangulo.prototype.descrever = function() {
  return `Retângulo ${this.descreverCor()}, ${this.largura}x${this.altura}`;
};

// Classe derivada: Círculo
function Circulo(cor, raio) {
  Forma.call(this, cor);
  this.raio = raio;
}

Circulo.prototype = Object.create(Forma.prototype);
Circulo.prototype.constructor = Circulo;

Circulo.prototype.calcularArea = function() {
  return Math.PI * this.raio * this.raio;
};

Circulo.prototype.descrever = function() {
  return `Círculo ${this.descreverCor()}, raio ${this.raio}`;
};

// Uso
const ret = new Retangulo('vermelho', 10, 5);
const circ = new Circulo('azul', 7);

console.log(ret.descrever()); // 'Retângulo Esta forma é vermelho, 10x5'
console.log(ret.calcularArea()); // 50

console.log(circ.descrever()); // 'Círculo Esta forma é azul, raio 7'
console.log(circ.calcularArea().toFixed(2)); // 153.94

// Verificar herança
console.log(ret instanceof Retangulo); // true
console.log(ret instanceof Forma); // true
console.log(circ instanceof Circulo); // true
console.log(circ instanceof Forma); // true
```

## ⚠️ Armadilhas

### 1. Esquecer call() no Construtor

```javascript
function Pai(valor) {
  this.valor = valor;
}

function Filho(valor, extra) {
  // ❌ Esqueceu Pai.call(this, valor)
  this.extra = extra;
}

Filho.prototype = Object.create(Pai.prototype);

const obj = new Filho(10, 20);
console.log(obj.valor); // undefined (não herdou propriedade!)
```

### 2. Esquecer Restaurar Constructor

```javascript
function Pai() {}
function Filho() {}

Filho.prototype = Object.create(Pai.prototype);
// ❌ Esqueceu: Filho.prototype.constructor = Filho

const obj = new Filho();
console.log(obj.constructor === Filho); // false!
console.log(obj.constructor === Pai); // true (errado!)
```

## 🔗 Comparação com ES6 Classes

```javascript
// ES5: Prototypes
function Animal(nome) {
  this.nome = nome;
}

Animal.prototype.falar = function() {
  return `${this.nome} faz som`;
};

function Cachorro(nome, raca) {
  Animal.call(this, nome);
  this.raca = raca;
}

Cachorro.prototype = Object.create(Animal.prototype);
Cachorro.prototype.constructor = Cachorro;

Cachorro.prototype.latir = function() {
  return 'Au au!';
};

// ES6: Classes (mesmo comportamento, sintaxe mais limpa)
class Animal {
  constructor(nome) {
    this.nome = nome;
  }

  falar() {
    return `${this.nome} faz som`;
  }
}

class Cachorro extends Animal {
  constructor(nome, raca) {
    super(nome);
    this.raca = raca;
  }

  latir() {
    return 'Au au!';
  }
}

// Ambos funcionam identicamente!
```

Herança com prototypes é a base do sistema OOP em JavaScript - entendê-la profundamente é essencial mesmo usando classes ES6.
