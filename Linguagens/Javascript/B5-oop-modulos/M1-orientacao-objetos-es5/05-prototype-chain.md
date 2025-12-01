# Prototype Chain (Cadeia de Protótipos): Análise Conceitual Profunda

## 🎯 Introdução e Definição

A **prototype chain** (cadeia de protótipos) é o mecanismo fundamental de **herança** em JavaScript. É uma cadeia de links entre objetos onde, se uma propriedade não é encontrada em um objeto, JavaScript automaticamente procura no prototype do objeto, depois no prototype do prototype, e assim por diante, até chegar a `Object.prototype` ou `null`.

```javascript
function Animal(nome) {
  this.nome = nome;
}

Animal.prototype.falar = function() {
  console.log(`${this.nome} faz um som`);
};

const cachorro = new Animal('Rex');

// Quando chamamos cachorro.falar():
// 1. Procura 'falar' em cachorro → Não encontra
// 2. Procura em cachorro.__proto__ (Animal.prototype) → Encontra!
cachorro.falar(); // 'Rex faz um som'
```

## 📋 Como Funciona a Cadeia

### Estrutura da Chain

```
instância
   ↓ __proto__
Constructor.prototype
   ↓ __proto__
Object.prototype
   ↓ __proto__
null (fim da cadeia)
```

### Exemplo Visual

```javascript
function Pessoa(nome) {
  this.nome = nome;
}

Pessoa.prototype.cumprimentar = function() {
  return `Olá, ${this.nome}`;
};

const joao = new Pessoa('João');

// Cadeia de joao:
console.log(joao.__proto__ === Pessoa.prototype); // true
console.log(Pessoa.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null); // true

// Busca na cadeia:
console.log(joao.nome); // Encontrado em joao
console.log(joao.cumprimentar()); // Encontrado em Pessoa.prototype
console.log(joao.toString()); // Encontrado em Object.prototype
```

## 🧠 Fundamentos Teóricos

### Lookup de Propriedades

Quando você acessa `objeto.propriedade`, JavaScript:

1. **Verifica no próprio objeto:** Se encontrar, retorna
2. **Sobe para `__proto__`:** Verifica no prototype
3. **Continua subindo:** Repete até encontrar ou chegar a `null`
4. **Retorna `undefined`:** Se não encontrar em lugar nenhum

```javascript
function Veiculo(tipo) {
  this.tipo = tipo;
}

Veiculo.prototype.descrever = function() {
  return `Este é um ${this.tipo}`;
};

const carro = new Veiculo('Carro');

// 1. carro.tipo
//    → Encontra em carro (propriedade própria)

// 2. carro.descrever()
//    → Não encontra em carro
//    → Procura em carro.__proto__ (Veiculo.prototype)
//    → Encontra!

// 3. carro.toString()
//    → Não encontra em carro
//    → Não encontra em Veiculo.prototype
//    → Procura em Object.prototype
//    → Encontra!

// 4. carro.naoExiste
//    → Não encontra em nenhum lugar
//    → Retorna undefined
```

### Exemplo Completo: Hierarquia

```javascript
// Nível 1: Object.prototype (topo da cadeia)
console.log(Object.prototype); // { toString, valueOf, hasOwnProperty, ... }

// Nível 2: Constructor.prototype
function Livro(titulo, autor) {
  this.titulo = titulo;
  this.autor = autor;
}

Livro.prototype.info = function() {
  return `${this.titulo} por ${this.autor}`;
};

// Nível 3: Instância
const livro = new Livro('1984', 'George Orwell');

// Navegando a cadeia:
console.log(livro.titulo); // Propriedade própria
console.log(livro.info()); // Herdado de Livro.prototype
console.log(livro.toString()); // Herdado de Object.prototype

// Verificando cadeia:
console.log(livro.__proto__ === Livro.prototype); // true
console.log(Livro.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null); // true (fim)
```

## 🔍 Análise Profunda

### Shadowing (Sombreamento)

Propriedades em níveis inferiores "sombreiam" propriedades com mesmo nome em níveis superiores:

```javascript
function Base() {}

Base.prototype.nome = 'Base';
Base.prototype.valor = 100;

const obj = new Base();

console.log(obj.nome); // 'Base' (de Base.prototype)
console.log(obj.valor); // 100 (de Base.prototype)

// Criar propriedade própria (shadow)
obj.nome = 'Instância';

console.log(obj.nome); // 'Instância' (propriedade própria, sombreia Base.prototype)
console.log(obj.valor); // 100 (ainda de Base.prototype)

delete obj.nome;
console.log(obj.nome); // 'Base' (voltou para Base.prototype)
```

### Performance e Cadeia Longa

```javascript
// ❌ Cadeia muito longa = lookup mais lento
function A() {}
A.prototype.metodo = function() {};

function B() {}
B.prototype = new A();

function C() {}
C.prototype = new B();

function D() {}
D.prototype = new C();

const obj = new D();

// obj.metodo() precisa percorrer 4 níveis:
// obj → D.prototype → C.prototype → B.prototype → A.prototype
```

**Boa prática:** Evite cadeias muito profundas (geralmente 2-3 níveis é ideal).

### Modificação Dinâmica

Prototype chain é **dinâmico** - mudanças no prototype afetam todas instâncias:

```javascript
function Contador() {
  this.valor = 0;
}

const c1 = new Contador();
const c2 = new Contador();

// Adicionar método após criar instâncias
Contador.prototype.incrementar = function() {
  this.valor++;
};

// Instâncias antigas ganham novo método!
c1.incrementar();
c2.incrementar();

console.log(c1.valor); // 1
console.log(c2.valor); // 1
```

## ⚠️ Considerações

### Não Modificar Object.prototype

```javascript
// ❌ NUNCA faça isso!
Object.prototype.minhaFuncao = function() {
  return 'algo';
};

// Agora TODOS os objetos têm minhaFuncao
const obj = {};
console.log(obj.minhaFuncao()); // 'algo'

// Polui namespace global e causa conflitos
```

### Verificação de Propriedade Própria

```javascript
function Pessoa(nome) {
  this.nome = nome;
}

Pessoa.prototype.tipo = 'Humano';

const pessoa = new Pessoa('Ana');

console.log(pessoa.nome); // 'Ana'
console.log(pessoa.tipo); // 'Humano'

// Distinguir própria vs herdada:
console.log(pessoa.hasOwnProperty('nome')); // true (própria)
console.log(pessoa.hasOwnProperty('tipo')); // false (herdada)
```

## 🔗 Interconexões

- **Function Constructors:** Criam objetos com prototype link
- **new operator:** Estabelece link `__proto__`
- **Object.prototype:** Topo de toda cadeia
- **Herança:** Implementada via prototype chain
- **instanceof:** Verifica presença na cadeia

## 🚀 Conclusão

Prototype chain é o **coração da herança em JavaScript**. Entender profundamente como a cadeia funciona é essencial para:
- Dominar herança em JavaScript
- Otimizar performance
- Evitar bugs sutis com propriedades herdadas
- Compreender como classes ES6 funcionam internamente

A cadeia de protótipos torna JavaScript único - é herança **baseada em delegação**, não em cópia de propriedades.
