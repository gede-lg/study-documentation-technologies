# Complexidade e Legibilidade

## 🎯 Introdução e Definição

### Definição Conceitual

**Complexidade e legibilidade** em estruturas de controle aninhadas refere-se ao **grau de dificuldade** para **entender**, **manter** e **depurar** código com múltiplos níveis de aninhamento (loops dentro de loops, condicionais dentro de loops, etc.). **Alta complexidade** reduz **legibilidade**, aumenta **erros**, e dificulta **manutenção**. Gerenciar complexidade é essencial para **código sustentável**.

**Estrutura visual - Complexidade BAIXA**:
```java
// Simples: 1 nível
for (int num : numeros) {
    System.out.println(num);
}
```

**Estrutura visual - Complexidade MÉDIA**:
```java
// 2 níveis: ainda legível
for (int i = 0; i < matriz.length; i++) {
    for (int j = 0; j < matriz[i].length; j++) {
        System.out.print(matriz[i][j] + " ");
    }
    System.out.println();
}
```

**Estrutura visual - Complexidade ALTA**:
```java
// 4+ níveis: difícil de seguir
for (int i = 0; i < n; i++) {
    if (condicao1) {
        for (int j = 0; j < m; j++) {
            if (condicao2) {
                for (int k = 0; k < p; k++) {
                    if (condicao3) {
                        // Código aqui: muito aninhado!
                    }
                }
            }
        }
    }
}
```

---

## 📋 Sumário Conceitual

### Níveis de Complexidade

| Níveis | Classificação | Legibilidade | Manutenção |
|--------|---------------|--------------|------------|
| **1** | Trivial | Excelente | Fácil |
| **2** | Simples | Boa | Razoável |
| **3** | Moderada | Aceitável | Requer atenção |
| **4+** | Alta | Ruim | Difícil |

### Métricas de Complexidade

| Métrica | Descrição |
|---------|-----------|
| **Complexidade ciclomática** | Número de caminhos independentes |
| **Profundidade de aninhamento** | Níveis de indentação |
| **Tamanho do método** | Linhas de código |
| **Número de condições** | Expressões booleanas |

---

## 🧠 Fundamentos Teóricos

### 1. Profundidade de Aninhamento

**1 nível (EXCELENTE)**:
```java
// Legibilidade máxima
for (String nome : nomes) {
    System.out.println(nome);
}
```

**2 níveis (BOM)**:
```java
// Ainda claro
for (int i = 0; i < linhas; i++) {
    for (int j = 0; j < colunas; j++) {
        matriz[i][j] = i + j;
    }
}
```

**3 níveis (ACEITÁVEL)**:
```java
// Começa a dificultar
for (int i = 0; i < x; i++) {
    for (int j = 0; j < y; j++) {
        for (int k = 0; k < z; k++) {
            cubo[i][j][k] = i * j * k;
        }
    }
}
```

**4+ níveis (PROBLEMÁTICO)**:
```java
// ❌ Muito complexo
for (int i = 0; i < n; i++) {
    if (condicao1) {
        for (int j = 0; j < m; j++) {
            if (condicao2) {
                for (int k = 0; k < p; k++) {
                    if (condicao3) {
                        // Difícil rastrear contexto
                    }
                }
            }
        }
    }
}
```

### 2. Complexidade Ciclomática

**Definição**: Número de **caminhos independentes** através do código.

**Cálculo simples**: `E - N + 2`
- E = número de arestas no grafo de fluxo
- N = número de nós

**Regra prática**: `1 + número de condições (if, while, for, case, &&, ||, ?:)`

**Exemplo - Baixa complexidade (CC = 2)**:
```java
// CC = 1 (base) + 1 (if) = 2
public void processar(int num) {
    if (num > 0) {
        System.out.println("Positivo");
    } else {
        System.out.println("Não positivo");
    }
}
```

**Exemplo - Média complexidade (CC = 5)**:
```java
// CC = 1 + 4 (if/else if) = 5
public String classificar(int nota) {
    if (nota >= 90) {
        return "A";
    } else if (nota >= 80) {
        return "B";
    } else if (nota >= 70) {
        return "C";
    } else if (nota >= 60) {
        return "D";
    } else {
        return "F";
    }
}
```

