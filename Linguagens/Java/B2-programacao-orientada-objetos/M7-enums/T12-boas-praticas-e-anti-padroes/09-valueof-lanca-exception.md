# T12.09 - valueOf() Lança IllegalArgumentException

## Introdução

**valueOf()**: converte `String` em enum. **Lança exceção** se nome inválido.

```java
public enum Status {
    ATIVO,
    INATIVO
}

// ✅ Nome válido
Status status = Status.valueOf("ATIVO");
System.out.println(status); // ATIVO

// ❌ Nome inválido
Status status = Status.valueOf("PENDENTE");
// ⚠️ IllegalArgumentException: No enum constant Status.PENDENTE

// ❌ Null
Status status = Status.valueOf(null);
// ⚠️ NullPointerException
```

**valueOf()** não valida. **Sempre** pode lançar exceção.

---

## Fundamentos

### 1. IllegalArgumentException

```java
public enum DiaSemana {
    DOMINGO,
    SEGUNDA,
    TERCA,
    QUARTA,
    QUINTA,
    SEXTA,
    SABADO
}

// ❌ Nome inválido
try {
    DiaSemana dia = DiaSemana.valueOf("SEGUNDA-FEIRA");
} catch (IllegalArgumentException e) {
    System.out.println(e.getMessage());
    // No enum constant DiaSemana.SEGUNDA-FEIRA
}

// ❌ Case-sensitive
try {
    DiaSemana dia = DiaSemana.valueOf("segunda");
} catch (IllegalArgumentException e) {
    System.out.println(e.getMessage());
    // No enum constant DiaSemana.segunda
}

// ❌ Espaços
try {
    DiaSemana dia = DiaSemana.valueOf("SEGUNDA ");
} catch (IllegalArgumentException e) {
    System.out.println(e.getMessage());
    // No enum constant DiaSemana.SEGUNDA 
}
```

### 2. NullPointerException

```java
// ❌ Null
String nome = null;
try {
    Status status = Status.valueOf(nome);
} catch (NullPointerException e) {
    System.out.println("Nome não pode ser null");
}

// ✅ Validar null antes
String nome = getNome();
if (nome != null) {
    try {
        Status status = Status.valueOf(nome);
    } catch (IllegalArgumentException e) {
        // Nome inválido
    }
} else {
    // Nome null
}
```

### 3. Método Safe

```java
public enum Status {
    ATIVO,
    INATIVO;
    
    /**
     * Retorna enum correspondente ao nome, ou null se inválido.
     * 
     * @param nome nome da constante (case-sensitive)
     * @return enum ou null se nome inválido
     */
    public static Status fromString(String nome) {
        if (nome == null) {
            return null;
        }
        
        try {
            return valueOf(nome);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}

// ✅ Uso seguro
Status status = Status.fromString("ATIVO"); // ATIVO
Status status = Status.fromString("PENDENTE"); // null
Status status = Status.fromString(null); // null
```

### 4. Optional

```java
public enum Status {
    ATIVO,
    INATIVO;
    
    /**
     * Retorna Optional com enum, vazio se nome inválido.
     * 
     * @param nome nome da constante
     * @return Optional com enum ou vazio
     */
    public static Optional<Status> parse(String nome) {
        if (nome == null) {
            return Optional.empty();
        }
        
        try {
            return Optional.of(valueOf(nome));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}

// ✅ Uso com Optional
Status.parse("ATIVO")
      .ifPresent(s -> System.out.println(s)); // ATIVO

Status status = Status.parse("PENDENTE")
                      .orElse(Status.INATIVO); // INATIVO (padrão)

Status status = Status.parse("ATIVO")
                      .orElseThrow(() -> new IllegalStateException("Status inválido"));
```

### 5. Conversão Case-Insensitive

