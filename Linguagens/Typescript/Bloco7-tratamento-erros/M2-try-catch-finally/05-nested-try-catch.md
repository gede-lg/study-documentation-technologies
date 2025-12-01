# Nested Try...Catch

## 🎯 Introdução e Definição

### Definição Conceitual

**Nested try...catch** (ou **try/catch aninhado**) refere-se à prática de colocar **blocos try/catch dentro de outros blocos try/catch**, criando **múltiplas camadas** de error handling. Esta técnica permite **tratamento diferenciado** de erros em diferentes níveis de abstração - erros específicos são tratados localmente (inner try/catch), enquanto erros gerais propagam para níveis superiores (outer try/catch).

Conceitualmente, nested try/catch implementa **error handling hierárquico** - cada nível da aplicação (função, módulo, camada) pode ter seu próprio error handling, decidindo quais erros tratar localmente e quais propagar para caller. Erro não capturado em inner try/catch **propaga** para outer try/catch, permitindo **fallback handling** em múltiplos níveis.

Nested try/catch é especialmente útil em **operações complexas** com múltiplas etapas - cada etapa pode ter error handling específico, mas erro catastrófico propaga para nível superior. Também permite **error transformation** - capturar erro específico em nível baixo, transformar em erro de domínio, re-throw para nível superior.

### Contexto Histórico e Motivação

**JavaScript (desde 1.4):** Try/catch sempre suportou nesting - blocos try/catch são statements regulares, podem ser aninhados como qualquer código.

**Padrões de nesting:**
- **Error Transformation:** Capturar erro técnico, transformar em erro de domínio
- **Partial Recovery:** Tentar recuperar localmente, propagar se falhar
- **Cleanup Layers:** Diferentes recursos em diferentes níveis
- **Logging Hierarchy:** Log em múltiplos níveis com contexto diferente

**Motivação histórica:**

**Problema: Single try/catch limita granularidade**
```typescript
// Single try/catch - difícil diferenciar origem do erro
try {
  const dados = await buscarDados();
  const processado = processar(dados);
  await salvar(processado);
} catch (e) {
  // Qual operação falhou? buscarDados, processar, ou salvar?
  console.error("Erro em alguma operação:", e);
}
```

**Solução: Nested try/catch para granularidade**
```typescript
// Nested try/catch - tratamento específico por etapa
try {
  let dados;
  
  try {
    dados = await buscarDados();
  } catch (e) {
    console.error("Erro ao buscar dados:", e);
    dados = obterDadosCache();  // Fallback
  }
  
  const processado = processar(dados);
  
  try {
    await salvar(processado);
  } catch (e) {
    console.error("Erro ao salvar:", e);
    await salvarEmFilaRetry(processado);  // Retry queue
  }
} catch (e) {
  console.error("Erro geral:", e);
}
```

**Motivação para nested try/catch:**
- **Granular Error Handling:** Tratar erros específicos em contexto apropriado
- **Error Propagation Control:** Decidir quais erros propagar
- **Fallback Strategies:** Múltiplas estratégias de recuperação
- **Context Preservation:** Adicionar contexto em cada nível
- **Cleanup Hierarchy:** Diferentes recursos em diferentes scopes

### Problema Fundamental que Resolve

Nested try/catch resolve o problema de **tratar erros em diferentes níveis de abstração** com estratégias apropriadas para cada nível.

**Problema: Erro genérico sem contexto**
```typescript
// Single try/catch - erro genérico
async function processarUsuario(id: number) {
  try {
    const usuario = await buscarUsuario(id);
    validarUsuario(usuario);
    await atualizarUsuario(usuario);
    await enviarEmail(usuario);
  } catch (e) {
    // Qual operação falhou?
    console.error("Erro ao processar usuário:", e);
    throw e;
  }
}
```

