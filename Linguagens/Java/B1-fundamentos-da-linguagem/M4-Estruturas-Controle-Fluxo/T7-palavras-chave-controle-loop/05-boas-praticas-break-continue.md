# Boas Práticas no Uso de Break e Continue

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Boas práticas no uso de break e continue** referem-se ao conjunto de **diretrizes, princípios e padrões** que orientam quando, como e por que utilizar essas instruções de controle de fluxo de forma efetiva, legível e mantível. Essas práticas representam o **conhecimento acumulado** da comunidade de desenvolvimento sobre os usos apropriados e inapropriados dessas ferramentas, visando maximizar a clareza do código enquanto minimizam bugs, confusão e dívida técnica.

Conceitualmente, boas práticas são a ponte entre **conhecer a sintaxe** (como break e continue funcionam tecnicamente) e **dominar a arte** (quando aplicá-los para produzir código excepcional). Elas transformam ferramentas de controle de fluxo de meros mecanismos técnicos em instrumentos de **comunicação de intenção** e **expressão de lógica de negócio**.

### Contexto Histórico e Motivação

As boas práticas em torno de break e continue evoluíram ao longo de décadas de desenvolvimento de software, à medida que a comunidade aprendeu coletivamente com erros, anti-padrões e sucessos.

**Anos 1960-1970:** O debate sobre `goto` statements levou Dijkstra a escrever o famoso artigo "Go To Statement Considered Harmful" (1968), argumentando que saltos arbitrários tornavam código incompreensível. Este debate estabeleceu que **programação estruturada** - com construções claras de controle de fluxo - era superior.

**Anos 1980-1990:** Linguagens como C, Pascal e posteriormente Java adotaram `break` e `continue` como alternativas estruturadas ao `goto`. Porém, desenvolvedores descobriram que uso indiscriminado destes também podia criar "código espaguete light". Boas práticas começaram a emergir: quando usar, quando evitar, como nomear labels, etc.

**Anos 2000-2010:** Com o advento de programação funcional e idiomas mais declarativos, a comunidade começou a questionar se loops imperativos com break/continue eram sempre a melhor abordagem. Surgiu o consenso de que break/continue têm seu lugar, mas devem competir com alternativas como métodos auxiliares, Streams, e pattern matching.

**Anos 2010-Presente:** As boas práticas modernas equilibram pragmatismo (break/continue são úteis) com preferência por código declarativo. O foco é em **intenção clara**, **legibilidade**, e **manutenibilidade**.

### Problema Fundamental que Resolve

Boas práticas resolvem o problema central de **ambiguidade e confusão** que pode surgir com uso inadequado de break e continue:

**1. Código Difícil de Seguir:** Múltiplos break/continue sem padrão claro criam fluxo imprevisível. Boas práticas tornam fluxo óbvio.

**2. Bugs Sutis:** Break ou continue no lugar errado, em loop errado, ou com lógica invertida causa bugs difíceis de detectar. Práticas robustas previnem isso.

**3. Manutenção Custosa:** Código sem padrões consistentes é difícil de modificar. Boas práticas criam expectativas que facilitam mudanças.

**4. Falta de Clareza de Intenção:** Sem práticas claras, não é óbvio por que break/continue foram usados. Práticas documentam intenção.

**5. Escolhas Subótimas:** Sem diretrizes, desenvolvedores podem usar break/continue onde alternativas seriam melhores (ou vice-versa). Práticas orientam decisões.

### Importância no Ecossistema Java

Boas práticas não são "regras rígidas", mas **sabedoria destilada** da comunidade Java. Sua importância:

- **Código Profissional:** Seguir boas práticas é marca de código profissional vs amador.

- **Code Reviews:** Facilitam revisões de código ao estabelecer padrões compartilhados.

- **Onboarding:** Novos membros de equipe podem entender código rapidamente se segue convenções.

- **Redução de Bugs:** Práticas baseadas em erros comuns previnem armadilhas conhecidas.

