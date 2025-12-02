# Criação e Gerenciamento de EntityManagers

---

## 1. Introdução

O **EntityManagerFactory** (EMF) é um componente central do Java Persistence API (JPA) responsável por criar e configurar instâncias de **EntityManager** (EM). Enquanto o EM representa a interface principal para interagir com o contexto de persistência (persistir entidades, criar consultas, gerenciar transações etc.), o EMF encapsula toda a configuração de acesso ao banco de dados e às entidades mapeadas.

Em poucas palavras:

- **EntityManagerFactory**: Fábrica para gerar EntityManagers, com base nas configurações definidas (geralmente via `persistence.xml`).
- **EntityManager**: Objeto que realiza as operações de CRUD e consultas, mantendo o contexto de persistência (cache de primeiro nível).

Este tópico é essencial para qualquer aplicação Java que utilize JPA, pois define como iniciar, configurar e encerrar corretamente o acesso ao banco de dados.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#2-conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#3-sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Configuração básica (`persistence.xml`)
    2. Criação do EntityManagerFactory
    3. Obtenção de EntityManager
    4. Ciclo de vida do EntityManager e fechamento
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#4-cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#5-componentes-chave-associados)
    1. `persistence.xml`
    2. Classe `Persistence`
    3. Interface `EntityManager`
    4. `EntityTransaction`
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#6-melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#7-exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#8-sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

- **What is EntityManagerFactory?**
    - Um objeto threadsafe (seguro para acesso concorrente) criado a partir da configuração definida em `persistence.xml`.
    - Serve como “ponto de inicialização” do JPA: carrega configurações do provedor escolhido (Hibernate, EclipseLink, OpenJPA etc.), mapeamentos de entidades e as propriedades de conexão ao banco de dados.
- **Por que usar EMF?**
    1. *Encapsula configurações:* coleta todas as propriedades (URL do banco, dialect, estratégia de geração de esquema, cache de segundo nível, etc.).
    2. *Threadsafety:* pode ser compartilhado entre múltiplas threads/requests em aplicações web ou batch.
    3. *Economia de Recursos:* a inicialização do EMF é custosa (carrega metadados, valida mapeamentos). Então, cria-se apenas uma instância por aplicação (ou por “contexto” específico, como um módulo).
- **EntityManager vs EntityManagerFactory**
    - **EntityManagerFactory**: fábrica de EntityManagers.
    - **EntityManager**: instância “leve”, não-threadsafe, criada a partir do EMF, que abre uma unidade de trabalho (“persistence context”). Cada EM representa um contexto de persistência isolado.

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1. Configuração Básica (`persistence.xml`)

Antes de criar o EMF, é necessário definir um arquivo chamado `persistence.xml`, localizado em `META-INF/persistence.xml`, com as seguintes informações mínimas:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="http://xmlns.jcp.org/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/persistence
                                 http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd"
             version="2.2">

    <!-- Nome do Persistence Unit -->
    <persistence-unit name="MinhaPU" transaction-type="RESOURCE_LOCAL">
        <!-- Provedor JPA (ex.: Hibernate, EclipseLink) -->
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>

        <!-- Classes de entidade mapeadas (caso não use scanning automático) -->
        <class>com.meuprojeto.entidades.Cliente</class>
        <class>com.meuprojeto.entidades.Pedido</class>
        <!-- ...ou use <exclude-unlisted-classes>false</exclude-unlisted-classes> para auto-scanner -->

        <!-- Propriedades de conexão -->
        <properties>
            <!-- Driver JDBC -->
            <property name="javax.persistence.jdbc.driver" value="org.postgresql.Driver"/>
            <!-- URL do banco -->
            <property name="javax.persistence.jdbc.url" value="jdbc:postgresql://localhost:5432/meubanco"/>
            <!-- Usuário -->
            <property name="javax.persistence.jdbc.user" value="usuario"/>
            <!-- Senha -->
            <property name="javax.persistence.jdbc.password" value="senha"/>

            <!-- Dialect do Hibernate (caso use Hibernate) -->
            <property name="hibernate.dialect" value="org.hibernate.dialect.PostgreSQLDialect"/>

            <!-- Gerar esquema automaticamente (opcional) -->
            <property name="hibernate.hbm2ddl.auto" value="update"/>
        </properties>
    </persistence-unit>