**Solução: Nested try/catch com contexto**
```typescript
// Nested try/catch - erro específico com contexto
async function processarUsuario(id: number) {
  try {
    let usuario;
    
    try {
      usuario = await buscarUsuario(id);
    } catch (e) {
      throw new Error(`Falha ao buscar usuário ${id}: ${e}`);
    }
    
    try {
      validarUsuario(usuario);
    } catch (e) {
      throw new Error(`Validação falhou para usuário ${id}: ${e}`);
    }
    
    try {
      await atualizarUsuario(usuario);
    } catch (e) {
      throw new Error(`Falha ao atualizar usuário ${id}: ${e}`);
    }
    
    // Email falhar não é crítico - captura e loga
    try {
      await enviarEmail(usuario);
    } catch (e) {
      console.warn(`Falha ao enviar email para usuário ${id}:`, e);
      // NÃO re-throw - email não é crítico
    }
  } catch (e) {
    console.error("Erro crítico ao processar usuário:", e);
    throw e;
  }
}
```

**Fundamento teórico:** Nested try/catch permite **diferentes estratégias** de error handling em diferentes etapas.

### Importância no Ecossistema

Nested try/catch é importante porque:

- **Error Handling Flexibility:** Cada nível decide como tratar erros
- **Error Context:** Adicionar contexto em múltiplos níveis
- **Partial Recovery:** Recuperar de erros não-críticos localmente
- **Resource Cleanup:** Diferentes recursos em diferentes scopes
- **Logging Hierarchy:** Log com contexto apropriado em cada nível

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Hierarchical Handling:** Erros tratados em múltiplos níveis
2. **Error Propagation:** Erro não capturado propaga para outer catch
3. **Selective Handling:** Inner catch decide tratar ou propagar
4. **Error Transformation:** Capturar erro baixo-nível, re-throw erro domínio
5. **Cleanup Layers:** Finally em múltiplos níveis para cleanup

### Pilares Fundamentais

- **Inner/Outer Scope:** Inner try/catch dentro de outer try/catch
- **Propagation Chain:** Erro propaga de inner para outer se não capturado
- **Selective Catch:** Inner catch pode capturar apenas erros específicos
- **Re-throwing:** Inner catch pode log e re-throw para outer
- **Finally Chain:** Finally executa de inner para outer

### Visão Geral das Nuances

- **Error Hiding:** Inner catch pode esconder erro de outer (se não re-throw)
- **Performance:** Nested try/catch tem overhead mínimo
- **Readability:** Muitos níveis podem dificultar leitura
- **Alternative Patterns:** Às vezes funções separadas são mais claras
- **Async Complexity:** Nested try/catch com async/await pode ser complexo

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Basic Nested Try/Catch

```typescript
try {
  console.log("Outer try");
  
  try {
    console.log("Inner try");
    throw new Error("Erro no inner");
  } catch (e) {
    console.log("Inner catch:", e.message);
    // NÃO re-throw - erro tratado aqui
  }
  
  console.log("Outer try continua");
} catch (e) {
  console.log("Outer catch:", e.message);
}

// Output:
// "Outer try"
// "Inner try"
// "Inner catch: Erro no inner"
// "Outer try continua"
// Outer catch NÃO executa - erro foi tratado em inner
```

**Análise profunda:**

**Propagation Flow:**
```
Outer try entra
  ↓
Inner try entra
  ↓
Erro em inner
  ↓
Inner catch captura
  ↓
Erro NÃO propaga (não re-thrown)
  ↓
Outer try continua
  ↓
Outer catch NÃO executa
```

**Conceito fundamental:** Inner catch **captura** erro - **não propaga** para outer (a menos que re-throw).

#### Nested Try/Catch with Re-throw

```typescript
try {
  console.log("Outer try");
  
  try {
    console.log("Inner try");
    throw new Error("Erro no inner");
  } catch (e) {
    console.log("Inner catch:", e.message);
    throw e;  // Re-throw para outer
  }
  
  console.log("Esta linha não executa");
} catch (e) {
  console.log("Outer catch:", e.message);
}

// Output:
// "Outer try"
// "Inner try"
// "Inner catch: Erro no inner"
// "Outer catch: Erro no inner"
```

**Fundamento teórico:** Re-throw em inner catch **propaga** erro para outer catch.

### Princípios e Conceitos Subjacentes

#### Selective Error Handling

```typescript
try {
  try {
    operacao();
  } catch (e) {
    // Captura apenas erros específicos
    if (e instanceof ValidationError) {
      console.log("Validação falhou:", e.message);
      // Tratado localmente - não re-throw
    } else {
      // Outros erros propagam
      throw e;
    }
  }
} catch (e) {
  // Captura erros NÃO-ValidationError
  console.error("Erro geral:", e);
}
```

