# T2.04 - Classe Abstrata Implementando Interface Parcialmente

## Introdução

**Classe abstrata**: pode implementar interface **parcialmente** (não precisa implementar todos os métodos).

```java
public interface Repositorio {
    void salvar(Object obj);
    Object buscar(int id);
    void deletar(int id);
    List<Object> buscarTodos();
}

// Classe abstrata: implementação parcial
public abstract class RepositorioBase implements Repositorio {
    @Override
    public void salvar(Object obj) {
        System.out.println("Salvando: " + obj);
    }
    
    @Override
    public void deletar(int id) {
        System.out.println("Deletando: " + id);
    }
    
    // buscar() e buscarTodos() ainda abstratos (para subclasses)
}

// Subclasse concreta: implementa restante
public class RepositorioConcreto extends RepositorioBase {
    @Override
    public Object buscar(int id) {
        return null;
    }
    
    @Override
    public List<Object> buscarTodos() {
        return new ArrayList<>();
    }
}
```

**Benefícios**:
- **Reuso de código** (métodos comuns na classe abstrata)
- **Template Method** pattern
- **Skeletal Implementation** pattern

---

## Fundamentos

### 1. Implementação Parcial

Classe **abstrata**: não precisa implementar todos.

```java
public interface Completo {
    void metodo1();
    void metodo2();
    void metodo3();
}

// Classe abstrata: implementa parcialmente
public abstract class ParcialAbstrato implements Completo {
    @Override
    public void metodo1() {
        System.out.println("Método 1 implementado");
    }
    
    // metodo2() e metodo3() ainda abstratos
}

// Subclasse concreta: implementa restante
public class Concreto extends ParcialAbstrato {
    @Override
    public void metodo2() {
        System.out.println("Método 2");
    }
    
    @Override
    public void metodo3() {
        System.out.println("Método 3");
    }
}
```

### 2. Métodos Não Implementados Ficam Abstratos

Métodos não implementados: **implicitamente abstratos**.

```java
public interface Exemplo {
    void metodo1();
    void metodo2();
}

// Classe abstrata: não implementa metodo2()
public abstract class ExemploAbstrato implements Exemplo {
    @Override
    public void metodo1() {
        System.out.println("Método 1");
    }
    
    // metodo2() não implementado = abstrato implícito
}

// Subclasse: deve implementar metodo2()
public class ExemploConcreto extends ExemploAbstrato {
    @Override
    public void metodo2() {
        System.out.println("Método 2");
    }
}
```

### 3. Declarar Métodos Abstratos Explicitamente

**Opcional**: redeclarar métodos como **abstract**.

```java
public interface Repositorio {
    void salvar(Object obj);
    Object buscar(int id);
}

public abstract class RepositorioBase implements Repositorio {
    @Override
    public void salvar(Object obj) {
        System.out.println("Salvando");
    }
    
    // Redeclara como abstract (opcional, já é implícito)
    @Override
    public abstract Object buscar(int id);
}
```

### 4. Template Method Pattern

Classe abstrata: **template method** (algoritmo com passos abstratos).

```java
public interface Processador {
    void processar();
}

// Classe abstrata: template method
public abstract class ProcessadorTemplate implements Processador {
    @Override
    public final void processar() { // Template method (final)
        validar();
        preparar();
        executar(); // Abstrato (para subclasses)
        finalizar();
    }
    
    protected void validar() {
        System.out.println("Validando");
    }
    
    protected void preparar() {
        System.out.println("Preparando");
    }
    
    // Abstrato: subclasses implementam
    protected abstract void executar();
    
    protected void finalizar() {
        System.out.println("Finalizando");
    }
}

public class ProcessadorConcreto extends ProcessadorTemplate {
    @Override
    protected void executar() {
        System.out.println("Executando processamento");
    }
}

// Uso
Processador processador = new ProcessadorConcreto();
processador.processar();
// Saída:
// Validando
// Preparando
// Executando processamento
// Finalizando
```

### 5. Skeletal Implementation Pattern

Java Collections: **Abstract*** classes (skeletal implementations).

