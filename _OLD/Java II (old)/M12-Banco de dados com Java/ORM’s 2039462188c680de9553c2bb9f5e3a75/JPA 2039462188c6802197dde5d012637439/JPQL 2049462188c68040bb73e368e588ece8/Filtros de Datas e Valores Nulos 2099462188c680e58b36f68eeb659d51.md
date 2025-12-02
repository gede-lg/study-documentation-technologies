# Filtros de Datas e Valores Nulos

---

## 1. Introdução

O Java Persistence Query Language (JPQL) é uma linguagem de consulta orientada a objetos, usada para recuperar e manipular entidades definidas em JPA (Java Persistence API). Dois aspectos fundamentais de filtros em JPQL são:

1. **Comparações de Datas** – quando precisamos selecionar registros com base em atributos de data (por exemplo: “encontre todos os pedidos feitos antes de X” ou “entre datas A e B”).
2. **Tratamento de Valores Nulos** – testar se um determinado atributo (que pode ser data, número ou qualquer outro tipo) é nulo (`IS NULL`) ou não é nulo (`IS NOT NULL`).

Essa explicação visa abranger, de forma concisa e completa, como usar comparações de datas (`<`, `>`, `BETWEEN`) e checar valores nulos/no­nulos em JPQL, trazendo exemplos práticos, melhores práticas e cenários de restrição.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Filtro por Datas com `<` e `>`
    2. Filtro por Intervalo de Datas com `BETWEEN`
    3. Checagem de Valores Nulos: `IS NULL` e `IS NOT NULL`
    4. Uso de Parâmetros e `@Temporal`/`TemporalType`
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

- **JPQL vs. SQL:**
    - JPQL opera sobre entidades, atributos e relacionamentos mapeados em Java, não diretamente sobre tabelas e colunas do banco.
    - Um `SELECT e FROM` em JPQL refere-se a classes (entidades), e não ao nome literal da tabela.
- **Comparação de Datas em JPA:**
    - Internamente, JPQL converte comparações de datas em cláusulas SQL compatíveis com o banco. O desenvolvedor deve prestar atenção ao tipo de atributo (java.util.Date, java.time.LocalDate, etc.) e ao `@Temporal` (quando se usa Date).
- **Valores Nulos em JPQL:**
    - A semântica de `IS NULL` e `IS NOT NULL` no JPQL reflete diretamente a do SQL: verifica se o valor armazenado em uma coluna/atributo é nulo. Em Java, atributos referenciam `null` quando não preenchidos.
    - É fundamental entender se um campo pode ser nulo (`nullable=true` nas anotações JPA) para evitar `NullPointerException` em lógica de aplicação.

Esses conceitos formam a base para filtrar registros de entidades com base em datas e no fato de um atributo estar ou não preenchido.

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1. Filtro por Datas com `<` e `>`

No JPQL, para comparar atributos do tipo data (`java.util.Date`, `java.time.LocalDate`, etc.), utilizamos diretamente operadores relacionais:

```java
// Exemplo de entidade “Pedido”
@Entity
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Data/hora de criação do pedido
    @Temporal(TemporalType.TIMESTAMP)       // Só necessário para java.util.Date
    private Date dataCriacao;

    // Caso esteja usando java.time.LocalDate:
    // private LocalDate dataCriacao;

    // demais atributos...
}

// Exemplo de JPQL usando < e > para filtrar datas
String jpql = ""
    + "SELECT p "
    + "FROM Pedido p "
    + "WHERE p.dataCriacao < :dataLimiteAnterior "
    + "  AND p.dataCriacao > :dataLimitePosterior";

// Em tempo de execução, passe parâmetros:
TypedQuery<Pedido> query = entityManager.createQuery(jpql, Pedido.class);
query.setParameter("dataLimiteAnterior", dataLimiteAnterior, TemporalType.TIMESTAMP);
query.setParameter("dataLimitePosterior", dataLimitePosterior, TemporalType.TIMESTAMP);

List<Pedido> resultados = query.getResultList();

```

- **Explicação dos principais pontos acima:**
    - `p.dataCriacao < :dataLimiteAnterior`: filtra todos os pedidos cuja data de criação é anterior a um determinado valor (ex.: “pedidos criados antes de 1º de maio”).
    - `setParameter(..., TemporalType.TIMESTAMP)`: quando o atributo é `java.util.Date`, especificamos o `TemporalType` para que o JPA saiba se estamos considerando data/hora (`TIMESTAMP`), apenas data (`DATE`) ou apenas hora (`TIME`).
    - Se o atributo for `java.time.LocalDate`, basta usar `query.setParameter("param", localDate);` sem `TemporalType`.

