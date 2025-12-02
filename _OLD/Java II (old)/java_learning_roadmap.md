
# Grade Completa de Aprendizado Java - Conceitos e Sintaxe

## 1. Introdução

### 1.1 História e Filosofia do Java

- Origem da linguagem (Sun Microsystems, James Gosling)
- Filosofia “Write Once, Run Anywhere” (WORA)
- Evolução das versões do Java (Java 8, 11, 17, 21 LTS)
- Diferenças entre Oracle JDK, OpenJDK e outras distribuições

### 1.2 Arquitetura da Plataforma Java

- Java Virtual Machine (JVM) - conceitos e funcionamento
- Java Runtime Environment (JRE) - componentes e propósito
- Java Development Kit (JDK) - ferramentas e utilitários
- Processo de compilação: .java → .class → execução na JVM
- Bytecode e sua portabilidade

### 1.3 Ambiente de Desenvolvimento

- Instalação e configuração do JDK
- Variáveis de ambiente (JAVA_HOME, PATH, CLASSPATH)
- IDEs principais (IntelliJ IDEA, Eclipse, Visual Studio Code)
- Ferramentas de linha de comando (javac, java, jar, javap, jshell)

## 2. Fundamentos

### 2.1 Sintaxe Básica

- Estrutura básica de um programa Java
- Método main() - ponto de entrada da aplicação
- Comentários (linha única, múltiplas linhas, documentação)
- Case sensitivity e convenções de nomenclatura
- Palavras reservadas e identificadores válidos

### 2.2 Tipos de Dados Primitivos

- Tipos numéricos inteiros (byte, short, int, long)
- Tipos numéricos decimais (float, double)
- Tipo caractere (char) e Unicode
- Tipo booleano (boolean)
- Literais e suas representações
- Conversões implícitas e explícitas (casting)
- Wrapper classes e autoboxing/unboxing

### 2.3 Variáveis e Constantes

- Declaração e inicialização de variáveis
- Escopo de variáveis (local, instância, classe)
- Modificador final - constantes e imutabilidade
- Convenções de nomenclatura (camelCase, UPPER_CASE)

### 2.4 Operadores

- Operadores aritméticos (+, -, *, /, %, ++, –)
- Operadores de atribuição (=, +=, -=, *=, /=, %=)
- Operadores relacionais (==, !=, <, >, <=, >=)
- Operadores lógicos (&&, ||, !, &, |, ^)
- Operadores bitwise (&, |, ^, ~, <<, >>, >>>)
- Operador ternário (?:)
- Precedência e associatividade de operadores

### 2.5 Estruturas de Controle

- **Estruturas Condicionais:**
    - if, else if, else
    - switch-case (tradicional e com expressões)
    - Padrão de matching básico
- **Estruturas de Repetição:**
    - for loop (tradicional e enhanced/for-each)
    - while loop
    - do-while loop
    - break e continue com labels
- **Controle de Fluxo:**
    - return statement
    - Aninhamento de estruturas

### 2.6 Arrays

- Declaração e inicialização de arrays unidimensionais
- Arrays multidimensionais (matriz)
- Propriedade length
- Iteração sobre arrays
- Arrays como parâmetros e valores de retorno
- Classe Arrays (java.util.Arrays) - métodos utilitários

### 2.7 Strings

- Classe String - imutabilidade e pool de strings
- Criação de strings (literal vs new)
- Métodos principais da classe String
- Concatenação de strings e performance
- StringBuilder e StringBuffer - mutabilidade
- Formatação de strings (String.format, printf)
- Expressões regulares básicas

## 3. Exceções e Assertions

### 3.1 Conceitos Fundamentais de Exceções

- O que são exceções e quando ocorrem
- Hierarquia de exceções (Throwable, Error, Exception)
- Checked vs Unchecked exceptions
- RuntimeException e suas subclasses principais

### 3.2 Tratamento de Exceções

- Bloco try-catch-finally
- Múltiplos catch blocks
- Multi-catch (Java 7+)
- Try-with-resources (Java 7+) - AutoCloseable
- Propagação de exceções

### 3.3 Lançamento de Exceções

- Palavra-chave throw
- Declaração throws em métodos
- Criação de exceções customizadas
- Boas práticas no design de exceções
- Exception chaining - causa raiz

### 3.4 Assertions

