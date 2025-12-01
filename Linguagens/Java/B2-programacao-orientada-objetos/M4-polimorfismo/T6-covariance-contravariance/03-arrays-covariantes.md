# T6.03 - Arrays Covariantes

## Introdução

**Arrays covariantes**: array de subtipo é **compatível** com array de supertipo.

```java
String[] strings = new String[3];
Object[] objetos = strings; // ✅ OK: covariância

objetos[0] = "texto";  // OK: String
objetos[1] = 10;       // ❌ Runtime: ArrayStoreException
```

**Covariância de arrays**: `String[]` é subtipo de `Object[]`.

**Problema**: não é **type-safe** (verifica tipo apenas em **runtime**).

**Comparação com Generics**:
- **Arrays**: covariantes (não type-safe)
- **Generics**: invariantes (type-safe)

```java
// Arrays: covariante
Object[] objetos = new String[3]; // ✅ OK (perigoso)

// Generics: invariante
List<Object> lista = new ArrayList<String>(); // ❌ ERRO (seguro)
```

**Introduzido**: Java 1.0 (compatibilidade com versões antigas).

**Recomendação**: prefira **Generics** a arrays quando possível.

---

## Fundamentos

### 1. Arrays São Covariantes

Array de **subtipo** é compatível com array de **supertipo**.

```java
String[] strings = {"a", "b", "c"};
Object[] objetos = strings; // ✅ Compilação OK

System.out.println(objetos[0]); // "a"
```

### 2. ArrayStoreException

Atribuir tipo **incompatível** lança **ArrayStoreException** em **runtime**.

```java
String[] strings = new String[3];
Object[] objetos = strings; // Covariante

objetos[0] = "texto"; // OK: String
objetos[1] = 10;      // ❌ Runtime: ArrayStoreException
// java.lang.ArrayStoreException: java.lang.Integer
```

### 3. Verificação em Runtime

Java verifica tipo em **runtime** para arrays.

```java
Object[] objetos = new String[3]; // Cria String[]

// Em runtime, Java verifica:
// objetos é String[] -> pode armazenar String
objetos[0] = "texto"; // OK

// objetos é String[] -> NÃO pode armazenar Integer
objetos[1] = 10; // ❌ ArrayStoreException
```

### 4. Generics São Invariantes

Generics **não são covariantes** (type-safe).

```java
// ❌ Generics: invariante
List<Object> lista = new ArrayList<String>(); // ERRO de compilação

// ✅ Solução: wildcard
List<?> lista2 = new ArrayList<String>(); // OK
List<? extends Object> lista3 = new ArrayList<String>(); // OK
```

### 5. Arrays de Primitivos Não São Covariantes

Arrays de **primitivos** não são covariantes.

```java
int[] inteiros = {1, 2, 3};
// Object[] objetos = inteiros; // ❌ ERRO: primitivos

// ✅ Wrappers são covariantes
Integer[] integers = {1, 2, 3};
Object[] objetos = integers; // OK
Number[] numeros = integers; // OK
```

### 6. Arrays Multidimensionais

Arrays multidimensionais também são covariantes.

```java
String[][] strings = new String[2][3];
Object[][] objetos = strings; // ✅ OK: covariante

objetos[0][0] = "texto"; // OK
objetos[0][1] = 10;      // ❌ Runtime: ArrayStoreException
```

### 7. Null É Sempre Válido

**null** pode ser atribuído a qualquer array.

```java
String[] strings = new String[3];
Object[] objetos = strings;

objetos[0] = null; // ✅ OK: null é compatível
```

### 8. Arrays vs Generics

**Arrays**: covariantes, não type-safe.
**Generics**: invariantes, type-safe.

```java
// Arrays: runtime check
Object[] objetos = new String[3];
objetos[0] = 10; // ❌ Runtime: ArrayStoreException

// Generics: compile-time check
List<Object> lista = new ArrayList<String>(); // ❌ ERRO de compilação
```

### 9. Compatibilidade com Código Legado

Covariância de arrays: **compatibilidade** com Java 1.0.

```java
// Java 1.0 (antes de Generics)
public static void ordenar(Object[] array) {
    // Ordena array de qualquer tipo
}

String[] strings = {"c", "a", "b"};
ordenar(strings); // OK: covariância
```

### 10. Reificação de Arrays

Arrays são **reificados**: tipo conhecido em **runtime**.

```java
String[] strings = new String[3];
Object[] objetos = strings;

// Runtime sabe que objetos é String[]
System.out.println(objetos.getClass()); // class [Ljava.lang.String;
```

---

## Aplicabilidade

**Use arrays quando**:
- **Performance** crítica (primitivos)
- **Interoperabilidade** com código legado
- **API nativa** (JNI)
- **Estruturas de dados** fixas

**Prefira Generics quando**:
- **Type safety** é importante
- **Flexibilidade** (adicionar/remover elementos)
- **API moderna** (Collections Framework)
- **Evitar ArrayStoreException**

---

## Armadilhas

### 1. ArrayStoreException

