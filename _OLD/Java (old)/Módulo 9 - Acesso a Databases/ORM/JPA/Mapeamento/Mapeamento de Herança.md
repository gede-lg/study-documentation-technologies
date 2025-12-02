Vamos explorar detalhadamente os conceitos e anotações usados em JPA (Java Persistence API) e Hibernate, que são cruciais para o mapeamento de relacionamentos e estratégias de herança em aplicações Java que lidam com persistência de dados. As anotações e conceitos que abordaremos são fundamentais para definir como as entidades são mapeadas para a estrutura do banco de dados, permitindo que as operações de persistência sejam realizadas de maneira eficaz.

### @Inheritance

A anotação `@Inheritance` é usada para definir a estratégia de herança para uma classe de entidade. As propriedades desta anotação determinam como as classes herdeiras serão mapeadas para a base de dados.

- **strategy**: Define como as classes de entidade serão armazenadas na base de dados. Existem três estratégias principais:
  - `InheritanceType.SINGLE_TABLE`: Todas as classes da hierarquia de herança são mapeadas para uma única tabela. Uma coluna discriminadora é usada para diferenciar os diferentes tipos de entidades.
  - `InheritanceType.JOINED`: Cada classe na hierarquia é mapeada para uma tabela própria. As tabelas são unidas utilizando chaves estrangeiras.
  - `InheritanceType.TABLE_PER_CLASS`: Cada classe é mapeada para sua própria tabela, e a consulta nas subclasses requer a união das tabelas.

#### Exemplo de código:

```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_entidade", discriminatorType = DiscriminatorType.STRING)
public abstract class Veiculo { ... }

@Entity
@DiscriminatorValue("Carro")
public class Carro extends Veiculo { ... }

@Entity
@DiscriminatorValue("Moto")
public class Moto extends Veiculo { ... }
```

### @DiscriminatorColumn

A anotação `@DiscriminatorColumn` é usada com a estratégia `SINGLE_TABLE` de herança para diferenciar as linhas na tabela que correspondem a diferentes classes na hierarquia de herança.

- **name**: O nome da coluna discriminadora na tabela.
- **discriminatorType**: O tipo da coluna discriminadora. Pode ser `STRING`, `CHAR`, ou `INTEGER`.
- **columnDefinition**: Permite definir a SQL usada para criar esta coluna.
- **length**: Define o tamanho da coluna discriminadora, útil principalmente quando o tipo é `STRING`.

#### Exemplo de código:

```java
@DiscriminatorColumn(name = "tipo_entidade", discriminatorType = DiscriminatorType.STRING)
```

### @DiscriminatorValue

A anotação `@DiscriminatorValue` é usada para especificar o valor a ser armazenado na coluna discriminadora para linhas associadas a uma entidade específica na hierarquia de herança.

- **value**: O valor que identifica o tipo de entidade na coluna discriminadora.

#### Exemplo de código:

```java
@Entity
@DiscriminatorValue("Carro")
public class Carro extends Veiculo { ... }
```

### @MappedSuperclass

A anotação `@MappedSuperclass` é utilizada para indicar que a classe é uma superclasse mapeada e que suas propriedades devem ser herdadas pelas entidades filhas, mas não é ela própria uma entidade e, portanto, não será mapeada para uma tabela no banco de dados.

#### Exemplo de código:

```java
@MappedSuperclass
public abstract class EntidadeBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Outros atributos comuns
}
```

### @PrimaryKeyJoinColumn

`@PrimaryKeyJoinColumn` é usada para especificar uma coluna de chave primária que é usada como chave estrangeira para unir a entidade pai na estratégia de herança `JOINED`.

- **name**: Nome da coluna de chave primária na tabela filho.
- **referencedColumnName**: Nome da coluna de chave primária na tabela pai.

#### Exemplo de código:

```java
@Entity
@PrimaryKeyJoinColumn(name = "veiculo_id")
public class Carro extends Veiculo { ... }
```

### @EntityListeners

`@EntityListeners` é usada para especificar classes listener que devem ser notificadas de eventos de ciclo de vida de entidades, como persistência, remoção ou atualização.

- **value**: Uma ou mais classes listener que devem ser notificadas dos eventos de ciclo de vida da entidade.

#### Exemplo de código:

```java
@EntityListeners(MinhaClasseListener.class)
public class MinhaEntidade { ... }
```

