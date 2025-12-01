# Configuração do hibernate

**Título da Explicação:** Configuração do Hibernate com Spring Boot

---

## Introdução

Hibernate é uma implementação de JPA (Java Persistence API) amplamente utilizada para mapeamento objeto-relacional em aplicações Java. Quando combinado com Spring Boot, permite configurar e iniciar rapidamente o acesso a bancos de dados relacionais sem a necessidade de configurações manuais extensas. Este guia apresenta desde uma visão geral até detalhes práticos de sintaxe, anotações-chave e melhores práticas para integrar Hibernate em projetos Spring Boot com Java.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Configuração em *application.properties*
    2. Configuração em *application.yml*
    3. Variações e alternativas
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    1. Anotações Hibernate/JPA
    2. Classes, Interfaces e Métodos Importantes
    3. Atributos de Configuração Cruciais
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
    1. Projeto Gradle/Maven Básico
    2. Entidade de Domínio
    3. Repositório (DAO)
    4. Serviço e Camada de Negócio
    5. Classe Principal (*Main Application*)
    6. *application.properties*
    7. Teste de Inserção/Consulta
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

- **JPA (Java Persistence API):** especificação que define uma API para mapeamento objeto-relacional em Java. Hibernate é uma das implementações mais populares de JPA.
- **Hibernate:** *ORM* (Object-Relational Mapping) que implementa JPA e estende funcionalidades (por exemplo, *Criteria API*, *HQL*, *Cache*, etc.).
- **Spring Data JPA:** projeto Spring que abstrai operações comuns de persistência, definindo *repositories* baseados em interfaces. Internamente, utiliza JPA (e, por consequência, Hibernate se esta for a implementação escolhida).
- **Spring Boot:** fornece auto-configuração para JPA/Hibernate, criando automaticamente o *EntityManagerFactory*, o *DataSource* e demais beans necessários, desde que sejam incluídas as dependências corretas no *classpath*.
- **DataSource:** fonte de conexão com o banco de dados. Em Spring Boot, pode ser configurada via propriedades, e ele configura automaticamente o *DataSource* (por exemplo, *HikariCP*).
- **EntityManager / SessionFactory:** JPA provê o `EntityManager`; Hibernate provê o `SessionFactory`. Com Spring Boot, você normalmente interage via `EntityManager` ou, mais alto nível, via *Spring Data JPA Repositories*.
- **Transações (Transactions):** gerenciadas pelo Spring, com a anotação `@Transactional`. O Spring Boot configura automaticamente o `PlatformTransactionManager` adequado (como `JpaTransactionManager`) quando encontra JPA no classpath.

---

## Sintaxe Detalhada e Uso Prático

### 1. Configuração em *application.properties*

```
# ==============================================
# 1. Configuração de Conexão com o Banco
# ==============================================

# URL do banco de dados (Exemplo: PostgreSQL)
spring.datasource.url=jdbc:postgresql://localhost:5432/meu_banco
spring.datasource.username=usuario_db
spring.datasource.password=senha_db

# Driver JDBC correspondente (opcional, pois Spring Boot detecta pelo URL)
spring.datasource.driver-class-name=org.postgresql.Driver

# ==============================================
# 2. Configurações Hibernate/JPA
# ==============================================

# Dialeto do Hibernate: mapeia tipos Java para SQL específicos do banco
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Ação de geração de esquema: update, create, create-drop, validate, none
spring.jpa.hibernate.ddl-auto=update
# - 'update': Atualiza o esquema sem apagar dados.
# - 'create': Apaga e recria o esquema a cada inicialização.
# - 'validate': Verifica se o esquema está sincronizado com as entidades.
# - 'none': Desativa geração automática de esquema.

# Mostrar SQL no console para fins de debug
spring.jpa.show-sql=true

# Formatar o SQL exibido (para melhor leitura)
spring.jpa.properties.hibernate.format_sql=true

# Definir fuso horário para operações de data/hora (se necessário)
spring.jpa.properties.hibernate.jdbc.time_zone=UTC

# Segunda camada de cache Hibernate (opcional)
spring.jpa.properties.hibernate.cache.use_second_level_cache=true
spring.jpa.properties.hibernate.cache.region.factory_class=org.hibernate.cache.jcache.JCacheRegionFactory
spring.cache.jcache.provider=org.ehcache.jsr107.EhcacheCachingProvider

# ==============================================
# 3. Pacote de Entidades (Escaneamento)
# ==============================================

# Se as entidades estiverem em pacotes diferentes do padrão (aplicação.raiz.entidades),
# especifique para o Spring Data JPA escanear esses pacotes:
spring.jpa.packages-to-scan=br.com.meuprojeto.entidades,br.com.meuprojeto.outropaquete

# ==============================================
# 4. Outras Propriedades (Pool de Conexões, Timeout, etc.)
# ==============================================

# Exemplo com HikariCP (o pool padrão do Spring Boot):
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000   # 5 minutos
spring.datasource.hikari.connection-timeout=20000  # 20 segundos
spring.datasource.hikari.max-lifetime=1800000   # 30 minutos

# ==============================================
# 5. Logging (Opcional)
# ==============================================

# Ajustar nível de log para pacotes JPA/Hibernate:
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

```

