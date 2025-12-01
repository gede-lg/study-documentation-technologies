# T4.01 - Métodos Utilitários em Interfaces

## Introdução

**Métodos static** (Java 8+): métodos **utilitários** em interfaces.

```java
public interface Matematica {
    // Método static: utilitário
    static int somar(int a, int b) {
        return a + b;
    }
    
    static int subtrair(int a, int b) {
        return a - b;
    }
    
    static int multiplicar(int a, int b) {
        return a * b;
    }
}

// Uso: sem instância, via nome da interface
int resultado = Matematica.somar(5, 3); // 8
int resultado2 = Matematica.multiplicar(4, 2); // 8
```

**Características**:
- **Sem instância** (acesso via nome da interface)
- **Não herdado** (não pode ser sobrescrito)
- **Corpo obrigatório** (não pode ser abstrato)
- **Utilitários** relacionados à interface

**Benefícios**:
- **Organização** (utilitários próximos à interface)
- **Namespace** (evita classes utilitárias separadas)
- **Coesão** (funcionalidade relacionada agrupada)

---

## Fundamentos

### 1. Sintaxe Básica

**static**: palavra-chave antes do tipo de retorno.

```java
public interface StringUtils {
    // Método static
    static boolean isNullOrEmpty(String str) {
        return str == null || str.isEmpty();
    }
    
    static String reverse(String str) {
        if (str == null) return null;
        return new StringBuilder(str).reverse().toString();
    }
}

// Uso: via nome da interface
boolean vazio = StringUtils.isNullOrEmpty(""); // true
String reverso = StringUtils.reverse("abc"); // "cba"
```

### 2. Corpo Obrigatório

**static** precisa de **corpo** (não pode ser abstrato).

```java
public interface Exemplo {
    // ❌ ERRO: static sem corpo
    // static void metodo(); // ERRO
    
    // ✅ static com corpo
    static void metodo() {
        System.out.println("Método static");
    }
}
```

### 3. Acesso via Nome da Interface

**static**: acesso via **nome da interface** (não por instância).

```java
public interface Calculadora {
    static double pi() {
        return 3.14159;
    }
    
    static double areaCirculo(double raio) {
        return pi() * raio * raio;
    }
}

// ✅ Acesso via nome da interface
double area = Calculadora.areaCirculo(5.0);

// ❌ ERRO: não pode acessar via instância
// Calculadora calc = ...; // Interface não pode ser instanciada
```

### 4. Não Herdado por Implementações

Implementações **não herdam** métodos static.

```java
public interface Utils {
    static void log(String mensagem) {
        System.out.println("LOG: " + mensagem);
    }
}

public class MinhaClasse implements Utils {
    public void testar() {
        // ❌ ERRO: não herdado
        // log("teste"); // ERRO
        
        // ✅ Acesso via nome da interface
        Utils.log("teste"); // OK
    }
}
```

### 5. Não Pode Ser Sobrescrito

**static** não pode ser sobrescrito.

```java
public interface Interface1 {
    static void metodo() {
        System.out.println("Interface1");
    }
}

public class Classe implements Interface1 {
    // ❌ Não sobrescreve (método diferente)
    public static void metodo() {
        System.out.println("Classe"); // Método diferente (não @Override)
    }
}

// Uso
Interface1.metodo(); // Interface1
Classe.metodo(); // Classe (métodos diferentes)
```

### 6. Métodos Private (Java 9+)

**private static**: métodos auxiliares para outros static.

```java
public interface Validador {
    static boolean validarEmail(String email) {
        return isNotEmpty(email) && email.contains("@");
    }
    
    static boolean validarTelefone(String telefone) {
        return isNotEmpty(telefone) && telefone.length() >= 10;
    }
    
    // Private static: auxiliar
    private static boolean isNotEmpty(String str) {
        return str != null && !str.isEmpty();
    }
}
```

### 7. Factory Methods

**static**: factory methods.

```java
public interface Configuracao {
    String getUrl();
    int getTimeout();
    
    // Factory method static
    static Configuracao desenvolvimento() {
        return new Configuracao() {
            @Override
            public String getUrl() {
                return "http://localhost:8080";
            }
            
            @Override
            public int getTimeout() {
                return 30;
            }
        };
    }
    
    static Configuracao producao() {
        return new Configuracao() {
            @Override
            public String getUrl() {
                return "https://api.producao.com";
            }
            
            @Override
            public int getTimeout() {
                return 60;
            }
        };
    }
}

// Uso
Configuracao config = Configuracao.desenvolvimento();
System.out.println(config.getUrl()); // http://localhost:8080
```

