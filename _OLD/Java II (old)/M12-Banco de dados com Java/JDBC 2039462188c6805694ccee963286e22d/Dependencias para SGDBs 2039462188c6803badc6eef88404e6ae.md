# Dependencias para SGDBs

Olá, Gedê\! Como vai?

Com certeza, posso te ajudar com uma explicação detalhada sobre a adição de dependências JDBC no `pom.xml` para diferentes bancos de dados. Como um desenvolvedor Backend Java que está migrando para Go, entender a base do JDBC é fundamental, e o Maven facilita muito a gestão dessas dependências.

---

## 1\. Introdução

O JDBC (Java Database Connectivity) é uma API padrão do Java para conexão e interação com bancos de dados. Ele oferece um conjunto de classes e interfaces que permitem aos desenvolvedores Java escrever código que se conecta a praticamente qualquer banco de dados relacional. A beleza do JDBC reside em sua abstração: uma vez que você aprende a usar a API, o código para interagir com um banco de dados PostgreSQL é muito semelhante ao código para interagir com um MySQL, SQL Server ou H2, por exemplo.

No contexto do desenvolvimento Java, especialmente com o uso de ferramentas como o Maven, gerenciar as dependências para os drivers JDBC é crucial. Os drivers são implementações específicas da API JDBC fornecidas pelos fabricantes de banco de dados, que permitem que a aplicação Java se comunique com aquele banco de dados em particular. Sem o driver correto, sua aplicação não conseguirá estabelecer a conexão.

O `pom.xml` (Project Object Model) é o arquivo central de configuração em projetos Maven. Ele descreve o projeto e suas dependências, entre outras coisas. Adicionar as dependências dos drivers JDBC ao `pom.xml` é a maneira padrão e mais eficiente de garantir que o Maven baixe e inclua os arquivos JAR necessários (que contêm os drivers) no seu projeto, tornando-os disponíveis no classpath da sua aplicação. Isso elimina a necessidade de gerenciar manualmente os arquivos JAR, garantindo que as versões corretas sejam usadas e facilitando a colaboração e o build do projeto.

---

## 2\. Sumário

Este documento abordará os seguintes tópicos:

- **O que é JDBC e `pom.xml`:** Entendimento fundamental.
- **Adição de Dependências Maven:**
    - Sintaxe básica de dependências no `pom.xml`.
    - PostgreSQL.
    - MySQL (Connector/J).
    - H2 Database (para testes/memória).
    - SQL Server.
- **Componentes Principais de uma Dependência Maven:**
    - `groupId`.
    - `artifactId`.
    - `version`.
- **Exemplos de Código Otimizados:**
    - Configuração completa do `pom.xml` com drivers.
    - Exemplo de conexão JDBC básica para cada banco de dados.
- **Informações Adicionais:**
    - Gerenciamento de versões dos drivers.
    - Drivers thin vs. thick.
    - Considerações de segurança ao gerenciar dependências.
    - Pool de conexões.
- **Referências para Estudo Independente.**

---

## 3\. Conteúdo Detalhado

### O que é JDBC e `pom.xml`

**JDBC (Java Database Connectivity):** Como mencionado, é a API padrão do Java para comunicação com bancos de dados relacionais. Ela define interfaces e classes para tarefas como estabelecer uma conexão com o banco de dados, enviar comandos SQL, processar resultados e gerenciar transações. O JDBC é a ponte entre sua aplicação Java e o sistema de gerenciamento de banco de dados (SGBD).

**`pom.xml` (Project Object Model):** É o coração de um projeto Maven. É um arquivo XML que contém informações sobre o projeto e detalhes de configuração usados pelo Maven para construir o projeto. Isso inclui as dependências (bibliotecas que o projeto precisa), plugins, repositórios, informações do projeto (nome, versão, etc.) e muito mais. O `pom.xml` é crucial para a padronização do processo de build e para a gestão eficiente das bibliotecas externas.

### Adição de Dependências Maven

A estrutura básica para adicionar uma dependência no `pom.xml` é a seguinte:

```xml
<dependencies>
    <dependency>
        <groupId>com.example</groupId>
        <artifactId>my-library</artifactId>
        <version>1.0.0</version>
    </dependency>
</dependencies>

```

