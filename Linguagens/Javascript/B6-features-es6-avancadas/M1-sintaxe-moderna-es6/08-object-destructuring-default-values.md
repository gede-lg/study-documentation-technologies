# Object Destructuring - Default Values: Análise Conceitual

## 🎯 Definição

**Default Values** em object destructuring fornecem valores alternativos quando uma propriedade for **undefined** ou não existir no objeto, garantindo que variáveis tenham valores seguros mesmo com dados incompletos.

```javascript
const usuario = { nome: 'João' };

const { nome, idade = 18, cidade = 'Não informado' } = usuario;

console.log(nome);   // 'João'
console.log(idade);  // 18 (default)
console.log(cidade); // 'Não informado' (default)
```

**Conceito:** Fornecer fallbacks para propriedades ausentes ou undefined.

## 📋 Sintaxe

```javascript
const { propriedade = valorPadrao } = objeto;
const { a = 1, b = 2, c = 3 } = obj;
```

## 🧠 Fundamentos

### undefined vs Outros Valores Falsy

Defaults aplicam apenas para **undefined**, não outros falsy.

```javascript
const obj = { a: null, b: 0, c: '', d: false };

const {
  a = 'default',
  b = 10,
  c = 'texto',
  d = true,
  e = 'ausente'
} = obj;

console.log(a); // null (não 'default')
console.log(b); // 0 (não 10)
console.log(c); // '' (não 'texto')
console.log(d); // false (não true)
console.log(e); // 'ausente' (propriedade não existe)
```

### Default + Renaming

```javascript
const config = { porta: 8080 };

const {
  porta: port = 3000,
  host: hostname = 'localhost',
  ssl: usarSSL = false
} = config;

console.log(port);     // 8080
console.log(hostname); // 'localhost' (default)
console.log(usarSSL);  // false (default)
```

## 🔍 Casos de Uso

### Parâmetros de Função com Defaults

```javascript
function criarServidor({
  porta = 3000,
  host = 'localhost',
  ssl = false,
  timeout = 5000
} = {}) {
  console.log(`${host}:${porta}, SSL: ${ssl}, Timeout: ${timeout}ms`);
  return { porta, host, ssl, timeout };
}

criarServidor({ porta: 8080 });
// localhost:8080, SSL: false, Timeout: 5000ms

criarServidor();
// localhost:3000, SSL: false, Timeout: 5000ms
```

### Configurações Parciais

```javascript
const defaultConfig = {
  debug: false,
  maxRetries: 3,
  timeout: 5000
};

function aplicar(userConfig = {}) {
  const {
    debug = defaultConfig.debug,
    maxRetries = defaultConfig.maxRetries,
    timeout = defaultConfig.timeout
  } = userConfig;

  return { debug, maxRetries, timeout };
}

console.log(aplicar({ debug: true }));
// { debug: true, maxRetries: 3, timeout: 5000 }
```

### APIs com Campos Opcionais

```javascript
function processarUsuario(dados) {
  const {
    nome,
    email,
    idade = null,
    telefone = 'Não informado',
    cidade = 'Não informado',
    pais = 'Brasil'
  } = dados;

  return { nome, email, idade, telefone, cidade, pais };
}
```

## ⚠️ Considerações

### Object Null/Undefined

```javascript
const obj = null;

// ❌ ERRO
const { a = 10 } = obj; // TypeError

// ✅ Proteção dupla
const { a = 10 } = obj || {};
console.log(a); // 10
```

### Expressões como Defaults

```javascript
function valorCaro() {
  console.log('Calculando...');
  return 100;
}

const obj = { a: 50 };

const { a = valorCaro(), b = valorCaro() } = obj;
// 'Calculando...' (apenas para b)

console.log(a); // 50
console.log(b); // 100
```

Default values em object destructuring são essenciais para código robusto, tratando graciosamente dados incompletos ou opcionais de APIs, configurações e parâmetros de função.