```java
// Interface com muitos métodos
public interface Collection<E> {
    int size();
    boolean isEmpty();
    boolean contains(Object o);
    Iterator<E> iterator();
    boolean add(E e);
    boolean remove(Object o);
    // ... muitos outros
}

// Skeletal implementation
public abstract class AbstractCollection<E> implements Collection<E> {
    // Implementa métodos comuns
    @Override
    public boolean isEmpty() {
        return size() == 0; // Usa size() abstrato
    }
    
    @Override
    public boolean contains(Object o) {
        Iterator<E> it = iterator();
        while (it.hasNext()) {
            if (o.equals(it.next())) return true;
        }
        return false;
    }
    
    // size() e iterator() abstratos (para subclasses)
    @Override
    public abstract int size();
    
    @Override
    public abstract Iterator<E> iterator();
}

// Subclasse: implementa apenas size() e iterator()
public class MinhaColecao<E> extends AbstractCollection<E> {
    private final List<E> list = new ArrayList<>();
    
    @Override
    public int size() {
        return list.size();
    }
    
    @Override
    public Iterator<E> iterator() {
        return list.iterator();
    }
    
    @Override
    public boolean add(E e) {
        return list.add(e);
    }
    
    // isEmpty() e contains() herdados de AbstractCollection
}
```

### 6. Reuso de Código

Classe abstrata: **reuso** entre subclasses.

```java
public interface Repositorio<T> {
    void salvar(T entidade);
    T buscar(int id);
    void deletar(int id);
    List<T> buscarTodos();
}

// Classe abstrata: reuso de código
public abstract class RepositorioBase<T> implements Repositorio<T> {
    protected final Map<Integer, T> dados = new HashMap<>();
    
    @Override
    public void salvar(T entidade) {
        dados.put(entidade.hashCode(), entidade);
        System.out.println("Salvando: " + entidade);
    }
    
    @Override
    public void deletar(int id) {
        dados.remove(id);
        System.out.println("Deletando: " + id);
    }
    
    @Override
    public List<T> buscarTodos() {
        return new ArrayList<>(dados.values());
    }
    
    // buscar() abstrato (subclasses implementam)
    @Override
    public abstract T buscar(int id);
}

// Subclasse 1
public class UsuarioRepositorio extends RepositorioBase<Usuario> {
    @Override
    public Usuario buscar(int id) {
        return dados.get(id); // Usa dados da classe base
    }
}

// Subclasse 2
public class ProdutoRepositorio extends RepositorioBase<Produto> {
    @Override
    public Produto buscar(int id) {
        return dados.get(id);
    }
}
```

### 7. Métodos Protected para Subclasses

Classe abstrata: métodos **protected** para subclasses.

```java
public interface Servico {
    void executar();
}

public abstract class ServicoBase implements Servico {
    @Override
    public final void executar() {
        beforeExecutar();
        doExecutar(); // Abstrato
        afterExecutar();
    }
    
    // Protected: para subclasses
    protected void beforeExecutar() {
        System.out.println("Antes");
    }
    
    protected abstract void doExecutar();
    
    protected void afterExecutar() {
        System.out.println("Depois");
    }
}

public class ServicoConcreto extends ServicoBase {
    @Override
    protected void doExecutar() {
        System.out.println("Executando");
    }
}
```

### 8. Estado na Classe Abstrata

Classe abstrata: pode ter **estado** (campos).

```java
public interface Logger {
    void log(String mensagem);
}

public abstract class LoggerBase implements Logger {
    protected final String prefix; // Estado
    
    public LoggerBase(String prefix) {
        this.prefix = prefix;
    }
    
    @Override
    public void log(String mensagem) {
        System.out.println(prefix + ": " + mensagem);
    }
}

public class ConsoleLogger extends LoggerBase {
    public ConsoleLogger() {
        super("CONSOLE");
    }
}

public class FileLogger extends LoggerBase {
    public FileLogger() {
        super("FILE");
    }
}
```

### 9. Construtor na Classe Abstrata

Classe abstrata: pode ter **construtor**.

```java
public interface Repositorio {
    void salvar(Object obj);
}

public abstract class RepositorioBase implements Repositorio {
    protected final String nome;
    
    // Construtor
    protected RepositorioBase(String nome) {
        this.nome = nome;
        System.out.println("Inicializando repositório: " + nome);
    }
    
    @Override
    public void salvar(Object obj) {
        System.out.println(nome + " salvando: " + obj);
    }
}

public class RepositorioConcreto extends RepositorioBase {
    public RepositorioConcreto() {
        super("RepositorioConcreto"); // Chama construtor da base
    }
}
```

