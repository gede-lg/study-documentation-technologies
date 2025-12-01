# Object Destructuring - Sintaxe Básica: Análise Conceitual

## 🎯 Definição

**Object Destructuring** (desestruturação de objetos) é uma sintaxe JavaScript ES6 que permite **extrair propriedades de objetos** e atribuí-las a variáveis individuais, usando um padrão que espelha a estrutura do objeto. Diferente de arrays (que usam posição), objetos usam **nomes de propriedades** para correspondência.

```javascript
// Sem destructuring
const usuario = { nome: 'João', idade: 30, cidade: 'SP' };
const nome = usuario.nome;
const idade = usuario.idade;
const cidade = usuario.cidade;

// Com destructuring
const { nome, idade, cidade } = usuario;

console.log(nome);   // 'João'
console.log(idade);  // 30
console.log(cidade); // 'SP'
```

**Conceito:** Extrair propriedades de objetos através de pattern matching por nome de chave.

## 📋 Sintaxe Fundamental

```javascript
const { propriedade1, propriedade2 } = objeto;
```

### Exemplo Básico

```javascript
const pessoa = {
  nome: 'Maria',
  idade: 25,
  profissao: 'Desenvolvedora'
};

const { nome, idade, profissao } = pessoa;

console.log(nome);      // 'Maria'
console.log(idade);     // 25
console.log(profissao); // 'Desenvolvedora'
```

## 🧠 Fundamentos Teóricos

### Pattern Matching por Nome

Diferente de arrays (posição), objetos usam **nomes de propriedades**.

```javascript
const obj = { a: 1, b: 2, c: 3 };

// Ordem não importa!
const { c, a, b } = obj;

console.log(a); // 1
console.log(b); // 2
console.log(c); // 3

// Mesmo resultado que:
const { a, b, c } = obj;
```

### Propriedades Não Existentes

```javascript
const obj = { a: 1, b: 2 };

const { a, b, c, d } = obj;

console.log(a); // 1
console.log(b); // 2
console.log(c); // undefined
console.log(d); // undefined
```

### Subconjunto de Propriedades

```javascript
const usuario = {
  id: 1,
  nome: 'João',
  email: 'joao@email.com',
  idade: 30,
  cidade: 'SP',
  pais: 'Brasil'
};

// Extrair apenas algumas propriedades
const { nome, email } = usuario;

console.log(nome);  // 'João'
console.log(email); // 'joao@email.com'
// Outras propriedades são ignoradas
```

## 🔍 Casos de Uso Práticos

### Parâmetros de Função

```javascript
// Antes
function criarUsuario(opcoes) {
  const nome = opcoes.nome;
  const idade = opcoes.idade;
  const cidade = opcoes.cidade || 'Não informado';
  // ...
}

// Depois (destructuring)
function criarUsuario({ nome, idade, cidade = 'Não informado' }) {
  console.log(nome, idade, cidade);
}

criarUsuario({ nome: 'Ana', idade: 28, cidade: 'RJ' });
```

### Retorno de Funções

```javascript
function calcularEstatisticas(numeros) {
  const soma = numeros.reduce((a, b) => a + b, 0);
  const media = soma / numeros.length;
  const max = Math.max(...numeros);
  const min = Math.min(...numeros);

  return { soma, media, max, min };
}

const { soma, media, max, min } = calcularEstatisticas([1, 2, 3, 4, 5]);

console.log(`Soma: ${soma}, Média: ${media}`);
console.log(`Max: ${max}, Min: ${min}`);
```

### APIs e Respostas JSON

```javascript
async function buscarUsuario(id) {
  const resposta = await fetch(`/api/usuarios/${id}`);
  const dados = await resposta.json();

  const {
    nome,
    email,
    perfil: { foto, bio }
  } = dados;

  return { nome, email, foto, bio };
}
```

### Configurações

