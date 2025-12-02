# Grafos de Entidades Nomeadas (Named Entity Graphs)

---

## Introdução

Em aplicações JPA, o controle de carregamento (fetch) de relacionamentos entre entidades é fundamental para evitar problemas de performance, como o famoso **N+1 selects**. Tradicionalmente, isso é feito por meio das estratégias `FetchType.LAZY` e `FetchType.EAGER`, além de JPQL com `JOIN FETCH`. Porém, em certos cenários, definir essas estratégias estaticamente na entidade não é suficiente ou gera sobrecarga de dados desnecessária.

**Grafos de Entidades (Entity Graphs)** surgem como um mecanismo mais flexível para definir, em tempo de execução ou compilação, quais relacionamentos devem ser pré-carregados ao executar uma consulta JPQL ou Criteria. Na forma **nomeada** (Named Entity Graph), criamos, no escopo da classe de entidade, um grafo que indica quais atributos (“nodes”) e subgrafos (“subgraphs”) devem ser trazidos do banco, substituindo o comportamento padrão de fetch para aquela consulta específica, sem alterar a modelagem base de `LAZY`/`EAGER`.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Definição de Named Entity Graph via Anotações
    2. Uso em JPQL com Hints de Fetch
    3. Exemplos de Variações (Subgraphs, Atributos Simples, etc.)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    1. Anotações (`@NamedEntityGraph`, `@NamedAttributeNode`, `@NamedSubgraph`)
    2. Interfaces/Classes (EntityGraph, Subgraph, Persistence Unit)
    3. Hints de JPA (`javax.persistence.fetchgraph` vs. `javax.persistence.loadgraph`)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

1. **Por que usar grafos de entidades?**
    - Controlar com precisão quais relacionamentos devem ser pré-carregados em cada consulta, evitando `N+1` e “overfetch” de dados.
    - Não precisar alterar a estratégia de fetch padrão da entidade (por exemplo, manter `LAZY` na associação, mas forçar carregar via grafo em uma consulta específica).
    - Tornar explícita, de forma reutilizável e nomeada, a árvore de atributos a ser fetchada, promovendo manutenção mais clara sobre quais relacionamentos são críticos em cada caso de uso.
2. **Entity Graph vs. JPQL `JOIN FETCH`:**
    - **JPQL `JOIN FETCH`:** exige escrever a sintaxe de *join* toda vez que for necessário pré-carregar a associação.
    - **Entity Graph:** define, de modo declarativo, quais nós (atributos relacionados) devem ser trazidos, sem precisar reescrever `JOIN FETCH`. Permite reaproveitar o grafo em várias consultas.
3. **Tipos de Entity Graph:**
    - **Named Entity Graph (estático):** definido com anotações na classe da entidade; pode ser referenciado por nome na consulta.
    - **Dynamic (ou Ad-hoc) Entity Graph:** criado em tempo de execução via API `EntityManager.createEntityGraph(...)`, sem anotações prévias.
4. **Fetch Graph vs. Load Graph:**
    - **Fetch Graph (`javax.persistence.fetchgraph`):** traz apenas os atributos explicitamente listados no grafo; todas as demais associações são tratadas como se fossem `LAZY`, mesmo que definidas como `EAGER`.
    - **Load Graph (`javax.persistence.loadgraph`):** traz os atributos listados no grafo como pré-carregados, mas carrega de forma natural (conforme definido na entidade) os demais `EAGER`; as associações `LAZY` permanecem `LAZY`.

---

## Sintaxe Detalhada e Uso Prático

### 1. Definição de Named Entity Graph via Anotações

Na classe de entidade, usamos:

- `@NamedEntityGraph(name = "...", attributeNodes = { ... }, subgraphs = { ... })`
- `@NamedAttributeNode("atributoSimples")`
- `@NamedAttributeNode(value = "atributoRelacionado", subgraph = "nomeSubgraph")`
- `@NamedSubgraph(name = "nomeSubgraph", attributeNodes = { @NamedAttributeNode("subAtributo") })`

> Exemplo Simplificado: imagine as entidades Pedido, Cliente e ItemPedido.
> 
> - `Pedido` tem relacionamento ManyToOne com `Cliente` (campo `cliente`).
> - `Pedido` tem relacionamento OneToMany com `ItemPedido` (campo `itens`).
> - `ItemPedido` tem relacionamento ManyToOne com `Produto` (campo `produto`).

