# Callback Pattern: Fundação da Assincronia em JavaScript

## 🎯 Introdução e Definição

### Definição Conceitual

**Callback pattern** é um padrão fundamental de programação onde uma **função é passada como argumento** para outra função, com a intenção de ser **invocada posteriormente** - tipicamente após a conclusão de uma operação (síncrona ou assíncrona). Este padrão implementa o conceito de **inversão de controle**: você fornece uma função ao código que está chamando, e esse código decide quando e como executá-la.

Conceitualmente, callbacks são a base arquitetural da programação assíncrona em JavaScript. Eles modelam a ideia de que **operações não-bloqueantes** podem notificar o código chamador quando concluem, permitindo que o programa continue executando outras tarefas enquanto aguarda resultados.

```javascript
// Callback pattern básico
function operacaoAssincrona(dados, callback) {
  // Processar dados...
  setTimeout(() => {
    const resultado = processar(dados);
    callback(resultado); // Invocar callback com resultado
  }, 1000);
}

// Uso: passar função que será chamada depois
operacaoAssincrona(dados, (resultado) => {
  console.log('Operação concluída:', resultado);
});

console.log('Código continua executando...');
```

### Contexto Histórico

**JavaScript (1995):** Criado por Brendan Eich com callbacks desde o início para eventos DOM.

**AJAX (2005):** XMLHttpRequest popularizou callbacks para requisições HTTP assíncronas:
```javascript
xhr.onreadystatechange = function() { // Callback
  if (xhr.readyState === 4) {
    console.log(xhr.responseText);
  }
};
```

**Node.js (2009):** Ryan Dahl baseou toda a arquitetura I/O em callbacks não-bloqueantes:
```javascript
fs.readFile('arquivo.txt', callback); // Tudo é callback
```

**Evolução:**
- **2009-2015:** Callbacks dominaram JavaScript assíncrono
- **ES6 (2015):** Promises ofereceram alternativa
- **ES2017:** Async/await simplificou ainda mais
- **Hoje:** Callbacks ainda fundamentais para eventos e APIs legacy

### Problema que Resolve

Callbacks resolvem o problema fundamental de **assincronia não-bloqueante**:

**Problema:** JavaScript é single-threaded. Como executar operações demoradas sem bloquear?

**Sem callbacks (bloqueante):**
```javascript
// ❌ Bloqueia toda execução
const dados = lerArquivoSync('grande.txt'); // Espera 5 segundos
processar(dados);
console.log('Só executa após 5 segundos!');
```

**Com callbacks (não-bloqueante):**
```javascript
// ✅ Não bloqueia
lerArquivo('grande.txt', (dados) => {
  processar(dados); // Executado quando pronto
});
console.log('Executa imediatamente!'); // Não espera
```

**Benefícios:**
1. **Responsividade:** UI não congela
2. **Throughput:** Servidor pode processar múltiplas requisições
3. **Eficiência:** CPU não fica ociosa esperando I/O

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Higher-Order Functions:** Callbacks são funções passadas como parâmetros
2. **Deferred Execution:** Execução adiada até momento apropriado
3. **Inversion of Control:** Quem recebe callback controla quando executar
4. **Continuation Passing Style:** Passar "continuação" do programa como função
5. **Event-Driven:** Base da arquitetura orientada a eventos

### Pilares Fundamentais

- **Function as Value:** Funções são first-class citizens
- **Closure Capture:** Callbacks capturam escopo léxico
- **Synchronous vs Asynchronous:** Callbacks podem ser síncronos ou assíncronos
- **Error Handling:** Padrão error-first para tratamento de erros
- **Callback Stack:** Execução pode criar aninhamentos profundos

---

## 🧠 Fundamentos Teóricos

### Callbacks Síncronos vs Assíncronos

**Callback Síncrono:** Executado **imediatamente** dentro da função que o recebe.

```javascript
// Array.map é síncrono
const numeros = [1, 2, 3];
const dobrados = numeros.map((n) => n * 2); // Callback executado agora
console.log(dobrados); // [2, 4, 6]
console.log('Após map'); // Executa depois

// Fluxo:
// 1. map executa callback para cada elemento
// 2. map retorna novo array
// 3. Próxima linha executa
```

**Callback Assíncrono:** Executado **depois**, quando operação completa.

