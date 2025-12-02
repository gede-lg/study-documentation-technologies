# Criteria API: Projeções (SELECT)

## O que são Projeções?

Projeções em uma `Criteria` API são usadas para especificar quais campos ou propriedades de uma entidade devem ser retornados na consulta. Em vez de retornar entidades inteiras, as projeções permitem que você obtenha apenas os dados específicos necessários, o que pode melhorar a eficiência da consulta, especialmente quando lidando com grandes quantidades de dados ou tabelas com muitas colunas.

### Tipos de Projeções

- **Projeção Simples:** Retorna um único atributo ou campo.
- **Projeção Múltipla:** Retorna múltiplos atributos ou campos.
- **Projeção Agregada:** Aplica funções agregadas, como contar, somar, média, mínimo, máximo, etc.

## Exemplos de Métodos de Projeção

Aqui estão alguns exemplos de como usar projeções com a classe `Criteria`:

### Projeção Simples

```java
Session session = sessionFactory.openSession();
Criteria crit = session.createCriteria(Employee.class);
crit.setProjection(Projections.property("name"));
List<String> names = crit.list();
```

Neste exemplo, a projeção é configurada para retornar apenas o campo "name" da entidade `Employee`.

### Projeção Múltipla

```java
Session session = sessionFactory.openSession();
Criteria crit = session.createCriteria(Employee.class);
ProjectionList projList = Projections.projectionList();
projList.add(Projections.property("name"));
projList.add(Projections.property("salary"));
crit.setProjection(projList);
List<Object[]> results = crit.list();
```

Aqui, a projeção `ProjectionList` é usada para retornar múltiplos campos, especificamente "name" e "salary", de cada `Employee`.

### Projeção Agregada

#### Contagem

```java
Session session = sessionFactory.openSession();
Criteria crit = session.createCriteria(Employee.class);
crit.setProjection(Projections.rowCount());
Long count = (Long) crit.uniqueResult();
```

Este exemplo usa a projeção `rowCount` para contar o número de `Employee`.

#### Soma

```java
Session session = sessionFactory.openSession();
Criteria crit = session.createCriteria(Employee.class);
crit.setProjection(Projections.sum("salary"));
Double totalSalary = (Double) crit.uniqueResult();
```

Aqui, a projeção `sum` é usada para calcular a soma total dos salários dos `Employee`.

#### Mínimo e Máximo

```java
Criteria critMin = session.createCriteria(Employee.class);
critMin.setProjection(Projections.min("salary"));
Double minSalary = (Double) critMin.uniqueResult();

Criteria critMax = session.createCriteria(Employee.class);
critMax.setProjection(Projections.max("salary"));
Double maxSalary = (Double) critMax.uniqueResult();
```

Estes exemplos retornam o salário mínimo e máximo, respectivamente, entre todos os `Employee`.

## Métodos Comuns de Projeção

1. **`Projections.property(String propertyName)`**: Retorna o valor de uma propriedade específica.
   
   ```java
   Criteria crit = session.createCriteria(Employee.class);
   crit.setProjection(Projections.property("name"));
   List<String> names = crit.list();
   ```

2. **`Projections.count(String propertyName)`**: Realiza uma contagem de quantas vezes uma propriedade específica ocorre.
   
   ```java
   Criteria crit = session.createCriteria(Employee.class);
   crit.setProjection(Projections.count("id"));
   Long count = (Long) crit.uniqueResult();
   ```

3. **`Projections.avg(String propertyName)`**: Calcula a média dos valores de uma propriedade específica.
   
   ```java
   Criteria crit = session.createCriteria(Employee.class);
   crit.setProjection(Projections.avg("salary"));
   Double averageSalary = (Double) crit.uniqueResult();
   ```

4. **`Projections.max(String propertyName)`** e **`Projections.min(String propertyName)`**: Encontram o valor máximo e mínimo de uma propriedade, respectivamente.
   
   ```java
   Criteria critMax = session.createCriteria(Employee.class);
   critMax.setProjection(Projections.max("salary"));
   Double maxSalary = (Double) critMax.uniqueResult();

   Criteria critMin = session.createCriteria(Employee.class);
   critMin.setProjection(Projections.min("salary"));
   Double minSalary = (Double) critMin.uniqueResult();
   ```

5. **`Projections.sum(String propertyName)`**: Calcula a soma dos valores de uma propriedade.
   
   ```java
   Criteria crit = session.createCriteria(Employee.class);
   crit.setProjection(Projections.sum("salary"));
   Double totalSalary = (Double) crit.uniqueResult();
   ```

6. **`Projections.rowCount()`**: Retorna o número total de linhas.
   
   ```java
   Criteria crit = session.createCriteria(Employee.class);
   crit.setProjection(Projections.rowCount());
   Long totalRows = (Long) crit.uniqueResult();
   ```

7. **`Projections.groupProperty(String propertyName)`**: Usado para agrupar os resultados com base em uma propriedade.
   
   ```java
   Criteria crit = session.createCriteria(Employee.class);
   crit.setProjection(Projections.groupProperty("department"));
   List<String> departments = crit.list

();
   ```

#### Exemplos Adicionais de Projeções

Além dos métodos mencionados acima, a API Criteria oferece uma série de outras projeções, como `distinct`, `alias`, e `projectionList`, que permitem ainda mais flexibilidade na construção de consultas.

- **`Projections.distinct(Projection projection)`**: Retorna valores distintos para uma projeção específica.

  ```java
  Criteria crit = session.createCriteria(Employee.class);
  crit.setProjection(Projections.distinct(Projections.property("department")));
  List<String> distinctDepartments = crit.list();
  ```

- **`Projections.alias(Projection projection, String alias)`**: Permite atribuir um alias a uma projeção para facilitar a recuperação dos resultados.

  ```java
  Criteria crit = session.createCriteria(Employee.class);
  ProjectionList projList = Projections.projectionList();
  projList.add(Projections.property("name"), "employeeName");
  crit.setProjection(projList);
  crit.addOrder(Order.asc("employeeName"));
  List<Object[]> results = crit.list();
  ```

- **`Projections.projectionList()`**: Utilizado para combinar várias projeções.

  ```java
  Criteria crit = session.createCriteria(Employee.class);
  ProjectionList projList = Projections.projectionList();
  projList.add(Projections.property("name"));
  projList.add(Projections.property("salary"));
  crit.setProjection(projList);
  List<Object[]> nameAndSalaries = crit.list();
  ```

### Considerações Finais

- **Flexibilidade vs Complexidade**: Enquanto Projeções oferecem flexibilidade incrível na construção de consultas, elas podem adicionar uma camada de complexidade ao código. É essencial equilibrar a necessidade de consultas complexas com a manutenção da legibilidade e da simplicidade do código.
- **Performance**: Utilizar projeções pode melhorar significativamente a performance das consultas, especialmente ao buscar apenas campos específicos de uma entidade grande.
- **Tipagem**: Como as projeções podem retornar uma variedade de tipos de dados, é importante prestar atenção à tipagem ao processar os resultados.
- **Uso com Critérios e Restrições**: As projeções são frequentemente usadas em conjunto com outros recursos da API Criteria, como restrições (`Restrictions`), para construir consultas complexas.