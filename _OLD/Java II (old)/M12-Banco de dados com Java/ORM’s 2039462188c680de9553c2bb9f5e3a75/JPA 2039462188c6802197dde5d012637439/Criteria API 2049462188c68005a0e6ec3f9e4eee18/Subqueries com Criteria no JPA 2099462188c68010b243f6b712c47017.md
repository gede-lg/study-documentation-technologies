# Subqueries com Criteria no JPA

---

## Introdução

Subqueries são consultas internas (ou aninhadas) que retornam resultados usados pela consulta externa, sendo particularmente úteis para cenários de comparação e filtragem avançados. No contexto do JPA Criteria API, é possível criar subqueries de forma tipada, sem recorrer a Strings JPQL, garantindo segurança em tempo de compilação e maior flexibilidade para compor os critérios dinamicamente. Nesta explicação, veremos:

1. O que são subqueries e por que utilizá-las.
2. Como criar subqueries usando `CriteriaQuery.subquery`.
3. Exemplos de subquery em cláusulas `WHERE` (por exemplo, “buscar pedidos cujo valor seja maior que a média”).
4. Subqueries correlacionadas.
5. Quando e por que evitar subqueries.
6. Componentes-chave do Criteria API relacionados a esta funcionalidade.
7. Boas práticas ao empregar subqueries.
8. Um exemplo prático completo (cenário ponta a ponta).

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    
    2.1. Criação de Subquery com `CriteriaQuery.subquery`
    
    2.2. Uso de Subquery em `WHERE` (ex.: pedidos acima da média)
    
    2.3. Subqueries Correlacionadas
    
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restric%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

- **O que é uma Subquery?**
    
    Uma subquery (ou consulta aninhada) é uma consulta interna a outra, cujo resultado é utilizado pela consulta externa para filtrar, comparar ou agregar dados. Em SQL puro, uma subquery no `WHERE` pode retornar um valor escalar (ex.: média) ou um conjunto de valores (ex.: lista de IDs).
    
- **Por que usar Subqueries no Criteria API?**
    1. **Tipagem em tempo de compilação:** evita erros de digitação de JPQL
    2. **Flexibilidade dinâmica:** podemos montar a subquery de maneira programática, adicionando condições conforme lógica de negócio evolui
    3. **Manutenção facilitada:** ao usar metamodelo, renomeações de atributos nas entidades são detectadas em tempo de compilação
- **Quando preferir Subqueries?**
    - Quando a lógica de filtragem exige comparações com agregações (ex.: “filtrar clientes cujo número total de pedidos seja maior que X” ou “buscar itens com valor maior que a média”).
    - Em cenários de validações condicionais complexas, onde uma simples junção (`JOIN`) não expressa facilmente a restrição desejada.
    - Ao buscar dados que dependam de agregações por agrupamento interno.

---

## Sintaxe Detalhada e Uso Prático

A seguir, veremos como criar subqueries usando a API Criteria do JPA, cobrindo criação, utilização em cláusula `WHERE` e subqueries correlacionadas.

### 2.1. Criação de Subquery com `CriteriaQuery.subquery`

1. **Obter `CriteriaBuilder` e `CriteriaQuery` principais**
    
    ```java
    // 1. Pegar o EntityManager e CriteriaBuilder
    EntityManager em = /* obter EntityManager */;
    CriteriaBuilder cb = em.getCriteriaBuilder();
    
    // 2. Criar a consulta externa (CriteriaQuery)
    CriteriaQuery<Pedido> query = cb.createQuery(Pedido.class);
    Root<Pedido> pedidoRoot = query.from(Pedido.class);
    
    ```
    
2. **Criar uma Subquery (genérica) e definir seu tipo de retorno**
    
    ```java
    // 3. Criar a subquery, definindo o tipo de resultado (por exemplo, Double para média)
    Subquery<Double> subquery = query.subquery(Double.class);
    
    // 4. Definir Root da Subquery (normalmente a mesma entidade ou entidade relacionada)
    Root<Pedido> pedidoSub = subquery.from(Pedido.class);
    
    ```
    