- **Alinhamento com Comunidade:** Código que segue práticas Java idiomáticas é mais reconhecível para qualquer desenvolvedor Java.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Clareza sobre Complexidade:** Prefira código simples e claro a otimizações prematuras ou truques inteligentes com break/continue.

2. **Intenção Explícita:** Break e continue devem tornar intenção mais clara, não obscurecê-la.

3. **Contexto Importa:** Não há regras absolutas - contexto determina se break/continue é apropriado.

4. **Alternativas Primeiro:** Considere se há forma mais clara (método auxiliar, Stream) antes de usar break/continue.

5. **Consistência:** Use padrões consistentes em toda codebase para previsibilidade.

### Pilares Fundamentais das Boas Práticas

- **Legibilidade > Concisão:** Código mais longo mas claro é melhor que conciso mas confuso.

- **Fail Fast:** Use break/continue para detectar e reagir a condições cedo.

- **Single Responsibility:** Loops devem ter propósito claro; break/continue devem servir esse propósito.

- **Nomes Descritivos:** Labels (quando necessários) devem ter nomes que descrevem o que o loop faz.

- **Documentação:** Comentar uso não-óbvio de break/continue.

### Visão Geral das Nuances

- **Break é Mais Aceito que Continue:** Comunidade geralmente vê break como mais intuitivo; continue pode confundir.

- **Return > Break quando Possível:** Se loop é propósito do método, return direto é mais claro.

- **Labels são Raros:** Use labels apenas quando realmente necessário - são poder, mas com custo de complexidade.

- **Guard Clauses com Continue:** Continue no início de loops para validação é padrão aceito.

- **Evitar Múltiplos Break/Continue:** Mais de 1-2 em um loop pode indicar necessidade de refatoração.

---

## 🧠 Fundamentos Teóricos das Boas Práticas

### Princípios Subjacentes

#### 1. Princípio da Menor Surpresa

**Definição:** Código deve comportar-se da forma mais óbvia e esperada possível.

**Aplicação:**
- `break` em busca é esperado e intuitivo
- `continue` com label complexo pode surpreender negativamente
- Use break/continue de formas que desenvolvedores experientes reconheçam imediatamente

#### 2. Princípio DRY (Don't Repeat Yourself)

**Aplicação:**
- Se mesma lógica de break aparece em múltiplos loops, extraia para método
- Se condição para continue é complexa e repetida, extraia para método auxiliar

#### 3. Princípio KISS (Keep It Simple, Stupid)

**Aplicação:**
- Prefira solução mais simples que funciona
- Break simples é mais simples que label complexo
- Método auxiliar pode ser mais simples que loop com múltiplos break/continue

#### 4. Princípio da Responsabilidade Única (SRP)

**Aplicação:**
- Loop deve ter um propósito claro
- Break/continue devem servir esse propósito único
- Se loop faz múltiplas coisas com múltiplos break/continue, considere split

### Modelos Mentais para Decisão

#### Árvore de Decisão: "Devo Usar Break?"

```
Preciso sair do loop antes do fim natural?
│
├─ Não → Não use break
│
└─ Sim → O loop é o propósito principal do método?
    │
    ├─ Sim → Considere RETURN em vez de break
    │
    └─ Não → Há código importante após o loop?
        │
        ├─ Sim → Use break (pode ser necessário flag também)
        │
        └─ Não → A razão para sair é encontrar algo?
            │
            ├─ Sim → Break é apropriado
            │
            └─ Não → A razão é condição de erro?
                │
                ├─ Sim → Considere exceção em vez de break
                │
                └─ Não → Reavalie se break é realmente necessário
```

#### Árvore de Decisão: "Devo Usar Continue?"

```
Preciso pular alguns elementos?
│
├─ Não → Não use continue
│
└─ Sim → A condição de pulo é simples?
    │
    ├─ Sim → Continue com guard clause é ok
    │
    └─ Não → A lógica de processamento é complexa?
        │
        ├─ Sim → Considere extrair para método e usar return
        │
        └─ Não → Há múltiplas condições de pulo?
            │
            ├─ Sim → Múltiplos continue são aceitáveis
            │
            └─ Não → Continue é apropriado
```