### 8. Comparator Factory Methods

**Comparator**: factory methods static.

```java
public interface Comparator<T> {
    int compare(T o1, T o2);
    
    // Factory methods static
    static <T extends Comparable<? super T>> Comparator<T> naturalOrder() {
        return (c1, c2) -> c1.compareTo(c2);
    }
    
    static <T extends Comparable<? super T>> Comparator<T> reverseOrder() {
        return (c1, c2) -> c2.compareTo(c1);
    }
}

// Uso
List<String> nomes = Arrays.asList("João", "Maria", "Ana");
nomes.sort(Comparator.naturalOrder()); // [Ana, João, Maria]
nomes.sort(Comparator.reverseOrder()); // [Maria, João, Ana]
```

### 9. Collections Factory Methods (Java 9+)

**Collections**: factory methods static.

```java
public interface List<E> {
    // Factory methods static
    static <E> List<E> of() {
        return ImmutableCollections.emptyList();
    }
    
    static <E> List<E> of(E e1) {
        return new ImmutableCollections.List12<>(e1);
    }
    
    static <E> List<E> of(E e1, E e2) {
        return new ImmutableCollections.List12<>(e1, e2);
    }
    
    // ... outros of()
}

// Uso
List<String> lista = List.of("A", "B", "C"); // Imutável
Set<Integer> conjunto = Set.of(1, 2, 3); // Imutável
Map<String, Integer> mapa = Map.of("A", 1, "B", 2); // Imutável
```

### 10. Stream Factory Methods

**Stream**: factory methods static.

```java
public interface Stream<T> {
    // Factory methods static
    static <T> Stream<T> of(T t) {
        return StreamSupport.stream(new Streams.StreamBuilderImpl<>(t), false);
    }
    
    static <T> Stream<T> of(T... values) {
        return Arrays.stream(values);
    }
    
    static <T> Stream<T> empty() {
        return StreamSupport.stream(Spliterators.emptySpliterator(), false);
    }
}

// Uso
Stream<String> stream1 = Stream.of("A", "B", "C");
Stream<Integer> stream2 = Stream.of(1, 2, 3);
Stream<String> stream3 = Stream.empty();
```

---

## Aplicabilidade

**Métodos static em interfaces**:
- **Utilitários** relacionados à interface
- **Factory methods** (criação de instâncias)
- **Helper methods** (auxiliares)
- **Validadores** (validação de dados)

**Quando usar**:
- Funcionalidade **relacionada** à interface
- **Sem estado** (stateless)
- **Utilitários** que não precisam de instância
- **Factory methods** para criar implementações

---

## Armadilhas

### 1. Static Sem Corpo

```java
public interface Errado {
    // ❌ ERRO: static sem corpo
    // static void metodo(); // ERRO
}

// ✅ static com corpo
public interface Correto {
    static void metodo() {
        System.out.println("OK");
    }
}
```

### 2. Tentar Acessar via Instância

```java
public interface Utils {
    static void log(String msg) {
        System.out.println(msg);
    }
}

// ❌ ERRO: não pode acessar via instância
// Utils utils = ...; // Interface não pode ser instanciada

// ✅ Acesso via nome da interface
Utils.log("mensagem");
```

### 3. Esperar Herança

```java
public interface Utils {
    static void log(String msg) {
        System.out.println(msg);
    }
}

public class MinhaClasse implements Utils {
    public void testar() {
        // ❌ ERRO: não herdado
        // log("teste"); // ERRO
        
        // ✅ Acesso via interface
        Utils.log("teste");
    }
}
```

### 4. Tentar Sobrescrever

```java
public interface Interface1 {
    static void metodo() {
        System.out.println("Interface1");
    }
}

public class Classe implements Interface1 {
    // ❌ Não sobrescreve (método diferente)
    // @Override // ERRO: não sobrescreve
    public static void metodo() {
        System.out.println("Classe");
    }
}
```

### 5. Confundir com Default

