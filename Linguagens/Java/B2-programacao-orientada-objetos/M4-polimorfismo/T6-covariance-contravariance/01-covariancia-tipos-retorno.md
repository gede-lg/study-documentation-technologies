# T6.01 - Covariância em Tipos de Retorno

## Introdução

**Covariância em tipos de retorno**: método sobrescrito pode retornar **subtipo** do tipo de retorno original, preservando compatibilidade.

```java
public class Animal {
    public Animal criar() {
        return new Animal();
    }
}

public class Cachorro extends Animal {
    @Override
    public Cachorro criar() { // Covariante: subtipo de Animal
        return new Cachorro();
    }
}

Cachorro c = new Cachorro();
Cachorro c2 = c.criar(); // Sem cast
```

**Covariância**: tipo de retorno **varia junto** (co-varia) com a hierarquia de classes.

**Introduzido**: Java 5 (2004).

**Benefícios**:
- **Type safety** (elimina casts)
- **API mais limpa**
- **Polimorfismo mais expressivo**

---

## Fundamentos

### 1. Definição de Covariância

**Covariante**: se `A` é subtipo de `B`, então `f(A)` é subtipo de `f(B)`.

```java
// Cachorro é subtipo de Animal
// criar(): Animal é subtipo de criar(): Cachorro (covariante)

public class Animal {
    public Animal criar() { return new Animal(); }
}

public class Cachorro extends Animal {
    @Override
    public Cachorro criar() { return new Cachorro(); } // Covariante
}
```

### 2. Retornar Subtipo

Método sobrescrito pode retornar **tipo mais específico**.

```java
public class Forma {
    public Forma copiar() {
        return new Forma();
    }
}

public class Circulo extends Forma {
    @Override
    public Circulo copiar() { // Subtipo de Forma
        return new Circulo();
    }
}
```

### 3. Type Safety

Covariância **elimina necessidade de cast**.

```java
// Sem covariância (Java 1.4)
Forma f = forma.copiar();
Circulo c = (Circulo) f; // Cast necessário

// Com covariância (Java 5+)
Circulo c = circulo.copiar(); // Sem cast
```

### 4. Clone com Covariância

**clone()** é exemplo clássico de covariância.

```java
public class Pessoa implements Cloneable {
    private String nome;
    
    @Override
    public Pessoa clone() { // Covariante: Object → Pessoa
        try {
            return (Pessoa) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}

Pessoa p1 = new Pessoa();
Pessoa p2 = p1.clone(); // Sem cast
```

### 5. Hierarquia de Classes

Covariância funciona em **qualquer nível** da hierarquia.

```java
public class Animal {
    public Animal criar() { return new Animal(); }
}

public class Mamifero extends Animal {
    @Override
    public Mamifero criar() { return new Mamifero(); }
}

public class Cachorro extends Mamifero {
    @Override
    public Cachorro criar() { return new Cachorro(); }
}

// Animal → Mamifero → Cachorro (covariante em todos os níveis)
```

### 6. Interfaces e Covariância

Covariância funciona com **interfaces**.

```java
public interface Factory {
    Object criar();
}

public class StringFactory implements Factory {
    @Override
    public String criar() { // Covariante: String subtipo de Object
        return "texto";
    }
}
```

### 7. Collections e Covariância

Covariância com **Collections**.

```java
public class Repositorio {
    public Collection<String> buscarTodos() {
        return new ArrayList<>();
    }
}

public class RepositorioAvancado extends Repositorio {
    @Override
    public List<String> buscarTodos() { // List subtipo de Collection
        return new ArrayList<>();
    }
}
```

### 8. Optional e Covariância

Covariância com **Optional**.

```java
public class Service {
    public Optional<Object> buscar(int id) {
        return Optional.empty();
    }
}

public class StringService extends Service {
    @Override
    public Optional<String> buscar(int id) { // Covariante
        return Optional.of("texto");
    }
}
```

### 9. Stream e Covariância

Covariância com **Stream**.

```java
public class Processador {
    public Stream<Number> processar() {
        return Stream.of(1, 2, 3);
    }
}

public class ProcessadorInteiro extends Processador {
    @Override
    public Stream<Integer> processar() { // Covariante
        return Stream.of(1, 2, 3);
    }
}
```

### 10. Restrições de Covariância

Covariância **não funciona** com:
- **Primitivos** (int, double, etc.)
- **Parâmetros** (contravariância não suportada)
- **Tipos não relacionados**

```java
// ❌ Primitivos
public class Teste {
    public long metodo() { return 0; }
}
public class TesteFilho extends Teste {
    @Override
    public int metodo() { return 0; } // ❌ Erro: int não é subtipo de long
}

// ❌ Tipos não relacionados
public class Animal {
    public Animal criar() { return new Animal(); }
}
public class Cachorro extends Animal {
    @Override
    public String criar() { return ""; } // ❌ Erro: String não é subtipo de Animal
}
```

---

## Aplicabilidade

