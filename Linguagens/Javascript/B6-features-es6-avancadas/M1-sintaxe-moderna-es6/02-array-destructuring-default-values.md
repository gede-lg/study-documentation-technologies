# Array Destructuring - Default Values: Análise Conceitual

## 🎯 Definição

**Default Values** (valores padrão) em array destructuring permitem especificar valores alternativos que serão usados quando um elemento do array for **undefined** (ou ausente). É uma forma de fornecer fallbacks seguros ao desestruturar arrays que podem ter menos elementos que o esperado.

```javascript
// Sem default values
const [a, b, c] = [1, 2];
console.log(c); // undefined

// Com default values
const [x, y, z = 3] = [1, 2];
console.log(z); // 3 (valor padrão usado)
```

**Conceito:** Fornecer valores de fallback para elementos ausentes ou undefined em desestruturação.

## 📋 Sintaxe

```javascript
const [variavel = valorPadrao] = array;
const [a = 1, b = 2, c = 3] = array;
```

### Exemplo Básico

```javascript
const cores = ['vermelho', 'verde'];

const [cor1 = 'preto', cor2 = 'branco', cor3 = 'azul'] = cores;

console.log(cor1); // 'vermelho' (do array)
console.log(cor2); // 'verde' (do array)
console.log(cor3); // 'azul' (default, array só tem 2 elementos)
```

## 🧠 Fundamentos Teóricos

### Quando Default é Usado

Default values são aplicados **apenas** quando o valor é estritamente **undefined**. Outros valores falsy (null, 0, '', false) **não** ativam o default.

```javascript
// undefined ativa default
const [a = 10] = [undefined];
console.log(a); // 10

// null NÃO ativa default
const [b = 10] = [null];
console.log(b); // null (não 10!)

// 0 NÃO ativa default
const [c = 10] = [0];
console.log(c); // 0 (não 10!)

// '' NÃO ativa default
const [d = 'padrão'] = [''];
console.log(d); // '' (não 'padrão'!)

// false NÃO ativa default
const [e = true] = [false];
console.log(e); // false (não true!)
```

**Princípio:** Default values são ativados por **ausência de valor** (undefined), não por valores falsy.

### Expressões como Default

Default values podem ser **expressões** que são avaliadas **apenas** se necessário (lazy evaluation).

```javascript
function valorCaro() {
  console.log('Calculando...');
  return 100;
}

// Não precisa de default
const [a = valorCaro()] = [50];
console.log(a); // 50
// 'Calculando...' NÃO é impresso

// Precisa de default
const [b = valorCaro()] = [];
// 'Calculando...' é impresso
console.log(b); // 100
```

### Defaults Podem Referenciar Outras Variáveis

```javascript
const [a = 5, b = a * 2, c = a + b] = [10];

console.log(a); // 10 (do array)
console.log(b); // 20 (default: a * 2 = 10 * 2)
console.log(c); // 30 (default: a + b = 10 + 20)

// ⚠️ Ordem importa! Não pode referenciar variável futura
const [x = y, y = 5] = []; // ReferenceError: Cannot access 'y' before initialization
```

## 🔍 Casos de Uso Práticos

### Configurações com Fallbacks

```javascript
function criarServidor(configuracao = []) {
  const [
    porta = 3000,
    host = 'localhost',
    ssl = false,
    timeout = 5000
  ] = configuracao;

  console.log(`Servidor em ${host}:${porta}`);
  console.log(`SSL: ${ssl ? 'ativo' : 'inativo'}`);
  console.log(`Timeout: ${timeout}ms`);

  return { porta, host, ssl, timeout };
}

// Usando apenas alguns valores
criarServidor([8080]);
// Servidor em localhost:8080
// SSL: inativo
// Timeout: 5000ms

// Usando valores padrão completos
criarServidor();
// Servidor em localhost:3000
// SSL: inativo
// Timeout: 5000ms
```

### Retorno de Funções com Defaults

```javascript
function obterCoordenadas(local) {
  if (local === 'São Paulo') {
    return [-23.5505, -46.6333];
  }
  // Retorna undefined implicitamente
}

const [
  latitude = 0,
  longitude = 0
] = obterCoordenadas('cidade_desconhecida') || [];

console.log(`Lat: ${latitude}, Long: ${longitude}`);
// Lat: 0, Long: 0
```

### Parsing com Segurança

```javascript
function parsearData(dataString) {
  if (!dataString) return [];

  return dataString.split('-').map(Number);
}

const [
  ano = 2024,
  mes = 1,
  dia = 1
] = parsearData('2023-12');

console.log(`${dia}/${mes}/${ano}`);
// 1/12/2023 (dia usou default)
```

### Desestruturação de Regex Match