```java
@Entity
@NamedEntityGraph(
    name = "Pedido.comClienteEItens",
    attributeNodes = {
        @NamedAttributeNode("cliente"),              // traz o cliente
        @NamedAttributeNode(value = "itens",          // traz a lista de itens
                             subgraph = "itensSubgraph")
    },
    subgraphs = {
        @NamedSubgraph(
            name = "itensSubgraph",
            attributeNodes = {
                @NamedAttributeNode("produto")       // dentro de cada ItemPedido, traz o produto
            }
        )
    }
)
public class Pedido {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @OneToMany(mappedBy = "pedido", fetch = FetchType.LAZY)
    private List<ItemPedido> itens = new ArrayList<>();

    // outros atributos: data, status, valorTotal, etc.
    // getters e setters omitidos para brevidade
}

```

- No exemplo acima, definimos **um grafo nomeado** chamado `"Pedido.comClienteEItens"`.
- Esse grafo diz:
    1. “Carregue `cliente` (associação ManyToOne).”
    2. “Carregue `itens` (lista de `ItemPedido`), e para cada `ItemPedido`, traga também o `produto` associado.”

### Anotações usadas:

- **`@NamedEntityGraph(name, attributeNodes, subgraphs)`**:
    - `name`: identificador único do grafo dentro da classe.
    - `attributeNodes`: lista de `@NamedAttributeNode` dos atributos simples ou relacionamentos de primeiro nível.
    - `subgraphs`: lista de `@NamedSubgraph` para aprofundar o grafo em níveis inferiores.
- **`@NamedAttributeNode("campo")`**: marca um nó de primeiro nível a ser carregado.
    - Se o atributo é um relacionamento simples (ManyToOne, OneToOne), basta `@NamedAttributeNode("cliente")`.
    - Se é um relacionamento “árvore” (por exemplo, List, Set), e desejamos trazer subatributos desse relacionamento, usamos `value + subgraph`:
        
        ```java
        @NamedAttributeNode(value = "itens", subgraph = "itensSubgraph")
        
        ```
        
- **`@NamedSubgraph(name, attributeNodes)`**: define um subgrafo para relacionamentos de segundo nível.
    - `name`: mesmo valor referenciado em `@NamedAttributeNode(..., subgraph = "itensSubgraph")`.
    - `attributeNodes`: lista de novos `@NamedAttributeNode` para os atributos que devem ser carregados dentro desse subgrafo.

---

### 2. Uso em JPQL com Hints de Fetch

Após definir o Named Entity Graph, basta referenciá-lo ao criar a consulta. Em JPQL, usamos:

1. **Obter o grafo do `EntityManager`:**
    
    ```java
    EntityGraph<?> graph = em.getEntityGraph("Pedido.comClienteEItens");
    
    ```
    
2. **Criar a query JPQL (pode ser `TypedQuery`):**
    
    ```java
    TypedQuery<Pedido> jpql = em.createQuery(
        "SELECT p FROM Pedido p WHERE p.status = :status", Pedido.class
    );
    jpql.setParameter("status", StatusPedido.CONFIRMADO);
    
    ```
    
3. **Incluir o Hint de Fetch Graph ou Load Graph:**
    
    ```java
    // Para forçar que apenas os atributos do grafo sejam carregados
    jpql.setHint("javax.persistence.fetchgraph", graph);
    
    // Alternativamente, se quisermos que o grafo seja “uma adição ao EAGER”:
    // jpql.setHint("javax.persistence.loadgraph", graph);
    
    ```
    
4. **Executar a consulta:**
    
    ```java
    List<Pedido> pedidos = jpql.getResultList();
    
    ```
    

> Explicação dos hints:
> 
> - `"javax.persistence.fetchgraph"`: carrega **apenas** o que estiver listado no grafo; o restante das associações permanece LAZY mesmo que definidas EAGER.
> - `"javax.persistence.loadgraph"`: carrega o que estiver listado no grafo **e** carrega normalmente as associações marcadas EAGER na entidade. As associations LAZY continuam LAZY.

**Exemplo Completo de Uso em um DAO/Repository:**

