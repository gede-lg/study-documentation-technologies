# Mapeando Seleções Básicas de Entidades

---

## 1. Introdução

O **Java Persistence Query Language (JPQL)** é a linguagem de consulta orientada a objetos definida pela especificação JPA (Java Persistence API). Enquanto o SQL é voltado diretamente para tabelas e colunas do banco de dados, o JPQL trabalha em termos de **entidades** (classes anotadas com `@Entity`) e seus atributos. Isso garante maior portabilidade e desacoplamento da aplicação em relação ao modelo físico do banco de dados.

**Objetivos desta seção de Introdução**:

- Contextualizar brevemente o papel do JPQL dentro do JPA
- Explicar como ele traduz conceitos do modelo orientado a objetos para consultas relacionais

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Formato básico de SELECT
    2. Selecionando todas as entidades vs. colunas específicas (projeções)
    3. JOINs e condições
    4. Parâmetros nomeados e posicionais
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    1. Anotações de entidade (`@Entity`, `@Table`, etc.)
    2. `EntityManager` e interfaces relacionadas (`Query`, `TypedQuery`)
    3. `PersistenceUnit` e configuração
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

1. **Entidade vs. Tabela**
    - No JPA, cada classe anotada com `@Entity` mapeia uma tabela do banco.
    - Os campos dessas classes (com `@Column`, `@Id`, etc.) representam colunas.
    - O JPQL “fala” em termos dessas classes e atributos, não em termos de tabelas físicas.
2. **Unidade de Persistência (Persistence Unit)**
    - Conjunto de configurações (em `persistence.xml` ou via `javax.persistence.spi.PersistenceProvider`) que define o provedor JPA, dialeto do banco, unidades de transação etc.
    - A partir daí, obtém-se um `EntityManagerFactory` e, consequentemente, um `EntityManager` para executar consultas JPQL.
3. **Diferença principal entre SQL e JPQL**
    - **SQL**: `SELECT nome, idade FROM pessoa WHERE idade > 18;`
    - **JPQL**: `SELECT p.nome, p.idade FROM Pessoa p WHERE p.idade > 18`
        - `Pessoa` é o nome da classe Java (`@Entity`), não o nome da tabela física.
        - `p` é um alias de instância de entidade.
4. **Vantagens do JPQL**
    - Portabilidade: não se preocupa com variações de sintaxe de dialetos (MySQL, PostgreSQL, Oracle etc.).
    - Integração com o modelo de domínio: consultas escritas em termos de objetos Java, facilitando manutenção e evoluções do esquema.
    - Suporte a projeções em objetos (DTOs) diretamente via construtores.

---

## 4. Sintaxe Detalhada e Uso Prático

Nesta seção, abordaremos exemplos comentados de como escrever SELECTs básicos em JPQL, incluindo variações de sintaxe.

### 4.1 Formato Básico de SELECT

```java
// 1. Obtendo o EntityManager (supondo que já exista um EntityManagerFactory configurado)
EntityManagerFactory emf = Persistence.createEntityManagerFactory("minhaPU");
EntityManager em = emf.createEntityManager();

// 2. Exemplo: Selecionar todas as instâncias da entidade Cliente
String jpqlTodas = "SELECT c FROM Cliente c";
TypedQuery<Cliente> queryTodas = em.createQuery(jpqlTodas, Cliente.class);
List<Cliente> listaClientes = queryTodas.getResultList();
// Aqui, 'c' é um alias para cada instância de Cliente.
// O JPA converte isso em: SELECT * FROM cliente; (dependendo do mapeamento)

```

- **Explicação**:
    - `SELECT c`: seleciona cada objeto `Cliente` (não colunas isoladas).
    - `FROM Cliente c`: indica que a consulta é feita sobre a entidade `Cliente` (classe anotada).
    - O resultado é retornado como lista de objetos `Cliente`.

### 4.2 Selecionando Entidades versus Colunas Específicas (Projeções)

### 4.2.1 Seleção de campos simples (projeção em múltiplas colunas)