</persistence>

```

**Explicações de alguns elementos-chave:**

- `<persistence-unit name="MinhaPU">`: identifica a unidade de persistência. Esse nome será usado ao criar o EMF.
- `<provider>`: define o provedor JPA (por exemplo, Hibernate). Se omitido, o JPA tentará detectar automaticamente.
- `<class>`: lista de classes anotadas com `@Entity`. Se preferir, pode usar `<exclude-unlisted-classes>false</exclude-unlisted-classes>` para escanear classes no classpath.
- `<properties>`: propriedades específicas do provedor/BD (driver, URL, user, password, dialect, estratégias de DDL etc.).

---

### 4.2. Criação do EntityManagerFactory

Para obter o EMF, utiliza-se a classe utilitária `javax.persistence.Persistence`:

```java
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class JPAUtil {

    // Cria e armazena uma única instância de EMF
    private static final EntityManagerFactory emf =
        Persistence.createEntityManagerFactory("MinhaPU");

    // Método para retornar o EntityManagerFactory
    public static EntityManagerFactory getEntityManagerFactory() {
        return emf;
    }

    // Método para fechar o EMF (chamado na finalização da aplicação)
    public static void fecharEntityManagerFactory() {
        if (emf != null && emf.isOpen()) {
            emf.close();
        }
    }
}

```

**Explicação:**

- `Persistence.createEntityManagerFactory("MinhaPU")`: Carrega configurações definidas em `persistence.xml` sob o nome `"MinhaPU"`.
- O EMF é instanciado **uma única vez** (típico em padrão Singleton), pois a inicialização pode ser custosa.

---

### 4.3. Obtenção de EntityManager

A partir do EMF, pode-se criar diversos EntityManagers:

```java
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

public class ExemploUso {

    public static void main(String[] args) {
        // 1. Obter o EMF (gerenciado em JPAUtil)
        EntityManagerFactory emf = JPAUtil.getEntityManagerFactory();

        // 2. Criar um EntityManager (não-threadsafe)
        EntityManager em = emf.createEntityManager();

        try {
            // 3. Iniciar transação
            em.getTransaction().begin();

            // 4. Realizar operações de persistência
            Cliente novoCliente = new Cliente();
            novoCliente.setNome("Maria da Silva");
            novoCliente.setEmail("maria.silva@example.com");
            em.persist(novoCliente);

            // 5. Confirmar transação
            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            e.printStackTrace();
        } finally {
            // 6. Fechar o EntityManager
            em.close();
        }

        // 7. (Opcional) Fechar o EntityManagerFactory ao encerrar a aplicação
        JPAUtil.fecharEntityManagerFactory();
    }
}

