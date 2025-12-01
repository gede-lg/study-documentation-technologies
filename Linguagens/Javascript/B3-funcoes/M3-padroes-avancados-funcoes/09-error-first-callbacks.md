# Error-First Callbacks: Convenção Node.js para Tratamento de Erros

## 🎯 Introdução e Definição

### Definição Conceitual

**Error-first callbacks** (callbacks com erro primeiro) é uma **convenção de assinatura** para funções callback onde o **primeiro parâmetro sempre representa um erro** (se houver), e os parâmetros subsequentes representam o resultado em caso de sucesso. Se não houver erro, o primeiro parâmetro é `null` ou `undefined`.

Esta convenção estabelece um **protocolo padronizado** para tratamento de erros em operações assíncronas, tornando o código previsível e consistente. É a base histórica de APIs assíncronas no Node.js antes da adoção de Promises.

```javascript
// Assinatura error-first callback
function callback(erro, resultado) {
  if (erro) {
    // Tratar erro
    console.error('Erro:', erro);
    return;
  }

  // Usar resultado (sem erro)
  console.log('Sucesso:', resultado);
}

// Uso com Node.js fs (file system)
const fs = require('fs');
fs.readFile('arquivo.txt', 'utf8', (erro, conteudo) => {
  if (erro) {
    console.error('Erro ao ler arquivo:', erro);
    return;
  }

  console.log('Conteúdo:', conteudo);
});
```

### Contexto Histórico

**Node.js (2009):** Ryan Dahl criou Node.js com I/O assíncrono não-bloqueante. Para manter consistência em APIs, estabeleceu a **convenção error-first** como padrão oficial.

**Motivação:** JavaScript não tinha mecanismo nativo para erros em código assíncrono. Try-catch não funciona com callbacks assíncronos:

```javascript
// ❌ Try-catch NÃO funciona com async
try {
  setTimeout(() => {
    throw new Error('Erro assíncrono');
  }, 1000);
} catch (erro) {
  console.log('Nunca captura!'); // Nunca executa
}
```

**Solução:** Passar erro como parâmetro do callback.

**Evolução:**
- **2009-2015:** Error-first callbacks dominaram Node.js
- **ES6 (2015):** Promises ofereceram alternativa com `.catch()`
- **ES2017:** Async/await permitiu try-catch em código assíncrono
- **Hoje:** Error-first callbacks ainda presentes em APIs legacy Node.js

### Problema que Resolve

Error-first callbacks resolvem problemas fundamentais de **tratamento de erros assíncronos**:

**1. Propagação de Erros:** Como erros assíncronos chegam ao chamador?
**2. Consistência:** Padrão único para todas as APIs
**3. Explicitidade:** Forçar desenvolvedor a considerar erros
**4. Composição:** Permitir encadear operações assíncronas com tratamento de erro

**Sem convenção:**
```javascript
// ❌ Inconsistente - como saber se há erro?
lerArquivo('a.txt', (conteudo) => { ... }); // E se falhar?
buscarDados((resultado) => { ... }); // Como tratar erro?
```

**Com error-first:**
```javascript
// ✅ Padrão consistente
lerArquivo('a.txt', (erro, conteudo) => {
  if (erro) { /* tratar */ }
  // usar conteudo
});

buscarDados((erro, resultado) => {
  if (erro) { /* tratar */ }
  // usar resultado
});
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Convention over Configuration:** Padrão estabelecido por convenção, não mecanismo da linguagem
2. **Explicit Error Handling:** Forçar checagem explícita de erro
3. **Null on Success:** Primeiro parâmetro é `null/undefined` se sucesso
4. **Error Objects:** Erros são objetos Error ou subclasses
5. **Single Error Channel:** Um único canal (primeiro parâmetro) para erros

### Pilares Fundamentais

- **Primeiro Parâmetro = Erro:** Sempre, sem exceções
- **Null Indica Sucesso:** `erro === null` significa operação bem-sucedida
- **Checagem Obrigatória:** Sempre verificar `if (erro)` primeiro
- **Early Return:** Retornar cedo se houver erro
- **Error Propagation:** Passar erro para callback do chamador

---

## 🧠 Fundamentos Teóricos

### Assinatura Padrão

```javascript
// Padrão universal
function operacaoAssincrona(parametros, callback) {
  // ... operação assíncrona ...

  if (sucesso) {
    callback(null, resultado); // null = sem erro
  } else {
    callback(erro); // apenas erro, sem resultado
  }
}

