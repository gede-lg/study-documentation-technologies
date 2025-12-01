# T6.07 - Sobrescrita de Métodos por Constante

## Introdução

**Sobrescrita**: constante pode sobrescrever método **concreto** do enum.

```java
public enum Status {
    ATIVO {
        @Override
        public String getDescricao() {
            return "Status ativo - usuário pode acessar o sistema";
        }
    },
    INATIVO {
        @Override
        public String getDescricao() {
            return "Status inativo - acesso bloqueado";
        }
    },
    BLOQUEADO; // Não sobrescreve, usa implementação padrão
    
    // Método concreto com implementação padrão
    public String getDescricao() {
        return "Status: " + name();
    }
}

// ✅ Uso
Status.ATIVO.getDescricao();      // "Status ativo - usuário pode acessar o sistema"
Status.BLOQUEADO.getDescricao();  // "Status: BLOQUEADO" (usa padrão)
```

Constante pode **sobrescrever** método concreto quando necessário.

---

## Fundamentos

### 1. Sobrescrita Opcional

```java
public enum TipoPagamento {
    DINHEIRO {
        @Override
        public double calcularTaxa(double valor) {
            return 0; // Sobrescreve: sem taxa
        }
    },
    CARTAO {
        @Override
        public double calcularTaxa(double valor) {
            return valor * 0.03; // Sobrescreve: 3% taxa
        }
    },
    PIX; // Não sobrescreve, usa padrão
    
    // Implementação padrão
    public double calcularTaxa(double valor) {
        return valor * 0.01; // 1% taxa padrão
    }
}

// ✅ Uso
double taxa1 = TipoPagamento.DINHEIRO.calcularTaxa(100); // 0.0 (sobrescrito)
double taxa2 = TipoPagamento.CARTAO.calcularTaxa(100);   // 3.0 (sobrescrito)
double taxa3 = TipoPagamento.PIX.calcularTaxa(100);      // 1.0 (padrão)
```

### 2. Sobrescrita Parcial

```java
public enum DiaSemana {
    SEGUNDA,
    TERCA,
    QUARTA,
    QUINTA,
    SEXTA,
    SABADO {
        @Override
        public boolean isUtil() {
            return false; // Sobrescreve
        }
    },
    DOMINGO {
        @Override
        public boolean isUtil() {
            return false; // Sobrescreve
        }
    };
    
    // Padrão: dia útil
    public boolean isUtil() {
        return true;
    }
}

// ✅ Uso
boolean util1 = DiaSemana.SEGUNDA.isUtil(); // true (padrão)
boolean util2 = DiaSemana.SABADO.isUtil();  // false (sobrescrito)
```

### 3. Sobrescrita com Lógica Adicional

```java
public enum TipoArquivo {
    TEXTO {
        @Override
        public void processar(String arquivo) {
            super.validar(arquivo); // Chama método padrão
            System.out.println("Processamento específico de texto");
        }
    },
    IMAGEM {
        @Override
        public void processar(String arquivo) {
            super.validar(arquivo);
            System.out.println("Processamento específico de imagem");
        }
    },
    VIDEO; // Usa processamento padrão
    
    // Método padrão
    public void processar(String arquivo) {
        validar(arquivo);
        System.out.println("Processamento genérico");
    }
    
    protected void validar(String arquivo) {
        if (arquivo == null) {
            throw new IllegalArgumentException("Arquivo não pode ser null");
        }
    }
}

// ✅ Uso
TipoArquivo.TEXTO.processar("doc.txt");   // Validação + processamento específico
TipoArquivo.VIDEO.processar("video.mp4"); // Validação + processamento genérico
```

### 4. Sobrescrita de toString()

```java
public enum Prioridade {
    BAIXA {
        @Override
        public String toString() {
            return "Prioridade Baixa (1-3 dias)";
        }
    },
    MEDIA {
        @Override
        public String toString() {
            return "Prioridade Média (hoje)";
        }
    },
    ALTA {
        @Override
        public String toString() {
            return "Prioridade Alta (imediato)";
        }
    };
    
    // toString() padrão retorna name()
    // Constantes sobrescrevem para descrição detalhada
}

// ✅ Uso
System.out.println(Prioridade.BAIXA); // "Prioridade Baixa (1-3 dias)"
```

### 5. Sobrescrita com Exceção

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
    RAIZ_QUADRADA; // Usa padrão
    
    // Padrão: não implementado
    public double calcular(double a, double b) {
        throw new UnsupportedOperationException(
            "Operação " + name() + " não implementada para dois operandos"
        );
    }
}

