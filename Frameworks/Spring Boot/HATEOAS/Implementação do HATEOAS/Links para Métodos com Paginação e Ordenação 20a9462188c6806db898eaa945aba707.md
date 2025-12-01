# Links para Métodos com Paginação e Ordenação

---

## 1. Introdução

Em aplicações corporativas, é comum lidar com coleções de registros muito grandes (milhares ou milhões de linhas). Retornar todos esses dados de uma só vez não só degrada a performance como também prejudica a experiência do usuário (por exemplo, interfaces lentas ou falta de responsividade). Para mitigar esse problema, utilizamos **paginação** (limitar quantos itens são retornados por página) e **ordenção** (definir critérios de ordenação dos dados). O Spring Data JPA oferece, de forma nativa, abstrações e padrões para criar métodos de repositório que suportam essa funcionalidade com simplicidade.

Nesta explicação, veremos como criar repositórios no Spring Boot que retornem páginas (`Page<T>`) de dados, como personalizar critérios de ordenação (`Sort`) e como expor isso via camada de serviço e Controladores REST. Também discutiremos boas práticas, cenários em que esses padrões não fizeram sentido e um exemplo prático “ponta a ponta” para consolidar o aprendizado.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
    
    1.1. O que é Paginação e por que usar?
    
    1.2. Ordenação de Resultados
    
    1.3. Papel do Spring Data JPA
    
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    
    2.1. Interfaces do Spring Data: `JpaRepository`, `PagingAndSortingRepository`
    
    2.2. Definindo Métodos com `Pageable` e `Sort`
    
    2.3. Construindo Objetos `PageRequest` (Factory Methods)
    
    2.4. Exemplos de Repositório: Consultas Dinâmicas
    
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
    
    3.1. Conjuntos de Dados Pequenos
    
    3.2. Consultas Complexas que não Suportam `Pageable` Diretamente
    
    3.3. Quando Sobrecarga de Carga Animar Mais do que Beneficiar
    
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    
    4.1. `Page<T>` vs. `Slice<T>`
    
    4.2. `Pageable`, `PageRequest` e `Sort`
    
    4.3. Anotações: `@Query`, `@Param`, `@Repository`
    
    4.4. Configurações de `application.properties` / `application.yml`
    
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
    
    5.1. Indexação no Banco de Dados
    
    5.2. Definir Valores Padrão de Página e Tamanho
    
    5.3. Validar Limites de `page` e `size` (Segurança)
    
    5.4. Evitar `SELECT *` em Consultas Pesadas
    
    5.5. Utilizar DTOs / Projeções para Reduzir Carga
    
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
    
    6.1. Cenário: Gerenciamento de “Produto”
    
    6.2. Estrutura de Pacotes
    
    6.3. Entidade `Produto`
    
    6.4. Repositório com Métodos Paginados e Ordenados
    
    6.5. Serviço (`@Service`) para Paginação
    
    6.6. Controlador REST (`@RestController`)
    
    6.7. Testes de Integração (opcional)
    
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

### 3.1. O que é Paginação e por que usar?

- **Paginação** é o processo de dividir um conjunto grande de resultados em “fatias” (páginas) menores, de tamanho controlado.
- Vantagens:
    - Reduz uso de memória no servidor e no cliente.
    - Diminui o tempo de resposta (ex.: em vez de trazer 100.000 registros, traz 20).
    - Melhora usabilidade em interfaces (ex.: navegação “Próxima Página” / “Anterior”).

### 3.2. Ordenação de Resultados

- **Ordenação** (`Sorting`) significa definir a sequência em que os registros vêm ordenados.
- Pode-se ordenar por uma ou mais colunas, em ordem ascendente ou descendente.
- Em Spring Data, representação via objeto `Sort`, que encapsula uma lista de propriedades + direções (ASC, DESC).

### 3.3. Papel do Spring Data JPA

