# Atualizações e Remoções em Lote

---

## Introdução

Operações de atualização (`UPDATE`) e remoção (`DELETE`) em lote são fundamentais quando precisamos modificar ou excluir muitos registros no banco de dados de forma eficiente, sem precisar carregar cada entidade em memória. O JPA (Java Persistence API) oferece, a partir da versão 2.1, as APIs `CriteriaUpdate<T>` e `CriteriaDelete<T>` para facilitar essas operações via Criteria, permitindo:

- **Evitar overhead de carregamento de entidades**: não há necessidade de `find()` ou `getReference()` antes de alterar/excluir.
- **Construção dinâmica de queries**: possibilita criar filtros (`WHERE`) de forma programática, sem uso de SQL ou JPQL “hardcoded”.
- **Execução atômica no banco**: um único comando `executeUpdate()` gera SQL direto para o banco.

Este documento mostrará, de forma estruturada:

1. **Visão Geral** (concisa, sem detalhes de sintaxe)
2. **Conceitos Fundamentais** (por que usar, objetivos)
3. **Sintaxe Detalhada e Uso Prático**
    - `CriteriaUpdate<T>`
    - `CriteriaDelete<T>`
4. **Cenários de Restrição ou Não Aplicação**
5. **Componentes Chave Associados**
6. **Melhores Práticas e Padrões de Uso**
7. **Exemplo Prático Completo**
8. **Sugestões para Aprofundamento**

---

## Sumário

