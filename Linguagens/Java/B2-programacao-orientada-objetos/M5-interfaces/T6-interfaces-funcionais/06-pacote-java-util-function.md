# T6.06 - Pacote java.util.function

## Introdução

**java.util.function**: pacote com interfaces funcionais padrão (Java 8+).

```java
import java.util.function.*;

// Predicate: recebe valor, retorna boolean
Predicate<String> naoVazio = s -> !s.isEmpty();
boolean resultado = naoVazio.test("abc"); // true

// Function: recebe valor, retorna outro
Function<String, Integer> tamanho = String::length;
int tam = tamanho.apply("abc"); // 3

// Consumer: recebe valor, não retorna
Consumer<String> imprimir = System.out::println;
imprimir.accept("Olá"); // Olá

// Supplier: não recebe, retorna valor
Supplier<Double> aleatorio = Math::random;
double numero = aleatorio.get(); // 0.xxx
```

**Principais interfaces**: Predicate, Function, Consumer, Supplier, UnaryOperator, BinaryOperator.

---

## Fundamentos

### 1. Predicate\<T\>

**Predicate**: recebe T, retorna boolean.

```java
@FunctionalInterface
public interface Predicate<T> {
    boolean test(T t);
}

// Exemplo
Predicate<String> naoVazio = s -> !s.isEmpty();
Predicate<Integer> positivo = n -> n > 0;

boolean r1 = naoVazio.test("abc"); // true
boolean r2 = positivo.test(5); // true

// Composição
Predicate<String> tamanhoMinimo = s -> s.length() >= 3;
Predicate<String> valido = naoVazio.and(tamanhoMinimo);

boolean r3 = valido.test("ab"); // false
boolean r4 = valido.test("abc"); // true
```

### 2. Function\<T, R\>

**Function**: recebe T, retorna R.

```java
@FunctionalInterface
public interface Function<T, R> {
    R apply(T t);
}

// Exemplo
Function<String, Integer> tamanho = String::length;
Function<Integer, String> toString = String::valueOf;

int tam = tamanho.apply("abc"); // 3
String str = toString.apply(42); // "42"

// Composição
Function<String, String> maiusculas = String::toUpperCase;
Function<String, Integer> tamanhoMaiusculas = maiusculas.andThen(String::length);

int tam2 = tamanhoMaiusculas.apply("abc"); // 3
```

### 3. Consumer\<T\>

**Consumer**: recebe T, não retorna (void).

```java
@FunctionalInterface
public interface Consumer<T> {
    void accept(T t);
}

// Exemplo
Consumer<String> imprimir = System.out::println;
Consumer<String> log = s -> System.out.println("LOG: " + s);

imprimir.accept("Olá"); // Olá
log.accept("Mensagem"); // LOG: Mensagem

// Composição
Consumer<String> duplicado = imprimir.andThen(log);
duplicado.accept("Teste");
// Teste
// LOG: Teste
```

### 4. Supplier\<T\>

**Supplier**: não recebe, retorna T.

```java
@FunctionalInterface
public interface Supplier<T> {
    T get();
}

// Exemplo
Supplier<Double> aleatorio = Math::random;
Supplier<String> mensagem = () -> "Olá";

double num = aleatorio.get(); // 0.xxx
String msg = mensagem.get(); // Olá

// Lazy evaluation
Supplier<String> pesado = () -> {
    // Computação pesada
    return "Resultado";
};

// Só executa quando chamar get()
String resultado = pesado.get();
```

### 5. UnaryOperator\<T\>

**UnaryOperator**: Function\<T, T\> (mesmo tipo entrada/saída).

```java
@FunctionalInterface
public interface UnaryOperator<T> extends Function<T, T> {
}

// Exemplo
UnaryOperator<String> maiusculas = String::toUpperCase;
UnaryOperator<Integer> dobro = n -> n * 2;

String s = maiusculas.apply("abc"); // ABC
int n = dobro.apply(5); // 10

// List.replaceAll()
List<String> lista = new ArrayList<>(Arrays.asList("a", "b", "c"));
lista.replaceAll(String::toUpperCase);
// [A, B, C]
```

### 6. BinaryOperator\<T\>

**BinaryOperator**: BiFunction\<T, T, T\> (dois valores mesmo tipo, retorna mesmo tipo).

