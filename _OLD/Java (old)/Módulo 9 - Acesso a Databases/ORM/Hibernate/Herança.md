# Hibernate: Mapeamento de Entidades e Herança

## Mapeamento de Entidades

O mapeamento de entidades no Hibernate é o processo de definição de como uma classe Java se relaciona com uma tabela de banco de dados. As anotações do JPA (Java Persistence API) são frequentemente usadas para esse mapeamento.

### Exemplo Básico

```java
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    // Construtores, Getters e Setters
}
```

Neste exemplo, a classe `Usuario` é mapeada para a tabela `usuarios` no banco de dados.

## Mapeamento de Herança

No Hibernate, existem diferentes estratégias para mapear herança em classes Java para tabelas de banco de dados.

### Tabela por Hierarquia

Todas as classes na hierarquia são mapeadas em uma única tabela.

#### Exemplo:

```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo", discriminatorType = DiscriminatorType.STRING)
public abstract class Veiculo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fabricante;
}

@Entity
@DiscriminatorValue("Carro")
public class Carro extends Veiculo {
    private int numeroDePortas;
}

@Entity
@DiscriminatorValue("Moto")
public class Moto extends Veiculo {
    private boolean temSidecar;
}
```

Neste exemplo, `Carro` e `Moto` são mapeadas na mesma tabela `Veiculo`. A coluna `tipo` é usada para diferenciar entre as diferentes subclasses.

### Tabela por Classe Concreta

Cada classe concreta é mapeada para uma tabela diferente.

#### Exemplo:

```java
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Veiculo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String fabricante;
}

@Entity
public class Carro extends Veiculo {
    private int numeroDePortas;
}

@Entity
public class Moto extends Veiculo {
    private boolean temSidecar;
}
```

Aqui, `Carro` e `Moto` terão suas próprias tabelas separadas no banco de dados, com cada tabela cont

endo todas as colunas da classe pai e da classe filha.

### Tabela por Subclasse

Cada classe na hierarquia, incluindo a classe mãe, é mapeada para tabelas diferentes.

#### Exemplo:

```java
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Veiculo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fabricante;
}

@Entity
@PrimaryKeyJoinColumn(name = "veiculo_id")
public class Carro extends Veiculo {
    private int numeroDePortas;
}

@Entity
@PrimaryKeyJoinColumn(name = "veiculo_id")
public class Moto extends Veiculo {
    private boolean temSidecar;
}
```

Nesta abordagem, `Veiculo`, `Carro` e `Moto` são mapeadas em tabelas separadas. A tabela `Carro` e `Moto` terão uma chave estrangeira referenciando a tabela `Veiculo`.

### @Inheritance

Usada para definir a estratégia de herança em uma classe de entidade. As estratégias incluem `SINGLE_TABLE`, `TABLE_PER_CLASS` e `JOINED`.

### @DiscriminatorValue

Usado em conjunto com a estratégia `SINGLE_TABLE` para distinguir as diferentes subclasses na tabela.

### @MappedSuperclass

Esta anotação é usada para mapear uma superclasse que não é em si uma entidade. Isso é útil para definir campos ou métodos que são comuns a múltiplas entidades.

#### Exemplo:

```java
@MappedSuperclass
public abstract class BaseEntidade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Outros campos comuns
}

@Entity
public class Cliente extends BaseEntidade {
    private String nome;
}
```

### @PrimaryKeyJoinColumn

Especifica a coluna primária de junção para a estratégia de herança `JOINED`. É usada para definir qual coluna será usada como chave estrangeira.

## Conclusão

O mapeamento de herança no Hibernate permite representar a hierarquia de classes Java em tabelas de banco de dados de maneiras diferentes, cada uma com suas próprias vantagens e desvantagens. A escolha da estratégia de herança depende das necessidades específicas do projeto, da estrutura dos dados e do desempenho desejado. A compreensão desses conceitos é fundamental para criar um modelo de dados eficiente e eficaz em aplicações que utilizam o Hibernate.