```java
public class PedidoRepository {

    @PersistenceContext
    private EntityManager em;

    public List<Pedido> buscarPedidosComDadosCompletos(StatusPedido status) {
        // 1. Obter o NamedEntityGraph previamente definido na classe Pedido
        EntityGraph<?> graph = em.getEntityGraph("Pedido.comClienteEItens");

        // 2. Montar a query JPQL
        TypedQuery<Pedido> query = em.createQuery(
            "SELECT p FROM Pedido p WHERE p.status = :status", Pedido.class
        );
        query.setParameter("status", status);

        // 3. Incluir Hint de Fetch Graph
        query.setHint("javax.persistence.fetchgraph", graph);

        // 4. Executar e retornar
        return query.getResultList();
    }
}

```

> Observação: Se você quiser construir o grafo de forma “dinâmica” em tempo de execução, use:
> 
> 
> ```java
> EntityGraph<Pedido> graph = em.createEntityGraph(Pedido.class);
> graph.addAttributeNodes("cliente");
> Subgraph<ItemPedido> sub = graph.addSubgraph("itens");
> sub.addAttributeNodes("produto");
> // e então:
> query.setHint("javax.persistence.fetchgraph", graph);
> 
> ```
> 

---

### 3. Exemplos de Variações de Sintaxe

1. **Grafo sem subgrafo (apenas relacionamentos diretos):**
    
    ```java
    @Entity
    @NamedEntityGraph(
        name = "Pedido.comCliente",
        attributeNodes = {
            @NamedAttributeNode("cliente")
        }
    )
    public class Pedido { /* ... */ }
    
    ```
    
    - No exemplo acima, ao usar `"Pedido.comCliente"`, apenas `pedido.cliente` será pré-carregado; `itens` permanece LAZY.
2. **Grafo que traz apenas atributos simples (sem relacionamentos):**
    
    ```java
    @NamedEntityGraph(
        name = "Pedido.camposBasicos",
        attributeNodes = {
            @NamedAttributeNode("data"),
            @NamedAttributeNode("valorTotal")
        }
    )
    
    ```
    
    - Cria um grafo que carrega apenas os campos `data` e `valorTotal` da entidade `Pedido`. Útil para reduzir colunas em projeções ou quando só precisamos de atributos escalares.
3. **Grafo misto (associações e atributos simples):**
    
    ```java
    @NamedEntityGraph(
        name = "Pedido.infoCompleta",
        attributeNodes = {
            @NamedAttributeNode("cliente"),
            @NamedAttributeNode("data"),
            @NamedAttributeNode(value = "itens", subgraph = "itensSub")
        },
        subgraphs = {
            @NamedSubgraph(
                name = "itensSub",
                attributeNodes = {
                    @NamedAttributeNode("produto"),
                    @NamedAttributeNode("quantidade")
                }
            )
        }
    )
    
    ```
    
    - Carrega:
        - `cliente` (ManyToOne)
        - `data` (atributo simples)
        - `itens` (List<ItemPedido>), e dentro de cada `ItemPedido`: `produto` e `quantidade`.

---

## Cenários de Restrição ou Não Aplicação

1. **Situações em que o JPA do provedor não suporta Entity Graphs:**
    - A grande maioria dos provedores atuais (Hibernate, EclipseLink, OpenJPA) suportam `< JPA 2.1` e acima. Porém, se estiver usando uma versão **habitual** anterior ao JPA 2.1, não há suporte a Entity Graphs.
2. **Quando o grafo fica excessivamente profundo ou complexo:**
    - Definir subgraphs aninhados além de 2–3 níveis pode gerar consultas SQL muito “pesadas”, com múltiplos `JOINs`, degradando a performance em vez de otimizá-la.
    - Se o modelo de domínio já é muito profundo (muitas entidades relacionadas), é melhor refinar a necessidade de dados ou usar **DTOs**/Projeções específicas em vez de trazer toda a árvore.
3. **Quando o uso de `JOIN FETCH` em JPQL seria mais direto:**
    - Em consultas pontuais, muito simples, usar diretamente `LEFT JOIN FETCH p.cliente, p.itens i JOIN FETCH i.produto` pode ser mais legível.
    - Entity Graphs se destacam quando o mesmo padrão de fetch será reutilizado em várias consultas.
4. **Quando não há mapeamento JPA de certas associações (por exemplo, mapeamento via `@Formula` ou colunas calculadas):**
    - Entity Graphs só controlam associações explicitamente mapeadas (`@OneToMany`, `@ManyToOne`, etc.). Atributos que dependem de native queries ou derivados não são afetados.
