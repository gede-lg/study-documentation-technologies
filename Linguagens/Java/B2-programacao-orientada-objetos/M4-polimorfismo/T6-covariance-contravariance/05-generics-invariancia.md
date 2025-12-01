# T6.05 - Generics e Invariância

## Introdução

**Generics são invariantes**: `List<String>` **NÃO é** subtipo de `List<Object>`, mesmo que `String` seja subtipo de `Object`.

```java
// ❌ Generics: invariantes
List<String> strings = new ArrayList<>();
List<Object> objetos = strings; // ERRO de compilação

// ✅ Arrays: covariantes (perigoso)
String[] arrayStrings = new String[3];
Object[] arrayObjetos = arrayStrings; // OK (mas não type-safe)
```

**Invariância**: tipo exato, sem substituição.

**Razão**: type safety em **compile-time** (evita `ClassCastException`).

**Alternativas**:
- **Wildcards**: `<?>`, `<? extends T>`, `<? super T>`
- **Métodos genéricos**: `<T>`

**Benefício**: erros detectados em **compile-time**, não runtime.

---

## Fundamentos

### 1. Generics São Invariantes

**Invariância**: tipo deve ser **exato**, sem substituição.

```java
List<String> strings = new ArrayList<>();
// List<Object> objetos = strings; // ❌ ERRO de compilação

// String é subtipo de Object, mas
// List<String> NÃO é subtipo de List<Object>
```

### 2. Por Que Invariância

**Evita ClassCastException**:

```java
// Suponha que Generics fossem covariantes

List<String> strings = new ArrayList<>();
List<Object> objetos = strings; // Hipotético

objetos.add(10); // Adicionaria Integer a List<String>

String s = strings.get(0); // ClassCastException: Integer → String
```

### 3. Type Safety em Compile-Time

**Generics**: erros em **compile-time**.

```java
List<String> strings = new ArrayList<>();
strings.add("texto"); // OK
// strings.add(10); // ❌ ERRO de compilação

String s = strings.get(0); // Type-safe (sem cast)
```

### 4. Wildcards para Flexibilidade

**Wildcard**: `<?>`, `<? extends T>`, `<? super T>`.

```java
// ✅ Wildcard: flexibilidade
List<? extends Object> objetos = new ArrayList<String>(); // OK

// Leitura OK, escrita restrita
Object obj = objetos.get(0); // OK
// objetos.add("texto"); // ❌ ERRO
```

### 5. Producer Extends

**Producer**: `<? extends T>` (leitura, covariante).

```java
// Producer: extends (leitura)
public static void imprimir(List<? extends Number> numeros) {
    for (Number n : numeros) {
        System.out.println(n);
    }
}

List<Integer> inteiros = Arrays.asList(1, 2, 3);
imprimir(inteiros); // OK: Integer extends Number

List<Double> doubles = Arrays.asList(1.5, 2.5, 3.5);
imprimir(doubles); // OK: Double extends Number
```

### 6. Consumer Super

**Consumer**: `<? super T>` (escrita, contravariante).

```java
// Consumer: super (escrita)
public static void adicionar(List<? super Integer> lista) {
    lista.add(10);
    lista.add(20);
}

List<Integer> inteiros = new ArrayList<>();
adicionar(inteiros); // OK

List<Number> numeros = new ArrayList<>();
adicionar(numeros); // OK: Number é supertipo de Integer

List<Object> objetos = new ArrayList<>();
adicionar(objetos); // OK: Object é supertipo de Integer
```

### 7. PECS (Producer Extends, Consumer Super)

**PECS**: regra mnemônica para wildcards.

```java
public class Pilha<E> {
    private List<E> elementos = new ArrayList<>();
    
    // Producer: extends (leitura)
    public void pushAll(Iterable<? extends E> src) {
        for (E e : src) {
            elementos.add(e);
        }
    }
    
    // Consumer: super (escrita)
    public void popAll(Collection<? super E> dst) {
        while (!elementos.isEmpty()) {
            dst.add(elementos.remove(elementos.size() - 1));
        }
    }
}

// Uso
Pilha<Number> pilha = new Pilha<>();

List<Integer> inteiros = Arrays.asList(1, 2, 3);
pilha.pushAll(inteiros); // Producer: Integer extends Number

List<Object> objetos = new ArrayList<>();
pilha.popAll(objetos); // Consumer: Object super Number
```

