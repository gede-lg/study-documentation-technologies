# T6.10 - Aplicação: Operações Matemáticas e Cálculos

## Introdução

**Enums com métodos abstratos**: ideal para **operações matemáticas**.

```java
public enum OperacaoMatematica {
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
    },
    MULTIPLICACAO {
        @Override
        public double calcular(double a, double b) {
            return a * b;
        }
    },
    DIVISAO {
        @Override
        public double calcular(double a, double b) {
            if (b == 0) {
                throw new ArithmeticException("Divisão por zero");
            }
            return a / b;
        }
    };
    
    public abstract double calcular(double a, double b);
}

// ✅ Calculadora simples
public class Calculadora {
    public double executar(double a, double b, OperacaoMatematica op) {
        return op.calcular(a, b);
    }
}

// Uso
Calculadora calc = new Calculadora();
double resultado = calc.executar(10, 5, OperacaoMatematica.SOMA); // 15.0
```

Cada operação = **implementação específica**.

---

## Fundamentos

### 1. Operações Básicas

```java
public enum OperacaoBasica {
    ADICAO("+") {
        @Override
        public double executar(double x, double y) {
            return x + y;
        }
    },
    SUBTRACAO("-") {
        @Override
        public double executar(double x, double y) {
            return x - y;
        }
    },
    MULTIPLICACAO("*") {
        @Override
        public double executar(double x, double y) {
            return x * y;
        }
    },
    DIVISAO("/") {
        @Override
        public double executar(double x, double y) {
            if (y == 0) {
                throw new ArithmeticException("Divisão por zero");
            }
            return x / y;
        }
    };
    
    private final String simbolo;
    
    OperacaoBasica(String simbolo) {
        this.simbolo = simbolo;
    }
    
    public String getSimbolo() {
        return simbolo;
    }
    
    public abstract double executar(double x, double y);
    
    @Override
    public String toString() {
        return simbolo;
    }
}

// ✅ Uso
double r1 = OperacaoBasica.ADICAO.executar(10, 5);        // 15.0
double r2 = OperacaoBasica.MULTIPLICACAO.executar(10, 5); // 50.0
System.out.println(OperacaoBasica.DIVISAO);               // "/"
```

### 2. Operações Avançadas

```java
public enum OperacaoAvancada {
    POTENCIA {
        @Override
        public double calcular(double base, double expoente) {
            return Math.pow(base, expoente);
        }
    },
    RAIZ_QUADRADA {
        @Override
        public double calcular(double valor, double ignorado) {
            if (valor < 0) {
                throw new IllegalArgumentException("Raiz de número negativo");
            }
            return Math.sqrt(valor);
        }
    },
    LOGARITMO {
        @Override
        public double calcular(double valor, double base) {
            if (valor <= 0 || base <= 0 || base == 1) {
                throw new IllegalArgumentException("Valores inválidos para logaritmo");
            }
            return Math.log(valor) / Math.log(base);
        }
    },
    MODULO {
        @Override
        public double calcular(double a, double b) {
            return a % b;
        }
    };
    
    public abstract double calcular(double a, double b);
}

// ✅ Uso
double potencia = OperacaoAvancada.POTENCIA.calcular(2, 3);     // 8.0
double raiz = OperacaoAvancada.RAIZ_QUADRADA.calcular(16, 0);   // 4.0
double log = OperacaoAvancada.LOGARITMO.calcular(100, 10);      // 2.0
```

### 3. Funções Trigonométricas

```java
public enum FuncaoTrigonometrica {
    SENO {
        @Override
        public double calcular(double angulo) {
            return Math.sin(Math.toRadians(angulo));
        }
    },
    COSSENO {
        @Override
        public double calcular(double angulo) {
            return Math.cos(Math.toRadians(angulo));
        }
    },
    TANGENTE {
        @Override
        public double calcular(double angulo) {
            return Math.tan(Math.toRadians(angulo));
        }
    },
    ARCO_SENO {
        @Override
        public double calcular(double valor) {
            if (valor < -1 || valor > 1) {
                throw new IllegalArgumentException("Valor deve estar entre -1 e 1");
            }
            return Math.toDegrees(Math.asin(valor));
        }
    };
    
    public abstract double calcular(double valor);
}

// ✅ Uso
double sen30 = FuncaoTrigonometrica.SENO.calcular(30);     // 0.5
double cos45 = FuncaoTrigonometrica.COSSENO.calcular(45);  // ~0.707
double asen = FuncaoTrigonometrica.ARCO_SENO.calcular(0.5); // 30.0
```

### 4. Conversões de Unidades