### 10. Múltiplas Interfaces

Classe abstrata: implementa **múltiplas interfaces** parcialmente.

```java
public interface Exportavel {
    byte[] exportar();
}

public interface Imprimivel {
    void imprimir();
}

public interface Validavel {
    boolean validar();
}

// Implementa múltiplas interfaces parcialmente
public abstract class DocumentoBase implements Exportavel, Imprimivel, Validavel {
    @Override
    public void imprimir() {
        System.out.println("Imprimindo documento");
    }
    
    @Override
    public boolean validar() {
        return true;
    }
    
    // exportar() abstrato (para subclasses)
}

public class PDFDocumento extends DocumentoBase {
    @Override
    public byte[] exportar() {
        return new byte[0]; // Gera PDF
    }
}
```

---

## Aplicabilidade

**Classe abstrata implementando interface parcialmente**:
- **Reuso de código** (implementação comum)
- **Template Method** (algoritmo com passos abstratos)
- **Skeletal Implementation** (Java Collections)
- **Hook methods** (subclasses customizam)

**Quando usar**:
- Múltiplas subclasses com **comportamento comum**
- **Template Method** pattern
- **Skeletal Implementation** para facilitar implementação

---

## Armadilhas

### 1. Esquecer Implementar na Subclasse

```java
public interface Completo {
    void metodo1();
    void metodo2();
}

public abstract class Parcial implements Completo {
    @Override
    public void metodo1() { }
    
    // metodo2() não implementado
}

// ❌ ERRO: subclasse concreta deve implementar metodo2()
// public class Concreta extends Parcial {
//     // metodo2() não implementado - ERRO
// }

// ✅ Implementa metodo2()
public class Concreta extends Parcial {
    @Override
    public void metodo2() { }
}
```

### 2. Classe Abstrata Sem Métodos Abstratos

```java
// ⚠️ Classe abstrata sem métodos abstratos (desnecessário)
public abstract class Desnecessaria implements Repositorio {
    @Override
    public void salvar(Object obj) { }
    
    @Override
    public Object buscar(int id) { return null; }
    
    // Todos implementados, por que abstract?
}

// ✅ Remove abstract (pode instanciar)
public class Necessaria implements Repositorio {
    @Override
    public void salvar(Object obj) { }
    
    @Override
    public Object buscar(int id) { return null; }
}
```

### 3. Template Method Não Final

```java
public abstract class ProcessadorBase implements Processador {
    // ⚠️ Template method sem final (pode ser sobrescrito)
    @Override
    public void processar() {
        validar();
        executar();
        finalizar();
    }
    
    protected abstract void executar();
}

// Subclasse sobrescreve template (quebra algoritmo)
public class ProcessadorErrado extends ProcessadorBase {
    @Override
    public void processar() { // Sobrescreve template
        executar(); // Pula validar() e finalizar()
    }
    
    @Override
    protected void executar() { }
}

// ✅ Template method final
public abstract class ProcessadorCorreto implements Processador {
    @Override
    public final void processar() { // final
        validar();
        executar();
        finalizar();
    }
    
    protected abstract void executar();
}
```

### 4. Implementação Desnecessária

```java
public interface Simples {
    void metodo();
}

// ⚠️ Classe abstrata desnecessária (apenas um método)
public abstract class SimplesBase implements Simples {
    // Nenhum método implementado (desnecessário)
}

// ✅ Implemente diretamente
public class SimplesConcreto implements Simples {
    @Override
    public void metodo() { }
}
```

### 5. Estado Mutável Compartilhado

```java
// ⚠️ Estado mutável compartilhado (perigoso)
public abstract class RepositorioBase implements Repositorio {
    protected static final Map<Integer, Object> dados = new HashMap<>(); // static
    
    @Override
    public void salvar(Object obj) {
        dados.put(obj.hashCode(), obj);
    }
}

// Problema: todas as subclasses compartilham o mesmo Map

// ✅ Estado por instância
public abstract class RepositorioCorreto implements Repositorio {
    protected final Map<Integer, Object> dados = new HashMap<>(); // Não static
    
    @Override
    public void salvar(Object obj) {
        dados.put(obj.hashCode(), obj);
    }
}
```