### 8. Unbounded Wildcard

**Unbounded**: `<?>` (tipo desconhecido).

```java
public static void imprimir(List<?> lista) {
    for (Object obj : lista) {
        System.out.println(obj);
    }
}

List<String> strings = Arrays.asList("a", "b");
imprimir(strings); // OK

List<Integer> inteiros = Arrays.asList(1, 2);
imprimir(inteiros); // OK
```

### 9. Métodos Genéricos

**Método genérico**: tipo inferido em chamada.

```java
public static <T> void adicionar(List<T> lista, T elemento) {
    lista.add(elemento);
}

List<String> strings = new ArrayList<>();
adicionar(strings, "texto"); // T = String
// adicionar(strings, 10); // ❌ ERRO de compilação
```

### 10. Type Erasure

**Type erasure**: tipos genéricos removidos em compile-time.

```java
List<String> strings = new ArrayList<>();
List<Integer> inteiros = new ArrayList<>();

// Runtime: ambos são List (sem tipo)
System.out.println(strings.getClass() == inteiros.getClass()); // true

// Generics só existem em compile-time
```

---

## Aplicabilidade

**Use invariância quando**:
- **Type safety** é crítico
- **Coleções mutáveis** (adicionar/remover)
- **API pública** (evitar erros de cliente)

**Use wildcards quando**:
- **Flexibilidade** (aceitar subtipos/supertipos)
- **Producer** (`<? extends T>`) para leitura
- **Consumer** (`<? super T>`) para escrita

**Use métodos genéricos quando**:
- **Tipo inferido** em chamada
- **Múltiplos tipos** relacionados

---

## Armadilhas

### 1. Tentar Covariância

```java
List<String> strings = new ArrayList<>();
// List<Object> objetos = strings; // ❌ ERRO de compilação
```

### 2. Wildcard Sem Escrita

```java
List<? extends Number> numeros = new ArrayList<Integer>();

// numeros.add(10); // ❌ ERRO
// numeros.add(10.5); // ❌ ERRO
// numeros.add(new Object()); // ❌ ERRO
```

### 3. Wildcard Sem Leitura Type-Safe

```java
List<? super Integer> lista = new ArrayList<Number>();

lista.add(10); // OK

// Integer i = lista.get(0); // ❌ ERRO
Object obj = lista.get(0); // OK: retorna Object
```

### 4. Confundir Arrays com Generics

```java
// Arrays: covariantes
String[] arrayStrings = new String[3];
Object[] arrayObjetos = arrayStrings; // OK

// Generics: invariantes
List<String> strings = new ArrayList<>();
// List<Object> objetos = strings; // ❌ ERRO
```

### 5. Type Erasure

```java
List<String> strings = new ArrayList<>();
List<Integer> inteiros = new ArrayList<>();

// Runtime: mesmo tipo
System.out.println(strings.getClass() == inteiros.getClass()); // true

// Não pode diferenciar em runtime
// if (lista instanceof List<String>) { } // ❌ ERRO
```

### 6. Raw Types

```java
// ❌ Raw type (sem generics)
List lista = new ArrayList(); // Warning: raw type
lista.add("texto");
lista.add(10);

String s = (String) lista.get(1); // ClassCastException
```

### 7. Generic Array

```java
// ❌ Generic array
List<String>[] arrays = new ArrayList<String>[10]; // ERRO

// ✅ Solução: List de List
List<List<String>> listas = new ArrayList<>();
```

---

## Boas Práticas

### 1. Prefira Generics a Raw Types

```java
// ❌ Raw type
List lista = new ArrayList();
lista.add("texto");
String s = (String) lista.get(0); // Cast necessário

// ✅ Generics
List<String> strings = new ArrayList<>();
strings.add("texto");
String s2 = strings.get(0); // Sem cast
```

### 2. Use PECS

```java
// Producer: extends (leitura)
public void adicionar(Collection<? extends E> src) {
    for (E e : src) {
        this.add(e);
    }
}

// Consumer: super (escrita)
public void remover(Collection<? super E> dst) {
    while (!this.isEmpty()) {
        dst.add(this.remove());
    }
}
```

