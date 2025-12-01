# T12.10 - Tratar Exceções ao Converter String

## Introdução

**Conversão String → Enum**: sempre pode falhar.

```java
public enum Status {
    ATIVO,
    INATIVO
}

// ❌ Sem tratamento
public void setStatus(String statusNome) {
    this.status = Status.valueOf(statusNome); // ⚠️ Pode lançar exceção
}

// ✅ Com tratamento
public void setStatus(String statusNome) {
    try {
        this.status = Status.valueOf(statusNome);
    } catch (IllegalArgumentException e) {
        throw new IllegalArgumentException(
            "Status inválido: " + statusNome + 
            ". Valores válidos: ATIVO, INATIVO"
        );
    } catch (NullPointerException e) {
        throw new IllegalArgumentException("Status não pode ser null");
    }
}
```

**Sempre tratar** exceções na conversão.

---

## Fundamentos

### 1. Try-Catch Básico

```java
// ❌ Sem tratamento
public Status converterStatus(String nome) {
    return Status.valueOf(nome); // ⚠️ Pode lançar
}

// ✅ Com try-catch
public Status converterStatus(String nome) {
    try {
        return Status.valueOf(nome);
    } catch (IllegalArgumentException e) {
        throw new IllegalArgumentException(
            "Status inválido: '" + nome + "'. " +
            "Valores válidos: " + Arrays.toString(Status.values())
        );
    } catch (NullPointerException e) {
        throw new IllegalArgumentException("Status não pode ser null");
    }
}
```

### 2. Retornar Null

```java
/**
 * Converte String em Status, retornando null se inválido.
 * 
 * @param nome nome do status (case-sensitive)
 * @return Status ou null se nome inválido ou null
 */
public static Status fromString(String nome) {
    if (nome == null) {
        return null;
    }
    
    try {
        return Status.valueOf(nome);
    } catch (IllegalArgumentException e) {
        return null;
    }
}

// ✅ Uso
Status status = Status.fromString("ATIVO"); // ATIVO
Status status = Status.fromString("PENDENTE"); // null
Status status = Status.fromString(null); // null

// ✅ Validar resultado
Status status = Status.fromString(input);
if (status == null) {
    throw new IllegalArgumentException("Status inválido: " + input);
}
```

### 3. Retornar Optional

```java
/**
 * Converte String em Status, retornando Optional vazio se inválido.
 * 
 * @param nome nome do status
 * @return Optional com Status ou vazio
 */
public static Optional<Status> parse(String nome) {
    if (nome == null) {
        return Optional.empty();
    }
    
    try {
        return Optional.of(Status.valueOf(nome));
    } catch (IllegalArgumentException e) {
        return Optional.empty();
    }
}

// ✅ Uso com Optional
Status status = Status.parse("ATIVO")
                      .orElse(Status.INATIVO); // Padrão se inválido

Status status = Status.parse("ATIVO")
                      .orElseThrow(() -> 
                          new IllegalArgumentException("Status inválido"));

Status.parse(input)
      .ifPresentOrElse(
          s -> System.out.println("Status: " + s),
          () -> System.out.println("Status inválido")
      );
```

### 4. Valor Padrão

```java
/**
 * Converte String em Status, usando valor padrão se inválido.
 * 
 * @param nome nome do status
 * @param padrao valor padrão se nome inválido ou null
 * @return Status ou padrão
 */
public static Status fromStringOrDefault(String nome, Status padrao) {
    if (nome == null) {
        return padrao;
    }
    
    try {
        return Status.valueOf(nome);
    } catch (IllegalArgumentException e) {
        return padrao;
    }
}

// ✅ Uso com padrão
Status status = Status.fromStringOrDefault(input, Status.INATIVO);
```

### 5. Log de Erro

