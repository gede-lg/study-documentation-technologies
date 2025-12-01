# Error Propagation: Propagação de Erros em Promises

## 🎯 Introdução e Definição

### Definição Conceitual

**Error Propagation** (Propagação de Erros) em Promises é o mecanismo que permite erros **fluírem automaticamente** através de cadeias de Promises até encontrarem um handler de erro (`.catch()`). Em vez de verificar erros manualmente em cada etapa, Promises implementam um sistema onde erros "saltam" handlers de sucesso e seguem um **trilho paralelo** até serem capturados.

Conceitualmente, Error Propagation trata exceções assíncronas como exceções síncronas - um erro em qualquer ponto interrompe o fluxo normal e busca o tratamento apropriado, sem código boilerplate em cada passo.

### Contexto Histórico e Motivação

No modelo de **callbacks**, tratamento de erros era verboso e propenso a falhas:

```javascript
// Callbacks: tratamento manual em CADA passo
buscarUsuario(id, (erro, usuario) => {
    if (erro) return tratarErro(erro);  // Verificação manual
    
    buscarPedidos(usuario.id, (erro, pedidos) => {
        if (erro) return tratarErro(erro);  // Duplicação
        
        calcularTotal(pedidos, (erro, total) => {
            if (erro) return tratarErro(erro);  // Repetição
            
            processarPagamento(total, (erro, resultado) => {
                if (erro) return tratarErro(erro);  // Boilerplate
                // Sucesso
            });
        });
    });
});
```

Problemas deste modelo:
- **Código duplicado:** `if (erro)` em cada callback
- **Fácil esquecer:** Uma verificação omitida causa bugs silenciosos
- **Difícil centralizar:** Lógica de erro espalhada
- **Mistura concerns:** Lógica de negócio + tratamento de erro no mesmo nível

Promises resolvem isso com **propagação automática**:

```javascript
buscarUsuario(id)
    .then(usuario => buscarPedidos(usuario.id))
    .then(pedidos => calcularTotal(pedidos))
    .then(total => processarPagamento(total))
    .catch(tratarErro);  // UM ÚNICO ponto de tratamento
```

Se **qualquer** operação falhar, o erro automaticamente pula todos os `.then()` e vai direto para `.catch()`.

### Problema Fundamental que Resolve

Error Propagation resolve problemas críticos:

**1. Eliminação de boilerplate:** Não precisa verificar erro em cada passo
**2. Centralização de tratamento:** Um `.catch()` captura erros de toda cadeia
**3. Tratamento por nível:** `.catch()` em diferentes pontos para granularidade
**4. Garantia de captura:** Erros não ficam silenciosos (UnhandledPromiseRejection)
**5. Composição segura:** Cadeias compostas mantêm propagação

### Importância no Ecossistema

Error Propagation é **crucial** porque:

- **Robustez:** Garante que erros sejam tratados, não ignorados
- **Debugging:** Erros não capturados geram warnings (UnhandledPromiseRejection)
- **Padrão uniforme:** Todas as APIs modernas seguem essa semântica
- **Base para async/await:** Try/catch em async funciona por causa de propagação
- **Composição confiável:** Cadeias complexas são seguras por design

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Erros saltam `.then()`:** Handler de sucesso é pulado quando há rejeição
2. **`.catch()` captura rejeições:** Funciona como `try/catch` assíncrono
3. **Propagação continua:** Erro não tratado continua propagando
4. **Recovery:** `.catch()` pode retornar valor e retomar sucesso
5. **Re-throw:** `.catch()` pode lançar novo erro para propagar adiante

### Pilares Fundamentais

- **Dois trilhos paralelos:** Sucesso (.then) e erro (.catch) como caminhos separados
- **Fail-fast:** Primeira rejeição interrompe fluxo de sucesso
- **Tratamento em camadas:** `.catch()` em diferentes níveis para granularidade
- **Transparência:** Erro preserva stack trace e informações originais
- **Opcional recovery:** `.catch()` pode recuperar ou re-propagar

### Visão Geral das Nuances

- **`.catch()` é syntactic sugar:** Equivalente a `.then(null, errorHandler)`
- **Posição importa:** `.catch()` só pega erros anteriores, não posteriores
- **Múltiplos `.catch()`:** Cada um trata sua seção da cadeia
- **Finally:** `.finally()` executa sempre, erro ou sucesso
- **Error types:** Diferentes tipos de erro (rede, validação, etc.)

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Mecânica de Propagação

