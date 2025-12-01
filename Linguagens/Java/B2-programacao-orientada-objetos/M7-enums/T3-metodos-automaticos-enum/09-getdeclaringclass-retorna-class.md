# T3.09 - getDeclaringClass(): Retorna Class do Enum

## Introdução

**getDeclaringClass()**: retorna objeto Class do tipo enum.

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

Status s = Status.ATIVO;
Class<Status> classe = s.getDeclaringClass();
System.out.println(classe); // class Status
```

**Retorno**: Class<?> do enum.

---

## Fundamentos

### 1. Obter Class Básico

```java
public enum Cor {
    VERMELHO, VERDE, AZUL
}

Cor cor = Cor.VERMELHO;
Class<Cor> classe = cor.getDeclaringClass();
System.out.println(classe.getName()); // "Cor"
```

### 2. getDeclaringClass() vs getClass()

```java
Status s = Status.ATIVO;

// getDeclaringClass() = tipo enum
Class<Status> dc = s.getDeclaringClass();
System.out.println(dc); // class Status

// getClass() = mesma coisa (para enum simples)
Class<?> gc = s.getClass();
System.out.println(gc); // class Status

System.out.println(dc == gc); // true
```

### 3. Enum com Corpo de Constante

```java
public enum Operacao {
    SOMA {
        @Override
        public int calcular(int a, int b) {
            return a + b;
        }
    };
    
    public abstract int calcular(int a, int b);
}

Operacao op = Operacao.SOMA;

// getClass() = classe anônima (Operacao$1)
Class<?> gc = op.getClass();
System.out.println(gc); // class Operacao$1

// getDeclaringClass() = enum original (Operacao)
Class<Operacao> dc = op.getDeclaringClass();
System.out.println(dc); // class Operacao
```

### 4. Obter Nome do Enum

```java
Status s = Status.ATIVO;

String nomeSimples = s.getDeclaringClass().getSimpleName();
System.out.println(nomeSimples); // "Status"

String nomeCompleto = s.getDeclaringClass().getName();
System.out.println(nomeCompleto); // "br.com.exemplo.Status"
```

### 5. Enum.valueOf() com getDeclaringClass()

```java
Status s1 = Status.ATIVO;

// Converter String para enum usando getDeclaringClass()
String nome = "INATIVO";
Status s2 = Enum.valueOf(s1.getDeclaringClass(), nome);
System.out.println(s2); // INATIVO
```

### 6. Verificar se é Enum

```java
Status s = Status.ATIVO;

Class<Status> classe = s.getDeclaringClass();

if (classe.isEnum()) {
    System.out.println("É um enum");
}
```

### 7. Obter Constantes do Enum

```java
Status s = Status.ATIVO;

Status[] valores = s.getDeclaringClass().getEnumConstants();
System.out.println(Arrays.toString(valores));
// [ATIVO, INATIVO, PENDENTE]
```

### 8. Reflexão com Enum

```java
Status s = Status.ATIVO;

Class<Status> classe = s.getDeclaringClass();

// Métodos do enum
Method[] metodos = classe.getDeclaredMethods();
for (Method m : metodos) {
    System.out.println(m.getName());
}

// Campos do enum
Field[] campos = classe.getDeclaredFields();
for (Field f : campos) {
    System.out.println(f.getName());
}
```

### 9. EnumSet com getDeclaringClass()

```java
Status s = Status.ATIVO;

// Criar EnumSet com todas as constantes
Set<Status> set = EnumSet.allOf(s.getDeclaringClass());
System.out.println(set); // [ATIVO, INATIVO, PENDENTE]
```

### 10. Package do Enum

```java
Status s = Status.ATIVO;

Package pkg = s.getDeclaringClass().getPackage();
System.out.println(pkg.getName()); // "br.com.exemplo"
```

---

## Aplicabilidade

**getDeclaringClass()** para:
- Reflexão (obter constantes, métodos)
- EnumSet/EnumMap genéricos
- Obter tipo enum original (vs classe anônima)
- Serialização/deserialização

---

## Armadilhas

### 1. getClass() vs getDeclaringClass()

```java
// Enum com corpo de constante
public enum Operacao {
    SOMA {
        public int calcular() { return 0; }
    }
}

