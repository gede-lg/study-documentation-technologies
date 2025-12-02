# HQL (Hibernate Query Language)

## Introdução a HQL

HQL, ou Hibernate Query Language, é uma linguagem de consulta orientada a objetos utilizada em Hibernate para manipular dados armazenados em um banco de dados relacional. Ela é similar em muitos aspectos ao SQL tradicional, mas opera em termos de objetos Hibernate, suas propriedades e classes, ao invés de tabelas e colunas.

## Classe Query

A classe `Query` em Hibernate é usada para realizar consultas HQL. Ela oferece uma variedade de métodos para manipular os resultados das consultas e para controlar sua execução.

### Métodos da Classe Query

#### `setParameter`

Define um parâmetro na consulta HQL.

```java
Query query = session.createQuery("from User u where u.id = :userId");
query.setParameter("userId", 1);
```

#### `setFirstResult` e `setMaxResults`

Usados para implementar paginação.

```java
query.setFirstResult(0); // índice inicial
query.setMaxResults(10); // número máximo de resultados
```

#### `list`

Executa a consulta e retorna os resultados.

```java
List<User> users = query.list();
```

#### `uniqueResult`

Retorna um único resultado ou `null`.

```java
User user = (User) query.uniqueResult();
```

#### `executeUpdate`

Usado para executar operações de atualização ou exclusão.

```java
int result = session.createQuery("delete User where id = :userId")
                    .setParameter("userId", 1)
                    .executeUpdate();
```

## Sintaxe e Características de HQL

### Sintaxe Básica

A sintaxe de HQL é bastante similar ao SQL. Por exemplo, uma consulta básica em HQL para selecionar todos os objetos de uma classe `User` é:

```java
String hql = "from User";
Query query = session.createQuery(hql);
List<User> users = query.list();
```

### Consultas com Condições

Você pode adicionar condições usando a cláusula `where`:

```java
String hql = "from User u where u.lastName = 'Doe'";
Query query = session.createQuery(hql);
List<User> users = query.list();
```

### Consultas Avançadas

#### Join

HQL suporta várias formas de `join` para associar classes.

```java
String hql = "select u from User u INNER JOIN u.roles r";
```

#### Subquery

Subqueries são consultas dentro de outras consultas.

```java
String hql = "from User u where u.salary > (select avg(salary) from User)";
```

## Agregações e Funções

HQL fornece funções de agregação semelhantes ao SQL, como `count`, `sum`, `avg`, `min`, `max`.

### Exemplo de Função de Agregação

```java
String hql = "select count(*) from User";
Query query = session.createQuery(hql);
Long count = (Long) query.uniqueResult();
```

### Group By e Having

Agrupar resultados e aplicar condições sobre os grupos é possível com `group by` e `having`.

```java
String hql = "select r.role, count(u) from User u join u.roles r

 group by r.role having count(u) > 1";
Query query = session.createQuery(hql);
List<Object[]> results = query.list();
```

## Exemplos de Consultas Complexas

### Consulta com Múltiplas Condições e Ordenação

```java
String hql = "from User u where u.age > 18 and u.salary < 50000 order by u.salary desc";
Query query = session.createQuery(hql);
List<User> users = query.list();
```

### Join com Condições Específicas

```java
String hql = "select u from User u join u.roles r where r.name = 'Admin'";
Query query = session.createQuery(hql);
List<User> admins = query.list();
```

### Utilizando Funções de String

```java
String hql = "from User u where upper(u.firstName) = 'JOHN'";
Query query = session.createQuery(hql);
List<User> usersNamedJohn = query.list();
```

### Consulta com Fetch Join para Carregamento Imediato

```java
String hql = "from User u join fetch u.roles";
Query query = session.createQuery(hql);
List<User> usersWithRoles = query.list();
```

## Conclusão

HQL é uma ferramenta poderosa que permite a execução de consultas complexas e manipulação de dados em um banco de dados usando Hibernate de uma maneira orientada a objetos. Ela oferece flexibilidade e um conjunto de recursos que facilitam a execução de operações de banco de dados sem se afastar dos paradigmas de programação orientada a objetos. Ao dominar HQL, desenvolvedores podem aproveitar o poder do Hibernate para construir aplicações robustas e eficientes com Java.