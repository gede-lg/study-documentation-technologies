# T6.04 - ArrayStoreException

## Introdução

**ArrayStoreException**: lançada quando tentamos armazenar objeto de **tipo incompatível** em array.

```java
String[] strings = new String[3];
Object[] objetos = strings; // Covariância

objetos[0] = "texto"; // ✅ OK: String
objetos[1] = 10;      // ❌ Runtime: ArrayStoreException
// java.lang.ArrayStoreException: java.lang.Integer
```

**Causa**: arrays são **covariantes** mas Java verifica tipo em **runtime**.

**Herança**: `ArrayStoreException` extends `RuntimeException` (unchecked).

**Quando ocorre**:
- Atribuir objeto incompatível a array covariante
- Apenas em **runtime** (não em compile-time)

**Como evitar**:
- Usar **Generics** (type-safe em compile-time)
- Verificar tipo antes de atribuir
- Evitar covariância de arrays

---

## Fundamentos

### 1. ArrayStoreException Básica

**ArrayStoreException**: tipo incompatível em array.

```java
Object[] objetos = new String[3]; // Covariante

objetos[0] = "texto"; // OK: String é compatível
objetos[1] = 10;      // ❌ ArrayStoreException
// java.lang.ArrayStoreException: java.lang.Integer
```

### 2. Herança de RuntimeException

**ArrayStoreException** é **unchecked** (extends `RuntimeException`).

```java
public class ArrayStoreException extends RuntimeException {
    public ArrayStoreException() { }
    public ArrayStoreException(String s) { }
}

// Não precisa declarar throws
public void metodo(Object[] array) {
    array[0] = 10; // Pode lançar ArrayStoreException
}
```

### 3. Verificação em Runtime

Java verifica tipo de array em **runtime**.

```java
String[] strings = new String[3];
Object[] objetos = strings; // OK: covariância

// Runtime verifica: objetos é String[]
// String[] só aceita String -> lança exceção

objetos[0] = 10; // ❌ ArrayStoreException
```

### 4. Arrays Multidimensionais

**ArrayStoreException** também em arrays multidimensionais.

```java
String[][] strings = new String[2][3];
Object[][] objetos = strings; // Covariante

objetos[0][0] = "texto"; // OK
objetos[0][1] = 10;      // ❌ ArrayStoreException

objetos[0] = new Integer[3]; // ❌ ArrayStoreException
```

### 5. Null É Sempre Válido

**null** nunca lança `ArrayStoreException`.

```java
Object[] objetos = new String[3];

objetos[0] = null; // ✅ OK: null é compatível
objetos[1] = "texto"; // OK
objetos[2] = 10; // ❌ ArrayStoreException
```

### 6. Tipos Primitivos vs Wrappers

Primitivos não são covariantes, mas wrappers sim.

```java
// ❌ Primitivos
int[] inteiros = new int[3];
// Object[] objetos = inteiros; // ERRO de compilação

// ✅ Wrappers
Integer[] integers = new Integer[3];
Object[] objetos = integers; // OK: covariante

objetos[0] = 10; // OK: Integer
objetos[1] = "texto"; // ❌ ArrayStoreException
```

### 7. Subtipo É Válido

Subtipo é sempre compatível.

```java
Number[] numeros = new Integer[3]; // Covariante

numeros[0] = 10;    // OK: Integer é Number
numeros[1] = 10.5;  // ❌ ArrayStoreException (Double)
// java.lang.ArrayStoreException: java.lang.Double
```

### 8. instanceof Não Previne

**instanceof** verifica referência, não array.

```java
Object[] objetos = new String[3];

Object valor = 10;
if (valor instanceof Object) { // true
    objetos[0] = valor; // ❌ ArrayStoreException
}
```

### 9. Mensagem de Erro

Mensagem indica tipo incompatível.

```java
try {
    Object[] objetos = new String[3];
    objetos[0] = 10;
} catch (ArrayStoreException e) {
    System.out.println(e.getMessage()); // "java.lang.Integer"
}
```

