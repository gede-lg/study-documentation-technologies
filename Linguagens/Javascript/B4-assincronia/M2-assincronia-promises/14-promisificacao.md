# Promisificação: Converter Callbacks para Promises

## 🎯 Introdução e Definição

### Definição Conceitual

**Promisificação** (Promisification) é o processo de **converter funções baseadas em callbacks** (estilo Node.js/callback-hell) em **funções que retornam Promises**. É uma transformação que permite usar APIs antigas (callback-based) com sintaxe moderna (Promise chaining, async/await).

Conceitualmente, promisificação é um **adapter pattern** - transforma interface antiga (callbacks) em interface moderna (Promises), permitindo interoperabilidade entre código legacy e código moderno.

**Exemplo básico:**

```javascript
// Função original (callback-based)
fs.readFile('arquivo.txt', 'utf8', (erro, dados) => {
    if (erro) {
        console.error(erro);
    } else {
        console.log(dados);
    }
});

// Versão promisificada
const readFilePromise = promisify(fs.readFile);
readFilePromise('arquivo.txt', 'utf8')
    .then(dados => console.log(dados))
    .catch(erro => console.error(erro));

// Com async/await
const dados = await readFilePromise('arquivo.txt', 'utf8');
```

### Contexto Histórico e Motivação

Antes de Promises (ES6/2015), JavaScript assíncrono dependia de **callbacks**, especialmente no Node.js:

**Callback Pattern (Error-First Callbacks):**

```javascript
// Padrão Node.js: (erro, resultado)
fs.readFile('config.json', (erro, dados) => {
    if (erro) return tratarErro(erro);
    
    const config = JSON.parse(dados);
    
    db.query('SELECT * FROM users', (erro, usuarios) => {
        if (erro) return tratarErro(erro);
        
        processarUsuarios(usuarios, (erro, resultado) => {
            if (erro) return tratarErro(erro);
            
            // ... mais níveis (callback hell)
        });
    });
});
```

**Problemas do padrão callback:**

1. **Callback hell:** Indentação crescente em operações sequenciais
2. **Tratamento de erro duplicado:** `if (erro)` em cada callback
3. **Difícil compor:** Impossível usar `Promise.all()`, async/await, etc.
4. **Inversion of Control:** Você passa controle para biblioteca (callback)
5. **Debugging difícil:** Stack traces confusos

**Motivação para promisificação:**

- **Modernizar código legacy** sem reescrever tudo
- **Unificar interfaces:** Tudo retorna Promise
- **Habilitar async/await:** Código assíncrono como síncrono
- **Composição:** Usar combinators (`Promise.all()`, etc.)
- **Interoperabilidade:** Código novo e antigo trabalhando juntos

**Solução: Promisificação automática**

Node.js fornece `util.promisify()` (desde v8) para converter callbacks em Promises:

```javascript
const { promisify } = require('util');
const fs = require('fs');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Agora usa Promises
async function copiarArquivo(origem, destino) {
    const dados = await readFile(origem, 'utf8');
    await writeFile(destino, dados);
}
```

### Problema Fundamental que Resolve

Promisificação resolve problemas de **transição e modernização**:

**1. Eliminar callback hell:**
```javascript
// Antes (callbacks aninhados)
funcao1((erro, res1) => {
    funcao2(res1, (erro, res2) => {
        funcao3(res2, (erro, res3) => {
            // Pirâmide da perdição
        });
    });
});

// Depois (Promise chain)
promisify(funcao1)()
    .then(res1 => promisify(funcao2)(res1))
    .then(res2 => promisify(funcao3)(res2));

// Ou async/await
const res1 = await promisify(funcao1)();
const res2 = await promisify(funcao2)(res1);
const res3 = await promisify(funcao3)(res2);
```

**2. Unificar tratamento de erros:**
```javascript
// Antes (tratamento em cada callback)
funcao((erro, resultado) => {
    if (erro) return tratarErro(erro);
    processar(resultado);
});

// Depois (tratamento centralizado)
promisify(funcao)()
    .then(resultado => processar(resultado))
    .catch(erro => tratarErro(erro));
```

