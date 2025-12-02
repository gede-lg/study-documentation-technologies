# Tipos de Dados Suportados

---

## 1. Introdução

O *mapeamento de colunas* em JPA (Java Persistence API) é o processo pelo qual os atributos de uma classe Java são associados às colunas correspondentes em uma tabela de banco de dados relacional. Esse mapeamento é essencial para que a aplicação possa persistir e recuperar objetos Java do banco de dados de forma transparente, sem a necessidade de escrever SQL manualmente. No contexto de “**JPA no Java**”, entender quais tipos de dados Java podem ser traduzidos para tipos SQL — e de que forma — é fundamental para garantir integridade, performance e portabilidade entre diferentes SGBDs.

Este guia detalhado aborda:

- Os conceitos teóricos que embasam o mapeamento entre tipos Java e SQL.
- A sintaxe de uso das principais anotações (@Column, @Temporal, @Enumerated, @Lob etc.).
- Restrições e cenários em que certas conversões não são recomendadas.
- Elementos associados (anotações, classes, interfaces) que dão suporte ao mapeamento.
- Melhores práticas e exemplos completos que ilustram uma entidade JPA com diversos tipos de dado.

Ao final de cada seção, são sugeridos tópicos relacionados para aprofundamento.

---

## 2. Sumário

1. [Introdução](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#1-introdu%C3%A7%C3%A3o)
2. [Conceitos Fundamentais](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#3-conceitos-fundamentais)
3. [Sintaxe e Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#4-sintaxe-e-uso-se-aplic%C3%A1vel)
4. [Restrições de Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#5-restri%C3%A7%C3%B5es-de-uso)
5. [Elementos Associados](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#6-elementos-associados)
6. [Melhores Práticas e Casos de Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#7-melhores-pr%C3%A1ticas-e-casos-de-uso)
7. [Exemplos Completos](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#8-exemplos-completos)
8. [Sugestões de Tópicos Relacionados](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#9-sugest%C3%B5es-de-t%C3%B3picos-relacionados)

---

## 3. Conceitos Fundamentais

### 3.1 O que é mapeamento de colunas em JPA?

- **Definição:** Em JPA, cada classe anotada com `@Entity` representa uma tabela no banco de dados. Cada atributo (campo) dessa classe pode ser mapeado para uma coluna específica nessa tabela. O motor de persistência (por exemplo, Hibernate, EclipseLink) usa essas informações para gerar instruções SQL de inserção, atualização, deleção e consulta.
- **Propósito:**
    1. **Abstração do JDBC/SQL**: Desenvolvedores trabalham diretamente com objetos Java, sem precisar montar instruções SQL manualmente.
    2. **Portabilidade**: O mesmo código JPA pode funcionar em diferentes SGBDs (MySQL, PostgreSQL, Oracle etc.), pois os conversores internos adaptam o tipo Java ao tipo SQL adequado de cada dialeto.
    3. **Manutenção**: Alterações no modelo de domínio (evolução de classes) podem ser refletidas automaticamente no esquema de banco (usando *schema generation*), contanto que o mapeamento de colunas esteja corretamente declarado.

### 3.2 Mapeamento Implícito vs. Explícito

- **Implícito**:
    - Se nenhum mapeamento for informado, JPA assume que o nome da coluna é igual ao nome do atributo.
    - O tipo SQL será inferido pelo provedor JPA a partir do tipo Java. Ex.: `private String nome;` → `VARCHAR(255)` (ou equivalente).
- **Explícito**:
    - Usando a anotação `@Column(name = "TABELA_NOME", length = 100, nullable = false, precision = 10, scale = 2)` para definir detalhes como nome, tamanho, restrições de nulidade, precisão e escala.
    - Útil quando se deseja controle mais fino sobre o tipo de coluna gerada no banco (tamanho, nome diferente do atributo, constraints específicas etc.).

### 3.3 Conversão de Tipos (Data Type Conversion)

- JPA suporta automaticamente a maioria dos tipos primitivos e wrappers Java (`int/Integer`, `long/Long`, `double/Double`, `boolean/Boolean`, `String`, `BigDecimal`, etc.).
- Para tipos mais complexos (e.g. enums, datas Java 8, coleções, objetos embutidos), é necessário usar anotações específicas (`@Enumerated`, `@Temporal`, `@Convert`/`@Converter`) que direcionam como realizar a conversão para o tipo SQL correspondente.
- O provedor JPA, baseado no dialeto do banco de dados configurado, faz a tradução. Por exemplo, um `java.time.LocalDate` pode se tornar `DATE` no PostgreSQL ou `DATE` no MySQL, mas com nuances de formatação de data.

> Sugestão de tópicos relacionados:
> 
> - Fundamentos de ORM (Object-Relational Mapping)
> - Dialetos JPA (Hibernate Dialects)
> - Schema Generation em JPA

---

## 4. Sintaxe e Uso (se aplicável)

A seguir, mostramos como utilizar as principais anotações para mapear atributos de uma entidade JPA, garantindo que o tipo Java seja persistido corretamente no tipo SQL correspondente.

### 4.1 Estrutura Básica de uma Entidade JPA

```java
import jakarta.persistence.*;

@Entity
@Table(name = "pessoa")
public class Pessoa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Atributos mapeados abaixo
}

```

### 4.2 Mapeamento de Tipos Primitivos e Wrappers

Por padrão, JPA converte automaticamente os tipos primitivos e wrappers Java para tipos SQL adequados. Exemplos:

```java
@Column(name = "nome", length = 100, nullable = false)
private String nome;

@Column(name = "idade", nullable = false)
private Integer idade;

// O tipo BigDecimal é convertido para NUMERIC/DECIMAL no SQL
@Column(name = "salario", precision = 12, scale = 2)
private BigDecimal salario;

@Column(name = "ativo", nullable = false)
private Boolean ativo;

```

- **`String` → `VARCHAR(length)`** (padrão: 255 se `length` não for definido).
- **`Integer`/`int` → `INTEGER`** (ou `INT`).
- **`Long`/`long` → `BIGINT`**.
- **`Double`/`double` → `DOUBLE PRECISION`** ou dependendo do dialeto `FLOAT(53)`.
- **`BigDecimal` → `DECIMAL(precision, scale)`**.
- **`Boolean`/`boolean` → `BOOLEAN`** ou em alguns bancos `BIT(1)`.

### 4.3 Datas e Horários

### 4.3.1 Java Util Date / Calendar

```java
@Temporal(TemporalType.DATE)
@Column(name = "data_nascimento")
private Date dataNascimento;

@Temporal(TemporalType.TIMESTAMP)
@Column(name = "data_cadastro")
private Date dataCadastro;

```

- `@Temporal(TemporalType.DATE)` → Armazena somente data (ex.: `DATE`).
- `@Temporal(TemporalType.TIME)` → Armazena somente hora (ex.: `TIME`).
- `@Temporal(TemporalType.TIMESTAMP)` → Armazena data e hora (ex.: `TIMESTAMP` ou `DATETIME`).

> Importante: A partir do JPA 2.2, o uso de java.time.* (Java 8+) é nativo, dispensando @Temporal.
> 

### 4.3.2 Java 8 (java.time)

```java
@Column(name = "data_admissao")
private LocalDate dataAdmissao;

@Column(name = "hora_evento")
private LocalTime horaEvento;

@Column(name = "data_hora_evento")
private LocalDateTime dataHoraEvento;

@Column(name = "periodo_evento")
private OffsetDateTime periodoEvento;

```

Nesse caso, não há necessidade de `@Temporal`. O provedor JPA identifica automaticamente `LocalDate`, `LocalDateTime`, `LocalTime`, `OffsetDateTime` e gera o tipo SQL adequado, desde que o dialeto do banco suporte esses tipos (caso contrário, converte para `TIMESTAMP`).

### 4.4 Enums

Por padrão, enums Java podem ser persistidos como `ORDINAL` (inteiro correspondente à posição no `enum`) ou `STRING` (nome da constante). Deve-se explicitar usando `@Enumerated`.

```java
public enum StatusPedido {
    PENDENTE, APROVADO, CANCELADO;
}

@Entity
@Table(name = "pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private StatusPedido status;

    // ...
}

```

- **`EnumType.ORDINAL`** (padrão se não especificado):
    
    Persiste a ordem (0, 1, 2…). **Desvantagem**: se o `enum` mudar de ordem, corrompe dados.
    
- **`EnumType.STRING`**:
    
    Persiste o nome exato da constante (ex.: `'PENDENTE'`). Mais seguro, mas consome mais espaço.
    

### 4.5 LOBs (Large Objects)

Para colunas que armazenam textos muito grandes ou arquivos binários (BLOBs/CLOBs):

```java
@Lob
@Column(name = "texto_extenso", columnDefinition = "TEXT")
private String textoExtenso;

@Lob
@Column(name = "imagem", columnDefinition = "BLOB")
private byte[] imagem;

```

- **`@Lob` + `String`** → mapeia para `CLOB` ou `TEXT`.
- **`@Lob` + `byte[]`** → mapeia para `BLOB`.

### 4.6 Tipos Numéricos Específicos

- **`BigInteger`**: normalmente convertido para `NUMERIC` sem escala.
- **`BigDecimal`**: conforme mostrado em [4.2], usa `precision` e `scale`.
- **`Short`/`short`** → `SMALLINT`.
- **`Float`/`float`** → `REAL` ou `FLOAT(24)` (dependendo do dialeto).

```java
@Column(name = "pontuacao", precision = 5, scale = 2)
private BigDecimal pontuacao;

```

### 4.7 Objetos Embutidos (Embeddables)

Quando se tem um tipo complexo que precisa ser dividido em várias colunas:

```java
@Embeddable
public class Endereco {
    @Column(name = "rua", length = 100)
    private String rua;

    @Column(name = "cep", length = 8)
    private String cep;

    // ...
}

@Entity
@Table(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Embedded
    private Endereco endereco;

    // ...
}

```

Cada atributo de `Endereco` será mapeado para colunas da tabela `cliente` (por padrão, `rua`, `cep`). É possível customizar prefixos:

```java
@Embedded
@AttributeOverrides({
    @AttributeOverride(name = "rua", column = @Column(name = "end_rua")),
    @AttributeOverride(name = "cep", column = @Column(name = "end_cep"))
})
private Endereco endereco;

```

> Sugestão de tópicos relacionados:
> 
> - API de conversores customizados (`AttributeConverter`)
> - Tipos personalizados (UserType no Hibernate)
> - Projetos JPA: Hibernate vs. EclipseLink

---

## 5. Restrições de Uso

Existem cenários em que o mapeamento automático ou certas anotações não são recomendados:

1. **Tipos JSF/JavaScript (JSON, XML) embutidos**
    - Por padrão, JPA não sabe converter um atributo `Map<String, Object>` ou `JsonNode` para um tipo SQL `JSON` ou `XML`. Há necessidade de *conversores customizados* (ex.: usando `@Convert` e uma classe que implemente `AttributeConverter`).
    - Nem todos os bancos suportam tipos `JSON` nativamente. Ex.:
        - PostgreSQL: tem tipo `JSONB`.
        - MySQL: a partir da versão 5.7 suporta `JSON`.
        - Outros SGBDs não suportam diretamente, exigindo armazenamento como `CLOB` e serialização manual.
2. **Atributos Grandes em Memória**
    - Evite carregar *LOBs* enormes diretamente como `byte[]`, pois podem causar *OutOfMemoryError*. Prefira `java.sql.Blob` ou streams `InputStream`.
3. **Arquitetura Multiplataforma (Dialetos Divergentes)**
    - Dependendo do dialeto (Oracle, SQL Server, MySQL, PostgreSQL), um mesmo tipo Java pode virar SQL distinto (por exemplo `boolean` → `TINYINT(1)` no MySQL, mas `BOOLEAN` no PostgreSQL). Se você usar `columnDefinition` fixo (ex.: `columnDefinition="BOOLEAN"`), seu schema pode quebrar em outro SGBD.
    - **Recomendação:** Sempre que possível, confie no mapeamento implícito do provedor JPA ou utilize constantes específicas do dialeto.
4. **Enum com Ordinal em Evolução de Software**
    - Usar `EnumType.ORDINAL` pode funcionar inicialmente, mas se a ordem das constantes mudar (inserção de novos valores), dados antigos ficarão inconsistente. Prefira `EnumType.STRING` para cenários onde o *enum* possa evoluir.
5. **Coleções e Arrays**
    - JPA não mapeia diretamente `List<String>` para uma coluna simples. Para coleções, deve-se usar:
        - `@ElementCollection` (o que cria tabela auxiliar).
        - `@OneToMany` ou `@ManyToMany` (associação relacional).
        - Se deseja armazenar array em coluna única, usar `@Convert` + tipo específico do banco (por exemplo, Postgres `VARCHAR[]`).

> Sugestão de tópicos relacionados:
> 
> - `@Convert` e `AttributeConverter`
> - Tipos JSON em JPA (PostgreSQL, MySQL)
> - Performance e consumo de memória com LOBs

---

## 6. Elementos Associados

Para entender e aplicar corretamente o mapeamento de colunas em JPA, é preciso conhecer as anotações, interfaces e classes que dão suporte a esse mapeamento. A seguir, detalhamos as principais.

### 6.1 `@Entity` e `@Table`

- **`@Entity`**: Indica que a classe é uma entidade persistente. Deve estar presente em todas as classes cujo estado será salvo em banco de dados.
- **`@Table`**: Permite definir o nome da tabela no banco e configurar opções adicionais (como *uniqueConstraints*, *indexes* etc.).
    
    ```java
    @Entity
    @Table(name = "produto",
           uniqueConstraints = @UniqueConstraint(columnNames = {"sku", "loja_id"}))
    public class Produto { ... }
    
    ```
    

### 6.2 `@Id`, `@GeneratedValue` e Estratégias de Geração

- **`@Id`**: Marca o atributo que será a chave primária da tabela.
- **`@GeneratedValue(strategy = ...)`**: Define como será gerado o valor da chave. Exemplos:
    - `GenerationType.IDENTITY`: Usa auto-incremento nativo do banco (ex.: `SERIAL` no PostgreSQL, `AUTO_INCREMENT` no MySQL).
    - `GenerationType.SEQUENCE`: Usa sequência (Oracle, PostgreSQL).
    - `GenerationType.TABLE`: Usa tabela auxiliar para gerar PK — pouco usado, mas portável.
    - `GenerationType.AUTO`: O provedor escolhe a melhor estratégia.

```java
@Id
@GeneratedValue(strategy = GenerationType.SEQUENCE,
                generator = "seq_produto")
@SequenceGenerator(name = "seq_produto", sequenceName = "seq_produto", allocationSize = 1)
private Long id;

```

### 6.3 `@Column`

- **Função Principal:** Configurar nome da coluna, tamanho, restrições de nulidade, valores padrão etc.
- **Principais atributos:**
    - `name` (String): nome da coluna no banco.
    - `nullable` (boolean): se aceita `NULL` (padrão: `true`).
    - `unique` (boolean): se deve ter restrição de unicidade.
    - `length` (int): tamanho máximo (para `String`).
    - `precision` (int) e `scale` (int): para tipos numéricos (`BigDecimal`).
    - `columnDefinition` (String): define manualmente o tipo SQL (ex.: `"TEXT"`, `"BOOLEAN DEFAULT FALSE"`). **Atenção**: reduz portabilidade entre SGBDs.

```java
@Column(name = "descricao", length = 500, nullable = false)
private String descricao;

@Column(name = "preco", precision = 10, scale = 2, nullable = false)
private BigDecimal preco;

```

### 6.4 `@Enumerated`

- **`@Enumerated(EnumType.STRING)`** ou **`@Enumerated(EnumType.ORDINAL)`**.
- Imprescindível para mapear campos `enum`.

```java
@Enumerated(EnumType.STRING)
@Column(name = "tipo_conta", length = 20)
private TipoConta tipoConta;

```

### 6.5 `@Temporal`

- **Uso exclusivo para `java.util.Date` e `java.util.Calendar`.**
- Define se a coluna será `DATE`, `TIME` ou `TIMESTAMP`.

```java
@Temporal(TemporalType.TIMESTAMP)
@Column(name = "ultima_atualizacao")
private Date ultimaAtualizacao;

```

### 6.6 `@Lob` e `@Basic(fetch = FetchType.LAZY)`

- **`@Lob`**: Indica que o atributo deve ser tratado como “Large Object” (CLOB/BLOB).
- **`@Basic(fetch = FetchType.LAZY)`**: Em LOBs, é comum querer lazy‐loading, pois pode ser pesado carregar sempre.

```java
@Lob
@Basic(fetch = FetchType.LAZY)
@Column(name = "arquivo_pdf")
private byte[] arquivoPdf;

```

### 6.7 `@Embedded` e `@Embeddable`

- **`@Embeddable`**: Anotação em uma classe que será incorporada em outra entidade.
- **`@Embedded`**: Anotação no atributo da entidade que incorpora a classe *embeddable*.
- **`@AttributeOverride/@AttributeOverrides`**: Permitem customizar os nomes de colunas dos atributos embutidos.

```java
@Embeddable
public class Contato {
    @Column(name = "telefone", length = 15)
    private String telefone;

    @Column(name = "email", length = 100)
    private String email;
}

@Entity
public class Empresa {

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "telefone", column = @Column(name = "contato_telefone")),
        @AttributeOverride(name = "email", column = @Column(name = "contato_email"))
    })
    private Contato contato;
}

```

### 6.8 `@Convert` e `AttributeConverter`

- **Quando usar:** Para tipos Java não suportados diretamente (e.g., lista de Strings, JSON, enums mais complexos, classes próprias).
- **Interface `javax.persistence.AttributeConverter<X, Y>`**:
    - Método `convertToDatabaseColumn(X atributo)`: converte de Java (X) para SQL (Y).
    - Método `convertToEntityAttribute(Y dbData)`: converte de SQL (Y) para Java (X).

```java
// Converter que transforma List<String> em String CSV e vice-versa
@Converter
public class ListaStringConverter implements AttributeConverter<List<String>, String> {

    private static final String SEPARADOR = ";";

    @Override
    public String convertToDatabaseColumn(List<String> lista) {
        return (lista != null) ? String.join(SEPARADOR, lista) : null;
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        return (dbData != null && !dbData.isEmpty())
               ? Arrays.asList(dbData.split(SEPARADOR))
               : Collections.emptyList();
    }
}

// Uso na entidade
@Entity
public class Usuario {

    @Id @GeneratedValue
    private Long id;

    @Convert(converter = ListaStringConverter.class)
    @Column(name = "interesses", columnDefinition = "TEXT")
    private List<String> interesses;
}

```

> Sugestão de tópicos relacionados:
> 
> - `javax.persistence.AttributeConverter` na prática
> - User Types no Hibernate (para tipos ainda mais complexos)
> - MapStruct e DTOs para converter entre entidade e API

---

## 7. Melhores Práticas e Casos de Uso

### 7.1 Escolha do Tipo Adequado

1. **Inteiros pequenos (`byte`, `short`, `int`)**:
    - Prefira `Integer`/`int` a menos que haja necessidade de economia extrema de espaço.
    - Para contadores ou chaves, utilize `Long` quando a quantidade de registros puder exceder 2 bilhões.
2. **Números Decimais**:
    - Use `BigDecimal` sempre que precisar de precisão (ex.: valores monetários).
    - Evite `double`/`float` para valores financeiros, pois são *imprecisos* em operações de ponto flutuante.
3. **Datas e Horas**:
    - Prefira `java.time.LocalDate`, `LocalDateTime` e `OffsetDateTime` (Java 8+) a `java.util.Date`.
    - Garante melhor legibilidade e flexibilidade.
    - Configure o fuso horário do servidor e do banco adequadamente para evitar discrepâncias.
4. **Strings**:
    - Defina `length` apropriado. Ex.: `@Column(length = 200)` para campos do tipo `VARCHAR(200)`.
    - Para textos muito volumosos (artigos, descrições longas), use `@Lob` + `String` (que vira `CLOB`/`TEXT`).
5. **Enums**:
    - **`STRING`** é mais seguro e legível no banco.
    - Evite `ORDINAL` caso o *enum* possa evoluir.
6. **Coleções Simples**:
    - Se armazenar uma lista simples (ex.: `List<String>` de tags), prefira usar `@ElementCollection` em vez de converter para CSV.
    - Exemplo:
        
        ```java
        @ElementCollection
        @CollectionTable(name = "post_tags", joinColumns = @JoinColumn(name = "post_id"))
        @Column(name = "tag")
        private Set<String> tags = new HashSet<>();
        
        ```
        

### 7.2 Padronização e Conformidade

- **Nomes de Coluna Consistentes**:
    - Mantenha convenções, por exemplo, colunas em snake_case e entidades em PascalCase.
    - Facilita leitura e manutenção.
- **Uso Moderado de `columnDefinition`**:
    - Colocar diretamente `columnDefinition = "TEXT"` ou `"BOOLEAN DEFAULT FALSE"` pode quebrar portabilidade.
    - Se precisar de valor padrão, utilize recursos do provedor de *schema generation* ou migrações de banco (Flyway, Liquibase).
- **Validações no Modelo**:
    - Embora JPA não imponha validações (ej.: comprimento mínimo, regex), combine com a API Bean Validation (`javax.validation`) para garantir consistência antes de persistir.

### 7.3 Performance e Considerações de Carregamento

- **Carregamento de `@Lob` (CLOB/BLOB)**:
    - Use `fetch = FetchType.LAZY` para não trazer conteúdo pesado em toda consulta.
- **Comparação de Tipos**:
    - Evite usar `String` para valores fixos que poderiam ser enums.
    - Evita armazenar *flag* booleanas em `String` ("S"/"N") quando se pode usar `Boolean`.
- **Batch Inserts e Updates**:
    - Para grandes volumes de entidades com muitos campos, estruturas de colunas certas (por exemplo, colunas numéricas versus texto) podem influir em performance.
    - Habilite `hibernate.jdbc.batch_size` (ou equivalente) e certifique-se de que os tipos parametrizados batchem de forma otimizada.

> Sugestão de tópicos relacionados:
> 
> - Configuração de *Batch* no Hibernate
> - Bean Validation (JSR 380) integrado ao JPA
> - Estratégias de Cache (L1, L2) e impacto no mapeamento

---

## 8. Exemplos Completos

A seguir, um exemplo completo de uma entidade `Pedido` que demonstra vários dos conceitos vistos:

```java
package com.exemplo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ENUM armazenado como STRING
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private StatusPedido status;

    // BigDecimal com precisão e escala
    @Column(name = "valor_total", precision = 12, scale = 2, nullable = false)
    private BigDecimal valorTotal;

    // Data/hora de criação do pedido
    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    // Observações longas (CLOB/TEXT)
    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    // Relacionamento ManyToOne (cliente)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    // Exemplo de coleção simples usando ElementCollection
    @ElementCollection
    @CollectionTable(name = "pedido_itens", joinColumns = @JoinColumn(name = "pedido_id"))
    private List<ItemPedido> itens;

    // JSON armazenado em coluna TEXT via conversor customizado
    @Convert(converter = JSONMapConverter.class)
    @Column(name = "metadados", columnDefinition = "TEXT")
    private java.util.Map<String, Object> metadados;

    // Getters e Setters omitidos para brevidade

}

```

### 8.1 Detalhamento do Exemplo

1. **`@Entity` e `@Table(name = "pedido")`**
    - Cria a tabela `pedido`.
2. **Chave Primária (`@Id`, `@GeneratedValue`)**
    - Geração automática pelo banco via *identity*.
3. **Enum `status`**
    - Persistido como `VARCHAR(20)` usando `EnumType.STRING`.
4. **Valor Monetário (`BigDecimal valorTotal`)**
    - `precision=12, scale=2` → `DECIMAL(12,2)` no SQL.
5. **Data/Hora (`LocalDateTime dataCriacao`)**
    - Sem `@Temporal`, pois JPA 2.2 infere automaticamente. Resultado: `TIMESTAMP`.
6. **Observações (`@Lob String observacoes`)**
    - Armazena textos maiores (`CLOB`/`TEXT`). `fetch = LAZY` evita carregamento imediato.
7. **Relacionamento (`@ManyToOne Cliente cliente`)**
    - Campo `cliente_id` referencia PK de `Cliente`.
8. **Coleção de Itens (`@ElementCollection List<ItemPedido> itens`)**
    - `ItemPedido` deve ser `@Embeddable` contendo atributos (ex.: `produtoId`, `quantidade`, `precoUnitario`).
    - Cria tabela `pedido_itens(pedido_id, …)`.
9. **Conversor JSON (`@Convert JSONMapConverter`)**
    - Armazena um `Map<String, Object>` em `TEXT` (pode conter JSON serializado).
    - `JSONMapConverter` implementa `AttributeConverter<Map<String, Object>, String>`.

> Sugestão de tópicos relacionados:
> 
> - Exemplo de `@Embeddable` para `ItemPedido`
> - Como criar `JSONMapConverter` usando bibliotecas como Jackson ou Gson
> - Relacionamentos avançados: `@OneToMany`, `@ManyToMany`

---

## 9. Sugestões de Tópicos Relacionados

Ao finalizar este guia sobre “Mapeamento de colunas: Tipos de dados suportados (Java para SQL)” em **JPA no Java**, você pode se aprofundar nos seguintes temas para complementar seu conhecimento:

- **Attribute Converters Avançados**
    - Criação de conversores para tipos personalizados (ex.: criptografia de campos, formatos customizados, *encrypted columns*).
- **Extensões do Hibernate (UserType)**
    - Quando `AttributeConverter` é insuficiente, usar *UserType* para mapeio de tipos proprietários.
- **O Timbral da Evolução de Schemas (Flyway/Liquibase + JPA)**
    - Como integrar migrações de banco de dados versionadas a projetos JPA.
- **Performance de Tipos em Bancos de Dados**
    - Estudo sobre impacto de tipos (VARCHAR vs TEXT, DECIMAL vs DOUBLE) na performance de consultas e índices.
- **Collections e Mapas em JPA**
    - Uso de `@ElementCollection` com mapas (`Map<K,V>`) e listas, tabelas auxiliares, coleções embutidas.
- **Mecanismos de Cache (L1, L2) e Otimizações**
    - Impacto do mapeamento de colunas no cache de segundo nível do Hibernate.
- **Herança de Entidades e Mapeamento de Colunas**
    - Estratégias de herança JPA: `SINGLE_TABLE`, `JOINED`, `TABLE_PER_CLASS` e o impacto na estrutura de colunas.
- **Integração com Spring Data JPA**
    - Como o Spring Data JPA usa o mapeamento de colunas para gerar consultas automáticas (`@Query`, `Specifications`, `Querydsl`).
- **Configuração de Dialeto e Geração de Esquema**
    - Customização de `hibernate.dialect` e propriedades de geração automática de esquema (`ddl-auto`, `validation`, `update`).
- **Migração de `java.util.Date` para `java.time`**
    - Práticas recomendadas para atualizar código legado que usa `Date` e `Calendar` visando aproveitar as vantagens de `java.time`.

Esses tópicos permitem explorar tanto a parte conceitual quanto as particularidades de implementação para sistemas robustos e de alta performance. Viel Erfolg!