```java
@FunctionalInterface
public interface BinaryOperator<T> extends BiFunction<T, T, T> {
}

// Exemplo
BinaryOperator<Integer> soma = (a, b) -> a + b;
BinaryOperator<String> concat = (a, b) -> a + b;

int r1 = soma.apply(5, 3); // 8
String r2 = concat.apply("Olá", " Mundo"); // Olá Mundo

// Stream.reduce()
List<Integer> numeros = Arrays.asList(1, 2, 3, 4, 5);
int total = numeros.stream().reduce(0, Integer::sum); // 15
```

### 7. BiFunction\<T, U, R\>

**BiFunction**: recebe T e U, retorna R.

```java
@FunctionalInterface
public interface BiFunction<T, U, R> {
    R apply(T t, U u);
}

// Exemplo
BiFunction<String, Integer, String> repetir = (s, n) -> s.repeat(n);
BiFunction<Integer, Integer, String> somar = (a, b) -> String.valueOf(a + b);

String r1 = repetir.apply("A", 3); // AAA
String r2 = somar.apply(5, 3); // 8

// Map.compute()
Map<String, Integer> mapa = new HashMap<>();
mapa.put("A", 1);
mapa.compute("A", (k, v) -> v == null ? 1 : v + 1); // 2
```

### 8. BiConsumer\<T, U\>

**BiConsumer**: recebe T e U, não retorna.

```java
@FunctionalInterface
public interface BiConsumer<T, U> {
    void accept(T t, U u);
}

// Exemplo
BiConsumer<String, Integer> imprimir = (s, n) -> 
    System.out.println(s + ": " + n);

imprimir.accept("Valor", 42); // Valor: 42

// Map.forEach()
Map<String, Integer> mapa = Map.of("A", 1, "B", 2);
mapa.forEach((k, v) -> System.out.println(k + " = " + v));
// A = 1
// B = 2
```

### 9. BiPredicate\<T, U\>

**BiPredicate**: recebe T e U, retorna boolean.

```java
@FunctionalInterface
public interface BiPredicate<T, U> {
    boolean test(T t, U u);
}

// Exemplo
BiPredicate<String, Integer> tamanhoIgual = (s, n) -> s.length() == n;
BiPredicate<Integer, Integer> maior = (a, b) -> a > b;

boolean r1 = tamanhoIgual.test("abc", 3); // true
boolean r2 = maior.test(5, 3); // true
```

### 10. Interfaces Primitivas

**Interfaces primitivas**: evitam boxing/unboxing.

```java
// IntPredicate: recebe int, retorna boolean
IntPredicate positivo = n -> n > 0;
boolean r1 = positivo.test(5); // true

// IntFunction<R>: recebe int, retorna R
IntFunction<String> toString = String::valueOf;
String s = toString.apply(42); // "42"

// IntConsumer: recebe int, não retorna
IntConsumer imprimir = System.out::println;
imprimir.accept(42); // 42

// IntSupplier: não recebe, retorna int
IntSupplier aleatorio = () -> (int) (Math.random() * 100);
int num = aleatorio.getAsInt(); // 0-99

// IntUnaryOperator: recebe int, retorna int
IntUnaryOperator dobro = n -> n * 2;
int r2 = dobro.applyAsInt(5); // 10

// IntBinaryOperator: recebe 2 ints, retorna int
IntBinaryOperator soma = (a, b) -> a + b;
int r3 = soma.applyAsInt(5, 3); // 8
```

---

## Aplicabilidade

**java.util.function**:
- **Streams API** (map, filter, reduce)
- **Optional** (map, filter, ifPresent)
- **Collections** (forEach, removeIf, replaceAll)
- **APIs customizadas**

**Benefícios**:
- Interfaces padrão (não precisa criar)
- Métodos de composição (and, or, andThen)
- Otimizações primitivas

---

## Armadilhas

### 1. Confundir Interfaces

```java
// ⚠️ Confusão: Function retorna valor
Function<String, Integer> f = String::length;
int tam = f.apply("abc"); // 3

// Consumer não retorna
Consumer<String> c = System.out::println;
c.accept("abc"); // void

// Supplier não recebe
Supplier<String> s = () -> "abc";
String str = s.get(); // "abc"
```

### 2. Boxing/Unboxing Desnecessário

```java
// ❌ Boxing/unboxing
Function<Integer, Integer> dobro = n -> n * 2;
int r = dobro.apply(5); // Boxing: 5 -> Integer, Unboxing: Integer -> int

// ✅ Interface primitiva
IntUnaryOperator dobro2 = n -> n * 2;
int r2 = dobro2.applyAsInt(5); // Sem boxing
```

### 3. Checked Exceptions