```java
private static final Logger LOGGER = LoggerFactory.getLogger(Status.class);

public static Status fromString(String nome) {
    if (nome == null) {
        LOGGER.warn("Tentativa de conversão de null para Status");
        return null;
    }
    
    try {
        return Status.valueOf(nome);
    } catch (IllegalArgumentException e) {
        LOGGER.warn("Status inválido: '{}'. Valores válidos: {}", 
                    nome, Arrays.toString(values()));
        return null;
    }
}
```

### 6. Mensagem Clara

```java
public static Status fromStringStrict(String nome) {
    if (nome == null) {
        throw new IllegalArgumentException(
            "Nome não pode ser null. " +
            "Valores válidos: " + Arrays.toString(Status.values())
        );
    }
    
    try {
        return Status.valueOf(nome);
    } catch (IllegalArgumentException e) {
        String mensagem = String.format(
            "Status inválido: '%s'. " +
            "Valores válidos (case-sensitive): %s. " +
            "Você quis dizer '%s'?",
            nome,
            Arrays.toString(Status.values()),
            sugerirProximo(nome)
        );
        throw new IllegalArgumentException(mensagem, e);
    }
}

private static String sugerirProximo(String nome) {
    // Lógica de sugestão (ex: distância de Levenshtein)
    return Arrays.stream(values())
                 .map(Enum::name)
                 .filter(n -> n.equalsIgnoreCase(nome))
                 .findFirst()
                 .orElse("?");
}
```

### 7. Validação de Entrada

```java
// ❌ Não validar
public void processarPedido(String statusNome) {
    Status status = Status.valueOf(statusNome); // ⚠️ Pode lançar
    pedido.setStatus(status);
}

// ✅ Validar e tratar
public void processarPedido(String statusNome) {
    if (statusNome == null || statusNome.trim().isEmpty()) {
        throw new IllegalArgumentException("Status não pode ser vazio");
    }
    
    Status status;
    try {
        status = Status.valueOf(statusNome.trim().toUpperCase());
    } catch (IllegalArgumentException e) {
        throw new IllegalArgumentException(
            "Status inválido: " + statusNome + 
            ". Valores válidos: " + Arrays.toString(Status.values()),
            e
        );
    }
    
    pedido.setStatus(status);
}
```

### 8. Conversão Case-Insensitive

```java
public static Status fromStringIgnoreCase(String nome) {
    if (nome == null || nome.trim().isEmpty()) {
        return null;
    }
    
    String nomeUpper = nome.trim().toUpperCase();
    
    try {
        return Status.valueOf(nomeUpper);
    } catch (IllegalArgumentException e) {
        // Tentativa manual (case-insensitive)
        for (Status s : values()) {
            if (s.name().equalsIgnoreCase(nome.trim())) {
                return s;
            }
        }
        return null;
    }
}

// ✅ Aceita maiúsculas/minúsculas
Status status = Status.fromStringIgnoreCase("ativo"); // ATIVO
Status status = Status.fromStringIgnoreCase("ATIVO"); // ATIVO
Status status = Status.fromStringIgnoreCase("  Ativo  "); // ATIVO (trim)
```

### 9. Conversão com Mapeamento

```java
public enum Status {
    ATIVO("ativo", "a", "1"),
    INATIVO("inativo", "i", "0");
    
    private final String[] aliases;
    
    Status(String... aliases) {
        this.aliases = aliases;
    }
    
    /**
     * Converte String em Status, aceitando aliases.
     * 
     * @param valor nome ou alias
     * @return Status ou null
     */
    public static Status fromStringFlexivel(String valor) {
        if (valor == null || valor.trim().isEmpty()) {
            return null;
        }
        
        String valorLimpo = valor.trim().toLowerCase();
        
        // Tentar pelo nome
        try {
            return Status.valueOf(valor.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            // Ignorar, tentar aliases
        }
        
        // Tentar pelos aliases
        for (Status s : values()) {
            for (String alias : s.aliases) {
                if (alias.equalsIgnoreCase(valorLimpo)) {
                    return s;
                }
            }
        }
        
        return null;
    }
}

// ✅ Aceita nome e aliases
Status status = Status.fromStringFlexivel("ATIVO"); // ATIVO
Status status = Status.fromStringFlexivel("ativo"); // ATIVO
Status status = Status.fromStringFlexivel("a"); // ATIVO
Status status = Status.fromStringFlexivel("1"); // ATIVO
```