- Conceito e propósito das assertions
- Sintaxe: assert condition e assert condition : message
- Habilitação e desabilitação (-ea, -da)
- Quando usar assertions vs exceções
- Invariantes, pré-condições e pós-condições

## 4. Entrada e Saída (I/O)

### 4.1 Fundamentos de I/O

- Conceitos de streams, buffers e canais
- Diferença entre byte streams e character streams
- Blocking vs non-blocking I/O

### 4.2 Byte Streams

- InputStream e OutputStream (classes abstratas)
- FileInputStream e FileOutputStream
- BufferedInputStream e BufferedOutputStream
- ByteArrayInputStream e ByteArrayOutputStream
- Operações básicas de leitura e escrita

### 4.3 Character Streams

- Reader e Writer (classes abstratas)
- FileReader e FileWriter
- BufferedReader e BufferedWriter
- StringReader e StringWriter
- InputStreamReader e OutputStreamWriter - pontes entre byte e character streams

### 4.4 Trabalhando com Arquivos

- Classe File - manipulação de arquivos e diretórios
- Criação, leitura, escrita e exclusão de arquivos
- Navegação em diretórios
- Propriedades de arquivos (tamanho, data, permissões)

### 4.5 NIO (New I/O)

- Introdução ao java.nio
- Path e Paths - representação de caminhos
- Files - operações utilitárias com arquivos
- Diferenças conceituais entre IO clássico e NIO

### 4.6 Serialização

- Conceitos de serialização e desserialização
- Interface Serializable
- ObjectOutputStream e ObjectInputStream
- Control de serialização (writeObject, readObject)
- serialVersionUID e compatibilidade
- Palavra-chave transient

## 5. Orientação a Objetos (OO)

### 5.1 Conceitos Fundamentais

- Paradigma orientado a objetos - princípios básicos
- Objetos e classes - definição e relacionamento
- Estado (atributos) e comportamento (métodos)
- Instanciação e referências de objetos

### 5.2 Classes e Objetos

- **Definição de Classes:**
    - Estrutura básica de uma classe
    - Atributos de instância e de classe (static)
    - Métodos de instância e de classe (static)
    - Modificadores de acesso (public, private, protected, package-private)
- **Criação e Uso de Objetos:**
    - Operador new e instanciação
    - Referências e garbage collection
    - Método equals() e hashCode()
    - Método toString()

### 5.3 Construtores

- Propósito e funcionamento dos construtores
- Construtor padrão vs construtor customizado
- Sobrecarga de construtores
- Chamada entre construtores (this())
- Ordem de inicialização (blocos static, blocos de instância, construtores)

### 5.4 Métodos

- **Definição e Estrutura:**
    - Assinatura de métodos
    - Parâmetros e argumentos
    - Valores de retorno
    - Variáveis locais vs parâmetros
- **Características Avançadas:**
    - Sobrecarga de métodos (overloading)
    - Argumentos variáveis (varargs)
    - Passagem de parâmetros (por valor vs por referência)
    - Recursão

### 5.5 Encapsulamento

- Princípio do encapsulamento
- Modificadores de acesso e visibilidade
- Getters e setters - convenções JavaBean
- Imutabilidade - design de classes imutáveis
- Validação de dados nos setters

### 5.6 Herança

- **Conceitos Básicos:**
    - Palavra-chave extends
    - Relação “é um” (is-a)
    - Hierarquia de classes e Object como superclasse universal
- **Características da Herança:**
    - Construtor da superclasse (super())
    - Acesso a membros da superclasse (super.método)
    - Modificador protected
    - Herança múltipla - por que Java não permite

### 5.7 Polimorfismo

- **Conceitos Fundamentais:**
    - Polimorfismo de subtipo
    - Early binding vs late binding
    - Upcasting e downcasting
- **Sobrescrita de Métodos:**
    - Anotação @Override
    - Regras para sobrescrita
    - Covariant return types
    - Sobrescrita vs sobrecarga

### 5.8 Classes e Métodos Abstratos

- Palavra-chave abstract
- Classes abstratas - quando e como usar
- Métodos abstratos - contratos que devem ser implementados
- Template Method Pattern básico

### 5.9 Interfaces

- **Conceitos Básicos:**
    - Definição e propósito das interfaces
    - Palavra-chave implements
    - Múltipla implementação de interfaces
