# Continue: Pular para Próxima Iteração no TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

O **continue** é uma declaração (statement) de controle de fluxo que **pula o restante da iteração atual** de um loop e avança imediatamente para a **próxima iteração**. Conceitualmente, trata-se de um mecanismo de **pulo condicional** que permite ignorar o processamento do elemento atual sem encerrar o loop inteiro.

Na essência, continue representa o conceito de "**pule este, vá para o próximo**". Diferente de `break` que termina o loop completamente, `continue` apenas interrompe a iteração corrente, permitindo que o loop prossiga com os elementos subsequentes. É a ferramenta ideal para expressar lógicas de "filtro inline" onde certos elementos devem ser ignorados durante processamento.

### Contexto Histórico e Motivação

A declaração `continue` tem origem similar ao `break`, aparecendo nas linguagens de programação estruturadas dos anos 1960-70 (ALGOL, C). Sua motivação foi fornecer uma forma de **pular iterações condicionalmente** sem a necessidade de estruturas condicionais aninhadas complexas.

**Problema que continue resolve historicamente:**

Antes do continue, para pular processamento de certos elementos, era necessário envolver todo o código restante em um `if`:

```typescript
// Sem continue - aninhamento profundo
for (let i = 0; i < itens.length; i++) {
  if (condicaoParaProcessar(itens[i])) {
    // Todo processamento aninhado aqui
    passo1(itens[i]);
    passo2(itens[i]);
    passo3(itens[i]);
    // Aninhamento aumenta complexidade cognitiva
  }
}

// Com continue - código mais plano
for (let i = 0; i < itens.length; i++) {
  if (!condicaoParaProcessar(itens[i])) {
    continue; // Guard clause - sai cedo
  }

  // Código principal no nível superior
  passo1(itens[i]);
  passo2(itens[i]);
  passo3(itens[i]);
}
```

**Evolução conceitual:**

1. **Era Pré-Continue:** Aninhamento de ifs para pular elementos
2. **Introdução do Continue:** Permitiu guard clauses e código mais plano
3. **Prática Moderna:** Continue é aceito como forma legítima de expressar "pular este caso"

**Debate:** Assim como break, continue foi questionado por puristas da programação estruturada. No entanto, é amplamente aceito que continue, usado apropriadamente, melhora legibilidade ao evitar aninhamento excessivo.

### Problema Fundamental que Resolve

Continue resolve problemas específicos de filtragem e processamento condicional em loops:

**1. Filtragem Inline:** Processar apenas elementos que satisfazem critério:

```typescript
for (const numero of numeros) {
  if (numero < 0) {
    continue; // Pula números negativos
  }
  console.log(numero); // Apenas positivos são impressos
}
```

**2. Evitar Aninhamento Profundo (Guard Clauses):** Testar condições de exclusão cedo:

```typescript
for (const usuario of usuarios) {
  if (!usuario.ativo) continue;     // Guard 1
  if (!usuario.emailVerificado) continue; // Guard 2
  if (usuario.suspenso) continue;   // Guard 3

  // Código principal não aninhado
  enviarNotificacao(usuario);
}
```

**3. Pular Casos Especiais:** Ignorar elementos que requerem tratamento diferente:

```typescript
for (const item of itens) {
  if (item.tipo === "especial") {
    continue; // Especiais são processados separadamente
  }

  processamentoNormal(item);
}
```

**4. Performance - Evitar Processamento Desnecessário:** Pular cálculos pesados para casos triviais:

```typescript
for (const dado of dados) {
  if (dado.vazio) {
    continue; // Não processa dados vazios
  }

  // Processamento pesado apenas para dados relevantes
  analiseComplexa(dado);
}
```

### Importância no Ecossistema

Continue é uma ferramenta útil mas **menos crítica** que break:

- **Legibilidade:** Reduz aninhamento, torna código mais plano e legível
- **Guard Clauses:** Padrão moderno de verificar condições de exclusão cedo
- **Filtragem:** Alternativa a filter() quando mutação ou side effects são necessários
- **Performance:** Evita processamento desnecessário pulando casos
- **Expressividade:** Torna explícito "este caso não me interessa, próximo"

