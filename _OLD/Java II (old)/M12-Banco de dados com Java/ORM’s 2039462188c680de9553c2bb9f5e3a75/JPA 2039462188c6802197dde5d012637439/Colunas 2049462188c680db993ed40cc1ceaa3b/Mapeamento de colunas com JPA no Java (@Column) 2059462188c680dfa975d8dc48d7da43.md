# Mapeamento de colunas com JPA no Java (@Column)

---

## 1. Introdução

O **Java Persistence API (JPA)** é a especificação padrão para mapeamento objeto-relacional (ORM) em aplicações Java. Uma de suas funcionalidades centrais é permitir que campos de uma classe Java (entidades) sejam persistidos em colunas de tabelas de banco de dados. Para isso, utiliza-se a anotação `@Column`, que fornece controle detalhado sobre como cada atributo é representado no esquema relacional.

Nesta explicação, vamos abordar de forma completa o uso de `@Column`, cobrindo desde conceitos fundamentais até exemplos práticos de aplicação em um contexto real de projeto.

> Tópicos relacionados sugeridos (para leituras futuras):
> 
> - Mapeamento de relacionamentos com `@OneToMany`, `@ManyToOne`, `@ManyToMany`
> - Diferença entre `@Column` e `@JoinColumn`
> - Uso de `@Embeddable` e `@Embedded`
> - Configuração de `attribute converters`

---

## 2. Sumário