- O Spring Data JPA abstrai grande parte do código boilerplate de repositório e permite:
    1. Declarar interfaces que estendem `JpaRepository<T, ID>` ou `PagingAndSortingRepository<T, ID>`.
    2. Automatizar a implementação de consultas baseadas em convenções de nomenclatura (ex.: `findByNomeContaining`) ou **consultas customizadas com** `@Query`.
    3. Injetar automaticamente `Pageable` e `Sort` nos métodos, o que gera SQL com cláusulas `LIMIT/OFFSET` (paginação) e `ORDER BY`.
    4. Retornar objetos de página (`Page<T>`) que contêm metadados como total de registros, total de páginas, número de página atual etc.

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1. Interfaces do Spring Data

- **`PagingAndSortingRepository<T, ID>`**
    - Fornece métodos CRUD + métodos para paginação e ordenação.
    - Principais métodos herdados:
        - `Iterable<T> findAll(Sort sort);`
        - `Page<T> findAll(Pageable pageable);`
- **`JpaRepository<T, ID>`**
    - Estende `PagingAndSortingRepository` e `CrudRepository`.
    - Fornece métodos extras (flush, saveAndFlush, deleteInBatch etc.).
    - Caso queira reaproveitar recursos JPA específicos, prefira usar `JpaRepository`.

> Observação: Por convenção, a maioria dos desenvolvedores utiliza JpaRepository, pois já engloba paginação/ordenação e adiciona funcionalidades extras do JPA.
> 

### 4.2. Definindo Métodos com `Pageable` e `Sort`

- Para criar métodos pagináveis / ordenáveis em seu repositório, basta incluir parâmetros `Pageable` ou `Sort` na assinatura do método:

```java
@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // 1. Consultar todos os produtos, retornando página de resultados:
    Page<Produto> findAll(Pageable pageable);

    // 2. Consultar produtos por categoria, com paginação:
    Page<Produto> findByCategoria(String categoria, Pageable pageable);

    // 3. Consultar produtos cujo nome contenha parte da string, ordenando por preço:
    Page<Produto> findByNomeContaining(String termo, Pageable pageable);

    // 4. Usando Sort sem paginação:
    List<Produto> findByCategoria(String categoria, Sort sort);

    // 5. Consulta customizada via @Query com parâmetros nomeados, suportando paginação:
    @Query("SELECT p FROM Produto p WHERE p.preco >= :precoMinimo AND p.preco <= :precoMaximo")
    Page<Produto> filtrarPorFaixaPreco(
        @Param("precoMinimo") BigDecimal min,
        @Param("precoMaximo") BigDecimal max,
        Pageable pageable
    );
}

```

- **Como funciona por trás dos panos?**
    - O Spring Data identifica que o método retorna `Page<Produto>` e contém um parâmetro `Pageable`. Automaticamente, ele gera um SQL com cláusula `LIMIT ? OFFSET ?` e monta um count separado (`SELECT COUNT(...)`) para calcular `getTotalElements()`.
    - Se o método tiver `Sort sort` ao invés de `Pageable`, ele só aplicará `ORDER BY` e retornará todos os registros que batem no filtro (atenção a possíveis problemas de memória se o filtro retornar muitos resultados).

### 4.3. Construindo Objetos `PageRequest` (Factory Methods)

Para chamar esses métodos, precisamos criar instâncias de `Pageable`. A forma mais comum é usar `PageRequest.of(int page, int size, Sort sort)`:

```java
// Import estático de Sort.Direction
import static org.springframework.data.domain.Sort.Direction.*;

Pageable pageableSimples = PageRequest.of(0, 10);
// Página 0 (primeira), 10 elementos, ordenação padrão (sem Sort).

Pageable pageableOrdenado = PageRequest.of(
    2,      // página (0-based): terceira página
    5,      // 5 itens por página
    DESC,   // direção (ASC ou DESC)
    "preco" // campo para ordenação
);

// Para múltiplos campos de ordenação:
Sort sortComposto = Sort.by(ASC, "categoria")
                       .and(Sort.by(DESC, "preco"));

Pageable pageableComposto = PageRequest.of(1, 20, sortComposto);

```

