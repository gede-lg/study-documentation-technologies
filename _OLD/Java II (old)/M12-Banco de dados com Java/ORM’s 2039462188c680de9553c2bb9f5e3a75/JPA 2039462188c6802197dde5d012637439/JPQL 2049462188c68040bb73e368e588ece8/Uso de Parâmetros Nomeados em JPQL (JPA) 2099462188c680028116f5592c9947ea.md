# Uso de Parâmetros Nomeados em JPQL (JPA)

## Título da Explicação

**Parâmetros Nomeados em JPQL: Convenções, Sintaxe e Boas Práticas**

---

## Introdução

Os parâmetros nomeados em JPQL (Java Persistence Query Language) permitem inserir valores dinamicamente nas consultas de forma explícita e legível. Ao invés de usar posições numéricas (por exemplo, `?1`, `?2`), os parâmetros nomeados utilizam identificadores iniciados por dois pontos (por exemplo, `:idCliente`, `:dataInicio`), tornando o código mais claro e menos propenso a erros de ordem. Nesta explicação, veremos desde conceitos fundamentais até um exemplo prático completo, cobrindo convenções de nomeação, uso via `Query.setParameter("nomeParam", valor)` e melhores práticas.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Convenção de Nomes
    2. Declaração em JPQL
    3. Atribuição de Valor via `setParameter`
    4. Variações de Sintaxe (coleções, datas, enums)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes-Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    1. `javax.persistence.Query`
    2. `javax.persistence.TypedQuery`
    3. `EntityManager.createQuery(...)`
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
    1. Modelo de Entidade
    2. DAO/Repository com JPQL
    3. Teste de Funcionamento
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

- **O que são parâmetros nomeados?**
    
    Parâmetros nomeados são marcadores em consultas JPQL identificados por `:nome`, permitindo inserir valores na consulta de modo seguro e legível.
    
- **Por que usar parâmetros nomeados?**
    1. **Clareza**: Em vez de lembrar quais índices (`?1`, `?2`) correspondem a quais valores, utiliza-se nomes significativos (por exemplo, `:idCliente`).
    2. **Manutenção**: Ao alterar a ordem dos parâmetros na consulta, não é necessário ajustar índices em código Java.
    3. **Segurança**: Previnem injeção de SQL, pois a API JPA trata a conversão dos valores de forma segura.
- **Importância no contexto JPA/JPQL**
    
    Na camada de persistência, consultas dinâmicas são comuns. O uso de parâmetros nomeados facilita a manutenção de filtros, lógica condicional (montagem de string JPQL condicional) e reforça boas práticas de segurança.
    

---

## Sintaxe Detalhada e Uso Prático

### 1. Convenção de Nomes

- **Prefixo “:**: todo parâmetro deve começar com dois pontos.
- **Caractere de Identificador**: deve ser um identificador Java válido (letras, dígitos, underscores), não pode conter espaços ou caracteres especiais. Exemplo de nomes válidos:
    - `:idCliente`
    - `:dataInicio`
    - `:nomeUsuario`
- **CamelCase ou snake_case?**
    - Recomenda-se *camelCase* (`:dataEntrega`, `:valorMinimo`) para manter consistência com campos de entidades Java.
    - Evite nomes muito longos ou genéricos (`:x`, `:valor` quando várias consultas podem usar `:valor`).

### 2. Declaração em JPQL

```java
// Exemplo básico: buscar pedidos de um cliente em um intervalo de datas
String jpql =
    "SELECT p FROM Pedido p " +
    "WHERE p.cliente.id = :idCliente " +
    "  AND p.dataPedido BETWEEN :dataInicio AND :dataFim";

Query query = entityManager.createQuery(jpql);

```

- Em tempo de execução, `:idCliente`, `:dataInicio` e `:dataFim` são substituídos por valores concretos via `setParameter`.

### 3. Atribuição de Valor via `setParameter`

Após criar a instância de `Query` ou `TypedQuery`, é necessário atribuir um valor ao parâmetro nomeado:

```java
query.setParameter("idCliente", 42L);
query.setParameter("dataInicio", LocalDate.of(2025, 1, 1));
query.setParameter("dataFim", LocalDate.of(2025, 12, 31));

// Executa a consulta
List<Pedido> listaPedidos = query.getResultList();

```

