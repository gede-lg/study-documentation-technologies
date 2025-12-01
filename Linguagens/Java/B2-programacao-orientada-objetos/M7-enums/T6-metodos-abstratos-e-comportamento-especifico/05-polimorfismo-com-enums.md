# T6.05 - Polimorfismo com Enums

## Introdução

**Polimorfismo com enum**: tratar constantes de forma **polimórfica**.

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
    
    public abstract double calcular(double a, double b);
}

// ✅ Polimorfismo: mesma chamada, comportamento diferente
Operacao op1 = Operacao.SOMA;
Operacao op2 = Operacao.SUBTRACAO;

double r1 = op1.calcular(10, 5); // 15.0 (chama SOMA.calcular)
double r2 = op2.calcular(10, 5); // 5.0  (chama SUBTRACAO.calcular)

// ✅ Loop polimórfico
for (Operacao op : Operacao.values()) {
    System.out.println(op.calcular(10, 5));
}
// 15.0
// 5.0
```

**Mesmo método**, **comportamento específico** por constante.

---

## Fundamentos

### 1. Chamada Polimórfica

```java
public enum Forma {
    CIRCULO {
        @Override
        public double calcularArea(double dimensao) {
            return Math.PI * dimensao * dimensao; // dimensao = raio
        }
    },
    QUADRADO {
        @Override
        public double calcularArea(double dimensao) {
            return dimensao * dimensao; // dimensao = lado
        }
    };
    
    public abstract double calcularArea(double dimensao);
}

// ✅ Polimorfismo: mesma chamada, resultado diferente
Forma forma = Forma.CIRCULO;
double area = forma.calcularArea(5.0); // Chama CIRCULO.calcularArea

forma = Forma.QUADRADO;
area = forma.calcularArea(5.0); // Chama QUADRADO.calcularArea
```

### 2. Loop Polimórfico

```java
public enum TipoPagamento {
    DINHEIRO {
        @Override
        public double calcularTotal(double valor) {
            return valor * 0.95; // 5% desconto
        }
    },
    CARTAO {
        @Override
        public double calcularTotal(double valor) {
            return valor * 1.03; // 3% taxa
        }
    },
    PIX {
        @Override
        public double calcularTotal(double valor) {
            return valor; // Sem alteração
        }
    };
    
    public abstract double calcularTotal(double valor);
}

// ✅ Processar todos os tipos de forma polimórfica
double valorCompra = 100.0;

for (TipoPagamento tipo : TipoPagamento.values()) {
    double total = tipo.calcularTotal(valorCompra);
    System.out.println(tipo + ": " + total);
}
// DINHEIRO: 95.0
// CARTAO: 103.0
// PIX: 100.0
```

### 3. Método que Recebe Enum

```java
public enum Validador {
    EMAIL {
        @Override
        public boolean validar(String valor) {
            return valor.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
        }
    },
    CPF {
        @Override
        public boolean validar(String valor) {
            return valor.matches("\\d{11}");
        }
    };
    
    public abstract boolean validar(String valor);
}

// ✅ Método polimórfico
public class ValidadorService {
    public boolean executarValidacao(Validador validador, String valor) {
        // Chama implementação específica da constante
        return validador.validar(valor);
    }
}

// Uso
ValidadorService service = new ValidadorService();
boolean emailValido = service.executarValidacao(Validador.EMAIL, "user@email.com");
boolean cpfValido = service.executarValidacao(Validador.CPF, "12345678901");
```

### 4. Array Polimórfico

```java
public enum Conversor {
    MAIUSCULA {
        @Override
        public String converter(String texto) {
            return texto.toUpperCase();
        }
    },
    MINUSCULA {
        @Override
        public String converter(String texto) {
            return texto.toLowerCase();
        }
    },
    INVERTER {
        @Override
        public String converter(String texto) {
            return new StringBuilder(texto).reverse().toString();
        }
    };
    
    public abstract String converter(String texto);
}

// ✅ Array de enums processados polimorficamente
Conversor[] conversores = {
    Conversor.MAIUSCULA,
    Conversor.MINUSCULA,
    Conversor.INVERTER
};

String texto = "Java";
for (Conversor conversor : conversores) {
    String resultado = conversor.converter(texto);
    System.out.println(conversor + ": " + resultado);
}
// MAIUSCULA: JAVA
// MINUSCULA: java
// INVERTER: avaJ
```

### 5. Stream Polimórfico

```java
public enum Desconto {
    NENHUM {
        @Override
        public double aplicar(double valor) {
            return valor;
        }
    },
    CLIENTE_VIP {
        @Override
        public double aplicar(double valor) {
            return valor * 0.80;
        }
    },
    BLACK_FRIDAY {
        @Override
        public double aplicar(double valor) {
            return valor * 0.50;
        }
    };
    
