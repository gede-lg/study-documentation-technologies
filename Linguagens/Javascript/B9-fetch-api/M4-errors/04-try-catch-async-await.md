# Try/Catch com Async/Await: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Try/catch com async/await** é o **padrão moderno de error handling** para código assíncrono JavaScript, permitindo **tratamento de errors síncronos e assíncronos** com **sintaxe uniforme**. Conceitualmente, async/await transforma **Promise chains** em código **sequencial**, onde `try` encapsula operações que podem falhar e `catch` intercepta **rejections** (e throws síncronos), oferecendo **controle de fluxo claro** e **stack traces legíveis**.

Async/await resolve o **callback hell** e **Promise chaining verboso**, permitindo que código assíncrono seja escrito como se fosse síncrono, mantendo **semantics** de error handling familiar (try/catch/finally). É **essencial para Fetch API**, onde praticamente todas operações são assíncronas (fetch, response.json(), etc.).

```javascript
// Promise chaining (antigo - verboso)
fetch('/api/dados')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Dados:', data);
  })
  .catch(error => {
    console.error('Erro:', error);
  })
  .finally(() => {
    console.log('Cleanup');
  });

// Async/await (moderno - claro)
try {
  const response = await fetch('/api/dados');
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  const data = await response.json();
  console.log('Dados:', data);
  
} catch (error) {
  console.error('Erro:', error);
  
} finally {
  console.log('Cleanup');
}
```

### Contexto Histórico e Motivação

**Evolução de Async Error Handling:**

1. **Callbacks (ES3, 1999)**: Error-first callbacks, callback hell
2. **Promises (ES6, 2015)**: `.then()/.catch()`, melhor composição
3. **Async/Await (ES2017)**: Sintaxe síncrona para código assíncrono
4. **Top-Level Await (ES2022)**: `await` fora de async functions (módulos)

**Motivação para Async/Await:**

Promises resolveram callback hell, mas chaining ainda é **verboso e difícil de debugar**:

```javascript
// Promise chaining - múltiplos steps
fetch('/api/usuario/123')
  .then(response => response.json())
  .then(usuario => fetch(`/api/perfil/${usuario.perfilId}`))
  .then(response => response.json())
  .then(perfil => {
    console.log('Perfil:', perfil);
  })
  .catch(error => {
    // Qual .then() falhou? Stack trace não é claro
    console.error(error);
  });

// Async/await - sequencial e claro
try {
  const response1 = await fetch('/api/usuario/123');
  const usuario = await response1.json();
  
  const response2 = await fetch(`/api/perfil/${usuario.perfilId}`);
  const perfil = await response2.json();
  
  console.log('Perfil:', perfil);
  
} catch (error) {
  // Stack trace mostra exatamente onde falhou
  console.error(error);
}
```

### Problema Fundamental que Resolve

Try/catch com async/await resolve problemas específicos:

**1. Unified Error Handling**: Mesmo syntax para sync e async errors
**2. Better Stack Traces**: Linha exata de falha (não "Promise rejection")
**3. Control Flow**: Early returns, loops, conditionals naturais
**4. Readability**: Código linear, fácil de seguir
**5. Debugging**: Breakpoints funcionam naturalmente

### Importância no Ecossistema

Try/catch com async/await é **padrão moderno** para:

- **Fetch API**: Tratamento de network/HTTP errors
- **Async Operations**: File I/O, database queries
- **Error Recovery**: Retry logic, fallbacks
- **Resource Management**: finally para cleanup
- **Framework Integration**: React effects, Vue composables

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Async Functions**: `async` marca função como assíncrona (retorna Promise)
2. **Await Expression**: `await` pausa execução até Promise resolver
3. **Try/Catch**: Captura rejections (e throws síncronos)
4. **Finally**: Cleanup garantido (sucesso ou erro)
5. **Error Propagation**: Errors propagam até catch mais próximo

### Pilares Fundamentais

- **async keyword**: Marca função como assíncrona
- **await keyword**: Aguarda Promise (pausa execução)
- **try block**: Código que pode falhar
- **catch block**: Error handler
- **finally block**: Cleanup code

### Visão Geral das Nuances

- `await` só funciona em `async` functions (ou top-level em módulos)
- Try/catch captura rejections E throws síncronos
- Await sem try/catch propaga rejection para caller
- Finally executa mesmo em early return
- Multiple awaits são sequenciais (não paralelos)

---

## 🧠 Fundamentos Teóricos

### Async Functions - Fundamentos

**Async function sempre retorna Promise**.

```javascript
// Async function retorna Promise
async function buscarDados() {
  return 'resultado'; // Wrapped em Promise.resolve()
}

const promise = buscarDados();
console.log(promise); // Promise { 'resultado' }

promise.then(data => console.log(data)); // 'resultado'

// Equivalente a:
function buscarDadosPromise() {
  return Promise.resolve('resultado');
}
```