> Observação:
> 
> - **Comparações de datas em bases diferentes:** A precisão (com ou sem horário) dependerá do mapping e do tipo de coluna no banco (ex.: `TIMESTAMP`, `DATE`).
> - Em bancos que fazem timezone conversion (ex.: PostgreSQL com `timestamp with time zone`), atentar ao fuso horário no parâmetro.

---

### 4.2. Filtro por Intervalo de Datas com `BETWEEN`

O operador `BETWEEN` em JPQL ajuda a selecionar registros cujo atributo de data está dentro de um intervalo fechado (inclusive limites). Exemplo:

```java
// JPQL para selecionar pedidos entre duas datas (inclusive)
String jpqlBetween = ""
    + "SELECT p "
    + "FROM Pedido p "
    + "WHERE p.dataCriacao BETWEEN :dataInicio AND :dataFim";

TypedQuery<Pedido> queryBetween = entityManager.createQuery(jpqlBetween, Pedido.class);
queryBetween.setParameter("dataInicio", dataInicio, TemporalType.TIMESTAMP);
queryBetween.setParameter("dataFim", dataFim, TemporalType.TIMESTAMP);

List<Pedido> pedidosNoIntervalo = queryBetween.getResultList();

```

- **Ponto chave:**
    - `BETWEEN :dataInicio AND :dataFim` é equivalente a
        
        ```sql
        p.dataCriacao >= :dataInicio
        AND p.dataCriacao <= :dataFim
        
        ```
        
    - Se quiser exclusões de limites, deve-se usar operadores manuais:
        
        ```
        WHERE p.dataCriacao > :dataInicio
          AND p.dataCriacao < :dataFim
        
        ```
        

---

### 4.3. Checagem de Valores Nulos: `IS NULL` e `IS NOT NULL`

Para atributos que podem não ter valor, verifica-se se são nulos:

```java
// Exemplo: entidade Cliente com atributo dataExclusao (anula soft delete)
@Entity
public class Cliente {
    @Id
    private Long id;

    private String nome;

    @Temporal(TemporalType.DATE)
    private Date dataExclusao; // se não excluído, permanece null

    // getters e setters...
}

// JPQL para buscar clientes ativos (dataExclusao is null)
String jpqlNulos = ""
    + "SELECT c "
    + "FROM Cliente c "
    + "WHERE c.dataExclusao IS NULL";

TypedQuery<Cliente> queryAtivos = entityManager.createQuery(jpqlNulos, Cliente.class);
List<Cliente> clientesAtivos = queryAtivos.getResultList();

// JPQL para buscar clientes excluídos (dataExclusao is not null)
String jpqlNotNulos = ""
    + "SELECT c "
    + "FROM Cliente c "
    + "WHERE c.dataExclusao IS NOT NULL";

TypedQuery<Cliente> queryInativos = entityManager.createQuery(jpqlNotNulos, Cliente.class);
List<Cliente> clientesInativos = queryInativos.getResultList();

```

- **Explicação:**
    - `IS NULL` retorna todos os registros cujo atributo seja `null` no banco.
    - `IS NOT NULL` retorna todos os que **não** são nulos.

> Detalhe adicional:
> 
> - Em JPQL, não se usa `= NULL` nem `<> NULL`; somente `IS (NOT) NULL`.
> - Para outros tipos (Strings, números, coleções), a mesma sintaxe se aplica:
>     
>     ```
>     WHERE entidade.atributoNum IS NULL
>     
>     ```
>     
>     ou
>     
>     ```
>     WHERE entidade.atributoString IS NOT NULL
>     
>     ```
>     

---

### 4.4. Uso de Parâmetros e `@Temporal` / `TemporalType`

### 4.4.1. `@Temporal` (java.util.Date)

Se sua entidade usa `java.util.Date`, é obrigatório anotar com `@Temporal` para indicar se você quer:

- `TemporalType.DATE` (somente data, sem hora)
- `TemporalType.TIME` (somente hora)
- `TemporalType.TIMESTAMP` (data + hora)

