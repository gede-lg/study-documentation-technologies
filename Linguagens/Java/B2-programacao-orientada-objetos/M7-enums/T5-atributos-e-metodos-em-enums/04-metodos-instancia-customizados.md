# T5.04 - Métodos de Instância Customizados

## Introdução

**Métodos de instância customizados**: lógica específica de cada constante.

```java
public enum Moeda {
    REAL("BRL", "R$", 2),
    DOLAR("USD", "$", 2),
    YEN("JPY", "¥", 0);
    
    private final String codigo;
    private final String simbolo;
    private final int casasDecimais;
    
    Moeda(String codigo, String simbolo, int casasDecimais) {
        this.codigo = codigo;
        this.simbolo = simbolo;
        this.casasDecimais = casasDecimais;
    }
    
    // ✅ Método customizado
    public String formatar(double valor) {
        return simbolo + " " + String.format("%." + casasDecimais + "f", valor);
    }
}

System.out.println(Moeda.REAL.formatar(100.5)); // "R$ 100,50"
System.out.println(Moeda.YEN.formatar(100.5));  // "¥ 100"
```

**Customizado**: método além de getters, implementa lógica de negócio.

---

## Fundamentos

### 1. Método Simples

```java
public enum Status {
    ATIVO("Ativo", 1),
    INATIVO("Inativo", 0);
    
    private final String descricao;
    private final int codigo;
    
    Status(String descricao, int codigo) {
        this.descricao = descricao;
        this.codigo = codigo;
    }
    
    // ✅ Método customizado
    public String exibir() {
        return descricao + " (" + codigo + ")";
    }
}

System.out.println(Status.ATIVO.exibir()); // "Ativo (1)"
```

### 2. Método com Parâmetro

```java
public enum Operacao {
    SOMA("+"),
    SUBTRACAO("-"),
    MULTIPLICACAO("*");
    
    private final String simbolo;
    
    Operacao(String simbolo) {
        this.simbolo = simbolo;
    }
    
    // ✅ Método com parâmetros
    public double calcular(double a, double b) {
        switch (this) {
            case SOMA: return a + b;
            case SUBTRACAO: return a - b;
            case MULTIPLICACAO: return a * b;
            default: throw new UnsupportedOperationException();
        }
    }
}

double resultado = Operacao.SOMA.calcular(10, 5); // 15
```

### 3. Método de Validação

```java
public enum TipoConta {
    CORRENTE("Corrente", 1000),
    POUPANCA("Poupança", 500);
    
    private final String nome;
    private final double limiteMinimo;
    
    TipoConta(String nome, double limiteMinimo) {
        this.nome = nome;
        this.limiteMinimo = limiteMinimo;
    }
    
    // ✅ Método de validação
    public boolean validarSaldo(double saldo) {
        return saldo >= limiteMinimo;
    }
    
    public String getMensagemErro(double saldo) {
        return "Saldo mínimo para " + nome + ": " + limiteMinimo;
    }
}

boolean valido = TipoConta.CORRENTE.validarSaldo(800); // false
```

### 4. Método de Formatação

```java
public enum Temperatura {
    CELSIUS("C"),
    FAHRENHEIT("F"),
    KELVIN("K");
    
    private final String simbolo;
    
    Temperatura(String simbolo) {
        this.simbolo = simbolo;
    }
    
    // ✅ Método de formatação
    public String formatar(double valor) {
        return String.format("%.1f°%s", valor, simbolo);
    }
    
    public double converter(double valor, Temperatura destino) {
        if (this == CELSIUS && destino == FAHRENHEIT) {
            return (valor * 9/5) + 32;
        }
        // outras conversões...
        return valor;
    }
}

String temp = Temperatura.CELSIUS.formatar(25.5); // "25,5°C"
```

### 5. Método com Lógica de Negócio

```java
public enum Desconto {
    BRONZE(0.05),
    PRATA(0.10),
    OURO(0.15);
    
    private final double percentual;
    
    Desconto(double percentual) {
        this.percentual = percentual;
    }
    
    // ✅ Lógica de negócio
    public double aplicar(double valor) {
        return valor - (valor * percentual);
    }
    
    public double calcularDesconto(double valor) {
        return valor * percentual;
    }
    
    public String getDescricao() {
        return (int)(percentual * 100) + "% de desconto";
    }
}

double valorFinal = Desconto.OURO.aplicar(1000); // 850
```

### 6. Método com Múltiplos Parâmetros

```java
public enum Calculo {
    AREA_RETANGULO,
    AREA_CIRCULO;
    
    // ✅ Método com múltiplos parâmetros
    public double calcular(double... valores) {
        switch (this) {
            case AREA_RETANGULO:
                return valores[0] * valores[1]; // largura * altura
            case AREA_CIRCULO:
                return Math.PI * valores[0] * valores[0]; // π * r²
            default:
                throw new UnsupportedOperationException();
        }
    }
}

double area = Calculo.AREA_RETANGULO.calcular(5, 10); // 50
```

### 7. Método Retorna Objeto

```java
public enum TamanhoArquivo {
    KB(1024),
    MB(1024 * 1024),
    GB(1024 * 1024 * 1024);
    
    private final long bytes;
    
    TamanhoArquivo(long bytes) {
        this.bytes = bytes;
    }
    
    // ✅ Retorna objeto customizado
    public Tamanho converter(long bytesTotal) {
        double valor = (double) bytesTotal / bytes;
        return new Tamanho(valor, this);
    }
    
    static class Tamanho {
        final double valor;
        final TamanhoArquivo unidade;
        
        Tamanho(double valor, TamanhoArquivo unidade) {
            this.valor = valor;
            this.unidade = unidade;
        }
        
        @Override
        public String toString() {
            return String.format("%.2f %s", valor, unidade.name());
        }
    }
}
```

