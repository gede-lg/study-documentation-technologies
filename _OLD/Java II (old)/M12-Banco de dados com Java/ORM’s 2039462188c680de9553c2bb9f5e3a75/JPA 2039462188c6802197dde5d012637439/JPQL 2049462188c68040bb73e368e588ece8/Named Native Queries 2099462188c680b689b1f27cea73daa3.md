# Named Native Queries

---

## 1. Introdução

As *Named Native Queries* são consultas SQL nativas (raw SQL) definidas via anotações (`@NamedNativeQuery`) no contexto do JPA. Diferentemente das *Named Queries* em JPQL, que utilizam a sintaxe orientada a entidades do JPA, as *Named Native Queries* permitem escrever comandos SQL diretamente para obter maior flexibilidade, aproveitando recursos específicos do banco de dados ou desempenhos otimizados. Através delas, é possível mapear o resultado dessas consultas para entidades JPA ou até mesmo para estruturas (DTOs) específicas.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#3-conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#4-sintaxe-detalhada-e-uso-pr%C3%A1tico)
    - 2.1 Declaração via `@NamedNativeQuery`
    - 2.2 Mapeamento de Resultados para Entidades (`resultClass`)
    - 2.3 Mapeamento com `@SqlResultSetMapping` (DTOs ou colunas específicas)
    - 2.4 Exemplos de Uso no Repositório / DAO
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#5-cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#6-componentes-chave-associados)
    - 4.1 `@NamedNativeQuery`
    - 4.2 `@SqlResultSetMapping`, `@EntityResult` e `@ColumnResult`
    - 4.3 Métodos do `EntityManager` / `Session`
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#7-melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#8-exemplo-pr%C3%A1tico-completo)
    - 6.1 Cenário: Entidade `Cliente` e Relatório Personalizado
    - 6.2 Declaração das Anotações
    - 6.3 Implementação do Repositório/DAO
    - 6.4 Teste de Funcionamento
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#9-sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

- **O que são Named Native Queries?**
    
    São consultas SQL nativas (raw SQL) definidas em anotações dentro de uma entidade ou classe apropriada. Ao invés de usar JPQL (“SELECT c FROM Cliente c WHERE c.status = :status”), escrevemos o SQL específico do banco (`SELECT * FROM cliente WHERE status = ?`).
    
- **Por que usar SQL nativo?**
    1. **Desempenho**: permitir o uso de planos de execução otimizados pelo banco ou consultas escritas de forma mais performática.
    2. **Funcionalidades Específicas de BD**: aproveitar funções, índices ou extensões específicas (por exemplo, `WITH (NOLOCK)` no SQL Server, funções Postgres como `jsonb_extract_path_text`, etc.).
    3. **Consultas Complexas**: alguns cenários de junções (joins) de múltiplas tabelas ou subqueries complexas podem ficar mais legíveis em SQL puro.
- **Desvantagens em relação ao JPQL**
    - **Portabilidade**: SQL nativo tende a ser específico de cada banco; migrar de MySQL para Postgres pode exigir adaptações.
    - **Acoplamento**: anotações vinculam a aplicação diretamente ao modelo de tabelas no banco, mitigando a abstração de entidades do JPA.
    - **Manutenção**: strings grandes de SQL em anotações podem ficar difíceis de manter ou versionar.
- **Quando usar?**
    - Situações em que JPQL não atende (ex.: consultas recorrentes a funções proprietárias do BD).
    - Quando testes de performance mostram que JPQL é lento ou produz subconsulta ineficiente.
    - Para gerar relatórios complexos onde os resultados não se encaixam perfeitamente em entidades JPA.

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1 Declaração via `@NamedNativeQuery`

A anotação básica para declarar uma *Named Native Query* dentro de uma entidade é:

```java
@Entity
@Table(name = "cliente")
@NamedNativeQuery(
    name        = "Cliente.buscaPorStatus",
    query       = "SELECT * FROM cliente WHERE status = :statusParam",
    resultClass = Cliente.class
)
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String status;

    // getters e setters...
}

```

