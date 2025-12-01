# T3.02 - valueOf(String): Converte String para Enum

## Introdução

**valueOf()**: converte String (nome da constante) para enum.

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

Status s = Status.valueOf("ATIVO");
System.out.println(s); // ATIVO
```

**Case-sensitive**: deve ser exatamente o nome da constante.

---

## Fundamentos

### 1. Conversão Básica

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

Cor cor = Cor.valueOf("VERMELHO");
System.out.println(cor); // VERMELHO
```

### 2. Case-Sensitive

```java
// ✅ Exatamente como declarado
Status s1 = Status.valueOf("ATIVO"); // OK

// ❌ IllegalArgumentException
// Status s2 = Status.valueOf("ativo");    // Minúsculas
// Status s3 = Status.valueOf("Ativo");    // PascalCase
// Status s4 = Status.valueOf("ATIVOO");   // Typo
```

### 3. IllegalArgumentException

```java
try {
    Status s = Status.valueOf("INVALIDO");
} catch (IllegalArgumentException e) {
    System.out.println("Valor inválido: " + e.getMessage());
}
```

### 4. NullPointerException

```java
// ❌ NPE se null
try {
    Status s = Status.valueOf(null);
} catch (NullPointerException e) {
    System.out.println("String não pode ser null");
}
```

### 5. Conversão Segura

```java
public static Status parseStatus(String nome) {
    try {
        return Status.valueOf(nome);
    } catch (IllegalArgumentException e) {
        return Status.ATIVO; // Valor padrão
    }
}

Status s1 = parseStatus("INATIVO"); // INATIVO
Status s2 = parseStatus("INVALIDO"); // ATIVO (padrão)
```

### 6. valueOf() vs name()

```java
Status s = Status.ATIVO;

// name() → String
String nome = s.name(); // "ATIVO"

// valueOf() → Enum
Status s2 = Status.valueOf(nome); // ATIVO

System.out.println(s == s2); // true (mesma instância)
```

### 7. Entrada do Usuário

```java
Scanner scanner = new Scanner(System.in);
System.out.print("Status (ATIVO/INATIVO): ");
String input = scanner.nextLine();

try {
    Status status = Status.valueOf(input.toUpperCase());
    System.out.println("Status: " + status);
} catch (IllegalArgumentException e) {
    System.out.println("Status inválido");
}
```

### 8. Validar String Antes

```java
public static boolean isValid(String nome) {
    for (Status s : Status.values()) {
        if (s.name().equals(nome)) {
            return true;
        }
    }
    return false;
}

String input = "ATIVO";
if (isValid(input)) {
    Status s = Status.valueOf(input);
} else {
    System.out.println("Inválido");
}
```

### 9. Enum.valueOf()

```java
// Método genérico da classe Enum
Status s1 = Enum.valueOf(Status.class, "ATIVO");

// Equivalente a
Status s2 = Status.valueOf("ATIVO");

System.out.println(s1 == s2); // true
```

### 10. Conversão de Lista

```java
List<String> nomes = Arrays.asList("ATIVO", "INATIVO", "PENDENTE");

List<Status> status = nomes.stream()
    .map(Status::valueOf)
    .collect(Collectors.toList());

System.out.println(status); // [ATIVO, INATIVO, PENDENTE]
```

---

## Aplicabilidade

**valueOf()** para:
- Converter entrada do usuário
- Deserializar dados
- Parsear configurações
- APIs REST (String → Enum)

---

## Armadilhas

### 1. Case Mismatch

```java
// ❌ Erro: case diferente
// Status s = Status.valueOf("ativo"); // IllegalArgumentException

// ✅ Converter para maiúsculas
String input = "ativo";
Status s = Status.valueOf(input.toUpperCase()); // ATIVO
```

### 2. Null

```java
// ❌ NPE
// Status s = Status.valueOf(null);

// ✅ Validar null
String input = null;
if (input != null) {
    Status s = Status.valueOf(input);
}
```

