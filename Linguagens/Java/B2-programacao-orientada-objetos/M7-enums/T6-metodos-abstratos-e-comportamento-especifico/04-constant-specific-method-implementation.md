# T6.04 - Constant-Specific Method Implementation

## Introdução

**Constant-specific method implementation**: cada constante implementa métodos de forma **única**.

```java
public enum Operacao {
    SOMA {
        @Override
        public double calcular(double a, double b) {
            return a + b;  // Implementação específica da SOMA
        }
    },
    MULTIPLICACAO {
        @Override
        public double calcular(double a, double b) {
            return a * b;  // Implementação específica da MULTIPLICACAO
        }
    };
    
    // Método abstrato: cada constante implementa de forma diferente
    public abstract double calcular(double a, double b);
}

// ✅ Cada constante tem comportamento próprio
double r1 = Operacao.SOMA.calcular(10, 5);          // 15.0
double r2 = Operacao.MULTIPLICACAO.calcular(10, 5); // 50.0
```

Cada constante = **implementação única** do método.

---

## Fundamentos

### 1. Implementação Diferente por Constante

```java
public enum DiaSemana {
    SEGUNDA {
        @Override
        public int getHorasTrabalho() {
            return 8;
        }
    },
    SEXTA {
        @Override
        public int getHorasTrabalho() {
            return 6;  // Sexta-feira: 6 horas
        }
    },
    SABADO {
        @Override
        public int getHorasTrabalho() {
            return 0;  // Sábado: não trabalha
        }
    },
    DOMINGO {
        @Override
        public int getHorasTrabalho() {
            return 0;  // Domingo: não trabalha
        }
    };
    
    public abstract int getHorasTrabalho();
}

// ✅ Cada constante retorna valor diferente
int horas1 = DiaSemana.SEGUNDA.getHorasTrabalho(); // 8
int horas2 = DiaSemana.SEXTA.getHorasTrabalho();   // 6
int horas3 = DiaSemana.SABADO.getHorasTrabalho();  // 0
```

### 2. Lógica Específica por Constante

```java
public enum TipoPagamento {
    DINHEIRO {
        @Override
        public double calcularTotal(double valor) {
            // Dinheiro: 5% desconto
            return valor * 0.95;
        }
    },
    CARTAO_CREDITO {
        @Override
        public double calcularTotal(double valor) {
            // Cartão: 3% taxa
            return valor * 1.03;
        }
    },
    PIX {
        @Override
        public double calcularTotal(double valor) {
            // PIX: sem alteração
            return valor;
        }
    };
    
    public abstract double calcularTotal(double valor);
}

// ✅ Cada tipo de pagamento calcula de forma diferente
double total1 = TipoPagamento.DINHEIRO.calcularTotal(100);       // 95.0
double total2 = TipoPagamento.CARTAO_CREDITO.calcularTotal(100); // 103.0
double total3 = TipoPagamento.PIX.calcularTotal(100);            // 100.0
```

### 3. Validação Específica

```java
public enum TipoDocumento {
    CPF {
        @Override
        public boolean validar(String documento) {
            if (documento == null || documento.length() != 11) {
                return false;
            }
            // Lógica específica de validação de CPF
            return documento.matches("\\d{11}");
        }
        
        @Override
        public String formatar(String documento) {
            // Formato: 123.456.789-01
            return documento.substring(0, 3) + "." +
                   documento.substring(3, 6) + "." +
                   documento.substring(6, 9) + "-" +
                   documento.substring(9, 11);
        }
    },
    CNPJ {
        @Override
        public boolean validar(String documento) {
            if (documento == null || documento.length() != 14) {
                return false;
            }
            // Lógica específica de validação de CNPJ
            return documento.matches("\\d{14}");
        }
        
        @Override
        public String formatar(String documento) {
            // Formato: 12.345.678/0001-90
            return documento.substring(0, 2) + "." +
                   documento.substring(2, 5) + "." +
                   documento.substring(5, 8) + "/" +
                   documento.substring(8, 12) + "-" +
                   documento.substring(12, 14);
        }
    };
    
    public abstract boolean validar(String documento);
    public abstract String formatar(String documento);
}

// ✅ Cada tipo valida e formata de forma específica
boolean validoCPF = TipoDocumento.CPF.validar("12345678901");
String formatadoCPF = TipoDocumento.CPF.formatar("12345678901");
// "123.456.789-01"
```