```java
// ❌ Confundir static com default
public interface Errado {
    // static: não herdado, acesso via interface
    static void metodoStatic() { }
    
    // default: herdado, pode ser sobrescrito
    default void metodoDefault() { }
}

// static: não herdado
public class Impl1 implements Errado {
    public void testar() {
        // Errado.metodoStatic(); // Acesso via interface
        metodoDefault(); // Herdado
    }
}
```

### 6. Static em Interface vs Classe

```java
// ⚠️ Confusão: static em interface vs classe
public interface Interface1 {
    static void metodo() { } // Não herdado
}

public class Classe {
    public static void metodo() { } // Herdado por subclasses
}
```

### 7. Modificadores Incompatíveis

```java
public interface Errado {
    // ❌ ERRO: abstract e static incompatíveis
    // abstract static void metodo(); // ERRO
    
    // ❌ ERRO: default e static incompatíveis
    // default static void metodo() { } // ERRO
}
```

---

## Boas Práticas

### 1. Utilitários Relacionados à Interface

```java
// ✅ Utilitários relacionados
public interface Repositorio<T> {
    void salvar(T entidade);
    T buscar(int id);
    
    // Utilitários relacionados
    static <T> void validar(T entidade) {
        if (entidade == null) {
            throw new IllegalArgumentException("Entidade null");
        }
    }
}
```

### 2. Factory Methods

```java
public interface Conexao {
    void conectar();
    void desconectar();
    
    // Factory methods
    static Conexao mysql(String url) {
        return new ConexaoMySQL(url);
    }
    
    static Conexao postgres(String url) {
        return new ConexaoPostgres(url);
    }
}

// Uso
Conexao conn = Conexao.mysql("jdbc:mysql://localhost/db");
```

### 3. Private Static para Reutilização

```java
public interface Validador {
    static boolean validarCPF(String cpf) {
        return isNotEmpty(cpf) && cpf.length() == 11;
    }
    
    static boolean validarCNPJ(String cnpj) {
        return isNotEmpty(cnpj) && cnpj.length() == 14;
    }
    
    // Private static: reutilização
    private static boolean isNotEmpty(String str) {
        return str != null && !str.isEmpty();
    }
}
```

### 4. Naming Convention

```java
// ✅ Factory methods: of(), from(), valueOf(), etc.
public interface Lista<E> {
    static <E> Lista<E> of(E... elementos) {
        return new ListaImpl<>(elementos);
    }
    
    static <E> Lista<E> from(Collection<E> colecao) {
        return new ListaImpl<>(colecao);
    }
}
```

### 5. Documentar Métodos Static

```java
public interface Matematica {
    /**
     * Calcula a área de um círculo.
     * 
     * @param raio raio do círculo (deve ser > 0)
     * @return área do círculo
     * @throws IllegalArgumentException se raio <= 0
     */
    static double areaCirculo(double raio) {
        if (raio <= 0) {
            throw new IllegalArgumentException("Raio deve ser > 0");
        }
        return Math.PI * raio * raio;
    }
}
```

### 6. Evitar Estado

```java
// ❌ Evitar estado em métodos static
public interface Errado {
    static int contador = 0; // Constante (não estado mutável)
    
    static void incrementar() {
        // contador++; // Não pode (final implícito)
    }
}

// ✅ Stateless
public interface Correto {
    static int somar(int a, int b) {
        return a + b; // Sem estado
    }
}
```

### 7. Comparator Factory Methods

```java
public class Pessoa {
    private String nome;
    private int idade;
    
    // Getters
}

public interface PessoaComparator {
    // Factory methods para comparadores
    static Comparator<Pessoa> porNome() {
        return Comparator.comparing(Pessoa::getNome);
    }
    
    static Comparator<Pessoa> porIdade() {
        return Comparator.comparing(Pessoa::getIdade);
    }
    
    static Comparator<Pessoa> porNomeEIdade() {
        return Comparator.comparing(Pessoa::getNome)
                         .thenComparing(Pessoa::getIdade);
    }
}

// Uso
List<Pessoa> pessoas = ...;
pessoas.sort(PessoaComparator.porNome());
```

### 8. Builder Pattern