- **Explicando o `PageRequest.of(...)`**
    1. `page` é zero-based (ou seja, `page = 0` equivale à primeira página).
    2. `size` é quantos itens por página.
    3. O terceiro parâmetro é `Sort sort`; há overloads que aceitam `Direction` + propriedades ou diretamente um objeto `Sort`.

### 4.4. Exemplos de Repositório: Consultas Dinâmicas

### 4.4.1. Consulta por nome parcial + ordenação customizada

```java
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    /**
     * Busca clientes cujo nome contenha "parteNome".
     * Retorna uma Page<Cliente> de acordo com o Pageable passado.
     */
    Page<Cliente> findByNomeContainingIgnoreCase(String parteNome, Pageable pageable);
}

```

Na camada de serviço, chamaríamos:

```java
@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public Page<Cliente> buscarClientesPaginados(String termo, int page, int size, String campoOrdenacao, String direcao) {
        Sort sort = Sort.by(Sort.Direction.fromString(direcao), campoOrdenacao);
        Pageable pageable = PageRequest.of(page, size, sort);
        return clienteRepository.findByNomeContainingIgnoreCase(termo, pageable);
    }
}

```

### 4.4.2. Uso de `@Query` para casos mais complexos

```java
@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Query("""
        SELECT p
        FROM Pedido p
        WHERE p.dataPedido BETWEEN :inicio AND :fim
          AND p.status = :status
    """)
    Page<Pedido> buscarPorPeriodoEStatus(
        @Param("inicio") LocalDate inicio,
        @Param("fim") LocalDate fim,
        @Param("status") StatusPedido status,
        Pageable pageable
    );
}

```

Assim, você pode combinar múltiplas condições e ainda parametrizar a paginação.

---

## 5. Cenários de Restrição ou Não Aplicação

### 5.1. Conjuntos de Dados Pequenos

- **Quando usar paginação faz pouco sentido?**
    - Se a tabela tiver pouquíssimos registros (ex.: < 500 linhas) e for sempre filtrada antes, às vezes basta um `findAll(Sort sort)` ou `findAll()` normal, sem paginar.
    - Cenários de dados “sigilosos”, onde retornar tudo de uma vez consome pouca memória e não impacta performance.

### 5.2. Consultas Complexas que não Suportam `Pageable` Diretamente

- **Native Queries com `JOIN` MUITO complexos** podem não se encaixar diretamente em `Pageable` se envolver mapeamento manual.
    - Se você usar `EntityManager.createNativeQuery(...)` para uma query nativa customizada, é preciso elaborar manualmente o count total ou usar **`Querydsl`** ou **`Criteria API`** para compor a paginação.
    - Quando você fizer queries que retornem colunas não diretamente mapeadas para a entidade (projeções customizadas), muitas vezes não há suporte automático de `Pageable`. Há alternativas, como usar `JpaSpecificationExecutor` ou retornar `List<DTO>` e, em seguida, embalar em um `PageImpl<DTO>` manualmente.

### 5.3. Quando Sobrecarga de Carga Não Beneficia

- **Uso inadequado de paginação** pode levar a mais chamadas ao banco (um count adicional + fetch de cada página). Se o cliente jamais navegar para a segunda página, talvez carregar tudo em memória e filtrar no servidor seja mais simples (embora, em geral, a compensação favoreça a paginação).
- Em operações de ETL ou lote, paginar a consulta pode ser vantajoso (para processar em blocos), mas a aplicação transacional (online) pode preferir processos assíncronos ou fluxos de streaming (ex.: Spring Data Streams).

---

## 6. Componentes Chave Associados

### 6.1. `Page<T>` vs. `Slice<T>`

- **`Page<T>`**
    - Contém:
        - Conteúdo da página (`List<T>`).
        - Métodos: `getTotalPages()`, `getTotalElements()`, `getNumber()` (página atual), `getSize()`, `hasNext()`, `hasPrevious()` etc.
    - Internamente, gera uma consulta COUNT(...) separada para saber o total de registros.
