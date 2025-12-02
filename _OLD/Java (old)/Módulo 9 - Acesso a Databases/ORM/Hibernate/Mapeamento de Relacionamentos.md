# Hibernate: Mapeamento de Entidades e Relacionamentos

O Hibernate é um framework ORM (Object-Relational Mapping) para Java, que facilita a mapeamento e gerenciamento de dados entre um banco de dados relacional e um modelo orientado a objetos.

## Mapeamento de Entidades

O mapeamento de entidades em Hibernate é realizado através de anotações ou arquivos XML. Uma entidade é basicamente uma classe Java que representa uma tabela no banco de dados.

### Exemplo Básico

```java
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Pessoa {
    @Id
    private Long id;
    private String nome;
    // Getters e Setters
}
```

## Mapeamento de Relacionamentos

### O que é Mapeamento Unidirecional

Mapeamento unidirecional significa que apenas uma entidade tem conhecimento e gerencia o relacionamento.

### O que é Mapeamento Bidirecional

Em um mapeamento bidirecional, ambas as entidades estão cientes uma da outra e podem gerenciar o relacionamento.

### One-to-One

#### Unidirecional

```java
@Entity
public class Usuario {
    @Id
    private Long id;
    private String nome;

    @OneToOne
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;
    // Getters e Setters
}

@Entity
public class Endereco {
    @Id
    private Long id;
    private String rua;
    // Getters e Setters
}
```

#### Bidirecional

```java
@Entity
public class Usuario {
    @Id
    private Long id;
    private String nome;

    @OneToOne(mappedBy = "usuario")
    private Endereco endereco;
    // Getters e Setters
}

@Entity
public class Endereco {
    @Id
    private Long id;
    private String rua;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    // Getters e Setters
}
```

### One-to-Many e Many-to-One

Estes relacionamentos são frequentemente usados juntos para formar um relacionamento bidirecional.

#### Unidirecional One-to-Many

```java
@Entity
public class Departamento {
    @Id
    private Long id;
    private String nome;

    @OneToMany
    @JoinColumn(name = "departamento_id")
    private Set<Funcionario> funcionarios;
    // Getters e Setters
}

@Entity
public class Funcionario {
    @Id
    private Long id;
    private String nome;
    // Getters e Setters
}
```

#### Bidirecional Many-to-One

```java
@Entity
public class Funcionario {
    @Id
    private Long id;
    private String nome;

    @ManyToOne
    @JoinColumn(name = "departamento_id")
    private Departamento departamento;
    // Getters e Setters
}
```

### Many-to-Many

#### Unidirecional

```java
@Entity
public class Aluno {
    @Id
    private Long id;
    private String nome;

    @ManyToMany
    @JoinTable(
      name = "aluno_curso",
      joinColumns = @JoinColumn(name = "aluno_id"),
      inverseJoinColumns = @JoinColumn(name = "curso_id")
    )
    private Set<Curso> cursos;
    // Getters e Setters
}

@Entity
public class Curso {
    @Id
    private Long id;
   

private String nome;
    // Getters e Setters
}
```

#### Bidirecional

```java
@Entity
public class Aluno {
    @Id
    private Long id;
    private String nome;

    @ManyToMany
    @JoinTable(
      name = "aluno_curso",
      joinColumns = @JoinColumn(name = "aluno_id"),
      inverseJoinColumns = @JoinColumn(name = "curso_id")
    )
    private Set<Curso> cursos;
    // Getters e Setters
}

@Entity
public class Curso {
    @Id
    private Long id;
    private String nome;

    @ManyToMany(mappedBy = "cursos")
    private Set<Aluno> alunos;
    // Getters e Setters
}
```

### Cascade

O atributo `cascade` define como as operações de persistência se propagam das entidades pai para as filhas. Por exemplo, se você persistir uma entidade pai, as entidades filhas também serão persistidas.

```java
@OneToMany(mappedBy = "departamento", cascade = CascadeType.ALL)
private Set<Funcionario> funcionarios;
```

### Lazy Loading

Lazy loading é uma estratégia para carregar dados sob demanda. Em Hibernate, isso significa que os dados de uma entidade relacionada não são carregados até que sejam explicitamente acessados.

```java
@OneToMany(fetch = FetchType.LAZY, mappedBy = "departamento")
private Set<Funcionario> funcionarios;
```

### Join Column

`@JoinColumn` especifica a coluna usada para juntar uma entidade associada.

```java
@ManyToOne
@JoinColumn(name = "departamento_id")
private Departamento departamento;
```

### Tabelas Intermediárias e Join Table

Em um relacionamento Many-to-Many, é comum usar uma tabela intermediária para mapear o relacionamento. `@JoinTable` especifica essa tabela.

```java
@ManyToMany
@JoinTable(
  name = "aluno_curso",
  joinColumns = @JoinColumn(name = "aluno_id"),
  inverseJoinColumns = @JoinColumn(name = "curso_id")
)
private Set<Curso> cursos;
```

## Conclusão

O mapeamento de entidades e relacionamentos no Hibernate é uma parte fundamental do framework, permitindo aos desenvolvedores manipular dados em um banco de dados relacional de uma maneira orientada a objetos. Compreender as várias formas de mapeamento e suas implicações é crucial para o desenvolvimento eficiente e eficaz de aplicações Java que utilizam Hibernate.