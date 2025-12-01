# then(), catch(), finally(): Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

Os métodos **then()**, **catch()**, e **finally()** são a **interface de consumo** de Promises. Eles permitem **registrar handlers (manipuladores)** que serão executados quando a Promise transicionar de estado - especificamente:

- **then(onFulfilled, onRejected):** Registra handlers para quando Promise for fulfilled (sucesso) ou rejected (erro)
- **catch(onRejected):** Atalho para registrar handler apenas para rejeição (equivale a `.then(null, onRejected)`)
- **finally(onFinally):** Registra handler que executa **sempre**, independente de sucesso ou falha

**Conceito fundamental:** Esses métodos implementam o **padrão Observer** - você "observa" a Promise registrando callbacks que serão notificados quando o estado mudar. Crucialmente, todos esses métodos **retornam uma nova Promise**, permitindo **chaining** (encadeamento) elegante de operações assíncronas.

```javascript
// Estrutura básica
promessa
  .then(valor => {
    // Executado quando Promise fulfilled
    console.log('Sucesso:', valor);
  })
  .catch(erro => {
    // Executado quando Promise rejected
    console.error('Erro:', erro.message);
  })
  .finally(() => {
    // Executado sempre (sucesso ou erro)
    console.log('Operação finalizada');
  });
```

### Contexto Histórico e Motivação

**Callbacks tradicionais: Múltiplos argumentos**

Antes das Promises, consumir operações assíncronas significava passar callback com múltiplos parâmetros:

```javascript
// Node.js error-first callback
operacao(parametros, (erro, resultado) => {
  if (erro) {
    // Tratar erro
  } else {
    // Usar resultado
  }
});
```

**Promises: Separação de concerns**

A especificação **Promises/A+** (2012) introduziu `.then()` para separar claramente:
- Handler de sucesso (fulfilled)
- Handler de erro (rejected)
- Chaining (cada `.then()` retorna nova Promise)

**Evolução:**
- **2012:** Promises/A+ define `.then(onFulfilled, onRejected)`
- **2015:** ES6 adiciona `.catch()` como syntax sugar
- **2018:** ES2018 adiciona `.finally()` para cleanup

**Motivação:**
1. **Separação clara:** Sucesso e erro têm caminhos distintos
2. **Composição:** Chaining torna código assíncrono linear e legível
3. **Error propagation:** Erros fluem automaticamente até `.catch()`
4. **Cleanup:** `.finally()` garante código de limpeza sempre executa

### Problema Fundamental que Resolve

**Problema 1: Callback Hell**

Callbacks aninhados criam código ilegível:

```javascript
// ❌ Pyramid of Doom
op1(function(res1) {
  op2(res1, function(res2) {
    op3(res2, function(res3) {
      // Aninhamento profundo...
    });
  });
});

// ✅ Promise chaining - linear e legível
op1()
  .then(res1 => op2(res1))
  .then(res2 => op3(res2))
  .then(res3 => console.log(res3));
```

**Problema 2: Error Handling Repetitivo**

Com callbacks, cada nível precisa verificar erro:

```javascript
// ❌ Verificação manual repetitiva
op1((erro, res1) => {
  if (erro) return handleError(erro);

  op2(res1, (erro, res2) => {
    if (erro) return handleError(erro);

    op3(res2, (erro, res3) => {
      if (erro) return handleError(erro);

      console.log(res3);
    });
  });
});

// ✅ Erro propaga automaticamente
op1()
  .then(res1 => op2(res1))
  .then(res2 => op3(res2))
  .then(res3 => console.log(res3))
  .catch(handleError); // Um único catch
```

**Problema 3: Cleanup Code**

Garantir código de limpeza (fechar conexões, liberar recursos) executar sempre é complexo com callbacks:

```javascript
// ❌ Difícil garantir cleanup sempre executa
op1((erro, res1) => {
  if (erro) {
    cleanup(); // Repetido
    return handleError(erro);
  }

  op2(res1, (erro, res2) => {
    if (erro) {
      cleanup(); // Repetido
      return handleError(erro);
    }

    cleanup(); // Repetido
    console.log(res2);
  });
});

// ✅ finally() executa sempre
op1()
  .then(res1 => op2(res1))
  .then(res2 => console.log(res2))
  .catch(handleError)
  .finally(() => cleanup()); // Sempre executa
```

### Importância no Ecossistema

Esses métodos são **fundamentais** no JavaScript moderno porque:

1. **API Padrão:** Todas Promises usam esses métodos (Fetch API, async/await, etc.)
2. **Composição:** Chaining via `.then()` é base da composição assíncrona
3. **Error Handling:** `.catch()` centraliza tratamento de erros
4. **Resource Management:** `.finally()` garante limpeza de recursos
5. **Async/Await:** `await` internamente usa `.then()` para pausar execução

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Observer Pattern:** Registrar callbacks que reagem a mudanças de estado
2. **Chaining:** Cada método retorna nova Promise, permitindo encadeamento
3. **Microtask Queue:** Handlers executam assincronamente via microtasks
4. **Error Propagation:** Erros fluem automaticamente pela cadeia
5. **Transformação:** `.then()` pode transformar valores ou Promises

### Pilares Fundamentais

- **then(onFulfilled):** Handler para Promise fulfilled
- **catch(onRejected):** Handler para Promise rejected
- **finally(onFinally):** Handler que executa sempre
- **Retorno de Promise:** Todos métodos retornam nova Promise
- **Execução Assíncrona:** Handlers sempre executam assincronamente

### Visão Geral das Nuances

- **then() com dois argumentos:** `.then(success, error)` pode tratar ambos casos
- **Retornar valor vs Promise:** Comportamentos diferentes em chaining
- **Throw em handler:** Rejeita Promise retornada
- **finally() não recebe argumentos:** Não sabe se foi sucesso ou erro
- **catch() no meio da cadeia:** Permite recovery (recuperação de erro)

---

## 🧠 Fundamentos Teóricos

### Método then(onFulfilled, onRejected)

#### Definição Profunda

**then()** é o método fundamental de Promises. Permite registrar um ou dois handlers:
1. **onFulfilled:** Executado quando Promise for fulfilled (com valor)
2. **onRejected (opcional):** Executado quando Promise for rejected (com razão)

```javascript
// Sintaxe completa
promessa.then(
  function onFulfilled(valor) {
    // Promise fulfilled - usar valor
    console.log('Sucesso:', valor);
  },
  function onRejected(erro) {
    // Promise rejected - tratar erro
    console.error('Erro:', erro.message);
  }
);

// Sintaxe comum: apenas onFulfilled
promessa.then(valor => {
  console.log('Sucesso:', valor);
});
```

**Características fundamentais:**

1. **Retorna nova Promise:**
```javascript
const p1 = Promise.resolve(5);
const p2 = p1.then(n => n * 2);

console.log(p1 === p2); // false (Promises diferentes!)

p2.then(n => console.log(n)); // 10
```

2. **Execução assíncrona (microtask):**
```javascript
console.log('1. Síncrono');

Promise.resolve('valor').then(v => {
  console.log('3. Handler then (microtask)');
});

console.log('2. Síncrono');

/* Output:
1. Síncrono
2. Síncrono
3. Handler then (microtask)
*/
```

Handlers de `.then()` sempre executam **assincronamente**, mesmo que Promise já esteja resolved.

#### Retornando Valores em then()

O que você **retorna** no handler `.then()` determina o valor da Promise retornada:

**1. Retornar valor primitivo:**
```javascript
Promise.resolve(5)
  .then(n => n * 2) // Retorna 10
  .then(n => console.log(n)); // 10
```

**2. Retornar Promise:**
```javascript
Promise.resolve(5)
  .then(n => {
    // Retorna nova Promise
    return Promise.resolve(n * 2);
  })
  .then(n => console.log(n)); // 10 (aguarda Promise interna resolver)
```

**3. Não retornar nada (undefined):**
```javascript
Promise.resolve(5)
  .then(n => {
    console.log(n); // 5
    // Sem return!
  })
  .then(n => console.log(n)); // undefined
```

**4. Lançar erro:**
```javascript
Promise.resolve(5)
  .then(n => {
    throw new Error('Erro!');
  })
  .then(n => console.log('Nunca executa'))
  .catch(erro => console.error(erro.message)); // 'Erro!'
```

#### Chaining (Encadeamento)

**Conceito fundamental:** `.then()` retorna nova Promise, permitindo encadear operações:

```javascript
// Operações sequenciais
buscarUsuario(123)
  .then(usuario => {
    console.log('Usuário:', usuario.nome);
    return buscarPedidos(usuario.id); // Retorna Promise
  })
  .then(pedidos => {
    console.log('Pedidos:', pedidos.length);
    return calcularTotal(pedidos); // Retorna Promise
  })
  .then(total => {
    console.log('Total:', total);
  })
  .catch(erro => {
    console.error('Erro em qualquer etapa:', erro);
  });
```

