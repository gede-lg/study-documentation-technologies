# T1.05 - Polimorfismo com Interfaces

## Introdução

**Interface**: contrato que **define métodos** sem implementação (até Java 7), permitindo **polimorfismo sem herança**.

**Polimorfismo com Interfaces**: objeto pode ser tratado através de **referência de interface**, permitindo **múltiplas implementações**.

**Vantagens**:
- **Múltipla herança de tipo** (classe implementa várias interfaces)
- **Desacoplamento**: código depende de abstração, não de implementação
- **Flexibilidade**: trocar implementação sem alterar código cliente
- **Testabilidade**: criar mocks/stubs implementando interface

```java
public interface Animal {
    void som();
}

public class Cachorro implements Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}

public class Gato implements Animal {
    @Override
    public void som() {
        System.out.println("Miau");
    }
}

// Polimorfismo com interface
Animal a1 = new Cachorro();
Animal a2 = new Gato();

a1.som(); // "Au au"
a2.som(); // "Miau"
```

---

## Fundamentos

### 1. Interface Como Contrato

```java
public interface Voador {
    void voar();
    void pousar();
}

public class Aviao implements Voador {
    @Override
    public void voar() {
        System.out.println("Avião voando");
    }
    
    @Override
    public void pousar() {
        System.out.println("Avião pousando");
    }
}

public class Passaro implements Voador {
    @Override
    public void voar() {
        System.out.println("Pássaro voando");
    }
    
    @Override
    public void pousar() {
        System.out.println("Pássaro pousando");
    }
}
```

### 2. Múltiplas Interfaces

**Classe pode implementar múltiplas interfaces**.

```java
public interface Nadador {
    void nadar();
}

public interface Voador {
    void voar();
}

public class Pato implements Nadador, Voador {
    @Override
    public void nadar() {
        System.out.println("Pato nadando");
    }
    
    @Override
    public void voar() {
        System.out.println("Pato voando");
    }
}

// Polimorfismo com diferentes interfaces
Nadador n = new Pato();
Voador v = new Pato();

n.nadar(); // "Pato nadando"
v.voar();  // "Pato voando"
```

### 3. Referência de Interface

```java
// Lista pode ser ArrayList, LinkedList, etc.
List<String> lista = new ArrayList<>();
lista.add("Java");

// Trocar implementação sem alterar código
lista = new LinkedList<>();
lista.add("Python");

// Método aceita qualquer List
public void processar(List<String> lista) {
    for (String s : lista) {
        System.out.println(s);
    }
}
```

### 4. Collections Framework

```java
// Interface Collection
Collection<String> c1 = new ArrayList<>();
Collection<String> c2 = new HashSet<>();
Collection<String> c3 = new LinkedList<>();

// Interface Map
Map<String, Integer> m1 = new HashMap<>();
Map<String, Integer> m2 = new TreeMap<>();
Map<String, Integer> m3 = new LinkedHashMap<>();

// Método polimórfico
public void imprimir(Collection<String> colecao) {
    for (String s : colecao) {
        System.out.println(s);
    }
}

imprimir(new ArrayList<>()); // ✅
imprimir(new HashSet<>());   // ✅
imprimir(new LinkedList<>()); // ✅
```

### 5. Default Methods (Java 8+)

**Interface pode ter métodos com implementação padrão**.

```java
public interface Animal {
    void som(); // Abstrato
    
    default void dormir() { // Default
        System.out.println("Dormindo");
    }
}

public class Cachorro implements Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
    
    // dormir() herdado da interface
}

Cachorro c = new Cachorro();
c.som();     // "Au au"
c.dormir();  // "Dormindo"
```

### 6. Static Methods (Java 8+)

**Interface pode ter métodos static**.

```java
public interface Matematica {
    static int somar(int a, int b) {
        return a + b;
    }
    
    static int multiplicar(int a, int b) {
        return a * b;
    }
}

// Chamada via interface
int resultado = Matematica.somar(10, 5); // 15
```

### 7. Private Methods (Java 9+)

**Interface pode ter métodos private** para reutilização interna.

```java
public interface Logger {
    default void log(String mensagem) {
        logComTimestamp(mensagem);
    }
    
    default void logErro(String mensagem) {
        logComTimestamp("ERRO: " + mensagem);
    }
    
    private void logComTimestamp(String mensagem) {
        System.out.println("[" + LocalDateTime.now() + "] " + mensagem);
    }
}
```

### 8. Herança de Interfaces

**Interface pode estender outras interfaces**.

```java
public interface Animal {
    void som();
}

public interface Mamifero extends Animal {
    void amamentar();
}

public interface Voador {
    void voar();
}

public interface MamiferoVoador extends Mamifero, Voador {
    void ecolocalizar();
}

public class Morcego implements MamiferoVoador {
    @Override
    public void som() { }
    
    @Override
    public void amamentar() { }
    
    @Override
    public void voar() { }
    
    @Override
    public void ecolocalizar() { }
}
```

