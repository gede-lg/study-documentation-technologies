# Error Handling com Try/Catch em Async Functions

## 🎯 Introdução e Definição

### Definição Conceitual

**Error handling** em async functions permite **capturar e tratar exceções** de operações assíncronas usando a sintaxe familiar `try/catch` - a mesma usada para código síncrono. Isso **unifica** tratamento de erros síncronos e assíncronos num único mecanismo.

Quando uma Promise é rejeitada dentro de um `await`, a rejeição é **convertida em exceção** que pode ser capturada por `try/catch`. Isso elimina a necessidade de `.catch()` e permite controle de fluxo baseado em exceções.

**Mecânica fundamental:**
```javascript
async function exemplo() {
    try {
        const resultado = await operacaoAssincrona();
        // Se operacaoAssincrona() rejeitar, linha acima LANÇA exceção
    } catch (erro) {
        // Erro capturado aqui - tanto síncrono quanto assíncrono
        console.error('Erro:', erro);
    }
}
```

**Equivalência conceitual:**

```javascript
// Com Promises (.catch)
fetch('/dados')
    .then(r => r.json())
    .catch(erro => console.error(erro));

// Com async/await (try/catch)
try {
    const response = await fetch('/dados');
    const dados = await response.json();
} catch (erro) {
    console.error(erro);
}
```

Mesma funcionalidade, sintaxe mais **linear e familiar**.

### Contexto Histórico e Motivação

**Era Callbacks:** Tratamento de erros inconsistente

```javascript
fs.readFile('arquivo.txt', (erro, dados) => {
    if (erro) {
        console.error(erro);  // Padrão error-first
        return;
    }
    // processar dados
});
```

Cada API tinha sua própria convenção de erro.

**Era Promises:** `.catch()` padronizado

```javascript
fetch('/dados')
    .then(processar)
    .catch(erro => console.error(erro));
```

Melhor, mas ainda separado do código principal.

**Era Async/Await:** `try/catch` unificado (ES2017)

```javascript
try {
    const dados = await fetch('/dados').then(r => r.json());
    processar(dados);
} catch (erro) {
    console.error(erro);
}
```

**Mesmo mecanismo** para síncrono e assíncrono!

**Motivações principais:**

1. **Unificação:** Mesma sintaxe para todos os erros
2. **Familiaridade:** Desenvolvedores já conhecem `try/catch`
3. **Controle de fluxo:** `catch` integrado ao fluxo linear do código
4. **Debugging:** Stack traces mais claros
5. **Propagação:** Erros propagam naturalmente pela call stack

### Problema Fundamental que Resolve

Antes de async/await, erros assíncronos e síncronos precisavam tratamentos **diferentes**:

**Problema - Mistura de erros:**
```javascript
function processar() {
    try {
        const dados = JSON.parse(textoInvalido);  // Erro síncrono
    } catch (erro) {
        console.error('Erro síncrono capturado');
    }
    
    fetch('/dados')
        .catch(erro => {  // Erro assíncrono - DIFERENTE
            console.error('Erro assíncrono capturado');
        });
}
```

Dois mecanismos diferentes para conceito similar!

**Solução - Try/catch unificado:**
```javascript
async function processar() {
    try {
        const dados = JSON.parse(textoInvalido);  // Erro síncrono
        const response = await fetch('/dados');   // Erro assíncrono
    } catch (erro) {
        // AMBOS capturados aqui!
        console.error('Qualquer erro capturado');
    }
}
```

**Um único mecanismo** para todos os erros.

### Importância no Ecossistema

Error handling com try/catch é **essencial** porque:

- **Padrão universal:** Todo código async moderno usa
- **Robustez:** Aplicações precisam lidar com falhas
- **Debugging:** Stack traces indicam exatamente onde erro ocorreu
- **Recuperação:** Permite código continuar após erro (graceful degradation)
- **Produção:** Aplicações reais SEMPRE têm erros - precisa tratá-los
- **Manutenibilidade:** Código de erro junto ao código normal

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Promise rejeitada = exceção:** `await` converte rejeição em `throw`
2. **Try/catch captura:** Bloco `catch` recebe exceção
3. **Propagação:** Erro não capturado propaga até `catch` mais externo
4. **Finally:** Bloco `finally` sempre executa (cleanup)
5. **Retorno de Promise rejeitada:** Função retorna Promise rejeitada se erro não tratado

