# Async Functions: Funções Assíncronas Modernas

## 🎯 Introdução e Definição

### Definição Conceitual

**Async functions** (funções assíncronas) são funções declaradas com a palavra-chave `async` que **sempre retornam uma Promise** automaticamente. Elas permitem usar o operador `await` dentro de seu corpo, tornando código assíncrono **visualmente similar a código síncrono**.

Uma função async é essencialmente **syntax sugar** (açúcar sintático) sobre Promises - tudo que você faz com async/await pode ser feito com `.then()/.catch()`, mas async/await oferece sintaxe muito mais legível e próxima ao código síncrono tradicional.

**Sintaxe básica:**

```javascript
async function minhaFuncao() {
    return 'valor';
}

// Equivalente a:
function minhaFuncao() {
    return Promise.resolve('valor');
}
```

Conceitualmente, `async` transforma sua função em um **gerador de Promises** - qualquer valor retornado é automaticamente encapsulado em `Promise.resolve()`, e qualquer exceção lançada é convertida em `Promise.reject()`.

### Contexto Histórico e Motivação

Async/await foi introduzido no **ES2017 (ES8)** como evolução natural da progressão:

**Callbacks → Promises → Async/Await**

**Era dos Callbacks (pré-ES6):**

```javascript
buscarUsuario(id, (erro, usuario) => {
    if (erro) return tratarErro(erro);
    
    buscarPedidos(usuario.id, (erro, pedidos) => {
        if (erro) return tratarErro(erro);
        
        calcularTotal(pedidos, (erro, total) => {
            if (erro) return tratarErro(erro);
            
            console.log('Total:', total);
        });
    });
});
```

**Era das Promises (ES6/2015):**

```javascript
buscarUsuario(id)
    .then(usuario => buscarPedidos(usuario.id))
    .then(pedidos => calcularTotal(pedidos))
    .then(total => console.log('Total:', total))
    .catch(erro => tratarErro(erro));
```

Melhor que callbacks, mas ainda **não linear** - código assíncrono não se parece com código síncrono.

**Era Async/Await (ES2017):**

```javascript
async function processar(id) {
    try {
        const usuario = await buscarUsuario(id);
        const pedidos = await buscarPedidos(usuario.id);
        const total = await calcularTotal(pedidos);
        console.log('Total:', total);
    } catch (erro) {
        tratarErro(erro);
    }
}
```

**Finalmente código assíncrono que parece síncrono!** Lê-se de cima para baixo, como código tradicional.

**Motivações para async/await:**

1. **Legibilidade:** Código assíncrono indistinguível de síncrono
2. **Debugging:** Stack traces mais claros, breakpoints funcionam naturalmente
3. **Controle de fluxo:** `if`, `for`, `while` funcionam naturalmente
4. **Error handling:** `try/catch` em vez de `.catch()` chains
5. **Menos boilerplate:** Menos `.then()` e callbacks

### Problema Fundamental que Resolve

Async functions resolvem problemas de **legibilidade e controle de fluxo** em código assíncrono:

**1. Código linear (não pyramidal):**

```javascript
// Promises: ainda tem indentação
buscarDados()
    .then(dados => {
        return processar(dados)
            .then(resultado => {
                return salvar(resultado);
            });
    });

// Async/await: linear
async function executar() {
    const dados = await buscarDados();
    const resultado = await processar(dados);
    await salvar(resultado);
}
```

**2. Controle de fluxo natural:**

```javascript
// Promises: difícil usar if/for
buscarUsuario(id)
    .then(usuario => {
        if (usuario.ativo) {
            return buscarPedidos(usuario.id);
        } else {
            return Promise.resolve([]);
        }
    });

// Async/await: if funciona normalmente
async function buscar(id) {
    const usuario = await buscarUsuario(id);
    if (usuario.ativo) {
        return buscarPedidos(usuario.id);
    } else {
        return [];
    }
}
```

**3. Try/catch uniforme:**

