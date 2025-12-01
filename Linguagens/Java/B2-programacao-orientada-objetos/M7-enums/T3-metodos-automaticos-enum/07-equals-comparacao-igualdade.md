# T3.07 - equals(): Comparação de Igualdade

## Introdução

**equals()**: compara se duas referências apontam para mesma constante.

```java
public enum Status {
    ATIVO, INATIVO
}

Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

System.out.println(s1.equals(s2)); // true
System.out.println(s1 == s2);      // true (preferível)
```

**Singleton**: cada constante é única, então `==` funciona.

---

## Fundamentos

### 1. Comparação Básica

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

Cor c1 = Cor.VERMELHO;
Cor c2 = Cor.VERMELHO;

System.out.println(c1.equals(c2)); // true
System.out.println(c1 == c2);      // true
```

### 2. equals() vs ==

```java
Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

// equals() funciona
System.out.println(s1.equals(s2)); // true

// == é preferível (mais rápido)
System.out.println(s1 == s2); // true
```

### 3. Constantes Diferentes

```java
Status s1 = Status.ATIVO;
Status s2 = Status.INATIVO;

System.out.println(s1.equals(s2)); // false
System.out.println(s1 == s2);      // false
```

### 4. Null Safety

```java
Status s1 = Status.ATIVO;
Status s2 = null;

// equals() null-safe (retorna false)
System.out.println(s1.equals(s2)); // false

// ❌ == lança NPE se s1 for null
// System.out.println(s1 == s2); // false (s1 não é null)

Status s3 = null;
// System.out.println(s3.equals(s1)); // NPE!
```

### 5. equals() é Final

```java
// ❌ ERRO: cannot override final method
public enum Status {
    ATIVO;
    
    // @Override
    // public boolean equals(Object obj) {
    //     return true;
    // }
}
```

### 6. Tipo Diferente

```java
public enum Status { ATIVO }
public enum Estado { ATIVO }

Status s = Status.ATIVO;
Estado e = Estado.ATIVO;

System.out.println(s.equals(e)); // false (tipos diferentes)
```

### 7. Contrato equals() e hashCode()

```java
Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

// equals() → hashCode() deve ser igual
if (s1.equals(s2)) {
    System.out.println(s1.hashCode() == s2.hashCode()); // true
}
```

### 8. equals() em Collections

```java
List<Status> lista = Arrays.asList(Status.ATIVO, Status.INATIVO);

// contains() usa equals()
System.out.println(lista.contains(Status.ATIVO)); // true

// remove() usa equals()
lista.remove(Status.ATIVO);
```

### 9. Set com Enum

```java
Set<Status> set = new HashSet<>();
set.add(Status.ATIVO);
set.add(Status.ATIVO); // Não adiciona (duplicado)

System.out.println(set.size()); // 1
```

### 10. Map com Enum

```java
Map<Status, String> map = new HashMap<>();
map.put(Status.ATIVO, "Ativo");

// get() usa equals()
System.out.println(map.get(Status.ATIVO)); // "Ativo"
```

---

## Aplicabilidade

**equals()** para:
- Comparação em collections
- Contrato com hashCode()
- Null-safety (ordem invertida)

**Preferir ==**:
- Mais rápido
- Mais simples
- Type-safe

---

## Armadilhas

### 1. equals() vs ==

```java
// ⚠️ equals() funciona mas desnecessário
if (status.equals(Status.ATIVO)) { }

// ✅ == é preferível
if (status == Status.ATIVO) { }
```

### 2. NullPointerException

```java
Status s = null;

// ❌ NPE
// if (s.equals(Status.ATIVO)) { }

// ✅ Ordem invertida
if (Status.ATIVO.equals(s)) { } // false

// ✅ Ou usar ==
if (s == Status.ATIVO) { } // false
```

### 3. Enum é Final

```java
// ❌ Não pode sobrescrever equals()
public enum Status {
    ATIVO;
    
    // @Override
    // public boolean equals(Object obj) { } // ERRO
}
```

---

## Boas Práticas

### 1. Preferir ==

```java
// ✅ == (mais rápido e simples)
if (status == Status.ATIVO) { }

// ⚠️ equals() (funciona mas desnecessário)
if (status.equals(Status.ATIVO)) { }
```

### 2. equals() para Null Safety

```java
Status s = obterStatus(); // Pode retornar null

// ✅ equals() com ordem invertida (null-safe)
if (Status.ATIVO.equals(s)) { }

// ⚠️ == precisa verificar null
if (s != null && s == Status.ATIVO) { }
```

### 3. Collections

```java
// ✅ equals() usado internamente
Set<Status> set = new HashSet<>();
set.add(Status.ATIVO);

System.out.println(set.contains(Status.ATIVO)); // true (usa equals())
```

### 4. EnumSet/EnumMap

```java
// ✅ EnumSet/EnumMap (mais eficientes que HashSet/HashMap)
Set<Status> set = EnumSet.of(Status.ATIVO);
Map<Status, String> map = new EnumMap<>(Status.class);
```

---

## Resumo

**equals()**:

```java
public enum Status {
    ATIVO, INATIVO
}

Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

System.out.println(s1.equals(s2)); // true
System.out.println(s1 == s2);      // true (preferível)
```

**equals() vs ==**:

| Aspecto | equals() | == |
|---------|----------|-----|
| Performance | ⚠️ Mais lento | ✅ Mais rápido |
| Simplicidade | ⚠️ Verboso | ✅ Simples |
| Null (this) | ❌ NPE | ✅ false |
| Null (arg) | ✅ false | ✅ false |
| Recomendado | ⚠️ Desnecessário | ✅ Preferível |

**Null safety**:

```java
Status s = null;

// ❌ NPE
// s.equals(Status.ATIVO)

// ✅ Null-safe (ordem invertida)
Status.ATIVO.equals(s) // false

// ✅ ==
s == Status.ATIVO // false
```

**Características**:
- **Final** (não pode sobrescrever)
- Singleton (cada constante única)
- Contrato com **hashCode()**
- Usado em **collections**

**Collections**:

```java
// equals() usado internamente
Set<Status> set = new HashSet<>();
set.add(Status.ATIVO);
set.contains(Status.ATIVO); // true (usa equals())

List<Status> lista = Arrays.asList(Status.ATIVO);
lista.contains(Status.ATIVO); // true (usa equals())

Map<Status, String> map = new HashMap<>();
map.put(Status.ATIVO, "Ativo");
map.get(Status.ATIVO); // "Ativo" (usa equals())
```

**Regra de Ouro**: `equals()` compara igualdade (sempre funciona). Prefira `==` (mais rápido e simples) para comparar enums. Use `equals()` com ordem invertida (`Status.ATIVO.equals(s)`) para null-safety. equals() é **final** (não pode sobrescrever). Cada constante é **singleton** (única), então `==` sempre funciona.