```java
public enum Status {
    ATIVO,
    INATIVO;
    
    /**
     * Retorna enum ignorando case, ou null se inválido.
     * 
     * @param nome nome da constante (case-insensitive)
     * @return enum ou null
     */
    public static Status fromStringIgnoreCase(String nome) {
        if (nome == null) {
            return null;
        }
        
        for (Status s : values()) {
            if (s.name().equalsIgnoreCase(nome)) {
                return s;
            }
        }
        
        return null;
    }
}

// ✅ Aceita minúsculas
Status status = Status.fromStringIgnoreCase("ativo"); // ATIVO
Status status = Status.fromStringIgnoreCase("ATIVO"); // ATIVO
Status status = Status.fromStringIgnoreCase("Ativo"); // ATIVO
```

### 6. Valor Padrão

```java
public enum Status {
    ATIVO,
    INATIVO;
    
    /**
     * Retorna enum correspondente ao nome, ou padrão se inválido.
     * 
     * @param nome nome da constante
     * @param padrao valor padrão se nome inválido
     * @return enum ou padrão
     */
    public static Status fromStringOrDefault(String nome, Status padrao) {
        if (nome == null) {
            return padrao;
        }
        
        try {
            return valueOf(nome);
        } catch (IllegalArgumentException e) {
            return padrao;
        }
    }
}

// ✅ Valor padrão se inválido
Status status = Status.fromStringOrDefault("PENDENTE", Status.INATIVO); // INATIVO
Status status = Status.fromStringOrDefault(null, Status.ATIVO); // ATIVO
```

### 7. Validação de Entrada

```java
// ❌ Não validar
public void setStatus(String statusNome) {
    this.status = Status.valueOf(statusNome); // ⚠️ Pode lançar exceção
}

// ✅ Validar e tratar
public void setStatus(String statusNome) {
    if (statusNome == null) {
        throw new IllegalArgumentException("Status não pode ser null");
    }
    
    try {
        this.status = Status.valueOf(statusNome);
    } catch (IllegalArgumentException e) {
        throw new IllegalArgumentException(
            "Status inválido: " + statusNome + 
            ". Valores válidos: " + Arrays.toString(Status.values())
        );
    }
}

// ✅ Ou usar método safe
public void setStatus(String statusNome) {
    Status s = Status.fromString(statusNome);
    if (s == null) {
        throw new IllegalArgumentException("Status inválido: " + statusNome);
    }
    this.status = s;
}
```

### 8. Conversão de Código

```java
public enum Status {
    ATIVO("A"),
    INATIVO("I");
    
    private final String codigo;
    
    Status(String codigo) {
        this.codigo = codigo;
    }
    
    public String getCodigo() {
        return codigo;
    }
    
    /**
     * Retorna enum correspondente ao código, ou null se inválido.
     * 
     * @param codigo código da constante ("A" ou "I")
     * @return enum ou null
     */
    public static Status fromCodigo(String codigo) {
        if (codigo == null) {
            return null;
        }
        
        for (Status s : values()) {
            if (s.codigo.equals(codigo)) {
                return s;
            }
        }
        
        return null;
    }
}

// ✅ Conversão por código
Status status = Status.fromCodigo("A"); // ATIVO
Status status = Status.fromCodigo("I"); // INATIVO
Status status = Status.fromCodigo("X"); // null

// ❌ valueOf() com código não funciona
Status status = Status.valueOf("A");
// IllegalArgumentException: No enum constant Status.A
```

### 9. Log de Erro

```java
public static Status fromString(String nome) {
    if (nome == null) {
        LOGGER.warn("Tentativa de conversão de null para Status");
        return null;
    }
    
    try {
        return valueOf(nome);
    } catch (IllegalArgumentException e) {
        LOGGER.warn("Nome inválido para Status: {}. Valores válidos: {}", 
                    nome, Arrays.toString(values()));
        return null;
    }
}
```

### 10. Mensagem Personalizada

