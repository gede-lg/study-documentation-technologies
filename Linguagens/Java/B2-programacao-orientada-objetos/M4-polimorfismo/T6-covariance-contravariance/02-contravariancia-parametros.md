# T6.02 - Contravariância em Parâmetros (Não Suportado Nativamente)

## Introdução

**Contravariância**: se `A` é subtipo de `B`, então `f(B)` seria subtipo de `f(A)` (ordem **inversa**).

**Em métodos**: contravariância permitiria parâmetro de tipo **mais genérico** em método sobrescrito.

```java
// ❌ Java não suporta contravariância em parâmetros

public class Animal {
    public void alimentar(Animal animal) {
        System.out.println("Alimentando animal");
    }
}

public class Cachorro extends Animal {
    @Override
    public void alimentar(Object obj) { // ❌ ERRO: não é sobrescrita
        System.out.println("Alimentando objeto");
    }
}

// Erro de compilação: método não sobrescreve ou implementa
```

**Java**: parâmetros são **invariantes** (tipo **exato**).

**Razão**: contravariância em parâmetros pode quebrar **type safety** e **Liskov Substitution Principle**.

**Alternativas**: Generics com wildcards (`<? super T>`).

---

## Fundamentos

### 1. Definição de Contravariância

**Contravariante**: se `A` é subtipo de `B`, então `f(B)` é subtipo de `f(A)` (ordem **reversa**).

```java
// Cachorro é subtipo de Animal
// Contravariância: alimentar(Animal) seria subtipo de alimentar(Cachorro)

// ❌ Java não suporta
public class Animal {
    public void metodo(Cachorro c) { }
}

public class Cachorro extends Animal {
    @Override
    public void metodo(Animal a) { } // ❌ ERRO
}
```

### 2. Java Requer Tipo Exato

**Invariância**: parâmetros devem ter **tipo exato** na sobrescrita.

```java
public class Animal {
    public void alimentar(Animal animal) {
        System.out.println("Alimentando animal");
    }
}

public class Cachorro extends Animal {
    @Override
    public void alimentar(Animal animal) { // ✅ Tipo exato
        System.out.println("Alimentando cachorro");
    }
}
```

### 3. Por Que Java Não Suporta

**Quebra type safety**:

```java
// Suponha que Java suportasse contravariância

public class Animal {
    public void alimentar(Cachorro c) {
        c.latir(); // Método específico de Cachorro
    }
}

public class Gato extends Animal {
    @Override
    public void alimentar(Animal a) { // Contravariante
        // a pode ser qualquer Animal, não necessariamente Cachorro
        a.latir(); // ❌ Animal não tem latir()
    }
}

Animal animal = new Gato();
animal.alimentar(new Cachorro()); // Chamaria Gato.alimentar(Animal)
// Problema: Gato.alimentar espera Animal, mas pode receber Gato (sem latir())
```

### 4. Liskov Substitution Principle

Contravariância **viola LSP**:

```java
// LSP: subtipo deve ser substituível por supertipo

public class Animal {
    public void processar(Cachorro c) {
        c.latir(); // Assume que é Cachorro
    }
}

public class Gato extends Animal {
    @Override
    public void processar(Animal a) { // Contravariante
        // a pode ser Gato, Passaro, etc.
        a.latir(); // ❌ Animal não tem latir()
    }
}

Animal animal = new Gato();
animal.processar(new Cachorro()); // Chamaria Gato.processar(Animal)
// Viola LSP: substituição quebra comportamento
```

### 5. Sobrecarga vs Sobrescrita

**Parâmetro diferente** = sobrecarga, **não sobrescrita**.

```java
public class Animal {
    public void metodo(Animal a) {
        System.out.println("Animal: Animal");
    }
}

public class Cachorro extends Animal {
    public void metodo(Cachorro c) { // ⚠️ SOBRECARGA
        System.out.println("Cachorro: Cachorro");
    }
}

Animal animal = new Cachorro();
animal.metodo(new Animal()); // "Animal: Animal" (chama superclasse)
animal.metodo(new Cachorro()); // "Animal: Animal" (chama superclasse)

Cachorro cachorro = new Cachorro();
cachorro.metodo(new Animal()); // "Animal: Animal" (herdado)
cachorro.metodo(new Cachorro()); // "Cachorro: Cachorro" (sobrecarga)
```

### 6. Generics com <? super T>

**Consumer**: aceita tipo ou **supertipo** (contravariante).