Cada driver JDBC possui seu próprio `groupId`, `artifactId` e `version` específicos. É fundamental utilizar a versão mais recente e estável compatível com a versão do seu banco de dados e do seu projeto Java.

### PostgreSQL

O driver JDBC para PostgreSQL é conhecido como PostgreSQL JDBC Driver ou pgJDBC. Ele permite que aplicações Java se conectem a bancos de dados PostgreSQL.

- `groupId`: `org.postgresql`
- `artifactId`: `postgresql`
- `version`: A versão mais recente disponível (ex: `42.7.3`).

<!-- end list -->

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.3</version>
</dependency>

```

### MySQL (Connector/J)

O driver oficial para MySQL é o MySQL Connector/J. É a implementação JDBC para a conexão com o servidor MySQL.

- `groupId`: `mysql`
- `artifactId`: `mysql-connector-java`
- `version`: A versão mais recente disponível (ex: `8.0.33`).

<!-- end list -->

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency>

```

*Observação:* Para versões mais recentes do MySQL Connector/J (a partir da 8.0.x), o `groupId` é `com.mysql` e o `artifactId` permanece `mysql-connector-java`. É bom verificar a documentação oficial para a versão exata que você pretende usar. A versão `8.0.33` ainda utiliza `mysql` como `groupId`, mas é uma boa prática estar ciente dessa possível mudança.

### H2 Database (para testes/memória)

O H2 é um banco de dados relacional de código aberto escrito em Java. Ele pode ser executado em modo embarcado (dentro da JVM da aplicação) ou em modo servidor. É frequentemente usado para testes ou como banco de dados em memória, pois é leve e não requer uma instalação separada.

- `groupId`: `com.h2database`
- `artifactId`: `h2`
- `version`: A versão mais recente disponível (ex: `2.2.224`).

<!-- end list -->

```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <version>2.2.224</version>
</dependency>

```

*Observação:* Para o H2, é comum adicionar a tag `<scope>test</scope>` se você pretende usá-lo apenas para testes unitários ou de integração, garantindo que o driver não seja empacotado no JAR final da sua aplicação em produção.

```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <version>2.2.224</version>
    <scope>test</scope>
</dependency>

```

### SQL Server

O driver JDBC para Microsoft SQL Server é o Microsoft JDBC Driver for SQL Server.

- `groupId`: `com.microsoft.sqlserver`
- `artifactId`: `mssql-jdbc`
- `version`: A versão mais recente disponível (ex: `12.6.0.jre11`).

<!-- end list -->

```xml
<dependency>
    <groupId>com.microsoft.sqlserver</groupId>
    <artifactId>mssql-jdbc</artifactId>
    <version>12.6.0.jre11</version>
</dependency>

```

*Observação:* A parte `.jre11` na versão indica que este driver é compilado para Java 11. Certifique-se de escolher a versão do driver que corresponde à sua versão do JRE/JDK.

### Componentes Principais de uma Dependência Maven

Cada `<dependency>` no `pom.xml` possui três elementos principais que identificam unicamente a biblioteca:

- **`<groupId>`:** Identifica a organização ou grupo que criou o projeto. Geralmente segue o padrão de nome de domínio reverso (ex: `org.postgresql`, `com.mysql`).
- **`<artifactId>`:** Identifica o nome do projeto ou módulo específico dentro do `groupId`.
- **`<version>`:** Especifica a versão exata da dependência que você deseja usar. É crucial especificar uma versão estável para evitar problemas de compatibilidade.

A combinação desses três elementos (`groupId:artifactId:version`) é o que o Maven usa para localizar e baixar o JAR correto do repositório Maven (central ou configurado).

---

## 4\. Exemplos de Código Otimizados

### Configuração Completa do `pom.xml` com Drivers JDBC

