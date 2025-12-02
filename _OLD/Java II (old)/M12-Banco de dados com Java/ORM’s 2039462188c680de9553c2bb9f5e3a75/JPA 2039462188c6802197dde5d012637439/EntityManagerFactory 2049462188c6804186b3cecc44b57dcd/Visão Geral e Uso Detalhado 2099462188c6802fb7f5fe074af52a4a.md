# Visão Geral e Uso Detalhado

---

## Introdução

O **EntityManagerFactory** (EMF) é um dos componentes centrais do JPA (Java Persistence API). Ele funciona como uma fábrica de `EntityManager` e representa um recurso “pesado” — ou seja, é custoso em termos de inicialização e consumo de recursos (conexões de banco, caches, metadados, etc.). Por isso, a **boa prática** é instanciá-lo **apenas uma vez por aplicação** e reutilizá-lo ao longo de todo o ciclo de vida.

Este guia apresenta:

1. Uma **visão geral concisa** sobre o que é o `EntityManagerFactory` e para que serve;
2. Uma **explicação detalhada e completa**, cobrindo desde conceitos fundamentais até exemplos práticos de configuração, uso e melhores práticas.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#conceitos-fundamentais)
2. [Visão Geral Concisa](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#vis%C3%A3o-geral-concisa)
3. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Configuração no `persistence.xml`
    2. Criando o `EntityManagerFactory`
    3. Obtendo e usando o `EntityManager`
    4. Fechando recursos
4. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
5. [Componentes Chave Associados](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#componentes-chave-associados)
    1. Classe `EntityManagerFactory`
    2. Classe `EntityManager`
    3. Classe utilitária `Persistence`
    4. Arquivo de configuração `persistence.xml`
    5. Unidade de Persistência (persistence-unit)
6. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
7. [Exemplo Prático Completo](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#exemplo-pr%C3%A1tico-completo)
    1. Projeto Simplificado: Estrutura e arquivos necessários
    2. Classe utilitária de fábrica (singleton)
    3. Exemplo de operação CRUD
    4. Encerramento adequado
8. [Sugestões para Aprofundamento](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

- **JPA (Java Persistence API)**: especificação que define uma API de mapeamento objeto-relacional em Java. Ele abstrai a interação com um banco de dados relacional.
- **EntityManagerFactory (EMF)**:
    - É uma fábrica de instâncias de `EntityManager`.
    - Representa, internamente, toda a configuração do provedor JPA (por exemplo, Hibernate, EclipseLink, OpenJPA).
    - Carrega metadados das entidades, conexões de banco, caches de segundo nível (se configurados), dialetos SQL, etc.
    - **Custo de criação alto**: envolve leitura de `persistence.xml`, inicialização de pools de conexão, validação de mapeamentos, construção de caches.
    - **Thread-safe**: pode ser compartilhado entre várias threads.
    - Deve ser criado **uma única vez** (por aplicação ou por módulo, conforme necessidade), e persistir até o encerramento da aplicação.
- **EntityManager (EM)**:
    - Representa a interface de interação com o contexto de persistência.
    - Não é thread-safe; cada thread ou cada unidade de trabalho típica deve obter seu próprio `EntityManager`.
    - É criado a partir do `EntityManagerFactory`:
        
        ```java
        EntityManager em = emf.createEntityManager();
        
        ```
        
    - Gerencia o ciclo de vida de entidades (persistir, atualizar, remover, buscar).
- **Unidade de Persistência (persistence-unit)**:
    - Configuração lógica que agrupa entidades e define propriedades (dialeto, URL do banco, usuário, etc.).
    - Definida no arquivo `META-INF/persistence.xml`.
    - Cada EMF é “instanciado” para uma persistence-unit específica.
- **Performance / Custo**:
    - Criar diversas instâncias de EMF em uma só aplicação causa:
        - Consumo de múltiplos pools de conexão;
        - Sobrecarga de construção de metadados repetida;
        - Possível fragmentação de caches;
        - Impacto negativo no tempo de inicialização.
    - Portanto, **instanciar o EMF uma única vez** e reaproveitar até o fim do ciclo de vida do app.

---

## Visão Geral Concisa

1. **O que é e para que serve**
    - O `EntityManagerFactory` é a fábrica de `EntityManager`, criada a partir de uma **unidade de persistência** definida em `persistence.xml`.
    - Ele armazena e inicializa informações globais (conexão, mapeamentos, caches) e deve ser compartilhado em toda a aplicação.
2. **Quando criar / fechar**
    - **Criação**: Ao iniciar a aplicação (por exemplo, em contexto `ServletContextListener`, `@Singleton EJB` ou classe utilitária singleton).
    - **Fechamento**: Ao finalizar a aplicação (por exemplo, em `@PreDestroy`, `ServletContextListener.destroy()` ou ao desligar a JVM).
3. **Uso básico**
    
    ```java
    // inicializa EMF (apenas 1 vez)
    EntityManagerFactory emf = Persistence.createEntityManagerFactory("meu-persistence-unit");
    
    // para cada operação ou request:
    EntityManager em = emf.createEntityManager();
    try {
        // operações: em.getTransaction().begin(), em.persist(obj), em.getTransaction().commit(), etc.
    } finally {
        em.close(); // liberar recurso
    }
    
    // Ao encerrar a aplicação:
    emf.close();
    
    ```
    
4. **Pontos-chave**
    - **Thread-safe**: compartilhe entre threads;
    - **Alto custo de criação**: instancie apenas uma vez;
    - `EntityManager` **não** é thread-safe: crie um por thread/unidade de trabalho;
    - Feche sempre EM antes de encerrar EMF;
    - Utilize padrão singleton ou injeção de dependência (ex.: CDI) para gerenciar EMF.

---

## Sintaxe Detalhada e Uso Prático

### 1. Configuração no `persistence.xml`

No diretório `src/main/resources/META-INF/persistence.xml`, define-se a **unidade de persistência** e suas propriedades. Exemplo:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="http://xmlns.jcp.org/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="
                http://xmlns.jcp.org/xml/ns/persistence
                http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd"
             version="2.2">

    <!-- Definição da unidade de persistência -->
    <persistence-unit name="meuPU" transaction-type="RESOURCE_LOCAL">
        <!-- Provedor JPA: Hibernate, EclipseLink, etc. -->
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>

        <!-- Lista de classes de entidade; pode usar <jar-file> ou <class> -->
        <class>com.exemplo.modelo.Usuario</class>
        <class>com.exemplo.modelo.Pedido</class>
        <!-- ... -->

        <!-- Configurações específicas do provedor / banco de dados -->
        <properties>
            <!-- Dados de conexão JDBC -->
            <property name="javax.persistence.jdbc.driver" value="org.postgresql.Driver"/>
            <property name="javax.persistence.jdbc.url" value="jdbc:postgresql://localhost:5432/meubanco"/>
            <property name="javax.persistence.jdbc.user" value="usuario"/>
            <property name="javax.persistence.jdbc.password" value="senha"/>

            <!-- Dialeto e estratégia de criação de esquema (Hibernate) -->
            <property name="hibernate.dialect" value="org.hibernate.dialect.PostgreSQL95Dialect"/>
            <property name="hibernate.hbm2ddl.auto" value="validate"/>

            <!-- Caching opcional -->
            <property name="hibernate.cache.use_second_level_cache" value="true"/>
            <property name="hibernate.cache.region.factory_class" value="org.hibernate.cache.jcache.JCacheRegionFactory"/>
            <property name="hibernate.javax.cache.provider" value="org.ehcache.jsr107.EhcacheCachingProvider"/>
            <!-- ... outras propriedades ... -->
        </properties>
    </persistence-unit>
</persistence>

```

**Comentários sobre o arquivo**:

- `<persistence-unit name="meuPU" transaction-type="RESOURCE_LOCAL">`
    - `transaction-type="RESOURCE_LOCAL"` indica que as transações serão gerenciadas manualmente pelo código (`EntityTransaction`).
    - Alternativamente, em um container Java EE/EJB, poderia ser `transaction-type="JTA"`.
- `<provider>` aponta o implementador JPA (no exemplo, Hibernate).
- As `<class>` listam as entidades gerenciadas; também é possível usar scanning automático via `<exclude-unlisted-classes>false</exclude-unlisted-classes>`.
- Em `<properties>`, definem-se: driver, URL, usuário, senha, dialeto, geração de esquema (`hbm2ddl.auto`), e configurações de caching.

---

### 2. Criando o `EntityManagerFactory`

Para criar o EMF, utiliza-se a classe utilitária `Persistence`:

```java
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class JPAUtil {
    private static final EntityManagerFactory emf =
        Persistence.createEntityManagerFactory("meuPU");

    // Impede instânciação externa
    private JPAUtil() { }

    public static EntityManagerFactory getEntityManagerFactory() {
        return emf;
    }

    // Método para fechar o EMF ao finalizar a aplicação
    public static void close() {
        emf.close();
    }
}

```

**Pontos importantes**:

- `Persistence.createEntityManagerFactory("meuPU")`
    - Procura pela unidade de persistência de nome `"meuPU"` em todos os `persistence.xml`.
    - Carrega todas as configurações de uma só vez: pool de conexões, mapeamentos, caches, etc.
- `emf` é estático e `final`: instânciar apenas uma vez (eager initialization).
- Proteger o construtor para evitar instâncias acidentais.

---

### 3. Obtendo e Usando o `EntityManager`

Uma vez com o EMF disponível, para cada operação ou cada requisição de negócio:

```java
import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;

public class UsuarioDAO {
    public void salvar(Usuario usuario) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        EntityTransaction tx = em.getTransaction();

        try {
            tx.begin();              // inicia transação
            em.persist(usuario);     // persiste a entidade
            tx.commit();             // confirma transação
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();       // desfaz caso haja erro
            }
            throw e;                 // propaga exceção
        } finally {
            em.close();              // sempre fechar o EntityManager
        }
    }

    public Usuario buscarPorId(Long id) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            return em.find(Usuario.class, id);  // busca direta sem transação
        } finally {
            em.close();
        }
    }

    public void atualizar(Usuario usuario) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.merge(usuario);       // mescla alterações
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    public void remover(Long id) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Usuario usuario = em.find(Usuario.class, id);
            if (usuario != null) {
                em.remove(usuario);  // remove a entidade gerenciada
            }
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }
}

