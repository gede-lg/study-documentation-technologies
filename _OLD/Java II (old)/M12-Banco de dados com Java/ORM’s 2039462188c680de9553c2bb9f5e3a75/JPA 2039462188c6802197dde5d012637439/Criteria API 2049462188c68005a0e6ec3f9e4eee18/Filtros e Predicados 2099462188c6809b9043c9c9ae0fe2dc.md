# Filtros e Predicados

---

## Introdução

O Criteria API do JPA (Java Persistence API) oferece um modo orientado a objetos e tipado de construir consultas dinâmicas. Em vez de escrever JPQL ou SQL como strings, utilizamos classes Java—especialmente `CriteriaBuilder`, `CriteriaQuery`, `Root` e `Predicate`—para definir filtros, ordenações e projeções.

Neste contexto, os **predicados** representam condições lógicas (por exemplo, comparações de campos, testes de nulo, combinações lógicas) que, usados em `where`, restringem quais registros serão retornados. O uso de predicados melhora a legibilidade, reduz erros de sintaxe e ajuda o compilador/IDE a sugerir correções e refatorações.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    
    2.1. Obtendo um `CriteriaBuilder` e `CriteriaQuery`
    
    2.2. Criando `Root` e Metamodel
    
    2.3. Construtores de Predicados (`cb.equal`, `cb.like`, `cb.greaterThan`, etc.)
    
    2.4. Combinação de Predicados (`cb.and`, `cb.or`)
    
    2.5. Predicados para Nulos (`cb.isNull`, `cb.isNotNull`)
    
    2.6. Aplicando Predicados em `where`
    
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 1. Conceitos Fundamentais

- **CriteriaBuilder (`cb`)**
    
    Classe responsável por criar instâncias de `Predicate`, expressões (`Expression<T>`), ordenações (`Order`), funções agregadas etc. Geralmente obtido a partir de `EntityManager#getCriteriaBuilder()`.
    
- **CriteriaQuery**
    
    Representa a consulta propriamente dita, parametrizada pelo tipo de retorno (`T`). É construído por meio do `CriteriaBuilder`.
    
- **Root**
    
    Representa a raiz (a entidade) da consulta. É usado para referenciar atributos da entidade no momento de criar predicados ou projeções.
    
- **Predicate**
    
    Interface que encapsula uma condição booleana. Vários métodos de `CriteriaBuilder` retornam implementações de `Predicate`.
    
- **Where**
    
    Método em `CriteriaQuery` que recebe um ou vários `Predicate` e monta a cláusula `WHERE`. Pode receber também um array ou lista de predicados, que serão combinados implicitamente com `AND`.
    
- **Por que usar predicados?**
    1. **Tipagem**: evitamos erros de sintaxe em string.
    2. **Dinamismo**: é fácil montar consultas em tempo de execução, inclusive adicionando ou removendo condições conforme parâmetros de entrada.
    3. **Legibilidade**: estruturas Java claras indicam exatamente quais colunas e condições estão envolvidas.
    4. **Manutenção**: IDEs conseguem refatorar nomes de atributos de entidades, evitando “magic strings”.

---

## 2. Sintaxe Detalhada e Uso Prático

A seguir, descrevemos passo a passo como construir uma consulta com filtros usando Predicados.

### 2.1. Obtendo um `CriteriaBuilder` e `CriteriaQuery`

```java
// 1. Inicie obtendo o EntityManager
EntityManager em = ...; // injeção ou criação via EntityManagerFactory

// 2. Obtenha o CriteriaBuilder
CriteriaBuilder cb = em.getCriteriaBuilder();

// 3. Crie um CriteriaQuery para o tipo de retorno desejado, por exemplo, Pessoa
CriteriaQuery<Pessoa> cq = cb.createQuery(Pessoa.class);

```

- **Comentário:**
    - `em.getCriteriaBuilder()` retorna o construtor de expressões.
    - `cb.createQuery(Pessoa.class)` configura que a consulta vai retornar instâncias de `Pessoa`.

### 2.2. Criando `Root` e Metamodel

```java
// 4. Defina a raiz da consulta, apontando para a entidade Pessoa
Root<Pessoa> root = cq.from(Pessoa.class);

```

- **Comentário:**
    - `Root<Pessoa> root` serve para referenciar atributos da entidade, ex.: `root.get("nome")` ou `root.get(Pessoa_.nome)` se usando Metamodel.

