# Definição do SELECT de uma Query

## Introdução

A Criteria API do Java Persistence API (JPA) é uma forma robusta e orientada a objetos de construir consultas em um banco de dados. Ela é especialmente útil para construir consultas dinâmicas em tempo de execução, onde os critérios podem variar com base em diferentes condições.

## Definição da Query

Quando usamos a Criteria API, definimos uma query por meio de uma série de operações e métodos que representam diferentes componentes de uma consulta SQL. Vamos nos concentrar na cláusula `SELECT`, uma das mais fundamentais em qualquer consulta.

### Componentes-Chave para Construção da Cláusula `SELECT`

1. **`CriteriaBuilder`**: É a fábrica para criar instâncias de `CriteriaQuery` e outros tipos de critérios. Usado para construir a estrutura da consulta e definir critérios, como condições de filtragem e funções de agregação.

2. **`CriteriaQuery`**: Representa uma consulta no nível superior. É aqui que definimos o tipo de resultado esperado (`SELECT`) e onde agregamos outras partes da consulta, como condições (`WHERE`), ordenações (`ORDER BY`), etc.

3. **`Root<T>`**: Representa a entidade principal ou a tabela na qual a consulta será realizada. É a partir do `Root` que acessamos os diferentes atributos da entidade que queremos selecionar ou onde aplicaremos condições.

4. **`Selection`**: Uma interface que define o que será selecionado. Pode ser um atributo da entidade, uma entidade inteira, um array de valores, ou construções mais complexas.

5. **`Predicate`**: Representa as condições ou expressões que são aplicadas na cláusula `WHERE`. São construídas a partir do `CriteriaBuilder` e aplicadas ao `CriteriaQuery`.

### Construindo a Cláusula `SELECT` com a Criteria API

Para ilustrar como construir a cláusula `SELECT` de uma query, vamos considerar um exemplo com uma entidade chamada `Employee`.

```java
// Exemplo de Entidade
@Entity
public class Employee {
    @Id
    private Long id;
    private String name;
    private String department;
    // getters e setters
}
```

#### Selecionando Tudo

```java
EntityManager em = ...; // Obter EntityManager
CriteriaBuilder cb = em.getCriteriaBuilder();

// Criação da CriteriaQuery para a entidade Employee
CriteriaQuery<Employee> cq = cb.createQuery(Employee.class);

// Definição do Root (a partir de qual entidade a consulta é feita)
Root<Employee> root = cq.from(Employee.class);

// Seleção da entidade inteira (equivalente a SELECT * em SQL)
cq.select(root);

// Execução da consulta
TypedQuery<Employee> query = em.createQuery(cq);
List<Employee> employees = query.getResultList();
```

Neste exemplo, `cq.select(root)` seleciona todos os atributos da entidade `Employee`. Podemos também selecionar atributos específicos ou usar construções mais complexas para definir o que queremos retornar.

#### Selecionando Atributos Específicos

```java
// Seleção de atributos específicos
CriteriaQuery<Object[]> cq = cb.createQuery(Object[].class);
Root<Employee> root = cq.from(Employee.class);
cq.multiselect(root.get("id"), root.get("name"));

TypedQuery<Object[]> query = em.createQuery(cq);
List<Object[]> results = query.getResultList();
```

Neste caso, `multiselect` é usado para selecionar múltiplos atributos específicos da entidade.

### Considerações Finais

A Criteria API oferece um meio flexível e seguro de tipo para construir consultas em JPA. O uso de métodos encadeados e a natureza orientada a objetos tornam a Criteria API uma ferramenta poderosa para consultas dinâmicas e complexas, especialmente em aplicações onde as consultas não podem ser definidas estaticamente.

Lembrando que, além da cláusula `SELECT`, outras partes de uma consulta, como `WHERE`, `JOIN`, `GROUP BY` e `ORDER BY`, são igualmente importantes e podem ser definidas com flexibilidade usando a Criteria API.