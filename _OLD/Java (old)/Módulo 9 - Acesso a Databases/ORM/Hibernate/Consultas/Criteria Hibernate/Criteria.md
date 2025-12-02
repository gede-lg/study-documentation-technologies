# Criteria em Hibernate

## O que é e para que serve?

Criteria é uma API fornecida pelo Hibernate para construir consultas programaticamente de forma orientada a objetos. Ela é usada para criar consultas complexas dinamicamente sem a necessidade de escrever consultas SQL ou HQL (Hibernate Query Language) diretamente, aumentando a segurança e a manutenibilidade do código.

### Vantagens:
- **Tipo-Safety:** Reduz o risco de erros em tempo de execução relacionados a tipos de dados.
- **Consultas Dinâmicas:** Facilita a construção de consultas com condições que podem variar em tempo de execução.
- **Legibilidade:** Código mais legível e fácil de manter, especialmente para consultas complexas.

## Classe Criteria: O que é e para que serve?

A classe `Criteria` é o coração da Criteria API no Hibernate. Ela é usada para definir e executar consultas orientadas a objetos contra a base de dados.

### Métodos Principais da Classe Criteria

#### `add(Criterion) - WHERE`
- **Uso:** Adiciona uma restrição à consulta.
- **Exemplo:**
  ```java
  Criteria crit = session.createCriteria(MinhaClasse.class);
  crit.add(Restrictions.eq("nome", "João"));
  ```

#### `setProjection(Projection) - SELECT`
- **Uso:** Define uma projeção para a consulta, que pode ser usada para especificar as colunas a serem retornadas.
- **Exemplo:**
  ```java
  crit.setProjection(Projections.property("nome"));
  ```

#### `addOrder(Order) - ORDER BY`
- **Uso:** Adiciona uma ordenação para a consulta.
- **Exemplo:**
  ```java
  crit.addOrder(Order.asc("nome"));
  ```

#### `setFetchMode(String, FetchMode)`
- **Uso:** Especifica a estratégia de carregamento para associações e coleções.
- **Exemplo:**
  ```java
  crit.setFetchMode("minhaColecao", FetchMode.JOIN);
  ```

#### `setFirstResult(int)`
- **Uso:** Define o primeiro resultado a ser recuperado (usado para paginação).
- **Exemplo:**
  ```java
  crit.setFirstResult(0); // começa do primeiro resultado
  ```

#### `setMaxResults(int)`
- **Uso:** Define o número máximo de resultados a serem recuperados (usado para paginação).
- **Exemplo:**
  ```java
  crit.setMaxResults(10); // retorna no máximo 10 resultados
  ```

#### `createAlias(String, String) - AS`
- **Uso:** Cria um alias para associações ou para elementos de coleções, que pode ser usado em outras partes da consulta.
- **Exemplo:**
  ```java
  crit.createAlias("departamento", "dept");
  crit.add(Restrictions.eq("dept.nome", "Vendas"));
  ```

#### `createCriteria(String) - FROM`
- **Uso:** Cria uma subconsulta para associações ou coleções.
- **Exemplo:**
  ```java
  Criteria subCrit = crit.createCriteria("empregados");
  subCrit.add(Restrictions.like("nome", "J%"));
  ```

#### `uniqueResult()`
- **Uso:** Retorna um único resultado ou `null` se nenhum resultado for encontrado. Lança uma exceção se mais de um resultado for encontrado.
- **Exemplo:**
  ```java
  MinhaClasse resultado = (MinhaClasse) crit.uniqueResult();
  ```

#### `list()`
- **Uso:** Retorna uma lista de resultados que correspondem à consulta.
- **Exemplo:**
  ```java
  List<MinhaClasse> resultados = crit.list();
  ```

## Exemplo Completo de Uso da Criteria API

```java
Session session = sessionFactory.openSession();
Criteria crit = session.createCriteria(MinhaClasse.class);
crit.add(Restrictions.eq("nome", "João"));
crit.addOrder(Order.asc("idade"));
crit.setFirstResult(0);
crit.setMaxResults(10);

List<MinhaClasse> resultados = crit.list();
session.close();
```

Neste exemplo, uma consulta é criada para buscar instâncias de `MinhaClasse` onde o campo `nome` é igual a "João". A consulta é ordenada pela idade em ordem ascendente e limitada aos primeiros 10 resultados.

## Conclusão

A Criteria API do Hibernate é uma ferramenta robusta para criar consultas orientadas a objetos de forma programática e segura contra tipos. Ela é especialmente útil para construir consultas dinâmicas e complexas, onde a composição da consulta pode variar em tempo de execução. A familiaridade com os métodos da classe `Criteria` e seu uso apropriado é fundamental para aproveitar plenamente os benefícios desta API.