Aqui está um exemplo de um `pom.xml` básico com as dependências dos drivers JDBC que discutimos. Lembre-se de substituir as versões pelas mais recentes ou pelas que são compatíveis com seu ambiente.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="<http://maven.apache.org/POM/4.0.0>"
         xmlns:xsi="<http://www.w3.org/2001/XMLSchema-instance>"
         xsi:schemaLocation="<http://maven.apache.org/POM/4.0.0> <http://maven.apache.org/xsd/maven-4.0.0.xsd>">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.gededev</groupId>
    <artifactId>jdbc-examples</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <postgresql.version>42.7.3</postgresql.version>
        <mysql.version>8.0.33</mysql.version>
        <h2.version>2.2.224</h2.version>
        <sqlserver.version>12.6.0.jre11</sqlserver.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <version>${postgresql.version}</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>${mysql.version}</version>
        </dependency>

        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <version>${h2.version}</version>
            <scope>runtime</scope>
        </dependency>

        <dependency>
            <groupId>com.microsoft.sqlserver</groupId>
            <artifactId>mssql-jdbc</artifactId>
            <version>${sqlserver.version}</version>
        </dependency>

        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>2.0.7</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>1.4.11</version>
            <scope>runtime</scope>
        </dependency>
    </dependencies>

</project>

```

### Exemplo de Conexão JDBC Básica

Para cada banco de dados, a lógica de conexão JDBC é muito semelhante, mudando principalmente a URL de conexão e, em alguns casos, o driver a ser carregado (embora a partir do JDBC 4.0, o carregamento explícito do driver via `Class.forName()` seja geralmente desnecessário, pois os drivers são automaticamente detectados via Service Provider Interface - SPI).

**Melhores Práticas para Conexão JDBC:**

- **`try-with-resources`:** Use o `try-with-resources` para garantir que `Connection`, `Statement` e `ResultSet` sejam fechados automaticamente, mesmo em caso de exceções. Isso previne vazamentos de recursos.
- **Prepared Statements:** Sempre use `PreparedStatement` para queries com parâmetros para prevenir ataques de injeção SQL e melhorar a performance.
- **Logging:** Use uma biblioteca de logging (como SLF4J + Logback/Log4j) em vez de `System.out.println` para mensagens informativas e erros.

### 1\. Conexão PostgreSQL

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.ResultSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PostgresJdbcExample {

    private static final Logger logger = LoggerFactory.getLogger(PostgresJdbcExample.class);

    private static final String JDBC_URL = "jdbc:postgresql://localhost:5432/mydatabase";
    private static final String USER = "myuser";
    private static final String PASSWORD = "mypassword";

    public static void main(String[] args) {
        // Carregamento explícito do driver não é necessário para JDBC 4.0+, mas pode ser usado para versões mais antigas
        // try {
        //     Class.forName("org.postgresql.Driver");
        // } catch (ClassNotFoundException e) {
        //     logger.error("Driver PostgreSQL não encontrado!", e);
        //     return;
        // }

        try (Connection connection = DriverManager.getConnection(JDBC_URL, USER, PASSWORD);
             Statement statement = connection.createStatement()) {

            logger.info("Conectado ao PostgreSQL com sucesso!");

            // Exemplo: Criar uma tabela
            String createTableSQL = "CREATE TABLE IF NOT EXISTS users (" +
                                    "id SERIAL PRIMARY KEY," +
                                    "name VARCHAR(100) NOT NULL," +
                                    "email VARCHAR(100) UNIQUE NOT NULL)";
            statement.execute(createTableSQL);
            logger.info("Tabela 'users' criada ou já existente.");

            // Exemplo: Inserir dados
            String insertSQL = "INSERT INTO users (name, email) VALUES ('Gedê', 'gede@example.com') ON CONFLICT (email) DO NOTHING;";
            int rowsAffected = statement.executeUpdate(insertSQL);
            if (rowsAffected > 0) {
                logger.info("Usuário 'Gedê' inserido.");
            } else {
                logger.info("Usuário 'Gedê' já existe.");
            }

            // Exemplo: Consultar dados
            ResultSet resultSet = statement.executeQuery("SELECT id, name, email FROM users");
            logger.info("Dados da tabela 'users':");
            while (resultSet.next()) {
                logger.info("ID: {}, Nome: {}, Email: {}",
                            resultSet.getInt("id"),
                            resultSet.getString("name"),
                            resultSet.getString("email"));
            }

        } catch (SQLException e) {
            logger.error("Erro ao conectar ou interagir com o PostgreSQL", e);
        }
    }
}

```