```javascript
// Promises: .catch() separado
operacao()
    .then(resultado => processar(resultado))
    .catch(erro => tratarErro(erro));

// Async/await: try/catch tradicional
async function executar() {
    try {
        const resultado = await operacao();
        processar(resultado);
    } catch (erro) {
        tratarErro(erro);
    }
}
```

### Importância no Ecossistema

Async/await é **fundamental** porque:

- **Padrão moderno:** Toda nova API JavaScript usa Promises + async/await
- **Adoção universal:** Todos os frameworks modernos (React, Vue, Angular) usam
- **Legibilidade crítica:** Reduz complexidade cognitiva drasticamente
- **Debugging superior:** Ferramentas de debug funcionam melhor
- **Composição:** Facilita composição de operações assíncronas complexas
- **Base do JavaScript moderno:** Impossível desenvolver sem entender

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **`async` sempre retorna Promise:** Mesmo retorno direto vira `Promise.resolve()`
2. **Exceções viram rejeições:** `throw` dentro de async vira `Promise.reject()`
3. **Await só funciona em async:** Não pode usar `await` fora de função async
4. **Syntax sugar:** Por baixo, ainda são Promises
5. **Compatível com Promises:** Pode misturar `.then()` e `await`

### Pilares Fundamentais

- **Declaração:** `async` antes de `function`, arrow function, ou método
- **Retorno automático:** Qualquer valor retornado é wrapped em Promise
- **Error wrapping:** Exceções síncronas viram Promises rejeitadas
- **Await habilitado:** Permite usar `await` no corpo da função
- **Composição:** Async functions podem chamar outras async functions

### Visão Geral das Nuances

- **Arrow async functions:** `const fn = async () => {}`
- **Async methods:** Objetos e classes podem ter métodos async
- **Retorno explícito de Promise:** Pode retornar Promise diretamente
- **Top-level await:** Em módulos ES, `await` no nível superior (sem async)
- **Performance:** Overhead mínimo comparado a Promises puras

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Mecânica de Async Function

Quando você declara função com `async`:

1. **Função é transformada** em função que retorna Promise
2. **Corpo da função** é wrapped em `try/catch` implícito
3. **Valores retornados** são passados para `Promise.resolve()`
4. **Exceções lançadas** são passadas para `Promise.reject()`
5. **Await expressions** pausam execução (internamente via generators/iterators)

#### Transformação Conceitual

```javascript
// Código que você escreve
async function exemplo() {
    return 42;
}

// O que o motor faz (conceitual)
function exemplo() {
    return new Promise((resolve, reject) => {
        try {
            const resultado = 42;
            resolve(resultado);
        } catch (erro) {
            reject(erro);
        }
    });
}
```

**Importante:** Isso é simplificação - implementação real usa generators e iterators, mas o conceito é esse.

### Princípios Conceituais

#### Promise Wrapping Automático

Tudo que uma async function retorna é **automaticamente wrapped em Promise**:

```javascript
async function retornaValor() {
    return 42;
}

async function retornaPromise() {
    return Promise.resolve(42);
}

// Ambas são equivalentes
retornaValor().then(val => console.log(val));      // 42
retornaPromise().then(val => console.log(val));    // 42
```

Se você retorna Promise, ela **não** é wrapped duas vezes - JavaScript detecta e retorna a Promise original.

#### Exception to Rejection

Exceções síncronas viram Promises rejeitadas:

```javascript
async function comErro() {
    throw new Error('Algo deu errado');
}

// Equivalente a:
function comErro() {
    return Promise.reject(new Error('Algo deu errado'));
}

// Uso
comErro().catch(erro => console.error(erro));
```

Isso **unifica** tratamento de erros síncronos e assíncronos.

#### Await como Pause

`await` **pausa** execução da função async até Promise resolver:

```javascript
async function exemplo() {
    console.log('1');
    const resultado = await Promise.resolve('2');
    console.log(resultado);
    console.log('3');
}

exemplo();
console.log('4');

// Output: 1, 4, 2, 3
```

