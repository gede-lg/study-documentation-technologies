# T4.05 - Métodos static e final Não Usam Binding Dinâmico

## Introdução

**Métodos static e final** usam **binding estático** (early binding, compile-time), **não** binding dinâmico (late binding, runtime).

```java
// static: binding estático
public class Animal {
    public static void categoria() {
        System.out.println("Mamífero");
    }
}

public class Cachorro extends Animal {
    public static void categoria() {
        System.out.println("Canino");
    }
}

Animal a = new Cachorro();
a.categoria(); // "Mamífero" - tipo da referência, não do objeto

// final: binding estático
public class Animal {
    public final void respirar() {
        System.out.println("Respirando");
    }
}

// Cachorro não pode sobrescrever respirar()
```

**Binding estático**: decisão em **compile-time** baseada no **tipo da referência**.

**Binding dinâmico**: decisão em **runtime** baseada no **tipo do objeto**.

---

## Fundamentos

### 1. Métodos static Não São Polimórficos

Métodos **static** pertencem à **classe**, não ao **objeto**.

```java
public class Animal {
    public static void info() {
        System.out.println("Animal");
    }
}

public class Cachorro extends Animal {
    public static void info() { // Hiding, não sobrescrita
        System.out.println("Cachorro");
    }
}

Animal.info();    // "Animal"
Cachorro.info();  // "Cachorro"

// ⚠️ Tipo da referência, não do objeto
Animal a = new Cachorro();
a.info(); // "Animal" - compile-time binding
```

### 2. Method Hiding vs Overriding

**Overriding** (sobrescrita): métodos de instância.
**Hiding** (ocultação): métodos static.

```java
// Overriding: polimórfico
public class Animal {
    public void som() { } // Instância
}
public class Cachorro extends Animal {
    @Override
    public void som() { } // Sobrescrita
}

// Hiding: não polimórfico
public class Animal {
    public static void categoria() { } // Static
}
public class Cachorro extends Animal {
    public static void categoria() { } // Hiding
}
```

### 3. Métodos final Não Podem Ser Sobrescritos

**final**: impede sobrescrita.

```java
public class Animal {
    public final void respirar() {
        System.out.println("Respirando");
    }
}

public class Cachorro extends Animal {
    // ❌ Erro: não pode sobrescrever final
    // @Override
    // public void respirar() { }
}
```

### 4. final Permite Otimização

Compilador/JIT podem **otimizar** métodos final (inlining).

```java
public class Animal {
    public final void respirar() {
        System.out.println("Respirando");
    }
}

Animal a = new Cachorro();
a.respirar(); // Chamada direta (não vtable lookup)

// JIT pode inline:
// System.out.println("Respirando"); // Substitui chamada
```

### 5. private Também É Binding Estático

Métodos **private** não são herdados, logo **não são polimórficos**.

```java
public class Animal {
    private void metabolismo() {
        System.out.println("Metabolismo Animal");
    }
    
    public void processar() {
        metabolismo(); // Binding estático
    }
}

public class Cachorro extends Animal {
    private void metabolismo() { // Não sobrescreve
        System.out.println("Metabolismo Cachorro");
    }
}

Animal a = new Cachorro();
a.processar(); // "Metabolismo Animal"
```

### 6. Classe final

Classe **final** não pode ser **estendida**.

```java
public final class String {
    // Métodos não podem ser sobrescritos (classe final)
}

// ❌ Erro: não pode estender final
// public class MinhaString extends String { }
```

### 7. static Não Está na VTable

Métodos **static** não estão na **vtable**.

```java
// Conceitual: vtable
class Animal {
    public void som() { }         // VTable
    public static void info() { } // Não vtable
}

// static: resolvido em compile-time
Animal.info(); // Compile-time: Animal.info()
```

### 8. final Não Está na VTable

Métodos **final** não estão na **vtable** (não podem ser sobrescritos).

```java
class Animal {
    public void som() { }           // VTable
    public final void respirar() { } // Não vtable
}

// final: pode ser inlined (otimização)
```

### 9. Construtores Não São Polimórficos

**Construtores** não são herdados, logo **não são polimórficos**.

