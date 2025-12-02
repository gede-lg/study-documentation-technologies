# Uso de @NamedQuery e @NamedQueries

---

## 1. Introdução

No contexto de aplicações Java que utilizam JPA (Java Persistence API) para gerenciamento de entidades e persistência em banco de dados, muitas vezes surgem cenários em que várias consultas (queries) JPQL/VARCHAR são reutilizadas em diferentes pontos da aplicação. Para evitar repetição de trechos de JPQL espalhados pelo código e facilitar a manutenção, o JPA oferece a possibilidade de definir **Named Queries**. Essas consultas são pré-definidas, identificadas por nome e associadas a classes de entidade por meio das anotações `@NamedQuery` ou `@NamedQueries`.

Em vez de escrever a string JPQL diretamente sempre que for necessário executá-la, basta invocar o Named Query pelo nome, tornando o código mais organizado, padronizado e menos propenso a erros de digitação ou inconsistências.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
    
    1.1. O que são Named Queries
    
    1.2. Vantagens e Propósito
    
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    
    2.1. Anotação `@NamedQuery`
    
    2.2. Anotação `@NamedQueries` (plural)
    
    2.3. Como invocar um Named Query via `EntityManager`
    
    2.4. Parâmetros em Named Queries
    
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cenarios-de-restricao-ou-nao-aplicacao)
4. [Componentes-Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    
    4.1. Anotação `@NamedQuery` / `@NamedQueries`
    
    4.2. Atributos importantes: `name`, `query`, `hints`
    
    4.3. Interfaces `Query` e `TypedQuery`
    
    4.4. `EntityManager.createNamedQuery(...)`
    
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-praticas-e-padroes-de-uso)
    
    5.1. Convenções de Nomes
    
    5.2. Organização de Named Queries (entidade vs XML)
    
    5.3. Cache de Consultas
    
    5.4. Quando usar Named Query vs Criteria API
    
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pratico-completo)
    
    6.1. Modelo de Entidade `Cliente` com Named Queries
    
    6.2. Classe de Acesso a Dados (DAO/Repository)
    
    6.3. Exemplo de Fluxo (persistindo e consultando)
    
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugestoes-para-aprofundamento)

---

## 3. Conceitos Fundamentais

### 3.1. O que são Named Queries

- **Named Query** é uma consulta (JPQL ou SQL nativo) definida de forma estática, associada a uma entidade JPA, identificada por um nome único (String).
- Em vez de construir dinamicamente a string JPQL toda vez que a consulta for necessária, o desenvolvedor anota a entidade com `@NamedQuery`, atribuindo-lhe um nome e uma string de consulta.
- O JPA carrega essas Named Queries no início da execução da aplicação (geralmente durante a leitura das entidades), compilando-as e armazenando-as em cache dentro do provedor de persistência.

### 3.2. Vantagens e Propósito

1. **Reutilização e Centralização**
    - Todas as consultas reutilizáveis ficam concentradas nas classes de entidade (ou em XML de mapeamento), evitando dispersão de strings JPQL pelo código.
2. **Manutenção Facilitada**
    - Alterações na consulta (por exemplo, ajuste de condições `WHERE`) são feitas num único lugar, sem a necessidade de varrer o código-fonte para localizar trechos semelhantes.
3. **Validação Antecipada**
    - Como o provedor de persistência (Hibernate, EclipseLink etc.) faz parsing/compilação das Named Queries durante a inicialização, eventuais erros de sintaxe JPQL são detectados cedo, evitando falhas em runtime quando a query for executada.
4. **Performance (cache de consulta)**
    - Alguns provedores de JPA mantêm cache de planos de execução para Named Queries, reduzindo overhead de parsing em cada chamada.
5. **Consistência de Nomes**
    - A adoção de uma convenção (ex.: `Entidade.findByXyz`) melhora a legibilidade do código, pois fica claro qual consulta está sendo executada.

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1. Anotação `@NamedQuery`

