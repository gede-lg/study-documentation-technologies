# Public Class Fields, Getters e Setters: Propriedades e Acesso Controlado

## 🎯 Introdução e Definição

### Definição Conceitual

**Public class fields** são propriedades declaradas diretamente no corpo da classe (não apenas no constructor), enquanto **getters e setters** são métodos especiais que parecem propriedades, permitindo **acesso controlado** e **validação**.

**Sintaxe:**

```javascript
class Pessoa {
    // PUBLIC CLASS FIELDS - declarados no corpo da classe
    nome = '';
    idade = 0;
    ativo = true;
    
    // PRIVATE FIELD
    #senha = '';
    
    constructor(nome, idade, senha) {
        this.nome = nome;
        this.idade = idade;
        this.#senha = senha;
    }
    
    // GETTER - ler como propriedade
    get info() {
        return `${this.nome}, ${this.idade} anos`;
    }
    
    // SETTER - escrever como propriedade (com validação)
    set idadeSegura(valor) {
        if (valor < 0 || valor > 150) {
            throw new Error('Idade inválida');
        }
        this.idade = valor;
    }
}

const pessoa = new Pessoa('João', 30, 'senha123');

// Public fields acessíveis diretamente
console.log(pessoa.nome);  // "João"
pessoa.ativo = false;

// Getter - parece propriedade, mas executa método
console.log(pessoa.info);  // "João, 30 anos" (sem parênteses!)

// Setter - parece propriedade, mas valida
pessoa.idadeSegura = 35;  // ✅ OK
// pessoa.idadeSegura = -5;  // ❌ Erro: "Idade inválida"
```

**Características:**

- **Public fields:** Declarados fora do constructor, inicializados antes
- **Getters:** `get propriedade()` - leitura como propriedade
- **Setters:** `set propriedade(valor)` - escrita como propriedade
- **Validação:** Setters podem validar antes de atribuir
- **Computed properties:** Getters podem calcular valores dinamicamente

### Contexto Histórico e Motivação

**Era pré-ES2022:** Tudo no constructor

```javascript
// Antes - apenas constructor
class Pessoa {
    constructor() {
        this.nome = '';
        this.idade = 0;
        this.ativo = true;
    }
}
```

**Repetitivo, especialmente com valores padrão.**

**ES2022:** Public class fields (2022)

```javascript
// Depois - declaração no corpo da classe
class Pessoa {
    nome = '';  // Valores padrão claros
    idade = 0;
    ativo = true;
}
```

**Mais limpo e declarativo!**

**Getters/Setters:** Desde ES5 (2009) em objetos, ES6 (2015) em classes

```javascript
// ES5 - Object.defineProperty
function criarPessoa() {
    let _idade = 0;
    
    return Object.defineProperty({}, 'idade', {
        get() { return _idade; },
        set(v) { 
            if (v < 0) throw new Error('Inválido');
            _idade = v;
        }
    });
}

// ES6 - Classes com get/set
class Pessoa {
    #idade = 0;
    
    get idade() {
        return this.#idade;
    }
    
    set idade(v) {
        if (v < 0) throw new Error('Inválido');
        this.#idade = v;
    }
}
```

**Motivações principais:**

1. **Declaração clara:** Fields no corpo da classe (não escondidos no constructor)
2. **Valores padrão:** Inicialização visível
3. **Validação:** Setters para controlar atribuição
4. **Computed properties:** Getters para propriedades calculadas
5. **Encapsulamento:** Controlar acesso a private fields
6. **API limpa:** Parecem propriedades, mas com lógica

### Problema Fundamental que Resolve

**Problema 1:** Onde declarar propriedades com valores padrão?

**Antes (constructor):**

```javascript
class Config {
    constructor() {
        this.debug = false;
        this.timeout = 5000;
        this.retries = 3;
        this.baseURL = 'https://api.exemplo.com';
        // Valores padrão escondidos no constructor
    }
}
```

**Depois (public fields):**

```javascript
class Config {
    // Valores padrão VISÍVEIS no topo da classe
    debug = false;
    timeout = 5000;
    retries = 3;
    baseURL = 'https://api.exemplo.com';
}
```

