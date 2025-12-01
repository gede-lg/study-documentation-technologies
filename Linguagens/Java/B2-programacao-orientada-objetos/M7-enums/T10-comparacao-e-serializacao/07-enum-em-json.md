# T10.07 - Enum em JSON

## Introdução

**JSON**: formato texto para representar dados. **Enum em JSON**: serializar/desserializar como String.

```java
import com.fasterxml.jackson.databind.ObjectMapper;

public enum Status {
    ATIVO, INATIVO
}

ObjectMapper mapper = new ObjectMapper();

// ✅ Serializar para JSON
Status s = Status.ATIVO;
String json = mapper.writeValueAsString(s);
System.out.println(json); // "ATIVO"

// ✅ Desserializar de JSON
Status s2 = mapper.readValue(json, Status.class);
System.out.println(s2); // ATIVO
```

**Bibliotecas**: Jackson, Gson.

---

## Fundamentos

### 1. Jackson: Serialização Padrão

```java
import com.fasterxml.jackson.databind.ObjectMapper;

public enum Cor {
    VERMELHO, VERDE, AZUL
}

ObjectMapper mapper = new ObjectMapper();

// ✅ Serializar (usa nome da constante)
Cor cor = Cor.VERMELHO;
String json = mapper.writeValueAsString(cor);
System.out.println(json); // "VERMELHO"
```

### 2. Jackson: Desserialização Padrão

```java
import com.fasterxml.jackson.databind.ObjectMapper;

public enum Tipo {
    A, B, C
}

ObjectMapper mapper = new ObjectMapper();

// ✅ Desserializar
String json = "\"A\"";
Tipo tipo = mapper.readValue(json, Tipo.class);
System.out.println(tipo); // A
```

### 3. Enum em Objeto JSON

```java
import com.fasterxml.jackson.databind.ObjectMapper;

public enum Status {
    ATIVO, INATIVO
}

public class Usuario {
    private String nome;
    private Status status;
    
    // getters e setters
}

ObjectMapper mapper = new ObjectMapper();

// ✅ Serializar objeto com enum
Usuario u = new Usuario();
u.setNome("João");
u.setStatus(Status.ATIVO);

String json = mapper.writeValueAsString(u);
System.out.println(json); // {"nome":"João","status":"ATIVO"}

// ✅ Desserializar
Usuario u2 = mapper.readValue(json, Usuario.class);
System.out.println(u2.getStatus()); // ATIVO
```

### 4. Gson: Serialização Padrão

```java
import com.google.gson.Gson;

public enum Prioridade {
    ALTA, MEDIA, BAIXA
}

Gson gson = new Gson();

// ✅ Serializar
Prioridade p = Prioridade.ALTA;
String json = gson.toJson(p);
System.out.println(json); // "ALTA"
```

### 5. Gson: Desserialização Padrão

```java
import com.google.gson.Gson;

public enum Nivel {
    BASICO, INTERMEDIARIO, AVANCADO
}

Gson gson = new Gson();

// ✅ Desserializar
String json = "\"BASICO\"";
Nivel nivel = gson.fromJson(json, Nivel.class);
System.out.println(nivel); // BASICO
```

### 6. Lista de Enums em JSON

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.List;
import java.util.Arrays;

public enum Cor {
    VERMELHO, VERDE, AZUL
}

ObjectMapper mapper = new ObjectMapper();

// ✅ Serializar lista
List<Cor> cores = Arrays.asList(Cor.VERMELHO, Cor.AZUL);
String json = mapper.writeValueAsString(cores);
System.out.println(json); // ["VERMELHO","AZUL"]

// ✅ Desserializar lista
List<Cor> cores2 = mapper.readValue(json, new TypeReference<List<Cor>>() {});
System.out.println(cores2); // [VERMELHO, AZUL]
```

### 7. Map com Enum como Chave

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.Map;
import java.util.HashMap;

public enum Status {
    ATIVO, INATIVO
}

ObjectMapper mapper = new ObjectMapper();

// ✅ Serializar map
Map<Status, Integer> contadores = new HashMap<>();
contadores.put(Status.ATIVO, 10);
contadores.put(Status.INATIVO, 5);

String json = mapper.writeValueAsString(contadores);
System.out.println(json); // {"ATIVO":10,"INATIVO":5}

// ✅ Desserializar map
Map<Status, Integer> contadores2 = mapper.readValue(
    json, 
    new TypeReference<Map<Status, Integer>>() {}
);
System.out.println(contadores2); // {ATIVO=10, INATIVO=5}
```

### 8. Enum com Atributos em JSON