```java
@Entity
@NamedQuery(
    name  = "Cliente.findAll",
    query = "SELECT c FROM Cliente c"
)
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    // getters e setters omitidos para brevidade
}

```

- **Localização:**
    - A anotação `@NamedQuery` deve estar colocada **acima** da declaração da classe de entidade (ou imediata).
- **Atributos Principais:**
    - `name`: identificador único da Named Query (usado para invocá-la).
    - `query`: string JPQL que descreve a consulta.
- **Observação:**
    - O nome costuma seguir o padrão `"Entidade.operacao"` para manter consistência (neste exemplo, `"Cliente.findAll"`).

### Exemplo Comentado

```java
@Entity
@NamedQuery(
    name  = "Cliente.findByNome",
    query = "SELECT c FROM Cliente c WHERE c.nome = :nomeParametro"
)
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    // Construtores, getters e setters abaixo
}

```

- Aqui estamos definindo uma Named Query chamada `Cliente.findByNome` que retorna todos os objetos `Cliente` cujo atributo `nome` coincide com o parâmetro `:nomeParametro`.

### 4.2. Anotação `@NamedQueries` (plural)

Quando há mais de uma Named Query associada à mesma entidade, usamos `@NamedQueries`, que recebe um array de `@NamedQuery`:

```java
@Entity
@NamedQueries({
    @NamedQuery(
        name  = "Cliente.findAll",
        query = "SELECT c FROM Cliente c"
    ),
    @NamedQuery(
        name  = "Cliente.findByEmail",
        query = "SELECT c FROM Cliente c WHERE c.email = :emailParametro"
    ),
    @NamedQuery(
        name  = "Cliente.countAll",
        query = "SELECT COUNT(c) FROM Cliente c"
    )
})
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    // ...
}

```

- **`@NamedQueries`** funciona como contêiner, permitindo declarar múltiplos `@NamedQuery` de forma agrupada.
- A ordem em que se declaram não altera o resultado; desde que cada `name` seja único no contexto do persistence unit.

### 4.3. Como invocar um Named Query via `EntityManager`

Para executar uma Named Query definida em uma entidade, utilizamos o método `createNamedQuery` do `EntityManager`. Há duas variações principais:

1. **Retornando `Query` (não tipada)**
    
    ```java
    Query q = entityManager.createNamedQuery("Cliente.findAll");
    List<Cliente> lista = q.getResultList();
    
    ```
    
2. **Retornando `TypedQuery<T>` (tipada)**
    
    ```java
    TypedQuery<Cliente> tq = entityManager.createNamedQuery("Cliente.findAll", Cliente.class);
    List<Cliente> lista = tq.getResultList();
    
    ```
    

O uso de `TypedQuery` é recomendado pois evita a necessidade de casts e traz **verificação de tipos em tempo de compilação**.

### Invocando com Parâmetros

```java
// Supondo que exista Named Query "Cliente.findByEmail"
TypedQuery<Cliente> tq = entityManager.createNamedQuery("Cliente.findByEmail", Cliente.class);
tq.setParameter("emailParametro", "joao@example.com");
Cliente resultado = tq.getSingleResult();

```

- Se o Named Query tiver parâmetros declarados (ex.: `:emailParametro`), é necessário chamar `setParameter("nomeDoParametro", valor)` antes de `getResultList()` ou `getSingleResult()`.
- Caso não haja parâmetro, basta chamar `createNamedQuery` e `getResultList()`.

### 4.4. Parâmetros em Named Queries

- **Parâmetros nomeados**
    - Sintaxe: `:nomeParametro` dentro da string JPQL.
    - Ao invocar, usar `setParameter("nomeParametro", valor)`.
- **Parâmetros posicionais** (menos comum em Named Queries, pois exige concatenação exata)
    - Sintaxe: `?1`, `?2` etc.
    - Ao invocar, usar `setParameter(1, valor)`, `setParameter(2, outroValor)`.