> Observação:
> 
> - Caso utilize outro banco (MySQL, Oracle, SQL Server, etc.), altere `spring.datasource.url`, `driver-class-name` e `hibernate.dialect` para o correspondente.
> - A propriedade `spring.jpa.hibernate.ddl-auto=update` é prática em desenvolvimento, mas cuidado em produção (pode perder dados). Em ambiente produtivo, normalmente usa-se `validate` ou `none`, gerenciando esquemas via ferramentas de *migrations* (Flyway, Liquibase).

---

### 2. Configuração em *application.yml*

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/meu_banco
    username: usuario_db
    password: senha_db
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      idle-timeout: 300000
      connection-timeout: 20000
      max-lifetime: 1800000

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
        jdbc:
          time_zone: UTC
        cache:
          use_second_level_cache: true
          region:
            factory_class: org.hibernate.cache.jcache.JCacheRegionFactory
    packages-to-scan:
      - br.com.meuprojeto.entidades
      - br.com.meuprojeto.outropaquete

  cache:
    jcache:
      provider: org.ehcache.jsr107.EhcacheCachingProvider

logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE

```

> Variação de Sintaxe:
> 
> - Em *application.yml*, a indentação é fundamental.
> - No *application.properties*, cada chave deve estar em uma linha separada.
> - Spring Boot, a partir da dependência `spring-boot-starter-data-jpa`, já traz Hibernate por padrão. Basta colocar as configurações acima para personalizar.

---

### 3. Variações e Alternativas

- **Uso de *DataSource* Externo:**
    
    Se sua aplicação compartilhar o *DataSource* com outras camadas ou microserviços, você pode criar um bean `DataSource` manualmente (por exemplo, via `@Configuration`) e desativar o auto-config do Spring Boot:
    
    ```java
    @Configuration
    @EnableJpaRepositories(basePackages = "br.com.meuprojeto.repositorio")
    public class DataSourceConfig {
        @Bean
        @ConfigurationProperties(prefix="spring.custom.datasource")
        public DataSource dataSource() {
            return DataSourceBuilder.create().type(HikariDataSource.class).build();
        }
    
        @Bean
        public LocalContainerEntityManagerFactoryBean entityManagerFactory(EntityManagerFactoryBuilder builder) {
            return builder
                .dataSource(dataSource())
                .packages("br.com.meuprojeto.entidades")
                .persistenceUnit("meuPU")
                .build();
        }
    
        @Bean
        public PlatformTransactionManager transactionManager(EntityManagerFactory emf) {
            return new JpaTransactionManager(emf);
        }
    }
    
    ```
    
    Nesse cenário, configuramos manualmente o `EntityManagerFactory` e o `TransactionManager`, mas perde-se parte da conveniência de auto-configuração.
    
- **Alternativa a `spring.jpa.hibernate.ddl-auto`:**
    
    Em projetos maduros, prefira gerenciar esquema com *Flyway* ou *Liquibase* em vez de permitir que o Hibernate gere/atualize tabelas automaticamente. Exemplo de uso com Flyway:
    
    ```
    spring.flyway.enabled=true
    spring.flyway.locations=classpath:db/migration
    spring.jpa.hibernate.ddl-auto=validate
    
    ```
    
    Assim, o Hibernate apenas valida se o esquema está sincronizado, e as *migrations* executam as alterações.
    
- **Database Platform Diferente:**
    
    Em vez de `spring.jpa.properties.hibernate.dialect`, pode-se usar `spring.jpa.database=MYSQL` (enum), e o Spring Boot tenta inferir o dialecto.
    

---

## Cenários de Restrição ou Não Aplicação

1. **Bancos Não-Relacionais (NoSQL):**
    - Se a sua aplicação utiliza MongoDB, Cassandra ou Redis, o Hibernate não é aplicável. Nesse caso, use Spring Data MongoDB, Spring Data Cassandra etc.
2. **Microserviços Extremamente Leves / Serveless Functions:**
    - Em arquiteturas *Serverless* (AWS Lambda, Azure Functions, etc.), abrir conexão com banco e manter um *EntityManagerFactory* pode não ser ideal. Você pode preferir JDBC puro ou frameworks mais leves como jOOQ.
3. **Alta Performance sem Overhead de ORM:**
    - Quando o foco é performance extrema em operações massivas de leitura/gravação, às vezes é mais eficiente usar acesso JDBC direto ou *Batch Processing* com *JDBC Template*. Hibernate agrega uma camada de abstração que, apesar de produtiva, introduz overhead de gerenciamento de entidades e *cache*.
4. **Projetos com Esquema Mutável com Muitas Alterações:**
    - Se o esquema do banco muda frequentemente em produção e sem planejamento, confiar em `ddl-auto=update` pode causar comportamentos indesejados. Melhor usar *migrations* ou outro mecanismo de versionamento de esquema.
5. **Ambientes com Restrições de Segurança Rigorosas:**
    - Em ambientes regulamentados (financeiro, saúde), pode haver regras que proibam a geração dinâmica de DDL ou uso de determinados recursos de ORM. Nesse caso, é necessário configurar Hibernate estritamente em modo `validate`, ou nem utilizá-lo.

---

## Componentes Chave Associados

### 1. Anotações Hibernate/JPA

- **@Entity**
    
    Marca a classe como entidade persistente. Deve ter um construtor padrão (público ou protegido).
    
- **@Table(name = "nome_tabela", schema = "nome_schema")**
    
    Especifica a tabela do banco correspondente; se omitida, o Hibernate usa o nome da classe como tabela (pode aplicar *naming strategy* automaticamente).
    
- **@Id**
    
    Marca o atributo que representa a chave primária.
    
- **@GeneratedValue(strategy = GenerationType.XXX)**
    
    Define a estratégia de geração de chave primária.
    
    - `AUTO`: O provedor escolhe a estratégia (Sequence, Identity, Table).
    - `IDENTITY`: Usa auto-incremento do banco.
    - `SEQUENCE`: Usa sequência (banco que suporta sequence, como PostgreSQL).
    - `TABLE`: Usa tabela própria para controle de sequência (geralmente menos performático).
- **@Column(name = "coluna", nullable = true/false, length = X, unique = true/false, etc.)**
    
    Mapeia um atributo a uma coluna específica. Se omitido, infere-se nome e tipo.
    
- **@OneToOne / @OneToMany / @ManyToOne / @ManyToMany**
    
    Define relacionamentos entre entidades.
    
    - `mappedBy`, `cascade`, `fetch`, `orphanRemoval`, etc. são atributos comuns para controlar comportamento de cascata e carregamento (lazy/eager).
- **@JoinColumn(name = "coluna_fk", referencedColumnName = "id")**
    
    Mapeia a coluna de chave estrangeira em relacionamentos. Usado em combinações com `@OneToOne`, `@ManyToOne`.
    
- **@SequenceGenerator(name = "seq_gen", sequenceName = "nome_seq", allocationSize = X)**
    
    Define gerador de sequência para `@GeneratedValue`.
    
- **@Embeddable / @Embedded**
    
    Para componentes embutidos (valores complexos sem entidade própria).
    
- **@MappedSuperclass**
    
    Classe pai cujos atributos são herdados por entidades filhas (sem existir tabela própria).
    
- **@DynamicInsert / @DynamicUpdate** (Hibernate nativo)
    
    Indicam que o Hibernate gere SQL de insert/update dinamicamente, incluindo apenas colunas alteradas ou não-nulas.
    
- **@Cacheable / @Cache** (Hibernate nativo)
    
    Ativam cache de segundo nível para entidades ou coleções.
    
- **@NamedQuery / @NamedQueries**
    
    Definem consultas HQL/JPQL nomeadas para reutilização.
    

---

### 2. Classes, Interfaces e Métodos Importantes

- **EntityManager** (JPA)
    - Principal interface de persistência JPA, usada para operações CRUD:
        
        ```java
        EntityManager em = entityManagerFactory.createEntityManager();
        em.getTransaction().begin();
        em.persist(entidade);
        em.getTransaction().commit();
        em.close();
        
        ```
        
    - Em Spring Boot + Spring Data JPA, raramente é usado diretamente; o Spring injeta `EntityManager` nos `Repositories` ou classes marcadas com `@PersistenceContext`.
- **EntityManagerFactory / SessionFactory**
    - Fábrica de `EntityManager` (JPA) ou `Session` (Hibernate).
    - Em Spring Boot, esse bean é criado automaticamente, mas pode ser customizado via *LocalContainerEntityManagerFactoryBean*.
- **LocalContainerEntityManagerFactoryBean**
    - Bean de configuração que cria o `EntityManagerFactory` com base em propriedades. Tipicamente configurado automaticamente pelo Spring Boot.
- **PlatformTransactionManager / JpaTransactionManager**
    - Gerencia transações JPA.
    - O Spring Boot configura `JpaTransactionManager` automaticamente quando detecta JPA no classpath.
- **JpaRepository<T, ID> / CrudRepository<T, ID>**
    - Interfaces do Spring Data que fornecem métodos prontos (`save`, `findById`, `findAll`, `delete`, etc.).
    - Ao estender `JpaRepository`, a aplicação já tem suporte a paginação, ordenação e mais recursos JPA.
- **EntityTransaction**
    - Interface padrão JPA para controle de transações quando não se usa o Spring. Com Spring, geralmente se usa `@Transactional`.

---

### 3. Atributos de Configuração Cruciais

- **spring.jpa.hibernate.ddl-auto**
    
    Determina a política de geração/validação do esquema.
    
- **spring.jpa.properties.hibernate.dialect**
    
    Dialeto SQL específico do banco (define tipos, funções, sintaxe).
    
- **spring.jpa.show-sql** & **spring.jpa.properties.hibernate.format_sql**
    
    Exibem o SQL gerado pelo Hibernate para ajudar no debug.
    
- **spring.jpa.packages-to-scan**
    
    Informa onde procurar classes anotadas com `@Entity` caso não estejam no pacote base da aplicação.
    
- **spring.datasource.hikari.***
    
    Parâmetros de pool de conexões (HikariCP) para controle de performance e estabilidade.
    
- **logging.level.org.hibernate.***
    
    Ajusta o nível de log para depurar SQL e parâmetros.
    

---

## Melhores Práticas e Padrões de Uso

1. **Evitar `DDL-Auto=Create` em Produção**
    - Em ambiente produtivo, prefira `validate` ou `none`, gerenciando alterações de esquema via *migrations* (Flyway, Liquibase).
2. **Usar Spring Data JPA para Repositórios**
    - Defina interfaces que estendam `JpaRepository` ou `CrudRepository`, evitando criar `DAO` manualmente. Exemplo:
        
        ```java
        public interface ClienteRepository extends JpaRepository<Cliente, Long> {
            List<Cliente> findByNomeContainingIgnoreCase(String nome);
        }
        
        ```
        
3. **Definir Estratégia de Fetch Adequada**
    - Evite *EAGER* padrão em coleções (`@OneToMany(fetch = FetchType.LAZY)`) para prevenir *N+1 selects*. Utilize *fetch joins* em consultas quando precisar.
4. **Transações Claras e Delimitadas**
    - Anote serviços ou métodos de serviço com `@Transactional`.
    - Preferir o retorno de `void` ou entidade simples em métodos transacionais; com vistas a evitar laziness exceptions fora da transação.
5. **Cache de Segundo Nível com Cautela**
    - Ativar cache de segundo nível (`@Cacheable`) pode melhorar performance em leitura, mas requer cuidado com invalidações e consistência.
6. **Naming Strategy Customizada (Opcional)**
    - Padrões de nomenclatura de colunas/tabelas podem ser modulares via:
        
        ```
        spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
        spring.jpa.hibernate.naming.implicit-strategy=org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy
        
        ```
        
    - Assim, evita-se ter que usar `@Table(name = "...")` e `@Column(name = "...")` em cada atributo.
7. **Monitorar Pool de Conexões**
    - Ajuste tamanhos de pool de acordo com carga.
    - Use ferramentas como *Actuator* para monitorar conexões abertas, tempo de espera, etc.
8. **Tratamento de Exceções de Persistência**
    - Capturar e tratar exceções como `DataIntegrityViolationException`, `OptimisticLockException`, `LazyInitializationException`.
    - Para entender falhas de transação, habilite logs do Hibernate:
        
        ```
        logging.level.org.hibernate.engine.jdbc.spi.SqlExceptionHelper=ERROR
        logging.level.org.hibernate.transaction.internal.TransactionImpl=DEBUG
        
        ```
        
9. **Batch Processing para Operações em Massa**
    - Para inserir/atualizar grandes quantidades de dados, use `@Modifying` em consultas JPQL ou configure propriedades:
        
        ```
        spring.jpa.properties.hibernate.jdbc.batch_size=50
        spring.jpa.properties.hibernate.order_inserts=true
        spring.jpa.properties.hibernate.order_updates=true
        spring.jpa.properties.hibernate.generate_statistics=true
        
        ```
        
    - E em entidades, defina `@BatchSize(size = 50)` para coleções.
10. **Separação de Camadas (Domain, Repository, Service)**
    - Mantenha a entidade (`@Entity`) livre de lógica de negócio. Use classes de serviço (`@Service`) para regras de negócio e repositórios para acesso a dados.

---

## Exemplo Prático Completo

### 1. Projeto Gradle/Maven Básico

```xml
<!-- pom.xml (Maven) -->
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>br.com.meuprojeto</groupId>
  <artifactId>hibernate-springboot-exemplo</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <packaging>jar</packaging>

  <properties>
    <java.version>17</java.version>
    <spring.boot.version>3.1.0</spring.boot.version>
  </properties>

  <dependencies>
    <!-- Spring Boot Starter Data JPA (inclui Hibernate) -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
      <version>${spring.boot.version}</version>
    </dependency>

    <!-- Driver JDBC PostgreSQL -->
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <version>42.6.0</version>
    </dependency>

    <!-- Spring Boot Starter Web (para endpoints REST) -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
      <version>${spring.boot.version}</version>
    </dependency>

    <!-- Lombok (opcional, para reduzir boilerplate) -->
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <version>1.18.26</version>
      <scope>provided</scope>
    </dependency>

    <!-- Testes (JUnit 5) -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <version>${spring.boot.version}</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <!-- Plugin Spring Boot para empacotar o jar -->
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <version>${spring.boot.version}</version>
      </plugin>
    </plugins>
  </build>