### 4. Conversão Específica

```java
public enum Conversor {
    PARA_MAIUSCULA {
        @Override
        public String converter(String texto) {
            return texto.toUpperCase();
        }
    },
    PARA_MINUSCULA {
        @Override
        public String converter(String texto) {
            return texto.toLowerCase();
        }
    },
    CAPITALIZAR {
        @Override
        public String converter(String texto) {
            if (texto == null || texto.isEmpty()) {
                return texto;
            }
            return texto.substring(0, 1).toUpperCase() + 
                   texto.substring(1).toLowerCase();
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

// ✅ Cada conversor tem lógica própria
String r1 = Conversor.PARA_MAIUSCULA.converter("java"); // "JAVA"
String r2 = Conversor.CAPITALIZAR.converter("JAVA");    // "Java"
String r3 = Conversor.INVERTER.converter("java");       // "avaj"
```

### 5. Cálculo Matemático Específico

```java
public enum Forma {
    CIRCULO {
        @Override
        public double calcularArea(double... dimensoes) {
            double raio = dimensoes[0];
            return Math.PI * raio * raio;
        }
        
        @Override
        public double calcularPerimetro(double... dimensoes) {
            double raio = dimensoes[0];
            return 2 * Math.PI * raio;
        }
    },
    RETANGULO {
        @Override
        public double calcularArea(double... dimensoes) {
            double largura = dimensoes[0];
            double altura = dimensoes[1];
            return largura * altura;
        }
        
        @Override
        public double calcularPerimetro(double... dimensoes) {
            double largura = dimensoes[0];
            double altura = dimensoes[1];
            return 2 * (largura + altura);
        }
    },
    TRIANGULO {
        @Override
        public double calcularArea(double... dimensoes) {
            double base = dimensoes[0];
            double altura = dimensoes[1];
            return (base * altura) / 2;
        }
        
        @Override
        public double calcularPerimetro(double... dimensoes) {
            double lado1 = dimensoes[0];
            double lado2 = dimensoes[1];
            double lado3 = dimensoes[2];
            return lado1 + lado2 + lado3;
        }
    };
    
    public abstract double calcularArea(double... dimensoes);
    public abstract double calcularPerimetro(double... dimensoes);
}

// ✅ Cada forma calcula área e perímetro de forma específica
double areaCirculo = Forma.CIRCULO.calcularArea(5.0);        // π * 25
double areaRetangulo = Forma.RETANGULO.calcularArea(4, 3);   // 12
double areaTriangulo = Forma.TRIANGULO.calcularArea(4, 3);   // 6
```

### 6. Formatação Específica

```java
public enum FormatoData {
    BR {
        @Override
        public String formatar(LocalDate data) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            return data.format(formatter);
        }
    },
    US {
        @Override
        public String formatar(LocalDate data) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
            return data.format(formatter);
        }
    },
    ISO {
        @Override
        public String formatar(LocalDate data) {
            return data.toString(); // yyyy-MM-dd
        }
    };
    
    public abstract String formatar(LocalDate data);
}

// ✅ Cada formato tem lógica própria
LocalDate hoje = LocalDate.of(2025, 11, 27);
String br = FormatoData.BR.formatar(hoje);   // "27/11/2025"
String us = FormatoData.US.formatar(hoje);   // "11/27/2025"
String iso = FormatoData.ISO.formatar(hoje); // "2025-11-27"
```

### 7. Processamento Específico

