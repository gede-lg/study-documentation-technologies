# Associação ( JOIN )

A Criteria API do JPA permite criar consultas tipadas e dinâmicas em aplicações Java, oferecendo uma alternativa ao uso de strings de consulta JPQL. Um aspecto fundamental da Criteria API é o tratamento de associações entre entidades, especialmente ao construir cláusulas JOIN. Vamos explorar as classes-chave envolvidas e como utilizá-las.

### Classes Chave para Associação

1. **`CriteriaBuilder`**: Utilizado para construir `CriteriaQuery` e definir critérios. Cria instâncias de `Predicate` para condições e `Join` para associações.

2. **`CriteriaQuery`**: Representa a consulta. Define a seleção, cláusulas FROM, WHERE, JOIN, ORDER BY, etc.

3. **`Root<T>`**: Ponto de entrada para a entidade principal da consulta. Usado para definir o ponto de partida da navegação nas associações.

4. **`Join<Z, X>`**: Representa uma associação entre duas entidades (Z e X). Usado para especificar joins entre entidades.

5. **`Fetch<X, Y>`**: Semelhante ao `Join`, mas usado especificamente para operações de fetch (carregamento de associações).

### Construindo Cláusula JOIN

Para construir uma cláusula JOIN, você precisa primeiro obter uma instância de `Join` do `Root` ou de um `Join` anterior, especificando a associação. Por exemplo, para juntar `Employee` e `Department`:

```java
CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<Employee> cq = cb.createQuery(Employee.class);
Root<Employee> employee = cq.from(Employee.class);

// Realizando um JOIN
Join<Employee, Department> departmentJoin = employee.join("department");
```

## Tipos de JOIN

A Criteria API suporta diferentes tipos de JOIN, correspondendo às operações de JOIN no SQL.

### INNER JOIN

Retorna registros quando há pelo menos uma correspondência em ambas as tabelas.

```java
Join<Employee, Department> departmentJoin = employee.join("department", JoinType.INNER);
```

### LEFT JOIN (LEFT OUTER JOIN)

Retorna todos os registros da tabela esquerda e os registros correspondentes da tabela direita.

```java
Join<Employee, Department> departmentJoin = employee.join("department", JoinType.LEFT);
```

### RIGHT JOIN (RIGHT OUTER JOIN)

Retorna todos os registros da tabela direita e os registros correspondentes da tabela esquerda.

```java
Join<Employee, Department> departmentJoin = employee.join("department", JoinType.RIGHT);
```

### FULL JOIN (FULL OUTER JOIN)

Retorna todos os registros quando há uma correspondência em uma das tabelas.

```java
// A Criteria API não suporta diretamente FULL JOIN, mas pode ser simulado combinando LEFT e RIGHT JOINS.
```

## Fetch

Fetch é usado na Criteria API para otimizar o carregamento de associações, especialmente para evitar o problema N+1 em consultas ORM. 

### Usando Fetch

Você pode usar `fetch` em vez de `join` para buscar associações juntamente com a entidade principal:

```java
Fetch<Employee, Department> departmentFetch = employee.fetch("department", JoinType.LEFT);
```

O `fetch` garante que os dados associados sejam carregados juntamente com a entidade principal, o que pode ser mais eficiente em termos de desempenho.

## Considerações Adicionais

- **Predicates**: Use `CriteriaBuilder` para criar restrições e filtros na sua consulta.
- **Projeções**: Use `select` e `multiselect` para especificar as colunas ou entidades que você deseja retornar.
- **Agregações e Agrupamentos**: A Criteria API também suporta funções de agregação e cláusulas `groupBy` e `having`.

## Exemplo de Código Completo

```java
EntityManager em = ...;
CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<Employee> cq = cb.createQuery(Employee.class);
Root<Employee> employee = cq.from(Employee.class);

// JOIN
Join<Employee, Department> departmentJoin = employee.join("department", JoinType.LEFT);

// Adicionando condições
Predicate condition = cb.equal(departmentJoin.get("name"), "IT");
cq.where(condition);

// Executando a consulta
TypedQuery<Employee> query = em.createQuery(cq);
List<Employee> resultList = query.getResultList();
```

Este exemplo ilustra uma consulta simples que une `Employee` e `Department`, filtrando por departamentos com o nome "IT".

 A Criteria API oferece uma abordagem robusta e flexível para construir consultas complexas em JPA.