**3. Habilitar composição:**
```javascript
// Múltiplas operações em paralelo
const [arquivo1, arquivo2, arquivo3] = await Promise.all([
    readFile('a.txt'),
    readFile('b.txt'),
    readFile('c.txt')
]);
```

**4. Modernizar APIs gradualmente:**
```javascript
// Código legacy continua funcionando
fs.readFile('arquivo.txt', callback);  // Ainda funciona

// Código novo usa Promises
await readFile('arquivo.txt');  // Versão promisificada
```

### Importância no Ecossistema

Promisificação é **fundamental** porque:

- **Bridge entre eras:** Permite usar código legacy com sintaxe moderna
- **Padrão Node.js:** `util.promisify()` é padrão oficial
- **Modernização incremental:** Não precisa reescrever tudo de uma vez
- **Interoperabilidade:** Bibliotecas antigas + código moderno
- **Base para async/await:** Habilita uso de async/await em qualquer API

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Adapter Pattern:** Transforma interface callback em interface Promise
2. **Error-First Convention:** Baseia-se no padrão Node.js `(erro, resultado)`
3. **Wrapper Function:** Cria nova função que retorna Promise
4. **Backward Compatible:** Função original permanece inalterada
5. **util.promisify():** Implementação oficial do Node.js

### Pilares Fundamentais

- **Transformação:** Callback → Promise
- **Convenção:** Segue padrão error-first do Node.js
- **Reutilização:** Mesma lógica, nova interface
- **Composição:** Habilita uso de Promise combinators
- **Modernização:** Bridge para async/await

### Visão Geral das Nuances

- **Error-first required:** Só funciona com callbacks `(erro, resultado)`
- **`this` binding:** Precisa preservar contexto
- **util.promisify.custom:** Símbolo para implementação customizada
- **Múltiplos argumentos:** Callbacks com múltiplos resultados retornam array
- **Não é cancelamento:** Promise não cancela callback subjacente

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Mecânica de Promisificação

Transformar callback em Promise envolve:

1. **Criar wrapper function** que retorna Promise
2. **Capturar argumentos** da chamada
3. **Executar função original** com callback customizado
4. **Callback customizado:**
   - Se erro: `reject(erro)`
   - Se sucesso: `resolve(resultado)`

#### Implementação Conceitual (Simplificada)

```javascript
function promisify(funcaoComCallback) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            // Adiciona callback error-first ao final dos argumentos
            funcaoComCallback(...args, (erro, resultado) => {
                if (erro) {
                    reject(erro);
                } else {
                    resolve(resultado);
                }
            });
        });
    };
}
```

**Uso:**

```javascript
// Função original (callback-based)
function buscarUsuario(id, callback) {
    setTimeout(() => {
        if (id < 0) {
            callback(new Error('ID inválido'));
        } else {
            callback(null, { id, nome: 'João' });
        }
    }, 100);
}

// Promisificar
const buscarUsuarioPromise = promisify(buscarUsuario);

// Usar como Promise
buscarUsuarioPromise(123)
    .then(usuario => console.log(usuario))
    .catch(erro => console.error(erro));
```

### Princípios Conceituais

#### Error-First Callback Convention

Promisificação assume **convenção Node.js** de callbacks:

```javascript
funcao(arg1, arg2, (erro, resultado) => {
    // Primeiro parâmetro: erro (ou null)
    // Demais parâmetros: resultados
});
```

Se função não segue essa convenção, promisificação padrão **não funciona**.

#### Preservação de Contexto (`this`)

Promisificação deve **preservar `this`**:

```javascript
function promisify(funcao) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            // IMPORTANTE: usar arrow function ou .bind() para preservar 'this'
            funcao.call(this, ...args, (erro, resultado) => {
                if (erro) reject(erro);
                else resolve(resultado);
            });
        });
    };
}

// Uso em métodos de objeto
const obj = {
    valor: 42,
    metodo(callback) {
        callback(null, this.valor);
    }
};

const metodoPromise = promisify(obj.metodo);
metodoPromise.call(obj).then(val => console.log(val));  // 42
```