```javascript
// setTimeout é assíncrono
console.log('1. Início');

setTimeout(() => {
  console.log('3. Callback executado'); // Executado depois
}, 1000);

console.log('2. Fim');

// Fluxo:
// 1. "1. Início" impresso
// 2. setTimeout agenda callback (não executa agora)
// 3. "2. Fim" impresso
// 4. Após 1 segundo: "3. Callback executado"
```

**Diferença Fundamental:**

| Aspecto | Síncrono | Assíncrono |
|---------|----------|------------|
| **Execução** | Imediata | Adiada |
| **Bloqueio** | Bloqueia | Não bloqueia |
| **Retorno** | Pode retornar valor | Valor via callback |
| **Event Loop** | Não usa | Usa task queue |
| **Exemplo** | Array.map | setTimeout |

### Anatomia do Callback Pattern

```javascript
// Estrutura geral
function funcaoComCallback(parametros, callback) {
  // 1. Processar parametros
  const resultado = processar(parametros);

  // 2. Invocar callback com resultado
  callback(resultado);
}

// Uso
funcaoComCallback(dados, (resultado) => {
  // 3. Código executado quando callback é chamado
  console.log(resultado);
});
```

**Componentes:**
1. **Higher-Order Function:** Função que recebe callback
2. **Callback Function:** Função passada como argumento
3. **Invocação:** Momento em que callback é executado
4. **Argumentos:** Dados passados para o callback

### Exemplo Prático: Sistema de Notificações

```javascript
// Sistema de notificações usando callback pattern
class NotificationSystem {
  constructor() {
    this.subscribers = [];
  }

  // Registrar callback para ser notificado
  subscribe(callback) {
    this.subscribers.push(callback);
  }

  // Enviar notificação (invocar callbacks)
  notify(message) {
    console.log(`Sistema: Enviando notificação "${message}"`);

    // Invocar cada callback registrado
    this.subscribers.forEach((callback, index) => {
      console.log(`  Notificando subscriber ${index + 1}...`);
      callback(message); // Executar callback
    });
  }
}

// Uso
const notifications = new NotificationSystem();

// Subscriber 1: Logger
notifications.subscribe((msg) => {
  console.log(`  [LOG] Mensagem recebida: ${msg}`);
});

// Subscriber 2: Email
notifications.subscribe((msg) => {
  console.log(`  [EMAIL] Enviando email: ${msg}`);
});

// Subscriber 3: SMS
notifications.subscribe((msg) => {
  console.log(`  [SMS] Enviando SMS: ${msg}`);
});

// Disparar notificação
notifications.notify('Novo pedido recebido!');

/* Output:
Sistema: Enviando notificação "Novo pedido recebido!"
  Notificando subscriber 1...
  [LOG] Mensagem recebida: Novo pedido recebido!
  Notificando subscriber 2...
  [EMAIL] Enviando email: Novo pedido recebido!
  Notificando subscriber 3...
  [SMS] Enviando SMS: Novo pedido recebido!
*/
```

---

## 🔍 Análise Conceitual Profunda

### Callbacks em Operações de Array

JavaScript usa callbacks extensivamente em métodos de array:

```javascript
const numeros = [1, 2, 3, 4, 5];

// map: transforma cada elemento
const dobrados = numeros.map((numero) => numero * 2);
// Callback chamado 5 vezes (uma por elemento)

// filter: seleciona elementos
const pares = numeros.filter((numero) => numero % 2 === 0);
// Callback retorna boolean (manter ou não)

// reduce: reduz a valor único
const soma = numeros.reduce((acc, numero) => acc + numero, 0);
// Callback combina acumulador com elemento

// forEach: executar ação para cada
numeros.forEach((numero, indice) => {
  console.log(`Índice ${indice}: ${numero}`);
});
// Callback executado para efeito colateral

// find: encontrar primeiro elemento
const maiorQue3 = numeros.find((numero) => numero > 3);
// Callback retorna boolean (encontrou?)
```

**Padrão comum:**
1. Método itera sobre estrutura de dados
2. Callback executado para cada elemento
3. Callback recebe elemento (e índice/array opcional)
4. Retorno do callback determina comportamento

### Callbacks em Eventos

Callbacks são a base de programação orientada a eventos:

```javascript
// Event listeners são callbacks
button.addEventListener('click', (event) => {
  console.log('Botão clicado!');
  console.log('Coordenadas:', event.clientX, event.clientY);
});

// Múltiplos callbacks para mesmo evento
button.addEventListener('click', () => {
  console.log('Outro listener');
});

// Remover callback específico
function handleClick(event) {
  console.log('Handler');
}

button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick); // Remove
```

