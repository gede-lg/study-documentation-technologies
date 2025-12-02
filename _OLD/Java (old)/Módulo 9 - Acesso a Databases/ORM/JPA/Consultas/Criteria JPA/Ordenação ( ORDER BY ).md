# Criteria API do JPA

## O que é e para que serve?

Ordenação, no contexto de bases de dados, é o processo de organizar os registros em uma sequência específica. Esta sequência pode ser ascendente (do menor para o maior) ou descendente (do maior para o menor). A ordenação é crucial para apresentar dados de forma organizada, facilitar a busca e a análise de informações.

## Tipos de Ordenação (métodos e sintaxe, e onde encontrá-los)

Na Criteria API, a ordenação é feita usando o objeto `javax.persistence.criteria.Order`. Existem basicamente dois tipos de ordenação:

1. **Ascendente (`asc`)**: Ordena os resultados de uma consulta em ordem crescente.
2. **Descendente (`desc`)**: Ordena os resultados em ordem decrescente.

### Sintaxe e Métodos:

Para aplicar ordenação, você usa o método `orderBy` do objeto `CriteriaQuery`. Este método aceita um ou mais objetos `Order`, que podem ser obtidos através dos métodos `asc` e `desc` da interface `CriteriaBuilder`.

```java
CriteriaBuilder cb = entityManager.getCriteriaBuilder();
CriteriaQuery<MinhaEntidade> query = cb.createQuery(MinhaEntidade.class);
Root<MinhaEntidade> root = query.from(MinhaEntidade.class);

query.orderBy(cb.asc(root.get("minhaPropriedade")));
```

## Ordenação: Classes-Chave e Implementação

### Classes-Chave:

1. **CriteriaBuilder**: Usado para construir critérios de consulta, criar objetos `Order` e outros componentes da consulta.
2. **CriteriaQuery**: Representa a consulta Criteria.
3. **Root**: Representa a entidade principal na consulta.
4. **Order**: Usado para especificar a ordenação na consulta.

### Implementando a Cláusula `ORDER BY`:

Para implementar a cláusula `ORDER BY` usando a Criteria API:

```java
// Criando o CriteriaBuilder e CriteriaQuery
CriteriaBuilder cb = entityManager.getCriteriaBuilder();
CriteriaQuery<MinhaEntidade> cq = cb.createQuery(MinhaEntidade.class);

// Definindo a raiz da consulta
Root<MinhaEntidade> root = cq.from(MinhaEntidade.class);

// Construindo a cláusula ORDER BY
cq.orderBy(cb.asc(root.get("minhaPropriedade")));

// Executando a consulta
TypedQuery<MinhaEntidade> query = entityManager.createQuery(cq);
List<MinhaEntidade> resultados = query.getResultList();
```

## Exemplo de Ordenação Básica

Ordenando uma lista de `Pessoas` pelo nome em ordem ascendente:

```java
CriteriaBuilder cb = entityManager.getCriteriaBuilder();
CriteriaQuery<Pessoa> cq = cb.createQuery(Pessoa.class);
Root<Pessoa> root = cq.from(Pessoa.class);
cq.orderBy(cb.asc(root.get("nome")));
TypedQuery<Pessoa> query = entityManager.createQuery(cq);
List<Pessoa> pessoas = query.getResultList();
```

## Exemplo de Ordenação Avançada

Ordenando por mais de um campo, por exemplo, por sobrenome em ordem descendente e depois por nome em ordem ascendente:

```java
CriteriaBuilder cb = entityManager.getCriteriaBuilder();
CriteriaQuery<Pessoa> cq = cb.createQuery(Pessoa.class);
Root<Pessoa> root = cq.from(Pessoa.class);

// Ordenação composta
cq.orderBy(cb.desc(root.get("sobrenome")), cb.asc(root.get("nome")));

TypedQuery<Pessoa> query = entityManager.createQuery(cq);
List<Pessoa> pessoas = query.getResultList();
```

## Considerações Adicionais

- **Dinamismo**: A Criteria API é ideal para consultas dinâmicas onde os critérios de busca e ordenação não são conhecidos em tempo de compilação.
- **Segurança de Tipos**: A API é fortemente tipada, o que ajuda a prevenir erros comuns como digitar incorretamente os nomes das propriedades.
- **Complexidade**: A Criteria API pode ser mais complexa e verbosa em comparação com JPQL ou SQL, especialmente para consultas simples.

Ao usar a Criteria API, você ganha em flexibilidade e segurança de tipos, mas deve estar ciente da complexidade adicional que ela pode introduzir no seu código. É uma ferramenta poderosa para construir consultas JPA, especialmente em cenários complexos ou dinâmicos.