5. **Busca nativa (native query):**
    - Se a consulta for totalmente nativa SQL (via `createNativeQuery`), **não há** aplicação direta de grafos de entidade. Nesse caso, deve-se ou mapear a classe resultante (via `@SqlResultSetMapping`) ou usar `JOIN` na query SQL manual.

---

## Componentes Chave Associados

1. **Anotações Principais:**
    - **`@NamedEntityGraph`**
        
        ```java
        @NamedEntityGraph(
            name = "Entidade.nomeDoGrafo",
            attributeNodes = { @NamedAttributeNode("campo1"), ... },
            subgraphs = { @NamedSubgraph(...) }
        )
        
        ```
        
        - `name`: identificador do grafo.
        - `attributeNodes`: lista de nós de primeiro nível.
        - `subgraphs`: define sub-nós (subgrafos) para relacionamentos aninhados.
    - **`@NamedAttributeNode`**
        
        ```java
        @NamedAttributeNode("campo")
        // OU
        @NamedAttributeNode(value = "relacionamento", subgraph = "nomeSubgrafo")
        
        ```
        
        - `value`: nome do atributo da entidade a ser incluído no grafo.
        - `subgraph` (opcional): nome do subgrafo que detalha atributos de segundo nível.
    - **`@NamedSubgraph`**
        
        ```java
        @NamedSubgraph(
            name = "nomeSubgrafo",
            attributeNodes = { @NamedAttributeNode("subAtributo1"), ... }
        )
        
        ```
        
        - `name`: deve corresponder ao `subgraph` usado em algum `@NamedAttributeNode`.
        - `attributeNodes`: lista de atributos de segundo nível.
2. **Classes/Interfaces (API JPA):**
    - **`EntityGraph<T>`**
        - Representa em tempo de execução o grafo de entidades.
        - Pode ser obtido por `EntityManager.getEntityGraph("nomeDoGrafo")` no caso de Named Entity Graph.
        - Ou criado dinamicamente via `EntityManager.createEntityGraph(ClasseEntity.class)`.
    - **`Subgraph<T>`**
        - Usado ao criar grafos ou subgrafos dinâmicos. Permite adicionar nós de segundo nível:
            
            ```java
            Subgraph<ItemPedido> itensSub = graph.addSubgraph("itens");
            itensSub.addAttributeNodes("produto");
            
            ```
            
3. **Hints de JPA:**
    - **`"javax.persistence.fetchgraph"`**
        - Indica que **somente** os atributos do grafo devem ser pré-carregados; desativa EAGER para demais associações.
    - **`"javax.persistence.loadgraph"`**
        - Indica que **além** dos atributos do grafo, quaisquer associações marcadas EAGER também devem ser carregadas.
4. **Métodos Úteis em `EntityManager`:**
    - **`<T> EntityGraph<T> createEntityGraph(Class<T> rootType)`**
        - Cria um grafo dinâmico para a classe informada.
    - **`EntityGraph<?> getEntityGraph(String graphName)`**
        - Retorna um grafo previamente definido via `@NamedEntityGraph`.
    - **`<T> EntityGraph<T> createEntityGraph(String graphName)`** *(Hibernate a partir de versões mais recentes também.*)

---

## Melhores Práticas e Padrões de Uso

1. **Use grafos nomeados para cenários de consulta repetitiva:**
    - Se em vários pontos da aplicação você precisa trazer as mesmas associações de uma entidade, crie um `@NamedEntityGraph` em vez de repetir `JOIN FETCH` em várias consultas. Facilita manutenção.
2. **Mantenha o grafo enxuto e específico:**
    - Evite incluir atributos e associações que não são necessários neste caso de uso. Um grafo muito amplo pode gerar joins desnecessários e trazer grandes volumes de dados.
3. **Escolha entre `fetchgraph` e `loadgraph` conforme a realidade do modelo:**
    - Se sua entidade possui associações `EAGER` que só servem em poucos casos, use **`fetchgraph`** para eliminá-las temporariamente.
    - Se você quer apenas “complementar” o comportamento padrão, deixando o EAGER normal, use **`loadgraph`**.
4. **Combine com DTOs/projeções quando necessário:**
    - Se os dados resultantes não precisam ser entidades completas, considere usar *constructor expressions* em JPQL ou Spring Data JPA Projections. Entity Graphs ajudam quando você precisa efetivamente da entidade gerenciada para operações de escrita subsequentes.
