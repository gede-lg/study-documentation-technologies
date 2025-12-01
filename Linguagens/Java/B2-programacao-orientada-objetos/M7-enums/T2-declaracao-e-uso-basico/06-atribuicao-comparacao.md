# T2.06 - Atribuição e Comparação

## Introdução

**Atribuição**: armazenar constante em variável.
**Comparação**: usar `==` ou `equals()`.

```java
public enum Status {
    ATIVO, INATIVO
}

// Atribuição
Status s = Status.ATIVO;

// Comparação
if (s == Status.ATIVO) { // ✅ Usa ==
    System.out.println("Ativo");
}
```

**==**: preferível para enums (mais rápido).

---

## Fundamentos

### 1. Atribuição Básica

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

Cor cor = Cor.VERMELHO; // Atribuição
```

### 2. Reatribuição

```java
Status status = Status.ATIVO;
System.out.println(status); // ATIVO

status = Status.INATIVO; // Reatribuição
System.out.println(status); // INATIVO
```

### 3. Comparação com ==

```java
Status s = Status.ATIVO;

if (s == Status.ATIVO) { // ✅ ==
    System.out.println("Ativo");
}
```

### 4. Comparação com equals()

```java
Status s = Status.ATIVO;

if (s.equals(Status.ATIVO)) { // ✅ Funciona, mas desnecessário
    System.out.println("Ativo");
}
```

### 5. == vs equals()

```java
Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

// ✅ == (mais rápido)
System.out.println(s1 == s2); // true

// ✅ equals() (funciona, mas overhead)
System.out.println(s1.equals(s2)); // true
```

### 6. Comparação com !=

```java
Status s = Status.INATIVO;

if (s != Status.ATIVO) { // ✅ !=
    System.out.println("Não está ativo");
}
```

### 7. Null Safety

```java
Status s = null;

// ⚠️ == não lança exceção
if (s == Status.ATIVO) { // false
    // ...
}

// ❌ equals() lança NPE
// if (s.equals(Status.ATIVO)) { } // NullPointerException

// ✅ equals() com ordem invertida
if (Status.ATIVO.equals(s)) { // false (sem NPE)
    // ...
}
```

### 8. Atribuição de valueOf()

```java
// Converter String para enum
Status s = Status.valueOf("ATIVO");
System.out.println(s); // ATIVO

// ❌ IllegalArgumentException se inválido
// Status s2 = Status.valueOf("INVALIDO");
```

### 9. Atribuição de Método

```java
public Status obterStatus() {
    return Status.ATIVO;
}

Status s = obterStatus(); // Atribuição do retorno
```

### 10. Operador Ternário

```java
boolean ativo = true;

Status s = ativo ? Status.ATIVO : Status.INATIVO;
System.out.println(s); // ATIVO
```

---

## Aplicabilidade

**Atribuição**:
- Armazenar constante em variável
- Retorno de métodos
- Conversão de String (valueOf)

**Comparação**:
- Validar estado
- Lógica condicional
- Switch statements

---

## Armadilhas

### 1. NullPointerException com equals()

```java
Status s = null;

// ❌ NPE
// if (s.equals(Status.ATIVO)) { }

// ✅ Inverter ordem
if (Status.ATIVO.equals(s)) { } // false (sem NPE)

// ✅ Ou usar ==
if (s == Status.ATIVO) { } // false
```

### 2. Comparar com String

```java
Status s = Status.ATIVO;

// ❌ ERRO: incompatible types
// if (s == "ATIVO") { }

// ✅ Comparar com constante
if (s == Status.ATIVO) { }
```

### 3. valueOf() com Nome Inválido

```java
// ❌ IllegalArgumentException
try {
    Status s = Status.valueOf("INVALIDO");
} catch (IllegalArgumentException e) {
    System.out.println("Valor inválido");
}
```

---

## Boas Práticas

### 1. Preferir ==

```java
// ✅ == (mais rápido e simples)
if (status == Status.ATIVO) { }

// ⚠️ equals() funciona mas desnecessário
if (status.equals(Status.ATIVO)) { }
```

### 2. Null-Safe com ==

```java
Status s = obterStatus();

// ✅ == é null-safe (retorna false)
if (s == Status.ATIVO) {
    // ...
}
```

### 3. Switch para Múltiplas Comparações

```java
// ✅ Switch para múltiplos valores
switch (status) {
    case ATIVO -> processar();
    case INATIVO -> pausar();
    case PENDENTE -> aguardar();
}

// ⚠️ Múltiplos if menos elegante
if (status == Status.ATIVO) {
    processar();
} else if (status == Status.INATIVO) {
    pausar();
}
```

### 4. Validar valueOf()

```java
// ✅ Try-catch para valueOf()
try {
    Status s = Status.valueOf(input);
} catch (IllegalArgumentException e) {
    // Valor inválido
    s = Status.ATIVO; // Padrão
}
```

---

## Resumo

**Atribuição**:

```java
// Básica
Status s = Status.ATIVO;

// Reatribuição
s = Status.INATIVO;

// De método
Status s = obterStatus();

// De valueOf()
Status s = Status.valueOf("ATIVO");

// Ternário
Status s = ativo ? Status.ATIVO : Status.INATIVO;
```

**Comparação**:

```java
Status s = Status.ATIVO;

// ✅ == (preferível)
if (s == Status.ATIVO) { }

// ✅ equals() (funciona)
if (s.equals(Status.ATIVO)) { }

// ✅ !=
if (s != Status.INATIVO) { }
```

**== vs equals()**:

| Aspecto | == | equals() |
|---------|-----|----------|
| Performance | ✅ Mais rápido | ⚠️ Mais lento |
| Simplicidade | ✅ Simples | ⚠️ Verboso |
| Null | ✅ false | ❌ NPE |
| Recomendado | ✅ Sim | ⚠️ Desnecessário |

**Null safety**:

```java
Status s = null;

s == Status.ATIVO           // false (sem NPE)
Status.ATIVO.equals(s)      // false (sem NPE)
s.equals(Status.ATIVO)      // NPE!
```

**valueOf()**:

```java
// ✅ String válida
Status s = Status.valueOf("ATIVO");

// ❌ IllegalArgumentException
// Status s = Status.valueOf("INVALIDO");
```

**Regra de Ouro**: Use `==` para comparar enums (mais rápido e null-safe). `equals()` funciona mas é desnecessário (overhead de chamada). Atribuição: `Status s = Status.ATIVO`. valueOf() converte String mas lança **IllegalArgumentException** se inválido. Null com `==` retorna **false**, com `equals()` lança **NPE**.
