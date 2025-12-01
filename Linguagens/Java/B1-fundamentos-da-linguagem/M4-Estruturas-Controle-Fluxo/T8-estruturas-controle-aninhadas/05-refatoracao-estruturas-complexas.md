# Refatoração de Estruturas Complexas

## 🎯 Introdução e Definição

### Definição Conceitual

**Refatoração** é o processo de **reestruturar código existente** sem alterar seu **comportamento externo**, com objetivo de **melhorar legibilidade**, **reduzir complexidade**, **facilitar manutenção**, e **aumentar testabilidade**. Para estruturas de controle aninhadas, refatoração envolve **extrair métodos**, **eliminar aninhamento excessivo**, **simplificar condições**, e aplicar **padrões de design** para código mais limpo e sustentável.

**Antes da refatoração**:
```java
// ❌ Complexo: 4 níveis, difícil entender
public void processar(List<Pedido> pedidos) {
    if (pedidos != null && !pedidos.isEmpty()) {
        for (Pedido pedido : pedidos) {
            if (pedido.getStatus().equals("PENDENTE")) {
                for (Item item : pedido.getItens()) {
                    if (item.getQuantidade() > 0) {
                        // Lógica complexa aqui
                    }
                }
            }
        }
    }
}
```

**Depois da refatoração**:
```java
// ✅ Simples: 2 níveis, claro
public void processar(List<Pedido> pedidos) {
    if (pedidos == null || pedidos.isEmpty()) return;
    
    pedidos.stream()
           .filter(this::isPendente)
           .forEach(this::processarPedido);
}

private boolean isPendente(Pedido pedido) {
    return "PENDENTE".equals(pedido.getStatus());
}

private void processarPedido(Pedido pedido) {
    pedido.getItens().stream()
          .filter(item -> item.getQuantidade() > 0)
          .forEach(this::processarItem);
}
```

---

## 📋 Sumário Conceitual

### Técnicas de Refatoração

| Técnica | Antes | Depois |
|---------|-------|--------|
| **Extract Method** | Código longo em um método | Métodos pequenos, coesos |
| **Guard Clauses** | if-else aninhados | Validação antecipada + return |
| **Replace Nested Conditional** | if dentro de if | Condições combinadas ou métodos |
| **Decompose Conditional** | Condição complexa | Variáveis/métodos descritivos |
| **Replace Loop with Stream** | for/while tradicional | Stream API (Java 8+) |
| **Introduce Parameter Object** | Muitos parâmetros | Objeto encapsulador |

---

## 🧠 Fundamentos Teóricos

### 1. Extract Method (Extrair Método)

**Antes**:
```java
// ❌ Método longo fazendo múltiplas coisas
public void processarVenda(Venda venda) {
    // Validação (5 linhas)
    if (venda == null) {
        throw new IllegalArgumentException("Venda nula");
    }
    if (venda.getItens() == null || venda.getItens().isEmpty()) {
        throw new IllegalArgumentException("Sem itens");
    }
    
    // Cálculo de total (10 linhas)
    double total = 0;
    for (Item item : venda.getItens()) {
        double subtotal = item.getQuantidade() * item.getPreco();
        if (item.temDesconto()) {
            subtotal -= item.getDesconto();
        }
        total += subtotal;
    }
    
    // Aplicar desconto geral (5 linhas)
    if (total > 1000) {
        total *= 0.90;
    } else if (total > 500) {
        total *= 0.95;
    }
    
    venda.setTotal(total);
    
    // Atualizar estoque (8 linhas)
    for (Item item : venda.getItens()) {
        Produto produto = produtoRepository.buscar(item.getProdutoId());
        int novoEstoque = produto.getEstoque() - item.getQuantidade();
        if (novoEstoque < 0) {
            throw new RuntimeException("Estoque insuficiente");
        }
        produto.setEstoque(novoEstoque);
        produtoRepository.atualizar(produto);
    }
}
```

