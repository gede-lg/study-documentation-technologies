# Consultas Dinâmicas: Construção Condicional de Predicates, CriteriaQuery e Uso de distinct

---

## 1. Introdução

As APIs de Criteria no JPA permitem montar consultas de forma programática, sem recorrer a strings JPQL “hard coded”. Para cenários em que os parâmetros de busca são opcionais (por exemplo: filtros de pesquisa avançada, caixas de busca com múltiplos filtros) e podem ou não estar presentes, a construção dinâmica de consultas usando `CriteriaBuilder`, `CriteriaQuery` e uma lista de `Predicate` torna-se essencial. Além disso, ao precisar evitar resultados duplicados, usamos `criteriaQuery.distinct(true)`.

Este documento apresenta:

- Uma **visão geral concisa** do conceito de consultas dinâmicas com JPA Criteria (sem exemplos de sintaxe)
- Uma **explicação detalhada e completa**, com exemplos de código comentados e seções específicas para os tópicos solicitados

---

## 2. Sumário

1. **Título da Explicação**
2. **Introdução**
3. **Visão Geral Concisa**
4. **Conceitos Fundamentais**
    - 4.1 O que é JPA Criteria
    - 4.2 Por que usar consultas dinâmicas
    - 4.3 Fluxo de construção de uma CriteriaQuery
5. **Sintaxe Detalhada e Uso Prático**
    - 5.1 Preparando o ambiente (EntityManager, CriteriaBuilder)
    - 5.2 Criando `CriteriaQuery<T>` e `Root<T>`
    - 5.3 Montando lista de `Predicate` condicional
    - 5.4 Combinando Predicates (AND, OR, etc.)
    - 5.5 Aplicando filtros opcionais
    - 5.6 Definindo `distinct(true)`
    - 5.7 Executando a consulta e obtendo resultados
6. **Cenários de Restrição ou Não Aplicação**
    - 6.1 Quando não usar Criteria (complexidade/performance)
    - 6.2 Casos em que JPQL ou Native Query são mais adequados
7. **Componentes Chave Associados**
    - 7.1 `CriteriaBuilder`
    - 7.2 `CriteriaQuery<T>`
    - 7.3 `Root<T>`
    - 7.4 `Predicate`
    - 7.5 `TypedQuery<T>`
    - 7.6 Métodos auxiliares (joins, subqueries, ordens, agrupamentos)
8. **Melhores Práticas e Padrões de Uso**
    - 8.1 Manter código legível e modularizado
    - 8.2 Reutilização de métodos de geração de Predicates
    - 8.3 Atenção ao fetch e N+1
    - 8.4 Uso cauteloso de `distinct` no SQL gerado
    - 8.5 Tratamento de paginação (Pageable)
9. **Exemplo Prático Completo**
    - 9.1 Cenário: entidade `Produto` com filtros opcionais
    - 9.2 Modelo da entidade
    - 9.3 Método de repositório genérico (DAO/Repository) com Criteria
    - 9.4 Demonstração passo a passo (comentado)
    - 9.5 Teste de uso
10. **Sugestões para Aprofundamento**
    - 10.1 Documentação oficial do JPA
    - 10.2 Padrões de Specification (Spring Data JPA)
    - 10.3 Ferramentas de Querydsl ou ModelMapper

---

## 3. Visão Geral Concisa

- **JPA Criteria** é uma API de construção de consultas de forma programática.
- Ao montar **consultas dinâmicas**, utilizamos:
    1. `CriteriaBuilder` (para criar elementos de consulta)
    2. `CriteriaQuery<T>` (para definir o tipo de resultado)
    3. `Root<T>` (para referenciar a entidade raiz)
    4. Uma **lista de `Predicate`** que agrupa condições opcionais (por exemplo, somente inclui o filtro se o parâmetro não for nulo ou não estiver vazio).
    5. Chamamos `criteriaQuery.where(predicates.toArray(new Predicate[0]))` para agregar filtros.
    6. Se quisermos evitar duplicatas, fazemos `criteriaQuery.distinct(true)`.