```java
import java.util.*;

public class Exemplo {
    // Consumer contravariante: aceita Number ou supertipo
    public static void adicionar(List<? super Number> lista) {
        lista.add(10);    // OK: Integer é Number
        lista.add(10.5);  // OK: Double é Number
        // Number n = lista.get(0); // ❌ ERRO: retorna Object
    }
    
    public static void main(String[] args) {
        List<Number> numeros = new ArrayList<>();
        adicionar(numeros); // OK
        
        List<Object> objetos = new ArrayList<>();
        adicionar(objetos); // OK: Object é supertipo de Number
        
        List<Integer> inteiros = new ArrayList<>();
        // adicionar(inteiros); // ❌ ERRO: Integer não é supertipo
    }
}
```

### 7. Comparator Contravariante

**Comparator**: aceita tipo ou **supertipo**.

```java
import java.util.*;

public class Exemplo {
    public static void main(String[] args) {
        List<String> strings = Arrays.asList("c", "a", "b");
        
        // Comparator<Object> é contravariante em relação a Comparator<String>
        Comparator<Object> comparadorObjeto = (o1, o2) -> 
            o1.toString().compareTo(o2.toString());
        
        strings.sort(comparadorObjeto); // OK: Comparator<Object> aceita String
        System.out.println(strings); // [a, b, c]
    }
}
```

### 8. Collections.max com Comparator

**Collections.max**: aceita Comparator contravariante.

```java
import java.util.*;

public class Exemplo {
    public static void main(String[] args) {
        List<Integer> inteiros = Arrays.asList(1, 5, 3);
        
        // Comparator<Number> é supertipo de Comparator<Integer>
        Comparator<Number> comparador = (n1, n2) -> 
            Double.compare(n1.doubleValue(), n2.doubleValue());
        
        Integer max = Collections.max(inteiros, comparador); // OK
        System.out.println(max); // 5
    }
}
```

### 9. BiConsumer Contravariante

**BiConsumer**: aceita tipos ou **supertipos**.

```java
import java.util.function.*;

public class Exemplo {
    public static void main(String[] args) {
        BiConsumer<Object, Object> consumer = (o1, o2) -> 
            System.out.println(o1 + " " + o2);
        
        // BiConsumer<Object, Object> é contravariante
        BiConsumer<String, Integer> stringIntConsumer = consumer;
        stringIntConsumer.accept("texto", 10); // OK
    }
}
```

### 10. Outras Linguagens

**Scala**: suporta contravariância explícita (`-T`).

```scala
// Scala (não Java)
trait Function[-A, +B] {
  def apply(a: A): B
}

// -A: contravariante em A
// +B: covariante em B
```

**C#**: suporta contravariância (`in T`).

```csharp
// C# (não Java)
interface IComparable<in T> {
    int CompareTo(T other);
}

// in T: contravariante em T
```

**Java**: não suporta contravariância em **declaração de parâmetros de métodos**.

---

## Aplicabilidade

**Use `<? super T>` quando**:
- **Consumer** (aceitar valores)
- **Comparator** (comparar objetos)
- **Collections.addAll** (adicionar elementos)
- **Flexibilidade** para supertipos

**Evite tentar contravariância em parâmetros quando**:
- Java **não suporta**
- Resulta em **sobrecarga**, não sobrescrita
- Pode **violar LSP**

---

## Armadilhas

### 1. Confundir Sobrecarga com Sobrescrita

```java
public class Animal {
    public void metodo(Animal a) {
        System.out.println("Animal: Animal");
    }
}

public class Cachorro extends Animal {
    // ⚠️ SOBRECARGA (não sobrescrita)
    public void metodo(Object obj) {
        System.out.println("Cachorro: Object");
    }
}

Animal animal = new Cachorro();
animal.metodo(new Animal()); // "Animal: Animal" (chama superclasse)
```

### 2. Tentar Contravariância em Parâmetros

```java
public class Animal {
    public void alimentar(Cachorro c) {
        System.out.println("Alimentando cachorro");
    }
}

public class Gato extends Animal {
    @Override
    public void alimentar(Animal a) { // ❌ ERRO: não sobrescreve
        System.out.println("Alimentando animal");
    }
}

// Erro de compilação: método não sobrescreve
```

### 3. <? super T> Não Permite Leitura Type-Safe

```java
List<? super Number> lista = new ArrayList<Object>();
lista.add(10);    // OK: adicionar
lista.add(10.5);  // OK: adicionar

// Number n = lista.get(0); // ❌ ERRO: retorna Object
Object obj = lista.get(0); // OK: Object
```

### 4. Comparator com Tipo Errado

```java
List<String> strings = Arrays.asList("c", "a", "b");

// ❌ Comparator<Integer> não é compatível com List<String>
Comparator<Integer> comparador = Integer::compare;
// strings.sort(comparador); // ERRO: tipos incompatíveis
```

