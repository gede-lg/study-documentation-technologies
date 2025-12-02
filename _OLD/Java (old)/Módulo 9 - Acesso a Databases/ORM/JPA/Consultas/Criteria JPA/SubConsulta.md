# Criteria API do JPA: Sub Consultas

## O que é Sub Consulta e para que serve?

Uma subconsulta, no contexto da Criteria API do JPA (Java Persistence API), é uma consulta aninhada dentro de outra consulta. É usada para realizar operações mais complexas, como filtragem, agregação, ou para obter dados que dependem de informações de outras tabelas que não estão diretamente relacionadas à consulta principal.

Subconsultas são úteis em cenários onde precisamos comparar ou processar informações que não estão imediatamente disponíveis na tabela principal ou quando queremos aplicar filtros baseados em cálculos ou condições complexas.

## Sub Consulta: Classes-Chave da Criteria API

Para criar subconsultas com a Criteria API, utilizamos algumas classes-chave:

1. **CriteriaBuilder**: Usada para construir critérios de consulta e subconsulta. Ela fornece métodos para criar operações de consulta, condições (predicados), expressões, etc.

2. **CriteriaQuery**: Representa a consulta principal.

3. **Subquery**: Representa a subconsulta. É derivada de `CriteriaQuery`.

4. **Root**: Representa as entidades que estão sendo consultadas.

5. **Predicate**: Usado para definir condições na consulta (WHERE clause).

6. **Expression**: Representa uma expressão que pode ser parte de uma seleção, cláusula WHERE, etc.

### Implementando Subconsultas

Para implementar subconsultas, você cria uma instância de `Subquery` a partir do `CriteriaBuilder` e então constrói a subconsulta utilizando os mesmos passos que faria para uma consulta normal.

## Exemplo de Subconsulta Básica

Vamos criar uma subconsulta simples que seleciona todos os funcionários cujos salários são maiores do que a média dos salários.

```java
// Criação do CriteriaBuilder
CriteriaBuilder cb = entityManager.getCriteriaBuilder();

// Criação da consulta principal
CriteriaQuery<Funcionario> cq = cb.createQuery(Funcionario.class);
Root<Funcionario> root = cq.from(Funcionario.class);

// Criação da subconsulta
Subquery<Double> subquery = cq.subquery(Double.class);
Root<Funcionario> subqueryRoot = subquery.from(Funcionario.class);
subquery.select(cb.avg(subqueryRoot.get(Funcionario_.salario)));

// Aplicando a subconsulta na consulta principal
cq.select(root).where(cb.greaterThan(root.get(Funcionario_.salario), subquery));

// Executando a consulta
TypedQuery<Funcionario> query = entityManager.createQuery(cq);
List<Funcionario> resultado = query.getResultList();
```

Neste exemplo, a subconsulta calcula a média dos salários e a consulta principal seleciona funcionários cujo salário é maior que essa média.

## Exemplo de Subconsulta Avançada

Vamos criar uma consulta que seleciona departamentos com mais de 5 funcionários.

```java
// Criação do CriteriaBuilder
CriteriaBuilder cb = entityManager.getCriteriaBuilder();

// Consulta principal para Departamento
CriteriaQuery<Departamento> cq = cb.createQuery(Departamento.class);
Root<Departamento> root = cq.from(Departamento.class);

// Subconsulta para contar funcionários
Subquery<Long> subquery = cq.subquery(Long.class);
Root<Funcionario> subqueryRoot = subquery.from(Funcionario.class);
subquery.select(cb.count(subqueryRoot));
subquery.where(cb.equal(subqueryRoot.get(Funcionario_.departamento), root));

// Aplicando a subconsulta na consulta principal
cq.select(root).where(cb.greaterThanOrEqualTo(subquery, 5L));

// Executando a consulta
TypedQuery<Departamento> query = entityManager.createQuery(cq);
List<Departamento> resultado = query.getResultList();
```

Neste exemplo, a subconsulta conta o número de funcionários em cada departamento, e a consulta principal seleciona os departamentos onde esse número é maior ou igual a 5.

## Considerações Adicionais

- **Performance**: Subconsultas podem ser custosas em termos de performance. Avalie a necessidade e tente otimizar as consultas tanto quanto possível.
- **Legibilidade**: Subconsultas podem tornar o código mais complexo. Documente bem seu código para garantir que ele permaneça compreensível.
- **Alternativas**: Em alguns casos, pode ser mais eficiente usar JOINS ou consultas separadas, dependendo da estrutura de dados e dos requisitos específicos.

Subconsultas na Criteria API são ferramentas poderosas para construir consultas dinâmicas e complexas no JPA, permitindo um alto grau de flexibilidade e precisão na manipulação de dados.