- **Observações**:
    - O nome passado ao `setParameter` não inclui os dois pontos: apenas `"idCliente"`.
    - O tipo do valor deve ser compatível com o tipo do atributo de entidade (por exemplo, para `LocalDate`, a JPA converterá para o tipo SQL apropriado).

### 4. Variações de Sintaxe

1. **Coleções (IN)**
    
    ```java
    // Busca usuários com IDs em uma lista
    String jpqlIn = "SELECT u FROM Usuario u WHERE u.id IN :idsUsuarios";
    TypedQuery<Usuario> queryIn = entityManager.createQuery(jpqlIn, Usuario.class);
    List<Long> listaIds = Arrays.asList(5L, 7L, 10L);
    queryIn.setParameter("idsUsuarios", listaIds);
    List<Usuario> usuarios = queryIn.getResultList();
    
    ```
    
    - Atribui-se uma `Collection` (List, Set etc.) diretamente.
2. **Enumerações**
    
    ```java
    // Considerando um campo status do tipo Enum PedidoStatus
    String jpqlEnum = "SELECT p FROM Pedido p WHERE p.status = :statusPedido";
    TypedQuery<Pedido> queryEnum = entityManager.createQuery(jpqlEnum, Pedido.class);
    queryEnum.setParameter("statusPedido", PedidoStatus.APROVADO);
    List<Pedido> aprovados = queryEnum.getResultList();
    
    ```
    
    - JPA trata conversão de `enum` para seu equivalente (String ou Ordinal) conforme a estratégia mapeada (`@Enumerated`).
3. **Tipos de Data e Hora**
    
    ```java
    // Com Calendar
    Calendar cal = Calendar.getInstance();
    cal.set(2025, Calendar.JANUARY, 1);
    query.setParameter("dataInicio", cal, TemporalType.DATE);
    
    // Com LocalDateTime (JPA 2.2+)
    LocalDateTime inicio = LocalDateTime.of(2025, 1, 1, 0, 0);
    query.setParameter("dataInicio", inicio);
    
    ```
    
    - Se necessário, informa-se `TemporalType` para diferenciar DATE, TIME ou TIMESTAMP (no caso de `java.util.Date` ou `java.util.Calendar`).

---

## Cenários de Restrição ou Não Aplicação

1. **Consultas Nativas (Native Query) sem mapeamento**
    - Em consultas SQL nativas (via `@Query(nativeQuery = true)` ou `entityManager.createNativeQuery(...)`), parâmetros posicionais (como `?1`) costumam ser mais utilizados. Apesar de possível usar parâmetros nomeados em algumas implementações, nem sempre há suporte padronizado para conversão de tipo.
2. **Situações de Alta Dinamicidade de Filtros**
    - Quando há necessidade de adicionar condições dinamicamente (por exemplo, aplicar filtros apenas se um valor foi informado), montar a string JPQL concatenando trechos e parâmetros pode se tornar complexo. Nesses casos, pode-se preferir um *Criteria API* (CriteriaBuilder) ou bibliotecas de query dinâmica (ex.: Querydsl).
3. **Parâmetros Sensíveis à Injeção de Código**
    - Ainda que parâmetros ofereçam proteção contra injeção, montar o nome do parâmetro de forma dinâmica (como concatenação de strings) pode introduzir insegurança se não for bem controlado. Evite inserir diretamente input de usuário no texto JPQL.
4. **Limitações em Bibliotecas Específicas**
    - Alguns frameworks (ex.: Spring Data JPA) preveem convenções diferentes (uso de `:#{#entidade.propriedade}`). Em consultas específicas, o comportamento pode variar.

---

## Componentes-Chave Associados

### 1. `javax.persistence.Query`

- **Descrição**: Interface básica para executar consultas de leitura (read-only).
- **Métodos Relevantes**:
    - `setParameter(String name, Object value)`: define valor para parâmetro nomeado.
    - `getResultList()`: retorna lista de resultados.
    - `getSingleResult()`: retorna único resultado (lança exceção se não existir ou houver mais de um).

