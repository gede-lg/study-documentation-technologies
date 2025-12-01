# T1.03 - Palavra-chave Interface

## Introdução

**interface**: palavra-chave para declarar interface em Java.

```java
public interface Voador {
    void voar();
    void pousar();
}
```

**Sintaxe**:
```java
[modificador] interface NomeInterface [extends Interface1, Interface2, ...] {
    // Constantes (public static final implícito)
    // Métodos abstratos (public abstract implícito)
    // Métodos default (Java 8+)
    // Métodos static (Java 8+)
    // Métodos private (Java 9+)
}
```

**Modificadores válidos**:
- **public**: acessível de qualquer pacote
- **package-private** (padrão): acessível apenas no pacote

**Características**:
- Todos os métodos abstratos são **public** implícito
- Todos os campos são **public static final** implícito
- Não pode ter **construtores**
- Não pode ter **campos de instância**

---

## Fundamentos

### 1. Declaração Básica

**interface**: define contrato.

```java
public interface Calculadora {
    double somar(double a, double b);
    double subtrair(double a, double b);
}

public class CalculadoraSimples implements Calculadora {
    @Override
    public double somar(double a, double b) {
        return a + b;
    }
    
    @Override
    public double subtrair(double a, double b) {
        return a - b;
    }
}
```

### 2. Modificadores de Acesso

**public**: interface acessível de qualquer pacote.
**package-private** (padrão): interface acessível apenas no pacote.

```java
// Public: acessível de qualquer lugar
public interface PublicInterface {
    void metodo();
}

// Package-private (sem modificador): acessível apenas no pacote
interface PackageInterface {
    void metodo();
}
```

### 3. Métodos Abstratos Implícitos

Métodos em interface são **public abstract** implícito.

```java
public interface Exemplo {
    // Todos são equivalentes:
    void metodo1();
    public void metodo2();
    abstract void metodo3();
    public abstract void metodo4();
}

// Compilador trata todos como:
public interface Exemplo {
    public abstract void metodo1();
    public abstract void metodo2();
    public abstract void metodo3();
    public abstract void metodo4();
}
```

### 4. Constantes Implícitas

Campos em interface são **public static final** implícito.

```java
public interface Config {
    // Todos são equivalentes:
    int MAX_TENTATIVAS = 3;
    public int MAX_USUARIOS = 100;
    static int MAX_CONEXOES = 50;
    final int MAX_TIMEOUT = 30;
    public static final int MAX_BUFFER = 1024;
}

// Compilador trata todos como:
public interface Config {
    public static final int MAX_TENTATIVAS = 3;
    public static final int MAX_USUARIOS = 100;
    public static final int MAX_CONEXOES = 50;
    public static final int MAX_TIMEOUT = 30;
    public static final int MAX_BUFFER = 1024;
}
```

### 5. Extends em Interfaces

Interface pode **estender** (extends) outras interfaces (múltiplas).

```java
public interface Forma {
    double calcularArea();
}

public interface Desenhavel {
    void desenhar();
}

// Interface estende múltiplas interfaces
public interface FormaDesenhavel extends Forma, Desenhavel {
    void mover(double x, double y);
}

public class Circulo implements FormaDesenhavel {
    @Override
    public double calcularArea() {
        return 0;
    }
    
    @Override
    public void desenhar() {
    }
    
    @Override
    public void mover(double x, double y) {
    }
}
```

### 6. Métodos Default (Java 8+)

**default**: método com implementação em interface.

```java
public interface Repositorio {
    void salvar(Object obj);
    Object buscar(int id);
    
    // Método default (com implementação)
    default void atualizar(Object obj) {
        System.out.println("Atualização padrão");
    }
}

public class RepositorioImpl implements Repositorio {
    @Override
    public void salvar(Object obj) {
    }
    
    @Override
    public Object buscar(int id) {
        return null;
    }
    
    // atualizar() herdado (opcional sobrescrever)
}
```

### 7. Métodos Static (Java 8+)

**static**: método utilitário em interface.

