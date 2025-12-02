# Consultas no Hibernate

## O que é e para que serve?

As consultas no Hibernate são usadas para recuperar e manipular dados de um banco de dados relacional de uma maneira orientada a objetos. Hibernate oferece diferentes maneiras de realizar consultas, permitindo que os desenvolvedores escolham a abordagem mais adequada conforme a necessidade.

## Tipos de Consultas

### HQL (Hibernate Query Language)

- Linguagem de consulta orientada a objetos, similar em aparência ao SQL.
- Permite escrever consultas independentes do banco de dados, focando nas entidades e seus relacionamentos.

### Criteria API

- API programática para definir consultas de forma tipo-segura.
- Útil para construir consultas dinâmicas em tempo de execução.

### Native SQL

- Permite escrever consultas SQL nativas.
- Útil quando se necessita de recursos específicos do banco de dados que não são suportados pelo HQL ou Criteria API.

## Tabela de Comparação

| Característica         | HQL                       | Criteria API                   | Native SQL                       |
|------------------------|---------------------------|--------------------------------|----------------------------------|
| **Tipo de Consulta**   | Orientada a Objetos       | Programática e Tipo-Segura     | SQL Nativo                       |
|**Independência do BD** | Alta                      | Alta                           | Baixa                            |
| **Complexidade**       | Média                     | Alta (mais verbosa)            | Variável (depende do SQL)        |
| **Uso Dinâmico**       | Limitado                  | Excelente                      | Limitado                         |
| **Performance**        | Boa                       | Boa (pode ser mais lenta)      | Excelente (específica do BD)     |

## Quando Usar Cada Tipo de Consulta?

### HQL

- Quando a independência do banco de dados é uma prioridade.
- Ideal para consultas orientadas a objetos e consultas complexas.
- Menos adequado para construir consultas dinâmicas.

### Criteria API

- Recomendado para consultas dinâmicas onde os parâmetros mudam em tempo de execução.
- Boa escolha quando a tipo-segurança e a manutenção do código são importantes.
- Pode ser mais verbosa para consultas simples.

### Native SQL

- Utilizado quando se necessita de recursos específicos do banco de dados.
- Recomendado para otimização de desempenho em consultas complexas.
- Útil quando se migra de um sistema que já utiliza SQL nativo.

## Parâmetros de Consulta

As consultas no Hibernate podem usar parâmetros para tornar a consulta mais flexível e segura. Existem dois tipos principais de parâmetros:

### Parâmetro Pos

icional (?)

- Usa um ponto de interrogação (?) para marcar o local do parâmetro.
- A ordem dos parâmetros é importante.

### Exemplo HQL com Parâmetro Posicional:

```java
String hql = "FROM Employee E WHERE E.id = ?";
Query query = session.createQuery(hql);
query.setParameter(0, 10); // O índice começa em 0
List results = query.list();
```

### Parâmetro Nomeado (:`<argumento>`)

- Usa dois-pontos seguidos por um nome (por exemplo, `:nome`).
- Mais legível e menos propenso a erros devido à ordem dos parâmetros.

### Exemplo HQL com Parâmetro Nomeado:

```java
String hql = "FROM Employee E WHERE E.id = :employee_id";
Query query = session.createQuery(hql);
query.setParameter("employee_id", 10);
List results = query.list();
```

## Exemplo de Criteria API:

```java
CriteriaBuilder cb = session.getCriteriaBuilder();
CriteriaQuery<Employee> cr = cb.createQuery(Employee.class);
Root<Employee> root = cr.from(Employee.class);
cr.select(root).where(cb.equal(root.get("id"), 10));

Query<Employee> query = session.createQuery(cr);
List<Employee> results = query.getResultList();
```

## Exemplo de Native SQL:

```java
String sql = "SELECT * FROM EMPLOYEE WHERE ID = 10";
SQLQuery query = session.createSQLQuery(sql);
query.addEntity(Employee.class);
List results = query.list();
```

## Conclusão

A escolha entre HQL, Criteria API e Native SQL no Hibernate depende de vários fatores, como a necessidade de independência do banco de dados, a complexidade da consulta, a necessidade de consultas dinâmicas e a familiaridade com SQL. O uso de parâmetros nas consultas é uma prática recomendada para aumentar a flexibilidade e a segurança. Cada método tem suas vantagens e desvantagens, e o entendimento de quando usar cada um é crucial para o desenvolvimento eficiente e eficaz com o Hibernate.