### 2\. Conexão MySQL

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.ResultSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MySqlJdbcExample {

    private static final Logger logger = LoggerFactory.getLogger(MySqlJdbcExample.class);

    // Para MySQL 8.x, o TimeZone é frequentemente um problema. Adicionar 'serverTimezone=UTC' é uma boa prática.
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/mydatabase?serverTimezone=UTC";
    private static final String USER = "myuser";
    private static final String PASSWORD = "mypassword";

    public static void main(String[] args) {
        // Carregamento explícito do driver (opcional para JDBC 4.0+)
        // try {
        //     Class.forName("com.mysql.cj.jdbc.Driver"); // Para MySQL Connector/J 8.x
        // } catch (ClassNotFoundException e) {
        //     logger.error("Driver MySQL não encontrado!", e);
        //     return;
        // }

        try (Connection connection = DriverManager.getConnection(JDBC_URL, USER, PASSWORD);
             Statement statement = connection.createStatement()) {

            logger.info("Conectado ao MySQL com sucesso!");

            // Exemplo: Criar uma tabela
            String createTableSQL = "CREATE TABLE IF NOT EXISTS products (" +
                                    "id INT AUTO_INCREMENT PRIMARY KEY," +
                                    "name VARCHAR(255) NOT NULL," +
                                    "price DECIMAL(10, 2) NOT NULL)";
            statement.execute(createTableSQL);
            logger.info("Tabela 'products' criada ou já existente.");

            // Exemplo: Inserir dados
            String insertSQL = "INSERT IGNORE INTO products (name, price) VALUES ('Smartphone', 1500.00)";
            int rowsAffected = statement.executeUpdate(insertSQL);
            if (rowsAffected > 0) {
                logger.info("Produto 'Smartphone' inserido.");
            } else {
                logger.info("Produto 'Smartphone' já existe (ou conflito de chave única).");
            }

            // Exemplo: Consultar dados
            ResultSet resultSet = statement.executeQuery("SELECT id, name, price FROM products");
            logger.info("Dados da tabela 'products':");
            while (resultSet.next()) {
                logger.info("ID: {}, Nome: {}, Preço: {}",
                            resultSet.getInt("id"),
                            resultSet.getString("name"),
                            resultSet.getDouble("price"));
            }

        } catch (SQLException e) {
            logger.error("Erro ao conectar ou interagir com o MySQL", e);
        }
    }
}

```

### 3\. Conexão H2 Database (em memória)

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.ResultSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class H2JdbcExample {

    private static final Logger logger = LoggerFactory.getLogger(H2JdbcExample.class);

    // URL para banco de dados H2 em memória. MEM_TEST é o nome do banco.
    // Para persistência, use "jdbc:h2:~/testdb" (cria um arquivo no diretório home do usuário)
    private static final String JDBC_URL = "jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1"; // -1 mantém o DB aberto enquanto a JVM estiver ativa
    private static final String USER = "sa";
    private static final String PASSWORD = ""; // H2 geralmente não tem senha por padrão

    public static void main(String[] args) {
        try (Connection connection = DriverManager.getConnection(JDBC_URL, USER, PASSWORD);
             Statement statement = connection.createStatement()) {

            logger.info("Conectado ao H2 Database (em memória) com sucesso!");

            // Exemplo: Criar uma tabela
            String createTableSQL = "CREATE TABLE IF NOT EXISTS items (" +
                                    "id INT AUTO_INCREMENT PRIMARY KEY," +
                                    "description VARCHAR(255) NOT NULL," +
                                    "quantity INT NOT NULL)";
            statement.execute(createTableSQL);
            logger.info("Tabela 'items' criada ou já existente.");

            // Exemplo: Inserir dados
            String insertSQL = "INSERT INTO items (description, quantity) VALUES ('Caneta', 100)";
            statement.executeUpdate(insertSQL);
            logger.info("Item 'Caneta' inserido.");

            // Exemplo: Consultar dados
            ResultSet resultSet = statement.executeQuery("SELECT id, description, quantity FROM items");
            logger.info("Dados da tabela 'items':");
            while (resultSet.next()) {
                logger.info("ID: {}, Descrição: {}, Quantidade: {}",
                            resultSet.getInt("id"),
                            resultSet.getString("description"),
                            resultSet.getInt("quantity"));
            }

        } catch (SQLException e) {
            logger.error("Erro ao conectar ou interagir com o H2 Database", e);
        }
    }
}

```

