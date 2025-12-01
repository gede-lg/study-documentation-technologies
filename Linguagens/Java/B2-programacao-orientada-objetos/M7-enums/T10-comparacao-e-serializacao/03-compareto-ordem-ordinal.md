# T10.03 - compareTo(): Ordem por Ordinal

## Introdução

**`compareTo()`**: compara enums pela ordem de declaração (ordinal).

```java
public enum Prioridade {
    BAIXA,   // ordinal = 0
    MEDIA,   // ordinal = 1
    ALTA     // ordinal = 2
}

Prioridade p1 = Prioridade.BAIXA;
Prioridade p2 = Prioridade.ALTA;

// ✅ compareTo() usa ordinal
int resultado = p1.compareTo(p2); // -2 (0 - 2 = -2)
```

**Enum implementa `Comparable<E>`**: permite ordenação natural.

---

## Fundamentos

### 1. Ordem por Declaração

```java
public enum Nivel {
    BASICO,         // ordinal = 0
    INTERMEDIARIO,  // ordinal = 1
    AVANCADO        // ordinal = 2
}

Nivel n1 = Nivel.BASICO;
Nivel n2 = Nivel.AVANCADO;

// ✅ compareTo() retorna:
// < 0 se this < other
// = 0 se this == other
// > 0 se this > other
System.out.println(n1.compareTo(n2)); // -2 (BASICO < AVANCADO)
System.out.println(n2.compareTo(n1)); //  2 (AVANCADO > BASICO)
System.out.println(n1.compareTo(n1)); //  0 (BASICO == BASICO)
```

### 2. Ordenação em Listas

```java
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

public enum Tamanho {
    PEQUENO, MEDIO, GRANDE
}

List<Tamanho> tamanhos = new ArrayList<>();
tamanhos.add(Tamanho.GRANDE);
tamanhos.add(Tamanho.PEQUENO);
tamanhos.add(Tamanho.MEDIO);

// ✅ Ordenar por ordem natural (ordinal)
Collections.sort(tamanhos);

// ✅ Resultado: [PEQUENO, MEDIO, GRANDE]
for (Tamanho t : tamanhos) {
    System.out.println(t);
}
```

### 3. Implementação de compareTo()

```java
// ✅ Enum.compareTo() implementado como:
// public final int compareTo(E o) {
//     return this.ordinal() - o.ordinal();
// }

public enum Status {
    ATIVO, INATIVO
}

Status s1 = Status.ATIVO;   // ordinal = 0
Status s2 = Status.INATIVO; // ordinal = 1

// ✅ 0 - 1 = -1
System.out.println(s1.compareTo(s2)); // -1
```

### 4. Verificar Maior/Menor

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA
}

Prioridade p1 = Prioridade.BAIXA;
Prioridade p2 = Prioridade.ALTA;

// ✅ Verificar se p1 < p2
if (p1.compareTo(p2) < 0) {
    System.out.println("p1 é menor que p2");
}

// ✅ Verificar se p1 > p2
if (p1.compareTo(p2) > 0) {
    System.out.println("p1 é maior que p2");
}

// ✅ Verificar se p1 == p2
if (p1.compareTo(p2) == 0) {
    System.out.println("p1 é igual a p2");
}
```

### 5. Ordenação com Stream

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum Nivel {
    JUNIOR, PLENO, SENIOR
}

List<Nivel> niveis = Arrays.asList(Nivel.SENIOR, Nivel.JUNIOR, Nivel.PLENO);

// ✅ Ordenar com sorted()
List<Nivel> ordenados = niveis.stream()
    .sorted()
    .collect(Collectors.toList());

// ✅ Resultado: [JUNIOR, PLENO, SENIOR]
System.out.println(ordenados);
```

### 6. Min e Max

```java
import java.util.Arrays;
import java.util.List;

public enum Tamanho {
    P, M, G, GG
}

List<Tamanho> lista = Arrays.asList(Tamanho.G, Tamanho.P, Tamanho.GG);

// ✅ Mínimo (menor ordinal)
Tamanho min = lista.stream().min(Tamanho::compareTo).orElse(null);
System.out.println(min); // P

// ✅ Máximo (maior ordinal)
Tamanho max = lista.stream().max(Tamanho::compareTo).orElse(null);
System.out.println(max); // GG
```

### 7. Comparação em Métodos

```java
public enum Prioridade {
    BAIXA, MEDIA, ALTA
}

// ✅ Método retorna boolean
public boolean isPrioridadeMaior(Prioridade p1, Prioridade p2) {
    return p1.compareTo(p2) > 0;
}

// ✅ Uso
Prioridade alta = Prioridade.ALTA;
Prioridade baixa = Prioridade.BAIXA;

if (isPrioridadeMaior(alta, baixa)) {
    System.out.println("ALTA > BAIXA"); // true
}
```

### 8. Ordenação Reversa

```java
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public enum Nivel {
    BASICO, INTERMEDIARIO, AVANCADO
}

List<Nivel> niveis = Arrays.asList(Nivel.BASICO, Nivel.AVANCADO, Nivel.INTERMEDIARIO);

// ✅ Ordenação reversa
Collections.sort(niveis, Collections.reverseOrder());

// ✅ Resultado: [AVANCADO, INTERMEDIARIO, BASICO]
System.out.println(niveis);
```

