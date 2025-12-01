# Promise.allSettled(): Aguardar Todas sem Falhar

## 🎯 Introdução e Definição

### Definição Conceitual

**Promise.allSettled()** é um método estático que recebe um **array (ou iterável) de Promises** e retorna uma **única Promise** que resolve quando **todas** as Promises do array finalizarem (resolvidas **ou** rejeitadas). Diferente de `Promise.all()`, **nunca rejeita** - sempre resolve com array de objetos descrevendo o resultado de cada Promise.

Cada elemento do array de resultados é um objeto com:
- **`{ status: 'fulfilled', value: resultado }`** - para Promises resolvidas
- **`{ status: 'rejected', reason: erro }`** - para Promises rejeitadas

Conceitualmente, `Promise.allSettled()` implementa **coordenação tolerante a falhas** - você quer saber o resultado de TODAS as operações, independente de sucesso ou falha individual.

### Contexto Histórico e Motivação

`Promise.allSettled()` foi adicionado ao JavaScript em **ES2020** para resolver limitação crítica de `Promise.all()`:

**Problema com Promise.all():**

```javascript
Promise.all([
    fetch('/usuario'),      // Sucesso
    fetch('/pedidos'),      // FALHA
    fetch('/produtos')      // Sucesso (mas resultado perdido!)
])
.then(resultados => {
    // NUNCA executa se uma falhar
})
.catch(erro => {
    // Perdeu os resultados de /usuario e /produtos
    // Só sabe que /pedidos falhou
});
```

Se **uma** Promise falha, `Promise.all()` **descarta todos os resultados**, mesmo os sucessos.

**Cenários onde isso é problema:**

1. **Requests independentes:** Carregar múltiplos recursos onde alguns podem falhar
2. **Batch operations:** Processar lista de items onde alguns podem dar erro
3. **Validações múltiplas:** Executar validações e querer todos os erros, não só o primeiro
4. **Telemetria/logging:** Enviar múltiplos logs onde falha de um não deve afetar outros

**Solução: Promise.allSettled()**

```javascript
Promise.allSettled([
    fetch('/usuario'),      // Sucesso
    fetch('/pedidos'),      // FALHA
    fetch('/produtos')      // Sucesso
])
.then(resultados => {
    // SEMPRE executa
    // resultados[0]: { status: 'fulfilled', value: Response }
    // resultados[1]: { status: 'rejected', reason: Error }
    // resultados[2]: { status: 'fulfilled', value: Response }
    
    // Processa sucessos, trata erros individualmente
});
```

### Problema Fundamental que Resolve

`Promise.allSettled()` resolve problemas de **resiliência e resultados parciais**:

**1. Resultados parciais:** Obter sucessos mesmo quando algumas operações falham
**2. Diagnosticabilidade:** Saber exatamente quais operações sucederam e quais falharam
**3. Independência de operações:** Falha de uma não invalida outras
**4. Relatórios completos:** Gerar relatórios de sucesso/erro de batch operations
**5. Graceful degradation:** UI pode exibir dados parciais em vez de falha total

**Exemplo prático:**

```javascript
// Dashboard carregando múltiplos widgets
async function carregarDashboard() {
    const resultados = await Promise.allSettled([
        carregarWidget1(),  // Pode falhar
        carregarWidget2(),  // Pode falhar
        carregarWidget3()   // Pode falhar
    ]);
    
    resultados.forEach((resultado, i) => {
        if (resultado.status === 'fulfilled') {
            renderizarWidget(i, resultado.value);
        } else {
            mostrarErroWidget(i, resultado.reason);
        }
    });
}
// Dashboard exibe widgets que carregaram + mensagens de erro para os que falharam
// Muito melhor que tela em branco se um widget falhar
```

### Importância no Ecossistema

`Promise.allSettled()` é **crucial** porque:

