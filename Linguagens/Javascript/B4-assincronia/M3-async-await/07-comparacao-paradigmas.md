# Comparação: Callbacks vs Promises vs Async/Await

## 🎯 Introdução e Definição

### Definição Conceitual

**Callbacks, Promises e Async/Await** são três **paradigmas evolutivos** para lidar com assincronia em JavaScript. Cada um representa um **nível de abstração** sobre operações assíncronas, com trade-offs em complexidade, legibilidade e controle.

**Resumo conceitual:**

- **Callbacks:** Funções passadas como argumento, chamadas quando operação completa
- **Promises:** Objetos representando valor futuro, com `.then()` e `.catch()`
- **Async/Await:** Syntax sugar sobre Promises, código assíncrono **parece** síncrono

**Mesmo exemplo nos três paradigmas:**

```javascript
// CALLBACKS
buscarUsuario(id, (erro, usuario) => {
    if (erro) {
        console.error(erro);
        return;
    }
    buscarPedidos(usuario.id, (erro, pedidos) => {
        if (erro) {
            console.error(erro);
            return;
        }
        console.log('Pedidos:', pedidos);
    });
});

// PROMISES
buscarUsuario(id)
    .then(usuario => buscarPedidos(usuario.id))
    .then(pedidos => console.log('Pedidos:', pedidos))
    .catch(erro => console.error(erro));

// ASYNC/AWAIT
try {
    const usuario = await buscarUsuario(id);
    const pedidos = await buscarPedidos(usuario.id);
    console.log('Pedidos:', pedidos);
} catch (erro) {
    console.error(erro);
}
```

**Evolução clara:** Cada paradigma simplifica o anterior.

### Contexto Histórico e Motivação

**Era Callbacks (JavaScript inicial):** Única forma de assincronia

```javascript
// 2009 - Node.js populariza callbacks
fs.readFile('arquivo.txt', (erro, dados) => {
    if (erro) throw erro;
    console.log(dados);
});
```

**Problema:** "Callback hell" com operações aninhadas.

**Era Promises (ES2015/ES6):** Padronização de assincronia

```javascript
// 2015 - Promises nativas
fetch('/dados')
    .then(r => r.json())
    .then(dados => console.log(dados));
```

**Melhoria:** Chaining linear, não aninhado.

**Era Async/Await (ES2017/ES8):** Syntax sugar sobre Promises

```javascript
// 2017 - Async/await
const response = await fetch('/dados');
const dados = await response.json();
console.log(dados);
```

**Revolução:** Código assíncrono lê-se como síncrono!

**Timeline da evolução:**

1. **2009:** Node.js populariza callbacks
2. **2012:** Promises/A+ specification
3. **2015:** Promises nativas (ES2015)
4. **2017:** Async/await (ES2017)
5. **2022:** Top-level await (ES2022)

Cada etapa **resolve problemas** da anterior.

### Problema Fundamental que Cada Um Resolve

**Callbacks resolvem:** Como executar código **depois** de operação assíncrona

```javascript
// Antes: não funciona
const dados = lerArquivo('arquivo.txt');  // undefined
console.log(dados);  // undefined

// Callbacks: funciona
lerArquivo('arquivo.txt', (erro, dados) => {
    console.log(dados);  // Dados reais
});
```

**Promises resolvem:** "Callback hell" e composição difícil

```javascript
// Callback hell
operacao1((r1) => {
    operacao2(r1, (r2) => {
        operacao3(r2, (r3) => {
            // Aninhamento infinito
        });
    });
});

// Promises: flat
operacao1()
    .then(r1 => operacao2(r1))
    .then(r2 => operacao3(r2))
    .then(r3 => console.log(r3));
```

**Async/Await resolve:** Promises ainda não-lineares e verbosas

