# Object Destructuring - Renaming Variables: Análise Conceitual

## 🎯 Definição

**Renaming Variables** (renomeação de variáveis) em object destructuring permite extrair propriedades de objetos e atribuí-las a variáveis com **nomes diferentes** das chaves originais, usando a sintaxe `{ chaveOriginal: novoNome }`.

```javascript
const usuario = {
  nome: 'João',
  idade: 30
};

// Renomear propriedades
const { nome: nomeUsuario, idade: idadeUsuario } = usuario;

console.log(nomeUsuario);  // 'João'
console.log(idadeUsuario); // 30
console.log(nome);          // ReferenceError: nome não está definido
```

**Conceito:** Mapear propriedades de objeto para variáveis com nomes customizados.

## 📋 Sintaxe

```javascript
const { propriedadeOriginal: novoNome } = objeto;
```

**Leitura:** "Extrair `propriedadeOriginal` e atribuir à variável `novoNome`"

## 🧠 Fundamentos Teóricos

### Como Funciona

```javascript
const obj = { a: 1, b: 2 };

// a: x significa "pegar obj.a e criar variável x"
const { a: x, b: y } = obj;

console.log(x); // 1 (obj.a)
console.log(y); // 2 (obj.b)
console.log(a); // ReferenceError
```

### Quando Usar

- **Evitar conflitos de nome**
- **Clarificar contexto**
- **Adequar a convenções de nomenclatura**
- **Propriedades com nomes reservados/inválidos**

## 🔍 Casos de Uso Práticos

### Evitar Conflitos

```javascript
const usuario = { nome: 'João', id: 1 };
const produto = { nome: 'Notebook', id: 100 };

// Sem conflito
const { nome: nomeUsuario, id: idUsuario } = usuario;
const { nome: nomeProduto, id: idProduto } = produto;

console.log(nomeUsuario, nomeProduto); // 'João' 'Notebook'
```

### Propriedades Inválidas como Identificadores

```javascript
const config = {
  'api-url': 'https://api.com',
  'max-retries': 3,
  'timeout-ms': 5000
};

const {
  'api-url': apiUrl,
  'max-retries': maxRetries,
  'timeout-ms': timeoutMs
} = config;

console.log(apiUrl);      // 'https://api.com'
console.log(maxRetries);  // 3
console.log(timeoutMs);   // 5000
```

### Clarificar Contexto

```javascript
function processarPedido({ id: pedidoId, usuario: { id: usuarioId } }) {
  console.log(`Pedido ${pedidoId} do usuário ${usuarioId}`);
}

processarPedido({
  id: 123,
  usuario: { id: 456 }
});
// Pedido 123 do usuário 456
```

### APIs com Nomes Genéricos

```javascript
async function buscarDados() {
  const resposta = await fetch('/api/dados');
  const { data: dados, status: statusRequisicao } = await resposta.json();

  return { dados, statusRequisicao };
}
```

## ⚠️ Combinações

### Renaming + Default Values

```javascript
const config = { porta: 8080 };

const {
  porta: port = 3000,
  host: hostname = 'localhost'
} = config;

console.log(port);     // 8080 (do objeto)
console.log(hostname); // 'localhost' (default)
```

### Renaming + Nested

```javascript
const dados = {
  usuario: {
    nome: 'João',
    endereco: {
      cidade: 'SP'
    }
  }
};

const {
  usuario: {
    nome: nomeCompleto,
    endereco: { cidade: cidadeResidencia }
  }
} = dados;

console.log(nomeCompleto);       // 'João'
console.log(cidadeResidencia);   // 'SP'
```

Renaming é essencial quando a estrutura do objeto não controla nomes de variáveis locais ideais, permitindo adaptar dados externos às convenções internas.