```java
public enum ConversaoTemperatura {
    CELSIUS_PARA_FAHRENHEIT {
        @Override
        public double converter(double celsius) {
            return (celsius * 9/5) + 32;
        }
    },
    FAHRENHEIT_PARA_CELSIUS {
        @Override
        public double converter(double fahrenheit) {
            return (fahrenheit - 32) * 5/9;
        }
    },
    CELSIUS_PARA_KELVIN {
        @Override
        public double converter(double celsius) {
            return celsius + 273.15;
        }
    },
    KELVIN_PARA_CELSIUS {
        @Override
        public double converter(double kelvin) {
            if (kelvin < 0) {
                throw new IllegalArgumentException("Kelvin não pode ser negativo");
            }
            return kelvin - 273.15;
        }
    };
    
    public abstract double converter(double valor);
}

// ✅ Uso
double f = ConversaoTemperatura.CELSIUS_PARA_FAHRENHEIT.converter(25);  // 77.0
double c = ConversaoTemperatura.FAHRENHEIT_PARA_CELSIUS.converter(77);  // 25.0
double k = ConversaoTemperatura.CELSIUS_PARA_KELVIN.converter(25);      // 298.15
```

### 5. Cálculo de Geometria

```java
public enum CalculoGeometrico {
    AREA_CIRCULO {
        @Override
        public double calcular(double... dimensoes) {
            double raio = dimensoes[0];
            return Math.PI * raio * raio;
        }
        
        @Override
        public String getFormula() {
            return "π × r²";
        }
    },
    AREA_RETANGULO {
        @Override
        public double calcular(double... dimensoes) {
            double largura = dimensoes[0];
            double altura = dimensoes[1];
            return largura * altura;
        }
        
        @Override
        public String getFormula() {
            return "largura × altura";
        }
    },
    AREA_TRIANGULO {
        @Override
        public double calcular(double... dimensoes) {
            double base = dimensoes[0];
            double altura = dimensoes[1];
            return (base * altura) / 2;
        }
        
        @Override
        public String getFormula() {
            return "(base × altura) / 2";
        }
    },
    VOLUME_ESFERA {
        @Override
        public double calcular(double... dimensoes) {
            double raio = dimensoes[0];
            return (4.0 / 3.0) * Math.PI * Math.pow(raio, 3);
        }
        
        @Override
        public String getFormula() {
            return "(4/3) × π × r³";
        }
    };
    
    public abstract double calcular(double... dimensoes);
    public abstract String getFormula();
}

// ✅ Uso
double areaCirculo = CalculoGeometrico.AREA_CIRCULO.calcular(5.0);       // ~78.54
double areaRetangulo = CalculoGeometrico.AREA_RETANGULO.calcular(4, 3);  // 12.0
double volumeEsfera = CalculoGeometrico.VOLUME_ESFERA.calcular(3.0);     // ~113.1
System.out.println(CalculoGeometrico.AREA_TRIANGULO.getFormula());       // "(base × altura) / 2"
```

### 6. Estatística

```java
public enum CalculoEstatistico {
    MEDIA {
        @Override
        public double calcular(double... valores) {
            validarVazio(valores);
            return Arrays.stream(valores).average().orElse(0);
        }
    },
    MEDIANA {
        @Override
        public double calcular(double... valores) {
            validarVazio(valores);
            double[] sorted = Arrays.stream(valores).sorted().toArray();
            int meio = sorted.length / 2;
            if (sorted.length % 2 == 0) {
                return (sorted[meio - 1] + sorted[meio]) / 2.0;
            } else {
                return sorted[meio];
            }
        }
    },
    DESVIO_PADRAO {
        @Override
        public double calcular(double... valores) {
            validarVazio(valores);
            double media = MEDIA.calcular(valores);
            double somaQuadrados = Arrays.stream(valores)
                .map(v -> Math.pow(v - media, 2))
                .sum();
            return Math.sqrt(somaQuadrados / valores.length);
        }
    },
    VARIANCIA {
        @Override
        public double calcular(double... valores) {
            validarVazio(valores);
            double desvioPadrao = DESVIO_PADRAO.calcular(valores);
            return Math.pow(desvioPadrao, 2);
        }
    };
    
    public abstract double calcular(double... valores);
    
    protected void validarVazio(double[] valores) {
        if (valores == null || valores.length == 0) {
            throw new IllegalArgumentException("Array vazio");
        }
    }
}

// ✅ Uso
double[] dados = {10, 20, 30, 40, 50};
double media = CalculoEstatistico.MEDIA.calcular(dados);           // 30.0
double mediana = CalculoEstatistico.MEDIANA.calcular(dados);       // 30.0
double desvio = CalculoEstatistico.DESVIO_PADRAO.calcular(dados);  // ~14.14
```

### 7. Cálculos Financeiros