```javascript
// Promises: funcional mas verboso
fetch('/usuario')
    .then(r => r.json())
    .then(usuario => {
        return fetch(`/pedidos/${usuario.id}`);
    })
    .then(r => r.json())
    .then(pedidos => console.log(pedidos));

// Async/await: linear e simples
const usuario = await fetch('/usuario').then(r => r.json());
const pedidos = await fetch(`/pedidos/${usuario.id}`).then(r => r.json());
console.log(pedidos);
```

### Importância no Ecossistema

Entender os três paradigmas é **crucial** porque:

- **Legado:** Código antigo usa callbacks
- **Compatibilidade:** Algumas APIs só têm callbacks (ex: muitas Node.js APIs)
- **Interoperabilidade:** Precisa converter entre paradigmas
- **Escolha consciente:** Saber quando usar cada um
- **Debugging:** Entender stack traces em cada paradigma
- **Performance:** Nuances de performance entre eles

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Callbacks:** Funções como continuação, error-first convention
2. **Promises:** Objetos com estados (pending/fulfilled/rejected), chaining
3. **Async/Await:** Syntax sugar, transforma assíncrono em aparência síncrona
4. **Evolução:** Cada paradigma **abstrai** anterior
5. **Interoperabilidade:** Podem coexistir e converter entre eles

### Pilares Fundamentais

- **Abstração crescente:** Callbacks → Promises → Async/Await
- **Legibilidade:** Melhora drasticamente ao longo da evolução
- **Error handling:** Padronização progressiva
- **Composição:** Facilita ao longo da evolução
- **Control flow:** `if/for/while` só naturais em async/await

### Visão Geral das Nuances

- **Performance:** Similar (async/await é Promises por baixo)
- **Debugging:** Stack traces mais claros em async/await
- **Cancelamento:** Nenhum tem suporte nativo (Promises canceláveis em proposta)
- **Compatibilidade:** Callbacks universais, Promises ES2015+, Async/await ES2017+
- **Promisification:** Converter callbacks em Promises

---

## 🧠 Fundamentos Teóricos

### Callbacks - Conceito Fundamental

**Callback:** Função passada para outra função, executada quando operação completa.

```javascript
function operacaoAssincrona(parametro, callback) {
    setTimeout(() => {
        const resultado = parametro * 2;
        callback(null, resultado);  // Error-first: (erro, resultado)
    }, 1000);
}

// Uso
operacaoAssincrona(5, (erro, resultado) => {
    if (erro) {
        console.error(erro);
    } else {
        console.log(resultado);  // 10
    }
});
```

**Error-first convention:** Primeiro argumento é erro (null se sucesso).

### Promises - Objeto Representando Futuro

**Promise:** Objeto com **estados** representando operação assíncrona.

```javascript
function operacaoAssincrona(parametro) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const resultado = parametro * 2;
            resolve(resultado);  // Ou reject(erro)
        }, 1000);
    });
}

// Uso
operacaoAssincrona(5)
    .then(resultado => console.log(resultado))  // 10
    .catch(erro => console.error(erro));
```

**Estados:** `pending` → `fulfilled` (resolve) ou `rejected` (reject).

### Async/Await - Syntax Sugar sobre Promises

**Async/Await:** Palavras-chave que tornam Promises **parecerem síncronas**.

```javascript
async function operacaoAssincrona(parametro) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(parametro * 2);
        }, 1000);
    });
}

// Uso
async function executar() {
    try {
        const resultado = await operacaoAssincrona(5);
        console.log(resultado);  // 10
    } catch (erro) {
        console.error(erro);
    }
}

executar();
```

`await` pausa execução até Promise resolver.

---

## 🔍 Análise Conceitual Profunda

### Comparação: Operação Sequencial

**Callbacks:**
```javascript
buscarUsuario(id, (erro, usuario) => {
    if (erro) return console.error(erro);
    
    buscarPedidos(usuario.id, (erro, pedidos) => {
        if (erro) return console.error(erro);
        
        calcularTotal(pedidos, (erro, total) => {
            if (erro) return console.error(erro);
            
            console.log('Total:', total);
        });
    });
});
```

