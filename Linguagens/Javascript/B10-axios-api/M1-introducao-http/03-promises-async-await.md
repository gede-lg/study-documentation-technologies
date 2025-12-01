# Promises e Async/Await

## 🎯 Introdução e Definição

### Definição Conceitual

**Promises** são objetos JavaScript que representam a eventual **conclusão ou falha** de uma operação assíncrona. Conceitualmente, uma Promise é um **proxy para um valor que ainda não é conhecido** no momento da criação da Promise - um "compromisso" de que o valor será fornecido no futuro.

**Async/Await** é uma sintaxe moderna construída sobre Promises que permite escrever código assíncrono de forma **sequencial e síncrona na aparência**, tornando-o mais legível e próximo do raciocínio humano natural. Na essência, `async/await` é **açúcar sintático** sobre Promises, não um mecanismo fundamentalmente diferente.

Juntas, Promises e async/await formam a base da **programação assíncrona moderna** em JavaScript, permitindo que operações demoradas (requisições HTTP, leitura de arquivos, timers) sejam executadas sem bloquear o thread principal, mantendo aplicações responsivas.

### Contexto Histórico e Motivação

JavaScript sempre foi **single-threaded** - executa uma operação por vez no thread principal. Para tarefas demoradas (I/O de rede, disco), bloquear o thread tornaria aplicações completamente não-responsivas.

**Solução Original: Callbacks (pré-2012)**

Antes das Promises, **callbacks** eram o único mecanismo para assincronismo:

```javascript
// Callback hell - pirâmide da perdição
fazRequisicao('/usuario/123', function(erro, usuario) {
  if (erro) {
    console.error(erro);
  } else {
    fazRequisicao('/posts?userId=' + usuario.id, function(erro, posts) {
      if (erro) {
        console.error(erro);
      } else {
        fazRequisicao('/comments?postId=' + posts[0].id, function(erro, comments) {
          if (erro) {
            console.error(erro);
          } else {
            console.log(comments);
          }
        });
      }
    });
  }
});
```

**Problemas conceituais dos callbacks:**
1. **Callback Hell:** Aninhamento profundo torna código ilegível ("pirâmide da perdição")
2. **Inversão de Controle:** Você passa sua lógica (callback) para biblioteca de terceiros executar
3. **Tratamento de Erro Fragmentado:** `if (erro)` repetido em cada nível
4. **Dificuldade de Composição:** Combinar múltiplas operações assíncronas é complexo

**Introdução das Promises (2012 - Promises/A+)**

Promises foram padronizadas para resolver esses problemas. A especificação **Promises/A+** (2012) definiu comportamento consistente. Promises foram oficialmente incluídas no **ECMAScript 2015 (ES6)**.

**Motivação das Promises:**
- **Composabilidade:** Promises podem ser encadeadas com `.then()`
- **Tratamento de Erro Unificado:** Um único `.catch()` no final da cadeia
- **Controle Mantido:** Você controla quando e como processar resultado
- **Padrão de Callback Consistente:** Sempre `(resolve, reject)`

**Introdução de Async/Await (2017 - ES2017)**

Mesmo com Promises, código assíncrono ainda parecia "diferente" de código síncrono. **Async/await** foi introduzido em ES2017 para permitir escrever código assíncrono que **parece síncrono**:

```javascript
// Com Promises
function buscarDados() {
  return axios.get('/usuario/123')
    .then(response => response.data)
    .then(usuario => axios.get(`/posts?userId=${usuario.id}`))
    .then(response => response.data);
}

// Com Async/Await - mais legível
async function buscarDados() {
  const respostaUsuario = await axios.get('/usuario/123');
  const usuario = respostaUsuario.data;
  const respostaPosts = await axios.get(`/posts?userId=${usuario.id}`);
  return respostaPosts.data;
}
```

**Motivação de Async/Await:**
- **Legibilidade:** Código assíncrono parece código síncrono normal
- **Debugging:** Stack traces mais claras, fácil usar breakpoints
- **Controle de Fluxo:** `if`, `for`, `while` funcionam naturalmente
- **Try/Catch:** Tratamento de erro familiar ao invés de `.catch()`

### Problema Fundamental que Resolve

Promises e async/await resolvem o problema fundamental de **executar operações demoradas sem bloquear o thread principal** enquanto mantêm **código legível e componível**.

**Problema 1: Bloqueio de Thread**

JavaScript é single-threaded. Se operação demorada (requisição HTTP que demora 2 segundos) fosse síncrona, todo o aplicativo congelaria por 2 segundos:

```javascript
// ❌ Hipotético "requisição síncrona" (não existe assim em browsers)
const dados = fazRequisicaoSincrona('/dados'); // Congela por 2s
console.log(dados);
// Durante 2s, nenhum evento (cliques, scroll) seria processado
```

**Solução: Promises tornam operação assíncrona**, permitindo que código continue executando:

```javascript
// ✅ Requisição assíncrona com Promise
axios.get('/dados').then(response => {
  console.log(response.data);
});
console.log('Isso executa imediatamente, sem esperar requisição');
```

**Problema 2: Callback Hell**

Operações assíncronas encadeadas com callbacks tornam-se rapidamente ilegíveis.

**Solução: Promises permitem encadeamento linear:**

```javascript
axios.get('/usuario/123')
  .then(response => axios.get(`/posts?userId=${response.data.id}`))
  .then(response => axios.get(`/comments?postId=${response.data[0].id}`))
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

**Problema 3: Código Assíncrono Parece "Diferente"**

Mesmo com Promises, código assíncrono não se parece com código síncrono, dificultando raciocínio.

**Solução: Async/await faz código assíncrono parecer síncrono:**

```javascript
async function processarDados() {
  try {
    const usuario = await axios.get('/usuario/123');
    const posts = await axios.get(`/posts?userId=${usuario.data.id}`);
    const comments = await axios.get(`/comments?postId=${posts.data[0].id}`);
    console.log(comments.data);
  } catch (error) {
    console.error(error);
  }
}
```

### Importância no Ecossistema

Promises e async/await são **fundamentais** para JavaScript moderno:

- **Axios:** Toda API do Axios é baseada em Promises. Cada `axios.get()` retorna Promise.
- **Fetch API:** Nativa do navegador, retorna Promises.
- **Node.js:** APIs modernas (`fs.promises`, `util.promisify`) usam Promises.
- **React:** Hooks como `useEffect` frequentemente lidam com Promises.
- **Vue:** Composables assíncronos usam async/await.
- **Testes:** Frameworks de teste (Jest, Mocha) suportam retornar Promises.

**Sem dominar Promises e async/await, é impossível:**
- Fazer requisições HTTP efetivamente
- Trabalhar com APIs assíncronas
- Escrever código JavaScript moderno
- Entender comportamento de bibliotecas populares

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Promise como Objeto de Estado:** Promise tem três estados (pending, fulfilled, rejected) e transita entre eles uma única vez
2. **Cadeia de Promises:** `.then()` retorna nova Promise, permitindo encadeamento
3. **Microtasks:** Promises usam fila de microtasks, executando antes de macrotasks (setTimeout)
4. **Async/Await como Syntactic Sugar:** Internamente, async/await usa Promises - não é mecanismo diferente
5. **Tratamento de Erro:** `.catch()` captura erros em Promises, `try/catch` captura em async/await

### Pilares Fundamentais

- **Assincronismo sem Bloqueio:** Operações demoradas não congelam aplicação
- **Composabilidade:** Promises podem ser encadeadas, combinadas (Promise.all), transformadas
- **Garantias de Execução:** Callbacks em `.then()` sempre executam assincronamente, mesmo se Promise já resolveu
- **Propagação de Erro:** Erros propagam pela cadeia até encontrar `.catch()`
- **Imutabilidade de Estado:** Uma vez que Promise resolve ou rejeita, estado não muda mais

### Visão Geral das Nuances

- **Promise Hell:** Aninhar `.then()` ao invés de encadear pode recriar callback hell
- **Esquecimento de Retornar:** Não retornar Promise em `.then()` quebra cadeia
- **Catch Posicionamento:** Onde colocar `.catch()` afeta quais erros são capturados
- **Async sem Await:** Declarar função `async` sem usar `await` dentro é geralmente erro
- **Await Bloqueio:** `await` "pausa" função async, mas não bloqueia thread global

---

## 🧠 Fundamentos Teóricos

### Anatomia de uma Promise

#### Estados da Promise

Uma Promise existe em exatamente **um de três estados** em qualquer momento:

**1. Pending (Pendente):** Estado inicial. Operação ainda não completou nem falhou.

**2. Fulfilled (Resolvida/Cumprida):** Operação completou com sucesso. Promise tem um **valor de resolução**.

**3. Rejected (Rejeitada):** Operação falhou. Promise tem uma **razão de rejeição** (geralmente um erro).

**Transições de Estado:**
```
pending → fulfilled (com valor)
pending → rejected (com razão)
```

**Crucial:** Uma vez que Promise sai do estado pending (para fulfilled ou rejected), ela **nunca muda de estado novamente**. É **imutável** após resolver/rejeitar.

```javascript
const minhaPromise = new Promise((resolve, reject) => {
  // Neste momento: pending
  
  setTimeout(() => {
    resolve('Sucesso!'); // Transição: pending → fulfilled
    // Qualquer chamada adicional a resolve() ou reject() é ignorada
  }, 1000);
});

