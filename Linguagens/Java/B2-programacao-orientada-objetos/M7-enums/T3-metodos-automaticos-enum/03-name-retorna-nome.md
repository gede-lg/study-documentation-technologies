# T3.03 - name(): Retorna Nome da Constante

## Introdução

**name()**: retorna nome exato da constante como String.

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

Status s = Status.ATIVO;
System.out.println(s.name()); // "ATIVO"
```

**Imutável**: sempre retorna mesmo nome (final).

---

## Fundamentos

### 1. Retorno Básico

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

Cor cor = Cor.VERMELHO;
String nome = cor.name();
System.out.println(nome); // "VERMELHO"
```

### 2. Exatamente Como Declarado

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA
}

DiaSemana dia = DiaSemana.SEGUNDA;
System.out.println(dia.name()); // "SEGUNDA" (maiúsculas)
```

### 3. name() vs toString()

```java
Status s = Status.ATIVO;

// name() = nome exato (final, não pode sobrescrever)
System.out.println(s.name()); // "ATIVO"

// toString() = pode ser sobrescrito
System.out.println(s.toString()); // "ATIVO" (padrão)
```

### 4. name() é Final

```java
public enum Status {
    ATIVO, INATIVO;
    
    // ❌ ERRO: cannot override final method
    // @Override
    // public String name() {
    //     return "Custom";
    // }
}
```

### 5. Conversão para valueOf()

```java
Status s1 = Status.ATIVO;
String nome = s1.name(); // "ATIVO"

// Converter de volta
Status s2 = Status.valueOf(nome);
System.out.println(s1 == s2); // true (mesma instância)
```

### 6. Comparação de Strings

```java
Status s = Status.ATIVO;

if (s.name().equals("ATIVO")) {
    System.out.println("É ATIVO");
}

// ⚠️ Melhor comparar diretamente
if (s == Status.ATIVO) { // ✅ Mais eficiente
    System.out.println("É ATIVO");
}
```

### 7. Switch com String

```java
Status s = Status.ATIVO;
String nome = s.name();

switch (nome) {
    case "ATIVO":
        System.out.println("Ativo");
        break;
    case "INATIVO":
        System.out.println("Inativo");
        break;
}
```

### 8. Logging

```java
Status s = Status.ATIVO;
logger.info("Status alterado para: " + s.name());
// Log: "Status alterado para: ATIVO"
```

### 9. Serialização

```java
// Enum serializado por name()
Status s = Status.ATIVO;

// JSON
String json = "{\"status\":\"" + s.name() + "\"}";
// {"status":"ATIVO"}

// Deserialização
String nomeJson = "ATIVO"; // Extraído do JSON
Status deserializado = Status.valueOf(nomeJson);
```

### 10. Lista de Nomes

```java
List<String> nomes = Arrays.stream(Status.values())
    .map(Status::name)
    .collect(Collectors.toList());

System.out.println(nomes); // ["ATIVO", "INATIVO", "PENDENTE"]
```

---

## Aplicabilidade

**name()** para:
- Obter nome exato da constante
- Serialização (JSON, XML)
- Logging e debugging
- Conversão para valueOf()

---

## Armadilhas

### 1. Comparar String em vez de Enum

```java
Status s = Status.ATIVO;

// ⚠️ Menos eficiente
if (s.name().equals("ATIVO")) { }

// ✅ Mais eficiente
if (s == Status.ATIVO) { }
```

### 2. name() é Final

```java
// ❌ Não pode sobrescrever name()
public enum Status {
    ATIVO;
    
    // @Override
    // public String name() { } // ERRO
}

// ✅ Sobrescrever toString() se quiser customizar
public enum Status {
    ATIVO;
    
    @Override
    public String toString() {
        return "Status: " + name();
    }
}
```

### 3. Case-Sensitive

```java
Status s = Status.ATIVO;

System.out.println(s.name()); // "ATIVO" (não "ativo")

// Comparação case-insensitive
if (s.name().equalsIgnoreCase("ativo")) { // ✅
    System.out.println("Match");
}
```

---

## Boas Práticas

### 1. Preferir Comparação Direta

```java
// ✅ Comparar enum diretamente
if (status == Status.ATIVO) { }

// ⚠️ Comparar name() (menos eficiente)
if (status.name().equals("ATIVO")) { }
```

### 2. toString() para Formatação

```java
public enum Status {
    ATIVO, INATIVO;
    
    // ✅ toString() para formato customizado
    @Override
    public String toString() {
        return name().toLowerCase(); // "ativo"
    }
}

Status s = Status.ATIVO;
System.out.println(s.name());     // "ATIVO"
System.out.println(s.toString()); // "ativo"
```

### 3. name() para Serialização

```java
// ✅ name() para JSON/XML
public String toJson() {
    return "{\"status\":\"" + status.name() + "\"}";
}

// Deserialização
public static Status fromJson(String json) {
    String nome = extractName(json); // Extrair "ATIVO"
    return Status.valueOf(nome);
}
```

### 4. Logging com name()

```java
// ✅ name() em logs
logger.info("Processando status: {}", status.name());
logger.debug("Status atual: {}", status.name());
```

---

## Resumo

**name()**:

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

Status s = Status.ATIVO;
String nome = s.name();
System.out.println(nome); // "ATIVO"
```

**Características**:
- Retorna nome **exato** da constante
- **Final** (não pode sobrescrever)
- **Imutável** (sempre mesmo valor)
- **Case-sensitive** (como declarado)
- Usado para **valueOf()** (String → Enum)

**name() vs toString()**:

| Método | Pode Sobrescrever | Uso |
|--------|-------------------|-----|
| **name()** | ❌ Final | Nome exato (serialização) |
| **toString()** | ✅ Sim | Formato customizado (UI) |

**Exemplos**:

```java
// name() = exato
Status s = Status.ATIVO;
System.out.println(s.name()); // "ATIVO"

// toString() = pode customizar
public enum Status {
    ATIVO, INATIVO;
    
    @Override
    public String toString() {
        return name().toLowerCase(); // "ativo"
    }
}

// Conversão
String nome = s.name();           // Enum → String
Status s2 = Status.valueOf(nome); // String → Enum
```

**Uso comum**:

```java
// Serialização
String json = "{\"status\":\"" + s.name() + "\"}";

// Logging
logger.info("Status: " + s.name());

// Lista de nomes
List<String> nomes = Arrays.stream(Status.values())
    .map(Status::name)
    .collect(Collectors.toList());
```

**Regra de Ouro**: `name()` retorna nome **exato** da constante (String). **Final** (não pode sobrescrever). Use para **serialização**, **logging** e conversão com `valueOf()`. Para formatação customizada, sobrescreva `toString()`. Prefira comparar enum diretamente (`s == Status.ATIVO`) em vez de comparar `name()`.