</project>

```

### 2. Entidade de Domínio

```java
package br.com.meuprojeto.entidades;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entidade Cliente que será mapeada para a tabela 'clientes'
 */
@Entity
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

    public Cliente() {
        // Construtor default necessário para JPA
    }

    @PrePersist
    protected void prePersist() {
        this.dataCadastro = LocalDateTime.now();
    }

    // Getters e Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getDataCadastro() { return dataCadastro; }
    // dataCadastro não possui setter, pois é gerado automaticamente
}

```

> Comentários:
> 
> - `@Entity`: marca a classe como persistível.
> - `@Table(name = "clientes")`: define explicitamente o nome da tabela.
> - `@GeneratedValue(strategy = GenerationType.IDENTITY)`: assume auto-incremento no banco (PostgreSQL com `SERIAL` ou `BIGSERIAL`).
> - `@Column(...)`: configurações de cada coluna (nome, restrições, tamanho, unicidade).
> - `@PrePersist`: método JPA para configurar a data de cadastro automaticamente.

---

### 3. Repositório (DAO)

```java
package br.com.meuprojeto.repositorio;

import br.com.meuprojeto.entidades.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Interface de repositório para entidade Cliente.
 * Extende JpaRepository para CRUD e paginação/ordenção.
 */
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    /**
     * Exemplo de método derivado de consulta:
     * Busca clientes cujo nome contenha parte informada (ignorando maiúsculas/minúsculas).
     */
    List<Cliente> findByNomeContainingIgnoreCase(String nomeParcial);

    /**
     * Exemplo de JPQL personalizado:
     */
    @Query("SELECT c FROM Cliente c WHERE c.email = :email")
    Cliente buscarPorEmail(@Param("email") String email);
}