```java
// Exemplo: Selecionar somente nome e email dos clientes
String jpqlCampos = "SELECT c.nome, c.email FROM Cliente c";
Query queryCampos = em.createQuery(jpqlCampos);
List<Object[]> resultados = queryCampos.getResultList();

for (Object[] linha : resultados) {
    String nome = (String) linha[0];
    String email = (String) linha[1];
    // processar nome e email...
}

```

- **Comentário**:
    - A consulta retorna uma lista de arrays, onde cada posição corresponde a um atributo projetado.
    - Não retorna instâncias completas de `Cliente`, apenas valores “avulsos”.

### 4.2.2 Projeção em construtor (DTO via JPQL)

```java
// Suponha que exista a classe DTO ClienteDTO com construtor (String nome, String email)
public class ClienteDTO {
    private String nome;
    private String email;

    public ClienteDTO(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }
    // getters/setters omitidos...
}

// JPQL com projeção em construtor:
String jpqlDTO = "SELECT NEW com.exemplo.dto.ClienteDTO(c.nome, c.email) FROM Cliente c";
TypedQuery<ClienteDTO> queryDTO = em.createQuery(jpqlDTO, ClienteDTO.class);
List<ClienteDTO> listaDTO = queryDTO.getResultList();
// Cada objeto ClienteDTO conterá nome e e-mail já preenchidos.

```

- **Comentário**:
    - A cláusula `NEW pacote.ClasseDTO(...)` instrui o provedor JPA a instanciar um DTO para cada resultado.
    - Útil para evitar múltiplos objetos “anêmicos” ou carregar toda a entidade quando apenas alguns campos são necessários.

### 4.3 JOINs e Condições

### 4.3.1 INNER JOIN

```java
// Exemplo: selecionar pedidos associados a um cliente específico
String jpqlJoin = "SELECT p FROM Pedido p JOIN p.cliente c WHERE c.id = :clienteId";
TypedQuery<Pedido> queryJoin = em.createQuery(jpqlJoin, Pedido.class);
queryJoin.setParameter("clienteId", 42L);
List<Pedido> pedidos = queryJoin.getResultList();

```

- **Comentário**:
    - `JOIN p.cliente c`: significa que, para cada instância de `Pedido p`, há uma associação `p.getCliente()` mapeada em `Pedido` (via @ManyToOne).
    - O alias `c` refere-se a `Cliente` e permite filtrar (`WHERE c.id = :clienteId`).

### 4.3.2 LEFT JOIN

```java
// Exemplo: obter todos os clientes e, quando existirem, seus endereços
String jpqlLeft = "SELECT c, e FROM Cliente c LEFT JOIN c.enderecos e";
List<Object[]> lista = em.createQuery(jpqlLeft).getResultList();

for (Object[] linha : lista) {
    Cliente c = (Cliente) linha[0];
    Endereco e = (Endereco) linha[1]; // pode ser null se não tiver endereço
}

```

- **Comentário**:
    - `LEFT JOIN` retorna clientes mesmo que não tenham registros relacionados em `endereços`.
    - Cada linha é um par `(Cliente, Endereco)`.

### 4.4 Parâmetros Nomeados e Posicionais

### 4.4.1 Parâmetro Nomeado

```java
String jpqlParam = "SELECT c FROM Cliente c WHERE c.idade >= :idadeMinima";
TypedQuery<Cliente> qParam = em.createQuery(jpqlParam, Cliente.class);
qParam.setParameter("idadeMinima", 18);
List<Cliente> adultos = qParam.getResultList();

```

- **Comentário**:
    - Use `:idadeMinima` para maior legibilidade e evitar confusão de ordem.

### 4.4.2 Parâmetro Posicional

```java
String jpqlPos = "SELECT c FROM Cliente c WHERE c.idade BETWEEN ?1 AND ?2";
TypedQuery<Cliente> qPos = em.createQuery(jpqlPos, Cliente.class);
qPos.setParameter(1, 18);
qPos.setParameter(2, 30);
List<Cliente> faixa = qPos.getResultList();

```

- **Comentário**:
    - `?1` e `?2` referenciam a primeira e segunda posições passadas via `setParameter(int, Object)`.

