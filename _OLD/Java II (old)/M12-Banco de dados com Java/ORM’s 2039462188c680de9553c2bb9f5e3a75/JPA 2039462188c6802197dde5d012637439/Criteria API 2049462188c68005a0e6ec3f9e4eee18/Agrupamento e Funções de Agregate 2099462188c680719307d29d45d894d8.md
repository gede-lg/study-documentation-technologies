# Agrupamento e Funções de Agregate

---

## 1. Introdução

O uso de agrupamento (`GROUP BY`) e funções agregadas (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) é essencial quando precisamos obter estatísticas ou sumarizar dados em um banco de dados. No contexto do JPA Criteria API, essas operações permitem construir consultas dinamicamente, de maneira tipada e segura em tempo de compilação. A Criteria API abstrai a construção de consultas JPQL/HQL, fornecendo uma API fluente e orientada a objetos para criar `SELECT`, `GROUP BY`, `HAVING` etc., sem escrever strings de consulta diretamente.

Este material aborda como aplicar agrupamento e funções agregadas usando `CriteriaBuilder` e `CriteriaQuery`, incluindo:

- Conceitos fundamentais sobre agregação e agrupamento.
- Exemplos práticos de sintaxe no Criteria API.
- Situações em que o uso de agrupamento pode não ser recomendado.
- Componentes chave do Criteria envolvidos em agregações.
- Melhores práticas e considerações de performance.
- Exemplo completo de ponta a ponta: obtendo contagem e soma de pedidos por cliente, aplicando condições de `HAVING`.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
    
    1.1. O que são funções agregadas
    
    1.2. Diferença entre `GROUP BY` e `HAVING`
    
    1.3. Vantagens do Criteria API para agregações
    
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    
    2.1. Estrutura básica de uma consulta Criteria
    
    2.2. Selecionando funções agregadas com `CriteriaBuilder`
    
    2.3. Aplicando `groupBy`
    
    2.4. Filtrando grupos via `having`
    
    2.5. Variações de sintaxe (por exemplo, uso de `Tuple` ou classes DTO)
    
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
    
    3.1. Quando evitar agrupamentos complexos
    
    3.2. Limitações de portabilidade entre bancos de dados
    
    3.3. Operações que não são suportadas diretamente
    
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    
    4.1. `CriteriaBuilder`
    
    4.2. `CriteriaQuery<T>` (ou `CriteriaQuery<Tuple>`)
    
    4.3. `Root<T>`
    
    4.4. `Expression<X>` para agregações
    
    4.5. `Predicate` para cláusula `HAVING`
    
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
    
    5.1. Nomeação de alias e reuso de expressões
    
    5.2. Minimizar transferência de dados (projeções específicas)
    
    5.3. Cuidado com junções e desempenho
    
    5.4. Uso de índices e análise de planos
    
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
    
    6.1. Cenário: Entidades `Cliente` e `Pedido`
    
    6.2. Objetivo do relatório:
    
    - Contar quantos pedidos cada cliente fez
    - Somar o valor total de pedidos por cliente
    - Filtrar clientes com valor total de pedidos acima de um limite
        
        6.3. Definição simplificada das entidades
        
        6.4. Construção passo a passo da consulta Criteria
        
        6.5. Interpretação do resultado
        
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

### 3.1. O que são funções agregadas

Funções agregadas processam um conjunto de valores de uma coluna e retornam um único valor resumido, como:

- **`COUNT`**: Conta o número de registros ou valores não nulos de uma determinada coluna.
- **`SUM`**: Soma todos os valores numéricos em uma coluna.
- **`AVG`**: Calcula a média (aritmética) dos valores numéricos de uma coluna.
- **`MIN`**: Retorna o valor mínimo em uma coluna.
- **`MAX`**: Retorna o valor máximo em uma coluna.

Em SQL puro, o uso típico ficaria assim:

```sql
SELECT c.nome, COUNT(p.id) AS totalPedidos, SUM(p.valor) AS somaValores
FROM Cliente c
JOIN Pedido p ON p.cliente_id = c.id
GROUP BY c.nome
HAVING SUM(p.valor) > 1000.00;

```