- **Características das Interfaces:**
    - Métodos abstratos implícitos
    - Constantes implícitas (public static final)
    - Métodos default (Java 8+)
    - Métodos static em interfaces (Java 8+)
    - Métodos private em interfaces (Java 9+)
- **Design com Interfaces:**
    - Programação para interfaces vs implementações
    - Composição vs herança
    - Interfaces funcionais (base para lambdas)

### 5.10 Classes Internas (Nested Classes)

- **Tipos de Classes Internas:**
    - Inner classes (non-static)
    - Static nested classes
    - Local classes (dentro de métodos)
    - Anonymous classes
- **Características e Usos:**
    - Acesso a membros da classe externa
    - Casos de uso apropriados para cada tipo
    - Relacionamento com garbage collection

### 5.11 Enums

- Conceito e propósito dos enums
- Definição básica de enumerações
- Métodos implícitos (values(), valueOf(), ordinal())
- Enums com atributos e métodos customizados
- Padrão Strategy com enums

### 5.12 Records (Java 14+)

- Conceito de records - classes de dados imutáveis
- Sintaxe e componentes automáticos
- Customização de records
- Quando usar records vs classes tradicionais

## 6. Streams

### 6.1 Introdução aos Streams

- Paradigma funcional vs imperativo
- Conceito de streams - sequências de dados
- Diferença entre streams e coleções
- Stream pipeline - source, intermediate operations, terminal operations

### 6.2 Criação de Streams

- A partir de coleções (Collection.stream())
- Arrays.stream() para arrays
- Stream.of() para valores específicos
- Stream.generate() e Stream.iterate()
- Streams infinitos e finitos
- Streams primitivos (IntStream, LongStream, DoubleStream)

### 6.3 Operações Intermediárias

- **Transformação:**
    - map() - transformação um-para-um
    - flatMap() - achatamento de streams
- **Filtragem:**
    - filter() - filtrar elementos por predicado
    - distinct() - remover duplicatas
    - limit() e skip() - limitação e paginação
- **Ordenação:**
    - sorted() - ordenação natural e com Comparator

### 6.4 Operações Terminais

- **Coleta de Resultados:**
    - collect() - collectors predefinidos e customizados
    - toList(), toSet(), toMap()
- **Redução:**
    - reduce() - redução customizada
    - count(), sum(), min(), max(), average()
- **Busca e Verificação:**
    - findFirst(), findAny()
    - anyMatch(), allMatch(), noneMatch()
- **Iteração:**
    - forEach() - efeitos colaterais

### 6.5 Collectors

- Collectors.toList(), toSet(), toMap()
- Collectors.joining() - concatenação de strings
- Collectors.groupingBy() - agrupamento
- Collectors.partitioningBy() - particionamento
- Collectors customizados

### 6.6 Expressões Lambda e Method References

- **Lambda Expressions:**
    - Sintaxe básica: (parametros) -> expressao
    - Inferência de tipos
    - Escopo de variáveis (effectively final)
- **Method References:**
    - Static method references (Class::method)
    - Instance method references (object::method)
    - Constructor references (Class::new)

### 6.7 Interfaces Funcionais

- Conceito de interface funcional
- Anotação @FunctionalInterface
- Interfaces funcionais principais:
    - Predicate
        
        - testes booleanos
        
    - Function<T,R> - transformações
    - Consumer
        
        - consumo sem retorno
        
    - Supplier
        
        - fornecimento sem parâmetros
        
    - UnaryOperator
        
        e BinaryOperator
        

### 6.8 Parallel Streams

- Conceitos de paralelização
- parallelStream() vs sequential()
- Fork-Join Framework subjacente
- Quando usar parallel streams
- Considerações de performance e thread safety

## 7. Concorrência e Paralelismo

### 7.1 Conceitos Fundamentais

- Diferença entre concorrência e paralelismo
- Processos vs threads
- Thread scheduling e context switching
- Race conditions e thread safety

### 7.2 Threads em Java

- **Criação de Threads:**
    - Extensão da classe Thread
    - Implementação da interface Runnable
    - Lambda expressions para Runnable
- **Ciclo de Vida das Threads:**
    - Estados: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED
    - Métodos: start(), run(), sleep(), join()
    - Thread interruption e cooperative cancellation

### 7.3 Sincronização

- **Palavra-chave synchronized:**
    - Métodos sincronizados
    - Blocos sincronizados
    - Locks intrínsecos (monitor locks)
