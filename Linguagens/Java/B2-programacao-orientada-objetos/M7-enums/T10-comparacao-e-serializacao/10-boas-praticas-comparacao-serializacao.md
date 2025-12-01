# T10.10 - Boas Práticas: Comparação e Serialização

## Introdução

**Boas práticas**: comparação segura, serialização robusta, conversão confiável.

```java
public enum Status {
    ATIVO, INATIVO;
    
    // ✅ Comparação: sempre usar ==
    // ✅ Serialização: enum é seguro por padrão
    // ✅ Conversão: criar método customizado
}
```

**Resumo**: `==` para comparação, serialização automática, parsing customizado.

---

## Fundamentos

### 1. Use == para Comparação

```java
public enum Status {
    ATIVO, INATIVO
}

Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

// ✅ Usar ==
if (s1 == s2) {
    System.out.println("Iguais");
}

// ⚠️ Evitar equals() (desnecessário)
if (s1.equals(s2)) {
    System.out.println("Iguais");
}
```

### 2. Verificar null com ==

```java
Status s = obterStatus(); // pode ser null

// ✅ Verificar null
if (s != null && s == Status.ATIVO) {
    System.out.println("Ativo");
}

// ⚠️ equals() pode lançar NPE
// if (s.equals(Status.ATIVO)) { } // NPE se s for null
```

### 3. Ordem Segura com equals()

```java
Status s = obterStatus(); // pode ser null

// ✅ Constante primeiro (null-safe)
if (Status.ATIVO.equals(s)) {
    System.out.println("Ativo");
}

// ❌ Variável primeiro (risco de NPE)
// if (s.equals(Status.ATIVO)) { } // NPE se s for null
```

### 4. compareTo() para Ordenação

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA // ✅ Ordem crescente
}

List<Prioridade> lista = Arrays.asList(Prioridade.ALTA, Prioridade.BAIXA);

// ✅ Ordenar por ordem natural (ordinal)
Collections.sort(lista);

// ✅ Resultado: [BAIXA, MEDIA, ALTA]
```

### 5. Comparator para Ordem Customizada

```java
public enum Produto {
    NOTEBOOK(3000), MOUSE(50);
    
    private final double preco;
    
    Produto(double preco) {
        this.preco = preco;
    }
    
    public double getPreco() { return preco; }
    
    // ✅ Comparator constante
    public static final Comparator<Produto> POR_PRECO = 
        Comparator.comparingDouble(Produto::getPreco);
}

// ✅ Ordenar por preço
lista.sort(Produto.POR_PRECO);
```

### 6. Enum é Serializable Automaticamente

```java
import java.io.*;

public enum Status {
    ATIVO, INATIVO
}

// ✅ Não precisa declarar implements Serializable
// ✅ Serialização automática
Status s1 = Status.ATIVO;

// Serializar
ByteArrayOutputStream baos = new ByteArrayOutputStream();
ObjectOutputStream oos = new ObjectOutputStream(baos);
oos.writeObject(s1);
oos.close();

// Desserializar
ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
ObjectInputStream ois = new ObjectInputStream(bais);
Status s2 = (Status) ois.readObject();
ois.close();

// ✅ Singleton preservado
System.out.println(s1 == s2); // true
```

### 7. Tratar Exceções na Desserialização

```java
import java.io.*;

public enum Tipo {
    A, B
}

// ✅ Tratar exceções
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("tipo.ser"))) {
    Tipo t = (Tipo) ois.readObject();
} catch (InvalidObjectException e) {
    System.err.println("Constante inválida");
} catch (IOException | ClassNotFoundException e) {
    System.err.println("Erro de desserialização");
}
```

### 8. JSON com Case Insensitive

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.MapperFeature;

public enum Status {
    ATIVO, INATIVO
}

// ✅ Habilitar case insensitive
ObjectMapper mapper = new ObjectMapper();
mapper.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS);

// ✅ Aceita "ativo", "ATIVO", "Ativo"
Status s = mapper.readValue("\"ativo\"", Status.class);
```

### 9. @JsonValue e @JsonCreator

```java
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.JsonCreator;

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
    
    @JsonCreator
    public static Prioridade fromCodigo(String codigo) {
        for (Prioridade p : values()) {
            if (p.codigo.equals(codigo)) {
                return p;
            }
        }
        throw new IllegalArgumentException("Código inválido: " + codigo);
    }
}

// ✅ JSON: "H", "M", "L"
```

### 10. Método fromString() Customizado

```java
public enum Status {
    ATIVO, INATIVO, DESCONHECIDO;
    
    // ✅ Parsing customizado (case insensitive + fallback)
    public static Status fromString(String valor) {
        if (valor == null) {
            return DESCONHECIDO;
        }
        
        for (Status s : values()) {
            if (s.name().equalsIgnoreCase(valor)) {
                return s;
            }
        }
        
        return DESCONHECIDO; // Fallback
    }
}

// ✅ Uso
Status s1 = Status.fromString("ativo");    // ATIVO
Status s2 = Status.fromString("invalido"); // DESCONHECIDO
Status s3 = Status.fromString(null);       // DESCONHECIDO
```

