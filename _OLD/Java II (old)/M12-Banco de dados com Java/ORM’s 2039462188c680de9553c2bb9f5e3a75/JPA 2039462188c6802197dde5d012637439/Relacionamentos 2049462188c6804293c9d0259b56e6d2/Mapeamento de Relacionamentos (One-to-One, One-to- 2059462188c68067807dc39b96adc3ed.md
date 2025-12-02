# Mapeamento de Relacionamentos (One-to-One, One-to-Many, Many-to-One e Many-to-Many)

---

## 1. Introdução

O Java Persistence API (JPA) é a especificação Java para o mapeamento de objetos Java a um banco de dados relacional (ORM). Dentro desse cenário, é fundamental modelar corretamente as relações entre entidades (classes Java) para refletir a estrutura de tabelas relacionadas no banco de dados. Neste material, abordaremos:

- **Tipos de relacionamento** suportados pelo JPA:
    - One-to-One
    - One-to-Many
    - Many-to-One
    - Many-to-Many
- Como usar as anotações apropriadas (`@OneToOne`, `@OneToMany`, `@ManyToOne`, `@ManyToMany`)
- Variações de sintaxe, atributos-chave (por exemplo, `mappedBy`, `joinColumn`, `joinTable`, `cascade`, `fetch`)
- Cenários de restrição ou quando não aplicar determinado tipo de relacionamento
- Componentes-chave envolvidos (anotações, atributos, entidades relacionadas)
- Boas práticas e padrões de uso (evitar problemas de desempenho e integridade)
- Um **exemplo prático completo**, que ilustra passo a passo um caso real de mapeamento de relacionamentos

O objetivo é fornecer uma explicação completa e detalhada, acompanhada de exemplos comentados, para que você possa aplicar os conceitos em projetos reais.

---

## 2. Sumário

1. [Conceitos Fundamentais](Mapeamento%20de%20Relacionamentos%20(One-to-One,%20One-to-%202059462188c68067807dc39b96adc3ed.md)
2. [Sintaxe Detalhada e Uso Prático](Mapeamento%20de%20Relacionamentos%20(One-to-One,%20One-to-%202059462188c68067807dc39b96adc3ed.md)
    1. One-to-One
    2. One-to-Many e Many-to-One
    3. Many-to-Many
3. [Cenários de Restrição ou Não Aplicação](Mapeamento%20de%20Relacionamentos%20(One-to-One,%20One-to-%202059462188c68067807dc39b96adc3ed.md)
4. [Componentes Chave Associados](Mapeamento%20de%20Relacionamentos%20(One-to-One,%20One-to-%202059462188c68067807dc39b96adc3ed.md)
5. [Melhores Práticas e Padrões de Uso](Mapeamento%20de%20Relacionamentos%20(One-to-One,%20One-to-%202059462188c68067807dc39b96adc3ed.md)
6. [Exemplo Prático Completo](Mapeamento%20de%20Relacionamentos%20(One-to-One,%20One-to-%202059462188c68067807dc39b96adc3ed.md)
7. [Sugestões para Aprofundamento](Mapeamento%20de%20Relacionamentos%20(One-to-One,%20One-to-%202059462188c68067807dc39b96adc3ed.md)

---

## 3. Conceitos Fundamentais

Antes de mergulharmos na sintaxe, é importante entender:

- **Objetivo do mapeamento de relacionamentos**: espelhar no nível de classes Java as associações que existem entre tabelas do banco relacional, garantindo integridade referencial e facilitando a navegação (navegabilidade bidirecional ou unidirecional).
- **Cardinalidade**: define quantas instâncias de uma entidade se relacionam com quantas instâncias de outra.
    - **One-to-One (1:1)**: cada registro de uma tabela “A” relaciona-se com exatamente um registro de tabela “B” e vice-versa.
    - **One-to-Many (1:N)** / **Many-to-One (N:1)**: um registro de “A” pode relacionar-se a vários registros de “B” (1:N), e cada registro de “B” está associado a uma única instância de “A” (N:1).
    - **Many-to-Many (N:N)**: múltiplos registros de “A” podem relacionar-se a vários registros de “B”, geralmente por meio de uma tabela de junção (join table).
- **Propriedades principais no JPA**:
    - **Anotação do lado “dono” (owning side)**: responsável por persistir a chave estrangeira (foreign key) no banco.
    - **Lado “inverso” (inverse side)**: complementa o relacionamento, geralmente utiliza `mappedBy` para apontar ao atributo que controla a associação.
    - **Atributos auxiliares**:
        - `mappedBy`: indica qual atributo no outro lado “possui” a relação (evita a criação de colunas extras).
        - `joinColumn` / `joinColumns`: define explicitamente o nome da coluna de chave estrangeira.
        - `joinTable`: especifica a tabela de junção e suas colunas quando há relacionamento N:N.
        - **`cascade`**: define operações em cascata (por exemplo, ao remover um pai, remover também os filhos).
        - **`fetch`**: controla a estratégia de carregamento (LAZY ou EAGER).

---

## 4. Sintaxe Detalhada e Uso Prático

A seguir, detalhamos cada tipo de relacionamento, apresentando sintaxe, variações de uso e exemplos comentados.

---

### 4.1 One-to-One

### 4.1.1 Definição

- **Cardinalidade**: 1 registro de A ↔ 1 registro de B.
- **Uso típico**: quando dois objetos em Java têm exatamente um-para-um, por exemplo:
    - `Pessoa` ↔ `Passaporte`
    - `Usuário` ↔ `Perfil`
    - `Endereço` ↔ `ContaBancária`

### 4.1.2 Exemplos de Sintaxe

### 1) Relacionamento *unidirecional* (A conhece B, B não conhece A)

```java
java
Copiar código
@Entity
@Table(name = "pessoa")
public class Pessoa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    // A "Pessoa" possui um "Passaporte"
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "passaporte_id", referencedColumnName = "id")
    private Passaporte passaporte;

    // getters e setters
}

```

```java
java
Copiar código
@Entity
@Table(name = "passaporte")
public class Passaporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numero;
    private Date dataEmissao;
    private Date dataValidade;

    // Note: Passaporte NÃO conhece Pessoa (unidirecional)
    // getters e setters
}

```

- **Explicação**:
    - `@OneToOne`: indica que uma instância de `Pessoa` está relacionada a uma instância de `Passaporte`.
    - `cascade = CascadeType.ALL`: operações em cascata (persist, merge, remove etc.) aplicadas ao passaporte quando afetamos a pessoa.
    - `fetch = FetchType.LAZY`: ao carregar `Pessoa`, o JPA só busca `Passaporte` quando acessamos `pessoa.getPassaporte()`.
    - `@JoinColumn(name = "passaporte_id", referencedColumnName = "id")`: cria, na tabela `pessoa`, uma coluna `passaporte_id` que referencia `passaporte.id`.

### 2) Relacionamento *bidirecional* (A conhece B e B conhece A)

```java
java
Copiar código
@Entity
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Perfil perfil;

    // getters e setters
}

```

```java
java
Copiar código
@Entity
@Table(name = "perfil")
public class Perfil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricao;

    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private Usuario usuario;

    // getters e setters
}

```

- **Explicação**:
    - Em `Perfil`, anotamos o relacionamento com `@OneToOne` e `@JoinColumn("usuario_id")` → **lado proprietário** (owning side).
    - Em `Usuario`, anotamos `@OneToOne(mappedBy = "usuario")` → **lado inverso** (não cria coluna extra), referenciando o campo `usuario` de `Perfil`.
    - Dessa forma, a FK (`usuario_id`) fica na tabela `perfil`.

### 4.1.3 Variações e Atributos Importantes

- **`cascade`**:
    - `ALL`, `PERSIST`, `MERGE`, `REMOVE`, etc.
    - Exemplo: `cascade = {CascadeType.PERSIST, CascadeType.MERGE}` para semântica mais restrita.
- **`fetch`**:
    - `FetchType.LAZY` (recomendado para prevenir EAGER loading de objetos grandes).
    - `FetchType.EAGER` (EAGER faz join automático ao buscar a entidade pai).
- **`optional`** (default = `true`): se `false`, evita NPE e garante não-nulo → cria DDL com `NOT NULL` na FK. Exemplo: `@OneToOne(optional = false)`.
- **`orphanRemoval = true`**: remove a entidade “filha” quando dissociada.

---

### 4.2 One-to-Many e Many-to-One

### 4.2.1 Definição

- **One-to-Many (1:N)**: 1 registro de “A” relaciona-se a N registros de “B”.
- **Many-to-One (N:1)**: N registros de “B” apontam para 1 registro de “A”.
- **Uso típico**:
    - `Departamento` (1) ↔ `Funcionário` (N)
    - `Categoria` (1) ↔ `Produto` (N)
    - `Autor` (1) ↔ `Livro` (N)

> Observação: Em JPA, definimos @ManyToOne no “lado N” (entidade “filha”, que carrega a FK). O “lado 1” pode ter @OneToMany(mappedBy = ...), que representa a coleção de registros “filhos”.
> 

### 4.2.2 Exemplos de Sintaxe

### 1) Relacionamento *unidirecional* (apenas ManyToOne)

```java
java
Copiar código
@Entity
@Table(name = "funcionario")
public class Funcionario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    // Lado N (filho) possui a FK de Departamento
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "departamento_id", referencedColumnName = "id")
    private Departamento departamento;

    // getters e setters
}

```

```java
java
Copiar código
@Entity
@Table(name = "departamento")
public class Departamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    // Note: sem referência a Funcionario (unidirecional)
    // getters e setters
}

```

- **Explicação**:
    - `Funcionario` é o “lado N” (many). Anotado com `@ManyToOne` e `@JoinColumn("departamento_id")`.
    - `Departamento` não conhece `Funcionario` (não há coleção), pois é unidirecional.

### 2) Relacionamento *bidirecional* (OneToMany + ManyToOne)

```java
java
Copiar código
@Entity
@Table(name = "departamento")
public class Departamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    // Lado 1 tem a coleção de funcionários
    @OneToMany(mappedBy = "departamento", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Funcionario> funcionarios = new ArrayList<>();

    // Construtor, getters e setters

    public void adicionarFuncionario(Funcionario f) {
        funcionarios.add(f);
        f.setDepartamento(this);
    }

    public void removerFuncionario(Funcionario f) {
        funcionarios.remove(f);
        f.setDepartamento(null);
    }
}

```

```java
java
Copiar código
@Entity
@Table(name = "funcionario")
public class Funcionario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    // Lado N (filho) apontando para Departamento
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departamento_id", referencedColumnName = "id", nullable = false)
    private Departamento departamento;

    // Construtor, getters e setters
}

```

- **Explicação**:
    - Em `Departamento`, `@OneToMany(mappedBy = "departamento")` → “lado inverso” da relação. `mappedBy` aponta ao atributo `departamento` em `Funcionario`.
    - `cascade = CascadeType.ALL`: ao persistir/deletar “Departamento”, afeta também a lista de funcionários.
    - `orphanRemoval = true`: se remover um `Funcionario` da lista sem reaponto, a linha vinculada é deletada do banco.
    - Os métodos utilitários `adicionarFuncionario` e `removerFuncionario` garantem consistência de ambos os lados na memória.

### 4.2.3 Variações e Atributos Importantes

- **`mappedBy`**: Essencial para evitar criação de tabela intermediária ou colunas duplicadas no banco.
- **`cascade`**:
    - Com `CascadeType.REMOVE`, ao deletar “1” -> remove “N”.
    - Cuidado: operações em cascata podem deletar registros inesperados (use `orphanRemoval` ou cascades específicos).
- **`fetch`**:
    - Padrão: `@ManyToOne` é `EAGER` (carrega imediatamente). Geralmente, configura-se para `LAZY` para otimizar consultas.
    - `@OneToMany` é `LAZY` por padrão.
- **`orphanRemoval`**: útil para garantir que itens “órfãos” não permaneçam no banco.
- **Coleção**:
    - Tipos aceitos: `List`, `Set`, `Collection` (adapte conforme necessidade de ordenação e duplicatas).
    - Prefira `Set` se não desejar duplicatas.

---

### 4.3 Many-to-Many

### 4.3.1 Definição

- **Many-to-Many (N:N)**: registros de “A” podem relacionar-se a múltiplos registros de “B” e vice-versa.
- **Uso típico**:
    - `Aluno` ↔ `Curso` (um aluno pode cursar vários cursos, um curso tem vários alunos)
    - `Livro` ↔ `Autor` (um livro pode ter vários autores, autor publica vários livros)

No banco relacional, a relação N:N é representada por uma **tabela de junção** (`join table`) que armazena pares de chaves estrangeiras.

### 4.3.2 Exemplos de Sintaxe

### 1) Relacionamento *bidirecional* usando `@JoinTable`

```java
java
Copiar código
@Entity
@Table(name = "aluno")
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.LAZY)
    @JoinTable(
        name = "aluno_curso",
        joinColumns = @JoinColumn(name = "aluno_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "curso_id", referencedColumnName = "id")
    )
    private Set<Curso> cursos = new HashSet<>();

    // Construtor, getters e setters

    public void adicionarCurso(Curso curso) {
        cursos.add(curso);
        curso.getAlunos().add(this);
    }

    public void removerCurso(Curso curso) {
        cursos.remove(curso);
        curso.getAlunos().remove(this);
    }
}

```

```java
java
Copiar código
@Entity
@Table(name = "curso")
public class Curso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricao;

    @ManyToMany(mappedBy = "cursos", fetch = FetchType.LAZY)
    private Set<Aluno> alunos = new HashSet<>();

    // Construtor, getters e setters
}

```

- **Explicação**:
    - Em `Aluno`, `@ManyToMany` + `@JoinTable(...)` → “lado proprietário” (owning side).
        - `name = "aluno_curso"`: nome da tabela de junção.
        - `joinColumns`: define a FK (`aluno_id`) na tabela de junção apontando para `aluno.id`.
        - `inverseJoinColumns`: define a FK (`curso_id`) apontando para `curso.id`.
    - Em `Curso`, `@ManyToMany(mappedBy = "cursos")` → “lado inverso”, sem `@JoinTable`.
    - Métodos utilitários (`adicionarCurso`, `removerCurso`) mantêm consistência de ambos os lados da associação.

### 2) Relacionamento *unidirecional* (apenas de A para B)

Caso deseje que apenas `Aluno` “veja” `Curso`, sem que `Curso` tenha coleção de `Aluno`, basta:

```java
java
Copiar código
@Entity
@Table(name = "aluno")
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "aluno_curso",
        joinColumns = @JoinColumn(name = "aluno_id"),
        inverseJoinColumns = @JoinColumn(name = "curso_id")
    )
    private Set<Curso> cursos = new HashSet<>();

    // getters e setters
}

```

```java
java
Copiar código
@Entity
@Table(name = "curso")
public class Curso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String descricao;
    // Não há referência a Aluno (unidirecional)
    // getters e setters
}

```

- **Explicação**: `Curso` não tem atributo `Set<Aluno>`, mas a tabela de junção `aluno_curso` ainda é criada.

### 4.3.3 Variações e Atributos Importantes

- **`mappedBy`**: define o atributo no outro lado que controla a junção (evita tabela de junção duplicada).
- **`cascade`**:
    - Cuidado: em N:N, cascades ‘REMOVE’ podem tentar deletar a outra entidade. Prefira `PERSIST` e `MERGE` apenas, se necessário.
- **`fetch`**:
    - Padrão: `LAZY` (recomendável para coleções grandes).
    - `EAGER` em coleções N:N pode gerar `Cartesian Product` indesejável.
- **Tabela de junção customizada**:
    - É possível adicionar colunas extras na tabela de junção (ex.: data de matrícula). Nesse caso, o ideal é modelar a tabela de junção como **entidade própria** (Relacionamento *associativo*), ao invés de usar `@ManyToMany` puro.

**Exemplo de tabela de junção com atributos extras (Entidade Intermediária):**

```java
java
Copiar código
@Entity
@Table(name = "inscricao")
public class Inscricao {
    @EmbeddedId
    private InscricaoId id = new InscricaoId();

    @ManyToOne
    @MapsId("alunoId")
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

    @ManyToOne
    @MapsId("cursoId")
    @JoinColumn(name = "curso_id")
    private Curso curso;

    private LocalDate dataInscricao;

    // Construtor, getters e setters
}

@Embeddable
public class InscricaoId implements Serializable {
    @Column(name = "aluno_id")
    private Long alunoId;

    @Column(name = "curso_id")
    private Long cursoId;

    // equals() e hashCode()
}

```

- Neste caso, as entidades `Aluno` e `Curso` NÃO usam diretamente `@ManyToMany`; em vez disso, cada uma mapeia a relação 1:N com `Inscricao`.

---

## 5. Cenários de Restrição ou Não Aplicação

Em determinadas situações, usar diretamente um certo tipo de relacionamento JPA pode não ser apropriado. Exemplos:

1. **Coleções muito grandes**
    - Se uma entidade “1” possui milhares de “N”, carregar `@OneToMany` EAGER pode causar estouro de memória ou consultas extremamente lentas.
    - *Solução*: usar `LAZY` e/ou page/range queries manualmente (Repository customizado).
2. **Muitos-para-Muitos com atributos extras**
    - Quando a tabela de junção requer colunas adicionais (ex.: data de criação, status), modelar via `@ManyToMany` puro não atende.
    - *Solução*: criar entidade intermediária (conforme exemplo “Inscricao”), usando `@ManyToOne` em ambas as direções.
3. **Relacionamento cíclico e serialização JSON**
    - Entidades bidirecionais podem causar **StackOverflowError** ao serializar para JSON (por exemplo, Jackson).
    - *Solução*: usar anotações como `@JsonIgnore` (Jackson) ou projetar DTOs específicos para transporte.
4. **Exigência de unidirecionalidade**
    - Algumas modelagens de negócio não necessitam do lado inverso. Evita-se ter coleção em uma entidade se ela nunca será usada.
    - Reduz complexidade e melhora performance.
5. **Integração com banco legado**
    - Se o esquema de tabelas já existe e relacionamentos não seguem padrões JPA, pode ser necessário usar `@JoinColumns` compostos, ou até `@SecondaryTable`.

---

## 6. Componentes Chave Associados

### 6.1 Anotações Principais

- **`@OneToOne`**
    - Atributos comuns:
        - `mappedBy`: lado inverso que aponta ao atributo do owning side.
        - `cascade`: cascata de operações (persist, merge, remove etc.).
        - `fetch`: `LAZY` ou `EAGER`.
        - `optional`: se a relação pode ser nula (por padrão, `true`).
        - `orphanRemoval`: remove a entidade relacionada quando “órfã”.
- **`@OneToMany`**
    - Atributos comuns:
        - `mappedBy`: campo no lado “Many” que contém o `@ManyToOne`.
        - `cascade`, `fetch`, `orphanRemoval`.
        - `targetEntity`: classe alvo (apenas se necessário).
- **`@ManyToOne`**
    - Atributos:
        - `fetch`: padrão `EAGER` (recomendável mudar para `LAZY`).
        - `optional`: define se FK permite nulo.
- **`@ManyToMany`**
    - Atributos:
        - `mappedBy`: ao definir lado inverso.
        - `cascade`, `fetch`.
        - `@JoinTable`: define nome da tabela de junção, colunas de FK.
- **`@JoinColumn` / `@JoinColumns`**
    - Especifica detalhes da coluna de FK (nome, nullable, length).
    - Em relacionamentos compostos, usar `@JoinColumns`.
- **`@JoinTable`**
    - Em N:N, define a tabela intermediária (nome, colunas).
- **`@MapsId` e `@EmbeddedId`**
    - Usados quando a chave estrangeira é parte da chave primária (ex.: mapeamento de tabela de junção com atributos adicionais).

### 6.2 Propriedades Importantes de Mapeamento

- **`mappedBy`** (lado inverso)
    - Ao especificar `mappedBy = "atributoNoOutroLado"`, evita criação de colunas extras.
- **`cascade`**
    - `CascadeType.PERSIST`
    - `CascadeType.MERGE`
    - `CascadeType.REMOVE`
    - `CascadeType.DETACH`
    - `CascadeType.REFRESH`
    - `CascadeType.ALL` (= todos os anteriores)
- **`fetch`**
    - `FetchType.LAZY` (carregamento sob demanda)
    - `FetchType.EAGER` (carregamento imediato)
- **`orphanRemoval`**
    - Quando `true`, entidades dissociadas da coleção são automaticamente removidas do banco.
- **`optional`** (apenas em `@ManyToOne` / `@OneToOne`)
    - Se `false`, cria `NOT NULL` na coluna de FK, garantindo que sempre exista entidade relacionada.

---

## 7. Melhores Práticas e Padrões de Uso

1. **Escolha de FetchType**
    - Em coleções (`@OneToMany`, `@ManyToMany`), **prefira sempre** `FetchType.LAZY` para evitar *n+1 queries* e grandes joins desnecessários.
    - Em `@ManyToOne` e `@OneToOne`, o padrão é `EAGER`. Reavalie cenário a cenário: se a entidade alvo for grande ou raramente usada, defina explicitamente `fetch = FetchType.LAZY`.
2. **Uso criterioso de Cascade e OrphanRemoval**
    - Não use `CascadeType.REMOVE` em relacionamentos que não deveriam deletar em cascata (por exemplo, um `Curso` não deveria ser removido quando um `Aluno` é deletado).
    - Para operações de “substituição” de coleções, `orphanRemoval = true` garante que itens removidos da lista sejam excluídos do banco, evitando registros “órfãos”.
3. **Definir lado proprietário corretamente**
    - Sempre que possível, mantenha a FK na tabela “filha” (lado N). O lado inverso deve usar `mappedBy`. Isso evita criação desnecessária de colunas ou tabelas intermediárias.
4. **Sentinela para Relacionamentos bidirecionais**
    - Sempre que atualizar a associação na memória, atualize ambos os lados do relacionamento (usar métodos utilitários como `adicionarX` e `removerX`).
    - Exemplo:
        
        ```java
        java
        Copiar código
        public void adicionarFuncionario(Funcionario f) {
            funcionarios.add(f);
            f.setDepartamento(this);
        }
        
        ```
        
5. **Evitar relacionamentos cíclicos em JSON/XML**
    - Ao expor entidades JPA como resposta de API, entidades bidirecionais podem causar laços infinitos. Use:
        - Jackson: `@JsonManagedReference` e `@JsonBackReference`, ou `@JsonIgnore`.
        - Ou mapeie para DTOs específicos que não carregam referências cíclicas.
6. **Evitar coleções muito grandes em memória**
    - Para coleções que podem crescer muito, use paginação manual via JPQL ou Criteria API em vez de confiar em carregar toda a coleção aninhada.
7. **Mapeamento de tabelas de junção com atributos extras**
    - Nunca use `@ManyToMany` puro se a tabela intermediária precisar armazenar informações adicionais (por exemplo, data de inscrição). Crie a entidade intermediária explícita e modele como dois relacionamentos `@ManyToOne`.
8. **Utilize a convenção Java Bean (get/set)**
    - Garantir que campos estejam acessíveis a partir de getters e setters para que o provedor JPA (Hibernate, EclipseLink etc.) possa proxiar corretamente os objetos.

---

## 8. Exemplo Prático Completo

### 8.1 Cenário

Vamos construir um sistema simples de gestão acadêmica com as seguintes entidades e relacionamentos:

- **Entidades**:
    - `Aluno`
    - `Curso`
    - `Departamento`
    - `Passaporte` (para demonstrar One-to-One)
- **Relações**:
    - `Aluno` ↔ `Curso`: Many-to-Many
    - `Departamento` (1) ↔ `Aluno` (N): Many-to-One / One-to-Many
    - `Aluno` (1) ↔ `Passaporte` (1): One-to-One

---

### 8.2 Modelagem das Entidades

### 8.2.1 Entidade Departamento (1:N com Aluno)

```java
java
Copiar código
package com.exemplo.academico.entity;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "departamento")
public class Departamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @OneToMany(mappedBy = "departamento",
               cascade = CascadeType.ALL,
               orphanRemoval = true,
               fetch = FetchType.LAZY)
    private List<Aluno> alunos = new ArrayList<>();

    // Construtor padrão
    public Departamento() { }

    public Departamento(String nome) {
        this.nome = nome;
    }

    // Métodos utilitários para manter a consistência bidirecional
    public void adicionarAluno(Aluno aluno) {
        alunos.add(aluno);
        aluno.setDepartamento(this);
    }

    public void removerAluno(Aluno aluno) {
        alunos.remove(aluno);
        aluno.setDepartamento(null);
    }

    // Getters e Setters
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public List<Aluno> getAlunos() { return alunos; }
}

```

### 8.2.2 Entidade Curso (Many-to-Many com Aluno)

```java
java
Copiar código
package com.exemplo.academico.entity;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "curso")
public class Curso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @ManyToMany(mappedBy = "cursos", fetch = FetchType.LAZY)
    private Set<Aluno> alunos = new HashSet<>();

    // Construtor padrão
    public Curso() { }

    public Curso(String nome) {
        this.nome = nome;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Set<Aluno> getAlunos() { return alunos; }
}

```

### 8.2.3 Entidade Passaporte (One-to-One com Aluno)

```java
java
Copiar código
package com.exemplo.academico.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "passaporte")
public class Passaporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numero;

    private LocalDate dataEmissao;
    private LocalDate dataValidade;

    @OneToOne(mappedBy = "passaporte", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Aluno aluno;

    // Construtores
    public Passaporte() { }

    public Passaporte(String numero, LocalDate dataEmissao, LocalDate dataValidade) {
        this.numero = numero;
        this.dataEmissao = dataEmissao;
        this.dataValidade = dataValidade;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public LocalDate getDataEmissao() { return dataEmissao; }
    public void setDataEmissao(LocalDate dataEmissao) { this.dataEmissao = dataEmissao; }
    public LocalDate getDataValidade() { return dataValidade; }
    public void setDataValidade(LocalDate dataValidade) { this.dataValidade = dataValidade; }
    public Aluno getAluno() { return aluno; }
    public void setAluno(Aluno aluno) { this.aluno = aluno; }
}

```

### 8.2.4 Entidade Aluno (Many-to-One com Departamento, Many-to-Many com Curso, One-to-One com Passaporte)

```java
java
Copiar código
package com.exemplo.academico.entity;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "aluno")
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    // Many-to-One: vários alunos para um departamento
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "departamento_id", referencedColumnName = "id", nullable = false)
    private Departamento departamento;

    // Many-to-Many: alunos podem fazer vários cursos
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.LAZY)
    @JoinTable(
        name = "aluno_curso",
        joinColumns = @JoinColumn(name = "aluno_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "curso_id", referencedColumnName = "id")
    )
    private Set<Curso> cursos = new HashSet<>();

    // One-to-One: cada aluno pode ter um passaporte
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JoinColumn(name = "passaporte_id", referencedColumnName = "id", unique = true)
    private Passaporte passaporte;

    // Construtor padrão
    public Aluno() { }

    public Aluno(String nome) {
        this.nome = nome;
    }

    // Métodos utilitários para manter consistência de relacionamento

    // Departamento
    public void setDepartamento(Departamento departamento) {
        this.departamento = departamento;
    }

    public Departamento getDepartamento() {
        return departamento;
    }

    // Curso
    public void adicionarCurso(Curso curso) {
        cursos.add(curso);
        curso.getAlunos().add(this);
    }

    public void removerCurso(Curso curso) {
        cursos.remove(curso);
        curso.getAlunos().remove(this);
    }

    // Passaporte
    public void setPassaporte(Passaporte passaporte) {
        this.passaporte = passaporte;
        passaporte.setAluno(this);
    }

    // Getters e Setters básicos
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Set<Curso> getCursos() { return cursos; }
    public Passaporte getPassaporte() { return passaporte; }
}

```

---

### 8.3 Exemplo de Repositórios (Spring Data JPA)

```java
java
Copiar código
package com.exemplo.academico.repository;

import com.exemplo.academico.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> { }

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> { }

@Repository
public interface DepartamentoRepository extends JpaRepository<Departamento, Long> { }

@Repository
public interface PassaporteRepository extends JpaRepository<Passaporte, Long> { }

```

---

### 8.4 Cenário de Uso em um Serviço

```java
java
Copiar código
package com.exemplo.academico.service;

import com.exemplo.academico.entity.*;
import com.exemplo.academico.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class AcademiaService {

    @Autowired
    private AlunoRepository alunoRepo;

    @Autowired
    private DepartamentoRepository departamentoRepo;

    @Autowired
    private CursoRepository cursoRepo;

    @Transactional
    public Aluno criarAlunoCompleto() {
        // 1. Criar Departamento
        Departamento dep = new Departamento("Ciência da Computação");
        departamentoRepo.save(dep);

        // 2. Criar Cursos
        Curso jpa = new Curso("JPA Avançado");
        Curso spring = new Curso("Spring Boot");
        cursoRepo.save(jpa);
        cursoRepo.save(spring);

        // 3. Criar Aluno
        Aluno aluno = new Aluno("João Silva");
        // 3.1 Atribuir Departamento
        dep.adicionarAluno(aluno);

        // 3.2 Atribuir Passaporte
        Passaporte pass = new Passaporte("ABC123456", LocalDate.now(), LocalDate.now().plusYears(10));
        aluno.setPassaporte(pass);

        // 3.3 Matricular em cursos
        aluno.adicionarCurso(jpa);
        aluno.adicionarCurso(spring);

        // 4. Persistir Aluno (com cascades, isso salva cursos/passaporte automaticamente, mas como cursos já existem, só associa)
        return alunoRepo.save(aluno);
    }
}

```

- **O que acontece**:
    1. Cria-se um novo `Departamento`.
    2. Cria-se dois `Curso`.
    3. Instancia-se um `Aluno`, atribuindo:
        - **Departamento** (`dep.adicionarAluno(aluno)`).
        - **Passaporte** (mapeado One-to-One).
        - **Cursos** (mapeado Many-to-Many).
    4. Ao chamar `alunoRepo.save(aluno)`, graças a `cascade = ALL` em `Passaporte` e `cascade = {PERSIST, MERGE}` em `@ManyToMany`, o JPA cuida de salvar as tabelas relacionadas:
        - A tabela `departamento` já existe → apenas associa.
        - A tabela `passaporte` é criada (cascaded).
        - A tabela de junção `aluno_curso` é populada com pares `<aluno_id, curso_id>`.

---

### 8.5 Diagrama Simplificado de Tabelas (DDL Geração Automática)

Para ilustrar como ficariam as tabelas, a seguir um exemplo simplificado de DDL que o Hibernate poderia gerar (temperado por `spring.jpa.hibernate.ddl-auto = update/create`):

```sql
sql
Copiar código
-- Tabela DEPARTAMENTO
CREATE TABLE departamento (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255)
);

-- Tabela CURSO
CREATE TABLE curso (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255)
);

-- Tabela ALUNO
CREATE TABLE aluno (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    departamento_id BIGINT NOT NULL,
    passaporte_id BIGINT UNIQUE,
    CONSTRAINT fk_aluno_departamento FOREIGN KEY (departamento_id) REFERENCES departamento(id),
    CONSTRAINT fk_aluno_passaporte FOREIGN KEY (passaporte_id) REFERENCES passaporte(id)
);

-- Tabela PASSAPORTE
CREATE TABLE passaporte (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(255) UNIQUE NOT NULL,
    data_emissao DATE,
    data_validade DATE
);

-- Tabela DE JUNÇÃO ALUNO_CURSO (Many-to-Many)
CREATE TABLE aluno_curso (
    aluno_id BIGINT NOT NULL,
    curso_id BIGINT NOT NULL,
    PRIMARY KEY (aluno_id, curso_id),
    CONSTRAINT fk_aluno_curso_aluno FOREIGN KEY (aluno_id) REFERENCES aluno(id),
    CONSTRAINT fk_aluno_curso_curso FOREIGN KEY (curso_id) REFERENCES curso(id)
);

```

- **Observações**:
    - A coluna `passaporte_id` em `aluno` aparece porque `@OneToOne` com `@JoinColumn` no lado proprietário (`Aluno`).
    - A tabela `aluno_curso` armazena pares `(aluno_id, curso_id)`.

---

## 9. Sugestões para Aprofundamento

1. **Documentação Oficial do JPA (Jakarta EE)**
    - Seções específicas de mapeamento de relacionamentos:
        - One-to-One
        - One-to-Many / Many-to-One
        - Many-to-Many
2. **Livros e Recursos Recomendados**
    - *Pro JPA 2 in Java EE 8* – aprofundamento em padrões de projeto e casos de uso avançados.
    - *High-Performance Java Persistence* (Vlad Mihalcea) – técnicas de tuning de JPA/Hibernate, cenários de alta carga e mapeamentos avançados.
3. **Tópicos Avançados**
    - **Herança (Inheritance) no JPA**: mapeamento de hierarquias de classes (`@Inheritance`, `@DiscriminatorColumn`).
    - **Entity Graphs**: otimização de queries LAZY/EAGER para carregamento parcial de relacionamentos.
    - **Tipos de chave composta**: uso de `@EmbeddedId` e `@IdClass`.
    - **Callbacks de Entidade**: `@PrePersist`, `@PostLoad` para lógica antes/depois de operações de persistência.
4. **Ferramentas de Apoio**
    - **Hibernate Tools** (Eclipse) ou **Spring Data JPA** (Spring Boot) para geração acelerada de repositórios e consultas.
    - **Liquibase / Flyway** para versionamento de esquema de banco, controlando alterações nas tabelas relacionais.

---

**Conclusão:**

Você agora dispõe de uma visão completa sobre como mapear relacionamentos One-to-One, One-to-Many/Many-to-One e Many-to-Many no JPA, com exemplos práticos, explicações de anotações, cenários de restrição, componentes-chaves e melhores práticas. Use este material como referência ao modelar entidades e projetar o banco de dados de seus projetos Java, garantindo integridade, desempenho e manutenção facilitada.

> Dica final: sempre revise as estratégias de carregamento (fetch) e os tipos de cascata quando implementar relacionamentos, pois escolhas inadequadas podem levar a problemas de desempenho ou inconsistências de dados.
>