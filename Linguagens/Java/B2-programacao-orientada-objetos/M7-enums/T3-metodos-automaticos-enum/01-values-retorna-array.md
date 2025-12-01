# T3.01 - values(): Retorna Array de Todas as Constantes

## Introdução

**values()**: método gerado automaticamente que retorna array com todas as constantes.

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

Status[] valores = Status.values();
// [ATIVO, INATIVO, PENDENTE]
```

**Array**: ordem de declaração preservada.

---

## Fundamentos

### 1. Método Básico

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

Cor[] cores = Cor.values();
System.out.println(cores.length); // 3
```

### 2. Ordem de Declaração

```java
public enum DiaSemana {
    SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
}

DiaSemana[] dias = DiaSemana.values();
System.out.println(dias[0]); // SEGUNDA
System.out.println(dias[6]); // DOMINGO
```

### 3. Clone do Array

```java
// values() retorna CLONE (não array original)
Status[] arr1 = Status.values();
Status[] arr2 = Status.values();

System.out.println(arr1 == arr2); // false (arrays diferentes)
System.out.println(arr1[0] == arr2[0]); // true (mesma constante)
```

### 4. Modificar Array Não Afeta Original

```java
Status[] valores = Status.values();
valores[0] = null; // Modifica clone

Status[] novos = Status.values();
System.out.println(novos[0]); // ATIVO (original intacto)
```

### 5. Iteração com For

```java
for (int i = 0; i < Status.values().length; i++) {
    System.out.println(Status.values()[i]);
}

// ⚠️ Cria array a cada iteração (ineficiente)

// ✅ Melhor: armazenar em variável
Status[] valores = Status.values();
for (int i = 0; i < valores.length; i++) {
    System.out.println(valores[i]);
}
```

### 6. Enhanced For

```java
for (Status s : Status.values()) {
    System.out.println(s);
}
```

### 7. Streams

```java
import java.util.Arrays;

Arrays.stream(Status.values())
    .filter(s -> s != Status.INATIVO)
    .forEach(System.out::println);
```

### 8. Buscar por Nome

```java
Status encontrar(String nome) {
    for (Status s : Status.values()) {
        if (s.name().equals(nome)) {
            return s;
        }
    }
    return null;
}

Status s = encontrar("ATIVO"); // ATIVO
```

### 9. Contar Constantes

```java
int total = Status.values().length;
System.out.println("Total: " + total); // 3
```

### 10. Converter para List

```java
import java.util.Arrays;
import java.util.List;

List<Status> lista = Arrays.asList(Status.values());
System.out.println(lista); // [ATIVO, INATIVO, PENDENTE]
```

---

## Aplicabilidade

**values()** para:
- Iterar todas as constantes
- Contar total de valores
- Buscar constantes
- Validar entrada
- Criar coleções

---

## Armadilhas

### 1. Performance (Criar Array Múltiplas Vezes)

```java
// ❌ Cria array em cada iteração
for (int i = 0; i < Status.values().length; i++) {
    System.out.println(Status.values()[i]); // Chama values() 2x por iteração
}

// ✅ Armazenar uma vez
Status[] valores = Status.values();
for (int i = 0; i < valores.length; i++) {
    System.out.println(valores[i]);
}
```

### 2. Modificar Array

```java
Status[] valores = Status.values();
valores[0] = null; // ✅ Modifica clone (não array original)

// Não afeta próximas chamadas
Status[] novos = Status.values();
System.out.println(novos[0]); // ATIVO
```

### 3. Null no Array

```java
// ❌ Array de values() nunca contém null
Status[] valores = Status.values();
// Nenhum elemento é null (apenas constantes válidas)
```

---

## Boas Práticas

### 1. Cache para Performance

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE;
    
    // ✅ Cache estático
    private static final Status[] VALUES = values();
    
    public static Status[] getValues() {
        return VALUES.clone(); // Retorna clone para segurança
    }
}

// Uso
for (Status s : Status.getValues()) {
    System.out.println(s);
}
```

### 2. Enhanced For para Iteração

```java
// ✅ Mais simples e legível
for (Status s : Status.values()) {
    System.out.println(s);
}

// ⚠️ For tradicional (mais verboso)
Status[] valores = Status.values();
for (int i = 0; i < valores.length; i++) {
    System.out.println(valores[i]);
}
```

### 3. Stream para Operações

```java
// ✅ Stream para filtros/mapeamentos
long count = Arrays.stream(Status.values())
    .filter(s -> s != Status.INATIVO)
    .count();
```

### 4. EnumSet em vez de Arrays

```java
// ✅ EnumSet (mais eficiente)
Set<Status> set = EnumSet.allOf(Status.class);

// ⚠️ Array para Set (conversão desnecessária)
Set<Status> set = new HashSet<>(Arrays.asList(Status.values()));
```

---

## Resumo

**values()**:

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// Retorna array
Status[] valores = Status.values();
// [ATIVO, INATIVO, PENDENTE]

// Tamanho
System.out.println(valores.length); // 3

// Acesso por índice
System.out.println(valores[0]); // ATIVO
```

**Características**:
- Retorna **clone** do array (não original)
- Ordem de **declaração** preservada
- Nunca contém **null**
- Modificar clone não afeta original
- **Gerado automaticamente** pelo compilador

**Iteração**:

```java
// Enhanced for
for (Status s : Status.values()) {
    System.out.println(s);
}

// Stream
Arrays.stream(Status.values())
    .forEach(System.out::println);

// For tradicional
Status[] valores = Status.values();
for (int i = 0; i < valores.length; i++) {
    System.out.println(valores[i]);
}
```

**Performance**:

```java
// ❌ Evitar: múltiplas chamadas
for (int i = 0; i < Status.values().length; i++) {
    System.out.println(Status.values()[i]); // 2x values() por iteração
}

// ✅ Cache uma vez
Status[] valores = Status.values();
for (Status s : valores) {
    System.out.println(s);
}
```

**Regra de Ouro**: `values()` retorna **clone** do array com todas as constantes em ordem de declaração. Use para **iterar**, **contar** ou **buscar** constantes. Cache resultado se chamar múltiplas vezes. Enhanced for é mais simples (`for (Status s : Status.values())`). Modificar array não afeta original.
