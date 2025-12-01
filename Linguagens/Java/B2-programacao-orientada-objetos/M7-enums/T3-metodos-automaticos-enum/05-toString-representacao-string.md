# T3.05 - toString(): Representação em String

## Introdução

**toString()**: retorna representação em String da constante.

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

Status s = Status.ATIVO;
System.out.println(s.toString()); // "ATIVO"
```

**Padrão**: retorna `name()`, mas pode ser sobrescrito.

---

## Fundamentos

### 1. Implementação Padrão

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

Cor cor = Cor.VERMELHO;
System.out.println(cor.toString()); // "VERMELHO" (padrão = name())
```

### 2. toString() vs name()

```java
Status s = Status.ATIVO;

// Padrão: iguais
System.out.println(s.name());     // "ATIVO"
System.out.println(s.toString()); // "ATIVO"

// name() é final, toString() pode sobrescrever
```

### 3. Sobrescrever toString()

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE;
    
    @Override
    public String toString() {
        return name().toLowerCase(); // "ativo"
    }
}

Status s = Status.ATIVO;
System.out.println(s.name());     // "ATIVO"
System.out.println(s.toString()); // "ativo"
```

### 4. Formato Customizado

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO;
    
    @Override
    public String toString() {
        return name().charAt(0) + name().substring(1).toLowerCase();
    }
}

DiaSemana dia = DiaSemana.SEGUNDA;
System.out.println(dia.toString()); // "Segunda"
```

### 5. toString() com Atributos

```java
public enum Moeda {
    REAL("R$", "BRL"),
    DOLAR("$", "USD"),
    EURO("€", "EUR");
    
    private final String simbolo;
    private final String codigo;
    
    Moeda(String simbolo, String codigo) {
        this.simbolo = simbolo;
        this.codigo = codigo;
    }
    
    @Override
    public String toString() {
        return simbolo + " (" + codigo + ")";
    }
}

System.out.println(Moeda.REAL); // "R$ (BRL)"
```

### 6. Concatenação de String

```java
Status s = Status.ATIVO;

// toString() chamado implicitamente
String msg = "Status: " + s;
System.out.println(msg); // "Status: ATIVO"
```

### 7. System.out.println()

```java
Status s = Status.ATIVO;

// println() chama toString() automaticamente
System.out.println(s); // "ATIVO"
```

### 8. String.format()

```java
Status s = Status.ATIVO;

String formatted = String.format("O status é: %s", s);
System.out.println(formatted); // "O status é: ATIVO"
```

### 9. Logger

```java
Status s = Status.ATIVO;

logger.info("Status alterado: {}", s); // toString() chamado
// Log: "Status alterado: ATIVO"
```

### 10. toString() Específico por Constante

```java
public enum Operacao {
    SOMA {
        @Override
        public String toString() {
            return "+";
        }
    },
    SUBTRACAO {
        @Override
        public String toString() {
            return "-";
        }
    },
    MULTIPLICACAO {
        @Override
        public String toString() {
            return "*";
        }
    };
}

System.out.println(Operacao.SOMA); // "+"
```

---

## Aplicabilidade

**toString()** para:
- Exibir em UI (interfaces)
- Logging e debugging
- Mensagens de erro
- Formatação customizada

---

## Armadilhas

### 1. toString() vs name() para valueOf()

```java
public enum Status {
    ATIVO;
    
    @Override
    public String toString() {
        return "Ativo"; // Customizado
    }
}

Status s = Status.ATIVO;
String str = s.toString(); // "Ativo"

// ❌ ERRO: valueOf() usa name(), não toString()
// Status s2 = Status.valueOf(str); // IllegalArgumentException

// ✅ Usar name()
String nome = s.name(); // "ATIVO"
Status s2 = Status.valueOf(nome); // ✅
```

### 2. Confundir com name()

```java
// name() é final (não pode sobrescrever)
// toString() pode sobrescrever

public enum Status {
    ATIVO;
    
    // ❌ ERRO: cannot override final method
    // public String name() { }
    
    // ✅ OK
    @Override
    public String toString() {
        return "Customizado";
    }
}
```

### 3. toString() Null

```java
Status s = null;

// ❌ NullPointerException
// System.out.println(s.toString());

// ✅ Verificar null
if (s != null) {
    System.out.println(s.toString());
}
```

---

## Boas Práticas

### 1. toString() para UI

```java
// ✅ toString() para exibição
public enum Status {
    ATIVO, INATIVO, PENDENTE;
    
    @Override
    public String toString() {
        return switch (this) {
            case ATIVO -> "Ativo";
            case INATIVO -> "Inativo";
            case PENDENTE -> "Pendente";
        };
    }
}

// UI
comboBox.addItem(Status.ATIVO); // Exibe "Ativo"
```

### 2. name() para Serialização

```java
// ✅ name() para JSON/DB
public String toJson() {
    return "{\"status\":\"" + status.name() + "\"}";
}

// ✅ toString() para log
logger.info("Status: {}", status.toString());
```

### 3. Formato Consistente

```java
// ✅ Formato consistente
public enum Prioridade {
    BAIXA, MEDIA, ALTA;
    
    @Override
    public String toString() {
        return name().charAt(0) + name().substring(1).toLowerCase();
    }
}

// BAIXA → "Baixa"
// MEDIA → "Media"
// ALTA → "Alta"
```

### 4. toString() com Contexto

```java
// ✅ Adicionar contexto
public enum TipoArquivo {
    JPG, PNG, PDF;
    
    @Override
    public String toString() {
        return "Arquivo " + name();
    }
}

System.out.println(TipoArquivo.JPG); // "Arquivo JPG"
```

---

## Resumo

**toString()**:

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

Status s = Status.ATIVO;
System.out.println(s.toString()); // "ATIVO" (padrão = name())
```

**Sobrescrever toString()**:

```java
public enum Status {
    ATIVO, INATIVO;
    
    @Override
    public String toString() {
        return name().toLowerCase(); // Customizado
    }
}

Status s = Status.ATIVO;
System.out.println(s.name());     // "ATIVO" (final)
System.out.println(s.toString()); // "ativo" (customizado)
```

**toString() vs name()**:

| Método | Pode Sobrescrever | Padrão | Uso |
|--------|-------------------|--------|-----|
| **name()** | ❌ Final | Nome exato | Serialização, valueOf() |
| **toString()** | ✅ Sim | name() | UI, logging, formatação |

**Chamada implícita**:

```java
Status s = Status.ATIVO;

// toString() chamado automaticamente
System.out.println(s);        // "ATIVO"
String msg = "Status: " + s;  // "Status: ATIVO"
logger.info("Status: {}", s); // "Status: ATIVO"
```

**Customização**:

```java
// Por enum
public enum Moeda {
    REAL("R$");
    
    private final String simbolo;
    
    Moeda(String simbolo) {
        this.simbolo = simbolo;
    }
    
    @Override
    public String toString() {
        return simbolo;
    }
}

// Por constante
public enum Operacao {
    SOMA {
        @Override
        public String toString() {
            return "+";
        }
    }
}
```

**Regra de Ouro**: `toString()` retorna representação em String (padrão = `name()`). Pode ser **sobrescrito** para formatação customizada. Use `toString()` para **UI/logging**, `name()` para **serialização**. `valueOf()` usa `name()`, **não** `toString()`. Chamado implicitamente em concatenação, println(), logger.
