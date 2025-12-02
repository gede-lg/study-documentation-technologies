# Native SQL do Hibernate

O Hibernate, como uma ferramenta ORM (Object-Relational Mapping), oferece suporte ao SQL Nativo, permitindo que você escreva consultas SQL diretamente e as integre com a manipulação orientada a objetos. Vamos explorar os aspectos-chave do SQL Nativo no Hibernate.

## Sintaxe SQL Nativo: Escrevendo Consultas Complexas

### Classes e Métodos Relevantes

- **Session**: Ponto de entrada para a execução de SQL Nativo. Use `session.createSQLQuery()` para criar uma `SQLQuery`.
- **SQLQuery**: Representa uma consulta SQL Nativa e permite especificar o tipo de retorno e parâmetros.

### Sintaxe Básica

```java
String sql = "SELECT * FROM tabela";
SQLQuery query = session.createSQLQuery(sql);
List resultados = query.list();
```

### Consultas Complexas

Para consultas mais complexas, você pode usar SQL Nativo completo, incluindo cláusulas como `WHERE`, `GROUP BY`, e `HAVING`.

## Joins e Subconsultas: Implementando em SQL Nativo

### Implementando Joins

Você pode realizar `JOINs` em SQL Nativo como faria em qualquer consulta SQL.

```java
String sql = "SELECT t.*, c.* FROM tabela t JOIN outra_tabela c ON t.id = c.tabela_id";
SQLQuery query = session.createSQLQuery(sql);
```

### Subconsultas

Subconsultas também são implementadas de forma padrão do SQL.

```java
String sql = "SELECT * FROM tabela WHERE id IN (SELECT tabela_id FROM outra_tabela)";
SQLQuery query = session.createSQLQuery(sql);
```

## Agregações e Funções: Usando Funções de Agregação e Funções Nativas do SQL

### Agregações

Use funções de agregação como `COUNT`, `SUM`, `AVG`, `MIN`, e `MAX`.

```java
String sql = "SELECT COUNT(*), AVG(preco) FROM produto";
SQLQuery query = session.createSQLQuery(sql);
```

### Funções Nativas do SQL

O Hibernate permite o uso de qualquer função nativa do seu banco de dados.

```java
String sql = "SELECT nome, LOWER(sobrenome) FROM cliente";
SQLQuery query = session.createSQLQuery(sql);
```

## Performance em Consultas: Dicas para Otimizar

### Índices

Certifique-se de que as tabelas estão devidamente indexadas nas colunas usadas nas cláusulas `WHERE`, `JOIN`, e `ORDER BY`.

### Fetching Estratégico

- **Fetch Join**: Use fetch joins para carregar objetos associados em uma única consulta.
- **Lazy Loading**: Carregue associações sob demanda, quando realmente forem necessárias.

### Cache

Utilize o cache de segundo nível e o cache de consultas do Hibernate para armazenar resultados de consultas frequentes.

### Otimizações de Consulta

- Use `EXPLAIN PLAN` para entender e otimizar o plano de execução da consulta.
- Evite subconsultas e joins desnecessários.
- Use projeções para carregar apenas as colunas necessárias.

### Exemplo de Otimização

```java
String sql = "SELECT id, nome FROM cliente WHERE id > :param";
SQLQuery query = session.createSQLQuery(sql);
query.setInteger("param", 100);
query.setCacheable(true); // Habilitando cache para esta consulta
```

## Conclusão

O SQL Nativo no Hibernate é uma ferramenta poderosa que oferece flexibilidade e controle, permitindo o uso de recursos específicos do banco de dados. No entanto, é essencial entender e aplicar as melhores práticas de otimização para garantir a eficiência e a performance do seu aplicativo. O uso combinado de técnicas ORM e SQL Nativo pode proporcionar um equilíbrio ideal entre flexibilidade e desempenho.

Além da abordagem clássica `SQLQuery query = session.createSQLQuery(sql);` para executar consultas SQL nativas no Hibernate, existem outras abordagens e métodos importantes que podem ser utilizados. Vamos explorá-los:

### 1. **Named Native Queries**

Named Native Queries são úteis quando você tem consultas SQL que serão reutilizadas em vários locais. Essas consultas são definidas em anotações em suas classes de entidade ou no arquivo XML de mapeamento do Hibernate e são identificadas por um nome único.

#### Definindo uma Named Native Query

```java
@Entity
@NamedNativeQuery(
    name = "findTodosByStatus",
    query = "SELECT * FROM Todo WHERE status = :status",
    resultClass = Todo.class
)
public class Todo {
    // Detalhes da classe
}
```

#### Usando a Named Native Query

```java
Query query = session.getNamedQuery("findTodosByStatus")
                     .setParameter("status", "PENDENTE");
List<Todo> todos = query.list();
```

### 2. **ResultSet Mapping**

Quando você precisa mapear os resultados de uma consulta SQL nativa para uma entidade ou um DTO (Data Transfer Object), você pode usar `ResultSetMapping`.

#### Definindo um ResultSet Mapping

```java
@SqlResultSetMapping(
    name = "todoMapping",
    entities = @EntityResult(
        entityClass = Todo.class,
        fields = {
            @FieldResult(name = "id", column = "id"),
            @FieldResult(name = "titulo", column = "titulo")
        }
    )
)
@Entity
public class Todo {
    // Detalhes da classe
}
```

#### Usando o ResultSet Mapping

```java
List<Todo> todos = session.createNativeQuery("SELECT id, titulo FROM Todo", "todoMapping").list();
```

### 3. **Query com Parâmetros**

Para consultas dinâmicas onde os parâmetros mudam, você pode usar a interface `Query` e definir parâmetros de forma programática.

#### Exemplo com Parâmetros

```java
String sql = "SELECT * FROM Usuario WHERE nome = :nomeUsuario";
Query query = session.createNativeQuery(sql)
                     .setParameter("nomeUsuario", "João");
List<Usuario> usuarios = query.list();
```

### 4. **Atualizações e Deletions**

SQL Nativo também pode ser usado para operações de atualização e deleção.

#### Exemplo de Atualização

```java
String sqlUpdate = "UPDATE Usuario SET ativo = false WHERE ultimo_login < :data";
int affectedRows = session.createNativeQuery(sqlUpdate)
                          .setParameter("data", LocalDate.now().minusMonths(1))
                          .executeUpdate();
```

### Considerações Finais

- A escolha do método depende da complexidade da consulta, da necessidade de reutilização e da estrutura de dados retornada.
- É importante lembrar que o uso de SQL nativo pode comprometer a portabilidade do banco de dados, uma vez que algumas consultas podem ser específicas de um SGBD.
- Sempre que possível, prefira o uso de JPQL ou HQL para manter a portabilidade e aproveitar os recursos de mapeamento do Hibernate.

O Hibernate oferece uma flexibilidade considerável ao lidar com SQL nativo, permitindo que os desenvolvedores escolham a abordagem mais adequada para cada cenário específico.