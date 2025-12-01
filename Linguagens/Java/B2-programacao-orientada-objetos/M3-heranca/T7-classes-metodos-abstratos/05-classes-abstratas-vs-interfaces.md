# T7.05 - Classes Abstratas vs Interfaces

## Introdução

**Classes abstratas** e **interfaces**: ambos definem contratos.

**Classe abstrata**: pode ter estado (atributos), métodos concretos, construtores.

**Interface**: apenas métodos abstratos (antes Java 8), sem estado.

**Java 8+**: interfaces podem ter métodos default e static.

**Características**:
- Classe abstrata: herança única (`extends`)
- Interface: herança múltipla (`implements`)
- Classe abstrata: modificadores de acesso variados
- Interface: todos os métodos são `public`

```java
// Classe abstrata
public abstract class Animal {
    protected String nome; // Estado
    
    public Animal(String nome) { // Construtor
        this.nome = nome;
    }
    
    public abstract void som(); // Método abstrato
    
    public void dormir() { // Método concreto
        System.out.println(nome + " dormindo");
    }
}

// Interface
public interface Voador {
    void voar(); // Método abstrato (implicitamente public)
    
    default void pousar() { // Método default (Java 8+)
        System.out.println("Pousando");
    }
}
```

```java
// Uso
public class Passaro extends Animal implements Voador {
    public Passaro(String nome) {
        super(nome);
    }
    
    @Override
    public void som() {
        System.out.println("Piu piu");
    }
    
    @Override
    public void voar() {
        System.out.println("Voando");
    }
}
```

---

## Fundamentos

### 1. Estado (Atributos)

**Classe abstrata**: pode ter atributos.

**Interface**: não pode ter atributos (apenas constantes `static final`).

```java
// Classe abstrata
public abstract class Animal {
    protected String nome; // ✅ Atributo
    private int idade;     // ✅ Atributo
}

// Interface
public interface Voador {
    // ❌ Não pode ter atributos
    int MAX_ALTURA = 1000; // ✅ Constante (implicitamente public static final)
}
```

### 2. Construtores

**Classe abstrata**: pode ter construtores.

**Interface**: não pode ter construtores.

```java
// Classe abstrata
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) { // ✅ Construtor
        this.nome = nome;
    }
}

// Interface
public interface Voador {
    // ❌ Não pode ter construtores
}
```

### 3. Métodos Concretos

**Classe abstrata**: pode ter métodos concretos.

**Interface**: apenas métodos `default` e `static` (Java 8+).

```java
// Classe abstrata
public abstract class Animal {
    public void dormir() { // ✅ Método concreto
        System.out.println("Dormindo");
    }
}

// Interface (Java 8+)
public interface Voador {
    default void pousar() { // ✅ Método default
        System.out.println("Pousando");
    }
    
    static void info() { // ✅ Método static
        System.out.println("Interface Voador");
    }
}
```

### 4. Herança

**Classe abstrata**: herança única (`extends`).

**Interface**: herança múltipla (`implements`).

```java
// ❌ Erro: herança múltipla de classes
public class Cachorro extends Animal, Mamifero {
}

// ✅ OK: implementar múltiplas interfaces
public class Passaro extends Animal implements Voador, Nadador {
}
```

### 5. Modificadores de Acesso

**Classe abstrata**: `public`, `protected`, `private`, default.

**Interface**: todos os métodos são `public`.

```java
// Classe abstrata
public abstract class Animal {
    public abstract void metodo1();
    protected abstract void metodo2();
    abstract void metodo3(); // default
    // private abstract void metodo4(); // ❌ Erro
}

// Interface
public interface Voador {
    void voar(); // Implicitamente public
}
```

### 6. Métodos static

**Classe abstrata**: pode ter métodos `static`.

**Interface**: pode ter métodos `static` (Java 8+).

```java
// Classe abstrata
public abstract class Animal {
    public static void info() {
        System.out.println("Classe Animal");
    }
}

// Interface (Java 8+)
public interface Voador {
    static void info() {
        System.out.println("Interface Voador");
    }
}
```

### 7. Métodos final

**Classe abstrata**: pode ter métodos `final`.

**Interface**: não pode ter métodos `final`.

```java
// Classe abstrata
public abstract class Animal {
    public final void dormir() { // ✅ Não pode ser sobrescrito
        System.out.println("Dormindo");
    }
}

// Interface
public interface Voador {
    // ❌ Não pode ter métodos final
}
```

### 8. Implementação Parcial

**Classe abstrata**: subclasse abstrata pode implementar parcialmente.

