# Criteria API do JPA: Foco em Agregação

A Criteria API do JPA é uma ferramenta robusta para a construção de consultas de banco de dados em Java de forma tipada e segura, especialmente útil para consultas complexas.

## O que é agregação e para que serve?

A agregação é uma operação usada em consultas SQL para realizar cálculos em um conjunto de valores e retornar um único valor. É comumente usada em conjunto com a cláusula `GROUP BY` para agrupar linhas que têm os mesmos valores em determinadas colunas e realizar cálculos em cada grupo.

## Tipos de Agregação

Os tipos de agregação mais comuns incluem:

- **COUNT**: Retorna o número de elementos.
- **SUM**: Calcula a soma dos valores.
- **AVG**: Calcula a média dos valores.
- **MAX**: Encontra o maior valor.
- **MIN**: Encontra o menor valor.

Estas operações são encontradas em `javax.persistence.criteria.CriteriaBuilder`, que é o ponto de partida para definir critérios de consulta na Criteria API.

## Agregação na Criteria API

### Componentes Chaves

1. **CriteriaQuery**: Usado para criar a estrutura básica da consulta.
2. **Root**: Representa a entidade que é o ponto de partida da consulta.
3. **CriteriaBuilder**: Usado para construir a cláusula `GROUP BY` e funções de agregação.
4. **Expression**: Representa uma expressão sobre as colunas na base de dados, como os campos de uma entidade.

### Implementando GROUP BY e HAVING

#### GROUP BY

Para implementar `GROUP BY` usando Criteria API, você agrupa os resultados da consulta com base em um ou mais atributos da entidade.

#### HAVING

`HAVING` é usado para definir condições nos grupos criados por `GROUP BY`. É semelhante ao `WHERE`, mas opera em grupos, não em linhas individuais.

## Exemplo de Agregação Básica (sem HAVING)

Suponha que temos uma entidade `Pedido` e queremos contar o número de pedidos por cliente.

```java
CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<Object[]> cq = cb.createQuery(Object[].class);
Root<Pedido> root = cq.from(Pedido.class);

cq.multiselect(root.get("cliente"), cb.count(root));
cq.groupBy(root.get("cliente"));

TypedQuery<Object[]> query = em.createQuery(cq);
List<Object[]> resultados = query.getResultList();
```

Neste exemplo, a consulta agrupa os pedidos por cliente e conta o número de pedidos de cada cliente.

## Exemplo de Agregação Avançada (com HAVING)

Vamos estender o exemplo anterior para incluir a cláusula `HAVING`, filtrando apenas os clientes com mais de 10 pedidos.

```java
CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<Object[]> cq = cb.createQuery(Object[].class);
Root<Pedido> root = cq.from(Pedido.class);

Expression<Long> countPedidos = cb.count(root);
cq.multiselect(root.get("cliente"), countPedidos);
cq.groupBy(root.get("cliente"));
cq.having(cb.greaterThan(countPedidos, 10L));

TypedQuery<Object[]> query = em.createQuery(cq);
List<Object[]> resultados = query.getResultList();
```

Neste caso, a consulta retorna apenas os grupos (clientes) que têm mais de 10 pedidos.

## Considerações Adicionais

- **Tipagem Forte**: A Criteria API é fortemente tipada, o que reduz o risco de erros em tempo de execução.
- **Flexibilidade**: Permite construir consultas dinâmicas, adaptando-se a diferentes requisitos.
- **Legibilidade**: Embora mais verbosa, a Criteria API pode ser mais legível que JPQL ou SQL puro para consultas complexas.

Lembre-se, o domínio da Criteria API do JPA amplia significativamente as possibilidades para construção de consultas dinâmicas e complexas, mantendo a segurança de tipos e a integração com o ecossistema Java.