---

## 🔍 Análise Conceitual Profunda: Padrões e Anti-Padrões

### ✅ Padrão 1: Guard Clause com Continue

**Conceito:** Validar elementos no início do loop e pular inválidos.

```java
// ✅ BOM: Continue para guard clauses
for (Usuario usuario : usuarios) {
    if (usuario == null) continue;
    if (!usuario.isAtivo()) continue;
    if (usuario.getIdade() < 18) continue;

    // Código principal limpo, sem aninhamento
    processarUsuario(usuario);
    enviarNotificacao(usuario);
}
```

**Por que é boa prática:**
- **Legibilidade:** Validações no topo são óbvias
- **Baixo Aninhamento:** Código principal fica no nível base
- **Manutenibilidade:** Adicionar nova validação é trivial

**Comparação com alternativa ruim:**
```java
// ❌ RUIM: Aninhamento profundo
for (Usuario usuario : usuarios) {
    if (usuario != null) {
        if (usuario.isAtivo()) {
            if (usuario.getIdade() >= 18) {
                processarUsuario(usuario);
                enviarNotificacao(usuario);
            }
        }
    }
}
```

### ✅ Padrão 2: Break em Busca

**Conceito:** Sair do loop assim que elemento procurado é encontrado.

```java
// ✅ BOM: Break em busca
boolean encontrado = false;
for (Produto produto : produtos) {
    if (produto.getCodigo().equals(codigoProcurado)) {
        produtoEncontrado = produto;
        encontrado = true;
        break; // Encontrou, não precisa continuar
    }
}
```

**Por que é boa prática:**
- **Eficiência:** Economiza iterações desnecessárias
- **Intenção Clara:** Break comunica "encontrei, missão cumprida"
- **Padrão Reconhecido:** Qualquer desenvolvedor Java reconhece este padrão

**Ainda melhor com return (se aplicável):**
```java
// ✅ MELHOR: Return direto
public Produto buscarPorCodigo(String codigo) {
    for (Produto produto : produtos) {
        if (produto.getCodigo().equals(codigo)) {
            return produto; // Mais direto
        }
    }
    return null;
}
```

### ✅ Padrão 3: Labels Descritivos

**Conceito:** Quando labels são necessários, usar nomes que descrevem o propósito do loop.

```java
// ✅ BOM: Label descritivo
buscarUsuarioAtivo:
for (Departamento dept : departamentos) {
    for (Usuario usuario : dept.getUsuarios()) {
        if (usuario.isAtivo() && usuario.temPermissao(ADMIN)) {
            adminEncontrado = usuario;
            break buscarUsuarioAtivo; // Claro qual loop está quebrando
        }
    }
}
```

**Por que é boa prática:**
- **Auto-Documentação:** Nome do label explica o que o loop faz
- **Clareza:** `break buscarUsuarioAtivo` é óbvio na intenção
- **Manutenibilidade:** Facilita entender código meses depois

**Comparação com alternativa ruim:**
```java
// ❌ RUIM: Label genérico
externo:
for (Departamento dept : departamentos) {
    for (Usuario usuario : dept.getUsuarios()) {
        if (usuario.isAtivo() && usuario.temPermissao(ADMIN)) {
            adminEncontrado = usuario;
            break externo; // "externo"? O que isso significa?
        }
    }
}
```

### ✅ Padrão 4: Break em Validação All

**Conceito:** Validar todos os elementos e sair assim que um falha.

```java
// ✅ BOM: Break assim que validação falha
public boolean todosPositivos(int[] numeros) {
    for (int num : numeros) {
        if (num <= 0) {
            return false; // Fail fast
        }
    }
    return true; // Todos passaram
}
```

