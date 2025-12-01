# T8.01 - Enum Implementando Interface

## Introdução

**Enum implementando interface**: enum pode implementar uma ou mais interfaces.

```java
interface Descritivel {
    String getDescricao();
}

public enum Status implements Descritivel {
    ATIVO("Ativo"),
    INATIVO("Inativo");
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    // ✅ Implementa método da interface
    @Override
    public String getDescricao() {
        return descricao;
    }
}

// ✅ Polimorfismo
Descritivel d = Status.ATIVO;
System.out.println(d.getDescricao()); // Ativo
```

**Interface**: permite enum se comportar como outro tipo.

---

## Fundamentos

### 1. Sintaxe Básica

```java
interface Operacao {
    double calcular(double a, double b);
}

public enum OperacaoMatematica implements Operacao {
    SOMA,
    SUBTRACAO;
    
    @Override
    public double calcular(double a, double b) {
        switch (this) {
            case SOMA: return a + b;
            case SUBTRACAO: return a - b;
            default: throw new IllegalStateException();
        }
    }
}

double resultado = OperacaoMatematica.SOMA.calcular(5, 3); // 8.0
```

### 2. Interface com Getter

```java
interface Nomeavel {
    String getNome();
}

public enum Cor implements Nomeavel {
    VERMELHO("Vermelho"),
    VERDE("Verde");
    
    private final String nome;
    
    Cor(String nome) {
        this.nome = nome;
    }
    
    @Override
    public String getNome() {
        return nome;
    }
}
```

### 3. Interface com Múltiplos Métodos

```java
interface Formatavel {
    String formatar();
    String formatarCompleto();
}

public enum Moeda implements Formatavel {
    REAL("R$", "Real"),
    DOLAR("$", "Dólar");
    
    private final String simbolo;
    private final String nome;
    
    Moeda(String simbolo, String nome) {
        this.simbolo = simbolo;
        this.nome = nome;
    }
    
    @Override
    public String formatar() {
        return simbolo;
    }
    
    @Override
    public String formatarCompleto() {
        return simbolo + " - " + nome;
    }
}

String formato = Moeda.REAL.formatarCompleto(); // "R$ - Real"
```

### 4. Interface Funcional

```java
@FunctionalInterface
interface Calculavel {
    double calcular(double valor);
}

public enum Desconto implements Calculavel {
    VIP(0.20),
    COMUM(0.05);
    
    private final double percentual;
    
    Desconto(double percentual) {
        this.percentual = percentual;
    }
    
    @Override
    public double calcular(double valor) {
        return valor - (valor * percentual);
    }
}

// ✅ Uso como lambda reference
Calculavel calc = Desconto.VIP;
double valorFinal = calc.calcular(100); // 80.0
```

### 5. Polimorfismo com Interface

```java
interface Executavel {
    void executar();
}

public enum Comando implements Executavel {
    SALVAR {
        @Override
        public void executar() {
            System.out.println("Salvando...");
        }
    },
    DELETAR {
        @Override
        public void executar() {
            System.out.println("Deletando...");
        }
    }
}

// ✅ Polimorfismo
Executavel cmd = Comando.SALVAR;
cmd.executar(); // "Salvando..."
```

### 6. Interface com Generics

```java
interface Conversor<T> {
    T converter(String valor);
}

public enum TipoConversao implements Conversor<Object> {
    INTEIRO {
        @Override
        public Object converter(String valor) {
            return Integer.parseInt(valor);
        }
    },
    DOUBLE {
        @Override
        public Object converter(String valor) {
            return Double.parseDouble(valor);
        }
    }
}

Object numero = TipoConversao.INTEIRO.converter("42"); // 42
```

### 7. Interface para Validação

```java
interface Validador {
    boolean validar(String valor);
    String getMensagemErro();
}

public enum TipoValidacao implements Validador {
    EMAIL("Email inválido") {
        @Override
        public boolean validar(String valor) {
            return valor.contains("@");
        }
    },
    CPF("CPF inválido") {
        @Override
        public boolean validar(String valor) {
            return valor.length() == 11;
        }
    };
    
    private final String mensagemErro;
    
    TipoValidacao(String mensagemErro) {
        this.mensagemErro = mensagemErro;
    }
    
    @Override
    public String getMensagemErro() {
        return mensagemErro;
    }
}

boolean valido = TipoValidacao.EMAIL.validar("user@email.com"); // true
```

### 8. Interface como Tipo de Retorno

```java
interface Processador {
    String processar(String entrada);
}

public enum TipoProcessamento implements Processador {
    MAIUSCULA {
        @Override
        public String processar(String entrada) {
            return entrada.toUpperCase();
        }
    },
    MINUSCULA {
        @Override
        public String processar(String entrada) {
            return entrada.toLowerCase();
        }
    }
}

// ✅ Método retorna interface
public Processador obterProcessador(String tipo) {
    return "upper".equals(tipo) 
        ? TipoProcessamento.MAIUSCULA 
        : TipoProcessamento.MINUSCULA;
}

Processador proc = obterProcessador("upper");
String resultado = proc.processar("teste"); // "TESTE"
```