```javascript
function inicializarApp(config) {
  const {
    porta,
    host,
    database,
    cache
  } = config;

  console.log(`Servidor: ${host}:${porta}`);
  console.log(`Database: ${database}`);
  console.log(`Cache: ${cache ? 'ativo' : 'inativo'}`);
}

inicializarApp({
  porta: 3000,
  host: 'localhost',
  database: 'mongodb://localhost/app',
  cache: true
});
```

### Extrair de this

```javascript
class Usuario {
  constructor(nome, idade, cidade) {
    this.nome = nome;
    this.idade = idade;
    this.cidade = cidade;
  }

  apresentar() {
    const { nome, idade, cidade } = this;
    return `${nome}, ${idade} anos, de ${cidade}`;
  }
}

const user = new Usuario('Pedro', 35, 'BH');
console.log(user.apresentar());
// 'Pedro, 35 anos, de BH'
```

### Loop sobre Array de Objetos

```javascript
const produtos = [
  { id: 1, nome: 'Notebook', preco: 3000 },
  { id: 2, nome: 'Mouse', preco: 50 },
  { id: 3, nome: 'Teclado', preco: 200 }
];

for (const { nome, preco } of produtos) {
  console.log(`${nome}: R$ ${preco}`);
}

// Saída:
// Notebook: R$ 3000
// Mouse: R$ 50
// Teclado: R$ 200
```

### Destructuring em Callbacks

```javascript
const usuarios = [
  { id: 1, nome: 'João', ativo: true },
  { id: 2, nome: 'Maria', ativo: false },
  { id: 3, nome: 'Pedro', ativo: true }
];

// map com destructuring
const nomes = usuarios.map(({ nome }) => nome);
console.log(nomes); // ['João', 'Maria', 'Pedro']

// filter com destructuring
const ativos = usuarios.filter(({ ativo }) => ativo);
console.log(ativos);
// [{ id: 1, nome: 'João', ativo: true }, { id: 3, nome: 'Pedro', ativo: true }]
```

## ⚠️ Armadilhas Comuns

### Propriedade com Nome Inválido

```javascript
const obj = {
  'nome-completo': 'João Silva',
  'data-nascimento': '1990-01-15'
};

// ❌ ERRO: hífens não são identificadores válidos
const { nome-completo } = obj; // SyntaxError

// ✅ Precisa renomear (próximo tópico)
const { 'nome-completo': nomeCompleto } = obj;
console.log(nomeCompleto); // 'João Silva'
```

### Objeto Null/Undefined

```javascript
const obj = null;

// ❌ ERRO
const { prop } = obj; // TypeError: Cannot destructure property 'prop' of 'null'

// ✅ Proteção
const { prop } = obj || {};
console.log(prop); // undefined
```

### Confusão com Arrays

```javascript
const array = [1, 2, 3];

// ❌ Destructuring de objeto não funciona em array primitivo
const { 0: primeiro } = array; // Tecnicamente funciona, mas estranho

// ✅ Use array destructuring
const [primeiro] = array;
```

### Redeclaração

```javascript
let nome = 'João';

// ❌ ERRO: redeclaração
let { nome } = { nome: 'Maria' }; // SyntaxError

// ✅ Reatribuição sem let/const
({ nome } = { nome: 'Maria' });
// Nota: parênteses obrigatórios!

console.log(nome); // 'Maria'
```

### Parênteses em Statement

```javascript
// ❌ ERRO: parece bloco de código
{ nome } = { nome: 'João' }; // SyntaxError

// ✅ Parênteses tornam expressão
({ nome } = { nome: 'João' });

// Ou declaração
const { nome } = { nome: 'João' };
```

## 🚀 Vantagens

- ✅ **Concisão:** Menos código para extrair múltiplas propriedades
- ✅ **Legibilidade:** Nomes descritivos, clara intenção
- ✅ **Ordem Irrelevante:** Não importa ordem das propriedades
- ✅ **Seletividade:** Extrair apenas o necessário

Object destructuring é fundamental para código moderno JavaScript, tornando manipulação de objetos mais expressiva e concisa, especialmente em parâmetros de função, retornos de APIs e configurações.