### 2.3. Construtores de Predicados

### `cb.equal(...)`

Usado para comparar igualdade exata.

```java
// Exemplo: WHERE p.nome = 'João'
Predicate predNomeIgual = cb.equal(root.get("nome"), "João");

```

- `cb.equal(Expression<?> x, Object y)`:
    - `x`: expressão que representa um atributo (por exemplo, `root.get("nome")`).
    - `y`: valor a ser comparado.
    - Retorna um `Predicate` que avalia `x = y`.

### `cb.like(...)`

Usado para correspondência de padrões em colunas de texto.

```java
// Exemplo: WHERE p.email LIKE '%@exemplo.com'
Predicate predEmailLike = cb.like(root.get("email"), "%@exemplo.com");

```

- `cb.like(Expression<String> x, String pattern)`:
    - `x`: atributo tipo `String`.
    - `pattern`: padrão que pode conter `%` (qualquer número de caracteres) ou `_` (um caractere).

### `cb.greaterThan(...)` e `cb.lessThan(...)`

Permitem comparações em atributos comparáveis (por exemplo, números, datas).

```java
// Exemplo: WHERE p.idade > 18
Predicate predMaiorIdade = cb.greaterThan(root.get("idade"), 18);

// Exemplo: WHERE p.dataNascimento < 01-jan-2000
Predicate predNascimentoAntigo = cb.lessThan(
    root.get("dataNascimento"),
    LocalDate.of(2000, 1, 1)
);

```

- `cb.greaterThan(Expression<? extends Comparable> x, Comparable y)`:
    - Compara se `x > y`.
- `cb.lessThan(Expression<? extends Comparable> x, Comparable y)`:
    - Compara se `x < y`.

### Outros Construtores Comuns

- `cb.lessThanOrEqualTo(...)`
- `cb.greaterThanOrEqualTo(...)`
- `cb.notEqual(...)`
- `cb.like(...)` *(já citado)*
- `cb.notLike(...)`

> Observação:
> 
> 
> Ao usar tipos numéricos, é possível precisar converter `Integer` para `Expression<Integer>`. Com metamodel, fica mais seguro: `root.get(Pessoa_.idade)`.
> 

### 2.4. Combinação de Predicados: `cb.and` e `cb.or`

### `cb.and(...)`

Combina dois ou mais predicados com “E” lógico.

```java
// Exemplo: WHERE p.ativo = true AND p.idade > 18
Predicate predAtivo = cb.equal(root.get("ativo"), true);
Predicate predMaior18 = cb.greaterThan(root.get("idade"), 18);

Predicate predCombinadoAnd = cb.and(predAtivo, predMaior18);

```

- `cb.and(Predicate... restrictions)`:
    - Recebe um array (ou varargs) de `Predicate`.
    - Retorna um novo `Predicate` que será verdadeiro somente se todos os internares forem verdadeiros.

### `cb.or(...)`

Combina dois ou mais predicados com “OU” lógico.

```java
// Exemplo: WHERE p.cidade = 'Rio' OR p.cidade = 'São Paulo'
Predicate predCidadeRio = cb.equal(root.get("cidade"), "Rio");
Predicate predCidadeSP  = cb.equal(root.get("cidade"), "São Paulo");

Predicate predCombinadoOr = cb.or(predCidadeRio, predCidadeSP);

```

- `cb.or(Predicate... restrictions)`:
    - Retorna verdadeiro se pelo menos um dos internares for verdadeiro.

### 2.5. Predicados para Atributos Nulos: `cb.isNull`, `cb.isNotNull`

### `cb.isNull(...)`

Testa se um atributo é `NULL`.

```java
// Exemplo: WHERE p.telefone IS NULL
Predicate predTelefoneNulo = cb.isNull(root.get("telefone"));

```

### `cb.isNotNull(...)`

Testa se um atributo **não** é `NULL`.

```java
// Exemplo: WHERE p.endereco IS NOT NULL
Predicate predEnderecoNaoNulo = cb.isNotNull(root.get("endereco"));

```

### 2.6. Aplicando Predicados em `where`

Depois de criar um ou mais `Predicate`, usamos `cq.where(...)`:

```java
// Exemplo completo: WHERE p.ativo = true AND p.idade > 18
cq.select(root)  // define seleção: toda a entidade Pessoa
  .where(cb.and(predAtivo, predMaior18));  // aplica filtro

List<Pessoa> resultados = em.createQuery(cq).getResultList();

```