**Exemplo - Alta complexidade (CC = 10+)**:
```java
// CC = 1 + 2 (for) + 3 (if) + 1 (&&) + 2 (for) = 9+
public void processar(int[][] matriz) {
    for (int i = 0; i < matriz.length; i++) {
        for (int j = 0; j < matriz[i].length; j++) {
            if (i == j && matriz[i][j] > 0) {
                if (matriz[i][j] % 2 == 0) {
                    for (int k = 0; k < 10; k++) {
                        // ...
                    }
                } else if (matriz[i][j] % 3 == 0) {
                    // ...
                }
            }
        }
    }
}
```

**Interpretação CC**:
- **1-10**: Simples, baixo risco
- **11-20**: Moderado, algum risco
- **21-50**: Alto, risco significativo
- **50+**: Muito alto, não testável

### 3. Tamanho do Método

**Regra de ouro**: Máximo **20-30 linhas** por método.

**Método curto (BOM)**:
```java
// 5 linhas: excelente
public double calcularMedia(int[] numeros) {
    int soma = 0;
    for (int num : numeros) soma += num;
    return (double) soma / numeros.length;
}
```

**Método médio (ACEITÁVEL)**:
```java
// 15-20 linhas: razoável
public List<Produto> filtrarProdutos(List<Produto> produtos, Filtro filtro) {
    List<Produto> resultado = new ArrayList<>();
    
    for (Produto p : produtos) {
        if (filtro.getPrecoMin() != null && p.getPreco() < filtro.getPrecoMin()) {
            continue;
        }
        if (filtro.getPrecoMax() != null && p.getPreco() > filtro.getPrecoMax()) {
            continue;
        }
        if (filtro.getCategoria() != null && !p.getCategoria().equals(filtro.getCategoria())) {
            continue;
        }
        resultado.add(p);
    }
    
    return resultado;
}
```

**Método longo (PROBLEMÁTICO)**:
```java
// ❌ 50+ linhas: difícil manter
public void processarPedido(Pedido pedido) {
    // Validação (10 linhas)
    // Cálculo de valores (15 linhas)
    // Atualização de estoque (10 linhas)
    // Geração de nota fiscal (15 linhas)
    // Envio de email (10 linhas)
    // ...muito código...
}

// ✅ Melhor: extrair métodos
public void processarPedido(Pedido pedido) {
    validar(pedido);
    calcularValores(pedido);
    atualizarEstoque(pedido);
    gerarNotaFiscal(pedido);
    enviarEmail(pedido);
}
```

### 4. Indentação e Níveis Visuais

**Cada nível = +1 indentação** (geralmente 4 espaços):

```java
public void exemplo() {                    // Nível 0
    if (condicao1) {                       // Nível 1
        for (int i = 0; i < 10; i++) {     // Nível 2
            if (condicao2) {               // Nível 3
                while (condicao3) {        // Nível 4
                    // Nível 5: muito profundo!
                }
            }
        }
    }
}
```

**Limite recomendado**: **3-4 níveis** máximo.

**Problemas com muitos níveis**:
- Dificulta rastreamento de escopo
- Aumenta chance de erros (esquecer `}`)
- Reduz espaço horizontal (linhas muito longas)
- Dificulta leitura em telas pequenas

### 5. Condições Complexas

**Simples (BOM)**:
```java
if (idade >= 18) {
    // ...
}
```

**Composta (ACEITÁVEL)**:
```java
if (idade >= 18 && idade < 65) {
    // ...
}
```

**Complexa (RUIM)**:
```java
// ❌ Difícil entender
if ((idade >= 18 && idade < 65 && ativo) || 
    (idade >= 65 && aposentado && contribuindo) ||
    (especial && aprovado)) {
    // ...
}

// ✅ Melhor: extrair para variáveis/métodos
boolean adultoAtivo = idade >= 18 && idade < 65 && ativo;
boolean aposentadoContribuinte = idade >= 65 && aposentado && contribuindo;
boolean casoEspecial = especial && aprovado;

if (adultoAtivo || aposentadoContribuinte || casoEspecial) {
    // Muito mais claro
}

// ✅ Ainda melhor: método
if (isElegivelParaBeneficio(idade, ativo, aposentado, contribuindo, especial, aprovado)) {
    // ...
}
```

### 6. Número de Variáveis Locais

**Poucos (BOM)**:
```java
public void calcular(int a, int b) {
    int soma = a + b;
    System.out.println(soma);
}
```

