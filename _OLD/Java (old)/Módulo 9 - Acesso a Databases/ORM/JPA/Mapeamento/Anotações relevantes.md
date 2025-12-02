### @JoinTable

A anotação `@JoinTable` é usada para definir uma tabela de junção para relacionamentos muitos-para-muitos (`ManyToMany`) ou para customizar os detalhes de uma tabela de junção usada em relacionamentos um-para-muitos (`OneToMany`) ou muitos-para-um (`ManyToOne`).

#### Propriedades de @JoinTable:

- **name**: Nome da tabela de junção.
- **catalog**: Nome do catálogo da tabela de junção.
- **schema**: Nome do esquema da tabela de junção.
- **joinColumns**: Define a(s) coluna(s) da tabela que está do lado "possuidor" do relacionamento.
- **inverseJoinColumns**: Define a(s) coluna(s) da tabela do lado inverso do relacionamento.
- **uniqueConstraints**: Define as restrições únicas para a tabela de junção.
- **indexes**: Define os índices para a tabela de junção.
- **foreignKey**: Define a chave estrangeira da tabela de junção que aponta para a entidade proprietária do relacionamento.
- **inverseForeignKey**: Define a chave estrangeira da tabela de junção que aponta para a entidade do lado inverso do relacionamento.

#### Exemplo de uso:

```java
@Entity
public class Student {
    @ManyToMany
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
}

@Entity
public class Course {
    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
}
```

### @JoinColumn

A anotação `@JoinColumn` é utilizada para especificar a coluna que será usada para o mapeamento de chaves estrangeiras. É amplamente usada em relacionamentos `@ManyToOne`, `@OneToOne`, e `@OneToMany`.

#### Propriedades de @JoinColumn:

- **name**: Nome da coluna de chave estrangeira.
- **referencedColumnName**: Nome da coluna na tabela referenciada.
- **unique**: Se a coluna de chave estrangeira é única.
- **nullable**: Se a coluna de chave estrangeira pode ser nula.
- **insertable**: Se a coluna de chave estrangeira pode ser incluída em operações de inserção.
- **updatable**: Se a coluna de chave estrangeira pode ser incluída em operações de atualização.
- **columnDefinition**: A definição SQL da coluna usada ao criar a tabela.
- **table**: A tabela que contém a coluna de chave estrangeira quando o mapeamento não aplica à tabela principal.
- **foreignKey**: Define a chave estrangeira associada a esta coluna.

#### Exemplo de uso:

```java
@Entity
public class Order {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
}
```

### @MapsId

A anotação `@MapsId` é utilizada para mapear a chave primária de uma entidade com a chave estrangeira de outra entidade, útil em relacionamentos `@OneToOne` ou `@ManyToOne` onde as entidades compartilham a mesma chave primária.

#### Propriedades de @MapsId:

- **value**: O nome do atributo dentro da entidade composta que será mapeado. Se não especificado, o atributo mapeado assume o mesmo nome da chave primária da entidade.

#### Exemplo de uso:

Suponha que temos um `Employee` e um `EmployeeDetails` compartilhando a mesma chave primária.

```java
@Entity
public class Employee {
    @Id
    private Long id;
    
    @OneToOne
    @MapsId
    private EmployeeDetails details;
}

@Entity
public class EmployeeDetails {
    @Id
    private Long id;
    
    // Detalhes adicionais
}
```

### @Where

Esta anotação adiciona uma cláusula SQL WHERE a todas as consultas que envolvem a entidade. Ou seja, a anotação `@Where` é usada para aplicar uma cláusula SQL WHERE adicional às consultas que envolvem a entidade ou coleção. Isso é útil para filtrar as entidades ou elementos da coleção.

- **clause**: A cláusula SQL WHERE a ser aplicada.

#### Exemplo de código:

```java
@Entity
@Where(clause = "ativo = true")
public class UsuarioAtivo { ... }
```

### Observações Adicionais

- **Entendendo as relações**: É crucial entender as diferenças entre os tipos de relações (`@OneToOne`, `@ManyToOne`, `@OneToMany`, `@ManyToMany`) e quando usá-los, levando em conta a direcionalidade (unidirecional vs. bidirecional