```java
@Entity
public class Evento {
    @Id
    private Long id;

    @Temporal(TemporalType.DATE)
    private Date dataEvento; // salva apenas data (yyyy-MM-dd)

    @Temporal(TemporalType.TIMESTAMP)
    private Date instanteCadastro; // salva data+hora (yyyy-MM-dd HH:mm:ss)

    // ...
}

```

Ao definir parâmetros em consultas:

```java
String jpql = "SELECT e FROM Evento e WHERE e.dataEvento = :dataExata";
TypedQuery<Evento> q = em.createQuery(jpql, Evento.class);

// Para java.util.Date + @Temporal, indique o TemporalType:
q.setParameter("dataExata", dataParam, TemporalType.DATE);

```

### 4.4.2. `java.time.*` (LocalDate, LocalDateTime, etc.)

Se sua entidade usa `java.time.LocalDate`, `LocalDateTime`, Java 8+ abstrações, não se usa `@Temporal`. Basta definir:

```java
@Entity
public class Tarefa {
    @Id
    private Long id;

    private LocalDate dataConclusao;
    private LocalDateTime dataHoraCriacao;
    // ...
}

```

E, na consulta:

```java
String jpql = "SELECT t FROM Tarefa t WHERE t.dataConclusao < :dataLimite";
TypedQuery<Tarefa> q = em.createQuery(jpql, Tarefa.class);
q.setParameter("dataLimite", LocalDate.of(2025, 6, 1));

```

Nesse caso, o JPA lida automaticamente com o tipo correto de conversão (DATE vs. TIMESTAMP), sem necessidade de especificar `TemporalType`.

---

## 5. Cenários de Restrição ou Não Aplicação

1. **Uso de Funções Específicas de Base (DataDiff, DATE_TRUNC):**
    - JPQL padrão não possui todas as funções específicas de cada SGBD. Se precisar de algo como `DATEDIFF` ou `TRUNC(date)`, será necessário usar **Native Query** (consultas SQL nativas) ou recorrer a *function registration* em alguns provedores (Hibernate, EclipseLink).
2. **Performance em Grandes Volumes de Dados:**
    - Comparações envolvendo colunas de data podem, em cenários de alto volume, sofrer de falta de índices ou uso indevido de funções (ex.: `FUNCTION('YEAR', p.dataCriacao) = 2025` tende a impedir o uso de índices).
    - Melhor criar índices apropriados ou testar SQL gerado.
3. **Campos de Datas com Timezone no Banco vs. Java LocalDate:**
    - Se o banco armazena `timestamp with time zone`, mas a aplicação usa `LocalDateTime` sem fuso, pode haver inconsistências no filtragem.
    - Nesses casos, considere usar `OffsetDateTime` ou `ZonedDateTime`, ou mesmo `java.sql.Timestamp` em consultas nativas.
4. **Entidades Sem Mapeamento de `Date/Time`:**
    - Se o atributo da entidade não estiver corretamente mapeado (ex.: String que contém data), não será possível usar comparações de data “nativas” em JPQL; precisará converter ou usar native query.
5. **Consultas Complexas com Vários Joins e Subqueries:**
    - Em JPQL muito complexo, certain JPA providers podem apresentar limitações de parsing. Nesse caso, pode ser mais seguro usar **Criteria API** ou **Native Query**.

---

## 6. Componentes Chave Associados

1. **`@Temporal` (java.util.Date):**
    - Indica ao provedor JPA como mapear `java.util.Date` para coluna SQL.
    - Sem essa anotação, o provedor não sabe se deve usar `DATE`, `TIME` ou `TIMESTAMP`.
2. **Tipos de Atributos de Data/Hora em Entidade:**
    - **`java.util.Date`**: antiquado, mas amplamente usado em JPA 2.0.
    - **`java.time.LocalDate` / `LocalDateTime` / `OffsetDateTime`** (Java 8+): mais recomendados, com melhor semântica e sem necessidade de `@Temporal`.
3. **`@Column(nullable = true/false)`:**
    - Controla se um atributo pode ser armazenado como nulo no banco. Se você sabe que um campo nunca deve ser nulo, use `nullable=false` para permitir que o próprio banco impeça inserções inválidas.
4. **`TypedQuery.setParameter(...)`:**
    - Método usado para passar valores para marcadores de parâmetro (e.g., `:dataLimite`).
    - Com `java.util.Date`, recomenda-se sobrecarregar com `TemporalType` (`DATE`, `TIME`, `TIMESTAMP`).
    - Com `java.time.*`, basta passar o objeto (LocalDate, LocalDateTime).
