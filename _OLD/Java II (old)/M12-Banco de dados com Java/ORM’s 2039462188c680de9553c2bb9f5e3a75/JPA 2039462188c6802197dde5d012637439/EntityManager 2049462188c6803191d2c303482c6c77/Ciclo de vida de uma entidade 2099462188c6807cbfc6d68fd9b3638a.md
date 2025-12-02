# Ciclo de vida de uma entidade

---

## 1. Introdução

O **Java Persistence API (JPA)** é a especificação padrão para mapeamento objeto-relacional (ORM) no ecossistema Java. Dentro do JPA, o **`EntityManager`** é a interface principal que gerencia as entidades, suas operações de persistência e, em especial, o ciclo de vida das mesmas. Entender como o `EntityManager` transita uma entidade pelos estados **New**, **Managed**, **Detached** e **Removed** é fundamental para garantir consistência, performance e previsibilidade em aplicações que interagem com bancos de dados relacionais.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#conceitos-fundamentais)
2. [Ciclo de Vida de uma Entidade](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#ciclo-de-vida-de-uma-entidade)
    1. Estado **New**
    2. Estado **Managed**
    3. Estado **Detached**
    4. Estado **Removed**
3. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Obtenção do `EntityManager`
    2. Transições de Estado (métodos principais)
    3. Exemplos de Código Comentados
4. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
5. [Componentes Chave Associados](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#componentes-chave-associados)
    1. Anotações Principais (`@Entity`, `@Id`, `@GeneratedValue`, etc.)
    2. Métodos do `EntityManager`
    3. `PersistenceUnit` e `PersistenceContext`
    4. Interfaces e Classes Auxiliares (por exemplo, `EntityTransaction`)
6. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
7. [Exemplo Prático Completo](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#exemplo-pr%C3%A1tico-completo)
    1. Cenário e Modelo de Domínio
    2. Configuração Básica (`persistence.xml`)
    3. Operações CRUD demonstrando as transições de estado
8. [Sugestões para Aprofundamento](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

1. **`EntityManager`**
    - É a interface que expõe métodos para criar, ler, atualizar e remover entidades persistentes.
    - Representa um contexto de persistência (persistence context) no qual as entidades são gerenciadas.
2. **Contexto de Persistência (Persistence Context)**
    - Conjunto de entidades gerenciadas num determinado escopo de transação.
    - Dentro desse contexto, o JPA garante o monitoramento de mudanças (dirty checking) e sincroniza essas alterações com o banco de dados ao fim da transação.
3. **Ciclo de Vida de uma Entidade**
    - Entidades JPA transitam por 4 estados principais:
        1. **New (Transient)**
        2. **Managed (Persistent)**
        3. **Detached (Detached)**
        4. **Removed (Removed)**
    - Cada estado reflete a relação entre a instância Java e o registro correspondente no banco de dados (ou a inexistência desse registro).
4. **Importância do Controle de Estado**
    - Saber em que estado a entidade se encontra permite evitar erros como:
        - `EntityNotFoundException` ao acessar dados sem carregá-los.
        - Duplicidade de comandos SQL desnecessários.
        - Falta de sincronização entre memória e banco de dados, levando a dados desatualizados ou inconsistentes.

---

## 4. Ciclo de Vida de uma Entidade

### 4.1 Estado **New** (Transient)

- **Definição:** Entidade recém-instanciada em Java, ainda não associada a nenhum `EntityManager` e, portanto, sem representação no banco de dados.
- **Característica Principal:**
    - Não possui identidade persistente (ou seja, não há uma linha correspondente no banco).
    - Pode ser simplesmente descartada sem afetar o banco.
- **Exemplo Visual:**
    
    ```java
    // 1. Criação de nova instância - estado New (Transient)
    Cliente cliente = new Cliente();
    cliente.setNome("Ana Silva");
    cliente.setEmail("ana.silva@example.com");
    // Neste momento, 'cliente' não está vinculado a nenhum EntityManager.
    
    ```
    

### 4.2 Estado **Managed** (Persistent)

- **Definição:** Entidade que está dentro do contexto de persistência de um `EntityManager`.
- **Como Chegar a esse Estado:**
    - Chamando `persist(entity)` em uma entidade **New**.
    - Executando uma consulta que retorna a entidade (por exemplo, `find` ou uma query JPQL).
- **Comportamento:**
    - Quaisquer alterações feitas nos atributos da entidade são detectadas automaticamente (dirty checking).
    - Ao final da transação (ou quando explicitamente for acionado `flush()`), as mudanças são propagadas ao banco de dados.
- **Exemplo Visual:**
    
    ```java
    EntityManager em = ...;  // obtido de algum EntityManagerFactory
    EntityTransaction tx = em.getTransaction();
    tx.begin();
    
    // 2. Associação ao contexto de persistência - estado Managed
    em.persist(cliente);
    // 'cliente' agora está no estado Managed.
    
    cliente.setEmail("ana.novoemail@example.com");
    // Não é necessário chamar 'merge' ou outro método para atualizar:
    // o JPA detectará essa alteração automaticamente ao final da transação.
    
    tx.commit();
    // O SQL INSERT e UPDATE serão executados conforme necessário.
    
    ```
    

### 4.3 Estado **Detached**

- **Definição:** Entidade que já foi associada a um `EntityManager` (ou seja, já passou por Managed), mas esse `EntityManager` foi fechado ou a transação encerrou o contexto de persistência, fazendo com que ela fique “desanexada”.
- **Como Chegar a esse Estado:**
    - Chamando `em.detach(entity)`.
    - Encerrando a transação (se o contexto for transacional).
    - Fechando o `EntityManager`.
- **Características:**
    - O JPA **não monitora** mais alterações automáticas em atributos.
    - Para salvar novas modificações, é preciso “reattach” usando `merge`.
- **Exemplo Visual:**
    
    ```java
    EntityManager em = ...;
    em.getTransaction().begin();
    Cliente managedCliente = em.find(Cliente.class, 1L);
    em.getTransaction().commit();
    
    // Após commit, o contexto de persistência é limpo. 'managedCliente' torna-se Detached.
    managedCliente.setNome("Nome Alterado");
    // Essa alteração NÃO será refletida no banco a menos que façamos um merge posterior.
    
    ```
    

### 4.4 Estado **Removed**

- **Definição:** Entidade marcada para remoção. Está ainda no contexto de persistência, mas marcada para gerar um comando `DELETE` ao `flush()` ou ao commit.
- **Como Chegar a esse Estado:**
    - Chamando `remove(entity)` em uma entidade **Managed**.
- **Comportamento:**
    - A entidade permanece em memória até que o contexto seja sincronizado.
    - Após o commit, o registro correspondente é excluído do banco e a instância torna-se **Detached**.
- **Exemplo Visual:**
    
    ```java
    EntityManager em = ...;
    em.getTransaction().begin();
    Cliente c = em.find(Cliente.class, 2L); // c está Managed
    em.remove(c);
    // c está agora em estado Removed
    
    em.getTransaction().commit();
    // SQL DELETE é executado. 'c' passa a ser Detached (e não mais existe no banco).
    
    ```
    

---

## 5. Sintaxe Detalhada e Uso Prático

### 5.1 Obtenção do `EntityManager`

Em geral, o `EntityManager` é obtido a partir de um `EntityManagerFactory`, que por sua vez é configurado via `persistence.xml`. Exemplos:

```java
// Exemplo básico:
EntityManagerFactory emf = Persistence.createEntityManagerFactory("meu-persistence-unit");
EntityManager em = emf.createEntityManager();

// Em aplicações Java EE / Jakarta EE (ou Spring), pode-se injetar diretamente:
@PersistenceContext
private EntityManager em;

```

### 5.2 Transições de Estado: Métodos Principais

| Método | Entidade Entrada | Estado Antes | Estado Depois | Observação |
| --- | --- | --- | --- | --- |
| `persist(Object entity)` | New | New | Managed | Gera um `INSERT` ao sincronizar (flush/commit). |
| `merge(Object entity)` | Detached/New | Detached/New | Managed (novo) | Retorna uma instância gerenciada; usado para mesclar alterações de entidades Detached ou New. |
| `remove(Object entity)` | Managed | Managed | Removed | Gera um `DELETE` ao sincronizar. |
| `find(Class<T>, Object primaryKey)` | — | — | Managed | Recupera do banco e associa ao contexto, se existir. |
| `getReference(Class<T>, Object primaryKey)` | — | — | Managed proxy | Retorna um *proxy* que pode falhar em `EntityNotFoundException` ao acessar dados não existentes. |
| `detach(Object entity)` | Managed | Managed | Detached | Remove entidade do contexto sem gerar `DELETE`. |
| `clear()` | — | — | Todos Detached | Desassocia todas as entidades do contexto de persistência. |
| `flush()` | — | — | — | Sincroniza contexto com o banco: executa os SQLs pendentes. |

### 5.3 Exemplos de Código Comentados

### 5.3.1 Criando e Persistindo uma Entidade (New → Managed)

```java
public void criarCliente() {
    EntityManager em = emf.createEntityManager();
    EntityTransaction tx = em.getTransaction();

    try {
        tx.begin();

        // 1. Cria novo objeto – estado New (Transient)
        Cliente cliente = new Cliente();
        cliente.setNome("Carlos Santos");
        cliente.setEmail("carlos.santos@example.com");

        // 2. Chama persist → estado Managed (Persistent)
        em.persist(cliente);

        // 3. Pode alterar atributos livremente:
        cliente.setEmail("carlos.novoemail@example.com");
        // Esse UPDATE será executado no banco quando o flush/commit ocorrer.

        tx.commit(); // SQL: INSERT em tabela de cliente, seguido de UPDATE (caso necessário)
    } catch (Exception e) {
        if (tx.isActive()) {
            tx.rollback();
        }
        throw e;
    } finally {
        em.close();
    }
}

```

### 5.3.2 Atualizando uma Entidade Detached (Detached → Managed via `merge`)

```java
public void atualizarCliente(Long id) {
    Cliente detachedCliente;

    // 1. Busca e fecha contexto, deixando a entidade Detached
    {
        EntityManager em1 = emf.createEntityManager();
        detachedCliente = em1.find(Cliente.class, id); // Managed
        em1.close(); // Agora detachedCliente está em estado Detached
    }

    // 2. Modifica atributos enquanto Detached
    detachedCliente.setNome("Nome Atualizado");

    // 3. “Reatacha” com merge → retorna instância Managed
    EntityManager em2 = emf.createEntityManager();
    EntityTransaction tx2 = em2.getTransaction();
    try {
        tx2.begin();
        Cliente managed = em2.merge(detachedCliente);
        // 'managed' está no estado Managed
        // As alterações feitas em detachedCliente são copiadas para managed
        tx2.commit(); // Executa SQL: UPDATE cliente SET nome = ...
    } catch (Exception e) {
        if (tx2.isActive()) tx2.rollback();
        throw e;
    } finally {
        em2.close();
    }
}

```

### 5.3.3 Removendo uma Entidade (Managed → Removed → Detach)

```java
public void removerCliente(Long id) {
    EntityManager em = emf.createEntityManager();
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        Cliente c = em.find(Cliente.class, id); // recupera e associa (Managed)
        em.remove(c); // marca para remoção (Removed)
        // Ao commitar, será executado DELETE FROM cliente WHERE id = ?
        tx.commit();
    } catch (Exception e) {
        if (tx.isActive()) tx.rollback();
        throw e;
    } finally {
        em.close();
    }
    // Após commit e fechamento, a instância c torna-se Detached e não existe mais no BD
}

```

### 5.3.4 Usando `detach` Explicitamente (Managed → Detached)

```java
public void demonstrarDetach(Long id) {
    EntityManager em = emf.createEntityManager();
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();

        Cliente c = em.find(Cliente.class, id); // Managed
        // Agora decidimos não persistir alterações adicionais:
        em.detach(c); // c passa para Detached—novas mudanças não serão salvas sozinho

        c.setEmail("alterado@dominio.com");
        // Essa alteração NÃO gerará SQL, pois c já não está mais no contexto

        tx.commit(); // Não há UPDATE, já que c estava Detached antes do commit
    } catch (Exception e) {
        if (tx.isActive()) tx.rollback();
    } finally {
        em.close();
    }
}

```

---

## 6. Cenários de Restrição ou Não Aplicação

1. **Aplicações sem JPA/Hibernate**
    - Se seu projeto não utiliza JPA (por exemplo, usa JDBC puro ou outro ORM), o conceito de `EntityManager` não se aplica.
2. **Contextos Somente Leitura**
    - Em cenários estritamente de leitura, chamar `persist` ou `merge` é desnecessário; normalmente bastaria `find` ou consultas nativas.
3. **Uso de Frameworks que Ocultam o JPA**
    - Frameworks como Spring Data JPA abstraem muitas chamadas diretas ao `EntityManager`. Nesse caso, usar repositórios especializados (`Repository`) pode ser a abordagem recomendada, evitando lidar manualmente com `persist`, `merge`, etc.
4. **Entidades com Fluxos Específicos de Carga (Lazy Loading)**
    - Cuidado: se a entidade for `Detached` e você tentar acessar coleções marcadas como `LAZY`, poderá ocorrer `LazyInitializationException`. Nesses casos, é preciso reatachá-la (ou usar `EntityGraph`/fetch join).
5. **Contextos Não Transacionais (Ambiente Java SE sem Gerenciamento de Contêiner)**
    - É responsabilidade do desenvolvedor iniciar e controlar transações manualmente. Sem transação ativa, `persist` e `remove` podem não funcionar como esperado.

---

## 7. Componentes Chave Associados

### 7.1 Anotações Principais

- `@Entity`
    - Marca uma classe Java como entidade JPA, mapeando-a a uma tabela no banco.
- `@Table(name = "tabela_cliente")`
    - Especifica o nome da tabela (opcional; se omitido, usa-se o nome da classe como padrão).
- `@Id`
    - Define o atributo que corresponde à chave primária na tabela.
- `@GeneratedValue(strategy = GenerationType.IDENTITY)`
    - Define a estratégia de geração automática do valor da chave primária (IDENTITY, SEQUENCE, TABLE, AUTO).
- `@Column(name = "nome_coluna")`
    - Mapeia o atributo a uma coluna específica (opcional; se omitido, usa-se o nome do atributo).
- `@NamedQuery` / `@NamedQueries`
    - Permitem definir queries JPQL com nomes pré-definidos, vinculados à entidade.
- `@Transient`
    - Indica que determinado atributo não deve ser persistido no banco.

### 7.2 Métodos do `EntityManager`

- `persist(Object entity)`
    - Torna a entidade Managed; agendada para INSERT.
- `merge(Object entity)`
    - Retorna instância Managed, mesclando alterações de entidades Detached/New. Agenda INSERT (se New) ou UPDATE (se Detached).
- `find(Class<T>, Object primaryKey)`
    - Recupera instância Managed se existir; se não, retorna `null`.
- `getReference(Class<T>, Object primaryKey)`
    - Traz um proxy; carrega dados somente quando acessado. Em caso de inexistência, lança exceção.
- `remove(Object entity)`
    - Marca para remoção; agenda um DELETE.
- `flush()`
    - Sincroniza alterações pendentes no contexto com o banco (gera SQL).
- `clear()`
    - Desanexa todas as entidades do contexto (tornam-se Detached).
- `detach(Object entity)`
    - Desanexa apenas aquela entidade.
- `contains(Object entity)`
    - Verifica se a entidade está no estado Managed no contexto.
- `getTransaction()`
    - Retorna objeto `EntityTransaction` para controle manual de transações (apenas em Java SE).

### 7.3 `PersistenceUnit` e `PersistenceContext`

- **`persistence.xml`**
    - Arquivo de configuração onde se define a *Persistence Unit*, com nome, provedor (por exemplo, Hibernate), propriedades de conexão, dialect, etc.
- **`@PersistenceContext`**
    - (Em Java EE/JakartaEE ou Spring)
    - Injeta automaticamente um `EntityManager` gerenciado pelo contêiner, com escopo transacional.
- **`@PersistenceUnit`**
    - Injeta `EntityManagerFactory` em ambientes gerenciados.

### 7.4 Interfaces e Classes Auxiliares

- **`EntityTransaction`**
    - Utilizada em Java SE para controle manual de transações (métodos `begin()`, `commit()`, `rollback()`).
- **`Query` / `TypedQuery`**
    - Para executar consultas JPQL ou nativas.
- **`CriteriaBuilder` / `CriteriaQuery`**
    - API de critérios para construção dinâmica de consultas tipadas.

---

## 8. Melhores Práticas e Padrões de Uso

1. **Preferir Injeção de `EntityManager` (quando possível)**
    - Em um contêiner Java EE ou Spring, use `@PersistenceContext` para delegar ao provedor o gerenciamento do ciclo de vida do `EntityManager`, evitando abrir e fechar manualmente.
2. **Manter o Tempo de Vida do Contexto de Persistência Curto**
    - Contextos muito longos (por exemplo, `EntityManager` por toda a aplicação) aumentam risco de excesso de entidades Managed, consumindo muita memória e gerando problemas de performance.
3. **Evitar Duplicidade de `merge` e `persist` Sem Necessidade**
    - Só chame `merge` em objetos Detached; chamar em Managed ou sem necessidade pode gerar comandos SQL extras.
4. **Usar `flush()` de Forma Controlada**
    - O `flush` ocorre automaticamente no commit. Chamar explicitamente antes de finalizar uma transação só quando for necessário (por exemplo, para garantir integridade referencial antes de outro comando).
5. **Tratar Exceções de Forma Apropriada**
    - Evitar deixar transações abertas sem commit/rollback. Envolver em blocos `try-catch-finally` sempre fechando o `EntityManager`.
6. **Cuidado com `Lazy Loading` e Entidades Detached**
    - Em cenários de apresentação (por exemplo, camada web), evitar acessar coleções lazy após fechar o contexto. Utilize `fetch join` ou `EntityGraph` para carregar antecipadamente.
7. **Normalizar o Uso de Transações**
    - Defina claramente transações de leitura e gravação. Em consultas simples, use transação somente de leitura (`spring` por exemplo: `@Transactional(readOnly = true)`).
8. **Mapear Relações com Estrutura Adequada**
    - Escolher corretamente `FetchType.EAGER` vs. `LAZY` e cardinalidade (`@OneToMany`, `@ManyToOne`, etc.) para evitar *N+1 selects* ou carregamento desnecessário de dados.

---

## 9. Exemplo Prático Completo

### 9.1 Cenário e Modelo de Domínio

Imagine um sistema simples de gerenciamento de clientes e seus pedidos. Teremos:

- Entidade **Cliente** (`Cliente`)
    - `id` (Long, chave primária gerada automaticamente)
    - `nome` (String)
    - `email` (String)
    - `List<Pedido> pedidos` (relação OneToMany)
- Entidade **Pedido** (`Pedido`)
    - `id` (Long, chave primária gerada automaticamente)
    - `descricao` (String)
    - `valor` (BigDecimal)
    - `Cliente cliente` (relação ManyToOne)

### 9.1.1 `Cliente.java`

```java
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pedido> pedidos = new ArrayList<>();

    // Getters e Setters

    public void adicionarPedido(Pedido p) {
        pedidos.add(p);
        p.setCliente(this);
    }

    public void removerPedido(Pedido p) {
        pedidos.remove(p);
        p.setCliente(null);
    }

    // equals e hashCode baseados em id
}

```

### 9.1.2 `Pedido.java`

```java
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricao;

    private BigDecimal valor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // Getters e Setters

    // equals e hashCode baseados em id
}

```

### 9.2 Configuração Básica (`persistence.xml`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="https://jakarta.ee/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="https://jakarta.ee/xml/ns/persistence
                                 https://jakarta.ee/xml/ns/persistence/persistence_3_0.xsd"
             version="3.0">

    <persistence-unit name="meuPU" transaction-type="RESOURCE_LOCAL">
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>

        <class>com.exemplo.Cliente</class>
        <class>com.exemplo.Pedido</class>

        <properties>
            <!-- Configurações de conexão -->
            <property name="jakarta.persistence.jdbc.url" value="jdbc:mysql://localhost:3306/meubd"/>
            <property name="jakarta.persistence.jdbc.user" value="usuario"/>
            <property name="jakarta.persistence.jdbc.password" value="senha"/>
            <property name="jakarta.persistence.jdbc.driver" value="com.mysql.cj.jdbc.Driver"/>

            <!-- Dialect Hibernate -->
            <property name="hibernate.dialect" value="org.hibernate.dialect.MySQL8Dialect"/>

            <!-- Cria/Atualiza esquema automaticamente -->
            <property name="hibernate.hbm2ddl.auto" value="update"/>

            <!-- Log de SQL para desenvolvimento -->
            <property name="hibernate.show_sql" value="true"/>
            <property name="hibernate.format_sql" value="true"/>
        </properties>
    </persistence-unit>
</persistence>

```

### 9.3 Operações CRUD Demonstrando as Transições de Estado

### 9.3.1 Criar Cliente e Pedidos (New → Managed)

```java
public void criarClienteComPedidos() {
    EntityManager em = emf.createEntityManager();
    EntityTransaction tx = em.getTransaction();

    try {
        tx.begin();

        Cliente cliente = new Cliente(); // New
        cliente.setNome("Mariana Lima");
        cliente.setEmail("mariana.lima@example.com");

        // Ao persistir, passa a Managed
        em.persist(cliente); // Managed

        // Criando pedidos vinculados
        Pedido p1 = new Pedido(); // New
        p1.setDescricao("Notebook Gamer");
        p1.setValor(new BigDecimal("7500.00"));

        Pedido p2 = new Pedido(); // New
        p2.setDescricao("Smartphone");
        p2.setValor(new BigDecimal("3200.00"));

        // Adiciona pedidos ao cliente (também os torna Managed por cascade)
        cliente.adicionarPedido(p1);
        cliente.adicionarPedido(p2);

        // Como CascadeType.ALL, não é necessário chamar em.persist em p1 e p2
        // Ao commitar, serão executados SQLs: INSERT cliente, INSERT pedido, INSERT pedido

        tx.commit();
    } catch (Exception e) {
        if (tx.isActive()) tx.rollback();
        throw e;
    } finally {
        em.close();
    }
}

```

### 9.3.2 Atualizar Pedido Existente (Detached → Managed → Detached)

```java
public void atualizarValorPedido(Long pedidoId, BigDecimal novoValor) {
    // 1. Recupera pedido em novo contexto, vira Managed e imediatamente Detached após commit
    Pedido detachedPedido;
    {
        EntityManager em1 = emf.createEntityManager();
        detachedPedido = em1.find(Pedido.class, pedidoId); // Managed
        em1.close(); // passa para Detached
    }

    // 2. Ajustar valor enquanto Detached
    detachedPedido.setValor(novoValor);

    // 3. Mesclar (merge) para voltar ao estado Managed
    EntityManager em2 = emf.createEntityManager();
    EntityTransaction tx2 = em2.getTransaction();
    try {
        tx2.begin();
        Pedido managedPedido = em2.merge(detachedPedido); // managedPedido agora Managed
        // Se precisasse mexer em outras propriedades, seria no managedPedido
        tx2.commit(); // UPDATE pedido SET valor = ? WHERE id = ?
    } catch (Exception e) {
        if (tx2.isActive()) tx2.rollback();
    } finally {
        em2.close(); // managedPedido passa para Detached
    }
}

```

### 9.3.3 Remover Cliente e Pedidos (Managed → Removed → Detached)

```java
public void removerCliente(Long clienteId) {
    EntityManager em = emf.createEntityManager();
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();

        Cliente c = em.find(Cliente.class, clienteId); // Managed
        em.remove(c); // c marcado Removed; devido ao orphanRemoval no OneToMany, pedidos também serão removidos

        tx.commit();
        // Executa DELETE nos pedidos (filhos) e DELETE no cliente
    } catch (Exception e) {
        if (tx.isActive()) tx.rollback();
    } finally {
        em.close();
        // c torna-se Detached e já não existe no BD
    }
}

```

---

## 10. Cenários de Restrição ou Não Aplicação

- **Aplicações Spring Data JPA**:
    - Geralmente se utiliza `CrudRepository`/`JpaRepository` e métodos como `save`, `deleteById` em vez de chamar diretamente `EntityManager`. O `EntityManager` ainda está presente, mas é gerenciado internamente.
- **Armazenamento Não-Relacional**:
    - Se o projeto usar, por exemplo, MongoDB com Spring Data Mongo, não haverá `EntityManager`. Usa-se `MongoTemplate`/`MongoRepository` em vez disso.
- **Contextos Somente Leitura e Conexões Pooled**:
    - Em alguns frameworks, configura-se o `EntityManager` para não permitir operações de escrita, forçando somente `find` e queries.
- **Tamanho do Contexto e Uso de `detach()`/`clear()`**:
    - Em cenários de batch processing, é comum “limpar” o contexto periodicamente para não acumular muitas entidades Managed e causar `OutOfMemoryError`.
- **Entidades Imutáveis ou Sem Ciclo de Vida Dinâmico**:
    - Se for trabalhar com DTOs ou vistas apenas para leitura, não é necessário gerenciar o ciclo de vida como acima; basta usar projeções ou consultas nativas sem se preocupar com estados.

---

## 11. Componentes Chave Associados

### 11.1 Anotações e Classes Importantes

| Componente | Descrição |
| --- | --- |
| `@Entity` | Marca classe como entidade JPA. |
| `@Table` | Define nome da tabela no BD. |
| `@Id` | Indica o atributo que é chave primária. |
| `@GeneratedValue` | Estratégia de geração automática de PK. |
| `@Column` | Mapeia campos para colunas específicas. |
| `@OneToMany`, `@ManyToOne`, etc. | Define relacionamentos, cardinalidades e mapeamentos de chaves estrangeiras. |
| `EntityManagerFactory` | Fábrica para criar instâncias de `EntityManager`. |
| `EntityManager` | Interface principal para operações CRUD e gerenciamento de entidades. |
| `EntityTransaction` | Controla transações em Java SE (métodos: `begin()`, `commit()`, `rollback()`). |
| `PersistenceContextType` (TRANSATIONAL vs. EXTENDED) | Define escopo do contexto de persistência em Java EE/Jakarta EE. |
| `PersistenceContext` | Anotação para injetar `EntityManager` gerenciado pelo contêiner. |
| `CascadeType` | Define quais operações em entidades pai devem “cascatear” para entidades filhas (ALL, PERSIST, MERGE, REMOVE, etc.). |
| `FetchType` | Define como relacionamentos são carregados (LAZY ou EAGER). |

### 11.2 Métodos e Funcionalidades

- **`em.persist(Object entity)`**
    - Adiciona entidade ao contexto e agenda um INSERT.
- **`em.merge(Object entity)`**
    - Mescla alterações, retorna uma instância Managed.
- **`em.remove(Object entity)`**
    - Agenda entidade para exclusão.
- **`em.find(Class<T>, Object pk)`**
    - Carrega entidade e a associa ao contexto.
- **`em.getReference(Class<T>, Object pk)`**
    - Retorna proxy, busca efetiva somente quando acessado.
- **`em.detach(Object entity)`**
    - Desanexa entidade.
- **`em.clear()`**
    - Desanexa todas as entidades.
- **`em.flush()`**
    - Força sincronização imediata com o banco.
- **`em.contains(Object entity)`**
    - Verifica se está Managed.

### 11.3 Configurações de Transação

- **Transações em Java SE**
    - Usa-se `EntityTransaction`.
    - Exemplo:
        
        ```java
        EntityTransaction tx = em.getTransaction();
        tx.begin();
        // operações
        tx.commit();
        
        ```
        
- **Transações em Java EE / Spring**
    - Usa-se `@Transactional` (Spring) ou contêiner gerencia transação automaticamente (Java EE).
    - O `EntityManager` injetado via `@PersistenceContext` participa automaticamente da transação ativa.

---

## 12. Melhores Práticas e Padrões de Uso

1. **Evitar Contextos de Persistência Longos ou “*Extended*” Em Demasia**
    - Embora o modo EXTENDED (JPA em stateful beans) seja útil para conversas longas, em aplicações web é comum usar CONTEXTI ONAL (transação por requisição).
2. **Sempre Fechar o `EntityManager`**
    - Em Java SE, sempre use `try-finally` para chamar `em.close()`, evitando vazamento de conexões.
3. **Tratar LazyInitializationException**
    - Se precisar acessar coleções lazy fora da transação, use fetch join ou inicialize previamente.
4. **Verificar `contains(entity)` Antes de Persistir ou Remover**
    - Para evitar `IllegalArgumentException`, cheque se a entidade já está no contexto.
5. **Utilizar Named Queries Quando Possível**
    - Facilita manutenção e performance (pré-compiladas).
6. **Delegar Inflights de Mudança para o Provedor (Evitar Chamadas Desnecessárias a `flush()`)**
    - O JPA sincroniza no commit; usar `flush()` manual apenas quando for imprescindível, por exemplo, para consultar dados intermediários antes do commit.
7. **Dimensionar Bem o `fetch` em Relacionamentos**
    - Relacionamentos `EAGER` podem gerar consultas desnecessárias. Prefira `LAZY` e use `EntityGraph` ou `JOIN FETCH` sob demanda.
8. **Padronizar Transações de Leitura e Escrita**
    - Marque transações de leitura (`readOnly = true`) para otimização em frameworks que suportam isso (por exemplo, Spring).
9. **Evitar Uso de `merge` em Entidades Grande Volume**
    - Em grandes volumes, preferir atualizar com `find` + setters dentro do mesmo contexto, ao invés de mesclar objetos Detached, para evitar overhead de comparação de estado.

---

## 13. Exemplo Prático Completo

### 13.1 Cenário de Demonstração

Uma pequena aplicação de console que gerencia clientes e pedidos. Será apresentado:

1. **Configuração do JPA (`persistence.xml`)**
2. **Classe `Cliente` e `Pedido`**
3. **Classe de Teste (`MainApp`)** com operações de CRUD, ilustrando as quatro fases (New, Managed, Detached, Removed).

### 13.1.1 Estrutura de Diretórios

```
/src
 └─ /main
     ├─ /java
     │   └─ /com/exemplo
     │       ├─ Cliente.java
     │       ├─ Pedido.java
     │       └─ MainApp.java
     └─ /resources
         └─ META-INF/persistence.xml

```

### 13.1.2 `persistence.xml` (revisitado)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="https://jakarta.ee/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="https://jakarta.ee/xml/ns/persistence
                                 https://jakarta.ee/xml/ns/persistence/persistence_3_0.xsd"
             version="3.0">
    <persistence-unit name="meuPU" transaction-type="RESOURCE_LOCAL">
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
        <class>com.exemplo.Cliente</class>
        <class>com.exemplo.Pedido</class>

        <properties>
            <property name="jakarta.persistence.jdbc.url" value="jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1"/>
            <property name="jakarta.persistence.jdbc.user" value="sa"/>
            <property name="jakarta.persistence.jdbc.password" value=""/>
            <property name="jakarta.persistence.jdbc.driver" value="org.h2.Driver"/>
            <property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>
            <property name="hibernate.hbm2ddl.auto" value="update"/>
            <property name="hibernate.show_sql" value="true"/>
            <property name="hibernate.format_sql" value="true"/>
        </properties>
    </persistence-unit>
</persistence>

```

### 13.1.3 `MainApp.java` (Fluxo Completo)

```java
package com.exemplo;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;

public class MainApp {

    private static EntityManagerFactory emf = Persistence.createEntityManagerFactory("meuPU");

    public static void main(String[] args) {
        Long clienteId;
        Long pedidoId;

        // 1. Criar cliente e pedidos (New → Managed)
        clienteId = criarClienteEPedidos();

        // 2. Consultar cliente (Managed)
        consultarCliente(clienteId);

        // 3. Atualizar um pedido (Detached → Managed)
        pedidoId = obtenhaIdPrimeiroPedido(clienteId);
        atualizarPedido(pedidoId, new BigDecimal("4500.00"));

        // 4. Remover cliente (Managed → Removed)
        removerCliente(clienteId);

        emf.close();
    }

    private static Long criarClienteEPedidos() {
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();
        Long id;

        try {
            tx.begin();

            Cliente c = new Cliente();
            c.setNome("Pedro Oliveira");
            c.setEmail("pedro.oliveira@example.com");

            // New → Managed
            em.persist(c);

            Pedido p1 = new Pedido();
            p1.setDescricao("Tablet");
            p1.setValor(new BigDecimal("2000.00"));

            Pedido p2 = new Pedido();
            p2.setDescricao("Teclado Mecânico");
            p2.setValor(new BigDecimal("500.00"));

            // A associação inclui cascade, logo p1 e p2 viram Managed
            c.adicionarPedido(p1);
            c.adicionarPedido(p2);

            tx.commit();
            id = c.getId();
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }

        System.out.println("Cliente criado com ID: " + id);
        return id;
    }

    private static void consultarCliente(Long id) {
        EntityManager em = emf.createEntityManager();
        try {
            // find → Managed
            Cliente c = em.find(Cliente.class, id);
            System.out.println("Cliente encontrado: " + c.getNome() + " | Email: " + c.getEmail());
            System.out.println("Pedidos:");
            for (Pedido p : c.getPedidos()) {
                System.out.println("  - " + p.getDescricao() + ": R$" + p.getValor());
            }
        } finally {
            em.close();
        }
    }

    private static Long obtenhaIdPrimeiroPedido(Long clienteId) {
        EntityManager em = emf.createEntityManager();
        Long pedidoId = null;
        try {
            Cliente c = em.find(Cliente.class, clienteId);
            if (!c.getPedidos().isEmpty()) {
                pedidoId = c.getPedidos().get(0).getId();
            }
        } finally {
            em.close();
        }
        return pedidoId;
    }

    private static void atualizarPedido(Long pedidoId, BigDecimal novoValor) {
        // 1. Recupera e fecha para ficar Detached
        Pedido detached;
        {
            EntityManager em1 = emf.createEntityManager();
            detached = em1.find(Pedido.class, pedidoId);
            em1.close(); // Detached
        }

        // 2. Ajuste no Detached
        detached.setValor(novoValor);

        // 3. Mesclagem (merge)
        EntityManager em2 = emf.createEntityManager();
        EntityTransaction tx2 = em2.getTransaction();
        try {
            tx2.begin();
            Pedido managed = em2.merge(detached); // Detached → Managed
            System.out.println("Pedido atualizado para: R$ " + managed.getValor());
            tx2.commit(); // UPDATE é executado
        } catch (Exception e) {
            if (tx2.isActive()) tx2.rollback();
            throw e;
        } finally {
            em2.close();
        }
    }

    private static void removerCliente(Long id) {
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Cliente c = em.find(Cliente.class, id); // Managed
            em.remove(c); // Managed → Removed (cascade exclui pedidos)
            tx.commit();
            System.out.println("Cliente removido com sucesso.");
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }
}

```

---

## 14. Sugestões para Aprofundamento

1. **Livros e Materiais Recomendados**
    - *Pro JPA 2 in Java EE 8* – Mike Keith e Merrick Schincariol.
    - *Java Persistence with Hibernate* – Christian Bauer, Gavin King, Gary Gregory.
2. **Documentação Oficial**
    - [Especificação JPA (Jakarta EE)](https://jakarta.ee/specifications/persistence/)
    - [Documentação Hibernate (caso use Hibernate como implementação)](https://hibernate.org/orm/documentation/)
3. **Artigos e Tutoriais Online**
    - “Understanding the JPA Entity Lifecycle” – exemplo passo a passo de transições de estado.
    - “Common Pitfalls of JPA” – cobra LazyInitializationException, N+1 selects, etc.
4. **Práticas Avançadas (para estudos futuros)**
    - Uso de **`PersistenceContextType.EXTENDED`** em componentes Stateful EJB.
    - Configurações de **second-level cache** no Hibernate (por exemplo, Ehcache, Infinispan).
    - Estratégias de **batch processing** (inserções e atualizações em massa).
    - Perfis de performance e tuning de consultas (análise de planos de execução SQL).

---

> Resumo Final:
> 
> 
> Este guia detalhou como o `EntityManager` no JPA gerencia o ciclo de vida de uma entidade — desde a instância **New** (Transient), sua transição para **Managed** (Persistent), os casos de **Detached** e a marcação para exclusão via **Removed**. Apresentamos conceitos, métodos principais, anotações associadas, práticas recomendadas e um exemplo completo que ilustra operações CRUD, enfatizando as transições de estado. Com este conhecimento, você poderá projetar aplicações Java baseadas em JPA de forma mais segura, eficiente e sustentável.
>