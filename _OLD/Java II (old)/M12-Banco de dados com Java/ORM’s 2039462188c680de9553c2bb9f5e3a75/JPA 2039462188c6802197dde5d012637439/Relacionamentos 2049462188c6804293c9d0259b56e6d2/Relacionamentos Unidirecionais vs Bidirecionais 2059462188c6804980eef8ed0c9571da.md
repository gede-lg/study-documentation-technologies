# Relacionamentos Unidirecionais vs. Bidirecionais

---

## 1. Introdução

O mapeamento de relacionamentos entre entidades é um aspecto central ao trabalhar com JPA (Java Persistence API). Saber diferenciar quando usar relacionamentos unidirecionais ou bidirecionais, bem como compreender quais anotações e configurações empregar, é fundamental para garantir consistência no modelo de dados, evitar problemas de sincronização e melhorar o desempenho nas operações de CRUD.

Neste material, exploraremos em detalhes:

- O que são relacionamentos unidirecionais e bidirecionais;
- Como defini-los (sintaxe e exemplos comentados);
- Cenários em que cada abordagem faz mais sentido (ou em que deve ser evitada);
- Componentes-chave (anotações, atributos, métodos);
- Boas práticas e padrões de uso;
- Um exemplo prático completo do começo ao fim.

---

## 2. Sumário

1. **Conceitos Fundamentais**
    
    1.1. Definição de Relacionamentos Unidirecionais
    
    1.2. Definição de Relacionamentos Bidirecionais
    
    1.3. Vantagens e Desvantagens de Cada Abordagem
    
2. **Sintaxe Detalhada e Uso Prático**
    
    2.1. `@OneToOne`
    
    2.2. `@OneToMany` e `@ManyToOne`
    
    2.3. `@ManyToMany`
    
    2.4. Exemplos de Relacionamento Unidirecional
    
    2.5. Exemplos de Relacionamento Bidirecional
    
3. **Cenários de Restrição ou Não Apliação**
    
    3.1. Quando não usar Bidirecional
    
    3.2. Problemas comuns (cascading, atualização em cascata, lazy vs. eager)
    
4. **Componentes Chave Associados**
    
    4.1. Atributos e Métodos em Entidades
    
    4.2. `mappedBy` e Lado Inverso
    
    4.3. `cascade`, `fetch`, `orphanRemoval`
    
5. **Melhores Práticas e Padrões de Uso**
    
    5.1. Escolha do Lado Dono (Owning Side)
    
    5.2. Padrão de Builder ou DTO para Transferência de Dados
    
    5.3. Considerações de Performance (Lazy vs. Eager, `JOIN FETCH`)
    
6. **Exemplo Prático Completo**
    
    6.1. Contexto: Aplicação de Pedidos e Clientes
    
    6.2. Entidades e Relacionamentos Unidirecionais
    
    6.3. Transformando em Bidirecional
    
    6.4. Repositórios e Operações de CRUD
    
    6.5. Testando Consultas e Sincronização de Lado Inverso
    
7. **Sugestões para Aprofundamento**

---

## 3. Conceitos Fundamentais

### 3.1. Relacionamento Unidirecional

- **Definição:**
    
    Em um relacionamento unidirecional, apenas uma entidade conhece a outra. Ou seja, existe um ponteiro (referência) em uma direção, mas não no sentido inverso.
    
- **Exemplo conceitual:**
    - Entidade **Pedido** tem uma referência a **Cliente**.
    - **Cliente** *não* tem nenhuma coleção ou atributo apontando para **Pedido**.
- **Vantagens:**
    - Modelo mais simples; menos código para manter.
    - Evita sincronização da relação no lado “inverso”, já que não há lado inverso.
    - Bom para cenários em que a única navegação necessária é de um lado.
- **Desvantagens:**
    - Caso seja necessário percorrer do outro lado (por exemplo, do Cliente encontrar todos os Pedidos), seria preciso criar uma query explícita em JPQL ou um relacionamento adicional.

### 3.2. Relacionamento Bidirecional