### Pilares Fundamentais

- **Unificação:** Mesmo mecanismo para síncrono e assíncrono
- **Linearidade:** Tratamento de erro no fluxo normal do código
- **Granularidade:** Pode ter try/catch específicos ou gerais
- **Composição:** Try/catch funcionam em qualquer nível da call stack
- **Transparência:** Error propagation automática

### Visão Geral das Nuances

- **Múltiplos awaits:** Um catch captura qualquer dos awaits
- **Error types:** Pode verificar tipo de erro no catch
- **Re-throw:** Pode capturar, processar e re-lançar
- **Finally para cleanup:** Garantir execução independente de erro
- **Async catch:** Código dentro de catch pode ser async

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Promise Rejection → Exception

Quando `await` encontra Promise rejeitada:

1. **Promise rejeita** com razão (motivo)
2. **Await converte** rejeição em **throw**
3. **Motor JavaScript procura** por `catch` no escopo atual
4. **Se encontra catch:** Executa bloco catch com erro
5. **Se não encontra:** Propaga para função chamadora

```javascript
async function exemplo() {
    try {
        const resultado = await Promise.reject('Erro de rede');
        // Linha acima equivale a: throw 'Erro de rede';
    } catch (erro) {
        console.error(erro);  // "Erro de rede"
    }
}
```

#### Equivalência Conceitual

```javascript
// Com await + try/catch
async function buscar() {
    try {
        const dados = await fetch('/dados');
        return dados;
    } catch (erro) {
        console.error(erro);
        return null;
    }
}

// Equivalente com Promise .catch()
function buscar() {
    return fetch('/dados')
        .catch(erro => {
            console.error(erro);
            return null;
        });
}
```

Mesma funcionalidade, sintaxes diferentes.

### Princípios Conceituais

#### Unificação de Erros Síncronos e Assíncronos

```javascript
async function processar() {
    try {
        // Erro síncrono
        const config = JSON.parse(configInvalida);  // throw
        
        // Erro assíncrono
        const dados = await fetch('/dados');  // pode rejeitar
        
        // Ambos capturados pelo MESMO catch
    } catch (erro) {
        console.error('Qualquer erro:', erro);
    }
}
```

**Não precisa** saber se erro é síncrono ou assíncrono - tratamento é idêntico.

#### Error Propagation

Erro não capturado **propaga** para função chamadora:

```javascript
async function nivel3() {
    await Promise.reject('Erro profundo');
    // Sem try/catch - propaga
}

async function nivel2() {
    await nivel3();  // Erro propaga
    // Sem try/catch - propaga
}

async function nivel1() {
    try {
        await nivel2();  // Erro propaga até aqui
    } catch (erro) {
        console.error('Capturado em nivel1:', erro);
    }
}

nivel1();  // "Capturado em nivel1: Erro profundo"
```

Erro "sobe" pela call stack até encontrar `catch`.

#### Finally para Cleanup

`finally` **sempre executa**, independente de erro:

```javascript
async function processar() {
    try {
        await operacaoArriscada();
    } catch (erro) {
        console.error(erro);
    } finally {
        // SEMPRE executa (sucesso ou erro)
        await fecharConexao();
        console.log('Cleanup concluído');
    }
}
```

Útil para liberar recursos (fechar arquivos, conexões, etc.).

---

## 🔍 Análise Conceitual Profunda

### Try/Catch Básico

```javascript
async function buscarUsuario(id) {
    try {
        const response = await fetch(`/usuario/${id}`);
        const usuario = await response.json();
        return usuario;
    } catch (erro) {
        console.error('Erro ao buscar usuário:', erro);
        return null;
    }
}
```

Qualquer erro em `fetch` ou `json()` é capturado.

### Capturando Múltiplos Awaits

```javascript
async function carregar() {
    try {
        const usuario = await fetch('/usuario').then(r => r.json());
        const pedidos = await fetch('/pedidos').then(r => r.json());
        const config = await fetch('/config').then(r => r.json());
        
        return { usuario, pedidos, config };
    } catch (erro) {
        // Captura erro de QUALQUER dos 3 fetches
        console.error('Erro em algum fetch:', erro);
        return null;
    }
}
```

Um único `catch` captura erro de qualquer `await`.

### Try/Catch com Finally