Quando uma Promise **rejeita** ou um handler **lança exceção**:

1. **Promise atual muda para estado "rejected"**
2. **Handlers de sucesso (`.then()`) são pulados**
3. **Motor busca primeiro handler de erro** (`.catch()` ou segundo argumento de `.then()`)
4. **Se encontrado:** Erro é passado para esse handler
5. **Se não encontrado:** Erro continua propagando para próxima Promise
6. **Se nenhum handler existe:** `UnhandledPromiseRejectionWarning`

#### Fluxo Visual

```
Promise A (resolve 'ok')
    ↓
.then(val => throw new Error('Falha'))  → REJEITA
    ↓
Promise B (rejected com Error)
    ↓
.then(val => ...)  → PULADO (handler de sucesso)
    ↓
Promise C (ainda rejected, erro propagado)
    ↓
.then(val => ...)  → PULADO
    ↓
Promise D (ainda rejected)
    ↓
.catch(err => ...)  → CAPTURADO (handler de erro)
    ↓
Promise E (estado depende do que .catch faz)
```

#### `.catch()` como Syntactic Sugar

Internamente, `.catch(fn)` é equivalente a `.then(null, fn)`:

```javascript
// Esses são idênticos
promise.catch(erro => console.error(erro));
promise.then(null, erro => console.error(erro));
```

Mas `.catch()` é preferível por **clareza de intenção**.

### Princípios Conceituais

#### Railway Oriented Programming

Error Propagation implementa **Railway Pattern**:

```
Trilho de Sucesso:    [then] → [then] → [then] → [then]
                         ↓        ↓        ↓        ↓
                       (ok)     (ok)     (ok)     (ok)

Trilho de Erro:                  ↓
                            [ERRO OCORRE]
                                 ↓
                            [catch captura]
```

Imagine dois trilhos paralelos:
- **Trilho superior (sucesso):** Operações fluem normalmente
- **Trilho inferior (erro):** Quando erro ocorre, "trem" muda de trilho

`.catch()` é uma **ponte** que permite retornar ao trilho de sucesso.

#### Fail-Fast Behavior

Promises implementam **fail-fast** - primeira falha interrompe sequência:

```javascript
operacao1()           // Sucesso
    .then(() => operacao2())  // Sucesso  
    .then(() => operacao3())  // FALHA ← aqui
    .then(() => operacao4())  // NÃO EXECUTA
    .then(() => operacao5())  // NÃO EXECUTA
    .catch(tratarErro);       // CAPTURA erro de operacao3
```

Isso evita executar operações dependentes de dados corrompidos.

---

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica

```javascript
Promise.reject('Erro!')
    .then(() => console.log('Não executa'))
    .then(() => console.log('Também não'))
    .catch(erro => console.error('Capturado:', erro));
// Output: "Capturado: Erro!"
```

### Propagação através de Múltiplos `.then()`

```javascript
fetch('/usuario/123')
    .then(resposta => resposta.json())
    .then(usuario => {
        if (!usuario.ativo) {
            throw new Error('Usuário inativo');  // LANÇA ERRO
        }
        return usuario;
    })
    .then(usuario => buscarPedidos(usuario.id))  // PULADO
    .then(pedidos => calcularTotal(pedidos))      // PULADO
    .then(total => processarPagamento(total))     // PULADO
    .catch(erro => {
        console.error('Erro no fluxo:', erro.message);
        // "Erro no fluxo: Usuário inativo"
    });
```

**Conceito-chave:** Uma vez que erro ocorre, **todos** os `.then()` subsequentes são pulados até encontrar `.catch()`.

### `.catch()` em Diferentes Níveis

Você pode ter **múltiplos** `.catch()` para tratamento granular:

```javascript
fetch('/dados')
    .then(r => r.json())
    .catch(erro => {
        // Captura APENAS erros de fetch ou parsing JSON
        console.error('Erro de rede/parsing:', erro);
        return { dados: [] };  // Valor padrão, RETOMA sucesso
    })
    .then(dados => processar(dados))  // Executa normalmente
    .then(resultado => salvar(resultado))
    .catch(erro => {
        // Captura APENAS erros de processar() ou salvar()
        console.error('Erro de processamento:', erro);
    });
```

**Padrão:** `.catch()` captura erros **anteriores** mas não **posteriores**.

### Recovery: Retomando Fluxo de Sucesso

`.catch()` pode **retornar valor** para retomar o fluxo normal:

```javascript
buscarUsuario(id)
    .catch(erro => {
        console.warn('Falha ao buscar usuário, usando cache');
        return buscarDoCache(id);  // Retorna valor alternativo
    })
    .then(usuario => {
        // Recebe usuário (da API ou do cache)
        console.log('Usuário:', usuario.nome);
    });
```

Isso implementa **fallback** - se operação primária falha, tenta alternativa.

### Re-throw: Propagando Erro Adiante

`.catch()` pode **lançar novo erro** para continuar propagação:

```javascript
fetch('/dados')
    .then(r => r.json())
    .catch(erro => {
        console.error('Erro original:', erro);
        
        // Enriquecer erro com contexto
        throw new Error(`Falha ao carregar dados: ${erro.message}`);
    })
    .then(dados => processar(dados))  // PULADO (erro foi re-lançado)
    .catch(erro => {
        // Captura erro enriquecido
        console.error('Tratamento final:', erro.message);
    });
```

Útil para **logging intermediário** ou **transformação de erros**.

### `.finally()` - Sempre Executa

`.finally()` executa **independente** de sucesso ou erro:

```javascript
let loading = true;

fetch('/dados')
    .then(r => r.json())
    .then(dados => processar(dados))
    .catch(erro => console.error(erro))
    .finally(() => {
        loading = false;  // SEMPRE executa
        console.log('Requisição finalizada');
    });
```

**Use cases:**
- Esconder loading spinner
- Fechar conexões
- Limpar recursos temporários
- Logging de conclusão

**Importante:** `.finally()` **não recebe argumentos** - não sabe se houve sucesso ou erro.

### Padrão de Tratamento em Camadas

Arquitetura robusta usa tratamento em **múltiplos níveis**:

```javascript
// Camada de serviço: trata erros específicos
function buscarUsuario(id) {
    return fetch(`/usuario/${id}`)
        .then(r => {
            if (!r.ok) throw new Error('Usuário não encontrado');
            return r.json();
        })
        .catch(erro => {
            console.error('[Service] Erro ao buscar usuário:', erro);
            throw erro;  // Re-propaga para camada superior
        });
}

// Camada de controle: coordena operações
function carregarDados(id) {
    return buscarUsuario(id)
        .then(usuario => buscarPedidos(usuario.id))
        .catch(erro => {
            console.error('[Controller] Erro no fluxo:', erro);
            return [];  // Fallback
        });
}

// Camada de UI: trata para usuário final
carregarDados(123)
    .then(dados => renderizar(dados))
    .catch(erro => {
        console.error('[UI] Erro crítico:', erro);
        mostrarMensagemErro('Não foi possível carregar dados');
    });
```

Cada camada tem **responsabilidade específica**.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Propagação

**Use propagação de erros quando:**

1. **Fluxo linear:** Cadeia de operações onde erro em qualquer passo invalida sequência
2. **Tratamento centralizado:** Quer tratar todos erros em um lugar
3. **Fail-fast desejado:** Operações dependentes não devem executar se anterior falha
4. **Logging/telemetria:** Quer capturar e registrar erros

**Exemplo ideal:**

```javascript
// Pipeline de importação de dados
lerArquivo('dados.csv')
    .then(conteudo => validarFormato(conteudo))
    .then(dados => transformarDados(dados))
    .then(dadosLimpos => salvarNoBanco(dadosLimpos))
    .then(() => enviarNotificacao('Importação concluída'))
    .catch(erro => {
        // Qualquer falha no pipeline
        registrarErro(erro);
        enviarNotificacao('Importação falhou');
    });
```

### Padrões de Uso

**1. Tratamento Global:**
```javascript
minhaOperacao()
    .then(resultado => usarResultado(resultado))
    .catch(erro => tratamentoGlobal(erro));
```

**2. Tratamento + Re-throw:**
```javascript
minhaOperacao()
    .catch(erro => {
        log(erro);
        throw erro;  // Propaga adiante
    })
    .then(...)
    .catch(tratamentoFinal);
```

**3. Fallback/Recovery:**
```javascript
tentarOperacao()
    .catch(() => operacaoAlternativa())
    .catch(() => valorPadrao());
```

---

## ⚠️ Limitações e Considerações Teóricas

### Restrições Conceituais

**1. `.catch()` só pega erros anteriores:**
```javascript
Promise.resolve()
    .then(() => operacao1())
    .catch(erro => console.error('Pega erro de operacao1'))
    .then(() => operacao2())  // Erro aqui NÃO é pego pelo .catch anterior
```

