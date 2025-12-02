# Restrições (Restrictions) - WHERE

## O que é e para que serve?

São usadas para adicionar condições de cláusula WHERE à consulta. Vamos explorar as várias restrições disponíveis e como usá-las. As restrições são condições aplicadas nas consultas para filtrar resultados. A classe `Restrictions` do Hibernate fornece vários métodos estáticos para criar instâncias de `Criterion`, que representam as condições de consulta.

### Métodos de Restrições e Exemplos

#### eq ( == )
- **Descrição:** Retorna os registros onde o valor de um campo é igual ao valor especificado.
- **Exemplo:**
  ```java
  Criteria crit = session.createCriteria(MyEntity.class);
  crit.add(Restrictions.eq("nomeCampo", valor));
  ```

#### ne ( != )
- **Descrição:** Retorna os registros onde o valor de um campo não é igual ao valor especificado.
- **Exemplo:**
  ```java
  crit.add(Restrictions.ne("nomeCampo", valor));
  ```

#### gt ( > algum valor, Maior que )
- **Descrição:** Retorna os registros onde o valor de um campo é maior que o valor especificado.
- **Exemplo:**
  ```java
  crit.add(Restrictions.gt("nomeCampo", valor));
  ```

#### ge ( >= algum valor, Maior ou igual )
- **Descrição:** Retorna os registros onde o valor de um campo é maior ou igual ao valor especificado.
- **Exemplo:**
  ```java
  crit.add(Restrictions.ge("nomeCampo", valor));
  ```

#### lt ( < algum valor, Menor que )
- **Descrição:** Retorna os registros onde o valor de um campo é menor que o valor especificado.
- **Exemplo:**
  ```java
  crit.add(Restrictions.lt("nomeCampo", valor));
  ```

#### le ( <= algum valor, Menor ou igual )
- **Descrição:** Retorna os registros onde o valor de um campo é menor ou igual ao valor especificado.
- **Exemplo:**
  ```java
  crit.add(Restrictions.le("nomeCampo", valor));
  ```

#### between
- **Descrição:** Retorna os registros onde o valor de um campo está entre dois valores.
- **Exemplo:**
  ```java
  crit.add(Restrictions.between("nomeCampo", valor1, valor2));
  ```

#### like
- **Descrição:** Retorna os registros onde o valor de um campo corresponde a um padrão específico.
- **Exemplo:**
  ```java
  crit.add(Restrictions.like("nomeCampo", "padrao%"));
  ```

#### in
- **Descrição:** Retorna os registros onde o valor de um campo está dentro de um conjunto de valores.
- **Exemplo:**
  ```java
  crit.add(Restrictions.in("nomeCampo", new Object[] {valor1, valor2, valor3}));
  ```

#### and, or
- **Descrição:** Combinam duas ou mais restrições lógicas `AND` e `OR`.
- **Exemplo:**
  ```java
  crit.add(Restrictions.and(Restrictions.eq("campo1", valor1), Restrictions.eq("campo2", valor2)));
  crit.add(Restrictions.or(Restrictions.eq("campo3", valor3), Restrictions.eq("campo4", valor4)));
  ```

#### isNull, isNotNull
- **Descrição:** Verifica se um campo é `null` ou não `null`.
-

 **Exemplo:**
  ```java
  crit.add(Restrictions.isNull("nomeCampo"));
  crit.add(Restrictions.isNotNull("nomeCampo"));
  ```

#### isEmpty, isNotEmpty
- **Descrição:** Específico para coleções, verifica se uma coleção está vazia ou não.
- **Exemplo:**
  ```java
  crit.add(Restrictions.isEmpty("nomeColecao"));
  crit.add(Restrictions.isNotEmpty("nomeColecao"));
  ```

### Exemplo de Uso Geral

```java
Session session = sessionFactory.openSession();
Criteria crit = session.createCriteria(MinhaClasse.class);
crit.add(Restrictions.eq("nome", "João"));
crit.add(Restrictions.gt("idade", 18));
List resultados = crit.list();
```

Neste exemplo, estamos criando uma `Criteria` para a classe `MinhaClasse`. Estamos adicionando restrições para selecionar todos os registros onde o `nome` é igual a "João" e a `idade` é maior que 18. O método `list()` executa a consulta e retorna os resultados.

## Combinando Restrições (AND e OR, LogicalExpression e Criterion)

A API `Criteria` em Hibernate é uma ferramenta robusta para construir consultas dinâmicas em bancos de dados, permitindo combinar várias restrições lógicas de forma programática e flexível. Vamos explorar como combinar restrições usando `AND`, `OR`, `LogicalExpression`, e `Criterion`.

### Combinando Restrições com AND e OR