- **Observações:**
    - Você pode chamar `cq.where(Predicate...)` uma vez. Se precisar trocar ou incluir mais condições dinamicamente, acumule predicados em uma `List<Predicate>` e depois faça `.where(lista.toArray(new Predicate[0]))`.
    - Caso haja múltiplas chamadas a `cq.where(...)`, a última sobrescreve as anteriores (não faz append).

---

## 3. Cenários de Restrição ou Não Aplicação

1. **Consultas Extremamente Simples**
    - Para operações triviais (por exemplo, buscar tudo de uma tabela sem filtro ou com único filtro estático), escrever JPQL direto ou usar métodos `findByXxx` do Spring Data JPA pode ser mais sucinto.
2. **Performance em Consultas Complexas**
    - O Criteria API pode gerar consultas bastante verbosas caso haja muitas junções (`join`), subqueries ou agregações. Em cenários muito complexos, às vezes é preferível escrever uma consulta nativa SQL afinada manualmente, para aproveitar hints de otimização.
3. **Manutenção de Strings Dinâmicas Pequenas**
    - Se a variável principal for apenas adicionar uma cláusula simples a uma JPQL existente, concatenar string + parâmetro pode ser mais rápido de implementar, apesar de ser menos seguro.
4. **Quando Usar Metamodel vs. Strings**
    - Para máxima segurança de refatoração, use Metamodel gerado. Porém, exige configuração extra no build (geração de classes `.java` em `target`). Em projetos menores, pode-se preferir usar `root.get("nomeDoAtributo")`, desde que se cuide manualmente dos nomes de campo.

---

## 4. Componentes Chave Associados

1. **`EntityManager`**
    - Ponto de entrada do JPA.
    - Responsável por criar o `CriteriaBuilder` e executar a `TypedQuery`.
2. **`CriteriaBuilder`**
    - Fornece métodos para construir expressões:
        - Comparações: `equal`, `notEqual`, `greaterThan`, `lessThan`, etc.
        - Testes de nulo: `isNull`, `isNotNull`.
        - Correspondência de padrões: `like`, `notLike`.
        - Junções: `join` (para relacionamentos).
        - Ordenações: `asc`, `desc`.
        - Agregações: `sum`, `avg`, `count`, etc.
3. **`CriteriaQuery<T>`**
    - Corresponde a toda a consulta.
    - Métodos principais:
        - `select(...)` para projeção.
        - `from(...)` para definir raízes.
        - `where(...)` para aplicar condições (predicados).
        - `orderBy(...)` para ordenar resultados.
4. **`Root<T>`**
    - Representa a referência à entidade principal na consulta.
    - Usado para acessar atributos: `root.get("campo")` ou `root.get(Entity_.campo)`.
5. **`Predicate`**
    - Representa condições lógicas.
    - Pode ser combinado via `cb.and(...)`, `cb.or(...)`, `cb.not(...)`.
    - Ex.: `Predicate p = cb.equal(root.get("nome"), "Maria");`
6. **`Expression<T>`**
    - Interface que representa qualquer expressão de consulta (atributo, função agregada, subselect, etc.).
7. **`Join<X, Y>`**
    - Representa junções entre entidades. Ex.: `root.join("departamento", JoinType.INNER)`.
    - Permite criar predicados nos campos de relacionamentos:
        
        ```java
        Join<Pessoa, Departamento> dept = root.join("departamento", JoinType.INNER);
        Predicate predDept = cb.equal(dept.get("nome"), "Recursos Humanos");
        
        ```
        
8. **Classes de Metamodel (Opcional)**
    - Geradas automaticamente (e.g., `Pessoa_.nome`, `Pessoa_.idade`).
    - Proporcionam segurança de compilação ao referenciar atributos de entidades.

---

## 5. Melhores Práticas e Padrões de Uso

1. **Acumular Predicados em Listas**
    - Para consultas dinâmicas (onde filtros variam conforme parâmetros do usuário), crie `List<Predicate> predicates = new ArrayList<>();`.
    - Para cada parâmetro não nulo, adicione um predicado:
        
        ```java
        if (filtro.getNome() != null) {
            predicates.add(cb.equal(root.get("nome"), filtro.getNome()));
        }
        if (filtro.getIdadeMinima() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("idade"), filtro.getIdadeMinima()));
        }
        // ... outros filtros ...
        
        ```
        
    - Depois, aplique todos:
        
        ```java
        cq.where(predicates.toArray(new Predicate[0]));
        
        ```
        