### 9. Functional Interfaces (Java 8+)

**Interface com um único método abstrato** (pode ter default/static).

```java
@FunctionalInterface
public interface Calculadora {
    int calcular(int a, int b);
}

// Lambda
Calculadora soma = (a, b) -> a + b;
Calculadora mult = (a, b) -> a * b;

System.out.println(soma.calcular(10, 5)); // 15
System.out.println(mult.calcular(10, 5)); // 50
```

### 10. Marker Interfaces

**Interface sem métodos**, apenas para marcar tipo.

```java
public interface Serializable { }

public class Pessoa implements Serializable {
    private String nome;
    private int idade;
}

// Verificar se objeto é Serializable
if (obj instanceof Serializable) {
    // Serializar objeto
}
```

---

## Aplicabilidade

**Use interfaces quando**:
- **Definir contrato** sem impor implementação
- **Múltiplos tipos não relacionados** precisam do mesmo comportamento
- **Dependency Injection**: desacoplar código de implementação
- **Strategy Pattern**: trocar algoritmos dinamicamente
- **Collections**: trabalhar com diferentes estruturas de dados

**Exemplos**:
```java
// JDBC: trabalha com diferentes databases
Connection conn = DriverManager.getConnection(url);
Statement stmt = conn.createStatement();

// Comparator: diferentes critérios de ordenação
List<String> lista = Arrays.asList("c", "a", "b");
lista.sort(Comparator.naturalOrder());
```

---

## Armadilhas

### 1. Diamond Problem com Default Methods

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

// ❌ Erro: conflito de métodos default
public class C implements A, B {
    // Deve resolver conflito explicitamente
}

// ✅ Resolver conflito
public class C implements A, B {
    @Override
    public void metodo() {
        A.super.metodo(); // Chama método de A
        // ou B.super.metodo();
        // ou própria implementação
    }
}
```

### 2. Constantes em Interfaces

```java
// ⚠️ Evite usar interface apenas para constantes
public interface Constantes {
    String MENSAGEM = "Olá";
    int MAX = 100;
}

// ✅ Use classe final
public final class Constantes {
    private Constantes() { }
    
    public static final String MENSAGEM = "Olá";
    public static final int MAX = 100;
}
```

### 3. Interface vs Classe Abstrata

```java
// ✅ Interface: sem estado, múltipla implementação
public interface Animal {
    void som();
}

// ✅ Classe abstrata: com estado, herança única
public abstract class Animal {
    protected String nome; // Estado
    
    public abstract void som();
}
```

### 4. Mudanças em Interfaces Quebram Compatibilidade

```java
// Versão 1
public interface Animal {
    void som();
}

// Versão 2 (quebra compatibilidade)
public interface Animal {
    void som();
    void mover(); // ❌ Todas as classes devem implementar
}

// ✅ Solução: default method
public interface Animal {
    void som();
    
    default void mover() { // Não quebra compatibilidade
        System.out.println("Movendo");
    }
}
```

### 5. Functional Interface com Múltiplos Métodos Abstratos

```java
// ❌ Erro: não é functional interface
@FunctionalInterface
public interface Calculadora {
    int somar(int a, int b);
    int subtrair(int a, int b); // Segundo método abstrato
}

// ✅ Correto: único método abstrato
@FunctionalInterface
public interface Calculadora {
    int calcular(int a, int b);
    
    default int somar(int a, int b) {
        return a + b;
    }
}
```

---

## Boas Práticas

### 1. Dependency Injection

```java
// ✅ Dependência de interface
public class Servico {
    private Repositorio repositorio;
    
    public Servico(Repositorio repositorio) { // Interface
        this.repositorio = repositorio;
    }
    
    public void salvar(String dados) {
        repositorio.salvar(dados);
    }
}

// Diferentes implementações
Servico s1 = new Servico(new RepositorioDB());
Servico s2 = new Servico(new RepositorioMemoria());
Servico s3 = new Servico(new RepositorioArquivo());
```

### 2. Strategy Pattern

```java
public interface OrdenacaoStrategy {
    void ordenar(int[] array);
}

public class BubbleSort implements OrdenacaoStrategy {
    @Override
    public void ordenar(int[] array) {
        // Implementação
    }
}

public class QuickSort implements OrdenacaoStrategy {
    @Override
    public void ordenar(int[] array) {
        // Implementação
    }
}

public class Ordenador {
    private OrdenacaoStrategy strategy;
    
    public void setStrategy(OrdenacaoStrategy strategy) {
        this.strategy = strategy;
    }
    
    public void ordenar(int[] array) {
        strategy.ordenar(array);
    }
}
```

### 3. Comparator

```java
List<Pessoa> pessoas = Arrays.asList(
    new Pessoa("Ana", 25),
    new Pessoa("Carlos", 30),
    new Pessoa("Beatriz", 20)
);

// Ordenar por nome
pessoas.sort(Comparator.comparing(Pessoa::getNome));