```

> Comentários:
> 
> - `JpaRepository<Cliente, Long>` fornece vários métodos prontos (`save`, `findAll`, `findById`, `deleteById`).
> - Definição de métodos “derivados” (com palavras-chave JPA) permite consultas sem escrever JPQL.
> - `@Query`: uso de JPQL customizado quando a consulta derivada não atende.

---

### 4. Serviço e Camada de Negócio

```java
package br.com.meuprojeto.servico;

import br.com.meuprojeto.entidades.Cliente;
import br.com.meuprojeto.repositorio.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Serviço de Cliente que engloba regras de negócio.
 */
@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    /**
     * Insere um novo cliente no banco de dados.
     * Aqui aplicamos uma regra simples: e-mail deve ser único (apenas um cliente por e-mail).
     */
    @Transactional
    public Cliente criarCliente(Cliente cliente) {
        // Verificar se já existe cliente com mesmo e-mail
        Optional<Cliente> existente = Optional.ofNullable(clienteRepository.buscarPorEmail(cliente.getEmail()));
        if (existente.isPresent()) {
            throw new IllegalArgumentException("Já existe cliente com o e-mail informado.");
        }
        return clienteRepository.save(cliente);
    }

    /**
     * Retorna todos os clientes cadastrados.
     * Transação somente leitura.
     */
    @Transactional(readOnly = true)
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    /**
     * Busca cliente pelo ID.
     */
    @Transactional(readOnly = true)
    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado com id: " + id));
    }

    /**
     * Atualiza informações de um cliente existente.
     */
    @Transactional
    public Cliente atualizarCliente(Long id, Cliente dadosAtualizados) {
        Cliente cliente = buscarPorId(id);
        cliente.setNome(dadosAtualizados.getNome());
        cliente.setEmail(dadosAtualizados.getEmail());
        return clienteRepository.save(cliente);
    }

    /**
     * Remove um cliente pelo ID.
     */
    @Transactional
    public void deletarCliente(Long id) {
        clienteRepository.deleteById(id);
    }
}