### 6. Redeclarar Todos como Abstract

```java
public interface Exemplo {
    void metodo1();
    void metodo2();
}

// ⚠️ Redeclara todos como abstract (desnecessário)
public abstract class ExemploBase implements Exemplo {
    @Override
    public abstract void metodo1(); // Redundante
    
    @Override
    public abstract void metodo2(); // Redundante
}

// ✅ Apenas implicitamente abstratos
public abstract class ExemploCorreto implements Exemplo {
    // metodo1() e metodo2() implicitamente abstratos
}
```

### 7. Construtor Public

```java
// ⚠️ Construtor public (permite "new" mas é abstrata)
public abstract class Base {
    public Base() { } // public (confuso)
}

// ✅ Construtor protected
public abstract class Correto {
    protected Correto() { } // protected
}
```

---

## Boas Práticas

### 1. Template Method Final

```java
public abstract class ProcessadorTemplate implements Processador {
    @Override
    public final void processar() { // final
        validar();
        executar();
        finalizar();
    }
    
    protected abstract void executar();
}
```

### 2. Skeletal Implementation

```java
// Interface
public interface MyList<E> {
    int size();
    E get(int index);
    boolean add(E e);
    // ... outros métodos
}

// Skeletal implementation (AbstractMyList)
public abstract class AbstractMyList<E> implements MyList<E> {
    @Override
    public boolean isEmpty() {
        return size() == 0;
    }
    
    // size(), get(), add() abstratos
}

// Subclasse implementa apenas métodos essenciais
public class MyArrayList<E> extends AbstractMyList<E> {
    private final List<E> list = new ArrayList<>();
    
    @Override
    public int size() {
        return list.size();
    }
    
    @Override
    public E get(int index) {
        return list.get(index);
    }
    
    @Override
    public boolean add(E e) {
        return list.add(e);
    }
}
```

### 3. Hook Methods

```java
public abstract class ServicoBase implements Servico {
    @Override
    public final void executar() {
        beforeExecutar(); // Hook
        doExecutar();
        afterExecutar(); // Hook
    }
    
    // Hook methods (podem ser sobrescritos)
    protected void beforeExecutar() {
        // Implementação padrão (pode ser sobrescrita)
    }
    
    protected abstract void doExecutar();
    
    protected void afterExecutar() {
        // Implementação padrão (pode ser sobrescrita)
    }
}

public class ServicoConcreto extends ServicoBase {
    @Override
    protected void beforeExecutar() {
        System.out.println("Customizando before");
    }
    
    @Override
    protected void doExecutar() {
        System.out.println("Executando");
    }
}
```

### 4. Naming Convention

```java
// ✅ Abstract* ou *Base para skeletal implementations
public abstract class AbstractList<E> implements List<E> { }
public abstract class AbstractSet<E> implements Set<E> { }
public abstract class RepositorioBase implements Repositorio { }
```

### 5. Documentar Métodos Abstratos

```java
public abstract class RepositorioBase implements Repositorio {
    @Override
    public void salvar(Object obj) {
        System.out.println("Salvando: " + obj);
    }
    
    /**
     * Busca entidade por ID.
     * 
     * <p>Subclasses devem implementar a lógica de busca.
     * 
     * @param id ID da entidade
     * @return entidade encontrada ou null
     */
    @Override
    public abstract Object buscar(int id);
}
```

### 6. Estado Protegido

```java
public abstract class RepositorioBase<T> implements Repositorio<T> {
    protected final Map<Integer, T> dados = new HashMap<>(); // protected
    
    @Override
    public void salvar(T entidade) {
        dados.put(entidade.hashCode(), entidade);
    }
}
```

### 7. Construtor Protected

```java
public abstract class Base implements Interface {
    protected final String nome;
    
    protected Base(String nome) { // protected
        this.nome = nome;
    }
}
```

### 8. Simulated Multiple Inheritance

