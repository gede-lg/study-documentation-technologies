# Private Fields (#): Encapsulamento Real em JavaScript

## 🎯 Introdução e Definição

### Definição Conceitual

**Private fields** (campos privados) são propriedades de classe que **não podem ser acessadas fora da classe**, garantindo **encapsulamento real**. São declarados com `#` antes do nome.

**Sintaxe:**

```javascript
class ContaBancaria {
    // PRIVATE FIELD - só acessível dentro da classe
    #saldo = 0;
    
    constructor(saldoInicial) {
        this.#saldo = saldoInicial;
    }
    
    depositar(valor) {
        this.#saldo += valor;  // ✅ Acessível dentro da classe
    }
    
    getSaldo() {
        return this.#saldo;
    }
}

const conta = new ContaBancaria(1000);
conta.depositar(500);

console.log(conta.getSaldo());  // 1500 (via método público)

// ❌ Erro: private field não acessível fora
// console.log(conta.#saldo);  // SyntaxError: Private field '#saldo' must be declared in an enclosing class
```

**Características:**

- **Encapsulamento real:** Inacessível fora da classe
- **Sintaxe `#`:** `#propriedade` em vez de `propriedade`
- **Declaração explícita:** Deve ser declarado no corpo da classe
- **Não herdado:** Subclasses não acessam diretamente
- **SyntaxError:** Acessar de fora causa erro de sintaxe

### Contexto Histórico e Motivação

**Era pré-ES2022:** Convenção `_` (não é privado de verdade)

```javascript
// Convenção - prefixo _
class ContaBancaria {
    constructor(saldo) {
        this._saldo = saldo;  // "Privado" por convenção
    }
    
    getSaldo() {
        return this._saldo;
    }
}

const conta = new ContaBancaria(1000);

// ❌ Ainda acessível! Convenção não é encapsulamento
console.log(conta._saldo);  // 1000 (funciona!)
conta._saldo = 0;  // ❌ Pode mudar diretamente!
```

**Problemas:**
- **Não é privado:** `_saldo` é acessível de fora
- **Depende de disciplina:** Desenvolvedores podem ignorar convenção
- **Sem proteção:** JavaScript não impede acesso

**Soluções anteriores: Closures**

```javascript
function criarConta(saldoInicial) {
    let saldo = saldoInicial;  // "Privado" via closure
    
    return {
        depositar(valor) {
            saldo += valor;
        },
        getSaldo() {
            return saldo;
        }
    };
}

const conta = criarConta(1000);
console.log(conta.getSaldo());  // 1000
// ❌ saldo inacessível
// console.log(conta.saldo);  // undefined
```

**Funciona, mas não usa classes.**

**ES2022 (2022):** Private fields nativos com `#`

```javascript
class ContaBancaria {
    #saldo = 0;  // ✅ Privado de verdade
    
    constructor(saldoInicial) {
        this.#saldo = saldoInicial;
    }
    
    getSaldo() {
        return this.#saldo;
    }
}

const conta = new ContaBancaria(1000);
// ❌ SyntaxError
// conta.#saldo;
```

**Encapsulamento real!**

**Motivações principais:**

1. **Encapsulamento:** Propriedades realmente privadas
2. **Segurança:** Impedir modificação externa acidental
3. **Controle:** API pública controlada (getters/setters)
4. **Manutenibilidade:** Mudar implementação interna sem quebrar código externo
5. **Padrão de linguagem:** Não depender de convenção

### Problema Fundamental que Resolve

**Problema:** Como **proteger dados internos** de uma classe, impedindo acesso e modificação externa?

**Antes - sem encapsulamento:**

```javascript
class Usuario {
    constructor(senha) {
        this.senha = senha;  // ❌ Público!
    }
}

const user = new Usuario('123456');

// ❌ Senha exposta!
console.log(user.senha);  // "123456"
user.senha = 'hackeado';  // ❌ Pode modificar!
```

**Depois - com private fields:**

```javascript
class Usuario {
    #senha;
    
    constructor(senha) {
        this.#senha = senha;  // ✅ Privado
    }
    
    verificarSenha(senha) {
        return this.#senha === senha;
    }
}

const user = new Usuario('123456');

// ❌ Senha inacessível
// console.log(user.#senha);  // SyntaxError

// ✅ Apenas via método público
console.log(user.verificarSenha('123456'));  // true
```

**Benefícios:**
- **Segurança:** Senha não exposta
- **Controle:** Acesso apenas via método público
- **Validação:** `verificarSenha()` pode adicionar lógica (log, hash, etc.)
- **Imutabilidade:** Não pode ser modificada de fora