- **Definição:**
    
    Em um relacionamento bidirecional, ambas as entidades envolvidas possuem referências uma para a outra. Há um lado “dono” (owning side) e um lado “inverso” (inverse side).
    
- **Exemplo conceitual:**
    - Entidade **Cliente** tem uma coleção de **Pedido** (`List<Pedido> pedidos`).
    - Entidade **Pedido** tem uma referência a **Cliente** (`Cliente cliente`).
    - Existem configurações para indicar qual lado gerencia a FK no banco de dados (lado “dono”).
- **Vantagens:**
    - Facilidade de navegação em ambas as direções (Cliente → Pedidos e Pedido → Cliente).
    - Em consultas mais complexas, pode-se usar `JOIN FETCH` para otimizar recuperações.
- **Desvantagens:**
    - Requer mais cuidado para manter os dois lados da relação sincronizados em memória (ex: adicionar um Pedido à lista de Pedidos do Cliente, mas não setar o cliente no objeto Pedido gera inconsistências temporárias).
    - Complexidade maior de configuração (`mappedBy`, controle de `cascade`, etc.).

### 3.3. Vantagens e Desvantagens de Cada Abordagem

| Aspecto | Unidirecional | Bidirecional |
| --- | --- | --- |
| Simplicidade | Mais simples: apenas uma referência | Mais complexo: dois atributos em entidades diferentes |
| Navegação | Apenas em um sentido (quem possui a referência) | Em ambos os sentidos (entidade A aponta para B e vice-versa) |
| Manutenção de Código | Menos classes/atributos para manter | Possui `mappedBy` e sincronização de coleções/membros |
| Desempenho (inicial) | Menos joins implícitos; consultas simples | Possibilidade de usar `JOIN FETCH` para evitar *n+1 selects*, mas cuidado com `EAGER` e *cartesian product* |
| Sincronização em Memória | Não há sincronização de lado inverso | É necessário atualizar manualmente ambos os lados (por ex: `cliente.getPedidos().add(pedido)` e `pedido.setCliente(cliente)`). |
| Consultas em Sentido Inverso | Exige JPQL ou Criteria API (ex: `SELECT p FROM Pedido p WHERE p.cliente.id = :id`) | Pode navegar diretamente (`cliente.getPedidos()`) ou usar JPQL se preferir. |

---

## 4. Sintaxe Detalhada e Uso Prático

A seguir, descrevemos como configurar cada tipo de relacionamento, mostrando exemplos comentados. Vamos supor que temos duas entidades principais para ilustrar: `Cliente` e `Pedido`. Em alguns exemplos, usaremos outras entidades para cobrir variações (`@OneToOne` e `@ManyToMany`).

### 4.1. `@OneToOne`

### 4.1.1. Unidirecional

```java
@Entity
@Table(name = "cliente")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    // Relacionamento unidirecional para Endereco
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "endereco_id") // Coluna FK na tabela cliente
    private Endereco endereco;

    // getters e setters
}

@Entity
@Table(name = "endereco")
public class Endereco {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String rua;
    private String cidade;
    // outros campos...
    // getters e setters
}

```

- **Explicações dos principais elementos:**
    - `@OneToOne`: define o relacionamento 1:1.
    - `cascade = CascadeType.ALL`: operações em `Cliente` (persist, remove, update, etc.) também serão propagadas para `Endereco`.
    - `fetch = FetchType.LAZY`: só carrega o `Endereco` quando for acessado (padrão para 1:1 seria `EAGER`, mas explicitamos `LAZY` para melhor desempenho em cenários onde nem sempre queremos o endereço).
    - `@JoinColumn(name = "endereco_id")`: define a coluna na tabela `cliente` que armazena a FK para `endereco.id`.

### 4.1.2. Bidirecional

```java
@Entity
@Table(name = "cliente")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @OneToOne(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Endereco endereco;

    // getters e setters
}

@Entity
@Table(name = "endereco")
public class Endereco {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String rua;
    private String cidade;

    @OneToOne
    @JoinColumn(name = "cliente_id") // Coluna FK em endereco referenciando cliente.id
    private Cliente cliente;

    // getters e setters
}

```