### 10. Generics Não Lançam

**Generics** não lançam `ArrayStoreException` (type-safe em compile-time).

```java
// ❌ Arrays: runtime
Object[] objetos = new String[3];
objetos[0] = 10; // Runtime: ArrayStoreException

// ✅ Generics: compile-time
List<Object> lista = new ArrayList<String>(); // ERRO de compilação
```

---

## Aplicabilidade

**ArrayStoreException ocorre quando**:
- Arrays **covariantes**
- Atribuir tipo **incompatível**
- Apenas em **runtime**

**Como evitar**:
- Usar **Generics** (type-safe)
- Verificar tipo antes de atribuir
- Evitar covariância de arrays
- Usar `Class.isInstance()`

---

## Armadilhas

### 1. Covariância de Arrays

```java
String[] strings = new String[3];
Object[] objetos = strings; // Covariante

objetos[0] = 10; // ❌ ArrayStoreException
```

### 2. Arrays Multidimensionais

```java
String[][] strings = new String[2][3];
Object[][] objetos = strings;

objetos[0] = new Integer[3]; // ❌ ArrayStoreException
```

### 3. Subtipo Incompatível

```java
Number[] numeros = new Integer[3];

numeros[0] = 10;   // OK: Integer
numeros[1] = 10.5; // ❌ ArrayStoreException: Double
```

### 4. instanceof Não Funciona

```java
Object[] objetos = new String[3];

Object valor = 10;
if (valor instanceof Object) { // true (sempre)
    objetos[0] = valor; // ❌ ArrayStoreException
}
```

### 5. Métodos Genéricos com Arrays

```java
public static void adicionar(Object[] array, Object valor) {
    array[0] = valor; // Pode lançar ArrayStoreException
}

String[] strings = new String[3];
adicionar(strings, 10); // ❌ Runtime: ArrayStoreException
```

### 6. Varargs com Arrays

```java
public static void imprimir(Object... valores) {
    // valores é Object[]
    valores[0] = 10; // Pode lançar ArrayStoreException
}

String[] strings = {"a", "b"};
imprimir(strings); // ❌ ArrayStoreException se tentar modificar
```

### 7. Collections.toArray

```java
List<String> lista = Arrays.asList("a", "b", "c");
Object[] objetos = lista.toArray();

objetos[0] = 10; // ❌ ArrayStoreException
// toArray() retorna String[] se lista é String[]
```

---

## Boas Práticas

### 1. Prefira Generics a Arrays

```java
// ❌ Arrays: não type-safe
public void processar(Object[] array) {
    array[0] = 10; // Pode lançar ArrayStoreException
}

String[] strings = {"a", "b"};
// processar(strings); // ❌ Runtime: ArrayStoreException

// ✅ Generics: type-safe
public <T> void processar(List<T> lista, T valor) {
    lista.set(0, valor); // Type-safe
}

List<String> strings2 = new ArrayList<>(Arrays.asList("a", "b"));
processar(strings2, "c"); // OK
// processar(strings2, 10); // ❌ ERRO de compilação
```

### 2. Verificar Tipo Antes de Atribuir

```java
public static void adicionar(Object[] array, int index, Object valor) {
    Class<?> componentType = array.getClass().getComponentType();
    
    if (componentType.isInstance(valor)) {
        array[index] = valor; // Type-safe
    } else {
        throw new IllegalArgumentException(
            "Tipo incompatível: esperado " + componentType.getName() +
            ", recebido " + valor.getClass().getName()
        );
    }
}

String[] strings = new String[3];
adicionar(strings, 0, "texto"); // OK

try {
    adicionar(strings, 1, 10); // IllegalArgumentException
} catch (IllegalArgumentException e) {
    System.out.println(e.getMessage());
    // "Tipo incompatível: esperado java.lang.String, recebido java.lang.Integer"
}
```

### 3. Catch ArrayStoreException