```java
String[] strings = new String[3];
Object[] objetos = strings;

objetos[0] = "texto"; // OK
objetos[1] = 10;      // ❌ Runtime: ArrayStoreException
```

### 2. Generics Não São Covariantes

```java
List<String> strings = new ArrayList<>();
// List<Object> objetos = strings; // ❌ ERRO de compilação

// ✅ Solução: wildcard
List<? extends Object> objetos = strings; // OK (somente leitura)
```

### 3. Arrays de Primitivos

```java
int[] inteiros = {1, 2, 3};
// Object[] objetos = inteiros; // ❌ ERRO

// ✅ Wrappers
Integer[] integers = {1, 2, 3};
Object[] objetos = integers; // OK
```

### 4. Confundir Covariância com Type Safety

```java
// Covariância NÃO implica type safety

Object[] objetos = new String[3]; // Compila (covariante)
objetos[0] = 10; // ❌ Runtime: ArrayStoreException (não type-safe)
```

### 5. Arrays Multidimensionais

```java
String[][] strings = new String[2][3];
Object[][] objetos = strings;

objetos[0] = new Integer[3]; // ❌ Runtime: ArrayStoreException
```

### 6. Null Pointer

```java
String[] strings = null;
Object[] objetos = strings; // OK: null

objetos[0] = "texto"; // ❌ Runtime: NullPointerException
```

### 7. Arrays e Generics Juntos

```java
// ❌ Generic array não compila
List<String>[] arrays = new ArrayList<String>[10]; // ERRO

// ✅ Solução: List de List
List<List<String>> listas = new ArrayList<>();
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
processar(strings); // ❌ Runtime: ArrayStoreException

// ✅ Generics: type-safe
public <T> void processar(List<T> lista) {
    // lista.add(10); // ❌ ERRO de compilação (se T != Integer)
}

List<String> strings2 = Arrays.asList("a", "b");
processar(strings2); // OK
```

### 2. Arrays de Primitivos

```java
// ✅ Arrays para primitivos (performance)
int[] inteiros = new int[1000000];
for (int i = 0; i < inteiros.length; i++) {
    inteiros[i] = i;
}

// Generics não suportam primitivos
// List<int> lista = new ArrayList<>(); // ❌ ERRO
List<Integer> lista = new ArrayList<>(); // OK (boxing)
```

### 3. Métodos Utilitários

```java
import java.util.*;

public class ArrayUtil {
    // Arrays.asList: aceita varargs covariante
    public static void imprimir(Object[] array) {
        System.out.println(Arrays.toString(array));
    }
    
    public static void main(String[] args) {
        String[] strings = {"a", "b", "c"};
        imprimir(strings); // OK: covariância
        
        Integer[] integers = {1, 2, 3};
        imprimir(integers); // OK: covariância
    }
}
```

### 4. Verificação de Tipo

```java
public class ArrayUtil {
    public static void adicionar(Object[] array, int index, Object valor) {
        if (array.getClass().getComponentType().isInstance(valor)) {
            array[index] = valor; // Type-safe
        } else {
            throw new IllegalArgumentException("Tipo incompatível");
        }
    }
    
    public static void main(String[] args) {
        String[] strings = new String[3];
        adicionar(strings, 0, "texto"); // OK
        
        try {
            adicionar(strings, 1, 10); // ❌ IllegalArgumentException
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage()); // "Tipo incompatível"
        }
    }
}
```

### 5. Wildcards com Generics

```java
// Producer: extends (leitura)
public static void copiar(List<? extends Number> origem, Number[] destino) {
    for (int i = 0; i < origem.size() && i < destino.length; i++) {
        destino[i] = origem.get(i);
    }
}

List<Integer> inteiros = Arrays.asList(1, 2, 3);
Number[] numeros = new Number[3];
copiar(inteiros, numeros); // OK
```

### 6. Arrays.copyOf

```java
import java.util.*;

String[] strings = {"a", "b", "c"};

// Arrays.copyOf retorna array do tipo especificado
String[] copia = Arrays.copyOf(strings, strings.length);
Object[] objetos = Arrays.copyOf(strings, strings.length, Object[].class);

System.out.println(copia.getClass());   // class [Ljava.lang.String;
System.out.println(objetos.getClass()); // class [Ljava.lang.Object;
```

### 7. Collections.toArray

```java
import java.util.*;

List<String> lista = Arrays.asList("a", "b", "c");

// toArray() retorna Object[]
Object[] objetos = lista.toArray();

// toArray(T[]) retorna T[]
String[] strings = lista.toArray(new String[0]);

System.out.println(objetos.getClass()); // class [Ljava.lang.Object;
System.out.println(strings.getClass()); // class [Ljava.lang.String;
```

### 8. Varargs com Arrays

```java
public class ArrayUtil {
    // Varargs é covariante
    public static void imprimir(Object... valores) {
        for (Object valor : valores) {
            System.out.println(valor);
        }
    }
    
    public static void main(String[] args) {
        imprimir("a", "b", "c"); // OK
        imprimir(1, 2, 3);       // OK
        
        String[] strings = {"x", "y", "z"};
        imprimir(strings); // OK: covariância
    }
}
```

