# Static Methods e Static Fields: Métodos e Propriedades de Classe

## 🎯 Introdução e Definição

### Definição Conceitual

**Static methods** e **static fields** são métodos e propriedades que pertencem à **classe em si**, não às instâncias. Eles são chamados/acessados diretamente na classe, sem precisar criar objeto.

**Diferença fundamental:**

- **Métodos de instância:** Precisam de objeto (`new Classe()`)
- **Métodos estáticos:** Chamados na classe (`Classe.metodo()`)

**Sintaxe:**

```javascript
class MathUtils {
    // STATIC METHOD - pertence à classe
    static somar(a, b) {
        return a + b;
    }
    
    // STATIC FIELD - propriedade da classe
    static PI = 3.14159;
    static versao = '1.0.0';
    
    // INSTANCE METHOD - pertence às instâncias
    calcular() {
        return this.valor * 2;
    }
}

// Static method - chamado NA CLASSE
console.log(MathUtils.somar(2, 3));  // 5

// Static field - acessado NA CLASSE
console.log(MathUtils.PI);  // 3.14159

// Instance method - precisa instância
const m = new MathUtils();
m.calcular();
```

**Características:**

- **Sem `this` de instância:** `this` refere-se à classe, não à instância
- **Chamada direta:** `Classe.metodo()`, não `instancia.metodo()`
- **Utilitários:** Funções auxiliares, factories, configuração
- **Compartilhado:** Mesmo valor/função para todos

### Contexto Histórico e Motivação

**Era pré-ES6:** "Static" via propriedades de função

```javascript
// ES5 - Simulando static
function MathUtils() {}

// "Static method" - função na constructor function
MathUtils.somar = function(a, b) {
    return a + b;
};

// "Static field"
MathUtils.PI = 3.14159;

MathUtils.somar(2, 3);  // 5
```

**Funciona, mas não é claro que é "parte da classe".**

**ES6 Classes:** Static keyword explícito (2015)

```javascript
class MathUtils {
    static somar(a, b) {
        return a + b;
    }
    
    static PI = 3.14159;  // Static field (ES2022)
}
```

**ES2022:** Static fields nativos (antes era proposta).

**Motivações principais:**

1. **Clareza:** `static` indica método/campo de classe
2. **Organização:** Agrupar funções relacionadas em classe
3. **Namespace:** Evitar poluir escopo global
4. **Factory methods:** Criar instâncias de formas alternativas
5. **Configuração:** Constantes e configurações da classe

### Problema Fundamental que Resolve

**Problema:** Onde colocar **funções utilitárias** ou **configurações** relacionadas a uma classe, mas que **não dependem de instância**?

**Antes - funções globais (ruim):**

```javascript
function somarValores(a, b) {
    return a + b;
}

function calcularMedia(array) {
    return array.reduce((sum, n) => sum + n, 0) / array.length;
}

const PI = 3.14159;

// Poluição do escopo global
// Sem relação clara com classe
```

**Depois - static methods (bom):**

```javascript
class MathUtils {
    static somar(a, b) {
        return a + b;
    }
    
    static calcularMedia(array) {
        return array.reduce((sum, n) => sum + n, 0) / array.length;
    }
    
    static PI = 3.14159;
}

// Agrupado, organizado, claro
MathUtils.somar(2, 3);
MathUtils.calcularMedia([1, 2, 3, 4, 5]);
```

**Benefícios:**
- **Namespace:** Funções agrupadas sob `MathUtils`
- **Não polui global:** Apenas `MathUtils` no escopo
- **Clareza:** Óbvio que são utilities matemáticas
- **Descobribilidade:** Autocomplete mostra todos os métodos

### Importância no Ecossistema

Static methods/fields são **importantes** porque:

- **Factory pattern:** `Array.from()`, `Object.create()`, `Promise.resolve()`
- **Utilitários:** `Math.max()`, `Math.random()`, `JSON.parse()`
- **Configuração:** Constantes de classe (`Classe.VERSAO`)
- **Frameworks:** React (`Component.getDerivedStateFromProps`), Angular (serviços)
- **Design patterns:** Singleton, Factory, Builder
- **API design:** Métodos auxiliares sem instância

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Pertencem à classe:** Não às instâncias
2. **Chamados na classe:** `Classe.metodo()`, não `instancia.metodo()`
3. **This = classe:** `this` refere-se à classe (constructor function)
4. **Sem acesso a instância:** Não podem acessar `this.propriedadeInstancia`
5. **Herdados:** Subclasses herdam static methods do pai