- **Pontos-chave:**
    - Em `Cliente`: `@OneToOne(mappedBy = "cliente", ...)` indica que o lado “dono” é `Endereco`. Ou seja, a FK estará em `endereco.cliente_id`.
    - Em `Endereco`: `@JoinColumn(name = "cliente_id")` confirma que `Endereco` possui uma coluna `cliente_id` que referencia `cliente.id`.
    - `mappedBy` deve ter o mesmo nome do atributo usado no lado dono (`private Cliente cliente;` em `Endereco`).

### 4.2. `@OneToMany` e `@ManyToOne`

### 4.2.1. Relacionamento Unidirecional `@ManyToOne`

```java
@Entity
@Table(name = "pedido")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate data;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id") // Coluna FK em pedido
    private Cliente cliente;

    // getters e setters
}

@Entity
@Table(name = "cliente")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    // NÃO há lista de pedidos aqui, pois é unidirecional
    // getters e setters
}

```

- **Explicações:**
    - `@ManyToOne`: define que muitos `Pedido` podem referenciar um único `Cliente`.
    - `optional = false`: indica que o relacionamento é obrigatório (a coluna `cliente_id` não pode ser nula).
    - Não existe atributo em `Cliente` para navegar aos pedidos. Para buscar pedidos de um cliente, precisaríamos de uma query JPQL, por exemplo:
        
        ```java
        @Query("SELECT p FROM Pedido p WHERE p.cliente.id = :idCliente")
        List<Pedido> findByClienteId(@Param("idCliente") Long idCliente);
        
        ```
        

### 4.2.2. Relacionamento Bidirecional `@OneToMany` / `@ManyToOne`

```java
@Entity
@Table(name = "cliente")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pedido> pedidos = new ArrayList<>();

    // Construtor sem-args, getters e setters

    // Método auxiliar para manter sincronia dos dois lados
    public void adicionarPedido(Pedido pedido) {
        pedidos.add(pedido);
        pedido.setCliente(this);
    }

    public void removerPedido(Pedido pedido) {
        pedidos.remove(pedido);
        pedido.setCliente(null);
    }
}

@Entity
@Table(name = "pedido")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // getters e setters
}

```

- **Explicações detalhadas:**
    - Em `Cliente`:
        - `@OneToMany(mappedBy = "cliente", ...)`: `mappedBy` indica que o atributo `cliente` em `Pedido` é o lado dono (é quem contém a coluna `cliente_id`).
        - `cascade = CascadeType.ALL`: se um `Cliente` for persistido, seus `Pedidos` também serão; se `Cliente` for removido, seus `Pedidos` serão removidos (atenção: somente se não houver outras restrições de FK).
        - `orphanRemoval = true`: caso um `Pedido` seja removido da lista `pedidos`, o JPA irá deletá-lo automaticamente do banco.
        - É recomendável inicializar a lista (`new ArrayList<>`) para evitar `NullPointerException`.
        - Os métodos auxiliares (`adicionarPedido` e `removerPedido`) sincronizam ambos os lados do relacionamento para manter a consistência em memória.
    - Em `Pedido`:
        - `@ManyToOne(fetch = FetchType.LAZY)`: o `Cliente` só será carregado quando `pedido.getCliente()` for acessado.
        - `@JoinColumn(name = "cliente_id")`: define a coluna FK na tabela `pedido`.

### 4.3. `@ManyToMany`

### 4.3.1. Unidirecional

```java
@Entity
@Table(name = "aluno")
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @ManyToMany
    @JoinTable(
        name = "aluno_curso",
        joinColumns = @JoinColumn(name = "aluno_id"),
        inverseJoinColumns = @JoinColumn(name = "curso_id")
    )
    private Set<Curso> cursos = new HashSet<>();

    // getters e setters
}

@Entity
@Table(name = "curso")
public class Curso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    // NÃO há coleção de Aluno aqui (unidirecional)
    // getters e setters
}

```

- **Explicações importantes:**
    - `@ManyToMany`: relaciona vários `Aluno` a vários `Curso`.
    - `@JoinTable`: define a tabela intermediária `aluno_curso` que possui duas colunas de FK: `aluno_id` e `curso_id`.
    - No lado não mapeado (`Curso`), não existe atributo para navegar aos alunos.

