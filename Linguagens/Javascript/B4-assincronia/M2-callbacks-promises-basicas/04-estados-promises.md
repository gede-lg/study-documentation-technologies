# Estados de Promises: pending, fulfilled, rejected - Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

Os **estados de uma Promise** representam as fases do ciclo de vida de uma operação assíncrona. Uma Promise em JavaScript pode estar em exatamente **um de três estados mutuamente exclusivos**:

1. **Pending (Pendente):** Estado inicial. A operação assíncrona ainda está em andamento.
2. **Fulfilled (Cumprida):** A operação foi concluída com sucesso e há um valor resultante disponível.
3. **Rejected (Rejeitada):** A operação falhou e há uma razão (erro) explicando o motivo da falha.

**Conceito fundamental:** Uma Promise é uma **máquina de estados finita** (FSM - Finite State Machine). Ela começa em `pending` e **transiciona exatamente uma vez** para `fulfilled` ou `rejected`. Após a transição, o estado se torna **imutável** - a Promise está "settled" (liquidada/estabelecida) e nunca mais mudará de estado.

```
        resolve(valor)
PENDING ───────────────> FULFILLED (com valor)
   │
   │  reject(erro)
   └──────────────────> REJECTED (com razão)
```

**Imutabilidade:** Esta é uma garantia crucial que diferencia Promises de callbacks. Uma vez que uma Promise resolve ou rejeita, seu estado e valor associado são permanentes e imutáveis.

### Contexto Histórico e Motivação

**Problema com Callbacks:** Antes das Promises, não havia representação explícita do estado de uma operação assíncrona:

```javascript
// Callback não tem "estado" visível
lerArquivo('arquivo.txt', (erro, dados) => {
  // Como saber se operação ainda está pendente?
  // Como garantir callback não será chamado múltiplas vezes?
  // Como inspecionar o estado atual?
});
```

**Motivação para Estados Explícitos:**

1. **Observabilidade:** Poder inspecionar se operação está pendente, completa ou falhou
2. **Garantias:** Assegurar que operação só completa uma vez (resolve OU reject, nunca ambos)
3. **Composição:** Permitir combinar múltiplas operações assíncronas baseado em seus estados
4. **Debugging:** Facilitar identificação de problemas (Promise travada em pending, etc.)

A especificação **Promises/A+** (2012) formalizou esses três estados e as regras de transição, trazendo clareza e previsibilidade para assincronia em JavaScript.

### Problema Fundamental que Resolve

**Problema 1: Falta de Garantias**

Callbacks não garantem:
- Callback será invocado exatamente uma vez?
- Callback já foi invocado ou ainda está esperando?

```javascript
// Callback pode ser invocado múltiplas vezes (bug)
function operacaoBugada(callback) {
  callback('resultado1');
  callback('resultado2'); // Invocado novamente!
}
```

**Solução com Estados:** Promise só pode transicionar uma vez:

```javascript
const promessa = new Promise((resolve) => {
  resolve('resultado1');
  resolve('resultado2'); // Ignorado! Estado já é fulfilled
});

promessa.then(valor => console.log(valor)); // 'resultado1' (apenas primeiro)
```

**Problema 2: Estado Implícito**

Com callbacks, não há como saber se operação está pendente ou completa sem verificações manuais:

```javascript
let operacaoCompleta = false; // Flag manual

operacao((erro, resultado) => {
  operacaoCompleta = true; // Atualizar manualmente
});

// Verificar estado manualmente
if (operacaoCompleta) { /* ... */ }
```

**Solução:** Estados são intrínsecos à Promise e podem ser inspecionados.

**Problema 3: Composição Baseada em Estado**

Combinar múltiplas operações assíncronas exige lógica complexa para rastrear quais completaram:

```javascript
// Callbacks: coordenação manual
let completados = 0;
const total = 3;

op1(callback1);
op2(callback2);
op3(callback3);

function callback1() { if (++completados === total) finalizar(); }
function callback2() { if (++completados === total) finalizar(); }
function callback3() { if (++completados === total) finalizar(); }
```

**Solução:** Promise.all() coordena baseado nos estados das Promises:

```javascript
Promise.all([op1(), op2(), op3()])
  .then(resultados => finalizar(resultados));
```

### Importância no Ecossistema

Os estados de Promises são fundamentais porque:

1. **Previsibilidade:** Comportamento determinístico (estado muda exatamente uma vez)
2. **Debugging:** Ferramentas mostram estado atual (DevTools, logs)
3. **Composição:** Métodos como `Promise.all()`, `Promise.race()` decidem comportamento baseado em estados
4. **Error Handling:** Estado `rejected` propaga automaticamente até `.catch()`
5. **Async/Await:** `await` pausa execução até Promise sair de `pending`

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Máquina de Estados Finita:** Três estados, transições definidas
2. **Transição Única:** Estado muda no máximo uma vez (pending → settled)
3. **Imutabilidade Pós-Transição:** Estado e valor ficam permanentes
4. **Settled:** Termo para Promise que não está mais pending (fulfilled ou rejected)
5. **Propagação Baseada em Estado:** Chaining comporta-se diferentemente baseado no estado

### Pilares Fundamentais

- **Pending:** Inicial, transitório, pode mudar
- **Fulfilled:** Final, imutável, tem valor associado
- **Rejected:** Final, imutável, tem razão (erro) associada
- **Settled:** Termo coletivo para fulfilled ou rejected
- **Value/Reason:** Dados associados ao estado final

### Visão Geral das Nuances

- **Settled ≠ Fulfilled:** "Settled" inclui fulfilled e rejected
- **Resolving vs Fulfilling:** Resolve pode aceitar outra Promise (adota estado dela)
- **Inspecionabilidade:** Estados são internos, não há API para acessá-los diretamente
- **Timing:** Transição de estado dispara handlers (then/catch) assincronamente
- **Unhandled Rejection:** Rejected sem `.catch()` gera warnings

---

## 🧠 Fundamentos Teóricos

### Estado Pending (Pendente)

#### Definição Profunda

**Pending** é o **estado inicial e transitório** de toda Promise. Representa que a operação assíncrona foi iniciada mas ainda não completou. É o único estado que pode mudar - uma Promise pending pode transicionar para fulfilled ou rejected.

```javascript
const promessa = new Promise((resolve, reject) => {
  // Neste momento, Promise está PENDING
  console.log('Operação iniciada');

  setTimeout(() => {
    resolve('Completo'); // Transição: pending → fulfilled
  }, 1000);
});

// Durante o setTimeout, Promise está pending
console.log(promessa); // Promise { <pending> }
```

**Características:**
- **Temporário:** Estado "de espera", não é estado final
- **Sem valor:** Não há valor ou razão associados ainda
- **Mutável:** Pode mudar para fulfilled ou rejected
- **Handlers enfileirados:** `.then()` e `.catch()` ficam na fila esperando transição

#### Como Promise Fica Pending

```javascript
// 1. Durante operação assíncrona
const promessa1 = new Promise((resolve) => {
  // Ainda não chamou resolve - PENDING
  setTimeout(() => resolve('ok'), 5000);
});

// 2. Esperando I/O
const promessa2 = fetch('/api/dados'); // PENDING até resposta chegar

// 3. Aguardando outra Promise
const promessa3 = new Promise((resolve) => {
  resolve(promessa2); // PENDING até promessa2 resolver
});

// 4. Operação demorada
const promessa4 = new Promise((resolve) => {
  // Processamento intensivo
  let resultado = 0;
  for (let i = 0; i < 1000000000; i++) {
    resultado += i;
  }
  resolve(resultado); // PENDING durante loop
});
```

#### Inspecionando Estado Pending

```javascript
// Estados não são diretamente acessíveis, mas podemos inferir
const promessa = new Promise((resolve) => {
  setTimeout(() => resolve('pronto'), 1000);
});

// Técnica: usar Promise.race com timeout
Promise.race([
  promessa,
  new Promise((resolve) => setTimeout(() => resolve('timeout'), 100))
]).then(resultado => {
  if (resultado === 'timeout') {
    console.log('Promessa ainda está pending');
  } else {
    console.log('Promessa resolveu:', resultado);
  }
});

// Ou verificar com flag manual
let settled = false;

promessa.then(() => { settled = true; });

setTimeout(() => {
  if (!settled) {
    console.log('Ainda pending após 500ms');
  }
}, 500);
```

### Estado Fulfilled (Cumprida)

#### Definição Profunda

**Fulfilled** é o **estado final de sucesso**. Representa que a operação assíncrona foi concluída com êxito e há um **valor resultante** disponível. Uma vez fulfilled, a Promise permanece nesse estado para sempre, e seu valor é imutável.

```javascript
const promessa = new Promise((resolve) => {
  resolve(42); // Transição imediata: pending → fulfilled
});

console.log(promessa); // Promise { 42 }

// Tentar mudar estado não tem efeito
const promessa2 = new Promise((resolve, reject) => {
  resolve('sucesso');
  reject(new Error('falha')); // IGNORADO! Já está fulfilled
  resolve('outro valor');      // IGNORADO! Já está fulfilled
});

promessa2.then(valor => console.log(valor)); // 'sucesso' (primeiro resolve)
```