- O resultado final é um `TypedQuery<T>` obtido via `entityManager.createQuery(criteriaQuery)`, do qual podemos invocar `getResultList()` ou `getSingleResult()`.
- **Vantagem principal:** flexibilidade para montar filtros “sob demanda” sem concatenar strings JPQL manualmente.
- **Pontos de atenção:** Performance (SQL muito complexo), necessidade de entender bem as interfaces (`Root`, `Join`, etc.) e geração de SQL às vezes verboso.

---

## 4. Conceitos Fundamentais

### 4.1 O que é JPA Criteria

O JPA Criteria (portátil entre implementações como Hibernate, EclipseLink, etc.) é uma API padrão para criar consultas de forma tipada e programática. Em vez de criar JPQL como algo semelhante a `SELECT p FROM Produto p WHERE p.nome LIKE :nome`, montamos objetos Java para representar cada parte da consulta.

### 4.2 Por que usar consultas dinâmicas

- **Filtros opcionais:** Em telas de pesquisa onde alguns campos podem ficar em branco, evitamos lógica complexa de concatenar trechos de JPQL.
- **Segurança de tipo:** Evita erros de sintaxe em strings de JPQL e possibilita refactoring mais seguro (IDE aponta se a entidade ou atributo mudar de nome).
- **Manutenibilidade:** Código mais centralizado, onde cada condição é adicionada somente se o parâmetro existir.
- **Evita duplicação de lógica:** Em classes utilitárias ou repositórios genéricos, podemos reutilizar métodos auxiliares para montagem de Predicates.

### 4.3 Fluxo de construção de uma `CriteriaQuery`

1. **Obter o `CriteriaBuilder`** a partir do `EntityManager`:
    
    ```java
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
    
    ```
    
2. **Criar um `CriteriaQuery<T>`**, indicando o tipo de resultado (pode ser um DTO ou a própria entidade):
    
    ```java
    CriteriaQuery<Produto> cq = cb.createQuery(Produto.class);
    
    ```
    
3. **Definir a raiz da consulta** (`Root<T> root = cq.from(Produto.class)`), que representa a entidade principal a ser consultada.
4. **Criar uma lista mutável de `Predicate`** (por ex. `List<Predicate> predicates = new ArrayList<>()`), onde cada condição só será adicionada se seu parâmetro de busca estiver presente.
5. **Construir cada condição** com métodos do `CriteriaBuilder` (por ex. `cb.like`, `cb.equal`, `cb.greaterThanOrEqualTo`, etc.) usando `root.get("campo")` ou `root.get(Entity_.campo)` (caso use metamodelo).
6. **Adicionar cada `Predicate` à lista** se o atributo de filtro não for nulo ou vazio.
7. **Unir todos `Predicate`** em uma expressão única via `cb.and(predicates.toArray(...))` (ou `cb.or`, conforme caso).
8. **Aplicar o `where(...)`** na `CriteriaQuery`:
    
    ```java
    cq.where(cb.and(predicates.toArray(new Predicate[0])));
    
    ```
    
9. **Opcional:** Se quisermos resultados distintos, invocar `cq.distinct(true)`.
10. **Criar o `TypedQuery<T>`**:
    
    ```java
    TypedQuery<Produto> query = entityManager.createQuery(cq);
    
    ```
    
11. **Passar parâmetros** (caso use `:param`) ou configurar paginação.
12. **Executar**: `List<Produto> resultados = query.getResultList();`

---

## 5. Sintaxe Detalhada e Uso Prático

A seguir, apresentamos cada passo com exemplos comentados.

### 5.1 Preparando o ambiente

1. **`EntityManager`:** normalmente injetado ou obtido em um DAO/Repository.
    
    ```java
    @PersistenceContext
    private EntityManager entityManager;
    
    ```
    
