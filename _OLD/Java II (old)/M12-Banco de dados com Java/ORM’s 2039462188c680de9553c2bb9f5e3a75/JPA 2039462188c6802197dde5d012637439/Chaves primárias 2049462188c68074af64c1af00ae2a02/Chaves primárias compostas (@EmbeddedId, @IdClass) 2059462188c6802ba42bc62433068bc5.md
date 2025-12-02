# Chaves primárias compostas (@EmbeddedId, @IdClass)

---

## **Chaves Primárias Compostas em JPA**

### 1\. Introdução

No universo do desenvolvimento de aplicações com bancos de dados relacionais, o gerenciamento da persistência de dados é uma tarefa central. O Java Persistence API (JPA) surge como uma especificação da plataforma Java que oferece uma maneira padronizada e simplificada de mapear objetos Java para entidades de banco de dados, utilizando o paradigma ORM (Object-Relational Mapping). Sua relevância é imensa, pois abstrai grande parte da complexidade de interagir diretamente com SQL, permitindo que os desenvolvedores foquem mais na lógica de negócio e menos nos detalhes de persistência.

O JPA, ao lado de suas implementações como o Hibernate, facilita a manipulação de entidades, transações e consultas de forma orientada a objetos. Uma das pedras angulares do mapeamento ORM é a identificação unívoca de cada registro no banco de dados, o que é feito através das chaves primárias. Embora a maioria dos cenários envolva chaves primárias simples (uma única coluna), existem situações onde a combinação de múltiplas colunas é necessária para identificar um registro de forma única. É nesse ponto que as chaves primárias compostas entram em jogo, garantindo a integridade e a correta recuperação dos dados em modelos de dados mais complexos.

Uma chave primária composta, em resumo, é uma chave primária formada por duas ou mais colunas de uma tabela. No contexto do JPA, ela serve para identificar de forma exclusiva uma entidade no banco de dados quando uma única coluna não é suficiente para tal.

### 2\. Sumário

Nesta explicação detalhada, abordaremos os seguintes tópicos sobre chaves primárias compostas em JPA:

- **Definição e Conceitos Fundamentais**
- **Abordagens para Chaves Primárias Compostas em JPA**
    - **Usando `@EmbeddedId`**
    - **Usando `@IdClass`**
- **Sintaxe e Estrutura**
    - `@EmbeddedId`: Estrutura da classe *embeddable*
    - `@IdClass`: Estrutura da classe ID
- **Componentes Principais e Interação**
- **Restrições de Uso**
- **Exemplos de Código Otimizados**
    - Exemplo `@EmbeddedId`
    - Exemplo `@IdClass`
- **Informações Adicionais**
    - Considerações de Performance
    - Migração de `@IdClass` para `@EmbeddedId`
    - Boas Práticas
- **Referências para Estudo Independente**

### 3\. Conteúdo Detalhado

### Definição e Conceitos Fundamentais

Como mencionado, uma chave primária composta é um conjunto de duas ou mais colunas que, juntas, garantem a unicidade e a identificação de cada linha em uma tabela. No JPA, quando uma entidade não pode ser unicamente identificada por um único atributo, precisamos informar ao framework que a chave primária é composta por múltiplos atributos. Para isso, o JPA oferece duas principais estratégias de mapeamento para chaves primárias compostas: `@EmbeddedId` e `@IdClass`. Ambas as abordagens têm o mesmo objetivo, mas diferem na forma como o ID composto é modelado e acessado na entidade.

### Abordagens para Chaves Primárias Compostas em JPA

### Usando `@EmbeddedId`

A anotação `@EmbeddedId` é utilizada para mapear uma classe *embeddable* (incorporável) como a chave primária da entidade. A classe *embeddable* é uma classe separada que contém os atributos que compõem a chave primária composta. Essa abordagem é geralmente preferida por promover uma melhor encapsulação e organização do código, pois o ID composto é tratado como um objeto único dentro da entidade.

**Para que serve?** Serve para agrupar os atributos que formam a chave primária composta em uma classe separada, que pode ser incorporada diretamente na entidade. Isso torna o modelo mais limpo e orientado a objetos.

### Usando `@IdClass`