```

**Pontos importantes:**

- **`em.createEntityManager()`**: cria uma instância nova de EntityManager sempre que for preciso interagir com o banco.
- **Gerenciamento de transação**: em aplicações SE (RESOURCE_LOCAL), deve chamar `em.getTransaction().begin()` e, ao final, `commit()` ou `rollback()`.
- **Uso em ambiente JEE / contêiner**: tipicamente, o EM é gerenciado pelo contêiner (com `@PersistenceContext`), e a transação por `@Transactional`. Mas a lógica de criação do EMF é similar sob o capô.

---

### 4.4. Ciclo de Vida do EntityManager e Fechamento

- **Cada EntityManager representa um contexto de persistência**: ele mantém um cache de primeiro nível (1st-level cache). Até que seja fechado, qualquer instância de entidade “gerenciada” por esse EM estará sincronizada com a transação.
- **Fechamento**: é obrigatório chamar `em.close()` depois que terminar de usar, para liberar recursos (conexão, caches internos, etc.). Não fechar pode levar a vazamento de conexões.

Fluxo resumido:

1. **Inicialização da aplicação**
    - Chama `Persistence.createEntityManagerFactory("MinhaPU")` uma vez.
2. **Para cada unidade de trabalho (operation scope)**
    1. Chama `EntityManager em = emf.createEntityManager()`.
    2. `em.getTransaction().begin()` (em SE) ou deixado ao contêiner (em EJB/Spring).
    3. Realiza operações `persist()`, `merge()`, `remove()`, `find()`, `createQuery()` etc.
    4. `em.getTransaction().commit()` (ou trata rollback em caso de exceção).
    5. `em.close()`.
3. **Finalização da aplicação**
    - Chama `emf.close()`.

---

## 5. Cenários de Restrição ou Não Aplicação

Embora o **EntityManagerFactory** seja fundamental no JPA, há situações em que seu uso é inapropriado ou dispensável:

1. **Não usar JPA**
    - Se a aplicação não for baseada em JPA (por exemplo, uso direto de JDBC, MyBatis, ou outro ORM), não há EMF.
2. **Microserviços com short-living**
    - Em cenários onde o container é plenamente gerenciado (ex.: Spring Boot com `@SpringBootApplication`), o desenvolvedor raramente chama `createEntityManagerFactory()` manualmente. Em vez disso, configura-se um `EntityManagerFactory` via `LocalContainerEntityManagerFactoryBean`. Ainda assim, o conceito persiste, mas o desenvolvedor não lida diretamente com a criação.
3. **Ambientes serverless / functions**
    - Quando o tempo de vida da aplicação é muito curto (ex.: AWS Lambda invocando uma funçào, que inicia JPA a cada cold start), criar e destruir EMF pode ser custoso e não recomendado em cada invocação. Nesses casos, avalia-se persistir o EMF globalmente em nível de container ou migrar para outra abordagem de acesso a dados.
4. **Aplicações legadas que misturam JPA e JDBC**
    - Se parte da camada de persistência usar JDBC puro e não houver mapeamentos de entidade, não se cria EMF para esses casos.

Em resumo, **não usar o EMF** faz sentido quando não se adota o JPA ou quando o framework/provedor encapsula automaticamente essa criação.

---

## 6. Componentes Chave Associados

### 6.1. `persistence.xml`

- **Localização:** `src/main/resources/META-INF/persistence.xml`
- **Função:** declara uma ou mais *persistence units* (unidades de persistência). Cada unidade tem configurações próprias de conexão, provedor e entidades.

Exemplo mínimo:

```xml
<persistence-unit name="MinhaPU" transaction-type="RESOURCE_LOCAL">
    <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
    <class>com.exemplo.entidade.Produto</class>
    <!-- Propriedades de conexão e Hibernate aqui -->
</persistence-unit>

```

### 6.2. Classe `Persistence`

- **Localização:** `javax.persistence.Persistence` (parte do JPA).
- **Método Principal:**
    
    ```java
    public static EntityManagerFactory createEntityManagerFactory(String persistenceUnitName);
    
    ```
    
    - Carrega `persistence.xml`, valida config e inicializa o provedor.

### 6.3. Interface `EntityManager` (`javax.persistence.EntityManager`)

- **Responsabilidade:**
    - Gerenciar o ciclo de entidades: `persist()`, `merge()`, `remove()`, `find()`.
    - Controller de transação (em JPA SE).
    - Gerenciamento do contexto de persistência (1st-level cache).

Principais métodos:

```java
void persist(Object entity);
< T > T merge(T entity);
< T > T find(Class<T> entityClass, Object primaryKey);
void remove(Object entity);
Query createQuery(String qlString);
EntityTransaction getTransaction();
void close();
boolean isOpen();

