# T8.08 - Exemplo: Calculadora com Operações

## Introdução

**Calculadora com enums**: operações matemáticas implementadas como enums.

```java
interface Operacao {
    double calcular(double a, double b);
    String getSimbolo();
}

public enum OperacaoMatematica implements Operacao {
    SOMA("+") {
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    },
    SUBTRACAO("-") {
        @Override
        public double calcular(double a, double b) {
            return a - b;
        }
    },
    MULTIPLICACAO("*") {
        @Override
        public double calcular(double a, double b) {
            return a * b;
        }
    },
    DIVISAO("/") {
        @Override
        public double calcular(double a, double b) {
            if (b == 0) {
                throw new ArithmeticException("Divisão por zero");
            }
            return a / b;
        }
    };
    
    private final String simbolo;
    
    OperacaoMatematica(String simbolo) {
        this.simbolo = simbolo;
    }
    
    @Override
    public String getSimbolo() {
        return simbolo;
    }
}

// ✅ Usar
double resultado = OperacaoMatematica.SOMA.calcular(10, 5); // 15.0
String simbolo = OperacaoMatematica.SOMA.getSimbolo();      // "+"
```

**Strategy Pattern**: cada operação é uma estratégia diferente.

---

## Fundamentos

### 1. Calculadora Básica

```java
interface Calculavel {
    double calcular(double a, double b);
}

public enum Operacao implements Calculavel {
    SOMA {
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    },
    SUBTRACAO {
        @Override
        public double calcular(double a, double b) {
            return a - b;
        }
    }
}

// ✅ Calculadora
public class Calculadora {
    public double calcular(Operacao op, double a, double b) {
        return op.calcular(a, b);
    }
}

Calculadora calc = new Calculadora();
double resultado = calc.calcular(Operacao.SOMA, 10, 5); // 15.0
```

### 2. Operações com Símbolo

```java
interface Operacao {
    double executar(double a, double b);
    String getSimbolo();
}

public enum Op implements Operacao {
    SOMA("+"),
    SUBTRACAO("-"),
    MULTIPLICACAO("*"),
    DIVISAO("/");
    
    private final String simbolo;
    
    Op(String simbolo) {
        this.simbolo = simbolo;
    }
    
    @Override
    public double executar(double a, double b) {
        switch (this) {
            case SOMA: return a + b;
            case SUBTRACAO: return a - b;
            case MULTIPLICACAO: return a * b;
            case DIVISAO: 
                if (b == 0) throw new ArithmeticException("Divisão por zero");
                return a / b;
            default: throw new IllegalStateException();
        }
    }
    
    @Override
    public String getSimbolo() {
        return simbolo;
    }
}

String expressao = "10 " + Op.SOMA.getSimbolo() + " 5 = " + Op.SOMA.executar(10, 5);
// "10 + 5 = 15.0"
```

### 3. Parser de Operação

```java
interface Operacao {
    double calcular(double a, double b);
    String getSimbolo();
}

public enum Op implements Operacao {
    SOMA("+") {
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    },
    SUBTRACAO("-") {
        @Override
        public double calcular(double a, double b) {
            return a - b;
        }
    };
    
    private final String simbolo;
    
    Op(String simbolo) {
        this.simbolo = simbolo;
    }
    
    @Override
    public String getSimbolo() {
        return simbolo;
    }
    
    // ✅ Parser: símbolo → operação
    public static Op porSimbolo(String simbolo) {
        for (Op op : values()) {
            if (op.getSimbolo().equals(simbolo)) {
                return op;
            }
        }
        throw new IllegalArgumentException("Símbolo inválido: " + simbolo);
    }
}

Op op = Op.porSimbolo("+");
double resultado = op.calcular(10, 5); // 15.0
```

### 4. Calculadora com Histórico

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

public class Calculadora {
    private final List<String> historico = new ArrayList<>();
    
    public double calcular(Operacao op, double a, double b) {
        double resultado = op.calcular(a, b);
        historico.add(a + " " + op + " " + b + " = " + resultado);
        return resultado;
    }
    
    public List<String> getHistorico() {
        return new ArrayList<>(historico);
    }
}
```

### 5. Validação de Operação

```java
interface Operacao {
    double executar(double a, double b);
    boolean validar(double a, double b);
}