**Depois**:
```java
// ✅ Métodos pequenos, cada um com responsabilidade única
public void processarVenda(Venda venda) {
    validar(venda);
    double total = calcularTotal(venda);
    total = aplicarDescontoGeral(total);
    venda.setTotal(total);
    atualizarEstoque(venda);
}

private void validar(Venda venda) {
    if (venda == null) {
        throw new IllegalArgumentException("Venda nula");
    }
    if (venda.getItens() == null || venda.getItens().isEmpty()) {
        throw new IllegalArgumentException("Sem itens");
    }
}

private double calcularTotal(Venda venda) {
    return venda.getItens().stream()
                .mapToDouble(this::calcularSubtotal)
                .sum();
}

private double calcularSubtotal(Item item) {
    double subtotal = item.getQuantidade() * item.getPreco();
    if (item.temDesconto()) {
        subtotal -= item.getDesconto();
    }
    return subtotal;
}

private double aplicarDescontoGeral(double total) {
    if (total > 1000) return total * 0.90;
    if (total > 500) return total * 0.95;
    return total;
}

private void atualizarEstoque(Venda venda) {
    venda.getItens().forEach(this::atualizarEstoqueProduto);
}

private void atualizarEstoqueProduto(Item item) {
    Produto produto = produtoRepository.buscar(item.getProdutoId());
    int novoEstoque = produto.getEstoque() - item.getQuantidade();
    
    if (novoEstoque < 0) {
        throw new RuntimeException("Estoque insuficiente para " + produto.getNome());
    }
    
    produto.setEstoque(novoEstoque);
    produtoRepository.atualizar(produto);
}
```

**Benefícios**:
- Cada método tem **uma responsabilidade**
- Nomes **auto-documentam** a intenção
- **Fácil testar** cada parte isoladamente
- **Reutilizável** em outros contextos

### 2. Guard Clauses (Cláusulas de Guarda)

**Antes**:
```java
// ❌ Aninhamento excessivo (arrowhead code)
public void processar(Pedido pedido) {
    if (pedido != null) {
        if (pedido.isValido()) {
            if (pedido.getCliente() != null) {
                if (pedido.getCliente().isAtivo()) {
                    if (pedido.getItens() != null && !pedido.getItens().isEmpty()) {
                        // Lógica principal aqui (longe da margem esquerda)
                        processarItens(pedido);
                    }
                }
            }
        }
    }
}
```

**Depois**:
```java
// ✅ Validações antecipadas, lógica principal próxima da margem
public void processar(Pedido pedido) {
    if (pedido == null) return;
    if (!pedido.isValido()) return;
    if (pedido.getCliente() == null) return;
    if (!pedido.getCliente().isAtivo()) return;
    if (pedido.getItens() == null || pedido.getItens().isEmpty()) return;
    
    // Lógica principal: claro e próximo da margem
    processarItens(pedido);
}
```

**Variação com exceções**:
```java
// ✅ Lança exceção em vez de return silencioso
public void processar(Pedido pedido) {
    if (pedido == null) {
        throw new IllegalArgumentException("Pedido não pode ser nulo");
    }
    if (!pedido.isValido()) {
        throw new ValidationException("Pedido inválido");
    }
    if (pedido.getCliente() == null) {
        throw new BusinessException("Cliente não informado");
    }
    if (!pedido.getCliente().isAtivo()) {
        throw new BusinessException("Cliente inativo");
    }
    if (pedido.getItens() == null || pedido.getItens().isEmpty()) {
        throw new BusinessException("Pedido sem itens");
    }
    
    processarItens(pedido);
}
```

### 3. Replace Nested Conditional with Guard Clauses

**Antes**:
```java
// ❌ Condicionais aninhados
public double calcularDesconto(Cliente cliente, double valor) {
    double desconto = 0;
    
    if (cliente != null) {
        if (cliente.isVip()) {
            if (valor > 1000) {
                desconto = valor * 0.20;
            } else {
                desconto = valor * 0.10;
            }
        } else {
            if (valor > 500) {
                desconto = valor * 0.05;
            }
        }
    }
    
    return desconto;
}
```