A anotação `@IdClass` é usada para especificar uma classe separada que representa a chave primária composta da entidade. Diferente do `@EmbeddedId`, onde a classe *embeddable* é um campo da entidade, com `@IdClass` os atributos da chave primária composta são definidos diretamente na entidade, e a classe `@IdClass` é usada apenas para auxiliar o JPA a entender a estrutura da chave primária. Os atributos da entidade que fazem parte da chave composta devem ser anotados individualmente com `@Id`.

**Para que serve?** Serve para definir a chave primária composta quando, por algum motivo, não se deseja ou não é possível usar uma classe *embeddable* diretamente na entidade. Os campos da chave primária continuam sendo campos da entidade principal.

### Sintaxe e Estrutura

### `@EmbeddedId`: Estrutura da classe *embeddable*

Quando utilizamos `@EmbeddedId`, precisamos criar uma classe separada que representará a chave primária composta. Essa classe deve atender a alguns requisitos:

- Ser anotada com `@Embeddable`.
- Implementar `Serializable`.
- Possuir um construtor público sem argumentos.
- Sobrescrever os métodos `equals()` e `hashCode()` para garantir a correta comparação e hash de objetos.

**Exemplo de declaração:**

```java
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PedidoProdutoId implements Serializable {

    private Long pedidoId;
    private Long produtoId;

    public PedidoProdutoId() {
    }

    public PedidoProdutoId(Long pedidoId, Long produtoId) {
        this.pedidoId = pedidoId;
        this.produtoId = produtoId;
    }

    // Getters e Setters
    public Long getPedidoId() {
        return pedidoId;
    }

    public void setPedidoId(Long pedidoId) {
        this = pedidoId;
    }

    public Long getProdutoId() {
        return produtoId;
    }

    public void setProdutoId(Long produtoId) {
        this.produtoId = produtoId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PedidoProdutoId that = (PedidoProdutoId) o;
        return Objects.equals(pedidoId, that.pedidoId) &&
               Objects.equals(produtoId, that.produtoId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(pedidoId, produtoId);
    }
}

```

Na entidade principal, o campo que representa a chave primária composta é do tipo da classe `PedidoProdutoId` e é anotado com `@EmbeddedId`:

```java
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.JoinColumn;

@Entity
public class PedidoProduto {

    @EmbeddedId
    private PedidoProdutoId id;

    @ManyToOne
    @MapsId("pedidoId") // Mapeia o campo 'pedidoId' do PedidoProdutoId para a coluna da FK de Pedido
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @ManyToOne
    @MapsId("produtoId") // Mapeia o campo 'produtoId' do PedidoProdutoId para a coluna da FK de Produto
    @JoinColumn(name = "produto_id")
    private Produto produto;

    private Integer quantidade;

    // Getters e Setters, construtores
    public PedidoProdutoId getId() {
        return id;
    }

    public void setId(PedidoProdutoId id) {
        this.id = id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
}

```

### `@IdClass`: Estrutura da classe ID

Com `@IdClass`, a classe que representa a chave primária composta não é uma parte *embeddable* da entidade, mas sim uma classe separada que *reflete* os atributos da chave primária presentes na entidade. Os requisitos para essa classe são:

- Implementar `Serializable`.
- Possuir um construtor público sem argumentos.
- Sobrescrever os métodos `equals()` e `hashCode()`.
- Os nomes dos atributos na classe `@IdClass` devem ser **idênticos** aos nomes dos atributos da chave primária na entidade principal.

**Exemplo de declaração:**

```java
import java.io.Serializable;
import java.util.Objects;

public class ItemVendaId implements Serializable {

    private Long vendaId; // Deve ter o mesmo nome do campo 'vendaId' na entidade ItemVenda
    private Integer numeroItem; // Deve ter o mesmo nome do campo 'numeroItem' na entidade ItemVenda

    public ItemVendaId() {
    }

    public ItemVendaId(Long vendaId, Integer numeroItem) {
        this.vendaId = vendaId;
        this.numeroItem = numeroItem;
    }

    // Getters e Setters
    public Long getVendaId() {
        return vendaId;
    }

    public void setVendaId(Long vendaId) {
        this.vendaId = vendaId;
    }

    public Integer getNumeroItem() {
        return numeroItem;
    }

    public void setNumeroItem(Integer numeroItem) {
        this.numeroItem = numeroItem;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ItemVendaId that = (ItemVendaId) o;
        return Objects.equals(vendaId, that.vendaId) &&
               Objects.equals(numeroItem, that.numeroItem);
    }

    @Override
    public int hashCode() {
        return Objects.hash(vendaId, numeroItem);
    }
}

```