**Características:**
- Callback executado quando evento ocorre
- Event object passado como argumento
- Múltiplos callbacks possíveis por evento
- Remoção requer referência à função original

### Callbacks em Timers

```javascript
// setTimeout: executar uma vez após delay
const timeoutId = setTimeout(() => {
  console.log('Executado após 2 segundos');
}, 2000);

// Cancelar timeout
clearTimeout(timeoutId);

// setInterval: executar repetidamente
let contador = 0;
const intervalId = setInterval(() => {
  contador++;
  console.log(`Contagem: ${contador}`);

  if (contador === 5) {
    clearInterval(intervalId); // Parar após 5 vezes
  }
}, 1000);
```

### Callbacks Assíncronos: Exemplo Completo

```javascript
// Simular operação assíncrona (buscar dados de API)
function buscarUsuario(id, callback) {
  console.log(`Buscando usuário ${id}...`);

  // Simular delay de rede
  setTimeout(() => {
    // Banco de dados simulado
    const usuarios = {
      1: { id: 1, nome: 'João', email: 'joao@example.com' },
      2: { id: 2, nome: 'Maria', email: 'maria@example.com' }
    };

    const usuario = usuarios[id];

    if (usuario) {
      console.log('Usuário encontrado!');
      callback(null, usuario); // Sucesso: erro null, resultado presente
    } else {
      console.log('Usuário não encontrado');
      callback(new Error('Usuário não encontrado')); // Erro
    }
  }, 1000);
}

// Uso
console.log('Início da operação');

buscarUsuario(1, (erro, usuario) => {
  if (erro) {
    console.error('Erro:', erro.message);
    return;
  }

  console.log('Dados do usuário:', usuario);
  console.log(`Nome: ${usuario.nome}`);
  console.log(`Email: ${usuario.email}`);
});

console.log('Código continua executando...');

/* Output:
Início da operação
Buscando usuário 1...
Código continua executando...
[após 1 segundo]
Usuário encontrado!
Dados do usuário: { id: 1, nome: 'João', email: 'joao@example.com' }
Nome: João
Email: joao@example.com
*/
```

### Closure e Callbacks

**Conceito:** Callbacks capturam o escopo léxico onde foram criados.

```javascript
function criarContador() {
  let contador = 0; // Variável no escopo externo

  // Callback captura 'contador' via closure
  return function() {
    contador++;
    console.log(`Contagem: ${contador}`);
  };
}

const incrementar1 = criarContador();
const incrementar2 = criarContador();

incrementar1(); // Contagem: 1
incrementar1(); // Contagem: 2
incrementar2(); // Contagem: 1 (contador independente)
```

**Exemplo Prático: Cache com Callbacks**

```javascript
function criarCache() {
  const cache = {}; // Closure privado

  return {
    buscar: function(chave, callback) {
      if (cache[chave]) {
        console.log('Cache HIT');
        callback(null, cache[chave]); // Retornar de cache
      } else {
        console.log('Cache MISS - buscando...');

        // Simular busca demorada
        setTimeout(() => {
          const valor = `Valor para ${chave}`;
          cache[chave] = valor; // Armazenar em cache
          callback(null, valor);
        }, 1000);
      }
    }
  };
}

const cache = criarCache();

// Primeira busca: cache miss
cache.buscar('usuario:1', (erro, valor) => {
  console.log('Resultado 1:', valor);

  // Segunda busca: cache hit (instantâneo)
  cache.buscar('usuario:1', (erro, valor) => {
    console.log('Resultado 2:', valor);
  });
});

/* Output:
Cache MISS - buscando...
[após 1 segundo]
Resultado 1: Valor para usuario:1
Cache HIT
Resultado 2: Valor para usuario:1
*/
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Callback Pattern

**✅ Use callbacks para:**

1. **Event Handling:** Responder a eventos (clicks, inputs, etc.)
2. **Array Operations:** Transformar/filtrar coleções (map, filter)
3. **Async I/O:** Ler arquivos, requisições de rede
4. **Timers:** Executar código após delay
5. **Observer Pattern:** Notificar subscribers
6. **Iteração Customizada:** forEach, custom iterators

**Exemplos de uso apropriado:**

```javascript
// Event handling
button.addEventListener('click', handleClick);

// Array operations
array.map(transformar);

// Async I/O (Node.js)
fs.readFile('arquivo.txt', callback);

// Timers
setTimeout(executar, 1000);