```java
public interface Matematica {
    static int somar(int a, int b) {
        return a + b;
    }
    
    static int multiplicar(int a, int b) {
        return a * b;
    }
}

// Uso: via nome da interface
int resultado = Matematica.somar(5, 3); // 8
```

### 8. Métodos Private (Java 9+)

**private**: método auxiliar em interface (reutilização).

```java
public interface Validador {
    default boolean validarEmail(String email) {
        return validarNaoVazio(email) && email.contains("@");
    }
    
    default boolean validarTelefone(String telefone) {
        return validarNaoVazio(telefone) && telefone.length() >= 10;
    }
    
    // Método private (reutilização interna)
    private boolean validarNaoVazio(String valor) {
        return valor != null && !valor.isEmpty();
    }
}
```

### 9. Nested Interfaces

Interface pode ser declarada dentro de **classe** ou **interface**.

```java
public class Processador {
    // Interface aninhada
    public interface Callback {
        void aoCompletar();
        void aoFalhar(Exception e);
    }
    
    public void processar(Callback callback) {
        try {
            // Processar
            callback.aoCompletar();
        } catch (Exception e) {
            callback.aoFalhar(e);
        }
    }
}

// Uso
Processador.Callback callback = new Processador.Callback() {
    @Override
    public void aoCompletar() {
        System.out.println("Completo");
    }
    
    @Override
    public void aoFalhar(Exception e) {
        System.err.println("Erro: " + e.getMessage());
    }
};
```

### 10. Anotações em Interfaces

Interfaces podem ser **anotadas**.

```java
@FunctionalInterface
public interface Converter<F, T> {
    T converter(F from);
}

@Deprecated
public interface ObsoleteAPI {
    void metodoAntigo();
}
```

---

## Aplicabilidade

**Use interface quando**:
- Definir **contrato** de comportamento
- **Múltiplas implementações** possíveis
- **Polimorfismo** necessário
- **Desacoplamento** entre componentes

**Elementos de interface**:
- **Métodos abstratos**: comportamento obrigatório
- **Constantes**: valores compartilhados
- **Métodos default**: comportamento padrão (Java 8+)
- **Métodos static**: utilitários (Java 8+)
- **Métodos private**: reutilização interna (Java 9+)

---

## Armadilhas

### 1. Construtores em Interface

```java
// ❌ Interface não pode ter construtor
public interface Errado {
    public Errado() { } // ❌ ERRO
}
```

### 2. Campos de Instância

```java
// ❌ Interface não pode ter campos de instância
public interface Errado {
    private String nome; // ❌ ERRO: apenas public static final
}

// ✅ Apenas constantes
public interface Correto {
    String NOME_PADRAO = "Padrão"; // public static final implícito
}
```

### 3. Métodos Protected ou Private (Abstratos)

```java
// ❌ Métodos abstratos devem ser public
public interface Errado {
    protected void metodo(); // ❌ ERRO
    private void outro(); // ❌ ERRO (private só para métodos com corpo em Java 9+)
}

// ✅ Public implícito
public interface Correto {
    void metodo(); // public abstract implícito
}
```

### 4. Modificador Final em Métodos

```java
// ❌ Métodos abstratos não podem ser final
public interface Errado {
    final void metodo(); // ❌ ERRO
}

// ✅ Métodos default podem ser sobrescritos
public interface Correto {
    default void metodo() {
        System.out.println("Default");
    }
}
```

### 5. Implements ao Invés de Extends

```java
// ❌ Interface estende (extends), não implementa
public interface Errado implements OutraInterface { } // ❌ ERRO

// ✅ Interface usa extends
public interface Correto extends OutraInterface { }
```

### 6. Static em Métodos Abstratos

```java
// ❌ Métodos abstratos não podem ser static
public interface Errado {
    static void metodo(); // ❌ ERRO: static precisa de corpo
}

// ✅ Static com corpo
public interface Correto {
    static void metodo() {
        System.out.println("Static");
    }
}
```

### 7. Default Sem Corpo