### 2. `javax.persistence.TypedQuery<T>`

- **Descrição**: Subinterface de `Query` que é tipada (evita casts).
- **Vantagem**: Segurança de tipo em tempo de compilação. Todos os métodos de `Query` estão disponíveis (incluindo `setParameter`).

### 3. `EntityManager.createQuery(...)`

- **Sintaxe Básica**:
    
    ```java
    TypedQuery<Entidade> query = entityManager.createQuery(jpqlString, Entidade.class);
    
    ```
    
    - Cria instância de `TypedQuery` a partir de uma string JPQL.
- **Uso com Parâmetros**:
    1. Monta a string com `:nomeParam`.
    2. `setParameter("nomeParam", valor)`.
    3. Executa via `getResultList()` ou `getSingleResult()`.

### 4. Anotações Relacionadas (quando usando Repositories ou Named Queries)

- **`@NamedQuery`**
    
    ```java
    @Entity
    @NamedQuery(
        name = "Pedido.porClienteEData",
        query = "SELECT p FROM Pedido p WHERE p.cliente.id = :idCliente AND p.dataPedido >= :dataMin"
    )
    public class Pedido { ... }
    
    ```
    
    - Possibilita definir consulta com parâmetros nomeados em nível de entidade.
    - Uso em código:
        
        ```java
        List<Pedido> lista = entityManager
            .createNamedQuery("Pedido.porClienteEData", Pedido.class)
            .setParameter("idCliente", 10L)
            .setParameter("dataMin", LocalDate.of(2025, 1, 1))
            .getResultList();
        
        ```
        

---

## Melhores Práticas e Padrões de Uso

1. **Nomes Descritivos**
    - Use nomes que reflitam claramente o propósito do parâmetro.
    - Evite abreviações excessivas (por exemplo, prefira `:dataCompra` a `:dCmp`).
2. **Consistência com Atributos de Entidade**
    - Utilize o mesmo nome dos atributos Java (ou semelhante), evitando confusões. Ex.: se a entidade `Pedido` tem atributo `valorTotal`, usar `:valorTotalMinimo` em consultas que filtram por valor.
3. **Evitar Combinar Sintaxe de Parâmetros Nomeados e Posicionais**
    - Misturar `:nomeParam` e `?1` em uma mesma consulta gera ambiguidade. Prefira **apenas parâmetros nomeados** ou apenas posicionais, mas não ambos.
4. **Tratamento de Nulos**
    - Ao passar `null` para `setParameter`, a JPA pode gerar exceção ou resultar em comportamento inesperado.
    - Para filtrar condicionalmente, prefira criar lógicas em que a cláusula `WHERE` não seja incluída caso o valor seja `null`.
    - Exemplo de filtro condicional:
        
        ```java
        StringBuilder jpql = new StringBuilder("SELECT p FROM Pedido p WHERE 1=1 ");
        if (valorMin != null) {
            jpql.append(" AND p.valor >= :valorMin ");
        }
        TypedQuery<Pedido> query = entityManager.createQuery(jpql.toString(), Pedido.class);
        if (valorMin != null) {
            query.setParameter("valorMin", valorMin);
        }
        List<Pedido> lista = query.getResultList();
        
        ```
        
5. **Parâmetros em CLAUSULAS `LIKE`**
    - Lembre-se de concatenar `%` no Java, não na query, para evitar bugs de interpretação:
        
        ```java
        String jpqlLike = "SELECT u FROM Usuario u WHERE u.nome LIKE :nomePattern";
        TypedQuery<Usuario> q = entityManager.createQuery(jpqlLike, Usuario.class);
        q.setParameter("nomePattern", "%" + nomeBusca + "%");
        
        ```
        
    - Evita fugas de caracteres especiais.
6. **Uso de Coleções com `IN`**
    - Nunca passe uma `List` ou `Set` vazio para `IN`, pois isso gera erro de sintaxe no SQL gerado. Verifique se a coleção não está vazia antes de incluir a cláusula.
7. **Performance**
    - Parâmetros nomeados permitem reuso de consultas compiladas no provedor JPA. Dessa forma, minimizar a reconstrução de strings JPQL melhora desempenho.

