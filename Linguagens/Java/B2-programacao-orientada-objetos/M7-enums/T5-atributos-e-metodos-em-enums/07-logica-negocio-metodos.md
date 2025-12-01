# T5.07 - Lógica de Negócio em Métodos

## Introdução

**Lógica de negócio**: regras específicas implementadas em métodos.

```java
public enum FormaPagamento {
    CREDITO("Crédito", 0.03),
    DEBITO("Débito", 0.01),
    DINHEIRO("Dinheiro", 0.0);
    
    private final String descricao;
    private final double taxa;
    
    FormaPagamento(String descricao, double taxa) {
        this.descricao = descricao;
        this.taxa = taxa;
    }
    
    // ✅ Lógica de negócio
    public double calcularTotal(double valor) {
        return valor + (valor * taxa);
    }
}

double total = FormaPagamento.CREDITO.calcularTotal(100); // 103.0
```

**Lógica encapsulada**: comportamento específico do enum.

---

## Fundamentos

### 1. Cálculo de Desconto

```java
public enum TipoCliente {
    VIP("VIP", 0.20),
    PREMIUM("Premium", 0.10),
    COMUM("Comum", 0.0);
    
    private final String nome;
    private final double desconto;
    
    TipoCliente(String nome, double desconto) {
        this.nome = nome;
        this.desconto = desconto;
    }
    
    // ✅ Lógica: calcular desconto
    public double aplicarDesconto(double valor) {
        return valor - (valor * desconto);
    }
    
    public double calcularDesconto(double valor) {
        return valor * desconto;
    }
}

double valorFinal = TipoCliente.VIP.aplicarDesconto(100); // 80.0
```

### 2. Validação de Negócio

```java
public enum TipoConta {
    CORRENTE("Corrente", 1000, -500),
    POUPANCA("Poupança", 0, 0);
    
    private final String nome;
    private final double depositoMinimo;
    private final double limiteCredito;
    
    TipoConta(String nome, double depositoMinimo, double limiteCredito) {
        this.nome = nome;
        this.depositoMinimo = depositoMinimo;
        this.limiteCredito = limiteCredito;
    }
    
    // ✅ Lógica: validar saque
    public boolean podeSacar(double saldoAtual, double valor) {
        double saldoFinal = saldoAtual - valor;
        return saldoFinal >= limiteCredito;
    }
    
    public boolean podeDepositar(double valor) {
        return valor >= depositoMinimo;
    }
}

boolean pode = TipoConta.CORRENTE.podeSacar(200, 600); // true (-400 >= -500)
```

### 3. Cálculo de Taxa

```java
public enum MetodoEnvio {
    EXPRESSO("Expresso", 20.0, 0.05),
    NORMAL("Normal", 10.0, 0.02);
    
    private final String nome;
    private final double taxaBase;
    private final double percentualPeso;
    
    MetodoEnvio(String nome, double taxaBase, double percentualPeso) {
        this.nome = nome;
        this.taxaBase = taxaBase;
        this.percentualPeso = percentualPeso;
    }
    
    // ✅ Lógica: calcular frete
    public double calcularFrete(double peso) {
        return taxaBase + (peso * percentualPeso);
    }
}

double frete = MetodoEnvio.EXPRESSO.calcularFrete(50); // 20 + (50 * 0.05) = 22.5
```

### 4. Conversão de Valor

```java
public enum Moeda {
    REAL("BRL", 1.0),
    DOLAR("USD", 5.0),
    EURO("EUR", 6.0);
    
    private final String codigo;
    private final double taxaConversao;
    
    Moeda(String codigo, double taxaConversao) {
        this.codigo = codigo;
        this.taxaConversao = taxaConversao;
    }
    
    // ✅ Lógica: converter para Real
    public double paraReal(double valor) {
        return valor * taxaConversao;
    }
    
    public double deReal(double valorReal) {
        return valorReal / taxaConversao;
    }
    
    public double converter(double valor, Moeda destino) {
        double emReal = paraReal(valor);
        return destino.deReal(emReal);
    }
}

double reais = Moeda.DOLAR.paraReal(10); // 50.0
double dolares = Moeda.REAL.converter(50, Moeda.DOLAR); // 10.0
```

### 5. Comparação de Prioridade