**Por que é boa prática:**
- **Fail Fast:** Detecta falha o mais cedo possível
- **Eficiência:** Não verifica elementos restantes após falha
- **Padrão "All":** Comunidade reconhece como padrão de validação universal

### ❌ Anti-Padrão 1: Break/Continue em Loop Errado

**Conceito:** Usar break/continue simples quando label seria necessário.

```java
// ❌ RUIM: Break no loop errado
for (int i = 0; i < linhas; i++) {
    for (int j = 0; j < colunas; j++) {
        if (matriz[i][j] == alvo) {
            break; // Só quebra loop j, não i!
        }
    }
    // Loop i continua mesmo após encontrar alvo
}
```

**Por que é ruim:**
- **Bug Sutil:** Parece que encontrar encerra busca, mas não encerra
- **Ineficiência:** Continua iterando linhas após encontrar
- **Confusão:** Intenção não é clara

**Correção:**
```java
// ✅ BOM: Label ou return
busca:
for (int i = 0; i < linhas; i++) {
    for (int j = 0; j < colunas; j++) {
        if (matriz[i][j] == alvo) {
            break busca; // Ou usar return se método permite
        }
    }
}
```

### ❌ Anti-Padrão 2: Múltiplos Break no Mesmo Loop

**Conceito:** Loop com múltiplos pontos de saída não relacionados.

```java
// ❌ RUIM: Múltiplos break dificulta rastreamento
for (Item item : items) {
    if (item.tipo == TIPO_A) {
        // processar tipo A
        if (item.valor > 100) break;
    }

    if (item.tipo == TIPO_B) {
        // processar tipo B
        if (item.valor < 50) break;
    }

    // Mais lógica
    if (outraCondicao) break;

    processar(item);
}
```

**Por que é ruim:**
- **Fluxo Complexo:** Difícil rastrear todos os caminhos de saída
- **Manutenção:** Mudar lógica pode afetar múltiplos breaks
- **Testabilidade:** Testar todos os caminhos é complexo

**Correção:**
```java
// ✅ BOM: Extrair para método
for (Item item : items) {
    if (deveProcessarItem(item)) {
        processar(item);
    }
}

private boolean deveProcessarItem(Item item) {
    if (item.tipo == TIPO_A && item.valor > 100) return false;
    if (item.tipo == TIPO_B && item.valor < 50) return false;
    if (outraCondicao) return false;
    return true;
}
```

### ❌ Anti-Padrão 3: Continue em Loop While Sem Incremento

**Conceito:** Usar continue em while esquecendo de incrementar variável de controle.

```java
// ❌ RUIM: Loop infinito potencial
int i = 0;
while (i < 10) {
    if (i % 2 == 0) {
        continue; // BUG: i nunca é incrementado quando par!
    }
    System.out.println(i);
    i++;
}
```

**Por que é ruim:**
- **Loop Infinito:** Quando i=0, continue pula incremento, i permanece 0 infinitamente
- **Armadilha Clássica:** Erro muito comum entre iniciantes

**Correção:**
```java
// ✅ BOM: Incrementar ANTES do continue
int i = 0;
while (i < 10) {
    i++; // Incrementar primeiro!
    if (i % 2 == 0) {
        continue;
    }
    System.out.println(i);
}

// ✅ MELHOR: Usar for quando possível
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) continue;
    System.out.println(i);
}
```

### ❌ Anti-Padrão 4: Uso de Break quando Stream é Mais Claro

**Conceito:** Usar loop imperativo com break quando Stream seria mais declarativo.

```java
// ❌ ACEITÁVEL mas não ideal: Imperativo com break
boolean temMaiorDe100 = false;
for (int num : numeros) {
    if (num > 100) {
        temMaiorDe100 = true;
        break;
    }
}

// ✅ MELHOR: Declarativo com Stream
boolean temMaiorDe100 = numeros.stream()
    .anyMatch(num -> num > 100);
```

