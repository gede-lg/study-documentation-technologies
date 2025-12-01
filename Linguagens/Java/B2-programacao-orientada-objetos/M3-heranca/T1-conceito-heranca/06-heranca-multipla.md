# T1.06 - Java Não Suporta Herança Múltipla de Classes

## Introdução

**Java não permite herança múltipla de classes**: uma classe pode estender **apenas uma** superclasse.

**Razão**: Evitar **problema do diamante** (ambiguidade).

```java
// ❌ ERRO: Herança múltipla não permitida
// public class Cachorro extends Animal, Mamifero {}

// ✅ CORRETO: Apenas uma superclasse
public class Cachorro extends Animal {}

// ✅ ALTERNATIVA: Use interfaces
public class Cachorro extends Animal implements Nadador, Corredor {}
```

**Solução**: Use **interfaces** para múltiplas capacidades.

---

## Fundamentos

### 1. Herança Simples em Java

**Apenas uma superclasse** por classe.

```java
// ✅ Herança simples
public class Animal {
    public void respirar() {}
}

public class Cachorro extends Animal {
    // Herda apenas de Animal
}

// ❌ Herança múltipla (ERRO)
// public class Cachorro extends Animal, Mamifero {}
```

### 2. Problema do Diamante

**Por que Java proíbe herança múltipla?**

```
      A
     / \
    B   C
     \ /
      D
```

**Cenário problemático** (se Java permitisse):

```java
// Classe base
public class A {
    public void metodo() {
        System.out.println("A");
    }
}

// B e C sobrescrevem metodo()
public class B extends A {
    @Override
    public void metodo() {
        System.out.println("B");
    }
}

public class C extends A {
    @Override
    public void metodo() {
        System.out.println("C");
    }
}

// ❌ Se Java permitisse (NÃO PERMITE)
// D herda de B e C, mas qual metodo() usar?
// public class D extends B, C {
//     // D.metodo() → chama B.metodo() ou C.metodo()?
// }
```

**Ambiguidade**: D não saberia qual `metodo()` herdar (B ou C).

### 3. Solução: Interfaces

**Java permite múltiplas interfaces**.

```java
// Interfaces (contratos)
public interface Nadador {
    void nadar();
}

public interface Voador {
    void voar();
}

// ✅ Uma classe + múltiplas interfaces
public class Pato extends Animal implements Nadador, Voador {
    @Override
    public void nadar() {
        System.out.println("Nadando");
    }
    
    @Override
    public void voar() {
        System.out.println("Voando");
    }
}
```

**Interfaces não causam problema do diamante** porque não contêm implementação (antes do Java 8).

### 4. Herança de Interfaces

**Interface pode estender múltiplas interfaces**.

```java
public interface A {
    void metodoA();
}

public interface B {
    void metodoB();
}

// ✅ Interface pode estender múltiplas
public interface C extends A, B {
    void metodoC();
}

// Classe implementa C (deve implementar A, B e C)
public class Implementacao implements C {
    @Override
    public void metodoA() {}
    
    @Override
    public void metodoB() {}
    
    @Override
    public void metodoC() {}
}
```

### 5. Default Methods e Conflitos (Java 8+)

**Interfaces podem ter métodos default** (com implementação).

```java
public interface A {
    default void metodo() {
        System.out.println("A");
    }
}

public interface B {
    default void metodo() {
        System.out.println("B");
    }
}

// ✅ Classe deve resolver ambiguidade
public class Classe implements A, B {
    @Override
    public void metodo() {
        A.super.metodo(); // Escolhe explicitamente A
        // Ou B.super.metodo();
        // Ou implementação própria
    }
}
```

**Java obriga resolver conflitos** explicitamente.

### 6. Composição Como Alternativa

**Em vez de herança múltipla**, use **composição**.

```java
// ❌ Tentativa de herança múltipla
// public class Anfibio extends Animal, Veiculo {}

// ✅ Composição
public class Anfibio {
    private Animal animal;
    private Veiculo veiculo;
    
    public void moverComoAnimal() {
        animal.mover();
    }
    
    public void moverComoVeiculo() {
        veiculo.mover();
    }
}
```

### 7. Linguagens Que Permitem Herança Múltipla

**C++** permite herança múltipla:

```cpp
// C++ (não Java)
class A {};
class B {};

class C : public A, public B {}; // ✅ C++ permite
```

**Python** permite herança múltipla:

```python
# Python (não Java)
class A: pass
class B: pass

class C(A, B): pass  # ✅ Python permite
```

**Java escolheu simplicidade** sobre flexibilidade.

### 8. Object é Superclasse Universal

**Todas classes herdam de `Object`** (implicitamente).

```java
// Equivalente
public class MinhaClasse {}
public class MinhaClasse extends Object {}

// Todas classes têm métodos de Object
public class Teste {
    public static void main(String[] args) {
        MinhaClasse obj = new MinhaClasse();
        System.out.println(obj.toString());  // De Object
        System.out.println(obj.hashCode());  // De Object
        System.out.println(obj.getClass());  // De Object
    }
}
```