```

### 6.4. Classe `EntityTransaction`

- **Papel no JPA SE:** controla transações manuais.
- **Principais métodos:**
    
    ```java
    void begin();
    void commit();
    void rollback();
    boolean isActive();
    
    ```
    

Observação: Em ambientes Java EE ou Spring, normalmente não se chama `getTransaction().begin()`; a transação é gerenciada pelo contêiner ou por anotações (`@Transactional`).

---

## 7. Melhores Práticas e Padrões de Uso

1. **Singleton para EntityManagerFactory**
    - Crie apenas uma instância de EMF por aplicação (por unidade de persistência).
    - Evite recriar EMF a cada requisição, pois a inicialização é lenta (carrega metadados, mapeamentos).
2. **Scoped EntityManager (por request/coerência)**
    - Cada método ou operação “lógica” deve obter seu próprio EntityManager e fechá-lo ao final.
    - Em aplicações web: use um filtro ou componente de lifecycle para abrir e fechar o EM por requisição HTTP.
3. **Fechar sempre EntityManager**
    - Use `try { … } finally { em.close(); }` para garantir fechamento mesmo em caso de exceção.
    - Falhar em fechar EM leva a vazamento de conexões JDBC e recursos do provedor JPA.
4. **Gerenciamento de transação**
    - Em JPA SE: sempre chamando `em.getTransaction().begin()` e `commit()`/`rollback()`.
    - Em Java EE/Spring: utilize anotações como `@Transactional`, não manipule transação manualmente.
5. **Configurações de pooling**
    - O EMF carrega a `DataSource` configurada. Para aplicações de produção, use um pool (HikariCP, C3P0, etc.) para gerenciar conexões.
    - Configure propriedades de pool no `persistence.xml` ou via `DataSource` externa, definindo `javax.persistence.nonJtaDataSource`.
6. **Uso de cache de segundo nível**
    - Muitos provedores (ex.: Hibernate) permitem configurar cache L2 no EMF.
    - Avalie cuidadosamente: benefícios de desempenho vs. consistência de dados (sincronização com mudanças externas).
7. **Tratamento de exceções**
    - Capturar `PersistenceException` e suas subclasses (ex.: `EntityExistsException`, `OptimisticLockException`).
    - Em rollback, sempre checar se a transação está ativa antes de chamar `rollback()`.
8. **Evitar operações pesadas dentro do mesmo EM**
    - Em casos de longos batchs de inserção/atualização, limpe o contexto de persistência periodicamente (`em.flush()`, `em.clear()`) para não sobrecarregar memória.
9. **Separar camadas**
    - Crie uma camada de DAO/Repositório que faça uma única responsabilidade: abrir EM, realizar operação e fechar EM.
    - Facilita testes unitários, manutenção e clareza de código.

---

## 8. Exemplo Prático Completo

**Cenário:**

Desenvolver um pequeno módulo que gerencie clientes (CRUD simples) usando JPA em aplicação Java SE.

### 8.1. Estrutura de Pacotes

```
src/main/java
 ├─ com.exemplo.dao
 │    └─ ClienteDAO.java
 ├─ com.exemplo.entidade
 │    └─ Cliente.java
 ├─ com.exemplo.util
 │    └─ JPAUtil.java
 └─ com.exemplo.app
      └─ MainApp.java

```

### 8.2. Entidade `Cliente.java`

```java
package com.exemplo.entidade;

import javax.persistence.*;