```java
// ❌ ERRO: Function não pode lançar checked
// Function<String, String> ler = caminho -> {
//     return Files.readString(Path.of(caminho)); // ERRO: IOException
// };

// ✅ Wrapper para unchecked
Function<String, String> ler = caminho -> {
    try {
        return Files.readString(Path.of(caminho));
    } catch (IOException e) {
        throw new UncheckedIOException(e);
    }
};
```

### 4. Efeitos Colaterais em Predicate/Function

```java
// ⚠️ Evitar efeitos colaterais
int[] contador = {0};
Predicate<String> comEfeito = s -> {
    contador[0]++; // Efeito colateral
    return !s.isEmpty();
};

// ✅ Sem efeitos colaterais
Predicate<String> puro = s -> !s.isEmpty();
```

### 5. Null em Primitivas

```java
// ❌ ERRO: primitivas não aceitam null
// IntPredicate p = n -> n == null; // ERRO

// ✅ Usar Predicate<Integer> para nullable
Predicate<Integer> p = n -> n != null && n > 0;
```

### 6. Confundir andThen e compose

```java
Function<Integer, Integer> dobro = n -> n * 2;
Function<Integer, Integer> quadrado = n -> n * n;

// andThen: depois
Function<Integer, Integer> f1 = dobro.andThen(quadrado);
int r1 = f1.apply(3); // (3 * 2)² = 36

// compose: antes
Function<Integer, Integer> f2 = dobro.compose(quadrado);
int r2 = f2.apply(3); // (3²) * 2 = 18
```

### 7. Predicate.isEqual()

```java
// Predicate.isEqual()
Predicate<String> isAbc = Predicate.isEqual("abc");
boolean r1 = isAbc.test("abc"); // true
boolean r2 = isAbc.test("def"); // false

// Null-safe
Predicate<String> isNull = Predicate.isEqual(null);
boolean r3 = isNull.test(null); // true
```

---

## Boas Práticas

### 1. Usar Interfaces Padrão

```java
// ✅ Usar java.util.function
Predicate<String> naoVazio = s -> !s.isEmpty();

// ⚠️ Evitar criar interface própria
// @FunctionalInterface
// public interface MeuPredicado {
//     boolean testar(String s);
// }
```

### 2. Interfaces Primitivas

```java
// ✅ Primitivas para performance
IntStream.range(0, 1000000)
    .filter(n -> n % 2 == 0)
    .sum();

// ❌ Boxing desnecessário
Stream.iterate(0, n -> n + 1)
    .limit(1000000)
    .filter(n -> n % 2 == 0)
    .mapToInt(Integer::intValue)
    .sum();
```

### 3. Composição de Predicate

```java
// ✅ Composição com and/or
Predicate<String> naoVazio = s -> !s.isEmpty();
Predicate<String> tamanhoMin = s -> s.length() >= 3;
Predicate<String> tamanhoMax = s -> s.length() <= 10;

Predicate<String> valido = naoVazio
    .and(tamanhoMin)
    .and(tamanhoMax);

boolean r = valido.test("abc"); // true
```

### 4. Composição de Function

```java
// ✅ Composição com andThen
Function<String, String> trim = String::trim;
Function<String, String> maiusculas = String::toUpperCase;
Function<String, Integer> tamanho = String::length;

Function<String, Integer> processar = trim
    .andThen(maiusculas)
    .andThen(tamanho);

int tam = processar.apply("  abc  "); // 3
```

### 5. Predicate.not() (Java 11+)

```java
// ✅ Predicate.not() para negar
List<String> lista = Arrays.asList("", "abc", "", "def");

lista.stream()
    .filter(Predicate.not(String::isEmpty))
    .forEach(System.out::println);
// abc
// def

// Antes do Java 11
lista.stream()
    .filter(s -> !s.isEmpty())
    .forEach(System.out::println);
```

### 6. Function.identity()

```java
// ✅ Function.identity() para retornar mesmo valor
Map<String, String> mapa = List.of("a", "b", "c")
    .stream()
    .collect(Collectors.toMap(
        Function.identity(), // k -> k
        String::toUpperCase
    ));
// {a=A, b=B, c=C}
```

### 7. Supplier para Lazy Evaluation

```java
// ✅ Supplier para evitar computação desnecessária
public String obterValor(boolean condicao, Supplier<String> supplier) {
    if (condicao) {
        return supplier.get(); // Só executa se necessário
    }
    return "Padrão";
}

// Uso
String resultado = obterValor(true, () -> {
    // Computação pesada
    return "Resultado pesado";
});
```