**Conceito crucial:** Inner catch pode **filtrar** erros - capturar alguns, propagar outros.

#### Error Transformation

```typescript
class DomainError extends Error {
  constructor(message: string, public causa: Error) {
    super(message);
    this.name = "DomainError";
  }
}

try {
  try {
    await apiCall();
  } catch (e) {
    // Transformar erro técnico em erro de domínio
    if (e instanceof Error) {
      throw new DomainError("Falha na operação de negócio", e);
    }
    throw e;
  }
} catch (e) {
  if (e instanceof DomainError) {
    console.error("Erro de domínio:", e.message);
    console.error("Causa:", e.causa);
  }
}
```

**Análise profunda:** Nested try/catch permite **encapsular** erros técnicos em erros de domínio.

#### Multiple Layers of Cleanup

```typescript
async function processar() {
  let recurso1: Resource | null = null;
  
  try {
    recurso1 = await adquirirRecurso1();
    
    let recurso2: Resource | null = null;
    
    try {
      recurso2 = await adquirirRecurso2();
      
      await operacao(recurso1, recurso2);
    } finally {
      // Inner finally - cleanup recurso2
      if (recurso2) {
        await recurso2.liberar();
      }
    }
  } finally {
    // Outer finally - cleanup recurso1
    if (recurso1) {
      await recurso1.liberar();
    }
  }
}
```

**Fundamento teórico:** Nested try/finally permite **cleanup hierárquico** - cada nível limpa seus próprios recursos.

### Modelo Mental para Compreensão

Pense em nested try/catch como **camadas de proteção**:

**Outer try/catch:** Rede de segurança geral
**Inner try/catch:** Rede de segurança específica

**Analogia:**
- **Inner:** Segurança de tarefa específica (usar luvas ao manusear químico)
- **Outer:** Segurança geral (laboratório tem chuveiro de emergência)

**Fluxo:**
```
Outer try
  ↓
Inner try
  ↓
Erro
  ↓
Inner catch (específico)
  ↓
Tratado? → Sim → Outer continua
         → Não → Propaga para Outer catch (geral)
```

## 🔍 Análise Conceitual Profunda

### Error Propagation Chain

```typescript
try {
  console.log("Level 1");
  
  try {
    console.log("Level 2");
    
    try {
      console.log("Level 3");
      throw new Error("Erro");
    } catch (e) {
      console.log("Catch Level 3");
      throw e;  // Propaga para Level 2
    }
  } catch (e) {
    console.log("Catch Level 2");
    throw e;  // Propaga para Level 1
  }
} catch (e) {
  console.log("Catch Level 1");
}

// Output:
// "Level 1"
// "Level 2"
// "Level 3"
// "Catch Level 3"
// "Catch Level 2"
// "Catch Level 1"
```

**Análise profunda:** Erro **propaga** através de múltiplos níveis se cada catch re-throw.

#### Partial Recovery Pattern

```typescript
async function processarComRetry() {
  try {
    // Tentativa principal
    try {
      return await operacaoPrincipal();
    } catch (e) {
      console.log("Operação principal falhou, tentando fallback");
      // NÃO re-throw - tenta fallback
    }
    
    // Fallback
    try {
      return await operacaoFallback();
    } catch (e) {
      console.log("Fallback falhou, tentando cache");
      // NÃO re-throw - tenta cache
    }
    
    // Cache
    return await operacaoCache();
  } catch (e) {
    console.error("Todas estratégias falharam:", e);
    throw e;
  }
}
```

**Conceito avançado:** Nested try/catch permite **múltiplas estratégias** de fallback.

### Context Addition Pattern

```typescript
async function processarPedido(pedidoId: number) {
  try {
    try {
      const pedido = await buscarPedido(pedidoId);
      
      try {
        await validarPedido(pedido);
      } catch (e) {
        throw new Error(`Validação falhou para pedido ${pedidoId}: ${e}`);
      }
      
      try {
        await processarPagamento(pedido);
      } catch (e) {
        throw new Error(`Pagamento falhou para pedido ${pedidoId}: ${e}`);
      }
    } catch (e) {
      throw new Error(`Processamento falhou: ${e}`);
    }
  } catch (e) {
    console.error("Erro final:", e);
    throw e;
  }
}
```