**Fluxo:**
1. `buscarUsuario()` retorna Promise
2. Primeiro `.then()` aguarda resolução, executa handler
3. Handler retorna `buscarPedidos()` (Promise)
4. Promise retornada por `.then()` aguarda `buscarPedidos()` resolver
5. Segundo `.then()` aguarda resolução, executa handler
6. E assim por diante...

#### Exemplo Completo: Processamento de Dados

```javascript
// Simular APIs que retornam Promises
function buscarDadosBrutos(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, dados: 'dados-brutos-123' });
    }, 500);
  });
}

function processar(dados) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dados.toUpperCase());
    }, 300);
  });
}

function validar(dados) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (dados.includes('123')) {
        resolve(dados);
      } else {
        reject(new Error('Dados inválidos'));
      }
    }, 200);
  });
}

// Pipeline de processamento
console.log('Iniciando pipeline...');

buscarDadosBrutos(1)
  .then(resultado => {
    console.log('1. Dados buscados:', resultado.dados);
    return processar(resultado.dados);
  })
  .then(dadosProcessados => {
    console.log('2. Dados processados:', dadosProcessados);
    return validar(dadosProcessados);
  })
  .then(dadosValidados => {
    console.log('3. Dados validados:', dadosValidados);
    console.log('✅ Pipeline completo!');
  })
  .catch(erro => {
    console.error('❌ Erro no pipeline:', erro.message);
  });

console.log('Pipeline iniciado (não-bloqueante)');

/* Output:
Iniciando pipeline...
Pipeline iniciado (não-bloqueante)
[após 500ms]
1. Dados buscados: dados-brutos-123
[após 300ms]
2. Dados processados: DADOS-BRUTOS-123
[após 200ms]
3. Dados validados: DADOS-BRUTOS-123
✅ Pipeline completo!
*/
```

### Método catch(onRejected)

#### Definição Profunda

**catch()** é **syntax sugar** para registrar handler apenas para rejeição. É equivalente a `.then(null, onRejected)`.

```javascript
// Estas duas formas são equivalentes:
promessa.catch(erro => console.error(erro));

promessa.then(null, erro => console.error(erro));
```

**Por que catch() existe?** Legibilidade e intenção clara:

```javascript
// ✅ Intenção clara com .catch()
promessa
  .then(valor => processar(valor))
  .catch(erro => tratarErro(erro));

// ❌ Menos claro com .then(null, ...)
promessa
  .then(valor => processar(valor))
  .then(null, erro => tratarErro(erro));
```

#### Error Propagation (Propagação de Erros)

**Conceito crucial:** Erros propagam automaticamente pela cadeia até encontrar `.catch()`:

```javascript
Promise.resolve(5)
  .then(n => {
    throw new Error('Erro na etapa 1');
  })
  .then(n => {
    console.log('Pulado');
  })
  .then(n => {
    console.log('Pulado também');
  })
  .catch(erro => {
    console.error('Capturado:', erro.message); // 'Erro na etapa 1'
  });
```

**Múltiplos pontos de erro:**

```javascript
buscarUsuario(id)
  .then(usuario => {
    if (!usuario.ativo) {
      throw new Error('Usuário inativo');
    }
    return buscarPedidos(usuario.id);
  })
  .then(pedidos => {
    if (pedidos.length === 0) {
      throw new Error('Sem pedidos');
    }
    return calcularTotal(pedidos);
  })
  .then(total => {
    console.log('Total:', total);
  })
  .catch(erro => {
    // Captura erros de QUALQUER etapa acima
    console.error('Erro:', erro.message);
  });
```

#### catch() no Meio da Cadeia (Recovery)

**Padrão poderoso:** `.catch()` no meio da cadeia permite **recuperação de erro**:

```javascript
buscarDadosDaAPI()
  .catch(erro => {
    console.warn('API falhou, usando cache:', erro.message);
    return buscarDadosDoCache(); // Recovery: retornar dados alternativos
  })
  .then(dados => {
    // Recebe dados da API OU do cache
    console.log('Dados:', dados);
  });
```

**Fluxo:**
1. Se `buscarDadosDaAPI()` resolve → pula `.catch()`, vai direto para `.then()`
2. Se `buscarDadosDaAPI()` rejeita → `.catch()` executa, retorna valor alternativo → `.then()` recebe valor alternativo

```javascript
// Exemplo detalhado: Fallback chain
buscarDadosServidor1()
  .catch(erro => {
    console.warn('Servidor 1 falhou, tentando servidor 2');
    return buscarDadosServidor2();
  })
  .catch(erro => {
    console.warn('Servidor 2 falhou, tentando servidor 3');
    return buscarDadosServidor3();
  })
  .catch(erro => {
    console.warn('Todos servidores falharam, usando cache');
    return buscarDadosCache();
  })
  .then(dados => {
    console.log('Dados obtidos:', dados);
  })
  .catch(erro => {
    console.error('Tudo falhou, incluindo cache:', erro);
  });
```