**Problema 2:** Como validar atribuições a propriedades?

**Antes (sem validação):**

```javascript
class Produto {
    constructor(nome, preco) {
        this.nome = nome;
        this.preco = preco;  // ❌ Sem validação
    }
}

const prod = new Produto('Notebook', -1000);  // ❌ Preço negativo aceito!
```

**Depois (setter com validação):**

```javascript
class Produto {
    #preco = 0;
    
    constructor(nome, preco) {
        this.nome = nome;
        this.preco = preco;  // Usa setter
    }
    
    set preco(valor) {
        if (valor < 0) {
            throw new Error('Preço não pode ser negativo');
        }
        this.#preco = valor;
    }
    
    get preco() {
        return this.#preco;
    }
}

// ✅ Validação automática
// const prod = new Produto('Notebook', -1000);  // Erro!
```

**Problema 3:** Como criar propriedades calculadas?

**Antes (método):**

```javascript
class Retangulo {
    constructor(largura, altura) {
        this.largura = largura;
        this.altura = altura;
    }
    
    calcularArea() {  // ❌ Precisa chamar como método
        return this.largura * this.altura;
    }
}

const ret = new Retangulo(10, 5);
console.log(ret.calcularArea());  // Precisa ()
```

**Depois (getter):**

```javascript
class Retangulo {
    constructor(largura, altura) {
        this.largura = largura;
        this.altura = altura;
    }
    
    get area() {  // ✅ Parece propriedade
        return this.largura * this.altura;
    }
}

const ret = new Retangulo(10, 5);
console.log(ret.area);  // Sem () - como propriedade!
```

**Benefícios:**
- **Declaração clara:** Public fields visíveis
- **Validação:** Setters controlam atribuição
- **Computed properties:** Getters calculam dinamicamente
- **API limpa:** Parecem propriedades normais

### Importância no Ecossistema

Public fields, getters e setters são **essenciais** porque:

- **Frameworks:** React (class components com state fields), Vue (computed properties)
- **DOM API:** `element.innerHTML` (getter/setter), `element.classList`
- **Built-ins:** `Array.length` (setter valida), `Map.size` (getter)
- **Libraries:** Axios (config fields), Moment.js (getters para data)
- **Design patterns:** Builder (setters fluent), DTO (getters/setters)
- **Validação:** Controlar dados em tempo de atribuição

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Public class fields:** Declarados no corpo da classe
2. **Inicialização:** Fields inicializados antes do constructor
3. **Getters:** `get prop()` - leitura como propriedade
4. **Setters:** `set prop(v)` - escrita como propriedade
5. **Validação:** Setters permitem validação pré-atribuição

### Pilares Fundamentais

- **Declaração clara:** Fields visíveis no topo da classe
- **Valores padrão:** Inicialização explícita
- **Acesso controlado:** Getters/setters para private fields
- **Validação:** Setters impedem valores inválidos
- **Computed properties:** Getters para cálculos dinâmicos
- **API limpa:** Parecem propriedades, mas com lógica

### Visão Geral das Nuances

- **Inicialização:** Fields antes de constructor
- **Static fields:** `static campo = valor`
- **Private fields:** `#campo = valor`
- **Getter sem setter:** Read-only property
- **Setter sem getter:** Write-only property (raro)

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Public Class Fields = Atribuição no Constructor

```javascript
class Exemplo {
    campo = 10;
}

// Internamente equivalente a:
class Exemplo {
    constructor() {
        this.campo = 10;
    }
}
```

Public fields são **atribuídos** antes do corpo do constructor executar.

#### Getters/Setters = Property Descriptors

```javascript
class Exemplo {
    #valor = 0;
    
    get valor() {
        return this.#valor;
    }
    
    set valor(v) {
        this.#valor = v;
    }
}

// Internamente usa Object.defineProperty:
Object.defineProperty(Exemplo.prototype, 'valor', {
    get() { return this.#valor; },
    set(v) { this.#valor = v; },
    enumerable: false,
    configurable: true
});
```

### Princípios Conceituais

#### Public Fields Antes de Constructor

