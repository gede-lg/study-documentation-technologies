# Contexto de persistencia e Transações no JPA

## Introdução

O Java Persistence API (JPA) é a especificação padrão para mapeamento objeto-relacional (ORM) no ecossistema Java. Neste material, focaremos especificamente no **contexto de persistência** e no **gerenciamento de transações** dentro do JPA. Esses conceitos são fundamentais para garantir a integridade e consistência dos dados em aplicações que acessam bancos de dados relacionais.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#conceitos-fundamentais)
    
    1.1. O que é Contexto de Persistência
    
    1.2. O que é Transação
    
    1.3. Importância e Propósito
    
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    
    2.1. Configuração Básica do `persistence.xml`
    
    2.2. `EntityManagerFactory` e `EntityManager`
    
    2.3. Ciclo de Vida do Contexto de Persistência
    
    2.4. Demarcação de Transações com JTA e Resource-Local
    
    2.5. Exemplos Comentados
    
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
    
    3.1. Aplicações Não Tradicionais (e.g., NoSQL puro)
    
    3.2. Uso de ORM em Operações em Lote Extremamente Simples
    
    3.3. Contextos de Alta Performance Sem Transações ACID
    
4. [Componentes-Chave Associados](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#componentes-chave-associados)
    
    4.1. Anotações Relevantes (`@Entity`, `@Id`, `@GeneratedValue`, etc.)
    
    4.2. Classes e Interfaces do JPA
    
    4.3. Mecanismos de Cache (Primeiro e Segundo Nível)
    
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
    
    5.1. Design de Contextos de Persistência (Extended vs. Transactional)
    
    5.2. Padrões de Transação (Atomicidade, Isolamento)
    
    5.3. Padronização de Exceções e Rollbacks
    
    5.4. Uso Adequado de `merge()` vs. `persist()` vs. `remove()`
    
6. [Exemplo Prático Completo](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#exemplo-pr%C3%A1tico-completo)
    
    6.1. Cenário: Cadastro de Usuário com Conta Bancária
    
    6.2. Entidades Envolvidas (`User` e `Account`)
    
    6.3. Configuração e Bootstrapping
    
    6.4. Operação CRUD com Transação
    
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

### 1.1. O que é Contexto de Persistência

- **Definição:**
    
    O contexto de persistência (Persistence Context) é um “cache” de objetos gerenciado pelo JPA. Ele guarda instâncias de entidades que estão sendo monitoradas pela camada de persistência. Enquanto uma entidade permanece nesse contexto, quaisquer alterações em seus atributos são automaticamente detectadas e sincronizadas com o banco de dados no momento apropriado (por exemplo, antes de um commit).
    
- **Propósito:**
    - Garantir o **rastreamento** de estados das entidades (novo, gerenciado, removido, destacardo).
    - Otimizar performance evitando consultas redundantes (caching em primeiro nível).
    - Permitir o uso de operações *dirty checking*, em que o JPA identifica alterações nos campos e gera os comandos SQL necessários sem intervenção manual.
- **Estados de uma Entidade:**
    1. **Transient (Transiente):** objeto novo, sem associação ao contexto de persistência; não está no banco de dados.
    2. **Managed (Gerenciado):** objeto associado a um contexto de persistência ativo; alterações são rastreadas.
    3. **Detached (Destacado):** objeto que já foi removido do contexto ou após o encerramento de uma transação. Mudanças não são mais rastreadas automaticamente.
    4. **Removed (Removido):** objeto marcado para remoção; será excluído do banco na próxima sincronização.

### 1.2. O que é Transação

- **Definição:**
    
    Uma transação representa uma unidade de trabalho que deve ser **atômica**, **consistente**, **isolada** e **durável** (propriedades ACID). Ao agrupar várias operações de leitura/escrita em um único bloco transacional, garantimos que:
    
    1. **Atomicidade:** Todas as operações ocorrem ou nenhuma ocorre (commit ou rollback).
    2. **Consistência:** O banco de dados permanece em um estado válido (respeito a chaves estrangeiras, constraints, etc.).
    3. **Isolamento:** Múltiplas transações simultâneas não interferem indevidamente umas nas outras.
    4. **Durabilidade:** Dados confirmados (committed) persistem mesmo em caso de falhas.
- **Propósito no JPA:**
    - Determinar o momento exato em que as alterações no contexto de persistência são propagadas e confirmadas no banco de dados.
    - Controlar escopo de rollback em caso de exceções.
    - Manter a coerência de dados em sistemas multiusuário.

### 1.3. Importância e Propósito

- Sem um **contexto de persistência**, o desenvolvedor precisaria escrever manualmente código para sincronizar cada alteração no banco (INSERT, UPDATE, DELETE). O JPA abstrai essa complexidade, permitindo que se trabalhe com objetos Java normalmente.
- Sem um mecanismo de **transação**, não há garantia de integridade em operações que envolvem múltiplas tabelas ou múltiplos passos. Um erro no meio deixaria o banco num estado inconsistente.
- A combinação de contexto e transação permite:
    - Otimização de chamadas SQL por meio de *write-behind* (empacotamento de comandos).
    - Gerenciamento de concorrência (via níveis de isolamento).
    - Rollback automático em caso de falhas.

---

## Sintaxe Detalhada e Uso Prático

### 2.1. Configuração Básica do `persistence.xml`

O arquivo `persistence.xml` define as *unidades de persistência* (persistence units) que o JPA irá usar para criar a fábrica de `EntityManager`. Exemplo mínimo:

```xml
<!-- src/main/resources/META-INF/persistence.xml -->
<persistence xmlns="http://java.sun.com/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://java.sun.com/xml/ns/persistence
                                 http://java.sun.com/xml/ns/persistence/persistence_2_1.xsd"
             version="2.1">
    <persistence-unit name="defaultPU" transaction-type="RESOURCE_LOCAL">
        <!-- Provedor: Hibernate como exemplo -->
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>

        <!-- Configurações do DataSource / JDBC -->
        <properties>
            <property name="javax.persistence.jdbc.driver" value="org.postgresql.Driver"/>
            <property name="javax.persistence.jdbc.url" value="jdbc:postgresql://localhost:5432/meuBanco"/>
            <property name="javax.persistence.jdbc.user" value="usuario"/>
            <property name="javax.persistence.jdbc.password" value="senha"/>

            <!-- Dialeto e criação de tabelas -->
            <property name="hibernate.dialect" value="org.hibernate.dialect.PostgreSQLDialect"/>
            <property name="hibernate.hbm2ddl.auto" value="update"/>

            <!-- Mostrar SQL no console -->
            <property name="hibernate.show_sql" value="true"/>
        </properties>
    </persistence-unit>
</persistence>

```

- `name="defaultPU"`: nome da unidade de persistência que será referenciado no código.
- `transaction-type="RESOURCE_LOCAL"`: usa transações locais do JDBC. Em ambiente Java EE, normalmente usa-se `JTA`.
- Provedor JPA: `HibernatePersistenceProvider`, mas pode ser EclipseLink, OpenJPA, etc.

### 2.2. `EntityManagerFactory` e `EntityManager`

- **`EntityManagerFactory`**: Fábrica para criar instâncias de `EntityManager`. Geralmente, deve ser instanciada uma vez para toda a aplicação (singleton).
- **`EntityManager`**: Interface principal para operações de CRUD. Representa o **contexto de persistência** dividindo em:
    - **`getTransaction()`**: para gerenciar transações (em modo RESOURCE_LOCAL).
    - **`persist()`, `merge()`, `remove()`, `find()`**: métodos para operar nas entidades.

**Exemplo de inicialização (standalone Java SE):**

```java
import javax.persistence.*;

public class JPAUtil {
    private static final EntityManagerFactory emf =
        Persistence.createEntityManagerFactory("defaultPU");

    public static EntityManager getEntityManager() {
        return emf.createEntityManager();
    }
}

```

### 2.3. Ciclo de Vida do Contexto de Persistência

1. **Criação do `EntityManager`**
    
    ```java
    EntityManager em = JPAUtil.getEntityManager();
    
    ```
    
2. **Início de Transação**
    
    ```java
    EntityTransaction tx = em.getTransaction();
    tx.begin();
    
    ```
    
3. **Operações no Contexto**
    - `em.persist(novaEntidade)`: faz a entidade transiente virar gerenciada.
    - `em.find(Entidade.class, id)`: busca do cache; se não existir, faz SELECT.
    - `em.merge(entidadeDestacada)`: retorna uma versão gerenciada baseada na entidade destacada.
    - `em.remove(entidadeGerenciada)`: marca para remoção.
    - Alterações em entidades **gerenciadas** não necessitam de `persist()` ou `merge()`; basta alterar atributo e, ao fazer `commit()`, o JPA faz o `UPDATE` automaticamente.
4. **Commit ou Rollback**
    
    ```java
    tx.commit();    // Sincroniza mudanças com o banco e confirma.
    // ou, em caso de erro:
    tx.rollback();  // Desfaz tudo que estava pendente no contexto de persistência.
    
    ```
    
5. **Fechamento do `EntityManager`**
    
    ```java
    em.close();     // Libera recursos e “destaca” todas as entidades.
    
    ```
    

**Lembre-se:** Enquanto o `EntityManager` estiver aberto, existe um **Persistence Context** ativo. Após `em.close()`, todas as entidades se tornam *detached* e mudanças não são mais rastreadas.

### 2.4. Demarcação de Transações com JTA e Resource-Local

- **RESOURCE_LOCAL**:
    - O `EntityTransaction` é obtido via `em.getTransaction()`.
    - Adequado para aplicações Java SE ou frameworks que não fornecem container-managed transactions.
- **JTA (Java Transaction API)**:
    - Usado em contêineres Java EE ou Spring. Não se chama `em.getTransaction()`. Em vez disso, as transações são gerenciadas pelo container ou via `UserTransaction`.
    - Exemplo (EJB ou Spring):
        
        ```java
        @PersistenceContext
        private EntityManager em;  // O container injeta e provê contexto gerenciado.
        
        public void meuMetodoTransactional() {
            // O contêiner inicia e faz commit/rollback automaticamente
            Cliente c = em.find(Cliente.class, 1L);
            c.setNome("Novo Nome");
            // Não há tx.begin() nem tx.commit(), é tratado pelo container.
        }
        
        ```
        

### 2.5. Exemplos Comentados

### Exemplo 1: CRUD Simples (Resource-Local)

```java
public class UsuarioService {
    public void cadastrarUsuario(String nome, String email) {
        EntityManager em = JPAUtil.getEntityManager();
        EntityTransaction tx = em.getTransaction();

        try {
            tx.begin();
            Usuario u = new Usuario();
            u.setNome(nome);
            u.setEmail(email);
            em.persist(u);           // Torna o objeto gerenciado e prepara INSERT.
            tx.commit();             // Envia INSERT ao banco e confirma.
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();       // Reverte em caso de falha.
            }
            throw e;
        } finally {
            em.close();              // Fecha o EntityManager e descarta o contexto.
        }
    }

    public Usuario buscarPorId(Long id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.find(Usuario.class, id);  // Retorna entidade gerenciada.
        } finally {
            em.close();
        }
    }

    public void atualizarEmail(Long id, String novoEmail) {
        EntityManager em = JPAUtil.getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Usuario u = em.find(Usuario.class, id);
            if (u != null) {
                u.setEmail(novoEmail);  // Alteração será detectada no commit.
            }
            tx.commit();              // Emite UPDATE automaticamente.
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    public void removerUsuario(Long id) {
        EntityManager em = JPAUtil.getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Usuario u = em.find(Usuario.class, id);
            if (u != null) {
                em.remove(u);         // Entidade marcada para remoção (DELETE).
            }
            tx.commit();             // Executa DELETE no banco.
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }
}

```

- **Pontos de atenção:**
    - Chamadas a `em.find()` dentro da transação retornam objeto **gerenciado**.
    - Alterações em campos de objeto gerenciado (como `u.setEmail(...)`) não exigem `merge()`.
    - Transações devem sempre ser encerradas (`commit()` ou `rollback()`) antes de fechar o `EntityManager`.

### Exemplo 2: Uso de `merge()` para Entidade Destacada

```java
public void atualizarDescricaoDetached(Usuario usuarioDetached) {
    EntityManager em = JPAUtil.getEntityManager();
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        // O objeto passado como argumento pode estar fora de contexto.
        Usuario managed = em.merge(usuarioDetached);
        // managed torna-se gerenciado; alterações posteriores em managed serão sincronizadas.
        managed.setNome("Nome Alterado");
        tx.commit();  // Aplica UPDATE no banco.
    } catch (Exception e) {
        if (tx.isActive()) tx.rollback();
        throw e;
    } finally {
        em.close();
    }
}

```

- **Quando usar `merge()`:**
    - Em cenários onde a entidade já estava fora do contexto (p. ex., recebida via DTO ou fora de uma transação anterior).
    - O método `merge()` retorna a instância gerenciada; o argumento `usuarioDetached` continua desconectado.

---

## Cenários de Restrição ou Não Aplicação

### 3.1. Aplicações Não Tradicionais (NoSQL puro)

- Quando se utiliza bancos de dados NoSQL (MongoDB, Cassandra etc.) sem dependência de camadas relacionais, o JPA não é adequado. Nestes casos, normalmente se utilizam *drivers* ou frameworks específicos (ex.: MongoDB Java Driver, Spring Data MongoDB).
- Alguns provedores permitem uso de JPA sobre NoSQL, mas costumam ter limitações, principalmente em relação a join e transações ACID.

### 3.2. Uso de ORM em Operações em Lote Extremamente Simples

- Se a aplicação realiza apenas **leitura massiva** (queries complexas em tabela muito grande) sem necessidade de mapeamento objeto-relacional rico, pode ser mais eficiente usar **JDBC puro** ou frameworks como **Jooq**. O overhead do contexto de persistência pode se tornar gargalo.
- Em processos de **ETL** (extração, transformação e carga) em grande volume, frameworks específicos de Bulk Insert/Update podem ser mais indicados do que JPA.

### 3.3. Contextos de Alta Performance Sem Transações ACID

- Em sistemas que aceitam relaxar garantias ACID em prol de **altíssima velocidade** (ex.: aplicativos de streaming de dados em tempo real que não exigem rollback), padrões como **event sourcing** ou **CQRS** podem dispensar JPA.
- Em arquiteturas de microserviços onde cada serviço mantém seu próprio banco e há uso de **event-driven**, a gestão de transações pode ser distribuída (2PC) ou até sagas. Nesses casos, o JPA ainda pode ser usado no serviço, mas o escopo transacional ultrapassa a simples demarcação local.

---

## Componentes-Chave Associados

### 4.1. Anotações Relevantes

- **`@Entity`**
    
    Marca a classe Java como uma **entidade JPA**, mapeável para uma tabela no banco.
    
    ```java
    @Entity
    public class Usuario { ... }
    
    ```
    
- **`@Table`** *(opcional)*
    
    Especifica o nome da tabela e outras propriedades de esquema.
    
    ```java
    @Entity
    @Table(name = "usuarios")
    public class Usuario { ... }
    
    ```
    
- **`@Id`**
    
    Indica o atributo que será a chave primária.
    
    ```java
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    ```
    
- **`@GeneratedValue`**
    
    Estratégias para geração automática de valores (`AUTO`, `IDENTITY`, `SEQUENCE`, `TABLE`).
    
- **`@Column`** *(opcional)*
    
    Define detalhes de coluna (comprimento, nulo, nome, tipo).
    
- **`@ManyToOne`, `@OneToMany`, `@OneToOne`, `@ManyToMany`**
    
    Relacionamentos entre entidades. Necessários para mapear chaves estrangeiras e tabelas de junção.
    
- **`@PersistenceContext`** *(em ambientes EE/Spring)*
    
    Injeta automaticamente um `EntityManager` gerenciado pelo container. Ex.:
    
    ```java
    @PersistenceContext
    private EntityManager em;
    
    ```
    
- **`@Transactional`** *(em Spring)*
    
    Demarcação declarativa de transação.
    
    ```java
    @Transactional
    public void metodoQueFazAlgo() {
        // o container gerencia begin/commit/rollback
    }
    
    ```
    

### 4.2. Classes e Interfaces do JPA

- **`EntityManagerFactory`**
    - Fábrica de `EntityManager`.
    - Deve ser instanciada uma única vez (algoritmo caro).
- **`EntityManager`**
    - Contexto de persistência ativo.
    - Operações principais: `persist()`, `merge()`, `remove()`, `find()`, `createQuery()`, `createNamedQuery()`.
- **`EntityTransaction`**
    - Interface para gestão de transações (em modo `RESOURCE_LOCAL`).
    - Métodos: `begin()`, `commit()`, `rollback()`, `setRollbackOnly()`.
- **`Query` e `TypedQuery`**
    - Para executar JPQL (Java Persistence Query Language).
    
    ```java
    TypedQuery<Usuario> query = em.createQuery("SELECT u FROM Usuario u WHERE u.email = :email", Usuario.class);
    query.setParameter("email", email);
    List<Usuario> lista = query.getResultList();
    
    ```
    
- **`CriteriaBuilder`, `CriteriaQuery`**
    - Abordagem programática para construir consultas de forma segura contra refatorações.

### 4.3. Mecanismos de Cache

- **Cache de Primeiro Nível (L1 Cache)**
    - Cada `EntityManager` possui seu próprio cache interno.
    - Dentro de uma transação, se buscar a mesma entidade duas vezes (`em.find()`), só ocorre uma consulta ao banco; na segunda vez, o objeto é retornado do cache.
- **Cache de Segundo Nível (L2 Cache)**
    - Configurável via provedor (Hibernate, EclipseLink).
    - Compartilhado entre instâncias de `EntityManagerFactory`.
    - Útil para reduzir leituras repetitivas de dados que raramente mudam.
    - Configuração (exemplo Hibernate + EHCache):
        
        ```xml
        <property name="hibernate.cache.use_second_level_cache" value="true"/>
        <property name="hibernate.cache.region.factory_class" value="org.hibernate.cache.ehcache.EhCacheRegionFactory"/>
        <property name="hibernate.cache.use_query_cache" value="true"/>
        
        ```
        

---

## Melhores Práticas e Padrões de Uso

### 5.1. Design de Contextos de Persistência

- **Extended vs. Transactional Persistence Context**
    - *Transactional*: padrão em aplicações web, o contexto vive apenas durante uma transação.
    - *Extended*: o contexto pode sobreviver a múltiplas transações (uso comum em stateful beans). Cuidado com **memory leaks** e sincronização de estado.
- **Escopo do `EntityManager`**
    - Em aplicações Java SE, deve-se abrir e fechar o `EntityManager` em cada operação ou serviço.
    - Em aplicações gerenciadas (Spring, Java EE), recomenda-se injetar o `EntityManager` e deixar o container controlar ciclo de vida.

### 5.2. Padrões de Transação

- **Begin–Commit–Rollback**
    - Sempre iniciar uma transação explicitamente (em `RESOURCE_LOCAL`).
    - Envolver apenas as operações essenciais dentro de `begin()` e `commit()` para não manter transação aberta por muito tempo.
- **Níveis de Isolamento**
    - *READ_UNCOMMITTED*, *READ_COMMITTED*, *REPEATABLE_READ*, *SERIALIZABLE*.
    - Configure no banco de dados ou via propriedade JPA (`hibernate.connection.isolation`).
    - Em geral, *READ_COMMITTED* é suficiente para maioria das aplicações; para cenários críticos, avaliar *REPEATABLE_READ* ou *SERIALIZABLE*.

### 5.3. Tratamento de Exceções e Rollbacks

- **Rollback Automático em Exceções**
    - No Spring, ao usar `@Transactional`, apenas exceções não verificadas (`RuntimeException` e subclasses) acionam rollback por padrão. Para forçar rollback em exceções verificadas, configurar `@Transactional(rollbackFor = Exception.class)`.
- **Marcar para Rollback**
    - Em JPA puro, ao capturar uma exceção dentro de uma transação, chamar `tx.setRollbackOnly()` antes de `rollback()`, caso já tenha ocorrido commit parcial.

### 5.4. Uso Adequado de `persist()`, `merge()` e `remove()`

- **`persist(entity)`**
    - Indica que a entidade deve ser inserida; deve ser usada apenas em entidades **transientes**.
- **`merge(entity)`**
    - Faz *merge* de estado de uma entidade **detached** para um objeto gerenciado; retorna novo objeto gerenciado.
- **`remove(entity)`**
    - Remove a entidade gerenciada; dispara `DELETE` no commit.
- **`refresh(entity)`**
    - Atualiza a entidade gerenciada com os dados atuais do banco (fazer `SELECT` forçado).
- **`detach(entity)`**
    - Remove explicitamente a entidade do contexto de persistência (ficará em estado *detached*).

---

## Exemplo Prático Completo

### 6.1. Cenário: Cadastro de Usuário com Conta Bancária

Imagine um sistema simples em que temos duas entidades:

- `User` (usuário do sistema).
- `Account` (conta bancária associada ao usuário).

Ao criar um usuário, automaticamente geramos uma conta corrente vinculada. Precisamos que ambas as operações ocorram em uma única transação.

### 6.2. Entidades Envolvidas

```java
// src/main/java/com/exemplo/model/User.java
package com.exemplo.model;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    // Bidirecional: 1 usuário pode ter várias contas.
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Account> accounts = new HashSet<>();

    // Construtores, getters e setters omitidos para brevidade.

    public void addAccount(Account account) {
        accounts.add(account);
        account.setOwner(this);
    }

    public void removeAccount(Account account) {
        accounts.remove(account);
        account.setOwner(null);
    }
}

```

```java
// src/main/java/com/exemplo/model/Account.java
package com.exemplo.model;

import javax.persistence.*;

@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double balance;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User owner;

    // Construtores, getters e setters omitidos.

    public void setOwner(User owner) {
        this.owner = owner;
    }
}

```

### 6.3. Configuração e Bootstrapping

- **`persistence.xml`** (conforme mostrado na seção 2.1).
- **`JPAUtil`** (conforme seção 2.2).

### 6.4. Operação CRUD com Transação

```java
package com.exemplo.service;

import com.exemplo.model.User;
import com.exemplo.model.Account;

import javax.persistence.*;

public class BankingService {

    public void criarUsuarioComConta(String name, String email, Double initialBalance) {
        EntityManager em = JPAUtil.getEntityManager();
        EntityTransaction tx = em.getTransaction();

        try {
            tx.begin();

            // 1) Criar entidade de usuário (transient)
            User user = new User();
            user.setName(name);
            user.setEmail(email);

            // 2) Gerar conta inicial (também transient)
            Account account = new Account();
            account.setBalance(initialBalance);

            // 3) Associar as contas ao usuário (bi-direcional)
            user.addAccount(account);

            // 4) Persistir usuário. Como cascade = ALL, a(s) conta(s) também serão persistidas.
            em.persist(user);
            // Não é necessário chamar em.persist(account()), pois CascadeType.ALL cuida disso.

            // 5) Fazer commit — neste momento, JPA:
            //    - Executa INSERT em users
            //    - Executa INSERT em accounts
            tx.commit();

        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback(); // Desfaz INSERTs parciais em caso de falha
            }
            throw e;
        } finally {
            em.close(); // Fecha o contexto de persistência
        }
    }

    public User buscarUsuarioComContas(Long userId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            // Busca usuário. Por padrão, contas estão lazy-loading;
            // acessar user.getAccounts() fora de transação dá LazyInitializationException.
            User user = em.find(User.class, userId);
            // Se quisermos carregar contas imediatamente:
            user.getAccounts().size();
            return user;
        } finally {
            em.close();
        }
    }

    public void transferirEntreContas(Long sourceAccountId, Long targetAccountId, Double valor) {
        EntityManager em = JPAUtil.getEntityManager();
        EntityTransaction tx = em.getTransaction();

        try {
            tx.begin();

            Account source = em.find(Account.class, sourceAccountId);
            Account target = em.find(Account.class, targetAccountId);

            if (source == null || target == null) {
                throw new IllegalArgumentException("Contas inválidas.");
            }
            if (source.getBalance() < valor) {
                throw new IllegalStateException("Saldo insuficiente.");
            }

            source.setBalance(source.getBalance() - valor);
            target.setBalance(target.getBalance() + valor);

            // Como as entidades estão gerenciadas, ao chamar tx.commit(),
            // JPA detecta as mudanças (dirty checking) e executa UPDATE nas tabelas.
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

- **Explicação do Exemplo:**
    1. **`criarUsuarioComConta(...)`:**
        - Cria um `User` e um `Account` em memória.
        - Associa as entidades (configuração bidirecional).
        - Chama `persist(user)`. Graças a `CascadeType.ALL` em `accounts`, o JPA também persiste todas as contas associadas.
        - Ao `commit()`, o JPA agrupa as instruções INSERT nas duas tabelas dentro de uma única transação.
    2. **`transferirEntreContas(...)`:**
        - Busca duas contas gerenciadas pelo mesmo contexto.
        - Atualiza o `balance`.
        - Ao confirmar, o JPA gera dois comandos UPDATE dentro da mesma transação, garantindo atomicidade (se algo falhar, rollback para manter consistência).

---

## Sugestões para Aprofundamento

1. **Documentação Oficial:**
    - [Java EE Tutorial – JPA](https://javaee.github.io/tutorial/persistence-intro.html)
    - [Hibernate User Guide](https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html)
2. **Livros Recomendados:**
    - “Pro JPA 2 in Java EE 8” – Mike Keith & Merrick Schincariol
    - “Java Persistence with Hibernate” – Christian Bauer & Gavin King
3. **Artigos e Blogs:**
    - Baeldung: [JPA and Hibernate Tutorial](https://www.baeldung.com/learn-jpa-hibernate)
    - Thorben Janssen: [Vários artigos sobre Performance e Cache no JPA](https://thorben-janssen.com/)
4. **Projetos de Exemplo no GitHub:**
    - Repositórios que usam Spring Data JPA para ver padrões de uso em aplicações Spring Boot.
    - Exemplos de integração JPA com microserviços e transações distribuídas (Sagas).

---

Com este material, você terá uma compreensão abrangente de **como o contexto de persistência e as transações funcionam no JPA**, bem como exemplos práticos de código para ilustrar cada etapa do processo. Sinta-se à vontade para adaptar os exemplos ao seu ambiente e aprofundar conforme as necessidades do seu projeto.