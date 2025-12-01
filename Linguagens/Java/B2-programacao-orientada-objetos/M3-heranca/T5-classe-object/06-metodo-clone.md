# T5.06 - Método clone()

## Introdução

**clone()** cria **cópia** de objeto.

**Implementa Cloneable** para permitir clonagem.

**Shallow copy** vs **deep copy**.

```java
public class Pessoa implements Cloneable {
    private String nome;
    
    @Override
    public Pessoa clone() throws CloneNotSupportedException {
        return (Pessoa) super.clone();
    }
}
```

```java
Pessoa p1 = new Pessoa("João");
Pessoa p2 = p1.clone(); // Cópia

p1 == p2;       // false (objetos diferentes)
p1.equals(p2);  // true (conteúdo igual)
```

---

## Fundamentos

### 1. clone() em Object

**Método protected** em Object.

```java
public class Object {
    protected native Object clone() throws CloneNotSupportedException;
}
```

**Lança CloneNotSupportedException** se não implementa Cloneable.

### 2. Interface Cloneable

**Marker interface** (sem métodos).

```java
public interface Cloneable {
    // Vazia (marker interface)
}

public class Pessoa implements Cloneable {
    private String nome;
    
    @Override
    public Pessoa clone() throws CloneNotSupportedException {
        return (Pessoa) super.clone();
    }
}
```

### 3. CloneNotSupportedException

**Lançada** se classe não implementa Cloneable.

```java
public class Pessoa {
    // ❌ Não implementa Cloneable
}

Pessoa p1 = new Pessoa("João");
Pessoa p2 = (Pessoa) p1.clone(); // CloneNotSupportedException
```

### 4. Shallow Copy (Cópia Rasa)

**super.clone()** copia apenas **referências**.

```java
public class Pessoa implements Cloneable {
    private String nome;
    private Endereco endereco; // Referência
    
    @Override
    public Pessoa clone() throws CloneNotSupportedException {
        return (Pessoa) super.clone(); // Shallow copy
    }
}

Pessoa p1 = new Pessoa("João", new Endereco("SP"));
Pessoa p2 = p1.clone();

// p2.endereco aponta para MESMO objeto
p1.endereco == p2.endereco; // true (mesma referência)
```

### 5. Deep Copy (Cópia Profunda)

**Clonar objetos internos** manualmente.

```java
public class Pessoa implements Cloneable {
    private String nome;
    private Endereco endereco;
    
    @Override
    public Pessoa clone() throws CloneNotSupportedException {
        Pessoa copia = (Pessoa) super.clone();
        // Deep copy: clonar endereco
        copia.endereco = endereco.clone();
        return copia;
    }
}

Pessoa p1 = new Pessoa("João", new Endereco("SP"));
Pessoa p2 = p1.clone();

// p2.endereco é objeto DIFERENTE
p1.endereco == p2.endereco; // false (deep copy)
```

### 6. Alterar Tipo de Retorno

**Retorno covariante**: retornar tipo específico.

```java
// ✅ Retorna Pessoa (em vez de Object)
@Override
public Pessoa clone() throws CloneNotSupportedException {
    return (Pessoa) super.clone();
}
```

### 7. clone() com Arrays

**Arrays suportam clone()** nativamente.

```java
int[] original = {1, 2, 3};
int[] copia = original.clone();

original == copia; // false (arrays diferentes)
```

**Shallow copy** para arrays de objetos:
```java
Pessoa[] original = {new Pessoa("João"), new Pessoa("Maria")};
Pessoa[] copia = original.clone();

// Arrays diferentes
original == copia; // false

// Mas objetos internos são os MESMOS
original[0] == copia[0]; // true (shallow copy)
```

### 8. clone() com Collections

**Collections** não implementam Cloneable.

```java
// ❌ Não funciona
List<Pessoa> lista1 = new ArrayList<>();
List<Pessoa> lista2 = lista1.clone(); // Erro de compilação
```

**Solução**: Construtor de cópia.
```java
List<Pessoa> lista1 = new ArrayList<>();
List<Pessoa> lista2 = new ArrayList<>(lista1); // Cópia
```