// ✅ Uso
double r1 = Operacao.SOMA.calcular(10, 5);     // 15.0 (sobrescrito)
double r2 = Operacao.DIVISAO.calcular(10, 5);  // 2.0 (sobrescrito)
try {
    Operacao.RAIZ_QUADRADA.calcular(10, 5);    // UnsupportedOperationException (padrão)
} catch (UnsupportedOperationException e) {
    System.out.println(e.getMessage());
}
```

### 6. Sobrescrita com Comportamento Misto

```java
public enum FormatoData {
    BR {
        @Override
        public String formatar(LocalDate data) {
            return getFormatter().format(data);
        }
        
        @Override
        protected DateTimeFormatter getFormatter() {
            return DateTimeFormatter.ofPattern("dd/MM/yyyy");
        }
    },
    US {
        @Override
        public String formatar(LocalDate data) {
            return getFormatter().format(data);
        }
        
        @Override
        protected DateTimeFormatter getFormatter() {
            return DateTimeFormatter.ofPattern("MM/dd/yyyy");
        }
    },
    ISO; // Usa padrão ISO-8601
    
    // Padrão: formato ISO
    public String formatar(LocalDate data) {
        return data.toString(); // yyyy-MM-dd
    }
    
    protected DateTimeFormatter getFormatter() {
        return DateTimeFormatter.ISO_LOCAL_DATE;
    }
}

// ✅ Uso
LocalDate hoje = LocalDate.of(2025, 11, 27);
String br = FormatoData.BR.formatar(hoje);   // "27/11/2025" (sobrescrito)
String iso = FormatoData.ISO.formatar(hoje); // "2025-11-27" (padrão)
```

### 7. Sobrescrita de Método Auxiliar

```java
public enum Validador {
    EMAIL {
        @Override
        protected String getLimparValor(String valor) {
            return valor.trim().toLowerCase(); // Sobrescreve: lowercase
        }
    },
    CPF {
        @Override
        protected String getLimparValor(String valor) {
            return valor.replaceAll("\\D", ""); // Sobrescreve: remove não-dígitos
        }
    },
    SENHA; // Usa padrão
    
    public boolean validar(String valor) {
        String valorLimpo = getLimparValor(valor);
        return valorLimpo != null && !valorLimpo.isEmpty();
    }
    
    // Padrão: apenas trim
    protected String getLimparValor(String valor) {
        return valor != null ? valor.trim() : null;
    }
}

// ✅ Uso
boolean emailOk = Validador.EMAIL.validar("  USER@EMAIL.COM  "); // true (lowercase aplicado)
boolean cpfOk = Validador.CPF.validar("123.456.789-01");         // true (pontos removidos)
```

### 8. Sobrescrita de Múltiplos Métodos

```java
public enum TipoNotificacao {
    EMAIL {
        @Override
        public void enviar(String destinatario, String mensagem) {
            System.out.println("Enviando email para: " + destinatario);
        }
        
        @Override
        public String getIcone() {
            return "📧";
        }
        
        @Override
        public int getPrioridade() {
            return 1; // Alta prioridade
        }
    },
    SMS {
        @Override
        public void enviar(String destinatario, String mensagem) {
            System.out.println("Enviando SMS para: " + destinatario);
        }
        
        @Override
        public String getIcone() {
            return "💬";
        }
    },
    PUSH; // Usa padrão para tudo
    
    // Implementações padrão
    public void enviar(String destinatario, String mensagem) {
        System.out.println("Enviando notificação push");
    }
    
    public String getIcone() {
        return "🔔";
    }
    
    public int getPrioridade() {
        return 2; // Prioridade normal
    }
}

// ✅ EMAIL sobrescreve tudo, SMS sobrescreve alguns, PUSH usa padrão
```

### 9. Sobrescrita Condicional

```java
public enum StatusPedido {
    NOVO {
        @Override
        public boolean podeAlterar() {
            return true; // Sobrescreve
        }
    },
    APROVADO {
        @Override
        public boolean podeAlterar() {
            return true; // Sobrescreve
        }
    },
    ENVIADO,   // Usa padrão (false)
    ENTREGUE,  // Usa padrão (false)
    CANCELADO; // Usa padrão (false)
    
    // Padrão: não pode alterar
    public boolean podeAlterar() {
        return false;
    }
}