- **`Slice<T>`**
    - Semelhante a `Page<T>`, mas **não** traz informação de `getTotalElements()` (não gera query COUNT); traz apenas:
        - Conteúdo da “fatia” atual.
        - Indica se há próxima fatia: `hasNext()`.
    - Útil quando você quer evitar a sobrecarga do COUNT, mas ainda quer navegar “páginas a páginas”.

### 6.2. `Pageable`, `PageRequest` e `Sort`

- **`Pageable`**
    - Interface que carrega parâmetros de paginação:
        - `getPageNumber()` (número da página, zero-based).
        - `getPageSize()` (tamanho da página).
        - `getOffset()` (quantos itens pular = `pageNumber * pageSize`).
        - `getSort()` (objeto `Sort`).
- **`PageRequest`**
    - Classe concreta que implementa `Pageable`.
    - Possui factories estáticas para criar instâncias:
        - `PageRequest.of(int page, int size)` ou
        - `PageRequest.of(int page, int size, Sort sort)` ou
        - `PageRequest.of(int page, int size, Sort.Direction direction, String... properties)`.
- **`Sort`**
    - Classe que encapsula regras de ordenação.
    - Pode ser construído de várias formas:
        
        ```java
        Sort sort1 = Sort.by(Direction.ASC, "nome");
        Sort sort2 = Sort.by("categoria").descending();
        Sort sort3 = Sort.by(Direction.ASC, "categoria", "nome");
        Sort sortComposto = sort1.and(sort2);
        
        ```
        

### 6.3. Anotações Importantes

- **`@Repository`**
    - Marca uma classe como componente de repositório, habilitando tradução de exceções JPA.
- **`@Query`**
    - Permite escrever JPQL (ou SQL nativo, se `nativeQuery = true`) diretamente no método de repositório.
    - Pode aceitar `Pageable` e/ou `Sort` em sua assinatura. Ex.:
        
        ```java
        @Query("SELECT p FROM Produto p WHERE p.categoria = :cat")
        Page<Produto> buscarPorCategoriaComPagina(
            @Param("cat") String categoria,
            Pageable pageable
        );
        
        ```
        
- **`@Param`**
    - Usado para mapear parâmetros nomeados em JPQL/SQL.

### 6.4. Configurações de `application.properties` / `application.yml`

Embora a maior parte do comportamento de paginação venha “de fábrica”, existem algumas configurações comumente ajustadas:

```
# application.properties

# 1. Define o tamanho-padrão de página se o cliente não informar:
spring.data.web.pageable.default-page-size=20
# 2. Define se o cliente pode solicitar página 0 ou 1 (padrão é 0, mas algumas APIs preferem 1-based):
spring.data.web.pageable.one-indexed-parameters=false

# 3. Define limites mínimos e máximos de size (evitar over-fetching):
spring.data.web.pageable.max-page-size=200

# 4. Configurações de Dialeto, se necessário:
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

```

Quando você injeta `Pageable` como parâmetro em métodos de controladores (`@RestController`), o Spring MVC respeita essas propriedades automaticamente. Por exemplo:

```java
@GetMapping("/produtos")
public Page<Produto> listar(
    @RequestParam(required = false, defaultValue = "") String nome,
    @PageableDefault(size = 10, sort = "nome", direction = Sort.Direction.ASC) Pageable pageable
) {
    return produtoService.buscarPorNome(nome, pageable);
}

```

---

## 7. Melhores Práticas e Padrões de Uso

### 7.1. Indexação no Banco de Dados

- **Por que indexar?**
    - Consultas paginadas/ordenadas costumam usar cláusulas `WHERE` e `ORDER BY` em colunas específicas. Se não houver índices adequados, o banco fará “full table scan”, tornando a paginação lenta.
- **Como indexar?**
    - Adicione índices (`@Column(name = "...")` + `@Index(...)` ou via migrations) nas colunas frequentemente usadas em filtros e ordenações.
    - Exemplo em JPA (Hibernate 5+ com anotações de índice):
        
        ```java
        @Entity
        @Table(name = "produto",
               indexes = {
                 @Index(name = "idx_produto_categoria", columnList = "categoria"),
                 @Index(name = "idx_produto_preco", columnList = "preco")
               })
        public class Produto { ... }
        
        ```
        