// Ordenar por idade (decrescente)
pessoas.sort(Comparator.comparing(Pessoa::getIdade).reversed());

// Ordenar por múltiplos campos
pessoas.sort(Comparator
    .comparing(Pessoa::getIdade)
    .thenComparing(Pessoa::getNome));
```

### 4. Functional Interfaces

```java
// Predicate<T>
Predicate<Integer> isPar = n -> n % 2 == 0;
List<Integer> numeros = Arrays.asList(1, 2, 3, 4, 5);
numeros.stream().filter(isPar).forEach(System.out::println); // 2, 4

// Function<T, R>
Function<String, Integer> tamanho = String::length;
System.out.println(tamanho.apply("Java")); // 4

// Consumer<T>
Consumer<String> imprimir = System.out::println;
numeros.forEach(imprimir);

// Supplier<T>
Supplier<Double> random = Math::random;
System.out.println(random.get());
```

### 5. Interface Segregation Principle (ISP)

```java
// ❌ Interface gorda
public interface Trabalhador {
    void trabalhar();
    void comer();
    void dormir();
}

// ✅ Interfaces segregadas
public interface Trabalhador {
    void trabalhar();
}

public interface Alimentavel {
    void comer();
}

public interface Descansavel {
    void dormir();
}

public class Humano implements Trabalhador, Alimentavel, Descansavel {
    @Override
    public void trabalhar() { }
    
    @Override
    public void comer() { }
    
    @Override
    public void dormir() { }
}

public class Robo implements Trabalhador {
    @Override
    public void trabalhar() { }
    // Robô não come nem dorme
}
```

### 6. Callback Pattern

```java
public interface Callback {
    void onSucesso(String resultado);
    void onErro(Exception e);
}

public class Servico {
    public void executar(Callback callback) {
        try {
            String resultado = "Sucesso";
            callback.onSucesso(resultado);
        } catch (Exception e) {
            callback.onErro(e);
        }
    }
}

// Uso
servico.executar(new Callback() {
    @Override
    public void onSucesso(String resultado) {
        System.out.println(resultado);
    }
    
    @Override
    public void onErro(Exception e) {
        e.printStackTrace();
    }
});
```

### 7. Builder Pattern com Interfaces

```java
public interface Builder<T> {
    T build();
}

public class PessoaBuilder implements Builder<Pessoa> {
    private String nome;
    private int idade;
    
    public PessoaBuilder nome(String nome) {
        this.nome = nome;
        return this;
    }
    
    public PessoaBuilder idade(int idade) {
        this.idade = idade;
        return this;
    }
    
    @Override
    public Pessoa build() {
        return new Pessoa(nome, idade);
    }
}

Pessoa p = new PessoaBuilder()
    .nome("Ana")
    .idade(25)
    .build();
```

### 8. Testabilidade com Mocks

```java
// Interface
public interface EmailService {
    void enviar(String destinatario, String mensagem);
}

// Implementação real
public class EmailServiceImpl implements EmailService {
    @Override
    public void enviar(String destinatario, String mensagem) {
        // Envia email real
    }
}

// Mock para testes
public class EmailServiceMock implements EmailService {
    @Override
    public void enviar(String destinatario, String mensagem) {
        System.out.println("Mock: enviando para " + destinatario);
    }
}

// Teste
@Test
public void testar() {
    EmailService service = new EmailServiceMock();
    service.enviar("teste@exemplo.com", "Mensagem");
}
```

---

## Resumo

**Interface**:
```java
public interface Animal {
    void som();
}

public class Cachorro implements Animal {
    @Override
    public void som() {
        System.out.println("Au au");
    }
}

Animal a = new Cachorro();
a.som(); // "Au au"
```

**Múltiplas Interfaces**:
```java
public class Pato implements Nadador, Voador {
    @Override
    public void nadar() { }
    
    @Override
    public void voar() { }
}
```

**Default Methods**:
```java
public interface Animal {
    void som();
    
    default void dormir() {
        System.out.println("Dormindo");
    }
}
```

**Functional Interface**:
```java
@FunctionalInterface
public interface Calculadora {
    int calcular(int a, int b);
}

Calculadora soma = (a, b) -> a + b;
```

**Collections**:
```java
List<String> lista = new ArrayList<>();
Map<String, Integer> mapa = new HashMap<>();
```

**Quando usar**:
- ✅ Definir contrato sem implementação
- ✅ Múltipla herança de tipo
- ✅ Desacoplamento (Dependency Injection)
- ✅ Strategy Pattern
- ✅ Testabilidade (mocks)

**Interface vs Classe Abstrata**:
- **Interface**: sem estado, múltipla implementação
- **Classe Abstrata**: com estado, herança única

**Regra de Ouro**: Use **interfaces** para definir **contratos** e permitir **múltiplas implementações**. **Referência de interface** permite **polimorfismo** sem herança. **Default methods** evitam quebra de compatibilidade. **Functional interfaces** permitem **lambdas**.