No JPA Criteria API, usamos objetos Java para representar essas operações, de forma a manter tipagem estática e evitar erros de digitação de strings.

### 3.2. Diferença entre `GROUP BY` e `HAVING`

- **`GROUP BY`**: Agrupa linhas com valores iguais em colunas especificadas, permitindo calcular agregações por grupo.
- **`HAVING`**: Aplica condição de filtro após o agrupamento. Diferente do `WHERE`, que filtra linhas antes de agregação, o `HAVING` filtra grupos com base em resultados de funções agregadas.

### 3.3. Vantagens do Criteria API para agregações

- **Tipagem estática**: O compilador detecta erros de atributo inexistente ou tipo incompatível.
- **Flexibilidade dinâmica**: Permite construir consultas de forma programática, adicionando condições de filtro, ordenação e junções de forma condicional.
- **Integração com entidades Java**: Usa classes e atributos, evitando strings literais.

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1. Estrutura básica de uma consulta Criteria

1. **Obter o `CriteriaBuilder`** a partir do `EntityManager`.
    
    ```java
    EntityManager em = // ... obtido via injeção ou JPAUtil
    CriteriaBuilder cb = em.getCriteriaBuilder();
    
    ```
    
2. **Criar um `CriteriaQuery<T>`**, onde `T` pode ser:
    - Uma classe de entidade, se fosse um `SELECT c FROM Cliente c ...`.
    - Uma **Classe DTO** customizada (via construtor), se quisermos projetar diretamente em um objeto específico.
    - Um **`Tuple`**, se quisermos retornar várias colunas sem DTO – útil para agregações.
    
    Exemplo com `Tuple`:
    
    ```java
    CriteriaQuery<Tuple> cq = cb.createTupleQuery();
    
    ```
    
3. **Definir a raiz (`Root<T>`)** da consulta.
    
    ```java
    Root<Pedido> pedidoRoot = cq.from(Pedido.class);
    
    ```
    
4. **Construir seleções (projeções)**, junções, funções agregadas etc., usando `cb`.
5. **Incluir cláusulas `groupBy` e `having`**.
6. **Executar a consulta** via `TypedQuery` ou `Query`.

---

### 4.2. Selecionando funções agregadas com `CriteriaBuilder`

- **`cb.count(...)`**: conta linhas ou valores não nulos.
- **`cb.sum(...)`**: soma valores numéricos.
- **`cb.avg(...)`**: média aritmética.
- **`cb.min(...)`**: valor mínimo.
- **`cb.max(...)`**: valor máximo.

Exemplo genérico:

```java
// Propriedade "valor" do pedido (assumindo que seja BigDecimal, Double ou similar)
Expression<BigDecimal> somaValores = cb.sum(pedidoRoot.get("valor"));

// Contagem de IDs
Expression<Long> totalPedidos = cb.count(pedidoRoot.get("id"));

```

Para atribuir alias e facilitar referenciamento:

```java
cq.multiselect(
    clienteJoin.get("id").alias("clienteId"),
    totalPedidos.alias("qtdPedidos"),
    somaValores.alias("totalValor")
);

```

Neste exemplo, usamos `multiselect(...)` porque precisamos retornar múltiplos valores não mapeados diretamente em uma entidade. O `Tuple` resultante permite recuperar cada alias:

```java
List<Tuple> resultados = em.createQuery(cq).getResultList();

for (Tuple tuple : resultados) {
    Long clienteId   = tuple.get("clienteId", Long.class);
    Long qtdPedidos  = tuple.get("qtdPedidos", Long.class);
    BigDecimal total = tuple.get("totalValor", BigDecimal.class);
    // → lógica adicional
}

```

---

### 4.3. Aplicando `groupBy`

Depois de definir as seleções, usamos `groupBy(...)` passando as expressões correspondentes às colunas pelas quais queremos agrupar:

```java
// Agrupar por cliente (supondo join com Cliente)
Join<Pedido, Cliente> clienteJoin = pedidoRoot.join("cliente", JoinType.INNER);

cq.groupBy(clienteJoin.get("id"), clienteJoin.get("nome"));

```