Solução: `.catch()` adicional após operacao2.

**2. Erro não capturado gera warning:**
```javascript
Promise.reject('Erro não tratado');
// UnhandledPromiseRejectionWarning na Node.js
```

**Sempre** adicione `.catch()` ou use `try/catch` com async/await.

**3. `.finally()` não pode alterar resultado:**
```javascript
Promise.resolve('valor')
    .finally(() => {
        return 'outro valor';  // IGNORADO
    })
    .then(val => console.log(val));  // 'valor' (original)
```

`.finally()` é apenas para **side effects**.

### Armadilhas Comuns

**Armadilha 1: Esquecer `.catch()`**
```javascript
// ❌ Sem .catch() - erro pode ficar silencioso
fetch('/dados').then(r => r.json());

// ✅ Com .catch()
fetch('/dados')
    .then(r => r.json())
    .catch(erro => console.error('Erro:', erro));
```

**Armadilha 2: `.catch()` que retorna valor acidentalmente**
```javascript
// ❌ Retoma fluxo sem querer
operacao()
    .catch(erro => {
        console.error(erro);
        return null;  // Próximo .then() recebe null
    })
    .then(valor => {
        processar(valor);  // Processa null! Bug sutil
    });

// ✅ Re-throw se não quer recovery
operacao()
    .catch(erro => {
        console.error(erro);
        throw erro;  // Continua propagação
    });
```

**Armadilha 3: Não diferenciar tipos de erro**
```javascript
// ❌ Trata todos erros igual
operacao()
    .catch(erro => mostrarErro('Algo deu errado'));

// ✅ Diferenciar tipos
operacao()
    .catch(erro => {
        if (erro instanceof NetworkError) {
            mostrarErro('Problema de conexão');
        } else if (erro instanceof ValidationError) {
            mostrarErro('Dados inválidos');
        } else {
            mostrarErro('Erro desconhecido');
        }
    });
```

---

## 🔗 Interconexões Conceituais

### Relação com Outros Conceitos

**Try/Catch Síncrono vs `.catch()` Assíncrono:**
```javascript
// Síncrono
try {
    const resultado = operacaoSincrona();
} catch (erro) {
    console.error(erro);
}

// Assíncrono (equivalente)
operacaoAssincrona()
    .then(resultado => ...)
    .catch(erro => console.error(erro));
```

**Async/Await e Try/Catch:**
```javascript
// Com Promises
operacao()
    .then(resultado => ...)
    .catch(erro => console.error(erro));

// Com async/await (mesmo comportamento)
try {
    const resultado = await operacao();
} catch (erro) {
    console.error(erro);
}
```

**Event Loop e Microtasks:**
- `.catch()` handlers vão para **microtask queue**
- Executam antes de próxima macrotask
- Crítico para timing de tratamento

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. **Promise Basics** (criação, estados)
2. **Promise Chaining** (encadeamento)
3. **Error Propagation** (você está aqui)
4. **Promise Combinators** (all, race, allSettled, any)
5. **Async/Await** (syntax moderna)
6. **Advanced Error Handling** (custom errors, retry patterns)

### Preparação para Conceitos Avançados

Error Propagation é base para:

**Custom Error Classes:**
```javascript
class APIError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

fetch('/dados')
    .then(r => {
        if (!r.ok) throw new APIError(r.status, 'Falha na API');
        return r.json();
    })
    .catch(erro => {
        if (erro instanceof APIError) {
            // Tratamento específico
        }
    });
```

**Retry Patterns:**
```javascript
function retry(fn, tentativas = 3) {
    return fn().catch(erro => {
        if (tentativas > 1) {
            return retry(fn, tentativas - 1);
        }
        throw erro;
    });
}
```

---

## 📚 Conclusão

Error Propagation transforma tratamento de erros assíncronos de código verboso e propenso a bugs em sistema elegante e robusto. É a **espinha dorsal** da confiabilidade em código assíncrono moderno.

**Conceitos essenciais:**
- Erros saltam `.then()` automaticamente
- `.catch()` captura erros de toda cadeia anterior
- Pode recovery (retornar valor) ou re-throw (continuar propagação)
- `.finally()` sempre executa, independente de sucesso/erro
- Tratamento em camadas permite granularidade e responsabilidade clara

Dominar propagação de erros é fundamental para escrever código assíncrono **confiável e manutenível**.