### 7.2. Definir Valores Padrão de Página e Tamanho

- Configure limites razoáveis para evitar que clientes solicitem `size=10000` e travem seu sistema.
- Use `@PageableDefault` em parâmetros de controlador ou defina em `application.properties` (como vimos acima) para proteger:

```java
@GetMapping("/clientes")
public Page<Cliente> listar(
    @PageableDefault(size = 15, sort = "nome", direction = Direction.ASC) Pageable pageable
) {
    return clienteService.todosClientes(pageable);
}

```

### 7.3. Validar Limites de `page` e `size` (Segurança)

- Mesmo com configurações, é útil validar `page` e `size` na camada de serviço ou via interceptadores, principalmente se sua API for pública.
- Por exemplo, recusar `page < 0` ou `size > 100` explicitamente e retornar erro `400 Bad Request`.

### 7.4. Evitar `SELECT *` em Consultas Pesadas

- Se a sua entidade tiver colunas pesadas (BLOBs, CLOBs, colunas JSON etc.), considere usar **Projeções** ou **DTOs** para retornar apenas os campos necessários em listagens.
- Exemplo de projeção em Spring Data JPA:
    
    ```java
    public interface ProdutoView {
        String getNome();
        BigDecimal getPreco();
    }
    
    public interface ProdutoRepository extends JpaRepository<Produto, Long> {
        Page<ProdutoView> findAllProjectedBy(Pageable pageable);
    }
    
    ```
    
    - Isso evita carregar colunas desnecessárias, acelerando consultas e reduzindo tráfego de rede.

### 7.5. Utilizar DTOs / Projeções para Reduzir Carga

- Caso você precise retornar dados agregados, junte entidades ou dados de várias tabelas, utilize query customizada que preencha um DTO:
    
    ```java
    @Query("""
      SELECT new com.meuprojeto.dto.ProdutoResumoDTO(p.id, p.nome, c.nome, p.preco)
      FROM Produto p
      JOIN p.categoria c
    """)
    Page<ProdutoResumoDTO> listarResumo(Pageable pageable);
    
    ```
    
    - Esta abordagem evita o mapeamento completo de entidades e retorna apenas o que interessa para a view.

---

## 8. Exemplo Prático Completo

### 8.1. Cenário: Gerenciamento de “Produto”

Suponha uma aplicação que gere e controle produtos. Queremos expor uma API REST que permita:

1. Listar todos os produtos, paginados e ordenados.
2. Buscar produtos por categoria ou nome parcial, com paginação.
3. Filtrar produtos por faixa de preço, com paginação.

Imagine que usamos PostgreSQL como banco de dados.

---

### 8.2. Estrutura de Pacotes (Sugestão)

```
src/main/java/
└── com
    └── exemplo
        └── produtoapi
            ├── ProdutoApiApplication.java
            ├── domain
            │   └── entidade
            │       └── Produto.java
            ├── repository
            │   └── ProdutoRepository.java
            ├── service
            │   └── ProdutoService.java
            ├── controller
            │   └── ProdutoController.java
            └── dto
                ├── ProdutoDTO.java
                └── ProdutoFiltroDTO.java

```

---

### 8.3. Entidade `Produto`

```java
package com.exemplo.produtoapi.domain.entidade;

import java.math.BigDecimal;
import javax.persistence.*;

@Entity
@Table(
    name = "produto",
    indexes = {
      @Index(name = "idx_produto_categoria", columnList = "categoria"),
      @Index(name = "idx_produto_preco", columnList = "preco")
    }
)
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 50)
    private String categoria;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal preco;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    // Construtores, getters e setters omitidos para brevidade

    public Produto() { }

    public Produto(String nome, String categoria, BigDecimal preco, String descricao) {
        this.nome = nome;
        this.categoria = categoria;
        this.preco = preco;
        this.descricao = descricao;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}

```

