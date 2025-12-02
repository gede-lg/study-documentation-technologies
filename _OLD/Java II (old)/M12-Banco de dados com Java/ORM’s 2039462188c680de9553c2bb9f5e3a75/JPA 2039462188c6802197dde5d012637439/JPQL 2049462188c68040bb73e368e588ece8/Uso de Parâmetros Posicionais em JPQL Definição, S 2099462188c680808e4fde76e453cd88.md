# Uso de Parâmetros Posicionais em JPQL: Definição, Sintaxe, Vantagens e Limitações

---

## 1. Introdução

Em aplicações Java que utilizam JPA (Java Persistence API), é comum a necessidade de criar consultas dinâmicas para buscar, atualizar ou excluir entidades no banco de dados. O JPQL (Java Persistence Query Language) permite a construção dessas consultas de forma orientada a objetos. Os **parâmetros posicionais** (`?1`, `?2`, …) são uma das formas de inserir valores dinamicamente em uma consulta JPQL, associando cada marcador de posição (positional parameter) a um índice numérico.

Nesta explicação, abordaremos o conceito de parâmetros posicionais em JPQL, como vinculá-los via `Query.setParameter(int index, Object value)`, suas vantagens e limitações, e forneceremos um exemplo prático completo.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Definição do marcador `?n`
    2. Criação da `Query` e vinculação com `setParameter`
    3. Exemplos comentados
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    1. Interface `javax.persistence.Query`
    2. Métodos relevantes (`createQuery`, `setParameter`, `getResultList`)
    3. Possíveis anotações (em contextos de frameworks)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
    1. Cenário: Cadastro de Usuários com Filtro Dinâmico
    2. Definição da Entidade
    3. Montagem do DAO/Repository
    4. Uso de Parâmetros Posicionais em JPQL
    5. Demonstração de Resultados
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

- **O que são Parâmetros Posicionais?**
    
    Em JPQL, um parâmetro posicional é representado por um marcador numérico no corpo da consulta, escrito como `?1`, `?2`, `?3` e assim por diante. Cada marcador corresponde a uma entrada que será substituída por um valor em tempo de execução, evitando concatenação manual de strings e protegendo contra ataques de injeção de SQL.
    
- **Por que usar Parâmetros Posicionais?**
    1. **Clareza na Ligação de Variáveis:** Ao utilizar índices numéricos, o desenvolvedor sabe exatamente em qual posição o valor será inserido.
    2. **Reuso de Consultas Preparadas:** Dependendo do provedor JPA, consultas com parâmetros posicionais podem ser pré-compiladas (prepared statements), melhorando performance em execuções repetidas.
    3. **Evita Concatenações Perigosas:** Garante que o valor seja tratado como parâmetro, não como parte da string literal da consulta, prevenindo injeções de SQL.
- **Quando surgiu e qual é o propósito?**
    
    O conceito de parâmetros posicionais em JPQL foi herdado dos padrões de JDBC, onde o `PreparedStatement` usa o marcador `?`. No JPQL, esses marcadores recebem um número explícito para indicar a ordem. O propósito principal é permitir a criação de consultas dinâmicas mais seguras e legíveis, separando a lógica de consulta (estrutural) dos valores (dados) que serão passados.
    

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1. Definição do marcador `?n`

- Um parâmetro posicional em JPQL é indicado por um ponto de interrogação (`?`) seguido de um número inteiro positivo.
    
    ```
    SELECT e FROM Entidade e WHERE e.campo = ?1 AND e.outroCampo > ?2
    
    ```
    
    Aqui, `?1` e `?2` são os parâmetros posicionais. O índice começa em 1 (não em 0).
    

### 4.2. Criação da `Query` e vinculação com `setParameter`

1. **Obter o `EntityManager`:**
    
    ```java
    EntityManager em = entityManagerFactory.createEntityManager();
    
    ```
    
2. **Criar a consulta JPQL com marcadores posicionais:**
    
    ```java
    String jpql = "SELECT u FROM Usuario u WHERE u.email = ?1 AND u.idade >= ?2";
    Query query = em.createQuery(jpql);
    
    ```
    