**Depois**:
```java
// ✅ Guard clauses + métodos extraídos
public double calcularDesconto(Cliente cliente, double valor) {
    if (cliente == null) return 0;
    
    if (cliente.isVip()) {
        return calcularDescontoVip(valor);
    }
    
    return calcularDescontoComum(valor);
}

private double calcularDescontoVip(double valor) {
    return valor > 1000 ? valor * 0.20 : valor * 0.10;
}

private double calcularDescontoComum(double valor) {
    return valor > 500 ? valor * 0.05 : 0;
}
```

### 4. Decompose Conditional (Decompor Condicional)

**Antes**:
```java
// ❌ Condição complexa, difícil entender
if ((data.isAfter(inicio) && data.isBefore(fim)) &&
    (quantidade > 10 || valorTotal > 1000) &&
    (cliente.isVip() || cliente.getCompras() > 5)) {
    aplicarPromocao();
}
```

**Depois com variáveis**:
```java
// ✅ Variáveis descritivas
boolean dentroPerido = data.isAfter(inicio) && data.isBefore(fim);
boolean compraMaior = quantidade > 10 || valorTotal > 1000;
boolean clienteEspecial = cliente.isVip() || cliente.getCompras() > 5;

if (dentroPerido && compraMaior && clienteEspecial) {
    aplicarPromocao();
}
```

**Depois com métodos**:
```java
// ✅ Métodos descritivos (melhor ainda)
if (isDentroPerido(data) && isCompraMaior(quantidade, valorTotal) && isClienteEspecial(cliente)) {
    aplicarPromocao();
}

private boolean isDentroPerido(LocalDate data) {
    return data.isAfter(inicio) && data.isBefore(fim);
}

private boolean isCompraMaior(int quantidade, double valorTotal) {
    return quantidade > 10 || valorTotal > 1000;
}

private boolean isClienteEspecial(Cliente cliente) {
    return cliente.isVip() || cliente.getCompras() > 5;
}
```

### 5. Replace Loop with Stream (Java 8+)

**Antes**:
```java
// ❌ Loops tradicionais aninhados
List<String> resultado = new ArrayList<>();
for (Pedido pedido : pedidos) {
    if (pedido.getStatus().equals("APROVADO")) {
        for (Item item : pedido.getItens()) {
            if (item.getPreco() > 100) {
                resultado.add(item.getNome());
            }
        }
    }
}
```

**Depois**:
```java
// ✅ Stream API: mais declarativo
List<String> resultado = pedidos.stream()
    .filter(pedido -> "APROVADO".equals(pedido.getStatus()))
    .flatMap(pedido -> pedido.getItens().stream())
    .filter(item -> item.getPreco() > 100)
    .map(Item::getNome)
    .collect(Collectors.toList());
```

**Exemplo 2 - Soma condicional**:

**Antes**:
```java
// ❌ Loop tradicional
double total = 0;
for (Produto produto : produtos) {
    if (produto.getCategoria().equals("ELETRONICOS") && produto.getEstoque() > 0) {
        total += produto.getPreco() * produto.getEstoque();
    }
}
```

**Depois**:
```java
// ✅ Stream
double total = produtos.stream()
    .filter(p -> "ELETRONICOS".equals(p.getCategoria()))
    .filter(p -> p.getEstoque() > 0)
    .mapToDouble(p -> p.getPreco() * p.getEstoque())
    .sum();
```

### 6. Introduce Parameter Object

**Antes**:
```java
// ❌ Muitos parâmetros (difícil chamar, difícil mudar)
public void criarRelatorio(String titulo, LocalDate inicio, LocalDate fim, 
                           String formato, boolean incluirGraficos, 
                           boolean incluirDetalhes, String destinatario) {
    // ...
}

// Chamada: difícil lembrar ordem
criarRelatorio("Vendas", dataInicio, dataFim, "PDF", true, false, "email@email.com");
```