```

> Observações:
> 
> - `@Transactional`: garante que operações sejam executadas dentro de transação.
> - `readOnly = true` otimiza performance em consultas (Hibernate não monitora alterações em entidades).
> - Exemplo de validação antes de persistir (e-mail único).

---

### 5. Classe Principal (*Main Application*)

```java
package br.com.meuprojeto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Classe principal da aplicação Spring Boot.
 * O Spring Boot auto-configura o Hibernate/JPA através da dependência
 * spring-boot-starter-data-jpa e das propriedades definidas.
 */
@SpringBootApplication
public class HibernateSpringbootExemploApplication {

    public static void main(String[] args) {
        SpringApplication.run(HibernateSpringbootExemploApplication.class, args);
    }
}

```

> Explicação:
> 
> - `@SpringBootApplication` engloba `@Configuration`, `@EnableAutoConfiguration` e `@ComponentScan`.
> - Ao iniciar, o Spring Boot localiza o *DataSource*, configura o `EntityManagerFactory`, cria os repositórios e prepara o *TransactionManager*.

---

### 6. *application.properties* (exemplo completo)

```
# ----------------------------------------------
# Conexão com o banco de dados (PostgreSQL)
# ----------------------------------------------
spring.datasource.url=jdbc:postgresql://localhost:5432/meu_banco
spring.datasource.username=usuario_db
spring.datasource.password=senha_db
spring.datasource.driver-class-name=org.postgresql.Driver