- **Resiliência:** Aplicações robustas não falham completamente por erros parciais
- **UX:** Usuários veem dados parciais em vez de erro total
- **Batch processing:** Essencial para processar listas onde falhas são esperadas
- **Observabilidade:** Rastrear taxa de sucesso/falha de operações
- **Complemento a Promise.all():** Escolha certa quando falhas não são deal-breakers

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Nunca rejeita:** Sempre resolve, mesmo se todas as Promises falharem
2. **Espera todas:** Aguarda TODAS finalizarem (settled = fulfilled ou rejected)
3. **Resultado descritivo:** Objeto com `status` e `value`/`reason` para cada Promise
4. **Ordem preservada:** Array de resultados mantém ordem do input
5. **Status uniforme:** Estrutura consistente para sucesso e erro

### Pilares Fundamentais

- **Tolerância a falhas:** Falha de uma não afeta resultado total
- **Completude:** Retorna informação de TODAS as operações
- **Simetria:** Trata sucessos e falhas uniformemente
- **Non-blocking:** Uma Promise lenta não bloqueia acesso a resultados de outras
- **Observabilidade:** Resultado permite análise detalhada de sucessos/falhas

### Visão Geral das Nuances

- **Sempre fulfilled:** Promise retornada nunca vai para estado "rejected"
- **Timing:** Resolve quando **última** Promise finalizar (mais lenta)
- **Empty array:** `Promise.allSettled([])` resolve com `[]` imediatamente
- **Estrutura de resultado:** Sempre objeto com `status`, depois `value` ou `reason`
- **Compatibilidade:** ES2020+, não disponível em navegadores muito antigos

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Mecânica de Execução

Quando você chama `Promise.allSettled(iterable)`:

1. **Conversão** de iterable em array de Promises
2. **Normalização** via `Promise.resolve()` para valores não-Promise
3. **Promise container criada** (sempre resolve, nunca rejeita)
4. **Contador de pendentes** rastreado
5. **Array de resultados** pré-alocado

**Para cada Promise:**
- Handler `.then(onFulfilled, onRejected)` é anexado
- **Se resolve:** Armazena `{ status: 'fulfilled', value: valor }`
- **Se rejeita:** Armazena `{ status: 'rejected', reason: erro }`
- Decrementa contador
- Quando contador chega a 0: Promise container **resolve** com array de resultados

#### Pseudocódigo Conceitual

```javascript
function PromiseAllSettled(promises) {
    return new Promise((resolve) => {  // Nunca chama reject!
        const resultados = [];
        let pendentes = promises.length;
        
        if (pendentes === 0) {
            resolve([]);
            return;
        }
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(
                valor => {
                    resultados[index] = { status: 'fulfilled', value: valor };
                    pendentes--;
                    if (pendentes === 0) resolve(resultados);
                },
                erro => {
                    resultados[index] = { status: 'rejected', reason: erro };
                    pendentes--;
                    if (pendentes === 0) resolve(resultados);
                }
            );
        });
    });
}
```

**Diferença crucial de Promise.all():** Handler de rejeição **não chama reject()**, apenas armazena razão no array.

### Princípios Conceituais

#### Best-Effort Execution

`Promise.allSettled()` implementa **best-effort** - tenta todas, aceita resultados parciais:

```
Operações: [Op1, Op2, Op3, Op4]
Resultados: [Sucesso, Falha, Sucesso, Falha]

Promise.all()      → REJEITA (perdeu tudo)
Promise.allSettled() → RESOLVE com status de cada uma
```

Filosofia: **"Faça o máximo possível, reporte o que aconteceu"**

#### Uniform Interface

Todos os resultados têm **mesma estrutura**, facilitando processamento:

```javascript
resultados.forEach(resultado => {
    if (resultado.status === 'fulfilled') {
        processar(resultado.value);
    } else {
        logar(resultado.reason);
    }
});
```

Pattern matching simples em `status`.

#### Graceful Degradation

Permite aplicações **degradarem graciosamente** em vez de falhar completamente:

```
Carregar 10 widgets:
- 8 sucesso, 2 falha

Promise.all():        Tela em branco (falha total)
Promise.allSettled(): 8 widgets + 2 mensagens de erro
```

Usuário recebe **experiência parcial funcional**.

---

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica

```javascript
const resultados = await Promise.allSettled([
    Promise.resolve(42),
    Promise.reject('Erro!'),
    fetch('/dados').then(r => r.json())
]);

console.log(resultados);
/*
[
    { status: 'fulfilled', value: 42 },
    { status: 'rejected', reason: 'Erro!' },
    { status: 'fulfilled', value: { dados do fetch } }
]
*/
```

### Processando Resultados

Padrão comum para separar sucessos e falhas:

```javascript
const promises = [
    fetch('/usuario'),
    fetch('/pedidos'),
    fetch('/produtos')
];

const resultados = await Promise.allSettled(promises);

// Filtrar sucessos
const sucessos = resultados
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

// Filtrar falhas
const falhas = resultados
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);

console.log(`${sucessos.length} sucessos, ${falhas.length} falhas`);
```

### Comparação: Promise.all() vs Promise.allSettled()

```javascript
const promises = [
    Promise.resolve('A'),
    Promise.reject('Erro B'),
    Promise.resolve('C')
];

// Promise.all() - rejeita
Promise.all(promises)
    .then(resultados => {
        console.log('Sucesso:', resultados);  // NÃO EXECUTA
    })
    .catch(erro => {
        console.log('Erro:', erro);  // "Erro B" - perdeu A e C
    });

// Promise.allSettled() - sempre resolve
Promise.allSettled(promises)
    .then(resultados => {
        console.log('Resultados:', resultados);
        /*
        [
            { status: 'fulfilled', value: 'A' },
            { status: 'rejected', reason: 'Erro B' },
            { status: 'fulfilled', value: 'C' }
        ]
        */
    });
```

### Batch Operations com Relatório

```javascript
async function processarLote(items) {
    const promises = items.map(item => processar(item));
    const resultados = await Promise.allSettled(promises);
    
    const relatorio = {
        total: items.length,
        sucessos: resultados.filter(r => r.status === 'fulfilled').length,
        falhas: resultados.filter(r => r.status === 'rejected').length,
        erros: resultados
            .filter(r => r.status === 'rejected')
            .map((r, i) => ({ item: items[i], erro: r.reason }))
    };
    
    console.log(`Processados: ${relatorio.sucessos}/${relatorio.total}`);
    if (relatorio.falhas > 0) {
        console.error('Erros:', relatorio.erros);
    }
    
    return relatorio;
}
```

### Dashboard/Widgets Independentes

```javascript
async function carregarDashboard() {
    const widgets = [
        carregarVendas(),
        carregarEstoque(),
        carregarClientes(),
        carregarRelatorios()
    ];
    
    const resultados = await Promise.allSettled(widgets);
    
    resultados.forEach((resultado, index) => {
        const container = document.getElementById(`widget-${index}`);
        
        if (resultado.status === 'fulfilled') {
            container.innerHTML = renderizarWidget(resultado.value);
        } else {
            container.innerHTML = `
                <div class="widget-error">
                    Erro ao carregar widget: ${resultado.reason.message}
                    <button onclick="recarregar(${index})">Tentar novamente</button>
                </div>
            `;
        }
    });
}
```

### Validações Múltiplas

```javascript
async function validarFormulario(dados) {
    const validacoes = [
        validarEmail(dados.email),
        validarCPF(dados.cpf),
        validarTelefone(dados.telefone),
        validarCEP(dados.cep)
    ];
    
    const resultados = await Promise.allSettled(validacoes);
    
    const erros = resultados
        .map((resultado, index) => {
            if (resultado.status === 'rejected') {
                return { campo: ['email', 'cpf', 'telefone', 'cep'][index], erro: resultado.reason };
            }
            return null;
        })
        .filter(Boolean);
    
    if (erros.length > 0) {
        return { valido: false, erros };
    }
    
    return { valido: true };
}
```

### Retry com Rastreamento