```javascript
class Exemplo {
    campo = 10;
    
    constructor() {
        console.log(this.campo);  // 10 (já inicializado!)
        this.campo = 20;  // Pode sobrescrever
    }
}

const obj = new Exemplo();
console.log(obj.campo);  // 20
```

Fields são inicializados **antes** do constructor executar.

#### Getters Não Aceitam Parâmetros

```javascript
class Exemplo {
    #valor = 10;
    
    get valor() {
        return this.#valor;
    }
}

const obj = new Exemplo();
console.log(obj.valor);  // 10 (sem parênteses)
// obj.valor(20);  // ❌ TypeError: não é função
```

Getters **não** podem receber parâmetros.

#### Setters Aceitam Exatamente 1 Parâmetro

```javascript
class Exemplo {
    #valor = 0;
    
    set valor(v) {  // Exatamente 1 parâmetro
        this.#valor = v;
    }
}

const obj = new Exemplo();
obj.valor = 20;  // Passa valor como parâmetro
```

---

## 🔍 Análise Conceitual Profunda

### Public Class Fields Básico

```javascript
class Usuario {
    // Public fields com valores padrão
    nome = 'Anônimo';
    ativo = true;
    nivel = 1;
    tags = [];  // ⚠️ Referência compartilhada entre instâncias!
    
    constructor(nome) {
        if (nome) {
            this.nome = nome;
        }
    }
}

const user1 = new Usuario('João');
const user2 = new Usuario();

console.log(user1.nome);  // "João"
console.log(user2.nome);  // "Anônimo"
```

### Getter Básico

```javascript
class Pessoa {
    constructor(nome, sobrenome) {
        this.nome = nome;
        this.sobrenome = sobrenome;
    }
    
    get nomeCompleto() {
        return `${this.nome} ${this.sobrenome}`;
    }
}

const pessoa = new Pessoa('João', 'Silva');
console.log(pessoa.nomeCompleto);  // "João Silva" (sem parênteses!)
```

### Setter Básico com Validação

```javascript
class Produto {
    #preco = 0;
    
    get preco() {
        return this.#preco;
    }
    
    set preco(valor) {
        if (typeof valor !== 'number') {
            throw new TypeError('Preço deve ser número');
        }
        
        if (valor < 0) {
            throw new Error('Preço não pode ser negativo');
        }
        
        this.#preco = valor;
    }
}

const prod = new Produto();
prod.preco = 100;  // ✅ OK
console.log(prod.preco);  // 100

// ❌ Erros
// prod.preco = -10;  // Error: "Preço não pode ser negativo"
// prod.preco = '100';  // TypeError: "Preço deve ser número"
```

### Getter/Setter para Private Field

```javascript
class ContaBancaria {
    #saldo = 0;
    
    constructor(saldoInicial) {
        this.saldo = saldoInicial;  // Usa setter
    }
    
    get saldo() {
        return this.#saldo;
    }
    
    set saldo(valor) {
        if (valor < 0) {
            throw new Error('Saldo não pode ser negativo');
        }
        this.#saldo = valor;
    }
    
    depositar(valor) {
        this.saldo += valor;  // Usa setter (validação automática)
    }
}

const conta = new ContaBancaria(1000);
console.log(conta.saldo);  // 1000

conta.depositar(500);
console.log(conta.saldo);  // 1500
```

### Computed Property com Getter

```javascript
class Retangulo {
    constructor(largura, altura) {
        this.largura = largura;
        this.altura = altura;
    }
    
    get area() {
        return this.largura * this.altura;
    }
    
    get perimetro() {
        return 2 * (this.largura + this.altura);
    }
    
    get diagonal() {
        return Math.sqrt(this.largura ** 2 + this.altura ** 2);
    }
}

const ret = new Retangulo(10, 5);
console.log(ret.area);      // 50
console.log(ret.perimetro); // 30
console.log(ret.diagonal);  // 11.18...
```

### Read-Only Property (Getter sem Setter)