### 9. Interface com Atributos

```java
interface Pontuavel {
    int getPontos();
    boolean isVencedor();
}

public enum Nivel implements Pontuavel {
    BRONZE(100),
    PRATA(500),
    OURO(1000);
    
    private final int pontos;
    
    Nivel(int pontos) {
        this.pontos = pontos;
    }
    
    @Override
    public int getPontos() {
        return pontos;
    }
    
    @Override
    public boolean isVencedor() {
        return pontos >= 1000;
    }
}

boolean vencedor = Nivel.OURO.isVencedor(); // true
```

### 10. Interface em Collections

```java
interface Ordenavel {
    int getOrdem();
}

public enum Prioridade implements Ordenavel {
    BAIXA(1),
    MEDIA(5),
    ALTA(10);
    
    private final int ordem;
    
    Prioridade(int ordem) {
        this.ordem = ordem;
    }
    
    @Override
    public int getOrdem() {
        return ordem;
    }
}

// ✅ Lista de interface
List<Ordenavel> lista = Arrays.asList(
    Prioridade.ALTA,
    Prioridade.BAIXA
);

// ✅ Ordenar por getOrdem()
lista.sort(Comparator.comparingInt(Ordenavel::getOrdem));
```

---

## Aplicabilidade

**Enum implementando interface** para:
- Polimorfismo (enum como outro tipo)
- Padronizar comportamento
- Strategy pattern
- Command pattern
- Integração com sistemas existentes

---

## Armadilhas

### 1. Interface Sem Implementação

```java
interface Operacao {
    double calcular(double a, double b);
}

// ❌ Não implementa método
public enum Op implements Operacao {
    SOMA; // Erro: deve implementar calcular()
}

// ✅ Implementar método
public enum Op implements Operacao {
    SOMA;
    
    @Override
    public double calcular(double a, double b) {
        return a + b;
    }
}
```

### 2. Enum Não Pode Estender Classe

```java
// ❌ Enum não pode estender classe
public enum Status extends BaseStatus { } // Erro

// ✅ Usar interface
interface IStatus { }
public enum Status implements IStatus { }
```

### 3. Implementação Genérica vs Específica

```java
// ⚠️ Implementação genérica (switch)
public enum Op implements Operacao {
    SOMA, SUB;
    
    @Override
    public double calcular(double a, double b) {
        switch (this) {
            case SOMA: return a + b;
            case SUB: return a - b;
        }
        return 0;
    }
}

// ✅ Implementação específica (constant-specific)
public enum Op implements Operacao {
    SOMA {
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    },
    SUB {
        @Override
        public double calcular(double a, double b) {
            return a - b;
        }
    }
}
```

---

## Boas Práticas

### 1. Interface Coesa

```java
// ✅ Interface focada
interface Calculavel {
    double calcular(double valor);
}

public enum Desconto implements Calculavel {
    // ...
}
```

### 2. Documentar Interface

```java
// ✅ Javadoc
/**
 * Enum que implementa Operacao para cálculos matemáticos.
 * @see Operacao
 */
public enum OperacaoMatematica implements Operacao {
    // ...
}
```

### 3. Usar @Override

```java
// ✅ Sempre usar @Override
@Override
public String getDescricao() {
    return descricao;
}
```

### 4. Constant-Specific Implementation

```java
// ✅ Preferir implementação por constante
public enum Op implements Operacao {
    SOMA {
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    }
}
```

---

## Resumo

**Enum implementando interface**:

```java
interface Descritivel {
    String getDescricao();
}

public enum Status implements Descritivel {
    ATIVO("Ativo"),
    INATIVO("Inativo");
    
    private final String descricao;
    
    Status(String descricao) {
        this.descricao = descricao;
    }
    
    // ✅ Implementa interface
    @Override
    public String getDescricao() {
        return descricao;
    }
}

// ✅ Polimorfismo
Descritivel d = Status.ATIVO;
d.getDescricao(); // "Ativo"
```

**Vantagens**:

```java
// 1. Polimorfismo
Operacao op = OperacaoMatematica.SOMA;
op.calcular(5, 3);

// 2. Padronização
interface Nomeavel { String getNome(); }
public enum Cor implements Nomeavel { }
public enum Status implements Nomeavel { }

// 3. Strategy pattern
interface Estrategia { void executar(); }
public enum TipoEstrategia implements Estrategia { }

// 4. Collections
List<Ordenavel> lista = Arrays.asList(enums);
```

**Limitações**:

```java
// ❌ Não pode estender classe
public enum E extends Classe { } // Erro

// ✅ Pode implementar múltiplas interfaces
public enum E implements I1, I2 { }
```

**Regra de Ouro**: Enum pode **implementar interfaces** (mas não estender classes). Use para **polimorfismo** (enum como outro tipo), **padronizar comportamento** (múltiplos enums implementam mesma interface), **Strategy/Command patterns**. Preferir **constant-specific implementation** (cada constante implementa método) em vez de switch genérico. Sempre usar **@Override**.
