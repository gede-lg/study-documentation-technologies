# Async Generators: Análise Conceitual

## 🎯 Definição

**Async Generators** combinam generators com async/await, permitindo iterar sobre sequências **assíncronas** de valores. Declarados com `async function*`, produzem valores com `yield` e podem usar `await`.

```javascript
async function* buscarPaginas(total) {
  for (let pagina = 1; pagina <= total; pagina++) {
    const dados = await fetch(`/api/pagina/${pagina}`);
    const json = await dados.json();
    yield json;
  }
}

// Consumir com for await...of
for await (const pagina of buscarPaginas(3)) {
  console.log(pagina);
}
```

**Conceito:** Iteração assíncrona com pausas para operações async.

## 📋 Sintaxe

```javascript
async function* nomeGenerator() {
  await operacaoAsync();
  yield valor;
}
```

### for await...of

```javascript
async function* numeros() {
  yield 1;
  yield 2;
  yield 3;
}

(async () => {
  for await (const n of numeros()) {
    console.log(n); // 1, 2, 3
  }
})();
```

## 🧠 Fundamentos

### Retorna AsyncIterator

```javascript
async function* gen() {
  yield 1;
}

const asyncGen = gen();

// next() retorna Promise
asyncGen.next().then(resultado => {
  console.log(resultado); // { value: 1, done: false }
});
```

### Combina async/await + yield

```javascript
async function* buscarDados() {
  const resposta = await fetch('/api/dados');
  const dados = await resposta.json();

  for (const item of dados) {
    yield item;
  }
}
```

## 🔍 Casos de Uso

### Streaming de Dados

```javascript
async function* streamLogs(arquivo) {
  const leitor = await abrirArquivo(arquivo);

  try {
    while (true) {
      const linha = await leitor.lerLinha();
      if (!linha) break;
      yield linha;
    }
  } finally {
    await leitor.fechar();
  }
}

for await (const linha of streamLogs('app.log')) {
  console.log(linha);
}
```

### Paginação Automática

```javascript
async function* buscarTodosProdutos() {
  let pagina = 1;
  let temMais = true;

  while (temMais) {
    const resposta = await fetch(`/api/produtos?pagina=${pagina}`);
    const { dados, proximaPagina } = await resposta.json();

    for (const produto of dados) {
      yield produto;
    }

    temMais = !!proximaPagina;
    pagina++;
  }
}

// Consumir todos os produtos de todas as páginas
for await (const produto of buscarTodosProdutos()) {
  console.log(produto.nome);
}
```

### Polling

```javascript
async function* polling(url, intervalo = 1000) {
  while (true) {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    yield dados;

    await new Promise(resolve => setTimeout(resolve, intervalo));
  }
}

// Verificar status a cada segundo
for await (const status of polling('/api/status', 1000)) {
  console.log(status);

  if (status.completo) {
    break;
  }
}
```

### WebSocket Stream

```javascript
async function* streamWebSocket(url) {
  const ws = new WebSocket(url);

  try {
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    for await (const mensagem of gerarMensagens(ws)) {
      yield mensagem;
    }
  } finally {
    ws.close();
  }
}

async function* gerarMensagens(ws) {
  while (ws.readyState === WebSocket.OPEN) {
    const mensagem = await new Promise(resolve => {
      ws.onmessage = e => resolve(e.data);
    });

    yield JSON.parse(mensagem);
  }
}
```

## ⚠️ Considerações

### Error Handling

```javascript
async function* comErro() {
  try {
    const dados = await fetch('/api/dados');
    yield await dados.json();
  } catch (erro) {
    console.log('Erro ao buscar:', erro);
    yield { erro: true };
  }
}
```

### Cancelamento

```javascript
async function* cancelavel(signal) {
  let i = 0;

  while (!signal.aborted) {
    await esperar(100);
    yield i++;
  }
}

const controller = new AbortController();

setTimeout(() => controller.abort(), 1000);

for await (const n of cancelavel(controller.signal)) {
  console.log(n);
}
```

### Performance

```javascript
// ✅ Bom: processo sob demanda
async function* processarGrandes() {
  for (const arquivo of arquivos) {
    yield await processar(arquivo);
  }
}

// ❌ Ruim: carrega tudo na memória
async function processarTodos() {
  const resultados = [];
  for (const arquivo of arquivos) {
    resultados.push(await processar(arquivo));
  }
  return resultados;
}
```

Async generators são essenciais para trabalhar com streams assíncronos, APIs paginadas, polling, WebSockets e qualquer fonte de dados que produza valores ao longo do tempo de forma assíncrona.
