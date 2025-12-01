# T3.06 - compareTo(): Comparação por Ordinal

## Introdução

**compareTo()**: compara enums baseado em ordinal (posição).

```java
public enum Status {
    ATIVO,    // ordinal 0
    INATIVO,  // ordinal 1
    PENDENTE  // ordinal 2
}

Status s1 = Status.ATIVO;   // ordinal 0
Status s2 = Status.PENDENTE; // ordinal 2

int resultado = s1.compareTo(s2);
System.out.println(resultado); // -2 (0 - 2)
```

**Retorno**: negativo, zero ou positivo.

---

## Fundamentos

### 1. Comparação Básica

```java
public enum Prioridade {
    BAIXA,  // 0
    MEDIA,  // 1
    ALTA    // 2
}

Prioridade p1 = Prioridade.BAIXA;
Prioridade p2 = Prioridade.ALTA;

int resultado = p1.compareTo(p2);
System.out.println(resultado); // -2 (BAIXA < ALTA)
```

### 2. Regra de Retorno

```java
Status s1 = Status.ATIVO;   // 0
Status s2 = Status.INATIVO; // 1

// s1 < s2 → negativo
System.out.println(s1.compareTo(s2)); // -1

// s1 > s2 → positivo
System.out.println(s2.compareTo(s1)); // 1

// s1 == s2 → zero
System.out.println(s1.compareTo(s1)); // 0
```

### 3. Baseado em Ordinal

```java
// compareTo() usa ordinal
Status s1 = Status.ATIVO;   // ordinal 0
Status s2 = Status.PENDENTE; // ordinal 2

// s1.compareTo(s2) = s1.ordinal() - s2.ordinal()
// = 0 - 2 = -2
System.out.println(s1.compareTo(s2)); // -2
```

### 4. Ordenação Natural

```java
List<Status> lista = Arrays.asList(
    Status.PENDENTE,
    Status.ATIVO,
    Status.INATIVO
);

Collections.sort(lista);
System.out.println(lista); // [ATIVO, INATIVO, PENDENTE]
```

### 5. Comparação com if

```java
Prioridade p1 = Prioridade.MEDIA;
Prioridade p2 = Prioridade.ALTA;

if (p1.compareTo(p2) < 0) {
    System.out.println("p1 tem prioridade menor");
}
```

### 6. Ordenação Reversa

```java
List<Prioridade> lista = Arrays.asList(
    Prioridade.BAIXA,
    Prioridade.ALTA,
    Prioridade.MEDIA
);

Collections.sort(lista, Collections.reverseOrder());
System.out.println(lista); // [ALTA, MEDIA, BAIXA]
```

### 7. TreeSet com Enum

```java
// TreeSet usa compareTo() para ordenar
Set<Status> set = new TreeSet<>();
set.add(Status.PENDENTE);
set.add(Status.ATIVO);
set.add(Status.INATIVO);

System.out.println(set); // [ATIVO, INATIVO, PENDENTE]
```

### 8. Stream Sorted

```java
List<Status> lista = Arrays.asList(
    Status.PENDENTE,
    Status.ATIVO,
    Status.INATIVO
);

lista.stream()
    .sorted()
    .forEach(System.out::println);
// ATIVO
// INATIVO
// PENDENTE
```

### 9. Min/Max

```java
List<Prioridade> lista = Arrays.asList(
    Prioridade.MEDIA,
    Prioridade.ALTA,
    Prioridade.BAIXA
);

Prioridade min = Collections.min(lista);
Prioridade max = Collections.max(lista);

System.out.println(min); // BAIXA (menor ordinal)
System.out.println(max); // ALTA (maior ordinal)
```

### 10. Comparable<E>

```java
// Enum implementa Comparable<E>
public enum Status implements Comparable<Status> {
    ATIVO, INATIVO;
    
    // compareTo() já implementado pela classe Enum
}
```

---

## Aplicabilidade

**compareTo()** para:
- Ordenar enums por posição
- Comparar prioridades
- TreeSet/TreeMap
- Sorting em listas

---

## Armadilhas

### 1. Dependência de Ordinal

