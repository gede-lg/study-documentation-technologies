# Mapeamento de Tipos de Data/Hora (@Temporal)

---

## 1. Introdução

O mapeamento de tipos de data e hora em aplicações Java que utilizam JPA (Java Persistence API) é fundamental para garantir que valores de data/hora em memória (objetos Java) sejam armazenados corretamente no banco de dados relacional. O JPA fornece a anotação `@Temporal` para controlar esse mapeamento quando se usa classes legadas como `java.util.Date` ou `java.util.Calendar`.

Nesta explicação, veremos em detalhes:

- Por que precisamos do `@Temporal`
- Quais são os tipos de data/hora suportados (`DATE`, `TIME`, `TIMESTAMP`)
- Cenários em que o uso de `@Temporal` é adequado (e quando evitá-lo)
- Todos os elementos associados (enumerações, anotações, tipos Java e SQL)
- Boas práticas e exemplos completos de uso em entidades JPA

> Sugestões de tópicos relacionados para aprofundar:
> 
> - Como usar tipos do pacote `java.time` (JSR-310) no JPA sem `@Temporal`
> - Conversores automáticos (`AttributeConverter`) para data/hora (por exemplo, de `LocalDateTime` para `Timestamp`)
> - Anotações específicas de provedor (como Hibernate: `@CreationTimestamp` e `@UpdateTimestamp`)

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#3-conceitos-fundamentais)
2. [Sintaxe e Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#4-sintaxe-e-uso)
3. [Restrições de Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#5-restricoes-de-uso)
4. [Elementos Associados](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#6-elementos-associados)
5. [Melhores Práticas e Casos de Uso](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#7-melhores-praticas-e-casos-de-uso)
6. [Exemplos Completos](https://chatgpt.com/c/683cc288-6078-8013-a1a6-48f406dbdfc9#8-exemplos-completos)

> Sugestões de tópicos relacionados para aprofundar:
> 
> - Detalhes do suporte a JPA 2.2 para tipos JSR-310 (`LocalDate`, `LocalDateTime`)
> - Diferenças entre `java.sql.Date` / `java.sql.Time` / `java.sql.Timestamp` vs. `java.time.*`

---

## 3. Conceitos Fundamentais

### 3.1. Por que o `@Temporal` existe?

- **Linguagem vs. Banco de Dados**
    
    Em Java, é comum representar datas e horários usando `java.util.Date` ou `java.util.Calendar`. Porém, em um banco relacional, normalmente dispomos de três tipos SQL distintos:
    
    1. **DATE**: armazena apenas a parte de data (ano, mês, dia).
    2. **TIME**: armazena apenas a parte de hora (hora, minuto, segundo).
    3. **TIMESTAMP** (ou `DATETIME`): armazena data e hora completos (ano, mês, dia, hora, minuto, segundo, frações de segundo).
    
    Se simplesmente definíssemos um atributo `java.util.Date` em uma entidade JPA sem indicar qual desses tipos SQL usar, o provedor de persistência ficaria em dúvida sobre como converter corretamente esse valor. A anotação `@Temporal` resolve essa ambiguidade.
    
- **Objetivo do `@Temporal`**
    
    O `@Temporal` informa ao provedor JPA duas coisas principais:
    
    1. **Qual parte do valor Java (Date/Calendar) deve ser considerada**: apenas data, apenas hora ou data + hora.
    2. **Como criar a coluna SQL correspondente** (por padrão, gerando um `DATE`, `TIME` ou `TIMESTAMP` no DDL gerado).

> Sugestões de tópicos relacionados para aprofundar:
> 
> - Como funciona o mapeamento de tipos nulos e não nulos em DDL
> - Diferença entre `java.sql.Timestamp` e tipo SQL `TIMESTAMP`

---

## 4. Sintaxe e Uso

Nesta seção, veremos como se aplica a anotação `@Temporal` em atributos de entidades JPA. Assumiremos que a tecnologia de persistência é **JPA no Java** (padrão JPA 2.x) e que usamos `java.util.Date` ou `java.util.Calendar`.

### 4.1. Enumeração `TemporalType`

A anotação `@Temporal` recebe um parâmetro do tipo `TemporalType`, definido por essa enumeração:

```java
public enum TemporalType {
    DATE,       // Apenas a parte de data (equivalente a SQL DATE)
    TIME,       // Apenas a parte de hora (equivalente a SQL TIME)
    TIMESTAMP   // Data + hora (equivalente a SQL TIMESTAMP/DATETIME)
}

```

- **`DATE`**
    
    Persistirá o atributo somente como data (ano, mês, dia). Em muitos bancos, a coluna será do tipo `DATE`.
    
- **`TIME`**
    
    Persistirá apenas a parte de hora (hora, minuto, segundo). Mapeia para `TIME`.
    
- **`TIMESTAMP`**
    
    Persistirá data e hora (incluindo frações de segundo). Mapeia para `TIMESTAMP` ou `DATETIME`.
    

> Sugestão de tópico relacionado:
> 
> - Quando usar `java.sql.Timestamp` diretamente vs. usar `@Temporal(TemporalType.TIMESTAMP)` sobre `java.util.Date`.

---

### 4.2. Exemplo de sintaxe básica

### 4.2.1. Atributo `java.util.Date`

```java
@Entity
@Table(name = "evento")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Obrigatório usar @Temporal para java.util.Date
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "data_criacao", nullable = false)
    private Date dataCriacao;

    @Temporal(TemporalType.DATE)
    @Column(name = "data_evento")
    private Date dataEvento;

    @Temporal(TemporalType.TIME)
    @Column(name = "hora_inicio")
    private Date horaInicio;

    // ... getters e setters ...
}

```

- **`@Temporal(TemporalType.TIMESTAMP)`**: Gera coluna do tipo `TIMESTAMP`, armazenando data completa e hora.
- **`@Temporal(TemporalType.DATE)`**: Gera coluna do tipo `DATE`, armazenando apenas ano/mês/dia.
- **`@Temporal(TemporalType.TIME)`**: Gera coluna do tipo `TIME`, armazenando apenas hora/minuto/segundo.

> Observação importante:
> 
> - Se você esquecer de declarar o `@Temporal` em um atributo `java.util.Date` ou `java.util.Calendar`, o provedor JPA lançará erro em tempo de deploy ou runtime, indicando que não sabe qual tipo temporal usar.

---

### 4.2.2. Atributo `java.util.Calendar`

```java
@Entity
@Table(name = "reuniao")
public class Reuniao {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    // Exemplo usando Calendar
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "data_agendada")
    private Calendar dataAgendada;

    // Exemplo apenas com data
    @Temporal(TemporalType.DATE)
    @Column(name = "data_limite")
    private Calendar dataLimite;

    // ... getters e setters ...
}

```

- A lógica é exatamente a mesma para `Calendar`.
- Internamente, `Calendar` também armazena informações de fuso horário, mas o JPA só converte a parte de data/hora conforme indicado no `@Temporal`.

> Sugestão de tópico relacionado:
> 
> - Diferenças entre `java.util.Date` e `java.util.Calendar` no contexto de persistência JPA

---

### 4.3. Comentários sobre configuração de colunas

1. **Definição de tamanho, nulabilidade e demais atributos**
    
    Após `@Temporal`, usamos `@Column` para indicar características como `nullable`, `length`, etc. Exemplo:
    
    ```java
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "data_atualizacao", nullable = false)
    private Date dataAtualizacao;
    
    ```
    
2. **Controle do fuso horário**
    - Por padrão, a hora gravada no banco é gerada conforme o relógio do servidor de aplicação, sem conversão explícita de fuso.
    - Em bancos como PostgreSQL, o tipo SQL `TIMESTAMP` pode ter variantes:
        - `TIMESTAMP WITHOUT TIME ZONE`
        - `TIMESTAMP WITH TIME ZONE`
    - JPA (por padrão) gera `TIMESTAMP WITHOUT TIME ZONE`. Se quiser `WITH TIME ZONE`, é necessário usar `@Column(columnDefinition = "TIMESTAMP WITH TIME ZONE")` ou usar tipos JSR-310.
3. **Geração automática de DDL**
    - Quando `hibernate.hbm2ddl.auto = update` (ou `create`), o JPA gerará as colunas adequadamente.
    - Exemplo de DDL gerado para o atributo:
        
        ```sql
        data_criacao TIMESTAMP NOT NULL,
        data_evento DATE,
        hora_inicio TIME
        
        ```
        

> Sugestão de tópico relacionado:
> 
> - Configuração de fuso horário no Hibernate (propriedades `hibernate.jdbc.time_zone`, etc.)

---

## 5. Restrições de Uso

Existem cenários em que você **não deveria** (ou não precisaria) usar `@Temporal`. Abaixo, alguns exemplos e explicações:

1. **Uso de tipos JSR-310 (`java.time.*`)**
    - A partir do **JPA 2.2**, as classes do pacote `java.time` (como `LocalDate`, `LocalDateTime`, `OffsetDateTime`) são suportadas nativamente. Nesse caso:
        - **Não se usa** `@Temporal` em atributos `LocalDate` ou `LocalDateTime`.
        - Basta declarar:
            
            ```java
            @Column(name = "data_criacao")
            private LocalDateTime dataCriacao;
            
            ```
            
        - O provedor JPA (por exemplo, Hibernate 5.2+) já converte para o tipo SQL adequado (`TIMESTAMP`).
2. **Quando o banco exige um tipo específico diferente de DATE/TIME/TIMESTAMP**
    - Por exemplo, alguns bancos oferecem tipos `DATETIME2` (SQL Server) ou `TIMESTAMP WITH TIME ZONE` (PostgreSQL).
    - Em casos muito específicos, usar `columnDefinition` em vez de `@Temporal`:
        
        ```java
        @Column(name = "data_evento", columnDefinition = "TIMESTAMP WITH TIME ZONE")
        private OffsetDateTime dataEvento;
        
        ```
        
3. **Campos calculados ou lógicos (sem persistência real)**
    - Se a data/hora for calculada em tempo de execução (por exemplo, `@Transient`), não há razão para usar `@Temporal`, pois não há coluna correspondente.
4. **Quando já se utiliza `java.sql.Date` ou `java.sql.Time` diretamente**
    - Embora seja **menos comum**, se a entidade usar diretamente `java.sql.Date` ou `java.sql.Time`, o provedor JPA já entende o tipo e não exige `@Temporal`. Exemplo:
        
        ```java
        @Column(name = "data_aprovacao")
        private java.sql.Date dataAprovacao;
        
        ```
        
    - Nesse caso, o provedor supõe automaticamente `DATE` para `java.sql.Date` e `TIME` para `java.sql.Time`.

---

## 6. Elementos Associados

Para compreender e aplicar corretamente o mapeamento de tipos data/hora, é necessário conhecer as dependências e anotações relacionadas:

### 6.1. Enumeração `TemporalType`

- **Local**: `javax.persistence.TemporalType`
- **Valores**:
    - `TemporalType.DATE`
    - `TemporalType.TIME`
    - `TemporalType.TIMESTAMP`

> Propósito: indicar a parte relevante do valor temporal a ser persistido.
> 

---

### 6.2. Anotação `@Temporal`

- **Local**: `javax.persistence.Temporal`
- **Uso**:
    
    ```java
    @Temporal(TemporalType.TYPE_AQUI)
    private Date algumaData;
    
    ```
    
- **Parâmetro obrigatório**: `value` (o tipo `TemporalType`).
- **Obs.**: Só se aplica a atributos de tipo `java.util.Date` ou `java.util.Calendar`.

---

### 6.3. Anotação `@Column`

Embora não seja específica de `@Temporal`, geralmente se usa em conjunto:

```java
@Temporal(TemporalType.DATE)
@Column(name = "data_nascimento", nullable = false)
private Date dataNascimento;

```

- **Parâmetros importantes**:
    - `name` (nome da coluna no banco)
    - `nullable` (se aceita valor nulo)
    - `length`, `precision`, `scale` (quando aplicável)
    - `columnDefinition` (para tipos específicos de banco)

---

### 6.4. Tipos Java Compatíveis

1. **`java.util.Date`**
    - Classe mais antiga para representar instantes no tempo (sempre armazenamento de data + hora).
    - Quando se usa `@Temporal`, extrai-se apenas a parte desejada (data, hora ou timestamp).
2. **`java.util.Calendar`**
    - Similar a `Date`, mas mantém informações de fuso, localidade e formatações.
    - O JPA converte conforme o `TemporalType` informado.
3. **`java.sql.Date`**, **`java.sql.Time`**, **`java.sql.Timestamp`**
    - Classes específicas para mapeamento de colunas SQL correspondentes.
    - Ao usar essas classes diretamente:
        - `java.sql.Date` → `DATE`
        - `java.sql.Time` → `TIME`
        - `java.sql.Timestamp` → `TIMESTAMP`
    - **Não é necessário** usar `@Temporal`. Porém, seu uso direto é menos recomendável se você busca independência de provedor.
4. **`java.time.*` (JSR-310)**
    - `LocalDate`, `LocalTime`, `LocalDateTime`, `OffsetDateTime`, etc.
    - No **JPA 2.2+** (e Hibernate 5.2+), são suportados nativamente, sem `@Temporal`.
    - Exemplos:
        
        ```java
        @Column(name = "data_criacao")
        private LocalDate dataCriacao;
        
        @Column(name = "horario_inicio")
        private LocalTime horarioInicio;
        
        ```
        

> Sugestão de tópico relacionado:
> 
> - Uso de `AttributeConverter` para migrar de `java.util.Date` para `java.time.*`

---

### 6.5. Outras anotações de data/hora (dependentes de provedor)

- **Hibernate**
    - `@CreationTimestamp`
        - Inserido em um atributo (por exemplo, `Date dataCriacao;`) para que o provedor automaticamente defina esse campo ao persistir (geralmente usa `CURRENT_TIMESTAMP`).
        - Exemplo:
            
            ```java
            @CreationTimestamp
            @Temporal(TemporalType.TIMESTAMP)
            @Column(name = "created_at", nullable = false, updatable = false)
            private Date createdAt;
            
            ```
            
    - `@UpdateTimestamp`
        - Similar, mas atualiza o campo toda vez que a entidade for atualizada.
- **Jakarta Persistence (versões mais recentes)**
    - Em implementações que seguem Jakarta Persistence 3.0+, essas anotações ainda existem, mas o foco é migrar para `java.time.*`.

> Sugestão de tópico relacionado:
> 
> - Como usar `@CreationTimestamp` e `@UpdateTimestamp` no Hibernate para auditoria automática de data/hora

---

## 7. Melhores Práticas e Casos de Uso

### 7.1. Preferir as classes do pacote `java.time` (JSR-310)

- **Motivo**:
    - Classes imutáveis (`LocalDate`, `LocalDateTime`) evitam problemas de concorrência.
    - Melhor modelagem de fuso horário (`ZonedDateTime`, `OffsetDateTime`).
    - APIs mais ricas para manipulação de data/hora.
- **Como adotar**:
    - Garanta que seu provedor JPA (por exemplo, Hibernate 5.2+, EclipseLink 2.7+) suporte nativamente essas classes.
    - Exemplo:
        
        ```java
        @Column(name = "data_criacao")
        private LocalDate dataCriacao;
        
        @Column(name = "data_evento")
        private LocalDateTime dataEvento;
        
        ```
        

> Sugestão de tópico relacionado:
> 
> - Comparativo entre `java.util.Date` + `@Temporal` vs. `java.time.*` no JPA

---

### 7.2. Evitar `@Temporal` quando usar `java.time.*`

- Se a aplicação já estiver em JPA 2.2 ou superior, **nunca misture** `@Temporal` com `java.time.*`.
- Se tentar usar `@Temporal` em `LocalDate`, o compilador JPA/IDE poderá sinalizar erro, pois não faz sentido mapear com `@Temporal` um tipo que não seja `Date` ou `Calendar`.

---

### 7.3. Definir o fuso horário da conexão com o banco

- Alguns bancos armazenam `TIMESTAMP` sem fuso, mas na hora de ler, podem converter segundo o timezone configurado.
- **Dica**:
    - No Hibernate, defina em `application.properties` (Spring Boot) ou `persistence.xml` (JPA) a propriedade:
        
        ```
        spring.jpa.properties.hibernate.jdbc.time_zone=UTC
        
        ```
        
    - Ou, diretamente no `persistence.xml`:
        
        ```xml
        <property name="hibernate.jdbc.time_zone" value="UTC"/>
        
        ```
        
    - Assim, garante-se consistência de horários.

> Sugestão de tópico relacionado:
> 
> - Como lidar com conversão de fuso horário entre servidor de aplicação e banco de dados

---

### 7.4. Cuidado com datas “truncadas” quando usar `TemporalType.DATE`

- Ao usar `@Temporal(TemporalType.DATE)`, toda informação de hora é **descartada** (zerada).
- Exemplo:
    
    ```java
    Date now = new Date(); // Contém data + hora
    // Salvar em uma coluna DATE → ao recuperar, hora será 00:00:00.000
    entity.setDataCriacao(now);
    em.persist(entity);
    
    ```
    
- Se você precisar tanto da data quanto da hora para um campo, **sempre** use `TemporalType.TIMESTAMP`.

> Sugestão de tópico relacionado:
> 
> - Estratégias para armazenar apenas dia/mês/ano sem alterar a hora original (usar `LocalDate` vs. `@Temporal`)

---

## 8. Exemplos Completos

A seguir, apresentamos um exemplo de aplicação JPA que engloba os principais pontos explicados: uso de `@Temporal`, comparativo com `java.time.*`, configuração de DDL e persistência de dados.

---

### 8.1. Projeto Exemplo: Gerenciamento de Tarefas com Datas

Suponha que queremos modelar um sistema simples de **Tarefas**. Cada tarefa terá:

- **id** (chave primária)
- **título** (texto)
- **dataCriacao** (apenas data)
- **horaAlerta** (apenas hora)
- **dataHoraConclusao** (data + hora)
- **dataHoraEvento** (usando `java.time.LocalDateTime`)

### 8.1.1. `persistence.xml` (configuração JPA)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="http://xmlns.jcp.org/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/persistence
                                 http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd"
             version="2.2">

    <persistence-unit name="tarefasPU" transaction-type="RESOURCE_LOCAL">
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>

        <!-- Escaneia as classes de entidade -->
        <class>com.exemplo.tarefas.Tarefa</class>

        <properties>
            <!-- Configurações de conexão (exemplo H2) -->
            <property name="javax.persistence.jdbc.driver" value="org.h2.Driver"/>
            <property name="javax.persistence.jdbc.url" value="jdbc:h2:mem:tarefasdb;DB_CLOSE_DELAY=-1"/>
            <property name="javax.persistence.jdbc.user" value="sa"/>
            <property name="javax.persistence.jdbc.password" value=""/>

            <!-- Hibernate como provedor JPA -->
            <property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>

            <!-- Gera/atualiza automaticamente o schema -->
            <property name="hibernate.hbm2ddl.auto" value="update"/>

            <!-- Força uso de UTC na conexão JDBC -->
            <property name="hibernate.jdbc.time_zone" value="UTC"/>
        </properties>
    </persistence-unit>
</persistence>

```

---

### 8.1.2. Entidade `Tarefa`

```java
package com.exemplo.tarefas;

import javax.persistence.*;
import java.util.Calendar;
import java.util.Date;
import java.time.LocalDateTime;

@Entity
@Table(name = "tarefa")
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String titulo;

    // Somente data (ano, mês, dia)
    @Temporal(TemporalType.DATE)
    @Column(name = "data_criacao", nullable = false)
    private Date dataCriacao;

    // Somente hora (hora, minuto, segundo)
    @Temporal(TemporalType.TIME)
    @Column(name = "hora_alerta")
    private Date horaAlerta;

    // Data e hora completos
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "data_hora_conclusao")
    private Date dataHoraConclusao;

    // Usando java.time.LocalDateTime (sem @Temporal)
    @Column(name = "data_hora_evento")
    private LocalDateTime dataHoraEvento;

    // Exemplo extra: Calendar (pode conter fuso, mas mapearemos como TIMESTAMP)
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "data_agendada_calendar")
    private Calendar dataAgendadaCalendar;

    // Construtores, getters e setters
    public Tarefa() {
    }

    public Tarefa(String titulo) {
        this.titulo = titulo;
        this.dataCriacao = new Date(); // data de hoje
    }

    // Getters e setters completos omitidos para brevidade
    // ...
}

```

> Comentários sobre o código acima:
> 
> 1. `dataCriacao` é mapeada apenas com **data**, perdendo informação de hora.
> 2. `horaAlerta` armazena apenas hora (segundo zero).
> 3. `dataHoraConclusao` armazena data + hora completos.
> 4. `dataHoraEvento` é do tipo `LocalDateTime` (não precisa de `@Temporal`), JPA 2.2+ mapeia automaticamente para `TIMESTAMP`.
> 5. `dataAgendadaCalendar` mostra que podemos usar `Calendar` igualmente.

---

### 8.1.3. Classe de Teste (`Main`) para Persistir Dados

```java
package com.exemplo.tarefas;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;

public class Main {
    public static void main(String[] args) {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("tarefasPU");
        EntityManager em = emf.createEntityManager();

        em.getTransaction().begin();

        // Exemplo 1: usar Date + @Temporal(DATE)
        Tarefa t1 = new Tarefa("Comprar mantimentos");
        // t1.getDataCriacao() já foi inicializada no construtor
        // Definindo hora de alerta apenas com hora
        Calendar calAlerta = Calendar.getInstance();
        calAlerta.set(Calendar.HOUR_OF_DAY, 15);
        calAlerta.set(Calendar.MINUTE, 30);
        calAlerta.set(Calendar.SECOND, 0);
        t1.setHoraAlerta(calAlerta.getTime());

        // Definindo data + hora de conclusão
        t1.setDataHoraConclusao(new Date()); // gravará TIMESTAMP agora

        // Definindo dataHoraEvento com java.time.LocalDateTime
        t1.setDataHoraEvento(LocalDateTime.of(2025, 9, 27, 10, 0));

        // Exemplo 2: usar Calendar + @Temporal(TIMESTAMP)
        Tarefa t2 = new Tarefa("Reunião de planejamento");
        Calendar calEvento = Calendar.getInstance();
        calEvento.set(2025, Calendar.NOVEMBER, 28, 14, 45, 0);
        t2.setDataAgendadaCalendar(calEvento);

        em.persist(t1);
        em.persist(t2);

        em.getTransaction().commit();

        // Consulta para verificar dados
        TypedQuery<Tarefa> query = em.createQuery("SELECT t FROM Tarefa t", Tarefa.class);
        for (Tarefa tarefa : query.getResultList()) {
            System.out.println("Tarefa ID: " + tarefa.getId());
            System.out.println("Título: " + tarefa.getTitulo());
            System.out.println("dataCriacao (DATE): " + tarefa.getDataCriacao());
            System.out.println("horaAlerta (TIME): " + tarefa.getHoraAlerta());
            System.out.println("dataHoraConclusao (TIMESTAMP): " + tarefa.getDataHoraConclusao());
            System.out.println("dataHoraEvento (LocalDateTime): " + tarefa.getDataHoraEvento());
            System.out.println("dataAgendadaCalendar (TIMESTAMP): " + tarefa.getDataAgendadaCalendar().getTime());
            System.out.println("-------------------------------------");
        }

        em.close();
        emf.close();
    }
}

```

> Resultados esperados (H2 Console / Log):
> 
> 
> Ao inspecionar a tabela gerada pelo Hibernate, você verá colunas semelhantes a:
> 
> ```sql
> CREATE TABLE tarefa (
>   id BIGINT AUTO_INCREMENT PRIMARY KEY,
>   titulo VARCHAR(100) NOT NULL,
>   data_criacao DATE NOT NULL,
>   hora_alerta TIME,
>   data_hora_conclusao TIMESTAMP,
>   data_hora_evento TIMESTAMP,
>   data_agendada_calendar TIMESTAMP
> );
> 
> ```
> 
> E, ao imprimir no console, cada `System.out.println` exibirá as datas/hora conforme armazenadas.
> 

---

### 8.2. Considerações sobre DDL e Dialetos

1. **H2 (em memória)**
    - Gera colunas conforme exemplificado acima.
2. **PostgreSQL**
    - `DATE`, `TIME`, `TIMESTAMP WITHOUT TIME ZONE`.
    - Se quiser `TIMESTAMP WITH TIME ZONE`, use `columnDefinition = "TIMESTAMP WITH TIME ZONE"`.
3. **MySQL**
    - `DATE`, `TIME`, `TIMESTAMP` (equivalente a `DATETIME`).
4. **Oracle**
    - `DATE` (que já armazena data + hora).
    - Para armazenar apenas hora ou data, geralmente define-se `DATE` ou `TIMESTAMP`, mas atente-se às diferenças no Dialeto.

> Sugestão de tópico relacionado:
> 
> - Configurações específicas de Dialeto no Hibernate para cada banco relacional

---

## 9. Conclusão e Próximos Passos

O mapeamento de tipos de data/hora com `@Temporal` no JPA é essencial quando se trabalha com as classes legadas do Java (`java.util.Date`, `java.util.Calendar`). Com ele, você define de forma explícita se deseja armazenar somente data, somente hora, ou data + hora no seu banco de dados. No entanto, com a evolução do Java (JSR-310) e das especificações JPA mais recentes, recomenda-se migrar para classes do pacote `java.time.*`, que oferecem mais segurança (imutabilidade) e clareza sem a necessidade de usar `@Temporal`.

### Próximos tópicos recomendados para aprofundar:

1. **Uso de `AttributeConverter` para transformar `java.util.Date` em `LocalDateTime`**
2. **Conversores automáticos de fuso horário no Hibernate**
3. **Anotações de auditoria (`@CreationTimestamp`, `@UpdateTimestamp`) no Hibernate**
4. **Boas práticas na modelagem de dados temporais em bancos relacionais (por exemplo, UTC vs. horário local)**
5. **Mapeamento de intervalos de tempo ou durações (por exemplo, usando `java.time.Duration`)**

---

**Fim da explicação completa sobre “Mapeamento de Colunas: Mapeamento de Tipos de Data/Hora (@Temporal)” em JPA no Java.**