### Pilares Fundamentais

- **Utilitários:** Funções auxiliares relacionadas à classe
- **Factories:** Métodos para criar instâncias
- **Configuração:** Constantes e configurações compartilhadas
- **Namespace:** Agrupar funções relacionadas
- **Compartilhamento:** Mesmo valor/comportamento para todos

### Visão Geral das Nuances

- **Static fields:** Propriedades da classe (ES2022)
- **Private static:** `static #campo` (encapsulamento de classe)
- **Herança:** Subclasses herdam statics do pai
- **This em static:** `this` = classe, não instância
- **Quando usar:** Funções que não dependem de estado de instância

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Static Methods = Propriedades da Function

```javascript
class MathUtils {
    static somar(a, b) {
        return a + b;
    }
}

// Internamente equivalente a:
function MathUtils() {}
MathUtils.somar = function(a, b) {
    return a + b;
};

console.log(typeof MathUtils.somar);  // "function"
```

Static methods são **propriedades da constructor function**.

#### Static Fields = Propriedades da Classe

```javascript
class Config {
    static versao = '1.0.0';
    static ambiente = 'development';
}

// Equivalente a:
Config.versao = '1.0.0';
Config.ambiente = 'development';

console.log(Config.versao);  // "1.0.0"
```

### Princípios Conceituais

#### Não Acessíveis em Instâncias

```javascript
class Utils {
    static dobrar(n) {
        return n * 2;
    }
}

// ✅ Na classe
Utils.dobrar(5);  // 10

// ❌ Na instância - undefined!
const u = new Utils();
console.log(u.dobrar);  // undefined
```

Static methods **não estão** no prototype da instância.

#### This = Classe

```javascript
class Contador {
    static count = 0;
    
    static incrementar() {
        this.count++;  // this = Contador (a classe)
        console.log(this.count);
    }
}

Contador.incrementar();  // 1
Contador.incrementar();  // 2
```

`this` em static method refere-se à **classe**, não a instância.

#### Herança de Statics

```javascript
class Animal {
    static tipo = 'Vertebrado';
    
    static descrever() {
        console.log(`Tipo: ${this.tipo}`);
    }
}

class Cachorro extends Animal {
    static tipo = 'Mamífero';
}

Cachorro.descrever();  // "Tipo: Mamífero"
```

Subclasses **herdam** static methods e podem **sobrescrever** static fields.

---

## 🔍 Análise Conceitual Profunda

### Static Method Básico

```javascript
class MathUtils {
    static somar(a, b) {
        return a + b;
    }
    
    static subtrair(a, b) {
        return a - b;
    }
    
    static multiplicar(a, b) {
        return a * b;
    }
}

console.log(MathUtils.somar(10, 5));       // 15
console.log(MathUtils.subtrair(10, 5));    // 5
console.log(MathUtils.multiplicar(10, 5)); // 50
```

### Static Field

```javascript
class Config {
    static versao = '2.0.0';
    static autor = 'João Silva';
    static maxUsuarios = 1000;
}

console.log(Config.versao);  // "2.0.0"
console.log(Config.autor);   // "João Silva"

// Modificar static field
Config.maxUsuarios = 2000;
console.log(Config.maxUsuarios);  // 2000
```

### Factory Method Pattern

```javascript
class Usuario {
    constructor(nome, email, tipo) {
        this.nome = nome;
        this.email = email;
        this.tipo = tipo;
    }
    
    // Factory para criar admin
    static criarAdmin(nome, email) {
        return new Usuario(nome, email, 'admin');
    }
    
    // Factory para criar usuário comum
    static criarUsuarioComum(nome, email) {
        return new Usuario(nome, email, 'comum');
    }
    
    // Factory a partir de JSON
    static fromJSON(json) {
        const obj = JSON.parse(json);
        return new Usuario(obj.nome, obj.email, obj.tipo);
    }
}

// Usar factories
const admin = Usuario.criarAdmin('Root', 'root@admin.com');
const user = Usuario.criarUsuarioComum('João', 'joao@email.com');
const parsed = Usuario.fromJSON('{"nome":"Ana","email":"ana@email.com","tipo":"comum"}');

console.log(admin.tipo);  // "admin"
console.log(user.tipo);   // "comum"
```

