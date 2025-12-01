# Class Declarations e Class Expressions: Sintaxe e Uso

## 🎯 Introdução e Definição

### Definição Conceitual

**Classes em ES6** são **syntax sugar** sobre o sistema de prototypes do JavaScript, fornecendo uma sintaxe **mais limpa e familiar** para criar objetos e implementar herança. Apesar da sintaxe parecer Orientação a Objetos tradicional (Java, C#), internamente JavaScript **ainda usa prototypes**.

**Class declaration:** Define classe usando palavra-chave `class` como statement.

**Class expression:** Define classe como expressão, podendo ser nomeada ou anônima.

**Sintaxe básica:**

```javascript
// CLASS DECLARATION
class Pessoa {
    constructor(nome, idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    saudar() {
        console.log(`Olá, meu nome é ${this.nome}`);
    }
}

// CLASS EXPRESSION (anônima)
const Animal = class {
    constructor(especie) {
        this.especie = especie;
    }
    
    emitirSom() {
        console.log('Som genérico');
    }
};

// CLASS EXPRESSION (nomeada)
const Carro = class Veiculo {
    constructor(marca) {
        this.marca = marca;
    }
};
```

**Diferença fundamental:** Declarations são **hoisted** (mas não inicializadas), expressions seguem regras de variáveis.

### Contexto Histórico e Motivação

**Era pré-ES6:** Orientação a Objetos com function constructors

```javascript
// ES5 - Function constructor
function Pessoa(nome, idade) {
    this.nome = nome;
    this.idade = idade;
}

Pessoa.prototype.saudar = function() {
    console.log('Olá, meu nome é ' + this.nome);
};

var pessoa1 = new Pessoa('João', 30);
```

**Problemas:**
- **Sintaxe confusa:** `function` não indica intenção de classe
- **Prototype manual:** Métodos adicionados via `.prototype`
- **Não familiar:** Desenvolvedores de outras linguagens estranhavam
- **Herança complexa:** `Object.create()`, manipulação de prototypes

**ES6 Classes (2015):** Syntax sugar elegante

```javascript
// ES6 - Class
class Pessoa {
    constructor(nome, idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    saudar() {
        console.log(`Olá, meu nome é ${this.nome}`);
    }
}

const pessoa1 = new Pessoa('João', 30);
```

**Melhorias:**
- **Sintaxe clara:** `class` indica intenção
- **Métodos inline:** Definidos diretamente no corpo da classe
- **Familiar:** Parece Java/C#/Python
- **Herança simples:** `extends` e `super` built-in

**Motivações principais:**

1. **Legibilidade:** Código OO mais claro e estruturado
2. **Familiaridade:** Facilita transição de outras linguagens
3. **Padronização:** Forma canônica de criar "classes"
4. **Herança:** `extends` simplifica hierarquias
5. **Tooling:** Editores entendem melhor estrutura de classes

### Problema Fundamental que Resolve

**Problema:** JavaScript sempre teve OO via prototypes, mas sintaxe era **não-intuitiva** para padrões tradicionais de classes.

**Antes - ES5 (complexo):**

```javascript
// Constructor
function Animal(nome) {
    this.nome = nome;
}

// Métodos no prototype
Animal.prototype.comer = function() {
    console.log(this.nome + ' está comendo');
};

// Herança - MUITO verboso
function Cachorro(nome, raca) {
    Animal.call(this, nome);  // Chamar constructor pai
    this.raca = raca;
}

// Configurar herança
Cachorro.prototype = Object.create(Animal.prototype);
Cachorro.prototype.constructor = Cachorro;

// Adicionar método
Cachorro.prototype.latir = function() {
    console.log('Au au!');
};

var rex = new Cachorro('Rex', 'Labrador');
rex.comer();  // "Rex está comendo"
rex.latir();  // "Au au!"
```

**Complexo, propenso a erros!**

**Depois - ES6 (simples):**

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
        super(nome);  // Chamar constructor pai
        this.raca = raca;
    }
    
    latir() {
        console.log('Au au!');
    }
}

