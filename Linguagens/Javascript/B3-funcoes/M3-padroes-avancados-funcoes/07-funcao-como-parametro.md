# Função como Parâmetro: Higher-Order Functions em JavaScript

## 🎯 Introdução e Definição

### Definição Conceitual

**Função como parâmetro** refere-se à capacidade do JavaScript de **passar funções como argumentos** para outras funções, que é possível porque funções são **first-class citizens** (cidadãos de primeira classe) na linguagem. Uma função que recebe outra função como parâmetro ou retorna uma função é chamada de **Higher-Order Function** (função de ordem superior).

Este conceito implementa o princípio de **composição funcional** e **abstração comportamental** - ao invés de passar apenas dados para funções, passamos comportamentos inteiros que podem ser executados, modificados ou combinados de formas flexíveis.

Conceitualmente, isso transforma funções em **blocos de comportamento reutilizáveis e compostos**, permitindo abstrair não apenas dados, mas lógica de controle e operações complexas.

```javascript
// Função de ordem superior (recebe função como parâmetro)
function executarOperacao(a, b, operacao) {
  return operacao(a, b); // Executa a função passada
}

// Passando funções como parâmetros
const soma = (x, y) => x + y;
const multiplicacao = (x, y) => x * y;

console.log(executarOperacao(5, 3, soma)); // 8
console.log(executarOperacao(5, 3, multiplicacao)); // 15
```

### Contexto Histórico

JavaScript foi projetado desde o início (1995) com funções como first-class citizens, influenciado por linguagens funcionais como Scheme e Lisp. Este design permitiu:

- **Programação funcional:** JavaScript herdou características funcionais
- **Event-driven programming:** Callbacks em eventos DOM
- **Array methods (ES5):** map, filter, reduce revolucionaram processamento de arrays
- **Promises e async/await:** Baseiam-se em passar funções como callbacks
- **React Hooks:** Funções como parâmetros para componentização

### Problema que Resolve

Passar funções como parâmetros resolve problemas fundamentais de **flexibilidade** e **reutilização**:

**1. Código Duplicado:** Evita repetir estruturas similares
**2. Comportamento Customizável:** Permite injetar lógica personalizada
**3. Abstração:** Separa "o quê fazer" de "como fazer"
**4. Composição:** Combina comportamentos simples em complexos

**Sem higher-order functions:**

```javascript
// ❌ Código duplicado
function somarArray(arr) {
  let resultado = 0;
  for (let i = 0; i < arr.length; i++) {
    resultado += arr[i];
  }
  return resultado;
}

function multiplicarArray(arr) {
  let resultado = 1;
  for (let i = 0; i < arr.length; i++) {
    resultado *= arr[i];
  }
  return resultado;
}
```

**Com higher-order functions:**

```javascript
// ✅ Código reutilizável
function reduzirArray(arr, operacao, valorInicial) {
  let resultado = valorInicial;
  for (let i = 0; i < arr.length; i++) {
    resultado = operacao(resultado, arr[i]);
  }
  return resultado;
}

const soma = reduzirArray([1, 2, 3], (acc, n) => acc + n, 0);
const produto = reduzirArray([1, 2, 3], (acc, n) => acc * n, 1);
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **First-Class Functions:** Funções são valores tratados como qualquer outro tipo
2. **Higher-Order Functions:** Funções que recebem ou retornam funções
3. **Callback Pattern:** Função passada para ser chamada depois
4. **Abstração Comportamental:** Parametrizar comportamento, não apenas dados
5. **Composição Funcional:** Combinar funções para criar novas funcionalidades

### Pilares Fundamentais

- **Functions as Values:** Funções podem ser atribuídas, passadas, retornadas
- **Delayed Execution:** Função passada é executada depois (callback)
- **Parameterization:** Injetar comportamento customizado
- **Reusability:** Código genérico reutilizável
- **Declarative Code:** Expressar "o quê" em vez de "como"

---

## 🧠 Fundamentos Teóricos

### First-Class Functions

**Conceito:** Em JavaScript, funções são **valores de primeira classe**, o que significa que podem ser:

1. Atribuídas a variáveis
2. Passadas como argumentos
3. Retornadas de outras funções
4. Armazenadas em estruturas de dados

```javascript
// 1. Atribuir a variável
const saudar = function(nome) {
  return `Olá, ${nome}!`;
};