3. **Vincular valores aos parâmetros (índice, valor):**
    
    ```java
    query.setParameter(1, "fulano@example.com");
    query.setParameter(2, 18);
    
    ```
    
4. **Executar a consulta e obter resultados:**
    
    ```java
    List<Usuario> lista = query.getResultList();
    
    ```
    

### 4.3. Exemplos Comentados

```java
// Suponha uma entidade simples "Usuario" com campos id, nome, email e idade
@Entity
@Table(name = "TB_USUARIO")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private Integer idade;

    // getters e setters omitidos para brevidade
}

```

**Exemplo A: Consulta básica com dois parâmetros posicionais**

```java
// 1. Obtém o EntityManager (geralmente via injeção ou factory)
EntityManager em = entityManagerFactory.createEntityManager();

try {
    // 2. Define a string JPQL com parâmetros posicionais ?1 e ?2
    String jpql = "SELECT u FROM Usuario u WHERE u.email = ?1 AND u.idade >= ?2";

    // 3. Cria a Query a partir da string JPQL
    Query query = em.createQuery(jpql);

    // 4. Vincula valores: índice 1 -> "joao@exemplo.com", índice 2 -> 21
    query.setParameter(1, "joao@exemplo.com");
    query.setParameter(2, 21);

    // 5. Executa e obtém a lista de resultados
    List<Usuario> resultados = query.getResultList();

    // 6. Processa os resultados
    for (Usuario u : resultados) {
        System.out.println("ID: " + u.getId() + " | Nome: " + u.getNome());
    }
} finally {
    em.close();
}

```

> Comentário:
> 
> - `?1` corresponde ao primeiro `setParameter(1, valor)`.
> - `?2` corresponde ao segundo `setParameter(2, valor)`.
> - Se não houver correspondência exata entre índices de marcadores e chamados de `setParameter`, ocorrerá `IllegalArgumentException`.

**Exemplo B: Consulta com mais marcadores e tipos diferentes**

```java
// Busca usuários cujo nome contenha um termo (LIKE) e estejam ativos
String jpql = "SELECT u FROM Usuario u WHERE UPPER(u.nome) LIKE UPPER(?1) AND u.ativo = ?2";
Query query = em.createQuery(jpql);

// Vincula ?1 a "%silva%" (usando wildcard do LIKE) e ?2 a true
query.setParameter(1, "%silva%");
query.setParameter(2, Boolean.TRUE);

List<Usuario> usuarios = query.getResultList();
// Processa a lista...

```

> Comentário:
> 
> - No `LIKE`, o valor passado já deve incluir `%` conforme necessidade.
> - Tipos de dados diferentes (String, Boolean, Date etc.) podem ser vinculados conforme a definição dos campos da entidade.

---

## 5. Cenários de Restrição ou Não Aplicação

Embora os parâmetros posicionais sejam práticos em diversas situações, existem cenários onde eles podem não ser a melhor opção:

1. **Múltiplos Parâmetros e Legibilidade:**
    - Quando a consulta possui **muitos** marcadores (por exemplo, `?1`, `?2`, `?3`, … até `?10+`), torna-se difícil acompanhar qual índice corresponde a qual campo.
    - Nesse caso, parâmetros nomeados (`:nome`, `:email`, etc.) costumam ser mais claros.
2. **Manutenção e Refatoração:**
    - Se, ao longo do tempo, for preciso reordenar ou inserir novos filtros, é necessário ajustar cuidadosamente os índices, sob risco de vincular valor errado.
    - Com parâmetros nomeados, a renumeração não é necessária — basta manter o mesmo identificador textual.
3. **Reposição Dinâmica de Filtros:**
    - Em consultas que variam dinamicamente (caso número variável de cláusulas `WHERE`), controlar índices pode ser mais trabalhoso.
    - Abordagens baseadas em Criteria API (tipos fortemente tipados) ou Named Queries parametrizadas podem oferecer maior flexibilidade.
