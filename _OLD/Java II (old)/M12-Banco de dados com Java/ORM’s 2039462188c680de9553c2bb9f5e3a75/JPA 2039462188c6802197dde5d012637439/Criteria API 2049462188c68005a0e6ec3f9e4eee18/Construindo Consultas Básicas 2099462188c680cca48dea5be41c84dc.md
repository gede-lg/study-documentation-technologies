# Construindo Consultas Básicas

---

## Introdução

O *Criteria API* do JPA oferece uma forma tipada e programática de construir consultas dinâmicas em Java, sem a necessidade de concatenar strings JPQL manualmente. Ele se baseia em objetos de domínio (entidades) e permite montar **CriteriaQuery** de modo seguro em tempo de compilação. Neste guia, veremos como:

1. Obter uma instância de `CriteriaBuilder` a partir do `EntityManager`.
2. Definir um `CriteriaQuery` específico para seleção de entidades.
3. Referenciar o objeto `Root` e escolher atributos simples (projeções).
4. Executar a consulta via `EntityManager.createQuery`.

Vamos cobrir conceitos fundamentais, sintaxe e exemplos comentados, bem como boas práticas, cenários em que o *Criteria API* pode não ser ideal e um exemplo prático completo.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Criando instância de `CriteriaBuilder`
    2. Definindo `CriteriaQuery` para seleção de entidades
    3. Referenciando `Root` e selecionando atributos simples
    4. Executando a consulta via `EntityManager.createQuery`
    5. Filtrando resultados com `Predicate` (exemplo básico)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

1. **Por que usar Criteria API?**
    - **Tipagem em tempo de compilação**: evita erros de sintaxe que surgiriam ao compor strings JPQL manualmente.
    - **Consultas dinâmicas**: facilita a inclusão condicional de cláusulas (`WHERE`, `ORDER BY` etc.) sem resortar a concatenações de texto.
    - **Manutenção e legibilidade**: como tudo é objeto, IDEs oferecem autocompletar, refatoração e navegação mais fáceis.
2. **Elementos principais**:
    - **`EntityManager`**: ponto de entrada para interagir com o contexto de persistência.
    - **`CriteriaBuilder`**: fábrica de objetos que representam partes de uma consulta (expressões, predicados, ordenações etc.).
    - **`CriteriaQuery<T>`**: representa a consulta em si, parametrizada pelo tipo de resultado (por exemplo, `CriteriaQuery<Pessoa>`).
    - **`Root<T>`**: referência à entidade “raiz” da consulta (o equivalente a `FROM Pessoa p` em JPQL).
    - **`Predicate`**: condição para cláusulas `WHERE`.
    - **`TypedQuery<T>`**: após montar o `CriteriaQuery`, converte-se em `TypedQuery` para obter resultados.
3. **Fluxo geral**:
    1. Obter `CriteriaBuilder` do `EntityManager`.
    2. Criar um `CriteriaQuery<T>` indicando o tipo de retorno.
    3. Obter `Root<T>` para a entidade-alvo.
    4. Definir seleções, filtros e ordenações.
    5. Criar `TypedQuery<T>` e executá-la.

---

## Sintaxe Detalhada e Uso Prático

A seguir, veremos cada etapa com exemplos em Java, comentados.

### 1. Criando instância de `CriteriaBuilder`

```java
// Supondo que tenhamos uma referência ao EntityManager:
EntityManager entityManager = /* obtido a partir de um EntityManagerFactory ou via @PersistenceContext */;

// 1.1. Obtenção do CriteriaBuilder
CriteriaBuilder cb = entityManager.getCriteriaBuilder();

```

> Comentário:
> 
> - O `CriteriaBuilder` é o objeto principal para construir todas as partes da consulta (seleção, filtros, ordenação).
> - Em um ambiente gerenciado pelo容容容容容容容容容容容容容容容容容容容容容容容容容容容容容容容容容容**Spring** ou **Jakarta EE**, normalmente injetamos o `EntityManager` e, a partir dele, o `CriteriaBuilder`.

---

### 2. Definindo `CriteriaQuery` para seleção de entidades

```java
// 2.1. Criar CriteriaQuery parametrizado pelo tipo de entidade (por exemplo, Pessoa)
CriteriaQuery<Pessoa> query = cb.createQuery(Pessoa.class);

```