// 2. Passar como argumento
function executar(funcao, valor) {
  return funcao(valor);
}

console.log(executar(saudar, "João")); // "Olá, João!"

// 3. Retornar de função
function criarSaudacao(prefixo) {
  return function(nome) {
    return `${prefixo}, ${nome}!`;
  };
}

const saudarFormalmente = criarSaudacao("Bom dia");
console.log(saudarFormalmente("Maria")); // "Bom dia, Maria!"

// 4. Armazenar em estruturas
const operacoes = {
  somar: (a, b) => a + b,
  subtrair: (a, b) => a - b
};

console.log(operacoes.somar(5, 3)); // 8
```

### Higher-Order Functions

**Definição:** Função que satisfaz pelo menos uma das condições:
- Recebe uma ou mais funções como parâmetros
- Retorna uma função como resultado

```javascript
// Recebe função como parâmetro
function aplicarDuasVezes(valor, funcao) {
  return funcao(funcao(valor));
}

const dobrar = x => x * 2;
console.log(aplicarDuasVezes(5, dobrar)); // 20 (5 * 2 * 2)

// Retorna função
function multiplicadorPor(fator) {
  return function(numero) {
    return numero * fator;
  };
}

const multiplicarPor3 = multiplicadorPor(3);
console.log(multiplicarPor3(10)); // 30
```

**Análise conceitual:**
- `aplicarDuasVezes` é higher-order (recebe `funcao` como parâmetro)
- `multiplicadorPor` é higher-order (retorna função)
- Isso permite **composição** e **abstração** de comportamento

---

## 🔍 Análise Conceitual Profunda

### Padrão Básico: Função como Callback

**Conceito:** Passar função para ser executada posteriormente (síncrona ou assincronamente).

```javascript
// Callback síncrono
function processar(dados, callback) {
  console.log("Processando...");
  const resultado = dados.toUpperCase();
  callback(resultado); // Executa callback passado
}

processar("javascript", (resultado) => {
  console.log("Resultado:", resultado); // "JAVASCRIPT"
});

// Callback assíncrono
function buscarDados(callback) {
  console.log("Buscando dados...");
  setTimeout(() => {
    callback({ id: 1, nome: "João" });
  }, 1000);
}

buscarDados((dados) => {
  console.log("Dados recebidos:", dados);
});
```

**Análise:**
- `processar` e `buscarDados` são higher-order functions
- Recebem `callback` como parâmetro e o invocam
- Isso implementa **inversão de controle** - quem chama decide o comportamento

### Array Methods: Built-in Higher-Order Functions

JavaScript tem métodos nativos de array que são higher-order functions:

#### map - Transformação

```javascript
const numeros = [1, 2, 3, 4, 5];

// map recebe função que transforma cada elemento
const dobrados = numeros.map(n => n * 2);
console.log(dobrados); // [2, 4, 6, 8, 10]

// Função nomeada também funciona
function quadrado(n) {
  return n * n;
}

const quadrados = numeros.map(quadrado);
console.log(quadrados); // [1, 4, 9, 16, 25]
```

**Conceito:** `map` abstrai iteração e aplica transformação passada.

#### filter - Seleção

```javascript
const numeros = [1, 2, 3, 4, 5, 6];

// filter recebe função de predicado (retorna boolean)
const pares = numeros.filter(n => n % 2 === 0);
console.log(pares); // [2, 4, 6]

// Função complexa de filtro
const usuarios = [
  { nome: "João", idade: 25 },
  { nome: "Maria", idade: 17 },
  { nome: "Pedro", idade: 30 }
];

const maioresDeIdade = usuarios.filter(user => user.idade >= 18);
console.log(maioresDeIdade);
// [{ nome: "João", idade: 25 }, { nome: "Pedro", idade: 30 }]
```

**Conceito:** `filter` abstrai seleção condicional.

#### reduce - Agregação

```javascript
const numeros = [1, 2, 3, 4, 5];

// reduce recebe função acumuladora
const soma = numeros.reduce((acumulador, numero) => {
  return acumulador + numero;
}, 0);