// Depois de 1s: fulfilled (para sempre)
```

#### Criando Promises

Sintaxe básica de criação:

```javascript
const promise = new Promise((resolve, reject) => {
  // Executor function - executa imediatamente
  
  // Simular operação assíncrona
  setTimeout(() => {
    const sucesso = true;
    
    if (sucesso) {
      resolve('Resultado da operação'); // Marca como fulfilled
    } else {
      reject(new Error('Operação falhou')); // Marca como rejected
    }
  }, 1000);
});
```

**Conceitos:**
- **Executor Function:** Função `(resolve, reject) => {...}` que executa **imediatamente** quando Promise é criada
- **resolve(valor):** Função que marca Promise como fulfilled com `valor`
- **reject(razao):** Função que marca Promise como rejected com `razao` (tipicamente um Error)

**Importante:** Você raramente cria Promises manualmente. Bibliotecas (Axios, Fetch) retornam Promises prontas. Você apenas **consome** essas Promises.

#### Consumindo Promises com .then() e .catch()

**Sintaxe básica:**
```javascript
promise
  .then(onFulfilled, onRejected)  // Ambos parâmetros opcionais
  .catch(onRejected);              // Equivalente a .then(null, onRejected)
```

**Exemplo:**
```javascript
axios.get('/usuarios')
  .then(response => {
    // Executado se Promise resolver (fulfilled)
    console.log('Dados:', response.data);
    return response.data; // Retorno vira valor da próxima Promise na cadeia
  })
  .catch(error => {
    // Executado se Promise rejeitar (rejected)
    console.error('Erro:', error.message);
  });
```

**Conceito crucial:** `.then()` e `.catch()` **sempre retornam uma nova Promise**, permitindo encadeamento:

```javascript
axios.get('/usuarios')
  .then(response => {
    console.log('Then 1');
    return response.data; // Promise 2 resolverá com response.data
  })
  .then(data => {
    console.log('Then 2');
    return data.filter(u => u.ativo); // Promise 3 resolverá com array filtrado
  })
  .then(usuariosAtivos => {
    console.log('Then 3:', usuariosAtivos);
  })
  .catch(error => {
    console.error('Qualquer erro na cadeia cai aqui');
  });
```

#### Encadeamento de Promises

O poder das Promises está no **encadeamento**. Cada `.then()` retorna nova Promise, permitindo operações sequenciais:

```javascript
// Operações sequenciais: buscar usuário, depois seus posts, depois comentários
axios.get('/usuario/123')
  .then(responseUsuario => {
    console.log('Usuário:', responseUsuario.data.nome);
    // Retornar Promise aqui permite esperar ela antes de próximo .then()
    return axios.get(`/posts?userId=${responseUsuario.data.id}`);
  })
  .then(responsePosts => {
    console.log('Posts:', responsePosts.data.length);
    return axios.get(`/comments?postId=${responsePosts.data[0].id}`);
  })
  .then(responseComments => {
    console.log('Comentários:', responseComments.data);
  })
  .catch(error => {
    console.error('Erro em qualquer etapa:', error);
  });
```

**Análise conceitual:**
- Cada `.then()` espera Promise anterior resolver antes de executar
- Se `.then()` retorna Promise, próximo `.then()` espera **essa nova Promise** resolver
- Se `.then()` retorna valor simples (não-Promise), próximo `.then()` recebe esse valor imediatamente

**Armadilha comum - Promise Hell:**
```javascript
// ❌ ERRADO - aninhamento desnecessário (Promise hell)
axios.get('/usuario/123')
  .then(responseUsuario => {
    axios.get(`/posts?userId=${responseUsuario.data.id}`)
      .then(responsePosts => {
        axios.get(`/comments?postId=${responsePosts.data[0].id}`)
          .then(responseComments => {
            console.log(responseComments.data);
          });
      });
  });

// ✅ CORRETO - encadeamento linear
axios.get('/usuario/123')
  .then(responseUsuario => axios.get(`/posts?userId=${responseUsuario.data.id}`))
  .then(responsePosts => axios.get(`/comments?postId=${responsePosts.data[0].id}`))
  .then(responseComments => console.log(responseComments.data));