```java
public enum TipoArquivo {
    TEXTO {
        @Override
        public void processar(String arquivo) {
            System.out.println("Processando arquivo de texto: " + arquivo);
            // Lógica específica para texto
        }
        
        @Override
        public String getIcone() {
            return "📄";
        }
    },
    IMAGEM {
        @Override
        public void processar(String arquivo) {
            System.out.println("Processando imagem: " + arquivo);
            // Lógica específica para imagem
        }
        
        @Override
        public String getIcone() {
            return "🖼️";
        }
    },
    VIDEO {
        @Override
        public void processar(String arquivo) {
            System.out.println("Processando vídeo: " + arquivo);
            // Lógica específica para vídeo
        }
        
        @Override
        public String getIcone() {
            return "🎬";
        }
    };
    
    public abstract void processar(String arquivo);
    public abstract String getIcone();
}

// ✅ Cada tipo processa de forma diferente
TipoArquivo.TEXTO.processar("doc.txt");
TipoArquivo.IMAGEM.processar("foto.jpg");
```

### 8. Estratégia Específica

```java
public enum EstrategiaDesconto {
    NENHUM {
        @Override
        public double aplicar(double valor) {
            return valor;
        }
        
        @Override
        public String getDescricao() {
            return "Sem desconto";
        }
    },
    CLIENTE_VIP {
        @Override
        public double aplicar(double valor) {
            return valor * 0.80; // 20% desconto
        }
        
        @Override
        public String getDescricao() {
            return "Desconto VIP: 20%";
        }
    },
    BLACK_FRIDAY {
        @Override
        public double aplicar(double valor) {
            if (valor > 100) {
                return valor * 0.50; // 50% desconto
            } else {
                return valor * 0.70; // 30% desconto
            }
        }
        
        @Override
        public String getDescricao() {
            return "Black Friday: 30-50% desconto";
        }
    };
    
    public abstract double aplicar(double valor);
    public abstract String getDescricao();
}

// ✅ Cada estratégia aplica desconto de forma diferente
double preco1 = EstrategiaDesconto.NENHUM.aplicar(100);        // 100.0
double preco2 = EstrategiaDesconto.CLIENTE_VIP.aplicar(100);   // 80.0
double preco3 = EstrategiaDesconto.BLACK_FRIDAY.aplicar(150);  // 75.0
```

### 9. Estado Específico

```java
public enum StatusPedido {
    NOVO {
        @Override
        public boolean podeCancelar() {
            return true;
        }
        
        @Override
        public boolean podeEditar() {
            return true;
        }
        
        @Override
        public StatusPedido proximoEstado() {
            return APROVADO;
        }
    },
    APROVADO {
        @Override
        public boolean podeCancelar() {
            return true;
        }
        
        @Override
        public boolean podeEditar() {
            return false;
        }
        
        @Override
        public StatusPedido proximoEstado() {
            return ENVIADO;
        }
    },
    ENVIADO {
        @Override
        public boolean podeCancelar() {
            return false;
        }
        
        @Override
        public boolean podeEditar() {
            return false;
        }
        
        @Override
        public StatusPedido proximoEstado() {
            return ENTREGUE;
        }
    },
    ENTREGUE {
        @Override
        public boolean podeCancelar() {
            return false;
        }
        
        @Override
        public boolean podeEditar() {
            return false;
        }
        
        @Override
        public StatusPedido proximoEstado() {
            throw new IllegalStateException("Pedido já entregue");
        }
    };
    
    public abstract boolean podeCancelar();
    public abstract boolean podeEditar();
    public abstract StatusPedido proximoEstado();
}

// ✅ Cada status tem comportamento específico
boolean pode = StatusPedido.NOVO.podeCancelar();      // true
boolean pode2 = StatusPedido.ENVIADO.podeCancelar();  // false
StatusPedido proximo = StatusPedido.NOVO.proximoEstado(); // APROVADO
```

### 10. Complexidade Variável

