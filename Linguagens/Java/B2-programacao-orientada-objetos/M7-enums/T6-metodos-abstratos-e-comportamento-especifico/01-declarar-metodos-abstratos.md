# T6.01 - Declarar Métodos Abstratos em Enum

## Introdução

**Método abstrato em enum**: cada constante **deve implementar**.

```java
// ✅ Enum com método abstrato
public enum Operacao {
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
    };
    
    // Método abstrato: cada constante DEVE implementar
    public abstract double calcular(double a, double b);
}

// ✅ Uso
double resultado = Operacao.SOMA.calcular(10, 5); // 15.0
double resultado = Operacao.SUBTRACAO.calcular(10, 5); // 5.0
```

Método abstrato força **comportamento específico** por constante.

---

## Fundamentos

### 1. Sintaxe Básica

```java
public enum DiaSemana {
    SEGUNDA {
        @Override
        public boolean isUtil() {
            return true;
        }
    },
    SABADO {
        @Override
        public boolean isUtil() {
            return false;
        }
    },
    DOMINGO {
        @Override
        public boolean isUtil() {
            return false;
        }
    };
    
    // Método abstrato
    public abstract boolean isUtil();
}

// ✅ Uso
if (DiaSemana.SEGUNDA.isUtil()) {
    System.out.println("Dia útil");
}
```

### 2. Modificador Abstract

```java
public enum Forma {
    CIRCULO {
        @Override
        public double calcularArea(double... dimensoes) {
            double raio = dimensoes[0];
            return Math.PI * raio * raio;
        }
    },
    RETANGULO {
        @Override
        public double calcularArea(double... dimensoes) {
            double largura = dimensoes[0];
            double altura = dimensoes[1];
            return largura * altura;
        }
    };
    
    // abstract é obrigatório
    public abstract double calcularArea(double... dimensoes);
}

// ✅ Uso
double area = Forma.CIRCULO.calcularArea(5.0); // π * 5²
double area = Forma.RETANGULO.calcularArea(4.0, 3.0); // 12.0
```

### 3. Múltiplos Métodos Abstratos

```java
public enum TipoArquivo {
    TEXTO {
        @Override
        public String getExtensao() {
            return ".txt";
        }
        
        @Override
        public String getMimeType() {
            return "text/plain";
        }
        
        @Override
        public long getTamanhoMaximo() {
            return 5 * 1024 * 1024; // 5 MB
        }
    },
    IMAGEM {
        @Override
        public String getExtensao() {
            return ".jpg";
        }
        
        @Override
        public String getMimeType() {
            return "image/jpeg";
        }
        
        @Override
        public long getTamanhoMaximo() {
            return 10 * 1024 * 1024; // 10 MB
        }
    };
    
    // Múltiplos métodos abstratos
    public abstract String getExtensao();
    public abstract String getMimeType();
    public abstract long getTamanhoMaximo();
}
```

### 4. Método Abstrato com Parâmetros

```java
public enum Desconto {
    NENHUM {
        @Override
        public double aplicar(double valor) {
            return valor;
        }
    },
    CUPOM_10 {
        @Override
        public double aplicar(double valor) {
            return valor * 0.90; // 10% desconto
        }
    },
    BLACK_FRIDAY {
        @Override
        public double aplicar(double valor) {
            return valor * 0.50; // 50% desconto
        }
    };
    
    // Método abstrato com parâmetro
    public abstract double aplicar(double valor);
}

// ✅ Uso
double precoFinal = Desconto.CUPOM_10.aplicar(100.0); // 90.0
```

### 5. Método Abstrato com Retorno Complexo

```java
public enum StatusPedido {
    NOVO {
        @Override
        public List<StatusPedido> proximosEstados() {
            return Arrays.asList(APROVADO, CANCELADO);
        }
    },
    APROVADO {
        @Override
        public List<StatusPedido> proximosEstados() {
            return Arrays.asList(ENVIADO, CANCELADO);
        }
    },
    ENVIADO {
        @Override
        public List<StatusPedido> proximosEstados() {
            return Arrays.asList(ENTREGUE);
        }
    },
    ENTREGUE {
        @Override
        public List<StatusPedido> proximosEstados() {
            return Collections.emptyList();
        }
    },
    CANCELADO {
        @Override
        public List<StatusPedido> proximosEstados() {
            return Collections.emptyList();
        }
    };
    
    // Retorna lista de próximos estados válidos
    public abstract List<StatusPedido> proximosEstados();
}

// ✅ Uso
StatusPedido atual = StatusPedido.NOVO;
List<StatusPedido> proximos = atual.proximosEstados();
// [APROVADO, CANCELADO]
```

### 6. Validação com Método Abstrato

```java
public enum TipoCPF {
    VALIDO {
        @Override
        public boolean validar(String cpf) {
            // Lógica completa de validação de CPF
            return cpf != null && cpf.matches("\\d{11}");
        }
        
        @Override
        public String getMensagemErro() {
            return "CPF válido";
        }
    },
    INVALIDO {
        @Override
        public boolean validar(String cpf) {
            return false;
        }
        
        @Override
        public String getMensagemErro() {
            return "CPF inválido";
        }
    };
    
    public abstract boolean validar(String cpf);
    public abstract String getMensagemErro();
}
```

### 7. Combinação Abstrato + Concreto

```java
public enum Linguagem {
    JAVA {
        @Override
        public String getExtensao() {
            return ".java";
        }
    },
    PYTHON {
        @Override
        public String getExtensao() {
            return ".py";
        }
    },
    JAVASCRIPT {
        @Override
        public String getExtensao() {
            return ".js";
        }
    };
    
    // Método abstrato
    public abstract String getExtensao();
    
    // Método concreto (todas constantes herdam)
    public String getArquivo(String nome) {
        return nome + getExtensao();
    }
}

// ✅ Uso
String arquivo = Linguagem.JAVA.getArquivo("Main"); // "Main.java"
String ext = Linguagem.PYTHON.getExtensao(); // ".py"
```

