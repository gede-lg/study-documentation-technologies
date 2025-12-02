# Construção de uma Criteria

## EntityManager

### O que é e para que serve
O `EntityManager` é a principal interface no JPA que gerencia o ciclo de vida das entidades. É responsável por criar e remover instâncias de entidades, encontrar entidades por sua chave primária, e sincronizar o contexto de persistência com o banco de dados.

### Principais métodos no contexto da Criteria
- `getCriteriaBuilder()`: Cria uma instância de `CriteriaBuilder`, que é usada para construir `CriteriaQuery` objects.
- `createQuery(CriteriaQuery)`: Usado para criar uma `TypedQuery` a partir de uma `CriteriaQuery`.

#### Exemplo de Uso
```java
EntityManager em = entityManagerFactory.createEntityManager();
CriteriaBuilder cb = em.getCriteriaBuilder();
```

## EntityManagerFactory

### O que é e para que serve
O `EntityManagerFactory` é uma fábrica para criar instâncias de `EntityManager`. É normalmente configurado no início do aplicativo e existirá durante toda a vida útil do aplicativo.

### Principais métodos no contexto da Criteria
- `createEntityManager()`: Cria e retorna uma instância de `EntityManager`.

#### Exemplo de Uso
```java
EntityManagerFactory emf = Persistence.createEntityManagerFactory("persistence-unit");
EntityManager em = emf.createEntityManager();
```

## CriteriaBuilder

### O que é e para que serve
`CriteriaBuilder` é uma fábrica de vários objetos de critérios que são usados para construir uma consulta de critérios. Ele fornece métodos para criar instâncias de `CriteriaQuery`, bem como vários tipos de cláusulas e expressões.

### Principais métodos no contexto da Criteria
- `createQuery()`: Cria uma instância de `CriteriaQuery`.
- Métodos para criar expressões, predicados e outros critérios de consulta.

#### Exemplo de Uso
```java
CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<MyEntity> cq = cb.createQuery(MyEntity.class);
```

## CriteriaQuery

### O que é e para que serve
`CriteriaQuery` é usada para definir critérios para buscar objetos de entidade. É onde você define as cláusulas `SELECT`, `FROM`, `WHERE`, etc.

### Principais métodos no contexto da Criteria
- `from()`: Define a raiz da consulta (geralmente a tabela ou entidade).
- `select()`: Define o que será selecionado na consulta.
- `where()`: Define a cláusula `WHERE` da consulta.

#### Exemplo de Uso
```java
Root<MyEntity> myEntityRoot = cq.from(MyEntity.class);
cq.select(myEntityRoot);
cq.where(cb.equal(myEntityRoot.get("myAttribute"), "value"));
```

## Root

### O que é e para que serve
`Root` é um tipo especial de `Path` que define a origem da consulta, geralmente referindo-se a uma tabela no banco de dados. É usado para definir o ponto de entrada para a expressão de consulta.

### Principais métodos no contexto da Criteria
- `get()`: Usado para acessar um atributo da entidade.

#### Exemplo de Uso
```java
Root<MyEntity> myEntityRoot = cq.from(MyEntity.class);
Predicate predicate = cb.equal(myEntityRoot.get("myAttribute"), "value");
```

## Informações Adicionais e Tópicos Importantes

- **Tipos de Consulta**: Criteria API suporta vários tipos de consultas, incluindo seleção, agregação, e consultas com junções.
- **Segurança de Tipo**: Uma grande vantagem da Criteria API é a segurança de tipo, reduzindo erros em tempo de execução.
- **Dynamic Queries**: A Criteria API é ideal para construir consultas dinâmicas, onde os critérios de pesquisa podem mudar em tempo de execução.
- **Performance**: Embora poderosa, a Criteria API pode ser mais lenta que consultas JPQL ou SQL nativas em alguns casos, devido à sua complexidade e sobrecarga na construção de consultas.

Ao utilizar a Criteria API, é essencial compreender o ciclo de vida das entidades JPA e a maneira como as consultas são construídas e executadas.

 Isso garantirá a criação de consultas eficientes e manuteníveis.