```

**Anotações sobre uso**:

- **Transações** (`EntityTransaction`) são necessárias para operações de escrita (persist/merge/remove).
- `find(...)` não exige transação, pois é uma consulta “leitura” simples.
- **Exceções**: sempre verificar `tx.isActive()` antes de chamar `rollback()`.
- **Fechamento**: nunca esquecer de `em.close()` no bloco `finally` para liberar conexões.

---

### 4. Fechando Recursos

- **EntityManager**: deve ser fechado após cada uso (unidade de trabalho).
- **EntityManagerFactory**: deve ser fechado apenas quando a aplicação for encerrada.
    - Em um aplicativo standalone: ao final do `main()` ou em um shutdown hook:
        
        ```java
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            JPAUtil.close();
        }));
        
        ```
        
    - Em um ambiente gerenciado (por exemplo, servlet container ou EJB): no método `destroy()` de um `ServletContextListener` ou em um bean com escopo ‘application’ e anotado com `@PreDestroy`.

---

## Cenários de Restrição ou Não Aplicação

1. **Ambientes Java EE / Jakarta EE com Container gerenciando JPA:**
    - Em EJB ou aplicações que usam CDI (Contexts and Dependency Injection), normalmente não se chama `Persistence.createEntityManagerFactory(...)` manualmente. Em vez disso, utiliza-se injeção via `@PersistenceUnit` ou `@PersistenceContext` para obter o EMF ou o EM gerenciado pelo container.
    - Exemplo:
        
        ```java
        @Stateless
        public class UsuarioService {
            @PersistenceContext(unitName = "meuPU")
            private EntityManager em;
            // ...
        }
        
        ```
        
    - Nesse caso, o container se encarrega de criar e gerenciar o EMF e os EMs em pool. Logo, a criação manual do EMF é **inadequada** ou duplicada.
2. **Aplicações que não exigem JPA completo**:
    - Se o projeto for extremamente simples (aplicação de script único ou protótipo rápido), talvez seja preferível usar **JDBC puro** ou **bibliotecas leves** como Spring JDBC ou MyBatis. JPA pode agregar overhead desnecessário.
    - Em microsserviços de altíssimo desempenho, a sobrecarga inicial de JPA, especialmente no tempo de cold-start, pode ser relevante (embora frameworks modernos mitigem isso).
3. **Uso de múltiplas persistence-units no mesmo artefato**:
    - Caso a aplicação exija **várias** unidades de persistência (por exemplo, um microsserviço que se conecta a dois bancos distintos), pode-se criar dois (ou mais) EMFs, um para cada `persistence-unit`. No entanto, cada EMF segue sendo custoso; assim, evite criar EMF sob demanda — prefira instanciá-los uma vez e armazená-los em singletons ou contêineres.
4. **Cenários de teste (unitário/integrado)**:
    - Em testes unitários, às vezes utiliza-se **h2-memory** ou mocks de EntityManager. Pode-se criar um EMF específico para teste, mas recomenda-se usar bibliotecas como Arquillian, Spring Test ou bibliotecas de mocking.

---

## Componentes Chave Associados

### 1. Classe `EntityManagerFactory` (`javax.persistence.EntityManagerFactory`)

- **Responsabilidade**: representar a fábrica de `EntityManager`.
- **Thread-safe**: diversos threads podem chamar `createEntityManager()` simultaneamente.
- **Métodos principais**:
    - `EntityManager createEntityManager()`: cria um novo `EntityManager`.
    - `void close()`: fecha todos os recursos associados (pools, caches, metadados).
    - `boolean isOpen()`: verifica se ainda está aberto ou já foi fechado.
    - `CriteriaBuilder getCriteriaBuilder()`: obtém o builder para `CriteriaQuery`.
    - `Metamodel getMetamodel()`: obtém metamodelo das entidades mapeadas.

### 2. Classe `EntityManager` (`javax.persistence.EntityManager`)

- **Responsabilidade**: gerenciar o contexto de persistência de entidades.
- **Não thread-safe**: não reutilize ou compartilhe instâncias entre threads simultâneos.
- **Principais métodos**:
    - `void persist(Object entity)`: insere nova entidade no contexto.
    - `<T> T merge(T entity)`: mescla estado de entidade “detached” ao contexto e retorna a instância gerenciada.
    - `void remove(Object entity)`: remove entidade gerenciada do contexto e, consequentemente, do banco.
    - `<T> T find(Class<T> entityClass, Object primaryKey)`: busca entidade por chave primária.
    - `void refresh(Object entity)`: atualiza entidade a partir do banco, descartando estado local não sincronizado.
    - `Query createQuery(String qlString)`: cria uma consulta JPQL.
    - `void flush()`: força sincronização do contexto com o banco (mas não faz commit).
    - `EntityTransaction getTransaction()`: obtém gerenciador de transação (quando `transaction-type="RESOURCE_LOCAL"`).

### 3. Classe utilitária `Persistence` (`javax.persistence.Persistence`)

- **Responsabilidade**: ponto de entrada para criação de `EntityManagerFactory` em aplicações standalone.
- **Métodos principais**:
    - `static EntityManagerFactory createEntityManagerFactory(String persistenceUnitName)`: usa configurações no `persistence.xml` para instanciar o EMF.
    - `static EntityManagerFactory createEntityManagerFactory(String persistenceUnitName, Map properties)`: mesma coisa, mas permite sobrescrever ou adicionar propriedades em runtime.

### 4. Arquivo de configuração `persistence.xml`

- **Localização obrigatória**: `META-INF/persistence.xml` no classpath.
- **Tags principais**:
    - `<persistence-unit name="...">`: nome da unidade (identificador usado no createEntityManagerFactory).
    - `<provider>`: nome da implementação JPA (Hibernate, EclipseLink, etc.).
    - `<class>`: lista de entidades mapeadas (classes anotadas com `@Entity`).
    - `<properties>`: configurações de conexão, dialeto, estratégias de geração de esquema, caches.

### 5. Unidade de Persistência (Persistence-Unit)

- **Definição lógica** que agrupa entidades e propriedades.
- **Identificada por um `name`** (por exemplo, `"meuPU"`).
- **Regras de escopo**:
    - Em aplicações Java SE: o EMF é criado com base nessa unidade.
    - Em containers: injeções via `@PersistenceUnit(unitName="...")` ou `@PersistenceContext(unitName="...")` para obter o EMF ou EM, respectivamente.

---

## Melhores Práticas e Padrões de Uso

1. **Criar o EMF apenas uma vez**
    - Instanciar no início da aplicação (ex.: `ServletContextListener.contextInitialized(...)`, `@Singleton EJB @Startup`, ou classe utilitária com inicialização estática).
    - Evitar código que crie EMF toda vez que precisar de um `EntityManager`.
2. **Fechar o EMF no shutdown**
    - Implementar um mecanismo para chamar `emf.close()` quando a aplicação for parada.
    - Em ambientes gerenciados, usar `@PreDestroy` em um bean de escopo “application” ou `ServletContextListener.contextDestroyed(...)`.
3. **Transaction Management**
    - **RESOURCE_LOCAL**: gerenciar transação manualmente via `EntityTransaction`.
    - **JTA** (em Java EE): permitir ao container gerenciar transações automaticamente, usando `@PersistenceContext`.
4. **Gerenciar EntityManager corretamente**
    - Cada thread/unidade de trabalho deve criar e fechar **seu próprio** `EntityManager`.
    - Nunca compartilhar instâncias de EM entre threads simultâneas.
    - Em frameworks como Spring, usar o escopo “Open EntityManager in View” ou “request-scoped” para criar/fechar EM automaticamente.
5. **Pooling de Conexão e Caching**
    - Configurar pool de conexões (por exemplo, HikariCP, C3P0) via `persistence.xml` ou `DataSource` do container.
    - Ajustar cache de segundo nível (L2 cache) com providências adequadas.
    - Evitar `hibernate.hbm2ddl.auto=create-drop` em produção; preferir `validate` ou `none`.
6. **Exceções e Rollback**
    - Ao capturar exceções, verificar `if (tx.isActive()) tx.rollback()`.
    - Evitar suprimir exceções sem tratamento.
7. **Separação de Responsabilidades (DAO / Repository)**
    - Manter lógica de persistência em classes específicas (por exemplo, `UsuarioDAO` ou `UsuarioRepository`).
    - Injetar o EM (ou obtê-lo via utilitário) apenas nessas classes, não na camada de serviço diretamente.
8. **Evitar operações “long running” dentro de transações**
    - Mantê-las curtas, para não bloquear conexões ou guardar entidades por muito tempo no contexto de persistência.
    - Em caso de processamento pesado, carregar apenas dados necessários, usar `DTOs` ou projeções.
9. **Uso de Cache**
    - Configurar segundo nível (`hibernate.cache.use_second_level_cache=true`) apenas quando for realmente útil.
    - Ajustar política de expiração e região de cache de acordo com a criticidade.
10. **Documentação e Manutenção**
    - Comentar no `persistence.xml` quais propriedades são críticas.
    - Versionar o `persistence.xml` junto ao código-fonte.

---

## Exemplo Prático Completo

A seguir, um exemplo passo a passo de um projeto standalone (Java SE) simples, ilustrando a criação de EMF, uso básico de `EntityManager`, mapeamento de entidades e encerramento adequado.

### 1. Projeto Simplificado: Estrutura e Arquivos Necessários

```
meu-projeto-jpa/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/exemplo/
│   │   │       ├── util/
│   │   │       │   └── JPAUtil.java
│   │   │       ├── modelo/
│   │   │       │   └── Usuario.java
│   │   │       └── dao/
│   │   │           └── UsuarioDAO.java
│   │   └── resources/
│   │       └── META-INF/
│   │           └── persistence.xml
│   └── test/  (caso queira testes)
└── pom.xml  (ou build.gradle)