2. **Obter `CriteriaBuilder`:**
    
    ```java
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
    
    ```
    

### 5.2 Criando `CriteriaQuery<T>` e `Root<T>`

- Exemplo: queremos consultar a entidade `Produto`.
- Definimos o tipo de retorno como `Produto`.

```java
// 1. Criar CriteriaQuery para Produto
CriteriaQuery<Produto> cq = cb.createQuery(Produto.class);

// 2. Definir a raiz (root) da consulta
Root<Produto> root = cq.from(Produto.class);

```

### 5.3 Montando lista de `Predicate` condicional

- Inicializamos uma lista vazia:
    
    ```java
    List<Predicate> predicates = new ArrayList<>();
    
    ```
    
- Para cada campo de filtro (por ex., `nome`, `categoria`, `precoMin`, `precoMax`, `disponivel`), só adicionamos se o parâmetro não for nulo (ou não estiver vazio).

### Exemplo de parâmetros de pesquisa (DTO ou simples variables):

```java
String nome;           // ex: "camisa"
List<String> categorias; // ex: ["Roupas", "Promoção"]
BigDecimal precoMin;   // ex: new BigDecimal("50.00")
BigDecimal precoMax;   // ex: new BigDecimal("200.00")
Boolean disponivel;    // ex: true (só listar produtos disponíveis)

```

### Código para montar Predicates:

```java
// Filtro por nome (LIKE)
if (nome != null && !nome.trim().isEmpty()) {
    predicates.add(cb.like(
        cb.lower(root.get("nome")),
        "%" + nome.trim().toLowerCase() + "%"
    ));
}

// Filtro por lista de categorias (IN)
if (categorias != null && !categorias.isEmpty()) {
    // root.get("categoria") assume que 'categoria' é um atributo String
    // Se for associação ManyToOne, usar root.join("categoria").get("nome")
    predicates.add(root.get("categoria").in(categorias));
}

// Filtro por preço mínimo (>=)
if (precoMin != null) {
    predicates.add(cb.greaterThanOrEqualTo(root.get("preco"), precoMin));
}

// Filtro por preço máximo (<=)
if (precoMax != null) {
    predicates.add(cb.lessThanOrEqualTo(root.get("preco"), precoMax));
}

// Filtro por disponibilidade (=)
if (disponivel != null) {
    predicates.add(cb.equal(root.get("disponivel"), disponivel));
}

```

> Observação:
> 
> - É recomendável usar `cb.lower(...)` e `like`, convertendo o lado do banco e o parâmetro para minúsculo, assegurando busca case-insensitive.
> - Para campos de tipo numérico ou data, usar `greaterThan`, `lessThan`, `between`, conforme necessidade.
> - Se a entidade referenciar outras entidades (`Join`), instanciar `Join<Produto, Categoria> joinCat = root.join("categoria");` e então filtrar `joinCat.get("nome")`.

### 5.4 Combinando Predicates

Após preencher a lista (`predicates`), combinamos todos com `cb.and(...)` (todas as condições devem ser verdadeiras) ou, se for o caso, `cb.or(...)`. Exemplo:

```java
if (!predicates.isEmpty()) {
    cq.where(cb.and(predicates.toArray(new Predicate[0])));
}

```

- Se `predicates` estiver vazio, não chamamos `where(...)` ou chamamos `cq.where(new Predicate[0])`, que equivale a não ter filtros adicionais.

### 5.5 Aplicando filtros opcionais

- Todos os `if` acima asseguram que cada condição só entrará se o parâmetro existir.
- Essa lógica remove a necessidade de múltiplos blocos `if-else` concatenando JPQL manualmente.

### 5.6 Definindo `distinct(true)`

Para evitar linhas repetidas (por exemplo, quando há `JOIN FETCH` e a mesma entidade pai aparece várias vezes), usamos:

```java
cq.distinct(true);

```

- Deve ser chamado **antes** de `entityManager.createQuery(cq)`.
- Internamente, isso traduz para `SELECT DISTINCT p FROM Produto p ...`.
- Cuidado: em consultas com muitos joins, pode gerar SQL pesado.

### 5.7 Ordenação e Paginação (Opcional)

### Ordenação

```java
// Exemplo: ordenar por nome ascendente
cq.orderBy(cb.asc(root.get("nome")));

```

- Para múltiplas colunas, usar lista: `List<Order> orderList = new ArrayList<>(); orderList.add(cb.desc(root.get("preco"))); ...; cq.orderBy(orderList);`

### Paginação (Pageable)

Após criar `TypedQuery<Produto> query = entityManager.createQuery(cq);`:

```java
int pagina = 0;      // primeira página (zero-based)
int tamanho = 20;    // itens por página
query.setFirstResult(pagina * tamanho);
query.setMaxResults(tamanho);
List<Produto> resultados = query.getResultList();

```

### 5.8 Executando a consulta e obtendo resultados

```java
TypedQuery<Produto> typedQuery = entityManager.createQuery(cq);
// Se houver parâmetros, eles já foram “embutidos” na Predicate, logo não há setParameter.
// Aplicar paginação/limites, se necessário:
typedQuery.setFirstResult(offset);
typedQuery.setMaxResults(limit);

List<Produto> lista = typedQuery.getResultList();

```

- Para obter um único resultado (quando se sabe que retornará no máximo 1), usar `typedQuery.getSingleResult()`, mas cuidado com `NoResultException` ou `NonUniqueResultException`.

---

## 6. Cenários de Restrição ou Não Aplicação

### 6.1 Quando não usar Criteria

1. **Consultas extremamente complexas de agregação** (muitos subselects, funções de janela etc.). Nesses casos, o SQL gerado pode ficar difícil de entender ou otimizar.
2. **Performance crítica**: se for necessário escrever SQL optimizado com hints de banco, ou usar recursos específicos do SGDB, Native Query pode ser preferível.
3. **Relatórios ad-hoc**: quando há necessidade de colunas calculadas complexas (por ex. funções de agrupamento avançadas, pivot tables), é mais prático usar SQL nativo.
4. **Manutenção de consultas legadas**: se já existe uma coleção extensa de JPQL ou Native Queries testadas, migrar tudo pode ser custoso.

### 6.2 Casos em que JPQL ou Native Query são mais adequados

- **JPQL simples e estático**: para queries que raramente mudam e não possuem condicionais opcionais, usar JPQL puro (ou anotação `@NamedQuery`) pode ser mais enxuto.
- **Consultas específicas para relatórios**: onde se requer colunas que não mapeiam diretamente para entidades (DTOs customizados, agregações).
- **Queries que utilizem features específicas do banco** (por exemplo, funções proprietárias, índices sólidos, hints de execução).
- **Projetos que já adotam Querydsl ou outras bibliotecas que geram classes de consulta**—às vezes, é mais vantajoso manter essa abordagem.

---

## 7. Componentes Chave Associados

### 7.1 `CriteriaBuilder`

- **Função:** fábrica para construir instâncias de `CriteriaQuery`, `Predicate`, `Expression`, `Order`, entre outros.
- **Uso principal:** obter instância: `CriteriaBuilder cb = entityManager.getCriteriaBuilder();`

### 7.2 `CriteriaQuery<T>`

- **Função:** representa a consulta como um todo, tipada no retorno (por ex. `CriteriaQuery<Produto>`).
- **Principais métodos:**
    - `from(Class<T> entityClass)` → retorna `Root<T>`.
    - `select(Selection<? extends T> selection)` → define quais campos/entidades serão selecionados.
    - `where(Predicate...)` → aplica condições.
    - `orderBy(Order... orders)` → ordenação.
    - `distinct(boolean distinct)` → define se será `SELECT DISTINCT`.

