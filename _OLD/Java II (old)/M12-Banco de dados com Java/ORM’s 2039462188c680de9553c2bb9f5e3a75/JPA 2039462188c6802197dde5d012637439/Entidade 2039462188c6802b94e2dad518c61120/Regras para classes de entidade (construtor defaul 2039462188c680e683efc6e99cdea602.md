# Regras para classes de entidade (construtor default, campos non-final, getters/setters)

Olá, Gedê\!

Com certeza, posso te ajudar a entender melhor o JPA e as regras para entidades. Como um desenvolvedor Backend Java em busca de um cargo Backend GO, compreender a persistência de dados é fundamental, e o JPA é um pilar importante no ecossistema Java.

## Introdução ao JPA e Entidades

O **JPA (Java Persistence API)** é uma especificação Java que define uma API padrão para o mapeamento objeto-relacional (ORM) e a persistência de dados em aplicações Java. Em termos mais simples, o JPA permite que os desenvolvedores trabalhem com objetos Java em suas aplicações, e o JPA se encarrega de mapear esses objetos para tabelas em um banco de dados relacional. Isso significa que você pode interagir com o banco de dados usando objetos, sem a necessidade de escrever SQL diretamente para a maioria das operações de persistência.

A relevância e importância do JPA no contexto do desenvolvimento de sistemas são imensas. Ele abstrai a complexidade do acesso a bancos de dados, tornando o desenvolvimento mais rápido e menos propenso a erros. Ao usar o JPA, os desenvolvedores podem se concentrar na lógica de negócios da aplicação, em vez de se preocupar com os detalhes de como os dados são armazenados e recuperados do banco de dados. Isso promove um código mais limpo, manutenível e portável entre diferentes bancos de dados.

O **tema principal** aqui é o **JPA**, que serve como uma ponte entre o mundo orientado a objetos do Java e o mundo relacional dos bancos de dados. Ele define como os objetos Java são mapeados para registros de banco de dados e vice-versa. Os **subtemas**, como as **Entidades (Entities)**, são os blocos de construção fundamentais do JPA. Uma entidade é uma classe Java que representa uma tabela em um banco de dados, e suas instâncias representam linhas nessa tabela. As entidades são a maneira como o JPA permite que você interaja com seus dados de forma orientada a objetos.

## Sumário

1. **Entidades (Entities) no JPA**
    - Definição e Finalidade
    - Regras para Classes de Entidade
        - Construtor Padrão (default)
        - Campos Não-Finais (non-final)
        - Getters e Setters
        - Anotação `@Entity`
        - Anotação `@Id`
    - Ciclo de Vida das Entidades

## Conteúdo Detalhado

### Entidades (Entities) no JPA

### Definição e Finalidade

No JPA, uma **entidade** é uma classe Java simples (POJO - Plain Old Java Object) que representa uma tabela em um banco de dados relacional. Cada instância dessa classe corresponde a uma linha na tabela. A principal finalidade das entidades é fornecer uma representação orientada a objetos dos dados armazenados no banco de dados, permitindo que os desenvolvedores manipulem esses dados usando métodos e propriedades de objetos Java, em vez de comandos SQL complexos.

Quando você está desenvolvendo uma aplicação, digamos para um sistema de gestão de produtos, você criaria uma classe `Produto` como uma entidade JPA. Cada objeto `Produto` representaria um produto específico no seu estoque, com atributos como nome, preço, descrição, etc., que seriam mapeados para as colunas da tabela `produtos` no seu banco de dados.

### Regras para Classes de Entidade

Para que uma classe Java seja considerada uma entidade JPA e possa ser gerenciada por um provedor JPA (como o Hibernate, EclipseLink, etc.), ela precisa seguir um conjunto de regras específicas. Essas regras garantem que o provedor JPA possa criar instâncias da classe, persistir seus estados e gerenciar seu ciclo de vida.

### Construtor Padrão (default)

Toda classe de entidade JPA **DEVE** ter um construtor público ou protegido (com visibilidade de pacote) sem argumentos (também conhecido como construtor padrão ou default). Este construtor é essencial porque o provedor JPA o utiliza para instanciar objetos da entidade quando recupera dados do banco de dados. Mesmo que você defina outros construtores com argumentos, o construtor padrão ainda é obrigatório.

```java
// Exemplo de Construtor Padrão
@Entity
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private Double preco;

    // Construtor padrão (obrigatório para entidades JPA)
    public Produto() {
    }

    // Outros construtores podem existir, mas o padrão é obrigatório
    public Produto(String nome, Double preco) {
        this.nome = nome;
        this.preco = preco;
    }

    // ... getters e setters
}

```

### Campos Não-Finais (non-final)

Os campos persistentes (atributos que serão mapeados para colunas no banco de dados) de uma entidade JPA **NÃO DEVEM** ser declarados como `final`. A razão para isso é que o provedor JPA precisa ser capaz de alterar os valores desses campos ao carregar dados do banco de dados. Se um campo fosse `final`, seu valor só poderia ser atribuído uma vez (geralmente no construtor), o que impediria o JPA de preenchê-lo com os dados persistidos.

```java
// Exemplo de campos non-final
@Entity
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome; // Correto: não é final
    private String email; // Correto: não é final

    // private final String cpf; // Errado: campo final não pode ser persistido pelo JPA

    public Cliente() {
    }

    // ... getters e setters
}

```

### Getters e Setters

Embora não seja estritamente uma regra obrigatória que impeça o JPA de funcionar, é uma **melhor prática e altamente recomendado** que todos os campos persistentes de uma entidade tenham métodos `getter` e `setter` públicos. O provedor JPA utiliza esses métodos para acessar e modificar os valores dos atributos da entidade. Embora o JPA possa, em alguns casos, acessar campos diretamente através de reflexão, o uso de getters e setters promove o encapsulamento, facilita a depuração e permite que você adicione lógica de validação ou transformação nos métodos, se necessário.

```java
// Exemplo de Getters e Setters
@Entity
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String descricao;
    private Double valorTotal;

    public Pedido() {
    }

    public Long getId() {
        return id;
    }

    // Geralmente não é necessário um setId se o ID é gerado automaticamente pelo banco
    // public void setId(Long id) {
    //     this.id = id;
    // }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }
}

```

### Anotação `@Entity`

A anotação `@Entity` é a mais fundamental para marcar uma classe como uma entidade JPA. Ela indica ao provedor JPA que esta classe é uma entidade persistente e que suas instâncias devem ser gerenciadas no contexto de persistência. Por padrão, o nome da tabela no banco de dados será o mesmo nome da classe, mas você pode personalizá-lo usando a anotação `@Table`.

```java
// Exemplo de @Entity
import jakarta.persistence.Entity; // Importe de jakarta.persistence para JPA moderno
import jakarta.persistence.Table;

@Entity // Marca a classe como uma entidade JPA
@Table(name = "usuarios") // Opcional: define o nome da tabela no banco de dados
public class Usuario {
    // ... atributos e métodos
}

```

### Anotação `@Id`

Toda entidade JPA **DEVE** ter um campo que atue como chave primária. Este campo é identificado pela anotação `@Id`. A chave primária é fundamental para identificar unicamente cada linha na tabela correspondente. É comum usar a anotação `@GeneratedValue` em conjunto com `@Id` para indicar que o valor da chave primária será gerado automaticamente pelo banco de dados.

```java
// Exemplo de @Id e @GeneratedValue
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Departamento {

    @Id // Marca o campo como a chave primária
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Indica que o ID será gerado automaticamente pelo banco
    private Long id;
    private String nome;

    // ... construtores, getters e setters
}

```

### Ciclo de Vida das Entidades

As entidades JPA possuem um ciclo de vida que descreve os diferentes estados em que uma instância de entidade pode estar, desde sua criação até sua remoção. Compreender esses estados é crucial para entender como o JPA gerencia os dados. Os principais estados são:

- **New (Transitório/Transient):** Uma instância de entidade está no estado "novo" quando foi criada usando o operador `new`, mas ainda não foi associada a um contexto de persistência (ou seja, não foi persistida). Ela não tem uma representação correspondente no banco de dados.
    
    ```java
    Produto novoProduto = new Produto("Teclado Mecânico", 350.00); // Estado New
    
    ```
    
- **Managed (Gerenciado/Persistent):** Uma instância de entidade entra no estado "gerenciado" quando é persistida ou anexada a um contexto de persistência. Nesse estado, qualquer alteração nos seus atributos será sincronizada com o banco de dados.
    
    ```java
    entityManager.persist(novoProduto); // Agora novoProduto está no estado Managed
    
    ```
    
- **Detached (Desanexado/Detached):** Uma instância de entidade se torna "desanexada" quando é removida do contexto de persistência. Isso pode acontecer, por exemplo, quando a transação é commitada, o `EntityManager` é fechado, ou explicitamente através do método `detach()`. Alterações em uma entidade desanexada não serão sincronizadas automaticamente com o banco de dados.
    
    ```java
    entityManager.detach(produtoExistente); // produtoExistente agora está Detached
    
    ```
    
- **Removed (Removido):** Uma instância de entidade entra no estado "removido" quando é marcada para exclusão do banco de dados. A exclusão real ocorre quando a transação é commitada.
    
    ```java
    entityManager.remove(produtoParaRemover); // produtoParaRemover está no estado Removed
    
    ```
    

## Exemplos de Código Otimizados

Vamos consolidar as regras em um exemplo de uma entidade `Livro`, que poderia ser usada em um sistema de gerenciamento de biblioteca.

```java
package com.gedegus.jpaexample.entity; // Exemplo de pacote

import jakarta.persistence.Column; // Para mapear colunas
import jakarta.persistence.Entity; // Para marcar a classe como entidade
import jakarta.persistence.GeneratedValue; // Para geração automática de IDs
import jakarta.persistence.GenerationType; // Estratégia de geração de IDs
import jakarta.persistence.Id; // Para marcar a chave primária
import jakarta.persistence.Table; // Opcional: para definir o nome da tabela

/**
 * Representa um livro no sistema de gerenciamento de biblioteca.
 * Esta é uma entidade JPA mapeada para a tabela "livros" no banco de dados.
 */
@Entity // 1. Anotação essencial para marcar a classe como entidade JPA.
@Table(name = "livros") // Opcional: Define o nome da tabela no banco de dados. Por padrão, seria "Livro".
public class Livro {

    @Id // 2. Marca o campo 'id' como a chave primária da entidade.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 3. Indica que o valor do ID será gerado automaticamente pelo banco de dados (auto-incremento).
    private Long id; // ID único do livro. Campo non-final.

    @Column(nullable = false, length = 255) // Opcional: Define propriedades da coluna no banco de dados.
    private String titulo; // Título do livro. Campo non-final.

    @Column(nullable = false, length = 100)
    private String autor; // Autor do livro. Campo non-final.

    @Column(name = "ano_publicacao") // Opcional: Define o nome da coluna no banco de dados.
    private Integer anoPublicacao; // Ano de publicação do livro. Campo non-final.

    // 4. Construtor padrão (default) sem argumentos.
    // O JPA exige um construtor público ou protegido sem argumentos para instanciar a entidade.
    public Livro() {
        // Construtor vazio necessário para o JPA
    }

    // Construtor com argumentos para facilitar a criação de objetos no código.
    public Livro(String titulo, String autor, Integer anoPublicacao) {
        this.titulo = titulo;
        this.autor = autor;
        this.anoPublicacao = anoPublicacao;
    }

    // 5. Getters e Setters para todos os campos persistentes (atributos mapeados para colunas).
    // Embora não estritamente obrigatório em todos os provedores JPA (alguns podem usar reflexão direta),
    // é uma melhor prática para encapsulamento e para permitir lógica de negócio nos acessores.

    public Long getId() {
        return id;
    }

    // Geralmente, o setter para o ID não é necessário se ele for gerado automaticamente pelo banco.
    // public void setId(Long id) {
    //     this.id = id;
    // }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public Integer getAnoPublicacao() {
        return anoPublicacao;
    }

    public void setAnoPublicacao(Integer anoPublicacao) {
        this.anoPublicacao = anoPublicacao;
    }

    // Opcional: Sobrescrever toString() para facilitar a depuração.
    @Override
    public String toString() {
        return "Livro{" +
               "id=" + id +
               ", titulo='" + titulo + '\\'' +
               ", autor='" + autor + '\\'' +
               ", anoPublicacao=" + anoPublicacao +
               '}';
    }

    // Opcional: Sobrescrever equals() e hashCode() é uma boa prática para entidades,
    // especialmente ao trabalhar com coleções e testes de igualdade.
    // Para entidades, geralmente é recomendado usar o ID para comparar igualdade,
    // mas com cautela para objetos recém-criados que ainda não têm ID persistido.
    // Uma abordagem comum é usar o ID se não for nulo, caso contrário, comparar por outros atributos.
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Livro livro = (Livro) o;
        // Se o ID é nulo, estamos comparando objetos transient ou recém-persistidos.
        // Nesses casos, a comparação por ID pode não ser suficiente ou correta.
        // É um tópico mais avançado e depende do caso de uso.
        // Para simplicidade, vamos comparar por ID se ele existe.
        return id != null && id.equals(livro.id);
    }

    @Override
    public int hashCode() {
        // Usa o ID para gerar o hash code.
        return id != null ? id.hashCode() : 0;
    }
}

```

### Exemplo de Uso (Contexto de Persistência)

Para ilustrar o uso, considere um cenário simples com um `EntityManager` (que é a interface central do JPA para operações de persistência):

```java
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class LivroService {

    private final EntityManagerFactory emf;

    public LivroService() {
        // "minha-unidade-de-persistencia" deve ser o nome da sua unidade de persistência no persistence.xml
        this.emf = Persistence.createEntityManagerFactory("minha-unidade-de-persistencia");
    }

    public Livro salvarLivro(Livro livro) {
        EntityManager em = emf.createEntityManager();
        em.getTransaction().begin(); // Inicia uma transação

        try {
            em.persist(livro); // Persiste a entidade Livro no banco de dados (estado Managed)
            em.getTransaction().commit(); // Confirma a transação
            System.out.println("Livro salvo: " + livro);
        } catch (Exception e) {
            em.getTransaction().rollback(); // Em caso de erro, desfaz a transação
            System.err.println("Erro ao salvar livro: " + e.getMessage());
        } finally {
            em.close(); // Fecha o EntityManager
        }
        return livro;
    }

    public Livro buscarLivroPorId(Long id) {
        EntityManager em = emf.createEntityManager();
        Livro livro = em.find(Livro.class, id); // Busca um livro pelo ID
        em.close();
        return livro;
    }

    public void atualizarLivro(Livro livro) {
        EntityManager em = emf.createEntityManager();
        em.getTransaction().begin();
        try {
            // A entidade 'livro' pode estar Detached se veio de fora do contexto.
            // O merge a traz de volta ao estado Managed ou a persiste se for nova.
            em.merge(livro);
            em.getTransaction().commit();
            System.out.println("Livro atualizado: " + livro);
        } catch (Exception e) {
            em.getTransaction().rollback();
            System.err.println("Erro ao atualizar livro: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    public void deletarLivro(Long id) {
        EntityManager em = emf.createEntityManager();
        em.getTransaction().begin();
        try {
            Livro livro = em.find(Livro.class, id); // Primeiro, encontra a entidade
            if (livro != null) {
                em.remove(livro); // Marca a entidade para remoção (estado Removed)
                System.out.println("Livro com ID " + id + " removido.");
            } else {
                System.out.println("Livro com ID " + id + " não encontrado.");
            }
            em.getTransaction().commit();
        } catch (Exception e) {
            em.getTransaction().rollback();
            System.err.println("Erro ao deletar livro: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    public void close() {
        emf.close();
    }

    public static void main(String[] args) {
        LivroService service = new LivroService();

        // 1. Criar e salvar um novo livro (estado New -> Managed)
        Livro novoLivro = new Livro("O Senhor dos Anéis", "J.R.R. Tolkien", 1954);
        service.salvarLivro(novoLivro);

        // 2. Buscar um livro (estado Managed)
        Livro livroEncontrado = service.buscarLivroPorId(novoLivro.getId());
        if (livroEncontrado != null) {
            System.out.println("Livro encontrado: " + livroEncontrado);
        }

        // 3. Atualizar um livro (estado Detached -> Managed)
        if (livroEncontrado != null) {
            livroEncontrado.setAnoPublicacao(1965); // Alteração na entidade Detached
            service.atualizarLivro(livroEncontrado);
        }

        // 4. Deletar um livro (estado Managed -> Removed)
        if (livroEncontrado != null) {
            service.deletarLivro(livroEncontrado.getId());
        }

        service.close();
    }
}

```

Para este exemplo funcionar, você precisaria de um arquivo `persistence.xml` na pasta `src/main/resources/META-INF` com o seguinte conteúdo (adaptado para um banco de dados H2 em memória para fácil teste):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence version="2.2"
             xmlns="<http://xmlns.jcp.org/xml/ns/persistence>"
             xmlns:xsi="<http://www.w3.org/2001/XMLSchema-instance>"
             xsi:schemaLocation="<http://xmlns.jcp.org/xml/ns/persistence> <http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd>">

    <persistence-unit name="minha-unidade-de-persistencia" transaction-type="RESOURCE_LOCAL">
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
        <class>com.gedegus.jpaexample.entity.Livro</class> <properties>
            <property name="jakarta.persistence.jdbc.driver" value="org.h2.Driver"/>
            <property name="jakarta.persistence.jdbc.url" value="jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1"/>
            <property name="jakarta.persistence.jdbc.user" value="sa"/>
            <property name="jakarta.persistence.jdbc.password" value=""/>

            <property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>
            <property name="hibernate.hbm2ddl.auto" value="update"/> <property name="hibernate.show_sql" value="true"/> <property name="hibernate.format_sql" value="true"/> </properties>
    </persistence-unit>
</persistence>

```

E as dependências em seu `pom.xml` (se estiver usando Maven):

```xml
<dependencies>
    <dependency>
        <groupId>jakarta.platform</groupId>
        <artifactId>jakarta.jakartaee-api</artifactId>
        <version>9.1.0</version> <scope>provided</scope>
    </dependency>

    <dependency>
        <groupId>org.hibernate.orm</groupId>
        <artifactId>hibernate-core</artifactId>
        <version>6.5.2.Final</version> </dependency>

    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <version>2.2.224</version> <scope>runtime</scope>
    </dependency>
</dependencies>

```

## Informações Adicionais

### Convenção sobre Configuração

O JPA, e em particular as implementações como o Hibernate, seguem fortemente a **convenção sobre configuração**. Isso significa que, se você seguir as convenções (como nomes de classes para tabelas, nomes de campos para colunas), muitas das anotações (como `@Table` ou `@Column`) se tornam opcionais. No entanto, é uma boa prática usá-las para maior clareza e para evitar surpresas se as convenções forem alteradas ou se houver requisitos de mapeamento específicos.

### Relações entre Entidades

Um dos grandes poderes do JPA é a capacidade de mapear relações entre entidades (um-para-um, um-para-muitos, muitos-para-um, muitos-para-muitos). Isso permite modelar seu domínio de forma orientada a objetos e deixar que o JPA gerencie as chaves estrangeiras e as junções no banco de dados. Por exemplo, você pode ter uma entidade `Autor` e mapear um relacionamento um-para-muitos com `Livro`.

```java
// Exemplo de uma entidade Autor
@Entity
public class Autor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;

    @OneToMany(mappedBy = "autor") // Relação um-para-muitos com Livro
    private List<Livro> livros = new ArrayList<>();

    // ... construtores, getters e setters
}