- É recomendável **sempre** usar parâmetros nomeados pelos seguintes motivos:
    1. Melhor legibilidade.
    2. Evita erros de posição (por exemplo, trocar a ordem acidentalmente).
    3. Facilita reuso e refatoração.

---

## 5. Cenários de Restrição ou Não Aplicação

Apesar das vantagens, existem situações em que Named Queries podem não ser a melhor escolha:

1. **Consultas Altamente Dinâmicas**
    - Quando a consulta depende de múltiplas condições opcionais (e.g., filtros que podem ou não ser aplicados), a construção dinâmica de JPQL via `Criteria API` ou `StringBuilder` pode ser mais flexível.
    - Exemplo: Um formulário onde o usuário pode filtrar por nome, e-mail, data de cadastro e status (cada filtro é opcional). Criar várias Named Queries para todas as combinações seria inviável.
2. **Query com Texto Gerado em Runtime**
    - Em casos que a consulta precisa de cálculos ou concatenações específicas não conhecidas em tempo de compilação, tradicionalmente prefira criá-la “on‐the‐fly”.
    - Exemplo: ordenação dinâmica por diversos campos selecionados pelo usuário.
3. **Preferência por Criteria API em Ambientes Legados**
    - Se a equipe já adota fortemente `Criteria API` (JPA Criteria), talvez não se queira usar Named Queries, pois a lógica “tipo‐seguro” do Criteria pode ser preferida.
4. **Atualizações Frequentes da String de Query**
    - Sempre que a JPQL muda com muito frequência (por motivos de negócio), editar anotações exige recompilar a aplicação. Dependendo do ciclo de deploy, isso pode ser um empecilho.

---

## 6. Componentes-Chave Associados

### 6.1. Anotação `@NamedQuery` e `@NamedQueries`

- **`@NamedQuery`**
    - Definida em classe de entidade (annotated class).
    - Atributos obrigatórios:
        - `name` (String): nome único (geralmente no formato `"Entidade.acao"`).
        - `query` (String): consulta JPQL.
    - Atributo opcional:
        - `hints`: array de `QueryHint` (por ex.: cache, flush mode).
- **`@NamedQueries`**
    - Container que agrupa múltiplos `@NamedQuery`.
    - Atributo:
        - `value`: array de `@NamedQuery`.

### 6.2. Atributos Importantes

- **`name`**
    - Identificador único que será usado no método `createNamedQuery(name, ...)`.
    - Convenção sugerida: `<Classe>.<descricaoAcao>`, por ex.: `"Cliente.findByStatusAtivo"`.
- **`query`**
    - A string JPQL propriamente dita, começando por `SELECT ...` ou `UPDATE ...`.
    - Importante respeitar a sintaxe JPQL, usando nomes de entidades, não nomes de tabelas.
- **`hints` (opcional)**
    - Permite passar dicas ao provedor (ex.: forçar cache L2, flush mode, timeout).
    - Exemplo:
        
        ```java
        @NamedQuery(
          name  = "Cliente.findCached",
          query = "SELECT c FROM Cliente c",
          hints = {
            @QueryHint(name = "org.hibernate.cacheable", value = "true")
          }
        )
        
        ```
        

### 6.3. Interfaces `Query` e `TypedQuery`

- **`javax.persistence.Query`**
    - Tipo “não genérico”.
    - Métodos principais:
        - `List getResultList()`
        - `Object getSingleResult()`
        - `setParameter(String, Object)`, `setParameter(int, Object)`
- **`javax.persistence.TypedQuery<T>`**
    - Genérico. Exibe verificação de tipo em tempo de compilação.
    - Métodos principais:
        - `List<T> getResultList()`
        - `T getSingleResult()`
        - `setParameter(...)` (retorna `TypedQuery<T>`, permitindo encadeamento).

### 6.4. `EntityManager.createNamedQuery(...)`