### 7.3 `Root<T>`

- **Função:** define a entidade raiz da consulta.
- **Uso:** `Root<Produto> root = cq.from(Produto.class);`
- **Principais métodos:**
    - `get(String attributeName)` → acessa atributo simples (coluna).
    - `join(String attributeName)` → realiza `JOIN` com outra entidade associada.
    - `fetch(String attributeName, JoinType jt)` → `JOIN FETCH`.

### 7.4 `Predicate`

- **Função:** representa uma expressão booleana (condição) na cláusula `WHERE`.
- **Construção:** via `CriteriaBuilder`:
    - `cb.equal(expr1, expr2)`
    - `cb.like(expr, pattern)`
    - `cb.greaterThan`, `cb.lessThanOrEqualTo`, etc.
- **Combinação:**
    - `cb.and(p1, p2, ...)`
    - `cb.or(p1, p2, ...)`
    - `cb.not(p)`

### 7.5 `TypedQuery<T>`

- **Função:** query executável, construída a partir de `CriteriaQuery`.
- **Obtido por:** `TypedQuery<Produto> query = entityManager.createQuery(cq);`
- **Uso:**
    - `List<Produto> resultados = query.getResultList();`
    - `Produto unico = query.getSingleResult();`
    - `query.setFirstResult(...)`, `query.setMaxResults(...)` para paginação.

### 7.6 Métodos Auxiliares (Joins, Subqueries, Agrupamentos)

- **`root.join("atributo")`:** retorna `Join<Entidade, OutroEntidade>`.
- **`cb.countDistinct(...)`:** para agregações com distinct.
- **Subquery:**
    
    ```java
    Subquery<Long> subq = cq.subquery(Long.class);
    Root<Pedido> rootPedido = subq.from(Pedido.class);
    subq.select(cb.count(rootPedido.get("id")))
        .where(cb.equal(rootPedido.get("produto").get("id"), root.get("id")));
    
    ```
    
- **Agrupamento:**
    
    ```java
    cq.groupBy(root.get("categoria"));
    cq.having(cb.gt(cb.count(root), 5));
    
    ```
    

---

## 8. Melhores Práticas e Padrões de Uso

1. **Modularizar a construção de Predicates:** crie métodos auxiliares para cada tipo de filtro. Por ex.:
    
    ```java
    private Predicate filtroPorNome(String nome, CriteriaBuilder cb, Root<Produto> root) {
        if (nome == null || nome.trim().isEmpty()) return cb.conjunction();
        return cb.like(cb.lower(root.get("nome")), "%" + nome.trim().toLowerCase() + "%");
    }
    
    ```
    
    - Assim, fica mais legível e reutilizável.
2. **Usar Metamodelo Estático:**
    - Gerar classes `Produto_`, `Categoria_` para referenciar atributos de forma tipada (ex.: `root.get(Produto_.nome)` em vez de `root.get("nome")`).
    - Vantagem: erros detectados em tempo de compilação.
3. **Evitar SELECT N+1:** se precisar trazer associações, usar `fetch` (ex.: `root.fetch("categoria", JoinType.LEFT)`) ou `JOIN FETCH` em JPQL.
    - Mas cuidado: `fetch` pode quebrar paginação em alguns provedores.
4. **Cuidado com `distinct(true)` em Queries com muitos joins:**
    - O SQL gerado tende a usar `SELECT DISTINCT`. Em joins 1:N, pode duplicar linhas e ainda filtrar corretamente com distinct, mas custo de performance aumenta.
5. **Paginação de resultados grandes:**
    - Defina `setFirstResult()` e `setMaxResults()` no `TypedQuery` antes de executar.
    - Caso tenha joins, use apenas joins estritamente necessários para criteria de filtros.