**Depois**:
```java
// ✅ Objeto encapsulador
public class ParametrosRelatorio {
    private String titulo;
    private LocalDate inicio;
    private LocalDate fim;
    private String formato;
    private boolean incluirGraficos;
    private boolean incluirDetalhes;
    private String destinatario;
    
    // Getters, setters, builder...
}

public void criarRelatorio(ParametrosRelatorio params) {
    // ...
}

// Chamada: clara e extensível
ParametrosRelatorio params = ParametrosRelatorio.builder()
    .titulo("Vendas")
    .inicio(dataInicio)
    .fim(dataFim)
    .formato("PDF")
    .incluirGraficos(true)
    .destinatario("email@email.com")
    .build();

criarRelatorio(params);
```

### 7. Replace Type Code with Strategy

**Antes**:
```java
// ❌ Switch/if para comportamentos diferentes
public double calcular(String tipo, double valor) {
    switch (tipo) {
        case "DESCONTO_FIXO":
            return valor - 10;
        case "DESCONTO_PERCENTUAL":
            return valor * 0.90;
        case "DESCONTO_PROGRESSIVO":
            if (valor > 1000) return valor * 0.80;
            if (valor > 500) return valor * 0.90;
            return valor;
        default:
            return valor;
    }
}
```

**Depois**:
```java
// ✅ Strategy Pattern
public interface EstrategiaDesconto {
    double calcular(double valor);
}

public class DescontoFixo implements EstrategiaDesconto {
    private double valorFixo;
    
    public double calcular(double valor) {
        return valor - valorFixo;
    }
}

public class DescontoPercentual implements EstrategiaDesconto {
    private double percentual;
    
    public double calcular(double valor) {
        return valor * (1 - percentual);
    }
}

public class DescontoProgressivo implements EstrategiaDesconto {
    public double calcular(double valor) {
        if (valor > 1000) return valor * 0.80;
        if (valor > 500) return valor * 0.90;
        return valor;
    }
}

// Uso
public double calcular(EstrategiaDesconto estrategia, double valor) {
    return estrategia.calcular(valor);
}
```

### 8. Consolidate Duplicate Conditional Fragments

**Antes**:
```java
// ❌ Código duplicado em cada ramo
if (tipo.equals("PREMIUM")) {
    calcularImpostos();
    aplicarDescontoPremium();
    enviarNotificacao();
} else if (tipo.equals("COMUM")) {
    calcularImpostos();
    aplicarDescontoComum();
    enviarNotificacao();
} else {
    calcularImpostos();
    enviarNotificacao();
}
```

**Depois**:
```java
// ✅ Extrair código comum
calcularImpostos();

if (tipo.equals("PREMIUM")) {
    aplicarDescontoPremium();
} else if (tipo.equals("COMUM")) {
    aplicarDescontoComum();
}

enviarNotificacao();
```

### 9. Replace Magic Numbers with Named Constants

**Antes**:
```java
// ❌ Números mágicos (significado obscuro)
if (idade >= 18 && idade < 65) {
    if (renda > 5000 && divida < 10000) {
        score = 750;
    }
}
```

**Depois**:
```java
// ✅ Constantes nomeadas
private static final int IDADE_MINIMA_ADULTO = 18;
private static final int IDADE_MAXIMA_ATIVO = 65;
private static final double RENDA_MINIMA_PREMIUM = 5000;
private static final double DIVIDA_MAXIMA_ACEITAVEL = 10000;
private static final int SCORE_APROVADO = 750;

if (idade >= IDADE_MINIMA_ADULTO && idade < IDADE_MAXIMA_ATIVO) {
    if (renda > RENDA_MINIMA_PREMIUM && divida < DIVIDA_MAXIMA_ACEITAVEL) {
        score = SCORE_APROVADO;
    }
}
```

### 10. Caso Completo de Refatoração