```

### Async/Await: Promises com Sintaxe Síncrona

#### A Palavra-chave async

**Definição:** Declarar função como `async` faz com que ela **sempre retorne uma Promise**, independentemente do que você retorna.

**Sintaxe:**
```javascript
async function minhaFuncao() {
  return 'valor'; // Automaticamente envolto em Promise.resolve('valor')
}

// Equivalente a:
function minhaFuncao() {
  return Promise.resolve('valor');
}

// Usar
minhaFuncao().then(valor => console.log(valor)); // 'valor'
```

**Conceito:** Marcar função como `async` é declarar "esta função trabalha com assincronismo e retorna Promise".

**Importante:** Se função `async` lança exceção, Promise é rejeitada com esse erro:

```javascript
async function funcaoComErro() {
  throw new Error('Algo deu errado');
}

funcaoComErro()
  .catch(error => console.error(error.message)); // 'Algo deu errado'
```

#### A Palavra-chave await

**Definição:** `await` **pausa execução** da função `async` até que Promise resolva, então retorna o valor resolvido.

**Sintaxe:**
```javascript
async function buscarUsuario() {
  const response = await axios.get('/usuario/123');
  // Execução "pausa" aqui até axios.get resolver
  console.log(response.data); // Só executa após Promise resolver
  return response.data;
}
```

**Conceito crucial:** `await` faz código **parecer síncrono**, mas é totalmente **assíncrono**. A função "pausa", mas o thread principal continua processando outras coisas (eventos, outros callbacks).

**Equivalência Promise:**
```javascript
// Com await
async function buscarDados() {
  const response = await axios.get('/usuarios');
  return response.data;
}

// Equivalente com .then()
function buscarDados() {
  return axios.get('/usuarios')
    .then(response => response.data);
}
```

**Restrição:** `await` só pode ser usado **dentro de funções async**:

```javascript
// ❌ ERRO - await fora de async
const response = await axios.get('/usuarios'); 

// ✅ CORRETO
async function buscarDados() {
  const response = await axios.get('/usuarios');
}

// ✅ CORRETO - IIFE async
(async () => {
  const response = await axios.get('/usuarios');
  console.log(response.data);
})();
```

#### Operações Sequenciais com Async/Await

**Sintaxe:**
```javascript
async function processarDados() {
  // Cada await pausa até Promise resolver
  const usuario = await axios.get('/usuario/123');
  console.log('Usuário:', usuario.data.nome);
  
  const posts = await axios.get(`/posts?userId=${usuario.data.id}`);
  console.log('Posts:', posts.data.length);
  
  const comments = await axios.get(`/comments?postId=${posts.data[0].id}`);
  console.log('Comentários:', comments.data);
  
  return comments.data;
}

// Usar
processarDados()
  .then(comments => console.log('Resultado final:', comments))
  .catch(error => console.error('Erro:', error));
```

**Análise:** Código parece completamente síncrono (linha por linha), mas é totalmente assíncrono. Cada `await` espera operação anterior completar antes de prosseguir.

#### Operações Paralelas com Async/Await

**Problema:** Múltiplos `await` sequenciais esperam um após o outro, mesmo que operações sejam independentes:

```javascript
// ❌ Lento - 3s total se cada requisição demora 1s
async function buscarDados() {
  const usuarios = await axios.get('/usuarios');    // 1s
  const produtos = await axios.get('/produtos');    // 1s (espera usuarios)
  const categorias = await axios.get('/categorias'); // 1s (espera produtos)
  
  return { usuarios, produtos, categorias };
}
```

**Solução: Promise.all() para paralelismo:**

```javascript
// ✅ Rápido - ~1s total (todas em paralelo)
async function buscarDados() {
  const [usuarios, produtos, categorias] = await Promise.all([
    axios.get('/usuarios'),
    axios.get('/produtos'),
    axios.get('/categorias')
  ]);
  
  return { usuarios, produtos, categorias };
}
```

**Conceito:** `Promise.all()` recebe array de Promises e retorna Promise que resolve quando **todas** resolverem (ou rejeita se **qualquer uma** rejeitar).

**Outros métodos úteis:**

**Promise.race():** Resolve/rejeita quando **primeira** Promise resolver/rejeitar:
```javascript
const primeiraResposta = await Promise.race([
  axios.get('/api-rapida'),
  axios.get('/api-lenta')
]);
// Retorna resposta da API que responder primeiro
```

**Promise.allSettled():** Espera todas, mas não rejeita se alguma falhar:
```javascript
const resultados = await Promise.allSettled([
  axios.get('/pode-falhar-1'),
  axios.get('/pode-falhar-2'),
  axios.get('/pode-falhar-3')
]);

