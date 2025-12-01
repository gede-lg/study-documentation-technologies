# Object Destructuring - Computed Property Names: Análise Conceitual

## 🎯 Definição

**Computed Property Names** (nomes de propriedades computados) em object destructuring permitem usar **expressões dinâmicas** entre colchetes `[]` para determinar qual propriedade extrair em tempo de execução, ao invés de nomes fixos.

```javascript
const obj = {
  nome: 'João',
  idade: 30,
  cidade: 'SP'
};

const chave = 'nome';

// Propriedade computada
const { [chave]: valor } = obj;

console.log(valor); // 'João'
```

**Conceito:** Extrair propriedades dinamicamente usando expressões avaliadas em runtime.

## 📋 Sintaxe

```javascript
const { [expressao]: nomeVariavel } = objeto;
```

**Importante:** Ao usar computed property, **deve renomear** a variável (não pode omitir `: nomeVariavel`).

```javascript
// ❌ ERRO: falta renomeação
const { [chave] } = obj; // SyntaxError

// ✅ CORRETO
const { [chave]: valor } = obj;
```

## 🧠 Fundamentos Teóricos

### Avaliação em Runtime

```javascript
const usuario = {
  nome: 'Maria',
  email: 'maria@email.com',
  telefone: '1234-5678'
};

function extrair(obj, propriedade) {
  const { [propriedade]: valor } = obj;
  return valor;
}

console.log(extrair(usuario, 'nome'));     // 'Maria'
console.log(extrair(usuario, 'email'));    // 'maria@email.com'
console.log(extrair(usuario, 'telefone')); // '1234-5678'
```

### Expressões Complexas

```javascript
const dados = {
  'prop-1': 'A',
  'prop-2': 'B',
  'prop-3': 'C'
};

const numero = 2;

const { [`prop-${numero}`]: valor } = dados;

console.log(valor); // 'B' (prop-2)
```

## 🔍 Casos de Uso Práticos

### Acessar Propriedades Dinamicamente

```javascript
const configuracao = {
  desenvolvimento: { api: 'http://localhost' },
  producao: { api: 'https://api.com' }
};

const ambiente = process.env.NODE_ENV || 'desenvolvimento';

const { [ambiente]: { api } } = configuracao;

console.log(api); // URL baseada no ambiente
```

### Tradução/Internacionalização

```javascript
const traducoes = {
  pt: { saudacao: 'Olá', despedida: 'Tchau' },
  en: { saudacao: 'Hello', despedida: 'Goodbye' },
  es: { saudacao: 'Hola', despedida: 'Adiós' }
};

const idioma = 'pt';

const { [idioma]: { saudacao, despedida } } = traducoes;

console.log(saudacao); // 'Olá'
console.log(despedida); // 'Tchau'
```

### Extrair de Map/Object Dinâmico

```javascript
const cache = {
  'usuario-1': { nome: 'João' },
  'usuario-2': { nome: 'Maria' },
  'usuario-3': { nome: 'Pedro' }
};

function obterUsuario(id) {
  const chave = `usuario-${id}`;
  const { [chave]: usuario } = cache;
  return usuario;
}

console.log(obterUsuario(2)); // { nome: 'Maria' }
```

### Form Fields

```javascript
const formulario = {
  'campo-nome': 'João Silva',
  'campo-email': 'joao@email.com',
  'campo-telefone': '1234-5678'
};

function obterCampo(nome) {
  const chave = `campo-${nome}`;
  const { [chave]: valor = 'Não preenchido' } = formulario;
  return valor;
}

console.log(obterCampo('nome'));     // 'João Silva'
console.log(obterCampo('endereco')); // 'Não preenchido'
```

## ⚠️ Considerações

### Sempre Renomear

```javascript
const obj = { a: 1, b: 2 };
const chave = 'a';

// ❌ ERRO
const { [chave] } = obj;

// ✅ CORRETO
const { [chave]: valor } = obj;
```

### Combinar com Defaults

```javascript
const obj = { prop1: 'A' };
const chave = 'prop2';

const { [chave]: valor = 'default' } = obj;

console.log(valor); // 'default'
```

### Performance

```javascript
// Computed properties têm custo de runtime
// Para propriedades conhecidas, use literal

// ❌ Desnecessário
const { ['nome']: n } = obj;

// ✅ Melhor
const { nome: n } = obj;
```

Computed property names são essenciais quando nomes de propriedades são determinados em runtime, permitindo destructuring verdadeiramente dinâmico em cenários como internacionalização, cache, formulários dinâmicos e configurações por ambiente.