### 10. Integração com Bean Validation

```java
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidEnumValidator.class)
public @interface ValidEnum {
    String message() default "Valor inválido para enum";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    Class<? extends Enum<?>> enumClass();
}

public class ValidEnumValidator implements ConstraintValidator<ValidEnum, String> {
    private Class<? extends Enum<?>> enumClass;
    
    @Override
    public void initialize(ValidEnum annotation) {
        this.enumClass = annotation.enumClass();
    }
    
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // Usar @NotNull para validar null
        }
        
        try {
            Enum.valueOf((Class) enumClass, value);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}

// ✅ Uso
public class PedidoDTO {
    @ValidEnum(enumClass = Status.class, message = "Status inválido")
    private String status;
}
```

---

## Aplicabilidade

**Try-catch** para:
- Conversão direta com falha
- Mensagem de erro personalizada

**Método safe** (fromString) para:
- Entrada de usuário
- Dados externos

**Optional** para:
- Pipeline funcional
- Composição

**Valor padrão** para:
- Fallback automático
- Configuração

---

## Armadilhas

### 1. Não Tratar Exceção

```java
// ❌ valueOf() sem tratamento
Status status = Status.valueOf(input); // ⚠️ Pode lançar

// ✅ Tratar
try {
    status = Status.valueOf(input);
} catch (IllegalArgumentException e) {
    // Tratar
}
```

### 2. Mensagem Genérica

```java
// ❌ Mensagem genérica
catch (IllegalArgumentException e) {
    throw new RuntimeException("Erro"); // ⚠️ Não informativo
}

// ✅ Mensagem clara
catch (IllegalArgumentException e) {
    throw new IllegalArgumentException(
        "Status inválido: " + input + 
        ". Valores válidos: ATIVO, INATIVO"
    );
}
```

### 3. Ignorar NullPointerException

```java
// ❌ Só tratar IllegalArgumentException
try {
    status = Status.valueOf(input);
} catch (IllegalArgumentException e) {
    // ...
}
// ⚠️ NullPointerException não tratado

// ✅ Validar null ou tratar ambas
if (input == null) {
    throw new IllegalArgumentException("Status não pode ser null");
}
try {
    status = Status.valueOf(input);
} catch (IllegalArgumentException e) {
    // ...
}
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

### 2. Mensagem Clara

```java
catch (IllegalArgumentException e) {
    throw new IllegalArgumentException(
        "Valor inválido: " + input + 
        ". Valores válidos: " + Arrays.toString(values())
    );
}
```

### 3. Log de Erro

```java
catch (IllegalArgumentException e) {
    LOGGER.warn("Valor inválido: {}", input);
    return null;
}
```

### 4. Documentar

```java
/**
 * @param nome nome da constante (case-sensitive)
 * @return Status ou null se inválido
 */
public static Status fromString(String nome) { }
```

---

## Resumo

**Tratamento de exceção**:

```java
// ❌ Sem tratamento
Status status = Status.valueOf(input); // ⚠️ Perigoso

// ✅ Try-catch
try {
    status = Status.valueOf(input);
} catch (IllegalArgumentException e) {
    throw new IllegalArgumentException(
        "Status inválido: " + input + 
        ". Valores válidos: " + Arrays.toString(Status.values())
    );
}

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
public static Status fromStringOrDefault(String nome, Status padrao) {
    if (nome == null) return padrao;
    try {
        return valueOf(nome);
    } catch (IllegalArgumentException e) {
        return padrao;
    }
}
```

**Regra de Ouro**: **Sempre tratar** exceções ao converter String → Enum. **Mensagem clara** com valores válidos. **Validar null** antes. **Log** de erros. Preferir **método safe** (fromString, parse, orDefault) para entrada de usuário.