**Retornar valor = Promise.resolve(value)**
**Throw error = Promise.reject(error)**

```javascript
async function comSucesso() {
  return 42;
}
comSucesso(); // Promise.resolve(42)

async function comErro() {
  throw new Error('Falha');
}
comErro(); // Promise.reject(Error('Falha'))
```

### Await - Pausa até Promise Resolver

**Await pausa execução da async function até Promise resolver**.

```javascript
async function exemplo() {
  console.log('1 - Início');
  
  const resultado = await Promise.resolve('dados');
  // Execução PAUSA aqui até Promise resolver
  
  console.log('2 - Resultado:', resultado);
  return resultado;
}

exemplo();
console.log('3 - Fim (síncrono)');

// Output:
// 1 - Início
// 3 - Fim (síncrono)  ← Executa enquanto await pausa
// 2 - Resultado: dados
```

**Await = .then() syntax sugar**:

```javascript
// Com await
async function buscar() {
  const response = await fetch('/api/dados');
  const data = await response.json();
  return data;
}

// Equivalente com .then()
function buscarPromise() {
  return fetch('/api/dados')
    .then(response => response.json());
}
```

### Try/Catch - Captura Rejections

**Try/catch captura Promise rejections (e throws síncronos)**.

```javascript
async function exemplo() {
  try {
    // Promise rejection
    const response = await fetch('https://inexistente.com/api');
    // TypeError: Failed to fetch → vai para catch
    
  } catch (error) {
    console.error('Capturado:', error);
    // error = TypeError
  }
}

// Sem try/catch - rejection propaga
async function semTryCatch() {
  const response = await fetch('https://inexistente.com/api');
  // Promise rejection NÃO capturada
  // Propaga para caller
}

semTryCatch()
  .catch(error => {
    console.error('Capturado no caller:', error);
  });
```

**Captura sync E async errors**:

```javascript
async function exemplo() {
  try {
    // Erro síncrono
    throw new Error('Erro sync');
    
    // Erro assíncrono (nunca chega aqui)
    const data = await fetch('/api').then(r => r.json());
    
  } catch (error) {
    // Captura AMBOS tipos de erro
    console.error('Erro:', error);
  }
}
```

### Finally - Cleanup Garantido

**Finally executa sempre (sucesso ou erro)**.

```javascript
async function exemplo() {
  try {
    const response = await fetch('/api/dados');
    return await response.json();
    
  } catch (error) {
    console.error('Erro:', error);
    return null;
    
  } finally {
    // Executa SEMPRE (antes de return)
    console.log('Cleanup - executa sempre');
  }
}

await exemplo();
// Output:
// Cleanup - executa sempre
// (return value depois do finally)
```

**Uso: Cleanup de Recursos**

```javascript
async function processarArquivo(arquivo) {
  let handle = null;
  
  try {
    handle = await abrirArquivo(arquivo);
    const dados = await handle.ler();
    return processar(dados);
    
  } catch (error) {
    console.error('Erro ao processar:', error);
    throw error;
    
  } finally {
    // Fechar arquivo SEMPRE (sucesso ou erro)
    if (handle) {
      await handle.fechar();
    }
  }
}
```

### Pattern: Fetch com Try/Catch

```javascript
async function buscarUsuario(id) {
  try {
    const response = await fetch(`/api/usuarios/${id}`);
    
    // HTTP error (response.ok === false)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const usuario = await response.json();
    return usuario;
    
  } catch (error) {
    // Network error OU HTTP error (thrown manually)
    
    if (error instanceof TypeError) {
      // Network error
      console.error('Falha de rede:', error);
      throw new Error('Verifique sua conexão');
    }
    
    // Re-throw outros errors
    throw error;
  }
}

// Uso
try {
  const usuario = await buscarUsuario(123);
  console.log('Usuário:', usuario);
  
} catch (error) {
  console.error('Falha ao buscar usuário:', error.message);
}
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Multiple Awaits Sequenciais

```javascript
async function buscarDadosCompletos(userId) {
  try {
    // Sequencial - aguarda cada step
    const usuario = await buscarUsuario(userId);
    const perfil = await buscarPerfil(usuario.perfilId);
    const pedidos = await buscarPedidos(userId);
    
    return {
      usuario,
      perfil,
      pedidos
    };
    
  } catch (error) {
    console.error('Erro em algum step:', error);
    
    // Error pode ser de qualquer await
    // Stack trace mostra qual linha falhou
    throw error;
  }
}
```

**⚠️ Performance**: Awaits sequenciais são **lentos** se operações são independentes.

### Pattern 2: Parallel Awaits com Promise.all

```javascript
async function buscarDadosParalelo(userId) {
  try {
    // Lançar todas requests simultaneamente
    const [usuario, perfil, pedidos] = await Promise.all([
      buscarUsuario(userId),
      buscarPerfil(userId),
      buscarPedidos(userId)
    ]);
    
    return { usuario, perfil, pedidos };
    
  } catch (error) {
    // Primeira Promise que rejeitar causa catch
    console.error('Alguma request falhou:', error);
    throw error;
  }
}