### Método finally(onFinally)

#### Definição Profunda

**finally()** registra handler que executa **sempre**, independente de Promise ser fulfilled ou rejected. É usado para **cleanup** (limpeza) de recursos.

```javascript
// Sintaxe
promessa
  .then(valor => console.log('Sucesso:', valor))
  .catch(erro => console.error('Erro:', erro))
  .finally(() => {
    // Sempre executa (sucesso OU erro)
    console.log('Cleanup executado');
  });
```

**Características:**

1. **Sem argumentos:** Handler não recebe valor ou erro
```javascript
promessa.finally(() => {
  // Não sabe se foi sucesso ou erro
  // Não recebe valor ou razão
  console.log('Finalizando');
});
```

2. **Transparência:** Valor/erro passa através do `.finally()`
```javascript
Promise.resolve(42)
  .finally(() => {
    console.log('Cleanup');
    // Não retorna nada
  })
  .then(valor => {
    console.log(valor); // 42 (valor passa através)
  });

Promise.reject(new Error('Erro'))
  .finally(() => {
    console.log('Cleanup');
  })
  .catch(erro => {
    console.log(erro.message); // 'Erro' (erro passa através)
  });
```

3. **Exceção em finally sobrescreve:**
```javascript
Promise.resolve(42)
  .finally(() => {
    throw new Error('Erro no finally');
  })
  .catch(erro => {
    console.error(erro.message); // 'Erro no finally' (sobrescreveu valor original)
  });
```

#### Casos de Uso de finally()

**1. Fechar Conexões:**
```javascript
let conexao;

abrirConexao()
  .then(conn => {
    conexao = conn;
    return executarQuery(conexao);
  })
  .then(resultados => {
    console.log('Resultados:', resultados);
  })
  .catch(erro => {
    console.error('Erro:', erro);
  })
  .finally(() => {
    if (conexao) {
      conexao.fechar(); // Sempre fecha conexão
    }
  });
```

**2. Remover Indicador de Loading:**
```javascript
mostrarLoading(true);

buscarDados()
  .then(dados => {
    exibirDados(dados);
  })
  .catch(erro => {
    exibirErro(erro);
  })
  .finally(() => {
    mostrarLoading(false); // Sempre remove loading
  });
```

**3. Liberar Recursos:**
```javascript
alocarRecurso()
  .then(recurso => {
    return usarRecurso(recurso);
  })
  .catch(erro => {
    console.error('Erro ao usar recurso:', erro);
  })
  .finally(() => {
    liberarRecurso(); // Sempre libera
  });
```

---

## 🔍 Análise Conceitual Profunda

### Comparação: then() vs catch() vs finally()

| Aspecto | then() | catch() | finally() |
|---------|---------|---------|-----------|
| **Quando executa** | Promise fulfilled (ou rejected se 2º arg) | Promise rejected | Sempre |
| **Recebe** | Valor (ou erro) | Erro | Nada |
| **Retorna** | Nova Promise | Nova Promise | Nova Promise |
| **Propaga** | Valor transformado | Pode recuperar (retornar valor) | Valor/erro original |
| **Uso principal** | Transformar dados | Tratar erros | Cleanup |

### Microtask Queue: Por Que Assíncrono?

Handlers de Promise executam via **microtask queue**, não macrotask queue (setTimeout):

```javascript
console.log('1. Síncrono');

setTimeout(() => {
  console.log('4. Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Microtask (Promise)');
});

console.log('2. Síncrono');

/* Output:
1. Síncrono
2. Síncrono
3. Microtask (Promise)
4. Macrotask (setTimeout)
*/
```

**Microtasks têm prioridade:** Executam antes de macrotasks, garantindo que Promises resolvam rapidamente.

### Exemplo Completo: Sistema de Autenticação

