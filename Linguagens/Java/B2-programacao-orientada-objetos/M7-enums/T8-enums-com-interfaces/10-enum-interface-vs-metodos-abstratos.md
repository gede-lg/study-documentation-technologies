# T8.10 - Enum Interface vs Métodos Abstratos

## Introdução

**Duas abordagens**: interface ou métodos abstratos no enum.

```java
// ✅ Abordagem 1: Interface
interface Operacao {
    double calcular(double a, double b);
}

public enum Op1 implements Operacao {
    SOMA {
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    }
}

// ✅ Abordagem 2: Método abstrato
public enum Op2 {
    SOMA {
        @Override
        double calcular(double a, double b) {
            return a + b;
        }
    };
    
    abstract double calcular(double a, double b);
}
```

**Quando usar cada uma**: depende do contexto e necessidade de polimorfismo.

---

## Fundamentos

### 1. Interface: Polimorfismo Externo

```java
interface Operacao {
    double executar(double a, double b);
}

// ✅ Enum implementa interface
public enum Op implements Operacao {
    SOMA {
        @Override
        public double executar(double a, double b) {
            return a + b;
        }
    }
}

// ✅ Polimorfismo: usar como interface
Operacao op = Op.SOMA;
double resultado = op.executar(10, 5);

// ✅ Método aceita interface (não enum)
public void processar(Operacao op, double a, double b) {
    double resultado = op.executar(a, b);
}
```

### 2. Método Abstrato: Encapsulado

```java
// ✅ Método abstrato no enum
public enum Op {
    SOMA {
        @Override
        double executar(double a, double b) {
            return a + b;
        }
    },
    SUBTRACAO {
        @Override
        double executar(double a, double b) {
            return a - b;
        }
    };
    
    // ✅ Método abstrato (cada constante implementa)
    abstract double executar(double a, double b);
}

// ✅ Uso direto
double resultado = Op.SOMA.executar(10, 5);

// ⚠️ Sem polimorfismo externo
// Não pode: Operacao op = Op.SOMA;
```

### 3. Interface: Múltiplos Enums

```java
interface Calculavel {
    double calcular(double valor);
}

// ✅ Enum 1 implementa
public enum Desconto implements Calculavel {
    VIP(0.20);
    
    private final double percentual;
    
    Desconto(double percentual) {
        this.percentual = percentual;
    }
    
    @Override
    public double calcular(double valor) {
        return valor - (valor * percentual);
    }
}

// ✅ Enum 2 implementa
public enum Taxa implements Calculavel {
    SERVICO(0.10);
    
    private final double percentual;
    
    Taxa(double percentual) {
        this.percentual = percentual;
    }
    
    @Override
    public double calcular(double valor) {
        return valor + (valor * percentual);
    }
}

// ✅ Lista polimórfica
List<Calculavel> lista = new ArrayList<>();
lista.add(Desconto.VIP);
lista.add(Taxa.SERVICO);

for (Calculavel c : lista) {
    double resultado = c.calcular(100);
}
```

### 4. Método Abstrato: Isolado

```java
// ✅ Método abstrato (sem interface)
public enum Status {
    ATIVO {
        @Override
        String getDescricao() {
            return "Status ativo";
        }
    },
    INATIVO {
        @Override
        String getDescricao() {
            return "Status inativo";
        }
    };
    
    abstract String getDescricao();
}

// ✅ Uso direto
String desc = Status.ATIVO.getDescricao();

// ⚠️ Não compartilha com outros enums
```

### 5. Interface: Testabilidade

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
    }
}

// ✅ Mock de interface (testes)
public void testar() {
    Executavel mock = () -> System.out.println("Mock");
    processar(mock);
}

public void processar(Executavel e) {
    e.executar();
}
```

### 6. Método Abstrato: Simplicidade

```java
// ✅ Simples: sem interface
public enum Cor {
    VERMELHO {
        @Override
        String getCodigo() {
            return "#FF0000";
        }
    },
    VERDE {
        @Override
        String getCodigo() {
            return "#00FF00";
        }
    };
    
    abstract String getCodigo();
}

// ✅ Uso direto
String codigo = Cor.VERMELHO.getCodigo();
```

### 7. Interface: Segregação

```java
// ✅ Interfaces segregadas
interface Executavel {
    void executar();
}

interface Reversivel {
    void reverter();
}

// ✅ Enum implementa apenas necessário
public enum ComandoSimples implements Executavel {
    IMPRIMIR {
        @Override
        public void executar() { }
    }
}

// ✅ Enum implementa ambas
public enum ComandoCompleto implements Executavel, Reversivel {
    SALVAR {
        @Override
        public void executar() { }
        
        @Override
        public void reverter() { }
    }
}
```

### 8. Método Abstrato: Múltiplos Métodos

```java
// ✅ Múltiplos métodos abstratos
public enum Produto {
    NOTEBOOK {
        @Override
        double getPreco() {
            return 3000;
        }
        
        @Override
        String getCategoria() {
            return "Eletrônicos";
        }
        
        @Override
        boolean temDesconto() {
            return true;
        }
    };
    
    abstract double getPreco();
    abstract String getCategoria();
    abstract boolean temDesconto();
}
```

### 9. Interface: Hierarquia de Tipos

```java
interface Base {
    String getId();
}

interface Nomeavel extends Base {
    String getNome();
}

// ✅ Enum participa da hierarquia
public enum Categoria implements Nomeavel {
    TECNOLOGIA("TEC", "Tecnologia");
    