// Uso
operacaoAssincrona(dados, (erro, resultado) => {
  if (erro) {
    // Tratar erro
    return;
  }

  // Usar resultado
});
```

**Regras:**
1. **Primeiro parâmetro:** Sempre `erro` (ou `null`)
2. **Demais parâmetros:** Resultado(s) em caso de sucesso
3. **Erro não-null:** Operação falhou, demais parâmetros são `undefined`
4. **Erro null:** Operação sucedeu, resultado(s) disponíveis

### Exemplo Prático: Node.js File System

```javascript
const fs = require('fs');

// Error-first callback em fs.readFile
fs.readFile('dados.json', 'utf8', (erro, conteudo) => {
  // 1. SEMPRE verificar erro primeiro
  if (erro) {
    // Tipos de erro possíveis:
    // - ENOENT: Arquivo não existe
    // - EACCES: Sem permissão
    // - EISDIR: É diretório, não arquivo

    console.error('Erro ao ler arquivo:', erro.message);
    console.error('Código:', erro.code);
    return; // Early return
  }

  // 2. Usar resultado (só se não houver erro)
  console.log('Conteúdo:', conteudo);

  try {
    const dados = JSON.parse(conteudo);
    console.log('Dados parseados:', dados);
  } catch (parseErro) {
    console.error('Erro ao parsear JSON:', parseErro);
  }
});

// Error-first em fs.writeFile
fs.writeFile('saida.txt', 'conteúdo', (erro) => {
  if (erro) {
    console.error('Erro ao escrever:', erro);
    return;
  }

  console.log('Arquivo escrito com sucesso!');
});
```

### Criar Funções com Error-First Callbacks

```javascript
// Implementar função que segue convenção
function buscarUsuario(id, callback) {
  // Simular operação assíncrona
  setTimeout(() => {
    // Validação
    if (!id) {
      // Erro: passar como primeiro parâmetro
      const erro = new Error('ID é obrigatório');
      return callback(erro);
    }

    // Simular busca em banco
    const usuarios = {
      1: { nome: 'João', idade: 30 },
      2: { nome: 'Maria', idade: 25 }
    };

    const usuario = usuarios[id];

    if (!usuario) {
      // Erro: usuário não encontrado
      const erro = new Error(`Usuário ${id} não encontrado`);
      erro.code = 'USER_NOT_FOUND'; // Código customizado
      return callback(erro);
    }

    // Sucesso: erro = null, resultado = usuario
    callback(null, usuario);
  }, 100);
}

// Uso
buscarUsuario(1, (erro, usuario) => {
  if (erro) {
    console.error('Erro:', erro.message);
    return;
  }

  console.log('Usuário encontrado:', usuario);
});

buscarUsuario(999, (erro, usuario) => {
  if (erro) {
    console.error('Erro:', erro.message); // "Usuário 999 não encontrado"
    return;
  }

  console.log('Usuário:', usuario);
});
```

---

## 🔍 Análise Conceitual Profunda

### Padrão de Checagem de Erro

**Sempre verificar erro primeiro com early return:**

```javascript
// ✅ PADRÃO CORRETO
funcaoAsync((erro, resultado) => {
  if (erro) {
    // Tratar erro
    console.error(erro);
    return; // Early return
  }

  // Código sucesso (não aninhado)
  console.log(resultado);
});

// ❌ ANTI-PADRÃO: não verificar erro
funcaoAsync((erro, resultado) => {
  console.log(resultado); // Pode ser undefined!
});

// ❌ ANTI-PADRÃO: else desnecessário
funcaoAsync((erro, resultado) => {
  if (erro) {
    console.error(erro);
    return;
  } else { // else desnecessário (após return)
    console.log(resultado);
  }
});
```

### Propagar Erros na Cadeia

**Padrão:** Passar erro para callback do chamador.

```javascript
function processarArquivo(caminho, callback) {
  fs.readFile(caminho, 'utf8', (erro, conteudo) => {
    if (erro) {
      // Propagar erro para callback do chamador
      return callback(erro);
    }

    // Processar conteúdo
    try {
      const dados = JSON.parse(conteudo);

      // Validar dados
      if (!dados.nome) {
        const erro = new Error('Campo "nome" obrigatório');
        return callback(erro);
      }

      // Sucesso
      callback(null, dados);

    } catch (parseErro) {
      // Propagar erro de parse
      callback(parseErro);
    }
  });
}

