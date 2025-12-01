# T1.02 - Hierarquia de Classes

## Introdução

**Hierarquia de classes** organiza classes em **estrutura de árvore**, com classes **mais genéricas** no topo e classes **mais específicas** nas folhas.

**Analogia**: Classificação biológica (Reino → Filo → Classe → Ordem → Família → Gênero → Espécie).

```java
// Hierarquia simples
Animal (raiz)
  ├── Mamifero
  │     ├── Cachorro
  │     └── Gato
  └── Ave
        ├── Passaro
        └── Aguia
```

**Benefícios**: Organização, reutilização, manutenibilidade.

---

## Fundamentos

### 1. Estrutura de Árvore

**Hierarquia é uma árvore** com **raiz** (classe base) e **folhas** (classes finais).

```java
// Nível 0: Raiz (mais genérica)
public class Ser {
    public void existir() {
        System.out.println("Existindo...");
    }
}

// Nível 1
public class SerVivo extends Ser {
    public void viver() {
        System.out.println("Vivendo...");
    }
}

// Nível 2
public class Animal extends SerVivo {
    public void mover() {
        System.out.println("Movendo...");
    }
}

// Nível 3 (folhas)
public class Cachorro extends Animal {
    public void latir() {
        System.out.println("Au au!");
    }
}
```

**Herança acumulativa**: `Cachorro` herda `latir()` (próprio), `mover()` (Animal), `viver()` (SerVivo), `existir()` (Ser).

### 2. Classe Raiz (Base)

**Classe no topo da hierarquia**, sem superclasse (ou estende `Object`).

```java
// Object (raiz implícita de todas classes Java)
public class MinhaClasse {}
// Equivalente a: public class MinhaClasse extends Object {}

// Raiz explícita de hierarquia customizada
public class Veiculo {
    protected String marca;
    
    public void mover() {
        System.out.println("Movendo...");
    }
}
```

**Características**:
- Contém **comportamento mais genérico**
- **Não herda** de nenhuma classe (exceto `Object`)
- Define **contrato comum** para subclasses

### 3. Classes Intermediárias

**Classes entre raiz e folhas**, refinam comportamento.

```java
// Raiz
public class Veiculo {
    public void mover() {}
}

// Intermediária (refina Veiculo)
public class VeiculoMotorizado extends Veiculo {
    public void ligarMotor() {}
}

// Intermediária (refina VeiculoMotorizado)
public class VeiculoTerrestre extends VeiculoMotorizado {
    public void acelerar() {}
}

// Folha (final da hierarquia)
public class Carro extends VeiculoTerrestre {
    public void abrirPorta() {}
}
```

### 4. Classes Folha (Concretas)

**Classes no final da hierarquia**, geralmente **instanciáveis**.

```java
public abstract class Animal {
    public abstract void emitirSom();
}

// Folhas (concretas)
public class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
}

public class Gato extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Miau!");
    }
}

// Uso
Animal a1 = new Cachorro(); // ✅ Folha concreta
Animal a2 = new Gato();     // ✅ Folha concreta
// Animal a3 = new Animal(); // ❌ Abstrata (não instanciável)
```

### 5. Profundidade da Hierarquia

**Número de níveis** da raiz até as folhas.

```java
// Profundidade 1
Object → MinhaClasse

// Profundidade 3
Object → Animal → Mamifero → Cachorro

// Profundidade excessiva (evitar)
Object → Ser → SerVivo → Animal → Vertebrado → Mamifero 
       → Carnivoro → Canideo → Cachorro
```

**Recomendação**: Máximo **3-5 níveis** (hierarquias profundas são difíceis de manter).

### 6. Largura da Hierarquia

**Número de subclasses diretas** de uma classe.

```java
// Largura 3 (Animal tem 3 subclasses diretas)
public abstract class Animal {}

public class Cachorro extends Animal {}
public class Gato extends Animal {}
public class Passaro extends Animal {}

// Largura excessiva (difícil gerenciar)
public abstract class Forma {}
public class Circulo extends Forma {}
public class Quadrado extends Forma {}
public class Triangulo extends Forma {}
public class Retangulo extends Forma {}
public class Losango extends Forma {}
public class Trapezio extends Forma {}
// ... 20 subclasses
```

**Recomendação**: **Limite a largura** (5-7 subclasses diretas), use hierarquias intermediárias.

### 7. Exemplo: Collections Framework

**Hierarquia real do Java**:

```java
// Raiz
Iterable
  └── Collection
        ├── List
        │     ├── ArrayList
        │     └── LinkedList
        ├── Set
        │     ├── HashSet
        │     └── TreeSet
        └── Queue
              ├── PriorityQueue
              └── LinkedList
```

**Organização**:
- `Iterable`: Capacidade de iterar
- `Collection`: Coleção genérica
- `List/Set/Queue`: Tipos específicos
- `ArrayList/HashSet`: Implementações concretas

### 8. Navegando a Hierarquia

**Referências podem apontar para qualquer nível**:

```java
public class Animal {
    public void mover() {}
}

public class Mamifero extends Animal {
    public void amamentar() {}
}

public class Cachorro extends Mamifero {
    public void latir() {}
}

// Referências em diferentes níveis
Cachorro c1 = new Cachorro();  // Tipo específico
Mamifero c2 = new Cachorro();  // Tipo intermediário
Animal c3 = new Cachorro();    // Tipo raiz
Object c4 = new Cachorro();    // Tipo Object

c1.latir();      // ✅ Cachorro tem latir()
// c2.latir();   // ❌ Mamifero não tem latir()
// c3.latir();   // ❌ Animal não tem latir()
```

### 9. Hierarquias Múltiplas (Interfaces)

**Java não suporta herança múltipla de classes**, mas permite **múltiplas interfaces**.

```java
// Hierarquia de classes (única)
public class Animal {}
public class Mamifero extends Animal {}

// Hierarquias de interfaces (múltiplas)
public interface Nadador {}
public interface Voador {}

public class Pato extends Animal implements Nadador, Voador {
    // Herda de Animal
    // Implementa Nadador e Voador
}
```

### 10. Visualizando Hierarquias

**UML (Unified Modeling Language)**:

```
┌─────────────┐
│   Animal    │ (classe abstrata)
└─────────────┘
       △
       │
   ┌───┴────┐
   │        │
┌──────┐ ┌──────┐
│ Gato │ │ Cão  │ (classes concretas)
└──────┘ └──────┘
```

**Código**:
```java
public abstract class Animal {
    public abstract void emitirSom();
}

public class Gato extends Animal {
    public void emitirSom() {
        System.out.println("Miau");
    }
}

public class Cao extends Animal {
    public void emitirSom() {
        System.out.println("Au au");
    }
}
```

---

## Aplicabilidade

**Use hierarquias quando**:
- **Organizar conceitos** relacionados (Animal → Mamífero → Cachorro)
- **Reutilizar código** comum
- **Modelar domínio** com especialização natural
- **Facilitar polimorfismo** (tratar objetos genericamente)

**Evite hierarquias quando**:
- **Relação não é "é-um"** (use composição)
- **Hierarquia muito profunda** (>5 níveis)
- **Hierarquia muito larga** (>7 subclasses diretas)

---

## Armadilhas

### 1. Hierarquia Excessivamente Profunda

```java
// ❌ Muito profundo (difícil navegar/manter)
Object → A → B → C → D → E → F → G → H

// ✅ Mais raso
Object → A → H (usar composição para níveis intermediários)
```

### 2. Hierarquia Excessivamente Larga

```java
// ❌ Muito largo (difícil gerenciar)
Animal (30 subclasses diretas)

// ✅ Hierarquia intermediária
Animal
  ├── Mamifero (10 subclasses)
  ├── Ave (10 subclasses)
  └── Reptil (10 subclasses)
```

### 3. Classe Base Muito Específica

```java
// ❌ Base específica (limita reutilização)
public class CachorroGrande {
    // Cachorro pequeno não se encaixa
}

// ✅ Base genérica
public class Cachorro {
    protected String tamanho;
}
```

---

## Boas Práticas

### 1. Mantenha Hierarquias Rasas

**Máximo 3-5 níveis** de profundidade.

### 2. Limite Largura das Subclasses

**5-7 subclasses diretas** por classe.

### 3. Classes Abstratas nos Níveis Superiores

```java
// ✅ Abstrata (não instanciar diretamente)
public abstract class Animal {
    public abstract void emitirSom();
}

// ✅ Concretas (folhas)
public class Cachorro extends Animal {}
```

### 4. Use Composição Para Complexidade

```java
// ❌ Hierarquia profunda
VeiculoTerrestre → VeiculoMotorizado → VeiculoQuatroRodas → Carro

// ✅ Composição
public class Carro {
    private Motor motor;      // Composição
    private Rodas rodas;      // Composição
}
```

### 5. Documente a Hierarquia

```java
/**
 * Hierarquia:
 * Animal (abstrata)
 *   ├── Mamifero (abstrata)
 *   │     ├── Cachorro
 *   │     └── Gato
 *   └── Ave (abstrata)
 *         ├── Passaro
 *         └── Aguia
 */
public abstract class Animal {}
```

---

## Resumo

**Hierarquia de classes**:

**Estrutura**:
```
Raiz (genérica)
  └── Intermediária
        └── Folha (específica)
```

**Exemplo**:
```java
// Raiz
public class Animal {
    public void mover() {}
}

// Intermediária
public class Mamifero extends Animal {
    public void amamentar() {}
}

// Folha
public class Cachorro extends Mamifero {
    public void latir() {}
}
```

**Níveis**:
- **Raiz**: Comportamento genérico (`Animal`)
- **Intermediária**: Refinamento (`Mamifero`)
- **Folha**: Implementação concreta (`Cachorro`)

**Características**:
- **Profundidade**: Número de níveis (ideal: 3-5)
- **Largura**: Subclasses diretas (ideal: 5-7)
- **Herança acumulativa**: Folhas herdam de todos ancestrais

**Exemplo real (Collections)**:
```
Iterable → Collection → List → ArrayList
```

**Regra de Ouro**: Hierarquias **rasas e focadas** são mais **fáceis de manter** que hierarquias **profundas e complexas**. Use composição quando a hierarquia crescer demais.
