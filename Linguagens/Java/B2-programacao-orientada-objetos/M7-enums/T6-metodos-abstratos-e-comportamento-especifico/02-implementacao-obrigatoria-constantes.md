# T6.02 - Implementação Obrigatória em Cada Constante

## Introdução

**Método abstrato**: **todas** as constantes **devem implementar**.

```java
public enum Status {
    ATIVO {
        @Override
        public boolean podeEditar() {
            return true;
        }
    },
    INATIVO {
        @Override
        public boolean podeEditar() {
            return false;
        }
    },
    BLOQUEADO {
        @Override
        public boolean podeEditar() {
            return false;
        }
    };
    
    // ✅ Todas as 3 constantes implementaram
    public abstract boolean podeEditar();
}

// ❌ Erro de compilação se alguma constante não implementar
public enum Status {
    ATIVO {
        @Override
        public boolean podeEditar() {
            return true;
        }
    },
    INATIVO; // ❌ ERRO: não implementou podeEditar()
    
    public abstract boolean podeEditar();
}
```

Compilador **força** implementação em **todas** as constantes.

---

## Fundamentos

### 1. Erro de Compilação

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
    DOMINGO; // ❌ ERRO: DiaSemana is not abstract and does not override
             //          abstract method isUtil()
    
    public abstract boolean isUtil();
}
```

### 2. Todas Devem Implementar

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
    
    // ✅ Todas as 4 constantes implementaram
    public abstract double calcular(double a, double b);
}
```

### 3. Múltiplos Métodos Abstratos

```java
public enum TipoPagamento {
    DINHEIRO {
        @Override
        public double calcularTaxa(double valor) {
            return 0; // Sem taxa
        }
        
        @Override
        public String getDescricao() {
            return "Pagamento em dinheiro";
        }
        
        @Override
        public boolean requerAutenticacao() {
            return false;
        }
    },
    CARTAO_CREDITO {
        @Override
        public double calcularTaxa(double valor) {
            return valor * 0.03; // 3% de taxa
        }
        
        @Override
        public String getDescricao() {
            return "Pagamento com cartão de crédito";
        }
        
        @Override
        public boolean requerAutenticacao() {
            return true;
        }
    },
    PIX {
        @Override
        public double calcularTaxa(double valor) {
            return 0; // Sem taxa
        }
        
        @Override
        public String getDescricao() {
            return "Pagamento via PIX";
        }
        
        @Override
        public boolean requerAutenticacao() {
            return true;
        }
    };
    
    // ✅ Todas as constantes implementaram os 3 métodos
    public abstract double calcularTaxa(double valor);
    public abstract String getDescricao();
    public abstract boolean requerAutenticacao();
}
```

### 4. Adicionar Nova Constante

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
            return dimensoes[0] * dimensoes[1];
        }
    };
    
    public abstract double calcularArea(double... dimensoes);
}

// ✅ Adicionar nova constante: DEVE implementar método
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
            return dimensoes[0] * dimensoes[1];
        }
    },
    TRIANGULO { // Nova constante
        @Override
        public double calcularArea(double... dimensoes) {
            return (dimensoes[0] * dimensoes[1]) / 2;
        }
    };
    
    public abstract double calcularArea(double... dimensoes);
}
```

### 5. Implementação Vazia

```java
public enum Permissao {
    LER {
        @Override
        public boolean podeExecutar() {
            return false;
        }
        
        @Override
        public void executar() {
            // ✅ Implementação vazia é válida
        }
    },
    ESCREVER {
        @Override
        public boolean podeExecutar() {
            return false;
        }
        
        @Override
        public void executar() {
            // ✅ Implementação vazia
        }
    },
    EXECUTAR {
        @Override
        public boolean podeExecutar() {
            return true;
        }
        
        @Override
        public void executar() {
            System.out.println("Executando comando");
        }
    };
    
    public abstract boolean podeExecutar();
    public abstract void executar();
}
```

### 6. Lançar Exceção

```java
public enum Operacao {
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
    },
    RAIZ_QUADRADA {
        @Override
        public double calcular(double a, double b) {
            // ✅ Pode lançar exceção para constantes que não aplicam
            throw new UnsupportedOperationException(
                "RAIZ_QUADRADA requer apenas um operando"
            );
        }
    };
    
    public abstract double calcular(double a, double b);
}
```

### 7. Validação no Compilador

```java
// ❌ Não compila: faltou implementar em PENDENTE
public enum StatusPedido {
    NOVO {
        @Override
        public boolean podeCancelar() {
            return true;
        }
    },
    APROVADO {
        @Override
        public boolean podeCancelar() {
            return true;
        }
    },
    PENDENTE; // ❌ ERRO: não implementou podeCancelar()
    
    public abstract boolean podeCancelar();
}

// ✅ Compila: todas implementaram
public enum StatusPedido {
    NOVO {
        @Override
        public boolean podeCancelar() {
            return true;
        }
    },
    APROVADO {
        @Override
        public boolean podeCancelar() {
            return true;
        }
    },
    PENDENTE {
        @Override
        public boolean podeCancelar() {
            return false;
        }
    };
    
    public abstract boolean podeCancelar();
}
```

### 8. Herança de Assinatura

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
    CAPITALIZAR {
        @Override
        public String converter(String texto) {
            if (texto == null || texto.isEmpty()) {
                return texto;
            }
            return texto.substring(0, 1).toUpperCase() + 
                   texto.substring(1).toLowerCase();
        }
    };
    
    // Assinatura definida no método abstrato
    public abstract String converter(String texto);
    
    // ✅ Todas as implementações seguem a assinatura:
    // - Mesmo tipo de retorno: String
    // - Mesmo parâmetro: String texto
    // - Mesmo modificador: public
}
```