---

### 8.4. Repositório com Métodos Paginados e Ordenados

```java
package com.exemplo.produtoapi.repository;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.exemplo.produtoapi.domain.entidade.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    /**
     * 1. Listar todos os produtos com paginação:
     *    - O método findAll(Pageable pageable) já é fornecido pelo JpaRepository.
     */

    // 2. Buscar produtos por categoria, paginados:
    Page<Produto> findByCategoria(String categoria, Pageable pageable);

    // 3. Buscar produtos cujo nome contenha a string (case-insensitive), paginados:
    Page<Produto> findByNomeContainingIgnoreCase(String termo, Pageable pageable);

    // 4. Busca por faixa de preço usando @Query, paginada:
    @Query("""
        SELECT p
        FROM Produto p
        WHERE p.preco BETWEEN :min AND :max
    """)
    Page<Produto> buscarPorFaixaPreco(
        @Param("min") BigDecimal precoMinimo,
        @Param("max") BigDecimal precoMaximo,
        Pageable pageable
    );

    // 5. Retornar lista ordenada sem paginação (exemplo):
    List<Produto> findByCategoria(String categoria, Sort sort);
}

```

> Observação: O método findAll(Pageable) já existe, portanto não precisamos declará-lo. Métodos customizados com filtros (categoria, nome, faixa de preço) devem declarar Pageable para paginar.
> 

---

### 8.5. Serviço (`@Service`) para Paginação

```java
package com.exemplo.produtoapi.service;

import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import com.exemplo.produtoapi.domain.entidade.Produto;
import com.exemplo.produtoapi.repository.ProdutoRepository;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    /**
     * 1. Listar todos os produtos, paginados e ordenados:
     */
    public Page<Produto> listarTodos(int pagina, int tamanho, String campoOrdenacao, String direcao) {
        Sort sort = Sort.by(Sort.Direction.fromString(direcao), campoOrdenacao);
        Pageable pageable = PageRequest.of(pagina, tamanho, sort);
        return produtoRepository.findAll(pageable);
    }

    /**
     * 2. Buscar produtos por categoria:
     */
    public Page<Produto> buscarPorCategoria(String categoria, int pagina, int tamanho, String campoOrdenacao, String direcao) {
        Sort sort = Sort.by(Sort.Direction.fromString(direcao), campoOrdenacao);
        Pageable pageable = PageRequest.of(pagina, tamanho, sort);
        return produtoRepository.findByCategoria(categoria, pageable);
    }

    /**
     * 3. Buscar produtos por nome parcial:
     */
    public Page<Produto> buscarPorNome(String termo, int pagina, int tamanho, String campoOrdenacao, String direcao) {
        Sort sort = Sort.by(Sort.Direction.fromString(direcao), campoOrdenacao);
        Pageable pageable = PageRequest.of(pagina, tamanho, sort);
        return produtoRepository.findByNomeContainingIgnoreCase(termo, pageable);
    }

    /**
     * 4. Filtrar por faixa de preço:
     */
    public Page<Produto> filtrarPorFaixaPreco(BigDecimal min, BigDecimal max,
                                              int pagina, int tamanho,
                                              String campoOrdenacao, String direcao) {
        Sort sort = Sort.by(Sort.Direction.fromString(direcao), campoOrdenacao);
        Pageable pageable = PageRequest.of(pagina, tamanho, sort);
        return produtoRepository.buscarPorFaixaPreco(min, max, pageable);
    }

    /**
     * 5. Obter um produto por ID (sem paginação):
     */
    public Optional<Produto> buscarPorId(Long id) {
        return produtoRepository.findById(id);
    }

    /**
     * 6. Criar ou atualizar um produto:
     */
    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

    /**
     * 7. Remover produto:
     */
    public void deletar(Long id) {
        produtoRepository.deleteById(id);
    }
}

```

---

### 8.6. Controlador REST (`@RestController`)