```java
// ❌ Default precisa de corpo
public interface Errado {
    default void metodo(); // ❌ ERRO: default precisa de implementação
}

// ✅ Default com corpo
public interface Correto {
    default void metodo() {
        System.out.println("Default");
    }
}
```

---

## Boas Práticas

### 1. Nomeação Clara

```java
// ✅ Nomes descritivos (capacidade/comportamento)
public interface Runnable {
    void run();
}

public interface Comparable<T> {
    int compareTo(T o);
}

public interface Serializable {
}

// Sufixos comuns: -able, -ible, -er
public interface Converter { }
public interface Validator { }
```

### 2. Interface Funcional

```java
// ✅ Interface funcional (um método abstrato)
@FunctionalInterface
public interface Processor<T> {
    void process(T input);
    
    // Pode ter métodos default/static
    default void processAll(List<T> inputs) {
        inputs.forEach(this::process);
    }
    
    static <T> Processor<T> criar() {
        return input -> System.out.println(input);
    }
}

// Uso com lambda
Processor<String> processor = texto -> System.out.println(texto.toUpperCase());
processor.process("hello"); // HELLO
```

### 3. Constantes em Interface

```java
// ✅ Constantes relacionadas ao contrato
public interface HttpStatus {
    int OK = 200;
    int CREATED = 201;
    int NOT_FOUND = 404;
    int INTERNAL_ERROR = 500;
}

// ❌ Evite como namespace geral de constantes
// Use classe final ao invés
public final class Constantes {
    private Constantes() { }
    
    public static final int MAX = 100;
}
```

### 4. Default Methods para Evolução

```java
// ✅ Método default para adicionar sem quebrar implementações
public interface Repositorio {
    void salvar(Object obj);
    Object buscar(int id);
    
    // Adicionado posteriormente (não quebra código existente)
    default void atualizar(Object obj) {
        System.out.println("Atualização padrão");
    }
    
    // Adicionado posteriormente
    default void deletar(int id) {
        System.out.println("Deleção padrão");
    }
}
```

### 5. Static Utility Methods

```java
// ✅ Métodos utilitários relacionados à interface
public interface Comparador<T> {
    int comparar(T a, T b);
    
    static <T> Comparador<T> reverso(Comparador<T> comparador) {
        return (a, b) -> comparador.comparar(b, a);
    }
    
    static <T extends Comparable<T>> Comparador<T> natural() {
        return Comparable::compareTo;
    }
}

// Uso
Comparador<Integer> natural = Comparador.natural();
Comparador<Integer> reverso = Comparador.reverso(natural);
```

### 6. Private Methods para Reutilização

```java
// ✅ Private methods para evitar duplicação (Java 9+)
public interface Calculadora {
    default double calcularMedia(List<Double> valores) {
        validarLista(valores);
        double soma = valores.stream().mapToDouble(Double::doubleValue).sum();
        return soma / valores.size();
    }
    
    default double calcularSoma(List<Double> valores) {
        validarLista(valores);
        return valores.stream().mapToDouble(Double::doubleValue).sum();
    }
    
    // Private: reutilização interna
    private void validarLista(List<Double> valores) {
        if (valores == null || valores.isEmpty()) {
            throw new IllegalArgumentException("Lista vazia");
        }
    }
}
```

### 7. Interfaces Estendendo Interfaces

```java
// ✅ Interface estende outras (múltiplas)
public interface Leitura {
    Object ler();
}

public interface Escrita {
    void escrever(Object obj);
}

public interface LeituraEscrita extends Leitura, Escrita {
    void limpar();
}

public class Arquivo implements LeituraEscrita {
    @Override
    public Object ler() {
        return null;
    }
    
    @Override
    public void escrever(Object obj) {
    }
    
    @Override
    public void limpar() {
    }
}
```

### 8. Interface Marker

```java
// ✅ Interface marker (sem métodos)
public interface Serializavel {
}

// Uso
public class Usuario implements Serializavel {
    private String nome;
}

// Verificação
if (objeto instanceof Serializavel) {
    // Serializar
}

// Moderno: use annotations
@Serializavel
public class Produto {
}
```