// Uso
processarArquivo('config.json', (erro, config) => {
  if (erro) {
    console.error('Erro ao processar config:', erro.message);
    return;
  }

  console.log('Config carregada:', config);
});
```

### Múltiplas Operações Assíncronas em Sequência

**Problema:** Callbacks aninhados (pyramid of doom / callback hell).

```javascript
// Operações sequenciais com error-first
function carregarDadosCompletos(userId, callback) {
  // 1. Buscar usuário
  buscarUsuario(userId, (erro, usuario) => {
    if (erro) return callback(erro);

    // 2. Buscar posts do usuário
    buscarPosts(usuario.id, (erro, posts) => {
      if (erro) return callback(erro);

      // 3. Buscar comentários dos posts
      buscarComentarios(posts[0].id, (erro, comentarios) => {
        if (erro) return callback(erro);

        // Sucesso: retornar dados combinados
        callback(null, {
          usuario,
          posts,
          comentarios
        });
      });
    });
  });
}

// Uso
carregarDadosCompletos(1, (erro, dados) => {
  if (erro) {
    console.error('Erro:', erro);
    return;
  }

  console.log('Dados completos:', dados);
});
```

**Problema:** Aninhamento profundo dificulta leitura (tratado em "Callback Hell").

### Múltiplas Operações Paralelas

**Padrão:** Executar em paralelo e aguardar todas.

```javascript
function carregarMultiplosArquivos(arquivos, callback) {
  const resultados = [];
  let concluidos = 0;
  let erroOcorreu = false;

  arquivos.forEach((arquivo, indice) => {
    fs.readFile(arquivo, 'utf8', (erro, conteudo) => {
      // Se já houve erro, ignorar
      if (erroOcorreu) return;

      if (erro) {
        erroOcorreu = true;
        return callback(erro);
      }

      // Armazenar resultado
      resultados[indice] = conteudo;
      concluidos++;

      // Verificar se todos concluíram
      if (concluidos === arquivos.length) {
        callback(null, resultados);
      }
    });
  });

  // Edge case: array vazio
  if (arquivos.length === 0) {
    callback(null, []);
  }
}

// Uso
carregarMultiplosArquivos(['a.txt', 'b.txt', 'c.txt'], (erro, conteudos) => {
  if (erro) {
    console.error('Erro:', erro);
    return;
  }

  console.log('Arquivos carregados:', conteudos);
});
```

### Promisificar Error-First Callbacks

**Conceito:** Converter error-first callback para Promise.

```javascript
// Utilitário: converter para Promise
function promisify(funcao) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      funcao(...args, (erro, resultado) => {
        if (erro) {
          reject(erro); // Erro -> reject
        } else {
          resolve(resultado); // Sucesso -> resolve
        }
      });
    });
  };
}

// Uso
const readFilePromise = promisify(fs.readFile);

readFilePromise('arquivo.txt', 'utf8')
  .then(conteudo => {
    console.log('Conteúdo:', conteudo);
  })
  .catch(erro => {
    console.error('Erro:', erro);
  });

// Async/await
async function lerArquivo() {
  try {
    const conteudo = await readFilePromise('arquivo.txt', 'utf8');
    console.log('Conteúdo:', conteudo);
  } catch (erro) {
    console.error('Erro:', erro);
  }
}

// Node.js tem util.promisify nativo
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);
```

### Error Objects: Estrutura e Propriedades

```javascript
function operacaoComErroRico(callback) {
  const erro = new Error('Operação falhou');

  // Propriedades padrão do Error
  console.log(erro.message); // 'Operação falhou'
  console.log(erro.name); // 'Error'
  console.log(erro.stack); // Stack trace

  // Adicionar propriedades customizadas
  erro.code = 'OPERATION_FAILED';
  erro.statusCode = 500;
  erro.timestamp = Date.now();
  erro.details = { tentativas: 3 };

  callback(erro);
}

// Uso com detalhes do erro
operacaoComErroRico((erro, resultado) => {
  if (erro) {
    console.error('Erro:', erro.message);
    console.error('Código:', erro.code);
    console.error('Status:', erro.statusCode);
    console.error('Detalhes:', erro.details);
    return;
  }

  console.log('Resultado:', resultado);
});

// Criar classes de erro customizadas
class ValidationError extends Error {
  constructor(message, campo) {
    super(message);
    this.name = 'ValidationError';
    this.campo = campo;
  }
}