```java
public enum CalculoFinanceiro {
    JUROS_SIMPLES {
        @Override
        public double calcular(double capital, double taxa, double tempo) {
            return capital * (taxa / 100) * tempo;
        }
        
        @Override
        public double calcularMontante(double capital, double taxa, double tempo) {
            return capital + calcular(capital, taxa, tempo);
        }
    },
    JUROS_COMPOSTOS {
        @Override
        public double calcular(double capital, double taxa, double tempo) {
            return capital * Math.pow(1 + (taxa / 100), tempo) - capital;
        }
        
        @Override
        public double calcularMontante(double capital, double taxa, double tempo) {
            return capital * Math.pow(1 + (taxa / 100), tempo);
        }
    },
    DESCONTO_PERCENTUAL {
        @Override
        public double calcular(double valor, double percentual, double ignorado) {
            return valor * (percentual / 100);
        }
        
        @Override
        public double calcularMontante(double valor, double percentual, double ignorado) {
            return valor - calcular(valor, percentual, ignorado);
        }
    };
    
    public abstract double calcular(double valor1, double valor2, double valor3);
    public abstract double calcularMontante(double valor1, double valor2, double valor3);
}

// ✅ Uso
double jurosSimples = CalculoFinanceiro.JUROS_SIMPLES.calcular(1000, 10, 2);      // 200.0
double montanteSimples = CalculoFinanceiro.JUROS_SIMPLES.calcularMontante(1000, 10, 2); // 1200.0

double jurosCompostos = CalculoFinanceiro.JUROS_COMPOSTOS.calcular(1000, 10, 2);  // 210.0
double montanteCompostos = CalculoFinanceiro.JUROS_COMPOSTOS.calcularMontante(1000, 10, 2); // 1210.0
```

### 8. Parser de Expressões

```java
public enum OperadorExpressao {
    ADICAO("+", 1) {
        @Override
        public double aplicar(double esquerda, double direita) {
            return esquerda + direita;
        }
    },
    SUBTRACAO("-", 1) {
        @Override
        public double aplicar(double esquerda, double direita) {
            return esquerda - direita;
        }
    },
    MULTIPLICACAO("*", 2) {
        @Override
        public double aplicar(double esquerda, double direita) {
            return esquerda * direita;
        }
    },
    DIVISAO("/", 2) {
        @Override
        public double aplicar(double esquerda, double direita) {
            if (direita == 0) {
                throw new ArithmeticException("Divisão por zero");
            }
            return esquerda / direita;
        }
    };
    
    private final String simbolo;
    private final int precedencia;
    
    OperadorExpressao(String simbolo, int precedencia) {
        this.simbolo = simbolo;
        this.precedencia = precedencia;
    }
    
    public String getSimbolo() {
        return simbolo;
    }
    
    public int getPrecedencia() {
        return precedencia;
    }
    
    public abstract double aplicar(double esquerda, double direita);
    
    public static OperadorExpressao fromSimbolo(String simbolo) {
        for (OperadorExpressao op : values()) {
            if (op.simbolo.equals(simbolo)) {
                return op;
            }
        }
        throw new IllegalArgumentException("Operador inválido: " + simbolo);
    }
}

// ✅ Uso
OperadorExpressao op = OperadorExpressao.fromSimbolo("+");
double resultado = op.aplicar(10, 5);  // 15.0
int prec = op.getPrecedencia();        // 1
```

### 9. Arredondamento

```java
public enum TipoArredondamento {
    PARA_CIMA {
        @Override
        public double arredondar(double valor) {
            return Math.ceil(valor);
        }
    },
    PARA_BAIXO {
        @Override
        public double arredondar(double valor) {
            return Math.floor(valor);
        }
    },
    MAIS_PROXIMO {
        @Override
        public double arredondar(double valor) {
            return Math.round(valor);
        }
    },
    DUAS_CASAS {
        @Override
        public double arredondar(double valor) {
            return Math.round(valor * 100.0) / 100.0;
        }
    },
    TRUNCAR {
        @Override
        public double arredondar(double valor) {
            return (double) (int) valor;
        }
    };
    
    public abstract double arredondar(double valor);
}

// ✅ Uso
double v1 = TipoArredondamento.PARA_CIMA.arredondar(3.2);     // 4.0
double v2 = TipoArredondamento.PARA_BAIXO.arredondar(3.8);    // 3.0
double v3 = TipoArredondamento.MAIS_PROXIMO.arredondar(3.5);  // 4.0
double v4 = TipoArredondamento.DUAS_CASAS.arredondar(3.456);  // 3.46
```

### 10. Validação Numérica