**ANTES (Código Original)**:
```java
// ❌ Complexidade alta: CC ~20, 5 níveis, 60+ linhas
public void processarPedidos(List<Pedido> pedidos, String modo) {
    if (pedidos != null && pedidos.size() > 0) {
        for (Pedido pedido : pedidos) {
            if (pedido.getStatus() != null) {
                if (pedido.getStatus().equals("PENDENTE")) {
                    double total = 0;
                    if (pedido.getItens() != null && pedido.getItens().size() > 0) {
                        for (Item item : pedido.getItens()) {
                            if (item.getQuantidade() > 0 && item.getPreco() > 0) {
                                double subtotal = item.getQuantidade() * item.getPreco();
                                total += subtotal;
                            }
                        }
                    }
                    
                    if (total > 0) {
                        if (modo.equals("PROMOCAO")) {
                            if (total > 1000) {
                                total = total * 0.80;
                            } else if (total > 500) {
                                total = total * 0.90;
                            } else if (total > 100) {
                                total = total * 0.95;
                            }
                        }
                        
                        pedido.setTotal(total);
                        pedido.setStatus("PROCESSADO");
                        
                        if (pedido.getCliente() != null) {
                            if (pedido.getCliente().getEmail() != null && !pedido.getCliente().getEmail().isEmpty()) {
                                enviarEmail(pedido.getCliente().getEmail(), "Pedido processado", "Total: " + total);
                            }
                        }
                        
                        for (Item item : pedido.getItens()) {
                            Produto p = buscarProduto(item.getProdutoId());
                            if (p != null) {
                                int novoEstoque = p.getEstoque() - item.getQuantidade();
                                if (novoEstoque >= 0) {
                                    p.setEstoque(novoEstoque);
                                    atualizarProduto(p);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
```

**DEPOIS (Refatorado)**:
```java
// ✅ Complexidade baixa: CC ~3 por método, 2 níveis, 5-10 linhas cada
public void processarPedidos(List<Pedido> pedidos, Modo modo) {
    if (pedidos == null || pedidos.isEmpty()) return;
    
    pedidos.stream()
           .filter(this::isPendente)
           .forEach(pedido -> processarPedido(pedido, modo));
}

private boolean isPendente(Pedido pedido) {
    return pedido.getStatus() != null && "PENDENTE".equals(pedido.getStatus());
}

private void processarPedido(Pedido pedido, Modo modo) {
    double total = calcularTotal(pedido);
    if (total <= 0) return;
    
    total = aplicarDesconto(total, modo);
    
    finalizarPedido(pedido, total);
    notificarCliente(pedido, total);
    atualizarEstoque(pedido);
}

private double calcularTotal(Pedido pedido) {
    if (pedido.getItens() == null) return 0;
    
    return pedido.getItens().stream()
                .filter(this::isItemValido)
                .mapToDouble(this::calcularSubtotal)
                .sum();
}

private boolean isItemValido(Item item) {
    return item.getQuantidade() > 0 && item.getPreco() > 0;
}

private double calcularSubtotal(Item item) {
    return item.getQuantidade() * item.getPreco();
}

private double aplicarDesconto(double total, Modo modo) {
    if (modo != Modo.PROMOCAO) return total;
    
    return obterEstrategiaDesconto(total).calcular(total);
}

private EstrategiaDesconto obterEstrategiaDesconto(double total) {
    if (total > 1000) return new Desconto20Porcento();
    if (total > 500) return new Desconto10Porcento();
    if (total > 100) return new Desconto5Porcento();
    return new SemDesconto();
}

private void finalizarPedido(Pedido pedido, double total) {
    pedido.setTotal(total);
    pedido.setStatus("PROCESSADO");
}

private void notificarCliente(Pedido pedido, double total) {
    Cliente cliente = pedido.getCliente();
    if (cliente == null) return;
    
    String email = cliente.getEmail();
    if (email == null || email.isEmpty()) return;
    
    enviarEmail(email, "Pedido processado", "Total: " + total);
}

private void atualizarEstoque(Pedido pedido) {
    pedido.getItens().forEach(this::atualizarEstoqueProduto);
}

private void atualizarEstoqueProduto(Item item) {
    Produto produto = buscarProduto(item.getProdutoId());
    if (produto == null) return;
    
    int novoEstoque = produto.getEstoque() - item.getQuantidade();
    if (novoEstoque < 0) return;
    
    produto.setEstoque(novoEstoque);
    atualizarProduto(produto);
}

// Enums e classes auxiliares
enum Modo { PROMOCAO, NORMAL }

interface EstrategiaDesconto {
    double calcular(double total);
}

class Desconto20Porcento implements EstrategiaDesconto {
    public double calcular(double total) { return total * 0.80; }
}

class Desconto10Porcento implements EstrategiaDesconto {
    public double calcular(double total) { return total * 0.90; }
}

class Desconto5Porcento implements EstrategiaDesconto {
    public double calcular(double total) { return total * 0.95; }
}

class SemDesconto implements EstrategiaDesconto {
    public double calcular(double total) { return total; }
}
```