```

### 2. `persistence.xml` (em `src/main/resources/META-INF/`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="http://xmlns.jcp.org/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="
                http://xmlns.jcp.org/xml/ns/persistence
                http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd"
             version="2.2">
    <persistence-unit name="meuPU" transaction-type="RESOURCE_LOCAL">
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>

        <!-- Declaração de entidades -->
        <class>com.exemplo.modelo.Usuario</class>

        <properties>
            <!-- Conexão JDBC -->
            <property name="javax.persistence.jdbc.driver" value="org.h2.Driver"/>
            <property name="javax.persistence.jdbc.url" value="jdbc:h2:mem:meubanco;DB_CLOSE_DELAY=-1"/>
            <property name="javax.persistence.jdbc.user" value="sa"/>
            <property name="javax.persistence.jdbc.password" value=""/>

            <!-- Dialeto Hibernate para H2 -->
            <property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>
            <!-- Cria esquema automaticamente (para teste/demo) -->
            <property name="hibernate.hbm2ddl.auto" value="update"/>

            <!-- Mostrar SQL no console (para debug) -->
            <property name="hibernate.show_sql" value="true"/>
            <property name="hibernate.format_sql" value="true"/>
        </properties>
    </persistence-unit>
</persistence>

```

### 3. Entidade `Usuario`