**Use covariância quando**:
- **Factory Method** (criar instâncias específicas)
- **Clone** (retornar tipo específico)
- **Builder** (fluent interface)
- **Repository** (buscar tipos específicos)
- **Type safety** (eliminar casts)
- **Polimorfismo** mais expressivo

**Evite covariância quando**:
- Tipo de retorno **não é subtipo**
- **Primitivos** (usar wrapper se necessário)
- **API pública** que não deve mudar

---

## Armadilhas

### 1. Tipo Não É Subtipo

```java
public class Animal {
    public Animal criar() { return new Animal(); }
}

public class Cachorro extends Animal {
    @Override
    public String criar() { return ""; } // ❌ Erro: String não é subtipo
}
```

### 2. Primitivos Não São Covariantes

```java
public class Teste {
    public double metodo() { return 10.0; }
}

public class TesteFilho extends Teste {
    @Override
    public int metodo() { return 10; } // ❌ Erro: int não é subtipo de double
}

// ✅ Solução: wrappers
public class Teste2 {
    public Number metodo() { return 10.0; }
}
public class TesteFilho2 extends Teste2 {
    @Override
    public Integer metodo() { return 10; } // OK: Integer subtipo de Number
}
```

### 3. Confundir Sobrecarga com Sobrescrita

```java
public class Animal {
    public Animal criar() { return new Animal(); }
}

public class Cachorro extends Animal {
    // ⚠️ Sobrecarga (não sobrescrita)
    public Cachorro criar(String nome) {
        return new Cachorro();
    }
}

Cachorro c = new Cachorro();
Animal a = c.criar(); // Chama Animal.criar() - retorna Animal
```

### 4. Generics Não São Covariantes

```java
List<Animal> animais = new ArrayList<Cachorro>(); // ❌ Erro: generics invariantes

// ✅ Solução: wildcard
List<? extends Animal> animais2 = new ArrayList<Cachorro>(); // OK
```

### 5. Arrays São Covariantes (Perigoso)

```java
Animal[] animais = new Cachorro[5]; // OK: array covariante

animais[0] = new Cachorro(); // OK
animais[1] = new Gato();     // ❌ Runtime: ArrayStoreException

// Arrays covariantes não são type-safe
```

### 6. Covariância e Null

```java
public class Animal {
    public Animal criar() { return new Animal(); }
}

public class Cachorro extends Animal {
    @Override
    public Cachorro criar() {
        return null; // OK: null é compatível
    }
}
```

### 7. Covariância em Hierarquia Profunda

```java
public class A {
    public A metodo() { return new A(); }
}

public class B extends A {
    @Override
    public B metodo() { return new B(); }
}

public class C extends B {
    @Override
    public C metodo() { return new C(); }
}

// Covariante em todos os níveis
```

---

## Boas Práticas

### 1. Clone com Covariância

```java
public class Pessoa implements Cloneable {
    private String nome;
    private int idade;
    
    @Override
    public Pessoa clone() { // Covariante
        try {
            return (Pessoa) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}

Pessoa p1 = new Pessoa();
Pessoa p2 = p1.clone(); // Sem cast
```

### 2. Factory Method

```java
public abstract class Documento {
    public abstract Documento criar();
}

public class DocumentoPDF extends Documento {
    @Override
    public DocumentoPDF criar() { // Covariante
        return new DocumentoPDF();
    }
}

public class DocumentoWord extends Documento {
    @Override
    public DocumentoWord criar() { // Covariante
        return new DocumentoWord();
    }
}

// Uso
DocumentoPDF pdf = new DocumentoPDF();
DocumentoPDF novoPdf = pdf.criar(); // Sem cast
```

### 3. Builder com Covariância

```java
public class Builder {
    protected String nome;
    
    public Builder setNome(String nome) {
        this.nome = nome;
        return this; // Retorna Builder
    }
}

public class BuilderAvancado extends Builder {
    private int idade;
    
    @Override
    public BuilderAvancado setNome(String nome) { // Covariante
        super.setNome(nome);
        return this; // Retorna BuilderAvancado
    }
    
    public BuilderAvancado setIdade(int idade) {
        this.idade = idade;
        return this;
    }
}

// Fluent interface sem cast
BuilderAvancado builder = new BuilderAvancado()
    .setNome("João")  // Retorna BuilderAvancado
    .setIdade(30);    // OK
```

### 4. Repository

```java
public interface Repository<T> {
    Optional<T> buscar(int id);
    List<T> buscarTodos();
}

public class AnimalRepository implements Repository<Animal> {
    @Override
    public Optional<Animal> buscar(int id) {
        return Optional.empty();
    }
    
    @Override
    public List<Animal> buscarTodos() {
        return new ArrayList<>();
    }
}

public class CachorroRepository extends AnimalRepository {
    @Override
    public Optional<Cachorro> buscar(int id) { // Covariante
        return Optional.of(new Cachorro());
    }
    
    @Override
    public List<Cachorro> buscarTodos() { // Covariante
        return new ArrayList<>();
    }
}
```