### 4.3.2. Bidirecional

```java
@Entity
@Table(name = "aluno")
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @ManyToMany
    @JoinTable(
        name = "aluno_curso",
        joinColumns = @JoinColumn(name = "aluno_id"),
        inverseJoinColumns = @JoinColumn(name = "curso_id")
    )
    private Set<Curso> cursos = new HashSet<>();

    // Construtores, getters e setters

    public void adicionarCurso(Curso curso) {
        cursos.add(curso);
        curso.getAlunos().add(this);
    }

    public void removerCurso(Curso curso) {
        cursos.remove(curso);
        curso.getAlunos().remove(this);
    }
}

@Entity
@Table(name = "curso")
public class Curso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @ManyToMany(mappedBy = "cursos")
    private Set<Aluno> alunos = new HashSet<>();

    // Construtores, getters e setters
}

```

- **Pontos-chaves:**
    - Em `Aluno`: lado “dono” do relacionamento (quem controla a tabela `aluno_curso`) é definido sem `mappedBy`, usando `@JoinTable`.
    - Em `Curso`: `@ManyToMany(mappedBy = "cursos")` indica que o lado dono está em `Aluno.cursos`.
    - Métodos auxiliares (`adicionarCurso`, `removerCurso`) sincronizam ambos os lados.

---

## 5. Cenários de Restrição ou Não Aplicação

### 5.1. Quando Evitar Relacionamentos Bidirecionais

1. **Simplicidade de Navegação Só de Um Lado:**
    - Se for raro (ou nunca) necessário navegar da entidade “inversa” para a entidade “dona”, não vale a complexidade adicional de um bidirecional.
    - Exemplo: `Log de Sistema` → `Usuário`. Se nunca precisarmos de todos os `Logs` de um `Usuário`, usar unidirecional pode ser suficiente.
2. **Performance e Query Sem Necessidade de Navegação Inversa:**
    - Em algumas situações, mapear bidirecional pode induzir a *fetch joins* ou *subselects* desnecessários, caso se use `EAGER` em coleções, acarretando *cartesian product*.
3. **Evitar Ciclos de Serialização em APIs REST:**
    - Com mapeamentos bidirecionais, ao converter entidades para JSON (por exemplo, com Jackson), pode ocorrer um loop infinito de serialização (Cliente → Pedidos → Cliente → …). Precisa usar anotações como `@JsonManagedReference`/`@JsonBackReference` ou `@JsonIgnore`.

### 5.2. Problemas Comuns

1. **Falta de Sincronização do Lado Inverso:**
    - Exemplo:
        
        ```java
        Cliente c = new Cliente();
        Pedido p = new Pedido();
        c.getPedidos().add(p);
        // Esquecemos de fazer p.setCliente(c)
        // Persistir c pode não persistir p corretamente, pois p.cliente == null
        
        ```
        
    - **Solução:** usar métodos auxiliares que sincronizem ambos os lados (como `c.adicionarPedido(p)`).
2. **Propagação de `CascadeType` Inadequada:**
    - Usar `CascadeType.ALL` em relacionamentos `@ManyToOne` geralmente não faz sentido, pois se remover o “lado muitos”, não queremos remover o “lado um”. Evite `CascadeType.REMOVE` em `@ManyToOne`.
3. **Uso Errado de `FetchType.EAGER` em Coleções:**
    - `@OneToMany(fetch = FetchType.EAGER)` normalmente traz toda a coleção quando a entidade “pai” é carregada, o que pode causar consultas muito pesadas e `OutOfMemoryError` se a coleção for grande. Prefira `FetchType.LAZY` e use `JOIN FETCH` em JPQL quando precisar carregar a coleção.
4. **Loop de Atualizações no Banco (Atualizações Explícitas/Implícitas):**
    - Ao persistir um relacionamento bidirecional sem indicar claramente o dono (`mappedBy`), o JPA pode gerar updates desnecessários de FK. Sempre defina claramente quem é o lado “dono” para o JPA saber como gerar o SQL.