#### util.promisify() - Implementação Oficial

Node.js fornece implementação robusta:

```javascript
const { promisify } = require('util');
const fs = require('fs');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Uso
async function exemplo() {
    const conteudo = await readFile('arquivo.txt', 'utf8');
    await writeFile('copia.txt', conteudo);
}
```

---

## 🔍 Análise Conceitual Profunda

### util.promisify() Básico

```javascript
const { promisify } = require('util');
const fs = require('fs');

// Promisificar funções do fs
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

// Usar com async/await
async function listarArquivos() {
    const arquivos = await readdir('./');
    
    for (const arquivo of arquivos) {
        const stats = await stat(arquivo);
        if (stats.isFile()) {
            const conteudo = await readFile(arquivo, 'utf8');
            console.log(`${arquivo}: ${conteudo.length} bytes`);
        }
    }
}
```

### Implementação Manual de Promisify

Para entender profundamente:

```javascript
function promisify(funcaoOriginal) {
    // Retorna função promisificada
    return function promisificada(...args) {
        return new Promise((resolve, reject) => {
            // Callback error-first
            const callback = (erro, ...resultados) => {
                if (erro) {
                    reject(erro);
                } else {
                    // Se múltiplos resultados, retorna array
                    resolve(resultados.length > 1 ? resultados : resultados[0]);
                }
            };
            
            // Chama função original com argumentos + callback
            try {
                funcaoOriginal.call(this, ...args, callback);
            } catch (erro) {
                // Erros síncronos também são rejeitados
                reject(erro);
            }
        });
    };
}
```

### Múltiplos Valores de Retorno

Callbacks podem retornar múltiplos valores:

```javascript
function operacao(callback) {
    callback(null, 'valor1', 'valor2', 'valor3');
}

const operacaoPromise = promisify(operacao);

operacaoPromise().then(resultado => {
    console.log(resultado);  // ['valor1', 'valor2', 'valor3']
});
```

`util.promisify()` retorna **array** se callback tem múltiplos valores (além do erro).

### util.promisify.custom - Implementação Customizada

Algumas funções têm implementação especial de promisificação via símbolo `util.promisify.custom`:

```javascript
const { promisify } = require('util');

function minhaFuncao(arg, callback) {
    // Implementação original (callback)
    setTimeout(() => callback(null, arg * 2), 100);
}

// Implementação customizada de promisificação
minhaFuncao[promisify.custom] = function (arg) {
    return new Promise(resolve => {
        // Lógica customizada (pode ser otimizada, diferente, etc.)
        resolve(arg * 2);
    });
};

const minhaFuncaoPromise = promisify(minhaFuncao);
// Usa implementação customizada, não wrapper genérico
```

Node.js usa isso em algumas APIs internas para otimização.

### Promisificar Módulos Inteiros

Padrão para converter módulo completo:

```javascript
const { promisify } = require('util');
const fs = require('fs');

// Criar objeto com versões promisificadas
const fsPromises = {
    readFile: promisify(fs.readFile),
    writeFile: promisify(fs.writeFile),
    readdir: promisify(fs.readdir),
    stat: promisify(fs.stat),
    mkdir: promisify(fs.mkdir),
    unlink: promisify(fs.unlink)
};

// Uso
async function exemplo() {
    await fsPromises.mkdir('nova-pasta');
    await fsPromises.writeFile('nova-pasta/arquivo.txt', 'conteúdo');
    const conteudo = await fsPromises.readFile('nova-pasta/arquivo.txt', 'utf8');
}
```

**Nota:** Node.js moderno já fornece `fs.promises` com tudo promisificado!

```javascript
const fs = require('fs').promises;

// Já promisificado nativamente
await fs.readFile('arquivo.txt', 'utf8');
```