### 9. Alternativa: Construtor de Cópia

**Construtor** que recebe objeto do mesmo tipo.

```java
public class Pessoa {
    private String nome;
    private Endereco endereco;
    
    // Construtor de cópia
    public Pessoa(Pessoa outra) {
        this.nome = outra.nome;
        this.endereco = new Endereco(outra.endereco); // Deep copy
    }
}

Pessoa p1 = new Pessoa("João", new Endereco("SP"));
Pessoa p2 = new Pessoa(p1); // Cópia
```

### 10. Alternativa: Factory Method

**Método estático** para criar cópia.

```java
public class Pessoa {
    private String nome;
    
    public static Pessoa copiar(Pessoa original) {
        Pessoa copia = new Pessoa();
        copia.nome = original.nome;
        return copia;
    }
}

Pessoa p1 = new Pessoa("João");
Pessoa p2 = Pessoa.copiar(p1);
```

---

## Aplicabilidade

**Use clone() quando**:
- Precisa criar **cópia** de objeto
- Objeto tem **muitos atributos** (evitar construtor complexo)

**Evite clone() quando**:
- Preferir **construtor de cópia** (mais simples)
- Usar **serialização** para deep copy
- Trabalhar com **imutáveis** (não precisa clonar)

**Alternativas preferíveis**:
- **Construtor de cópia**
- **Factory method**
- **Builder pattern**

---

## Armadilhas

### 1. Não Implementar Cloneable

```java
public class Pessoa {
    // ❌ Não implementa Cloneable
    
    @Override
    public Pessoa clone() throws CloneNotSupportedException {
        return (Pessoa) super.clone();
    }
}

Pessoa p1 = new Pessoa("João");
p1.clone(); // CloneNotSupportedException ❌
```

### 2. Shallow Copy em Objetos Mutáveis

```java
public class Pessoa implements Cloneable {
    private Endereco endereco; // Mutável
    
    @Override
    public Pessoa clone() throws CloneNotSupportedException {
        return (Pessoa) super.clone(); // Shallow copy
    }
}

Pessoa p1 = new Pessoa(new Endereco("SP"));
Pessoa p2 = p1.clone();

// ❌ Modificar endereco afeta ambos
p1.endereco.setCidade("RJ");
p2.endereco.getCidade(); // "RJ" (mesmo objeto)
```

### 3. Esquecer de Clonar Objetos Internos

```java
public class Pessoa implements Cloneable {
    private Endereco endereco;
    
    @Override
    public Pessoa clone() throws CloneNotSupportedException {
        Pessoa copia = (Pessoa) super.clone();
        // ❌ Faltando clonar endereco
        return copia;
    }
}
```

### 4. clone() em Subclasses

```java
public class Animal implements Cloneable {
    protected String nome;
    
    @Override
    public Animal clone() throws CloneNotSupportedException {
        return (Animal) super.clone();
    }
}

public class Cachorro extends Animal {
    private String raca;
    
    // ❌ Não sobrescreve clone()
}

Cachorro c1 = new Cachorro("Rex", "Labrador");
Cachorro c2 = (Cachorro) c1.clone(); // ❌ raca não é clonada corretamente
```

### 5. clone() com final

**Campos final** não podem ser modificados em deep copy.

```java
public class Pessoa implements Cloneable {
    private final Endereco endereco; // final
    
    @Override
    public Pessoa clone() throws CloneNotSupportedException {
        Pessoa copia = (Pessoa) super.clone();
        // ❌ Erro: não pode atribuir a final
        copia.endereco = endereco.clone();
        return copia;
    }
}
```

**Solução**: Usar construtor de cópia.

### 6. Não Tornar clone() Público

```java
// ❌ clone() protected (não acessível)
@Override
protected Pessoa clone() throws CloneNotSupportedException {
    return (Pessoa) super.clone();
}

// ✅ Tornar público
@Override
public Pessoa clone() throws CloneNotSupportedException {
    return (Pessoa) super.clone();
}
```

---

## Boas Práticas

### 1. Sempre Implementar Cloneable

