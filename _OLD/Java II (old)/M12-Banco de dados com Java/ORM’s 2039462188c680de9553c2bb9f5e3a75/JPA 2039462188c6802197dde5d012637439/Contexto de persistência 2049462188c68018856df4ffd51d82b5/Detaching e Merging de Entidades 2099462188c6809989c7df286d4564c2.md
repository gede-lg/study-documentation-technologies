# Detaching e Merging de Entidades

---

## Introdução

O contexto de persistência do JPA (Java Persistence API) gerencia o ciclo de vida das entidades no banco de dados. Em cenários mais avançados, é comum precisarmos “desvincular” (detaching) uma entidade do contexto de persistência para evitar sincronizações automáticas, ou “reintegrar” (merging) entidades modificadas que estavam fora desse contexto. Entender como e quando usar essas operações é fundamental para controlar transações, otimizar performance e garantir consistência.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Detaching (EntityManager.detach)
    2. Merging (EntityManager.merge)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#componentes-chave-associados)
    1. Persistence Context
    2. EntityManager
    3. @Entity, @Id, @GeneratedValue
    4. Outros métodos do EntityManager (“persist”, “remove”, etc.)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

- **Contexto de Persistência:** é o escopo onde o JPA gerencia entidades. Dentro de uma mesma transação, o EntityManager mantém entidades em um “cache de primeiro nível” (first-level cache).
- **Entidades Gerenciadas (Managed):** instâncias que estão associadas ao contexto de persistência. Qualquer alteração em uma entidade gerenciada é rastreada e, ao final da transação, sincronizada com a base de dados.
- **Entidades Destacadas (Detached):** instâncias que já foram persistidas em algum momento, mas que não estão mais vinculadas ao contexto de persistência atual. Alterações em entidades destacadas não serão propagadas automaticamente para o banco.
- **Entidades Transientes (Transient):** objetos recém-criados que ainda não foram salvos (persistidos) no banco de dados.
- **Entidades Removidas (Removed):** entidades que foram marcadas para remoção no contexto de persistência, mas cujas alterações ainda não foram confirmadas no banco.

**Importância e Propósito:**

- **Detaching:**
    - Evita que mudanças indesejadas em um objeto sejam automaticamente propagadas.
    - Libera memória no cache de primeiro nível quando há muitas entidades carregadas.
    - Permite trabalhar com um objeto fora de uma transação e, depois, decidir se quer “juntar” (merge) as alterações.
- **Merging:**
    - Reintegrar alterações feitas em um objeto destacado ou transiente de volta ao contexto de persistência.
    - Útil para cenários em que uma aplicação web retorna um objeto JSON ao cliente, o cliente modifica e retorna o JSON, e então você reconstrói uma entidade e precisa sincronizá-la.
    - Garante que apenas o estado final desejado seja inserido/atualizado no banco, controlando conflitos de versão se houver controle otimista.

---

## Sintaxe Detalhada e Uso Prático

### 1. Detaching (EntityManager.detach)

- **Assinatura**:
    
    ```java
    void detach(Object entity);
    
    ```
    
- **Descrição:** Remove a instância da entidade do contexto de persistência atual. Após chamar `detach()`, o JPA deixa de acompanhar alterações nessa instância.
- **Exemplo de Uso:**
    
    ```java
    // Suponha que 'em' é seu EntityManager, e 'cliente' é uma entidade previamente carregada.
    em.getTransaction().begin();
    
    Cliente cliente = em.find(Cliente.class, 1L); // cliente está em estado MANAGED
    cliente.setNome("João Updated");              // alteração ainda será sincronizada
    
    em.detach(cliente);                            // cliente torna-se DETACHED
    cliente.setNome("Outra Alteração");            // essa alteração NÃO será sincronizada
    
    em.getTransaction().commit();
    // No banco, ficará apenas "João Updated", não "Outra Alteração"
    
    ```
    
- **Casos de uso típicos:**
    - Evitar atualizações acidentais em propriedades quando o objeto ainda é necessário em memória.
    - Limpar o cache de primeiro nível (use também `em.clear()` para limpar tudo).
    - Trabalhos “offline”: carrega-se a entidade, fecha-se o contexto, faz-se mudanças e, só depois, decide se faz “merge”.

### 2. Merging (EntityManager.merge)

- **Assinatura**:
    
    ```java
    <T> T merge(T entity);
    
    ```
    
- **Descrição:**
    - Se a entidade passada está destacada ou transiente, o JPA cria ou atualiza um objeto gerenciado que represente esse estado e retorna essa instância gerenciada.
    - A instância original passada permanece em estado DETACHED ou TRANSIENT; todas as futuras operações devem usar a instância retornada pelo `merge()`.