**Muitos (PROBLEMÁTICO)**:
```java
// ❌ 10+ variáveis: difícil rastrear
public void processar() {
    int a, b, c, d, e, f, g, h, i, j;
    double x, y, z, w;
    String s1, s2, s3;
    // ...muito código usando todas...
}

// ✅ Melhor: agrupar em objetos
public void processar() {
    Coordenadas coords = new Coordenadas(x, y, z, w);
    Valores valores = new Valores(a, b, c, d, e, f, g, h, i, j);
    Strings strings = new Strings(s1, s2, s3);
}
```

### 7. Acoplamento e Coesão

**Alta coesão (BOM)**:
```java
// Método faz UMA coisa bem
public double calcularDesconto(double valor, double percentual) {
    return valor * (percentual / 100);
}
```

**Baixa coesão (RUIM)**:
```java
// ❌ Faz MUITAS coisas
public void processarTudo(Pedido pedido) {
    validarPedido(pedido);        // Validação
    calcularTotal(pedido);        // Cálculo
    atualizarEstoque(pedido);     // Estoque
    enviarEmail(pedido);          // Notificação
    gerarRelatorio(pedido);       // Relatório
    // Deveria ser dividido!
}
```

### 8. Comentários e Documentação

**Sem comentários (RUIM se complexo)**:
```java
// ❌ Código complexo sem explicação
for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
        if (arr[j] < arr[i]) {
            int t = arr[i];
            arr[i] = arr[j];
            arr[j] = t;
        }
    }
}
```

**Com comentários (MELHOR)**:
```java
// ✅ Explica intenção
// Bubble sort: ordena array em ordem crescente
for (int i = 0; i < n; i++) {
    // Compara com elementos seguintes
    for (int j = i + 1; j < n; j++) {
        // Troca se estiver fora de ordem
        if (arr[j] < arr[i]) {
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
}
```

**Código auto-explicativo (IDEAL)**:
```java
// ✅ Nomes claros dispensam comentários
public void ordenarArrayCrescente(int[] array) {
    int tamanho = array.length;
    
    for (int posicaoAtual = 0; posicaoAtual < tamanho; posicaoAtual++) {
        for (int proxima = posicaoAtual + 1; proxima < tamanho; proxima++) {
            if (array[proxima] < array[posicaoAtual]) {
                trocar(array, posicaoAtual, proxima);
            }
        }
    }
}

private void trocar(int[] array, int i, int j) {
    int temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}
```

### 9. Padrão Arrowhead (Anti-padrão)

**Arrowhead Code (❌ RUIM)**:
```java
// Padrão de "ponta de seta" (>>>>>>)
public void processar(Pedido pedido) {
    if (pedido != null) {
        if (pedido.isValido()) {
            if (pedido.getItens() != null) {
                if (pedido.getItens().size() > 0) {
                    for (Item item : pedido.getItens()) {
                        if (item.getQuantidade() > 0) {
                            // Código muito aninhado!
                        }
                    }
                }
            }
        }
    }
}
```

**Guard Clauses (✅ BOM)**:
```java
// Validações antecipadas, retorno cedo
public void processar(Pedido pedido) {
    if (pedido == null) return;
    if (!pedido.isValido()) return;
    if (pedido.getItens() == null || pedido.getItens().isEmpty()) return;
    
    for (Item item : pedido.getItens()) {
        if (item.getQuantidade() <= 0) continue;
        
        // Código principal: menos aninhado
        processarItem(item);
    }
}
```

### 10. Exemplo Completo: Refatoração

**ANTES (Complexidade Alta)**:
```java
// ❌ CC ~15, 4 níveis, 40+ linhas
public void processarVendas(List<Venda> vendas) {
    if (vendas != null && vendas.size() > 0) {
        for (Venda venda : vendas) {
            if (venda.getStatus().equals("PENDENTE")) {
                double total = 0;
                for (Item item : venda.getItens()) {
                    if (item.getQuantidade() > 0 && item.getPreco() > 0) {
                        total += item.getQuantidade() * item.getPreco();
                    }
                }
                if (total > 100) {
                    double desconto = total * 0.10;
                    total -= desconto;
                }
                venda.setTotal(total);
                if (total > 0) {
                    venda.setStatus("PROCESSADA");
                    atualizarEstoque(venda);
                    enviarEmail(venda);
                } else {
                    venda.setStatus("CANCELADA");
                }
            }
        }
    }
}
```