4. **Frameworks que Preferem Named Parameters:**
    - Em alguns frameworks (por exemplo, Spring Data JPA), a convenção é utilizar parâmetros nomeados (`:param`). Embora seja possível usar posicionais, a comunidade tende a favorecer named parameters para maior clareza.

---

## 6. Componentes Chave Associados

### 6.1. Interface `javax.persistence.Query`

- **Descrição:**
    
    A interface `Query` (ou `TypedQuery<T>`, quando se conhece o tipo de retorno) representa uma consulta executável. É retornada por `EntityManager.createQuery(...)` ou `EntityManager.createNamedQuery(...)`.
    
- **Métodos Relevantes:**
    - `Query setParameter(int position, Object value)`
        
        Vincula o valor ao marcador posicional de índice `position`.
        
    - `Query setParameter(int position, Object value, TemporalType temporalType)`
        
        Para parâmetros de data (`java.util.Date`, `java.time.*`), permite especificar se é `DATE`, `TIME` ou `TIMESTAMP`.
        
    - `List getResultList()`
        
        Executa a consulta (SELECT) e retorna lista de resultados.
        
    - `Object getSingleResult()`
        
        Retorna um único resultado (lança `NoResultException` ou `NonUniqueResultException` conforme o caso).
        
    - Métodos auxiliares (por exemplo, `setMaxResults(int)`, `setFirstResult(int)`).

### 6.2. Criação da `Query`

- **EntityManager.createQuery(String jpql):** Gera uma instância de `Query` com base na string JPQL.
- **EntityManager.createQuery(CriteriaQuery criteriaQuery):** Quando se usa Criteria API, mas este tópico está fora do escopo de parâmetros posicionais.

### 6.3. Anotações Relacionadas (contexto Spring Data JPA / Jakarta EE)

- Em um repositório (Repository) do Spring Data JPA, você pode usar:
    
    ```java
    @Query("SELECT u FROM Usuario u WHERE u.nome = ?1 AND u.idade = ?2")
    List<Usuario> buscarPorNomeEIdade(String nome, Integer idade);
    
    ```
    
    → Nesse contexto, a posição do argumento do método (`String nome`, `Integer idade`) corresponde a `?1` e `?2`.
    
- Entretanto, essa não é a abordagem “pura” do JPA, mas uma convenção do Spring. Ainda assim, internamente, ela se traduz em `Query.setParameter(1, nome)` e `Query.setParameter(2, idade)`.

---

## 7. Melhores Práticas e Padrões de Uso

1. **Validação de Índices:**
    - Sempre confira se o índice passado em `setParameter(index, value)` realmente existe na consulta JPQL. Caso contrário, ocorrerá `IllegalArgumentException: Parameter with that position does not exist`.
2. **Uso Moderado de Parâmetros Posicionais:**
    - Para **consultas simples** (até 2 ou 3 parâmetros), posicionais são adequados e claros.
    - Para **consultas complexas** com muitos filtros, prefira parâmetros nomeados (`:nome`, `:idade`, etc.) para melhorar a legibilidade.
3. **Consistência de Tipos:**
    - Ao vincular valores, utilize tipos compatíveis com os campos da entidade.
    - Para datas, prefira `java.time.LocalDate`, `LocalDateTime` e use o método `setParameter(int, java.time…)` sem `TemporalType`, pois JPA mais recente faz o mapeamento correto. Se usar `java.util.Date`, especifique `TemporalType`.
4. **Não Misturar Posicionais e Nomeados na Mesma Consulta:**
    - Evite confusão: opte por um estilo (posicional ou nomeado) por consulta. Alguns provedores podem não suportar misturar ambos.
5. **Evitar Reuso Indevido de Índices:**
    - Mesmo que um parâmetro apareça mais de uma vez no JPQL, referencie-o ao mesmo índice.
    
    ```java
    // Exemplo incorreto: usar ?1 e ?2 para o mesmo valor "nome"
    String jpqlIncorreto = "SELECT u FROM Usuario u WHERE u.nome = ?1 OR u.apelido = ?2";
    // Se a intenção for usar o mesmo critério, faça:
    String jpqlCorreto = "SELECT u FROM Usuario u WHERE u.nome = ?1 OR u.apelido = ?1";
    query.setParameter(1, "joao"); // só um setParameter necessário
    
    ```
    