5. **`CriteriaBuilder` e `CriteriaQuery` (Criteria API):**
    - Alternativa programática para construir consultas. Exemplo rápido de filtro por data e null:
        
        ```java
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Pedido> cq = cb.createQuery(Pedido.class);
        Root<Pedido> root = cq.from(Pedido.class);
        
        // Exemplo: dataCriacao >= dataInicio AND dataCriacao <= dataFim
        Predicate predIntervalo = cb.between(
            root.get("dataCriacao"), dataInicio, dataFim
        );
        
        // Exemplo: cliente.dataExclusao IS NULL
        Predicate predNulo = cb.isNull(root.get("dataExclusao"));
        
        cq.select(root).where(cb.and(predIntervalo, predNulo));
        List<Pedido> lista = em.createQuery(cq).getResultList();
        
        ```
        
    - A Criteria API é especialmente útil quando se cria filtros dinamicamente (ex.: variáveis de busca opcionais).

---

## 7. Melhores Práticas e Padrões de Uso

1. **Usar Parâmetros Nomeados (@NamedQuery ou `:param`):**
    - Evita **SQL Injection** e melhora legibilidade.
    - Exemplo de NamedQuery em entidade:
        
        ```java
        @Entity
        @NamedQuery(
            name = "Pedido.findByPeriodo",
            query = "SELECT p FROM Pedido p WHERE p.dataCriacao BETWEEN :dtIni AND :dtFim"
        )
        public class Pedido { … }
        
        ```
        
    - E, então:
        
        ```java
        List<Pedido> lista = em.createNamedQuery("Pedido.findByPeriodo", Pedido.class)
                                .setParameter("dtIni", dataInicio, TemporalType.TIMESTAMP)
                                .setParameter("dtFim", dataFim, TemporalType.TIMESTAMP)
                                .getResultList();
        
        ```
        
2. **Evitar Funções em Coluna na Clausula WHERE (para não invalidar índice):**
    - Em vez de fazer:
        
        ```
        WHERE FUNCTION('YEAR', p.dataCriacao) = 2025
        
        ```
        
        prefira filtrar por intervalo:
        
        ```
        WHERE p.dataCriacao BETWEEN :inicioAno2025 AND :fimAno2025
        
        ```
        
    - Isso deixa o banco usar índices de data de forma eficiente.
3. **Cuidado com Fuso Horário e Precisão:**
    - Defina claramente se a aplicação trabalha com data pura (`LocalDate`) ou com data+hora (`LocalDateTime`) e, no banco, se há conversão de fuso.
    - Caso seja crítico, utilize `OffsetDateTime` ou salve sempre em UTC para padronizar.
4. **Testar Consultas Geradas (SQL) em Ambiente de Desenvolvimento:**
    - Habilite o log SQL do JPA provider (`hibernate.show_sql=true`) para verificar se o SQL gerado corresponde ao esperado (comparações de data, uso de parâmetros, indexação, etc.).
5. **Tratar Valores Nulos Antes de Invocar Query (quando Aplicável):**
    - Se o parâmetro for opcional (por exemplo, `dataFim` pode ser nulo, significando “não filtrar por data de término”), construa a consulta dinamicamente ou utilize Criteria API para incluir/excluir o predicado:
        
        ```java
        if (dataFim != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("dataCriacao"), dataFim));
        }
        
        ```
        
6. **Documentar Contract de Campos Nulos no Modelo:**
    - Mantenha consistência entre a entidade, banco de dados e regras de negócio: se um campo de data pode ou não ser nulo, defina no mapeamento JPA e no esquema DDL (`nullable=false` ou `nullable=true`) para evitar inconsistências.

---

## 8. Exemplo Prático Completo

### 8.1. Contexto e Cenário

Suponha que temos uma aplicação de gerenciamento de tarefas (To-Do). Cada tarefa (**Task**) possui:

- **id** (Long)
- **título** (String)
- **descrição** (String)
- **dataCriação** (LocalDateTime)
- **dataConclusão** (LocalDateTime, opcional—será nulo enquanto não concluída)

Objetivos:

1. Buscar todas as tarefas criadas entre duas datas (intervalo).
2. Buscar todas as tarefas ainda não concluídas (dataConclusão é `null`).
3. Buscar tarefas cuja dataCriação seja anterior a uma data limite (ex.: apagar tarefas antigas).