**Problemas:**
- **Callback hell:** Aninhamento profundo
- **Error handling:** Repetitivo em cada nível
- **Legibilidade:** Difícil seguir fluxo

**Promises:**
```javascript
buscarUsuario(id)
    .then(usuario => buscarPedidos(usuario.id))
    .then(pedidos => calcularTotal(pedidos))
    .then(total => console.log('Total:', total))
    .catch(erro => console.error(erro));
```

**Melhorias:**
- **Flat:** Não aninha
- **Error handling:** Um `.catch()` captura todos
- **Legibilidade:** Fluxo linear

**Async/Await:**
```javascript
async function processar(id) {
    try {
        const usuario = await buscarUsuario(id);
        const pedidos = await buscarPedidos(usuario.id);
        const total = await calcularTotal(pedidos);
        console.log('Total:', total);
    } catch (erro) {
        console.error(erro);
    }
}

processar(id);
```

**Melhorias:**
- **Linear:** Lê de cima para baixo
- **Familiar:** Como código síncrono
- **Controle de fluxo:** `if/for/while` funcionam naturalmente

### Comparação: Operação Paralela

**Callbacks:**
```javascript
let resultados = [];
let contador = 0;

operacao1((erro, r1) => {
    if (erro) return console.error(erro);
    resultados[0] = r1;
    if (++contador === 3) processar(resultados);
});

operacao2((erro, r2) => {
    if (erro) return console.error(erro);
    resultados[1] = r2;
    if (++contador === 3) processar(resultados);
});

operacao3((erro, r3) => {
    if (erro) return console.error(erro);
    resultados[2] = r3;
    if (++contador === 3) processar(resultados);
});
```

**Complexo e propenso a erros!**

**Promises:**
```javascript
Promise.all([operacao1(), operacao2(), operacao3()])
    .then(([r1, r2, r3]) => {
        console.log(r1, r2, r3);
    })
    .catch(erro => console.error(erro));
```

**Simples e claro!**

**Async/Await:**
```javascript
try {
    const [r1, r2, r3] = await Promise.all([
        operacao1(),
        operacao2(),
        operacao3()
    ]);
    console.log(r1, r2, r3);
} catch (erro) {
    console.error(erro);
}
```

**Ainda mais legível!**

### Comparação: Error Handling

**Callbacks:**
```javascript
operacao1((erro1, resultado1) => {
    if (erro1) {
        console.error('Erro 1:', erro1);
        return;
    }
    
    operacao2(resultado1, (erro2, resultado2) => {
        if (erro2) {
            console.error('Erro 2:', erro2);
            return;
        }
        
        console.log(resultado2);
    });
});
```

**Error handling em cada nível - repetitivo.**

**Promises:**
```javascript
operacao1()
    .then(resultado1 => operacao2(resultado1))
    .then(resultado2 => console.log(resultado2))
    .catch(erro => {
        // Captura QUALQUER erro na cadeia
        console.error('Erro:', erro);
    });
```

**Um `.catch()` para todos os erros.**

**Async/Await:**
```javascript
try {
    const resultado1 = await operacao1();
    const resultado2 = await operacao2(resultado1);
    console.log(resultado2);
} catch (erro) {
    // Captura qualquer erro
    console.error('Erro:', erro);
}
```

**Try/catch familiar - mesmo para síncrono e assíncrono.**

### Comparação: Controle de Fluxo Condicional

**Callbacks:**
```javascript
buscarUsuario(id, (erro, usuario) => {
    if (erro) return console.error(erro);
    
    if (usuario.premium) {
        buscarDadosExtras(usuario.id, (erro, dados) => {
            if (erro) return console.error(erro);
            console.log(dados);
        });
    } else {
        console.log('Usuário básico');
    }
});
```

**Promises:**
```javascript
buscarUsuario(id)
    .then(usuario => {
        if (usuario.premium) {
            return buscarDadosExtras(usuario.id);
        } else {
            return Promise.resolve('Usuário básico');
        }
    })
    .then(resultado => console.log(resultado))
    .catch(erro => console.error(erro));
```