- **`name`**: identificador único da consulta (normalmente “NomeDaEntidade.nomeDaConsulta” por convenção).
- **`query`**: a string de SQL nativo.
    - É possível usar parâmetros posicionais (`?1`, `?2`) ou nomeados (`:statusParam`).
- **`resultClass`**: classe de entidade JPA para a qual o resultado será mapeado automaticamente. O JPA tentará instanciar objetos dessa classe e popular campos a partir das colunas da tabela (sempre que o nome da coluna corresponder ao campo ou via `@Column`).
- **`resultSetMapping`** (alternativa, usada quando precisamos de mapeamentos personalizados ou DTOs, veja 4.3).

### 4.1.1 Comentários Importantes

- Se a tabela tiver colunas extras que não existem na entidade, a consulta deve selecionar apenas as colunas correspondentes ou usar alias para mapear corretamente.
- Quando `resultClass` não é suficiente (por exemplo, queremos retornar um DTO que não é uma entidade), usamos `resultSetMapping`.

---

### 4.2 Mapeamento de Resultados para Entidades (`resultClass`)

Se a consulta SQL retornar exatamente todas as colunas necessárias para preencher uma entidade (ou subset que corresponda a construtores com `@ConstructorResult`), o JPA cuida do mapeamento automaticamente.

**Exemplo Detalhado de Mapeamento Automático:**

```java
@Entity
@Table(name = "produto")
@NamedNativeQuery(
    name        = "Produto.buscaAtivos",
    query       = "SELECT id, nome, preco FROM produto WHERE ativo = true",
    resultClass = Produto.class
)
public class Produto {
    @Id
    private Long id;

    private String nome;

    private BigDecimal preco;

    private Boolean ativo; // atenção: se não selecionar 'ativo' na query, é nulo!

    // getters e setters...
}

```

- Aqui, a query seleciona `id`, `nome`, `preco`.
- Como o campo `ativo` não está sendo retornado, o JPA irá defini-lo como `null` ou usará valor padrão. Se você quiser que o atributo `ativo` da entidade seja automaticamente populado, inclua-o na lista de colunas ou utilize um `@SqlResultSetMapping` personalizado (ver próximo tópico).

Quando invocamos:

```java
List<Produto> lista = entityManager
    .createNamedQuery("Produto.buscaAtivos", Produto.class)
    .getResultList();

```

O JPA mapeia cada linha retornada para um objeto `Produto`.

---

### 4.3 Mapeamento com `@SqlResultSetMapping` (DTOs ou Colunas Específicas)

Em cenários onde:

- Queremos retornar campos parciais ou colunas que não correspondem exatamente aos atributos da entidade.
- Queremos mapear o resultado para um DTO que não é gerenciado pelo JPA.

Utilizamos `@SqlResultSetMapping` em conjunto com `@NamedNativeQuery`. Exemplo:

```java
@Entity
@Table(name = "cliente")
@SqlResultSetMapping(
    name = "ClienteRelatorioMapping",
    classes = @ConstructorResult(
        targetClass = ClienteRelatorioDTO.class,
        columns = {
            @ColumnResult(name = "id",         type = Long.class),
            @ColumnResult(name = "nome",       type = String.class),
            @ColumnResult(name = "totalPedidos", type = Long.class)
        }
    )
)
@NamedNativeQuery(
    name             = "Cliente.buscaRelatorio",
    query            = "SELECT c.id AS id, c.nome AS nome, COUNT(p.id) AS totalPedidos "
                     + "FROM cliente c "
                     + "JOIN pedido p ON c.id = p.cliente_id "
                     + "WHERE c.ativo = :ativoParam "
                     + "GROUP BY c.id, c.nome",
    resultSetMapping = "ClienteRelatorioMapping"
)
public class Cliente {
    @Id
    private Long id;

    private String nome;

    private Boolean ativo;

    // getters e setters...
}

```

**DTO `ClienteRelatorioDTO`:**