```javascript
async function processar(arquivo) {
    let conexao = null;
    
    try {
        conexao = await abrirConexao();
        const dados = await lerArquivo(arquivo);
        await processar(dados);
    } catch (erro) {
        console.error('Erro durante processamento:', erro);
    } finally {
        // Sempre executa, mesmo com erro
        if (conexao) {
            await conexao.fechar();
            console.log('Conexão fechada');
        }
    }
}
```

`finally` garante cleanup independente de sucesso/erro.

### Error Types - Verificando Tipo de Erro

```javascript
async function buscar() {
    try {
        const response = await fetch('/dados');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (erro) {
        if (erro instanceof TypeError) {
            console.error('Erro de rede:', erro);
        } else if (erro.message.startsWith('HTTP')) {
            console.error('Erro HTTP:', erro.message);
        } else {
            console.error('Erro desconhecido:', erro);
        }
        
        return null;
    }
}
```

Pode diferenciar tipos de erro e tratá-los especificamente.

### Re-throwing - Capturar e Re-lançar

```javascript
async function buscarComLog(id) {
    try {
        const dados = await fetch(`/item/${id}`).then(r => r.json());
        return dados;
    } catch (erro) {
        // Logar erro
        console.error(`Erro ao buscar ${id}:`, erro);
        
        // Re-lançar para função chamadora tratar
        throw erro;
    }
}

// Uso
async function processar() {
    try {
        const item = await buscarComLog(123);
    } catch (erro) {
        // Erro re-lançado chega aqui
        console.error('Tratamento final:', erro);
    }
}
```

Permite logging intermediário + tratamento em nível superior.

### Try/Catch Aninhados

```javascript
async function processar() {
    try {
        const config = await carregarConfig();
        
        try {
            const dados = await operacaoArriscada(config);
            return dados;
        } catch (erroOperacao) {
            console.error('Erro na operação:', erroOperacao);
            // Usa config padrão
            return await operacaoPadrao();
        }
    } catch (erroConfig) {
        console.error('Erro ao carregar config:', erroConfig);
        // Erro fatal
        throw new Error('Falha crítica: sem configuração');
    }
}
```

Catches aninhados para granularidade de tratamento.

### Error Handling Específico por Operação

```javascript
async function carregar() {
    let usuario = null;
    let pedidos = [];
    let config = {};
    
    // Usuário obrigatório
    try {
        usuario = await fetch('/usuario').then(r => r.json());
    } catch (erro) {
        throw new Error('Usuário obrigatório - abortando');
    }
    
    // Pedidos opcional
    try {
        pedidos = await fetch('/pedidos').then(r => r.json());
    } catch (erro) {
        console.warn('Pedidos indisponíveis, usando []');
    }
    
    // Config opcional
    try {
        config = await fetch('/config').then(r => r.json());
    } catch (erro) {
        console.warn('Config indisponível, usando padrão');
        config = { tema: 'light' };
    }
    
    return { usuario, pedidos, config };
}
```

Trata cada operação diferentemente - algumas obrigatórias, outras opcionais.

### Async Code no Catch

```javascript
async function processar() {
    try {
        const dados = await operacaoPrincipal();
        return dados;
    } catch (erro) {
        console.error('Erro na operação principal:', erro);
        
        // Pode fazer operação async no catch
        await enviarLogParaServidor(erro);
        
        // Tentar fallback assíncrono
        try {
            return await operacaoFallback();
        } catch (erroFallback) {
            console.error('Fallback também falhou:', erroFallback);
            return null;
        }
    }
}
```

Código no `catch` pode ser assíncrono.

### Error sem Try/Catch - Promise Rejeitada

```javascript
async function semTryCatch() {
    const dados = await operacaoQuePodefAlhar();
    // Se rejeitar, função RETORNA Promise rejeitada
    return dados;
}

// Uso - precisa tratar
semTryCatch()
    .then(dados => console.log(dados))
    .catch(erro => console.error(erro));  // Ou try/catch aqui

// Ou
async function uso() {
    try {
        const dados = await semTryCatch();
    } catch (erro) {
        console.error(erro);
    }
}
```

Erro não capturado vira Promise rejeitada retornada.

### Padrão - Early Return em Erro

```javascript
async function processar(id) {
    let dados;
    
    try {
        dados = await buscar(id);
    } catch (erro) {
        console.error('Erro ao buscar:', erro);
        return null;  // Early return
    }
    
    // Continua processamento apenas se sucesso
    const processado = transformar(dados);
    return processado;
}
```