2. **Usar Metamodel para Segurança de Refatoração**
    - Em vez de `root.get("nome")`, use `root.get(Pessoa_.nome)` (requer gerar classes de metamodel no build).
    - Garante que, ao renomear atributo, o código falhe em compilação, evitando erros em tempo de execução.
3. **Evitar Predicados Redundantes**
    - Não crie predicados “sempre verdadeiros” caso o parâmetro venha nulo. Prefira só adicionar quando válido.
    - Ex.: Se `filtro.getCidade() == null`, ignore; senão, adicione `predicates.add(cb.equal(root.get("cidade"), filtro.getCidade()));`.
4. **Limitar Joins Desnecessários**
    - Toda vez que usar `root.join(...)`, gera `INNER JOIN` ou `LEFT JOIN`. Se não há necessidade de filtrar por atributos do relacionamento, evite join, pois pode piorar o desempenho.
5. **Combinar `and` e `or` com Cuidado**
    - Cuidado ao misturar `and` e `or` sem parênteses/agrupamentos adequados. Para filtros mais complexos, crie `Predicate predA = ...; Predicate predB = ...; Predicate agrupado = cb.and(predA, cb.or(predB, predC));`.
6. **Reusar Métodos para Predicados Comuns**
    - Caso sua aplicação use frequentemente critérios similares (por exemplo, filtrar por status “ativo”), crie um método utilitário:
        
        ```java
        private Predicate predAtivo(CriteriaBuilder cb, Root<T> root) {
            return cb.equal(root.get("ativo"), true);
        }
        
        ```
        
    - Aumenta consistência e fácil manutenção.
7. **Paginação e Ordenação**
    - Ao retornar muitos registros, combine predicados com paginação (`setFirstResult`, `setMaxResults`) e ordenação (`cq.orderBy(cb.asc(root.get("nome")))`) para melhorar performance.

---

## 6. Exemplo Prático Completo

Suponhamos uma entidade `Pessoa` com atributos básicos:

```java
@Entity
public class Pessoa {
    @Id @GeneratedValue
    private Long id;

    private String nome;

    private String email;

    private Integer idade;

    private Boolean ativo;

    private LocalDate dataNascimento;

    // getters e setters omitidos para brevidade
}

```

Queremos montar um método que retorne as pessoas que atendam a estes filtros opcionais:

- `nome` exato ou `nome` contendo substring;
- faixa de idade (entre `idadeMin` e `idadeMax`);
- `ativo = true`;
- `dataNascimento` não nulo.

### Passo a passo

```java
public List<Pessoa> buscarPessoasComFiltros(
        String nomeExato,
        String nomeContendo,
        Integer idadeMin,
        Integer idadeMax
) {
    // 1. Obter EntityManager e CriteriaBuilder
    EntityManager em = /* obtem via injeção ou fábrica */;
    CriteriaBuilder cb = em.getCriteriaBuilder();

    // 2. Criar CriteriaQuery e Root
    CriteriaQuery<Pessoa> cq = cb.createQuery(Pessoa.class);
    Root<Pessoa> root = cq.from(Pessoa.class);

    // 3. List para acumular predicados
    List<Predicate> predicates = new ArrayList<>();

    // 4. Filtro: nomeExato
    if (nomeExato != null && !nomeExato.isBlank()) {
        // p.nome = :nomeExato
        predicates.add(cb.equal(root.get("nome"), nomeExato));
    }

    // 5. Filtro: nomeConteúdo (LIKE)
    if (nomeContendo != null && !nomeContendo.isBlank()) {
        // p.nome LIKE %nomeContendo%
        predicates.add(cb.like(root.get("nome"), "%" + nomeContendo + "%"));
    }

    // 6. Filtro: faixa de idade
    if (idadeMin != null) {
        // p.idade >= idadeMin
        predicates.add(cb.greaterThanOrEqualTo(root.get("idade"), idadeMin));
    }
    if (idadeMax != null) {
        // p.idade <= idadeMax
        predicates.add(cb.lessThanOrEqualTo(root.get("idade"), idadeMax));
    }

    // 7. Filtro: somente ativos
    predicates.add(cb.equal(root.get("ativo"), true));

    // 8. Filtro: dataNascimento não nulo
    predicates.add(cb.isNotNull(root.get("dataNascimento")));

    // 9. Aplicar todos os predicados
    cq.select(root)
      .where(predicates.toArray(new Predicate[0]));

    // 10. Ordenar por nome ASC
    cq.orderBy(cb.asc(root.get("nome")));

    // 11. Executar consulta
    TypedQuery<Pessoa> query = em.createQuery(cq);

    // 12. (Opcional) Paginação
    // query.setFirstResult(0);
    // query.setMaxResults(50);

    return query.getResultList();
}

```