**Observações:**

- Todos os atributos no `SELECT` que não fazem parte de uma função agregada devem aparecer no `GROUP BY`.
- Se desejarmos agrupar apenas por um campo, basta incluí-lo na lista.
- Podemos agrupar por múltiplos campos: `cb.tuple(clienteJoin.get("id"), clienteJoin.get("nome"))`, mas tipicamente listamos cada campo separadamente.

---

### 4.4. Filtrando grupos via `having`

O `HAVING` é usado para filtrar os resultados após o agrupamento, geralmente verificando valores resultantes de funções agregadas:

```java
// Criando expressão de soma
Expression<BigDecimal> somaValores = cb.sum(pedidoRoot.get("valor"));

// Definindo HAVING: somaValores > 1000.00
Predicate condicaoHaving = cb.greaterThan(somaValores, new BigDecimal("1000.00"));

cq.having(condicaoHaving);

```

### 4.5. Variações de sintaxe

- **`CriteriaQuery<Object[]>`**: Em vez de `Tuple`, podemos usar arrays de objetos:
    
    ```java
    CriteriaQuery<Object[]> cq = cb.createQuery(Object[].class);
    cq.multiselect(clienteJoin.get("id"), totalPedidos, somaValores);
    
    ```
    
    → O resultado vem como `Object[]`, seguindo a ordem das seleções.
    
- **DTO por Construtor**: Se tivermos uma classe DTO (e.g., `RelatorioClienteDTO`), podemos projetar diretamente:
    
    ```java
    // DTO com construtor (Long clienteId, Long qtdPedidos, BigDecimal totalValor)
    cq.select(cb.construct(
        RelatorioClienteDTO.class,
        clienteJoin.get("id"),
        totalPedidos,
        somaValores
    ));
    
    ```
    
    → Retorna lista de `RelatorioClienteDTO` sem necessidade de manipular `Tuple` ou `Object[]`.
    

---

## 5. Cenários de Restrição ou Não Aplicação

### 5.1. Quando evitar agrupamentos complexos

- **Grandes volumes de dados sem índices apropriados**: O agrupamento pode se tornar custoso se o banco não tiver índices nas colunas usadas em `GROUP BY`.
- **Filtros que devem ocorrer antes da agregação**: Se uma condição filtra linhas individuais (e não grupos), utilize `WHERE` em vez de `HAVING` para melhor performance.
- **Agrupar em colunas de texto muito longas**: Embora seja possível, agrupar por colunas extensas (e.g., `VARCHAR(1000)`) degrada performance. Melhor criar colunas de chave estrangeira ou chave reduzida para agrupar.

### 5.2. Limitações de portabilidade entre bancos

- Algumas funções específicas (e.g., funções de janela avançadas, `ROLLUP`, `CUBE`) não são suportadas diretamente no Criteria API padrão.
- A sintaxe gerada pelo JPA pode variar conforme o dialeto (por exemplo, diferenças entre PostgreSQL, MySQL, Oracle).

### 5.3. Operações que não são suportadas diretamente

- **Funções de janela** (WINDOW FUNCTIONS) — Criteria API não oferece abstrato para `OVER(...)`.
- **`GROUPING SETS`** e variantes avançadas de agrupamento — não há suporte nativo.
- **Funções específicas de cada SGBD** — como `GROUP_CONCAT` no MySQL: somente via `cb.function(...)`, sem tipagem estática.

---

## 6. Componentes Chave Associados

### 6.1. `CriteriaBuilder`

- Fábrica para criar expressões, predicates, funções agregadas, ordenações etc.
- Métodos mais comuns para agregações:
    - `cb.count(Expression<?>)`
    - `cb.sum(Expression<? extends Number>)`
    - `cb.avg(Expression<? extends Number>)`
    - `cb.min(Expression<? extends Comparable>)`
    - `cb.max(Expression<? extends Comparable>)`
    - `cb.groupBy(...)` e `cb.having(...)` não existem diretamente no `CriteriaBuilder`; são métodos de `CriteriaQuery`.

