# Contexto, Vantagens e Uso Prático

---

## 1. Introdução

O **Criteria API** é uma alternativa programática ao uso direto de consultas JPQL (Java Persistence Query Language) no JPA (Java Persistence API). Enquanto o JPQL envolve a escrita de strings de consulta, muitas vezes acopladas ao código-fonte, o Criteria API provê uma forma *type-safe* de construir queries dinamicamente usando a metamodelo de entidades.

- **Contextualização e motivação:**
    - Em aplicações Java que utilizam JPA para persistência, consultas a entidades podem ser definidas de duas formas principais:
        1. **JPQL:** escrita de strings de consulta (por exemplo, `"SELECT u FROM Usuario u WHERE u.email = :email"`).
        2. **Criteria API:** construção de queries em tempo de execução por meio de objetos Java (`CriteriaBuilder`, `CriteriaQuery`, etc.).
    - A motivação central do Criteria API é oferecer *refatoração segura* (já que nomes de classes e atributos são referenciados por metamodelo, não por string) e a possibilidade de montar consultas **dinâmicas** de forma mais legível e menos propensa a erros de escrita (por exemplo, erros de sintaxe seriam capturados em tempo de compilação, não apenas em tempo de execução).
- **Breve visão geral concisa (sem detalhes de sintaxe):**
    - O Criteria API permite criar consultas JPA de forma programática, usando objetos Java em vez de strings.
    - A principal vantagem é a verificação de tipos em tempo de compilação (*type-safety*), facilitando refatorações e evitando erros de digitação em nomes de atributos/entidades.
    - Além disso, o Criteria API é indicado para **consultas dinâmicas** (por exemplo, quando filtros variam conforme parâmetros opcionais), pois possibilita concatenar condições somente se certas variáveis estiverem presentes.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#3-conceitos-fundamentais)