```java
public enum Prioridade {
    BAIXA("Baixa", 1),
    MEDIA("Média", 5),
    ALTA("Alta", 10);
    
    private final String nome;
    private final int nivel;
    
    Prioridade(String nome, int nivel) {
        this.nome = nome;
        this.nivel = nivel;
    }
    
    // ✅ Lógica: comparar prioridades
    public boolean isMaiorQue(Prioridade outra) {
        return this.nivel > outra.nivel;
    }
    
    public boolean isMaiorOuIgual(Prioridade outra) {
        return this.nivel >= outra.nivel;
    }
}

boolean maior = Prioridade.ALTA.isMaiorQue(Prioridade.MEDIA); // true
```

### 6. Formatação de Saída

```java
public enum Status {
    PENDENTE("Pendente", "⏳"),
    APROVADO("Aprovado", "✅"),
    REJEITADO("Rejeitado", "❌");
    
    private final String descricao;
    private final String emoji;
    
    Status(String descricao, String emoji) {
        this.descricao = descricao;
        this.emoji = emoji;
    }
    
    // ✅ Lógica: formatar para exibição
    public String formatar(String mensagem) {
        return emoji + " " + descricao + ": " + mensagem;
    }
    
    public String formatarCompleto(String id, String usuario) {
        return String.format("[%s] %s %s - Usuário: %s", 
            id, emoji, descricao, usuario);
    }
}

String msg = Status.APROVADO.formatar("Solicitação aceita");
// "✅ Aprovado: Solicitação aceita"
```

### 7. Lógica de Intervalo

```java
public enum FaixaEtaria {
    CRIANCA("Criança", 0, 12),
    ADOLESCENTE("Adolescente", 13, 17),
    ADULTO("Adulto", 18, 59),
    IDOSO("Idoso", 60, 120);
    
    private final String nome;
    private final int idadeMin;
    private final int idadeMax;
    
    FaixaEtaria(String nome, int idadeMin, int idadeMax) {
        this.nome = nome;
        this.idadeMin = idadeMin;
        this.idadeMax = idadeMax;
    }
    
    // ✅ Lógica: verificar se idade está na faixa
    public boolean contem(int idade) {
        return idade >= idadeMin && idade <= idadeMax;
    }
    
    public static FaixaEtaria classificar(int idade) {
        for (FaixaEtaria faixa : values()) {
            if (faixa.contem(idade)) {
                return faixa;
            }
        }
        throw new IllegalArgumentException("Idade inválida: " + idade);
    }
}

FaixaEtaria faixa = FaixaEtaria.classificar(15); // ADOLESCENTE
```

### 8. Acumulação

```java
public enum TipoTransacao {
    CREDITO("Crédito", 1),
    DEBITO("Débito", -1);
    
    private final String nome;
    private final int multiplicador;
    
    TipoTransacao(String nome, int multiplicador) {
        this.nome = nome;
        this.multiplicador = multiplicador;
    }
    
    // ✅ Lógica: aplicar transação
    public double aplicar(double saldoAtual, double valor) {
        return saldoAtual + (valor * multiplicador);
    }
}

double saldo = 100;
saldo = TipoTransacao.DEBITO.aplicar(saldo, 50); // 100 + (50 * -1) = 50
```

### 9. Regra Composta

```java
public enum PlanoSaude {
    BASICO("Básico", 100, 0.8, 2),
    PREMIUM("Premium", 300, 1.0, 5);
    
    private final String nome;
    private final double mensalidade;
    private final double cobertura;
    private final int dependentesMax;
    
    PlanoSaude(String nome, double mensalidade, double cobertura, int dependentesMax) {
        this.nome = nome;
        this.mensalidade = mensalidade;
        this.cobertura = cobertura;
        this.dependentesMax = dependentesMax;
    }
    
    // ✅ Lógica: calcular mensalidade total
    public double calcularMensalidade(int numDependentes) {
        if (numDependentes > dependentesMax) {
            throw new IllegalArgumentException("Máximo de dependentes: " + dependentesMax);
        }
        return mensalidade + (numDependentes * mensalidade * 0.5);
    }
    
    public double calcularReembolso(double valorProcedimento) {
        return valorProcedimento * cobertura;
    }
}

double total = PlanoSaude.PREMIUM.calcularMensalidade(2); // 300 + (2 * 150) = 600
```

### 10. Lógica de Estado