### 3. Métodos Genéricos

```java
// ✅ Método genérico
public static <T> void copiar(List<T> origem, List<T> destino) {
    destino.addAll(origem);
}

List<String> strings = Arrays.asList("a", "b");
List<String> copia = new ArrayList<>();
copiar(strings, copia); // T = String
```

### 4. Bounded Type Parameters

```java
// ✅ Bounded: aceita apenas subtipos de Number
public static <T extends Number> double somar(List<T> numeros) {
    double soma = 0;
    for (T n : numeros) {
        soma += n.doubleValue();
    }
    return soma;
}

List<Integer> inteiros = Arrays.asList(1, 2, 3);
System.out.println(somar(inteiros)); // 6.0

List<Double> doubles = Arrays.asList(1.5, 2.5);
System.out.println(somar(doubles)); // 4.0

// List<String> strings = Arrays.asList("a", "b");
// somar(strings); // ❌ ERRO: String não é Number
```

### 5. Multiple Bounds

```java
// ✅ Multiple bounds
public static <T extends Number & Comparable<T>> T maior(List<T> lista) {
    T max = lista.get(0);
    for (T elemento : lista) {
        if (elemento.compareTo(max) > 0) {
            max = elemento;
        }
    }
    return max;
}

List<Integer> inteiros = Arrays.asList(5, 1, 3);
System.out.println(maior(inteiros)); // 5
```

### 6. Wildcards em Retorno

```java
// ❌ Evite wildcard em retorno
public List<?> buscarTodos() {
    return new ArrayList<String>();
}

// Cliente não pode adicionar elementos
List<?> resultado = buscarTodos();
// resultado.add("texto"); // ❌ ERRO

// ✅ Use tipo específico ou método genérico
public <T> List<T> buscarTodos(Class<T> tipo) {
    return new ArrayList<>();
}
```

### 7. Collections.copy

```java
import java.util.*;

public class Exemplo {
    public static void main(String[] args) {
        List<Integer> origem = Arrays.asList(1, 2, 3);
        List<Number> destino = new ArrayList<>(Arrays.asList(0, 0, 0));
        
        // Collections.copy usa PECS
        // public static <T> void copy(List<? super T> dest, List<? extends T> src)
        Collections.copy(destino, origem); // OK
        
        System.out.println(destino); // [1, 2, 3]
    }
}
```

### 8. Comparator com Wildcard

```java
import java.util.*;

public class Exemplo {
    // Producer: extends
    public static <T> void ordenar(List<T> lista, 
                                    Comparator<? super T> comparador) {
        lista.sort(comparador);
    }
    
    public static void main(String[] args) {
        List<Integer> inteiros = Arrays.asList(5, 1, 3);
        
        // Comparator<Number> funciona para Integer
        Comparator<Number> comparador = Comparator.comparingDouble(Number::doubleValue);
        
        ordenar(inteiros, comparador); // OK
        System.out.println(inteiros); // [1, 3, 5]
    }
}
```

### 9. Stream com Generics

```java
import java.util.*;
import java.util.stream.*;

public class Exemplo {
    public static void main(String[] args) {
        List<Integer> inteiros = Arrays.asList(1, 2, 3);
        
        // Stream<Integer> → Stream<Number>
        Stream<Number> numeros = inteiros.stream()
            .map(i -> (Number) i);
        
        List<Number> resultado = numeros.collect(Collectors.toList());
        System.out.println(resultado); // [1, 2, 3]
    }
}
```

### 10. Type Witness

```java
import java.util.*;

public class Exemplo {
    public static <T> List<T> criar() {
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        // ❌ Inferência pode falhar
        // List<String> strings = criar(); // OK

        // ✅ Type witness explícito
        List<String> strings = Exemplo.<String>criar();
        strings.add("texto");
    }
}
```

---

## Resumo

**Generics são invariantes**: `List<String>` **NÃO é** subtipo de `List<Object>`.

```java
List<String> strings = new ArrayList<>();
// List<Object> objetos = strings; // ❌ ERRO
```

**Razão**: evita `ClassCastException` em runtime.