### 6.2. `CriteriaQuery<T>` (ou `CriteriaQuery<Tuple>`)

- Representa a própria consulta. Dependendo de `T`, a consulta retorna uma entidade, um DTO ou um `Tuple`.
- Métodos principais:
    - `from(Class<T>)`: define a raiz (root).
    - `select(...)` ou `multiselect(...)`: define a projeção (colunas).
    - `groupBy(...)`: recebe uma lista de expressões para agrupar.
    - `having(Predicate...)`: define condições posteriores ao agrupamento.
    - `where(Predicate...)`: condição antes da agregação.

### 6.3. `Root<T>`

- Representa a entidade base de onde partem as seleções e junções.
- Exemplo: `Root<Pedido> pedidoRoot = cq.from(Pedido.class);`

### 6.4. `Expression<X>` para agregações

- Qualquer atributo obtido via `root.get("campo")` ou uma junção `join.get("campo")` gera um `Path<?>`, que é uma subclasse de `Expression<?>`.
- Quando aplicamos `cb.sum(path)`, recebemos outra `Expression<Number>`.
- É possível encadear métodos em expressões: e.g., `cb.avg(cb.sum(...))`, embora tenha pouco uso prático.

### 6.5. `Predicate` para cláusula `HAVING`

- Usado para construir condições booleanas (iguais, maiores, menores) que podem ser aplicadas em `WHERE` ou em `HAVING`.
- Exemplo: `cb.greaterThan(cb.sum(...), valorLimite)` retorna um `Predicate`.

---

## 7. Melhores Práticas e Padrões de Uso

### 7.1. Nomeação de alias e reuso de expressões

- **Alias**: Sempre que possível, atribua alias às expressões agregadas com `.alias("nome")`. Facilita a leitura do resultado (`Tuple.get("nome", Tipo.class)`).
- **Reuso**: Se uma expressão agregada for usada tanto no `SELECT` quanto no `HAVING`, armazene-a numa variável local para não duplicar a construção:
    
    ```java
    Expression<BigDecimal> somaValores = cb.sum(pedidoRoot.get("valor"));
    cq.multiselect(clienteJoin.get("id").alias("idCliente"), somaValores.alias("somaTotal"));
    cq.having(cb.greaterThan(somaValores, new BigDecimal("1000.00")));
    
    ```
    

### 7.2. Minimizar transferência de dados (projeções específicas)

- Em vez de retornar entidades inteiras, use `Tuple`, `Object[]` ou DTOs para retornar apenas os campos necessários. Reduz o volume de dados trafegado.

### 7.3. Cuidado com junções e desempenho

- Junções via `join()` geram `INNER JOIN` (por padrão). Se necessário, use `LEFT JOIN` (`JoinType.LEFT`) para incluir registros sem correspondência.
- Evite junções desnecessárias: se você precisa apenas de um campo de identificação (chave estrangeira), use `root.get("cliente").get("id")` em vez de `join("cliente")` se o mapeamento permitir.

### 7.4. Uso de índices e análise de planos

- As colunas usadas em `GROUP BY` e em comparações de `HAVING` devem ser indexadas, se possível, para acelerar o processamento.
- Sempre é recomendável analisar o plano de execução (EXPLAIN) para verificar se o banco está usando índices corretamente.

---

## 8. Exemplo Prático Completo

### 8.1. Cenário

Temos duas entidades:

- **Cliente**: representa um cliente da aplicação.
- **Pedido**: representa um pedido realizado por determinado cliente.

**Objetivos do relatório**:

1. Contar quantos pedidos cada cliente fez (`COUNT(p.id)`).
2. Somar o valor total de pedidos por cliente (`SUM(p.valor)`).
3. Filtrar clientes cujo valor total de pedidos seja maior que R$ 1.000,00 (`HAVING SUM(p.valor) > 1000`).

### 8.2. Definição simplificada das entidades

