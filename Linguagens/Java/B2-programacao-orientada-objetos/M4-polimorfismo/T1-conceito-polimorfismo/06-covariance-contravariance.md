# T1.06 - Covariance e Contravariance

## Introdução

**Variância**: regras de como **subtipos** se relacionam com **tipos genéricos** ou **arrays**.

**Covariância**: permite usar **subtipo mais específico**.
- **Tipo de retorno**: método sobrescrito pode retornar subtipo
- **Arrays**: array de subtipo pode ser atribuído a array de supertipo (⚠️ runtime exception)

**Contravariância**: permite usar **supertipo mais genérico**.
- **Parâmetros de método**: geralmente invariantes em Java

**Invariância**: tipo deve ser **exatamente igual**.
- **Generics**: `List<String>` **não é** subtipo de `List<Object>`

```java
// Covariância de tipo de retorno
public class Animal {
    public Animal criar() {
        return new Animal();
    }
}

public class Cachorro extends Animal {
    @Override
    public Cachorro criar() { // Retorna subtipo (covariante)
        return new Cachorro();
    }
}

// Arrays são covariantes (⚠️ cuidado)
Animal[] animais = new Cachorro[10]; // ✅ Compilação OK
animais[0] = new Gato(); // ❌ Runtime: ArrayStoreException

// Generics são invariantes
List<Animal> lista = new ArrayList<Cachorro>(); // ❌ Erro de compilação
```

---

## Fundamentos

### 1. Covariância de Tipo de Retorno (Java 5+)

**Método sobrescrito** pode retornar **subtipo** do tipo original.

```java
public class Veiculo {
    public Veiculo clonar() {
        return new Veiculo();
    }
}

public class Carro extends Veiculo {
    @Override
    public Carro clonar() { // Carro é subtipo de Veiculo
        return new Carro();
    }
}

// Uso
Veiculo v = new Carro();
Veiculo veiculo = v.clonar(); // Retorna Carro, mas tipo da referência é Veiculo

Carro c = new Carro();
Carro carro = c.clonar(); // Retorna Carro, sem cast
```

### 2. Covariância em Arrays

**Arrays Java são covariantes** (design flaw).

```java
// ✅ Compilação OK
Object[] objetos = new String[10];
Animal[] animais = new Cachorro[10];

// ❌ Runtime: ArrayStoreException
objetos[0] = 42; // Tenta colocar Integer em String[]
animais[0] = new Gato(); // Tenta colocar Gato em Cachorro[]

// Por que?
// String[] é subtipo de Object[]
// Mas em runtime, array é String[]
// Integer não é String
```

### 3. Invariância em Generics

**Generics Java são invariantes** (type safety).

```java
// ❌ Erro de compilação
List<Object> lista = new ArrayList<String>();
List<Animal> animais = new ArrayList<Cachorro>();

// Por que?
// Se fosse permitido:
List<Animal> animais = new ArrayList<Cachorro>();
animais.add(new Gato()); // Gato em ArrayList<Cachorro>!

// Generics impedem isso em compile-time
```

### 4. Wildcards - Upper Bounded (Covariância)

**`? extends T`**: aceita **T ou qualquer subtipo** (covariante).

```java
// ✅ Leitura: covariante
public void processar(List<? extends Animal> animais) {
    for (Animal a : animais) { // ✅ Ler como Animal
        a.som();
    }
    
    // ❌ Escrita não permitida (exceto null)
    animais.add(new Cachorro()); // Erro de compilação
    animais.add(new Gato());     // Erro de compilação
    animais.add(null);           // ✅ Único permitido
}

// Uso
processar(new ArrayList<Animal>());    // ✅
processar(new ArrayList<Cachorro>());  // ✅
processar(new ArrayList<Gato>());      // ✅
```

### 5. Wildcards - Lower Bounded (Contravariância)

**`? super T`**: aceita **T ou qualquer supertipo** (contravariante).

```java
// ✅ Escrita: contravariante
public void adicionar(List<? super Cachorro> lista) {
    lista.add(new Cachorro());    // ✅ Adicionar Cachorro
    lista.add(new Labrador());    // ✅ Adicionar subtipo de Cachorro
    
    // ❌ Leitura: retorna Object
    Object obj = lista.get(0);    // ✅ Só Object garantido
    Cachorro c = lista.get(0);    // ❌ Erro de compilação
}

// Uso
adicionar(new ArrayList<Cachorro>()); // ✅
adicionar(new ArrayList<Animal>());   // ✅
adicionar(new ArrayList<Object>());   // ✅
adicionar(new ArrayList<Gato>());     // ❌ Erro: Gato não é supertipo
```

### 6. PECS (Producer Extends, Consumer Super)

**Regra mnemônica** para escolher wildcard.

```java
// Producer Extends (produz/retorna elementos)
public void copiar(
    List<? extends Animal> origem,  // Producer: lê de origem
    List<? super Animal> destino    // Consumer: escreve em destino
) {
    for (Animal a : origem) {
        destino.add(a);
    }
}

// Uso
List<Cachorro> cachorros = Arrays.asList(new Cachorro(), new Cachorro());
List<Animal> animais = new ArrayList<>();

copiar(cachorros, animais); // ✅ origem extends, destino super
```