Na entidade principal, a anotação `@IdClass` é usada na classe, e cada atributo que compõe a chave primária deve ser anotado com `@Id`:

```java
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
@IdClass(ItemVendaId.class)
public class ItemVenda {

    @Id
    private Long vendaId;

    @Id
    private Integer numeroItem;

    @ManyToOne
    @JoinColumn(name = "venda_id", insertable = false, updatable = false)
    private Venda venda;

    private String descricao;
    private Double valorUnitario;
    private Integer quantidade;

    // Getters e Setters, construtores
    public Long getVendaId() {
        return vendaId;
    }

    public void setVendaId(Long vendaId) {
        this.vendaId = vendaId;
    }

    public Integer getNumeroItem() {
        return numeroItem;
    }

    public void setNumeroItem(Integer numeroItem) {
        this.numeroItem = numeroItem;
    }

    public Venda getVenda() {
        return venda;
    }

    public void setVenda(Venda venda) {
        this.venda = venda;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Double getValorUnitario() {
        return valorUnitario;
    }

    public void setValorUnitario(Double valorUnitario) {
        this.valorUnitario = valorUnitario;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
}

```

### Componentes Principais e Interação

- **Entidade (`@Entity`):** A classe Java que representa uma tabela no banco de dados.
- **`@Id`:** Anotação que marca um campo como parte da chave primária. Usada em conjunto com `@IdClass` para cada atributo da chave composta, ou dentro da classe `@Embeddable` para cada atributo da chave composta.
- **`@Embeddable`:** Anotação que indica que uma classe pode ser incorporada em outras entidades. É usada para a classe que define a chave primária composta em conjunto com `@EmbeddedId`.
- **`@EmbeddedId`:** Anotação aplicada a um campo da entidade, cujo tipo é uma classe `@Embeddable`, indicando que este campo representa a chave primária composta.
- **`@IdClass`:** Anotação aplicada à própria classe da entidade, especificando a classe que contém os atributos da chave primária composta.
- **`Serializable`:** Ambas as classes de ID (para `@EmbeddedId` e `@IdClass`) devem implementar `Serializable` porque os objetos de chave primária podem precisar ser serializados, por exemplo, ao serem transferidos entre camadas da aplicação ou armazenados em cache.
- **`equals()` e `hashCode()`:** A correta implementação desses métodos é crucial para a comparação e hash de objetos de chave primária composta. O JPA (e, por extensão, as implementações como o Hibernate) dependem desses métodos para identificar e gerenciar entidades no contexto de persistência (por exemplo, ao colocar entidades em um `Set` ou `Map`). Sem implementações corretas, operações como `find()` ou `merge()` podem falhar ou se comportar de maneira inesperada.
- **`@MapsId` (com `@EmbeddedId`):** Usada em associações (`@ManyToOne`, `@OneToOne`) para indicar que a chave primária de uma entidade é mapeada a partir da chave primária de outra entidade. No contexto de `@EmbeddedId`, `MapsId` é frequentemente usada para mapear as partes da chave *embeddable* para as chaves estrangeiras da entidade. Isso evita a necessidade de duplicar as colunas de chave estrangeira como campos separados na entidade e garante que o mapeamento da chave composta se alinha com as associações.

### Restrições de Uso

- **Imutabilidade da Chave Primária:** Embora tecnicamente possível alterar uma chave primária composta, é uma má prática e geralmente não recomendado. A chave primária deve ser imutável após a criação da entidade, pois alterações podem levar a problemas de integridade de dados e desempenho.
- **Tipos de Dados:** Os atributos que compõem a chave primária devem ser de tipos de dados primitivos ou seus wrappers, ou tipos de dados que são mapeáveis para colunas de banco de dados (ex: `String`, `Date`, `UUID`).
- **Classes de ID:** As classes de ID (tanto `@Embeddable` quanto a classe referenciada por `@IdClass`) não podem ser entidades (`@Entity`). Elas são apenas auxiliares para definir a chave primária.
- **Nomes dos Campos (`@IdClass`):** É fundamental que os nomes dos campos na classe `@IdClass` sejam idênticos aos nomes dos campos da chave primária na entidade principal. Caso contrário, o JPA não conseguirá fazer o mapeamento correto.
- **Campos de Chave Estrangeira em `@IdClass`:** Ao usar `@IdClass` com chaves estrangeiras que fazem parte da chave primária composta, as colunas de `JoinColumn` correspondentes devem ter `insertable = false` e `updatable = false` para evitar que o JPA tente inserir ou atualizar esses campos através da associação, uma vez que eles já estão sendo tratados como parte da chave primária.