6. **Tratamento de parâmetros nulos:**
    - Sempre verifique se o parâmetro está nulo (ou vazio, no caso de `String` ou `List`).
    - Se não quiser incluir o filtro, não adicione o `Predicate` correspondente.
7. **Log de SQL:** habilitar `hibernate.show_sql=true` e `hibernate.format_sql=true` em ambiente de desenvolvimento para visualizar o SQL gerado e identificar eventuais gargalos.
8. **Documentar casos de uso:**
    - Se o mesmo padrão de filtros for usado em várias partes do sistema, crie uma classe utilitária de Criteria (por ex., `ProdutoSpecs`) para centralizar filtros.

---

## 9. Exemplo Prático Completo

### 9.1 Cenário

- Entidade **Produto** com atributos:
    - `Long id`
    - `String nome`
    - `String categoria`
    - `BigDecimal preco`
    - `Boolean disponivel`
    - `LocalDate dataCriacao`
- Necessidade:
    - Buscar produtos filtrando **opcionalmente** por:
        1. `nome` (string contida)
        2. Lista de `categorias` (IN)
        3. `precoMin` (valor mínimo)
        4. `precoMax` (valor máximo)
        5. `disponivel` (boolean)
        6. Data de criação (`dataCriacao` >= valor)
- Desejamos também:
    - Ordenar resultados por `preco` descendente e depois por `nome` ascendente.
    - Retornar somente registros distintos (embora, neste cenário, sem joins extras, não haja duplicação, mas incluímos para exemplificar o uso).
    - Paginar resultados (20 itens por página).

### 9.2 Modelo da Entidade

```java
@Entity
@Table(name = "produto")
public class Produto {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String categoria;

    @Column(nullable = false)
    private BigDecimal preco;

    @Column(nullable = false)
    private Boolean disponivel;

    @Column(name = "data_criacao", nullable = false)
    private LocalDate dataCriacao;

    // getters e setters
    // Construtores, equals, hashCode...
}

```

### 9.3 Método de Repositório com Criteria

```java
public class ProdutoRepository {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Busca Produtos dinamicamente conforme filtros opcionais.
     *
     * @param nome         Filtro por nome (parte do conteúdo, case-insensitive)
     * @param categorias   Lista de categorias para filtrar (IN). Pode ser vazia/nula.
     * @param precoMin     Preço mínimo (>=). Pode ser nulo.
     * @param precoMax     Preço máximo (<=). Pode ser nulo.
     * @param disponivel   Disponível? (true/false). Pode ser nulo (ignorar filtro).
     * @param dataCriacao  Data de criação mínima (>=). Pode ser nulo.
     * @param pagina       Página desejada (zero-based).
     * @param tamanho      Número de itens por página.
     * @return List<Produto> com resultados conforme filtros e paginação.
     */
    public List<Produto> buscarProdutosDinamico(
        String nome,
        List<String> categorias,
        BigDecimal precoMin,
        BigDecimal precoMax,
        Boolean disponivel,
        LocalDate dataCriacao,
        int pagina,
        int tamanho
    ) {
        // 1. Obter CriteriaBuilder
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        // 2. Criar CriteriaQuery e definir o tipo de retorno
        CriteriaQuery<Produto> cq = cb.createQuery(Produto.class);

        // 3. Definir Root
        Root<Produto> root = cq.from(Produto.class);

        // 4. Lista de Predicates vazia
        List<Predicate> predicates = new ArrayList<>();

        // 5. Montar Predicates condicionalmente

        // 5.1 Filtro por nome (LIKE %nome%)
        if (nome != null && !nome.trim().isEmpty()) {
            predicates.add(
                cb.like(
                    cb.lower(root.get("nome")),
                    "%" + nome.trim().toLowerCase() + "%"
                )
            );
        }

        // 5.2 Filtro por categorias (IN)
        if (categorias != null && !categorias.isEmpty()) {
            predicates.add(root.get("categoria").in(categorias));
        }

        // 5.3 Filtro por precoMin (>=)
        if (precoMin != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("preco"), precoMin));
        }

        // 5.4 Filtro por precoMax (<=)
        if (precoMax != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("preco"), precoMax));
        }

        // 5.5 Filtro por disponivel (=)
        if (disponivel != null) {
            predicates.add(cb.equal(root.get("disponivel"), disponivel));
        }

        // 5.6 Filtro por dataCriacao (>=)
        if (dataCriacao != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("dataCriacao"), dataCriacao));
        }

        // 6. Combinar Predicates
        if (!predicates.isEmpty()) {
            cq.where(cb.and(predicates.toArray(new Predicate[0])));
        }

        // 7. Aplicar distinct (caso haja joins que possam duplicar linhas)
        cq.distinct(true);

        // 8. Ordenação: primeiro por preco DESC, depois por nome ASC
        List<Order> orderList = new ArrayList<>();
        orderList.add(cb.desc(root.get("preco")));
        orderList.add(cb.asc(root.get("nome")));
        cq.orderBy(orderList);

        // 9. Criar TypedQuery
        TypedQuery<Produto> query = entityManager.createQuery(cq);

        // 10. Paginação
        int primeiroResultado = pagina * tamanho;
        query.setFirstResult(primeiroResultado);
        query.setMaxResults(tamanho);

        // 11. Executar e retornar lista
        return query.getResultList();
    }
}

```