### Counter/Singleton Pattern

```javascript
class AppState {
    static #instance = null;  // Private static
    static contador = 0;
    
    constructor() {
        if (AppState.#instance) {
            return AppState.#instance;
        }
        
        this.dados = {};
        AppState.#instance = this;
        AppState.contador++;
    }
    
    static getContador() {
        return this.contador;
    }
    
    static resetar() {
        this.#instance = null;
        this.contador = 0;
    }
}

const state1 = new AppState();
const state2 = new AppState();

console.log(state1 === state2);  // true (singleton)
console.log(AppState.getContador());  // 1
```

### Validation Utilities

```javascript
class Validator {
    static isEmail(str) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
    }
    
    static isCPF(str) {
        return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(str);
    }
    
    static isTelefone(str) {
        return /^\(\d{2}\) \d{4,5}-\d{4}$/.test(str);
    }
    
    static isVazio(str) {
        return !str || str.trim() === '';
    }
}

console.log(Validator.isEmail('joao@email.com'));  // true
console.log(Validator.isCPF('123.456.789-00'));    // true
console.log(Validator.isVazio(''));                // true
```

### Constants Collection

```javascript
class HTTPStatus {
    static OK = 200;
    static CREATED = 201;
    static BAD_REQUEST = 400;
    static UNAUTHORIZED = 401;
    static NOT_FOUND = 404;
    static INTERNAL_ERROR = 500;
    
    static mensagem(codigo) {
        const mensagens = {
            200: 'OK',
            201: 'Criado',
            400: 'Requisição Inválida',
            401: 'Não Autorizado',
            404: 'Não Encontrado',
            500: 'Erro Interno'
        };
        
        return mensagens[codigo] || 'Desconhecido';
    }
}

console.log(HTTPStatus.OK);  // 200
console.log(HTTPStatus.mensagem(404));  // "Não Encontrado"
```

### Configuration Manager

```javascript
class AppConfig {
    static ambiente = process.env.NODE_ENV || 'development';
    
    static configs = {
        development: {
            apiUrl: 'http://localhost:3000',
            debug: true
        },
        production: {
            apiUrl: 'https://api.producao.com',
            debug: false
        }
    };
    
    static get() {
        return this.configs[this.ambiente];
    }
    
    static isDevelopment() {
        return this.ambiente === 'development';
    }
    
    static isProduction() {
        return this.ambiente === 'production';
    }
}

const config = AppConfig.get();
console.log(config.apiUrl);  // "http://localhost:3000"
console.log(AppConfig.isDevelopment());  // true
```

### Static com This

```javascript
class Database {
    static conexoes = [];
    static maxConexoes = 10;
    
    static adicionar(conexao) {
        if (this.conexoes.length >= this.maxConexoes) {
            throw new Error('Limite de conexões atingido');
        }
        this.conexoes.push(conexao);
    }
    
    static remover(conexao) {
        const index = this.conexoes.indexOf(conexao);
        if (index > -1) {
            this.conexoes.splice(index, 1);
        }
    }
    
    static total() {
        return this.conexoes.length;
    }
}

Database.adicionar('conn1');
Database.adicionar('conn2');
console.log(Database.total());  // 2
```

### Comparing Static vs Instance