# ----------------------------------------------
# Propriedades JPA / Hibernate
# ----------------------------------------------
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.packages-to-scan=br.com.meuprojeto.entidades

# ----------------------------------------------
# Pool de Conexões HikariCP
# ----------------------------------------------
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.max-lifetime=1800000

# ----------------------------------------------
# Cache de Segundo Nível (opcional)
# ----------------------------------------------
spring.jpa.properties.hibernate.cache.use_second_level_cache=true
spring.jpa.properties.hibernate.cache.region.factory_class=org.hibernate.cache.jcache.JCacheRegionFactory
spring.cache.jcache.provider=org.ehcache.jsr107.EhcacheCachingProvider

# ----------------------------------------------
# Logging Hibernate
# ----------------------------------------------
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

```

---

### 7. Teste de Inserção/Consulta

Para verificar se tudo está funcionando, podemos criar um *CommandLineRunner* que insere e lista clientes no início da aplicação:

```java
package br.com.meuprojeto;

import br.com.meuprojeto.entidades.Cliente;
import br.com.meuprojeto.servico.ClienteService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Classe de configuração para executar ações ao iniciar a aplicação.
 */
@Configuration
public class StartupConfig {

    @Bean
    public CommandLineRunner initDatabase(ClienteService clienteService) {
        return args -> {
            System.out.println("Inserindo clientes de exemplo...");
            clienteService.criarCliente(new Cliente(null, "João da Silva", "joao.silva@example.com", null));
            clienteService.criarCliente(new Cliente(null, "Maria Oliveira", "maria.oliveira@example.com", null));

            System.out.println("Listando todos os clientes cadastrados:");
            clienteService.listarTodos().forEach(c ->
                System.out.println("ID: " + c.getId() + " | Nome: " + c.getNome() + " | Email: " + c.getEmail())
            );
        };
    }
}