**Por que Stream é melhor aqui:**
- **Intenção Clara:** `anyMatch` expressa exatamente o que queremos
- **Menos Código:** Sem variável flag, sem loop explícito
- **Declarativo:** Diz "o que" queremos, não "como" buscar

**Nota:** Isso não significa que Streams sempre são melhores. Para loops simples, imperativo pode ser mais legível e performático.

### ❌ Anti-Padrão 5: Labels com Nomes Genéricos

**Conceito:** Usar nomes como `loop1`, `loop2`, `externo`, `interno` para labels.

```java
// ❌ RUIM: Labels genéricos
loop1:
for (Pedido pedido : pedidos) {
    loop2:
    for (Item item : pedido.getItens()) {
        if (item.isInvalido()) {
            break loop1; // Quebrando "loop1"? Não é óbvio
        }
    }
}
```

**Por que é ruim:**
- **Falta de Contexto:** Nome não comunica o que o loop faz
- **Manutenibilidade:** Meses depois, não é óbvio o que "loop1" significa

**Correção:**
```java
// ✅ BOM: Labels descritivos
processarPedidos:
for (Pedido pedido : pedidos) {
    validarItens:
    for (Item item : pedido.getItens()) {
        if (item.isInvalido()) {
            break processarPedidos; // Claro: para de processar pedidos
        }
    }
}
```

---

## 🎯 Diretrizes Práticas

### Quando Usar Break

✅ **USE break quando:**

1. **Busca:** Encontrou elemento procurado, não precisa continuar
2. **Validação All:** Primeiro elemento que falha invalida todos
3. **Loop com Condição de Saída Complexa:** Mais claro que tentar expressar tudo na condição do loop
4. **Performance:** Evitar iterações desnecessárias é importante
5. **Switch:** Prevenir fall-through (caso clássico)

❌ **NÃO use break quando:**

1. **Método Pode Usar Return:** Se loop é a lógica principal do método, return é mais direto
2. **Flag Seria Mais Clara:** Se razão da saída precisa ser conhecida depois, flag preserva contexto
3. **Stream É Mais Declarativo:** Para operações simples de busca/filtro, Stream pode ser mais claro
4. **Loop Está Muito Complexo:** Múltiplos breaks podem indicar que loop deveria ser refatorado

### Quando Usar Continue

✅ **USE continue quando:**

1. **Guard Clauses:** Validar elementos no início e pular inválidos
2. **Filtrar Durante Iteração:** Processar apenas elementos que atendem critérios
3. **Pular Valores Especiais:** Zeros em cálculos, nulls em processamento, etc
4. **Reduzir Aninhamento:** Continue no topo é mais legível que if aninhado envolvendo todo o corpo

❌ **NÃO use continue quando:**

1. **If Simples é Mais Claro:** Para condição única e simples, `if (condicao) { processar(); }` pode ser mais óbvio
2. **Stream Filter É Aplicável:** Para filtragem simples, `stream().filter()` é mais declarativo
3. **While Sem Cuidado com Incremento:** Em while, risco de loop infinito se esquecer incremento antes do continue
4. **Lógica Invertida Confunde:** Se `if (!condicaoComplexa)` fica confuso, considere if positivo ao invés

### Quando Usar Labels

✅ **USE labels quando:**

1. **Aninhamento Profundo (3+ níveis):** Labels são mais claros que flags múltiplas
2. **Break/Continue para Loop Específico:** Quando precisa afetar loop externo de dentro do interno
3. **Alternativas São Mais Complexas:** Se extrair para método ou usar flags complica mais

❌ **NÃO use labels quando:**

1. **Aninhamento Raso (2 níveis):** Flags simples ou método auxiliar podem ser mais claros
2. **Nome Não É Descritivo:** Se não consegue nome bom para label, pode ser sinal de que lógica está confusa
3. **Stream/Programação Funcional Aplica-Se:** FlatMap e operações de Stream eliminam necessidade de loops aninhados

### Quando Usar Return em Loop

✅ **USE return quando:**