### Tratamento de Erros

Erros são automaticamente convertidos em rejeições:

```javascript
function funcaoComErro(callback) {
    setTimeout(() => {
        callback(new Error('Algo deu errado'));
    }, 100);
}

const funcaoPromise = promisify(funcaoComErro);

// Erro vira rejeição
funcaoPromise()
    .catch(erro => {
        console.error('Erro capturado:', erro.message);
    });

// Ou com async/await
try {
    await funcaoPromise();
} catch (erro) {
    console.error('Erro capturado:', erro.message);
}
```

### Pattern: Promisificar e Encadear

```javascript
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Pipeline de transformação
async function processarArquivo(entrada, saida) {
    const conteudo = await readFile(entrada, 'utf8');
    const transformado = conteudo.toUpperCase();
    await writeFile(saida, transformado);
}

// Ou com Promise chain
readFile('entrada.txt', 'utf8')
    .then(conteudo => conteudo.toUpperCase())
    .then(transformado => writeFile('saida.txt', transformado))
    .catch(erro => console.error(erro));
```

### Callback com Contexto (this)

```javascript
class Repositorio {
    constructor(db) {
        this.db = db;
    }
    
    buscar(id, callback) {
        this.db.query(`SELECT * FROM users WHERE id = ${id}`, callback);
    }
}

const repo = new Repositorio(db);

// Promisificar método
const buscar = promisify(repo.buscar).bind(repo);  // BIND importante!

// Uso
const usuario = await buscar(123);
```

**Importante:** Sempre use `.bind()` ao promisificar métodos para preservar `this`.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Promisificação

**Use quando:**

1. **APIs legado:** Funções callback-based que quer modernizar
2. **Node.js built-ins:** `fs`, `crypto`, `dns`, etc. (se não usar `fs.promises`)
3. **Bibliotecas antigas:** jQuery, request, etc.
4. **Gradual migration:** Modernizar código incrementalmente
5. **Habilitar async/await:** Quer usar async/await em API callback

**Exemplos ideais:**

**1. File system operations:**
```javascript
const { promisify } = require('util');
const fs = require('fs');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function copiarComTransformacao(origem, destino) {
    const conteudo = await readFile(origem, 'utf8');
    const transformado = transformar(conteudo);
    await writeFile(destino, transformado);
}
```

**2. Database queries:**
```javascript
const { promisify } = require('util');

class Database {
    constructor(connection) {
        this.query = promisify(connection.query).bind(connection);
    }
    
    async buscarUsuarios() {
        return this.query('SELECT * FROM users');
    }
}
```

**3. Bibliotecas HTTP antigas:**
```javascript
const request = require('request');  // Biblioteca antiga
const requestPromise = promisify(request);

async function buscarDados(url) {
    const [response, body] = await requestPromise(url);
    return JSON.parse(body);
}
```

### Quando Não Usar

**Evite quando:**

1. **API já retorna Promise:** Redundante (fetch, axios moderno, fs.promises)
2. **Callback não é error-first:** Promisify assume `(erro, resultado)`
3. **Performance crítica:** Overhead de wrapper (mínimo, mas existe)
4. **Eventos:** Use EventEmitter, não callbacks

```javascript
// ❌ Desnecessário - fetch já retorna Promise
const fetchPromise = promisify(fetch);  // fetch já é Promise!

// ✅ Use direto
await fetch('/dados');
```

---

## ⚠️ Limitações e Considerações Teóricas

### Restrições Conceituais

**1. Requer convenção error-first:**

```javascript
// ✅ Funciona (error-first)
function funcao(arg, callback) {
    callback(null, resultado);  // (erro, resultado)
}

// ❌ Não funciona (sem erro)
function funcao(arg, callback) {
    callback(resultado);  // Sem parâmetro de erro
}
```

**2. Não cancela operações:**

```javascript
const operacaoPromise = promisify(operacaoLonga);

operacaoPromise()
    .then(() => {})
    .catch(() => {});

// Operação CONTINUA mesmo se Promise for descartada
```