// ✅ Apenas NOVO e APROVADO permitem alteração
boolean pode1 = StatusPedido.NOVO.podeAlterar();     // true
boolean pode2 = StatusPedido.ENVIADO.podeAlterar();  // false (padrão)
```

### 10. Sobrescrita com Template Method

```java
public enum ProcessadorArquivo {
    CSV {
        @Override
        protected void processar(String conteudo) {
            System.out.println("Processando CSV");
            // Lógica específica CSV
        }
    },
    JSON {
        @Override
        protected void processar(String conteudo) {
            System.out.println("Processando JSON");
            // Lógica específica JSON
        }
    },
    XML; // Usa processamento padrão
    
    // Template method (final)
    public final void executar(String arquivo) {
        validar(arquivo);
        String conteudo = ler(arquivo);
        processar(conteudo);
        finalizar();
    }
    
    // Métodos padrão (podem ser sobrescritos)
    protected void validar(String arquivo) {
        if (arquivo == null) {
            throw new IllegalArgumentException("Arquivo null");
        }
    }
    
    protected String ler(String arquivo) {
        return "conteudo"; // Simplificado
    }
    
    protected void processar(String conteudo) {
        System.out.println("Processamento genérico");
    }
    
    protected void finalizar() {
        System.out.println("Processamento concluído");
    }
}

// ✅ CSV e JSON sobrescrevem processar(), XML usa padrão
ProcessadorArquivo.CSV.executar("dados.csv");
ProcessadorArquivo.XML.executar("dados.xml");
```

---

## Aplicabilidade

**Sobrescrita** quando:
- Maioria das constantes compartilha lógica
- Algumas constantes precisam comportamento diferente
- Implementação padrão + exceções
- Template Method pattern

**Vantagens**:
- Código padrão reutilizado
- Sobrescrever apenas quando necessário
- Menos duplicação

---

## Armadilhas

### 1. Esquecer @Override

```java
// ⚠️ Sem @Override (pode causar erro silencioso)
CONSTANTE {
    public String metodo() { // Typo: devia ser getMetodo()
        return "valor";
    }
};

// ✅ Com @Override (erro de compilação se assinatura errada)
CONSTANTE {
    @Override
    public String getMetodo() {
        return "valor";
    }
};
```

### 2. Método Final

```java
// ❌ Método final não pode ser sobrescrito
public final String getValor() {
    return "valor";
}

CONSTANTE {
    @Override
    public String getValor() { } // ❌ ERRO: método final
};
```

### 3. Visibilidade Menor

```java
// ❌ Sobrescrita com visibilidade menor
public String getValor() { }

CONSTANTE {
    @Override
    protected String getValor() { } // ❌ ERRO: protected < public
};
```

---

## Boas Práticas

### 1. Usar @Override

```java
CONSTANTE {
    @Override
    public String metodo() {
        return "valor";
    }
};
```

### 2. Chamar super Quando Apropriado

```java
CONSTANTE {
    @Override
    public void metodo() {
        super.metodo(); // Chama lógica padrão
        // Lógica adicional
    }
};
```

### 3. Documentar Sobrescrita

```java
/**
 * Sobrescreve para aplicar validação adicional.
 */
CONSTANTE {
    @Override
    public void validar() {
        // validação específica
    }
};
```

### 4. Padrão Simples

```java
// ✅ Padrão simples, sobrescrita complexa
public String get() {
    return name(); // Padrão simples
}

ESPECIAL {
    @Override
    public String get() {
        return "Valor complexo: " + calcular();
    }
};
```

---

## Resumo

**Sobrescrita de métodos por constante**:

```java
public enum Status {
    ATIVO {
        @Override
        public String getDescricao() {
            return "Ativo - usuário pode acessar"; // Sobrescreve
        }
    },
    INATIVO {
        @Override
        public String getDescricao() {
            return "Inativo - acesso bloqueado"; // Sobrescreve
        }
    },
    BLOQUEADO; // Usa padrão
    
    // Implementação padrão
    public String getDescricao() {
        return "Status: " + name();
    }
}

// ✅ Uso
Status.ATIVO.getDescricao();     // "Ativo - usuário pode acessar" (sobrescrito)
Status.BLOQUEADO.getDescricao(); // "Status: BLOQUEADO" (padrão)
```

**Características**:
- Método concreto no enum (implementação padrão)
- Constante sobrescreve quando necessário
- Outras constantes usam padrão
- `@Override` obrigatório
- Pode chamar `super.metodo()`

**Regra de Ouro**: **Sobrescrita** quando maioria compartilha lógica, mas **algumas** constantes precisam comportamento **diferente**. **Implementação padrão** + **exceções**. Sempre usar **@Override**. Chamar **super** para reutilizar lógica padrão. Menos **duplicação** que método abstrato quando padrão existe.