- **Exemplo de Uso (objeto DETACHED):**
    
    ```java
    // Suponha que recebemos um objeto ClienteDTO no controller e reconstruímos o Cliente:
    Cliente clienteDetached = new Cliente();
    clienteDetached.setId(1L);
    clienteDetached.setNome("Carlos Novo Nome");
    
    em.getTransaction().begin();
    
    Cliente clienteGerenciado = em.merge(clienteDetached);
    // clienteGerenciado está em estado MANAGED, pronto para ser sincronizado
    // clienteDetached permanece DETACHED
    
    em.getTransaction().commit();
    // No banco, o registro de id=1 terá o nome atualizado para "Carlos Novo Nome"
    
    ```
    
- **Exemplo de Uso (novo objeto TRANSIENT):**
    
    ```java
    Cliente novoCliente = new Cliente();
    novoCliente.setNome("Ana");
    novoCliente.setEmail("ana@exemplo.com");
    
    em.getTransaction().begin();
    
    Cliente clientePersistido = em.merge(novoCliente);
    // Como novoCliente ainda não tinha ID, merge equivalerá a persist.
    // clientePersistido terá o ID gerado e estará MANAGED.
    
    em.getTransaction().commit();
    // Registro de "Ana" é criado no banco com ID automático.
    
    ```
    
- **Observações Importantes:**
    - Se a entidade já estiver MANAGED, `merge()` retorna a mesma instância; nenhuma nova instância é criada.
    - Ao usar `merge()`, o JPA executa um `SELECT` para garantir o estado atual do banco, depois faz `UPDATE` ou `INSERT` conforme necessário.
    - Evite chamar `merge()` indiscriminadamente em listas grandes de entidades, pois pode gerar overhead desnecessário. Prefira operações em lote (batch) ou linhas esparsas.

---

## Cenários de Restrição ou Não Aplicação

1. **Performance Sensível a Leitura Somente**
    - Se a aplicação precisa apenas ler muitas entidades e não há intenção de atualizá-las, evite `merge()`. Use `read-only queries` e tire proveito de `em.clear()` após cada iteração para liberar recursos.
2. **Concorrência e Controle Otimista**
    - Se há muitos usuários modificando a mesma entidade, fazer detach + merge manualmente pode levar a problemas de concorrência (conflitos de versão). Prefira usar bloqueios otimistas/pessimistas fornecidos pelo JPA (por exemplo, `@Version`) e deixe o contexto gerenciar automaticamente.
3. **Transações Curta (“Open Session in View” em Web)**
    - Em frameworks que mantêm o contexto aberto no ciclo da requisição (ex.: Spring com “Open Session in View”), chamar manualmente `detach()` pode gerar inconsistências inesperadas quando o framework pressionar sincronização no fechamento. Utilize cautela ou configure o escopo do contexto de forma adequada.
4. **Uso de Transfer Objects (DTOs) sem Reconstrução Completa**
    - Se chegamos em um DTO que não tem todos os atributos exigidos para persistir, um `merge()` direto pode sobrescrever colunas nulas. Nesses casos, carregue a entidade gerenciada antes de setar apenas os campos que devem ser atualizados, ou use `@DynamicUpdate`/`@DynamicInsert` (do Hibernate) ou queries específicas (`UPDATE … SET campo = :valor WHERE id = :id`).

---

## Componentes Chave Associados

### 1. Persistence Context

- Representa a “sessão” de trabalho do JPA com o banco. Todas as operações de CRUD dentro de uma transação correspondem a um único contexto.
- Nível de isolamento:
    - **First-Level Cache:** obrigatoriamente dentro do mesmo `EntityManager`.
    - **Second-Level Cache (opcional, provedor-dependente):** cache global que pode reter dados entre múltiplos contextos.

### 2. EntityManager

- **Obtenção:**
    
    ```java
    @PersistenceContext
    private EntityManager em;
    
    ```
    
    ou
    
    ```java
    EntityManagerFactory emf = Persistence.createEntityManagerFactory("MinhaPU");
    EntityManager em = emf.createEntityManager();
    
    ```
    