- **Problemas de Concorrência:**
    - Data races e visibility problems
    - Deadlocks - detecção e prevenção
    - Starvation e livelock

### 7.4 Palavra-chave volatile

- Semântica de visibilidade
- Happens-before relationship
- Quando usar volatile vs synchronized

### 7.5 Executor Framework

- **Interfaces Principais:**
    - Executor, ExecutorService, ScheduledExecutorService
    - Callable vs Runnable
    - Future e CompletableFuture
- **Implementações:**
    - ThreadPoolExecutor
    - Executors factory methods
    - ScheduledThreadPoolExecutor
- **Thread Pools:**
    - Fixed thread pool
    - Cached thread pool
    - Single thread executor
    - Work stealing pool (ForkJoinPool)

### 7.6 java.util.concurrent

- **Coleções Thread-Safe:**
    - ConcurrentHashMap
    - CopyOnWriteArrayList
    - BlockingQueue implementations
- **Utilitários de Sincronização:**
    - CountDownLatch
    - CyclicBarrier
    - Semaphore
    - ReentrantLock e Condition
- **Atomic Variables:**
    - AtomicInteger, AtomicLong, AtomicReference
    - Compare-and-swap operations

### 7.7 Fork-Join Framework

- Conceitos de work stealing
- RecursiveAction e RecursiveTask
- ForkJoinPool
- Padrão divide-and-conquer

### 7.8 CompletableFuture

- Programação assíncrona
- Composition de operações
- Exception handling em chains assíncronas
- Timeouts e cancellation

## 8. Annotations

### 8.1 Conceitos Fundamentais

- O que são annotations e sua finalidade
- Metadata em tempo de compilação vs runtime
- Diferença entre annotations e comentários

### 8.2 Annotations Built-in

- **Annotations de Uso Geral:**
    - @Override - sobrescrita de métodos
    - @Deprecated - marcação de obsolescência
    - @SuppressWarnings - supressão de warnings
- **Annotations de Informação de Tipo:**
    - @FunctionalInterface - interfaces funcionais
    - @SafeVarargs - varargs type-safe

### 8.3 Meta-Annotations

- @Target - onde a annotation pode ser aplicada
- @Retention - quando a annotation está disponível
- @Documented - inclusão na documentação
- @Inherited - herança de annotations
- @Repeatable - annotations repetíveis (Java 8+)

### 8.4 Criação de Annotations Customizadas

- Sintaxe básica para definição
- Elementos de annotation (methods)
- Valores padrão para elementos
- Annotations marker (sem elementos)

### 8.5 Processamento de Annotations

- **Runtime Processing:**
    - Reflection API para acessar annotations
    - AnnotatedElement interface
    - Casos de uso para processing runtime
- **Compile-time Processing:**
    - Annotation Processing Tool (APT)
    - Annotation processors customizados
    - Geração de código em tempo de compilação

## 9. Reflection

### 9.1 Conceitos Fundamentais

- O que é reflection e para que serve
- Runtime type information
- Custos de performance da reflection
- Casos de uso apropriados

### 9.2 Class Objects

- Obtendo referências Class
- Métodos da classe Class
- Informações sobre modificadores
- Hierarquia de classes via reflection

### 9.3 Introspecção de Membros

- **Fields (Atributos):**
    - Field class e seus métodos
    - Acesso a fields privados
    - Modificação de valores via reflection
- **Methods (Métodos):**
    - Method class e invocação dinâmica
    - Parâmetros e tipos de retorno
    - Métodos privados e acessibilidade
- **Constructors:**
    - Constructor class
    - Instanciação dinâmica de objetos
    - Parâmetros de construtores

### 9.4 Arrays via Reflection

- Array class para manipulação dinâmica
- Criação de arrays com tipos desconhecidos
- Acesso e modificação de elementos

### 9.5 Annotations via Reflection

- Leitura de annotations em runtime
- AnnotatedElement methods
- Processing de annotations customizadas

### 9.6 Segurança e Accessibility

- SecurityManager e reflection
- setAccessible() para membros privados
- Implicações de segurança

### 9.7 Performance e Boas Práticas

- Caching de Class, Method, Field objects
- Alternativas à reflection quando possível
- Reflection vs código estático

## 10. Módulos

### 10.1 Introdução ao Module System (Java 9+)