**Async/Await:**
```javascript
try {
    const usuario = await buscarUsuario(id);
    
    if (usuario.premium) {
        const dados = await buscarDadosExtras(usuario.id);
        console.log(dados);
    } else {
        console.log('Usuário básico');
    }
} catch (erro) {
    console.error(erro);
}
```

**If/else funciona naturalmente - como código síncrono!**

### Comparação: Loops

**Callbacks:**
```javascript
function processarSequencial(items, callback) {
    let i = 0;
    
    function proximo() {
        if (i >= items.length) {
            callback();
            return;
        }
        
        processar(items[i], (erro) => {
            if (erro) {
                callback(erro);
            } else {
                i++;
                proximo();  // Recursão
            }
        });
    }
    
    proximo();
}
```

**Complexo - recursão manual!**

**Promises:**
```javascript
items.reduce((chain, item) => {
    return chain.then(() => processar(item));
}, Promise.resolve())
    .then(() => console.log('Concluído'))
    .catch(erro => console.error(erro));
```

**Funciona, mas não intuitivo.**

**Async/Await:**
```javascript
async function processarTodos(items) {
    try {
        for (const item of items) {
            await processar(item);
        }
        console.log('Concluído');
    } catch (erro) {
        console.error(erro);
    }
}
```

**Loop normal - trivial!**

### Comparação: Acesso a Valores Intermediários

**Callbacks:**
```javascript
operacao1((erro, valor1) => {
    if (erro) return console.error(erro);
    
    operacao2((erro, valor2) => {
        if (erro) return console.error(erro);
        
        // Precisa de valor1 e valor2 juntos
        console.log(valor1, valor2);
    });
});
```

**Valores anteriores acessíveis por escopo de closure.**

**Promises:**
```javascript
let valor1;

operacao1()
    .then(v1 => {
        valor1 = v1;
        return operacao2();
    })
    .then(valor2 => {
        console.log(valor1, valor2);  // Precisa variável externa
    });

// Ou retornar objeto
operacao1()
    .then(valor1 => {
        return operacao2().then(valor2 => ({ valor1, valor2 }));
    })
    .then(({ valor1, valor2 }) => {
        console.log(valor1, valor2);
    });
```

**Precisa workaround (variável externa ou objeto wrapper).**

**Async/Await:**
```javascript
const valor1 = await operacao1();
const valor2 = await operacao2();

console.log(valor1, valor2);  // Ambos no mesmo escopo!
```

**Trivial - ambos disponíveis naturalmente!**

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Callbacks

**Use callbacks quando:**

1. **API legada:** Biblioteca só oferece callbacks (fs, muitas APIs Node.js)
2. **Event listeners:** Eventos DOM, EventEmitter
3. **Simples e único:** Operação assíncrona única sem composição
4. **Performance crítica:** Callbacks têm overhead mínimo (raramente relevante)

**Exemplos:**

```javascript
// APIs Node.js
fs.readFile('arquivo.txt', (erro, dados) => { ... });

// Event listeners
button.addEventListener('click', (evento) => { ... });

// setTimeout/setInterval
setTimeout(() => console.log('Timeout'), 1000);
```

**Quando evitar:**
- Operações sequenciais complexas (callback hell)
- Múltiplas operações paralelas (difícil coordenar)
- Quando Promises estão disponíveis

### Quando Usar Promises

**Use Promises quando:**

1. **Composição:** Múltiplas operações assíncronas encadeadas
2. **Paralelismo:** `Promise.all()`, `allSettled()`, `race()`
3. **Compatibilidade:** Ambiente não suporta async/await (ES2015 vs ES2017)
4. **Callback promisification:** Converter callbacks em Promises
5. **Functional style:** Preferência por `.then()` chaining

**Exemplos:**