### 9. Generics em Interfaces

```java
// ✅ Interface genérica
public interface Repositorio<T> {
    void salvar(T entidade);
    T buscar(int id);
    List<T> buscarTodos();
}

public class UsuarioRepositorio implements Repositorio<Usuario> {
    @Override
    public void salvar(Usuario entidade) {
    }
    
    @Override
    public Usuario buscar(int id) {
        return null;
    }
    
    @Override
    public List<Usuario> buscarTodos() {
        return new ArrayList<>();
    }
}
```

### 10. Documentação Javadoc

```java
/**
 * Interface que define operações de repositório para entidades.
 * 
 * @param <T> tipo da entidade gerenciada
 */
public interface Repositorio<T> {
    /**
     * Salva entidade no repositório.
     * 
     * @param entidade entidade a salvar (não pode ser null)
     * @throws IllegalArgumentException se entidade é null
     * @throws PersistenceException se erro ao salvar
     */
    void salvar(T entidade);
    
    /**
     * Busca entidade por ID.
     * 
     * @param id ID da entidade (deve ser > 0)
     * @return entidade encontrada ou null se não existe
     * @throws IllegalArgumentException se id <= 0
     */
    T buscar(int id);
    
    /**
     * Retorna todas as entidades.
     * 
     * @return lista de entidades (nunca null, pode ser vazia)
     */
    List<T> buscarTodos();
}
```

---

## Resumo

**interface**: palavra-chave para declarar interface.

```java
public interface Calculadora {
    double somar(double a, double b); // Abstrato
}
```

**Sintaxe**:
```java
[modificador] interface NomeInterface [extends Interface1, ...] {
    // Constantes (public static final implícito)
    // Métodos abstratos (public abstract implícito)
    // Métodos default (Java 8+)
    // Métodos static (Java 8+)
    // Métodos private (Java 9+)
}
```

**Modificadores**:
- **public**: acessível de qualquer pacote
- **package-private**: acessível apenas no pacote

**Métodos abstratos** (public abstract implícito):
```java
void metodo();
```

**Constantes** (public static final implícito):
```java
int MAX_TENTATIVAS = 3;
```

**Extends** (múltiplas interfaces):
```java
public interface FormaDesenhavel extends Forma, Desenhavel {
}
```

**Métodos default** (Java 8+):
```java
default void atualizar(Object obj) {
    System.out.println("Padrão");
}
```

**Métodos static** (Java 8+):
```java
static int somar(int a, int b) {
    return a + b;
}

// Uso
Matematica.somar(5, 3);
```

**Métodos private** (Java 9+):
```java
private boolean validarNaoVazio(String valor) {
    return valor != null && !valor.isEmpty();
}
```

**Nested interfaces**:
```java
public class Processador {
    public interface Callback {
        void aoCompletar();
    }
}
```

**Anotações**:
```java
@FunctionalInterface
public interface Converter<F, T> {
    T converter(F from);
}
```

**Restrições**:
- ❌ Sem construtores
- ❌ Sem campos de instância
- ❌ Métodos abstratos devem ser public
- ❌ Default/static precisam de corpo

**Boas práticas**:
- Nomes descritivos (-able, -ible, -er)
- Interface funcional: um método abstrato
- Default methods para evolução de API
- Static methods para utilitários
- Private methods para reutilização (Java 9+)
- Documentar contrato com Javadoc

**Generics**:
```java
public interface Repositorio<T> {
    void salvar(T entidade);
    T buscar(int id);
}
```

**Interface marker**:
```java
public interface Serializavel {
}
```

**Regra de Ouro**: Use **interface** para definir **contratos** de comportamento. Métodos abstratos são **public** implícito, campos são **public static final** implícito. Use **default** para evolução de API, **static** para utilitários, **private** para reutilização interna (Java 9+). Interface pode **estender** múltiplas interfaces. Documente contratos claramente.
