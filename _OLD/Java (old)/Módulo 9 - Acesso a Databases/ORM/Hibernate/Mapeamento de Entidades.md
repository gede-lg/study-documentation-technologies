# Mapeamento de Entidades e Atributos

O mapeamento de entidades no Hibernate é o processo de definição de como uma classe Java se relaciona com uma tabela de banco de dados. Isso é feito principalmente através de anotações na classe.

### Anotações Básicas

#### `@Entity`
- Indica que a classe é uma entidade.
- Cada instância dessa classe corresponderá a uma linha na tabela.

#### `@Table`
- Especifica a tabela à qual a entidade está mapeada.
- Propriedades:
  - `name`: Nome da tabela no banco de dados.

#### `@Id`
- Identifica a chave primária da entidade.
- Cada entidade deve ter uma e apenas uma propriedade anotada com `@Id`.

#### `@GeneratedValue`
- Especifica como a chave primária é gerada.
- Propriedades:
  - `strategy`: Estratégia de geração de chave (AUTO, IDENTITY, SEQUENCE, TABLE).

#### `@Column`
- Mapeia uma propriedade para uma coluna da tabela.
- Propriedades:
  - `name`: Nome da coluna.
  - `length`: Comprimento da coluna.
  - `nullable`: Se a coluna pode ser nula.

#### `@Temporal`
- Converte a data e hora do Java para o tipo de data e hora do SQL.
- Propriedades:
  - `value`: Tipo de tempo (DATE, TIME, TIMESTAMP).

#### `@Transient`
- Indica que a propriedade não deve ser persistida no banco de dados.

## Exemplos de Código

### Exemplo de Classe de Entidade

```java
import javax.persistence.*;

@Entity
@Table(name = "pessoas")
public class Pessoa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Temporal(TemporalType.DATE)
    private Date dataNascimento;

    @Transient
    private int idade; // Não será persistido no banco de dados

    // Getters e Setters
}
```

Neste exemplo, `Pessoa` é uma entidade mapeada para a tabela `pessoas`. O campo `id` é a chave primária e é gerado automaticamente. `nome` é uma coluna na tabela, que não pode ser nula e tem um tamanho máximo de 100 caracteres. `dataNascimento` é uma data, mapeada para a coluna correspondente do tipo DATE no banco de dados. A propriedade `idade` é marcada como `@Transient`, indicando que

 ela não será persistida no banco de dados.

### Propriedades comuns (@Column)

**name:** Nome da coluna na tabela do banco de dados
que representa o atributo.

**unique:** Indica se a coluna na tabela será única. Por padrão, assume o valor false.

**nullable:** Indica se a coluna na tabela pode assumir valor nulo ou não. Por padrão, assume o valor true.

**length:** Tamanho máximo

**precision:** Precisão decimal

**insertable:** Indica se o atributo será inserido no momento da inserção. Por padrão assume o valor true.

**updatable:** indica se o atributo será atualizado no momento da atualização. Por padrão assume o valor true.

## Conclusão

As anotações do Hibernate facilitam o mapeamento de classes Java para tabelas de banco de dados, abstraindo muitos dos detalhes complexos do SQL. Elas permitem definir como as entidades são persistidas, recuperadas, e como suas relações são gerenciadas, proporcionando um meio eficiente e intuitivo de interagir com o banco de dados em aplicações Java. É importante entender o propósito e o uso de cada anotação para criar modelos de dados eficientes e adequados às necessidades do projeto.