```java
public static void processar(Object[] array, Object valor) {
    try {
        array[0] = valor;
    } catch (ArrayStoreException e) {
        System.err.println("Tipo incompatível: " + e.getMessage());
    }
}

String[] strings = new String[3];
processar(strings, 10); // "Tipo incompatível: java.lang.Integer"
```

### 4. Usar Arrays.copyOf com Tipo

```java
String[] strings = {"a", "b", "c"};

// Arrays.copyOf com tipo específico
Object[] objetos = Arrays.copyOf(strings, strings.length, Object[].class);

objetos[0] = 10; // ✅ OK: objetos é Object[]
```

### 5. Collections.toArray com Array

```java
List<String> lista = Arrays.asList("a", "b", "c");

// toArray() sem parâmetro: retorna Object[]
Object[] objetos1 = lista.toArray();
// objetos1[0] = 10; // ❌ ArrayStoreException (é String[])

// toArray(T[]) com tipo específico
Object[] objetos2 = lista.toArray(new Object[0]);
objetos2[0] = 10; // ✅ OK: objetos2 é Object[]
```

### 6. Wrapper para Type Safety

```java
public class ArrayWrapper<T> {
    private final T[] array;
    private final Class<T> tipo;
    
    @SuppressWarnings("unchecked")
    public ArrayWrapper(Class<T> tipo, int tamanho) {
        this.tipo = tipo;
        this.array = (T[]) Array.newInstance(tipo, tamanho);
    }
    
    public void set(int index, T valor) {
        if (!tipo.isInstance(valor)) {
            throw new IllegalArgumentException("Tipo incompatível");
        }
        array[index] = valor;
    }
    
    public T get(int index) {
        return array[index];
    }
}

// Uso
ArrayWrapper<String> wrapper = new ArrayWrapper<>(String.class, 3);
wrapper.set(0, "texto"); // OK
// wrapper.set(1, 10); // ❌ ERRO de compilação
```

### 7. Evitar Covariância

```java
// ❌ Covariância
public void processar(Object[] array) {
    // array pode ser String[], Integer[], etc.
    // Difícil garantir type safety
}

// ✅ Tipo específico
public void processar(String[] array) {
    // Type-safe: array é String[]
}

// ✅ Generics
public <T> void processar(T[] array) {
    // Type-safe: tipo inferido
}
```

### 8. Validação de Tipo

```java
public static boolean podeArmazenar(Object[] array, Object valor) {
    if (valor == null) return true; // null é sempre válido
    
    Class<?> componentType = array.getClass().getComponentType();
    return componentType.isInstance(valor);
}

String[] strings = new String[3];
System.out.println(podeArmazenar(strings, "texto")); // true
System.out.println(podeArmazenar(strings, 10));      // false
System.out.println(podeArmazenar(strings, null));    // true
```

### 9. Array Reflection

```java
import java.lang.reflect.Array;

public static void adicionarSafe(Object array, int index, Object valor) {
    Class<?> arrayClass = array.getClass();
    
    if (!arrayClass.isArray()) {
        throw new IllegalArgumentException("Não é um array");
    }
    
    Class<?> componentType = arrayClass.getComponentType();
    
    if (valor != null && !componentType.isInstance(valor)) {
        throw new IllegalArgumentException(
            "Tipo incompatível: esperado " + componentType.getName()
        );
    }
    
    Array.set(array, index, valor); // Type-safe
}

String[] strings = new String[3];
adicionarSafe(strings, 0, "texto"); // OK

try {
    adicionarSafe(strings, 1, 10); // IllegalArgumentException
} catch (IllegalArgumentException e) {
    System.out.println(e.getMessage());
}
```

### 10. Arrays vs List

```java
// ❌ Arrays: ArrayStoreException
Object[] objetos = new String[3];
objetos[0] = 10; // Runtime: ArrayStoreException

// ✅ List: type-safe
List<Object> lista = new ArrayList<>();
lista.add(10);     // OK
lista.add("texto"); // OK

// List<String>
List<String> strings = new ArrayList<>();
strings.add("texto"); // OK
// strings.add(10); // ❌ ERRO de compilação
```