### 4\. Exemplos de Código Otimizados

Vamos aprofundar nos exemplos práticos para Gedê, mostrando cenários comuns no dia a dia de um desenvolvedor.

### Exemplo `@EmbeddedId`: Tabela Associativa com Atributos Adicionais

Considere um sistema de e-commerce onde um `Pedido` pode ter vários `Produtos`, e queremos registrar a `quantidade` de cada produto em um pedido. A tabela `pedido_produto` servirá como uma tabela associativa (muitos-para-muitos), e sua chave primária será a combinação do ID do pedido e do ID do produto. Além disso, teremos um atributo `quantidade` nessa tabela.

**Estrutura do Banco de Dados:**

```sql
CREATE TABLE pedido (
    id BIGINT PRIMARY KEY,
    data_pedido DATE,
    -- outros campos
);

CREATE TABLE produto (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(255),
    preco DECIMAL(10, 2),
    -- outros campos
);

CREATE TABLE pedido_produto (
    pedido_id BIGINT,
    produto_id BIGINT,
    quantidade INT,
    PRIMARY KEY (pedido_id, produto_id),
    FOREIGN KEY (pedido_id) REFERENCES pedido(id),
    FOREIGN KEY (produto_id) REFERENCES produto(id)
);

```

**Classe `PedidoProdutoId` (Embeddable ID):**

```java
package com.gededeveloper.ecommerce.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/**
 * Representa a chave primária composta da entidade PedidoProduto.
 * É uma classe @Embeddable, utilizada com @EmbeddedId na entidade principal.
 */
@Embeddable
public class PedidoProdutoId implements Serializable {

    private static final long serialVersionUID = 1L; // Boa prática para Serializable

    private Long pedidoId;
    private Long produtoId;

    // Construtor padrão (obrigatório para JPA)
    public PedidoProdutoId() {
    }

    // Construtor com argumentos para facilidade de uso
    public PedidoProdutoId(Long pedidoId, Long produtoId) {
        this.pedidoId = pedidoId;
        this.produtoId = produtoId;
    }

    // Getters e Setters
    public Long getPedidoId() {
        return pedidoId;
    }

    public void setPedidoId(Long pedidoId) {
        this.pedidoId = pedido;
    }

    public Long getProdutoId() {
        return produtoId;
    }

    public void setProdutoId(Long produtoId) {
        this.produtoId = produto;
    }

    /**
     * Importante sobrescrever equals e hashCode para garantir a correta comparação
     * e funcionamento de coleções e operações de persistência do JPA.
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PedidoProdutoId that = (PedidoProdutoId) o;
        return Objects.equals(pedidoId, that.pedidoId) &&
               Objects.equals(produtoId, that.produtoId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(pedidoId, produtoId);
    }

    @Override
    public String toString() {
        return "PedidoProdutoId{" +
               "pedidoId=" + pedidoId +
               ", produtoId=" + produtoId +
               '}';
    }
}

```

**Entidade `PedidoProduto`:**