---

## 6. Componentes Chave Associados

### 6.1. Atributos e Métodos em Entidades

- **Atributo de Referência:**
    - Declara-se o tipo da entidade relacionada (por ex.: `private Cliente cliente;` em `Pedido`).
    - Para coleções (`@OneToMany`, `@ManyToMany`), use `List<T>` ou `Set<T>` (preferencialmente `Set` para evitar duplicatas).
- **Métodos Auxiliares (Convenience Methods):**
    - Para sincronia de ambos os lados, recomenda-se implementar:
        
        ```java
        public void adicionarX(X x) {
            listaDeX.add(x);
            x.setPai(this);
        }
        
        ```
        

### 6.2. A anotação `mappedBy` e Lado Inverso

- **Definição do “Dono” (Owning Side):**
    - O lado “dono” é quem contém a FK no banco ou quem define a tabela de junção (`@JoinTable`).
    - Somente o lado “dono” pode atualizar o relacionamento no banco (o JPA ignora mudanças feitas apenas no lado inverso).
- **`mappedBy`:**
    - Usado somente no lado “inverso” para apontar ao atributo do lado “dono”.
    - Exemplo: `@OneToMany(mappedBy = "cliente") private List<Pedido> pedidos;`. Aqui, `Pedido.cliente` é o atributo dono.

### 6.3. `cascade`, `fetch`, `orphanRemoval`

- **`cascade`:**
    - Define quais operações em cascata serão propagadas do pai para o(s) filho(s).
    - Valores comuns: `CascadeType.PERSIST`, `CascadeType.MERGE`, `CascadeType.REMOVE`, `CascadeType.REFRESH`, `CascadeType.DETACH`.
    - `CascadeType.ALL` = aplica todos. Tenha cuidado em relacionamentos `@ManyToOne` e `@ManyToMany`; evite `REMOVE` se não for desejável que, ao remover o “filho”, o “pai” seja removido.
- **`fetch`:**
    - `FetchType.LAZY`: carrega a associação somente quando o atributo for acessado pela primeira vez.
    - `FetchType.EAGER`: carrega a associação junto com a entidade principal.
    - Em `@OneToMany` e `@ManyToMany`, o padrão é `LAZY`. Em `@ManyToOne` e `@OneToOne`, o padrão é `EAGER`, mas recomenda-se usar `LAZY` explicitamente para evitar problemas de desempenho.
- **`orphanRemoval`:**
    - Se `true`, ao remover o elemento da coleção (lado inverso), o JPA deleta o registro correspondente no banco.
    - Geralmente usado em `@OneToMany` para que, se um “filho” for retirado da coleção do “pai”, ele seja considerado órfão e removido.

---

## 7. Melhores Práticas e Padrões de Uso

### 7.1. Escolha do Lado Dono (Owning Side)

- Sempre determine qual entidade deve ser o lado “dono” do relacionamento. Em geral:
    - Em `@OneToMany`/`@ManyToOne`, faz sentido que `@ManyToOne` seja o dono (pois quem tem a FK no BD).
    - Em `@ManyToMany`, escolha qual entidade “será responsável” pela tabela de junção ou crie uma entidade intermediária (tabela separada) se precisar de atributos extras.

### 7.2. Sincronização de Relacionamentos

- **Métodos Auxiliares:**
    - Implemente métodos como `adicionarX()` e `removerX()` para sincronizar ambos os lados em memória, evitando “relacionamentos não refletidos” quando o JPA flushar as mudanças.
- **Evitar Setter Direto em Coleção Sem Atualizar Lado Inverso:**
    - Não use `cliente.getPedidos().add(pedido)` sem também chamar `pedido.setCliente(cliente)`.
    - Em coleções `Set<Curso> cursos`, sempre use métodos que façam `curso.getAlunos().add(this)` no lado contrário.

### 7.3. Lazy vs. Eager e Questões de Performance