---

## Resumo

**ArrayStoreException**: lançada ao armazenar tipo **incompatível** em array.

```java
Object[] objetos = new String[3];
objetos[0] = 10; // ❌ ArrayStoreException: java.lang.Integer
```

**Causa**: arrays **covariantes** com verificação em **runtime**.

```java
String[] strings = new String[3];
Object[] objetos = strings; // Covariante
// Runtime verifica: objetos é String[]
objetos[0] = 10; // ❌ ArrayStoreException
```

**Herança**: `RuntimeException` (unchecked).

```java
public class ArrayStoreException extends RuntimeException { }
```

**Null**: sempre válido.

```java
objetos[0] = null; // ✅ OK
```

**Arrays multidimensionais**:

```java
String[][] strings = new String[2][3];
Object[][] objetos = strings;
objetos[0] = new Integer[3]; // ❌ ArrayStoreException
```

**Subtipo incompatível**:

```java
Number[] numeros = new Integer[3];
numeros[0] = 10;   // OK: Integer
numeros[1] = 10.5; // ❌ ArrayStoreException: Double
```

**Primitivos vs Wrappers**:

```java
// ❌ Primitivos: não covariantes
int[] inteiros = new int[3];
// Object[] objetos = inteiros; // ERRO

// ✅ Wrappers: covariantes
Integer[] integers = new Integer[3];
Object[] objetos = integers; // OK
objetos[0] = "texto"; // ❌ ArrayStoreException
```

**Generics**: não lançam (type-safe em compile-time).

```java
List<Object> lista = new ArrayList<String>(); // ❌ ERRO de compilação
```

**Como evitar**:

1. **Prefira Generics**:
```java
// ✅ Type-safe
public <T> void processar(List<T> lista) { }
```

2. **Verificar tipo**:
```java
if (array.getClass().getComponentType().isInstance(valor)) {
    array[index] = valor;
}
```

3. **Catch exceção**:
```java
try {
    array[0] = valor;
} catch (ArrayStoreException e) {
    System.err.println("Tipo incompatível");
}
```

4. **Arrays.copyOf com tipo**:
```java
Object[] objetos = Arrays.copyOf(strings, strings.length, Object[].class);
```

5. **Collections.toArray com array**:
```java
Object[] objetos = lista.toArray(new Object[0]);
```

**Validação**:

```java
boolean podeArmazenar = array.getClass().getComponentType().isInstance(valor);
```

**Mensagem de erro**:

```java
catch (ArrayStoreException e) {
    e.getMessage(); // "java.lang.Integer"
}
```

**Arrays vs List**:

| Característica | Arrays | List |
|---------------|--------|------|
| **Type safety** | Runtime | Compile-time |
| **Exceção** | ArrayStoreException | Erro de compilação |
| **Covariância** | Sim | Não (invariante) |

**instanceof não funciona**:

```java
if (valor instanceof Object) { // sempre true
    array[0] = valor; // ❌ ArrayStoreException
}
```

**Reflection**:

```java
Class<?> componentType = array.getClass().getComponentType();
if (componentType.isInstance(valor)) {
    Array.set(array, index, valor);
}
```

**Varargs**:

```java
public void imprimir(Object... valores) {
    // valores[0] = 10; // Pode lançar ArrayStoreException
}

String[] strings = {"a", "b"};
imprimir(strings);
```

**Regra de Ouro**: `ArrayStoreException` ocorre em **runtime** ao armazenar tipo **incompatível** em array **covariante**. Arrays verificam tipo apenas em **runtime** (não type-safe). Prefira **Generics** (type-safe em compile-time) ou **verifique tipo** antes de atribuir (`Class.isInstance()`). **null** nunca lança exceção. Para evitar, use **List** (invariante) ou **valide tipo** explicitamente.