### 5. Prototype Pattern

```java
public abstract class Forma implements Cloneable {
    private int x, y;
    
    @Override
    public abstract Forma clone();
}

public class Circulo extends Forma {
    private double raio;
    
    @Override
    public Circulo clone() { // Covariante
        try {
            return (Circulo) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}

Circulo c1 = new Circulo();
Circulo c2 = c1.clone(); // Sem cast
```

### 6. Comparable com Covariância

```java
public class Pessoa implements Comparable<Pessoa> {
    private String nome;
    
    @Override
    public int compareTo(Pessoa outra) {
        return nome.compareTo(outra.nome);
    }
}

// Subclasse pode refinar
public class Funcionario extends Pessoa implements Comparable<Funcionario> {
    private double salario;
    
    @Override
    public int compareTo(Funcionario outro) { // Covariante
        return Double.compare(this.salario, outro.salario);
    }
}
```

### 7. Iterator com Covariância

```java
public class AnimalCollection implements Iterable<Animal> {
    @Override
    public Iterator<Animal> iterator() {
        return new ArrayList<Animal>().iterator();
    }
}

public class CachorroCollection extends AnimalCollection {
    @Override
    public Iterator<Cachorro> iterator() { // Covariante
        return new ArrayList<Cachorro>().iterator();
    }
}
```

### 8. Stream com Covariância

```java
public class Processador {
    public Stream<Number> processar() {
        return Stream.of(1, 2, 3);
    }
}

public class ProcessadorInteiro extends Processador {
    @Override
    public Stream<Integer> processar() { // Covariante
        return Stream.of(1, 2, 3);
    }
}

// Uso
ProcessadorInteiro proc = new ProcessadorInteiro();
Stream<Integer> stream = proc.processar(); // Sem cast
```

### 9. Optional com Covariância

```java
public class Service {
    public Optional<Animal> buscar(int id) {
        return Optional.empty();
    }
}

public class CachorroService extends Service {
    @Override
    public Optional<Cachorro> buscar(int id) { // Covariante
        return Optional.of(new Cachorro());
    }
}

// Uso
CachorroService service = new CachorroService();
Optional<Cachorro> cachorro = service.buscar(1); // Sem cast
```

### 10. Fluent Interface

```java
public class Query {
    protected StringBuilder sql = new StringBuilder();
    
    public Query select(String campos) {
        sql.append("SELECT ").append(campos);
        return this;
    }
    
    public Query from(String tabela) {
        sql.append(" FROM ").append(tabela);
        return this;
    }
}

public class QueryAvancada extends Query {
    @Override
    public QueryAvancada select(String campos) { // Covariante
        super.select(campos);
        return this;
    }
    
    @Override
    public QueryAvancada from(String tabela) { // Covariante
        super.from(tabela);
        return this;
    }
    
    public QueryAvancada join(String tabela) {
        sql.append(" JOIN ").append(tabela);
        return this;
    }
}

// Fluent interface sem cast
QueryAvancada query = new QueryAvancada()
    .select("*")
    .from("usuarios")
    .join("perfis"); // OK
```

---

## Resumo

**Covariância em tipos de retorno**: método sobrescrito pode retornar **subtipo** do tipo original.

```java
public class Animal {
    public Animal criar() { return new Animal(); }
}

public class Cachorro extends Animal {
    @Override
    public Cachorro criar() { // Subtipo de Animal
        return new Cachorro();
    }
}
```

**Type safety**:
```java
Cachorro c = cachorro.criar(); // Sem cast
```

**Introduzido**: Java 5 (2004).

**Benefícios**:
- **Elimina casts**
- **API mais limpa**
- **Type safety** em compile-time

**Clone**:
```java
@Override
public Pessoa clone() { // Covariante: Object → Pessoa
    try {
        return (Pessoa) super.clone();
    } catch (CloneNotSupportedException e) {
        throw new AssertionError();
    }
}
```

**Factory Method**:
```java
@Override
public DocumentoPDF criar() { // Covariante
    return new DocumentoPDF();
}
```

**Builder**:
```java
@Override
public BuilderAvancado setNome(String nome) { // Covariante
    super.setNome(nome);
    return this;
}
```

**Restrições**:
- **Não funciona** com primitivos (use wrappers)
- **Não funciona** com tipos não relacionados
- **Generics** são invariantes (use wildcards)
- **Arrays** são covariantes mas **não type-safe**

**Quando usar**:
- Factory Method (criar instâncias específicas)
- Clone (retornar tipo específico)
- Builder (fluent interface)
- Repository (buscar tipos específicos)
- Type safety (eliminar casts)

**Regra de Ouro**: Covariância permite retornar **subtipo** mais **específico**, eliminando **casts** e melhorando **type safety**. Funciona com **classes e interfaces**, mas **não** com **primitivos**. Use em **Factory Method**, **Clone**, **Builder**, e **Repository** para APIs mais limpas e seguras.