```java
public class ClienteRelatorioDTO {
    private Long id;
    private String nome;
    private Long totalPedidos;

    public ClienteRelatorioDTO(Long id, String nome, Long totalPedidos) {
        this.id = id;
        this.nome = nome;
        this.totalPedidos = totalPedidos;
    }

    // getters e setters, se necessário...
}

```

- **`@SqlResultSetMapping`** define como “traduzir” cada coluna da consulta SQL (“id”, “nome”, “totalPedidos”) para os parâmetros do construtor de `ClienteRelatorioDTO`.
- Em **`@ColumnResult(name = "...")`**, precisamos usar o mesmo alias de coluna definido na query.
- Ao executar:

```java
List<ClienteRelatorioDTO> relatorio = entityManager
    .createNamedQuery("Cliente.buscaRelatorio", "ClienteRelatorioMapping")
    .setParameter("ativoParam", true)
    .getResultList();

```

O JPA instanciará `ClienteRelatorioDTO` para cada linha.

---

### 4.4 Exemplos de Uso no Repositório / DAO

1. **Consulta Simples para Entidade**
    
    ```java
    // Dentro de um DAO ou Repositório:
    public List<Cliente> buscarClientesPorStatus(String status) {
        return entityManager
            .createNamedQuery("Cliente.buscaPorStatus", Cliente.class)
            .setParameter("statusParam", status)
            .getResultList();
    }
    
    ```
    
2. **Consulta com Mapeamento Personalizado (DTO)**
    
    ```java
    public List<ClienteRelatorioDTO> buscarRelatorioClientesAtivos() {
        @SuppressWarnings("unchecked")
        List<ClienteRelatorioDTO> lista = entityManager
            .createNamedQuery("Cliente.buscaRelatorio", "ClienteRelatorioMapping")
            .setParameter("ativoParam", true)
            .getResultList();
        return lista;
    }
    
    ```
    

---

## 5. Cenários de Restrição ou Não Aplicação

1. **Portabilidade Entre Bancos de Dados**
    - Se o objetivo for manter a aplicação independente do provedor de banco, evite SQL específicos (ex.: `LIMIT` no MySQL vs `TOP` no SQL Server). Nestes casos, prefira JPQL.
2. **Operações Básicas de CRUD**
    - Para criar, atualizar, deletar ou consultar entidades simples, o uso de repositórios JPA/JPQL costuma ser suficiente e mais manutenível.
3. **Mapeamento Complexo de Objetos**
    - Se a DOMÍNIO da entidade for complexo (heranças, coleções, relacionamentos), mapeá-los via SQL pode exigir múltiplos joins e anotações auxiliares. Nesses casos, avalie se vale a pena a complexidade versus codificar em JPQL.
4. **Situações de Caching e L2 Cache**
    - Consultas JPQL podem tirar maior proveito de caches de segundo nível (quando configurados), enquanto SQL nativo pode ignorar camadas de cache, reduzindo benefício de performance em alguns cenários.
5. **Manutenção de Strings de SQL em Anotações**
    - Se as consultas nativas são muito extensas (várias dezenas de linhas de SQL), talvez seja melhor movê-las para arquivos externos ou usar frameworks específicos de query (ex.: MyBatis) para manter a legibilidade.

---

## 6. Componentes Chave Associados

### 6.1 `@NamedNativeQuery`

- **Atributos principais**:
    - `name` (String): nome único da query, usado na hora de chamá-la.
    - `query` (String): o SQL a ser executado. Pode conter parâmetros nomeados (`:param`) ou posicionais (`?1`).
    - `resultClass` (Class<?>): classe de entidade JPA que receberá o resultado; faz mapeamento automático de colunas para campos.
    - `resultSetMapping` (String): nome de um `@SqlResultSetMapping` (quando for mapeamento personalizado).
    - `hints` (QueryHint[]): para passar dicas ao provedor (ex.: tempo de cache, flush).