```java
public enum Status {
    ATIVO,
    INATIVO;
    
    /**
     * Retorna enum correspondente ao nome.
     * 
     * @param nome nome da constante
     * @return enum
     * @throws IllegalArgumentException se nome inválido, com mensagem clara
     */
    public static Status fromStringStrict(String nome) {
        if (nome == null) {
            throw new IllegalArgumentException(
                "Nome não pode ser null. Valores válidos: " + 
                Arrays.toString(values())
            );
        }
        
        try {
            return valueOf(nome);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                "Status inválido: '" + nome + "'. " +
                "Valores válidos (case-sensitive): " + 
                Arrays.toString(values()),
                e
            );
        }
    }
}

// ❌ Nome inválido
try {
    Status status = Status.fromStringStrict("PENDENTE");
} catch (IllegalArgumentException e) {
    System.out.println(e.getMessage());
    // Status inválido: 'PENDENTE'. Valores válidos (case-sensitive): [ATIVO, INATIVO]
}
```

---

## Aplicabilidade

**valueOf()** direto:
- Quando nome é garantido válido
- Código interno controlado

**Método safe** (fromString):
- Entrada de usuário
- Dados externos (API, banco)
- Quando exceção não é desejada

**Optional**:
- Pipeline funcional
- Composição de operações

---

## Armadilhas

### 1. Não Tratar Exceção

```java
// ❌ valueOf() sem tratar
String input = getInput();
Status status = Status.valueOf(input); // ⚠️ Pode lançar

// ✅ Tratar ou usar safe
try {
    status = Status.valueOf(input);
} catch (IllegalArgumentException e) {
    // Tratar
}
// Ou
status = Status.fromString(input);
```

### 2. Ignorar Null

```java
// ❌ Não validar null
Status.valueOf(nome); // ⚠️ NullPointerException

// ✅ Validar
if (nome != null) {
    Status.valueOf(nome);
}
```

### 3. Case-Sensitive

```java
// ❌ Minúsculas
Status.valueOf("ativo"); // ⚠️ IllegalArgumentException

// ✅ Maiúsculas ou case-insensitive
Status.valueOf("ATIVO");
// Ou
Status.fromStringIgnoreCase("ativo");
```

---

## Boas Práticas

### 1. Método Safe

```java
public static Status fromString(String nome) {
    if (nome == null) return null;
    try {
        return valueOf(nome);
    } catch (IllegalArgumentException e) {
        return null;
    }
}
```

### 2. Optional

```java
public static Optional<Status> parse(String nome) {
    if (nome == null) return Optional.empty();
    try {
        return Optional.of(valueOf(nome));
    } catch (IllegalArgumentException e) {
        return Optional.empty();
    }
}
```

### 3. Valor Padrão

```java
public static Status fromStringOrDefault(String nome, Status padrao) {
    if (nome == null) return padrao;
    try {
        return valueOf(nome);
    } catch (IllegalArgumentException e) {
        return padrao;
    }
}
```

### 4. Documentar

```java
/**
 * @throws IllegalArgumentException se nome inválido
 * @throws NullPointerException se nome null
 */
public static Status valueOf(String nome) { }
```

---

## Resumo

**valueOf()**:

```java
// ❌ Direto (perigoso)
Status status = Status.valueOf("PENDENTE");
// IllegalArgumentException: No enum constant Status.PENDENTE

// ✅ Método safe
public static Status fromString(String nome) {
    if (nome == null) return null;
    try {
        return valueOf(nome);
    } catch (IllegalArgumentException e) {
        return null;
    }
}

// ✅ Optional
public static Optional<Status> parse(String nome) {
    if (nome == null) return Optional.empty();
    try {
        return Optional.of(valueOf(nome));
    } catch (IllegalArgumentException e) {
        return Optional.empty();
    }
}

// ✅ Valor padrão
Status status = Status.fromStringOrDefault(input, Status.ATIVO);

// ✅ Validar antes
if (nome != null) {
    try {
        status = Status.valueOf(nome);
    } catch (IllegalArgumentException e) {
        // Tratar
    }
}
```

**Exceções**:
- **IllegalArgumentException**: nome inválido
- **NullPointerException**: nome null

**Regra de Ouro**: **valueOf()** lança exceção se nome inválido ou null. **Sempre** validar ou usar método **safe** (fromString, parse, orDefault). **Documentar** exceções. **Mensagem** clara para usuário.