1. **Loop É Propósito do Método:** Método de busca, validação, ou computação focada
2. **Encontrar = Missão Cumprida:** Assim que resultado é determinado, método está completo
3. **Elimina Variável Intermediária:** Return direto é mais limpo que armazenar e retornar depois
4. **Early Return Pattern:** Retornar cedo simplifica lógica

❌ **NÃO use return quando:**

1. **Há Lógica Importante Após Loop:** Limpeza, logging, métricas que devem ocorrer
2. **Múltiplos Resultados:** Método precisa coletar vários elementos, não apenas primeiro
3. **Side Effects Complexos:** Se return ocorre após modificações de estado, pode ser confuso

---

## 🧪 Exemplos de Refatoração

### Refatoração 1: Break para Return

**Antes:**
```java
public Usuario buscarAdmin() {
    Usuario admin = null;

    for (Usuario u : usuarios) {
        if (u.isAdmin()) {
            admin = u;
            break;
        }
    }

    return admin;
}
```

**Depois:**
```java
public Usuario buscarAdmin() {
    for (Usuario u : usuarios) {
        if (u.isAdmin()) {
            return u; // Mais direto
        }
    }
    return null;
}
```

**Ganhos:**
- Elimina variável `admin`
- Mais conciso
- Intenção mais clara

### Refatoração 2: Aninhamento para Continue

**Antes:**
```java
for (Arquivo arquivo : arquivos) {
    if (arquivo != null) {
        if (!arquivo.isVazio()) {
            if (arquivo.getExtensao().equals(".java")) {
                processar(arquivo);
            }
        }
    }
}
```

**Depois:**
```java
for (Arquivo arquivo : arquivos) {
    if (arquivo == null) continue;
    if (arquivo.isVazio()) continue;
    if (!arquivo.getExtensao().equals(".java")) continue;

    processar(arquivo); // Sem aninhamento
}
```

**Ganhos:**
- Reduz aninhamento de 3 níveis para 0
- Validações óbvias no topo
- Código principal fica claro

### Refatoração 3: Múltiplos Break para Método

**Antes:**
```java
for (Transacao t : transacoes) {
    if (t.getValor() > 10000 && t.isSuspeita()) break;
    if (t.getOrigem().isPaisRestrito()) break;
    if (t.getDestinatario().isBloqueado()) break;

    processar(t);
}
```

**Depois:**
```java
for (Transacao t : transacoes) {
    if (deveBloquear(t)) break;
    processar(t);
}

private boolean deveBloquear(Transacao t) {
    if (t.getValor() > 10000 && t.isSuspeita()) return true;
    if (t.getOrigem().isPaisRestrito()) return true;
    if (t.getDestinatario().isBloqueado()) return true;
    return false;
}
```

**Ganhos:**
- Lógica de bloqueio encapsulada
- Método nomeado documenta propósito
- Loop principal mais limpo
- Lógica de bloqueio é testável independentemente

### Refatoração 4: Loop Imperativo para Stream

**Antes:**
```java
List<String> nomesMaiusculos = new ArrayList<>();
for (Usuario u : usuarios) {
    if (u.isAtivo()) {
        nomesMaiusculos.add(u.getNome().toUpperCase());
    }
}
```

**Depois:**
```java
List<String> nomesMaiusculos = usuarios.stream()
    .filter(Usuario::isAtivo)
    .map(u -> u.getNome().toUpperCase())
    .collect(Collectors.toList());
```

**Ganhos:**
- Mais declarativo - diz "o que", não "como"
- Sem gerenciamento manual de lista
- Pipeline de transformação é óbvio

---

## ⚠️ Armadilhas Comuns e Como Evitar

### Armadilha 1: Loop Infinito com Continue

**Problema:**
```java
int i = 0;
while (i < 10) {
    if (condicao) continue; // BUG: i nunca incrementa!
    processar(i);
    i++;
}
```

**Solução:**
```java
int i = 0;
while (i < 10) {
    i++; // Sempre incrementar primeiro
    if (condicao) continue;
    processar(i);
}
```

