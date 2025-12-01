# ⚡ Criação e Performance do EnumSet

## 🎯 Factory Methods

EnumSet não possui construtores públicos. Criação é feita via **factory methods estáticos**:

### 1. EnumSet.of()

```java
// of(E e1) - um elemento
Set<Dia> segunda = EnumSet.of(Dia.SEGUNDA);

// of(E e1, E e2) - dois elementos
Set<Dia> fimSemana = EnumSet.of(Dia.SABADO, Dia.DOMINGO);

// of(E e1, E e2, E e3, ...) - até 5 sobrecargas
Set<Dia> uteis = EnumSet.of(Dia.SEG, Dia.TER, Dia.QUA, Dia.QUI, Dia.SEX);

// of(E first, E... rest) - varargs para 6+ elementos
Set<Mes> meses = EnumSet.of(Mes.JAN, Mes.FEV, Mes.MAR, Mes.ABR, Mes.MAI, Mes.JUN);
```

### 2. EnumSet.allOf()

```java
// Todos os elementos do enum
Set<DiaSemana> todosDias = EnumSet.allOf(DiaSemana.class);
// Equivale a EnumSet com todos os bits setados
```

### 3. EnumSet.noneOf()

```java
// Conjunto vazio (mas tipado)
Set<DiaSemana> vazio = EnumSet.noneOf(DiaSemana.class);
// Útil para construir conjunto incrementalmente
vazio.add(DiaSemana.SEGUNDA);
vazio.add(DiaSemana.SEXTA);
```

### 4. EnumSet.range()

```java
// Intervalo de constantes (INCLUSIVE)
Set<Mes> primeiroTrimestre = EnumSet.range(Mes.JANEIRO, Mes.MARCO);
// {JANEIRO, FEVEREIRO, MARCO}

// Baseado em ordinal - todos entre inicio e fim
```

### 5. EnumSet.complementOf()

```java
Set<Dia> uteis = EnumSet.range(Dia.SEG, Dia.SEX);
Set<Dia> naoUteis = EnumSet.complementOf(uteis);
// {SABADO, DOMINGO}

// Equivale a: allOf MINUS original
```

### 6. EnumSet.copyOf()

```java
Set<Dia> original = EnumSet.of(Dia.SEG, Dia.TER);
Set<Dia> copia = EnumSet.copyOf(original);

// Também aceita Collection genérica
Collection<Dia> lista = Arrays.asList(Dia.SEG, Dia.TER, Dia.QUA);
Set<Dia> set = EnumSet.copyOf(lista);
```

## ⚡ Performance

### Operações O(1)

```java
Set<Permissao> perms = EnumSet.of(Permissao.LER, Permissao.ESCREVER);

// Todas O(1) - operações bitwise
perms.add(Permissao.EXECUTAR);      // O(1)
perms.remove(Permissao.LER);        // O(1)
perms.contains(Permissao.ESCREVER); // O(1)
```

### Operações de Conjunto Otimizadas

```java
Set<Dia> set1 = EnumSet.of(Dia.SEG, Dia.TER, Dia.QUA);
Set<Dia> set2 = EnumSet.of(Dia.QUA, Dia.QUI, Dia.SEX);

// União: OR bitwise - extremamente rápido
set1.addAll(set2);  // {SEG, TER, QUA, QUI, SEX}

// Interseção: AND bitwise
set1.retainAll(set2);  // {QUA}

// Diferença: AND NOT bitwise
set1.removeAll(set2);
```

### Benchmark: EnumSet vs HashSet

```
Operação          | EnumSet | HashSet
------------------|---------|----------
add()            | 3ns     | 15ns
contains()       | 2ns     | 12ns
Memória (64 enum)| 8 bytes | 2KB+
Iteração         | 5ns     | 20ns
```

**EnumSet é 3-5x mais rápido e usa 99% menos memória!**

## 🧠 Implementação Interna

### RegularEnumSet vs JumboEnumSet

```java
// ≤64 elementos: RegularEnumSet (usa 1 long)
enum Pequeno { A, B, C, ..., Z }  // 26 elementos
Set<Pequeno> set = EnumSet.allOf(Pequeno.class);
// Internamente: 1 long (64 bits) - sobra espaço

// >64 elementos: JumboEnumSet (usa long[])
enum Grande { E1, E2, ..., E100 }  // 100 elementos
Set<Grande> set = EnumSet.allOf(Grande.class);
// Internamente: long[2] (128 bits)
```

### Representação Bit Vector

```java
enum Bits { B0, B1, B2, B3, B4 }

Set<Bits> set = EnumSet.of(B0, B2, B4);
// Internamente: 0b10101 (bits 0, 2, 4 ativos)

set.contains(B2);  // Verifica bit 2: (bits & (1 << 2)) != 0
set.add(B1);       // Seta bit 1:    bits |= (1 << 1)
set.remove(B0);    // Limpa bit 0:   bits &= ~(1 << 0)
```

## 🎯 Melhores Práticas

**1. Use EnumSet ao invés de HashSet para enums**

```java
// ❌ Evite
Set<Status> status = new HashSet<>();

// ✅ Prefira
Set<Status> status = EnumSet.noneOf(Status.class);
```

**2. Declare como Set, instancie como EnumSet**

```java
// ✅ Boa prática - flexibilidade de implementação
Set<Dia> dias = EnumSet.of(Dia.SEG, Dia.TER);
```

**3. Use allOf() e complementOf() para conjuntos grandes**

```java
// ❌ Verboso
Set<Mes> meses = EnumSet.of(Mes.JAN, Mes.FEV, Mes.MAR, ...);

// ✅ Conciso
Set<Mes> meses = EnumSet.allOf(Mes.class);
```