> Comentário:
> 
> - Passamos a classe da entidade (`Pessoa.class`) para que o JPA saiba que iremos retornar objetos desse tipo.
> - Se quiséssemos retornar apenas um atributo escalar (ex.: String ou Integer), poderíamos usar `CriteriaQuery<String>` ou `CriteriaQuery<Integer>` e, mais adiante, projetar apenas aquele campo.

---

### 3. Referenciando `Root` e selecionando atributos simples

```java
// 3.1. Definir o "FROM Pessoa p"
Root<Pessoa> rootPessoa = query.from(Pessoa.class);

// 3.2. Selecionar todos os atributos da entidade (equivalente a SELECT p)
query.select(rootPessoa);

```

> Comentário:
> 
> - `Root<Pessoa>` representa a entidade `Pessoa` na consulta, similar ao “alias” em JPQL (`FROM Pessoa p`).
> - `query.select(rootPessoa)` indica que queremos todas as colunas da entidade. Para selecionar apenas um atributo, por exemplo `nome`, usaríamos:
> 
> ```java
> // Exemplo de projeção escalar de atributo "nome"
> query.select(rootPessoa.get("nome")); // retornaria List<String>
> 
> ```
> 
> - Porém, nesse caso, a consulta vira `CriteriaQuery<String>` em vez de `CriteriaQuery<Pessoa>`.

---

### 4. Executando a consulta via `EntityManager.createQuery`

```java
// 4.1. Transformar CriteriaQuery em TypedQuery e executar:
TypedQuery<Pessoa> typedQuery = entityManager.createQuery(query);
List<Pessoa> listaPessoas = typedQuery.getResultList();

// 4.2. Iterar sobre resultados (opcional)
for (Pessoa p : listaPessoas) {
    System.out.println(p.getId() + " - " + p.getNome());
}

```

> Comentário:
> 
> - `entityManager.createQuery(query)` converte o objeto Criteria em uma consulta executável.
> - `getResultList()` retorna a lista com todas as instâncias de `Pessoa` encontradas.
> - Quando a consulta retorna valores escalares (como `String` ou `Integer`), usaríamos `TypedQuery<String>` ou `TypedQuery<Integer>`.

---

### 5. Filtrando resultados com `Predicate` (exemplo básico)

Embora o foco aqui seja “consultas básicas”, incluir um filtro simples ajuda a ilustrar a construção de cláusulas `WHERE`.

```java
// 5.1. Exemplo: recuperar Pessoas cujo nome contenha "Silva"

// 5.1.1. Criar CriteriaQuery
CriteriaQuery<Pessoa> queryFiltrada = cb.createQuery(Pessoa.class);
Root<Pessoa> rootFiltrada = queryFiltrada.from(Pessoa.class);

// 5.1.2. Definir predicate: nome LIKE "%Silva%"
Predicate nomeContemSilva = cb.like(rootFiltrada.get("nome"), "%Silva%");

// 5.1.3. Configurar seleção e cláusula WHERE
queryFiltrada.select(rootFiltrada)
              .where(nomeContemSilva);

// 5.1.4. Executar consulta
List<Pessoa> listaFiltrada = entityManager.createQuery(queryFiltrada)
                                           .getResultList();

// Exibir resultados
listaFiltrada.forEach(p -> System.out.println(p.getNome()));

```

> Comentário:
> 
> - `cb.like(...)` cria um `Predicate` representando o `LIKE` do SQL.
> - Em consultas mais complexas, podemos combinar vários `Predicate` com `cb.and(...)` ou `cb.or(...)`.

---

## Cenários de Restrição ou Não Aplicação

1. **Consultas extremamente simples e estáticas**
    - Se a consulta for fixa e sem necessidade de condições dinâmicas, JPQL puro ou *NamedQuery* pode ser mais legível.
    - Exemplo:
        
        ```java
        List<Pessoa> lista = entityManager
            .createQuery("SELECT p FROM Pessoa p ORDER BY p.id ASC", Pessoa.class)
            .getResultList();
        
        ```
        
    - Aqui, a diferença de manutenção é pequena, e usar string JPQL pode ser mais direto.