**Uso com moderação:** Continue é útil, mas uso excessivo (muitos continues em um loop) pode indicar que lógica deveria ser refatorada, possivelmente usando filter() ou extraindo função.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Pulo de Iteração:** Continue pula restante da iteração atual, não o loop inteiro
2. **Avança para Próxima:** Após continue, loop avança para próximo elemento/iteração
3. **Incremento Ainda Acontece:** Em for loops, incremento (i++) executa normalmente
4. **Não Encerra Loop:** Diferente de break, continue não termina o loop
5. **Guard Clause Pattern:** Usado para verificar condições de exclusão cedo

### Pilares Fundamentais

- **Pulo Condicional:** Ignorar iteração atual baseado em condição
- **Código Mais Plano:** Evita aninhamento de ifs
- **Filtragem Inline:** Processar apenas elementos desejados
- **Early Return do Loop:** Similar a return em funções, mas para iterações
- **Preserva Fluxo do Loop:** Loop continua, apenas iteração atual é pulada

### Visão Geral das Nuances

- **Continue vs Break:** Pular iteração vs terminar loop
- **Continue em For:** Incremento (i++) executa antes de próxima iteração
- **Continue em While:** Volta para condição imediatamente
- **Continue com Labels:** Pular para próxima iteração de loop externo
- **Impossível em forEach:** Array.forEach não suporta continue

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Continue causa um salto para o **final do corpo do loop**, fazendo com que a próxima iteração comece.

#### Anatomia da Sintaxe

```typescript
continue;           // Sintaxe básica
continue labelName; // Com label (loops aninhados)
```

**Componentes:**

1. **`continue`:** Keyword que causa o pulo
2. **`;`:** Ponto-e-vírgula terminador
3. **`labelName`:** (Opcional) Nome do label do loop externo

#### Fluxo de Execução com Continue

```typescript
for (let i = 0; i < 5; i++) {
  if (i === 2) {
    continue; // Pula quando i é 2
  }
  console.log(i);
}
```

**Sequência de execução:**

1. i=0: não é 2, imprime 0, i++ → i=1
2. i=1: não é 2, imprime 1, i++ → i=2
3. i=2: **é 2, continue executa**
   - Pula `console.log(2)` (não imprime)
   - **i++ ainda executa** → i=3
   - Condição `i < 5` é testada novamente
4. i=3: não é 2, imprime 3, i++ → i=4
5. i=4: não é 2, imprime 4, i++ → i=5
6. i=5: condição `5 < 5` é false, loop termina

**Saída:**

```
0
1
3
4
```

**Observação crítica:** `2` não foi impresso, mas i++ aconteceu (i foi de 2 para 3).

#### Continue em Diferentes Tipos de Loop

**For Loop:**

```typescript
for (let i = 0; i < 5; i++) {
  if (i % 2 === 0) continue; // Pula pares
  console.log(i); // 1, 3
}
// Incremento (i++) executa ANTES de testar condição novamente
```

**While Loop:**

```typescript
let i = 0;
while (i < 5) {
  i++; // IMPORTANTE: incremento deve vir ANTES de continue
  if (i % 2 === 0) continue;
  console.log(i); // 1, 3, 5
}
```

**Armadilha em while:** Se incremento vem **depois** de continue, pode criar loop infinito:

```typescript
// ❌ LOOP INFINITO
let i = 0;
while (i < 5) {
  if (i % 2 === 0) continue; // Pula para condição
  console.log(i);
  i++; // Nunca executa para i=0, loop infinito!
}

// ✅ Correto
let i = 0;
while (i < 5) {
  i++; // Incremento ANTES de continue
  if (i % 2 === 0) continue;
  console.log(i);
}
```

**For...of:**

```typescript
for (const num of [0, 1, 2, 3, 4]) {
  if (num % 2 === 0) continue;
  console.log(num); // 1, 3
}
// Próximo elemento é automaticamente obtido
```

#### Equivalência: Continue vs If

Continue pode ser substituído por if, mas com mais aninhamento:

```typescript
// Com continue - código plano
for (const item of itens) {
  if (item.invalido) continue;
  if (item.processado) continue;

  processar(item);
  salvar(item);
}

// Sem continue - aninhamento
for (const item of itens) {
  if (!item.invalido) {
    if (!item.processado) {
      processar(item);
      salvar(item);
    }
  }
}

// Ou com condição combinada
for (const item of itens) {
  if (!item.invalido && !item.processado) {
    processar(item);
    salvar(item);
  }
}
```

**Análise:** Continue permite **guard clauses** que tornam código mais linear e legível.

### Princípios e Conceitos Subjacentes

#### 1. Guard Clause Pattern

Continue implementa padrão de **guard clauses** - verificar condições de exclusão cedo:

```typescript
for (const pedido of pedidos) {
  // Guards - verificam razões para NÃO processar
  if (pedido.cancelado) continue;
  if (pedido.jaProcessado) continue;
  if (!pedido.pagamentoConfirmado) continue;

  // Caminho feliz - não aninhado
  processarPedido(pedido);
  enviarConfirmacao(pedido);
  atualizarEstoque(pedido);
}
```

**Benefícios:**

- **Legibilidade:** Código principal não está aninhado
- **Manutenibilidade:** Fácil adicionar/remover guards
- **Clareza:** Cada guard expressa claramente uma razão para pular

#### 2. Filtragem com Side Effects

Continue é útil quando filter() não serve porque há side effects:

```typescript
// filter() retorna novo array, não permite side effects
const processados = itens.filter(item => item.valido);
processados.forEach(item => processar(item));

// Continue permite side effects durante filtragem
for (const item of itens) {
  if (!item.valido) continue; // Filtragem

  // Side effects inline
  incrementarContador();
  logarEvento(item);
  processar(item);
}
```

**Conceito:** Continue combina filtragem com processamento em um loop.

#### 3. Early Continue (Fail Fast)

Princípio de **fail fast**: detectar casos especiais cedo e pular:

```typescript
for (const arquivo of arquivos) {
  // Fail fast - casos triviais primeiro
  if (arquivo.tamanho === 0) continue;      // Vazio
  if (!arquivo.temPermissao) continue;      // Sem permissão
  if (arquivo.corrompido) continue;         // Corrompido

  // Processamento complexo apenas para casos válidos
  analisarConteudo(arquivo);
  processarDados(arquivo);
}
```

**Benefício:** Evita processamento caro para casos que podem ser descartados trivialmente.

#### 4. Redução de Complexidade Ciclomática

Continue pode reduzir complexidade ciclomática eliminando níveis de aninhamento:

```typescript
// Complexidade ciclomática = 4 (3 ifs aninhados + 1 for)
for (const x of lista) {
  if (condicao1) {
    if (condicao2) {
      if (condicao3) {
        processar(x);
      }
    }
  }
}

// Complexidade ciclomática = 4, mas mais linear
for (const x of lista) {
  if (!condicao1) continue;
  if (!condicao2) continue;
  if (!condicao3) continue;
  processar(x);
}
```

**Análise:** Embora complexidade seja a mesma, versão com continue é mais legível.

### Relação com Outros Conceitos da Linguagem

#### Continue vs Break

```typescript
// Break - TERMINA o loop inteiro
for (const num of [1, 2, 3, 4, 5]) {
  if (num === 3) break;
  console.log(num); // 1, 2
}

// Continue - PULA iteração atual
for (const num of [1, 2, 3, 4, 5]) {
  if (num === 3) continue;
  console.log(num); // 1, 2, 4, 5
}
```

**Diferença fundamental:**

- **break:** "Pare o loop agora"
- **continue:** "Pule este elemento, continue com próximo"

#### Continue vs Filter

```typescript
// Com filter - retorna novo array
const validos = itens.filter(item => item.valido);
for (const item of validos) {
  processar(item);
}

// Com continue - processa inline
for (const item of itens) {
  if (!item.valido) continue;
  processar(item);
}
```

**Quando usar cada:**