**Características:**
- **Estado final:** Não pode mais mudar
- **Tem valor:** Valor passado para `resolve(valor)`
- **Imutável:** Valor e estado permanecem fixos
- **Handlers executam:** Todos `.then()` registrados executam com o valor

#### Valor Associado

O valor de uma Promise fulfilled é o argumento passado para `resolve()`:

```javascript
// Diferentes tipos de valores
Promise.resolve(42).then(v => console.log(v)); // 42 (número)

Promise.resolve('texto').then(v => console.log(v)); // 'texto' (string)

Promise.resolve({ nome: 'João' }).then(v => console.log(v)); // objeto

Promise.resolve([1, 2, 3]).then(v => console.log(v)); // array

Promise.resolve(undefined).then(v => console.log(v)); // undefined

// Valor é imutável mesmo para referências
const objeto = { valor: 1 };
const promessa = Promise.resolve(objeto);

promessa.then(obj => {
  obj.valor = 999; // Mutação do objeto
});

promessa.then(obj => {
  console.log(obj.valor); // 999 (objeto é referência, mas Promise não impede mutação do conteúdo)
});

// Mas Promise em si não pode mudar para apontar para outro objeto
```

#### Criando Promises Fulfilled

```javascript
// Método 1: Promise.resolve()
const p1 = Promise.resolve('valor');

// Método 2: new Promise com resolve imediato
const p2 = new Promise((resolve) => {
  resolve('valor');
});

// Método 3: Resolve após operação
const p3 = new Promise((resolve) => {
  setTimeout(() => {
    const resultado = 10 + 20;
    resolve(resultado);
  }, 1000);
});

// Método 4: Retornar valor em .then() cria Promise fulfilled
const p4 = Promise.resolve(5)
  .then(n => n * 2); // Retorna Promise fulfilled com valor 10
```

#### Handlers em Promise Fulfilled

```javascript
const promessa = Promise.resolve('Dados');

// .then() executará com o valor
promessa.then(valor => {
  console.log('Recebido:', valor); // 'Recebido: Dados'
});

// Múltiplos .then() todos recebem o mesmo valor
promessa.then(v => console.log('Handler 1:', v));
promessa.then(v => console.log('Handler 2:', v));
promessa.then(v => console.log('Handler 3:', v));

// Todos executam assincronamente, mesmo que Promise já esteja fulfilled
console.log('Síncrono');

/* Output:
Síncrono
Recebido: Dados
Handler 1: Dados
Handler 2: Dados
Handler 3: Dados
*/
```

### Estado Rejected (Rejeitada)

#### Definição Profunda

**Rejected** é o **estado final de falha**. Representa que a operação assíncrona encontrou um erro e não pode ser concluída. Há uma **razão de rejeição** (geralmente um objeto `Error`) explicando o que deu errado. Como fulfilled, rejected é imutável.

```javascript
const promessa = new Promise((resolve, reject) => {
  reject(new Error('Algo deu errado')); // Transição: pending → rejected
});

console.log(promessa); // Promise { <rejected> Error: Algo deu errado }

// Handlers .catch() executam com a razão
promessa.catch(erro => {
  console.error('Erro capturado:', erro.message); // 'Algo deu errado'
});
```

**Características:**
- **Estado final:** Não pode mais mudar
- **Tem razão:** Erro/razão passado para `reject(razao)`
- **Imutável:** Razão e estado permanecem fixos
- **Handlers executam:** Todos `.catch()` ou segundo argumento `.then()` executam
- **Propagação:** Erros propagam pela cadeia até encontrar `.catch()`

#### Razão de Rejeição

A razão de rejeição pode ser qualquer valor, mas convencionalmente é um objeto `Error`:

```javascript
// Recomendado: usar Error
Promise.reject(new Error('Mensagem de erro'))
  .catch(erro => {
    console.log(erro.message); // 'Mensagem de erro'
    console.log(erro.stack);   // Stack trace
  });

// Possível mas não recomendado: string
Promise.reject('Erro como string')
  .catch(erro => console.log(erro)); // 'Erro como string'

// Possível: objeto customizado
Promise.reject({ codigo: 404, mensagem: 'Não encontrado' })
  .catch(erro => console.log(erro.mensagem)); // 'Não encontrado'

// Usar Error é melhor prática por causa de stack traces
```

#### Criando Promises Rejected