```java
package com.gededeveloper.ecommerce.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.JoinColumn;

/**
 * Entidade que representa a associação entre Pedido e Produto,
 * com uma chave primária composta e um atributo adicional (quantidade).
 */
@Entity
@Table(name = "pedido_produto")
public class PedidoProduto {

    @EmbeddedId
    private PedidoProdutoId id;

    // Mapeamento da relação ManyToOne com Pedido.
    // @MapsId("pedidoId") indica que o campo 'pedidoId' do PedidoProdutoId
    // é a parte da chave primária que corresponde à chave estrangeira para Pedido.
    @ManyToOne
    @MapsId("pedidoId")
    @JoinColumn(name = "pedido_id") // Nome da coluna no banco de dados
    private Pedido pedido;

    // Mapeamento da relação ManyToOne com Produto.
    // @MapsId("produtoId") indica que o campo 'produtoId' do PedidoProdutoId
    // é a parte da chave primária que corresponde à chave estrangeira para Produto.
    @ManyToOne
    @MapsId("produtoId")
    @JoinColumn(name = "produto_id") // Nome da coluna no banco de dados
    private Produto produto;

    private Integer quantidade;

    // Construtor padrão (obrigatório para JPA)
    public PedidoProduto() {
        this.id = new PedidoProdutoId(); // Inicializa o ID composto
    }

    public PedidoProduto(Pedido pedido, Produto produto, Integer quantidade) {
        this.pedido = pedido;
        this.produto = produto;
        this.quantidade = quantidade;
        this.id = new PedidoProdutoId(pedido.getId(), produto.getId());
    }

    // Getters e Setters
    public PedidoProdutoId getId() {
        return id;
    }

    public void setId(PedidoProdutoId id) {
        this.id = id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
        // Atualiza a parte do ID composto se o pedido for alterado
        if (this.id == null) {
            this.id = new PedidoProdutoId();
        }
        this.id.setPedidoId(pedido != null ? pedido.getId() : null);
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
        // Atualiza a parte do ID composto se o produto for alterado
        if (this.id == null) {
            this.id = new PedidoProdutoId();
        }
        this.id.setProdutoId(produto != null ? produto.getId() : null);
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PedidoProduto that = (PedidoProduto) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

```

**Exemplo de uso (`@EmbeddedId`):**

```java
import com.gededeveloper.ecommerce.model.Pedido;
import com.gededeveloper.ecommerce.model.Produto;
import com.gededeveloper.ecommerce.model.PedidoProduto;
import com.gededeveloper.ecommerce.model.PedidoProdutoId;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class PedidoProdutoService {

    private EntityManagerFactory emf;

    public PedidoProdutoService() {
        // "ecommerce-unit" deve ser o nome da sua unidade de persistência no persistence.xml
        this.emf = Persistence.createEntityManagerFactory("ecommerce-unit");
    }

    public void adicionarProdutoAoPedido(Long pedidoId, Long produtoId, Integer quantidade) {
        EntityManager em = emf.createEntityManager();
        em.getTransaction().begin();
        try {
            Pedido pedido = em.find(Pedido.class, pedidoId);
            Produto produto = em.find(Produto.class, produtoId);

            if (pedido == null || produto == null) {
                System.out.println("Pedido ou Produto não encontrado.");
                return;
            }

            PedidoProduto pedidoProduto = new PedidoProduto(pedido, produto, quantidade);
            em.persist(pedidoProduto); // Persiste a entidade associativa

            em.getTransaction().commit();
            System.out.println("Produto " + produto.getNome() + " adicionado ao Pedido " + pedido.getId() + " com quantidade " + quantidade);

        } catch (Exception e) {
            em.getTransaction().rollback();
            System.err.println("Erro ao adicionar produto ao pedido: " + e.getMessage());
            e.printStackTrace();
        } finally {
            em.close();
        }
    }

    public PedidoProduto buscarPedidoProduto(Long pedidoId, Long produtoId) {
        EntityManager em = emf.createEntityManager();
        try {
            PedidoProdutoId id = new PedidoProdutoId(pedidoId, produtoId);
            return em.find(PedidoProduto.class, id); // Busca pela chave primária composta
        } finally {
            em.close();
        }
    }

    // Exemplo de entidades Pedido e Produto simplificadas para compilação
    // (Em um projeto real, estas seriam entidades completas com seus próprios IDs)
    @Entity
    @Table(name = "pedido")
    public static class Pedido {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private LocalDate dataPedido;

        public Pedido() {}
        public Pedido(LocalDate dataPedido) { this.dataPedido = dataPedido; }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public LocalDate getDataPedido() { return dataPedido; }
        public void setDataPedido(LocalDate dataPedido) { this.dataPedido = dataPedido; }
    }

    @Entity
    @Table(name = "produto")
    public static class Produto {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String nome;
        private BigDecimal preco;

        public Produto() {}
        public Produto(String nome, BigDecimal preco) { this.nome = nome; this.preco = preco; }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
        public BigDecimal getPreco() { return preco; }
        public void setPreco(BigDecimal preco) { this.preco = preco; }
    }
}

```

### Exemplo `@IdClass`: Entidade com Chave Composta de Colunas Existentes

Imagine um sistema de controle de versões onde cada `VersaoDocumento` é identificada pelo `idDocumento` e um `numeroRevisao`.

**Estrutura do Banco de Dados:**