### Comentários Detalhados

1. **`CriteriaBuilder cb = entityManager.getCriteriaBuilder();`**
    
    Obtém o construtor de critérios do `EntityManager`. Ele é responsável por criar instâncias de `Predicate`, `Expression`, `Order` e a própria `CriteriaQuery`.
    
2. **`CriteriaQuery<Produto> cq = cb.createQuery(Produto.class);`**
    
    Instancia uma consulta tipada para retornar objetos do tipo `Produto`.
    
3. **`Root<Produto> root = cq.from(Produto.class);`**
    
    Define a entidade raiz (“`FROM produto p`”). A variável `root` funciona como referência às colunas (atributos) de `Produto`.
    
4. **`List<Predicate> predicates = new ArrayList<>();`**
    
    Prepara uma lista mutável que, no final, será convertida em array e passada ao `cq.where(...)`.
    
5. **Construção condicional de Predicates**
    - Cada `if` verifica se o parâmetro de filtro foi informado (não nulo ou não vazio).
    - Chamamos métodos do `cb`, por exemplo:
        - `cb.like(cb.lower(root.get("nome")), "%...%")` → insensível a maiúsculas/minúsculas.
        - `root.get("categoria").in(categorias)` → gera `categoria IN (...)`.
        - `cb.greaterThanOrEqualTo(root.get("preco"), precoMin)` → `preco >= :precoMin`.
6. **`cq.where(cb.and(...))`**
    - Concatena todos os `Predicate` com `AND`.
    - Se a lista estiver vazia, não houve filtros, logo `where` não é chamado (traz tudo).
7. **`cq.distinct(true)`**
    - Gera `SELECT DISTINCT ...`.
    - Útil quando incluímos joins e não queremos registros duplicados.
8. **Ordenação**
    - `cb.desc(root.get("preco"))` ordena preço decrescente, `cb.asc(root.get("nome"))` nome crescente.
    - Poderíamos ter feito `cq.orderBy(cb.desc(...), cb.asc(...));` diretamente.
9. **`TypedQuery<Produto> query = entityManager.createQuery(cq);`**
    - Converte o objeto Criteria em uma query executável.
10. **Paginação**
    - `setFirstResult(primeiroResultado)` determina o offset.
    - `setMaxResults(tamanho)` determina quantos registros retornar.
11. **Execução**
    - `query.getResultList()` retorna a lista com os resultados.
    - Para obter contagem total (sem paginação), seria necessário criar outra CriteriaQuery ou usar `count(...)`.