6. **Comentários e Documentação:**
    - Inclua comentários no código explicando qual índice corresponde a qual parâmetro, especialmente se houver mais de dois parâmetros.

---

## 8. Exemplo Prático Completo

### 8.1. Cenário: Cadastro de Usuários com Filtro Dinâmico

Imagine uma aplicação que armazena usuários num banco de dados e precisa oferecer uma busca com filtros para:

- **email** (igualdade exata)
- **idade mínima** (>=)
- **status (ativo/inativo)**

O requisito é: caso um determinado filtro não seja informado, ele deve ser ignorado. Usaremos parâmetros posicionais para implementar uma consulta JPQL dinâmica.

### 8.2. Definição da Entidade `Usuario`

```java
package br.com.exemplo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_USUARIO")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true)
    private String email;

    private Integer idade;

    private Boolean ativo;

    // Construtores, getters e setters

    public Usuario() {}

    public Usuario(String nome, String email, Integer idade, Boolean ativo) {
        this.nome = nome;
        this.email = email;
        this.idade = idade;
        this.ativo = ativo;
    }

    // getters e setters omitidos para brevidade
}

```

### 8.3. Montagem do DAO/Repository (Abordagem Padrão JPA)

Criaremos uma classe de repositório manual que recebe os filtros e monta dinamicamente a string JPQL:

```java
package br.com.exemplo.repository;

import br.com.exemplo.model.Usuario;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import java.util.ArrayList;
import java.util.List;

public class UsuarioRepository {

    @PersistenceContext
    private EntityManager em;

    /**
     * Busca usuários com base em filtros opcionais.
     *
     * @param email      Filtro exato de email (ou null para ignorar).
     * @param idadeMin   Filtro de idade mínima (ou null para ignorar).
     * @param ativo      Filtro de status ativo (ou null para ignorar).
     * @return Lista de usuários que satisfazem os filtros.
     */
    public List<Usuario> buscarPorFiltros(String email, Integer idadeMin, Boolean ativo) {
        // 1. Monta a consulta base
        StringBuilder sb = new StringBuilder("SELECT u FROM Usuario u WHERE 1=1");
        // "1=1" facilita a concatenação de outras cláusulas com "AND"

        // Listas auxiliares para construção dos parâmetros
        List<Object> valores = new ArrayList<>();    // armazenará os valores a vincular
        List<Integer> indices = new ArrayList<>();   // armazenará o índice de cada parâmetro

        int indiceParametro = 1; // contador de posições de parâmetro

        // 2. Adiciona cláusula para email, se informado
        if (email != null && !email.isBlank()) {
            sb.append(" AND u.email = ?").append(indiceParametro);
            valores.add(email);
            indices.add(indiceParametro);
            indiceParametro++;
        }

        // 3. Adiciona cláusula para idade mínima, se informado
        if (idadeMin != null) {
            sb.append(" AND u.idade >= ?").append(indiceParametro);
            valores.add(idadeMin);
            indices.add(indiceParametro);
            indiceParametro++;
        }

        // 4. Adiciona cláusula para status ativo, se informado
        if (ativo != null) {
            sb.append(" AND u.ativo = ?").append(indiceParametro);
            valores.add(ativo);
            indices.add(indiceParametro);
            indiceParametro++;
        }

        // 5. Cria a Query com a string final
        Query query = em.createQuery(sb.toString());

        // 6. Vincula os valores aos índices correspondentes
        for (int i = 0; i < valores.size(); i++) {
            Integer pos = indices.get(i);
            Object val = valores.get(i);
            query.setParameter(pos, val);
        }

        // 7. Executa e retorna os resultados
        @SuppressWarnings("unchecked")
        List<Usuario> resultado = (List<Usuario>) query.getResultList();
        return resultado;
    }
}

```

**Explicação Passo a Passo do Exemplo:**

1. **Preparação da String JPQL:**
    - Iniciamos com `"SELECT u FROM Usuario u WHERE 1=1"` para facilitar a adição condicional de cláusulas `AND`.
    - Variável `indiceParametro` começa em 1 e será incrementada a cada cláusula adicionada.
