# Callback Pattern em JavaScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Callback** é uma função passada como argumento para outra função, para ser **invocada posteriormente** - tipicamente após conclusão de operação (síncrona ou assíncrona). É padrão fundamental que implementa **inversão de controle**: você passa função para código de terceiro, que decide quando/como executá-la.

```javascript
// Callback simples
function processar(dados, callback) {
  const resultado = transformar(dados);
  callback(resultado); // Invoca callback passado
}

processar(dados, (resultado) => {
  console.log(resultado);
});
```

### Contexto Histórico

Callbacks são **fundação da assincronia** em JavaScript:
- **Node.js (2009):** Callbacks everywhere para I/O não-bloqueante
- **AJAX:** Callbacks para requisições HTTP
- **Event handlers:** Callbacks para eventos DOM

Antes de Promises (ES6) e async/await (ES2017), callbacks eram a **única forma** de lidar com assincronia.

### Problema que Resolve

Permite código **não-bloqueante**:

```javascript
// ❌ Bloqueante (síncrono)
const dados = lerArquivoSync('arquivo.txt'); // Bloqueia
processar(dados);

// ✅ Não-bloqueante (callback)
lerArquivo('arquivo.txt', (dados) => { // Não bloqueia
  processar(dados);
});
console.log("Continua executando...");
```

---

## 📋 Conceitos Fundamentais

**Callback Síncrono:** Executado imediatamente:

```javascript
[1,2,3].map(x => x * 2); // Callback síncrono
```

**Callback Assíncrono:** Executado depois (event loop):

```javascript
setTimeout(() => console.log("depois"), 1000); // Assíncrono
```

**Higher-Order Function:** Função que recebe callback:

```javascript
function executarDepois(callback) {
  setTimeout(callback, 1000);
}
```

---

## 🔍 Padrões de Uso

### 1. Array Methods

```javascript
const numeros = [1, 2, 3, 4, 5];

numeros.forEach((n) => console.log(n));
const dobrados = numeros.map((n) => n * 2);
const pares = numeros.filter((n) => n % 2 === 0);
const soma = numeros.reduce((acc, n) => acc + n, 0);
```

### 2. Event Handlers

```javascript
button.addEventListener('click', (event) => {
  console.log('Clicado!');
});
```

### 3. Timers

```javascript
setTimeout(() => console.log('Após 1s'), 1000);
setInterval(() => console.log('A cada 1s'), 1000);
```

### 4. Operações Assíncronas (Padrão Node.js)

```javascript
fs.readFile('arquivo.txt', (erro, dados) => {
  if (erro) {
    console.error(erro);
    return;
  }
  console.log(dados);
});
```

---

## 🎯 Vantagens e Desvantagens

**✅ Vantagens:**
- Simples de entender (conceito direto)
- Universal (funciona em qualquer ambiente)
- Base para event-driven programming

**❌ Desvantagens:**
- Callback hell (aninhamento profundo)
- Difícil tratamento de erros
- Difícil composição/encadeamento

---

## 🚀 Evolução

Callbacks → Promises → Async/Await

Promises e async/await resolvem problemas de callbacks mas callbacks permanecem fundamentais.