```javascript
// Fetch API (retorna Promise)
fetch('/dados').then(r => r.json()).then(dados => { ... });

// Paralelismo
Promise.all([op1(), op2(), op3()]).then(resultados => { ... });

// Chaining
buscarUsuario()
    .then(usuario => buscarPedidos(usuario.id))
    .then(pedidos => processar(pedidos));
```

**Quando evitar:**
- Código complexo com muitos `.then()` (use async/await)
- Quando async/await disponível e mais legível

### Quando Usar Async/Await

**Use async/await quando:**

1. **Código moderno:** ES2017+ disponível
2. **Legibilidade:** Código assíncrono complexo
3. **Controle de fluxo:** `if/for/while` necessários
4. **Debugging:** Facilita rastreamento de erros
5. **Padrão:** **Sempre que possível** (é o mais legível)

**Exemplos:**

```javascript
// Sequencial
async function processar(id) {
    const usuario = await buscarUsuario(id);
    const pedidos = await buscarPedidos(usuario.id);
    return pedidos;
}

// Paralelo
async function carregar() {
    const [u, p, c] = await Promise.all([
        buscarUsuario(),
        buscarPedidos(),
        buscarConfig()
    ]);
    return { u, p, c };
}

// Loops
async function processarTodos(items) {
    for (const item of items) {
        await processar(item);
    }
}
```

**Quando evitar:**
- Ambiente legado sem suporte ES2017
- Transpilação indesejada

### Matriz de Decisão

| Cenário | Callbacks | Promises | Async/Await |
|---------|-----------|----------|-------------|
| Operação única simples | ✅ | ✅ | ✅ |
| Operações sequenciais | ❌ | ✅ | ✅✅ |
| Operações paralelas | ❌ | ✅✅ | ✅✅ |
| Controle de fluxo (if/for) | ❌ | ⚠️ | ✅✅ |
| Error handling | ⚠️ | ✅ | ✅✅ |
| Legibilidade | ❌ | ✅ | ✅✅ |
| Debugging | ⚠️ | ✅ | ✅✅ |
| Compatibilidade ES5 | ✅✅ | ❌ | ❌ |
| Compatibilidade ES2015+ | ✅ | ✅✅ | ❌ |
| Compatibilidade ES2017+ | ✅ | ✅ | ✅✅ |

**✅✅ = Ideal** | **✅ = Bom** | **⚠️ = Possível mas não ideal** | **❌ = Evitar**

---

## ⚠️ Limitações e Considerações Teóricas

### Performance

**Todos têm performance similar:**

```javascript
// Callbacks - overhead mínimo
operacao(callback);

// Promises - overhead de Promise object
operacao().then(resultado => { ... });

// Async/await - internamente é Promise (mesmo overhead)
await operacao();
```

**Diferença negligível** na maioria dos casos.

### Debugging

**Stack traces:**

**Callbacks:**
```javascript
function a() { b(); }
function b() { c(); }
function c() { callback(); }

// Stack trace pode ser confuso com callbacks aninhados
```

**Promises:**
```javascript
a().then(b).then(c);

// Stack trace às vezes perde contexto
```

**Async/Await:**
```javascript
async function processo() {
    await a();
    await b();
    await c();
}

// Stack trace MUITO mais claro!
```

**Async/await vence em debugging.**

### Cancelamento

**Nenhum tem suporte nativo:**

```javascript
// Callbacks - precisa implementar manualmente
let cancelado = false;
operacao((resultado) => {
    if (!cancelado) processar(resultado);
});

// Promises - não canceláveis nativamente
const promise = operacao();
// Não pode cancelar promise

// Async/await - mesma limitação (é Promise)
const resultado = await operacao();
// Não pode cancelar
```

**Solução:** AbortController (Fetch API) ou bibliotecas third-party.

### Interoperabilidade

**Converter entre paradigmas:**

**Callback → Promise (Promisification):**
```javascript
const { promisify } = require('util');

// Callback
fs.readFile('arquivo.txt', (erro, dados) => { ... });

// Promise
const readFilePromise = promisify(fs.readFile);
readFilePromise('arquivo.txt').then(dados => { ... });
```