    public abstract double aplicar(double valor);
}

// ✅ Stream polimórfico
double valorOriginal = 100.0;

List<Double> precos = Arrays.stream(Desconto.values())
    .map(desconto -> desconto.aplicar(valorOriginal))
    .collect(Collectors.toList());
// [100.0, 80.0, 50.0]

// ✅ Encontrar menor preço
double menorPreco = Arrays.stream(Desconto.values())
    .mapToDouble(desconto -> desconto.aplicar(valorOriginal))
    .min()
    .orElse(valorOriginal);
// 50.0 (BLACK_FRIDAY)
```

### 6. Substituição de Tipo

```java
public enum StatusPedido {
    NOVO {
        @Override
        public void processar(Pedido pedido) {
            System.out.println("Processando novo pedido: " + pedido.getId());
        }
    },
    APROVADO {
        @Override
        public void processar(Pedido pedido) {
            System.out.println("Aprovando pedido: " + pedido.getId());
        }
    },
    ENVIADO {
        @Override
        public void processar(Pedido pedido) {
            System.out.println("Enviando pedido: " + pedido.getId());
        }
    };
    
    public abstract void processar(Pedido pedido);
}

// ✅ Método polimórfico: aceita qualquer StatusPedido
public void processarPedido(Pedido pedido, StatusPedido status) {
    // Chama implementação específica do status
    status.processar(pedido);
}

// Uso
Pedido pedido = new Pedido(123);
processarPedido(pedido, StatusPedido.NOVO);     // "Processando novo pedido: 123"
processarPedido(pedido, StatusPedido.ENVIADO);  // "Enviando pedido: 123"
```

### 7. Polimorfismo com Interface

```java
public interface Processavel {
    void processar();
}

public enum TipoProcessamento implements Processavel {
    RAPIDO {
        @Override
        public void processar() {
            System.out.println("Processamento rápido: 1 segundo");
        }
    },
    NORMAL {
        @Override
        public void processar() {
            System.out.println("Processamento normal: 5 segundos");
        }
    },
    LENTO {
        @Override
        public void processar() {
            System.out.println("Processamento lento: 10 segundos");
        }
    };
}

// ✅ Tratar como interface
public void executar(Processavel processavel) {
    processavel.processar(); // Polimórfico
}

// Uso
executar(TipoProcessamento.RAPIDO);  // Chama RAPIDO.processar()
executar(TipoProcessamento.LENTO);   // Chama LENTO.processar()
```

### 8. Polimorfismo em Coleções

```java
public enum Notificacao {
    EMAIL {
        @Override
        public void enviar(String destinatario, String mensagem) {
            System.out.println("Email para " + destinatario + ": " + mensagem);
        }
    },
    SMS {
        @Override
        public void enviar(String destinatario, String mensagem) {
            System.out.println("SMS para " + destinatario + ": " + mensagem);
        }
    },
    PUSH {
        @Override
        public void enviar(String destinatario, String mensagem) {
            System.out.println("Push para " + destinatario + ": " + mensagem);
        }
    };
    
    public abstract void enviar(String destinatario, String mensagem);
}

// ✅ Coleção de enums processados polimorficamente
List<Notificacao> notificacoes = Arrays.asList(
    Notificacao.EMAIL,
    Notificacao.SMS,
    Notificacao.PUSH
);

String destinatario = "usuario@email.com";
String mensagem = "Olá!";

for (Notificacao notificacao : notificacoes) {
    notificacao.enviar(destinatario, mensagem);
}
// Email para usuario@email.com: Olá!
// SMS para usuario@email.com: Olá!
// Push para usuario@email.com: Olá!
```

### 9. Polimorfismo com Exceções

```java
public enum ConversorNumerico {
    INTEIRO {
        @Override
        public Number converter(String valor) throws NumberFormatException {
            return Integer.parseInt(valor);
        }
    },
    DOUBLE {
        @Override
        public Number converter(String valor) throws NumberFormatException {
            return Double.parseDouble(valor);
        }
    },
    LONG {
        @Override
        public Number converter(String valor) throws NumberFormatException {
            return Long.parseLong(valor);
        }
    };
    
    public abstract Number converter(String valor) throws NumberFormatException;
}

// ✅ Processar polimorficamente com tratamento de exceção
public Number converterValor(ConversorNumerico conversor, String valor) {
    try {
        return conversor.converter(valor); // Polimórfico
    } catch (NumberFormatException e) {
        System.err.println("Erro ao converter: " + valor);
        return null;
    }
}