- Sobrecargas:
    1. `createNamedQuery(String name)` retorna `Query`.
    2. `createNamedQuery(String name, Class<T> resultClass)` retorna `TypedQuery<T>`.
- Exemplo de uso:
    
    ```java
    // Sem tipagem (Query)
    Query q = em.createNamedQuery("Cliente.findAll");
    List resultados = q.getResultList();
    
    // Com tipagem (TypedQuery<Cliente>)
    TypedQuery<Cliente> tq = em.createNamedQuery("Cliente.findAll", Cliente.class);
    List<Cliente> listaClientes = tq.getResultList();
    
    ```
    

---

## 7. Melhores Práticas e Padrões de Uso

### 7.1. Convenções de Nomes

- Adotar padrão consistente para facilitar localização e manutenção:
    - **Entidade.Operacao** (ex.: `Cliente.findAll`, `Cliente.findByEmail`, `Pedido.countByStatus`).
    - Se houver filtros, incluir no nome:
        - `Cliente.findByNome`
        - `Pedido.findByClienteAndData`

### 7.2. Organização de Named Queries

1. **Anotação na Classe de Entidade**
    - Prático para consultas relacionadas diretamente àquela entidade.
    - Vantagem: coesão – a consulta está “ao lado” dos metadados.
2. **XML de Mapeamento (orm.xml)**
    - Em projetos onde se evita anotações, ou em ambientes com JPA puro sem uso de annotations, é possível definir Named Queries no arquivo `META-INF/orm.xml`.
    - Vantagem: separação total entre código e consultas; permite alterar consultas sem recompilação no caso de hot-deploy do XML (dependendo do provedor).
    - Exemplo de trecho em `orm.xml`:
        
        ```xml
        <entity class="com.exemplo.model.Cliente" name="Cliente">
          <named-query name="Cliente.findAll">
            <query>SELECT c FROM Cliente c</query>
          </named-query>
          <named-query name="Cliente.findByEmail">
            <query>SELECT c FROM Cliente c WHERE c.email = :emailParametro</query>
          </named-query>
        </entity>
        
        ```
        

### 7.3. Cache de Consultas

- **Segundo nível (L2)**
    - Alguns provedores (por ex. Hibernate) permitem habilitar cache de consultas para Named Queries.
    - Por exemplo, em Hibernate:
        
        ```java
        @NamedQuery(
          name  = "Cliente.findAll",
          query = "SELECT c FROM Cliente c",
          hints = {
            @QueryHint(name = "org.hibernate.cacheable", value = "true")
          }
        )
        
        ```
        
- Considerar o impacto:
    - Cache é ótimo para consultas que mudam pouco (por ex., lista de estados de um país).
    - Para dados muito voláteis, desabilitar o cache evita dados “obsoletos”.

### 7.4. Quando usar Named Query vs Criteria API

- **Named Query**
    - Útil para consultas estáticas e reutilizáveis.
    - Granularidade mais simples: `SELECT c FROM Cliente c WHERE c.status = :status`.
- **Criteria API**
    - Indicado para consultas dinâmicas com filtros condicionais.
    - Exemplo: Se vários filtros são opcionais, juntar condições (`cb.and(...)`) sem precisar criar várias Named Queries.
- **Boas práticas**
    - Use Named Query para operações CRUD frequentes e estáveis.
    - Use Criteria API ou JPQL construído dinamicamente para cenários de pesquisa avançada/exploratória onde os parâmetros variam.

---

## 8. Exemplo Prático Completo

A seguir, um exemplo de ponta a ponta que demonstra a criação de Named Queries, invocação, persistência de objetos e recuperação de dados.

### 8.1. Modelo de Entidade `Cliente` com Named Queries