```java
// Interface 1
public interface Interface1 {
    void metodo1();
}

// Interface 2
public interface Interface2 {
    void metodo2();
}

// Skeletal implementation 1
public abstract class AbstractInterface1 implements Interface1 {
    @Override
    public void metodo1() {
        System.out.println("Método 1");
    }
}

// Classe implementa Interface2, delega para AbstractInterface1
public class MinhaClasse implements Interface1, Interface2 {
    // Composição: simula herança de AbstractInterface1
    private final AbstractInterface1 helper = new AbstractInterface1() { };
    
    @Override
    public void metodo1() {
        helper.metodo1(); // Delega
    }
    
    @Override
    public void metodo2() {
        System.out.println("Método 2");
    }
}
```

### 9. Adapter Pattern

```java
public interface Target {
    void request();
}

public class Adaptee {
    public void specificRequest() {
        System.out.println("Specific request");
    }
}

// Adapter (classe abstrata para reuso)
public abstract class AdapterBase implements Target {
    protected final Adaptee adaptee;
    
    protected AdapterBase(Adaptee adaptee) {
        this.adaptee = adaptee;
    }
    
    @Override
    public void request() {
        adaptee.specificRequest();
    }
}

public class ConcreteAdapter extends AdapterBase {
    public ConcreteAdapter(Adaptee adaptee) {
        super(adaptee);
    }
}
```

### 10. Testes com Classe Abstrata

```java
public abstract class RepositorioBase implements Repositorio {
    @Override
    public void salvar(Object obj) {
        System.out.println("Salvando: " + obj);
    }
    
    @Override
    public abstract Object buscar(int id);
}

// Teste: classe concreta anônima
@Test
public void testSalvar() {
    RepositorioBase repo = new RepositorioBase() {
        @Override
        public Object buscar(int id) {
            return null; // Implementação mínima para teste
        }
    };
    
    repo.salvar("Teste"); // Testa salvar()
}
```

---

## Resumo

**Classe abstrata**: implementa interface **parcialmente**.

```java
public abstract class Base implements Interface {
    @Override
    public void metodo1() { } // Implementado
    
    // metodo2() não implementado (abstrato implícito)
}

public class Concreta extends Base {
    @Override
    public void metodo2() { } // Implementa restante
}
```

**Template Method**:
```java
public abstract class Template implements Interface {
    @Override
    public final void processar() { // final
        validar();
        executar(); // Abstrato
        finalizar();
    }
    
    protected abstract void executar();
}
```

**Skeletal Implementation**:
```java
public abstract class AbstractCollection<E> implements Collection<E> {
    @Override
    public boolean isEmpty() {
        return size() == 0; // Implementado
    }
    
    @Override
    public abstract int size(); // Abstrato
}
```

**Reuso de código**:
```java
public abstract class Base implements Repositorio {
    protected final Map<Integer, Object> dados = new HashMap<>();
    
    @Override
    public void salvar(Object obj) {
        dados.put(obj.hashCode(), obj); // Reuso
    }
}
```

**Métodos protected**:
```java
protected void beforeExecutar() { }
protected abstract void executar();
protected void afterExecutar() { }
```

**Estado**:
```java
protected final String nome; // Estado
```

**Construtor**:
```java
protected Base(String nome) { // protected
    this.nome = nome;
}
```

**Múltiplas interfaces**:
```java
public abstract class Base implements Interface1, Interface2 {
    @Override
    public void metodo1() { } // Implementado
    
    // metodo2() abstrato
}
```

**Boas práticas**:
- Template method **final**
- Skeletal Implementation (Abstract*, *Base)
- Hook methods (customização)
- Naming: Abstract* ou *Base
- Documentar métodos abstratos
- Estado **protected**
- Construtor **protected**
- Simulated multiple inheritance (composição)

**Armadilhas**:
- ❌ Esquecer implementar na subclasse
- ❌ Classe abstrata sem métodos abstratos (desnecessário)
- ❌ Template method sem final
- ❌ Implementação desnecessária
- ❌ Estado mutável compartilhado (static)
- ❌ Redeclarar todos como abstract (redundante)
- ❌ Construtor public (use protected)

**Regra de Ouro**: Classe **abstrata** implementa interface **parcialmente** para **reuso de código**. Use **Template Method** (final) para algoritmo com passos abstratos. **Skeletal Implementation** (Abstract*) facilita implementação. **Hook methods** para customização. Construtor e estado **protected**. Métodos não implementados = **abstratos implícitos**.