Promisificação **não adiciona cancelamento** - operação callback original continua.

**3. Preservação de `this` requer atenção:**

```javascript
const obj = {
    valor: 42,
    metodo(callback) {
        callback(null, this.valor);
    }
};

// ❌ Perde this
const metodo = promisify(obj.metodo);
await metodo();  // Erro! this é undefined

// ✅ Preserva this
const metodo = promisify(obj.metodo).bind(obj);
await metodo();  // 42
```

### Armadilhas Comuns

**Armadilha 1: Esquecer bind em métodos**
```javascript
class API {
    constructor(url) {
        this.url = url;
    }
    
    buscar(id, callback) {
        fetch(`${this.url}/${id}`)  // this.url precisa de contexto
            .then(r => r.json())
            .then(dados => callback(null, dados))
            .catch(erro => callback(erro));
    }
}

const api = new API('https://api.exemplo.com');

// ❌ Sem bind
const buscar = promisify(api.buscar);
await buscar(123);  // Erro! this.url é undefined

// ✅ Com bind
const buscar = promisify(api.buscar).bind(api);
await buscar(123);  // Funciona
```

**Armadilha 2: Assumir que qualquer callback funciona**
```javascript
// ❌ setTimeout não é error-first
const setTimeoutPromise = promisify(setTimeout);
// NÃO funciona corretamente

// ✅ Implementar manualmente
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

**Armadilha 3: Promisificar EventEmitter**
```javascript
const { EventEmitter } = require('events');

const emitter = new EventEmitter();

// ❌ ERRADO - emitter não é callback
const emitterPromise = promisify(emitter.on);

// ✅ Use eventos ou converta manualmente
function waitForEvent(emitter, event) {
    return new Promise(resolve => {
        emitter.once(event, resolve);
    });
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Outros Conceitos

**Callbacks → Promises → Async/Await:**

```javascript
// 1. Callback original
fs.readFile('arquivo.txt', (erro, dados) => {
    if (erro) throw erro;
    console.log(dados);
});

// 2. Promisificado
const readFile = promisify(fs.readFile);
readFile('arquivo.txt')
    .then(dados => console.log(dados));

// 3. Async/await
const dados = await readFile('arquivo.txt');
console.log(dados);
```

Promisificação é **ponte** entre paradigmas.

**fs vs fs.promises:**

```javascript
// Promisify manual
const readFile = promisify(fs.readFile);

// Built-in promisificado
const { readFile } = require('fs').promises;

// Ambos retornam Promise, fs.promises é otimizado
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. **Callbacks** (estilo original)
2. **Promises** (ES6/2015)
3. **Promisificação** (você está aqui - bridge)
4. **Async/Await** (ES2017 - syntax sugar)
5. **APIs nativas promisificadas** (fs.promises, etc.)

### Futuro: APIs Nativas Promise-First

Tendência moderna: APIs novas já retornam Promises:

```javascript
// Antigo (callback)
fs.readFile('arquivo.txt', callback);

// Moderno (Promise nativa)
import { readFile } from 'fs/promises';
await readFile('arquivo.txt');

// Fetch API (sempre Promise)
await fetch('/dados');
```

Promisificação é **temporária** - eventualmente todo código será Promise-first nativamente.

---

## 📚 Conclusão

**Promisificação** é a técnica essencial para **modernizar código callback-based**. Permite usar APIs antigas com Promises e async/await, eliminando callback hell e habilitando composição moderna.

**Conceitos essenciais:**
- Converte callbacks `(erro, resultado)` em Promises
- `util.promisify()` é implementação oficial do Node.js
- Preserva contexto (`this`) com `.bind()`
- Habilita uso de **async/await** em qualquer API
- **Bridge** entre código legacy e moderno
- Não cancela operações subjacentes
- Requer **error-first callback convention**

Dominar promisificação é essencial para trabalhar com Node.js e migrar código legacy para paradigmas modernos.
