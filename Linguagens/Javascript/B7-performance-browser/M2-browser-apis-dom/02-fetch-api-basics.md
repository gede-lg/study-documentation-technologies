# Fetch API: Fundamentos

## 🎯 Definição

**Fetch API** é a interface moderna para realizar requisições HTTP em JavaScript, substituindo XMLHttpRequest. Baseada em Promises, oferece sintaxe limpa e composável para buscar recursos da rede, suportando métodos HTTP (GET, POST, PUT, DELETE), headers customizados, corpo de requisição, e streaming de respostas.

```javascript
// Requisição básica
fetch('https://api.exemplo.com/dados')
  .then(resposta => resposta.json())
  .then(dados => console.log(dados))
  .catch(erro => console.error('Erro:', erro));

// Com async/await
async function buscarDados() {
  const resposta = await fetch('https://api.exemplo.com/dados');
  const dados = await resposta.json();
  return dados;
}
```

**Conceito:** API moderna baseada em Promises para requisições HTTP.

## 📋 Anatomia de uma Requisição

### Estrutura Básica

```javascript
fetch(url, opcoes)
  .then(resposta => {
    // resposta é um objeto Response
    // Contém: status, headers, body (stream)
  });
```

### URL e Opções

```javascript
const url = 'https://api.exemplo.com/usuarios';

const opcoes = {
  method: 'POST',           // GET, POST, PUT, DELETE, PATCH, etc.
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({    // Corpo da requisição
    nome: 'João',
    email: 'joao@exemplo.com'
  }),
  mode: 'cors',             // cors, no-cors, same-origin
  credentials: 'include',   // include, same-origin, omit
  cache: 'no-cache',        // default, no-cache, reload, force-cache
  redirect: 'follow'        // follow, error, manual
};

fetch(url, opcoes)
  .then(resposta => resposta.json())
  .then(dados => console.log(dados));
```

## 🧠 Objeto Response

### Propriedades

```javascript
fetch('/api/dados').then(resposta => {
  console.log(resposta.status);       // 200, 404, 500, etc.
  console.log(resposta.statusText);   // 'OK', 'Not Found', etc.
  console.log(resposta.ok);           // true se status 200-299
  console.log(resposta.headers);      // Headers object
  console.log(resposta.url);          // URL final (após redirects)
  console.log(resposta.redirected);   // true se houve redirect
});
```

### Métodos de Leitura do Body

```javascript
// json(): parse como JSON
fetch('/api/dados')
  .then(resposta => resposta.json())
  .then(dados => console.log(dados));

// text(): retorna string
fetch('/pagina.html')
  .then(resposta => resposta.text())
  .then(html => console.log(html));

// blob(): retorna Blob (arquivos binários)
fetch('/imagem.png')
  .then(resposta => resposta.blob())
  .then(blob => {
    const url = URL.createObjectURL(blob);
    img.src = url;
  });

// arrayBuffer(): retorna ArrayBuffer (dados binários)
fetch('/dados.bin')
  .then(resposta => resposta.arrayBuffer())
  .then(buffer => console.log(new Uint8Array(buffer)));

// formData(): retorna FormData
fetch('/formulario')
  .then(resposta => resposta.formData())
  .then(form => console.log(form.get('campo')));
```

### Body Stream (Consumo Único)

```javascript
// ❌ ERRO: não pode ler body duas vezes
fetch('/api/dados')
  .then(resposta => {
    resposta.json(); // Consome stream
    return resposta.json(); // ERRO: body já consumido
  });

// ✅ Clone para múltiplas leituras
fetch('/api/dados')
  .then(resposta => {
    const clone = resposta.clone();

    resposta.json().then(dados => console.log('Original:', dados));
    clone.text().then(texto => console.log('Clone:', texto));
  });
```

## 🔍 Métodos HTTP

### GET (Padrão)

