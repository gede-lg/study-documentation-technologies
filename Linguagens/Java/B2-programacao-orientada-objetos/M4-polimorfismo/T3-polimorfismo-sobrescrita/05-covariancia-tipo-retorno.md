# T3.05 - Covariância de Tipo de Retorno

## Introdução

**Covariância de tipo de retorno**: método sobrescrito pode retornar **subtipo** do tipo de retorno original.

```java
public class Animal {
    public Animal criar() {
        return new Animal();
    }
}

public class Cachorro extends Animal {
    @Override
    public Cachorro criar() { // Tipo covariante OK
        return new Cachorro();
    }
}
```

**Covariância**: tipo de retorno **varia junto** (co-varia) com a hierarquia de classes.

**Introduzido**: Java 5 (2004).

**Benefícios**:
- **Type safety** (sem cast)
- **API mais limpa**
- **Polimorfismo** mais expressivo

---

## Fundamentos

### 1. Retornar Subtipo

Método sobrescrito pode retornar **subtipo**.

```java
public class Veiculo {
    public Veiculo duplicar() {
        return new Veiculo();
    }
}

public class Carro extends Veiculo {
    @Override
    public Carro duplicar() { // Subtipo de Veiculo
        return new Carro();
    }
}
```

### 2. Tipo Mais Específico

Tipo covariante é **mais específico** que o original.

```java
public class Forma {
    public Forma copiar() {
        return new Forma();
    }
}

public class Circulo extends Forma {
    @Override
    public Circulo copiar() { // Mais específico
        return new Circulo();
    }
}
```

### 3. Type Safety (Sem Cast)

Covariância **elimina cast**.

```java
// Sem covariância (Java 1.4)
Animal a = animal.criar();
Cachorro c = (Cachorro) a; // Cast necessário

// Com covariância (Java 5+)
Cachorro c = cachorro.criar(); // Sem cast
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

### 5. Factory Method Pattern

Covariância em **Factory Method**.

```java
public abstract class Creator {
    public abstract Produto criarProduto();
    
    public void operacao() {
        Produto p = criarProduto();
        p.usar();
    }
}

public class CreatorA extends Creator {
    @Override
    public ProdutoA criarProduto() { // Covariante
        return new ProdutoA();
    }
}

public class CreatorB extends Creator {
    @Override
    public ProdutoB criarProduto() { // Covariante
        return new ProdutoB();
    }
}
```

### 6. Builder Pattern

Covariância em **Builder**.

```java
public class Builder {
    protected String nome;
    
    public Builder setNome(String nome) {
        this.nome = nome;
        return this; // Retorna Builder
    }
    