3. **Montar a seleção e agregação na Subquery**
    
    ```java
    // 5. Selecionar a média de valorTotal de todos os Pedidos
    subquery.select(cb.avg(pedidoSub.get("valorTotal")));
    
    ```
    
4. **(Opcional) Adicionar condições na Subquery**
    
    ```java
    // 6. Adicionar filtros se necessário (exemplo: média apenas de pedidos de um certo status)
    subquery.where(cb.equal(pedidoSub.get("status"), StatusPedido.FECHADO));
    
    ```
    

### 2.2. Uso de Subquery em `WHERE`

- **Objetivo:** buscar todos os `Pedido` cujo `valorTotal` seja **maior** que a média geral (calculada pela subquery).
    
    ```java
    // 7. Na consulta externa, adicionar condição que compara valorTotal com resultado da subquery
    Predicate condicaoMaiorQueMedia =
        cb.greaterThan(pedidoRoot.get("valorTotal"), subquery);
    
    query.select(pedidoRoot)
         .where(condicaoMaiorQueMedia);
    
    // 8. Executar a consulta
    List<Pedido> resultados = em.createQuery(query).getResultList();
    
    ```
    
    **Comentário:**
    
    - `subquery` retorna um valor escalar (Double) que corresponde à média.
    - A chamada `greaterThan(...)` compara o campo `valorTotal` de cada `Pedido` com o valor retornado pela subquery.
- ***Variação: subquery retornando lista de IDs***
    
    Ex.: buscar **Clientes** que tenham feito **mais de 3 pedidos**.
    
    ```java
    // a) Criar CriteriaQuery principal (tipo Cliente)
    CriteriaQuery<Cliente> cQuery = cb.createQuery(Cliente.class);
    Root<Cliente> clienteRoot = cQuery.from(Cliente.class);
    
    // b) Criar Subquery que retorna IDs de Cliente que atendem à condição
    Subquery<Long> sq = cQuery.subquery(Long.class);
    Root<Pedido> pedidoSq = sq.from(Pedido.class);
    
    // c) Selecionar o cliente associado ao pedido e agrupar para contar quantos pedidos por cliente
    sq.select(pedidoSq.get("cliente").get("id"))
      .groupBy(pedidoSq.get("cliente").get("id"))
      .having(cb.gt(cb.count(pedidoSq), 3));
    
    // d) Na consulta principal, filtrar Clientes cujo ID esteja na lista da subquery
    cQuery.select(clienteRoot)
          .where(clienteRoot.get("id").in(sq));
    
    List<Cliente> clientes = em.createQuery(cQuery).getResultList();
    
    ```
    

### 2.3. Subqueries Correlacionadas

- **Definição:** subqueries correlacionadas referenciam atributos da entidade “pai” (consulta externa) diretamente, criando uma ligação dinâmica em cada linha avaliada.
- **Exemplo:** buscar `Pedido` cujo `valorTotal` seja maior que a média **dos pedidos do mesmo cliente**.
    
    ```java
    // 1. Consulta principal: CriteriaQuery<Pedido>
    CriteriaQuery<Pedido> cq = cb.createQuery(Pedido.class);
    Root<Pedido> rootPedido = cq.from(Pedido.class);
    
    // 2. Criar subquery para calcular média de valorTotal para o mesmo Cliente
    Subquery<Double> sqCorr = cq.subquery(Double.class);
    Root<Pedido> subPedidoCorr = sqCorr.from(Pedido.class);
    
    // 3. Correlacionar o cliente da consulta externa com o cliente da subquery
    sqCorr.select(cb.avg(subPedidoCorr.get("valorTotal")))
          .where(cb.equal(
              subPedidoCorr.get("cliente").get("id"),
              rootPedido.get("cliente").get("id")
          ));
    
    // 4. Na consulta externa, filtrar pedidos que excedem essa média
    cq.select(rootPedido)
      .where(cb.greaterThan(rootPedido.get("valorTotal"), sqCorr));
    
    List<Pedido> listaFiltrada = em.createQuery(cq).getResultList();
    
    ```
    
    **Comentário:**
    
    - Aqui, a subquery é recalculada para cada `Pedido` avaliado, pois `rootPedido.get("cliente").get("id")` faz referência ao cliente do pedido atual na consulta externa.
    - Assim, obtemos apenas os pedidos cujo valor ultrapassa a média dos próprios pedidos do cliente específico.