```javascript
// Método 1: Promise.reject()
const p1 = Promise.reject(new Error('Falhou'));

// Método 2: new Promise com reject
const p2 = new Promise((resolve, reject) => {
  reject(new Error('Falhou'));
});

// Método 3: Throw dentro de executor
const p3 = new Promise((resolve) => {
  throw new Error('Falhou'); // Automaticamente rejeita Promise
});

// Método 4: Throw dentro de .then()
const p4 = Promise.resolve(5)
  .then(n => {
    throw new Error('Erro no then'); // Rejeita Promise retornada por .then()
  });

// Método 5: Retornar Promise rejected
const p5 = Promise.resolve(5)
  .then(n => Promise.reject(new Error('Falhou')));
```

#### Unhandled Rejection

Se uma Promise é rejeitada mas não há `.catch()` para tratar o erro, JavaScript emite warning:

```javascript
// ⚠️ Unhandled rejection
Promise.reject(new Error('Não tratado'));

// Node.js / Browser console mostrará:
// UnhandledPromiseRejectionWarning: Error: Não tratado

// ✅ Tratado corretamente
Promise.reject(new Error('Tratado'))
  .catch(erro => console.error('Erro:', erro.message));
```

**Implicações:**
- Em Node.js, unhandled rejections podem (desde v15) causar crash do processo
- Em navegadores, aparece no console mas não crasha página
- **Boa prática:** Sempre ter `.catch()` no final de cadeias de Promises

### Transições de Estado

#### Pending → Fulfilled

```javascript
const promessa = new Promise((resolve) => {
  // Estado: PENDING

  setTimeout(() => {
    resolve('Sucesso!'); // Transição: PENDING → FULFILLED
  }, 1000);
});

// Após 1 segundo, Promise está FULFILLED com valor 'Sucesso!'
```

**Quando acontece:**
- `resolve(valor)` é chamado
- `return valor` dentro de `.then()` (cria nova Promise fulfilled)

#### Pending → Rejected

```javascript
const promessa = new Promise((resolve, reject) => {
  // Estado: PENDING

  setTimeout(() => {
    reject(new Error('Falhou!')); // Transição: PENDING → REJECTED
  }, 1000);
});

// Após 1 segundo, Promise está REJECTED com razão Error('Falhou!')
```

**Quando acontece:**
- `reject(razao)` é chamado
- `throw erro` dentro de executor ou `.then()`

#### Tentativa de Transição Múltipla (Ignorada)

```javascript
const promessa = new Promise((resolve, reject) => {
  resolve('Primeira resolução');

  // Todas as tentativas subsequentes são IGNORADAS
  resolve('Segunda resolução');  // Ignorado
  reject(new Error('Rejeição')); // Ignorado
  resolve('Terceira resolução'); // Ignorado
});

promessa.then(valor => {
  console.log(valor); // 'Primeira resolução' (apenas primeiro)
});
```

**Garantia crucial:** Estado muda exatamente **uma vez**. Primeira chamada a `resolve()` ou `reject()` "vence".

### Termo "Settled" (Liquidada)

**Definição:** Uma Promise está **settled** quando não está mais pending - ou seja, está fulfilled ou rejected.

```javascript
// Pending (NOT settled)
const p1 = new Promise((resolve) => {
  setTimeout(() => resolve('ok'), 1000);
});

// Fulfilled (SETTLED)
const p2 = Promise.resolve('ok');

// Rejected (SETTLED)
const p3 = Promise.reject(new Error('erro'));

// Termo útil para falar de "qualquer estado final"
function esperarSettled(promessa) {
  return promessa.then(
    valor => ({ status: 'fulfilled', value: valor }),
    razao => ({ status: 'rejected', reason: razao })
  );
}
```

---

## 🔍 Análise Conceitual Profunda

### Estados e Chaining

O estado de uma Promise afeta como chaining se comporta:

#### Fulfilled → Fulfilled

```javascript
Promise.resolve(10)
  .then(n => n * 2) // Fulfilled com 10 → retorna 20
  .then(n => n + 5) // Fulfilled com 20 → retorna 25
  .then(n => console.log(n)); // 25
```

#### Fulfilled → Rejected

```javascript
Promise.resolve(10)
  .then(n => {
    throw new Error('Erro!'); // Fulfilled → Rejected
  })
  .then(n => console.log('Nunca executa')) // Pulado
  .catch(erro => console.error(erro.message)); // 'Erro!'
```

#### Rejected → Fulfilled (Recovery)

```javascript
Promise.reject(new Error('Erro inicial'))
  .catch(erro => {
    console.error('Tratando:', erro.message);
    return 'Valor recuperado'; // Rejected → Fulfilled
  })
  .then(valor => console.log(valor)); // 'Valor recuperado'
```

#### Rejected → Rejected (Propagação)

