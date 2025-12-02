# Aliases e Identificadores: Uso, Regras de Nomenclatura e Boas Práticas

---

## 1. Introdução

Em **JPQL (Java Persistence Query Language)**, assim como em SQL, é comum utilizar **aliases** (apelidos) para facilitar a referência a entidades, atributos ou expressões complexas dentro de uma consulta. Esses aliases não servem apenas para tornar a escrita das queries mais concisa, mas também para evitar ambiguidades quando há múltiplas ocorrências da mesma entidade ou relacionamentos encadeados.

Além disso, a **nomenclatura de identificadores** em JPQL (nomes de entidades, atributos, aliases etc.) segue regras específicas de **case-sensitive** e **correspondência exata** com os nomes definidos nas classes ou nos mapeamentos do JPA. Isso assegura que a consulta seja corretamente interpretada pelo provider JPA (Ex.: Hibernate, EclipseLink, etc.) antes de ser convertida em SQL.

Nesta explanação, abordaremos de forma sistemática como utilizar aliases e quais regras de nomenclatura devem ser observadas, incluindo exemplos de código comentados, melhores práticas e um exemplo prático completo.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. [Alias para Entidades (Declaração no FROM)](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#alias-para-entidades)
    2. [Alias em JOINs](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#alias-em-joins)
    3. [Alias em Clauses (SELECT, WHERE, ORDER BY)](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#alias-em-clauses)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    1. [Anotações e Classes do JPA](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#anota%C3%A7%C3%B5es-e-classes-do-jpa)
    2. [Métodos e Interfaces de Query](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#m%C3%A9todos-e-interfaces-de-query)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

1. **Alias (Apelido)**
    - Em JPQL, um *alias* é um nome curto atribuído a uma entidade, relacionamento ou expressão, usado ao longo da query para referenciar esse elemento de forma mais legível.
    - Em consultas SQL, por exemplo, costuma-se fazer `SELECT u.nome FROM Usuario u`, onde `u` é o alias para a entidade `Usuario`.
    - Vantagens de usar aliases:
        - Reduz a verbosidade quando as entidades possuem nomes longos.
        - Evita ambiguidades em joins e subconsultas, quando duas entidades do mesmo tipo aparecem mais de uma vez.
        - Facilita a leitura e manutenção.
2. **Identificadores e Regras de Nomenclatura**
    - Os identificadores em JPQL incluem:
        - **Nome da entidade** (definido via `@Entity(name = "NomeEntidade")` ou, na ausência de `name`, pelo nome da classe).
        - **Nome do atributo** (exatamente como declarado no `@Column` ou no campo/propriedade Java, respeitando case-sensitive).
        - **Alias** (escolhido pelo desenvolvedor, porém deve obedecer regras de identificador Java: letras, dígitos e underscore; não pode começar com dígito; e *case-sensitive*).
    - A correspondência entre identificador em JPQL e nome mapeado no JPA é **exata**.
        - Exemplo: se a classe se chama `PedidoVenda` e não houve `@Entity(name = "...")`, o JPQL deve usar `FROM PedidoVenda p` (exatamente “PedidoVenda”).
        - Se no `@Entity(name = "Venda")` foi configurado, então a consulta deve usar `FROM Venda v`, e não mais `PedidoVenda`.
    - Palavras-chave do JPQL (p. ex. `SELECT`, `FROM`, `WHERE`) não são case-sensitive, mas os identificadores **são**.
3. **Escopo de um Alias**
    - Um alias declarado em uma subconsulta não está disponível fora dela.
    - Um alias em `FROM` pode ser usado em `SELECT`, `WHERE`, `GROUP BY`, `HAVING` e `ORDER BY` dentro do mesmo nível hierárquico da query.

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1 Alias para Entidades (Declaração no FROM)

Na cláusula `FROM`, definimos o alias da entidade logo após mencioná-la. Esse alias será usado para referenciar a entidade em toda a query.

```java
// Entidade Java de exemplo:
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    private Long id;

    private String nome;
    private String email;
    // getters e setters...
}

```

```java
// Exemplo de Query JPQL com alias
String jpql = "SELECT u FROM Usuario u";
// Comentário:
//   - "Usuario" é o identificador da entidade (name= “Usuario” por padrão).
//   - "u" é o alias escolhido para referenciar a entidade Usuario.
//   - Em seguida, podemos usar "u.nome", "u.email" etc.

```

### Detalhes e variações:

- Se você for usar um alias diferente, basta substituí-lo desde a declaração:
    
    ```java
    String jpql = "SELECT x FROM Usuario x";
    
    ```
    
- Se a anotação `@Entity` possuir um `name` customizado:
    
    ```java
    @Entity(name = "Pessoa")
    public class Usuario { ... }
    
    // Para essa entidade, a JPQL passa a ser:
    String jpql = "SELECT p FROM Pessoa p";
    
    ```
    

---

### 4.2 Alias em JOINs

Em consultas envolvendo relacionamentos, usamos aliases tanto para a entidade principal quanto para a entidade relacionada.

Assuma que `Usuario` possui um relacionamento `@OneToMany` para `Pedido`:

```java
@Entity
public class Pedido {
    @Id
    private Long id;

    private BigDecimal valor;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    // getters e setters...
}

@Entity
public class Usuario {
    @Id
    private Long id;

    private String nome;

    @OneToMany(mappedBy = "usuario")
    private List<Pedido> pedidos;
    // getters e setters...
}

```

### Exemplo de consulta com JOIN e ALIAS:

```java
String jpql = "SELECT u, p "
            + "FROM Usuario u "
            + "JOIN u.pedidos p "
            + "WHERE p.valor > :valorMinimo";

// Comentário detalhado:
//  - "Usuario u": alias "u" para a entidade Usuario.
//  - "JOIN u.pedidos p":
//      - "u.pedidos" refere-se ao atributo "pedidos" em Usuario.
//      - "p" é o alias para cada instância de Pedido.
//  - Em seguida, podemos usar "p.valor" para filtrar pelos valores.

```

### Tipos de JOIN e aliases:

- **INNER JOIN** (padrão quando só digitamos `JOIN`):
    
    ```java
    FROM Usuario u
    INNER JOIN u.pedidos p
    
    ```
    
- **LEFT (OUTER) JOIN**:
    
    ```java
    FROM Usuario u
    LEFT JOIN u.pedidos p
    
    ```
    
- **FETCH JOIN** (para evitar *n+1* e já trazer coleção carregada):
    
    ```java
    FROM Usuario u
    JOIN FETCH u.pedidos p
    
    ```
    

---

### 4.3 Alias em Clauses (SELECT, WHERE, ORDER BY)

Uma vez definido o alias, podemos utilizá-lo em outras cláusulas da consulta.

```java
// 1. SELECT com alias
String jpql = "SELECT u.nome AS nomeUsuario, p.valor AS valorPedido "
            + "FROM Usuario u "
            + "JOIN u.pedidos p "
            + "WHERE u.id = :usuarioId "
            + "ORDER BY p.data DESC";

// Comentário passo a passo:
//  - "u.nome AS nomeUsuario":
//      - Retorna o atributo "nome" do alias "u" e projeta como “nomeUsuario”.
//  - "p.valor AS valorPedido":
//      - Retorna "valor" do alias "p" e projeta como “valorPedido”.
//  - "WHERE u.id = :usuarioId":
//      - Filtra a entidade Usuario referenciando o alias “u”.
//  - "ORDER BY p.data DESC":
//      - Ordena pelo atributo “data” do alias “p” em ordem decrescente.

```

**Observação sobre projection e aliases:**

- O JPQL permite atribuir um “alias” de projeção (`AS nomeAlias`) a colunas no `SELECT`. Esse alias não interfere no alias da entidade do `FROM`; destina-se apenas ao *rótulo* que a consulta retorna em um `Tuple` ou `Object[]`.
- Nem todos os providers JPA exigem `AS` obrigatório para projection alias, mas é boa prática para legibilidade.

---

## 5. Cenários de Restrição ou Não Aplicação

1. **Consultas Nativas (Native Queries)**
    - Em `@Query(nativeQuery = true)`, a sintaxe é SQL puro.
    - Os aliases devem obedecer às regras do banco de dados subjacente (p. ex., MySQL, PostgreSQL), não às regras JPQL.
    - Exemplo:
        
        ```java
        @Query(value = "SELECT u.nome AS nome_usuario FROM usuarios u WHERE u.id = :id", nativeQuery = true)
        List<Object[]> consultaNativa(@Param("id") Long id);
        
        ```
        
2. **Anotações de NamedQuery sem alias explícito**
    - É possível omitir alias em queries muito simples, mas ao fazer referência a atributos específicos (ex.: `WHERE nome = :pNome`), a consulta será considerada inválida pois falta contexto (JPQL exige alias quando há ambiguidade).
    - Exemplo inválido:
        
        ```java
        // ERRO: campo 'nome' não possui contexto definido (qual entidade?)
        @NamedQuery(name = "Usuario.findByNome", query = "SELECT nome FROM Usuario WHERE nome = :pNome")
        
        ```
        
    - Correção usando alias:
        
        ```java
        @NamedQuery(name = "Usuario.findByNome", query = "SELECT u.nome FROM Usuario u WHERE u.nome = :pNome")
        
        ```
        
3. **Subconsultas em SELECT**
    - Ao utilizar subconsulta em `SELECT`, você pode precisar dar um alias à subconsulta completa, mas nem sempre isso é permitido em todos os providers. A recomendação geral é evitar aliases complexos em projeções aninhadas.
4. **Limitações de comprimento de alias no banco**
    - Alguns bancos de dados impõem um limite no tamanho do alias retornado. Por exemplo, Oracle permite até 30 caracteres.
    - Embora o JPQL não imponha esse limite, ao traduzir para SQL, o provider pode truncar ou lançar erro se exceder.
5. **Conflito com Palavras-chave ou Caracteres Inválidos**
    - Caso você escolha um alias que coincida com palavra reservada (como `order`, `select`, `where`), a consulta falhará.
    - Evite caracteres especiais, espaços ou começar com número. Identificadores devem seguir convenções Java (ex.: `meuAlias`, `_aliasValido`, mas **não** `123alias` ou `order`).

---

## 6. Componentes Chave Associados

### 6.1 Anotações e Classes do JPA

1. `@Entity(name = "...")`
    - Define o **nome da entidade** utilizado em JPQL.
    - Se omitido, o JPA utilizará o nome simples da classe (case-sensitive).
2. `@Table(name = "...")`
    - Define a tabela no banco de dados, mas **não** altera o identificador usado pelo JPQL. Somente `@Entity(name=...)` faz isso.
    - Exemplo:
        
        ```java
        @Entity(name = "Cliente")
        @Table(name = "TB_CLIENTE")
        public class Usuario { ... }
        
        ```
        
        → No JPQL: `FROM Cliente c` (não `FROM Usuario`).
        
3. `@NamedQuery` e `@NamedQueries`
    - Podem definir consultas pré-nomeadas que serão referenciadas via `entityManager.createNamedQuery("Usuario.findAll")`.
    - Importante usar **alias** em todo lugar necessário para evitar ambiguidade.
4. `EntityManager` e `TypedQuery` / `Query`
    - `entityManager.createQuery("JPQL_AQUI", Entidade.class)` ou `createQuery(..., Object[].class)` para projeções.
    - Métodos importantes:
        - `setParameter(String nome, Object valor)`: referencia parâmetros nomeados.
        - `getSingleResult()`, `getResultList()`: obtêm resultados.
5. `CriteriaBuilder` e `CriteriaQuery`
    - Embora o foco seja JPQL textual, internamente o Criteria API resolve nomes de atributos e aliases em consultas dinâmicas.
    - Bons hábitos de nomenclatura nesse contexto facilitam a conversão de Criteria para SQL.

---

### 6.2 Métodos e Interfaces de Query

- **`Query#setHint(...)`**
    - Pode influenciar otimizações do provider, medalhões de caching, mas não costuma alterar diretamente alias.
- **`TypedQuery<T>`**
    - Quando se utiliza projeções em classes DTO customizadas (ex.: `SELECT NEW br.meuprojeto.Dto(u.id, u.nome)`), não há alias de entidade. O “NEW” já define mapeamento direto.
- **`Query#unwrap(...)`**
    - Em alguns cenários avançados, você pode “desembrulhar” a query para usar funcionalidades específicas do Hibernate (ex.: `org.hibernate.query.Query`). Porém, isso foge ao escopo de uso geral de aliases.

---

## 7. Melhores Práticas e Padrões de Uso

1. **Consistência de Nomenclatura**
    - Use aliases de uma letra para entidades simples (`u` para usuário, `p` para pedido).
    - Em queries mais complexas, prefira abreviações intuitivas como `usr`, `ped`, `end` (para endereço).
2. **Evitar Ambiguidade**
    - Sempre declare explicitamente o alias em `FROM`, mesmo que haja apenas uma entidade. Isso previne futuros erros quando migrar a query ou unir com outras tabelas.
        
        ```java
        // Recomendado:
        SELECT u FROM Usuario u
        // Em vez de:
        SELECT u FROM Usuario  // sem alias, dá erro se referenciar atributos em WHERE.
        
        ```
        
3. **Aliasing de Projeções**
    - Ao projetar campos em `SELECT`, utilize `AS` para nome amigável, sobretudo quando quiser mapear diretamente para `Tuple` ou `Object[]`.
        
        ```java
        SELECT u.nome AS nomeUsuario, u.email AS emailUsuario FROM Usuario u
        
        ```
        
4. **Limitar Comprimento de Alias**
    - Para evitar problemas em bancos com limite de caracteres, mantenha alias curtos (até 10 caracteres).
    - Exemplo ruim (muito longo):
        
        ```java
        SELECT usuario.nomePedidoDetalhado FROM Usuario usuario
        
        ```
        
        Versão otimizada:
        
        ```java
        SELECT upd.nomePedidoDetalhado FROM Usuario upd
        
        ```
        
5. **Padronização em Toda a Equipe**
    - Defina convenções de alias em um guia de estilo compartilhado. Por exemplo:
        - Entidades: letra minúscula equivalente da classe (`u` para `Usuario`, `c` para `Cliente`).
        - Sub-entities: letra + número se necessário (`u1`, `u2` para auto-joins).
6. **Documentação da Query**
    - Comente cada alias em consultas complexas para explicar o propósito:
        
        ```java
        /*
          u  -> entidade Usuario principal
          p  -> alias para pedidos ligados a esse usuário
          ep -> alias para itens de pedido (entidade PedidoItem)
        */
        SELECT u.nome, p.numeroPedido, ep.quantidade
        FROM Usuario u
          JOIN u.pedidos p
          LEFT JOIN p.itens ep
        WHERE u.ativo = true
        
        ```
        
7. **Reuso de Named Queries**
    - Sempre que possível, defina consultas reutilizáveis (with alias bem definidos) em `@NamedQuery` para promover centralização.

---

## 8. Exemplo Prático Completo

### Cenário

Suponha que estamos desenvolvendo um sistema de gerenciamento de pedidos. Temos duas entidades principais:

- **Cliente**: representa o usuário que faz pedidos.
- **Pedido**: armazena informações de cada pedido, como valor total e data.

### 1) Definição das Entidades

```java
// Classe Cliente.java
@Entity(name = "Cliente")
@Table(name = "TB_CLIENTE")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Pedido> pedidos = new ArrayList<>();

    // getters e setters omitidos para brevidade
}

// Classe Pedido.java
@Entity(name = "Pedido")
@Table(name = "TB_PEDIDO")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal valorTotal;

    @Column(nullable = false)
    private LocalDate dataPedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // getters e setters omitidos para brevidade
}

```

- Observações de nomenclatura:
    - No `@Entity(name = ...)`, definimos o **identificador da entidade** usado em JPQL: `"Cliente"` e `"Pedido"`.
    - Os nomes de tabela (`TB_CLIENTE`, `TB_PEDIDO`) não influenciam na query JPQL; servem ao mapeamento no banco.
    - Os atributos `valorTotal` e `dataPedido` devem ser referenciados exatamente assim em JPQL (case-sensitive).

---

### 2) Query de Busca de Pedidos por Cliente e Filtro de Valor

```java
// Exemplo de método no Repository (ou DAO) que busca pedidos de um cliente com valor mínimo
public List<Object[]> buscarPedidosPorClienteComValorMinimo(Long clienteId, BigDecimal valorMinimo) {
    String jpql =
        "SELECT c.nome AS nomeCliente, p.id AS idPedido, p.valorTotal AS valor, p.dataPedido AS data "
      + "FROM Cliente c "
      + "JOIN c.pedidos p "
      + "WHERE c.id = :idCliente AND p.valorTotal >= :valorMinimo "
      + "ORDER BY p.dataPedido DESC";

    TypedQuery<Object[]> query = entityManager.createQuery(jpql, Object[].class);
    query.setParameter("idCliente", clienteId);
    query.setParameter("valorMinimo", valorMinimo);

    return query.getResultList();
}

```

**Comentário detalhado:**

1. **`FROM Cliente c`**
    - `Cliente` é o identificador da entidade (definido em `@Entity(name="Cliente")`).
    - `c` é o alias que passamos para facilitar a referência a essa entidade.
2. **`JOIN c.pedidos p`**
    - `c.pedidos` refere-se ao atributo `List<Pedido> pedidos` dentro de `Cliente`.
    - `p` é o alias para cada instância de `Pedido` relacionada ao cliente.
    - Usamos `JOIN` em vez de `LEFT JOIN` pois queremos apenas pedidos existentes (inner join).
3. **Cláusula `SELECT` com projeção e aliases de projeção**
    - `c.nome AS nomeCliente`: retorna o atributo `nome` de `Cliente` e projeta sob o campo lógico `nomeCliente`.
    - `p.id AS idPedido`: retorna o `id` do `Pedido` como `idPedido`.
    - `p.valorTotal AS valor`: retorna `valorTotal` de `Pedido` como `valor`.
    - `p.dataPedido AS data`: retorna `dataPedido` do `Pedido` como `data`.
4. **Cláusula `WHERE` usando parâmetros nomeados**
    - `c.id = :idCliente`: filtra o cliente cujo `id` corresponde ao parâmetro `idCliente`.
    - `p.valorTotal >= :valorMinimo`: garante que o valor do pedido seja maior ou igual ao mínimo informado.
5. **`ORDER BY p.dataPedido DESC`**
    - Ordena o resultado pela data do pedido, do mais recente ao mais antigo.
6. **Correspondência de identificadores**
    - Caso a classe `Pedido` tivesse sido anotada como `@Entity(name = "Order")`, a JPQL passaria a ser `FROM Cliente c JOIN c.pedidos p` continuaria válida, pois o atributo `pedidos` permanece mapeado pela classe. Mas se você escrevesse `FROM Cliente c JOIN c.Orders o`, daria erro, pois não existe atributo `Orders` em `Cliente`.

---

### 3) Interpretação do Resultado

- O método `buscarPedidosPorClienteComValorMinimo(...)` retorna uma lista de `Object[]`, onde cada elemento do array obedece à ordem dos itens no `SELECT`:
    1. **[0]** → `nomeCliente` (String)
    2. **[1]** → `idPedido` (Long)
    3. **[2]** → `valor` (BigDecimal)
    4. **[3]** → `data` (LocalDate)
- Exemplo de processamento do retorno:
    
    ```java
    List<Object[]> resultados = buscarPedidosPorClienteComValorMinimo(5L, new BigDecimal("100.00"));
    for (Object[] linha : resultados) {
        String nomeCliente = (String) linha[0];
        Long idPedido     = (Long) linha[1];
        BigDecimal valor  = (BigDecimal) linha[2];
        LocalDate data    = (LocalDate) linha[3];
        // Aqui você pode montar DTO, logar ou manipular como desejar.
        System.out.printf("Cliente: %s | Pedido: %d | Valor: %s | Data: %s%n",
                          nomeCliente, idPedido, valor, data);
    }
    
    ```
    

---

### 4) Query com Subconsulta e Alias

Caso seja necessário filtrar clientes que realizaram um pedido acima de um certo valor **sem** trazer os dados do pedido:

```java
String jpql =
    "SELECT c.nome "
  + "FROM Cliente c "
  + "WHERE EXISTS ("
  + "   SELECT p2.id "
  + "   FROM Pedido p2 "
  + "   WHERE p2.cliente = c AND p2.valorTotal > :valorAlto"
  + ")";

TypedQuery<String> query = entityManager.createQuery(jpql, String.class);
query.setParameter("valorAlto", new BigDecimal("1000.00"));
List<String> nomes = query.getResultList();

```

- **Cuidados com aliases em subconsulta:**
    - O alias `p2` é distinto de qualquer outro alias no escopo externo (neste caso, `c`).
    - A subconsulta faz referência ao alias `c` (declaro em `WHERE p2.cliente = c`) porque ela “vê” o alias `c` do escopo externo.
    - Não é permitido usar o alias `c` para declarar o sub-alias; por isso, escolhemos `p2`.

---

## 9. Sugestões para Aprofundamento

1. **Criteria API e Alias Implícitos**
    - Entender como o `CriteriaBuilder` gera internamente as aliases, e quais convenções são aplicadas ao traduzir para SQL.
2. **NamedEntityGraphs e EntityGraphs Dinâmicos**
    - Aprender como criar **EntityGraphs** para controlar fetch de coleções, onde os “aliases” não aparecem textualmente, mas o conceito de “caminho de atributo” é similar a usar alias em JPQL.
3. **Performance e Análise de Plano de Execução**
    - Explorar como o uso correto de aliases (especialmente em `JOIN FETCH`) evita problemas de **N+1** e está atrelado ao desempenho.
4. **Aliasing em Projeções DTO (Construtores)**
    - Averiguar como usar `SELECT NEW com pacote.dto(...)`, mapeando diretamente para um objeto, dispensando o uso de `Object[]`.
5. **Ferramentas de Depuração de Queries**
    - Investigar o `hibernate.show_sql` e `hibernate.format_sql` para visualizar as queries SQL geradas a partir de JPQL com aliases, verificando se mapeamentos refletem corretamente os nomes.

---

### Resumo Final

1. **Alias** em JPQL deixam a consulta mais legível e evitam ambiguidades.
2. **Identificadores** (nomes de entidade, atributos e aliases) são **case-sensitive** e devem corresponder exatamente às nomenclaturas definidas em anotações ou no código Java.
3. Use alias em `FROM`, `JOIN`, `SELECT`, `WHERE`, `ORDER BY` e evite nomes conflitantes com palavras reservadas.
4. Documente e padronize a convenção de aliases na equipe para garantir consistência.
5. Em cenários de **Native Query**, as regras são as do SQL do banco; em JPQL, sempre observe a nomenclatura JPA.

Seguindo essas orientações e explorando os exemplos acima, você terá um domínio sólido sobre **aliases e identificadores** em JPQL, garantindo consultas corretas, legíveis e de fácil manutenção.