- **Métodos Relevantes:**
    - `persist(Object entity)`: torna a entidade TRANSIENT em MANAGED (gera INSERT no commit).
    - `find(Class<T> entityClass, Object primaryKey)`: busca do banco e retorna MANAGED.
    - `remove(Object entity)`: marca para exclusão no commit (deve estar MANAGED).
    - `merge(T entity)`: reintegra DETACHED/TRANSIENT e retorna instância MANAGED.
    - `detach(Object entity)`: remove do contexto, tornando-a DETACHED.
    - `clear()`: limpa todo o contexto, removendo todas as entidades MANAGED, passando-as para DETACHED.
    - `flush()`: sincroniza contexto com o banco imediatamente (antes do commit).

### 3. Anotações Básicas de Entidade

- `@Entity`: marca a classe como persistente.
- `@Table(name = "tabela")`: (opcional) especifica o nome da tabela.
- `@Id`: identifica o campo-chave primária.
- `@GeneratedValue(strategy = GenerationType.IDENTITY|SEQUENCE|TABLE|AUTO)`: define estratégia de geração de IDs.
- `@Version`: campo para controle de versão (lock otimista).
- `@Transient`: campo que não será persistido.

### 4. Atributos e Métodos Importantes

- **Entidade Exemplo:**
    
    ```java
    @Entity
    @Table(name = "clientes")
    public class Cliente {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
    
        private String nome;
        private String email;
    
        @Version
        private Long versao; // usado para controle otimista
    
        // getters e setters
    }
    
    ```
    
- **Persistência de Relacionamentos:**
    - `@OneToMany`, `@ManyToOne`, `@OneToOne`, `@ManyToMany`: controlam cascatas e carregamento (FetchType.LAZY | EAGER).
    - **Casca de Merge:**
        - Se uma entidade A faz referência a B e a relação está configurada com `CascadeType.MERGE`, ao chamar `merge(A)`, o JPA também tentará mesclar B automaticamente se ele estiver DETACHED ou TRANSIENT.

---

## Melhores Práticas e Padrões de Uso

1. **Evitar Contextos Prolongados Demais:**
    - Mantenha transações curtas (“short-lived transactions”) para diminuir contenção de recursos e evitar stale data. Em aplicações web, abra e feche o `EntityManager` por requisição ou por serviço.
2. **Usar DTOs para Atualizações Parcialmente Preenchidas:**
    - Em vez de receber um objeto entidade completo do cliente, mapeie apenas o que precisa atualizar e aplique no objeto gerenciado (via `find()`), evitando merge de objetos incompletos.
3. **Gerenciar Cache de Primeiro Nível:**
    - Se for operar em loops massivos (inserções ou atualizações em lote), chame `flush()` e `clear()` periodicamente para evitar “OutOfMemory” e melhorar performance.
    - Exemplo:
        
        ```java
        for (int i = 0; i < lista.size(); i++) {
            em.persist(lista.get(i));
            if (i % 50 == 0) {
                em.flush();
                em.clear();
            }
        }
        
        ```
        
4. **Controlar Cascatas com Cautela:**
    - Defina corretamente `CascadeType.MERGE` e `CascadeType.PERSIST` nos relacionamentos. Cascata indiscriminada pode levar a operações desnecessárias no banco.
5. **Não Fazer Merge de Objetos Desnecessários:**
    - Antes de chamar `merge()`, verifique se a entidade já não está no contexto (`em.contains(entity)`). Se estiver, apenas atualize seus campos.
6. **Versão para Conflitos de Concorrência:**
    - Sempre que possível, utilize `@Version` para lock otimista, permitindo detectar conflitos se duas transações tentarem atualizar a mesma linha simultaneamente.
7. **Documentar Fluxo de Detach/Merge:**
    - Em equipes, explique claramente quando uma entidade pode ficar DETACHED (por exemplo, enviada ao client) e como se dá o MERGE nas camadas de serviço.

---

## Exemplo Prático Completo

### Cenário

Suponha um sistema simples de gerenciamento de “Pedidos” e “Clientes”. Ao editar um pedido via interface web, o controller recebe um DTO com campos modificados. Será demonstrado:

1. Como carregar a entidade original.
2. Como destacar o pedido (opcional).
3. Como aplicar alterações do DTO.
4. Como reintegrar (merge) a entidade no contexto e persistir no banco.

### Estrutura de Classes

```java
// Cliente.java
@Entity
@Table(name = "clientes")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;

    // getters e setters
}

// Pedido.java
@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dataPedido;
    private BigDecimal valorTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // getters e setters
}

```

### DTO de Edição de Pedido

```java
// PedidoDTO.java
public class PedidoDTO {
    private Long id;
    private LocalDate dataPedido;       // pode ser nulo se não for alterar
    private BigDecimal valorTotal;      // pode ser nulo se não for alterar
    private Long clienteId;             // id do cliente, caso troque de cliente
    // getters e setters
}

```