2. [Diferenças entre JPQL e Criteria API](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#4-diferen%C3%A7as-entre-jpql-e-criteria-api)
3. [Vantagens do Criteria API](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#5-vantagens-do-criteria-api)
4. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#6-sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. [Obtenção do `CriteriaBuilder` e `CriteriaQuery`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#61-obten%C3%A7%C3%A3o-do-criteriabuilder-e-criteriaquery)
    2. [Estrutura Básica de uma Consulta Criteria](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#62-estrutura-b%C3%A1sica-de-uma-consulta-criteria)
    3. [Construindo Predicados (Filtros)](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#63-construindo-predicados-filtros)
    4. [Ordenação, Agrupamento e Projeções](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#64-ordena%C3%A7%C3%A3o-agrupamento-e-proje%C3%A7%C3%B5es)
    5. [Consultas Dinâmicas com Vários Filtros Opcionais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#65-consultas-din%C3%A2micas-com-v%C3%A1rios-filtros-opcionais)
5. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#7-cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
6. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#8-componentes-chave-associados)
    1. [`CriteriaBuilder`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#81-criteriabuilder)
    2. [`CriteriaQuery<T>`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#82-criteriaqueryt)
    3. [`Root<T>`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#83-roott)
    4. [`Path<?>` e `Join<?,?>`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#84-path-e-join)
    5. [`Predicate`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#85-predicate)
    6. [Metamodelo Estático (Classe ___)](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#86-metamodelo-est%C3%A1tico-classe-entityname)
7. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#9-melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
8. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#10-exemplo-pr%C3%A1tico-completo)
    1. [Cenário e Entidades](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#101-cen%C3%A1rio-e-entidades)
    2. [Implementação de um Repositório com Criteria](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#102-implementa%C3%A7%C3%A3o-de-um-reposit%C3%B3rio-com-criteria)
    3. [Uso Dinâmico em Serviço](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#103-uso-din%C3%A2mico-em-servi%C3%A7o)
9. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#11-sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

- **O que é o Criteria API?**
    
    O Criteria API consiste em um conjunto de interfaces e classes introduzidas a partir do JPA 2.0 para criar consultas de forma programática, sem embutir strings JPQL diretamente no código. A ideia é usar um construtor de consultas (`CriteriaBuilder`) que retorna objetos de consulta (`CriteriaQuery`) e predicados (`Predicate`) para montar condições e projeções.
    
- **Importância e propósito:**
    1. **Type-safe:** Como os atributos e entidades são referenciados via metamodelo gerado (ou reflexivamente), erros de digitação em nomes de coluna/atributos geram falha na compilação.
    2. **Dinamismo:** Permite criar filtros condicionalmente, conforme parâmetros que só existem em tempo de execução—por exemplo, se um filtro “idade mínima” não for informado, basta não adicioná-lo.
    3. **Refatoração facilitada:** Renomear atributos de entidade em seu modelo faz com que qualquer código Criteria que referencie esses atributos via metamodelo resulte em erro de compilação, alertando instantaneamente do problema.

---

## 4. Diferenças entre JPQL e Criteria API

| Aspecto | JPQL | Criteria API |
| --- | --- | --- |
| **Forma de escrever a query** | Texto (String) parecido com SQL, mas usando nomes de entidade e atributos Java | API de objetos Java: `CriteriaBuilder`, `CriteriaQuery`, `Root`, `Predicate` etc. |
| **Type-safety** | **Baixa:** nome da entidade/atributo é string → risco de erro em tempo de execução | **Alta:** nomes referenciados via metamodelo ou resolvidos em tempo de compilação; erros de digitação resultam em erro de compilação |
| **Refatoração** | Susceptível a quebrar queries caso renomeie entidade/atributo sem ajustar string jpql | Menor chance de quebrar: renomear atributo/entidade normalmente causa erro de compilação nos pontos que o referenciam, facilitando correções |
| **Consultas Dinâmicas** | **Mais trabalhoso:** montar strings dinâmicas (concatenar condições, tratar espaços em branco) | **Direto:** concatenar `Predicate`s em lista; adicionar somente se filtro existir; API já fornece métodos de auxílio para combinar `Predicate`s (`and`, `or`, etc.). |
| **Legibilidade (para complexas)** | Pode ficar longo e difícil de manter, especialmente com junções e subqueries | Construção “verbosa” no início, mas, após acostumar, fica mais organizado para queries dinâmicas e grandes projetos; melhor manutenção de longo prazo |
| **Performace em tempo de compilação** | Praticamente não aplicada (interpretação em tempo de execução) | Montagem em tempo de execução, mas não afeta a gerabilidade do plano de execução do banco; JPA converte Criteria para SQL internamente |

---

## 5. Vantagens do Criteria API

1. **Type-safety:**
    - Ao usar metamodelo gerado automaticamente (classes `_<Entity>_`), referências a atributos de entidades são validadas em tempo de compilação (por exemplo, Usuario_.email), evitando “strings mágicas” que só causariam erro em runtime.
2. **Refatoração amigável:**
    - Se você renomear o atributo `nomeCompleto` para `nomeUsuario` em `Usuario`, qualquer código Criteria que referencie `Usuario_.nomeCompleto` falhará instantaneamente na compilação, apontando onde ajustar.
3. **Consultas dinâmicas simplificadas:**
    - É trivial montar condições que só aparecem se certo parâmetro não for nulo—basta adicionar/combinar `Predicate`s conforme necessário.
4. **Menos vulnerável a “SQL Injection”:**
    - Apesar de o JPA já fazer *escaping* apenas substituindo parâmetros, é mais claro e seguro construir condições via API, evitando concatenação de strings.
5. **Centralização de lógica de consulta:**
    - Em aplicações onde diversas partes montam consultas baseadas em filtros, juntar tudo programaticamente ajuda a manter um padrão, em vez de espalhar JPQL em repositórios ou DAOs distintos.

---

## 6. Sintaxe Detalhada e Uso Prático

### 6.1. Obtenção do `CriteriaBuilder` e `CriteriaQuery`

Para iniciar uma consulta Criteria, você precisa do `EntityManager` e do `CriteriaBuilder` associado:

```java
// Supondo que você tenha acesso a um EntityManager (injetado ou obtido)
EntityManager em = /* obter EntityManager */;

// 1. Obter CriteriaBuilder
CriteriaBuilder cb = em.getCriteriaBuilder();

// 2. Criar um CriteriaQuery para a entidade alvo (por exemplo, Usuario)
CriteriaQuery<Usuario> query = cb.createQuery(Usuario.class);

```

- **`cb` (CriteriaBuilder):** ponto de entrada para criar instâncias de `Predicate`, expressões de ordenação, funções agregadas, etc.
- **`query` (CriteriaQuery):** representa a estrutura da consulta em si, parametrizada pelo tipo de resultado (`<Usuario>` no exemplo).

---

### 6.2. Estrutura Básica de uma Consulta Criteria

Toda consulta Criteria segue, de forma simplificada, os seguintes passos:

1. **Criar o `CriteriaBuilder`**
2. **Criar o `CriteriaQuery<T>`**, passando a classe da entidade que será retornada
3. **Definir a “raiz” da consulta** (`Root<T>`), que corresponde à entidade principal no *FROM*
4. **Selecionar colunas ou instâncias** (usualmente via `query.select(root)`)
5. **Definir cláusulas `where`** (condições), combinando `Predicate`s
6. **Adicionar ordenações** (Opcional)
7. **Disparar a consulta** (`TypedQuery<T> typed = em.createQuery(query); typed.getResultList()`)

### Exemplo básico: selecionar todos os Usuários

```java
// 1. Obter CriteriaBuilder
CriteriaBuilder cb = em.getCriteriaBuilder();

// 2. Criar CriteriaQuery<Usuario>
CriteriaQuery<Usuario> query = cb.createQuery(Usuario.class);

// 3. Definir a raiz da consulta: FROM Usuario u
Root<Usuario> root = query.from(Usuario.class);

// 4. Selecionar todos: SELECT u
query.select(root);

// 5. (Opcional) adicionar condições com where (não há aqui)

// 6. (Opcional) ordenação: ORDER BY u.nome ASC
query.orderBy(cb.asc(root.get("nome")));

// 7. Criar TypedQuery e obter resultados
TypedQuery<Usuario> typedQuery = em.createQuery(query);
List<Usuario> usuarios = typedQuery.getResultList();

```

> Observação: root.get("nome") retorna um Path<String> apontando para o atributo nome de Usuario. Porém, a chamada sem metamodelo (root.get("nome")) não é type-safe. Para garantir a segurança de tipo, recomenda-se usar a classe metamodelo gerada: root.get(Usuario_.nome).
> 

---

### 6.3. Construindo Predicados (Filtros)

Para filtrar resultados, criamos instâncias de `Predicate` por meio do `CriteriaBuilder`:

- **Exemplos de predicados comuns:**
    - Igualdade: `cb.equal(root.get("email"), emailParam)`
    - Maior que / menor que (para números ou datas): `cb.greaterThan(root.<Integer>get("idade"), 18)`
    - “Like” (para strings): `cb.like(root.get("nome"), "%Maria%")`
    - `isNull` / `isNotNull`: `cb.isNull(root.get("dataExclusao"))`
    - Combinações lógicas: `cb.and(pred1, pred2)`, `cb.or(pred1, pred2)`, `cb.not(pred)`

### Exemplo: usuários ativos com idade maior que 18

```java
CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<Usuario> query = cb.createQuery(Usuario.class);
Root<Usuario> root = query.from(Usuario.class);

// 1. Predicado de “ativo = true”
Predicate ativoPredicate = cb.equal(root.get("ativo"), true);

// 2. Predicado de “idade > 18”
Predicate idadePredicate = cb.gt(root.get("idade"), 18);

// 3. Combinar via AND
Predicate whereClause = cb.and(ativoPredicate, idadePredicate);

// 4. Aplicar ao CriteriaQuery
query.select(root).where(whereClause);

// 5. Ordenar, executar, etc.
List<Usuario> resultado = em.createQuery(query).getResultList();

```

> Dica de estilo:
> 
> - Se houver vários filtros opcionais, crie uma lista de `Predicate`s e, ao final, aplique `query.where(cb.and(predicatesArray))`.
> - Exemplo de uso de lista dinâmica:
>     
>     ```java
>     List<Predicate> filtros = new ArrayList<>();
>     if (nomeParam != null) {
>         filtros.add(cb.like(root.get(Usuario_.nome), "%" + nomeParam + "%"));
>     }
>     if (idadeMinima != null) {
>         filtros.add(cb.ge(root.get(Usuario_.idade), idadeMinima));
>     }
>     // ... outros filtros ...
>     query.where(cb.and(filtros.toArray(new Predicate[0])));
>     
>     ```
>     

---

### 6.4. Ordenação, Agrupamento e Projeções

### Ordenação (ORDER BY)

- **Ascendente:** `query.orderBy(cb.asc(root.get("nome")));`
- **Descendente:** `query.orderBy(cb.desc(root.get("dataCriacao")));`

É possível combinar várias ordenações da seguinte forma:

```java
query.orderBy(
    cb.asc(root.get("nome")),
    cb.desc(root.get("dataCriacao"))
);

```

### Agrupamento (GROUP BY) e Funções Agregadas

Para usar `GROUP BY` e funções agregadas (`COUNT`, `SUM`, `AVG`, etc.), é necessário:

1. Definir o tipo de retorno da consulta conforme a projeção (por exemplo, `Tuple`, ou uma classe de DTO em vez da entidade).
2. Usar métodos de agregação:
    - `cb.count(root.get("id"))`
    - `cb.sum(root.get("salario"))`
    - `cb.avg(root.get("idade"))`, etc.
3. Indicar `query.groupBy(...)` e, se necessário, `query.having(...)`.

### Exemplo: contagem de usuários por cidade

```java
// 1. Novo CriteriaQuery que retorna um Tuple (ou Long, ou DTO)
CriteriaQuery<Tuple> query = cb.createTupleQuery();
Root<Usuario> root = query.from(Usuario.class);

// 2. Selecionar cidade e contagem
Expression<String> cidadeExpr = root.get("cidade");
Expression<Long> countExpr = cb.count(root);

// 3. Projeção (select)
query.multiselect(cidadeExpr.alias("cidade"), countExpr.alias("quantidade"));

// 4. Agrupar por cidade
query.groupBy(cidadeExpr);

// 5. (Opcional) having, filtro em agregação
Predicate havingFiltro = cb.gt(cb.count(root), 10L);
query.having(havingFiltro);

// 6. Executar
List<Tuple> resultados = em.createQuery(query).getResultList();
for (Tuple t : resultados) {
    String cidade = t.get("cidade", String.class);
    Long quantidade = t.get("quantidade", Long.class);
    // ...
}

```

### Projeções (selecionar campos específicos ou classes DTO)

Para criar consultas que retornem apenas alguns campos (por exemplo, apenas `nome` e `email`), em vez de toda a entidade, podemos usar:

```java
CriteriaQuery<Object[]> query = cb.createQuery(Object[].class);
Root<Usuario> root = query.from(Usuario.class);

// Selecionar colunas específicas
query.multiselect(root.get("nome"), root.get("email"));

// Adicionar filtros, ordenação etc.
query.where(cb.like(root.get("nome"), "%Silva%"));

// Executar e obter resultados
List<Object[]> resultados = em.createQuery(query).getResultList();
for (Object[] row : resultados) {
    String nome = (String) row[0];
    String email = (String) row[1];
    // ...
}

```

Caso prefira construir diretamente um DTO, é possível usar o construtor na `multiselect` (JPA 2.1+):

```java
CriteriaQuery<UsuarioDTO> query = cb.createQuery(UsuarioDTO.class);
Root<Usuario> root = query.from(Usuario.class);

// Supondo existência de um construtor UsuarioDTO(String nome, String email)
query.select(cb.construct(
    UsuarioDTO.class,
    root.get("nome"),
    root.get("email")
));

List<UsuarioDTO> listaDTO = em.createQuery(query).getResultList();

```

---

### 6.5. Consultas Dinâmicas com Vários Filtros Opcionais

Muitos cenários exigem filtrar entidades com base em parâmetros que podem ou não ser informados pelo usuário (por exemplo, busca de produtos com preço mínimo, preço máximo e categoria). O Criteria API facilita a construção incremental:

```java
public List<Produto> buscarProdutos(ProdutoFiltro filtro) {
    CriteriaBuilder cb = em.getCriteriaBuilder();
    CriteriaQuery<Produto> query = cb.createQuery(Produto.class);
    Root<Produto> root = query.from(Produto.class);

    // Lista para armazenar predicados dinamicamente
    List<Predicate> predicados = new ArrayList<>();

    if (filtro.getNome() != null && !filtro.getNome().isEmpty()) {
        predicados.add(cb.like(cb.lower(root.get("nome")), "%" + filtro.getNome().toLowerCase() + "%"));
    }
    if (filtro.getPrecoMinimo() != null) {
        predicados.add(cb.ge(root.get("preco"), filtro.getPrecoMinimo()));
    }
    if (filtro.getPrecoMaximo() != null) {
        predicados.add(cb.le(root.get("preco"), filtro.getPrecoMaximo()));
    }
    if (filtro.getCategoriaId() != null) {
        // Exemplo de join com outra entidade: Produto -> Categoria
        Join<Produto, Categoria> categoriaJoin = root.join("categoria", JoinType.INNER);
        predicados.add(cb.equal(categoriaJoin.get("id"), filtro.getCategoriaId()));
    }

    // Aplicar todos os predicados existentes via AND
    query.where(cb.and(predicados.toArray(new Predicate[0])));

    // (Opcional) Ordernar por nome
    query.orderBy(cb.asc(root.get("nome")));

    return em.createQuery(query).getResultList();
}

```

> Explicação sobre o exemplo:
> 
> - A classe `ProdutoFiltro` contém campos que podem ser nulos ou não: `nome`, `precoMinimo`, `precoMaximo`, `categoriaId`.
> - Montamos a lista de `Predicate` somente se cada campo for informado.
> - Ao final, combinamos todos via `cb.and(...)` e atribuímos ao `where`.
> - Isso evita escrever condicionalmente strings JPQL complexas e possíveis erros de concatenação.

---

## 7. Cenários de Restrição ou Não Aplicação

1. **Consultas muito simples e estáticas:**
    - Se sua query não muda em tempo de execução e é bastante enxuta (por exemplo, “buscar todos os funcionários ativos”), escrever JPQL diretamente como `em.createQuery("SELECT f FROM Funcionario f WHERE f.ativo = true", Funcionario.class)` costuma ser mais rápido e legível.
2. **Query/SQL proprietário ou complexidades específicas do banco:**
    - Em casos onde se precisa usar funções SQL específicas do banco (por exemplo, `PostGIS`, operadores de texto completo etc.), pode ser necessário usar **Native Query** (`@Query(nativeQuery = true)` ou `createNativeQuery`). O Criteria API não está concebido para funcionalidades nativas de cada banco, apenas para o subconjunto padronizado pelo JPA.
3. **Sobrecarga de código verboso:**
    - Projetos pequenos, com poucas consultas, podem acabar com excesso de classes e metamodelo geradas, tornando o código mais extenso do que a simples JPQL.
4. **Mão de obra e curva de aprendizado:**
    - Equipes pequenas, com programadores sem familiaridade prévia com Criteria, podem ter aumento de complexidade inicial. Para times acostumados a escrever strings JPQL, pode haver resistência.

---

## 8. Componentes Chave Associados

### 8.1. `CriteriaBuilder`

- **Descrição:** Fábrica para construir objetos de critérios: expressões, predicados, agregações, ordens.
- **Métodos principais:**
    - `createQuery(Class<T> resultClass)` → cria um `CriteriaQuery<T>`.
    - `equal(Expression<?> x, Object y)`, `like(Expression<String> x, String pattern)`, `gt(Path<Y> x, Y y)`, `and(Predicate... restrictions)`, `or(Predicate... restrictions)`, etc.
    - Métodos de agregação: `count`, `sum`, `avg`, `max`, `min`.
    - Métodos de funções SQL padrão: `concat`, `substring`, `lower`, `upper`, `length`, `trim`.

### 8.2. `CriteriaQuery<T>`

- **Descrição:** Representa a consulta em si, parametrizada pelo tipo de retorno `<T>`. Permite:
    - Definir seleção: `select(...)` ou `multiselect(...)`.
    - Definir condições: `where(...)`.
    - Ordenações: `orderBy(...)`.
    - Agrupamentos: `groupBy(...)` e `having(...)`.
    - Limitações: `distinct(true)`.

### 8.3. `Root<T>`

- **Descrição:** Ponto de partida para navegar pelos atributos da entidade `<T>` (como o “FROM Entidade e AS alias”).
- **Métodos principais:**
    - `get(String attributeName)`: retorna um `Path<Y>` referente ao atributo da entidade.
    - `join(String attributeName, JoinType jt)`: para realizar junções com entidades associadas.
    - `fetch(...)`: para *eager fetching* de associações (JOIN FETCH).

### 8.4. `Path<?>` e `Join<?,?>`

- **`Path<X>`:** representa o caminho (path) até um atributo ou campo específico de uma entidade no contexto da consulta. Usado em expressões, predicados ou projeções.
- **`Join<Z, X>`:** usado para navegar associações entre entidades (por exemplo, `Pedido` → `Cliente`, `Produto` → `Categoria`). Permite construir condições sobre colunas da entidade associada no mesmo contexto Criteria.

---

### 8.5. `Predicate`

- **Descrição:** Representa uma condição booleana em `WHERE` ou `HAVING`. Construído via `CriteriaBuilder`.
- **Uso típico:**
    - `Predicate p = cb.equal(root.get("status"), StatusPedido.ATIVO);`
    - `Predicate p2 = cb.between(root.get("valor"), 100, 500);`
    - Combinações: `cb.and(p, p2)`, `cb.or(p, p3)`.

### 8.6. Metamodelo Estático (Classe `_<EntityName>_`)

- **Descrição:** Arquivo gerado durante compilação (módulo `javax.persistence:javax.persistence-api` + plugin `hibernate-jpamodelgen` ou `eclipse-jpt.jpa`) que contém classes tipo `Usuario_`, `Produto_`, etc.
- **Exemplo de conteúdo em `Usuario_.java`:**
    
    ```java
    @Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
    @StaticMetamodel(Usuario.class)
    public abstract class Usuario_ {
        public static volatile SingularAttribute<Usuario, Long> id;
        public static volatile SingularAttribute<Usuario, String> nome;
        public static volatile SingularAttribute<Usuario, String> email;
        public static volatile SingularAttribute<Usuario, Integer> idade;
        public static volatile SingularAttribute<Usuario, Boolean> ativo;
        // ...
    }
    
    ```
    
- **Vantagem:**
    - Em vez de usar `root.get("nome")` (que retorna `Path<Object>` e não é verificado até a consulta executar), faz-se `root.get(Usuario_.nome)` (retorna `Path<String>`). Assim, erros como `root.get("nom")` saltariam na compilação, alertando que `Usuario_.nom` não existe.

---

## 9. Melhores Práticas e Padrões de Uso

1. **Utilizar Metamodelo Sempre que Possível**
    - Configurar o plugin de geração de metamodelo (ex.: `hibernate-jpamodelgen` ou similar).
    - Referenciar atributos via `Entity_.atributo`, evitando *strings* literais.
2. **Manter Código de Consulta Legível**
    - Extraia blocos de montagem de filtros para métodos auxiliares, especialmente quando há muitos predicados opcionais.
    - Evite usar literais de string (por exemplo, nomes de atributos) diretamente: prefira metamodelo ou constantes.
3. **Centralizar Lógica de Consulta**
    - Se muitas partes da aplicação usam o mesmo critério (por exemplo, somente “ativos”), considere criar métodos utilitários:
        
        ```java
        public static Predicate[] filtrosComuns(CriteriaBuilder cb, Root<Usuario> root) {
            return new Predicate[] { cb.equal(root.get(Usuario_.ativo), true) };
        }
        
        ```
        
    - Dessa forma, polimorfismo de consultas e manutenção se tornam mais simples.
4. **Limitar Complexidade no DAO/Repository**
    - Se um método de busca cresce demais, repasse para classes de “Specification” (padrão *Specification* usa Criteria API no Spring Data, por exemplo).
    - Separar consultas complexas em classes estáticas auxiliares elimina métodos gigantes em um só repositório.
5. **Cuidado com FETCHEs Inesperados**
    - Quando usar `root.fetch(...)` para “join fetch”, lembre-se de que isso pode trazer dados de associações para memória, possivelmente causando problema de *cartesian product* (duplicatas).
    - Se precisar buscar apenas IDs de entidades, projete consultas específicas (DTO), evitando carregar toda a entidade.
6. **Usar TypedQuery Corretamente**
    - Após `TypedQuery<T> typed = em.createQuery(criteriaQuery);`, considere definir paginação:
        
        ```java
        typed.setFirstResult(pagina * tamanhoPagina);
        typed.setMaxResults(tamanhoPagina);
        
        ```
        
    - Isso evita carregar todos os resultados e reduz consumo de memória.
7. **Evitar Injeção de `EntityManager` em Massas**
    - Nunca compartilhe o mesmo `EntityManager` em múltiplas threads sem controle correto de transação.
    - Em JEE/Spring, use `@PersistenceContext` (ou `@Autowired EntityManager`) e deixe o container gerenciar transação e ciclo de vida.

---

## 10. Exemplo Prático Completo

### 10.1. Cenário e Entidades

Suponha uma aplicação de e-commerce simplificada com as seguintes entidades:

```java
@Entity
public class Produto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private BigDecimal preco;

    @ManyToOne(fetch = FetchType.LAZY)
    private Categoria categoria;

    private Boolean ativo;
    // getters e setters…
}

@Entity
public class Categoria {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    // getters e setters…
}

```

E, suponha que seja gerado (durante compilação) o metamodelo:

```java
@StaticMetamodel(Produto.class)
public abstract class Produto_ {
    public static volatile SingularAttribute<Produto, Long> id;
    public static volatile SingularAttribute<Produto, String> nome;
    public static volatile SingularAttribute<Produto, BigDecimal> preco;
    public static volatile SingularAttribute<Produto, Categoria> categoria;
    public static volatile SingularAttribute<Produto, Boolean> ativo;
}

@StaticMetamodel(Categoria.class)
public abstract class Categoria_ {
    public static volatile SingularAttribute<Categoria, Long> id;
    public static volatile SingularAttribute<Categoria, String> nome;
}

```

---

### 10.2. Implementação de um Repositório com Criteria

**Objetivo:** criar um método que busca produtos conforme filtros opcionais enviados pelo cliente:

- Nome contendo determinado texto (caso seja informado).
- Faixa de preço (mínimo e/ou máximo).
- Categoria específica (pelo ID).
- Status “ativo = true” sempre aplicado.

```java
@Repository
public class ProdutoRepository {

    @PersistenceContext
    private EntityManager em;

    /**
     * Busca produtos conforme filtros opcionais.
     *
     * @param nome        Texto que deve aparecer no nome (igual ou parecido) – pode ser nulo.
     * @param precoMinimo Preço mínimo – pode ser nulo.
     * @param precoMaximo Preço máximo – pode ser nulo.
     * @param categoriaId ID da categoria – pode ser nulo.
     * @return Lista de produtos que satisfazem os filtros.
     */
    public List<Produto> buscarPorFiltros(String nome,
                                          BigDecimal precoMinimo,
                                          BigDecimal precoMaximo,
                                          Long categoriaId) {
        // 1. Obter CriteriaBuilder
        CriteriaBuilder cb = em.getCriteriaBuilder();

        // 2. Definir tipo de retorno para Produto
        CriteriaQuery<Produto> query = cb.createQuery(Produto.class);

        // 3. Definir raiz (FROM Produto p)
        Root<Produto> root = query.from(Produto.class);

        // 4. Lista dinâmica de predicados
        List<Predicate> predicados = new ArrayList<>();

        // 4.1. Filtro: produtos ativos (sempre)
        predicados.add(cb.isTrue(root.get(Produto_.ativo)));

        // 4.2. Filtro: nome contido (se informado)
        if (nome != null && !nome.trim().isEmpty()) {
            predicados.add(
                cb.like(
                    cb.lower(root.get(Produto_.nome)),
                    "%" + nome.trim().toLowerCase() + "%"
                )
            );
        }

        // 4.3. Filtro: preco >= precoMinimo (se informado)
        if (precoMinimo != null) {
            predicados.add(cb.ge(root.get(Produto_.preco), precoMinimo));
        }

        // 4.4. Filtro: preco <= precoMaximo (se informado)
        if (precoMaximo != null) {
            predicados.add(cb.le(root.get(Produto_.preco), precoMaximo));
        }

        // 4.5. Filtro: categoria (se informado)
        if (categoriaId != null) {
            // Join com Categoria: p.categoria
            Join<Produto, Categoria> joinCategoria = root.join(Produto_.categoria, JoinType.INNER);
            predicados.add(cb.equal(joinCategoria.get(Categoria_.id), categoriaId));
        }

        // 5. Construir WHERE com todos os predicados via AND
        query.where(cb.and(predicados.toArray(new Predicate[0])));

        // 6. Ordenar por nome do produto (ascendente)
        query.orderBy(cb.asc(root.get(Produto_.nome)));

        // 7. Retornar execução da query
        return em.createQuery(query).getResultList();
    }
}

```

**Comentário passo a passo:**

- *Linha 1-3:* obtém `CriteriaBuilder` e cria `CriteriaQuery<Produto>`; define `Root<Produto>` que é o “FROM Produto p”.
- *Linha 6:* lista de `Predicate`s a ser preenchida dinamicamente.
- *Linhas 9-11:* adiciona filtro obrigatório: `ativo = true`.
- *Linhas 14-21:* se `nome` não for nulo/vazio, adiciona `LOWER(p.nome) LIKE "%nome%"`.
- *Linhas 24-27:* se `precoMinimo` for informado, adiciona `p.preco >= precoMinimo`.
- *Linhas 30-33:* se `precoMaximo` for informado, adiciona `p.preco <= precoMaximo`.
- *Linhas 36-40:* se `categoriaId` for informado, faz `JOIN p.categoria c` e adiciona `c.id = categoriaId`.
- *Linha 43:* combina todos predicados em `WHERE` via `cb.and(...)`.
- *Linha 46:* define `ORDER BY p.nome ASC`.
- *Linha 49:* executa a consulta e retorna lista de `Produto`.

---

### 10.3. Uso Dinâmico em Serviço

Em uma camada de serviço/Spring, você poderia injetar `ProdutoRepository` e repassar parâmetros vindos de controlador REST:

```java
@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepo;

    public List<ProdutoDTO> buscarProdutos(ProdutoFiltroDTO filtroDTO) {
        // Converter DTO de filtro para parâmetros
        String nome = filtroDTO.getNome();
        BigDecimal precoMinimo = filtroDTO.getPrecoMinimo();
        BigDecimal precoMaximo = filtroDTO.getPrecoMaximo();
        Long categoriaId = filtroDTO.getCategoriaId();

        List<Produto> produtos = produtoRepo.buscarPorFiltros(nome, precoMinimo, precoMaximo, categoriaId);

        // Converter entidades para DTO de resposta (método fictício de conversão)
        return produtos.stream()
                       .map(prod -> new ProdutoDTO(prod.getId(), prod.getNome(), prod.getPreco()))
                       .collect(Collectors.toList());
    }
}

```

- **Comentário:**
    - O `ProdutoFiltroDTO` contém campos opcionais, possivelmente nulos.
    - O serviço repassa valores diretamente para o método Criteria, que monta a consulta conforme filtros.
    - Por fim, converte entidades em DTOs mais enxutos para retornar ao cliente (REST ou outro consumidor).

---

## 11. Sugestões para Aprofundamento

1. **Documentação Oficial JPA / Hibernate:**
    - Capítulo “Criteria API” na **Especificação JPA 2.2**.
    - Manual do Hibernate: seção “Hibernate Criteria Query” (apesar de o Hibernate ter sua própria API de Criteria de versões anteriores, a parte JPA Criteria é padrão).
2. **Spring Data JPA – *Specifications*:**
    - Veja como o Spring Data JPA empacota Queries Criteria em “Specifications”, que facilitam montar filtros complexos reusáveis e compostos.
3. **Performance e otimizações:**
    - Estude como o JPA converte Criteria para SQL e analise planos de execução para verificar possíveis *cartesian products* ao usar vários `join`s sem cuidado.
4. **Consultas Complexas (Subqueries) com Criteria:**
    - Exemplo: buscar entidades cujos IDs estejam no resultado de uma subconsulta.
    - API de subconsulta:
        
        ```java
        Subquery<Long> sub = query.subquery(Long.class);
        Root<Pedido> pedidoRoot = sub.from(Pedido.class);
        sub.select(pedidoRoot.get("cliente").get("id"))
            .where(cb.gt(pedidoRoot.get("valorTotal"), new BigDecimal("1000")));
        query.where(cb.in(root.get("id")).value(sub));
        
        ```
        
5. **Combinar Criteria com Entity Graphs (FETCH JOIN):**
    - Utilize `EntityGraph` para controlar *fetch* de associações quando montar Criteria, evitando *n+1 selects*.
6. **Testes automatizados para queries:**
    - Crie testes de integração que garantam que o Criteria retorne resultados corretos, usando banco em memória (H2) para velocidade.
7. **Explorar funções avançadas do CriteriaBuilder:**
    - Uso de expressões de case (`cb.selectCase()`), funções de datas (`cb.function("DATE_FORMAT", String.class, ...)`), entre outras.

---

> Nota Final:
> 
> 
> O Criteria API do JPA é uma ferramenta poderosa quando usada em cenários que exigem consultas dinâmicas e refatorações seguras. Embora a verbosidade inicial possa parecer maior que a de uma string JPQL simples, o ganho em manutenção, legibilidade e redução de erros em aplicações de médio/grande porte costuma compensar o investimento de tempo.
>