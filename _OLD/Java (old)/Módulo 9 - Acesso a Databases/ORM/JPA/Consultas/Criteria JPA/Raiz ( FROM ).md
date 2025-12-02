# Cláusula FROM e suas Componentes Chave

A cláusula FROM em uma consulta da Criteria API define a(s) entidade(s) principal(is) sobre a(s) qual(is) a consulta é realizada. As classes componentes chaves para construir esta cláusula são:

1. **`Root<T>`**: Representa a raiz da consulta, ou seja, a tabela principal da qual os dados serão selecionados. É a partir do `Root` que você acessa as propriedades da entidade.

   ```java
   Root<MinhaEntidade> minhaEntidade = query.from(MinhaEntidade.class);
   ```

   - **Uso**: Utilizado para definir a entidade base da consulta e para acessar os atributos da entidade que serão utilizados nas cláusulas WHERE, SELECT, etc.

2. **`Join<Z, X>`**: Usado para especificar junções (JOINs) com outras entidades/tabelas. Pode representar um INNER JOIN, LEFT JOIN, etc.

   ```java
   Join<MinhaEntidade, OutraEntidade> join = minhaEntidade.join("outraEntidade");
   ```

   - **Uso**: Para realizar junções entre entidades, acessando atributos da entidade associada.

3. **`Fetch<Z, X>`**: Semelhante ao `Join`, mas é utilizado especificamente quando se deseja que os dados da entidade associada sejam carregados no mesmo SELECT (Eager Fetching).

   ```java
   Fetch<MinhaEntidade, OutraEntidade> fetch = minhaEntidade.fetch("outraEntidade");
   ```

   - **Uso**: Utilizado para otimizar o carregamento de entidades associadas, reduzindo o número de consultas ao banco de dados.

### Exemplo de Código: Construção da Cláusula FROM

```java
CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<MinhaEntidade> query = cb.createQuery(MinhaEntidade.class);
Root<MinhaEntidade> root = query.from(MinhaEntidade.class);

// Exemplo de JOIN
Join<MinhaEntidade, OutraEntidade> join = root.join("atributoRelacionado");

// Exemplo de FETCH
Fetch<MinhaEntidade, OutraEntidade> fetch = root

.fetch("atributoRelacionado");

TypedQuery<MinhaEntidade> typedQuery = em.createQuery(query);
List<MinhaEntidade> resultados = typedQuery.getResultList();
```

Neste exemplo, uma consulta é criada selecionando dados da `MinhaEntidade` e realizando um JOIN com `OutraEntidade`. O uso de `Root`, `Join`, e `Fetch` ilustra como a cláusula FROM é construída na Criteria API. É importante lembrar que a escolha entre `Join` e `Fetch` depende de como você deseja carregar os dados relacionados e do impacto no desempenho da consulta.