### 9.4 Teste de Uso

Supondo que tenhamos um serviço que chama o repositório:

```java
@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepo;

    public void executaBuscaExemplo() {
        String nomeFilter = "Camisa";
        List<String> catsFilter = Arrays.asList("Roupas", "Promoção");
        BigDecimal precoMin = new BigDecimal("50.00");
        BigDecimal precoMax = new BigDecimal("200.00");
        Boolean disponivel = true;
        LocalDate dataCriacao = LocalDate.now().minusMonths(1);

        int pagina = 0;
        int tamanho = 20;

        List<Produto> resultados =
            produtoRepo.buscarProdutosDinamico(
                nomeFilter, catsFilter, precoMin, precoMax,
                disponivel, dataCriacao, pagina, tamanho
            );

        resultados.forEach(prod ->
            System.out.println(prod.getNome() + " - R$ " + prod.getPreco())
        );
    }
}

```

- **Explicação:**
    - Passamos filtros válidos (nome contendo “Camisa”, categorias “Roupas” ou “Promoção”, preço entre 50 e 200, apenas disponíveis, criados no último mês).
    - O método `buscarProdutosDinamico(...)` retorna a lista paginada ordenada conforme definido.
    - Se algum parâmetro for nulo ou lista vazia (`catsFilter` vazia), aquele filtro não será aplicado.

---

## 10. Sugestões para Aprofundamento

1. **Documentação Oficial JPA (JSR 338)**
    - Capítulo sobre Criteria API para entender toda a gama de funcionalidades (joins, subqueries, agrupamentos).
2. **Metamodelo Estático (JPA Static Metamodel)**
    - Utilize a geração de classes `.java` para cada entidade (`Produto_`, `Categoria_`) e referencie atributos de forma tipada. Exemplo:
        
        ```java
        predicates.add(cb.like(cb.lower(root.get(Produto_.nome)), "%...%"));
        
        ```
        
3. **Padrão Specification (Spring Data JPA)**
    - Se usar Spring Data JPA, o `Specification<T>` já encapsula lógica de Criteria de forma mais concisa:
        
        ```java
        public class ProdutoSpecifications {
            public static Specification<Produto> possuiNome(String nome) {
                return (root, query, cb) -> {
                    if (nome == null) return cb.conjunction();
                    return cb.like(cb.lower(root.get("nome")), "%" + nome.toLowerCase() + "%");
                };
            }
            // ... outras especificações ...
        }
        
        ```
        
    - Depois, basta combinar:
        
        ```java
        Specification<Produto> spec = Specification.where(possuiNome(nome))
            .and(estaDisponivel(disponivel))
            .and(entrePrecos(precoMin, precoMax));
        Page<Produto> page = produtoRepository.findAll(spec, PageRequest.of(pagina, tamanho));
        
        ```
        
4. **Querydsl**
    - Biblioteca alternativa que gera classes de consulta mais legíveis (p.ex. `QProduto.produto.nome.containsIgnoreCase(nome)`), reduzindo a verbosidade do Criteria.
5. **Ferramentas de Profiling de SQL**
    - Habilite logs de SQL (ex.: Hibernate) e utilize ferramentas como “Explain Plan” no banco para analisar se a consulta gerada pelo Criteria está performando adequadamente.

---

**Conclusão:**

Montar consultas dinâmicas com JPA Criteria envolve compreender o papel de `CriteriaBuilder`, `CriteriaQuery`, `Root` e `Predicate`, além de aplicar lógica condicional para adicionar filtros somente quando os parâmetros existirem. O uso de `cq.distinct(true)` evita duplicações quando há joins que multiplicam registros. Seguindo padrões de modularização (métodos auxiliares para cada filtro), emprego de metamodelo estático, atenção à performance e paginação, obtemos uma solução flexível, segura e de fácil manutenção para cenários de pesquisa avançada em aplicações Java/JPA.