```java
public class Animal {
    public Animal(String especie) { }
}

public class Cachorro extends Animal {
    public Cachorro(String especie, String raca) {
        super(especie); // Chama construtor da superclasse
    }
}

// Construtores não usam binding dinâmico
```

### 10. Campos Não São Polimórficos

**Campos** (variáveis de instância) não usam binding dinâmico.

```java
public class Animal {
    public String tipo = "Animal";
}

public class Cachorro extends Animal {
    public String tipo = "Cachorro"; // Hiding (não sobrescrita)
}

Animal a = new Cachorro();
System.out.println(a.tipo); // "Animal" - tipo da referência
System.out.println(((Cachorro) a).tipo); // "Cachorro"
```

---

## Aplicabilidade

**Use static quando**:
- Método **não depende** de estado do objeto
- **Utility methods** (Math.max, Collections.sort)
- **Factory methods** (criar instâncias)
- **Constantes** e **configurações**

**Use final quando**:
- Método **não deve ser sobrescrito**
- **Template Method** (métodos auxiliares)
- **Performance** (permite inlining)
- **Security** (prevenir sobrescrita maliciosa)

**Evite static quando**:
- Método **depende** de estado do objeto
- **Polimorfismo** é necessário
- **Testabilidade** (static dificulta mocks)

---

## Armadilhas

### 1. static Não É Polimórfico

```java
public class Animal {
    public static void categoria() {
        System.out.println("Animal");
    }
}

public class Cachorro extends Animal {
    public static void categoria() {
        System.out.println("Cachorro");
    }
}

Animal a = new Cachorro();
a.categoria(); // "Animal" - tipo da referência
```

### 2. @Override com static

```java
public class Animal {
    public static void info() { }
}

public class Cachorro extends Animal {
    @Override // ❌ Erro: static não é sobrescrita
    public static void info() { }
}
```

### 3. final Impede Sobrescrita

```java
public class Animal {
    public final void respirar() { }
}

public class Cachorro extends Animal {
    @Override // ❌ Erro: não pode sobrescrever final
    public void respirar() { }
}
```

### 4. private Não É Herdado

```java
public class Animal {
    private void interno() {
        System.out.println("Animal");
    }
    
    public void executar() {
        interno(); // Chama Animal.interno()
    }
}

public class Cachorro extends Animal {
    private void interno() { // Não sobrescreve
        System.out.println("Cachorro");
    }
}

Animal a = new Cachorro();
a.executar(); // "Animal" - private não é polimórfico
```

### 5. Campos Não São Polimórficos

```java
public class Animal {
    public String nome = "Animal";
}

public class Cachorro extends Animal {
    public String nome = "Cachorro";
}

Animal a = new Cachorro();
System.out.println(a.nome); // "Animal" - tipo da referência
```

### 6. Construtores e Métodos Polimórficos

```java
public class Animal {
    public Animal() {
        inicializar(); // ⚠️ Método polimórfico em construtor
    }
    
    public void inicializar() {
        System.out.println("Animal");
    }
}

public class Cachorro extends Animal {
    private String raca = "Labrador";
    
    @Override
    public void inicializar() {
        System.out.println("Raça: " + raca); // null! (não inicializado)
    }
}

Cachorro c = new Cachorro(); // "Raça: null"
```

### 7. final em Classe vs Método

```java
// Classe final: não pode ser estendida
public final class String { }

// Método final: não pode ser sobrescrito
public class Animal {
    public final void respirar() { }
}
```

---

## Boas Práticas

### 1. Use static para Utility Methods

```java
public class MathUtil {
    // Utility method: static
    public static int max(int a, int b) {
        return (a > b) ? a : b;
    }
    
    // Construtor privado: prevent instantiation
    private MathUtil() { }
}

int resultado = MathUtil.max(10, 20);
```

### 2. Use final para Template Method

```java
public abstract class Processador {
    // Template method: final (não pode ser sobrescrito)
    public final void executar() {
        inicializar();
        processar(); // Polimórfico
        finalizar();
    }
    
    // Hook methods: polimórficos
    protected void inicializar() { }
    protected abstract void processar();
    protected void finalizar() { }
}
```

### 3. Factory Method com static