- **filter():** Quando quer novo array ou composição funcional
- **continue:** Quando processamento tem side effects ou mutação

#### Continue com Labels

Permite pular para próxima iteração de loop externo:

```typescript
externo: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) {
      continue externo; // Pula para próximo i (não próximo j)
    }
    console.log(`i=${i}, j=${j}`);
  }
}

// Saída:
// i=0, j=0
// i=1, j=0
// i=2, j=0
```

**Análise:** Cada vez que j=1, pula para próximo valor de i (saltando j=2).

### Modelo Mental para Compreensão

#### Modelo do "Filtro na Esteira"

Imagine uma esteira rolante com itens:

```
Item 1 → [FILTRO] → ✓ Processa
Item 2 → [FILTRO] → ✓ Processa
Item 3 → [FILTRO] → ✗ Continue (descarta, próximo item)
Item 4 → [FILTRO] → ✓ Processa
```

**Continue** é o filtro que descarta itens, mas a esteira continua rolando.

#### Modelo "Pular a Música"

```typescript
// Playlist
for (const musica of playlist) {
  if (!gostoDaMusica(musica)) {
    continue; // Pula para próxima
  }
  tocar(musica);
}
```

**Conceito:** Assim como pular música no player não para a playlist, continue não para o loop.

---

## 🔍 Análise Conceitual Profunda

### Sintaxe e Padrões Comuns

#### Forma Básica: Filtragem

```typescript
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

for (const num of numeros) {
  if (num % 2 === 0) {
    continue; // Pula números pares
  }
  console.log(num); // Apenas ímpares: 1, 3, 5, 7, 9
}
```

#### Guard Clauses Múltiplas

```typescript
for (const usuario of usuarios) {
  // Múltiplos guards
  if (!usuario.ativo) continue;
  if (usuario.banido) continue;
  if (usuario.emailInvalido) continue;

  // Código principal não aninhado
  enviarEmail(usuario);
}
```

**Vantagem:** Cada guard é independente e auto-explicativo.

#### Combinação com Lógica

```typescript
for (let i = 0; i < 100; i++) {
  // Pula múltiplos de 3 E 5 (mas não 15)
  if (i % 3 === 0 && i % 5 === 0) {
    continue;
  }

  // Processa números que NÃO são múltiplos de ambos
  console.log(i);
}
```

#### Processamento com Contador

```typescript
let processados = 0;

for (const item of itens) {
  if (item.ignorar) continue; // Não conta ignorados

  processar(item);
  processados++; // Só incrementa se processou
}

console.log(`Total processados: ${processados}`);
```

### Padrões Avançados

#### Padrão 1: Validação Multi-Nível

```typescript
for (const documento of documentos) {
  // Validações em cascata
  if (!documento.completo) {
    logarErro("Documento incompleto");
    continue;
  }

  if (!documento.assinado) {
    logarAviso("Documento não assinado");
    continue;
  }

  if (!documento.validado) {
    logarInfo("Documento não validado");
    continue;
  }

  // Apenas documentos completos, assinados E validados chegam aqui
  processarDocumento(documento);
}
```

#### Padrão 2: Processamento com Logging

```typescript
for (const tarefa of tarefas) {
  if (tarefa.concluida) {
    console.log(`Pulando tarefa já concluída: ${tarefa.nome}`);
    continue;
  }

  console.log(`Processando: ${tarefa.nome}`);
  executarTarefa(tarefa);
  tarefasConcluidas++;
}
```

#### Padrão 3: Otimização de Performance

```typescript
for (const item of grandeColecao) {
  // Pula casos triviais rapidamente
  if (item.cache && item.cache.valido) {
    continue; // Usa cache, não recalcula
  }

  // Cálculo pesado apenas quando necessário
  const resultado = calcularResultadoComplexo(item);
  item.cache = { resultado, valido: true };
}
```

### TypeScript Type Safety com Continue

TypeScript rastreia controle de fluxo com continue:

```typescript
type Item = { tipo: "A" | "B"; valor: number };

const itens: Item[] = [
  { tipo: "A", valor: 10 },
  { tipo: "B", valor: 20 },
  { tipo: "A", valor: 30 }
];

for (const item of itens) {
  if (item.tipo !== "A") continue; // Type guard

  // TypeScript sabe que item.tipo é "A" aqui (type narrowing)
  console.log(item.valor); // 10, 30
}
```

**Benefício:** Type narrowing funciona com continue, refinando tipos após guard.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Continue

**Regra geral:** Use continue para **guard clauses** e **filtragem inline com side effects**.

### Cenários Ideais

#### 1. Guard Clauses (Preferido)

```typescript
for (const pedido of pedidos) {
  if (pedido.cancelado) continue;
  if (!pedido.pago) continue;

  processar(pedido);
}
```

#### 2. Filtragem com Side Effects

```typescript
for (const item of itens) {
  if (!item.valido) continue;

  // Side effects que filter() não permite
  incrementarContador();
  logarProcessamento(item);
  processar(item);
}
```

#### 3. Pular Casos Especiais

```typescript
for (const arquivo of arquivos) {
  if (arquivo.extensao === ".tmp") continue;

  processarArquivo(arquivo);
}
```

### Quando Evitar Continue

#### 1. Quando Filter() É Mais Claro

```typescript
// ❌ Verboso com continue
const resultado: number[] = [];
for (const num of numeros) {
  if (num < 0) continue;
  resultado.push(num);
}

// ✅ Mais expressivo com filter
const resultado = numeros.filter(num => num >= 0);
```

#### 2. Quando Lógica Positiva É Mais Clara

```typescript
// ❌ Confuso - lógica negativa
for (const item of itens) {
  if (!(item.ativo && item.valido)) continue;
  processar(item);
}

// ✅ Mais claro - lógica positiva
for (const item of itens) {
  if (item.ativo && item.valido) {
    processar(item);
  }
}
```

---

## ⚠️ Limitações e Considerações

### Restrições

#### 1. Não Funciona com forEach

```typescript
// ❌ Erro de sintaxe
[1, 2, 3].forEach(num => {
  if (num === 2) continue; // SyntaxError
});

// ✅ Use for...of
for (const num of [1, 2, 3]) {
  if (num === 2) continue;
}

// ✅ Ou return dentro de forEach (pula callback)
[1, 2, 3].forEach(num => {
  if (num === 2) return; // Retorna da callback, não do forEach
  console.log(num);
});
```

#### 2. Cuidado em While Loops

```typescript
// ❌ Loop infinito se incremento vem depois
let i = 0;
while (i < 10) {
  if (i === 5) continue; // Pula incremento, i sempre 5
  i++;
}

// ✅ Incremento antes de continue
let i = 0;
while (i < 10) {
  i++;
  if (i === 5) continue;
  console.log(i);
}
```

### Armadilhas Comuns

#### Armadilha 1: Muitos Continues

```typescript
// ❌ Confuso - muitos continues
for (const item of itens) {
  if (condicao1) continue;
  if (condicao2) continue;
  if (condicao3) continue;
  if (condicao4) continue;
  if (condicao5) continue;
  processar(item);
}

// ✅ Considere refatorar
for (const item of itens) {
  if (deveProcessar(item)) {
    processar(item);
  }
}
```

#### Armadilha 2: Lógica Negativa Complexa

```typescript
// ❌ Difícil de entender
for (const x of lista) {
  if (!(a && b || c && !d)) continue;
  processar(x);
}

// ✅ Extrair para função
for (const x of lista) {
  if (!deveProcessar(x)) continue;
  processar(x);
}
```

---

## 📚 Conclusão

Continue é uma ferramenta valiosa para escrever loops mais legíveis através de guard clauses e filtragem inline. É especialmente útil para:

- **Guard clauses** que tornam código mais plano
- **Filtragem com side effects** onde filter() não serve
- **Pular casos especiais** claramente identificados
- **Reduzir aninhamento** de condicionais

Usado com moderação e clareza, continue torna loops mais expressivos e fáceis de manter. Dominar continue é entender quando "pular este caso" é mais claro que envolver código em condicionais ou usar métodos funcionais.