```java
package com.exemplo.modelo;

import javax.persistence.*;

@Entity
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(unique = true, nullable = false, length = 150)
    private String email;

    // Construtor sem-arg (obrigatório pelo JPA)
    public Usuario() { }

    public Usuario(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
}

```

### 4. Classe utilitária `JPAUtil`

```java
package com.exemplo.util;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class JPAUtil {
    // Cria o EntityManagerFactory ao carregar a classe
    private static final EntityManagerFactory emf =
            Persistence.createEntityManagerFactory("meuPU");

    // Construtor privado para evitar instânciação
    private JPAUtil() { }

    public static EntityManagerFactory getEntityManagerFactory() {
        return emf;
    }

    // Método para fechar o EMF ao encerrar a aplicação
    public static void close() {
        if (emf.isOpen()) {
            emf.close();
        }
    }
}

```

### 5. Classe `UsuarioDAO` (operações CRUD)

```java
package com.exemplo.dao;

import com.exemplo.modelo.Usuario;
import com.exemplo.util.JPAUtil;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import java.util.List;

public class UsuarioDAO {

    public void salvar(Usuario usuario) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.persist(usuario);
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    public Usuario buscarPorId(Long id) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            return em.find(Usuario.class, id);
        } finally {
            em.close();
        }
    }

    public List<Usuario> buscarTodos() {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            return em.createQuery("SELECT u FROM Usuario u", Usuario.class)
                     .getResultList();
        } finally {
            em.close();
        }
    }

    public void atualizar(Usuario usuario) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.merge(usuario);
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    public void remover(Long id) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Usuario usuario = em.find(Usuario.class, id);
            if (usuario != null) {
                em.remove(usuario);
            }
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }
}

```