5. **Evite ciclos infinitos no grafo:**
    - Não crie subgraphs que retornem ciclicamente à entidade raiz sem cuidado (por exemplo, `Pedido -> ItemPedido -> Pedido -> ...`). Isso pode gerar `StackOverflow` ou consultas que não terminam.
6. **Documente o propósito de cada grafo:**
    - No Javadoc da entidade, explique brevemente para que serve o `@NamedEntityGraph="xyz"`. Facilita o entendimento de colegas de projeto.
7. **Teste e monitore o SQL gerado:**
    - Use logs do Hibernate/EclipseLink ou ferramentas de depuração para verificar se realmente o grafo está gerando as consultas SQL esperadas (com JOINs corretos e sem redundâncias).

---

## Exemplo Prático Completo

### 1. Modelo de Domínio

```java
@Entity
@NamedEntityGraph(
    name = "Pedido.completo",
    attributeNodes = {
        @NamedAttributeNode("cliente"),
        @NamedAttributeNode(value = "itens", subgraph = "itensSub")
    },
    subgraphs = {
        @NamedSubgraph(
            name = "itensSub",
            attributeNodes = {
                @NamedAttributeNode("produto")
            }
        )
    }
)
public class Pedido {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @OneToMany(mappedBy = "pedido", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ItemPedido> itens = new ArrayList<>();

    private LocalDate data;
    private BigDecimal valorTotal;

    // getters e setters omitidos
}

@Entity
public class Cliente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String email;
    // getters e setters omitidos
}

@Entity
public class ItemPedido {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id")
    private Produto produto;

    private Integer quantidade;
    private BigDecimal precoUnitario;
    // getters e setters omitidos
}

@Entity
public class Produto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    // getters e setters omitidos
}

```

- Observação:
    - `Pedido` é a entidade principal, com `cliente` e `itens` como relacionamentos LAZY por padrão.
    - Definimos o grafo nomeado `"Pedido.completo"` para pré-carregar **cliente**, **itens** e **produto** de cada item.

---

### 2. Repositório / DAO Usando JPQL + Named Entity Graph

```java
@Repository
public class PedidoDAO {

    @PersistenceContext
    private EntityManager em;

    /**
     * Busca Pedidos de um Cliente específico, trazendo
     * cliente, itens e produtos em um único batch.
     */
    public List<Pedido> buscarPedidosDoClienteComDetalhes(Long clienteId) {
        // 1. Recupera o grafo nomeado
        EntityGraph<?> graph = em.getEntityGraph("Pedido.completo");

        // 2. Monta a JPQL
        String jpql = "SELECT p FROM Pedido p "
                    + "WHERE p.cliente.id = :cid "
                    + "ORDER BY p.data DESC";

        TypedQuery<Pedido> query = em.createQuery(jpql, Pedido.class);
        query.setParameter("cid", clienteId);

        // 3. Define hint de fetchgraph
        query.setHint("javax.persistence.fetchgraph", graph);

        // 4. Executa a query
        return query.getResultList();
    }
}

```

> Explicação do Fluxo:
> 
> 1. Ao chamar `em.getEntityGraph("Pedido.completo")`, o Hibernate/EclipseLink busca a definição do grafo que declaramos em `@NamedEntityGraph` na classe `Pedido`.
> 2. Montamos a JPQL normalmente, sem `JOIN FETCH`.
> 3. Ao setar o hint `"javax.persistence.fetchgraph"`, informamos ao provedor: “Use apenas os nós definidos no grafo para pré-carregar associações.”
> 4. Quando executada, a JPA irá gerar SQL parecido com:

```sql
SELECT
   p.id AS p_id,
   p.data AS p_data,
   p.valorTotal AS p_valorTotal,
   c.id AS c_id,
   c.nome AS c_nome,
   c.email AS c_email,
   i.id AS i_id,
   i.quantidade AS i_quantidade,
   i.precoUnitario AS i_precoUnitario,
   pr.id AS pr_id,
   pr.nome AS pr_nome,
   pr.preco AS pr_preco
FROM Pedido p
LEFT JOIN Cliente c ON p.cliente_id = c.id
LEFT JOIN ItemPedido i ON i.pedido_id = p.id
LEFT JOIN Produto pr ON i.produto_id = pr.id
WHERE c.id = ?
ORDER BY p.data DESC

```

Sem o grafo, se as associações fossem LAZY, seria executada uma consulta para `Pedido`, depois N consultas para `Cliente` (N pedidos), depois N consultas para `ItemPedido`, etc. O grafo junta tudo em uma query.