- Problemas que o sistema de módulos resolve
- Classpath hell e strong encapsulation
- Modularização da JDK

### 10.2 module-info.java

- Declaração básica de módulos
- Sintaxe do module descriptor
- Localização e convenções de nomes

### 10.3 Diretivas de Módulo

- **requires** - dependências de módulos
- **exports** - exportação de packages
- **opens** - abertura para reflection
- **uses** - declaração de uso de serviços
- **provides** - implementação de serviços

### 10.4 Tipos de Módulos

- **Explicit modules** - módulos com module-info
- **Automatic modules** - JARs no module path
- **Unnamed module** - classpath tradicional

### 10.5 Migration para Módulos

- Bottom-up vs top-down migration
- Mixed classpath/module path scenarios
- Comando-line flags para transição

### 10.6 Services e ServiceLoader

- Service Provider Interface (SPI) pattern
- Descoberta dinâmica de implementações
- Desacoplamento via services

### 10.7 Ferramentas de Módulo

- **jmod** - criação de arquivos de módulo
- **jlink** - criação de runtime images customizadas
- **jdeps** - análise de dependências

## 11. Ferramentas de Build e Gerenciamento de Dependências

### 11.1 Conceitos Fundamentais

- Build automation - necessidade e benefícios
- Dependency management - versionamento e conflicts
- Artifact repositories e distribution

### 11.2 Maven

- **Estrutura de Projeto:**
    - Standard directory layout
    - Project Object Model (POM)
    - Coordenadas: groupId, artifactId, version
- **Build Lifecycle:**
    - Fases padrão: compile, test, package, install, deploy
    - Goals e plugins
    - Profiles para diferentes ambientes
- **Dependency Management:**
    - Scopes de dependência
    - Transitive dependencies
    - Exclusions e dependency mediation

### 11.3 Gradle

- **Estrutura Baseada em Tasks:**
    - Groovy/Kotlin DSL
    - Task dependencies e DAG
    - Build scripts customizáveis
- **Dependency Management:**
    - Configurations
    - Repository declarations
    - Version conflicts resolution
- **Performance Features:**
    - Incremental builds
    - Build cache
    - Daemon process

### 11.4 Ferramentas JDK

- **javac** - compilador Java
- **jar** - criação e manipulação de JAR files
- **java** - execução de aplicações
- **javadoc** - geração de documentação
- **jshell** - REPL interativo (Java 9+)

## 12. Banco de Dados com Java

### 12.1 Acesso Básico e Puro

### 12.1.1 JDBC (Java Database Connectivity)

- **Arquitetura JDBC:**
    - JDBC API e drivers
    - Tipos de drivers (Type 1-4)
    - DriverManager vs DataSource
- **Estabelecimento de Conexão:**
    - Connection URL patterns
    - Propriedades de conexão
    - Connection pooling básico
- **Execução de Comandos:**
    - Statement vs PreparedStatement vs CallableStatement
    - SQL injection prevention
    - Batch operations
- **Processamento de Resultados:**
    - ResultSet e navegação
    - Mapeamento de tipos SQL para Java
    - ResultSetMetaData

### 12.1.2 Transações

- Conceitos ACID
- Commit e rollback manual
- Isolation levels
- Savepoints

### 12.1.3 Boas Práticas JDBC

- Resource management (try-with-resources)
- Connection pooling libraries (HikariCP, C3P0)
- SQL builders e utilities

### 12.2 ORMs (Object-Relational Mapping)

### 12.2.1 Conceitos de ORM

- Object-relational impedance mismatch
- Active Record vs Data Mapper patterns
- Lazy vs eager loading
- N+1 problem

### 12.2.2 JPA (Java Persistence API)

- **Annotations Principais:**
    - @Entity, @Table, @Id, @GeneratedValue
    - @Column, @JoinColumn, @JoinTable
    - Mapeamentos de relacionamentos (@OneToOne, @OneToMany, etc.)
- **EntityManager:**
    - Persistence context
    - Entity lifecycle (persist, merge, remove, detach)
    - JPQL (Java Persistence Query Language)
    - Criteria API para queries dinâmicas
- **Configuration:**
    - persistence.xml
    - Entity scanning e configurations

### 12.2.3 Hibernate (Implementação JPA)

- Hibernate-specific features
- HQL (Hibernate Query Language)
- Caching (first-level, second-level)
- Connection pooling integration

