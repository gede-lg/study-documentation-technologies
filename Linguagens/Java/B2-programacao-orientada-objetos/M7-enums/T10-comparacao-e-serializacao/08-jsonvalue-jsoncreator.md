# T10.08 - @JsonValue e @JsonCreator

## Introdução

**@JsonValue**: customizar serialização. **@JsonCreator**: customizar desserialização.

```java
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.JsonCreator;

public enum Status {
    ATIVO("A"), INATIVO("I");
    
    private final String codigo;
    
    Status(String codigo) {
        this.codigo = codigo;
    }
    
    @JsonValue
    public String getCodigo() {
        return codigo;
    }
    
    @JsonCreator
    public static Status fromCodigo(String codigo) {
        for (Status s : values()) {
            if (s.codigo.equals(codigo)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Código inválido: " + codigo);
    }
}

// ✅ JSON: "A" em vez de "ATIVO"
```

**@JsonValue**: valor serializado. **@JsonCreator**: converter String → Enum.

---

## Fundamentos

### 1. @JsonValue: Serializar Atributo

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Prioridade {
    ALTA("H"), MEDIA("M"), BAIXA("L");
    
    private final String codigo;
    
    Prioridade(String codigo) {
        this.codigo = codigo;
    }
    
    @JsonValue
    public String getCodigo() {
        return codigo;
    }
}

ObjectMapper mapper = new ObjectMapper();

// ✅ Serializa código (não nome)
Prioridade p = Prioridade.ALTA;
String json = mapper.writeValueAsString(p);
System.out.println(json); // "H"
```

### 2. @JsonCreator: Desserializar de Atributo

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.JsonCreator;

public enum Nivel {
    BASICO("B"), INTERMEDIARIO("I"), AVANCADO("A");
    
    private final String sigla;
    
    Nivel(String sigla) {
        this.sigla = sigla;
    }
    
    @JsonValue
    public String getSigla() {
        return sigla;
    }
    
    @JsonCreator
    public static Nivel fromSigla(String sigla) {
        for (Nivel n : values()) {
            if (n.sigla.equals(sigla)) {
                return n;
            }
        }
        throw new IllegalArgumentException("Sigla inválida: " + sigla);
    }
}

ObjectMapper mapper = new ObjectMapper();

// ✅ Serializar
Nivel n1 = Nivel.BASICO;
String json = mapper.writeValueAsString(n1);
System.out.println(json); // "B"

// ✅ Desserializar
Nivel n2 = mapper.readValue("\"B\"", Nivel.class);
System.out.println(n2); // BASICO
```

### 3. @JsonValue com toString()

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Status {
    ATIVO, INATIVO;
    
    @JsonValue
    @Override
    public String toString() {
        return name().toLowerCase();
    }
}

ObjectMapper mapper = new ObjectMapper();

// ✅ Serializa minúsculo
Status s = Status.ATIVO;
String json = mapper.writeValueAsString(s);
System.out.println(json); // "ativo"
```

### 4. @JsonCreator com Switch

```java
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.JsonCreator;

public enum Tipo {
    A, B, C;
    
    @JsonValue
    public String toJson() {
        return name().toLowerCase();
    }
    
    @JsonCreator
    public static Tipo fromJson(String valor) {
        switch (valor.toUpperCase()) {
            case "A": return A;
            case "B": return B;
            case "C": return C;
            default: throw new IllegalArgumentException("Valor inválido: " + valor);
        }
    }
}

// ✅ JSON: "a", "b", "c"
```

### 5. @JsonValue com Objeto

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Map;

public enum Produto {
    NOTEBOOK("Notebook", 3000),
    MOUSE("Mouse", 50);
    
    private final String nome;
    private final double preco;
    
    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
    
    @JsonValue
    public Map<String, Object> toJson() {
        return Map.of("nome", nome, "preco", preco);
    }
}

ObjectMapper mapper = new ObjectMapper();

// ✅ Serializa como objeto
Produto p = Produto.NOTEBOOK;
String json = mapper.writeValueAsString(p);
System.out.println(json); // {"nome":"Notebook","preco":3000.0}
```

### 6. @JsonCreator com Múltiplos Valores

```java
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.JsonCreator;

public enum Status {
    ATIVO("A", "ACTIVE"),
    INATIVO("I", "INACTIVE");
    
    private final String codigo;
    private final String nomeIngles;
    
    Status(String codigo, String nomeIngles) {
        this.codigo = codigo;
        this.nomeIngles = nomeIngles;
    }
    
    @JsonValue
    public String getCodigo() {
        return codigo;
    }
    
    @JsonCreator
    public static Status fromValor(String valor) {
        // ✅ Aceita código ou nome em inglês
        for (Status s : values()) {
            if (s.codigo.equals(valor) || s.nomeIngles.equals(valor)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Valor inválido: " + valor);
    }
}

// ✅ Aceita "A" ou "ACTIVE"
```

### 7. @JsonCreator com Case Insensitive

```java
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.JsonCreator;

public enum Cor {
    VERMELHO, VERDE, AZUL;
    
    @JsonValue
    public String toJson() {
        return name().toLowerCase();
    }
    
    @JsonCreator
    public static Cor fromJson(String valor) {
        // ✅ Case insensitive
        for (Cor c : values()) {
            if (c.name().equalsIgnoreCase(valor)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Cor inválida: " + valor);
    }
}

// ✅ Aceita "vermelho", "VERMELHO", "Vermelho"
```

### 8. @JsonValue com Número

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.JsonCreator;

public enum Prioridade {
    BAIXA(1), MEDIA(2), ALTA(3);
    
    private final int valor;
    