### 6.2 `@SqlResultSetMapping`, `@EntityResult` e `@ColumnResult`

- **`@SqlResultSetMapping`**: registra um mapeamento para converter o `ResultSet` de uma SQL nativa em objetos.
    - Pode usar:
        - **`@EntityResult`**: mapeia colunas para atributos de uma entidade específica (útil quando colunas têm alias diferentes que não batem com nomes de atributos).
        - **`@ConstructorResult`**: mapeia colunas para o construtor de um DTO.
        - **`@ColumnResult`**: mapeia colunas individuais (usado dentro de `@ConstructorResult`).
- **Exemplo com `@EntityResult`**:
    
    ```java
    @SqlResultSetMapping(
      name = "ProdutoMappingCompleto",
      entities = @EntityResult(
        entityClass = Produto.class,
        fields = {
          @FieldResult(name = "id",    column = "produto_id"),
          @FieldResult(name = "nome",  column = "produto_nome"),
          @FieldResult(name = "preco", column = "produto_preco")
        }
      )
    )
    
    ```
    
    - Aqui, `@FieldResult(name, column)` faz o ponto-a-ponto entre atributos e colunas do SQL (útil se a query usa alias diferentes).

### 6.3 Métodos do `EntityManager` / API JPA

- **`createNamedQuery(String name, Class<T> resultClass)`**: regenera um `TypedQuery<T>` para Named Native Query com mapeamento direto em entidade.
- **`createNamedQuery(String name, String resultSetMapping)`**: quando usamos mapeamento via `@SqlResultSetMapping`, retornamos um `Query` genérico (não tipado). Ao iterar, fazemos cast para DTO ou lista de `Object[]`.
- **Parâmetros**:
    - Parâmetros Nomeados: `.setParameter("paramName", valor)`
    - Parâmetros Posicionais: `.setParameter(1, valor)`
- **Execução**:
    - `.getResultList()` para coletar todos.
    - `.getSingleResult()` para retorno único (lança `NoResultException` se nenhum, ou `NonUniqueResultException` se mais de um).

---

## 7. Melhores Práticas e Padrões de Uso

1. **Nomeclatura Consistente**
    - Use o padrão `Entidade.nomeDaConsulta`. Ex.: `"Cliente.buscaPorStatus"`, `"Pedido.relatorioMensal"`.
2. **Separação de Responsabilidades**
    - Declare *Named Native Queries* dentro da própria entidade que representa a tabela principal. Ajuda a manter contexto e facilita a manutenção.
3. **Uso de Aliases em Colunas**
    - Sempre utilize aliases claros na cláusula `SELECT ... AS coluna_alias`. Isso facilita o mapeamento, evita ambiguidades e torna o SQL mais legível.
    - Exemplo: `SELECT c.id AS clienteId, c.nome AS clienteNome, COUNT(o.id) AS totalOrdens ...`
4. **Mapeamento para DTO em Consultas Complexas**
    - Quando retornar dados agregados ou junções de múltiplas tabelas, prefira usar `@SqlResultSetMapping` com `@ConstructorResult` para popular DTOs. Mantém a entidade livre de campos extras e melhora performance (evita carregar objetos pesados).
5. **Documentação e Comentários**
    - Insira comentários no próprio SQL (usando `/* ... */` ou `- comentário`) para explicar trechos complexos. Apesar de estarem dentro de anotações, isso ajuda futuros mantenedores a entender a lógica.
6. **Verificação de Colunas Retornadas**
    - Certifique-se de que as colunas selecionadas realmente correspondem a campos da entidade ou DTO. Em bancos com caixa de texto (Postgres) vs insensível (MySQL), atente à correspondência exata de nomes.
7. **Performance e Índices**
    - Use `EXPLAIN` (Postgres, MySQL) ou `SHOW PLAN` (Oracle, SQL Server) para validar que a consulta nativa está usando índices corretamente. Ajuste índices se necessário.