---

## Exemplo Prático Completo

### 1. Modelo de Entidade

```java
@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @Column(name = "data_pedido", nullable = false)
    private LocalDate dataPedido;

    @Column(name = "valor_total", nullable = false)
    private BigDecimal valorTotal;

    // Getters e Setters omitidos por brevidade
}

```

### 2. DAO/Repository com JPQL

```java
public class PedidoRepository {
    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Busca pedidos de um cliente em intervalo de datas e valor mínimo.
     */
    public List<Pedido> buscarPorClienteDataEValor(
            Long idCliente,
            LocalDate dataInicio,
            LocalDate dataFim,
            BigDecimal valorMinimo)
    {
        // Montagem da consulta JPQL com parâmetros nomeados
        String jpql =
            "SELECT p FROM Pedido p " +
            "WHERE p.cliente.id = :idCliente " +
            "  AND p.dataPedido BETWEEN :dataInicio AND :dataFim " +
            "  AND p.valorTotal >= :valorMinimo " +
            "ORDER BY p.dataPedido DESC";

        TypedQuery<Pedido> query = entityManager.createQuery(jpql, Pedido.class);

        // Atribuição de valor aos parâmetros
        query.setParameter("idCliente", idCliente);
        query.setParameter("dataInicio", dataInicio);
        query.setParameter("dataFim", dataFim);
        query.setParameter("valorMinimo", valorMinimo);

        return query.getResultList();
    }
}

```

### Explicação passo a passo

1. **Definição da string JPQL**: utiliza `:idCliente`, `:dataInicio`, `:dataFim` e `:valorMinimo`.
2. **Criação de `TypedQuery<Pedido>`**: chama `entityManager.createQuery(jpql, Pedido.class)`.
3. **`setParameter("idCliente", idCliente)`**: mapeia o valor `idCliente` para `:idCliente`.
4. **`setParameter("dataInicio", dataInicio)`**: mapeia `LocalDate` para parâmetro `:dataInicio`.
5. **Ordenação (opcional)**: no JPQL, `ORDER BY p.dataPedido DESC`.

### 3. Teste de Funcionamento (Exemplo de Uso)

```java
public class PedidoService {
    @Autowired
    private PedidoRepository pedidoRepository;

    public void exemploConsulta() {
        Long idCliente = 15L;
        LocalDate inicio = LocalDate.of(2025, 6, 1);
        LocalDate fim    = LocalDate.of(2025, 6, 30);
        BigDecimal valorMin = new BigDecimal("100.00");

        List<Pedido> resultado = pedidoRepository.buscarPorClienteDataEValor(
                idCliente, inicio, fim, valorMin);

        resultado.forEach(p -> {
            System.out.println("Pedido ID: " + p.getId()
                    + ", Data: " + p.getDataPedido()
                    + ", Valor: " + p.getValorTotal());
        });
    }
}

```

- Ao executar `exemploConsulta()`, a aplicação gera o SQL equivalente, substituindo os parâmetros por valores concretos, retornando a lista de pedidos.

---

## Sugestões para Aprofundamento

- **Criteria API (JPA)**: veja como gerar consultas de forma programática, evitando strings literais.
- **Named Queries e `@NamedNativeQuery`**: aprenda a definir consultas precompiladas em nível de entidade para centralizar lógica de JPQL.
- **Paginação e Limite de Resultados**: combinar parâmetros nomeados com `setFirstResult(int)` e `setMaxResults(int)` para controlar o volume de dados retornados.
- **Integração com Spring Data JPA**: explore métodos derivados (query methods) que usam parâmetros nomeados implicitamente.
- **Tratamento de Exceções**: estude como lidar com `NoResultException`, `NonUniqueResultException` e outras relacionadas a consultas.

---

> Resumo: Parâmetros nomeados em JPQL proporcionam código mais legível, manutenível e seguro. Seguindo as convenções de nomeação (:nomeParam), utilizando Query.setParameter("nomeParam", valor) e aplicando boas práticas (validação de nulos, nomenclatura clara, uso de coleções, etc.), você obtém consultas dinâmicas robustas e eficientes no JPA.
>