### 12.2.4 Spring Data JPA

- Repository pattern implementation
- Query methods derivation
- Custom queries com @Query
- Specifications para queries complexas

## 13. Assincronismo

### 13.1 Conceitos Fundamentais

- Synchronous vs asynchronous programming
- Blocking vs non-blocking operations
- Event-driven architecture
- Callback hell e suas soluções

### 13.2 CompletableFuture (Revisão Avançada)

- **Criação de CompletableFuture:**
    - supplyAsync(), runAsync()
    - Factory methods e custom executors
- **Composição e Transformação:**
    - thenApply(), thenCompose(), thenCombine()
    - thenApplyAsync() - controle de threads
- **Error Handling:**
    - handle(), whenComplete(), exceptionally()
    - Exception propagation em chains

### 13.3 Reactive Programming

- **Conceitos Básicos:**
    - Observer pattern estendido
    - Backpressure handling
    - Hot vs cold streams
- **Project Reactor (Opcional):**
    - Mono e Flux types
    - Operators básicos
    - Threading model

### 13.4 Virtual Threads (Java 19+/21)

- Conceitos de lightweight threads
- Diferenças para platform threads
- Structured concurrency
- Casos de uso para virtual threads

### 13.5 Asynchronous I/O

- **NIO.2 Asynchronous Channels:**
    - AsynchronousFileChannel
    - AsynchronousSocketChannel
    - CompletionHandler interface
- **Non-blocking I/O patterns:**
    - Selectors e channels
    - Multiplexing de I/O operations

## 14. Requisições HTTP

### 14.1 HTTP Client (Java 11+)

- **Configuração e Criação:**
    - HttpClient.Builder
    - Connection pools e timeouts
    - Proxy configuration
- **HttpRequest:**
    - Request building
    - Headers customizados
    - Request body (string, file, stream)
    - HTTP methods (GET, POST, PUT, DELETE)
- **HttpResponse:**
    - Response body handlers
    - Status codes e headers
    - Response processing

### 14.2 Requisições Síncronas vs Assíncronas

- send() vs sendAsync()
- CompletableFuture integration
- Thread management em requests assíncronas

### 14.3 Trabalhando com JSON

- **Parsing JSON:**
    - Bibliotecas populares (Jackson, Gson)
    - Binding para POJOs
    - Annotations para customização
- **Serialization/Deserialization:**
    - Object to JSON
    - JSON to Object
    - Custom serializers/deserializers

### 14.4 Tratamento de Erros HTTP

- Status code handling
- Retry mechanisms
- Circuit breaker pattern (conceitual)
- Timeout strategies

### 14.5 Autenticação e Segurança

- **Authentication Schemes:**
    - Basic authentication
    - Bearer tokens (JWT)
    - API keys
- **HTTPS Configuration:**
    - SSL/TLS configuration
    - Certificate handling
    - Hostname verification

### 14.6 REST Client Patterns

- **Design Patterns:**
    - Builder pattern para requests
    - Factory pattern para clients
    - Decorator pattern para middleware
- **Best Practices:**
    - Resource cleanup
    - Connection reuse
    - Error handling strategies
    - Logging e monitoring

### 14.7 WebSocket (Conceitual)

- Introdução ao protocolo WebSocket
- Diferenças com HTTP tradicional
- Casos de uso para real-time communication

---

## Observações Sobre a Progressão de Aprendizado

### Dependências Entre Tópicos:

- **Fundamentos** são pré-requisito para todos os demais tópicos
- **Orientação a Objetos** deve ser dominada antes de **Streams**, **Reflection** e **Annotations**
- **Concorrência** beneficia do conhecimento de **Streams** e **Interfaces Funcionais**
- **Módulos** requer compreensão sólida de **packages** e **encapsulamento**
- **Banco de Dados** e **HTTP** são tópicos mais independentes, mas se beneficiam de **Exceções**, **I/O** e **Assincronismo**

### Sugestão de Ordem de Estudo:

1. Introdução → Fundamentos → Exceções e I/O
2. Orientação a Objetos (base sólida necessária)
3. Streams (programação funcional)
4. Concorrência e Paralelismo
5. Annotations → Reflection
6. Módulos (para organização avançada)
7. Ferramentas de Build
8. Banco de Dados → Assincronismo → HTTP (aplicações práticas)