### 8.2. Definição da Entidade

```java
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    private String descricao;

    // Data e hora da criação (obrigatório)
    private LocalDateTime dataCriacao;

    // Data de conclusão (pode ser nula até a tarefa ficar concluída)
    private LocalDateTime dataConclusao;

    // Getters e Setters omitidos para brevidade
}

```

> Observação:
> 
> - Como usamos `LocalDateTime`, não há necessidade de `@Temporal`.
> - O banco deve ter colunas correspondentes:
>     
>     ```sql
>     CREATE TABLE tasks (
>         id BIGINT AUTO_INCREMENT PRIMARY KEY,
>         titulo VARCHAR(100) NOT NULL,
>         descricao TEXT,
>         data_criacao DATETIME NOT NULL,
>         data_conclusao DATETIME NULL
>     );
>     
>     ```
>     

### 8.3. Repositório ou DAO com Métodos JPQL

### 8.3.1. Buscar Tarefas no Intervalo de Datas

```java
public List<Task> findTasksBetweenDates(EntityManager em,
                                        LocalDateTime inicio,
                                        LocalDateTime fim) {
    String jpql = ""
        + "SELECT t "
        + "FROM Task t "
        + "WHERE t.dataCriacao BETWEEN :dtInicio AND :dtFim "
        + "ORDER BY t.dataCriacao ASC";

    TypedQuery<Task> query = em.createQuery(jpql, Task.class);
    query.setParameter("dtInicio", inicio);
    query.setParameter("dtFim", fim);
    return query.getResultList();
}

```

- **Comentário:**
    - `BETWEEN :dtInicio AND :dtFim`: garante inclusão de ambos os limites.
    - Ordenamos por data de criação para ver do mais antigo ao mais recente.

### 8.3.2. Buscar Tarefas Não Concluídas (`IS NULL`)

```java
public List<Task> findPendingTasks(EntityManager em) {
    String jpql = ""
        + "SELECT t "
        + "FROM Task t "
        + "WHERE t.dataConclusao IS NULL "
        + "ORDER BY t.dataCriacao DESC";

    return em.createQuery(jpql, Task.class)
             .getResultList();
}

```

- **Comentário:**
    - `IS NULL` filtra apenas tarefas cuja dataConclusao não foi preenchida.
    - Ordenação decrescente permite visualizar primeiras tarefas mais recentes.

### 8.3.3. Excluir Tarefas Antigas (Data < Limite)

```java
public int deleteOldTasks(EntityManager em, LocalDateTime limite) {
    // Exemplo de JPQL DELETE (atenção: alterações diretas no banco)
    String jpql = ""
        + "DELETE FROM Task t "
        + "WHERE t.dataCriacao < :dataLimite";

    Query query = em.createQuery(jpql);
    query.setParameter("dataLimite", limite);
    return query.executeUpdate();
    // Retorna número de registros excluídos
}

```

- **Comentário:**
    - `t.dataCriacao < :dataLimite`: exclui tarefas criadas antes de `limite`.
    - `executeUpdate()` devolve quantas linhas foram afetadas.

### 8.4. Uso em Serviço / Camada de Negócio

```java
public class TaskService {
    @PersistenceContext
    private EntityManager em;

    public List<Task> getTasksBetween(LocalDateTime inicio, LocalDateTime fim) {
        return findTasksBetweenDates(em, inicio, fim);
    }

    public List<Task> getPendingTasks() {
        return findPendingTasks(em);
    }

    public void purgeOldTasks(LocalDateTime limite) {
        int count = deleteOldTasks(em, limite);
        System.out.println("Tarefas antigas removidas: " + count);
    }
}

```

### 8.5. Demonstração de Uso (Exemplo Main)