### Importância no Ecossistema

Private fields são **importantes** porque:

- **Encapsulamento:** Princípio fundamental de POO
- **APIs robustas:** Controlar o que é público
- **Segurança:** Proteger dados sensíveis (senhas, tokens)
- **Manutenibilidade:** Mudar internamente sem quebrar código externo
- **Frameworks:** React (state privado), bibliotecas (implementação interna)
- **Design patterns:** Singleton, Factory (estado interno protegido)

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Sintaxe `#`:** `#propriedade` para declarar privado
2. **Declaração obrigatória:** Deve ser declarado no corpo da classe
3. **Inacessível fora:** SyntaxError ao tentar acessar de fora
4. **Acessível dentro:** Métodos da classe podem acessar
5. **Não herdado:** Subclasses não acessam diretamente

### Pilares Fundamentais

- **Encapsulamento:** Dados internos protegidos
- **Controle de API:** Apenas membros públicos acessíveis
- **Segurança:** Impedir modificação externa
- **Validação:** Controlar acesso via getters/setters
- **Manutenibilidade:** Implementação interna pode mudar

### Visão Geral das Nuances

- **Private methods:** `#metodo()` também funciona
- **Private static:** `static #campo` (privado da classe)
- **Herança:** Filho não acessa `#campo` do pai
- **Getters/setters:** Expor private fields de forma controlada
- **In operator:** `#campo in obj` para verificar existência

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Private Fields = WeakMap Interno

Internamente, engines JavaScript usam estruturas similares a `WeakMap` para armazenar private fields:

```javascript
// Conceitualmente similar a:
const privateFields = new WeakMap();

class Exemplo {
    #campo = 10;
    
    getCampo() {
        return this.#campo;
    }
}

// Internamente:
// privateFields.set(instancia, { campo: 10 });
// getCampo() -> privateFields.get(this).campo
```

**Não é acessível via prototype ou propriedade normal.**

### Princípios Conceituais

#### Declaração Obrigatória

```javascript
class Exemplo {
    // ✅ Declarado no corpo da classe
    #campo;
    
    constructor() {
        this.#campo = 10;  // Inicialização
    }
}

class Errado {
    constructor() {
        // ❌ SyntaxError: Private field '#campo' must be declared in an enclosing class
        this.#campo = 10;
    }
}
```

Private fields **devem** ser declarados no corpo da classe.

#### Inacessível de Fora

```javascript
class Exemplo {
    #privado = 'secreto';
}

const obj = new Exemplo();

// ❌ SyntaxError
// obj.#privado;

// ❌ Undefined (não existe como propriedade normal)
console.log(obj.privado);  // undefined
console.log(obj['#privado']);  // undefined
```

Nem como propriedade, nem dinamicamente acessível.

#### Acessível Apenas Dentro

```javascript
class Exemplo {
    #privado = 'secreto';
    
    getPrivado() {
        return this.#privado;  // ✅ Dentro da classe
    }
    
    setPrivado(valor) {
        this.#privado = valor;  // ✅ Dentro da classe
    }
}

const obj = new Exemplo();
console.log(obj.getPrivado());  // "secreto"
obj.setPrivado('novo');
console.log(obj.getPrivado());  // "novo"
```

---

## 🔍 Análise Conceitual Profunda

### Private Field Básico

```javascript
class Pessoa {
    #cpf;
    
    constructor(nome, cpf) {
        this.nome = nome;  // Público
        this.#cpf = cpf;   // Privado
    }
    
    getCPF() {
        return this.#cpf;
    }
}

const pessoa = new Pessoa('João', '123.456.789-00');
console.log(pessoa.nome);  // "João" (público)
console.log(pessoa.getCPF());  // "123.456.789-00" (via método)

// ❌ Erro
// pessoa.#cpf;
```

### Private Field com Validação

```javascript
class Produto {
    #preco;
    
    constructor(nome, preco) {
        this.nome = nome;
        this.setPreco(preco);  // Validação via setter
    }
    
    setPreco(preco) {
        if (preco < 0) {
            throw new Error('Preço não pode ser negativo');
        }
        this.#preco = preco;
    }
    
    getPreco() {
        return this.#preco;
    }
    
    aplicarDesconto(percentual) {
        const desconto = this.#preco * (percentual / 100);
        this.#preco -= desconto;
    }
}

const prod = new Produto('Notebook', 3000);
console.log(prod.getPreco());  // 3000

prod.aplicarDesconto(10);
console.log(prod.getPreco());  // 2700

// ❌ Erro: validação impede negativo
// prod.setPreco(-100);
```

