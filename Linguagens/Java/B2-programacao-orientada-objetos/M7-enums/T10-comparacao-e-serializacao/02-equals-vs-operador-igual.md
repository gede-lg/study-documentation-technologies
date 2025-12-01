# T10.02 - equals() vs Operador Igual

## Introdução

**Duas formas de comparar**: `equals()` e `==`.

```java
public enum Status {
    ATIVO, INATIVO
}

Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

// ✅ Ambos retornam true
System.out.println(s1 == s2);       // true
System.out.println(s1.equals(s2));  // true
```

**Diferença**: `==` compara referências, `equals()` compara valores (mas em enums são equivalentes).

---

## Fundamentos

### 1. Operador == (Referência)

```java
public enum Cor {
    VERMELHO, VERDE
}

Cor c1 = Cor.VERMELHO;
Cor c2 = Cor.VERMELHO;

// ✅ Compara referências (mesma instância)
System.out.println(c1 == c2); // true
```

### 2. Método equals() (Valor)

```java
public enum Tipo {
    A, B
}

Tipo t1 = Tipo.A;
Tipo t2 = Tipo.A;

// ✅ Compara valores (implementado em Enum)
System.out.println(t1.equals(t2)); // true
```

### 3. Implementação de equals() em Enum

```java
// ✅ Enum.equals() implementado como:
// public final boolean equals(Object other) {
//     return this == other;
// }

public enum Status {
    ATIVO
}

// ✅ equals() usa == internamente
Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

System.out.println(s1.equals(s2)); // true (usa == internamente)
System.out.println(s1 == s2);      // true
```

### 4. NullPointerException com equals()

```java
public enum Prioridade {
    ALTA, BAIXA
}

Prioridade p = null;

// ❌ NullPointerException
// p.equals(Prioridade.ALTA); // NPE

// ✅ Seguro com ==
System.out.println(p == Prioridade.ALTA); // false
```

### 5. Ordem Segura com equals()

```java
public enum Nivel {
    BASICO, AVANCADO
}

Nivel n = null;

// ❌ NPE se n for null
// n.equals(Nivel.BASICO); // NPE

// ✅ Ordem segura (constante primeiro)
if (Nivel.BASICO.equals(n)) {
    System.out.println("Básico");
}

// ✅ Retorna false (não lança NPE)
System.out.println(Nivel.BASICO.equals(n)); // false
```

### 6. Performance

```java
public enum Tipo {
    X, Y
}

Tipo t = Tipo.X;

// ✅ == (mais rápido: comparação direta de referência)
if (t == Tipo.X) { }

// ⚠️ equals() (mais lento: chamada de método)
if (t.equals(Tipo.X)) { }

// ✅ Diferença mínima, mas == é preferível
```

### 7. Comparação com Object

```java
public enum Status {
    ATIVO
}

Object obj = Status.ATIVO;

// ⚠️ Precisa cast com ==
// if (obj == Status.ATIVO) { } // OK, mas obj é Object

// ✅ equals() aceita Object
if (obj.equals(Status.ATIVO)) {
    System.out.println("É ATIVO");
}

// ✅ Melhor: verificar instanceof
if (obj instanceof Status && obj == Status.ATIVO) {
    System.out.println("É ATIVO");
}
```

### 8. Comparação em Collections

```java
import java.util.List;
import java.util.ArrayList;

public enum Cor {
    VERMELHO, VERDE
}

List<Cor> lista = new ArrayList<>();
lista.add(Cor.VERMELHO);

// ✅ contains() usa equals() internamente
System.out.println(lista.contains(Cor.VERMELHO)); // true

// ✅ Funciona porque equals() == ==
```

### 9. Comparação com String

```java
public enum Tipo {
    A, B
}

String s = "A";

// ❌ Não funciona (tipos incompatíveis)
// if (Tipo.A == s) { } // Erro de compilação

// ⚠️ equals() aceita Object (mas retorna false)
System.out.println(Tipo.A.equals(s)); // false

// ✅ Converter String para enum
Tipo t = Tipo.valueOf(s);
if (t == Tipo.A) {
    System.out.println("É A");
}
```