### 5. Generics Invariantes

```java
List<Number> numeros = new ArrayList<Integer>(); // ❌ ERRO: invariante

// ✅ Solução: wildcard
List<? extends Number> numeros2 = new ArrayList<Integer>(); // OK
```

### 6. BiConsumer com Tipos Incompatíveis

```java
BiConsumer<String, String> consumer = (s1, s2) -> 
    System.out.println(s1 + s2);

// ❌ BiConsumer<Object, Object> não é compatível
BiConsumer<Object, Object> objConsumer = consumer; // ERRO: invariante
```

### 7. Confundir Covariância com Contravariância

```java
// Covariância: retorno varia junto (A → B)
// Contravariância: parâmetro varia ao contrário (B → A)

// ✅ Covariância (suportada)
public class Animal {
    public Animal criar() { return new Animal(); }
}
public class Cachorro extends Animal {
    @Override
    public Cachorro criar() { return new Cachorro(); } // OK
}

// ❌ Contravariância (não suportada)
public class Animal {
    public void processar(Cachorro c) { }
}
public class Gato extends Animal {
    @Override
    public void processar(Animal a) { } // ERRO
}
```

---

## Boas Práticas

### 1. Use `<? super T>` para Consumer

```java
import java.util.*;

public class Utilitario {
    // Consumer contravariante
    public static void preencherComZeros(List<? super Integer> lista) {
        for (int i = 0; i < 5; i++) {
            lista.add(0);
        }
    }
    
    public static void main(String[] args) {
        List<Integer> inteiros = new ArrayList<>();
        preencherComZeros(inteiros); // OK
        
        List<Number> numeros = new ArrayList<>();
        preencherComZeros(numeros); // OK: Number é supertipo
        
        List<Object> objetos = new ArrayList<>();
        preencherComZeros(objetos); // OK: Object é supertipo
    }
}
```

### 2. Comparator com Supertipo

```java
import java.util.*;

public class Exemplo {
    public static void main(String[] args) {
        List<Integer> inteiros = Arrays.asList(5, 1, 3);
        
        // Comparator<Number> funciona para Integer
        Comparator<Number> comparador = Comparator.comparingDouble(Number::doubleValue);
        
        inteiros.sort(comparador); // OK
        System.out.println(inteiros); // [1, 3, 5]
    }
}
```

### 3. Collections.addAll

```java
import java.util.*;

public class Exemplo {
    public static void main(String[] args) {
        List<Number> numeros = new ArrayList<>();
        
        // Collections.addAll aceita <? super T>
        Collections.addAll(numeros, 1, 2, 3); // OK: Integer → Number
        Collections.addAll(numeros, 1.5, 2.5); // OK: Double → Number
        
        System.out.println(numeros); // [1, 2, 3, 1.5, 2.5]
    }
}
```

### 4. BiConsumer com Supertipo

```java
import java.util.*;
import java.util.function.*;

public class Exemplo {
    public static void processar(Map<String, Integer> mapa, 
                                  BiConsumer<? super String, ? super Integer> consumer) {
        mapa.forEach(consumer);
    }
    
    public static void main(String[] args) {
        Map<String, Integer> mapa = Map.of("a", 1, "b", 2);
        
        // BiConsumer<Object, Object> funciona
        BiConsumer<Object, Object> consumer = (k, v) -> 
            System.out.println(k + ": " + v);
        
        processar(mapa, consumer); // OK
    }
}
```

### 5. Evite Sobrecarga Confusa

```java
// ❌ Confuso
public class Animal {
    public void metodo(Animal a) {
        System.out.println("Animal: Animal");
    }
}

public class Cachorro extends Animal {
    public void metodo(Object obj) { // Sobrecarga
        System.out.println("Cachorro: Object");
    }
}

// ✅ Melhor: mantenha assinatura exata
public class Animal {
    public void metodo(Animal a) {
        System.out.println("Animal: Animal");
    }
}

public class Cachorro extends Animal {
    @Override
    public void metodo(Animal a) { // Sobrescrita
        System.out.println("Cachorro: Animal");
    }
}
```

### 6. Use PECS (Producer Extends, Consumer Super)

```java
import java.util.*;

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

// Producer: Integer extends Number
List<Integer> inteiros = Arrays.asList(1, 2, 3);
pilha.pushAll(inteiros); // OK

// Consumer: Object super Number
List<Object> objetos = new ArrayList<>();
pilha.popAll(objetos); // OK
```

### 7. Comparator.comparing com Supertipo