```java
public class Pessoa implements Cloneable {
    @Override
    public Pessoa clone() throws CloneNotSupportedException {
        return (Pessoa) super.clone();
    }
}
```

### 2. Retornar Tipo Específico

```java
// ✅ Retorna Pessoa (covariante)
@Override
public Pessoa clone() throws CloneNotSupportedException {
    return (Pessoa) super.clone();
}
```

### 3. Deep Copy Para Objetos Mutáveis

```java
@Override
public Pessoa clone() throws CloneNotSupportedException {
    Pessoa copia = (Pessoa) super.clone();
    copia.endereco = endereco.clone(); // Deep copy
    return copia;
}
```

### 4. Preferir Construtor de Cópia

```java
public class Pessoa {
    private String nome;
    private Endereco endereco;
    
    // Construtor de cópia
    public Pessoa(Pessoa outra) {
        this.nome = outra.nome;
        this.endereco = new Endereco(outra.endereco);
    }
}

Pessoa p2 = new Pessoa(p1); // Mais simples
```

### 5. Tornar clone() Público

```java
@Override
public Pessoa clone() throws CloneNotSupportedException {
    return (Pessoa) super.clone();
}
```

### 6. Subclasses: Chamar super.clone()

```java
public class Cachorro extends Animal implements Cloneable {
    private String raca;
    
    @Override
    public Cachorro clone() throws CloneNotSupportedException {
        Cachorro copia = (Cachorro) super.clone();
        // Clonar atributos específicos se necessário
        return copia;
    }
}
```

### 7. Documentar clone()

```java
/**
 * Cria cópia profunda de Pessoa.
 * @return cópia do objeto
 */
@Override
public Pessoa clone() throws CloneNotSupportedException {
    Pessoa copia = (Pessoa) super.clone();
    copia.endereco = endereco.clone();
    return copia;
}
```

### 8. Imutáveis: Não Precisa clone()

```java
public final class Pessoa {
    private final String nome;
    
    // Imutável: retornar this
    public Pessoa clone() {
        return this; // Não precisa clonar
    }
}
```

### 9. Use Serialização Para Deep Copy

```java
public static <T> T deepCopy(T objeto) throws IOException, ClassNotFoundException {
    ByteArrayOutputStream bos = new ByteArrayOutputStream();
    ObjectOutputStream oos = new ObjectOutputStream(bos);
    oos.writeObject(objeto);
    
    ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
    ObjectInputStream ois = new ObjectInputStream(bis);
    return (T) ois.readObject();
}
```

---

## Resumo

**clone()**:
```java
public class Pessoa implements Cloneable {
    @Override
    public Pessoa clone() throws CloneNotSupportedException {
        return (Pessoa) super.clone();
    }
}
```

**Shallow copy**:
```java
// super.clone() copia referências
Pessoa p2 = p1.clone();
p1.endereco == p2.endereco; // true (mesma referência)
```

**Deep copy**:
```java
@Override
public Pessoa clone() throws CloneNotSupportedException {
    Pessoa copia = (Pessoa) super.clone();
    copia.endereco = endereco.clone(); // Clonar objetos internos
    return copia;
}
```

**Cloneable**:
```java
public class Pessoa implements Cloneable {
    // Permite clonagem
}
```

**CloneNotSupportedException**:
```java
// Lançada se não implementa Cloneable
p.clone(); // CloneNotSupportedException
```

**Construtor de cópia (alternativa)**:
```java
public Pessoa(Pessoa outra) {
    this.nome = outra.nome;
    this.endereco = new Endereco(outra.endereco);
}
```

**Factory method (alternativa)**:
```java
public static Pessoa copiar(Pessoa original) {
    return new Pessoa(original);
}
```

**Arrays**:
```java
int[] copia = original.clone(); // Suporta clone()
```

**Subclasses**:
```java
@Override
public Cachorro clone() throws CloneNotSupportedException {
    return (Cachorro) super.clone();
}
```

**Regra de Ouro**: **Preferir construtor de cópia** em vez de clone(). Se usar clone(), implementar **Cloneable** e fazer **deep copy** de objetos mutáveis. Tornar clone() **público**.