resultados.forEach(resultado => {
  if (resultado.status === 'fulfilled') {
    console.log('Sucesso:', resultado.value);
  } else {
    console.log('Falhou:', resultado.reason);
  }
});
```

**Promise.any():** Resolve quando **primeira** Promise resolver (ignora rejeições):
```javascript
// Tentar múltiplos endpoints, usar primeiro que funcionar
const dados = await Promise.any([
  axios.get('/api-primaria'),
  axios.get('/api-secundaria'),
  axios.get('/api-backup')
]);
```

### Tratamento de Erros

#### Com Promises: .catch()

**Sintaxe:**
```javascript
axios.get('/usuarios')
  .then(response => response.data)
  .then(data => processar(data))
  .catch(error => {
    // Captura erros de qualquer .then() acima
    console.error('Erro:', error.message);
  });
```

**Conceito:** `.catch()` no final da cadeia captura **qualquer erro** que ocorra em `.then()` anteriores. Erros **propagam** pela cadeia até encontrar `.catch()`.

**Posicionamento de .catch():**

```javascript
// Catch no final - captura tudo
axios.get('/usuarios')
  .then(response => processar(response.data))
  .then(resultado => salvar(resultado))
  .catch(error => {
    // Captura erros de get, processar, ou salvar
  });

// Catch no meio - permite recuperação
axios.get('/usuarios')
  .then(response => processar(response.data))
  .catch(error => {
    // Captura erro apenas de get ou processar
    console.error('Erro ao buscar/processar, usando fallback');
    return []; // "Recupera" retornando valor default
  })
  .then(dados => {
    // Executa mesmo se catch anterior executou
    // dados é [] se houve erro, ou resultado de processar() se sucesso
    salvar(dados);
  });
```

#### Com Async/Await: try/catch

**Sintaxe:**
```javascript
async function buscarUsuarios() {
  try {
    const response = await axios.get('/usuarios');
    const dados = response.data;
    const processado = processar(dados);
    return processado;
  } catch (error) {
    // Captura erros de await axios.get() ou processar()
    console.error('Erro:', error.message);
    return []; // Valor default em caso de erro
  }
}
```

**Conceito:** `try/catch` é sintaxe familiar (usada em código síncrono) aplicada a código assíncrono. Qualquer erro em `await` ou código síncrono dentro de `try` é capturado por `catch`.

**Finally:**
```javascript
async function buscarDados() {
  let loading = true;
  
  try {
    const response = await axios.get('/dados');
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
    throw error; // Re-lança erro
  } finally {
    // Sempre executa, com ou sem erro
    loading = false;
    console.log('Requisição finalizada');
  }
}
```

**Comparação Promises vs Async/Await:**

```javascript
// Promises
function buscarDados() {
  return axios.get('/dados')
    .then(response => {
      console.log('Sucesso');
      return response.data;
    })
    .catch(error => {
      console.error('Erro:', error);
      throw error;
    })
    .finally(() => {
      console.log('Sempre executa');
    });
}

// Async/Await - mais legível
async function buscarDados() {
  try {
    const response = await axios.get('/dados');
    console.log('Sucesso');
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  } finally {
    console.log('Sempre executa');
  }
}
```

### Event Loop e Microtasks

#### Conceito de Event Loop

JavaScript executa código em um **single thread**. Event Loop é o mecanismo que permite executar código assíncrono sem bloquear.

**Componentes:**
1. **Call Stack:** Pilha de execução - funções sendo executadas
2. **Task Queue (Macrotasks):** Fila de tarefas (setTimeout, setInterval, I/O)
3. **Microtask Queue:** Fila de microtasks (Promises, queueMicrotask)

**Ordem de execução:**
1. Executa código síncrono (Call Stack)
2. Quando Call Stack esvazia, processa **todas** as microtasks (Promises)
3. Depois processa **uma** macrotask (setTimeout)
4. Repete

**Exemplo:**
```javascript
console.log('1 - Síncrono');

setTimeout(() => console.log('2 - Macrotask (setTimeout)'), 0);

Promise.resolve().then(() => console.log('3 - Microtask (Promise)'));

console.log('4 - Síncrono');

// Output:
// 1 - Síncrono
// 4 - Síncrono
// 3 - Microtask (Promise)  ← Microtasks primeiro
// 2 - Macrotask (setTimeout)
```

**Conceito crucial:** Promises (microtasks) têm **prioridade** sobre setTimeout/setInterval (macrotasks). Isso significa callbacks `.then()` executam antes de timers, mesmo que timer seja agendado primeiro.

**Implicação para Axios:**
```javascript
console.log('Antes da requisição');