const rex = new Cachorro('Rex', 'Labrador');
rex.comer();  // "Rex está comendo"
rex.latir();  // "Au au!"
```

**Muito mais claro e conciso!**

### Importância no Ecossistema

Classes ES6 são **fundamentais** porque:

- **Padrão moderno:** Todo código OO moderno usa classes
- **Frameworks:** React (class components), Angular, frameworks usam classes
- **TypeScript:** Classes são centrais (com tipos adicionais)
- **Bibliotecas:** jQuery, Lodash migraram para classes internamente
- **Tooling:** Melhor autocomplete, refactoring, type checking
- **Universalidade:** Código compartilhável entre frontend/backend (Node.js)

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Syntax sugar:** Classes são açúcar sintático sobre prototypes
2. **Constructor:** Método especial para inicialização
3. **Métodos:** Funções definidas no corpo da classe (vão para prototype)
4. **Hoisting:** Declarations são hoisted mas não inicializadas (temporal dead zone)
5. **Strict mode:** Classes sempre executam em strict mode

### Pilares Fundamentais

- **Declaração vs Expressão:** Mesma funcionalidade, timing diferente
- **new operator obrigatório:** Chamar classe sem `new` causa erro
- **Prototype por baixo:** Internamente usa prototype chain
- **Métodos não-enumeráveis:** Métodos de classe não aparecem em `for...in`
- **this dinâmico:** `this` dentro de métodos depende de como são chamados

### Visão Geral das Nuances

- **Hoisting de classes:** Declarations hoisted mas não inicializadas
- **Class name binding:** Class expressions nomeadas têm nome disponível internamente
- **Métodos vs properties:** Métodos no prototype, properties na instância
- **Convenções:** PascalCase para nomes de classes
- **First-class citizens:** Classes são valores (podem ser passadas, retornadas, etc.)

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Class = Function Constructor + Prototype

Classe ES6 é **transpilada** para function constructor + prototype:

```javascript
// ES6 Class
class Pessoa {
    constructor(nome) {
        this.nome = nome;
    }
    
    saudar() {
        console.log(`Olá, ${this.nome}`);
    }
}

// Equivalente ES5 (aproximado)
function Pessoa(nome) {
    this.nome = nome;
}

Pessoa.prototype.saudar = function() {
    console.log('Olá, ' + this.nome);
};
```

**Classes NÃO criam novo tipo de objeto** - ainda são functions e prototypes!

#### New Operator com Classes

Quando chama `new Classe()`:

1. **Novo objeto criado:** `{}`
2. **Prototype configurado:** `__proto__` aponta para `Classe.prototype`
3. **Constructor executado:** `this` aponta para novo objeto
4. **Retorna objeto:** (ou retorno explícito do constructor)

```javascript
class Carro {
    constructor(marca) {
        this.marca = marca;
    }
}

const meuCarro = new Carro('Toyota');

// Internamente:
// 1. meuCarro = {}
// 2. meuCarro.__proto__ = Carro.prototype
// 3. Carro.call(meuCarro, 'Toyota')
// 4. return meuCarro
```

### Princípios Conceituais

#### Classes são Functions

```javascript
class Pessoa {
    constructor(nome) {
        this.nome = nome;
    }
}

console.log(typeof Pessoa);  // "function"
console.log(Pessoa instanceof Function);  // true
```

Classes **são** functions especiais!

#### Métodos no Prototype

```javascript
class Animal {
    constructor(nome) {
        this.nome = nome;
    }
    
    comer() {
        console.log('Comendo...');
    }
}

const gato = new Animal('Miau');

