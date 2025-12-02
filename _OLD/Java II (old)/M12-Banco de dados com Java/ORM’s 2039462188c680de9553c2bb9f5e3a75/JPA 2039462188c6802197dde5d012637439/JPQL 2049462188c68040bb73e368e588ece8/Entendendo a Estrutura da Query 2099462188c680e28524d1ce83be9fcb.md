# Entendendo a Estrutura da Query

---

## 1. Introdução

O Java Persistence Query Language (JPQL) é a linguagem de consulta padrão definida pela especificação JPA (Java Persistence API). Ela permite escrever consultas orientadas a objetos para entidades mapeadas, abstraindo-se dos detalhes específicos do banco de dados relacional. Em vez de operar diretamente sobre tabelas e colunas, o JPQL trabalha com entidades, atributos e relacionamentos.

Este guia explora em detalhes a **estrutura da query** em JPQL, focando nas três cláusulas principais (SELECT, FROM e WHERE). Veremos conceitos fundamentais, sintaxe, exemplos práticos e boas práticas de uso no contexto de aplicações Java EE/Spring que utilizam JPA para persistência de dados.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#2-conceitos-fundamentais)
2. [Estrutura da Query em JPQL](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#3-estrutura-da-query-em-jpql)
    1. [Cláusula SELECT](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#31-cl%C3%A1usula-select)
    2. [Cláusula FROM](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#32-cl%C3%A1usula-from)
    3. [Cláusula WHERE](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#33-cl%C3%A1usula-where)
3. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#4-sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. [Definição de Entidades de Exemplo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#41-defini%C3%A7%C3%A3o-de-entidades-de-exemplo)
    2. [Exemplos de Consultas JPQL Comentadas](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#42-exemplos-de-consultas-jpql-comentadas)
    3. [Variações de Sintaxe](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#43-varia%C3%A7%C3%B5es-de-sintaxe)
4. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#5-cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
5. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#6-componentes-chave-associados)
    1. [Anotações e Classes Principais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#61-anota%C3%A7%C3%B5es-e-classes-principais)
    2. [Interfaces e Métodos Cruciais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#62-interfaces-e-m%C3%A9todos-cruciais)
6. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#7-melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
7. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#8-exemplo-pr%C3%A1tico-completo)
8. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#9-sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

- **JPQL (Java Persistence Query Language):** linguagem orientada a objetos para consultas em entidades JPA.
- **Entidade (Entity):** classe Java anotada com `@Entity`, representando uma tabela no banco de dados.
- **EntityManager:** componente central do JPA que gerencia o ciclo de vida das entidades e permite criar objetos de consulta.
- **Consulta Orientada a Objetos:** ao invés de SELECT * FROM tabela, faz-se `SELECT e FROM Entidade e`. O foco é em classes e atributos, não em tabelas e colunas.
- **Vantagens do JPQL:**
    - Abstração do dialeto SQL específico do banco de dados.
    - Reuso de queries se o banco for trocado (desde que estrutura de entidades permaneça).
    - Allow “fetch joins” para otimização de carregamento de relacionamentos.
- **Objetivo do Tema:** entender como montar queries básicas em JPQL, cobrindo sintaxe e casos de uso prático, permitindo filtrar e projetar dados de maneira concisa e orientada a objetos.

---

## 4. Estrutura da Query em JPQL

Em JPQL, a estrutura básica de uma consulta relaciona-se às cláusulas principais (na ordem recomendada):

1. **SELECT:** especifica quais entidades (ou campos/atributos) retornar.
2. **FROM:** declara a(s) entidade(s) de interesse e define alias (apelidos).
3. **WHERE:** aplica condições de filtragem.

Abaixo, detalhamos cada cláusula.

### 4.1 Cláusula `SELECT`

- **Propósito:** projetar resultados a partir das entidades ou atributos desejados.
- **Sintaxe Básica:**
    
    ```
    SELECT <alias-ou-expressão>
    FROM Entidade <alias>
    
    ```
    
- **Possibilidades de Seleção:**
    1. **Entidade Inteira:**
        
        ```
        SELECT e
        FROM Cliente e
        
        ```
        
        Retorna objetos do tipo `Cliente`.
        
    2. **Campos/Atributos Específicos:**
        
        ```
        SELECT e.nome, e.email
        FROM Cliente e
        
        ```
        
        Retorna uma lista de `Object[]` com dois elementos (`nome`, `email`).
        
    3. **Construtores Personalizados (DTOs):**
        
        ```
        SELECT NEW com.meuprojeto.dto.ClienteDTO(e.id, e.nome, e.email)
        FROM Cliente e
        
        ```
        
        Retorna instâncias de `ClienteDTO` usando o construtor que recebe `(Long id, String nome, String email)`.
        
    4. **Funções de Agregação:**
        
        ```
        SELECT COUNT(e), MAX(e.id), AVG(e.salario)
        FROM Funcionario e
        
        ```
        
    5. **Expressões e Operadores:**
        
        ```
        SELECT CONCAT(e.nome, ' ', e.sobrenome), SIZE(e.pedidos)
        FROM Cliente e
        
        ```
        

### 4.2 Cláusula `FROM`

- **Propósito:** indicar a(s) entidade(s) de onde serão obtidos os dados.
- **Sintaxe Básica:**
    
    ```
    SELECT <...>
    FROM Entidade <alias>
    
    ```
    
- **Alias (apelido):** obrigatório para referenciar a entidade nas cláusulas subsequentes.
    - Exemplo: `FROM Cliente c`
    - O alias `c` representa cada instância de `Cliente`.
- **Junções (`JOIN`):**
    - **JOIN Simples (INNER JOIN):**
        
        ```
        SELECT o
        FROM Pedido o
        JOIN o.cliente c
        
        ```
        
        Retorna pedidos cujo relacionamento `cliente` não seja `null`.
        
    - **LEFT JOIN (OUTER):**
        
        ```
        SELECT o
        FROM Pedido o
        LEFT JOIN o.cliente c
        
        ```
        
        Retorna todos os pedidos, mesmo aqueles sem cliente associado.
        
    - **JOIN FETCH (para “fetch join”):** traz imediatamente o relacionamento para evitar o problema de N+1:
        
        ```
        SELECT o
        FROM Pedido o
        JOIN FETCH o.itens i
        
        ```
        
- **Múltiplas Entidades (Produto Cartesiano):**
    
    ```
    SELECT p, c
    FROM Produto p, Categoria c
    WHERE p.categoria = c
    
    ```
    

### 4.3 Cláusula `WHERE`

- **Propósito:** aplicar filtros, condicionais ou restrições sobre os resultados.
- **Sintaxe Básica:**
    
    ```
    SELECT <...>
    FROM Entidade <alias>
    WHERE <condição>
    
    ```
    
- **Operadores Comuns:**
    - **Aritméticos / Comparações:** `=`, `<>`, `<`, `>`, `<=`, `>=`
    - **Lógicos:** `AND`, `OR`, `NOT`
    - **LIKE:** para correspondência de padrões (`%` e `_`).
    - **BETWEEN:** intervalo numérico ou de data.
    - **IN:** lista de valores.
    - **IS NULL / IS NOT NULL**
    - **EXISTS (usado em subqueries).**
- **Parâmetros Posicionais e Nomeados:**
    - **Nomeados:** `:paramNome`
        
        ```
        SELECT c
        FROM Cliente c
        WHERE c.idade >= :idadeMinima
        
        ```
        
    - **Posicionais (não recomendado atualmente):** `?1`, `?2`
        
        ```
        SELECT c
        FROM Cliente c
        WHERE c.idade >= ?1
        
        ```
        
- **Exemplo de Condição Complexa:**
    
    ```
    SELECT p
    FROM Produto p
    WHERE p.preco BETWEEN :precoMin AND :precoMax
      AND (p.categoria.nome LIKE :prefixoCategoria OR p.disponivel = TRUE)
    
    ```
    

---

## 5. Sintaxe Detalhada e Uso Prático

### 5.1 Definição de Entidades de Exemplo

Antes de elaborar queries JPQL, é importante entender como as entidades estão definidas. Abaixo, um exemplo simplificado de duas entidades (`Cliente` e `Pedido`) que serão usadas nos exemplos:

```java
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    // Relacionamento OneToMany com Pedido
    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Pedido> pedidos;

    // Getters e setters omitidos para brevidade
}

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_pedido")
    private LocalDate dataPedido;

    @Column(name = "valor_total", precision = 10, scale = 2)
    private BigDecimal valorTotal;

    // Relacionamento ManyToOne com Cliente
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // Getters e setters omitidos para brevidade
}

```

- **Observações:**
    - `@Entity` e `@Table` definem mapeamento da classe para tabela no BD.
    - `@Id` e `@GeneratedValue` definem chave primária auto-incrementada.
    - `@Column` configurações extras (unicidade, nulabilidade, nome da coluna).
    - Relacionamentos (`@OneToMany`, `@ManyToOne`) determinam como as entidades se relacionam.

### 5.2 Exemplos de Consultas JPQL Comentadas

### 5.2.1 Selecionando Todas Entidades de `Cliente`

```java
// Obtém todos os clientes do banco de dados
String jpql = "SELECT c FROM Cliente c";
TypedQuery<Cliente> query = entityManager.createQuery(jpql, Cliente.class);
List<Cliente> clientes = query.getResultList();

```

- **Explicação:**
    - `SELECT c` → seleciona cada instância completa da entidade `Cliente`.
    - `FROM Cliente c` → define `c` como alias para a entidade.
    - `TypedQuery<Cliente>` → garante tipo de retorno seguro em tempo de compilação.

### 5.2.2 Selecionando Atributos Específicos de `Cliente`

```java
// Pega apenas nome e email de todos os clientes
String jpql = "SELECT c.nome, c.email FROM Cliente c";
Query query = entityManager.createQuery(jpql);
List<Object[]> tuplas = query.getResultList();

for (Object[] tupla : tuplas) {
    String nome = (String) tupla[0];
    String email = (String) tupla[1];
    // Processar cada par nome/email
}

```

- **Observação:**
    - Retorno em `Object[]` pois são múltiplos campos.
    - Se a ordem dos campos mudar, a indexação também muda.

### 5.2.3 Usando Construtor DTO

```java
// Supondo uma classe ClienteDTO com construtor ClienteDTO(Long id, String nome, String email)
String jpql = "SELECT NEW com.meuprojeto.dto.ClienteDTO(c.id, c.nome, c.email) "
            + "FROM Cliente c "
            + "WHERE c.dataNascimento >= :dataRecorte";

TypedQuery<ClienteDTO> query = entityManager.createQuery(jpql, ClienteDTO.class);
query.setParameter("dataRecorte", LocalDate.of(1990, 1, 1));
List<ClienteDTO> dtos = query.getResultList();

```

- **Explicação:**
    - `NEW com.meuprojeto.dto.ClienteDTO(...)` → Cria instâncias de `ClienteDTO` diretamente no resultado da query.

### 5.2.4 Filtrando com `WHERE`

```java
// Obtém clientes com idade maior que uma certa porcentagem (assumindo método para calcular idade)
String jpql = "SELECT c FROM Cliente c "
            + "WHERE FUNCTION('YEAR', CURRENT_DATE) - FUNCTION('YEAR', c.dataNascimento) > :idade";

TypedQuery<Cliente> query = entityManager.createQuery(jpql, Cliente.class);
query.setParameter("idade", 30);
List<Cliente> resultado = query.getResultList();

```

- **Detalhes:**
    - `FUNCTION('YEAR', ...)` → Chama função SQL específica (depende do banco) para extrair o ano.
    - `:idade` → parâmetro nomeado, evitando injeção de SQL.

### 5.2.5 Junção (‘JOIN’) e Condição em Relacionamento

```java
// Busca pedidos feitos por clientes cujo nome começa com 'João'
String jpql = "SELECT p FROM Pedido p "
            + "JOIN p.cliente c "
            + "WHERE c.nome LIKE :prefixoNome";

TypedQuery<Pedido> query = entityManager.createQuery(jpql, Pedido.class);
query.setParameter("prefixoNome", "João%");
List<Pedido> pedidos = query.getResultList();

```

- **Explicação:**
    - `JOIN p.cliente c` → usa o relacionamento `cliente` definido em `Pedido`.
    - Filtra pedidos associados a clientes cujo nome inicia com `'João'`.

### 5.2.6 Ordenação (`ORDER BY`)

```java
// Lista clientes ordenados por data de nascimento (mais velhos primeiro)
String jpql = "SELECT c FROM Cliente c ORDER BY c.dataNascimento ASC";
TypedQuery<Cliente> query = entityManager.createQuery(jpql, Cliente.class);
List<Cliente> clientesOrdenados = query.getResultList();

```

### 5.2.7 Paginação (`setFirstResult` / `setMaxResults`)

```java
// Pega 10 clientes, a partir do 21º registro (útil para paginação)
String jpql = "SELECT c FROM Cliente c ORDER BY c.nome";
TypedQuery<Cliente> query = entityManager.createQuery(jpql, Cliente.class);
query.setFirstResult(20); // offset
query.setMaxResults(10);  // limite
List<Cliente> paginaClientes = query.getResultList();

```

### 5.3 Variações de Sintaxe

1. **Objetos literais:**
    
    ```
    SELECT NEW com.meuprojeto.dto.RelatorioDTO(c.nome, COUNT(p))
    FROM Cliente c JOIN c.pedidos p
    GROUP BY c.nome
    
    ```
    
2. **Subqueries (consultas aninhadas):**
    
    ```
    SELECT c FROM Cliente c
    WHERE c.id IN (
        SELECT p.cliente.id FROM Pedido p
        WHERE p.valorTotal > :valor
    )
    
    ```
    
3. **Uso de Funções:**
    - **Concatenação:** `CONCAT(c.nome, ' ', c.sobrenome)`
    - **Tamanho de coleção:** `SIZE(c.pedidos)`
    - **Case/When (depende do provider):** `CASE WHEN c.idade >= 18 THEN 'ADULTO' ELSE 'MENO' END`

---

## 6. Cenários de Restrição ou Não Aplicação

Embora o JPQL seja bastante poderoso, existem situações em que **não** é indicado ou não é a melhor escolha:

1. **Consultas Muito Complexas / Tabelas de Fato Analíticas:**
    - Cenários de *data warehouse* ou consultas analíticas (agrupamento complexo, pivot, CTEs avançadas).
    - Nesse caso, **Native Query** (SQL puro) oferece melhor performance e flexibilidade.
2. **Operações Específicas do Banco (Recursos Proprietários):**
    - Uso de funções específicas (ex.: `TO_CHAR`, `ROWNUM`, sintaxe de JSON do PostgreSQL).
    - Native Query ou Stored Procedures podem ser necessários.
3. **Migrações de Big Data / ETLs Pesados:**
    - JPQL não é otimizado para processos de ETL em grande volume.
4. **Performance Sensível a Planos de Execução:**
    - Em bancos muito grandes, pode ser necessário ajustar índices ou hints específicos de vendor.
    - Native Query permite usar *hints* JPA, mas, em geral, SQL puro dá mais controle.
5. **Falta de Mapeamento de Entidade:**
    - Se a estrutura do BD não estiver totalmente mapeada em entidades (por exemplo, tabelas temporárias ou tabelas de auditoria que não possuem entidade correspondente), JPQL não conseguirá consultar diretamente.

---

## 7. Componentes Chave Associados

### 7.1 Anotações e Classes Principais

1. **`@Entity` e `@Table`:**
    - Marca a classe como entidade gerenciada pelo JPA.
    - `@Table(name = "nome_tabela")` define a tabela no BD.
2. **`@Id`, `@GeneratedValue`:**
    - Chave primária.
    - `GenerationType.IDENTITY` ou `GenerationType.SEQUENCE`, conforme banco.
3. **`@Column`:**
    - Define nome da coluna, nullability, tamanho, unicidade.
4. **Relacionamentos:**
    - `@OneToMany`, `@ManyToOne`, `@OneToOne`, `@ManyToMany`
    - Configura atributos como `fetch` (LAZY/EAGER), `cascade`.
5. **`@NamedQuery` / `@NamedQueries`:**
    - Define consultas JPQL estáticas com nome, ex.:
        
        ```java
        @Entity
        @NamedQuery(
            name = "Cliente.findByEmail",
            query = "SELECT c FROM Cliente c WHERE c.email = :email"
        )
        public class Cliente { ... }
        
        ```
        
    - Permite reutilizar query via `entityManager.createNamedQuery("Cliente.findByEmail")`.

### 7.2 Interfaces e Métodos Cruciais

1. **`EntityManager`:**
    - Injetado (por exemplo, com `@PersistenceContext`) ou obtido via `EntityManagerFactory`.
    - **Métodos Principais:**
        - `createQuery(String jpql)` → retorna `Query` ou `TypedQuery<T>`.
        - `createNamedQuery(String name)` → para NamedQuery.
        - `getTransaction().begin() / commit()` → para controlar transações em contexto Java SE.
        - `persist()`, `merge()`, `remove()`, `find()`, `refresh()`, entre outros.
2. **`Query` e `TypedQuery<T>`:**
    - **`Query`:** genérico, retorna objetos `Object` ou `Object[]`.
    - **`TypedQuery<T>`:** fortemente tipado, ex.: `TypedQuery<Cliente>`.
    - **Principais métodos:**
        - `setParameter(String name, Object value)` → vincula parâmetros nomeados.
        - `setParameter(int position, Object value)` → vincula parâmetros posicionais.
        - `getResultList()` → obtém lista de resultados.
        - `getSingleResult()` → obtém um único resultado (lança exceção se não houver ou se houver mais de um).
        - `setFirstResult(int offset)`, `setMaxResults(int max)` → paginação.
3. **`CriteriaBuilder` (embora não seja JPQL “puro”, vale citar):**
    - API programática para construir consultas de forma dinâmica.
    - Útil quando filtros mudam em tempo de execução, evitando concatenação de strings.

---

## 8. Melhores Práticas e Padrões de Uso

1. **Usar `TypedQuery<T>` Sempre que Possível:**
    - Garante segurança de tipo em tempo de compilação e facilita refatoração.
2. **Parâmetros Nomeados (em vez de Posicionais):**
    - Legibilidade e menos propenso a erros quando há vários parâmetros.
    - Exemplo:
        
        ```java
        query.setParameter("email", "joao@exemplo.com");
        
        ```
        
3. **Evitar Concatenar Strings para Filtros:**
    - Nunca montar JPQL usando “+” com valores de variáveis (risco de injeção de SQL e difícil manutenção).
    - Utilize parâmetros nomeados (p. ex.: `WHERE c.nome = :nome`).
4. **Paginação em Consultas que Retornam Muitos Registros:**
    - Sempre que retornar listas grandes, use `setFirstResult` e `setMaxResults` para evitar `OutOfMemoryError`.
5. **“Fetch Join” para Otimizar Relacionamentos n+1:**
    - Exemplo:
        
        ```
        SELECT c FROM Cliente c
        JOIN FETCH c.pedidos
        WHERE c.id = :clienteId
        
        ```
        
    - Carrega a coleção `pedidos` em uma única consulta.
6. **Evitar SELECT * (Usar Projeções Quando Possível):**
    - Se precisar apenas de alguns campos, devolva um DTO (via `NEW DTO(...)`) para reduzir tráfego de dados.
7. **Definir Named Queries para Queries Frequentes:**
    - Melhora manutenção do código e possibilita verificar a query em tempo de deploy (o provedor pode validar sintaxe JPQL).
8. **Testar Queries em Ambiente de Desenvolvimento:**
    - Alguns erros de JPQL só aparecem em execução. Testar com dados reais e verificar planos de execução (quando aplicável).
9. **Tratar Exceções Específicas de JPA:**
    - `NoResultException`, `NonUniqueResultException`, `PersistenceException` etc., para fornecer feedback adequado.
10. **Evitar Uso Exagerado de Funções do Banco (FUNCTION):**
    - Embora seja possível chamar funções SQL nativas, isso reduz a portabilidade. Prefira funções JPQL padrão quando existirem.

---

## 9. Exemplo Prático Completo

**Cenário:** Aplicação de gerenciamento de clientes e pedidos.

- **Entidades:** `Cliente` e `Pedido` (já definidas).
- **Objetivo:**
    1. Buscar todos os clientes com nome que contenha certa string e que tenham feito pedidos em determinado período.
    2. Projeção em DTO que contenha: nome do cliente, quantidade de pedidos no período e soma total dos valores desses pedidos.

### 9.1 Definição das Entidades (resumido)

/* Conforme a seção 5.1, veremos rapidamente como estão: */

```java
@Entity
@Table(name = "clientes")
public class Cliente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String nome;
    @Column(unique = true, nullable = false) private String email;
    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Pedido> pedidos;
    // getters e setters...
}

@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "data_pedido") private LocalDate dataPedido;
    @Column(name = "valor_total", precision = 10, scale = 2) private BigDecimal valorTotal;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
    // getters e setters...
}

```

### 9.2 DTO de Projeção

```java
package com.meuprojeto.dto;

import java.math.BigDecimal;

public class ClienteResumoDTO {
    private String nomeCliente;
    private Long quantidadePedidos;
    private BigDecimal somaValores;

    public ClienteResumoDTO(String nomeCliente, Long quantidadePedidos, BigDecimal somaValores) {
        this.nomeCliente = nomeCliente;
        this.quantidadePedidos = quantidadePedidos;
        this.somaValores = somaValores;
    }
    // getters e setters...
}

```

### 9.3 Implementação da Query JPQL

```java
public List<ClienteResumoDTO> buscarResumoClientesPorPeriodo(
        String parteNome,
        LocalDate dataInicio,
        LocalDate dataFim) {

    String jpql = "SELECT NEW com.meuprojeto.dto.ClienteResumoDTO( " +
                  "   c.nome, " +
                  "   COUNT(p), " +
                  "   SUM(p.valorTotal) " +
                  ") " +
                  "FROM Cliente c " +
                  "JOIN c.pedidos p " +
                  "WHERE c.nome LIKE :parteNome " +
                  "  AND p.dataPedido BETWEEN :dataInicio AND :dataFim " +
                  "GROUP BY c.nome";

    TypedQuery<ClienteResumoDTO> query = entityManager.createQuery(jpql, ClienteResumoDTO.class);
    query.setParameter("parteNome", "%" + parteNome + "%");
    query.setParameter("dataInicio", dataInicio);
    query.setParameter("dataFim", dataFim);

    return query.getResultList();
}

```

- **Explicação Detalhada:**
    1. **Projeção de Construtor (`NEW ClienteResumoDTO(...)`):**
        - Recebe três argumentos:
            - `c.nome` → nome do cliente;
            - `COUNT(p)` → número de pedidos no período;
            - `SUM(p.valorTotal)` → soma dos valores dos pedidos.
    2. **JOIN c.pedidos p:**
        - Une a entidade `Cliente` à coleção `pedidos`.
        - Garante que só serão considerados clientes que tenham pedidos.
    3. **Cláusula WHERE:**
        - `c.nome LIKE :parteNome` → filtra clientes cujo nome contenha a string passado (ex.: “%Silva%”).
        - `p.dataPedido BETWEEN :dataInicio AND :dataFim` → restringe pedidos ao intervalo de datas.
    4. **GROUP BY c.nome:**
        - Agrupa resultados por nome do cliente, permitindo usar as funções de agregação `COUNT` e `SUM`.
    5. **Parâmetros Nomeados:**
        - `:parteNome`, `:dataInicio`, `:dataFim` → vinculados via `query.setParameter(...)`.

### 9.4 Execução e Uso

```java
// Exemplo de uso:
@Autowired
private MeuRepositorioService meuRepositorioService;

public void exibirResumo() {
    String fragmentoNome = "Silva";
    LocalDate inicio = LocalDate.of(2024, 1, 1);
    LocalDate fim = LocalDate.of(2024, 12, 31);

    List<ClienteResumoDTO> resumos = meuRepositorioService
        .buscarResumoClientesPorPeriodo(fragmentoNome, inicio, fim);

    for (ClienteResumoDTO dto : resumos) {
        System.out.println("Cliente: " + dto.getNomeCliente());
        System.out.println("Quantidade de Pedidos: " + dto.getQuantidadePedidos());
        System.out.println("Soma Total: " + dto.getSomaValores());
    }
}

```

- **Resultado Esperado (exemplo):**
    
    ```
    Cliente: João Silva
    Quantidade de Pedidos: 5
    Soma Total: 12500.00
    
    Cliente: Maria da Silva
    Quantidade de Pedidos: 3
    Soma Total: 7800.00
    
    ```
    

---

## 10. Sugestões para Aprofundamento

- **Documentação Oficial JPA (JSR 338):**
    
    [https://jakarta.ee/specifications/persistence](https://jakarta.ee/specifications/persistence)
    
- **Tutorial Hibernate (proveedor Hibernate como implementação JPA):**
    
    [https://docs.jboss.org/hibernate/orm/6.1/userguide/html_single/Hibernate_User_Guide.html](https://docs.jboss.org/hibernate/orm/6.1/userguide/html_single/Hibernate_User_Guide.html)
    
- **“Pro JPA 2 in Java EE 8”** – Cay S. Horstmann, editora Apress.
- **Artigo sobre Performance com JPQL e Fetch Joins:**
    - “Understanding JPA Fetching Strategies” – Vlad Mihalcea
    - [https://vladmihalcea.com/jpa-hibernate-fetching-best-practices/](https://vladmihalcea.com/jpa-hibernate-fetching-best-practices/)
- **Vídeo: “JPQL e Criteria API: Entendendo Diferenças e Melhores Cenários”** – canais como Java Br ou Alura (YouTube).
- **Blog Posts:**
    - “JPQL vs Native SQL: Quando usar cada um” – Medium / Baeldung.
    - “Best Practices for Writing JPQL Queries” – Baeldung ([https://www.baeldung.com/](https://www.baeldung.com/))

---

### Observação Final

Este guia forneceu uma visão geral e completa da **estrutura da query** em JPQL, abordando desde os conceitos fundamentais até um exemplo prático completo de uso em um cenário real. A depender das necessidades do seu projeto, refine as queries para adequar índices, evite consultas demasiadamente complexas e considere o uso de **Criteria API** ou **Native Queries** quando necessário.