// Uso
Number num1 = converterValor(ConversorNumerico.INTEIRO, "123");    // 123
Number num2 = converterValor(ConversorNumerico.DOUBLE, "123.45");  // 123.45
Number num3 = converterValor(ConversorNumerico.LONG, "999999999"); // 999999999
```

### 10. Polimorfismo com Genéricos

```java
public enum Parser {
    JSON {
        @Override
        public <T> T parsear(String conteudo, Class<T> tipo) {
            System.out.println("Parseando JSON para " + tipo.getSimpleName());
            // Lógica de parsing JSON
            return null; // Simplificado
        }
    },
    XML {
        @Override
        public <T> T parsear(String conteudo, Class<T> tipo) {
            System.out.println("Parseando XML para " + tipo.getSimpleName());
            // Lógica de parsing XML
            return null; // Simplificado
        }
    };
    
    public abstract <T> T parsear(String conteudo, Class<T> tipo);
}

// ✅ Método genérico polimórfico
public <T> T processar(Parser parser, String conteudo, Class<T> tipo) {
    return parser.parsear(conteudo, tipo); // Polimórfico
}

// Uso
Usuario usuario1 = processar(Parser.JSON, jsonString, Usuario.class);
Usuario usuario2 = processar(Parser.XML, xmlString, Usuario.class);
```

---

## Aplicabilidade

**Polimorfismo com enum** para:
- Processar todas as constantes
- Método que aceita qualquer constante
- Loop sobre `values()`
- Stream de constantes
- Tratar enum como interface

**Vantagens**:
- Código genérico
- Reutilização
- Tipo seguro
- Compilador valida

---

## Armadilhas

### 1. Casting Desnecessário

```java
// ❌ Casting desnecessário
Operacao op = (Operacao) Operacao.SOMA; // Redundante

// ✅ Tipo já é correto
Operacao op = Operacao.SOMA;
```

### 2. Instanceof com Enum

```java
// ⚠️ Evitar instanceof (use métodos abstratos)
if (op instanceof Operacao) {
    // Sempre true para constantes
}

// ✅ Usar comparação direta ou métodos
if (op == Operacao.SOMA) { }
// ou
if (op.isAditivo()) { } // Método abstrato
```

### 3. Switch em Vez de Polimorfismo

```java
// ❌ Switch quebra polimorfismo
switch (operacao) {
    case SOMA: return a + b;
    case SUBTRACAO: return a - b;
}

// ✅ Polimorfismo
return operacao.calcular(a, b);
```

---

## Boas Práticas

### 1. Usar Método Abstrato

```java
// ✅ Polimórfico
public abstract double calcular(double a, double b);

// Uso
double resultado = operacao.calcular(10, 5);
```

### 2. Loop Genérico

```java
// ✅ Processar todas as constantes
for (TipoPagamento tipo : TipoPagamento.values()) {
    tipo.calcularTotal(valor);
}
```

### 3. Stream de Enums

```java
// ✅ Stream polimórfico
Arrays.stream(Desconto.values())
    .map(d -> d.aplicar(100))
    .forEach(System.out::println);
```

### 4. Método que Aceita Enum

```java
// ✅ Método genérico
public void processar(Status status, Pedido pedido) {
    status.processar(pedido); // Polimórfico
}
```

---

## Resumo

**Polimorfismo com enum**:

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
    
    public abstract double calcular(double a, double b);
}

// ✅ Polimorfismo: mesma chamada, comportamento diferente
Operacao op = Operacao.SOMA;
double resultado = op.calcular(10, 5); // Chama SOMA.calcular

// ✅ Loop polimórfico
for (Operacao op : Operacao.values()) {
    op.calcular(10, 5);
}

// ✅ Stream polimórfico
Arrays.stream(Operacao.values())
    .map(o -> o.calcular(10, 5))
    .forEach(System.out::println);

// ✅ Método polimórfico
public double executar(Operacao op, double a, double b) {
    return op.calcular(a, b); // Polimórfico
}
```

**Características**:
- Mesma chamada, comportamento diferente
- Loop sobre `values()`
- Stream de constantes
- Método que aceita enum
- Tipo seguro
- Compilador valida

**Regra de Ouro**: **Polimorfismo** permite tratar constantes de forma **genérica**. **Mesma chamada**, **comportamento específico** por constante. Substitui **switch** complexo. Use `values()`, **streams** e **métodos genéricos** para processar constantes polimorficamente. Mais **limpo** e **seguro** que `instanceof` ou `switch`.