```javascript
function extrairNomeEmail(texto) {
  const regex = /(\w+)\s*<([^>]+)>/;
  const match = texto.match(regex) || [];

  const [
    ,
    nome = 'Anônimo',
    email = 'sem-email@exemplo.com'
  ] = match;

  return { nome, email };
}

console.log(extrairNomeEmail('João <joao@email.com>'));
// { nome: 'João', email: 'joao@email.com' }

console.log(extrairNomeEmail('texto inválido'));
// { nome: 'Anônimo', email: 'sem-email@exemplo.com' }
```

### Paginação com Defaults

```javascript
function listarProdutos(opcoes = []) {
  const [
    pagina = 1,
    itensPorPagina = 10,
    ordenar = 'nome',
    crescente = true
  ] = opcoes;

  console.log(`Página ${pagina}, ${itensPorPagina} itens/página`);
  console.log(`Ordenar por: ${ordenar} (${crescente ? 'crescente' : 'decrescente'})`);

  return {
    pagina,
    itensPorPagina,
    ordenar,
    crescente
  };
}

listarProdutos([2, 20]);
// Página 2, 20 itens/página
// Ordenar por: nome (crescente)

listarProdutos();
// Página 1, 10 itens/página
// Ordenar por: nome (crescente)
```

## ⚠️ Armadilhas Comuns

### null vs undefined

```javascript
const [a = 'padrão'] = [null];
console.log(a); // null (NÃO 'padrão')

const [b = 'padrão'] = [undefined];
console.log(b); // 'padrão'

// Se quer tratar null também, use operador ??
const array = [null];
const c = array[0] ?? 'padrão';
console.log(c); // 'padrão'
```

### Valores Falsy Não Ativam Default

```javascript
const [a = 10] = [0];
console.log(a); // 0 (não 10, mesmo sendo falsy)

const [b = 'texto'] = [''];
console.log(b); // '' (não 'texto')

const [c = true] = [false];
console.log(c); // false (não true)
```

### Default em Posição Intermediária

```javascript
const array = [1, undefined, 3];

const [a, b = 2, c] = array;

console.log(a); // 1
console.log(b); // 2 (default aplicado)
console.log(c); // 3
```

### Ordem de Referência

```javascript
// ✅ OK: referencia variável anterior
const [a = 1, b = a + 1] = [];
console.log(b); // 2

// ❌ ERRO: tenta referenciar variável posterior
const [x = y, y = 1] = [];
// ReferenceError
```

## 🔗 Combinação com Outras Features

### Default Values + Rest Elements

```javascript
const [primeiro = 0, ...resto] = [1, 2, 3];

console.log(primeiro); // 1
console.log(resto);    // [2, 3]

// Apenas default (array vazio)
const [a = 10, ...outros] = [];

console.log(a);      // 10
console.log(outros); // []
```

### Default Values + Nested Destructuring

```javascript
const matriz = [
  [1, 2]
  // segunda linha ausente
];

const [
  [a = 0, b = 0] = [0, 0],
  [c = 0, d = 0] = [0, 0]
] = matriz;

console.log(a, b); // 1, 2
console.log(c, d); // 0, 0 (segunda linha usou default completo)
```

### Default Values em Parâmetros

```javascript
function processar([a = 1, b = 2, c = 3] = []) {
  return a + b + c;
}

console.log(processar([5, 10]));    // 18 (5 + 10 + 3)
console.log(processar([5]));        // 10 (5 + 2 + 3)
console.log(processar([]));         // 6 (1 + 2 + 3)
console.log(processar());           // 6 (default completo)
```

## 🚀 Boas Práticas

### Use Defaults para Segurança

```javascript
// ✅ Bom: protege contra undefined
function calcular([a = 0, b = 0]) {
  return a + b;
}

// ❌ Ruim: pode quebrar
function calcular([a, b]) {
  return a + b; // NaN se algum for undefined
}
```

### Valores Padrão Semânticos

```javascript
// ✅ Bom: defaults fazem sentido
const [
  porta = 3000,
  ambiente = 'desenvolvimento'
] = configuracao;

// ❌ Ruim: defaults arbitrários
const [x = 999, y = 'foo'] = dados;
```

### Documentar Defaults

```javascript
/**
 * Cria conexão com banco de dados
 * @param {Array} opcoes - [host, porta, usuario, senha]
 * @default ['localhost', 5432, 'admin', '']
 */
function conectar([
  host = 'localhost',
  porta = 5432,
  usuario = 'admin',
  senha = ''
] = []) {
  // ...
}
```

Default values em array destructuring fornecem uma camada de segurança e flexibilidade essencial ao trabalhar com arrays que podem ter tamanhos variáveis ou elementos ausentes, tornando o código mais robusto e previsível.