console.log(gato.hasOwnProperty('nome'));  // true (propriedade da instância)
console.log(gato.hasOwnProperty('comer'));  // false (método no prototype)
console.log(Animal.prototype.hasOwnProperty('comer'));  // true
```

Métodos ficam **no prototype**, não na instância (economia de memória).

#### Strict Mode Automático

```javascript
class Teste {
    metodo() {
        // Strict mode SEMPRE ativo em classes
        console.log(this);  // undefined se chamado sem contexto
    }
}

const t = new Teste();
const fn = t.metodo;
fn();  // undefined (em strict mode)
```

---

## 🔍 Análise Conceitual Profunda

### Class Declaration - Sintaxe Básica

```javascript
class Pessoa {
    // Constructor - chamado ao criar instância
    constructor(nome, idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    // Métodos - vão para Pessoa.prototype
    saudar() {
        console.log(`Olá, meu nome é ${this.nome}`);
    }
    
    aniversario() {
        this.idade++;
        console.log(`Agora tenho ${this.idade} anos!`);
    }
}

// Uso
const joao = new Pessoa('João', 30);
joao.saudar();  // "Olá, meu nome é João"
joao.aniversario();  // "Agora tenho 31 anos!"
```

### Class Expression Anônima

```javascript
// Atribuída a variável
const Carro = class {
    constructor(marca, modelo) {
        this.marca = marca;
        this.modelo = modelo;
    }
    
    detalhes() {
        return `${this.marca} ${this.modelo}`;
    }
};

const meuCarro = new Carro('Toyota', 'Corolla');
console.log(meuCarro.detalhes());  // "Toyota Corolla"
```

### Class Expression Nomeada

```javascript
const MinhaClasse = class Pessoa {
    constructor(nome) {
        this.nome = nome;
    }
    
    quemSouEu() {
        // Nome "Pessoa" disponível DENTRO da classe
        console.log(Pessoa.name);  // "Pessoa"
    }
};

const p = new MinhaClasse('Ana');
p.quemSouEu();  // "Pessoa"

console.log(MinhaClasse.name);  // "Pessoa"
// console.log(Pessoa);  // ReferenceError - nome só interno!
```

Nome da classe expression disponível **apenas internamente**.

### Hoisting - Temporal Dead Zone

```javascript
// ❌ ReferenceError - classe não inicializada
const p = new Pessoa('João');

class Pessoa {
    constructor(nome) {
        this.nome = nome;
    }
}

// ✅ Funciona - após declaração
const p2 = new Pessoa('Maria');
```

Classes são **hoisted mas não inicializadas** (temporal dead zone).

**Comparação com functions:**

```javascript
// ✅ Function declaration - funciona antes
const p1 = new Pessoa('João');

function Pessoa(nome) {
    this.nome = nome;
}

// ❌ Class declaration - NÃO funciona antes
const p2 = new Animal('Gato');  // ReferenceError

class Animal {
    constructor(especie) {
        this.especie = especie;
    }
}
```

### Constructor Method

```javascript
class Produto {
    constructor(nome, preco) {
        // Inicializar propriedades da instância
        this.nome = nome;
        this.preco = preco;
        this.emEstoque = true;
        
        // Validações
        if (preco < 0) {
            throw new Error('Preço não pode ser negativo');
        }
    }
}

const produto = new Produto('Notebook', 3000);
console.log(produto.nome);  // "Notebook"
```

**Constructor:**
- Chamado **automaticamente** ao criar instância
- Inicializa propriedades
- Pode ter validações
- Opcional (se não definir, constructor vazio é usado)

### Métodos de Instância

```javascript
class Contador {
    constructor(inicio = 0) {
        this.valor = inicio;
    }
    
    incrementar() {
        this.valor++;
        return this;  // Permite chaining
    }
    
    decrementar() {
        this.valor--;
        return this;
    }
    
    obterValor() {
        return this.valor;
    }
}

const c = new Contador(10);
c.incrementar().incrementar().decrementar();
console.log(c.obterValor());  // 11
```

Métodos retornando `this` permitem **method chaining**.

### Métodos Não-Enumeráveis

```javascript
class Pessoa {
    constructor(nome) {
        this.nome = nome;
    }
    