```java
public class MainApp {
    public static void main(String[] args) {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("myPU");
        EntityManager em = emf.createEntityManager();
        TaskService service = new TaskService();
        service.em = em;

        em.getTransaction().begin();
        // (1) Criar algumas tarefas de exemplo
        Task t1 = new Task();
        t1.setTitulo("Teste 1");
        t1.setDescricao("Tarefa criada em 2023");
        t1.setDataCriacao(LocalDateTime.of(2023, 3, 15, 10, 0));
        em.persist(t1);

        Task t2 = new Task();
        t2.setTitulo("Teste 2");
        t2.setDescricao("Tarefa pendente em 2025");
        t2.setDataCriacao(LocalDateTime.of(2025, 1, 20, 14, 30));
        // dataConclusao fica nula
        em.persist(t2);

        Task t3 = new Task();
        t3.setTitulo("Teste 3");
        t3.setDescricao("Tarefa concluída em 2025");
        t3.setDataCriacao(LocalDateTime.of(2025, 2, 10, 9, 0));
        t3.setDataConclusao(LocalDateTime.of(2025, 2, 11, 16, 45));
        em.persist(t3);

        em.getTransaction().commit();

        // (2) Buscar tarefas entre janeiro e março de 2025
        LocalDateTime inicio2025 = LocalDateTime.of(2025, 1, 1, 0, 0);
        LocalDateTime fim2025    = LocalDateTime.of(2025, 3, 31, 23, 59);

        List<Task> intervalo = service.getTasksBetween(inicio2025, fim2025);
        System.out.println("Tarefas entre jan e mar 2025: " + intervalo.size());
        intervalo.forEach(t -> System.out.println("  - " + t.getTitulo()));

        // (3) Buscar tarefas pendentes (dataConclusao == null)
        List<Task> pendentes = service.getPendingTasks();
        System.out.println("Tarefas pendentes: " + pendentes.size());
        pendentes.forEach(t -> System.out.println("  * " + t.getTitulo()));

        // (4) Excluir tarefas com data anterior a 1º de janeiro de 2024
        em.getTransaction().begin();
        int excluidas = service.purgeOldTasks(LocalDateTime.of(2024, 1, 1, 0, 0));
        em.getTransaction().commit();
        System.out.println("Tarefas excluídas antes de 2024: " + excluidas);

        em.close();
        emf.close();
    }
}

```

- **Fluxo Resumido do Exemplo:**
    1. Persiste três tarefas com diferentes datas de criação e conclusão.
    2. Executa consulta `BETWEEN` para recuperar tarefas criadas entre 1º jan e 31 mar/2025.
    3. Executa consulta `IS NULL` para listar tarefas sem data de conclusão.
    4. Executa `DELETE ... WHERE dataCriacao < :limite` para remover tarefas antigas.

---

## 9. Sugestões para Aprofundamento

1. **Documentação Oficial JPA (Java EE) e Hibernate:**
    - Capítulo sobre JPQL e Criteria API (ver seções de `JPQL Reference`).
2. **Livro “Pro JPA 2” (Christian Bauer & Gavin King):**
    - Aborda em detalhes filtros, consultas nativas, Criteria API e otimizações.
3. **Artigos/Blogs sobre Performance de Consultas em Hibernate:**
    - “How to optimize JPQL queries involving dates”
    - “Avoiding N+1 problem when usando BETWEEN e Joins”
4. **Especificação SQL do SGBD Utilizado:**
    - Para entender como a base traduz internamente `DATE`, `TIMESTAMP`, e a forma como índices são usados.
5. **CRUD Repositórios Spring Data JPA (se aplicável):**
    - Exemplo de métodos derivados de nome (method naming) usando datas:
        
        ```java
        List<Task> findByDataCriacaoBetween(LocalDateTime inicio, LocalDateTime fim);
        List<Task> findByDataConclusaoIsNull();
        
        ```
        
    - Assim, evita-se escrever JPQL manualmente.

---

### Considerações Finais

- Filtrar por **datas** em JPQL exige atenção ao tipo de atributo (java.util.Date vs. java.time.*) e ao uso de `@Temporal`/`TemporalType`.
- Usar **`BETWEEN`** para intervalos e **operadores `<` / `>`** quando for um filtro aberto (menor ou maior que).
- Para **valores nulos**, sempre utilize **`IS NULL`** e **`IS NOT NULL`**, sem querer usar `= null` ou `<> null`.
- Atente-se a **performance**: evite usar funções na coluna diretamente (evite impedir uso de índices) e sempre teste o SQL gerado.
- Em cenários de consulta complexa ou dinâmica, considere a **Criteria API** para montar predicados em tempo de execução, especialmente quando parâmetros de filtro podem ser opcionais.

Espero que este guia, com visão geral, detalhes, exemplos práticos e melhores práticas, ajude a entender e aplicar filtros de datas e valores nulos no contexto de JPQL. Caso precise de alguma parte mais aprofundada ou exemplos adicionais (por ex.: subqueries envolvendo datas ou joins complexos), fique à vontade para pedir!