```java
package com.exemplo.produtoapi.controller;

import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.exemplo.produtoapi.domain.entidade.Produto;
import com.exemplo.produtoapi.service.ProdutoService;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    /**
     * 1. Listar todos os produtos paginados.
     * Exemplo de chamada: GET /api/produtos?page=0&size=10&sort=preco,desc
     */
    @GetMapping
    public ResponseEntity<Page<Produto>> listarTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nome") String sort,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Page<Produto> paginaProdutos = produtoService.listarTodos(page, size, sort, direction);
        return ResponseEntity.ok(paginaProdutos);
    }

    /**
     * 2. Buscar por categoria:
     * Exemplo: GET /api/produtos/categoria?categoria=Eletronicos&page=1&size=5&sort=preco,desc
     */
    @GetMapping("/categoria")
    public ResponseEntity<Page<Produto>> buscarPorCategoria(
            @RequestParam String categoria,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nome") String sort,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Page<Produto> paginaProdutos = produtoService.buscarPorCategoria(categoria, page, size, sort, direction);
        return ResponseEntity.ok(paginaProdutos);
    }

    /**
     * 3. Buscar por nome parcial:
     * Exemplo: GET /api/produtos/nome?termo=smart&page=0&size=8&sort=preco,desc
     */
    @GetMapping("/nome")
    public ResponseEntity<Page<Produto>> buscarPorNome(
            @RequestParam String termo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nome") String sort,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Page<Produto> paginaProdutos = produtoService.buscarPorNome(termo, page, size, sort, direction);
        return ResponseEntity.ok(paginaProdutos);
    }

    /**
     * 4. Filtrar por faixa de preço:
     * Exemplo: GET /api/produtos/preco?min=100&max=500&page=0&size=5&sort=preco,asc
     */
    @GetMapping("/preco")
    public ResponseEntity<Page<Produto>> filtrarPorFaixaPreco(
            @RequestParam BigDecimal min,
            @RequestParam BigDecimal max,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "preco") String sort,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Page<Produto> paginaProdutos = produtoService.filtrarPorFaixaPreco(min, max, page, size, sort, direction);
        return ResponseEntity.ok(paginaProdutos);
    }

    /**
     * 5. Recuperar produto por ID (sem paginação):
     */
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        Optional<Produto> produtoOpt = produtoService.buscarPorId(id);
        return produtoOpt
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * 6. Criar um novo produto:
     */
    @PostMapping
    public ResponseEntity<Produto> criar(@RequestBody Produto produto) {
        Produto criado = produtoService.salvar(produto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    /**
     * 7. Atualizar produto existente:
     */
    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(@PathVariable Long id, @RequestBody Produto produto) {
        if (!produtoService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        produto.setId(id);
        Produto atualizado = produtoService.salvar(produto);
        return ResponseEntity.ok(atualizado);
    }

    /**
     * 8. Deletar produto:
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!produtoService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        produtoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

```

> Observações importantes no Controlador:
> 
> 1. Os parâmetros `page`, `size`, `sort` e `direction` permitem ao cliente montar a URL exata para paginação e ordenação.
> 2. Por padrão, `page = 0` (primeira página), `size = 10` (dez itens), `sort = nome`, `direction = asc`.
> 3. Caso o cliente não envie `sort` ou `direction`, os valores padrões são usados (via `@RequestParam(defaultValue=...)`).

---

### 8.7. Testando a API

