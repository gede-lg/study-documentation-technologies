# T8.02 - Sintaxe: enum implements Interface

## Introdução

**Sintaxe**: `enum NomeEnum implements Interface { }`

```java
interface Operacao {
    double calcular(double a, double b);
}

// ✅ Sintaxe: enum implements Interface
public enum Op implements Operacao {
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
```

**implements**: palavra-chave para implementar interface.

---

## Fundamentos

### 1. Sintaxe Básica

```java
interface Descritivel {
    String getDescricao();
}

// ✅ enum NomeEnum implements Interface
public enum Status implements Descritivel {
    ATIVO,
    INATIVO;
    
    @Override
    public String getDescricao() {
        return name().toLowerCase();
    }
}
```

### 2. Enum com Atributos e Interface

```java
interface Nomeavel {
    String getNome();
}

public enum Cor implements Nomeavel {
    VERMELHO("Vermelho"),  // ✅ Constantes com argumentos
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

// ✅ Implementar todos os métodos
public enum Moeda implements Formatavel {
    REAL("R$", "Real");
    
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
```

### 4. Constant-Specific Implementation

```java
interface Operacao {
    double executar(double a, double b);
}

// ✅ Cada constante implementa
public enum Op implements Operacao {
    SOMA {
        @Override
        public double executar(double a, double b) {
            return a + b;
        }
    },
    SUBTRACAO {
        @Override
        public double executar(double a, double b) {
            return a - b;
        }
    }
}
```

### 5. Interface Funcional

```java
@FunctionalInterface
interface Calculavel {
    double calcular(double valor);
}

// ✅ Enum implementa interface funcional
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
```

### 6. Múltiplas Interfaces

```java
interface Nomeavel {
    String getNome();
}

interface Descritivel {
    String getDescricao();
}

// ✅ Múltiplas interfaces separadas por vírgula
public enum Status implements Nomeavel, Descritivel {
    ATIVO("Ativo", "Status ativo");
    
    private final String nome;
    private final String descricao;
    
    Status(String nome, String descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }
    
    @Override
    public String getNome() {
        return nome;
    }
    
    @Override
    public String getDescricao() {
        return descricao;
    }
}
```

### 7. Interface com Default Method

```java
interface Formatavel {
    String formatar();
    
    // ✅ Método default
    default String formatarCompleto() {
        return "[" + formatar() + "]";
    }
}

// ✅ Enum pode usar método default
public enum Cor implements Formatavel {
    VERMELHO("Vermelho");
    
    private final String nome;
    
    Cor(String nome) {
        this.nome = nome;
    }
    
    @Override
    public String formatar() {
        return nome;
    }
    
    // ✅ formatarCompleto() herdado (default)
}

String completo = Cor.VERMELHO.formatarCompleto(); // "[Vermelho]"
```

### 8. Sobrescrever Default Method

```java
interface Formatavel {
    String formatar();
    
    default String formatarCompleto() {
        return "[" + formatar() + "]";
    }
}

public enum Moeda implements Formatavel {
    REAL("R$");
    
    private final String simbolo;
    
    Moeda(String simbolo) {
        this.simbolo = simbolo;
    }
    
    @Override
    public String formatar() {
        return simbolo;
    }
    
    // ✅ Sobrescrever método default
    @Override
    public String formatarCompleto() {
        return simbolo + " - Moeda";
    }
}
```

### 9. Interface com Generics

```java
interface Conversor<T> {
    T converter(String valor);
}

// ✅ Especificar tipo genérico
public enum TipoConversao implements Conversor<Number> {
    INTEIRO {
        @Override
        public Number converter(String valor) {
            return Integer.parseInt(valor);
        }
    },
    DOUBLE {
        @Override
        public Number converter(String valor) {
            return Double.parseDouble(valor);
        }
    }
}
```

### 10. Modificador de Acesso

```java
interface Operacao {
    double calcular(double a, double b);
}

// ✅ public enum
public enum Op implements Operacao {
    SOMA;
    
    @Override
    public double calcular(double a, double b) {
        return a + b;
    }
}

// ✅ enum package-private (sem public)
enum OpInterna implements Operacao {
    DIVISAO;
    
    @Override
    public double calcular(double a, double b) {
        return a / b;
    }
}
```

---

## Aplicabilidade

**Sintaxe enum implements** para:
- Implementar uma ou mais interfaces
- Constant-specific implementation
- Polimorfismo
- Strategy/Command patterns

---

## Armadilhas

### 1. Esquecer @Override

```java
interface Nomeavel {
    String getNome();
}

// ⚠️ Sem @Override
public enum Status implements Nomeavel {
    ATIVO;
    
    // ⚠️ Sem @Override (compila, mas menos seguro)
    public String getNome() {
        return name();
    }
}

// ✅ Com @Override
@Override
public String getNome() {
    return name();
}
```

### 2. Não Implementar Todos os Métodos

```java
interface Formatavel {
    String formatar();
    String formatarCompleto();
}

// ❌ Não implementa formatarCompleto()
public enum Cor implements Formatavel {
    VERMELHO;
    
    @Override
    public String formatar() {
        return "R";
    }
    // ❌ Erro: falta formatarCompleto()
}

// ✅ Implementar todos
@Override
public String formatarCompleto() {
    return "Vermelho";
}
```

### 3. Ordem das Palavras-Chave

```java
// ❌ Ordem incorreta
public implements Operacao enum Op { } // Erro

// ✅ Ordem correta
public enum Op implements Operacao { }
```

---

## Boas Práticas

### 1. Sempre @Override

```java
// ✅ @Override explícito
@Override
public String getDescricao() {
    return descricao;
}
```

### 2. Implementar Todos os Métodos

```java
// ✅ Todos os métodos implementados
public enum Status implements Formatavel {
    ATIVO;
    
    @Override
    public String formatar() { return "A"; }
    
    @Override
    public String formatarCompleto() { return "Ativo"; }
}
```

### 3. Documentar Interface

```java
// ✅ Javadoc
/**
 * Enum de operações matemáticas.
 * Implementa {@link Operacao} para cálculos.
 */
public enum Op implements Operacao {
    // ...
}
```

### 4. Modificador Público

```java
// ✅ public se usado fora do package
public enum Status implements Descritivel { }

// ✅ package-private se interno
enum StatusInterno implements Descritivel { }
```

---

## Resumo

**Sintaxe**:

```java
// ✅ Sintaxe básica
public enum NomeEnum implements Interface {
    CONSTANTE1,
    CONSTANTE2;
    
    @Override
    public TipoRetorno metodo() {
        // implementação
    }
}
```

**Múltiplas interfaces**:

```java
// ✅ Implementar múltiplas interfaces
public enum Status implements I1, I2, I3 {
    ATIVO;
    
    @Override
    public void metodo1() { }
    
    @Override
    public void metodo2() { }
    
    @Override
    public void metodo3() { }
}
```

**Constant-specific**:

```java
// ✅ Cada constante implementa
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

**Interface com default method**:

```java
interface Formatavel {
    String formatar();
    
    default String formatarCompleto() {
        return "[" + formatar() + "]";
    }
}

// ✅ Enum usa método default
public enum Cor implements Formatavel {
    VERMELHO;
    
    @Override
    public String formatar() {
        return "R";
    }
    
    // formatarCompleto() herdado (default)
}
```

**Regra de Ouro**: Sintaxe **`enum NomeEnum implements Interface`**. Múltiplas interfaces separadas por **vírgula**. Sempre usar **@Override**. Implementar **todos os métodos** (exceto default). Preferir **constant-specific** para comportamento diferente por constante. Modificador **public** se usado fora do package.