// Observer pattern
eventEmitter.on('data', processarDados);
```

### Padrões Comuns com Callbacks

**1. Error-First Callback (Node.js Convention):**

```javascript
function operacao(parametros, callback) {
  operacaoAssincrona(parametros, (erro, resultado) => {
    if (erro) {
      return callback(erro); // Primeiro parâmetro: erro
    }

    callback(null, resultado); // Erro null em sucesso
  });
}

// Uso
operacao(dados, (erro, resultado) => {
  if (erro) {
    console.error('Erro:', erro);
    return;
  }

  console.log('Resultado:', resultado);
});
```

**2. Named Callbacks (vs Anonymous):**

```javascript
// ❌ Callback anônimo (dificulta debug)
button.addEventListener('click', () => {
  console.log('Clicado');
});

// ✅ Callback nomeado (melhor debug, reutilizável)
function handleClick() {
  console.log('Clicado');
}

button.addEventListener('click', handleClick);
// Pode remover depois
button.removeEventListener('click', handleClick);
```

**3. Callback Factory:**

```javascript
// Criar callbacks parametrizados
function criarLogger(prefixo) {
  return function(mensagem) {
    console.log(`[${prefixo}] ${mensagem}`);
  };
}

const logInfo = criarLogger('INFO');
const logErro = criarLogger('ERRO');

logInfo('Sistema iniciado'); // [INFO] Sistema iniciado
logErro('Falha na conexão'); // [ERRO] Falha na conexão
```

---

## ⚠️ Limitações e Considerações

### Callback Hell

**Problema:** Callbacks aninhados criam código difícil de ler.

```javascript
// ❌ Callback hell (pyramid of doom)
buscarUsuario(id, (erro, usuario) => {
  if (erro) return handleError(erro);

  buscarPedidos(usuario.id, (erro, pedidos) => {
    if (erro) return handleError(erro);

    buscarItens(pedidos[0].id, (erro, itens) => {
      if (erro) return handleError(erro);

      // Código profundamente aninhado...
    });
  });
});
```

**Solução:** Promises e async/await (próximos módulos).

### Tratamento de Erros

**Problema:** Erros em callbacks assíncronos não são capturados por try-catch.

```javascript
// ❌ Try-catch NÃO funciona
try {
  setTimeout(() => {
    throw new Error('Erro!');
  }, 1000);
} catch (erro) {
  console.log('Nunca captura'); // Não executa
}

// ✅ Erro deve ser passado ao callback
setTimeout((erro) => {
  if (erro) {
    console.error('Erro capturado:', erro);
  }
}, 1000);
```

### Inversão de Controle

**Problema:** Você perde controle sobre quando/como callback é executado.

```javascript
// Você confia que a API invocará callback corretamente
apiDeTerceiro(dados, callback);

// Mas e se:
// - Callback nunca for chamado?
// - Callback for chamado múltiplas vezes?
// - Callback for chamado com argumentos errados?
```

**Mitigação:** Promises oferecem garantias mais fortes.

---

## 🔗 Interconexões Conceituais

**Conceitos Relacionados:**
- **Higher-Order Functions:** Callbacks são passados para funções de ordem superior
- **Closures:** Callbacks capturam escopo léxico
- **Event Loop:** Callbacks assíncronos executam via event loop
- **Promises:** Alternativa moderna a callbacks
- **Async/Await:** Sintaxe síncrona sobre Promises

**Progressão:**
1. Funções como valores (first-class)
2. Higher-order functions
3. Callbacks (este tópico)
4. Error-first callbacks
5. Callback hell (problema)
6. Promises (solução)
7. Async/await (evolução)

---

## 🚀 Evolução e Próximos Conceitos

**Próximos Tópicos:**
- **Node.js Style Callbacks:** Convenção error-first
- **Promises:** Alternativa moderna
- **Async/Await:** Sintaxe síncrona para async

**Evolução do tratamento assíncrono:**

```javascript
// 1. Callbacks (1995-2015)
operacao(dados, (erro, resultado) => {
  if (erro) { /* tratar */ }
  // usar resultado
});

// 2. Promises (2015+)
operacao(dados)
  .then(resultado => { /* usar */ })
  .catch(erro => { /* tratar */ });

// 3. Async/Await (2017+)
try {
  const resultado = await operacao(dados);
  // usar resultado
} catch (erro) {
  // tratar erro
}
```

Callbacks são a **fundação** da assincronia em JavaScript. Dominar callbacks é essencial para entender Promises, async/await e toda programação assíncrona moderna.