```java
// Se Generics fossem covariantes:
List<Object> objetos = strings; // Hipotético
objetos.add(10); // Adicionaria Integer a List<String>
String s = strings.get(0); // ClassCastException
```

**Type safety**: compile-time.

```java
List<String> strings = new ArrayList<>();
strings.add("texto"); // OK
// strings.add(10); // ❌ ERRO de compilação
String s = strings.get(0); // Sem cast
```

**Wildcards**: flexibilidade.

**Producer Extends** (leitura):
```java
public void imprimir(List<? extends Number> numeros) {
    for (Number n : numeros) {
        System.out.println(n);
    }
}

List<Integer> inteiros = Arrays.asList(1, 2, 3);
imprimir(inteiros); // OK
```

**Consumer Super** (escrita):
```java
public void adicionar(List<? super Integer> lista) {
    lista.add(10);
}

List<Number> numeros = new ArrayList<>();
adicionar(numeros); // OK
```

**PECS** (Producer Extends, Consumer Super):
```java
// Producer: extends (leitura)
public void pushAll(Iterable<? extends E> src) { }

// Consumer: super (escrita)
public void popAll(Collection<? super E> dst) { }
```

**Unbounded Wildcard**:
```java
public void imprimir(List<?> lista) {
    for (Object obj : lista) {
        System.out.println(obj);
    }
}
```

**Métodos genéricos**:
```java
public static <T> void adicionar(List<T> lista, T elemento) {
    lista.add(elemento);
}

List<String> strings = new ArrayList<>();
adicionar(strings, "texto"); // T = String
```

**Bounded type parameters**:
```java
public static <T extends Number> double somar(List<T> numeros) {
    double soma = 0;
    for (T n : numeros) {
        soma += n.doubleValue();
    }
    return soma;
}
```

**Multiple bounds**:
```java
public static <T extends Number & Comparable<T>> T maior(List<T> lista) {
    // T deve ser Number E Comparable
}
```

**Type erasure**: tipos removidos em compile-time.

```java
List<String> strings = new ArrayList<>();
List<Integer> inteiros = new ArrayList<>();

System.out.println(strings.getClass() == inteiros.getClass()); // true
```

**Arrays vs Generics**:

| Característica | Arrays | Generics |
|---------------|--------|----------|
| **Variância** | Covariante | Invariante |
| **Type safety** | Runtime | Compile-time |
| **Exceção** | ArrayStoreException | Erro de compilação |
| **Type erasure** | Não (reificado) | Sim |

**Raw types** (evite):
```java
// ❌ Raw type
List lista = new ArrayList(); // Warning

// ✅ Generics
List<String> strings = new ArrayList<>();
```

**Generic array** (não suportado):
```java
// ❌ Generic array
List<String>[] arrays = new ArrayList<String>[10]; // ERRO

// ✅ List de List
List<List<String>> listas = new ArrayList<>();
```

**Collections.copy** (PECS):
```java
public static <T> void copy(List<? super T> dest, List<? extends T> src)

List<Integer> origem = Arrays.asList(1, 2, 3);
List<Number> destino = new ArrayList<>(Arrays.asList(0, 0, 0));
Collections.copy(destino, origem); // OK
```

**Comparator** (Consumer Super):
```java
public static <T> void sort(List<T> list, Comparator<? super T> c)

List<Integer> inteiros = Arrays.asList(5, 1, 3);
Comparator<Number> comparador = ...;
Collections.sort(inteiros, comparador); // OK
```

**Quando usar**:

- **Invariância**: type safety, coleções mutáveis
- **`<? extends T>`**: Producer (leitura)
- **`<? super T>`**: Consumer (escrita)
- **Métodos genéricos**: tipo inferido

**Evite**:
- Raw types (sem generics)
- Wildcard em retorno
- Generic array
- Covariância de Generics

**Regra de Ouro**: Generics são **invariantes** (tipo **exato**) para garantir **type safety** em **compile-time**. Arrays são **covariantes** mas **não type-safe** (runtime). Use **wildcards** para flexibilidade: `<? extends T>` para **Producer** (leitura), `<? super T>` para **Consumer** (escrita). Aplique **PECS** em APIs. Evite **raw types** e prefira **Generics** a arrays para **type safety**.