console.log(soma); // 15

// Exemplo complexo: agrupar por propriedade
const pessoas = [
  { nome: "João", cidade: "SP" },
  { nome: "Maria", cidade: "RJ" },
  { nome: "Pedro", cidade: "SP" }
];

const porCidade = pessoas.reduce((acc, pessoa) => {
  if (!acc[pessoa.cidade]) {
    acc[pessoa.cidade] = [];
  }
  acc[pessoa.cidade].push(pessoa.nome);
  return acc;
}, {});

console.log(porCidade);
// { SP: ["João", "Pedro"], RJ: ["Maria"] }
```

**Conceito:** `reduce` é a higher-order function mais poderosa - pode implementar qualquer operação de agregação.

### forEach - Iteração com Efeitos Colaterais

```javascript
const numeros = [1, 2, 3];

// forEach recebe função para executar em cada elemento
numeros.forEach((numero, indice) => {
  console.log(`Índice ${indice}: ${numero}`);
});

// Diferença de map: forEach não retorna novo array
const resultado = numeros.forEach(n => n * 2);
console.log(resultado); // undefined (forEach não retorna nada)
```

**Conceito:** `forEach` é para efeitos colaterais, não transformação.

### Composição de Funções

**Conceito:** Combinar múltiplas funções em uma pipeline.

```javascript
// Funções simples
const dobrar = x => x * 2;
const incrementar = x => x + 1;
const quadrado = x => x * x;

// Composição manual
const numero = 5;
const resultado = quadrado(incrementar(dobrar(numero)));
console.log(resultado); // 121 ((5 * 2 + 1)²)

// Função de composição genérica
function compor(...funcoes) {
  return function(valor) {
    return funcoes.reduceRight((acc, fn) => fn(acc), valor);
  };
}

const transformacao = compor(quadrado, incrementar, dobrar);
console.log(transformacao(5)); // 121

// Pipe (esquerda para direita)
function pipe(...funcoes) {
  return function(valor) {
    return funcoes.reduce((acc, fn) => fn(acc), valor);
  };
}

const pipeline = pipe(dobrar, incrementar, quadrado);
console.log(pipeline(5)); // 121
```

**Análise:**
- `compor` e `pipe` são higher-order functions que retornam funções
- Permitem criar transformações complexas de forma declarativa
- `reduceRight` executa da direita para esquerda (composição matemática)
- `reduce` executa da esquerda para direita (pipeline)

### Currying e Partial Application

**Currying:** Transformar função de múltiplos parâmetros em cadeia de funções de um parâmetro.

```javascript
// Função normal
function somar(a, b, c) {
  return a + b + c;
}

