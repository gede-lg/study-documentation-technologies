## O que é e para que serve?

A Criteria API é uma parte do Java Persistence API (JPA) que permite construir consultas de banco de dados de forma programática e tipo-segura. Ela serve para criar consultas em JPA sem a necessidade de escrever consultas na linguagem de consulta estruturada (SQL) ou na Java Persistence Query Language (JPQL). Isso permite maior flexibilidade e segurança, pois os erros podem ser capturados em tempo de compilação em vez de em tempo de execução.

## Criteria API do JPA: Um Guia Detalhado

A Criteria API do Java Persistence API (JPA) é uma ferramenta poderosa para construir consultas de banco de dados de forma programática e tipada, oferecendo uma alternativa às consultas JPQL ou SQL. Vamos explorar detalhadamente seus estágios, componentes-chave e operações.

## Printando a Query

```java
// Obter a sessão do Hibernate a partir do EntityManager
Session session = em.unwrap(Session.class);

// Converter a CriteriaQuery em uma string SQL
String sql = session.createQuery(cq).unwrap(org.hibernate.query.Query.class).getQueryString();

// Imprimir a string SQL
System.out.println(sql);
```

# Estágios de uma Criteria

## Construção da Query

**Componentes-chave e suas funções:**

1. **`EntityManager`**: Serve como a principal interface para a persistência do contexto. Responsável por criar instâncias de `CriteriaQuery` e `CriteriaBuilder`.

   ```java
   EntityManager em = entityManagerFactory.createEntityManager();
   ```

2. **`EntityManagerFactory`**: Responsável pela criação do `EntityManager`. Geralmente é criado no início da aplicação.

   ```java
   EntityManagerFactory emf = Persistence.createEntityManagerFactory("persistence-unit");
   ```

3. **`CriteriaBuilder`**: Utilizado para construir `CriteriaQuery`. É a fábrica para critérios específicos como `Predicates`, `Expressions`, etc.

   ```java
   CriteriaBuilder cb = em.getCriteriaBuilder();
   ```

## Definição da Query

**Componentes-chave e suas funções:**

1. **`CriteriaQuery`**: Representa uma consulta de critérios. É usada para definir a estrutura e os elementos da consulta.

   ```java
   CriteriaQuery<Entity> cq = cb.createQuery(Entity.class);
   ```

2. **`Root`**: Representa a entidade raiz na consulta, da qual se originam os caminhos de navegação.

   ```java
   Root<Entity> root = cq.from(Entity.class);
   ```

### Tipos de Operações

1. **Seleção e Projeção**

   - **`CriteriaQuery.select()`**: Define o que será retornado pela consulta.

     ```java
     cq.select(root);
     ```

   - **`CriteriaBuilder.construct()`**: Usado para projeção de DTOs (Data Transfer Objects).

     ```java
     cq.select(cb.construct(DTO.class, root.get("attribute")));
     ```

2. **Restrições**

   - **`Predicate` e `CriteriaBuilder`**: Usados para definir condições na cláusula WHERE.

     ```java
     Predicate condition = cb.equal(root.get("attribute"), value);
     cq.where(condition);
     ```

3. **Paginação**

   - **`TypedQuery`**: Utilizado para executar a query com limites de paginação.

     ```java
     TypedQuery<Entity> query = em.createQuery(cq)
                                  .setFirstResult(startPosition)
                                  .setMaxResults(maxResults);
     ```

4. **Ordenação e Agregação**

   - **`CriteriaBuilder` e `CriteriaQuery`**: Usados para definir ordenações (`orderBy`) e funções de agregação (`groupBy`, `having`).

     ```java
     cq.orderBy(cb.asc(root.get("attribute")));
     ```

5. **Associação e Junções**

   - **`Join` e `Root`**: Utilizados para especificar junções com outras entidades.

     ```java
     Join<Entity, AssociatedEntity> join = root.join("associatedEntity");
     ```

## Execução da Query

**Componentes-chave e suas funções:**

1. **`TypedQuery`**: Executa a consulta `CriteriaQuery` e retorna o resultado.

   ```java
   TypedQuery<Entity> query = em.createQuery(cq);
   List<Entity> results = query.getResultList();
   ```

### Observações Adicionais

- **Consultas Dinâmicas**: A Criteria API é excelente para construir consultas dinâmicas onde os critérios são alterados em tempo de execução.
- **Tipagem Forte**: Reduz o risco de erros em tempo de execução devido à natureza tipada da API.
- **Integração com JPA**: Totalmente integrada com o JPA, facilitando o uso de entidades e gerenciamento de contexto de persistência.

### Exemplo de Código: Consulta Simples

```java
EntityManager em = emf.createEntityManager();
CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<Employee> cq = cb.createQuery(Employee.class);
Root<Employee> root = cq.from(Employee.class);

Predicate condition = cb.equal(root.get("department"), "IT");
cq.select(root).where(condition);

TypedQuery<Employee> query = em.createQuery(cq);
List<Employee> employees = query.getResultList();
```

Este exemplo mostra uma consulta simples para selecionar funcionários de um departamento específico. A Criteria API permite a construção de consultas mais complexas e adaptáveis a diferentes necess

idades, tornando-se uma ferramenta valiosa para desenvolvedores JPA.