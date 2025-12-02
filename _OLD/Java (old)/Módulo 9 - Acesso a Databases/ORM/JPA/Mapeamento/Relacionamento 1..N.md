Vamos mergulhar nos detalhes do mapeamento de relacionamentos com JPA (Java Persistence API) e Hibernate, abordando especificamente as anotações `@OneToMany` e `@ManyToOne`, suas propriedades, e como utilizá-las em mapeamentos unidirecionais e bidirecionais. O JPA, com Hibernate como sua implementação, é uma poderosa ferramenta para mapear objetos Java em tabelas de banco de dados, permitindo a manipulação de dados de maneira orientada a objetos.

### @OneToMany

A anotação `@OneToMany` é usada para mapear uma associação de muitos para um. Isso significa que um lado do relacionamento contém uma coleção de entidades enquanto o lado oposto contém apenas uma referência de volta para a entidade "muitos".

**Propriedades:**

- `cascade`: Define as operações de cascata aplicadas ao relacionamento. Por exemplo, `CascadeType.ALL` significa que todas as operações (persist, remove, refresh, etc.) são propagadas do pai para as entidades filhas.
- `fetch`: Especifica se o relacionamento deve ser carregado de forma ansiosa (`EAGER`) ou preguiçosa (`LAZY`). `LAZY` é o valor padrão e significa que os dados serão carregados sob demanda.
- `mappedBy`: Indica o campo da entidade que possui o relacionamento, ou seja, o lado inverso do mapeamento.
- `orphanRemoval`: Se `true`, as entidades filhas são removidas automaticamente quando são desassociadas da entidade pai.
- `targetEntity`: Especifica a classe das entidades filhas. É útil principalmente quando a coleção é definida como uma coleção de elementos do tipo `Object`.

### @ManyToOne

A anotação `@ManyToOne` representa o lado "muitos" de uma relação muitos-para-um. Isso significa que várias instâncias dessa entidade estão associadas a uma única instância da entidade referenciada.

**Propriedades:**

- `cascade`: Similar ao `@OneToMany`, define as operações de cascata que são aplicadas ao relacionamento.
- `fetch`: Define se o relacionamento é carregado de forma `EAGER` ou `LAZY`.
- `optional`: Se `false`, a associação é obrigatória; caso contrário, é opcional. O valor padrão é `true`.
- `targetEntity`: Define explicitamente a classe da entidade do lado "um" do relacionamento.

### Exemplo de Mapeamento Unidirecional

Vamos considerar um relacionamento unidirecional entre `Pessoa` (um lado) e `Endereco` (muitos lados), onde uma pessoa pode ter vários endereços, mas um endereço está associado a apenas uma pessoa.

```java
@Entity
public class Pessoa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "pessoa_id") // chave estrangeira em Endereco
    private List<Endereco> enderecos = new ArrayList<>();
    
    // getters e setters
}

@Entity
public class Endereco {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String rua;

    // outros atributos e getters e setters
}
```

### Exemplo de Mapeamento Bidirecional

Considerando agora um relacionamento bidirecional entre `Postagem` (lado um) e `Comentario` (lado muitos), onde uma postagem pode ter vários comentários e cada comentário está associado a uma única postagem.

```java
@Entity
public class Postagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "postagem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comentario> comentarios = new ArrayList<>();

    // getters e setters
}

@Entity
public class Comentario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "postagem_id")
    private Postagem postagem;

    // outros atributos e getters e setters
}
```

Neste mapeamento bidirecional, usamos a propriedade `mappedBy` na entidade `Postagem` para indicar que o mapeamento é controlado pela entidade `Comentario` através do campo `postagem`.