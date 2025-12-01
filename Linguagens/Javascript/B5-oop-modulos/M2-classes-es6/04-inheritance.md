# Herança com Extends e Super: Reutilização e Hierarquia de Classes

## 🎯 Introdução e Definição

### Definição Conceitual

**Herança** é o mecanismo onde uma classe (subclasse/child) herda propriedades e métodos de outra classe (superclasse/parent), permitindo **reutilização de código** e criação de **hierarquias**.

**Palavras-chave:**

- **`extends`:** Define herança (`class Filho extends Pai`)
- **`super`:** Referencia a classe pai (chamar constructor ou métodos)

**Sintaxe básica:**

```javascript
class Animal {
    constructor(nome) {
        this.nome = nome;
    }
    
    comer() {
        console.log(`${this.nome} está comendo`);
    }
}

// Cachorro HERDA de Animal
class Cachorro extends Animal {
    constructor(nome, raca) {
        super(nome);  // Chama constructor de Animal
        this.raca = raca;
    }
    
    latir() {
        console.log('Au au!');
    }
}

const dog = new Cachorro('Rex', 'Labrador');
dog.comer();  // "Rex está comendo" (herdado de Animal)
dog.latir();  // "Au au!" (próprio de Cachorro)
```

**Características:**

- **Reutilização:** Cachorro usa código de Animal
- **Especialização:** Cachorro adiciona `latir()` e `raca`
- **Hierarquia:** Animal → Cachorro (relação "é um")
- **Sobrescrita:** Subclasse pode substituir método do pai

### Contexto Histórico e Motivação

**Era pré-ES6:** Herança via prototype chain (complexo)

```javascript
// ES5 - Herança prototípica
function Animal(nome) {
    this.nome = nome;
}

Animal.prototype.comer = function() {
    console.log(this.nome + ' está comendo');
};

function Cachorro(nome, raca) {
    Animal.call(this, nome);  // "super"
    this.raca = raca;
}

// Estabelecer herança
Cachorro.prototype = Object.create(Animal.prototype);
Cachorro.prototype.constructor = Cachorro;

Cachorro.prototype.latir = function() {
    console.log('Au au!');
};
```

**Complexo, verboso, propenso a erros.**

**ES6 (2015):** `extends` e `super` explícitos

```javascript
class Animal {
    constructor(nome) {
        this.nome = nome;
    }
    
    comer() {
        console.log(`${this.nome} está comendo`);
    }
}

class Cachorro extends Animal {
    constructor(nome, raca) {
        super(nome);
        this.raca = raca;
    }
    
    latir() {
        console.log('Au au!');
    }
}
```

**Muito mais claro e conciso!**

**Motivações principais:**

1. **Clareza:** `extends` explícita a relação de herança
2. **Reutilização:** Não repetir código de Animal em Cachorro
3. **Hierarquia:** Modelar relações "é um" (Cachorro **é um** Animal)
4. **Polimorfismo:** Sobrescrever métodos mantendo interface
5. **Manutenibilidade:** Mudanças em Animal afetam subclasses

### Problema Fundamental que Resolve

**Problema:** Como **reutilizar código** e criar **hierarquias de tipos** relacionados sem duplicação?

**Sem herança (duplicação):**

```javascript
class Cachorro {
    constructor(nome, raca) {
        this.nome = nome;
        this.raca = raca;
    }
    
    comer() {
        console.log(`${this.nome} está comendo`);
    }
    
    latir() {
        console.log('Au au!');
    }
}

class Gato {
    constructor(nome, cor) {
        this.nome = nome;
        this.cor = cor;
    }
    
    // DUPLICADO de Cachorro!
    comer() {
        console.log(`${this.nome} está comendo`);
    }
    
    miar() {
        console.log('Miau!');
    }
}

// comer() repetido em ambos
```

**Com herança (reutilização):**

```javascript
class Animal {
    constructor(nome) {
        this.nome = nome;
    }
    
    comer() {
        console.log(`${this.nome} está comendo`);
    }
}

class Cachorro extends Animal {
    constructor(nome, raca) {
        super(nome);
        this.raca = raca;
    }
    
    latir() {
        console.log('Au au!');
    }
}

class Gato extends Animal {
    constructor(nome, cor) {
        super(nome);
        this.cor = cor;
    }
    
    miar() {
        console.log('Miau!');
    }
}

// comer() definido UMA VEZ em Animal
```