```java
public interface Requisicao {
    String getUrl();
    String getMetodo();
    Map<String, String> getHeaders();
    
    // Builder static
    static Builder builder() {
        return new Builder();
    }
    
    class Builder {
        private String url;
        private String metodo = "GET";
        private Map<String, String> headers = new HashMap<>();
        
        public Builder url(String url) {
            this.url = url;
            return this;
        }
        
        public Builder metodo(String metodo) {
            this.metodo = metodo;
            return this;
        }
        
        public Builder header(String chave, String valor) {
            this.headers.put(chave, valor);
            return this;
        }
        
        public Requisicao build() {
            return new RequisicaoImpl(url, metodo, headers);
        }
    }
}

// Uso
Requisicao req = Requisicao.builder()
    .url("https://api.exemplo.com")
    .metodo("POST")
    .header("Content-Type", "application/json")
    .build();
```

### 9. Validadores Static

```java
public interface Validador {
    static void validarNaoNull(Object obj, String mensagem) {
        if (obj == null) {
            throw new IllegalArgumentException(mensagem);
        }
    }
    
    static void validarPositivo(int valor, String mensagem) {
        if (valor <= 0) {
            throw new IllegalArgumentException(mensagem);
        }
    }
    
    static void validarNaoVazio(String str, String mensagem) {
        if (str == null || str.isEmpty()) {
            throw new IllegalArgumentException(mensagem);
        }
    }
}

// Uso
public class Produto {
    private String nome;
    private double preco;
    
    public Produto(String nome, double preco) {
        Validador.validarNaoVazio(nome, "Nome não pode ser vazio");
        Validador.validarPositivo((int) preco, "Preço deve ser positivo");
        
        this.nome = nome;
        this.preco = preco;
    }
}
```

### 10. Converter entre Tipos

```java
public interface Converter<F, T> {
    T converter(F from);
    
    // Factory methods static
    static <F, T> Converter<F, T> from(Function<F, T> function) {
        return function::apply;
    }
    
    static Converter<String, Integer> stringParaInt() {
        return Integer::parseInt;
    }
    
    static Converter<Integer, String> intParaString() {
        return String::valueOf;
    }
}

// Uso
Converter<String, Integer> converter = Converter.stringParaInt();
Integer numero = converter.converter("123"); // 123
```

---

## Resumo

**Métodos static**: utilitários em interfaces (Java 8+).

```java
public interface Matematica {
    static int somar(int a, int b) {
        return a + b;
    }
}

// Uso: via nome da interface
int resultado = Matematica.somar(5, 3);
```

**Características**:
- **Corpo obrigatório** (não pode ser abstrato)
- **Acesso via interface** (não por instância)
- **Não herdado** (implementações não herdam)
- **Não pode ser sobrescrito**

**Sintaxe**:
```java
static TipoRetorno nomeMetodo(parametros) {
    // corpo
}
```

**Private static** (Java 9+):
```java
private static void auxiliar() {
    // Reutilização interna
}
```

**Factory methods**:
```java
static Configuracao desenvolvimento() {
    return new ConfiguracaoImpl(...);
}
```

**Comparator**:
```java
static <T> Comparator<T> naturalOrder() {
    return (c1, c2) -> c1.compareTo(c2);
}
```

**Collections** (Java 9+):
```java
List<String> lista = List.of("A", "B", "C");
Set<Integer> conjunto = Set.of(1, 2, 3);
```

**Stream**:
```java
Stream<String> stream = Stream.of("A", "B", "C");
```

**Boas práticas**:
- Utilitários **relacionados** à interface
- **Factory methods** (of(), from(), valueOf())
- **Private static** para reutilização
- **Naming convention** (of, from, builder)
- **Documentar** métodos static
- **Stateless** (sem estado)
- Comparator factory methods
- Builder pattern
- Validadores static
- Converters

**Armadilhas**:
- ❌ static sem corpo
- ❌ Acessar via instância
- ❌ Esperar herança (não herdado)
- ❌ Tentar sobrescrever
- ❌ Confundir com default
- ❌ Modificadores incompatíveis (abstract static, default static)

**static vs default**:

| Aspecto | static | default |
|---------|--------|---------|
| **Herança** | Não herdado | Herdado |
| **Acesso** | Via interface | Via instância |
| **Sobrescrita** | Não pode | Pode |
| **Uso** | Utilitários | Implementação padrão |

**Regra de Ouro**: Use **métodos static** para **utilitários** relacionados à interface que **não precisam de instância**. **Acesso via nome da interface**. **Não herdado** e **não pode ser sobrescrito**. Ideal para **factory methods**, **validadores**, **converters**. Use **private static** para reutilização interna (Java 9+). Mantenha **stateless** (sem estado).