2. **Performance crítica com muitos joins ou subqueries**
    - Embora o *Criteria API* suporte joins e subqueries, em cenários que exigem otimizações específicas de SQL (hints, `JOIN FETCH` complexos, manipulação de índices), talvez seja preferível usar `@NamedNativeQuery` ou `EntityGraph` para garantir o carregamento otimizado.
3. **Frameworks que geram abstrações adicionais**
    - Em projetos que utilizam **Spring Data JPA**, pode-se criar métodos de repositório com nome que já geram queries automaticamente, sem precisar escrever nem Criteria nem JPQL manualmente. Exemplo: `List<Pessoa> findByNomeContaining(String nome);`
4. **Portabilidade para outros provedores**
    - Alguns provedores JPA podem ter diferenças sutis na implementação do *Criteria API*. Embora o JPA especifique o padrão, particularidades de performance ou sintaxe interna podem variar (ex.: Hibernate, EclipseLink, OpenJPA).

---

## Componentes Chave Associados

1. **`EntityManager`**
    - Responsável pela gerência do ciclo de vida das entidades e pela criação de consultas.
    - Métodos principais para Criteria:
        - `getCriteriaBuilder()`: retorna o `CriteriaBuilder`.
2. **`CriteriaBuilder`**
    - Fábrica de objetos para construir expressões:
        - `createQuery(Class<T> resultClass)`: cria um `CriteriaQuery`.
        - Métodos para construções de expressões:
            - `equal()`, `like()`, `greaterThan()`, `lessThan()`, `and()`, `or()`.
            - `asc()`, `desc()` para ordenações.
3. **`CriteriaQuery<T>`**
    - Representa a consulta em si.
    - Métodos principais:
        - `from(Class<T>)`: define a raiz da consulta (`Root<T>`).
        - `select(Selection<? extends T>)`: define o que será selecionado.
        - `where(Predicate...)`: adiciona cláusulas `WHERE`.
        - `orderBy(Order...)`: define ordenação.
4. **`Root<T>`**
    - Representa a entidade envolvida na cláusula `FROM`.
    - Permite navegar pelos atributos da entidade:
        - `root.get("atributo")` retorna um `Path` para acessar o valor.
        - `root.join("relacionamento")` para fazer `JOIN` em relacionamentos.
5. **`Predicate`**
    - Representa uma condição booleana.
    - Pode ser combinado:
        - `cb.and(pred1, pred2, ...)`
        - `cb.or(pred1, pred2, ...)`
6. **`TypedQuery<T>`**
    - Objeto executável:
        - `TypedQuery<T> tq = entityManager.createQuery(criteriaQuery);`
        - Métodos: `getResultList()`, `getSingleResult()`.
7. **Anotações e Classes Auxiliares**
    - Em entidades:
        - `@Entity`, `@Table`, `@Id`, `@Column`, `@OneToMany`, `@ManyToOne` etc.
    - Não diretamente usadas no Criteria, mas fundamentais para mapear atributos que serão referenciados.

---

## Melhores Práticas e Padrões de Uso

1. **Reuso de `CriteriaQuery` e `TypedQuery`**
    - Se uma mesma consulta for usada várias vezes (com os mesmos parâmetros), crie um método em um repositório ou DAO que retorne o `CriteriaQuery` pronto, apenas alterando parâmetros dinâmicos.
    - Exemplo:
        
        ```java
        public CriteriaQuery<Pessoa> montarQueryPessoasPorNome(String nome) {
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            CriteriaQuery<Pessoa> q = cb.createQuery(Pessoa.class);
            Root<Pessoa> root = q.from(Pessoa.class);
            Predicate filtro = cb.like(root.get("nome"), "%" + nome + "%");
            q.select(root).where(filtro);
            return q;
        }
        // ...
        CriteriaQuery<Pessoa> consulta = montarQueryPessoasPorNome("Silva");
        List<Pessoa> resultados = entityManager.createQuery(consulta).getResultList();
        
        ```
        
2. **Evitar buscas “n+1”**
    - Quando a entidade possui relacionamentos `LAZY`, avalie a necessidade de usar `fetch joins` para evitar múltiplas consultas.
    - Exemplo de fetch join:
        
        ```java
        // Supondo Entidade Pedido com relacionamento @ManyToOne Cliente:
        CriteriaQuery<Pedido> q = cb.createQuery(Pedido.class);
        Root<Pedido> root = q.from(Pedido.class);
        root.fetch("cliente", JoinType.LEFT);
        q.select(root);
        List<Pedido> pedidos = entityManager.createQuery(q).getResultList();
        
        ```
        
