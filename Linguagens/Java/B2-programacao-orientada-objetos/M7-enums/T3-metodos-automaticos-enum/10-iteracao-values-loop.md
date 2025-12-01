# T3.10 - Iteração com values() em Loop

## Introdução

**Iteração**: usar `values()` para percorrer todas as constantes.

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// Enhanced for
for (Status s : Status.values()) {
    System.out.println(s);
}
```

**values()**: retorna array com todas as constantes.

---

## Fundamentos

### 1. Enhanced For Loop

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

for (Cor cor : Cor.values()) {
    System.out.println(cor);
}
// VERMELHO
// VERDE
// AZUL
```

### 2. For Tradicional

```java
Status[] valores = Status.values();

for (int i = 0; i < valores.length; i++) {
    System.out.println(valores[i]);
}
```

### 3. For com Índice

```java
for (int i = 0; i < Status.values().length; i++) {
    Status s = Status.values()[i];
    System.out.println(i + ": " + s);
}
// 0: ATIVO
// 1: INATIVO
// 2: PENDENTE
```

### 4. Stream

```java
Arrays.stream(Status.values())
    .forEach(System.out::println);
```

### 5. Stream com Filtro

```java
Arrays.stream(Status.values())
    .filter(s -> s != Status.INATIVO)
    .forEach(System.out::println);
// ATIVO
// PENDENTE
```

### 6. Stream com Map

```java
List<String> nomes = Arrays.stream(Status.values())
    .map(Status::name)
    .collect(Collectors.toList());

System.out.println(nomes); // ["ATIVO", "INATIVO", "PENDENTE"]
```

### 7. Iterar com name() e ordinal()

```java
for (Status s : Status.values()) {
    System.out.println(s.ordinal() + ": " + s.name());
}
// 0: ATIVO
// 1: INATIVO
// 2: PENDENTE
```

### 8. EnumSet Iteração

```java
Set<Status> set = EnumSet.allOf(Status.class);

for (Status s : set) {
    System.out.println(s);
}
```

### 9. While Loop

```java
Status[] valores = Status.values();
int i = 0;

while (i < valores.length) {
    System.out.println(valores[i]);
    i++;
}
```

### 10. forEach (Java 8+)

```java
Arrays.asList(Status.values()).forEach(s -> {
    System.out.println(s);
});
```

---

## Aplicabilidade

**Iteração com values()** para:
- Processar todas as constantes
- Validar entrada do usuário
- Criar menus/listas
- Preencher ComboBox/Select

---

## Armadilhas

### 1. Chamar values() Múltiplas Vezes

```java
// ❌ Ineficiente: cria array em cada iteração
for (int i = 0; i < Status.values().length; i++) {
    System.out.println(Status.values()[i]); // 2x values() por iteração
}

// ✅ Cache uma vez
Status[] valores = Status.values();
for (int i = 0; i < valores.length; i++) {
    System.out.println(valores[i]);
}
```

### 2. Modificar Array

```java
Status[] valores = Status.values();
valores[0] = null; // Modifica clone

// values() retorna clone (não afeta próximas chamadas)
Status[] novos = Status.values();
System.out.println(novos[0]); // ATIVO (original intacto)
```

### 3. ConcurrentModificationException

```java
// ✅ Enum não pode ser modificado (não há CME)
for (Status s : Status.values()) {
    // Não pode adicionar/remover constantes em runtime
}
```

---

## Boas Práticas

### 1. Enhanced For

```java
// ✅ Mais simples e legível
for (Status s : Status.values()) {
    System.out.println(s);
}
```

### 2. Cache values()

```java
// ✅ Cache para performance
private static final Status[] VALUES = Status.values();

for (Status s : VALUES) {
    System.out.println(s);
}
```

### 3. Stream para Operações

```java
// ✅ Stream para filtro/map/reduce
long count = Arrays.stream(Status.values())
    .filter(s -> s != Status.INATIVO)
    .count();
```

### 4. EnumSet em vez de Array

```java
// ✅ EnumSet (mais eficiente)
Set<Status> set = EnumSet.allOf(Status.class);

for (Status s : set) {
    System.out.println(s);
}

// ⚠️ values() + loop (menos eficiente)
for (Status s : Status.values()) {
    System.out.println(s);
}
```

---

## Resumo

**Iteração com values()**:

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// Enhanced for (preferível)
for (Status s : Status.values()) {
    System.out.println(s);
}

// For tradicional
Status[] valores = Status.values();
for (int i = 0; i < valores.length; i++) {
    System.out.println(valores[i]);
}

// Stream
Arrays.stream(Status.values())
    .forEach(System.out::println);
```

**Formas de iteração**:

```java
// 1. Enhanced for
for (Status s : Status.values()) { }

// 2. For tradicional
for (int i = 0; i < Status.values().length; i++) { }

// 3. Stream
Arrays.stream(Status.values()).forEach(s -> { });

// 4. EnumSet
EnumSet.allOf(Status.class).forEach(s -> { });

// 5. While
int i = 0;
while (i < Status.values().length) { }
```

**Exemplos práticos**:

```java
// Validar entrada
public static boolean isValid(String nome) {
    for (Status s : Status.values()) {
        if (s.name().equals(nome)) {
            return true;
        }
    }
    return false;
}

// Criar lista de nomes
List<String> nomes = Arrays.stream(Status.values())
    .map(Status::name)
    .collect(Collectors.toList());

// Filtrar constantes
List<Status> ativos = Arrays.stream(Status.values())
    .filter(s -> s != Status.INATIVO)
    .collect(Collectors.toList());

// ComboBox (UI)
for (Status s : Status.values()) {
    comboBox.addItem(s);
}
```

**Performance**:

```java
// ❌ Evitar: múltiplas chamadas
for (int i = 0; i < Status.values().length; i++) {
    System.out.println(Status.values()[i]); // 2x values()
}

// ✅ Cache uma vez
Status[] valores = Status.values();
for (int i = 0; i < valores.length; i++) {
    System.out.println(valores[i]);
}

// ✅ Enhanced for (mais simples)
for (Status s : Status.values()) {
    System.out.println(s);
}
```

**Regra de Ouro**: Use `for (Enum e : Enum.values())` para iterar todas as constantes. Enhanced for é mais **simples** e **legível**. Cache `values()` se chamar múltiplas vezes. Stream para operações de **filtro/map/reduce**. EnumSet para conjuntos. values() retorna **clone** (modificar não afeta original).