- **Exemplo de chamada CURL para listar produtos (página 1, 5 itens, ordenado por preço desc):**
    
    ```bash
    curl -X GET "http://localhost:8080/api/produtos?page=1&size=5&sort=preco,desc"
    
    ```
    
    - A resposta virá no formato JSON padrão do Spring Data, contendo metadados:
        
        ```
        {
          "content": [
            {
              "id": 23,
              "nome": "Smartphone X",
              "categoria": "Eletronicos",
              "preco": 2500.00,
              "descricao": "..."
            },
            // ... até 5 itens
          ],
          "pageable": {
            "sort": {
              "sorted": true,
              "unsorted": false,
              "empty": false
            },
            "pageNumber": 1,
            "pageSize": 5,
            "offset": 5,
            "paged": true,
            "unpaged": false
          },
          "totalElements": 42,
          "totalPages": 9,
          "last": false,
          "size": 5,
          "number": 1,
          "sort": {
            "sorted": true,
            "unsorted": false,
            "empty": false
          },
          "numberOfElements": 5,
          "first": false,
          "empty": false
        }
        
        ```
        
    - **Campos principais no JSON de retorno:**
        - `content`: lista de objetos do tipo `Produto` (até o tamanho de página).
        - `totalElements`: total de registros que atendem ao filtro.
        - `totalPages`: número total de páginas disponíveis.
        - `pageable`: metadata da requisição (página, tamanho, ordenação).
        - `sort`: metadata de ordenação.
        - `first` / `last`: indica se é a primeira ou última página.

---

## 9. Sugestões para Aprofundamento

1. **Spring Data REST**
    - Permite expor automaticamente repositórios como endpoints HATEOAS, já gerando links de paginação (`_links.next`, `_links.prev`).
    - Documentação oficial:
        - [https://docs.spring.io/spring-data/rest/docs/current/reference/html/](https://docs.spring.io/spring-data/rest/docs/current/reference/html/)
2. **Spring HATEOAS**
    - Se desejar adicionar manualmente links seguindo padrões REST (self, nextPage, prevPage), explore Spring HATEOAS para enriquecer recursos com links navegacionais.
    - Tutorial básico:
        - [https://spring.io/guides/gs/hateoas/](https://spring.io/guides/gs/hateoas/)
3. **Querydsl / Criteria API**
    - Para montar consultas dinâmicas avançadas (filtragem dinâmica com paginação), avalie Querydsl (DSL fortemente tipada) ou Criteria API do JPA.
    - Exemplos:
        - [https://www.baeldung.com/introduction-to-querydsl](https://www.baeldung.com/introduction-to-querydsl)
        - [https://www.baeldung.com/hibernate-criteria-queries](https://www.baeldung.com/hibernate-criteria-queries)
4. **Projeções Dinâmicas (DTOs)**
    - Utilize `interface-based projections` ou `class-based projections` para retornar apenas campos necessários, evitando entidades completas.
    - Documentação Spring Data JPA Projections:
        - [https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#projections](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#projections)
5. **Limpeza de Entidade em Consultas Pesadas**
    - Em cenários de escrita intensiva, cuidado com “N+1 selects”. Utilize `EntityGraph` ou `JOIN FETCH` para evitar múltiplas consultas no carregamento de associações em entidades relacionadas — importante quando se combina paginação e carregamento de relacionamentos.
6. **Validação de Parâmetros de Paginação**
    - Para evitar abusos de API, implemente validação customizada de `page` e `size` (por exemplo, limitando `size <= 100`).
    - Utilize `@Validated` e `@Min`, `@Max` no controlador para garantir valores adequados:
    
    ```java
    @GetMapping
    public Page<Produto> listar(
        @RequestParam(defaultValue = "0") @Min(0) int page,
        @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
        // ...
    ) { ... }
    
    ```
    
7. **Monitoramento de Performance**
    - Ferramentas como `Spring Boot Actuator` + `micrometer` para medir tempo de resposta de queries.
    - Observabilidade: registre tempo de execução de consultas paginadas para identificar gargalos.

---

### Conclusão

Implementar paginação e ordenação no Spring Boot com Spring Data JPA é relativamente direto graças às abstrações `Pageable`, `Page<T>`, `Sort` e repositórios estendidos de `JpaRepository`. Seguindo boas práticas (indexação, uso de projeções, validação de parâmetros), é possível construir APIs REST eficientes e escaláveis que atendem a aplicações corporativas de médio e grande porte. Além disso, frameworks como Spring Data REST e Spring HATEOAS podem enriquecer os recursos retornados com links de navegação automática entre páginas, caso desejado.

Sinta-se à vontade para explorar os tópicos sugeridos e aprofundar-se em cada aspecto quando necessário.!---