### Multiple Private Fields

```javascript
class Usuario {
    #email;
    #senha;
    #dataCriacao;
    
    constructor(email, senha) {
        this.#email = email;
        this.#senha = senha;
        this.#dataCriacao = new Date();
    }
    
    verificarSenha(senha) {
        return this.#senha === senha;
    }
    
    getEmail() {
        return this.#email;
    }
    
    getIdadeConta() {
        return Date.now() - this.#dataCriacao;
    }
}

const user = new Usuario('joao@email.com', 'senha123');
console.log(user.verificarSenha('senha123'));  // true
console.log(user.getEmail());  // "joao@email.com"
```

### Private Methods

```javascript
class Calculadora {
    #validarNumero(num) {
        if (typeof num !== 'number' || isNaN(num)) {
            throw new Error('Valor inválido');
        }
    }
    
    somar(a, b) {
        this.#validarNumero(a);  // ✅ Método privado
        this.#validarNumero(b);
        return a + b;
    }
    
    dividir(a, b) {
        this.#validarNumero(a);
        this.#validarNumero(b);
        
        if (b === 0) {
            throw new Error('Divisão por zero');
        }
        
        return a / b;
    }
}

const calc = new Calculadora();
console.log(calc.somar(10, 5));  // 15

// ❌ Método privado inacessível
// calc.#validarNumero(10);
```

### Private Static Fields

```javascript
class Contador {
    static #contador = 0;
    static #instancias = [];
    
    constructor(nome) {
        this.nome = nome;
        Contador.#contador++;
        Contador.#instancias.push(this);
    }
    
    static getTotal() {
        return this.#contador;
    }
    
    static getInstancias() {
        return this.#instancias;
    }
}

const c1 = new Contador('A');
const c2 = new Contador('B');

console.log(Contador.getTotal());  // 2
console.log(Contador.getInstancias().length);  // 2

// ❌ Static private inacessível
// Contador.#contador;
```

### Getters/Setters para Private Fields

```javascript
class Temperatura {
    #celsius = 0;
    
    get celsius() {
        return this.#celsius;
    }
    
    set celsius(valor) {
        if (valor < -273.15) {
            throw new Error('Abaixo do zero absoluto');
        }
        this.#celsius = valor;
    }
    
    get fahrenheit() {
        return (this.#celsius * 9/5) + 32;
    }
    
    set fahrenheit(valor) {
        this.celsius = (valor - 32) * 5/9;  // Usa setter celsius
    }
}

const temp = new Temperatura();
temp.celsius = 25;
console.log(temp.celsius);     // 25
console.log(temp.fahrenheit);  // 77

temp.fahrenheit = 86;
console.log(temp.celsius);  // 30
```

### Herança e Private Fields

```javascript
class Pai {
    #segredo = 'super secreto';
    
    revelarSegredo() {
        return this.#segredo;
    }
}

class Filho extends Pai {
    #meuSegredo = 'segredo do filho';
    
    tentarAcessarSegredoPai() {
        // ❌ SyntaxError: Private field '#segredo' não acessível
        // return this.#segredo;
        
        // ✅ Apenas via método público do pai
        return this.revelarSegredo();
    }
}

const filho = new Filho();
console.log(filho.tentarAcessarSegredoPai());  // "super secreto"
```

### In Operator com Private Fields

```javascript
class Exemplo {
    #privado;
    
    constructor(valor) {
        this.#privado = valor;
    }
    
    temPrivado() {
        return #privado in this;  // true
    }
    
    static verificar(obj) {
        return #privado in obj;  // Verifica se obj tem #privado
    }
}

const obj = new Exemplo(10);
console.log(obj.temPrivado());  // true

const outroObj = {};
console.log(Exemplo.verificar(outroObj));  // false
```

### Encapsulamento Completo