**Interface**: subclasse abstrata pode implementar parcialmente.

```java
// Classe abstrata
public abstract class Animal {
    public abstract void som();
    public abstract void mover();
}

public abstract class Mamifero extends Animal {
    @Override
    public void mover() { // Implementa apenas mover()
        System.out.println("Movendo");
    }
}

// Interface
public interface Voador {
    void voar();
    void pousar();
}

public abstract class Ave implements Voador {
    @Override
    public void voar() { // Implementa apenas voar()
        System.out.println("Voando");
    }
}
```

### 9. Relação "é-um" vs "pode-fazer"

**Classe abstrata**: relação "é-um" (hierarquia).

**Interface**: relação "pode-fazer" (capacidade).

```java
// "é-um": Cachorro é um Animal
public class Cachorro extends Animal {
}

// "pode-fazer": Passaro pode voar
public class Passaro implements Voador {
}
```

### 10. Java 8+ - Métodos default

**Interface**: pode ter métodos `default` com implementação.

```java
public interface Voador {
    void voar(); // Abstrato
    
    default void pousar() { // Default
        System.out.println("Pousando");
    }
}

public class Passaro implements Voador {
    @Override
    public void voar() {
        System.out.println("Voando");
    }
    
    // pousar() herdado da interface
}
```

---

## Aplicabilidade

**Use classe abstrata quando**:
- **Compartilhar código** entre classes relacionadas
- **Estado comum** (atributos)
- **Construtores** necessários
- **Modificadores** (protected, private) importantes
- **Hierarquia de classes** com relação "é-um"

**Use interface quando**:
- **Contrato** sem implementação
- **Herança múltipla** necessária
- **Capacidade** que classes não relacionadas podem ter
- **API pública** (todos os métodos public)
- Relação "pode-fazer"

**Exemplos**:
```java
// Classe abstrata: hierarquia
public abstract class Veiculo {
    protected String marca;
    protected int ano;
    
    public abstract void acelerar();
}

// Interface: capacidade
public interface Eletrico {
    void carregarBateria();
}

// Uso
public class CarroEletrico extends Veiculo implements Eletrico {
    // Herda estado de Veiculo
    // Implementa capacidade Eletrico
}
```

---

## Armadilhas

### 1. Confundir "é-um" com "pode-fazer"

```java
// ❌ Errado: Cachorro não "é-um" Voador
public class Cachorro extends Voador {
}

// ✅ Correto: Cachorro "é-um" Animal
public class Cachorro extends Animal {
}

// ✅ Correto: Passaro "pode-fazer" Voar
public class Passaro implements Voador {
}
```

### 2. Usar Classe Abstrata Para Herança Múltipla

```java
// ❌ Erro: herança múltipla de classes
public class Pato extends Animal, Voador {
}

// ✅ Correto
public class Pato extends Animal implements Voador, Nadador {
}
```

### 3. Interface Com Estado

```java
// ❌ Erro: interface não pode ter atributos
public interface Voador {
    String nome; // Erro
}

// ✅ Correto: apenas constantes
public interface Voador {
    int MAX_ALTURA = 1000; // public static final
}
```

### 4. Classe Abstrata Sem Necessidade

```java
// ❌ Desnecessário: nenhum estado ou método concreto
public abstract class Voador {
    public abstract void voar();
}

// ✅ Melhor: use interface
public interface Voador {
    void voar();
}
```

### 5. Interface Com Construtores

```java
// ❌ Erro: interface não pode ter construtores
public interface Voador {
    Voador() { }
}
```

### 6. Métodos private em Interface (Java 9+)

```java
// ✅ Java 9+: métodos private auxiliares
public interface Voador {
    default void voar() {
        validar();
        System.out.println("Voando");
    }
    
    private void validar() {
        System.out.println("Validando");
    }
}
```

### 7. Diamond Problem em Interfaces

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

// ❌ Erro: ambiguidade
public class C implements A, B {
}

// ✅ Correto: resolver explicitamente
public class C implements A, B {
    @Override
    public void metodo() {
        A.super.metodo(); // Escolhe A
    }
}
```

---

## Boas Práticas

### 1. Prefira Interfaces Para Contratos

```java
// ✅ Interface para contrato simples
public interface Comparable<T> {
    int compareTo(T other);
}

// ✅ Classe abstrata para comportamento comum
public abstract class Animal {
    protected String nome;
    
    public abstract void som();
    
    public void dormir() {
        System.out.println(nome + " dormindo");
    }
}
```

### 2. Combine Ambos

```java
public abstract class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
    
    public abstract void som();
}