// Versão curried
function somarCurried(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

console.log(somarCurried(1)(2)(3)); // 6

// Arrow functions simplificam
const somarCurry = a => b => c => a + b + c;
console.log(somarCurry(1)(2)(3)); // 6

// Partial application
const somar5 = somarCurry(5);
const somar5e10 = somar5(10);
console.log(somar5e10(3)); // 18
```

**Conceito:** Currying permite criar funções especializadas a partir de funções genéricas.

### Exemplo Prático: Sistema de Validação

```javascript
// Funções de validação como parâmetros
const validarEmail = email => email.includes("@");
const validarTamanho = (texto, min) => texto.length >= min;
const validarNumerico = valor => !isNaN(valor);

// Higher-order function: validador genérico
function criarValidador(regras) {
  return function(dados) {
    const erros = [];

    for (const campo in regras) {
      const valor = dados[campo];
      const validacoes = regras[campo];

      for (const validacao of validacoes) {
        if (!validacao.funcao(valor, validacao.parametro)) {
          erros.push({
            campo,
            mensagem: validacao.mensagem
          });
        }
      }
    }

    return {
      valido: erros.length === 0,
      erros
    };
  };
}

// Criar validador customizado
const validarUsuario = criarValidador({
  email: [
    {
      funcao: validarEmail,
      mensagem: "Email inválido"
    }
  ],
  senha: [
    {
      funcao: (senha) => validarTamanho(senha, 8),
      mensagem: "Senha deve ter no mínimo 8 caracteres"
    }
  ]
});

// Usar
const resultado = validarUsuario({
  email: "joao@example.com",
  senha: "123"
});

console.log(resultado);
// { valido: false, erros: [{ campo: "senha", mensagem: "..." }] }
```

**Análise conceitual:**
- `criarValidador` é higher-order function que retorna validador customizado
- Funções de validação são passadas como parâmetros
- Sistema altamente extensível e reutilizável

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Funções como Parâmetros

**✅ Use quando:**

1. **Comportamento Variável:** Lógica muda entre chamadas
2. **Callbacks:** Executar código após operação assíncrona
3. **Array Processing:** Transformar, filtrar, reduzir coleções
4. **Event Handlers:** Reagir a eventos DOM
5. **Estratégias:** Implementar padrão Strategy
6. **Composição:** Combinar funções pequenas em complexas

**Exemplos de contextos:**

- APIs de array (`map`, `filter`, `reduce`)
- Event listeners (`addEventListener`)
- Timers (`setTimeout`, `setInterval`)
- Promises (`.then()`, `.catch()`)
- Bibliotecas funcionais (Lodash, Ramda)
- React (hooks, callbacks de props)

### Padrões Comuns

**1. Template Method:**

```javascript
function processarArquivo(arquivo, parser) {
  const dados = lerArquivo(arquivo);
  const parseado = parser(dados); // Comportamento injetado
  return salvar(parseado);
}

processarArquivo("dados.json", JSON.parse);
processarArquivo("dados.csv", parseCSV);
```

**2. Strategy Pattern:**

```javascript
const estrategias = {
  desconto10: preco => preco * 0.9,
  desconto20: preco => preco * 0.8,
  semDesconto: preco => preco
};

function calcularPreco(preco, estrategia) {
  return estrategias[estrategia](preco);
}
```

**3. Decorators:**

```javascript
function medirTempo(funcao) {
  return function(...args) {
    const inicio = Date.now();
    const resultado = funcao(...args);
    console.log(`Tempo: ${Date.now() - inicio}ms`);
    return resultado;
  };
}

const calcularLento = medirTempo(function(n) {
  let soma = 0;
  for (let i = 0; i < n; i++) soma += i;
  return soma;
});
```

---

## ⚠️ Limitações e Considerações

### Performance

**Overhead de Chamadas:** Cada chamada de função tem custo (pequeno mas existente).

```javascript
// Mais lento (múltiplas iterações)
const resultado = array
  .map(x => x * 2)
  .filter(x => x > 10)
  .reduce((a, b) => a + b, 0);

// Mais rápido (uma iteração)
const resultado = array.reduce((acc, x) => {
  const dobrado = x * 2;
  if (dobrado > 10) acc += dobrado;
  return acc;
}, 0);
```

### Legibilidade

Excesso de abstrações pode prejudicar legibilidade:

```javascript
// ❌ Muito abstrato
const resultado = compor(
  map(quadrado),
  filter(par),
  reduce(somar, 0)
)(numeros);

// ✅ Mais claro
const resultado = numeros
  .map(quadrado)
  .filter(par)
  .reduce(somar, 0);
```

---

## 🔗 Interconexões Conceituais

**Conceitos Relacionados:**
- **Closures:** Funções passadas mantêm referência ao escopo
- **Callbacks:** Padrão específico de função como parâmetro
- **Promises:** Usam funções como parâmetros (`.then()`)
- **Async/Await:** Sintaxe sobre promises que também usa callbacks
- **Programação Funcional:** Paradigma baseado em funções como valores

**Progressão:**
1. First-class functions (fundamento)
2. Higher-order functions (este tópico)
3. Closures (captura de escopo)
4. Callbacks (padrão específico)
5. Promises e Async/Await (evolução de callbacks)

---

## 🚀 Evolução e Próximos Conceitos

**Próximos Tópicos:**
- **Event Callbacks:** Uso em eventos DOM
- **Error-First Callbacks:** Convenção Node.js
- **Callback Hell:** Problema e soluções
- **Promises:** Alternativa a callbacks aninhados
- **Async/Await:** Sintaxe síncrona para código assíncrono

Entender funções como parâmetros é **essencial** para dominar JavaScript moderno e programação funcional. É a base para callbacks, promises, e praticamente toda API assíncrona da linguagem.