- **AND:** Utilizado para garantir que todas as condições combinadas sejam verdadeiras.
- **OR:** Utilizado para garantir que pelo menos uma das condições combinadas seja verdadeira.

### Exemplo de Código: Combinando Restrições com AND

```java
Session session = sessionFactory.openSession();
Criteria crit = session.createCriteria(SeuClasse.class);

Criterion name = Restrictions.like("nome", "%joão%");
Criterion salary = Restrictions.gt("salario", 1000);

// Combinação AND
LogicalExpression andExp = Restrictions.and(name, salary);
crit.add(andExp);

List results = crit.list();
```

Neste exemplo, a consulta retornará registros onde o `nome` contém "joão" E o `salario` é maior que 1000.

### Exemplo de Código: Combinando Restrições com OR

```java
Session session = sessionFactory.openSession();
Criteria crit = session.createCriteria(SeuClasse.class);

Criterion name = Restrictions.like("nome", "%maria%");
Criterion salary = Restrictions.lt("salario", 5000);

// Combinação OR
LogicalExpression orExp = Restrictions.or(name, salary);
crit.add(orExp);

List results = crit.list();
```

Aqui, a consulta retornará registros onde o `nome` contém "maria" OU o `salario` é menor que 5000.

### Uso de LogicalExpression e Criterion

`LogicalExpression` é uma classe em Hibernate que permite combinar dois ou mais objetos `Criterion` utilizando operadores lógicos como `AND` e `OR`. Cada `Criterion` representa uma condição individual, que quando combinadas, formam uma expressão lógica mais complexa.

### Considerações Importantes

- **Performance:** Ao combinar muitas restrições, especialmente em grandes tabelas, a performance pode ser impactada. É importante otimizar as consultas e, se necessário, indexar colunas no banco de dados.
- **Legibilidade:** Embora poderosa, a API `Criteria` pode levar a um código mais verboso e difícil de entender, especialmente para consultas complexas. A clareza do código deve ser mantida para facilitar a manutenção.

Para combinar restrições de forma direta em uma consulta `Criteria` do Hibernate, sem utilizar explicitamente a classe `Criterion`, você pode recorrer ao método `add()` da interface `Criteria`. Este método permite adicionar restrições diretamente ao objeto `Criteria`. Vamos explorar como isso pode ser feito usando os operadores lógicos `AND` e `OR`.

## Uso Direto de Restrições com AND e OR

Quando você não usa explicitamente `Criterion`, você pode encadear chamadas ao método `add()` para aplicar restrições. Para restrições `AND`, basta adicionar cada restrição consecutivamente. Para `OR`, pode-se usar `Disjunction`.

#### Exemplo com AND

```java
Session session = sessionFactory.openSession();
Criteria crit = session.createCriteria(SuaClasse.class);

// Adiciona restrições diretamente com AND
crit.add(Restrictions.like("nome", "%joão%"));
crit.add(Restrictions.gt("salario", 1000));

List resultados = crit.list();
```

Neste exemplo, as restrições serão combinadas com `AND`. A consulta retornará registros onde o `nome` contém "joão" e o `salario` é maior que 1000.

#### Exemplo com OR usando Disjunction

```java
Session session = sessionFactory.openSession();
Criteria crit = session.createCriteria(SuaClasse.class);

// Cria uma disjunção para OR
Disjunction disjunction = Restrictions.disjunction();
disjunction.add(Restrictions.like("nome", "%maria%"));
disjunction.add(Restrictions.lt("salario", 5000));

// Adiciona a disjunção ao critério
crit.add(disjunction);

List resultados = crit.list();
```

Neste exemplo, a consulta retornará registros onde o `nome` contém "maria" ou o `salario` é menor que 5000, usando `Disjunction` para combinar as restrições com `OR`.

### Considerações

- **Encadeamento de Chamadas:** O encadeamento de chamadas ao `add()` com várias restrições resultará em uma condição `AND`.
- **Uso de Disjunction para OR:** Para combinar restrições com `OR`, é necessário criar um objeto `Disjunction` e adicionar restrições individuais a ele.
- **Legibilidade:** Embora essa abordagem seja direta, ela ainda pode se tornar complexa para consultas muito grandes ou dinâmicas. É importante manter a legibilidade e a organização do código.
- **Performance:** Semelhante ao uso de `Criterion`, as restrições devem ser aplicadas com cuidado para evitar impactos negativos na performance.
## Conclusão

As restrições do Hibernate Criteria API oferecem uma maneira flexível e poderosa de construir consultas complexas de banco de dados de forma programática e segura em relação aos tipos de dados. Com a ampla gama de métodos de restrição disponíveis, é possível filtrar e refinar os resultados das consultas de muitas maneiras diferentes, atendendo a quase todos os requisitos de consulta que um aplicativo possa ter.