3. **Projeções e DTOs**
    - Quando não é necessário trazer toda a entidade, projete apenas atributos requeridos, retornando DTOs.
    - Exemplo de seleção de múltiplos atributos num construtor de DTO:
        
        ```java
        CriteriaQuery<MeuDTO> q = cb.createQuery(MeuDTO.class);
        Root<Pessoa> root = q.from(Pessoa.class);
        q.select(cb.construct(MeuDTO.class,
                root.get("id"),
                root.get("nome"),
                root.get("email")
            ));
        List<MeuDTO> dtos = entityManager.createQuery(q).getResultList();
        
        ```
        
4. **Tratar `TypedQuery#setParameter`**
    - Se a consulta tiver parâmetros dinâmicos (por exemplo, data ou valor numérico), use parâmetros nomeados ou posicionais no Criteria:
        
        ```java
        Predicate filtroData = cb.greaterThan(root.get("dataCadastro"), cb.parameter(Date.class, "dataMinima"));
        q.select(root).where(filtroData);
        TypedQuery<Pessoa> tq = entityManager.createQuery(q);
        tq.setParameter("dataMinima", minhaData);
        
        ```
        
5. **Documentar consultas complexas**
    - Em consultas com várias junções e subqueries, adicione comentários explicando a lógica de cada bloco para facilitar manutenção futura.
6. **Cuidado com performance**
    - Evite fazer `.getResultList()` sem limites em tabelas muito grandes. Use `setMaxResults(int)` e `setFirstResult(int)` para paginação.
    - Exemplo:
        
        ```java
        TypedQuery<Pessoa> tq = entityManager.createQuery(q);
        tq.setFirstResult(0);
        tq.setMaxResults(20); // Pega apenas 20 primeiros
        List<Pessoa> page = tq.getResultList();
        
        ```
        

---

## Exemplo Prático Completo

Imagine um modelo de domínio simples com a entidade **Pessoa**:

```java
@Entity
@Table(name = "pessoa")
public class Pessoa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(unique = true, nullable = false, length = 150)
    private String email;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    // Construtores, getters e setters...
}

```

### Cenário

- Queremos:
    1. Recuperar todas as pessoas ordenadas por nome.
    2. Recuperar apenas o nome e o email de pessoas nascidas após 1º de janeiro de 1990 (projeção em DTO).
    3. Contar quantas pessoas existem no banco.

### 1. Todas as pessoas ordenadas por nome

```java
// 1.1. Obtém o CriteriaBuilder
CriteriaBuilder cb = entityManager.getCriteriaBuilder();

// 1.2. Cria CriteriaQuery para Pessoa
CriteriaQuery<Pessoa> qTodas = cb.createQuery(Pessoa.class);

// 1.3. Define a raiz da consulta
Root<Pessoa> rootTodas = qTodas.from(Pessoa.class);

// 1.4. Seleciona todas as colunas
qTodas.select(rootTodas);

// 1.5. Ordena por nome (ascendente)
qTodas.orderBy(cb.asc(rootTodas.get("nome")));

// 1.6. Executa a consulta
List<Pessoa> todasPessoas = entityManager.createQuery(qTodas)
                                         .getResultList();

// Exibir (opcional)
todasPessoas.forEach(p -> System.out.println(p.getNome()));

```

### 2. Projeção em DTO: nome e email de pessoas nascidas após 1990

Criamos primeiro um DTO simples:

```java
public class PessoaResumoDTO {
    private String nome;
    private String email;

    public PessoaResumoDTO(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }

    // Getters e setters, se necessário...
}

```

Consulta com projeção:

```java
// 2.1. Define a data de corte
LocalDate dataCorte = LocalDate.of(1990, Month.JANUARY, 1);

// 2.2. Obtém CriteriaBuilder e cria CriteriaQuery para o DTO
CriteriaBuilder cb2 = entityManager.getCriteriaBuilder();
CriteriaQuery<PessoaResumoDTO> qResumo = cb2.createQuery(PessoaResumoDTO.class);

// 2.3. Define a raiz (entidade Pessoa)
Root<Pessoa> rootResumo = qResumo.from(Pessoa.class);

// 2.4. Monta Predicado: dataNascimento > dataCorte
Predicate filtroData = cb2.greaterThan(rootResumo.get("dataNascimento"), dataCorte);

// 2.5. Configura seleção: construtor de DTO
qResumo.select(
    cb2.construct(PessoaResumoDTO.class,
        rootResumo.get("nome"),
        rootResumo.get("email")
    )
).where(filtroData)
 .orderBy(cb2.asc(rootResumo.get("nome"))); // Exemplo de ordenação

// 2.6. Executa a consulta
List<PessoaResumoDTO> listaResumo = entityManager.createQuery(qResumo)
                                                 .getResultList();

// Exibir
listaResumo.forEach(dto -> System.out.println(dto.getNome() + " - " + dto.getEmail()));

```

### 3. Contar quantas pessoas existem no banco

```java
// 3.1. Obtém CriteriaBuilder e cria CriteriaQuery para Long (tipo do resultado)
CriteriaBuilder cb3 = entityManager.getCriteriaBuilder();
CriteriaQuery<Long> qCount = cb3.createQuery(Long.class);

// 3.2. Define raiz (Pessoa)
Root<Pessoa> rootCount = qCount.from(Pessoa.class);

// 3.3. Seleciona COUNT(root)
qCount.select(cb3.count(rootCount));

// 3.4. Executa a consulta para obter um único resultado (Long)
Long totalPessoas = entityManager.createQuery(qCount)
                                 .getSingleResult();

System.out.println("Total de Pessoas no banco: " + totalPessoas);

```

> Comentário Geral
> 
> - Note que estamos reutilizando o padrão: obter `CriteriaBuilder`, criar `CriteriaQuery`, definir `Root`, configurar seleção e, por fim, executar.
> - Em cada cenário, o tipo paramétrico do `CriteriaQuery<T>` varia conforme o esperado:
>     - Para retornar entidades: `CriteriaQuery<Pessoa>`.
>     - Para retornar DTOs: `CriteriaQuery<PessoaResumoDTO>`.
>     - Para retornar valores escalares (como `Long`): `CriteriaQuery<Long>`.

---

## Cenários de Restrição ou Não Aplicação

- **Consulta extremamente estática ou simples**:
    
    Se o critério de busca nunca muda (por exemplo, “trazer todos, sem filtro”), usar JPQL ou *NamedQuery* pode ser mais conciso:
    
    ```java
    @NamedQuery(
      name = "Pessoa.findAllOrderByName",
      query = "SELECT p FROM Pessoa p ORDER BY p.nome"
    )
    
    ```
    
    E depois:
    
    ```java
    List<Pessoa> lista = entityManager.createNamedQuery("Pessoa.findAllOrderByName", Pessoa.class)
                                      .getResultList();
    
    ```
    
- **Repositórios Spring Data JPA**:
    
    O Spring Data JPA permite definir métodos como `List<Pessoa> findAllByOrderByNomeAsc();` sem necessidade de Criteria explicitamente.
    
- **Consultas SQL específicas genéricas**:
    
    Se for necessária sintaxe SQL proprietária (funcionalidades específicas do banco, hints, CTEs avançados), prefira *NativeQuery*.
    

---

## Componentes Chave Associados

| Componente | Descrição |
| --- | --- |
| `EntityManager` | Interface principal para gerenciar entidades, fazer persistência e criar consultas. |
| `CriteriaBuilder` | Fábrica de objetos para construir partes da consulta (expressões, predicados, ordenações). |
| `CriteriaQuery<T>` | Representação do objeto consulta, parametrizado pelo tipo de retorno. |
| `Root<T>` | Representa a raiz da consulta (a entidade principal no `FROM`). Permite acesso aos atributos e relacionamentos. |
| `Predicate` | Expressão booleana usada em cláusulas `WHERE`. Pode ser combinada via `cb.and(...)`, `cb.or(...)`. |
| `Expression<X>` | Representa uma expressão de seleção, podendo ser um campo, computed property, agregação etc. |
| `Order` | Representa uma ordenação (`asc`, `desc`) para cláusulas `ORDER BY`. |
| `TypedQuery<T>` | Objeto executável, criado a partir do `CriteriaQuery`, que retorna resultados tipados. |
| `Path<T>` | Representa um caminho até um atributo ou relacionamento da entidade. |
| `Fetch<T, X>` | Usado para `fetch joins` em relacionamentos, evitando problemas de *n+1*. |
| `Join<T, X>` | Representa junção (join) entre entidades. Pode ser `INNER JOIN`, `LEFT JOIN` etc. |