axios.get('/dados')
  .then(response => {
    console.log('Resposta recebida'); // Microtask
  });

setTimeout(() => {
  console.log('Timeout'); // Macrotask
}, 0);

console.log('Depois da requisição');

// Output:
// Antes da requisição
// Depois da requisição
// Resposta recebida  ← Microtask (Promise) primeiro
// Timeout
```

---

## 🔍 Análise Conceitual Profunda

### Promises vs Callbacks: Comparação Profunda

**Callbacks (padrão antigo):**
```javascript
function buscarUsuario(id, callback) {
  fazRequisicao(`/usuario/${id}`, (erro, usuario) => {
    if (erro) {
      callback(erro, null);
    } else {
      fazRequisicao(`/posts?userId=${usuario.id}`, (erro, posts) => {
        if (erro) {
          callback(erro, null);
        } else {
          callback(null, { usuario, posts });
        }
      });
    }
  });
}

// Uso
buscarUsuario(123, (erro, resultado) => {
  if (erro) {
    console.error(erro);
  } else {
    console.log(resultado);
  }
});
```

**Promises (padrão moderno):**
```javascript
function buscarUsuario(id) {
  return axios.get(`/usuario/${id}`)
    .then(responseUsuario => {
      return axios.get(`/posts?userId=${responseUsuario.data.id}`)
        .then(responsePosts => ({
          usuario: responseUsuario.data,
          posts: responsePosts.data
        }));
    });
}

// Uso
buscarUsuario(123)
  .then(resultado => console.log(resultado))
  .catch(erro => console.error(erro));
```

**Async/Await (padrão mais moderno):**
```javascript
async function buscarUsuario(id) {
  const responseUsuario = await axios.get(`/usuario/${id}`);
  const responsePosts = await axios.get(`/posts?userId=${responseUsuario.data.id}`);
  
  return {
    usuario: responseUsuario.data,
    posts: responsePosts.data
  };
}

// Uso
try {
  const resultado = await buscarUsuario(123);
  console.log(resultado);
} catch (erro) {
  console.error(erro);
}
```

**Análise comparativa:**
- **Legibilidade:** Async/Await > Promises > Callbacks
- **Tratamento de Erro:** Async/Await (try/catch familiar) > Promises (.catch) > Callbacks (if erro em cada nível)
- **Composição:** Promises e Async/Await permitem encadear facilmente, Callbacks não
- **Debugging:** Async/Await tem stack traces melhores

### Promises e Axios

**Axios retorna Promises em todos os métodos:**

```javascript
const promise = axios.get('/usuarios');
console.log(promise); // Promise { <pending> }

promise.then(response => {
  console.log('Resolveu!', response.data);
});
```

**Métodos Axios e Promises:**
- `axios.get()` → Promise
- `axios.post()` → Promise
- `axios.put()` → Promise
- `axios.delete()` → Promise
- `axios()` → Promise

**Erro em Axios:**
```javascript
axios.get('/nao-existe')
  .then(response => {
    // Não executa se houver erro
  })
  .catch(error => {
    // Axios rejeita Promise para status 4xx/5xx
    if (error.response) {
      console.log('Status:', error.response.status);
    } else if (error.request) {
      console.log('Sem resposta');
    } else {
      console.log('Erro:', error.message);
    }
  });
