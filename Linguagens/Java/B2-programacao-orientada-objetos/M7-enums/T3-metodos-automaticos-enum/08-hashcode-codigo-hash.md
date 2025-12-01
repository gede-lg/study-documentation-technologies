# T3.08 - hashCode(): Código Hash

## Introdução

**hashCode()**: retorna código hash da constante.

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

Status s = Status.ATIVO;
System.out.println(s.hashCode()); // Ex: 366712642
```

**Consistente**: mesmo valor sempre para mesma constante.

---

## Fundamentos

### 1. Código Hash Básico

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

Cor c = Cor.VERMELHO;
int hash = c.hashCode();
System.out.println(hash); // Ex: 1163157884
```

### 2. Consistência

```java
Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

// Mesmo hashCode (mesma instância)
System.out.println(s1.hashCode()); // Ex: 366712642
System.out.println(s2.hashCode()); // Ex: 366712642
System.out.println(s1.hashCode() == s2.hashCode()); // true
```

### 3. Constantes Diferentes

```java
Status s1 = Status.ATIVO;
Status s2 = Status.INATIVO;

// hashCode diferente (provavelmente)
System.out.println(s1.hashCode()); // Ex: 366712642
System.out.println(s2.hashCode()); // Ex: 1829164700
```

### 4. hashCode() é Final

```java
// ❌ ERRO: cannot override final method
public enum Status {
    ATIVO;
    
    // @Override
    // public int hashCode() {
    //     return 999;
    // }
}
```

### 5. Contrato equals() e hashCode()

```java
Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

// s1.equals(s2) → hashCode iguais
if (s1.equals(s2)) {
    System.out.println(s1.hashCode() == s2.hashCode()); // true
}
```

### 6. HashMap com Enum

```java
Map<Status, String> map = new HashMap<>();
map.put(Status.ATIVO, "Ativo");

// hashCode() usado internamente
String valor = map.get(Status.ATIVO);
System.out.println(valor); // "Ativo"
```

### 7. HashSet com Enum

```java
Set<Status> set = new HashSet<>();
set.add(Status.ATIVO);
set.add(Status.ATIVO); // Não adiciona (duplicado)

// hashCode() usado para detectar duplicatas
System.out.println(set.size()); // 1
```

### 8. hashCode() Único por Constante

```java
// Cada constante tem hashCode diferente (geralmente)
for (Status s : Status.values()) {
    System.out.println(s.name() + ": " + s.hashCode());
}

// ATIVO: 366712642
// INATIVO: 1829164700
// PENDENTE: 1627674070
```

### 9. Baseado em identityHashCode

```java
Status s = Status.ATIVO;

// hashCode() usa System.identityHashCode()
System.out.println(s.hashCode());
System.out.println(System.identityHashCode(s));
// Valores iguais (singleton)
```

### 10. hashCode() em Debugging

```java
Status s = Status.ATIVO;

logger.debug("Status: {} (hashCode: {})", s.name(), s.hashCode());
// Log: "Status: ATIVO (hashCode: 366712642)"
```

---

## Aplicabilidade

**hashCode()** para:
- HashMap/HashSet internamente
- Contrato com equals()
- Estruturas de dados baseadas em hash
- Debugging (identificar instância)

---

## Armadilhas

### 1. hashCode() é Final

```java
// ❌ Não pode sobrescrever
public enum Status {
    ATIVO;
    
    // @Override
    // public int hashCode() { } // ERRO
}
```

### 2. Confiar em Valor Específico

```java
// ❌ Não dependa de valor específico
if (status.hashCode() == 366712642) { } // Frágil!

// ✅ Comparar constante diretamente
if (status == Status.ATIVO) { }
```

### 3. hashCode() Null

```java
Status s = null;

// ❌ NullPointerException
// int hash = s.hashCode();

// ✅ Verificar null
if (s != null) {
    int hash = s.hashCode();
}
```

---

## Boas Práticas

### 1. Usar EnumMap em vez de HashMap

```java
// ⚠️ HashMap (usa hashCode())
Map<Status, String> map = new HashMap<>();

// ✅ EnumMap (mais eficiente)
Map<Status, String> map = new EnumMap<>(Status.class);
```

### 2. Usar EnumSet em vez de HashSet

```java
// ⚠️ HashSet (usa hashCode())
Set<Status> set = new HashSet<>();

// ✅ EnumSet (mais eficiente)
Set<Status> set = EnumSet.noneOf(Status.class);
```

### 3. hashCode() para Debugging

```java
// ✅ Debugging
logger.debug("Processando {} (hash: {})", 
    status.name(), status.hashCode());
```

### 4. Contrato com equals()

```java
// ✅ Contrato garantido
Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

if (s1.equals(s2)) {
    // hashCode() sempre igual
    assert s1.hashCode() == s2.hashCode();
}
```

---

## Resumo

**hashCode()**:

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

Status s = Status.ATIVO;
int hash = s.hashCode();
System.out.println(hash); // Ex: 366712642
```

**Características**:
- Retorna código hash da constante
- **Final** (não pode sobrescrever)
- **Consistente** (mesmo valor sempre)
- Baseado em **identityHashCode**
- Contrato com **equals()**

**Contrato equals() e hashCode()**:

```java
Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

// Se equals() true → hashCode() iguais
s1.equals(s2)              // true
s1.hashCode() == s2.hashCode() // true
```

**Uso em collections**:

```java
// HashMap usa hashCode()
Map<Status, String> map = new HashMap<>();
map.put(Status.ATIVO, "Ativo");

// HashSet usa hashCode()
Set<Status> set = new HashSet<>();
set.add(Status.ATIVO);

// EnumMap/EnumSet (mais eficientes)
Map<Status, String> enumMap = new EnumMap<>(Status.class);
Set<Status> enumSet = EnumSet.noneOf(Status.class);
```

**Singleton**:

```java
Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

// Mesma instância → mesmo hashCode
System.out.println(s1 == s2);              // true
System.out.println(s1.hashCode() == s2.hashCode()); // true
```

**Performance**:

```java
// ⚠️ HashMap/HashSet (genéricos)
Map<Status, String> map = new HashMap<>();
Set<Status> set = new HashSet<>();

// ✅ EnumMap/EnumSet (otimizados, sem hashCode)
Map<Status, String> map = new EnumMap<>(Status.class);
Set<Status> set = EnumSet.noneOf(Status.class);
```

**Regra de Ouro**: `hashCode()` retorna código hash da constante. **Final** (não pode sobrescrever). **Consistente** (mesmo valor sempre para mesma constante). Usado em HashMap/HashSet. Contrato com `equals()` garantido. Prefira **EnumMap/EnumSet** (mais eficientes que HashMap/HashSet). Não dependa de valor específico do hash.