---

## 5. Cenários de Restrição ou Não Aplicação

1. **Consultas muito complexas ou dependentes de funções específicas do banco**
    - Se precisar usar funções proprietárias (por exemplo, expressões de janela específicas do Oracle), é mais adequado usar *Native Query*.
2. **Operações de bulk em grande volume**
    - JPQL suporta `UPDATE` e `DELETE` em massa, mas pode haver perda de desempenho ou inconsistência no cache de entidades. Nesses casos, pode ser melhor escrever SQL nativo ou usar `Stored Procedures`.
3. **Consultas Analíticas (OLAP) e Relatórios Avançados**
    - Consulta que envolva agrupamentos muito específicos, rollup, cube, ou pivot podem ficar complicadas em JPQL; uma *Native Query* ou view no banco tende a ser mais clara.
4. **Migrações ou Scripts DDL**
    - O JPQL não serve para criar/alterar tabelas. Para isso, use as ferramentas de migração (Flyway, Liquibase) ou execute scripts SQL diretamente.

---

## 6. Componentes Chave Associados

### 6.1 Anotações de Entidade

- `@Entity`
    - Marca uma classe Java como **entidade persistente**. Obrigatória.
- `@Table(name = "nome_da_tabela")`
    - Opcional; se não colocada, a tabela assume o nome da classe.
- `@Id` e `@GeneratedValue`
    - Define o campo chave primária e, se desejado, a estratégia de geração automática.
- `@Column(name = "coluna_banco", length = 100, nullable = false)`
    - Mapeia atributos para colunas, com propriedades adicionais (tamanho, se aceita nulo etc.).
- Relacionamentos:
    - `@OneToOne`, `@OneToMany`, `@ManyToOne`, `@ManyToMany`
    - Controlam como as entidades estão associadas; utilizados no JPQL para JOINs (ex.: `JOIN entidade.associacao`).

### 6.2 `EntityManager` e Interfaces de Consulta

- **`EntityManager`**
    - Principal ponto de entrada para operações de persistência (persist, merge, remove, find) e criação de consultas.
    - Exemplo: `em.createQuery(String jpql)` ou `em.createNamedQuery("nomeConsulta", Classe.class)`.
- **`Query`** e **`TypedQuery<T>`**
    - `Query`: resultado genérico (retorna `List<?>`, arrays ou valores escalares).
    - `TypedQuery<T>`: retorno tipado (exemplo: `TypedQuery<Cliente>`), facilitando manuseio de resultados.
    - Métodos principais:
        - `setParameter(...)` → define valor para parâmetros da consulta.
        - `getResultList()` → retorna lista de resultados.
        - `getSingleResult()` → espera exatamente um resultado; lança exceção se zero ou mais de um.
- **`Persistence.createEntityManagerFactory("minhaPU")`**
    - Configura e retorna `EntityManagerFactory` a partir de `persistence.xml`.

### 6.3 Configuração da Unidade de Persistência

- Arquivo `persistence.xml` (geralmente em `META-INF/`) contendo:
    
    ```xml
    <persistence xmlns="http://xmlns.jcp.org/xml/ns/persistence"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 version="2.2"
                 xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/persistence
                                     http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd">
        <persistence-unit name="minhaPU" transaction-type="RESOURCE_LOCAL">
            <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
            <class>com.exemplo.modelo.Cliente</class>
            <class>com.exemplo.modelo.Pedido</class>
            <!-- demais classes anotadas -->
            <properties>
                <property name="javax.persistence.jdbc.url" value="jdbc:postgresql://localhost:5432/meubanco"/>
                <property name="javax.persistence.jdbc.user" value="usuario"/>
                <property name="javax.persistence.jdbc.password" value="senha"/>
                <property name="javax.persistence.jdbc.driver" value="org.postgresql.Driver"/>
                <property name="hibernate.dialect" value="org.hibernate.dialect.PostgreSQLDialect"/>
                <!-- demais propriedades (DDL, cache, show_sql etc.) -->
            </properties>
        </persistence-unit>
    </persistence>
    
    ```
    