```java
package com.exemplo.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "clientes")
@NamedQueries({
    @NamedQuery(
        name  = "Cliente.findAll",
        query = "SELECT c FROM Cliente c"
    ),
    @NamedQuery(
        name  = "Cliente.findByEmail",
        query = "SELECT c FROM Cliente c WHERE c.email = :emailParametro"
    ),
    @NamedQuery(
        name  = "Cliente.countAll",
        query = "SELECT COUNT(c) FROM Cliente c"
    )
})
public class Cliente implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    public Cliente() {
        // Construtor padrão necessário ao JPA
    }

    public Cliente(String nome, String email) {
        this.nome  = nome;
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

- **Observações**:
    1. Três Named Queries definidas:
        - `Cliente.findAll` → retorna todos os clientes.
        - `Cliente.findByEmail` → retorna cliente cujo e-mail é o parâmetro fornecido.
        - `Cliente.countAll` → retorna total de clientes.
    2. Todas anotadas com `@NamedQueries` para agrupar múltiplas queries.

### 8.2. Classe de Acesso a Dados (`ClienteDAO`)

```java
package com.exemplo.dao;

import com.exemplo.model.Cliente;

import javax.persistence.*;
import java.util.List;

public class ClienteDAO {

    private EntityManagerFactory emf;

    public ClienteDAO() {
        // 'persistencia-unit' deve estar configurado no persistence.xml
        this.emf = Persistence.createEntityManagerFactory("persistencia-unit");
    }

    private EntityManager getEntityManager() {
        return emf.createEntityManager();
    }

    // Persiste um novo cliente
    public Cliente salvar(Cliente cliente) {
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();

        try {
            tx.begin();
            em.persist(cliente);
            tx.commit();
            return cliente;
        } catch (RuntimeException e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e; // relançar exceção para tratamento externo
        } finally {
            em.close();
        }
    }