### 3. Sem Try-Catch

```java
// ❌ Pode lançar exceção
String input = getUserInput();
Status s = Status.valueOf(input); // IllegalArgumentException se inválido

// ✅ Try-catch
try {
    Status s = Status.valueOf(input);
} catch (IllegalArgumentException e) {
    // Tratar erro
}
```

---

## Boas Práticas

### 1. Validar Entrada

```java
// ✅ Validar antes de converter
public static Status parse(String nome) {
    if (nome == null || nome.isEmpty()) {
        return Status.ATIVO; // Padrão
    }
    
    try {
        return Status.valueOf(nome.toUpperCase());
    } catch (IllegalArgumentException e) {
        return Status.ATIVO; // Padrão se inválido
    }
}
```

### 2. Optional para Conversão Segura

```java
// ✅ Optional
public static Optional<Status> tryParse(String nome) {
    try {
        return Optional.of(Status.valueOf(nome));
    } catch (IllegalArgumentException e) {
        return Optional.empty();
    }
}

// Uso
tryParse("ATIVO").ifPresent(s -> System.out.println(s));
tryParse("INVALIDO").ifPresent(s -> System.out.println(s)); // Não executa
```

### 3. Map para Conversão Rápida

```java
// ✅ Cache para conversão case-insensitive
public enum Status {
    ATIVO, INATIVO, PENDENTE;
    
    private static final Map<String, Status> MAP = new HashMap<>();
    
    static {
        for (Status s : values()) {
            MAP.put(s.name().toLowerCase(), s);
        }
    }
    
    public static Status fromString(String nome) {
        return MAP.get(nome.toLowerCase());
    }
}

Status s = Status.fromString("ativo"); // ATIVO (case-insensitive)
```

### 4. Mensagem de Erro Clara

```java
// ✅ Mensagem de erro útil
public static Status parse(String nome) {
    try {
        return Status.valueOf(nome);
    } catch (IllegalArgumentException e) {
        throw new IllegalArgumentException(
            "Status inválido: '" + nome + "'. Valores válidos: " +
            Arrays.toString(Status.values())
        );
    }
}
```

---

## Resumo

**valueOf()**:

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// String → Enum
Status s = Status.valueOf("ATIVO");
System.out.println(s); // ATIVO

// Enum → String
String nome = s.name(); // "ATIVO"

// Ciclo completo
Status s2 = Status.valueOf(s.name());
System.out.println(s == s2); // true (mesma instância)
```

**Exceções**:

```java
// IllegalArgumentException: nome inválido
// Status s = Status.valueOf("INVALIDO");

// NullPointerException: null
// Status s = Status.valueOf(null);

// ✅ Try-catch
try {
    Status s = Status.valueOf(input);
} catch (IllegalArgumentException e) {
    // Nome inválido
} catch (NullPointerException e) {
    // Input null
}
```

**Case-sensitive**:

```java
Status.valueOf("ATIVO")   // ✅ OK
Status.valueOf("ativo")   // ❌ IllegalArgumentException
Status.valueOf("Ativo")   // ❌ IllegalArgumentException

// ✅ Converter para maiúsculas
Status.valueOf(input.toUpperCase())
```

**Conversão segura**:

```java
public static Optional<Status> tryParse(String nome) {
    try {
        return Optional.of(Status.valueOf(nome));
    } catch (IllegalArgumentException | NullPointerException e) {
        return Optional.empty();
    }
}

// Uso
tryParse("ATIVO").ifPresent(s -> processar(s));
```

**Regra de Ouro**: `valueOf(String)` converte nome da constante (String) para enum. **Case-sensitive** (deve ser exatamente como declarado). Lança **IllegalArgumentException** se inválido, **NullPointerException** se null. Use try-catch ou validação prévia. `toUpperCase()` para case-insensitive. Retorna **mesma instância** (singleton).