### 4\. Conexão SQL Server

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.ResultSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SqlServerJdbcExample {

    private static final Logger logger = LoggerFactory.getLogger(SqlServerJdbcExample.class);

    private static final String JDBC_URL = "jdbc:sqlserver://localhost:1433;databaseName=mydatabase;encrypt=false;trustServerCertificate=true";
    private static final String USER = "myuser";
    private static final String PASSWORD = "mypassword";

    public static void main(String[] args) {
        // Carregamento explícito do driver (opcional para JDBC 4.0+)
        // try {
        //     Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        // } catch (ClassNotFoundException e) {
        //     logger.error("Driver SQL Server não encontrado!", e);
        //     return;
        // }

        try (Connection connection = DriverManager.getConnection(JDBC_URL, USER, PASSWORD);
             Statement statement = connection.createStatement()) {

            logger.info("Conectado ao SQL Server com sucesso!");

            // Exemplo: Criar uma tabela
            String createTableSQL = "IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='employees' and xtype='U') " +
                                    "CREATE TABLE employees (" +
                                    "id INT IDENTITY(1,1) PRIMARY KEY," +
                                    "first_name VARCHAR(100) NOT NULL," +
                                    "last_name VARCHAR(100) NOT NULL)";
            statement.execute(createTableSQL);
            logger.info("Tabela 'employees' criada ou já existente.");

            // Exemplo: Inserir dados
            String insertSQL = "INSERT INTO employees (first_name, last_name) SELECT 'Ju', 'Miranda' WHERE NOT EXISTS (SELECT 1 FROM employees WHERE first_name = 'Ju' AND last_name = 'Miranda')";
            int rowsAffected = statement.executeUpdate(insertSQL);
            if (rowsAffected > 0) {
                logger.info("Funcionário 'Ju Miranda' inserido.");
            } else {
                logger.info("Funcionário 'Ju Miranda' já existe.");
            }

            // Exemplo: Consultar dados
            ResultSet resultSet = statement.executeQuery("SELECT id, first_name, last_name FROM employees");
            logger.info("Dados da tabela 'employees':");
            while (resultSet.next()) {
                logger.info("ID: {}, Nome: {}, Sobrenome: {}",
                            resultSet.getInt("id"),
                            resultSet.getString("first_name"),
                            resultSet.getString("last_name"));
            }

        } catch (SQLException e) {
            logger.error("Erro ao conectar ou interagir com o SQL Server", e);
        }
    }
}