---

## Cenários de Restrição ou Não Aplicação

1. **Performance e Complexidade do SQL Gerado**
    - Subqueries podem gerar planos de execução mais complexos e, em grandes volumes de dados, desacelerar consultas. Em alguns bancos, subqueries correlacionadas especialmente são avaliadas para cada linha, impactando performance.
    - Em vez de subquery correlacionada pesada, considerar **JOIN + GROUP BY** ou **views materializadas** (se suportado pelo banco).
2. **Limitações do Banco de Dados**
    - Nem todos os bancos permitem subqueries em todos os lugares (por exemplo, subqueries em cláusula `FROM` podem ter restrições ou não ser suportadas).
    - Funções de agregação com subqueries podem variar entre dialects (Hibernate Dialect), exigindo testes de compatibilidade.
3. **Manutenção e Legibilidade**
    - Múltiplas subqueries aninhadas elevadas podem tornar o critério difícil de entender.
    - Em regras de negócio muito complexas, avaliar a criação de **Métodos Específicos** no repositório ou **NamedQueries** para isolar a complexidade.
4. **Limitação de Recursos de Memória**
    - Se a subquery retornar muito dados (ex.: lista grande de IDs), pode impactar uso de memória e gerar timeouts.

---

## Componentes Chave Associados

1. **CriteriaBuilder**
    - Classe central para construir expressões tipadas (`Predicate`, `Expression`, `Order`, etc.).
    - Métodos relevantes para subqueries:
        - `createQuery(Class<T> resultClass)`
        - `subquery(Class<X> type)`
2. **CriteriaQuery**
    - Representa a query principal que será executada.
    - Métodos:
        - `from(Class<X> entityClass)` → cria o `Root<X>` da entidade.
        - `select(Selection<? extends T> selection)` → define o que será selecionado.
        - `where(Predicate... restrictions)` → adiciona cláusulas `WHERE`.
        - `subquery(Class<X> type)` → cria e retorna um objeto `Subquery<X>` associado a esta CriteriaQuery.
3. **Subquery**
    - É **especialização** de `AbstractQuery<X>`, representando uma consulta interna.
    - Métodos principais:
        - `from(Class<Y> entityClass)` → cria o `Root<Y>` da subquery.
        - `select(Expression<? extends X> expression)` → define o que a subquery retorna (escalar ou entidade).
        - `where(Predicate... restrictions)` → adiciona filtros específicos à subquery.
        - `groupBy(Expression<?>... grouping)` e `having(Predicate... restrictions)` → agregações e filtros de grupo.
        - **Correlação:** em uma subquery correlacionada, usamos `Root<?> sub = subquery.from(...)` e referenciamos linhas da query externa diretamente (ex.: `rootPrincipal.get("campo")`).
4. **Root**
    - Representa a “tabela” (ou entidade) usada na CriteriaQuery ou Subquery.
    - Métodos para navegar atributos:
        - `get(String attributeName)` → cria expressão de caminho (path) para o atributo.
        - Em subqueries correlacionadas, é possível referenciar o `Root` da consulta externa diretamente.
5. **Metamodelo (opcional, mas recomendado)**
    - Ex.: `Pedido_.valorTotal` em vez de `"valorTotal"` (evita erros de string).
    - Gera classes estáticas que representam atributos de entidades.
6. **Predicates e Expressions**
    - Uso de `cb.equal(...)`, `cb.greaterThan(...)`, `cb.avg(...)`, `cb.count(...)`, `cb.exists(...)` etc.
    - Ao comparar campo com subquery, o próprio subquery (`Subquery<T>`) pode ser usado como `Expression<T>` em métodos de comparação.