```

**Async/Await com Axios:**
```javascript
async function buscarUsuarios() {
  try {
    const response = await axios.get('/usuarios');
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Erro HTTP:', error.response.status);
    } else {
      console.error('Erro:', error.message);
    }
    throw error; // Re-lança para quem chamou lidar
  }
}
```

### Padrões Comuns

#### Padrão: Requisições Sequenciais

**Quando usar:** Requisição B depende de resultado de requisição A.

```javascript
async function buscarDadosUsuario(userId) {
  // Buscar usuário primeiro
  const usuario = await axios.get(`/usuarios/${userId}`);
  
  // Depois buscar posts (depende de usuario.id)
  const posts = await axios.get(`/posts?userId=${usuario.data.id}`);
  
  // Depois buscar comentários (depende de posts[0].id)
  const comments = await axios.get(`/comments?postId=${posts.data[0].id}`);
  
  return {
    usuario: usuario.data,
    posts: posts.data,
    comments: comments.data
  };
}
```

#### Padrão: Requisições Paralelas

**Quando usar:** Múltiplas requisições independentes.

```javascript
async function buscarDashboard() {
  // Executar todas em paralelo
  const [usuarios, produtos, vendas] = await Promise.all([
    axios.get('/usuarios'),
    axios.get('/produtos'),
    axios.get('/vendas')
  ]);
  
  return {
    usuarios: usuarios.data,
    produtos: produtos.data,
    vendas: vendas.data
  };
}
```

#### Padrão: Retry com Backoff

**Quando usar:** Requisições que podem falhar temporariamente (rede instável).

```javascript
async function requisicaoComRetry(url, tentativas = 3, delay = 1000) {
  for (let i = 0; i < tentativas; i++) {
    try {
      const response = await axios.get(url);
      return response.data; // Sucesso, retorna
    } catch (error) {
      if (i === tentativas - 1) {
        // Última tentativa, lança erro
        throw error;
      }
      
      // Espera antes de tentar novamente (exponential backoff)
      const esperaMs = delay * Math.pow(2, i);
      console.log(`Tentativa ${i + 1} falhou. Aguardando ${esperaMs}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, esperaMs));
    }
  }
}
```

#### Padrão: Timeout Manual

**Quando usar:** Queremos timeout diferente do configurado globalmente.

```javascript
function requisicaoComTimeout(url, timeoutMs = 5000) {
  return Promise.race([
    axios.get(url),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    )
  ]);
}

// Uso
try {
  const response = await requisicaoComTimeout('/api-lenta', 3000);
  console.log(response.data);
} catch (error) {
  if (error.message === 'Timeout') {
    console.error('Requisição expirou após 3 segundos');
  }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar .then() vs Async/Await

**Use .then() quando:**
- Encadeamento simples sem muito processamento intermediário
- Trabalhando em código que já usa Promises extensivamente
- Precisa retornar Promise diretamente sem envolver em async

```javascript
// Simples e direto
function buscarUsuarios() {
  return axios.get('/usuarios')
    .then(response => response.data);
}
```

**Use async/await quando:**
- Lógica complexa com múltiplos passos sequenciais
- Código com loops, condicionais
- Precisa de try/catch para tratamento de erro familiar
- Legibilidade é prioridade

```javascript
// Complexo e legível
async function processarDados(userId) {
  const usuario = await axios.get(`/usuarios/${userId}`);
  
  if (usuario.data.ativo) {
    const posts = await axios.get(`/posts?userId=${userId}`);
    
    for (const post of posts.data) {
      await axios.patch(`/posts/${post.id}`, { visualizado: true });
    }
    
    return posts.data;
  }
  
  return [];
}
```

### Quando Usar Promise.all vs Sequencial

**Use Promise.all (paralelo) quando:**
- Requisições são **independentes** (uma não depende da outra)
- Performance é importante
- Todas as requisições devem suceder

```javascript
// Paralelo - rápido
const [usuarios, produtos] = await Promise.all([
  axios.get('/usuarios'),
  axios.get('/produtos')
]);
```

**Use sequencial quando:**
- Requisição B **depende** de resultado de requisição A
- Quer processar resultados incrementalmente (não esperar tudo)
- Quer abortar processo se primeira requisição falhar

```javascript
// Sequencial - necessário
const usuario = await axios.get('/usuario/123');
const posts = await axios.get(`/posts?userId=${usuario.data.id}`); // Depende de usuario
```

---

## ⚠️ Limitações e Considerações Teóricas

### Armadilhas Comuns

#### Armadilha 1: Esquecer await

```javascript
// ❌ ERRO - esqueceu await
async function buscarDados() {
  const response = axios.get('/usuarios'); // Promise, não dados!
  console.log(response.data); // undefined - response é Promise
}

// ✅ CORRETO
async function buscarDados() {
  const response = await axios.get('/usuarios');
  console.log(response.data); // Dados reais
}
```

#### Armadilha 2: Await em Loop Sequencial Desnecessário

```javascript
// ❌ LENTO - espera cada requisição terminar antes de iniciar próxima
async function buscarUsuarios(ids) {
  const usuarios = [];
  
  for (const id of ids) {
    const response = await axios.get(`/usuarios/${id}`); // Sequencial
    usuarios.push(response.data);
  }
  
  return usuarios;
}
// Se 10 IDs e cada requisição demora 1s: 10s total

// ✅ RÁPIDO - paralelo
async function buscarUsuarios(ids) {
  const promises = ids.map(id => axios.get(`/usuarios/${id}`));
  const responses = await Promise.all(promises);
  return responses.map(r => r.data);
}
// Todas em paralelo: ~1s total
```

#### Armadilha 3: Não Retornar Promise em .then()

```javascript
// ❌ ERRADO - quebra cadeia
axios.get('/usuario/123')
  .then(response => {
    axios.get(`/posts?userId=${response.data.id}`); // Esqueceu return!
  })
  .then(postsResponse => {
    // postsResponse é undefined!
    console.log(postsResponse.data); // ERRO
  });

// ✅ CORRETO - retorna Promise
axios.get('/usuario/123')
  .then(response => {
    return axios.get(`/posts?userId=${response.data.id}`);
  })
  .then(postsResponse => {
    console.log(postsResponse.data); // Funciona
  });
```

#### Armadilha 4: Try/Catch Não Captura Promises Não-Awaited

```javascript
// ❌ ERRO - try/catch não funciona sem await
async function buscarDados() {
  try {
    const promise = axios.get('/usuarios'); // Sem await!
    // Requisição acontece, mas erro não é capturado
  } catch (error) {
    // Nunca executa para erros de requisição
    console.error(error);
  }
}

// ✅ CORRETO - await para capturar erro
async function buscarDados() {
  try {
    const response = await axios.get('/usuarios');
  } catch (error) {
    console.error(error); // Captura erros
  }
}
```

#### Armadilha 5: Async sem Await

```javascript
// ⚠️ SUSPEITO - função async sem await
async function buscarDados() {
  return axios.get('/usuarios') // Já retorna Promise
    .then(response => response.data);
}
// Async é desnecessário aqui

// ✅ MELHOR - remove async ou usa await
function buscarDados() {
  return axios.get('/usuarios')
    .then(response => response.data);
}

// OU
async function buscarDados() {
  const response = await axios.get('/usuarios');
  return response.data;
}
```

### Considerações de Performance

**Promises não são gratuitas:** Criar Promise tem overhead (pequeno). Para milhares de operações síncronas simples, Promises podem ser mais lentas que código síncrono. Mas para I/O (requisições HTTP), benefício de assincronismo supera custo.

**Await "bloqueia" função async:** `await` pausa execução da função async. Se você tem múltiplos awaits sequenciais desnecessários, está desperdiçando tempo. Use Promise.all para paralelismo.

**Catch errors:** Promises rejeitadas não-capturadas causam warnings. Sempre tenha `.catch()` ou `try/catch`.

---

## 🔗 Interconexões Conceituais

### Promises e Event Loop

Promises usam **microtask queue**, que tem prioridade sobre macrotask queue (setTimeout). Isso garante que callbacks `.then()` executem rapidamente após Promise resolver.

### Promises e Axios

Axios é **construído sobre Promises**. Cada método retorna Promise. Dominar Promises é dominar 80% do Axios.

### Async/Await e Generators

Async/await foi inspirado em **generators** (função com `function*` e `yield`). Internamente, funções async usam conceitos similares, mas com sintaxe muito mais simples.

### Promises e Observables (RxJS)

Observables (RxJS) são "Promises on steroids" - podem emitir múltiplos valores ao longo do tempo. Promises emitem um único valor. Para streams de dados, Observables são mais apropriados.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar Promises e async/await:

1. **Axios com Async/Await:** Aplicar conhecimento para fazer requisições elegantes
2. **Error Handling Avançado:** Retry logic, fallbacks, error boundaries
3. **Concorrência:** Promise.all, Promise.race, controle de requisições paralelas
4. **Cancelamento:** AbortController para cancelar requisições
5. **Testing:** Como testar código assíncrono (mocking, async test utilities)

### Conceitos Avançados

- **Async Iterators:** `for await...of` para iterar sobre Promises
- **Top-Level Await:** Usar `await` fora de função async (ES2022+)
- **Promise.withResolvers():** Nova API para criar Promises (ES2024)

---

## 📚 Conclusão

Promises e async/await são a **fundação da programação assíncrona moderna** em JavaScript. Sem elas, código assíncrono seria verboso, difícil de ler e propenso a erros (callback hell).

**Dominar esses conceitos permite:**
- Fazer requisições HTTP elegantemente com Axios
- Escrever código assíncrono legível e manutenível
- Entender como bibliotecas modernas funcionam
- Trabalhar efetivamente com APIs JavaScript modernas

**Princípios-chave para lembrar:**
- Promises têm três estados e transicionam apenas uma vez
- `.then()` encadeia operações sequenciais
- Async/await é syntax sugar sobre Promises
- `await` pausa função async, não thread global
- Use Promise.all para paralelismo
- Sempre trate erros (`.catch()` ou `try/catch`)

Com Promises e async/await, JavaScript transcendeu suas limitações single-threaded, tornando-se linguagem poderosa para programação assíncrona moderna.