**Melhorias alcançadas**:
- **CC**: 20 → 3 por método
- **Profundidade**: 5 níveis → 2 níveis
- **Tamanho**: 60+ linhas → 5-10 por método
- **Testabilidade**: Muito maior (cada método isolado)
- **Legibilidade**: Nomes auto-documentam
- **Reutilização**: Métodos reutilizáveis
- **Manutenção**: Muito mais fácil

---

## 🎯 Aplicabilidade e Contextos

### Cenário 1: Refatoração Incremental

1. **Identificar** método complexo
2. **Escrever testes** (se não existirem)
3. **Extrair** um método pequeno
4. **Executar testes**
5. **Repetir** até simplificar

### Cenário 2: Code Review

- Sugerir refatorações específicas
- Usar ferramentas (SonarQube, IntelliJ)
- Priorizar CC > 10

### Cenário 3: Legacy Code

- Adicionar testes antes de refatorar
- Refatorar incrementalmente
- Não mudar comportamento

---

## ⚠️ Armadilhas Comuns

### 1. **Refatorar Sem Testes**

```java
// ❌ Mudar código sem testes = risco alto
// ✅ Sempre tenha testes antes de refatorar
```

### 2. **Over-Engineering**

```java
// ❌ Criar 10 classes para lógica simples
// ✅ Simplicidade: extrair métodos pode bastar
```

### 3. **Mudar Comportamento**

```java
// ❌ Refatoração NUNCA deve mudar comportamento
// ✅ Testes devem continuar passando
```

---

## 🚀 Boas Práticas

### 1. ✅ Sempre Tenha Testes

```java
// Testes garantem que comportamento não mudou
```

### 2. ✅ Refatore Incrementalmente

```java
// Pequenos passos, testando a cada mudança
```

### 3. ✅ Use Ferramentas

```java
// IntelliJ: Extract Method (Ctrl+Alt+M)
// SonarQube: Identifica complexidade alta
```

### 4. ✅ Nomes Descritivos

```java
// calcularDescontoProgressivo() vs calc()
```

### 5. ✅ Single Responsibility

```java
// Cada método faz UMA coisa
```

### 6. ✅ DRY (Don't Repeat Yourself)

```java
// Elimine duplicação
```

### 7. ✅ KISS (Keep It Simple, Stupid)

```java
// Solução mais simples possível
```

### 8. ✅ Guard Clauses

```java
// Valide cedo, retorne cedo
```

### 9. ✅ Streams para Coleções

```java
// Mais declarativo, menos aninhamento
```

### 10. ✅ Strategy Pattern

```java
// Substitua switch/if por polimorfismo
```

---

## 📚 Resumo

**Refatoração** melhora código **sem mudar comportamento externo**. **Objetivo**: Reduzir complexidade, aumentar legibilidade, facilitar manutenção. **Técnicas principais**: **Extract Method** (dividir métodos grandes), **Guard Clauses** (validação antecipada + early return), **Decompose Conditional** (condições complexas → variáveis/métodos), **Replace Loop with Stream** (loops → Stream API), **Strategy Pattern** (switch → polimorfismo), **Parameter Object** (muitos parâmetros → objeto). **Processo**: Identifique código complexo → Escreva testes → Refatore incrementalmente → Execute testes. **Sinais para refatorar**: CC > 10, profundidade > 3, método > 30 linhas, duplicação, difícil testar. **Ferramentas**: IntelliJ (Extract Method: Ctrl+Alt+M), SonarQube, PMD. **Regra de ouro**: **Sempre tenha testes antes de refatorar**. Refatoração **nunca** muda comportamento, apenas estrutura.