```javascript
// GET implícito
fetch('/api/usuarios')
  .then(resposta => resposta.json());

// GET explícito com query params
const params = new URLSearchParams({
  limite: 10,
  pagina: 2,
  ordem: 'nome'
});

fetch(`/api/usuarios?${params}`)
  .then(resposta => resposta.json());
```

### POST

```javascript
// Enviar JSON
fetch('/api/usuarios', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nome: 'Maria',
    idade: 25
  })
})
  .then(resposta => resposta.json())
  .then(usuario => console.log('Criado:', usuario));
```

### PUT

```javascript
// Atualizar recurso completo
fetch('/api/usuarios/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nome: 'Maria Silva',
    idade: 26,
    email: 'maria@exemplo.com'
  })
})
  .then(resposta => resposta.json());
```

### PATCH

```javascript
// Atualizar parcialmente
fetch('/api/usuarios/123', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    idade: 27 // Apenas atualizar idade
  })
})
  .then(resposta => resposta.json());
```

### DELETE

```javascript
fetch('/api/usuarios/123', {
  method: 'DELETE'
})
  .then(resposta => {
    if (resposta.ok) {
      console.log('Usuário deletado');
    }
  });
```

## 🎯 Headers

### Ler Headers

```javascript
fetch('/api/dados')
  .then(resposta => {
    // get(): obter header específico
    const tipo = resposta.headers.get('Content-Type');

    // has(): verificar existência
    if (resposta.headers.has('Authorization')) {
      console.log('Autenticado');
    }

    // forEach(): iterar todos
    resposta.headers.forEach((valor, chave) => {
      console.log(`${chave}: ${valor}`);
    });
  });
```

### Enviar Headers

```javascript
const headers = new Headers();
headers.append('Authorization', 'Bearer token123');
headers.append('X-Custom-Header', 'valor');

fetch('/api/dados', { headers })
  .then(resposta => resposta.json());

// Ou objeto literal
fetch('/api/dados', {
  headers: {
    'Authorization': 'Bearer token123',
    'X-Custom-Header': 'valor'
  }
});
```

## ⚠️ Tratamento de Erros

### Erros de Rede vs HTTP

```javascript
// fetch() só rejeita em erros de REDE (sem conexão, CORS, etc.)
// Status HTTP 4xx/5xx NÃO rejeitam Promise

fetch('/api/dados')
  .then(resposta => {
    // ✅ Verificar resposta.ok manualmente
    if (!resposta.ok) {
      throw new Error(`HTTP ${resposta.status}: ${resposta.statusText}`);
    }
    return resposta.json();
  })
  .catch(erro => {
    // Captura:
    // - Erros de rede
    // - Erros lançados manualmente (status HTTP)
    // - Erros em json() (parse inválido)
    console.error('Erro:', erro);
  });
```

### Helper para Status

```javascript
async function fetchComValidacao(url, opcoes) {
  const resposta = await fetch(url, opcoes);

  if (!resposta.ok) {
    const texto = await resposta.text();
    throw new Error(`HTTP ${resposta.status}: ${texto}`);
  }

  return resposta;
}

// Uso
try {
  const resposta = await fetchComValidacao('/api/dados');
  const dados = await resposta.json();
} catch (erro) {
  console.error('Erro validado:', erro);
}
```

## 🚀 Padrões Avançados

### Timeout Manual

```javascript
function fetchComTimeout(url, opcoes = {}, timeout = 5000) {
  return Promise.race([
    fetch(url, opcoes),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

// Uso
try {
  const resposta = await fetchComTimeout('/api/dados', {}, 3000);
  const dados = await resposta.json();
} catch (erro) {
  if (erro.message === 'Timeout') {
    console.log('Requisição demorou muito');
  }
}
```

### AbortController

```javascript
const controller = new AbortController();
const signal = controller.signal;

// Cancelar após 5 segundos
setTimeout(() => controller.abort(), 5000);

fetch('/api/dados', { signal })
  .then(resposta => resposta.json())
  .catch(erro => {
    if (erro.name === 'AbortError') {
      console.log('Requisição cancelada');
    }
  });

// Cancelamento manual
button.addEventListener('click', () => {
  controller.abort(); // Cancela fetch
});
```