```java
public enum Validador {
    EMAIL {
        @Override
        public boolean validar(String valor) {
            // Validação simples de email
            return valor != null && valor.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
        }
        
        @Override
        public String getMensagemErro() {
            return "Email inválido. Use formato: nome@dominio.com";
        }
    },
    SENHA_FORTE {
        @Override
        public boolean validar(String valor) {
            // Validação complexa de senha
            if (valor == null || valor.length() < 8) {
                return false;
            }
            
            boolean temMaiuscula = valor.matches(".*[A-Z].*");
            boolean temMinuscula = valor.matches(".*[a-z].*");
            boolean temNumero = valor.matches(".*\\d.*");
            boolean temEspecial = valor.matches(".*[@#$%^&+=].*");
            
            return temMaiuscula && temMinuscula && temNumero && temEspecial;
        }
        
        @Override
        public String getMensagemErro() {
            return "Senha deve ter: mínimo 8 caracteres, 1 maiúscula, " +
                   "1 minúscula, 1 número e 1 caractere especial";
        }
    };
    
    public abstract boolean validar(String valor);
    public abstract String getMensagemErro();
}

// ✅ Cada validador tem complexidade diferente
boolean emailOk = Validador.EMAIL.validar("user@email.com");
boolean senhaOk = Validador.SENHA_FORTE.validar("Senha123@");
```

---

## Aplicabilidade

**Constant-specific implementation** quando:
- Cada constante tem **lógica única**
- Evitar `switch` complexo
- Strategy pattern
- State pattern
- Polimorfismo com enums

**Vantagens**:
- Compilador garante implementação
- Código mais limpo que `switch`
- Fácil adicionar nova constante
- Tipo seguro

---

## Armadilhas

### 1. Lógica Duplicada

```java
// ❌ Lógica duplicada entre constantes
TIPO1 {
    @Override
    public String processar() {
        return "Prefixo: " + getNome(); // Duplicado
    }
},
TIPO2 {
    @Override
    public String processar() {
        return "Prefixo: " + getNome(); // Duplicado
    }
};

// ✅ Usar método concreto se lógica é igual
public String processar() {
    return "Prefixo: " + getNome();
}
```

### 2. Constante sem Implementação

```java
// ❌ Esqueceu implementar
TIPO1 {
    @Override
    public void processar() { }
},
TIPO2; // ❌ ERRO: não implementou

public abstract void processar();
```

### 3. Implementação Muito Complexa

```java
// ⚠️ Implementação muito grande (mover para classe separada)
TIPO {
    @Override
    public void processar() {
        // 100 linhas de código ⚠️
    }
};
```

---

## Boas Práticas

### 1. Cada Constante = Comportamento Único

```java
SOMA {
    @Override
    public double calcular(double a, double b) {
        return a + b; // Único para SOMA
    }
},
```

### 2. Documentar Diferenças

```java
/**
 * Aplica 20% de desconto para clientes VIP.
 */
CLIENTE_VIP {
    @Override
    public double aplicar(double valor) {
        return valor * 0.80;
    }
},
```

### 3. Validar Entrada

```java
DIVISAO {
    @Override
    public double calcular(double a, double b) {
        if (b == 0) {
            throw new ArithmeticException("Divisão por zero");
        }
        return a / b;
    }
},
```

### 4. Manter Simplicidade

```java
// ✅ Simples e claro
ATIVO {
    @Override
    public boolean isAtivo() {
        return true;
    }
},
```

---

## Resumo

**Constant-specific method implementation**:

```java
public enum Operacao {
    SOMA {
        @Override
        public double calcular(double a, double b) {
            return a + b; // Implementação específica da SOMA
        }
    },
    SUBTRACAO {
        @Override
        public double calcular(double a, double b) {
            return a - b; // Implementação específica da SUBTRACAO
        }
    };
    
    public abstract double calcular(double a, double b);
}

// ✅ Cada constante = comportamento único
double r1 = Operacao.SOMA.calcular(10, 5);      // 15.0
double r2 = Operacao.SUBTRACAO.calcular(10, 5); // 5.0
```

**Características**:
- Cada constante implementa de forma **única**
- Compilador valida todas as implementações
- Substitui `switch` complexo
- Strategy pattern natural
- Tipo seguro

**Regra de Ouro**: Use **constant-specific implementation** quando cada constante precisa de **lógica própria**. Mais **limpo** e **seguro** que `switch`. Compilador **garante** que todas as constantes implementam. Ideal para **Strategy** e **State** patterns.