- **Comentário**: a configuração define provedor JPA (Hibernate, EclipseLink etc.), classes de entidade e propriedades de conexão. A partir disso, o `EntityManager` obtido sabe quais entidades estão “mapeadas” e quais tabelas/colunas representam.

---

## 7. Melhores Práticas e Padrões de Uso

1. **Sempre usar parâmetros nomeados**
    - Evita erros de ordem e melhora legibilidade:
        
        ```java
        "SELECT c FROM Cliente c WHERE c.cidade = :cidade AND c.ativo = :ativo"
        
        ```
        
2. *Evitar “SELECT ” (em SQL nativo) — no JPQL, selecionar sempre o alias de entidade ou campos necessários*
    - Se precisar de toda a entidade, use `SELECT c`. Caso contrário, projete apenas atributos necessários para reduzir transferência de dados.
3. **Paginação de resultados**
    - Para evitar carregar todas as linhas de uma só vez:
        
        ```java
        TypedQuery<Cliente> q = em.createQuery("SELECT c FROM Cliente c ORDER BY c.nome", Cliente.class);
        q.setFirstResult(0);   // posição inicial
        q.setMaxResults(20);   // número máximo de resultados
        List<Cliente> pagina = q.getResultList();
        
        ```
        
4. **Named Queries (Consultas nomeadas)**
    - Definidas no próprio `@Entity` ou em arquivos XML, melhoram organização e reaproveitamento:
        
        ```java
        @Entity
        @NamedQuery(
          name = "Cliente.buscarPorCidade",
          query = "SELECT c FROM Cliente c WHERE c.cidade = :cidade"
        )
        public class Cliente { … }
        // Uso:
        TypedQuery<Cliente> qNamed = em.createNamedQuery("Cliente.buscarPorCidade", Cliente.class);
        qNamed.setParameter("cidade", "São Paulo");
        
        ```
        
5. **Evitar consultas n+1 (N+1 Select Problem)**
    - Quando carregar entidades com associações *LAZY*, usar `JOIN FETCH` para buscar antecipadamente coleções necessárias:
        
        ```java
        "SELECT c FROM Cliente c JOIN FETCH c.enderecos WHERE c.id = :id"
        
        ```
        
    - Diminui número de consultas ao banco (carrega entidade e associações em uma só query).
6. **Definir índices adequados no banco**
    - Embora seja responsabilidade do DBA/designer do esquema, consultar por campos que não têm índice pode causar consultas lentas, mesmo via JPQL.
7. **Separação de responsabilidades (DAO/Repository)**
    - Encapsule chamadas JPQL em classes específicas (Repository/DAO), deixando o código de negócio mais limpo e testável.

---

## 8. Exemplo Prático Completo

Imagine um cenário simples de sistema de loja, com duas entidades principais: **Produto** e **Categoria**.

- Cada **Produto** pertence a uma **Categoria** (`@ManyToOne`).
- O objetivo será mostrar um exemplo ponta a ponta de:
    1. Mapeamento das entidades
    2. Exemplo de consultas JPQL para obter produtos e filtrar por categoria, preço e projeções em DTO.

### 8.1 Entidades (Mapeamento)

```java
package com.exemplo.modelo;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "categoria")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    // Construtores, getters e setters...
}

---

package com.exemplo.modelo;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false)
    private BigDecimal preco;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    // Construtores, getters e setters...
}

```

### 8.2 DTO para projeção

```java
package com.exemplo.dto;

import java.math.BigDecimal;

public class ProdutoInfoDTO {
    private String nomeProduto;
    private BigDecimal preco;
    private String nomeCategoria;

    public ProdutoInfoDTO(String nomeProduto, BigDecimal preco, String nomeCategoria) {
        this.nomeProduto = nomeProduto;
        this.preco = preco;
        this.nomeCategoria = nomeCategoria;
    }

    // Getters e setters...
}

```

### 8.3 Configuração de `persistence.xml`

*(localizado em `src/main/resources/META-INF/persistence.xml`)*