### 8. Exceções em Métodos Abstratos

```java
public enum Conversor {
    INTEIRO {
        @Override
        public Object converter(String valor) throws NumberFormatException {
            return Integer.parseInt(valor);
        }
    },
    DOUBLE {
        @Override
        public Object converter(String valor) throws NumberFormatException {
            return Double.parseDouble(valor);
        }
    },
    BOOLEAN {
        @Override
        public Object converter(String valor) {
            return Boolean.parseBoolean(valor);
        }
    };
    
    // Método abstrato pode declarar throws
    public abstract Object converter(String valor) throws NumberFormatException;
}

// ✅ Uso
try {
    Integer num = (Integer) Conversor.INTEIRO.converter("123");
} catch (NumberFormatException e) {
    System.out.println("Erro na conversão");
}
```

### 9. Genéricos com Métodos Abstratos

```java
public enum Parser {
    JSON {
        @Override
        public <T> T parsear(String conteudo, Class<T> tipo) {
            // Lógica de parsing JSON
            return null; // Exemplo simplificado
        }
    },
    XML {
        @Override
        public <T> T parsear(String conteudo, Class<T> tipo) {
            // Lógica de parsing XML
            return null; // Exemplo simplificado
        }
    };
    
    // Método abstrato genérico
    public abstract <T> T parsear(String conteudo, Class<T> tipo);
}

// ✅ Uso
Usuario usuario = Parser.JSON.parsear(json, Usuario.class);
```

### 10. Documentação de Métodos Abstratos

```java
public enum TipoNotificacao {
    EMAIL {
        @Override
        public void enviar(String destinatario, String mensagem) {
            System.out.println("Enviando email para: " + destinatario);
        }
    },
    SMS {
        @Override
        public void enviar(String destinatario, String mensagem) {
            System.out.println("Enviando SMS para: " + destinatario);
        }
    },
    PUSH {
        @Override
        public void enviar(String destinatario, String mensagem) {
            System.out.println("Enviando notificação push para: " + destinatario);
        }
    };
    
    /**
     * Envia notificação para o destinatário.
     * 
     * @param destinatario identificador do destinatário
     *                     (email, telefone, ou device ID)
     * @param mensagem conteúdo da notificação
     * @throws IllegalArgumentException se destinatário null
     */
    public abstract void enviar(String destinatario, String mensagem);
}
```

---

## Aplicabilidade

Usar **método abstrato** quando:
- Cada constante tem **comportamento diferente**
- Não há implementação padrão lógica
- Strategy pattern
- Operações matemáticas
- Validações específicas

**Não usar** quando:
- Todas constantes compartilham lógica
- Método concreto com `switch` é mais claro

---

## Armadilhas

### 1. Esquecer Implementação

```java
public enum Status {
    ATIVO {
        // ❌ Faltou @Override
    },
    INATIVO {
        @Override
        public boolean isAtivo() {
            return false;
        }
    };
    
    public abstract boolean isAtivo();
}
// ❌ Erro: ATIVO não implementou isAtivo()
```

### 2. Implementação Incompleta

```java
public enum Forma {
    CIRCULO {
        // ❌ Implementou só 1 dos 2 métodos
        @Override
        public double area() {
            return 0;
        }
    };
    
    public abstract double area();
    public abstract double perimetro(); // ❌ Faltou implementar
}
```

### 3. Visibilidade Errada

```java
public enum Enum {
    CONST {
        // ❌ Método abstrato é public, implementação deve ser public
        protected void metodo() { }
    };
    
    public abstract void metodo();
}
```

---

## Boas Práticas

### 1. Javadoc Claro

```java
/**
 * Calcula o valor com desconto aplicado.
 * 
 * @param valor valor original
 * @return valor com desconto
 */
public abstract double aplicar(double valor);
```

### 2. Nome Descritivo

```java
// ✅ Nome claro
public abstract boolean isUtil();
public abstract double calcularArea();
public abstract void processar();

// ❌ Nome vago
public abstract void fazer();
public abstract Object get();
```

### 3. Validação no Método

```java
SOMA {
    @Override
    public double calcular(double a, double b) {
        if (Double.isNaN(a) || Double.isNaN(b)) {
            throw new IllegalArgumentException("Valores não podem ser NaN");
        }
        return a + b;
    }
};
```

### 4. Documentar Constantes

```java
/**
 * Soma dois valores.
 */
SOMA {
    @Override
    public double calcular(double a, double b) {
        return a + b;
    }
},

/**
 * Subtrai o segundo valor do primeiro.
 */
SUBTRACAO {
    @Override
    public double calcular(double a, double b) {
        return a - b;
    }
};
```

---

## Resumo

**Método abstrato em enum**:

```java
public enum Operacao {
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
    };
    
    // ✅ Método abstrato: cada constante DEVE implementar
    public abstract double calcular(double a, double b);
}

// ✅ Uso
double resultado = Operacao.SOMA.calcular(10, 5); // 15.0
```

**Características**:
- Palavra-chave `abstract`
- Cada constante **deve** implementar
- Permite comportamento específico
- Compilador valida implementação
- Pode ter múltiplos métodos abstratos
- Combina com métodos concretos

**Regra de Ouro**: **Método abstrato** quando cada constante precisa de **comportamento único**. **Método concreto** quando lógica é compartilhada. **Documentar** contrato do método abstrato e implementações específicas.