Retorna cedo em caso de erro, evitando aninhamento.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Try/Catch

**Use quando:**

1. **Quer recuperar de erro:** Continuar execução com valor padrão
2. **Logging:** Registrar erro antes de propagar
3. **Cleanup necessário:** Garantir liberação de recursos
4. **Erro tratável:** Sabe como lidar com falha
5. **Fallback disponível:** Pode tentar alternativa

**Exemplos:**

**1. Recuperação com padrão:**
```javascript
async function buscarConfig() {
    try {
        return await fetch('/config').then(r => r.json());
    } catch (erro) {
        console.warn('Usando config padrão');
        return { tema: 'light', idioma: 'pt-BR' };
    }
}
```

**2. Logging + propagação:**
```javascript
async function operacao(id) {
    try {
        return await processarItem(id);
    } catch (erro) {
        await logErro(erro, { id, timestamp: Date.now() });
        throw erro;  // Re-throw
    }
}
```

**3. Cleanup garantido:**
```javascript
async function processar() {
    const arquivo = await abrir('dados.txt');
    try {
        return await processar(arquivo);
    } finally {
        await arquivo.fechar();  // Sempre fecha
    }
}
```

### Quando Não Usar Try/Catch

**Evite quando:**

1. **Não sabe como recuperar:** Melhor propagar
2. **Erro é fatal:** Deixar aplicação crashar
3. **Já tratado em nível superior:** Evitar duplicação
4. **Performance crítica:** Try/catch tem overhead (mínimo)

```javascript
// ❌ Try/catch desnecessário
async function buscar(id) {
    try {
        return await fetch(`/item/${id}`);
    } catch (erro) {
        throw erro;  // Re-throw sem fazer nada - inútil
    }
}

// ✅ Sem try/catch - erro propaga naturalmente
async function buscar(id) {
    return await fetch(`/item/${id}`);
}
```

### Padrões de Uso

**Padrão 1: Try/catch por operação**
```javascript
async function carregar() {
    const usuario = await carregarUsuario().catch(() => null);
    const pedidos = await carregarPedidos().catch(() => []);
    return { usuario, pedidos };
}
```

Cada operação trata próprio erro inline.

**Padrão 2: Try/catch global**
```javascript
async function carregar() {
    try {
        const usuario = await carregarUsuario();
        const pedidos = await carregarPedidos();
        return { usuario, pedidos };
    } catch (erro) {
        console.error('Erro ao carregar:', erro);
        return null;
    }
}
```

Um catch para todas as operações.

**Padrão 3: Híbrido**
```javascript
async function carregar() {
    // Obrigatório
    let usuario;
    try {
        usuario = await carregarUsuario();
    } catch (erro) {
        throw new Error('Usuário obrigatório');
    }
    
    // Opcional
    const pedidos = await carregarPedidos().catch(() => []);
    
    return { usuario, pedidos };
}
```

Combina estratégias conforme criticidade.

---

## ⚠️ Limitações e Considerações Teóricas

### Restrições Conceituais

**1. Try/catch não captura Promise não-awaited:**

```javascript
async function exemplo() {
    try {
        fetch('/dados');  // SEM await - não captura erro!
    } catch (erro) {
        console.error('Nunca captura erro de fetch');
    }
}

// Correto
async function exemplo() {
    try {
        await fetch('/dados');  // COM await - captura erro
    } catch (erro) {
        console.error('Captura erro');
    }
}
```

**2. Erro em callback não é capturado:**

```javascript
async function exemplo() {
    try {
        [1, 2, 3].forEach(async n => {
            await operacao(n);  // Erro aqui NÃO é capturado
        });
    } catch (erro) {
        console.error('Nunca captura');
    }
}
```

Callbacks async executam fora do try/catch.

**3. Erro em Promise.all parcial:**

```javascript
async function exemplo() {
    try {
        await Promise.all([
            operacao1(),  // Sucesso
            operacao2(),  // FALHA
            operacao3()   // Não executa (all aborta)
        ]);
    } catch (erro) {
        // Captura erro de operacao2
        // Mas operacao3 nunca executou!
    }
}
```

`Promise.all` falha rápido - primeiro erro aborta.

### Armadilhas Comuns