### 6. Exemplo de uso em um `Main`

```java
package com.exemplo.app;

import com.exemplo.dao.UsuarioDAO;
import com.exemplo.modelo.Usuario;
import com.exemplo.util.JPAUtil;

import java.util.List;

public class App {
    public static void main(String[] args) {
        UsuarioDAO dao = new UsuarioDAO();

        // 1. Criar e persistir um novo usuário
        Usuario u1 = new Usuario("Mariana Silva", "mariana@example.com");
        dao.salvar(u1);
        System.out.println("Usuário salvo com ID: " + u1.getId());

        // 2. Atualizar o usuário
        u1.setNome("Mariana Souza Silva");
        dao.atualizar(u1);
        System.out.println("Usuário atualizado: " + u1.getNome());

        // 3. Buscar por ID
        Usuario encontrado = dao.buscarPorId(u1.getId());
        System.out.println("Usuário encontrado: " + encontrado.getNome() + " - " + encontrado.getEmail());

        // 4. Listar todos
        List<Usuario> todos = dao.buscarTodos();
        System.out.println("Lista de usuários:");
        for (Usuario u : todos) {
            System.out.println("\tID: " + u.getId() + " | Nome: " + u.getNome());
        }

        // 5. Remover usuário
        dao.remover(u1.getId());
        System.out.println("Usuário removido.");

        // 6. Fechar o EntityManagerFactory ao encerrar a aplicação
        JPAUtil.close();
    }
}

```