```

---

## 5\. Informações Adicionais

### Gerenciamento de Versões dos Drivers

Manter as versões dos drivers JDBC atualizadas é fundamental para garantir compatibilidade com as últimas versões dos bancos de dados, obter melhorias de performance, e aplicar correções de segurança. No `pom.xml`, o uso de propriedades (como `<postgresql.version>`) é uma ótima prática para centralizar e facilitar a gestão das versões de dependências, permitindo que você as atualize em um único local.

Além disso, ao escolher a versão de um driver, sempre consulte a documentação oficial do fabricante do banco de dados para garantir a compatibilidade com a versão do seu SGBD e com a versão do Java (JRE/JDK) que você está utilizando. Alguns drivers, como o do SQL Server, especificam a versão do JRE compatível diretamente no nome da versão (ex: `.jre11`).

### Drivers Thin vs. Thick

Essa distinção era mais comum em versões mais antigas do JDBC, mas ainda pode ser relevante para alguns contextos:

- **Thin Driver (Tipo 4):** São drivers 100% Java e se conectam diretamente ao banco de dados via socket, sem a necessidade de software intermediário. São os mais comuns e preferidos hoje em dia, pois são mais flexíveis e não dependem de bibliotecas nativas. Os drivers que adicionamos (PostgreSQL, MySQL, H2, SQL Server) são todos drivers thin.
- **Thick Driver (Tipo 2):** Também conhecidos como drivers "nativo-API", utilizam bibliotecas nativas do SGBD no lado do cliente. Isso os torna dependentes da plataforma e mais complexos de implantar, pois exigem a instalação dessas bibliotecas nativas. São raramente usados em novas aplicações.

### Considerações de Segurança ao Gerenciar Dependências

- **Vulnerabilidades:** Sempre use versões atualizadas e estáveis das dependências. Versões antigas podem conter vulnerabilidades de segurança conhecidas. Ferramentas como o OWASP Dependency-Check podem ser integradas ao seu pipeline CI/CD para escanear seu projeto em busca de dependências com vulnerabilidades.
- **Repositórios Confiáveis:** Baixe dependências apenas de repositórios Maven confiáveis (como o Maven Central).
- **Credenciais:** Nunca coloque credenciais de banco de dados (usuário/senha) diretamente no código-fonte. Use variáveis de ambiente, serviços de configuração (como Spring Cloud Config, HashiCorp Vault) ou arquivos de propriedades externos configuráveis para gerenciar essas informações de forma segura.

### Pool de Conexões

Para aplicações que precisam de alta performance e escalabilidade, como aplicações web ou microsserviços, o uso de um pool de conexões JDBC é essencial. Abrir e fechar uma conexão com o banco de dados é uma operação custosa em termos de tempo e recursos. Um pool de conexões reutiliza conexões existentes, mantendo um conjunto de conexões abertas e prontas para serem usadas.

Bibliotecas populares para pooling de conexões incluem:

- **HikariCP:** Conhecido por ser o pool de conexões mais rápido. É o padrão em frameworks como Spring Boot.
- **c3p0:** Um pool de conexões robusto e configurável.
- **Apache Commons DBCP2:** Outra opção popular de pooling de conexões.

A integração de um pool de conexões geralmente envolve adicionar sua dependência ao `pom.xml` e configurar o `DataSource` na sua aplicação para usar o pool em vez de `DriverManager` diretamente.

```xml
<dependency>
    <groupId>com.zaxxer</groupId>
    <artifactId>HikariCP</artifactId>
    <version>5.1.0</version>
</dependency>

```

---

## 6\. Referências para Estudo Independente

Para aprofundar seus conhecimentos, Gedê, sugiro os seguintes recursos confiáveis:

- **Documentação Oficial do JDBC (Oracle):**
    - [Java SE JDBC Documentation](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/index.html) (Mesmo sendo para Java 8, os conceitos fundamentais são os mesmos para versões mais recentes).
    - [JDBC Basics](https://docs.oracle.com/javase/tutorial/jdbc/basics/index.html)
- **Maven Documentation:**
    - [Introduction to the POM](https://maven.apache.org/guides/introduction/introduction-to-the-pom.html)
    - [Introduction to Dependency Mechanism](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html)
- **Drivers JDBC Oficiais:**
    - **PostgreSQL JDBC Driver:** [Official Website](https://jdbc.postgresql.org/)
    - **MySQL Connector/J:** [Official Download Page](https://dev.mysql.com/downloads/connector/j/)
    - **H2 Database:** [Official Website](http://www.h2database.com/html/main.html)
    - **Microsoft JDBC Driver for SQL Server:** [Official Documentation](https://learn.microsoft.com/en-us/sql/connect/jdbc/microsoft-jdbc-driver-for-sql-server?view=sql-server-ver16)
- **Artigos e Tutoriais:**
    - **Baeldung - JDBC Tutorial:** [Baeldung - Guide to JDBC](https://www.baeldung.com/java-jdbc) (Excelente recurso para tutoriais Java).
    - **OpenWebs - JDBC Tutorial:** [OpenWebs - JDBC Tutorial](https://www.tutorialspoint.com/jdbc/index.htm)
- **Livros Recomendados:**
    - "Head First Java" (Kathy Sierra, Bert Bates): Ótimo para entender os fundamentos do Java, incluindo JDBC, de forma divertida.
    - "Java Persistence with Hibernate" (Christian Bauer, Gavin King): Embora seja sobre Hibernate, aborda o JDBC subjacente e conceitos de persistência de dados.

Espero que esta explicação detalhada seja muito útil para você em sua jornada como desenvolvedor\! Se tiver mais alguma dúvida, é só chamar a A.R.I.A\!