**Armadilha 1: Esquecer await**
```javascript
// ❌ Sem await - não captura
async function buscar() {
    try {
        const dados = fetch('/dados');  // Promise, não dados!
        console.log(dados);  // Promise { <pending> }
    } catch (erro) {
        console.error('Nunca captura erro de fetch');
    }
}

// ✅ Com await
async function buscar() {
    try {
        const dados = await fetch('/dados').then(r => r.json());
        console.log(dados);  // Dados reais
    } catch (erro) {
        console.error('Captura erro');
    }
}
```

**Armadilha 2: Erro em forEach**
```javascript
// ❌ forEach async - não captura
async function processar(items) {
    try {
        items.forEach(async item => {
            await processar(item);  // Erro não capturado
        });
    } catch (erro) {
        console.error('Nunca captura');
    }
}

// ✅ for...of
async function processar(items) {
    try {
        for (const item of items) {
            await processar(item);  // Erro capturado
        }
    } catch (erro) {
        console.error('Captura erro');
    }
}
```

**Armadilha 3: Catch sem tratamento útil**
```javascript
// ❌ Catch vazio - esconde erro
async function buscar() {
    try {
        return await fetch('/dados');
    } catch (erro) {
        // Nada - erro silenciado!
    }
}

// ✅ Pelo menos loga
async function buscar() {
    try {
        return await fetch('/dados');
    } catch (erro) {
        console.error('Erro ao buscar:', erro);
        throw erro;  // Re-throw
    }
}
```

### Performance Considerations

Try/catch tem **overhead mínimo** quando não há exceção:

```javascript
// Performance similar
async function semTryCatch() {
    return await operacao();
}

async function comTryCatch() {
    try {
        return await operacao();
    } catch (erro) {
        return null;
    }
}
```

**Mas:** Lançar exceção é **caro**. Evite usar para controle de fluxo normal:

```javascript
// ❌ Usar exceção para controle de fluxo - lento
async function buscar(id) {
    try {
        return await fetch(`/item/${id}`);
    } catch (erro) {
        return null;  // Esperado regularmente
    }
}

// ✅ Verificar antes
async function buscar(id) {
    const existe = await verificarExistencia(id);
    if (!existe) return null;
    return await fetch(`/item/${id}`);
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Promises

Try/catch é **sintaxe alternativa** para `.catch()`:

```javascript
// Promise .catch()
fetch('/dados')
    .then(r => r.json())
    .catch(erro => console.error(erro));

// Async/await try/catch
try {
    const dados = await fetch('/dados').then(r => r.json());
} catch (erro) {
    console.error(erro);
}
```

Internamente, ambos fazem a mesma coisa.

### Relação com Event Loop

Exceção em async function agenda microtask:

```javascript
console.log('1');

async function exemplo() {
    console.log('2');
    try {
        await Promise.reject('Erro');
    } catch (erro) {
        console.log('4');
    }
}

exemplo();
console.log('3');

// Output: 1, 2, 3, 4
```

Catch executa em microtask quando Promise rejeita.

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. Async Functions (habilita await)
2. Await Operator (pausa e retorna valor)
3. **Error Handling** (você está aqui)
4. **Sequential vs Parallel** (performance)
5. Loops com Async
6. Top-level Await

### Preparação para Patterns Avançados

Com error handling, próximo passo: **otimização**:

```javascript
// Sequential (lento)
try {
    const a = await op1();
    const b = await op2();
} catch (erro) {
    console.error(erro);
}

// Parallel (rápido)
try {
    const [a, b] = await Promise.all([op1(), op2()]);
} catch (erro) {
    console.error(erro);
}
```

Próximo: **Sequential vs Parallel Execution**.

---

## 📚 Conclusão

**Error handling com try/catch** unifica tratamento de erros síncronos e assíncronos, tornando código robusto e legível. É **fundamental** para aplicações confiáveis.

**Conceitos essenciais:**
- **Try/catch captura** erros de awaits
- **Promise rejeitada = exceção** lançada
- **Finally sempre executa** (cleanup)
- **Propagação automática** até catch mais externo
- **Verificar tipos de erro** para tratamento específico
- **Re-throw** para logging + propagação
- **Async code no catch** é permitido
- **Sem await = sem captura** de erro assíncrono

Dominar error handling é crucial para escrever código **resiliente e manutenível**.