### 9. Evite Arrays de Generics

```java
// ❌ Generic array
List<String>[] arrays = new ArrayList<String>[10]; // ERRO

// ✅ Solução 1: List de List
List<List<String>> listas = new ArrayList<>();
listas.add(new ArrayList<>());

// ✅ Solução 2: raw type (não recomendado)
@SuppressWarnings("unchecked")
List<String>[] arrays2 = new ArrayList[10];
arrays2[0] = new ArrayList<String>();
```

### 10. Type Safety com Generics

```java
// ❌ Arrays: não type-safe
public static void processar(Object[] array) {
    array[0] = 10; // Pode lançar ArrayStoreException
}

String[] strings = {"a", "b"};
// processar(strings); // ❌ Runtime: ArrayStoreException

// ✅ Generics: type-safe
public static <T> void processar(List<T> lista, T valor) {
    lista.set(0, valor); // Type-safe
}

List<String> strings2 = new ArrayList<>(Arrays.asList("a", "b"));
processar(strings2, "c"); // OK
// processar(strings2, 10); // ❌ ERRO de compilação
```

---

## Resumo

**Arrays covariantes**: array de **subtipo** é compatível com array de **supertipo**.

```java
String[] strings = new String[3];
Object[] objetos = strings; // ✅ OK: covariante
```

**Problema**: não é **type-safe** (verifica apenas em **runtime**).

```java
objetos[0] = "texto"; // OK
objetos[1] = 10;      // ❌ Runtime: ArrayStoreException
```

**ArrayStoreException**: atribuir tipo incompatível.

```java
Object[] objetos = new String[3];
objetos[0] = 10; // ❌ java.lang.ArrayStoreException: java.lang.Integer
```

**Generics**: invariantes (type-safe).

```java
// ❌ Generics: invariante
List<Object> lista = new ArrayList<String>(); // ERRO de compilação

// ✅ Wildcard
List<? extends Object> lista2 = new ArrayList<String>(); // OK
```

**Primitivos**: não são covariantes.

```java
int[] inteiros = {1, 2, 3};
// Object[] objetos = inteiros; // ❌ ERRO

// ✅ Wrappers
Integer[] integers = {1, 2, 3};
Object[] objetos = integers; // OK
```

**Reificação**: tipo de array conhecido em **runtime**.

```java
String[] strings = new String[3];
Object[] objetos = strings;
System.out.println(objetos.getClass()); // class [Ljava.lang.String;
```

**Arrays vs Generics**:

| Característica | Arrays | Generics |
|---------------|--------|----------|
| **Covariância** | Sim | Não (invariantes) |
| **Type safety** | Runtime | Compile-time |
| **Primitivos** | Sim | Não (use wrappers) |
| **Flexibilidade** | Tamanho fixo | Dinâmico |

**Quando usar arrays**:
- Performance (primitivos)
- Interoperabilidade (código legado)
- API nativa (JNI)

**Quando usar Generics**:
- Type safety
- Flexibilidade
- API moderna (Collections)

**Boas práticas**:

```java
// ❌ Arrays: não type-safe
public void processar(Object[] array) {
    array[0] = 10; // ArrayStoreException
}

// ✅ Generics: type-safe
public <T> void processar(List<T> lista) {
    // Type-safe em compile-time
}
```

**Verificação de tipo**:

```java
if (array.getClass().getComponentType().isInstance(valor)) {
    array[index] = valor; // Type-safe
}
```

**Arrays.copyOf**:

```java
String[] strings = {"a", "b", "c"};
Object[] objetos = Arrays.copyOf(strings, strings.length, Object[].class);
```

**Collections.toArray**:

```java
List<String> lista = Arrays.asList("a", "b", "c");
String[] strings = lista.toArray(new String[0]); // Type-safe
```

**Varargs**:

```java
public void imprimir(Object... valores) {
    // Varargs é covariante
}

String[] strings = {"a", "b"};
imprimir(strings); // OK
```

**Evite arrays de Generics**:

```java
// ❌ Generic array
List<String>[] arrays = new ArrayList<String>[10]; // ERRO

// ✅ List de List
List<List<String>> listas = new ArrayList<>();
```

**Null**:

```java
objetos[0] = null; // ✅ OK: null compatível
```

**Multidimensionais**:

```java
String[][] strings = new String[2][3];
Object[][] objetos = strings; // OK: covariante
objetos[0] = new Integer[3]; // ❌ Runtime: ArrayStoreException
```

**Regra de Ouro**: Arrays são **covariantes** mas **não type-safe** (verifica apenas em **runtime**, pode lançar **ArrayStoreException**). Prefira **Generics** (invariantes, type-safe em compile-time) quando possível. Use arrays para **primitivos**, **performance** ou **código legado**. Generics para **type safety**, **flexibilidade** e **API moderna**.