```java
@Entity
@Table(name = "cliente")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    // getters e setters omitidos
}

@Entity
@Table(name = "pedido")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Valor unitário ou total do pedido
    private BigDecimal valor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // getters e setters omitidos
}

```

### 8.3. Construção passo a passo da consulta Criteria

```java
public List<RelatorioClienteDTO> buscarRelatorioPorCliente(EntityManager em, BigDecimal valorMinimo) {
    // 1. Obtém o CriteriaBuilder
    CriteriaBuilder cb = em.getCriteriaBuilder();

    // 2. Cria CriteriaQuery retornando DTO diretamente
    CriteriaQuery<RelatorioClienteDTO> cq = cb.createQuery(RelatorioClienteDTO.class);

    // 3. Define a raiz como a entidade Pedido
    Root<Pedido> pedidoRoot = cq.from(Pedido.class);

    // 4. Faz o JOIN com Cliente
    Join<Pedido, Cliente> clienteJoin = pedidoRoot.join("cliente", JoinType.INNER);

    // 5. Define expressões de agregação
    // 5.1. Contar quantidade de pedidos por cliente
    Expression<Long> qtdPedidos = cb.count(pedidoRoot.get("id"));

    // 5.2. Somar o valor total de pedidos por cliente
    Expression<BigDecimal> somaValores = cb.sum(pedidoRoot.get("valor"));

    // 6. Projeta no DTO via construtor
    //    RelatorioClienteDTO(Long idCliente, String nomeCliente, Long quantidadePedidos, BigDecimal valorTotal)
    cq.select(cb.construct(
        RelatorioClienteDTO.class,
        clienteJoin.get("id"),
        clienteJoin.get("nome"),
        qtdPedidos.alias("quantidadePedidos"),
        somaValores.alias("valorTotal")
    ));

    // 7. Agrupa pelo ID e nome do cliente
    cq.groupBy(clienteJoin.get("id"), clienteJoin.get("nome"));

    // 8. HAVING para filtrar clientes com somaValores > valorMinimo
    cq.having(cb.greaterThan(somaValores, valorMinimo));

    // 9. (Opcional) ORDER BY valorTotal descendentemente
    cq.orderBy(cb.desc(somaValores));

    // 10. Executa a consulta
    TypedQuery<RelatorioClienteDTO> query = em.createQuery(cq);
    return query.getResultList();
}

```

### 8.3.1. Explicação detalhada do código

1. **`CriteriaBuilder cb = em.getCriteriaBuilder();`**
    
    Obtém o objeto que nos permite criar expressões (seleções, agregações, predicados etc.).
    
2. **`CriteriaQuery<RelatorioClienteDTO> cq = cb.createQuery(RelatorioClienteDTO.class);`**
    
    Prepara uma consulta cuja projeção final será a classe `RelatorioClienteDTO`.
    
3. **`Root<Pedido> pedidoRoot = cq.from(Pedido.class);`**
    
    Define que a entidade base (`FROM`) é `Pedido`.
    
4. **`Join<Pedido, Cliente> clienteJoin = pedidoRoot.join("cliente", JoinType.INNER);`**
    
    Realiza o `INNER JOIN` entre `Pedido` e `Cliente` através do atributo mapeado `cliente`.
    
5. **Expressões de agregação**
    - `Expression<Long> qtdPedidos = cb.count(pedidoRoot.get("id"));` → Conta número de pedidos.
    - `Expression<BigDecimal> somaValores = cb.sum(pedidoRoot.get("valor"));` → Soma dos valores dos pedidos.
6. **Projeção via construtor de DTO**
    - `cb.construct(...)` cria instâncias de `RelatorioClienteDTO` com base no construtor que recebe `(idCliente, nomeCliente, quantidadePedidos, valorTotal)`.
    - Usamos `alias("quantidadePedidos")` e `alias("valorTotal")` para facilitar leitura do resultado, embora não seja estritamente necessário se projetarmos diretamente no DTO.
7. **`cq.groupBy(clienteJoin.get("id"), clienteJoin.get("nome"));`**
    
    Agrupa por ID e nome do cliente, cobrindo todos os campos não-agrupados no `SELECT`.
    