```sql
CREATE TABLE documento (
    id BIGINT PRIMARY KEY,
    titulo VARCHAR(255)
);

CREATE TABLE versao_documento (
    documento_id BIGINT,
    numero_revisao INT,
    conteudo TEXT,
    data_criacao DATE,
    PRIMARY KEY (documento_id, numero_revisao),
    FOREIGN KEY (documento_id) REFERENCES documento(id)
);

```

**Classe `VersaoDocumentoId` (ID Class):**

```java
package com.gededeveloper.documents.model;

import java.io.Serializable;
import java.util.Objects;

/**
 * Representa a chave primária composta para a entidade VersaoDocumento.
 * Usada com @IdClass. Os nomes dos atributos devem ser idênticos aos da entidade.
 */
public class VersaoDocumentoId implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long documentoId; // Deve corresponder a 'documentoId' na entidade VersaoDocumento
    private Integer numeroRevisao; // Deve corresponder a 'numeroRevisao' na entidade VersaoDocumento

    // Construtor padrão (obrigatório para JPA)
    public VersaoDocumentoId() {
    }

    // Construtor com argumentos
    public VersaoDocumentoId(Long documentoId, Integer numeroRevisao) {
        this.documentoId = documentoId;
        this.numeroRevisao = numeroRevisao;
    }

    // Getters e Setters
    public Long getDocumentoId() {
        return documentoId;
    }

    public void setDocumentoId(Long documentoId) {
        this.documentoId = documentoId;
    }

    public Integer getNumeroRevisao() {
        return numeroRevisao;
    }

    public void setNumeroRevisao(Integer numeroRevisao) {
        this.numeroRevisao = numeroRevisao;
    }

    /**
     * Importante sobrescrever equals e hashCode.
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VersaoDocumentoId that = (VersaoDocumentoId) o;
        return Objects.equals(documentoId, that.documentoId) &&
               Objects.equals(numeroRevisao, that.numeroRevisao);
    }

    @Override
    public int hashCode() {
        return Objects.hash(documentoId, numeroRevisao);
    }

    @Override
    public String toString() {
        return "VersaoDocumentoId{" +
               "documentoId=" + documentoId +
               ", numeroRevisao=" + numeroRevisao +
               '}';
    }
}

```

**Entidade `VersaoDocumento`:**

```java
package com.gededeveloper.documents.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import java.time.LocalDate;

/**
 * Entidade que representa uma versão de um documento, com chave primária composta
 * definida através de @IdClass.
 */
@Entity
@Table(name = "versao_documento")
@IdClass(VersaoDocumentoId.class) // Indica a classe que define a chave composta
public class VersaoDocumento {

    @Id // Marca como parte da chave primária
    @JoinColumn(name = "documento_id", referencedColumnName = "id") // Mapeia a FK para a tabela Documento
    private Long documentoId; // Nome do campo deve ser idêntico ao da classe VersaoDocumentoId

    @Id // Marca como parte da chave primária
    private Integer numeroRevisao; // Nome do campo deve ser idêntico ao da classe VersaoDocumentoId

    // Mapeamento da relação ManyToOne com Documento.
    // insertable = false, updatable = false são importantes aqui porque
    // 'documentoId' já é tratado como parte da chave primária composta acima.
    @ManyToOne
    @JoinColumn(name = "documento_id", insertable = false, updatable = false)
    private Documento documento;

    private String conteudo;
    private LocalDate dataCriacao;

    // Construtor padrão
    public VersaoDocumento() {}

    // Construtor para facilitar a criação
    public VersaoDocumento(Documento documento, Integer numeroRevisao, String conteudo, LocalDate dataCriacao) {
        this.documento = documento;
        this.documentoId = documento.getId(); // Atribui o ID do documento
        this.numeroRevisao = numeroRevisao;
        this.conteudo = conteudo;
        this.dataCriacao = dataCriacao;
    }

    // Getters e Setters
    public Long getDocumentoId() {
        return documentoId;
    }

    public void setDocumentoId(Long documentoId) {
        this.documentoId = documentoId;
    }

    public Integer getNumeroRevisao() {
        return numeroRevisao;
    }

    public void setNumeroRevisao(Integer numeroRevisao) {
        this.numeroRevisao = numeroRevisao;
    }

    public Documento getDocumento() {
        return documento;
    }

    public void setDocumento(Documento documento) {
        this.documento = documento;
        // Garante que o documentoId da entidade seja atualizado quando o objeto documento for setado
        this.documentoId = (documento != null) ? documento.getId() : null;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public LocalDate getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDate dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    // Não precisamos sobrescrever equals/hashCode na entidade aqui,
    // pois a lógica de igualdade da chave é delegada à classe VersaoDocumentoId.
    // Contudo, para fins de consistência e em cenários mais complexos,
    // ainda pode ser uma boa prática delegar a equals/hashCode da entidade
    // para a classe de ID se ela estiver completamente encapsulada.
}

```