**Promise → Callback:**
```javascript
function operacaoComCallback(parametro, callback) {
    operacaoPromise(parametro)
        .then(resultado => callback(null, resultado))
        .catch(erro => callback(erro));
}
```

**Async/Await com Promises:**
```javascript
// Async/await É Promise
async function processar() {
    return await operacao();
}

// Pode usar .then()
processar().then(resultado => { ... });
```

---

## 🔗 Interconexões Conceituais

### Callbacks → Promises → Async/Await (Evolução)

```javascript
// CALLBACKS (2009)
operacao(param, (erro, resultado) => {
    if (erro) return tratarErro(erro);
    processar(resultado);
});

// PROMISES (2015)
operacao(param)
    .then(resultado => processar(resultado))
    .catch(erro => tratarErro(erro));

// ASYNC/AWAIT (2017)
try {
    const resultado = await operacao(param);
    processar(resultado);
} catch (erro) {
    tratarErro(erro);
}
```

**Cada etapa abstrai e simplifica anterior.**

### Relação com Event Loop

**Todos usam Event Loop:**

```javascript
// Callbacks - callback queue
setTimeout(() => console.log('callback'), 0);

// Promises - microtask queue
Promise.resolve().then(() => console.log('promise'));

// Async/await - microtask queue (é Promise)
(async () => {
    await Promise.resolve();
    console.log('async/await');
})();

console.log('síncrono');

// Output: síncrono, promise, async/await, callback
```

Promises/async-await têm **prioridade** (microtasks antes de callbacks).

---

## 🚀 Evolução e Próximos Conceitos

### Futuro da Assincronia em JavaScript

**Propostas em andamento:**

1. **Async Iterators (já disponível):** `for await...of`
2. **Top-level Await (ES2022):** Await fora de async function
3. **Temporal API:** Melhor manipulação de datas/horários assíncronos
4. **Cancelable Promises (proposta):** Promises canceláveis nativamente

**Tendências:**

- **Async/await domina:** Padrão moderno
- **Promises permanecem:** Base de async/await
- **Callbacks legado:** Mantidos para compatibilidade

---

## 📚 Conclusão

**Callbacks, Promises e Async/Await** representam evolução da assincronia em JavaScript. **Async/await é o padrão moderno** - mais legível, manutenível e debugável.

**Resumo comparativo:**

| Aspecto | Callbacks | Promises | Async/Await |
|---------|-----------|----------|-------------|
| **Ano** | 2009 | 2015 | 2017 |
| **Legibilidade** | Baixa | Média | Alta |
| **Error Handling** | Repetitivo | Unificado | Familiar (try/catch) |
| **Composição** | Difícil | Boa | Excelente |
| **Controle de Fluxo** | Difícil | Possível | Natural |
| **Debugging** | Difícil | Médio | Fácil |
| **Paralelismo** | Complexo | Simples | Simples |
| **Compatibilidade** | Universal | ES2015+ | ES2017+ |
| **Quando usar** | APIs legadas | Composição | **SEMPRE** (quando disponível) |

**Recomendação:**
- **Prefira:** Async/await (mais moderno e legível)
- **Use:** Promises quando async/await não disponível ou quando `.then()` chaining é mais claro
- **Evite:** Callbacks (exceto APIs que só oferecem callbacks ou events)

**Conceitos essenciais:**
- **Callbacks:** Base histórica, ainda presente em APIs legadas
- **Promises:** Abstração poderosa, base de async/await
- **Async/Await:** Melhor legibilidade, padrão moderno
- **Evolução:** Cada paradigma melhora anterior
- **Interoperabilidade:** Podem coexistir e converter entre eles
- **Performance:** Similar entre os três
- **Debugging:** Async/await vence
- **Futuro:** Async/await é o padrão

Dominar os três paradigmas é essencial para trabalhar com **código legado e moderno**, e para **escolher a melhor ferramenta** para cada situação.