@Entity
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    // Construtor padrão
    public Cliente() { }

    // Construtor com parâmetros
    public Cliente(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }

    // Getters e setters
    public Long getId() {
        return id;
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

### 8.3. Utilitário `JPAUtil.java`

```java
package com.exemplo.util;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class JPAUtil {

    // Cria o EntityManagerFactory ao carregar a classe
    private static final EntityManagerFactory emf =
        Persistence.createEntityManagerFactory("MinhaPU");

    // Retorna a instância do EMF
    public static EntityManagerFactory getEntityManagerFactory() {
        return emf;
    }

    // Fecha o EMF (invocado ao encerrar a aplicação)
    public static void fecharEntityManagerFactory() {
        if (emf.isOpen()) {
            emf.close();
        }
    }
}

```

### 8.4. DAO `ClienteDAO.java`

```java
package com.exemplo.dao;

import com.exemplo.entidade.Cliente;
import com.exemplo.util.JPAUtil;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import java.util.List;

public class ClienteDAO {

    /**
     * Persiste um novo cliente no banco de dados.
     */
    public void inserir(Cliente cliente) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        EntityTransaction tx = em.getTransaction();

        try {
            tx.begin();
            em.persist(cliente);
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

    /**
     * Atualiza um cliente existente.
     */
    public Cliente atualizar(Cliente cliente) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        EntityTransaction tx = em.getTransaction();
        Cliente atualizado;

        try {
            tx.begin();
            atualizado = em.merge(cliente);
            tx.commit();
            return atualizado;
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    /**
     * Remove um cliente por ID.
     */
    public void remover(Long id) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Cliente cliente = em.find(Cliente.class, id);
            if (cliente != null) {
                em.remove(cliente);
            }
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

    /**
     * Busca um cliente pelo ID.
     */
    public Cliente buscarPorId(Long id) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            return em.find(Cliente.class, id);
        } finally {
            em.close();
        }
    }

    /**
     * Lista todos os clientes.
     */
    public List<Cliente> listarTodos() {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            return em.createQuery("SELECT c FROM Cliente c", Cliente.class)
                     .getResultList();
        } finally {
            em.close();
        }
    }
}

```

### 8.5. Aplicação Principal `MainApp.java`

```java
package com.exemplo.app;

import com.exemplo.dao.ClienteDAO;
import com.exemplo.entidade.Cliente;
import com.exemplo.util.JPAUtil;

import java.util.List;

public class MainApp {

    public static void main(String[] args) {
        ClienteDAO dao = new ClienteDAO();

        // 1. Inserir novo cliente
        Cliente c1 = new Cliente("João Pereira", "joao.pereira@example.com");
        dao.inserir(c1);
        System.out.println("Cliente inserido com ID: " + c1.getId());

        // 2. Atualizar o cliente
        c1.setNome("João P. Silva");
        dao.atualizar(c1);
        System.out.println("Cliente atualizado: " + c1.getNome());

        // 3. Listar todos os clientes
        List<Cliente> todos = dao.listarTodos();
        System.out.println("=== Lista de Clientes ===");
        for (Cliente c : todos) {
            System.out.printf("[%d] %s - %s%n", c.getId(), c.getNome(), c.getEmail());
        }

        // 4. Buscar por ID
        Cliente buscado = dao.buscarPorId(c1.getId());
        if (buscado != null) {
            System.out.println("Cliente buscado: " + buscado.getNome());
        }

        // 5. Remover cliente
        dao.remover(c1.getId());
        System.out.println("Cliente removido.");

        // Finalizar EMF
        JPAUtil.fecharEntityManagerFactory();
    }
}

```

**Comentários passo a passo:**

1. **`JPAUtil.getEntityManagerFactory()`** retorna o EMF único (carregado de `persistence.xml`).
2. **`createEntityManager()`** cria um novo EM para cada operação.
3. Cada método no DAO:
    - Abre EM.
    - Inicia transação (`tx.begin()`).
    - Executa operações do JPA (`persist()`, `merge()`, `find()`, `remove()`, `createQuery()`).
    - `tx.commit()` ou, em caso de erro, `tx.rollback()`.
    - Fecha EM no bloco `finally`.
4. Em `MainApp`, demonstra CRUD completo: inserir, atualizar, listar, buscar e remover.
5. Ao final, chama `JPAUtil.fecharEntityManagerFactory()` para liberar o provedor e as conexões subjacentes.

---

## 9. Sugestões para Aprofundamento

- **Documentação Oficial JPA (JSR 338)**: compreender detalhes de configurações, otimizações e estratégias de cache.
- **Provedor específico (Hibernate/EclipseLink)**: estudar configurações avançadas de `hibernate.cfg.xml` ou `persistence.xml`, tuning de performance e integração com segundo nível de cache (Ehcache, Infinispan etc.).
- **Padrões de Repositório e DAO**: analisar como frameworks como Spring Data JPA abstraem EntityManager/EMF e facilitam implementações de repositórios pré-prontos.
- **Transações distribuídas**: conhecer `JTA` (Java Transaction API) vs. `RESOURCE_LOCAL` em ambientes corporativos, e como o EMF interage com transações de múltiplos recursos.
- **Testes unitários/integrados**: utilizar `EntityManagerFactory` em conjunto com bancos em memória (H2, HSQLDB) para testes automatizados.
- **Thread Safety & Pooling**: estudar como configurar `DataSource` e `Connection Pool` para otimizar concorrência e reduzir latência de conexão.
- **Performance e Profiling**: identificar *n+1 selects*, usar `EntityGraph`, `Batch Fetching` e proxies.

---

> Observação Final:
> 
> 
> O **EntityManagerFactory** é o ponto de partida para qualquer aplicação JPA. Entender sua criação, inicialização e ciclo de vida é crucial para garantir escalabilidade, performance e manutenção do acesso a dados. Use-o com cuidado (instancie-o apenas uma vez) e feche-o corretamente ao finalizar sua aplicação. Dentro desse contexto, o **EntityManager** é a peça que realmente executa as operações de persistência, mas depende totalmente do EMF para sua configuração e funcionamento.
>