### 9. Hierarquias Profundas vs Interfaces

**Hierarquia profunda**:

```java
// ❌ Profundo e rígido
Animal → Vertebrado → Mamifero → Carnivoro → Felino → Gato
```

**Hierarquia rasa + interfaces**:

```java
// ✅ Raso e flexível
public class Gato extends Animal implements Carnivoro, Felino {}
```

### 10. Exemplo Prático

**Cenário**: Veículo anfíbio (terrestre e aquático).

```java
// ❌ Não funciona
// public class Anfibio extends VeiculoTerrestre, VeiculoAquatico {}

// ✅ Solução 1: Interfaces
public interface Terrestre {
    void moverEmTerra();
}

public interface Aquatico {
    void moverNaAgua();
}

public class Anfibio extends Veiculo implements Terrestre, Aquatico {
    @Override
    public void moverEmTerra() {
        System.out.println("Movendo em terra");
    }
    
    @Override
    public void moverNaAgua() {
        System.out.println("Movendo na água");
    }
}

// ✅ Solução 2: Composição
public class Anfibio {
    private VeiculoTerrestre parteTerrestre;
    private VeiculoAquatico parteAquatica;
    
    public void moverEmTerra() {
        parteTerrestre.mover();
    }
    
    public void moverNaAgua() {
        parteAquatica.mover();
    }
}
```

---

## Aplicabilidade

**Use interfaces quando**:
- **Múltiplas capacidades** (Nadador, Voador)
- **Contratos múltiplos** (Comparable, Serializable)
- **Flexibilidade** (trocar implementação)

**Use composição quando**:
- **Comportamentos complexos** (Anfibio com Motor e Remo)
- **Reutilizar implementações** de múltiplas classes
- **Evitar acoplamento** rígido

---

## Armadilhas

### 1. Tentar Herança Múltipla

```java
// ❌ ERRO DE COMPILAÇÃO
// public class Classe extends A, B {}

// ✅ Use interface
public class Classe extends A implements B {}
```

### 2. Conflitos de Default Methods

```java
public interface A {
    default void metodo() {}
}

public interface B {
    default void metodo() {}
}

// ❌ Erro: ambiguidade
// public class Classe implements A, B {}

// ✅ Resolva explicitamente
public class Classe implements A, B {
    @Override
    public void metodo() {
        A.super.metodo(); // Escolhe A
    }
}
```

### 3. Herança Profunda em Vez de Interfaces

```java
// ❌ Hierarquia rígida
Animal → Mamifero → Carnivoro → Felino → Gato

// ✅ Interfaces flexíveis
public class Gato extends Animal implements Carnivoro, Felino {}
```

---

## Boas Práticas

### 1. Prefira Interfaces Para Capacidades

```java
public interface Nadador {
    void nadar();
}

public class Pato extends Animal implements Nadador {}
```

### 2. Use Composição Para Reutilizar Código

```java
public class Anfibio {
    private Motor motor;
    private Remo remo;
}
```

### 3. Resolva Conflitos de Default Methods

```java
@Override
public void metodo() {
    InterfaceA.super.metodo(); // Explícito
}
```

### 4. Documente Escolhas de Design

```java
/**
 * Anfibio implementa Terrestre e Aquatico
 * (não pode estender ambas as classes).
 */
public class Anfibio implements Terrestre, Aquatico {}
```

### 5. Mantenha Hierarquias Rasas

**Máximo 3-5 níveis** de herança.

---

## Resumo

**Java não suporta herança múltipla de classes**:

**Problema do diamante**:
```
      A
     / \
    B   C
     \ /
      D  (qual metodo() usar?)
```

**Herança simples**:
```java
// ✅ Apenas uma superclasse
public class Cachorro extends Animal {}

// ❌ Múltiplas superclasses
// public class Cachorro extends Animal, Mamifero {}
```

**Solução 1: Interfaces**:
```java
// ✅ Uma classe + múltiplas interfaces
public class Pato extends Animal implements Nadador, Voador {
    @Override
    public void nadar() {}
    
    @Override
    public void voar() {}
}
```

**Solução 2: Composição**:
```java
// ✅ Composição
public class Anfibio {
    private VeiculoTerrestre terrestre;
    private VeiculoAquatico aquatico;
}
```

**Default methods (Java 8+)**:
```java
// Se conflito, resolva explicitamente
@Override
public void metodo() {
    InterfaceA.super.metodo();
}
```

**Comparação com outras linguagens**:
- **Java**: Herança simples + múltiplas interfaces
- **C++**: Herança múltipla permitida
- **Python**: Herança múltipla permitida

**Regra de Ouro**: Java permite **apenas uma superclasse** para evitar ambiguidade. Use **interfaces** para múltiplas capacidades e **composição** para reutilizar código de múltiplas fontes.