    public Objeto build() {
        return new Objeto(nome);
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

// Uso: sem cast
BuilderAvancado builder = new BuilderAvancado()
    .setNome("João")  // Retorna BuilderAvancado
    .setIdade(30);    // OK: tipo específico
```

### 7. Collections

Covariância em **Collections**.

```java
public class AnimalRepository {
    public Collection<Animal> buscarTodos() {
        return new ArrayList<>();
    }
}

public class CachorroRepository extends AnimalRepository {
    @Override
    public List<Cachorro> buscarTodos() { // Covariante
        return new ArrayList<>();
    }
}
```

### 8. Stream

Covariância com **Stream**.

```java
public class Processador {
    public Stream<Animal> processar() {
        return Stream.of(new Animal(), new Animal());
    }
}

public class ProcessadorCachorro extends Processador {
    @Override
    public Stream<Cachorro> processar() { // Covariante
        return Stream.of(new Cachorro(), new Cachorro());
    }
}
```

### 9. Optional

Covariância com **Optional**.

```java
public class Repositorio {
    public Optional<Animal> buscar(int id) {
        return Optional.empty();
    }
}

public class CachorroRepositorio extends Repositorio {
    @Override
    public Optional<Cachorro> buscar(int id) { // Covariante
        return Optional.of(new Cachorro());
    }
}
```

### 10. Restrições de Covariância

Covariância **não** funciona com:
- **Primitivos** (int, double, etc.)
- **Parâmetros** (contravariância não suportada)
- **Arrays** (covariante mas perigoso)

```java
// ❌ Primitivos
public class Teste {
    public long metodo() { return 0; }
}
public class TesteFilho extends Teste {
    @Override
    public int metodo() { return 0; } // ❌ Erro: int não é subtipo de long
}

// ❌ Parâmetros (contravariância)
public class Animal {
    public void processar(Cachorro c) { }
}
public class Cachorro extends Animal {
    @Override
    public void processar(Animal a) { } // ❌ Erro: contravariância não suportada
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

**Evite covariância quando**:
- Tipo de retorno **não é subtipo**
- **Primitivos** (usar wrapper)
- **Contravariância** em parâmetros (não suportado)

---

## Armadilhas

### 1. Tipo Não É Subtipo

```java
public class Animal {
    public Animal criar() {
        return new Animal();
    }
}

public class Cachorro extends Animal {
    @Override
    public String criar() { // ❌ Erro: String não é subtipo de Animal
        return "Cachorro";
    }
}
```

### 2. Primitivos Não São Covariantes

```java
public class Teste {
    public Number metodo() {
        return 10;
    }
}

public class TesteFilho extends Teste {
    @Override
    public Integer metodo() { // ✅ OK: Integer é subtipo de Number
        return 10;
    }
}

// ❌ Primitivos não funcionam
public class Teste2 {
    public double metodo() {
        return 10.0;
    }
}
public class TesteFilho2 extends Teste2 {
    @Override
    public int metodo() { // ❌ Erro: int não é subtipo de double
        return 10;
    }
}
```

### 3. Contravariância em Parâmetros Não Suportada

```java
public class Animal {
    public void processar(Cachorro c) { }
}

public class Cachorro extends Animal {
    @Override
    public void processar(Animal a) { } // ❌ Erro: contravariância
}
```

### 4. Arrays Covariantes (Perigoso)

```java
Animal[] animais = new Cachorro[5]; // OK: array covariante

animais[0] = new Cachorro(); // OK
animais[1] = new Gato();     // ❌ Runtime: ArrayStoreException

// Arrays são covariantes mas NÃO são type-safe
```

### 5. Generics Invariantes

```java
List<Animal> animais = new ArrayList<Cachorro>(); // ❌ Erro: invariante

// ✅ Solução: wildcard
List<? extends Animal> animais2 = new ArrayList<Cachorro>(); // OK
```

### 6. Confundir Sobrecarga com Sobrescrita

```java
public class Animal {
    public Animal criar() {
        return new Animal();
    }
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

### 7. Clone Sem Covariância

```java
// Antes de Java 5
public class Pessoa implements Cloneable {
    @Override
    public Object clone() { // Retorna Object
        try {
            return super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}

Pessoa p1 = new Pessoa();
Pessoa p2 = (Pessoa) p1.clone(); // Cast necessário
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
```

### 3. Builder com Covariância

```java
public class Builder<T extends Builder<T>> {
    protected String nome;
    
    @SuppressWarnings("unchecked")
    protected T self() {
        return (T) this;
    }
    
    public T setNome(String nome) {
        this.nome = nome;
        return self();
    }
}

public class BuilderAvancado extends Builder<BuilderAvancado> {
    private int idade;
    
    public BuilderAvancado setIdade(int idade) {
        this.idade = idade;
        return this;
    }
}

// Uso: fluent interface
BuilderAvancado builder = new BuilderAvancado()
    .setNome("João")
    .setIdade(30);
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

### 6. Stream com Covariância

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

### 7. Optional com Covariância

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

### 8. Comparable com Covariância

```java
public class Pessoa implements Comparable<Pessoa> {
    private String nome;
    
    @Override
    public int compareTo(Pessoa outra) {
        return nome.compareTo(outra.nome);
    }
}

public class Funcionario extends Pessoa implements Comparable<Funcionario> {
    private double salario;
    
    @Override
    public int compareTo(Funcionario outro) { // Covariante
        return Double.compare(this.salario, outro.salario);
    }
}
```

### 9. Iterator com Covariância

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

// Uso
QueryAvancada query = new QueryAvancada()
    .select("*")
    .from("usuarios")
    .join("perfis");
```

---

## Resumo

**Covariância de tipo de retorno**: método sobrescrito pode retornar **subtipo**.

```java
public class Animal {
    public Animal criar() {
        return new Animal();
    }
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
public ProdutoA criarProduto() { // Covariante
    return new ProdutoA();
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
- **Não suporta** contravariância em parâmetros
- **Arrays** são covariantes mas **não** type-safe
- **Generics** são invariantes (use wildcards)

**Quando usar**:
- Factory Method (criar instâncias específicas)
- Clone (retornar tipo específico)
- Builder (fluent interface)
- Repository (buscar tipos específicos)
- Type safety (eliminar casts)

**Regra de Ouro**: Covariância permite retornar **subtipo** mais **específico**, eliminando **casts**. Funciona com **classes e interfaces**, mas **não** com **primitivos**. Use em **Factory Method**, **Clone**, **Builder**, e **Repository** para **type safety** e **API mais limpa**.