**Explicações detalhadas do trecho acima:**

1. **EntityManager e CriteriaBuilder:**
    - O `EntityManager` gerencia o contexto de persistência.
    - `cb` habilita a criação de predicados e expressões.
2. **Criar `CriteriaQuery<Pessoa>`:**
    - Define que a consulta retornará objetos do tipo `Pessoa`.
3. **Definir `Root<Pessoa> root`:**
    - `root` representa a tabela “pessoa” no SQL gerado.
    - Permite `root.get("atributo")` para referenciar colunas.
4. **Acumular Predicados em `List<Predicate>`:**
    - A cada parâmetro válido (não nulo ou não vazio), criamos um `Predicate` e adicionamos à lista.
    - Assim, podemos lidar dinamicamente com filtros opcionais.
5. **Predicados Individuais:**
    - `cb.equal(root.get("nome"), nomeExato)`: igualdade exata.
    - `cb.like(root.get("nome"), "%"+nomeContendo+"%")`: correspondência parcial.
    - `cb.greaterThanOrEqualTo(root.get("idade"), idadeMin)`: maior ou igual.
    - `cb.lessThanOrEqualTo(root.get("idade"), idadeMax)`: menor ou igual.
    - `cb.equal(root.get("ativo"), true)`: booleano.
    - `cb.isNotNull(root.get("dataNascimento"))`: filtrar apenas quem preenchido.
6. **Aplicar `where(...)`:**
    - `cq.where(predicates.toArray(new Predicate[0]))` converte a lista em array de `Predicate`.
    - Todos combinados implicitamente com `AND`.
7. **Ordenação:**
    - `cq.orderBy(cb.asc(root.get("nome")))` gera `ORDER BY nome ASC`.
8. **Execução:**
    - `em.createQuery(cq).getResultList()` gera e executa o SQL, retornando lista de `Pessoa`.

---

## 7. Sugestões para Aprofundamento

1. **Metamodel Generator**
    - Configurar `hibernate-jpamodelgen` para gerar classes estáticas (`Pessoa_`) e usar `root.get(Pessoa_.nome)` ao invés de `root.get("nome")`.
2. **Subqueries no Criteria API**
    - Aprender a criar `Subquery<T>` para cenários onde precisamos de condições baseadas em consultas internas.
3. **Uso de Joins e Fetch Joins**
    - Entender `root.join("atributoRelacionamento", JoinType.LEFT)` para filtrar ou carregar relacionamentos.
4. **Agrupamentos e Funções Agregadas**
    - Estudar `cb.count`, `cb.sum`, `cq.groupBy(...)`, `cq.having(...)` para relatórios e estatísticas.
5. **CriteriaUpdate e CriteriaDelete**
    - Além de `CriteriaQuery`, existem APIs específicas para `UPDATE` e `DELETE` em massa, que também usam predicados para definir quais registros serão afetados.
6. **Converter `CriteriaQuery` em `Specification` (Spring Data JPA)**
    - Se estiver usando Spring Data, aprender a transformar lógica de predicados em `Specification<T>` para usar diretamente em `JpaSpecificationExecutor`.

---

**Conclusão**

O uso de **Filtros e Predicados** no Criteria API do JPA confere segurança de tipagem, flexibilidade e legibilidade ao construir consultas dinâmicas. A combinação de métodos como `cb.equal`, `cb.like`, `cb.greaterThan` e operadores lógicos `cb.and`/`cb.or` permite expressar praticamente qualquer condição de `WHERE`. Entretanto, em casos muito simples ou extremamente complexos, pode ser preferível usar JPQL direto ou consultas nativas. Seguindo boas práticas—como acumular predicados em listas, usar Metamodel e evitar joins desnecessários—você garante um código limpo, eficiente e fácil de manter.