Operacao op = Operacao.SOMA;

// getClass() = classe anônima
System.out.println(op.getClass()); // Operacao$1

// getDeclaringClass() = enum original
System.out.println(op.getDeclaringClass()); // Operacao

// ✅ Usar getDeclaringClass() para tipo enum
```

### 2. Null

```java
Status s = null;

// ❌ NullPointerException
// Class<?> classe = s.getDeclaringClass();

// ✅ Verificar null
if (s != null) {
    Class<?> classe = s.getDeclaringClass();
}
```

### 3. Cast

```java
Status s = Status.ATIVO;

// ✅ Tipo genérico correto
Class<Status> classe = s.getDeclaringClass();

// ⚠️ Cast necessário se tipo genérico perdido
Class<?> classeGenerica = s.getDeclaringClass();
Class<Status> classe2 = (Class<Status>) classeGenerica;
```

---

## Boas Práticas

### 1. EnumSet Genérico

```java
// ✅ EnumSet com getDeclaringClass()
public static <E extends Enum<E>> Set<E> getAllValues(E enumConstant) {
    return EnumSet.allOf(enumConstant.getDeclaringClass());
}

Set<Status> status = getAllValues(Status.ATIVO);
```

### 2. valueOf() Genérico

```java
// ✅ valueOf() genérico
public static <E extends Enum<E>> E parse(E exemplo, String nome) {
    return Enum.valueOf(exemplo.getDeclaringClass(), nome);
}

Status s = parse(Status.ATIVO, "INATIVO");
System.out.println(s); // INATIVO
```

### 3. Reflexão

```java
// ✅ Obter constantes via reflexão
Status s = Status.ATIVO;
Status[] valores = s.getDeclaringClass().getEnumConstants();
```

### 4. Logging

```java
// ✅ Log com tipo enum
Status s = Status.ATIVO;
logger.info("Processando {} do tipo {}", 
    s.name(), 
    s.getDeclaringClass().getSimpleName());
// "Processando ATIVO do tipo Status"
```

---

## Resumo

**getDeclaringClass()**:

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE
}

Status s = Status.ATIVO;
Class<Status> classe = s.getDeclaringClass();
System.out.println(classe); // class Status
```

**getDeclaringClass() vs getClass()**:

```java
// Enum simples: iguais
public enum Status { ATIVO }

Status s = Status.ATIVO;
s.getClass()            // class Status
s.getDeclaringClass()   // class Status

// Enum com corpo: diferentes
public enum Operacao {
    SOMA {
        public int calcular() { return 0; }
    }
}

Operacao op = Operacao.SOMA;
op.getClass()           // class Operacao$1 (classe anônima)
op.getDeclaringClass()  // class Operacao (enum original)
```

**Uso comum**:

```java
Status s = Status.ATIVO;

// Nome do enum
s.getDeclaringClass().getSimpleName() // "Status"
s.getDeclaringClass().getName()       // "br.com.exemplo.Status"

// Constantes
s.getDeclaringClass().getEnumConstants() // [ATIVO, INATIVO, PENDENTE]

// EnumSet
EnumSet.allOf(s.getDeclaringClass())

// valueOf()
Enum.valueOf(s.getDeclaringClass(), "INATIVO")

// Package
s.getDeclaringClass().getPackage().getName()
```

**Reflexão**:

```java
Class<Status> classe = Status.ATIVO.getDeclaringClass();

// Verificar enum
classe.isEnum() // true

// Constantes
classe.getEnumConstants() // Status[]

// Métodos/Campos
classe.getDeclaredMethods()
classe.getDeclaredFields()
```

**Regra de Ouro**: `getDeclaringClass()` retorna `Class<E>` do enum. Diferente de `getClass()` quando enum tem corpo de constante (classe anônima). Use para **reflexão**, **EnumSet/EnumMap genéricos**, obter **constantes**, **nome** do enum. Útil em métodos genéricos (`<E extends Enum<E>>`).