**Exemplo de uso (`@IdClass`):**

```java
import com.gededeveloper.documents.model.Documento;
import com.gededeveloper.documents.model.VersaoDocumento;
import com.gededeveloper.documents.model.VersaoDocumentoId;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.persistence.GenerationType;
import jakarta.persistence.GeneratedValue;
import java.time.LocalDate;
import java.math.BigDecimal; // Importe BigDecimal

public class DocumentoService {

    private EntityManagerFactory emf;

    public DocumentoService() {
        this.emf = Persistence.createEntityManagerFactory("documents-unit");
    }

    public void criarNovaVersaoDocumento(Long documentoId, String conteudo) {
        EntityManager em = emf.createEntityManager();
        em.getTransaction().begin();
        try {
            Documento documento = em.find(Documento.class, documentoId);

            if (documento == null) {
                System.out.println("Documento não encontrado.");
                return;
            }

            // Busca a última revisão para criar uma nova
            Integer proximaRevisao = 1;
            try {
                proximaRevisao = em.createQuery(
                    "SELECT COALESCE(MAX(vd.numeroRevisao), 0) + 1 FROM VersaoDocumento vd WHERE vd.documentoId = :docId", Integer.class)
                    .setParameter("docId", documentoId)
                    .getSingleResult();
            } catch (Exception e) {
                // Se não houver versões, proximaRevisao permanece 1
                System.out.println("Primeira versão para o documento " + documentoId);
            }

            VersaoDocumento novaVersao = new VersaoDocumento(documento, proximaRevisao, conteudo, LocalDate.now());
            em.persist(novaVersao);

            em.getTransaction().commit();
            System.out.println("Nova versão " + proximaRevisao + " criada para o Documento " + documentoId);

        } catch (Exception e) {
            em.getTransaction().rollback();
            System.err.println("Erro ao criar nova versão do documento: " + e.getMessage());
            e.printStackTrace();
        } finally {
            em.close();
        }
    }

    public VersaoDocumento buscarVersaoDocumento(Long documentoId, Integer numeroRevisao) {
        EntityManager em = emf.createEntityManager();
        try {
            // Com @IdClass, você pode passar os atributos da chave diretamente para find,
            // ou criar uma instância da classe de ID e passar, dependendo da implementação do provider.
            // A forma mais robusta e portátil é criar a instância da classe de ID.
            VersaoDocumentoId id = new VersaoDocumentoId(documentoId, numeroRevisao);
            return em.find(VersaoDocumento.class, id);
        } finally {
            em.close();
        }
    }

    // Exemplo de entidade Documento simplificada
    @Entity
    @Table(name = "documento")
    public static class Documento {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String titulo;

        public Documento() {}
        public Documento(String titulo) { this.titulo = titulo; }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitulo() { return titulo; }
        public void setTitulo(String titulo) { this.titulo = titulo; }
    }
}

```

### 5\. Informações Adicionais

### Considerações de Performance

- **Consultas:** Ao trabalhar com chaves primárias compostas, as consultas JPQL/Criteria API devem considerar todos os componentes da chave para buscar uma entidade específica. Buscar por apenas uma parte da chave composta pode não ser eficiente ou pode retornar múltiplos resultados (se a chave parcial não for única).
- **Indices:** Certifique-se de que o banco de dados possua índices adequados nas colunas que formam a chave primária composta. O JPA, por padrão, geralmente cria um índice para a chave primária, mas em casos de chaves estrangeiras que fazem parte da chave composta, índices adicionais podem ser benéficos.
- **Overhead de Objetos:** Com `@EmbeddedId`, há a criação de um objeto adicional para representar a chave composta. Embora isso seja um custo menor na maioria das aplicações, é uma consideração para sistemas com extrema sensibilidade a micro-otimizações. `@IdClass` evita esse objeto extra na entidade, mas exige que os campos da chave estejam diretamente na entidade.