2. **Condições Dinâmicas:**
    - Se `email` não for nulo, concatenamos `" AND u.email = ?1"` (ou `?n` de acordo com o índice atual).
    - Se `idadeMin` informado, concatenamos `" AND u.idade >= ?X"`.
    - Se `ativo` informado, concatenamos `" AND u.ativo = ?Y"`.
3. **Registro dos Valores e Índices:**
    - As listas `valores` e `indices` guardam, respectivamente, os valores a serem vinculados e a posição correspondente.
    - Exemplo: se `email` e `ativo` forem informados, teremos:
        - `indices = [1, 2]`
        - `valores = ["fulano@ex.com", true]`
4. **Criação e Vinculação dos Parâmetros:**
    - A string final pode ficar, por exemplo, `"SELECT u FROM Usuario u WHERE 1=1 AND u.email = ?1 AND u.ativo = ?2"`.
    - Criamos a `Query` com `em.createQuery(...)`.
    - Iteramos sobre `valores` e `indices`, invocando `query.setParameter(pos, val)`.
5. **Execução e Retorno:**
    - `query.getResultList()` retorna a lista de instâncias `Usuario` que satisfazem os filtros passados.

### 8.4. Demonstração de Resultados

```java
// Em algum serviço ou teste:
UsuarioRepository repo = new UsuarioRepository();

// Exemplo 1: Filtrar apenas por email
List<Usuario> listaEmail = repo.buscarPorFiltros("maria@exemplo.com", null, null);

// Exemplo 2: Filtrar por idade mínima e status ativo
List<Usuario> listaIdadeAtivos = repo.buscarPorFiltros(null, 18, true);

// Exemplo 3: Todos os parâmetros informados
List<Usuario> listaCompleta = repo.buscarPorFiltros("joao@exemplo.com", 21, false);

// Impressão dos resultados (apenas ilustrativo)
listaCompleta.forEach(u ->
    System.out.println("ID=" + u.getId() + " | Nome=" + u.getNome() + " | Idade=" + u.getIdade())
);

```

---

## 9. Sugestões para Aprofundamento

1. **Comparar com Parâmetros Nomeados:**
    - Estude quando e por que usar parâmetros nomeados (`:nome`, `:idade`) em vez de posicionais, especialmente em consultas complexas.
2. **Criteria API:**
    - Aprenda a formular consultas dinamicamente usando `CriteriaBuilder` e `CriteriaQuery` do JPA, método fortemente tipado, evitando manipulação manual de strings JPQL.
3. **Named Queries:**
    - Centralize consultas constantes em anotações `@NamedQuery` na classe da entidade, fazendo referência a parâmetros posicionais ou nomeados.
4. **Desempenho e Planos de Execução:**
    - Verifique como seu provedor de JPA — Hibernate, EclipseLink etc. — otimiza consultas com parâmetros posicionais. Em alguns casos, ocorre cache de planos de execução.
5. **Tratamento de Exceções:**
    - Entenda as exceções relacionadas a parâmetros (por exemplo, `IllegalArgumentException` se índice inválido, `QueryTimeoutException` em casos de timeout).
6. **Validação de Dados de Entrada:**
    - Valide valores antes de vinculá-los à consulta (por exemplo, impedir valores null onde não esperado), evitando erros em tempo de execução.

---

### Conclusão

Os **parâmetros posicionais (`?1`, `?2`, …)** em JPQL oferecem uma forma direta e segura de inserir valores em consultas dinâmicas. Eles são especialmente úteis em cenários de consultas relativamente simples, garantindo que valores sejam tratados de forma preparada (prepared statements) e evitando injeção de SQL. Contudo, para consultas mais complexas, com muitas condições, é recomendável avaliar o uso de parâmetros nomeados ou mesmo optar por Criteria API para manter o código legível e menos propenso a erros de índice. Compreender as vantagens, limitações e melhores práticas permitirá construir consultas robustas e de fácil manutenção em aplicações Java que utilizam JPA.