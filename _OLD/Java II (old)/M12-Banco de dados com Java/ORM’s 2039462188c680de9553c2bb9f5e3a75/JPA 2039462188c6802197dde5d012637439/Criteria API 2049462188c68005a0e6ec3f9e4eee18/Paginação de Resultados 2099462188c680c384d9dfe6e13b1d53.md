# Paginação de Resultados

---

## Introdução

A paginação é um recurso fundamental em aplicações que lidam com grandes volumes de dados. Em vez de recuperar todos os registros de uma vez — o que pode resultar em alto consumo de memória e lentidão —, a paginação permite obter subconjuntos (páginas) de dados de forma controlada. No contexto do **Java Persistence API (JPA)**, isso é feito principalmente por meio dos métodos `setFirstResult(int)` e `setMaxResults(int)` de um `javax.persistence.TypedQuery` (ou `javax.persistence.Query`).

Neste documento, você verá desde conceitos teóricos até exemplos práticos detalhados de como paginar queries em JPA, além de boas práticas e armadilhas comuns ao lidar com grandes volumes de dados.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Utilizando JPQL com `TypedQuery`
    2. Utilizando Criteria API
    3. Exemplos comentados passo a passo
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    1. `EntityManager`
    2. `TypedQuery` / `Query`
    3. Classes de entidade e anotação de mapeamento
    4. `CriteriaBuilder`, `CriteriaQuery`, `Root`
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

- **Por que paginar?**
    - Evitar o carregamento de grandes conjuntos de resultados inteiros na memória, o que pode causar:
        - Exaustão de recursos (OutOfMemoryError).
        - Lentidão no tempo de resposta.
    - Permitir ao cliente (UI, API REST etc.) exibir dados em blocos (páginas), melhorando a experiência do usuário.
- **Como funciona no JPA?**
    - O JPA, internamente, ao chamar `setFirstResult` e `setMaxResults` em um `TypedQuery`, gera SQL com cláusulas `OFFSET` e `LIMIT` (dependendo do dialeto do banco).
    - Exemplo de SQL gerado (PostgreSQL):
        
        ```sql
        SELECT ...
        FROM tabela
        ORDER BY coluna
        LIMIT <maxResults> OFFSET <firstResult>;
        
        ```
        
- **Diferença entre `setFirstResult` e `setMaxResults`:**
    - `setFirstResult(int startPosition)`: define o índice do primeiro resultado a retornar (zero-based).
    - `setMaxResults(int maxResult)`: define o número máximo de resultados a serem retornados.
- **Importância do `ORDER BY`:**
    - Sempre que paginar resultados, especifique **obrigatoriamente** uma cláusula `ORDER BY`, para garantir consistência entre páginas.
    - Sem um `ORDER BY` determinístico, a ordem dos registros pode variar de uma execução para outra, levando a sobreposição ou “pulando” itens entre páginas.

---

## Sintaxe Detalhada e Uso Prático

### 1. Utilizando JPQL com `TypedQuery`

```java
// 1. Criação de EntityManager (exemplo)
EntityManagerFactory emf = Persistence.createEntityManagerFactory("meu-persistence-unit");
EntityManager em = emf.createEntityManager();

try {
    // 2. Exemplo de JPQL simples
    String jpql = "SELECT u FROM Usuario u ORDER BY u.nome";

    // 3. Construção do TypedQuery para Entidade Usuario
    TypedQuery<Usuario> query = em.createQuery(jpql, Usuario.class);

    // 4. Definindo paginação
    int pagina = 2;            // queremos a página 2
    int tamanhoPagina = 10;    // 10 registros por página

    int primeiroRegistro = (pagina - 1) * tamanhoPagina;
    query.setFirstResult(primeiroRegistro);  // índice do primeiro resultado (zero-based)
    query.setMaxResults(tamanhoPagina);      // quantos resultados retornar

    // 5. Execução da query paginada
    List<Usuario> listaUsuarios = query.getResultList();
    // Agora 'listaUsuarios' contém até 10 usuários da página 2 (índices 10 a 19).
} finally {
    em.close();
    emf.close();
}

```

- **Comentários:**
    1. `(pagina - 1) * tamanhoPagina` calcula corretamente o índice inicial.
    2. `setFirstResult(10)` faz com que o banco pule os 10 primeiros registros.
    3. `setMaxResults(10)` limita a quantidade a 10.