    // Atualiza cliente existente
    public Cliente atualizar(Cliente cliente) {
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();

        try {
            tx.begin();
            Cliente atualizado = em.merge(cliente);
            tx.commit();
            return atualizado;
        } catch (RuntimeException e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    // Remove cliente pelo ID
    public void remover(Long id) {
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();

        try {
            tx.begin();
            Cliente c = em.find(Cliente.class, id);
            if (c != null) {
                em.remove(c);
            }
            tx.commit();
        } catch (RuntimeException e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    // Recupera todos os clientes usando Named Query
    public List<Cliente> buscarTodos() {
        EntityManager em = getEntityManager();
        try {
            TypedQuery<Cliente> tq = em.createNamedQuery("Cliente.findAll", Cliente.class);
            return tq.getResultList();
        } finally {
            em.close();
        }
    }

    // Recupera um cliente pelo e-mail (Named Query com parâmetro)
    public Cliente buscarPorEmail(String email) {
        EntityManager em = getEntityManager();
        try {
            TypedQuery<Cliente> tq = em.createNamedQuery("Cliente.findByEmail", Cliente.class);
            tq.setParameter("emailParametro", email);
            return tq.getSingleResult();
        } catch (NoResultException e) {
            return null; // caso nenhum resulte encontrado
        } finally {
            em.close();
        }
    }

    // Conta total de clientes
    public Long contarTodos() {
        EntityManager em = getEntityManager();
        try {
            TypedQuery<Long> tq = em.createNamedQuery("Cliente.countAll", Long.class);
            return tq.getSingleResult();
        } finally {
            em.close();
        }
    }

    public void fecharFactory() {
        if (emf.isOpen()) {
            emf.close();
        }
    }
}

```

- **Pontos principais**:
    1. `createNamedQuery("Cliente.findAll", Cliente.class)` → invoca a Named Query `findAll`.
    2. `createNamedQuery("Cliente.findByEmail", Cliente.class)` + `setParameter("emailParametro", ...)` → invoca Named Query parametrizada.
    3. `createNamedQuery("Cliente.countAll", Long.class)` → invoca Named Query que retorna `Long`.

### 8.3. Exemplo de Fluxo (persistindo e consultando)

```java
package com.exemplo.app;

import com.exemplo.dao.ClienteDAO;
import com.exemplo.model.Cliente;

import java.util.List;

public class AplicacaoPrincipal {

    public static void main(String[] args) {
        ClienteDAO dao = new ClienteDAO();

        // 1. Persistir novos clientes
        Cliente c1 = new Cliente("Ana Silva", "ana@example.com");
        Cliente c2 = new Cliente("Bruno Santos", "bruno@example.com");
        dao.salvar(c1);
        dao.salvar(c2);

        // 2. Listar todos os clientes (usar Named Query "Cliente.findAll")
        List<Cliente> todos = dao.buscarTodos();
        System.out.println("===== Todos os Clientes =====");
        for (Cliente c : todos) {
            System.out.printf("ID: %d | Nome: %s | E-mail: %s%n", c.getId(), c.getNome(), c.getEmail());
        }

        // 3. Buscar por e-mail (usar Named Query "Cliente.findByEmail")
        String emailParaBuscar = "bruno@example.com";
        Cliente buscado = dao.buscarPorEmail(emailParaBuscar);
        if (buscado != null) {
            System.out.println("\nCliente encontrado:");
            System.out.printf("Nome: %s | E-mail: %s%n", buscado.getNome(), buscado.getEmail());
        } else {
            System.out.println("\nNenhum cliente encontrado com e-mail: " + emailParaBuscar);
        }

        // 4. Contar quantos clientes existem (usar Named Query "Cliente.countAll")
        Long total = dao.contarTodos();
        System.out.println("\nTotal de clientes no banco: " + total);

        // 5. Limpar recursos
        dao.fecharFactory();
    }
}

```

**Saída Esperada (exemplo):**

```
===== Todos os Clientes =====
ID: 1 | Nome: Ana Silva    | E-mail: ana@example.com
ID: 2 | Nome: Bruno Santos| E-mail: bruno@example.com

Cliente encontrado:
Nome: Bruno Santos | E-mail: bruno@example.com

Total de clientes no banco: 2

```

- O fluxo acima demonstra:
    1. Criação e persistência de duas instâncias de `Cliente`.
    2. Consulta de todos os clientes via `Cliente.findAll`.
    3. Consulta de cliente específico por e-mail via `Cliente.findByEmail`.
    4. Contagem de registros via `Cliente.countAll`.

---

## 9. Sugestões para Aprofundamento

1. **Documentação Oficial do JPA (JSR 338)**
    - Seção sobre *Named Queries*: descreve sintaxe, ciclo de vida e diferenças entre definições por anotação e XML.
2. **Especificação do Hibernate (caso use Hibernate)**
    - Hibernate Reference Guide traz detalhes sobre cache de consultas, dicas de performance (`@QueryHint`) e limitações específicas.
3. **Criteria API**
    - Para cenários onde Named Queries não se encaixam, estudar *Criteria API* (javax.persistence.criteria) para consultas dinâmicas tipo‐seguras.
4. **Recursos Online/Tutoriais**
    - Sites como Baeldung (baeldung.com) possuem diversos artigos práticos sobre *JPA Named Queries*, incluindo caches, herança de entidades e caso de uso em Spring Data JPA.
    - Documentação do Spring Data JPA para comparar Named Queries versus query methods automáticos.
5. **Exemplos de Dicas de Performance**
    - Estudar uso de `@QueryHint` (ex.: `org.hibernate.fetchSize`, `javax.persistence.query.timeout`) para otimizar consultas em grandes volumes de dados.

---

> Resumo Final:
> 
> 
> Em JPA, Named Queries (`@NamedQuery`/`@NamedQueries`) oferecem uma forma clara, reutilizável e validada de definir consultas JPQL em tempo de inicialização. São ideais para operações estáticas frequentes, promovendo organização e potencial otimização por cache. Entretanto, para consultas dinâmicas ou altamente parametrizadas, pode ser preferível usar *Criteria API* ou gerar JPQL em tempo de execução. Ao seguir convenções de nomes e boas práticas de organização, Named Queries tornam o código mais legível e fácil de manter.
>