function validarUsuario(dados, callback) {
  if (!dados.email) {
    const erro = new ValidationError('Email obrigatório', 'email');
    return callback(erro);
  }

  callback(null, dados);
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Error-First Callbacks

**✅ Use quando:**

1. **APIs Node.js Legacy:** Manter consistência com APIs existentes
2. **Compatibilidade:** Código precisa funcionar em Node.js antigo
3. **Interoperabilidade:** Integrar com bibliotecas que usam erro-first
4. **Simplicidade:** Callbacks simples sem necessidade de Promises

**❌ Evite quando:**

1. **Projeto Moderno:** Prefira Promises e async/await
2. **Múltiplas Operações:** Promises facilitam composição
3. **Código Complexo:** Error-first leva a callback hell

### APIs Node.js que Usam Error-First

```javascript
const fs = require('fs');
const http = require('http');
const dns = require('dns');

// File System
fs.readFile('arquivo.txt', 'utf8', (erro, conteudo) => { ... });
fs.writeFile('arquivo.txt', 'conteúdo', (erro) => { ... });
fs.stat('arquivo.txt', (erro, stats) => { ... });

// HTTP
http.get('http://example.com', (res) => {
  res.on('data', (chunk) => { ... });
  res.on('end', () => { ... });
}).on('error', (erro) => { ... }); // Error event, não callback

// DNS
dns.lookup('example.com', (erro, endereco, familia) => { ... });

// Crypto
const crypto = require('crypto');
crypto.randomBytes(32, (erro, buffer) => { ... });
```

---

## ⚠️ Limitações e Considerações

### Callback Hell

**Problema:** Aninhamento profundo com múltiplas operações sequenciais.

```javascript
// ❌ Callback hell
funcao1((erro1, resultado1) => {
  if (erro1) return callback(erro1);

  funcao2(resultado1, (erro2, resultado2) => {
    if (erro2) return callback(erro2);

    funcao3(resultado2, (erro3, resultado3) => {
      if (erro3) return callback(erro3);

      // ...
    });
  });
});
```

**Solução:** Promises ou async/await (tópico seguinte).

### Try-Catch Não Funciona

**Problema:** Try-catch não captura erros em callbacks assíncronos.

```javascript
// ❌ NÃO funciona
try {
  fs.readFile('arquivo.txt', 'utf8', (erro, conteudo) => {
    if (erro) throw erro; // throw dentro de callback!
  });
} catch (e) {
  console.log('Nunca captura'); // Nunca executa
}

// ✅ Tratar erro dentro do callback
fs.readFile('arquivo.txt', 'utf8', (erro, conteudo) => {
  if (erro) {
    console.error('Erro:', erro);
    return;
  }

  console.log('Conteúdo:', conteudo);
});
```

### Esquecimento de Checagem de Erro

**Problema:** Desenvolvedor esquece de verificar erro.

```javascript
// ❌ Esqueceu de verificar erro
funcaoAsync((erro, resultado) => {
  console.log(resultado.propriedade); // TypeError se erro!
});

// ✅ Sempre verificar primeiro
funcaoAsync((erro, resultado) => {
  if (erro) {
    console.error(erro);
    return;
  }

  console.log(resultado.propriedade);
});
```

**Solução:** Linters como ESLint podem alertar sobre checagens faltantes.

---

## 🔗 Interconexões Conceituais

**Conceitos Relacionados:**
- **Callback Pattern:** Error-first é tipo específico de callback
- **Promises:** Alternativa moderna com `.catch()`
- **Async/Await:** Permite try-catch em código assíncrono
- **Event Emitters:** Outro padrão de erro (eventos 'error')
- **Callback Hell:** Problema causado por error-first aninhados

**Progressão:**
1. Callbacks síncronos
2. Callbacks assíncronos
3. Error-first callbacks (este tópico)
4. Callback hell (problema)
5. Promises (solução)
6. Async/await (evolução)

---

## 🚀 Evolução e Próximos Conceitos

**Próximos Tópicos:**
- **Callback Hell:** Problema de aninhamento profundo
- **Promises:** Alternativa moderna para async
- **Async/Await:** Sintaxe síncrona para código assíncrono

**Evolução do tratamento de erros assíncronos:**

```javascript
// 1. Error-first callbacks (2009)
fs.readFile('a.txt', (erro, conteudo) => {
  if (erro) { /* tratar */ }
  // usar conteudo
});

// 2. Promises (2015)
readFilePromise('a.txt')
  .then(conteudo => { /* usar */ })
  .catch(erro => { /* tratar */ });

// 3. Async/await (2017)
async function ler() {
  try {
    const conteudo = await readFilePromise('a.txt');
    // usar conteudo
  } catch (erro) {
    // tratar erro
  }
}
```

Error-first callbacks foram revolucionários para Node.js, mas Promises e async/await são preferidos hoje. Entender error-first é **essencial para código legacy** e compreender a evolução do JavaScript assíncrono.