**Benefícios:**
- **Sem duplicação:** `comer()` em um lugar só
- **Manutenção:** Mudar `comer()` afeta todos
- **Hierarquia:** Modelar relação "é um"
- **Polimorfismo:** Cachorro e Gato podem ser tratados como Animal

### Importância no Ecossistema

Herança é **fundamental** porque:

- **Frameworks:** React (`Component` extends `React.Component`), Angular
- **DOM API:** `HTMLElement` extends `Element` extends `Node`
- **Error handling:** `TypeError` extends `Error`, `RangeError` extends `Error`
- **Design patterns:** Template Method, Strategy
- **Bibliotecas:** Axios, Express (classes base)
- **POO:** Princípio DRY (Don't Repeat Yourself)

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Extends:** Define herança (`class Filho extends Pai`)
2. **Super():** Chama constructor do pai (obrigatório se houver constructor)
3. **Super.metodo():** Chama método do pai
4. **Sobrescrita:** Subclasse pode substituir método do pai
5. **Prototype chain:** Internamente usa cadeia de protótipos

### Pilares Fundamentais

- **Reutilização:** Código do pai disponível no filho
- **Hierarquia:** Relação "é um" (Cachorro **é um** Animal)
- **Polimorfismo:** Sobrescrever métodos mantendo interface
- **Super:** Acessar funcionalidade do pai
- **Especialização:** Filho adiciona funcionalidade específica

### Visão Geral das Nuances

- **Super() obrigatório:** Se subclasse tem constructor, deve chamar `super()`
- **Super() primeiro:** `super()` antes de usar `this`
- **Super.metodo():** Chamar método do pai
- **Static herança:** Métodos estáticos também são herdados
- **Instanceof:** Instância de filho é instanceof do pai

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Extends = Prototype Chain

```javascript
class Animal {
    comer() {
        console.log('comendo');
    }
}

class Cachorro extends Animal {
    latir() {
        console.log('au au');
    }
}

const dog = new Cachorro();

// Prototype chain:
// dog -> Cachorro.prototype -> Animal.prototype -> Object.prototype
console.log(dog.__proto__ === Cachorro.prototype);  // true
console.log(Cachorro.prototype.__proto__ === Animal.prototype);  // true
```

`extends` estabelece cadeia de protótipos.

#### Super() = Chamada ao Constructor Pai

```javascript
class Animal {
    constructor(nome) {
        this.nome = nome;
    }
}

class Cachorro extends Animal {
    constructor(nome, raca) {
        // super(nome) é equivalente a:
        // Animal.call(this, nome)
        super(nome);
        this.raca = raca;
    }
}
```

`super()` executa constructor do pai com contexto `this` correto.

### Princípios Conceituais

#### Super() Obrigatório

```javascript
class Pai {
    constructor(x) {
        this.x = x;
    }
}

class Filho extends Pai {
    constructor(x, y) {
        // ❌ Erro se não chamar super()!
        // this.y = y;  // ReferenceError: Must call super constructor
        
        super(x);  // ✅ Obrigatório
        this.y = y;
    }
}
```

Se subclasse tem `constructor`, **deve** chamar `super()`.

#### Super() Antes de This

```javascript
class Pai {
    constructor(x) {
        this.x = x;
    }
}

class Filho extends Pai {
    constructor(x, y) {
        // ❌ Erro: this antes de super()
        // this.y = y;  // ReferenceError
        
        super(x);  // ✅ Super primeiro
        this.y = y;  // ✅ Agora pode usar this
    }
}
```

`super()` inicializa `this`, então **deve vir antes** de usar `this`.

#### Sobrescrita de Métodos

```javascript
class Animal {
    fazerSom() {
        console.log('Som genérico');
    }
}

class Cachorro extends Animal {
    // Sobrescrever método do pai
    fazerSom() {
        console.log('Au au!');
    }
}

const dog = new Cachorro();
dog.fazerSom();  // "Au au!" (versão de Cachorro)
```

Subclasse pode **substituir** método do pai.

---

## 🔍 Análise Conceitual Profunda

### Herança Básica

```javascript
class Veiculo {
    constructor(marca) {
        this.marca = marca;
    }
    
    ligar() {
        console.log(`${this.marca} ligado`);
    }
}

class Carro extends Veiculo {
    constructor(marca, modelo) {
        super(marca);  // Chama Veiculo(marca)
        this.modelo = modelo;
    }
    
    acelerar() {
        console.log(`${this.marca} ${this.modelo} acelerando`);
    }
}

const carro = new Carro('Toyota', 'Corolla');
carro.ligar();     // "Toyota ligado" (herdado)
carro.acelerar();  // "Toyota Corolla acelerando" (próprio)
```

### Super() no Constructor

```javascript
class Usuario {
    constructor(nome, email) {
        this.nome = nome;
        this.email = email;
        this.ativo = true;
    }
}

class Admin extends Usuario {
    constructor(nome, email, permissoes) {
        // super() DEVE ser primeiro
        super(nome, email);
        
        // Adicionar propriedades específicas
        this.permissoes = permissoes;
        this.nivel = 'admin';
    }
}

const admin = new Admin('João', 'joao@admin.com', ['read', 'write', 'delete']);
console.log(admin.nome);        // "João" (de Usuario)
console.log(admin.permissoes);  // ["read", "write", "delete"] (de Admin)
```

### Sobrescrita com Super.metodo()

```javascript
class Pessoa {
    constructor(nome) {
        this.nome = nome;
    }
    
    apresentar() {
        console.log(`Olá, sou ${this.nome}`);
    }
}

class Desenvolvedor extends Pessoa {
    constructor(nome, linguagem) {
        super(nome);
        this.linguagem = linguagem;
    }
    
    // Sobrescrever mantendo funcionalidade do pai
    apresentar() {
        super.apresentar();  // Chamar método do pai
        console.log(`Programo em ${this.linguagem}`);
    }
}

const dev = new Desenvolvedor('Ana', 'JavaScript');
dev.apresentar();
// "Olá, sou Ana" (de Pessoa via super)
// "Programo em JavaScript" (de Desenvolvedor)
```

### Hierarquia Multinível

```javascript
class SerVivo {
    constructor(nome) {
        this.nome = nome;
    }
    
    respirar() {
        console.log(`${this.nome} respirando`);
    }
}

class Animal extends SerVivo {
    constructor(nome, tipo) {
        super(nome);
        this.tipo = tipo;
    }
    
    mover() {
        console.log(`${this.nome} se movendo`);
    }
}

class Mamifero extends Animal {
    constructor(nome, habitat) {
        super(nome, 'mamífero');
        this.habitat = habitat;
    }
    
    amamentar() {
        console.log(`${this.nome} amamentando`);
    }
}

const baleia = new Mamifero('Baleia Azul', 'oceano');
baleia.respirar();   // "Baleia Azul respirando" (de SerVivo)
baleia.mover();      // "Baleia Azul se movendo" (de Animal)
baleia.amamentar();  // "Baleia Azul amamentando" (de Mamifero)
```

### Instanceof com Herança

```javascript
class Animal {}
class Cachorro extends Animal {}
class Gato extends Animal {}

const dog = new Cachorro();
const cat = new Gato();

console.log(dog instanceof Cachorro);  // true
console.log(dog instanceof Animal);    // true (herança!)
console.log(dog instanceof Gato);      // false

console.log(cat instanceof Gato);      // true
console.log(cat instanceof Animal);    // true
console.log(cat instanceof Cachorro);  // false
```

### Sobrescrita Completa

```javascript
class Forma {
    calcularArea() {
        throw new Error('Método abstrato - deve ser implementado');
    }
}

class Retangulo extends Forma {
    constructor(largura, altura) {
        super();
        this.largura = largura;
        this.altura = altura;
    }
    
    // Implementar método abstrato
    calcularArea() {
        return this.largura * this.altura;
    }
}

class Circulo extends Forma {
    constructor(raio) {
        super();
        this.raio = raio;
    }
    
    // Implementar método abstrato
    calcularArea() {
        return Math.PI * this.raio ** 2;
    }
}

const ret = new Retangulo(10, 5);
const circ = new Circulo(7);

console.log(ret.calcularArea());   // 50
console.log(circ.calcularArea());  // 153.93804002589985
```

### Herança de Métodos Estáticos

```javascript
class Animal {
    static tipo = 'Ser vivo';
    
    static descrever() {
        console.log(`Tipo: ${this.tipo}`);
    }
}

class Cachorro extends Animal {
    static tipo = 'Mamífero';  // Sobrescrever
}

Animal.descrever();    // "Tipo: Ser vivo"
Cachorro.descrever();  // "Tipo: Mamífero" (herdado e sobrescrito)
```

### Proteger Propriedades do Pai

```javascript
class ContaBancaria {
    constructor(saldo) {
        this._saldo = saldo;  // "Protegido" (convenção)
    }
    
    depositar(valor) {
        this._saldo += valor;
    }
    
    getSaldo() {
        return this._saldo;
    }
}

class ContaPoupanca extends ContaBancaria {
    constructor(saldo, taxaRendimento) {
        super(saldo);
        this.taxaRendimento = taxaRendimento;
    }
    
    aplicarRendimento() {
        // Acessar propriedade "protegida" do pai
        const rendimento = this._saldo * this.taxaRendimento;
        this.depositar(rendimento);
    }
}

const poupanca = new ContaPoupanca(1000, 0.05);
poupanca.aplicarRendimento();
console.log(poupanca.getSaldo());  // 1050
```

### Validação no Constructor Pai

```javascript
class Produto {
    constructor(nome, preco) {
        if (preco < 0) {
            throw new Error('Preço não pode ser negativo');
        }
        
        this.nome = nome;
        this.preco = preco;
    }
}

class ProdutoDigital extends Produto {
    constructor(nome, preco, tamanhoMB) {
        super(nome, preco);  // Validação do pai executada
        this.tamanhoMB = tamanhoMB;
    }
}

// ❌ Erro: validação do pai falha
// const prod = new ProdutoDigital('Ebook', -10, 5);

// ✅ OK
const prod = new ProdutoDigital('Ebook', 29.90, 5);
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Herança

**Use quando:**

1. **Relação "é um":** Cachorro **é um** Animal
2. **Reutilização de código:** Evitar duplicação
3. **Hierarquia clara:** Estrutura de tipos relacionados
4. **Polimorfismo:** Tratamento uniforme de tipos relacionados
5. **Especialização:** Adicionar funcionalidade específica

**Exemplo:**

```javascript
// ✅ Relação "é um"
class Veiculo {}
class Carro extends Veiculo {}  // Carro É UM Veículo

// ✅ Reutilização
class Usuario {
    autenticar() { /* ... */ }
}
class Admin extends Usuario {
    // Reutilizar autenticar() de Usuario
}
```

### Quando NÃO Usar Herança

**Evite quando:**

1. **Relação "tem um":** Composição é melhor
2. **Hierarquia profunda:** Complexidade excessiva
3. **Múltiplas heranças:** JavaScript não suporta (use composição)
4. **Sem relação clara:** Forçar herança sem motivo

**Exemplo:**

```javascript
// ❌ Relação "tem um" - NÃO use herança
class Carro extends Motor {}  // Carro NÃO É UM Motor

// ✅ Use composição
class Carro {
    constructor() {
        this.motor = new Motor();  // Carro TEM UM Motor
    }
}
```

### Patterns Comuns

#### Template Method Pattern

```javascript
class RelatorioBase {
    gerar() {
        this.cabecalho();
        this.corpo();
        this.rodape();
    }
    
    cabecalho() {
        console.log('=== RELATÓRIO ===');
    }
    
    corpo() {
        throw new Error('Implementar em subclasse');
    }
    
    rodape() {
        console.log(`Gerado em ${new Date()}`);
    }
}

class RelatorioVendas extends RelatorioBase {
    corpo() {
        console.log('Vendas do mês: R$ 10.000');
    }
}

const rel = new RelatorioVendas();
rel.gerar();
// === RELATÓRIO ===
// Vendas do mês: R$ 10.000
// Gerado em ...
```

---

## ⚠️ Limitações e Considerações Teóricas

### Super() Obrigatório

```javascript
class Pai {
    constructor(x) {
        this.x = x;
    }
}

class Filho extends Pai {
    constructor(x, y) {
        // ❌ Esquecer super() = erro
        // this.y = y;  // ReferenceError
        
        super(x);  // ✅ Obrigatório
        this.y = y;
    }
}
```

### Super() Antes de This

```javascript
class Filho extends Pai {
    constructor(x) {
        // ❌ Ordem errada
        // this.y = 10;  // ReferenceError
        // super(x);
        
        // ✅ Ordem correta
        super(x);
        this.y = 10;
    }
}
```

### Sem Múltipla Herança

```javascript
class A {}
class B {}

// ❌ Não existe em JavaScript
// class C extends A, B {}  // Syntax Error

// ✅ Use composição ou mixins
class C extends A {
    constructor() {
        super();
        Object.assign(this, new B());
    }
}
```

### Hierarquia Profunda = Complexidade

```javascript
// ❌ Evite hierarquias muito profundas
class A {}
class B extends A {}
class C extends B {}
class D extends C {}
class E extends D {}
class F extends E {}  // Muito profundo!

// ✅ Prefira composição para complexidade
```

---

## 🔗 Interconexões Conceituais

### Relação com Prototypes

```javascript
class Animal {
    comer() {
        console.log('comendo');
    }
}

class Cachorro extends Animal {}

const dog = new Cachorro();

// Prototype chain
console.log(dog.__proto__ === Cachorro.prototype);  // true
console.log(Cachorro.prototype.__proto__ === Animal.prototype);  // true
```

### Relação com Instanceof

```javascript
class Animal {}
class Cachorro extends Animal {}

const dog = new Cachorro();

console.log(dog instanceof Cachorro);  // true
console.log(dog instanceof Animal);    // true (herança!)
console.log(dog instanceof Object);    // true (tudo é Object)
```

### Relação com Polimorfismo

```javascript
class Animal {
    fazerSom() {
        console.log('Som');
    }
}

class Cachorro extends Animal {
    fazerSom() {
        console.log('Au au');
    }
}

class Gato extends Animal {
    fazerSom() {
        console.log('Miau');
    }
}

// Polimorfismo - tratamento uniforme
const animais = [new Cachorro(), new Gato()];
animais.forEach(a => a.fazerSom());
// "Au au"
// "Miau"
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. Class Declarations/Expressions
2. Constructor Method
3. Static Methods/Fields
4. **Inheritance (extends/super)** (você está aqui)
5. **Private Fields (#)** (encapsulamento)
6. Getters/Setters

### Preparação para Private Fields

Herança permite acesso a propriedades do pai, mas **private fields** mudam isso:

```javascript
class Pai {
    #privado = 'secreto';  // Private field (próximo tópico)
    
    getPrivado() {
        return this.#privado;
    }
}

class Filho extends Pai {
    acessar() {
        // ❌ Não pode acessar diretamente
        // return this.#privado;  // SyntaxError
        
        // ✅ Apenas via método público do pai
        return this.getPrivado();
    }
}
```

Próximo: **Private Fields (#)** para encapsulamento real.

---

## 📚 Conclusão

**Herança com extends e super** permite criar hierarquias de classes, reutilizando código e modelando relações "é um".

**Conceitos essenciais:**
- **Extends:** Define herança (`class Filho extends Pai`)
- **Super():** Chama constructor do pai (obrigatório se houver constructor)
- **Super() primeiro:** Antes de usar `this` em constructor
- **Super.metodo():** Chama método do pai
- **Sobrescrita:** Subclasse pode substituir método do pai
- **Prototype chain:** Internamente usa cadeia de protótipos
- **Instanceof:** Instância de filho é instanceof do pai
- **Reutilização:** Código do pai disponível no filho
- **Hierarquia:** Modelar relação "é um"
- **Polimorfismo:** Tratamento uniforme de tipos relacionados

Dominar herança é essencial para **POO, design patterns e arquitetura de código escalável**.