```xml
<persistence xmlns="http://xmlns.jcp.org/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             version="2.2"
             xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/persistence
                                 http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd">
    <persistence-unit name="LojaPU" transaction-type="RESOURCE_LOCAL">
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>

        <class>com.exemplo.modelo.Categoria</class>
        <class>com.exemplo.modelo.Produto</class>

        <properties>
            <property name="javax.persistence.jdbc.url" value="jdbc:postgresql://localhost:5432/lojadb"/>
            <property name="javax.persistence.jdbc.user" value="usuario"/>
            <property name="javax.persistence.jdbc.password" value="senha"/>
            <property name="javax.persistence.jdbc.driver" value="org.postgresql.Driver"/>

            <property name="hibernate.dialect" value="org.hibernate.dialect.PostgreSQLDialect"/>
            <property name="hibernate.hbm2ddl.auto" value="update"/> <!-- para testes/simulações -->
            <property name="hibernate.show_sql" value="true"/>
        </properties>
    </persistence-unit>
</persistence>

```

### 8.4 Consultas JPQL no Repositório (DAO)

```java
package com.exemplo.repository;

import com.exemplo.dto.ProdutoInfoDTO;
import com.exemplo.modelo.Produto;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.math.BigDecimal;
import java.util.List;

public class ProdutoRepository {

    private EntityManager em;

    public ProdutoRepository(EntityManager em) {
        this.em = em;
    }

    /** 1) Selecionar todos os produtos */
    public List<Produto> listarTodosProdutos() {
        String jpql = "SELECT p FROM Produto p";
        TypedQuery<Produto> query = em.createQuery(jpql, Produto.class);
        return query.getResultList();
    }

    /** 2) Filtrar produtos por categoria (id) */
    public List<Produto> produtosPorCategoria(Long categoriaId) {
        String jpql =
            "SELECT p FROM Produto p " +
            "JOIN p.categoria c " +
            "WHERE c.id = :catId";
        TypedQuery<Produto> query = em.createQuery(jpql, Produto.class);
        query.setParameter("catId", categoriaId);
        return query.getResultList();
    }

    /** 3) Filtrar produtos dentro de uma faixa de preço */
    public List<Produto> produtosPorFaixaPreco(BigDecimal min, BigDecimal max) {
        String jpql =
            "SELECT p FROM Produto p " +
            "WHERE p.preco BETWEEN :precoMin AND :precoMax";
        TypedQuery<Produto> query = em.createQuery(jpql, Produto.class);
        query.setParameter("precoMin", min);
        query.setParameter("precoMax", max);
        return query.getResultList();
    }

    /** 4) Projeção em DTO: nome do produto, preço e nome da categoria */
    public List<ProdutoInfoDTO> buscarInfoProdutos() {
        String jpql =
            "SELECT NEW com.exemplo.dto.ProdutoInfoDTO(p.nome, p.preco, c.nome) " +
            "FROM Produto p JOIN p.categoria c " +
            "ORDER BY p.preco DESC";
        TypedQuery<ProdutoInfoDTO> query = em.createQuery(jpql, ProdutoInfoDTO.class);
        return query.getResultList();
    }
}

```

### 8.5 Classe de Serviço / Demonstração de Uso

