# Campos Transient (@Transient)

## 1. Introdução

O JPA (Java Persistence API) é a especificação padrão para mapeamento objeto-relacional (ORM) em aplicações Java. Ao mapear uma classe Java como uma entidade persistente, nem todos os campos da classe necessariamente precisam ser armazenados no banco de dados. O `@Transient` é a anotação que sinaliza ao provedor JPA que determinado atributo **não** deve corresponder a uma coluna na tabela relacional. Isso é útil para campos auxiliares, derivados ou temporários que existem apenas em memória durante o ciclo de vida do objeto, mas não fazem parte do modelo de dados persistido.

> Tópicos relacionados para aprofundar:
> 
> - Diferença entre `@Transient` e `transient` do Java.
> - Ciclo de vida de uma entidade JPA.
> - GUID generation e chaves substitutas (surrogate keys).

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#3-conceitos-fundamentais)
2. [Sintaxe e Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#4-sintaxe-e-uso)
3. [Restrições de Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#5-restri%C3%A7%C3%B5es-de-uso)
4. [Elementos Associados](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#6-elementos-associados)
5. [Melhores Práticas e Casos de Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#7-melhores-pr%C3%A1ticas-e-casos-de-uso)
6. [Exemplos Completos](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#8-exemplos-completos)

> Tópicos relacionados para aprofundar:
> 
> - Mapeamento de atributos embutidos com `@Embedded`.
> - Outros tipos de anotações de mapeamento de colunas (`@Column`, `@Basic` etc.).

---

## 3. Conceitos Fundamentais

1. **O que é `@Transient`?**
    - No contexto do JPA, `@Transient` é uma anotação que marca um campo de entidade como não persistível. O provedor JPA ignora esse campo ao gerar esquemas, gerar consultas de inserção/atualização e ao sincronizar o estado do objeto com o banco de dados.
2. **Diferença entre `@Transient` e `transient` do Java**
    - `transient` (com “t” minúsculo) é um modificador de linguagem Java que instrui a JVM a não serializar o campo quando o objeto é convertido em bytes (por exemplo, ao gravar em um arquivo via `ObjectOutputStream`).
    - `@Transient` (com “T” maiúsculo) pertence ao pacote `javax.persistence` e instrui o provedor JPA a **não persistir** o campo no banco de dados. É possível usar ambos em conjunto, mas servem a propósitos distintos.
3. **Por que usar campos transient?**
    - **Campos calculados ou derivados**: valores que dependem de outras colunas, mas não devem ser armazenados separadamente.
    - **Dados temporários ou de sessão**: informações auxiliares durante o processamento que não fazem parte do modelo relacional.
    - **Auxílio para lógica de negócios**: atributos usados apenas para computação interna, sem relevância para a persistência.

> Tópicos relacionados para aprofundar:
> 
> - Serialização em Java e contexto de `Serializable`.
> - Mapeamento de colunas calculadas via `@Formula` (Hibernate).
> - O papel de `@Basic(fetch = FetchType.LAZY)` para atributos grandes (LOBs).

---

## 4. Sintaxe e Uso

### 4.1. Importação da anotação

```java
import javax.persistence.Transient;

```

### 4.2. Exemplos básicos

```java
@Entity
@Table(name = "produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private BigDecimal preco;

    /**
     * Este campo não deve ser persistido. Serve somente para exibição
     * ou cálculos internos em tempo de execução.
     */
    @Transient
    private BigDecimal precoComDesconto;

    // Construtores, getters e setters
}

```

- Aqui, `precoComDesconto` será ignorado pelo JPA e **não** gerará coluna em `produto`.

### 4.3. Campo calculado em tempo de execução

```java
@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String primeiroNome;

    private String sobrenome;

    /**
     * Campo calculado: combina primeiro e sobrenome, sem persistir.
     */
    @Transient
    public String getNomeCompleto() {
        return primeiroNome + " " + sobrenome;
    }

    // Construtores, getters e setters
}

```

- No exemplo, `getNomeCompleto()` devolve valor combinado, mas não existe coluna `nomeCompleto` na tabela.

### 4.4. Campos auxiliares para lógica de negócio

```java
@Entity
@Table(name = "conta_bancaria")
public class ContaBancaria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal saldo;

    private BigDecimal limite;

    /**
     * Campo temporário usado para computar aprovações, não persiste.
     */
    @Transient
    private boolean permitidoSaque;

    @PostLoad
    private void calcularPermissao() {
        this.permitidoSaque = this.saldo.compareTo(BigDecimal.ZERO) > 0;
    }

    // Construtores, getters e setters
}

```

- Após carregar a entidade, `@PostLoad` é chamado e ajusta `permitidoSaque` em memória. Como está anotado com `@Transient`, não aparece no banco de dados.

> Tópicos relacionados para aprofundar:
> 
> - Ciclo de vida de entidade JPA (`@PostLoad`, `@PrePersist` etc.).
> - Anotação `@Formula` do Hibernate para colunas derivadas no banco.
> - Mapeamento de métodos vs. campos em entidades JPA.

---

## 5. Restrições de Uso

1. **Campos estáticos ou final**
    - O JPA já ignora automaticamente campos `static` e `final`. Não é necessário (e nem faz sentido) anotar `static` com `@Transient`.
2. **Não funciona em propriedades mapeadas por método se anotado apenas no campo**
    - Se a estratégia de mapeamento da entidade usar “property access” (anotações em getters), deve-se anotar o **getter** com `@Transient` em vez do campo. Caso contrário, pode ocorrer comportamento inesperado:
    
    ```java
    // Se estiver mapeando via getters:
    @Entity
    public class Cliente {
        private String nome;
    
        @Transient
        public String getNome() { ... } // ok
        // ...
    }
    
    ```
    
3. **Não pode ser aplicado a relacionamentos**
    - `@Transient` não deve ser usado em campos que representam associações (`@OneToMany`, `@ManyToOne` etc.), pois isso quebra o mapeamento relacional. Se quiser ignorar determinada associação, simplesmente remova a anotação de relacionamento (ou defina `@Transient` e trate manualmente fora do JPA).
4. **Campos de tipo não suportado**
    - Embora `@Transient` ignore o campo completamente, se existir lógica de acesso a esse campo no banco (por exemplo, consultas nativas que o referenciam), haverá erro.
5. **Não usar para dados que precisam ser filtrados pelo banco**
    - Campos transient existem apenas em memória. Se precisar consultar ou filtrar pelo valor, não se deve declarar `@Transient`; em vez disso, persista o atributo e, se necessário, utilize `@Formula` ou `@Column`.

> Tópicos relacionados para aprofundar:
> 
> - Access Type: FIELD vs. PROPERTY no JPA.
> - Mapeamento de relacionamentos opcionais.
> - Consultas JPA e campos não persistidos.

---

## 6. Elementos Associados

### 6.1. Anotações de mapeamento de colunas

- **`@Column`**
    - Mapeia explicitamente o campo/propriedade para uma coluna na tabela.
    - Propriedades comuns: `name`, `nullable`, `length`, `unique` etc.
- **`@Basic`**
    - Mapeamento básico de coluna. Por padrão, todos os campos não anotados com `@Transient` são tratados como `@Basic`.
    - Pode especificar `fetch = FetchType.LAZY` ou `FetchType.EAGER`.
- **`@Embedded` / `@Embeddable`**
    - Para agrupar atributos em classes componentizadas. Não se confunde com `@Transient`, mas é outro modo de estruturar atributos.

### 6.2. Ciclo de vida da entidade

- **`@PostLoad`**
    - Executado imediatamente após JPA carregar a entidade do banco. Pode ser usado para inicializar campos transient com base em valores persistidos.
- **`@PrePersist` / `@PreUpdate`**
    - Permitem preparar campos transient antes de persistir/atualizar. Embora esses campos não sejam salvos, podem influenciar dados persistidos (por exemplo, ajustando outro atributo).

### 6.3. Tipos suportados e conversores

- **`@Convert`**
    - Caso, em vez de ignorar, queira transformar valores de algum atributo antes de persisti-los (ex: enum, JSON), pode-se usar `@Convert`. Campos marcados como `@Transient` **não** suportam conversão, pois não são persistidos.

### 6.4. Mapeamento XML vs. Anotações

- Em XML (arquivo `orm.xml`), o equivalente a `@Transient` é `<transient>` dentro de `<entity>`.
- Ajuste:
    
    ```xml
    <entity class="com.exemplo.Usuario">
        <attributes>
            <basic name="id"/>
            <basic name="nome"/>
            <transient name="nomeCompleto"/>
        </attributes>
    </entity>
    
    ```
    

> Tópicos relacionados para aprofundar:
> 
> - Diferença entre `@Transient` do JPA e `transient` do Java.
> - Configuração de entidades via XML (`orm.xml`).
> - Conversores (`AttributeConverter`) para tipos customizados.

---

## 7. Melhores Práticas e Casos de Uso

### 7.1. Quando usar `@Transient`

- **Campos derivados/calculados**
    - Ex: valor total de pedido (`subtotal`, `impostos`, `total`), data formatada, idade calculada a partir de data de nascimento.
- **Dados de sessão ou contexto**
    - Ex: um token temporário, dados de autenticação ou autorização, contadores de acesso à página — tudo que não pertence ao modelo de negócio persistido.
- **Campos para interface de usuário**
    - Ex: `mostrarMensagem` ou `exibirDetalhes` que controlam lógica de exibição no front-end mas não fazem parte do domínio persistente.
- **Campos auxiliares em processos complexos**
    - Ex: sinalizadores de validação em tempo de execução, indicadores de fluxo de trabalho que mudam em memória sem persistir.

### 7.2. Evite lógicas pesadas em campos transient

- Como o JPA não persiste campos transient, todo cálculo ou inicialização deve acontecer em métodos de ciclo de vida (@PostLoad, @PrePersist, getters personalizados). Porém, evite colocar processamento pesado diretamente em getters, para não impactar performance em loops de renderização.

### 7.3. Coerência de dados

- Se um campo transient é derivado de outros campos persistidos, certifique-se de que qualquer atualização nos campos base seja refletida no campo transient (por meio de callbacks ou lógica dentro de getters).
- Exemplo inadequado: armazenar em cache valores derivados sem atualizar ao mudar dados de base, levando a inconsistências.

### 7.4. Documentação clara

- Comente sempre que um campo for transient, deixando claro por que não é persistido e de onde vem seu valor. Facilita manutenção futura e evita surpresas para quem herdar o código.

> Tópicos relacionados para aprofundar:
> 
> - Programação defensiva em entidades JPA.
> - Padrão DTO vs. entidades JPA para separar camadas.
> - Usar `@Formula` (Hibernate) quando quiser que o banco calcule o valor.

---

## 8. Exemplos Completos

A seguir, um cenário prático que ilustra um contexto mais amplo de uso de `@Transient` dentro de uma aplicação:

### 8.1. Cenário: Aplicação de pedidos de e-commerce

Imaginemos uma entidade `Pedido` que armazena itens, valores individuais e quantidades. Queremos exibir no frontend o valor total do pedido (soma de item×quantidade + impostos), mas não queremos guardar esse valor no banco — ele pode mudar conforme regras de negócio ou tabelas de imposto. Portanto, teremos um campo transient `valorTotal` que será calculado no momento de carregar ou acessar o pedido.

### 8.1.1. Entidade ItemPedido

```java
@Entity
@Table(name = "item_pedido")
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeProduto;

    private BigDecimal precoUnitario;

    private Integer quantidade;

    // Construtor padrão
    public ItemPedido() { }

    // Construtor completo
    public ItemPedido(String nomeProduto, BigDecimal precoUnitario, Integer quantidade) {
        this.nomeProduto = nomeProduto;
        this.precoUnitario = precoUnitario;
        this.quantidade = quantidade;
    }

    // Getters e Setters
    public Long getId() { return id; }

    public String getNomeProduto() { return nomeProduto; }
    public void setNomeProduto(String nomeProduto) { this.nomeProduto = nomeProduto; }

    public BigDecimal getPrecoUnitario() { return precoUnitario; }
    public void setPrecoUnitario(BigDecimal precoUnitario) { this.precoUnitario = precoUnitario; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    /**
     * Retorna o subtotal do item (preço unitário x quantidade).
     * Não é anotado com @Transient pois é derivado diretamente de campos persistidos.
     */
    @Transient
    public BigDecimal getSubtotal() {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }
}

```

- Neste caso, `getSubtotal()` está anotado com `@Transient`, pois não queremos colunar “subtotal” no banco. É um cálculo local.

### 8.1.2. Entidade Pedido

```java
@Entity
@Table(name = "pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dataCriacao;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    private List<ItemPedido> itens = new ArrayList<>();

    private BigDecimal taxaEntrega;

    private BigDecimal impostos; // Representa valor total de impostos (podem variar)

    /**
     * Campo que representa o valor total do pedido: soma de todos os subtotais de itens
     * + taxa de entrega + impostos. Não queremos armazenar no banco, pois é recalculado
     * sempre que ItemPedido ou imposto muda.
     */
    @Transient
    private BigDecimal valorTotal;

    public Pedido() {
        this.dataCriacao = LocalDate.now();
    }

    // Getters e Setters omissos para brevidade

    public Long getId() { return id; }

    public LocalDate getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDate dataCriacao) { this.dataCriacao = dataCriacao; }

    public List<ItemPedido> getItens() { return itens; }
    public void setItens(List<ItemPedido> itens) { this.itens = itens; }

    public BigDecimal getTaxaEntrega() { return taxaEntrega; }
    public void setTaxaEntrega(BigDecimal taxaEntrega) { this.taxaEntrega = taxaEntrega; }

    public BigDecimal getImpostos() { return impostos; }
    public void setImpostos(BigDecimal impostos) { this.impostos = impostos; }

    /**
     * Calcula o valor total do pedido sempre que solicitado.
     */
    public BigDecimal getValorTotal() {
        BigDecimal somaItens = itens.stream()
            .map(ItemPedido::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal total = somaItens;
        if (taxaEntrega != null) {
            total = total.add(taxaEntrega);
        }
        if (impostos != null) {
            total = total.add(impostos);
        }
        this.valorTotal = total;
        return valorTotal;
    }

    /**
     * Adiciona um item ao pedido e recalcula valorTotal indiretamente.
     */
    public void adicionarItem(ItemPedido item) {
        itens.add(item);
    }
}

```

### 8.1.3. Repositório e Serviço

```java
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    // Métodos customizados, se necessário
}

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    /**
     * Cria e persiste um novo pedido com itens e calcula valorTotal em memória.
     */
    public Pedido criarPedido(Pedido pedido) {
        // Ajustar impostos ou taxas antes de salvar, se necessário
        return pedidoRepository.save(pedido);
    }

    /**
     * Recupera um pedido e demonstra uso do campo transient.
     */
    public BigDecimal obterValorTotalDePedido(Long id) {
        Pedido p = pedidoRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Pedido não encontrado"));
        return p.getValorTotal(); // cálculo dinâmico em memória
    }
}

```

> Tópicos relacionados para aprofundar:
> 
> - Mapeamento de coleções (`@ElementCollection` vs `@OneToMany`).
> - Estratégias de carregamento (`FetchType.LAZY` e `EAGER`).
> - Paginação e performance em consultas JPA.

---

## 9. Sugestões de Tópicos Relacionados para Futuras Solicitações

- **Mapeamento de Relacionamentos em JPA (OneToOne, OneToMany, ManyToOne, ManyToMany)**
    
    Compreender como associar entidades e gerenciar cardinalidade.
    
- **Herança em JPA**
    
    `@Inheritance`, `@MappedSuperclass`, `@DiscriminatorColumn` e estratégias (SINGLE_TABLE, JOINED, TABLE_PER_CLASS).
    
- **Consultas JPA (JPQL e Criteria API)**
    
    Como escrever JPQL, utilizar `EntityManager`, `TypedQuery`, e construir consultas dinâmicas com Criteria API.
    
- **Caching em JPA**
    
    Níveis de cache (primeiro e segundo nível), configurações de cache e uso de `@Cacheable`.
    
- **Mapeamento de Tipos Avançados (LOBs / JSON / UUID)**
    
    Conversores customizados (`AttributeConverter`), uso de `@Lob`, e mapeamento de tipos não triviais.
    
- **Uso de `@Formula` no Hibernate**
    
    Cálculo de colunas diretamente pelo banco antes de retornar à aplicação, comparando com `@Transient`.
    
- **Transações e Isolamento**
    
    Configuração de `@Transactional`, propriedades de isolamento e propagação.
    

---

Com essa explicação, cobrimos os aspectos conceituais, sintáticos, restritivos, práticos e um cenário real de aplicação de **Mapeamento de Colunas: Campos Transient (@Transient)** no contexto de **JPA no Java**. Sinta-se à vontade para pedir mais detalhes sobre qualquer tópico relacionado.