### 2. Utilizando Criteria API

Para cenários em que precisamos montar queries dinamicamente, usa-se a Criteria API. A paginação, porém, segue o mesmo princípio.

```java
// 1. EntityManager
EntityManagerFactory emf = Persistence.createEntityManagerFactory("meu-persistence-unit");
EntityManager em = emf.createEntityManager();

try {
    // 2. Obter o CriteriaBuilder
    CriteriaBuilder cb = em.getCriteriaBuilder();

    // 3. Criar CriteriaQuery para Usuario
    CriteriaQuery<Usuario> cq = cb.createQuery(Usuario.class);
    Root<Usuario> root = cq.from(Usuario.class);

    // 4. Definir ordenação
    cq.select(root).orderBy(cb.asc(root.get("nome")));

    // 5. Criar TypedQuery a partir de CriteriaQuery
    TypedQuery<Usuario> query = em.createQuery(cq);

    // 6. Paginação
    int pagina = 3;
    int tamanhoPagina = 20;
    int primeiroRegistro = (pagina - 1) * tamanhoPagina;

    query.setFirstResult(primeiroRegistro);
    query.setMaxResults(tamanhoPagina);

    // 7. Execução da query
    List<Usuario> listaUsuarios = query.getResultList();
    // 'listaUsuarios' agora contém usuários da página 3 (índices 40 a 59).
} finally {
    em.close();
    emf.close();
}

```

- **Comentários:**
    1. Construímos o `CriteriaQuery` e definimos o `ORDER BY` de forma programática.
    2. A definição de página e tamanho segue a mesma fórmula que o JPQL.

### 3. Variações e Casos de Uso

- **Consulta Nativa (Native Query):**
    
    Mesmo que você utilize `createNativeQuery`, ainda é possível chamar `setFirstResult` e `setMaxResults`. O JPA tentará aplicar `LIMIT` e `OFFSET` conforme o dialeto do banco.
    
    ```java
    String sqlNativo = "SELECT * FROM usuario ORDER BY nome";
    Query nativeQuery = em.createNativeQuery(sqlNativo, Usuario.class);
    
    int pagina = 1;
    int tamanho = 15;
    nativeQuery.setFirstResult((pagina - 1) * tamanho);
    nativeQuery.setMaxResults(tamanho);
    
    List<Usuario> usuarios = nativeQuery.getResultList();
    
    ```
    
    - **Comentário:** Apesar de nativo, a paginação continua funcionando, porém cuidado com diferenças de sintaxe se usar `UNION`, subselects complexos ou procedimentos específicos de cada SGDB.
- **Paginação e Parâmetros Dinâmicos:**
    
    Quando a consulta possui parâmetros (ex.: `:status`, `:dataInicial`), basta setar a paginação após definir os parâmetros:
    
    ```java
    String jpql = "SELECT p FROM Pedido p WHERE p.status = :status ORDER BY p.dataCriacao DESC";
    TypedQuery<Pedido> query = em.createQuery(jpql, Pedido.class);
    query.setParameter("status", StatusPedido.ABERTO);
    // Definir paginação:
    query.setFirstResult(0);
    query.setMaxResults(20);
    
    List<Pedido> pedidos = query.getResultList();
    
    ```
    
    - **Comentário:** A ordem de chamadas deve ser:
        1. `createQuery(...)`
        2. `setParameter(...)` (se houver)
        3. `setFirstResult(...)` e `setMaxResults(...)`
        4. `getResultList()`

---

## Cenários de Restrição ou Não Aplicação

1. **Consultas sem `ORDER BY` consistente:**
    - **Problema:** Sem definição clara de ordenação, a página N pode conter registros que já apareceram em página N+1, ou pular itens.
    - **Solução:** Sempre incluir cláusulas de ordenação determinísticas (`ORDER BY id` ou outro campo único) antes de paginar.
2. **Paginar com junções (JOINs) muito grandes:**
    - **Problema:** Ao usar `JOIN FETCH` em coleções volumosas, o JPA pode retornar duplicações e inflar o resultado antes da paginação, gerando dados incorretos ou desempenho ruim.
    - **Solução:**
        - Evitar `JOIN FETCH` em coleções grandes.
        - Paginar primeiro no nível da entidade principal e, em seguida, buscar relacionamentos de forma lazy ou em batch.