Função pausa no `await`, cede controle de volta ao Event Loop, e retoma quando Promise resolve.

---

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica - Declarações

**Function declaration:**
```javascript
async function minhaFuncao() {
    return 'valor';
}
```

**Function expression:**
```javascript
const minhaFuncao = async function() {
    return 'valor';
};
```

**Arrow function:**
```javascript
const minhaFuncao = async () => {
    return 'valor';
};

// Arrow com return implícito
const minhaFuncao = async () => 'valor';
```

**Método de objeto:**
```javascript
const obj = {
    async metodo() {
        return 'valor';
    }
};
```

**Método de classe:**
```javascript
class MinhaClasse {
    async metodo() {
        return 'valor';
    }
    
    static async metodoEstatico() {
        return 'valor';
    }
}
```

### Retorno Automático de Promise

Qualquer valor retornado é **automaticamente wrapped**:

```javascript
async function exemplos() {
    return 42;                    // Promise.resolve(42)
    return 'texto';               // Promise.resolve('texto')
    return { a: 1 };              // Promise.resolve({ a: 1 })
    return [1, 2, 3];             // Promise.resolve([1, 2, 3])
    return null;                  // Promise.resolve(null)
    return undefined;             // Promise.resolve(undefined)
    // Sem return                 // Promise.resolve(undefined)
}

// Todas retornam Promise
exemplos().then(valor => console.log(valor));
```

### Retornando Promise Diretamente

Você pode retornar Promise - ela **não** é wrapped duas vezes:

```javascript
async function buscarDados() {
    return fetch('/dados');  // Retorna Promise de fetch
}

// fetch já retorna Promise
// Não vira Promise<Promise<Response>>, apenas Promise<Response>
buscarDados().then(response => response.json());
```

### Exceções Viram Rejeições

**Throw síncrono:**

```javascript
async function validar(valor) {
    if (!valor) {
        throw new Error('Valor obrigatório');
    }
    return valor;
}

// Uso
validar(null)
    .catch(erro => console.error(erro.message));  // "Valor obrigatório"

// Ou com try/catch
try {
    await validar(null);
} catch (erro) {
    console.error(erro.message);
}
```

**Promise rejeitada retornada:**

```javascript
async function buscar(id) {
    if (id < 0) {
        return Promise.reject(new Error('ID inválido'));
    }
    return fetch(`/item/${id}`);
}

// Ambos causam rejeição:
// 1. throw new Error('...')
// 2. return Promise.reject(new Error('...'))
```

### Comparação: Promises vs Async/Await

**Com Promises:**

```javascript
function buscarUsuario(id) {
    return fetch(`/usuario/${id}`)
        .then(response => response.json())
        .then(usuario => {
            console.log('Usuário:', usuario.nome);
            return fetch(`/pedidos/${usuario.id}`);
        })
        .then(response => response.json())
        .then(pedidos => {
            console.log('Pedidos:', pedidos.length);
            return pedidos;
        })
        .catch(erro => {
            console.error('Erro:', erro);
            throw erro;
        });
}
```

**Com Async/Await:**

```javascript
async function buscarUsuario(id) {
    try {
        const response = await fetch(`/usuario/${id}`);
        const usuario = await response.json();
        console.log('Usuário:', usuario.nome);
        
        const responsePedidos = await fetch(`/pedidos/${usuario.id}`);
        const pedidos = await responsePedidos.json();
        console.log('Pedidos:', pedidos.length);
        
        return pedidos;
    } catch (erro) {
        console.error('Erro:', erro);
        throw erro;
    }
}
```

**Muito mais legível!** Lê-se sequencialmente, de cima para baixo.

### Controle de Fluxo - If/Else

**Promises (complicado):**

```javascript
buscarUsuario(id)
    .then(usuario => {
        if (usuario.ativo) {
            return buscarPedidos(usuario.id)
                .then(pedidos => ({ usuario, pedidos }));
        } else {
            return { usuario, pedidos: [] };
        }
    })
    .then(({ usuario, pedidos }) => {
        console.log('Processando...');
    });
```