```java
public class Conexao {
    // Factory method: static
    public static Conexao criar(String url) {
        return new Conexao(url);
    }
    
    private Conexao(String url) { }
}

Conexao conexao = Conexao.criar("jdbc:mysql://...");
```

### 4. final para Performance

```java
public class Animal {
    // final: JIT pode inline
    public final void respirar() {
        System.out.println("Respirando");
    }
    
    // Polimórfico: vtable lookup
    public void som() {
        System.out.println("Som");
    }
}
```

### 5. Constantes com static final

```java
public class Config {
    public static final int MAX_CONEXOES = 100;
    public static final String BANCO_URL = "jdbc:...";
    
    private Config() { } // Prevent instantiation
}

int max = Config.MAX_CONEXOES;
```

### 6. Singleton com private Constructor

```java
public class Singleton {
    private static final Singleton INSTANCE = new Singleton();
    
    // Construtor privado: prevent instantiation
    private Singleton() { }
    
    // Factory method: static
    public static Singleton getInstance() {
        return INSTANCE;
    }
}

Singleton instance = Singleton.getInstance();
```

### 7. Enum com static final

```java
public enum Status {
    ATIVO, INATIVO, PENDENTE;
    
    // Método static
    public static Status parse(String valor) {
        return valueOf(valor.toUpperCase());
    }
}

Status status = Status.parse("ativo");
```

### 8. Collections Utility com static

```java
public class Collections {
    // Utility methods: static
    public static <T> void sort(List<T> list) { }
    public static <T> int binarySearch(List<T> list, T key) { }
    
    // Construtor privado
    private Collections() { }
}

Collections.sort(lista);
```

### 9. Optional Factory com static

```java
public class Optional<T> {
    // Factory methods: static
    public static <T> Optional<T> empty() {
        return new Optional<>();
    }
    
    public static <T> Optional<T> of(T value) {
        return new Optional<>(value);
    }
}

Optional<String> opt = Optional.of("valor");
```

### 10. Evite static para Estado

```java
// ❌ Evite: static para estado mutável
public class Contador {
    private static int count = 0; // Estado global
    
    public static void incrementar() {
        count++;
    }
}

// ✅ Prefira: instância
public class Contador {
    private int count = 0; // Estado da instância
    
    public void incrementar() {
        count++;
    }
}
```

---

## Resumo

**Métodos static e final** usam **binding estático** (compile-time), **não** binding dinâmico (runtime).

**static**:
```java
public static void metodo() { } // Compile-time binding

Animal a = new Cachorro();
a.metodo(); // Tipo da referência (Animal)
```

**final**:
```java
public final void metodo() { } // Não pode ser sobrescrito

// Permite otimização (inlining)
```

**Diferenças**:

| Aspecto | static | final | Polimórfico |
|---------|--------|-------|-------------|
| **Binding** | Compile-time | Compile-time | Runtime |
| **Sobrescrita** | Não (hiding) | Não (impede) | Sim |
| **VTable** | Não | Não | Sim |
| **Otimização** | Sim | Sim (inline) | Limitada |
| **Polimorfismo** | Não | Não | Sim |

**Hiding vs Overriding**:
```java
// Hiding: static
public static void metodo() { }

// Overriding: instância
public void metodo() { }
```

**private também é binding estático**:
```java
private void metodo() { } // Não herdado, não polimórfico
```

**Campos não são polimórficos**:
```java
public String campo = "valor"; // Tipo da referência
```

**Quando usar**:
- **static**: utility methods, factory methods, constantes
- **final**: métodos que não devem ser sobrescritos, template method, performance

**Evite**:
- **static** para estado mutável
- **static** quando polimorfismo é necessário
- Métodos polimórficos em **construtores**

**Otimização**:
```java
// final: JIT pode inline
public final void metodo() {
    System.out.println("Método");
}

// JIT substitui por:
System.out.println("Método");
```

**Regra de Ouro**: **static** e **final** usam **compile-time binding** (tipo da referência). **Não são polimórficos**. static para **utility methods** e **factory methods**. final para **impedir sobrescrita** e **permitir otimização**. Evite **static** para estado mutável e quando **polimorfismo** é necessário.