```javascript
class Configuracao {
    #versao = '1.0.0';
    
    get versao() {
        return this.#versao;  // Apenas leitura
    }
    // Sem setter - read-only!
}

const config = new Configuracao();
console.log(config.versao);  // "1.0.0"

// ❌ Não pode atribuir (sem setter)
config.versao = '2.0.0';  // Silenciosamente ignorado (ou erro em strict mode)
console.log(config.versao);  // Ainda "1.0.0"
```

### Setter com Transformação

```javascript
class Usuario {
    #email = '';
    
    get email() {
        return this.#email;
    }
    
    set email(valor) {
        // Transformar para lowercase
        this.#email = valor.toLowerCase().trim();
    }
}

const user = new Usuario();
user.email = '  JOAO@EMAIL.COM  ';
console.log(user.email);  // "joao@email.com"
```

### Multiple Getters/Setters

```javascript
class Temperatura {
    #celsius = 0;
    
    get celsius() {
        return this.#celsius;
    }
    
    set celsius(valor) {
        this.#celsius = valor;
    }
    
    get fahrenheit() {
        return (this.#celsius * 9/5) + 32;
    }
    
    set fahrenheit(valor) {
        this.celsius = (valor - 32) * 5/9;  // Usa setter celsius
    }
    
    get kelvin() {
        return this.#celsius + 273.15;
    }
    
    set kelvin(valor) {
        this.celsius = valor - 273.15;
    }
}

const temp = new Temperatura();
temp.celsius = 25;

console.log(temp.celsius);    // 25
console.log(temp.fahrenheit); // 77
console.log(temp.kelvin);     // 298.15

temp.fahrenheit = 86;
console.log(temp.celsius);  // 30
```

### Static Getter/Setter

```javascript
class Contador {
    static #count = 0;
    
    static get count() {
        return this.#count;
    }
    
    static incrementar() {
        this.#count++;
    }
    
    static resetar() {
        this.#count = 0;
    }
}

Contador.incrementar();
Contador.incrementar();
console.log(Contador.count);  // 2

Contador.resetar();
console.log(Contador.count);  // 0
```

### Lazy Initialization com Getter

```javascript
class DataLoader {
    #cache = null;
    
    get dados() {
        // Carregar apenas na primeira vez
        if (this.#cache === null) {
            console.log('Carregando dados...');
            this.#cache = this.#carregarDados();
        }
        return this.#cache;
    }
    
    #carregarDados() {
        // Simular carregamento pesado
        return [1, 2, 3, 4, 5];
    }
}

const loader = new DataLoader();
console.log(loader.dados);  // "Carregando dados..." + [1, 2, 3, 4, 5]
console.log(loader.dados);  // [1, 2, 3, 4, 5] (sem "Carregando...")
```

### Validation Chaining com Setters

```javascript
class Usuario {
    #nome = '';
    #idade = 0;
    #email = '';
    
    set nome(valor) {
        if (!valor || valor.trim() === '') {
            throw new Error('Nome não pode ser vazio');
        }
        this.#nome = valor.trim();
    }
    
    set idade(valor) {
        if (typeof valor !== 'number' || valor < 0 || valor > 150) {
            throw new Error('Idade inválida');
        }
        this.#idade = valor;
    }
    
    set email(valor) {
        if (!valor.includes('@')) {
            throw new Error('Email inválido');
        }
        this.#email = valor.toLowerCase();
    }
    
    get nome() { return this.#nome; }
    get idade() { return this.#idade; }
    get email() { return this.#email; }
}

const user = new Usuario();
user.nome = 'João';
user.idade = 30;
user.email = 'JOAO@EMAIL.COM';

console.log(user.nome);   // "João"
console.log(user.idade);  // 30
console.log(user.email);  // "joao@email.com"

// ❌ Validações
// user.idade = -5;  // Error: "Idade inválida"
// user.email = 'invalido';  // Error: "Email inválido"
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Public Class Fields

**Use quando:**

1. **Valores padrão:** Propriedades com valores iniciais
2. **Clareza:** Declaração visível no topo da classe
3. **Sem validação:** Propriedades que não precisam de controle

```javascript
class Config {
    debug = false;
    timeout = 5000;
    retries = 3;
}
```

### Quando Usar Getters

**Use quando:**

1. **Computed properties:** Valores calculados dinamicamente
2. **Read-only:** Propriedades que não devem ser modificadas
3. **Lazy loading:** Carregar apenas quando necessário
4. **Formatação:** Retornar valor formatado

```javascript
class Pessoa {
    get nomeCompleto() {
        return `${this.nome} ${this.sobrenome}`;
    }
}
```

### Quando Usar Setters

**Use quando:**

1. **Validação:** Controlar valores atribuídos
2. **Transformação:** Modificar valor antes de armazenar
3. **Side effects:** Executar ação ao atribuir
4. **Encapsulamento:** Controlar acesso a private fields

```javascript
class Produto {
    set preco(v) {
        if (v < 0) throw new Error('Inválido');
        this.#preco = v;
    }
}
```

### Quando NÃO Usar Getters/Setters

**Evite quando:**

1. **Lógica complexa:** Getters/setters devem ser simples
2. **Operações assíncronas:** Não podem ser async
3. **Sem validação/cálculo:** Use public field diretamente

```javascript
// ❌ Evite: lógica complexa em getter
get resultado() {
    // Processamento pesado
    return this.dados.map(...).filter(...).reduce(...);
}