### Migração de `@IdClass` para `@EmbeddedId`

A transição de `@IdClass` para `@EmbeddedId` é frequentemente recomendada por oferecer melhor encapsulamento e modelagem orientada a objetos. O processo envolve:

1. Criar a nova classe `@Embeddable` com os atributos da chave e os métodos `equals()`/`hashCode()`.
2. Remover as anotações `@Id` e `@IdClass` da entidade principal.
3. Adicionar um campo do tipo da nova classe `@Embeddable` na entidade, anotado com `@EmbeddedId`.
4. Ajustar as associações (`@ManyToOne`, `@OneToOne`) para usar `@MapsId` se as chaves estrangeiras fizerem parte da chave primária composta.
5. Atualizar o código que interage com a chave primária da entidade para usar o novo objeto `@EmbeddedId`.

### Boas Práticas

- **Sempre sobrescreva `equals()` e `hashCode()`:** Este é o ponto mais crítico. Sem implementações corretas, o JPA não conseguirá gerenciar o estado das entidades com chaves compostas de forma confiável.
- **Imutabilidade da Classe de ID:** Torne a classe de ID (tanto `@Embeddable` quanto a classe para `@IdClass`) o mais imutável possível. Isso significa que seus campos devem ser `final` se possível, e os setters devem ser evitados após a inicialização.
- **Escolha `@EmbeddedId` quando possível:** Na maioria dos casos, `@EmbeddedId` é a abordagem preferida devido à sua natureza mais orientada a objetos e à melhor encapsulação da lógica da chave primária.
- **Clareza no Nome:** Dê nomes claros para suas classes de ID (ex: `PedidoProdutoId`, `ItemVendaId`) para indicar seu propósito.
- **Evite chaves primárias compostas excessivamente complexas:** Se a chave primária composta tiver muitos atributos, pode indicar um problema no design do seu modelo de dados. Considere a possibilidade de usar um ID artificial ( surrogate key) com um índice composto separado.

### 6\. Referências para Estudo Independente

Para aprofundar seus conhecimentos em JPA e chaves primárias compostas, Gedê, recomendo as seguintes referências:

- **Documentação Oficial Jakarta Persistence (JPA):**
    - A especificação é a fonte definitiva. Embora possa ser um pouco densa, é onde você encontrará todos os detalhes. Procure pela versão mais recente (Jakarta Persistence 3.1 ou superior).
    - [Jakarta Persistence Specification](https://jakarta.ee/specifications/persistence/3.1/)
- **Hibernate Documentation (como uma implementação líder):**
    - A documentação do Hibernate é excelente para entender como o JPA é implementado e oferece muitos exemplos práticos.
    - [Hibernate ORM User Guide](https://www.google.com/search?q=https://docs.jboss.org/hibernate/orm/6.4/userguide/html_single/Hibernate_User_Guide.html%23identifiers-composite) (Procure pela seção sobre "Composite Identifiers")
- **Artigos e Tutoriais Confiáveis:**
    - **Baeldung:** Um dos melhores recursos para tutoriais e exemplos práticos em Java e Spring.
        - [JPA @EmbeddedId and @IdClass Examples](https://www.baeldung.com/jpa-composite-primary-keys)
    - **Thorben Janssen (Thoughts on Java):** Blog focado em JPA e Hibernate com explicações aprofundadas.
        - [JPA @EmbeddedId vs @IdClass](https://www.google.com/search?q=https://thorben-janssen.com/jpa-composite-primary-keys/)
- **Livros Relevantes:**
    - **"Pro JPA 2 in Java EE 8: An In-Depth Guide to the Java Persistence API"** por Mike Keith, Merrick Schincariol. (Embora seja uma versão anterior do JPA, os conceitos de chaves compostas são amplamente os mesmos e muito bem explicados).
    - **"Java Persistence with Hibernate"** por Christian Bauer, Gavin King, Gary Gregory. (Um clássico para quem usa Hibernate, com explicações detalhadas sobre o mapeamento de entidades).

---

Espero que esta explicação detalhada, A.R.I.A. (Assistente Rápida para Idiotas Atarefados), seja extremamente útil para você, Gedê, em sua jornada de desenvolvimento\! Entender as nuances das chaves primárias compostas é um diferencial para construir aplicações robustas e bem mapeadas. Se tiver mais alguma dúvida, é só chamar\!