```java
import java.util.*;

class Pessoa {
    String nome;
    Pessoa(String nome) { this.nome = nome; }
    String getNome() { return nome; }
}

class Funcionario extends Pessoa {
    Funcionario(String nome) { super(nome); }
}

public class Exemplo {
    public static void main(String[] args) {
        List<Funcionario> funcionarios = Arrays.asList(
            new Funcionario("Carlos"),
            new Funcionario("Ana")
        );
        
        // Comparator<Pessoa> funciona para Funcionario
        Comparator<Pessoa> comparador = Comparator.comparing(Pessoa::getNome);
        
        funcionarios.sort(comparador); // OK
        funcionarios.forEach(f -> System.out.println(f.getNome())); // Ana, Carlos
    }
}
```

### 8. Consumer com Supertipo

```java
import java.util.function.*;

public class Exemplo {
    public static void processar(Integer valor, Consumer<? super Integer> consumer) {
        consumer.accept(valor);
    }
    
    public static void main(String[] args) {
        // Consumer<Number> funciona para Integer
        Consumer<Number> consumer = n -> System.out.println("Número: " + n);
        
        processar(10, consumer); // OK: Número: 10
        
        // Consumer<Object> também funciona
        Consumer<Object> objConsumer = obj -> System.out.println("Objeto: " + obj);
        processar(20, objConsumer); // OK: Objeto: 20
    }
}
```

### 9. TreeSet com Comparator Contravariante

```java
import java.util.*;

public class Exemplo {
    public static void main(String[] args) {
        // Comparator<Number> funciona para TreeSet<Integer>
        Comparator<Number> comparador = Comparator.comparingDouble(Number::doubleValue);
        
        TreeSet<Integer> set = new TreeSet<>(comparador);
        set.addAll(Arrays.asList(5, 1, 3));
        
        System.out.println(set); // [1, 3, 5]
    }
}
```

### 10. Invariância de Parâmetros

```java
// ✅ Tipo exato (invariante)
public class Animal {
    public void processar(Animal a) {
        System.out.println("Processando animal");
    }
}

public class Cachorro extends Animal {
    @Override
    public void processar(Animal a) { // Tipo exato
        System.out.println("Processando cachorro");
    }
}

Animal animal = new Cachorro();
animal.processar(new Animal()); // "Processando cachorro"
```

---

## Resumo

**Contravariância**: se `A` é subtipo de `B`, então `f(B)` seria subtipo de `f(A)` (ordem **inversa**).

**Java não suporta** contravariância em **parâmetros de métodos**:

```java
// ❌ ERRO: não é sobrescrita
public class Animal {
    public void metodo(Cachorro c) { }
}

public class Gato extends Animal {
    @Override
    public void metodo(Animal a) { } // ERRO
}
```

**Razão**:
- Quebra **type safety**
- Viola **Liskov Substitution Principle**

**Parâmetros são invariantes** (tipo **exato**):

```java
// ✅ Tipo exato
@Override
public void metodo(Animal a) { } // OK
```

**Alternativa**: Generics com `<? super T>`:

```java
// Consumer contravariante
public void adicionar(List<? super Integer> lista) {
    lista.add(10); // OK
}

List<Number> numeros = new ArrayList<>();
adicionar(numeros); // OK: Number é supertipo de Integer
```

**PECS**: Producer Extends, Consumer Super:

```java
// Producer: leitura
public void pushAll(Iterable<? extends E> src) { }

// Consumer: escrita
public void popAll(Collection<? super E> dst) { }
```

**Comparator contravariante**:

```java
Comparator<Number> comparador = ...;
List<Integer> inteiros = ...;
inteiros.sort(comparador); // OK: Comparator<Number> funciona para Integer
```

**Sobrecarga vs Sobrescrita**:

```java
// ⚠️ SOBRECARGA (não sobrescrita)
public void metodo(Object obj) { } // Parâmetro diferente
```

**Outras linguagens**:
- **Scala**: `-T` (contravariante)
- **C#**: `in T` (contravariante)
- **Java**: não suporta em parâmetros de métodos

**Quando usar `<? super T>`**:
- Consumer (aceitar valores)
- Comparator (comparar objetos)
- Collections.addAll (adicionar elementos)
- Flexibilidade para supertipos

**Regra de Ouro**: Java **não suporta** contravariância em **parâmetros de métodos** (tipo deve ser **exato**). Para **flexibilidade**, use **Generics** com `<? super T>` (Consumer). Evite tentar contravariância em sobrescrita (resulta em **sobrecarga**, não sobrescrita, e pode **violar LSP**). Aplique **PECS** para APIs genéricas.