**DEPOIS (Complexidade Baixa)**:
```java
// ✅ CC ~3 por método, 2 níveis, 5-10 linhas cada
public void processarVendas(List<Venda> vendas) {
    if (vendas == null || vendas.isEmpty()) return;
    
    vendas.stream()
          .filter(this::isPendente)
          .forEach(this::processarVenda);
}

private boolean isPendente(Venda venda) {
    return "PENDENTE".equals(venda.getStatus());
}

private void processarVenda(Venda venda) {
    double total = calcularTotal(venda);
    total = aplicarDesconto(total);
    venda.setTotal(total);
    
    if (total > 0) {
        finalizarVenda(venda);
    } else {
        cancelarVenda(venda);
    }
}

private double calcularTotal(Venda venda) {
    return venda.getItens().stream()
                .filter(this::isValido)
                .mapToDouble(item -> item.getQuantidade() * item.getPreco())
                .sum();
}

private boolean isValido(Item item) {
    return item.getQuantidade() > 0 && item.getPreco() > 0;
}

private double aplicarDesconto(double total) {
    return total > 100 ? total * 0.90 : total;
}

private void finalizarVenda(Venda venda) {
    venda.setStatus("PROCESSADA");
    atualizarEstoque(venda);
    enviarEmail(venda);
}

private void cancelarVenda(Venda venda) {
    venda.setStatus("CANCELADA");
}
```

---

## 🎯 Aplicabilidade e Contextos

### Cenário 1: Code Review

**Checklist**:
- Profundidade < 4 níveis?
- CC < 10 por método?
- Método < 30 linhas?
- Nomes descritivos?
- Guard clauses usadas?
- Comentários onde necessário?

### Cenário 2: Refatoração Prioritária

**Critérios para refatorar**:
1. CC > 15
2. Profundidade > 4
3. Método > 50 linhas
4. Muitos comentários "explicativos"
5. Dificuldade em testar

### Cenário 3: Métricas em CI/CD

**SonarQube, PMD, Checkstyle**:
- Limite CC: 10
- Profundidade: 3
- Tamanho método: 30
- Bloqueio em violações críticas

---

## ⚠️ Armadilhas Comuns

### 1. **Otimização Prematura**

```java
// ❌ Complexo demais para ganho mínimo
// (micro-otimização)
```

### 2. **Comentários em Vez de Refatoração**

```java
// ❌ Comentário longo explicando código complexo
// ✅ Refatore para código auto-explicativo
```

### 3. **Método Deus**

```java
// ❌ Um método faz TUDO (500+ linhas)
// ✅ Divida em métodos menores, coesos
```

---

## 🚀 Boas Práticas

### 1. ✅ Limite Profundidade (Máx 3-4)

```java
// Use guard clauses, early returns
```

### 2. ✅ Mantenha CC Baixo (< 10)

```java
// Extraia condições complexas para métodos
```

### 3. ✅ Métodos Pequenos (< 30 linhas)

```java
// Um método, uma responsabilidade
```

### 4. ✅ Nomes Descritivos

```java
// calcularDescontoProgressivo() vs calc()
```

### 5. ✅ Guard Clauses

```java
// Valide cedo, retorne cedo
if (invalido) return;
```

### 6. ✅ Extraia Métodos

```java
// Substitua loops/condições complexas por chamadas de método
```

### 7. ✅ Use Streams (Java 8+)

```java
// Reduz aninhamento em coleções
lista.stream().filter(...).map(...).collect(...);
```

### 8. ✅ Evite else Após return

```java
if (condicao) return;
// Não precisa de else
processar();
```

### 9. ✅ Comentários para "Por quê", Não "O quê"

```java
// ✅ "Usa SHA-256 por requisito de segurança"
// ❌ "Calcula hash" (óbvio)
```

### 10. ✅ Ferramentas de Análise

```java
// SonarQube, PMD, Checkstyle, SpotBugs
```

---

## 📚 Resumo

**Complexidade** mede **dificuldade** de entender/manter código. **Profundidade**: Limite **3-4 níveis** de aninhamento. **Complexidade ciclomática (CC)**: Número de caminhos; ideal **< 10**. **Tamanho método**: Máximo **20-30 linhas**. **Sinais de alta complexidade**: 4+ níveis, CC > 15, 50+ linhas, muitos comentários "explicativos", difícil testar. **Técnicas de redução**: **Guard clauses** (validação antecipada), **early return**, **extrair métodos**, **nomes descritivos**, **streams** (Java 8+), evitar **arrowhead code** (>>>). **Métricas**: CC, profundidade, linhas, número de condições. **Ferramentas**: SonarQube, PMD, Checkstyle. **Regra de ouro**: Se difícil explicar em 1 frase, **refatore**.