1. [Visão Geral](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#vis%C3%A3o-geral)
2. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
3. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. [CriteriaUpdate<T>](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#criteriaupdatet)
    2. [CriteriaDelete<T>](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#criteriadeletet)
4. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
5. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
6. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
7. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
8. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 1. Visão Geral

- **Objetivo**: Realizar operações de `UPDATE` e `DELETE` em lote diretamente no banco, sem necessidade de carregar entidades no *persistence context*.
- **Como funciona**:
    - O JPA gera, internamente, uma query SQL equivalente via `EntityManager.createQuery(...)` ou via CriteriaBuilder.
    - Na API de Criteria, `CriteriaUpdate<T>` e `CriteriaDelete<T>` representam, respectivamente, uma “query de atualização em lote” e “query de remoção em lote”.
    - Após configurar os *predicates* (`WHERE`) e os campos a serem atualizados (`set`), chama-se `entityManager.createQuery(criteriaQuery).executeUpdate()`.
- **Vantagens principais**:
    1. **Desempenho**: não há carregamento de objetos na memória nem de cascata automática.
    2. **Flexibilidade**: construção dinâmica de filtros, sem depender de JPQL “hardcoded”.
    3. **Atomicidade**: toda operação é executada como uma única instrução, evitando loop de chamadas ao banco.
- **Limitações resumidas**:
    - Não gerencia o *persistence context*: entidades em cache podem ficar “desatualizadas”.
    - Não disparam *entity listeners* (@PreUpdate, @PreRemove) nem eventos de ciclo de vida.
    - Cuidado com restrições de integridade referencial (FKs).

---

## 2. Conceitos Fundamentais

1. **Persistence Context vs. Operação em Lote**
    - Em operações tradicionais (ex.: `find()` + `setX()` + `persist()`), o JPA mantém as entidades em memória e reflete alterações no banco ao fazer `flush()`.
    - Em operações em lote via Criteria, cria-se uma instrução SQL direta (ex.: `UPDATE tabela SET coluna = ? WHERE ...`), sem carregar instâncias de entidade.
2. **Criteria API**
    - Componentes principais:
        - `CriteriaBuilder`: fábrica de objetos para construir expressões, `Predicate`s, `CriteriaQuery`, `CriteriaUpdate`, `CriteriaDelete` etc.
        - `CriteriaUpdate<T>` / `CriteriaDelete<T>`: abstrações para representar consultas de atualização ou exclusão.
        - `Root<T>`: representa a “tabela” (entidade) alvo da operação.
        - `Predicate`: condição booleana (por exemplo, filtros do `WHERE`).
3. **Lifecycle & Eventos**
    - **Bulk Update/Delete não dispara**:
        - *EntityListeners* (como `@PreUpdate`, `@PreRemove`).
        - `EntityManager` não sincroniza o *persistence context* automaticamente; é responsabilidade do desenvolvedor limpar ou atualizar o cache local.
4. **Motivações de Uso**
    - Cenários com milhares ou milhões de registros para atualizar/excluir.
    - Evitar “N+1 updates”, onde cada entidade seria recarregada e persistida separadamente.
    - Cenários dinâmicos onde os critérios de filtragem são construídos em tempo de execução.

---

## 3. Sintaxe Detalhada e Uso Prático

### 3.1 CriteriaUpdate<T>

### 3.1.1 Criação do CriteriaUpdate

1. **Obter o `CriteriaBuilder`**
    
    ```java
    EntityManager em = ...;  // obtido via injeção ou JNDI
    CriteriaBuilder cb = em.getCriteriaBuilder();
    
    ```
    
2. **Criar o objeto `CriteriaUpdate<T>`**
    
    ```java
    CriteriaUpdate<MinhaEntidade> update = cb.createCriteriaUpdate(MinhaEntidade.class);
    
    ```
    
3. **Definir a raiz (Root)**
    
    ```java
    Root<MinhaEntidade> root = update.from(MinhaEntidade.class);
    
    ```
    

### 3.1.2 Definir colunas a serem atualizadas (`set`)

- **Sintaxe básica**: `update.set(root.get("campo"), valor)`
- **Exemplo**:
    
    ```java
    // Suponha que MinhaEntidade tenha campo "status" e queremos marcar como 'INATIVO'
    update.set(root.get("status"), "INATIVO");
    
    // Também é possível usar expressões: incrementar um campo numérico
    update.set(root.get("quantidade"), cb.sum(root.get("quantidade"), 1));
    
    ```
    

### 3.1.3 Definir condição(es) (`where`)

- **Sintaxe**: `update.where(Predicate…)`
- **Exemplos de Predicates**:
    
    ```java
    // Exemplo 1: atualizar apenas registros cujo campo 'dataExpiracao' seja anterior a hoje.
    Predicate filtroData = cb.lessThan(root.get("dataExpiracao"), LocalDate.now());
    update.where(filtroData);
    
    // Exemplo 2: combinar múltiplas condições (AND, OR)
    Predicate statusAtivo = cb.equal(root.get("status"), "ATIVO");
    Predicate qtdMaiorZero = cb.greaterThan(root.get("quantidade"), 0);
    update.where(cb.and(statusAtivo, qtdMaiorZero));
    
    ```
    

### 3.1.4 Executar a query

1. **Criar `Query` a partir do CriteriaUpdate**
    
    ```java
    Query query = em.createQuery(update);
    
    ```
    
2. **Executar e obter o número de linhas afetadas**
    
    ```java
    int linhasAfetadas = query.executeUpdate();
    
    ```
    
3. **Notas importantes**:
    - Deve estar dentro de uma transação ativa (`@Transactional` ou `em.getTransaction().begin()` / `commit()`).
    - O método `executeUpdate()` retorna a quantidade de linhas modificadas.
    - Após `executeUpdate()`, o *persistence context* NÃO é atualizado automaticamente. Se houver instâncias da entidade em cache, pode ser necessário chamar `em.clear()` ou `em.flush()` para evitar inconsistências.

### 3.1.5 Exemplo de Uso Completo (Código Comentado)

/*

```java
// 1. Início da transação
em.getTransaction().begin();

// 2. Construir CriteriaUpdate para ent_estoque
CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaUpdate<ProdutoEstoque> update = cb.createCriteriaUpdate(ProdutoEstoque.class);
Root<ProdutoEstoque> root = update.from(ProdutoEstoque.class);

// 3. Definir valor do campo "quantidade" para 0 quando estoque estiver negativo
update.set(root.get("quantidade"), 0);
Predicate estoqueNegativo = cb.lessThan(root.get("quantidade"), 0);
update.where(estoqueNegativo);

// 4. Executar a operação em lote
int qtdeAtualizados = em.createQuery(update).executeUpdate();

// 5. Commit da transação
em.getTransaction().commit();

System.out.println("Registros atualizados: " + qtdeAtualizados);

```

- /

---

### 3.2 CriteriaDelete<T>

### 3.2.1 Criação do CriteriaDelete

1. **Obter `CriteriaBuilder`**
    
    ```java
    CriteriaBuilder cb = em.getCriteriaBuilder();
    
    ```
    
2. **Criar o objeto `CriteriaDelete<T>`**
    
    ```java
    CriteriaDelete<MinhaEntidade> delete = cb.createCriteriaDelete(MinhaEntidade.class);
    
    ```
    
3. **Definir a raiz (Root)**
    
    ```java
    Root<MinhaEntidade> root = delete.from(MinhaEntidade.class);
    
    ```
    

### 3.2.2 Definir condição(es) (`where`) para remoção

- **Sintaxe**: `delete.where(Predicate…)`
- **Exemplo**:
    
    ```java
    // Excluir usuários inativos há mais de 1 ano
    Predicate inativo = cb.equal(root.get("ativo"), false);
    Predicate dataFimVinculo = cb.lessThan(root.get("dataFimVinculo"), LocalDate.now().minusYears(1));
    delete.where(cb.and(inativo, dataFimVinculo));
    
    ```
    

### 3.2.3 Executar a query

1. **Criar `Query` a partir do CriteriaDelete**
    
    ```java
    Query query = em.createQuery(delete);
    
    ```
    
2. **Executar e obter o número de linhas afetadas**
    
    ```java
    int qtdeRemovidos = query.executeUpdate();
    
    ```
    
3. **Observações**:
    - Também requer transação ativa.
    - Não há carregamento de entidades: a remoção ocorre diretamente no banco.
    - Se existirem entidades dessa classe em cache, pode haver inconsistência. Recomenda-se limpar o contexto (ex.: `em.clear()`) ou usar `em.flush()` antes e depois, conforme a necessidade.

### 3.2.4 Exemplo de Uso Completo (Código Comentado)

/*

```java
// 1. Iniciar transação
em.getTransaction().begin();

// 2. Construir CriteriaDelete para entidade "Usuario"
CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaDelete<Usuario> delete = cb.createCriteriaDelete(Usuario.class);
Root<Usuario> root = delete.from(Usuario.class);

// 3. Definir condição para remover usuários que não fizeram login nos últimos 2 anos
Predicate naoLogou = cb.lessThan(root.get("ultimaLogin"), LocalDate.now().minusYears(2));
delete.where(naoLogou);

// 4. Executar remoção em lote
int qtdeApagados = em.createQuery(delete).executeUpdate();

// 5. Commit
em.getTransaction().commit();

System.out.println("Usuários removidos: " + qtdeApagados);

```

- /

---

## 4. Cenários de Restrição ou Não Aplicação

1. **Entidades em Cache no Persistence Context**
    - Se você já carregou entidades correspondentes aos registros que serão atualizados/excluídos, o cache fica “desatualizado”. Exemplo:
        - Carregou `ProdutoEstoque` com `id = 5`; fez `CriteriaUpdate` que altera o mesmo registro. A instância carregada ainda mantém o valor antigo até re-sincronizar.
    - **Solução**:
        - Após `executeUpdate()`, chama `em.clear()` (ou `em.refresh(entity)`) para sincronizar.
2. **Triggers e Entity Listeners**
    - Operações em lote **não disparam**:
        - `@PreUpdate`, `@PostUpdate`, `@PreRemove`, `@PostRemove`.
    - Se sua lógica depende desses listeners, então **não** utilize `CriteriaUpdate/Delete`.
3. **Relacionamentos em Cascata e Integridade Referencial**
    - Se existir FK com *ON DELETE RESTRICT* ou lógica de cascade ambígua, a exclusão em lote pode falhar.
    - Exemplo:
        - Tabela `PedidoItem` FK para `Pedido`. Se `PedidoItem` não for removido antecipadamente, ao deletar `Pedido` em lote, pode haver violação de FK.
    - **Solução**:
        - Remover filhos antes (ou usar query aninhada).
4. **Necessidade de Lógica de Negócio em Cada Entidade**
    - Se a regra exige processamento individual (ex.: cálculo de campos derivados, envio de notificações por entidade), lidar em lote é inadequado.
5. **Limitação do JPA em Operações Complexas**
    - **Subqueries**: JPA Criteria Update/Delete não suporta subqueries diretamente no `SET` ou `WHERE` (apenas em clausula `EXISTS` ou IN simples).
    - **Expressões Avançadas**: Alguns bancos permitem funções específicas (ex.: JSONB no PostgreSQL), mas JPA pode não suportar.

---

## 5. Componentes Chave Associados

A seguir, detalhamos cada classe/interface importante no contexto de operações em lote com Criteria:

| Componente | Descrição | Sintaxe de Uso |
| --- | --- | --- |
| **CriteriaBuilder** | Fábrica de objetos para criar `CriteriaQuery`, `CriteriaUpdate`, `CriteriaDelete`, `Predicate`, `Expression` | `CriteriaBuilder cb = entityManager.getCriteriaBuilder();` |
| **CriteriaUpdate** | Representa uma query de atualização em lote para a entidade `T` | `CriteriaUpdate<Entidade> update = cb.createCriteriaUpdate(Entidade.class);` |
| **CriteriaDelete** | Representa uma query de exclusão em lote para a entidade `T` | `CriteriaDelete<Entidade> delete = cb.createCriteriaDelete(Entidade.class);` |
| **Root** | Representa a raiz (tabela/entidade) alvo da operação | `Root<Entidade> root = update.from(Entidade.class);` ou `delete.from(Entidade.class);` |
| **Predicate** | Representa uma condição booleana (cláusula `WHERE`) | `Predicate p = cb.equal(root.get("campo"), valor);` |
| **Expression/Y** | Representa expressões SQL (ex.: somas, concatenações, funções) | `cb.sum(root.get("qtd"), 1)` ou `cb.concat(root.get("nome"), "Sobrenome")` |
| **Query** | JPA `javax.persistence.Query` para execução da query construída | `Query q = em.createQuery(update);` / `Query q = em.createQuery(delete);` |
| **executeUpdate()** | Método de `Query` que efetivamente executa a operação e retorna número de linhas afetadas | `int afetados = q.executeUpdate();` |
| **Transaction** | Bloco de transação JPA | `em.getTransaction().begin(); ... em.getTransaction().commit();` ou anotação `@Transactional` em EJB/Spring |
| **CriteriaQuery (contexto)** | Embora não diretamente usado para UPDATE/DELETE, faz parte da mesma família de APIs para *SELECT*. Não usar para lote. | `CriteriaQuery<Entidade> query = cb.createQuery(Entidade.class);` |

Além dos acima, é comum combinar com:

- **Metamodel** (gerado via `@StaticMetamodel`): permite referenciar campos de forma segura por tipo, ex.: `root.get(Usuario_.status)`.
- **TypedQuery**: não se aplica diretamente em `CriteriaUpdate/Delete`, pois retornam `Query`, não `TypedQuery<T>`.

---

## 6. Melhores Práticas e Padrões de Uso

1. **Transação Bem Definida**
    - Sempre encadear dentro de transação. Exemplos:
        - Em EJB ou Spring, anotar método com `@Transactional`.
        - Em ambiente manual, usar `EntityManager.getTransaction().begin()` e `commit()`.
2. **Gerenciamento do Persistence Context**
    - **Limpar o contexto** (`em.clear()`) após `executeUpdate()` ou `executeDelete()` para evitar entidades “obsoletas” em cache.
    - Se for necessário manter algum objeto em cache, usar `em.refresh(entity)` especificamente.
3. **Modularizar Lógicas em Métodos Reutilizáveis**
    - Criar métodos genéricos (ex.: `updateStatusInativo(Class<T>, Predicate…)`) para evitar duplicação de código.
    - Exemplo de utilitário:
        
        ```java
        public <T> int atualizarCampo(EntityManager em, Class<T> clazz, String campo, Object valor, Predicate filter) {
            CriteriaBuilder cb = em.getCriteriaBuilder();
            CriteriaUpdate<T> update = cb.createCriteriaUpdate(clazz);
            Root<T> root = update.from(clazz);
            update.set(root.get(campo), valor);
            update.where(filter);
            return em.createQuery(update).executeUpdate();
        }
        
        ```
        
4. **Uso de Metamodel (Opcional, mas recomendado)**
    - Ajuda a evitar erros de digitação ao referenciar nomes de campos como `root.get("nomeCampo")`.
    - Exemplo:
        
        ```java
        update.set(root.get(Usuario_.status), "INATIVO");
        
        ```
        
5. **Validar Restrições de Integridade Antes de Executar**
    - Se houver relacionamentos *cascade* ou chaves estrangeiras, avaliar ordem das operações para não violar FKs.
    - Exemplo: excluir primeiro itens de pedido antes de excluir pedidos.
6. **Limitar Escopo de Bulk Operations**
    - Dividir operações muito grandes em “lotes” menores, evitando bloqueios longos no banco.
    - Exemplo: atualizar 10.000 registros de uma vez pode causar *table lock*; em cenários de alta concorrência, considere paginar manualmente (buscar IDs e processar aos poucos).
7. **Monitorar Desempenho e Planos de Execução**
    - Testar em ambiente de homologação para analisar *Explain Plan* e verificar índices.
    - Confirmar que colunas usadas em `WHERE` estão indexadas quando necessário.
8. **Evitar Operações de Bulk em Tabelas com Alta Atividade**
    - Se a tabela recebe muitas transações concorrentes, o *lock* gerado pelo `DELETE`/`UPDATE` em lote pode degradar o desempenho.

---

## 7. Exemplo Prático Completo

A seguir, um cenário completo onde temos:

- Entidade `Pedido` com campos:
    - `id` (Long)
    - `status` (String)
    - `dataCriacao` (LocalDate)
- Entidade `ItemPedido` com campos:
    - `id` (Long)
    - `pedido` (ManyToOne → Pedido)
    - `quantidade` (Integer)

**Objetivo**:

1. Marcar todos os pedidos com `dataCriacao` anterior a 6 meses como `CANCELADO`.
2. Remover itens de pedido cujo `quantidade` seja zero.

### 7.1 Definição das Entidades

```java
@Entity
@Table(name = "pedido")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String status; // ex.: "ABERTO", "CONCLUIDO", "CANCELADO"

    @Column(name = "data_criacao", nullable = false)
    private LocalDate dataCriacao;

    // getters e setters ...
}

@Entity
@Table(name = "item_pedido")
public class ItemPedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @Column(nullable = false)
    private Integer quantidade;

    // getters e setters ...
}

```

### 7.2 Método de Atualização em Lote (CriteriaUpdate)

```java
/**
 * Atualiza o status de todos os pedidos mais antigos que 6 meses para "CANCELADO".
 */
public int cancelarPedidosAntigos(EntityManager em) {
    // 1. Iniciar transação
    EntityTransaction tx = em.getTransaction();
    tx.begin();

    // 2. Obter CriteriaBuilder
    CriteriaBuilder cb = em.getCriteriaBuilder();

    // 3. Criar CriteriaUpdate para Pedido
    CriteriaUpdate<Pedido> update = cb.createCriteriaUpdate(Pedido.class);

    // 4. Definir raiz (tabela/alias)
    Root<Pedido> root = update.from(Pedido.class);

    // 5. Definir novo valor para status
    update.set(root.get("status"), "CANCELADO");

    // 6. Definir condição: dataCriacao < hoje - 6 meses
    LocalDate seisMesesAtras = LocalDate.now().minusMonths(6);
    Predicate pedidoAntigo = cb.lessThan(root.get("dataCriacao"), seisMesesAtras);
    update.where(pedidoAntigo);

    // 7. Executar update em lote
    Query query = em.createQuery(update);
    int qtdeAtualizados = query.executeUpdate();

    // 8. Commit da transação
    tx.commit();

    // 9. Limpar contexto para evitar inconsistências
    em.clear();

    return qtdeAtualizados;
}

```

### 7.3 Método de Remoção em Lote (CriteriaDelete)

```java
/**
 * Remove todos os itens de pedido cuja quantidade seja zero.
 */
public int removerItensSemQuantidade(EntityManager em) {
    // 1. Iniciar transação
    EntityTransaction tx = em.getTransaction();
    tx.begin();

    // 2. Obter CriteriaBuilder
    CriteriaBuilder cb = em.getCriteriaBuilder();

    // 3. Criar CriteriaDelete para ItemPedido
    CriteriaDelete<ItemPedido> delete = cb.createCriteriaDelete(ItemPedido.class);

    // 4. Definir raiz
    Root<ItemPedido> root = delete.from(ItemPedido.class);

    // 5. Definir condição: quantidade = 0
    Predicate qtdZero = cb.equal(root.get("quantidade"), 0);
    delete.where(qtdZero);

    // 6. Executar delete em lote
    Query query = em.createQuery(delete);
    int qtdeRemovidos = query.executeUpdate();

    // 7. Commit da transação
    tx.commit();

    // 8. Limpar contexto
    em.clear();

    return qtdeRemovidos;
}

```

### 7.4 Exemplo de Uso em Serviço

```java
public class PedidoService {

    @PersistenceContext
    private EntityManager em;

    public void processarManutencaoDePedidos() {
        int atualizados = cancelarPedidosAntigos(em);
        System.out.println("Pedidos cancelados: " + atualizados);

        int removidos = removerItensSemQuantidade(em);
        System.out.println("Itens de pedido removidos: " + removidos);
    }

    // Métodos cancelarPedidosAntigos(...) e removerItensSemQuantidade(...) conforme acima
}

```

---

## 8. Sugestões para Aprofundamento

- **Documentação Oficial JPA 2.1 / 2.2**
    - Seção: *Criteria API*
    - Capítulo: *Bulk Update and Delete Operations*
- **Livro “Pro JPA 2 in Java EE 8” (Mike Keith & Merrick Schincariol)**
    - Capítulo: *Bulk Operations with Criteria*
- **Discussão sobre detecção de mudanças e flush mode**
    - Artigos sobre como o *persistence context* lida com operações em lote.
- **Outras Abordagens**
    - Usar **JPQL** diretamente: `em.createQuery("UPDATE Pedido p SET p.status = :status WHERE p.dataCriacao < :data")`.
    - Comparar performance de JPQL vs. Criteria API para grandes volumes.
- **Ferramentas de Monitoramento de SQL gerado**
    - Ativar log do Hibernate (`hibernate.show_sql=true`, `hibernate.format_sql=true`) para inspecionar a instrução SQL resultante.
- **Cenários Avançados**
    - Explorar subqueries em `WHERE` para delete:
        
        ```java
        // Exemplo: DELETE FROM ItemPedido WHERE pedido.id IN
        //             (SELECT p.id FROM Pedido p WHERE p.status = 'CANCELADO')
        
        ```
        
    - Atenção: nem todos os provedores JPA permitem subqueries complexas em bulk operations.

---

Com esta explanação, você tem:

- Uma **visão geral concisa** (Seção 1) para entender rapidamente o propósito.
- Um **detalhamento completo** (Seções 2 a 7) com conceitos, sintaxe, exemplos comentados e melhores práticas.
- Um **exemplo prático** (Seção 7) que reúne tanto `CriteriaUpdate` quanto `CriteriaDelete`.
- **Sugestões de aprofundamento** para estudos futuros.

Se precisar de algo mais específico (comparativos de desempenho, integração com Metamodel, exemplos em Spring Data JPA, ou cenários avançados com subqueries), fique à vontade para solicitar!