---

## Melhores Práticas e Padrões de Uso

1. **Prefira Metamodelo (Criteria Static Metamodel)**
    - Evita má digitação de nomes de atributos.
    - Exemplo: `pedidoRoot.get(Pedido_.valorTotal)` em vez de `pedidoRoot.get("valorTotal")`.
2. **Evite Subqueries Correlacionadas Desnecessárias**
    - Sempre avalie se a mesma lógica pode ser obtida com um **JOIN + GROUP BY**. Em muitos bancos, isso resulta em plano de execução mais eficiente.
3. **Limite ao Escalar Dados**
    - Se a subquery retorna uma lista grande de IDs (ex.: `in (SELECT id FROM ...)`), considere transformar em **JOIN** ou restringir a lista antes.
4. **Teste SQL Gerado**
    - Habilitar logs SQL do Hibernate (`hibernate.show_sql=true`) para inspecionar se o SQL resultante é adequado.
    - Em casos de performance crítica, capturar o plano de execução (EXPLAIN) diretamente no banco.
5. **Reutilização de Subqueries**
    - Ao compor critérios dinâmicos, aproveite instâncias de `Predicate` e subqueries construídas previamente.
    - Por exemplo, faça métodos auxiliares que retornem `Subquery<?>` ou `Predicate` parametrizados.
6. **Separação de Responsabilidades**
    - Mantenha a lógica de Criteria em classes de repositório específicas (ex.: `PedidoRepositoryImpl`), isolando a complexidade do serviço ou controller.
7. **Documentação e Comentários**
    - Explique brevemente a finalidade de subqueries complexas, pois elas podem confundir quem der manutenção no código no futuro.

---

## Exemplo Prático Completo

**Cenário:**

- Duas entidades principais: `Cliente` e `Pedido`.
- `Cliente` (id, nome, email)
- `Pedido` (id, data, valorTotal, cliente [ManyToOne])
- Objetivo 1: buscar todos os `Pedido` cujo `valorTotal` é maior que a média de **todos** os pedidos.
- Objetivo 2: buscar todos os `Pedido` cujo `valorTotal` é maior que a média de pedidos **do mesmo cliente** (subquery correlacionada).

### 1. Mapeamento das Entidades (resumido)

```java
@Entity
@Table(name = "cliente")
public class Cliente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;

    // Getters e Setters omitidos
}

@Entity
@Table(name = "pedido")
public class Pedido {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_pedido")
    private LocalDate data;

    @Column(name = "valor_total")
    private Double valorTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // Getters e Setters omitidos
}

```

### 2. Implementação no Repositório (Criteria API)

```java
public class PedidoRepositoryImpl implements PedidoRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    /**
     * Objetivo: buscar pedidos cujo valorTotal > média de todos os pedidos.
     */
    @Override
    public List<Pedido> buscarPedidosAcimaMediaGlobal() {
        CriteriaBuilder cb = em.getCriteriaBuilder();

        // 1) Consulta externa
        CriteriaQuery<Pedido> query = cb.createQuery(Pedido.class);
        Root<Pedido> pedidoRoot = query.from(Pedido.class);

        // 2) Criar subquery que calcula a média global de valorTotal
        Subquery<Double> subqueryMedia = query.subquery(Double.class);
        Root<Pedido> subPedido = subqueryMedia.from(Pedido.class);
        subqueryMedia.select(cb.avg(subPedido.get("valorTotal")));

        // 3) Comparação valorTotal > média global
        Predicate condicao = cb.greaterThan(pedidoRoot.get("valorTotal"), subqueryMedia);

        // 4) Montar select e where na consulta principal
        query.select(pedidoRoot)
             .where(condicao);

        // 5) Executar e retornar resultados
        return em.createQuery(query).getResultList();
    }

    /**
     * Objetivo: buscar pedidos cujo valorTotal > média de pedidos do mesmo cliente (subquery correlacionada).
     */
    @Override
    public List<Pedido> buscarPedidosAcimaMediaPorCliente() {
        CriteriaBuilder cb = em.getCriteriaBuilder();

        // 1) Consulta externa
        CriteriaQuery<Pedido> query = cb.createQuery(Pedido.class);
        Root<Pedido> pedidoRoot = query.from(Pedido.class);

        // 2) Subquery correlacionada: média de valorTotal apenas dos pedidos do cliente atual
        Subquery<Double> subMediaPorCliente = query.subquery(Double.class);
        Root<Pedido> subPedido = subMediaPorCliente.from(Pedido.class);

        // 2.1) Selecionar média
        subMediaPorCliente.select(cb.avg(subPedido.get("valorTotal")));

        // 2.2) Vincular cliente da subquery ao cliente da consulta externa
        subMediaPorCliente.where(
            cb.equal(
                subPedido.get("cliente").get("id"),
                pedidoRoot.get("cliente").get("id")
            )
        );

        // 3) Condição na consulta principal
        Predicate condicao = cb.greaterThan(pedidoRoot.get("valorTotal"), subMediaPorCliente);

        query.select(pedidoRoot)
             .where(condicao);

        return em.createQuery(query).getResultList();
    }
}

```