```javascript
Promise.reject(new Error('Erro 1'))
  .catch(erro => {
    console.error('Catch 1:', erro.message);
    throw new Error('Erro 2'); // Rejected → Rejected
  })
  .catch(erro => console.error('Catch 2:', erro.message)); // 'Erro 2'
```

### Exemplo Completo: Rastreando Estados

```javascript
function criarPromessaComLog(nome, deveRejeitar = false) {
  console.log(`[${nome}] Estado: PENDING`);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (deveRejeitar) {
        console.log(`[${nome}] Transição: PENDING → REJECTED`);
        reject(new Error(`${nome} falhou`));
      } else {
        console.log(`[${nome}] Transição: PENDING → FULFILLED`);
        resolve(`${nome} sucesso`);
      }
    }, 1000);
  });
}

// Teste: Sucesso
criarPromessaComLog('Operação 1')
  .then(valor => {
    console.log(`[Operação 1] Estado final: FULFILLED, Valor: ${valor}`);
  });

// Teste: Falha
criarPromessaComLog('Operação 2', true)
  .catch(erro => {
    console.log(`[Operação 2] Estado final: REJECTED, Razão: ${erro.message}`);
  });

/* Output:
[Operação 1] Estado: PENDING
[Operação 2] Estado: PENDING
[após 1 segundo]
[Operação 1] Transição: PENDING → FULFILLED
[Operação 1] Estado final: FULFILLED, Valor: Operação 1 sucesso
[Operação 2] Transição: PENDING → REJECTED
[Operação 2] Estado final: REJECTED, Razão: Operação 2 falhou
*/
```

---

## 🎯 Aplicabilidade e Contextos

### Decidindo Fulfilled vs Rejected

**Quando resolver (fulfilled):**
- Operação completou com sucesso
- Dados válidos foram obtidos
- Processamento terminou sem erros

**Quando rejeitar (rejected):**
- Erro irrecuperável (rede, parsing, validação)
- Recurso não encontrado (404, arquivo inexistente)
- Timeout ou operação cancelada
- Exceção lançada durante processamento

```javascript
function buscarUsuario(id) {
  return new Promise((resolve, reject) => {
    if (!id) {
      // Validação falhou → REJECT
      return reject(new Error('ID é obrigatório'));
    }

    fazerRequisicao(`/api/usuarios/${id}`, (erro, dados) => {
      if (erro) {
        // Erro de rede → REJECT
        return reject(erro);
      }

      if (!dados) {
        // Não encontrado → REJECT
        return reject(new Error('Usuário não encontrado'));
      }

      // Sucesso → RESOLVE
      resolve(dados);
    });
  });
}
```

---

## ⚠️ Limitações e Considerações

### Considerações sobre Estados

**1. Estados não são acessíveis diretamente**

Não há API para verificar estado atual:

```javascript
const promessa = Promise.resolve(42);

// ❌ Não existe
// promessa.state // undefined
// promessa.getState() // não existe

// ✅ Apenas podemos reagir a mudanças de estado
promessa.then(valor => {
  // Só executa se fulfilled
});
```

**2. Unhandled Rejections podem crashar aplicação**

Em Node.js moderno (v15+), unhandled rejections podem terminar processo:

```javascript
// ⚠️ Pode crashar processo Node.js
Promise.reject(new Error('Fatal'));

// ✅ Sempre tratar
Promise.reject(new Error('Tratado')).catch(erro => {});

// Ou handler global
process.on('unhandledRejection', (razao, promessa) => {
  console.error('Unhandled rejection:', razao);
});
```

---

## 🔗 Interconexões Conceituais

**Conceitos Relacionados:**
- **Promises:** Estados são intrínsecos a Promises
- **Máquinas de Estado:** Pattern de design onde objeto tem estados definidos
- **Imutabilidade:** Estados fulfilled/rejected são imutáveis
- **Then/Catch:** Métodos reagem a transições de estado
- **Async/Await:** `await` pausa até Promise sair de pending

**Progressão:**
1. Callbacks (sem estados explícitos)
2. Promises (com estados)
3. Estados pending/fulfilled/rejected (este tópico)
4. Métodos then/catch/finally (reagindo a estados)
5. Promise composition (Promise.all baseado em estados)

---

## 🚀 Evolução e Próximos Conceitos

**Próximos Tópicos:**
- **Criando Promises:** Padrões de criação e resolução
- **then(), catch(), finally():** Métodos para reagir a estados
- **Promise Avançadas:** Composição baseada em estados (all, race, etc.)

Os estados de Promises são a fundação do comportamento previsível e componível de operações assíncronas em JavaScript moderno. Entender profundamente esses estados é essencial para dominar Promises e async/await.
