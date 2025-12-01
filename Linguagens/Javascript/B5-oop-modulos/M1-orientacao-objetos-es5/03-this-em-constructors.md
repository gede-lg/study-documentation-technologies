# This em Constructors: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

Dentro de um **function constructor**, a palavra-chave **`this`** refere-se ao **novo objeto sendo criado** quando a função é invocada com o operador `new`. Conceitualmente, `this` é o **contexto de execução** que permite ao constructor inicializar propriedades e métodos no objeto que está sendo instanciado.

```javascript
function Pessoa(nome, idade) {
  // 'this' = novo objeto vazio criado por 'new'
  this.nome = nome;     // Adiciona propriedade ao novo objeto
  this.idade = idade;   // Adiciona propriedade ao novo objeto

  console.log(this); // { nome: 'João', idade: 30 }
}

const p = new Pessoa('João', 30);
```

## 📋 Como `this` é Vinculado

Quando `new Constructor()` é chamado:

```javascript
function Animal(tipo) {
  // new cria: const novoObjeto = {};
  // new vincula: this = novoObjeto;

  this.tipo = tipo;

  // new retorna: return this;
}

const cachorro = new Animal('Cachorro');
// cachorro = { tipo: 'Cachorro' }
```

**Ordem de eventos:**
1. `new` cria objeto vazio
2. `this` é atribuído a esse objeto
3. Constructor executa, modificando `this`
4. `this` é retornado automaticamente

## 🧠 Fundamentos Teóricos

### This vs Outros Contextos

```javascript
function Exemplo() {
  console.log(this);
}

// 1. Invocação normal - this = window (ou undefined em strict mode)
Exemplo();

// 2. Como método - this = objeto
const obj = { metodo: Exemplo };
obj.metodo(); // this = obj

// 3. Com new - this = novo objeto
const instancia = new Exemplo(); // this = novo objeto vazio
```

### Propriedades de Instância via This

```javascript
function Produto(nome, preco, estoque) {
  // Cada propriedade definida com 'this' é única para esta instância
  this.nome = nome;
  this.preco = preco;
  this.estoque = estoque;

  // Propriedade calculada
  this.valorTotal = preco * estoque;

  // Timestamp de criação
  this.criadoEm = new Date();
}

const p1 = new Produto('Notebook', 3000, 10);
const p2 = new Produto('Mouse', 50, 100);

console.log(p1.nome); // 'Notebook'
console.log(p2.nome); // 'Mouse'

// Cada instância tem suas próprias propriedades
console.log(p1.nome === p2.nome); // false (valores diferentes)
```

### This em Métodos do Prototype

```javascript
function Contador(valor) {
  this.valor = valor;
}

Contador.prototype.incrementar = function() {
  // Dentro de método do prototype, 'this' é a instância que chamou
  this.valor++;
  return this.valor;
};

const c1 = new Contador(0);
const c2 = new Contador(10);

c1.incrementar(); // this = c1, valor vira 1
c2.incrementar(); // this = c2, valor vira 11

console.log(c1.valor); // 1
console.log(c2.valor); // 11
```

## 🔍 Análise Profunda

### This e Closure

```javascript
function Usuario(nome) {
  this.nome = nome;

  // Variável privada (closure)
  let senha = '123';

  // Método que acessa 'this' e closure
  this.autenticar = function(senhaFornecida) {
    // 'this' acessa propriedade pública
    // 'senha' acessa variável privada via closure
    return senhaFornecida === senha;
  };
}

const user = new Usuario('João');
console.log(user.nome); // 'João' (público)
console.log(user.senha); // undefined (privado)
console.log(user.autenticar('123')); // true
```

### This Perdido

```javascript
function Tarefa(titulo) {
  this.titulo = titulo;
  this.concluida = false;
}

Tarefa.prototype.concluir = function() {
  this.concluida = true;
  console.log(`${this.titulo} concluída!`);
};

const tarefa = new Tarefa('Estudar JavaScript');

// ❌ This perdido quando método é passado como callback
setTimeout(tarefa.concluir, 1000);
// Erro! this = window, não tarefa

// ✅ Soluções:

// 1. Arrow function
setTimeout(() => tarefa.concluir(), 1000);

// 2. Bind
setTimeout(tarefa.concluir.bind(tarefa), 1000);

// 3. Wrapper function
setTimeout(function() {
  tarefa.concluir();
}, 1000);
```

### Exemplo Completo: Conta Bancária

```javascript
function ContaBancaria(titular, saldoInicial) {
  // Propriedades públicas via this
  this.titular = titular;
  this.saldo = saldoInicial || 0;
  this.ativa = true;

  // "Propriedade privada" via closure
  let transacoes = [];

  // Método que usa this e closure
  this.depositar = function(valor) {
    if (!this.ativa) {
      throw new Error('Conta inativa');
    }

    this.saldo += valor;
    transacoes.push({ tipo: 'depósito', valor, data: new Date() });

    console.log(`${this.titular} depositou R$ ${valor}`);
    return this.saldo;
  };

  this.sacar = function(valor) {
    if (!this.ativa) {
      throw new Error('Conta inativa');
    }

    if (valor > this.saldo) {
      throw new Error('Saldo insuficiente');
    }

    this.saldo -= valor;
    transacoes.push({ tipo: 'saque', valor, data: new Date() });

    console.log(`${this.titular} sacou R$ ${valor}`);
    return this.saldo;
  };

  this.obterExtrato = function() {
    console.log(`\n=== Extrato de ${this.titular} ===`);
    console.log(`Saldo atual: R$ ${this.saldo}\n`);
    console.log('Transações:');
    transacoes.forEach((t, i) => {
      console.log(`${i + 1}. ${t.tipo} de R$ ${t.valor} em ${t.data.toLocaleString()}`);
    });
  };
}

// Uso
const conta = new ContaBancaria('Maria Silva', 1000);

conta.depositar(500);   // Maria Silva depositou R$ 500
conta.sacar(200);       // Maria Silva sacou R$ 200
conta.obterExtrato();

/* Output:
=== Extrato de Maria Silva ===
Saldo atual: R$ 1300

Transações:
1. depósito de R$ 500 em ...
2. saque de R$ 200 em ...
*/
```

## ⚠️ Armadilhas Comuns

### 1. Esquecer `new`

```javascript
function Pessoa(nome) {
  this.nome = nome; // 'this' será window!
}

const p = Pessoa('João'); // Sem new
console.log(p); // undefined
console.log(window.nome); // 'João' (ERRO!)
```

### 2. Retornar Primitivo

```javascript
function Teste() {
  this.valor = 42;
  return 100; // Ignorado (primitivo)
}

const obj = new Teste();
console.log(obj.valor); // 42 (retorno ignorado, this retornado)
```

### 3. Retornar Objeto

```javascript
function Teste() {
  this.valor = 42;
  return { outro: 'objeto' }; // Sobrescreve this!
}

const obj = new Teste();
console.log(obj.valor); // undefined
console.log(obj.outro); // 'objeto'
```

## 🔗 Interconexões

- **Function Constructors:** `this` inicializa instâncias
- **new operator:** `new` vincula `this` ao novo objeto
- **Prototype:** Métodos acessam instância via `this`
- **Closures:** Combinação de `this` e closures cria privacidade
- **Classes ES6:** `this` no `constructor()` funciona identicamente

## 🚀 Conclusão

`this` em constructors é o mecanismo fundamental que permite:
- Inicializar propriedades únicas de cada instância
- Acessar e modificar estado do objeto
- Vincular métodos ao contexto correto

Dominar `this` é essencial para programação orientada a objetos em JavaScript.