    private final String id;
    private final String nome;
    
    Categoria(String id, String nome) {
        this.id = id;
        this.nome = nome;
    }
    
    @Override
    public String getId() { return id; }
    
    @Override
    public String getNome() { return nome; }
}

// ✅ Polimorfismo pela hierarquia
Base b = Categoria.TECNOLOGIA;
Nomeavel n = Categoria.TECNOLOGIA;
```

### 10. Quando Usar Cada Uma

```java
// ✅ Use INTERFACE quando:
// - Precisa polimorfismo externo
// - Múltiplos enums implementam mesma interface
// - Testabilidade (mocks)
// - Segregação de comportamento
interface Operacao {
    double calcular(double a, double b);
}

public enum Op implements Operacao {
    SOMA {
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    }
}

// ✅ Use MÉTODO ABSTRATO quando:
// - Comportamento interno ao enum
// - Sem necessidade de polimorfismo externo
// - Simplicidade
public enum Status {
    ATIVO {
        @Override
        String getDescricao() {
            return "Ativo";
        }
    };
    
    abstract String getDescricao();
}
```

---

## Aplicabilidade

**Interface** para:
- Polimorfismo externo
- Múltiplos enums
- Testabilidade
- Segregação

**Método abstrato** para:
- Comportamento interno
- Simplicidade
- Sem polimorfismo externo

---

## Armadilhas

### 1. Interface Desnecessária

```java
// ⚠️ Interface só para um enum
interface Descritivel {
    String getDescricao();
}

public enum Status implements Descritivel {
    ATIVO {
        @Override
        public String getDescricao() { return "Ativo"; }
    }
}

// ✅ Método abstrato é suficiente
public enum Status {
    ATIVO {
        @Override
        String getDescricao() { return "Ativo"; }
    };
    
    abstract String getDescricao();
}
```

### 2. Método Abstrato sem Polimorfismo

```java
// ⚠️ Método abstrato quando precisa polimorfismo
public enum Op {
    SOMA {
        @Override
        double calcular(double a, double b) { return a + b; }
    };
    
    abstract double calcular(double a, double b);
}

// ⚠️ Não pode fazer:
// void processar(??? op) // Qual tipo?

// ✅ Interface permite polimorfismo
interface Operacao {
    double calcular(double a, double b);
}

void processar(Operacao op) { } // ✅ Aceita qualquer Operacao
```

### 3. Múltiplas Interfaces vs Múltiplos Abstratos

```java
// ⚠️ Múltiplos métodos abstratos (acoplado)
public enum E {
    C {
        @Override void m1() { }
        @Override void m2() { }
        @Override void m3() { }
    };
    
    abstract void m1();
    abstract void m2();
    abstract void m3();
}

// ✅ Interfaces segregadas (flexível)
interface I1 { void m1(); }
interface I2 { void m2(); }
interface I3 { void m3(); }

public enum E implements I1, I2, I3 {
    C {
        @Override public void m1() { }
        @Override public void m2() { }
        @Override public void m3() { }
    }
}
```

---

## Boas Práticas

### 1. Interface para Polimorfismo

```java
// ✅ Interface se precisa polimorfismo
interface Operacao {
    double calcular(double a, double b);
}

public enum Op implements Operacao { }

void processar(Operacao op) { }
```

### 2. Método Abstrato para Interno

```java
// ✅ Método abstrato para comportamento interno
public enum Status {
    ATIVO {
        @Override
        String getDescricao() { return "Ativo"; }
    };
    
    abstract String getDescricao();
}
```

### 3. Combinar Ambos

```java
// ✅ Interface + método abstrato
interface Operacao {
    double calcular(double a, double b);
}

public enum Op implements Operacao {
    SOMA {
        @Override
        public double calcular(double a, double b) {
            return executar(a, b); // ✅ Usa método abstrato interno
        }
        
        @Override
        double executar(double a, double b) {
            return a + b;
        }
    };
    
    abstract double executar(double a, double b);
}
```

### 4. Documentar Escolha

```java
// ✅ Javadoc
/**
 * Operações matemáticas.
 * Implementa {@link Operacao} para polimorfismo externo.
 */
public enum Op implements Operacao {
    // ...
}
```

---

## Resumo

**Interface**:

```java
interface Operacao {
    double calcular(double a, double b);
}

public enum Op implements Operacao {
    SOMA {
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    }
}

// ✅ Polimorfismo
Operacao op = Op.SOMA;
void processar(Operacao op) { }
```

**Método abstrato**:

```java
public enum Status {
    ATIVO {
        @Override
        String getDescricao() {
            return "Ativo";
        }
    };
    
    abstract String getDescricao();
}

// ✅ Uso direto
String desc = Status.ATIVO.getDescricao();
```

**Quando usar**:

```java
// ✅ INTERFACE quando:
// - Polimorfismo externo
// - Múltiplos enums implementam
// - Testabilidade (mocks)
// - Segregação (múltiplas interfaces)

// ✅ MÉTODO ABSTRATO quando:
// - Comportamento interno
// - Sem polimorfismo externo
// - Simplicidade
// - Único enum
```

**Regra de Ouro**: Use **interface** para **polimorfismo externo** (enum como outro tipo, múltiplos enums implementam mesma interface, testabilidade). Use **método abstrato** para **comportamento interno** (sem polimorfismo externo, simplicidade, único enum). Pode **combinar ambos**. Interface é mais **flexível**. Método abstrato é mais **simples**.