### Retry com Exponential Backoff

```javascript
async function fetchComRetry(url, opcoes = {}, tentativas = 3, delay = 1000) {
  for (let i = 0; i < tentativas; i++) {
    try {
      const resposta = await fetch(url, opcoes);
      if (resposta.ok) return resposta;

      // Status 5xx: tentar novamente
      if (resposta.status >= 500) {
        throw new Error(`Servidor erro: ${resposta.status}`);
      }

      // Status 4xx: não tentar novamente
      return resposta;
    } catch (erro) {
      const ultimaTentativa = i === tentativas - 1;
      if (ultimaTentativa) throw erro;

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * (2 ** i)));
    }
  }
}
```

### Parallel Requests

```javascript
// Promise.all: esperar todas
const [usuarios, posts, comentarios] = await Promise.all([
  fetch('/api/usuarios').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
  fetch('/api/comentarios').then(r => r.json())
]);

// Promise.race: primeira a completar
const resposta = await Promise.race([
  fetch('/api/servidor1/dados'),
  fetch('/api/servidor2/dados'),
  fetch('/api/servidor3/dados')
]);

// Promise.allSettled: aguardar todas (ignorar erros)
const resultados = await Promise.allSettled([
  fetch('/api/endpoint1').then(r => r.json()),
  fetch('/api/endpoint2').then(r => r.json()),
  fetch('/api/endpoint3').then(r => r.json())
]);

resultados.forEach((resultado, i) => {
  if (resultado.status === 'fulfilled') {
    console.log(`Endpoint ${i}: sucesso`, resultado.value);
  } else {
    console.log(`Endpoint ${i}: falha`, resultado.reason);
  }
});
```

### Upload de Arquivos

```javascript
// FormData
const formData = new FormData();
formData.append('arquivo', fileInput.files[0]);
formData.append('descricao', 'Minha imagem');

fetch('/api/upload', {
  method: 'POST',
  body: formData // Não definir Content-Type (browser faz automaticamente)
})
  .then(resposta => resposta.json())
  .then(resultado => console.log('Upload completo:', resultado));
```

### Streaming Response

```javascript
// Ler resposta em chunks (útil para grandes arquivos)
fetch('/api/arquivo-grande')
  .then(resposta => {
    const reader = resposta.body.getReader();

    function ler() {
      return reader.read().then(({ done, value }) => {
        if (done) {
          console.log('Stream completo');
          return;
        }

        console.log(`Recebeu ${value.length} bytes`);
        return ler(); // Continuar lendo
      });
    }

    return ler();
  });
```

## 🔗 CORS e Segurança

### CORS Básico

```javascript
// Requisição CORS simples
fetch('https://api.outro-dominio.com/dados', {
  mode: 'cors', // Padrão
  credentials: 'omit' // Não enviar cookies
})
  .then(resposta => resposta.json());

// Requisição com credenciais (cookies, auth)
fetch('https://api.outro-dominio.com/dados', {
  mode: 'cors',
  credentials: 'include' // Enviar cookies
})
  .then(resposta => resposta.json());
```

### Preflight (OPTIONS)

```javascript
// Requisição que causa preflight:
// - Método além de GET/POST/HEAD
// - Headers customizados
// - Content-Type além de application/x-www-form-urlencoded, multipart/form-data, text/plain

fetch('https://api.outro-dominio.com/dados', {
  method: 'PUT', // Causa preflight
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'valor' // Causa preflight
  },
  body: JSON.stringify({ dados: 'teste' })
});

// Browser envia OPTIONS automaticamente antes da requisição real
```

Fetch API simplifica requisições HTTP com sintaxe moderna e baseada em Promises, sendo o padrão atual para comunicação com APIs em ambientes browser e (com polyfills/node-fetch) Node.js.