public enum Op implements Operacao {
    DIVISAO {
        @Override
        public double executar(double a, double b) {
            if (!validar(a, b)) {
                throw new ArithmeticException("Divisão por zero");
            }
            return a / b;
        }
        
        @Override
        public boolean validar(double a, double b) {
            return b != 0;
        }
    }
}

if (Op.DIVISAO.validar(10, 0)) {
    double resultado = Op.DIVISAO.executar(10, 0);
} else {
    System.out.println("Operação inválida");
}
```

### 6. Operações Encadeadas

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
    },
    MULTIPLICACAO {
        @Override
        public double calcular(double a, double b) {
            return a * b;
        }
    }
}

// ✅ Encadear operações
double resultado = Op.MULTIPLICACAO.calcular(
    Op.SOMA.calcular(10, 5),  // 15
    2                          // 15 * 2
); // 30.0
```

### 7. Operações com Prioridade

```java
interface Operacao {
    double calcular(double a, double b);
    int getPrioridade();
}

public enum Op implements Operacao {
    SOMA("+", 1) {
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    },
    MULTIPLICACAO("*", 2) {
        @Override
        public double calcular(double a, double b) {
            return a * b;
        }
    };
    
    private final String simbolo;
    private final int prioridade;
    
    Op(String simbolo, int prioridade) {
        this.simbolo = simbolo;
        this.prioridade = prioridade;
    }
    
    @Override
    public int getPrioridade() {
        return prioridade;
    }
    
    public String getSimbolo() {
        return simbolo;
    }
}

// ✅ Ordenar por prioridade
List<Op> ops = Arrays.asList(Op.values());
ops.sort(Comparator.comparingInt(Op::getPrioridade));
```

### 8. Formatação de Resultado

```java
interface Operacao {
    double calcular(double a, double b);
    String formatar(double a, double b, double resultado);
}

public enum Op implements Operacao {
    SOMA("+") {
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    };
    
    private final String simbolo;
    
    Op(String simbolo) {
        this.simbolo = simbolo;
    }
    
    @Override
    public String formatar(double a, double b, double resultado) {
        return String.format("%.2f %s %.2f = %.2f", a, simbolo, b, resultado);
    }
}

double resultado = Op.SOMA.calcular(10, 5);
String formatado = Op.SOMA.formatar(10, 5, resultado);
// "10.00 + 5.00 = 15.00"
```

### 9. Operações Científicas

```java
interface Operacao {
    double calcular(double a, double b);
}

public enum OpCientifica implements Operacao {
    POTENCIA {
        @Override
        public double calcular(double a, double b) {
            return Math.pow(a, b);
        }
    },
    RAIZ {
        @Override
        public double calcular(double a, double b) {
            return Math.pow(a, 1.0 / b);
        }
    },
    LOG {
        @Override
        public double calcular(double a, double b) {
            return Math.log(a) / Math.log(b);
        }
    }
}

double potencia = OpCientifica.POTENCIA.calcular(2, 3); // 8.0 (2³)
double raiz = OpCientifica.RAIZ.calcular(8, 3);         // 2.0 (∛8)
```

### 10. Calculadora Completa

```java
interface Operacao {
    double executar(double a, double b);
    String getSimbolo();
    boolean validar(double a, double b);
}

public enum Op implements Operacao {
    SOMA("+") {
        @Override
        public double executar(double a, double b) {
            return a + b;
        }
        
        @Override
        public boolean validar(double a, double b) {
            return true;
        }
    },
    SUBTRACAO("-") {
        @Override
        public double executar(double a, double b) {
            return a - b;
        }
        
        @Override
        public boolean validar(double a, double b) {
            return true;
        }
    },
    MULTIPLICACAO("*") {
        @Override
        public double executar(double a, double b) {
            return a * b;
        }
        
        @Override
        public boolean validar(double a, double b) {
            return true;
        }
    },
    DIVISAO("/") {
        @Override
        public double executar(double a, double b) {
            if (!validar(a, b)) {
                throw new ArithmeticException("Divisão por zero");
            }
            return a / b;
        }
        
        @Override
        public boolean validar(double a, double b) {
            return b != 0;
        }
    };
    
    private final String simbolo;
    
    Op(String simbolo) {
        this.simbolo = simbolo;
    }
    
    @Override
    public String getSimbolo() {
        return simbolo;
    }
    
    public static Op porSimbolo(String simbolo) {
        for (Op op : values()) {
            if (op.getSimbolo().equals(simbolo)) {
                return op;
            }
        }
        throw new IllegalArgumentException("Símbolo inválido: " + simbolo);
    }
}

public class Calculadora {
    public double calcular(String simbolo, double a, double b) {
        Op op = Op.porSimbolo(simbolo);
        if (!op.validar(a, b)) {
            throw new IllegalArgumentException("Operação inválida");
        }
        return op.executar(a, b);
    }
}

Calculadora calc = new Calculadora();
double resultado = calc.calcular("+", 10, 5); // 15.0
```