```javascript
async function tentarMultiplasVezes(operacoes, tentativas = 3) {
    let resultados = await Promise.allSettled(operacoes);
    
    for (let i = 1; i < tentativas; i++) {
        const falhas = resultados
            .map((resultado, index) => ({ resultado, index }))
            .filter(({ resultado }) => resultado.status === 'rejected');
        
        if (falhas.length === 0) break;  // Todas sucederam
        
        console.log(`Tentativa ${i + 1}: retrying ${falhas.length} operações`);
        
        const novasPromises = falhas.map(({ index }) => operacoes[index]);
        const novosResultados = await Promise.allSettled(novasPromises);
        
        // Atualizar resultados
        falhas.forEach(({ index }, i) => {
            resultados[index] = novosResultados[i];
        });
    }
    
    return resultados;
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Promise.allSettled()

**Use quando:**

1. **Operações independentes:** Falha de uma não invalida outras
2. **Resultados parciais:** Quer processar sucessos mesmo com algumas falhas
3. **Batch processing:** Processar lista onde erros são esperados/tolerados
4. **Relatórios:** Quer estatísticas de sucesso/falha
5. **UI resiliente:** Exibir conteúdo parcial em vez de erro total

**Exemplos ideais:**

**1. Prefetch/preload de recursos:**
```javascript
// Carregar imagens - algumas podem falhar (404, etc.)
const imagens = ['/img1.jpg', '/img2.jpg', '/img3.jpg'];
const resultados = await Promise.allSettled(
    imagens.map(url => fetch(url))
);

// Exibe imagens que carregaram, mostra placeholder para as que falharam
```

**2. Notificações múltiplas:**
```javascript
// Enviar notificações por email, SMS, push
const resultados = await Promise.allSettled([
    enviarEmail(usuario),
    enviarSMS(usuario),
    enviarPush(usuario)
]);

// Logar quais canais sucederam
const canaisSucedidos = resultados
    .filter(r => r.status === 'fulfilled')
    .length;
console.log(`${canaisSucedidos}/3 notificações enviadas`);
```

**3. Healthcheck de microservices:**
```javascript
const servicos = ['auth', 'api', 'db', 'cache'];
const resultados = await Promise.allSettled(
    servicos.map(s => fetch(`/health/${s}`))
);

const status = servicos.map((servico, i) => ({
    servico,
    status: resultados[i].status === 'fulfilled' ? 'online' : 'offline'
}));
```

### Quando Usar Promise.all() em vez de allSettled()

**Use Promise.all() quando:**

1. **All-or-nothing:** TODAS devem suceder ou operação é inválida
2. **Dependências:** Operações subsequentes precisam de TODOS os resultados
3. **Fail-fast desejado:** Quer parar imediatamente na primeira falha

```javascript
// Transação - TODAS devem suceder ou reverte
await Promise.all([
    debitarConta(origem, valor),
    creditarConta(destino, valor),
    registrarTransacao(id)
]);
// Se uma falhar, Promise.all rejeita - perfeito para transação
```

---

## ⚠️ Limitações e Considerações Teóricas

### Restrições Conceituais

**1. Nunca rejeita (mesmo se TODAS falharem):**

```javascript
const resultados = await Promise.allSettled([
    Promise.reject('Erro 1'),
    Promise.reject('Erro 2'),
    Promise.reject('Erro 3')
]);

console.log(resultados);
/*
[
    { status: 'rejected', reason: 'Erro 1' },
    { status: 'rejected', reason: 'Erro 2' },
    { status: 'rejected', reason: 'Erro 3' }
]
*/

// Promise.allSettled() RESOLVEU, não rejeitou
// Você precisa verificar status manualmente
```

Implicação: `.catch()` **nunca executa** em `Promise.allSettled()`.

**2. Resultado é sempre array de objetos (não valores diretos):**

```javascript
// Promise.all()
const [a, b, c] = await Promise.all([p1, p2, p3]);
console.log(a, b, c);  // Valores diretos

// Promise.allSettled()
const resultados = await Promise.allSettled([p1, p2, p3]);
console.log(resultados[0].value);  // Precisa acessar .value
```

Menos conveniente para destructuring direto.

**3. Overhead de estrutura:**

Cada resultado é objeto com `status` + `value/reason` - overhead de memória comparado a array de valores diretos.

### Armadilhas Comuns

**Armadilha 1: Assumir que .catch() funciona**
```javascript
// ❌ .catch() NUNCA executa
Promise.allSettled([Promise.reject('Erro')])
    .then(resultados => console.log(resultados))
    .catch(erro => console.error('Nunca executa'));