// Mais rápido que sequencial:
// Sequencial: tempo1 + tempo2 + tempo3
// Paralelo: max(tempo1, tempo2, tempo3)
```

### Pattern 3: Promise.allSettled para Partial Failures

```javascript
async function buscarDadosComFallback(userId) {
  const results = await Promise.allSettled([
    buscarUsuario(userId),
    buscarPerfil(userId),
    buscarPedidos(userId)
  ]);
  
  // Processar results (fulfilled ou rejected)
  const [usuarioResult, perfilResult, pedidosResult] = results;
  
  return {
    usuario: usuarioResult.status === 'fulfilled' ? usuarioResult.value : null,
    perfil: perfilResult.status === 'fulfilled' ? perfilResult.value : null,
    pedidos: pedidosResult.status === 'fulfilled' ? pedidosResult.value : []
  };
}

// Nunca falha - sempre retorna partial results
const dados = await buscarDadosComFallback(123);
console.log('Usuário:', dados.usuario); // Pode ser null se falhou
```

### Pattern 4: Early Return em Caso de Erro

```javascript
async function processarUsuario(id) {
  let usuario;
  
  try {
    usuario = await buscarUsuario(id);
  } catch (error) {
    console.error('Usuário não encontrado:', error);
    return null; // Early return - não continuar
  }
  
  // Só executa se buscarUsuario() teve sucesso
  try {
    const perfil = await buscarPerfil(usuario.perfilId);
    return { usuario, perfil };
    
  } catch (error) {
    console.error('Perfil não encontrado:', error);
    // Retornar apenas usuário (perfil optional)
    return { usuario, perfil: null };
  }
}
```

### Pattern 5: Nested Try/Catch para Errors Específicos

```javascript
async function criarUsuario(dados) {
  try {
    // Validação local (síncrono)
    validarDados(dados); // Pode throw ValidationError
    
    try {
      // Network request (assíncrono)
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      
      if (!response.ok) {
        throw new HTTPError(response.status, 'HTTP error');
      }
      
      return await response.json();
      
    } catch (error) {
      // Captura apenas network/HTTP errors
      
      if (error instanceof HTTPError) {
        console.error('HTTP error:', error.status);
      } else if (error instanceof TypeError) {
        console.error('Network error');
      }
      
      throw error; // Re-throw para outer catch
    }
    
  } catch (error) {
    // Captura validation errors E re-thrown errors
    
    if (error instanceof ValidationError) {
      console.error('Validação falhou:', error.errors);
      // Não re-throw - tratado
      return null;
    }
    
    // Re-throw outros
    throw error;
  }
}
```

### Pattern 6: Retry Logic com Try/Catch

```javascript
async function fetchComRetry(url, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new HTTPError(response.status);
      }
      
      return await response.json();
      
    } catch (error) {
      lastError = error;
      
      // Último retry - não continuar
      if (attempt === maxRetries - 1) {
        break;
      }
      
      // Não retry em client errors (4xx)
      if (error instanceof HTTPError && error.status >= 400 && error.status < 500) {
        break;
      }
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retry ${attempt + 1}/${maxRetries} em ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // Todos retries falharam
  throw lastError;
}

// Uso
try {
  const data = await fetchComRetry('/api/dados');
  console.log('Sucesso:', data);
  
} catch (error) {
  console.error('Falha após retries:', error);
}
```

### Pattern 7: Timeout com AbortController

```javascript
async function fetchComTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController();
  
  // Timeout via AbortController
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId); // Cancelar timeout se sucesso
    
    if (!response.ok) {
      throw new HTTPError(response.status);
    }
    
    return await response.json();
    
  } catch (error) {
    clearTimeout(timeoutId); // Cleanup sempre
    
    // AbortError = timeout
    if (error.name === 'AbortError') {
      throw new TimeoutError(`Timeout após ${timeoutMs}ms`);
    }
    
    throw error;
    
  } finally {
    // Finally garante cleanup
    clearTimeout(timeoutId);
  }
}

// Uso
try {
  const data = await fetchComTimeout('/api/dados-lentos', 3000);
  
} catch (error) {
  if (error instanceof TimeoutError) {
    console.error('Request demorou demais');
  }
}
```

### Pattern 8: Error Boundary Pattern (React-like)

```javascript
async function withErrorBoundary(asyncFn, errorHandler) {
  try {
    return await asyncFn();
    
  } catch (error) {
    // Centralizar error handling
    errorHandler(error);
    
    // Opcional: re-throw ou return fallback
    return null;
  }
}