**Melhor ainda:**
```java
for (int i = 0; i < 10; i++) {
    if (condicao) continue;
    processar(i);
}
```

### Armadilha 2: Esquecer Break em Switch

**Problema:**
```java
switch (tipo) {
    case TIPO_A:
        processar A();
        // Falta break! Fall-through não intencional
    case TIPO_B:
        processarB();
        break;
}
```

**Solução:**
```java
switch (tipo) {
    case TIPO_A:
        processar A();
        break; // Sempre incluir
    case TIPO_B:
        processarB();
        break;
}
```

**Melhor ainda (Java 14+):**
```java
switch (tipo) {
    case TIPO_A -> processarA(); // Sem fall-through
    case TIPO_B -> processarB();
}
```

### Armadilha 3: Break em Loop Errado

**Problema:**
```java
for (Categoria cat : categorias) {
    for (Produto prod : cat.getProdutos()) {
        if (prod.isDescontinuado()) {
            break; // Só quebra loop interno!
        }
    }
}
```

**Solução:**
```java
processarCategorias:
for (Categoria cat : categorias) {
    for (Produto prod : cat.getProdutos()) {
        if (prod.isDescontinuado()) {
            break processarCategorias; // Quebra loop certo
        }
    }
}
```

---

## 🔗 Checklists de Revisão de Código

### Checklist: Revisando Break

- [ ] Break está no loop correto? (Especialmente em loops aninhados)
- [ ] Condição para break é clara e bem justificada?
- [ ] Há código após o loop que precisa executar? (Considere que break pula esse código)
- [ ] Return seria mais apropriado? (Se loop é propósito principal do método)
- [ ] Break está dentro de switch? Se sim, é intencional não ter (fall-through)?
- [ ] Há múltiplos breaks no mesmo loop? (Pode indicar necessidade de refatoração)

### Checklist: Revisando Continue

- [ ] Continue está em loop while? Se sim, variáveis de controle são incrementadas antes?
- [ ] Condição para continue é clara? (Guard clause óbvio vs lógica complexa)
- [ ] Continue melhora ou piora legibilidade? (Compare com if/else alternativo)
- [ ] Há múltiplos continues? Se sim, eles formam padrão coerente de validação?
- [ ] Continue poderia ser substituído por filter() em Stream?

### Checklist: Revisando Labels

- [ ] Label tem nome descritivo? (Não `loop1`, `externo`, etc)
- [ ] Label é realmente necessário? (Não há alternativa mais simples)
- [ ] Há apenas 1-2 labels? (Mais que isso pode indicar complexidade excessiva)
- [ ] Label está sendo usado corretamente? (Break ou continue referenciam o label certo)
- [ ] Código seria mais claro extraindo para método?

---

## 📚 Conclusão

Boas práticas no uso de break e continue não são regras rígidas, mas **diretrizes baseadas em experiência coletiva** da comunidade Java. O objetivo central é sempre **clareza** - código que comunica intenção, que é fácil de entender, manter e modificar.

**Princípios-chave para lembrar:**

1. **Intenção Clara > Tudo:** Se break/continue tornam intenção mais óbvia, use. Se obscurecem, não use.

2. **Contexto Importa:** Não há resposta universal. Avalie cada situação individualmente.

3. **Consistência:** Use padrões consistentes em toda codebase.

4. **Alternativas:** Sempre considere se há forma mais simples - método auxiliar, Stream, refatoração.

5. **Legibilidade Futura:** Código é lido muito mais vezes que escrito. Otimize para o leitor futuro.

**Quando em dúvida:**
- Prefira simplicidade
- Prefira clareza sobre concisão
- Prefira padrões conhecidos
- Peca pelo lado da legibilidade

Dominar boas práticas de break e continue é dominar a arte de equilibrar poder com responsabilidade - usar ferramentas poderosas de forma que melhorem, não compliquem, o código.
