# Ordenação e Projeções

---

## 1. Título da Explicação

**Ordenação e Projeções no JPA: `orderBy`, seleções de colunas simples e complexas com `cb.construct` e `CriteriaQuery.multiselect`**

---

## 2. Introdução

A Java Persistence API (JPA) fornece duas formas principais de construir consultas ao banco de dados:

1. **JPQL (Java Persistence Query Language)**, que é uma linguagem de consulta orientada a objetos baseada em strings.
2. **Criteria API**, que é uma API fortemente tipada e programática para gerar consultas.

Nesta explicação, vamos nos concentrar nos aspectos de **ordenar resultados** (`orderBy`) e **projeções** (selecionar apenas determinados atributos), utilizando a **Criteria API** do JPA. Cobriremos desde conceitos básicos até exemplos práticos de projeções simples (colunas específicas) e projeções de DTOs complexos (usando `cb.construct` ou `multiselect`), incluindo orientações de melhores práticas e cenários em que não é recomendado aplicar essas técnicas.

---

## 3. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. [3.1. Preparando o Ambiente](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#31-preparando-o-ambiente)
    2. [3.2. Ordenação com `orderBy`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#32-ordena%C3%A7%C3%A3o-com-orderby)
    3. [3.3. Projeções Simples (seleção de colunas)](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#33-proje%C3%A7%C3%B5es-simples-sele%C3%A7%C3%A3o-de-colunas)
    4. [3.4. Projeções Complexas com `cb.construct`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#34-proje%C3%A7%C3%B5es-complexas-com-cbconstruct)
    5. [3.5. Projeções com `multiselect`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#35-proje%C3%A7%C3%B5es-com-multiselect)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes-Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 4. Conceitos Fundamentais

Antes de mergulhar na sintaxe, é importante entender o **propósito** e as **implicações** de ordenar e projetar resultados no contexto do JPA.

1. **Ordenação (`orderBy`)**
    - Serve para especificar explicitamente em qual ordem os resultados devem ser retornados.
    - Pode ser ascendente (`ASC`) ou descendente (`DESC`).
    - Em consultas nat̃ivas ou JPQL, usa-se a cláusula `ORDER BY`. Na Criteria API, isso é representado pelo método `criteriaQuery.orderBy(...)`.
    - **Por que é importante?**
        - Em relatórios, tabelas paginadas e interfaces de usuário, é comum que o usuário espere ver dados em ordem alfabética, cronológica ou numérica.
        - Sem `orderBy`, a ordem de retorno depende do plano de execução do banco de dados, que pode variar.
2. **Projeções (seleção de colunas)**
    - **O que é?** Em vez de buscar entidades completas (todos os atributos mapeados), podemos selecionar apenas atributos específicos (p. ex., somente nome e salário de um funcionário).
    - **Por que usar?**
        - **Desempenho**: reduzir o volume de dados trafegados da base para a aplicação.
        - **Encapsulamento**: trazer apenas o que é necessário para uma tela ou relatório, sem expor atributos sensíveis.
    - **Como fazer?**
        - **Projeção simples**: selecionar um ou poucos atributos de forma direta.
        - **Projeção em DTO**: montar objetos de transferência (Data Transfer Objects) diretamente no momento da consulta, usando `cb.construct(DTO.class, ...)` ou `CriteriaQuery.multiselect(...)`, para mapear resultados em uma classe “mais enxuta” que não seja a entidade gerenciada.
3. **Critérios de Avaliação**
    - Quando projetamos colunas, retornamos algo que não é gerenciado como uma entidade JPA (a menos que se projete a própria entidade).
    - Consultas com projeção não permitem operações de escrita diretas sobre os resultados (já que normalmente são DTOs ou arrays de valores).
    - Consultas com muitas colunas (sem filtragem) podem não trazer ganhos de performance, pois a transferência de dados continua “pesada”.

---

## 5. Sintaxe Detalhada e Uso Prático

### 3.1. Preparando o Ambiente

Antes de começar, considere que temos uma **entidade** simples chamada `Funcionario`:

```java
@Entity
@Table(name = "funcionario")
public class Funcionario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String cargo;

    private BigDecimal salario;

    @Column(name = "data_admissao")
    private LocalDate dataAdmissao;

    // Getters, Setters, Construtores, equals/hashCode etc.
}

```

E um **DTO** para projetar apenas alguns campos:

```java
public class FuncionarioDTO {
    private String nome;
    private String cargo;
    private BigDecimal salario;

    // Construtor usado pela Criteria API:
    public FuncionarioDTO(String nome, String cargo, BigDecimal salario) {
        this.nome = nome;
        this.cargo = cargo;
        this.salario = salario;
    }

    // Getters, Setters (opcional)
}

```

Suponha que tenhamos um `EntityManager` disponível:

```java
@PersistenceContext
private EntityManager em;

```

---

### 3.2. Ordenação com `orderBy`

### 3.2.1. Construindo um CriteriaQuery básico

1. Obtenha um `CriteriaBuilder`:
    
    ```java
    CriteriaBuilder cb = em.getCriteriaBuilder();
    
    ```
    
2. Crie um `CriteriaQuery<Funcionario>`:
    
    ```java
    CriteriaQuery<Funcionario> cq = cb.createQuery(Funcionario.class);
    
    ```
    
3. Defina a raiz da consulta (FROM):
    
    ```java
    Root<Funcionario> root = cq.from(Funcionario.class);
    
    ```
    
4. Opcionalmente, adicione parâmetros (WHERE), junções (JOIN), etc.

### 3.2.2. Aplicando `orderBy` ascendente

Para ordenar pelo nome em ordem alfabética crescente:

```java
cq.select(root)
  .orderBy(cb.asc(root.get("nome")));

```

- `root.get("nome")` retorna um `Path<String>` para o atributo `nome`.
- `cb.asc(...)` gera um objeto `Order` que representa ordem ascendente.

### 3.2.3. Aplicando `orderBy` descendente

Para ordenar por salário em ordem decrescente:

```java
cq.select(root)
  .orderBy(cb.desc(root.get("salario")));

```

- `cb.desc(...)` indica ordem decrescente.

### 3.2.4. Múltiplas colunas em `orderBy`

Para ordenar, primeiro por `cargo` ascendendo e depois por `dataAdmissao` descendendo:

```java
cq.select(root)
  .orderBy(
    cb.asc(root.get("cargo")),
    cb.desc(root.get("dataAdmissao"))
  );

```

- A lista de `Order` é aplicada sequencialmente: primeiro compara cargos, se iguais, compara datas de admissão.

### 3.2.5. Executando a Query

Após construir a consulta:

```java
TypedQuery<Funcionario> query = em.createQuery(cq);
List<Funcionario> listaOrdenada = query.getResultList();

```

Agora `listaOrdenada` vem ordenada conforme especificado.

---

### 3.3. Projeções Simples (seleção de colunas)

Quando precisamos só de alguns atributos, por exemplo `nome` e `salario`, e não toda a entidade, podemos usar:

### 3.3.1. Retornando um `Tuple`

1. Crie um `CriteriaQuery<Tuple>`:
    
    ```java
    CriteriaQuery<Tuple> cq = cb.createTupleQuery();
    
    ```
    
2. Defina a raiz (`FROM`):
    
    ```java
    Root<Funcionario> root = cq.from(Funcionario.class);
    
    ```
    
3. Faça a seleção das colunas desejadas:
    
    ```java
    cq.select(cb.tuple(
        root.get("nome").alias("nome"),
        root.get("salario").alias("salario")
    ));
    
    ```
    
    - `cb.tuple(...)` agrupa múltiplos atributos em um `Tuple`.
    - `.alias("...")` dá nome à coluna no `Tuple`.
4. (Opcional) Ordene:
    
    ```java
    cq.orderBy(cb.desc(root.get("salario")));
    
    ```
    
5. Execute:
    
    ```java
    List<Tuple> resultados = em.createQuery(cq).getResultList();
    
    ```
    
6. Percorra os resultados:
    
    ```java
    for (Tuple t : resultados) {
        String nome = t.get("nome", String.class);
        BigDecimal salario = t.get("salario", BigDecimal.class);
        // use os valores...
    }
    
    ```
    

### 3.3.2. Retornando `Object[]`

Outra abordagem “menos tipada” é usar `multiselect` diretamente sem DTO:

```java
CriteriaQuery<Object[]> cq = cb.createQuery(Object[].class);
Root<Funcionario> root = cq.from(Funcionario.class);

cq.multiselect(
    root.get("nome"),
    root.get("salario")
).orderBy(cb.asc(root.get("nome")));

List<Object[]> lista = em.createQuery(cq).getResultList();
for (Object[] arr : lista) {
    String nome = (String) arr[0];
    BigDecimal salario = (BigDecimal) arr[1];
    // use os valores...
}

```

- Retorna cada linha como um array de `Object`, onde índice 0 é `nome` e índice 1 é `salario`.

---

### 3.4. Projeções Complexas com `cb.construct`

Se quisermos retornar **instâncias de DTOs customizados** em vez de tuplas ou arrays, podemos usar `cb.construct`. Isso projeta diretamente no construtor da classe alvo.

### 3.4.1. Configuração do DTO

Já definimos antes:

```java
public class FuncionarioDTO {
    private String nome;
    private String cargo;
    private BigDecimal salario;

    // Construtor usado na projeção:
    public FuncionarioDTO(String nome, String cargo, BigDecimal salario) {
        this.nome = nome;
        this.cargo = cargo;
        this.salario = salario;
    }
    // Getters (opcional para leitura)
}

```

### 3.4.2. Construindo a projeção no CriteriaQuery

1. Crie um `CriteriaQuery<FuncionarioDTO>`:
    
    ```java
    CriteriaQuery<FuncionarioDTO> cq = cb.createQuery(FuncionarioDTO.class);
    Root<Funcionario> root = cq.from(Funcionario.class);
    
    ```
    
2. Use `cb.construct(...)` para invocar o construtor do DTO:
    
    ```java
    cq.select(cb.construct(
        FuncionarioDTO.class,
        root.get("nome"),
        root.get("cargo"),
        root.get("salario")
    ));
    
    ```
    
    - Cada argumento do `construct` deve corresponder a um parâmetro do construtor em ordem e tipo.
3. (Opcional) Adicione filtros ou ordenação:
    
    ```java
    cq.where(cb.greaterThan(root.get("salario"), new BigDecimal("5000")))
      .orderBy(cb.desc(root.get("salario")));
    
    ```
    
4. Execute a query:
    
    ```java
    List<FuncionarioDTO> dtos = em.createQuery(cq).getResultList();
    
    ```
    
5. Agora `dtos` contém objetos já “populados” de `FuncionarioDTO`, sem necessidade de conversão manual.

---

### 3.5. Projeções com `multiselect`

Caso não queiramos usar `cb.construct` mas ainda desejar múltiplos campos projetados, podemos usar `CriteriaQuery.multiselect(...)` retornando instâncias de **`Object[]`**, ou mapear para um **`Tuple`** (já visto no item 3.3.1).

### 3.5.1. `multiselect` para retornar `Object[]`

```java
CriteriaQuery<Object[]> cq = cb.createQuery(Object[].class);
Root<Funcionario> root = cq.from(Funcionario.class);

cq.multiselect(
    root.get("nome"),
    root.get("cargo"),
    root.get("salario")
)
.orderBy(cb.desc(root.get("salario")));

TypedQuery<Object[]> query = em.createQuery(cq);
List<Object[]> lista = query.getResultList();

for (Object[] registro : lista) {
    String nome = (String) registro[0];
    String cargo = (String) registro[1];
    BigDecimal salario = (BigDecimal) registro[2];
    // ...
}

```

- Vantagem: simplicidade para cenários ad-hoc.
- Desvantagem: ausência de tipagem clara e, muitas vezes, conversão manual de índices.

### 3.5.2. `multiselect` mapeado para `Tuple`

```java
CriteriaQuery<Tuple> cq = cb.createTupleQuery();
Root<Funcionario> root = cq.from(Funcionario.class);

cq.multiselect(
    root.get("nome").alias("nome"),
    root.get("cargo").alias("cargo"),
    root.get("salario").alias("salario")
)
.orderBy(cb.asc(root.get("nome")));

List<Tuple> lista = em.createQuery(cq).getResultList();
for (Tuple t : lista) {
    String nome = t.get("nome", String.class);
    String cargo = t.get("cargo", String.class);
    BigDecimal salario = t.get("salario", BigDecimal.class);
    // ...
}

```

- O método `.alias("...")` permite recuperar pelo nome, sem depender de índice.

---

## 6. Cenários de Restrição ou Não Aplicação

1. **Persistência de Entidades**
    - Quando projetamos atributos — seja em DTO ou `Tuple`/`Object[]` — o resultado **não é uma entidade gerenciada**. Portanto, não se pode atualizar esse resultado direto no banco via `em.merge(...)` ou `persist`. Se for necessária modificação, precisa-se recarregar a entidade principal ou projetar a própria entidade completa (`cq.select(root)`).
2. **Consultas com Filtros Complexos de Relacionamento**
    - Algumas vezes, **ordenações** por atributos de entidades relacionadas exigem `JOIN`. Se não houver cuidado, pode ocorrer **multiplicação de linhas** no resultado (cartesiano).
    - Exemplo: ordenar `Funcionario` por `Departamento.nome` requer:
        
        ```java
        Join<Funcionario, Departamento> dept = root.join("departamento", JoinType.INNER);
        cq.orderBy(cb.asc(dept.get("nome")));
        
        ```
        
3. **Projeções de Muitos Campos**
    - Projetar **tudo** em um DTO pode se tornar tão pesado quanto retornar a entidade inteira. Se o DTO possui quase todos os campos (ou muitos relacionamentos), talvez não compense.
    - Em cenários de consultas ad-hoc, em que precisamos de apenas um ou dois campos, usar projetções faz muito sentido. Mas para relatórios com dezenas de colunas, avalie se é melhor usar **views de banco** ou relatórios fora do JPA.
4. **Limitações de Tipagem**
    - Projeções via `Object[]` são frágeis, pois `Object[]` é pouco tipado. Erros de índice ou cast só aparecem em tempo de execução.
    - Se precisar de segurança de tipo, preﬁra `cb.construct(DTO.class, ...)` ou `Tuple`.
5. **Uso de `cb.construct` em Construtores Sem Construtor Público Padrão**
    - Se o DTO não tiver um construtor que combine exatamente com os parâmetros ou não for público, a projeção falha.
    - É recomendável criar um **construtor público** no DTO exclusivamente para essa finalidade.

---

## 7. Componentes-Chave Associados

1. **`CriteriaBuilder (cb)`**
    - Fábrica de objetos para construir expressões de consulta (predicados, projeções, ordenações, agregações).
    - Métodos comuns:
        - `cb.createQuery(clazz)`: cria `CriteriaQuery<?>`.
        - `cb.asc(path)` / `cb.desc(path)`: gera ordenação.
        - `cb.construct(dtoClass, args...)`: monta projeção em DTO.
        - `cb.tuple(...)`: monta projeção em `Tuple`.
2. **`CriteriaQuery<T>`**
    - Representa a consulta tipada.
    - Métodos principais:
        - `select(...)`: define o que será retornado.
        - `from(entityClass)`: define o “FROM” e retorna um `Root<T>`.
        - `where(predicate...)`: adiciona cláusulas de filtro.
        - `orderBy(order1, order2, ...)`: adiciona ordenações.
        - `multiselect(selection1, selection2, ...)`: projeta diversas colunas sem DTO.
        - `distinct(boolean)`: para retornar resultados distintos.
3. **`Root<T>`**
    - Representa a entidade principal na cláusula `FROM`.
    - Métodos mais usados:
        - `root.get("atributo")`: retorna um `Path<X>` para acessar colunas simples.
        - `root.join("relacionamento", JoinType)`: para relacionamentos.
        - `root.fetch("relacionamento", JoinType)`: similar a join mas indica “fetch” imediato.
4. **`Path<X>`**
    - Representa um caminho para um atributo ou relacionamento, usado em expressões (filtros, projeções).
    - Exemplos:
        - `root.get("salario")`
        - `dept.get("nome")`
5. **`Predicate`**
    - Representa condição booleana (para `WHERE`).
    - Embora não seja foco desta explicação, geralmente é criado via `cb.equal(...)`, `cb.greaterThan(...)`, etc.
6. **`TypedQuery<T>` / `Query`**
    - Após montar o `CriteriaQuery`, obtém-se um `TypedQuery<T>` via `em.createQuery(cq)`.
    - Executa `getResultList()` ou `getSingleResult()`.
7. **DTO (Data Transfer Object)**
    - Classe simples, muitas vezes sem anotações JPA, usada apenas para receber resultados projetados.
    - Deve ter **construtor público** que combine exatamente com a sequência de atributos passados em `cb.construct`.

---

## 8. Melhores Práticas e Padrões de Uso

1. **Use Projeções em DTOs sempre que possível**
    - Se a sua aplicação precisa apenas de alguns campos, evite buscar a entidade completa.
    - DTOs desacoplam o modelo de persistência (entidades) das camadas superiores (serviço/UI).
2. **Prefira `cb.construct` a `Object[]` quando precisar de tipagem**
    - Evite `Object[]` em consultas de produção, pois a manutenção se torna frágil.
    - Com `cb.construct`, erros de tipos/mapeamento são detectados em tempo de compilação (ou falham na inicialização).
3. **Nomeie colunas no `Tuple` com `alias(...)`**
    - Quando usar `Tuple`, sempre faça `root.get("campo").alias("campo")`.
    - Isso facilita a leitura posterior: `tuple.get("campo", Tipo.class)` em vez de depender de índice `tuple.get(0)`.
4. **Evite projeções de relacionamentos complexos em laços grandes**
    - Ao projetar atributos de entidades relacionadas, prefira `JOIN FETCH` em consultas de entidade completa, para não gerar n+1.
    - Se só quer um atributo “profundamente aninhado” (ex.: `funcio.departamento.nome`), faça `root.join("departamento")` e projete esse campo direto.
5. **Ordenação e performance**
    - Se a coluna de ordenação não estiver indexada no banco, pode haver lentidão significativa.
    - Em grandes volumes, avalie paginar junto com o `orderBy` via `setFirstResult()` e `setMaxResults()` no `TypedQuery`.
6. **Documente seu DTO e Query**
    - Use comentários claros sobre quais campos e em qual ordem são projetados. Assim, futuros mantenedores não se perdem ao ajustar parâmetros.
7. **Consistência de nomes**
    - Mantenha nomes de atributos JPA e de DTO consistentes, quando possível. Isso simplifica projeções e uso de `alias`.

---

## 9. Exemplo Prático Completo

### 9.1. Cenário

Desejamos obter uma **lista de funcionários com salário acima de R$ 5.000,00**, ordenados por salário decrescente, mas **retornando apenas nome, cargo e salário** em um DTO.

### 9.2. Passo a Passo

1. **Entidade `Funcionario`**
    
    ```java
    @Entity
    @Table(name = "funcionario")
    public class Funcionario {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
    
        private String nome;
    
        private String cargo;
    
        private BigDecimal salario;
    
        @Column(name = "data_admissao")
        private LocalDate dataAdmissao;
    
        // Getters, Setters...
    }
    
    ```
    
2. **DTO `FuncionarioDTO`**
    
    ```java
    public class FuncionarioDTO {
        private String nome;
        private String cargo;
        private BigDecimal salario;
    
        public FuncionarioDTO(String nome, String cargo, BigDecimal salario) {
            this.nome = nome;
            this.cargo = cargo;
            this.salario = salario;
        }
    
        // Getters (para a camada de apresentação)
        public String getNome() {
            return nome;
        }
    
        public String getCargo() {
            return cargo;
        }
    
        public BigDecimal getSalario() {
            return salario;
        }
    }
    
    ```
    
3. **Implementação da Consulta no Repositório/DAO**
    
    ```java
    @Repository
    public class FuncionarioRepositoryCustom {
    
        @PersistenceContext
        private EntityManager em;
    
        /**
         * Obtém lista de FuncionarioDTO com salário > limiar,
         * ordenados por salário decrescente.
         */
        public List<FuncionarioDTO> buscarFuncionariosComSalarioAcima(BigDecimal limiar) {
            // 1. Obter CriteriaBuilder
            CriteriaBuilder cb = em.getCriteriaBuilder();
    
            // 2. Criar CriteriaQuery tipado para FuncionarioDTO
            CriteriaQuery<FuncionarioDTO> cq = cb.createQuery(FuncionarioDTO.class);
    
            // 3. Definir Root para Funcionario
            Root<Funcionario> root = cq.from(Funcionario.class);
    
            // 4. Construir predicado (WHERE salario > limiar)
            Predicate salarioMaiorQue = cb.greaterThan(root.get("salario"), limiar);
    
            // 5. Definir a projeção no DTO com cb.construct
            cq.select(cb.construct(
                    FuncionarioDTO.class,
                    root.get("nome"),
                    root.get("cargo"),
                    root.get("salario")
                ))
              .where(salarioMaiorQue)
              .orderBy(cb.desc(root.get("salario")));
    
            // 6. Criar TypedQuery e executar
            TypedQuery<FuncionarioDTO> query = em.createQuery(cq);
            return query.getResultList();
        }
    }
    
    ```
    
4. **Uso no Serviço**
    
    ```java
    @Service
    public class FuncionarioService {
    
        @Autowired
        private FuncionarioRepositoryCustom repoCustom;
    
        public void exibirRelatorioSalarios() {
            BigDecimal limiar = new BigDecimal("5000.00");
            List<FuncionarioDTO> lista = repoCustom.buscarFuncionariosComSalarioAcima(limiar);
    
            for (FuncionarioDTO dto : lista) {
                System.out.printf("Nome: %s | Cargo: %s | Salário: %s%n",
                    dto.getNome(), dto.getCargo(), dto.getSalario());
            }
        }
    }
    
    ```
    
5. **Explicação do Fluxo**
    - Primeiro, criamos o **`CriteriaBuilder`** para iniciar a construção.
    - Em seguida, instanciamos um **`CriteriaQuery<FuncionarioDTO>`**, sinalizando que o resultado será mapeado diretamente em `FuncionarioDTO`.
    - Definimos a raiz da consulta como `Root<Funcionario> root`, equivalente ao `FROM Funcionario f` em JPQL.
    - Criamos um **`Predicate`** para filtrar salários acima de um valor.
    - Usamos **`cb.construct(...)`** indicando a classe `FuncionarioDTO` e passando, na ordem correta, os atributos que correspondem ao construtor do DTO: `nome`, `cargo` e `salario`.
    - Adicionamos **`orderBy(cb.desc(root.get("salario")))`** para ordenar por salário decrescente.
    - Finalmente, geramos o `TypedQuery<FuncionarioDTO>` e executamos `getResultList()`.

---

## 10. Sugestões para Aprofundamento

1. **Documentação Oficial do JPA (Jakarta EE)**
    - [Jakarta Persistence 3.0 Specification](https://jakarta.ee/specifications/persistence/3.0/jakarta-persistence-spec-3.0.html)
    - Seções sobre Criteria API (capítulo “Criteria API”).
2. **Livros e Artigos**
    - *Pro JPA 2* (Mike Keith, Merrick Schincariol) – Capítulo dedicado à Criteria API e técnicas avançadas de projeção.
    - Artigos online como “[Criteria API: Guide to Complex Queries](https://www.thoughts-on-java.org/jpa-criteria-api-guide/)” que mostram consultas dinâmicas e projeções.
3. **Boas Práticas**
    - Evite usar Criteria API para consultas muito simples (JPQL string pode ser mais legível).
    - Use QueryDSL (biblioteca alternativa) caso queira DSL mais rica para consultas.
4. **Performance**
    - Compare planos de execução ao usar projeções versus entidades completas.
    - Investigue índices no banco de dados para colunas frequentemente usadas em `orderBy`.
5. **Testes Automatizados**
    - Escreva testes de integração que validem a ordem e a projeção esperada.
    - Ferramentas como Arquillian ou Spring Test facilitam testes de consultas JPA.

---

### Observação Final

Agora você tem uma visão completa de como **ordenar** resultados e **projetar** colunas simples ou complexas usando a **Criteria API do JPA**. Este material cobre desde a teoria até um exemplo prático de ponta a ponta, mostrando como retornar objetos de DTO utilizando `cb.construct` ou como obter tuplas/arrays de atributos com `multiselect`. Se precisar comparar com a abordagem de **JPQL string** equivalente, é possível expressar conceitos similares, mas a Criteria API traz a vantagem de verificação de tipos em tempo de compilação e construção dinâmica de consultas.

Caso tenha outras dúvidas específicas (por exemplo, projeções envolvendo funções agregadas, paginação combinada, ou junções mais complexas), basta pedir que aprofundaremos ainda mais.