### 8. Método com Estado

```java
public enum Contador {
    INSTANCE;
    
    private int count = 0; // estado mutável
    
    // ✅ Método modifica estado
    public void incrementar() {
        count++;
    }
    
    public void resetar() {
        count = 0;
    }
    
    public int getCount() {
        return count;
    }
}

Contador.INSTANCE.incrementar();
System.out.println(Contador.INSTANCE.getCount()); // 1
```

### 9. Método com Builder Pattern

```java
public enum Relatorio {
    VENDAS("Relatório de Vendas"),
    ESTOQUE("Relatório de Estoque");
    
    private final String titulo;
    
    Relatorio(String titulo) {
        this.titulo = titulo;
    }
    
    // ✅ Builder pattern
    public Builder builder() {
        return new Builder(this);
    }
    
    static class Builder {
        private final Relatorio tipo;
        private LocalDate dataInicio;
        private LocalDate dataFim;
        
        Builder(Relatorio tipo) {
            this.tipo = tipo;
        }
        
        public Builder dataInicio(LocalDate data) {
            this.dataInicio = data;
            return this;
        }
        
        public Builder dataFim(LocalDate data) {
            this.dataFim = data;
            return this;
        }
        
        public String gerar() {
            return tipo.titulo + ": " + dataInicio + " a " + dataFim;
        }
    }
}

String rel = Relatorio.VENDAS.builder()
    .dataInicio(LocalDate.now())
    .dataFim(LocalDate.now().plusDays(7))
    .gerar();
```

### 10. Método com Stream

```java
public enum Permissao {
    ADMIN(Arrays.asList("ler", "escrever", "deletar")),
    USER(Arrays.asList("ler", "escrever"));
    
    private final List<String> acoes;
    
    Permissao(List<String> acoes) {
        this.acoes = new ArrayList<>(acoes);
    }
    
    // ✅ Método com stream
    public boolean temPermissao(String acao) {
        return acoes.stream().anyMatch(a -> a.equals(acao));
    }
    
    public List<String> filtrar(String prefixo) {
        return acoes.stream()
            .filter(a -> a.startsWith(prefixo))
            .collect(Collectors.toList());
    }
}

boolean tem = Permissao.ADMIN.temPermissao("deletar"); // true
```

---

## Aplicabilidade

**Métodos customizados** para:
- Implementar lógica de negócio
- Validação específica
- Formatação de dados
- Cálculos e transformações

---

## Armadilhas

### 1. Lógica Complexa em Switch

```java
// ⚠️ Lógica complexa baseada em this
public double calcular(double a, double b) {
    switch (this) {
        case SOMA: return a + b;
        case SUBTRACAO: return a - b;
        // muitos cases...
    }
}

// ✅ Preferir métodos abstratos (T6)
```

### 2. Estado Mutável

```java
// ⚠️ Estado mutável em enum
private int contador = 0;

public void incrementar() {
    contador++; // ⚠️ Constante mutável
}

// ✅ Preferir imutável ou singleton específico
```

### 3. Método Muito Complexo

```java
// ⚠️ Método muito complexo
public String processar(String entrada) {
    // 50 linhas de código...
    // ⚠️ Lógica pesada
}

// ✅ Delegar para classe auxiliar
```

---

## Boas Práticas

### 1. Métodos Coesos

```java
// ✅ Método faz uma coisa só
public String formatar(double valor) {
    return simbolo + " " + String.format("%.2f", valor);
}
```

### 2. Validação

```java
// ✅ Validar parâmetros
public double calcular(double valor) {
    if (valor < 0) {
        throw new IllegalArgumentException("Valor não pode ser negativo");
    }
    return valor * percentual;
}
```

### 3. Documentar

```java
// ✅ Javadoc para métodos complexos
/**
 * Converte temperatura para a unidade especificada.
 * @param valor valor a converter
 * @param destino unidade de destino
 * @return valor convertido
 */
public double converter(double valor, Temperatura destino) {
    // ...
}
```

---

## Resumo

**Métodos customizados**:

```java
public enum Moeda {
    REAL("R$", 2);
    
    private final String simbolo;
    private final int casasDecimais;
    
    Moeda(String simbolo, int casasDecimais) {
        this.simbolo = simbolo;
        this.casasDecimais = casasDecimais;
    }
    
    // ✅ Método customizado
    public String formatar(double valor) {
        return simbolo + " " + String.format("%." + casasDecimais + "f", valor);
    }
}

Moeda.REAL.formatar(100.50); // "R$ 100,50"
```

**Tipos**:

```java
// Formatação
public String formatar(double valor) { }

// Validação
public boolean validar(String entrada) { }

// Cálculo
public double calcular(double a, double b) { }

// Transformação
public String converter(String entrada) { }

// Comparação
public boolean compararCom(Enum outro) { }
```

**Regra de Ouro**: Métodos customizados implementam **lógica de negócio** específica. Além de **getters**, podem fazer **formatação**, **validação**, **cálculo**, **transformação**. Devem ser **coesos** (uma responsabilidade). **Validar** parâmetros. **Documentar** lógica complexa. Preferir **imutável**.