8. **Evitar String Concatenada em Tempo de Execução**
    - Prefira parâmetros nomeados em vez de concatenar valores dinamicamente no SQL, para prevenir SQL Injection e permitir cache de planos de execução.
    - Correto: `"SELECT * FROM cliente WHERE cidade = :cidadeParam"`.
    - Incorreto: `"SELECT * FROM cliente WHERE cidade = '" + cidade + "'"`.
9. **Habilitar Hints Quando Necessário**
    - Alguns provedores JPA (Hibernate, EclipseLink) aceitam *hints* (`@QueryHint`) para otimizar flush, cache, etc. Exemplo: `@NamedNativeQuery(..., hints = @QueryHint(name = "org.hibernate.timeout", value = "5000"))`.
10. **Manter Manutenível**
    - Se a SQL nativa crescer muito (mais de 30 linhas), considere movê-la para um arquivo externo `.sql` e carregá-la em tempo de inicialização ou usar frameworks como MyBatis. Em JPA/Hibernate, ainda é possível carregar SQL externo, mas isso escapa do escopo de *Named Native Queries* aninhadas em anotações.

---

## 8. Exemplo Prático Completo

### 8.1 Cenário: Entidade `Cliente` e Relatório Personalizado

Suponha que temos:

- Tabela `cliente` no banco, com colunas: `id`, `nome`, `email`, `cidade`, `ativo`.
- Tabela `pedido` com colunas: `id`, `cliente_id`, `valor_total`, `data_pedido`.

Requisito: gerar relatório que liste, para cada cliente ativo, seu `id`, `nome`, `cidade`, e total de pedidos feitos no último mês. Queremos retornar um DTO, não a entidade completa.

### 8.2 Declaração das Anotações

**Entidade `Cliente.java`:**

```java
package com.exemplo.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "cliente")
@SqlResultSetMapping(
    name = "RelatorioClienteMensalMapping",
    classes = @ConstructorResult(
        targetClass = com.exemplo.dto.RelatorioClienteMensalDTO.class,
        columns = {
            @ColumnResult(name = "cliente_id",    type = Long.class),
            @ColumnResult(name = "cliente_nome",  type = String.class),
            @ColumnResult(name = "cliente_cidade",type = String.class),
            @ColumnResult(name = "total_pedidos", type = Long.class)
        }
    )
)
@NamedNativeQuery(
    name             = "Cliente.relatorioMensal",
    query            = "SELECT c.id AS cliente_id, c.nome AS cliente_nome, c.cidade AS cliente_cidade, "
                     + "       COUNT(p.id) AS total_pedidos "
                     + "FROM cliente c "
                     + "LEFT JOIN pedido p ON c.id = p.cliente_id "
                     + "   AND p.data_pedido BETWEEN :dataInicio AND :dataFim "
                     + "WHERE c.ativo = :ativoParam "
                     + "GROUP BY c.id, c.nome, c.cidade",
    resultSetMapping = "RelatorioClienteMensalMapping"
)
public class Cliente implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String email;

    private String cidade;

    private Boolean ativo;

    // Getters e setters omitidos para brevidade...
}

```

**DTO `RelatorioClienteMensalDTO.java`:**

```java
package com.exemplo.dto;

public class RelatorioClienteMensalDTO {
    private Long id;
    private String nome;
    private String cidade;
    private Long totalPedidos;

    public RelatorioClienteMensalDTO(Long id, String nome, String cidade, Long totalPedidos) {
        this.id = id;
        this.nome = nome;
        this.cidade = cidade;
        this.totalPedidos = totalPedidos;
    }

    // Getters e setters (se necessário)...
}

```

### 8.3 Implementação do Repositório/DAO