- **Evitar `FetchType.EAGER` em Grandes Coleções:**
    - `@OneToMany(fetch = FetchType.EAGER)` pode gerar *cartesian product* e consultas muito pesadas.
    - Prefira `LAZY` e recorra a `JOIN FETCH` em queries específicas:
        
        ```java
        @Query("SELECT c FROM Cliente c JOIN FETCH c.pedidos WHERE c.id = :id")
        Cliente findByIdComPedidos(@Param("id") Long id);
        
        ```
        
- **Evitar `n+1 selects`:**
    - Ao buscar uma lista de `Cliente`, se cada um tiver coleção de `Pedido` como `LAZY`, pode ocorrer o problema `n+1` quando iteramos: para cada cliente será disparada uma query separada para buscar seus pedidos.
    - Solução:
        - Usar `JOIN FETCH` em JPQL/Criteria ou configurar `@BatchSize` (Hibernate) para agrupar fetches.

### 7.4. Uso de DTO e Projeções

- Quando retornar dados para uma API REST, muitas vezes não queremos expor a entidade inteira ou navegar recursivamente no bidirecional.
- Recomenda-se usar DTOs ou Projeções (`interface-based projections`) para evitar loops de serialização e retornar apenas campos necessários.
- Exemplo usando Spring Data JPA Projection:
    
    ```java
    public interface ClienteResumoDTO {
        Long getId();
        String getNome();
        List<PedidoResumoDTO> getPedidos();
    }
    
    public interface PedidoResumoDTO {
        Long getId();
        LocalDate getData();
    }
    
    // Repositório:
    interface ClienteRepository extends JpaRepository<Cliente, Long> {
        @Query("SELECT c FROM Cliente c LEFT JOIN c.pedidos p WHERE c.id = :id")
        ClienteResumoDTO findResumoById(@Param("id") Long id);
    }
    
    ```
    

---

## 8. Exemplo Prático Completo

### 8.1. Contexto: Aplicação de Pedidos e Clientes

Suponha que estamos desenvolvendo uma aplicação simples de gerenciamento de clientes e pedidos. Cada cliente pode fazer vários pedidos, e cada pedido só está associado a um cliente. Vamos percorrer as etapas:

### 8.1.1. Entidades Iniciais (Unidirecional em `Pedido` → `Cliente`)

```java
// Cliente.java
package com.exemplo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cliente")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    // Construtores, getters e setters

    public Cliente() {}
    public Cliente(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }
    // getters e setters
}

// Pedido.java
package com.exemplo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "pedido")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate data;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id") // FK para cliente.id
    private Cliente cliente;

    private Double valorTotal;

    // Construtores, getters e setters

    public Pedido() {}
    public Pedido(LocalDate data, Cliente cliente, Double valorTotal) {
        this.data = data;
        this.cliente = cliente;
        this.valorTotal = valorTotal;
    }
    // getters e setters
}

```

- Aqui, `Pedido` conhece `Cliente`, mas `Cliente` não conhece seus `Pedidos`.
- Para buscar pedidos de um cliente, usaríamos algo como:
    
    ```java
    @Repository
    public interface PedidoRepository extends JpaRepository<Pedido, Long> {
        List<Pedido> findByClienteId(Long clienteId);
    }
    
    ```
    

Em um serviço:

```java
@Service
public class PedidoService {
    @Autowired
    private PedidoRepository pedidoRepository;

    public List<Pedido> listarPedidosPorCliente(Long clienteId) {
        return pedidoRepository.findByClienteId(clienteId);
    }
}

```

### 8.1.2. Transformando em Relacionamento Bidirecional

Agora, queremos permitir que, a partir de um objeto `Cliente`, obtenhamos todos os seus pedidos diretamente, sem precisar de query separada. Para isso, ajustamos:

```java
// Cliente.java
@Entity
@Table(name = "cliente")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pedido> pedidos = new ArrayList<>();

    // Construtores
    public Cliente() {}
    public Cliente(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }

    // getters e setters

    // Método auxiliar para adicionar pedido
    public void adicionarPedido(Pedido pedido) {
        pedidos.add(pedido);
        pedido.setCliente(this);
    }

    public void removerPedido(Pedido pedido) {
        pedidos.remove(pedido);
        pedido.setCliente(null);
    }
}

// Pedido.java (continua como antes, mas incluímos método setCliente e dependemos dele para sincronização)
@Entity
@Table(name = "pedido")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    private Double valorTotal;

    // Construtores, getters e setters

    public Pedido() {}
    public Pedido(LocalDate data, Double valorTotal) {
        this.data = data;
        this.valorTotal = valorTotal;
    }

    // getCliente, setCliente, getData, setData, getValorTotal, setValorTotal

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
}

```