// ✅ Sempre use .then()
Promise.allSettled([...])
    .then(resultados => {
        const erros = resultados.filter(r => r.status === 'rejected');
        if (erros.length > 0) {
            tratarErros(erros);
        }
    });
```

**Armadilha 2: Esquecer de verificar status**
```javascript
// ❌ Assume que todos sucederam
const resultados = await Promise.allSettled([p1, p2, p3]);
const valores = resultados.map(r => r.value);  // undefined para rejeitados!

// ✅ Verificar status
const valores = resultados
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
```

**Armadilha 3: Usar quando Promise.all() é mais apropriado**
```javascript
// ❌ Promise.allSettled() desnecessário
async function buscarDados(userId) {
    const [usuario, pedidos] = await Promise.allSettled([
        fetch(`/usuario/${userId}`),
        fetch(`/pedidos/${userId}`)
    ]);
    
    // Código complexo para verificar status
    if (usuario.status === 'rejected' || pedidos.status === 'rejected') {
        throw new Error('Falha ao carregar dados');
    }
    
    return { usuario: usuario.value, pedidos: pedidos.value };
}

// ✅ Promise.all() é mais simples (ambos são obrigatórios)
async function buscarDados(userId) {
    const [usuario, pedidos] = await Promise.all([
        fetch(`/usuario/${userId}`),
        fetch(`/pedidos/${userId}`)
    ]);
    
    return { usuario, pedidos };
}
```

---

## 🔗 Interconexões Conceituais

### Comparação com Outros Combinators

| Combinator | Resolve quando | Rejeita quando | Uso |
|------------|----------------|----------------|-----|
| **Promise.all()** | TODAS resolverem | QUALQUER rejeitar | All-or-nothing |
| **Promise.allSettled()** | TODAS finalizarem | NUNCA | Resultados parciais |
| **Promise.race()** | PRIMEIRA finalizar | PRIMEIRA rejeitar | Timeout, fastest wins |
| **Promise.any()** | PRIMEIRA resolver | TODAS rejeitarem | Primeira que suceder |

### Pattern: Combinar com Promise.all()

```javascript
// Carregar dados críticos (all) + dados opcionais (allSettled)
const [dadosCriticos, dadosOpcionais] = await Promise.all([
    // Críticos: DEVEM suceder
    Promise.all([
        fetch('/usuario'),
        fetch('/config')
    ]),
    // Opcionais: podem falhar
    Promise.allSettled([
        fetch('/sugestoes'),
        fetch('/notificacoes'),
        fetch('/anuncios')
    ])
]);
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. **Promise.all()** (todas ou nada)
2. **Promise.allSettled()** (você está aqui - todas com status)
3. **Promise.race()** (primeira a finalizar)
4. **Promise.any()** (primeira a suceder)

### Preparação para Promise.race()

Enquanto `allSettled()` espera **todas**, `race()` resolve com a **primeira**:

```javascript
// allSettled: espera todas
Promise.allSettled([fetch1(), fetch2(), fetch3()])
    .then(resultados => /* 3 resultados */);

// race: primeira vence
Promise.race([fetch1(), fetch2(), fetch3()])
    .then(primeiroResultado => /* 1 resultado */);
```

Próximo tópico: `Promise.race()` para timeouts e competições.

---

## 📚 Conclusão

**Promise.allSettled()** é a ferramenta para **coordenação tolerante a falhas**. Permite obter resultados parciais, gerar relatórios completos e construir UIs resilientes que degradam graciosamente em vez de falhar completamente.

**Conceitos essenciais:**
- **Nunca rejeita** - sempre resolve com status de cada Promise
- Aguarda **TODAS** finalizarem (não para na primeira falha)
- Resultado: array de `{ status, value/reason }`
- Ideal para **operações independentes** onde falhas são toleradas
- Permite **graceful degradation** e **observabilidade**
- Complemento a `Promise.all()` - use baseado em se falhas são aceitáveis

Dominar `Promise.allSettled()` é essencial para construir aplicações **resilientes e observáveis**.