### 9. Adicionar Método Abstrato

```java
// Versão inicial
public enum Status {
    ATIVO {
        @Override
        public boolean isAtivo() {
            return true;
        }
    },
    INATIVO {
        @Override
        public boolean isAtivo() {
            return false;
        }
    };
    
    public abstract boolean isAtivo();
}

// ❌ Adicionar método abstrato quebra todas as constantes
public enum Status {
    ATIVO {
        @Override
        public boolean isAtivo() {
            return true;
        }
        // ❌ ERRO: não implementou podeEditar()
    },
    INATIVO {
        @Override
        public boolean isAtivo() {
            return false;
        }
        // ❌ ERRO: não implementou podeEditar()
    };
    
    public abstract boolean isAtivo();
    public abstract boolean podeEditar(); // Novo método abstrato
}

// ✅ Todas devem implementar o novo método
public enum Status {
    ATIVO {
        @Override
        public boolean isAtivo() {
            return true;
        }
        
        @Override
        public boolean podeEditar() {
            return true;
        }
    },
    INATIVO {
        @Override
        public boolean isAtivo() {
            return false;
        }
        
        @Override
        public boolean podeEditar() {
            return false;
        }
    };
    
    public abstract boolean isAtivo();
    public abstract boolean podeEditar();
}
```

### 10. Refatoração Segura

```java
// Antes: método concreto com switch
public enum TipoArquivo {
    TEXTO,
    IMAGEM,
    VIDEO;
    
    public String getExtensao() {
        switch (this) {
            case TEXTO: return ".txt";
            case IMAGEM: return ".jpg";
            case VIDEO: return ".mp4";
            default: throw new IllegalStateException();
        }
    }
}

// Depois: método abstrato (compilador força implementação)
public enum TipoArquivo {
    TEXTO {
        @Override
        public String getExtensao() {
            return ".txt";
        }
    },
    IMAGEM {
        @Override
        public String getExtensao() {
            return ".jpg";
        }
    },
    VIDEO {
        @Override
        public String getExtensao() {
            return ".mp4";
        }
    };
    
    // ✅ Compilador garante que não esquecemos nenhuma constante
    public abstract String getExtensao();
}

// ✅ Vantagem: adicionar AUDIO sem implementar getExtensao() não compila
public enum TipoArquivo {
    TEXTO { /* ... */ },
    IMAGEM { /* ... */ },
    VIDEO { /* ... */ },
    AUDIO; // ❌ ERRO: não implementou getExtensao()
    
    public abstract String getExtensao();
}
```

---

## Aplicabilidade

**Método abstrato** garante:
- Implementação em **todas** as constantes
- Compilador valida
- Segurança na adição de constantes
- Segurança na adição de métodos

**Vantagem** sobre switch:
- Não esquece constante
- Não precisa default
- Erro em tempo de compilação

---

## Armadilhas

### 1. Esquecer Constante

```java
public enum Status {
    ATIVO {
        @Override
        public boolean podeEditar() { return true; }
    },
    INATIVO; // ❌ ERRO: não implementou
    
    public abstract boolean podeEditar();
}
```

### 2. Adicionar Método Abstrato

```java
// ❌ Adicionar método abstrato quebra todas as constantes
public abstract void novoMetodo(); // Todas devem implementar
```

### 3. Implementação Parcial

```java
public enum Enum {
    CONST {
        @Override
        public void metodo1() { }
        // ❌ ERRO: faltou metodo2()
    };
    
    public abstract void metodo1();
    public abstract void metodo2();
}
```

---

## Boas Práticas

### 1. Implementar Todos

```java
// ✅ Todas as constantes implementam todos os métodos
CONST {
    @Override
    public void metodo1() { }
    
    @Override
    public void metodo2() { }
};
```

### 2. Validar com Compilador

```java
// ✅ Adicionar constante força implementação
NOVA_CONSTANTE {
    @Override
    public void metodo() {
        // Compilador força implementação
    }
};
```

### 3. Refatorar Switch para Abstrato

```java
// Antes: switch (pode esquecer case)
public String get() {
    switch (this) {
        case A: return "a";
        // ⚠️ Esqueceu case B
    }
}

// Depois: abstrato (compilador valida)
public abstract String get();
```

### 4. Documentar Exceções

```java
/**
 * @throws UnsupportedOperationException se operação não aplicável
 */
public abstract void executar();
```

---

## Resumo

**Implementação obrigatória**:

```java
public enum Status {
    ATIVO {
        @Override
        public boolean podeEditar() {
            return true;
        }
    },
    INATIVO {
        @Override
        public boolean podeEditar() {
            return false;
        }
    };
    
    // ✅ TODAS as constantes DEVEM implementar
    public abstract boolean podeEditar();
}

// ❌ Erro de compilação se alguma não implementar
public enum Status {
    ATIVO {
        @Override
        public boolean podeEditar() { return true; }
    },
    INATIVO; // ❌ ERRO: não implementou podeEditar()
    
    public abstract boolean podeEditar();
}
```

**Características**:
- Compilador **força** implementação
- **Todas** as constantes devem implementar
- Erro em **tempo de compilação**
- Adicionar constante: deve implementar
- Adicionar método abstrato: todas devem implementar

**Regra de Ouro**: Método abstrato **garante** que **todas** as constantes implementam. Compilador **valida** e **força** implementação. Mais **seguro** que switch. Use quando cada constante precisa de **comportamento específico**.