---

### 3. Integração com Criteria API (opcional)

Caso você prefira usar a **Criteria API** em vez de JPQL escrito à mão, basta:

```java
public List<Pedido> buscarComCriteria(Long clienteId) {
    // 1. Criar CriteriaBuilder & CriteriaQuery
    CriteriaBuilder cb = em.getCriteriaBuilder();
    CriteriaQuery<Pedido> cq = cb.createQuery(Pedido.class);
    Root<Pedido> root = cq.from(Pedido.class);

    // 2. Definir predicado (filter) de cliente
    Predicate filtro = cb.equal(root.get("cliente").get("id"), clienteId);
    cq.select(root).where(filtro).orderBy(cb.desc(root.get("data")));

    // 3. Obter NamedEntityGraph
    EntityGraph<?> graph = em.getEntityGraph("Pedido.completo");

    // 4. Criar TypedQuery e aplicar hint
    TypedQuery<Pedido> query = em.createQuery(cq);
    query.setHint("javax.persistence.fetchgraph", graph);

    return query.getResultList();
}

```

---

## Cenários de Restrição ou Não Aplicação

- **Modelos sem relacionamentos JPA** (por exemplo, uso exclusivo de *views* ou tabelas não mapeadas) não podem usar Entity Graph diretamente.
- **Consultas nativas** (`createNativeQuery`) não interpretam grafo de entidades; o carregamento deve ser controlado manualmente.
- **Associações muito profundas ou bidirecionais cíclicas**: se você abusar de subgraphs aninhados que “voltam” ao nó raiz, corre o risco de gerar `StackOverflowError` ou consultas inválidas (€ joins redundantes).
- **Operações de escrita**: grafo de entidades é um mecanismo de leitura/consulta (fetch). Para persistência ou merge, as associações são ignoradas; o grafo não afeta como o JPA controla o estado de cascata ou flush.
- **Pilhas de objetos grandes**: em objetos com muitos relacionamentos e listas extensas, embarcar toda a árvore de entidade pode estourar memória. Avalie caso a caso.

---

## Componentes Chave Associados

1. **Anotações**
    - **`@Entity`**: marca uma classe como uma Entidade JPA.
    - **`@NamedEntityGraph(name, attributeNodes, subgraphs)`**: define, na classe, um grafo nomeado.
    - **`@NamedAttributeNode("campo")`**: inclui um atributo (escalar ou relacionamento) no grafo.
    - **`@NamedSubgraph(name, attributeNodes)`**: define atributos de segundo nível para a associação de primeiro nível.
2. **Classes/Interfaces (API)**
    - **`EntityGraph<T>`**: representação em tempo de execução de um grafo.
        - Métodos principais (Hibernate/EclipseLink):
            - `getAttributeNodes()` / `getSubgraphs()` para inspeção opcional.
    - **`Subgraph<T>`**: para grafos criados dinamicamente.
        - `addAttributeNodes(String attributeName)`: adiciona atributos de subgrafo.
    - **`EntityManager`**:
        - `EntityManager.getEntityGraph(String graphName)`: retorna o grafo nomeado.
        - `EntityManager.createEntityGraph(Class<T> rootType)`: cria grafo dinâmico.
        - `EntityManager.createQuery(...)`: cria a query que pode receber hints de grafo.
3. **Hints de JPA**
    - **`javax.persistence.fetchgraph`**
        - Força o provedor a carregar **somente** os atributos listados no grafo; ignora `EAGER` nativo.
    - **`javax.persistence.loadgraph`**
        - Carrega os atributos do grafo **e** segue a configuração padrão de `EAGER` de outros relacionamentos.
4. **Métodos Auxiliares**
    - **`EntityManager.createNamedEntityGraph(String)`** *(Hibernate 5+)*: cria dinamicamente um grafo a partir de uma definição existente.
    - **`EntityManager.createEntityGraph(String graphName, Class<T> entityClass)`** *(EclipseLink)*.

---

## Melhores Práticas e Padrões de Uso

1. **Defina diferentes grafos para diferentes casos de uso:**
    - Exemplo: `Pedido.basico` carrega só campos essenciais (data, status), `Pedido.comCliente` carrega também o cliente, `Pedido.completo` carrega tudo (cliente, itens, produto). Isso facilita reutilização.
2. **Prefira `fetchgraph` para consultas de leitura pura:**
    - Garante que você traga apenas o necessário. Evita `EAGER` acidental.