// Uso
const usuario = await withErrorBoundary(
  () => buscarUsuario(123),
  (error) => {
    console.error('Error boundary capturou:', error);
    logToMonitoring(error);
    showErrorToast(error.message);
  }
);
```

### Pattern 9: Finally para Loading States

```javascript
async function buscarDados() {
  let loading = true;
  mostrarLoader(true);
  
  try {
    const response = await fetch('/api/dados');
    
    if (!response.ok) {
      throw new HTTPError(response.status);
    }
    
    const data = await response.json();
    mostrarDados(data);
    
  } catch (error) {
    mostrarErro(error.message);
    
  } finally {
    // Esconder loader SEMPRE (sucesso ou erro)
    mostrarLoader(false);
    loading = false;
  }
}
```

### Pattern 10: Conditional Error Handling

```javascript
async function buscarComFallback(url, fallbackUrl) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new HTTPError(response.status);
    }
    
    return await response.json();
    
  } catch (error) {
    console.warn('Primary fetch failed, trying fallback');
    
    // Tentar fallback apenas em network/5xx errors
    if (error instanceof TypeError || 
        (error instanceof HTTPError && error.status >= 500)) {
      
      try {
        const fallbackResponse = await fetch(fallbackUrl);
        
        if (!fallbackResponse.ok) {
          throw new HTTPError(fallbackResponse.status);
        }
        
        return await fallbackResponse.json();
        
      } catch (fallbackError) {
        console.error('Fallback também falhou:', fallbackError);
        // Ambos falharam - throw original error
        throw error;
      }
    }
    
    // Não tentar fallback em client errors
    throw error;
  }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Try/Catch

**✅ Sempre em Async Functions**: Para capturar rejections
**✅ HTTP Requests**: Network e HTTP errors
**✅ Resource Management**: Finally para cleanup
**✅ User-Facing Operations**: Mostrar errors user-friendly

### Sequential vs Parallel

**Sequential (await sequencial)**:
- Operações dependentes (resultado1 usado em request2)
- Ordem importa

**Parallel (Promise.all)**:
- Operações independentes
- Performance crítica

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações

**1. No Sync/Async Mix**: `await` apenas em async functions
**2. Performance**: Multiple awaits sequenciais são lentos
**3. Error Context**: Stack traces podem ser confusos em deep call stacks
**4. Top-Level Await**: Apenas em módulos ES (não scripts)

### Armadilhas Comuns

#### Armadilha 1: Await Fora de Async Function

```javascript
// ❌ ERRO - await fora de async
function buscar() {
  const data = await fetch('/api'); // SyntaxError
}

// ✅ CORRETO
async function buscar() {
  const data = await fetch('/api');
}
```

#### Armadilha 2: Esquecer Await

```javascript
// ❌ ERRO - sem await (retorna Promise)
async function buscar() {
  const data = fetch('/api'); // Promise, não dados
  console.log(data); // Promise { <pending> }
}

// ✅ CORRETO
async function buscar() {
  const data = await fetch('/api');
  console.log(data); // Response object
}
```

#### Armadilha 3: Catch Não Captura Errors em Callbacks

```javascript
// ❌ NÃO FUNCIONA
async function exemplo() {
  try {
    setTimeout(() => {
      throw new Error('Erro em callback');
    }, 1000);
  } catch (error) {
    // Nunca captura - callback executa fora do try
  }
}

// ✅ CORRETO - promisify callback
function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Lógica que pode falhar
        resolve();
      } catch (error) {
        reject(error);
      }
    }, ms);
  });
}

async function exemplo() {
  try {
    await delay(1000);
  } catch (error) {
    console.error('Capturado:', error);
  }
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Promises

Async/await é **syntax sugar** para Promises:
- `await promise` = `promise.then()`
- Try/catch = `.catch()`
- Finally = `.finally()`

### Relação com Error Handling

Try/catch unifica **sync e async** error handling:
- Mesma sintaxe para ambos
- Stack traces melhores

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar try/catch com async/await:
1. **Error Boundaries**: React error boundaries
2. **Async Iterators**: `for await...of` loops
3. **AbortController**: Cancelamento avançado
4. **Top-Level Await**: Módulos ES

---

## 📚 Conclusão

Try/catch com async/await é **padrão moderno essencial**.

Dominar async/await significa:
- Usar **async/await** ao invés de Promise chaining
- **Try/catch** para capturar rejections
- **Finally** para cleanup garantido
- **Promise.all** para operações paralelas
- **Error handling** específico por tipo

É a base para código assíncrono limpo, legível e robusto.