**Fundamento teórico:** Cada nível **adiciona contexto** ao erro - stack trace fica mais informativo.

#### Resource Management with Nested Finally

```typescript
async function operacaoComplexa() {
  const lock1 = await adquirirLock1();
  
  try {
    const lock2 = await adquirirLock2();
    
    try {
      const conexao = await conectarDB();
      
      try {
        await executarOperacao(conexao);
      } finally {
        // Libera conexao
        await conexao.fechar();
      }
    } finally {
      // Libera lock2
      await lock2.release();
    }
  } finally {
    // Libera lock1
    await lock1.release();
  }
}
```

**Análise profunda:** Nested finally garante **cleanup hierárquico** - cada recurso é liberado em ordem inversa de aquisição.

### Conditional Re-throwing

```typescript
try {
  try {
    await operacao();
  } catch (e) {
    if (e instanceof RecoverableError) {
      console.log("Erro recuperável, tentando retry");
      await retry();
      // NÃO re-throw - recuperado
    } else {
      console.error("Erro não-recuperável");
      throw e;  // Re-throw para outer
    }
  }
} catch (e) {
  console.error("Erro final:", e);
}
```

**Conceito crucial:** Inner catch decide **seletivamente** quais erros re-throw.

#### Nested Try/Catch with Logging

```typescript
async function processar() {
  try {
    console.log("[INFO] Iniciando processamento");
    
    try {
      const dados = await buscarDados();
      console.log("[DEBUG] Dados buscados:", dados);
      
      try {
        const resultado = processar(dados);
        console.log("[DEBUG] Processamento concluído:", resultado);
        return resultado;
      } catch (e) {
        console.error("[ERROR] Falha no processamento:", e);
        throw e;
      }
    } catch (e) {
      console.error("[ERROR] Falha ao buscar dados:", e);
      throw e;
    }
  } catch (e) {
    console.error("[FATAL] Processamento abortado:", e);
    throw e;
  }
}
```

**Fundamento teórico:** Cada nível pode **log com severidade** diferente.

### Nested Try/Catch in Async Functions

```typescript
async function operacaoAsync() {
  try {
    const etapa1 = await step1();
    
    try {
      const etapa2 = await step2(etapa1);
      
      try {
        const etapa3 = await step3(etapa2);
        return etapa3;
      } catch (e) {
        console.error("Erro em step3:", e);
        throw e;
      }
    } catch (e) {
      console.error("Erro em step2:", e);
      throw e;
    }
  } catch (e) {
    console.error("Erro em step1:", e);
    throw e;
  }
}
```

**Análise profunda:** Nested try/catch com async/await permite **error handling granular** de promises.

#### Alternative: Separate Functions

```typescript
// ❌ Nested try/catch profundo - difícil leitura
async function processar() {
  try {
    try {
      try {
        try {
          // ...
        } catch (e) { }
      } catch (e) { }
    } catch (e) { }
  } catch (e) { }
}

// ✅ Funções separadas - mais claro
async function step1() {
  try {
    // ...
  } catch (e) {
    console.error("Erro em step1:", e);
    throw e;
  }
}

async function step2() {
  try {
    // ...
  } catch (e) {
    console.error("Erro em step2:", e);
    throw e;
  }
}

async function processar() {
  try {
    await step1();
    await step2();
  } catch (e) {
    console.error("Erro geral:", e);
    throw e;
  }
}
```

**Limitação:** Muitos níveis de nesting dificultam leitura - considerar **funções separadas**.

### Nested Try/Catch with Finally Chain

```typescript
try {
  console.log("Outer try");
  
  try {
    console.log("Inner try");
    throw new Error("Erro");
  } catch (e) {
    console.log("Inner catch");
    throw e;
  } finally {
    console.log("Inner finally");
  }
} catch (e) {
  console.log("Outer catch");
} finally {
  console.log("Outer finally");
}

// Output:
// "Outer try"
// "Inner try"
// "Inner catch"
// "Inner finally"
// "Outer catch"
// "Outer finally"
```