```java
public enum StatusPedido {
    PENDENTE("Pendente"),
    PROCESSANDO("Processando"),
    ENVIADO("Enviado"),
    ENTREGUE("Entregue"),
    CANCELADO("Cancelado");
    
    private final String descricao;
    
    StatusPedido(String descricao) {
        this.descricao = descricao;
    }
    
    // ✅ Lógica: transições permitidas
    public boolean podeTransicionarPara(StatusPedido novo) {
        if (this == CANCELADO || novo == CANCELADO) {
            return true; // Sempre pode cancelar/de cancelado
        }
        return novo.ordinal() == this.ordinal() + 1;
    }
    
    public boolean isFinal() {
        return this == ENTREGUE || this == CANCELADO;
    }
}

boolean pode = StatusPedido.PENDENTE.podeTransicionarPara(StatusPedido.PROCESSANDO); // true
```

---

## Aplicabilidade

**Lógica de negócio** para:
- Cálculos (desconto, taxa, conversão)
- Validação (saldo, intervalo, permissão)
- Formatação (exibição customizada)
- Transições de estado

---

## Armadilhas

### 1. Lógica Complexa em Switch

```java
// ⚠️ Lógica em switch (dispersa)
double desconto;
switch (tipo) {
    case VIP: desconto = 0.20; break;
    case COMUM: desconto = 0.0; break;
}

// ✅ Lógica no enum
public double aplicarDesconto(double valor) {
    return valor - (valor * desconto);
}
```

### 2. Método Muito Complexo

```java
// ⚠️ Método faz muitas coisas
public double processar(double valor, int parcelas, boolean seguro) {
    // ... 50 linhas de código
}

// ✅ Dividir em métodos menores
public double calcularTotal(double valor, int parcelas) { }
public double adicionarSeguro(double valor) { }
```

### 3. Lógica Não Validada

```java
// ⚠️ Não valida entrada
public double calcularFrete(double peso) {
    return taxaBase + (peso * percentualPeso); // E se peso < 0?
}

// ✅ Validar
public double calcularFrete(double peso) {
    if (peso <= 0) {
        throw new IllegalArgumentException("Peso deve ser positivo");
    }
    return taxaBase + (peso * percentualPeso);
}
```

---

## Boas Práticas

### 1. Método Coeso

```java
// ✅ Uma responsabilidade
public double calcularDesconto(double valor) {
    return valor * desconto;
}

public double aplicarDesconto(double valor) {
    return valor - calcularDesconto(valor);
}
```

### 2. Validar Parâmetros

```java
// ✅ Validação
public double calcular(double valor) {
    if (valor < 0) {
        throw new IllegalArgumentException("Valor não pode ser negativo");
    }
    return valor * taxa;
}
```

### 3. Documentar Lógica

```java
// ✅ Javadoc
/**
 * Calcula o valor total com desconto aplicado.
 * @param valor valor original (deve ser >= 0)
 * @return valor com desconto
 * @throws IllegalArgumentException se valor < 0
 */
public double aplicarDesconto(double valor) {
    // ...
}
```

---

## Resumo

**Lógica de negócio**:

```java
public enum TipoCliente {
    VIP("VIP", 0.20);
    
    private final String nome;
    private final double desconto;
    
    TipoCliente(String nome, double desconto) {
        this.nome = nome;
        this.desconto = desconto;
    }
    
    // ✅ Lógica: calcular desconto
    public double aplicarDesconto(double valor) {
        if (valor < 0) {
            throw new IllegalArgumentException("Valor inválido");
        }
        return valor - (valor * desconto);
    }
}

double valorFinal = TipoCliente.VIP.aplicarDesconto(100); // 80.0
```

**Tipos de lógica**:

```java
// Cálculo
public double calcular(double valor) { return valor * taxa; }

// Validação
public boolean podeAcessar(Usuario u) { return u.getNivel() >= nivelMinimo; }

// Conversão
public double paraReal(double valor) { return valor * taxaConversao; }

// Formatação
public String formatar(String msg) { return emoji + " " + msg; }

// Comparação
public boolean isMaiorQue(Prioridade outra) { return nivel > outra.nivel; }

// Transição
public boolean podeTransicionarPara(Status novo) { /* ... */ }
```

**Regra de Ouro**: Encapsular **lógica de negócio** em métodos do enum. **Validar parâmetros**. Métodos **coesos** (uma responsabilidade). **Documentar** lógica complexa (Javadoc). Evitar lógica em **switch** (preferir métodos do enum). Métodos **pequenos** e **compreensíveis**.