### 7. Unbounded Wildcard

**`<?>`**: aceita **qualquer tipo** (não sabe qual).

```java
public void imprimir(List<?> lista) {
    for (Object obj : lista) { // ✅ Ler como Object
        System.out.println(obj);
    }
    
    // ❌ Não pode adicionar (exceto null)
    lista.add(new Object()); // Erro de compilação
    lista.add(null);         // ✅
}

// Uso
imprimir(new ArrayList<String>());  // ✅
imprimir(new ArrayList<Integer>()); // ✅
imprimir(new ArrayList<Cachorro>()); // ✅
```

### 8. Covariância em Streams

```java
List<Cachorro> cachorros = Arrays.asList(new Cachorro(), new Cachorro());

// ✅ Stream é covariante
Stream<Animal> animais = cachorros.stream()
    .map(c -> (Animal) c); // Cast explícito

// ✅ Método aceita Stream<? extends Animal>
public void processar(Stream<? extends Animal> stream) {
    stream.forEach(Animal::som);
}

processar(cachorros.stream()); // ✅
```

### 9. Método Genérico vs Wildcard

```java
// Método genérico: captura tipo
public <T extends Animal> void processar1(List<T> lista) {
    T primeiro = lista.get(0); // ✅ Tipo conhecido
}

// Wildcard: tipo desconhecido
public void processar2(List<? extends Animal> lista) {
    Animal primeiro = lista.get(0); // ✅ Só Animal garantido
}

// Método genérico permite retorno
public <T extends Animal> T obterPrimeiro(List<T> lista) {
    return lista.get(0);
}

Cachorro c = obterPrimeiro(new ArrayList<Cachorro>()); // ✅ Sem cast
```

### 10. Variance em Comparator

```java
// Comparator é contravariante em segundo tipo
Comparator<Animal> compAnimal = Comparator.comparing(Animal::getNome);

// ✅ Pode usar Comparator<Animal> para comparar Cachorro
List<Cachorro> cachorros = Arrays.asList(new Cachorro(), new Cachorro());
cachorros.sort(compAnimal); // ✅ Comparator<Animal> para List<Cachorro>

// Collections.sort
public static <T> void sort(List<T> list, Comparator<? super T> c) {
    // Comparator<? super T> = contravariante
}
```

---

## Aplicabilidade

**Use covariância quando**:
- **Ler elementos**: `List<? extends T>`
- **Tipo de retorno**: retornar subtipo
- **Producer**: gerar elementos de um tipo

**Use contravariância quando**:
- **Escrever elementos**: `List<? super T>`
- **Consumer**: consumir elementos de um tipo
- **Comparator**: comparar objetos

**Exemplos**:
```java
// Producer Extends
public void addAll(Collection<? extends E> c) {
    for (E e : c) {
        add(e);
    }
}

// Consumer Super
public void removeAll(Collection<? super E> c) {
    c.add(this.elemento);
}
```

---

## Armadilhas

### 1. ArrayStoreException com Arrays Covariantes

```java
Animal[] animais = new Cachorro[10]; // ✅ Compilação OK
animais[0] = new Gato(); // ❌ Runtime: ArrayStoreException

// Problema: verificação em runtime, não compile-time
```

### 2. Generics Invariantes

```java
// ❌ Erro: generics são invariantes
List<Animal> lista = new ArrayList<Cachorro>();

// ✅ Solução: wildcard
List<? extends Animal> lista = new ArrayList<Cachorro>();
```

### 3. Não Adicionar em Producer Extends

```java
List<? extends Animal> lista = new ArrayList<Cachorro>();

// ❌ Não pode adicionar (exceto null)
lista.add(new Cachorro()); // Erro
lista.add(new Gato());     // Erro

// Por que? Lista pode ser ArrayList<Cachorro>
// Se adicionar Gato, quebraria type safety
```

### 4. Leitura de Consumer Super Retorna Object

```java
List<? super Cachorro> lista = new ArrayList<Animal>();

// ❌ Leitura retorna Object
Cachorro c = lista.get(0); // Erro

// ✅ Cast necessário
Object obj = lista.get(0);
if (obj instanceof Cachorro cachorro) {
    // Usar cachorro
}
```

### 5. Unbounded Wildcard Não Permite Adição

```java
List<?> lista = new ArrayList<String>();

// ❌ Não pode adicionar (tipo desconhecido)
lista.add("Java"); // Erro
lista.add(42);     // Erro
lista.add(null);   // ✅ Único permitido
```

### 6. Confundir Extends com Super

```java
// ❌ Errado: tenta escrever em extends
public void adicionar(List<? extends Animal> lista) {
    lista.add(new Cachorro()); // Erro
}

// ✅ Correto: escrever em super
public void adicionar(List<? super Animal> lista) {
    lista.add(new Cachorro()); // OK
}
```

---

## Boas Práticas

### 1. PECS (Producer Extends, Consumer Super)