1. [Introdução](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#1-introdu%C3%A7%C3%A3o)
2. [Sumário](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#2-sum%C3%A1rio)
3. [Conceitos Fundamentais](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#3-conceitos-fundamentais)
4. [Sintaxe e Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#4-sintaxe-e-uso)
    - 4.1. Atributos Principais de `@Column`
    - 4.2. Exemplos Práticos
5. [Restrições de Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#5-restri%C3%A7%C3%B5es-de-uso)
6. [Elementos Associados](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#6-elementos-associados)
    - 6.1. Outras Anotações de Mapeamento
    - 6.2. Classes e Interfaces Relacionadas
7. [Melhores Práticas e Casos de Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#7-melhores-pr%C3%A1ticas-e-casos-de-uso)
8. [Exemplos Completos](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#8-exemplos-completos)
9. [Tópicos Relacionados para Aprofundamento](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#9-t%C3%B3picos-relacionados-para-aprofundamento)

---

## 3. Conceitos Fundamentais

- **Objetivo Geral:**
    - A anotação `@Column` instrui o provedor JPA (Hibernate, EclipseLink, etc.) sobre como deve ser a correspondência entre o *field* (ou *property*) de uma entidade Java e uma coluna de uma tabela no banco de dados.
    - Permite personalizar nome, tipo, tamanho, restrições de nulo, unicidade e diversos outros aspectos da coluna no esquema relacional.
- **Contexto de Funcionamento:**
    1. **Entidade (`@Entity`):** classe Java que representa uma tabela no banco de dados.
    2. **Tabela (`@Table`):** anotação opcional para definir nome da tabela e esquema.
    3. **Campo ou Propriedade:** cada atributo da entidade que deva ser persistido recebe anotações como `@Id`, `@GeneratedValue`, `@Column`, etc.
    4. **Persistência:** ao salvar (persist) uma instância da entidade, o JPA gera instruções SQL (`INSERT`, `UPDATE`, etc.) respeitando as definições dadas em `@Column`.
- **Por que usar `@Column`:**
    - Mapear campos com nomes distintos dos nomes de colunas (por exemplo, `nomeCompleto` → `nome_completo`).
    - Especificar tamanho máximo de *varchar*, precisão e escala de colunas numéricas (`DECIMAL`, `NUMERIC`).
    - Definir se a coluna aceita valores nulos (`nullable = false`).
    - Declarar valores padrão, se necessário, via `columnDefinition` (caso específico).

---

## 4. Sintaxe e Uso

```java
package com.exemplo.entidade;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "pessoa")
public class Pessoa {

    @Id
    private Long id;

    @Column(name = "nome_completo", nullable = false, length = 100)
    private String nome;

    @Column(name = "idade", nullable = false)
    private Integer idade;

    @Column(name = "email", unique = true, length = 150)
    private String email;

    @Column(name = "salario", precision = 12, scale = 2)
    private BigDecimal salario;

    // getters e setters omitidos para brevidade
}

```

### 4.1. Atributos Principais de `@Column`

| Atributo | Descrição | Valor padrão / Observação |
| --- | --- | --- |
| `name` | Nome da coluna na tabela que será associada ao campo. | Se omitido, o padrão é o nome do campo Java. |
| `nullable` | Indica se a coluna pode receber valor `NULL`. | `true` (permitido) |
| `length` | Tamanho máximo para colunas de texto (ex.: `VARCHAR`). | `255` |
| `unique` | Garantir unicidade de valores na coluna (gera constraint `UNIQUE`). | `false` |
| `precision` | Número total de dígitos para colunas numéricas `DECIMAL` ou `NUMERIC`. | Padrão varia conforme o provedor; se não definido, o provedor define. |
| `scale` | Número de casas decimais (escala) para colunas `DECIMAL` ou `NUMERIC`. | Padrão varia; geralmente `0` se não especificado. |
| `columnDefinition` | Permite informar a definição exata da coluna em SQL (tipo, valor default, etc). | Cuidado: reduz portabilidade (ex.: `"TEXT NOT NULL DEFAULT 'xyz'"`). |
| `insertable` | Define se JPA deve incluir a coluna em instruções `INSERT`. | `true` |
| `updatable` | Define se JPA deve incluir a coluna em instruções `UPDATE`. | `true` |
| `table` | Nome da tabela, caso mapeie a mesma entidade a múltiplas tabelas via *secondary tables*. | Geralmente omitido em casos simples. |
| `columnDefinition` | (já citado acima) |  |

> Observação sobre length:
> 
> - Aplica-se somente a colunas de tipo texto (ex.: `VARCHAR`).
> - Para `CHAR` fixo, alguns provedores podem gerar `CHAR(length)`.

### 4.2. Exemplos Práticos

1. **Campo cujo nome de coluna difere do nome do atributo:**
    
    ```java
    @Column(name = "nome_completo")
    private String nome;
    
    ```
    
    - Aqui mapeamos o atributo `nome` para a coluna `nome_completo` no banco.
2. **Especificando tamanho, nulidade e unicidade:**
    
    ```java
    @Column(name = "username", nullable = false, length = 50, unique = true)
    private String usuario;
    
    ```
    
    - Gera uma coluna `username VARCHAR(50) NOT NULL UNIQUE`.
3. **Configuração de precisão e escala:**
    
    ```java
    @Column(name = "valor_produto", precision = 10, scale = 2, nullable = false)
    private BigDecimal valor;
    
    ```
    
    - Traduz para `DECIMAL(10,2) NOT NULL`.
4. **Forçando definição customizada (com `columnDefinition`):**
    
    ```java
    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;
    
    ```
    
    - Alguns bancos, como PostgreSQL, entenderão `descricao TEXT`.
    - **Atenção:** ao definir `columnDefinition`, o provedor JPA não gerencia detalhes de portabilidade.

---

## 5. Restrições de Uso

Apesar da flexibilidade de `@Column`, existem situações em que seu uso **não** é recomendado ou não funcionará como esperado:

1. **Mapeamento Padrão Suficiente:**
    - Se o nome do atributo Java coincide com o nome da coluna no banco e não há necessidade de ajustar tamanho, nulidade ou tipo, pode-se omitir `@Column`. O JPA “descobre” o nome da coluna automaticamente (em `snake_case` ou conforme estratégia definida).
2. **Colunas Calculadas ou Virtuais:**
    - Se a coluna é derivada de uma expressão SQL ou `VIEW`, `@Column` não consegue representar colunas geradas a partir de fórmulas complexas. Nesse caso, deve-se usar:
        - `@Formula` (no Hibernate) ou
        - Definir a entidade `@Immutable` com mapeamento específico.
    - `columnDefinition` não garante sincronia entre entidade e estrutura real: cuidado.
3. **Colunas de Relacionamentos (Chaves Estrangeiras):**
    - Para colunas que representam chaves estrangeiras, deve-se usar `@JoinColumn` em vez de `@Column`.
    - Exemplo incorreto:
        
        ```java
        // NÃO FAZER
        @Column(name = "cliente_id")
        private Long clienteId;
        
        ```
        
        - Correto:
            
            ```java
            @ManyToOne
            @JoinColumn(name = "cliente_id", nullable = false)
            private Cliente cliente;
            
            ```
            
    - `@Column` não reconhece relações; apenas mapeia valor bruto de um campo simples.
4. **Colunas de Tipos Complexos (JSON, Array, XML):**
    - Alguns bancos suportam colunas `JSON`, `ARRAY`, `XML`, etc.
    - Dependendo do provedor, `@Column(columnDefinition="JSON")` pode funcionar, mas geralmente recomenda-se usar *Attribute Converters* (`@Converter`) para converter entre tipos Java e colunas especializadas.
5. **Colunas com Padrão de Banco Exclusivo:**
    - `columnDefinition` frequentemente se torna dependente do dialeto do banco (ex.: `ENUM` no MySQL).
    - Melhor abordagem: usar *custom types* ou *attribute converters* para manter portabilidade.

---

## 6. Elementos Associados

Para entender completamente o mapeamento de colunas com `@Column`, é importante conhecer outras anotações, classes e interfaces que compõem o ecossistema JPA.

### 6.1. Outras Anotações de Mapeamento

1. **`@Entity`**
    - Marca uma classe Java como uma entidade gerenciada pelo JPA.
    - Exemplo:
        
        ```java
        @Entity
        @Table(name = "produto")
        public class Produto { … }
        
        ```
        
    - Sem `@Entity`, o JPA não persiste a classe.
2. **`@Table`**
    - Opcional: define nome da tabela, esquema, catálogo.
    - Exemplo:
        
        ```java
        @Table(name = "produtos", schema = "vendas")
        
        ```
        
3. **`@Id`**
    - Define a chave primária da entidade.
    - Tipicamente usado em conjunto com `@GeneratedValue`.
4. **`@GeneratedValue`**
    - Especifica estratégia de geração automática de valores para a chave primária (`IDENTITY`, `SEQUENCE`, `TABLE`, `AUTO`).
5. **`@Basic`**
    - Marca um mapeamento padrão de campo simples.
    - Ele é aplicado implicitamente para todos os campos não anotados com `@OneToMany`, `@Embedded`, etc.
    - Possui parâmetros como `fetch` (LAZY ou EAGER) e `optional`.
6. **`@Lob`**
    - Indica que o campo é “Large Object” (BLOB ou CLOB), dependendo do tipo Java (`String` → CLOB, `byte[]` → BLOB).
7. **`@Temporal`**
    - Usado com `java.util.Date` ou `java.util.Calendar`, especificando se a coluna deve ser `DATE`, `TIME` ou `TIMESTAMP`.
8. **`@Enumerated`**
    - Mapeia `enum` para valor `STRING` ou `ORDINAL` em coluna de banco.
9. **`@JoinColumn`**
    - Mapeia a chave estrangeira em relacionamentos (`@ManyToOne`, `@OneToOne`).
10. **`@Embedded` / `@Embeddable`**
    - Permite agrupar atributos em classes incorporáveis (sem classe própria de tabela).
    - Campos de um objeto `@Embeddable` são mapeados como colunas da tabela da entidade.
11. **`@Convert` / `AttributeConverter`**
    - Permite converter tipos Java complexos para tipos compatíveis com colunas do banco (e vice-versa).

### 6.2. Classes e Interfaces Relacionadas

1. **`javax.persistence.Column`**
    - Interface que define a anotação `@Column`.
    - Pacote padrão JPA.
2. **`javax.persistence.Entity`**, **`javax.persistence.Table`**, **`javax.persistence.Id`** etc.
    - Todas fazem parte da especificação JPA.
3. **`AttributeConverter<X,Y>`**
    - Interface para criar conversores de atributo.
    - Exemplo: converter entre `LocalDate` e `java.sql.Date`.
4. **`javax.persistence.EntityManager`**
    - Principal classe para operações de persistência (persist, merge, remove, find, createQuery etc.).
    - Opera a partir de entidades mapeadas (com `@Column` definindo o esquema das colunas).
5. **`javax.persistence.Persistence`**
    - Classe utilitária para criar `EntityManagerFactory` a partir do `persistence.xml`.
6. **`javax.persistence.PersistenceUnit` / `@PersistenceContext`**
    - Injeção de contexto de persistência em aplicações gerenciadas (Java EE, Spring, etc.).

---

## 7. Melhores Práticas e Casos de Uso

1. **Nomeclatura Consistente entre Atributo e Coluna**
    - Prefira usar `camelCase` em Java e `snake_case` no banco. Ex.:
        
        ```java
        @Column(name = "data_nascimento")
        private LocalDate dataNascimento;
        
        ```
        
    - Isso ajuda a manter clareza no código e evita erros de digitação.
2. **Definir `length` em Campos `String` Importantes**
    - Evite usar o tamanho padrão (`255`) sem ponderar. Se o campo só armazena e-mail, defina `length = 150`.
3. **Usar `nullable = false` para Campos Obrigatórios**
    - A camada de persistência reforça restrições de nulidade antes de tentar persistir.
    - Exemplo:
        
        ```java
        @Column(name = "cpf", nullable = false, length = 11, unique = true)
        private String cpf;
        
        ```
        
4. **Evitar `columnDefinition` Sempre que Possível**
    - Prefira usar `precision`, `scale`, `length`, `nullable`, `unique` para manter portabilidade.
    - `columnDefinition` torna o código fortemente acoplado ao dialeto do banco.
5. **Separar Tipos de Relacionamento de Campos Simples**
    - Use `@JoinColumn` para chaves estrangeiras, não `@Column`.
    - Exemplo de relação:
        
        ```java
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "departamento_id", nullable = false)
        private Departamento departamento;
        
        ```
        
6. **Documentar Campos com Comentários**
    - Sempre documente por que determinado `length` ou `precision` foi escolhido (p. ex., “max. 5 dígitos inteiros e 2 decimais para população estimada”).
7. **Constantes para Nomes de Coluna**
    - Se precisar referenciar colunas repetidamente em consultas, crie constantes:
        
        ```java
        public static final String COLUNA_EMAIL = "email";
        @Column(name = COLUNA_EMAIL, length = 150, unique = true)
        private String email;
        
        ```
        
8. **Checar Limitações do Dialeto do Banco**
    - Alguns bancos têm tamanhos máximos de `VARCHAR` diferentes (ex.: MySQL 65535 vs. PostgreSQL sem limites práticos).
    - Ajuste o `length` considerando características do SGBD.
9. **Evitar Mapear Campos Transientes**
    - Se o atributo não deve ser persistido, use `@Transient` em vez de `@Column`.

---

## 8. Exemplos Completos

A seguir, apresentamos um exemplo de aplicação básica utilizando JPA (com Hibernate como provedor) e mapeando todas as colunas de uma entidade de forma detalhada.

> Contexto:
> 
> - Projeto Maven
> - Dependência em `pom.xml` para Hibernate e um banco H2 (para testes rápidos)
> - `persistence.xml` configurado para H2 em modo memória

### 8.1. `pom.xml` (dependências mínimas)

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.exemplo</groupId>
    <artifactId>jpa-column-mapping</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <hibernate.version>5.6.15.Final</hibernate.version>
    </properties>

    <dependencies>
        <!-- JPA API -->
        <dependency>
            <groupId>javax.persistence</groupId>
            <artifactId>javax.persistence-api</artifactId>
            <version>2.2</version>
        </dependency>

        <!-- Hibernate como provedor JPA -->
        <dependency>
            <groupId>org.hibernate</groupId>
            <artifactId>hibernate-core</artifactId>
            <version>${hibernate.version}</version>
        </dependency>

        <!-- Banco de teste: H2 (in-memory) -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <version>2.1.214</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Logback para saída de logs -->
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>1.2.12</version>
        </dependency>
    </dependencies>
</project>

```

### 8.2. `persistence.xml` (configuração de persistência)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="https://jakarta.ee/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="https://jakarta.ee/xml/ns/persistence
                                 https://jakarta.ee/xml/ns/persistence/persistence_2_2.xsd"
             version="2.2">

    <persistence-unit name="jpa-column-mapping-h2" transaction-type="RESOURCE_LOCAL">
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>

        <!-- Entidades mapeadas -->
        <class>com.exemplo.entidade.Pessoa</class>
        <class>com.exemplo.entidade.Departamento</class>

        <properties>
            <!-- Dialeto H2 -->
            <property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>
            <!-- URL para banco em memória -->
            <property name="javax.persistence.jdbc.url" value="jdbc:h2:mem:meubanco;DB_CLOSE_DELAY=-1"/>
            <property name="javax.persistence.jdbc.user" value="sa"/>
            <property name="javax.persistence.jdbc.password" value=""/>
            <property name="javax.persistence.jdbc.driver" value="org.h2.Driver"/>

            <!-- Gerar schema automaticamente -->
            <property name="hibernate.hbm2ddl.auto" value="update"/>
            <!-- Mostrar SQL no console -->
            <property name="hibernate.show_sql" value="true"/>
            <property name="hibernate.format_sql" value="true"/>
        </properties>
    </persistence-unit>
</persistence>

```

### 8.3. Entidade `Departamento`

```java
package com.exemplo.entidade;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "departamento")
public class Departamento {

    @Id
    @Column(name = "departamento_id")
    private Long id;

    @Column(name = "nome", nullable = false, length = 50)
    private String nome;

    @Column(name = "localizacao", length = 100)
    private String localizacao;

    // Construtores, getters e setters

    public Departamento() { }

    public Departamento(Long id, String nome, String localizacao) {
        this.id = id;
        this.nome = nome;
        this.localizacao = localizacao;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }
}

```

- **Análise de `@Column`:**
    - `departamento_id`: campo chave primária, mapeado para coluna `departamento_id`.
    - `nome`: coluna `nome` obrigatória (`nullable = false`), até 50 caracteres.
    - `localizacao`: coluna `localizacao` opcional, até 100 caracteres.

### 8.4. Entidade `Pessoa`

```java
package com.exemplo.entidade;

import java.math.BigDecimal;
import java.time.LocalDate;
import javax.persistence.*;

@Entity
@Table(name = "pessoa")
public class Pessoa {

    @Id
    @Column(name = "pessoa_id")
    private Long id;

    @Column(name = "nome_completo", nullable = false, length = 100)
    private String nome;

    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    @Column(name = "email", unique = true, length = 150)
    private String email;

    @Column(name = "salario", precision = 12, scale = 2, nullable = false)
    private BigDecimal salario;

    @Column(name = "ativo", nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean ativo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departamento_id", nullable = false)
    private Departamento departamento;

    // Construtor padrão
    public Pessoa() { }

    // Construtor completo
    public Pessoa(Long id, String nome, LocalDate dataNascimento, String email,
                  BigDecimal salario, Boolean ativo, Departamento departamento) {
        this.id = id;
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.email = email;
        this.salario = salario;
        this.ativo = ativo;
        this.departamento = departamento;
    }

    // Getters e Setters omitidos para simplificar
}

```

- **Análise de `@Column`:**
    1. `pessoa_id`: chave primária.
    2. `nome_completo`: mapeado para `VARCHAR(100) NOT NULL`.
    3. `data_nascimento`: tipo `DATE`, não nulo.
    4. `email`: `VARCHAR(150)`, restrito a valores únicos.
    5. `salario`: `DECIMAL(12,2) NOT NULL`.
    6. `ativo`: mapeado via `columnDefinition = "BOOLEAN DEFAULT true"`.
    7. Campo `departamento`: relacionamento, não mapeado por `@Column` diretamente, mas via `@JoinColumn`.

### 8.5. Classe de Teste (Uso de `EntityManager`)

```java
package com.exemplo;

import com.exemplo.entidade.Departamento;
import com.exemplo.entidade.Pessoa;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.math.BigDecimal;
import java.time.LocalDate;

public class Aplicacao {

    public static void main(String[] args) {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("jpa-column-mapping-h2");
        EntityManager em = emf.createEntityManager();

        em.getTransaction().begin();

        // Criando Departamento
        Departamento dpto = new Departamento(1L, "Financeiro", "São Paulo");
        em.persist(dpto);

        // Criando Pessoa
        Pessoa pessoa = new Pessoa(
            1L,
            "Ana Silva",
            LocalDate.of(1990, 5, 12),
            "ana.silva@exemplo.com",
            new BigDecimal("4500.75"),
            true,
            dpto
        );
        em.persist(pessoa);

        em.getTransaction().commit();

        // Consultando dados
        Pessoa pBuscada = em.find(Pessoa.class, 1L);
        System.out.println("Pessoa encontrada: " + pBuscada.getNome() +
                           ", Salário: " + pBuscada.getSalario() +
                           ", Departamento: " + pBuscada.getDepartamento().getNome());

        em.close();
        emf.close();
    }
}

```

> O que acontece aqui?
> 
> - Ao executar, o Hibernate criará as tabelas `departamento` e `pessoa` no banco H2 (que roda em memória).
> - As colunas serão criadas conforme definidas nas anotações `@Column`.
> - Observação: `ativo` adotará padrão `true` por meio de `columnDefinition`.

---

## 9. Tópicos Relacionados para Aprofundamento

1. **Mapeamento de Relacionamentos Avançados:**
    - `@OneToMany`, `@ManyToMany`, `@OneToOne`
    - Como se utiliza `@JoinColumn` e `@JoinTable`
2. **Embeddables e Tipos Compostos:**
    - Uso de `@Embeddable` para agrupar múltiplos campos em um objeto de valor
    - Ex.: `Endereco` como campo embutido em várias entidades
3. **Attribute Converters (`@Converter`):**
    - Converter tipos Java personalizados (ex.: `LocalDate`, `Enum`) para colunas simples (ex.: `DATE`, `VARCHAR`)
    - Exemplo: converter `LocalDate` para `java.sql.Date`, ou converter `Status` (`enum`) para `String`
4. **Estratégias de Herança em JPA:**
    - `@Inheritance(strategy = InheritanceType.SINGLE_TABLE | JOINED | TABLE_PER_CLASS)`
    - Diferenças no mapeamento de colunas para subtipos
5. **Configuração de Dialetos Específicos:**
    - Como otimizar `columnDefinition` para PostgreSQL, MySQL, Oracle, SQL Server etc.
    - Práticas para manter portabilidade entre bancos
6. **Consultas JPQL e Criteria API Usando Campos Anotados com `@Column`:**
    - Construir consultas dinâmicas que usam nomes de colunas especificados em `@Column`
    - Exemplo:
        
        ```java
        // Consulta JPQL usando nome de campo Java (não nome de coluna)
        List<Pessoa> lista = em.createQuery(
            "SELECT p FROM Pessoa p WHERE p.email = :email", Pessoa.class)
            .setParameter("email", "ana.silva@exemplo.com")
            .getResultList();
        
        ```
        

---

**Fim da explicação sobre *Mapeamento de colunas com JPA no Java (`@Column` )*.**

Caso deseje aprofundar em algum dos tópicos relacionados acima, é só me avisar!