# Tipos de Resultado em JPQL: Entidades, Projeções Parciais e TypedQuery vs Query

---

## Introdução

O Java Persistence Query Language (JPQL) é a linguagem de consulta orientada a objetos do JPA (Java Persistence API). Em vez de trabalhar diretamente com tabelas e colunas de banco de dados, o JPQL opera sobre entidades e seus atributos. Saber obter diferentes tipos de resultados (objetos completos, projeções parciais, listas de valores etc.) é fundamental para escrever consultas eficientes e claras. Além disso, compreender a diferença entre `TypedQuery<T>` e `Query` garante maior segurança de tipo e melhora a legibilidade do código.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. [Retornando Objetos de Entidade](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#retornando-objetos-de-entidade)
    2. [Projeto de Atributos (Projeções Parciais)](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#proje%C3%A7%C3%A3o-de-atributos-proje%C3%A7%C3%B5es-parciais)
    3. [Uso de TypedQuery vs Query](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#uso-de-typedquery-vs-query)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    1. [Anotações (@Entity, @Table, @Column)](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#anota%C3%A7%C3%B5es-entity-table-column)
    2. [Classes e Interfaces (EntityManager, Query, TypedQuery, CriteriaBuilder)](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#classes-e-interfaces-entitymanager-query-typedquery-criteria)
    3. [Métodos e Atributos Cruciais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#m%C3%A9todos-e-atributos-cruciais)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

- **JPQL (Java Persistence Query Language):** linguagem de consulta orientada a objetos que atua sobre entidades mapeadas pelo JPA.
- **EntityManager:** interface principal do JPA para gerenciar o ciclo de vida de entidades e executar consultas JPQL.
- **Result Types em JPQL:**
    - **Entidade completa:** retorna instâncias de uma entidade mapeada (ex.: `Cliente`).
    - **Projeção parcial:** retorna colunas específicas (atributos de entidades) como um array de objetos (`Object[]`) ou, preferencialmente, utiliza um *constructor expression* para mapear resultados a um DTO.
- **TypedQuery vs Query:**
    - `TypedQuery<T>`: consulta fortemente tipada, evita casting ao recuperar resultados.
    - `Query`: tipo genérico, retorna `List<?>` e pode exigir casting manual, mas permite mais flexibilidade (ex.: usar com projeções heterogêneas).

---

## Sintaxe Detalhada e Uso Prático

### Retornando Objetos de Entidade

Quando o objetivo é obter instâncias completas de uma entidade, a sintaxe JPQL é direta. Exemplo comum:

```java
String jpql = "SELECT c FROM Cliente c";
TypedQuery<Cliente> query = entityManager.createQuery(jpql, Cliente.class);
List<Cliente> listaClientes = query.getResultList();

```

- **Explicação do código:**
    1. `String jpql = "SELECT c FROM Cliente c";`
        - `"Cliente"` é o nome da entidade (não necessariamente o nome da tabela).
        - `c` é um alias para a entidade.
    2. `createQuery(jpql, Cliente.class)` retorna um `TypedQuery<Cliente>`.
    3. `getResultList()` obtém uma `List<Cliente>` sem necessidade de casting.

### Exemplo comentado

```java
// 1. Definimos a consulta JPQL para obter todos os clientes
String jpql = "SELECT c FROM Cliente c";
// 2. Criamos um TypedQuery parametrizado para o tipo Cliente
TypedQuery<Cliente> consulta = entityManager.createQuery(jpql, Cliente.class);
// 3. Executamos a consulta e obtemos a lista de entidades Cliente
List<Cliente> resultados = consulta.getResultList();

```

---

### Projeção de Atributos (Projeções Parciais)

Nem sempre queremos todas as colunas de uma entidade—às vezes basta obter apenas alguns atributos, seja para otimizar desempenho ou para preencher um DTO (Data Transfer Object). Existem duas abordagens principais:

### 1. Retornar `Object[]` (Array de Objetos)

```java
String jpql = "SELECT c.nome, c.email FROM Cliente c";
Query query = entityManager.createQuery(jpql);
List<Object[]> resultados = query.getResultList();

for (Object[] linha : resultados) {
    String nome = (String) linha[0];
    String email = (String) linha[1];
    // uso de nome e email conforme necessário
}

```

- **Prós:** Simples, rápido de implementar.
- **Contras:** Falta de tipagem forte, necessidade de casting manual, difícil de manter se a ordem de seleção mudar.

### 2. Constructor Expression (DTO Projection)

Usando *constructor expression* para mapear diretamente a um objeto de classe específica (por exemplo, um DTO chamado `ClienteResumoDTO`):

```java
// Classe DTO para receber projeções
public class ClienteResumoDTO {
    private String nome;
    private String email;

    // Construtor requerido pelo JPQL
    public ClienteResumoDTO(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }
    // getters e setters ...
}

// Consulta JPQL com constructor expression
String jpql = "SELECT new com.exemplo.dto.ClienteResumoDTO(c.nome, c.email) " +
              "FROM Cliente c WHERE c.ativo = true";
TypedQuery<ClienteResumoDTO> query = entityManager.createQuery(jpql, ClienteResumoDTO.class);
List<ClienteResumoDTO> resultadosDto = query.getResultList();

for (ClienteResumoDTO dto : resultadosDto) {
    // Já temos objeto tipado, sem necessidade de casting
    System.out.println("Nome: " + dto.getNome() + ", Email: " + dto.getEmail());
}

```

- **Prós:** Tipagem forte, legibilidade maior, o próprio JPQL converte automaticamente em instâncias do DTO.
- **Contras:** Necessário criar classes DTO com construtores específicos; a consulta fica mais verbosa.

---

### Uso de `TypedQuery<T>` vs `Query`

### `Query` (Não tipado)

- **Definição:** Representa uma consulta JPQL sem tipagem de retorno. Retorna `List<?>`, pode ser usada tanto para projeções parciais (arrays ou tuplas) quanto para chamadas nativas.
- **Sintaxe de Instanciação:**
    
    ```java
    Query query = entityManager.createQuery("SELECT c.nome, c.email FROM Cliente c");
    List<Object[]> resultados = query.getResultList();
    
    ```
    
- **Quando usar:**
    - Projeções heterogêneas que retornam múltiplas colunas com tipos diferentes.
    - Consultas nativas (`createNativeQuery`).
    - Situações em que o tipo de retorno não cabe em uma única classe genérica.

### `TypedQuery<T>` (Tipado)

- **Definição:** Extensão de `Query` com tipo de retorno definido em tempo de compilação, evitando casting manual.
- **Sintaxe de Instanciação:**
    
    ```java
    TypedQuery<Cliente> consulta = entityManager.createQuery("SELECT c FROM Cliente c", Cliente.class);
    List<Cliente> listaClientes = consulta.getResultList();
    
    ```
    
- **Quando usar:**
    - Retorno de entidades completas (`Cliente`, `Pedido`, etc.).
    - Retorno de DTOs via *constructor expression*, pois você pode especificar `ClienteResumoDTO.class`.
    - Sempre que for possível manter a tipagem forte para melhorar a manutenção e reduzir erros de casting.

---

## Cenários de Restrição ou Não Aplicação

1. **Consultas Complexas com Múltiplos Joins e Projeções Dinâmicas:**
    - Quando os requisitos de seleção de colunas variam em tempo de execução, o JPQL pode se tornar pouco flexível. Nestes casos, é comum recorrer a `CriteriaBuilder` ou até mesmo `SQL nativo`.
2. **Casos de Performance Extremamente Críticos:**
    - Projeções gigantescas (muitos campos) podem resultar em construtor de DTOs pesados. Em situações de alto volume de dados, pode ser mais eficiente usar consultas nativas (`createNativeQuery`) customizadas e cuidar manualmente do mapeamento.
3. **Entidades com Mapeamentos Muito Complexos (Coleções Grandes, Hierarquias):**
    - Ao retornar a entidade completa, o JPA pode acionar *lazy loading* ao navegar em coleções. Se o objeto principal tiver muitas associações, talvez seja melhor projetar apenas campos específicos para evitar “N+1 selects” ou carga excessiva de dados.
4. **Uso de Native Queries com Escalonamento de Colunas Não Padronizadas:**
    - Em bancos legados ou consultas que exigem funções específicas do SGBD, não é possível usar JPQL, sendo obrigatório o uso de SQL nativo.

---

## Componentes Chave Associados

### 1. Anotações (@Entity, @Table, @Column)

- `@Entity`: Marca uma classe Java como entidade persistente.
    
    ```java
    @Entity
    @Table(name = "clientes")
    public class Cliente {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
    
        @Column(name = "nome", nullable = false)
        private String nome;
    
        @Column(name = "email", unique = true)
        private String email;
    
        // getters e setters...
    }
    
    ```
    
- `@Table`: Opcional, mapeia explicitamente o nome da tabela no banco de dados.
- `@Column`: Mapeia atributo a coluna, podendo customizar nome, restrições e comprimento.

### 2. Classes e Interfaces (EntityManager, Query, TypedQuery, CriteriaBuilder)

- **EntityManager:**
    - Instância principal para interagir com o contexto de persistência.
    - Métodos relevantes para consultas:
        - `createQuery(String jpql) → Query`
        - `createQuery(String jpql, Class<T> resultClass) → TypedQuery<T>`
        - `createNamedQuery(String name) / createNamedQuery(String name, Class<T> resultClass)` (para Named Queries definidas via `@NamedQuery`).
- **Query (javax.persistence.Query):**
    - Consulta genérica, sem tipo de retorno definido.
    - Métodos essenciais:
        - `getResultList() → List<?>`
        - `getSingleResult() → Object`
        - `setParameter(String name, Object value) → Query`
- **TypedQuery (javax.persistence.TypedQuery):**
    - Subinterface de `Query` com tipo genérico `<T>`.
    - Evita casting ao recuperar resultados.
    - Métodos:
        - `getResultList() → List<T>`
        - `getSingleResult() → T`
        - `setParameter(String name, Object value) → TypedQuery<T>`
- **CriteriaBuilder / CriteriaQuery / Root (JPA Criteria API):**
    - Forma programática (type-safe) de construir consultas.
    - Embora seja outra abordagem, é relevante entender que em cenários onde a tipagem em tempo de compilação é vital, o Criteria API pode substituir JPQL.

### 3. Métodos e Atributos Cruciais

- **EntityManager:**
    - `find(Class<T> entityClass, Object primaryKey)`: busca uma entidade pelo identificador.
    - `persist(Object entity)`: insere uma nova entidade.
    - `merge(Object entity)`: sincroniza alterações em entidades detachadas.
    - `remove(Object entity)`: exclui entidade.
    - `createQuery(...)`: cria consultas JPQL, conforme descrito acima.
- **Query / TypedQuery:**
    - `setParameter(String name, Object value)`: define parâmetros nomeados. Exemplo:
        
        ```java
        TypedQuery<Cliente> q = entityManager.createQuery(
            "SELECT c FROM Cliente c WHERE c.idade > :idadeMin", Cliente.class
        );
        q.setParameter("idadeMin", 18);
        List<Cliente> adultos = q.getResultList();
        
        ```
        
    - `getResultList()`: retorna lista de resultados (pode ser vazio).
    - `getSingleResult()`: retorna único resultado ou lança `NoResultException` caso não exista nenhum.
    - `setMaxResults(int max)`: limita número máximo de resultados.
    - `setFirstResult(int startPosition)`: define índice inicial (útil para paginação).

---

## Melhores Práticas e Padrões de Uso

1. **Prefira `TypedQuery<T>` Sempre que Possível:**
    - Oferece segurança de tipo e evita `ClassCastException`.
    - Exemplo:
        
        ```java
        TypedQuery<Pedido> query = entityManager.createQuery(
            "SELECT p FROM Pedido p WHERE p.dataEntrega < :hoje", Pedido.class
        );
        
        ```
        
2. **Use Constructor Expression para Projeções:**
    - Evita o uso de `Object[]` e melhora a legibilidade.
    - Mantenha DTOs com apenas os campos realmente necessários (Anêmico vs. Rico).
3. *Evite “Select ” (Retornar Entidades com Associações Pesadas):*
    - Se a entidade tem coleções grandes, carregá-las todas pode gerar sobrecarga.
    - Considere usar `JOIN FETCH` ou projeções específicas para evitar efeitos indesejados.
4. **Nomeie Queries com @NamedQuery Quando Reutilizáveis:**
    - Permite centralizar strings JPQL em anotações no nível da entidade.
    - Exemplo:
        
        ```java
        @Entity
        @NamedQuery(
            name = "Cliente.porEmailAtivo",
            query = "SELECT c FROM Cliente c WHERE c.email = :email AND c.ativo = true"
        )
        public class Cliente { … }
        // Uso:
        TypedQuery<Cliente> q = entityManager.createNamedQuery("Cliente.porEmailAtivo", Cliente.class);
        q.setParameter("email", "usuario@exemplo.com");
        
        ```
        
5. **Cuidado com Parâmetros Literais para Abrir Potenciais Vulnerabilidades:**
    - Utilize sempre `:param` em vez de concatenar valores diretamente na string JPQL. Previna *SQL Injection*, mesmo que o JPA ajude a escapar internamente.
6. **Páginação de Resultados:**
    - Combine `setFirstResult(...)` e `setMaxResults(...)` em listas grandes para evitar sobrecarga de memória.
    - Exemplo:
        
        ```java
        TypedQuery<Cliente> query = entityManager.createQuery("SELECT c FROM Cliente c", Cliente.class);
        query.setFirstResult(0);  // primeiro registro (0-index)
        query.setMaxResults(20);  // até 20 registros
        List<Cliente> pagina = query.getResultList();
        
        ```
        

---

## Exemplo Prático Completo

**Cenário:** Desenvolver uma funcionalidade que liste clientes ativos, mostrando nome e e-mail, e ao mesmo tempo, permita visualizar detalhes completos de um cliente ao selecioná-lo.

### 1. Modelo de Entidade `Cliente`

```java
package com.exemplo.entidade;

import javax.persistence.*;

@Entity
@Table(name = "clientes")
@NamedQuery(
    name = "Cliente.clientesAtivos",
    query = "SELECT c FROM Cliente c WHERE c.ativo = true"
)
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private boolean ativo;

    // Construtor padrão exigido pelo JPA
    public Cliente() { }

    public Cliente(String nome, String email, boolean ativo) {
        this.nome = nome;
        this.email = email;
        this.ativo = ativo;
    }

    // getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }
}

```

### 2. DTO para Projeção Simples

```java
package com.exemplo.dto;

public class ClienteResumoDTO {
    private String nome;
    private String email;

    public ClienteResumoDTO(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }

    public String getNome() { return nome; }
    public String getEmail() { return email; }

    @Override
    public String toString() {
        return "ClienteResumoDTO{nome='" + nome + "', email='" + email + "'}";
    }
}

```

### 3. Repositório/Service que Usa JPQL

```java
package com.exemplo.service;

import com.exemplo.dto.ClienteResumoDTO;
import com.exemplo.entidade.Cliente;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.Query;
import java.util.List;

public class ClienteService {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Retorna lista de clientes ativos como entidades completas.
     */
    public List<Cliente> buscarClientesAtivosComoEntidade() {
        // Usando NamedQuery definido em Cliente
        TypedQuery<Cliente> query = entityManager
            .createNamedQuery("Cliente.clientesAtivos", Cliente.class);
        return query.getResultList();
    }

    /**
     * Retorna lista de clientes ativos como projeção parcial (DTO).
     */
    public List<ClienteResumoDTO> buscarClientesAtivosComoDTO() {
        String jpql = "SELECT new com.exemplo.dto.ClienteResumoDTO(c.nome, c.email) " +
                      "FROM Cliente c WHERE c.ativo = true";
        TypedQuery<ClienteResumoDTO> query =
            entityManager.createQuery(jpql, ClienteResumoDTO.class);
        return query.getResultList();
    }

    /**
     * Retorna projeção parcial usando Query e Object[] (para fins de demonstração).
     */
    public List<Object[]> buscarClientesAtivosComoObjectArray() {
        String jpql = "SELECT c.nome, c.email FROM Cliente c WHERE c.ativo = true";
        Query query = entityManager.createQuery(jpql);
        return query.getResultList();  // Cada linha é um Object[] {nome, email}
    }

    /**
     * Busca um único cliente completo por ID.
     */
    public Cliente buscarClientePorId(Long id) {
        // Usando EntityManager.find() (não é JPQL), mas serve como comparação.
        return entityManager.find(Cliente.class, id);
    }

    /**
     * Busca um único cliente por e-mail usando TypedQuery e parâmetro nomeado.
     */
    public Cliente buscarClientePorEmail(String email) {
        String jpql = "SELECT c FROM Cliente c WHERE c.email = :email";
        TypedQuery<Cliente> query =
            entityManager.createQuery(jpql, Cliente.class);
        query.setParameter("email", email);
        return query.getSingleResult();
    }
}

```

### 4. Exemplo de Uso em Camada de Apresentação (por exemplo, um Controller REST)

```java
package com.exemplo.controller;

import com.exemplo.dto.ClienteResumoDTO;
import com.exemplo.entidade.Cliente;
import com.exemplo.service.ClienteService;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/clientes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClienteController {

    @Inject
    private ClienteService clienteService;

    /**
     * Retorna todos os clientes ativos (dados completos).
     */
    @GET
    @Path("/ativos-detalhado")
    public List<Cliente> listarClientesAtivosDetalhado() {
        return clienteService.buscarClientesAtivosComoEntidade();
    }

    /**
     * Retorna todos os clientes ativos como projeção simples (DTO: nome e email).
     */
    @GET
    @Path("/ativos-resumo")
    public List<ClienteResumoDTO> listarClientesAtivosResumo() {
        return clienteService.buscarClientesAtivosComoDTO();
    }

    /**
     * Retorna um cliente específico pelo ID.
     */
    @GET
    @Path("/{id}")
    public Cliente obterClientePorId(@PathParam("id") Long id) {
        return clienteService.buscarClientePorId(id);
    }
}

```

> Observações sobre este exemplo prático:
> 
> - O método `listarClientesAtivosDetalhado` usa `TypedQuery<Cliente>` para retornar entidades completas.
> - O método `listarClientesAtivosResumo` utiliza *constructor expression* para mapear diretamente para `ClienteResumoDTO`.
> - O terceiro método exemplifica como usar `EntityManager.find()`, que não envolve JPQL (apenas para comparação).
> - O uso de `Query` com `Object[]` (`buscarClientesAtivosComoObjectArray`) está presente apenas para demonstrar o retorno em tupla, mas na prática, recomenda-se sempre o DTO.

---

## Sugestões para Aprofundamento

1. **Criteria API (JPA):** Consultas programáticas e type-safe. Útil para cenários dinâmicos ou geração de filtros em tempo de execução.
2. **NamedQuery e NamedNativeQuery:** Organização e reaproveitamento de consultas JPQL ou SQL nativo de forma centralizada nas entidades.
3. **Pagination e Scrollable Results:** Estude o uso de `setFirstResult()` e `setMaxResults()`, além de entender estratégias de paginação para grandes volumes de dados (por exemplo, *keyset pagination*).
4. **Fetch Strategies e Performance:** Aprenda a usar `JOIN FETCH`, `@EntityGraph` e entender a diferença entre `LAZY` e `EAGER`, para evitar problemas de desempenho e “N+1 queries”.
5. **Projeções Complexas (DTOs Aninhados):** Projeções que retornam vc com coleções embutidas em DTOs personalizadas, possivelmente usando consultas nativas ou frameworks como Blaze-Persistence.
6. **Cache de Segundo Nível (2nd-Level Cache):** Entender como consultas JPQL podem tirar proveito do cache para reduzir acesso repetido ao banco.
7. **JPA 3.0+ e Recursos Avançados:** Em versões mais novas do JPA, disponíveis desde o Jakarta EE 9+, observe aprimoramentos na API Criteria, extensões para subqueries e novos métodos no `EntityManager`.

---

> Conclusão:
> 
> 
> Dominar os diferentes tipos de retorno em JPQL (entidades completas, projeção de atributos e DTOs via *constructor expression*) e conhecer as diferenças entre `TypedQuery<T>` e `Query` é essencial para escrever consultas limpas, eficientes e seguras. Ao longo deste guia, foram apresentados conceitos, exemplos de código e melhores práticas para que você possa aplicar imediatamente em seus projetos com JPA.
> 
> Fique à vontade para explorar o Criteria API e outras abordagens avançadas conforme a complexidade de seus requisitos aumentar.
>