3. **Uso de `setFirstResult` em consultas que não retornam dados ordenados:**
    - **Problema:** Se a consulta não tiver `ORDER BY`, o banco pode otimizar sem garantir uma ordem fixada de resultados.
    - **Solução:** Mesmo que pareça “desperdício”, sempre defina uma ordenação estável para resultados paginados.
4. **Limitações do SGDB em OFFSET altos:**
    - **Problema:** Quando a página solicitada faz `OFFSET 1000000`, o banco ainda precisa “varrer” 1.000.000 de linhas, o que pode ser muito lento.
    - **Solução:**
        - Avaliar “**Keyset Pagination**” (paginar por valores de colunas indexadas, como “WHERE id > últimoId”) quando o OFFSET cresce demais.
        - Avaliar índices adequados na coluna de ordenação.
5. **Cenários de leitura somente streaming (Pipelines ou Cursors):**
    - Em operações de processamento em lote ou leitura por streaming, pode-se preferir **`EntityManager.createQuery(...).getResultStream()`** (Java 8 Streams) em vez de paginar tradicionalmente, dependendo do caso de uso.
    - Entretanto, esse approach não é típico para exibir páginas de resultados em UI, mas sim para processamento interno.

---

## Componentes Chave Associados

### 1. `EntityManager`

- **Pacote:** `javax.persistence.EntityManager`
- **Descrição:** Porta de entrada para operações de persistência em JPA.
- **Métodos relevantes para paginação:**
    - `createQuery(String jpql, Class<T> resultClass)`: retorna `TypedQuery<T>`.
    - `createNativeQuery(String sql, Class<T> resultClass)`: retorna `Query`.

### 2. `TypedQuery` / `Query`

- **Pacote:** `javax.persistence.TypedQuery` / `javax.persistence.Query`
- **Métodos principais de paginação:**
    - `setFirstResult(int startPosition)`: define índice do primeiro resultado (zero-based).
    - `setMaxResults(int maxResult)`: define o número máximo de resultados retornados.

### 3. Classes de Entidade e Anotação de Mapeamento

- **Exemplo:**
    
    ```java
    @Entity
    @Table(name = "usuario")
    public class Usuario {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
    
        @Column(nullable = false, length = 100)
        private String nome;
    
        // outros atributos, getters e setters
    }
    
    ```
    
- Embora a paginação não exija anotações específicas, as colunas que compõem o `ORDER BY` devem estar indexadas para melhorar o desempenho.

### 4. `CriteriaBuilder`, `CriteriaQuery`, `Root`

- **Pacote:** `javax.persistence.criteria`
- **Função:**
    - `CriteriaBuilder cb = em.getCriteriaBuilder();`
    - `CriteriaQuery<Usuario> cq = cb.createQuery(Usuario.class);`
    - `Root<Usuario> root = cq.from(Usuario.class);`
    - `cq.select(root).orderBy(cb.asc(root.get("nome")));`
    - `TypedQuery<Usuario> query = em.createQuery(cq);`
    - Paginação segue com `query.setFirstResult(...)`, `query.setMaxResults(...)`.

---

## Melhores Práticas e Padrões de Uso

1. **Sempre incluir `ORDER BY` antes de paginar**
    - Garante consistência entre páginas; evita registros repetidos/omitidos.
2. **Calcular `firstResult` corretamente**
    - Fórmula usual:
        
        ```
        primeiroRegistro = (numeroPagina - 1) * tamanhoPagina
        
        ```
        
    - Exemplo: para página 1, `firstResult = 0`; página 2, `firstResult = tamanhoPagina`; etc.
3. **Não usar `JOIN FETCH` em colunas de coleção volumosa na mesma query paginada**
    - Em vez disso, paginar a entidade principal e, se necessário, carregar coleções em batch ou lazy.
4. **Indexar colunas usadas em `ORDER BY` e/ou `WHERE`**
    - Ex.: Se `ORDER BY u.nome`, indexe a coluna `nome` na tabela `usuario`.
    - Evita “full table scan” ao pular registros.