3. **Evite grafos “genéricos” demais:**
    - Um grafo que inclua TODO relacionamento da entidade pode gerar SQL com múltiplos `JOINs` desnecessários e afetar performance.
4. **Combine com cache de segundo nível (2nd level cache) se aplicável:**
    - Se você usar Hibernate L2 Cache, um grafo que recarrega relacionamentos pode se beneficiar de buscas em cache, reduzindo impacto de BD.
5. **Documente a finalidade de cada grafo:**
    - No Javadoc da entidade, explique “Este grafo é usado para lista de pedidos na tela X, pois precisamos mostrar dados do cliente e total de itens”.
6. **Teste com logging SQL ativado:**
    - Confirme se o SQL gerado corresponde ao esperado, sem `N+1` invisíveis ou colunas extras.
7. **Não use grafos para atualizar entidades:**
    - O grafo é somente para **leitura**. O JPA não usa entity graph para determinar cascatas ou persistência. Para atualização, trate associations normalmente (`CascadeType` etc.).

---

## Exemplo Prático Completo

Imagine que temos um serviço que lista pedidos recentes de um cliente específico em uma tela de **Dashboard**, mostrando:

- Dados do **Pedido** (ID, data, valor).
- Nome e e-mail do **Cliente**.
- Para cada **ItemPedido**, exibe o nome do **Produto** e quantidade.

### 1. Definindo as Entidades com Named Entity Graph

```java
@Entity
@NamedEntityGraph(
    name = "Pedido.completo",
    attributeNodes = {
        @NamedAttributeNode("cliente"),
        @NamedAttributeNode(value = "itens", subgraph = "itensSub")
    },
    subgraphs = {
        @NamedSubgraph(
            name = "itensSub",
            attributeNodes = {
                @NamedAttributeNode("produto")
            }
        )
    }
)
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate data;

    @Column(nullable = false)
    private BigDecimal valorTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @OneToMany(mappedBy = "pedido", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ItemPedido> itens = new ArrayList<>();

    // getters e setters omitidos
}

@Entity
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    // getters e setters omitidos
}

@Entity
public class ItemPedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(nullable = false)
    private BigDecimal precoUnitario;

    // getters e setters omitidos
}

@Entity
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 500)
    private String descricao;

    @Column(nullable = false)
    private BigDecimal preco;

    // getters e setters omitidos
}

```

- Todos os relacionamentos (`cliente`, `itens`, `produto`) estão marcados como `LAZY`.
- O grafo nomeado **“Pedido.completo”** define que, quando exigido, JPA deve trazer, em uma única consulta, **cliente**, **itens** e **produto** de cada item de pedido.

---

### 2. Serviço que Utiliza o Grafo

```java
@Service
public class PedidoService {

    @Autowired
    private PedidoDAO pedidoDAO;

    /**
     * Retorna os 10 pedidos mais recentes de um cliente, já com cliente, itens e produtos carregados.
     */
    public List<Pedido> listarPedidosRecentesCompletos(Long clienteId) {
        return pedidoDAO.buscarPedidosComDetalhes(clienteId, 10);
    }
}

```

### 3. DAO (Repository) com JPQL e Hint

```java
@Repository
public class PedidoDAO {

    @PersistenceContext
    private EntityManager em;

    /**
     * Busca os 'limite' pedidos mais recentes de um cliente, trazendo
     * dados completos (cliente, itens e produtos).
     * @param clienteId ID do cliente a filtrar
     * @param limite número máximo de registros a retornar
     */
    public List<Pedido> buscarPedidosComDetalhes(Long clienteId, int limite) {
        // 1. Recupera o grafo nomeado
        EntityGraph<?> graph = em.getEntityGraph("Pedido.completo");

        // 2. Monta a JPQL com parâmetro e ordenação
        String jpql = "SELECT p FROM Pedido p "
                    + "WHERE p.cliente.id = :cid "
                    + "ORDER BY p.data DESC";

        TypedQuery<Pedido> query = em.createQuery(jpql, Pedido.class);
        query.setParameter("cid", clienteId);
        query.setMaxResults(limite);

        // 3. Define o hint de fetchgraph
        query.setHint("javax.persistence.fetchgraph", graph);

        // 4. Executa e retorna a lista
        return query.getResultList();
    }
}

```

---

### 4. Exibição em Camada de Apresentação (opcional)