```java
import com.fasterxml.jackson.databind.ObjectMapper;

public enum Produto {
    NOTEBOOK("Notebook", 3000),
    MOUSE("Mouse", 50);
    
    private final String nome;
    private final double preco;
    
    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
    
    public String getNome() { return nome; }
    public double getPreco() { return preco; }
}

ObjectMapper mapper = new ObjectMapper();

// ✅ Serializar (padrão: apenas nome da constante)
Produto p = Produto.NOTEBOOK;
String json = mapper.writeValueAsString(p);
System.out.println(json); // "NOTEBOOK"

// ⚠️ Atributos não são serializados por padrão
// ✅ Use @JsonValue ou @JsonFormat para customizar
```

### 9. Caso Insensitivo

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.MapperFeature;

public enum Status {
    ATIVO, INATIVO
}

ObjectMapper mapper = new ObjectMapper();
mapper.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS);

// ✅ Desserializar (case insensitive)
Status s1 = mapper.readValue("\"ativo\"", Status.class);
Status s2 = mapper.readValue("\"ATIVO\"", Status.class);
Status s3 = mapper.readValue("\"Ativo\"", Status.class);

System.out.println(s1); // ATIVO
System.out.println(s2); // ATIVO
System.out.println(s3); // ATIVO
```

### 10. Erro ao Desserializar

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;

public enum Tipo {
    A, B, C
}

ObjectMapper mapper = new ObjectMapper();

// ❌ Constante inválida
try {
    String json = "\"D\""; // D não existe
    Tipo t = mapper.readValue(json, Tipo.class);
} catch (InvalidFormatException e) {
    System.err.println("Valor inválido: " + e.getValue());
}
```

---

## Aplicabilidade

**JSON** para:
- API REST
- Armazenamento em arquivo
- Transferência de dados
- Configuração

---

## Armadilhas

### 1. Constante Inexistente

```java
ObjectMapper mapper = new ObjectMapper();

// ❌ Valor não existe
String json = "\"INVALIDO\"";
try {
    Status s = mapper.readValue(json, Status.class);
} catch (InvalidFormatException e) {
    System.err.println("Valor inválido");
}
```

### 2. Atributos Não Serializados

```java
public enum Produto {
    A("Nome", 100);
    
    private final String nome;
    private final double preco;
    
    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
}

// ⚠️ Serializa apenas nome da constante
ObjectMapper mapper = new ObjectMapper();
String json = mapper.writeValueAsString(Produto.A);
System.out.println(json); // "A" (não serializa nome e preco)
```

### 3. Case Sensitive

```java
ObjectMapper mapper = new ObjectMapper();

// ❌ Erro: case mismatch
String json = "\"ativo\""; // minúsculo
try {
    Status s = mapper.readValue(json, Status.class); // Erro (ATIVO é maiúsculo)
} catch (InvalidFormatException e) {
    System.err.println("Valor inválido");
}

// ✅ Habilitar case insensitive
mapper.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS);
```

---

## Boas Práticas

### 1. Case Insensitive

```java
ObjectMapper mapper = new ObjectMapper();
mapper.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS);
```

### 2. Tratar Exceções

```java
try {
    Status s = mapper.readValue(json, Status.class);
} catch (InvalidFormatException e) {
    System.err.println("Valor inválido: " + e.getValue());
}
```

### 3. TypeReference para Collections

```java
// ✅ Lista
List<Status> lista = mapper.readValue(json, new TypeReference<List<Status>>() {});

// ✅ Map
Map<Status, Integer> map = mapper.readValue(json, new TypeReference<Map<Status, Integer>>() {});
```

### 4. Validar JSON

```java
public static Status fromJson(String json) {
    try {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(json, Status.class);
    } catch (Exception e) {
        return Status.ATIVO; // Valor padrão
    }
}
```

---

## Resumo

**Jackson**:

```java
import com.fasterxml.jackson.databind.ObjectMapper;

public enum Status {
    ATIVO, INATIVO
}

ObjectMapper mapper = new ObjectMapper();

// ✅ Serializar
Status s = Status.ATIVO;
String json = mapper.writeValueAsString(s);
System.out.println(json); // "ATIVO"

// ✅ Desserializar
Status s2 = mapper.readValue(json, Status.class);
System.out.println(s2); // ATIVO
```

**Gson**:

```java
import com.google.gson.Gson;

Gson gson = new Gson();

// ✅ Serializar
String json = gson.toJson(Status.ATIVO);

// ✅ Desserializar
Status s = gson.fromJson(json, Status.class);
```

**Objeto com enum**:

```java
public class Usuario {
    private String nome;
    private Status status;
}

// ✅ JSON: {"nome":"João","status":"ATIVO"}
```

**Case insensitive**:

```java
mapper.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS);
```

**Regra de Ouro**: **JSON serializa nome da constante**. **Jackson/Gson** serializam como String. **Habilitar case insensitive** para robustez. **Tratar InvalidFormatException** ao desserializar. **TypeReference** para collections. **Validar JSON** antes de usar.