```java
// Producer: lê elementos → extends
public static <T> void copiar(
    List<? extends T> origem,  // Producer
    List<? super T> destino    // Consumer
) {
    for (T item : origem) {
        destino.add(item);
    }
}
```

### 2. Collections.addAll

```java
// Exemplo real de PECS
public static <T> boolean addAll(
    Collection<? super T> c,      // Consumer
    T... elements                 // Producer
) {
    for (T e : elements) {
        c.add(e);
    }
    return true;
}
```

### 3. Evite Arrays de Tipos Genéricos

```java
// ❌ Evite: arrays de generics
List<String>[] listas = new List<String>[10]; // Erro de compilação

// ✅ Use List de List
List<List<String>> listas = new ArrayList<>();
```

### 4. Comparator.comparing

```java
// Comparator com contravariância
Comparator<Animal> compAnimal = Comparator.comparing(Animal::getNome);

List<Cachorro> cachorros = new ArrayList<>();
cachorros.sort(compAnimal); // ✅ Comparator<Animal> para Cachorro
```

### 5. Stream.flatMap com Covariância

```java
List<List<String>> listas = Arrays.asList(
    Arrays.asList("a", "b"),
    Arrays.asList("c", "d")
);

List<String> flat = listas.stream()
    .flatMap(Collection::stream) // Stream<? extends String>
    .collect(Collectors.toList());
```

### 6. Optional.map

```java
Optional<String> opt = Optional.of("Java");

// map retorna Optional<U>
Optional<Integer> length = opt.map(String::length);

// flatMap aceita Function<? super T, ? extends Optional<? extends U>>
Optional<String> upper = opt.flatMap(s -> Optional.of(s.toUpperCase()));
```

### 7. Builder Pattern com Covariância

```java
public abstract class Builder<T extends Animal, B extends Builder<T, B>> {
    protected abstract B self();
    
    public abstract T build();
    
    public B nome(String nome) {
        // Configurar nome
        return self();
    }
}

public class CachorroBuilder extends Builder<Cachorro, CachorroBuilder> {
    @Override
    protected CachorroBuilder self() {
        return this;
    }
    
    @Override
    public Cachorro build() {
        return new Cachorro();
    }
}
```

### 8. Factory Method com Covariância

```java
public abstract class Factory<T extends Produto> {
    public abstract T criar();
}

public class ProdutoAFactory extends Factory<ProdutoA> {
    @Override
    public ProdutoA criar() { // Tipo de retorno covariante
        return new ProdutoA();
    }
}
```

### 9. Collections.max/min

```java
// max com contravariância
public static <T extends Object & Comparable<? super T>> 
T max(Collection<? extends T> coll) {
    // ...
}

List<Cachorro> cachorros = new ArrayList<>();
Cachorro maior = Collections.max(cachorros);
```

---

## Resumo

**Covariância**:
```java
// Tipo de retorno
public Cachorro criar() { // Subtipo de Animal
    return new Cachorro();
}

// Arrays (⚠️ runtime exception)
Animal[] animais = new Cachorro[10];
animais[0] = new Gato(); // ❌ ArrayStoreException

// Wildcards
List<? extends Animal> lista = new ArrayList<Cachorro>();
Animal a = lista.get(0); // ✅ Ler
lista.add(new Cachorro()); // ❌ Escrever
```

**Contravariância**:
```java
// Wildcards
List<? super Cachorro> lista = new ArrayList<Animal>();
lista.add(new Cachorro()); // ✅ Escrever
Object obj = lista.get(0); // ⚠️ Ler retorna Object
```

**Invariância**:
```java
// Generics
List<Animal> lista = new ArrayList<Cachorro>(); // ❌ Erro
```

**PECS**:
```java
// Producer Extends
List<? extends Animal> origem;  // Lê elementos
for (Animal a : origem) { }

// Consumer Super
List<? super Animal> destino;   // Escreve elementos
destino.add(new Cachorro());
```

**Unbounded Wildcard**:
```java
List<?> lista = new ArrayList<String>();
Object obj = lista.get(0);  // ✅ Ler como Object
lista.add(null);            // ✅ Só null
```

**Método Genérico**:
```java
public <T extends Animal> T obterPrimeiro(List<T> lista) {
    return lista.get(0);
}

Cachorro c = obterPrimeiro(new ArrayList<Cachorro>()); // ✅ Sem cast
```

**Quando usar**:
- **`? extends T`**: Producer (leitura), covariância
- **`? super T`**: Consumer (escrita), contravariância
- **`<?>`**: Tipo desconhecido (só leitura como Object)
- **`<T>`**: Método genérico (captura tipo)

**Evitar**:
- ❌ Arrays de generics
- ❌ Adicionar em `? extends`
- ❌ Ler tipo específico de `? super`

**Regra de Ouro**: Use **PECS** (Producer Extends, Consumer Super). **Covariância** permite **subtipo** (leitura). **Contravariância** permite **supertipo** (escrita). **Generics são invariantes**, use **wildcards** para flexibilidade. **Arrays são covariantes** (⚠️ runtime exception).