### Serviço de Edição (sem Detach)

```java
public class PedidoService {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public Pedido editarPedido(PedidoDTO dto) {
        // 1. Carrega entidade gerenciada
        Pedido pedido = em.find(Pedido.class, dto.getId());
        if (pedido == null) {
            throw new EntityNotFoundException("Pedido não encontrado: " + dto.getId());
        }

        // 2. Atualiza apenas campos não nulos do DTO
        if (dto.getDataPedido() != null) {
            pedido.setDataPedido(dto.getDataPedido());
        }
        if (dto.getValorTotal() != null) {
            pedido.setValorTotal(dto.getValorTotal());
        }
        if (dto.getClienteId() != null) {
            Cliente cliente = em.find(Cliente.class, dto.getClienteId());
            if (cliente == null) {
                throw new EntityNotFoundException("Cliente não encontrado: " + dto.getClienteId());
            }
            pedido.setCliente(cliente);
        }

        // 3. NÃO é necessário chamar merge, pois 'pedido' está MANAGED
        // 4. Ao concluir a transação, JPA fará o UPDATE automaticamente
        return pedido;
    }
}

```

### Serviço de Edição (com Detach e Merge)

Em alguns cenários, você pode querer destacar explicitamente:

```java
public class PedidoService {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public Pedido editarPedidoComDetach(PedidoDTO dto) {
        // 1. Busca pedido gerenciado
        Pedido pedidoManaged = em.find(Pedido.class, dto.getId());

        if (pedidoManaged == null) {
            throw new EntityNotFoundException("Pedido não encontrado: " + dto.getId());
        }

        // 2. Destacha a entidade
        em.detach(pedidoManaged); // pedidoManaged agora está DETACHED

        // 3. Simula alterações “off-line”
        Pedido pedidoDetached = new Pedido();
        pedidoDetached.setId(dto.getId());
        // se algum campo do DTO for nulo, usamos o valor antigo:
        pedidoDetached.setDataPedido(dto.getDataPedido() != null
             ? dto.getDataPedido() : pedidoManaged.getDataPedido());
        pedidoDetached.setValorTotal(dto.getValorTotal() != null
             ? dto.getValorTotal() : pedidoManaged.getValorTotal());

        if (dto.getClienteId() != null) {
            Cliente cliente = em.find(Cliente.class, dto.getClienteId());
            if (cliente == null) {
                throw new EntityNotFoundException("Cliente não encontrado: " + dto.getClienteId());
            }
            pedidoDetached.setCliente(cliente);
        } else {
            pedidoDetached.setCliente(pedidoManaged.getCliente());
        }

        // 4. Reintegra via merge (returns managed instance)
        Pedido pedidoMerged = em.merge(pedidoDetached);

        // 5. Ao final da transação, persistência é sincronizada
        return pedidoMerged;
    }
}

```

**Explicação passo a passo:**

1. `em.find(...)` retorna uma instância MANAGED; seus campos refletem o estado atual no banco.
2. `em.detach(pedidoManaged)` faz com que essa instância seja marcada DETACHED — JPA não a monitora mais.
3. Criamos `pedidoDetached`, preenchemos todos os campos com valores antigos ou novos.
4. `em.merge(pedidoDetached)` cria (ou identifica) uma instância gerenciada internamente e copia o estado de `pedidoDetached` para ela, agendando o `UPDATE`.
5. A versão retornada (`pedidoMerged`) é a única entidade que permanecerá como MANAGED até o commit.

---

## Sugestões para Aprofundamento

- **Controle Otimista de Concorrência:** estudar `@Version` e suas implicações no “merge” de entidades concorrentes.
- **Cascata de Operações:** entender profundamente `CascadeType.MERGE`, `CascadeType.PERSIST`, `CascadeType.REFRESH`, etc., especialmente em relacionamentos complexos.
- **Second-Level Cache:** investigar como configurar um cache de segundo nível (Ex.: EhCache, Infinispan) para reduzir leituras repetitivas e melhorar performance.
- **Provedores Específicos (Hibernate):** ler sobre métodos adicionais como `session.evict()`, `session.clear()`, `session.refresh()` e como eles se comparam a `EntityManager.detach()`, `clear()` e `refresh()`.
- **Batch Processing:** pesquisar configurações de “JDBC batch size” e como ele afeta operações de merge em massa.

---

*Espero que esta explicação ajude a compreender em profundidade o ciclo de vida das entidades no JPA, especialmente as operações de detaching e merging. Qualquer dúvida adicional ou necessidade de exemplos mais específicos, fico à disposição!*