```java
public enum ValidacaoNumerica {
    POSITIVO {
        @Override
        public boolean validar(double valor) {
            return valor > 0;
        }
        
        @Override
        public String getMensagemErro() {
            return "Valor deve ser positivo";
        }
    },
    NAO_NEGATIVO {
        @Override
        public boolean validar(double valor) {
            return valor >= 0;
        }
        
        @Override
        public String getMensagemErro() {
            return "Valor não pode ser negativo";
        }
    },
    INTEIRO {
        @Override
        public boolean validar(double valor) {
            return valor == Math.floor(valor);
        }
        
        @Override
        public String getMensagemErro() {
            return "Valor deve ser inteiro";
        }
    },
    FINITO {
        @Override
        public boolean validar(double valor) {
            return Double.isFinite(valor);
        }
        
        @Override
        public String getMensagemErro() {
            return "Valor deve ser finito (não Infinity ou NaN)";
        }
    };
    
    public abstract boolean validar(double valor);
    public abstract String getMensagemErro();
    
    public void validarOuLancar(double valor) {
        if (!validar(valor)) {
            throw new IllegalArgumentException(getMensagemErro() + ": " + valor);
        }
    }
}

// ✅ Uso
boolean ok1 = ValidacaoNumerica.POSITIVO.validar(5.0);   // true
boolean ok2 = ValidacaoNumerica.INTEIRO.validar(5.5);    // false

try {
    ValidacaoNumerica.POSITIVO.validarOuLancar(-5);
} catch (IllegalArgumentException e) {
    System.out.println(e.getMessage()); // "Valor deve ser positivo: -5.0"
}
```

---

## Aplicabilidade

**Enum para operações matemáticas** quando:
- Conjunto **fixo** de operações
- Cada operação tem **lógica específica**
- Evitar `switch` complexo
- Strategy pattern para cálculos
- Calculadora, conversões, estatística

**Vantagens**:
- Código limpo
- Tipo seguro
- Fácil adicionar operação
- Polimórfico

---

## Armadilhas

### 1. Validação Faltando

```java
// ❌ Sem validação
DIVISAO {
    @Override
    public double calcular(double a, double b) {
        return a / b; // ⚠️ Divisão por zero
    }
};

// ✅ Com validação
DIVISAO {
    @Override
    public double calcular(double a, double b) {
        if (b == 0) {
            throw new ArithmeticException("Divisão por zero");
        }
        return a / b;
    }
};
```

### 2. Parâmetros Ignorados

```java
// ⚠️ Parâmetro b ignorado
RAIZ {
    @Override
    public double calcular(double a, double b) {
        return Math.sqrt(a); // b não usado
    }
};

// ✅ Documentar ou usar varargs
public abstract double calcular(double... valores);
```

### 3. Overflow/Underflow

```java
// ⚠️ Não trata overflow
POTENCIA {
    @Override
    public double calcular(double base, double exp) {
        return Math.pow(base, exp); // Pode retornar Infinity
    }
};

// ✅ Validar resultado
if (Double.isInfinite(resultado)) {
    throw new ArithmeticException("Overflow");
}
```

---

## Boas Práticas

### 1. Validar Entrada

```java
DIVISAO {
    @Override
    public double calcular(double a, double b) {
        if (b == 0) {
            throw new ArithmeticException("Divisão por zero");
        }
        return a / b;
    }
};
```

### 2. Documentar Fórmula

```java
/**
 * Calcula área do círculo: π × r²
 */
AREA_CIRCULO {
    @Override
    public double calcular(double raio) {
        return Math.PI * raio * raio;
    }
};
```

### 3. Usar Constantes

```java
private static final double KELVIN_OFFSET = 273.15;

CELSIUS_PARA_KELVIN {
    @Override
    public double converter(double celsius) {
        return celsius + KELVIN_OFFSET;
    }
};
```

### 4. Métodos Auxiliares

```java
protected void validarPositivo(double valor) {
    if (valor < 0) {
        throw new IllegalArgumentException("Valor negativo");
    }
}
```

---

## Resumo

**Enum para operações matemáticas**:

```java
public enum OperacaoMatematica {
    SOMA {
        @Override
        public double calcular(double a, double b) {
            return a + b;
        }
    },
    DIVISAO {
        @Override
        public double calcular(double a, double b) {
            if (b == 0) {
                throw new ArithmeticException("Divisão por zero");
            }
            return a / b;
        }
    };
    
    public abstract double calcular(double a, double b);
}

// ✅ Uso
double resultado = OperacaoMatematica.SOMA.calcular(10, 5);     // 15.0
double quociente = OperacaoMatematica.DIVISAO.calcular(10, 5);  // 2.0
```

**Aplicações**:
- Operações básicas (+, -, *, /)
- Funções avançadas (potência, raiz, log)
- Trigonometria
- Conversões de unidades
- Geometria
- Estatística
- Cálculos financeiros

**Regra de Ouro**: **Enum** ideal para operações matemáticas com conjunto **fixo**. Cada constante = **operação específica**. **Valide** entradas (divisão por zero, raiz negativa). **Documente** fórmulas. Mais **limpo** que `switch`. **Tipo seguro** e **polimórfico**.
