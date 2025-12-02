O Mapeamento Objeto-Relacional (ORM) é um método usado para fazer com que o código orientado a objetos em linguagens de programação possa interagir com bancos de dados relacionais. O JPA (Java Persistence API) é uma especificação do Java EE que oferece um modelo de mapeamento ORM para gerenciar dados relacionais em aplicações Java. O Hibernate é uma das implementações mais populares da JPA, oferecendo recursos adicionais em cima da especificação base.

## @Entity

A anotação `@Entity` é usada para marcar uma classe como uma entidade, o que significa que ela é mapeada para uma tabela no banco de dados. Essa anotação é parte fundamental do JPA e indica que a classe é uma entidade persistível.

### Propriedades

- `name`: Opcional. Define o nome da entidade. Se não for especificado, o nome da classe será usado.

Exemplo:

```java
@Entity
public class Usuario {
    // campos da entidade
}
```

### Propriedades de suas Propriedades

As entidades possuem propriedades que são mapeadas para colunas na tabela do banco de dados. Isso é feito através de anotações específicas, como `@Id`, `@Column`, `@ManyToOne`, entre outras.

- **@Id**: Identifica a chave primária da entidade.
- **@Column**: Mapeia um campo da entidade para uma coluna da tabela. Possui várias propriedades, como `name` (nome da coluna no banco de dados), `nullable` (indica se a coluna pode ser nula), `length` (comprimento da coluna, útil para strings), entre outras.
- **@ManyToOne**, **@OneToMany**, **@OneToOne**, **@ManyToMany**: Anotações que definem os relacionamentos entre as entidades.

## @Table

A anotação `@Table` é usada junto com `@Entity` para oferecer mais detalhes sobre a tabela no banco de dados à qual a entidade está mapeada.

### Propriedades

- **name**: O nome da tabela no banco de dados.
- **catalog**: O catálogo da tabela, opcional.
- **schema**: O esquema da tabela, opcional.
- **uniqueConstraints**: Define as restrições de unicidade para as colunas da tabela.
- **indexes**: Define os índices para as colunas da tabela.

Exemplo:

```java
@Entity
@Table(name = "usuarios", uniqueConstraints = {@UniqueConstraint(columnNames = {"email"})})
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    // outros campos e métodos
}
```