```

> Explicação:
> 
> - `CommandLineRunner`: executa código assim que o *Spring Context* inicia.
> - Chama o serviço para inserir clientes e, em seguida, lista todos no console.
> - Se a configuração estiver correta, o console exibirá as instruções SQL do Hibernate e os dados inseridos/listados.

---

## Sugestões para Aprofundamento

1. **Documentação Oficial do Spring Data JPA**
    - [https://docs.spring.io/spring-data/jpa/docs/current/reference/html/](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
        
        Explica em detalhes recursos avançados de *repositories*, consultas derivadas, paginação e ordenação.
        
2. **Guia Rápido do Hibernate**
    - [https://hibernate.org/orm/documentation/](https://hibernate.org/orm/documentation/)
        
        Documentação oficial do Hibernate, incluindo *Cache*, *Criteria API*, *HQL*, etc.
        
3. **Spring Boot Reference**
    - [https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
        
        Capítulo sobre *Data* e *JPA*, explicando auto-configurações e propriedades disponíveis.
        
4. **Flyway ou Liquibase para Migrations**
    - Flyway: [https://flywaydb.org/](https://flywaydb.org/)
    - Liquibase: [https://www.liquibase.org/](https://www.liquibase.org/)
        
        Aprenda a gerenciar versão do esquema de banco de dados de forma controlada e previsível.
        
5. **Livro “Java Persistence with Hibernate” (Gavin King, Christian Bauer, Gary Gregory)**
    - Aborda Hibernate em profundidade, incluindo conceitos avançados de *fetching*, *caching*, *batching* e transações.
6. **Análise de Performance**
    - Ferramentas como VisualVM, JProfiler ou *Hibernate Statistics* (`entityManagerFactory.unwrap(SessionFactory.class).getStatistics()`) podem ajudar a identificar consultas lentas, eventos de *lazy loading* e problemas de *N+1 selects*.

---

> Resumo Final:
> 
> 
> Neste guia, apresentamos desde a visão geral e conceitos fundamentais da configuração do Hibernate em projetos Spring Boot até detalhes de sintaxe (*application.properties* e *application.yml*), anotações-chave, componentes importantes, melhores práticas e um exemplo prático completo. Com isso, você estará apto a configurar e utilizar Hibernate em sua aplicação Spring Boot de forma eficaz, segura e de fácil manutenção.
>