### 9. Comparação com null

```java
public enum Status {
    ATIVO, INATIVO
}

Status s = Status.ATIVO;

// ❌ NullPointerException se comparar com null
// s.compareTo(null); // NPE

// ✅ Verificar null antes
Status outro = null;
if (outro != null) {
    int resultado = s.compareTo(outro);
}
```

### 10. Comparable Interface

```java
// ✅ Enum implementa Comparable
public enum Tipo {
    X, Y, Z
}

// ✅ Pode usar em métodos que aceitam Comparable
public <T extends Comparable<T>> T obterMaior(T t1, T t2) {
    return t1.compareTo(t2) > 0 ? t1 : t2;
}

// ✅ Uso
Tipo maior = obterMaior(Tipo.X, Tipo.Z);
System.out.println(maior); // Z
```

---

## Aplicabilidade

**`compareTo()`** para:
- Ordenação natural
- Verificar maior/menor
- Min/Max
- Ordenação em collections

---

## Armadilhas

### 1. Ordem de Declaração Importa

```java
// ⚠️ Ordem de declaração define compareTo()
public enum Prioridade {
    ALTA,   // ordinal = 0
    MEDIA,  // ordinal = 1
    BAIXA   // ordinal = 2
}

// ⚠️ ALTA < BAIXA (porque ordinal ALTA = 0 < BAIXA = 2)
System.out.println(Prioridade.ALTA.compareTo(Prioridade.BAIXA)); // -2

// ✅ Se quiser ALTA > BAIXA, declare na ordem inversa
public enum PrioridadeCorreta {
    BAIXA, MEDIA, ALTA // ✅ Ordem correta
}
```

### 2. NPE com null

```java
public enum Status {
    ATIVO
}

Status s = Status.ATIVO;

// ❌ NPE
// s.compareTo(null); // NullPointerException

// ✅ Verificar null
Status outro = null;
if (outro != null) {
    s.compareTo(outro);
}
```

### 3. Não Use ordinal() Diretamente

```java
public enum Nivel {
    BASICO, AVANCADO
}

// ⚠️ Evitar comparar ordinal() diretamente
Nivel n1 = Nivel.BASICO;
Nivel n2 = Nivel.AVANCADO;

// ❌ Não fazer
if (n1.ordinal() < n2.ordinal()) { }

// ✅ Usar compareTo()
if (n1.compareTo(n2) < 0) { }
```

---

## Boas Práticas

### 1. Ordenar com Collections.sort()

```java
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public enum Tamanho {
    P, M, G
}

List<Tamanho> lista = Arrays.asList(Tamanho.G, Tamanho.P);

// ✅ Ordenar
Collections.sort(lista);
```

### 2. Declarar na Ordem Correta

```java
// ✅ Ordem crescente (BAIXA < MEDIA < ALTA)
public enum Prioridade {
    BAIXA, MEDIA, ALTA
}
```

### 3. Usar compareTo() em Condições

```java
public enum Nivel {
    JUNIOR, PLENO, SENIOR
}

Nivel n = Nivel.PLENO;

// ✅ Verificar se é pelo menos PLENO
if (n.compareTo(Nivel.PLENO) >= 0) {
    System.out.println("É PLENO ou SENIOR");
}
```

### 4. Min/Max com Stream

```java
import java.util.Arrays;
import java.util.List;

public enum Tamanho {
    P, M, G
}

List<Tamanho> lista = Arrays.asList(Tamanho.M, Tamanho.P);

// ✅ Min/Max
Tamanho min = lista.stream().min(Tamanho::compareTo).orElse(null);
Tamanho max = lista.stream().max(Tamanho::compareTo).orElse(null);
```

---

## Resumo

**`compareTo()`**:

```java
public enum Prioridade {
    BAIXA,  // ordinal = 0
    MEDIA,  // ordinal = 1
    ALTA    // ordinal = 2
}

Prioridade p1 = Prioridade.BAIXA;
Prioridade p2 = Prioridade.ALTA;

// ✅ compareTo() usa ordinal
System.out.println(p1.compareTo(p2)); // -2 (0 - 2)
System.out.println(p2.compareTo(p1)); //  2 (2 - 0)
System.out.println(p1.compareTo(p1)); //  0 (0 - 0)
```

**Ordenação**:

```java
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

List<Prioridade> lista = Arrays.asList(
    Prioridade.ALTA, 
    Prioridade.BAIXA, 
    Prioridade.MEDIA
);

// ✅ Ordenar por ordem natural
Collections.sort(lista);

// ✅ Resultado: [BAIXA, MEDIA, ALTA]
```

**Verificar maior/menor**:

```java
Prioridade p = Prioridade.MEDIA;

// ✅ Verificar se é pelo menos MEDIA
if (p.compareTo(Prioridade.MEDIA) >= 0) {
    System.out.println("É MEDIA ou ALTA");
}
```

**Regra de Ouro**: **`compareTo()` usa ordinal** (ordem de declaração). **Declare enums na ordem crescente** (menor → maior). **Use `compareTo()` em vez de `ordinal()`** para comparar. **Ordenação natural** com `Collections.sort()` ou `sorted()`.