    Prioridade(int valor) {
        this.valor = valor;
    }
    
    @JsonValue
    public int getValor() {
        return valor;
    }
    
    @JsonCreator
    public static Prioridade fromValor(int valor) {
        for (Prioridade p : values()) {
            if (p.valor == valor) {
                return p;
            }
        }
        throw new IllegalArgumentException("Valor inválido: " + valor);
    }
}

ObjectMapper mapper = new ObjectMapper();

// ✅ JSON: 1, 2, 3 (número, não string)
Prioridade p = Prioridade.ALTA;
String json = mapper.writeValueAsString(p);
System.out.println(json); // 3
```

### 9. @JsonCreator com Fallback

```java
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.JsonCreator;

public enum Status {
    ATIVO, INATIVO, DESCONHECIDO;
    
    @JsonValue
    public String toJson() {
        return name();
    }
    
    @JsonCreator
    public static Status fromJson(String valor) {
        try {
            return valueOf(valor.toUpperCase());
        } catch (IllegalArgumentException e) {
            return DESCONHECIDO; // ✅ Fallback
        }
    }
}

// ✅ Valor inválido → DESCONHECIDO
```

### 10. @JsonValue com Enum em Classe

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.JsonCreator;

public enum Tipo {
    A("Tipo A"), B("Tipo B");
    
    private final String descricao;
    
    Tipo(String descricao) {
        this.descricao = descricao;
    }
    
    @JsonValue
    public String getDescricao() {
        return descricao;
    }
    
    @JsonCreator
    public static Tipo fromDescricao(String descricao) {
        for (Tipo t : values()) {
            if (t.descricao.equals(descricao)) {
                return t;
            }
        }
        throw new IllegalArgumentException("Descrição inválida: " + descricao);
    }
}

public class Item {
    private String nome;
    private Tipo tipo;
    
    // getters e setters
}

ObjectMapper mapper = new ObjectMapper();

// ✅ JSON: {"nome":"Item 1","tipo":"Tipo A"}
```

---

## Aplicabilidade

**@JsonValue** para:
- Serializar atributo customizado
- Serializar como número
- Serializar minúsculo

**@JsonCreator** para:
- Desserializar de atributo
- Case insensitive
- Múltiplos valores aceitos

---

## Armadilhas

### 1. @JsonValue em Múltiplos Métodos

```java
// ❌ Apenas um @JsonValue permitido
public enum Status {
    ATIVO;
    
    @JsonValue
    public String getCodigo() { return "A"; }
    
    @JsonValue // ❌ Erro
    public String getNome() { return "Ativo"; }
}

// ✅ Usar apenas um @JsonValue
```

### 2. @JsonCreator Sem Validação

```java
// ⚠️ Sem validação (lança exceção)
@JsonCreator
public static Status fromCodigo(String codigo) {
    return valueOf(codigo); // Lança IllegalArgumentException se inválido
}

// ✅ Com validação ou fallback
@JsonCreator
public static Status fromCodigo(String codigo) {
    try {
        return valueOf(codigo);
    } catch (IllegalArgumentException e) {
        return DESCONHECIDO;
    }
}
```

### 3. @JsonCreator com null

```java
@JsonCreator
public static Status fromCodigo(String codigo) {
    if (codigo == null) {
        return ATIVO; // ✅ Tratar null
    }
    // ...
}
```

---

## Boas Práticas

### 1. @JsonValue para Serialização

```java
@JsonValue
public String getCodigo() {
    return codigo;
}
```

### 2. @JsonCreator para Desserialização

```java
@JsonCreator
public static Tipo fromCodigo(String codigo) {
    for (Tipo t : values()) {
        if (t.codigo.equals(codigo)) {
            return t;
        }
    }
    throw new IllegalArgumentException("Código inválido: " + codigo);
}
```

### 3. Fallback para Valor Inválido

```java
@JsonCreator
public static Status fromCodigo(String codigo) {
    try {
        return valueOf(codigo);
    } catch (IllegalArgumentException e) {
        return DESCONHECIDO;
    }
}
```

### 4. Case Insensitive

```java
@JsonCreator
public static Cor fromJson(String valor) {
    for (Cor c : values()) {
        if (c.name().equalsIgnoreCase(valor)) {
            return c;
        }
    }
    throw new IllegalArgumentException("Cor inválida: " + valor);
}
```

---

## Resumo

**@JsonValue**:

```java
public enum Status {
    ATIVO("A"), INATIVO("I");
    
    private final String codigo;
    
    Status(String codigo) {
        this.codigo = codigo;
    }
    
    @JsonValue
    public String getCodigo() {
        return codigo;
    }
}

// ✅ JSON: "A" (não "ATIVO")
```

**@JsonCreator**:

```java
@JsonCreator
public static Status fromCodigo(String codigo) {
    for (Status s : values()) {
        if (s.codigo.equals(codigo)) {
            return s;
        }
    }
    throw new IllegalArgumentException("Código inválido: " + codigo);
}

// ✅ Desserializa "A" → ATIVO
```

**Número**:

```java
@JsonValue
public int getValor() {
    return valor;
}

// ✅ JSON: 1, 2, 3 (número)
```

**Fallback**:

```java
@JsonCreator
public static Status fromCodigo(String codigo) {
    try {
        return valueOf(codigo);
    } catch (IllegalArgumentException e) {
        return DESCONHECIDO;
    }
}
```

**Regra de Ouro**: **@JsonValue** customiza serialização (atributo, número, minúsculo). **@JsonCreator** customiza desserialização (converter String/número → enum). **Um @JsonValue** por enum. **Validar entrada** em @JsonCreator. **Fallback** para valor inválido. **Case insensitive** para robustez.
