# T2.05 - Variáveis do Tipo Enum

## Introdução

**Variável enum**: armazena referência para constante.

```java
public enum Status {
    ATIVO, INATIVO
}

Status status = Status.ATIVO; // Variável do tipo Status
```

**Tipo**: nome do enum (como classe).

---

## Fundamentos

### 1. Declaração Básica

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

Cor cor = Cor.VERMELHO; // Variável do tipo Cor
```

### 2. Variável Local

```java
public void processar() {
    Status status = Status.ATIVO; // Local
    System.out.println(status);
}
```

### 3. Atributo de Instância

```java
public class Pedido {
    private Status status; // Atributo
    
    public Pedido() {
        this.status = Status.PENDENTE;
    }
}
```

### 4. Atributo Estático

```java
public class Config {
    public static Status STATUS_PADRAO = Status.ATIVO; // Static
}
```

### 5. Variável Null

```java
Status status = null; // ✅ Válido (mas cuidado)

if (status == null) {
    System.out.println("Status não definido");
}
```

### 6. Inicialização

```java
// ✅ Inicializada
Status status = Status.ATIVO;

// ✅ Não inicializada (null por padrão em atributos)
public class Pedido {
    private Status status; // null
}

// ⚠️ Local não inicializada = ERRO
public void processar() {
    Status status; // Não inicializada
    // System.out.println(status); // ERRO: variable might not have been initialized
}
```

### 7. Reatribuição

```java
Status status = Status.ATIVO;
System.out.println(status); // ATIVO

status = Status.INATIVO; // Reatribuição
System.out.println(status); // INATIVO
```

### 8. Variável final

```java
// ✅ final = não pode reatribuir
public class Pedido {
    private final Status status;
    
    public Pedido(Status status) {
        this.status = status; // Inicializa no construtor
    }
}

Pedido p = new Pedido(Status.ATIVO);
// p.status = Status.INATIVO; // ERRO: cannot assign
```

### 9. Variável em Coleções

```java
List<Status> statusList = new ArrayList<>();
statusList.add(Status.ATIVO);
statusList.add(Status.INATIVO);

for (Status s : statusList) {
    System.out.println(s);
}
```

### 10. Variável em Lambda

```java
Status status = Status.ATIVO;

// ✅ Variável efetivamente final
Runnable r = () -> System.out.println(status);

// ❌ Não pode modificar dentro do lambda
// Runnable r2 = () -> status = Status.INATIVO; // ERRO
```

---

## Aplicabilidade

**Variável enum**:
- Armazena estado de objetos
- Parâmetros de métodos
- Retorno de métodos
- Atributos de classe
- Coleções type-safe

---

## Armadilhas

### 1. NullPointerException

```java
Status status = null;

// ❌ NPE
// System.out.println(status.name()); // NullPointerException

// ✅ Verificar null
if (status != null) {
    System.out.println(status.name());
}
```

### 2. Comparação com String

```java
Status status = Status.ATIVO;

// ❌ ERRO: incompatible types
// if (status == "ATIVO") { }

// ✅ Comparar com constante
if (status == Status.ATIVO) { }
```

### 3. Variável Local Não Inicializada

```java
public void processar() {
    Status status; // Não inicializada
    
    // ❌ ERRO: variable might not have been initialized
    // System.out.println(status);
    
    status = Status.ATIVO; // ✅ Inicializar antes de usar
    System.out.println(status);
}
```

---

## Boas Práticas

### 1. Inicializar Variáveis

```java
// ✅ Inicializar
Status status = Status.ATIVO;

// ✅ Ou verificar null
Status status = obterStatus();
if (status != null) {
    // usar status
}
```

### 2. Usar final para Imutabilidade

```java
// ✅ final para valores que não mudam
public class Pedido {
    private final Status statusInicial = Status.PENDENTE;
}
```

### 3. Null-Safe

```java
// ✅ Validar null
public void processar(Status status) {
    Objects.requireNonNull(status, "Status não pode ser null");
    // ...
}
```

### 4. Valor Padrão

```java
// ✅ Valor padrão se null
Status status = obterStatus();
if (status == null) {
    status = Status.ATIVO; // Padrão
}
```

---

## Resumo

**Variável enum**:

```java
public enum Status {
    ATIVO, INATIVO
}

// Declaração
Status status = Status.ATIVO;

// Reatribuição
status = Status.INATIVO;

// Null
Status s = null; // ✅ Válido
```

**Tipos de variáveis**:

```java
// Local
void metodo() {
    Status status = Status.ATIVO;
}

// Atributo de instância
class Pedido {
    private Status status;
}

// Atributo estático
class Config {
    public static Status PADRAO = Status.ATIVO;
}

// Parâmetro
void processar(Status status) { }

// Retorno
Status obter() {
    return Status.ATIVO;
}
```

**Características**:
- Tipo = nome do enum
- Pode ser **null** (validar antes de usar)
- **final** = não pode reatribuir
- Atributos = null por padrão
- Locais devem ser inicializadas antes de usar
- Coleções type-safe (`List<Status>`)

**Comparação**:

```java
Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

s1 == s2           // true (mesma instância)
s1.equals(s2)      // true
s1 == Status.ATIVO // true
```

**Regra de Ouro**: Declare variáveis como `NomeEnum variavel = Enum.CONSTANTE`. Variável armazena **referência** para constante (singleton). Pode ser **null** (validar antes de usar). **final** para imutabilidade. Comparação com `==` (mais rápido que `equals()`). Atributos = **null** por padrão, locais devem ser inicializadas.