```java
package com.exemplo.service;

import com.exemplo.dto.ProdutoInfoDTO;
import com.exemplo.modelo.Categoria;
import com.exemplo.modelo.Produto;
import com.exemplo.repository.ProdutoRepository;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.math.BigDecimal;
import java.util.List;

public class LojaService {

    public static void main(String[] args) {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("LojaPU");
        EntityManager em = emf.createEntityManager();
        ProdutoRepository repo = new ProdutoRepository(em);

        em.getTransaction().begin();

        // Exemplo: criar categoria e produtos para demonstração (apenas se estiver vazio)
        Categoria catEletronicos = new Categoria();
        catEletronicos.setNome("Eletrônicos");
        em.persist(catEletronicos);

        Produto p1 = new Produto();
        p1.setNome("Smartphone XYZ");
        p1.setPreco(new BigDecimal("1999.90"));
        p1.setCategoria(catEletronicos);
        em.persist(p1);

        Produto p2 = new Produto();
        p2.setNome("Notebook ABC");
        p2.setPreco(new BigDecimal("3499.00"));
        p2.setCategoria(catEletronicos);
        em.persist(p2);

        em.getTransaction().commit();

        // 1) Listar todos os produtos
        List<Produto> todos = repo.listarTodosProdutos();
        System.out.println("Todos os Produtos:");
        todos.forEach(prod -> System.out.println(prod.getNome() + " - R$ " + prod.getPreco()));

        // 2) Filtrar por categoria
        List<Produto> porCat = repo.produtosPorCategoria(catEletronicos.getId());
        System.out.println("\nProdutos na categoria Eletrônicos:");
        porCat.forEach(prod -> System.out.println(prod.getNome()));

        // 3) Faixa de preço
        List<Produto> faixaPreco = repo.produtosPorFaixaPreco(new BigDecimal("1500"), new BigDecimal("3000"));
        System.out.println("\nProdutos entre R$1500 e R$3000:");
        faixaPreco.forEach(prod -> System.out.println(prod.getNome() + " - R$" + prod.getPreco()));

        // 4) Projeção em DTO
        List<ProdutoInfoDTO> infos = repo.buscarInfoProdutos();
        System.out.println("\nInformações de Produtos (DTO):");
        infos.forEach(dto ->
            System.out.println(dto.getNomeProduto() + " | R$ " + dto.getPreco() + " | Categoria: " + dto.getNomeCategoria())
        );

        em.close();
        emf.close();
    }
}

```

**Comentário geral do Exemplo**:

- Criamos as classes de entidade e configuramos o JPA via `persistence.xml`.
- No `ProdutoRepository`, demonstramos diferentes formas de usar JPQL (seleção completa, filtragem, projeção em DTO).
- Na classe `LojaService`, abrimos transação para persistir instâncias de exemplo e, em seguida, executamos métodos do repositório para demonstrar o resultado das consultas.

---

## 9. Sugestões para Aprofundamento

1. **Documentação Oficial JPA / Hibernate**
    - *Java EE 8 Tutorial* (capítulo sobre JPA/Criteria API)
    - *Hibernate User Guide* – seção sobre HQL (Hibernate Query Language), que se assemelha ao JPQL.
2. **Criteria API (JPA)**
    - Embora o JPQL seja baseado em strings, a Criteria API permite construir consultas de forma programática e tipada, evitando erros de sintaxe em tempo de compilação.
3. **Named Queries em XML**
    - Aprender a definir consultas nomeadas em `orm.xml` e externalizar lógica de consulta.
4. **Paginação Avançada e Scrollable Results**
    - Estudar técnicas de paginação (consulta paginada, contagem de total de resultados) e uso de `ScrollableResults` no Hibernate.
5. **Performance e Cache de Primeiro e Segundo Nível**
    - Investigar como o uso de cache (1º nível do EntityManager e 2º nível do provedor) impacta no desempenho das consultas JPQL.
6. **Extensões do Provedor JPA (Proprietárias)**
    - Alguns provedores (por exemplo, Hibernate) oferecem funções adicionais em JPQL (ex.: função de agregação customizada, funções matemáticas específicas, etc.). Explore se faz sentido adotá-las no projeto.
7. **Benchmark e Otimizações de Consultas**
    - Utilizar `EXPLAIN PLAN` no banco de dados para entender como a consulta gerada pelo JPA está executando e, se necessário, otimizar índices ou reescrever a consulta.

---

> Conclusão:
> 
> - Este guia apresentou uma **visão geral concisa** do JPQL e, em seguida, uma **explicação detalhada** cobrindo desde sintaxe básica de SELECT até projeções em DTO e melhores práticas.
> - Ao trabalhar com projetos que utilizem JPA, vale a pena dominar o JPQL para manter consultas portáveis e alinhadas ao modelo de domínio.
> - Para casos muito específicos ou performance crítica, recomenda-se estudar **Native Queries** ou a **Criteria API**, conforme as necessidades do projeto.

Espero que este material lhe dê uma visão completa para mapear seleções básicas de entidades usando JPQL no contexto JPA!