### Explicação Passo a Passo

1. **`CriteriaBuilder cb = em.getCriteriaBuilder();`**
    
    Obtém o `CriteriaBuilder`, ponto de partida para criar qualquer CriteriaQuery.
    
2. **Consulta Externa (`CriteriaQuery<Pedido> query = cb.createQuery(Pedido.class);`)**
    
    Define que a query retornará instâncias de `Pedido`. O `Root<Pedido> pedidoRoot` representa cada linha de `Pedido` sendo avaliado.
    
3. **Criação da Subquery (`Subquery<Double> subqueryMedia = query.subquery(Double.class);`)**
    - Define que a subquery retornará `Double` (a média).
    - Em seguida, `Root<Pedido> subPedido = subqueryMedia.from(Pedido.class);` especifica a tabela da subquery (também `Pedido`).
4. **Seleção na Subquery (`subqueryMedia.select(cb.avg(subPedido.get("valorTotal")));`)**
    - Calcula a média de `valorTotal` de todos os pedidos (ou, no caso correlacionado, apenas de um cliente específico).
5. **Cláusula `WHERE` da Consulta Principal**
    - Usamos `cb.greaterThan(pedidoRoot.get("valorTotal"), subqueryMedia)` para comparar cada pedido com o valor médio obtido pela subquery.
6. **Execução (`em.createQuery(query).getResultList();`)**
    - Retorna a lista de `Pedido` que satisfazem a condição.

---

## Sugestões para Aprofundamento

- Documentação oficial do JPA Criteria API (JSR 338):
    - [https://download.oracle.com/otndocs/jcp/persistence-2_1-fr-eval-spec/index.html](https://download.oracle.com/otndocs/jcp/persistence-2_1-fr-eval-spec/index.html)
- Artigos práticos sobre Criteria Subqueries:
    - “JPA 2.0 Criteria API – Subqueries” (saturnvn.com/blog/jpa-criteria-subqueries)
    - “Hibernate Tips: Using Subqueries with Criteria API” (vladmihalcea.com)
- Livros recomendados:
    - *Pro JPA 2* (Mike Keith, Merrick Schincariol) – capítulos que tratam de Queries com Criteria
    - *Java Persistence with Hibernate* (Christian Bauer, Gavin King) – seção sobre subqueries e performance
- Fóruns e Q&A:
    - StackOverflow em português / inglês (tags: `hibernate`, `jpa-criteria`)
    - Grupos de usuários Java (portais como itexto.com.br)

---

Com isso, você possui uma visão clara e detalhada sobre como criar e usar subqueries com Criteria no JPA, além de entender cenários de aplicação, componentes-chave e boas práticas recomendadas. Qualquer dúvida adicional ou refinamento específico, fique à vontade para perguntar!