5. **Evitar OFFSET muito alto**
    - Páginas com alto deslocamento (`OFFSET 1000000`) são custosos, pois o banco ainda “varre” todos os registros pulados.
    - Para cenários em que usuários desejam páginas muito distantes:
        - Considere **Keyset Pagination** (“seek method”), que usa cláusulas do tipo `WHERE colunaOrdenacao > últimoValorVisto ORDER BY colunaOrdenacao LIMIT tamanhoPagina`.
        - Exemplo:
            
            ```java
            // Exemplo simplificado de keyset pagination (páginas baseadas em último ID)
            String jpqlKeyset = "SELECT u FROM Usuario u WHERE u.id > :ultimoId ORDER BY u.id ASC";
            TypedQuery<Usuario> queryKeyset = em.createQuery(jpqlKeyset, Usuario.class);
            queryKeyset.setParameter("ultimoId", ultimoIdVisto);
            queryKeyset.setMaxResults(tamanhoPagina);
            List<Usuario> paginaUsuarios = queryKeyset.getResultList();
            
            ```
            
        - **Vantagens:** usa índices; evita “OFFSET” custoso; ideal para “scroll infinito” em UIs.
6. **Separar contagem total de registros da consulta de página**
    - Para exibir, por exemplo, “Página X de Y”, é comum executar primeiro:
        
        ```java
        String jpqlCount = "SELECT COUNT(u) FROM Usuario u";
        TypedQuery<Long> countQuery = em.createQuery(jpqlCount, Long.class);
        Long totalRegistros = countQuery.getSingleResult();
        
        ```
        
    - Depois executar a query paginada normal.
    - **Observação:** em tabelas muito grandes, contagens completas podem ser lentas; avalie criar tabelas auxiliares ou usar estatísticas do SGDB quando aplicável.
7. **Tratamento de casos “página além do fim”**
    - Se `firstResult` excede o total, `getResultList()` retornará lista vazia; gerencie em código chamador para não tentar renderizar páginas inexistentes.
8. **Considerar configurações de cache de segundo nível (L2 cache)**
    - Em cenários de múltiplas requisições de páginas similares, usuários podem navegar de volta para páginas previamente acessadas; o cache L2 pode acelerar.
9. **Documentar parâmetros de paginação na API**
    - Em serviços REST, é comum padronizar parâmetros como `page` e `size` (ou `offset` e `limit`), e retornar metadados (total de páginas, total de itens, página atual, tamanho de página).

---

## Exemplo Prático Completo

### Cenário

Vamos supor uma aplicação de gerenciamento de biblioteca que possui a entidade `Livro`. Queremos exibir, de forma paginada, todos os livros publicados, ordenados por título.

### 1. Definição da Entidade

```java
@Entity
@Table(name = "livro")
public class Livro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(nullable = false)
    private String autor;

    @Column(name = "data_publicacao")
    private LocalDate dataPublicacao;

    // Construtores, getters e setters omitidos para brevidade
}

```

### 2. DAO ou Repositório (sem Spring, usando JPA puro)

```java
public class LivroDAO {
    private EntityManager em;

    public LivroDAO(EntityManager em) {
        this.em = em;
    }

    /**
     * Retorna uma lista paginada de livros ordenados por título.
     *
     * @param pagina       Número da página (iniciando em 1).
     * @param tamanhoPagina Quantidade de registros por página.
     * @return Lista de livros da página solicitada.
     */
    public List<Livro> listarLivrosPaginados(int pagina, int tamanhoPagina) {
        // 1. Montar JPQL com ORDER BY
        String jpql = "SELECT l FROM Livro l ORDER BY l.titulo ASC";

        // 2. Criar TypedQuery
        TypedQuery<Livro> query = em.createQuery(jpql, Livro.class);

        // 3. Calcular índices de paginação
        int primeiroRegistro = (pagina - 1) * tamanhoPagina;
        query.setFirstResult(primeiroRegistro);
        query.setMaxResults(tamanhoPagina);

        // 4. Executar e retornar resultados
        return query.getResultList();
    }

    /**
     * Conta o total de livros cadastrados.
     *
     * @return Total de registros na tabela livro.
     */
    public Long contarLivros() {
        String jpqlCount = "SELECT COUNT(l) FROM Livro l";
        TypedQuery<Long> countQuery = em.createQuery(jpqlCount, Long.class);
        return countQuery.getSingleResult();
    }
}

```

### 3. Exemplo de Uso no Serviço / Camada de Negócio