    saudar() {
        console.log(`Olá, ${this.nome}`);
    }
}

const p = new Pessoa('Carlos');

// Propriedades da instância SÃO enumeráveis
for (let key in p) {
    console.log(key);  // Apenas "nome" (não "saudar")
}

console.log(Object.keys(p));  // ["nome"]

// Método está no prototype (não-enumerável)
console.log(p.saudar);  // function saudar()
```

Métodos de classe são **não-enumeráveis** (diferente de ES5).

### New Obrigatório

```javascript
class Pessoa {
    constructor(nome) {
        this.nome = nome;
    }
}

// ✅ Com new
const p1 = new Pessoa('Ana');

// ❌ Sem new - TypeError
const p2 = Pessoa('Ana');  // TypeError: Class constructor cannot be invoked without 'new'
```

**Classes SEMPRE precisam `new`** (diferente de function constructors).

### Múltiplos Métodos

```javascript
class ContaBancaria {
    constructor(titular, saldoInicial = 0) {
        this.titular = titular;
        this.saldo = saldoInicial;
    }
    
    depositar(valor) {
        if (valor <= 0) {
            throw new Error('Valor deve ser positivo');
        }
        this.saldo += valor;
        console.log(`Depositado: R$ ${valor}`);
    }
    
    sacar(valor) {
        if (valor > this.saldo) {
            throw new Error('Saldo insuficiente');
        }
        this.saldo -= valor;
        console.log(`Sacado: R$ ${valor}`);
    }
    
    consultarSaldo() {
        return this.saldo;
    }
}

const conta = new ContaBancaria('João', 1000);
conta.depositar(500);
conta.sacar(200);
console.log(conta.consultarSaldo());  // 1300
```

### Classes como First-Class Citizens

```javascript
// Passar classe como argumento
function criarInstancia(Classe, ...args) {
    return new Classe(...args);
}

class Pessoa {
    constructor(nome) {
        this.nome = nome;
    }
}

const p = criarInstancia(Pessoa, 'Maria');
console.log(p.nome);  // "Maria"

// Retornar classe de função
function criarClasse(tipo) {
    if (tipo === 'pessoa') {
        return class {
            constructor(nome) {
                this.nome = nome;
            }
        };
    }
}

const MinhaClasse = criarClasse('pessoa');
const instancia = new MinhaClasse('Pedro');
```

Classes são **valores** - podem ser passadas, retornadas, armazenadas.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Class Declaration

**Use quando:**

1. **Classe principal:** Estrutura central do módulo
2. **Exportação:** Vai ser exportada de módulo
3. **Clareza:** Quer deixar claro que é classe importante
4. **Convenção:** Padrão em maioria dos projetos

```javascript
// Classe principal - declaration
class Usuario {
    constructor(nome, email) {
        this.nome = nome;
        this.email = email;
    }
    
    validar() {
        return this.email.includes('@');
    }
}

export default Usuario;
```

### Quando Usar Class Expression

**Use quando:**

1. **Classe anônima:** Classe única, passada como argumento
2. **Condicional:** Criar classe baseado em condição
3. **Callback:** Classe usada em callback
4. **Factory:** Retornar de função factory

```javascript
// Classe condicional
function criarModel(tipo) {
    if (tipo === 'admin') {
        return class {
            constructor(nome) {
                this.nome = nome;
                this.permissoes = ['ler', 'escrever', 'deletar'];
            }
        };
    } else {
        return class {
            constructor(nome) {
                this.nome = nome;
                this.permissoes = ['ler'];
            }
        };
    }
}

const AdminModel = criarModel('admin');
const admin = new AdminModel('Root');
```

### Padrões de Uso

**Padrão 1: Model/Entity**
```javascript
class Produto {
    constructor(id, nome, preco) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }
    