// ✅ Use método
calcularResultado() {
    return this.dados.map(...).filter(...).reduce(...);
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Getters Não Podem Ser Async

```javascript
class Exemplo {
    // ❌ Não funciona como esperado
    async get dados() {
        return await fetch('/api/dados');
    }
}

// ✅ Use método async
class Exemplo {
    async buscarDados() {
        return await fetch('/api/dados');
    }
}
```

### Arrays/Objects em Fields = Referência Compartilhada

```javascript
class Exemplo {
    tags = [];  // ⚠️ CUIDADO!
}

const obj1 = new Exemplo();
const obj2 = new Exemplo();

obj1.tags.push('a');
console.log(obj2.tags);  // [] (OK - cada instância tem próprio array)

// Inicialização correta:
class Exemplo {
    tags = [];  // OK - nova array por instância
}
```

### Setter Sem Getter = Write-Only (Raro)

```javascript
class Exemplo {
    #senha = '';
    
    set senha(v) {
        this.#senha = v;
    }
    // Sem getter - write-only
}

const obj = new Exemplo();
obj.senha = '123';
// console.log(obj.senha);  // undefined (sem getter)
```

---

## 🔗 Interconexões Conceituais

### Relação com Private Fields

Getters/setters geralmente expõem private fields:

```javascript
class Exemplo {
    #valor;
    
    get valor() {
        return this.#valor;
    }
    
    set valor(v) {
        this.#valor = v;
    }
}
```

### Relação com Validação

Setters são o local ideal para validação:

```javascript
class Idade {
    #valor;
    
    set valor(v) {
        if (v < 0 || v > 150) throw new Error('Inválido');
        this.#valor = v;
    }
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. Class Declarations/Expressions
2. Constructor Method
3. Static Methods/Fields
4. Inheritance (extends/super)
5. Private Fields (#)
6. **Public Fields, Getters/Setters** (você completou!)

### Próximos Passos

- **Mixins:** Composição de funcionalidades
- **Decorators:** Metaprogramação (proposta)
- **Private methods:** `#metodo()` privado
- **Abstract classes:** Conceito (não nativo em JS)

---

## 📚 Conclusão

**Public class fields, getters e setters** permitem declaração clara de propriedades e acesso controlado com validação.

**Conceitos essenciais:**
- **Public class fields:** Declarados no corpo da classe, inicializados antes do constructor
- **Valores padrão:** Visíveis no topo da classe
- **Getters:** `get prop()` - leitura como propriedade, para computed properties
- **Setters:** `set prop(v)` - escrita como propriedade, com validação
- **Validação:** Setters controlam atribuição
- **Computed properties:** Getters calculam dinamicamente
- **Read-only:** Getter sem setter
- **Encapsulamento:** Getters/setters para private fields
- **Transformação:** Setters podem modificar valor antes de armazenar
- **API limpa:** Parecem propriedades, mas com lógica

Dominar public fields, getters e setters é essencial para **APIs limpas, validação robusta e encapsulamento efetivo** em JavaScript moderno!