```java
package com.exemplo.repository;

import com.exemplo.dto.RelatorioClienteMensalDTO;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Repository
public class ClienteRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<RelatorioClienteMensalDTO> gerarRelatorioMensal(
            LocalDate dataInicio, LocalDate dataFim, Boolean ativo) {

        // Converter LocalDate para java.util.Date (caso use JPA < 2.2)
        Date inicio = Date.from(dataInicio.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date fim    = Date.from(dataFim.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());

        Query query = entityManager.createNamedQuery("Cliente.relatorioMensal");
        query.setParameter("dataInicio", inicio);
        query.setParameter("dataFim", fim);
        query.setParameter("ativoParam", ativo);

        @SuppressWarnings("unchecked")
        List<RelatorioClienteMensalDTO> resultados = query.getResultList();
        return resultados;
    }
}

```

> Observações de Sintaxe Comentadas:
> 
> - A query usa `LEFT JOIN` para incluir clientes sem pedidos (total = 0).
> - Parâmetros nomeados: `:dataInicio`, `:dataFim` e `:ativoParam`.
> - Alíases de coluna (`AS cliente_id`, etc.) devem corresponder exatamente aos nomes em `@ColumnResult`.

### 8.4 Teste de Funcionamento

```java
public class TesteRelatorio {

    @Autowired
    private ClienteRepository clienteRepository;

    @Test
    public void testeRelatorioMensal() {
        LocalDate inicioDoMes  = LocalDate.now().withDayOfMonth(1);
        LocalDate fimDoMes     = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());

        List<RelatorioClienteMensalDTO> relatorio =
            clienteRepository.gerarRelatorioMensal(inicioDoMes, fimDoMes, true);

        assertNotNull(relatorio);
        relatorio.forEach(dto -> {
            System.out.println("ID: " + dto.getId()
                             + " | Nome: " + dto.getNome()
                             + " | Cidade: " + dto.getCidade()
                             + " | Total Pedidos: " + dto.getTotalPedidos());
        });
    }
}

```

---

## 9. Sugestões para Aprofundamento

1. **Documentação Oficial JPA/Hibernate:**
    - Consulte a seção de *Named Native Queries* em [Hibernate User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html#sql).
    - Em JPA puro, verifique o capítulo “Named Native Query” na especificação JPA (JSR-338).
2. **Mapeamentos Avançados com `@SqlResultSetMapping`:**
    - Investigue `@FieldResult` dentro de `@EntityResult` para cenários onde colunas de SQL têm nomes diferentes dos atributos Java.
    - Explore o uso de `@ColumnResult` com tipos customizados (ex.: `BigDecimal`, `LocalDateTime`).
3. **Integração com Stored Procedures:**
    - Similarmente, é possível declarar `@NamedStoredProcedureQuery` para chamar procedures e utilizar `@SqlResultSetMapping` para lidar com conjuntos de resultados retornados.
4. **Ferramentas de Profiling de SQL:**
    - Use ferramentas como **Hibernate Statistics**, **SQL Profiler (SQL Server)** ou **pg_stat_statements (Postgres)** para comparar tempo de execução entre JPQL e SQL nativo.
5. **Migração de Consultas Legacy:**
    - Se estiver migrando aplicações legadas de JDBC ou MyBatis para JPA, analise como estruturar *Named Native Queries* de modo a reaproveitar consultas customizadas existentes.
6. **Evitar Vulnerabilidades de Injeção SQL:**
    - Embora usemos parâmetros nomeados, fique atento a casos onde fragmentos dinâmicos de SQL sejam montados em tempo de execução (use **Criteria API** ou **QueryParams** sempre que possível).
7. **Considerações de Transações e Flush:**
    - Ao executar SQL nativo que modifica tabelas que o Hibernate gerencia, certifique-se de que o contexto de persistência está devidamente sincronizado (use `entityManager.clear()` ou `entityManager.flush()` se necessário).

---

> Conclusão:
> 
> 
> As *Named Native Queries* do JPA são poderosas quando há necessidade de flexibilidade e desempenho máximos no acesso ao banco. Porém, devem ser usadas com cautela, evitando-se o acoplamento excessivo ao dialeto SQL do provedor. Seguir as **melhores práticas** de parametrização, nomeclatura e mapeamento de resultados garante consultas mais seguras, legíveis e de manutenção mais simples ao longo do tempo.
>