**Async/await (natural):**

```javascript
async function processar(id) {
    const usuario = await buscarUsuario(id);
    
    let pedidos = [];
    if (usuario.ativo) {
        pedidos = await buscarPedidos(usuario.id);
    }
    
    console.log('Processando...');
    return { usuario, pedidos };
}
```

### Controle de Fluxo - Loops

**Promises (muito difícil):**

```javascript
// Processar array sequencialmente com Promises
function processarSequencial(items) {
    return items.reduce((promise, item) => {
        return promise.then(resultados => {
            return processar(item).then(resultado => {
                resultados.push(resultado);
                return resultados;
            });
        });
    }, Promise.resolve([]));
}
```

**Async/await (trivial):**

```javascript
async function processarSequencial(items) {
    const resultados = [];
    
    for (const item of items) {
        const resultado = await processar(item);
        resultados.push(resultado);
    }
    
    return resultados;
}
```

### Múltiplos Awaits

Você pode ter quantos `await` quiser:

```javascript
async function carregarDashboard() {
    const usuario = await buscarUsuario();
    const config = await buscarConfig();
    const dados = await buscarDados();
    const notificacoes = await buscarNotificacoes();
    
    return { usuario, config, dados, notificacoes };
}
```

**Importante:** Isso é **sequencial** - cada await espera anterior completar.

Para **paralelo**, use `Promise.all()`:

```javascript
async function carregarDashboard() {
    const [usuario, config, dados, notificacoes] = await Promise.all([
        buscarUsuario(),
        buscarConfig(),
        buscarDados(),
        buscarNotificacoes()
    ]);
    
    return { usuario, config, dados, notificacoes };
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Async Functions

**Use quando:**

1. **Código assíncrono com lógica:** if/else, loops, try/catch
2. **Operações sequenciais:** Uma depende da anterior
3. **Legibilidade prioritária:** Código será lido/mantido por humanos
4. **Debugging:** Precisa debugar com breakpoints
5. **Modernização:** Código novo em projeto moderno

**Exemplos ideais:**

**1. Sequência de operações:**
```javascript
async function importarDados(arquivo) {
    const conteudo = await lerArquivo(arquivo);
    const dados = await validarFormato(conteudo);
    const dadosLimpos = await limparDados(dados);
    await salvarNoBanco(dadosLimpos);
    await enviarNotificacao('Importação completa');
}
```

**2. Lógica condicional:**
```javascript
async function processar(usuario) {
    if (usuario.premium) {
        const dadosExtras = await buscarDadosExtras(usuario.id);
        return { ...usuario, ...dadosExtras };
    } else {
        return usuario;
    }
}
```

**3. Loops:**
```javascript
async function processarLote(ids) {
    for (const id of ids) {
        const item = await buscar(id);
        await processar(item);
        await salvar(item);
    }
}
```

### Quando Considerar Promises Puras

**Considere `.then()/.catch()` quando:**

1. **Performance crítica micro-otimização:** Async tem overhead (mínimo)
2. **Código muito simples:** Single `.then()` pode ser mais conciso
3. **Compatibility:** Ambiente não suporta async/await (muito raro hoje)

```javascript
// Muito simples - .then() pode ser OK
fetch('/dados').then(r => r.json()).then(processar);