---

## Aplicabilidade

**Boas práticas** para:
- Comparação segura
- Serialização robusta
- Conversão confiável
- Código limpo

---

## Armadilhas

### 1. Usar equals() Desnecessariamente

```java
Status s = Status.ATIVO;

// ⚠️ Desnecessário
if (s.equals(Status.ATIVO)) { }

// ✅ Preferir ==
if (s == Status.ATIVO) { }
```

### 2. valueOf() Sem Tratamento

```java
// ❌ Sem tratamento
String valor = "invalido";
// Status s = Status.valueOf(valor); // IllegalArgumentException

// ✅ Com tratamento ou método customizado
try {
    Status s = Status.valueOf(valor);
} catch (IllegalArgumentException e) {
    // Tratar erro
}
```

### 3. Não Verificar null

```java
Status s = obterStatus(); // pode ser null

// ❌ Risco de NPE
// if (s.equals(Status.ATIVO)) { } // NPE

// ✅ Verificar null
if (s != null && s == Status.ATIVO) { }
```

---

## Boas Práticas

### 1. Sempre Use ==

```java
// ✅ Comparação com ==
if (status == Status.ATIVO) { }
```

### 2. Verificar null

```java
// ✅ Verificar null antes
if (status != null && status == Status.ATIVO) { }
```

### 3. Ordem Segura com equals()

```java
// ✅ Constante primeiro
if (Status.ATIVO.equals(status)) { }
```

### 4. Declarar Ordem Correta

```java
// ✅ Ordem crescente para compareTo()
public enum Prioridade {
    BAIXA, MEDIA, ALTA
}
```

### 5. Comparator Constante

```java
// ✅ Comparator como constante
public static final Comparator<Produto> POR_PRECO = 
    Comparator.comparingDouble(Produto::getPreco);
```

### 6. Tratar Exceções

```java
// ✅ Tratar exceções na desserialização
try {
    Status s = (Status) ois.readObject();
} catch (InvalidObjectException | IOException | ClassNotFoundException e) {
    // Tratar erro
}
```

### 7. Case Insensitive em JSON

```java
// ✅ Habilitar case insensitive
mapper.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS);
```

### 8. @JsonValue e @JsonCreator

```java
// ✅ Customizar serialização/desserialização
@JsonValue
public String getCodigo() { return codigo; }

@JsonCreator
public static Tipo fromCodigo(String codigo) { }
```

### 9. Método fromString() Customizado

```java
// ✅ Parsing customizado (case insensitive + fallback)
public static Status fromString(String valor) {
    if (valor == null) {
        return DESCONHECIDO;
    }
    
    for (Status s : values()) {
        if (s.name().equalsIgnoreCase(valor)) {
            return s;
        }
    }
    
    return DESCONHECIDO;
}
```

### 10. Não Remover Constantes

```java
// ✅ Adicionar novas constantes (OK)
public enum Status {
    ATIVO, INATIVO, PENDENTE // ✅ Adicionar

// ❌ Remover constantes (quebra desserialização)
```

---

## Resumo

**Comparação**:

```java
// ✅ Usar ==
if (s == Status.ATIVO) { }

// ✅ Verificar null
if (s != null && s == Status.ATIVO) { }

// ✅ Ordem segura com equals()
if (Status.ATIVO.equals(s)) { }
```

**Ordenação**:

```java
// ✅ compareTo() (ordem natural)
Collections.sort(lista);

// ✅ Comparator (ordem customizada)
lista.sort(Produto.POR_PRECO);
```

**Serialização**:

```java
// ✅ Enum é Serializable automaticamente
// ✅ Singleton preservado
// ✅ Tratar exceções na desserialização
```

**JSON**:

```java
// ✅ Case insensitive
mapper.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS);

// ✅ @JsonValue e @JsonCreator
@JsonValue
public String getCodigo() { return codigo; }

@JsonCreator
public static Tipo fromCodigo(String codigo) { }
```

**Conversão**:

```java
// ✅ Método customizado (case insensitive + fallback)
public static Status fromString(String valor) {
    if (valor == null) {
        return DESCONHECIDO;
    }
    
    for (Status s : values()) {
        if (s.name().equalsIgnoreCase(valor)) {
            return s;
        }
    }
    
    return DESCONHECIDO;
}
```

**Regra de Ouro**: **Sempre `==`** para comparação. **Verificar null**. **Ordem segura** com equals(). **compareTo()** para ordenação natural. **Comparator** para ordem customizada. **Enum é Serializable** automaticamente. **Tratar exceções** na desserialização. **Case insensitive** em JSON. **@JsonValue/@JsonCreator** para customizar. **Método fromString()** customizado. **Não remover constantes**.