Imagine um endpoint REST que retorna lista de pedidos como JSON. Em Spring Boot, algo como:

```java
@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping("/cliente/{clienteId}/recentes")
    public ResponseEntity<List<PedidoDTO>> getPedidosRecentes(@PathVariable Long clienteId) {
        List<Pedido> pedidos = pedidoService.listarPedidosRecentesCompletos(clienteId);

        // Converter para DTOs, evitando loops de serialização
        List<PedidoDTO> dtos = pedidos.stream()
            .map(PedidoDTO::new)
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}

```

### Exemplo de DTO (para resposta leve)

```java
public class PedidoDTO {
    private Long id;
    private LocalDate data;
    private BigDecimal valorTotal;
    private ClienteResumoDTO cliente;
    private List<ItemPedidoResumoDTO> itens;

    public PedidoDTO(Pedido p) {
        this.id = p.getId();
        this.data = p.getData();
        this.valorTotal = p.getValorTotal();
        this.cliente = new ClienteResumoDTO(p.getCliente());

        this.itens = p.getItens().stream()
                       .map(ItemPedidoResumoDTO::new)
                       .collect(Collectors.toList());
    }
    // getters e setters omitidos
}

public class ClienteResumoDTO {
    private Long id;
    private String nome;
    private String email;
    public ClienteResumoDTO(Cliente c) {
        this.id = c.getId();
        this.nome = c.getNome();
        this.email = c.getEmail();
    }
    // getters e setters omitidos
}

public class ItemPedidoResumoDTO {
    private String nomeProduto;
    private Integer quantidade;
    private BigDecimal precoUnitario;

    public ItemPedidoResumoDTO(ItemPedido ip) {
        this.nomeProduto = ip.getProduto().getNome();
        this.quantidade = ip.getQuantidade();
        this.precoUnitario = ip.getPrecoUnitario();
    }
    // getters e setters omitidos
}

```

- **Importante:** Ao usar Entity Graph, como `itens` e `produto` já vêm carregados, não haverá exceção de *LazyInitializationException* durante a serialização JSON (desde que a transação ainda esteja aberta).

---

## Sugestões para Aprofundamento

1. **Especificação JPA 2.1 (JSR 338):**
    
    Consulte a seção “5.3 Entity Graphs” para entender cada detalhe de como o padrão JPA define a API de grafos de entidade.
    
2. **Guia do Hibernate:**
    - Capítulo “Fetching Strategies”: aborda `EntityGraph` em detalhes, inclusive nuances de `@EntityGraph` x `@NamedEntityGraph`.
    - Documentação oficial:
        - [https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html#fetching-entity-graphs](https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html#fetching-entity-graphs)
3. **EclipseLink Loading Strategies:**
    - Se você usa EclipseLink como provedor, revise:
        
        [https://www.eclipse.org/eclipselink/documentation/2.7/jpa/extensions/a_entities002.htm](https://www.eclipse.org/eclipselink/documentation/2.7/jpa/extensions/a_entities002.htm)
        
4. **Artigos e Blogs:**
    - “JPA Entity Graphs: How and When to Use”: demonstra comparações práticas com `JOIN FETCH`.
    - “Advanced JPA – Entity Graphs” (Baeldung): exemplos aplicados e comparativos.
5. **Ferramentas de Profiling/Monitoramento:**
    - Ative log SQL detalhado (`hibernate.show_sql=true` ou equivalente) e monitor de banco (p.ex. `p6spy`) para validar se o grafo está gerando consultas ideais.

---

### Conclusão

Os **Named Entity Graphs** no JPA proporcionam uma forma poderosa e declarativa de controlar o comportamento de fetch sem alterar o mapeamento base da entidade. Com eles, você define quais associações devem ser trazidas “por nome”, reaproveitando essa definição em diversas consultas JPQL ou Criteria. Seguindo boas práticas—manter grafos enxutos, usar `fetchgraph` quando necessário e monitorar SQL gerado—você evita sobrecarga de dados e elimina problemas de **N+1 selects**, garantindo maior performance e clareza na camada de persistência.

Espero que esta explicação detalhada ajude no seu entendimento de **Named Entity Graphs** no contexto do JPA/JPQL em Java. Se tiver dúvidas adicionais ou quiser aprofundar em aspectos mais específicos (por exemplo, grafos dinâmicos, integração com Spring Data JPA, ou performance tuning), sinta-se à vontade para perguntar!