    calcularDesconto(percentual) {
        return this.preco * (1 - percentual / 100);
    }
}
```

**Padrão 2: Service**
```javascript
class UsuarioService {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }
    
    async buscarUsuario(id) {
        const response = await fetch(`${this.apiUrl}/usuarios/${id}`);
        return response.json();
    }
}
```

**Padrão 3: Utility Class (métodos estáticos)**
```javascript
class MathUtils {
    static somar(a, b) {
        return a + b;
    }
    
    static fatorial(n) {
        if (n <= 1) return 1;
        return n * MathUtils.fatorial(n - 1);
    }
}

console.log(MathUtils.somar(2, 3));  // 5
```

---

## ⚠️ Limitações e Considerações Teóricas

### Não é "True" OOP

JavaScript classes **não são** classes tradicionais:

```javascript
class Pessoa {
    constructor(nome) {
        this.nome = nome;
    }
}

// É function!
console.log(typeof Pessoa);  // "function"

// Usa prototypes
const p = new Pessoa('Ana');
console.log(p.__proto__ === Pessoa.prototype);  // true
```

Classes são **syntax sugar** - prototypes por baixo.

### This pode ser undefined

```javascript
class Pessoa {
    constructor(nome) {
        this.nome = nome;
    }
    
    saudar() {
        console.log(`Olá, ${this.nome}`);
    }
}

const p = new Pessoa('João');
const fn = p.saudar;
fn();  // TypeError: Cannot read property 'nome' of undefined
```

**Solução:** Arrow functions ou `.bind()`

```javascript
class Pessoa {
    constructor(nome) {
        this.nome = nome;
        this.saudar = this.saudar.bind(this);
    }
    
    saudar() {
        console.log(`Olá, ${this.nome}`);
    }
}
```

### Propriedades Públicas por Padrão

```javascript
class Conta {
    constructor(senha) {
        this.senha = senha;  // PÚBLICA!
    }
}

const c = new Conta('123456');
console.log(c.senha);  // "123456" - acessível!
```

**Solução:** Private fields (`#`) - próximo tópico.

---

## 🔗 Interconexões Conceituais

### Relação com Prototypes

```javascript
class Animal {
    comer() {
        console.log('Comendo...');
    }
}

const gato = new Animal();

// Métodos estão no prototype
console.log(gato.__proto__ === Animal.prototype);  // true
console.log(Animal.prototype.comer);  // function comer()
```

### Relação com Function Constructors

```javascript
// ES5
function Pessoa(nome) {
    this.nome = nome;
}

// ES6
class Pessoa {
    constructor(nome) {
        this.nome = nome;
    }
}

// Ambos criam mesmo tipo de objeto
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. **Class Declarations/Expressions** (você está aqui)
2. **Constructor Method** (inicialização)
3. **Static Methods** (métodos de classe)
4. **Inheritance (extends/super)** (herança)
5. **Private Fields** (encapsulamento)
6. **Getters/Setters** (propriedades computadas)

### Preparação para Constructor

Com classes definidas, próximo: **constructor method**:

```javascript
class Pessoa {
    constructor(nome, idade) {
        // Inicialização aqui
        this.nome = nome;
        this.idade = idade;
    }
}
```

Próximo: **Constructor Method** detalhado.

---

## 📚 Conclusão

**Classes ES6** são syntax sugar sobre prototypes, fornecendo sintaxe **limpa e familiar** para Orientação a Objetos em JavaScript.

**Conceitos essenciais:**
- **Declaration vs Expression:** Timing de hoisting diferente
- **Syntax sugar:** Prototypes por baixo
- **Constructor:** Método especial de inicialização
- **Métodos no prototype:** Economia de memória
- **new obrigatório:** Diferente de function constructors
- **Strict mode:** Sempre ativo em classes
- **First-class citizens:** Classes são valores
- **Hoisting:** Temporal dead zone para declarations
- **Familiaridade:** Sintaxe similar a Java/C#

Dominar classes é fundamental para **código OO moderno** em JavaScript.