```java
public class LivroService {
    private EntityManagerFactory emf;

    public LivroService() {
        this.emf = Persistence.createEntityManagerFactory("bibliotecaPU");
    }

    /**
     * Método que simula um endpoint que recebe parâmetros de página e tamanho.
     */
    public void exibirLivrosPaginados(int pagina, int tamanhoPagina) {
        EntityManager em = emf.createEntityManager();
        try {
            LivroDAO livroDAO = new LivroDAO(em);

            // Total de livros (para metadados, ex.: total de páginas)
            Long totalRegistros = livroDAO.contarLivros();
            int totalPaginas = (int) Math.ceil((double) totalRegistros / tamanhoPagina);

            System.out.println("Total de registros: " + totalRegistros);
            System.out.println("Total de páginas: " + totalPaginas);

            // Listar livros da página solicitada
            List<Livro> livros = livroDAO.listarLivrosPaginados(pagina, tamanhoPagina);

            System.out.println("Livros na página " + pagina + ":");
            for (Livro l : livros) {
                System.out.printf("ID: %d | Título: %s | Autor: %s | Publicação: %s%n",
                    l.getId(), l.getTitulo(), l.getAutor(), l.getDataPublicacao());
            }
        } finally {
            em.close();
        }
    }
}

```

### 4. Simulação de Execução

```java
public class Main {
    public static void main(String[] args) {
        LivroService service = new LivroService();

        // Exibir página 1 (10 itens por página)
        service.exibirLivrosPaginados(1, 10);

        // Exibir página 2 (10 itens por página)
        service.exibirLivrosPaginados(2, 10);
    }
}

```

- **Explicação passo a passo:**
    1. **`contarLivros()`**: obtemos o total de registros da tabela para calcular metadados (páginas totais).
    2. **`listarLivrosPaginados(pagina, tamanhoPagina)`**:
        - Montamos a string JPQL com `ORDER BY l.titulo`.
        - Chamamos `createQuery(...)` e definimos `setFirstResult` e `setMaxResults`.
        - Retornamos a lista de `Livro` correspondente.
    3. Na classe `Main`, chamamos o serviço duas vezes para exibir as páginas 1 e 2.

---

## Sugestões para Aprofundamento

1. **Keyset Pagination (Seek Method)**
    - Visão geral do método de paginação baseada em valores de colunas indexadas, evitando altos OFFSETs.
    - Artigos recomendados:
        - *“Pagination with JPA and Keyset”* – explica como usar `WHERE id > últimoId`.
        - *“Limit and Offset: Alternatives When working with JPA”* – discute as implicações de desempenho.
2. **Implementação de Cache de Segundo Nível (L2 Cache)**
    - Como configurar frameworks de cache (por exemplo, Ehcache ou Infinispan) para melhorar leituras recorrentes de páginas similares.
    - Exemplos de configuração em `persistence.xml` ou `hibernate.cfg.xml`.
3. **Paginação em Spring Data JPA**
    - Se você eventualmente migrar para Spring Data, conheça as interfaces `Pageable` e `Page<T>` que abstraem parte dessa lógica.
    - Exemplo rápido:
        
        ```java
        public interface LivroRepository extends JpaRepository<Livro, Long> {
            Page<Livro> findAll(Pageable pageable);
        }
        // Uso:
        Pageable pageable = PageRequest.of(pagina-1, tamanhoPagina, Sort.by("titulo").ascending());
        Page<Livro> pageLivros = livroRepository.findAll(pageable);
        
        ```
        
4. **Paginação no Criteria API Avançado**
    - Combinar filtros dinâmicos (predicados) com paginação e ordenação a partir de parâmetros de usuário.
    - Exemplo de método que recebe mapas de filtros e retorna um `Page<T>`.
5. **Ferramentas de Monitoramento de Queries**
    - Usar `hibernate.show_sql` e `hibernate.format_sql` para entender como o SQL é gerado e identificar gargalos.
    - Ferramentas de profiling de banco (por exemplo, PGAdmin, MySQL Workbench) para analisar tempos de execução de consultas paginadas.

---

> Resumo Final:
> 
> - A paginação em JPA se dá por `setFirstResult` (índice inicial) e `setMaxResults` (quantidade de registros).
> - Sempre utilize um `ORDER BY` determinístico.
> - Em grandes volumes, avalie o método de Keyset Pagination para evitar OFFSETs altos.
> - Mantenha colunas de ordenação indexadas e separe a contagem total de registros da consulta paginada.
> - Em aplicações Spring, explore abstrações do Spring Data JPA para simplificar a lógica de paginação.

*contando com as práticas acima, você terá um controle eficiente na recuperação de subconjuntos de dados via JPA, garantindo desempenho e escalabilidade.*