**Detalhes sobre o exemplo**:

- O **H2** em-memory é utilizado apenas para demonstração.
- Após cada operação, o `EntityManager` é fechado; no fim do `main`, o EMF é fechado com `JPAUtil.close()`.
- Observe o padrão **DAO** (camada de acesso a dados) para isolar a lógica de persistência.

---

## Sugestões para Aprofundamento

- **Documentação oficial JPA (JSR 338)**: leitura direta da especificação para detalhes sobre contratos, transações JTA e RESOURCE_LOCAL.
- **Guia de boas práticas do Hibernate**: aborda estratégias avançadas de configuração de caching, performance e tuning.
- **Livro “Pro JPA 2” (Mike Keith & Merrick Schincariol)**: explicações profundas sobre funcionalidades do JPA 2.x e exemplos detalhados.
- **Explorar CDI e Injeção de Dependência**: em aplicações Java EE/Quarkus/Spring, aprender a injetar `EntityManagerFactory` ( `@PersistenceUnit` ) e `EntityManager` (`@PersistenceContext`).
- **Analisar startup time**: medir tempos de criação do EMF em diferentes provedores (Hibernate, EclipseLink) e otimizar propriedades de inicialização.
- **Investigar migrações de banco**: usar Flyway ou Liquibase combinados com JPA sem precisar usar `hibernate.hbm2ddl.auto=create`.

---

> Conclusão:
> 
> 
> O `EntityManagerFactory` é um dos pilares do JPA. Sua correta utilização — criando-o apenas **uma vez** e gerenciando adequadamente a abertura/fechamento dos `EntityManager` — garante desempenho consistente e evita vazamento de recursos. Compreender os componentes associados, cenários onde não usá-lo diretamente (como em containers gerenciados) e seguir as melhores práticas apresentadas assegura uma aplicação robusta e eficiente no mundo JPA/Java.
>