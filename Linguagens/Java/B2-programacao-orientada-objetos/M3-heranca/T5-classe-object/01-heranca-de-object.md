# T5.01 - Herança de Object

## Introdução

**Todas as classes** em Java **herdam de Object**, direta ou indiretamente.

**Object** é a **raiz** da hierarquia de classes.

```java
// Explicitamente
public class MinhaClasse extends Object {
    // ...
}

// Implicitamente (equivalente)
public class MinhaClasse {
    // ... extends Object implícito
}

// Hierarquia
public class Animal { }                  // extends Object
public class Mamifero extends Animal { } // extends Animal extends Object
public class Cachorro extends Mamifero { } // extends Mamifero ... extends Object
```

**Consequência**: Toda classe possui métodos de Object.

---

## Fundamentos

### 1. Object Como Superclasse Universal

**java.lang.Object** é a **única classe** sem superclasse.

```java
// Object não estende nada
public class Object {
    // Raiz da hierarquia
}

// Todas as outras estendem Object
public class String extends Object { }
public class Integer extends Object { }
public class ArrayList extends Object { }
```

### 2. Herança Implícita

**extends Object** é **implícito** quando não há extends.

```java
// Código escrito
public class Pessoa {
    private String nome;
}

// Equivalente em runtime
public class Pessoa extends Object {
    private String nome;
}
```

### 3. Hierarquia de Herança

**Toda classe** chega em Object seguindo a cadeia de herança.

```java
public class Animal { }          // Animal → Object
public class Cachorro extends Animal { } // Cachorro → Animal → Object

// Cachorro herda métodos de Object indiretamente
Cachorro c = new Cachorro();
String s = c.toString(); // ✅ Método de Object
```

### 4. Métodos Principais de Object

**Object** define métodos que **toda classe herda**:

```java
public class Object {
    public String toString() { }
    public boolean equals(Object obj) { }
    public int hashCode() { }
    public final Class<?> getClass() { }
    protected Object clone() throws CloneNotSupportedException { }
    protected void finalize() throws Throwable { } // Deprecated
    public final void notify() { }
    public final void notifyAll() { }
    public final void wait() throws InterruptedException { }
    // ... (variantes de wait)
}
```

### 5. Sobrescrita de Métodos de Object

**Métodos não-final** podem ser sobrescritos.

```java
public class Pessoa {
    private String nome;
    
    // Sobrescreve toString()
    @Override
    public String toString() {
        return "Pessoa: " + nome;
    }
    
    // Sobrescreve equals()
    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Pessoa) {
            return this.nome.equals(((Pessoa) obj).nome);
        }
        return false;
    }
}
```

### 6. Métodos final de Object

**Alguns métodos são final** (não podem ser sobrescritos).

```java
public class Object {
    public final Class<?> getClass() { }    // final
    public final void notify() { }          // final
    public final void notifyAll() { }       // final
    public final void wait() { }            // final (e variantes)
}

// ❌ Não pode sobrescrever
public class MinhaClasse {
    // @Override
    // public Class<?> getClass() { } // ERRO
}
```

### 7. Toda Referência É Compatível com Object

**Object** pode referenciar **qualquer objeto**.

```java
Object obj1 = new String("Texto");
Object obj2 = new Integer(10);
Object obj3 = new Pessoa("João");
Object obj4 = new ArrayList<>();

// Polimorfismo universal
void processar(Object obj) {
    System.out.println(obj.toString()); // Todo objeto tem toString()
}

processar("String");
processar(42);
processar(new Pessoa("Maria"));
```

### 8. Arrays Também Herdam de Object

```java
int[] numeros = {1, 2, 3};
String[] textos = {"a", "b"};

// Arrays são objetos
Object obj1 = numeros;  // ✅
Object obj2 = textos;   // ✅

// Arrays têm métodos de Object
System.out.println(numeros.toString());  // [I@hashcode
System.out.println(numeros.getClass()); // class [I
```

### 9. Interfaces e Object

**Interfaces não estendem Object**, mas implementações sim.

```java
public interface Voador {
    void voar();
}

public class Passaro implements Voador {
    // extends Object implícito
    
    @Override
    public void voar() { }
    
    // Herda toString() de Object
}

// Uso
Passaro p = new Passaro();
System.out.println(p.toString()); // ✅ Método de Object
```

### 10. Object em Collections

**Collections** usam métodos de Object.

```java
List<Pessoa> pessoas = new ArrayList<>();
pessoas.add(new Pessoa("João"));

// contains() usa equals() de Object
boolean contem = pessoas.contains(new Pessoa("João"));

// HashSet/HashMap usam hashCode() e equals()
Set<Pessoa> set = new HashSet<>();
set.add(new Pessoa("Maria"));
```

---

## Aplicabilidade