public interface Voador {
    void voar();
}

public class Passaro extends Animal implements Voador {
    public Passaro(String nome) {
        super(nome);
    }
    
    @Override
    public void som() {
        System.out.println("Piu piu");
    }
    
    @Override
    public void voar() {
        System.out.println(nome + " voando");
    }
}
```

### 3. Use Interfaces Para Capacidades

```java
public interface Nadador {
    void nadar();
}

public interface Voador {
    void voar();
}

public interface Corredor {
    void correr();
}

public class Pato extends Animal implements Nadador, Voador, Corredor {
    @Override
    public void nadar() { }
    
    @Override
    public void voar() { }
    
    @Override
    public void correr() { }
}
```

### 4. Métodos default Para Retrocompatibilidade

```java
public interface MinhaInterface {
    void metodo1();
    
    // Java 8+: adicionar novo método sem quebrar implementações existentes
    default void metodo2() {
        System.out.println("Implementação padrão");
    }
}
```

### 5. Classes Abstratas Para Template Method

```java
public abstract class Processador {
    public final void processar() {
        passo1();
        passo2();
        passo3();
    }
    
    protected abstract void passo1();
    protected abstract void passo2();
    protected abstract void passo3();
}
```

### 6. Interfaces Para Segregação

```java
// ✅ Interfaces pequenas e coesas
public interface Leitura {
    String ler();
}

public interface Escrita {
    void escrever(String conteudo);
}

// ❌ Interface grande e não coesa
public interface Arquivo {
    String ler();
    void escrever(String conteudo);
    void fechar();
    void abrir();
    void deletar();
}
```

### 7. Use Classe Abstrata Para Código Compartilhado

```java
public abstract class RepositorioBase<T> {
    protected List<T> itens = new ArrayList<>();
    
    public void adicionar(T item) {
        validar(item);
        itens.add(item);
    }
    
    public List<T> listarTodos() {
        return new ArrayList<>(itens);
    }
    
    protected abstract void validar(T item);
}
```

### 8. Functional Interfaces

```java
@FunctionalInterface
public interface Calculadora {
    int calcular(int a, int b);
    
    // Apenas um método abstrato para lambdas
}

// Uso com lambda
Calculadora soma = (a, b) -> a + b;
```

### 9. Documente Diferenças de Uso

```java
/**
 * Classe base para todos os animais.
 * Use para compartilhar estado e comportamento comum.
 */
public abstract class Animal {
}

/**
 * Interface para entidades que podem voar.
 * Use para adicionar capacidade de voo a qualquer classe.
 */
public interface Voador {
}
```

---

## Resumo

**Classe Abstrata**:
```java
public abstract class Animal {
    protected String nome; // Estado
    
    public Animal(String nome) { // Construtor
        this.nome = nome;
    }
    
    public abstract void som(); // Abstrato
    
    public void dormir() { // Concreto
        System.out.println("Dormindo");
    }
}
```

**Interface**:
```java
public interface Voador {
    void voar(); // Abstrato (implicitamente public)
    
    default void pousar() { // Default (Java 8+)
        System.out.println("Pousando");
    }
    
    static void info() { // Static (Java 8+)
        System.out.println("Interface Voador");
    }
}
```

**Diferenças**:
| Aspecto | Classe Abstrata | Interface |
|---------|----------------|-----------|
| Estado | ✅ Atributos | ❌ Apenas constantes |
| Construtores | ✅ Sim | ❌ Não |
| Métodos concretos | ✅ Sim | ✅ default/static (Java 8+) |
| Herança | Única (`extends`) | Múltipla (`implements`) |
| Modificadores | public/protected/private | public |
| Métodos final | ✅ Sim | ❌ Não |
| Relação | "é-um" | "pode-fazer" |

**Quando usar**:

**Classe abstrata**:
- ✅ Compartilhar código
- ✅ Estado comum (atributos)
- ✅ Construtores
- ✅ Hierarquia "é-um"
- ✅ Template Method

**Interface**:
- ✅ Contrato simples
- ✅ Herança múltipla
- ✅ Capacidade "pode-fazer"
- ✅ API pública
- ✅ Segregação de interfaces

**Combine ambos**:
```java
public class Passaro extends Animal implements Voador, Nadador {
    // Herda estado de Animal
    // Implementa capacidades Voador e Nadador
}
```

**Regra de Ouro**: Use **classe abstrata** para **compartilhar estado e comportamento**. Use **interface** para **contratos** e **capacidades**. Combine para **máxima flexibilidade**.