**Fundamento teórico:** Finally blocks executam **de inner para outer** - garantia de cleanup em todos níveis.

#### Error Hiding (Anti-Pattern)

```typescript
// ❌ Anti-pattern - erro escondido
try {
  try {
    throw new Error("Erro importante");
  } catch (e) {
    console.log("Erro capturado e ignorado");
    // NÃO re-throw - erro perdido!
  }
  
  console.log("Continua como se nada tivesse acontecido");
} catch (e) {
  // Nunca executa - erro foi escondido
  console.log("Nunca vê o erro");
}
```

**Limitação:** Inner catch pode **esconder** erros se não re-throw - anti-pattern.

### Performance Considerations

```typescript
// Nested try/catch tem overhead mínimo
function semNested() {
  try {
    operacao1();
    operacao2();
    operacao3();
  } catch (e) {
    console.error(e);
  }
}

function comNested() {
  try {
    try {
      operacao1();
    } catch (e) {
      console.error("Erro em operacao1:", e);
      throw e;
    }
    
    try {
      operacao2();
    } catch (e) {
      console.error("Erro em operacao2:", e);
      throw e;
    }
    
    try {
      operacao3();
    } catch (e) {
      console.error("Erro em operacao3:", e);
      throw e;
    }
  } catch (e) {
    console.error("Erro geral:", e);
  }
}

// Performance difference é negligível em V8
```

**Análise profunda:** Nested try/catch tem **overhead mínimo** - não evitar por performance.

## 🎯 Aplicabilidade e Contextos

### Transaction with Rollback

```typescript
async function executarTransacao() {
  await db.beginTransaction();
  
  try {
    await db.insert(...);
    
    try {
      await db.update(...);
    } catch (e) {
      console.error("Update falhou, rollback parcial");
      await db.rollback();
      throw e;
    }
    
    await db.commit();
  } catch (e) {
    console.error("Transação falhou, rollback completo");
    await db.rollback();
    throw e;
  }
}
```

**Raciocínio:** Nested try/catch permite **rollback granular** - diferentes estratégias por etapa.

### Multi-Step Validation

```typescript
function validarUsuario(usuario: any) {
  try {
    // Validação estrutural
    try {
      if (!usuario.nome) throw new Error("Nome obrigatório");
      if (!usuario.email) throw new Error("Email obrigatório");
    } catch (e) {
      throw new ValidationError("Validação estrutural falhou", e);
    }
    
    // Validação de formato
    try {
      if (!emailRegex.test(usuario.email)) {
        throw new Error("Email inválido");
      }
    } catch (e) {
      throw new ValidationError("Validação de formato falhou", e);
    }
  } catch (e) {
    console.error("Validação falhou:", e);
    throw e;
  }
}
```

**Raciocínio:** Nested try/catch separa **diferentes tipos** de validação.

## ⚠️ Limitações e Considerações Teóricas

### Deep Nesting Reduces Readability

```typescript
// ❌ Muitos níveis - difícil leitura
try {
  try {
    try {
      try {
        // ...
      } catch (e) { }
    } catch (e) { }
  } catch (e) { }
} catch (e) { }
```

**Limitação:** Muitos níveis **dificultam leitura** - considerar refatoração.

### Error Can Be Hidden

```typescript
try {
  try {
    throw new Error("Importante");
  } catch (e) {
    // Esconde erro - anti-pattern
  }
} catch (e) {
  // Nunca vê erro
}
```

**Consideração:** Inner catch pode **esconder** erros - sempre re-throw se necessário.

## 🔗 Interconexões Conceituais

**Relação com Error Propagation:** Nested permite controlar propagação.

**Relação com Finally:** Finally chain garante cleanup hierárquico.

**Relação com Custom Errors:** Nested permite error transformation.

**Relação com Logging:** Cada nível pode log com contexto diferente.

## 🚀 Evolução e Próximos Conceitos

Dominar nested try/catch prepara para:
- **Throw Statement:** Lançar erros customizados
- **Custom Error Classes:** Criar hierarquia de erros
- **Error Propagation Patterns:** Best practices de propagação
- **Async Error Handling:** Nested com async/await avançado
