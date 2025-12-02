# Criteria API do JPA

A Criteria API é uma parte do Java Persistence API (JPA) que fornece uma maneira programática de criar e executar consultas de banco de dados, que são independentes do mecanismo de banco de dados. Vamos explorar como a Criteria API permite definir consultas através de operações e como usar restrições para construir a cláusula `WHERE` de uma consulta.

## Definição da Query através de Operações

### 1. **Criação do CriteriaBuilder e CriteriaQuery**

- **CriteriaBuilder**: É a fábrica para todos os componentes da Criteria API. É usado para construir `CriteriaQuery` e os elementos de restrição (`Predicates`).
  
  ```java
  CriteriaBuilder cb = entityManager.getCriteriaBuilder();
  ```

- **CriteriaQuery**: Representa uma consulta. É especificado o tipo de resultado esperado da consulta.
  
  ```java
  CriteriaQuery<EntityClass> cq = cb.createQuery(EntityClass.class);
  ```

### 2. **Selecionando a Raiz da Consulta (Root)**

- **Root<T>**: Representa a entidade que está sendo consultada. É o ponto de entrada para definir os critérios de seleção.
  
  ```java
  Root<EntityClass> root = cq.from(EntityClass.class);
  ```

### 3. **Construindo a Cláusula SELECT**

- Para selecionar a entidade inteira ou atributos específicos, utiliza-se `cq.select(root)` ou `cq.multiselect(root.get("attribute1"), root.get("attribute2"))`.

  ```java
  cq.select(root);
  ```

## Restrição (Construção da Cláusula WHERE)

### Componentes Chaves e Uso

1. **Predicate**: São as restrições aplicadas na consulta. O `CriteriaBuilder` fornece métodos para criar diferentes tipos de `Predicates`.

   - **equals, notEqual**: Compara igualdade ou diferença.
   - **gt, lt, ge, le**: Comparações maior que, menor que, maior ou igual, menor ou igual.
   - **like, notLike**: Padrões de string.
   - **in**: Verifica se o valor está dentro de um conjunto.
   - **isNull, isNotNull**: Checa por valores nulos ou não nulos.

   ```java
   Predicate predicateForName = cb.equal(root.get("name"), "John Doe");
   ```

2. **Conjunção e Disjunção**: `CriteriaBuilder` também fornece métodos para combinar `Predicates` usando operadores lógicos AND (`cb.and()`) e OR (`cb.or()`).

   ```java
   Predicate predicateForSalary = cb.gt(root.get("salary"), 1000);
   Predicate combinedPredicate = cb.and(predicateForName, predicateForSalary);
   ```

3. **Aplicando Restrições na Query**: As restrições são aplicadas à `CriteriaQuery` usando o método `where`.

   ```java
   cq.where(combinedPredicate);
   ```

## Executando a Consulta

- Após definir a consulta, ela é passada para o `EntityManager` para ser executada.

  ```java
  TypedQuery<EntityClass> query = entityManager.createQuery(cq);
  List<EntityClass> results = query.getResultList();
  ```

## Exemplo Completo

```java
CriteriaBuilder cb = entityManager.getCriteriaBuilder();
CriteriaQuery<Employee> cq = cb.createQuery(Employee.class);
Root<Employee> root = cq.from(Employee.class);

Predicate namePredicate = cb.equal(root.get("name"), "John Doe");
Predicate salaryPredicate = cb.gt(root.get("salary"), 1000);
Predicate combinedPredicate = cb.and(namePredicate, salaryPredicate);

cq.select(root).where(combinedPredicate);

TypedQuery<Employee> query = entityManager.createQuery(cq);
List<Employee> employees = query.getResultList();
```

Neste exemplo, a consulta seleciona todos os empregados chamados "John Doe" com salário maior que 1000.

## Considerações Finais

- **Tipos de Retorno**: A Criteria API permite definir consultas com diferentes tipos de retorno, incluindo entidades, valores únicos ou múltiplos (projeções), e resultados de funções de agregação.
- **Junções e Subconsultas**: É possível realizar junções entre entidades e criar subconsultas para consultas mais complexas.
- **Performance**: Enquanto a Criteria API oferece flexibilidade, é importante estar atento às implicações de desempenho, especialmente com consultas complexas e grandes volumes de dados.

A Criteria API é uma ferramenta poderosa do JPA que oferece flexibilidade e segurança na construção de

 consultas ao banco de dados, sendo essencial para desenvolvedores que trabalham com persistência de dados em aplicações Java.