8. **`cq.having(cb.greaterThan(somaValores, valorMinimo));`**
    
    Filtra apenas casos em que a soma de `valor` por cliente ultrapasse o parâmetro `valorMinimo`. Este é o filtro aplicado **depois** do agrupamento.
    
9. **`cq.orderBy(cb.desc(somaValores));`**
    
    Ordena o resultado decrescentemente com base no valor total de pedidos. Opcional, mas comum em relatórios para destacar maiores valores.
    
10. **Execução**
    - `TypedQuery<RelatorioClienteDTO> query = em.createQuery(cq);`
    - `return query.getResultList();`

### 8.3.2. Classe DTO de projeção

```java
public class RelatorioClienteDTO {
    private Long idCliente;
    private String nomeCliente;
    private Long quantidadePedidos;
    private BigDecimal valorTotal;

    public RelatorioClienteDTO(Long idCliente, String nomeCliente, Long quantidadePedidos, BigDecimal valorTotal) {
        this.idCliente = idCliente;
        this.nomeCliente = nomeCliente;
        this.quantidadePedidos = quantidadePedidos;
        this.valorTotal = valorTotal;
    }

    // getters e setters (ou apenas getters se imutável)
}

```

### 8.4. Interpretação do resultado

Ao chamar:

```java
BigDecimal limite = new BigDecimal("1000.00");
List<RelatorioClienteDTO> relatorios = buscarRelatorioPorCliente(em, limite);

for (RelatorioClienteDTO dto : relatorios) {
    System.out.printf("Cliente [%d - %s]: Pedidos = %d, Valor Total = R$ %.2f%n",
        dto.getIdCliente(),
        dto.getNomeCliente(),
        dto.getQuantidadePedidos(),
        dto.getValorTotal()
    );
}

```

Teremos saída similar a:

```
Cliente [3 - Maria Silva]: Pedidos = 5, Valor Total = R$ 2.340,00
Cliente [7 - João Santos]: Pedidos = 8, Valor Total = R$ 1.250,50
...

```

Somente aparecerão clientes cujo total de pedidos exceda R$ 1.000,00. A ordenação descendente de `valorTotal` garante que o cliente com maior soma apareça primeiro.

---

## 9. Sugestões para Aprofundamento

1. **Comparar com JPQL puro**: veja como a mesma consulta se traduz em JPQL para entender as diferenças de sintaxe e quando optar por cada abordagem.
    
    ```
    SELECT new com.exemplo.RelatorioClienteDTO(
        c.id, c.nome, COUNT(p.id), SUM(p.valor)
    )
    FROM Pedido p
    JOIN p.cliente c
    GROUP BY c.id, c.nome
    HAVING SUM(p.valor) > :valorMinimo
    ORDER BY SUM(p.valor) DESC
    
    ```
    
2. **Funções específicas de banco**: experimente usar `cb.function("FUNCTION_NAME", ...)` para chamadas de funções proprietárias, como `TO_CHAR` no Oracle ou `GROUP_CONCAT` no MySQL.
3. **Paginação em consultas com agregação**: perceba que nem todos os provedores de JPA permitem paginação (`setFirstResult`/`setMaxResults`) após `GROUP BY` sem adaptações. Teste seu cenário específico.
4. **Análise de plano de execução**: utilize ferramentas de profiling do banco para verificar índices usados, cost estimates e otimizar colunas de agrupamento.
5. **Subconsultas com agregação**: combine `subquery` em Criteria para cenários avançados, como obter registros cuja soma agregada encontra-se em certo intervalo.

---

**Conclusão:**

Este guia detalhou o uso de agrupamento (`groupBy`) e funções agregadas (`cb.count`, `cb.sum`, `cb.avg`, `cb.min`, `cb.max`) no JPA Criteria API. Você aprendeu desde os conceitos fundamentais até um exemplo completo de relatório de pedidos por cliente, incluindo cláusula `HAVING` para filtrar grupos. Seguindo as melhores práticas de projeção, alias e reuso de expressões, suas consultas se tornarão legíveis, eficientes e fáceis de manter.