```javascript
class Pessoa {
    // STATIC FIELD - compartilhado por todas
    static totalPessoas = 0;
    
    // INSTANCE FIELDS - único por instância
    constructor(nome, idade) {
        this.nome = nome;
        this.idade = idade;
        
        // Incrementar contador estático
        Pessoa.totalPessoas++;
    }
    
    // STATIC METHOD - utilitário
    static compararIdades(p1, p2) {
        return p1.idade - p2.idade;
    }
    
    // INSTANCE METHOD - ação da instância
    saudar() {
        console.log(`Olá, sou ${this.nome}`);
    }
}

const p1 = new Pessoa('João', 30);
const p2 = new Pessoa('Maria', 25);

console.log(Pessoa.totalPessoas);  // 2 (static field)
console.log(Pessoa.compararIdades(p1, p2));  // 5 (static method)
p1.saudar();  // "Olá, sou João" (instance method)
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Static Methods

**Use quando:**

1. **Função utilitária:** Não depende de estado de instância
2. **Factory:** Criar instâncias de formas alternativas
3. **Validação:** Validar dados sem instância
4. **Cálculos:** Operações matemáticas, conversões
5. **Helpers:** Funções auxiliares relacionadas à classe

**Exemplos:**

```javascript
// 1. Utilitário
class StringUtils {
    static capitalizar(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// 2. Factory
class Data {
    static hoje() {
        return new Data(new Date());
    }
}

// 3. Validação
class Email {
    static validar(email) {
        return email.includes('@');
    }
}
```

### Quando Usar Static Fields

**Use quando:**

1. **Constantes:** Valores que não mudam
2. **Configuração:** Settings da classe
3. **Contadores:** Rastreamento global
4. **Cache:** Armazenamento compartilhado

```javascript
class API {
    static BASE_URL = 'https://api.exemplo.com';
    static TIMEOUT = 5000;
    static VERSION = '1.0.0';
}
```

### Quando NÃO Usar Static

**Evite quando:**

1. **Precisa de estado da instância:** Use instance method
2. **Polimorfismo:** Sobrescrita em subclasses (use instance)
3. **Mutação de estado:** Compartilhado pode causar bugs

```javascript
// ❌ Evite: estado compartilhado mutável
class Ruim {
    static dados = [];  // Todas as instâncias compartilham!
    
    adicionar(item) {
        Ruim.dados.push(item);  // Perigoso
    }
}

// ✅ Use: estado por instância
class Bom {
    constructor() {
        this.dados = [];  // Cada instância tem próprio array
    }
    
    adicionar(item) {
        this.dados.push(item);
    }
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Não Acessível em Instâncias

```javascript
class Utils {
    static metodo() {
        return 'static';
    }
}

const u = new Utils();
console.log(u.metodo);  // undefined
console.log(u.constructor.metodo());  // "static" (via constructor)
```

### This em Static = Classe

```javascript
class Test {
    static campo = 'valor';
    
    static metodo() {
        console.log(this);  // class Test (não instância)
        console.log(this.campo);  // "valor"
    }
}

Test.metodo();
```

### Herança Pode Causar Confusão

```javascript
class Pai {
    static count = 0;
    
    static incrementar() {
        this.count++;
    }
}

class Filho extends Pai {}

Filho.incrementar();
console.log(Filho.count);  // 1
console.log(Pai.count);    // 0 (separados!)
```

Cada classe tem **própria cópia** de static fields.

---

## 🔗 Interconexões Conceituais

### Relação com Prototypes

```javascript
class Classe {
    static staticMethod() {}
    instanceMethod() {}
}

// Static não está no prototype
console.log(Classe.prototype.staticMethod);  // undefined

// Instance method está
console.log(Classe.prototype.instanceMethod);  // function
```

### Relação com Factory Pattern

```javascript
class User {
    static fromJSON(json) {
        const data = JSON.parse(json);
        return new User(data.nome, data.email);
    }
}

// Factory facilita criação
const user = User.fromJSON('{"nome":"Ana","email":"ana@email.com"}');
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. Class Declarations/Expressions
2. Constructor Method
3. **Static Methods/Fields** (você está aqui)
4. **Inheritance (extends/super)** (herança)
5. Private Fields
6. Getters/Setters

### Preparação para Herança

Static methods são **herdados**:

```javascript
class Pai {
    static metodo() {
        return 'pai';
    }
}

class Filho extends Pai {}

Filho.metodo();  // "pai" (herdado)
```

Próximo: **Inheritance com extends e super** detalhado.

---

## 📚 Conclusão

**Static methods e fields** pertencem à classe, não às instâncias, sendo ideais para utilitários, factories e configuração.

**Conceitos essenciais:**
- **Pertencem à classe:** Chamados em `Classe.metodo()`, não `instancia.metodo()`
- **Sem acesso a instância:** Não podem usar `this` de instância
- **This = classe:** `this` refere-se à classe
- **Utilitários:** Funções que não dependem de estado de instância
- **Factories:** Criar instâncias de formas alternativas
- **Constantes:** Static fields para configuração
- **Herdados:** Subclasses herdam statics do pai
- **Namespace:** Agrupar funções relacionadas
- **Compartilhado:** Mesmo valor/função para todas as instâncias

Dominar static methods/fields é essencial para **design patterns, utilitários e API design** limpo.