```java
// ⚠️ compareTo() usa ordinal (frágil se ordem mudar)
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

// Se reordenar para: PENDENTE, ATIVO, INATIVO
// compareTo() muda comportamento

// ✅ Se ordem importa, use atributo customizado
public enum Prioridade {
    BAIXA(1), MEDIA(2), ALTA(3);
    
    private final int nivel;
    
    Prioridade(int nivel) {
        this.nivel = nivel;
    }
    
    public int comparar(Prioridade outra) {
        return Integer.compare(this.nivel, outra.nivel);
    }
}
```

### 2. Comparar com Null

```java
Status s1 = Status.ATIVO;
Status s2 = null;

// ❌ NullPointerException
// int resultado = s1.compareTo(s2);

// ✅ Verificar null
if (s2 != null) {
    int resultado = s1.compareTo(s2);
}
```

### 3. Comparar Enums Diferentes

```java
public enum Status { ATIVO, INATIVO }
public enum Estado { ATIVO, INATIVO }

Status s = Status.ATIVO;
Estado e = Estado.ATIVO;

// ❌ ERRO: incompatible types
// int resultado = s.compareTo(e);
```

---

## Boas Práticas

### 1. Usar == para Igualdade

```java
// ✅ == para igualdade
if (status == Status.ATIVO) { }

// ⚠️ compareTo() == 0 (desnecessário)
if (status.compareTo(Status.ATIVO) == 0) { }
```

### 2. compareTo() para Ordenação

```java
// ✅ compareTo() para ordenar
List<Status> lista = Arrays.asList(
    Status.PENDENTE,
    Status.ATIVO
);

Collections.sort(lista); // Usa compareTo()
```

### 3. Ordem Customizada

```java
// ✅ Comparator para ordem customizada
public enum Prioridade {
    BAIXA, MEDIA, ALTA;
    
    // Comparator reverso
    public static final Comparator<Prioridade> REVERSE = 
        Comparator.reverseOrder();
}

List<Prioridade> lista = Arrays.asList(
    Prioridade.BAIXA,
    Prioridade.ALTA
);

Collections.sort(lista, Prioridade.REVERSE);
```

### 4. EnumSet para Conjuntos Ordenados

```java
// ✅ EnumSet mantém ordem de declaração
Set<Status> set = EnumSet.of(
    Status.PENDENTE,
    Status.ATIVO,
    Status.INATIVO
);

System.out.println(set); // [ATIVO, INATIVO, PENDENTE] (ordem de declaração)
```

---

## Resumo

**compareTo()**:

```java
public enum Status {
    ATIVO,    // 0
    INATIVO,  // 1
    PENDENTE  // 2
}

Status s1 = Status.ATIVO;   // 0
Status s2 = Status.PENDENTE; // 2

int resultado = s1.compareTo(s2);
// resultado = s1.ordinal() - s2.ordinal()
// = 0 - 2 = -2
```

**Retorno**:
- **< 0**: this < outro (vem antes)
- **== 0**: this == outro (mesma posição)
- **> 0**: this > outro (vem depois)

**Ordenação**:

```java
List<Status> lista = Arrays.asList(
    Status.PENDENTE,
    Status.ATIVO,
    Status.INATIVO
);

Collections.sort(lista); // Usa compareTo()
System.out.println(lista); // [ATIVO, INATIVO, PENDENTE]
```

**Baseado em ordinal**:

```java
// compareTo() = diferença de ordinais
Status.ATIVO.compareTo(Status.INATIVO)
// = 0 - 1 = -1

Status.PENDENTE.compareTo(Status.ATIVO)
// = 2 - 0 = 2
```

**Uso comum**:

```java
// Ordenação
Collections.sort(lista);
lista.stream().sorted();

// TreeSet/TreeMap
Set<Status> set = new TreeSet<>();

// Min/Max
Collections.min(lista);
Collections.max(lista);

// Comparação
if (p1.compareTo(p2) < 0) {
    // p1 vem antes
}
```

**Regra de Ouro**: `compareTo()` compara enums por **ordinal** (posição). Retorna negativo (menor), zero (igual) ou positivo (maior). Usado para **ordenação** (sort, TreeSet). Frágil se ordem de declaração mudar. Use `==` para igualdade, `compareTo()` para ordenação. Implementa `Comparable<E>`.