---

## Melhores Práticas e Padrões de Uso

1. **Organização em métodos reutilizáveis**
    - Para consultas repetidas, crie métodos em DAO ou repositório para montar o `CriteriaQuery`, permitindo reaproveitar a “árvore” da consulta e só alterar partes dinâmicas.
2. **Paginação**
    - Ao trabalhar com listas grandes, aplicar paginação:
        
        ```java
        TypedQuery<Pessoa> tq = entityManager.createQuery(q);
        tq.setFirstResult(offset); // índice inicial
        tq.setMaxResults(limite); // número máximo de resultados
        List<Pessoa> page = tq.getResultList();
        
        ```
        
3. **Combinação de Predicates dinamicamente**
    - Em cenários de busca avançada (ex.: filtros opcionais), mantenha uma lista de `Predicate` e só adicione ao `where(...)` se o parâmetro de filtro não for nulo:
        
        ```java
        List<Predicate> predicates = new ArrayList<>();
        if (nome != null) {
            predicates.add(cb.like(root.get("nome"), "%" + nome + "%"));
        }
        if (idadeMinima != null) {
            predicates.add(cb.greaterThan(root.get("idade"), idadeMinima));
        }
        // ...
        query.where(cb.and(predicates.toArray(new Predicate[0])));
        
        ```
        
4. **Uso de `cb.construct(...)` para DTOs**
    - Sempre prefira projetar apenas os campos necessários em vez de carregar entidades completas quando não precisar de todos os dados.
5. **Cuidado com `JOIN FETCH` em múltiplos relacionamentos**
    - Muitas junções `fetch` podem gerar *Cartesian product* no SQL. Avalie usar *EntityGraph* ou consultas separadas se a complexidade de join for muito alta.
6. **Evitar modificações no banco dentro de consultas**
    - O Criteria API destina-se a `SELECT`. Para *UPDATE* e *DELETE* em massa, use `CriteriaUpdate` e `CriteriaDelete`, respectivamente (aplicáveis, mas fogem do escopo “consultas básicas”).

---

## Sugestões para Aprofundamento

- **Documentação Oficial do JPA (JSR-338)**
    - Consulte o capítulo sobre “Criteria API” para ver detalhes de métodos e comportamentos específicos.
- **Referência do Hibernate (se estiver usando Hibernate)**
    - O guia oficial do Hibernate inclui exemplos avançados de *Criteria* (por exemplo, subqueries, expressões agregadas, funções SQL específicas).
- **Livros e Artigos Recomendados**
    - *“Java Persistence with Hibernate”* (Christian Bauer, Gavin King) – capítulos sobre Criteria.
    - Blogposts como “Building Dynamic Queries with JPA Criteria API” (vários autores).
- **Exemplos em Projetos Reais**
    - Explore repositórios open-source que empregam *Criteria API*, identificando padrões comuns para filtros dinâmicos, paginação e projeções.

---

### Conclusão

O **Criteria API** do JPA é uma ferramenta poderosa para construir consultas de forma tipada, segura e dinâmica. Através da combinação de `CriteriaBuilder`, `CriteriaQuery`, `Root` e `Predicate`, conseguimos asseverar:

- **Confiabilidade em tempo de compilação** (sem erros de sintaxe de JPQL).
- **Facilidade de construção dinâmica** de filtros, ordenações e projeções.
- **Reuso e organização** em código, especialmente em sistemas que exigem buscas complexas e variantes.

No entanto, para cenários mais simples ou quando houver necessidade de otimização fina de SQL, pode-se optar por JPQL fixo, *NamedQuery* ou mesmo *NativeQuery*. Avalie caso a caso, sempre pesando legibilidade, desempenho e facilidade de manutenção.

Espero que este guia atenda plenamente às suas necessidades! Se desejar aprofundar em subqueries, joins complexos ou atualizações em massa via Criteria, posso complementar com mais detalhes.