```javascript
class ContaBancaria {
    #saldo;
    #transacoes = [];
    
    constructor(saldoInicial) {
        this.#saldo = saldoInicial;
        this.#registrarTransacao('Abertura de conta', saldoInicial);
    }
    
    #registrarTransacao(tipo, valor) {
        this.#transacoes.push({
            tipo,
            valor,
            data: new Date(),
            saldoResultante: this.#saldo
        });
    }
    
    depositar(valor) {
        if (valor <= 0) {
            throw new Error('Valor deve ser positivo');
        }
        
        this.#saldo += valor;
        this.#registrarTransacao('Depósito', valor);
    }
    
    sacar(valor) {
        if (valor <= 0) {
            throw new Error('Valor deve ser positivo');
        }
        
        if (valor > this.#saldo) {
            throw new Error('Saldo insuficiente');
        }
        
        this.#saldo -= valor;
        this.#registrarTransacao('Saque', -valor);
    }
    
    getSaldo() {
        return this.#saldo;
    }
    
    getExtrato() {
        return [...this.#transacoes];  // Cópia para evitar modificação
    }
}

const conta = new ContaBancaria(1000);
conta.depositar(500);
conta.sacar(200);

console.log(conta.getSaldo());  // 1300
console.log(conta.getExtrato().length);  // 3 transações

// ❌ Dados privados inacessíveis
// conta.#saldo;
// conta.#transacoes;
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Private Fields

**Use quando:**

1. **Dados sensíveis:** Senhas, tokens, CPF
2. **Estado interno:** Implementação que não deve ser exposta
3. **Validação necessária:** Controlar acesso via métodos
4. **Imutabilidade:** Impedir modificação externa
5. **API pública clara:** Separar interface de implementação

**Exemplos:**

```javascript
// 1. Dados sensíveis
class Usuario {
    #senha;
    
    verificarSenha(senha) {
        return this.#senha === senha;
    }
}

// 2. Estado interno
class Cache {
    #dados = new Map();
    
    get(key) {
        return this.#dados.get(key);
    }
}

// 3. Validação
class Idade {
    #valor;
    
    set valor(v) {
        if (v < 0 || v > 150) throw new Error('Idade inválida');
        this.#valor = v;
    }
}
```

### Quando NÃO Usar Private Fields

**Evite quando:**

1. **Precisa ser público:** Não há razão para esconder
2. **Debugging:** Pode dificultar inspeção (use apenas quando necessário)
3. **Herança:** Subclasses precisam acessar (use protected pattern)

**Exemplo:**

```javascript
// ❌ Não use privado se precisa ser público
class Pessoa {
    #nome;  // Por que privado se não há validação/segredo?
}

// ✅ Use público
class Pessoa {
    nome;
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Não Acessível em Subclasses

```javascript
class Pai {
    #privado = 'secreto';
}

class Filho extends Pai {
    acessar() {
        // ❌ SyntaxError
        // return this.#privado;
    }
}
```

**Solução:** Use métodos protected (convenção `_`) se subclasses precisam acessar.

### Declaração Obrigatória

```javascript
class Exemplo {
    constructor() {
        // ❌ SyntaxError: deve declarar no corpo da classe
        this.#campo = 10;
    }
}

// ✅ Correto
class Exemplo {
    #campo;
    
    constructor() {
        this.#campo = 10;
    }
}
```

### Debugging Pode Ser Difícil

```javascript
class Exemplo {
    #debug = [];
    
    fazer() {
        this.#debug.push('ação');
    }
}

const obj = new Exemplo();
obj.fazer();

// ❌ Não pode inspecionar #debug diretamente no console
// console.log(obj.#debug);

// ✅ Adicione método de debug (remover em produção)
getDebug() {
    return this.#debug;
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Getters/Setters

```javascript
class Exemplo {
    #valor;
    
    get valor() {
        return this.#valor;  // Expor com getter
    }
    
    set valor(v) {
        if (v < 0) throw new Error('Negativo');
        this.#valor = v;  // Validar com setter
    }
}
```

### Relação com Encapsulamento

Private fields são a implementação **real** de encapsulamento em JavaScript.

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. Class Declarations/Expressions
2. Constructor Method
3. Static Methods/Fields
4. Inheritance (extends/super)
5. **Private Fields (#)** (você está aqui)
6. **Public Fields, Getters/Setters** (próximo)

### Preparação para Getters/Setters

Private fields geralmente são expostos via getters/setters:

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

Próximo: **Public Class Fields, Getters e Setters** detalhado.

---

## 📚 Conclusão

**Private fields (#)** fornecem encapsulamento real em JavaScript, protegendo dados internos de acesso externo.

**Conceitos essenciais:**
- **Sintaxe `#`:** `#propriedade` para declarar privado
- **Encapsulamento real:** Inacessível fora da classe (SyntaxError)
- **Declaração obrigatória:** Deve ser declarado no corpo da classe
- **Acessível apenas dentro:** Métodos da classe podem acessar
- **Não herdado:** Subclasses não acessam diretamente
- **Private methods:** `#metodo()` também funciona
- **Private static:** `static #campo` para privado da classe
- **Getters/setters:** Expor de forma controlada
- **Validação:** Controlar acesso e modificação
- **Segurança:** Proteger dados sensíveis

Dominar private fields é essencial para **encapsulamento, APIs robustas e segurança de código**.