// Mas async/await ainda é melhor para legibilidade
async function carregar() {
    const response = await fetch('/dados');
    const dados = await response.json();
    processar(dados);
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Restrições Conceituais

**1. Await só em async functions:**

```javascript
// ❌ ERRO - await fora de async
function naoAsync() {
    const resultado = await operacao();  // SyntaxError
}

// ✅ CORRETO
async function async() {
    const resultado = await operacao();
}
```

**Exceção:** Top-level await em módulos ES (veremos depois).

**2. Async functions sempre retornam Promise:**

```javascript
async function exemplo() {
    return 42;  // Você retorna número
}

const resultado = exemplo();
console.log(resultado);  // Promise { <fulfilled>: 42 }, não 42!

// Precisa await ou .then()
const valor = await exemplo();  // 42
```

**3. Sequencial por padrão:**

```javascript
// ❌ LENTO - sequencial (3 segundos)
async function carregar() {
    const dados1 = await fetch('/dados1');  // 1s
    const dados2 = await fetch('/dados2');  // 1s
    const dados3 = await fetch('/dados3');  // 1s
}

// ✅ RÁPIDO - paralelo (1 segundo)
async function carregar() {
    const [dados1, dados2, dados3] = await Promise.all([
        fetch('/dados1'),
        fetch('/dados2'),
        fetch('/dados3')
    ]);
}
```

### Armadilhas Comuns

**Armadilha 1: Esquecer await**
```javascript
// ❌ Não aguarda
async function buscar() {
    const dados = fetch('/dados');  // Promise, não dados!
    console.log(dados);  // Promise { <pending> }
}

// ✅ Com await
async function buscar() {
    const response = await fetch('/dados');
    const dados = await response.json();
    console.log(dados);  // Dados reais
}
```

**Armadilha 2: Await em loop (sequencial sem querer)**
```javascript
// ❌ Sequencial - muito lento
async function processarTodos(ids) {
    const resultados = [];
    for (const id of ids) {
        const resultado = await processar(id);  // Aguarda cada um
        resultados.push(resultado);
    }
    return resultados;
}

// ✅ Paralelo - rápido
async function processarTodos(ids) {
    const promises = ids.map(id => processar(id));
    return Promise.all(promises);
}
```

**Armadilha 3: Não tratar erros**
```javascript
// ❌ Erro não tratado
async function buscar() {
    const dados = await fetch('/dados');  // Pode falhar
    return dados;
}

// ✅ Com tratamento
async function buscar() {
    try {
        const dados = await fetch('/dados');
        return dados;
    } catch (erro) {
        console.error('Erro ao buscar:', erro);
        return null;
    }
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Promises

Async/await é **syntax sugar** sobre Promises:

```javascript
// Async/await
async function exemplo() {
    const a = await operacao1();
    const b = await operacao2(a);
    return b;
}

// Equivalente com Promises
function exemplo() {
    return operacao1()
        .then(a => operacao2(a))
        .then(b => b);
}
```

**Por baixo, ainda são Promises!**

### Event Loop e Microtasks

Async/await usa **microtask queue** como Promises:

```javascript
console.log('1');

async function exemplo() {
    console.log('2');
    await Promise.resolve();
    console.log('4');
}

exemplo();
console.log('3');

// Output: 1, 2, 3, 4
```

Await **cede** controle ao Event Loop.

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. **Callbacks** (padrão antigo)
2. **Promises** (ES6/2015)
3. **Async Functions** (você está aqui - ES2017)
4. **Await Operator** (como usar await)
5. **Error Handling** (try/catch em async)
6. **Sequential vs Parallel** (performance)
7. **Top-level Await** (módulos ES)

### Preparação para Await

Async functions **habilitam** uso de `await`:

```javascript
async function exemplo() {
    const resultado = await operacao();  // await só funciona aqui
    return resultado;
}
```

Próximo tópico: **await operator** - como ele funciona e quando usar.

---

## 📚 Conclusão

**Async functions** revolucionaram código assíncrono em JavaScript, transformando operações complexas em código **linear, legível e manutenível**. São a forma moderna e recomendada de lidar com assincronia.

**Conceitos essenciais:**
- **`async` sempre retorna Promise** automaticamente
- **Exceções viram rejeições** (unifica tratamento de erro)
- **Habilita `await`** no corpo da função
- **Syntax sugar sobre Promises** - mais legível, mesma funcionalidade
- **Controle de fluxo natural** (if, for, while funcionam normalmente)
- **Try/catch tradicional** para tratamento de erro
- **Sempre aguarde com await** ou `.then()` - nunca assuma execução síncrona

Dominar async functions é **essencial** para JavaScript moderno - é o padrão de facto para código assíncrono.