// Em Livro, para o relacionamento com Autor:
@Entity
public class Livro {
    // ... outros campos

    @ManyToOne // Relação muitos-para-um com Autor
    @JoinColumn(name = "autor_id") // Define a coluna de chave estrangeira
    private Autor autor;

    // ... construtores, getters e setters
}

```

### JSR 338 (JPA 2.2), Jakarta Persistence API e Java EE/Jakarta EE

Historicamente, o JPA fazia parte do Java EE (Java Platform, Enterprise Edition). Com a transição do Java EE para a Eclipse Foundation e a criação do **Jakarta EE**, o JPA foi renomeado para **Jakarta Persistence API**. As classes de pacote mudaram de `javax.persistence` para `jakarta.persistence`. Ao trabalhar com versões mais recentes do Spring Boot ou servidores de aplicação compatíveis com Jakarta EE, você usará os pacotes `jakarta.*`. O exemplo de código acima já utiliza os pacotes `jakarta.persistence`.

### Provedores JPA

O JPA é uma **especificação**, não uma implementação. Você precisa de um **provedor JPA** para realmente fazer o mapeamento e a persistência. Os provedores mais populares são:

- **Hibernate:** O mais conhecido e amplamente utilizado. É o provedor padrão no Spring Boot.
- **EclipseLink:** A implementação de referência do JPA.
- **OpenJPA:** Implementação Apache.

## Referências para Estudo Independente

Para aprofundar seus conhecimentos em JPA, sugiro as seguintes fontes:

- **Documentação Oficial do Jakarta Persistence (JPA):** É a fonte mais autorizada. Embora possa ser densa, é crucial para entender a especificação em detalhes.
    - [Jakarta Persistence Specification (JPA)](https://jakarta.ee/specifications/persistence/)
    - [Jakarta Persistence 3.1](https://jakarta.ee/specifications/persistence/3.1/) (última versão no momento)
- **Documentação do Hibernate:** Se você vai trabalhar com JPA em projetos reais, é muito provável que use o Hibernate como provedor. Sua documentação é excelente.
    - [Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/6.5/userguide/html_single/Hibernate_User_Guide.html)
- **Artigos e Tutoriais do Baeldung:** Um dos melhores recursos para tutoriais práticos e bem explicados sobre tecnologias Java, incluindo JPA e Hibernate.
    - [JPA Tutorial – Baeldung](https://www.google.com/search?q=https://www.baeldung.com/jpa)
    - [Hibernate Tutorial – Baeldung](https://www.google.com/search?q=https://www.baeldung.com/hibernate-tutorial)
- **Livros Recomendados:**
    - **"Pro JPA 2 in Java EE 8"** por Mike Keith, Merrick Schincariol e Viktor Gamov: Um guia abrangente para o JPA.
    - **"Java Persistence with Hibernate"** por Christian Bauer e Gavin King: Embora focado no Hibernate, ele cobre profundamente os conceitos de persistência que são a base do JPA.
- **Cursos Online:** Plataformas como Udemy, Alura, Coursera oferecem diversos cursos sobre JPA e Hibernate. Procure por cursos bem avaliados que se alinhem ao seu estilo de aprendizado.

Espero que esta explicação detalhada, Gedê, seja bastante útil para você em sua jornada como desenvolvedor Backend Java e na transição para Go\! Se tiver mais alguma dúvida, A.R.I.A está aqui para ajudar\!