---

## Aplicabilidade

**Calculadora com enums** para:
- Strategy pattern
- Operações polimórficas
- Validação e formatação
- Parser de expressões

---

## Armadilhas

### 1. Divisão por Zero

```java
// ⚠️ Sem validação
DIVISAO {
    @Override
    public double calcular(double a, double b) {
        return a / b; // ⚠️ Infinity se b == 0
    }
}

// ✅ Validar
DIVISAO {
    @Override
    public double calcular(double a, double b) {
        if (b == 0) {
            throw new ArithmeticException("Divisão por zero");
        }
        return a / b;
    }
}
```

### 2. Switch sem Default

```java
// ⚠️ Sem default
@Override
public double calcular(double a, double b) {
    switch (this) {
        case SOMA: return a + b;
        // ⚠️ E se adicionar nova constante?
    }
    return 0; // ⚠️ Valor padrão inadequado
}

// ✅ Com default
default: throw new IllegalStateException("Operação não implementada");
```

### 3. Não Validar Entrada

```java
// ⚠️ Não valida
public double calcular(double a, double b) {
    return a / b;
}

// ✅ Validar
public boolean validar(double a, double b) {
    return b != 0;
}

if (op.validar(a, b)) {
    double resultado = op.calcular(a, b);
}
```

---

## Boas Práticas

### 1. Constant-Specific Implementation

```java
// ✅ Cada constante implementa
SOMA {
    @Override
    public double calcular(double a, double b) {
        return a + b;
    }
}
```

### 2. Validação

```java
// ✅ Método de validação
public boolean validar(double a, double b) {
    return b != 0; // para divisão
}
```

### 3. Parser

```java
// ✅ Método static para lookup
public static Op porSimbolo(String simbolo) {
    for (Op op : values()) {
        if (op.getSimbolo().equals(simbolo)) {
            return op;
        }
    }
    throw new IllegalArgumentException("Inválido: " + simbolo);
}
```

### 4. Documentar

```java
// ✅ Javadoc
/**
 * Operações matemáticas básicas.
 * @see Operacao
 */
public enum Op implements Operacao {
    // ...
}
```

---

## Resumo

**Calculadora com enums**:

```java
interface Operacao {
    double calcular(double a, double b);
    String getSimbolo();
}

public enum Op implements Operacao {
    SOMA("+") {
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    },
    DIVISAO("/") {
        @Override
        public double calcular(double a, double b) {
            if (b == 0) throw new ArithmeticException("Divisão por zero");
            return a / b;
        }
    };
    
    private final String simbolo;
    
    Op(String simbolo) {
        this.simbolo = simbolo;
    }
    
    @Override
    public String getSimbolo() {
        return simbolo;
    }
    
    public static Op porSimbolo(String simbolo) {
        for (Op op : values()) {
            if (op.getSimbolo().equals(simbolo)) return op;
        }
        throw new IllegalArgumentException("Inválido: " + simbolo);
    }
}

// ✅ Usar
double resultado = Op.SOMA.calcular(10, 5); // 15.0
Op op = Op.porSimbolo("+");
```

**Regra de Ouro**: **Strategy Pattern** com enums. Cada constante é uma **estratégia** (constant-specific). **Validar** entradas (divisão por zero). **Parser** para converter símbolo → enum. **Interface** para polimorfismo. **Prioridade** para ordem de operações. **Formatação** de resultado.