### 8. BiFunction em Maps

```java
// ✅ BiFunction em Map.merge()
Map<String, Integer> mapa = new HashMap<>();
mapa.put("A", 1);

mapa.merge("A", 5, Integer::sum); // 6
mapa.merge("B", 10, Integer::sum); // 10

System.out.println(mapa);
// {A=6, B=10}
```

### 9. Method Reference

```java
// ✅ Method reference
Predicate<String> naoVazio = ((Predicate<String>) String::isEmpty).negate();

Consumer<String> imprimir = System.out::println;

Function<String, Integer> tamanho = String::length;

Supplier<Double> aleatorio = Math::random;
```

### 10. Streams com java.util.function

```java
// ✅ Streams com interfaces padrão
List<String> nomes = Arrays.asList("João", "Maria", "Ana", "Pedro");

List<String> resultado = nomes.stream()
    .filter(((Predicate<String>) String::isEmpty).negate()) // Predicate
    .map(String::toUpperCase) // Function
    .peek(System.out::println) // Consumer
    .collect(Collectors.toList());
```

---

## Resumo

**Principais interfaces**:

| Interface | Parâmetros | Retorno | Método |
|-----------|------------|---------|--------|
| **Predicate\<T\>** | T | boolean | test(T) |
| **Function\<T, R\>** | T | R | apply(T) |
| **Consumer\<T\>** | T | void | accept(T) |
| **Supplier\<T\>** | - | T | get() |
| **UnaryOperator\<T\>** | T | T | apply(T) |
| **BinaryOperator\<T\>** | T, T | T | apply(T, T) |
| **BiFunction\<T, U, R\>** | T, U | R | apply(T, U) |
| **BiConsumer\<T, U\>** | T, U | void | accept(T, U) |
| **BiPredicate\<T, U\>** | T, U | boolean | test(T, U) |

**Predicate**:
```java
Predicate<String> naoVazio = s -> !s.isEmpty();
boolean r = naoVazio.test("abc"); // true
```

**Function**:
```java
Function<String, Integer> tamanho = String::length;
int tam = tamanho.apply("abc"); // 3
```

**Consumer**:
```java
Consumer<String> imprimir = System.out::println;
imprimir.accept("Olá"); // Olá
```

**Supplier**:
```java
Supplier<Double> aleatorio = Math::random;
double num = aleatorio.get(); // 0.xxx
```

**UnaryOperator**:
```java
UnaryOperator<String> maiusculas = String::toUpperCase;
String s = maiusculas.apply("abc"); // ABC
```

**BinaryOperator**:
```java
BinaryOperator<Integer> soma = Integer::sum;
int r = soma.apply(5, 3); // 8
```

**Interfaces primitivas**: Int, Long, Double (evitam boxing).
```java
IntPredicate positivo = n -> n > 0;
IntFunction<String> toString = String::valueOf;
IntConsumer imprimir = System.out::println;
IntSupplier aleatorio = () -> (int) (Math.random() * 100);
IntUnaryOperator dobro = n -> n * 2;
IntBinaryOperator soma = (a, b) -> a + b;
```

**Composição**:
```java
// Predicate: and, or, negate
Predicate<String> valido = naoVazio.and(tamanhoMin);

// Function: andThen, compose
Function<String, Integer> f = trim.andThen(String::length);
```

**Boas práticas**:
- Usar interfaces padrão (não criar próprias)
- Interfaces primitivas para performance
- Composição de Predicate (and/or)
- Composição de Function (andThen)
- Predicate.not() (Java 11+)
- Function.identity()
- Supplier para lazy evaluation
- BiFunction em Maps
- Method reference
- Streams com java.util.function

**Armadilhas**:
- ❌ Confundir interfaces
- ❌ Boxing/unboxing desnecessário
- ❌ Checked exceptions
- ❌ Efeitos colaterais
- ❌ Null em primitivas
- ❌ Confundir andThen e compose
- ❌ Predicate.isEqual()

**Regra de Ouro**: Use **java.util.function** ao invés de criar interfaces funcionais próprias. **Predicate** para testes (boolean). **Function** para transformações. **Consumer** para ações sem retorno. **Supplier** para fornecimento sem parâmetros. **UnaryOperator** para operações no mesmo tipo. **BinaryOperator** para operações binárias. Use **interfaces primitivas** (Int, Long, Double) para evitar boxing. **Composição** com and, or, andThen, compose. **java.util.function** é a base para **Streams API**, **Optional**, e **Collections**.