**Object é usado para**:
- Polimorfismo universal
- Collections genéricas (antes de Generics)
- APIs que aceitam qualquer tipo
- Reflexão e metadados

**Métodos importantes**:
- **toString()**: representação textual
- **equals()**: comparação de conteúdo
- **hashCode()**: código hash para estruturas de dados
- **getClass()**: informações de tipo em runtime

---

## Armadilhas

### 1. Comparar com == em Vez de equals()

```java
String s1 = new String("Java");
String s2 = new String("Java");

// ❌ Compara referências
if (s1 == s2) { } // false

// ✅ Compara conteúdo
if (s1.equals(s2)) { } // true
```

### 2. Não Sobrescrever equals() e hashCode()

```java
public class Pessoa {
    private String nome;
    
    // ❌ Sem sobrescrita: usa equals() de Object (compara referências)
}

Pessoa p1 = new Pessoa("João");
Pessoa p2 = new Pessoa("João");
p1.equals(p2); // false (referências diferentes)
```

### 3. toString() Padrão Pouco Útil

```java
public class Pessoa {
    private String nome;
    
    // Sem sobrescrita
}

Pessoa p = new Pessoa("João");
System.out.println(p); // Pessoa@15db9742 (não muito útil)

// ✅ Com sobrescrita
@Override
public String toString() {
    return "Pessoa: " + nome;
}
System.out.println(p); // Pessoa: João
```

### 4. Casting de Object

```java
Object obj = "Texto";

// ❌ Casting sem verificação
int numero = (int) obj; // ClassCastException

// ✅ Verificar antes
if (obj instanceof String) {
    String texto = (String) obj;
}
```

---

## Boas Práticas

### 1. Sempre Sobrescreva toString()

```java
@Override
public String toString() {
    return "Pessoa[nome=" + nome + ", idade=" + idade + "]";
}
```

### 2. Sobrescreva equals() e hashCode() Juntos

```java
@Override
public boolean equals(Object obj) {
    if (this == obj) return true;
    if (!(obj instanceof Pessoa)) return false;
    Pessoa p = (Pessoa) obj;
    return nome.equals(p.nome);
}

@Override
public int hashCode() {
    return Objects.hash(nome);
}
```

### 3. Use instanceof Antes de Casting

```java
@Override
public boolean equals(Object obj) {
    if (!(obj instanceof Pessoa)) return false;
    Pessoa p = (Pessoa) obj;
    // ...
}
```

### 4. Evite Casting Desnecessário

```java
// ❌ Casting desnecessário
Object obj = new String("Texto");
String s = (String) obj;
System.out.println(s.length());

// ✅ Use tipo correto
String s = "Texto";
System.out.println(s.length());
```

### 5. Use Generics Em Vez de Object

```java
// ❌ Antes de Generics (Java < 5)
List lista = new ArrayList();
lista.add("Texto");
String s = (String) lista.get(0); // Casting

// ✅ Com Generics (Java 5+)
List<String> lista = new ArrayList<>();
lista.add("Texto");
String s = lista.get(0); // Sem casting
```

---

## Resumo

**Herança de Object**:
```java
// Toda classe estende Object
public class MinhaClasse { } // ← extends Object implícito

// Hierarquia
Object
  ↑
Animal
  ↑
Cachorro
```

**Métodos principais**:
```java
toString()     // Representação textual
equals()       // Comparação de conteúdo
hashCode()     // Código hash
getClass()     // Informações de tipo (final)
clone()        // Clonar objeto (protected)
notify()       // Concorrência (final)
notifyAll()    // Concorrência (final)
wait()         // Concorrência (final)
```

**Métodos sobrescrevíveis**:
```java
@Override
public String toString() { }

@Override
public boolean equals(Object obj) { }

@Override
public int hashCode() { }

@Override
protected Object clone() throws CloneNotSupportedException { }
```

**Métodos final** (não sobrescrevíveis):
```java
getClass()
notify()
notifyAll()
wait()
```

**Polimorfismo universal**:
```java
Object obj = new String("Texto");
Object obj = new Integer(10);
Object obj = new Pessoa("João");
Object obj = new int[]{1, 2, 3};

// Todo objeto tem toString()
System.out.println(obj.toString());
```

**Collections**:
```java
// HashSet usa hashCode() e equals()
Set<Pessoa> set = new HashSet<>();

// ArrayList usa equals()
List<Pessoa> lista = new ArrayList<>();
lista.contains(pessoa); // Chama equals()
```

**Hierarquia**:
```
Object (raiz)
  ├── String
  ├── Integer
  ├── ArrayList
  ├── Pessoa
  └── ... (todas as classes)
```

**Regra de Ouro**: **Toda classe herda de Object**. Sobrescreva **toString()**, **equals()** e **hashCode()** quando necessário.