```javascript
// Simular API de autenticação
function autenticar(email, senha) {
  return new Promise((resolve, reject) => {
    console.log('Autenticando...');

    setTimeout(() => {
      if (email === 'user@example.com' && senha === '123') {
        resolve({ id: 1, nome: 'Usuário', token: 'abc123' });
      } else {
        reject(new Error('Credenciais inválidas'));
      }
    }, 1000);
  });
}

function salvarToken(usuario) {
  return new Promise((resolve) => {
    console.log('Salvando token...');
    setTimeout(() => {
      localStorage.setItem('token', usuario.token);
      resolve(usuario);
    }, 300);
  });
}

function buscarPerfil(usuario) {
  return new Promise((resolve) => {
    console.log('Buscando perfil...');
    setTimeout(() => {
      resolve({ ...usuario, premium: true });
    }, 500);
  });
}

// Fluxo de autenticação completo
const loading = { ativo: false };

function iniciarLoading() {
  loading.ativo = true;
  console.log('🔄 Loading iniciado');
}

function pararLoading() {
  loading.ativo = false;
  console.log('✅ Loading finalizado');
}

// Pipeline
iniciarLoading();

autenticar('user@example.com', '123')
  .then(usuario => {
    console.log(`✅ Autenticado: ${usuario.nome}`);
    return salvarToken(usuario);
  })
  .then(usuario => {
    console.log('✅ Token salvo');
    return buscarPerfil(usuario);
  })
  .then(perfil => {
    console.log('✅ Perfil completo:', perfil);
    console.log('🎉 Login bem-sucedido!');
  })
  .catch(erro => {
    console.error('❌ Erro no login:', erro.message);
    console.log('Exibindo mensagem de erro para usuário');
  })
  .finally(() => {
    pararLoading();
    console.log('Processo de login finalizado');
  });

console.log('Login iniciado (não-bloqueante)');

/* Output:
🔄 Loading iniciado
Autenticando...
Login iniciado (não-bloqueante)
[após 1 segundo]
✅ Autenticado: Usuário
Salvando token...
[após 300ms]
✅ Token salvo
Buscando perfil...
[após 500ms]
✅ Perfil completo: { id: 1, nome: 'Usuário', token: 'abc123', premium: true }
🎉 Login bem-sucedido!
✅ Loading finalizado
Processo de login finalizado
*/
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Cada Método

**Use then() para:**
- Transformar dados de Promise fulfilled
- Encadear operações assíncronas sequenciais
- Processar resultados de sucesso

**Use catch() para:**
- Tratar erros de qualquer etapa da cadeia
- Recovery (retornar valor alternativo)
- Centralizar error handling

**Use finally() para:**
- Cleanup de recursos (conexões, arquivos, etc.)
- Remover indicadores de loading
- Logging e métricas (sempre executar independente de sucesso/erro)

---

## ⚠️ Limitações e Considerações

### Armadilhas Comuns

#### 1. Esquecer Return em then()

```javascript
// ❌ Não retorna Promise
buscarUsuario()
  .then(usuario => {
    buscarPedidos(usuario.id); // Esqueceu return!
  })
  .then(pedidos => {
    console.log(pedidos); // undefined!
  });

// ✅ Retornar Promise
buscarUsuario()
  .then(usuario => {
    return buscarPedidos(usuario.id); // Return!
  })
  .then(pedidos => {
    console.log(pedidos); // Pedidos corretos
  });
```

#### 2. Aninhamento Desnecessário

```javascript
// ❌ Voltando para callback hell
buscarUsuario()
  .then(usuario => {
    buscarPedidos(usuario.id).then(pedidos => {
      console.log(pedidos);
    });
  });

// ✅ Usar chaining
buscarUsuario()
  .then(usuario => buscarPedidos(usuario.id))
  .then(pedidos => console.log(pedidos));
```

#### 3. Catch Faltando

```javascript
// ⚠️ Unhandled rejection
buscarDados().then(dados => console.log(dados));
// Se buscarDados() rejeitar, erro não é tratado!

// ✅ Sempre adicionar catch
buscarDados()
  .then(dados => console.log(dados))
  .catch(erro => console.error(erro));
```

---

## 🔗 Interconexões Conceituais

**Conceitos Relacionados:**
- **Promises:** then/catch/finally são interface de consumo
- **Chaining:** Base da composição assíncrona
- **Error Propagation:** Fundamental para robustez
- **Microtasks:** Timing de execução de handlers
- **Async/Await:** Abstração sobre then/catch

**Progressão:**
1. Callbacks (fundação)
2. Promises (abstração sobre callbacks)
3. Criando Promises
4. then/catch/finally (este tópico)
5. Promise composition (all, race)
6. Async/await (syntax sugar sobre then)

---

## 🚀 Evolução e Próximos Conceitos

**Próximos Tópicos:**
- **Promise Avançadas:** Promise.all(), Promise.race(), Promise.allSettled(), Promise.any()
- **Async/Await:** Syntax sugar que torna `.then()` implícito

Os métodos then, catch e finally são a interface fundamental para trabalhar com Promises. Dominar esses métodos e suas nuances é essencial para escrever código assíncrono robusto, legível e componível em JavaScript moderno.