Em `PedidoService`, poderíamos agora carregar um `Cliente` e, em seguida, obter diretamente `cliente.getPedidos()`:

```java
@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    public Cliente criarClienteComPedidos() {
        Cliente cliente = new Cliente("Maria", "maria@example.com");

        Pedido p1 = new Pedido(LocalDate.now(), 150.00);
        Pedido p2 = new Pedido(LocalDate.now().plusDays(1), 200.00);

        cliente.adicionarPedido(p1);
        cliente.adicionarPedido(p2);

        // Graças ao cascade, basta salvar cliente
        return clienteRepository.save(cliente);
    }

    public Cliente buscarClienteComPedidos(Long id) {
        // Exemplo usando JOIN FETCH para garantir que pedidos sejam carregados
        return clienteRepository.findByIdWithPedidos(id);
    }
}

// ClienteRepository.java
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    @Query("SELECT c FROM Cliente c LEFT JOIN FETCH c.pedidos WHERE c.id = :id")
    Cliente findByIdWithPedidos(@Param("id") Long id);
}

```

- **Observações finais:**
    - O método `adicionarPedido` garante que, ao persistir o `Cliente`, todos os `Pedidos` estejam no estado correto (cliente associado).
    - Ao buscar `Cliente` com `JOIN FETCH`, resolvemos o problema de carregar a coleção de `Pedidos` em um mesmo SELECT, evitando *n+1 selects*.

---

## 9. Sugestões para Aprofundamento

1. **Join Tables com Coluna Intermediária Personalizada:**
    - Em vez de usar `@ManyToMany`, crie uma entidade de junção com atributos extras (por ex.: data de matrícula em um sistema de cursos).
2. **Projeções e DTOs para Otimizar Consultas:**
    - Estude `EntityGraph` e *Spring Data JPA projections* (interfaces e classes DTO), evitando carregar coleções inteiras se não forem necessárias.
3. **Batching e Preparação de Statements (Hibernate):**
    - Use propriedades como `hibernate.jdbc.batch_size` para agrupar *inserts/updates*, melhorando performance em operações em lote envolvendo relacionamentos.
4. **Estratégias de Herança em JPA:**
    - Explore `@Inheritance` (SINGLE_TABLE, JOINED, TABLE_PER_CLASS) quando precisar de relacionamentos envolvendo hierarquias de classes.
5. **Ferramentas de Profiling de Queries:**
    - Utilize `Hibernate Statistics`, `p6spy` ou logs de SQL para analisar *n+1 selects* e otimizar consultas com *fetch joins* ou subselects.
6. **Tratamento de LazyInitializationException:**
    - Entenda cenários que geram `LazyInitializationException` (acessar coleção LAZY fora do contexto de transação/EntityManager) e soluções como usar *Open Session in View* (apenas se for válido para o caso de uso).
7. **Cascading Complexo e Orphan Removal em coleções profundas:**
    - Estude cenários em que várias entidades aninhadas dependem de cascades múltiplos, para evitar exclusões acidentais de filhos “órfãos”.

---

> Observação Final:
> 
> 
> Ao projetar um domínio de aplicação, sempre avalie cuidadosamente os relacionamentos. Se a lógica exigir navegação em ambas as direções (por ex.: exibir detalhes de Cliente e todos os seus Pedidos, ou exibir detalhes de um Pedido e os dados do Cliente), o bidirecional é adequado. Caso contrário, prefira a simplicidade do unidirecional. Mantenha sempre métodos auxiliares para sincronizar ambas as pontas de relações bidirecionais e escolha com atenção *fetch type* e *cascade*, garantindo consistência e performance.
>