### 10. Equals é Final

```java
// ✅ Enum.equals() é final (não pode sobrescrever)
public enum Status {
    ATIVO {
        // ❌ Não pode sobrescrever equals()
        // @Override
        // public boolean equals(Object obj) { } // Erro
    }
}

// ✅ equals() sempre compara com ==
```

---

## Aplicabilidade

**Use `==`** para:
- Comparação direta
- Performance
- Null-safety

**Use `equals()`** quando:
- Variável é Object
- Ordem segura (constante.equals(variavel))

---

## Armadilhas

### 1. NPE com equals()

```java
public enum Status {
    ATIVO
}

Status s = null;

// ❌ NPE
// s.equals(Status.ATIVO); // NullPointerException

// ✅ Usar ==
if (s == Status.ATIVO) { } // false
```

### 2. Ordem Segura

```java
public enum Tipo {
    A
}

Tipo t = null;

// ❌ NPE
// t.equals(Tipo.A); // NPE

// ✅ Constante primeiro
if (Tipo.A.equals(t)) { } // false (não lança NPE)
```

### 3. Comparação com String

```java
public enum Cor {
    VERMELHO
}

String s = "VERMELHO";

// ⚠️ Retorna false (tipos diferentes)
System.out.println(Cor.VERMELHO.equals(s)); // false

// ✅ Converter para enum
Cor c = Cor.valueOf(s);
System.out.println(c == Cor.VERMELHO); // true
```

---

## Boas Práticas

### 1. Preferir ==

```java
public enum Status {
    ATIVO
}

Status s = Status.ATIVO;

// ✅ Preferir ==
if (s == Status.ATIVO) { }

// ⚠️ Evitar equals() (desnecessário)
if (s.equals(Status.ATIVO)) { }
```

### 2. Ordem Segura com equals()

```java
public enum Nivel {
    BASICO
}

Nivel n = obterNivel(); // pode ser null

// ✅ Constante primeiro
if (Nivel.BASICO.equals(n)) { }

// ❌ Variável primeiro (risco de NPE)
// if (n.equals(Nivel.BASICO)) { } // NPE se n for null
```

### 3. Verificar null com ==

```java
public enum Tipo {
    X
}

Tipo t = obterTipo(); // pode ser null

// ✅ Verificar null com ==
if (t != null && t == Tipo.X) { }
```

### 4. Collections Usam equals()

```java
import java.util.HashSet;
import java.util.Set;

public enum Cor {
    VERMELHO
}

Set<Cor> cores = new HashSet<>();
cores.add(Cor.VERMELHO);

// ✅ contains() usa equals()
System.out.println(cores.contains(Cor.VERMELHO)); // true
```

---

## Resumo

**`==` vs `equals()`**:

```java
public enum Status {
    ATIVO
}

Status s1 = Status.ATIVO;
Status s2 = Status.ATIVO;

// ✅ == (preferível)
System.out.println(s1 == s2); // true

// ✅ equals() (equivalente, mas desnecessário)
System.out.println(s1.equals(s2)); // true
```

**NullPointerException**:

```java
Status s = null;

// ❌ NPE
// s.equals(Status.ATIVO); // NullPointerException

// ✅ Seguro com ==
System.out.println(s == Status.ATIVO); // false

// ✅ Ordem segura com equals()
System.out.println(Status.ATIVO.equals(s)); // false
```

**Performance**:

```java
Status s = Status.ATIVO;

// ✅ == (mais rápido: comparação direta)
if (s == Status.ATIVO) { }

// ⚠️ equals() (mais lento: chamada de método)
if (s.equals(Status.ATIVO)) { }
```

**Implementação**:

```java
// ✅ Enum.equals() é final e usa ==
public final boolean equals(Object other) {
    return this == other;
}
```

**Regra de Ouro**: **Preferir `==`** para comparar enums. **Mais rápido** (comparação direta). **Null-safe** (não lança NPE). **Simples** (código limpo). Se usar `equals()`, **constante primeiro** (Status.ATIVO.equals(variavel)) para evitar NPE.
